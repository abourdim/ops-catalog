#!/usr/bin/env python3
"""Field Comms Kit Setup — initializes covert field communication equipment."""

import subprocess
import sys
import json
import time
import os

COMPONENTS = {
    "sdr_transceiver": {"type": "sdr", "check": "hackrf_info",
                        "desc": "HackRF for burst transmission"},
    "lora_module": {"type": "serial", "device": "/dev/ttyUSB0", "baud": 115200,
                    "desc": "LoRa module for long-range mesh"},
    "wifi_adapter": {"type": "wifi", "device": "wlan1",
                     "desc": "WiFi adapter for local networks"},
    "gps": {"type": "serial", "device": "/dev/ttyACM0", "baud": 9600,
            "desc": "GPS for position reporting"},
    "crypto_key": {"type": "file", "path": "/etc/fieldcomms/key.bin",
                   "desc": "AES-256 encryption key"},
    "battery": {"type": "i2c", "address": "0x40",
                "desc": "Battery monitor (INA219)"},
}

WIRING = """
=== Field Comms Kit Wiring ===

[Raspberry Pi Zero W] --- USB OTG Hub
  +--- HackRF One (burst TX/RX)
  +--- LoRa Module (UART via USB-Serial)
  +--- GPS Module (USB-Serial)
  +--- WiFi Adapter (external)

LoRa Module (SX1276):
  - VCC  -> 3.3V
  - GND  -> GND
  - TX   -> USB-Serial RX
  - RX   -> USB-Serial TX
  - DIO0 -> GPIO 22 (interrupt)
  - RST  -> GPIO 27

Power System:
  - 18650 x2 in series (7.4V nominal)
  - Buck converter -> 5V 3A for Pi
  - INA219 on battery line for monitoring
  - Estimated runtime: 8-12 hours (receive only)
"""


def check_component(name, config):
    result = {"name": name, "type": config["type"], "status": "unknown",
              "description": config.get("desc", "")}
    if config["type"] == "sdr":
        try:
            proc = subprocess.run(config["check"].split(),
                                  capture_output=True, text=True, timeout=5)
            result["status"] = "ok" if proc.returncode == 0 else "error"
        except (subprocess.TimeoutExpired, FileNotFoundError):
            result["status"] = "not_found"
    elif config["type"] == "serial":
        result["status"] = "ok" if os.path.exists(config["device"]) else "not_connected"
    elif config["type"] == "wifi":
        try:
            proc = subprocess.run(["iwconfig", config["device"]],
                                  capture_output=True, text=True, timeout=3)
            result["status"] = "ok" if proc.returncode == 0 else "error"
        except FileNotFoundError:
            result["status"] = "not_found"
    elif config["type"] == "file":
        result["status"] = "ok" if os.path.exists(config["path"]) else "missing"
    elif config["type"] == "i2c":
        result["status"] = "check_manual"
    return result


def initialize_lora(port="/dev/ttyUSB0", baud=115200):
    """Initialize LoRa module with field comms parameters."""
    try:
        import serial
        ser = serial.Serial(port, baud, timeout=2)
        commands = [
            b"AT+PARAMETER=10,7,1,7\n",   # SF10, BW125, CR4/5, preamble 7
            b"AT+BAND=915000000\n",         # 915 MHz ISM
            b"AT+ADDRESS=001\n",            # Node address
            b"AT+NETWORKID=42\n",           # Network ID
        ]
        responses = []
        for cmd in commands:
            ser.write(cmd)
            time.sleep(0.3)
            resp = ser.readline().decode(errors="replace").strip()
            responses.append(resp)
        ser.close()
        return {"status": "ok", "responses": responses}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def generate_crypto_key(path="/etc/fieldcomms/key.bin"):
    """Generate a fresh AES-256 key for field comms."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    key = os.urandom(32)
    with open(path, "wb") as f:
        f.write(key)
    os.chmod(path, 0o600)
    return {"status": "generated", "path": path, "bits": 256}


def comm_channels():
    """Define available communication channels."""
    return [
        {"name": "LoRa Primary", "freq_mhz": 915.0, "mode": "LoRa",
         "range_km": 10, "encrypted": True},
        {"name": "LoRa Backup", "freq_mhz": 868.0, "mode": "LoRa",
         "range_km": 10, "encrypted": True},
        {"name": "WiFi Mesh", "freq_mhz": 2437, "mode": "WiFi",
         "range_km": 0.3, "encrypted": True},
        {"name": "HF Burst", "freq_mhz": 14.1, "mode": "Digital",
         "range_km": 5000, "encrypted": True},
    ]


def full_setup():
    print("=" * 50)
    print("  FIELD COMMS — Kit Setup")
    print("=" * 50)
    print(WIRING)

    results = {}
    for name, config in COMPONENTS.items():
        status = check_component(name, config)
        results[name] = status
        icon = "[OK]" if status["status"] == "ok" else "[!!]"
        print(f"  {icon} {name}: {status['status']}")

    channels = comm_channels()
    return {
        "components": results,
        "channels": channels,
        "timestamp": time.time(),
    }


def export_setup(data, path="field_comms_setup.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\n[+] Setup exported to {path}")


if __name__ == "__main__":
    data = full_setup()
    export_setup(data)
