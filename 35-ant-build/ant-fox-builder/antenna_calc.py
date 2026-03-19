#!/usr/bin/env python3
"""Fox Builder Calculator — designs fox hunting (ARDF) antennas with bearing capability."""

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


def tape_measure_yagi(freq_mhz):
    """Design a 3-element tape-measure Yagi for fox hunting."""
    lam = wavelength(freq_mhz)
    return {
        "type": "tape_measure_yagi_3el",
        "frequency_mhz": freq_mhz,
        "reflector_cm": round(lam * 0.495 * 100, 1),
        "driven_cm": round(lam * 0.473 * 100, 1),
        "director_cm": round(lam * 0.440 * 100, 1),
        "reflector_spacing_cm": round(lam * 0.20 * 100, 1),
        "director_spacing_cm": round(lam * 0.15 * 100, 1),
        "boom_length_cm": round(lam * 0.35 * 100, 1),
        "gain_dbi": 7.1,
        "front_to_back_db": 15,
        "beamwidth_deg": 55,
        "materials": ["1-inch tape measure", "PVC pipe boom", "hose clamps"],
    }


def hb9cv_antenna(freq_mhz):
    """Design an HB9CV 2-element antenna (popular for ARDF)."""
    lam = wavelength(freq_mhz)
    return {
        "type": "hb9cv",
        "frequency_mhz": freq_mhz,
        "element1_cm": round(lam * 0.50 * 100, 1),
        "element2_cm": round(lam * 0.48 * 100, 1),
        "spacing_cm": round(lam * 0.125 * 100, 1),
        "phasing_line_cm": round(lam * 0.18 * 100, 1),
        "gain_dbi": 5.5,
        "front_to_back_db": 20,
        "beamwidth_deg": 70,
    }


def bearing_accuracy(front_to_back_db, beamwidth_deg):
    """Estimate bearing accuracy based on antenna characteristics."""
    # Better F/B ratio and narrower beamwidth = better bearing
    accuracy = beamwidth_deg / 2 * (10 / max(front_to_back_db, 1))
    return {
        "estimated_accuracy_deg": round(min(accuracy, 45), 1),
        "quality": "excellent" if accuracy < 5 else
                   "good" if accuracy < 10 else
                   "moderate" if accuracy < 20 else "poor",
    }


def plot_fox_pattern(beamwidth_deg, fb_ratio_db, title="Fox Antenna Pattern",
                     output="fox_pattern.png"):
    """Plot radiation pattern optimized for direction finding visualization."""
    theta = np.linspace(0, 2 * np.pi, 360)
    # Front lobe
    n = math.log(0.5) / math.log(math.cos(math.radians(beamwidth_deg / 2)))
    front = np.abs(np.cos(theta / 2)) ** max(n, 1)
    # Apply front-to-back ratio
    fb_linear = 10 ** (-fb_ratio_db / 20)
    pattern = np.where(np.abs(theta - np.pi) < np.pi / 2,
                       np.maximum(front, fb_linear), front)
    pattern_db = 20 * np.log10(np.maximum(pattern, 1e-10)) + 40

    fig, ax = plt.subplots(subplot_kw={"projection": "polar"}, figsize=(8, 8))
    ax.plot(theta, pattern_db, "b-", linewidth=2)
    ax.fill(theta, pattern_db, alpha=0.2, color="blue")
    # Mark the bearing direction
    ax.annotate("BEARING", xy=(0, 40), fontsize=12, fontweight="bold",
                ha="center", color="red")
    ax.set_title(title, pad=20, fontsize=14)
    ax.set_ylim(0, 40)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Fox pattern saved to {output}")


def signal_strength_vs_bearing(true_bearing_deg, measurement_angles_deg,
                                beamwidth_deg, fb_ratio_db):
    """Simulate received signal strength at different antenna orientations."""
    results = []
    for angle in measurement_angles_deg:
        offset = abs(angle - true_bearing_deg)
        if offset > 180:
            offset = 360 - offset
        # Simple cosine-based attenuation
        if offset < beamwidth_deg:
            atten = 3 * (offset / beamwidth_deg) ** 2
        else:
            atten = min(fb_ratio_db, 3 + (offset / beamwidth_deg) ** 2 * 5)
        results.append({"angle_deg": angle, "relative_power_db": round(-atten, 1)})
    return results


def export_design(data, path="fox_design.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[+] Design exported to {path}")


if __name__ == "__main__":
    print("Fox Builder Calculator — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 146.0
    yagi = tape_measure_yagi(freq)
    hb9cv = hb9cv_antenna(freq)
    print(f"Tape Measure Yagi: boom {yagi['boom_length_cm']}cm, gain {yagi['gain_dbi']}dBi")
    accuracy = bearing_accuracy(yagi["front_to_back_db"], yagi["beamwidth_deg"])
    print(f"Bearing accuracy: {accuracy['estimated_accuracy_deg']}deg ({accuracy['quality']})")
    plot_fox_pattern(yagi["beamwidth_deg"], yagi["front_to_back_db"])
    export_design({"yagi": yagi, "hb9cv": hb9cv, "accuracy": accuracy})
