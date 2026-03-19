#!/usr/bin/env python3
"""Person Counting WiFi — RTL-SDR WiFi Channel Monitor
Monitors WiFi beacon signals and channel state variations
to detect human presence and feed person counting ML pipeline.
"""

import numpy as np
import time
import os
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

CENTER_FREQ = 2.437e9
SAMPLE_RATE = 2.4e6
GAIN = 30
NUM_SAMPLES = 64 * 1024
PIPE_PATH = "/tmp/sdr_person_pipe"
BEACON_INTERVAL_MS = 100


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR: {CENTER_FREQ/1e9:.3f}GHz WiFi ch6")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    beacon = np.zeros(num_samples, dtype=np.complex64)
    beacon_samples = int(SAMPLE_RATE * BEACON_INTERVAL_MS / 1000)
    if beacon_samples < num_samples:
        beacon[:beacon_samples] = 0.3 * np.exp(2j * np.pi * 0 * t[:beacon_samples])
    n_bodies = np.random.poisson(3)
    multipath = np.ones(num_samples, dtype=np.complex64)
    for _ in range(n_bodies):
        delay = np.random.randint(10, 500)
        atten = np.random.uniform(0.85, 0.98)
        phase_shift = np.random.uniform(0, 2 * np.pi)
        reflected = np.roll(beacon, delay) * atten * np.exp(1j * phase_shift)
        multipath += reflected * 0.1
    noise = 0.05 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return ((beacon * multipath + noise) * 0.5).astype(np.complex64)


def measure_rssi(iq_samples):
    """Compute RSSI in dBm."""
    power = np.mean(np.abs(iq_samples) ** 2)
    return float(10 * np.log10(power + 1e-12))


def measure_channel_impulse(iq_samples, fft_size=256):
    """Estimate channel impulse response."""
    H = fftshift(fft(iq_samples[:fft_size]))
    h = np.fft.ifft(H)
    return np.abs(h)


def compute_rms_delay_spread(impulse_response):
    """Compute RMS delay spread from channel impulse response."""
    power = impulse_response ** 2
    total_power = np.sum(power) + 1e-12
    delays = np.arange(len(power))
    mean_delay = np.sum(delays * power) / total_power
    rms_spread = np.sqrt(np.sum((delays - mean_delay) ** 2 * power) / total_power)
    return float(rms_spread), float(mean_delay)


def detect_beacon_frames(iq_samples, threshold=0.1):
    """Detect WiFi beacon-like energy bursts."""
    envelope = np.abs(iq_samples)
    smoothed = scipy_signal.lfilter(np.ones(256) / 256, 1, envelope)
    peaks, _ = scipy_signal.find_peaks(smoothed, height=threshold, distance=1000)
    return len(peaks)


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
    logger.info("=== Person Counting WiFi — SDR Channel Monitor ===")
    sdr = init_sdr()
    setup_pipe()
    captures = 0

    try:
        while True:
            iq = capture_samples(sdr)
            rssi = measure_rssi(iq)
            impulse = measure_channel_impulse(iq)
            rms_spread, mean_delay = compute_rms_delay_spread(impulse)
            beacons = detect_beacon_frames(iq)
            sent = send_to_pipe(iq)
            captures += 1

            if captures % 10 == 0:
                logger.info(f"Cap {captures}: RSSI={rssi:.1f}dBm | "
                            f"RMS_spread={rms_spread:.1f} | beacons={beacons} "
                            f"{'-> ML' if sent else ''}")
            time.sleep(0.5)

    except KeyboardInterrupt:
        logger.info(f"Stopped after {captures} captures.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
