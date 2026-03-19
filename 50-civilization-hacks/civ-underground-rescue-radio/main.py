#!/usr/bin/env python3
"""Underground Rescue Radio — RPi Through-the-Earth Communication
Manages VLF/ELF radio for communicating with trapped miners/survivors.
Handles signal processing, message encoding, and GPIO relay control.
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

PIPE_PATH = "/tmp/sdr_rescue_pipe"
LOG_PATH = os.path.expanduser("~/rescue_logs/")
VLF_FREQ = 2000
SYMBOL_RATE = 5

try:
    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    TX_RELAY = 17
    RX_INDICATOR = 18
    SOS_BUTTON = 27
    HEARTBEAT_LED = 22
    GPIO.setup(TX_RELAY, GPIO.OUT)
    GPIO.setup(RX_INDICATOR, GPIO.OUT)
    GPIO.setup(SOS_BUTTON, GPIO.IN, pull_up_down=GPIO.PUD_UP)
    GPIO.setup(HEARTBEAT_LED, GPIO.OUT)
    HAS_GPIO = True
except Exception:
    HAS_GPIO = False


class RescueRadio:
    def __init__(self):
        self.messages_sent = 0
        self.messages_received = 0
        self.link_quality = 0
        self.message_log = deque(maxlen=200)
        self.sos_active = False

    def encode_message(self, text):
        """Encode text to low-rate FSK symbols for TTE transmission."""
        bits = []
        preamble = [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0]
        bits.extend(preamble)
        for char in text[:32]:
            byte_val = ord(char) & 0xFF
            for bit in range(8):
                bits.append((byte_val >> (7 - bit)) & 1)
        crc = sum(bits) % 256
        for bit in range(8):
            bits.append((crc >> (7 - bit)) & 1)
        return bits

    def decode_message(self, bits):
        """Decode received FSK bits to text."""
        preamble = [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0]
        data_start = len(preamble)
        if len(bits) < data_start + 16:
            return None
        text = ""
        for i in range(data_start, len(bits) - 8, 8):
            byte_val = 0
            for bit in range(8):
                if i + bit < len(bits):
                    byte_val = (byte_val << 1) | bits[i + bit]
            if 32 <= byte_val < 127:
                text += chr(byte_val)
        return text if text else None

    def send_message(self, text):
        bits = self.encode_message(text)
        if HAS_GPIO:
            GPIO.output(TX_RELAY, GPIO.HIGH)
        self.messages_sent += 1
        entry = {"type": "sent", "text": text, "bits": len(bits),
                 "timestamp": datetime.now().isoformat()}
        self.message_log.append(entry)
        if HAS_GPIO:
            GPIO.output(TX_RELAY, GPIO.LOW)
        return bits

    def receive_message(self, bits):
        text = self.decode_message(bits)
        if text:
            self.messages_received += 1
            if HAS_GPIO:
                GPIO.output(RX_INDICATOR, GPIO.HIGH)
                time.sleep(0.5)
                GPIO.output(RX_INDICATOR, GPIO.LOW)
            entry = {"type": "received", "text": text, "timestamp": datetime.now().isoformat()}
            self.message_log.append(entry)
            logger.info(f"RECEIVED: '{text}'")
        return text

    def send_sos(self):
        self.sos_active = True
        return self.send_message("SOS TRAPPED NEED RESCUE")

    def send_heartbeat(self):
        return self.send_message("HB OK")

    def save_log(self):
        os.makedirs(LOG_PATH, exist_ok=True)
        with open(os.path.join(LOG_PATH, "messages.jsonl"), 'a') as f:
            for msg in list(self.message_log)[-10:]:
                f.write(json.dumps(msg) + "\n")


def read_from_sdr():
    if os.path.exists(PIPE_PATH):
        try:
            with open(PIPE_PATH, 'rb') as f:
                raw = f.read(2048)
            if raw:
                return json.loads(raw.decode())
        except Exception:
            pass
    return None


def main():
    logger.info("=== Underground Rescue Radio — RPi TTE Comms ===")
    radio = RescueRadio()
    heartbeat_timer = 0
    try:
        while True:
            incoming = read_from_sdr()
            if incoming and "bits" in incoming:
                radio.receive_message(incoming["bits"])
            if HAS_GPIO and not GPIO.input(SOS_BUTTON):
                bits = radio.send_sos()
                logger.warning(f"SOS SENT! ({len(bits)} bits)")
            heartbeat_timer += 1
            if heartbeat_timer >= 30:
                bits = radio.send_heartbeat()
                if HAS_GPIO:
                    GPIO.output(HEARTBEAT_LED, GPIO.HIGH)
                    time.sleep(0.1)
                    GPIO.output(HEARTBEAT_LED, GPIO.LOW)
                heartbeat_timer = 0
            logger.info(f"Rescue Radio: sent={radio.messages_sent} rx={radio.messages_received} "
                        f"sos={'ACTIVE' if radio.sos_active else 'standby'}")
            if radio.messages_sent % 10 == 0 and radio.messages_sent > 0:
                radio.save_log()
            time.sleep(1)
    except KeyboardInterrupt:
        radio.save_log()
        logger.info(f"Stopped. S={radio.messages_sent} R={radio.messages_received}")
        if HAS_GPIO:
            GPIO.cleanup()


if __name__ == "__main__":
    main()
