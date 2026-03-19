#!/usr/bin/env python3
"""SDR Solar Flare Detector - Monitors solar radio emissions for flare activity."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

SOLAR_FREQ = 150e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 4096
GAIN = 30
MONITOR_INTERVAL = 10

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = SOLAR_FREQ
    sdr.gain = GAIN
    return sdr

def measure_solar_flux(sdr, fft_size):
    iq = sdr.read_samples(fft_size * 8)
    window = signal.blackmanharris(fft_size)
    psd = np.zeros(fft_size)
    for i in range(8):
        seg = iq[i * fft_size:(i + 1) * fft_size]
        psd += np.abs(np.fft.fft(seg * window)) ** 2
    total_power = 10 * np.log10(np.sum(psd / 8) + 1e-12)
    return float(total_power)

def main():
    print("=== SDR Solar Flare Detector ===")
    sdr = configure_sdr()
    baseline_readings = []
    try:
        print("[solar] Establishing baseline (30s)...")
        for _ in range(3):
            baseline_readings.append(measure_solar_flux(sdr, FFT_SIZE))
            time.sleep(MONITOR_INTERVAL)
        baseline = np.mean(baseline_readings)
        print(f"[solar] Baseline flux: {baseline:.1f} dB")
        for i in range(20):
            flux = measure_solar_flux(sdr, FFT_SIZE)
            delta = flux - baseline
            status = "FLARE!" if delta > 3 else "normal"
            print(f"  [{time.strftime('%H:%M:%S')}] Flux: {flux:.1f} dB (delta: {delta:+.1f}) {status}")
            time.sleep(MONITOR_INTERVAL)
    except KeyboardInterrupt:
        print("\n[solar] Monitoring stopped.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
