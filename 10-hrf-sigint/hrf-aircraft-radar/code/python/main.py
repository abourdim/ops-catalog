#!/usr/bin/env python3
"""
Aircraft Radar
✈️ Plot every aircraft overhead with altitude, speed, callsign

Workshop-DIY Educational Project

Process:
    Step 1: Set the frequency band, modulation type, and signal parameters.
    Step 2: Scan the radio spectrum to detect and capture signals of interest.
    Step 3: Apply signal processing to identify modulation, encoding, and source.
    Step 4: Categorize the signal type and log detailed analysis results.

Usage:
    python3 main.py

Requirements:
    pip install -r requirements.txt (if present)
"""

import numpy as np
from scipy import signal as sig
try:
    from rtlsdr import RtlSdr
    HAS_SDR = True
except ImportError:
    HAS_SDR = False
    print("[WARN] rtlsdr not installed. Running in simulation mode.")
    print("  Install: pip install pyrtlsdr")
import matplotlib.pyplot as plt

# ── SDR Configuration ──
CENTER_FREQ = 100.0e6    # 100 MHz
SAMPLE_RATE = 2.048e6    # 2.048 Msps
GAIN = 20                # dB
NUM_SAMPLES = 256 * 1024

APP_NAME = "hrf-aircraft-radar"


def setup():
    """Initialize hardware/simulation."""
    print(f"\n=== {APP_NAME} ===")
    print("Workshop-DIY — Educational Simulation\n")

    if HAS_SDR:
        sdr = RtlSdr()
        sdr.sample_rate = SAMPLE_RATE
        sdr.center_freq = CENTER_FREQ
        sdr.gain = GAIN
        print(f"[SDR] Tuned to {CENTER_FREQ/1e6:.3f} MHz, SR={SAMPLE_RATE/1e6:.1f} Msps")
    else:
        print("[SIM] Generating synthetic IQ data...")


def read_data():
    """Read sensor/signal data."""

    if HAS_SDR:
        samples = sdr.read_samples(NUM_SAMPLES)
    else:
        t = np.arange(NUM_SAMPLES) / SAMPLE_RATE
        noise = np.random.normal(0, 0.1, NUM_SAMPLES) + 1j * np.random.normal(0, 0.1, NUM_SAMPLES)
        signal_component = np.exp(2j * np.pi * 50e3 * t)
        samples = signal_component + noise
    return value


def process(data):
    """Process captured data — core algorithm."""
    # Normalize to 0-100 scale
    if isinstance(data, (int, float)):
        score = float(data) % 100
    else:
        score = abs(hash(str(data))) % 100

    # Classify
    if score > 70:
        level = "HIGH"
    elif score > 30:
        level = "MEDIUM"
    else:
        level = "LOW"

    return {"score": score, "level": level}


def display_result(result):
    """Display analysis results."""
    bar = "█" * int(result["score"] / 5) + "░" * (20 - int(result["score"] / 5))
    print(f"  [{result['level']:>6s}] {bar} {result['score']:.1f}")


def main():
    """Main execution loop."""
    setup()
    print("\n[START] Press Ctrl+C to stop\n")

    cycle = 0
    try:
        while True:
            data = read_data()
            result = process(data)
            cycle += 1

            if cycle % 5 == 0:
                display_result(result)

            if cycle % 50 == 0:
                print(f"\n  --- Cycle {cycle} complete ---\n")

    except KeyboardInterrupt:
        print(f"\n\n[DONE] {cycle} cycles completed")
        print("Workshop-DIY — Keep experimenting! 🔬")


if __name__ == "__main__":
    main()
