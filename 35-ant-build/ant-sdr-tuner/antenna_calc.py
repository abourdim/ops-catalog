#!/usr/bin/env python3
"""SDR Tuner Calculator — antenna matching and SDR interface optimization."""

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


def l_network_match(z_source, z_load):
    """Design an L-network matching circuit."""
    if z_source == z_load:
        return {"matched": True, "note": "Already matched, no network needed"}
    r_s = min(z_source, z_load)
    r_l = max(z_source, z_load)
    q = math.sqrt(r_l / r_s - 1)
    x_s = q * r_s
    x_l = r_l / q
    return {
        "q_factor": round(q, 2),
        "series_reactance_ohm": round(x_s, 2),
        "shunt_reactance_ohm": round(x_l, 2),
        "topology": "series_L_shunt_C" if z_source < z_load else "shunt_L_series_C",
    }


def l_network_components(freq_mhz, z_source, z_load):
    """Calculate actual L/C values for matching network."""
    match = l_network_match(z_source, z_load)
    if "note" in match:
        return match
    omega = 2 * math.pi * freq_mhz * 1e6
    x_s = match["series_reactance_ohm"]
    x_l = match["shunt_reactance_ohm"]
    return {
        **match,
        "frequency_mhz": freq_mhz,
        "series_inductor_nh": round(x_s / omega * 1e9, 1),
        "shunt_capacitor_pf": round(1 / (omega * x_l) * 1e12, 2),
    }


def sdr_sensitivity(noise_figure_db, bandwidth_hz, snr_min_db=10):
    """Calculate SDR receiver minimum detectable signal."""
    thermal_noise = -174 + 10 * math.log10(bandwidth_hz)
    mds = thermal_noise + noise_figure_db + snr_min_db
    return {
        "noise_figure_db": noise_figure_db,
        "bandwidth_hz": bandwidth_hz,
        "thermal_noise_floor_dbm": round(thermal_noise, 1),
        "min_detectable_signal_dbm": round(mds, 1),
    }


def antenna_factor(freq_mhz, gain_dbi):
    """Calculate antenna factor for EMC-style measurements."""
    lam = wavelength(freq_mhz)
    af = 20 * math.log10(9.73 / lam) - gain_dbi
    return {"frequency_mhz": freq_mhz, "antenna_factor_db_per_m": round(af, 2)}


def plot_sdr_coverage(center_freq_mhz, bandwidth_mhz, noise_figure_db,
                      output="sdr_coverage.png"):
    """Plot SDR frequency coverage and sensitivity across the band."""
    freqs = np.linspace(center_freq_mhz - bandwidth_mhz / 2,
                        center_freq_mhz + bandwidth_mhz / 2, 200)
    # Simulate rolloff at band edges
    center = center_freq_mhz
    hw = bandwidth_mhz / 2
    response = -noise_figure_db - 10 * ((freqs - center) / hw) ** 8
    noise_floor = -174 + 10 * np.log10(bandwidth_mhz * 1e6 / 200)

    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(freqs, response, "b-", linewidth=2, label="SDR Response")
    ax.axhline(y=noise_floor, color="red", linestyle="--", label=f"Noise floor: {noise_floor:.0f} dBm")
    ax.set_xlabel("Frequency (MHz)")
    ax.set_ylabel("Sensitivity (dBm)")
    ax.set_title(f"SDR Coverage — {center_freq_mhz} MHz center, {bandwidth_mhz} MHz BW")
    ax.legend()
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Coverage plot saved to {output}")


def balun_design(freq_mhz, impedance_ratio="4:1"):
    """Design a simple balun for SDR antenna interface."""
    lam = wavelength(freq_mhz)
    ratios = {"1:1": 1, "4:1": 4, "9:1": 9}
    ratio = ratios.get(impedance_ratio, 4)
    return {
        "type": f"{impedance_ratio} balun",
        "frequency_mhz": freq_mhz,
        "core_type": "FT-140-43" if freq_mhz < 30 else "FT-82-61",
        "turns": max(round(10 / math.sqrt(ratio)), 3),
        "wire_length_cm": round(lam * 100 * 0.1, 1),
        "impedance_transform": f"{50}:{50 * ratio} ohm",
    }


def export_data(data, path="sdr_tuner_data.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    print("SDR Tuner Calculator — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 146.0
    match = l_network_components(freq, 73, 50)
    sensitivity = sdr_sensitivity(6, 200000)
    print(json.dumps(match, indent=2))
    print(json.dumps(sensitivity, indent=2))
    plot_sdr_coverage(freq, 2.0, 6)
    export_data({"matching": match, "sensitivity": sensitivity})
