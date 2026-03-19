#!/usr/bin/env python3
"""SDR AIS Maritime Receiver - Decodes Automatic Identification System ship transponders."""
import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

AIS_CH1 = 161.975e6
AIS_CH2 = 162.025e6
SAMPLE_RATE = 250e3
GAIN = 42
AIS_BAUD = 9600
CAPTURE_SECONDS = 30

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = AIS_CH1
    sdr.gain = GAIN
    return sdr

def gmsk_demodulate(iq, sr, baud):
    inst_freq = np.diff(np.unwrap(np.angle(iq))) * sr / (2 * np.pi)
    spb = int(sr / baud)
    bits = []
    for i in range(spb // 2, len(inst_freq), spb):
        bits.append(1 if inst_freq[int(i)] > 0 else 0)
    return bits

def nrzi_decode(bits):
    decoded = []
    for i in range(1, len(bits)):
        decoded.append(0 if bits[i] != bits[i - 1] else 1)
    return decoded

def find_ais_packets(bits):
    flag = [0, 1, 1, 1, 1, 1, 1, 0]
    packets = []
    for i in range(len(bits) - 200):
        if bits[i:i + 8] == flag:
            for j in range(i + 8, min(i + 500, len(bits) - 8)):
                if bits[j:j + 8] == flag:
                    packets.append(bits[i + 8:j])
                    break
    return packets

def main():
    print("=== SDR AIS Maritime Receiver ===")
    sdr = configure_sdr()
    try:
        for ch_name, ch_freq in [("AIS-1", AIS_CH1), ("AIS-2", AIS_CH2)]:
            sdr.center_freq = ch_freq
            time.sleep(0.03)
            iq = sdr.read_samples(int(CAPTURE_SECONDS * SAMPLE_RATE))
            bits = gmsk_demodulate(iq, SAMPLE_RATE, AIS_BAUD)
            decoded = nrzi_decode(bits)
            packets = find_ais_packets(decoded)
            print(f"[ais] {ch_name}: {len(bits)} bits, {len(packets)} packets")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
