#!/usr/bin/env python3
"""
Pi Honeypot Server
Network honeypot that emulates vulnerable services to detect intrusion attempts.
Logs all connection attempts with source IP, port scans, and payload data.
"""

import os
import time
import json
import socket
import logging
import threading
import hashlib
from datetime import datetime
from pathlib import Path
from flask import Flask, jsonify, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("honeypot")

app = Flask(__name__)

LOG_DIR = Path("/var/lib/honeypot/logs")
LOG_DIR.mkdir(parents=True, exist_ok=True)


class HoneypotService:
    """Base class for emulated honeypot services."""

    def __init__(self, name, port):
        self.name = name
        self.port = port
        self.connections = []
        self.running = False
        self.sock = None

    def log_connection(self, src_ip, src_port, data=b""):
        entry = {
            "time": datetime.utcnow().isoformat(),
            "service": self.name,
            "port": self.port,
            "src_ip": src_ip,
            "src_port": src_port,
            "payload_hex": data[:512].hex() if data else "",
            "payload_ascii": data[:512].decode(errors="replace") if data else "",
            "payload_hash": hashlib.sha256(data).hexdigest() if data else "",
        }
        self.connections.append(entry)
        logger.warning("HONEYPOT [%s:%d] Connection from %s:%d (%d bytes)",
                       self.name, self.port, src_ip, src_port, len(data))

        # Append to daily log file
        log_file = LOG_DIR / f"{self.name}_{datetime.utcnow().strftime('%Y%m%d')}.jsonl"
        with open(log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")
        return entry


class SSHHoneypot(HoneypotService):
    """Fake SSH server that captures credentials."""

    def __init__(self, port=2222):
        super().__init__("ssh", port)
        self.banner = b"SSH-2.0-OpenSSH_7.9p1 Debian-10+deb10u2\r\n"

    def serve(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.settimeout(1.0)
        self.sock.bind(("0.0.0.0", self.port))
        self.sock.listen(5)
        self.running = True
        logger.info("SSH honeypot listening on port %d", self.port)

        while self.running:
            try:
                conn, addr = self.sock.accept()
                conn.settimeout(10)
                conn.send(self.banner)
                data = conn.recv(4096)
                self.log_connection(addr[0], addr[1], data)
                conn.close()
            except socket.timeout:
                continue
            except Exception as e:
                if self.running:
                    logger.error("SSH honeypot error: %s", e)


class TelnetHoneypot(HoneypotService):
    """Fake Telnet server mimicking a router login."""

    def __init__(self, port=2323):
        super().__init__("telnet", port)

    def serve(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.settimeout(1.0)
        self.sock.bind(("0.0.0.0", self.port))
        self.sock.listen(5)
        self.running = True
        logger.info("Telnet honeypot listening on port %d", self.port)

        while self.running:
            try:
                conn, addr = self.sock.accept()
                conn.settimeout(10)
                conn.send(b"\r\nMikroTik v6.48.6\r\nLogin: ")
                username = conn.recv(256)
                conn.send(b"Password: ")
                password = conn.recv(256)
                payload = username + b":" + password
                self.log_connection(addr[0], addr[1], payload)
                conn.send(b"\r\nLogin failed\r\n")
                time.sleep(2)
                conn.close()
            except socket.timeout:
                continue
            except Exception:
                pass


class HTTPHoneypot(HoneypotService):
    """Fake HTTP server that captures exploit attempts."""

    def __init__(self, port=8888):
        super().__init__("http", port)

    def serve(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.settimeout(1.0)
        self.sock.bind(("0.0.0.0", self.port))
        self.sock.listen(10)
        self.running = True
        logger.info("HTTP honeypot listening on port %d", self.port)

        fake_response = (
            b"HTTP/1.1 200 OK\r\nServer: Apache/2.4.29\r\n"
            b"Content-Type: text/html\r\n\r\n"
            b"<html><body><h1>It works!</h1></body></html>"
        )

        while self.running:
            try:
                conn, addr = self.sock.accept()
                conn.settimeout(10)
                data = conn.recv(8192)
                self.log_connection(addr[0], addr[1], data)
                conn.send(fake_response)
                conn.close()
            except socket.timeout:
                continue
            except Exception:
                pass


class PortScanDetector:
    """Detects port scanning activity by monitoring multiple honeypot services."""

    def __init__(self, services):
        self.services = services
        self.scan_alerts = []

    def analyze(self):
        """Check for IPs hitting multiple services (port scan indicator)."""
        ip_services = {}
        for svc in self.services:
            for conn in svc.connections[-100:]:
                ip = conn["src_ip"]
                if ip not in ip_services:
                    ip_services[ip] = set()
                ip_services[ip].add(conn["service"])

        alerts = []
        for ip, svcs in ip_services.items():
            if len(svcs) >= 2:
                alerts.append({
                    "ip": ip,
                    "services_probed": list(svcs),
                    "count": len(svcs),
                    "severity": "high" if len(svcs) >= 3 else "medium",
                })
        self.scan_alerts = alerts
        return alerts


# --- Initialize services ---
services = [SSHHoneypot(), TelnetHoneypot(), HTTPHoneypot()]
scanner = PortScanDetector(services)


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi Honeypot</title></head><body>
    <h1>Honeypot Dashboard</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),3000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    scanner.analyze()
    return jsonify({
        "services": [{"name": s.name, "port": s.port, "connections": len(s.connections),
                       "running": s.running} for s in services],
        "total_connections": sum(len(s.connections) for s in services),
        "scan_alerts": scanner.scan_alerts,
        "recent": [s.connections[-1] for s in services if s.connections],
    })

@app.route("/api/connections/<service_name>")
def api_connections(service_name):
    for s in services:
        if s.name == service_name:
            return jsonify({"connections": s.connections[-50:]})
    return jsonify({"error": "Unknown service"}), 404


if __name__ == "__main__":
    try:
        for svc in services:
            t = threading.Thread(target=svc.serve, daemon=True)
            t.start()
        logger.info("Starting Honeypot Dashboard on port 8087")
        app.run(host="0.0.0.0", port=8087, debug=False)
    except KeyboardInterrupt:
        for svc in services:
            svc.running = False
