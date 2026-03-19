#!/usr/bin/env python3
"""Yagi Optimizer Calculator — designs and optimizes Yagi-Uda antenna arrays."""

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


def yagi_design(freq_mhz, num_elements=5, boom_diam_mm=25):
    """Design a Yagi-Uda antenna with NBS-style optimized dimensions."""
    lam = wavelength(freq_mhz)
    # NBS-optimized element lengths and spacings (as fractions of wavelength)
    nbs_data = {
        3: {"lengths": [0.495, 0.473, 0.440],
            "spacings": [0.20, 0.15], "gain": 7.1, "fb": 15},
        5: {"lengths": [0.495, 0.473, 0.449, 0.435, 0.430],
            "spacings": [0.20, 0.15, 0.20, 0.20], "gain": 10.2, "fb": 18},
        7: {"lengths": [0.495, 0.473, 0.449, 0.435, 0.430, 0.425, 0.423],
            "spacings": [0.20, 0.15, 0.20, 0.20, 0.25, 0.25], "gain": 12.5, "fb": 20},
    }
    n = min(num_elements, 7)
    if n < 3:
        n = 3
    elif n not in nbs_data:
        n = min(nbs_data.keys(), key=lambda x: abs(x - n))

    data = nbs_data[n]
    elements = []
    pos = 0
    for i in range(n):
        length = data["lengths"][i] * lam
        if i == 0:
            role = "reflector"
        elif i == 1:
            role = "driven"
        else:
            role = f"director_{i - 1}"
        elements.append({
            "role": role,
            "length_cm": round(length * 100, 2),
            "position_cm": round(pos * 100, 2),
        })
        if i < len(data["spacings"]):
            pos += data["spacings"][i] * lam

    boom_length = pos
    return {
        "frequency_mhz": freq_mhz,
        "num_elements": n,
        "gain_dbi": data["gain"],
        "front_to_back_db": data["fb"],
        "beamwidth_deg": round(105 / (10 ** (data["gain"] / 10)) ** 0.5, 1),
        "boom_length_cm": round(boom_length * 100, 2),
        "boom_diameter_mm": boom_diam_mm,
        "impedance_ohm": 50,
        "elements": elements,
    }


def element_taper(element_length_cm, sections=3, min_diam_mm=3, max_diam_mm=10):
    """Design a tapered element from multiple tube diameters."""
    section_length = element_length_cm / sections / 2  # half-element
    taper = []
    for i in range(sections):
        diam = max_diam_mm - (max_diam_mm - min_diam_mm) * i / (sections - 1)
        taper.append({
            "section": i + 1,
            "diameter_mm": round(diam, 1),
            "length_cm": round(section_length, 2),
        })
    return taper


def plot_yagi(design, output="yagi_design.png"):
    """Visualize Yagi antenna element layout."""
    fig, ax = plt.subplots(figsize=(14, 6))
    colors = {"reflector": "red", "driven": "blue"}
    for el in design["elements"]:
        color = colors.get(el["role"], "green")
        half = el["length_cm"] / 2
        pos = el["position_cm"]
        ax.plot([pos, pos], [-half, half], color=color, linewidth=3)
        ax.annotate(el["role"], (pos, half + 5), ha="center", fontsize=8,
                    rotation=45)
    # Boom
    ax.plot([0, design["boom_length_cm"]], [0, 0], "k-", linewidth=2, alpha=0.3)
    ax.set_xlabel("Boom Position (cm)")
    ax.set_ylabel("Element Length (cm)")
    ax.set_title(f"{design['num_elements']}-Element Yagi at {design['frequency_mhz']} MHz "
                 f"— {design['gain_dbi']} dBi")
    ax.set_aspect("equal")
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Yagi design saved to {output}")


def plot_yagi_pattern(gain_dbi, fb_db, beamwidth_deg, output="yagi_pattern.png"):
    """Plot estimated Yagi radiation pattern."""
    theta = np.linspace(0, 2 * np.pi, 360)
    n = math.log(0.5) / math.log(math.cos(math.radians(beamwidth_deg / 2)))
    front = np.abs(np.cos(theta / 2)) ** max(n, 1)
    fb_linear = 10 ** (-fb_db / 20)
    pattern = np.where((theta > np.pi / 2) & (theta < 3 * np.pi / 2),
                       np.maximum(front, fb_linear), front)
    pattern_db = 20 * np.log10(np.maximum(pattern, 1e-10)) + 40

    fig, ax = plt.subplots(subplot_kw={"projection": "polar"}, figsize=(8, 8))
    ax.plot(theta, pattern_db, "b-", linewidth=2)
    ax.fill(theta, pattern_db, alpha=0.15, color="blue")
    ax.set_title(f"Yagi Pattern — {gain_dbi} dBi, F/B {fb_db} dB", pad=20)
    ax.set_ylim(0, 40)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Pattern saved to {output}")


def export_design(data, path="yagi_design.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    print("Yagi Optimizer — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 146.0
    n_el = int(sys.argv[2]) if len(sys.argv) > 2 else 5
    design = yagi_design(freq, n_el)
    print(f"{n_el}-element Yagi: gain={design['gain_dbi']}dBi, "
          f"boom={design['boom_length_cm']}cm")
    plot_yagi(design)
    plot_yagi_pattern(design["gain_dbi"], design["front_to_back_db"],
                      design["beamwidth_deg"])
    export_design(design)
