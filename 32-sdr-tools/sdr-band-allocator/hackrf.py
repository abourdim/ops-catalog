#!/usr/bin/env python3
"""SDR Band Allocator - Maps spectrum occupancy for frequency coordination."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

SCAN_START = 100e6
SCAN_END = 1000e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40
OCCUPANCY_THRESHOLD = -50

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def scan_occupancy(sdr, start, end, fft_size):
    allocations = []
    freq = start + SAMPLE_RATE / 2
    window = signal.hann(fft_size)
    while freq < end:
        sdr.center_freq = freq
        time.sleep(0.008)
        iq = sdr.read_samples(fft_size * 2)
        spec = np.fft.fftshift(np.fft.fft(iq[:fft_size] * window))
        psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
        occupied = np.sum(psd_db > OCCUPANCY_THRESHOLD) / fft_size * 100
        allocations.append({"freq_mhz": round(freq / 1e6, 0), "occupancy_pct": round(float(occupied), 1),
                           "peak_db": round(float(np.max(psd_db)), 1)})
        freq += SAMPLE_RATE * 0.75
    return allocations

def find_clear_channels(allocations, min_bw_mhz=1):
    clear = [a for a in allocations if a["occupancy_pct"] < 5]
    return clear

def main():
    print("=== SDR Band Allocator ===")
    sdr = configure_sdr()
    try:
        alloc = scan_occupancy(sdr, SCAN_START, SCAN_END, FFT_SIZE)
        clear = find_clear_channels(alloc)
        print(f"[alloc] Scanned {len(alloc)} segments")
        print(f"[alloc] Clear channels: {len(clear)}/{len(alloc)}")
        overall = np.mean([a["occupancy_pct"] for a in alloc])
        print(f"[alloc] Overall occupancy: {overall:.1f}%")
        with open("band_allocation.json", "w") as f:
            json.dump(alloc, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
