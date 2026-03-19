#!/usr/bin/env python3
"""SDR VHF Airband Scanner - Monitors aviation VHF voice communications (118-137 MHz)."""
import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

AIRBAND_START = 118e6
AIRBAND_END = 137e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 42
CHANNEL_SPACING = 25e3

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def scan_airband(sdr):
    active = []
    freq = AIRBAND_START + SAMPLE_RATE / 2
    while freq < AIRBAND_END:
        sdr.center_freq = freq
        time.sleep(0.01)
        iq = sdr.read_samples(FFT_SIZE * 2)
        window = signal.hann(FFT_SIZE)
        spec = np.fft.fftshift(np.fft.fft(iq[:FFT_SIZE] * window))
        psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
        noise = np.median(psd_db)
        peaks, _ = signal.find_peaks(psd_db, height=noise + 12, distance=10)
        for p in peaks:
            sf = freq + (p - FFT_SIZE / 2) * SAMPLE_RATE / FFT_SIZE
            if AIRBAND_START <= sf <= AIRBAND_END:
                ch = round(sf / CHANNEL_SPACING) * CHANNEL_SPACING
                active.append({"freq_mhz": round(ch / 1e6, 3), "power_db": round(float(psd_db[p]), 1)})
        freq += SAMPLE_RATE * 0.75
    unique = []
    for a in sorted(active, key=lambda x: x["freq_mhz"]):
        if not unique or abs(a["freq_mhz"] - unique[-1]["freq_mhz"]) > 0.02:
            unique.append(a)
    return unique

def am_demodulate(iq):
    return np.abs(iq) - np.mean(np.abs(iq))

def main():
    print("=== SDR VHF Airband Scanner ===")
    sdr = configure_sdr()
    try:
        channels = scan_airband(sdr)
        print(f"[airband] Active channels: {len(channels)}")
        for ch in channels:
            print(f"  {ch['freq_mhz']:.3f} MHz | {ch['power_db']:.1f} dB")
        with open("airband_scan.json", "w") as f:
            json.dump(channels, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
