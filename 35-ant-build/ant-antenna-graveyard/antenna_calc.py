#!/usr/bin/env python3
"""Antenna Graveyard Calculator — analyzes failed antenna designs and common pitfalls."""

import sys
import json
import math

try:
    import numpy as np
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
except ImportError:
    sys.exit("numpy and matplotlib required: pip install numpy matplotlib")

SPEED_OF_LIGHT = 299792458


def wavelength(freq_mhz):
    return SPEED_OF_LIGHT / (freq_mhz * 1e6)


def analyze_incorrect_length(freq_mhz, actual_length_m, antenna_type="dipole"):
    """Analyze what happens when element length is wrong."""
    lam = wavelength(freq_mhz)
    if antenna_type == "dipole":
        correct = lam * 0.95 / 2
    else:
        correct = lam * 0.95 / 4
    error_pct = (actual_length_m - correct) / correct * 100
    # Resonant frequency shifts inversely with length
    actual_resonant = freq_mhz * (correct / actual_length_m) if actual_length_m > 0 else 0
    swr_estimate = 1.0 + abs(error_pct) * 0.05  # rough approximation
    return {
        "target_freq_mhz": freq_mhz,
        "correct_length_cm": round(correct * 100, 2),
        "actual_length_cm": round(actual_length_m * 100, 2),
        "error_percent": round(error_pct, 1),
        "actual_resonant_mhz": round(actual_resonant, 2),
        "estimated_swr": round(min(swr_estimate, 10), 2),
        "diagnosis": _diagnose_length_error(error_pct),
    }


def _diagnose_length_error(error_pct):
    if abs(error_pct) < 3:
        return "Acceptable — within normal tolerance"
    if error_pct > 0:
        return f"Too long by {abs(error_pct):.1f}% — resonant frequency is too low, trim element"
    return f"Too short by {abs(error_pct):.1f}% — resonant frequency is too high, extend element"


def analyze_bad_feedpoint(impedance_actual, impedance_expected=50):
    """Analyze impedance mismatch at feedpoint."""
    gamma = abs(impedance_actual - impedance_expected) / (impedance_actual + impedance_expected)
    vswr = (1 + gamma) / (1 - gamma) if gamma < 1 else float("inf")
    reflected_pct = gamma ** 2 * 100
    return {
        "actual_impedance": impedance_actual,
        "expected_impedance": impedance_expected,
        "reflection_coefficient": round(gamma, 4),
        "vswr": round(vswr, 2) if vswr != float("inf") else "inf",
        "power_reflected_pct": round(reflected_pct, 1),
        "power_transmitted_pct": round(100 - reflected_pct, 1),
        "diagnosis": _diagnose_impedance(vswr),
    }


def _diagnose_impedance(vswr):
    if vswr < 1.5:
        return "Good match — acceptable for most applications"
    if vswr < 2.0:
        return "Marginal — consider a matching network"
    if vswr < 3.0:
        return "Poor — significant power reflected, needs matching"
    return "Very poor — risk of transmitter damage, do not transmit"


def plot_swr_vs_frequency(center_freq_mhz, bandwidth_pct=20, output="swr_curve.png"):
    """Plot SWR across a frequency range for a failed vs good antenna."""
    freqs = np.linspace(center_freq_mhz * (1 - bandwidth_pct / 200),
                        center_freq_mhz * (1 + bandwidth_pct / 200), 200)
    # Good antenna: narrow SWR dip at center
    swr_good = 1 + 5 * ((freqs - center_freq_mhz) / (center_freq_mhz * 0.02)) ** 2
    swr_good = np.minimum(swr_good, 10)
    # Failed antenna: SWR dip shifted
    shift = center_freq_mhz * 0.05
    swr_bad = 1 + 5 * ((freqs - center_freq_mhz - shift) / (center_freq_mhz * 0.02)) ** 2
    swr_bad = np.minimum(swr_bad, 10)

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(freqs, swr_good, "g-", linewidth=2, label="Good design")
    ax.plot(freqs, swr_bad, "r--", linewidth=2, label="Failed design")
    ax.axhline(y=2.0, color="orange", linestyle=":", label="SWR 2:1 threshold")
    ax.set_xlabel("Frequency (MHz)")
    ax.set_ylabel("SWR")
    ax.set_title(f"SWR Comparison — {center_freq_mhz} MHz Antenna")
    ax.legend()
    ax.set_ylim(1, 10)
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] SWR curve saved to {output}")


def common_failures():
    """List common antenna failure modes for educational display."""
    return [
        {"failure": "Wrong element length", "effect": "Off-resonance, high SWR",
         "fix": "Recalculate using velocity factor"},
        {"failure": "Bad solder joint", "effect": "Intermittent connection, noise",
         "fix": "Clean and re-solder with proper flux"},
        {"failure": "Missing ground plane", "effect": "Altered impedance and pattern",
         "fix": "Add radials or ground plane"},
        {"failure": "Coax shield not connected", "effect": "No RF path, total failure",
         "fix": "Verify coax braid continuity"},
        {"failure": "Wrong coax impedance", "effect": "Mismatch loss",
         "fix": "Use 50-ohm coax for most antennas"},
        {"failure": "Water ingress", "effect": "SWR drift, corrosion over time",
         "fix": "Seal connections with self-amalgamating tape"},
    ]


def export_analysis(data, path="graveyard_analysis.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[+] Analysis exported to {path}")


if __name__ == "__main__":
    print("Antenna Graveyard Calculator — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 146.0
    analysis = analyze_incorrect_length(freq, 0.80)
    print(json.dumps(analysis, indent=2))
    plot_swr_vs_frequency(freq)
