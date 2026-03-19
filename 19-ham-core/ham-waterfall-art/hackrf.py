#!/usr/bin/env python3
"""
Ham Waterfall Art
Generates waterfall display data from SDR captures, optimized for
visual representation. Applies color mapping, dynamic range compression,
and exports waterfall images as raw pixel data.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import struct

# --- Configuration ---
CENTER_FREQ = 144.39e6    # APRS frequency for interesting activity
SAMPLE_RATE = 1.0e6
FFT_SIZE = 512
GAIN = 40
WATERFALL_ROWS = 400
DYNAMIC_RANGE_DB = 60      # Color map range

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def compute_spectrum_row(iq_samples, fft_size):
    """Compute one waterfall row from IQ samples."""
    window = signal.blackmanharris(fft_size)
    spec = np.fft.fftshift(np.fft.fft(iq_samples[:fft_size] * window))
    psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
    return psd_db

def apply_color_map(value_normalized):
    """Map 0-1 value to RGB color (blue-cyan-green-yellow-red)."""
    v = max(0.0, min(1.0, value_normalized))
    if v < 0.25:
        r, g, b = 0, int(v * 4 * 255), 255
    elif v < 0.5:
        r, g, b = 0, 255, int((0.5 - v) * 4 * 255)
    elif v < 0.75:
        r, g, b = int((v - 0.5) * 4 * 255), 255, 0
    else:
        r, g, b = 255, int((1.0 - v) * 4 * 255), 0
    return (r, g, b)

def build_waterfall_image(sdr, fft_size, num_rows, dynamic_range):
    """Capture waterfall and generate RGB pixel data."""
    waterfall = np.zeros((num_rows, fft_size), dtype=np.float32)
    print(f"[art] Building {num_rows}x{fft_size} waterfall at {CENTER_FREQ/1e6:.3f} MHz")

    for row in range(num_rows):
        iq = sdr.read_samples(fft_size * 2)
        psd_db = compute_spectrum_row(iq, fft_size)
        waterfall[row, :] = psd_db
        if row % 100 == 0:
            print(f"  Row {row}/{num_rows}")

    # Normalize to dynamic range
    max_db = np.max(waterfall)
    min_db = max_db - dynamic_range
    normalized = (waterfall - min_db) / dynamic_range
    normalized = np.clip(normalized, 0, 1)

    # Generate RGB pixel data
    rgb_data = bytearray()
    for row in range(num_rows):
        for col in range(fft_size):
            r, g, b = apply_color_map(normalized[row, col])
            rgb_data.extend([r, g, b])

    return waterfall, normalized, rgb_data

def save_waterfall(waterfall, rgb_data, fft_size, num_rows):
    """Save waterfall data and RGB image."""
    np.save("waterfall_art_data.npy", waterfall)
    with open("waterfall_art.rgb", "wb") as f:
        f.write(struct.pack("II", fft_size, num_rows))
        f.write(bytes(rgb_data))
    print(f"[art] Saved waterfall_art_data.npy and waterfall_art.rgb")
    print(f"[art] Image: {fft_size}x{num_rows} pixels, {len(rgb_data)} bytes RGB")

def main():
    print("=== Ham Waterfall Art ===")
    sdr = configure_sdr()
    try:
        waterfall, norm, rgb = build_waterfall_image(sdr, FFT_SIZE, WATERFALL_ROWS, DYNAMIC_RANGE_DB)
        save_waterfall(waterfall, rgb, FFT_SIZE, WATERFALL_ROWS)
        print(f"[art] Dynamic range: {np.min(waterfall):.1f} to {np.max(waterfall):.1f} dB")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
