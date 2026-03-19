#!/usr/bin/env python3
"""DIY Starlink Tracker — RTL-SDR Satellite Signal Receiver
Receives Starlink/LEO satellite downlink signals, measures Doppler shift,
and provides signal strength data for tracking verification.
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

STARLINK_DL_FREQ = 11.325e9
MONITORING_FREQ = 137.5e6
SAMPLE_RATE = 2.4e6
GAIN = 45
NUM_SAMPLES = 256 * 1024
PIPE_PATH = "/tmp/sdr_starlink_pipe"
SAT_FREQS = [
    {"name": "NOAA-15", "freq": 137.62e6},
    {"name": "NOAA-18", "freq": 137.9125e6},
    {"name": "NOAA-19", "freq": 137.1e6},
    {"name": "ISS_APRS", "freq": 145.825e6},
    {"name": "Starlink_beacon", "freq": 137.5e6},
]


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.gain = GAIN
        logger.info("SDR ready for satellite reception")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_at_freq(sdr, freq, num_samples=NUM_SAMPLES):
    if sdr is not None:
        sdr.center_freq = freq
        time.sleep(0.02)
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    doppler = np.random.uniform(-5e3, 5e3)
    if np.random.rand() < 0.3:
        sig = 0.1 * np.exp(2j * np.pi * doppler * t)
        sig *= (1 + 0.3 * np.sin(2 * np.pi * 0.1 * t))
    else:
        sig = np.zeros(num_samples, dtype=np.complex64)
    noise = 0.05 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (sig + noise).astype(np.complex64)


def measure_doppler(iq_samples, fft_size=4096):
    """Measure Doppler shift of satellite signal."""
    spectrum = fftshift(fft(iq_samples[:fft_size]))
    psd = np.abs(spectrum) ** 2
    psd_db = 10 * np.log10(psd + 1e-12)
    noise_floor = np.median(psd_db)
    peak_bin = np.argmax(psd_db)
    peak_power = psd_db[peak_bin]
    if peak_power - noise_floor < 6:
        return 0, False
    freq_axis = np.linspace(-SAMPLE_RATE/2, SAMPLE_RATE/2, fft_size)
    doppler_hz = float(freq_axis[peak_bin])
    return doppler_hz, True


def estimate_range_rate(doppler_hz, carrier_freq):
    """Estimate range rate from Doppler shift."""
    c = 3e8
    return -doppler_hz * c / carrier_freq


def measure_signal_strength(iq_samples):
    """Measure received signal strength."""
    power = np.mean(np.abs(iq_samples) ** 2)
    return float(10 * np.log10(power + 1e-12))


def detect_apt_signal(iq_samples):
    """Detect NOAA APT weather satellite signal."""
    demod = np.abs(iq_samples)
    decimated = scipy_signal.decimate(demod, 50, zero_phase=True)
    fft_data = np.abs(fft(decimated[:1024]))
    apt_carrier_bin = int(2400 * 1024 / (SAMPLE_RATE / 50))
    if apt_carrier_bin < len(fft_data):
        apt_power = fft_data[max(0, apt_carrier_bin - 5):min(len(fft_data), apt_carrier_bin + 5)]
        if np.max(apt_power) > np.median(fft_data) * 3:
            return True
    return False


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
    logger.info("=== DIY Starlink Tracker — SDR Receiver ===")
    sdr = init_sdr()
    setup_pipe()

    try:
        while True:
            for sat in SAT_FREQS:
                iq = capture_at_freq(sdr, sat["freq"])
                sig_db = measure_signal_strength(iq)
                doppler, detected = measure_doppler(iq)
                if detected:
                    range_rate = estimate_range_rate(doppler, sat["freq"])
                    data = {"signal_db": sig_db, "doppler_hz": doppler,
                            "satellite": sat["name"], "detected": True}
                    send_data(data)
                    logger.info(f"SAT {sat['name']}: {sig_db:.1f}dB | "
                                f"Doppler={doppler:.0f}Hz | RR={range_rate:.0f}m/s")
                else:
                    logger.debug(f"{sat['name']}: no signal ({sig_db:.1f}dB)")
            time.sleep(5)

    except KeyboardInterrupt:
        logger.info("Receiver stopped.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
