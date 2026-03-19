#!/usr/bin/env python3
"""WiFi Frequency Forensics — HackRF-based wideband 2.4/5 GHz spectrum analysis."""

import subprocess
import sys
import time
import json
import struct
import os

try:
    from scapy.all import Dot11, Dot11Beacon, Dot11Elt, sniff
except ImportError:
    sys.exit("scapy required: pip install scapy")

WIFI_24_START = 2400  # MHz
WIFI_24_END = 2500
WIFI_5_START = 5150
WIFI_5_END = 5850
SAMPLE_RATE = 20e6


def hackrf_sweep(start_mhz=2400, end_mhz=2500, bin_width=100000,
                 duration=5, output="sweep.csv"):
    """Run hackrf_sweep for wideband power measurement."""
    cmd = [
        "hackrf_sweep", "-f", f"{start_mhz}:{end_mhz}",
        "-w", str(bin_width), "-1",
    ]
    print(f"[*] HackRF sweep: {start_mhz}-{end_mhz} MHz")
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=duration + 10)
    lines = result.stdout.strip().split("\n")
    return parse_sweep_data(lines)


def parse_sweep_data(lines):
    """Parse hackrf_sweep CSV output into frequency-power pairs."""
    data = []
    for line in lines:
        parts = line.split(",")
        if len(parts) < 7:
            continue
        try:
            freq_low = float(parts[2])
            freq_high = float(parts[3])
            bin_width = float(parts[4])
            num_samples = int(parts[5])
            powers = [float(p) for p in parts[6:]]
            for i, pwr in enumerate(powers):
                freq = freq_low + i * bin_width / 1e6
                data.append({"freq_mhz": round(freq, 3), "power_dbm": round(pwr, 1)})
        except (ValueError, IndexError):
            continue
    return data


def identify_wifi_channels(sweep_data):
    """Identify active WiFi channels from sweep data."""
    channel_centers_24 = {i: 2412 + (i - 1) * 5 for i in range(1, 14)}
    active = {}
    for ch, center in channel_centers_24.items():
        ch_data = [d for d in sweep_data
                   if center - 10 <= d["freq_mhz"] <= center + 10]
        if ch_data:
            avg_power = sum(d["power_dbm"] for d in ch_data) / len(ch_data)
            peak_power = max(d["power_dbm"] for d in ch_data)
            if peak_power > -70:
                active[ch] = {
                    "center_mhz": center,
                    "avg_power": round(avg_power, 1),
                    "peak_power": round(peak_power, 1),
                    "samples": len(ch_data),
                }
    return active


def detect_anomalies(sweep_data, threshold_dbm=-30):
    """Find unusual high-power emissions that could indicate interference."""
    anomalies = []
    for d in sweep_data:
        if d["power_dbm"] > threshold_dbm:
            anomalies.append({
                "freq_mhz": d["freq_mhz"],
                "power_dbm": d["power_dbm"],
                "type": classify_emission(d["freq_mhz"]),
            })
    return anomalies


def classify_emission(freq_mhz):
    """Classify an emission by frequency."""
    if 2400 <= freq_mhz <= 2483:
        return "wifi_2.4ghz"
    if 2400 <= freq_mhz <= 2500:
        return "ism_2.4ghz"
    if 5150 <= freq_mhz <= 5350:
        return "wifi_5ghz_unii1"
    if 5470 <= freq_mhz <= 5725:
        return "wifi_5ghz_unii2"
    if 5725 <= freq_mhz <= 5850:
        return "wifi_5ghz_unii3"
    return "unknown"


def capture_iq_samples(freq_mhz, duration=1, output="capture.raw"):
    """Capture raw IQ samples at a specific frequency using hackrf_transfer."""
    cmd = [
        "hackrf_transfer", "-r", output,
        "-f", str(int(freq_mhz * 1e6)),
        "-s", str(int(SAMPLE_RATE)),
        "-n", str(int(SAMPLE_RATE * duration)),
    ]
    subprocess.run(cmd, capture_output=True, timeout=duration + 5)
    if os.path.exists(output):
        size = os.path.getsize(output)
        print(f"[+] Captured {size} bytes of IQ data at {freq_mhz} MHz")
        return output
    return None


def scapy_supplement(interface, duration=10):
    """Supplement HackRF data with scapy beacon capture for SSID resolution."""
    aps = {}
    def handler(pkt):
        if pkt.haslayer(Dot11Beacon):
            bssid = pkt[Dot11].addr2
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
            aps[bssid] = ssid
    sniff(iface=interface, prn=handler, timeout=duration, store=False)
    return aps


def export_forensics(sweep_data, channels, anomalies, path="freq_forensics.json"):
    with open(path, "w") as f:
        json.dump({"sweep": sweep_data[:500], "channels": channels,
                    "anomalies": anomalies}, f, indent=2)
    print(f"[+] Forensics exported to {path}")


if __name__ == "__main__":
    print("WiFi Frequency Forensics — HackRF companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py [start_mhz] [end_mhz]")
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 2400
    end = int(sys.argv[2]) if len(sys.argv) > 2 else 2500
    data = hackrf_sweep(start, end)
    channels = identify_wifi_channels(data)
    anomalies = detect_anomalies(data)
    export_forensics(data, channels, anomalies)
