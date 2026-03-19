#!/usr/bin/env python3
"""Spy Pro Kit Setup — initializes the complete spy operations hardware suite."""

import subprocess
import sys
import json
import time
import os

COMPONENTS = {
    "hackrf": {"type": "sdr", "check": "hackrf_info"},
    "rtl_sdr": {"type": "sdr", "check": "rtl_test -t"},
    "wifi_adapter": {"type": "wifi", "device": "wlan1"},
    "gps_module": {"type": "serial", "device": "/dev/ttyACM0", "baud": 9600},
    "esp32_beacon": {"type": "serial", "device": "/dev/ttyUSB0", "baud": 115200},
    "camera": {"type": "camera", "device": "/dev/video0"},
    "directional_mic": {"type": "audio", "device": "hw:2,0"},
}

WIRING = """
=== Spy Pro Kit Wiring Diagram ===

[Field Laptop] --- USB Hub (powered) ---+--- HackRF One (SIGINT)
                                        +--- RTL-SDR (spectrum monitor)
                                        +--- WiFi Adapter (network recon)
                                        +--- GPS Module (geolocation)
                                        +--- ESP32 (covert beacon)
                                        +--- USB Camera (visual intel)
                                        +--- USB Audio (directional mic)

GPS Module (USB-Serial):
  - TX -> USB-Serial RX
  - Power from USB
  - External antenna recommended

ESP32 Covert Beacon:
  - GPIO 2  -> Status LED
  - GPIO 4  -> RF Enable (optional external amp)
  - GPIO 15 -> Panic button
  - USB power + data

Camera: USB webcam or Pi Camera module
Audio: USB soundcard + directional microphone
"""


def check_component(name, config):
    result = {"name": name, "type": config["type"], "status": "unknown"}
    if config["type"] == "sdr":
        cmd = config["check"].split()
        try:
            proc = subprocess.run(cmd, capture_output=True, text=True, timeout=5)
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
    elif config["type"] == "audio":
        result["status"] = "ok"
    return result


def initialize_gps(port="/dev/ttyACM0", baud=9600):
    """Initialize GPS module and get a fix."""
    try:
        import serial
        ser = serial.Serial(port, baud, timeout=5)
        lines = []
        for _ in range(10):
            line = ser.readline().decode(errors="replace").strip()
            if line.startswith("$GPGGA") or line.startswith("$GPRMC"):
                lines.append(line)
        ser.close()
        has_fix = any(",,," not in l for l in lines)
        return {"status": "ok" if lines else "no_data",
                "fix": has_fix, "sentences": lines[:3]}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def initialize_sigint():
    """Prepare SIGINT receivers."""
    results = {}
    # HackRF
    proc = subprocess.run(["hackrf_info"], capture_output=True, text=True, timeout=5)
    results["hackrf"] = "ready" if proc.returncode == 0 else "unavailable"
    # RTL-SDR
    proc = subprocess.run(["rtl_test", "-t"], capture_output=True, text=True, timeout=5)
    results["rtl_sdr"] = "ready" if proc.returncode == 0 else "unavailable"
    return results


def setup_mission_profiles():
    """Define available mission profiles."""
    return [
        {"id": "sigint", "name": "Signal Intelligence",
         "hardware": ["hackrf", "rtl_sdr", "directional_mic"],
         "description": "RF signal monitoring and analysis"},
        {"id": "wifi_recon", "name": "WiFi Reconnaissance",
         "hardware": ["wifi_adapter"],
         "description": "Network discovery and client tracking"},
        {"id": "surveillance", "name": "Surveillance Post",
         "hardware": ["camera", "directional_mic", "gps_module"],
         "description": "Audio-visual intelligence gathering"},
        {"id": "full_spectrum", "name": "Full Spectrum Operations",
         "hardware": list(COMPONENTS.keys()),
         "description": "All sensors active for maximum coverage"},
    ]


def full_setup():
    print("=" * 50)
    print("  SPY PRO — Kit Setup")
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

    profiles = setup_mission_profiles()
    return {
        "kit_status": "ready" if ready == len(COMPONENTS) else f"{ready}/{len(COMPONENTS)}",
        "components": results,
        "mission_profiles": profiles,
        "timestamp": time.time(),
    }


def export_setup(data, path="spy_pro_setup.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\n[+] Setup exported to {path}")


if __name__ == "__main__":
    data = full_setup()
    export_setup(data)
