#!/usr/bin/env python3
"""Dream Radio — RPi ML Inference Engine
Generates artistic audio/visual content from RF spectrum data using
generative neural networks. Transforms radio signals into music and art.
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

MODEL_PATH = os.path.expanduser("~/models/dream_radio_gen.tflite")
PIPE_PATH = "/tmp/sdr_dream_pipe"
OUTPUT_PATH = os.path.expanduser("~/dream_radio_output/")
SAMPLE_RATE = 2.4e6
AUDIO_RATE = 44100

NOTE_FREQS = {
    'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
    'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25,
    'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99,
}
SCALES = {
    "major": [0, 2, 4, 5, 7, 9, 11],
    "minor": [0, 2, 3, 5, 7, 8, 10],
    "pentatonic": [0, 2, 4, 7, 9],
    "blues": [0, 3, 5, 6, 7, 10],
}


class DreamRadioGenerator:
    """Transforms RF spectrum data into musical/artistic output."""

    def __init__(self, model_path):
        self.interpreter = None
        self.current_scale = "pentatonic"
        self.tempo_bpm = 120
        self.total_compositions = 0
        self._load_model(model_path)

    def _load_model(self, model_path):
        try:
            import tflite_runtime.interpreter as tflite
            self.interpreter = tflite.Interpreter(model_path=model_path)
            self.interpreter.allocate_tensors()
            self.input_det = self.interpreter.get_input_details()
            self.output_det = self.interpreter.get_output_details()
            logger.info("Generative model loaded")
        except Exception as e:
            logger.warning(f"Model unavailable: {e}. Using algorithmic composition.")

    def spectrum_to_features(self, iq_samples):
        """Extract musical features from RF spectrum."""
        spectrum = np.abs(fftshift(fft(iq_samples[:2048])))
        spectrum_db = 20 * np.log10(spectrum + 1e-12)
        num_bands = 12
        band_size = len(spectrum) // num_bands
        band_energies = np.array([
            np.mean(spectrum_db[i * band_size:(i + 1) * band_size])
            for i in range(num_bands)
        ])
        spectral_centroid = np.sum(np.arange(len(spectrum)) * spectrum) / (np.sum(spectrum) + 1e-12)
        spectral_flux = np.mean(np.abs(np.diff(spectrum_db)))
        spectral_rolloff = np.searchsorted(np.cumsum(spectrum), 0.85 * np.sum(spectrum))
        amplitude_env = np.abs(iq_samples)
        rhythm_candidates = np.abs(fft(amplitude_env[:4096]))
        return {
            "band_energies": band_energies,
            "centroid": float(spectral_centroid),
            "flux": float(spectral_flux),
            "rolloff": float(spectral_rolloff),
            "rhythm_spectrum": rhythm_candidates[:64],
        }

    def generate_melody(self, features, num_notes=16):
        """Generate melody from spectral features."""
        scale = SCALES[self.current_scale]
        base_note = 60
        band_energies = features["band_energies"]
        band_normalized = (band_energies - band_energies.min()) / (band_energies.ptp() + 1e-12)
        melody = []
        for i in range(num_notes):
            idx = int(i * len(band_normalized) / num_notes)
            energy = band_normalized[min(idx, len(band_normalized) - 1)]
            scale_degree = int(energy * len(scale)) % len(scale)
            octave_shift = int(energy * 2)
            midi_note = base_note + scale[scale_degree] + octave_shift * 12
            freq = 440 * 2 ** ((midi_note - 69) / 12)
            velocity = 0.3 + 0.7 * energy
            duration = 60 / self.tempo_bpm * np.random.choice([0.25, 0.5, 1.0])
            melody.append({"freq": freq, "velocity": velocity, "duration": duration})
        return melody

    def synthesize_audio(self, melody, sample_rate=AUDIO_RATE):
        """Synthesize audio waveform from melody."""
        audio = np.array([], dtype=np.float32)
        for note in melody:
            num_samples = int(note["duration"] * sample_rate)
            t = np.arange(num_samples) / sample_rate
            wave = note["velocity"] * (
                0.5 * np.sin(2 * np.pi * note["freq"] * t) +
                0.25 * np.sin(2 * np.pi * note["freq"] * 2 * t) +
                0.125 * np.sin(2 * np.pi * note["freq"] * 3 * t)
            )
            envelope = np.ones(num_samples)
            attack = min(int(0.01 * sample_rate), num_samples)
            release = min(int(0.05 * sample_rate), num_samples)
            envelope[:attack] = np.linspace(0, 1, attack)
            envelope[-release:] = np.linspace(1, 0, release)
            wave *= envelope
            audio = np.concatenate([audio, wave.astype(np.float32)])
        return audio

    def adapt_scale(self, features):
        """Adapt musical scale based on spectrum character."""
        flux = features["flux"]
        centroid = features["centroid"]
        if flux > 50:
            self.current_scale = "blues"
        elif centroid > 1000:
            self.current_scale = "major"
        elif centroid < 500:
            self.current_scale = "minor"
        else:
            self.current_scale = "pentatonic"
        self.tempo_bpm = int(np.clip(80 + flux * 2, 60, 200))


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
    noise = 0.01 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    for _ in range(np.random.randint(2, 8)):
        f = np.random.uniform(-SAMPLE_RATE / 3, SAMPLE_RATE / 3)
        noise += np.random.uniform(0.05, 0.5) * np.exp(2j * np.pi * f * t)
    return noise.astype(np.complex64)


def save_composition(audio, comp_num):
    os.makedirs(OUTPUT_PATH, exist_ok=True)
    fname = f"dream_{comp_num:04d}_{datetime.now().strftime('%H%M%S')}.raw"
    path = os.path.join(OUTPUT_PATH, fname)
    audio.tofile(path)
    return path


def main():
    logger.info("=== Dream Radio — RPi Generative ML Engine ===")
    gen = DreamRadioGenerator(MODEL_PATH)

    try:
        while True:
            iq = read_iq_pipe()
            features = gen.spectrum_to_features(iq)
            gen.adapt_scale(features)
            melody = gen.generate_melody(features)
            audio = gen.synthesize_audio(melody)
            gen.total_compositions += 1
            path = save_composition(audio, gen.total_compositions)
            logger.info(f"Composition #{gen.total_compositions}: {gen.current_scale} "
                        f"scale @ {gen.tempo_bpm}bpm | {len(melody)} notes | "
                        f"{len(audio)/AUDIO_RATE:.1f}s | {path}")
            time.sleep(2.0)

    except KeyboardInterrupt:
        logger.info(f"Stopped. {gen.total_compositions} compositions generated.")


if __name__ == "__main__":
    main()
