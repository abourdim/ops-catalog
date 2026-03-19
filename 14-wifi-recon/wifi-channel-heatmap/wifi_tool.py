#!/usr/bin/env python3
"""WiFi Channel Heatmap Tool — scans all 2.4/5 GHz channels and maps usage density."""

import subprocess
import sys
import time
import json
import re

try:
    from scapy.all import Dot11, Dot11Beacon, Dot11Elt, sniff
except ImportError:
    sys.exit("scapy required: pip install scapy")

CHANNELS_24 = list(range(1, 14))
CHANNELS_5 = [36, 40, 44, 48, 52, 56, 60, 64, 100, 104, 108, 112,
              116, 120, 124, 128, 132, 136, 140, 149, 153, 157, 161, 165]


def set_channel(interface, channel):
    """Switch the wireless interface to the given channel."""
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def scan_channel(interface, channel, dwell=0.5):
    """Sniff a single channel and return discovered APs."""
    set_channel(interface, channel)
    aps = {}

    def handler(pkt):
        if pkt.haslayer(Dot11Beacon):
            bssid = pkt[Dot11].addr2
            ssid_elt = pkt[Dot11Elt]
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt else ""
            signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
            aps[bssid] = {"ssid": ssid, "signal": signal, "channel": channel}

    sniff(iface=interface, prn=handler, timeout=dwell, store=False)
    return aps


def full_scan(interface, band="2.4", dwell=0.3):
    """Scan all channels in the selected band."""
    channels = CHANNELS_24 if band == "2.4" else CHANNELS_5
    heatmap = {}
    all_aps = {}
    for ch in channels:
        print(f"  Scanning channel {ch}...", end="\r")
        found = scan_channel(interface, ch, dwell)
        heatmap[ch] = len(found)
        all_aps.update(found)
    print()
    return heatmap, all_aps


def compute_channel_score(heatmap):
    """Score each channel — lower is better (fewer APs)."""
    if not heatmap:
        return {}
    max_count = max(heatmap.values()) or 1
    return {ch: round((1 - count / max_count) * 100)
            for ch, count in heatmap.items()}


def recommend_channel(heatmap):
    """Return the least congested channel."""
    if not heatmap:
        return None
    return min(heatmap, key=heatmap.get)


def get_iwlist_scan(interface):
    """Parse iwlist scan for supplementary data."""
    result = subprocess.run(["iwlist", interface, "scan"],
                           capture_output=True, text=True)
    cells = []
    for block in result.stdout.split("Cell"):
        ssid = re.search(r'ESSID:"(.+?)"', block)
        ch = re.search(r"Channel:(\d+)", block)
        sig = re.search(r"Signal level=(-?\d+)", block)
        if ssid:
            cells.append({
                "ssid": ssid.group(1),
                "channel": int(ch.group(1)) if ch else 0,
                "signal": int(sig.group(1)) if sig else -99,
            })
    return cells


def export_heatmap_json(heatmap, scores, path="heatmap_data.json"):
    """Export heatmap data for the web dashboard."""
    data = {"heatmap": heatmap, "scores": scores,
            "timestamp": time.time()}
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[+] Heatmap exported to {path}")


def get_interface_mode(interface):
    """Check current interface mode."""
    result = subprocess.run(["iwconfig", interface],
                           capture_output=True, text=True)
    if "Monitor" in result.stdout:
        return "monitor"
    return "managed"


if __name__ == "__main__":
    print("WiFi Channel Heatmap Tool — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [band]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        band = sys.argv[2] if len(sys.argv) > 2 else "2.4"
        hmap, aps = full_scan(iface, band)
        scores = compute_channel_score(hmap)
        best = recommend_channel(hmap)
        print(f"[+] Found {len(aps)} APs — best channel: {best}")
        export_heatmap_json(hmap, scores)
