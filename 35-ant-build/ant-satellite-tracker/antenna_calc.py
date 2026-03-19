#!/usr/bin/env python3
"""Satellite Tracker Calculator — antenna pointing and link budget for satellite comms."""

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


def look_angles(sat_lon, obs_lat, obs_lon, sat_alt_km=35786):
    """Calculate azimuth and elevation to a geostationary satellite."""
    sat_lon_r = math.radians(sat_lon)
    obs_lat_r = math.radians(obs_lat)
    obs_lon_r = math.radians(obs_lon)
    delta_lon = sat_lon_r - obs_lon_r

    # Azimuth
    az = math.atan2(math.sin(delta_lon),
                    math.cos(obs_lat_r) * math.tan(0) - math.sin(obs_lat_r) * math.cos(delta_lon))
    azimuth = math.degrees(az) % 360

    # Elevation
    r = EARTH_RADIUS_KM
    h = sat_alt_km
    cos_gamma = math.cos(obs_lat_r) * math.cos(delta_lon)
    d = math.sqrt(r ** 2 + (r + h) ** 2 - 2 * r * (r + h) * cos_gamma)
    elevation = math.degrees(math.acos((r + h) * math.sqrt(1 - cos_gamma ** 2) / d))

    return {
        "satellite_lon": sat_lon,
        "observer_lat": obs_lat,
        "observer_lon": obs_lon,
        "azimuth_deg": round(azimuth, 2),
        "elevation_deg": round(elevation, 2),
        "slant_range_km": round(d, 1),
    }


def sat_link_budget(freq_mhz, distance_km, tx_power_dbm, tx_gain_dbi,
                    rx_gain_dbi, system_noise_temp_k=300):
    """Calculate satellite communication link budget."""
    lam = wavelength(freq_mhz)
    fspl = 20 * math.log10(4 * math.pi * distance_km * 1000 / lam)
    rx_power = tx_power_dbm + tx_gain_dbi + rx_gain_dbi - fspl
    noise_power = 10 * math.log10(1.38e-23 * system_noise_temp_k * 1e6)  # 1 MHz BW
    snr = rx_power - noise_power

    return {
        "frequency_mhz": freq_mhz,
        "distance_km": distance_km,
        "fspl_db": round(fspl, 2),
        "rx_power_dbm": round(rx_power, 2),
        "snr_db": round(snr, 2),
        "link_margin_db": round(snr - 10, 2),  # 10 dB min SNR
        "link_viable": snr > 10,
    }


def dish_gain(diameter_m, freq_mhz, efficiency=0.55):
    """Calculate parabolic dish antenna gain."""
    lam = wavelength(freq_mhz)
    area = math.pi * (diameter_m / 2) ** 2
    gain_linear = efficiency * (4 * math.pi * area) / lam ** 2
    gain_dbi = 10 * math.log10(gain_linear)
    beamwidth = 70 * lam / diameter_m
    return {
        "diameter_m": diameter_m,
        "frequency_mhz": freq_mhz,
        "gain_dbi": round(gain_dbi, 2),
        "beamwidth_deg": round(beamwidth, 2),
        "efficiency": efficiency,
    }


def helix_antenna(freq_mhz, turns=10):
    """Design an axial-mode helical antenna for satellite comms."""
    lam = wavelength(freq_mhz)
    circumference = lam  # optimal
    spacing = lam * 0.25
    diameter = circumference / math.pi
    gain = 10 * math.log10(15 * turns * (circumference / lam) ** 2 * (spacing / lam))
    return {
        "frequency_mhz": freq_mhz, "turns": turns,
        "diameter_cm": round(diameter * 100, 2),
        "spacing_cm": round(spacing * 100, 2),
        "total_length_cm": round(turns * spacing * 100, 2),
        "gain_dbi": round(gain, 2),
        "polarization": "RHCP",
    }


def plot_satellite_pass(elevations, azimuths, output="sat_pass.png"):
    """Plot a satellite pass on a polar sky chart."""
    fig, ax = plt.subplots(subplot_kw={"projection": "polar"}, figsize=(8, 8))
    az_rad = np.radians(azimuths)
    r = 90 - np.array(elevations)  # 0=zenith, 90=horizon
    ax.plot(az_rad, r, "b-", linewidth=2, label="Satellite track")
    ax.scatter(az_rad[0], r[0], c="green", s=100, zorder=5, label="AOS")
    ax.scatter(az_rad[-1], r[-1], c="red", s=100, zorder=5, label="LOS")
    ax.set_theta_zero_location("N")
    ax.set_theta_direction(-1)
    ax.set_ylim(0, 90)
    ax.set_title("Satellite Pass", pad=20)
    ax.legend(loc="upper right")
    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()
    print(f"[+] Pass chart saved to {output}")


def export_data(data, path="satellite_data.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


if __name__ == "__main__":
    print("Satellite Tracker Calculator — companion to the web dashboard")
    freq = float(sys.argv[1]) if len(sys.argv) > 1 else 435.0
    dish = dish_gain(1.0, freq)
    helix = helix_antenna(freq)
    print(f"1m dish at {freq} MHz: {dish['gain_dbi']} dBi")
    print(f"10-turn helix: {helix['gain_dbi']} dBi, {helix['total_length_cm']} cm long")
    export_data({"dish": dish, "helix": helix})
