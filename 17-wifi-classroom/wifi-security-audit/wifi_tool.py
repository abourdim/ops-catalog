#!/usr/bin/env python3
"""WiFi Security Audit — comprehensive security assessment of local WiFi environment."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import (
        Dot11, Dot11Beacon, Dot11Elt, Dot11Deauth, EAPOL, sniff
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")


SECURITY_CHECKS = [
    "encryption_type", "pmf_support", "wps_enabled",
    "hidden_ssid", "default_ssid", "open_network",
    "deauth_vulnerability", "weak_signal",
]

DEFAULT_SSIDS = [
    "linksys", "netgear", "default", "NETGEAR", "dlink", "TP-LINK",
    "ASUS", "Belkin", "ARRIS", "Motorola", "ATT", "Verizon",
]


class SecurityAuditor:
    """Audit WiFi security for all visible networks."""

    def __init__(self, interface):
        self.interface = interface
        self.networks = {}
        self.audit_results = {}

    def scan(self, duration=30):
        print(f"[*] Scanning networks for security audit: {duration}s")
        channels = list(range(1, 14))
        per_ch = max(duration / len(channels), 0.5)
        for ch in channels:
            set_channel(self.interface, ch)
            sniff(iface=self.interface, prn=self._handle_beacon,
                  timeout=per_ch, store=False)
        return self.networks

    def _handle_beacon(self, pkt):
        if not pkt.haslayer(Dot11Beacon):
            return
        bssid = pkt[Dot11].addr2
        ssid_elt = pkt.getlayer(Dot11Elt)
        ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
        signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
        channel = self._get_channel(pkt)
        caps = self._parse_security(pkt)

        self.networks[bssid] = {
            "ssid": ssid, "signal": signal, "channel": channel, **caps
        }

    def _parse_security(self, pkt):
        result = {"encryption": "Open", "wpa_version": None,
                  "cipher": None, "auth": None, "pmf": False,
                  "wps": False}
        cap = pkt[Dot11Beacon].cap
        if not cap.privacy:
            return result

        elt = pkt.getlayer(Dot11Elt)
        while elt:
            if elt.ID == 48:  # RSN (WPA2/WPA3)
                result["encryption"] = "WPA2"
                result["wpa_version"] = "WPA2"
                if elt.info and len(elt.info) > 8:
                    rsn_caps = elt.info[-2:] if len(elt.info) >= 2 else b"\x00\x00"
                    if len(rsn_caps) == 2:
                        flags = int.from_bytes(rsn_caps, "little")
                        if flags & 0x0080:
                            result["pmf"] = True
                            result["encryption"] = "WPA3"
            elif elt.ID == 221:
                if elt.info and elt.info[:4] == b"\x00\x50\xf2\x01":
                    if result["encryption"] == "Open":
                        result["encryption"] = "WPA"
                        result["wpa_version"] = "WPA"
                if elt.info and elt.info[:4] == b"\x00\x50\xf2\x04":
                    result["wps"] = True
            elt = elt.payload.getlayer(Dot11Elt) if hasattr(elt.payload, "getlayer") else None

        if result["encryption"] == "Open" and cap.privacy:
            result["encryption"] = "WEP"
        return result

    def audit(self):
        """Run security audit on all discovered networks."""
        for bssid, net in self.networks.items():
            issues = []
            score = 100

            if net["encryption"] == "Open":
                issues.append({"check": "open_network", "severity": "critical",
                               "detail": "No encryption"})
                score -= 40
            elif net["encryption"] == "WEP":
                issues.append({"check": "weak_encryption", "severity": "critical",
                               "detail": "WEP is easily cracked"})
                score -= 35
            elif net["encryption"] == "WPA":
                issues.append({"check": "outdated_encryption", "severity": "high",
                               "detail": "WPA1 has known vulnerabilities"})
                score -= 20

            if not net.get("pmf"):
                issues.append({"check": "no_pmf", "severity": "medium",
                               "detail": "No Protected Management Frames"})
                score -= 10

            if net.get("wps"):
                issues.append({"check": "wps_enabled", "severity": "high",
                               "detail": "WPS PIN brute-force vulnerability"})
                score -= 15

            ssid = net.get("ssid", "")
            if not ssid:
                issues.append({"check": "hidden_ssid", "severity": "low",
                               "detail": "Hidden SSID (security through obscurity)"})
                score -= 5
            elif ssid.lower() in [s.lower() for s in DEFAULT_SSIDS]:
                issues.append({"check": "default_ssid", "severity": "medium",
                               "detail": "Default manufacturer SSID"})
                score -= 10

            self.audit_results[bssid] = {
                "ssid": net["ssid"], "score": max(score, 0),
                "grade": self._grade(max(score, 0)),
                "issues": issues, "encryption": net["encryption"],
            }
        return self.audit_results

    def _grade(self, score):
        if score >= 90: return "A"
        if score >= 75: return "B"
        if score >= 60: return "C"
        if score >= 40: return "D"
        return "F"

    def _get_channel(self, pkt):
        elt = pkt.getlayer(Dot11Elt)
        while elt:
            if elt.ID == 3 and elt.info:
                return elt.info[0]
            elt = elt.payload.getlayer(Dot11Elt) if hasattr(elt.payload, "getlayer") else None
        return 0


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_audit(results, path="security_audit.json"):
    with open(path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"[+] Audit exported to {path}")


if __name__ == "__main__":
    print("WiFi Security Audit — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 30
        auditor = SecurityAuditor(iface)
        auditor.scan(dur)
        results = auditor.audit()
        export_audit(results)
        print(f"[+] Audited {len(results)} networks")
