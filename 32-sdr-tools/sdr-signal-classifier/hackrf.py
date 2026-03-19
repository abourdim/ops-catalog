#!/usr/bin/env python3
"""SDR Signal Classifier - Automatic modulation recognition using statistical features."""
import numpy as np, scipy.signal as signal
from scipy.stats import kurtosis, skew
from rtlsdr import RtlSdr
import time, json

CENTER_FREQ = 433.92e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def extract_features(iq):
    env = np.abs(iq)
    phase = np.angle(iq)
    inst_freq = np.diff(np.unwrap(phase))
    spec = np.abs(np.fft.fft(iq[:FFT_SIZE]))
    psd_norm = spec / (np.sum(spec) + 1e-12)
    return {
        "env_mean": round(float(np.mean(env)), 4), "env_std": round(float(np.std(env)), 4),
        "env_kurtosis": round(float(kurtosis(env)), 4), "env_skew": round(float(skew(env)), 4),
        "phase_std": round(float(np.std(inst_freq)), 4),
        "spectral_flatness": round(float(np.exp(np.mean(np.log(spec + 1e-12))) / np.mean(spec)), 6),
        "spectral_kurtosis": round(float(kurtosis(spec)), 4),
    }

def classify(features):
    if features["env_std"] < 0.1 and features["phase_std"] > 0.3:
        return "FM/FSK"
    elif features["env_kurtosis"] > 5:
        return "OOK/ASK"
    elif features["spectral_flatness"] > 0.3:
        return "spread_spectrum"
    elif features["env_std"] < 0.05:
        return "CW/carrier"
    return "PSK/QAM"

def main():
    print("=== SDR Signal Classifier ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(FFT_SIZE * 8)
        features = extract_features(iq)
        classification = classify(features)
        print(f"[classify] Features: {json.dumps(features, indent=2)}")
        print(f"[classify] Classification: {classification}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
