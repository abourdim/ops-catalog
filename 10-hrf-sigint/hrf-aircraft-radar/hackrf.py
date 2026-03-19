#!/usr/bin/env python3
"""
HackRF Aircraft Radar / ADS-B Receiver
Receives 1090 MHz ADS-B transponder signals from aircraft.
Demodulates Mode S messages, extracts ICAO addresses, positions,
altitudes, and callsigns from overhead aircraft.
"""

import numpy as np
from rtlsdr import RtlSdr
import time

# --- Configuration ---
ADSB_FREQ = 1090e6        # ADS-B frequency
SAMPLE_RATE = 2.4e6       # 2.4 MSPS (oversample for better timing)
GAIN = 49.6
ADSB_RATE = 2e6           # ADS-B data rate: 2 Mbps
PREAMBLE_US = 8.0         # Preamble duration in microseconds
MSG_BITS = 112            # Long Mode S message length

def configure_sdr():
    """Initialize RTL-SDR for 1090 MHz ADS-B reception."""
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = ADSB_FREQ
    sdr.gain = GAIN
    return sdr

def detect_preamble(magnitude, idx, samples_per_us):
    """Check for ADS-B preamble pattern at given index."""
    # Preamble: pulses at 0, 1, 3.5, 4.5 microseconds
    spu = samples_per_us
    positions = [0, int(1 * spu), int(3.5 * spu), int(4.5 * spu)]
    quiet = [int(2 * spu), int(2.5 * spu), int(5.5 * spu), int(6 * spu)]
    try:
        high_avg = np.mean([magnitude[idx + p] for p in positions])
        low_avg = np.mean([magnitude[idx + q] for q in quiet])
        return high_avg > 2 * low_avg and high_avg > 0.05
    except IndexError:
        return False

def extract_bits(magnitude, start_idx, num_bits, samples_per_bit):
    """Extract message bits using amplitude comparison (PPM decoding)."""
    bits = []
    for i in range(num_bits):
        pos = start_idx + int(i * samples_per_bit)
        half = int(samples_per_bit / 2)
        try:
            first_half = magnitude[pos]
            second_half = magnitude[pos + half]
            bits.append(1 if first_half > second_half else 0)
        except IndexError:
            bits.append(0)
    return bits

def compute_crc(bits):
    """Compute CRC-24 for Mode S message validation."""
    generator = 0xFFF409
    n_bytes = len(bits) // 8
    msg_int = 0
    for b in bits:
        msg_int = (msg_int << 1) | b
    for i in range(len(bits) - 24):
        if msg_int & (1 << (len(bits) - 1 - i)):
            msg_int ^= generator << (len(bits) - 25 - i)
    return msg_int & 0xFFFFFF

def decode_icao(bits):
    """Extract ICAO 24-bit address from Mode S message."""
    icao = 0
    for i in range(8, 32):
        icao = (icao << 1) | bits[i]
    return f"{icao:06X}"

def decode_callsign(bits):
    """Decode aircraft callsign from ADS-B identification message."""
    charset = "?ABCDEFGHIJKLMNOPQRSTUVWXYZ????? ???????????????0123456789??????"
    callsign = ""
    for i in range(8):
        idx = 0
        for j in range(6):
            idx = (idx << 1) | bits[40 + i * 6 + j]
        if idx < len(charset):
            callsign += charset[idx]
    return callsign.strip()

def decode_altitude(bits):
    """Decode altitude from ADS-B airborne position message."""
    alt_bits = bits[40:52]
    alt_code = 0
    for b in alt_bits:
        alt_code = (alt_code << 1) | b
    # Simplified: Q-bit altitude encoding
    if alt_bits[7]:  # Q bit set
        n = (alt_code >> 1) & 0x7F0 | (alt_code & 0x0F)
        altitude = n * 25 - 1000
    else:
        altitude = 0
    return altitude

def process_adsb_stream(sdr, duration_sec=30):
    """Capture and decode ADS-B messages."""
    samples_per_us = SAMPLE_RATE / 1e6
    samples_per_bit = SAMPLE_RATE / ADSB_RATE
    preamble_samples = int(8 * samples_per_us)
    msg_samples = int(MSG_BITS * samples_per_bit)
    aircraft = {}

    print(f"[adsb] Listening for {duration_sec}s at {ADSB_FREQ/1e6:.0f} MHz...")
    start = time.time()
    msg_count = 0

    while time.time() - start < duration_sec:
        iq = sdr.read_samples(262144)
        mag = np.abs(iq)
        for idx in range(len(mag) - preamble_samples - msg_samples):
            if detect_preamble(mag, idx, samples_per_us):
                bit_start = idx + preamble_samples
                bits = extract_bits(mag, bit_start, MSG_BITS, samples_per_bit)
                crc = compute_crc(bits)
                if crc == 0:
                    icao = decode_icao(bits)
                    df = (bits[0] << 4) | (bits[1] << 3) | (bits[2] << 2) | (bits[3] << 1) | bits[4]
                    msg_count += 1
                    if icao not in aircraft:
                        aircraft[icao] = {"count": 0}
                    aircraft[icao]["count"] += 1
                    if df == 17:
                        tc = (bits[32] << 4) | (bits[33] << 3) | (bits[34] << 2) | (bits[35] << 1) | bits[36]
                        if 1 <= tc <= 4:
                            aircraft[icao]["callsign"] = decode_callsign(bits)
                    print(f"  MSG #{msg_count}: ICAO={icao} DF={df}")

    return aircraft, msg_count

def main():
    print("=== HackRF ADS-B Aircraft Radar ===")
    sdr = configure_sdr()
    try:
        aircraft, total = process_adsb_stream(sdr, duration_sec=30)
        print(f"\n[adsb] {total} valid messages | {len(aircraft)} unique aircraft")
        for icao, info in aircraft.items():
            cs = info.get("callsign", "?")
            print(f"  {icao}: msgs={info['count']} callsign={cs}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
