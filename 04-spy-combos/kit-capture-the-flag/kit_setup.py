#!/usr/bin/env python3
"""Capture The Flag Kit Setup — initializes multi-device CTF challenge hardware."""

import subprocess
import sys
import json
import time
import os

COMPONENTS = {
    "hackrf": {"type": "sdr", "device": "/dev/hackrf0", "check": "hackrf_info"},
    "wifi_adapter": {"type": "wifi", "device": "wlan1", "check": "iwconfig"},
    "esp32_flag": {"type": "serial", "device": "/dev/ttyUSB0", "baud": 115200},
    "rtl_sdr": {"type": "sdr", "device": "rtl0", "check": "rtl_test -t"},
    "speaker": {"type": "audio", "device": "hw:1,0"},
}

WIRING = """
=== CTF Kit Wiring Diagram ===

[Laptop/Pi] --- USB Hub ---+--- HackRF One (RF transmit/receive)
                           +--- WiFi Adapter (monitor mode)
                           +--- RTL-SDR (signal hunting)
                           +--- ESP32 (flag beacon via USB serial)

ESP32 Wiring:
  - GPIO 2  -> LED (flag indicator)
  - GPIO 4  -> Buzzer (capture alert)
  - GPIO 12 -> Button (flag reset)
  - 3.3V/GND -> Power rails

Audio:
  - 3.5mm speaker -> Pi/Laptop (CTF sound effects)
"""


def check_component(name, config):
    """Verify a hardware component is present and working."""
    result = {"name": name, "type": config["type"], "status": "unknown"}
    if config["type"] == "sdr":
        cmd = config["check"].split()
        try:
            proc = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
            result["status"] = "ok" if proc.returncode == 0 else "error"
            result["output"] = proc.stdout[:200]
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
    elif config["type"] == "audio":
        result["status"] = "ok"  # assume audio is available
    return result


def initialize_wifi_monitor(interface):
    """Put WiFi adapter into monitor mode for CTF challenges."""
    print(f"[*] Setting {interface} to monitor mode...")
    subprocess.run(["ip", "link", "set", interface, "down"], capture_output=True)
    subprocess.run(["iw", interface, "set", "type", "monitor"], capture_output=True)
    subprocess.run(["ip", "link", "set", interface, "up"], capture_output=True)
    result = subprocess.run(["iwconfig", interface], capture_output=True, text=True)
    return "Monitor" in result.stdout


def initialize_esp32(port="/dev/ttyUSB0", baud=115200):
    """Connect to ESP32 flag beacon via serial."""
    try:
        import serial
        ser = serial.Serial(port, baud, timeout=2)
        ser.write(b"CTF_INIT\n")
        response = ser.readline().decode(errors="replace").strip()
        ser.close()
        return {"status": "ok", "response": response}
    except ImportError:
        return {"status": "error", "message": "pyserial not installed"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def setup_ctf_challenges():
    """Define the CTF challenge configuration."""
    return [
        {"id": 1, "name": "Find the Hidden Beacon",
         "hardware": ["hackrf", "rtl_sdr"],
         "description": "Locate the ESP32 beacon frequency"},
        {"id": 2, "name": "Crack the WiFi",
         "hardware": ["wifi_adapter"],
         "description": "Capture and analyze the WPA handshake"},
        {"id": 3, "name": "Decode the Signal",
         "hardware": ["rtl_sdr"],
         "description": "Decode the hidden message in the RF transmission"},
        {"id": 4, "name": "Capture the Flag Beacon",
         "hardware": ["wifi_adapter", "esp32_flag"],
         "description": "Find and authenticate with the ESP32 flag AP"},
    ]


def full_setup():
    """Run complete kit setup and verification."""
    print("=" * 50)
    print("  CAPTURE THE FLAG — Kit Setup")
    print("=" * 50)
    print(WIRING)

    results = {}
    all_ok = True
    for name, config in COMPONENTS.items():
        status = check_component(name, config)
        results[name] = status
        icon = "[OK]" if status["status"] == "ok" else "[!!]"
        print(f"  {icon} {name}: {status['status']}")
        if status["status"] != "ok":
            all_ok = False

    challenges = setup_ctf_challenges()
    return {
        "kit_status": "ready" if all_ok else "incomplete",
        "components": results,
        "challenges": challenges,
        "timestamp": time.time(),
    }


def export_setup(data, path="ctf_setup.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\n[+] Setup exported to {path}")


if __name__ == "__main__":
    data = full_setup()
    export_setup(data)
