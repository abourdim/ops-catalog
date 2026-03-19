#!/usr/bin/env python3
"""Person Counting WiFi — RPi ML Inference Engine
Counts people in a room using WiFi signal attenuation and CSI patterns.
Non-invasive, privacy-preserving occupancy monitoring.
"""

import numpy as np
import time
import json
import os
import logging
from datetime import datetime
from scipy import signal as scipy_signal
from collections import deque

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

MODEL_PATH = os.path.expanduser("~/models/person_counter.tflite")
PIPE_PATH = "/tmp/sdr_person_pipe"
LOG_PATH = os.path.expanduser("~/occupancy_logs/")
MAX_PERSONS = 20
WINDOW_SIZE = 50
SAMPLE_RATE = 2.4e6


class PersonCounter:
    """ML-based WiFi person counting."""

    def __init__(self, model_path):
        self.interpreter = None
        self.csi_history = deque(maxlen=WINDOW_SIZE)
        self.count_history = deque(maxlen=100)
        self.baseline_rssi = None
        self.calibrated = False
        self._load_model(model_path)

    def _load_model(self, model_path):
        try:
            import tflite_runtime.interpreter as tflite
            self.interpreter = tflite.Interpreter(model_path=model_path)
            self.interpreter.allocate_tensors()
            self.input_det = self.interpreter.get_input_details()
            self.output_det = self.interpreter.get_output_details()
            logger.info("Person counting model loaded")
        except Exception as e:
            logger.warning(f"Model unavailable: {e}. Using RSSI regression.")

    def calibrate(self, empty_room_rssi):
        """Set baseline RSSI for empty room."""
        self.baseline_rssi = empty_room_rssi
        self.calibrated = True
        logger.info(f"Calibrated: baseline RSSI = {empty_room_rssi:.1f} dB")

    def extract_features(self, iq_samples):
        """Extract features from WiFi channel measurements."""
        amplitude = np.abs(iq_samples)
        rssi = 10 * np.log10(np.mean(amplitude ** 2) + 1e-12)
        fft_data = np.abs(np.fft.fft(iq_samples[:1024]))
        spectral_spread = np.std(fft_data) / (np.mean(fft_data) + 1e-12)
        fade_rate = np.mean(np.abs(np.diff(amplitude)))
        phase = np.angle(iq_samples)
        phase_variance = np.var(np.diff(np.unwrap(phase)))
        features = {
            "rssi": float(rssi),
            "spectral_spread": float(spectral_spread),
            "fade_rate": float(fade_rate),
            "phase_variance": float(phase_variance),
            "amplitude_std": float(np.std(amplitude)),
            "amplitude_kurtosis": float(
                np.mean((amplitude - np.mean(amplitude))**4) / (np.std(amplitude)**4 + 1e-12)
            ),
        }
        self.csi_history.append(features)
        return features

    def count(self, features):
        """Estimate person count from features."""
        if self.interpreter is not None and len(self.csi_history) >= 10:
            recent = list(self.csi_history)[-10:]
            feature_vec = np.array([[f["rssi"], f["spectral_spread"], f["fade_rate"],
                                     f["phase_variance"]] for f in recent], dtype=np.float32)
            input_data = feature_vec.reshape(self.input_det[0]['shape'])
            self.interpreter.set_tensor(self.input_det[0]['index'], input_data)
            self.interpreter.invoke()
            count = self.interpreter.get_tensor(self.output_det[0]['index']).flatten()[0]
            count = max(0, min(MAX_PERSONS, round(float(count))))
        else:
            count = self._rssi_regression(features)

        self.count_history.append(count)
        smoothed = int(round(np.median(list(self.count_history)[-5:])))
        return smoothed

    def _rssi_regression(self, features):
        """Simple RSSI-based person estimation."""
        if not self.calibrated or self.baseline_rssi is None:
            return 0
        rssi_drop = self.baseline_rssi - features["rssi"]
        estimated = max(0, rssi_drop / 2.5)
        estimated += features["fade_rate"] * 50
        return min(MAX_PERSONS, int(round(estimated)))

    def get_stats(self):
        """Get occupancy statistics."""
        if not self.count_history:
            return {}
        counts = list(self.count_history)
        return {
            "current": counts[-1],
            "average": round(np.mean(counts), 1),
            "max_seen": int(np.max(counts)),
            "min_seen": int(np.min(counts)),
        }


def read_iq_pipe(num_samples=64 * 1024):
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(num_samples * 8)
            if len(raw) >= 8:
                return np.frombuffer(raw, dtype=np.complex64)
        except Exception:
            pass
    t = np.arange(num_samples) / SAMPLE_RATE
    base = np.exp(2j * np.pi * 50e3 * t) * 0.5
    n_people = np.random.randint(0, 8)
    attenuation = 1.0 - n_people * 0.04
    fading = 1 + 0.02 * n_people * np.sin(2 * np.pi * np.random.uniform(0.5, 3) * t)
    noise = 0.03 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (base * attenuation * fading + noise).astype(np.complex64)


def log_occupancy(count, stats):
    os.makedirs(LOG_PATH, exist_ok=True)
    entry = {"timestamp": datetime.now().isoformat(), "count": count, **stats}
    log_file = os.path.join(LOG_PATH, datetime.now().strftime("%Y%m%d") + ".jsonl")
    with open(log_file, 'a') as f:
        f.write(json.dumps(entry) + "\n")


def main():
    logger.info("=== Person Counting WiFi — RPi ML Engine ===")
    counter = PersonCounter(MODEL_PATH)
    logger.info("Calibrating with first 10 readings...")
    calibration_rssi = []

    try:
        cycle = 0
        while True:
            iq = read_iq_pipe()
            features = counter.extract_features(iq)

            if cycle < 10:
                calibration_rssi.append(features["rssi"])
                if cycle == 9:
                    counter.calibrate(np.mean(calibration_rssi))
                cycle += 1
                time.sleep(0.5)
                continue

            count = counter.count(features)
            stats = counter.get_stats()
            cycle += 1
            logger.info(f"Occupancy: {count} persons | RSSI={features['rssi']:.1f}dB | "
                        f"fade={features['fade_rate']:.4f} | avg={stats.get('average', 0)}")
            if cycle % 60 == 0:
                log_occupancy(count, stats)
            time.sleep(0.5)

    except KeyboardInterrupt:
        logger.info(f"Stopped. Final stats: {counter.get_stats()}")


if __name__ == "__main__":
    main()
