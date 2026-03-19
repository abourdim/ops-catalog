#!/usr/bin/env python3
"""Blue Team Kit Setup — initializes defensive monitoring and detection hardware."""

import subprocess
import sys
import json
import time
import os

COMPONENTS = {
    "wifi_monitor": {"type": "wifi", "device": "wlan1", "desc": "WiFi IDS sensor"},
    "rtl_sdr": {"type": "sdr", "check": "rtl_test -t", "desc": "RF spectrum monitor"},
    "esp32_canary": {"type": "serial", "device": "/dev/ttyUSB0", "baud": 115200,
                     "desc": "WiFi canary device"},
    "network_tap": {"type": "interface", "device": "eth1", "desc": "Network mirror port"},
    "syslog_server": {"type": "service", "check": "systemctl is-active rsyslog"},
}

WIRING = """
=== Blue Team Defense Kit ===

[Monitoring Station] --- USB Hub ---+--- WiFi Adapter (monitor mode IDS)
                                    +--- RTL-SDR (spectrum surveillance)
                                    +--- ESP32 Canary (WiFi honeypot)
                     --- Ethernet ---+--- Network Tap (traffic mirror)

ESP32 WiFi Canary:
  - Runs as open AP honeypot
  - Logs all connection attempts
  - GPIO 2 -> Alert LED
  - GPIO 4 -> Piezo alarm

Network Tap:
  - Mirror port from managed switch
  - Passive monitoring only
"""


def check_component(name, config):
    result = {"name": name, "status": "unknown", "description": config.get("desc", "")}
    if config["type"] == "wifi":
        try:
            proc = subprocess.run(["iwconfig", config["device"]],
                                  capture_output=True, text=True, timeout=3)
            result["status"] = "ok" if proc.returncode == 0 else "error"
        except FileNotFoundError:
            result["status"] = "not_found"
    elif config["type"] == "sdr":
        try:
            proc = subprocess.run(config["check"].split(),
                                  capture_output=True, text=True, timeout=5)
            result["status"] = "ok" if proc.returncode == 0 else "error"
        except (subprocess.TimeoutExpired, FileNotFoundError):
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
    elif config["type"] == "service":
        try:
            proc = subprocess.run(config["check"].split(),
                                  capture_output=True, text=True, timeout=3)
            result["status"] = "ok" if "active" in proc.stdout else "inactive"
        except FileNotFoundError:
            result["status"] = "not_found"
    return result


def detection_rules():
    return [
        {"rule": "deauth_flood", "threshold": "10 frames/sec", "action": "alert"},
        {"rule": "new_ap_detected", "threshold": "any", "action": "alert + log"},
        {"rule": "evil_twin", "threshold": "duplicate SSID", "action": "alert + block"},
        {"rule": "rogue_client", "threshold": "unknown MAC", "action": "log"},
        {"rule": "rf_anomaly", "threshold": ">-30 dBm wideband", "action": "alert"},
    ]


def full_setup():
    print("=" * 50)
    print("  BLUE TEAM — Defense Kit Setup")
    print("=" * 50)
    print(WIRING)
    results = {}
    for name, config in COMPONENTS.items():
        status = check_component(name, config)
        results[name] = status
        icon = "[OK]" if status["status"] == "ok" else "[!!]"
        print(f"  {icon} {name}: {status['status']}")
    return {"components": results, "detection_rules": detection_rules(),
            "timestamp": time.time()}


def export_setup(data, path="blue_team_setup.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\n[+] Setup exported to {path}")


if __name__ == "__main__":
    data = full_setup()
    export_setup(data)
