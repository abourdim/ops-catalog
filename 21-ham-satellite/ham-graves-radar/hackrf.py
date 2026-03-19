#!/usr/bin/env python3
"""
Ham GRAVES Radar Receiver
Receives reflections from the French GRAVES space surveillance radar
at 143.050 MHz. Detects meteor reflections and satellite passes via
Doppler-shifted radar echoes from orbiting objects.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

GRAVES_FREQ = 143.050e6
SAMPLE_RATE = 250e3
FFT_SIZE = 32768           # High resolution for Doppler measurement
GAIN = 49.6
MONITOR_SECONDS = 300      # 5 minutes

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = GRAVES_FREQ
    sdr.gain = GAIN
    return sdr

def detect_radar_echoes(sdr, duration_sec):
    """Monitor for GRAVES radar reflections from space objects."""
    chunk_sec = 1.0
    chunks = int(duration_sec / chunk_sec)
    detections = []
    window = signal.blackmanharris(FFT_SIZE)
    print(f"[graves] Monitoring {GRAVES_FREQ/1e6:.3f} MHz for radar echoes...")

    for i in range(chunks):
        iq = sdr.read_samples(int(chunk_sec * SAMPLE_RATE))
        # High-resolution FFT for Doppler measurement
        if len(iq) >= FFT_SIZE:
            spec = np.fft.fftshift(np.fft.fft(iq[:FFT_SIZE] * window))
            psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
            noise = np.median(psd_db)
            peaks, _ = signal.find_peaks(psd_db, height=noise + 12, prominence=8, width=(1, 20))
            for p in peaks:
                freq_offset = (p - FFT_SIZE / 2) * SAMPLE_RATE / FFT_SIZE
                if abs(freq_offset) < SAMPLE_RATE / 2 * 0.9:
                    det = {
                        "time_sec": round(i * chunk_sec, 1),
                        "doppler_hz": round(float(freq_offset), 1),
                        "power_db": round(float(psd_db[p]), 1),
                        "snr_db": round(float(psd_db[p] - noise), 1),
                        "type": classify_echo(freq_offset, psd_db[p] - noise),
                    }
                    detections.append(det)
                    print(f"  [{i:4d}s] ECHO: Doppler {freq_offset:+8.1f} Hz | "
                          f"SNR {det['snr_db']:.1f} dB | {det['type']}")
    return detections

def classify_echo(doppler_hz, snr_db):
    """Classify radar echo by Doppler and SNR characteristics."""
    if abs(doppler_hz) < 50:
        return "direct_signal"
    elif abs(doppler_hz) > 5000:
        return "meteor_reflection"
    elif snr_db > 20:
        return "satellite_pass"
    elif 200 < abs(doppler_hz) < 3000:
        return "space_debris"
    return "unknown_echo"

def main():
    print("=== Ham GRAVES Radar Receiver ===")
    sdr = configure_sdr()
    try:
        detections = detect_radar_echoes(sdr, MONITOR_SECONDS)
        meteors = sum(1 for d in detections if d["type"] == "meteor_reflection")
        sats = sum(1 for d in detections if d["type"] == "satellite_pass")
        print(f"\n[graves] Total echoes: {len(detections)} | Meteors: {meteors} | Satellites: {sats}")
        with open("graves_echoes.json", "w") as f:
            json.dump(detections, f, indent=2)
    except KeyboardInterrupt:
        print("\n[graves] Monitoring stopped.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
