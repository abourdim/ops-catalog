#!/usr/bin/env python3
"""Space Debris Tracker — RPi Orbital Debris Monitoring Station
Tracks space debris using radar returns and orbital mechanics.
Computes collision probabilities and maintains debris catalog.
"""

import numpy as np
import time
import json
import os
import logging
import math
from datetime import datetime
from collections import deque

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

PIPE_PATH = "/tmp/sdr_debris_pipe"
LOG_PATH = os.path.expanduser("~/debris_tracker_logs/")
EARTH_RADIUS_KM = 6371
MU = 398600.4418

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    STATUS_LED = 18
    ALERT_LED = 23
    SERVO_AZ = 12
    SERVO_EL = 13
    GPIO.setup(STATUS_LED, GPIO.OUT)
    GPIO.setup(ALERT_LED, GPIO.OUT)
    HAS_GPIO = True
except Exception:
    HAS_GPIO = False


class DebrisTracker:
    def __init__(self):
        self.catalog = {}
        self.detections = deque(maxlen=5000)
        self.collision_warnings = []

    def process_radar_return(self, radar_data):
        range_km = radar_data.get("range_km", 0)
        doppler_hz = radar_data.get("doppler_hz", 0)
        rcs_dbsm = radar_data.get("rcs_dbsm", -20)
        range_rate = doppler_hz * 0.03  # approximate
        size_est = 10 ** (rcs_dbsm / 20) * 100  # cm estimate
        altitude_km = range_km - EARTH_RADIUS_KM if range_km > EARTH_RADIUS_KM else range_km
        obj_id = f"DEB-{len(self.catalog):05d}"
        detection = {"id": obj_id, "range_km": range_km, "range_rate_ms": range_rate,
                     "rcs_dbsm": rcs_dbsm, "size_cm": round(size_est, 1),
                     "altitude_km": round(altitude_km, 1),
                     "timestamp": datetime.now().isoformat()}
        self.detections.append(detection)
        if obj_id not in self.catalog:
            self.catalog[obj_id] = {"first_seen": datetime.now().isoformat(), "observations": 0}
        self.catalog[obj_id]["observations"] += 1
        self.catalog[obj_id]["last"] = detection
        return detection

    def estimate_orbit(self, detections):
        """Simple orbital element estimation from multiple observations."""
        if len(detections) < 2:
            return None
        altitudes = [d["altitude_km"] for d in detections]
        velocities = [abs(d["range_rate_ms"]) for d in detections]
        semi_major = EARTH_RADIUS_KM + np.mean(altitudes)
        period_min = 2 * math.pi * math.sqrt(semi_major ** 3 / MU) / 60
        return {"semi_major_km": round(semi_major, 1), "period_min": round(period_min, 1),
                "eccentricity_est": round(np.std(altitudes) / (np.mean(altitudes) + 1), 4)}

    def check_collision_risk(self, obj1, obj2, threshold_km=10):
        """Check collision probability between two objects."""
        if obj1["altitude_km"] == 0 or obj2["altitude_km"] == 0:
            return 0
        alt_diff = abs(obj1["altitude_km"] - obj2["altitude_km"])
        if alt_diff < threshold_km:
            probability = max(0, 1 - alt_diff / threshold_km) * 0.001
            if probability > 1e-5:
                self.collision_warnings.append({
                    "obj1": obj1["id"], "obj2": obj2["id"],
                    "probability": probability, "timestamp": datetime.now().isoformat()})
            return probability
        return 0

    def save_catalog(self):
        os.makedirs(LOG_PATH, exist_ok=True)
        with open(os.path.join(LOG_PATH, "catalog.json"), 'w') as f:
            json.dump({"objects": len(self.catalog), "detections": len(self.detections),
                       "warnings": len(self.collision_warnings)}, f, indent=2)


def read_radar_data():
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(1024)
            if raw:
                return json.loads(raw.decode())
        except Exception:
            pass
    return {"range_km": np.random.uniform(200, 2000), "doppler_hz": np.random.uniform(-1000, 1000),
            "rcs_dbsm": np.random.uniform(-30, 10), "detected": np.random.rand() < 0.3}


def main():
    logger.info("=== Space Debris Tracker — RPi Station ===")
    tracker = DebrisTracker()
    if HAS_GPIO:
        GPIO.output(STATUS_LED, GPIO.HIGH)
    try:
        while True:
            data = read_radar_data()
            if data.get("detected", False):
                det = tracker.process_radar_return(data)
                logger.info(f"DEBRIS: {det['id']} | range={det['range_km']:.0f}km "
                            f"alt={det['altitude_km']:.0f}km size~{det['size_cm']:.0f}cm")
                if len(tracker.detections) >= 2:
                    recent = list(tracker.detections)[-2:]
                    prob = tracker.check_collision_risk(recent[0], recent[1])
                    if prob > 1e-5:
                        logger.warning(f"COLLISION RISK: P={prob:.2e}")
                        if HAS_GPIO:
                            GPIO.output(ALERT_LED, GPIO.HIGH)
            else:
                if HAS_GPIO:
                    GPIO.output(ALERT_LED, GPIO.LOW)
            if len(tracker.detections) % 50 == 0 and len(tracker.detections) > 0:
                tracker.save_catalog()
                logger.info(f"Catalog: {len(tracker.catalog)} objects, {len(tracker.detections)} detections")
            time.sleep(2)
    except KeyboardInterrupt:
        tracker.save_catalog()
        logger.info(f"Stopped. {len(tracker.catalog)} objects tracked.")
        if HAS_GPIO:
            GPIO.cleanup()


if __name__ == "__main__":
    main()
