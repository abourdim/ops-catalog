#!/usr/bin/env python3
"""
Pi Surveillance Drone Controller
Flight controller and surveillance payload manager for Pi-based drones.
Manages GPS navigation, camera gimbal, telemetry, and mission planning.
"""

import os
import time
import json
import math
import logging
import threading
from datetime import datetime
from pathlib import Path

try:
    import RPi.GPIO as GPIO
    import smbus2
    import serial
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()
    smbus2 = MagicMock()
    serial = MagicMock()

from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("surveillance-drone")

app = Flask(__name__)

DATA_DIR = Path("/var/lib/drone/missions")
DATA_DIR.mkdir(parents=True, exist_ok=True)

# --- GPIO Pins ---
MOTOR_PINS = [12, 13, 18, 19]  # 4 ESC PWM outputs
GIMBAL_PITCH_PIN = 20
GIMBAL_YAW_PIN = 21
CAMERA_TRIGGER_PIN = 16
LED_PIN = 26
BUZZER_PIN = 6

# --- I2C Sensors ---
I2C_BUS = 1
MPU6050_ADDR = 0x68   # IMU (gyro + accelerometer)
BMP280_ADDR = 0x76    # Barometric altimeter
HMC5883L_ADDR = 0x1E  # Magnetometer/compass

GPS_PORT = "/dev/ttyAMA0"
GPS_BAUD = 9600


class IMU:
    """MPU6050 inertial measurement unit interface."""

    def __init__(self):
        self.bus = None
        try:
            self.bus = smbus2.SMBus(I2C_BUS)
            # Wake up MPU6050
            self.bus.write_byte_data(MPU6050_ADDR, 0x6B, 0)
        except Exception:
            pass

    def read_raw(self):
        """Read raw accelerometer and gyroscope data."""
        if not self.bus:
            return {"ax": 0, "ay": 0, "az": 0, "gx": 0, "gy": 0, "gz": 0}
        try:
            data = self.bus.read_i2c_block_data(MPU6050_ADDR, 0x3B, 14)
            def to_signed(h, l):
                val = (h << 8) | l
                return val - 65536 if val > 32767 else val

            return {
                "ax": to_signed(data[0], data[1]) / 16384.0,
                "ay": to_signed(data[2], data[3]) / 16384.0,
                "az": to_signed(data[4], data[5]) / 16384.0,
                "gx": to_signed(data[8], data[9]) / 131.0,
                "gy": to_signed(data[10], data[11]) / 131.0,
                "gz": to_signed(data[12], data[13]) / 131.0,
            }
        except Exception:
            return {"ax": 0, "ay": 0, "az": 0, "gx": 0, "gy": 0, "gz": 0}

    def get_attitude(self):
        """Compute roll and pitch from accelerometer."""
        raw = self.read_raw()
        roll = math.atan2(raw["ay"], raw["az"]) * 180 / math.pi
        pitch = math.atan2(-raw["ax"], math.sqrt(raw["ay"]**2 + raw["az"]**2)) * 180 / math.pi
        return {"roll": round(roll, 1), "pitch": round(pitch, 1), "raw": raw}


class GPSModule:
    """GPS receiver for navigation."""

    def __init__(self):
        self.serial_conn = None
        self.latitude = 0.0
        self.longitude = 0.0
        self.altitude_m = 0.0
        self.speed_kmh = 0.0
        self.heading = 0.0
        self.fix = 0
        self.satellites = 0

    def connect(self):
        try:
            self.serial_conn = serial.Serial(GPS_PORT, GPS_BAUD, timeout=1)
            return True
        except Exception:
            return False

    def update(self):
        """Read and parse NMEA data."""
        if not self.serial_conn:
            return
        try:
            line = self.serial_conn.readline().decode(errors="replace").strip()
            if line.startswith("$GPGGA") or line.startswith("$GNGGA"):
                parts = line.split(",")
                if len(parts) > 9:
                    self.fix = int(parts[6]) if parts[6] else 0
                    self.satellites = int(parts[7]) if parts[7] else 0
                    if parts[9]:
                        self.altitude_m = float(parts[9])
                    if parts[2] and parts[4]:
                        lat = float(parts[2])
                        self.latitude = int(lat / 100) + (lat % 100) / 60
                        if parts[3] == "S":
                            self.latitude = -self.latitude
                        lon = float(parts[4])
                        self.longitude = int(lon / 100) + (lon % 100) / 60
                        if parts[5] == "W":
                            self.longitude = -self.longitude
        except Exception:
            pass

    def get_position(self):
        return {
            "lat": round(self.latitude, 6),
            "lon": round(self.longitude, 6),
            "alt_m": round(self.altitude_m, 1),
            "speed_kmh": self.speed_kmh,
            "heading": self.heading,
            "fix": self.fix,
            "satellites": self.satellites,
        }


class DroneController:
    """Main drone flight and surveillance controller."""

    def __init__(self):
        self.imu = IMU()
        self.gps = GPSModule()
        self.armed = False
        self.flight_mode = "manual"  # manual, hover, waypoint, rtl
        self.motor_speeds = [0, 0, 0, 0]
        self.mission_waypoints = []
        self.current_waypoint = 0
        self.photos_taken = 0
        self.flight_time = 0
        self.flight_start = None
        self.pwm_outputs = []
        self._setup_hardware()

    def _setup_hardware(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)

        for pin in MOTOR_PINS:
            GPIO.setup(pin, GPIO.OUT)
            pwm = GPIO.PWM(pin, 400)  # 400Hz for ESC
            pwm.start(0)
            self.pwm_outputs.append(pwm)

        GPIO.setup(GIMBAL_PITCH_PIN, GPIO.OUT)
        GPIO.setup(GIMBAL_YAW_PIN, GPIO.OUT)
        GPIO.setup(CAMERA_TRIGGER_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(LED_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(BUZZER_PIN, GPIO.OUT, initial=GPIO.LOW)

    def arm(self):
        """Arm motors (safety check required)."""
        attitude = self.imu.get_attitude()
        if abs(attitude["roll"]) > 10 or abs(attitude["pitch"]) > 10:
            logger.warning("Cannot arm: not level (roll=%.1f, pitch=%.1f)",
                          attitude["roll"], attitude["pitch"])
            return False

        self.armed = True
        self.flight_start = time.time()
        GPIO.output(LED_PIN, GPIO.HIGH)

        # Beep confirmation
        GPIO.output(BUZZER_PIN, GPIO.HIGH)
        time.sleep(0.2)
        GPIO.output(BUZZER_PIN, GPIO.LOW)

        logger.info("Drone ARMED")
        return True

    def disarm(self):
        """Disarm motors immediately."""
        self.armed = False
        for pwm in self.pwm_outputs:
            pwm.ChangeDutyCycle(0)
        self.motor_speeds = [0, 0, 0, 0]
        if self.flight_start:
            self.flight_time += time.time() - self.flight_start
            self.flight_start = None
        GPIO.output(LED_PIN, GPIO.LOW)
        logger.info("Drone DISARMED")

    def set_motor_speeds(self, speeds):
        """Set individual motor speeds (0-100%)."""
        if not self.armed:
            return
        for i, speed in enumerate(speeds[:4]):
            speed = max(0, min(100, speed))
            self.motor_speeds[i] = speed
            # Map to ESC pulse: 5% = 1000us (off), 10% = 2000us (full)
            duty = 5 + speed * 0.05
            self.pwm_outputs[i].ChangeDutyCycle(duty)

    def set_gimbal(self, pitch=0, yaw=0):
        """Set camera gimbal position (-90 to +90 degrees)."""
        # Map degrees to servo duty cycle
        pitch_duty = 7.5 + (pitch / 90.0) * 5.0
        yaw_duty = 7.5 + (yaw / 90.0) * 5.0
        # Would use dedicated servo PWM here
        logger.info("Gimbal: pitch=%.1f, yaw=%.1f", pitch, yaw)

    def trigger_camera(self):
        """Trigger camera shutter."""
        GPIO.output(CAMERA_TRIGGER_PIN, GPIO.HIGH)
        time.sleep(0.2)
        GPIO.output(CAMERA_TRIGGER_PIN, GPIO.LOW)
        self.photos_taken += 1
        logger.info("Photo #%d captured", self.photos_taken)

    def load_mission(self, waypoints):
        """Load waypoint mission."""
        self.mission_waypoints = waypoints
        self.current_waypoint = 0
        logger.info("Mission loaded: %d waypoints", len(waypoints))

    def get_telemetry(self):
        """Get full telemetry package."""
        self.gps.update()
        attitude = self.imu.get_attitude()
        elapsed = 0
        if self.flight_start:
            elapsed = time.time() - self.flight_start

        return {
            "armed": self.armed,
            "flight_mode": self.flight_mode,
            "attitude": attitude,
            "gps": self.gps.get_position(),
            "motors": self.motor_speeds,
            "flight_time_sec": round(self.flight_time + elapsed, 1),
            "photos_taken": self.photos_taken,
            "mission": {
                "waypoints": len(self.mission_waypoints),
                "current": self.current_waypoint,
            },
        }

    def cleanup(self):
        self.disarm()
        for pwm in self.pwm_outputs:
            pwm.stop()
        GPIO.cleanup()


drone = DroneController()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Drone Controller</title></head><body>
    <h1>Surveillance Drone</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/telemetry').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),500);</script></body></html>
    """)

@app.route("/api/telemetry")
def api_telemetry():
    return jsonify(drone.get_telemetry())

@app.route("/api/status")
def api_status():
    return api_telemetry()

@app.route("/api/arm", methods=["POST"])
def api_arm():
    ok = drone.arm()
    return jsonify({"armed": ok})

@app.route("/api/disarm", methods=["POST"])
def api_disarm():
    drone.disarm()
    return jsonify({"armed": False})

@app.route("/api/motors", methods=["POST"])
def api_motors():
    speeds = request.json.get("speeds", [0, 0, 0, 0])
    drone.set_motor_speeds(speeds)
    return jsonify({"motors": drone.motor_speeds})

@app.route("/api/camera", methods=["POST"])
def api_camera():
    drone.trigger_camera()
    return jsonify({"photos": drone.photos_taken})

@app.route("/api/mission", methods=["POST"])
def api_mission():
    wps = request.json.get("waypoints", [])
    drone.load_mission(wps)
    return jsonify({"waypoints": len(wps)})


if __name__ == "__main__":
    try:
        drone.gps.connect()
        logger.info("Starting Drone Controller on port 8111")
        app.run(host="0.0.0.0", port=8111, debug=False)
    except KeyboardInterrupt:
        pass
    finally:
        drone.cleanup()
