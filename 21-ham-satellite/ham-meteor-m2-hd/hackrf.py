#!/usr/bin/env python3
"""
Ham Meteor-M2 HD Receiver
Receives LRPT (Low Rate Picture Transmission) from Russian Meteor-M2
weather satellite at 137.9 MHz. LRPT uses QPSK modulation at 72k symbols/sec.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

METEOR_FREQ = 137.9e6
SAMPLE_RATE = 1.024e6
GAIN = 49.6
SYMBOL_RATE = 72000
CAPTURE_SECONDS = 120

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = METEOR_FREQ
    sdr.gain = GAIN
    return sdr

def matched_filter(iq, sample_rate, symbol_rate):
    """Apply root-raised-cosine matched filter for QPSK."""
    sps = int(sample_rate / symbol_rate)
    alpha = 0.6  # Roll-off factor
    num_taps = sps * 8 + 1
    t = np.arange(num_taps) / sample_rate - (num_taps - 1) / (2 * sample_rate)
    T = 1.0 / symbol_rate
    h = np.zeros(num_taps)
    for i, ti in enumerate(t):
        if ti == 0:
            h[i] = 1 / T * (1 + alpha * (4 / np.pi - 1))
        elif abs(ti) == T / (4 * alpha + 1e-12):
            h[i] = alpha / (T * np.sqrt(2)) * ((1 + 2 / np.pi) * np.sin(np.pi / (4 * alpha)) +
                     (1 - 2 / np.pi) * np.cos(np.pi / (4 * alpha)))
        else:
            num = np.sin(np.pi * ti / T * (1 - alpha)) + 4 * alpha * ti / T * np.cos(np.pi * ti / T * (1 + alpha))
            den = np.pi * ti / T * (1 - (4 * alpha * ti / T) ** 2)
            h[i] = num / (den + 1e-12) / T
    h /= np.sqrt(np.sum(h ** 2))
    return signal.fftconvolve(iq, h, mode='same')

def costas_loop(iq, sample_rate, symbol_rate):
    """Costas loop for QPSK carrier recovery."""
    sps = int(sample_rate / symbol_rate)
    phase = 0
    freq = 0
    alpha_loop = 0.005
    beta_loop = alpha_loop ** 2 / 4
    output = np.zeros(len(iq), dtype=np.complex64)
    for i in range(len(iq)):
        output[i] = iq[i] * np.exp(-1j * phase)
        # QPSK phase error
        error = np.sign(np.real(output[i])) * np.imag(output[i]) - \
                np.sign(np.imag(output[i])) * np.real(output[i])
        freq += beta_loop * error
        phase += freq + alpha_loop * error
    return output

def extract_symbols(iq_filtered, sample_rate, symbol_rate):
    """Sample at symbol rate to extract QPSK symbols."""
    sps = sample_rate / symbol_rate
    indices = np.arange(0, len(iq_filtered), sps).astype(int)
    indices = indices[indices < len(iq_filtered)]
    return iq_filtered[indices]

def main():
    print("=== Ham Meteor-M2 HD Receiver ===")
    sdr = configure_sdr()
    try:
        print(f"[meteor] Capturing {CAPTURE_SECONDS}s at {METEOR_FREQ/1e6:.1f} MHz...")
        iq = sdr.read_samples(int(CAPTURE_SECONDS * SAMPLE_RATE))
        print(f"[meteor] Applying matched filter (symbol rate: {SYMBOL_RATE} sym/s)...")
        filtered = matched_filter(iq[:SAMPLE_RATE * 5], SAMPLE_RATE, SYMBOL_RATE)
        print("[meteor] Running Costas carrier recovery...")
        recovered = costas_loop(filtered[:SAMPLE_RATE * 2], SAMPLE_RATE, SYMBOL_RATE)
        symbols = extract_symbols(recovered, SAMPLE_RATE, SYMBOL_RATE)
        print(f"[meteor] Extracted {len(symbols)} QPSK symbols")
        # Save IQ for external decoder
        iq[:SAMPLE_RATE * 10].astype(np.complex64).tofile("meteor_m2_capture.iq")
        print("[meteor] Saved meteor_m2_capture.iq for LRPT decoder")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
