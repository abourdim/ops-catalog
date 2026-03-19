#!/usr/bin/env python3
"""
HackRF RF Fingerprinter
Captures RF emissions from a target frequency and extracts unique signal
fingerprints based on spectral shape, transient characteristics, and
modulation features. Used to distinguish individual transmitters.
"""

import numpy as np
import scipy.signal as signal
from scipy.stats import kurtosis, skew
from rtlsdr import RtlSdr
import hashlib
import json
import time

# --- Configuration ---
TARGET_FREQ = 433.92e6    # Common ISM band (433 MHz)
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 44
NUM_CAPTURES = 20         # Number of captures per fingerprint
TRANSIENT_SAMPLES = 512   # Samples to analyze for turn-on transient

def configure_sdr():
    """Initialize RTL-SDR for fingerprinting capture."""
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = TARGET_FREQ
    sdr.gain = GAIN
    return sdr

def extract_spectral_features(iq_samples, fft_size):
    """Extract spectral shape features from IQ data."""
    window = signal.blackmanharris(fft_size)
    spectrum = np.fft.fftshift(np.fft.fft(iq_samples[:fft_size] * window))
    psd = np.abs(spectrum) ** 2
    psd_norm = psd / (np.sum(psd) + 1e-12)

    # Spectral centroid
    freq_bins = np.arange(fft_size)
    centroid = np.sum(freq_bins * psd_norm)
    # Spectral spread (standard deviation)
    spread = np.sqrt(np.sum(((freq_bins - centroid) ** 2) * psd_norm))
    # Spectral flatness (Wiener entropy)
    geometric_mean = np.exp(np.mean(np.log(psd + 1e-12)))
    arithmetic_mean = np.mean(psd)
    flatness = geometric_mean / (arithmetic_mean + 1e-12)
    # Spectral kurtosis and skewness
    spec_kurtosis = float(kurtosis(psd))
    spec_skewness = float(skew(psd))

    return {
        "centroid": round(float(centroid), 4),
        "spread": round(float(spread), 4),
        "flatness": round(float(flatness), 6),
        "kurtosis": round(spec_kurtosis, 4),
        "skewness": round(spec_skewness, 4),
    }

def extract_transient_features(iq_samples, n_samples):
    """Analyze turn-on transient for device-specific characteristics."""
    envelope = np.abs(iq_samples[:n_samples])
    # Rise time (10% to 90% of max)
    max_env = np.max(envelope)
    if max_env < 1e-6:
        return {"rise_time": 0, "overshoot": 0, "settling_var": 0}
    t10 = np.argmax(envelope > 0.1 * max_env)
    t90 = np.argmax(envelope > 0.9 * max_env)
    rise_time = int(t90 - t10)
    # Overshoot
    steady_state = np.mean(envelope[n_samples // 2:])
    overshoot = float((max_env - steady_state) / (steady_state + 1e-12))
    # Settling variance
    settling_var = float(np.var(envelope[n_samples // 2:]))

    return {
        "rise_time_samples": rise_time,
        "overshoot_ratio": round(overshoot, 4),
        "settling_variance": round(settling_var, 8),
    }

def compute_fingerprint_hash(features_list):
    """Generate a stable hash from averaged feature vectors."""
    avg_features = {}
    for key in features_list[0]:
        vals = [f[key] for f in features_list]
        avg_features[key] = round(np.mean(vals), 6)
    feature_str = json.dumps(avg_features, sort_keys=True)
    fp_hash = hashlib.sha256(feature_str.encode()).hexdigest()[:16]
    return fp_hash, avg_features

def capture_fingerprint(sdr, num_captures):
    """Capture multiple samples and build a fingerprint."""
    all_spectral = []
    all_transient = []
    print(f"[fingerprinter] Capturing {num_captures} samples at {TARGET_FREQ/1e6:.2f} MHz")

    for i in range(num_captures):
        iq = sdr.read_samples(FFT_SIZE * 4)
        spectral = extract_spectral_features(iq, FFT_SIZE)
        transient = extract_transient_features(iq, TRANSIENT_SAMPLES)
        all_spectral.append(spectral)
        all_transient.append(transient)
        if i % 5 == 0:
            print(f"  Capture {i+1}/{num_captures} - centroid={spectral['centroid']:.2f}")
        time.sleep(0.1)

    fp_hash, avg_spectral = compute_fingerprint_hash(all_spectral)
    _, avg_transient = compute_fingerprint_hash(all_transient)
    return fp_hash, avg_spectral, avg_transient

def main():
    print("=== HackRF RF Fingerprinter ===")
    sdr = configure_sdr()
    try:
        fp_hash, spectral, transient = capture_fingerprint(sdr, NUM_CAPTURES)
        print(f"\n[fingerprinter] Device Fingerprint: {fp_hash}")
        print(f"  Spectral: {spectral}")
        print(f"  Transient: {transient}")
        result = {"hash": fp_hash, "spectral": spectral, "transient": transient,
                  "freq_mhz": TARGET_FREQ / 1e6, "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S")}
        with open("rf_fingerprint.json", "w") as f:
            json.dump(result, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
