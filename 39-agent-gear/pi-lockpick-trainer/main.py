#!/usr/bin/env python3
"""
Pi Lockpick Trainer
Electronic lock picking practice system using servo-controlled pin tumblers
and piezo feedback sensors. Tracks skill progression and timing.
"""

import os
import time
import json
import random
import logging
import threading
from datetime import datetime
from pathlib import Path

try:
    import RPi.GPIO as GPIO
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()

from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("lockpick-trainer")

app = Flask(__name__)

DATA_DIR = Path("/var/lib/lockpick-trainer")
DATA_DIR.mkdir(parents=True, exist_ok=True)

# --- GPIO Pin Map ---
SERVO_PINS = [12, 13, 18, 19, 26]  # 5 pin tumblers (PWM capable)
PIEZO_PINS = [5, 6, 16, 20, 21]     # Feedback sensors for each pin
TENSION_PIN = 4                      # Tension wrench sensor
SUCCESS_LED = 17
FAIL_LED = 27
BUZZER_PIN = 22


class PinTumbler:
    """Simulates a single pin tumbler with servo and sensor."""

    def __init__(self, servo_pin, sensor_pin, pin_index):
        self.servo_pin = servo_pin
        self.sensor_pin = sensor_pin
        self.index = pin_index
        self.set_height = 0        # Target height (0-9)
        self.current_height = 0    # Current position
        self.is_set = False        # Pin at shear line
        self.pwm = None

    def init_hardware(self):
        GPIO.setup(self.servo_pin, GPIO.OUT)
        GPIO.setup(self.sensor_pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        self.pwm = GPIO.PWM(self.servo_pin, 50)  # 50Hz servo PWM
        self.pwm.start(0)

    def set_difficulty(self, height):
        """Set pin height (difficulty position)."""
        self.set_height = height
        self.is_set = False
        # Move servo to represent pin height
        duty = 2.5 + (height / 9.0) * 10.0  # Map 0-9 to 2.5-12.5 duty
        if self.pwm:
            self.pwm.ChangeDutyCycle(duty)
            time.sleep(0.3)
            self.pwm.ChangeDutyCycle(0)

    def check_pick(self):
        """Check if pin is being picked (sensor feedback)."""
        if GPIO.input(self.sensor_pin):
            self.current_height += 1
            if self.current_height >= self.set_height:
                self.is_set = True
            return True
        return False

    def reset(self):
        self.current_height = 0
        self.is_set = False
        if self.pwm:
            self.pwm.ChangeDutyCycle(7.5)  # Center position
            time.sleep(0.2)
            self.pwm.ChangeDutyCycle(0)


class LockSimulator:
    """Full lock simulation with multiple pin tumblers."""

    def __init__(self, num_pins=5):
        self.num_pins = num_pins
        self.pins = []
        self.lock_open = False
        self.difficulty = "beginner"
        self.attempt_start = None
        self.attempts = []
        self.best_times = {"beginner": None, "intermediate": None, "advanced": None, "expert": None}
        self._setup_hardware()

    def _setup_hardware(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(TENSION_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        GPIO.setup(SUCCESS_LED, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(FAIL_LED, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(BUZZER_PIN, GPIO.OUT, initial=GPIO.LOW)

        for i in range(min(self.num_pins, len(SERVO_PINS))):
            pin = PinTumbler(SERVO_PINS[i], PIEZO_PINS[i], i)
            pin.init_hardware()
            self.pins.append(pin)

    def configure_lock(self, difficulty="beginner"):
        """Set up lock with difficulty-based pin configuration."""
        self.difficulty = difficulty
        self.lock_open = False

        difficulty_settings = {
            "beginner": {"pins": 2, "max_height": 3, "security_pins": 0},
            "intermediate": {"pins": 3, "max_height": 5, "security_pins": 0},
            "advanced": {"pins": 4, "max_height": 7, "security_pins": 1},
            "expert": {"pins": 5, "max_height": 9, "security_pins": 2},
        }
        settings = difficulty_settings.get(difficulty, difficulty_settings["beginner"])

        for pin in self.pins:
            pin.reset()

        active_pins = min(settings["pins"], len(self.pins))
        for i in range(active_pins):
            height = random.randint(1, settings["max_height"])
            self.pins[i].set_difficulty(height)

        logger.info("Lock configured: %s (%d pins, max height %d)",
                     difficulty, active_pins, settings["max_height"])
        return settings

    def start_attempt(self):
        """Begin a picking attempt."""
        self.attempt_start = time.time()
        self.lock_open = False
        for pin in self.pins:
            pin.is_set = False
            pin.current_height = 0
        GPIO.output(SUCCESS_LED, GPIO.LOW)
        GPIO.output(FAIL_LED, GPIO.LOW)
        return {"started": True, "difficulty": self.difficulty}

    def check_progress(self):
        """Check current picking progress."""
        if not self.attempt_start:
            return {"error": "No active attempt"}

        tension = GPIO.input(TENSION_PIN)
        pins_set = 0
        pin_status = []

        for pin in self.pins:
            if pin.set_height > 0:
                pin.check_pick()
                pin_status.append({
                    "pin": pin.index,
                    "target": pin.set_height,
                    "current": pin.current_height,
                    "set": pin.is_set,
                })
                if pin.is_set:
                    pins_set += 1

        total_active = sum(1 for p in self.pins if p.set_height > 0)
        elapsed = round(time.time() - self.attempt_start, 1)

        # Check if all pins are set (lock open)
        if pins_set == total_active and total_active > 0 and tension:
            self.lock_open = True
            GPIO.output(SUCCESS_LED, GPIO.HIGH)
            GPIO.output(BUZZER_PIN, GPIO.HIGH)
            time.sleep(0.3)
            GPIO.output(BUZZER_PIN, GPIO.LOW)

            attempt = {
                "difficulty": self.difficulty,
                "time_seconds": elapsed,
                "pins": total_active,
                "timestamp": datetime.utcnow().isoformat(),
                "success": True,
            }
            self.attempts.append(attempt)
            self._save_stats()

            # Update best time
            if self.best_times[self.difficulty] is None or elapsed < self.best_times[self.difficulty]:
                self.best_times[self.difficulty] = elapsed

        return {
            "pins": pin_status,
            "pins_set": pins_set,
            "total_pins": total_active,
            "tension_applied": tension,
            "lock_open": self.lock_open,
            "elapsed_seconds": elapsed,
        }

    def fail_attempt(self):
        """Record a failed attempt (overset or dropped pins)."""
        GPIO.output(FAIL_LED, GPIO.HIGH)
        elapsed = round(time.time() - self.attempt_start, 1) if self.attempt_start else 0
        attempt = {
            "difficulty": self.difficulty,
            "time_seconds": elapsed,
            "timestamp": datetime.utcnow().isoformat(),
            "success": False,
        }
        self.attempts.append(attempt)
        self._save_stats()
        threading.Timer(2.0, lambda: GPIO.output(FAIL_LED, GPIO.LOW)).start()
        return attempt

    def _save_stats(self):
        stats_file = DATA_DIR / "stats.json"
        stats = {
            "attempts": self.attempts[-100:],
            "best_times": self.best_times,
            "total_attempts": len(self.attempts),
            "success_rate": round(
                sum(1 for a in self.attempts if a["success"]) / max(len(self.attempts), 1) * 100, 1),
        }
        with open(stats_file, "w") as f:
            json.dump(stats, f, indent=2)

    def get_stats(self):
        total = len(self.attempts)
        successes = sum(1 for a in self.attempts if a["success"])
        return {
            "total_attempts": total,
            "successes": successes,
            "success_rate": round(successes / max(total, 1) * 100, 1),
            "best_times": self.best_times,
            "current_difficulty": self.difficulty,
            "lock_open": self.lock_open,
            "recent_attempts": self.attempts[-10:],
        }

    def cleanup(self):
        for pin in self.pins:
            if pin.pwm:
                pin.pwm.stop()
        GPIO.cleanup()


lock = LockSimulator()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Lockpick Trainer</title></head><body>
    <h1>Lockpick Trainer</h1>
    <select id="diff"><option>beginner</option><option>intermediate</option>
    <option>advanced</option><option>expert</option></select>
    <button onclick="fetch('/api/configure',{method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({difficulty:document.getElementById('diff').value})})">Configure</button>
    <button onclick="fetch('/api/start',{method:'POST'})">Start</button>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/progress').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),200);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(lock.get_stats())

@app.route("/api/configure", methods=["POST"])
def api_configure():
    diff = request.json.get("difficulty", "beginner")
    settings = lock.configure_lock(diff)
    return jsonify(settings)

@app.route("/api/start", methods=["POST"])
def api_start():
    return jsonify(lock.start_attempt())

@app.route("/api/progress")
def api_progress():
    return jsonify(lock.check_progress())

@app.route("/api/fail", methods=["POST"])
def api_fail():
    return jsonify(lock.fail_attempt())


if __name__ == "__main__":
    try:
        lock.configure_lock("beginner")
        logger.info("Starting Lockpick Trainer on port 8107")
        app.run(host="0.0.0.0", port=8107, debug=False)
    except KeyboardInterrupt:
        pass
    finally:
        lock.cleanup()
