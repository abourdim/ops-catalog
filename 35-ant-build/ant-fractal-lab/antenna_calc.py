#!/usr/bin/env python3
"""Fractal Lab Calculator — designs and analyzes fractal antenna geometries."""

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


def koch_curve_points(order, length=1.0):
    """Generate Koch curve points for a given fractal order."""
    def _koch(p1, p2, depth):
        if depth == 0:
            return [p1]
        dx = p2[0] - p1[0]
        dy = p2[1] - p1[1]
        a = (p1[0] + dx / 3, p1[1] + dy / 3)
        b = (p1[0] + dx * 2 / 3, p1[1] + dy * 2 / 3)
        peak = (p1[0] + dx / 2 - dy * math.sqrt(3) / 6,
                p1[1] + dy / 2 + dx * math.sqrt(3) / 6)
        return (_koch(p1, a, depth - 1) + _koch(a, peak, depth - 1) +
                _koch(peak, b, depth - 1) + _koch(b, p2, depth - 1))

    points = _koch((0, 0), (length, 0), order)
    points.append((length, 0))
    return points


def sierpinski_triangle(order, size=1.0):
    """Generate Sierpinski gasket triangle vertices for antenna design."""
    triangles = [[(0, 0), (size, 0), (size / 2, size * math.sqrt(3) / 2)]]
    for _ in range(order):
        new_triangles = []
        for tri in triangles:
            mids = [((tri[i][0] + tri[(i + 1) % 3][0]) / 2,
                     (tri[i][1] + tri[(i + 1) % 3][1]) / 2) for i in range(3)]
            new_triangles.append([tri[0], mids[0], mids[2]])
            new_triangles.append([mids[0], tri[1], mids[1]])
            new_triangles.append([mids[2], mids[1], tri[2]])
        triangles = new_triangles
    return triangles


def fractal_antenna_properties(fractal_type, order, base_freq_mhz):
    """Calculate properties of a fractal antenna design."""
    lam = wavelength(base_freq_mhz)
    if fractal_type == "koch":
        # Koch dipole: length compression factor
        compression = (4 / 3) ** order
        physical_length = lam / 2 / compression
        resonant_freqs = [base_freq_mhz * (i + 1) / compression
                         for i in range(min(order + 1, 5))]
    elif fractal_type == "sierpinski":
        physical_length = lam / 2
        resonant_freqs = [base_freq_mhz * 2 ** i for i in range(order + 1)]
    else:
        physical_length = lam / 2
        resonant_freqs = [base_freq_mhz]

    return {
        "type": fractal_type,
        "order": order,
        "base_frequency_mhz": base_freq_mhz,
        "physical_length_cm": round(physical_length * 100, 2),
        "standard_dipole_cm": round(lam / 2 * 100, 2),
        "size_reduction_pct": round((1 - physical_length / (lam / 2)) * 100, 1),
        "resonant_frequencies_mhz": [round(f, 2) for f in resonant_freqs],
        "num_resonances": len(resonant_freqs),
        "multiband": len(resonant_freqs) > 1,
    }


def plot_fractal_geometry(fractal_type, order, output="fractal_geometry.png"):
    """Plot the fractal antenna geometry."""
    fig, ax = plt.subplots(figsize=(10, 8))

    if fractal_type == "koch":
        points = koch_curve_points(order)
        xs = [p[0] for p in points]
        ys = [p[1] for p in points]
        ax.plot(xs, ys, "b-", linewidth=2)
        ax.set_title(f"Koch Curve Antenna — Order {order}")
    elif fractal_type == "sierpinski":
        triangles = sierpinski_triangle(order)
        for tri in triangles:
            tri_closed = tri + [tri[0]]
            xs = [p[0] for p in tri_closed]
            ys = [p[1] for p in tri_closed]
            ax.fill(xs, ys, alpha=0.6, color="blue", edgecolor="navy", linewidth=0.5)
        ax.set_title(f"Sierpinski Triangle Antenna — Order {order}")

    ax.set_aspect("equal")
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Fractal geometry saved to {output}")


def export_design(data, path="fractal_design.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[+] Design exported to {path}")


if __name__ == "__main__":
    print("Fractal Lab Calculator — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 146.0
    order = int(sys.argv[2]) if len(sys.argv) > 2 else 3
    for ftype in ["koch", "sierpinski"]:
        props = fractal_antenna_properties(ftype, order, freq)
        print(f"\n{ftype.title()} Order {order}:")
        print(f"  Size reduction: {props['size_reduction_pct']}%")
        print(f"  Resonances: {props['resonant_frequencies_mhz']}")
        plot_fractal_geometry(ftype, order, f"fractal_{ftype}.png")
    export_design(props)
