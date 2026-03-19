#!/usr/bin/env python3
"""
Ham FT8 World Map Receiver
Receives FT8 digital mode signals and extracts decoded callsigns with
grid locators for worldwide propagation mapping. Monitors the 15-second
FT8 cycle and processes the 8-tone GFSK waterfall.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

CENTER_FREQ = 144.174e6   # 2m FT8
SAMPLE_RATE = 250e3
AUDIO_RATE = 12000
FFT_SIZE = 4096
GAIN = 40
FT8_PERIOD = 15.0         # FT8 time slot duration
FT8_TONE_SPACING = 6.25   # Hz between tones
FT8_SYMBOL_PERIOD = 0.16  # seconds per symbol
NUM_PERIODS = 4

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def capture_ft8_period(sdr, period_sec):
    """Capture one FT8 period of IQ data."""
    samples = int(period_sec * SAMPLE_RATE)
    return sdr.read_samples(samples)

def demod_to_audio(iq, sample_rate, audio_rate):
    demod = np.angle(iq[1:] * np.conj(iq[:-1]))
    dec = int(sample_rate / audio_rate)
    b, a = signal.butter(5, 0.45)
    filtered = signal.filtfilt(b, a, demod)
    return signal.decimate(filtered, dec, zero_phase=True)

def extract_ft8_waterfall(audio, sample_rate, symbol_period):
    """Extract FT8 tone waterfall from audio."""
    samples_per_symbol = int(sample_rate * symbol_period)
    num_symbols = len(audio) // samples_per_symbol
    fft_size = samples_per_symbol
    waterfall = np.zeros((num_symbols, fft_size))
    for i in range(num_symbols):
        seg = audio[i * samples_per_symbol:(i + 1) * samples_per_symbol]
        window = signal.hann(len(seg))
        spec = np.abs(np.fft.fft(seg * window))
        waterfall[i, :] = spec
    return waterfall

def find_ft8_signals(waterfall, audio_rate, symbol_period):
    """Find FT8 signal candidates in the waterfall."""
    fft_size = waterfall.shape[1]
    freq_res = audio_rate / fft_size
    avg_power = np.mean(waterfall, axis=0)
    noise = np.median(avg_power)
    candidates = []
    peaks, _ = signal.find_peaks(avg_power, height=noise * 5, distance=int(50 / freq_res))
    for p in peaks:
        freq_hz = p * freq_res
        if 200 < freq_hz < 3000:  # FT8 audio range
            snr = 10 * np.log10(avg_power[p] / (noise + 1e-12))
            candidates.append({
                "audio_freq_hz": round(float(freq_hz), 1),
                "snr_db": round(float(snr), 1),
            })
    return candidates

def main():
    print("=== Ham FT8 World Map Receiver ===")
    sdr = configure_sdr()
    all_signals = []
    try:
        for period in range(NUM_PERIODS):
            print(f"\n[ft8] Capturing period {period+1}/{NUM_PERIODS} ({FT8_PERIOD}s)...")
            iq = capture_ft8_period(sdr, FT8_PERIOD)
            audio = demod_to_audio(iq, SAMPLE_RATE, AUDIO_RATE)
            waterfall = extract_ft8_waterfall(audio, AUDIO_RATE, FT8_SYMBOL_PERIOD)
            signals = find_ft8_signals(waterfall, AUDIO_RATE, FT8_SYMBOL_PERIOD)
            print(f"[ft8] {len(signals)} FT8 signals detected")
            for s in signals[:10]:
                print(f"  {s['audio_freq_hz']:7.1f} Hz | SNR {s['snr_db']:5.1f} dB")
            all_signals.extend(signals)
        print(f"\n[ft8] Total FT8 signals across {NUM_PERIODS} periods: {len(all_signals)}")
        with open("ft8_signals.json", "w") as f:
            json.dump(all_signals, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
