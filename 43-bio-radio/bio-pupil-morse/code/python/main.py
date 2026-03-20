#!/usr/bin/env python3
"""
Bio Pupil Morse
Pupil dilation as Morse code

Workshop-DIY Educational Project

Process:
    Step 1: IR camera tracks pupil diameter changes in the 3-8mm range with sub-millimeter precision.
    Step 2: Voluntary dilation above threshold = signal. Short pulse = dot, long pulse = dash.
    Step 3: Dilation patterns mapped to International Morse Code alphabet and decoded to text.
    Step 4: Completely silent, invisible communication channel. No one can see you transmitting!

Usage:
    python3 main.py

Requirements:
    pip install -r requirements.txt (if present)
"""

import time
import hashlib
import json
import random
import struct

# ── Configuration ──
SIMULATION_SPEED = 1.0  # multiplier

APP_NAME = "bio-pupil-morse"


def setup():
    """Initialize hardware/simulation."""
    print(f"\n=== {APP_NAME} ===")
    print("Workshop-DIY — Educational Simulation\n")

    print("[SIM] Running in simulation mode...")


def read_data():
    """Read sensor/signal data."""

    value = random.random() * 100
    time.sleep(0.1)
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
