#!/usr/bin/env python3
"""
Ham ISS Contact Receiver
Receives voice and APRS signals from the International Space Station.
ISS transmits on 145.80 MHz (voice downlink) and 145.825 MHz (APRS).
Applies Doppler correction for LEO satellite passes.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

ISS_VOICE_FREQ = 145.80e6
ISS_APRS_FREQ = 145.825e6
SAMPLE_RATE = 250e3
AUDIO_RATE = 22050
GAIN = 49.6
CAPTURE_SECONDS = 300      # 5-minute pass window
MAX_DOPPLER = 3400         # Max Doppler shift for ISS at 400km

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = ISS_VOICE_FREQ
    sdr.gain = GAIN
    return sdr

def compute_doppler_curve(duration_sec, max_doppler, sample_rate):
    """Generate approximate Doppler shift curve for an overhead pass."""
    t = np.linspace(-duration_sec / 2, duration_sec / 2, int(duration_sec * 10))
    # Simplified S-curve Doppler model
    doppler = -max_doppler * np.tanh(t / (duration_sec / 6))
    return t, doppler

def apply_doppler(iq_chunk, doppler_hz, sample_rate):
    """Apply Doppler correction to IQ chunk."""
    t = np.arange(len(iq_chunk)) / sample_rate
    correction = np.exp(-1j * 2 * np.pi * doppler_hz * t)
    return iq_chunk * correction

def fm_demod_audio(iq, sr, ar):
    demod = np.angle(iq[1:] * np.conj(iq[:-1]))
    dec = int(sr / ar)
    b, a = signal.butter(5, 0.4)
    return signal.decimate(signal.filtfilt(b, a, demod), dec, zero_phase=True)

def detect_iss_signal(sdr, duration_sec=10):
    """Quick check if ISS signal is present."""
    iq = sdr.read_samples(int(duration_sec * SAMPLE_RATE))
    power = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
    # Check for FM carrier
    spec = np.abs(np.fft.fftshift(np.fft.fft(iq[:4096])))
    peak = np.max(spec)
    noise = np.median(spec)
    snr = 10 * np.log10(peak / (noise + 1e-12))
    return {"power_db": round(float(power), 1), "snr_db": round(float(snr), 1),
            "detected": snr > 10}

def record_pass(sdr, duration_sec):
    """Record full ISS pass with Doppler tracking."""
    chunk_sec = 5
    chunks = int(duration_sec / chunk_sec)
    _, doppler_curve = compute_doppler_curve(duration_sec, MAX_DOPPLER, SAMPLE_RATE)
    all_audio = []
    print(f"[iss] Recording {duration_sec}s pass...")
    for i in range(chunks):
        iq = sdr.read_samples(int(chunk_sec * SAMPLE_RATE))
        # Apply Doppler for this time segment
        t_frac = i / chunks
        doppler_idx = int(t_frac * len(doppler_curve))
        doppler_hz = doppler_curve[min(doppler_idx, len(doppler_curve) - 1)]
        corrected = apply_doppler(iq, doppler_hz, SAMPLE_RATE)
        audio = fm_demod_audio(corrected, SAMPLE_RATE, AUDIO_RATE)
        all_audio.append(audio)
        rssi = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
        print(f"  [{i*chunk_sec:4d}s] RSSI: {rssi:.1f} dB | Doppler: {doppler_hz:+.0f} Hz")
    return np.concatenate(all_audio)

def main():
    print("=== Ham ISS Contact Receiver ===")
    sdr = configure_sdr()
    try:
        status = detect_iss_signal(sdr, duration_sec=5)
        print(f"[iss] Signal check: {status}")
        if status["detected"]:
            audio = record_pass(sdr, min(CAPTURE_SECONDS, 60))
            audio_i16 = (audio / (np.max(np.abs(audio)) + 1e-12) * 32767).astype(np.int16)
            audio_i16.tofile("iss_pass_audio.raw")
            print(f"[iss] Saved {len(audio)} audio samples to iss_pass_audio.raw")
        else:
            print("[iss] No ISS signal detected. Check pass schedule.")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
