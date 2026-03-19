#!/usr/bin/env python3
"""
Chrono Entropy Harvester - Raspberry Pi GPS/NTP Companion
GPS timing jitter and network entropy collection for true randomness
"""

import serial
import time
import socket
import struct
import json
import os
import hashlib
import threading
import statistics
from datetime import datetime, timezone
from collections import deque

GPS_PORT = "/dev/ttyAMA0"
GPS_BAUD = 9600
NTP_SERVER = "pool.ntp.org"
ESP32_PORT = "/dev/ttyUSB0"
ESP32_BAUD = 115200

class EntropyPool:
    def __init__(self, size=512):
        self.pool = bytearray(os.urandom(size))
        self.size = size
        self.write_idx = 0
        self.bits_collected = 0
        self.sources = {"timing": 0, "gps": 0, "ntp": 0, "esp32": 0, "system": 0}

    def mix(self, data, source="unknown"):
        for b in data:
            self.pool[self.write_idx] ^= b
            self.pool[(self.write_idx + 1) % self.size] ^= (b << 3 | b >> 5) & 0xFF
            self.write_idx = (self.write_idx + 1) % self.size
        self.bits_collected += len(data) * 2
        if source in self.sources:
            self.sources[source] += len(data)

    def extract(self, nbytes):
        h = hashlib.sha256(bytes(self.pool)).digest()
        self.mix(h, "system")
        return h[:nbytes]

    def estimate_quality(self):
        counts = [0] * 256
        for b in self.pool:
            counts[b] += 1
        entropy = 0.0
        for c in counts:
            if c > 0:
                p = c / self.size
                entropy -= p * (p and __import__("math").log2(p))
        return entropy


class TimingEntropy:
    def __init__(self, pool):
        self.pool = pool
        self.last_times = deque(maxlen=100)

    def harvest(self):
        samples = []
        for _ in range(16):
            samples.append(time.time_ns())
        jitter = bytes((samples[i] - samples[i-1]) & 0xFF for i in range(1, len(samples)))
        self.pool.mix(jitter, "timing")
        return len(jitter)


class NTPEntropy:
    def __init__(self, pool):
        self.pool = pool
        self.offset_ns = 0

    def harvest(self):
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
            rtt = (t4 - t1) - (t3 - t2)
            jitter = struct.pack("!qq", self.offset_ns, rtt)
            self.pool.mix(jitter, "ntp")
            return len(jitter)
        except Exception:
            return 0


class GPSEntropy:
    def __init__(self, pool):
        self.pool = pool
        self.serial = None
        self.fix = 0

    def connect(self):
        try:
            self.serial = serial.Serial(GPS_PORT, GPS_BAUD, timeout=1)
            return True
        except Exception:
            return False

    def harvest_loop(self):
        while True:
            try:
                if not self.serial:
                    time.sleep(1)
                    continue
                line = self.serial.readline()
                t = time.time_ns()
                jitter = struct.pack("!q", t)
                self.pool.mix(jitter + line[:8], "gps")
                if b"GGA" in line:
                    parts = line.decode("ascii", errors="ignore").split(",")
                    self.fix = int(parts[6]) if len(parts) > 6 and parts[6] else 0
            except Exception:
                time.sleep(0.5)


class EntropyStation:
    def __init__(self):
        self.pool = EntropyPool()
        self.timing = TimingEntropy(self.pool)
        self.ntp_ent = NTPEntropy(self.pool)
        self.gps_ent = GPSEntropy(self.pool)
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
            self.ntp_ent.harvest()
            time.sleep(30)

    def timing_loop(self):
        while self.running:
            self.timing.harvest()
            time.sleep(0.1)

    def process_esp_data(self, line):
        try:
            data = json.loads(line)
            self.pool.mix(line.encode()[:32], "esp32")
            data["host_pool"] = {
                "bits": self.pool.bits_collected,
                "quality": self.pool.estimate_quality(),
                "sources": dict(self.pool.sources)
            }
            data["random_hex"] = self.pool.extract(16).hex()
            data["gps_fix"] = self.gps_ent.fix
            data["ntp_offset_ns"] = self.ntp_ent.offset_ns
            data["utc"] = datetime.now(timezone.utc).isoformat()
            print(json.dumps(data))
        except json.JSONDecodeError:
            pass

    def run(self):
        print("[ENTROPY] Entropy Harvester Station starting...")
        self.gps_ent.connect()
        self.connect_esp()
        threading.Thread(target=self.gps_ent.harvest_loop, daemon=True).start()
        threading.Thread(target=self.ntp_loop, daemon=True).start()
        threading.Thread(target=self.timing_loop, daemon=True).start()

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
    EntropyStation().run()
