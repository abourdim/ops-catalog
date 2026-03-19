#!/usr/bin/env python3
"""
Pi Burst Transmitter
Compresses and transmits data in high-speed radio bursts.
Minimizes on-air time by encoding data into short transmission windows.
"""

import os
import time
import json
import zlib
import base64
import hashlib
import struct
import logging
import threading
from datetime import datetime

try:
    import RPi.GPIO as GPIO
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()

from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("burst-tx")

app = Flask(__name__)

# --- Pin Configuration ---
PTT_PIN = 17
TX_LED_PIN = 27
AUDIO_OUT_PIN = 18   # PWM for AFSK tone generation
READY_LED = 22


class BurstEncoder:
    """Encodes data into compressed burst-ready packets."""

    SYNC_PATTERN = bytes([0xAA, 0x55, 0xAA, 0x55])
    MAX_PAYLOAD = 4096

    def __init__(self):
        self.packets_encoded = 0

    def encode_packet(self, data, sequence_num=0):
        """Create a burst transmission packet with header, data, and checksum."""
        if isinstance(data, str):
            data = data.encode("utf-8")

        # Compress payload
        compressed = zlib.compress(data, level=9)
        compression_ratio = len(data) / max(len(compressed), 1)

        # Build packet: SYNC + HEADER + PAYLOAD + CRC
        header = struct.pack("!HHI",
                             sequence_num,        # 2 bytes: sequence number
                             len(compressed),     # 2 bytes: payload length
                             len(data))           # 4 bytes: original length

        packet = self.SYNC_PATTERN + header + compressed
        crc = zlib.crc32(packet) & 0xFFFFFFFF
        packet += struct.pack("!I", crc)

        self.packets_encoded += 1
        return {
            "packet": base64.b64encode(packet).decode(),
            "original_size": len(data),
            "compressed_size": len(compressed),
            "packet_size": len(packet),
            "compression_ratio": round(compression_ratio, 2),
            "crc32": f"{crc:08x}",
            "sequence": sequence_num,
        }

    def decode_packet(self, packet_b64):
        """Decode and verify a burst packet."""
        packet = base64.b64decode(packet_b64)

        # Verify sync pattern
        if packet[:4] != self.SYNC_PATTERN:
            return {"error": "Invalid sync pattern"}

        # Extract header
        seq, payload_len, original_len = struct.unpack("!HHI", packet[4:12])

        # Verify CRC
        stored_crc = struct.unpack("!I", packet[-4:])[0]
        calc_crc = zlib.crc32(packet[:-4]) & 0xFFFFFFFF
        if stored_crc != calc_crc:
            return {"error": "CRC mismatch", "expected": f"{stored_crc:08x}", "got": f"{calc_crc:08x}"}

        # Decompress payload
        compressed = packet[12:-4]
        data = zlib.decompress(compressed)

        return {
            "sequence": seq,
            "data": data.decode("utf-8", errors="replace"),
            "original_size": len(data),
            "compressed_size": len(compressed),
            "crc_valid": True,
        }

    def split_message(self, data, max_chunk=256):
        """Split large message into multiple burst packets."""
        if isinstance(data, str):
            data = data.encode("utf-8")
        packets = []
        for i in range(0, len(data), max_chunk):
            chunk = data[i:i + max_chunk]
            pkt = self.encode_packet(chunk, sequence_num=i // max_chunk)
            packets.append(pkt)
        return packets


class BurstTransmitter:
    """Controls radio PTT and generates AFSK burst tones."""

    def __init__(self):
        self.encoder = BurstEncoder()
        self.transmitting = False
        self.tx_count = 0
        self.total_bytes_sent = 0
        self.tx_log = []
        self.pwm = None
        self._setup_gpio()

    def _setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(PTT_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(TX_LED_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(READY_LED, GPIO.OUT, initial=GPIO.HIGH)
        GPIO.setup(AUDIO_OUT_PIN, GPIO.OUT)
        self.pwm = GPIO.PWM(AUDIO_OUT_PIN, 1200)  # AFSK mark frequency

    def generate_afsk_byte(self, byte_val):
        """Generate AFSK tones for a single byte (Bell 202 style)."""
        for bit in range(8):
            if (byte_val >> bit) & 1:
                self.pwm.ChangeFrequency(1200)  # Mark
            else:
                self.pwm.ChangeFrequency(2200)  # Space
            time.sleep(1.0 / 1200)  # Baud rate

    def transmit_burst(self, data, pre_delay=0.5, post_delay=0.3):
        """Transmit data as a compressed burst."""
        packet_info = self.encoder.encode_packet(data)
        packet_bytes = base64.b64decode(packet_info["packet"])

        with threading.Lock():
            self.transmitting = True
            GPIO.output(TX_LED_PIN, GPIO.HIGH)
            GPIO.output(READY_LED, GPIO.LOW)

            # Key PTT
            GPIO.output(PTT_PIN, GPIO.HIGH)
            time.sleep(pre_delay)

            # Transmit AFSK
            self.pwm.start(50)
            tx_start = time.time()

            for byte in packet_bytes:
                self.generate_afsk_byte(byte)

            tx_duration = time.time() - tx_start
            self.pwm.stop()

            # Release PTT
            time.sleep(post_delay)
            GPIO.output(PTT_PIN, GPIO.LOW)
            GPIO.output(TX_LED_PIN, GPIO.LOW)
            GPIO.output(READY_LED, GPIO.HIGH)
            self.transmitting = False

        self.tx_count += 1
        self.total_bytes_sent += len(packet_bytes)

        entry = {
            "time": datetime.utcnow().isoformat(),
            "packet_size": len(packet_bytes),
            "original_size": packet_info["original_size"],
            "compression": packet_info["compression_ratio"],
            "tx_duration_ms": round(tx_duration * 1000, 1),
            "data_rate_bps": round(len(packet_bytes) * 8 / max(tx_duration, 0.001)),
        }
        self.tx_log.append(entry)
        logger.info("Burst TX: %d bytes in %.1f ms (%.1f:1 compression)",
                     len(packet_bytes), tx_duration * 1000, packet_info["compression_ratio"])
        return {**packet_info, **entry}

    def get_status(self):
        return {
            "transmitting": self.transmitting,
            "tx_count": self.tx_count,
            "total_bytes_sent": self.total_bytes_sent,
            "packets_encoded": self.encoder.packets_encoded,
            "recent_transmissions": self.tx_log[-10:],
        }

    def cleanup(self):
        GPIO.output(PTT_PIN, GPIO.LOW)
        if self.pwm:
            self.pwm.stop()
        GPIO.cleanup()


tx = BurstTransmitter()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Burst Transmitter</title></head><body>
    <h1>Burst Transmitter</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),2000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(tx.get_status())

@app.route("/api/transmit", methods=["POST"])
def api_transmit():
    data = request.json.get("data", "")
    result = tx.transmit_burst(data)
    return jsonify(result)

@app.route("/api/encode", methods=["POST"])
def api_encode():
    data = request.json.get("data", "")
    return jsonify(tx.encoder.encode_packet(data))

@app.route("/api/decode", methods=["POST"])
def api_decode():
    packet = request.json.get("packet", "")
    return jsonify(tx.encoder.decode_packet(packet))


if __name__ == "__main__":
    try:
        logger.info("Starting Burst Transmitter on port 8102")
        app.run(host="0.0.0.0", port=8102, debug=False)
    except KeyboardInterrupt:
        pass
    finally:
        tx.cleanup()
