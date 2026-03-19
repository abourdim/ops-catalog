#!/usr/bin/env python3
"""
Chrono Frequency Hopping Chess - Raspberry Pi GPS/NTP Companion
GPS-synchronized frequency hopping chess game coordinator
"""

import serial
import time
import socket
import struct
import json
import threading
from datetime import datetime, timezone

GPS_PORT = "/dev/ttyAMA0"
GPS_BAUD = 9600
NTP_SERVER = "pool.ntp.org"
ESP32_PORT = "/dev/ttyUSB0"
ESP32_BAUD = 115200
BOARD_SIZE = 8

class ChessEngine:
    PIECES = {0: ".", 1: "R", 2: "P", 3: "N", 4: "B", 5: "Q", 6: "K",
              7: "r", 8: "p", 9: "n", 10: "b", 11: "q", 12: "k"}

    def __init__(self):
        self.board = [[0]*BOARD_SIZE for _ in range(BOARD_SIZE)]
        self.move_history = []
        self.hop_history = []

    def update_board(self, board_data):
        if isinstance(board_data, list) and len(board_data) == BOARD_SIZE:
            self.board = board_data

    def display(self):
        lines = []
        for y in range(BOARD_SIZE - 1, -1, -1):
            row = f"{y} "
            for x in range(BOARD_SIZE):
                row += self.PIECES.get(self.board[x][y] if x < len(self.board) else 0, "?") + " "
            lines.append(row)
        lines.append("  " + " ".join(str(i) for i in range(BOARD_SIZE)))
        return "\n".join(lines)

    def record_move(self, fx, fy, tx, ty, channel, timestamp):
        self.move_history.append({"from": (fx, fy), "to": (tx, ty),
                                   "channel": channel, "time": timestamp})

    def record_hop(self, channel, timestamp):
        self.hop_history.append({"channel": channel, "time": timestamp})

    def get_hop_pattern(self, last_n=20):
        return [h["channel"] for h in self.hop_history[-last_n:]]


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


class GPSClock:
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
                if "GGA" in line:
                    p = line.split(",")
                    if len(p) > 6:
                        self.utc = p[1]
                        self.fix = int(p[6]) if p[6] else 0
            except Exception:
                time.sleep(0.5)


class ChessStation:
    def __init__(self):
        self.engine = ChessEngine()
        self.ntp = NTPSync()
        self.gps = GPSClock()
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
            if "board" in data:
                self.engine.update_board(data["board"])
            if "ch" in data:
                self.engine.record_hop(data["ch"], time.time_ns())
            data["hop_pattern"] = self.engine.get_hop_pattern()
            data["move_count"] = len(self.engine.move_history)
            data["ntp_offset_ns"] = self.ntp.offset_ns
            data["gps_fix"] = self.gps.fix
            data["utc"] = datetime.now(timezone.utc).isoformat()
            print(json.dumps(data))
        except json.JSONDecodeError:
            if "[CHESS]" in line:
                print(line)

    def interactive_loop(self):
        while self.running:
            try:
                cmd = input("[CHESS]> ").strip()
                if cmd.upper().startswith("MOVE"):
                    self.send_cmd(cmd.upper())
                elif cmd.upper() == "BOARD":
                    self.send_cmd("BOARD")
                    time.sleep(0.3)
                    print(self.engine.display())
                elif cmd.upper() == "HOPS":
                    print(f"Hop pattern: {self.engine.get_hop_pattern()}")
                elif cmd.upper() == "QUIT":
                    self.running = False
            except EOFError:
                break

    def run(self):
        print("[CHESS-STATION] Frequency Hopping Chess starting...")
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
    ChessStation().run()
