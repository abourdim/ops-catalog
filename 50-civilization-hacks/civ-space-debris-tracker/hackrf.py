#!/usr/bin/env python3
"""Space Debris Tracker — RTL-SDR Bistatic Radar Receiver
Receives reflected radar signals from space debris using
broadcast transmitters as illuminators of opportunity.
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

CENTER_FREQ = 100e6
SAMPLE_RATE = 2.4e6
GAIN = 49
NUM_SAMPLES = 512 * 1024
PIPE_PATH = "/tmp/sdr_debris_pipe"


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR passive radar: {CENTER_FREQ/1e6:.0f}MHz")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, num_samples=NUM_SAMPLES):
    if sdr is not None:
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    direct = 0.5 * np.exp(2j * np.pi * 50e3 * t)
    noise = 0.03 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    if np.random.rand() < 0.3:
        delay = np.random.randint(1000, 50000)
        doppler = np.random.uniform(-500, 500)
        rcs = np.random.uniform(0.001, 0.01)
        echo = np.roll(direct, delay) * rcs * np.exp(2j * np.pi * doppler * t)
        noise += echo
    return (direct + noise).astype(np.complex64)


def cross_ambiguity_function(reference, surveillance, max_delay=1000, max_doppler=50):
    """Compute cross-ambiguity function for passive radar detection."""
    caf = np.zeros((2 * max_doppler + 1, max_delay))
    ref = reference[:len(surveillance)]
    for d_idx, doppler_bin in enumerate(range(-max_doppler, max_doppler + 1)):
        doppler_hz = doppler_bin * SAMPLE_RATE / len(ref)
        t = np.arange(len(ref)) / SAMPLE_RATE
        shifted = surveillance * np.exp(-2j * np.pi * doppler_hz * t)
        corr = np.abs(np.correlate(shifted[:max_delay * 2], ref[:max_delay], mode='valid'))
        caf[d_idx, :len(corr)] = corr[:max_delay]
    return caf


def detect_targets(caf, threshold_db=15):
    """Detect targets in cross-ambiguity function."""
    caf_db = 20 * np.log10(caf + 1e-12)
    noise_floor = np.median(caf_db)
    targets = []
    peaks = np.where(caf_db > noise_floor + threshold_db)
    if len(peaks[0]) > 0:
        for i in range(min(len(peaks[0]), 5)):
            doppler_bin = peaks[0][i]
            delay_bin = peaks[1][i]
            range_km = delay_bin * 3e5 / (2 * SAMPLE_RATE)
            doppler_hz = (doppler_bin - caf.shape[0] // 2) * SAMPLE_RATE / NUM_SAMPLES
            targets.append({"range_km": float(range_km), "doppler_hz": float(doppler_hz),
                            "rcs_dbsm": float(caf_db[peaks[0][i], peaks[1][i]] - 60),
                            "detected": True})
    return targets


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
    logger.info("=== Space Debris Tracker — SDR Passive Radar ===")
    sdr = init_sdr()
    setup_pipe()
    scans = 0
    total_detections = 0
    try:
        while True:
            iq = capture_samples(sdr)
            ref = iq[:len(iq) // 2]
            surv = iq[len(iq) // 2:]
            caf = cross_ambiguity_function(ref, surv, max_delay=500, max_doppler=25)
            targets = detect_targets(caf)
            scans += 1
            for t in targets:
                total_detections += 1
                sent = send_data(t)
                logger.info(f"TARGET: range={t['range_km']:.0f}km doppler={t['doppler_hz']:.0f}Hz "
                            f"RCS={t['rcs_dbsm']:.0f}dBsm {'-> RPi' if sent else ''}")
            if scans % 10 == 0:
                logger.info(f"Scan {scans}: {total_detections} total detections")
            time.sleep(2)
    except KeyboardInterrupt:
        logger.info(f"Stopped. {scans} scans, {total_detections} detections.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
