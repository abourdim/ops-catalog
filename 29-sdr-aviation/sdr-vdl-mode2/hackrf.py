#!/usr/bin/env python3
"""SDR VDL Mode 2 - VHF Digital Link for aviation datalink messages."""
import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

VDL2_FREQ = 136.975e6
SAMPLE_RATE = 250e3
FFT_SIZE = 2048
GAIN = 42
CAPTURE_SECONDS = 30

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = VDL2_FREQ
    sdr.gain = GAIN
    return sdr

def detect_vdl2_bursts(iq, sr):
    chunk = int(sr * 0.01)
    powers = [10 * np.log10(np.mean(np.abs(iq[i:i+chunk]) ** 2) + 1e-12)
              for i in range(0, len(iq) - chunk, chunk)]
    powers = np.array(powers)
    threshold = np.median(powers) + 8
    bursts = []
    in_burst = False
    start = 0
    for i, p in enumerate(powers):
        if p > threshold and not in_burst:
            start = i
            in_burst = True
        elif p <= threshold and in_burst:
            bursts.append({"start_ms": round(start * 10, 0), "duration_ms": round((i - start) * 10, 0),
                          "peak_db": round(float(np.max(powers[start:i])), 1)})
            in_burst = False
    return bursts

def main():
    print("=== SDR VDL Mode 2 Receiver ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(int(CAPTURE_SECONDS * SAMPLE_RATE))
        bursts = detect_vdl2_bursts(iq, SAMPLE_RATE)
        print(f"[vdl2] Detected {len(bursts)} VDL2 bursts in {CAPTURE_SECONDS}s")
        for b in bursts[:20]:
            print(f"  t={b['start_ms']:.0f}ms dur={b['duration_ms']:.0f}ms peak={b['peak_db']:.1f}dB")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
