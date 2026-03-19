#!/usr/bin/env python3
"""
Pi Remote Antenna Station
Controls a remote antenna installation via network.
Manages antenna selector, rotator, tuner, and environment sensors
at a distant antenna site connected via IP link.
"""

import os
import time
import json
import math
import logging
import threading
from datetime import datetime

try:
    import RPi.GPIO as GPIO
    import smbus2
    import spidev
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()
    smbus2 = MagicMock()
    spidev = MagicMock()

from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("remote-antenna")

app = Flask(__name__)

# --- GPIO Pin Map ---
ANTENNA_RELAY_PINS = [5, 6, 13, 19]   # 4-port antenna selector
ROTATOR_CW_PIN = 17
ROTATOR_CCW_PIN = 27
ROTATOR_ENABLE_PIN = 22
TUNER_STEP_PIN = 23       # Stepper motor for tuner capacitor
TUNER_DIR_PIN = 24
LIGHTNING_PIN = 25         # Lightning detector interrupt
WIND_SENSOR_PIN = 12       # Anemometer pulse input

# I2C sensors
I2C_BUS = 1
BME280_ADDR = 0x76   # Temperature/humidity/pressure
INA219_ADDR = 0x40   # Current/voltage monitor


class EnvironmentMonitor:
    """Reads weather and power sensors at antenna site."""

    def __init__(self):
        self.bus = None
        self.wind_pulses = 0
        self.last_wind_time = time.time()
        try:
            self.bus = smbus2.SMBus(I2C_BUS)
        except Exception:
            pass

    def read_bme280(self):
        """Read BME280 temperature, humidity, pressure."""
        if not self.bus:
            return {"temp_c": None, "humidity": None, "pressure_hpa": None}
        try:
            # Trigger forced measurement
            self.bus.write_byte_data(BME280_ADDR, 0xF4, 0x25)
            time.sleep(0.05)
            data = self.bus.read_i2c_block_data(BME280_ADDR, 0xF7, 8)
            # Simplified raw conversion (real driver needs calibration data)
            raw_pressure = (data[0] << 12) | (data[1] << 4) | (data[2] >> 4)
            raw_temp = (data[3] << 12) | (data[4] << 4) | (data[5] >> 4)
            raw_hum = (data[6] << 8) | data[7]
            return {
                "temp_c": round(raw_temp / 16384.0 * 5.0 + 15.0, 1),
                "humidity": round(raw_hum / 65535.0 * 100, 1),
                "pressure_hpa": round(raw_pressure / 16384.0 * 100 + 900, 1),
            }
        except Exception:
            return {"temp_c": None, "humidity": None, "pressure_hpa": None}

    def read_power(self):
        """Read INA219 current/voltage sensor."""
        if not self.bus:
            return {"voltage_v": None, "current_ma": None, "power_mw": None}
        try:
            raw_v = self.bus.read_word_data(INA219_ADDR, 0x02)
            raw_i = self.bus.read_word_data(INA219_ADDR, 0x04)
            voltage = ((raw_v >> 8) | ((raw_v & 0xFF) << 8)) >> 3
            voltage_v = voltage * 0.004
            current_ma = ((raw_i >> 8) | ((raw_i & 0xFF) << 8)) * 0.1
            return {
                "voltage_v": round(voltage_v, 2),
                "current_ma": round(current_ma, 1),
                "power_mw": round(voltage_v * current_ma, 1),
            }
        except Exception:
            return {"voltage_v": None, "current_ma": None, "power_mw": None}

    def wind_pulse_callback(self, channel):
        """Anemometer pulse counter."""
        self.wind_pulses += 1

    def get_wind_speed(self):
        """Calculate wind speed from anemometer pulses."""
        now = time.time()
        elapsed = now - self.last_wind_time
        if elapsed < 1:
            return 0.0
        # Typical: 1 pulse per revolution, 1 rev/s = 2.4 km/h
        rps = self.wind_pulses / elapsed
        speed_kmh = rps * 2.4
        self.wind_pulses = 0
        self.last_wind_time = now
        return round(speed_kmh, 1)


class RemoteAntennaStation:
    """Controls remote antenna site equipment."""

    def __init__(self):
        self.env = EnvironmentMonitor()
        self.current_antenna = 0
        self.current_azimuth = 0.0
        self.tuner_position = 0
        self.spi = None
        self.lightning_count = 0
        self._setup_hardware()

    def _setup_hardware(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)

        for pin in ANTENNA_RELAY_PINS:
            GPIO.setup(pin, GPIO.OUT, initial=GPIO.HIGH)
        GPIO.setup(ROTATOR_CW_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(ROTATOR_CCW_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(ROTATOR_ENABLE_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(TUNER_STEP_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(TUNER_DIR_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(LIGHTNING_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        GPIO.setup(WIND_SENSOR_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

        GPIO.add_event_detect(LIGHTNING_PIN, GPIO.RISING,
                              callback=lambda ch: self._on_lightning())
        GPIO.add_event_detect(WIND_SENSOR_PIN, GPIO.FALLING,
                              callback=self.env.wind_pulse_callback)

        # SPI for ADC (azimuth pot)
        try:
            self.spi = spidev.SpiDev()
            self.spi.open(0, 0)
            self.spi.max_speed_hz = 500000
        except Exception:
            self.spi = None

    def _on_lightning(self):
        self.lightning_count += 1
        logger.warning("Lightning detected! Count: %d", self.lightning_count)

    def select_antenna(self, num):
        """Switch antenna port (0-3)."""
        if 0 <= num < len(ANTENNA_RELAY_PINS):
            for pin in ANTENNA_RELAY_PINS:
                GPIO.output(pin, GPIO.HIGH)
            time.sleep(0.05)
            GPIO.output(ANTENNA_RELAY_PINS[num], GPIO.LOW)
            self.current_antenna = num
            logger.info("Antenna %d selected", num)
            return True
        return False

    def read_azimuth(self):
        """Read rotator azimuth from ADC."""
        if self.spi:
            try:
                data = self.spi.xfer2([1, 0x80, 0])
                adc = ((data[1] & 3) << 8) + data[2]
                self.current_azimuth = round(adc / 1023.0 * 360.0, 1)
            except Exception:
                pass
        return self.current_azimuth

    def rotate_to(self, target_deg):
        """Rotate antenna to target azimuth."""
        current = self.read_azimuth()
        diff = (target_deg - current + 540) % 360 - 180
        direction = "CW" if diff > 0 else "CCW"

        GPIO.output(ROTATOR_ENABLE_PIN, GPIO.HIGH)
        if direction == "CW":
            GPIO.output(ROTATOR_CW_PIN, GPIO.HIGH)
            GPIO.output(ROTATOR_CCW_PIN, GPIO.LOW)
        else:
            GPIO.output(ROTATOR_CW_PIN, GPIO.LOW)
            GPIO.output(ROTATOR_CCW_PIN, GPIO.HIGH)

        logger.info("Rotating %s to %.1f deg", direction, target_deg)
        return {"direction": direction, "target": target_deg}

    def stop_rotator(self):
        GPIO.output(ROTATOR_CW_PIN, GPIO.LOW)
        GPIO.output(ROTATOR_CCW_PIN, GPIO.LOW)
        GPIO.output(ROTATOR_ENABLE_PIN, GPIO.LOW)

    def step_tuner(self, steps, direction=1):
        """Step antenna tuner capacitor motor."""
        GPIO.output(TUNER_DIR_PIN, GPIO.HIGH if direction > 0 else GPIO.LOW)
        for _ in range(abs(steps)):
            GPIO.output(TUNER_STEP_PIN, GPIO.HIGH)
            time.sleep(0.001)
            GPIO.output(TUNER_STEP_PIN, GPIO.LOW)
            time.sleep(0.001)
        self.tuner_position += steps * direction

    def get_status(self):
        return {
            "antenna": self.current_antenna,
            "azimuth": self.read_azimuth(),
            "tuner_position": self.tuner_position,
            "environment": self.env.read_bme280(),
            "power": self.env.read_power(),
            "wind_speed_kmh": self.env.get_wind_speed(),
            "lightning_count": self.lightning_count,
            "timestamp": datetime.utcnow().isoformat(),
        }

    def cleanup(self):
        self.stop_rotator()
        for pin in ANTENNA_RELAY_PINS:
            GPIO.output(pin, GPIO.HIGH)
        GPIO.cleanup()


station = RemoteAntennaStation()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Remote Antenna Station</title></head><body>
    <h1>Remote Antenna Station</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),2000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(station.get_status())

@app.route("/api/antenna/<int:num>", methods=["POST"])
def api_antenna(num):
    ok = station.select_antenna(num)
    return jsonify({"antenna": num, "success": ok})

@app.route("/api/rotate", methods=["POST"])
def api_rotate():
    target = request.json.get("azimuth", 0)
    return jsonify(station.rotate_to(target))

@app.route("/api/stop", methods=["POST"])
def api_stop():
    station.stop_rotator()
    return jsonify({"stopped": True})

@app.route("/api/tuner", methods=["POST"])
def api_tuner():
    d = request.json or {}
    station.step_tuner(d.get("steps", 10), d.get("direction", 1))
    return jsonify({"tuner_position": station.tuner_position})


if __name__ == "__main__":
    try:
        logger.info("Starting Remote Antenna Station on port 8100")
        app.run(host="0.0.0.0", port=8100, debug=False)
    except KeyboardInterrupt:
        pass
    finally:
        station.cleanup()
