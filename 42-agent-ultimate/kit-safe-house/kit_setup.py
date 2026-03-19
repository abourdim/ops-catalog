#!/usr/bin/env python3
"""Safe House Kit Setup — initializes secure location monitoring and communications."""

import subprocess
import sys
import json
import time
import os

COMPONENTS = {
    "perimeter_wifi": {"type": "wifi", "device": "wlan1",
                       "desc": "WiFi perimeter sensor"},
    "rtl_sdr": {"type": "sdr", "check": "rtl_test -t",
                "desc": "RF bug sweep receiver"},
    "camera_1": {"type": "camera", "device": "/dev/video0",
                 "desc": "Entry camera"},
    "pir_sensor": {"type": "gpio", "pin": 17,
                   "desc": "PIR motion detector"},
    "door_sensor": {"type": "gpio", "pin": 27,
                    "desc": "Door reed switch"},
    "secure_comms": {"type": "serial", "device": "/dev/ttyUSB0", "baud": 115200,
                     "desc": "LoRa encrypted comms"},
    "noise_generator": {"type": "audio", "device": "hw:1,0",
                        "desc": "White noise generator (anti-surveillance)"},
}

WIRING = """
=== Safe House Security Kit ===

[Security Pi] --- USB Hub ---+--- WiFi Adapter (perimeter monitoring)
                             +--- RTL-SDR (bug sweep)
                             +--- USB Camera (entry monitor)
                             +--- LoRa Radio (secure comms)

GPIO Connections:
  - GPIO 17 -> PIR Sensor (motion detect)
  - GPIO 27 -> Reed Switch (door open/close)
  - GPIO 22 -> Relay (door lock control)
  - GPIO 23 -> LED Strip (alert lighting)
  - GPIO 24 -> Buzzer (silent/audible alarm)

PIR Sensor:
  - VCC -> 5V
  - OUT -> GPIO 17 (with 10K pulldown)
  - GND -> GND

Door Reed Switch:
  - One wire -> GPIO 27
  - Other wire -> GND
  - Internal pullup enabled in software

Audio Output:
  - USB sound card -> amplified speaker
  - White noise for conversation masking
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
    elif config["type"] == "camera":
        result["status"] = "ok" if os.path.exists(config["device"]) else "not_connected"
    elif config["type"] == "serial":
        result["status"] = "ok" if os.path.exists(config["device"]) else "not_connected"
    elif config["type"] == "gpio":
        result["status"] = "ok" if os.path.exists("/sys/class/gpio") else "no_gpio"
    else:
        result["status"] = "ok"
    return result


def security_zones():
    return [
        {"zone": "perimeter", "sensors": ["perimeter_wifi", "rtl_sdr"],
         "description": "Outer RF monitoring zone"},
        {"zone": "entry", "sensors": ["camera_1", "door_sensor"],
         "description": "Entry point monitoring"},
        {"zone": "interior", "sensors": ["pir_sensor"],
         "description": "Interior motion detection"},
        {"zone": "comms", "sensors": ["secure_comms", "noise_generator"],
         "description": "Secure communications suite"},
    ]


def alert_levels():
    return [
        {"level": "GREEN", "description": "Normal operations",
         "actions": ["passive monitoring"]},
        {"level": "YELLOW", "description": "Unknown RF or motion detected",
         "actions": ["increase scan rate", "alert via LoRa"]},
        {"level": "RED", "description": "Breach detected",
         "actions": ["full alert", "activate noise generator", "secure comms"]},
    ]


def full_setup():
    print("=" * 50)
    print("  SAFE HOUSE — Security Kit Setup")
    print("=" * 50)
    print(WIRING)
    results = {}
    for name, config in COMPONENTS.items():
        status = check_component(name, config)
        results[name] = status
        icon = "[OK]" if status["status"] == "ok" else "[!!]"
        print(f"  {icon} {name}: {status['status']}")
    return {"components": results, "zones": security_zones(),
            "alert_levels": alert_levels(), "timestamp": time.time()}


def export_setup(data, path="safe_house_setup.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\n[+] Setup exported to {path}")


if __name__ == "__main__":
    data = full_setup()
    export_setup(data)
