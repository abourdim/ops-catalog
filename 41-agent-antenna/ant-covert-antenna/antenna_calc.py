#!/usr/bin/env python3
"""Covert Antenna Calculator — designs disguised and low-profile antennas."""

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


def flagpole_vertical(freq_mhz, pole_height_m=6):
    """Design a vertical antenna disguised as a flagpole."""
    lam = wavelength(freq_mhz)
    quarter_wave = lam / 4
    if pole_height_m < quarter_wave:
        loading = "base_loaded"
        coil_uh = round((quarter_wave - pole_height_m) / (0.001 * freq_mhz), 1)
    else:
        loading = "none"
        coil_uh = 0
    return {
        "type": "flagpole_vertical", "frequency_mhz": freq_mhz,
        "pole_height_m": pole_height_m,
        "quarter_wave_m": round(quarter_wave, 2),
        "loading": loading, "loading_coil_uh": coil_uh,
        "radials_buried": 16, "radial_length_m": round(lam / 4, 2),
        "gain_dbi": 1.5 if loading == "base_loaded" else 2.15,
        "disguise": "aluminum flagpole with flag",
        "visibility": "low",
    }


def gutter_antenna(freq_mhz, gutter_length_m=10):
    """Design an antenna using rain gutter as a radiator."""
    lam = wavelength(freq_mhz)
    resonant = lam / 2
    return {
        "type": "gutter_antenna", "frequency_mhz": freq_mhz,
        "gutter_length_m": gutter_length_m,
        "electrical_length_waves": round(gutter_length_m / lam, 2),
        "feed_method": "gamma match at 1/3 point",
        "tuner_required": abs(gutter_length_m - resonant) > resonant * 0.1,
        "gain_dbi": round(2.15 + 3 * math.log10(max(gutter_length_m / lam, 0.5)), 1),
        "visibility": "invisible",
    }


def attic_loop(freq_mhz, perimeter_m=4):
    """Design an indoor attic magnetic loop antenna."""
    lam = wavelength(freq_mhz)
    area = (perimeter_m / 4) ** 2  # approximate square loop
    omega = 2 * math.pi * freq_mhz * 1e6
    radius = perimeter_m / (2 * math.pi)
    inductance = 4 * math.pi * 1e-7 * radius * (math.log(8 * radius / 0.005) - 2)
    capacitance = 1 / (omega ** 2 * inductance)
    return {
        "type": "attic_loop", "frequency_mhz": freq_mhz,
        "perimeter_m": perimeter_m,
        "capacitance_pf": round(capacitance * 1e12, 1),
        "inductance_uh": round(inductance * 1e6, 2),
        "tuning_cap_voltage_v": round(math.sqrt(100 * omega * inductance), 0),
        "gain_dbi": -1.5,
        "visibility": "invisible",
        "location": "attic or closet",
    }


def window_slot(freq_mhz, window_width_m=1.0):
    """Design a window frame slot antenna."""
    lam = wavelength(freq_mhz)
    slot_length = lam / 2
    fits = window_width_m >= slot_length * 0.8
    return {
        "type": "window_slot", "frequency_mhz": freq_mhz,
        "slot_length_cm": round(slot_length * 100, 1),
        "window_width_m": window_width_m,
        "fits_window": fits,
        "material": "copper tape on window frame",
        "gain_dbi": 2.15,
        "visibility": "very_low",
    }


def stealth_score(antenna):
    """Rate antenna concealment on 0-100 scale."""
    visibility_scores = {"invisible": 95, "very_low": 85, "low": 70, "medium": 50}
    base = visibility_scores.get(antenna.get("visibility", "medium"), 50)
    if antenna.get("location") in ("attic", "closet", "attic or closet"):
        base += 5
    return min(base, 100)


def plot_stealth_comparison(antennas, output="stealth_comparison.png"):
    """Compare stealth ratings of different covert antennas."""
    fig, ax = plt.subplots(figsize=(10, 6))
    names = [a["type"].replace("_", " ").title() for a in antennas]
    scores = [stealth_score(a) for a in antennas]
    gains = [a.get("gain_dbi", 0) for a in antennas]

    x = np.arange(len(names))
    width = 0.35
    ax.bar(x - width / 2, scores, width, label="Stealth Score", color="steelblue")
    ax2 = ax.twinx()
    ax2.bar(x + width / 2, gains, width, label="Gain (dBi)", color="coral")

    ax.set_xticks(x)
    ax.set_xticklabels(names, rotation=30, ha="right")
    ax.set_ylabel("Stealth Score")
    ax2.set_ylabel("Gain (dBi)")
    ax.legend(loc="upper left")
    ax2.legend(loc="upper right")
    ax.set_title("Stealth vs Performance")
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Stealth comparison saved to {output}")


def export_designs(data, path="covert_designs.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    print("Covert Antenna Calculator — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 14.1
    antennas = [flagpole_vertical(freq), gutter_antenna(freq),
                attic_loop(freq), window_slot(freq)]
    for a in antennas:
        print(f"  {a['type']}: stealth={stealth_score(a)}, gain={a.get('gain_dbi')}dBi")
    plot_stealth_comparison(antennas)
    export_designs(antennas)
