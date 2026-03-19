#!/usr/bin/env python3
"""DIY Earthquake Warning — RTL-SDR VLF Seismo-Electromagnetic Monitor
Monitors VLF radio for pre-earthquake electromagnetic anomalies.
Detects ionospheric disturbances that precede seismic events.
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

CENTER_FREQ = 24e3
SAMPLE_RATE = 2.4e6
GAIN = 49
NUM_SAMPLES = 512 * 1024
PIPE_PATH = "/tmp/sdr_earthquake_pipe"
VLF_STATIONS = [{"name": "NAA", "freq": 24.0e3}, {"name": "NLK", "freq": 24.8e3},
                {"name": "NML", "freq": 25.2e3}]


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info("SDR VLF seismic monitor ready")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    vlf = 0.1 * np.exp(2j * np.pi * 1e3 * t)
    noise = 0.02 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    if np.random.rand() < 0.03:
        burst_len = np.random.randint(1000, 50000)
        start = np.random.randint(0, num_samples - burst_len)
        noise[start:start + burst_len] += 0.2 * np.random.randn(burst_len)
    return (vlf + noise).astype(np.complex64)


def measure_vlf_amplitude(iq_samples, station_freq, bandwidth=100):
    """Measure VLF station amplitude for anomaly detection."""
    t = np.arange(len(iq_samples)) / SAMPLE_RATE
    shifted = iq_samples * np.exp(-2j * np.pi * station_freq * t)
    decimation = max(1, int(SAMPLE_RATE / (bandwidth * 4)))
    cutoff = min(bandwidth / (SAMPLE_RATE / 2), 0.99)
    b, a = scipy_signal.butter(4, cutoff)
    filtered = scipy_signal.lfilter(b, a, shifted)
    decimated = filtered[::decimation]
    amplitude = np.mean(np.abs(decimated))
    phase = np.mean(np.angle(decimated))
    return {"amplitude": float(amplitude), "phase_rad": float(phase)}


def detect_sferic_bursts(iq_samples, threshold_sigma=5):
    """Detect sferic/EMP bursts indicative of seismic EM emissions."""
    envelope = np.abs(iq_samples)
    mean_env = np.mean(envelope)
    std_env = np.std(envelope)
    bursts = np.sum(envelope > mean_env + threshold_sigma * std_env)
    return {"burst_count": int(bursts), "peak_ratio": float(np.max(envelope) / (mean_env + 1e-12))}


def compute_anomaly_index(vlf_measurements, sferics):
    """Compute pre-earthquake anomaly index."""
    amp_anomaly = sum(1 for m in vlf_measurements if m["amplitude"] > 0.15) / max(1, len(vlf_measurements))
    sferic_anomaly = min(1, sferics["burst_count"] / 100)
    return float(0.6 * amp_anomaly + 0.4 * sferic_anomaly)


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
    logger.info("=== DIY Earthquake Warning — SDR VLF Monitor ===")
    sdr = init_sdr()
    setup_pipe()
    scans = 0
    try:
        while True:
            iq = capture_samples(sdr)
            measurements = []
            for station in VLF_STATIONS:
                m = measure_vlf_amplitude(iq, station["freq"])
                m["station"] = station["name"]
                measurements.append(m)
            sferics = detect_sferic_bursts(iq)
            anomaly = compute_anomaly_index(measurements, sferics)
            data = {"vlf_anomaly": anomaly, "sferics": sferics["burst_count"]}
            sent = send_data(data)
            scans += 1
            if anomaly > 0.3:
                logger.warning(f"VLF ANOMALY={anomaly:.2f} sferics={sferics['burst_count']} {'-> RPi' if sent else ''}")
            elif scans % 10 == 0:
                logger.info(f"Scan {scans}: anomaly={anomaly:.2f} sferics={sferics['burst_count']}")
            time.sleep(5)
    except KeyboardInterrupt:
        logger.info("Stopped.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
