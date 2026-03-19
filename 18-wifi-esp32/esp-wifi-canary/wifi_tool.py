#!/usr/bin/env python3
"""ESP WiFi Canary Monitor — monitors ESP32 canary device alerts from the host side."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import (
        Dot11, Dot11Beacon, Dot11Deauth, Dot11ProbeReq,
        Dot11Elt, sniff
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")


class CanaryMonitor:
    """Monitor the RF environment around an ESP32 WiFi canary device."""

    def __init__(self, interface, canary_bssid=None):
        self.interface = interface
        self.canary_bssid = canary_bssid
        self.baseline_aps = {}
        self.current_aps = {}
        self.new_devices = []
        self.deauth_alerts = []
        self.signal_anomalies = []

    def establish_baseline(self, duration=20):
        """Capture the normal RF environment baseline."""
        print(f"[*] Establishing baseline: {duration}s")

        def handler(pkt):
            if pkt.haslayer(Dot11Beacon):
                bssid = pkt[Dot11].addr2
                ssid_elt = pkt.getlayer(Dot11Elt)
                ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
                sig = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
                self.baseline_aps[bssid] = {"ssid": ssid, "signal": sig}

        for ch in range(1, 14):
            set_channel(self.interface, ch)
            sniff(iface=self.interface, prn=handler,
                  timeout=duration / 13, store=False)
        print(f"[+] Baseline: {len(self.baseline_aps)} APs cataloged")

    def monitor(self, duration=120):
        """Monitor for changes from baseline — new APs, deauths, anomalies."""
        print(f"[*] Canary monitoring: {duration}s")

        def handler(pkt):
            now = time.time()
            if pkt.haslayer(Dot11Beacon):
                bssid = pkt[Dot11].addr2
                ssid_elt = pkt.getlayer(Dot11Elt)
                ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
                sig = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
                self.current_aps[bssid] = {"ssid": ssid, "signal": sig}

                if bssid not in self.baseline_aps:
                    self.new_devices.append({
                        "time": now, "bssid": bssid, "ssid": ssid,
                        "signal": sig, "alert": "new_ap",
                    })
                    print(f"[!] NEW AP: {ssid} ({bssid}) signal={sig}dBm")
                elif bssid in self.baseline_aps:
                    baseline_sig = self.baseline_aps[bssid]["signal"]
                    if abs(sig - baseline_sig) > 20:
                        self.signal_anomalies.append({
                            "time": now, "bssid": bssid,
                            "baseline_signal": baseline_sig,
                            "current_signal": sig,
                            "delta": sig - baseline_sig,
                        })

            if pkt.haslayer(Dot11Deauth):
                src = pkt[Dot11].addr2 or "unknown"
                dst = pkt[Dot11].addr1 or "unknown"
                self.deauth_alerts.append({
                    "time": now, "src": src, "dst": dst,
                    "alert": "deauth_detected",
                })
                # Check if canary itself is being targeted
                if self.canary_bssid and dst == self.canary_bssid:
                    print(f"[!!!] CANARY UNDER ATTACK from {src}")

        sniff(iface=self.interface, prn=handler, timeout=duration, store=False)
        return self.get_report()

    def get_report(self):
        disappeared = set(self.baseline_aps.keys()) - set(self.current_aps.keys())
        return {
            "baseline_aps": len(self.baseline_aps),
            "current_aps": len(self.current_aps),
            "new_aps_detected": len(self.new_devices),
            "disappeared_aps": list(disappeared),
            "deauth_alerts": len(self.deauth_alerts),
            "signal_anomalies": len(self.signal_anomalies),
            "alerts": {
                "new_devices": self.new_devices[-20:],
                "deauths": self.deauth_alerts[-20:],
                "signal_shifts": self.signal_anomalies[-20:],
            },
            "threat_level": self._assess_threat(),
        }

    def _assess_threat(self):
        score = 0
        score += len(self.new_devices) * 10
        score += len(self.deauth_alerts) * 5
        score += len(self.signal_anomalies) * 3
        if score > 50: return "HIGH"
        if score > 20: return "MEDIUM"
        if score > 5: return "LOW"
        return "CLEAR"


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_report(report, path="canary_report.json"):
    with open(path, "w") as f:
        json.dump(report, f, indent=2, default=list)
    print(f"[+] Report exported to {path}")


if __name__ == "__main__":
    print("ESP WiFi Canary Monitor — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [canary_bssid]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        cbssid = sys.argv[2] if len(sys.argv) > 2 else None
        mon = CanaryMonitor(iface, cbssid)
        mon.establish_baseline()
        report = mon.monitor(120)
        export_report(report)
