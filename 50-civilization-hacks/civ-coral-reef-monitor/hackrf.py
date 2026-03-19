#!/usr/bin/env python3
"""Coral Reef Monitor — RTL-SDR Buoy Telemetry Receiver
Receives telemetry from underwater reef monitoring buoys via VHF.
Extracts acoustic data and sensor readings for reef health analysis.
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

CENTER_FREQ = 162.0e6
SAMPLE_RATE = 2.4e6
GAIN = 40
NUM_SAMPLES = 256 * 1024
PIPE_PATH = "/tmp/sdr_coral_pipe"
BUOY_FREQS = [161.5e6, 161.75e6, 162.0e6, 162.25e6]


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR buoy receiver: {CENTER_FREQ/1e6:.1f}MHz")
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
    reef_sounds = sum(0.05 * np.sin(2 * np.pi * f * t) for f in
                      np.random.uniform(200, 20000, 20))
    fm_dev = 5e3
    phase = 2 * np.pi * np.cumsum(reef_sounds * fm_dev / SAMPLE_RATE)
    iq = 0.2 * np.exp(1j * phase)
    noise = 0.05 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (iq + noise).astype(np.complex64)


def demodulate_buoy(iq_samples):
    """FM demodulate buoy telemetry."""
    demod = np.angle(iq_samples[1:] * np.conj(iq_samples[:-1]))
    ratio = max(1, int(SAMPLE_RATE / 44100))
    cutoff = min(20000 / (SAMPLE_RATE / 2), 0.99)
    b, a = scipy_signal.butter(5, cutoff)
    filtered = scipy_signal.lfilter(b, a, demod)
    return filtered[::ratio]


def extract_acoustic_data(audio, fs=44100):
    """Extract acoustic features for reef monitoring."""
    spectrum = np.abs(fft(audio[:4096]))
    low_band = np.mean(spectrum[1:100])
    mid_band = np.mean(spectrum[100:1000])
    high_band = np.mean(spectrum[1000:])
    return {"low_freq_energy": float(low_band), "mid_freq_energy": float(mid_band),
            "high_freq_energy": float(high_band),
            "snapping_shrimp_idx": float(high_band / (mid_band + 1e-12))}


def measure_buoy_signal(iq_samples):
    power_db = 10 * np.log10(np.mean(np.abs(iq_samples) ** 2) + 1e-12)
    return {"power_db": float(power_db)}


def setup_pipe():
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Pipe: {PIPE_PATH}")


def send_audio(audio):
    try:
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, audio.astype(np.float32).tobytes())
        os.close(fd)
        return True
    except OSError:
        return False


def main():
    logger.info("=== Coral Reef Monitor — SDR Buoy Receiver ===")
    sdr = init_sdr()
    setup_pipe()
    scans = 0
    try:
        while True:
            for freq in BUOY_FREQS:
                iq = capture_at_freq(sdr, freq)
                sig = measure_buoy_signal(iq)
                if sig["power_db"] > -40:
                    audio = demodulate_buoy(iq)
                    acoustic = extract_acoustic_data(audio)
                    sent = send_audio(audio)
                    logger.info(f"Buoy {freq/1e6:.2f}MHz: {sig['power_db']:.1f}dB | "
                                f"shrimp={acoustic['snapping_shrimp_idx']:.2f} {'-> RPi' if sent else ''}")
            scans += 1
            time.sleep(10)
    except KeyboardInterrupt:
        logger.info(f"Stopped after {scans} scans.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
