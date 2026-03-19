#!/usr/bin/env python3
"""
Pi Phased Array Controller
Controls phase-shifting networks for phased array antenna systems.
Uses I2C DACs and GPIO for beam steering and null placement.
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
    import smbus2
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()
    smbus2 = MagicMock()

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("phased-array")

app = Flask(__name__)

# --- Configuration ---
I2C_BUS = 1
DAC_ADDRESSES = [0x60, 0x61, 0x62, 0x63]  # MCP4725 DAC addresses for 4 elements
ELEMENT_SPACING_M = 0.5  # Half-wavelength at design frequency
DESIGN_FREQ_MHZ = 300.0  # Design center frequency
SPEED_OF_LIGHT = 299792458.0


class PhasedArrayController:
    """Controls a phased array antenna via I2C DAC phase shifters."""

    def __init__(self, num_elements=4):
        self.num_elements = num_elements
        self.bus = None
        self.current_phases = [0.0] * num_elements
        self.current_beam_angle = 0.0
        self.scan_active = False
        self.lock = threading.Lock()
        self._init_hardware()

    def _init_hardware(self):
        """Initialize I2C bus and GPIO for array control."""
        try:
            self.bus = smbus2.SMBus(I2C_BUS)
            logger.info("I2C bus %d initialized for %d elements", I2C_BUS, self.num_elements)
        except Exception as e:
            logger.warning("I2C init failed: %s (running in simulation mode)", e)
            self.bus = None

        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        # TX/RX switch pin
        GPIO.setup(25, GPIO.OUT, initial=GPIO.LOW)
        # Calibration trigger pin
        GPIO.setup(24, GPIO.OUT, initial=GPIO.LOW)

    def calculate_phases(self, beam_angle_deg, freq_mhz=None):
        """Calculate element phases for desired beam steering angle."""
        if freq_mhz is None:
            freq_mhz = DESIGN_FREQ_MHZ

        wavelength = SPEED_OF_LIGHT / (freq_mhz * 1e6)
        angle_rad = math.radians(beam_angle_deg)
        phase_increment = (2 * math.pi * ELEMENT_SPACING_M * math.sin(angle_rad)) / wavelength

        phases = []
        for i in range(self.num_elements):
            phase = (i * phase_increment) % (2 * math.pi)
            phases.append(math.degrees(phase))
        return phases

    def set_element_phase(self, element_idx, phase_deg):
        """Set phase for a single element via I2C DAC."""
        if element_idx >= self.num_elements:
            return False

        # Convert phase (0-360) to DAC value (0-4095 for 12-bit MCP4725)
        dac_value = int((phase_deg % 360.0) / 360.0 * 4095)
        dac_value = max(0, min(4095, dac_value))

        if self.bus and element_idx < len(DAC_ADDRESSES):
            try:
                # MCP4725 fast write: upper 4 bits in first byte, lower 8 in second
                high_byte = (dac_value >> 8) & 0x0F
                low_byte = dac_value & 0xFF
                self.bus.write_i2c_block_data(DAC_ADDRESSES[element_idx], high_byte, [low_byte])
            except Exception as e:
                logger.error("DAC write failed for element %d: %s", element_idx, e)
                return False

        self.current_phases[element_idx] = phase_deg
        return True

    def steer_beam(self, angle_deg, freq_mhz=None):
        """Steer the main beam to specified angle."""
        with self.lock:
            phases = self.calculate_phases(angle_deg, freq_mhz)
            for i, phase in enumerate(phases):
                self.set_element_phase(i, phase)
            self.current_beam_angle = angle_deg
            logger.info("Beam steered to %.1f deg, phases: %s",
                        angle_deg, [f"{p:.1f}" for p in phases])
            return {"angle": angle_deg, "phases": phases}

    def place_null(self, null_angle_deg, beam_angle_deg=None):
        """Place a null at specified direction while maintaining beam."""
        if beam_angle_deg is None:
            beam_angle_deg = self.current_beam_angle
        # Simple null placement using phase gradient adjustment
        phases = self.calculate_phases(beam_angle_deg)
        null_phases = self.calculate_phases(null_angle_deg)
        # Subtract null contribution with weighting
        adjusted = []
        for i in range(self.num_elements):
            adj = phases[i] - 0.3 * null_phases[i]
            adjusted.append(adj % 360.0)
        with self.lock:
            for i, phase in enumerate(adjusted):
                self.set_element_phase(i, phase)
        return {"beam": beam_angle_deg, "null": null_angle_deg, "phases": adjusted}

    def compute_pattern(self, freq_mhz=None, points=360):
        """Compute theoretical radiation pattern for current phase settings."""
        if freq_mhz is None:
            freq_mhz = DESIGN_FREQ_MHZ
        wavelength = SPEED_OF_LIGHT / (freq_mhz * 1e6)
        k = 2 * math.pi / wavelength
        pattern = []
        for deg in range(points):
            theta = math.radians(deg - 180)
            af = 0.0 + 0.0j
            for n in range(self.num_elements):
                phase_rad = math.radians(self.current_phases[n])
                psi = k * ELEMENT_SPACING_M * math.sin(theta) - phase_rad
                af += complex(math.cos(psi), math.sin(psi))
            magnitude = abs(af) / self.num_elements
            gain_db = 20 * math.log10(max(magnitude, 1e-10))
            pattern.append({"angle": deg - 180, "gain_db": round(gain_db, 2)})
        return pattern

    def get_status(self):
        return {
            "num_elements": self.num_elements,
            "current_beam_angle": self.current_beam_angle,
            "current_phases": [round(p, 1) for p in self.current_phases],
            "scan_active": self.scan_active,
            "i2c_connected": self.bus is not None,
        }

    def cleanup(self):
        for i in range(self.num_elements):
            self.set_element_phase(i, 0.0)
        GPIO.cleanup()


controller = PhasedArrayController(num_elements=4)


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi Phased Array</title></head><body>
    <h1>Phased Array Controller</h1>
    <div id="status"></div>
    <script>
    setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('status').innerText=JSON.stringify(d,null,2);
    }),500);
    </script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(controller.get_status())

@app.route("/api/steer", methods=["POST"])
def api_steer():
    data = request.json or {}
    angle = data.get("angle", 0.0)
    result = controller.steer_beam(angle)
    return jsonify(result)

@app.route("/api/pattern")
def api_pattern():
    return jsonify({"pattern": controller.compute_pattern()})

@app.route("/api/null", methods=["POST"])
def api_null():
    data = request.json or {}
    return jsonify(controller.place_null(data.get("null_angle", 90), data.get("beam_angle")))


if __name__ == "__main__":
    try:
        logger.info("Starting Phased Array Controller on port 8082")
        app.run(host="0.0.0.0", port=8082, debug=False)
    except KeyboardInterrupt:
        pass
    finally:
        controller.cleanup()
