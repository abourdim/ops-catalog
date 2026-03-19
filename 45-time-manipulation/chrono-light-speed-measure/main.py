#!/usr/bin/env python3
"""
Chrono Light Speed Measure - Raspberry Pi GPS/NTP Companion
GPS-calibrated distance reference for speed-of-light measurements
"""

import serial
import time
import socket
import struct
import json
import math
import threading
import statistics
from datetime import datetime, timezone
from collections import deque

GPS_PORT = "/dev/ttyAMA0"
GPS_BAUD = 9600
NTP_SERVER = "pool.ntp.org"
ESP32_PORT = "/dev/ttyUSB0"
ESP32_BAUD = 115200
C_ACTUAL = 299792458.0

class MeasurementLog:
    def __init__(self):
        self.trials = deque(maxlen=1000)

    def add_trial(self, node_id, distance_m, rtt_min_us, rtt_avg_us, measured_c):
        self.trials.append({
            "node": node_id, "distance_m": distance_m,
            "rtt_min_us": rtt_min_us, "rtt_avg_us": rtt_avg_us,
            "measured_c": measured_c, "error_pct": (measured_c - C_ACTUAL) / C_ACTUAL * 100,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })

    def get_best_estimate(self):
        if not self.trials:
            return None
        cs = [t["measured_c"] for t in self.trials if t["measured_c"] > 0]
        if not cs:
            return None
        return {"mean_c": statistics.mean(cs),
                "median_c": statistics.median(cs),
                "stdev": statistics.stdev(cs) if len(cs) > 1 else 0,
                "n_trials": len(cs),
                "best_error_pct": min(abs((c - C_ACTUAL) / C_ACTUAL * 100) for c in cs)}


class GPSDistance:
    def __init__(self):
        self.serial = None
        self.lat = 0.0
        self.lon = 0.0
        self.alt = 0.0
        self.fix = 0
        self.waypoints = []

    def connect(self):
        try:
            self.serial = serial.Serial(GPS_PORT, GPS_BAUD, timeout=1)
            return True
        except Exception:
            return False

    def mark_waypoint(self):
        self.waypoints.append({"lat": self.lat, "lon": self.lon, "alt": self.alt})
        return len(self.waypoints) - 1

    def distance_between(self, wp1, wp2):
        if wp1 >= len(self.waypoints) or wp2 >= len(self.waypoints):
            return 0
        a, b = self.waypoints[wp1], self.waypoints[wp2]
        R = 6371000
        dlat = math.radians(b["lat"] - a["lat"])
        dlon = math.radians(b["lon"] - a["lon"])
        x = math.sin(dlat/2)**2 + math.cos(math.radians(a["lat"])) * \
            math.cos(math.radians(b["lat"])) * math.sin(dlon/2)**2
        return R * 2 * math.atan2(math.sqrt(x), math.sqrt(1-x))

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
                            d = int(float(p[2])/100)
                            self.lat = d + (float(p[2]) - d*100)/60
                            if p[3] == "S": self.lat *= -1
                        if p[4]:
                            d = int(float(p[4])/100)
                            self.lon = d + (float(p[4]) - d*100)/60
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


class LightSpeedStation:
    def __init__(self):
        self.log = MeasurementLog()
        self.gps = GPSDistance()
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

    def send_cmd(self, cmd):
        if self.esp:
            self.esp.write((cmd + "\n").encode())

    def ntp_loop(self):
        while self.running:
            self.ntp.query()
            time.sleep(30)

    def process_esp_data(self, line):
        try:
            data = json.loads(line)
            data["gps"] = {"lat": self.gps.lat, "lon": self.gps.lon,
                          "alt": self.gps.alt, "fix": self.gps.fix}
            data["ntp_offset_ns"] = self.ntp.offset_ns
            data["best_estimate"] = self.log.get_best_estimate()
            data["c_actual"] = C_ACTUAL
            data["utc"] = datetime.now(timezone.utc).isoformat()
            print(json.dumps(data, default=str))
        except json.JSONDecodeError:
            if "[LIGHT]" in line:
                print(line)

    def run(self):
        print("[LIGHT-SPEED] Station starting...")
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
    LightSpeedStation().run()
