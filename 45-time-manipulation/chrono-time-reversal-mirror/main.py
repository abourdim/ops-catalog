#!/usr/bin/env python3
"""
Chrono Time Reversal Mirror - Raspberry Pi GPS/NTP Companion
GPS-timestamped recording and time-reversed replay of network events
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

class TimelineRecorder:
    def __init__(self):
        self.events = deque(maxlen=10000)
        self.recording = False
        self.rec_start = 0

    def start(self):
        self.events.clear()
        self.rec_start = time.time_ns()
        self.recording = True

    def stop(self):
        self.recording = False
        return len(self.events)

    def add_event(self, data):
        if self.recording:
            data["rel_ns"] = time.time_ns() - self.rec_start
            self.events.append(data)

    def get_reversed(self):
        evts = list(self.events)
        if not evts:
            return []
        total = evts[-1].get("rel_ns", 0)
        reversed_evts = []
        for e in reversed(evts):
            re = dict(e)
            re["rel_ns"] = total - e.get("rel_ns", 0)
            reversed_evts.append(re)
        reversed_evts.sort(key=lambda x: x["rel_ns"])
        return reversed_evts

    def get_stats(self):
        if not self.events:
            return {"count": 0}
        times = [e.get("rel_ns", 0) for e in self.events]
        return {"count": len(self.events), "duration_ms": (times[-1] - times[0]) / 1e6,
                "rate_hz": len(self.events) / max((times[-1] - times[0]) / 1e9, 0.001)}


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


class GPSTime:
    def __init__(self):
        self.serial = None
        self.utc = ""
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
                    if len(p) > 6:
                        self.utc = p[1]
                        self.fix = int(p[6]) if p[6] else 0
            except Exception:
                time.sleep(0.5)


class MirrorStation:
    def __init__(self):
        self.recorder = TimelineRecorder()
        self.ntp = NTPSync()
        self.gps = GPSTime()
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
            print(f"[CMD] Sent: {cmd}")

    def ntp_loop(self):
        while self.running:
            self.ntp.query()
            time.sleep(30)

    def process_esp_data(self, line):
        try:
            data = json.loads(line)
            data["host_ns"] = time.time_ns()
            data["ntp_off_ns"] = self.ntp.offset_ns
            data["gps_fix"] = self.gps.fix
            data["utc"] = datetime.now(timezone.utc).isoformat()
            self.recorder.add_event(data)
            data["timeline"] = self.recorder.get_stats()
            print(json.dumps(data, default=str))
        except json.JSONDecodeError:
            if "[MIRROR]" in line:
                print(line)

    def interactive_loop(self):
        import sys
        while self.running:
            try:
                cmd = input().strip().upper()
                if cmd == "REC":
                    self.recorder.start()
                    self.send_cmd("REC")
                elif cmd == "STOP":
                    n = self.recorder.stop()
                    self.send_cmd("STOP")
                    print(f"[PI] Stopped. {n} events recorded.")
                elif cmd == "PLAY":
                    self.send_cmd("PLAY")
                elif cmd == "REVERSE":
                    rev = self.recorder.get_reversed()
                    print(f"[PI] Reversed {len(rev)} events")
                    self.send_cmd("REVERSE")
                elif cmd == "STATS":
                    print(json.dumps(self.recorder.get_stats()))
            except EOFError:
                break

    def run(self):
        print("[MIRROR-STATION] Time Reversal Mirror Station starting...")
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
    MirrorStation().run()
