#!/usr/bin/env python3
"""
Pi Stealth Access Point
Hidden WiFi access point with MAC randomization, SSID cloaking,
and encrypted tunnel. Provides covert network access for field operations.
"""

import os
import time
import json
import random
import subprocess
import logging
import threading
from datetime import datetime
from flask import Flask, jsonify, request, render_template_string

try:
    import RPi.GPIO as GPIO
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("stealth-ap")

app = Flask(__name__)

# --- Configuration ---
AP_INTERFACE = "wlan0"
UPSTREAM_INTERFACE = "eth0"
HOSTAPD_CONF = "/etc/hostapd/hostapd.conf"
DNSMASQ_CONF = "/etc/dnsmasq.d/stealth-ap.conf"
STATUS_LED = 17
ACTIVE_LED = 27


class StealthAP:
    """Manages a hidden WiFi access point with stealth features."""

    def __init__(self):
        self.ap_active = False
        self.ssid = ""
        self.hidden = True
        self.channel = 6
        self.current_mac = ""
        self.clients = []
        self.traffic_bytes = 0
        self._setup_gpio()

    def _setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(STATUS_LED, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(ACTIVE_LED, GPIO.OUT, initial=GPIO.LOW)

    def generate_random_mac(self):
        """Generate a random locally-administered MAC address."""
        mac = [0x02, random.randint(0, 255), random.randint(0, 255),
               random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)]
        return ":".join(f"{b:02x}" for b in mac)

    def set_mac(self, mac=None):
        """Set interface MAC address (randomize if none given)."""
        if mac is None:
            mac = self.generate_random_mac()
        commands = [
            ["sudo", "ip", "link", "set", AP_INTERFACE, "down"],
            ["sudo", "ip", "link", "set", AP_INTERFACE, "address", mac],
            ["sudo", "ip", "link", "set", AP_INTERFACE, "up"],
        ]
        for cmd in commands:
            subprocess.run(cmd, capture_output=True, timeout=5)
        self.current_mac = mac
        logger.info("MAC set to %s", mac)
        return mac

    def generate_hostapd_config(self, ssid="", channel=6, hidden=True, password=""):
        """Generate hostapd configuration."""
        self.ssid = ssid or f"AP_{random.randint(1000, 9999)}"
        self.channel = channel
        self.hidden = hidden

        config = f"""interface={AP_INTERFACE}
driver=nl80211
ssid={self.ssid}
hw_mode=g
channel={self.channel}
wmm_enabled=0
macaddr_acl=0
ignore_broadcast_ssid={'1' if hidden else '0'}
"""
        if password and len(password) >= 8:
            config += f"""auth_algs=1
wpa=2
wpa_passphrase={password}
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
"""
        try:
            with open(HOSTAPD_CONF, "w") as f:
                f.write(config)
            return True
        except PermissionError:
            logger.error("Cannot write hostapd config")
            return False

    def generate_dnsmasq_config(self, subnet="10.10.10"):
        """Generate DHCP server configuration."""
        config = f"""interface={AP_INTERFACE}
dhcp-range={subnet}.10,{subnet}.50,255.255.255.0,12h
dhcp-option=3,{subnet}.1
dhcp-option=6,{subnet}.1
server=1.1.1.1
log-queries
log-dhcp
"""
        try:
            with open(DNSMASQ_CONF, "w") as f:
                f.write(config)
            return True
        except PermissionError:
            return False

    def start_ap(self, ssid="", password="", hidden=True, channel=6):
        """Start the stealth access point."""
        # Randomize MAC
        self.set_mac()

        # Configure network
        subnet = "10.10.10"
        subprocess.run(["sudo", "ip", "addr", "flush", "dev", AP_INTERFACE], capture_output=True)
        subprocess.run(["sudo", "ip", "addr", "add", f"{subnet}.1/24", "dev", AP_INTERFACE],
                      capture_output=True)

        # Generate configs
        self.generate_hostapd_config(ssid, channel, hidden, password)
        self.generate_dnsmasq_config(subnet)

        # Start services
        subprocess.run(["sudo", "systemctl", "stop", "hostapd"], capture_output=True)
        subprocess.run(["sudo", "systemctl", "stop", "dnsmasq"], capture_output=True)
        time.sleep(1)
        subprocess.run(["sudo", "systemctl", "start", "hostapd"], capture_output=True)
        subprocess.run(["sudo", "systemctl", "start", "dnsmasq"], capture_output=True)

        # Enable NAT
        subprocess.run(["sudo", "sysctl", "-w", "net.ipv4.ip_forward=1"], capture_output=True)
        subprocess.run(["sudo", "iptables", "-t", "nat", "-A", "POSTROUTING",
                        "-o", UPSTREAM_INTERFACE, "-j", "MASQUERADE"], capture_output=True)

        self.ap_active = True
        GPIO.output(ACTIVE_LED, GPIO.HIGH)
        logger.info("Stealth AP started: SSID=%s, hidden=%s, channel=%d",
                     self.ssid, hidden, channel)
        return True

    def stop_ap(self):
        """Stop the access point."""
        subprocess.run(["sudo", "systemctl", "stop", "hostapd"], capture_output=True)
        subprocess.run(["sudo", "systemctl", "stop", "dnsmasq"], capture_output=True)
        subprocess.run(["sudo", "iptables", "-t", "nat", "-F"], capture_output=True)
        self.ap_active = False
        GPIO.output(ACTIVE_LED, GPIO.LOW)
        logger.info("Stealth AP stopped")

    def rotate_mac(self):
        """Rotate MAC address while AP is running."""
        if self.ap_active:
            self.stop_ap()
            time.sleep(1)
            self.set_mac()
            self.start_ap(self.ssid)

    def get_connected_clients(self):
        """List connected WiFi clients."""
        clients = []
        try:
            result = subprocess.run(
                ["sudo", "hostapd_cli", "-i", AP_INTERFACE, "all_sta"],
                capture_output=True, text=True, timeout=5
            )
            current_mac = None
            for line in result.stdout.split("\n"):
                if line and ":" in line and len(line.split(":")) == 6 and "=" not in line:
                    current_mac = line.strip()
                    clients.append({"mac": current_mac})
        except Exception:
            pass

        # Also check DHCP leases
        try:
            with open("/var/lib/misc/dnsmasq.leases") as f:
                for line in f:
                    parts = line.strip().split()
                    if len(parts) >= 4:
                        for c in clients:
                            if c["mac"].lower() == parts[1].lower():
                                c["ip"] = parts[2]
                                c["hostname"] = parts[3]
        except Exception:
            pass

        self.clients = clients
        return clients

    def get_status(self):
        return {
            "ap_active": self.ap_active,
            "ssid": self.ssid,
            "hidden": self.hidden,
            "channel": self.channel,
            "current_mac": self.current_mac,
            "clients": self.get_connected_clients(),
            "client_count": len(self.clients),
        }


stealth = StealthAP()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Stealth AP</title></head><body>
    <h1>Stealth Access Point</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),3000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(stealth.get_status())

@app.route("/api/start", methods=["POST"])
def api_start():
    d = request.json or {}
    stealth.start_ap(d.get("ssid", ""), d.get("password", ""),
                     d.get("hidden", True), d.get("channel", 6))
    return jsonify({"active": True, "ssid": stealth.ssid})

@app.route("/api/stop", methods=["POST"])
def api_stop():
    stealth.stop_ap()
    return jsonify({"active": False})

@app.route("/api/rotate-mac", methods=["POST"])
def api_rotate():
    stealth.rotate_mac()
    return jsonify({"mac": stealth.current_mac})

@app.route("/api/clients")
def api_clients():
    return jsonify({"clients": stealth.get_connected_clients()})


if __name__ == "__main__":
    GPIO.output(STATUS_LED, GPIO.HIGH)
    logger.info("Starting Stealth AP on port 8110")
    app.run(host="0.0.0.0", port=8110, debug=False)
