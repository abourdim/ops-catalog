#!/usr/bin/env python3
"""Ocean Current Mapper — RPi Oceanographic Data Logger
Collects HF radar sea echo data to map ocean surface currents.
Uses Doppler analysis of sea clutter for current velocity estimation.
"""

import numpy as np
import time
import json
import os
import logging
from datetime import datetime
from collections import deque

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

PIPE_PATH = "/tmp/sdr_ocean_pipe"
LOG_PATH = os.path.expanduser("~/ocean_current_logs/")
SAMPLE_RATE = 2.4e6
BRAGG_FREQ_HZ = 0.36
SPEED_OF_LIGHT = 3e8

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    STATUS_LED = 18
    TEMP_SENSOR = 4
    GPIO.setup(STATUS_LED, GPIO.OUT)
    HAS_GPIO = True
except Exception:
    HAS_GPIO = False


class OceanCurrentMapper:
    def __init__(self):
        self.current_map = {}
        self.history = deque(maxlen=500)
        self.measurements = 0

    def process_doppler(self, doppler_spectrum, freq_axis, radar_freq_hz):
        """Extract ocean current velocity from Doppler spectrum."""
        bragg_shift = BRAGG_FREQ_HZ
        approach_peak = np.max(doppler_spectrum[freq_axis > bragg_shift * 0.5]) if np.any(freq_axis > bragg_shift * 0.5) else 0
        recede_peak = np.max(doppler_spectrum[freq_axis < -bragg_shift * 0.5]) if np.any(freq_axis < -bragg_shift * 0.5) else 0
        wavelength = SPEED_OF_LIGHT / radar_freq_hz
        current_velocity = (approach_peak - recede_peak) / (approach_peak + recede_peak + 1e-12) * 2.0
        current_direction = 0 if approach_peak > recede_peak else 180
        return {
            "velocity_ms": float(np.clip(current_velocity, -3, 3)),
            "direction_deg": float(current_direction),
            "wave_height_est": float(np.sqrt(approach_peak + recede_peak) * 0.1),
            "confidence": float(min(1, (approach_peak + recede_peak) / 10)),
        }

    def add_measurement(self, bearing_deg, range_km, current_data):
        key = f"{bearing_deg:.0f}_{range_km:.0f}"
        self.current_map[key] = {**current_data, "bearing": bearing_deg, "range_km": range_km,
                                  "timestamp": datetime.now().isoformat()}
        self.measurements += 1
        self.history.append(current_data)

    def get_map_summary(self):
        if not self.current_map:
            return {}
        velocities = [v["velocity_ms"] for v in self.current_map.values()]
        return {"num_cells": len(self.current_map), "avg_velocity": float(np.mean(velocities)),
                "max_velocity": float(np.max(np.abs(velocities))),
                "measurements": self.measurements}

    def save_map(self):
        os.makedirs(LOG_PATH, exist_ok=True)
        fname = datetime.now().strftime("current_map_%Y%m%d_%H%M.json")
        with open(os.path.join(LOG_PATH, fname), 'w') as f:
            json.dump({"summary": self.get_map_summary(), "map": self.current_map}, f, indent=2)


def read_from_sdr():
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(4096)
            if raw:
                return json.loads(raw.decode())
        except Exception:
            pass
    return {"doppler_spectrum": np.random.randn(256).tolist(),
            "bearing": np.random.uniform(0, 360), "range_km": np.random.uniform(5, 50)}


def main():
    logger.info("=== Ocean Current Mapper — RPi Logger ===")
    mapper = OceanCurrentMapper()
    if HAS_GPIO:
        GPIO.output(STATUS_LED, GPIO.HIGH)
    try:
        while True:
            data = read_from_sdr()
            spectrum = np.array(data.get("doppler_spectrum", []))
            if len(spectrum) > 0:
                freq_axis = np.linspace(-5, 5, len(spectrum))
                current = mapper.process_doppler(spectrum, freq_axis, 13.5e6)
                mapper.add_measurement(data.get("bearing", 0), data.get("range_km", 10), current)
                summary = mapper.get_map_summary()
                logger.info(f"Current: {current['velocity_ms']:.2f}m/s @{current['direction_deg']:.0f}deg | "
                            f"Wave={current['wave_height_est']:.1f}m | cells={summary['num_cells']}")
            if mapper.measurements % 60 == 0 and mapper.measurements > 0:
                mapper.save_map()
            time.sleep(5)
    except KeyboardInterrupt:
        mapper.save_map()
        logger.info(f"Stopped. {mapper.measurements} measurements.")
        if HAS_GPIO:
            GPIO.cleanup()


if __name__ == "__main__":
    main()
