#!/usr/bin/env python3
"""Neural Codec — RPi ML Inference Engine
Neural audio/data codec that learns optimal compression for radio channels.
Uses autoencoder architecture for end-to-end learned compression.
"""

import numpy as np
import time
import json
import os
import logging
from datetime import datetime
from scipy.fft import fft, ifft

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

MODEL_ENCODER = os.path.expanduser("~/models/neural_codec_enc.tflite")
MODEL_DECODER = os.path.expanduser("~/models/neural_codec_dec.tflite")
SAMPLE_RATE = 16000
FRAME_SIZE = 320
LATENT_DIM = 32
PIPE_PATH = "/tmp/sdr_codec_pipe"
OUTPUT_PATH = "/tmp/codec_output"


class NeuralCodec:
    """Autoencoder-based audio/data codec."""

    def __init__(self):
        self.encoder = None
        self.decoder = None
        self.total_frames = 0
        self.total_bits = 0
        self.distortion_history = []
        self._load_models()

    def _load_models(self):
        try:
            import tflite_runtime.interpreter as tflite
            self.encoder = tflite.Interpreter(model_path=MODEL_ENCODER)
            self.encoder.allocate_tensors()
            self.decoder = tflite.Interpreter(model_path=MODEL_DECODER)
            self.decoder.allocate_tensors()
            self.enc_in = self.encoder.get_input_details()
            self.enc_out = self.encoder.get_output_details()
            self.dec_in = self.decoder.get_input_details()
            self.dec_out = self.decoder.get_output_details()
            logger.info("Neural codec encoder+decoder loaded")
        except Exception as e:
            logger.warning(f"Models unavailable: {e}. Using mu-law fallback.")

    def encode(self, audio_frame):
        """Encode audio frame to compressed latent representation."""
        if self.encoder is not None:
            input_data = audio_frame.reshape(self.enc_in[0]['shape']).astype(np.float32)
            self.encoder.set_tensor(self.enc_in[0]['index'], input_data)
            self.encoder.invoke()
            latent = self.encoder.get_tensor(self.enc_out[0]['index']).flatten()
        else:
            latent = self._mu_law_encode(audio_frame)
        quantized = self._quantize(latent)
        self.total_frames += 1
        self.total_bits += len(quantized) * 8
        return quantized

    def decode(self, latent_data):
        """Decode compressed latent back to audio."""
        dequantized = self._dequantize(latent_data)
        if self.decoder is not None:
            input_data = dequantized.reshape(self.dec_in[0]['shape']).astype(np.float32)
            self.decoder.set_tensor(self.dec_in[0]['index'], input_data)
            self.decoder.invoke()
            audio = self.decoder.get_tensor(self.dec_out[0]['index']).flatten()
        else:
            audio = self._mu_law_decode(dequantized)
        return audio

    def _mu_law_encode(self, audio, mu=255):
        """Mu-law compression fallback."""
        compressed = np.sign(audio) * np.log1p(mu * np.abs(audio)) / np.log1p(mu)
        decimated = compressed[::FRAME_SIZE // LATENT_DIM][:LATENT_DIM]
        return decimated

    def _mu_law_decode(self, compressed, mu=255):
        """Mu-law expansion fallback."""
        expanded = np.sign(compressed) * (1 / mu) * ((1 + mu) ** np.abs(compressed) - 1)
        audio = np.repeat(expanded, FRAME_SIZE // LATENT_DIM)[:FRAME_SIZE]
        return audio

    def _quantize(self, latent, bits=8):
        """Uniform scalar quantization."""
        levels = 2 ** bits
        clipped = np.clip(latent, -1, 1)
        quantized = np.round((clipped + 1) / 2 * (levels - 1)).astype(np.uint8)
        return quantized

    def _dequantize(self, quantized, bits=8):
        """Reverse quantization."""
        levels = 2 ** bits
        return (quantized.astype(np.float32) / (levels - 1)) * 2 - 1

    def measure_quality(self, original, reconstructed):
        """Compute distortion metrics."""
        min_len = min(len(original), len(reconstructed))
        orig = original[:min_len]
        recon = reconstructed[:min_len]
        mse = np.mean((orig - recon) ** 2)
        if mse > 0:
            pesq_approx = 10 * np.log10(np.mean(orig ** 2) / mse)
        else:
            pesq_approx = 60.0
        spectral_dist = np.mean(np.abs(
            np.abs(fft(orig)) - np.abs(fft(recon))
        ) ** 2)
        self.distortion_history.append(mse)
        return {
            "mse": float(mse),
            "snr_db": float(pesq_approx),
            "spectral_distortion": float(spectral_dist),
            "compression_ratio": float(FRAME_SIZE / LATENT_DIM),
            "bitrate_bps": float(LATENT_DIM * 8 * SAMPLE_RATE / FRAME_SIZE),
        }


def read_audio_pipe():
    """Read audio frames from SDR demod pipe."""
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(FRAME_SIZE * 4)
            return np.frombuffer(raw, dtype=np.float32)
        except Exception:
            pass
    t = np.arange(FRAME_SIZE) / SAMPLE_RATE
    harmonics = sum(np.sin(2 * np.pi * f * t) * (0.5 ** n)
                    for n, f in enumerate([200, 400, 600, 800, 1200]))
    audio = harmonics / (np.max(np.abs(harmonics)) + 1e-8)
    return (audio * 0.8).astype(np.float32)


def main():
    logger.info("=== Neural Codec — RPi ML Engine ===")
    codec = NeuralCodec()
    os.makedirs(OUTPUT_PATH, exist_ok=True)

    try:
        while True:
            audio = read_audio_pipe()
            if len(audio) < FRAME_SIZE:
                audio = np.pad(audio, (0, FRAME_SIZE - len(audio)))
            audio = audio[:FRAME_SIZE]
            encoded = codec.encode(audio)
            decoded = codec.decode(encoded)
            quality = codec.measure_quality(audio, decoded)
            avg_mse = np.mean(codec.distortion_history[-50:])
            logger.info(f"Frame {codec.total_frames}: "
                        f"SNR={quality['snr_db']:.1f}dB | "
                        f"CR={quality['compression_ratio']:.1f}x | "
                        f"Rate={quality['bitrate_bps']/1000:.1f}kbps | "
                        f"MSE={avg_mse:.6f}")
            time.sleep(0.02)

    except KeyboardInterrupt:
        logger.info(f"Stopped. {codec.total_frames} frames, {codec.total_bits/8/1024:.1f}KB encoded")


if __name__ == "__main__":
    main()
