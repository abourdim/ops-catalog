#!/usr/bin/env python3
"""WiFi Hidden Network Revealer — uses HackRF + scapy to uncover cloaked networks."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import (
        Dot11, Dot11Beacon, Dot11ProbeReq, Dot11ProbeResp,
        Dot11Elt, RadioTap, sendp, sniff
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")


class HiddenNetworkRevealer:
    """Multi-technique hidden SSID discovery."""

    def __init__(self, interface):
        self.interface = interface
        self.hidden_aps = {}  # bssid -> {channel, signals, clients}
        self.revealed = {}    # bssid -> ssid
        self.associations = defaultdict(set)  # bssid -> set of client MACs

    def passive_scan(self, duration=60):
        """Passively listen for hidden beacons and probe responses."""
        print(f"[*] Passive scan for hidden networks: {duration}s")

        def handler(pkt):
            if pkt.haslayer(Dot11Beacon):
                bssid = pkt[Dot11].addr2
                ssid_elt = pkt.getlayer(Dot11Elt)
                ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
                if not ssid or ssid == "\x00" * len(ssid):
                    ch = self._get_channel(pkt)
                    sig = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
                    if bssid not in self.hidden_aps:
                        self.hidden_aps[bssid] = {"channel": ch, "signals": [], "clients": set()}
                    self.hidden_aps[bssid]["signals"].append(sig)

            elif pkt.haslayer(Dot11ProbeResp):
                bssid = pkt[Dot11].addr2
                ssid_elt = pkt.getlayer(Dot11Elt)
                ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
                if ssid and bssid in self.hidden_aps:
                    self.revealed[bssid] = ssid

            # Track client-AP associations for connected client technique
            if pkt.haslayer(Dot11):
                ds = pkt[Dot11].FCfield & 0x3
                if ds == 1:  # to-DS (client -> AP)
                    bssid = pkt[Dot11].addr1
                    client = pkt[Dot11].addr2
                    if bssid in self.hidden_aps:
                        self.hidden_aps[bssid]["clients"].add(client)

        sniff(iface=self.interface, prn=handler, timeout=duration, store=False)

    def active_probe(self, bssid, channel, wordlist=None):
        """Actively probe a hidden AP with common SSIDs."""
        common_ssids = wordlist or [
            "default", "linksys", "netgear", "NETGEAR", "dlink",
            "TP-LINK", "ASUS", "hidden", "private", "admin",
            "home", "office", "guest", "WiFi", "wireless",
        ]
        set_channel(self.interface, channel)
        print(f"[*] Active probing {bssid} with {len(common_ssids)} SSIDs")
        for ssid in common_ssids:
            pkt = (RadioTap() /
                   Dot11(type=0, subtype=4, addr1=bssid,
                         addr2="aa:bb:cc:dd:ee:ff",
                         addr3=bssid) /
                   Dot11ProbeReq() /
                   Dot11Elt(ID="SSID", info=ssid.encode()))
            sendp(pkt, iface=self.interface, verbose=False)
            time.sleep(0.05)

    def hackrf_power_scan(self, channel):
        """Use HackRF to measure signal power on the hidden AP's channel."""
        freq = 2412 + (channel - 1) * 5
        cmd = ["hackrf_sweep", "-f", f"{freq - 5}:{freq + 5}",
               "-w", "100000", "-1"]
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=10)
        powers = []
        for line in result.stdout.strip().split("\n"):
            parts = line.split(",")
            if len(parts) > 6:
                try:
                    powers.extend(float(p) for p in parts[6:])
                except ValueError:
                    pass
        return {"channel": channel, "avg_power": round(sum(powers) / len(powers), 1) if powers else -100,
                "peak": max(powers) if powers else -100}

    def _get_channel(self, pkt):
        elt = pkt.getlayer(Dot11Elt)
        while elt:
            if elt.ID == 3 and elt.info:
                return elt.info[0]
            elt = elt.payload.getlayer(Dot11Elt) if hasattr(elt.payload, "getlayer") else None
        return 0

    def get_report(self):
        results = []
        for bssid, info in self.hidden_aps.items():
            avg_sig = sum(info["signals"]) / len(info["signals"]) if info["signals"] else -99
            results.append({
                "bssid": bssid,
                "channel": info["channel"],
                "avg_signal": round(avg_sig, 1),
                "revealed_ssid": self.revealed.get(bssid),
                "connected_clients": len(info["clients"]),
                "beacon_count": len(info["signals"]),
            })
        return {"hidden_aps": results, "total_found": len(results),
                "revealed": len(self.revealed)}


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_report(report, path="hidden_networks.json"):
    with open(path, "w") as f:
        json.dump(report, f, indent=2, default=list)
    print(f"[+] Report exported to {path}")


if __name__ == "__main__":
    print("WiFi Hidden Network Revealer — HackRF companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 60
        revealer = HiddenNetworkRevealer(iface)
        revealer.passive_scan(dur)
        report = revealer.get_report()
        export_report(report)
