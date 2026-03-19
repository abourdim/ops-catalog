#!/usr/bin/env python3
"""Gesture Recognition RF — RTL-SDR Channel Sensing
Captures WiFi/RF channel variations caused by human body movements.
Extracts CSI-like measurements and feeds gesture recognition pipeline.
"""

import numpy as np
import time
import os
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

CENTER_FREQ = 2.412e9
SAMPLE_RATE = 2.4e6
GAIN = 30
NUM_SAMPLES = 64 * 1024
PIPE_PATH = "/tmp/sdr_gesture_pipe"
NUM_SUBCARRIERS = 30
CAPTURE_RATE_HZ = 20


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR: {CENTER_FREQ/1e9:.3f}GHz")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    base_channel = np.zeros(num_samples, dtype=np.complex64)
    for i in range(NUM_SUBCARRIERS):
        freq = -SAMPLE_RATE / 3 + i * (2 * SAMPLE_RATE / 3) / NUM_SUBCARRIERS
        amp = np.random.uniform(0.5, 1.0)
        phase = np.random.uniform(0, 2 * np.pi)
        base_channel += amp * np.exp(2j * np.pi * freq * t + 1j * phase)
    if np.random.rand() < 0.3:
        gesture_freq = np.random.uniform(0.5, 5)
        doppler_shift = 0.05 * np.sin(2 * np.pi * gesture_freq * t)
        base_channel *= (1 + doppler_shift)
        phase_shift = 0.2 * np.sin(2 * np.pi * gesture_freq * t * 0.8)
        base_channel *= np.exp(1j * phase_shift)
    noise = 0.02 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (base_channel / NUM_SUBCARRIERS + noise).astype(np.complex64)


def extract_channel_response(iq_samples, n_subcarriers=NUM_SUBCARRIERS):
    """Extract frequency-domain channel response."""
    fft_size = 64
    num_avg = min(len(iq_samples) // fft_size, 32)
    H = np.zeros(fft_size, dtype=np.complex64)
    for i in range(num_avg):
        seg = iq_samples[i * fft_size:(i + 1) * fft_size]
        H += fft(seg)
    H /= num_avg
    indices = np.linspace(0, fft_size - 1, n_subcarriers, dtype=int)
    return H[indices]


def compute_doppler_spectrum(iq_samples, window_ms=50):
    """Compute Doppler spectrum from short-time channel variations."""
    window_samples = int(SAMPLE_RATE * window_ms / 1000)
    num_windows = len(iq_samples) // window_samples
    if num_windows < 2:
        return np.zeros(32)
    channel_series = np.zeros(num_windows, dtype=np.complex64)
    for i in range(num_windows):
        seg = iq_samples[i * window_samples:(i + 1) * window_samples]
        channel_series[i] = np.mean(seg)
    doppler = np.abs(fft(channel_series))
    return doppler


def measure_channel_variance(iq_samples, segment_size=1024):
    """Measure temporal channel variance as motion indicator."""
    num_segs = len(iq_samples) // segment_size
    powers = np.zeros(num_segs)
    phases = np.zeros(num_segs)
    for i in range(num_segs):
        seg = iq_samples[i * segment_size:(i + 1) * segment_size]
        powers[i] = np.mean(np.abs(seg) ** 2)
        phases[i] = np.angle(np.mean(seg))
    return {
        "power_variance": float(np.var(powers)),
        "phase_variance": float(np.var(phases)),
        "power_range": float(np.ptp(powers)),
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
    logger.info("=== Gesture Recognition RF — SDR Channel Sensor ===")
    sdr = init_sdr()
    setup_pipe()
    capture_interval = 1.0 / CAPTURE_RATE_HZ
    captures = 0

    try:
        while True:
            iq = capture_samples(sdr)
            channel = extract_channel_response(iq)
            variance = measure_channel_variance(iq)
            sent = send_to_pipe(iq)
            captures += 1
            if captures % 20 == 0:
                logger.info(f"Cap #{captures}: pwr_var={variance['power_variance']:.6f} | "
                            f"phase_var={variance['phase_variance']:.4f} "
                            f"{'-> ML' if sent else ''}")
            time.sleep(capture_interval)

    except KeyboardInterrupt:
        logger.info(f"Stopped. {captures} captures.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
