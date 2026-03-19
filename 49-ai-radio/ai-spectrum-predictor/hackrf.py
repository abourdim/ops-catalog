#!/usr/bin/env python3
"""Spectrum Predictor — RTL-SDR Continuous Spectrum Monitor
Performs continuous wideband spectrum monitoring and streams
time-series spectral data to the prediction ML pipeline.
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
FFT_SIZE = 256
PIPE_PATH = "/tmp/sdr_spectrum_pipe"
NUM_SAMPLES = 256 * 1024
WATERFALL_DEPTH = 100


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR: {CENTER_FREQ/1e6:.3f}MHz, {SAMPLE_RATE/1e6:.1f}MS/s")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    noise = 0.01 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    n_sigs = np.random.poisson(3)
    for _ in range(n_sigs):
        f = np.random.uniform(-SAMPLE_RATE / 3, SAMPLE_RATE / 3)
        amp = np.random.exponential(0.1)
        bw = np.random.uniform(1e3, 100e3)
        mod = np.random.randn(num_samples) * bw / SAMPLE_RATE
        phase = 2 * np.pi * np.cumsum(f / SAMPLE_RATE + mod)
        noise += amp * np.exp(1j * phase)
    return noise.astype(np.complex64)


def compute_psd(iq_samples, fft_size=FFT_SIZE):
    """Welch PSD estimate."""
    num_seg = len(iq_samples) // fft_size
    psd = np.zeros(fft_size)
    window = np.blackman(fft_size)
    for i in range(min(num_seg, 64)):
        seg = iq_samples[i * fft_size:(i + 1) * fft_size]
        spec = fftshift(fft(seg * window))
        psd += np.abs(spec) ** 2
    psd /= max(1, min(num_seg, 64))
    return 10 * np.log10(psd + 1e-12)


def compute_occupancy(psd_db, threshold_margin=8):
    """Binary occupancy map from PSD."""
    noise_floor = np.percentile(psd_db, 30)
    threshold = noise_floor + threshold_margin
    return (psd_db > threshold).astype(np.float32)


def track_statistics(waterfall, depth=WATERFALL_DEPTH):
    """Compute temporal statistics from waterfall."""
    if len(waterfall) < 5:
        return {}
    arr = np.array(waterfall[-depth:])
    return {
        "mean_psd": float(np.mean(arr)),
        "std_psd": float(np.std(arr)),
        "duty_cycle": float(np.mean(arr > np.percentile(arr, 70))),
        "temporal_variance": float(np.mean(np.var(arr, axis=0))),
        "spectral_flatness": float(np.exp(np.mean(np.log(np.abs(arr[-1]) + 1e-12))) /
                                    (np.mean(np.abs(arr[-1])) + 1e-12)),
    }


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
    logger.info("=== Spectrum Predictor — SDR Monitor ===")
    sdr = init_sdr()
    setup_pipe()
    waterfall = []
    scan_freqs = [CENTER_FREQ - SAMPLE_RATE, CENTER_FREQ, CENTER_FREQ + SAMPLE_RATE]
    freq_idx = 0

    try:
        while True:
            current_freq = scan_freqs[freq_idx % len(scan_freqs)]
            if sdr:
                sdr.center_freq = current_freq
            freq_idx += 1

            iq = capture_samples(sdr)
            psd = compute_psd(iq)
            occupancy = compute_occupancy(psd)
            waterfall.append(psd)
            if len(waterfall) > WATERFALL_DEPTH:
                waterfall.pop(0)

            stats = track_statistics(waterfall)
            sent = send_to_pipe(iq)

            occ_pct = np.mean(occupancy) * 100
            logger.info(f"{current_freq/1e6:.3f}MHz | Occ={occ_pct:.0f}% | "
                        f"DC={stats.get('duty_cycle', 0):.0%} | "
                        f"Var={stats.get('temporal_variance', 0):.2f} "
                        f"{'-> ML' if sent else ''}")

            time.sleep(0.3)

    except KeyboardInterrupt:
        logger.info("Monitor stopped.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
