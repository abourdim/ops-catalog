#!/usr/bin/env python3
"""
Chrono Nanosecond Radar - Raspberry Pi GPS/NTP Companion
GPS PPS-disciplined timing for nanosecond-precision radar measurements
"""

import serial
import time
import socket
import struct
import json
import threading
import statistics
from datetime import datetime, timezone

GPS_PORT = "/dev/ttyAMA0"
GPS_BAUD = 9600
NTP_SERVER = "pool.ntp.org"
NTP_PORT = 123
ESP32_SERIAL = "/dev/ttyUSB0"
ESP32_BAUD = 115200
PPS_GPIO = 18

class GPSTimeSource:
    def __init__(self, port=GPS_PORT, baud=GPS_BAUD):
        self.port = port
        self.baud = baud
        self.serial = None
        self.lat = 0.0
        self.lon = 0.0
        self.fix_quality = 0
        self.satellites = 0
        self.utc_time = ""
        self.pps_count = 0
        self.lock = threading.Lock()

    def connect(self):
        try:
            self.serial = serial.Serial(self.port, self.baud, timeout=1)
            print(f"[GPS] Connected on {self.port}")
            return True
        except Exception as e:
            print(f"[GPS] Connection failed: {e}")
            return False

    def parse_gga(self, sentence):
        parts = sentence.split(",")
        if len(parts) < 15:
            return
        with self.lock:
            self.utc_time = parts[1]
            if parts[2] and parts[4]:
                self.lat = self._nmea_to_decimal(parts[2], parts[3])
                self.lon = self._nmea_to_decimal(parts[4], parts[5])
            self.fix_quality = int(parts[6]) if parts[6] else 0
            self.satellites = int(parts[7]) if parts[7] else 0

    def _nmea_to_decimal(self, coord, direction):
        if not coord:
            return 0.0
        deg = int(float(coord) / 100)
        minutes = float(coord) - deg * 100
        decimal = deg + minutes / 60.0
        if direction in ("S", "W"):
            decimal *= -1
        return decimal

    def read_loop(self):
        while True:
            try:
                if not self.serial or not self.serial.is_open:
                    time.sleep(1)
                    continue
                line = self.serial.readline().decode("ascii", errors="ignore").strip()
                if line.startswith("$GPGGA") or line.startswith("$GNGGA"):
                    self.parse_gga(line)
            except Exception as e:
                print(f"[GPS] Read error: {e}")
                time.sleep(0.5)


class NTPClient:
    def __init__(self, server=NTP_SERVER):
        self.server = server
        self.offset_ns = 0
        self.rtt_ns = 0
        self.last_sync = 0

    def query(self):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.settimeout(2)
            packet = b"\x1b" + 47 * b"\0"
            t1 = time.time_ns()
            sock.sendto(packet, (self.server, NTP_PORT))
            data, _ = sock.recvfrom(1024)
            t4 = time.time_ns()
            sock.close()
            if len(data) < 48:
                return False
            t2_sec = struct.unpack("!I", data[32:36])[0] - 2208988800
            t2_frac = struct.unpack("!I", data[36:40])[0]
            t3_sec = struct.unpack("!I", data[40:44])[0] - 2208988800
            t3_frac = struct.unpack("!I", data[44:48])[0]
            t2 = int(t2_sec * 1e9 + t2_frac * 1e9 / (2**32))
            t3 = int(t3_sec * 1e9 + t3_frac * 1e9 / (2**32))
            self.offset_ns = ((t2 - t1) + (t3 - t4)) // 2
            self.rtt_ns = (t4 - t1) - (t3 - t2)
            self.last_sync = time.time()
            return True
        except Exception as e:
            print(f"[NTP] Query error: {e}")
            return False


class NanosecondRadar:
    def __init__(self):
        self.gps = GPSTimeSource()
        self.ntp = NTPClient()
        self.esp_serial = None
        self.measurements = []
        self.running = True

    def connect_esp32(self):
        try:
            self.esp_serial = serial.Serial(ESP32_SERIAL, ESP32_BAUD, timeout=1)
            print(f"[ESP32] Connected on {ESP32_SERIAL}")
            return True
        except Exception as e:
            print(f"[ESP32] Connection failed: {e}")
            return False

    def process_esp_data(self, line):
        try:
            data = json.loads(line)
            data["gps_lat"] = self.gps.lat
            data["gps_lon"] = self.gps.lon
            data["gps_fix"] = self.gps.fix_quality
            data["ntp_offset_ns"] = self.ntp.offset_ns
            data["ntp_rtt_ns"] = self.ntp.rtt_ns
            data["host_time_ns"] = time.time_ns()
            data["utc"] = datetime.now(timezone.utc).isoformat()
            self.measurements.append(data)
            if len(self.measurements) > 1000:
                self.measurements = self.measurements[-500:]
            print(json.dumps(data))
        except json.JSONDecodeError:
            pass

    def ntp_sync_loop(self):
        while self.running:
            if self.ntp.query():
                print(f"[NTP] Offset: {self.ntp.offset_ns}ns RTT: {self.ntp.rtt_ns}ns")
            time.sleep(30)

    def run(self):
        print("[RADAR] Chrono Nanosecond Radar starting...")
        self.gps.connect()
        self.connect_esp32()

        gps_thread = threading.Thread(target=self.gps.read_loop, daemon=True)
        gps_thread.start()
        ntp_thread = threading.Thread(target=self.ntp_sync_loop, daemon=True)
        ntp_thread.start()

        print("[RADAR] All subsystems active. Reading ESP32 data...")
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
                print(f"[RADAR] Error: {e}")
                time.sleep(0.5)

        print("[RADAR] Shutting down...")


if __name__ == "__main__":
    radar = NanosecondRadar()
    radar.run()
