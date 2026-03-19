#!/usr/bin/env python3
"""
Pi Clock Station
Precision NTP-synchronized clock with GPS disciplined oscillator support.
Drives LED/LCD displays and serves time via NTP to local network.
"""

import os
import time
import json
import socket
import struct
import logging
import threading
from datetime import datetime, timezone

try:
    import RPi.GPIO as GPIO
    import smbus2
    import serial
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()
    smbus2 = MagicMock()
    serial = MagicMock()

from flask import Flask, jsonify, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("clock-station")

app = Flask(__name__)

# --- Configuration ---
GPS_SERIAL_PORT = "/dev/ttyAMA0"
GPS_BAUD = 9600
PPS_PIN = 18               # GPS PPS input
I2C_DISPLAY_ADDR = 0x3C    # SSD1306 OLED or HT16K33 7-segment
NTP_PORT = 123
STRATUM = 1  # GPS-disciplined = stratum 1


class GPSTimeSource:
    """GPS NMEA parser for precision time reference."""

    def __init__(self, port=GPS_SERIAL_PORT, baud=GPS_BAUD):
        self.port = port
        self.baud = baud
        self.serial_conn = None
        self.gps_time = None
        self.gps_date = None
        self.latitude = None
        self.longitude = None
        self.fix_quality = 0
        self.satellites = 0
        self.pps_count = 0
        self.lock = threading.Lock()

    def connect(self):
        try:
            self.serial_conn = serial.Serial(self.port, self.baud, timeout=1)
            logger.info("GPS connected on %s", self.port)
            return True
        except Exception as e:
            logger.warning("GPS connection failed: %s", e)
            return False

    def parse_nmea(self, sentence):
        """Parse NMEA sentences for time and position."""
        if not sentence.startswith("$"):
            return
        try:
            parts = sentence.split(",")
            msg_type = parts[0]

            if msg_type in ("$GPRMC", "$GNRMC"):
                with self.lock:
                    self.gps_time = parts[1][:6]  # HHMMSS
                    if parts[9]:
                        self.gps_date = parts[9]  # DDMMYY

            elif msg_type in ("$GPGGA", "$GNGGA"):
                with self.lock:
                    self.gps_time = parts[1][:6]
                    self.fix_quality = int(parts[6]) if parts[6] else 0
                    self.satellites = int(parts[7]) if parts[7] else 0
                    if parts[2] and parts[4]:
                        self.latitude = self._parse_coord(parts[2], parts[3])
                        self.longitude = self._parse_coord(parts[4], parts[5])
        except (IndexError, ValueError):
            pass

    def _parse_coord(self, value, direction):
        """Convert NMEA coordinate to decimal degrees."""
        if not value:
            return None
        deg = int(float(value) / 100)
        minutes = float(value) - deg * 100
        result = deg + minutes / 60.0
        if direction in ("S", "W"):
            result = -result
        return round(result, 6)

    def get_utc_datetime(self):
        """Get current UTC datetime from GPS."""
        with self.lock:
            if self.gps_time and self.gps_date:
                try:
                    dt_str = f"{self.gps_date}{self.gps_time}"
                    return datetime.strptime(dt_str, "%d%m%y%H%M%S").replace(tzinfo=timezone.utc)
                except ValueError:
                    pass
        return datetime.now(timezone.utc)

    def read_loop(self):
        """Continuous GPS reading thread."""
        while True:
            if self.serial_conn and self.serial_conn.is_open:
                try:
                    line = self.serial_conn.readline().decode(errors="replace").strip()
                    if line:
                        self.parse_nmea(line)
                except Exception:
                    time.sleep(1)
            else:
                time.sleep(5)
                self.connect()


class NTPServer:
    """Minimal NTP server responding with GPS-disciplined time."""

    def __init__(self, gps_source, port=NTP_PORT):
        self.gps = gps_source
        self.port = port
        self.requests_served = 0

    def _make_ntp_timestamp(self, dt):
        """Convert datetime to NTP timestamp (seconds since 1900-01-01)."""
        ntp_epoch = datetime(1900, 1, 1, tzinfo=timezone.utc)
        delta = dt - ntp_epoch
        return int(delta.total_seconds())

    def serve(self):
        """Run NTP server loop."""
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.bind(("0.0.0.0", self.port))
        logger.info("NTP server listening on port %d", self.port)

        while True:
            try:
                data, addr = sock.recvfrom(48)
                now = self.gps.get_utc_datetime()
                ntp_time = self._make_ntp_timestamp(now)

                # Build NTP response packet
                response = bytearray(48)
                response[0] = 0x24  # LI=0, VN=4, Mode=4 (server)
                response[1] = STRATUM
                response[2] = 6     # Poll interval
                response[3] = 0xEC  # Precision (-20 = ~1us with GPS)

                # Reference timestamp, originate, receive, transmit
                for offset in [16, 24, 32, 40]:
                    struct.pack_into("!I", response, offset, ntp_time)
                    struct.pack_into("!I", response, offset + 4, 0)

                sock.sendto(bytes(response), addr)
                self.requests_served += 1
            except Exception as e:
                logger.error("NTP serve error: %s", e)


class DisplayDriver:
    """Drives I2C 7-segment or OLED display for time readout."""

    def __init__(self):
        self.bus = None
        try:
            self.bus = smbus2.SMBus(1)
        except Exception:
            pass

    def update_display(self, time_str):
        """Write time string to I2C display."""
        if not self.bus:
            return
        try:
            data = [ord(c) for c in time_str[:8]]
            self.bus.write_i2c_block_data(I2C_DISPLAY_ADDR, 0x00, data)
        except Exception:
            pass


# --- Initialize subsystems ---
gps = GPSTimeSource()
ntp_server = NTPServer(gps)
display = DisplayDriver()

# PPS interrupt setup
GPIO.setmode(GPIO.BCM)
GPIO.setup(PPS_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
GPIO.add_event_detect(PPS_PIN, GPIO.RISING, callback=lambda ch: setattr(gps, 'pps_count', gps.pps_count + 1))


def display_update_loop():
    while True:
        now = gps.get_utc_datetime()
        display.update_display(now.strftime("%H:%M:%S"))
        time.sleep(0.5)


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi Clock Station</title></head><body>
    <h1>GPS Clock Station</h1>
    <div id="s" style="font-size:48px;font-family:monospace"></div>
    <script>setInterval(()=>fetch('/api/time').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=d.utc;
    }),500);</script></body></html>
    """)

@app.route("/api/time")
def api_time():
    now = gps.get_utc_datetime()
    return jsonify({
        "utc": now.strftime("%Y-%m-%d %H:%M:%S UTC"),
        "unix": now.timestamp(),
        "gps_fix": gps.fix_quality,
        "satellites": gps.satellites,
        "pps_count": gps.pps_count,
        "position": {"lat": gps.latitude, "lon": gps.longitude},
        "ntp_requests": ntp_server.requests_served,
        "stratum": STRATUM,
    })

@app.route("/api/status")
def api_status():
    return api_time()


if __name__ == "__main__":
    try:
        gps.connect()
        threading.Thread(target=gps.read_loop, daemon=True).start()
        threading.Thread(target=ntp_server.serve, daemon=True).start()
        threading.Thread(target=display_update_loop, daemon=True).start()
        logger.info("Starting Clock Station on port 8086")
        app.run(host="0.0.0.0", port=8086, debug=False)
    except KeyboardInterrupt:
        pass
    finally:
        GPIO.cleanup()
