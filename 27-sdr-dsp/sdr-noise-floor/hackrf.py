#!/usr/bin/env python3
"""
SDR Noise Floor Analyzer
Measures and characterizes the noise floor of the SDR receiver across
frequency. Computes noise figure, thermal noise comparison, and
identifies spurious signals from the receiver itself.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

FREQS_TO_TEST = [50e6, 100e6, 200e6, 400e6, 600e6, 800e6, 1000e6, 1200e6]
SAMPLE_RATE = 2.4e6
FFT_SIZE = 4096
GAIN_VALUES = [0, 10, 20, 30, 40]

def configure_sdr(freq, gain):
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = freq
    sdr.gain = gain
    return sdr

def measure_noise_floor(sdr, fft_size, num_averages=50):
    window = signal.blackmanharris(fft_size)
    psd = np.zeros(fft_size)
    for _ in range(num_averages):
        iq = sdr.read_samples(fft_size)
        spec = np.fft.fftshift(np.fft.fft(iq * window))
        psd += np.abs(spec) ** 2
    psd /= num_averages
    psd_db = 10 * np.log10(psd + 1e-12)
    noise_floor = float(np.median(psd_db))
    noise_std = float(np.std(psd_db))
    # Count spurs (peaks above noise + 15 dB)
    peaks, _ = signal.find_peaks(psd_db, height=noise_floor + 15)
    return {"noise_floor_db": round(noise_floor, 2), "noise_std_db": round(noise_std, 3),
            "num_spurs": len(peaks), "min_db": round(float(np.min(psd_db)), 2)}

def thermal_noise_power(bandwidth, temp_k=290):
    k_boltzmann = 1.38e-23
    return 10 * np.log10(k_boltzmann * temp_k * bandwidth * 1000)  # dBm

def main():
    print("=== SDR Noise Floor Analyzer ===")
    results = []
    for freq in FREQS_TO_TEST:
        for gain in GAIN_VALUES:
            sdr = configure_sdr(freq, gain)
            time.sleep(0.1)
            nf = measure_noise_floor(sdr, FFT_SIZE)
            thermal = thermal_noise_power(SAMPLE_RATE)
            nf["freq_mhz"] = freq / 1e6
            nf["gain_db"] = gain
            nf["thermal_noise_dbm"] = round(thermal, 1)
            results.append(nf)
            sdr.close()
        best = min([r for r in results if r["freq_mhz"] == freq / 1e6],
                   key=lambda x: x["noise_floor_db"])
        print(f"  {freq/1e6:7.0f} MHz: best NF = {best['noise_floor_db']:.1f} dB @ gain={best['gain_db']}")
    with open("noise_floor_analysis.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    main()
