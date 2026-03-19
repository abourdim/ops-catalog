#!/usr/bin/env python3
"""Wire Wizard Calculator — designs wire antennas (dipoles, long wires, loops, etc.)."""

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


def dipole(freq_mhz, wire_gauge_awg=14):
    """Calculate half-wave dipole wire antenna."""
    lam = wavelength(freq_mhz)
    k = 0.95  # shortening factor (thicker wire = more shortening)
    total = lam * k / 2
    each_leg = total / 2
    return {
        "type": "half_wave_dipole", "frequency_mhz": freq_mhz,
        "total_length_m": round(total, 3),
        "each_leg_m": round(each_leg, 3),
        "each_leg_ft": round(each_leg * 3.281, 2),
        "formula_ft": f"468 / {freq_mhz} = {round(468 / freq_mhz, 2)} ft total",
        "gain_dbi": 2.15, "impedance_ohm": 73,
        "wire_gauge": wire_gauge_awg,
    }


def inverted_v(freq_mhz, apex_height_m, included_angle_deg=120):
    """Calculate inverted-V dipole dimensions."""
    d = dipole(freq_mhz)
    half_span = d["each_leg_m"] * math.sin(math.radians(included_angle_deg / 2))
    droop = d["each_leg_m"] * math.cos(math.radians(included_angle_deg / 2))
    end_height = apex_height_m - droop
    return {
        **d, "type": "inverted_v",
        "apex_height_m": apex_height_m,
        "included_angle_deg": included_angle_deg,
        "half_span_m": round(half_span, 2),
        "end_height_m": round(max(end_height, 0), 2),
        "impedance_ohm": round(73 * math.sin(math.radians(included_angle_deg / 2)), 0),
    }


def end_fed_half_wave(freq_mhz):
    """Calculate end-fed half-wave (EFHW) antenna."""
    lam = wavelength(freq_mhz)
    length = lam * 0.95 / 2
    return {
        "type": "end_fed_half_wave", "frequency_mhz": freq_mhz,
        "wire_length_m": round(length, 3),
        "wire_length_ft": round(length * 3.281, 2),
        "impedance_ohm": 2500,
        "transformer_ratio": "49:1",
        "gain_dbi": 2.15,
        "harmonics": [round(freq_mhz * i, 2) for i in range(1, 5)],
    }


def random_wire(freq_mhz):
    """Calculate good and bad lengths for a random wire antenna."""
    lam = wavelength(freq_mhz)
    # Avoid multiples of half-wavelength
    bad_lengths = [round(lam * n / 2, 2) for n in range(1, 6)]
    good_lengths = [round(lam * n / 2 + lam / 4, 2) for n in range(0, 5)]
    return {
        "type": "random_wire", "frequency_mhz": freq_mhz,
        "avoid_lengths_m": bad_lengths,
        "recommended_lengths_m": good_lengths,
        "needs_counterpoise": True,
        "tuner_required": True,
    }


def long_wire(freq_mhz, wire_length_m):
    """Calculate long wire antenna properties."""
    lam = wavelength(freq_mhz)
    wavelengths = wire_length_m / lam
    gain = 2.15 + 10 * math.log10(max(wavelengths, 0.5))
    return {
        "type": "long_wire", "frequency_mhz": freq_mhz,
        "length_m": wire_length_m,
        "length_wavelengths": round(wavelengths, 2),
        "gain_dbi": round(gain, 2),
        "main_lobe_angle_deg": round(math.degrees(math.acos(1 - 0.371 / max(wavelengths, 0.5))), 1)
        if wavelengths > 0.5 else 90,
    }


def plot_wire_layout(antenna, output="wire_layout.png"):
    """Visualize wire antenna installation layout."""
    fig, ax = plt.subplots(figsize=(12, 6))
    atype = antenna.get("type", "dipole")
    if "inverted_v" in atype:
        apex_h = antenna["apex_height_m"]
        end_h = antenna["end_height_m"]
        span = antenna["half_span_m"]
        ax.plot([-span, 0, span], [end_h, apex_h, end_h], "b-", linewidth=3)
        ax.plot([0], [apex_h], "r^", markersize=15, label="Support/Mast")
        ax.annotate("Feedpoint", xy=(0, apex_h), fontsize=10)
    else:
        leg = antenna.get("each_leg_m", antenna.get("wire_length_m", 10) / 2)
        height = antenna.get("apex_height_m", 10)
        ax.plot([-leg, leg], [height, height], "b-", linewidth=3)
        ax.plot([0], [height], "rv", markersize=12, label="Feedpoint")

    ax.axhline(y=0, color="brown", linewidth=3, label="Ground")
    ax.set_xlabel("Horizontal Distance (m)")
    ax.set_ylabel("Height (m)")
    ax.set_title(f"Wire Antenna Layout — {atype}")
    ax.legend()
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Layout saved to {output}")


def export_design(data, path="wire_design.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    print("Wire Wizard Calculator — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 7.1
    d = dipole(freq)
    iv = inverted_v(freq, 10)
    efhw = end_fed_half_wave(freq)
    print(f"Dipole: {d['each_leg_ft']} ft per leg")
    print(f"Inv-V: apex={iv['apex_height_m']}m, end={iv['end_height_m']}m")
    print(f"EFHW: {efhw['wire_length_ft']} ft, harmonics: {efhw['harmonics']}")
    plot_wire_layout(iv)
    export_design({"dipole": d, "inverted_v": iv, "efhw": efhw})
