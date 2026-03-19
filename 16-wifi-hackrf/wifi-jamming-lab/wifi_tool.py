#!/usr/bin/env python3
"""WiFi Jamming Lab — educational jamming detection and analysis (receive-only)."""

import subprocess
import sys
import time
import json
from collections import defaultdict

try:
    from scapy.all import Dot11, Dot11Beacon, Dot11Elt, sniff
except ImportError:
    sys.exit("scapy required: pip install scapy")

CHANNELS_24 = list(range(1, 14))


class JammingDetector:
    """Detect and characterize WiFi jamming by monitoring signal disruption."""

    def __init__(self, interface):
        self.interface = interface
        self.baseline = {}      # channel -> {beacon_rate, avg_signal}
        self.monitoring = {}    # channel -> {beacon_rate, avg_signal}
        self.anomalies = []

    def establish_baseline(self, dwell=3):
        """Capture baseline beacon rates per channel."""
        print("[*] Establishing baseline across 2.4 GHz channels...")
        for ch in CHANNELS_24:
            set_channel(self.interface, ch)
            count = [0]
            signals = []

            def handler(pkt):
                if pkt.haslayer(Dot11Beacon):
                    count[0] += 1
                    sig = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
                    signals.append(sig)

            sniff(iface=self.interface, prn=handler, timeout=dwell, store=False)
            self.baseline[ch] = {
                "beacon_rate": count[0] / dwell,
                "avg_signal": sum(signals) / len(signals) if signals else -99,
                "ap_count": count[0],
            }
        print(f"[+] Baseline: {sum(b['ap_count'] for b in self.baseline.values())} beacons")

    def monitor_for_jamming(self, duration=60, dwell=2):
        """Monitor channels and compare against baseline."""
        print(f"[*] Monitoring for jamming indicators: {duration}s")
        end_time = time.time() + duration

        while time.time() < end_time:
            for ch in CHANNELS_24:
                if time.time() > end_time:
                    break
                set_channel(self.interface, ch)
                count = [0]
                signals = []

                def handler(pkt):
                    if pkt.haslayer(Dot11Beacon):
                        count[0] += 1
                        sig = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else -99
                        signals.append(sig)

                sniff(iface=self.interface, prn=handler, timeout=dwell, store=False)
                current_rate = count[0] / dwell
                baseline_rate = self.baseline.get(ch, {}).get("beacon_rate", 0)

                if baseline_rate > 0 and current_rate < baseline_rate * 0.3:
                    anomaly = {
                        "time": time.time(), "channel": ch,
                        "type": "beacon_drop",
                        "baseline_rate": round(baseline_rate, 1),
                        "current_rate": round(current_rate, 1),
                        "drop_pct": round((1 - current_rate / baseline_rate) * 100, 1),
                    }
                    self.anomalies.append(anomaly)
                    print(f"[!] Ch {ch}: beacon rate dropped {anomaly['drop_pct']}%")

    def hackrf_noise_floor(self, channel):
        """Use HackRF to measure noise floor elevation (jamming indicator)."""
        freq = 2412 + (channel - 1) * 5
        cmd = ["hackrf_sweep", "-f", f"{freq - 10}:{freq + 10}",
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
        if powers:
            return {"channel": channel, "noise_floor": round(min(powers), 1),
                    "avg_power": round(sum(powers) / len(powers), 1),
                    "peak": round(max(powers), 1)}
        return {"channel": channel, "noise_floor": -100}

    def get_report(self):
        return {
            "baseline": self.baseline,
            "anomalies": self.anomalies,
            "jamming_detected": len(self.anomalies) > 0,
            "affected_channels": list(set(a["channel"] for a in self.anomalies)),
            "severity": self._assess_severity(),
        }

    def _assess_severity(self):
        if not self.anomalies:
            return "none"
        avg_drop = sum(a["drop_pct"] for a in self.anomalies) / len(self.anomalies)
        if avg_drop > 80:
            return "critical"
        if avg_drop > 50:
            return "high"
        if avg_drop > 30:
            return "medium"
        return "low"


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_report(report, path="jamming_report.json"):
    with open(path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"[+] Report exported to {path}")


if __name__ == "__main__":
    print("WiFi Jamming Lab — HackRF companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 60
        det = JammingDetector(iface)
        det.establish_baseline()
        det.monitor_for_jamming(dur)
        report = det.get_report()
        export_report(report)
