#!/usr/bin/env python3
"""Volcano Monitor — RTL-SDR RF Emission Anomaly Detector
Monitors VLF/UHF bands for volcanic RF emissions caused by
rock fracture, magma movement, and lightning in ash plumes.
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
GAIN = 45
NUM_SAMPLES = 256 * 1024
PIPE_PATH = "/tmp/sdr_volcano_pipe"
MONITOR_FREQS = [24e3, 50e3, 100e3, 433.92e6, 1e9]


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.gain = GAIN
        logger.info("SDR volcano monitor ready")
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
    noise = 0.02 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    if np.random.rand() < 0.05:
        burst_start = np.random.randint(0, num_samples - 10000)
        burst = 0.5 * np.random.randn(10000) * np.exp(-np.arange(10000) / 3000)
        noise[burst_start:burst_start + 10000] += burst + 1j * burst * 0.5
    return noise.astype(np.complex64)


def detect_rf_anomaly(iq_samples, baseline_power=None):
    """Detect anomalous RF emissions."""
    power_db = 10 * np.log10(np.mean(np.abs(iq_samples) ** 2) + 1e-12)
    spectrum = np.abs(fftshift(fft(iq_samples[:4096]))) ** 2
    spectral_kurtosis = float(np.mean((spectrum - np.mean(spectrum))**4) / (np.var(spectrum)**2 + 1e-12))
    impulsiveness = float(np.max(np.abs(iq_samples)) / (np.mean(np.abs(iq_samples)) + 1e-12))
    anomaly_score = 0
    if impulsiveness > 5:
        anomaly_score += 0.3
    if spectral_kurtosis > 10:
        anomaly_score += 0.3
    if baseline_power and power_db > baseline_power + 10:
        anomaly_score += 0.4
    return {"power_db": float(power_db), "kurtosis": spectral_kurtosis,
            "impulsiveness": impulsiveness, "anomaly_score": min(1.0, anomaly_score)}


def detect_volcanic_lightning(iq_samples):
    """Detect sferics from volcanic lightning."""
    envelope = np.abs(iq_samples)
    threshold = np.mean(envelope) + 5 * np.std(envelope)
    pulses = np.sum(envelope > threshold)
    return {"lightning_pulses": int(pulses), "detected": pulses > 10}


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
    logger.info("=== Volcano Monitor — SDR RF Detector ===")
    sdr = init_sdr()
    setup_pipe()
    baselines = {}
    scans = 0
    try:
        while True:
            max_anomaly = 0
            for freq in MONITOR_FREQS:
                iq = capture_at_freq(sdr, freq)
                result = detect_rf_anomaly(iq, baselines.get(freq))
                lightning = detect_volcanic_lightning(iq)
                if scans < 5:
                    baselines[freq] = result["power_db"]
                max_anomaly = max(max_anomaly, result["anomaly_score"])
                if lightning["detected"]:
                    logger.warning(f"Volcanic lightning at {freq/1e6:.1f}MHz! pulses={lightning['lightning_pulses']}")
            data = {"rf_anomaly": max_anomaly, "timestamp": time.time()}
            sent = send_data(data)
            scans += 1
            logger.info(f"Scan {scans}: max_anomaly={max_anomaly:.2f} {'-> RPi' if sent else ''}")
            time.sleep(5)
    except KeyboardInterrupt:
        logger.info("Stopped.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
