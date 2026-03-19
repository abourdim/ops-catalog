#!/usr/bin/env python3
"""
Pi APRS iGate / Digipeater
Receives APRS packets via radio (TNC), forwards to APRS-IS network,
and digipeats local packets. Uses Direwolf or hardware TNC.
"""

import os
import time
import json
import socket
import logging
import threading
import subprocess
from datetime import datetime
from flask import Flask, jsonify, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("igate")

app = Flask(__name__)

# --- Configuration ---
CALLSIGN = "N0CALL-10"
PASSCODE = "-1"  # APRS-IS passcode
APRS_SERVER = "rotate.aprs2.net"
APRS_PORT = 14580
KISS_HOST = "127.0.0.1"
KISS_PORT = 8001
FILTER_RANGE = "r/35.0/-106.0/100"  # 100km radius filter
DIGI_PATHS = ["WIDE1-1", "WIDE2-1"]


class APRSPacket:
    """Represents a decoded APRS packet."""

    def __init__(self, raw):
        self.raw = raw.strip()
        self.source = ""
        self.destination = ""
        self.path = []
        self.info = ""
        self.packet_type = "unknown"
        self._parse()

    def _parse(self):
        try:
            header, self.info = self.raw.split(":", 1)
            src_dest, *path_parts = header.split(",")
            self.source, self.destination = src_dest.split(">")
            self.path = path_parts

            if self.info.startswith("!") or self.info.startswith("/") or self.info.startswith("@"):
                self.packet_type = "position"
            elif self.info.startswith(":"):
                self.packet_type = "message"
            elif self.info.startswith(">"):
                self.packet_type = "status"
            elif self.info.startswith("T#"):
                self.packet_type = "telemetry"
        except (ValueError, IndexError):
            pass

    def __str__(self):
        return self.raw


class APRSISConnection:
    """Manages connection to APRS-IS server."""

    def __init__(self, callsign, passcode, server, port):
        self.callsign = callsign
        self.passcode = passcode
        self.server = server
        self.port = port
        self.sock = None
        self.connected = False
        self.packets_sent = 0
        self.packets_received = 0

    def connect(self):
        try:
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.sock.settimeout(30)
            self.sock.connect((self.server, self.port))

            # Read server banner
            banner = self.sock.recv(512).decode(errors="replace")
            logger.info("APRS-IS banner: %s", banner.strip())

            # Send login
            login = f"user {self.callsign} pass {self.passcode} vers PiIGate 1.0 filter {FILTER_RANGE}\r\n"
            self.sock.send(login.encode())

            response = self.sock.recv(256).decode(errors="replace")
            if "verified" in response.lower() or "unverified" in response.lower():
                self.connected = True
                logger.info("Connected to APRS-IS: %s", response.strip())
                return True
        except Exception as e:
            logger.error("APRS-IS connection failed: %s", e)
        return False

    def send_packet(self, packet_str):
        if not self.connected:
            return False
        try:
            self.sock.send((packet_str + "\r\n").encode())
            self.packets_sent += 1
            return True
        except Exception as e:
            logger.error("Send failed: %s", e)
            self.connected = False
            return False

    def receive_loop(self, callback):
        """Continuously receive packets from APRS-IS."""
        while self.connected:
            try:
                data = self.sock.recv(4096).decode(errors="replace")
                if not data:
                    self.connected = False
                    break
                for line in data.strip().split("\n"):
                    line = line.strip()
                    if line and not line.startswith("#"):
                        self.packets_received += 1
                        callback(APRSPacket(line))
            except socket.timeout:
                # Send keepalive
                try:
                    self.sock.send(b"#keepalive\r\n")
                except Exception:
                    self.connected = False
            except Exception:
                self.connected = False


class KISSInterface:
    """KISS TNC interface for local radio packet I/O."""

    def __init__(self, host=KISS_HOST, port=KISS_PORT):
        self.host = host
        self.port = port
        self.sock = None

    def connect(self):
        try:
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.sock.connect((self.host, self.port))
            logger.info("KISS TNC connected at %s:%d", self.host, self.port)
            return True
        except Exception as e:
            logger.warning("KISS connect failed: %s", e)
            return False

    def send_frame(self, ax25_data):
        """Send AX.25 frame via KISS."""
        if not self.sock:
            return
        kiss_frame = bytearray([0xC0, 0x00]) + ax25_data + bytearray([0xC0])
        self.sock.send(kiss_frame)

    def receive_frame(self):
        """Receive a KISS frame."""
        if not self.sock:
            return None
        try:
            data = self.sock.recv(1024)
            if data and data[0] == 0xC0 and data[-1] == 0xC0:
                return bytes(data[2:-1])  # Strip KISS framing
        except Exception:
            pass
        return None


class IGateDigipeater:
    """Main iGate/Digipeater controller."""

    def __init__(self):
        self.aprs_is = APRSISConnection(CALLSIGN, PASSCODE, APRS_SERVER, APRS_PORT)
        self.kiss = KISSInterface()
        self.heard_stations = {}
        self.packet_log = []
        self.digipeated_count = 0

    def on_aprs_packet(self, packet):
        """Handle incoming APRS packet from APRS-IS or radio."""
        self.heard_stations[packet.source] = {
            "last_heard": datetime.utcnow().isoformat(),
            "type": packet.packet_type,
        }
        self.packet_log.append({
            "time": datetime.utcnow().isoformat(),
            "from": packet.source,
            "to": packet.destination,
            "type": packet.packet_type,
            "raw": str(packet)[:200],
        })
        # Keep last 500 entries
        if len(self.packet_log) > 500:
            self.packet_log = self.packet_log[-500:]

    def should_digipeat(self, packet):
        """Check if packet should be digipeated."""
        for path_element in packet.path:
            for digi_path in DIGI_PATHS:
                alias = digi_path.split("-")[0]
                if path_element.startswith(alias) and "*" not in path_element:
                    return True
        return False

    def gate_to_is(self, packet):
        """Forward radio packet to APRS-IS (iGate function)."""
        gated = f"{packet.source}>{packet.destination},qAR,{CALLSIGN}:{packet.info}"
        self.aprs_is.send_packet(gated)
        logger.info("iGated: %s -> APRS-IS", packet.source)

    def get_status(self):
        return {
            "callsign": CALLSIGN,
            "aprs_is_connected": self.aprs_is.connected,
            "packets_sent": self.aprs_is.packets_sent,
            "packets_received": self.aprs_is.packets_received,
            "stations_heard": len(self.heard_stations),
            "digipeated": self.digipeated_count,
            "recent_packets": self.packet_log[-20:],
        }


igate = IGateDigipeater()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi iGate</title></head><body>
    <h1>APRS iGate / Digipeater</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),3000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(igate.get_status())

@app.route("/api/stations")
def api_stations():
    return jsonify(igate.heard_stations)


if __name__ == "__main__":
    try:
        igate.aprs_is.connect()
        igate.kiss.connect()
        threading.Thread(target=igate.aprs_is.receive_loop, args=(igate.on_aprs_packet,), daemon=True).start()
        logger.info("Starting iGate on port 8088")
        app.run(host="0.0.0.0", port=8088, debug=False)
    except KeyboardInterrupt:
        pass
