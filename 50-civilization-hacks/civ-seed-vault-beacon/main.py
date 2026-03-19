#!/usr/bin/env python3
"""Seed Vault Beacon — RPi Environmental Monitor & RF Beacon
Monitors seed vault conditions (temperature, humidity, radiation)
and broadcasts status beacon for remote monitoring of seed archives.
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

PIPE_PATH = "/tmp/sdr_seedvault_pipe"
LOG_PATH = os.path.expanduser("~/seedvault_logs/")
OPTIMAL_TEMP_C = -18
OPTIMAL_HUMIDITY = 20
BEACON_INTERVAL_S = 60

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    TEMP_SENSOR = 4
    HUMIDITY_SENSOR = 17
    DOOR_SENSOR = 27
    COMPRESSOR_RELAY = 22
    ALERT_LED = 23
    BACKUP_POWER = 24
    GPIO.setup(DOOR_SENSOR, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.setup(COMPRESSOR_RELAY, GPIO.OUT)
    GPIO.setup(ALERT_LED, GPIO.OUT)
    GPIO.setup(BACKUP_POWER, GPIO.OUT)
    HAS_GPIO = True
except Exception:
    HAS_GPIO = False


class SeedVaultMonitor:
    def __init__(self):
        self.readings = deque(maxlen=10000)
        self.alerts = []
        self.vault_status = "nominal"
        self.compressor_on = False
        self.door_open = False
        self.uptime_hours = 0

    def read_environment(self):
        temp = OPTIMAL_TEMP_C + np.random.normal(0, 0.5)
        humidity = OPTIMAL_HUMIDITY + np.random.normal(0, 2)
        if np.random.rand() < 0.02:
            temp += np.random.uniform(2, 10)
        return {"temperature_c": round(temp, 2), "humidity_pct": round(max(0, min(100, humidity)), 1),
                "pressure_hpa": round(1013 + np.random.normal(0, 5), 1),
                "radiation_usv": round(max(0, 0.1 + np.random.normal(0, 0.02)), 3)}

    def check_conditions(self, env):
        alerts = []
        if env["temperature_c"] > OPTIMAL_TEMP_C + 3:
            alerts.append({"type": "TEMP_HIGH", "value": env["temperature_c"], "threshold": OPTIMAL_TEMP_C + 3})
            self._activate_compressor()
        elif env["temperature_c"] < OPTIMAL_TEMP_C - 5:
            alerts.append({"type": "TEMP_LOW", "value": env["temperature_c"]})
        else:
            self._deactivate_compressor()
        if env["humidity_pct"] > 35:
            alerts.append({"type": "HUMIDITY_HIGH", "value": env["humidity_pct"]})
        if env["radiation_usv"] > 0.5:
            alerts.append({"type": "RADIATION_HIGH", "value": env["radiation_usv"]})
        if HAS_GPIO and not GPIO.input(DOOR_SENSOR):
            self.door_open = True
            alerts.append({"type": "DOOR_OPEN"})
        self.vault_status = "alert" if alerts else "nominal"
        if HAS_GPIO:
            GPIO.output(ALERT_LED, len(alerts) > 0)
        if alerts:
            self.alerts.extend(alerts)
        return alerts

    def _activate_compressor(self):
        if not self.compressor_on:
            self.compressor_on = True
            if HAS_GPIO:
                GPIO.output(COMPRESSOR_RELAY, GPIO.HIGH)
            logger.info("Compressor ON")

    def _deactivate_compressor(self):
        if self.compressor_on:
            self.compressor_on = False
            if HAS_GPIO:
                GPIO.output(COMPRESSOR_RELAY, GPIO.LOW)

    def create_beacon(self, env):
        """Create status beacon for RF transmission."""
        return {"vault_id": "SV-001", "status": self.vault_status,
                "temp_c": env["temperature_c"], "hum_pct": env["humidity_pct"],
                "rad_usv": env["radiation_usv"], "compressor": self.compressor_on,
                "door": self.door_open, "uptime_h": self.uptime_hours,
                "timestamp": datetime.now().isoformat()}

    def save_reading(self, env, beacon):
        self.readings.append(beacon)
        os.makedirs(LOG_PATH, exist_ok=True)
        with open(os.path.join(LOG_PATH, "vault_log.jsonl"), 'a') as f:
            f.write(json.dumps(beacon) + "\n")


def main():
    logger.info("=== Seed Vault Beacon — RPi Environmental Monitor ===")
    vault = SeedVaultMonitor()
    beacon_timer = 0
    try:
        while True:
            env = vault.read_environment()
            alerts = vault.check_conditions(env)
            beacon = vault.create_beacon(env)
            beacon_timer += 1
            if beacon_timer >= BEACON_INTERVAL_S or alerts:
                vault.save_reading(env, beacon)
                beacon_timer = 0
            vault.uptime_hours = len(vault.readings) * BEACON_INTERVAL_S / 3600
            if alerts:
                for a in alerts:
                    logger.warning(f"ALERT: {a['type']} = {a.get('value', 'N/A')}")
            logger.info(f"[{vault.vault_status.upper()}] T={env['temperature_c']:.1f}C "
                        f"H={env['humidity_pct']:.0f}% Rad={env['radiation_usv']:.3f}uSv "
                        f"{'COMP:ON' if vault.compressor_on else ''}")
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info(f"Stopped. {len(vault.readings)} readings, {len(vault.alerts)} alerts.")
        if HAS_GPIO:
            GPIO.cleanup()


if __name__ == "__main__":
    main()
