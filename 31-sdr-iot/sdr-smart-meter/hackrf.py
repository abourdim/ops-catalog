#!/usr/bin/env python3
"""SDR Smart Meter Monitor - Detects wireless smart meter transmissions."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

METER_FREQ = 915e6  # US ISM band for smart meters
SAMPLE_RATE = 2.4e6
GAIN = 42
MONITOR_SEC = 60

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = METER_FREQ
    sdr.gain = GAIN
    return sdr

def detect_meter_transmissions(sdr, duration_sec):
    chunk_sec = 1.0
    chunks = int(duration_sec / chunk_sec)
    transmissions = []
    for i in range(chunks):
        iq = sdr.read_samples(int(chunk_sec * SAMPLE_RATE))
        # Detect FSK bursts typical of smart meters
        envelope = np.abs(iq)
        mean_env = np.mean(envelope)
        peaks = np.sum(envelope > mean_env * 3)
        if peaks > len(iq) * 0.01:
            power = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
            transmissions.append({"time_sec": i, "power_db": round(float(power), 1)})
    return transmissions

def main():
    print("=== SDR Smart Meter Monitor ===")
    sdr = configure_sdr()
    try:
        txs = detect_meter_transmissions(sdr, MONITOR_SEC)
        print(f"[meter] Detected {len(txs)} transmissions in {MONITOR_SEC}s")
        if txs:
            rate = len(txs) / (MONITOR_SEC / 60)
            print(f"[meter] Rate: {rate:.1f} tx/min")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
