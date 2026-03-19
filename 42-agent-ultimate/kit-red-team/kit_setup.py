#!/usr/bin/env python3
"""Red Team Kit Setup — initializes offensive security testing hardware suite."""

import subprocess
import sys
import json
import time
import os

COMPONENTS = {
    "hackrf": {"type": "sdr", "check": "hackrf_info", "desc": "HackRF (RF attacks)"},
    "wifi_adapter": {"type": "wifi", "device": "wlan1", "desc": "WiFi attack adapter"},
    "esp32_evil_twin": {"type": "serial", "device": "/dev/ttyUSB0", "baud": 115200,
                        "desc": "ESP32 evil twin / rogue AP"},
    "rubber_ducky": {"type": "hid", "desc": "USB HID attack device"},
    "lan_tap": {"type": "interface", "device": "eth1",
                "desc": "Throwing star LAN tap"},
    "bluetooth_adapter": {"type": "bluetooth", "desc": "BLE attack adapter"},
    "pineapple_mark7": {"type": "wifi", "device": "wlan2",
                        "desc": "WiFi Pineapple (optional)"},
}

WIRING = """
=== Red Team Attack Kit ===

[Attack Laptop] --- USB Hub ---+--- HackRF One (RF replay, jamming detect)
                               +--- WiFi Adapter (deauth, capture, inject)
                               +--- ESP32 Evil Twin (rogue AP)
                               +--- LAN Tap (passive network capture)
                               +--- BLE Adapter (BLE attacks)

ESP32 Evil Twin:
  - Runs captive portal for credential harvesting
  - GPIO 2 -> Status LED
  - Auto-starts AP on power-up
  - Logs stored on SPIFFS

Attack Phases:
  1. Reconnaissance (passive scanning)
  2. WiFi attacks (deauth + evil twin)
  3. Network pivot (LAN tap + ARP)
  4. RF exploitation (replay/relay)
  5. BLE attacks (tracking, sniffing)
"""


def check_component(name, config):
    result = {"name": name, "status": "unknown", "description": config.get("desc", "")}
    if config["type"] == "sdr":
        try:
            proc = subprocess.run(config["check"].split(),
                                  capture_output=True, text=True, timeout=5)
            result["status"] = "ok" if proc.returncode == 0 else "error"
        except (subprocess.TimeoutExpired, FileNotFoundError):
            result["status"] = "not_found"
    elif config["type"] == "wifi":
        try:
            proc = subprocess.run(["iwconfig", config["device"]],
                                  capture_output=True, text=True, timeout=3)
            result["status"] = "ok" if proc.returncode == 0 else "error"
        except FileNotFoundError:
            result["status"] = "not_found"
    elif config["type"] == "serial":
        result["status"] = "ok" if os.path.exists(config["device"]) else "not_connected"
    elif config["type"] == "interface":
        try:
            proc = subprocess.run(["ip", "link", "show", config["device"]],
                                  capture_output=True, text=True, timeout=3)
            result["status"] = "ok" if proc.returncode == 0 else "not_found"
        except FileNotFoundError:
            result["status"] = "error"
    elif config["type"] == "bluetooth":
        try:
            proc = subprocess.run(["hciconfig"], capture_output=True, text=True, timeout=3)
            result["status"] = "ok" if "UP RUNNING" in proc.stdout else "down"
        except FileNotFoundError:
            result["status"] = "not_found"
    else:
        result["status"] = "manual_check"
    return result


def attack_playbook():
    return [
        {"id": 1, "name": "WiFi Recon", "tools": ["wifi_adapter"],
         "commands": ["airodump-ng", "wash"]},
        {"id": 2, "name": "Deauth + Handshake", "tools": ["wifi_adapter"],
         "commands": ["aireplay-ng", "airodump-ng"]},
        {"id": 3, "name": "Evil Twin Deploy", "tools": ["esp32_evil_twin"],
         "commands": ["serial flash"]},
        {"id": 4, "name": "RF Replay", "tools": ["hackrf"],
         "commands": ["hackrf_transfer"]},
        {"id": 5, "name": "Network Sniff", "tools": ["lan_tap"],
         "commands": ["tcpdump", "wireshark"]},
    ]


def full_setup():
    print("=" * 50)
    print("  RED TEAM — Attack Kit Setup")
    print("=" * 50)
    print(WIRING)
    results = {}
    for name, config in COMPONENTS.items():
        status = check_component(name, config)
        results[name] = status
        icon = "[OK]" if status["status"] == "ok" else "[!!]"
        print(f"  {icon} {name}: {status['status']}")
    return {"components": results, "attack_playbook": attack_playbook(),
            "timestamp": time.time()}


def export_setup(data, path="red_team_setup.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\n[+] Setup exported to {path}")


if __name__ == "__main__":
    data = full_setup()
    export_setup(data)
