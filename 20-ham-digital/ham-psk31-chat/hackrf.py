#!/usr/bin/env python3
"""
Ham PSK31 Chat Receiver
Receives and demodulates PSK31 (Phase Shift Keying, 31.25 baud) signals.
PSK31 is a narrow-bandwidth digital mode for keyboard-to-keyboard chat.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

CENTER_FREQ = 144.144e6   # 2m digital segment
SAMPLE_RATE = 250e3
AUDIO_RATE = 8000
FFT_SIZE = 2048
GAIN = 40
PSK31_BAUD = 31.25
CAPTURE_SECONDS = 20

# Varicode lookup (partial - common ASCII chars)
VARICODE = {
    '1010101011': ' ', '1011011011': 'E', '1011101101': 'T',
    '1101101111': 'A', '10110111': 'O', '10111011': 'I',
    '10111101': 'N', '11011011': 'S', '11011101': 'H',
    '11011111': 'R', '11101011': 'D', '11101101': 'L',
}

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = CENTER_FREQ
    sdr.gain = GAIN
    return sdr

def extract_audio(iq, sample_rate, audio_rate):
    demod = np.angle(iq[1:] * np.conj(iq[:-1]))
    dec = int(sample_rate / audio_rate)
    return signal.decimate(demod, dec, zero_phase=True)

def find_psk31_signals(audio, sample_rate, fft_size):
    """Find PSK31 signals - very narrow bandwidth (~31 Hz) signals."""
    window = signal.blackmanharris(fft_size)
    spec = np.abs(np.fft.fft(audio[:fft_size] * window))[:fft_size // 2]
    freq_axis = np.arange(fft_size // 2) * sample_rate / fft_size
    noise = np.median(spec)
    peaks, _ = signal.find_peaks(spec, height=noise * 8, width=(1, 5))
    signals = []
    for p in peaks:
        if 200 < freq_axis[p] < 3000:
            signals.append({"freq_hz": round(float(freq_axis[p]), 1),
                           "power": round(float(spec[p]), 2)})
    return signals

def psk31_demodulate(audio, sample_rate, carrier_freq, baud_rate):
    """Demodulate BPSK31 signal at the specified carrier frequency."""
    t = np.arange(len(audio)) / sample_rate
    # Mix down to baseband
    i_baseband = audio * np.cos(2 * np.pi * carrier_freq * t)
    q_baseband = audio * np.sin(2 * np.pi * carrier_freq * t)
    # Low pass filter
    nyq = sample_rate / 2
    cutoff = baud_rate * 2 / nyq
    b, a = signal.butter(4, cutoff, btype='low')
    i_filt = signal.filtfilt(b, a, i_baseband)
    q_filt = signal.filtfilt(b, a, q_baseband)
    baseband = i_filt + 1j * q_filt
    # Sample at symbol rate
    samples_per_symbol = sample_rate / baud_rate
    symbols = []
    idx = 0.0
    prev_phase = 0
    while int(idx) < len(baseband) - 1:
        phase = np.angle(baseband[int(idx)])
        phase_diff = phase - prev_phase
        # BPSK: 0 or pi phase change
        bit = 0 if abs(phase_diff) < np.pi / 2 else 1
        symbols.append(bit)
        prev_phase = phase
        idx += samples_per_symbol
    return symbols

def decode_varicode(bits):
    """Decode Varicode bit stream to text."""
    text = ""
    current = ""
    for bit in bits:
        current += str(bit)
        if current.endswith("00"):
            code = current[:-2]
            for vc, char in VARICODE.items():
                if code == vc:
                    text += char
                    break
            current = ""
    return text

def main():
    print("=== Ham PSK31 Chat Receiver ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(int(CAPTURE_SECONDS * SAMPLE_RATE))
        audio = extract_audio(iq, SAMPLE_RATE, AUDIO_RATE)
        signals = find_psk31_signals(audio, AUDIO_RATE, FFT_SIZE)
        print(f"[psk31] Found {len(signals)} narrowband signals")
        for s in signals[:5]:
            print(f"  Carrier: {s['freq_hz']:.1f} Hz")
            bits = psk31_demodulate(audio, AUDIO_RATE, s['freq_hz'], PSK31_BAUD)
            text = decode_varicode(bits[:500])
            if text.strip():
                print(f"  Decoded: {text[:80]}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
