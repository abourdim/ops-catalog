#!/usr/bin/env python3
"""
Ham Antenna Sim vs Real
Measures real antenna radiation patterns using SDR signal strength
measurements at different frequencies. Compares measured performance
against theoretical antenna models.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

TEST_FREQS = [50e6, 144e6, 222e6, 432e6, 902e6]
SAMPLE_RATE = 250e3
FFT_SIZE = 4096
GAIN = 40
MEASUREMENTS_PER_FREQ = 20

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def measure_antenna_response(sdr, freq, num_measurements):
    """Measure received signal power at a frequency."""
    sdr.center_freq = freq
    time.sleep(0.05)
    readings = []
    for _ in range(num_measurements):
        iq = sdr.read_samples(FFT_SIZE)
        power = np.mean(np.abs(iq) ** 2)
        readings.append(10 * np.log10(power + 1e-12))
        time.sleep(0.05)
    return {
        "mean_db": round(float(np.mean(readings)), 2),
        "std_db": round(float(np.std(readings)), 3),
        "max_db": round(float(np.max(readings)), 2),
    }

def theoretical_dipole_gain(freq_hz, dipole_length_m=1.0):
    """Calculate theoretical half-wave dipole gain at frequency."""
    wavelength = 3e8 / freq_hz
    ratio = dipole_length_m / wavelength
    if 0.4 < ratio < 0.6:
        return 2.15  # Half-wave dipole gain in dBi
    elif ratio < 0.4:
        return 2.15 - 10 * np.log10(0.5 / ratio)
    return 2.15 - 3 * abs(ratio - 0.5) * 10

def compare_sim_vs_real(measured, theoretical):
    """Compare measured and theoretical antenna performance."""
    comparison = []
    for m, t in zip(measured, theoretical):
        diff = m["measured_db"] - t["theoretical_db"]
        comparison.append({
            "freq_mhz": m["freq_mhz"],
            "measured_db": m["measured_db"],
            "theoretical_db": t["theoretical_db"],
            "difference_db": round(float(diff), 2),
            "match_quality": "good" if abs(diff) < 3 else "fair" if abs(diff) < 6 else "poor",
        })
    return comparison

def main():
    print("=== Ham Antenna Sim vs Real ===")
    sdr = configure_sdr()
    measured = []
    theoretical = []
    try:
        for freq in TEST_FREQS:
            print(f"\n[antenna] Testing {freq/1e6:.0f} MHz...")
            result = measure_antenna_response(sdr, freq, MEASUREMENTS_PER_FREQ)
            theo_gain = theoretical_dipole_gain(freq)
            measured.append({"freq_mhz": freq / 1e6, "measured_db": result["mean_db"]})
            theoretical.append({"freq_mhz": freq / 1e6, "theoretical_db": round(theo_gain, 2)})
            print(f"  Measured: {result['mean_db']:.1f} dB | Theory: {theo_gain:.1f} dBi | "
                  f"Std: {result['std_db']:.3f}")
        comparison = compare_sim_vs_real(measured, theoretical)
        for c in comparison:
            print(f"  {c['freq_mhz']:6.0f} MHz: diff={c['difference_db']:+.1f} dB ({c['match_quality']})")
        with open("antenna_comparison.json", "w") as f:
            json.dump(comparison, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
