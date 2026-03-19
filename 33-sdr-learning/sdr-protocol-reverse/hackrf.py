#!/usr/bin/env python3
"""SDR Protocol Reverse Engineering - Tools for analyzing unknown RF protocols."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

TARGET_FREQ = 433.92e6
SAMPLE_RATE = 1.0e6
GAIN = 44
CAPTURE_SEC = 10

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = TARGET_FREQ
    sdr.gain = GAIN
    return sdr

def extract_bursts(iq, sr):
    env = np.abs(iq)
    threshold = np.mean(env) + 4 * np.std(env)
    above = env > threshold
    edges = np.diff(above.astype(int))
    rising = np.where(edges == 1)[0]
    falling = np.where(edges == -1)[0]
    bursts = []
    for r in rising:
        f_arr = falling[falling > r]
        if len(f_arr) > 0:
            f = f_arr[0]
            bursts.append({"start": int(r), "end": int(f), "duration_ms": round((f - r) / sr * 1000, 2)})
    return bursts

def analyze_symbol_timing(burst_iq, sr):
    env = np.abs(burst_iq)
    # Auto-correlation to find symbol period
    acorr = np.correlate(env - np.mean(env), env - np.mean(env), mode='full')
    acorr = acorr[len(acorr) // 2:]
    peaks, _ = signal.find_peaks(acorr[10:], distance=5)
    if len(peaks) > 0:
        symbol_period = (peaks[0] + 10) / sr
        return round(symbol_period * 1e6, 1)  # microseconds
    return 0

def extract_bits_ook(burst_iq, sr, bit_period_us):
    env = np.abs(burst_iq)
    spb = int(bit_period_us * 1e-6 * sr)
    if spb < 1:
        return []
    threshold = np.mean(env)
    bits = []
    for i in range(0, len(env) - spb, spb):
        chunk = env[i:i + spb]
        bits.append(1 if np.mean(chunk) > threshold else 0)
    return bits

def main():
    print("=== SDR Protocol Reverse Engineering ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(int(CAPTURE_SEC * SAMPLE_RATE))
        bursts = extract_bursts(iq, SAMPLE_RATE)
        print(f"[reverse] {len(bursts)} bursts detected")
        for i, b in enumerate(bursts[:5]):
            burst_iq = iq[b["start"]:b["end"]]
            sym_us = analyze_symbol_timing(burst_iq, SAMPLE_RATE)
            bits = extract_bits_ook(burst_iq, SAMPLE_RATE, max(sym_us, 100)) if sym_us > 0 else []
            print(f"  Burst {i}: {b['duration_ms']:.1f}ms | Symbol: {sym_us:.0f}us | "
                  f"Bits: {''.join(str(b) for b in bits[:40])}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
