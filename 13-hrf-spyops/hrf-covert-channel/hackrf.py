#!/usr/bin/env python3
"""
HackRF Covert Channel Detector
Detects hidden data exfiltration channels embedded in RF signals.
Analyzes signal patterns for steganographic encoding, spread spectrum
techniques, and anomalous modulation patterns that may indicate
covert communication channels.
"""

import numpy as np
import scipy.signal as signal
from scipy.stats import entropy, kurtosis
from rtlsdr import RtlSdr
import time
import json

# --- Configuration ---
TARGET_FREQ = 462.5625e6  # FRS/GMRS channel to monitor
SAMPLE_RATE = 2.4e6
FFT_SIZE = 4096
GAIN = 42
ANALYSIS_DURATION = 15    # Seconds to analyze
ENTROPY_THRESHOLD = 0.85  # Normalized entropy threshold for covert data

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = TARGET_FREQ
    sdr.gain = GAIN
    return sdr

def compute_spectral_entropy(iq_samples, fft_size):
    """Compute normalized spectral entropy - high entropy may indicate spread data."""
    window = signal.blackmanharris(fft_size)
    spec = np.fft.fftshift(np.fft.fft(iq_samples[:fft_size] * window))
    psd = np.abs(spec) ** 2
    psd_norm = psd / (np.sum(psd) + 1e-12)
    spec_entropy = float(entropy(psd_norm))
    max_entropy = np.log(fft_size)
    return spec_entropy / max_entropy

def detect_spread_spectrum(iq_samples, sample_rate, fft_size):
    """Check for spread spectrum characteristics (flat wideband power)."""
    window = signal.hann(fft_size)
    spec = np.fft.fftshift(np.fft.fft(iq_samples[:fft_size] * window))
    psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
    # Spread spectrum: low peak-to-average ratio
    peak_to_avg = np.max(psd_db) - np.mean(psd_db)
    flatness_ratio = np.exp(np.mean(np.log(np.abs(spec) ** 2 + 1e-12))) / np.mean(np.abs(spec) ** 2)
    return {
        "peak_to_avg_db": round(float(peak_to_avg), 2),
        "spectral_flatness": round(float(flatness_ratio), 6),
        "is_spread": peak_to_avg < 6,  # Low PAR suggests spread spectrum
    }

def analyze_bit_patterns(iq_samples, sample_rate):
    """Analyze demodulated bit patterns for hidden data signatures."""
    # FM demodulate to get baseband
    product = iq_samples[1:] * np.conj(iq_samples[:-1])
    inst_freq = np.angle(product)
    # Quantize to bits
    bits = (inst_freq > 0).astype(int)
    # Check bit distribution (should be ~50/50 for random/encrypted data)
    ones_ratio = np.mean(bits)
    # Run-length analysis
    runs = np.diff(np.where(np.diff(bits) != 0)[0])
    if len(runs) > 10:
        run_entropy = float(entropy(np.bincount(runs[:100]) + 1))
        run_kurtosis = float(kurtosis(runs))
    else:
        run_entropy = 0
        run_kurtosis = 0

    return {
        "ones_ratio": round(float(ones_ratio), 4),
        "run_length_entropy": round(run_entropy, 4),
        "run_length_kurtosis": round(run_kurtosis, 4),
        "balanced_bits": abs(ones_ratio - 0.5) < 0.05,
    }

def detect_subcarriers(iq_samples, sample_rate, fft_size):
    """Look for hidden subcarriers that might carry covert data."""
    spec = np.fft.fftshift(np.fft.fft(iq_samples[:fft_size * 4], fft_size * 4))
    psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
    noise_floor = np.median(psd_db)
    # Find narrow peaks that could be data subcarriers
    peaks, props = signal.find_peaks(psd_db, height=noise_floor + 10, width=(1, 20))
    subcarriers = []
    for p in peaks:
        freq_offset = (p - len(psd_db) / 2) / len(psd_db) * sample_rate
        subcarriers.append({
            "offset_hz": round(float(freq_offset), 1),
            "power_db": round(float(psd_db[p]), 1),
            "snr_db": round(float(psd_db[p] - noise_floor), 1),
        })
    return subcarriers

def main():
    print("=== HackRF Covert Channel Detector ===")
    print(f"Monitoring {TARGET_FREQ/1e6:.4f} MHz for {ANALYSIS_DURATION}s")
    sdr = configure_sdr()
    try:
        total_samples = int(ANALYSIS_DURATION * SAMPLE_RATE)
        iq = sdr.read_samples(total_samples)
        # Analysis pipeline
        spec_ent = compute_spectral_entropy(iq, FFT_SIZE)
        spread = detect_spread_spectrum(iq, SAMPLE_RATE, FFT_SIZE)
        bits = analyze_bit_patterns(iq[:FFT_SIZE * 10], SAMPLE_RATE)
        subcarriers = detect_subcarriers(iq, SAMPLE_RATE, FFT_SIZE)

        print(f"\n[covert] Spectral entropy: {spec_ent:.4f} (threshold: {ENTROPY_THRESHOLD})")
        print(f"[covert] Spread spectrum: {spread}")
        print(f"[covert] Bit analysis: {bits}")
        print(f"[covert] Subcarriers found: {len(subcarriers)}")
        # Threat assessment
        threat_score = 0
        if spec_ent > ENTROPY_THRESHOLD:
            threat_score += 1
        if spread["is_spread"]:
            threat_score += 1
        if bits["balanced_bits"]:
            threat_score += 1
        if len(subcarriers) > 3:
            threat_score += 1
        print(f"\n[covert] THREAT SCORE: {threat_score}/4")
        if threat_score >= 3:
            print("[covert] HIGH PROBABILITY of covert channel!")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
