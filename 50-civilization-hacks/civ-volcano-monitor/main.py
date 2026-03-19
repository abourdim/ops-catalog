#!/usr/bin/env python3
"""Volcano Monitor — RPi Seismo-Acoustic-RF Monitoring Station
Monitors volcanic activity using seismic sensors, infrasound,
and RF emission anomalies for eruption early warning.
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

PIPE_PATH = "/tmp/sdr_volcano_pipe"
LOG_PATH = os.path.expanduser("~/volcano_logs/")
ALERT_LEVELS = {"green": 0, "yellow": 1, "orange": 2, "red": 3}

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    SEISMIC_ADC = 17
    INFRASOUND_ADC = 27
    ALERT_LED_G = 5
    ALERT_LED_Y = 6
    ALERT_LED_R = 13
    BUZZER = 19
    for pin in [ALERT_LED_G, ALERT_LED_Y, ALERT_LED_R, BUZZER]:
        GPIO.setup(pin, GPIO.OUT)
    HAS_GPIO = True
except Exception:
    HAS_GPIO = False


class VolcanoMonitor:
    def __init__(self):
        self.seismic_history = deque(maxlen=1000)
        self.rf_history = deque(maxlen=1000)
        self.tremor_count = 0
        self.alert_level = "green"
        self.baseline_seismic = None
        self.baseline_rf = None

    def calibrate(self, seismic_rms, rf_noise):
        self.baseline_seismic = seismic_rms
        self.baseline_rf = rf_noise
        logger.info(f"Calibrated: seismic={seismic_rms:.4f} rf={rf_noise:.1f}dB")

    def analyze(self, seismic_rms, infrasound_db, rf_anomaly_score):
        self.seismic_history.append(seismic_rms)
        self.rf_history.append(rf_anomaly_score)
        indicators = {}
        if self.baseline_seismic:
            seismic_ratio = seismic_rms / (self.baseline_seismic + 1e-12)
            indicators["seismic_ratio"] = float(seismic_ratio)
            if seismic_ratio > 3:
                self.tremor_count += 1
        indicators["infrasound_db"] = float(infrasound_db)
        indicators["rf_anomaly"] = float(rf_anomaly_score)
        indicators["tremor_count_1h"] = self.tremor_count
        avg_rf = np.mean(list(self.rf_history)[-60:]) if self.rf_history else 0
        indicators["avg_rf_anomaly"] = float(avg_rf)
        self._update_alert_level(indicators)
        indicators["alert_level"] = self.alert_level
        return indicators

    def _update_alert_level(self, ind):
        sr = ind.get("seismic_ratio", 1)
        rf = ind.get("avg_rf_anomaly", 0)
        inf = ind.get("infrasound_db", 0)
        if sr > 10 or (rf > 0.8 and sr > 5):
            self.alert_level = "red"
        elif sr > 5 or rf > 0.6 or inf > 90:
            self.alert_level = "orange"
        elif sr > 2 or rf > 0.3 or self.tremor_count > 10:
            self.alert_level = "yellow"
        else:
            self.alert_level = "green"
        self._set_alert_leds()

    def _set_alert_leds(self):
        if not HAS_GPIO:
            return
        GPIO.output(ALERT_LED_G, self.alert_level == "green")
        GPIO.output(ALERT_LED_Y, self.alert_level in ["yellow", "orange", "red"])
        GPIO.output(ALERT_LED_R, self.alert_level in ["orange", "red"])
        if self.alert_level == "red":
            GPIO.output(BUZZER, GPIO.HIGH)
            time.sleep(0.1)
            GPIO.output(BUZZER, GPIO.LOW)

    def save_log(self, indicators):
        os.makedirs(LOG_PATH, exist_ok=True)
        entry = {"timestamp": datetime.now().isoformat(), **indicators}
        with open(os.path.join(LOG_PATH, "monitor.jsonl"), 'a') as f:
            f.write(json.dumps(entry) + "\n")


def read_seismic():
    return np.random.exponential(0.001) + 0.001


def read_infrasound():
    return 60 + np.random.normal(0, 10) + (30 if np.random.rand() < 0.02 else 0)


def read_rf_pipe():
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(512)
            if raw:
                return json.loads(raw.decode())
        except Exception:
            pass
    return {"rf_anomaly": np.random.uniform(0, 0.3)}


def main():
    logger.info("=== Volcano Monitor — RPi Station ===")
    monitor = VolcanoMonitor()
    logger.info("Calibrating (10s)...")
    cal_s, cal_r = [], []
    for _ in range(10):
        cal_s.append(read_seismic())
        cal_r.append(read_rf_pipe().get("rf_anomaly", 0))
        time.sleep(0.5)
    monitor.calibrate(np.mean(cal_s), np.mean(cal_r))

    try:
        cycle = 0
        while True:
            seismic = read_seismic()
            infrasound = read_infrasound()
            rf_data = read_rf_pipe()
            result = monitor.analyze(seismic, infrasound, rf_data.get("rf_anomaly", 0))
            cycle += 1
            logger.info(f"[{result['alert_level'].upper()}] S={result.get('seismic_ratio', 0):.1f}x | "
                        f"Inf={result['infrasound_db']:.0f}dB | RF={result['rf_anomaly']:.2f} | "
                        f"Tremors={result['tremor_count_1h']}")
            if cycle % 30 == 0:
                monitor.save_log(result)
            time.sleep(2)
    except KeyboardInterrupt:
        logger.info(f"Stopped. Alert: {monitor.alert_level}")
        if HAS_GPIO:
            GPIO.cleanup()


if __name__ == "__main__":
    main()
