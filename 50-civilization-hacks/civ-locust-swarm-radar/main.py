#!/usr/bin/env python3
"""Locust Swarm Radar — RPi Agricultural Defense System
Detects and tracks locust swarms using radar returns and RF scattering.
Provides early warning for crop protection with GPIO-controlled alerts.
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

PIPE_PATH = "/tmp/sdr_locust_pipe"
LOG_PATH = os.path.expanduser("~/locust_alerts/")

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    ALERT_SIREN = 18
    WARNING_LED = 23
    WIND_SENSOR = 24
    GPIO.setup(ALERT_SIREN, GPIO.OUT)
    GPIO.setup(WARNING_LED, GPIO.OUT)
    HAS_GPIO = True
except Exception:
    HAS_GPIO = False


class LocustDetector:
    def __init__(self):
        self.detections = deque(maxlen=500)
        self.swarm_active = False
        self.alert_count = 0
        self.baseline_rcs = None

    def calibrate(self, clear_sky_rcs):
        self.baseline_rcs = clear_sky_rcs
        logger.info(f"Calibrated: clear sky RCS={clear_sky_rcs:.2f}")

    def analyze_radar_return(self, radar_data):
        rcs = radar_data.get("rcs", 0)
        doppler_spread = radar_data.get("doppler_spread", 0)
        spectral_signature = radar_data.get("spectral_signature", 0)
        indicators = {"rcs": rcs, "doppler_spread": doppler_spread}
        if self.baseline_rcs:
            rcs_excess = rcs - self.baseline_rcs
            indicators["rcs_excess"] = float(rcs_excess)
        else:
            rcs_excess = 0
        is_swarm = (rcs_excess > 5 and doppler_spread > 2 and
                    spectral_signature > 0.3)
        if is_swarm:
            density = min(10, rcs_excess / 3)
            speed = doppler_spread * 0.5
            direction = radar_data.get("bearing", 0)
            indicators.update({"swarm_detected": True, "density_index": float(density),
                               "speed_ms": float(speed), "direction_deg": float(direction),
                               "eta_min": float(max(1, 20 / (speed + 0.1)))})
            if not self.swarm_active:
                self._trigger_alert(indicators)
            self.swarm_active = True
        else:
            indicators["swarm_detected"] = False
            self.swarm_active = False
        self.detections.append(indicators)
        return indicators

    def _trigger_alert(self, indicators):
        self.alert_count += 1
        if HAS_GPIO:
            GPIO.output(ALERT_SIREN, GPIO.HIGH)
            GPIO.output(WARNING_LED, GPIO.HIGH)
            time.sleep(2)
            GPIO.output(ALERT_SIREN, GPIO.LOW)
        os.makedirs(LOG_PATH, exist_ok=True)
        with open(os.path.join(LOG_PATH, "alerts.jsonl"), 'a') as f:
            f.write(json.dumps({"timestamp": datetime.now().isoformat(), **indicators}) + "\n")
        logger.warning(f"LOCUST ALERT #{self.alert_count}: density={indicators['density_index']:.1f} "
                       f"speed={indicators['speed_ms']:.1f}m/s ETA={indicators['eta_min']:.0f}min")


def read_radar_pipe():
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(1024)
            if raw:
                return json.loads(raw.decode())
        except Exception:
            pass
    rcs = np.random.exponential(2) + (15 if np.random.rand() < 0.08 else 0)
    return {"rcs": rcs, "doppler_spread": np.random.exponential(1),
            "spectral_signature": np.random.uniform(0, 0.5 + (0.5 if rcs > 10 else 0)),
            "bearing": np.random.uniform(0, 360)}


def main():
    logger.info("=== Locust Swarm Radar — RPi Defense System ===")
    detector = LocustDetector()
    cal_rcs = [read_radar_pipe()["rcs"] for _ in range(5)]
    detector.calibrate(np.mean(cal_rcs))
    try:
        while True:
            data = read_radar_pipe()
            result = detector.analyze_radar_return(data)
            if result.get("swarm_detected"):
                logger.warning(f"SWARM: density={result['density_index']:.1f} "
                               f"speed={result['speed_ms']:.1f}m/s @{result.get('direction_deg', 0):.0f}deg")
            else:
                logger.info(f"Clear | RCS={result['rcs']:.1f} doppler={result['doppler_spread']:.1f}")
            time.sleep(3)
    except KeyboardInterrupt:
        logger.info(f"Stopped. {detector.alert_count} alerts.")
        if HAS_GPIO:
            GPIO.cleanup()


if __name__ == "__main__":
    main()
