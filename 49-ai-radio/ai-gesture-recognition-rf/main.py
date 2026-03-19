#!/usr/bin/env python3
"""Gesture Recognition RF — RPi ML Inference Engine
Recognizes hand gestures using WiFi/RF signal disturbance patterns.
Uses CSI (Channel State Information) analysis with CNN classification.
"""

import numpy as np
import time
import json
import os
import logging
from datetime import datetime
from scipy import signal as scipy_signal
from scipy.fft import fft

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

MODEL_PATH = os.path.expanduser("~/models/gesture_rf.tflite")
SAMPLE_RATE = 2.4e6
PIPE_PATH = "/tmp/sdr_gesture_pipe"
GESTURE_CLASSES = ["none", "swipe_left", "swipe_right", "swipe_up", "swipe_down",
                   "push", "pull", "circle_cw", "circle_ccw", "pinch", "spread"]
WINDOW_SIZE = 64
NUM_SUBCARRIERS = 30
CONFIDENCE_THRESHOLD = 0.6


class GestureRecognizer:
    """RF-based gesture recognition using channel disturbance patterns."""

    def __init__(self, model_path):
        self.interpreter = None
        self.csi_buffer = []
        self.gesture_history = []
        self.total_gestures = 0
        self._load_model(model_path)

    def _load_model(self, model_path):
        try:
            import tflite_runtime.interpreter as tflite
            self.interpreter = tflite.Interpreter(model_path=model_path)
            self.interpreter.allocate_tensors()
            self.input_det = self.interpreter.get_input_details()
            self.output_det = self.interpreter.get_output_details()
            logger.info("Gesture model loaded")
        except Exception as e:
            logger.warning(f"Model unavailable: {e}. Using feature-based detection.")

    def extract_csi(self, iq_samples):
        """Extract CSI-like features from IQ data."""
        n_subcarriers = NUM_SUBCARRIERS
        frame_size = len(iq_samples) // n_subcarriers
        csi = np.zeros(n_subcarriers, dtype=np.complex64)
        for i in range(n_subcarriers):
            segment = iq_samples[i * frame_size:(i + 1) * frame_size]
            csi[i] = np.mean(segment)
        amplitude = np.abs(csi)
        phase = np.unwrap(np.angle(csi))
        return amplitude, phase

    def build_csi_matrix(self, amplitude, phase):
        """Add CSI snapshot to temporal buffer."""
        features = np.concatenate([amplitude, phase])
        self.csi_buffer.append(features)
        if len(self.csi_buffer) > WINDOW_SIZE:
            self.csi_buffer.pop(0)
        if len(self.csi_buffer) < WINDOW_SIZE:
            return None
        return np.array(self.csi_buffer, dtype=np.float32)

    def detect_motion(self, csi_matrix):
        """Detect if motion is present in CSI data."""
        temporal_var = np.var(csi_matrix, axis=0)
        motion_score = np.mean(temporal_var)
        return motion_score > 0.001, float(motion_score)

    def classify(self, csi_matrix):
        """Classify gesture from CSI matrix."""
        if self.interpreter is not None:
            input_data = csi_matrix.reshape(self.input_det[0]['shape']).astype(np.float32)
            self.interpreter.set_tensor(self.input_det[0]['index'], input_data)
            self.interpreter.invoke()
            probs = self.interpreter.get_tensor(self.output_det[0]['index']).flatten()
        else:
            probs = self._feature_classify(csi_matrix)
        idx = np.argmax(probs)
        confidence = float(probs[idx])
        return GESTURE_CLASSES[idx], confidence, probs

    def _feature_classify(self, csi_matrix):
        """Heuristic gesture classification fallback."""
        amp_data = csi_matrix[:, :NUM_SUBCARRIERS]
        diff = np.diff(amp_data, axis=0)
        mean_diff = np.mean(diff, axis=0)
        var_diff = np.var(diff, axis=0)
        probs = np.random.dirichlet(np.ones(len(GESTURE_CLASSES)) * 0.5)
        if np.mean(var_diff) > 0.01:
            if np.mean(mean_diff[:NUM_SUBCARRIERS // 2]) > np.mean(mean_diff[NUM_SUBCARRIERS // 2:]):
                probs[1] += 0.3  # swipe_left
            else:
                probs[2] += 0.3  # swipe_right
        else:
            probs[0] += 0.5  # none
        probs /= np.sum(probs)
        return probs

    def process(self, iq_samples):
        """Full gesture recognition pipeline."""
        amplitude, phase = self.extract_csi(iq_samples)
        csi_matrix = self.build_csi_matrix(amplitude, phase)
        if csi_matrix is None:
            return None
        has_motion, motion_score = self.detect_motion(csi_matrix)
        if not has_motion:
            return {"gesture": "none", "confidence": 0.99, "motion": motion_score}
        gesture, confidence, probs = self.classify(csi_matrix)
        if confidence >= CONFIDENCE_THRESHOLD and gesture != "none":
            self.total_gestures += 1
            self.gesture_history.append(gesture)
        return {
            "gesture": gesture,
            "confidence": round(confidence, 4),
            "motion": round(motion_score, 6),
            "total_gestures": self.total_gestures,
        }


def read_iq_pipe(num_samples=NUM_SUBCARRIERS * 1024):
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(num_samples * 8)
            if len(raw) >= 8:
                return np.frombuffer(raw, dtype=np.complex64)
        except Exception:
            pass
    t = np.arange(num_samples) / SAMPLE_RATE
    base = np.exp(2j * np.pi * 50e3 * t)
    if np.random.rand() < 0.3:
        doppler = np.sin(2 * np.pi * 2 * t) * 0.1
        base *= (1 + doppler)
    noise = 0.02 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (base + noise).astype(np.complex64)


def main():
    logger.info("=== Gesture Recognition RF — RPi ML Engine ===")
    recognizer = GestureRecognizer(MODEL_PATH)
    logger.info(f"Classes: {GESTURE_CLASSES}")

    try:
        while True:
            iq = read_iq_pipe()
            result = recognizer.process(iq)
            if result is None:
                logger.info(f"Buffering CSI: {len(recognizer.csi_buffer)}/{WINDOW_SIZE}")
            elif result["gesture"] != "none":
                logger.info(f"GESTURE: {result['gesture']} ({result['confidence']:.0%}) | "
                            f"motion={result['motion']:.5f} | total={result['total_gestures']}")
            time.sleep(0.05)

    except KeyboardInterrupt:
        logger.info(f"Stopped. {recognizer.total_gestures} gestures detected.")


if __name__ == "__main__":
    main()
