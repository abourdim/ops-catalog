#!/usr/bin/env python3
"""Seed Vault Beacon — RTL-SDR Beacon Receiver & Link Monitor
Receives status beacons from remote seed vaults via RF.
Monitors link quality and decodes telemetry data.
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

BEACON_FREQ = 433.92e6
SAMPLE_RATE = 2.4e6
GAIN = 40
NUM_SAMPLES = 256 * 1024
PIPE_PATH = "/tmp/sdr_seedvault_pipe"
BEACON_BW = 10e3


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = BEACON_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR beacon rx: {BEACON_FREQ/1e6:.2f}MHz")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    noise = 0.03 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    if np.random.rand() < 0.5:
        beacon_dur = int(SAMPLE_RATE * 0.5)
        start = np.random.randint(0, max(1, num_samples - beacon_dur))
        end = min(start + beacon_dur, num_samples)
        bits = np.random.randint(0, 2, 100)
        sps = max(1, (end - start) // len(bits))
        symbols = np.repeat(bits * 2 - 1, sps)[:end - start]
        beacon = 0.1 * symbols * np.exp(2j * np.pi * 1e3 * t[:end - start])
        noise[start:end] += beacon
    return noise.astype(np.complex64)


def detect_beacon(iq_samples):
    """Detect beacon signal presence."""
    power_db = 10 * np.log10(np.mean(np.abs(iq_samples) ** 2) + 1e-12)
    spectrum = np.abs(fftshift(fft(iq_samples[:4096]))) ** 2
    noise_floor = np.median(10 * np.log10(spectrum + 1e-12))
    peak = np.max(10 * np.log10(spectrum + 1e-12))
    snr = peak - noise_floor
    return snr > 8, float(snr), float(power_db)


def demodulate_beacon(iq_samples, symbol_rate=200):
    """Demodulate OOK/FSK beacon data."""
    amplitude = np.abs(iq_samples)
    decimation = max(1, int(SAMPLE_RATE / (symbol_rate * 10)))
    decimated = scipy_signal.decimate(amplitude, decimation, zero_phase=True)
    threshold = np.mean(decimated)
    bits = (decimated > threshold).astype(int)
    sps = max(1, len(bits) // 200)
    symbols = []
    for i in range(0, len(bits) - sps, sps):
        symbols.append(int(np.mean(bits[i:i + sps]) > 0.5))
    return symbols


def measure_link_quality(snr_db, packet_received):
    """Assess RF link quality."""
    if snr_db > 20:
        quality = "excellent"
    elif snr_db > 12:
        quality = "good"
    elif snr_db > 6:
        quality = "marginal"
    else:
        quality = "poor"
    return {"quality": quality, "snr_db": round(snr_db, 1), "packet_received": packet_received}


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
    logger.info("=== Seed Vault Beacon — SDR Receiver ===")
    sdr = init_sdr()
    setup_pipe()
    rx_count = 0
    total_scans = 0
    try:
        while True:
            iq = capture_samples(sdr)
            detected, snr, power = detect_beacon(iq)
            total_scans += 1
            if detected:
                symbols = demodulate_beacon(iq)
                rx_count += 1
                link = measure_link_quality(snr, True)
                data = {"beacon_received": True, "symbols": len(symbols), **link}
                sent = send_data(data)
                logger.info(f"BEACON RX #{rx_count}: SNR={snr:.1f}dB {link['quality']} "
                            f"{len(symbols)} symbols {'-> RPi' if sent else ''}")
            elif total_scans % 10 == 0:
                logger.info(f"Scan {total_scans}: waiting... (rx={rx_count})")
            time.sleep(5)
    except KeyboardInterrupt:
        logger.info(f"Stopped. {rx_count}/{total_scans} beacons received.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
