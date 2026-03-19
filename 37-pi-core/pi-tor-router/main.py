#!/usr/bin/env python3
"""
Pi Tor Router
Transparent Tor proxy router on Raspberry Pi.
Routes all traffic through Tor with iptables, DNS over Tor, and circuit management.
"""

import os
import time
import json
import socket
import subprocess
import logging
import threading
from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("tor-router")

app = Flask(__name__)

# --- Configuration ---
TOR_SOCKS_PORT = 9050
TOR_TRANS_PORT = 9040
TOR_DNS_PORT = 5353
TOR_CONTROL_PORT = 9051
LAN_INTERFACE = "eth0"
WLAN_INTERFACE = "wlan0"
TORRC_PATH = "/etc/tor/torrc"


class TorRouter:
    """Manages Tor transparent proxy and routing."""

    def __init__(self):
        self.tor_running = False
        self.routing_active = False
        self.circuits = []
        self.bandwidth_stats = {"upload": 0, "download": 0}
        self.start_time = None

    def check_tor_status(self):
        """Check if Tor service is running."""
        try:
            result = subprocess.run(["systemctl", "is-active", "tor"],
                                    capture_output=True, text=True, timeout=5)
            self.tor_running = result.stdout.strip() == "active"
        except Exception:
            self.tor_running = False
        return self.tor_running

    def start_tor(self):
        """Start the Tor service."""
        subprocess.run(["sudo", "systemctl", "start", "tor"], capture_output=True)
        time.sleep(3)
        self.check_tor_status()
        if self.tor_running:
            self.start_time = time.time()
            logger.info("Tor service started")
        return self.tor_running

    def stop_tor(self):
        """Stop Tor and remove routing rules."""
        self.disable_transparent_proxy()
        subprocess.run(["sudo", "systemctl", "stop", "tor"], capture_output=True)
        self.tor_running = False
        logger.info("Tor service stopped")

    def generate_torrc(self):
        """Generate Tor configuration for transparent proxy."""
        config = f"""
SocksPort {TOR_SOCKS_PORT}
TransPort {TOR_TRANS_PORT}
DNSPort {TOR_DNS_PORT}
AutomapHostsOnResolve 1
VirtualAddrNetworkIPv4 10.192.0.0/10
ControlPort {TOR_CONTROL_PORT}
CookieAuthentication 1
Log notice file /var/log/tor/notices.log
"""
        try:
            with open(TORRC_PATH, "w") as f:
                f.write(config)
            logger.info("torrc generated")
            return True
        except PermissionError:
            logger.error("Cannot write torrc (need root)")
            return False

    def enable_transparent_proxy(self):
        """Set up iptables rules for transparent Tor proxy."""
        # Flush existing rules
        subprocess.run(["sudo", "iptables", "-t", "nat", "-F"], capture_output=True)

        rules = [
            # Redirect DNS to Tor
            ["sudo", "iptables", "-t", "nat", "-A", "PREROUTING",
             "-i", LAN_INTERFACE, "-p", "udp", "--dport", "53",
             "-j", "REDIRECT", "--to-ports", str(TOR_DNS_PORT)],
            # Redirect TCP to Tor TransPort
            ["sudo", "iptables", "-t", "nat", "-A", "PREROUTING",
             "-i", LAN_INTERFACE, "-p", "tcp", "--syn",
             "-j", "REDIRECT", "--to-ports", str(TOR_TRANS_PORT)],
            # Allow established connections
            ["sudo", "iptables", "-A", "FORWARD", "-i", LAN_INTERFACE,
             "-o", WLAN_INTERFACE, "-m", "state",
             "--state", "RELATED,ESTABLISHED", "-j", "ACCEPT"],
        ]
        for rule in rules:
            result = subprocess.run(rule, capture_output=True, text=True)
            if result.returncode != 0:
                logger.error("iptables rule failed: %s", result.stderr)

        # Enable IP forwarding
        subprocess.run(["sudo", "sysctl", "-w", "net.ipv4.ip_forward=1"], capture_output=True)

        self.routing_active = True
        logger.info("Transparent proxy enabled")

    def disable_transparent_proxy(self):
        """Remove iptables rules."""
        subprocess.run(["sudo", "iptables", "-t", "nat", "-F"], capture_output=True)
        subprocess.run(["sudo", "iptables", "-F", "FORWARD"], capture_output=True)
        self.routing_active = False
        logger.info("Transparent proxy disabled")

    def get_exit_ip(self):
        """Check current Tor exit node IP."""
        try:
            result = subprocess.run(
                ["curl", "-s", "--socks5", f"127.0.0.1:{TOR_SOCKS_PORT}",
                 "https://check.torproject.org/api/ip"],
                capture_output=True, text=True, timeout=30
            )
            data = json.loads(result.stdout)
            return data.get("IP", "unknown")
        except Exception:
            return "unavailable"

    def new_identity(self):
        """Request new Tor circuit (new identity)."""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.connect(("127.0.0.1", TOR_CONTROL_PORT))
            sock.send(b'AUTHENTICATE ""\r\n')
            response = sock.recv(256)
            sock.send(b"SIGNAL NEWNYM\r\n")
            response = sock.recv(256)
            sock.close()
            logger.info("New Tor identity requested")
            return "250" in response.decode()
        except Exception as e:
            logger.error("Identity change failed: %s", e)
            return False

    def get_circuit_info(self):
        """Query Tor control port for circuit information."""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.connect(("127.0.0.1", TOR_CONTROL_PORT))
            sock.send(b'AUTHENTICATE ""\r\n')
            sock.recv(256)
            sock.send(b"GETINFO circuit-status\r\n")
            data = sock.recv(4096).decode(errors="replace")
            sock.close()
            circuits = []
            for line in data.split("\n"):
                if line.startswith(" ") or line[0:1].isdigit():
                    circuits.append(line.strip())
            return circuits[:10]
        except Exception:
            return []

    def get_bandwidth(self):
        """Read Tor bandwidth usage from log."""
        try:
            result = subprocess.run(
                ["sudo", "tail", "-5", "/var/log/tor/notices.log"],
                capture_output=True, text=True, timeout=5
            )
            return result.stdout.strip()
        except Exception:
            return ""

    def get_status(self):
        self.check_tor_status()
        return {
            "tor_running": self.tor_running,
            "routing_active": self.routing_active,
            "exit_ip": self.get_exit_ip() if self.tor_running else None,
            "circuits": self.get_circuit_info(),
            "uptime_min": round((time.time() - self.start_time) / 60, 1) if self.start_time else 0,
            "socks_port": TOR_SOCKS_PORT,
            "trans_port": TOR_TRANS_PORT,
        }


tor = TorRouter()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi Tor Router</title></head><body>
    <h1>Tor Router</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),5000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(tor.get_status())

@app.route("/api/start", methods=["POST"])
def api_start():
    tor.start_tor()
    tor.enable_transparent_proxy()
    return jsonify({"running": tor.tor_running})

@app.route("/api/stop", methods=["POST"])
def api_stop():
    tor.stop_tor()
    return jsonify({"running": False})

@app.route("/api/newidentity", methods=["POST"])
def api_newidentity():
    ok = tor.new_identity()
    return jsonify({"success": ok})


if __name__ == "__main__":
    logger.info("Starting Tor Router on port 8097")
    app.run(host="0.0.0.0", port=8097, debug=False)
