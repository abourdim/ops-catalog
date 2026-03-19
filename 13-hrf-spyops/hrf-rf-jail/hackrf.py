#!/usr/bin/env python3
"""
HackRF RF Jail
RF containment monitoring system. Creates a spectral "fence" around a
defined area by continuously monitoring for RF emissions that should not
exist within a controlled zone. Alerts when unauthorized transmissions
are detected inside the monitored space.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- Configuration ---
MONITOR_BANDS = [
    {"name": "cell_850", "start": 869e6, "end": 894e6},
    {"name": "cell_1900", "start": 1930e6, "end": 1990e6},
    {"name": "wifi_2g", "start": 2400e6, "end": 2484e6},
    {"name": "bluetooth", "start": 2400e6, "end": 2484e6},
]
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 44
VIOLATION_THRESHOLD = -40  # dBFS - signal above this is a violation
SCAN_INTERVAL = 2.0        # Seconds between scans

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def scan_restricted_band(sdr, band_start, band_end, fft_size):
    """Scan a restricted frequency band for unauthorized emissions."""
    violations = []
    freq = band_start + SAMPLE_RATE / 2
    window = signal.hann(fft_size)
    while freq < band_end:
        sdr.center_freq = freq
        time.sleep(0.01)
        iq = sdr.read_samples(fft_size * 2)
        spec = np.fft.fftshift(np.fft.fft(iq[:fft_size] * window))
        psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
        noise_floor = np.median(psd_db)
        # Check for signals above violation threshold
        peaks, _ = signal.find_peaks(psd_db, height=VIOLATION_THRESHOLD, prominence=10)
        for p in peaks:
            peak_freq = freq + (p - fft_size / 2) * (SAMPLE_RATE / fft_size)
            violations.append({
                "freq_hz": float(peak_freq),
                "freq_mhz": round(peak_freq / 1e6, 3),
                "power_db": round(float(psd_db[p]), 1),
                "snr_db": round(float(psd_db[p] - noise_floor), 1),
            })
        freq += SAMPLE_RATE * 0.8
    return violations

def run_rf_jail(sdr, num_scans=20):
    """Monitor all restricted bands continuously."""
    total_violations = 0
    violation_log = []
    print(f"[jail] RF Containment Zone Active")
    print(f"[jail] Monitoring {len(MONITOR_BANDS)} restricted bands")
    print(f"[jail] Violation threshold: {VIOLATION_THRESHOLD} dBFS")

    for scan_num in range(num_scans):
        scan_time = time.strftime("%H:%M:%S")
        scan_violations = []
        for band in MONITOR_BANDS:
            try:
                violations = scan_restricted_band(sdr, band["start"], band["end"], FFT_SIZE)
                for v in violations:
                    v["band"] = band["name"]
                    v["scan"] = scan_num
                    v["time"] = scan_time
                scan_violations.extend(violations)
            except Exception:
                pass  # Skip bands outside SDR range

        if scan_violations:
            total_violations += len(scan_violations)
            violation_log.extend(scan_violations)
            print(f"  [{scan_time}] VIOLATION: {len(scan_violations)} unauthorized signals!")
            for v in scan_violations[:3]:
                print(f"    {v['band']}: {v['freq_mhz']:.3f} MHz @ {v['power_db']:.1f} dB")
        else:
            print(f"  [{scan_time}] Zone CLEAR - no violations")
        time.sleep(SCAN_INTERVAL)

    return violation_log, total_violations

def main():
    print("=== HackRF RF Jail ===")
    sdr = configure_sdr()
    try:
        violations, total = run_rf_jail(sdr, num_scans=20)
        print(f"\n[jail] Session complete. Total violations: {total}")
        with open("rf_jail_log.json", "w") as f:
            json.dump({"violations": violations, "total": total}, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
