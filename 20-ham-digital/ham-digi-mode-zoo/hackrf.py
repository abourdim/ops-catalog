#!/usr/bin/env python3
"""
Ham Digital Mode Zoo
Receives and identifies various digital modes on amateur bands.
Detects FT8, FT4, PSK31, RTTY, JT65, WSPR, and other digital modes
by analyzing audio frequency patterns and timing characteristics.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- Configuration ---
DIGI_FREQ = 144.174e6     # 2m FT8 frequency
SAMPLE_RATE = 250e3
AUDIO_RATE = 12000
FFT_SIZE = 4096
GAIN = 40
CAPTURE_SECONDS = 15

DIGI_MODES = {
    "FT8": {"tone_spacing": 6.25, "period_sec": 15, "tones": 8, "bw_hz": 50},
    "FT4": {"tone_spacing": 20.83, "period_sec": 7.5, "tones": 4, "bw_hz": 83},
    "PSK31": {"tone_spacing": 0, "period_sec": 0, "tones": 1, "bw_hz": 31.25},
    "WSPR": {"tone_spacing": 1.46, "period_sec": 120, "tones": 4, "bw_hz": 6},
    "RTTY": {"tone_spacing": 170, "period_sec": 0, "tones": 2, "bw_hz": 300},
}

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = DIGI_FREQ
    sdr.gain = GAIN
    return sdr

def extract_audio(iq_samples, sample_rate, audio_rate):
    demod = np.angle(iq_samples[1:] * np.conj(iq_samples[:-1]))
    dec = int(sample_rate / audio_rate)
    return signal.decimate(demod, dec, zero_phase=True)

def analyze_digi_spectrum(audio, sample_rate, fft_size):
    """Analyze audio spectrum for digital mode characteristics."""
    f, t, Sxx = signal.spectrogram(audio, fs=sample_rate, nperseg=fft_size,
                                     noverlap=fft_size * 3 // 4)
    Sxx_db = 10 * np.log10(Sxx + 1e-12)
    return f, t, Sxx_db

def detect_tone_pattern(f, t, Sxx_db, mode_info):
    """Detect digital mode by tone spacing and pattern."""
    # Find active frequency bins
    threshold = np.median(Sxx_db) + 10
    active_mask = Sxx_db > threshold
    # Count active bins per time slice
    active_per_time = np.sum(active_mask, axis=0)
    # Check for characteristic tone spacing
    avg_spectrum = np.mean(Sxx_db, axis=1)
    peaks, _ = signal.find_peaks(avg_spectrum, height=np.median(avg_spectrum) + 8, distance=3)
    if len(peaks) >= 2:
        spacings = np.diff(f[peaks])
        return float(np.median(spacings)), len(peaks)
    return 0, 0

def classify_digital_mode(tone_spacing, num_tones, signal_bw):
    """Classify detected digital mode based on measured parameters."""
    best_match = "UNKNOWN"
    best_score = 0
    for mode_name, props in DIGI_MODES.items():
        score = 0
        if props["tone_spacing"] > 0:
            spacing_err = abs(tone_spacing - props["tone_spacing"]) / (props["tone_spacing"] + 0.1)
            if spacing_err < 0.3:
                score += 2
        if abs(signal_bw - props["bw_hz"]) < props["bw_hz"] * 0.5:
            score += 1
        if score > best_score:
            best_score = score
            best_match = mode_name
    return best_match, best_score

def main():
    print("=== Ham Digital Mode Zoo ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(int(CAPTURE_SECONDS * SAMPLE_RATE))
        audio = extract_audio(iq, SAMPLE_RATE, AUDIO_RATE)
        f, t, Sxx_db = analyze_digi_spectrum(audio, AUDIO_RATE, FFT_SIZE)
        spacing, num_tones = detect_tone_pattern(f, t, Sxx_db, None)
        bw_est = spacing * max(num_tones, 1)
        mode, score = classify_digital_mode(spacing, num_tones, bw_est)
        print(f"[digi] Tone spacing: {spacing:.2f} Hz | Tones: {num_tones} | BW: {bw_est:.1f} Hz")
        print(f"[digi] Detected mode: {mode} (confidence: {score})")
        print(f"[digi] Spectrogram: {Sxx_db.shape[0]} freq x {Sxx_db.shape[1]} time frames")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
