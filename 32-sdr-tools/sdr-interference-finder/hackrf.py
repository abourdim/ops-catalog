#!/usr/bin/env python3
"""SDR Interference Finder - Locates sources of RF interference on specific frequencies."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

TARGET_FREQ = 144.0e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 4096
GAIN = 40
MONITOR_SEC = 60

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = TARGET_FREQ
    sdr.gain = GAIN
    return sdr

def characterize_interference(sdr, duration_sec):
    chunk_sec = 1.0
    chunks = int(duration_sec / chunk_sec)
    characteristics = []
    for i in range(chunks):
        iq = sdr.read_samples(int(chunk_sec * SAMPLE_RATE))
        window = signal.blackmanharris(FFT_SIZE)
        spec = np.abs(np.fft.fftshift(np.fft.fft(iq[:FFT_SIZE] * window)))
        psd_db = 10 * np.log10(spec ** 2 + 1e-12)
        noise = np.median(psd_db)
        peaks, _ = signal.find_peaks(psd_db, height=noise + 10)
        interf_bw = np.sum(psd_db > noise + 6) * SAMPLE_RATE / FFT_SIZE
        characteristics.append({
            "time_sec": i, "num_interferers": len(peaks),
            "interference_bw_khz": round(interf_bw / 1e3, 1),
            "peak_level_db": round(float(np.max(psd_db)), 1),
        })
    return characteristics

def identify_pattern(chars):
    bw_values = [c["interference_bw_khz"] for c in chars]
    if np.std(bw_values) < 5:
        return "continuous_interference"
    elif np.mean([c["num_interferers"] for c in chars]) > 5:
        return "broadband_noise"
    return "intermittent_interference"

def main():
    print("=== SDR Interference Finder ===")
    sdr = configure_sdr()
    try:
        chars = characterize_interference(sdr, MONITOR_SEC)
        pattern = identify_pattern(chars)
        print(f"[interf] Pattern: {pattern}")
        print(f"[interf] Avg interferers: {np.mean([c['num_interferers'] for c in chars]):.1f}")
        with open("interference_report.json", "w") as f:
            json.dump({"pattern": pattern, "data": chars}, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
