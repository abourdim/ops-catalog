#!/usr/bin/env python3
"""SDR Lightning Detector - Detects lightning strike RF emissions (sferics)."""
import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

LISTEN_FREQ = 50e6  # VLF/LF lightning emissions (using upconverter or direct)
SAMPLE_RATE = 2.4e6
GAIN = 30
MONITOR_SECONDS = 120

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = LISTEN_FREQ
    sdr.gain = GAIN
    return sdr

def detect_impulses(iq, sr, threshold_sigma=5):
    envelope = np.abs(iq)
    mean_env = np.mean(envelope)
    std_env = np.std(envelope)
    threshold = mean_env + threshold_sigma * std_env
    above = envelope > threshold
    edges = np.diff(above.astype(int))
    rising = np.where(edges == 1)[0]
    strikes = []
    for r in rising:
        peak_region = envelope[r:min(r + 100, len(envelope))]
        peak_val = np.max(peak_region)
        strikes.append({"sample": int(r), "time_sec": round(r / sr, 6),
                        "amplitude": round(float(peak_val), 4),
                        "snr_db": round(float(20 * np.log10(peak_val / (mean_env + 1e-12))), 1)})
    return strikes

def main():
    print("=== SDR Lightning Detector ===")
    sdr = configure_sdr()
    all_strikes = []
    try:
        chunk_sec = 5
        chunks = int(MONITOR_SECONDS / chunk_sec)
        for i in range(chunks):
            iq = sdr.read_samples(int(chunk_sec * SAMPLE_RATE))
            strikes = detect_impulses(iq, SAMPLE_RATE)
            all_strikes.extend(strikes)
            if strikes:
                print(f"  [{time.strftime('%H:%M:%S')}] {len(strikes)} strikes detected")
        print(f"\n[lightning] Total strikes: {len(all_strikes)} in {MONITOR_SECONDS}s")
        rate = len(all_strikes) / (MONITOR_SECONDS / 60)
        print(f"[lightning] Rate: {rate:.1f} strikes/min")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
