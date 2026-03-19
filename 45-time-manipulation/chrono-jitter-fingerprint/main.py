#!/usr/bin/env python3
"""
Chrono Jitter Fingerprint - Raspberry Pi GPS/NTP Companion
Network timing jitter analysis for device fingerprinting
"""

import serial
import time
import socket
import struct
import json
import threading
import statistics
import hashlib
from datetime import datetime, timezone
from collections import deque, defaultdict

GPS_PORT = "/dev/ttyAMA0"
GPS_BAUD = 9600
NTP_SERVER = "pool.ntp.org"
ESP32_PORT = "/dev/ttyUSB0"
ESP32_BAUD = 115200

class JitterDatabase:
    def __init__(self):
        self.profiles = defaultdict(lambda: {"samples": deque(maxlen=1000),
                                              "fingerprint": None, "first_seen": None})

    def add_sample(self, device_id, mean, std, skew):
        p = self.profiles[device_id]
        if not p["first_seen"]:
            p["first_seen"] = datetime.now(timezone.utc).isoformat()
        p["samples"].append({"mean": mean, "std": std, "skew": skew, "t": time.time()})
        if len(p["samples"]) >= 10:
            self._compute_fingerprint(device_id)

    def _compute_fingerprint(self, device_id):
        s = list(self.profiles[device_id]["samples"])[-50:]
        means = [x["mean"] for x in s]
        stds = [x["std"] for x in s]
        skews = [x["skew"] for x in s]
        sig = f"{statistics.mean(means):.4f}:{statistics.mean(stds):.4f}:{statistics.mean(skews):.4f}"
        fp = hashlib.sha256(sig.encode()).hexdigest()[:32]
        self.profiles[device_id]["fingerprint"] = fp

    def match(self, device_id, threshold=0.8):
        p = self.profiles.get(device_id)
        if not p or not p["fingerprint"]:
            return []
        matches = []
        for did, dp in self.profiles.items():
            if did == device_id or not dp["fingerprint"]:
                continue
            common = sum(a == b for a, b in zip(p["fingerprint"], dp["fingerprint"]))
            sim = common / len(p["fingerprint"])
            if sim >= threshold:
                matches.append({"device": did, "similarity": sim})
        return matches

    def get_summary(self):
        return {did: {"fingerprint": p["fingerprint"], "sample_count": len(p["samples"]),
                       "first_seen": p["first_seen"]}
                for did, p in self.profiles.items()}


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


class JitterStation:
    def __init__(self):
        self.db = JitterDatabase()
        self.ntp = NTPSync()
        self.esp = None
        self.running = True

    def connect_esp(self):
        try:
            self.esp = serial.Serial(ESP32_PORT, ESP32_BAUD, timeout=1)
            print("[ESP32] Connected")
            return True
        except Exception as e:
            print(f"[ESP32] Failed: {e}")
            return False

    def ntp_loop(self):
        while self.running:
            self.ntp.query()
            time.sleep(30)

    def process_esp_data(self, line):
        try:
            data = json.loads(line)
            for dev in data.get("devices", []):
                did = dev.get("mac", "")
                self.db.add_sample(did, dev.get("mean", 0), dev.get("std", 0), dev.get("skew", 0))
                matches = self.db.match(did)
                if matches:
                    dev["matches"] = matches

            data["host_time_ns"] = time.time_ns()
            data["ntp_offset_ns"] = self.ntp.offset_ns
            data["db_summary"] = self.db.get_summary()
            data["utc"] = datetime.now(timezone.utc).isoformat()
            print(json.dumps(data, default=str))
        except json.JSONDecodeError:
            pass

    def run(self):
        print("[JITTER-FP] Jitter Fingerprint Station starting...")
        self.connect_esp()
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
    JitterStation().run()
