#!/usr/bin/env python3
"""Direction Finder Pro Calculator — designs DF antenna arrays with bearing computation."""

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


def adcock_array(freq_mhz, spacing_factor=0.5):
    """Design an Adcock direction-finding antenna array."""
    lam = wavelength(freq_mhz)
    spacing = lam * spacing_factor
    element_length = lam / 4
    return {
        "type": "adcock_array", "frequency_mhz": freq_mhz,
        "element_spacing_m": round(spacing, 3),
        "element_length_m": round(element_length, 3),
        "num_elements": 4,
        "layout": "square",
        "side_length_m": round(spacing, 3),
        "bearing_accuracy_deg": round(2 + 5 / max(spacing_factor, 0.1), 1),
        "frequency_range_mhz": [round(freq_mhz * 0.8, 1), round(freq_mhz * 1.2, 1)],
    }


def watson_watt_processor(signal_ns, signal_ew):
    """Watson-Watt bearing calculation from N/S and E/W antenna signals."""
    # signal_ns and signal_ew are complex amplitudes from orthogonal pairs
    bearing_rad = math.atan2(signal_ew, signal_ns)
    bearing_deg = math.degrees(bearing_rad) % 360
    magnitude = math.sqrt(signal_ns ** 2 + signal_ew ** 2)
    return {
        "bearing_deg": round(bearing_deg, 1),
        "magnitude": round(magnitude, 4),
        "confidence": "high" if magnitude > 0.1 else "low",
    }


def doppler_df_array(freq_mhz, num_elements=8, radius_factor=0.4):
    """Design a pseudo-Doppler DF circular array."""
    lam = wavelength(freq_mhz)
    radius = lam * radius_factor
    elements = []
    for i in range(num_elements):
        angle = 2 * math.pi * i / num_elements
        elements.append({
            "index": i,
            "x_m": round(radius * math.cos(angle), 4),
            "y_m": round(radius * math.sin(angle), 4),
            "angle_deg": round(math.degrees(angle), 1),
        })
    return {
        "type": "doppler_df", "frequency_mhz": freq_mhz,
        "num_elements": num_elements,
        "array_radius_m": round(radius, 3),
        "array_diameter_m": round(radius * 2, 3),
        "switching_rate_hz": round(freq_mhz * 1000 / num_elements),
        "bearing_accuracy_deg": round(360 / num_elements / 2, 1),
        "elements": elements,
    }


def triangulate(bearings):
    """Triangulate a position from multiple bearing measurements."""
    if len(bearings) < 2:
        return {"error": "Need at least 2 bearings"}
    # Simple two-bearing triangulation
    b1 = bearings[0]
    b2 = bearings[1]
    a1 = math.radians(b1["bearing_deg"])
    a2 = math.radians(b2["bearing_deg"])
    x1, y1 = b1["observer_x"], b1["observer_y"]
    x2, y2 = b2["observer_x"], b2["observer_y"]

    denom = math.sin(a1 - a2)
    if abs(denom) < 1e-10:
        return {"error": "Bearings are parallel"}
    t = ((x2 - x1) * math.sin(a2) - (y2 - y1) * math.cos(a2)) / denom
    target_x = x1 + t * math.cos(a1)
    target_y = y1 + t * math.sin(a1)
    return {
        "target_x": round(target_x, 2),
        "target_y": round(target_y, 2),
        "num_bearings": len(bearings),
    }


def plot_df_array(design, output="df_array.png"):
    """Plot the DF antenna array layout."""
    fig, ax = plt.subplots(figsize=(8, 8))
    if "elements" in design:
        for el in design["elements"]:
            ax.plot(el["x_m"], el["y_m"], "bo", markersize=10)
            ax.annotate(f"#{el['index']}", (el["x_m"], el["y_m"]),
                       textcoords="offset points", xytext=(5, 5))
    circle = plt.Circle((0, 0), design.get("array_radius_m", 1),
                        fill=False, linestyle="--", color="gray")
    ax.add_patch(circle)
    ax.plot(0, 0, "r+", markersize=15, markeredgewidth=2)
    ax.set_aspect("equal")
    ax.set_title(f"DF Array — {design.get('type', 'unknown')}")
    ax.set_xlabel("X (m)")
    ax.set_ylabel("Y (m)")
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] DF array plot saved to {output}")


def plot_bearing_display(bearing_deg, output="bearing_display.png"):
    """Plot a compass-style bearing indicator."""
    fig, ax = plt.subplots(subplot_kw={"projection": "polar"}, figsize=(6, 6))
    bearing_rad = math.radians(90 - bearing_deg)  # convert to math convention
    ax.annotate("", xy=(bearing_rad, 0.9), xytext=(0, 0),
                arrowprops=dict(arrowstyle="->", color="red", lw=3))
    ax.set_theta_zero_location("N")
    ax.set_theta_direction(-1)
    ax.set_ylim(0, 1)
    ax.set_title(f"Bearing: {bearing_deg:.1f} deg", pad=20, fontsize=14)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()


def export_data(data, path="df_data.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    print("Direction Finder Pro — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 146.0
    adcock = adcock_array(freq)
    doppler = doppler_df_array(freq)
    print(f"Adcock: {adcock['side_length_m']}m sides, {adcock['bearing_accuracy_deg']}deg accuracy")
    print(f"Doppler: {doppler['array_diameter_m']}m diameter, {doppler['num_elements']} elements")
    plot_df_array(doppler)
    export_data({"adcock": adcock, "doppler": doppler})
