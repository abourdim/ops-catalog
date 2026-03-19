#!/usr/bin/env python3
"""Dream Radio — RTL-SDR Spectrum Capture for Generative Art
Captures wideband RF spectrum data and extracts artistic features
for feeding the generative music/art neural network pipeline.
"""

import numpy as np
import time
import os
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

SAMPLE_RATE = 2.4e6
GAIN = 40
PIPE_PATH = "/tmp/sdr_dream_pipe"
NUM_SAMPLES = 128 * 1024
SCAN_PRESETS = [
    {"name": "FM_broadcast", "freq": 100e6},
    {"name": "Air_band", "freq": 125e6},
    {"name": "VHF_ham", "freq": 145e6},
    {"name": "ISM_433", "freq": 433.92e6},
    {"name": "ISM_868", "freq": 868e6},
    {"name": "Cosmic", "freq": 1420e6},
]


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.gain = GAIN
        logger.info(f"SDR ready for dream capture")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating cosmic noise.")
        return None


def capture_samples(sdr, freq, num_samples=NUM_SAMPLES):
    if sdr is not None:
        sdr.center_freq = freq
        time.sleep(0.01)
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    noise = 0.05 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    n_signals = np.random.poisson(5)
    for _ in range(n_signals):
        f = np.random.uniform(-SAMPLE_RATE / 3, SAMPLE_RATE / 3)
        amp = np.random.exponential(0.2)
        mod_type = np.random.choice(["cw", "fm", "am", "noise"])
        if mod_type == "cw":
            noise += amp * np.exp(2j * np.pi * f * t)
        elif mod_type == "fm":
            dev = np.random.uniform(1e3, 75e3)
            mod = np.sin(2 * np.pi * np.random.uniform(100, 5000) * t)
            noise += amp * np.exp(2j * np.pi * np.cumsum(f + dev * mod) / SAMPLE_RATE)
        elif mod_type == "am":
            mod = 1 + 0.5 * np.sin(2 * np.pi * np.random.uniform(100, 3000) * t)
            noise += amp * mod * np.exp(2j * np.pi * f * t)
        else:
            noise += amp * np.random.randn(num_samples) * np.exp(2j * np.pi * f * t)
    return noise.astype(np.complex64)


def compute_beauty_metrics(iq_samples):
    """Compute aesthetic/beauty metrics from spectrum."""
    spectrum = np.abs(fftshift(fft(iq_samples[:4096])))
    spectrum_db = 20 * np.log10(spectrum + 1e-12)
    psd_norm = spectrum / (np.sum(spectrum) + 1e-12)
    entropy = -np.sum(psd_norm * np.log2(psd_norm + 1e-12))
    golden_ratio = 1.618
    thirds = len(spectrum) // 3
    energy_ratios = [np.mean(spectrum[:thirds]),
                     np.mean(spectrum[thirds:2*thirds]),
                     np.mean(spectrum[2*thirds:])]
    symmetry = 1 - np.mean(np.abs(spectrum[:len(spectrum)//2] -
                                    spectrum[len(spectrum)//2:][::-1])) / (np.mean(spectrum) + 1e-12)
    amplitude = np.abs(iq_samples)
    rhythm = np.abs(fft(amplitude[:4096]))[:100]
    rhythmic_complexity = np.std(rhythm) / (np.mean(rhythm) + 1e-12)
    return {
        "entropy": float(entropy),
        "symmetry": float(np.clip(symmetry, 0, 1)),
        "rhythmic_complexity": float(rhythmic_complexity),
        "dynamic_range": float(np.ptp(spectrum_db)),
        "spectral_color": float(np.mean(spectrum_db)),
    }


def setup_pipe():
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Dream pipe: {PIPE_PATH}")


def send_to_pipe(iq_data):
    try:
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, iq_data.astype(np.complex64).tobytes())
        os.close(fd)
        return True
    except OSError:
        return False


def main():
    logger.info("=== Dream Radio — SDR Spectrum Dreamer ===")
    sdr = init_sdr()
    setup_pipe()
    preset_idx = 0

    try:
        while True:
            preset = SCAN_PRESETS[preset_idx % len(SCAN_PRESETS)]
            iq = capture_samples(sdr, preset["freq"])
            metrics = compute_beauty_metrics(iq)
            sent = send_to_pipe(iq)
            preset_idx += 1

            logger.info(f"Dream [{preset['name']}] {preset['freq']/1e6:.1f}MHz | "
                        f"entropy={metrics['entropy']:.2f} sym={metrics['symmetry']:.2f} "
                        f"rhythm={metrics['rhythmic_complexity']:.2f} "
                        f"{'-> Gen' if sent else ''}")
            time.sleep(1.0)

    except KeyboardInterrupt:
        logger.info("Dream ended.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
