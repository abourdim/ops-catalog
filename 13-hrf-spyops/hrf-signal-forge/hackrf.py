#!/usr/bin/env python3
"""
HackRF Signal Forge
RF signal analysis and characterization toolkit. Captures target signals,
performs deep analysis of modulation parameters, symbol rates, encoding,
and generates detailed signal intelligence reports.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- Configuration ---
TARGET_FREQ = 462.5625e6  # FRS Channel 1
SAMPLE_RATE = 2.4e6
FFT_SIZE = 4096
GAIN = 40
CAPTURE_SECONDS = 5

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = TARGET_FREQ
    sdr.gain = GAIN
    return sdr

def estimate_symbol_rate(iq_samples, sample_rate):
    """Estimate digital signal symbol rate using cyclostationary analysis."""
    # Compute squared magnitude of signal (reveals symbol rate harmonics)
    sq_mag = np.abs(iq_samples) ** 2
    # FFT of squared magnitude
    fft_size = min(len(sq_mag), 65536)
    spec = np.abs(np.fft.fft(sq_mag[:fft_size])) ** 2
    freq_axis = np.fft.fftfreq(fft_size, d=1.0 / sample_rate)
    # Only look at positive frequencies, skip DC
    positive = spec[1:fft_size // 2]
    pos_freqs = freq_axis[1:fft_size // 2]
    # Find dominant peak (likely symbol rate or harmonics)
    noise_floor = np.median(positive)
    peaks, _ = signal.find_peaks(positive, height=noise_floor * 10, distance=100)
    if len(peaks) > 0:
        best_peak = peaks[np.argmax(positive[peaks])]
        return float(pos_freqs[best_peak])
    return 0.0

def measure_modulation_index(iq_samples):
    """Measure FM modulation index from IQ samples."""
    inst_freq = np.diff(np.unwrap(np.angle(iq_samples)))
    max_dev = np.max(np.abs(inst_freq))
    rms_dev = np.sqrt(np.mean(inst_freq ** 2))
    return {
        "max_deviation_rad": round(float(max_dev), 4),
        "rms_deviation_rad": round(float(rms_dev), 4),
    }

def analyze_constellation(iq_samples, downsample=100):
    """Extract constellation diagram statistics."""
    downsampled = iq_samples[::downsample]
    i_vals = np.real(downsampled)
    q_vals = np.imag(downsampled)
    # Cluster analysis (rough: check for distinct amplitude/phase levels)
    magnitudes = np.abs(downsampled)
    phases = np.angle(downsampled)
    mag_hist, _ = np.histogram(magnitudes, bins=20)
    phase_hist, _ = np.histogram(phases, bins=36)
    # Count significant clusters
    mag_clusters = np.sum(mag_hist > len(downsampled) * 0.02)
    phase_clusters = np.sum(phase_hist > len(downsampled) * 0.02)
    return {
        "magnitude_levels": int(mag_clusters),
        "phase_levels": int(phase_clusters),
        "mean_amplitude": round(float(np.mean(magnitudes)), 4),
        "amplitude_variance": round(float(np.var(magnitudes)), 6),
    }

def measure_bandwidth(iq_samples, sample_rate, fft_size):
    """Measure occupied bandwidth at various dB levels."""
    window = signal.blackmanharris(fft_size)
    spec = np.fft.fftshift(np.fft.fft(iq_samples[:fft_size] * window))
    psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
    peak = np.max(psd_db)
    results = {}
    for db_level in [3, 6, 10, 20]:
        mask = psd_db > (peak - db_level)
        bw = np.sum(mask) * (sample_rate / fft_size)
        results[f"bw_{db_level}db_hz"] = round(float(bw), 0)
    return results

def generate_sigint_report(iq, sample_rate, fft_size):
    """Generate comprehensive signal intelligence report."""
    report = {
        "frequency_mhz": TARGET_FREQ / 1e6,
        "sample_rate": sample_rate,
        "capture_samples": len(iq),
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
    }
    report["power_db"] = round(10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12), 2)
    report["symbol_rate_est"] = round(estimate_symbol_rate(iq, sample_rate), 1)
    report["modulation_index"] = measure_modulation_index(iq)
    report["constellation"] = analyze_constellation(iq)
    report["bandwidth"] = measure_bandwidth(iq, sample_rate, fft_size)
    return report

def main():
    print("=== HackRF Signal Forge ===")
    sdr = configure_sdr()
    try:
        print(f"[forge] Capturing {CAPTURE_SECONDS}s at {TARGET_FREQ/1e6:.4f} MHz...")
        iq = sdr.read_samples(int(CAPTURE_SECONDS * SAMPLE_RATE))
        print(f"[forge] Analyzing {len(iq)} samples...")
        report = generate_sigint_report(iq, SAMPLE_RATE, FFT_SIZE)
        print(f"\n[forge] Signal Intelligence Report:")
        for key, value in report.items():
            print(f"  {key}: {value}")
        with open("signal_forge_report.json", "w") as f:
            json.dump(report, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
