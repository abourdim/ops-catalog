#!/usr/bin/env python3
"""
Pi War Room
Tactical operations dashboard aggregating data from all Pi nodes.
Displays network topology, station status, and communications overview.
"""

import os
import time
import json
import socket
import logging
import threading
import subprocess
from datetime import datetime
from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("war-room")

app = Flask(__name__)

# --- Configuration ---
DISCOVERY_PORT = 5555
POLL_INTERVAL = 15  # seconds
KNOWN_NODES = {}


class NodeDiscovery:
    """Discovers and monitors Pi nodes on the network."""

    def __init__(self):
        self.nodes = {}
        self.alerts = []
        self.lock = threading.Lock()

    def scan_network(self, subnet="192.168.1.0/24"):
        """Scan local network for Pi nodes using ARP."""
        try:
            result = subprocess.run(["arp-scan", "-l", "--interface=eth0"],
                                    capture_output=True, text=True, timeout=30)
            hosts = []
            for line in result.stdout.split("\n"):
                parts = line.split()
                if len(parts) >= 3 and parts[1].count(":") == 5:
                    hosts.append({"ip": parts[0], "mac": parts[1], "vendor": " ".join(parts[2:])})
            return hosts
        except Exception as e:
            logger.error("Network scan failed: %s", e)
            return []

    def probe_node(self, ip, port=8080):
        """Check if a Pi node is running and get its status."""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(3)
            result = sock.connect_ex((ip, port))
            sock.close()

            if result == 0:
                # Try to get status via HTTP
                import urllib.request
                url = f"http://{ip}:{port}/api/status"
                req = urllib.request.Request(url, headers={"User-Agent": "PiWarRoom/1.0"})
                with urllib.request.urlopen(req, timeout=5) as resp:
                    data = json.loads(resp.read().decode())
                    return {"online": True, "status": data, "port": port}
        except Exception:
            pass
        return {"online": False, "port": port}

    def register_node(self, name, ip, port, node_type="generic"):
        """Register a node for monitoring."""
        with self.lock:
            self.nodes[name] = {
                "ip": ip,
                "port": port,
                "type": node_type,
                "last_seen": None,
                "online": False,
                "status": {},
            }
        logger.info("Node registered: %s at %s:%d", name, ip, port)

    def poll_all_nodes(self):
        """Check status of all registered nodes."""
        with self.lock:
            for name, node in self.nodes.items():
                result = self.probe_node(node["ip"], node["port"])
                node["online"] = result["online"]
                if result["online"]:
                    node["last_seen"] = datetime.utcnow().isoformat()
                    node["status"] = result.get("status", {})
                else:
                    # Generate alert if node was previously online
                    if node.get("last_seen"):
                        self.alerts.append({
                            "time": datetime.utcnow().isoformat(),
                            "level": "warning",
                            "message": f"Node '{name}' ({node['ip']}) went offline",
                        })

    def poll_loop(self):
        """Continuous polling thread."""
        while True:
            self.poll_all_nodes()
            time.sleep(POLL_INTERVAL)

    def get_topology(self):
        """Generate network topology summary."""
        online = sum(1 for n in self.nodes.values() if n["online"])
        return {
            "total_nodes": len(self.nodes),
            "online": online,
            "offline": len(self.nodes) - online,
            "by_type": {},
        }


class WarRoomDashboard:
    """Aggregation dashboard for tactical operations."""

    def __init__(self):
        self.discovery = NodeDiscovery()
        self.events_log = []
        self.comms_log = []

    def log_event(self, source, message, level="info"):
        self.events_log.append({
            "time": datetime.utcnow().isoformat(),
            "source": source,
            "message": message,
            "level": level,
        })
        if len(self.events_log) > 500:
            self.events_log = self.events_log[-500:]

    def get_system_health(self):
        """Get local system health metrics."""
        health = {}
        try:
            with open("/sys/class/thermal/thermal_zone0/temp") as f:
                health["cpu_temp_c"] = round(int(f.read().strip()) / 1000, 1)
        except Exception:
            health["cpu_temp_c"] = None

        try:
            with open("/proc/loadavg") as f:
                parts = f.read().split()
                health["load_avg"] = [float(parts[0]), float(parts[1]), float(parts[2])]
        except Exception:
            health["load_avg"] = []

        try:
            result = subprocess.run(["free", "-b"], capture_output=True, text=True, timeout=5)
            lines = result.stdout.strip().split("\n")
            if len(lines) > 1:
                parts = lines[1].split()
                health["mem_total_mb"] = round(int(parts[1]) / (1024 * 1024), 0)
                health["mem_used_mb"] = round(int(parts[2]) / (1024 * 1024), 0)
        except Exception:
            pass

        try:
            result = subprocess.run(["uptime", "-p"], capture_output=True, text=True, timeout=5)
            health["uptime"] = result.stdout.strip()
        except Exception:
            pass
        return health

    def get_full_status(self):
        return {
            "nodes": self.discovery.nodes,
            "topology": self.discovery.get_topology(),
            "alerts": self.discovery.alerts[-20:],
            "events": self.events_log[-20:],
            "system_health": self.get_system_health(),
            "timestamp": datetime.utcnow().isoformat(),
        }


dashboard = WarRoomDashboard()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi War Room</title>
    <style>body{background:#1a1a2e;color:#0f0;font-family:monospace;padding:20px}
    h1{color:#e94560}pre{font-size:12px}</style></head><body>
    <h1>WAR ROOM - Tactical Operations Center</h1>
    <pre id="s"></pre>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),3000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(dashboard.get_full_status())

@app.route("/api/nodes")
def api_nodes():
    return jsonify(dashboard.discovery.nodes)

@app.route("/api/register", methods=["POST"])
def api_register():
    d = request.json or {}
    dashboard.discovery.register_node(
        d.get("name", "unknown"), d.get("ip", ""), d.get("port", 8080), d.get("type", "generic"))
    return jsonify({"registered": True})

@app.route("/api/scan", methods=["POST"])
def api_scan():
    hosts = dashboard.discovery.scan_network()
    return jsonify({"hosts": hosts})

@app.route("/api/event", methods=["POST"])
def api_event():
    d = request.json or {}
    dashboard.log_event(d.get("source", ""), d.get("message", ""), d.get("level", "info"))
    return jsonify({"logged": True})


if __name__ == "__main__":
    threading.Thread(target=dashboard.discovery.poll_loop, daemon=True).start()
    logger.info("Starting War Room on port 8099")
    app.run(host="0.0.0.0", port=8099, debug=False)
