#!/usr/bin/env python3
"""
Ham Contest Station - Band Activity Monitor
Monitors contest-active frequencies to track real-time activity during
ham radio contests. Counts active stations, measures band congestion,
and identifies contest exchange patterns.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

CONTEST_BANDS = [
    {"name": "2m_SSB", "start": 144.15e6, "end": 144.35e6},
    {"name": "2m_FM", "start": 146.4e6, "end": 147.0e6},
    {"name": "70cm_SSB", "start": 432.05e6, "end": 432.3e6},
    {"name": "70cm_FM", "start": 446.0e6, "end": 446.5e6},
]
SAMPLE_RATE = 250e3
FFT_SIZE = 2048
GAIN = 40

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def count_active_stations(sdr, band, fft_size):
    """Count number of distinct signals in a contest band segment."""
    signals = []
    window = signal.hann(fft_size)
    freq = band["start"] + SAMPLE_RATE / 2
    while freq < band["end"]:
        sdr.center_freq = freq
        time.sleep(0.01)
        iq = sdr.read_samples(fft_size * 2)
        spec = np.fft.fftshift(np.fft.fft(iq[:fft_size] * window))
        psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
        noise = np.median(psd_db)
        peaks, _ = signal.find_peaks(psd_db, height=noise + 8, distance=10)
        for p in peaks:
            sf = freq + (p - fft_size / 2) * SAMPLE_RATE / fft_size
            signals.append({"freq_mhz": round(sf / 1e6, 4), "power_db": round(float(psd_db[p]), 1)})
        freq += SAMPLE_RATE * 0.75
    # Deduplicate
    unique = []
    for s in sorted(signals, key=lambda x: x["freq_mhz"]):
        if not unique or abs(s["freq_mhz"] - unique[-1]["freq_mhz"]) > 0.003:
            unique.append(s)
    return unique

def main():
    print("=== Ham Contest Station Monitor ===")
    sdr = configure_sdr()
    try:
        for cycle in range(5):
            print(f"\n--- Scan {cycle + 1} ---")
            total = 0
            for band in CONTEST_BANDS:
                stations = count_active_stations(sdr, band, FFT_SIZE)
                total += len(stations)
                bw_mhz = (band["end"] - band["start"]) / 1e6
                density = len(stations) / bw_mhz if bw_mhz > 0 else 0
                print(f"  {band['name']:12s}: {len(stations):3d} stations | "
                      f"Density: {density:.0f}/MHz")
            print(f"  Total active stations: {total}")
            time.sleep(60)
    except KeyboardInterrupt:
        print("\n[contest] Monitoring stopped.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
