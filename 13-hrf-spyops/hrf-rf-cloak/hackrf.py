#!/usr/bin/env python3
"""
HackRF RF Cloak
RF environment baseline tool for counter-surveillance. Creates a reference
RF spectrum profile of a "clean" environment, then continuously monitors
for new transmitters that deviate from the baseline, indicating potential
surveillance devices.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json
import os

# --- Configuration ---
SWEEP_START = 70e6
SWEEP_END = 1000e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 1024
GAIN = 40
BASELINE_AVERAGES = 10     # Number of sweeps for baseline
ALERT_THRESHOLD = 12       # dB above baseline to trigger alert

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def sweep_band(sdr, start, end, fft_size):
    """Perform single wideband sweep returning (freqs, power_db) arrays."""
    all_freqs = []
    all_power = []
    freq = start + SAMPLE_RATE / 2
    window = signal.hann(fft_size)
    while freq < end:
        sdr.center_freq = freq
        time.sleep(0.008)
        iq = sdr.read_samples(fft_size * 2)
        spec = np.fft.fftshift(np.fft.fft(iq[:fft_size] * window))
        psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
        f_axis = np.linspace(freq - SAMPLE_RATE / 2, freq + SAMPLE_RATE / 2, fft_size)
        all_freqs.extend(f_axis.tolist())
        all_power.extend(psd_db.tolist())
        freq += SAMPLE_RATE * 0.8
    return np.array(all_freqs), np.array(all_power)

def build_baseline(sdr, num_averages):
    """Build averaged baseline spectrum from multiple sweeps."""
    print(f"[cloak] Building baseline from {num_averages} sweeps...")
    accumulated = None
    for i in range(num_averages):
        freqs, power = sweep_band(sdr, SWEEP_START, SWEEP_END, FFT_SIZE)
        if accumulated is None:
            accumulated = power.copy()
        else:
            accumulated += power
        print(f"  Baseline sweep {i+1}/{num_averages}")
    baseline = accumulated / num_averages
    return freqs, baseline

def compare_to_baseline(freqs, current_power, baseline_power, threshold):
    """Compare current spectrum to baseline, flag deviations."""
    deviation = current_power - baseline_power
    anomaly_mask = deviation > threshold
    anomaly_indices = np.where(anomaly_mask)[0]
    alerts = []
    # Group adjacent anomaly bins into single alerts
    if len(anomaly_indices) > 0:
        groups = np.split(anomaly_indices, np.where(np.diff(anomaly_indices) > 5)[0] + 1)
        for group in groups:
            if len(group) == 0:
                continue
            peak_idx = group[np.argmax(deviation[group])]
            alerts.append({
                "freq_mhz": round(float(freqs[peak_idx] / 1e6), 3),
                "deviation_db": round(float(deviation[peak_idx]), 1),
                "bandwidth_bins": len(group),
            })
    return alerts

def monitor_loop(sdr, freqs, baseline, num_iterations=20):
    """Continuously monitor for new RF sources."""
    print(f"[cloak] Monitoring for new transmitters (threshold={ALERT_THRESHOLD} dB)...")
    all_alerts = []
    for i in range(num_iterations):
        _, current = sweep_band(sdr, SWEEP_START, SWEEP_END, FFT_SIZE)
        # Align lengths
        min_len = min(len(current), len(baseline))
        alerts = compare_to_baseline(freqs[:min_len], current[:min_len],
                                      baseline[:min_len], ALERT_THRESHOLD)
        if alerts:
            print(f"  Scan {i+1}: {len(alerts)} NEW transmitter(s) detected!")
            for a in alerts:
                print(f"    >> {a['freq_mhz']:.3f} MHz | +{a['deviation_db']:.1f} dB above baseline")
            all_alerts.extend(alerts)
        else:
            print(f"  Scan {i+1}: Environment clean")
        time.sleep(1)
    return all_alerts

def main():
    print("=== HackRF RF Cloak ===")
    sdr = configure_sdr()
    try:
        freqs, baseline = build_baseline(sdr, BASELINE_AVERAGES)
        alerts = monitor_loop(sdr, freqs, baseline)
        print(f"\n[cloak] Total alerts: {len(alerts)}")
        with open("rf_cloak_report.json", "w") as f:
            json.dump({"baseline_sweeps": BASELINE_AVERAGES, "alerts": alerts}, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
