#!/usr/bin/env python3
"""WiFi 101 Lab — beginner-friendly WiFi scanning and frame identification tool."""

import subprocess
import sys
import time
import json

try:
    from scapy.all import (
        Dot11, Dot11Beacon, Dot11ProbeReq, Dot11Elt, RadioTap, sniff
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")

# Educational frame type descriptions
FRAME_INFO = {
    "beacon": "Beacon frames are broadcast by APs every ~100ms to announce the network",
    "probe_req": "Probe requests are sent by clients looking for known networks",
    "probe_resp": "Probe responses are AP replies to client probe requests",
    "auth": "Authentication frames start the connection handshake",
    "deauth": "Deauthentication frames forcibly disconnect a client",
    "data": "Data frames carry the actual network payload",
}


def scan_networks(interface, duration=15):
    """Simple network scanner — the first WiFi exercise."""
    print(f"[*] Scanning for WiFi networks on {interface} for {duration}s...")
    networks = {}

    def handler(pkt):
        if pkt.haslayer(Dot11Beacon):
            bssid = pkt[Dot11].addr2
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else "<hidden>"
            signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
            channel = _get_channel(pkt)
            networks[bssid] = {
                "ssid": ssid, "bssid": bssid, "signal": signal,
                "channel": channel,
            }

    sniff(iface=interface, prn=handler, timeout=duration, store=False)
    return list(networks.values())


def count_frame_types(interface, duration=10):
    """Count different 802.11 frame types — teaches frame classification."""
    counts = {"management": 0, "control": 0, "data": 0}
    subtypes = {}

    def handler(pkt):
        if pkt.haslayer(Dot11):
            ftype = pkt[Dot11].type
            subtype = pkt[Dot11].subtype
            if ftype == 0:
                counts["management"] += 1
            elif ftype == 1:
                counts["control"] += 1
            elif ftype == 2:
                counts["data"] += 1
            key = f"type{ftype}_sub{subtype}"
            subtypes[key] = subtypes.get(key, 0) + 1

    print(f"[*] Counting frame types for {duration}s...")
    sniff(iface=interface, prn=handler, timeout=duration, store=False)
    total = sum(counts.values())
    return {
        "total_frames": total,
        "categories": counts,
        "percentages": {k: round(v / max(total, 1) * 100, 1) for k, v in counts.items()},
        "subtypes": subtypes,
    }


def find_clients(interface, duration=15):
    """Discover client devices by their probe requests."""
    clients = {}

    def handler(pkt):
        if pkt.haslayer(Dot11ProbeReq):
            mac = pkt[Dot11].addr2
            if mac and mac not in clients:
                ssid_elt = pkt.getlayer(Dot11Elt)
                ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
                clients[mac] = {"mac": mac, "looking_for": ssid}

    print(f"[*] Finding client devices for {duration}s...")
    sniff(iface=interface, prn=handler, timeout=duration, store=False)
    return list(clients.values())


def measure_signal_strength(interface, target_bssid, duration=10):
    """Measure signal strength over time for a specific AP."""
    samples = []

    def handler(pkt):
        if pkt.haslayer(Dot11Beacon) and pkt[Dot11].addr2 == target_bssid:
            sig = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
            samples.append({"time": time.time(), "signal": sig})

    sniff(iface=interface, prn=handler, timeout=duration, store=False)
    if samples:
        signals = [s["signal"] for s in samples]
        return {
            "bssid": target_bssid, "samples": len(samples),
            "avg_signal": round(sum(signals) / len(signals), 1),
            "best": max(signals), "worst": min(signals),
        }
    return {"bssid": target_bssid, "samples": 0}


def _get_channel(pkt):
    elt = pkt.getlayer(Dot11Elt)
    while elt:
        if elt.ID == 3 and elt.info:
            return elt.info[0]
        elt = elt.payload.getlayer(Dot11Elt) if hasattr(elt.payload, "getlayer") else None
    return 0


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def check_interface(interface):
    """Check if interface is in monitor mode."""
    result = subprocess.run(["iwconfig", interface], capture_output=True, text=True)
    return "Monitor" in result.stdout


def export_results(data, path="wifi101_results.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[+] Results saved to {path}")


if __name__ == "__main__":
    print("WiFi 101 Lab Tool — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [scan|frames|clients]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        mode = sys.argv[2] if len(sys.argv) > 2 else "scan"
        if mode == "scan":
            nets = scan_networks(iface)
            print(f"[+] Found {len(nets)} networks")
            export_results(nets)
        elif mode == "frames":
            data = count_frame_types(iface)
            print(json.dumps(data, indent=2))
        elif mode == "clients":
            cls = find_clients(iface)
            print(f"[+] Found {len(cls)} clients")
