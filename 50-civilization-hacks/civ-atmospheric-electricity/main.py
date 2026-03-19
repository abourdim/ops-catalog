#!/usr/bin/env python3
"""Atmospheric Electricity — RPi Lightning & Electric Field Monitor
Monitors atmospheric electric field, detects lightning strikes,
and maps thunderstorm activity using field mill and RF sensors.
"""

import numpy as np
import time
import json
import os
import logging
from datetime import datetime
from collections import deque
from scipy import signal as scipy_signal

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

PIPE_PATH = "/tmp/sdr_atmos_pipe"
LOG_PATH = os.path.expanduser("~/atmospheric_logs/")
FAIR_WEATHER_FIELD = 120
STORM_THRESHOLD = 2000

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    FIELD_MILL_ADC = 17
    LIGHTNING_DETECTOR = 27
    ALERT_LED = 18
    WIND_SPEED = 22
    RAIN_GAUGE = 23
    GPIO.setup(LIGHTNING_DETECTOR, GPIO.IN)
    GPIO.setup(ALERT_LED, GPIO.OUT)
    HAS_GPIO = True
    strike_count = 0
    def lightning_callback(channel):
        global strike_count
        strike_count += 1
    GPIO.add_event_detect(LIGHTNING_DETECTOR, GPIO.RISING, callback=lightning_callback, bouncetime=50)
except Exception:
    HAS_GPIO = False
    strike_count = 0


class AtmosphericMonitor:
    def __init__(self):
        self.field_history = deque(maxlen=3600)
        self.lightning_history = deque(maxlen=1000)
        self.storm_active = False
        self.total_strikes = 0
        self.baseline_field = FAIR_WEATHER_FIELD

    def read_field_mill(self):
        """Read atmospheric electric field (V/m)."""
        field = self.baseline_field + np.random.normal(0, 20)
        if np.random.rand() < 0.05:
            field += np.random.choice([-1, 1]) * np.random.uniform(500, 5000)
        return float(field)

    def process_reading(self, field_vm, lightning_count, rf_sferics):
        """Process atmospheric electricity reading."""
        self.field_history.append(field_vm)
        indicators = {
            "field_vm": round(field_vm, 1),
            "field_polarity": "positive" if field_vm > 0 else "negative",
            "field_deviation": round(abs(field_vm - self.baseline_field), 1),
            "lightning_rate_min": lightning_count,
            "rf_sferic_rate": rf_sferics,
        }
        if abs(field_vm) > STORM_THRESHOLD or lightning_count > 5:
            if not self.storm_active:
                self.storm_active = True
                logger.warning("THUNDERSTORM DETECTED!")
                if HAS_GPIO:
                    GPIO.output(ALERT_LED, GPIO.HIGH)
            indicators["storm_active"] = True
            indicators["storm_distance_km"] = self._estimate_distance(lightning_count, rf_sferics)
        else:
            if self.storm_active and abs(field_vm) < STORM_THRESHOLD / 2:
                self.storm_active = False
                if HAS_GPIO:
                    GPIO.output(ALERT_LED, GPIO.LOW)
            indicators["storm_active"] = False
        self.total_strikes += lightning_count
        indicators["total_strikes"] = self.total_strikes
        return indicators

    def _estimate_distance(self, strike_count, sferic_rate):
        """Estimate storm distance from lightning characteristics."""
        if strike_count == 0:
            return 50.0
        flash_ratio = sferic_rate / (strike_count + 1)
        distance = max(1, 30 / (strike_count + 1) + flash_ratio * 5)
        return round(distance, 1)

    def get_trend(self, window=30):
        if len(self.field_history) < window:
            return "insufficient"
        recent = list(self.field_history)[-window:]
        slope = np.polyfit(range(len(recent)), recent, 1)[0]
        if abs(slope) < 10:
            return "stable"
        return "increasing" if slope > 0 else "decreasing"

    def save_log(self, reading):
        os.makedirs(LOG_PATH, exist_ok=True)
        entry = {"timestamp": datetime.now().isoformat(), **reading}
        with open(os.path.join(LOG_PATH, "atmos.jsonl"), 'a') as f:
            f.write(json.dumps(entry) + "\n")


def read_rf_sferics():
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(512)
            if raw:
                return json.loads(raw.decode())
        except Exception:
            pass
    return {"sferic_count": np.random.poisson(2)}


def get_lightning_count():
    global strike_count
    if HAS_GPIO:
        count = strike_count
        strike_count = 0
        return count
    return np.random.poisson(0.5)


def main():
    logger.info("=== Atmospheric Electricity — RPi Field Monitor ===")
    monitor = AtmosphericMonitor()
    try:
        cycle = 0
        while True:
            field = monitor.read_field_mill()
            strikes = get_lightning_count()
            rf = read_rf_sferics()
            result = monitor.process_reading(field, strikes, rf.get("sferic_count", 0))
            trend = monitor.get_trend()
            cycle += 1
            storm_str = "STORM" if result.get("storm_active") else "fair"
            logger.info(f"[{storm_str}] E={result['field_vm']:.0f}V/m ({result['field_polarity']}) | "
                        f"Lightning={strikes}/min sferics={rf.get('sferic_count', 0)} | "
                        f"trend={trend} total={result['total_strikes']}")
            if result.get("storm_active") and "storm_distance_km" in result:
                logger.info(f"  Storm distance: ~{result['storm_distance_km']:.0f}km")
            if cycle % 30 == 0:
                monitor.save_log(result)
            time.sleep(2)
    except KeyboardInterrupt:
        logger.info(f"Stopped. {monitor.total_strikes} total strikes recorded.")
        if HAS_GPIO:
            GPIO.cleanup()


if __name__ == "__main__":
    main()
