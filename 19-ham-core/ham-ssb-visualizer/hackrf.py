#!/usr/bin/env python3
"""
Ham SSB Visualizer
Receives and visualizes Single Sideband (SSB) signals from amateur bands.
Displays spectral content, measures signal bandwidth, and demodulates
USB/LSB signals to extract voice audio.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

# --- Configuration ---
SSB_FREQ = 144.2e6        # 2m SSB calling frequency
SAMPLE_RATE = 250e3
AUDIO_RATE = 8000
FFT_SIZE = 2048
GAIN = 40
CAPTURE_SECONDS = 10
SSB_MODE = "USB"           # USB (Upper Sideband) or LSB

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = SSB_FREQ
    sdr.gain = GAIN
    return sdr

def ssb_demodulate(iq_samples, sample_rate, audio_rate, mode="USB"):
    """Demodulate SSB signal (USB or LSB)."""
    # Shift frequency for sideband selection
    t = np.arange(len(iq_samples)) / sample_rate
    if mode == "USB":
        shifted = iq_samples * np.exp(-1j * 2 * np.pi * 1500 * t)
    else:  # LSB
        shifted = iq_samples * np.exp(1j * 2 * np.pi * 1500 * t)
    # Low-pass filter to 3 kHz bandwidth (voice)
    nyq = sample_rate / 2
    cutoff = 3000 / nyq
    b, a = signal.butter(5, cutoff, btype='low')
    filtered = signal.filtfilt(b, a, np.real(shifted))
    # Decimate to audio rate
    dec_factor = int(sample_rate / audio_rate)
    audio = signal.decimate(filtered, dec_factor, zero_phase=True)
    return audio

def measure_ssb_quality(iq_samples, sample_rate, fft_size):
    """Measure SSB signal quality metrics."""
    window = signal.blackmanharris(fft_size)
    spec = np.fft.fftshift(np.fft.fft(iq_samples[:fft_size] * window))
    psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
    freq_axis = np.linspace(-sample_rate / 2, sample_rate / 2, fft_size)
    # Measure sideband suppression
    upper_band = psd_db[fft_size // 2:]
    lower_band = psd_db[:fft_size // 2]
    upper_power = np.mean(upper_band)
    lower_power = np.mean(lower_band)
    suppression = abs(upper_power - lower_power)
    # Signal bandwidth
    peak = np.max(psd_db)
    bw_mask = psd_db > (peak - 6)
    bw_hz = np.sum(bw_mask) * (sample_rate / fft_size)
    noise_floor = np.median(psd_db)
    snr = peak - noise_floor

    return {
        "sideband_suppression_db": round(float(suppression), 1),
        "bandwidth_hz": round(float(bw_hz), 0),
        "peak_power_db": round(float(peak), 1),
        "noise_floor_db": round(float(noise_floor), 1),
        "snr_db": round(float(snr), 1),
    }

def compute_spectrogram(audio, sample_rate, nperseg=256):
    """Compute spectrogram for visualization data."""
    f, t, Sxx = signal.spectrogram(audio, fs=sample_rate, nperseg=nperseg,
                                     noverlap=nperseg // 2)
    Sxx_db = 10 * np.log10(Sxx + 1e-12)
    return f, t, Sxx_db

def main():
    print("=== Ham SSB Visualizer ===")
    print(f"Frequency: {SSB_FREQ/1e6:.3f} MHz | Mode: {SSB_MODE}")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(int(CAPTURE_SECONDS * SAMPLE_RATE))
        quality = measure_ssb_quality(iq, SAMPLE_RATE, FFT_SIZE)
        print(f"[ssb] Signal quality: {quality}")
        audio = ssb_demodulate(iq, SAMPLE_RATE, AUDIO_RATE, SSB_MODE)
        print(f"[ssb] Demodulated audio: {len(audio)} samples")
        f, t, Sxx = compute_spectrogram(audio, AUDIO_RATE)
        print(f"[ssb] Spectrogram: {Sxx.shape[0]} freq bins x {Sxx.shape[1]} time frames")
        # Save audio
        audio_i16 = (audio / (np.max(np.abs(audio)) + 1e-12) * 32767).astype(np.int16)
        audio_i16.tofile("ssb_audio.raw")
        print("[ssb] Audio saved to ssb_audio.raw")
        np.savez("ssb_spectrogram.npz", freq=f, time=t, power=Sxx)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
