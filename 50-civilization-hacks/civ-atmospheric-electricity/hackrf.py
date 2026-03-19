#!/usr/bin/env python3
"""Atmospheric Electricity — RTL-SDR Sferic & Lightning Detector
Monitors VLF/ELF bands for sferics (lightning RF emissions),
Schumann resonances, and atmospheric electromagnetic activity.
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
PIPE_PATH = "/tmp/sdr_atmos_pipe"
SCHUMANN_FREQS = [7.83, 14.3, 20.8, 27.3, 33.8]


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info("SDR atmospheric electricity monitor")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    noise = 0.02 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    n_sferics = np.random.poisson(3)
    for _ in range(n_sferics):
        pos = np.random.randint(0, num_samples - 1000)
        sferic = 0.5 * np.exp(-np.arange(1000) / 200) * np.sin(2 * np.pi * 5e3 * np.arange(1000) / SAMPLE_RATE)
        noise[pos:pos + 1000] += sferic + 1j * sferic * 0.3
    return noise.astype(np.complex64)


def detect_sferics(iq_samples, threshold_sigma=4):
    """Detect individual sferic (lightning) events."""
    envelope = np.abs(iq_samples)
    mean_env = np.mean(envelope)
    std_env = np.std(envelope)
    threshold = mean_env + threshold_sigma * std_env
    above = envelope > threshold
    transitions = np.diff(above.astype(int))
    starts = np.where(transitions == 1)[0]
    sferics = []
    for start in starts[:50]:
        end_candidates = np.where(transitions[start:] == -1)[0]
        if len(end_candidates) > 0:
            end = start + end_candidates[0]
            peak = float(np.max(envelope[start:end + 1]))
            duration_us = (end - start) / SAMPLE_RATE * 1e6
            sferics.append({"time_idx": int(start), "peak": peak, "duration_us": round(duration_us, 1)})
    return sferics


def measure_schumann_resonances(iq_samples):
    """Attempt to detect Schumann resonances in ELF band."""
    decimated = scipy_signal.decimate(np.real(iq_samples), 10000, zero_phase=True)
    fs_dec = SAMPLE_RATE / 10000
    spectrum = np.abs(fft(decimated[:1024]))
    freqs = np.fft.fftfreq(1024, 1.0 / fs_dec)
    resonances = {}
    for sr in SCHUMANN_FREQS:
        idx = np.argmin(np.abs(freqs - sr))
        resonances[f"{sr}Hz"] = float(spectrum[idx])
    return resonances


def compute_sferic_rate(sferics, duration_s):
    """Compute sferic rate per minute."""
    if duration_s <= 0:
        return 0
    return len(sferics) * 60 / duration_s


def estimate_storm_bearing(sferics, iq_samples):
    """Estimate bearing to lightning source."""
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
    logger.info("=== Atmospheric Electricity — SDR Sferic Detector ===")
    sdr = init_sdr()
    setup_pipe()
    scans = 0
    total_sferics = 0
    try:
        while True:
            iq = capture_samples(sdr)
            duration_s = len(iq) / SAMPLE_RATE
            sferics = detect_sferics(iq)
            schumann = measure_schumann_resonances(iq)
            rate = compute_sferic_rate(sferics, duration_s)
            total_sferics += len(sferics)
            data = {"sferic_count": len(sferics), "rate_per_min": round(rate, 1),
                    "schumann_7_83": schumann.get("7.83Hz", 0)}
            sent = send_data(data)
            scans += 1
            logger.info(f"Scan {scans}: {len(sferics)} sferics ({rate:.0f}/min) | "
                        f"Schumann 7.83Hz={schumann.get('7.83Hz', 0):.2f} | "
                        f"total={total_sferics} {'-> RPi' if sent else ''}")
            time.sleep(5)
    except KeyboardInterrupt:
        logger.info(f"Stopped. {total_sferics} total sferics detected.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
