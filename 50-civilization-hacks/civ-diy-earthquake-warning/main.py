#!/usr/bin/env python3
"""DIY Earthquake Warning — RPi Seismic P-Wave Detector
Detects P-waves from earthquakes using accelerometer/geophone sensors.
Provides seconds of warning before destructive S-waves arrive.
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

PIPE_PATH = "/tmp/sdr_earthquake_pipe"
LOG_PATH = os.path.expanduser("~/earthquake_logs/")
P_WAVE_SPEED_KMS = 6.0
S_WAVE_SPEED_KMS = 3.5
SAMPLE_RATE_SEISMIC = 100

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    ACCEL_INT = 17
    ALERT_SIREN = 18
    STROBE_LED = 23
    RELAY_GAS = 24
    RELAY_POWER = 25
    GPIO.setup(ALERT_SIREN, GPIO.OUT)
    GPIO.setup(STROBE_LED, GPIO.OUT)
    GPIO.setup(RELAY_GAS, GPIO.OUT)
    GPIO.setup(RELAY_POWER, GPIO.OUT)
    HAS_GPIO = True
except Exception:
    HAS_GPIO = False


class EarthquakeDetector:
    def __init__(self):
        self.baseline_rms = None
        self.history = deque(maxlen=6000)
        self.sta_lta_ratio = deque(maxlen=100)
        self.events = []
        self.alarm_active = False

    def calibrate(self, samples):
        self.baseline_rms = np.sqrt(np.mean(samples ** 2))
        logger.info(f"Calibrated: baseline RMS={self.baseline_rms:.6f}")

    def sta_lta(self, data, sta_len=5, lta_len=50):
        """Short-Term Average / Long-Term Average trigger."""
        sta_samples = sta_len * SAMPLE_RATE_SEISMIC
        lta_samples = lta_len * SAMPLE_RATE_SEISMIC
        if len(data) < lta_samples:
            return 0
        data_sq = data ** 2
        sta = np.mean(data_sq[-sta_samples:])
        lta = np.mean(data_sq[-lta_samples:]) + 1e-12
        ratio = sta / lta
        self.sta_lta_ratio.append(ratio)
        return float(ratio)

    def detect_p_wave(self, accel_data):
        """Detect P-wave arrival using STA/LTA and frequency analysis."""
        self.history.extend(accel_data.tolist())
        if len(self.history) < 100:
            return None
        data = np.array(list(self.history))
        ratio = self.sta_lta(data)
        if ratio < 4.0:
            return None
        spectrum = np.abs(np.fft.fft(data[-500:]))
        freqs = np.fft.fftfreq(500, 1.0 / SAMPLE_RATE_SEISMIC)
        p_wave_band = (np.abs(freqs) > 1) & (np.abs(freqs) < 10)
        p_energy = np.mean(spectrum[p_wave_band]) if np.any(p_wave_band) else 0
        s_wave_band = (np.abs(freqs) > 0.1) & (np.abs(freqs) < 1)
        s_energy = np.mean(spectrum[s_wave_band]) if np.any(s_wave_band) else 0
        if p_energy > s_energy * 2:
            magnitude_est = 2 + np.log10(ratio) * 1.5
            return {"type": "p_wave", "sta_lta": round(ratio, 2),
                    "magnitude_est": round(magnitude_est, 1),
                    "p_energy": float(p_energy), "warning_time_s": round((1/P_WAVE_SPEED_KMS - 1/S_WAVE_SPEED_KMS) * 50, 1)}
        return None

    def trigger_alarm(self, event):
        self.alarm_active = True
        self.events.append({**event, "timestamp": datetime.now().isoformat()})
        if HAS_GPIO:
            GPIO.output(ALERT_SIREN, GPIO.HIGH)
            GPIO.output(STROBE_LED, GPIO.HIGH)
            GPIO.output(RELAY_GAS, GPIO.HIGH)
        logger.warning(f"EARTHQUAKE! Mag~{event['magnitude_est']} Warning={event['warning_time_s']}s")
        os.makedirs(LOG_PATH, exist_ok=True)
        with open(os.path.join(LOG_PATH, "events.jsonl"), 'a') as f:
            f.write(json.dumps(self.events[-1]) + "\n")

    def reset_alarm(self):
        if self.alarm_active:
            self.alarm_active = False
            if HAS_GPIO:
                GPIO.output(ALERT_SIREN, GPIO.LOW)
                GPIO.output(STROBE_LED, GPIO.LOW)


def read_accelerometer():
    base = np.random.randn(SAMPLE_RATE_SEISMIC) * 0.001
    if np.random.rand() < 0.02:
        arrival = np.random.randint(0, len(base) - 20)
        p_wave = 0.05 * np.sin(2 * np.pi * 5 * np.arange(20) / SAMPLE_RATE_SEISMIC)
        base[arrival:arrival + 20] += p_wave
    return base.astype(np.float32)


def read_rf_anomalies():
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(512)
            if raw:
                return json.loads(raw.decode())
        except Exception:
            pass
    return {"vlf_anomaly": np.random.uniform(0, 0.2)}


def main():
    logger.info("=== DIY Earthquake Warning — RPi P-Wave Detector ===")
    detector = EarthquakeDetector()
    cal_data = np.concatenate([read_accelerometer() for _ in range(5)])
    detector.calibrate(cal_data)
    try:
        while True:
            accel = read_accelerometer()
            rf = read_rf_anomalies()
            event = detector.detect_p_wave(accel)
            if event:
                detector.trigger_alarm(event)
            else:
                detector.reset_alarm()
            ratio = detector.sta_lta_ratio[-1] if detector.sta_lta_ratio else 0
            status = "ALARM" if detector.alarm_active else "monitoring"
            if detector.alarm_active or len(detector.history) % 500 == 0:
                logger.info(f"[{status}] STA/LTA={ratio:.2f} | VLF={rf.get('vlf_anomaly', 0):.2f} | "
                            f"Events={len(detector.events)}")
            time.sleep(1)
    except KeyboardInterrupt:
        detector.reset_alarm()
        logger.info(f"Stopped. {len(detector.events)} events detected.")
        if HAS_GPIO:
            GPIO.cleanup()


if __name__ == "__main__":
    main()
