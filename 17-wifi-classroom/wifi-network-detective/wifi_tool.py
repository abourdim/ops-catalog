#!/usr/bin/env python3
"""WiFi Network Detective — guided WiFi forensics for identifying network issues."""

import subprocess
import sys
import time
import json
import re
from collections import defaultdict

try:
    from scapy.all import (
        Dot11, Dot11Beacon, Dot11Deauth, Dot11Elt, RadioTap, sniff
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")


class NetworkDetective:
    """Systematically investigate WiFi environment issues."""

    def __init__(self, interface):
        self.interface = interface
        self.findings = []
        self.evidence = {}

    def investigate_congestion(self, duration=15):
        """Check for channel congestion."""
        print("[*] Investigating channel congestion...")
        channel_aps = defaultdict(int)

        def handler(pkt):
            if pkt.haslayer(Dot11Beacon):
                ch = self._get_channel(pkt)
                if ch:
                    channel_aps[ch] += 1

        for ch in range(1, 14):
            set_channel(self.interface, ch)
            sniff(iface=self.interface, prn=handler, timeout=duration / 13, store=False)

        congested = {ch: cnt for ch, cnt in channel_aps.items() if cnt > 5}
        if congested:
            self.findings.append({
                "issue": "channel_congestion",
                "severity": "medium" if max(congested.values()) < 10 else "high",
                "details": f"Congested channels: {congested}",
                "recommendation": "Move to a less crowded channel",
            })
        self.evidence["channel_congestion"] = dict(channel_aps)
        return channel_aps

    def investigate_interference(self, duration=10):
        """Look for non-WiFi interference indicators."""
        print("[*] Checking for interference patterns...")
        beacon_gaps = []
        last_beacon = [0]

        def handler(pkt):
            if pkt.haslayer(Dot11Beacon):
                now = time.time()
                if last_beacon[0] > 0:
                    gap = now - last_beacon[0]
                    if gap > 0.3:  # Expected ~0.1s beacon interval
                        beacon_gaps.append(gap)
                last_beacon[0] = now

        sniff(iface=self.interface, prn=handler, timeout=duration, store=False)
        if len(beacon_gaps) > 5:
            self.findings.append({
                "issue": "possible_interference",
                "severity": "medium",
                "details": f"{len(beacon_gaps)} abnormal beacon gaps detected",
                "recommendation": "Check for microwave ovens, Bluetooth, or other 2.4GHz devices",
            })
        self.evidence["beacon_gaps"] = len(beacon_gaps)

    def investigate_security(self, duration=15):
        """Check for security issues in the environment."""
        print("[*] Investigating security posture...")
        open_networks = []
        weak_networks = []

        def handler(pkt):
            if pkt.haslayer(Dot11Beacon):
                bssid = pkt[Dot11].addr2
                ssid_elt = pkt.getlayer(Dot11Elt)
                ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
                cap = pkt[Dot11Beacon].cap
                if not cap.privacy:
                    open_networks.append({"ssid": ssid, "bssid": bssid})

        sniff(iface=self.interface, prn=handler, timeout=duration, store=False)
        if open_networks:
            self.findings.append({
                "issue": "open_networks",
                "severity": "high",
                "details": f"{len(open_networks)} open (unencrypted) networks found",
                "recommendation": "Enable WPA2/WPA3 encryption",
            })
        self.evidence["open_networks"] = open_networks

    def investigate_deauths(self, duration=15):
        """Check for deauthentication attacks."""
        print("[*] Monitoring for deauth attacks...")
        deauth_count = [0]

        def handler(pkt):
            if pkt.haslayer(Dot11Deauth):
                deauth_count[0] += 1

        sniff(iface=self.interface, prn=handler, timeout=duration, store=False)
        if deauth_count[0] > 5:
            self.findings.append({
                "issue": "deauth_activity",
                "severity": "high",
                "details": f"{deauth_count[0]} deauth frames in {duration}s",
                "recommendation": "Enable 802.11w Protected Management Frames",
            })
        self.evidence["deauth_count"] = deauth_count[0]

    def _get_channel(self, pkt):
        elt = pkt.getlayer(Dot11Elt)
        while elt:
            if elt.ID == 3 and elt.info:
                return elt.info[0]
            elt = elt.payload.getlayer(Dot11Elt) if hasattr(elt.payload, "getlayer") else None
        return 0

    def full_investigation(self, duration=60):
        per_test = duration // 4
        self.investigate_congestion(per_test)
        self.investigate_interference(per_test)
        self.investigate_security(per_test)
        self.investigate_deauths(per_test)
        return self.get_report()

    def get_report(self):
        return {
            "findings": self.findings,
            "evidence": self.evidence,
            "issue_count": len(self.findings),
            "severity_summary": {
                "high": sum(1 for f in self.findings if f["severity"] == "high"),
                "medium": sum(1 for f in self.findings if f["severity"] == "medium"),
                "low": sum(1 for f in self.findings if f["severity"] == "low"),
            },
        }


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_report(report, path="detective_report.json"):
    with open(path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"[+] Investigation report exported to {path}")


if __name__ == "__main__":
    print("WiFi Network Detective — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 60
        det = NetworkDetective(iface)
        report = det.full_investigation(dur)
        export_report(report)
