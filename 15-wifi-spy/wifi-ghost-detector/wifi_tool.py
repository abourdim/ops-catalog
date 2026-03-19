#!/usr/bin/env python3
"""WiFi Ghost Detector — finds hidden/cloaked devices and phantom networks."""

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


class GhostDetector:
    """Detect hidden SSIDs, phantom APs, and cloaked clients."""

    def __init__(self, interface):
        self.interface = interface
        self.hidden_aps = {}        # bssid -> signal samples
        self.revealed_ssids = {}    # bssid -> ssid (from probe responses)
        self.phantom_clients = defaultdict(list)  # mac -> probed hidden networks
        self.all_beacons = defaultdict(int)

    def handle_packet(self, pkt):
        if not pkt.haslayer(Dot11):
            return
        signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99

        if pkt.haslayer(Dot11Beacon):
            bssid = pkt[Dot11].addr2
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
            self.all_beacons[bssid] += 1
            if not ssid or ssid == "\x00" * len(ssid):
                if bssid not in self.hidden_aps:
                    self.hidden_aps[bssid] = []
                self.hidden_aps[bssid].append(signal)
                print(f"  [ghost] Hidden AP detected: {bssid} (signal: {signal}dBm)")

        elif pkt.haslayer(Dot11ProbeResp):
            bssid = pkt[Dot11].addr2
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
            if ssid and bssid in self.hidden_aps:
                self.revealed_ssids[bssid] = ssid
                print(f"  [reveal] Hidden AP {bssid} SSID revealed: '{ssid}'")

        elif pkt.haslayer(Dot11ProbeReq):
            client = pkt[Dot11].addr2
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
            if ssid and ssid not in [s for s in self.revealed_ssids.values()]:
                self.phantom_clients[client].append({
                    "ssid": ssid, "signal": signal, "time": time.time()
                })

    def scan(self, duration=90):
        print(f"[*] Ghost scan on {self.interface} for {duration}s")
        sniff(iface=self.interface, prn=self.handle_packet,
              timeout=duration, store=False)
        return self.get_report()

    def get_report(self):
        hidden_details = {}
        for bssid, signals in self.hidden_aps.items():
            avg = sum(signals) / len(signals)
            hidden_details[bssid] = {
                "avg_signal": round(avg, 1),
                "beacon_count": len(signals),
                "revealed_ssid": self.revealed_ssids.get(bssid, None),
            }

        phantom_details = {}
        for mac, probes in self.phantom_clients.items():
            ssids = list(set(p["ssid"] for p in probes))
            phantom_details[mac] = {
                "phantom_ssids": ssids,
                "probe_count": len(probes),
            }

        return {
            "hidden_aps_found": len(self.hidden_aps),
            "ssids_revealed": len(self.revealed_ssids),
            "phantom_clients": len(self.phantom_clients),
            "total_aps_seen": len(self.all_beacons),
            "hidden_ap_details": hidden_details,
            "phantom_client_details": phantom_details,
        }


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_report(report, path="ghost_report.json"):
    with open(path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"[+] Ghost report exported to {path}")


if __name__ == "__main__":
    print("WiFi Ghost Detector — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 90
        det = GhostDetector(iface)
        report = det.scan(dur)
        export_report(report)
