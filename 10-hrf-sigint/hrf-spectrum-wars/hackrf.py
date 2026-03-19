#!/usr/bin/env python3
"""
HackRF Spectrum Wars
Monitors a frequency range for spectrum occupancy, tracking channel usage
over time. Detects interference events, spectrum congestion, and provides
real-time occupancy statistics per channel.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- Configuration ---
BAND_START = 430e6        # UHF band start
BAND_END = 440e6          # UHF band end
CHANNEL_BW = 25e3         # 25 kHz channel bandwidth
SAMPLE_RATE = 2.4e6
FFT_SIZE = 4096
GAIN = 40
SCAN_ROUNDS = 50          # Number of full band scans
OCCUPANCY_THRESHOLD = -50  # dBFS threshold for "occupied"

def configure_sdr():
    """Initialize RTL-SDR for spectrum monitoring."""
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def measure_channel_power(psd_db, freq_axis, channel_center, channel_bw):
    """Measure average power within a channel bandwidth."""
    mask = (freq_axis >= channel_center - channel_bw / 2) & \
           (freq_axis <= channel_center + channel_bw / 2)
    if np.sum(mask) == 0:
        return -100.0
    return float(np.mean(psd_db[mask]))

def scan_band_segment(sdr, center_freq, fft_size):
    """Capture and compute PSD for one tuning step."""
    sdr.center_freq = center_freq
    time.sleep(0.015)
    iq = sdr.read_samples(fft_size * 4)
    window = signal.blackmanharris(fft_size)
    segments = len(iq) // fft_size
    psd = np.zeros(fft_size)
    for i in range(segments):
        seg = iq[i * fft_size:(i + 1) * fft_size]
        spec = np.fft.fftshift(np.fft.fft(seg * window))
        psd += np.abs(spec) ** 2
    psd /= segments
    psd_db = 10.0 * np.log10(psd + 1e-12)
    freq_axis = np.linspace(center_freq - SAMPLE_RATE / 2,
                            center_freq + SAMPLE_RATE / 2, fft_size)
    return psd_db, freq_axis

def run_spectrum_wars(sdr, num_rounds):
    """Execute spectrum monitoring and occupancy tracking."""
    num_channels = int((BAND_END - BAND_START) / CHANNEL_BW)
    channel_freqs = np.arange(BAND_START + CHANNEL_BW / 2, BAND_END, CHANNEL_BW)
    occupancy_count = np.zeros(num_channels, dtype=int)
    max_power = np.full(num_channels, -120.0)
    print(f"[wars] Monitoring {num_channels} channels over {num_rounds} rounds")

    for rnd in range(num_rounds):
        freq = BAND_START + SAMPLE_RATE / 2
        while freq < BAND_END:
            psd_db, freq_axis = scan_band_segment(sdr, freq, FFT_SIZE)
            for ch_idx, ch_freq in enumerate(channel_freqs):
                if abs(ch_freq - freq) < SAMPLE_RATE / 2:
                    power = measure_channel_power(psd_db, freq_axis, ch_freq, CHANNEL_BW)
                    if power > OCCUPANCY_THRESHOLD:
                        occupancy_count[ch_idx] += 1
                    if power > max_power[ch_idx]:
                        max_power[ch_idx] = power
            freq += SAMPLE_RATE * 0.8  # Overlap steps slightly

        if rnd % 10 == 0:
            active = np.sum(occupancy_count > rnd * 0.3)
            print(f"  Round {rnd+1}/{num_rounds} | Active channels: {active}/{num_channels}")

    # Compute occupancy percentage
    occupancy_pct = (occupancy_count / num_rounds) * 100.0
    return channel_freqs, occupancy_pct, max_power

def main():
    print("=== HackRF Spectrum Wars ===")
    sdr = configure_sdr()
    try:
        ch_freqs, occ_pct, max_pwr = run_spectrum_wars(sdr, SCAN_ROUNDS)
        # Report top occupied channels
        top_idx = np.argsort(occ_pct)[::-1][:20]
        print(f"\n[wars] Top 20 most occupied channels:")
        for idx in top_idx:
            if occ_pct[idx] > 0:
                print(f"  {ch_freqs[idx]/1e6:.4f} MHz | Occ: {occ_pct[idx]:.0f}% | Peak: {max_pwr[idx]:.1f} dBFS")
        overall = np.mean(occ_pct)
        print(f"\n[wars] Overall band occupancy: {overall:.1f}%")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
