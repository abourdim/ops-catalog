#!/usr/bin/env python3
"""
Chrono Time Crystal Sync - Raspberry Pi GPS/NTP Companion
GPS-disciplined reference clock for crystal oscillator drift analysis
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
PPS_GPIO = 18

class PPSDiscipline:
    def __init__(self):
        self.pps_times = deque(maxlen=100)
        self.frequency_error = 0.0
        self.phase_error_ns = 0
        self.locked = False
        self.lock_count = 0

    def record_pps(self, t_ns):
        self.pps_times.append(t_ns)
        if len(self.pps_times) >= 2:
            interval = self.pps_times[-1] - self.pps_times[-2]
            self.phase_error_ns = interval - 1_000_000_000
            self.frequency_error = self.phase_error_ns / 1e9
            if abs(self.phase_error_ns) < 1000:
                self.lock_count += 1
            else:
                self.lock_count = max(0, self.lock_count - 1)
            self.locked = self.lock_count > 10

    def get_stability(self):
        if len(self.pps_times) < 3:
            return float("inf")
        intervals = [self.pps_times[i+1] - self.pps_times[i]
                     for i in range(len(self.pps_times)-1)]
        return statistics.stdev(intervals) if len(intervals) > 1 else float("inf")


class CrystalSyncManager:
    def __init__(self):
        self.gps_serial = None
        self.esp_serial = None
        self.pps = PPSDiscipline()
        self.ntp_offset_ns = 0
        self.ntp_rtt_ns = 0
        self.node_data = {}
        self.drift_log = deque(maxlen=10000)
        self.running = True

    def connect_gps(self):
        try:
            self.gps_serial = serial.Serial(GPS_PORT, GPS_BAUD, timeout=1)
            print("[GPS] Connected")
            return True
        except Exception as e:
            print(f"[GPS] Failed: {e}")
            return False

    def connect_esp32(self):
        try:
            self.esp_serial = serial.Serial(ESP32_PORT, ESP32_BAUD, timeout=1)
            print("[ESP32] Connected")
            return True
        except Exception as e:
            print(f"[ESP32] Failed: {e}")
            return False

    def ntp_query(self):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.settimeout(2)
            pkt = b"\x1b" + 47 * b"\0"
            t1 = time.time_ns()
            sock.sendto(pkt, (NTP_SERVER, 123))
            data, _ = sock.recvfrom(1024)
            t4 = time.time_ns()
            sock.close()
            t2_s = struct.unpack("!I", data[32:36])[0] - 2208988800
            t2_f = struct.unpack("!I", data[36:40])[0]
            t3_s = struct.unpack("!I", data[40:44])[0] - 2208988800
            t3_f = struct.unpack("!I", data[44:48])[0]
            t2 = int(t2_s * 1e9 + t2_f * 1e9 / (2**32))
            t3 = int(t3_s * 1e9 + t3_f * 1e9 / (2**32))
            self.ntp_offset_ns = ((t2 - t1) + (t3 - t4)) // 2
            self.ntp_rtt_ns = (t4 - t1) - (t3 - t2)
            return True
        except Exception as e:
            print(f"[NTP] Error: {e}")
            return False

    def gps_read_loop(self):
        while self.running:
            try:
                if not self.gps_serial:
                    time.sleep(1)
                    continue
                line = self.gps_serial.readline().decode("ascii", errors="ignore").strip()
                if "$GPRMC" in line or "$GNRMC" in line:
                    self.pps.record_pps(time.time_ns())
            except Exception:
                time.sleep(0.5)

    def ntp_loop(self):
        while self.running:
            if self.ntp_query():
                print(f"[NTP] offset={self.ntp_offset_ns}ns rtt={self.ntp_rtt_ns}ns")
            time.sleep(30)

    def process_esp_data(self, line):
        try:
            data = json.loads(line)
            node_id = data.get("node", "??")
            data["ref_time_ns"] = time.time_ns()
            data["ntp_offset_ns"] = self.ntp_offset_ns
            data["pps_locked"] = self.pps.locked
            data["pps_stability_ns"] = self.pps.get_stability()
            data["utc"] = datetime.now(timezone.utc).isoformat()
            self.node_data[node_id] = data
            self.drift_log.append(data)
            print(json.dumps(data))
        except json.JSONDecodeError:
            pass

    def run(self):
        print("[CRYSTAL-SYNC] Starting Time Crystal Sync Manager...")
        self.connect_gps()
        self.connect_esp32()

        threading.Thread(target=self.gps_read_loop, daemon=True).start()
        threading.Thread(target=self.ntp_loop, daemon=True).start()

        print("[CRYSTAL-SYNC] Monitoring crystal drift across nodes...")
        while self.running:
            try:
                if self.esp_serial and self.esp_serial.in_waiting:
                    line = self.esp_serial.readline().decode("utf-8", errors="ignore").strip()
                    if line.startswith("{"):
                        self.process_esp_data(line)
                else:
                    time.sleep(0.01)
            except KeyboardInterrupt:
                self.running = False
            except Exception as e:
                print(f"[ERROR] {e}")
                time.sleep(0.5)
        print("[CRYSTAL-SYNC] Shutdown complete")


if __name__ == "__main__":
    mgr = CrystalSyncManager()
    mgr.run()
