#!/usr/bin/env python3
"""WiFi Handshake Theater — captures and analyzes WPA/WPA2 4-way handshakes."""

import subprocess
import sys
import time
import json
import os

try:
    from scapy.all import (
        Dot11, EAPOL, sniff, rdpcap, wrpcap
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")


class HandshakeCapture:
    """Capture and validate WPA 4-way handshake frames."""

    def __init__(self, interface, target_bssid=None):
        self.interface = interface
        self.target_bssid = target_bssid
        self.eapol_frames = []
        self.handshakes = {}  # bssid -> {msg1, msg2, msg3, msg4}

    def handle_packet(self, pkt):
        if not pkt.haslayer(EAPOL):
            return
        src = pkt[Dot11].addr2 if pkt.haslayer(Dot11) else None
        dst = pkt[Dot11].addr1 if pkt.haslayer(Dot11) else None
        bssid = pkt[Dot11].addr3 if pkt.haslayer(Dot11) else None

        if self.target_bssid and bssid != self.target_bssid:
            return

        eapol = pkt[EAPOL]
        msg_num = self._identify_message(eapol)
        self.eapol_frames.append({
            "time": time.time(), "src": src, "dst": dst,
            "bssid": bssid, "message": msg_num,
        })

        if bssid:
            if bssid not in self.handshakes:
                self.handshakes[bssid] = set()
            self.handshakes[bssid].add(msg_num)
            if self._is_complete(bssid):
                print(f"[+] Complete handshake captured for {bssid}!")

    def _identify_message(self, eapol):
        """Heuristic identification of EAPOL message number."""
        raw = bytes(eapol)
        if len(raw) < 6:
            return 0
        key_info = int.from_bytes(raw[5:7], "big") if len(raw) > 6 else 0
        if key_info & 0x0008:  # install bit
            return 3
        if key_info & 0x0100:  # MIC bit
            if key_info & 0x0040:  # secure bit
                return 4
            return 2
        return 1

    def _is_complete(self, bssid):
        return len(self.handshakes.get(bssid, set())) >= 3  # msgs 1,2,3 minimum

    def capture(self, duration=120):
        print(f"[*] Capturing handshakes on {self.interface} for {duration}s")
        if self.target_bssid:
            print(f"    Targeting BSSID: {self.target_bssid}")
        sniff(iface=self.interface, prn=self.handle_packet,
              timeout=duration, store=False)
        return self.get_status()

    def get_status(self):
        status = {}
        for bssid, msgs in self.handshakes.items():
            status[bssid] = {
                "messages_captured": sorted(msgs),
                "complete": self._is_complete(bssid),
                "frame_count": sum(1 for f in self.eapol_frames
                                   if f["bssid"] == bssid),
            }
        return status


def run_airodump(interface, bssid, channel, output_prefix, duration=30):
    """Run airodump-ng to capture handshake to pcap."""
    cmd = ["airodump-ng", "--bssid", bssid, "-c", str(channel),
           "-w", output_prefix, "--output-format", "pcap",
           interface]
    proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL,
                            stderr=subprocess.DEVNULL)
    time.sleep(duration)
    proc.terminate()
    return f"{output_prefix}-01.cap"


def check_handshake_file(cap_path):
    """Use aircrack-ng to verify handshake in capture file."""
    if not os.path.exists(cap_path):
        return {"valid": False, "error": "file not found"}
    result = subprocess.run(["aircrack-ng", cap_path],
                           capture_output=True, text=True, timeout=10)
    has_handshake = "1 handshake" in result.stdout
    return {"valid": has_handshake, "output": result.stdout[:500]}


def save_eapol_pcap(frames_raw, path="handshake.pcap"):
    """Save captured EAPOL frames to pcap."""
    if frames_raw:
        wrpcap(path, frames_raw)
        print(f"[+] Saved {len(frames_raw)} EAPOL frames to {path}")


def export_status(status, path="handshake_status.json"):
    with open(path, "w") as f:
        json.dump(status, f, indent=2)
    print(f"[+] Status exported to {path}")


if __name__ == "__main__":
    print("WiFi Handshake Theater — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [bssid]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        bssid = sys.argv[2] if len(sys.argv) > 2 else None
        hc = HandshakeCapture(iface, bssid)
        status = hc.capture(60)
        export_status(status)
