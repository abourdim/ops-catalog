#!/usr/bin/env python3
"""Satellite Comms Calculator — designs antennas for covert satellite communication."""

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
EARTH_RADIUS_KM = 6371


def wavelength(freq_mhz):
    return SPEED_OF_LIGHT / (freq_mhz * 1e6)


def iridium_patch(freq_mhz=1621.0):
    """Design a patch antenna for Iridium satellite phone band."""
    lam = wavelength(freq_mhz)
    er = 4.4  # FR4
    h_mm = 1.6
    w = SPEED_OF_LIGHT / (2 * freq_mhz * 1e6) * math.sqrt(2 / (er + 1))
    eff_er = (er + 1) / 2 + (er - 1) / 2 / math.sqrt(1 + 12 * h_mm / (w * 1000))
    l = SPEED_OF_LIGHT / (2 * freq_mhz * 1e6 * math.sqrt(eff_er))
    return {
        "type": "iridium_patch", "frequency_mhz": freq_mhz,
        "patch_width_mm": round(w * 1000, 2),
        "patch_length_mm": round(l * 1000, 2),
        "substrate": "FR4", "substrate_height_mm": h_mm,
        "gain_dbi": 6, "polarization": "RHCP",
        "beamwidth_deg": 70,
        "covert_rating": "high — flat, concealable",
    }


def inmarsat_helix(freq_mhz=1545.0, turns=5):
    """Design a helical antenna for Inmarsat L-band."""
    lam = wavelength(freq_mhz)
    circumference = lam
    diameter = circumference / math.pi
    spacing = lam * 0.25
    gain = 10 * math.log10(15 * turns * (circumference / lam) ** 2 * (spacing / lam))
    return {
        "type": "inmarsat_helix", "frequency_mhz": freq_mhz,
        "turns": turns,
        "diameter_cm": round(diameter * 100, 2),
        "spacing_cm": round(spacing * 100, 2),
        "total_height_cm": round(turns * spacing * 100, 2),
        "ground_plane_diameter_cm": round(lam * 0.8 * 100, 2),
        "gain_dbi": round(gain, 2),
        "polarization": "RHCP",
        "beamwidth_deg": round(52 / turns ** 0.5, 1),
    }


def leo_sat_link_budget(freq_mhz, altitude_km, tx_power_dbm, ant_gain_dbi,
                         elevation_deg=30):
    """Calculate link budget for LEO satellite communication."""
    # Slant range calculation
    r = EARTH_RADIUS_KM
    h = altitude_km
    el_rad = math.radians(elevation_deg)
    slant = -r * math.sin(el_rad) + math.sqrt(
        (r * math.sin(el_rad)) ** 2 + 2 * r * h + h ** 2)
    # Free-space path loss
    lam = wavelength(freq_mhz)
    fspl = 20 * math.log10(4 * math.pi * slant * 1000 / lam)
    # Atmospheric loss approximation
    atmo_loss = 1.0 / math.sin(max(el_rad, 0.1))
    rx_power = tx_power_dbm + ant_gain_dbi - fspl - atmo_loss
    return {
        "frequency_mhz": freq_mhz,
        "altitude_km": altitude_km,
        "elevation_deg": elevation_deg,
        "slant_range_km": round(slant, 1),
        "fspl_db": round(fspl, 2),
        "atmospheric_loss_db": round(atmo_loss, 2),
        "rx_power_dbm": round(rx_power, 2),
        "link_viable": rx_power > -130,
    }


def plot_coverage_hemisphere(ant_gain_dbi, beamwidth_deg, output="sat_coverage.png"):
    """Plot antenna coverage on the sky hemisphere."""
    theta = np.linspace(0, 2 * np.pi, 360)
    elevations = np.linspace(0, 90, 90)
    T, E = np.meshgrid(theta, elevations)
    # Cosine-tapered pattern
    bw_rad = math.radians(beamwidth_deg)
    n = math.log(0.5) / math.log(math.cos(bw_rad / 2)) if bw_rad < math.pi else 1
    pattern = np.abs(np.cos(np.radians(90 - E))) ** max(n, 0.5) * ant_gain_dbi

    fig, ax = plt.subplots(subplot_kw={"projection": "polar"}, figsize=(8, 8))
    c = ax.pcolormesh(T, 90 - E, pattern, cmap="YlOrRd", shading="auto")
    ax.set_theta_zero_location("N")
    ax.set_theta_direction(-1)
    ax.set_ylim(0, 90)
    ax.set_title("Sky Coverage Pattern", pad=20)
    fig.colorbar(c, ax=ax, label="Gain (dBi)")
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Coverage plot saved to {output}")


def export_data(data, path="sat_comms_data.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    print("Satellite Comms Calculator — companion to the web dashboard")
    patch = iridium_patch()
    helix = inmarsat_helix()
    link = leo_sat_link_budget(1621, 780, 30, 6)
    print(f"Iridium patch: {patch['patch_width_mm']}x{patch['patch_length_mm']} mm")
    print(f"Inmarsat helix: {helix['total_height_cm']} cm, {helix['gain_dbi']} dBi")
    print(f"LEO link: rx_power={link['rx_power_dbm']} dBm, viable={link['link_viable']}")
    plot_coverage_hemisphere(6, 70)
    export_data({"patch": patch, "helix": helix, "link": link})
