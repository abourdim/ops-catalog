#!/usr/bin/env python3
"""WiFi Protocol Rainbow — visualizes all WiFi protocol versions in the area."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import (
        Dot11, Dot11Beacon, Dot11Elt, RadioTap, sniff
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")


# 802.11 protocol identification by supported rates and HT/VHT/HE capabilities
PROTOCOL_MAP = {
    "802.11b": {"max_rate": 11, "ht": False, "vht": False},
    "802.11g": {"max_rate": 54, "ht": False, "vht": False},
    "802.11n": {"max_rate": 600, "ht": True, "vht": False},
    "802.11ac": {"max_rate": 6933, "ht": True, "vht": True},
    "802.11ax": {"max_rate": 9608, "ht": True, "vht": True, "he": True},
}


class ProtocolRainbow:
    """Identify and catalog WiFi protocol versions for every AP."""

    def __init__(self, interface):
        self.interface = interface
        self.aps = {}

    def handle_beacon(self, pkt):
        if not pkt.haslayer(Dot11Beacon):
            return
        bssid = pkt[Dot11].addr2
        ssid_elt = pkt.getlayer(Dot11Elt)
        ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
        signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
        channel = self._get_channel(pkt)

        caps = self._parse_capabilities(pkt)
        protocol = self._identify_protocol(caps)

        self.aps[bssid] = {
            "ssid": ssid, "signal": signal, "channel": channel,
            "protocol": protocol, "capabilities": caps,
        }

    def _parse_capabilities(self, pkt):
        caps = {"rates": [], "ht": False, "vht": False, "he": False,
                "wpa": False, "wpa2": False, "wpa3": False,
                "wmm": False, "wps": False}
        elt = pkt.getlayer(Dot11Elt)
        while elt:
            if elt.ID == 1:  # Supported Rates
                caps["rates"].extend(list(elt.info))
            elif elt.ID == 50:  # Extended Rates
                caps["rates"].extend(list(elt.info))
            elif elt.ID == 45:  # HT Capabilities
                caps["ht"] = True
            elif elt.ID == 191:  # VHT Capabilities
                caps["vht"] = True
            elif elt.ID == 255:  # HE (802.11ax) Extension
                caps["he"] = True
            elif elt.ID == 48:  # RSN (WPA2)
                caps["wpa2"] = True
                if elt.info and len(elt.info) > 20:
                    caps["wpa3"] = True  # SAE indication
            elif elt.ID == 221:  # Vendor Specific
                if elt.info and elt.info[:4] == b"\x00\x50\xf2\x01":
                    caps["wpa"] = True
                if elt.info and elt.info[:4] == b"\x00\x50\xf2\x02":
                    caps["wmm"] = True
            elt = elt.payload.getlayer(Dot11Elt) if hasattr(elt.payload, "getlayer") else None
        return caps

    def _identify_protocol(self, caps):
        if caps["he"]:
            return "802.11ax"
        if caps["vht"]:
            return "802.11ac"
        if caps["ht"]:
            return "802.11n"
        max_rate = max(caps["rates"]) if caps["rates"] else 0
        if max_rate > 22:  # > 11 Mbps
            return "802.11g"
        return "802.11b"

    def _get_channel(self, pkt):
        elt = pkt.getlayer(Dot11Elt)
        while elt:
            if elt.ID == 3 and elt.info:
                return elt.info[0]
            elt = elt.payload.getlayer(Dot11Elt) if hasattr(elt.payload, "getlayer") else None
        return 0

    def scan(self, duration=30):
        print(f"[*] Protocol rainbow scan on {self.interface} for {duration}s")
        channels = list(range(1, 14))
        per_ch = max(duration / len(channels), 0.5)
        for ch in channels:
            set_channel(self.interface, ch)
            sniff(iface=self.interface, prn=self.handle_beacon,
                  timeout=per_ch, store=False)
        return self.get_rainbow()

    def get_rainbow(self):
        protocol_counts = defaultdict(int)
        security_counts = defaultdict(int)
        for bssid, ap in self.aps.items():
            protocol_counts[ap["protocol"]] += 1
            if ap["capabilities"]["wpa3"]:
                security_counts["WPA3"] += 1
            elif ap["capabilities"]["wpa2"]:
                security_counts["WPA2"] += 1
            elif ap["capabilities"]["wpa"]:
                security_counts["WPA"] += 1
            else:
                security_counts["Open"] += 1

        return {
            "total_aps": len(self.aps),
            "protocol_distribution": dict(protocol_counts),
            "security_distribution": dict(security_counts),
            "aps": list(self.aps.values()),
        }


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_rainbow(data, path="protocol_rainbow.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[+] Rainbow data exported to {path}")


if __name__ == "__main__":
    print("WiFi Protocol Rainbow — HackRF companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 30
        pr = ProtocolRainbow(iface)
        data = pr.scan(dur)
        export_rainbow(data)
