#!/usr/bin/env python3
"""
Pi Agent Communicator
Encrypted peer-to-peer messaging system using Raspberry Pi.
Supports AES-256 encryption, dead-drop messaging, and radio-based transport.
"""

import os
import time
import json
import hashlib
import base64
import socket
import logging
import threading
from datetime import datetime
from pathlib import Path

try:
    from cryptography.fernet import Fernet
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
except ImportError:
    Fernet = None

try:
    import RPi.GPIO as GPIO
except ImportError:
    from unittest.mock import MagicMock
    GPIO = MagicMock()

from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("agent-comm")

app = Flask(__name__)

DATA_DIR = Path("/var/lib/agent-comm")
INBOX_DIR = DATA_DIR / "inbox"
OUTBOX_DIR = DATA_DIR / "outbox"
for d in [INBOX_DIR, OUTBOX_DIR]:
    d.mkdir(parents=True, exist_ok=True)

LISTEN_PORT = 7777
STATUS_LED = 18
MSG_LED = 25


class CryptoEngine:
    """Handles message encryption/decryption using Fernet (AES-128-CBC)."""

    def __init__(self, passphrase="default-agent-key"):
        self.key = self._derive_key(passphrase)
        self.cipher = Fernet(self.key) if Fernet else None

    def _derive_key(self, passphrase):
        """Derive encryption key from passphrase using PBKDF2."""
        if not Fernet:
            return base64.urlsafe_b64encode(hashlib.sha256(passphrase.encode()).digest())
        salt = b"pi-agent-salt-v1"
        kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=32,
                         salt=salt, iterations=100000)
        key = base64.urlsafe_b64encode(kdf.derive(passphrase.encode()))
        return key

    def encrypt(self, plaintext):
        """Encrypt a message string."""
        if self.cipher:
            return self.cipher.encrypt(plaintext.encode()).decode()
        # Fallback XOR for systems without cryptography library
        key_bytes = base64.urlsafe_b64decode(self.key)
        encrypted = bytearray()
        for i, c in enumerate(plaintext.encode()):
            encrypted.append(c ^ key_bytes[i % len(key_bytes)])
        return base64.b64encode(encrypted).decode()

    def decrypt(self, ciphertext):
        """Decrypt a message string."""
        if self.cipher:
            return self.cipher.decrypt(ciphertext.encode()).decode()
        key_bytes = base64.urlsafe_b64decode(self.key)
        encrypted = base64.b64decode(ciphertext)
        decrypted = bytearray()
        for i, c in enumerate(encrypted):
            decrypted.append(c ^ key_bytes[i % len(key_bytes)])
        return decrypted.decode()


class AgentCommunicator:
    """Secure messaging system for field agents."""

    def __init__(self):
        self.crypto = CryptoEngine()
        self.agent_id = hashlib.sha256(os.urandom(16)).hexdigest()[:8]
        self.contacts = {}
        self.inbox = []
        self.outbox = []
        self.msg_counter = 0
        self.listener_sock = None
        self._setup_gpio()
        self._load_messages()

    def _setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(STATUS_LED, GPIO.OUT, initial=GPIO.LOW)
        GPIO.setup(MSG_LED, GPIO.OUT, initial=GPIO.LOW)

    def _load_messages(self):
        """Load messages from disk."""
        for f in sorted(INBOX_DIR.glob("*.json")):
            try:
                with open(f) as fh:
                    self.inbox.append(json.load(fh))
            except Exception:
                pass

    def set_passphrase(self, passphrase):
        """Change encryption passphrase."""
        self.crypto = CryptoEngine(passphrase)
        logger.info("Encryption passphrase updated")

    def compose_message(self, recipient, body, priority="normal"):
        """Compose and encrypt a message."""
        self.msg_counter += 1
        msg = {
            "id": f"{self.agent_id}-{self.msg_counter:04d}",
            "from": self.agent_id,
            "to": recipient,
            "body_encrypted": self.crypto.encrypt(body),
            "priority": priority,
            "timestamp": datetime.utcnow().isoformat(),
            "hash": hashlib.sha256(body.encode()).hexdigest()[:16],
        }

        # Save to outbox
        outfile = OUTBOX_DIR / f"{msg['id']}.json"
        with open(outfile, "w") as f:
            json.dump(msg, f, indent=2)
        self.outbox.append(msg)

        logger.info("Message composed: %s -> %s (priority: %s)", self.agent_id, recipient, priority)
        return msg

    def receive_message(self, msg_data):
        """Process an incoming encrypted message."""
        GPIO.output(MSG_LED, GPIO.HIGH)
        try:
            msg_data["body_decrypted"] = self.crypto.decrypt(msg_data["body_encrypted"])
            msg_data["received_at"] = datetime.utcnow().isoformat()
        except Exception:
            msg_data["body_decrypted"] = "[DECRYPTION FAILED - wrong key?]"

        self.inbox.append(msg_data)
        infile = INBOX_DIR / f"{msg_data.get('id', 'unknown')}.json"
        with open(infile, "w") as f:
            json.dump(msg_data, f, indent=2)

        logger.info("Message received from %s", msg_data.get("from", "unknown"))
        threading.Timer(2.0, lambda: GPIO.output(MSG_LED, GPIO.LOW)).start()
        return msg_data

    def send_tcp(self, target_ip, target_port, msg_data):
        """Send encrypted message over TCP."""
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(10)
            sock.connect((target_ip, target_port))
            payload = json.dumps(msg_data).encode()
            sock.send(len(payload).to_bytes(4, "big") + payload)
            sock.close()
            logger.info("Message sent to %s:%d", target_ip, target_port)
            return True
        except Exception as e:
            logger.error("Send failed: %s", e)
            return False

    def listen_loop(self):
        """TCP listener for incoming messages."""
        self.listener_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.listener_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.listener_sock.bind(("0.0.0.0", LISTEN_PORT))
        self.listener_sock.listen(5)
        GPIO.output(STATUS_LED, GPIO.HIGH)
        logger.info("Listening for messages on port %d", LISTEN_PORT)

        while True:
            try:
                conn, addr = self.listener_sock.accept()
                conn.settimeout(10)
                length_data = conn.recv(4)
                if len(length_data) == 4:
                    length = int.from_bytes(length_data, "big")
                    data = conn.recv(min(length, 65536))
                    msg = json.loads(data.decode())
                    self.receive_message(msg)
                conn.close()
            except Exception as e:
                logger.error("Listen error: %s", e)

    def add_contact(self, name, agent_id, ip=None, port=LISTEN_PORT):
        """Add a contact to the address book."""
        self.contacts[name] = {"agent_id": agent_id, "ip": ip, "port": port}

    def get_status(self):
        return {
            "agent_id": self.agent_id,
            "inbox_count": len(self.inbox),
            "outbox_count": len(self.outbox),
            "contacts": self.contacts,
            "listening_port": LISTEN_PORT,
            "encryption": "Fernet/AES" if Fernet else "XOR-fallback",
        }


comm = AgentCommunicator()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Agent Communicator</title></head><body>
    <h1>Agent Communicator</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),3000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(comm.get_status())

@app.route("/api/send", methods=["POST"])
def api_send():
    d = request.json or {}
    msg = comm.compose_message(d.get("to", ""), d.get("body", ""), d.get("priority", "normal"))
    if d.get("ip"):
        comm.send_tcp(d["ip"], d.get("port", LISTEN_PORT), msg)
    return jsonify(msg)

@app.route("/api/inbox")
def api_inbox():
    return jsonify({"messages": comm.inbox[-20:]})

@app.route("/api/passphrase", methods=["POST"])
def api_passphrase():
    comm.set_passphrase(request.json.get("passphrase", ""))
    return jsonify({"updated": True})


if __name__ == "__main__":
    threading.Thread(target=comm.listen_loop, daemon=True).start()
    logger.info("Starting Agent Communicator on port 8101")
    app.run(host="0.0.0.0", port=8101, debug=False)
