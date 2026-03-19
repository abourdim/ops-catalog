#!/usr/bin/env python3
"""ESP Captive Portal Attack Monitor — monitors captive portal behavior from host side."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import (
        Dot11, Dot11Beacon, Dot11ProbeResp, Dot11Deauth,
        Dot11Elt, DNS, DNSRR, IP, UDP, sniff
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")


class CaptivePortalMonitor:
    """Monitor and analyze captive portal AP behavior from the host machine."""

    def __init__(self, interface):
        self.interface = interface
        self.portal_aps = {}
        self.dns_redirects = []
        self.connected_clients = defaultdict(list)
        self.deauth_events = []

    def handle_packet(self, pkt):
        now = time.time()

        # Track beacon frames from ESP32 captive portal
        if pkt.haslayer(Dot11Beacon):
            bssid = pkt[Dot11].addr2
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
            signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
            self.portal_aps[bssid] = {
                "ssid": ssid, "signal": signal, "last_seen": now,
                "channel": self._get_channel(pkt),
            }

        # Track DNS responses (captive portals redirect DNS)
        if pkt.haslayer(DNSRR) and pkt.haslayer(IP):
            dns = pkt[DNS]
            if dns.ancount > 0:
                for i in range(dns.ancount):
                    rr = dns.an[i] if hasattr(dns.an, '__getitem__') else dns.an
                    self.dns_redirects.append({
                        "time": now,
                        "query": rr.rrname.decode() if hasattr(rr.rrname, 'decode') else str(rr.rrname),
                        "answer": str(rr.rdata),
                        "src": pkt[IP].src,
                    })

        # Track deauth frames (captive portals may deauth to force reconnect)
        if pkt.haslayer(Dot11Deauth):
            self.deauth_events.append({
                "time": now,
                "src": pkt[Dot11].addr2,
                "dst": pkt[Dot11].addr1,
                "reason": pkt[Dot11Deauth].reason,
            })

    def _get_channel(self, pkt):
        elt = pkt.getlayer(Dot11Elt)
        while elt:
            if elt.ID == 3 and elt.info:
                return elt.info[0]
            elt = elt.payload.getlayer(Dot11Elt) if hasattr(elt.payload, "getlayer") else None
        return 0

    def monitor(self, duration=120):
        print(f"[*] Monitoring captive portal activity on {self.interface}: {duration}s")
        sniff(iface=self.interface, prn=self.handle_packet,
              timeout=duration, store=False)
        return self.get_report()

    def get_report(self):
        return {
            "portal_aps": self.portal_aps,
            "dns_redirects": self.dns_redirects[-50:],
            "deauth_events": self.deauth_events[-50:],
            "total_dns_redirects": len(self.dns_redirects),
            "total_deauths": len(self.deauth_events),
            "summary": {
                "portals_detected": len(self.portal_aps),
                "unique_redirected_domains": len(set(
                    d["query"] for d in self.dns_redirects)),
            },
        }


def scan_for_esp_portals(interface, duration=15):
    """Quick scan specifically for ESP32-style captive portals."""
    portals = {}
    def handler(pkt):
        if pkt.haslayer(Dot11Beacon):
            bssid = pkt[Dot11].addr2
            ssid_elt = pkt.getlayer(Dot11Elt)
            ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
            cap = pkt[Dot11Beacon].cap
            if not cap.privacy:  # Open network = likely captive portal
                portals[bssid] = {"ssid": ssid, "open": True}
    sniff(iface=interface, prn=handler, timeout=duration, store=False)
    return portals


def check_esp_serial(port="/dev/ttyUSB0", baud=115200):
    """Check ESP32 serial output for portal status."""
    try:
        import serial
        ser = serial.Serial(port, baud, timeout=2)
        lines = []
        for _ in range(20):
            line = ser.readline().decode(errors="replace").strip()
            if line:
                lines.append(line)
        ser.close()
        return lines
    except ImportError:
        return ["pyserial not installed"]
    except Exception as e:
        return [f"Serial error: {e}"]


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_report(report, path="captive_portal_report.json"):
    with open(path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"[+] Report exported to {path}")


if __name__ == "__main__":
    print("ESP Captive Portal Monitor — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 120
        mon = CaptivePortalMonitor(iface)
        report = mon.monitor(dur)
        export_report(report)
