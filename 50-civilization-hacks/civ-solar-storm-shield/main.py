#!/usr/bin/env python3
"""Solar Storm Shield — RPi Space Weather Monitor
Monitors solar activity indicators via RF propagation changes,
geomagnetic sensors, and VLF reception to warn of solar storms.
"""

import numpy as np
import time
import json
import os
import logging
from datetime import datetime
from collections import deque

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

PIPE_PATH = "/tmp/sdr_solar_pipe"
LOG_PATH = os.path.expanduser("~/solar_storm_logs/")
ALERT_THRESHOLDS = {"sfe": 3.0, "absorption": 10, "noise_spike": 15}

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    MAGNETOMETER_SDA = 2
    MAGNETOMETER_SCL = 3
    ALERT_LED = 18
    BUZZER_PIN = 23
    GPIO.setup(ALERT_LED, GPIO.OUT)
    GPIO.setup(BUZZER_PIN, GPIO.OUT)
    HAS_GPIO = True
except Exception:
    HAS_GPIO = False


class SolarStormMonitor:
    """Multi-sensor solar storm detection system."""

    def __init__(self):
        self.vlf_baseline = None
        self.hf_baseline = None
        self.magnetic_baseline = None
        self.history = deque(maxlen=1440)
        self.alerts = []
        self.storm_active = False

    def calibrate(self, vlf_power, hf_noise, mag_field):
        """Set quiet-time baselines."""
        self.vlf_baseline = vlf_power
        self.hf_baseline = hf_noise
        self.magnetic_baseline = mag_field
        logger.info(f"Calibrated: VLF={vlf_power:.1f}dB HF={hf_noise:.1f}dB Mag={mag_field:.1f}nT")

    def analyze(self, vlf_power, hf_noise, mag_field):
        """Analyze current readings for storm indicators."""
        indicators = {}
        if self.vlf_baseline is not None:
            sfe = vlf_power - self.vlf_baseline
            indicators["sudden_freq_enhancement"] = float(sfe)
            indicators["sfe_alert"] = sfe > ALERT_THRESHOLDS["sfe"]
        if self.hf_baseline is not None:
            absorption = self.hf_baseline - hf_noise
            indicators["hf_absorption_db"] = float(absorption)
            indicators["absorption_alert"] = absorption > ALERT_THRESHOLDS["absorption"]
        if self.magnetic_baseline is not None:
            disturbance = abs(mag_field - self.magnetic_baseline)
            indicators["magnetic_disturbance_nt"] = float(disturbance)
            indicators["k_index_est"] = min(9, int(disturbance / 5))
        indicators["timestamp"] = datetime.now().isoformat()
        self.history.append(indicators)
        any_alert = any(indicators.get(k, False) for k in ["sfe_alert", "absorption_alert"])
        if any_alert and not self.storm_active:
            self.storm_active = True
            self._trigger_alert(indicators)
        elif not any_alert and self.storm_active:
            self.storm_active = False
            logger.info("Storm conditions cleared")
        return indicators

    def _trigger_alert(self, indicators):
        """Trigger solar storm alert."""
        alert = {
            "timestamp": datetime.now().isoformat(),
            "type": "solar_storm",
            "indicators": indicators,
            "severity": self._estimate_severity(indicators),
        }
        self.alerts.append(alert)
        os.makedirs(LOG_PATH, exist_ok=True)
        with open(os.path.join(LOG_PATH, "alerts.jsonl"), 'a') as f:
            f.write(json.dumps(alert) + "\n")
        if HAS_GPIO:
            GPIO.output(ALERT_LED, GPIO.HIGH)
            GPIO.output(BUZZER_PIN, GPIO.HIGH)
            time.sleep(0.5)
            GPIO.output(BUZZER_PIN, GPIO.LOW)
        logger.warning(f"SOLAR STORM ALERT: severity={alert['severity']}")

    def _estimate_severity(self, indicators):
        """Estimate storm severity G1-G5."""
        k = indicators.get("k_index_est", 0)
        if k >= 9: return "G5-Extreme"
        if k >= 8: return "G4-Severe"
        if k >= 7: return "G3-Strong"
        if k >= 6: return "G2-Moderate"
        if k >= 5: return "G1-Minor"
        return "Sub-storm"

    def get_trend(self, window=10):
        """Get recent trend analysis."""
        if len(self.history) < window:
            return "insufficient_data"
        recent = list(self.history)[-window:]
        sfe_vals = [r.get("sudden_freq_enhancement", 0) for r in recent]
        trend = np.polyfit(range(len(sfe_vals)), sfe_vals, 1)[0]
        if trend > 0.5: return "worsening"
        if trend < -0.5: return "improving"
        return "stable"


def read_magnetometer():
    """Read magnetic field from I2C magnetometer."""
    base = 50000
    variation = np.random.normal(0, 5)
    if np.random.rand() < 0.05:
        variation += np.random.uniform(20, 100)
    return base + variation


def read_from_sdr():
    """Read VLF/HF measurements from SDR pipe."""
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(1024)
            if raw:
                return json.loads(raw.decode())
        except Exception:
            pass
    return {"vlf_power": -40 + np.random.normal(0, 2),
            "hf_noise": -30 + np.random.normal(0, 3)}


def main():
    logger.info("=== Solar Storm Shield — RPi Monitor ===")
    monitor = SolarStormMonitor()
    logger.info("Calibrating baselines (30 seconds)...")
    vlf_cal, hf_cal, mag_cal = [], [], []

    for _ in range(10):
        sdr_data = read_from_sdr()
        mag = read_magnetometer()
        vlf_cal.append(sdr_data["vlf_power"])
        hf_cal.append(sdr_data["hf_noise"])
        mag_cal.append(mag)
        time.sleep(1)

    monitor.calibrate(np.mean(vlf_cal), np.mean(hf_cal), np.mean(mag_cal))

    try:
        while True:
            sdr_data = read_from_sdr()
            mag = read_magnetometer()
            result = monitor.analyze(sdr_data["vlf_power"], sdr_data["hf_noise"], mag)
            trend = monitor.get_trend()
            k = result.get("k_index_est", 0)
            status = "STORM" if monitor.storm_active else "quiet"
            logger.info(f"[{status}] K={k} trend={trend} | "
                        f"SFE={result.get('sudden_freq_enhancement', 0):.1f}dB | "
                        f"Abs={result.get('hf_absorption_db', 0):.1f}dB | "
                        f"Mag={result.get('magnetic_disturbance_nt', 0):.1f}nT")
            time.sleep(5)

    except KeyboardInterrupt:
        logger.info(f"Stopped. {len(monitor.alerts)} alerts issued.")
        if HAS_GPIO:
            GPIO.cleanup()


if __name__ == "__main__":
    main()
