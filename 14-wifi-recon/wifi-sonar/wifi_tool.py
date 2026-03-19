#!/usr/bin/env python3
"""WiFi Sonar — active/passive scanning with distance estimation via signal strength."""

import subprocess
import sys
import time
import json
import math
from collections import defaultdict

try:
    from scapy.all import Dot11, Dot11Beacon, Dot11Elt, RadioTap, sniff
except ImportError:
    sys.exit("scapy required: pip install scapy")

# Free-space path loss constants
FREQ_MHZ_24 = 2437  # channel 6 center
SPEED_OF_LIGHT = 299792458


def signal_to_distance(rssi_dbm, freq_mhz=FREQ_MHZ_24):
    """Estimate distance in meters from RSSI using free-space path loss model."""
    if rssi_dbm >= 0:
        return 0.1
    # FSPL: distance = 10^((27.55 - (20*log10(freq)) + abs(RSSI)) / 20)
    exp = (27.55 - (20 * math.log10(freq_mhz)) + abs(rssi_dbm)) / 20.0
    return round(10 ** exp, 2)


class WiFiSonar:
    """Radar-like WiFi scanner with distance estimation."""

    def __init__(self, interface):
        self.interface = interface
        self.targets = defaultdict(lambda: {
            "ssid": "", "signals": [], "distances": [],
            "first_seen": None, "last_seen": None, "channel": 0
        })

    def handle_beacon(self, pkt):
        if not pkt.haslayer(Dot11Beacon):
            return
        bssid = pkt[Dot11].addr2
        ssid_elt = pkt.getlayer(Dot11Elt)
        ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else "<hidden>"
        signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
        channel = self._get_channel(pkt)
        freq = 2412 + (channel - 1) * 5 if 1 <= channel <= 13 else FREQ_MHZ_24

        now = time.time()
        t = self.targets[bssid]
        t["ssid"] = ssid
        t["signals"].append(signal)
        t["distances"].append(signal_to_distance(signal, freq))
        t["channel"] = channel
        t["last_seen"] = now
        if t["first_seen"] is None:
            t["first_seen"] = now

    def _get_channel(self, pkt):
        elt = pkt.getlayer(Dot11Elt)
        while elt:
            if elt.ID == 3 and elt.info:
                return elt.info[0]
            elt = elt.payload.getlayer(Dot11Elt) if hasattr(elt.payload, "getlayer") else None
        return 0

    def sweep(self, duration=30, channels=None):
        """Perform a sonar sweep across channels."""
        channels = channels or list(range(1, 14))
        print(f"[*] Sonar sweep: {len(channels)} channels, {duration}s")
        per_ch = max(duration / len(channels), 0.3)
        for ch in channels:
            set_channel(self.interface, ch)
            sniff(iface=self.interface, prn=self.handle_beacon,
                  timeout=per_ch, store=False)
        return self.get_sonar_data()

    def get_sonar_data(self):
        results = []
        for bssid, t in self.targets.items():
            if not t["signals"]:
                continue
            avg_signal = sum(t["signals"]) / len(t["signals"])
            avg_dist = sum(t["distances"]) / len(t["distances"])
            results.append({
                "bssid": bssid, "ssid": t["ssid"],
                "channel": t["channel"],
                "avg_signal_dbm": round(avg_signal, 1),
                "estimated_distance_m": round(avg_dist, 1),
                "sample_count": len(t["signals"]),
                "signal_stability": round(
                    max(t["signals"]) - min(t["signals"]), 1),
            })
        return sorted(results, key=lambda x: x["estimated_distance_m"])

    def get_radar_view(self):
        """Return polar coordinates for radar-style visualization."""
        data = self.get_sonar_data()
        angle_step = 360 / max(len(data), 1)
        radar = []
        for i, ap in enumerate(data):
            radar.append({
                "bssid": ap["bssid"], "ssid": ap["ssid"],
                "angle": round(i * angle_step, 1),
                "distance": ap["estimated_distance_m"],
                "signal": ap["avg_signal_dbm"],
            })
        return radar


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_sonar(data, path="sonar_data.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[+] Sonar data exported to {path}")


if __name__ == "__main__":
    print("WiFi Sonar — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 30
        sonar = WiFiSonar(iface)
        data = sonar.sweep(dur)
        export_sonar(data)
        print(f"[+] Detected {len(data)} APs")
