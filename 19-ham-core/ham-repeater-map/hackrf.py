#!/usr/bin/env python3
"""
Ham Repeater Map - Repeater Finder
Scans 2m and 70cm repeater sub-bands to find active repeaters.
Measures signal strength, checks for CTCSS/PL tones, and catalogs
repeater pairs (input/output frequencies).
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- Configuration ---
REPEATER_BANDS = [
    {"name": "2m_output", "start": 145.2e6, "end": 146.0e6, "offset": -0.6e6},
    {"name": "2m_output2", "start": 146.6e6, "end": 147.4e6, "offset": +0.6e6},
    {"name": "70cm_output", "start": 442.0e6, "end": 445.0e6, "offset": +5e6},
]
SAMPLE_RATE = 250e3
FFT_SIZE = 1024
GAIN = 40
CHANNEL_SPACING = 25e3     # 25 kHz FM channel spacing
CTCSS_TONES = [67.0, 71.9, 74.4, 77.0, 79.7, 82.5, 85.4, 88.5, 91.5, 94.8,
               97.4, 100.0, 103.5, 107.2, 110.9, 114.8, 118.8, 123.0, 127.3,
               131.8, 136.5, 141.3, 146.2, 151.4, 156.7, 162.2, 167.9, 173.8,
               179.9, 186.2, 192.8, 203.5, 210.7, 218.1, 225.7, 233.6, 241.8, 250.3]

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def detect_ctcss(audio, sample_rate):
    """Detect CTCSS tone using Goertzel-like approach on low frequencies."""
    # Low pass filter below 300 Hz
    nyq = sample_rate / 2
    b, a = signal.butter(4, 300 / nyq, btype='low')
    low_audio = signal.filtfilt(b, a, audio)
    # Check each CTCSS tone
    best_tone = None
    best_power = 0
    fft_size = min(len(low_audio), 8192)
    spec = np.abs(np.fft.fft(low_audio[:fft_size]))
    freq_res = sample_rate / fft_size
    for tone in CTCSS_TONES:
        bin_idx = int(tone / freq_res)
        if bin_idx < len(spec):
            power = spec[bin_idx]
            if power > best_power:
                best_power = power
                best_tone = tone
    # Check if detected tone is significant
    noise = np.median(spec[1:int(300 / freq_res)])
    if best_power > noise * 5:
        return best_tone
    return None

def scan_repeater_band(sdr, band):
    """Scan a repeater sub-band for active repeaters."""
    repeaters = []
    freq = band["start"]
    while freq <= band["end"]:
        sdr.center_freq = freq
        time.sleep(0.05)
        iq = sdr.read_samples(int(0.5 * SAMPLE_RATE))  # 500ms capture
        rssi = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
        if rssi > -50:  # Active signal detected
            # FM demodulate for CTCSS detection
            demod = np.angle(iq[1:] * np.conj(iq[:-1]))
            audio_rate = 8000
            dec = int(SAMPLE_RATE / audio_rate)
            audio = signal.decimate(demod, dec, zero_phase=True)
            ctcss = detect_ctcss(audio, audio_rate)
            repeater = {
                "output_freq_mhz": round(freq / 1e6, 4),
                "input_freq_mhz": round((freq + band["offset"]) / 1e6, 4),
                "offset_mhz": round(band["offset"] / 1e6, 1),
                "rssi_db": round(float(rssi), 1),
                "ctcss_tone": ctcss,
                "band": band["name"],
            }
            repeaters.append(repeater)
            print(f"  Repeater: {repeater['output_freq_mhz']:.4f} MHz | "
                  f"RSSI: {rssi:.1f} dB | CTCSS: {ctcss}")
        freq += CHANNEL_SPACING
    return repeaters

def main():
    print("=== Ham Repeater Map ===")
    sdr = configure_sdr()
    all_repeaters = []
    try:
        for band in REPEATER_BANDS:
            print(f"\n[rpt] Scanning {band['name']}: {band['start']/1e6:.1f}-{band['end']/1e6:.1f} MHz")
            repeaters = scan_repeater_band(sdr, band)
            all_repeaters.extend(repeaters)
        print(f"\n[rpt] Total repeaters found: {len(all_repeaters)}")
        with open("repeater_map.json", "w") as f:
            json.dump(all_repeaters, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
