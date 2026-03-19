#!/usr/bin/env python3
"""
HackRF ISM Band Explorer
Scans Industrial, Scientific, and Medical (ISM) bands to catalog active
devices. Monitors 315 MHz, 433 MHz, 868 MHz, 915 MHz, and 2.4 GHz bands
for IoT devices, weather stations, remotes, and other ISM transmitters.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- ISM Band Definitions ---
ISM_BANDS = {
    "315MHz": {"center": 315e6, "bw": 2e6, "desc": "Garage doors, keyfobs (US)"},
    "433MHz": {"center": 433.92e6, "bw": 2e6, "desc": "Weather stations, remotes (EU)"},
    "868MHz": {"center": 868e6, "bw": 2e6, "desc": "LoRa, smart meters (EU)"},
    "915MHz": {"center": 915e6, "bw": 26e6, "desc": "LoRa, ISM (US)"},
}

SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40
DWELL_TIME = 2.0    # Seconds per band
BURST_THRESHOLD = 6  # dB above noise floor

def configure_sdr():
    """Initialize RTL-SDR for ISM band scanning."""
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def scan_ism_band(sdr, center_freq, dwell_time, fft_size):
    """Monitor a single ISM band for the dwell period, detecting bursts."""
    sdr.center_freq = center_freq
    time.sleep(0.05)
    total_samples = int(dwell_time * SAMPLE_RATE)
    chunk_size = fft_size * 4
    bursts = []
    noise_floor_samples = []

    samples_read = 0
    while samples_read < total_samples:
        iq = sdr.read_samples(chunk_size)
        samples_read += len(iq)
        # Compute power spectrum
        window = signal.hann(fft_size)
        for i in range(len(iq) // fft_size):
            seg = iq[i * fft_size:(i + 1) * fft_size]
            spec = np.fft.fftshift(np.fft.fft(seg * window))
            psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
            nf = np.median(psd_db)
            noise_floor_samples.append(nf)
            # Detect burst: peak power above noise
            peak_db = np.max(psd_db)
            if peak_db - nf > BURST_THRESHOLD:
                peak_idx = np.argmax(psd_db)
                freq_offset = (peak_idx - fft_size / 2) / fft_size * SAMPLE_RATE
                bursts.append({
                    "freq_hz": center_freq + freq_offset,
                    "power_db": round(float(peak_db), 1),
                    "snr_db": round(float(peak_db - nf), 1),
                    "timestamp": round(samples_read / SAMPLE_RATE, 4),
                })

    avg_noise = np.mean(noise_floor_samples) if noise_floor_samples else -100
    return bursts, round(float(avg_noise), 1)

def classify_ism_device(freq_hz, burst_rate, avg_duration):
    """Attempt to classify device type based on frequency and burst pattern."""
    freq_mhz = freq_hz / 1e6
    if 314 < freq_mhz < 316:
        return "keyfob/garage" if burst_rate < 5 else "sensor"
    elif 433 < freq_mhz < 435:
        if burst_rate > 10:
            return "weather_station"
        return "remote_control"
    elif 867 < freq_mhz < 870:
        return "lorawan/smart_meter"
    elif 902 < freq_mhz < 928:
        return "lorawan_us/ism"
    return "unknown_ism"

def main():
    print("=== HackRF ISM Band Explorer ===")
    sdr = configure_sdr()
    all_results = {}
    try:
        for band_name, band_info in ISM_BANDS.items():
            print(f"\n[ism] Scanning {band_name}: {band_info['desc']}")
            bursts, noise_floor = scan_ism_band(sdr, band_info["center"], DWELL_TIME, FFT_SIZE)
            print(f"  Noise floor: {noise_floor} dB | Bursts detected: {len(bursts)}")
            for b in bursts[:10]:
                print(f"    {b['freq_hz']/1e6:.4f} MHz | {b['power_db']:.1f} dB | SNR {b['snr_db']:.1f} dB")
            all_results[band_name] = {"bursts": len(bursts), "noise_floor": noise_floor}

        total = sum(r["bursts"] for r in all_results.values())
        print(f"\n[ism] Total bursts across all bands: {total}")
        with open("ism_scan_results.json", "w") as f:
            json.dump(all_results, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
