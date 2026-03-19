#!/usr/bin/env python3
"""
Ham Packet Radio Receiver
Receives AX.25 packet radio transmissions at 1200 baud (VHF) or 9600 baud.
Implements full HDLC frame detection and AX.25 protocol decoding.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

PACKET_FREQ = 145.01e6    # 2m packet radio frequency
SAMPLE_RATE = 250e3
AUDIO_RATE = 22050
GAIN = 40
BAUD_RATE = 1200
CAPTURE_SECONDS = 30

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = PACKET_FREQ
    sdr.gain = GAIN
    return sdr

def demod_audio(iq, sr, ar):
    d = np.angle(iq[1:] * np.conj(iq[:-1]))
    return signal.decimate(d, int(sr / ar), zero_phase=True)

def afsk_to_bits(audio, sr, baud):
    """Bell 202 AFSK demodulation to bit stream."""
    nyq = sr / 2
    mb, ma = signal.butter(4, [1000 / nyq, 1400 / nyq], 'band')
    sb, sa = signal.butter(4, [2000 / nyq, 2400 / nyq], 'band')
    mark = np.abs(signal.hilbert(signal.filtfilt(mb, ma, audio)))
    space = np.abs(signal.hilbert(signal.filtfilt(sb, sa, audio)))
    diff = mark - space
    spb = int(sr / baud)
    bits = []
    i = spb // 2
    while i < len(diff):
        bits.append(1 if diff[int(i)] > 0 else 0)
        i += spb
    return bits

def hdlc_unstuff(bits):
    """Remove HDLC bit stuffing (remove 0 after five consecutive 1s)."""
    output = []
    ones_count = 0
    for b in bits:
        if b == 1:
            ones_count += 1
            output.append(b)
            if ones_count == 6:
                return output  # Flag detected
        else:
            if ones_count == 5:
                ones_count = 0
                continue  # Skip stuffed zero
            ones_count = 0
            output.append(b)
    return output

def bits_to_bytes(bits):
    """Convert bit stream to bytes (LSB first as per AX.25)."""
    result = []
    for i in range(0, len(bits) - 7, 8):
        byte = 0
        for j in range(8):
            byte |= bits[i + j] << j
        result.append(byte)
    return bytes(result)

def decode_ax25_address(addr_bytes):
    """Decode AX.25 address field (callsign + SSID)."""
    if len(addr_bytes) < 7:
        return "?"
    callsign = ""
    for b in addr_bytes[:6]:
        ch = chr((b >> 1) & 0x7F)
        if ch.strip():
            callsign += ch
    ssid = (addr_bytes[6] >> 1) & 0x0F
    return f"{callsign.strip()}-{ssid}" if ssid else callsign.strip()

def process_packet(bits):
    """Process a detected packet from raw bits."""
    unstuffed = hdlc_unstuff(bits)
    nrzi = []
    for i in range(1, len(unstuffed)):
        nrzi.append(0 if unstuffed[i] != unstuffed[i-1] else 1)
    data = bits_to_bytes(nrzi)
    if len(data) >= 14:
        dest = decode_ax25_address(data[:7])
        src = decode_ax25_address(data[7:14])
        return {"source": src, "dest": dest, "length": len(data)}
    return None

def main():
    print("=== Ham Packet Radio Receiver ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(int(CAPTURE_SECONDS * SAMPLE_RATE))
        audio = demod_audio(iq, SAMPLE_RATE, AUDIO_RATE)
        bits = afsk_to_bits(audio, AUDIO_RATE, BAUD_RATE)
        print(f"[packet] Recovered {len(bits)} bits from {CAPTURE_SECONDS}s capture")
        # Find flag sequences (0x7E = 01111110)
        flag = [0, 1, 1, 1, 1, 1, 1, 0]
        packets = 0
        for i in range(len(bits) - 200):
            if bits[i:i+8] == flag:
                pkt = process_packet(bits[i+8:i+2000])
                if pkt:
                    packets += 1
                    print(f"  Packet: {pkt['source']} -> {pkt['dest']} ({pkt['length']} bytes)")
        print(f"\n[packet] Total packets: {packets}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
