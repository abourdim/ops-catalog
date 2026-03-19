#!/usr/bin/env python3
"""WiFi Client Fingerprinter — identifies devices by probe requests and frame signatures."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import (
        Dot11, Dot11ProbeReq, Dot11Elt, RadioTap, sniff
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")

# Common OUI prefixes for vendor identification
OUI_DATABASE = {
    "00:50:f2": "Microsoft", "00:1a:11": "Google", "ac:de:48": "Apple",
    "3c:22:fb": "Apple", "dc:a6:32": "Raspberry Pi", "b8:27:eb": "Raspberry Pi",
    "f4:f5:d8": "Google", "44:07:0b": "Google", "00:0c:29": "VMware",
    "00:1b:63": "Apple", "48:d7:05": "Apple", "a4:83:e7": "Apple",
}


def lookup_vendor(mac):
    """Resolve vendor from the MAC OUI prefix."""
    prefix = mac[:8].lower()
    return OUI_DATABASE.get(prefix, "Unknown")


def capture_probes(interface, duration=30):
    """Capture probe request frames and fingerprint clients."""
    clients = defaultdict(lambda: {"probes": set(), "count": 0,
                                    "first_seen": None, "last_seen": None,
                                    "signal_samples": []})

    def handler(pkt):
        if pkt.haslayer(Dot11ProbeReq):
            mac = pkt[Dot11].addr2
            if mac is None:
                return
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else "<broadcast>"
            now = time.time()
            entry = clients[mac]
            entry["probes"].add(ssid)
            entry["count"] += 1
            entry["last_seen"] = now
            if entry["first_seen"] is None:
                entry["first_seen"] = now
            if hasattr(pkt, "dBm_AntSignal"):
                entry["signal_samples"].append(pkt.dBm_AntSignal)

    print(f"[*] Sniffing probes for {duration}s on {interface}")
    sniff(iface=interface, prn=handler, timeout=duration, store=False)
    return clients


def build_fingerprints(clients):
    """Create device fingerprints from captured probe data."""
    fingerprints = []
    for mac, data in clients.items():
        vendor = lookup_vendor(mac)
        avg_signal = (sum(data["signal_samples"]) / len(data["signal_samples"])
                      if data["signal_samples"] else -99)
        fp = {
            "mac": mac,
            "vendor": vendor,
            "probed_ssids": sorted(data["probes"]),
            "probe_count": data["count"],
            "avg_signal_dbm": round(avg_signal, 1),
            "duration_seen": round(data["last_seen"] - data["first_seen"], 1)
            if data["first_seen"] and data["last_seen"] else 0,
        }
        fingerprints.append(fp)
    return sorted(fingerprints, key=lambda x: x["probe_count"], reverse=True)


def classify_device(fingerprint):
    """Heuristic device classification based on probe behavior."""
    probes = len(fingerprint["probed_ssids"])
    vendor = fingerprint["vendor"]
    if vendor in ("Apple",):
        return "iOS/macOS"
    if vendor == "Google":
        return "Android/ChromeOS"
    if vendor == "Raspberry Pi":
        return "IoT/Embedded"
    if probes > 10:
        return "Roaming laptop"
    if probes <= 2:
        return "Stationary/IoT"
    return "General"


def export_fingerprints(fingerprints, path="fingerprints.json"):
    """Export fingerprints for the web dashboard."""
    for fp in fingerprints:
        fp["device_class"] = classify_device(fp)
    with open(path, "w") as f:
        json.dump(fingerprints, f, indent=2, default=list)
    print(f"[+] Exported {len(fingerprints)} fingerprints to {path}")


def get_client_summary(fingerprints):
    """Return a quick summary dict."""
    vendors = defaultdict(int)
    for fp in fingerprints:
        vendors[fp["vendor"]] += 1
    return {
        "total_clients": len(fingerprints),
        "vendor_breakdown": dict(vendors),
        "top_prober": fingerprints[0]["mac"] if fingerprints else None,
    }


if __name__ == "__main__":
    print("WiFi Client Fingerprinter — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 30
        clients = capture_probes(iface, dur)
        fps = build_fingerprints(clients)
        export_fingerprints(fps)
        print(json.dumps(get_client_summary(fps), indent=2))
