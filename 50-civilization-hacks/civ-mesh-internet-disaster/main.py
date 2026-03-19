#!/usr/bin/env python3
"""Mesh Internet Disaster — RPi Emergency Mesh Network Node
Creates ad-hoc mesh network for disaster communication when
infrastructure is down. Handles routing, messaging, and data relay.
"""

import numpy as np
import time
import json
import os
import socket
import struct
import hashlib
import logging
from datetime import datetime
from collections import deque

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

NODE_ID = hashlib.md5(socket.gethostname().encode()).hexdigest()[:8]
MESH_PORT = 5555
BEACON_INTERVAL = 10
MAX_HOPS = 5
MESSAGE_LOG = os.path.expanduser("~/mesh_messages/")
PIPE_PATH = "/tmp/sdr_mesh_pipe"


class MeshNode:
    """Disaster mesh network node with routing and messaging."""

    def __init__(self, node_id):
        self.node_id = node_id
        self.routing_table = {}
        self.neighbors = {}
        self.message_cache = deque(maxlen=500)
        self.seen_messages = set()
        self.stats = {"sent": 0, "received": 0, "relayed": 0, "dropped": 0}
        self.gps_location = None

    def create_beacon(self):
        """Create network beacon packet."""
        return {
            "type": "beacon",
            "node_id": self.node_id,
            "timestamp": datetime.now().isoformat(),
            "neighbors": list(self.neighbors.keys()),
            "hops": 0,
            "location": self.gps_location,
            "capabilities": ["text", "sos", "relay"],
        }

    def process_beacon(self, beacon):
        """Process received beacon and update routing."""
        sender = beacon["node_id"]
        if sender == self.node_id:
            return
        self.neighbors[sender] = {
            "last_seen": datetime.now().isoformat(),
            "hops": beacon["hops"],
            "location": beacon.get("location"),
        }
        for neighbor in beacon.get("neighbors", []):
            if neighbor not in self.routing_table and neighbor != self.node_id:
                self.routing_table[neighbor] = {
                    "next_hop": sender,
                    "hops": beacon["hops"] + 1,
                }
        self._prune_stale_neighbors()

    def _prune_stale_neighbors(self, timeout_sec=60):
        """Remove neighbors not heard from recently."""
        now = datetime.now()
        stale = []
        for nid, info in self.neighbors.items():
            last = datetime.fromisoformat(info["last_seen"])
            if (now - last).total_seconds() > timeout_sec:
                stale.append(nid)
        for nid in stale:
            del self.neighbors[nid]
            if nid in self.routing_table:
                del self.routing_table[nid]

    def create_message(self, dest, text, priority="normal"):
        """Create a mesh message."""
        msg_id = hashlib.md5(f"{self.node_id}{time.time()}{text}".encode()).hexdigest()[:12]
        message = {
            "type": "message",
            "msg_id": msg_id,
            "src": self.node_id,
            "dst": dest,
            "text": text,
            "priority": priority,
            "timestamp": datetime.now().isoformat(),
            "hops": 0,
            "ttl": MAX_HOPS,
        }
        self.stats["sent"] += 1
        return message

    def create_sos(self, details=""):
        """Create emergency SOS broadcast."""
        return self.create_message("BROADCAST", f"SOS: {details}", priority="emergency")

    def relay_message(self, message):
        """Decide whether to relay a message."""
        msg_id = message.get("msg_id", "")
        if msg_id in self.seen_messages:
            self.stats["dropped"] += 1
            return None
        self.seen_messages.add(msg_id)
        if len(self.seen_messages) > 1000:
            self.seen_messages = set(list(self.seen_messages)[-500:])
        message["hops"] += 1
        if message["hops"] >= message.get("ttl", MAX_HOPS):
            self.stats["dropped"] += 1
            return None
        if message["dst"] == self.node_id:
            self.stats["received"] += 1
            self._store_message(message)
            return None
        self.stats["relayed"] += 1
        return message

    def _store_message(self, message):
        """Store received message."""
        self.message_cache.append(message)
        os.makedirs(MESSAGE_LOG, exist_ok=True)
        fname = f"msg_{message['msg_id']}.json"
        with open(os.path.join(MESSAGE_LOG, fname), 'w') as f:
            json.dump(message, f, indent=2)

    def get_network_status(self):
        """Get mesh network status."""
        return {
            "node_id": self.node_id,
            "neighbors": len(self.neighbors),
            "routes": len(self.routing_table),
            "messages_cached": len(self.message_cache),
            "stats": self.stats,
        }


def read_from_radio():
    """Read messages from radio link pipe."""
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(4096)
            if raw:
                return json.loads(raw.decode('utf-8', errors='ignore'))
        except Exception:
            pass
    return None


def simulate_network_traffic(node):
    """Simulate network events for testing."""
    if np.random.rand() < 0.1:
        fake_beacon = {
            "type": "beacon",
            "node_id": f"node_{np.random.randint(1000, 9999)}",
            "timestamp": datetime.now().isoformat(),
            "neighbors": [],
            "hops": np.random.randint(0, 3),
        }
        node.process_beacon(fake_beacon)
    if np.random.rand() < 0.05:
        return node.create_message("BROADCAST", f"Status update at {datetime.now().strftime('%H:%M')}")
    return None


def main():
    logger.info("=== Mesh Internet Disaster — RPi Mesh Node ===")
    node = MeshNode(NODE_ID)
    logger.info(f"Node ID: {NODE_ID}")
    os.makedirs(MESSAGE_LOG, exist_ok=True)
    beacon_timer = 0

    try:
        while True:
            incoming = read_from_radio()
            if incoming:
                if incoming.get("type") == "beacon":
                    node.process_beacon(incoming)
                elif incoming.get("type") == "message":
                    relayed = node.relay_message(incoming)
                    if relayed:
                        logger.info(f"Relaying: {relayed['msg_id']} -> {relayed['dst']}")

            outgoing = simulate_network_traffic(node)
            beacon_timer += 1
            if beacon_timer >= BEACON_INTERVAL:
                beacon = node.create_beacon()
                logger.info(f"Beacon: {len(node.neighbors)} neighbors, {len(node.routing_table)} routes")
                beacon_timer = 0

            status = node.get_network_status()
            if beacon_timer == 5:
                logger.info(f"Mesh: N={status['neighbors']} R={status['routes']} | "
                            f"S={status['stats']['sent']} Rx={status['stats']['received']} "
                            f"Relay={status['stats']['relayed']}")
            time.sleep(1.0)

    except KeyboardInterrupt:
        logger.info(f"Node {NODE_ID} stopped. {node.stats}")


if __name__ == "__main__":
    main()
