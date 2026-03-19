#!/usr/bin/env python3
"""Agent Onboarding Kit Setup — initializes training equipment for new agents."""

import subprocess
import sys
import json
import time
import os

COMPONENTS = {
    "rtl_sdr": {"type": "sdr", "check": "rtl_test -t", "desc": "Training SDR receiver"},
    "wifi_adapter": {"type": "wifi", "device": "wlan1", "desc": "WiFi training adapter"},
    "esp32": {"type": "serial", "device": "/dev/ttyUSB0", "baud": 115200,
              "desc": "ESP32 training beacon"},
    "headphones": {"type": "audio", "device": "hw:1,0", "desc": "Audio monitoring"},
}

WIRING = """
=== Agent Onboarding Kit ===

[Training Laptop] --- USB Hub ---+--- RTL-SDR (receive training)
                                 +--- WiFi Adapter (network exercises)
                                 +--- ESP32 (beacon/target device)

ESP32 Training Beacon:
  - GPIO 2  -> LED (status)
  - GPIO 4  -> Buzzer (found indicator)
  - USB power and serial data

All connections are USB — no soldering required for onboarding kit.
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
    else:
        result["status"] = "ok"
    return result


def training_modules():
    return [
        {"id": 1, "name": "RF Basics", "hardware": ["rtl_sdr"],
         "duration_min": 30, "difficulty": "beginner"},
        {"id": 2, "name": "WiFi Fundamentals", "hardware": ["wifi_adapter"],
         "duration_min": 45, "difficulty": "beginner"},
        {"id": 3, "name": "Signal Hunting", "hardware": ["rtl_sdr", "esp32"],
         "duration_min": 60, "difficulty": "intermediate"},
        {"id": 4, "name": "Network Recon", "hardware": ["wifi_adapter"],
         "duration_min": 45, "difficulty": "intermediate"},
    ]


def full_setup():
    print("=" * 50)
    print("  AGENT ONBOARDING — Kit Setup")
    print("=" * 50)
    print(WIRING)
    results = {}
    for name, config in COMPONENTS.items():
        status = check_component(name, config)
        results[name] = status
        icon = "[OK]" if status["status"] == "ok" else "[!!]"
        print(f"  {icon} {name}: {status['status']}")
    return {"components": results, "training_modules": training_modules(),
            "timestamp": time.time()}


def export_setup(data, path="onboarding_setup.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\n[+] Setup exported to {path}")


if __name__ == "__main__":
    data = full_setup()
    export_setup(data)
