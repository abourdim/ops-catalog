#!/usr/bin/env python3
"""
Chrono Epoch Vault - Raspberry Pi GPS/NTP Companion
GPS/NTP time-authority for epoch-locked encrypted vaults
"""

import serial
import time
import socket
import struct
import json
import hashlib
import threading
from datetime import datetime, timezone
from collections import deque

GPS_PORT = "/dev/ttyAMA0"
GPS_BAUD = 9600
NTP_SERVER = "pool.ntp.org"
ESP32_PORT = "/dev/ttyUSB0"
ESP32_BAUD = 115200

class VaultManager:
    def __init__(self):
        self.vaults = {}
        self.unlock_queue = deque(maxlen=100)

    def register_vault(self, vault_id, lock_epoch, unlock_epoch):
        self.vaults[vault_id] = {
            "lock_epoch": lock_epoch, "unlock_epoch": unlock_epoch,
            "status": "locked", "created": datetime.now(timezone.utc).isoformat()
        }

    def check_unlocks(self, current_epoch):
        newly_unlocked = []
        for vid, v in self.vaults.items():
            if v["status"] == "locked" and current_epoch >= v["unlock_epoch"]:
                v["status"] = "ready_to_unlock"
                newly_unlocked.append(vid)
        return newly_unlocked

    def get_status(self):
        return {vid: {"status": v["status"], "unlock_epoch": v["unlock_epoch"]}
                for vid, v in self.vaults.items()}


class GPSTimeAuthority:
    def __init__(self):
        self.serial = None
        self.utc_time = ""
        self.fix = 0
        self.epoch = 0

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
                if "RMC" in line:
                    parts = line.split(",")
                    if len(parts) > 9 and parts[1] and parts[9]:
                        t, d = parts[1], parts[9]
                        try:
                            dt = datetime.strptime(f"{d}{t[:6]}", "%d%m%y%H%M%S")
                            self.epoch = int(dt.replace(tzinfo=timezone.utc).timestamp())
                            self.utc_time = dt.isoformat()
                        except ValueError:
                            pass
                    self.fix = 1 if parts[2] == "A" else 0
            except Exception:
                time.sleep(0.5)


class NTPAuthority:
    def __init__(self):
        self.offset_ns = 0
        self.epoch = 0

    def query(self):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.settimeout(2)
            t1 = time.time_ns()
            s.sendto(b"\x1b" + 47 * b"\0", (NTP_SERVER, 123))
            d, _ = s.recvfrom(1024)
            t4 = time.time_ns()
            s.close()
            t2 = struct.unpack("!I", d[40:44])[0] - 2208988800
            self.epoch = t2
            self.offset_ns = ((t2 * 10**9 - t1) + (t2 * 10**9 - t4)) // 2
            return True
        except Exception:
            return False


class EpochVaultStation:
    def __init__(self):
        self.vault_mgr = VaultManager()
        self.gps = GPSTimeAuthority()
        self.ntp = NTPAuthority()
        self.esp = None
        self.running = True

    def connect_esp(self):
        try:
            self.esp = serial.Serial(ESP32_PORT, ESP32_BAUD, timeout=1)
            print("[ESP32] Connected")
            return True
        except Exception:
            return False

    def send_epoch(self):
        epoch = self.gps.epoch if self.gps.fix else int(time.time())
        if self.esp:
            self.esp.write(f"EPOCH {epoch}\n".encode())

    def ntp_loop(self):
        while self.running:
            self.ntp.query()
            time.sleep(30)

    def process_esp_data(self, line):
        try:
            data = json.loads(line)
            current_epoch = data.get("epoch", int(time.time()))
            newly_unlocked = self.vault_mgr.check_unlocks(current_epoch)
            if newly_unlocked:
                for vid in newly_unlocked:
                    if self.esp:
                        self.esp.write(f"UNLOCK {vid}\n".encode())
                    print(f"[VAULT] Auto-unlocking vault {vid}")
            data["gps_epoch"] = self.gps.epoch
            data["gps_fix"] = self.gps.fix
            data["ntp_epoch"] = self.ntp.epoch
            data["vault_status"] = self.vault_mgr.get_status()
            data["utc"] = datetime.now(timezone.utc).isoformat()
            print(json.dumps(data, default=str))
        except json.JSONDecodeError:
            if "[VAULT]" in line:
                print(line)

    def run(self):
        print("[VAULT-STATION] Epoch Vault Station starting...")
        self.gps.connect()
        self.connect_esp()
        threading.Thread(target=self.gps.read_loop, daemon=True).start()
        threading.Thread(target=self.ntp_loop, daemon=True).start()

        sync_counter = 0
        while self.running:
            try:
                if self.esp and self.esp.in_waiting:
                    line = self.esp.readline().decode("utf-8", errors="ignore").strip()
                    if line:
                        self.process_esp_data(line)
                else:
                    time.sleep(0.05)
                sync_counter += 1
                if sync_counter % 200 == 0:
                    self.send_epoch()
            except KeyboardInterrupt:
                self.running = False
            except Exception as e:
                print(f"[ERROR] {e}")
                time.sleep(0.5)


if __name__ == "__main__":
    EpochVaultStation().run()
