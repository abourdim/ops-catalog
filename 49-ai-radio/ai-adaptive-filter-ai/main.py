#!/usr/bin/env python3
"""Adaptive Filter AI — RPi ML Inference Engine
Neural network-enhanced adaptive filtering for interference cancellation,
noise reduction, and signal extraction in challenging RF environments.
"""

import numpy as np
import time
import json
import os
import logging
from datetime import datetime
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

MODEL_PATH = os.path.expanduser("~/models/adaptive_filter.tflite")
SAMPLE_RATE = 2.4e6
FILTER_LENGTH = 128
BLOCK_SIZE = 1024
PIPE_PATH = "/tmp/sdr_filter_pipe"
OUTPUT_PIPE = "/tmp/sdr_filtered_pipe"


class NeuralAdaptiveFilter:
    """ML-enhanced adaptive filter combining LMS with neural prediction."""

    def __init__(self, model_path, filter_length=FILTER_LENGTH):
        self.filter_length = filter_length
        self.weights = np.zeros(filter_length, dtype=np.complex64)
        self.mu = 0.01
        self.interpreter = None
        self.error_history = []
        self.convergence_rate = 0
        self._load_model(model_path)

    def _load_model(self, model_path):
        try:
            import tflite_runtime.interpreter as tflite
            self.interpreter = tflite.Interpreter(model_path=model_path)
            self.interpreter.allocate_tensors()
            self.input_det = self.interpreter.get_input_details()
            self.output_det = self.interpreter.get_output_details()
            logger.info("Neural filter model loaded")
        except Exception as e:
            logger.warning(f"Model unavailable: {e}. Using pure LMS.")

    def lms_update(self, x_block, d_block):
        """Standard LMS adaptive filter step."""
        output = np.zeros(len(d_block), dtype=np.complex64)
        error = np.zeros(len(d_block), dtype=np.complex64)
        x_padded = np.concatenate([np.zeros(self.filter_length - 1, dtype=np.complex64), x_block])
        for n in range(len(d_block)):
            x_vec = x_padded[n:n + self.filter_length][::-1]
            output[n] = np.dot(self.weights, x_vec)
            error[n] = d_block[n] - output[n]
            self.weights += self.mu * np.conj(x_vec) * error[n]
        return output, error

    def nlms_update(self, x_block, d_block):
        """Normalized LMS for faster convergence."""
        output = np.zeros(len(d_block), dtype=np.complex64)
        error = np.zeros(len(d_block), dtype=np.complex64)
        x_padded = np.concatenate([np.zeros(self.filter_length - 1, dtype=np.complex64), x_block])
        eps = 1e-8
        for n in range(len(d_block)):
            x_vec = x_padded[n:n + self.filter_length][::-1]
            output[n] = np.dot(self.weights, x_vec)
            error[n] = d_block[n] - output[n]
            norm = np.dot(x_vec, np.conj(x_vec)).real + eps
            self.weights += (self.mu / norm) * np.conj(x_vec) * error[n]
        return output, error

    def neural_predict_mu(self, error_block):
        """Use neural network to predict optimal step size."""
        if self.interpreter is None:
            return self.mu
        error_features = np.array([
            np.mean(np.abs(error_block) ** 2),
            np.std(np.abs(error_block)),
            np.max(np.abs(error_block)),
            self.convergence_rate,
        ], dtype=np.float32)
        input_data = error_features.reshape(self.input_det[0]['shape'])
        self.interpreter.set_tensor(self.input_det[0]['index'], input_data)
        self.interpreter.invoke()
        optimal_mu = self.interpreter.get_tensor(self.output_det[0]['index']).flatten()[0]
        return float(np.clip(optimal_mu, 1e-6, 0.5))

    def process(self, reference, desired):
        """Full processing pipeline with neural adaptation."""
        output, error = self.nlms_update(reference, desired)
        mse = float(np.mean(np.abs(error) ** 2))
        self.error_history.append(mse)
        if len(self.error_history) > 2:
            self.convergence_rate = (self.error_history[-2] - mse) / (self.error_history[-2] + 1e-12)
        self.mu = self.neural_predict_mu(error)
        if len(self.error_history) > 500:
            self.error_history = self.error_history[-200:]
        return output, error, mse

    def get_frequency_response(self):
        """Get current filter frequency response."""
        freq_resp = fftshift(fft(self.weights, 512))
        return 20 * np.log10(np.abs(freq_resp) + 1e-12)


def read_iq_pipe(num_samples=BLOCK_SIZE):
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
    desired = 0.3 * np.exp(2j * np.pi * 50e3 * t)
    interference = 0.5 * np.exp(2j * np.pi * 200e3 * t)
    noise = 0.02 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (desired + interference + noise).astype(np.complex64)


def generate_reference(iq_samples):
    """Generate reference signal for interference estimation."""
    b, a = scipy_signal.butter(4, 0.3, btype='high')
    return scipy_signal.lfilter(b, a, iq_samples).astype(np.complex64)


def sinr_estimate(original, filtered):
    """Estimate signal-to-interference-plus-noise ratio improvement."""
    sig_power = np.mean(np.abs(filtered) ** 2)
    noise_power = np.mean(np.abs(original - filtered) ** 2) + 1e-12
    return float(10 * np.log10(sig_power / noise_power))


def main():
    logger.info("=== Adaptive Filter AI — RPi ML Engine ===")
    filt = NeuralAdaptiveFilter(MODEL_PATH)
    blocks = 0

    try:
        while True:
            iq = read_iq_pipe()
            reference = generate_reference(iq)
            output, error, mse = filt.process(reference, iq)
            sinr = sinr_estimate(iq, error)
            blocks += 1
            logger.info(f"Block {blocks}: MSE={mse:.6f} | mu={filt.mu:.5f} | "
                        f"SINR={sinr:.1f}dB | conv={filt.convergence_rate:.4f}")
            time.sleep(0.1)

    except KeyboardInterrupt:
        logger.info(f"Stopped after {blocks} blocks. Final MSE={filt.error_history[-1]:.6f}")


if __name__ == "__main__":
    main()
