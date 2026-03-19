#!/usr/bin/env python3
"""WiFi RF Lineup — identifies and catalogs all RF emitters in the area."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import (
        Dot11, Dot11Beacon, Dot11ProbeReq, Dot11ProbeResp,
        Dot11Elt, RadioTap, sniff
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")

OUI_DB = {
    "ac:de:48": "Apple", "3c:22:fb": "Apple", "dc:a6:32": "Raspberry Pi",
    "f4:f5:d8": "Google", "b8:27:eb": "RPi", "00:0c:29": "VMware",
    "fc:aa:14": "Samsung", "00:50:f2": "Microsoft", "44:07:0b": "Google",
    "e8:48:b8": "TP-Link", "c0:25:e9": "TP-Link", "14:cc:20": "TP-Link",
    "00:1a:2b": "Cisco", "00:24:d7": "Cisco", "88:71:b1": "Cisco",
}


class RFLineup:
    """Catalog every RF emitter detected in the WiFi spectrum."""

    def __init__(self, interface):
        self.interface = interface
        self.emitters = defaultdict(lambda: {
            "type": "unknown", "ssid": "", "signals": [],
            "channels": set(), "frame_types": set(),
            "first_seen": None, "last_seen": None
        })

    def handle_packet(self, pkt):
        if not pkt.haslayer(Dot11):
            return
        mac = pkt[Dot11].addr2
        if not mac or mac == "ff:ff:ff:ff:ff:ff":
            return
        signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
        now = time.time()
        em = self.emitters[mac]
        em["signals"].append(signal)
        em["last_seen"] = now
        if em["first_seen"] is None:
            em["first_seen"] = now

        if pkt.haslayer(Dot11Beacon):
            em["type"] = "access_point"
            ssid_elt = pkt.getlayer(Dot11Elt)
            if ssid_elt and ssid_elt.info:
                em["ssid"] = ssid_elt.info.decode(errors="replace")
            ch = self._get_channel(pkt)
            if ch:
                em["channels"].add(ch)
            em["frame_types"].add("beacon")

        elif pkt.haslayer(Dot11ProbeReq):
            if em["type"] == "unknown":
                em["type"] = "client"
            em["frame_types"].add("probe_req")

        elif pkt.haslayer(Dot11ProbeResp):
            em["type"] = "access_point"
            em["frame_types"].add("probe_resp")
        else:
            em["frame_types"].add(f"t{pkt[Dot11].type}s{pkt[Dot11].subtype}")

    def _get_channel(self, pkt):
        elt = pkt.getlayer(Dot11Elt)
        while elt:
            if elt.ID == 3 and elt.info:
                return elt.info[0]
            elt = elt.payload.getlayer(Dot11Elt) if hasattr(elt.payload, "getlayer") else None
        return None

    def scan(self, duration=60, hop_channels=True):
        print(f"[*] RF Lineup scan on {self.interface} for {duration}s")
        if hop_channels:
            self._scan_with_hopping(duration)
        else:
            sniff(iface=self.interface, prn=self.handle_packet,
                  timeout=duration, store=False)
        return self.get_lineup()

    def _scan_with_hopping(self, duration):
        channels = list(range(1, 14))
        per_ch = max(duration / len(channels), 0.5)
        for ch in channels:
            set_channel(self.interface, ch)
            sniff(iface=self.interface, prn=self.handle_packet,
                  timeout=per_ch, store=False)

    def get_lineup(self):
        lineup = []
        for mac, em in self.emitters.items():
            if not em["signals"]:
                continue
            vendor = OUI_DB.get(mac[:8].lower(), "Unknown")
            avg_sig = sum(em["signals"]) / len(em["signals"])
            lineup.append({
                "mac": mac, "vendor": vendor,
                "type": em["type"], "ssid": em["ssid"],
                "avg_signal": round(avg_sig, 1),
                "channels": sorted(em["channels"]),
                "frame_types": sorted(em["frame_types"]),
                "sample_count": len(em["signals"]),
                "active_sec": round(em["last_seen"] - em["first_seen"], 1)
                if em["first_seen"] and em["last_seen"] else 0,
            })
        return sorted(lineup, key=lambda x: x["avg_signal"], reverse=True)


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_lineup(data, path="rf_lineup.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2, default=list)
    print(f"[+] RF lineup exported to {path}")


if __name__ == "__main__":
    print("WiFi RF Lineup — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 60
        lineup = RFLineup(iface)
        data = lineup.scan(dur)
        export_lineup(data)
        print(f"[+] Cataloged {len(data)} emitters")
