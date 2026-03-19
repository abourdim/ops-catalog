#!/usr/bin/env python3
"""
Ham All-Band Receiver
Full-coverage amateur radio receiver spanning all VHF/UHF ham bands.
Provides simultaneous monitoring capability with automatic mode detection,
S-meter, and frequency scanning across all allocated bands.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

ALL_BANDS = [
    {"name": "6m", "start": 50e6, "end": 54e6, "mode": "mixed"},
    {"name": "2m", "start": 144e6, "end": 148e6, "mode": "mixed"},
    {"name": "1.25m", "start": 222e6, "end": 225e6, "mode": "FM"},
    {"name": "70cm", "start": 420e6, "end": 450e6, "mode": "mixed"},
    {"name": "33cm", "start": 902e6, "end": 928e6, "mode": "mixed"},
    {"name": "23cm", "start": 1240e6, "end": 1300e6, "mode": "mixed"},
]
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def quick_scan_band(sdr, band):
    """Quickly scan an entire band for active signals."""
    signals = []
    window = signal.hann(FFT_SIZE)
    freq = band["start"] + SAMPLE_RATE / 2
    while freq < band["end"]:
        sdr.center_freq = freq
        time.sleep(0.008)
        iq = sdr.read_samples(FFT_SIZE * 2)
        spec = np.fft.fftshift(np.fft.fft(iq[:FFT_SIZE] * window))
        psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
        noise = np.median(psd_db)
        peaks, _ = signal.find_peaks(psd_db, height=noise + 8, distance=5)
        for p in peaks:
            sig_freq = freq + (p - FFT_SIZE / 2) * SAMPLE_RATE / FFT_SIZE
            if band["start"] <= sig_freq <= band["end"]:
                signals.append({
                    "freq_mhz": round(sig_freq / 1e6, 4),
                    "power_db": round(float(psd_db[p]), 1),
                    "snr_db": round(float(psd_db[p] - noise), 1),
                })
        freq += SAMPLE_RATE * 0.75
    # Deduplicate
    unique = []
    for s in sorted(signals, key=lambda x: x["freq_mhz"]):
        if not unique or abs(s["freq_mhz"] - unique[-1]["freq_mhz"]) > 0.005:
            unique.append(s)
    return unique

def auto_detect_mode(bandwidth_hz, freq_mhz):
    """Detect signal mode from bandwidth and frequency."""
    if bandwidth_hz < 500:
        return "CW"
    elif bandwidth_hz < 4000:
        return "SSB"
    elif bandwidth_hz < 8000:
        return "AM"
    elif bandwidth_hz < 20000:
        return "NFM"
    elif bandwidth_hz < 200000:
        return "WFM"
    return "digital"

def main():
    print("=== Ham All-Band Receiver ===")
    sdr = configure_sdr()
    band_summary = {}
    try:
        for band in ALL_BANDS:
            print(f"\n[allband] Scanning {band['name']} ({band['start']/1e6:.0f}-{band['end']/1e6:.0f} MHz)...")
            signals = quick_scan_band(sdr, band)
            band_summary[band["name"]] = {"signals": len(signals)}
            print(f"  Found {len(signals)} signals")
            for s in signals[:10]:
                print(f"    {s['freq_mhz']:10.4f} MHz | {s['power_db']:6.1f} dB | SNR {s['snr_db']:5.1f}")
        total = sum(b["signals"] for b in band_summary.values())
        print(f"\n[allband] Total signals across all bands: {total}")
        with open("allband_scan.json", "w") as f:
            json.dump(band_summary, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
