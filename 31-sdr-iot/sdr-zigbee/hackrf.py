#!/usr/bin/env python3
"""SDR Zigbee Monitor - Detects Zigbee/802.15.4 traffic on 868/915 MHz bands."""
import numpy as np, scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

ZIGBEE_FREQ = 868.3e6  # EU Zigbee channel
SAMPLE_RATE = 2.4e6
GAIN = 44
CAPTURE_SEC = 20

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = ZIGBEE_FREQ
    sdr.gain = GAIN
    return sdr

def detect_zigbee_packets(iq, sr):
    chunk = int(sr * 0.001)  # 1ms chunks
    powers = [np.mean(np.abs(iq[i:i+chunk]) ** 2) for i in range(0, len(iq) - chunk, chunk)]
    powers_db = 10 * np.log10(np.array(powers) + 1e-12)
    noise = np.median(powers_db)
    packets = []
    in_pkt = False
    start = 0
    for i, p in enumerate(powers_db):
        if p > noise + 8 and not in_pkt:
            start = i
            in_pkt = True
        elif p <= noise + 4 and in_pkt:
            dur_ms = (i - start)
            if 0.5 < dur_ms < 50:  # Zigbee packet duration range
                packets.append({"start_ms": start, "duration_ms": dur_ms,
                               "power_db": round(float(np.max(powers_db[start:i])), 1)})
            in_pkt = False
    return packets

def main():
    print("=== SDR Zigbee Monitor ===")
    sdr = configure_sdr()
    try:
        iq = sdr.read_samples(int(CAPTURE_SEC * SAMPLE_RATE))
        packets = detect_zigbee_packets(iq, SAMPLE_RATE)
        print(f"[zigbee] Detected {len(packets)} Zigbee-like packets in {CAPTURE_SEC}s")
        for p in packets[:10]:
            print(f"  t={p['start_ms']}ms dur={p['duration_ms']}ms pwr={p['power_db']:.1f}dB")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
