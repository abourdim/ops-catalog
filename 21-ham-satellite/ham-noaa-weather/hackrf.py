#!/usr/bin/env python3
"""
Ham NOAA Weather Satellite Receiver
Receives NOAA APT (Automatic Picture Transmission) weather satellite images.
Captures the 137 MHz downlink, FM demodulates, and extracts the 2400 Hz
AM subcarrier containing the image scanlines.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

NOAA_FREQS = {"NOAA-15": 137.62e6, "NOAA-18": 137.9125e6, "NOAA-19": 137.1e6}
ACTIVE_SAT = "NOAA-19"
SAMPLE_RATE = 1.024e6
AUDIO_RATE = 11025
GAIN = 49.6
CAPTURE_SECONDS = 120

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = NOAA_FREQS[ACTIVE_SAT]
    sdr.gain = GAIN
    return sdr

def fm_demodulate(iq):
    return np.angle(iq[1:] * np.conj(iq[:-1]))

def decimate_audio(demod, sr, ar):
    dec = int(sr / ar)
    nyq = sr / 2
    b, a = signal.butter(5, (ar * 0.45) / nyq)
    return signal.decimate(signal.filtfilt(b, a, demod), dec, zero_phase=True)

def extract_apt_subcarrier(audio, sample_rate):
    """Extract 2400 Hz AM subcarrier for APT image data."""
    nyq = sample_rate / 2
    b, a = signal.butter(4, [2200 / nyq, 2600 / nyq], 'band')
    subcarrier = signal.filtfilt(b, a, audio)
    # AM demodulate via envelope detection
    envelope = np.abs(signal.hilbert(subcarrier))
    # Low pass to get image data (4 lines/sec = ~4160 pixels/sec)
    b2, a2 = signal.butter(3, 2500 / nyq, 'low')
    image_signal = signal.filtfilt(b2, a2, envelope)
    return image_signal

def detect_sync_pulses(image_signal, sample_rate):
    """Detect APT sync-A (7 pulses at 1040 Hz) for line alignment."""
    # Sync A: 7 cycles of 1040 Hz in ~0.0067 seconds
    samples_per_line = int(sample_rate * 0.5)  # 2 lines per second
    # Look for periodic pattern
    correlation = np.correlate(image_signal[:samples_per_line * 4],
                               image_signal[:samples_per_line], mode='valid')
    peaks, _ = signal.find_peaks(correlation, distance=samples_per_line * 0.8)
    return peaks

def build_apt_image(image_signal, sample_rate, width=2080):
    """Build raw APT image from demodulated signal."""
    samples_per_line = int(sample_rate * 0.5)
    num_lines = len(image_signal) // samples_per_line
    image = np.zeros((num_lines, width), dtype=np.uint8)
    for line in range(num_lines):
        start = line * samples_per_line
        raw_line = image_signal[start:start + samples_per_line]
        # Resample to image width
        resampled = signal.resample(raw_line, width)
        # Normalize to 0-255
        line_min, line_max = np.min(resampled), np.max(resampled)
        if line_max > line_min:
            normalized = (resampled - line_min) / (line_max - line_min) * 255
        else:
            normalized = np.zeros(width)
        image[line, :] = normalized.astype(np.uint8)
    return image

def main():
    print(f"=== NOAA Weather Satellite Receiver ({ACTIVE_SAT}) ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(int(CAPTURE_SECONDS * SAMPLE_RATE))
        demod = fm_demodulate(iq)
        audio = decimate_audio(demod, SAMPLE_RATE, AUDIO_RATE)
        print(f"[noaa] Audio: {len(audio)} samples at {AUDIO_RATE} Hz")
        image_signal = extract_apt_subcarrier(audio, AUDIO_RATE)
        syncs = detect_sync_pulses(image_signal, AUDIO_RATE)
        print(f"[noaa] Sync pulses: {len(syncs)}")
        image = build_apt_image(image_signal, AUDIO_RATE)
        print(f"[noaa] Image: {image.shape[0]} lines x {image.shape[1]} pixels")
        image.tofile("noaa_apt_image.raw")
        print("[noaa] Saved noaa_apt_image.raw")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
