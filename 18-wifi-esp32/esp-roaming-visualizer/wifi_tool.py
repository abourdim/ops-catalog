#!/usr/bin/env python3
"""ESP Roaming Visualizer — tracks client roaming between ESP32 access points."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import (
        Dot11, Dot11Beacon, Dot11Auth, Dot11AssoReq,
        Dot11AssoResp, Dot11Elt, sniff
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")


class RoamingTracker:
    """Track client handoff events between ESP32 APs."""

    def __init__(self, interface):
        self.interface = interface
        self.ap_registry = {}  # bssid -> {ssid, channel, signal}
        self.client_history = defaultdict(list)  # client_mac -> [events]
        self.roam_events = []

    def handle_packet(self, pkt):
        if not pkt.haslayer(Dot11):
            return
        now = time.time()
        dot11 = pkt[Dot11]

        # Register APs
        if pkt.haslayer(Dot11Beacon):
            bssid = dot11.addr2
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
            signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
            ch = self._get_channel(pkt)
            self.ap_registry[bssid] = {"ssid": ssid, "channel": ch, "signal": signal}

        # Track association requests (client choosing AP)
        if pkt.haslayer(Dot11AssoReq):
            client = dot11.addr2
            ap = dot11.addr1
            signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
            event = {"time": now, "ap": ap, "type": "assoc_req", "signal": signal}
            history = self.client_history[client]
            # Detect roam: previous AP differs from current
            if history and history[-1]["ap"] != ap:
                roam = {
                    "time": now, "client": client,
                    "from_ap": history[-1]["ap"],
                    "to_ap": ap,
                    "from_signal": history[-1].get("signal", -99),
                    "to_signal": signal,
                    "roam_time_sec": round(now - history[-1]["time"], 3),
                }
                self.roam_events.append(roam)
                print(f"[*] Roam: {client[:8]}... from {roam['from_ap'][:8]} "
                      f"to {roam['to_ap'][:8]} ({roam['roam_time_sec']}s)")
            history.append(event)

        # Track auth frames
        if pkt.haslayer(Dot11Auth):
            client = dot11.addr2
            ap = dot11.addr1
            self.client_history[client].append({
                "time": now, "ap": ap, "type": "auth"
            })

    def _get_channel(self, pkt):
        elt = pkt.getlayer(Dot11Elt)
        while elt:
            if elt.ID == 3 and elt.info:
                return elt.info[0]
            elt = elt.payload.getlayer(Dot11Elt) if hasattr(elt.payload, "getlayer") else None
        return 0

    def track(self, duration=180):
        print(f"[*] Tracking roaming on {self.interface}: {duration}s")
        sniff(iface=self.interface, prn=self.handle_packet,
              timeout=duration, store=False)
        return self.get_report()

    def get_report(self):
        client_summaries = {}
        for mac, history in self.client_history.items():
            aps_visited = list(set(e["ap"] for e in history))
            client_summaries[mac] = {
                "aps_visited": len(aps_visited),
                "events": len(history),
                "roams": sum(1 for r in self.roam_events if r["client"] == mac),
            }

        avg_roam_time = 0
        if self.roam_events:
            avg_roam_time = round(
                sum(r["roam_time_sec"] for r in self.roam_events) /
                len(self.roam_events), 3)

        return {
            "aps_detected": len(self.ap_registry),
            "clients_tracked": len(self.client_history),
            "total_roam_events": len(self.roam_events),
            "avg_roam_time_sec": avg_roam_time,
            "ap_registry": self.ap_registry,
            "client_summaries": client_summaries,
            "roam_events": self.roam_events[-50:],
        }


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_report(report, path="roaming_report.json"):
    with open(path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"[+] Report exported to {path}")


if __name__ == "__main__":
    print("ESP Roaming Visualizer — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 180
        tracker = RoamingTracker(iface)
        report = tracker.track(dur)
        export_report(report)
