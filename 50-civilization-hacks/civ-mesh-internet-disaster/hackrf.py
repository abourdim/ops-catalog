#!/usr/bin/env python3
"""Mesh Internet Disaster — RTL-SDR Radio Link for Mesh Network
Monitors emergency frequencies and provides RF communication backbone
for the disaster mesh network. Detects nearby nodes via beacon signals.
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

CENTER_FREQ = 433.92e6
SAMPLE_RATE = 2.4e6
GAIN = 40
NUM_SAMPLES = 128 * 1024
PIPE_PATH = "/tmp/sdr_mesh_pipe"
EMERGENCY_FREQS = [121.5e6, 156.8e6, 243e6, 406e6, 433.92e6, 462.5625e6]


def init_sdr():
    try:
        from rtlsdr import RtlSdr
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        logger.info(f"SDR: {CENTER_FREQ/1e6:.3f}MHz")
        return sdr
    except Exception as e:
        logger.warning(f"SDR unavailable: {e}. Simulating.")
        return None


def capture_samples(sdr, freq=None, num_samples=NUM_SAMPLES):
    if sdr is not None:
        if freq:
            sdr.center_freq = freq
        return sdr.read_samples(num_samples)
    t = np.arange(num_samples) / SAMPLE_RATE
    noise = 0.02 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    if np.random.rand() < 0.3:
        beacon_freq = np.random.uniform(-50e3, 50e3)
        beacon_dur = int(SAMPLE_RATE * 0.1)
        start = np.random.randint(0, num_samples - beacon_dur)
        t_beacon = np.arange(beacon_dur) / SAMPLE_RATE
        noise[start:start + beacon_dur] += 0.3 * np.exp(2j * np.pi * beacon_freq * t_beacon)
    return noise.astype(np.complex64)


def detect_beacons(iq_samples, threshold_db=-20):
    """Detect mesh beacon signals in captured data."""
    psd = np.abs(fftshift(fft(iq_samples[:4096]))) ** 2
    psd_db = 10 * np.log10(psd + 1e-12)
    noise_floor = np.median(psd_db)
    peaks = np.where(psd_db > noise_floor + 15)[0]
    beacons = []
    if len(peaks) > 0:
        freq_axis = np.linspace(-SAMPLE_RATE/2, SAMPLE_RATE/2, len(psd_db))
        groups = np.split(peaks, np.where(np.diff(peaks) > 5)[0] + 1)
        for group in groups:
            if len(group) >= 2:
                center = group[len(group) // 2]
                beacons.append({
                    "freq_offset": float(freq_axis[center]),
                    "power_db": float(np.max(psd_db[group])),
                    "snr_db": float(np.max(psd_db[group]) - noise_floor),
                })
    return beacons


def demodulate_fsk(iq_samples, symbol_rate=1200):
    """Demodulate FSK beacon data."""
    phase = np.unwrap(np.angle(iq_samples))
    inst_freq = np.diff(phase) * SAMPLE_RATE / (2 * np.pi)
    sps = int(SAMPLE_RATE / symbol_rate)
    symbols = []
    for i in range(0, len(inst_freq) - sps, sps):
        avg_freq = np.mean(inst_freq[i:i + sps])
        symbols.append(1 if avg_freq > 0 else 0)
    return np.array(symbols, dtype=np.uint8)


def scan_emergency_bands(sdr):
    """Scan emergency frequencies for activity."""
    active_freqs = []
    for freq in EMERGENCY_FREQS:
        iq = capture_samples(sdr, freq, num_samples=32 * 1024)
        power = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
        if power > -30:
            active_freqs.append({"freq": freq, "power_db": float(power)})
    return active_freqs


def measure_link_quality(iq_samples):
    """Measure RF link quality metrics."""
    power_db = 10 * np.log10(np.mean(np.abs(iq_samples) ** 2) + 1e-12)
    noise_est = np.var(np.diff(iq_samples).real)
    snr = 10 * np.log10(np.mean(np.abs(iq_samples) ** 2) / (noise_est + 1e-12))
    return {"rssi_db": float(power_db), "snr_db": float(snr)}


def setup_pipe():
    if os.path.exists(PIPE_PATH):
        os.remove(PIPE_PATH)
    os.mkfifo(PIPE_PATH)
    logger.info(f"Mesh pipe: {PIPE_PATH}")


def send_to_mesh(data):
    try:
        fd = os.open(PIPE_PATH, os.O_WRONLY | os.O_NONBLOCK)
        os.write(fd, json.dumps(data).encode())
        os.close(fd)
        return True
    except OSError:
        return False


def main():
    logger.info("=== Mesh Internet Disaster — SDR Radio Link ===")
    sdr = init_sdr()
    setup_pipe()
    scan_cycle = 0

    try:
        while True:
            iq = capture_samples(sdr)
            beacons = detect_beacons(iq)
            link = measure_link_quality(iq)
            for beacon in beacons:
                beacon_data = {"type": "beacon", "node_id": f"sdr_node",
                               "timestamp": time.time(), "hops": 0, **beacon}
                send_to_mesh(beacon_data)

            scan_cycle += 1
            if scan_cycle % 30 == 0:
                active = scan_emergency_bands(sdr)
                if active:
                    logger.info(f"Emergency activity: {len(active)} freqs")

            logger.info(f"Beacons: {len(beacons)} | RSSI={link['rssi_db']:.1f}dB | "
                        f"SNR={link['snr_db']:.1f}dB")
            time.sleep(1.0)

    except KeyboardInterrupt:
        logger.info("Radio link stopped.")
        if sdr:
            sdr.close()
        if os.path.exists(PIPE_PATH):
            os.remove(PIPE_PATH)


if __name__ == "__main__":
    main()
