#!/usr/bin/env python3
"""
Ham JS8 Messenger Receiver
Receives JS8Call signals - a keyboard-to-keyboard messaging mode for HF.
JS8 uses 8-FSK modulation with 15-second frames, optimized for weak
signal communication over long distances.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

CENTER_FREQ = 144.178e6   # Hypothetical 2m JS8 frequency
SAMPLE_RATE = 250e3
AUDIO_RATE = 12000
FFT_SIZE = 2048
GAIN = 40
JS8_SYMBOL_TIME = 0.160   # Same base as FT8
JS8_MODES = {"normal": 15, "turbo": 6, "slow": 30, "ultra": 120}
CAPTURE_MODE = "normal"

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def receive_js8_frame(sdr, mode):
    """Capture one JS8 frame based on mode timing."""
    frame_duration = JS8_MODES[mode]
    samples = int(frame_duration * SAMPLE_RATE)
    print(f"[js8] Capturing {mode} frame ({frame_duration}s)...")
    iq = sdr.read_samples(samples)
    # Demodulate FM
    demod = np.angle(iq[1:] * np.conj(iq[:-1]))
    dec = int(SAMPLE_RATE / AUDIO_RATE)
    audio = signal.decimate(demod, dec, zero_phase=True)
    return audio

def analyze_js8_activity(audio, sample_rate):
    """Analyze JS8 audio for active signals."""
    f, t, Sxx = signal.spectrogram(audio, fs=sample_rate, nperseg=2048,
                                     noverlap=1536)
    Sxx_db = 10 * np.log10(Sxx + 1e-12)
    noise = np.median(Sxx_db)
    # Find frequency bins with sustained activity
    activity_mask = Sxx_db > (noise + 8)
    active_freqs = np.sum(activity_mask, axis=1)
    # Find frequency channels with JS8 signals
    signals = []
    threshold = Sxx_db.shape[1] * 0.1  # Active in >10% of time frames
    for i, count in enumerate(active_freqs):
        if count > threshold and 200 < f[i] < 3000:
            avg_power = np.mean(Sxx_db[i, activity_mask[i]])
            signals.append({
                "freq_hz": round(float(f[i]), 1),
                "activity_pct": round(float(count / Sxx_db.shape[1] * 100), 1),
                "avg_power_db": round(float(avg_power), 1),
            })
    return signals

def estimate_snr(audio, sample_rate, signal_freq, bandwidth=50):
    """Estimate SNR for a specific signal frequency."""
    nyq = sample_rate / 2
    sig_low = max(10, signal_freq - bandwidth / 2) / nyq
    sig_high = min(nyq - 10, signal_freq + bandwidth / 2) / nyq
    b, a = signal.butter(4, [sig_low, sig_high], btype='band')
    sig_filtered = signal.filtfilt(b, a, audio)
    signal_power = np.mean(sig_filtered ** 2)
    noise_power = np.mean(audio ** 2) - signal_power
    return 10 * np.log10(signal_power / (noise_power + 1e-12))

def main():
    print("=== Ham JS8 Messenger Receiver ===")
    sdr = configure_sdr()
    try:
        audio = receive_js8_frame(sdr, CAPTURE_MODE)
        signals = analyze_js8_activity(audio, AUDIO_RATE)
        print(f"\n[js8] Detected {len(signals)} JS8 signals:")
        for s in signals:
            snr = estimate_snr(audio, AUDIO_RATE, s["freq_hz"])
            print(f"  {s['freq_hz']:7.1f} Hz | Activity: {s['activity_pct']:.0f}% | "
                  f"SNR: {snr:.1f} dB")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
