#!/usr/bin/env python3
"""
HackRF FM Pirate Radio Scanner
Scans FM broadcast band (87.5-108 MHz) to detect active stations,
measures signal strength, and identifies potential pirate radio transmissions
by checking against known licensed frequency allocations.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- Configuration ---
FM_BAND_START = 87.5e6    # FM band lower bound
FM_BAND_END = 108.0e6     # FM band upper bound
SCAN_STEP = 200e3         # 200 kHz channel spacing
SAMPLE_RATE = 2.4e6       # 2.4 MSPS
FFT_SIZE = 2048
GAIN = 38
SIGNAL_THRESHOLD = -30.0  # dBFS threshold for station detection
FM_DEVIATION = 75e3       # Standard FM broadcast deviation

# Known licensed stations (example placeholder list)
LICENSED_FREQS_MHZ = [88.1, 89.3, 91.5, 93.7, 95.1, 97.3, 99.5, 101.1, 103.5, 105.9]

def configure_sdr():
    """Initialize RTL-SDR for FM band scanning."""
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    sdr.freq_correction = 2
    return sdr

def measure_station_power(sdr, freq_hz):
    """Tune to a frequency and measure the signal power in dBFS."""
    sdr.center_freq = freq_hz
    time.sleep(0.02)  # Allow PLL to settle
    iq_samples = sdr.read_samples(FFT_SIZE * 8)
    # Compute power spectral density
    window = signal.hann(FFT_SIZE)
    num_segments = len(iq_samples) // FFT_SIZE
    power_sum = 0.0
    for i in range(min(num_segments, 4)):
        seg = iq_samples[i * FFT_SIZE : (i + 1) * FFT_SIZE]
        spectrum = np.fft.fft(seg * window, FFT_SIZE)
        power_sum += np.mean(np.abs(spectrum) ** 2)
    power_sum /= min(num_segments, 4)
    power_dbfs = 10.0 * np.log10(power_sum + 1e-12)
    return power_dbfs

def fm_demodulate(iq_samples, sample_rate):
    """Simple FM demodulation using phase differentiation."""
    # Compute instantaneous frequency via arg(z[n] * conj(z[n-1]))
    product = iq_samples[1:] * np.conj(iq_samples[:-1])
    instantaneous_freq = np.angle(product) / (2.0 * np.pi) * sample_rate
    return instantaneous_freq

def scan_fm_band(sdr):
    """Sweep the FM band and return list of detected stations."""
    detected_stations = []
    freqs = np.arange(FM_BAND_START, FM_BAND_END, SCAN_STEP)
    print(f"[scanner] Scanning {len(freqs)} channels from {FM_BAND_START/1e6:.1f} to {FM_BAND_END/1e6:.1f} MHz")

    for freq in freqs:
        power = measure_station_power(sdr, freq)
        if power > SIGNAL_THRESHOLD:
            freq_mhz = freq / 1e6
            is_licensed = any(abs(freq_mhz - lf) < 0.15 for lf in LICENSED_FREQS_MHZ)
            station_info = {
                "frequency_mhz": round(freq_mhz, 2),
                "power_dbfs": round(power, 1),
                "licensed": is_licensed,
                "status": "LICENSED" if is_licensed else "UNKNOWN/PIRATE"
            }
            detected_stations.append(station_info)
            marker = "  " if is_licensed else "!!"
            print(f"  {marker} {freq_mhz:6.1f} MHz | {power:6.1f} dBFS | {station_info['status']}")

    return detected_stations

def save_scan_results(stations, filename="fm_scan_results.json"):
    """Save detected stations to JSON."""
    with open(filename, "w") as f:
        json.dump({"scan_time": time.strftime("%Y-%m-%d %H:%M:%S"), "stations": stations}, f, indent=2)
    print(f"[scanner] Results saved to {filename}")

def main():
    """Main entry: scan FM band, detect pirate stations."""
    print("=== FM Pirate Radio Scanner ===")
    sdr = configure_sdr()
    try:
        stations = scan_fm_band(sdr)
        unlicensed = [s for s in stations if not s["licensed"]]
        print(f"\n[scanner] Total stations: {len(stations)} | Unlicensed/Unknown: {len(unlicensed)}")
        save_scan_results(stations)
    except KeyboardInterrupt:
        print("\n[scanner] Scan aborted.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
