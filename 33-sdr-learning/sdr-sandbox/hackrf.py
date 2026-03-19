#!/usr/bin/env python3
"""SDR Sandbox - Free-form SDR experimentation environment with safety limits."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

SAMPLE_RATE = 2.4e6
GAIN = 40
MAX_CAPTURE_SAMPLES = 10 * 1024 * 1024  # 10M samples max

def safe_configure(freq_hz, sample_rate, gain):
    """Configure SDR with safety bounds."""
    freq = max(24e6, min(1766e6, freq_hz))
    sr = max(225e3, min(3.2e6, sample_rate))
    g = max(0, min(49.6, gain))
    sdr = RtlSdr()
    sdr.sample_rate = sr
    sdr.center_freq = freq
    sdr.gain = g
    return sdr, freq, sr, g

def capture(sdr, num_samples):
    n = min(num_samples, MAX_CAPTURE_SAMPLES)
    return sdr.read_samples(n)

def quick_spectrum(iq, sr, fft_size=2048):
    window = signal.blackmanharris(fft_size)
    spec = np.fft.fftshift(np.fft.fft(iq[:fft_size] * window))
    psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
    return {"peak_db": round(float(np.max(psd_db)), 1),
            "noise_db": round(float(np.median(psd_db)), 1)}

def quick_demod(iq, mode="fm"):
    if mode == "fm":
        return np.angle(iq[1:] * np.conj(iq[:-1]))
    elif mode == "am":
        return np.abs(iq) - np.mean(np.abs(iq))
    return np.real(iq)

def main():
    print("=== SDR Sandbox ===")
    # Demo: sweep and measure
    freqs = [100e6, 144e6, 433e6, 868e6]
    for freq in freqs:
        sdr, actual_freq, sr, g = safe_configure(freq, SAMPLE_RATE, GAIN)
        iq = capture(sdr, 4096 * 4)
        spec = quick_spectrum(iq, sr)
        demod_fm = quick_demod(iq, "fm")
        demod_am = quick_demod(iq, "am")
        print(f"  {actual_freq/1e6:.0f} MHz: {spec} | FM_rms={np.std(demod_fm):.4f} | AM_rms={np.std(demod_am):.4f}")
        sdr.close()
    print("[sandbox] Experimentation complete")

if __name__ == "__main__":
    main()
