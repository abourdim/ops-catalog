#!/usr/bin/env python3
"""ESP Mesh vs Traditional — compares ESP-MESH network to standard WiFi performance."""

import subprocess
import sys
import time
import json
import statistics
from collections import defaultdict

try:
    from scapy.all import (
        Dot11, Dot11Beacon, Dot11Elt, sniff, IP, ICMP, sr1
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")


class MeshComparator:
    """Compare ESP-MESH and traditional WiFi network characteristics."""

    def __init__(self, interface):
        self.interface = interface
        self.mesh_aps = {}       # bssid -> {ssid, signal_samples, channel}
        self.traditional_aps = {}

    def scan_both(self, duration=30, mesh_ssid_prefix="ESP-MESH"):
        """Scan and categorize networks as mesh or traditional."""
        print(f"[*] Scanning mesh vs traditional: {duration}s")

        def handler(pkt):
            if not pkt.haslayer(Dot11Beacon):
                return
            bssid = pkt[Dot11].addr2
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
            signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
            channel = self._get_channel(pkt)

            target = self.mesh_aps if mesh_ssid_prefix.lower() in ssid.lower() else self.traditional_aps
            if bssid not in target:
                target[bssid] = {"ssid": ssid, "signals": [], "channel": channel}
            target[bssid]["signals"].append(signal)

        channels = list(range(1, 14))
        per_ch = max(duration / len(channels), 0.5)
        for ch in channels:
            set_channel(self.interface, ch)
            sniff(iface=self.interface, prn=handler, timeout=per_ch, store=False)

    def _get_channel(self, pkt):
        elt = pkt.getlayer(Dot11Elt)
        while elt:
            if elt.ID == 3 and elt.info:
                return elt.info[0]
            elt = elt.payload.getlayer(Dot11Elt) if hasattr(elt.payload, "getlayer") else None
        return 0

    def compare(self):
        """Generate comparison statistics."""
        mesh_stats = self._compute_stats(self.mesh_aps, "mesh")
        trad_stats = self._compute_stats(self.traditional_aps, "traditional")
        return {
            "mesh": mesh_stats,
            "traditional": trad_stats,
            "comparison": self._side_by_side(mesh_stats, trad_stats),
        }

    def _compute_stats(self, aps, label):
        if not aps:
            return {"type": label, "ap_count": 0}
        all_signals = []
        channels_used = set()
        for bssid, info in aps.items():
            all_signals.extend(info["signals"])
            channels_used.add(info["channel"])
        return {
            "type": label,
            "ap_count": len(aps),
            "channels_used": sorted(channels_used),
            "avg_signal": round(statistics.mean(all_signals), 1) if all_signals else -99,
            "signal_spread": round(statistics.stdev(all_signals), 1) if len(all_signals) > 1 else 0,
            "best_signal": max(all_signals) if all_signals else -99,
            "worst_signal": min(all_signals) if all_signals else -99,
            "total_beacons": len(all_signals),
        }

    def _side_by_side(self, mesh, trad):
        comparison = {}
        if mesh["ap_count"] > 0 and trad["ap_count"] > 0:
            comparison["coverage_advantage"] = (
                "mesh" if mesh.get("avg_signal", -99) > trad.get("avg_signal", -99)
                else "traditional"
            )
            comparison["redundancy"] = (
                "mesh" if mesh["ap_count"] > trad["ap_count"]
                else "traditional"
            )
            comparison["signal_consistency"] = (
                "mesh" if mesh.get("signal_spread", 99) < trad.get("signal_spread", 99)
                else "traditional"
            )
        return comparison


def ping_test(target_ip, count=10):
    """Measure latency to a target via ICMP ping."""
    results = []
    for _ in range(count):
        start = time.time()
        result = subprocess.run(
            ["ping", "-c", "1", "-W", "1", target_ip],
            capture_output=True, text=True)
        elapsed = (time.time() - start) * 1000
        if result.returncode == 0:
            results.append(round(elapsed, 1))
    if results:
        return {
            "target": target_ip, "success_rate": len(results) / count * 100,
            "avg_ms": round(statistics.mean(results), 1),
            "min_ms": min(results), "max_ms": max(results),
        }
    return {"target": target_ip, "success_rate": 0}


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_comparison(data, path="mesh_comparison.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[+] Comparison exported to {path}")


if __name__ == "__main__":
    print("ESP Mesh vs Traditional — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 30
        comp = MeshComparator(iface)
        comp.scan_both(dur)
        results = comp.compare()
        export_comparison(results)
