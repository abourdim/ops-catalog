#!/usr/bin/env python3
"""Radio Archaeology — RPi Ground-Penetrating Radar Controller
Controls GPR system using RPi GPIO, processes radar returns,
and builds subsurface maps for archaeological discovery.
"""

import numpy as np
import time
import json
import os
import logging
from datetime import datetime
from scipy import signal as scipy_signal

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
logger = logging.getLogger(__name__)

PIPE_PATH = "/tmp/sdr_archaeology_pipe"
LOG_PATH = os.path.expanduser("~/archaeology_scans/")
VELOCITY_M_NS = 0.1
SAMPLE_RATE = 2.4e6

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    MOTOR_STEP = 18
    MOTOR_DIR = 27
    STATUS_LED = 22
    GPIO.setup(MOTOR_STEP, GPIO.OUT)
    GPIO.setup(MOTOR_DIR, GPIO.OUT)
    GPIO.setup(STATUS_LED, GPIO.OUT)
    HAS_GPIO = True
except Exception:
    HAS_GPIO = False


class GPRProcessor:
    def __init__(self):
        self.scan_lines = []
        self.position_m = 0.0
        self.step_size_m = 0.02
        self.detections = []

    def process_trace(self, iq_samples):
        envelope = np.abs(scipy_signal.hilbert(np.real(iq_samples[:2048])))
        t_axis = np.arange(len(envelope)) / SAMPLE_RATE * 1e9
        depth_axis = t_axis * VELOCITY_M_NS / 2
        bg_removed = envelope - np.mean(envelope)
        gain_curve = np.exp(np.linspace(0, 3, len(bg_removed)))
        gained = bg_removed * gain_curve
        self.scan_lines.append(gained)
        return gained, depth_axis

    def detect_anomalies(self, trace, depth_axis, threshold=0.5):
        peaks, _ = scipy_signal.find_peaks(trace, height=threshold * np.max(trace), distance=50)
        anomalies = []
        for peak in peaks:
            if peak < len(depth_axis):
                anomalies.append({"depth_m": float(depth_axis[peak]),
                                  "amplitude": float(trace[peak]),
                                  "position_m": self.position_m})
        self.detections.extend(anomalies)
        return anomalies

    def advance_position(self):
        self.position_m += self.step_size_m
        if HAS_GPIO:
            GPIO.output(MOTOR_DIR, GPIO.HIGH)
            for _ in range(10):
                GPIO.output(MOTOR_STEP, GPIO.HIGH)
                time.sleep(0.001)
                GPIO.output(MOTOR_STEP, GPIO.LOW)
                time.sleep(0.001)

    def save_scan(self):
        os.makedirs(LOG_PATH, exist_ok=True)
        data = {"timestamp": datetime.now().isoformat(), "num_traces": len(self.scan_lines),
                "scan_length_m": self.position_m, "detections": self.detections[-20:]}
        fname = datetime.now().strftime("scan_%Y%m%d_%H%M%S.json")
        with open(os.path.join(LOG_PATH, fname), 'w') as f:
            json.dump(data, f, indent=2)


def read_radar_pipe(num_samples=4096):
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(num_samples * 8)
            if len(raw) >= 8:
                return np.frombuffer(raw, dtype=np.complex64)
        except Exception:
            pass
    t = np.arange(num_samples) / SAMPLE_RATE
    pulse = np.zeros(num_samples, dtype=np.complex64)
    for depth in [0.5, 1.2, 2.5, 3.8]:
        delay = int(2 * depth / VELOCITY_M_NS * SAMPLE_RATE / 1e9)
        if delay < num_samples - 50:
            amp = 0.3 * np.exp(-depth / 3)
            pulse[delay:delay + 50] += amp * np.exp(2j * np.pi * 500e3 * t[:50])
    noise = 0.01 * (np.random.randn(num_samples) + 1j * np.random.randn(num_samples))
    return (pulse + noise).astype(np.complex64)


def main():
    logger.info("=== Radio Archaeology — RPi GPR Controller ===")
    gpr = GPRProcessor()
    if HAS_GPIO:
        GPIO.output(STATUS_LED, GPIO.HIGH)
    try:
        trace_num = 0
        while True:
            iq = read_radar_pipe()
            trace, depths = gpr.process_trace(iq)
            anomalies = gpr.detect_anomalies(trace, depths)
            gpr.advance_position()
            trace_num += 1
            for a in anomalies:
                logger.info(f"DETECTION: depth={a['depth_m']:.2f}m pos={a['position_m']:.2f}m")
            if trace_num % 10 == 0:
                logger.info(f"Trace {trace_num}: pos={gpr.position_m:.2f}m | {len(gpr.detections)} detections")
            if trace_num % 50 == 0:
                gpr.save_scan()
            time.sleep(0.2)
    except KeyboardInterrupt:
        gpr.save_scan()
        logger.info(f"Stopped. {trace_num} traces, {len(gpr.detections)} detections")
        if HAS_GPIO:
            GPIO.cleanup()


if __name__ == "__main__":
    main()
