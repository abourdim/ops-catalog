#!/usr/bin/env python3
"""Cognitive Radio — RTL-SDR Spectrum Sensing Engine
Performs wideband spectrum sensing for cognitive radio decisions.
Measures channel occupancy, SNR, and interference patterns.
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
NUM_CHANNELS = 16
FFT_SIZE = 1024
PIPE_PATH = "/tmp/sdr_cognitive_pipe"
NUM_SAMPLES = 256 * 1024
SENSING_TIME_MS = 10


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
    noise = 0.01 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    for _ in range(np.random.poisson(4)):
        f = np.random.uniform(-SAMPLE_RATE / 3, SAMPLE_RATE / 3)
        amp = np.random.exponential(0.15)
        bw = np.random.uniform(5e3, 150e3)
        mod = np.random.randn(num_samples) * bw / SAMPLE_RATE
        noise += amp * np.exp(2j * np.pi * np.cumsum(f / SAMPLE_RATE + mod))
    return noise.astype(np.complex64)


def energy_detection(iq_samples, fft_size=FFT_SIZE):
    """Energy detection spectrum sensing."""
    num_avg = len(iq_samples) // fft_size
    psd = np.zeros(fft_size)
    window = np.hanning(fft_size)
    for i in range(min(num_avg, 64)):
        seg = iq_samples[i * fft_size:(i + 1) * fft_size]
        spec = fftshift(fft(seg * window))
        psd += np.abs(spec) ** 2
    psd /= max(1, min(num_avg, 64))
    return 10 * np.log10(psd + 1e-12)


def cyclostationary_detection(iq_samples, cycle_freq=None):
    """Cyclostationary feature detection for robust sensing."""
    n = min(len(iq_samples), 4096)
    x = iq_samples[:n]
    autocorr = np.correlate(x, x, mode='same')
    autocorr_power = np.abs(autocorr) ** 2
    spectral_corr = np.abs(fft(autocorr_power))
    peak_ratio = np.max(spectral_corr) / (np.mean(spectral_corr) + 1e-12)
    return float(peak_ratio)


def measure_channels(psd_db, num_channels=NUM_CHANNELS):
    """Measure per-channel statistics."""
    bins_per_ch = len(psd_db) // num_channels
    channels = []
    noise_floor = np.percentile(psd_db, 25)
    for i in range(num_channels):
        ch_psd = psd_db[i * bins_per_ch:(i + 1) * bins_per_ch]
        channels.append({
            "id": i,
            "mean_power": float(np.mean(ch_psd)),
            "peak_power": float(np.max(ch_psd)),
            "snr": float(np.max(ch_psd) - noise_floor),
            "occupied": bool(np.mean(ch_psd) > noise_floor + 8),
            "duty_cycle": float(np.mean(ch_psd > noise_floor + 6)),
        })
    return channels, float(noise_floor)


def cooperative_sensing(local_result, neighbor_results=None):
    """Combine local and neighbor sensing results."""
    if neighbor_results is None:
        return local_result
    combined = local_result.copy()
    for neighbor in neighbor_results:
        for i, ch in enumerate(neighbor):
            if ch.get("occupied"):
                combined[i]["occupied"] = True
    return combined


def format_spectrum_state(channels):
    """Format channel data for RL agent consumption."""
    state = np.array([ch["mean_power"] for ch in channels], dtype=np.float32)
    return state


def setup_pipe():
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Pipe: {PIPE_PATH}")


def send_state(state_data):
    try:
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, state_data.astype(np.float32).tobytes())
        os.close(fd)
        return True
    except OSError:
        return False


def main():
    logger.info("=== Cognitive Radio — SDR Spectrum Sensing ===")
    sdr = init_sdr()
    setup_pipe()
    cycle = 0

    try:
        while True:
            iq = capture_samples(sdr)
            psd = energy_detection(iq)
            cyclo_metric = cyclostationary_detection(iq)
            channels, noise_floor = measure_channels(psd)
            state = format_spectrum_state(channels)
            sent = send_state(state)

            occupied = sum(1 for ch in channels if ch["occupied"])
            free = NUM_CHANNELS - occupied
            cycle += 1

            logger.info(f"Sense #{cycle}: {occupied}/{NUM_CHANNELS} occupied | "
                        f"{free} free | cyclo={cyclo_metric:.1f} | "
                        f"floor={noise_floor:.1f}dB {'-> RL' if sent else ''}")

            time.sleep(0.15)

    except KeyboardInterrupt:
        logger.info("Sensing stopped.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
