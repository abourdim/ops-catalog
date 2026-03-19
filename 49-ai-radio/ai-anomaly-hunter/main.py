#!/usr/bin/env python3
"""Anomaly Hunter — RPi ML Inference Engine
Detects unusual/anomalous signals in the RF spectrum using
autoencoder-based anomaly detection and statistical methods.
"""

import numpy as np
import time
import json
import os
import logging
from datetime import datetime
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift
from collections import deque

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

MODEL_PATH = os.path.expanduser("~/models/anomaly_autoencoder.tflite")
SAMPLE_RATE = 2.4e6
FFT_SIZE = 1024
HISTORY_SIZE = 500
ANOMALY_THRESHOLD = 2.5
ALERT_LOG = os.path.expanduser("~/anomaly_alerts/")
PIPE_PATH = "/tmp/sdr_anomaly_pipe"


class AnomalyDetector:
    """Autoencoder + statistical anomaly detection for RF signals."""

    def __init__(self, model_path):
        self.interpreter = None
        self.spectrum_history = deque(maxlen=HISTORY_SIZE)
        self.mean_spectrum = None
        self.std_spectrum = None
        self.anomaly_count = 0
        self._load_model(model_path)

    def _load_model(self, model_path):
        try:
            import tflite_runtime.interpreter as tflite
            self.interpreter = tflite.Interpreter(model_path=model_path)
            self.interpreter.allocate_tensors()
            self.input_details = self.interpreter.get_input_details()
            self.output_details = self.interpreter.get_output_details()
            logger.info("Autoencoder model loaded")
        except Exception as e:
            logger.warning(f"Model unavailable: {e}. Using statistical detection.")

    def update_baseline(self, spectrum):
        """Update running baseline statistics."""
        self.spectrum_history.append(spectrum)
        if len(self.spectrum_history) >= 10:
            history_array = np.array(self.spectrum_history)
            self.mean_spectrum = np.mean(history_array, axis=0)
            self.std_spectrum = np.std(history_array, axis=0) + 1e-6

    def detect_statistical(self, spectrum):
        """Detect anomalies using z-score method."""
        if self.mean_spectrum is None:
            return 0.0, np.array([])
        z_scores = np.abs(spectrum - self.mean_spectrum) / self.std_spectrum
        max_z = float(np.max(z_scores))
        anomalous_bins = np.where(z_scores > ANOMALY_THRESHOLD)[0]
        return max_z, anomalous_bins

    def detect_autoencoder(self, spectrum):
        """Detect anomalies using autoencoder reconstruction error."""
        if self.interpreter is None:
            return 0.0
        input_data = spectrum.reshape(self.input_details[0]['shape']).astype(np.float32)
        self.interpreter.set_tensor(self.input_details[0]['index'], input_data)
        self.interpreter.invoke()
        reconstructed = self.interpreter.get_tensor(self.output_details[0]['index']).flatten()
        mse = np.mean((spectrum[:len(reconstructed)] - reconstructed) ** 2)
        return float(mse)

    def classify_anomaly(self, spectrum, anomalous_bins):
        """Classify the type of anomaly detected."""
        if len(anomalous_bins) == 0:
            return "none"
        spread = anomalous_bins[-1] - anomalous_bins[0] if len(anomalous_bins) > 1 else 0
        if spread < 5:
            return "narrowband_spike"
        elif spread < FFT_SIZE // 4:
            return "wideband_burst"
        elif len(anomalous_bins) > FFT_SIZE // 2:
            return "broadband_interference"
        else:
            return "unusual_pattern"

    def analyze(self, spectrum):
        """Run full anomaly analysis pipeline."""
        z_score, anomalous_bins = self.detect_statistical(spectrum)
        ae_error = self.detect_autoencoder(spectrum)
        anomaly_type = self.classify_anomaly(spectrum, anomalous_bins)
        is_anomaly = z_score > ANOMALY_THRESHOLD or ae_error > 0.1
        if is_anomaly:
            self.anomaly_count += 1
        self.update_baseline(spectrum)
        return {
            "is_anomaly": is_anomaly,
            "z_score": round(z_score, 3),
            "ae_error": round(ae_error, 5),
            "anomaly_type": anomaly_type,
            "num_anomalous_bins": len(anomalous_bins),
            "anomaly_count": self.anomaly_count,
        }


def compute_spectrum(iq_samples, fft_size=FFT_SIZE):
    """Compute power spectrum from IQ samples."""
    num_avg = max(1, len(iq_samples) // fft_size)
    psd = np.zeros(fft_size)
    window = np.hanning(fft_size)
    for i in range(num_avg):
        segment = iq_samples[i * fft_size:(i + 1) * fft_size]
        if len(segment) < fft_size:
            break
        spectrum = fftshift(fft(segment * window))
        psd += np.abs(spectrum) ** 2
    psd /= num_avg
    return 10 * np.log10(psd + 1e-12)


def read_iq_pipe(num_samples=FFT_SIZE * 64):
    """Read IQ from SDR pipe."""
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(num_samples * 8)
            if len(raw) >= 8:
                return np.frombuffer(raw, dtype=np.complex64)
        except Exception:
            pass
    t = np.arange(num_samples) / SAMPLE_RATE
    base = 0.01 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    if np.random.rand() < 0.15:
        f_anom = np.random.uniform(-SAMPLE_RATE/4, SAMPLE_RATE/4)
        base += 0.5 * np.exp(2j * np.pi * f_anom * t)
    return base.astype(np.complex64)


def save_alert(result, spectrum):
    """Save anomaly alert to disk."""
    os.makedirs(ALERT_LOG, exist_ok=True)
    alert = {
        "timestamp": datetime.now().isoformat(),
        **result,
        "spectrum_peak_db": float(np.max(spectrum)),
        "spectrum_mean_db": float(np.mean(spectrum)),
    }
    fname = datetime.now().strftime("anomaly_%Y%m%d_%H%M%S.json")
    with open(os.path.join(ALERT_LOG, fname), 'w') as f:
        json.dump(alert, f, indent=2)


def main():
    logger.info("=== Anomaly Hunter — RPi ML Engine ===")
    detector = AnomalyDetector(MODEL_PATH)
    logger.info(f"Building baseline... (need {10} spectra)")

    try:
        cycle = 0
        while True:
            iq = read_iq_pipe()
            spectrum = compute_spectrum(iq)
            result = detector.analyze(spectrum)
            cycle += 1

            if result["is_anomaly"]:
                logger.warning(f"ANOMALY #{result['anomaly_count']}: "
                               f"{result['anomaly_type']} | z={result['z_score']:.1f} | "
                               f"AE={result['ae_error']:.4f} | bins={result['num_anomalous_bins']}")
                save_alert(result, spectrum)
            elif cycle % 10 == 0:
                logger.info(f"Normal | baseline={len(detector.spectrum_history)} spectra | "
                            f"total anomalies={result['anomaly_count']}")

            time.sleep(0.3)

    except KeyboardInterrupt:
        logger.info(f"Stopped. Total anomalies: {detector.anomaly_count}")


if __name__ == "__main__":
    main()
