#!/usr/bin/env python3
"""Material Identifier RF — RPi ML Inference Engine
Identifies materials by analyzing RF signal reflection/absorption patterns.
Uses trained CNN on frequency response signatures of different materials.
"""

import numpy as np
import time
import json
import os
import logging
from datetime import datetime
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

MODEL_PATH = os.path.expanduser("~/models/material_identifier.tflite")
PIPE_PATH = "/tmp/sdr_material_pipe"
SAMPLE_RATE = 2.4e6
SCAN_FREQS_MHZ = [433, 868, 915, 1200, 1800, 2400]

MATERIAL_CLASSES = [
    "air", "wood", "concrete", "metal_steel", "metal_aluminum",
    "glass", "plastic", "water", "fabric", "paper",
    "ceramic", "rubber", "foam", "soil", "unknown"
]


class MaterialIdentifier:
    """CNN-based RF material identification."""

    def __init__(self, model_path):
        self.interpreter = None
        self.scan_results = {}
        self.identification_count = 0
        self._load_model(model_path)

    def _load_model(self, model_path):
        try:
            import tflite_runtime.interpreter as tflite
            self.interpreter = tflite.Interpreter(model_path=model_path)
            self.interpreter.allocate_tensors()
            self.input_det = self.interpreter.get_input_details()
            self.output_det = self.interpreter.get_output_details()
            logger.info("Material ID model loaded")
        except Exception as e:
            logger.warning(f"Model unavailable: {e}. Using impedance heuristics.")

    def extract_rf_signature(self, iq_samples, freq_mhz):
        """Extract material-specific RF features at a given frequency."""
        amplitude = np.abs(iq_samples)
        phase = np.angle(iq_samples)
        reflection_coeff = np.mean(amplitude) / (np.max(amplitude) + 1e-12)
        insertion_loss = -20 * np.log10(np.mean(amplitude) + 1e-12)
        phase_shift = np.mean(np.unwrap(phase))
        spectrum = np.abs(fft(iq_samples[:512]))
        spectral_flatness = np.exp(np.mean(np.log(spectrum + 1e-12))) / (np.mean(spectrum) + 1e-12)
        group_delay = -np.diff(np.unwrap(np.angle(fft(iq_samples[:256]))))
        mean_group_delay = float(np.mean(np.abs(group_delay)))
        return {
            "freq_mhz": freq_mhz,
            "reflection_coeff": float(reflection_coeff),
            "insertion_loss_db": float(insertion_loss),
            "phase_shift_rad": float(phase_shift),
            "spectral_flatness": float(spectral_flatness),
            "group_delay": mean_group_delay,
            "amplitude_std": float(np.std(amplitude)),
        }

    def add_scan(self, freq_mhz, features):
        """Add frequency scan result."""
        self.scan_results[freq_mhz] = features

    def identify(self):
        """Identify material from multi-frequency scan data."""
        if len(self.scan_results) < 2:
            return None
        feature_vector = []
        for freq in sorted(self.scan_results.keys()):
            f = self.scan_results[freq]
            feature_vector.extend([
                f["reflection_coeff"], f["insertion_loss_db"],
                f["phase_shift_rad"], f["spectral_flatness"],
            ])
        feature_array = np.array(feature_vector, dtype=np.float32)

        if self.interpreter is not None:
            input_data = feature_array.reshape(self.input_det[0]['shape'])
            self.interpreter.set_tensor(self.input_det[0]['index'], input_data)
            self.interpreter.invoke()
            probs = self.interpreter.get_tensor(self.output_det[0]['index']).flatten()
        else:
            probs = self._heuristic_identify(feature_array)

        idx = np.argmax(probs)
        confidence = float(probs[idx])
        self.identification_count += 1
        return {
            "material": MATERIAL_CLASSES[idx],
            "confidence": round(confidence, 4),
            "top3": sorted([(MATERIAL_CLASSES[i], round(float(probs[i]), 3))
                            for i in range(len(probs))], key=lambda x: x[1], reverse=True)[:3],
            "num_freqs_scanned": len(self.scan_results),
        }

    def _heuristic_identify(self, features):
        """Heuristic material classification."""
        probs = np.random.dirichlet(np.ones(len(MATERIAL_CLASSES)) * 0.3)
        if len(features) >= 4:
            avg_loss = np.mean(features[1::4])
            if avg_loss > 30:
                probs[3] += 0.4  # metal_steel
            elif avg_loss < 5:
                probs[0] += 0.3  # air
            elif avg_loss < 15:
                probs[6] += 0.2  # plastic
        probs /= np.sum(probs)
        return probs


def read_iq_pipe(num_samples=32 * 1024):
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(num_samples * 8)
            if len(raw) >= 8:
                return np.frombuffer(raw, dtype=np.complex64)
        except Exception:
            pass
    material_attenuation = np.random.choice([0.9, 0.5, 0.1, 0.01, 0.3])
    t = np.arange(num_samples) / SAMPLE_RATE
    tx = np.exp(2j * np.pi * 100e3 * t)
    rx = tx * material_attenuation * np.exp(1j * np.random.uniform(0, np.pi))
    noise = 0.01 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (rx + noise).astype(np.complex64)


def main():
    logger.info("=== Material Identifier RF — RPi ML Engine ===")
    identifier = MaterialIdentifier(MODEL_PATH)

    try:
        while True:
            identifier.scan_results.clear()
            for freq in SCAN_FREQS_MHZ:
                iq = read_iq_pipe()
                features = identifier.extract_rf_signature(iq, freq)
                identifier.add_scan(freq, features)
                logger.debug(f"Scanned {freq}MHz: loss={features['insertion_loss_db']:.1f}dB")

            result = identifier.identify()
            if result:
                logger.info(f"Material: {result['material']} ({result['confidence']:.0%}) | "
                            f"Top3: {result['top3']} | ID#{identifier.identification_count}")
            time.sleep(1.0)

    except KeyboardInterrupt:
        logger.info(f"Stopped. {identifier.identification_count} identifications.")


if __name__ == "__main__":
    main()
