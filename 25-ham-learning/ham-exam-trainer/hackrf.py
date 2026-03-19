#!/usr/bin/env python3
"""
Ham Exam Trainer - Live Signal Identification
Captures real RF signals and presents them for identification practice.
Measures signal parameters and tests the user's ability to classify
modulation types, estimate bandwidth, and identify band usage.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json
import random

PRACTICE_FREQS = [
    {"freq": 98.5e6, "expected": "FM_broadcast", "band": "FM"},
    {"freq": 144.2e6, "expected": "SSB", "band": "2m"},
    {"freq": 144.39e6, "expected": "APRS_packet", "band": "2m"},
    {"freq": 146.52e6, "expected": "FM_simplex", "band": "2m"},
    {"freq": 433.92e6, "expected": "ISM_device", "band": "70cm"},
    {"freq": 462.5625e6, "expected": "FRS_FM", "band": "UHF"},
]
SAMPLE_RATE = 250e3
FFT_SIZE = 2048
GAIN = 40

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def capture_signal_sample(sdr, freq, duration=2):
    """Capture a sample signal for the student to identify."""
    sdr.center_freq = freq
    time.sleep(0.03)
    iq = sdr.read_samples(int(duration * SAMPLE_RATE))
    return iq

def measure_signal_params(iq, sample_rate, fft_size):
    """Measure observable signal parameters for the exercise."""
    window = signal.blackmanharris(fft_size)
    spec = np.fft.fftshift(np.fft.fft(iq[:fft_size] * window))
    psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
    noise = np.median(psd_db)
    peak = np.max(psd_db)
    # Bandwidth
    bw_mask = psd_db > (peak - 6)
    bw_hz = np.sum(bw_mask) * sample_rate / fft_size
    # Envelope analysis
    envelope = np.abs(iq[:fft_size * 4])
    env_variance = np.var(envelope) / (np.mean(envelope) ** 2 + 1e-12)
    return {
        "snr_db": round(float(peak - noise), 1),
        "bandwidth_hz": round(float(bw_hz), 0),
        "envelope_variance": round(float(env_variance), 4),
        "peak_power_db": round(float(peak), 1),
    }

def generate_quiz_question(freq_info, params):
    """Generate a practice question from measured signal parameters."""
    return {
        "frequency_mhz": freq_info["freq"] / 1e6,
        "band": freq_info["band"],
        "measured_bandwidth_hz": params["bandwidth_hz"],
        "measured_snr_db": params["snr_db"],
        "correct_answer": freq_info["expected"],
        "hints": [
            f"Bandwidth is approximately {params['bandwidth_hz']:.0f} Hz",
            f"Signal is in the {freq_info['band']} band",
            f"Envelope variance: {params['envelope_variance']:.4f}",
        ],
    }

def main():
    print("=== Ham Exam Trainer - Signal ID Practice ===")
    sdr = configure_sdr()
    quiz = []
    try:
        random.shuffle(PRACTICE_FREQS)
        for pf in PRACTICE_FREQS:
            print(f"\n[exam] Capturing signal at {pf['freq']/1e6:.3f} MHz...")
            iq = capture_signal_sample(sdr, pf["freq"])
            params = measure_signal_params(iq, SAMPLE_RATE, FFT_SIZE)
            question = generate_quiz_question(pf, params)
            quiz.append(question)
            print(f"  BW: {params['bandwidth_hz']:.0f} Hz | SNR: {params['snr_db']:.1f} dB")
            print(f"  Answer: {pf['expected']}")
        with open("exam_practice.json", "w") as f:
            json.dump(quiz, f, indent=2)
        print(f"\n[exam] Generated {len(quiz)} practice questions")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
