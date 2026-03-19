#!/usr/bin/env python3
"""WiFi Probe Tracker — tracks device movement via probe request patterns."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import Dot11, Dot11ProbeReq, Dot11Elt, sniff
except ImportError:
    sys.exit("scapy required: pip install scapy")


class ProbeTracker:
    """Track devices by their probe request emissions over time."""

    def __init__(self, interface):
        self.interface = interface
        self.devices = defaultdict(lambda: {
            "probes": [], "signal_history": [],
            "first_seen": None, "last_seen": None, "ssids": set()
        })

    def handle_packet(self, pkt):
        if not pkt.haslayer(Dot11ProbeReq):
            return
        mac = pkt[Dot11].addr2
        if not mac:
            return
        now = time.time()
        ssid_elt = pkt.getlayer(Dot11Elt)
        ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
        signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99

        dev = self.devices[mac]
        dev["probes"].append({"ssid": ssid, "signal": signal, "time": now})
        dev["signal_history"].append((now, signal))
        dev["last_seen"] = now
        if ssid:
            dev["ssids"].add(ssid)
        if dev["first_seen"] is None:
            dev["first_seen"] = now

    def track(self, duration=120):
        print(f"[*] Tracking probes on {self.interface} for {duration}s")
        sniff(iface=self.interface, prn=self.handle_packet,
              timeout=duration, store=False)
        return self.get_tracking_data()

    def get_tracking_data(self):
        results = []
        for mac, dev in self.devices.items():
            if not dev["signal_history"]:
                continue
            signals = [s for _, s in dev["signal_history"]]
            results.append({
                "mac": mac,
                "ssids": sorted(dev["ssids"]),
                "probe_count": len(dev["probes"]),
                "first_seen": dev["first_seen"],
                "last_seen": dev["last_seen"],
                "duration": round(dev["last_seen"] - dev["first_seen"], 1),
                "avg_signal": round(sum(signals) / len(signals), 1),
                "min_signal": min(signals),
                "max_signal": max(signals),
                "movement": self._detect_movement(dev["signal_history"]),
            })
        return sorted(results, key=lambda x: x["probe_count"], reverse=True)

    def _detect_movement(self, signal_history):
        """Detect movement based on signal variation."""
        if len(signal_history) < 5:
            return "insufficient_data"
        signals = [s for _, s in signal_history]
        variance = sum((s - sum(signals) / len(signals)) ** 2
                       for s in signals) / len(signals)
        if variance > 100:
            return "moving"
        elif variance > 25:
            return "slight_movement"
        return "stationary"

    def get_presence_timeline(self, mac, interval=10):
        """Build a presence timeline for a specific device."""
        dev = self.devices.get(mac)
        if not dev or not dev["signal_history"]:
            return []
        timeline = []
        start = dev["first_seen"]
        end = dev["last_seen"]
        t = start
        while t <= end:
            nearby = [s for ts, s in dev["signal_history"]
                      if abs(ts - t) < interval]
            avg = sum(nearby) / len(nearby) if nearby else None
            timeline.append({"time": t, "signal": avg, "present": avg is not None})
            t += interval
        return timeline


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_tracking(data, path="probe_tracking.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2, default=list)
    print(f"[+] Tracking data exported to {path}")


if __name__ == "__main__":
    print("WiFi Probe Tracker — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 120
        tracker = ProbeTracker(iface)
        data = tracker.track(dur)
        export_tracking(data)
        print(f"[+] Tracked {len(data)} devices")
