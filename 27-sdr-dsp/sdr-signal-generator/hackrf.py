#!/usr/bin/env python3
"""
SDR Signal Generator
Generates various test signals (tone, chirp, noise, modulated) and
writes them as IQ files compatible with SDR playback. Also captures
real signals for comparison.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

SAMPLE_RATE = 2.4e6
DURATION = 2.0

def generate_tone(freq_hz, sample_rate, duration):
    t = np.arange(int(sample_rate * duration)) / sample_rate
    return np.exp(1j * 2 * np.pi * freq_hz * t).astype(np.complex64)

def generate_chirp(f0, f1, sample_rate, duration):
    t = np.arange(int(sample_rate * duration)) / sample_rate
    phase = 2 * np.pi * (f0 * t + (f1 - f0) / (2 * duration) * t ** 2)
    return np.exp(1j * phase).astype(np.complex64)

def generate_noise(sample_rate, duration, bandwidth_frac=1.0):
    n = int(sample_rate * duration)
    noise = (np.random.randn(n) + 1j * np.random.randn(n)).astype(np.complex64) / np.sqrt(2)
    if bandwidth_frac < 1.0:
        nyq = sample_rate / 2
        b, a = signal.butter(4, bandwidth_frac)
        noise = (signal.filtfilt(b, a, np.real(noise)) +
                 1j * signal.filtfilt(b, a, np.imag(noise))).astype(np.complex64)
    return noise

def generate_fm_signal(audio_freq, fm_dev, sample_rate, duration):
    t = np.arange(int(sample_rate * duration)) / sample_rate
    audio = np.sin(2 * np.pi * audio_freq * t)
    phase = 2 * np.pi * fm_dev * np.cumsum(audio) / sample_rate
    return np.exp(1j * phase).astype(np.complex64)

def capture_reference(sample_rate, freq=100e6, duration=1.0):
    sdr = RtlSdr()
    sdr.sample_rate = sample_rate
    sdr.center_freq = freq
    sdr.gain = 40
    iq = sdr.read_samples(int(duration * sample_rate))
    sdr.close()
    return iq.astype(np.complex64)

def save_iq(samples, filename):
    samples.tofile(filename)
    print(f"[siggen] Saved {filename} ({len(samples)} samples, {len(samples)*8/1024:.0f} KB)")

def main():
    print("=== SDR Signal Generator ===")
    # Generate test signals
    tone = generate_tone(100e3, SAMPLE_RATE, DURATION)
    save_iq(tone, "test_tone_100khz.iq")
    chirp = generate_chirp(-500e3, 500e3, SAMPLE_RATE, DURATION)
    save_iq(chirp, "test_chirp.iq")
    noise = generate_noise(SAMPLE_RATE, DURATION, 0.5)
    save_iq(noise, "test_noise.iq")
    fm = generate_fm_signal(1000, 75e3, SAMPLE_RATE, DURATION)
    save_iq(fm, "test_fm_signal.iq")
    # Capture real signal for comparison
    print("[siggen] Capturing reference signal from SDR...")
    try:
        ref = capture_reference(SAMPLE_RATE)
        save_iq(ref, "reference_capture.iq")
    except Exception as e:
        print(f"[siggen] SDR capture skipped: {e}")

if __name__ == "__main__":
    main()
