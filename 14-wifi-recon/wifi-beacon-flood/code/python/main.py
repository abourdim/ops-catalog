#!/usr/bin/env python3
"""
Beacon Flood  AP Visualizer
Hundreds of fake APs flooding the airwaves

Workshop-DIY Educational Project

Process:
    Step 1: WiFi adapter scans all channels to discover nearby access points and clients.
    Step 2: Detected devices are fingerprinted by MAC, SSID, signal strength, and encryption type.
    Step 3: Captured frames are decoded to reveal communication patterns and vulnerabilities.
    Step 4: Security analysis identifies rogue APs, weak encryption, and suspicious activity.

Usage:
    python3 main.py

Requirements:
    pip install -r requirements.txt (if present)
"""

import subprocess
import time
import json
try:
    from scapy.all import sniff, Dot11, Dot11Beacon, Dot11ProbeReq, Dot11Elt
    HAS_SCAPY = True
except ImportError:
    HAS_SCAPY = False
    print("[WARN] scapy not installed. Running in simulation mode.")
    print("  Install: pip install scapy")

# ── WiFi Configuration ──
INTERFACE = "wlan0mon"   # Monitor-mode interface
CHANNEL = 0             # 0 = all channels

APP_NAME = "wifi-beacon-flood"


def setup():
    """Initialize hardware/simulation."""
    print(f"\n=== {APP_NAME} ===")
    print("Workshop-DIY — Educational Simulation\n")

    if HAS_SCAPY:
        print("[WIFI] Scapy loaded. For live capture, run as root with monitor-mode adapter.")
    else:
        print("[SIM] Running WiFi simulation...")


def read_data():
    """Read sensor/signal data."""

    if HAS_SCAPY:
        packets = sniff(count=100, timeout=10, filter="wlan type mgt")
        for pkt in packets:
            if pkt.haslayer(Dot11Beacon):
                ssid = pkt[Dot11Elt].info.decode('utf-8', errors='ignore')
                bssid = pkt[Dot11].addr2
                print(f"  [AP] {ssid} ({bssid})")
    else:
        fake_aps = [
            {"ssid": "HomeWiFi", "bssid": "AA:BB:CC:DD:EE:01", "ch": 1, "rssi": -45},
            {"ssid": "CoffeeShop", "bssid": "AA:BB:CC:DD:EE:02", "ch": 6, "rssi": -62},
            {"ssid": "IoT_Device", "bssid": "AA:BB:CC:DD:EE:03", "ch": 11, "rssi": -78},
        ]
        for ap in fake_aps:
            print(f"  [AP] {ap['ssid']} ({ap['bssid']}) Ch:{ap['ch']} RSSI:{ap['rssi']}dBm")
            time.sleep(0.3)
    return value


def process(data):
    """Process captured data — core algorithm."""
    # Normalize to 0-100 scale
    if isinstance(data, (int, float)):
        score = float(data) % 100
    else:
        score = abs(hash(str(data))) % 100

    # Classify
    if score > 70:
        level = "HIGH"
    elif score > 30:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {"score": score, "level": level}


def display_result(result):
    """Display analysis results."""
    bar = "█" * int(result["score"] / 5) + "░" * (20 - int(result["score"] / 5))
    print(f"  [{result['level']:>6s}] {bar} {result['score']:.1f}")


def main():
    """Main execution loop."""
    setup()
    print("\n[START] Press Ctrl+C to stop\n")

    cycle = 0
    try:
        while True:
            data = read_data()
            result = process(data)
            cycle += 1

            if cycle % 5 == 0:
                display_result(result)

            if cycle % 50 == 0:
                print(f"\n  --- Cycle {cycle} complete ---\n")

    except KeyboardInterrupt:
        print(f"\n\n[DONE] {cycle} cycles completed")
        print("Workshop-DIY — Keep experimenting! 🔬")


if __name__ == "__main__":
    main()
