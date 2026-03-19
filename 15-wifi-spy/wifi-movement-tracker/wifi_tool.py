#!/usr/bin/env python3
"""WiFi Movement Tracker — detects and tracks device movement via signal patterns."""

import subprocess
import sys
import time
import json
import math
from collections import defaultdict

try:
    from scapy.all import Dot11, Dot11ProbeReq, Dot11Beacon, sniff
except ImportError:
    sys.exit("scapy required: pip install scapy")


class MovementTracker:
    """Track device movement using RSSI variation over time windows."""

    def __init__(self, interface, window_sec=5):
        self.interface = interface
        self.window_sec = window_sec
        self.device_signals = defaultdict(list)  # mac -> [(time, signal)]

    def handle_packet(self, pkt):
        if not pkt.haslayer(Dot11):
            return
        mac = pkt[Dot11].addr2
        if not mac or mac == "ff:ff:ff:ff:ff:ff":
            return
        signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else None
        if signal is None:
            return
        self.device_signals[mac].append((time.time(), signal))

    def track(self, duration=120):
        print(f"[*] Tracking movement on {self.interface} for {duration}s")
        sniff(iface=self.interface, prn=self.handle_packet,
              timeout=duration, store=False)
        return self.analyze_all()

    def analyze_all(self):
        results = []
        for mac, samples in self.device_signals.items():
            if len(samples) < 5:
                continue
            analysis = self._analyze_device(mac, samples)
            results.append(analysis)
        return sorted(results, key=lambda x: x["movement_score"], reverse=True)

    def _analyze_device(self, mac, samples):
        signals = [s for _, s in samples]
        times = [t for t, _ in samples]
        duration = times[-1] - times[0] if len(times) > 1 else 0

        # Compute windowed variance for movement detection
        windows = self._compute_windows(samples)
        variances = [w["variance"] for w in windows]
        avg_variance = sum(variances) / len(variances) if variances else 0

        # Movement score: 0=stationary, 100=fast movement
        score = min(int(avg_variance * 2), 100)

        # Estimate velocity from signal rate of change
        velocity = self._estimate_velocity(samples)

        return {
            "mac": mac,
            "movement_score": score,
            "status": self._classify(score),
            "avg_signal": round(sum(signals) / len(signals), 1),
            "signal_range": round(max(signals) - min(signals), 1),
            "avg_variance": round(avg_variance, 2),
            "estimated_velocity": velocity,
            "sample_count": len(samples),
            "duration_sec": round(duration, 1),
            "windows": windows[:20],
        }

    def _compute_windows(self, samples):
        if not samples:
            return []
        windows = []
        start = samples[0][0]
        end = samples[-1][0]
        t = start
        while t < end:
            w_samples = [s for ts, s in samples
                         if t <= ts < t + self.window_sec]
            if len(w_samples) >= 2:
                mean = sum(w_samples) / len(w_samples)
                var = sum((s - mean) ** 2 for s in w_samples) / len(w_samples)
                windows.append({
                    "start": round(t - start, 1),
                    "mean_signal": round(mean, 1),
                    "variance": round(var, 2),
                    "samples": len(w_samples),
                })
            t += self.window_sec
        return windows

    def _estimate_velocity(self, samples):
        """Rough velocity estimate from signal slope (dBm/sec)."""
        if len(samples) < 3:
            return "unknown"
        deltas = []
        for i in range(1, len(samples)):
            dt = samples[i][0] - samples[i - 1][0]
            ds = samples[i][1] - samples[i - 1][1]
            if dt > 0:
                deltas.append(abs(ds / dt))
        avg_rate = sum(deltas) / len(deltas) if deltas else 0
        if avg_rate < 0.5:
            return "stationary"
        if avg_rate < 2:
            return "walking"
        if avg_rate < 5:
            return "jogging"
        return "fast"

    def _classify(self, score):
        if score < 10: return "stationary"
        if score < 30: return "slight_movement"
        if score < 60: return "walking"
        return "fast_movement"


def set_channel(interface, channel):
    subprocess.run(["iwconfig", interface, "channel", str(channel)],
                   capture_output=True)


def export_tracking(data, path="movement_tracking.json"):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"[+] Tracking data exported to {path}")


if __name__ == "__main__":
    print("WiFi Movement Tracker — companion to the web dashboard")
    print("Usage: sudo python3 wifi_tool.py <interface> [duration]")
    if len(sys.argv) > 1:
        iface = sys.argv[1]
        dur = int(sys.argv[2]) if len(sys.argv) > 2 else 120
        tracker = MovementTracker(iface)
        data = tracker.track(dur)
        export_tracking(data)
        print(f"[+] Tracked {len(data)} devices")
