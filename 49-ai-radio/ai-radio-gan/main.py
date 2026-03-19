#!/usr/bin/env python3
"""Radio GAN — RPi ML Inference Engine
Generative Adversarial Network for RF signal synthesis and augmentation.
Generates realistic synthetic radio signals for testing and training.
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

GENERATOR_MODEL = os.path.expanduser("~/models/radio_gan_gen.tflite")
DISCRIMINATOR_MODEL = os.path.expanduser("~/models/radio_gan_disc.tflite")
PIPE_PATH = "/tmp/sdr_gan_pipe"
OUTPUT_PATH = os.path.expanduser("~/gan_output/")
SAMPLE_RATE = 2.4e6
LATENT_DIM = 128
SIGNAL_LENGTH = 4096


class RadioGAN:
    """GAN for generating realistic RF signals."""

    def __init__(self):
        self.generator = None
        self.discriminator = None
        self.gen_count = 0
        self.disc_accuracy = 0.5
        self._load_models()

    def _load_models(self):
        try:
            import tflite_runtime.interpreter as tflite
            self.generator = tflite.Interpreter(model_path=GENERATOR_MODEL)
            self.generator.allocate_tensors()
            self.gen_in = self.generator.get_input_details()
            self.gen_out = self.generator.get_output_details()
            self.discriminator = tflite.Interpreter(model_path=DISCRIMINATOR_MODEL)
            self.discriminator.allocate_tensors()
            self.disc_in = self.discriminator.get_input_details()
            self.disc_out = self.discriminator.get_output_details()
            logger.info("GAN models loaded")
        except Exception as e:
            logger.warning(f"Models unavailable: {e}. Using parametric synthesis.")

    def generate(self, latent_vector=None, signal_type="random"):
        """Generate synthetic RF signal from latent space."""
        if latent_vector is None:
            latent_vector = np.random.randn(LATENT_DIM).astype(np.float32)

        if self.generator is not None:
            input_data = latent_vector.reshape(self.gen_in[0]['shape'])
            self.generator.set_tensor(self.gen_in[0]['index'], input_data)
            self.generator.invoke()
            output = self.generator.get_tensor(self.gen_out[0]['index']).flatten()
            iq = output[:SIGNAL_LENGTH] + 1j * output[SIGNAL_LENGTH:2*SIGNAL_LENGTH]
        else:
            iq = self._parametric_generate(latent_vector, signal_type)

        self.gen_count += 1
        return iq.astype(np.complex64)

    def _parametric_generate(self, latent, signal_type):
        """Parametric signal generation fallback."""
        t = np.arange(SIGNAL_LENGTH) / SAMPLE_RATE
        params = {
            "freq": latent[0] * 500e3,
            "bandwidth": abs(latent[1]) * 200e3 + 1e3,
            "power": abs(latent[2]) * 0.5 + 0.1,
            "mod_index": abs(latent[3]) * 2,
        }
        if signal_type == "fm" or latent[4] > 0:
            mod = np.sin(2 * np.pi * abs(latent[5]) * 5000 * t)
            phase = 2 * np.pi * np.cumsum(params["freq"] + params["mod_index"] * params["bandwidth"] * mod) / SAMPLE_RATE
            iq = params["power"] * np.exp(1j * phase)
        elif signal_type == "am" or latent[4] > -0.5:
            mod = 1 + params["mod_index"] * np.sin(2 * np.pi * abs(latent[5]) * 3000 * t)
            iq = params["power"] * mod * np.exp(2j * np.pi * params["freq"] * t)
        else:
            symbols = np.random.choice([-1, 1], SIGNAL_LENGTH // 100)
            iq = params["power"] * np.repeat(symbols, 100)[:SIGNAL_LENGTH] * np.exp(2j * np.pi * params["freq"] * t)
        noise = 0.01 * (np.random.randn(SIGNAL_LENGTH) + 1j * np.random.randn(SIGNAL_LENGTH))
        return iq + noise

    def discriminate(self, iq_signal):
        """Judge if signal is real or generated."""
        if self.discriminator is not None:
            features = np.concatenate([np.real(iq_signal[:SIGNAL_LENGTH]),
                                       np.imag(iq_signal[:SIGNAL_LENGTH])]).astype(np.float32)
            input_data = features.reshape(self.disc_in[0]['shape'])
            self.discriminator.set_tensor(self.disc_in[0]['index'], input_data)
            self.discriminator.invoke()
            score = float(self.discriminator.get_tensor(self.disc_out[0]['index']).flatten()[0])
        else:
            score = self._heuristic_discriminate(iq_signal)
        return score

    def _heuristic_discriminate(self, iq_signal):
        """Heuristic real/fake discrimination."""
        spectrum = np.abs(fft(iq_signal[:SIGNAL_LENGTH]))
        flatness = np.exp(np.mean(np.log(spectrum + 1e-12))) / (np.mean(spectrum) + 1e-12)
        phase_diff = np.diff(np.angle(iq_signal))
        phase_smoothness = 1 - np.std(np.diff(phase_diff)) / (np.std(phase_diff) + 1e-12)
        score = 0.5 * flatness + 0.5 * np.clip(phase_smoothness, 0, 1)
        return float(np.clip(score, 0, 1))

    def compute_quality_metrics(self, real_signal, generated_signal):
        """Compare real vs generated signal quality."""
        real_spec = np.abs(fft(real_signal[:SIGNAL_LENGTH]))
        gen_spec = np.abs(fft(generated_signal[:SIGNAL_LENGTH]))
        spectral_distance = np.mean(np.abs(real_spec - gen_spec))
        fid_approx = np.mean((np.mean(real_spec) - np.mean(gen_spec))**2) + \
                     np.mean((np.std(real_spec) - np.std(gen_spec))**2)
        return {
            "spectral_distance": float(spectral_distance),
            "fid_approx": float(fid_approx),
            "gen_power_db": float(10 * np.log10(np.mean(np.abs(generated_signal)**2) + 1e-12)),
        }


def read_real_signal(num_samples=SIGNAL_LENGTH):
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(num_samples * 8)
            if len(raw) >= 8:
                return np.frombuffer(raw, dtype=np.complex64)
        except Exception:
            pass
    t = np.arange(num_samples) / SAMPLE_RATE
    f = np.random.uniform(-200e3, 200e3)
    sig = 0.3 * np.exp(2j * np.pi * f * t)
    noise = 0.02 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (sig + noise).astype(np.complex64)


def main():
    logger.info("=== Radio GAN — RPi ML Engine ===")
    gan = RadioGAN()
    os.makedirs(OUTPUT_PATH, exist_ok=True)

    try:
        while True:
            real = read_real_signal()
            latent = np.random.randn(LATENT_DIM).astype(np.float32)
            generated = gan.generate(latent)
            real_score = gan.discriminate(real)
            fake_score = gan.discriminate(generated)
            metrics = gan.compute_quality_metrics(real, generated)
            gan.disc_accuracy = 0.5 * (real_score + (1 - fake_score))

            logger.info(f"Gen #{gan.gen_count}: D(real)={real_score:.3f} D(fake)={fake_score:.3f} | "
                        f"FID={metrics['fid_approx']:.4f} | Pwr={metrics['gen_power_db']:.1f}dB | "
                        f"D_acc={gan.disc_accuracy:.1%}")

            if gan.gen_count % 50 == 0:
                generated.tofile(os.path.join(OUTPUT_PATH, f"gen_{gan.gen_count:06d}.iq"))
            time.sleep(0.2)

    except KeyboardInterrupt:
        logger.info(f"Stopped. {gan.gen_count} signals generated.")


if __name__ == "__main__":
    main()
