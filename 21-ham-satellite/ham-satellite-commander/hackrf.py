#!/usr/bin/env python3
"""
Ham Satellite Commander
Multi-satellite receive station. Tracks amateur radio satellite downlinks,
applies Doppler correction based on orbital parameters, and monitors
transponder activity across multiple amateur satellites.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

SATELLITES = [
    {"name": "AO-91", "downlink": 145.96e6, "mode": "FM", "altitude_km": 400},
    {"name": "SO-50", "downlink": 436.795e6, "mode": "FM", "altitude_km": 650},
    {"name": "ISS", "downlink": 145.80e6, "mode": "FM", "altitude_km": 420},
    {"name": "AO-92", "downlink": 145.88e6, "mode": "FM", "altitude_km": 400},
]
SAMPLE_RATE = 250e3
GAIN = 49
LISTEN_TIME = 15           # seconds per satellite

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def max_doppler_for_altitude(altitude_km, freq_hz):
    """Calculate maximum Doppler shift for a satellite at given altitude."""
    c = 3e8
    # Orbital velocity approximation
    R_earth = 6371
    v_orbital = np.sqrt(3.986e14 / ((R_earth + altitude_km) * 1000))
    return freq_hz * v_orbital / c

def listen_satellite(sdr, sat, duration_sec):
    """Listen to a satellite downlink and assess signal."""
    sdr.center_freq = sat["downlink"]
    time.sleep(0.05)
    max_dop = max_doppler_for_altitude(sat["altitude_km"], sat["downlink"])
    iq = sdr.read_samples(int(duration_sec * SAMPLE_RATE))
    power_db = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
    # Check spectrum for satellite signal
    spec = np.abs(np.fft.fftshift(np.fft.fft(iq[:4096])))
    spec_db = 10 * np.log10(spec ** 2 + 1e-12)
    noise = np.median(spec_db)
    peak = np.max(spec_db)
    snr = peak - noise
    # Check for Doppler-shifted carrier
    peak_idx = np.argmax(spec_db)
    freq_offset = (peak_idx - 2048) * SAMPLE_RATE / 4096
    return {
        "name": sat["name"],
        "downlink_mhz": sat["downlink"] / 1e6,
        "power_db": round(float(power_db), 1),
        "snr_db": round(float(snr), 1),
        "freq_offset_hz": round(float(freq_offset), 1),
        "max_doppler_hz": round(float(max_dop), 0),
        "signal_detected": snr > 8,
    }

def main():
    print("=== Ham Satellite Commander ===")
    sdr = configure_sdr()
    results = []
    try:
        for sat in SATELLITES:
            print(f"\n[sat] Listening for {sat['name']} on {sat['downlink']/1e6:.3f} MHz...")
            result = listen_satellite(sdr, sat, LISTEN_TIME)
            results.append(result)
            status = "ACQUIRED" if result["signal_detected"] else "not heard"
            print(f"  {status} | SNR: {result['snr_db']:.1f} dB | "
                  f"Offset: {result['freq_offset_hz']:+.0f} Hz")
        heard = sum(1 for r in results if r["signal_detected"])
        print(f"\n[sat] Satellites heard: {heard}/{len(SATELLITES)}")
        with open("satellite_status.json", "w") as f:
            json.dump(results, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
