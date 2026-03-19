#!/usr/bin/env python3
"""
Pi Repeater Controller
Amateur radio repeater controller with COS/CTCSS detection,
ID timer, courtesy tone, and timeout timer via GPIO.
"""

import os
import time
import math
import logging
import threading
import struct
import wave
from datetime import datetime

try:
    import RPi.GPIO as GPIO
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()

from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("repeater")

app = Flask(__name__)

# --- GPIO Pin Assignments ---
COS_PIN = 4         # Carrier-operated squelch input (from receiver)
CTCSS_PIN = 17      # CTCSS tone detect input
PTT_PIN = 27        # Push-to-talk output (to transmitter)
FAN_PIN = 22        # Cooling fan control
AUX_PIN = 5         # Auxiliary relay
STATUS_LED = 6      # Status LED

# --- Repeater Timing (seconds) ---
HANG_TIME = 3.0          # TX stays on after input drops
TIMEOUT_TIMER = 180.0    # Max TX time before timeout
ID_INTERVAL = 600.0      # 10 minutes between IDs
COURTESY_DELAY = 0.5     # Delay before courtesy tone

CALLSIGN = "N0CALL/R"
CTCSS_FREQ = 100.0       # Hz


class CWGenerator:
    """Generates CW (Morse code) audio for repeater ID."""

    MORSE = {
        "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".",
        "F": "..-.", "G": "--.", "H": "....", "I": "..", "J": ".---",
        "K": "-.-", "L": ".-..", "M": "--", "N": "-.", "O": "---",
        "P": ".--.", "Q": "--.-", "R": ".-.", "S": "...", "T": "-",
        "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--",
        "Z": "--..", "0": "-----", "1": ".----", "2": "..---",
        "3": "...--", "4": "....-", "5": ".....", "6": "-....",
        "7": "--...", "8": "---..", "9": "----.", "/": "-..-.",
    }

    def __init__(self, wpm=18, tone_freq=800, sample_rate=44100):
        self.wpm = wpm
        self.tone_freq = tone_freq
        self.sample_rate = sample_rate
        self.dit_duration = 1.2 / wpm

    def _generate_tone(self, duration):
        """Generate a sine wave tone."""
        num_samples = int(self.sample_rate * duration)
        samples = []
        for i in range(num_samples):
            t = i / self.sample_rate
            sample = int(32767 * 0.8 * math.sin(2 * math.pi * self.tone_freq * t))
            samples.append(struct.pack("<h", sample))
        return b"".join(samples)

    def _generate_silence(self, duration):
        num_samples = int(self.sample_rate * duration)
        return b"\x00\x00" * num_samples

    def generate_cw(self, text):
        """Generate CW audio for given text."""
        audio = b""
        for char in text.upper():
            if char == " ":
                audio += self._generate_silence(self.dit_duration * 7)
                continue
            morse = self.MORSE.get(char, "")
            for symbol in morse:
                if symbol == ".":
                    audio += self._generate_tone(self.dit_duration)
                elif symbol == "-":
                    audio += self._generate_tone(self.dit_duration * 3)
                audio += self._generate_silence(self.dit_duration)
            audio += self._generate_silence(self.dit_duration * 2)
        return audio

    def save_id_wav(self, callsign, filepath="/tmp/repeater_id.wav"):
        """Generate and save repeater ID as WAV file."""
        audio = self.generate_cw(callsign)
        with wave.open(filepath, "w") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(self.sample_rate)
            wf.writeframes(audio)
        return filepath


class RepeaterController:
    """Full repeater controller with COS, timers, and ID."""

    def __init__(self):
        self.ptt_active = False
        self.cos_active = False
        self.timeout_active = False
        self.last_id_time = 0
        self.tx_start_time = 0
        self.total_tx_time = 0
        self.key_ups = 0
        self.timeouts = 0
        self.cw = CWGenerator()
        self.lock = threading.Lock()
        self._setup_gpio()

    def _setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(COS_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        GPIO.setup(CTCSS_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        GPIO.setup(PTT_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(FAN_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(AUX_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(STATUS_LED, GPIO.OUT, initial=GPIO.LOW)

    def key_tx(self, state):
        """Control transmitter PTT."""
        GPIO.output(PTT_PIN, GPIO.HIGH if state else GPIO.LOW)
        GPIO.output(STATUS_LED, GPIO.HIGH if state else GPIO.LOW)
        if state and not self.ptt_active:
            self.tx_start_time = time.time()
            GPIO.output(FAN_PIN, GPIO.HIGH)
        elif not state and self.ptt_active:
            duration = time.time() - self.tx_start_time
            self.total_tx_time += duration
        self.ptt_active = state

    def check_cos(self):
        """Read carrier-operated squelch state."""
        cos = GPIO.input(COS_PIN)
        ctcss = GPIO.input(CTCSS_PIN)
        return cos and ctcss  # Both COS and CTCSS required

    def send_id(self):
        """Transmit repeater identification in CW."""
        logger.info("Sending repeater ID: %s", CALLSIGN)
        self.key_tx(True)
        time.sleep(0.5)
        id_file = self.cw.save_id_wav(CALLSIGN)
        # Play via ALSA
        os.system(f"aplay -q {id_file} &")
        duration = len(CALLSIGN) * 0.15 * (1.2 / self.cw.wpm * 10)
        time.sleep(max(duration, 2.0))
        self.last_id_time = time.time()

    def send_courtesy_tone(self):
        """Play courtesy tone after user unkeys."""
        tone_file = "/tmp/courtesy.wav"
        self.cw.tone_freq = 1000
        audio = self.cw._generate_tone(0.1)
        with wave.open(tone_file, "w") as wf:
            wf.setnchannels(1)
            wf.setsampwidth(2)
            wf.setframerate(44100)
            wf.writeframes(audio)
        os.system(f"aplay -q {tone_file} &")
        self.cw.tone_freq = 800

    def controller_loop(self):
        """Main repeater control loop."""
        was_active = False
        hang_start = 0

        while True:
            cos = self.check_cos()

            if cos and not self.cos_active:
                # Signal appeared - key up transmitter
                self.cos_active = True
                self.key_ups += 1
                self.key_tx(True)
                self.tx_start_time = time.time()
                logger.info("COS active - TX ON (keyup #%d)", self.key_ups)

            elif cos and self.cos_active:
                # Signal still active - check timeout
                tx_duration = time.time() - self.tx_start_time
                if tx_duration > TIMEOUT_TIMER:
                    logger.warning("TIMEOUT after %.0f seconds!", tx_duration)
                    self.key_tx(False)
                    self.cos_active = False
                    self.timeout_active = True
                    self.timeouts += 1
                    time.sleep(5)  # Timeout penalty
                    self.timeout_active = False

            elif not cos and self.cos_active:
                # Signal dropped - start hang timer
                self.cos_active = False
                hang_start = time.time()
                time.sleep(COURTESY_DELAY)
                self.send_courtesy_tone()
                was_active = True

            elif not cos and was_active:
                # In hang time
                if time.time() - hang_start > HANG_TIME:
                    self.key_tx(False)
                    was_active = False
                    logger.info("Hang time expired - TX OFF")

            # Check ID timer
            if self.ptt_active and (time.time() - self.last_id_time > ID_INTERVAL):
                self.send_id()

            time.sleep(0.05)

    def get_status(self):
        return {
            "callsign": CALLSIGN,
            "ptt_active": self.ptt_active,
            "cos_active": self.cos_active,
            "timeout_active": self.timeout_active,
            "key_ups": self.key_ups,
            "timeouts": self.timeouts,
            "total_tx_minutes": round(self.total_tx_time / 60, 1),
            "time_since_id": round(time.time() - self.last_id_time, 0) if self.last_id_time else None,
            "ctcss_freq": CTCSS_FREQ,
            "config": {
                "hang_time": HANG_TIME,
                "timeout": TIMEOUT_TIMER,
                "id_interval": ID_INTERVAL,
            },
        }

    def cleanup(self):
        self.key_tx(False)
        GPIO.output(FAN_PIN, GPIO.LOW)
        GPIO.cleanup()


repeater = RepeaterController()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi Repeater</title></head><body>
    <h1>Repeater Controller</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),1000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(repeater.get_status())

@app.route("/api/id", methods=["POST"])
def api_id():
    threading.Thread(target=repeater.send_id, daemon=True).start()
    return jsonify({"id_sent": True})


if __name__ == "__main__":
    try:
        repeater.cw.save_id_wav(CALLSIGN)
        ctrl = threading.Thread(target=repeater.controller_loop, daemon=True)
        ctrl.start()
        logger.info("Starting Repeater Controller on port 8095")
        app.run(host="0.0.0.0", port=8095, debug=False)
    except KeyboardInterrupt:
        pass
    finally:
        repeater.cleanup()
