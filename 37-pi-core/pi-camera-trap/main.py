#!/usr/bin/env python3
"""
Pi Camera Trap
Motion-activated wildlife camera using PIR sensor and Pi Camera.
Captures photos/video on motion detection, with timestamp overlay and web gallery.
"""

import os
import time
import json
import logging
import threading
from datetime import datetime
from pathlib import Path

try:
    import RPi.GPIO as GPIO
    from picamera2 import Picamera2
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()
    Picamera2 = MagicMock()

from flask import Flask, jsonify, request, send_from_directory, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("camera-trap")

app = Flask(__name__)

# --- Configuration ---
PIR_PIN = 4
LED_PIN = 18          # IR illuminator control
STATUS_LED_PIN = 25   # Status indicator
CAPTURE_DIR = Path("/var/lib/camera-trap/captures")
CAPTURE_DIR.mkdir(parents=True, exist_ok=True)

CONFIG = {
    "resolution": (2592, 1944),
    "video_duration": 10,
    "cooldown_seconds": 30,
    "sensitivity": "high",
    "capture_mode": "photo",  # photo, video, both
    "ir_enabled": True,
    "max_captures_per_day": 500,
}


class CameraTrap:
    """Motion-triggered camera system with PIR sensor."""

    def __init__(self):
        self.camera = None
        self.armed = False
        self.capture_count = 0
        self.last_trigger = 0
        self.detections = []
        self.lock = threading.Lock()
        self._setup_gpio()
        self._setup_camera()

    def _setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(PIR_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        GPIO.setup(LED_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(STATUS_LED_PIN, GPIO.OUT, initial=GPIO.LOW)

    def _setup_camera(self):
        """Initialize Pi Camera with optimal trap settings."""
        try:
            self.camera = Picamera2()
            config = self.camera.create_still_configuration(
                main={"size": CONFIG["resolution"]},
                controls={"AwbMode": 1, "ExposureTime": 0}
            )
            self.camera.configure(config)
            self.camera.start()
            time.sleep(2)  # Warm-up
            logger.info("Camera initialized at %s", CONFIG["resolution"])
        except Exception as e:
            logger.warning("Camera init failed: %s", e)
            self.camera = None

    def _activate_ir(self, state):
        """Control IR illuminator for night captures."""
        if CONFIG["ir_enabled"]:
            GPIO.output(LED_PIN, GPIO.HIGH if state else GPIO.LOW)

    def capture_photo(self):
        """Take a timestamped photo."""
        if not self.camera:
            return None
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"trap_{timestamp}.jpg"
        filepath = CAPTURE_DIR / filename

        self._activate_ir(True)
        time.sleep(0.2)  # Let IR illuminate

        try:
            self.camera.capture_file(str(filepath))
            logger.info("Photo captured: %s", filename)
        except Exception as e:
            logger.error("Capture failed: %s", e)
            filepath = None
        finally:
            self._activate_ir(False)

        return str(filepath) if filepath and filepath.exists() else None

    def capture_video(self, duration=None):
        """Record a video clip."""
        if not self.camera:
            return None
        if duration is None:
            duration = CONFIG["video_duration"]

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"trap_{timestamp}.h264"
        filepath = CAPTURE_DIR / filename

        self._activate_ir(True)
        try:
            self.camera.start_recording(str(filepath))
            time.sleep(duration)
            self.camera.stop_recording()
            logger.info("Video recorded: %s (%ds)", filename, duration)
        except Exception as e:
            logger.error("Video recording failed: %s", e)
            filepath = None
        finally:
            self._activate_ir(False)

        return str(filepath) if filepath and filepath.exists() else None

    def on_motion(self, channel):
        """PIR motion detection callback."""
        now = time.time()
        if now - self.last_trigger < CONFIG["cooldown_seconds"]:
            return
        if self.capture_count >= CONFIG["max_captures_per_day"]:
            return
        if not self.armed:
            return

        self.last_trigger = now
        GPIO.output(STATUS_LED_PIN, GPIO.HIGH)
        logger.info("Motion detected!")

        detection = {
            "time": datetime.now().isoformat(),
            "files": [],
        }

        mode = CONFIG["capture_mode"]
        if mode in ("photo", "both"):
            path = self.capture_photo()
            if path:
                detection["files"].append(path)
        if mode in ("video", "both"):
            path = self.capture_video()
            if path:
                detection["files"].append(path)

        self.capture_count += 1
        self.detections.append(detection)
        GPIO.output(STATUS_LED_PIN, GPIO.LOW)

    def arm(self):
        """Arm the camera trap for motion detection."""
        self.armed = True
        GPIO.add_event_detect(PIR_PIN, GPIO.RISING, callback=self.on_motion, bouncetime=1000)
        GPIO.output(STATUS_LED_PIN, GPIO.HIGH)
        time.sleep(0.5)
        GPIO.output(STATUS_LED_PIN, GPIO.LOW)
        logger.info("Camera trap ARMED")

    def disarm(self):
        """Disarm the camera trap."""
        self.armed = False
        GPIO.remove_event_detect(PIR_PIN)
        logger.info("Camera trap DISARMED")

    def get_status(self):
        return {
            "armed": self.armed,
            "capture_count": self.capture_count,
            "last_trigger": datetime.fromtimestamp(self.last_trigger).isoformat() if self.last_trigger else None,
            "recent_detections": self.detections[-10:],
            "camera_ok": self.camera is not None,
            "config": CONFIG,
        }

    def cleanup(self):
        self.disarm()
        if self.camera:
            self.camera.stop()
        GPIO.cleanup()


trap = CameraTrap()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi Camera Trap</title></head><body>
    <h1>Camera Trap</h1>
    <button onclick="fetch('/api/arm',{method:'POST'})">Arm</button>
    <button onclick="fetch('/api/disarm',{method:'POST'})">Disarm</button>
    <button onclick="fetch('/api/capture',{method:'POST'})">Manual Capture</button>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),2000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(trap.get_status())

@app.route("/api/arm", methods=["POST"])
def api_arm():
    trap.arm()
    return jsonify({"armed": True})

@app.route("/api/disarm", methods=["POST"])
def api_disarm():
    trap.disarm()
    return jsonify({"armed": False})

@app.route("/api/capture", methods=["POST"])
def api_capture():
    path = trap.capture_photo()
    return jsonify({"file": path})

@app.route("/api/gallery")
def api_gallery():
    files = sorted(CAPTURE_DIR.glob("*.*"), reverse=True)
    return jsonify({"files": [f.name for f in files[:50]]})

@app.route("/captures/<filename>")
def serve_capture(filename):
    return send_from_directory(str(CAPTURE_DIR), filename)


if __name__ == "__main__":
    try:
        logger.info("Starting Camera Trap on port 8085")
        app.run(host="0.0.0.0", port=8085, debug=False)
    except KeyboardInterrupt:
        pass
    finally:
        trap.cleanup()
