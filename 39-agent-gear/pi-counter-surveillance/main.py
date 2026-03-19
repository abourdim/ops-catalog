#!/usr/bin/env python3
"""
Pi Counter-Surveillance
RF sweep and wireless device detection system.
Scans for hidden cameras, microphones, and tracking devices
using RTL-SDR and WiFi monitoring.
"""

import os
import time
import json
import subprocess
import logging
import threading
from datetime import datetime
from collections import defaultdict

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
logger = logging.getLogger("counter-surv")

app = Flask(__name__)

# --- Configuration ---
ALERT_LED_PIN = 17
BUZZER_PIN = 27
SCAN_LED_PIN = 22

# Known surveillance device frequency ranges (MHz)
SUSPICIOUS_BANDS = [
    {"name": "WiFi Camera 2.4GHz", "start": 2400, "end": 2500, "threshold": -25},
    {"name": "Bluetooth/BLE", "start": 2402, "end": 2480, "threshold": -30},
    {"name": "Wireless Mic VHF", "start": 170, "end": 216, "threshold": -35},
    {"name": "Wireless Mic UHF", "start": 470, "end": 698, "threshold": -35},
    {"name": "GPS Tracker", "start": 850, "end": 894, "threshold": -30},
    {"name": "GSM Tracker", "start": 925, "end": 960, "threshold": -30},
    {"name": "LTE Tracker", "start": 1710, "end": 1785, "threshold": -30},
    {"name": "DECT Phone", "start": 1880, "end": 1900, "threshold": -30},
    {"name": "Baby Monitor", "start": 900, "end": 928, "threshold": -35},
]


class RFScanner:
    """Scans RF spectrum for suspicious transmissions."""

    def __init__(self):
        self.sdr = None
        self.scanning = False
        self.detected_signals = []
        self.baseline = {}

    def init_sdr(self):
        if RtlSdr is None:
            return False
        try:
            self.sdr = RtlSdr()
            self.sdr.sample_rate = 2.4e6
            self.sdr.gain = 40
            return True
        except Exception as e:
            logger.error("SDR init failed: %s", e)
            return False

    def measure_band_power(self, center_freq_mhz):
        """Measure signal power at a specific frequency."""
        if not self.sdr:
            return -100
        try:
            self.sdr.center_freq = center_freq_mhz * 1e6
            time.sleep(0.05)
            samples = self.sdr.read_samples(4096)
            power = np.mean(np.abs(samples) ** 2)
            return round(10 * np.log10(max(power, 1e-15)), 1)
        except Exception:
            return -100

    def establish_baseline(self):
        """Record baseline RF environment for comparison."""
        logger.info("Establishing RF baseline...")
        self.baseline = {}
        for band in SUSPICIOUS_BANDS:
            center = (band["start"] + band["end"]) / 2
            power = self.measure_band_power(center)
            self.baseline[band["name"]] = power
            time.sleep(0.1)
        logger.info("Baseline established: %d bands", len(self.baseline))
        return self.baseline

    def sweep_scan(self):
        """Full RF sweep across all suspicious bands."""
        self.scanning = True
        self.detected_signals = []

        for band in SUSPICIOUS_BANDS:
            freq = band["start"]
            while freq <= band["end"]:
                power = self.measure_band_power(freq)
                baseline_power = self.baseline.get(band["name"], -60)

                # Alert if significantly above baseline or threshold
                above_baseline = power - baseline_power
                if power > band["threshold"] or above_baseline > 10:
                    signal = {
                        "freq_mhz": freq,
                        "power_db": power,
                        "band": band["name"],
                        "above_baseline_db": round(above_baseline, 1),
                        "threat_level": "high" if above_baseline > 20 else "medium",
                        "time": datetime.utcnow().isoformat(),
                    }
                    self.detected_signals.append(signal)
                    logger.warning("Suspicious signal: %.1f MHz (%.1f dB) - %s",
                                   freq, power, band["name"])

                freq += 0.5  # 500 kHz steps
                time.sleep(0.02)

        self.scanning = False
        return self.detected_signals


class WiFiScanner:
    """Detects wireless devices using WiFi monitoring."""

    def __init__(self):
        self.devices = {}

    def scan_wifi(self, interface="wlan0"):
        """Scan for WiFi access points and clients."""
        try:
            result = subprocess.run(
                ["sudo", "iwlist", interface, "scan"],
                capture_output=True, text=True, timeout=30
            )
            aps = []
            current = {}
            for line in result.stdout.split("\n"):
                line = line.strip()
                if "Cell" in line and "Address:" in line:
                    if current:
                        aps.append(current)
                    current = {"mac": line.split("Address:")[1].strip()}
                elif "ESSID:" in line:
                    current["ssid"] = line.split("ESSID:")[1].strip('"')
                elif "Signal level=" in line:
                    try:
                        sig = line.split("Signal level=")[1].split()[0]
                        current["signal_dbm"] = int(sig)
                    except (ValueError, IndexError):
                        pass
                elif "Channel:" in line:
                    try:
                        current["channel"] = int(line.split("Channel:")[1])
                    except (ValueError, IndexError):
                        pass
            if current:
                aps.append(current)
            return aps
        except Exception as e:
            logger.error("WiFi scan failed: %s", e)
            return []

    def detect_hidden_cameras(self, aps):
        """Identify potential hidden camera devices by MAC OUI and SSID patterns."""
        camera_ouis = ["00:12:17", "00:18:DD", "AC:CF:23", "7C:DD:90"]
        suspicious_ssids = ["camera", "ipcam", "webcam", "spy", "hidden"]
        cameras = []
        for ap in aps:
            mac_prefix = ap.get("mac", "")[:8].upper()
            ssid = ap.get("ssid", "").lower()
            suspicious = False
            reason = []
            if mac_prefix in camera_ouis:
                suspicious = True
                reason.append("Known camera OUI")
            if any(s in ssid for s in suspicious_ssids):
                suspicious = True
                reason.append("Suspicious SSID")
            if ap.get("signal_dbm", -100) > -40:
                reason.append("Very strong signal (close proximity)")
            if suspicious:
                cameras.append({**ap, "reasons": reason})
        return cameras


class CounterSurveillance:
    """Main counter-surveillance controller."""

    def __init__(self):
        self.rf_scanner = RFScanner()
        self.wifi_scanner = WiFiScanner()
        self.alerts = []
        self.scan_count = 0
        self._setup_gpio()

    def _setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(ALERT_LED_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(BUZZER_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(SCAN_LED_PIN, GPIO.OUT, initial=GPIO.LOW)

    def trigger_alert(self, message):
        """Visual and audible alert for detected threats."""
        self.alerts.append({"time": datetime.utcnow().isoformat(), "message": message})
        GPIO.output(ALERT_LED_PIN, GPIO.HIGH)
        GPIO.output(BUZZER_PIN, GPIO.HIGH)
        time.sleep(0.5)
        GPIO.output(BUZZER_PIN, GPIO.LOW)
        threading.Timer(5.0, lambda: GPIO.output(ALERT_LED_PIN, GPIO.LOW)).start()

    def full_sweep(self):
        """Perform complete counter-surveillance sweep."""
        GPIO.output(SCAN_LED_PIN, GPIO.HIGH)
        self.scan_count += 1
        results = {"rf_signals": [], "wifi_cameras": [], "wifi_aps": []}

        # RF sweep
        if self.rf_scanner.sdr:
            results["rf_signals"] = self.rf_scanner.sweep_scan()
            if results["rf_signals"]:
                self.trigger_alert(f"RF sweep: {len(results['rf_signals'])} suspicious signals")

        # WiFi scan
        aps = self.wifi_scanner.scan_wifi()
        results["wifi_aps"] = aps
        results["wifi_cameras"] = self.wifi_scanner.detect_hidden_cameras(aps)
        if results["wifi_cameras"]:
            self.trigger_alert(f"WiFi scan: {len(results['wifi_cameras'])} potential cameras")

        GPIO.output(SCAN_LED_PIN, GPIO.LOW)
        results["scan_number"] = self.scan_count
        results["time"] = datetime.utcnow().isoformat()
        return results

    def get_status(self):
        return {
            "scanning": self.rf_scanner.scanning,
            "scan_count": self.scan_count,
            "sdr_available": self.rf_scanner.sdr is not None,
            "alerts": self.alerts[-10:],
            "detected_signals": len(self.rf_scanner.detected_signals),
            "bands_monitored": len(SUSPICIOUS_BANDS),
        }


cs = CounterSurveillance()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Counter-Surveillance</title></head><body>
    <h1>Counter-Surveillance Scanner</h1>
    <button onclick="fetch('/api/sweep',{method:'POST'}).then(r=>r.json()).then(d=>
        document.getElementById('r').innerText=JSON.stringify(d,null,2))">Full Sweep</button>
    <pre id="r"></pre>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),3000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(cs.get_status())

@app.route("/api/sweep", methods=["POST"])
def api_sweep():
    results = cs.full_sweep()
    return jsonify(results)

@app.route("/api/baseline", methods=["POST"])
def api_baseline():
    bl = cs.rf_scanner.establish_baseline()
    return jsonify({"baseline": bl})


if __name__ == "__main__":
    cs.rf_scanner.init_sdr()
    logger.info("Starting Counter-Surveillance on port 8103")
    app.run(host="0.0.0.0", port=8103, debug=False)
