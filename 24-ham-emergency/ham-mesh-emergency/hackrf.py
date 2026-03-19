#!/usr/bin/env python3
"""
Ham Mesh Emergency Network Monitor
Monitors emergency mesh network frequencies for amateur radio disaster
communications. Scans VHF/UHF simplex channels, detects emergency traffic,
and logs signal quality for network coverage assessment.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

EMERGENCY_FREQS = [
    {"name": "ARES_simplex", "freq": 146.52e6},
    {"name": "RACES_net", "freq": 147.42e6},
    {"name": "EmComm_UHF", "freq": 446.0e6},
    {"name": "APRS_emergency", "freq": 144.39e6},
    {"name": "Winlink_VHF", "freq": 145.07e6},
]
SAMPLE_RATE = 250e3
GAIN = 40
MONITOR_CYCLE = 5          # Seconds per frequency

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def assess_channel(sdr, freq, duration_sec):
    """Monitor a channel and assess activity and quality."""
    sdr.center_freq = freq
    time.sleep(0.03)
    iq = sdr.read_samples(int(duration_sec * SAMPLE_RATE))
    # Overall power
    power_db = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
    # Detect voice/data activity via energy variance
    chunk = int(SAMPLE_RATE * 0.1)
    powers = [10 * np.log10(np.mean(np.abs(iq[i:i+chunk]) ** 2) + 1e-12)
              for i in range(0, len(iq) - chunk, chunk)]
    powers = np.array(powers)
    activity_ratio = np.sum(powers > np.median(powers) + 6) / len(powers)
    # Noise floor estimate
    noise_floor = np.percentile(powers, 10)
    return {
        "power_db": round(float(power_db), 1),
        "noise_floor_db": round(float(noise_floor), 1),
        "activity_pct": round(float(activity_ratio * 100), 1),
        "peak_db": round(float(np.max(powers)), 1),
        "channel_clear": activity_ratio < 0.05,
    }

def run_emergency_scan(sdr, num_cycles=10):
    """Scan all emergency frequencies for specified cycles."""
    results = {}
    for cycle in range(num_cycles):
        print(f"\n[emcomm] Scan cycle {cycle+1}/{num_cycles}")
        for ch in EMERGENCY_FREQS:
            status = assess_channel(sdr, ch["freq"], MONITOR_CYCLE)
            key = ch["name"]
            if key not in results:
                results[key] = {"freq_mhz": ch["freq"] / 1e6, "scans": []}
            results[key]["scans"].append(status)
            state = "ACTIVE" if status["activity_pct"] > 5 else "quiet"
            print(f"  {ch['name']:18s} {ch['freq']/1e6:.3f} MHz | "
                  f"{state:6s} | Activity: {status['activity_pct']:.0f}% | NF: {status['noise_floor_db']:.1f} dB")
    return results

def main():
    print("=== Ham Mesh Emergency Network Monitor ===")
    sdr = configure_sdr()
    try:
        results = run_emergency_scan(sdr, num_cycles=5)
        with open("emergency_network_status.json", "w") as f:
            json.dump(results, f, indent=2)
        print("\n[emcomm] Network status saved to emergency_network_status.json")
    except KeyboardInterrupt:
        print("\n[emcomm] Scan interrupted.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
