#!/usr/bin/env python3
"""SDR Jupiter Receiver - Receives Jovian decametric radio bursts (~20 MHz)."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time

JUPITER_FREQ = 50e6  # Use with upconverter for 20.1 MHz Jovian emissions
SAMPLE_RATE = 2.4e6
FFT_SIZE = 4096
GAIN = 49
OBSERVATION_SEC = 600

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = JUPITER_FREQ
    sdr.gain = GAIN
    return sdr

def detect_jovian_bursts(iq, sr, fft_size):
    chunk = fft_size * 2
    num_chunks = len(iq) // chunk
    bursts = []
    baseline_power = None
    for i in range(num_chunks):
        seg = iq[i * chunk:(i + 1) * chunk]
        power = 10 * np.log10(np.mean(np.abs(seg) ** 2) + 1e-12)
        if baseline_power is None:
            baseline_power = power
        elif power > baseline_power + 6:
            bursts.append({"time_sec": round(i * chunk / sr, 3), "power_db": round(power, 1),
                          "excess_db": round(power - baseline_power, 1)})
        baseline_power = 0.95 * baseline_power + 0.05 * power
    return bursts

def main():
    print("=== SDR Jupiter Receiver ===")
    sdr = configure_sdr()
    try:
        print(f"[jupiter] Observing for {OBSERVATION_SEC}s...")
        iq = sdr.read_samples(int(min(60, OBSERVATION_SEC) * SAMPLE_RATE))
        bursts = detect_jovian_bursts(iq, SAMPLE_RATE, FFT_SIZE)
        print(f"[jupiter] Detected {len(bursts)} burst candidates")
        for b in bursts[:20]:
            print(f"  t={b['time_sec']:.3f}s | excess: +{b['excess_db']:.1f} dB")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
