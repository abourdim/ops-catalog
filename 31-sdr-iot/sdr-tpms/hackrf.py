#!/usr/bin/env python3
"""SDR TPMS Receiver - Decodes Tire Pressure Monitoring System signals (315/433 MHz)."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

TPMS_FREQS = [315e6, 433.92e6]
SAMPLE_RATE = 1.0e6
GAIN = 44
CAPTURE_SEC = 30

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def detect_tpms_bursts(sdr, freq, duration_sec):
    sdr.center_freq = freq
    time.sleep(0.03)
    iq = sdr.read_samples(int(duration_sec * SAMPLE_RATE))
    envelope = np.abs(iq)
    threshold = np.mean(envelope) + 4 * np.std(envelope)
    above = envelope > threshold
    edges = np.diff(above.astype(int))
    rising = np.where(edges == 1)[0]
    falling = np.where(edges == -1)[0]
    bursts = []
    for r in rising:
        f_candidates = falling[falling > r]
        if len(f_candidates) > 0:
            f = f_candidates[0]
            dur_ms = (f - r) / SAMPLE_RATE * 1000
            if 5 < dur_ms < 100:  # TPMS burst duration
                bursts.append({"start_sample": int(r), "duration_ms": round(dur_ms, 1)})
    return bursts

def main():
    print("=== SDR TPMS Receiver ===")
    sdr = configure_sdr()
    try:
        for freq in TPMS_FREQS:
            bursts = detect_tpms_bursts(sdr, freq, CAPTURE_SEC)
            print(f"[tpms] {freq/1e6:.2f} MHz: {len(bursts)} TPMS bursts")
            for b in bursts[:5]:
                print(f"    dur={b['duration_ms']:.1f}ms")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
