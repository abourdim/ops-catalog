#!/usr/bin/env python3
"""
HackRF RF Waterfall Display
Real-time spectrum waterfall visualization using RTL-SDR/HackRF One.
Captures wideband IQ samples and renders a scrolling frequency-time heatmap.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import struct
import sys

# --- Configuration ---
CENTER_FREQ = 100e6      # 100 MHz (FM broadcast band)
SAMPLE_RATE = 2.4e6      # 2.4 MSPS
FFT_SIZE = 1024           # FFT bins for frequency resolution
GAIN = 40                 # RF gain in dB
WATERFALL_ROWS = 200      # Number of time rows in waterfall buffer
NUM_FRAMES = 500          # Number of frames to capture

def configure_sdr():
    """Initialize and configure the RTL-SDR device."""
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    sdr.freq_correction = 1  # PPM correction
    return sdr

def compute_power_spectrum(iq_samples, fft_size):
    """Compute power spectral density from IQ samples using Welch's method."""
    # Apply Blackman-Harris window for better sidelobe suppression
    window = signal.blackmanharris(fft_size)
    num_segments = len(iq_samples) // fft_size

    if num_segments == 0:
        return np.zeros(fft_size)

    psd_accumulator = np.zeros(fft_size)
    for i in range(num_segments):
        segment = iq_samples[i * fft_size : (i + 1) * fft_size]
        windowed = segment * window
        spectrum = np.fft.fftshift(np.fft.fft(windowed, fft_size))
        psd_accumulator += np.abs(spectrum) ** 2

    psd_accumulator /= num_segments
    # Convert to dB scale
    psd_db = 10.0 * np.log10(psd_accumulator + 1e-12)
    return psd_db

def build_waterfall(sdr, fft_size, num_rows, num_frames):
    """Capture IQ data and build waterfall matrix row by row."""
    waterfall = np.full((num_rows, fft_size), -100.0, dtype=np.float32)
    freq_axis = np.linspace(
        (CENTER_FREQ - SAMPLE_RATE / 2) / 1e6,
        (CENTER_FREQ + SAMPLE_RATE / 2) / 1e6,
        fft_size
    )
    row_index = 0
    print(f"[waterfall] Capturing {num_frames} frames, FFT size={fft_size}")
    print(f"[waterfall] Frequency range: {freq_axis[0]:.2f} - {freq_axis[-1]:.2f} MHz")

    for frame in range(num_frames):
        iq_samples = sdr.read_samples(fft_size * 4)
        psd_db = compute_power_spectrum(iq_samples, fft_size)
        waterfall[row_index % num_rows, :] = psd_db
        row_index += 1

        if frame % 50 == 0:
            peak_freq_idx = np.argmax(psd_db)
            peak_freq = freq_axis[peak_freq_idx]
            peak_power = psd_db[peak_freq_idx]
            print(f"  Frame {frame:4d} | Peak: {peak_freq:.3f} MHz @ {peak_power:.1f} dB")

    return waterfall, freq_axis

def save_waterfall_raw(waterfall, filename="waterfall_data.raw"):
    """Save waterfall matrix to a binary file for offline analysis."""
    rows, cols = waterfall.shape
    with open(filename, "wb") as f:
        f.write(struct.pack("II", rows, cols))
        waterfall.tofile(f)
    print(f"[waterfall] Saved {rows}x{cols} waterfall to {filename}")

def main():
    """Main entry point: configure SDR, capture waterfall, save results."""
    print("=== HackRF RF Waterfall Display ===")
    print(f"Center: {CENTER_FREQ/1e6:.1f} MHz | Rate: {SAMPLE_RATE/1e6:.1f} MSPS | Gain: {GAIN} dB")

    sdr = configure_sdr()
    try:
        waterfall, freq_axis = build_waterfall(sdr, FFT_SIZE, WATERFALL_ROWS, NUM_FRAMES)
        save_waterfall_raw(waterfall)
        # Print summary statistics
        print(f"\n[waterfall] Dynamic range: {waterfall.max():.1f} dB to {waterfall.min():.1f} dB")
        print(f"[waterfall] Mean noise floor: {np.median(waterfall):.1f} dB")
    except KeyboardInterrupt:
        print("\n[waterfall] Capture interrupted by user.")
    finally:
        sdr.close()
        print("[waterfall] SDR device closed.")

if __name__ == "__main__":
    main()
