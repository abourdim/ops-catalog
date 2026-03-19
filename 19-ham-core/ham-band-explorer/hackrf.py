#!/usr/bin/env python3
"""
Ham Band Explorer
Scans amateur radio band allocations and displays real-time activity.
Covers HF through UHF ham bands, identifying active frequencies and
signal types within each band segment.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- Ham Band Definitions ---
HAM_BANDS = [
    {"name": "6m", "start": 50e6, "end": 54e6, "desc": "VHF magic band"},
    {"name": "2m", "start": 144e6, "end": 148e6, "desc": "VHF workhorse"},
    {"name": "1.25m", "start": 222e6, "end": 225e6, "desc": "220 MHz"},
    {"name": "70cm", "start": 420e6, "end": 450e6, "desc": "UHF amateur"},
    {"name": "33cm", "start": 902e6, "end": 928e6, "desc": "33cm band"},
    {"name": "23cm", "start": 1240e6, "end": 1300e6, "desc": "23cm microwave"},
]

SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def scan_ham_band(sdr, band, fft_size):
    """Scan a single ham band and catalog active frequencies."""
    active_signals = []
    freq = band["start"] + SAMPLE_RATE / 2
    window = signal.blackmanharris(fft_size)
    while freq < band["end"]:
        sdr.center_freq = freq
        time.sleep(0.015)
        iq = sdr.read_samples(fft_size * 4)
        for seg_i in range(min(4, len(iq) // fft_size)):
            seg = iq[seg_i * fft_size:(seg_i + 1) * fft_size]
            spec = np.fft.fftshift(np.fft.fft(seg * window))
            psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
            noise_floor = np.median(psd_db)
            peaks, _ = signal.find_peaks(psd_db, height=noise_floor + 10, prominence=6)
            for p in peaks:
                sig_freq = freq + (p - fft_size / 2) * (SAMPLE_RATE / fft_size)
                active_signals.append({
                    "freq_mhz": round(sig_freq / 1e6, 4),
                    "power_db": round(float(psd_db[p]), 1),
                    "snr_db": round(float(psd_db[p] - noise_floor), 1),
                })
        freq += SAMPLE_RATE * 0.8
    return active_signals

def identify_band_segment(freq_mhz, band_name):
    """Identify the sub-band allocation for a frequency."""
    if band_name == "2m":
        if 144.0 <= freq_mhz <= 144.1:
            return "CW"
        elif 144.1 <= freq_mhz <= 144.3:
            return "SSB/weak_signal"
        elif 144.3 <= freq_mhz <= 144.5:
            return "EME/Oscar"
        elif 145.2 <= freq_mhz <= 145.5:
            return "repeater_input"
        elif 146.0 <= freq_mhz <= 148.0:
            return "FM_simplex/repeater"
    elif band_name == "70cm":
        if 432.0 <= freq_mhz <= 432.1:
            return "CW/EME"
        elif 432.1 <= freq_mhz <= 433.0:
            return "SSB/weak_signal"
        elif 440.0 <= freq_mhz <= 450.0:
            return "FM_repeaters"
    return "general"

def main():
    print("=== Ham Band Explorer ===")
    sdr = configure_sdr()
    try:
        for band in HAM_BANDS:
            print(f"\n[band] Scanning {band['name']} ({band['desc']}): "
                  f"{band['start']/1e6:.0f}-{band['end']/1e6:.0f} MHz")
            signals = scan_ham_band(sdr, band, FFT_SIZE)
            # Deduplicate nearby frequencies
            unique = []
            for s in sorted(signals, key=lambda x: x["freq_mhz"]):
                if not unique or abs(s["freq_mhz"] - unique[-1]["freq_mhz"]) > 0.01:
                    s["segment"] = identify_band_segment(s["freq_mhz"], band["name"])
                    unique.append(s)
            print(f"  Active signals: {len(unique)}")
            for u in unique[:15]:
                print(f"    {u['freq_mhz']:10.4f} MHz | {u['power_db']:6.1f} dB | "
                      f"SNR {u['snr_db']:5.1f} | {u['segment']}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
