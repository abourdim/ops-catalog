#!/usr/bin/env python3
"""
Pi Radio Recorder
SDR-based radio recording station using RTL-SDR.
Records IQ data or demodulated audio on schedule or trigger.
"""

import os
import time
import json
import subprocess
import logging
import threading
from datetime import datetime
from pathlib import Path

try:
    from rtlsdr import RtlSdr
except ImportError:
    RtlSdr = None

import numpy as np
from flask import Flask, jsonify, request, render_template_string, send_from_directory

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("radio-recorder")

app = Flask(__name__)

RECORDINGS_DIR = Path("/var/lib/radio-recorder")
RECORDINGS_DIR.mkdir(parents=True, exist_ok=True)

CONFIG = {
    "center_freq": 145.5e6,
    "sample_rate": 2.4e6,
    "gain": 40,
    "squelch_level": -30,  # dBFS
    "record_format": "wav",  # wav, iq, raw
}


class RadioRecorder:
    """SDR-based radio recording engine."""

    def __init__(self):
        self.sdr = None
        self.recording = False
        self.scheduled_recordings = []
        self.completed_recordings = []
        self.current_power_db = -100
        self.lock = threading.Lock()

    def init_sdr(self):
        """Initialize RTL-SDR device."""
        if RtlSdr is None:
            logger.warning("rtlsdr library not available")
            return False
        try:
            self.sdr = RtlSdr()
            self.sdr.center_freq = CONFIG["center_freq"]
            self.sdr.sample_rate = CONFIG["sample_rate"]
            self.sdr.gain = CONFIG["gain"]
            logger.info("SDR initialized: %.3f MHz, %.1f MS/s, gain=%d",
                        CONFIG["center_freq"] / 1e6, CONFIG["sample_rate"] / 1e6, CONFIG["gain"])
            return True
        except Exception as e:
            logger.error("SDR init failed: %s", e)
            return False

    def measure_power(self, samples=None):
        """Measure signal power in dBFS."""
        if samples is None and self.sdr:
            try:
                samples = self.sdr.read_samples(1024)
            except Exception:
                return -100

        if samples is not None and len(samples) > 0:
            power = np.mean(np.abs(samples) ** 2)
            if power > 0:
                self.current_power_db = round(10 * np.log10(power), 1)
        return self.current_power_db

    def record_iq(self, duration_sec, filename=None):
        """Record raw IQ samples to file."""
        if not self.sdr:
            return None
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            freq_str = f"{CONFIG['center_freq']/1e6:.3f}MHz"
            filename = f"iq_{freq_str}_{timestamp}.raw"

        filepath = RECORDINGS_DIR / filename
        num_samples = int(CONFIG["sample_rate"] * duration_sec)
        chunk_size = 262144

        with self.lock:
            self.recording = True
            logger.info("Recording IQ: %s (%.1f sec, %d samples)", filename, duration_sec, num_samples)

            try:
                with open(filepath, "wb") as f:
                    collected = 0
                    while collected < num_samples and self.recording:
                        chunk = min(chunk_size, num_samples - collected)
                        samples = self.sdr.read_samples(chunk)
                        # Write interleaved I/Q as float32
                        iq_data = np.empty(len(samples) * 2, dtype=np.float32)
                        iq_data[0::2] = samples.real.astype(np.float32)
                        iq_data[1::2] = samples.imag.astype(np.float32)
                        f.write(iq_data.tobytes())
                        collected += len(samples)
            except Exception as e:
                logger.error("Recording error: %s", e)
            finally:
                self.recording = False

        entry = {
            "file": filename,
            "freq_mhz": CONFIG["center_freq"] / 1e6,
            "duration_sec": duration_sec,
            "sample_rate": CONFIG["sample_rate"],
            "size_bytes": filepath.stat().st_size if filepath.exists() else 0,
            "time": datetime.now().isoformat(),
        }
        self.completed_recordings.append(entry)
        logger.info("Recording complete: %s (%d bytes)", filename, entry["size_bytes"])
        return entry

    def record_audio_fm(self, duration_sec, freq_hz=None):
        """Record FM demodulated audio using rtl_fm."""
        if freq_hz is None:
            freq_hz = int(CONFIG["center_freq"])
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"fm_{freq_hz/1e6:.3f}MHz_{timestamp}.wav"
        filepath = RECORDINGS_DIR / filename

        cmd = [
            "rtl_fm", "-f", str(int(freq_hz)), "-M", "fm",
            "-s", "48000", "-g", str(int(CONFIG["gain"])),
            "-l", "0", "-"
        ]
        sox_cmd = ["sox", "-t", "raw", "-r", "48000", "-e", "signed",
                   "-b", "16", "-c", "1", "-", str(filepath),
                   "trim", "0", str(duration_sec)]

        try:
            self.recording = True
            rtl = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
            sox = subprocess.Popen(sox_cmd, stdin=rtl.stdout, stderr=subprocess.DEVNULL)
            sox.wait(timeout=duration_sec + 10)
            rtl.terminate()
            self.recording = False

            entry = {
                "file": filename,
                "freq_mhz": freq_hz / 1e6,
                "duration_sec": duration_sec,
                "mode": "FM",
                "size_bytes": filepath.stat().st_size if filepath.exists() else 0,
                "time": datetime.now().isoformat(),
            }
            self.completed_recordings.append(entry)
            return entry
        except Exception as e:
            self.recording = False
            logger.error("FM recording failed: %s", e)
            return None

    def stop_recording(self):
        """Stop current recording."""
        self.recording = False

    def schedule_recording(self, start_time, duration_sec, freq_hz=None, mode="iq"):
        """Schedule a future recording."""
        entry = {
            "start_time": start_time,
            "duration_sec": duration_sec,
            "freq_hz": freq_hz or CONFIG["center_freq"],
            "mode": mode,
            "status": "scheduled",
        }
        self.scheduled_recordings.append(entry)
        return entry

    def list_recordings(self):
        """List all recording files."""
        files = []
        for f in sorted(RECORDINGS_DIR.iterdir(), reverse=True):
            if f.is_file():
                files.append({
                    "name": f.name,
                    "size_mb": round(f.stat().st_size / (1024 * 1024), 2),
                    "modified": datetime.fromtimestamp(f.stat().st_mtime).isoformat(),
                })
        return files

    def get_status(self):
        return {
            "recording": self.recording,
            "sdr_available": self.sdr is not None,
            "center_freq_mhz": CONFIG["center_freq"] / 1e6,
            "sample_rate_msps": CONFIG["sample_rate"] / 1e6,
            "gain": CONFIG["gain"],
            "signal_power_db": self.current_power_db,
            "total_recordings": len(self.completed_recordings),
            "scheduled": self.scheduled_recordings,
            "recent": self.completed_recordings[-5:],
        }


recorder = RadioRecorder()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi Radio Recorder</title></head><body>
    <h1>Radio Recorder</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),2000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(recorder.get_status())

@app.route("/api/record/iq", methods=["POST"])
def api_record_iq():
    d = request.json or {}
    threading.Thread(target=recorder.record_iq, args=(d.get("duration", 10),), daemon=True).start()
    return jsonify({"started": True})

@app.route("/api/record/fm", methods=["POST"])
def api_record_fm():
    d = request.json or {}
    threading.Thread(target=recorder.record_audio_fm,
                     args=(d.get("duration", 10), d.get("freq")), daemon=True).start()
    return jsonify({"started": True})

@app.route("/api/stop", methods=["POST"])
def api_stop():
    recorder.stop_recording()
    return jsonify({"stopped": True})

@app.route("/api/recordings")
def api_recordings():
    return jsonify({"files": recorder.list_recordings()})

@app.route("/recordings/<filename>")
def serve_recording(filename):
    return send_from_directory(str(RECORDINGS_DIR), filename)


if __name__ == "__main__":
    recorder.init_sdr()
    logger.info("Starting Radio Recorder on port 8094")
    app.run(host="0.0.0.0", port=8094, debug=False)
