#!/usr/bin/env python3
"""Deepfake Voice Detector — RPi ML Inference Engine
Detects AI-generated/cloned voices in radio communications using
spectral analysis and neural network classification.
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

MODEL_PATH = os.path.expanduser("~/models/deepfake_detector.tflite")
SAMPLE_RATE = 16000
FRAME_SIZE = 512
HOP_SIZE = 160
N_MELS = 80
PIPE_PATH = "/tmp/sdr_voice_pipe"
ALERT_LOG = os.path.expanduser("~/deepfake_alerts/")


class DeepfakeDetector:
    """Neural network deepfake voice detector."""

    def __init__(self, model_path):
        self.interpreter = None
        self.detection_count = 0
        self.total_analyzed = 0
        self._load_model(model_path)
        self._init_mel_banks()

    def _load_model(self, model_path):
        try:
            import tflite_runtime.interpreter as tflite
            self.interpreter = tflite.Interpreter(model_path=model_path)
            self.interpreter.allocate_tensors()
            self.input_det = self.interpreter.get_input_details()
            self.output_det = self.interpreter.get_output_details()
            logger.info("Deepfake model loaded")
        except Exception as e:
            logger.warning(f"Model unavailable: {e}. Using heuristic detection.")

    def _init_mel_banks(self):
        """Initialize mel filterbank for feature extraction."""
        n_fft = FRAME_SIZE
        n_filters = N_MELS
        low_freq = 80
        high_freq = SAMPLE_RATE // 2
        low_mel = 2595 * np.log10(1 + low_freq / 700)
        high_mel = 2595 * np.log10(1 + high_freq / 700)
        mel_points = np.linspace(low_mel, high_mel, n_filters + 2)
        hz_points = 700 * (10 ** (mel_points / 2595) - 1)
        bin_points = np.floor((n_fft + 1) * hz_points / SAMPLE_RATE).astype(int)
        self.mel_banks = np.zeros((n_filters, n_fft // 2 + 1))
        for i in range(n_filters):
            for j in range(bin_points[i], bin_points[i + 1]):
                if j < self.mel_banks.shape[1]:
                    self.mel_banks[i, j] = (j - bin_points[i]) / max(1, bin_points[i + 1] - bin_points[i])
            for j in range(bin_points[i + 1], min(bin_points[i + 2], self.mel_banks.shape[1])):
                self.mel_banks[i, j] = (bin_points[i + 2] - j) / max(1, bin_points[i + 2] - bin_points[i + 1])

    def extract_mel_spectrogram(self, audio):
        """Extract log mel spectrogram features."""
        num_frames = (len(audio) - FRAME_SIZE) // HOP_SIZE + 1
        mel_spec = np.zeros((num_frames, N_MELS))
        window = np.hanning(FRAME_SIZE)
        for i in range(num_frames):
            frame = audio[i * HOP_SIZE:i * HOP_SIZE + FRAME_SIZE]
            spectrum = np.abs(fft(frame * window)[:FRAME_SIZE // 2 + 1]) ** 2
            mel_spec[i] = np.dot(self.mel_banks, spectrum)
        mel_spec = np.log(mel_spec + 1e-8)
        return mel_spec.astype(np.float32)

    def extract_artifacts(self, audio):
        """Extract deepfake-specific artifacts."""
        spectrum = np.abs(fft(audio))[:len(audio) // 2]
        high_freq_energy = np.mean(spectrum[len(spectrum) * 3 // 4:])
        low_freq_energy = np.mean(spectrum[:len(spectrum) // 4]) + 1e-12
        spectral_tilt = high_freq_energy / low_freq_energy
        phase = np.angle(fft(audio))[:len(audio) // 2]
        phase_coherence = np.abs(np.mean(np.exp(1j * np.diff(phase))))
        frames = audio[:len(audio) // FRAME_SIZE * FRAME_SIZE].reshape(-1, FRAME_SIZE)
        frame_energies = np.sum(frames ** 2, axis=1)
        energy_variance = np.var(frame_energies) / (np.mean(frame_energies) + 1e-12)
        zcr = np.mean(np.abs(np.diff(np.sign(audio))) / 2)
        return {
            "spectral_tilt": float(spectral_tilt),
            "phase_coherence": float(phase_coherence),
            "energy_variance": float(energy_variance),
            "zero_crossing_rate": float(zcr),
        }

    def detect(self, audio):
        """Run deepfake detection on audio segment."""
        self.total_analyzed += 1
        mel = self.extract_mel_spectrogram(audio)
        artifacts = self.extract_artifacts(audio)

        if self.interpreter is not None:
            input_data = mel.reshape(self.input_det[0]['shape']).astype(np.float32)
            self.interpreter.set_tensor(self.input_det[0]['index'], input_data)
            self.interpreter.invoke()
            output = self.interpreter.get_tensor(self.output_det[0]['index'])
            fake_score = float(output.flatten()[0])
        else:
            fake_score = self._heuristic_score(artifacts)

        is_fake = fake_score > 0.5
        if is_fake:
            self.detection_count += 1

        return {
            "is_deepfake": is_fake,
            "confidence": round(fake_score if is_fake else 1 - fake_score, 4),
            "fake_score": round(fake_score, 4),
            "artifacts": artifacts,
            "detection_count": self.detection_count,
            "total_analyzed": self.total_analyzed,
        }

    def _heuristic_score(self, artifacts):
        """Heuristic deepfake scoring when model unavailable."""
        score = 0.0
        if artifacts["phase_coherence"] > 0.8:
            score += 0.3
        if artifacts["spectral_tilt"] < 0.01:
            score += 0.2
        if artifacts["energy_variance"] < 0.1:
            score += 0.2
        score += np.random.uniform(0, 0.15)
        return min(1.0, score)


def read_audio_pipe():
    """Read audio from SDR demodulator pipe."""
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(SAMPLE_RATE * 2 * 3)
            return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
        except Exception:
            pass
    duration = 3.0
    t = np.arange(int(SAMPLE_RATE * duration)) / SAMPLE_RATE
    harmonics = sum(np.sin(2 * np.pi * f * t) / f for f in [200, 400, 600, 800])
    return (harmonics / np.max(np.abs(harmonics)) * 0.8).astype(np.float32)


def save_alert(result):
    """Save deepfake detection alert."""
    os.makedirs(ALERT_LOG, exist_ok=True)
    alert = {"timestamp": datetime.now().isoformat(), **result}
    fname = datetime.now().strftime("deepfake_%Y%m%d_%H%M%S.json")
    with open(os.path.join(ALERT_LOG, fname), 'w') as f:
        json.dump(alert, f, indent=2)


def main():
    logger.info("=== Deepfake Voice Detector — RPi ML Engine ===")
    detector = DeepfakeDetector(MODEL_PATH)

    try:
        while True:
            audio = read_audio_pipe()
            if np.mean(audio ** 2) < 1e-6:
                time.sleep(0.5)
                continue
            result = detector.detect(audio)
            if result["is_deepfake"]:
                logger.warning(f"DEEPFAKE DETECTED! conf={result['confidence']:.2%} | "
                               f"tilt={result['artifacts']['spectral_tilt']:.4f} | "
                               f"phase={result['artifacts']['phase_coherence']:.3f}")
                save_alert(result)
            else:
                logger.info(f"Authentic | conf={result['confidence']:.2%} | "
                            f"#{result['total_analyzed']}")
            time.sleep(0.5)

    except KeyboardInterrupt:
        logger.info(f"Stopped. {detector.detection_count}/{detector.total_analyzed} deepfakes detected.")


if __name__ == "__main__":
    main()
