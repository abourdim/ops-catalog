#!/usr/bin/env python3
"""PCB Studio Calculator — designs PCB trace antennas with microstrip calculations."""

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


def microstrip_impedance(trace_width_mm, substrate_height_mm, er=4.4):
    """Calculate microstrip transmission line impedance (FR4 default)."""
    w = trace_width_mm
    h = substrate_height_mm
    ratio = w / h
    if ratio < 1:
        z0 = (60 / math.sqrt(er)) * math.log(8 * h / w + w / (4 * h))
    else:
        z0 = 120 * math.pi / (math.sqrt(er) * (ratio + 1.393 + 0.667 * math.log(ratio + 1.444)))
    eff_er = (er + 1) / 2 + (er - 1) / 2 * (1 / math.sqrt(1 + 12 * h / w))
    return {
        "trace_width_mm": trace_width_mm,
        "substrate_height_mm": substrate_height_mm,
        "dielectric_constant": er,
        "impedance_ohm": round(z0, 2),
        "effective_er": round(eff_er, 3),
    }


def trace_width_for_impedance(target_ohm, substrate_height_mm, er=4.4):
    """Calculate required trace width for a target impedance."""
    # Binary search for width
    w_low, w_high = 0.01, 50.0
    for _ in range(50):
        w_mid = (w_low + w_high) / 2
        z = microstrip_impedance(w_mid, substrate_height_mm, er)["impedance_ohm"]
        if z > target_ohm:
            w_low = w_mid
        else:
            w_high = w_mid
    return round((w_low + w_high) / 2, 3)


def pcb_patch_antenna(freq_mhz, er=4.4, h_mm=1.6):
    """Design a rectangular microstrip patch antenna."""
    lam0 = wavelength(freq_mhz)
    # Patch width
    w = SPEED_OF_LIGHT / (2 * freq_mhz * 1e6) * math.sqrt(2 / (er + 1))
    # Effective dielectric constant
    eff_er = (er + 1) / 2 + (er - 1) / 2 * (1 / math.sqrt(1 + 12 * (h_mm / 1000) / w))
    # Effective length
    delta_l = 0.412 * (h_mm / 1000) * ((eff_er + 0.3) * (w / (h_mm / 1000) + 0.264)) / \
              ((eff_er - 0.258) * (w / (h_mm / 1000) + 0.8))
    l_eff = SPEED_OF_LIGHT / (2 * freq_mhz * 1e6 * math.sqrt(eff_er))
    l_actual = l_eff - 2 * delta_l
    return {
        "frequency_mhz": freq_mhz,
        "patch_width_mm": round(w * 1000, 2),
        "patch_length_mm": round(l_actual * 1000, 2),
        "substrate_height_mm": h_mm,
        "dielectric_constant": er,
        "effective_er": round(eff_er, 3),
        "gain_dbi": round(6 + 10 * math.log10(w / lam0), 1),
        "feed_inset_mm": round(l_actual * 1000 / 4, 2),
    }


def pcb_inverted_f(freq_mhz, er=4.4, h_mm=1.6):
    """Design a PCB inverted-F antenna (IFA) for compact applications."""
    lam = wavelength(freq_mhz)
    lam_eff = lam / math.sqrt(er)
    total_length = lam_eff / 4
    return {
        "frequency_mhz": freq_mhz,
        "total_length_mm": round(total_length * 1000, 2),
        "ground_clearance_mm": round(h_mm * 3, 1),
        "feed_offset_mm": round(total_length * 1000 * 0.15, 2),
        "shorting_pin_position_mm": 0,
        "substrate_er": er,
    }


def plot_pcb_layout(patch, output="pcb_layout.png"):
    """Visualize the PCB antenna layout."""
    fig, ax = plt.subplots(figsize=(10, 8))
    w = patch["patch_width_mm"]
    l = patch["patch_length_mm"]
    # Ground plane
    gnd = plt.Rectangle((-w * 0.3, -l * 0.3), w * 1.6, l * 1.6,
                        fill=True, color="green", alpha=0.3, label="Ground plane")
    ax.add_patch(gnd)
    # Patch
    p = plt.Rectangle((0, 0), w, l, fill=True, color="orange",
                       alpha=0.8, label="Patch element")
    ax.add_patch(p)
    # Feed point
    ax.plot(w * 0.3, patch["feed_inset_mm"], "ro", markersize=10, label="Feed point")
    # Feedline
    feed_w = trace_width_for_impedance(50, patch["substrate_height_mm"])
    ax.plot([w * 0.3, w * 0.3], [-l * 0.2, patch["feed_inset_mm"]], "r-", linewidth=3)

    ax.set_xlim(-w * 0.4, w * 1.4)
    ax.set_ylim(-l * 0.4, l * 1.4)
    ax.set_xlabel("Width (mm)")
    ax.set_ylabel("Length (mm)")
    ax.set_title(f"PCB Patch Antenna — {patch['frequency_mhz']} MHz")
    ax.legend()
    ax.set_aspect("equal")
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] PCB layout saved to {output}")


def export_design(data, path="pcb_design.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    print("PCB Studio Calculator — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 2450.0
    patch = pcb_patch_antenna(freq)
    print(json.dumps(patch, indent=2))
    plot_pcb_layout(patch)
    export_design(patch)
