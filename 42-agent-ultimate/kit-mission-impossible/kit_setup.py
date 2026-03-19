#!/usr/bin/env python3
"""Mission Impossible Kit Setup — initializes advanced multi-domain operations hardware."""

import subprocess
import sys
import json
import time
import os

COMPONENTS = {
    "hackrf": {"type": "sdr", "check": "hackrf_info", "desc": "SDR transceiver"},
    "rtl_sdr": {"type": "sdr", "check": "rtl_test -t", "desc": "Wideband receiver"},
    "wifi_adapter": {"type": "wifi", "device": "wlan1", "desc": "Covert WiFi"},
    "esp32_implant": {"type": "serial", "device": "/dev/ttyUSB0", "baud": 115200,
                      "desc": "ESP32 drop device"},
    "gps": {"type": "serial", "device": "/dev/ttyACM0", "baud": 9600, "desc": "GPS"},
    "camera": {"type": "camera", "device": "/dev/video0", "desc": "Covert camera"},
    "lora_radio": {"type": "serial", "device": "/dev/ttyUSB1", "baud": 115200,
                   "desc": "LoRa exfil radio"},
    "nfc_reader": {"type": "serial", "device": "/dev/ttyUSB2", "baud": 115200,
                   "desc": "NFC/RFID cloner"},
}

WIRING = """
=== Mission Impossible Kit ===

[Ops Laptop] --- USB Hub (powered) ---+--- HackRF One
                                      +--- RTL-SDR
                                      +--- WiFi Adapter
                                      +--- ESP32 Implant
                                      +--- GPS Module
                                      +--- Camera
                                      +--- LoRa Radio
                                      +--- NFC Reader

ESP32 Drop Device:
  - Self-contained WiFi implant
  - GPIO 2 -> Status LED (disabled in stealth mode)
  - GPIO 15 -> Tamper detect (reed switch)
  - Battery: LiPo 2000mAh (48-72 hour runtime)

LoRa Exfiltration:
  - Long range (10km+) data relay
  - AES-256 encrypted bursts
  - Auto-sleep between transmissions

NFC/RFID Reader:
  - PN532 module
  - Badge cloning capability
  - 13.56 MHz (MIFARE, NTAG)
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
    elif config["type"] == "camera":
        result["status"] = "ok" if os.path.exists(config["device"]) else "not_connected"
    return result


def mission_phases():
    return [
        {"phase": "recon", "hardware": ["rtl_sdr", "wifi_adapter", "camera"],
         "description": "Initial surveillance and signal mapping"},
        {"phase": "access", "hardware": ["nfc_reader", "wifi_adapter"],
         "description": "Physical and network access"},
        {"phase": "implant", "hardware": ["esp32_implant"],
         "description": "Deploy persistent access device"},
        {"phase": "exfil", "hardware": ["lora_radio", "hackrf"],
         "description": "Extract data via covert channel"},
        {"phase": "cleanup", "hardware": ["esp32_implant"],
         "description": "Remote wipe and extraction"},
    ]


def full_setup():
    print("=" * 50)
    print("  MISSION IMPOSSIBLE — Ops Kit Setup")
    print("=" * 50)
    print(WIRING)
    results = {}
    ready = 0
    for name, config in COMPONENTS.items():
        status = check_component(name, config)
        results[name] = status
        icon = "[OK]" if status["status"] == "ok" else "[!!]"
        print(f"  {icon} {name}: {status['status']}")
        if status["status"] == "ok":
            ready += 1
    return {"components": results, "mission_phases": mission_phases(),
            "readiness": f"{ready}/{len(COMPONENTS)}", "timestamp": time.time()}


def export_setup(data, path="mission_setup.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\n[+] Setup exported to {path}")


if __name__ == "__main__":
    data = full_setup()
    export_setup(data)
