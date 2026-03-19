#!/usr/bin/env python3
"""
Chrono Relativistic Calculator - Raspberry Pi GPS/NTP Companion
GPS altitude + velocity for relativistic time dilation computations
"""

import serial
import time
import socket
import struct
import json
import math
import threading
from datetime import datetime, timezone
from collections import deque

GPS_PORT = "/dev/ttyAMA0"
GPS_BAUD = 9600
NTP_SERVER = "pool.ntp.org"
ESP32_PORT = "/dev/ttyUSB0"
ESP32_BAUD = 115200

C = 299792458.0
G = 6.674e-11
M_EARTH = 5.972e24
R_EARTH = 6.371e6

class RelativisticEngine:
    def __init__(self):
        self.altitude = 0.0
        self.velocity = 0.0
        self.lat = 0.0
        self.lon = 0.0
        self.history = deque(maxlen=1000)

    def gravitational_dilation(self, alt):
        r = R_EARTH + alt
        phi = -G * M_EARTH / r
        phi0 = -G * M_EARTH / R_EARTH
        return 1.0 + (phi - phi0) / (C * C)

    def velocity_dilation(self, v):
        beta = v / C
        return math.sqrt(1.0 - beta * beta)

    def total_dilation(self, alt, v):
        return self.gravitational_dilation(alt) * self.velocity_dilation(v)

    def elapsed_proper_time(self, coord_time_s, alt, v):
        return coord_time_s * self.total_dilation(alt, v)

    def drift_ns_per_day(self, alt1, v1, alt2, v2):
        d1 = self.total_dilation(alt1, v1)
        d2 = self.total_dilation(alt2, v2)
        return (d1 - d2) * 86400 * 1e9


class GPSReceiver:
    def __init__(self):
        self.serial = None
        self.lat = 0.0
        self.lon = 0.0
        self.alt = 0.0
        self.speed_knots = 0.0
        self.speed_ms = 0.0
        self.fix = 0
        self.sats = 0

    def connect(self):
        try:
            self.serial = serial.Serial(GPS_PORT, GPS_BAUD, timeout=1)
            return True
        except Exception:
            return False

    def parse_gga(self, parts):
        if len(parts) < 15:
            return
        self.fix = int(parts[6]) if parts[6] else 0
        self.sats = int(parts[7]) if parts[7] else 0
        self.alt = float(parts[9]) if parts[9] else 0.0
        if parts[2]:
            d = int(float(parts[2]) / 100)
            m = float(parts[2]) - d * 100
            self.lat = d + m / 60.0
            if parts[3] == "S": self.lat *= -1
        if parts[4]:
            d = int(float(parts[4]) / 100)
            m = float(parts[4]) - d * 100
            self.lon = d + m / 60.0
            if parts[5] == "W": self.lon *= -1

    def parse_vtg(self, parts):
        if len(parts) > 7 and parts[7]:
            self.speed_ms = float(parts[7]) / 3.6

    def read_loop(self):
        while True:
            try:
                if not self.serial:
                    time.sleep(1)
                    continue
                line = self.serial.readline().decode("ascii", errors="ignore").strip()
                if "GGA" in line:
                    self.parse_gga(line.split(","))
                elif "VTG" in line:
                    self.parse_vtg(line.split(","))
            except Exception:
                time.sleep(0.5)


class NTPClient:
    def __init__(self):
        self.offset_ns = 0
        self.rtt_ns = 0

    def query(self):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.settimeout(2)
            t1 = time.time_ns()
            s.sendto(b"\x1b" + 47 * b"\0", (NTP_SERVER, 123))
            d, _ = s.recvfrom(1024)
            t4 = time.time_ns()
            s.close()
            t2 = (struct.unpack("!I", d[32:36])[0] - 2208988800) * 10**9
            t3 = (struct.unpack("!I", d[40:44])[0] - 2208988800) * 10**9
            self.offset_ns = ((t2 - t1) + (t3 - t4)) // 2
            self.rtt_ns = (t4 - t1) - (t3 - t2)
            return True
        except Exception:
            return False


class RelativisticStation:
    def __init__(self):
        self.engine = RelativisticEngine()
        self.gps = GPSReceiver()
        self.ntp = NTPClient()
        self.esp = None
        self.running = True

    def connect_esp(self):
        try:
            self.esp = serial.Serial(ESP32_PORT, ESP32_BAUD, timeout=1)
            return True
        except Exception:
            return False

    def ntp_loop(self):
        while self.running:
            self.ntp.query()
            time.sleep(30)

    def send_to_esp(self):
        if self.esp:
            self.esp.write(f"ALT:{self.gps.alt}\n".encode())
            self.esp.write(f"VEL:{self.gps.speed_ms}\n".encode())

    def process_esp_data(self, line):
        try:
            data = json.loads(line)
            data["gps"] = {"lat": self.gps.lat, "lon": self.gps.lon,
                           "alt": self.gps.alt, "speed_ms": self.gps.speed_ms,
                           "fix": self.gps.fix, "sats": self.gps.sats}
            data["relativity"] = {
                "grav_dilation": self.engine.gravitational_dilation(self.gps.alt),
                "vel_dilation": self.engine.velocity_dilation(self.gps.speed_ms),
                "total_dilation": self.engine.total_dilation(self.gps.alt, self.gps.speed_ms),
                "ns_per_day_vs_sea": self.engine.drift_ns_per_day(self.gps.alt, self.gps.speed_ms, 0, 0)
            }
            data["ntp_offset_ns"] = self.ntp.offset_ns
            data["utc"] = datetime.now(timezone.utc).isoformat()
            print(json.dumps(data))
        except json.JSONDecodeError:
            pass

    def run(self):
        print("[RELATIV] Relativistic Calculator Station starting...")
        self.gps.connect()
        self.connect_esp()
        threading.Thread(target=self.gps.read_loop, daemon=True).start()
        threading.Thread(target=self.ntp_loop, daemon=True).start()

        while self.running:
            try:
                self.send_to_esp()
                if self.esp and self.esp.in_waiting:
                    line = self.esp.readline().decode("utf-8", errors="ignore").strip()
                    if line.startswith("{"):
                        self.process_esp_data(line)
                else:
                    time.sleep(0.05)
            except KeyboardInterrupt:
                self.running = False
            except Exception as e:
                print(f"[ERROR] {e}")
                time.sleep(0.5)


if __name__ == "__main__":
    RelativisticStation().run()
