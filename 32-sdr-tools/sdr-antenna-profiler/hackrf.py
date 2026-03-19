#!/usr/bin/env python3
"""SDR Antenna Profiler - Measures antenna gain/response across frequency range."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

TEST_FREQS = np.arange(50e6, 1700e6, 50e6)
SAMPLE_RATE = 2.4e6
FFT_SIZE = 4096
GAIN = 40
MEASUREMENTS = 10

def measure_at_freq(freq, gain, fft_size, num_meas):
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = freq
    sdr.gain = gain
    readings = []
    for _ in range(num_meas):
        iq = sdr.read_samples(fft_size)
        readings.append(10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12))
    sdr.close()
    return {"freq_mhz": round(freq / 1e6, 0), "mean_db": round(float(np.mean(readings)), 2),
            "std_db": round(float(np.std(readings)), 3)}

def main():
    print("=== SDR Antenna Profiler ===")
    results = []
    for freq in TEST_FREQS:
        r = measure_at_freq(freq, GAIN, FFT_SIZE, MEASUREMENTS)
        results.append(r)
        print(f"  {r['freq_mhz']:6.0f} MHz: {r['mean_db']:7.2f} dB (std: {r['std_db']:.3f})")
    # Find best frequency
    best = max(results, key=lambda x: x["mean_db"])
    print(f"\n[antenna] Best response: {best['freq_mhz']:.0f} MHz ({best['mean_db']:.1f} dB)")
    with open("antenna_profile.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    main()
