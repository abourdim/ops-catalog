#!/usr/bin/env python3
"""
SDR Filter Forge
Designs and tests digital filters in real-time on SDR signals.
Creates FIR/IIR filters with various window functions and measures
their performance on live RF data.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

CENTER_FREQ = 144.39e6
SAMPLE_RATE = 2.4e6
FFT_SIZE = 2048
GAIN = 40

FILTER_CONFIGS = [
    {"name": "LP_hamming_64", "type": "fir", "taps": 64, "cutoff": 0.2, "window": "hamming"},
    {"name": "LP_blackman_128", "type": "fir", "taps": 128, "cutoff": 0.1, "window": "blackman"},
    {"name": "BP_kaiser_256", "type": "fir", "taps": 256, "cutoff": [0.15, 0.35], "window": ("kaiser", 8)},
    {"name": "IIR_butter_6", "type": "iir", "order": 6, "cutoff": 0.2},
    {"name": "IIR_cheby1_4", "type": "iir_cheby", "order": 4, "cutoff": 0.2, "ripple": 1},
]

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def design_and_apply(iq, config, sample_rate):
    if config["type"] == "fir":
        taps = signal.firwin(config["taps"], config["cutoff"], window=config["window"], pass_zero='bandpass' if isinstance(config["cutoff"], list) else True)
        filtered = signal.fftconvolve(iq, taps, mode='same')
        w, h = signal.freqz(taps, worN=1024)
    elif config["type"] == "iir":
        b, a = signal.butter(config["order"], config["cutoff"])
        filtered = signal.filtfilt(b, a, np.real(iq)) + 1j * signal.filtfilt(b, a, np.imag(iq))
        w, h = signal.freqz(b, a, worN=1024)
    else:
        b, a = signal.cheby1(config["order"], config["ripple"], config["cutoff"])
        filtered = signal.filtfilt(b, a, np.real(iq)) + 1j * signal.filtfilt(b, a, np.imag(iq))
        w, h = signal.freqz(b, a, worN=1024)
    # Measure filter performance
    h_db = 20 * np.log10(np.abs(h) + 1e-12)
    passband_ripple = float(np.max(h_db[:len(h_db)//4]) - np.min(h_db[:len(h_db)//4]))
    stopband_atten = float(-np.min(h_db[len(h_db)//2:]))
    return filtered, {
        "passband_ripple_db": round(passband_ripple, 2),
        "stopband_atten_db": round(stopband_atten, 1),
        "group_delay_samples": round(float(np.mean(-np.diff(np.unwrap(np.angle(h))))), 1),
    }

def main():
    print("=== SDR Filter Forge ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(FFT_SIZE * 8)
        results = []
        for cfg in FILTER_CONFIGS:
            filtered, metrics = design_and_apply(iq, cfg, SAMPLE_RATE)
            print(f"  {cfg['name']:25s} | Ripple: {metrics['passband_ripple_db']:.2f} dB | "
                  f"Stopband: {metrics['stopband_atten_db']:.1f} dB")
            results.append({"name": cfg["name"], **metrics})
        with open("filter_forge_results.json", "w") as f:
            json.dump(results, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
