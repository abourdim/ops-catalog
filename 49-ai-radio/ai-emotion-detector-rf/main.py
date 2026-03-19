#!/usr/bin/env python3
"""Emotion Detector RF — RPi ML Inference Engine
Detects human emotional states from RF micro-Doppler signatures.
Analyzes breathing rate, heart rate, and body micro-movements via radar.
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

MODEL_PATH = os.path.expanduser("~/models/emotion_rf.tflite")
PIPE_PATH = "/tmp/sdr_emotion_pipe"
SAMPLE_RATE = 2.4e6
EMOTION_CLASSES = ["calm", "stressed", "anxious", "happy", "angry", "sad", "focused"]
VITALS_WINDOW_SEC = 10


class EmotionDetector:
    """RF-based emotion detection using vital signs and micro-Doppler."""

    def __init__(self, model_path):
        self.interpreter = None
        self.vital_buffer = []
        self.emotion_history = []
        self._load_model(model_path)

    def _load_model(self, model_path):
        try:
            import tflite_runtime.interpreter as tflite
            self.interpreter = tflite.Interpreter(model_path=model_path)
            self.interpreter.allocate_tensors()
            self.input_det = self.interpreter.get_input_details()
            self.output_det = self.interpreter.get_output_details()
            logger.info("Emotion model loaded")
        except Exception as e:
            logger.warning(f"Model unavailable: {e}. Using vital sign heuristics.")

    def extract_vitals(self, iq_samples):
        """Extract breathing and heart rate from phase variations."""
        phase = np.unwrap(np.angle(iq_samples))
        phase_detrended = phase - np.polyval(np.polyfit(np.arange(len(phase)), phase, 1),
                                              np.arange(len(phase)))
        # Breathing: 0.1-0.5 Hz
        b_breath, a_breath = scipy_signal.butter(4, [0.1, 0.5], btype='band',
                                                  fs=SAMPLE_RATE / 256)
        decimated = scipy_signal.decimate(phase_detrended, 256)
        if len(decimated) > len(b_breath) * 3:
            breathing = scipy_signal.lfilter(b_breath, a_breath, decimated)
            breath_fft = np.abs(fft(breathing))
            freq_axis = np.fft.fftfreq(len(breathing), d=256 / SAMPLE_RATE)
            pos_mask = freq_axis > 0.05
            if np.any(pos_mask):
                breath_rate = float(freq_axis[pos_mask][np.argmax(breath_fft[pos_mask])]) * 60
            else:
                breath_rate = 15.0
        else:
            breath_rate = 15.0

        # Heart: 0.8-2.0 Hz
        b_heart, a_heart = scipy_signal.butter(4, [0.8, 2.0], btype='band',
                                                fs=SAMPLE_RATE / 256)
        if len(decimated) > len(b_heart) * 3:
            heartbeat = scipy_signal.lfilter(b_heart, a_heart, decimated)
            heart_fft = np.abs(fft(heartbeat))
            freq_axis_h = np.fft.fftfreq(len(heartbeat), d=256 / SAMPLE_RATE)
            pos_mask_h = freq_axis_h > 0.5
            if np.any(pos_mask_h):
                heart_rate = float(freq_axis_h[pos_mask_h][np.argmax(heart_fft[pos_mask_h])]) * 60
            else:
                heart_rate = 72.0
        else:
            heart_rate = 72.0

        body_movement = float(np.std(np.diff(phase_detrended)))
        return {
            "breathing_rate_bpm": round(np.clip(breath_rate, 8, 40), 1),
            "heart_rate_bpm": round(np.clip(heart_rate, 45, 180), 1),
            "body_movement_index": round(body_movement, 6),
            "phase_variance": float(np.var(phase_detrended)),
        }

    def classify_emotion(self, vitals_series):
        """Classify emotional state from vital sign time series."""
        if len(vitals_series) < 5:
            return "calm", 0.5, np.ones(len(EMOTION_CLASSES)) / len(EMOTION_CLASSES)

        feature_vec = []
        for v in vitals_series[-10:]:
            feature_vec.extend([v["breathing_rate_bpm"], v["heart_rate_bpm"],
                                v["body_movement_index"]])
        feature_array = np.array(feature_vec, dtype=np.float32)

        if self.interpreter is not None:
            input_data = feature_array.reshape(self.input_det[0]['shape'])
            self.interpreter.set_tensor(self.input_det[0]['index'], input_data)
            self.interpreter.invoke()
            probs = self.interpreter.get_tensor(self.output_det[0]['index']).flatten()
        else:
            probs = self._heuristic_emotion(vitals_series[-5:])

        idx = np.argmax(probs)
        return EMOTION_CLASSES[idx], float(probs[idx]), probs

    def _heuristic_emotion(self, vitals):
        """Rule-based emotion estimation."""
        avg_hr = np.mean([v["heart_rate_bpm"] for v in vitals])
        avg_br = np.mean([v["breathing_rate_bpm"] for v in vitals])
        avg_move = np.mean([v["body_movement_index"] for v in vitals])
        probs = np.ones(len(EMOTION_CLASSES)) * 0.05
        if avg_hr > 100 and avg_br > 20:
            probs[1] += 0.4  # stressed
        elif avg_hr > 90 and avg_move > 0.01:
            probs[2] += 0.3  # anxious
        elif avg_hr < 70 and avg_br < 14:
            probs[0] += 0.5  # calm
        elif avg_move > 0.005:
            probs[3] += 0.3  # happy
        else:
            probs[6] += 0.3  # focused
        probs /= np.sum(probs)
        return probs


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
    breathing = 0.001 * np.sin(2 * np.pi * 0.25 * t)
    heartbeat = 0.0002 * np.sin(2 * np.pi * 1.2 * t)
    phase = breathing + heartbeat + np.random.uniform(0, 0.0005) * np.random.randn(num_samples)
    return (np.exp(1j * phase) * 0.5).astype(np.complex64)


def main():
    logger.info("=== Emotion Detector RF — RPi ML Engine ===")
    detector = EmotionDetector(MODEL_PATH)
    vitals_series = []

    try:
        while True:
            iq = read_iq_pipe()
            vitals = detector.extract_vitals(iq)
            vitals_series.append(vitals)
            emotion, confidence, probs = detector.classify_emotion(vitals_series)
            logger.info(f"Emotion: {emotion} ({confidence:.0%}) | "
                        f"HR={vitals['heart_rate_bpm']}bpm | "
                        f"BR={vitals['breathing_rate_bpm']}bpm | "
                        f"Move={vitals['body_movement_index']:.5f}")
            time.sleep(0.5)

    except KeyboardInterrupt:
        logger.info("Stopped.")


if __name__ == "__main__":
    main()
