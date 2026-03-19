#!/usr/bin/env python3
"""
Ham Moon Bounce (EME) Receiver
Receives Earth-Moon-Earth (EME) reflected signals on 144 MHz.
EME signals are extremely weak (-25 to -30 dB SNR), requiring deep
integration and narrow bandwidth processing.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

EME_FREQ = 144.100e6      # 2m EME/weak signal segment
SAMPLE_RATE = 250e3
FFT_SIZE = 65536           # Very high resolution for EME
GAIN = 49.6
INTEGRATION_TIME = 120     # Long integration for weak signals

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = EME_FREQ
    sdr.gain = GAIN
    return sdr

def deep_integration_spectrum(sdr, fft_size, duration_sec):
    """Perform deep integration of spectra to pull weak EME signals from noise."""
    samples_per_fft = fft_size
    ffts_per_second = int(SAMPLE_RATE / fft_size)
    total_ffts = int(duration_sec * ffts_per_second)
    window = signal.blackmanharris(fft_size)
    accumulated = np.zeros(fft_size, dtype=np.float64)
    print(f"[eme] Deep integrating {total_ffts} spectra over {duration_sec}s...")
    batch_size = max(1, ffts_per_second)
    batches = total_ffts // batch_size
    for b in range(batches):
        iq = sdr.read_samples(fft_size * batch_size)
        for i in range(batch_size):
            seg = iq[i * fft_size:(i + 1) * fft_size]
            if len(seg) < fft_size:
                break
            spec = np.fft.fftshift(np.fft.fft(seg * window))
            accumulated += np.abs(spec) ** 2
        if b % 20 == 0:
            print(f"  Batch {b}/{batches} ({b * batch_size} FFTs)")
    accumulated /= total_ffts
    psd_db = 10 * np.log10(accumulated + 1e-20)
    return psd_db

def search_eme_signals(psd_db, sample_rate, fft_size):
    """Search for extremely narrow CW signals typical of EME."""
    freq_res = sample_rate / fft_size
    noise_floor = np.median(psd_db)
    noise_std = np.std(psd_db)
    # EME signals are CW: very narrow, just a few Hz
    threshold = noise_floor + 4 * noise_std  # 4-sigma detection
    peaks, props = signal.find_peaks(psd_db, height=threshold, width=(1, 5))
    signals = []
    for p in peaks:
        freq_offset = (p - fft_size / 2) * freq_res
        signals.append({
            "offset_hz": round(float(freq_offset), 2),
            "freq_mhz": round((EME_FREQ + freq_offset) / 1e6, 6),
            "power_db": round(float(psd_db[p]), 2),
            "snr_sigma": round(float((psd_db[p] - noise_floor) / noise_std), 1),
        })
    return signals, noise_floor, noise_std

def main():
    print("=== Ham Moon Bounce (EME) Receiver ===")
    print(f"Freq: {EME_FREQ/1e6:.3f} MHz | FFT: {FFT_SIZE} ({SAMPLE_RATE/FFT_SIZE:.2f} Hz res)")
    sdr = configure_sdr()
    try:
        psd_db = deep_integration_spectrum(sdr, FFT_SIZE, INTEGRATION_TIME)
        signals, nf, ns = search_eme_signals(psd_db, SAMPLE_RATE, FFT_SIZE)
        print(f"\n[eme] Noise floor: {nf:.1f} dB (std: {ns:.2f} dB)")
        print(f"[eme] EME signal candidates: {len(signals)}")
        for s in signals:
            print(f"  {s['freq_mhz']:.6f} MHz | offset {s['offset_hz']:+.2f} Hz | "
                  f"{s['snr_sigma']:.1f} sigma")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
