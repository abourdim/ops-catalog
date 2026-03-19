#!/usr/bin/env python3
"""
Chrono Chronos Beacon - Raspberry Pi GPS/NTP Companion
GPS PPS-disciplined master clock feeding ESP32 beacon network
"""

import serial
import time
import socket
import struct
import json
import threading
from datetime import datetime, timezone
from collections import deque

GPS_PORT = "/dev/ttyAMA0"
GPS_BAUD = 9600
NTP_SERVER = "pool.ntp.org"
ESP32_PORT = "/dev/ttyUSB0"
ESP32_BAUD = 115200

class GPSClock:
    def __init__(self):
        self.serial = None
        self.utc_time = ""
        self.fix = 0
        self.sats = 0
        self.pps_count = 0
        self.pps_intervals = deque(maxlen=100)
        self.last_pps_ns = 0
        self.locked = False

    def connect(self):
        try:
            self.serial = serial.Serial(GPS_PORT, GPS_BAUD, timeout=1)
            print("[GPS] Connected")
            return True
        except Exception as e:
            print(f"[GPS] Failed: {e}")
            return False

    def read_loop(self):
        while True:
            try:
                if not self.serial:
                    time.sleep(1)
                    continue
                line = self.serial.readline().decode("ascii", errors="ignore").strip()
                now_ns = time.time_ns()
                if "RMC" in line:
                    if self.last_pps_ns > 0:
                        interval = now_ns - self.last_pps_ns
                        self.pps_intervals.append(interval)
                        if len(self.pps_intervals) > 10:
                            avg = sum(self.pps_intervals) / len(self.pps_intervals)
                            self.locked = abs(avg - 1e9) < 10000
                    self.last_pps_ns = now_ns
                    self.pps_count += 1
                    parts = line.split(",")
                    if len(parts) > 1:
                        self.utc_time = parts[1]
                elif "GGA" in line:
                    parts = line.split(",")
                    if len(parts) > 7:
                        self.fix = int(parts[6]) if parts[6] else 0
                        self.sats = int(parts[7]) if parts[7] else 0
            except Exception:
                time.sleep(0.5)

    def get_accuracy_ns(self):
        if not self.locked or not self.pps_intervals:
            return 1000000.0
        import statistics
        if len(self.pps_intervals) > 2:
            return statistics.stdev(self.pps_intervals)
        return 100000.0


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


class BeaconMaster:
    def __init__(self):
        self.gps = GPSClock()
        self.ntp = NTPSync()
        self.esp = None
        self.running = True
        self.sync_count = 0

    def connect_esp(self):
        try:
            self.esp = serial.Serial(ESP32_PORT, ESP32_BAUD, timeout=1)
            print("[ESP32] Connected")
            return True
        except Exception:
            return False

    def send_utc_to_esp(self):
        if not self.esp:
            return
        utc_us = int(time.time() * 1e6)
        self.esp.write(f"UTC:{utc_us}\n".encode())
        acc = self.gps.get_accuracy_ns()
        self.esp.write(f"ACC:{acc}\n".encode())
        self.sync_count += 1

    def ntp_loop(self):
        while self.running:
            if self.ntp.query():
                print(f"[NTP] offset={self.ntp.offset_ns}ns rtt={self.ntp.rtt_ns}ns")
            time.sleep(30)

    def sync_loop(self):
        while self.running:
            self.send_utc_to_esp()
            time.sleep(1)

    def process_esp_data(self, line):
        try:
            data = json.loads(line)
            data["master"] = {
                "gps_fix": self.gps.fix, "gps_sats": self.gps.sats,
                "gps_locked": self.gps.locked, "pps_count": self.gps.pps_count,
                "accuracy_ns": self.gps.get_accuracy_ns(),
                "ntp_offset_ns": self.ntp.offset_ns,
                "sync_count": self.sync_count
            }
            data["utc"] = datetime.now(timezone.utc).isoformat()
            print(json.dumps(data))
        except json.JSONDecodeError:
            if "[BEACON]" in line:
                print(line)

    def run(self):
        print("[CHRONOS-BEACON] Master Beacon Station starting...")
        self.gps.connect()
        self.connect_esp()
        threading.Thread(target=self.gps.read_loop, daemon=True).start()
        threading.Thread(target=self.ntp_loop, daemon=True).start()
        threading.Thread(target=self.sync_loop, daemon=True).start()

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
    BeaconMaster().run()
