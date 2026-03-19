#!/usr/bin/env python3
"""
HackRF Pager Decoder (POCSAG)
Receives and decodes POCSAG pager signals on common paging frequencies.
Demodulates FSK, recovers bit stream, and parses POCSAG frames to
extract RIC addresses and alphanumeric messages.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time

# --- Configuration ---
PAGER_FREQ = 152.48e6     # Common POCSAG paging frequency (region-dependent)
SAMPLE_RATE = 1.2e6       # 1.2 MSPS
GAIN = 42
POCSAG_RATE = 1200        # POCSAG baud rate (512, 1200, or 2400)
FSK_DEVIATION = 4500      # FSK deviation in Hz

def configure_sdr():
    """Initialize RTL-SDR for pager frequency reception."""
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = PAGER_FREQ
    sdr.gain = GAIN
    return sdr

def bandpass_filter(iq_samples, sample_rate, low_cut, high_cut, order=5):
    """Apply bandpass filter around the pager signal."""
    nyq = sample_rate / 2
    b, a = signal.butter(order, [low_cut / nyq, high_cut / nyq], btype='band')
    return signal.filtfilt(b, a, iq_samples)

def fsk_demodulate(iq_samples, sample_rate):
    """Demodulate FSK by computing instantaneous frequency."""
    analytic = iq_samples
    inst_phase = np.unwrap(np.angle(analytic))
    inst_freq = np.diff(inst_phase) / (2.0 * np.pi) * sample_rate
    return inst_freq

def clock_recovery(demod, sample_rate, baud_rate):
    """Simple clock recovery: sample at baud rate intervals."""
    samples_per_bit = sample_rate / baud_rate
    bits = []
    idx = 0.0
    while int(idx) < len(demod):
        sample_val = demod[int(idx)]
        bits.append(1 if sample_val > 0 else 0)
        idx += samples_per_bit
    return bits

def find_pocsag_sync(bits):
    """Search for POCSAG sync codeword: 0x7CD215D8."""
    sync_pattern = [0,1,1,1,1,1,0,0,1,1,0,1,0,0,1,0,
                    0,0,0,1,0,1,0,1,1,1,0,1,1,0,0,0]
    for i in range(len(bits) - 32):
        if bits[i:i+32] == sync_pattern:
            return i
    return -1

def decode_pocsag_codeword(bits_32):
    """Decode a single POCSAG 32-bit codeword."""
    if len(bits_32) < 32:
        return None
    is_message = bits_32[0] == 1
    if not is_message:
        # Address codeword
        address_bits = bits_32[1:19]
        func_bits = bits_32[19:21]
        addr = 0
        for b in address_bits:
            addr = (addr << 1) | b
        func = (func_bits[0] << 1) | func_bits[1]
        return {"type": "address", "ric": addr * 8 + func, "function": func}
    else:
        # Message codeword (20 data bits)
        data_bits = bits_32[1:21]
        return {"type": "message", "data_bits": data_bits}

def bits_to_ascii(all_data_bits):
    """Convert POCSAG data bits to ASCII text (7-bit characters)."""
    text = ""
    for i in range(0, len(all_data_bits) - 6, 7):
        char_bits = all_data_bits[i:i+7]
        # POCSAG uses bit-reversed character encoding
        char_val = 0
        for j, b in enumerate(char_bits):
            char_val |= b << j
        if 32 <= char_val < 127:
            text += chr(char_val)
    return text

def process_pager_stream(sdr, duration_sec=30):
    """Capture and decode POCSAG messages."""
    total_samples = int(duration_sec * SAMPLE_RATE)
    print(f"[pager] Capturing {duration_sec}s at {PAGER_FREQ/1e6:.2f} MHz...")
    iq = sdr.read_samples(total_samples)

    # Bandpass filter around expected signal
    filtered = bandpass_filter(iq, SAMPLE_RATE, 500, FSK_DEVIATION * 2)

    # FSK demodulate
    demod = fsk_demodulate(filtered, SAMPLE_RATE)
    print(f"[pager] Demodulated {len(demod)} samples")

    # Clock recovery
    bits = clock_recovery(demod, SAMPLE_RATE - 1, POCSAG_RATE)
    print(f"[pager] Recovered {len(bits)} bits")

    # Find sync and decode
    sync_pos = find_pocsag_sync(bits)
    messages = []
    if sync_pos >= 0:
        print(f"[pager] POCSAG sync found at bit {sync_pos}")
        pos = sync_pos + 32  # Skip sync word
        current_addr = None
        msg_bits = []
        for batch in range(8):  # 8 frames per batch
            for frame in range(2):  # 2 codewords per frame
                if pos + 32 > len(bits):
                    break
                cw = decode_pocsag_codeword(bits[pos:pos+32])
                if cw and cw["type"] == "address":
                    if msg_bits and current_addr:
                        text = bits_to_ascii(msg_bits)
                        messages.append({"ric": current_addr, "text": text})
                    current_addr = cw["ric"]
                    msg_bits = []
                elif cw and cw["type"] == "message":
                    msg_bits.extend(cw["data_bits"])
                pos += 32
    else:
        print("[pager] No POCSAG sync found in capture")

    return messages

def main():
    print("=== HackRF POCSAG Pager Decoder ===")
    sdr = configure_sdr()
    try:
        messages = process_pager_stream(sdr, duration_sec=30)
        print(f"\n[pager] Decoded {len(messages)} messages:")
        for msg in messages:
            print(f"  RIC {msg['ric']:07d}: {msg['text']}")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
