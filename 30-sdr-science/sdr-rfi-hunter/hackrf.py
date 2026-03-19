#!/usr/bin/env python3
"""SDR RFI Hunter - Identifies and catalogs radio frequency interference sources."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

SCAN_START = 50e6
SCAN_END = 1700e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40
RFI_THRESHOLD = 15

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def sweep_for_rfi(sdr, start, end, fft_size):
    rfi_sources = []
    freq = start + SAMPLE_RATE / 2
    window = signal.hann(fft_size)
    while freq < end:
        sdr.center_freq = freq
        time.sleep(0.008)
        iq = sdr.read_samples(fft_size * 2)
        spec = np.fft.fftshift(np.fft.fft(iq[:fft_size] * window))
        psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
        noise = np.median(psd_db)
        peaks, _ = signal.find_peaks(psd_db, height=noise + RFI_THRESHOLD, prominence=8)
        for p in peaks:
            sf = freq + (p - fft_size / 2) * SAMPLE_RATE / fft_size
            rfi_sources.append({"freq_mhz": round(sf / 1e6, 3), "power_db": round(float(psd_db[p]), 1),
                               "snr_db": round(float(psd_db[p] - noise), 1)})
        freq += SAMPLE_RATE * 0.75
    return rfi_sources

def classify_rfi(freq_mhz):
    if 87.5 <= freq_mhz <= 108: return "FM_broadcast"
    elif 470 <= freq_mhz <= 698: return "TV_broadcast"
    elif 824 <= freq_mhz <= 960: return "cellular"
    elif 1710 <= freq_mhz <= 1880: return "cellular_DCS"
    return "unknown_RFI"

def main():
    print("=== SDR RFI Hunter ===")
    sdr = configure_sdr()
    try:
        sources = sweep_for_rfi(sdr, SCAN_START, SCAN_END, FFT_SIZE)
        for s in sources:
            s["classification"] = classify_rfi(s["freq_mhz"])
        print(f"[rfi] Found {len(sources)} RFI sources")
        for s in sources[:30]:
            print(f"  {s['freq_mhz']:8.3f} MHz | {s['snr_db']:5.1f} dB | {s['classification']}")
        with open("rfi_catalog.json", "w") as f:
            json.dump(sources, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
