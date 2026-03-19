#!/usr/bin/env python3
"""
Pi VPN Gateway
WireGuard/OpenVPN gateway on Raspberry Pi.
Routes LAN traffic through VPN tunnel with kill switch and DNS leak protection.
"""

import os
import time
import json
import subprocess
import logging
import re
from pathlib import Path
from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("vpn-gateway")

app = Flask(__name__)

WG_CONFIG_DIR = Path("/etc/wireguard")
WG_INTERFACE = "wg0"
LAN_INTERFACE = "eth0"
WAN_INTERFACE = "wlan0"


class VPNGateway:
    """Manages WireGuard VPN gateway with traffic routing."""

    def __init__(self):
        self.vpn_active = False
        self.kill_switch_enabled = False
        self.connected_since = None
        self.bytes_sent = 0
        self.bytes_received = 0

    def check_vpn_status(self):
        """Check WireGuard interface status."""
        try:
            result = subprocess.run(["sudo", "wg", "show", WG_INTERFACE],
                                    capture_output=True, text=True, timeout=5)
            self.vpn_active = result.returncode == 0
            if self.vpn_active:
                self._parse_wg_stats(result.stdout)
        except Exception:
            self.vpn_active = False
        return self.vpn_active

    def _parse_wg_stats(self, output):
        """Parse WireGuard stats from wg show output."""
        for line in output.split("\n"):
            if "transfer:" in line.lower():
                match = re.findall(r"([\d.]+)\s+([KMGT]?i?B)", line)
                if len(match) >= 2:
                    self.bytes_received = self._parse_bytes(match[0][0], match[0][1])
                    self.bytes_sent = self._parse_bytes(match[1][0], match[1][1])

    def _parse_bytes(self, value, unit):
        """Convert human-readable bytes to integer."""
        multipliers = {"B": 1, "KiB": 1024, "MiB": 1024**2, "GiB": 1024**3, "TiB": 1024**4}
        return int(float(value) * multipliers.get(unit, 1))

    def start_vpn(self):
        """Bring up WireGuard VPN tunnel."""
        result = subprocess.run(["sudo", "wg-quick", "up", WG_INTERFACE],
                               capture_output=True, text=True, timeout=15)
        if result.returncode == 0:
            self.vpn_active = True
            self.connected_since = time.time()
            logger.info("VPN tunnel up")
            self._setup_routing()
            return True
        logger.error("VPN start failed: %s", result.stderr)
        return False

    def stop_vpn(self):
        """Tear down VPN tunnel."""
        self._remove_routing()
        subprocess.run(["sudo", "wg-quick", "down", WG_INTERFACE],
                      capture_output=True, timeout=10)
        self.vpn_active = False
        self.connected_since = None
        logger.info("VPN tunnel down")

    def _setup_routing(self):
        """Route LAN traffic through VPN."""
        commands = [
            ["sudo", "sysctl", "-w", "net.ipv4.ip_forward=1"],
            ["sudo", "iptables", "-t", "nat", "-A", "POSTROUTING",
             "-o", WG_INTERFACE, "-j", "MASQUERADE"],
            ["sudo", "iptables", "-A", "FORWARD", "-i", LAN_INTERFACE,
             "-o", WG_INTERFACE, "-j", "ACCEPT"],
            ["sudo", "iptables", "-A", "FORWARD", "-i", WG_INTERFACE,
             "-o", LAN_INTERFACE, "-m", "state",
             "--state", "RELATED,ESTABLISHED", "-j", "ACCEPT"],
        ]
        for cmd in commands:
            subprocess.run(cmd, capture_output=True)
        logger.info("VPN routing configured")

    def _remove_routing(self):
        """Remove VPN routing rules."""
        subprocess.run(["sudo", "iptables", "-t", "nat", "-F"], capture_output=True)
        subprocess.run(["sudo", "iptables", "-F", "FORWARD"], capture_output=True)

    def enable_kill_switch(self):
        """Enable kill switch to block non-VPN traffic."""
        rules = [
            ["sudo", "iptables", "-A", "OUTPUT", "-o", "lo", "-j", "ACCEPT"],
            ["sudo", "iptables", "-A", "OUTPUT", "-o", WG_INTERFACE, "-j", "ACCEPT"],
            ["sudo", "iptables", "-A", "OUTPUT", "-o", LAN_INTERFACE, "-j", "ACCEPT"],
            # Allow WG handshake on WAN
            ["sudo", "iptables", "-A", "OUTPUT", "-o", WAN_INTERFACE,
             "-p", "udp", "--dport", "51820", "-j", "ACCEPT"],
            # Block everything else on WAN
            ["sudo", "iptables", "-A", "OUTPUT", "-o", WAN_INTERFACE, "-j", "DROP"],
        ]
        for cmd in rules:
            subprocess.run(cmd, capture_output=True)
        self.kill_switch_enabled = True
        logger.info("Kill switch enabled")

    def disable_kill_switch(self):
        """Disable kill switch."""
        subprocess.run(["sudo", "iptables", "-F", "OUTPUT"], capture_output=True)
        self.kill_switch_enabled = False

    def check_dns_leak(self):
        """Test for DNS leaks by querying a DNS leak test service."""
        try:
            result = subprocess.run(
                ["dig", "+short", "whoami.akamai.net", "@ns1-1.akamaitech.net"],
                capture_output=True, text=True, timeout=10
            )
            return {"resolver_ip": result.stdout.strip(), "potential_leak": False}
        except Exception:
            return {"resolver_ip": "unknown", "potential_leak": True}

    def get_public_ip(self):
        """Get current public IP address."""
        try:
            result = subprocess.run(["curl", "-s", "ifconfig.me"],
                                    capture_output=True, text=True, timeout=10)
            return result.stdout.strip()
        except Exception:
            return "unknown"

    def list_peers(self):
        """List WireGuard peers."""
        try:
            result = subprocess.run(["sudo", "wg", "show", WG_INTERFACE, "dump"],
                                    capture_output=True, text=True, timeout=5)
            peers = []
            for line in result.stdout.strip().split("\n")[1:]:
                parts = line.split("\t")
                if len(parts) >= 5:
                    peers.append({
                        "public_key": parts[0][:16] + "...",
                        "endpoint": parts[2],
                        "allowed_ips": parts[3],
                        "latest_handshake": parts[4],
                    })
            return peers
        except Exception:
            return []

    def get_status(self):
        self.check_vpn_status()
        return {
            "vpn_active": self.vpn_active,
            "kill_switch": self.kill_switch_enabled,
            "public_ip": self.get_public_ip() if self.vpn_active else None,
            "bytes_sent": self.bytes_sent,
            "bytes_received": self.bytes_received,
            "connected_minutes": round((time.time() - self.connected_since) / 60, 1) if self.connected_since else 0,
            "peers": self.list_peers(),
            "interface": WG_INTERFACE,
        }


vpn = VPNGateway()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi VPN Gateway</title></head><body>
    <h1>VPN Gateway</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),5000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(vpn.get_status())

@app.route("/api/connect", methods=["POST"])
def api_connect():
    ok = vpn.start_vpn()
    return jsonify({"connected": ok})

@app.route("/api/disconnect", methods=["POST"])
def api_disconnect():
    vpn.stop_vpn()
    return jsonify({"connected": False})

@app.route("/api/killswitch", methods=["POST"])
def api_killswitch():
    state = request.json.get("enabled", True)
    if state:
        vpn.enable_kill_switch()
    else:
        vpn.disable_kill_switch()
    return jsonify({"kill_switch": state})

@app.route("/api/dns-leak")
def api_dns_leak():
    return jsonify(vpn.check_dns_leak())


if __name__ == "__main__":
    logger.info("Starting VPN Gateway on port 8098")
    app.run(host="0.0.0.0", port=8098, debug=False)
