#!/usr/bin/env python3
"""
Pi Mesh Node
Wireless mesh networking node using batman-adv or OLSR.
Creates self-healing mesh network between Raspberry Pi nodes.
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
logger = logging.getLogger("mesh-node")

app = Flask(__name__)

# --- Configuration ---
MESH_INTERFACE = "wlan0"
MESH_ID = "pi-mesh-net"
MESH_CHANNEL = 6
MESH_FREQ = 2437  # Channel 6
BAT_INTERFACE = "bat0"
MESH_IP_PREFIX = "10.99.0"
NODE_ID = 1  # Unique per node


class MeshNode:
    """Manages batman-adv mesh networking on Raspberry Pi."""

    def __init__(self):
        self.node_ip = f"{MESH_IP_PREFIX}.{NODE_ID}"
        self.neighbors = {}
        self.mesh_active = False
        self.packets_tx = 0
        self.packets_rx = 0
        self.messages = []

    def setup_mesh_interface(self):
        """Configure wireless interface for mesh (ad-hoc) mode."""
        commands = [
            ["sudo", "ip", "link", "set", MESH_INTERFACE, "down"],
            ["sudo", "iw", MESH_INTERFACE, "set", "type", "ibss"],
            ["sudo", "ip", "link", "set", MESH_INTERFACE, "up"],
            ["sudo", "iw", MESH_INTERFACE, "ibss", "join", MESH_ID, str(MESH_FREQ)],
        ]
        for cmd in commands:
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                logger.error("Command failed: %s -> %s", " ".join(cmd), result.stderr.strip())
                return False
            time.sleep(0.5)
        logger.info("Mesh interface %s configured for IBSS '%s'", MESH_INTERFACE, MESH_ID)
        return True

    def setup_batman(self):
        """Initialize batman-adv mesh protocol."""
        commands = [
            ["sudo", "modprobe", "batman-adv"],
            ["sudo", "batctl", "meshif", BAT_INTERFACE, "if", "add", MESH_INTERFACE],
            ["sudo", "ip", "link", "set", BAT_INTERFACE, "up"],
            ["sudo", "ip", "addr", "add", f"{self.node_ip}/24", "dev", BAT_INTERFACE],
        ]
        for cmd in commands:
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                logger.warning("Batman setup: %s -> %s", " ".join(cmd), result.stderr.strip())

        self.mesh_active = True
        logger.info("Batman-adv mesh active on %s with IP %s", BAT_INTERFACE, self.node_ip)
        return True

    def get_neighbors(self):
        """Query batman-adv for mesh neighbors (originators)."""
        try:
            result = subprocess.run(
                ["sudo", "batctl", "meshif", BAT_INTERFACE, "o"],
                capture_output=True, text=True, timeout=5
            )
            neighbors = {}
            for line in result.stdout.strip().split("\n")[2:]:
                parts = line.split()
                if len(parts) >= 5:
                    mac = parts[0].replace("*", "").strip()
                    last_seen = parts[1]
                    tq = parts[2]  # Transmission quality
                    next_hop = parts[3]
                    neighbors[mac] = {
                        "last_seen": last_seen,
                        "tq": tq,
                        "next_hop": next_hop,
                    }
            self.neighbors = neighbors
        except Exception as e:
            logger.error("Failed to get neighbors: %s", e)
        return self.neighbors

    def get_gateway_list(self):
        """List batman-adv gateway candidates."""
        try:
            result = subprocess.run(
                ["sudo", "batctl", "meshif", BAT_INTERFACE, "gwl"],
                capture_output=True, text=True, timeout=5
            )
            return result.stdout.strip()
        except Exception:
            return ""

    def ping_node(self, target_ip, count=3):
        """Ping another mesh node."""
        try:
            result = subprocess.run(
                ["ping", "-c", str(count), "-W", "2", "-I", BAT_INTERFACE, target_ip],
                capture_output=True, text=True, timeout=15
            )
            return {"output": result.stdout.strip(), "success": result.returncode == 0}
        except Exception as e:
            return {"output": str(e), "success": False}

    def send_mesh_message(self, target_ip, message):
        """Send a UDP message to another mesh node."""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.bind((self.node_ip, 0))
            sock.sendto(message.encode(), (target_ip, 9999))
            sock.close()
            self.packets_tx += 1
            return True
        except Exception as e:
            logger.error("Send failed: %s", e)
            return False

    def start_message_listener(self):
        """Listen for incoming mesh messages on UDP."""
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(("0.0.0.0", 9999))
        logger.info("Listening for mesh messages on UDP 9999")
        while True:
            try:
                data, addr = sock.recvfrom(4096)
                msg = {"from": addr[0], "data": data.decode(errors="replace"),
                       "time": time.strftime("%H:%M:%S")}
                self.messages.append(msg)
                self.packets_rx += 1
                if len(self.messages) > 100:
                    self.messages = self.messages[-100:]
            except Exception:
                pass

    def get_interface_stats(self):
        """Read network interface statistics."""
        stats = {}
        try:
            with open(f"/sys/class/net/{BAT_INTERFACE}/statistics/rx_bytes") as f:
                stats["rx_bytes"] = int(f.read().strip())
            with open(f"/sys/class/net/{BAT_INTERFACE}/statistics/tx_bytes") as f:
                stats["tx_bytes"] = int(f.read().strip())
        except Exception:
            stats = {"rx_bytes": 0, "tx_bytes": 0}
        return stats

    def get_status(self):
        self.get_neighbors()
        return {
            "node_id": NODE_ID,
            "node_ip": self.node_ip,
            "mesh_id": MESH_ID,
            "mesh_active": self.mesh_active,
            "neighbors": self.neighbors,
            "neighbor_count": len(self.neighbors),
            "packets_tx": self.packets_tx,
            "packets_rx": self.packets_rx,
            "interface_stats": self.get_interface_stats(),
            "recent_messages": self.messages[-10:],
        }


node = MeshNode()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi Mesh Node</title></head><body>
    <h1>Mesh Node #{{ node_id }}</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),3000);</script></body></html>
    """, node_id=NODE_ID)

@app.route("/api/status")
def api_status():
    return jsonify(node.get_status())

@app.route("/api/ping/<target_ip>")
def api_ping(target_ip):
    return jsonify(node.ping_node(target_ip))

@app.route("/api/send", methods=["POST"])
def api_send():
    data = request.json or {}
    ok = node.send_mesh_message(data.get("ip", ""), data.get("message", ""))
    return jsonify({"sent": ok})


if __name__ == "__main__":
    try:
        node.setup_mesh_interface()
        node.setup_batman()
        threading.Thread(target=node.start_message_listener, daemon=True).start()
        logger.info("Starting Mesh Node %d on port 8090", NODE_ID)
        app.run(host="0.0.0.0", port=8090, debug=False)
    except KeyboardInterrupt:
        pass
