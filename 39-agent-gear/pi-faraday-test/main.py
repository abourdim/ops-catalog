#!/usr/bin/env python3
"""
Pi Faraday Cage Tester
Tests Faraday cage shielding effectiveness by measuring RF attenuation
across multiple frequency bands using RTL-SDR and a reference transmitter.
"""

import os
import time
import json
import math
import logging
import threading
from datetime import datetime
from pathlib import Path

try:
    import RPi.GPIO as GPIO
    from rtlsdr import RtlSdr
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()
    RtlSdr = None

import numpy as np
from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("faraday-test")

app = Flask(__name__)

RESULTS_DIR = Path("/var/lib/faraday-test")
RESULTS_DIR.mkdir(parents=True, exist_ok=True)

# GPIO
REFERENCE_TX_PIN = 17  # Trigger reference transmitter
STATUS_LED = 27
PASS_LED = 22
FAIL_LED = 5

# Test frequencies covering common bands
TEST_FREQUENCIES_MHZ = [
    27.0,     # CB radio
    88.0,     # FM broadcast
    145.0,    # VHF ham
    315.0,    # Key fobs
    433.0,    # ISM band
    446.0,    # PMR446
    868.0,    # LoRa EU
    915.0,    # LoRa US / ISM
    1090.0,   # ADS-B
    1575.42,  # GPS L1
    2437.0,   # WiFi ch6
]

# Minimum attenuation (dB) for a pass at each band
MIN_ATTENUATION_DB = 40


class FaradayTester:
    """Tests Faraday cage shielding effectiveness."""

    def __init__(self):
        self.sdr = None
        self.baseline_levels = {}
        self.shielded_levels = {}
        self.test_results = []
        self.testing = False
        self._setup_gpio()

    def _setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(REFERENCE_TX_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(STATUS_LED, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(PASS_LED, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(FAIL_LED, GPIO.OUT, initial=GPIO.LOW)

    def init_sdr(self):
        if RtlSdr is None:
            return False
        try:
            self.sdr = RtlSdr()
            self.sdr.sample_rate = 2.4e6
            self.sdr.gain = 30
            logger.info("SDR initialized for Faraday testing")
            return True
        except Exception as e:
            logger.error("SDR init failed: %s", e)
            return False

    def measure_power_at_freq(self, freq_mhz, num_samples=8192, averages=5):
        """Measure signal power at a specific frequency."""
        if not self.sdr:
            return -100.0

        powers = []
        self.sdr.center_freq = freq_mhz * 1e6
        time.sleep(0.1)  # Allow PLL to settle

        for _ in range(averages):
            try:
                samples = self.sdr.read_samples(num_samples)
                # Compute power in center 100kHz
                fft = np.fft.fftshift(np.fft.fft(samples))
                center_bins = len(fft) // 2
                bw_bins = int(100e3 / self.sdr.sample_rate * len(fft))
                center_power = np.mean(np.abs(fft[center_bins - bw_bins:center_bins + bw_bins]) ** 2)
                power_db = 10 * np.log10(max(center_power, 1e-15))
                powers.append(power_db)
            except Exception:
                powers.append(-100.0)
            time.sleep(0.05)

        return round(np.median(powers), 1)

    def capture_baseline(self):
        """Capture baseline (unshielded) RF levels."""
        GPIO.output(STATUS_LED, GPIO.HIGH)
        logger.info("Capturing baseline RF levels (no shielding)...")

        # Activate reference transmitter if available
        GPIO.output(REFERENCE_TX_PIN, GPIO.HIGH)
        time.sleep(1)

        self.baseline_levels = {}
        for freq in TEST_FREQUENCIES_MHZ:
            power = self.measure_power_at_freq(freq)
            self.baseline_levels[freq] = power
            logger.info("  %.2f MHz: %.1f dB", freq, power)

        GPIO.output(REFERENCE_TX_PIN, GPIO.LOW)
        GPIO.output(STATUS_LED, GPIO.LOW)
        return self.baseline_levels

    def capture_shielded(self):
        """Capture shielded RF levels (inside Faraday cage)."""
        GPIO.output(STATUS_LED, GPIO.HIGH)
        logger.info("Capturing shielded RF levels...")

        GPIO.output(REFERENCE_TX_PIN, GPIO.HIGH)
        time.sleep(1)

        self.shielded_levels = {}
        for freq in TEST_FREQUENCIES_MHZ:
            power = self.measure_power_at_freq(freq)
            self.shielded_levels[freq] = power
            logger.info("  %.2f MHz: %.1f dB", freq, power)

        GPIO.output(REFERENCE_TX_PIN, GPIO.LOW)
        GPIO.output(STATUS_LED, GPIO.LOW)
        return self.shielded_levels

    def run_test(self):
        """Run complete Faraday cage attenuation test."""
        if not self.baseline_levels:
            return {"error": "Capture baseline first"}

        self.testing = True
        self.capture_shielded()

        results = {
            "timestamp": datetime.utcnow().isoformat(),
            "frequencies": [],
            "overall_pass": True,
            "avg_attenuation_db": 0,
            "min_attenuation_db": 999,
            "max_attenuation_db": -999,
        }

        attenuations = []
        for freq in TEST_FREQUENCIES_MHZ:
            baseline = self.baseline_levels.get(freq, -50)
            shielded = self.shielded_levels.get(freq, -50)
            attenuation = baseline - shielded
            passed = attenuation >= MIN_ATTENUATION_DB

            freq_result = {
                "freq_mhz": freq,
                "baseline_db": baseline,
                "shielded_db": shielded,
                "attenuation_db": round(attenuation, 1),
                "min_required_db": MIN_ATTENUATION_DB,
                "pass": passed,
            }
            results["frequencies"].append(freq_result)
            attenuations.append(attenuation)

            if not passed:
                results["overall_pass"] = False

        results["avg_attenuation_db"] = round(np.mean(attenuations), 1)
        results["min_attenuation_db"] = round(min(attenuations), 1)
        results["max_attenuation_db"] = round(max(attenuations), 1)

        # LED indicators
        if results["overall_pass"]:
            GPIO.output(PASS_LED, GPIO.HIGH)
            GPIO.output(FAIL_LED, GPIO.LOW)
        else:
            GPIO.output(PASS_LED, GPIO.LOW)
            GPIO.output(FAIL_LED, GPIO.HIGH)

        # Save results
        fname = f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(RESULTS_DIR / fname, "w") as f:
            json.dump(results, f, indent=2)

        self.test_results.append(results)
        self.testing = False
        logger.info("Test complete: %s (avg %.1f dB attenuation)",
                     "PASS" if results["overall_pass"] else "FAIL",
                     results["avg_attenuation_db"])
        return results

    def get_status(self):
        return {
            "sdr_available": self.sdr is not None,
            "testing": self.testing,
            "baseline_captured": bool(self.baseline_levels),
            "test_frequencies": len(TEST_FREQUENCIES_MHZ),
            "min_attenuation_required": MIN_ATTENUATION_DB,
            "total_tests": len(self.test_results),
            "last_result": self.test_results[-1] if self.test_results else None,
        }


tester = FaradayTester()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Faraday Tester</title></head><body>
    <h1>Faraday Cage Tester</h1>
    <button onclick="fetch('/api/baseline',{method:'POST'}).then(r=>r.json()).then(alert)">Capture Baseline</button>
    <button onclick="fetch('/api/test',{method:'POST'}).then(r=>r.json()).then(d=>
        document.getElementById('r').innerText=JSON.stringify(d,null,2))">Run Test</button>
    <pre id="r"></pre>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),3000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(tester.get_status())

@app.route("/api/baseline", methods=["POST"])
def api_baseline():
    bl = tester.capture_baseline()
    return jsonify({"baseline": {str(k): v for k, v in bl.items()}})

@app.route("/api/test", methods=["POST"])
def api_test():
    return jsonify(tester.run_test())

@app.route("/api/results")
def api_results():
    files = sorted(RESULTS_DIR.glob("*.json"), reverse=True)
    return jsonify({"results": [f.stem for f in files[:20]]})


if __name__ == "__main__":
    tester.init_sdr()
    logger.info("Starting Faraday Tester on port 8106")
    app.run(host="0.0.0.0", port=8106, debug=False)
