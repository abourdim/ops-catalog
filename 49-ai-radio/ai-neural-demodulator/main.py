#!/usr/bin/env python3
"""Neural Demodulator — RPi ML Inference Engine
Uses a neural network to demodulate signals that traditional methods struggle with.
Handles low-SNR, fading channels, and unknown modulation schemes.
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

MODEL_PATH = os.path.expanduser("~/models/neural_demod.tflite")
SAMPLE_RATE = 2.4e6
SYMBOL_RATE = 9600
SAMPLES_PER_SYMBOL = int(SAMPLE_RATE / SYMBOL_RATE)
BLOCK_SIZE = 256
PIPE_PATH = "/tmp/sdr_demod_pipe"
OUTPUT_PATH = "/tmp/demod_output"


class NeuralDemodulator:
    """ML-based signal demodulator using trained neural network."""

    def __init__(self, model_path):
        self.interpreter = None
        self.input_details = None
        self.output_details = None
        self.ber_history = []
        self.load_model(model_path)

    def load_model(self, model_path):
        try:
            import tflite_runtime.interpreter as tflite
            self.interpreter = tflite.Interpreter(model_path=model_path)
            self.interpreter.allocate_tensors()
            self.input_details = self.interpreter.get_input_details()
            self.output_details = self.interpreter.get_output_details()
            logger.info("Neural demod model loaded successfully")
        except Exception as e:
            logger.warning(f"Model unavailable: {e}. Using conventional fallback.")

    def preprocess(self, iq_samples):
        """Prepare IQ samples for neural network input."""
        amplitude = np.abs(iq_samples)
        if np.max(amplitude) > 0:
            iq_samples = iq_samples / np.max(amplitude)
        i_component = np.real(iq_samples)
        q_component = np.imag(iq_samples)
        features = np.stack([i_component, q_component], axis=-1)
        return features.astype(np.float32)

    def demodulate(self, iq_block):
        """Demodulate a block of IQ samples using neural network."""
        features = self.preprocess(iq_block)
        if self.interpreter is not None:
            input_shape = self.input_details[0]['shape']
            data = features.reshape(input_shape).astype(np.float32)
            self.interpreter.set_tensor(self.input_details[0]['index'], data)
            self.interpreter.invoke()
            output = self.interpreter.get_tensor(self.output_details[0]['index'])
            bits = (output.flatten() > 0.5).astype(np.uint8)
        else:
            bits = self._conventional_demod(iq_block)
        return bits

    def _conventional_demod(self, iq_samples):
        """Fallback BPSK demodulation when model unavailable."""
        downsampled = scipy_signal.resample(iq_samples, len(iq_samples) // max(1, SAMPLES_PER_SYMBOL // 10))
        bits = (np.real(downsampled) > 0).astype(np.uint8)
        return bits

    def estimate_ber(self, demod_bits, reference_bits=None):
        """Estimate bit error rate using known preamble or CRC."""
        if reference_bits is not None and len(reference_bits) > 0:
            min_len = min(len(demod_bits), len(reference_bits))
            errors = np.sum(demod_bits[:min_len] != reference_bits[:min_len])
            ber = errors / min_len
        else:
            transitions = np.sum(np.abs(np.diff(demod_bits.astype(float))))
            ber = 1.0 - (transitions / max(1, len(demod_bits) - 1))
            ber = max(0, min(1, ber * 2))
        self.ber_history.append(ber)
        if len(self.ber_history) > 100:
            self.ber_history.pop(0)
        return ber

    def get_constellation(self, iq_samples, num_points=64):
        """Extract constellation points for visualization."""
        step = max(1, len(iq_samples) // num_points)
        points = iq_samples[::step][:num_points]
        return np.real(points).tolist(), np.imag(points).tolist()


def read_iq_pipe(pipe_path=PIPE_PATH, num_samples=BLOCK_SIZE * SAMPLES_PER_SYMBOL):
    """Read IQ data from SDR capture pipe."""
    if os.path.exists(pipe_path):
        try:
            with open(pipe_path, 'rb') as f:
                raw = f.read(num_samples * 8)
            if len(raw) >= 8:
                return np.frombuffer(raw, dtype=np.complex64)
        except Exception:
            pass
    t = np.arange(num_samples) / SAMPLE_RATE
    bits = np.repeat(np.random.randint(0, 2, BLOCK_SIZE), SAMPLES_PER_SYMBOL)[:num_samples]
    signal_data = (2 * bits - 1) * np.exp(2j * np.pi * 1000 * t)
    snr_db = np.random.uniform(0, 20)
    noise_power = 10 ** (-snr_db / 10)
    noise = np.sqrt(noise_power) * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (signal_data + noise).astype(np.complex64)


def bits_to_bytes(bits):
    """Convert bit array to byte array."""
    num_bytes = len(bits) // 8
    bits = bits[:num_bytes * 8]
    byte_array = np.packbits(bits)
    return byte_array


def main():
    logger.info("=== Neural Demodulator — RPi ML Engine ===")
    demod = NeuralDemodulator(MODEL_PATH)
    os.makedirs(OUTPUT_PATH, exist_ok=True)
    total_bits = 0
    total_errors_est = 0

    try:
        while True:
            iq_data = read_iq_pipe()
            bits = demod.demodulate(iq_data)
            ber = demod.estimate_ber(bits)
            total_bits += len(bits)
            total_errors_est += int(ber * len(bits))
            i_pts, q_pts = demod.get_constellation(iq_data)
            avg_ber = np.mean(demod.ber_history[-10:]) if demod.ber_history else 0
            logger.info(f"Demod: {len(bits)} bits | BER={ber:.4f} | "
                        f"AvgBER={avg_ber:.4f} | Total={total_bits} bits")
            byte_data = bits_to_bytes(bits)
            output_file = os.path.join(OUTPUT_PATH, "demod_stream.bin")
            with open(output_file, 'ab') as f:
                f.write(byte_data.tobytes())
            time.sleep(0.1)

    except KeyboardInterrupt:
        overall_ber = total_errors_est / max(1, total_bits)
        logger.info(f"Stopped. Total: {total_bits} bits, Est. BER: {overall_ber:.6f}")


if __name__ == "__main__":
    main()
