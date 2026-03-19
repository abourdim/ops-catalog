#!/usr/bin/env python3
"""
HackRF Bug Sweeper
Counter-surveillance tool that scans for hidden RF transmitters (bugs).
Performs wideband sweep detecting anomalous continuous transmissions,
measures signal persistence, and alerts on suspicious emitters.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- Configuration ---
SWEEP_START = 50e6       # Start at 50 MHz
SWEEP_END = 2000e6       # End at 2 GHz
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 44
DWELL_TIME = 0.1         # 100ms per step
PERSISTENCE_SCANS = 3    # Number of repeat scans to confirm persistent signals
ANOMALY_THRESHOLD = 15   # dB above median noise floor

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def sweep_spectrum(sdr, start, end, fft_size):
    """Single sweep across frequency range, returning power per step."""
    results = []
    freq = start + SAMPLE_RATE / 2
    while freq < end:
        sdr.center_freq = freq
        time.sleep(0.01)
        iq = sdr.read_samples(fft_size * 2)
        window = signal.hann(fft_size)
        spec = np.fft.fftshift(np.fft.fft(iq[:fft_size] * window))
        psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
        # Find peaks in this segment
        noise_floor = np.median(psd_db)
        peak_db = np.max(psd_db)
        peak_idx = np.argmax(psd_db)
        peak_freq = freq + (peak_idx - fft_size / 2) * (SAMPLE_RATE / fft_size)
        if peak_db - noise_floor > ANOMALY_THRESHOLD:
            results.append({
                "freq_hz": float(peak_freq),
                "freq_mhz": round(peak_freq / 1e6, 3),
                "power_db": round(float(peak_db), 1),
                "noise_floor_db": round(float(noise_floor), 1),
                "snr_db": round(float(peak_db - noise_floor), 1),
            })
        freq += SAMPLE_RATE * 0.8
    return results

def check_persistence(sdr, candidates, num_scans, fft_size):
    """Re-check candidate frequencies to confirm persistent transmitters."""
    persistent = []
    for cand in candidates:
        detection_count = 0
        for _ in range(num_scans):
            sdr.center_freq = cand["freq_hz"]
            time.sleep(0.05)
            iq = sdr.read_samples(fft_size * 2)
            power = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
            if power > cand["noise_floor_db"] + ANOMALY_THRESHOLD * 0.7:
                detection_count += 1
        cand["persistence"] = detection_count / num_scans
        if cand["persistence"] > 0.6:
            persistent.append(cand)
            print(f"  BUG ALERT: {cand['freq_mhz']:.3f} MHz | {cand['snr_db']:.1f} dB SNR | "
                  f"persistence={cand['persistence']:.0%}")
    return persistent

def classify_bug_type(freq_mhz, snr_db):
    """Classify potential bug type by frequency and characteristics."""
    if 88 <= freq_mhz <= 108:
        return "FM_transmitter_bug"
    elif 400 <= freq_mhz <= 470:
        return "UHF_wireless_mic/bug"
    elif 900 <= freq_mhz <= 930:
        return "GSM_bug/cellular"
    elif 2400 <= freq_mhz <= 2500:
        return "WiFi/Bluetooth_device"
    elif 1200 <= freq_mhz <= 1300:
        return "video_transmitter"
    return "unknown_transmitter"

def main():
    print("=== HackRF Bug Sweeper ===")
    print(f"Scanning {SWEEP_START/1e6:.0f} - {SWEEP_END/1e6:.0f} MHz")
    sdr = configure_sdr()
    try:
        # Initial sweep
        print("[sweep] Phase 1: Wideband sweep...")
        candidates = sweep_spectrum(sdr, SWEEP_START, SWEEP_END, FFT_SIZE)
        print(f"[sweep] Found {len(candidates)} anomalous signals")
        # Persistence check
        print("[sweep] Phase 2: Persistence verification...")
        persistent = check_persistence(sdr, candidates, PERSISTENCE_SCANS, FFT_SIZE)
        for p in persistent:
            p["bug_type"] = classify_bug_type(p["freq_mhz"], p["snr_db"])
        print(f"\n[sweep] CONFIRMED persistent transmitters: {len(persistent)}")
        for p in persistent:
            print(f"  {p['freq_mhz']:8.3f} MHz | Type: {p['bug_type']} | SNR: {p['snr_db']:.1f} dB")
        with open("bug_sweep_report.json", "w") as f:
            json.dump({"timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
                        "alerts": persistent}, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
