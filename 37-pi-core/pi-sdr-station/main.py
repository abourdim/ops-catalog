#!/usr/bin/env python3
"""
Pi SDR Station
Full RTL-SDR receiver station with web-based waterfall display,
multiple demodulation modes, and frequency scanning.
"""

import os
import time
import json
import logging
import threading
import subprocess
import numpy as np
from flask import Flask, jsonify, request, render_template_string

try:
    from rtlsdr import RtlSdr
except ImportError:
    RtlSdr = None

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("sdr-station")

app = Flask(__name__)


class SDRStation:
    """RTL-SDR receiver with DSP and web interface."""

    def __init__(self):
        self.sdr = None
        self.center_freq = 100.0e6
        self.sample_rate = 2.4e6
        self.gain = 30
        self.mode = "FM"  # FM, AM, USB, LSB
        self.running = False
        self.spectrum_data = []
        self.waterfall_data = []
        self.scanner_results = []
        self.lock = threading.Lock()

    def init_sdr(self):
        """Initialize RTL-SDR hardware."""
        if RtlSdr is None:
            logger.warning("rtlsdr not available")
            return False
        try:
            self.sdr = RtlSdr()
            self.sdr.center_freq = self.center_freq
            self.sdr.sample_rate = self.sample_rate
            self.sdr.gain = self.gain
            logger.info("SDR ready: %.3f MHz, %.1f MS/s",
                        self.center_freq / 1e6, self.sample_rate / 1e6)
            return True
        except Exception as e:
            logger.error("SDR init failed: %s", e)
            return False

    def set_frequency(self, freq_hz):
        """Tune to new frequency."""
        self.center_freq = freq_hz
        if self.sdr:
            self.sdr.center_freq = freq_hz
        logger.info("Tuned to %.6f MHz", freq_hz / 1e6)

    def set_gain(self, gain):
        """Set receiver gain."""
        self.gain = gain
        if self.sdr:
            self.sdr.gain = gain

    def compute_spectrum(self, samples):
        """Compute power spectral density from IQ samples."""
        fft_size = 1024
        if len(samples) < fft_size:
            return []
        # Apply window and FFT
        window = np.hamming(fft_size)
        segment = samples[:fft_size] * window
        fft_result = np.fft.fftshift(np.fft.fft(segment))
        power_db = 20 * np.log10(np.abs(fft_result) + 1e-10)

        # Generate frequency axis
        freqs = np.fft.fftshift(np.fft.fftfreq(fft_size, 1.0 / self.sample_rate))
        freqs = freqs + self.center_freq

        spectrum = []
        step = max(1, fft_size // 256)
        for i in range(0, fft_size, step):
            spectrum.append({
                "freq_mhz": round(freqs[i] / 1e6, 4),
                "power_db": round(float(power_db[i]), 1),
            })
        return spectrum

    def fm_demodulate(self, samples):
        """FM demodulate IQ samples."""
        # Compute instantaneous frequency via phase difference
        phase = np.angle(samples)
        freq_inst = np.diff(np.unwrap(phase))
        # Normalize and convert to audio
        audio = freq_inst / (2 * np.pi * 75e3 / self.sample_rate)
        return np.clip(audio, -1, 1)

    def am_demodulate(self, samples):
        """AM envelope demodulation."""
        envelope = np.abs(samples)
        # Remove DC component
        envelope = envelope - np.mean(envelope)
        max_val = np.max(np.abs(envelope))
        if max_val > 0:
            envelope = envelope / max_val
        return envelope

    def spectrum_loop(self):
        """Continuously read SDR and compute spectrum."""
        self.running = True
        while self.running and self.sdr:
            try:
                samples = self.sdr.read_samples(8192)
                spectrum = self.compute_spectrum(samples)
                with self.lock:
                    self.spectrum_data = spectrum
                    # Waterfall: keep last 50 rows
                    row = [p["power_db"] for p in spectrum]
                    self.waterfall_data.append(row)
                    if len(self.waterfall_data) > 50:
                        self.waterfall_data = self.waterfall_data[-50:]
            except Exception as e:
                logger.error("Spectrum error: %s", e)
                time.sleep(1)
            time.sleep(0.1)

    def scan_range(self, start_freq, end_freq, step_hz=25000, threshold_db=-30):
        """Scan frequency range and find active signals."""
        signals = []
        freq = start_freq
        while freq <= end_freq:
            if self.sdr:
                self.sdr.center_freq = freq
                time.sleep(0.05)
                try:
                    samples = self.sdr.read_samples(4096)
                    power = np.mean(np.abs(samples) ** 2)
                    power_db = 10 * np.log10(power) if power > 0 else -100
                    if power_db > threshold_db:
                        signals.append({
                            "freq_mhz": round(freq / 1e6, 4),
                            "power_db": round(power_db, 1),
                        })
                except Exception:
                    pass
            freq += step_hz

        # Restore original frequency
        if self.sdr:
            self.sdr.center_freq = self.center_freq
        self.scanner_results = signals
        return signals

    def get_status(self):
        return {
            "center_freq_mhz": self.center_freq / 1e6,
            "sample_rate_msps": self.sample_rate / 1e6,
            "gain": self.gain,
            "mode": self.mode,
            "running": self.running,
            "sdr_available": self.sdr is not None,
            "spectrum_points": len(self.spectrum_data),
        }


station = SDRStation()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi SDR Station</title></head><body>
    <h1>SDR Station</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),1000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(station.get_status())

@app.route("/api/spectrum")
def api_spectrum():
    with station.lock:
        return jsonify({"spectrum": station.spectrum_data})

@app.route("/api/waterfall")
def api_waterfall():
    with station.lock:
        return jsonify({"waterfall": station.waterfall_data})

@app.route("/api/tune", methods=["POST"])
def api_tune():
    freq = request.json.get("freq_mhz", 100.0)
    station.set_frequency(freq * 1e6)
    return jsonify({"freq_mhz": freq})

@app.route("/api/gain", methods=["POST"])
def api_gain():
    g = request.json.get("gain", 30)
    station.set_gain(g)
    return jsonify({"gain": g})

@app.route("/api/scan", methods=["POST"])
def api_scan():
    d = request.json or {}
    start = d.get("start_mhz", 88.0) * 1e6
    end = d.get("end_mhz", 108.0) * 1e6
    results = station.scan_range(start, end)
    return jsonify({"signals": results})


if __name__ == "__main__":
    station.init_sdr()
    if station.sdr:
        threading.Thread(target=station.spectrum_loop, daemon=True).start()
    logger.info("Starting SDR Station on port 8096")
    app.run(host="0.0.0.0", port=8096, debug=False)
