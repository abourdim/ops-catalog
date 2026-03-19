#!/usr/bin/env python3
"""
HackRF Direction Finder
Radio direction finding (RDF) using signal strength measurements from
multiple antenna positions. Implements power-based triangulation to
estimate transmitter bearing using sequential measurements.
"""

import numpy as np
import scipy.signal as signal
from rtlsdr import RtlSdr
import time
import json

# --- Configuration ---
TARGET_FREQ = 446.0e6     # PMR446 frequency to locate
SAMPLE_RATE = 1.0e6
FFT_SIZE = 1024
GAIN = 40
MEASUREMENTS_PER_BEARING = 10
NUM_BEARINGS = 8           # Rotate antenna to 8 positions (every 45 degrees)

def configure_sdr():
    sdr = RtlSdr()
    sdr.sample_rate = SAMPLE_RATE
    sdr.center_freq = TARGET_FREQ
    sdr.gain = GAIN
    return sdr

def measure_signal_strength(sdr, num_measurements, fft_size):
    """Take multiple RSSI measurements and return statistics."""
    readings = []
    for _ in range(num_measurements):
        iq = sdr.read_samples(fft_size)
        power = np.mean(np.abs(iq) ** 2)
        power_db = 10 * np.log10(power + 1e-12)
        readings.append(float(power_db))
        time.sleep(0.05)
    return {
        "mean_db": round(np.mean(readings), 2),
        "max_db": round(np.max(readings), 2),
        "min_db": round(np.min(readings), 2),
        "std_db": round(np.std(readings), 3),
    }

def compute_bearing(measurements):
    """Compute estimated bearing from power measurements at different angles."""
    angles = np.array([m["angle_deg"] for m in measurements])
    powers = np.array([m["rssi"]["mean_db"] for m in measurements])
    # Weight angles by linear power
    powers_linear = 10 ** (powers / 10)
    # Circular mean weighted by power
    x_sum = np.sum(powers_linear * np.cos(np.radians(angles)))
    y_sum = np.sum(powers_linear * np.sin(np.radians(angles)))
    bearing = np.degrees(np.arctan2(y_sum, x_sum)) % 360
    # Confidence based on directivity
    total_power = np.sum(powers_linear)
    max_power = np.max(powers_linear)
    confidence = max_power / (total_power + 1e-12)
    return round(float(bearing), 1), round(float(confidence), 3)

def measure_signal_bandwidth(sdr, fft_size):
    """Estimate the target signal bandwidth."""
    iq = sdr.read_samples(fft_size * 4)
    window = signal.blackmanharris(fft_size)
    spec = np.fft.fftshift(np.fft.fft(iq[:fft_size] * window))
    psd_db = 10 * np.log10(np.abs(spec) ** 2 + 1e-12)
    peak = np.max(psd_db)
    bw_mask = psd_db > peak - 6  # -6 dB bandwidth
    bw_hz = np.sum(bw_mask) * (SAMPLE_RATE / fft_size)
    return round(float(bw_hz), 0)

def run_direction_finding(sdr, num_bearings, measurements_per):
    """Interactive direction finding: user rotates antenna at each step."""
    measurements = []
    angle_step = 360.0 / num_bearings
    print(f"[df] Direction finding on {TARGET_FREQ/1e6:.4f} MHz")
    print(f"[df] {num_bearings} positions, {angle_step:.0f} degrees apart")

    for i in range(num_bearings):
        angle = i * angle_step
        print(f"\n  Position {i+1}/{num_bearings}: Point antenna at {angle:.0f} degrees")
        print(f"  (Simulating antenna rotation - in practice, rotate physical antenna)")
        time.sleep(0.5)  # In real use, wait for user to rotate
        rssi = measure_signal_strength(sdr, measurements_per, FFT_SIZE)
        measurements.append({"angle_deg": angle, "rssi": rssi})
        print(f"  RSSI: {rssi['mean_db']:.1f} dB (std: {rssi['std_db']:.3f})")

    bearing, confidence = compute_bearing(measurements)
    bw = measure_signal_bandwidth(sdr, FFT_SIZE)
    return bearing, confidence, bw, measurements

def main():
    print("=== HackRF Direction Finder ===")
    sdr = configure_sdr()
    try:
        bearing, confidence, bw, measurements = run_direction_finding(
            sdr, NUM_BEARINGS, MEASUREMENTS_PER_BEARING)
        print(f"\n[df] Estimated bearing: {bearing:.1f} degrees")
        print(f"[df] Confidence: {confidence:.1%}")
        print(f"[df] Signal bandwidth: {bw:.0f} Hz")
        result = {"bearing_deg": bearing, "confidence": confidence,
                  "bandwidth_hz": bw, "measurements": measurements}
        with open("direction_finder_result.json", "w") as f:
            json.dump(result, f, indent=2)
    finally:
        sdr.close()

if __name__ == "__main__":
    main()
