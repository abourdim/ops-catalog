#!/usr/bin/env python3
"""
Chrono Temporal Triangulation - Raspberry Pi GPS/NTP Companion
GPS-assisted TDoA position estimation with NTP time reference
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

class TDoAEngine:
    def __init__(self):
        self.position_history = deque(maxlen=1000)
        self.anchor_positions = {}
        self.c = 299792458.0

    def add_estimate(self, x, y, z):
        self.position_history.append({"x": x, "y": y, "z": z, "t": time.time()})

    def set_anchor(self, node_id, x, y, z):
        self.anchor_positions[node_id] = {"x": x, "y": y, "z": z}

    def smooth_position(self, window=10):
        if len(self.position_history) < 2:
            return None
        recent = list(self.position_history)[-window:]
        return {"x": sum(p["x"] for p in recent) / len(recent),
                "y": sum(p["y"] for p in recent) / len(recent),
                "z": sum(p["z"] for p in recent) / len(recent)}

    def accuracy_estimate(self, window=20):
        if len(self.position_history) < 3:
            return float("inf")
        recent = list(self.position_history)[-window:]
        mx = sum(p["x"] for p in recent) / len(recent)
        my = sum(p["y"] for p in recent) / len(recent)
        dists = [math.sqrt((p["x"]-mx)**2 + (p["y"]-my)**2) for p in recent]
        return sum(dists) / len(dists)


class GPSReceiver:
    def __init__(self):
        self.serial = None
        self.lat = 0.0
        self.lon = 0.0
        self.alt = 0.0
        self.fix = 0

    def connect(self):
        try:
            self.serial = serial.Serial(GPS_PORT, GPS_BAUD, timeout=1)
            return True
        except Exception:
            return False

    def read_loop(self):
        while True:
            try:
                if not self.serial:
                    time.sleep(1)
                    continue
                line = self.serial.readline().decode("ascii", errors="ignore").strip()
                if "GGA" in line:
                    p = line.split(",")
                    if len(p) > 9:
                        self.fix = int(p[6]) if p[6] else 0
                        self.alt = float(p[9]) if p[9] else 0
                        if p[2]:
                            d = int(float(p[2]) / 100)
                            m = float(p[2]) - d * 100
                            self.lat = d + m / 60
                            if p[3] == "S": self.lat *= -1
                        if p[4]:
                            d = int(float(p[4]) / 100)
                            m = float(p[4]) - d * 100
                            self.lon = d + m / 60
                            if p[5] == "W": self.lon *= -1
            except Exception:
                time.sleep(0.5)


class NTPSync:
    def __init__(self):
        self.offset_ns = 0

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
            return True
        except Exception:
            return False


class TriangulationStation:
    def __init__(self):
        self.tdoa = TDoAEngine()
        self.gps = GPSReceiver()
        self.ntp = NTPSync()
        self.esp = None
        self.running = True

    def connect_esp(self):
        try:
            self.esp = serial.Serial(ESP32_PORT, ESP32_BAUD, timeout=1)
            print("[ESP32] Connected")
            return True
        except Exception:
            return False

    def ntp_loop(self):
        while self.running:
            self.ntp.query()
            time.sleep(30)

    def process_esp_data(self, line):
        try:
            data = json.loads(line)
            est = data.get("est", [0, 0, 0])
            if len(est) == 3:
                self.tdoa.add_estimate(*est)
            for a in data.get("anchors", []):
                pos = a.get("pos", [0, 0, 0])
                self.tdoa.set_anchor(a.get("id"), *pos)

            smooth = self.tdoa.smooth_position()
            data["smoothed"] = smooth
            data["accuracy_m"] = self.tdoa.accuracy_estimate()
            data["gps"] = {"lat": self.gps.lat, "lon": self.gps.lon,
                          "alt": self.gps.alt, "fix": self.gps.fix}
            data["ntp_offset_ns"] = self.ntp.offset_ns
            data["utc"] = datetime.now(timezone.utc).isoformat()
            print(json.dumps(data, default=str))
        except json.JSONDecodeError:
            if "[TRIANG]" in line:
                print(line)

    def run(self):
        print("[TRIANGULATION] Station starting...")
        self.gps.connect()
        self.connect_esp()
        threading.Thread(target=self.gps.read_loop, daemon=True).start()
        threading.Thread(target=self.ntp_loop, daemon=True).start()

        while self.running:
            try:
                if self.esp and self.esp.in_waiting:
                    line = self.esp.readline().decode("utf-8", errors="ignore").strip()
                    if line:
                        self.process_esp_data(line)
                else:
                    time.sleep(0.01)
            except KeyboardInterrupt:
                self.running = False
            except Exception as e:
                print(f"[ERROR] {e}")
                time.sleep(0.5)


if __name__ == "__main__":
    TriangulationStation().run()
