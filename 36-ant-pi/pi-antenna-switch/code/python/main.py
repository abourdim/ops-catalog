#!/usr/bin/env python3
"""
Pi Antenna Switch
📡 switch · 🔌 connect · 🎛️ control

Workshop-DIY Educational Project

Process:
    Step 1: Wire up sensors, displays, or radio modules to the Raspberry Pi GPIO pins.
    Step 2: Install libraries and configure the Python script for your hardware setup.
    Step 3: Read sensor data in real time and process it through your algorithms.
    Step 4: Trigger actions based on data thresholds and log results for analysis.

Usage:
    python3 main.py

Requirements:
    pip install -r requirements.txt (if present)
"""

import time
try:
    import RPi.GPIO as GPIO
    HAS_GPIO = True
except ImportError:
    HAS_GPIO = False
    print("[WARN] RPi.GPIO not available. Running in simulation mode.")

# ── GPIO Configuration ──
LED_PIN = 17
SENSOR_PIN = 27
BUZZER_PIN = 22

APP_NAME = "pi-antenna-switch"


def setup():
    """Initialize hardware/simulation."""
    print(f"\n=== {APP_NAME} ===")
    print("Workshop-DIY — Educational Simulation\n")

    if HAS_GPIO:
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(LED_PIN, GPIO.OUT)
        GPIO.setup(SENSOR_PIN, GPIO.IN)
        print("[GPIO] Pins configured")
    else:
        print("[SIM] GPIO simulation mode...")


def read_data():
    """Read sensor/signal data."""

    if HAS_GPIO:
        value = GPIO.input(SENSOR_PIN)
    else:
        import random
        value = random.randint(0, 1)
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
