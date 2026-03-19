#!/usr/bin/env python3
"""WiFi Invisibility Test — measures how detectable your device is on the air."""

import subprocess
import sys
import time
import json

try:
    from scapy.all import (
        Dot11, Dot11ProbeReq, Dot11ProbeResp, Dot11Beacon,
        Dot11Elt, RadioTap, sniff, get_if_hwaddr
    )
except ImportError:
    sys.exit("scapy required: pip install scapy")


class InvisibilityTester:
    """Score how invisible (or visible) a target MAC is on the RF spectrum."""

    def __init__(self, interface, target_mac=None):
        self.interface = interface
        self.target_mac = target_mac or self._get_own_mac()
        self.probe_emissions = []
        self.data_emissions = []
        self.responses_received = []
        self.exposure_score = 0

    def _get_own_mac(self):
        try:
            return get_if_hwaddr(self.interface)
        except Exception:
            return "00:00:00:00:00:00"

    def handle_packet(self, pkt):
        if not pkt.haslayer(Dot11):
            return
        dot11 = pkt[Dot11]
        signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
        now = time.time()

        # Check if our target is transmitting
        if dot11.addr2 and dot11.addr2.lower() == self.target_mac.lower():
            if pkt.haslayer(Dot11ProbeReq):
                ssid_elt = pkt.getlayer(Dot11Elt)
                ssid = ssid_elt.info.decode(errors="replace") if ssid_elt and ssid_elt.info else ""
                self.probe_emissions.append({
                    "time": now, "ssid": ssid, "signal": signal
                })
            else:
                self.data_emissions.append({
                    "time": now, "type": f"{dot11.type}/{dot11.subtype}",
                    "signal": signal
                })

        # Check if someone is responding to our target
        if dot11.addr1 and dot11.addr1.lower() == self.target_mac.lower():
            if pkt.haslayer(Dot11ProbeResp):
                self.responses_received.append({
                    "time": now, "from": dot11.addr2, "signal": signal
                })

    def test(self, duration=60):
        print(f"[*] Invisibility test for {self.target_mac} on {self.interface}")
        print(f"    Monitoring for {duration}s...")
        sniff(iface=self.interface, prn=self.handle_packet,
              timeout=duration, store=False)
        return self.get_score()

    def get_score(self):
        """Calculate an invisibility score (0=fully visible, 100=invisible)."""
        score = 100
        probe_penalty = min(len(self.probe_emissions) * 5, 40)
        score -= probe_penalty
        ssids_leaked = len(set(p["ssid"] for p in self.probe_emissions if p["ssid"]))
        score -= min(ssids_leaked * 8, 25)
        data_penalty = min(len(self.data_emissions) * 2, 20)
        score -= data_penalty
        response_penalty = min(len(self.responses_received) * 3, 15)
        score -= response_penalty
        score = max(score, 0)

        return {
            "target_mac": self.target_mac,
            "invisibility_score": score,
            "grade": self._grade(score),
            "probe_requests_sent": len(self.probe_emissions),
            "ssids_leaked": list(set(p["ssid"] for p in self.probe_emissions if p["ssid"])),
            "data_frames_sent": len(self.data_emissions),
            "probe_responses_received": len(self.responses_received),
            "recommendations": self._recommendations(score),
        }

    def _grade(self, score):
        if score >= 90: return "A+ (Ghost)"
        if score >= 75: return "B (Low profile)"
        if score >= 50: return "C (Noticeable)"
        if score >= 25: return "D (Visible)"
        return "F (Broadcasting loudly)"

    def _recommendations(self, score):
        recs = []
        if self.probe_emissions:
            recs.append("Disable automatic WiFi probing in device settings")
        if len(set(p["ssid"] for p in self.probe_emissions if p["ssid"])) > 3:
            recs.append("Clear saved network list to reduce SSID leakage")
        if self.data_emissions:
            recs.append("Use airplane mode when not actively connected")
        if score < 50:
            recs.append("Consider MAC randomization")
        return recs


def disable_probing(interface):
    """Attempt to suppress probe requests (Linux NetworkManager)."""
    subprocess.run(["nmcli", "device", "wifi", "rescan", "ifname", interface],
                   capture_output=True)
    return "Rescan triggered — check if probing reduced"


def export_results(results, path="invisibility_results.json"):
    with open(path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"[+] Results exported to {path}")


if __name__ == "__main__":
    print("WiFi Invisibility Test — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [target_mac]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        mac = sys.argv[2] if len(sys.argv) > 2 else None
        tester = InvisibilityTester(iface, mac)
        results = tester.test(60)
        export_results(results)
        print(f"\n  Score: {results['invisibility_score']}/100 — {results['grade']}")
