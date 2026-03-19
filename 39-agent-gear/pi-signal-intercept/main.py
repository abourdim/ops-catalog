#!/usr/bin/env python3
"""
Pi Signal Intercept
Wideband signal monitoring and classification system using RTL-SDR.
Detects, logs, and classifies RF transmissions across multiple bands.
"""

import os
import time
import json
import logging
import threading
from datetime import datetime
from pathlib import Path
from collections import defaultdict

try:
    from rtlsdr import RtlSdr
except ImportError:
    RtlSdr = None

import numpy as np

try:
    import RPi.GPIO as GPIO
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()

from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("signal-intercept")

app = Flask(__name__)

LOG_DIR = Path("/var/lib/signal-intercept/logs")
LOG_DIR.mkdir(parents=True, exist_ok=True)

ALERT_LED = 17
SCAN_LED = 27

# Frequency bands to monitor
MONITOR_BANDS = [
    {"name": "VHF Low", "start_mhz": 30, "end_mhz": 88, "step_mhz": 0.025},
    {"name": "FM Broadcast", "start_mhz": 88, "end_mhz": 108, "step_mhz": 0.2},
    {"name": "VHF Air", "start_mhz": 108, "end_mhz": 137, "step_mhz": 0.025},
    {"name": "VHF Marine", "start_mhz": 156, "end_mhz": 163, "step_mhz": 0.025},
    {"name": "UHF", "start_mhz": 400, "end_mhz": 470, "step_mhz": 0.025},
    {"name": "ISM 433", "start_mhz": 432, "end_mhz": 435, "step_mhz": 0.01},
    {"name": "ISM 868", "start_mhz": 863, "end_mhz": 870, "step_mhz": 0.025},
    {"name": "ISM 915", "start_mhz": 902, "end_mhz": 928, "step_mhz": 0.025},
]


class SignalClassifier:
    """Classifies detected signals by modulation type and characteristics."""

    def classify(self, samples, freq_mhz, bandwidth_hz):
        """Classify a detected signal."""
        if len(samples) < 256:
            return "unknown"

        # Compute spectral characteristics
        fft = np.fft.fft(samples)
        power_spectrum = np.abs(fft) ** 2
        peak_to_avg = np.max(power_spectrum) / np.mean(power_spectrum)

        # Instantaneous frequency analysis
        phase = np.angle(samples)
        inst_freq = np.diff(np.unwrap(phase))
        freq_variance = np.var(inst_freq)

        # Amplitude analysis
        envelope = np.abs(samples)
        amp_variance = np.var(envelope) / max(np.mean(envelope) ** 2, 1e-10)

        # Classification rules
        if peak_to_avg > 100 and freq_variance < 0.01:
            return "CW/carrier"
        elif amp_variance < 0.1 and freq_variance > 0.1:
            return "FM"
        elif amp_variance > 0.3 and freq_variance < 0.05:
            return "AM"
        elif freq_variance > 1.0:
            return "wideband/digital"
        elif peak_to_avg > 20:
            return "narrowband"
        else:
            return "unknown"


class SignalInterceptor:
    """Wideband signal monitoring and intercept system."""

    def __init__(self):
        self.sdr = None
        self.scanning = False
        self.detected_signals = []
        self.signal_history = defaultdict(list)
        self.classifier = SignalClassifier()
        self.squelch_db = -35
        self.total_scans = 0
        self._setup_gpio()

    def _setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(ALERT_LED, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(SCAN_LED, GPIO.OUT, initial=GPIO.LOW)

    def init_sdr(self):
        if RtlSdr is None:
            return False
        try:
            self.sdr = RtlSdr()
            self.sdr.sample_rate = 2.4e6
            self.sdr.gain = 40
            return True
        except Exception as e:
            logger.error("SDR init: %s", e)
            return False

    def scan_frequency(self, freq_mhz):
        """Check for signal at a specific frequency."""
        if not self.sdr:
            return None
        try:
            self.sdr.center_freq = freq_mhz * 1e6
            time.sleep(0.03)
            samples = self.sdr.read_samples(4096)
            power = np.mean(np.abs(samples) ** 2)
            power_db = 10 * np.log10(max(power, 1e-15))

            if power_db > self.squelch_db:
                classification = self.classifier.classify(samples, freq_mhz, self.sdr.sample_rate)

                # Estimate signal bandwidth
                fft_mag = np.abs(np.fft.fftshift(np.fft.fft(samples)))
                threshold = np.max(fft_mag) * 0.1
                above = np.where(fft_mag > threshold)[0]
                if len(above) > 1:
                    bw_bins = above[-1] - above[0]
                    bw_hz = bw_bins / len(fft_mag) * self.sdr.sample_rate
                else:
                    bw_hz = 0

                return {
                    "freq_mhz": round(freq_mhz, 4),
                    "power_db": round(power_db, 1),
                    "classification": classification,
                    "bandwidth_khz": round(bw_hz / 1000, 1),
                    "time": datetime.utcnow().isoformat(),
                }
        except Exception:
            pass
        return None

    def scan_band(self, band):
        """Scan an entire frequency band."""
        signals = []
        freq = band["start_mhz"]
        while freq <= band["end_mhz"]:
            result = self.scan_frequency(freq)
            if result:
                result["band"] = band["name"]
                signals.append(result)
                GPIO.output(ALERT_LED, GPIO.HIGH)
                time.sleep(0.05)
                GPIO.output(ALERT_LED, GPIO.LOW)
            freq += band["step_mhz"]
        return signals

    def full_scan(self):
        """Scan all monitored bands."""
        GPIO.output(SCAN_LED, GPIO.HIGH)
        self.scanning = True
        self.detected_signals = []
        self.total_scans += 1

        for band in MONITOR_BANDS:
            signals = self.scan_band(band)
            self.detected_signals.extend(signals)
            for sig in signals:
                key = f"{sig['freq_mhz']:.3f}"
                self.signal_history[key].append(sig)
                # Keep last 100 per frequency
                if len(self.signal_history[key]) > 100:
                    self.signal_history[key] = self.signal_history[key][-100:]

        GPIO.output(SCAN_LED, GPIO.LOW)
        self.scanning = False

        # Log results
        if self.detected_signals:
            log_file = LOG_DIR / f"scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            with open(log_file, "w") as f:
                json.dump(self.detected_signals, f, indent=2)

        logger.info("Scan #%d complete: %d signals detected",
                     self.total_scans, len(self.detected_signals))
        return self.detected_signals

    def continuous_monitor(self, band_name=None):
        """Continuous monitoring loop for a specific band."""
        bands = MONITOR_BANDS
        if band_name:
            bands = [b for b in MONITOR_BANDS if b["name"] == band_name]

        self.scanning = True
        while self.scanning:
            for band in bands:
                if not self.scanning:
                    break
                self.scan_band(band)
            time.sleep(0.5)

    def get_status(self):
        return {
            "scanning": self.scanning,
            "sdr_available": self.sdr is not None,
            "total_scans": self.total_scans,
            "signals_detected": len(self.detected_signals),
            "squelch_db": self.squelch_db,
            "monitored_bands": len(MONITOR_BANDS),
            "unique_frequencies": len(self.signal_history),
            "recent_signals": self.detected_signals[-15:],
        }


interceptor = SignalInterceptor()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Signal Intercept</title></head><body>
    <h1>Signal Intercept Station</h1>
    <button onclick="fetch('/api/scan',{method:'POST'}).then(r=>r.json()).then(d=>
        document.getElementById('r').innerText=JSON.stringify(d,null,2))">Full Scan</button>
    <pre id="r"></pre>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),2000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(interceptor.get_status())

@app.route("/api/scan", methods=["POST"])
def api_scan():
    signals = interceptor.full_scan()
    return jsonify({"signals": signals, "count": len(signals)})

@app.route("/api/monitor/start", methods=["POST"])
def api_monitor_start():
    band = (request.json or {}).get("band")
    threading.Thread(target=interceptor.continuous_monitor, args=(band,), daemon=True).start()
    return jsonify({"monitoring": True})

@app.route("/api/monitor/stop", methods=["POST"])
def api_monitor_stop():
    interceptor.scanning = False
    return jsonify({"monitoring": False})

@app.route("/api/squelch", methods=["POST"])
def api_squelch():
    interceptor.squelch_db = request.json.get("squelch_db", -35)
    return jsonify({"squelch_db": interceptor.squelch_db})


if __name__ == "__main__":
    interceptor.init_sdr()
    logger.info("Starting Signal Intercept on port 8108")
    app.run(host="0.0.0.0", port=8108, debug=False)
