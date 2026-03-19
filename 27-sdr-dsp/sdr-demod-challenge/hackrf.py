#!/usr/bin/env python3
"""
SDR Demodulation Challenge
Captures real signals and attempts multiple demodulation methods
(AM, FM, SSB, PSK) to find the correct one, scoring each result.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

CENTER_FREQ = 100e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def demod_am(iq):
    return np.abs(iq) - np.mean(np.abs(iq))

def demod_fm(iq):
    return np.angle(iq[1:] * np.conj(iq[:-1]))

def demod_usb(iq, sr):
    t = np.arange(len(iq)) / sr
    shifted = iq * np.exp(-1j * 2 * np.pi * 1500 * t)
    b, a = signal.butter(5, 3000 / (sr / 2))
    return signal.filtfilt(b, a, np.real(shifted))

def demod_lsb(iq, sr):
    t = np.arange(len(iq)) / sr
    shifted = iq * np.exp(1j * 2 * np.pi * 1500 * t)
    b, a = signal.butter(5, 3000 / (sr / 2))
    return signal.filtfilt(b, a, np.real(shifted))

def score_demod(audio):
    """Score demodulation quality: higher = more likely correct."""
    if len(audio) == 0:
        return 0
    # Good demod has high dynamic range and spectral structure
    power = np.mean(audio ** 2)
    if power < 1e-12:
        return 0
    # Spectral flatness (lower = more structured = better for voice/data)
    spec = np.abs(np.fft.fft(audio[:4096]))
    geo = np.exp(np.mean(np.log(spec + 1e-12)))
    arith = np.mean(spec)
    flatness = geo / (arith + 1e-12)
    # Score: lower flatness = more structured signal
    return round(float((1 - flatness) * 100), 1)

def main():
    print("=== SDR Demodulation Challenge ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(FFT_SIZE * 32)
        methods = {"AM": demod_am(iq), "FM": demod_fm(iq),
                   "USB": demod_usb(iq, SAMPLE_RATE), "LSB": demod_lsb(iq, SAMPLE_RATE)}
        results = []
        for name, audio in methods.items():
            score = score_demod(audio)
            results.append({"method": name, "score": score})
            print(f"  {name:4s}: score = {score:.1f}")
        best = max(results, key=lambda x: x["score"])
        print(f"\n[demod] Best demodulation: {best['method']} (score: {best['score']:.1f})")
        with open("demod_challenge.json", "w") as f:
            json.dump(results, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
