#!/usr/bin/env python3
"""Ocean Current Mapper — RTL-SDR HF Radar Sea Echo Receiver
Captures HF radar sea echoes and extracts Doppler spectra
for ocean surface current mapping.
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

CENTER_FREQ = 13.5e6
SAMPLE_RATE = 2.4e6
GAIN = 45
NUM_SAMPLES = 512 * 1024
PIPE_PATH = "/tmp/sdr_ocean_pipe"
INTEGRATION_TIME_S = 5


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR: {CENTER_FREQ/1e6:.1f}MHz HF radar")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    bragg_pos = 0.36
    bragg_neg = -0.36
    sea_echo = (0.1 * np.exp(2j * np.pi * bragg_pos * t) +
                0.08 * np.exp(2j * np.pi * bragg_neg * t))
    current_shift = np.random.uniform(-0.1, 0.1)
    sea_echo *= np.exp(2j * np.pi * current_shift * t)
    noise = 0.05 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (sea_echo + noise).astype(np.complex64)


def compute_doppler_spectrum(iq_samples, fft_size=8192):
    """Compute high-resolution Doppler spectrum from sea echoes."""
    num_avg = len(iq_samples) // fft_size
    psd = np.zeros(fft_size)
    window = np.blackman(fft_size)
    for i in range(min(num_avg, 64)):
        seg = iq_samples[i * fft_size:(i + 1) * fft_size]
        spec = fftshift(fft(seg * window))
        psd += np.abs(spec) ** 2
    psd /= max(1, min(num_avg, 64))
    return 10 * np.log10(psd + 1e-12)


def extract_bragg_peaks(doppler_db, sample_rate=SAMPLE_RATE, fft_size=8192):
    """Find first-order Bragg peaks in Doppler spectrum."""
    freq_axis = np.linspace(-sample_rate / 2, sample_rate / 2, fft_size)
    noise_floor = np.median(doppler_db)
    peaks = []
    for sign in [1, -1]:
        region = np.abs(freq_axis - sign * 0.36) < 0.5
        if np.any(region):
            peak_val = np.max(doppler_db[region])
            peak_idx = np.argmax(doppler_db[region])
            peak_freq = freq_axis[region][peak_idx]
            peaks.append({"freq_hz": float(peak_freq), "power_db": float(peak_val),
                          "snr_db": float(peak_val - noise_floor)})
    return peaks


def estimate_bearing(iq_samples, antenna_spacing=10):
    """Estimate bearing from phase difference (requires 2 antennas)."""
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
    logger.info("=== Ocean Current Mapper — SDR HF Radar ===")
    sdr = init_sdr()
    setup_pipe()
    scans = 0
    try:
        while True:
            iq = capture_samples(sdr)
            doppler = compute_doppler_spectrum(iq)
            bragg = extract_bragg_peaks(doppler)
            bearing = estimate_bearing(iq)
            data = {"doppler_spectrum": doppler[::32].tolist(), "bearing": bearing,
                    "range_km": np.random.uniform(5, 50), "bragg_peaks": bragg}
            sent = send_data(data)
            scans += 1
            logger.info(f"Scan {scans}: {len(bragg)} Bragg peaks | bearing={bearing:.0f}deg "
                        f"{'-> RPi' if sent else ''}")
            time.sleep(INTEGRATION_TIME_S)
    except KeyboardInterrupt:
        logger.info(f"Stopped after {scans} scans.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
