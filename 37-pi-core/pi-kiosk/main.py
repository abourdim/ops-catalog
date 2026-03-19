#!/usr/bin/env python3
"""
Pi Kiosk
Full-screen kiosk display controller for Raspberry Pi.
Auto-launches Chromium in kiosk mode with touchscreen support,
screen blanking control, and remote management API.
"""

import os
import time
import json
import subprocess
import logging
import threading
from pathlib import Path

try:
    import RPi.GPIO as GPIO
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()

from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("kiosk")

app = Flask(__name__)

# --- Configuration ---
CONFIG_FILE = "/etc/pi-kiosk/config.json"
DEFAULT_CONFIG = {
    "url": "http://localhost:8089/dashboard",
    "rotation": 0,          # 0, 90, 180, 270
    "brightness": 100,      # 0-100 percent
    "screen_timeout": 0,    # 0 = never blank
    "refresh_interval": 0,  # 0 = no auto-refresh
    "show_cursor": False,
    "gpio_button_pin": 26,  # Physical button for screen wake
    "backlight_pin": 18,    # PWM backlight control
}


class KioskController:
    """Manages kiosk display, browser, and screen settings."""

    def __init__(self, config):
        self.config = config
        self.browser_process = None
        self.screen_on = True
        self.current_url = config["url"]
        self.uptime_start = time.time()
        self.pwm = None
        self._setup_gpio()

    def _setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)

        # Button input for screen wake
        btn_pin = self.config["gpio_button_pin"]
        GPIO.setup(btn_pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.add_event_detect(btn_pin, GPIO.FALLING,
                              callback=lambda ch: self.wake_screen(),
                              bouncetime=300)

        # PWM backlight control
        bl_pin = self.config["backlight_pin"]
        GPIO.setup(bl_pin, GPIO.OUT)
        self.pwm = GPIO.PWM(bl_pin, 1000)
        self.pwm.start(self.config["brightness"])

    def set_brightness(self, percent):
        """Set display backlight brightness via PWM."""
        percent = max(0, min(100, percent))
        self.config["brightness"] = percent
        if self.pwm:
            self.pwm.ChangeDutyCycle(percent)

        # Also try official backlight interface
        bl_path = "/sys/class/backlight/rpi_backlight/brightness"
        if os.path.exists(bl_path):
            hw_val = int(percent * 255 / 100)
            try:
                with open(bl_path, "w") as f:
                    f.write(str(hw_val))
            except PermissionError:
                pass
        logger.info("Brightness set to %d%%", percent)

    def set_rotation(self, degrees):
        """Set display rotation."""
        if degrees in (0, 90, 180, 270):
            self.config["rotation"] = degrees
            # Use xrandr for rotation
            rotation_map = {0: "normal", 90: "left", 180: "inverted", 270: "right"}
            subprocess.run(["xrandr", "--output", "HDMI-1", "--rotate",
                           rotation_map[degrees]], capture_output=True)

    def launch_browser(self):
        """Launch Chromium in kiosk mode."""
        if self.browser_process:
            self.kill_browser()

        env = os.environ.copy()
        env["DISPLAY"] = ":0"

        cursor_flag = "" if self.config["show_cursor"] else "--kiosk"
        cmd = [
            "chromium-browser",
            "--noerrdialogs",
            "--disable-infobars",
            "--disable-session-crashed-bubble",
            "--disable-translate",
            "--no-first-run",
            cursor_flag,
            "--incognito",
            "--disable-pinch",
            f"--app={self.current_url}",
        ]
        cmd = [c for c in cmd if c]  # Remove empty strings

        self.browser_process = subprocess.Popen(cmd, env=env)
        logger.info("Browser launched: %s (PID %d)", self.current_url, self.browser_process.pid)

    def kill_browser(self):
        """Kill running browser instance."""
        if self.browser_process:
            self.browser_process.terminate()
            self.browser_process.wait(timeout=5)
            self.browser_process = None
        subprocess.run(["pkill", "-f", "chromium-browser"], capture_output=True)

    def navigate(self, url):
        """Navigate browser to new URL."""
        self.current_url = url
        # Use xdotool to send URL to browser
        subprocess.run(["xdotool", "key", "F5"], env={"DISPLAY": ":0"}, capture_output=True)
        self.launch_browser()

    def blank_screen(self):
        """Turn off display."""
        subprocess.run(["xset", "-display", ":0", "dpms", "force", "off"], capture_output=True)
        self.screen_on = False

    def wake_screen(self):
        """Turn on display."""
        subprocess.run(["xset", "-display", ":0", "dpms", "force", "on"], capture_output=True)
        subprocess.run(["xset", "-display", ":0", "s", "reset"], capture_output=True)
        self.screen_on = True

    def take_screenshot(self):
        """Capture current screen."""
        path = "/tmp/kiosk_screenshot.png"
        subprocess.run(["scrot", path], env={"DISPLAY": ":0"}, capture_output=True)
        return path

    def get_system_info(self):
        """Get system temperature and memory."""
        temp = "N/A"
        try:
            with open("/sys/class/thermal/thermal_zone0/temp") as f:
                temp = f"{int(f.read().strip()) / 1000:.1f}C"
        except Exception:
            pass

        mem = "N/A"
        try:
            result = subprocess.run(["free", "-m"], capture_output=True, text=True)
            lines = result.stdout.strip().split("\n")
            if len(lines) > 1:
                parts = lines[1].split()
                mem = f"{parts[2]}MB / {parts[1]}MB"
        except Exception:
            pass
        return {"cpu_temp": temp, "memory": mem}

    def get_status(self):
        return {
            "url": self.current_url,
            "screen_on": self.screen_on,
            "brightness": self.config["brightness"],
            "rotation": self.config["rotation"],
            "browser_running": self.browser_process is not None and self.browser_process.poll() is None,
            "uptime_seconds": int(time.time() - self.uptime_start),
            "system": self.get_system_info(),
        }


config = DEFAULT_CONFIG.copy()
if os.path.exists(CONFIG_FILE):
    with open(CONFIG_FILE) as f:
        config.update(json.load(f))

kiosk = KioskController(config)


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi Kiosk Control</title></head><body>
    <h1>Kiosk Controller</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),2000);</script></body></html>
    """)

@app.route("/dashboard")
def dashboard():
    return render_template_string("<html><body><h1>Pi Kiosk Dashboard</h1></body></html>")

@app.route("/api/status")
def api_status():
    return jsonify(kiosk.get_status())

@app.route("/api/navigate", methods=["POST"])
def api_navigate():
    url = request.json.get("url", "")
    kiosk.navigate(url)
    return jsonify({"url": url})

@app.route("/api/brightness", methods=["POST"])
def api_brightness():
    val = request.json.get("brightness", 100)
    kiosk.set_brightness(val)
    return jsonify({"brightness": val})

@app.route("/api/screen/<action>", methods=["POST"])
def api_screen(action):
    if action == "on":
        kiosk.wake_screen()
    elif action == "off":
        kiosk.blank_screen()
    return jsonify({"screen_on": kiosk.screen_on})

@app.route("/api/restart", methods=["POST"])
def api_restart():
    kiosk.launch_browser()
    return jsonify({"restarted": True})


if __name__ == "__main__":
    try:
        kiosk.launch_browser()
        logger.info("Starting Kiosk Controller on port 8089")
        app.run(host="0.0.0.0", port=8089, debug=False)
    except KeyboardInterrupt:
        kiosk.kill_browser()
    finally:
        GPIO.cleanup()
