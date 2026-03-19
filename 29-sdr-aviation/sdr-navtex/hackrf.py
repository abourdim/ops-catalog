#!/usr/bin/env python3
"""SDR NAVTEX Receiver - Decodes maritime navigational text broadcasts on 518 kHz."""
import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

# NAVTEX is at 518 kHz (below RTL-SDR range, use upconverter or direct sampling)
NAVTEX_FREQ = 518e3
LISTEN_FREQ = 100.518e6  # With 100 MHz upconverter
SAMPLE_RATE = 250e3
AUDIO_RATE = 8000
GAIN = 40
NAVTEX_BAUD = 100
FSK_SHIFT = 170  # Hz

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = LISTEN_FREQ
    sdr.gain = GAIN
    return sdr

def fsk_demodulate(iq, sr, shift):
    inst_freq = np.diff(np.unwrap(np.angle(iq))) * sr / (2 * np.pi)
    # Low-pass filter
    b, a = signal.butter(4, 200 / (sr / 2))
    return signal.filtfilt(b, a, inst_freq)

def recover_bits(demod, sr, baud):
    spb = int(sr / baud)
    bits = []
    for i in range(spb // 2, len(demod), spb):
        bits.append(1 if demod[int(i)] > 0 else 0)
    return bits

SITOR_B = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,;:?!-/()'+"

def decode_sitor(bits):
    text = ""
    for i in range(0, len(bits) - 6, 7):
        char_bits = bits[i:i + 7]
        val = sum(b << j for j, b in enumerate(char_bits))
        if 0 <= val < len(SITOR_B):
            text += SITOR_B[val]
    return text

def main():
    print("=== SDR NAVTEX Receiver ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(int(60 * SAMPLE_RATE))
        demod = fsk_demodulate(iq, SAMPLE_RATE, FSK_SHIFT)
        bits = recover_bits(demod, SAMPLE_RATE, NAVTEX_BAUD)
        print(f"[navtex] Recovered {len(bits)} bits")
        text = decode_sitor(bits[:500])
        if text.strip():
            print(f"[navtex] Decoded: {text[:200]}")
        else:
            print("[navtex] No NAVTEX text decoded (check upconverter)")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
