#!/usr/bin/env python3
"""SDR Spectrum Observatory - 24/7 automated wideband spectrum monitoring station."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json, os

SCAN_START = 50e6
SCAN_END = 1700e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40
SCAN_INTERVAL = 300  # 5 minutes between full sweeps
OUTPUT_DIR = "observatory_data"

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def full_sweep(sdr, start, end, fft_size):
    window = signal.hann(fft_size)
    sweep = []
    freq = start + SAMPLE_RATE / 2
    while freq < end:
        sdr.center_freq = freq
        time.sleep(0.005)
        iq = sdr.read_samples(fft_size)
        spec = np.fft.fftshift(np.fft.fft(iq * window))
        psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
        sweep.append({"freq_mhz": round(freq / 1e6, 0), "peak_db": round(float(np.max(psd_db)), 1),
                      "median_db": round(float(np.median(psd_db)), 1)})
        freq += SAMPLE_RATE * 0.75
    return sweep

def detect_anomalies(current, previous):
    anomalies = []
    if previous is None:
        return anomalies
    for c, p in zip(current, previous):
        if c["freq_mhz"] == p["freq_mhz"]:
            delta = c["peak_db"] - p["peak_db"]
            if abs(delta) > 10:
                anomalies.append({"freq_mhz": c["freq_mhz"], "delta_db": round(delta, 1)})
    return anomalies

def main():
    print("=== SDR Spectrum Observatory ===")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    sdr = configure_sdr()
    previous = None
    try:
        for sweep_num in range(5):
            timestamp = time.strftime("%Y%m%dT%H%M%S")
            print(f"\n[obs] Sweep #{sweep_num + 1} at {timestamp}")
            current = full_sweep(sdr, SCAN_START, SCAN_END, FFT_SIZE)
            anomalies = detect_anomalies(current, previous)
            if anomalies:
                print(f"  ANOMALIES: {len(anomalies)}")
                for a in anomalies[:5]:
                    print(f"    {a['freq_mhz']:.0f} MHz: {a['delta_db']:+.1f} dB")
            else:
                print(f"  {len(current)} segments scanned, no anomalies")
            previous = current
            time.sleep(30)
    except KeyboardInterrupt:
        print("\n[obs] Observatory stopped.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
