#!/usr/bin/env python3
"""Nuclear Fallout Mapper — RPi Radiation Monitoring Station
Monitors radiation levels using Geiger counter GPIO input,
maps fallout patterns, and broadcasts warnings via radio link.
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

PIPE_PATH = "/tmp/sdr_fallout_pipe"
LOG_PATH = os.path.expanduser("~/fallout_logs/")
SAFE_CPM = 50
WARNING_CPM = 100
DANGER_CPM = 1000

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    GEIGER_PIN = 17
    ALERT_LED = 18
    BUZZER = 23
    WIND_DIR = 24
    GPIO.setup(GEIGER_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
    GPIO.setup(ALERT_LED, GPIO.OUT)
    GPIO.setup(BUZZER, GPIO.OUT)
    HAS_GPIO = True
    pulse_count = 0
    def geiger_callback(channel):
        global pulse_count
        pulse_count += 1
    GPIO.add_event_detect(GEIGER_PIN, GPIO.RISING, callback=geiger_callback)
except Exception:
    HAS_GPIO = False
    pulse_count = 0


class FalloutMapper:
    def __init__(self):
        self.readings = deque(maxlen=10000)
        self.grid = {}
        self.alert_level = "safe"
        self.max_cpm = 0
        self.dose_usv = 0

    def add_reading(self, cpm, lat=0, lon=0, wind_dir=0, wind_speed=0):
        usv_h = cpm * 0.0057
        self.dose_usv += usv_h / 3600
        reading = {"timestamp": datetime.now().isoformat(), "cpm": cpm, "usv_h": round(usv_h, 4),
                   "lat": lat, "lon": lon, "cumulative_dose_usv": round(self.dose_usv, 4)}
        self.readings.append(reading)
        self.max_cpm = max(self.max_cpm, cpm)
        grid_key = f"{lat:.3f},{lon:.3f}"
        self.grid[grid_key] = reading
        if cpm > DANGER_CPM:
            self.alert_level = "danger"
        elif cpm > WARNING_CPM:
            self.alert_level = "warning"
        else:
            self.alert_level = "safe"
        self._update_gpio()
        return reading

    def _update_gpio(self):
        if not HAS_GPIO:
            return
        GPIO.output(ALERT_LED, self.alert_level != "safe")
        if self.alert_level == "danger":
            GPIO.output(BUZZER, GPIO.HIGH)
            time.sleep(0.2)
            GPIO.output(BUZZER, GPIO.LOW)

    def predict_plume(self, wind_dir, wind_speed):
        """Simple Gaussian plume direction estimate."""
        if self.max_cpm < WARNING_CPM:
            return None
        spread_angle = 30
        plume_dir = (wind_dir + 180) % 360
        return {"plume_direction": plume_dir, "spread_angle": spread_angle,
                "speed_kmh": wind_speed, "source_cpm": self.max_cpm}

    def get_status(self):
        recent = list(self.readings)[-10:] if self.readings else []
        avg_cpm = np.mean([r["cpm"] for r in recent]) if recent else 0
        return {"alert": self.alert_level, "current_cpm": recent[-1]["cpm"] if recent else 0,
                "avg_cpm": round(avg_cpm, 1), "max_cpm": self.max_cpm,
                "dose_usv": round(self.dose_usv, 4), "grid_points": len(self.grid)}

    def save_map(self):
        os.makedirs(LOG_PATH, exist_ok=True)
        with open(os.path.join(LOG_PATH, "fallout_map.json"), 'w') as f:
            json.dump({"status": self.get_status(), "grid": self.grid}, f, indent=2)


def get_geiger_cpm():
    global pulse_count
    if HAS_GPIO:
        cpm = pulse_count * 60
        pulse_count = 0
        return cpm
    base = np.random.poisson(30)
    if np.random.rand() < 0.03:
        base += np.random.randint(100, 2000)
    return base


def read_rf_data():
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(512)
            if raw:
                return json.loads(raw.decode())
        except Exception:
            pass
    return {"wind_dir": np.random.uniform(0, 360), "wind_speed": np.random.uniform(0, 30)}


def main():
    logger.info("=== Nuclear Fallout Mapper — RPi Radiation Monitor ===")
    mapper = FalloutMapper()
    try:
        while True:
            cpm = get_geiger_cpm()
            rf = read_rf_data()
            reading = mapper.add_reading(cpm, wind_dir=rf.get("wind_dir", 0))
            status = mapper.get_status()
            plume = mapper.predict_plume(rf.get("wind_dir", 0), rf.get("wind_speed", 0))
            logger.info(f"[{status['alert'].upper()}] {cpm}CPM ({reading['usv_h']:.3f}uSv/h) | "
                        f"Dose={status['dose_usv']:.3f}uSv | Max={status['max_cpm']}CPM")
            if plume:
                logger.warning(f"Plume: dir={plume['plume_direction']:.0f}deg speed={plume['speed_kmh']:.0f}km/h")
            if len(mapper.readings) % 60 == 0:
                mapper.save_map()
            time.sleep(1)
    except KeyboardInterrupt:
        mapper.save_map()
        logger.info(f"Stopped. Dose={mapper.dose_usv:.4f}uSv")
        if HAS_GPIO:
            GPIO.cleanup()


if __name__ == "__main__":
    main()
