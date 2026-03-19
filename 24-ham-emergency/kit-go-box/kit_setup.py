#!/usr/bin/env python3
"""Go Box Kit Setup — initializes portable emergency communications station."""

import subprocess
import sys
import json
import time
import os

COMPONENTS = {
    "hf_radio": {"type": "serial", "device": "/dev/ttyUSB0", "baud": 9600,
                 "desc": "HF transceiver (CAT control)"},
    "vhf_radio": {"type": "serial", "device": "/dev/ttyUSB1", "baud": 9600,
                  "desc": "VHF/UHF handheld or mobile"},
    "antenna_tuner": {"type": "serial", "device": "/dev/ttyUSB2", "baud": 4800,
                      "desc": "Automatic antenna tuner"},
    "gps": {"type": "serial", "device": "/dev/ttyACM0", "baud": 9600},
    "sound_card": {"type": "audio", "device": "hw:1,0",
                   "desc": "USB sound card for digital modes"},
    "battery_monitor": {"type": "i2c", "address": "0x40",
                        "desc": "INA219 battery voltage/current sensor"},
}

WIRING = """
=== Go Box Wiring Diagram ===

[12V Battery] ---> Power Distribution Panel
  |--- HF Radio (13.8V, 20A max)
  |--- VHF Radio (13.8V, 10A max)
  |--- Raspberry Pi (5V via buck converter)
  |--- USB Hub (5V)
  |--- LED Lighting (12V)

[Raspberry Pi] --- USB Hub ---+--- HF Radio CAT (USB-Serial)
                              +--- VHF Radio Programming (USB-Serial)
                              +--- Antenna Tuner Control
                              +--- GPS Module
                              +--- USB Sound Card

Sound Card Connections:
  - Line Out -> HF Radio Mic Input (via isolation transformer)
  - Line In  -> HF Radio Audio Out
  - PTT      -> GPIO 17 -> Transistor -> Radio PTT

Antenna Connections:
  - HF: SO-239 -> Auto Tuner -> EFHW/Dipole
  - VHF: BNC -> Coax -> J-Pole or Ground Plane
"""


def check_component(name, config):
    result = {"name": name, "type": config["type"], "status": "unknown",
              "description": config.get("desc", "")}
    if config["type"] == "serial":
        result["status"] = "ok" if os.path.exists(config["device"]) else "not_connected"
    elif config["type"] == "audio":
        result["status"] = "ok"
    elif config["type"] == "i2c":
        try:
            proc = subprocess.run(["i2cdetect", "-y", "1"],
                                  capture_output=True, text=True, timeout=3)
            result["status"] = "ok" if config["address"][2:] in proc.stdout else "not_detected"
        except FileNotFoundError:
            result["status"] = "i2c_tools_missing"
    return result


def check_battery(i2c_address=0x40):
    """Read battery status from INA219 sensor."""
    try:
        from ina219 import INA219
        ina = INA219(0.1, address=i2c_address)
        ina.configure()
        return {
            "voltage_v": round(ina.voltage(), 2),
            "current_ma": round(ina.current(), 1),
            "power_w": round(ina.power() / 1000, 2),
            "status": "ok",
        }
    except ImportError:
        return {"status": "library_missing", "install": "pip install pi-ina219"}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def initialize_cat_control(port="/dev/ttyUSB0", baud=9600):
    """Initialize HF radio CAT control."""
    try:
        import serial
        ser = serial.Serial(port, baud, timeout=2)
        ser.write(b"IF;")  # Kenwood/Elecraft info query
        response = ser.readline().decode(errors="replace").strip()
        ser.close()
        return {"status": "ok", "radio_response": response}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def emergency_frequencies():
    """List emergency and ARES/RACES frequencies."""
    return [
        {"freq_mhz": 7.230, "mode": "LSB", "purpose": "ARES HF Net"},
        {"freq_mhz": 14.300, "mode": "USB", "purpose": "Emergency Traffic"},
        {"freq_mhz": 146.520, "mode": "FM", "purpose": "2m National Calling"},
        {"freq_mhz": 146.940, "mode": "FM", "purpose": "Local Repeater"},
        {"freq_mhz": 446.000, "mode": "FM", "purpose": "70cm National Calling"},
        {"freq_mhz": 3.860, "mode": "LSB", "purpose": "75m Emergency Net"},
    ]


def full_setup():
    print("=" * 50)
    print("  GO BOX — Emergency Station Setup")
    print("=" * 50)
    print(WIRING)

    results = {}
    for name, config in COMPONENTS.items():
        status = check_component(name, config)
        results[name] = status
        icon = "[OK]" if status["status"] == "ok" else "[!!]"
        print(f"  {icon} {name}: {status['status']}")

    battery = check_battery()
    freqs = emergency_frequencies()
    return {
        "components": results,
        "battery": battery,
        "emergency_frequencies": freqs,
        "timestamp": time.time(),
    }


def export_setup(data, path="gobox_setup.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\n[+] Setup exported to {path}")


if __name__ == "__main__":
    data = full_setup()
    export_setup(data)
