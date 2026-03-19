#!/usr/bin/env python3
"""
Pi Antenna Switch Controller
Controls relay-based antenna switching matrix via GPIO for multi-band ham radio.
Supports up to 8 antennas with band-decoder input and web UI.
"""

import os
import time
import json
import logging
import threading
from datetime import datetime

try:
    import RPi.GPIO as GPIO
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()

from flask import Flask, jsonify, request, render_template_string

# --- Configuration ---
CONFIG_FILE = "/etc/pi-antenna-switch/config.json"
DEFAULT_CONFIG = {
    "relay_pins": [5, 6, 13, 19, 26, 12, 16, 20],
    "band_decoder_pins": [17, 27, 22, 10],
    "inhibit_pin": 21,
    "max_antennas": 8,
    "switch_delay_ms": 50,
    "port": 8080,
}

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("antenna-switch")

app = Flask(__name__)


class AntennaSwitchController:
    """Manages relay-driven antenna switching with band decoder integration."""

    def __init__(self, config):
        self.config = config
        self.relay_pins = config["relay_pins"]
        self.band_pins = config["band_decoder_pins"]
        self.inhibit_pin = config["inhibit_pin"]
        self.current_antenna = 0
        self.lock = threading.Lock()
        self.switch_log = []
        self._setup_gpio()

    def _setup_gpio(self):
        """Initialize GPIO pins for relay control and band decoder input."""
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)

        # Relay output pins (active LOW for most relay boards)
        for pin in self.relay_pins:
            GPIO.setup(pin, GPIO.OUT, initial=GPIO.HIGH)

        # Inhibit pin prevents hot-switching during TX
        GPIO.setup(self.inhibit_pin, GPIO.OUT, initial=GPIO.LOW)

        # Band decoder input pins (BCD from radio)
        for pin in self.band_pins:
            GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

        logger.info("GPIO initialized: %d relay pins, %d band pins",
                     len(self.relay_pins), len(self.band_pins))

    def read_band_decoder(self):
        """Read BCD band decoder value from radio CAT interface."""
        value = 0
        for i, pin in enumerate(self.band_pins):
            if GPIO.input(pin):
                value |= (1 << i)
        return value

    def select_antenna(self, antenna_num):
        """Switch to specified antenna port (0-based index)."""
        if antenna_num < 0 or antenna_num >= self.config["max_antennas"]:
            logger.error("Invalid antenna number: %d", antenna_num)
            return False

        with self.lock:
            # Activate inhibit to prevent hot-switching during TX
            GPIO.output(self.inhibit_pin, GPIO.HIGH)
            time.sleep(self.config["switch_delay_ms"] / 1000.0)

            # Deactivate all relays first (break-before-make)
            for pin in self.relay_pins:
                GPIO.output(pin, GPIO.HIGH)
            time.sleep(0.01)

            # Activate selected antenna relay
            GPIO.output(self.relay_pins[antenna_num], GPIO.LOW)
            self.current_antenna = antenna_num

            # Release inhibit
            time.sleep(self.config["switch_delay_ms"] / 1000.0)
            GPIO.output(self.inhibit_pin, GPIO.LOW)

            self.switch_log.append({
                "time": datetime.utcnow().isoformat(),
                "antenna": antenna_num,
                "band": self.read_band_decoder(),
            })
            logger.info("Switched to antenna %d", antenna_num)
            return True

    def get_status(self):
        """Return current switch matrix status."""
        relay_states = {}
        for i, pin in enumerate(self.relay_pins):
            relay_states[f"ant_{i}"] = not GPIO.input(pin)  # Active LOW
        return {
            "current_antenna": self.current_antenna,
            "band_decoder": self.read_band_decoder(),
            "relays": relay_states,
            "inhibit": bool(GPIO.input(self.inhibit_pin)),
            "recent_switches": self.switch_log[-10:],
        }

    def cleanup(self):
        """Safe shutdown: deactivate all relays."""
        for pin in self.relay_pins:
            GPIO.output(pin, GPIO.HIGH)
        GPIO.output(self.inhibit_pin, GPIO.LOW)
        GPIO.cleanup()
        logger.info("GPIO cleaned up, all relays deactivated")


# --- Load config ---
def load_config():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE) as f:
            return {**DEFAULT_CONFIG, **json.load(f)}
    return DEFAULT_CONFIG.copy()

config = load_config()
controller = AntennaSwitchController(config)


# --- Flask Routes ---
@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi Antenna Switch</title></head><body>
    <h1>Antenna Switch Controller</h1>
    <div id="status"></div>
    <script>
    setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('status').innerText=JSON.stringify(d,null,2);
    }),1000);
    </script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(controller.get_status())

@app.route("/api/switch/<int:ant>", methods=["POST"])
def api_switch(ant):
    ok = controller.select_antenna(ant)
    return jsonify({"success": ok, "antenna": ant})

@app.route("/api/band")
def api_band():
    return jsonify({"band_decoder_value": controller.read_band_decoder()})


# --- Band decoder auto-switch thread ---
def band_decoder_thread():
    """Monitor band decoder and auto-switch antenna based on mapping."""
    band_map = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7}
    last_band = -1
    while True:
        band = controller.read_band_decoder()
        if band != last_band and band in band_map:
            controller.select_antenna(band_map[band])
            last_band = band
        time.sleep(0.25)


if __name__ == "__main__":
    try:
        decoder = threading.Thread(target=band_decoder_thread, daemon=True)
        decoder.start()
        logger.info("Starting Antenna Switch Controller on port %d", config["port"])
        app.run(host="0.0.0.0", port=config["port"], debug=False)
    except KeyboardInterrupt:
        logger.info("Shutting down...")
    finally:
        controller.cleanup()
