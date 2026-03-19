#!/usr/bin/env python3
"""WiFi Escape Room — puzzle-based WiFi challenges requiring real packet analysis."""

import subprocess
import sys
import time
import json
import hashlib
import random
import string

try:
    from scapy.all import (
        Dot11, Dot11Beacon, Dot11ProbeReq, Dot11Elt,
        RadioTap, sendp, sniff
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")


class WiFiEscapeRoom:
    """Generate and validate WiFi-based puzzles."""

    def __init__(self, interface):
        self.interface = interface
        self.puzzles = {}
        self.solved = set()

    def generate_ssid_puzzle(self, secret_word, channel=6):
        """Create a puzzle: hidden message split across beacon SSIDs."""
        parts = [secret_word[i:i+4] for i in range(0, len(secret_word), 4)]
        puzzle_id = hashlib.md5(secret_word.encode()).hexdigest()[:8]
        ssids = [f"PUZZLE-{puzzle_id}-{i:02d}-{p}" for i, p in enumerate(parts)]
        self.puzzles[puzzle_id] = {
            "type": "ssid_decode",
            "answer": secret_word,
            "channel": channel,
            "ssid_count": len(ssids),
        }
        return ssids, puzzle_id

    def broadcast_puzzle(self, ssids, channel=6, duration=30):
        """Broadcast puzzle beacons for participants to capture."""
        set_channel(self.interface, channel)
        print(f"[*] Broadcasting {len(ssids)} puzzle beacons on ch {channel}")
        end_time = time.time() + duration
        while time.time() < end_time:
            for ssid in ssids:
                mac = "de:ad:00:pu:zz:le"
                dot11 = Dot11(type=0, subtype=8, addr1="ff:ff:ff:ff:ff:ff",
                              addr2=mac, addr3=mac)
                beacon = Dot11Beacon(cap="ESS")
                essid = Dot11Elt(ID="SSID", info=ssid.encode())
                pkt = RadioTap() / dot11 / beacon / essid
                sendp(pkt, iface=self.interface, verbose=False)
                time.sleep(0.05)

    def generate_signal_puzzle(self, target_signal=-50):
        """Puzzle: find the AP with a specific signal strength."""
        puzzle_id = f"sig-{abs(target_signal)}"
        self.puzzles[puzzle_id] = {
            "type": "signal_hunt",
            "target_signal": target_signal,
            "tolerance": 5,
        }
        return puzzle_id

    def capture_puzzle_beacons(self, channel=6, duration=15):
        """Capture beacons to solve SSID-based puzzles."""
        set_channel(self.interface, channel)
        puzzle_beacons = []

        def handler(pkt):
            if pkt.haslayer(Dot11Beacon):
                ssid_elt = pkt.getlayer(Dot11Elt)
                ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
                if ssid.startswith("PUZZLE-"):
                    puzzle_beacons.append(ssid)

        sniff(iface=self.interface, prn=handler, timeout=duration, store=False)
        return sorted(set(puzzle_beacons))

    def solve_ssid_puzzle(self, captured_ssids, puzzle_id):
        """Attempt to solve an SSID-decode puzzle from captured beacons."""
        relevant = sorted([s for s in captured_ssids if puzzle_id in s])
        if not relevant:
            return {"solved": False, "error": "No matching puzzle beacons found"}
        parts = []
        for ssid in relevant:
            segments = ssid.split("-")
            if len(segments) >= 4:
                parts.append(segments[3])
        answer = "".join(parts)
        puzzle = self.puzzles.get(puzzle_id, {})
        correct = answer == puzzle.get("answer", "")
        if correct:
            self.solved.add(puzzle_id)
        return {"solved": correct, "your_answer": answer,
                "correct_answer": puzzle.get("answer") if correct else "???"}

    def get_scoreboard(self):
        return {
            "total_puzzles": len(self.puzzles),
            "solved": len(self.solved),
            "completion_pct": round(len(self.solved) / max(len(self.puzzles), 1) * 100),
            "puzzles": {pid: {"solved": pid in self.solved, **info}
                        for pid, info in self.puzzles.items()},
        }


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_scoreboard(data, path="escape_room.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[+] Scoreboard exported to {path}")


if __name__ == "__main__":
    print("WiFi Escape Room — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [host|solve]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        mode = sys.argv[2] if len(sys.argv) > 2 else "solve"
        room = WiFiEscapeRoom(iface)
        if mode == "host":
            ssids, pid = room.generate_ssid_puzzle("ESCAPED")
            room.broadcast_puzzle(ssids, duration=30)
        else:
            captured = room.capture_puzzle_beacons()
            print(f"[+] Captured {len(captured)} puzzle beacons")
