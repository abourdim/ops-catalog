#!/usr/bin/env python3
"""Antenna Range Calculator — simulates antenna testing range measurements."""

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


def far_field_distance(freq_mhz, aperture_m):
    """Calculate minimum far-field distance (2D^2/lambda)."""
    lam = wavelength(freq_mhz)
    d_ff = 2 * aperture_m ** 2 / lam
    return {
        "frequency_mhz": freq_mhz,
        "aperture_m": aperture_m,
        "far_field_distance_m": round(d_ff, 2),
        "wavelength_m": round(lam, 4),
    }


def path_loss(freq_mhz, distance_m):
    """Free-space path loss for range calculations."""
    if distance_m <= 0 or freq_mhz <= 0:
        return 0
    lam = wavelength(freq_mhz)
    return 20 * math.log10(4 * math.pi * distance_m / lam)


def simulate_range_sweep(freq_mhz, distances_m, tx_power_dbm=10, tx_gain_dbi=0):
    """Simulate received power at various distances."""
    results = []
    for d in distances_m:
        pl = path_loss(freq_mhz, d)
        rx_power = tx_power_dbm + tx_gain_dbi - pl
        results.append({
            "distance_m": d,
            "path_loss_db": round(pl, 2),
            "rx_power_dbm": round(rx_power, 2),
        })
    return results


def compute_gain_from_measurement(ref_power_dbm, dut_power_dbm, ref_gain_dbi=2.15):
    """Calculate antenna gain from comparison measurement."""
    gain = ref_gain_dbi + (dut_power_dbm - ref_power_dbm)
    return {
        "reference_gain_dbi": ref_gain_dbi,
        "reference_power_dbm": ref_power_dbm,
        "dut_power_dbm": dut_power_dbm,
        "dut_gain_dbi": round(gain, 2),
    }


def plot_range_measurement(angles_deg, gains_db, title="Antenna Range Measurement",
                           output="range_measurement.png"):
    """Plot measured antenna pattern from range data."""
    theta = np.radians(angles_deg)
    gains_normalized = np.array(gains_db) - max(gains_db)

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6),
                                    subplot_kw={"projection": "polar"})
    # E-plane
    ax1.plot(theta, gains_normalized + 40, "b-", linewidth=2)
    ax1.fill(theta, gains_normalized + 40, alpha=0.15, color="blue")
    ax1.set_title("E-Plane", pad=20)
    ax1.set_ylim(0, 40)
    ax1.set_yticks([0, 10, 20, 30, 40])
    ax1.set_yticklabels(["-40", "-30", "-20", "-10", "0 dB"])

    # H-plane (simulated as omnidirectional for dipole)
    h_pattern = np.ones_like(theta) * 37  # near-omnidirectional
    ax2.plot(theta, h_pattern, "r-", linewidth=2)
    ax2.fill(theta, h_pattern, alpha=0.15, color="red")
    ax2.set_title("H-Plane", pad=20)
    ax2.set_ylim(0, 40)

    plt.suptitle(title, fontsize=14)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Range measurement plot saved to {output}")


def beamwidth_from_pattern(angles_deg, gains_db):
    """Calculate 3dB beamwidth from pattern data."""
    peak = max(gains_db)
    threshold = peak - 3
    above = [a for a, g in zip(angles_deg, gains_db) if g >= threshold]
    if len(above) >= 2:
        return round(max(above) - min(above), 1)
    return 360  # omnidirectional


def generate_test_pattern(pattern_type="dipole", num_points=360):
    """Generate test antenna pattern data."""
    angles = np.linspace(0, 360, num_points)
    theta_rad = np.radians(angles)
    if pattern_type == "dipole":
        gains = 2.15 * np.abs(np.sin(theta_rad))
    elif pattern_type == "yagi":
        gains = 10 * np.abs(np.cos(theta_rad / 2)) ** 4
    else:
        gains = np.ones(num_points) * 2.15
    return angles.tolist(), gains.tolist()


def export_results(data, path="range_results.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[+] Results exported to {path}")


if __name__ == "__main__":
    print("Antenna Range Calculator — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 435.0
    ff = far_field_distance(freq, 1.0)
    print(f"Far-field distance at {freq} MHz, 1m aperture: {ff['far_field_distance_m']}m")
    angles, gains = generate_test_pattern("dipole")
    plot_range_measurement(angles, gains, f"Simulated Dipole at {freq} MHz")
