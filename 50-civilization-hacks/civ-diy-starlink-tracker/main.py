#!/usr/bin/env python3
"""DIY Starlink Tracker — RPi Satellite Tracking Station
Tracks Starlink and other LEO satellites using TLE data,
predicts passes, and logs signal reception with GPIO controls.
"""

import numpy as np
import time
import json
import os
import logging
import math
from datetime import datetime, timedelta
from collections import deque

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

PIPE_PATH = "/tmp/sdr_starlink_pipe"
LOG_PATH = os.path.expanduser("~/starlink_logs/")
TLE_CACHE = os.path.expanduser("~/tle_cache/")
OBSERVER_LAT = 36.75
OBSERVER_LON = 3.05
OBSERVER_ALT = 100

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    TRACKING_LED = 18
    SERVO_AZ = 12
    SERVO_EL = 13
    GPIO.setup(TRACKING_LED, GPIO.OUT)
    GPIO.setup(SERVO_AZ, GPIO.OUT)
    GPIO.setup(SERVO_EL, GPIO.OUT)
    az_pwm = GPIO.PWM(SERVO_AZ, 50)
    el_pwm = GPIO.PWM(SERVO_EL, 50)
    az_pwm.start(7.5)
    el_pwm.start(7.5)
    HAS_GPIO = True
except Exception:
    HAS_GPIO = False


class SimpleSatTracker:
    """Simplified satellite tracker using Keplerian elements."""

    def __init__(self, lat, lon, alt):
        self.lat = math.radians(lat)
        self.lon = math.radians(lon)
        self.alt = alt
        self.satellites = {}
        self.passes = deque(maxlen=100)
        self.active_tracks = {}

    def add_satellite(self, name, tle_line1, tle_line2):
        """Parse TLE and add satellite to tracking list."""
        inclination = float(tle_line2[8:16])
        raan = float(tle_line2[17:25])
        eccentricity = float("0." + tle_line2[26:33])
        arg_perigee = float(tle_line2[34:42])
        mean_anomaly = float(tle_line2[43:51])
        mean_motion = float(tle_line2[52:63])
        self.satellites[name] = {
            "inclination": inclination, "raan": raan,
            "eccentricity": eccentricity, "arg_perigee": arg_perigee,
            "mean_anomaly": mean_anomaly, "mean_motion": mean_motion,
            "period_min": 1440.0 / mean_motion,
            "altitude_km": (8681663.0 / mean_motion) ** (2.0/3.0) - 6371,
        }

    def predict_position(self, sat_name, t_offset_min=0):
        """Simplified position prediction."""
        if sat_name not in self.satellites:
            return None
        sat = self.satellites[sat_name]
        ma = (sat["mean_anomaly"] + 360 * t_offset_min / sat["period_min"]) % 360
        az = (ma + sat["raan"] + self.lon * 180 / math.pi) % 360
        el_max = 90 - sat["inclination"] + math.degrees(self.lat)
        el = max(0, el_max * math.sin(math.radians(ma)))
        visible = el > 5
        return {"azimuth": az, "elevation": el, "visible": visible,
                "altitude_km": sat["altitude_km"]}

    def get_next_pass(self, sat_name):
        """Find next visible pass."""
        for t in range(0, 1440, 1):
            pos = self.predict_position(sat_name, t)
            if pos and pos["visible"]:
                return {"start_min": t, "satellite": sat_name, **pos}
        return None

    def log_pass(self, pass_data, signal_strength):
        """Log satellite pass with signal data."""
        entry = {**pass_data, "signal_db": signal_strength,
                 "timestamp": datetime.now().isoformat()}
        self.passes.append(entry)
        os.makedirs(LOG_PATH, exist_ok=True)
        with open(os.path.join(LOG_PATH, "passes.jsonl"), 'a') as f:
            f.write(json.dumps(entry) + "\n")


def point_antenna(azimuth, elevation):
    """Point antenna servos to satellite position."""
    if HAS_GPIO:
        az_duty = 2.5 + (azimuth / 360) * 10
        el_duty = 2.5 + (elevation / 180) * 10
        az_pwm.ChangeDutyCycle(az_duty)
        el_pwm.ChangeDutyCycle(el_duty)


def read_signal_pipe():
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(1024)
            if raw:
                return json.loads(raw.decode())
        except Exception:
            pass
    return {"signal_db": -60 + np.random.normal(0, 5)}


def load_sample_tles():
    """Load sample TLE data."""
    return [
        ("STARLINK-1007", "1 44713U 19074A   24001.5 .00001234 00000+0 12345-3 0  9991",
         "2 44713  53.0000 100.0000 0001234  90.0000 270.0000 15.05000000 12345"),
        ("STARLINK-2045", "1 48001U 21024A   24001.5 .00000987 00000+0  98765-4 0  9992",
         "2 48001  53.0500 200.0000 0001500  45.0000 315.0000 15.06000000 23456"),
        ("ISS", "1 25544U 98067A   24001.5 .00016717 00000+0  10270-3 0  9993",
         "2 25544  51.6400 300.0000 0007417 350.0000  50.0000 15.49000000 43210"),
    ]


def main():
    logger.info("=== DIY Starlink Tracker — RPi Station ===")
    tracker = SimpleSatTracker(OBSERVER_LAT, OBSERVER_LON, OBSERVER_ALT)
    for name, l1, l2 in load_sample_tles():
        tracker.add_satellite(name, l1, l2)
    logger.info(f"Tracking {len(tracker.satellites)} satellites")

    try:
        while True:
            for sat_name in tracker.satellites:
                pos = tracker.predict_position(sat_name)
                if pos and pos["visible"]:
                    point_antenna(pos["azimuth"], pos["elevation"])
                    signal = read_signal_pipe()
                    tracker.log_pass(pos, signal.get("signal_db", -99))
                    if HAS_GPIO:
                        GPIO.output(TRACKING_LED, GPIO.HIGH)
                    logger.info(f"TRACKING {sat_name}: az={pos['azimuth']:.1f} "
                                f"el={pos['elevation']:.1f} alt={pos['altitude_km']:.0f}km "
                                f"sig={signal.get('signal_db', -99):.1f}dB")
                else:
                    if HAS_GPIO:
                        GPIO.output(TRACKING_LED, GPIO.LOW)
            time.sleep(5)

    except KeyboardInterrupt:
        logger.info(f"Stopped. {len(tracker.passes)} passes logged.")
        if HAS_GPIO:
            az_pwm.stop()
            el_pwm.stop()
            GPIO.cleanup()


if __name__ == "__main__":
    main()
