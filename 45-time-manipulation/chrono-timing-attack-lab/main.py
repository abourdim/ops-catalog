#!/usr/bin/env python3
"""
Chrono Timing Attack Lab - Raspberry Pi GPS/NTP Companion
Precision timing analysis for educational side-channel attacks
"""

import serial
import time
import socket
import struct
import json
import threading
import statistics
from datetime import datetime, timezone
from collections import defaultdict

NTP_SERVER = "pool.ntp.org"
ESP32_PORT = "/dev/ttyUSB0"
ESP32_BAUD = 115200

class TimingAnalyzer:
    def __init__(self):
        self.samples = defaultdict(list)
        self.attack_results = {}

    def add_sample(self, byte_pos, byte_val, timing_us):
        key = (byte_pos, byte_val)
        self.samples[key].append(timing_us)

    def analyze_byte(self, byte_pos):
        results = {}
        for bval in range(256):
            key = (byte_pos, bval)
            if key in self.samples and len(self.samples[key]) >= 5:
                s = self.samples[key]
                results[bval] = {
                    "mean": statistics.mean(s),
                    "median": statistics.median(s),
                    "stdev": statistics.stdev(s) if len(s) > 1 else 0,
                    "count": len(s)
                }
        if not results:
            return None
        best = max(results.items(), key=lambda x: x[1]["mean"])
        return {"byte_pos": byte_pos, "best_value": best[0],
                "best_char": chr(best[0]) if 32 <= best[0] < 127 else ".",
                "confidence": best[1]["mean"], "candidates": len(results)}

    def statistical_test(self, byte_pos, candidate, baseline=0):
        key_c = (byte_pos, candidate)
        key_b = (byte_pos, baseline)
        if key_c not in self.samples or key_b not in self.samples:
            return None
        sc = self.samples[key_c]
        sb = self.samples[key_b]
        if len(sc) < 5 or len(sb) < 5:
            return None
        mc, mb = statistics.mean(sc), statistics.mean(sb)
        sc_std = statistics.stdev(sc) if len(sc) > 1 else 1
        sb_std = statistics.stdev(sb) if len(sb) > 1 else 1
        pooled_std = ((sc_std**2 / len(sc)) + (sb_std**2 / len(sb))) ** 0.5
        t_stat = (mc - mb) / pooled_std if pooled_std > 0 else 0
        return {"t_statistic": t_stat, "mean_diff_us": mc - mb,
                "significant": abs(t_stat) > 2.0}


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


class TimingLab:
    def __init__(self):
        self.analyzer = TimingAnalyzer()
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

    def send_cmd(self, cmd):
        if self.esp:
            self.esp.write((cmd + "\n").encode())

    def ntp_loop(self):
        while self.running:
            self.ntp.query()
            time.sleep(30)

    def process_esp_line(self, line):
        try:
            data = json.loads(line)
            data["host_ns"] = time.time_ns()
            data["ntp_offset_ns"] = self.ntp.offset_ns
            data["utc"] = datetime.now(timezone.utc).isoformat()
            if "benchmark" in data:
                vuln = data["benchmark"].get("vulnerable", [])
                sec = data["benchmark"].get("secure", [])
                if vuln:
                    data["benchmark"]["vuln_slope"] = (vuln[-1] - vuln[0]) / max(len(vuln), 1)
                    data["benchmark"]["sec_variance"] = statistics.variance(sec) if len(sec) > 1 else 0
            print(json.dumps(data))
        except json.JSONDecodeError:
            if "[ATTACK]" in line or "[TIMING-LAB]" in line:
                print(line)

    def interactive_loop(self):
        while self.running:
            try:
                cmd = input("[LAB]> ").strip()
                if cmd.upper() in ("BENCH", "FULLATTACK"):
                    self.send_cmd(cmd.upper())
                elif cmd.upper().startswith("ATTACK"):
                    self.send_cmd(cmd.upper())
                elif cmd.upper() == "ANALYZE":
                    for i in range(16):
                        r = self.analyzer.analyze_byte(i)
                        if r:
                            print(f"  Byte {i}: {r}")
                elif cmd.upper() == "QUIT":
                    self.running = False
            except EOFError:
                break

    def run(self):
        print("[TIMING-LAB] Timing Attack Lab Station starting...")
        self.connect_esp()
        threading.Thread(target=self.ntp_loop, daemon=True).start()
        threading.Thread(target=self.interactive_loop, daemon=True).start()

        while self.running:
            try:
                if self.esp and self.esp.in_waiting:
                    line = self.esp.readline().decode("utf-8", errors="ignore").strip()
                    if line:
                        self.process_esp_line(line)
                else:
                    time.sleep(0.01)
            except KeyboardInterrupt:
                self.running = False
            except Exception as e:
                print(f"[ERROR] {e}")
                time.sleep(0.5)


if __name__ == "__main__":
    TimingLab().run()
