#!/usr/bin/env python3
"""WiFi Persona Builder — profiles devices from their wireless behavior signature."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import (
        Dot11, Dot11ProbeReq, Dot11Beacon, Dot11Elt, sniff
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")

KNOWN_SSID_PROFILES = {
    "eduroam": "academic", "Starbucks": "coffee_shop",
    "attwifi": "carrier_hotspot", "xfinitywifi": "isp_hotspot",
    "AndroidAP": "mobile_hotspot", "iPhone": "mobile_hotspot",
    "DIRECT-": "wifi_direct", "HP-Print": "printer",
}

OUI_VENDORS = {
    "00:50:f2": "Microsoft", "ac:de:48": "Apple", "3c:22:fb": "Apple",
    "dc:a6:32": "Raspberry Pi", "f4:f5:d8": "Google", "b8:27:eb": "RPi",
    "00:1b:63": "Apple", "48:d7:05": "Apple", "a4:83:e7": "Apple",
    "44:07:0b": "Google", "00:0c:29": "VMware", "fc:aa:14": "Samsung",
}


class PersonaBuilder:
    """Build behavioral profiles of wireless devices."""

    def __init__(self, interface):
        self.interface = interface
        self.devices = defaultdict(lambda: {
            "ssids": [], "probe_times": [], "signals": [],
            "first_seen": None, "last_seen": None
        })

    def handle_packet(self, pkt):
        if not pkt.haslayer(Dot11ProbeReq):
            return
        mac = pkt[Dot11].addr2
        if not mac:
            return
        ssid_elt = pkt.getlayer(Dot11Elt)
        ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
        signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
        now = time.time()

        dev = self.devices[mac]
        if ssid:
            dev["ssids"].append(ssid)
        dev["probe_times"].append(now)
        dev["signals"].append(signal)
        dev["last_seen"] = now
        if dev["first_seen"] is None:
            dev["first_seen"] = now

    def build(self, duration=120):
        print(f"[*] Building personas from {self.interface} for {duration}s")
        sniff(iface=self.interface, prn=self.handle_packet,
              timeout=duration, store=False)
        return self._compile_personas()

    def _compile_personas(self):
        personas = []
        for mac, dev in self.devices.items():
            if len(dev["probe_times"]) < 2:
                continue
            unique_ssids = list(set(dev["ssids"]))
            vendor = OUI_VENDORS.get(mac[:8].lower(), "Unknown")
            profile_tags = self._tag_ssids(unique_ssids)
            probe_rate = len(dev["probe_times"]) / max(
                dev["last_seen"] - dev["first_seen"], 1)

            persona = {
                "mac": mac,
                "vendor": vendor,
                "unique_ssids": unique_ssids,
                "ssid_count": len(unique_ssids),
                "profile_tags": profile_tags,
                "lifestyle_guess": self._guess_lifestyle(profile_tags, unique_ssids),
                "probe_rate_per_sec": round(probe_rate, 2),
                "avg_signal": round(sum(dev["signals"]) / len(dev["signals"]), 1),
                "tech_savvy_score": self._tech_score(unique_ssids, probe_rate),
            }
            personas.append(persona)
        return sorted(personas, key=lambda x: x["ssid_count"], reverse=True)

    def _tag_ssids(self, ssids):
        tags = set()
        for ssid in ssids:
            for pattern, tag in KNOWN_SSID_PROFILES.items():
                if pattern.lower() in ssid.lower():
                    tags.add(tag)
        return list(tags)

    def _guess_lifestyle(self, tags, ssids):
        if "academic" in tags:
            return "Student/Academic"
        if "coffee_shop" in tags and len(ssids) > 5:
            return "Remote worker / Digital nomad"
        if "mobile_hotspot" in tags:
            return "Mobile-first user"
        if len(ssids) > 10:
            return "Frequent traveler"
        if len(ssids) <= 2:
            return "Home-based / Routine"
        return "General"

    def _tech_score(self, ssids, probe_rate):
        score = 50
        if probe_rate < 0.1:
            score += 20  # low probe rate = privacy-conscious
        if len(ssids) < 3:
            score += 10
        if any("5G" in s or "5g" in s for s in ssids):
            score += 5
        return min(score, 100)


def export_personas(personas, path="personas.json"):
    with open(path, "w") as f:
        json.dump(personas, f, indent=2)
    print(f"[+] {len(personas)} personas exported to {path}")


if __name__ == "__main__":
    print("WiFi Persona Builder — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 120
        pb = PersonaBuilder(iface)
        personas = pb.build(dur)
        export_personas(personas)
