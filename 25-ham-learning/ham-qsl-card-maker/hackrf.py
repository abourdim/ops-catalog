#!/usr/bin/env python3
"""
Ham QSL Card Maker - Signal Report Collector
Captures signal data from received stations to generate accurate
QSL card signal reports. Measures RST (Readability, Strength, Tone)
from actual received signals.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

LISTEN_FREQ = 145.5e6     # FM simplex for QSO monitoring
SAMPLE_RATE = 250e3
AUDIO_RATE = 8000
GAIN = 40
QSO_TIMEOUT = 5           # Seconds of silence before QSO end

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = LISTEN_FREQ
    sdr.gain = GAIN
    return sdr

def measure_rst(iq_samples, sample_rate):
    """Estimate RST signal report from IQ data."""
    power_db = 10 * np.log10(np.mean(np.abs(iq_samples) ** 2) + 1e-12)
    # Strength (S-meter: S1-S9+)
    if power_db > -20:
        strength = 9
    elif power_db > -30:
        strength = 8
    elif power_db > -40:
        strength = 7
    elif power_db > -50:
        strength = 6
    elif power_db > -60:
        strength = 5
    else:
        strength = max(1, int((power_db + 80) / 5))
    # Tone (9 = perfect): check spectral purity
    fft_size = min(len(iq_samples), 2048)
    spec = np.abs(np.fft.fft(iq_samples[:fft_size]))
    peak = np.max(spec)
    spurious = np.sort(spec)[-5:-1]
    spur_ratio = np.mean(spurious) / (peak + 1e-12)
    tone = 9 if spur_ratio < 0.1 else 8 if spur_ratio < 0.2 else 7
    # Readability (5 = perfect): based on SNR
    noise_est = np.median(np.abs(iq_samples) ** 2)
    snr = power_db - 10 * np.log10(noise_est + 1e-12)
    readability = 5 if snr > 20 else 4 if snr > 10 else 3 if snr > 5 else 2
    return {"readability": readability, "strength": strength, "tone": tone,
            "rst": f"{readability}{strength}{tone}", "snr_db": round(float(snr), 1)}

def collect_qso_data(sdr, num_samples=50):
    """Collect signal quality data during a QSO."""
    reports = []
    for i in range(num_samples):
        iq = sdr.read_samples(int(0.5 * SAMPLE_RATE))
        rst = measure_rst(iq, SAMPLE_RATE)
        reports.append(rst)
        if i % 10 == 0:
            print(f"  Sample {i+1}: RST {rst['rst']} | SNR {rst['snr_db']:.1f} dB")
        time.sleep(0.3)
    # Average the reports
    avg_r = round(np.mean([r["readability"] for r in reports]))
    avg_s = round(np.mean([r["strength"] for r in reports]))
    avg_t = round(np.mean([r["tone"] for r in reports]))
    return {"avg_rst": f"{avg_r}{avg_s}{avg_t}", "samples": len(reports),
            "avg_snr": round(float(np.mean([r["snr_db"] for r in reports])), 1)}

def main():
    print("=== Ham QSL Card Maker - Signal Reports ===")
    sdr = configure_sdr()
    try:
        print(f"[qsl] Monitoring {LISTEN_FREQ/1e6:.3f} MHz for signal reports...")
        result = collect_qso_data(sdr, num_samples=20)
        print(f"\n[qsl] Average RST: {result['avg_rst']} | SNR: {result['avg_snr']:.1f} dB")
        with open("qsl_report.json", "w") as f:
            json.dump({"freq_mhz": LISTEN_FREQ / 1e6, "report": result,
                        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S")}, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
