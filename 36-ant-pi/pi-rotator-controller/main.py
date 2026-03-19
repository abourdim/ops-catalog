#!/usr/bin/env python3
"""
Pi Rotator Controller
Controls antenna rotator motors via GPIO H-bridge and reads azimuth
from ADC potentiometer feedback. Supports preset positions and tracking.
"""

import os
import time
import math
import json
import logging
import threading
from flask import Flask, jsonify, request, render_template_string

try:
    import RPi.GPIO as GPIO
    import spidev
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()
    spidev = MagicMock()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("rotator")

app = Flask(__name__)

# --- Pin Configuration ---
MOTOR_CW_PIN = 17      # H-bridge input A (clockwise)
MOTOR_CCW_PIN = 27     # H-bridge input B (counter-clockwise)
MOTOR_ENABLE_PIN = 22  # H-bridge enable (PWM speed control)
BRAKE_PIN = 5          # Electromagnetic brake release
LIMIT_CW_PIN = 6       # Clockwise limit switch
LIMIT_CCW_PIN = 13     # Counter-clockwise limit switch
SPI_CHANNEL = 0        # MCP3008 ADC channel for azimuth pot

# Calibration: ADC values for 0 and 360 degrees
ADC_MIN = 50
ADC_MAX = 980
DEADBAND_DEG = 2.0
MOTOR_SPEED = 75  # PWM duty cycle percent


class RotatorController:
    """Controls azimuth antenna rotator with position feedback."""

    def __init__(self):
        self.target_azimuth = 0.0
        self.current_azimuth = 0.0
        self.rotating = False
        self.direction = None  # "CW" or "CCW"
        self.presets = {"North": 0, "East": 90, "South": 180, "West": 270}
        self.tracking_target = None
        self.lock = threading.Lock()
        self.pwm = None
        self.spi = None
        self._setup_hardware()

    def _setup_hardware(self):
        """Initialize GPIO and SPI for motor control and position sensing."""
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)

        # Motor control pins
        GPIO.setup(MOTOR_CW_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(MOTOR_CCW_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(MOTOR_ENABLE_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(BRAKE_PIN, GPIO.OUT, initial=GPIO.LOW)

        # Limit switches with pull-ups
        GPIO.setup(LIMIT_CW_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.setup(LIMIT_CCW_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

        # PWM for speed control
        self.pwm = GPIO.PWM(MOTOR_ENABLE_PIN, 1000)
        self.pwm.start(0)

        # SPI for ADC azimuth reading
        try:
            self.spi = spidev.SpiDev()
            self.spi.open(0, 0)
            self.spi.max_speed_hz = 1000000
        except Exception as e:
            logger.warning("SPI init failed: %s", e)
            self.spi = None

        logger.info("Rotator hardware initialized")

    def read_azimuth(self):
        """Read azimuth from ADC potentiometer via SPI (MCP3008)."""
        if self.spi is None:
            return self.current_azimuth

        try:
            # MCP3008 read command for channel 0
            adc_data = self.spi.xfer2([1, (8 + SPI_CHANNEL) << 4, 0])
            adc_value = ((adc_data[1] & 3) << 8) + adc_data[2]

            # Map ADC value to degrees
            adc_clamped = max(ADC_MIN, min(ADC_MAX, adc_value))
            azimuth = (adc_clamped - ADC_MIN) / (ADC_MAX - ADC_MIN) * 360.0
            self.current_azimuth = round(azimuth, 1)
        except Exception as e:
            logger.error("ADC read error: %s", e)

        return self.current_azimuth

    def _check_limits(self):
        """Check hardware limit switches."""
        cw_limit = not GPIO.input(LIMIT_CW_PIN)   # Active low
        ccw_limit = not GPIO.input(LIMIT_CCW_PIN)
        return cw_limit, ccw_limit

    def _start_motor(self, direction):
        """Start rotator motor in specified direction."""
        cw_limit, ccw_limit = self._check_limits()
        if direction == "CW" and cw_limit:
            logger.warning("CW limit reached")
            return False
        if direction == "CCW" and ccw_limit:
            logger.warning("CCW limit reached")
            return False

        # Release brake
        GPIO.output(BRAKE_PIN, GPIO.HIGH)
        time.sleep(0.1)

        # Set direction
        if direction == "CW":
            GPIO.output(MOTOR_CW_PIN, GPIO.HIGH)
            GPIO.output(MOTOR_CCW_PIN, GPIO.LOW)
        else:
            GPIO.output(MOTOR_CW_PIN, GPIO.LOW)
            GPIO.output(MOTOR_CCW_PIN, GPIO.HIGH)

        # Enable motor with PWM speed
        self.pwm.ChangeDutyCycle(MOTOR_SPEED)
        self.rotating = True
        self.direction = direction
        return True

    def _stop_motor(self):
        """Stop rotator motor and engage brake."""
        self.pwm.ChangeDutyCycle(0)
        GPIO.output(MOTOR_CW_PIN, GPIO.LOW)
        GPIO.output(MOTOR_CCW_PIN, GPIO.LOW)
        time.sleep(0.1)
        GPIO.output(BRAKE_PIN, GPIO.LOW)  # Engage brake
        self.rotating = False
        self.direction = None

    def rotate_to(self, target_deg):
        """Rotate to target azimuth using shortest path."""
        self.target_azimuth = target_deg % 360.0
        current = self.read_azimuth()
        diff = (self.target_azimuth - current + 540) % 360 - 180

        if abs(diff) <= DEADBAND_DEG:
            logger.info("Already at target (%.1f deg)", current)
            return

        direction = "CW" if diff > 0 else "CCW"
        logger.info("Rotating %s from %.1f to %.1f (diff=%.1f)",
                     direction, current, self.target_azimuth, diff)
        self._start_motor(direction)

    def update_position(self):
        """Check position and stop motor when target reached."""
        if not self.rotating:
            return

        current = self.read_azimuth()
        diff = abs(self.target_azimuth - current)
        diff = min(diff, 360 - diff)

        cw_limit, ccw_limit = self._check_limits()
        if (self.direction == "CW" and cw_limit) or \
           (self.direction == "CCW" and ccw_limit):
            self._stop_motor()
            logger.warning("Stopped: limit switch triggered")
            return

        if diff <= DEADBAND_DEG:
            self._stop_motor()
            logger.info("Target reached: %.1f deg", current)

    def get_status(self):
        return {
            "current_azimuth": self.read_azimuth(),
            "target_azimuth": self.target_azimuth,
            "rotating": self.rotating,
            "direction": self.direction,
            "limits": {"cw": not GPIO.input(LIMIT_CW_PIN),
                       "ccw": not GPIO.input(LIMIT_CCW_PIN)},
            "presets": self.presets,
        }

    def cleanup(self):
        self._stop_motor()
        if self.pwm:
            self.pwm.stop()
        if self.spi:
            self.spi.close()
        GPIO.cleanup()


rotator = RotatorController()


def position_monitor():
    """Background thread for continuous position monitoring."""
    while True:
        rotator.update_position()
        time.sleep(0.1)


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi Rotator</title></head><body>
    <h1>Antenna Rotator Controller</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),250);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(rotator.get_status())

@app.route("/api/rotate", methods=["POST"])
def api_rotate():
    target = request.json.get("azimuth", 0)
    rotator.rotate_to(target)
    return jsonify({"target": target})

@app.route("/api/stop", methods=["POST"])
def api_stop():
    rotator._stop_motor()
    return jsonify({"stopped": True})

@app.route("/api/preset/<name>", methods=["POST"])
def api_preset(name):
    if name in rotator.presets:
        rotator.rotate_to(rotator.presets[name])
        return jsonify({"preset": name, "azimuth": rotator.presets[name]})
    return jsonify({"error": "Unknown preset"}), 404


if __name__ == "__main__":
    try:
        monitor = threading.Thread(target=position_monitor, daemon=True)
        monitor.start()
        logger.info("Starting Rotator Controller on port 8084")
        app.run(host="0.0.0.0", port=8084, debug=False)
    except KeyboardInterrupt:
        pass
    finally:
        rotator.cleanup()
