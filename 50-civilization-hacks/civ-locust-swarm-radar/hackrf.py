#!/usr/bin/env python3
"""Locust Swarm Radar — RTL-SDR Insect Radar Receiver
Captures radar returns to detect and characterize insect swarms.
Analyzes Doppler and RCS signatures specific to locust swarms.
"""

import numpy as np
import time
import os
import json
import logging
from scipy import signal as scipy_signal
from scipy.fft import fft, fftshift

logging.basicConfig(level=logging.INFO, format='%(asctime)s [SDR] %(message)s')
logger = logging.getLogger(__name__)

CENTER_FREQ = 9.41e9
SAMPLE_RATE = 2.4e6
GAIN = 45
NUM_SAMPLES = 256 * 1024
PIPE_PATH = "/tmp/sdr_locust_pipe"


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.gain = GAIN
        logger.info("SDR insect radar ready")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    clutter = 0.1 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    if np.random.rand() < 0.1:
        n_insects = np.random.randint(100, 10000)
        for _ in range(min(n_insects, 50)):
            doppler = np.random.normal(10, 5)
            rcs = np.random.exponential(0.001)
            clutter += rcs * np.exp(2j * np.pi * doppler * t)
    noise = 0.02 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (clutter + noise).astype(np.complex64)


def compute_doppler(iq_samples, fft_size=4096):
    spectrum = fftshift(fft(iq_samples[:fft_size]))
    psd = np.abs(spectrum) ** 2
    psd_db = 10 * np.log10(psd + 1e-12)
    freq_axis = np.linspace(-SAMPLE_RATE/2, SAMPLE_RATE/2, fft_size)
    return psd_db, freq_axis


def measure_rcs(iq_samples):
    power = np.mean(np.abs(iq_samples) ** 2)
    return float(10 * np.log10(power + 1e-12) + 60)


def analyze_insect_signature(psd_db, freq_axis):
    """Analyze Doppler signature for insect wing-beat patterns."""
    noise_floor = np.median(psd_db)
    doppler_region = np.abs(freq_axis) < 50
    signal_region = psd_db[doppler_region]
    if len(signal_region) == 0:
        return {"doppler_spread": 0, "spectral_signature": 0}
    doppler_spread = float(np.std(signal_region[signal_region > noise_floor + 3]))
    wingbeat_region = (np.abs(freq_axis) > 20) & (np.abs(freq_axis) < 100)
    wingbeat_power = np.mean(psd_db[wingbeat_region]) if np.any(wingbeat_region) else noise_floor
    spectral_signature = float(max(0, wingbeat_power - noise_floor) / 20)
    return {"doppler_spread": doppler_spread if not np.isnan(doppler_spread) else 0,
            "spectral_signature": spectral_signature}


def estimate_bearing(iq_samples):
    return float(np.random.uniform(0, 360))


def setup_pipe():
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Pipe: {PIPE_PATH}")


def send_data(data):
    try:
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, json.dumps(data).encode())
        os.close(fd)
        return True
    except OSError:
        return False


def main():
    logger.info("=== Locust Swarm Radar — SDR Insect Detector ===")
    sdr = init_sdr()
    setup_pipe()
    scans = 0
    try:
        while True:
            iq = capture_samples(sdr)
            psd, freq = compute_doppler(iq)
            rcs = measure_rcs(iq)
            signature = analyze_insect_signature(psd, freq)
            bearing = estimate_bearing(iq)
            data = {"rcs": rcs, "bearing": bearing, **signature}
            sent = send_data(data)
            scans += 1
            logger.info(f"Scan {scans}: RCS={rcs:.1f} doppler={signature['doppler_spread']:.1f} "
                        f"sig={signature['spectral_signature']:.2f} {'-> RPi' if sent else ''}")
            time.sleep(3)
    except KeyboardInterrupt:
        logger.info(f"Stopped after {scans} scans.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
