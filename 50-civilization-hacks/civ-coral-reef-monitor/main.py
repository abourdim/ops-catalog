#!/usr/bin/env python3
"""Coral Reef Monitor — RPi Underwater Sensor Hub
Collects and processes acoustic/RF data from reef monitoring buoys.
Tracks reef health via sound ecology, temperature, and pH sensors.
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

PIPE_PATH = "/tmp/sdr_coral_pipe"
LOG_PATH = os.path.expanduser("~/coral_reef_logs/")
HEALTH_THRESHOLDS = {"temp_c_max": 30, "ph_min": 7.8, "acoustic_index_min": 0.3}

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    TEMP_SENSOR = 4
    PH_SENSOR = 17
    TURBIDITY = 27
    ALERT_LED = 18
    GPIO.setup(ALERT_LED, GPIO.OUT)
    HAS_GPIO = True
except Exception:
    HAS_GPIO = False


class CoralReefMonitor:
    def __init__(self):
        self.readings = deque(maxlen=5000)
        self.health_score = 1.0
        self.alerts = []

    def read_sensors(self):
        """Read environmental sensors (simulated on non-RPi)."""
        return {
            "temperature_c": 26 + np.random.normal(0, 2),
            "ph": 8.1 + np.random.normal(0, 0.2),
            "turbidity_ntu": max(0, 5 + np.random.normal(0, 3)),
            "salinity_ppt": 35 + np.random.normal(0, 1),
            "dissolved_o2_ppm": max(0, 7 + np.random.normal(0, 1)),
        }

    def analyze_acoustic_health(self, audio_data):
        """Compute acoustic complexity index from reef sounds."""
        if audio_data is None or len(audio_data) < 1024:
            return {"aci": 0.5, "species_richness_est": 5}
        from scipy.fft import fft
        spectrum = np.abs(fft(audio_data[:4096]))
        psd_norm = spectrum / (np.sum(spectrum) + 1e-12)
        aci = -np.sum(psd_norm * np.log2(psd_norm + 1e-12)) / np.log2(len(psd_norm))
        freq_bands = spectrum.reshape(-1, 64)
        active_bands = np.sum(np.max(freq_bands, axis=1) > np.mean(spectrum) * 2)
        return {"aci": float(aci), "species_richness_est": int(active_bands)}

    def compute_health_score(self, env, acoustic):
        """Compute overall reef health score 0-1."""
        score = 1.0
        if env["temperature_c"] > HEALTH_THRESHOLDS["temp_c_max"]:
            score -= 0.3 * (env["temperature_c"] - HEALTH_THRESHOLDS["temp_c_max"]) / 5
        if env["ph"] < HEALTH_THRESHOLDS["ph_min"]:
            score -= 0.2 * (HEALTH_THRESHOLDS["ph_min"] - env["ph"]) / 0.5
        if acoustic["aci"] < HEALTH_THRESHOLDS["acoustic_index_min"]:
            score -= 0.3
        if env["dissolved_o2_ppm"] < 4:
            score -= 0.2
        self.health_score = max(0, min(1, score))
        return self.health_score

    def check_alerts(self, env):
        alerts = []
        if env["temperature_c"] > 29:
            alerts.append("BLEACHING_RISK")
        if env["ph"] < 7.9:
            alerts.append("ACIDIFICATION")
        if env["dissolved_o2_ppm"] < 4:
            alerts.append("HYPOXIA")
        if alerts and HAS_GPIO:
            GPIO.output(ALERT_LED, GPIO.HIGH)
        elif HAS_GPIO:
            GPIO.output(ALERT_LED, GPIO.LOW)
        return alerts

    def save_reading(self, env, acoustic, health):
        entry = {"timestamp": datetime.now().isoformat(), **env, **acoustic,
                 "health_score": round(health, 3)}
        self.readings.append(entry)
        os.makedirs(LOG_PATH, exist_ok=True)
        with open(os.path.join(LOG_PATH, "readings.jsonl"), 'a') as f:
            f.write(json.dumps(entry) + "\n")


def read_audio_from_sdr():
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(8192)
            if len(raw) >= 4:
                return np.frombuffer(raw, dtype=np.float32)
        except Exception:
            pass
    return np.random.randn(4096).astype(np.float32) * 0.1


def main():
    logger.info("=== Coral Reef Monitor — RPi Sensor Hub ===")
    monitor = CoralReefMonitor()
    try:
        while True:
            env = monitor.read_sensors()
            audio = read_audio_from_sdr()
            acoustic = monitor.analyze_acoustic_health(audio)
            health = monitor.compute_health_score(env, acoustic)
            alerts = monitor.check_alerts(env)
            monitor.save_reading(env, acoustic, health)
            status = "ALERT" if alerts else "OK"
            logger.info(f"[{status}] Health={health:.0%} | T={env['temperature_c']:.1f}C "
                        f"pH={env['ph']:.2f} O2={env['dissolved_o2_ppm']:.1f}ppm | "
                        f"ACI={acoustic['aci']:.2f} species~{acoustic['species_richness_est']}")
            if alerts:
                logger.warning(f"Alerts: {alerts}")
            time.sleep(10)
    except KeyboardInterrupt:
        logger.info(f"Stopped. {len(monitor.readings)} readings logged.")
        if HAS_GPIO:
            GPIO.cleanup()


if __name__ == "__main__":
    main()
