#!/usr/bin/env python3
"""SDR Radiosonde Receiver - Decodes weather balloon telemetry on 400-406 MHz."""
import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time, json

SONDE_FREQ = 403e6  # Common Vaisala RS41 frequency
SAMPLE_RATE = 250e3
GAIN = 44
RS41_BAUD = 4800
CAPTURE_SECONDS = 30

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = SONDE_FREQ
    sdr.gain = GAIN
    return sdr

def detect_sonde_signal(sdr, scan_start=400e6, scan_end=406e6):
    best_freq = None
    best_power = -100
    freq = scan_start + SAMPLE_RATE / 2
    while freq < scan_end:
        sdr.center_freq = freq
        time.sleep(0.01)
        iq = sdr.read_samples(2048)
        power = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
        if power > best_power:
            best_power = power
            best_freq = freq
        freq += SAMPLE_RATE * 0.5
    return best_freq, best_power

def receive_sonde_data(sdr, duration_sec):
    iq = sdr.read_samples(int(duration_sec * SAMPLE_RATE))
    demod = np.angle(iq[1:] * np.conj(iq[:-1]))
    # Detect data bursts
    envelope = np.abs(signal.hilbert(demod))
    threshold = np.mean(envelope) + 2 * np.std(envelope)
    above = envelope > threshold
    burst_count = np.sum(np.diff(above.astype(int)) == 1)
    return {"samples": len(iq), "burst_count": int(burst_count),
            "power_db": round(10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12), 1)}

def main():
    print("=== SDR Radiosonde Receiver ===")
    sdr = configure_sdr()
    try:
        print("[sonde] Scanning 400-406 MHz for radiosondes...")
        freq, power = detect_sonde_signal(sdr)
        print(f"[sonde] Strongest signal: {freq/1e6:.3f} MHz ({power:.1f} dB)")
        sdr.center_freq = freq
        result = receive_sonde_data(sdr, CAPTURE_SECONDS)
        print(f"[sonde] {result}")
        iq = sdr.read_samples(int(5 * SAMPLE_RATE))
        iq.astype(np.complex64).tofile("radiosonde_capture.iq")
        print("[sonde] Saved capture for rs41 decoder")
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
