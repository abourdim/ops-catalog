#!/usr/bin/env python3
"""Mobile Command Kit Setup — initializes mobile command post with full comms suite."""

import subprocess
import sys
import json
import time
import os

COMPONENTS = {
    "hackrf": {"type": "sdr", "check": "hackrf_info", "desc": "HackRF SDR"},
    "rtl_sdr_1": {"type": "sdr", "check": "rtl_test -t", "desc": "RTL-SDR #1 (VHF)"},
    "wifi_ap": {"type": "wifi", "device": "wlan0", "desc": "Command AP"},
    "wifi_monitor": {"type": "wifi", "device": "wlan1", "desc": "WiFi IDS"},
    "lora_gateway": {"type": "serial", "device": "/dev/ttyUSB0", "baud": 115200,
                     "desc": "LoRa gateway for field agents"},
    "gps": {"type": "serial", "device": "/dev/ttyACM0", "baud": 9600, "desc": "GPS"},
    "cellular_modem": {"type": "interface", "device": "wwan0",
                       "desc": "4G/LTE uplink"},
    "ups_battery": {"type": "i2c", "address": "0x40",
                    "desc": "UPS battery monitor"},
}

WIRING = """
=== Mobile Command Post ===

[Command Server (Pi 4/NUC)] --- USB Hub (powered)
  +--- HackRF One (SIGINT/COMINT)
  +--- RTL-SDR (VHF/UHF monitor)
  +--- WiFi AP (hostapd - command network)
  +--- WiFi Monitor (IDS/recon)
  +--- LoRa Gateway (field agent mesh)
  +--- GPS Module
  +--- 4G Modem (backhaul)

Power System:
  - 12V 100Ah LiFePO4 battery
  - MPPT solar controller + 100W panel
  - UPS board with INA219 monitoring
  - 12V -> 5V buck converters (3x)

Network Architecture:
  Command AP (wlan0) -> DHCP/DNS for team devices
  4G Modem (wwan0) -> Internet backhaul (VPN tunnel)
  LoRa Gateway -> Field agent position/status reports
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
    elif config["type"] == "interface":
        try:
            proc = subprocess.run(["ip", "link", "show", config["device"]],
                                  capture_output=True, text=True, timeout=3)
            result["status"] = "ok" if proc.returncode == 0 else "not_found"
        except FileNotFoundError:
            result["status"] = "error"
    else:
        result["status"] = "check_manual"
    return result


def initialize_command_ap(interface="wlan0", ssid="CMD-NET", channel=6):
    """Set up the command network access point."""
    hostapd_conf = f"""interface={interface}
ssid={ssid}
hw_mode=g
channel={channel}
wpa=2
wpa_passphrase=CommandPost2024
wpa_key_mgmt=WPA-PSK
"""
    conf_path = "/tmp/cmd_hostapd.conf"
    with open(conf_path, "w") as f:
        f.write(hostapd_conf)
    return {"config_path": conf_path, "ssid": ssid, "channel": channel}


def command_services():
    return [
        {"service": "hostapd", "purpose": "Command network AP"},
        {"service": "dnsmasq", "purpose": "DHCP/DNS for command net"},
        {"service": "wireguard", "purpose": "VPN tunnel over 4G"},
        {"service": "gpsd", "purpose": "GPS daemon"},
        {"service": "lora_gateway", "purpose": "LoRa field mesh"},
    ]


def full_setup():
    print("=" * 50)
    print("  MOBILE COMMAND POST — Kit Setup")
    print("=" * 50)
    print(WIRING)
    results = {}
    for name, config in COMPONENTS.items():
        status = check_component(name, config)
        results[name] = status
        icon = "[OK]" if status["status"] == "ok" else "[!!]"
        print(f"  {icon} {name}: {status['status']}")
    return {"components": results, "services": command_services(),
            "timestamp": time.time()}


def export_setup(data, path="mobile_command_setup.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\n[+] Setup exported to {path}")


if __name__ == "__main__":
    data = full_setup()
    export_setup(data)
