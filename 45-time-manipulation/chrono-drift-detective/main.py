#!/usr/bin/env python3
"""
Chrono Drift Detective - Raspberry Pi GPS/NTP Companion
GPS/NTP-referenced clock drift anomaly detection system
"""

import serial
import time
import socket
import struct
import json
import threading
import statistics
from datetime import datetime, timezone
from collections import deque, defaultdict

GPS_PORT = "/dev/ttyAMA0"
GPS_BAUD = 9600
NTP_SERVER = "pool.ntp.org"
ESP32_PORT = "/dev/ttyUSB0"
ESP32_BAUD = 115200

class DriftDatabase:
    def __init__(self):
        self.suspects = defaultdict(lambda: {
            "drift_ppm": deque(maxlen=500),
            "trend": deque(maxlen=500),
            "timestamps": deque(maxlen=500),
            "anomalies": 0, "first_seen": None
        })

    def update(self, node_id, drift_ppm, trend, anomaly):
        s = self.suspects[node_id]
        if not s["first_seen"]:
            s["first_seen"] = datetime.now(timezone.utc).isoformat()
        s["drift_ppm"].append(drift_ppm)
        s["trend"].append(trend)
        s["timestamps"].append(time.time())
        if anomaly:
            s["anomalies"] += 1

    def get_report(self, node_id):
        s = self.suspects.get(node_id)
        if not s or len(s["drift_ppm"]) < 2:
            return None
        drifts = list(s["drift_ppm"])
        return {
            "node": node_id,
            "mean_drift_ppm": statistics.mean(drifts),
            "max_drift_ppm": max(abs(d) for d in drifts),
            "drift_stdev": statistics.stdev(drifts) if len(drifts) > 1 else 0,
            "anomaly_count": s["anomalies"],
            "sample_count": len(drifts),
            "first_seen": s["first_seen"]
        }

    def get_all_reports(self):
        return {nid: self.get_report(nid) for nid in self.suspects
                if self.get_report(nid)}


class NTPSync:
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


class GPSRef:
    def __init__(self):
        self.serial = None
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
                    self.fix = int(p[6]) if len(p) > 6 and p[6] else 0
            except Exception:
                time.sleep(0.5)


class DriftStation:
    def __init__(self):
        self.db = DriftDatabase()
        self.ntp = NTPSync()
        self.gps = GPSRef()
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
            for suspect in data.get("suspects", []):
                sid = suspect.get("id", "")
                self.db.update(sid, suspect.get("drift_ppm", 0),
                              suspect.get("trend", 0), suspect.get("anomaly", False))
            data["ntp_offset_ns"] = self.ntp.offset_ns
            data["gps_fix"] = self.gps.fix
            data["case_files"] = self.db.get_all_reports()
            data["utc"] = datetime.now(timezone.utc).isoformat()
            print(json.dumps(data, default=str))
        except json.JSONDecodeError:
            if "[DRIFT]" in line:
                print(line)

    def run(self):
        print("[DRIFT-DETECTIVE] Station starting...")
        self.gps.connect()
        self.connect_esp()
        threading.Thread(target=self.gps.read_loop, daemon=True).start()
        threading.Thread(target=self.ntp_loop, daemon=True).start()

        while self.running:
            try:
                if self.esp and self.esp.in_waiting:
                    line = self.esp.readline().decode("utf-8", errors="ignore").strip()
                    if line.startswith("{"):
                        self.process_esp_data(line)
                else:
                    time.sleep(0.01)
            except KeyboardInterrupt:
                self.running = False
            except Exception as e:
                print(f"[ERROR] {e}")
                time.sleep(0.5)


if __name__ == "__main__":
    DriftStation().run()
