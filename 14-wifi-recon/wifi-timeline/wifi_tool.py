#!/usr/bin/env python3
"""WiFi Timeline — records AP and client activity over time for temporal analysis."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import Dot11, Dot11Beacon, Dot11ProbeReq, Dot11Elt, sniff
except ImportError:
    sys.exit("scapy required: pip install scapy")


class WiFiTimeline:
    """Build a chronological timeline of all WiFi activity."""

    def __init__(self, interface, bucket_size=5):
        self.interface = interface
        self.bucket_size = bucket_size  # seconds per time bucket
        self.events = []
        self.ap_timeline = defaultdict(list)
        self.client_timeline = defaultdict(list)
        self.start_time = None

    def handle_packet(self, pkt):
        if not pkt.haslayer(Dot11):
            return
        now = time.time()
        if self.start_time is None:
            self.start_time = now

        dot11 = pkt[Dot11]
        signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
        bucket = int((now - self.start_time) / self.bucket_size)

        if pkt.haslayer(Dot11Beacon):
            bssid = dot11.addr2
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
            self.ap_timeline[bssid].append({
                "bucket": bucket, "time": now, "signal": signal, "ssid": ssid
            })
            self.events.append({
                "type": "beacon", "time": now, "bucket": bucket,
                "mac": bssid, "ssid": ssid, "signal": signal
            })

        elif pkt.haslayer(Dot11ProbeReq):
            client = dot11.addr2
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
            self.client_timeline[client].append({
                "bucket": bucket, "time": now, "signal": signal, "ssid": ssid
            })
            self.events.append({
                "type": "probe", "time": now, "bucket": bucket,
                "mac": client, "ssid": ssid, "signal": signal
            })

    def record(self, duration=120):
        print(f"[*] Recording timeline on {self.interface} for {duration}s "
              f"(bucket={self.bucket_size}s)")
        sniff(iface=self.interface, prn=self.handle_packet,
              timeout=duration, store=False)
        return self.get_timeline()

    def get_timeline(self):
        total_buckets = max((e["bucket"] for e in self.events), default=0) + 1
        bucket_counts = [0] * total_buckets
        for e in self.events:
            bucket_counts[e["bucket"]] += 1

        ap_summary = {}
        for bssid, entries in self.ap_timeline.items():
            buckets = sorted(set(e["bucket"] for e in entries))
            ap_summary[bssid] = {
                "ssid": entries[-1]["ssid"] if entries else "",
                "active_buckets": len(buckets),
                "total_beacons": len(entries),
                "first_bucket": buckets[0] if buckets else 0,
                "last_bucket": buckets[-1] if buckets else 0,
            }

        client_summary = {}
        for mac, entries in self.client_timeline.items():
            buckets = sorted(set(e["bucket"] for e in entries))
            client_summary[mac] = {
                "active_buckets": len(buckets),
                "total_probes": len(entries),
                "ssids_probed": list(set(e["ssid"] for e in entries if e["ssid"])),
            }

        return {
            "total_events": len(self.events),
            "total_buckets": total_buckets,
            "bucket_size_sec": self.bucket_size,
            "activity_per_bucket": bucket_counts,
            "unique_aps": len(self.ap_timeline),
            "unique_clients": len(self.client_timeline),
            "ap_summary": ap_summary,
            "client_summary": client_summary,
        }


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_timeline(data, path="wifi_timeline.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[+] Timeline exported to {path}")


if __name__ == "__main__":
    print("WiFi Timeline — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 120
        tl = WiFiTimeline(iface)
        data = tl.record(dur)
        export_timeline(data)
