#!/usr/bin/env python3
"""Antenna Forge Calculator — general-purpose antenna design and simulation tool."""

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

SPEED_OF_LIGHT = 299792458  # m/s


def wavelength(freq_mhz):
    """Calculate wavelength in meters from frequency in MHz."""
    return SPEED_OF_LIGHT / (freq_mhz * 1e6)


def half_wave_dipole(freq_mhz):
    """Calculate half-wave dipole dimensions."""
    lam = wavelength(freq_mhz)
    element_len = lam * 0.95 / 2  # 5% shortening factor
    return {
        "frequency_mhz": freq_mhz,
        "wavelength_m": round(lam, 4),
        "element_length_m": round(element_len, 4),
        "element_length_cm": round(element_len * 100, 2),
        "gain_dbi": 2.15,
        "impedance_ohm": 73,
        "type": "half_wave_dipole",
    }


def quarter_wave_vertical(freq_mhz):
    """Calculate quarter-wave vertical antenna dimensions."""
    lam = wavelength(freq_mhz)
    radiator = lam * 0.95 / 4
    radial = lam / 4
    return {
        "frequency_mhz": freq_mhz,
        "radiator_length_m": round(radiator, 4),
        "radiator_length_cm": round(radiator * 100, 2),
        "radial_length_m": round(radial, 4),
        "num_radials_recommended": 4,
        "gain_dbi": 2.15,
        "impedance_ohm": 36,
        "type": "quarter_wave_vertical",
    }


def dipole_radiation_pattern(num_points=360):
    """Generate a theoretical dipole radiation pattern (E-plane)."""
    theta = np.linspace(0, 2 * np.pi, num_points)
    # Dipole pattern: sin(theta) in E-plane
    pattern = np.abs(np.sin(theta))
    pattern_db = 20 * np.log10(np.maximum(pattern, 1e-10))
    pattern_db = np.maximum(pattern_db, -40)
    return theta, pattern_db


def plot_radiation_pattern(theta, pattern_db, title="Radiation Pattern",
                           output="radiation_pattern.png"):
    """Plot a polar radiation pattern and save to file."""
    fig, ax = plt.subplots(subplot_kw={"projection": "polar"}, figsize=(8, 8))
    ax.plot(theta, pattern_db + 40, linewidth=2, color="blue")
    ax.fill(theta, pattern_db + 40, alpha=0.2, color="blue")
    ax.set_title(title, pad=20, fontsize=14)
    ax.set_ylim(0, 40)
    ax.set_yticks([0, 10, 20, 30, 40])
    ax.set_yticklabels(["-40", "-30", "-20", "-10", "0 dB"])
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Radiation pattern saved to {output}")


def free_space_path_loss(freq_mhz, distance_km):
    """Calculate free-space path loss in dB."""
    if freq_mhz <= 0 or distance_km <= 0:
        return 0
    return 20 * math.log10(distance_km) + 20 * math.log10(freq_mhz) + 32.45


def link_budget(tx_power_dbm, tx_gain_dbi, rx_gain_dbi, freq_mhz, distance_km):
    """Calculate a simple link budget."""
    fspl = free_space_path_loss(freq_mhz, distance_km)
    rx_power = tx_power_dbm + tx_gain_dbi + rx_gain_dbi - fspl
    return {
        "tx_power_dbm": tx_power_dbm,
        "tx_gain_dbi": tx_gain_dbi,
        "rx_gain_dbi": rx_gain_dbi,
        "fspl_db": round(fspl, 2),
        "rx_power_dbm": round(rx_power, 2),
        "distance_km": distance_km,
    }


def vswr_from_impedance(z_antenna, z_feed=50):
    """Calculate VSWR from antenna and feedline impedance."""
    if z_feed == 0:
        return float("inf")
    gamma = abs(z_antenna - z_feed) / (z_antenna + z_feed)
    if gamma >= 1:
        return float("inf")
    return round((1 + gamma) / (1 - gamma), 2)


def export_design(design, path="antenna_design.json"):
    with open(path, "w") as f:
        json.dump(design, f, indent=2)
    print(f"[+] Design exported to {path}")


if __name__ == "__main__":
    print("Antenna Forge Calculator — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 146.0
    dipole = half_wave_dipole(freq)
    vertical = quarter_wave_vertical(freq)
    print(f"Dipole for {freq} MHz: {dipole['element_length_cm']} cm per element")
    print(f"Vertical for {freq} MHz: {vertical['radiator_length_cm']} cm radiator")
    theta, pattern = dipole_radiation_pattern()
    plot_radiation_pattern(theta, pattern, f"Dipole at {freq} MHz")
    export_design({"dipole": dipole, "vertical": vertical})
