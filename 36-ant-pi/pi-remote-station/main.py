#!/usr/bin/env python3
"""
Pi Remote Station Controller
Full remote ham radio station control via network.
Manages rig CAT control, PTT, audio streaming, and station peripherals.
"""

import os
import time
import json
import socket
import struct
import logging
import threading
import subprocess
from flask import Flask, jsonify, request, render_template_string

try:
    import RPi.GPIO as GPIO
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()

import serial

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("remote-station")

app = Flask(__name__)

# --- Configuration ---
RIG_SERIAL_PORT = "/dev/ttyUSB0"
RIG_BAUD_RATE = 9600
PTT_PIN = 17
AMP_RELAY_PIN = 27
AUDIO_DEVICE = "plughw:1,0"
STREAM_PORT = 7355


class RigController:
    """CAT control interface for amateur radio transceivers."""

    def __init__(self, port=RIG_SERIAL_PORT, baud=RIG_BAUD_RATE):
        self.port = port
        self.baud = baud
        self.serial_conn = None
        self.frequency = 14074000  # Default 20m FT8
        self.mode = "USB"
        self.power = 50
        self.lock = threading.Lock()

    def connect(self):
        """Open serial connection to radio."""
        try:
            self.serial_conn = serial.Serial(
                port=self.port, baudrate=self.baud,
                timeout=1, bytesize=8, parity="N", stopbits=1
            )
            logger.info("Connected to rig on %s at %d baud", self.port, self.baud)
            return True
        except serial.SerialException as e:
            logger.error("Serial connection failed: %s", e)
            return False

    def send_cat_command(self, cmd):
        """Send CAT command and read response."""
        with self.lock:
            if not self.serial_conn or not self.serial_conn.is_open:
                return None
            try:
                self.serial_conn.write(cmd.encode() + b";")
                time.sleep(0.05)
                response = self.serial_conn.read(64).decode(errors="replace").strip()
                return response
            except Exception as e:
                logger.error("CAT command failed: %s", e)
                return None

    def set_frequency(self, freq_hz):
        """Set radio frequency via CAT."""
        self.frequency = freq_hz
        # Kenwood/Elecraft style CAT command
        cmd = f"FA{freq_hz:011d}"
        return self.send_cat_command(cmd)

    def get_frequency(self):
        """Read current frequency from radio."""
        resp = self.send_cat_command("FA")
        if resp and resp.startswith("FA"):
            try:
                self.frequency = int(resp[2:])
            except ValueError:
                pass
        return self.frequency

    def set_mode(self, mode):
        """Set operating mode (USB, LSB, CW, FM, AM)."""
        mode_map = {"LSB": "1", "USB": "2", "CW": "3", "FM": "4", "AM": "5"}
        if mode.upper() in mode_map:
            self.mode = mode.upper()
            return self.send_cat_command(f"MD{mode_map[self.mode]}")
        return None

    def set_power(self, watts):
        """Set transmit power level."""
        self.power = max(0, min(100, watts))
        return self.send_cat_command(f"PC{self.power:03d}")


class AudioStreamer:
    """Manages bidirectional audio streaming for remote operation."""

    def __init__(self, device=AUDIO_DEVICE, port=STREAM_PORT):
        self.device = device
        self.port = port
        self.process = None
        self.streaming = False

    def start_stream(self):
        """Start audio streaming via ALSA and netcat."""
        if self.streaming:
            return
        # Use arecord piped to a TCP socket for RX audio
        cmd = (
            f"arecord -D {self.device} -f S16_LE -r 48000 -c 1 -t raw | "
            f"socat - TCP-LISTEN:{self.port},reuseaddr,fork"
        )
        self.process = subprocess.Popen(cmd, shell=True, preexec_fn=os.setsid)
        self.streaming = True
        logger.info("Audio stream started on port %d", self.port)

    def stop_stream(self):
        """Stop audio streaming."""
        if self.process:
            self.process.terminate()
            self.process.wait()
            self.process = None
        self.streaming = False
        logger.info("Audio stream stopped")


class StationController:
    """Coordinates all remote station subsystems."""

    def __init__(self):
        self.rig = RigController()
        self.audio = AudioStreamer()
        self.ptt_active = False
        self._setup_gpio()

    def _setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(PTT_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(AMP_RELAY_PIN, GPIO.OUT, initial=GPIO.LOW)

    def key_ptt(self, state):
        """Control PTT via GPIO."""
        self.ptt_active = state
        GPIO.output(PTT_PIN, GPIO.HIGH if state else GPIO.LOW)
        logger.info("PTT %s", "ON" if state else "OFF")

    def enable_amplifier(self, state):
        """Control external amplifier relay."""
        GPIO.output(AMP_RELAY_PIN, GPIO.HIGH if state else GPIO.LOW)
        logger.info("Amplifier %s", "ON" if state else "OFF")

    def get_status(self):
        return {
            "frequency": self.rig.frequency,
            "mode": self.rig.mode,
            "power": self.rig.power,
            "ptt": self.ptt_active,
            "audio_streaming": self.audio.streaming,
            "rig_connected": self.rig.serial_conn is not None,
        }

    def cleanup(self):
        self.key_ptt(False)
        self.enable_amplifier(False)
        self.audio.stop_stream()
        GPIO.cleanup()


station = StationController()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi Remote Station</title></head><body>
    <h1>Remote Station Controller</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),500);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(station.get_status())

@app.route("/api/frequency", methods=["POST"])
def api_freq():
    freq = request.json.get("freq", 14074000)
    station.rig.set_frequency(freq)
    return jsonify({"frequency": freq})

@app.route("/api/mode", methods=["POST"])
def api_mode():
    mode = request.json.get("mode", "USB")
    station.rig.set_mode(mode)
    return jsonify({"mode": mode})

@app.route("/api/ptt", methods=["POST"])
def api_ptt():
    state = request.json.get("state", False)
    station.key_ptt(state)
    return jsonify({"ptt": state})

@app.route("/api/audio/start", methods=["POST"])
def api_audio_start():
    station.audio.start_stream()
    return jsonify({"streaming": True})

@app.route("/api/audio/stop", methods=["POST"])
def api_audio_stop():
    station.audio.stop_stream()
    return jsonify({"streaming": False})

@app.route("/api/connect", methods=["POST"])
def api_connect():
    ok = station.rig.connect()
    return jsonify({"connected": ok})


if __name__ == "__main__":
    try:
        station.rig.connect()
        logger.info("Starting Remote Station Controller on port 8083")
        app.run(host="0.0.0.0", port=8083, debug=False)
    except KeyboardInterrupt:
        pass
    finally:
        station.cleanup()
