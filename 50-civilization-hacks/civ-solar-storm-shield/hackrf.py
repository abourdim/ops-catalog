#!/usr/bin/env python3
"""Solar Storm Shield — RTL-SDR Ionospheric Propagation Monitor
Monitors VLF/HF propagation for solar storm indicators including
sudden frequency enhancements, HF absorption, and noise bursts.
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

SAMPLE_RATE = 2.4e6
GAIN = 40
PIPE_PATH = "/tmp/sdr_solar_pipe"
NUM_SAMPLES = 256 * 1024
MONITOR_FREQS = [
    {"name": "VLF_NAA", "freq": 24.0e3, "type": "vlf"},
    {"name": "WWV_5", "freq": 5.0e6, "type": "hf"},
    {"name": "WWV_10", "freq": 10.0e6, "type": "hf"},
    {"name": "WWV_15", "freq": 15.0e6, "type": "hf"},
    {"name": "WWV_20", "freq": 20.0e6, "type": "hf"},
]


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.gain = GAIN
        logger.info("SDR ready for ionospheric monitoring")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_at_freq(sdr, freq, num_samples=NUM_SAMPLES):
    if sdr is not None:
        sdr.center_freq = freq
        time.sleep(0.05)
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    sig_power = np.random.uniform(0.01, 0.3)
    noise_power = 0.02
    sig = sig_power * np.exp(2j * np.pi * 1e3 * t)
    noise = noise_power * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    if np.random.rand() < 0.05:
        sig *= np.random.uniform(2, 10)
    return (sig + noise).astype(np.complex64)


def measure_signal_strength(iq_samples, bandwidth_hz=1000):
    """Measure signal strength in narrow bandwidth."""
    fft_data = fftshift(fft(iq_samples[:4096]))
    psd = np.abs(fft_data) ** 2
    psd_db = 10 * np.log10(psd + 1e-12)
    center = len(psd) // 2
    bw_bins = int(bandwidth_hz / (SAMPLE_RATE / len(psd)))
    signal_power = np.mean(psd_db[center - bw_bins:center + bw_bins])
    noise_power = np.median(psd_db)
    return float(signal_power), float(noise_power)


def measure_noise_floor(iq_samples):
    """Measure wideband noise floor level."""
    psd = np.abs(fft(iq_samples[:4096])) ** 2
    return float(10 * np.log10(np.median(psd) + 1e-12))


def detect_solar_burst(iq_samples, threshold_db=10):
    """Detect sudden solar radio bursts."""
    block_size = len(iq_samples) // 16
    powers = []
    for i in range(16):
        block = iq_samples[i * block_size:(i + 1) * block_size]
        powers.append(np.mean(np.abs(block) ** 2))
    powers_db = 10 * np.log10(np.array(powers) + 1e-12)
    max_jump = np.max(np.diff(powers_db))
    return float(max_jump), max_jump > threshold_db


def setup_pipe():
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Pipe: {PIPE_PATH}")


def send_measurements(data):
    try:
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, json.dumps(data).encode())
        os.close(fd)
        return True
    except OSError:
        return False


def main():
    logger.info("=== Solar Storm Shield — SDR Ionospheric Monitor ===")
    sdr = init_sdr()
    setup_pipe()

    try:
        while True:
            measurements = {"timestamp": time.time()}
            vlf_power_sum = 0
            hf_noise_sum = 0
            hf_count = 0

            for station in MONITOR_FREQS:
                iq = capture_at_freq(sdr, station["freq"])
                sig_pwr, noise_pwr = measure_signal_strength(iq)
                burst_mag, is_burst = detect_solar_burst(iq)

                if station["type"] == "vlf":
                    vlf_power_sum += sig_pwr
                else:
                    hf_noise_sum += noise_pwr
                    hf_count += 1

                if is_burst:
                    logger.warning(f"Solar burst on {station['name']}: +{burst_mag:.1f}dB")

            measurements["vlf_power"] = vlf_power_sum
            measurements["hf_noise"] = hf_noise_sum / max(1, hf_count)
            sent = send_measurements(measurements)

            logger.info(f"VLF={measurements['vlf_power']:.1f}dB | "
                        f"HF_noise={measurements['hf_noise']:.1f}dB "
                        f"{'-> RPi' if sent else ''}")
            time.sleep(10)

    except KeyboardInterrupt:
        logger.info("Monitor stopped.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
