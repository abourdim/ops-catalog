#!/usr/bin/env python3
"""Antenna Shootout Calculator — side-by-side comparison of antenna designs."""

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


ANTENNA_DB = {
    "dipole": {"gain_dbi": 2.15, "beamwidth": 78, "impedance": 73, "bandwidth_pct": 10},
    "yagi_3el": {"gain_dbi": 7.1, "beamwidth": 55, "impedance": 50, "bandwidth_pct": 5},
    "yagi_5el": {"gain_dbi": 10.2, "beamwidth": 40, "impedance": 50, "bandwidth_pct": 3},
    "quad": {"gain_dbi": 7.5, "beamwidth": 60, "impedance": 100, "bandwidth_pct": 8},
    "j_pole": {"gain_dbi": 2.5, "beamwidth": 78, "impedance": 50, "bandwidth_pct": 12},
    "ground_plane": {"gain_dbi": 2.15, "beamwidth": 80, "impedance": 36, "bandwidth_pct": 15},
    "collinear_2": {"gain_dbi": 5.0, "beamwidth": 20, "impedance": 50, "bandwidth_pct": 5},
    "magnetic_loop": {"gain_dbi": -1.5, "beamwidth": 90, "impedance": 50, "bandwidth_pct": 1},
}


def compare_antennas(names, freq_mhz):
    """Compare multiple antenna types head to head."""
    results = []
    lam = wavelength(freq_mhz)
    for name in names:
        if name not in ANTENNA_DB:
            continue
        ant = ANTENNA_DB[name]
        bw_mhz = freq_mhz * ant["bandwidth_pct"] / 100
        results.append({
            "name": name,
            "gain_dbi": ant["gain_dbi"],
            "beamwidth_deg": ant["beamwidth"],
            "impedance_ohm": ant["impedance"],
            "bandwidth_mhz": round(bw_mhz, 2),
            "bandwidth_pct": ant["bandwidth_pct"],
            "effective_aperture_m2": round(
                ant["gain_dbi"] * lam ** 2 / (4 * math.pi) if ant["gain_dbi"] > 0
                else 0.01, 4),
        })
    return sorted(results, key=lambda x: x["gain_dbi"], reverse=True)


def plot_comparison(antennas, output="antenna_shootout.png"):
    """Plot bar chart comparing antenna gains."""
    names = [a["name"] for a in antennas]
    gains = [a["gain_dbi"] for a in antennas]
    beamwidths = [a["beamwidth_deg"] for a in antennas]

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    colors = plt.cm.viridis(np.linspace(0.2, 0.8, len(names)))

    ax1.barh(names, gains, color=colors)
    ax1.set_xlabel("Gain (dBi)")
    ax1.set_title("Gain Comparison")
    ax1.axvline(x=0, color="gray", linestyle="--", alpha=0.5)

    ax2.barh(names, beamwidths, color=colors)
    ax2.set_xlabel("Beamwidth (degrees)")
    ax2.set_title("Beamwidth Comparison")

    plt.suptitle("Antenna Shootout", fontsize=14)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Shootout chart saved to {output}")


def plot_overlay_patterns(antennas, output="pattern_overlay.png"):
    """Overlay radiation patterns for comparison."""
    theta = np.linspace(0, 2 * np.pi, 360)
    fig, ax = plt.subplots(subplot_kw={"projection": "polar"}, figsize=(8, 8))
    colors = ["blue", "red", "green", "orange", "purple"]

    for i, ant in enumerate(antennas[:5]):
        bw_rad = math.radians(ant["beamwidth_deg"])
        n = math.log(0.5) / math.log(math.cos(bw_rad / 2)) if bw_rad < math.pi else 1
        pattern = np.abs(np.cos(theta)) ** max(n, 0.5)
        pattern_db = 20 * np.log10(np.maximum(pattern, 1e-10)) + 40
        ax.plot(theta, pattern_db, linewidth=2, color=colors[i % len(colors)],
                label=ant["name"])

    ax.set_ylim(0, 40)
    ax.set_title("Pattern Overlay", pad=20)
    ax.legend(loc="upper right", bbox_to_anchor=(1.3, 1.0))
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Pattern overlay saved to {output}")


def rank_for_purpose(antennas, purpose="dx"):
    """Rank antennas for a specific use case."""
    weights = {
        "dx": {"gain": 0.5, "beamwidth_inv": 0.3, "bandwidth": 0.2},
        "portable": {"gain": 0.3, "beamwidth_inv": 0.1, "bandwidth": 0.6},
        "vhf_repeater": {"gain": 0.4, "beamwidth_inv": 0.0, "bandwidth": 0.6},
    }
    w = weights.get(purpose, weights["dx"])
    for ant in antennas:
        score = (ant["gain_dbi"] * w["gain"] +
                 (1 / max(ant["beamwidth_deg"], 1)) * 1000 * w["beamwidth_inv"] +
                 ant["bandwidth_pct"] * w["bandwidth"])
        ant["score"] = round(score, 2)
    return sorted(antennas, key=lambda x: x["score"], reverse=True)


def export_comparison(data, path="shootout_results.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[+] Comparison exported to {path}")


if __name__ == "__main__":
    print("Antenna Shootout Calculator — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 146.0
    all_names = list(ANTENNA_DB.keys())
    comparison = compare_antennas(all_names, freq)
    ranked = rank_for_purpose(comparison, "dx")
    plot_comparison(comparison)
    plot_overlay_patterns(comparison)
    export_comparison(ranked)
