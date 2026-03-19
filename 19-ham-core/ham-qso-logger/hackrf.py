#!/usr/bin/env python3
"""
Ham QSO Logger - SDR Activity Monitor
Monitors ham band activity via SDR and automatically logs detected
QSO (contact) events with timestamps, frequencies, signal reports,
and estimated durations for station logging.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- Configuration ---
MONITOR_FREQ = 145.5e6    # 2m FM simplex
SAMPLE_RATE = 250e3
FFT_SIZE = 1024
GAIN = 38
SQUELCH_DB = -45           # Squelch threshold
MONITOR_DURATION = 120     # seconds

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = MONITOR_FREQ
    sdr.gain = GAIN
    return sdr

def measure_rssi(iq_samples):
    """Compute RSSI in dBFS."""
    power = np.mean(np.abs(iq_samples) ** 2)
    return 10 * np.log10(power + 1e-12)

def rssi_to_s_meter(rssi_db):
    """Convert RSSI to approximate S-meter reading."""
    # S9 = -73 dBm, each S unit = 6 dB
    # Rough mapping for RTL-SDR dBFS
    if rssi_db > -20:
        return "S9+20"
    elif rssi_db > -30:
        return "S9+10"
    elif rssi_db > -40:
        return "S9"
    elif rssi_db > -46:
        return "S8"
    elif rssi_db > -52:
        return "S7"
    elif rssi_db > -58:
        return "S6"
    elif rssi_db > -64:
        return "S5"
    return "S1-S4"

def monitor_and_log(sdr, duration_sec, squelch_db):
    """Monitor frequency and log QSO activity."""
    chunk_duration = 0.25  # 250ms chunks
    chunk_samples = int(chunk_duration * SAMPLE_RATE)
    num_chunks = int(duration_sec / chunk_duration)
    qso_log = []
    in_qso = False
    qso_start = None
    peak_rssi = -100
    rssi_readings = []

    print(f"[qso] Monitoring {MONITOR_FREQ/1e6:.4f} MHz | Squelch: {squelch_db} dB")

    for i in range(num_chunks):
        iq = sdr.read_samples(chunk_samples)
        rssi = measure_rssi(iq)

        if rssi > squelch_db and not in_qso:
            # QSO started
            in_qso = True
            qso_start = time.time()
            peak_rssi = rssi
            rssi_readings = [rssi]
            print(f"  [{time.strftime('%H:%M:%S')}] QSO START | RSSI: {rssi:.1f} dB")
        elif rssi > squelch_db and in_qso:
            peak_rssi = max(peak_rssi, rssi)
            rssi_readings.append(rssi)
        elif rssi <= squelch_db and in_qso:
            # QSO ended
            duration = time.time() - qso_start
            avg_rssi = np.mean(rssi_readings)
            s_meter = rssi_to_s_meter(avg_rssi)
            entry = {
                "start_time": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(qso_start)),
                "duration_sec": round(duration, 1),
                "freq_mhz": MONITOR_FREQ / 1e6,
                "peak_rssi_db": round(float(peak_rssi), 1),
                "avg_rssi_db": round(float(avg_rssi), 1),
                "s_meter": s_meter,
            }
            qso_log.append(entry)
            print(f"  [{time.strftime('%H:%M:%S')}] QSO END | Duration: {duration:.1f}s | "
                  f"Peak: {peak_rssi:.1f} dB | Report: {s_meter}")
            in_qso = False

    return qso_log

def main():
    print("=== Ham QSO Logger ===")
    sdr = configure_sdr()
    try:
        log = monitor_and_log(sdr, MONITOR_DURATION, SQUELCH_DB)
        print(f"\n[qso] Session complete. {len(log)} QSOs logged.")
        with open("qso_log.json", "w") as f:
            json.dump({"session": time.strftime("%Y-%m-%d"), "entries": log}, f, indent=2)
    except KeyboardInterrupt:
        print("\n[qso] Monitoring stopped.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
