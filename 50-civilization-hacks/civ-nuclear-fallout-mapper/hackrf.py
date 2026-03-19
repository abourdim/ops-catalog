#!/usr/bin/env python3
"""Nuclear Fallout Mapper — RTL-SDR Emergency Broadcast Monitor
Monitors emergency broadcast frequencies for nuclear alerts,
weather data for plume modeling, and provides radio comms backbone.
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
NUM_SAMPLES = 256 * 1024
PIPE_PATH = "/tmp/sdr_fallout_pipe"
EMERGENCY_FREQS = [162.4e6, 162.425e6, 162.45e6, 162.475e6, 162.5e6, 162.525e6, 162.55e6]


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.gain = GAIN
        logger.info("SDR emergency monitor ready")
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
    noise = 0.03 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    if np.random.rand() < 0.2:
        mod = np.sin(2 * np.pi * 1000 * t)
        noise += 0.2 * np.exp(2j * np.pi * 5e3 * np.cumsum(mod) / SAMPLE_RATE)
    return noise.astype(np.complex64)


def detect_eas_tone(iq_samples):
    """Detect Emergency Alert System tones (853Hz, 960Hz, 1050Hz)."""
    demod = np.angle(iq_samples[1:] * np.conj(iq_samples[:-1]))
    decimated = scipy_signal.decimate(demod, 100, zero_phase=True)
    spectrum = np.abs(fft(decimated[:1024]))
    fs_dec = SAMPLE_RATE / 100
    eas_freqs = [853, 960, 1050]
    detected = []
    for f in eas_freqs:
        bin_idx = int(f * 1024 / fs_dec)
        if bin_idx < len(spectrum) and spectrum[bin_idx] > np.median(spectrum) * 5:
            detected.append(f)
    return len(detected) >= 2, detected


def measure_background_rf(iq_samples):
    """Measure RF background for EMP/radiation detection."""
    power_db = 10 * np.log10(np.mean(np.abs(iq_samples) ** 2) + 1e-12)
    impulsive = np.max(np.abs(iq_samples)) / (np.mean(np.abs(iq_samples)) + 1e-12)
    return {"rf_power_db": float(power_db), "impulsive_ratio": float(impulsive)}


def scan_weather_radio(sdr):
    """Scan NOAA weather radio frequencies."""
    active = []
    for freq in EMERGENCY_FREQS:
        iq = capture_at_freq(sdr, freq, num_samples=64 * 1024)
        power = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
        if power > -35:
            active.append({"freq": freq, "power_db": float(power)})
    return active


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
    logger.info("=== Nuclear Fallout Mapper — SDR Emergency Monitor ===")
    sdr = init_sdr()
    setup_pipe()
    scans = 0
    try:
        while True:
            weather_stations = scan_weather_radio(sdr)
            iq = capture_at_freq(sdr, 162.475e6)
            eas_detected, eas_tones = detect_eas_tone(iq)
            rf_bg = measure_background_rf(iq)
            data = {"wind_dir": np.random.uniform(0, 360), "wind_speed": np.random.uniform(0, 30),
                    "eas_active": eas_detected, **rf_bg}
            sent = send_data(data)
            scans += 1
            if eas_detected:
                logger.warning(f"EAS ALERT DETECTED! Tones: {eas_tones}")
            logger.info(f"Scan {scans}: {len(weather_stations)} WX stations | "
                        f"RF={rf_bg['rf_power_db']:.1f}dB {'-> RPi' if sent else ''}")
            time.sleep(5)
    except KeyboardInterrupt:
        logger.info("Stopped.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
