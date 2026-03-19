#!/usr/bin/env python3
"""WiFi Evil Twin Spotter — detects rogue APs impersonating legitimate networks."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import Dot11, Dot11Beacon, Dot11Elt, RadioTap, sniff
except ImportError:
    sys.exit("scapy required: pip install scapy")


class EvilTwinDetector:
    """Detect duplicate SSIDs from different BSSIDs (potential evil twins)."""

    def __init__(self, interface):
        self.interface = interface
        self.ap_map = defaultdict(list)  # ssid -> list of bssid records
        self.alerts = []
        self.known_bssids = {}  # bssid -> {ssid, channel, signal, first_seen}

    def handle_beacon(self, pkt):
        if not pkt.haslayer(Dot11Beacon):
            return
        bssid = pkt[Dot11].addr2
        ssid_elt = pkt.getlayer(Dot11Elt)
        if not ssid_elt or not ssid_elt.info:
            return
        ssid = ssid_elt.info.decode(errors="replace")
        signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
        channel = self._extract_channel(pkt)

        record = {"bssid": bssid, "signal": signal, "channel": channel,
                  "time": time.time()}

        if bssid not in self.known_bssids:
            self.known_bssids[bssid] = {
                "ssid": ssid, "channel": channel,
                "signal": signal, "first_seen": time.time()
            }
            # Check for duplicate SSID from new BSSID
            existing = [r["bssid"] for r in self.ap_map[ssid]]
            if existing and bssid not in existing:
                self._raise_alert(ssid, bssid, existing, signal, channel)

        self.ap_map[ssid].append(record)

    def _extract_channel(self, pkt):
        elt = pkt.getlayer(Dot11Elt)
        while elt:
            if elt.ID == 3:  # DS Parameter Set
                return elt.info[0] if elt.info else 0
            elt = elt.payload.getlayer(Dot11Elt)
        return 0

    def _raise_alert(self, ssid, new_bssid, existing_bssids, signal, channel):
        alert = {
            "time": time.time(),
            "ssid": ssid,
            "suspect_bssid": new_bssid,
            "legitimate_bssids": existing_bssids[:5],
            "suspect_signal": signal,
            "suspect_channel": channel,
            "confidence": self._score_suspicion(ssid, new_bssid, signal),
        }
        self.alerts.append(alert)
        print(f"[!] EVIL TWIN? SSID='{ssid}' new BSSID={new_bssid} "
              f"(confidence: {alert['confidence']}%)")

    def _score_suspicion(self, ssid, bssid, signal):
        score = 50  # base score for duplicate SSID
        if signal > -40:
            score += 20  # very strong signal is suspicious
        if len(self.ap_map[ssid]) > 3:
            score -= 15  # many APs with same SSID might be enterprise
        return min(score, 100)

    def scan(self, duration=60):
        print(f"[*] Scanning for evil twins on {self.interface} for {duration}s")
        sniff(iface=self.interface, prn=self.handle_beacon,
              timeout=duration, store=False)
        return self.get_report()

    def get_report(self):
        twin_candidates = {ssid: records for ssid, records in self.ap_map.items()
                          if len(set(r["bssid"] for r in records)) > 1}
        return {
            "total_aps": len(self.known_bssids),
            "unique_ssids": len(self.ap_map),
            "twin_candidates": len(twin_candidates),
            "alerts": self.alerts,
            "candidate_ssids": list(twin_candidates.keys())[:20],
        }


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_report(report, path="evil_twin_report.json"):
    with open(path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"[+] Report saved to {path}")


if __name__ == "__main__":
    print("WiFi Evil Twin Spotter — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 60
        detector = EvilTwinDetector(iface)
        report = detector.scan(dur)
        export_report(report)
