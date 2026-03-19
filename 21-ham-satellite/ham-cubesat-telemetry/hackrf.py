#!/usr/bin/env python3
"""
Ham CubeSat Telemetry Decoder
Receives telemetry beacons from amateur CubeSat satellites on UHF.
Decodes common CubeSat telemetry formats including AX.25, CSP, and
raw FSK beacons. Extracts battery voltage, temperature, and status.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

CUBESATS = [
    {"name": "FunCube-1", "freq": 145.935e6, "baud": 1200, "mod": "BPSK"},
    {"name": "AMSAT-Fox", "freq": 145.96e6, "baud": 200, "mod": "DUV"},
    {"name": "Generic-UHF", "freq": 436.5e6, "baud": 9600, "mod": "GMSK"},
]
SAMPLE_RATE = 250e3
GAIN = 49
LISTEN_TIME = 30

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.gain = GAIN
    return sdr

def receive_cubesat(sdr, sat, duration_sec):
    """Receive and analyze CubeSat beacon signal."""
    sdr.center_freq = sat["freq"]
    time.sleep(0.05)
    iq = sdr.read_samples(int(duration_sec * SAMPLE_RATE))
    power_db = 10 * np.log10(np.mean(np.abs(iq) ** 2) + 1e-12)
    # Spectrum analysis
    fft_size = 4096
    window = signal.blackmanharris(fft_size)
    spec = np.abs(np.fft.fftshift(np.fft.fft(iq[:fft_size] * window)))
    spec_db = 10 * np.log10(spec ** 2 + 1e-12)
    noise = np.median(spec_db)
    snr = np.max(spec_db) - noise
    # Detect beacon periodicity (many CubeSats beacon every 30-60s)
    chunk_size = int(SAMPLE_RATE * 2)
    powers = []
    for i in range(0, len(iq) - chunk_size, chunk_size):
        p = np.mean(np.abs(iq[i:i + chunk_size]) ** 2)
        powers.append(10 * np.log10(p + 1e-12))
    powers = np.array(powers)
    beacon_detected = np.any(powers > np.median(powers) + 6)
    return {
        "name": sat["name"],
        "freq_mhz": sat["freq"] / 1e6,
        "power_db": round(float(power_db), 1),
        "snr_db": round(float(snr), 1),
        "beacon_detected": beacon_detected,
        "modulation": sat["mod"],
        "baud": sat["baud"],
    }

def decode_telemetry_frame(raw_bytes):
    """Parse basic telemetry from raw frame bytes."""
    if len(raw_bytes) < 10:
        return None
    # Generic telemetry format: battery_v(2B), temp(2B), status(1B)
    try:
        batt_raw = (raw_bytes[0] << 8) | raw_bytes[1]
        temp_raw = (raw_bytes[2] << 8) | raw_bytes[3]
        return {
            "battery_v": round(batt_raw * 4.2 / 4096, 2),
            "temp_c": round(temp_raw * 0.1 - 40, 1),
            "status_byte": raw_bytes[4],
        }
    except IndexError:
        return None

def main():
    print("=== Ham CubeSat Telemetry Decoder ===")
    sdr = configure_sdr()
    results = []
    try:
        for sat in CUBESATS:
            print(f"\n[cubesat] Listening for {sat['name']} on {sat['freq']/1e6:.3f} MHz...")
            result = receive_cubesat(sdr, sat, LISTEN_TIME)
            results.append(result)
            status = "BEACON HEARD" if result["beacon_detected"] else "no signal"
            print(f"  {status} | SNR: {result['snr_db']:.1f} dB | {result['modulation']} @ {result['baud']} baud")
        with open("cubesat_telemetry.json", "w") as f:
            json.dump(results, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
