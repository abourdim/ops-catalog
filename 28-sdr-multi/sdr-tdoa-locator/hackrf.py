#!/usr/bin/env python3
"""SDR TDOA Locator - Time Difference of Arrival transmitter location estimation."""
import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

TARGET_FREQ = 433.92e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 44

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = TARGET_FREQ
    sdr.gain = GAIN
    return sdr

def cross_correlate(sig1, sig2):
    """Compute cross-correlation to find time delay between two signals."""
    corr = np.correlate(sig1, sig2, mode='full')
    peak_idx = np.argmax(np.abs(corr))
    delay_samples = peak_idx - len(sig2) + 1
    delay_sec = delay_samples / SAMPLE_RATE
    confidence = float(np.max(np.abs(corr)) / (np.std(corr) * len(corr) + 1e-12))
    return delay_sec, confidence

def tdoa_to_hyperbola(delay_sec, rx1_pos, rx2_pos):
    """Convert TDOA measurement to hyperbola parameters."""
    c = 3e8  # Speed of light
    distance_diff = delay_sec * c
    baseline = np.sqrt((rx2_pos[0] - rx1_pos[0]) ** 2 + (rx2_pos[1] - rx1_pos[1]) ** 2)
    return {"distance_diff_m": round(float(distance_diff), 2),
            "baseline_m": round(float(baseline), 2)}

def simulate_multi_receiver(sdr, num_captures=3):
    """Simulate multi-receiver TDOA with sequential captures."""
    captures = []
    for i in range(num_captures):
        iq = sdr.read_samples(FFT_SIZE * 8)
        captures.append(np.abs(iq))  # Use envelope for correlation
        time.sleep(0.1)
    # Cross-correlate pairs
    delays = []
    for i in range(len(captures) - 1):
        delay, conf = cross_correlate(captures[0][:4096], captures[i + 1][:4096])
        delays.append({"pair": f"0-{i+1}", "delay_us": round(delay * 1e6, 3),
                       "confidence": round(conf, 4)})
    return delays

def main():
    print("=== SDR TDOA Locator ===")
    sdr = configure_sdr()
    try:
        delays = simulate_multi_receiver(sdr)
        print(f"[tdoa] TDOA measurements:")
        for d in delays:
            print(f"  Pair {d['pair']}: delay = {d['delay_us']:.3f} us | conf = {d['confidence']:.4f}")
        with open("tdoa_results.json", "w") as f:
            json.dump(delays, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
