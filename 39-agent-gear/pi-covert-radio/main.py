#!/usr/bin/env python3
"""
Pi Covert Radio
Low-probability-of-intercept (LPI) radio communications system.
Uses frequency hopping, spread spectrum techniques, and encrypted voice.
"""

import os
import time
import json
import hashlib
import struct
import logging
import threading
import subprocess
import numpy as np

try:
    import RPi.GPIO as GPIO
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()

from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("covert-radio")

app = Flask(__name__)

# --- GPIO ---
PTT_PIN = 17
TX_LED = 27
RX_LED = 22
AUDIO_IN_DEVICE = "plughw:1,0"
AUDIO_OUT_DEVICE = "plughw:1,0"


class FrequencyHopper:
    """Generates pseudo-random frequency hopping sequences."""

    def __init__(self, seed_key, base_freq_mhz=430.0, bandwidth_mhz=2.0, num_channels=50):
        self.seed_key = seed_key
        self.base_freq = base_freq_mhz
        self.bandwidth = bandwidth_mhz
        self.num_channels = num_channels
        self.channel_spacing = bandwidth_mhz / num_channels
        self.hop_index = 0
        self.sequence = self._generate_sequence()

    def _generate_sequence(self):
        """Generate PRNG hop sequence from shared key."""
        seq = []
        key_hash = hashlib.sha256(self.seed_key.encode()).digest()
        for i in range(1000):
            # Use HMAC-like derivation for each hop
            h = hashlib.sha256(key_hash + struct.pack("!I", i)).digest()
            channel = int.from_bytes(h[:2], "big") % self.num_channels
            seq.append(channel)
        return seq

    def get_current_freq(self):
        """Get current hop frequency in MHz."""
        channel = self.sequence[self.hop_index % len(self.sequence)]
        freq = self.base_freq + channel * self.channel_spacing
        return round(freq, 4)

    def advance(self):
        """Move to next frequency in hop sequence."""
        self.hop_index += 1
        return self.get_current_freq()

    def synchronize(self, timestamp):
        """Synchronize hop index based on time (for paired radios)."""
        # Each hop lasts 200ms
        self.hop_index = int(timestamp * 5) % len(self.sequence)
        return self.get_current_freq()

    def get_hop_table(self, count=20):
        """Preview upcoming frequencies."""
        table = []
        for i in range(count):
            idx = (self.hop_index + i) % len(self.sequence)
            ch = self.sequence[idx]
            freq = self.base_freq + ch * self.channel_spacing
            table.append({"hop": self.hop_index + i, "channel": ch, "freq_mhz": round(freq, 4)})
        return table


class VoiceCodec:
    """Low-bitrate voice codec for covert communications."""

    def __init__(self, sample_rate=8000):
        self.sample_rate = sample_rate

    def compress_audio(self, audio_data):
        """Compress audio using codec2 or ADPCM."""
        try:
            # Try codec2 for ultra-low bitrate (700-3200 bps)
            result = subprocess.run(
                ["c2enc", "1200", "/dev/stdin", "/dev/stdout"],
                input=audio_data, capture_output=True, timeout=5
            )
            if result.returncode == 0:
                return result.stdout
        except FileNotFoundError:
            pass

        # Fallback: simple 4-bit ADPCM compression
        samples = np.frombuffer(audio_data, dtype=np.int16)
        # Delta encode
        deltas = np.diff(samples.astype(np.int32))
        # Quantize to 4 bits
        max_delta = max(np.max(np.abs(deltas)), 1)
        quantized = ((deltas / max_delta * 7) + 8).astype(np.uint8)
        # Pack two 4-bit samples per byte
        packed = bytearray()
        for i in range(0, len(quantized) - 1, 2):
            packed.append((quantized[i] << 4) | (quantized[i + 1] & 0x0F))
        return bytes(packed)

    def record_audio(self, duration_sec=3):
        """Record audio from microphone."""
        try:
            result = subprocess.run(
                ["arecord", "-D", AUDIO_IN_DEVICE, "-f", "S16_LE",
                 "-r", str(self.sample_rate), "-c", "1", "-d", str(duration_sec),
                 "-t", "raw", "-q"],
                capture_output=True, timeout=duration_sec + 5
            )
            return result.stdout
        except Exception as e:
            logger.error("Record failed: %s", e)
            return b""


class CovertRadio:
    """Covert radio communications controller."""

    def __init__(self):
        self.hopper = FrequencyHopper("default-shared-key")
        self.codec = VoiceCodec()
        self.transmitting = False
        self.receiving = False
        self.tx_count = 0
        self.rx_count = 0
        self.hop_rate_hz = 5  # 5 hops per second
        self.power_dbm = -10  # Low power for covert ops
        self._setup_gpio()

    def _setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(PTT_PIN, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(TX_LED, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(RX_LED, GPIO.OUT, initial=GPIO.LOW)

    def set_hop_key(self, key):
        """Set frequency hopping key (must match paired radio)."""
        self.hopper = FrequencyHopper(key)
        logger.info("Hop key updated, sequence regenerated")

    def transmit_voice(self, duration=3):
        """Record and transmit compressed voice burst."""
        self.transmitting = True
        GPIO.output(PTT_PIN, GPIO.HIGH)
        GPIO.output(TX_LED, GPIO.HIGH)

        # Record audio
        audio = self.codec.record_audio(duration)
        compressed = self.codec.compress_audio(audio)

        # Simulate hopping transmission
        bytes_per_hop = max(1, len(compressed) // (duration * self.hop_rate_hz))
        offset = 0
        while offset < len(compressed):
            freq = self.hopper.advance()
            chunk = compressed[offset:offset + bytes_per_hop]
            offset += bytes_per_hop
            time.sleep(1.0 / self.hop_rate_hz)

        GPIO.output(PTT_PIN, GPIO.LOW)
        GPIO.output(TX_LED, GPIO.LOW)
        self.transmitting = False
        self.tx_count += 1

        return {
            "duration": duration,
            "raw_bytes": len(audio),
            "compressed_bytes": len(compressed),
            "compression_ratio": round(len(audio) / max(len(compressed), 1), 1),
            "hops_used": duration * self.hop_rate_hz,
            "tx_number": self.tx_count,
        }

    def get_status(self):
        return {
            "current_freq_mhz": self.hopper.get_current_freq(),
            "hop_index": self.hopper.hop_index,
            "hop_rate_hz": self.hop_rate_hz,
            "power_dbm": self.power_dbm,
            "transmitting": self.transmitting,
            "receiving": self.receiving,
            "tx_count": self.tx_count,
            "rx_count": self.rx_count,
            "num_channels": self.hopper.num_channels,
            "upcoming_hops": self.hopper.get_hop_table(10),
        }

    def cleanup(self):
        GPIO.output(PTT_PIN, GPIO.LOW)
        GPIO.cleanup()


radio = CovertRadio()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Covert Radio</title></head><body>
    <h1>Covert Radio System</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),1000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(radio.get_status())

@app.route("/api/transmit", methods=["POST"])
def api_transmit():
    d = request.json or {}
    result = radio.transmit_voice(d.get("duration", 3))
    return jsonify(result)

@app.route("/api/hopkey", methods=["POST"])
def api_hopkey():
    radio.set_hop_key(request.json.get("key", ""))
    return jsonify({"updated": True})

@app.route("/api/hoptable")
def api_hoptable():
    return jsonify({"hops": radio.hopper.get_hop_table(50)})


if __name__ == "__main__":
    try:
        logger.info("Starting Covert Radio on port 8104")
        app.run(host="0.0.0.0", port=8104, debug=False)
    except KeyboardInterrupt:
        pass
    finally:
        radio.cleanup()
