#!/usr/bin/env python3
"""SDR Industrial IoT Monitor - Scans industrial ISM frequencies for SCADA/telemetry."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

INDUSTRIAL_FREQS = [
    {"name": "ISM_433", "freq": 433.92e6}, {"name": "ISM_868", "freq": 868e6},
    {"name": "ISM_915", "freq": 915e6}, {"name": "SCADA_450", "freq": 450e6},
]
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40
MONITOR_SEC = 10

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def monitor_industrial_band(sdr, freq, duration_sec):
    sdr.center_freq = freq
    time.sleep(0.03)
    iq = sdr.read_samples(int(duration_sec * SAMPLE_RATE))
    power_db = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
    window = signal.hann(FFT_SIZE)
    spec = np.abs(np.fft.fftshift(np.fft.fft(iq[:FFT_SIZE] * window)))
    spec_db = 10 * np.log10(spec ** 2 + 1e-12)
    noise = np.median(spec_db)
    peaks, _ = signal.find_peaks(spec_db, height=noise + 10)
    return {"power_db": round(float(power_db), 1), "active_signals": len(peaks),
            "noise_floor_db": round(float(noise), 1)}

def main():
    print("=== SDR Industrial IoT Monitor ===")
    sdr = configure_sdr()
    try:
        for band in INDUSTRIAL_FREQS:
            r = monitor_industrial_band(sdr, band["freq"], MONITOR_SEC)
            print(f"  {band['name']:12s} {band['freq']/1e6:.2f} MHz: "
                  f"{r['active_signals']} signals, NF={r['noise_floor_db']:.1f} dB")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
