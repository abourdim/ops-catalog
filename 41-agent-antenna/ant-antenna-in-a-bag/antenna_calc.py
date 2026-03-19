#!/usr/bin/env python3
"""Antenna-in-a-Bag Calculator — portable antenna designs for field deployment."""

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


def throw_line_dipole(freq_mhz, max_height_m=15):
    """Design a dipole deployable via throw line over a tree branch."""
    lam = wavelength(freq_mhz)
    leg = lam * 0.95 / 4
    return {
        "type": "throw_line_dipole", "frequency_mhz": freq_mhz,
        "each_leg_m": round(leg, 2),
        "total_wire_m": round(leg * 2 + 2, 2),  # +2m for feedpoint
        "suggested_height_m": min(max_height_m, round(lam / 2, 1)),
        "packed_weight_g": 150,
        "packed_size_cm": "10x10x5",
        "deploy_time_min": 10,
        "kit_list": ["wire", "center insulator", "throw line", "throw weight",
                     "2x end insulators", "coax jumper", "paracord"],
    }


def roll_up_j_pole(freq_mhz):
    """Design a roll-up J-pole from ladder line."""
    lam = wavelength(freq_mhz)
    three_quarter = lam * 0.75
    quarter = lam * 0.25
    return {
        "type": "roll_up_j_pole", "frequency_mhz": freq_mhz,
        "radiator_cm": round(three_quarter * 100, 1),
        "matching_stub_cm": round(quarter * 100, 1),
        "total_length_cm": round((three_quarter + quarter) * 100, 1),
        "material": "450-ohm ladder line",
        "gain_dbi": 2.5,
        "packed_weight_g": 100,
        "packed_size_cm": "5x5x15",
    }


def tactical_ground_plane(freq_mhz):
    """Design a ground plane antenna with folding radials."""
    lam = wavelength(freq_mhz)
    radiator = lam * 0.95 / 4
    radial = lam / 4
    return {
        "type": "tactical_ground_plane", "frequency_mhz": freq_mhz,
        "radiator_cm": round(radiator * 100, 1),
        "radial_cm": round(radial * 100, 1),
        "num_radials": 4,
        "radial_angle_deg": 45,
        "impedance_ohm": 50,
        "gain_dbi": 2.15,
        "packed_weight_g": 200,
        "mounting": "magnetic base or clamp",
    }


def plot_bag_contents(antennas, output="bag_contents.png"):
    """Visualize what fits in the antenna bag."""
    fig, ax = plt.subplots(figsize=(10, 6))
    names = [a["type"].replace("_", " ").title() for a in antennas]
    weights = [a.get("packed_weight_g", 100) for a in antennas]
    freqs = [a["frequency_mhz"] for a in antennas]

    colors = plt.cm.Set2(np.linspace(0, 1, len(antennas)))
    bars = ax.barh(names, weights, color=colors)
    for bar, freq in zip(bars, freqs):
        ax.text(bar.get_width() + 5, bar.get_y() + bar.get_height() / 2,
                f"{freq} MHz", va="center", fontsize=10)

    ax.set_xlabel("Weight (grams)")
    ax.set_title("Antenna Bag Contents")
    ax.grid(True, alpha=0.3, axis="x")
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Bag contents chart saved to {output}")


def deployment_checklist(antenna):
    """Generate a step-by-step deployment checklist."""
    steps = {
        "throw_line_dipole": [
            "Select tree with clear branch 10-15m up",
            "Attach throw weight to paracord",
            "Throw line over branch", "Pull antenna wire up",
            "Connect coax to center insulator",
            "Adjust legs for minimum SWR",
        ],
        "roll_up_j_pole": [
            "Unroll ladder line", "Attach to telescoping pole or tree",
            "Connect coax at feed tap point",
            "Extend to full height", "Check SWR",
        ],
        "tactical_ground_plane": [
            "Mount base on vehicle or tripod",
            "Extend radiator element", "Deploy 4 radials at 45 degrees",
            "Connect coax", "Check SWR",
        ],
    }
    return steps.get(antenna["type"], ["Deploy and check SWR"])


def total_bag_weight(antennas):
    """Calculate total bag weight with accessories."""
    antenna_weight = sum(a.get("packed_weight_g", 100) for a in antennas)
    accessories = 500  # coax, connectors, tools
    return {
        "antenna_weight_g": antenna_weight,
        "accessories_g": accessories,
        "total_weight_g": antenna_weight + accessories,
        "total_weight_kg": round((antenna_weight + accessories) / 1000, 2),
    }


def export_kit(data, path="bag_kit.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    print("Antenna-in-a-Bag Calculator — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 146.0
    antennas = [throw_line_dipole(freq), roll_up_j_pole(freq), tactical_ground_plane(freq)]
    for a in antennas:
        print(f"  {a['type']}: {a.get('packed_weight_g', '?')}g")
    weight = total_bag_weight(antennas)
    print(f"Total bag: {weight['total_weight_kg']} kg")
    plot_bag_contents(antennas)
    export_kit({"antennas": antennas, "weight": weight})
