#!/usr/bin/env python3
"""WiFi Packet Microscope — deep inspection of 802.11 frame fields and layers."""

import subprocess
import sys
import time
import json
from collections import Counter

try:
    from scapy.all import (
        Dot11, Dot11Beacon, Dot11ProbeReq, Dot11ProbeResp, Dot11Auth,
        Dot11AssoReq, Dot11AssoResp, Dot11Deauth, EAPOL,
        RadioTap, sniff, hexdump
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")

FRAME_TYPES = {
    (0, 0): "AssocReq", (0, 1): "AssocResp", (0, 2): "ReassocReq",
    (0, 3): "ReassocResp", (0, 4): "ProbeReq", (0, 5): "ProbeResp",
    (0, 8): "Beacon", (0, 10): "Disassoc", (0, 11): "Auth",
    (0, 12): "Deauth", (0, 13): "Action",
    (1, 11): "RTS", (1, 12): "CTS", (1, 13): "ACK",
    (2, 0): "Data", (2, 4): "Null", (2, 8): "QoS Data",
}


class PacketMicroscope:
    """Dissect and categorize 802.11 frames at the field level."""

    def __init__(self, interface):
        self.interface = interface
        self.frame_counts = Counter()
        self.packets = []
        self.unique_macs = set()

    def dissect(self, pkt):
        if not pkt.haslayer(Dot11):
            return
        dot11 = pkt[Dot11]
        ftype = dot11.type
        subtype = dot11.subtype
        label = FRAME_TYPES.get((ftype, subtype), f"Type{ftype}/Sub{subtype}")
        self.frame_counts[label] += 1

        for addr in [dot11.addr1, dot11.addr2, dot11.addr3]:
            if addr:
                self.unique_macs.add(addr)

        info = {
            "time": time.time(),
            "type": label,
            "type_num": ftype,
            "subtype_num": subtype,
            "addr1": dot11.addr1,
            "addr2": dot11.addr2,
            "addr3": dot11.addr3,
            "duration": dot11.ID if hasattr(dot11, "ID") else 0,
            "flags": self._parse_flags(dot11),
            "size": len(pkt),
            "layers": self._list_layers(pkt),
        }
        if hasattr(pkt, "dBm_AntSignal"):
            info["signal"] = pkt.dBm_AntSignal
        if hasattr(pkt, "ChannelFrequency"):
            info["frequency"] = pkt.ChannelFrequency

        self.packets.append(info)

    def _parse_flags(self, dot11):
        flags = []
        fc = dot11.FCfield if hasattr(dot11, "FCfield") else 0
        if fc & 0x01: flags.append("to-DS")
        if fc & 0x02: flags.append("from-DS")
        if fc & 0x04: flags.append("more-frag")
        if fc & 0x08: flags.append("retry")
        if fc & 0x10: flags.append("pwr-mgmt")
        if fc & 0x20: flags.append("more-data")
        if fc & 0x40: flags.append("protected")
        return flags

    def _list_layers(self, pkt):
        layers = []
        while pkt:
            layers.append(pkt.__class__.__name__)
            pkt = pkt.payload if hasattr(pkt, "payload") and pkt.payload else None
            if pkt and pkt.__class__.__name__ == "NoPayload":
                break
        return layers

    def capture(self, duration=30, count=500):
        print(f"[*] Microscope capture: {duration}s / max {count} frames")
        sniff(iface=self.interface, prn=self.dissect,
              timeout=duration, count=count, store=False)
        return self.get_analysis()

    def get_analysis(self):
        total = sum(self.frame_counts.values())
        return {
            "total_frames": total,
            "unique_macs": len(self.unique_macs),
            "frame_distribution": dict(self.frame_counts.most_common()),
            "mgmt_pct": round(sum(v for k, v in self.frame_counts.items()
                                  if k in ("Beacon", "ProbeReq", "ProbeResp",
                                           "Auth", "Deauth")) / max(total, 1) * 100, 1),
            "avg_size": round(sum(p["size"] for p in self.packets) / max(len(self.packets), 1)),
            "sample_packets": self.packets[:20],
        }


def export_analysis(analysis, path="packet_analysis.json"):
    with open(path, "w") as f:
        json.dump(analysis, f, indent=2)
    print(f"[+] Analysis exported to {path}")


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


if __name__ == "__main__":
    print("WiFi Packet Microscope — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 30
        mic = PacketMicroscope(iface)
        analysis = mic.capture(dur)
        export_analysis(analysis)
