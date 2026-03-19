#!/usr/bin/env python3
"""SDR RF 101 - Educational RF fundamentals with live SDR demonstrations."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

DEMO_FREQS = [88.1e6, 100e6, 144.39e6, 433.92e6, 462.5625e6]
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def lesson_spectrum(sdr, freq):
    """Lesson: What does the RF spectrum look like?"""
    sdr.center_freq = freq
    time.sleep(0.03)
    iq = sdr.read_samples(FFT_SIZE * 4)
    window = signal.blackmanharris(FFT_SIZE)
    spec = np.fft.fftshift(np.fft.fft(iq[:FFT_SIZE] * window))
    psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
    return {"freq_mhz": freq / 1e6, "peak_db": round(float(np.max(psd_db)), 1),
            "noise_db": round(float(np.median(psd_db)), 1),
            "dynamic_range_db": round(float(np.max(psd_db) - np.median(psd_db)), 1)}

def lesson_modulation(sdr, freq):
    """Lesson: AM vs FM - envelope vs phase."""
    sdr.center_freq = freq
    iq = sdr.read_samples(FFT_SIZE * 8)
    env = np.abs(iq[:1000])
    phase = np.angle(iq[:1000])
    env_var = float(np.var(env) / (np.mean(env) ** 2 + 1e-12))
    phase_var = float(np.var(np.diff(np.unwrap(phase))))
    return {"envelope_variability": round(env_var, 4), "phase_variability": round(phase_var, 4),
            "likely_modulation": "FM" if phase_var > env_var else "AM"}

def lesson_bandwidth(sdr, freq):
    """Lesson: Signal bandwidth measurement."""
    sdr.center_freq = freq
    iq = sdr.read_samples(FFT_SIZE * 4)
    window = signal.blackmanharris(FFT_SIZE)
    spec = np.abs(np.fft.fftshift(np.fft.fft(iq[:FFT_SIZE] * window)))
    psd_db = 10 * np.log10(spec ** 2 + 1e-12)
    peak = np.max(psd_db)
    bw_3db = np.sum(psd_db > peak - 3) * SAMPLE_RATE / FFT_SIZE
    bw_20db = np.sum(psd_db > peak - 20) * SAMPLE_RATE / FFT_SIZE
    return {"bw_3db_khz": round(bw_3db / 1e3, 1), "bw_20db_khz": round(bw_20db / 1e3, 1)}

def main():
    print("=== SDR RF 101 ===")
    sdr = configure_sdr()
    try:
        for freq in DEMO_FREQS:
            print(f"\n--- {freq/1e6:.2f} MHz ---")
            spec = lesson_spectrum(sdr, freq)
            mod = lesson_modulation(sdr, freq)
            bw = lesson_bandwidth(sdr, freq)
            print(f"  Spectrum: {spec}")
            print(f"  Modulation: {mod}")
            print(f"  Bandwidth: {bw}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
