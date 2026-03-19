#!/usr/bin/env python3
"""
Chrono Packet Time Machine - Raspberry Pi GPS/NTP Companion
GPS-timestamped packet capture and time-travel replay engine
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

class PacketTimeline:
    def __init__(self):
        self.packets = deque(maxlen=50000)
        self.bookmarks = {}
        self.capturing = False

    def start_capture(self):
        self.packets.clear()
        self.capturing = True

    def stop_capture(self):
        self.capturing = False
        return len(self.packets)

    def add_packet(self, data):
        if self.capturing:
            data["host_ns"] = time.time_ns()
            self.packets.append(data)

    def bookmark(self, name):
        self.bookmarks[name] = len(self.packets) - 1

    def get_range(self, start_idx, end_idx):
        pkts = list(self.packets)
        return pkts[max(0, start_idx):min(len(pkts), end_idx)]

    def get_stats(self):
        if not self.packets:
            return {"count": 0}
        times = [p.get("host_ns", 0) for p in self.packets]
        duration_s = (times[-1] - times[0]) / 1e9 if len(times) > 1 else 0
        return {"count": len(self.packets), "duration_s": duration_s,
                "rate_hz": len(self.packets) / max(duration_s, 0.001),
                "bookmarks": list(self.bookmarks.keys())}

    def search(self, field, value):
        results = []
        for i, p in enumerate(self.packets):
            if str(value) in str(p.get(field, "")):
                results.append(i)
        return results[:20]


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


class GPSRef:
    def __init__(self):
        self.serial = None
        self.fix = 0
        self.lat = 0.0
        self.lon = 0.0

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
                    if len(p) > 6:
                        self.fix = int(p[6]) if p[6] else 0
            except Exception:
                time.sleep(0.5)


class TimeMachineStation:
    def __init__(self):
        self.timeline = PacketTimeline()
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
            self.timeline.add_packet(data)
            data["ntp_offset_ns"] = self.ntp.offset_ns
            data["gps_fix"] = self.gps.fix
            data["timeline"] = self.timeline.get_stats()
            data["utc"] = datetime.now(timezone.utc).isoformat()
            print(json.dumps(data, default=str))
        except json.JSONDecodeError:
            if "[TM]" in line:
                print(line)

    def interactive_loop(self):
        while self.running:
            try:
                cmd = input("[TM]> ").strip()
                uc = cmd.upper()
                if uc == "CAP":
                    self.timeline.start_capture()
                    self.send_cmd("CAP")
                elif uc == "STOP":
                    n = self.timeline.stop_capture()
                    self.send_cmd("STOP")
                    print(f"[PI] Captured {n} packets")
                elif uc.startswith("PLAY"):
                    self.send_cmd(uc)
                elif uc.startswith("JUMP"):
                    self.send_cmd(uc)
                elif uc == "STATS":
                    print(json.dumps(self.timeline.get_stats(), indent=2))
                elif uc.startswith("BOOKMARK"):
                    name = cmd[9:].strip() or f"bm_{len(self.timeline.bookmarks)}"
                    self.timeline.bookmark(name)
                elif uc == "QUIT":
                    self.running = False
            except EOFError:
                break

    def run(self):
        print("[TIME-MACHINE] Packet Time Machine Station starting...")
        self.gps.connect()
        self.connect_esp()
        threading.Thread(target=self.gps.read_loop, daemon=True).start()
        threading.Thread(target=self.ntp_loop, daemon=True).start()
        threading.Thread(target=self.interactive_loop, daemon=True).start()

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
    TimeMachineStation().run()
