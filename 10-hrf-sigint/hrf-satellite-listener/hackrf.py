#!/usr/bin/env python3
"""
HackRF Satellite Listener
Receives and demodulates signals from weather satellites (NOAA APT)
and other LEO satellites. Configures SDR for satellite downlink frequencies,
applies Doppler correction, and processes the baseband audio.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

# --- Configuration ---
# NOAA APT satellite frequencies
NOAA_15_FREQ = 137.62e6
NOAA_18_FREQ = 137.9125e6
NOAA_19_FREQ = 137.1e6
ACTIVE_FREQ = NOAA_19_FREQ
SAMPLE_RATE = 1.024e6     # 1.024 MSPS
AUDIO_RATE = 48000         # Target audio sample rate
GAIN = 49.6
CAPTURE_DURATION = 60      # Seconds (short test capture)

def configure_sdr():
    """Initialize RTL-SDR for satellite reception."""
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = ACTIVE_FREQ
    sdr.gain = GAIN
    sdr.freq_correction = 1
    return sdr

def apply_doppler_correction(iq_samples, doppler_shift, sample_rate):
    """Apply frequency shift to compensate for satellite Doppler effect."""
    t = np.arange(len(iq_samples)) / sample_rate
    correction = np.exp(-1j * 2 * np.pi * doppler_shift * t)
    return iq_samples * correction

def fm_demodulate(iq_samples):
    """FM demodulation via phase differentiation."""
    product = iq_samples[1:] * np.conj(iq_samples[:-1])
    return np.angle(product)

def decimate_to_audio(demod_signal, input_rate, output_rate):
    """Decimate the demodulated signal to audio sample rate."""
    decimation = int(input_rate / output_rate)
    # Anti-aliasing low-pass filter
    nyq = 0.5 * input_rate
    cutoff = 0.4 * output_rate / nyq
    b, a = signal.butter(5, cutoff, btype='low')
    filtered = signal.filtfilt(b, a, demod_signal)
    return signal.decimate(filtered, decimation, zero_phase=True)

def extract_apt_sync(audio, sample_rate):
    """Detect NOAA APT sync pulses (2400 Hz AM subcarrier)."""
    # APT sync: 7 pulses of 1040 Hz followed by 7 pulses at sync freq
    # Look for the 2400 Hz subcarrier
    freq_2400 = 2400
    t = np.arange(len(audio)) / sample_rate
    ref_signal = np.cos(2 * np.pi * freq_2400 * t[:1024])
    correlation = np.correlate(audio[:len(audio)], ref_signal, mode='valid')
    sync_positions = []
    threshold = np.max(np.abs(correlation)) * 0.5
    peaks, _ = signal.find_peaks(np.abs(correlation), height=threshold, distance=sample_rate * 0.4)
    return peaks

def compute_signal_quality(iq_samples):
    """Estimate SNR and signal quality metrics."""
    power = np.abs(iq_samples) ** 2
    mean_power = np.mean(power)
    # Simple SNR estimate: signal variance / noise estimate
    sorted_power = np.sort(power)
    noise_est = np.mean(sorted_power[:len(sorted_power) // 4])
    snr = 10 * np.log10(mean_power / (noise_est + 1e-12))
    return round(float(snr), 1)

def main():
    print("=== HackRF Satellite Listener ===")
    print(f"Frequency: {ACTIVE_FREQ/1e6:.4f} MHz | Rate: {SAMPLE_RATE/1e6:.3f} MSPS")
    sdr = configure_sdr()
    try:
        total_samples = int(CAPTURE_DURATION * SAMPLE_RATE)
        print(f"[sat] Capturing {CAPTURE_DURATION}s of satellite data...")
        iq = sdr.read_samples(total_samples)
        # Apply estimated Doppler (placeholder: 0 Hz for stationary test)
        iq_corrected = apply_doppler_correction(iq, doppler_shift=0, sample_rate=SAMPLE_RATE)
        snr = compute_signal_quality(iq_corrected)
        print(f"[sat] Estimated SNR: {snr} dB")
        # FM demodulate
        demod = fm_demodulate(iq_corrected)
        # Decimate to audio rate
        audio = decimate_to_audio(demod, SAMPLE_RATE, AUDIO_RATE)
        print(f"[sat] Audio samples: {len(audio)} at {AUDIO_RATE} Hz")
        # Look for APT sync
        syncs = extract_apt_sync(audio, AUDIO_RATE)
        print(f"[sat] Detected {len(syncs)} APT sync pulses")
        # Save raw audio
        audio_norm = (audio / (np.max(np.abs(audio)) + 1e-12) * 32767).astype(np.int16)
        audio_norm.tofile("satellite_audio.raw")
        print("[sat] Saved satellite_audio.raw")
    except KeyboardInterrupt:
        print("\n[sat] Capture interrupted.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
