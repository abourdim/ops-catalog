#!/usr/bin/env python3
"""
Ham CW Keyer - SDR Sidetone Monitor
Monitors the transmitted CW signal via SDR to verify keying quality.
Measures timing accuracy of dits and dahs, checks for key clicks,
and provides keying speed (WPM) estimation.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

# --- Configuration ---
MONITOR_FREQ = 144.05e6   # 2m CW frequency to monitor
SAMPLE_RATE = 250e3
AUDIO_RATE = 8000
FFT_SIZE = 512
GAIN = 30
SIDETONE_FREQ = 600       # Expected sidetone frequency
MONITOR_SECONDS = 20
STANDARD_DIT_MS = 60      # Standard dit at 20 WPM

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = MONITOR_FREQ
    sdr.gain = GAIN
    return sdr

def extract_audio(iq_samples, sample_rate, audio_rate):
    """FM demodulate and decimate to audio."""
    demod = np.angle(iq_samples[1:] * np.conj(iq_samples[:-1]))
    dec = int(sample_rate / audio_rate)
    return signal.decimate(demod, dec, zero_phase=True)

def measure_key_clicks(audio, sample_rate, tone_freq):
    """Check for key clicks by analyzing rise/fall times of CW tone."""
    # Bandpass around sidetone
    nyq = sample_rate / 2
    b, a = signal.butter(4, [(tone_freq - 100) / nyq, (tone_freq + 100) / nyq], btype='band')
    filtered = signal.filtfilt(b, a, audio)
    envelope = np.abs(signal.hilbert(filtered))
    # Smooth envelope
    smooth_env = signal.medfilt(envelope, 21)
    # Find transitions
    threshold = np.mean(smooth_env) + np.std(smooth_env)
    above = smooth_env > threshold
    transitions = np.diff(above.astype(int))
    rise_indices = np.where(transitions == 1)[0]
    fall_indices = np.where(transitions == -1)[0]

    rise_times = []
    for ri in rise_indices:
        # Measure 10%-90% rise time
        region = smooth_env[max(0, ri - 20):ri + 40]
        if len(region) > 10:
            peak = np.max(region)
            t10 = np.argmax(region > 0.1 * peak)
            t90 = np.argmax(region > 0.9 * peak)
            rise_ms = (t90 - t10) * 1000 / sample_rate
            rise_times.append(rise_ms)

    return {
        "avg_rise_time_ms": round(float(np.mean(rise_times)), 1) if rise_times else 0,
        "key_click_risk": "HIGH" if rise_times and np.mean(rise_times) < 2 else "LOW",
        "transitions": len(rise_indices),
    }

def measure_timing(audio, sample_rate, tone_freq):
    """Measure dit/dah timing for WPM estimation."""
    nyq = sample_rate / 2
    b, a = signal.butter(4, [(tone_freq - 100) / nyq, (tone_freq + 100) / nyq], btype='band')
    filtered = signal.filtfilt(b, a, audio)
    envelope = np.abs(signal.hilbert(filtered))
    smooth = signal.medfilt(envelope, 15)
    threshold = np.mean(smooth) + 0.5 * np.std(smooth)
    above = smooth > threshold
    # Measure on-durations
    on_durations = []
    in_tone = False
    start = 0
    for i in range(len(above)):
        if above[i] and not in_tone:
            start = i
            in_tone = True
        elif not above[i] and in_tone:
            dur_ms = (i - start) * 1000 / sample_rate
            if dur_ms > 10:
                on_durations.append(dur_ms)
            in_tone = False

    if len(on_durations) < 2:
        return {"wpm": 0, "dit_ms": 0, "dah_ms": 0}

    durations = np.array(on_durations)
    # Cluster into dits and dahs (threshold at 2x minimum)
    min_dur = np.min(durations)
    dit_thresh = min_dur * 2
    dits = durations[durations < dit_thresh]
    dahs = durations[durations >= dit_thresh]
    avg_dit = float(np.mean(dits)) if len(dits) > 0 else min_dur
    avg_dah = float(np.mean(dahs)) if len(dahs) > 0 else avg_dit * 3
    wpm = 1200 / avg_dit if avg_dit > 0 else 0

    return {
        "wpm": round(wpm, 1),
        "dit_ms": round(avg_dit, 1),
        "dah_ms": round(avg_dah, 1),
        "dah_dit_ratio": round(avg_dah / avg_dit, 2) if avg_dit > 0 else 0,
        "total_elements": len(on_durations),
    }

def main():
    print("=== Ham CW Keyer Monitor ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(int(MONITOR_SECONDS * SAMPLE_RATE))
        audio = extract_audio(iq, SAMPLE_RATE, AUDIO_RATE)
        clicks = measure_key_clicks(audio, AUDIO_RATE, SIDETONE_FREQ)
        timing = measure_timing(audio, AUDIO_RATE, SIDETONE_FREQ)
        print(f"[keyer] Key click analysis: {clicks}")
        print(f"[keyer] Timing analysis: {timing}")
        if timing["wpm"] > 0:
            print(f"[keyer] Speed: {timing['wpm']:.0f} WPM")
            print(f"[keyer] Dah/Dit ratio: {timing['dah_dit_ratio']:.2f} (ideal: 3.00)")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
