#!/usr/bin/env python3
"""Magnetic Loop Calculator — designs small transmitting loop antennas."""

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
MU_0 = 4 * math.pi * 1e-7  # permeability of free space


def wavelength(freq_mhz):
    return SPEED_OF_LIGHT / (freq_mhz * 1e6)


def magnetic_loop_design(freq_mhz, circumference_m, conductor_diameter_mm=10):
    """Full design calculations for a small transmitting magnetic loop."""
    lam = wavelength(freq_mhz)
    omega = 2 * math.pi * freq_mhz * 1e6
    radius = circumference_m / (2 * math.pi)
    area = math.pi * radius ** 2
    conductor_radius = conductor_diameter_mm / 2000  # m

    # Inductance of single-turn loop
    inductance = MU_0 * radius * (math.log(8 * radius / conductor_radius) - 2)

    # Capacitance needed for resonance
    capacitance = 1 / (omega ** 2 * inductance)

    # Radiation resistance
    r_rad = 31171 * (area / lam ** 2) ** 2

    # Loss resistance (copper at room temp)
    skin_depth = math.sqrt(2 / (omega * MU_0 * 5.8e7))
    r_loss = circumference_m / (conductor_diameter_mm / 1000) * (1 / (5.8e7 * skin_depth))

    # Efficiency
    efficiency = r_rad / (r_rad + r_loss) * 100

    # Q factor
    q_factor = omega * inductance / (r_rad + r_loss)

    # Bandwidth
    bandwidth_khz = freq_mhz * 1000 / q_factor

    # Capacitor voltage at 100W
    power_w = 100
    cap_voltage = math.sqrt(power_w * q_factor * omega * inductance)

    return {
        "frequency_mhz": freq_mhz,
        "circumference_m": round(circumference_m, 3),
        "radius_m": round(radius, 3),
        "area_m2": round(area, 4),
        "circumference_wavelengths": round(circumference_m / lam, 3),
        "inductance_uh": round(inductance * 1e6, 3),
        "capacitance_pf": round(capacitance * 1e12, 2),
        "radiation_resistance_ohm": round(r_rad, 4),
        "loss_resistance_ohm": round(r_loss, 4),
        "efficiency_pct": round(efficiency, 1),
        "q_factor": round(q_factor, 0),
        "bandwidth_khz": round(bandwidth_khz, 2),
        "cap_voltage_at_100w": round(cap_voltage, 0),
        "conductor_diameter_mm": conductor_diameter_mm,
    }


def tuning_range(loop_design, cap_min_pf, cap_max_pf):
    """Calculate frequency tuning range for a given variable capacitor."""
    inductance = loop_design["inductance_uh"] * 1e-6
    f_low = 1 / (2 * math.pi * math.sqrt(inductance * cap_max_pf * 1e-12)) / 1e6
    f_high = 1 / (2 * math.pi * math.sqrt(inductance * cap_min_pf * 1e-12)) / 1e6
    return {
        "cap_range_pf": [cap_min_pf, cap_max_pf],
        "freq_range_mhz": [round(f_low, 2), round(f_high, 2)],
        "tuning_ratio": round(f_high / f_low, 2),
    }


def plot_efficiency_vs_size(freq_mhz, output="loop_efficiency.png"):
    """Plot efficiency vs loop circumference."""
    circumferences = np.linspace(0.5, 5.0, 50)
    efficiencies = []
    for circ in circumferences:
        design = magnetic_loop_design(freq_mhz, circ)
        efficiencies.append(design["efficiency_pct"])

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(circumferences, efficiencies, "b-", linewidth=2)
    ax.axhline(y=50, color="orange", linestyle="--", label="50% efficiency")
    ax.set_xlabel("Loop Circumference (m)")
    ax.set_ylabel("Efficiency (%)")
    ax.set_title(f"Magnetic Loop Efficiency at {freq_mhz} MHz")
    ax.legend()
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Efficiency plot saved to {output}")


def plot_loop_pattern(output="loop_pattern.png"):
    """Plot the figure-8 radiation pattern of a magnetic loop."""
    theta = np.linspace(0, 2 * np.pi, 360)
    pattern = np.abs(np.sin(theta))
    pattern_db = 20 * np.log10(np.maximum(pattern, 1e-10)) + 40

    fig, ax = plt.subplots(subplot_kw={"projection": "polar"}, figsize=(8, 8))
    ax.plot(theta, pattern_db, "r-", linewidth=2)
    ax.fill(theta, pattern_db, alpha=0.2, color="red")
    ax.set_title("Magnetic Loop Radiation Pattern", pad=20)
    ax.set_ylim(0, 40)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Pattern saved to {output}")


def export_design(data, path="mag_loop_design.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    print("Magnetic Loop Calculator — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 14.1
    circ = float(sys.argv[2]) if len(sys.argv) > 2 else 3.0
    design = magnetic_loop_design(freq, circ)
    print(json.dumps(design, indent=2))
    plot_efficiency_vs_size(freq)
    plot_loop_pattern()
    export_design(design)
