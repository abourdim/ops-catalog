#!/usr/bin/env python3
"""Spectrum Predictor — RPi ML Inference Engine
Uses LSTM/transformer models to predict future spectrum occupancy,
enabling proactive frequency management and interference avoidance.
"""

import numpy as np
import time
import json
import os
import logging
from datetime import datetime
from scipy.fft import fft, fftshift
from collections import deque

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

MODEL_PATH = os.path.expanduser("~/models/spectrum_predictor.tflite")
SAMPLE_RATE = 2.4e6
FFT_SIZE = 256
SEQUENCE_LENGTH = 32
PREDICTION_HORIZON = 8
PIPE_PATH = "/tmp/sdr_spectrum_pipe"
PREDICTION_LOG = os.path.expanduser("~/spectrum_predictions/")


class SpectrumPredictor:
    """LSTM-based spectrum occupancy predictor."""

    def __init__(self, model_path):
        self.interpreter = None
        self.history = deque(maxlen=SEQUENCE_LENGTH)
        self.prediction_accuracy = deque(maxlen=100)
        self.last_prediction = None
        self._load_model(model_path)

    def _load_model(self, model_path):
        try:
            import tflite_runtime.interpreter as tflite
            self.interpreter = tflite.Interpreter(model_path=model_path)
            self.interpreter.allocate_tensors()
            self.input_det = self.interpreter.get_input_details()
            self.output_det = self.interpreter.get_output_details()
            logger.info("Predictor model loaded")
        except Exception as e:
            logger.warning(f"Model unavailable: {e}. Using ARIMA fallback.")

    def add_observation(self, spectrum):
        """Add a spectrum observation to history."""
        normalized = (spectrum - np.mean(spectrum)) / (np.std(spectrum) + 1e-6)
        self.history.append(normalized)

    def predict(self):
        """Predict future spectrum states."""
        if len(self.history) < SEQUENCE_LENGTH:
            return None
        sequence = np.array(self.history)
        if self.interpreter is not None:
            input_data = sequence.reshape(self.input_det[0]['shape']).astype(np.float32)
            self.interpreter.set_tensor(self.input_det[0]['index'], input_data)
            self.interpreter.invoke()
            predictions = self.interpreter.get_tensor(self.output_det[0]['index'])
            return predictions.reshape(PREDICTION_HORIZON, FFT_SIZE)
        return self._arima_predict(sequence)

    def _arima_predict(self, sequence):
        """Simple AR prediction fallback."""
        predictions = np.zeros((PREDICTION_HORIZON, FFT_SIZE))
        for bin_idx in range(FFT_SIZE):
            series = sequence[:, bin_idx]
            coeffs = np.polyfit(np.arange(len(series)), series, deg=2)
            for h in range(PREDICTION_HORIZON):
                t = len(series) + h
                predictions[h, bin_idx] = np.polyval(coeffs, t)
        return predictions

    def evaluate_prediction(self, actual_spectrum):
        """Compare previous prediction with actual observation."""
        if self.last_prediction is not None:
            mse = np.mean((self.last_prediction[0] - actual_spectrum) ** 2)
            accuracy = max(0, 1 - mse / (np.var(actual_spectrum) + 1e-6))
            self.prediction_accuracy.append(accuracy)
            return float(accuracy)
        return None

    def get_occupancy_forecast(self, predictions):
        """Convert predictions to occupancy probability map."""
        threshold = 0.0
        occupancy = (predictions > threshold).astype(float)
        occupancy_prob = np.mean(occupancy, axis=0)
        return occupancy_prob

    def find_best_channels(self, occupancy_prob, num_channels=5, channel_bw=10):
        """Find channels predicted to be least occupied."""
        num_bins = len(occupancy_prob)
        channel_scores = []
        for i in range(0, num_bins - channel_bw, channel_bw):
            avg_occ = np.mean(occupancy_prob[i:i + channel_bw])
            channel_scores.append((i, avg_occ))
        channel_scores.sort(key=lambda x: x[1])
        return channel_scores[:num_channels]


def compute_spectrum(iq_samples, fft_size=FFT_SIZE):
    """Compute normalized power spectrum."""
    num_avg = max(1, len(iq_samples) // fft_size)
    psd = np.zeros(fft_size)
    window = np.hanning(fft_size)
    for i in range(min(num_avg, 32)):
        seg = iq_samples[i * fft_size:(i + 1) * fft_size]
        if len(seg) < fft_size:
            break
        spec = fftshift(fft(seg * window))
        psd += np.abs(spec) ** 2
    psd /= min(num_avg, 32)
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
    noise = 0.01 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    for _ in range(np.random.randint(1, 5)):
        f = np.random.uniform(-SAMPLE_RATE / 3, SAMPLE_RATE / 3)
        noise += np.random.uniform(0.05, 0.3) * np.exp(2j * np.pi * f * t)
    return noise.astype(np.complex64)


def save_prediction(prediction_data):
    """Log prediction to disk."""
    os.makedirs(PREDICTION_LOG, exist_ok=True)
    fname = datetime.now().strftime("pred_%Y%m%d_%H%M%S.json")
    with open(os.path.join(PREDICTION_LOG, fname), 'w') as f:
        json.dump(prediction_data, f, indent=2)


def main():
    logger.info("=== Spectrum Predictor — RPi ML Engine ===")
    predictor = SpectrumPredictor(MODEL_PATH)
    logger.info(f"Sequence length: {SEQUENCE_LENGTH}, Horizon: {PREDICTION_HORIZON}")

    try:
        cycle = 0
        while True:
            iq = read_iq_pipe()
            spectrum = compute_spectrum(iq)
            accuracy = predictor.evaluate_prediction(spectrum)
            predictor.add_observation(spectrum)
            predictions = predictor.predict()
            cycle += 1

            if predictions is not None:
                predictor.last_prediction = predictions
                occupancy = predictor.get_occupancy_forecast(predictions)
                best_channels = predictor.find_best_channels(occupancy)
                avg_acc = np.mean(predictor.prediction_accuracy) if predictor.prediction_accuracy else 0

                logger.info(f"Cycle {cycle}: Acc={avg_acc:.1%} | "
                            f"Best ch: {[f'bin{c[0]}({c[1]:.0%})' for c in best_channels[:3]]}")

                if cycle % 30 == 0:
                    save_prediction({
                        "timestamp": datetime.now().isoformat(),
                        "accuracy": round(avg_acc, 4),
                        "best_channels": [(int(c[0]), round(c[1], 3)) for c in best_channels],
                        "mean_occupancy": round(float(np.mean(occupancy)), 3),
                    })
            else:
                logger.info(f"Building history: {len(predictor.history)}/{SEQUENCE_LENGTH}")

            time.sleep(0.5)

    except KeyboardInterrupt:
        avg = np.mean(predictor.prediction_accuracy) if predictor.prediction_accuracy else 0
        logger.info(f"Stopped. Avg accuracy: {avg:.1%}")


if __name__ == "__main__":
    main()
