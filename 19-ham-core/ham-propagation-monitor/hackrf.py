#!/usr/bin/env python3
"""
Ham Propagation Monitor
Monitors beacon frequencies across multiple ham bands to assess
real-time radio propagation conditions. Tracks beacon signal strength
over time to detect band openings and propagation shifts.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- Beacon Frequencies (VHF/UHF beacons) ---
BEACONS = [
    {"name": "6m_beacon", "freq": 50.06e6, "band": "6m"},
    {"name": "2m_beacon", "freq": 144.285e6, "band": "2m"},
    {"name": "70cm_beacon", "freq": 432.3e6, "band": "70cm"},
]
SAMPLE_RATE = 250e3
FFT_SIZE = 4096            # High resolution for narrow beacons
GAIN = 49
MONITOR_INTERVAL = 30      # Seconds between measurements
NUM_MEASUREMENTS = 60      # Total measurements per session

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def measure_beacon(sdr, beacon_freq, fft_size):
    """Measure beacon signal strength with high FFT resolution."""
    sdr.center_freq = beacon_freq
    time.sleep(0.05)
    iq = sdr.read_samples(fft_size * 8)
    window = signal.blackmanharris(fft_size)
    psd = np.zeros(fft_size)
    for i in range(min(8, len(iq) // fft_size)):
        seg = iq[i * fft_size:(i + 1) * fft_size]
        spec = np.fft.fftshift(np.fft.fft(seg * window))
        psd += np.abs(spec) ** 2
    psd /= 8
    psd_db = 10 * np.log10(psd + 1e-12)
    noise_floor = np.median(psd_db)
    peak_db = np.max(psd_db)
    snr = peak_db - noise_floor
    return {
        "peak_db": round(float(peak_db), 1),
        "noise_floor_db": round(float(noise_floor), 1),
        "snr_db": round(float(snr), 1),
        "beacon_detected": snr > 6,
    }

def assess_propagation(beacon_data):
    """Assess propagation condition from beacon measurements."""
    detected_bands = [b["band"] for b in beacon_data if b.get("beacon_detected")]
    if "6m" in detected_bands:
        return "ENHANCED (sporadic-E or tropospheric)"
    elif len(detected_bands) >= 2:
        return "GOOD (normal+ propagation)"
    elif len(detected_bands) == 1:
        return "FAIR (normal propagation)"
    return "POOR (no beacons detected)"

def main():
    print("=== Ham Propagation Monitor ===")
    sdr = configure_sdr()
    history = []
    try:
        for i in range(NUM_MEASUREMENTS):
            timestamp = time.strftime("%Y-%m-%dT%H:%M:%S")
            measurement = {"time": timestamp, "beacons": []}
            for beacon in BEACONS:
                result = measure_beacon(sdr, beacon["freq"], FFT_SIZE)
                result["name"] = beacon["name"]
                result["band"] = beacon["band"]
                measurement["beacons"].append(result)
                status = "DETECTED" if result["beacon_detected"] else "absent"
                print(f"  {beacon['name']:12s} | SNR: {result['snr_db']:5.1f} dB | {status}")
            condition = assess_propagation(measurement["beacons"])
            measurement["condition"] = condition
            history.append(measurement)
            print(f"  [{timestamp}] Propagation: {condition}\n")
            if i < NUM_MEASUREMENTS - 1:
                time.sleep(MONITOR_INTERVAL)

        with open("propagation_log.json", "w") as f:
            json.dump(history, f, indent=2)
        print(f"[prop] Logged {len(history)} measurements to propagation_log.json")
    except KeyboardInterrupt:
        print("\n[prop] Monitoring stopped.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
