#!/usr/bin/env python3
"""
Ham Radio Observatory
Long-duration automated radio monitoring station. Performs continuous
spectrum surveillance, logs all detected signals, tracks band activity
patterns, and generates daily observation reports.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

OBSERVATORY_BANDS = [
    {"name": "2m_weak", "freq": 144.2e6}, {"name": "2m_fm", "freq": 146.52e6},
    {"name": "2m_aprs", "freq": 144.39e6}, {"name": "70cm_fm", "freq": 446.0e6},
    {"name": "70cm_digital", "freq": 432.1e6},
]
SAMPLE_RATE = 250e3
FFT_SIZE = 4096
GAIN = 40
OBSERVATION_INTERVAL = 30

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def observe_frequency(sdr, freq, fft_size):
    sdr.center_freq = freq
    time.sleep(0.02)
    iq = sdr.read_samples(fft_size * 4)
    window = signal.blackmanharris(fft_size)
    psd = np.zeros(fft_size)
    for i in range(min(4, len(iq) // fft_size)):
        seg = iq[i * fft_size:(i + 1) * fft_size]
        psd += np.abs(np.fft.fftshift(np.fft.fft(seg * window))) ** 2
    psd_db = 10 * np.log10(psd / 4 + 1e-12)
    noise = np.median(psd_db)
    peak = np.max(psd_db)
    snr = peak - noise
    peaks, _ = signal.find_peaks(psd_db, height=noise + 8)
    return {
        "snr_db": round(float(snr), 1), "noise_db": round(float(noise), 1),
        "peak_db": round(float(peak), 1), "num_signals": len(peaks),
        "active": snr > 10,
    }

def main():
    print("=== Ham Radio Observatory ===")
    sdr = configure_sdr()
    observations = []
    try:
        for cycle in range(20):
            timestamp = time.strftime("%Y-%m-%dT%H:%M:%S")
            obs = {"time": timestamp, "bands": {}}
            for band in OBSERVATORY_BANDS:
                result = observe_frequency(sdr, band["freq"], FFT_SIZE)
                obs["bands"][band["name"]] = result
            observations.append(obs)
            active_count = sum(1 for b in obs["bands"].values() if b["active"])
            print(f"[obs] {timestamp} | Active: {active_count}/{len(OBSERVATORY_BANDS)}")
            time.sleep(OBSERVATION_INTERVAL)
        with open("observatory_log.json", "w") as f:
            json.dump(observations, f, indent=2)
        print(f"\n[obs] {len(observations)} observations logged")
    except KeyboardInterrupt:
        print("\n[obs] Observatory stopped.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
