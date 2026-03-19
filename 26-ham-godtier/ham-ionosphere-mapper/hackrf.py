#!/usr/bin/env python3
"""
Ham Ionosphere Mapper
Maps ionospheric conditions using VHF beacon monitoring and signal
propagation analysis. Tracks MUF (Maximum Usable Frequency) indicators
by monitoring beacons from distant locations.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

BEACON_FREQS = [
    {"name": "50MHz_beacon", "freq": 50.06e6, "expected_range_km": 500},
    {"name": "70MHz_beacon", "freq": 70.03e6, "expected_range_km": 300},
    {"name": "144MHz_beacon", "freq": 144.285e6, "expected_range_km": 100},
]
SAMPLE_RATE = 250e3
FFT_SIZE = 16384
GAIN = 49
OBSERVATION_HOURS = 1
SAMPLE_INTERVAL = 60

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def measure_beacon_strength(sdr, freq, fft_size):
    sdr.center_freq = freq
    time.sleep(0.05)
    iq = sdr.read_samples(fft_size * 4)
    window = signal.blackmanharris(fft_size)
    psd = np.zeros(fft_size)
    for i in range(min(4, len(iq) // fft_size)):
        seg = iq[i * fft_size:(i + 1) * fft_size]
        psd += np.abs(np.fft.fftshift(np.fft.fft(seg * window))) ** 2
    psd_db = 10 * np.log10(psd / 4 + 1e-12)
    noise = np.median(psd_db)
    peak = np.max(psd_db)
    return {"snr_db": round(float(peak - noise), 1), "peak_db": round(float(peak), 1),
            "detected": (peak - noise) > 5}

def estimate_muf(beacon_results):
    """Estimate MUF from which beacons are heard."""
    highest_detected = 0
    for r in beacon_results:
        if r["detected"]:
            highest_detected = max(highest_detected, r["freq_mhz"])
    if highest_detected > 0:
        muf_estimate = highest_detected * 1.5  # Rough MUF estimate
        return round(muf_estimate, 1)
    return 0

def main():
    print("=== Ham Ionosphere Mapper ===")
    sdr = configure_sdr()
    timeline = []
    num_samples = int(OBSERVATION_HOURS * 3600 / SAMPLE_INTERVAL)
    try:
        for i in range(min(num_samples, 30)):
            results = []
            for beacon in BEACON_FREQS:
                r = measure_beacon_strength(sdr, beacon["freq"], FFT_SIZE)
                r["name"] = beacon["name"]
                r["freq_mhz"] = beacon["freq"] / 1e6
                results.append(r)
                status = "HEARD" if r["detected"] else "---"
                print(f"  {beacon['name']:15s} SNR: {r['snr_db']:5.1f} dB | {status}")
            muf = estimate_muf(results)
            entry = {"time": time.strftime("%H:%M:%S"), "beacons": results, "est_muf_mhz": muf}
            timeline.append(entry)
            print(f"  [{entry['time']}] Est. MUF: {muf:.1f} MHz\n")
            time.sleep(SAMPLE_INTERVAL)
        with open("ionosphere_map.json", "w") as f:
            json.dump(timeline, f, indent=2)
    except KeyboardInterrupt:
        print("\n[iono] Observation stopped.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
