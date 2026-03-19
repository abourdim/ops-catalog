#!/usr/bin/env python3
"""WiFi Deauth Detector — monitors for deauthentication/disassociation attacks."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import Dot11, Dot11Deauth, Dot11Disas, RadioTap, sniff
except ImportError:
    sys.exit("scapy required: pip install scapy")

DEAUTH_THRESHOLD = 10  # frames per second to trigger alert
ALERT_WINDOW = 5       # seconds


class DeauthMonitor:
    """Continuous deauth frame monitor with alerting."""

    def __init__(self, interface, threshold=DEAUTH_THRESHOLD):
        self.interface = interface
        self.threshold = threshold
        self.events = []
        self.alerts = []
        self.attacker_stats = defaultdict(int)

    def handle_packet(self, pkt):
        if pkt.haslayer(Dot11Deauth) or pkt.haslayer(Dot11Disas):
            frame_type = "deauth" if pkt.haslayer(Dot11Deauth) else "disassoc"
            src = pkt[Dot11].addr2 or "unknown"
            dst = pkt[Dot11].addr1 or "unknown"
            bssid = pkt[Dot11].addr3 or "unknown"
            reason = (pkt[Dot11Deauth].reason if pkt.haslayer(Dot11Deauth)
                      else pkt[Dot11Disas].reason)
            signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
            event = {
                "time": time.time(), "type": frame_type,
                "src": src, "dst": dst, "bssid": bssid,
                "reason": reason, "signal": signal,
            }
            self.events.append(event)
            self.attacker_stats[src] += 1
            self._check_alert()

    def _check_alert(self):
        now = time.time()
        recent = [e for e in self.events if now - e["time"] < ALERT_WINDOW]
        rate = len(recent) / ALERT_WINDOW
        if rate >= self.threshold:
            alert = {
                "time": now, "rate": round(rate, 1),
                "top_source": max(self.attacker_stats,
                                  key=self.attacker_stats.get),
                "frame_count": len(recent),
            }
            self.alerts.append(alert)
            print(f"[!] ALERT: {rate:.1f} deauth/s — possible attack from "
                  f"{alert['top_source']}")

    def start(self, duration=60):
        print(f"[*] Monitoring deauth frames on {self.interface} "
              f"for {duration}s (threshold={self.threshold}/s)")
        sniff(iface=self.interface, prn=self.handle_packet,
              timeout=duration, store=False)
        return self.get_report()

    def get_report(self):
        return {
            "total_deauth_frames": len(self.events),
            "alerts_triggered": len(self.alerts),
            "unique_attackers": len(self.attacker_stats),
            "top_attackers": dict(sorted(self.attacker_stats.items(),
                                         key=lambda x: x[1], reverse=True)[:10]),
            "events": self.events[-100:],
        }


def set_monitor_mode(interface):
    """Enable monitor mode."""
    subprocess.run(["airmon-ng", "start", interface], capture_output=True)
    return f"{interface}mon"


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def hop_channels(interface, channels, dwell=0.25):
    """Simple channel hopper."""
    for ch in channels:
        set_channel(interface, ch)
        time.sleep(dwell)


def export_report(report, path="deauth_report.json"):
    with open(path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"[+] Report saved to {path}")


if __name__ == "__main__":
    print("WiFi Deauth Detector — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 60
        mon = DeauthMonitor(iface)
        report = mon.start(dur)
        export_report(report)
