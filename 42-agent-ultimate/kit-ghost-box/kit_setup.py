#!/usr/bin/env python3
"""Ghost Box Kit Setup — initializes covert surveillance and counter-surveillance hardware."""

import subprocess
import sys
import json
import time
import os

COMPONENTS = {
    "hackrf": {"type": "sdr", "check": "hackrf_info", "desc": "Wideband SDR transceiver"},
    "rtl_sdr": {"type": "sdr", "check": "rtl_test -t", "desc": "Spectrum scanner"},
    "wifi_adapter": {"type": "wifi", "device": "wlan1", "desc": "Covert WiFi sensor"},
    "bluetooth_adapter": {"type": "bluetooth", "desc": "BLE scanner"},
    "rf_detector": {"type": "serial", "device": "/dev/ttyUSB0", "baud": 115200,
                    "desc": "Broadband RF power detector"},
    "faraday_bag": {"type": "accessory", "desc": "Signal isolation pouch"},
}

WIRING = """
=== Ghost Box Kit ===

[Covert Pi Zero] --- USB OTG ---+--- HackRF One (sweep & detect)
                                +--- RTL-SDR (continuous monitor)
                                +--- WiFi Adapter (network mapping)
                                +--- RF Detector (via USB-Serial)

RF Detector Module:
  - AD8317 log detector IC
  - 1 MHz to 10 GHz range
  - Analog output -> ADC -> USB-Serial
  - Whip antenna input

Power: USB battery pack (10000 mAh, 12+ hours)
Enclosure: Pelican 1060 or similar
All cables internal, single external antenna port
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
    elif config["type"] == "bluetooth":
        try:
            proc = subprocess.run(["hciconfig"], capture_output=True, text=True, timeout=3)
            result["status"] = "ok" if "UP RUNNING" in proc.stdout else "down"
        except FileNotFoundError:
            result["status"] = "not_found"
    else:
        result["status"] = "manual_check"
    return result


def sweep_modes():
    return [
        {"mode": "bug_sweep", "freq_range": "1 MHz - 6 GHz",
         "description": "Full-spectrum sweep for hidden transmitters"},
        {"mode": "wifi_audit", "freq_range": "2.4/5 GHz",
         "description": "Detect unauthorized WiFi devices"},
        {"mode": "bluetooth_scan", "freq_range": "2.4 GHz",
         "description": "Find hidden BLE trackers and devices"},
        {"mode": "cell_detect", "freq_range": "700-2100 MHz",
         "description": "Detect active cellular transmitters"},
    ]


def full_setup():
    print("=" * 50)
    print("  GHOST BOX — Counter-Surveillance Kit")
    print("=" * 50)
    print(WIRING)
    results = {}
    for name, config in COMPONENTS.items():
        status = check_component(name, config)
        results[name] = status
        icon = "[OK]" if status["status"] == "ok" else "[!!]"
        print(f"  {icon} {name}: {status['status']}")
    return {"components": results, "sweep_modes": sweep_modes(),
            "timestamp": time.time()}


def export_setup(data, path="ghost_box_setup.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\n[+] Setup exported to {path}")


if __name__ == "__main__":
    data = full_setup()
    export_setup(data)
