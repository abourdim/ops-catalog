#!/usr/bin/env python3
"""RF Perimeter Calculator — designs perimeter monitoring antenna arrays."""

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


def perimeter_sensors(freq_mhz, perimeter_m, num_sensors=4):
    """Design sensor placement for RF perimeter monitoring."""
    lam = wavelength(freq_mhz)
    spacing = perimeter_m / num_sensors
    # Each sensor is a wideband discone or ground plane
    sensor_height = lam / 4
    coverage_radius = lam * 5  # approximate detection range

    sensors = []
    for i in range(num_sensors):
        angle = 2 * math.pi * i / num_sensors
        x = (perimeter_m / (2 * math.pi)) * math.cos(angle)
        y = (perimeter_m / (2 * math.pi)) * math.sin(angle)
        sensors.append({
            "id": i, "x_m": round(x, 2), "y_m": round(y, 2),
            "antenna_height_m": round(sensor_height, 2),
            "coverage_radius_m": round(coverage_radius, 1),
        })
    return {
        "frequency_mhz": freq_mhz,
        "perimeter_m": perimeter_m,
        "num_sensors": num_sensors,
        "sensor_spacing_m": round(spacing, 2),
        "sensors": sensors,
        "overlap_pct": round(max(0, (2 * coverage_radius - spacing) / spacing * 100), 1),
    }


def detection_zone(sensor_x, sensor_y, radius, num_points=100):
    """Calculate detection zone boundary for a single sensor."""
    angles = np.linspace(0, 2 * np.pi, num_points)
    xs = sensor_x + radius * np.cos(angles)
    ys = sensor_y + radius * np.sin(angles)
    return xs.tolist(), ys.tolist()


def signal_triangulation(sensors, signal_strengths):
    """Estimate intruder position from signal strength at multiple sensors."""
    if len(sensors) < 3 or len(signal_strengths) < 3:
        return {"error": "Need at least 3 sensors with readings"}
    # Weighted centroid based on signal strength
    total_weight = 0
    wx, wy = 0, 0
    for sensor, strength in zip(sensors, signal_strengths):
        weight = 10 ** (strength / 20)  # convert dB to linear
        wx += sensor["x_m"] * weight
        wy += sensor["y_m"] * weight
        total_weight += weight
    if total_weight > 0:
        return {
            "estimated_x": round(wx / total_weight, 2),
            "estimated_y": round(wy / total_weight, 2),
            "confidence": "high" if len(sensors) >= 4 else "medium",
        }
    return {"error": "No valid readings"}


def discone_antenna(freq_min_mhz, freq_max_mhz):
    """Design a wideband discone antenna for perimeter sensors."""
    lam_low = wavelength(freq_min_mhz)
    lam_high = wavelength(freq_max_mhz)
    return {
        "type": "discone", "freq_min_mhz": freq_min_mhz,
        "freq_max_mhz": freq_max_mhz,
        "disc_diameter_cm": round(lam_high * 0.7 * 100, 1),
        "cone_length_cm": round(lam_low * 0.25 * 100, 1),
        "cone_angle_deg": 60,
        "impedance_ohm": 50,
        "gain_dbi": 0,
        "polarization": "vertical",
        "bandwidth_ratio": round(freq_max_mhz / freq_min_mhz, 1),
    }


def plot_perimeter(layout, output="rf_perimeter.png"):
    """Plot the RF perimeter monitoring layout."""
    fig, ax = plt.subplots(figsize=(10, 10))
    sensors = layout["sensors"]

    for s in sensors:
        ax.plot(s["x_m"], s["y_m"], "ro", markersize=12)
        ax.annotate(f"S{s['id']}", (s["x_m"], s["y_m"]),
                   textcoords="offset points", xytext=(8, 8), fontsize=10)
        circle = plt.Circle((s["x_m"], s["y_m"]), s["coverage_radius_m"],
                            fill=False, linestyle="--", color="red", alpha=0.3)
        ax.add_patch(circle)
        zone = plt.Circle((s["x_m"], s["y_m"]), s["coverage_radius_m"],
                          fill=True, color="red", alpha=0.05)
        ax.add_patch(zone)

    ax.set_aspect("equal")
    ax.set_title(f"RF Perimeter — {layout['num_sensors']} Sensors, "
                 f"{layout['perimeter_m']}m perimeter")
    ax.set_xlabel("X (m)")
    ax.set_ylabel("Y (m)")
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Perimeter plot saved to {output}")


def export_layout(data, path="perimeter_layout.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    print("RF Perimeter Calculator — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 433.0
    perimeter = float(sys.argv[2]) if len(sys.argv) > 2 else 200
    layout = perimeter_sensors(freq, perimeter, 6)
    print(f"Sensors: {layout['num_sensors']}, spacing: {layout['sensor_spacing_m']}m")
    print(f"Coverage overlap: {layout['overlap_pct']}%")
    plot_perimeter(layout)
    export_layout(layout)
