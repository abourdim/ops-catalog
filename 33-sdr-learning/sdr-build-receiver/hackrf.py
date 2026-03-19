#!/usr/bin/env python3
"""SDR Build-a-Receiver - Step-by-step receiver chain construction tutorial."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time

CENTER_FREQ = 100e6  # FM broadcast
SAMPLE_RATE = 2.4e6
GAIN = 40

def step1_capture():
    """Step 1: Capture raw IQ samples from SDR hardware."""
    print("[step1] Capturing IQ samples...")
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    iq = sdr.read_samples(256 * 1024)
    sdr.close()
    print(f"  Captured {len(iq)} complex samples at {SAMPLE_RATE/1e6:.1f} MSPS")
    return iq

def step2_filter(iq, cutoff_hz=100e3):
    """Step 2: Apply a low-pass filter to select desired signal."""
    print("[step2] Applying low-pass filter...")
    nyq = SAMPLE_RATE / 2
    b, a = signal.butter(5, cutoff_hz / nyq, btype='low')
    filtered = signal.filtfilt(b, a, np.real(iq)) + 1j * signal.filtfilt(b, a, np.imag(iq))
    print(f"  Filtered to {cutoff_hz/1e3:.0f} kHz bandwidth")
    return filtered

def step3_decimate(iq, factor=10):
    """Step 3: Decimate to reduce sample rate."""
    print(f"[step3] Decimating by {factor}x...")
    decimated = signal.decimate(np.real(iq), factor) + 1j * signal.decimate(np.imag(iq), factor)
    new_rate = SAMPLE_RATE / factor
    print(f"  New sample rate: {new_rate/1e3:.0f} kHz")
    return decimated, new_rate

def step4_demodulate(iq):
    """Step 4: FM demodulation via phase differentiation."""
    print("[step4] FM demodulating...")
    demod = np.angle(iq[1:] * np.conj(iq[:-1]))
    print(f"  Output: {len(demod)} audio samples")
    return demod

def step5_audio_filter(audio, sample_rate):
    """Step 5: Audio low-pass filter for voice."""
    print("[step5] Audio filtering (15 kHz)...")
    nyq = sample_rate / 2
    b, a = signal.butter(3, min(15000, nyq * 0.9) / nyq)
    return signal.filtfilt(b, a, audio)

def main():
    print("=== SDR Build-a-Receiver Tutorial ===\n")
    iq = step1_capture()
    filtered = step2_filter(iq)
    decimated, new_rate = step3_decimate(filtered)
    audio = step4_demodulate(decimated)
    final_audio = step5_audio_filter(audio, new_rate)
    print(f"\n[done] Receiver chain complete!")
    print(f"  Input: {len(iq)} IQ samples at {SAMPLE_RATE/1e6:.1f} MSPS")
    print(f"  Output: {len(final_audio)} audio samples at {new_rate/1e3:.0f} kHz")

if __name__ == "__main__":
    main()
