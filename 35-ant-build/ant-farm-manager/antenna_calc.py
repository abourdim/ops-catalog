#!/usr/bin/env python3
"""Antenna Farm Manager — calculates spacing, interaction, and layout for multi-antenna sites."""

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


def min_spacing(freq1_mhz, freq2_mhz):
    """Calculate minimum spacing between antennas to avoid interaction."""
    lam1 = wavelength(freq1_mhz)
    lam2 = wavelength(freq2_mhz)
    lam_max = max(lam1, lam2)
    horizontal = lam_max * 2    # 2 wavelengths horizontal
    vertical = lam_max * 0.5    # half wavelength vertical (stacking)
    return {
        "freq1_mhz": freq1_mhz, "freq2_mhz": freq2_mhz,
        "min_horizontal_m": round(horizontal, 2),
        "min_vertical_m": round(vertical, 2),
        "recommended_horizontal_m": round(lam_max * 3, 2),
    }


def tower_load(antennas):
    """Estimate wind load and weight for a collection of antennas on a tower."""
    total_weight = 0
    total_wind_area = 0
    for ant in antennas:
        total_weight += ant.get("weight_kg", 2)
        total_wind_area += ant.get("wind_area_m2", 0.1)
    # Wind force at 100 km/h: F = 0.5 * rho * v^2 * Cd * A
    wind_speed = 100 / 3.6  # m/s
    rho = 1.225  # kg/m3
    cd = 1.2  # drag coefficient
    wind_force = 0.5 * rho * wind_speed ** 2 * cd * total_wind_area
    return {
        "total_weight_kg": round(total_weight, 2),
        "total_wind_area_m2": round(total_wind_area, 3),
        "wind_force_at_100kph_N": round(wind_force, 1),
        "num_antennas": len(antennas),
    }


def intermod_check(frequencies_mhz):
    """Check for potential intermodulation products between frequencies."""
    products = []
    freqs = sorted(frequencies_mhz)
    for i in range(len(freqs)):
        for j in range(i + 1, len(freqs)):
            f1, f2 = freqs[i], freqs[j]
            # 3rd order intermod products
            im3_1 = 2 * f1 - f2
            im3_2 = 2 * f2 - f1
            for im in [im3_1, im3_2]:
                for k, f_check in enumerate(freqs):
                    if abs(im - f_check) < 0.5:  # within 500 kHz
                        products.append({
                            "f1": f1, "f2": f2,
                            "intermod_mhz": round(im, 3),
                            "conflicts_with": f_check,
                            "order": 3,
                        })
    return products


def plot_farm_layout(antennas, output="farm_layout.png"):
    """Plot a top-down view of antenna farm layout."""
    fig, ax = plt.subplots(figsize=(10, 10))
    colors = plt.cm.Set1(np.linspace(0, 1, len(antennas)))
    for i, ant in enumerate(antennas):
        x = ant.get("x_m", i * 5)
        y = ant.get("y_m", 0)
        ax.scatter(x, y, s=200, c=[colors[i]], zorder=5)
        ax.annotate(f"{ant['name']}\n{ant.get('freq_mhz', '?')} MHz",
                    (x, y), textcoords="offset points", xytext=(10, 10),
                    fontsize=9)
        # Draw exclusion zone
        radius = wavelength(ant.get("freq_mhz", 146)) * 2
        circle = plt.Circle((x, y), radius, fill=False, linestyle="--",
                            color=colors[i], alpha=0.5)
        ax.add_patch(circle)

    ax.set_xlabel("East-West (m)")
    ax.set_ylabel("North-South (m)")
    ax.set_title("Antenna Farm Layout")
    ax.set_aspect("equal")
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Farm layout saved to {output}")


def export_analysis(data, path="farm_analysis.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[+] Analysis exported to {path}")


if __name__ == "__main__":
    print("Antenna Farm Manager — companion to the web dashboard")
    sample = [
        {"name": "VHF-Yagi", "freq_mhz": 146, "x_m": 0, "y_m": 0, "weight_kg": 3},
        {"name": "UHF-Yagi", "freq_mhz": 435, "x_m": 5, "y_m": 0, "weight_kg": 2},
        {"name": "HF-Dipole", "freq_mhz": 14, "x_m": 20, "y_m": 10, "weight_kg": 5},
    ]
    spacing = min_spacing(146, 435)
    print(json.dumps(spacing, indent=2))
    intermod = intermod_check([146, 435, 14])
    print(f"Intermod products: {len(intermod)}")
    plot_farm_layout(sample)
