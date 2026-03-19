#!/usr/bin/env python3
"""
HackRF Tracker Hunter
Detects and locates hidden GPS/Bluetooth trackers by scanning for their
periodic beacon transmissions. Monitors BLE advertisement channels and
common tracker frequencies for suspicious periodic signals.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- Configuration ---
# BLE advertisement channels (2402, 2426, 2480 MHz) - RTL-SDR may not reach
# Fall back to lower frequency trackers
TRACKER_FREQS = [
    {"name": "ISM_315", "freq": 315e6, "desc": "Low-freq tracker beacons"},
    {"name": "ISM_433", "freq": 433.92e6, "desc": "EU ISM tracker beacons"},
    {"name": "ISM_868", "freq": 868e6, "desc": "LoRa trackers"},
    {"name": "ISM_915", "freq": 915e6, "desc": "US ISM trackers"},
]
SAMPLE_RATE = 2.0e6
FFT_SIZE = 2048
GAIN = 44
MONITOR_TIME = 10.0      # Seconds to monitor each frequency
BEACON_MIN_INTERVAL = 0.5  # Minimum beacon interval (seconds)
BEACON_MAX_INTERVAL = 30.0  # Maximum beacon interval (seconds)

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def detect_beacons(sdr, freq, monitor_sec, fft_size):
    """Monitor a frequency for periodic beacon transmissions."""
    sdr.center_freq = freq
    time.sleep(0.03)
    chunk_duration = 0.05  # 50ms chunks
    chunk_samples = int(chunk_duration * SAMPLE_RATE)
    num_chunks = int(monitor_sec / chunk_duration)
    power_timeline = []
    threshold_crossings = []

    for i in range(num_chunks):
        iq = sdr.read_samples(chunk_samples)
        power = np.mean(np.abs(iq) ** 2)
        power_db = 10 * np.log10(power + 1e-12)
        power_timeline.append(power_db)

    # Detect bursts above adaptive threshold
    power_arr = np.array(power_timeline)
    noise_est = np.percentile(power_arr, 30)
    threshold = noise_est + 8  # 8 dB above noise
    above = power_arr > threshold
    edges = np.diff(above.astype(int))
    rising = np.where(edges == 1)[0]

    # Analyze periodicity of beacon bursts
    if len(rising) >= 2:
        intervals = np.diff(rising) * chunk_duration
        mean_interval = float(np.mean(intervals))
        std_interval = float(np.std(intervals))
        is_periodic = std_interval < mean_interval * 0.3  # Low jitter = periodic
        return {
            "burst_count": len(rising),
            "mean_interval_sec": round(mean_interval, 3),
            "interval_std_sec": round(std_interval, 3),
            "is_periodic": is_periodic,
            "max_power_db": round(float(np.max(power_arr)), 1),
            "noise_floor_db": round(float(noise_est), 1),
        }
    return {"burst_count": len(rising), "is_periodic": False}

def scan_for_trackers(sdr):
    """Scan all tracker frequencies for periodic beacons."""
    detections = []
    for tf in TRACKER_FREQS:
        print(f"[tracker] Monitoring {tf['name']} ({tf['freq']/1e6:.2f} MHz) for {MONITOR_TIME}s...")
        result = detect_beacons(sdr, tf["freq"], MONITOR_TIME, FFT_SIZE)
        result["band"] = tf["name"]
        result["freq_mhz"] = tf["freq"] / 1e6
        if result["burst_count"] > 2 and result.get("is_periodic", False):
            result["threat"] = "TRACKER_DETECTED"
            print(f"  !! TRACKER DETECTED: {result['burst_count']} beacons, "
                  f"interval={result.get('mean_interval_sec', 0):.2f}s")
            detections.append(result)
        elif result["burst_count"] > 0:
            print(f"  {result['burst_count']} bursts (non-periodic)")
        else:
            print(f"  No beacons detected")
    return detections

def main():
    print("=== HackRF Tracker Hunter ===")
    sdr = configure_sdr()
    try:
        detections = scan_for_trackers(sdr)
        print(f"\n[tracker] Scan complete. Trackers found: {len(detections)}")
        for d in detections:
            print(f"  {d['band']} | {d['burst_count']} beacons | "
                  f"interval={d.get('mean_interval_sec', 0):.2f}s")
        with open("tracker_hunt_results.json", "w") as f:
            json.dump(detections, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
