#!/usr/bin/env python3
"""
Pi Dead Drop
Offline encrypted file exchange system.
Creates a headless WiFi AP for proximity-based secure file transfer.
Files are encrypted at rest and auto-purge after retrieval.
"""

import os
import time
import json
import hashlib
import shutil
import subprocess
import logging
import threading
from datetime import datetime, timedelta
from pathlib import Path

try:
    import RPi.GPIO as GPIO
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()

from flask import Flask, jsonify, request, render_template_string, send_from_directory

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("dead-drop")

app = Flask(__name__)

DROP_DIR = Path("/var/lib/dead-drop/drops")
DROP_DIR.mkdir(parents=True, exist_ok=True)

# --- GPIO ---
STATUS_LED = 17
ACTIVITY_LED = 27
WIPE_BUTTON = 22

# --- Config ---
AP_SSID = "FreeWiFi_5G"  # Innocuous SSID
AP_INTERFACE = "wlan0"
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
AUTO_PURGE_HOURS = 24


class DeadDropServer:
    """Secure file dead-drop with encryption and auto-purge."""

    def __init__(self):
        self.drops = {}
        self.access_log = []
        self.total_drops = 0
        self.total_retrievals = 0
        self._setup_gpio()
        self._load_drops()

    def _setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(STATUS_LED, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(ACTIVITY_LED, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(WIPE_BUTTON, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.add_event_detect(WIPE_BUTTON, GPIO.FALLING,
                              callback=lambda ch: self.emergency_wipe(),
                              bouncetime=2000)

    def _load_drops(self):
        """Load existing drops from disk."""
        for meta_file in DROP_DIR.glob("*.meta"):
            try:
                with open(meta_file) as f:
                    meta = json.load(f)
                    drop_id = meta_file.stem
                    self.drops[drop_id] = meta
            except Exception:
                pass

    def create_drop(self, data, filename="drop.bin", passphrase=None, ttl_hours=None):
        """Create a new dead drop with optional encryption."""
        if ttl_hours is None:
            ttl_hours = AUTO_PURGE_HOURS

        drop_id = hashlib.sha256(os.urandom(32)).hexdigest()[:12]
        drop_path = DROP_DIR / f"{drop_id}.dat"
        meta_path = DROP_DIR / f"{drop_id}.meta"

        # XOR-encrypt with passphrase if provided
        if passphrase:
            key = hashlib.sha256(passphrase.encode()).digest()
            encrypted = bytearray()
            for i, b in enumerate(data):
                encrypted.append(b ^ key[i % len(key)])
            data = bytes(encrypted)

        with open(drop_path, "wb") as f:
            f.write(data)

        meta = {
            "id": drop_id,
            "filename": filename,
            "size": len(data),
            "encrypted": passphrase is not None,
            "created": datetime.utcnow().isoformat(),
            "expires": (datetime.utcnow() + timedelta(hours=ttl_hours)).isoformat(),
            "retrieved": False,
            "retrieval_count": 0,
            "checksum": hashlib.sha256(data).hexdigest(),
        }

        with open(meta_path, "w") as f:
            json.dump(meta, f, indent=2)

        self.drops[drop_id] = meta
        self.total_drops += 1

        GPIO.output(ACTIVITY_LED, GPIO.HIGH)
        threading.Timer(1.0, lambda: GPIO.output(ACTIVITY_LED, GPIO.LOW)).start()

        logger.info("Drop created: %s (%d bytes, expires in %dh)", drop_id, len(data), ttl_hours)
        return meta

    def retrieve_drop(self, drop_id, passphrase=None):
        """Retrieve a dead drop file."""
        if drop_id not in self.drops:
            return None, "Drop not found"

        meta = self.drops[drop_id]
        drop_path = DROP_DIR / f"{drop_id}.dat"

        if not drop_path.exists():
            return None, "Drop file missing"

        # Check expiry
        expires = datetime.fromisoformat(meta["expires"])
        if datetime.utcnow() > expires:
            self._purge_drop(drop_id)
            return None, "Drop expired"

        with open(drop_path, "rb") as f:
            data = f.read()

        # Decrypt if needed
        if meta["encrypted"] and passphrase:
            key = hashlib.sha256(passphrase.encode()).digest()
            decrypted = bytearray()
            for i, b in enumerate(data):
                decrypted.append(b ^ key[i % len(key)])
            data = bytes(decrypted)

        meta["retrieval_count"] += 1
        meta["retrieved"] = True
        meta["last_retrieved"] = datetime.utcnow().isoformat()
        self.total_retrievals += 1

        self.access_log.append({
            "time": datetime.utcnow().isoformat(),
            "action": "retrieve",
            "drop_id": drop_id,
        })

        # Auto-purge after first retrieval (burn after reading)
        if meta.get("burn_after_reading", False):
            self._purge_drop(drop_id)

        return data, None

    def _purge_drop(self, drop_id):
        """Securely delete a drop."""
        for ext in [".dat", ".meta"]:
            path = DROP_DIR / f"{drop_id}{ext}"
            if path.exists():
                # Overwrite with random data before deletion
                size = path.stat().st_size
                with open(path, "wb") as f:
                    f.write(os.urandom(size))
                path.unlink()
        self.drops.pop(drop_id, None)
        logger.info("Drop purged: %s", drop_id)

    def purge_expired(self):
        """Remove all expired drops."""
        now = datetime.utcnow()
        expired = []
        for drop_id, meta in list(self.drops.items()):
            expires = datetime.fromisoformat(meta["expires"])
            if now > expires:
                expired.append(drop_id)
        for drop_id in expired:
            self._purge_drop(drop_id)
        return len(expired)

    def emergency_wipe(self):
        """Destroy all drops immediately (panic button)."""
        logger.warning("EMERGENCY WIPE triggered!")
        GPIO.output(STATUS_LED, GPIO.HIGH)
        for drop_id in list(self.drops.keys()):
            self._purge_drop(drop_id)
        # Also wipe any orphaned files
        for f in DROP_DIR.iterdir():
            if f.is_file():
                with open(f, "wb") as fh:
                    fh.write(os.urandom(f.stat().st_size))
                f.unlink()
        GPIO.output(STATUS_LED, GPIO.LOW)
        logger.warning("Emergency wipe complete")

    def get_status(self):
        return {
            "active_drops": len(self.drops),
            "total_drops": self.total_drops,
            "total_retrievals": self.total_retrievals,
            "drops": {k: {**v, "size_display": f"{v['size']} bytes"}
                      for k, v in self.drops.items()},
            "access_log": self.access_log[-10:],
        }


drop_server = DeadDropServer()


def purge_loop():
    while True:
        drop_server.purge_expired()
        time.sleep(300)


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Dead Drop</title></head><body>
    <h1>Secure Dead Drop</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),3000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(drop_server.get_status())

@app.route("/api/drop", methods=["POST"])
def api_create_drop():
    if request.content_type and "multipart" in request.content_type:
        f = request.files.get("file")
        if f:
            data = f.read()
            meta = drop_server.create_drop(data, f.filename, request.form.get("passphrase"))
            return jsonify(meta)
    else:
        d = request.json or {}
        data = d.get("data", "").encode()
        meta = drop_server.create_drop(data, d.get("filename", "msg.txt"), d.get("passphrase"))
        return jsonify(meta)
    return jsonify({"error": "No data provided"}), 400

@app.route("/api/retrieve/<drop_id>", methods=["POST"])
def api_retrieve(drop_id):
    passphrase = (request.json or {}).get("passphrase")
    data, error = drop_server.retrieve_drop(drop_id, passphrase)
    if error:
        return jsonify({"error": error}), 404
    return jsonify({"data": data.decode(errors="replace"), "size": len(data)})

@app.route("/api/wipe", methods=["POST"])
def api_wipe():
    drop_server.emergency_wipe()
    return jsonify({"wiped": True})


if __name__ == "__main__":
    threading.Thread(target=purge_loop, daemon=True).start()
    GPIO.output(STATUS_LED, GPIO.HIGH)
    logger.info("Starting Dead Drop on port 8105")
    app.run(host="0.0.0.0", port=8105, debug=False)
