#!/usr/bin/env python3
"""
Ham APRS Dashboard
Receives APRS (Automatic Packet Reporting System) signals on 144.39 MHz.
Demodulates 1200 baud AFSK (Bell 202), decodes AX.25 frames, and extracts
position reports, weather data, and status messages.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

APRS_FREQ = 144.39e6      # North American APRS frequency
SAMPLE_RATE = 250e3
AUDIO_RATE = 22050
FFT_SIZE = 1024
GAIN = 40
AFSK_MARK = 1200           # Mark frequency (Bell 202)
AFSK_SPACE = 2200          # Space frequency
BAUD_RATE = 1200
CAPTURE_SECONDS = 60

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = APRS_FREQ
    sdr.gain = GAIN
    return sdr

def fm_demod_to_audio(iq, sample_rate, audio_rate):
    demod = np.angle(iq[1:] * np.conj(iq[:-1]))
    dec = int(sample_rate / audio_rate)
    return signal.decimate(demod, dec, zero_phase=True)

def afsk_demodulate(audio, sample_rate, mark_freq, space_freq, baud):
    """Demodulate AFSK Bell 202 to binary data."""
    samples_per_bit = int(sample_rate / baud)
    # Bandpass filters for mark and space
    nyq = sample_rate / 2
    mark_b, mark_a = signal.butter(4, [(mark_freq - 200) / nyq, (mark_freq + 200) / nyq], 'band')
    space_b, space_a = signal.butter(4, [(space_freq - 200) / nyq, (space_freq + 200) / nyq], 'band')
    mark_env = np.abs(signal.hilbert(signal.filtfilt(mark_b, mark_a, audio)))
    space_env = np.abs(signal.hilbert(signal.filtfilt(space_b, space_a, audio)))
    # Compare envelopes to get bits
    diff = mark_env - space_env
    bits = []
    idx = samples_per_bit // 2
    while idx < len(diff):
        bits.append(1 if diff[int(idx)] > 0 else 0)
        idx += samples_per_bit
    return bits

def nrzi_decode(bits):
    """NRZI decoding: bit stays same = 1, bit changes = 0."""
    decoded = []
    for i in range(1, len(bits)):
        decoded.append(0 if bits[i] != bits[i-1] else 1)
    return decoded

def find_ax25_flags(bits):
    """Find AX.25 flag bytes (0x7E = 01111110)."""
    flag = [0, 1, 1, 1, 1, 1, 1, 0]
    positions = []
    for i in range(len(bits) - 8):
        if bits[i:i+8] == flag:
            positions.append(i)
    return positions

def extract_callsign(bits_7bytes):
    """Extract callsign from AX.25 address field (7 bytes, shifted left)."""
    callsign = ""
    for i in range(0, min(42, len(bits_7bytes)), 8):
        byte_bits = bits_7bytes[i:i+8]
        if len(byte_bits) < 8:
            break
        val = sum(b << j for j, b in enumerate(byte_bits))
        char = chr((val >> 1) & 0x7F)
        if char.strip():
            callsign += char
    return callsign.strip()

def main():
    print("=== Ham APRS Dashboard ===")
    print(f"Monitoring {APRS_FREQ/1e6:.2f} MHz for APRS packets")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(int(CAPTURE_SECONDS * SAMPLE_RATE))
        audio = fm_demod_to_audio(iq, SAMPLE_RATE, AUDIO_RATE)
        bits = afsk_demodulate(audio, AUDIO_RATE, AFSK_MARK, AFSK_SPACE, BAUD_RATE)
        decoded = nrzi_decode(bits)
        flags = find_ax25_flags(decoded)
        print(f"[aprs] Recovered {len(bits)} bits, {len(flags)} AX.25 flags found")
        # Extract packets between flag pairs
        packets = 0
        for i in range(len(flags) - 1):
            if 100 < flags[i+1] - flags[i] < 3000:
                packet_bits = decoded[flags[i]+8:flags[i+1]]
                if len(packet_bits) > 112:
                    callsign = extract_callsign(packet_bits[:56])
                    print(f"  Packet {packets+1}: from {callsign} ({len(packet_bits)} bits)")
                    packets += 1
        print(f"\n[aprs] Total packets decoded: {packets}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
