#!/usr/bin/env python3
"""ESP Honeypot Network Monitor — tracks clients connecting to ESP32 honeypot APs."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import (
        Dot11, Dot11Beacon, Dot11Auth, Dot11AssoReq, Dot11AssoResp,
        Dot11ProbeReq, Dot11Elt, sniff
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")


class HoneypotMonitor:
    """Monitor ESP32 honeypot APs and catalog connecting clients."""

    def __init__(self, interface, honeypot_macs=None):
        self.interface = interface
        self.honeypot_macs = set(m.lower() for m in (honeypot_macs or []))
        self.client_events = defaultdict(list)
        self.honeypot_beacons = defaultdict(int)
        self.auth_attempts = []
        self.assoc_attempts = []

    def handle_packet(self, pkt):
        if not pkt.haslayer(Dot11):
            return
        now = time.time()
        dot11 = pkt[Dot11]

        # Track honeypot beacons
        if pkt.haslayer(Dot11Beacon):
            bssid = dot11.addr2
            if self._is_honeypot(bssid):
                self.honeypot_beacons[bssid] += 1

        # Track authentication attempts to honeypots
        if pkt.haslayer(Dot11Auth):
            bssid = dot11.addr1  # destination is the AP
            client = dot11.addr2
            if self._is_honeypot(bssid):
                self.auth_attempts.append({
                    "time": now, "client": client, "honeypot": bssid,
                })
                self.client_events[client].append({
                    "type": "auth", "time": now, "honeypot": bssid
                })

        # Track association attempts
        if pkt.haslayer(Dot11AssoReq):
            bssid = dot11.addr1
            client = dot11.addr2
            if self._is_honeypot(bssid):
                self.assoc_attempts.append({
                    "time": now, "client": client, "honeypot": bssid,
                })
                self.client_events[client].append({
                    "type": "assoc", "time": now, "honeypot": bssid
                })

        # Track probe requests for honeypot SSIDs
        if pkt.haslayer(Dot11ProbeReq):
            client = dot11.addr2
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
            if ssid:
                self.client_events[client].append({
                    "type": "probe", "time": now, "ssid": ssid
                })

    def _is_honeypot(self, mac):
        if not mac:
            return False
        if self.honeypot_macs:
            return mac.lower() in self.honeypot_macs
        return True  # If no filter, monitor all

    def auto_detect_honeypots(self, duration=10):
        """Detect ESP32 honeypots by open network beacons."""
        open_aps = {}
        def handler(pkt):
            if pkt.haslayer(Dot11Beacon):
                cap = pkt[Dot11Beacon].cap
                if not cap.privacy:
                    bssid = pkt[Dot11].addr2
                    ssid_elt = pkt.getlayer(Dot11Elt)
                    ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
                    open_aps[bssid] = ssid
        sniff(iface=self.interface, prn=handler, timeout=duration, store=False)
        self.honeypot_macs = set(open_aps.keys())
        print(f"[+] Auto-detected {len(open_aps)} potential honeypots")
        return open_aps

    def monitor(self, duration=120):
        print(f"[*] Monitoring honeypot network on {self.interface}: {duration}s")
        sniff(iface=self.interface, prn=self.handle_packet,
              timeout=duration, store=False)
        return self.get_report()

    def get_report(self):
        client_profiles = {}
        for mac, events in self.client_events.items():
            client_profiles[mac] = {
                "total_events": len(events),
                "auth_attempts": sum(1 for e in events if e["type"] == "auth"),
                "assoc_attempts": sum(1 for e in events if e["type"] == "assoc"),
                "probes": sum(1 for e in events if e["type"] == "probe"),
            }
        return {
            "honeypots_monitored": len(self.honeypot_macs),
            "unique_clients": len(self.client_events),
            "total_auth_attempts": len(self.auth_attempts),
            "total_assoc_attempts": len(self.assoc_attempts),
            "client_profiles": client_profiles,
            "recent_auth": self.auth_attempts[-20:],
        }


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_report(report, path="honeypot_report.json"):
    with open(path, "w") as f:
        json.dump(report, f, indent=2, default=list)
    print(f"[+] Report exported to {path}")


if __name__ == "__main__":
    print("ESP Honeypot Network Monitor — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 120
        mon = HoneypotMonitor(iface)
        mon.auto_detect_honeypots()
        report = mon.monitor(dur)
        export_report(report)
