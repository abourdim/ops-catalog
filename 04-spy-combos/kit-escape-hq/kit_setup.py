#!/usr/bin/env python3
"""Escape HQ Kit Setup — initializes multi-sensor escape room hardware environment."""

import subprocess
import sys
import json
import time
import os

COMPONENTS = {
    "rfid_reader": {"type": "serial", "device": "/dev/ttyACM0", "baud": 9600},
    "esp32_locks": {"type": "serial", "device": "/dev/ttyUSB0", "baud": 115200},
    "wifi_adapter": {"type": "wifi", "device": "wlan1"},
    "speakers": {"type": "audio", "device": "hw:1,0"},
    "led_controller": {"type": "serial", "device": "/dev/ttyUSB1", "baud": 9600},
    "ir_sensor": {"type": "gpio", "pin": 17},
}

WIRING = """
=== Escape HQ Wiring Diagram ===

[Control Pi] --- USB Hub ---+--- ESP32 #1 (door locks, GPIO 12/13/14)
                            +--- RFID Reader RC522 (SPI)
                            +--- LED Strip Controller (WS2812B)
                            +--- WiFi Adapter (puzzle network)

ESP32 Lock Controller:
  - GPIO 12 -> Relay 1 (Door Lock 1)
  - GPIO 13 -> Relay 2 (Door Lock 2)
  - GPIO 14 -> Relay 3 (Secret Compartment)
  - GPIO 27 -> Piezo Buzzer
  - 5V/GND  -> Relay module power

RFID Reader (SPI to Pi):
  - SDA  -> GPIO 8 (CE0)
  - SCK  -> GPIO 11
  - MOSI -> GPIO 10
  - MISO -> GPIO 9
  - RST  -> GPIO 25
  - 3.3V/GND

LED Controller:
  - Data -> GPIO 18 (PWM)
  - 5V external power supply
"""


def check_component(name, config):
    result = {"name": name, "type": config["type"], "status": "unknown"}
    if config["type"] == "serial":
        result["status"] = "ok" if os.path.exists(config["device"]) else "not_connected"
    elif config["type"] == "wifi":
        try:
            proc = subprocess.run(["iwconfig", config["device"]],
                                  capture_output=True, text=True, timeout=3)
            result["status"] = "ok" if proc.returncode == 0 else "error"
        except FileNotFoundError:
            result["status"] = "not_found"
    elif config["type"] == "gpio":
        gpio_path = f"/sys/class/gpio/gpio{config['pin']}"
        result["status"] = "ok" if os.path.exists("/sys/class/gpio") else "no_gpio"
    elif config["type"] == "audio":
        result["status"] = "ok"
    return result


def initialize_locks(port="/dev/ttyUSB0", baud=115200):
    """Initialize ESP32 lock controller."""
    try:
        import serial
        ser = serial.Serial(port, baud, timeout=2)
        ser.write(b"LOCK_INIT\n")
        time.sleep(0.5)
        response = ser.readline().decode(errors="replace").strip()
        # Lock all doors at start
        ser.write(b"LOCK_ALL\n")
        ser.close()
        return {"status": "ok", "locks": "all_locked", "response": response}
    except Exception as e:
        return {"status": "error", "message": str(e)}


def initialize_rfid():
    """Initialize RFID reader for clue cards."""
    try:
        from mfrc522 import SimpleMFRC522
        reader = SimpleMFRC522()
        return {"status": "ok", "reader": "RC522"}
    except ImportError:
        return {"status": "library_missing", "install": "pip install mfrc522"}


def setup_puzzle_sequence():
    """Define the escape room puzzle chain."""
    return [
        {"id": 1, "name": "Frequency Hunt",
         "trigger": "rfid_scan", "unlock": "clue_1",
         "hardware": ["wifi_adapter"]},
        {"id": 2, "name": "Decode the Signal",
         "trigger": "correct_frequency", "unlock": "clue_2",
         "hardware": ["esp32_locks"]},
        {"id": 3, "name": "RFID Badge Clone",
         "trigger": "rfid_match", "unlock": "door_1",
         "hardware": ["rfid_reader", "esp32_locks"]},
        {"id": 4, "name": "Final Escape",
         "trigger": "all_clues_collected", "unlock": "door_2",
         "hardware": ["esp32_locks", "led_controller"]},
    ]


def full_setup():
    print("=" * 50)
    print("  ESCAPE HQ — Kit Setup")
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

    puzzles = setup_puzzle_sequence()
    return {
        "kit_status": "ready" if all_ok else "incomplete",
        "components": results,
        "puzzles": puzzles,
        "timestamp": time.time(),
    }


def export_setup(data, path="escape_hq_setup.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\n[+] Setup exported to {path}")


if __name__ == "__main__":
    data = full_setup()
    export_setup(data)
