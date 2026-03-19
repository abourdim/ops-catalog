#!/usr/bin/env python3
"""Radio GAN — RTL-SDR Real Signal Capture for GAN Training
Captures real-world RF signals to serve as training/reference data
for the GAN discriminator and quality evaluation.
"""

import numpy as np
import time
import os
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

CENTER_FREQ = 433.92e6
SAMPLE_RATE = 2.4e6
GAIN = 40
NUM_SAMPLES = 64 * 1024
PIPE_PATH = "/tmp/sdr_gan_pipe"
DATASET_PATH = os.path.expanduser("~/gan_training_data/")
SIGNAL_LENGTH = 4096


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR: {CENTER_FREQ/1e6:.3f}MHz")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    noise = 0.02 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    for _ in range(np.random.poisson(3)):
        f = np.random.uniform(-SAMPLE_RATE / 3, SAMPLE_RATE / 3)
        sig_type = np.random.choice(["cw", "fm", "digital"])
        amp = np.random.uniform(0.05, 0.5)
        if sig_type == "cw":
            noise += amp * np.exp(2j * np.pi * f * t)
        elif sig_type == "fm":
            dev = np.random.uniform(5e3, 75e3)
            mod = np.sin(2 * np.pi * np.random.uniform(300, 3000) * t)
            noise += amp * np.exp(2j * np.pi * np.cumsum(f + dev * mod) / SAMPLE_RATE)
        else:
            symbols = np.repeat(np.random.choice([-1, 1], num_samples // 100), 100)[:num_samples]
            noise += amp * symbols * np.exp(2j * np.pi * f * t)
    return noise.astype(np.complex64)


def extract_signal_segments(iq_samples, segment_length=SIGNAL_LENGTH, threshold_db=-30):
    """Extract segments containing active signals."""
    segments = []
    num_segments = len(iq_samples) // segment_length
    for i in range(num_segments):
        seg = iq_samples[i * segment_length:(i + 1) * segment_length]
        power_db = 10 * np.log10(np.mean(np.abs(seg) ** 2) + 1e-12)
        if power_db > threshold_db:
            segments.append(seg)
    return segments


def normalize_signal(iq_signal):
    """Normalize signal to unit power."""
    power = np.sqrt(np.mean(np.abs(iq_signal) ** 2))
    if power > 0:
        return iq_signal / power
    return iq_signal


def compute_signal_stats(iq_signal):
    """Compute statistics for dataset quality control."""
    spectrum = np.abs(fftshift(fft(iq_signal)))
    return {
        "power_db": float(10 * np.log10(np.mean(np.abs(iq_signal)**2) + 1e-12)),
        "peak_to_avg": float(np.max(np.abs(iq_signal)) / (np.mean(np.abs(iq_signal)) + 1e-12)),
        "spectral_flatness": float(np.exp(np.mean(np.log(spectrum + 1e-12))) /
                                    (np.mean(spectrum) + 1e-12)),
        "bandwidth_est": float(np.sum(spectrum > np.max(spectrum) * 0.1) *
                                SAMPLE_RATE / len(spectrum)),
    }


def save_training_sample(iq_signal, sample_idx):
    """Save signal for GAN training dataset."""
    os.makedirs(DATASET_PATH, exist_ok=True)
    fname = f"real_{sample_idx:06d}.iq"
    iq_signal.astype(np.complex64).tofile(os.path.join(DATASET_PATH, fname))


def setup_pipe():
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Pipe: {PIPE_PATH}")


def send_to_pipe(iq_data):
    try:
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, iq_data.astype(np.complex64).tobytes())
        os.close(fd)
        return True
    except OSError:
        return False


def main():
    logger.info("=== Radio GAN — SDR Real Signal Collector ===")
    sdr = init_sdr()
    setup_pipe()
    total_samples = 0
    scan_freqs = [433.92e6, 315e6, 868e6, 144.39e6, 162.55e6]
    freq_idx = 0

    try:
        while True:
            freq = scan_freqs[freq_idx % len(scan_freqs)]
            if sdr:
                sdr.center_freq = freq
            freq_idx += 1
            iq = capture_samples(sdr)
            segments = extract_signal_segments(iq)
            for seg in segments:
                seg_norm = normalize_signal(seg)
                stats = compute_signal_stats(seg_norm)
                sent = send_to_pipe(seg_norm)
                total_samples += 1
                if total_samples % 100 == 0:
                    save_training_sample(seg_norm, total_samples)

            logger.info(f"{freq/1e6:.2f}MHz: {len(segments)} segments | "
                        f"total={total_samples} {'-> GAN' if segments else ''}")
            time.sleep(0.3)

    except KeyboardInterrupt:
        logger.info(f"Stopped. {total_samples} training samples collected.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
