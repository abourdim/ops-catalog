#!/usr/bin/env python3
"""WiFi Full Spectrum — wideband spectrum analysis across all WiFi bands with HackRF."""

import subprocess
import sys
import time
import json

try:
    from scapy.all import Dot11, Dot11Beacon, Dot11Elt, sniff
except ImportError:
    sys.exit("scapy required: pip install scapy")

BANDS = {
    "2.4GHz": (2400, 2500),
    "5GHz-UNII1": (5150, 5350),
    "5GHz-UNII2": (5470, 5725),
    "5GHz-UNII3": (5725, 5850),
}


def hackrf_sweep_band(start_mhz, end_mhz, bin_width=200000):
    """Sweep a frequency band using hackrf_sweep."""
    cmd = ["hackrf_sweep", "-f", f"{start_mhz}:{end_mhz}",
           "-w", str(bin_width), "-1"]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    return _parse_sweep(result.stdout)


def _parse_sweep(output):
    data = []
    for line in output.strip().split("\n"):
        parts = line.split(",")
        if len(parts) < 7:
            continue
        try:
            freq_low = float(parts[2])
            bin_w = float(parts[4])
            powers = [float(p) for p in parts[6:]]
            for i, pwr in enumerate(powers):
                freq = freq_low + i * bin_w / 1e6
                data.append({"freq": round(freq, 3), "power": round(pwr, 1)})
        except (ValueError, IndexError):
            continue
    return data


def full_spectrum_scan():
    """Scan all WiFi bands and compile results."""
    all_data = {}
    for band_name, (start, end) in BANDS.items():
        print(f"[*] Scanning {band_name}: {start}-{end} MHz")
        data = hackrf_sweep_band(start, end)
        all_data[band_name] = {
            "range": [start, end],
            "points": len(data),
            "data": data,
            "peak": max((d["power"] for d in data), default=-100),
            "floor": min((d["power"] for d in data), default=-100),
        }
    return all_data


def compute_band_utilization(band_data, noise_floor=-90):
    """Calculate what percentage of a band has activity above noise floor."""
    if not band_data:
        return 0
    active = sum(1 for d in band_data if d["power"] > noise_floor)
    return round(active / len(band_data) * 100, 1)


def find_clear_frequencies(all_data, threshold=-80):
    """Find the quietest frequencies across all bands."""
    clear = []
    for band_name, info in all_data.items():
        for d in info["data"]:
            if d["power"] < threshold:
                clear.append({"band": band_name, "freq": d["freq"],
                              "power": d["power"]})
    return sorted(clear, key=lambda x: x["power"])[:20]


def correlate_with_scapy(interface, duration=10):
    """Use scapy to add SSID names to spectrum data."""
    aps = {}
    channel_map = {2412 + (i - 1) * 5: i for i in range(1, 14)}
    def handler(pkt):
        if pkt.haslayer(Dot11Beacon):
            bssid = pkt[Dot11].addr2
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
            signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
            aps[bssid] = {"ssid": ssid, "signal": signal}
    sniff(iface=interface, prn=handler, timeout=duration, store=False)
    return aps


def generate_spectrum_summary(all_data):
    """Summary statistics across all bands."""
    summary = {}
    for band_name, info in all_data.items():
        summary[band_name] = {
            "utilization_pct": compute_band_utilization(info["data"]),
            "peak_dbm": info["peak"],
            "noise_floor_dbm": info["floor"],
            "bandwidth_mhz": info["range"][1] - info["range"][0],
        }
    return summary


def export_spectrum(all_data, summary, path="full_spectrum.json"):
    # Limit data points for JSON export
    export = {"summary": summary, "bands": {}}
    for band, info in all_data.items():
        export["bands"][band] = {
            "range": info["range"],
            "peak": info["peak"],
            "floor": info["floor"],
            "data": info["data"][:200],
        }
    with open(path, "w") as f:
        json.dump(export, f, indent=2)
    print(f"[+] Spectrum data exported to {path}")


if __name__ == "__main__":
    print("WiFi Full Spectrum — HackRF companion to the web dashboard")
    all_data = full_spectrum_scan()
    summary = generate_spectrum_summary(all_data)
    export_spectrum(all_data, summary)
    clear = find_clear_frequencies(all_data)
    print(f"[+] Cleanest frequency: {clear[0]['freq']} MHz at {clear[0]['power']} dBm"
          if clear else "[!] No clear frequencies found")
