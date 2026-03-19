#!/usr/bin/env python3
"""SDR Keyfob Analyzer - Captures and analyzes wireless keyfob transmissions."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

KEYFOB_FREQ = 433.92e6
SAMPLE_RATE = 1.0e6
GAIN = 44
CAPTURE_SEC = 10

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = KEYFOB_FREQ
    sdr.gain = GAIN
    return sdr

def capture_and_analyze(sdr, duration_sec):
    iq = sdr.read_samples(int(duration_sec * SAMPLE_RATE))
    envelope = np.abs(iq)
    threshold = np.mean(envelope) + 5 * np.std(envelope)
    # Find bursts
    above = envelope > threshold
    edges = np.diff(above.astype(int))
    rising = np.where(edges == 1)[0]
    if len(rising) == 0:
        return {"bursts": 0}
    # Analyze first burst for OOK/ASK pattern
    first_burst_start = rising[0]
    burst_data = envelope[first_burst_start:first_burst_start + int(SAMPLE_RATE * 0.1)]
    # Simple OOK bit recovery
    bit_duration_samples = int(SAMPLE_RATE * 0.0005)  # Assume 500us bit time
    bits = []
    for i in range(0, len(burst_data) - bit_duration_samples, bit_duration_samples):
        chunk = burst_data[i:i + bit_duration_samples]
        bits.append(1 if np.mean(chunk) > threshold * 0.5 else 0)
    return {"bursts": len(rising), "first_burst_bits": len(bits),
            "bit_pattern": ''.join(str(b) for b in bits[:50]),
            "power_db": round(10 * np.log10(np.max(envelope) ** 2 + 1e-12), 1)}

def main():
    print("=== SDR Keyfob Analyzer ===")
    sdr = configure_sdr()
    try:
        print(f"[keyfob] Listening on {KEYFOB_FREQ/1e6:.2f} MHz for {CAPTURE_SEC}s...")
        result = capture_and_analyze(sdr, CAPTURE_SEC)
        print(f"[keyfob] {result}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
