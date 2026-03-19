#!/usr/bin/env python3
"""
Chrono Temporal Steganography - Raspberry Pi GPS/NTP Companion
GPS-disciplined timing analysis for temporal steganography detection
"""

import serial
import time
import socket
import struct
import json
import threading
import statistics
from datetime import datetime, timezone
from collections import deque

GPS_PORT = "/dev/ttyAMA0"
GPS_BAUD = 9600
NTP_SERVER = "pool.ntp.org"
ESP32_PORT = "/dev/ttyUSB0"
ESP32_BAUD = 115200

BIT_0_DELAY_US = 1000
BIT_1_DELAY_US = 2000
TOLERANCE_US = 300

class TimingAnalyzer:
    def __init__(self):
        self.gaps = deque(maxlen=5000)
        self.detected_bits = []
        self.messages = []

    def add_gap(self, gap_us):
        self.gaps.append(gap_us)

    def analyze_pattern(self):
        if len(self.gaps) < 8:
            return None
        recent = list(self.gaps)[-64:]
        bit_0_count = sum(1 for g in recent if abs(g - BIT_0_DELAY_US) < TOLERANCE_US)
        bit_1_count = sum(1 for g in recent if abs(g - BIT_1_DELAY_US) < TOLERANCE_US)
        total = bit_0_count + bit_1_count
        if total > len(recent) * 0.7:
            return {"stego_detected": True, "confidence": total / len(recent),
                    "bit_0": bit_0_count, "bit_1": bit_1_count}
        return {"stego_detected": False, "confidence": total / len(recent)}

    def get_jitter_stats(self):
        if len(self.gaps) < 2:
            return {}
        g = list(self.gaps)
        return {"mean": statistics.mean(g), "stdev": statistics.stdev(g) if len(g) > 1 else 0,
                "min": min(g), "max": max(g), "count": len(g)}


class NTPSync:
    def __init__(self, server=NTP_SERVER):
        self.server = server
        self.offset_ns = 0
        self.rtt_ns = 0

    def query(self):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.settimeout(2)
            pkt = b"\x1b" + 47 * b"\0"
            t1 = time.time_ns()
            sock.sendto(pkt, (self.server, 123))
            data, _ = sock.recvfrom(1024)
            t4 = time.time_ns()
            sock.close()
            t2_s = struct.unpack("!I", data[32:36])[0] - 2208988800
            t3_s = struct.unpack("!I", data[40:44])[0] - 2208988800
            t2 = int(t2_s * 1e9)
            t3 = int(t3_s * 1e9)
            self.offset_ns = ((t2 - t1) + (t3 - t4)) // 2
            self.rtt_ns = (t4 - t1) - (t3 - t2)
            return True
        except Exception:
            return False


class GPSSource:
    def __init__(self):
        self.serial = None
        self.fix = 0
        self.utc = ""

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
                if "$GPGGA" in line:
                    parts = line.split(",")
                    if len(parts) > 6:
                        self.utc = parts[1]
                        self.fix = int(parts[6]) if parts[6] else 0
            except Exception:
                time.sleep(0.5)


class StegoStation:
    def __init__(self):
        self.analyzer = TimingAnalyzer()
        self.ntp = NTPSync()
        self.gps = GPSSource()
        self.esp_serial = None
        self.running = True
        self.last_packet_time = 0

    def connect_esp32(self):
        try:
            self.esp_serial = serial.Serial(ESP32_PORT, ESP32_BAUD, timeout=1)
            print("[ESP32] Connected")
            return True
        except Exception as e:
            print(f"[ESP32] Failed: {e}")
            return False

    def ntp_loop(self):
        while self.running:
            if self.ntp.query():
                print(f"[NTP] offset={self.ntp.offset_ns}ns")
            time.sleep(30)

    def process_line(self, line):
        try:
            data = json.loads(line)
            t = time.time_ns()
            if self.last_packet_time > 0:
                gap_us = (t - self.last_packet_time) / 1000
                self.analyzer.add_gap(gap_us)
            self.last_packet_time = t

            analysis = self.analyzer.analyze_pattern()
            jitter = self.analyzer.get_jitter_stats()
            output = {**data, "host_ns": t, "ntp_off": self.ntp.offset_ns,
                      "gps_fix": self.gps.fix, "analysis": analysis, "jitter": jitter,
                      "utc": datetime.now(timezone.utc).isoformat()}
            print(json.dumps(output))
        except json.JSONDecodeError:
            if "[STEGO]" in line:
                print(line)

    def send_message(self, msg):
        if self.esp_serial:
            self.esp_serial.write((msg + "\n").encode())
            print(f"[TX] Sent to ESP32: {msg}")

    def run(self):
        print("[STEGO-STATION] Temporal Steganography Station starting...")
        self.gps.connect()
        self.connect_esp32()
        threading.Thread(target=self.gps.read_loop, daemon=True).start()
        threading.Thread(target=self.ntp_loop, daemon=True).start()

        print("[STEGO-STATION] Monitoring timing channels...")
        while self.running:
            try:
                if self.esp_serial and self.esp_serial.in_waiting:
                    line = self.esp_serial.readline().decode("utf-8", errors="ignore").strip()
                    if line:
                        self.process_line(line)
                else:
                    time.sleep(0.01)
            except KeyboardInterrupt:
                self.running = False
            except Exception as e:
                print(f"[ERROR] {e}")
                time.sleep(0.5)


if __name__ == "__main__":
    station = StegoStation()
    station.run()
