#!/usr/bin/env python3
"""WiFi Attack-Defense — educational tool for understanding common WiFi attacks."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import (
        Dot11, Dot11Beacon, Dot11Deauth, Dot11Auth, Dot11Elt,
        EAPOL, RadioTap, sniff
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")

ATTACK_SIGNATURES = {
    "deauth_flood": {"desc": "Mass deauthentication frames targeting clients",
                     "threshold": 10, "defense": "Use 802.11w (PMF)"},
    "evil_twin": {"desc": "Rogue AP impersonating a legitimate network",
                  "defense": "Verify BSSID, use certificate-based auth"},
    "beacon_flood": {"desc": "Flooding airspace with fake SSIDs",
                     "defense": "Client-side SSID filtering"},
    "eapol_replay": {"desc": "Replayed EAPOL frames for key cracking",
                     "defense": "Strong WPA2/WPA3 passphrase"},
}


class AttackDefenseMonitor:
    """Monitor and classify WiFi attack patterns in real time."""

    def __init__(self, interface):
        self.interface = interface
        self.deauth_count = defaultdict(int)
        self.ssid_to_bssids = defaultdict(set)
        self.eapol_frames = []
        self.beacon_sources = defaultdict(int)
        self.detections = []

    def handle_packet(self, pkt):
        if not pkt.haslayer(Dot11):
            return
        now = time.time()

        # Deauth detection
        if pkt.haslayer(Dot11Deauth):
            src = pkt[Dot11].addr2 or "unknown"
            self.deauth_count[src] += 1
            if self.deauth_count[src] == ATTACK_SIGNATURES["deauth_flood"]["threshold"]:
                self.detections.append({
                    "time": now, "attack": "deauth_flood",
                    "source": src,
                    "defense": ATTACK_SIGNATURES["deauth_flood"]["defense"],
                })

        # Evil twin detection
        if pkt.haslayer(Dot11Beacon):
            bssid = pkt[Dot11].addr2
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
            if ssid:
                self.ssid_to_bssids[ssid].add(bssid)
                if len(self.ssid_to_bssids[ssid]) > 1:
                    self.detections.append({
                        "time": now, "attack": "evil_twin",
                        "ssid": ssid,
                        "bssids": list(self.ssid_to_bssids[ssid]),
                        "defense": ATTACK_SIGNATURES["evil_twin"]["defense"],
                    })
            self.beacon_sources[bssid] += 1

        # EAPOL capture
        if pkt.haslayer(EAPOL):
            self.eapol_frames.append({
                "time": now,
                "src": pkt[Dot11].addr2 if pkt.haslayer(Dot11) else "unknown",
            })

    def monitor(self, duration=60):
        print(f"[*] Attack-Defense monitoring on {self.interface} for {duration}s")
        sniff(iface=self.interface, prn=self.handle_packet,
              timeout=duration, store=False)
        return self.get_report()

    def get_report(self):
        # Check for beacon flood
        suspicious_sources = {mac: cnt for mac, cnt in self.beacon_sources.items()
                              if cnt > 100}
        unique_attacks = set(d["attack"] for d in self.detections)

        return {
            "duration_sec": 60,
            "attacks_detected": len(self.detections),
            "attack_types": list(unique_attacks),
            "detections": self.detections[-50:],
            "deauth_sources": dict(sorted(self.deauth_count.items(),
                                          key=lambda x: x[1], reverse=True)[:10]),
            "eapol_frames_seen": len(self.eapol_frames),
            "suspicious_beacon_sources": suspicious_sources,
            "defense_recommendations": [
                ATTACK_SIGNATURES[a]["defense"] for a in unique_attacks
                if a in ATTACK_SIGNATURES
            ],
        }


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def get_attack_info(attack_name):
    """Return educational info about an attack type."""
    return ATTACK_SIGNATURES.get(attack_name, {"desc": "Unknown", "defense": "Unknown"})


def export_report(report, path="attack_defense_report.json"):
    with open(path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"[+] Report exported to {path}")


if __name__ == "__main__":
    print("WiFi Attack-Defense Tool — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 60
        monitor = AttackDefenseMonitor(iface)
        report = monitor.monitor(dur)
        export_report(report)
