#!/usr/bin/env python3
"""
Pi Packet BBS
AX.25 packet radio bulletin board system.
Supports mailbox, file transfer, and message forwarding via TNC.
"""

import os
import time
import json
import socket
import logging
import threading
from datetime import datetime
from pathlib import Path
from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("packet-bbs")

app = Flask(__name__)

# --- Configuration ---
BBS_CALLSIGN = "N0CALL-5"
KISS_HOST = "127.0.0.1"
KISS_PORT = 8001
DATA_DIR = Path("/var/lib/packet-bbs")
MAIL_DIR = DATA_DIR / "mail"
BULLETIN_DIR = DATA_DIR / "bulletins"
FILE_DIR = DATA_DIR / "files"

for d in [MAIL_DIR, BULLETIN_DIR, FILE_DIR]:
    d.mkdir(parents=True, exist_ok=True)


class Message:
    """Represents a BBS message."""

    def __init__(self, msg_id, from_call, to_call, subject, body, msg_type="P"):
        self.msg_id = msg_id
        self.from_call = from_call
        self.to_call = to_call
        self.subject = subject
        self.body = body
        self.msg_type = msg_type  # P=personal, B=bulletin, T=traffic
        self.timestamp = datetime.utcnow().isoformat()
        self.read = False
        self.forwarded = False

    def to_dict(self):
        return {
            "id": self.msg_id,
            "from": self.from_call,
            "to": self.to_call,
            "subject": self.subject,
            "body": self.body,
            "type": self.msg_type,
            "time": self.timestamp,
            "read": self.read,
            "forwarded": self.forwarded,
        }


class PacketBBS:
    """AX.25 Packet Radio BBS engine."""

    def __init__(self):
        self.callsign = BBS_CALLSIGN
        self.messages = []
        self.next_msg_id = 1
        self.connected_users = {}
        self.kiss_sock = None
        self.stats = {"connections": 0, "messages_stored": 0, "bytes_transferred": 0}
        self._load_messages()

    def _load_messages(self):
        """Load persisted messages from disk."""
        msg_file = DATA_DIR / "messages.json"
        if msg_file.exists():
            try:
                with open(msg_file) as f:
                    data = json.load(f)
                    for m in data:
                        msg = Message(m["id"], m["from"], m["to"],
                                     m["subject"], m["body"], m.get("type", "P"))
                        msg.timestamp = m.get("time", "")
                        msg.read = m.get("read", False)
                        self.messages.append(msg)
                    if self.messages:
                        self.next_msg_id = max(m.msg_id for m in self.messages) + 1
                logger.info("Loaded %d messages from disk", len(self.messages))
            except Exception as e:
                logger.error("Failed to load messages: %s", e)

    def _save_messages(self):
        """Persist messages to disk."""
        msg_file = DATA_DIR / "messages.json"
        with open(msg_file, "w") as f:
            json.dump([m.to_dict() for m in self.messages], f, indent=2)

    def post_message(self, from_call, to_call, subject, body, msg_type="P"):
        """Store a new message in the BBS."""
        msg = Message(self.next_msg_id, from_call.upper(), to_call.upper(),
                      subject, body, msg_type)
        self.messages.append(msg)
        self.next_msg_id += 1
        self.stats["messages_stored"] += 1
        self._save_messages()
        logger.info("Message #%d from %s to %s: %s", msg.msg_id, from_call, to_call, subject)
        return msg

    def list_messages(self, callsign=None, msg_type=None):
        """List messages, optionally filtered by callsign or type."""
        result = self.messages
        if callsign:
            callsign = callsign.upper()
            result = [m for m in result if m.to_call == callsign or m.from_call == callsign]
        if msg_type:
            result = [m for m in result if m.msg_type == msg_type]
        return result

    def read_message(self, msg_id):
        """Read a specific message by ID."""
        for msg in self.messages:
            if msg.msg_id == msg_id:
                msg.read = True
                self._save_messages()
                return msg
        return None

    def delete_message(self, msg_id, requester_call):
        """Delete a message (only by sender or recipient)."""
        for i, msg in enumerate(self.messages):
            if msg.msg_id == msg_id:
                if msg.from_call == requester_call or msg.to_call == requester_call:
                    self.messages.pop(i)
                    self._save_messages()
                    return True
        return False

    def list_files(self):
        """List files available for download."""
        files = []
        for f in FILE_DIR.iterdir():
            if f.is_file():
                files.append({
                    "name": f.name,
                    "size": f.stat().st_size,
                    "modified": datetime.fromtimestamp(f.stat().st_mtime).isoformat(),
                })
        return files

    def handle_kiss_connection(self):
        """Connect to KISS TNC for packet radio I/O."""
        try:
            self.kiss_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.kiss_sock.connect((KISS_HOST, KISS_PORT))
            logger.info("Connected to KISS TNC at %s:%d", KISS_HOST, KISS_PORT)
        except Exception as e:
            logger.warning("KISS TNC connection failed: %s", e)
            self.kiss_sock = None

    def process_command(self, callsign, command):
        """Process a BBS command from a connected user."""
        parts = command.strip().split(None, 1)
        if not parts:
            return "Type H for help"
        cmd = parts[0].upper()
        arg = parts[1] if len(parts) > 1 else ""

        if cmd == "H" or cmd == "HELP":
            return (f"Welcome to {self.callsign} BBS\n"
                    "Commands: L(ist), R(ead) #, S(end) CALL, K(ill) #, "
                    "B(ulletins), F(iles), H(elp), Q(uit)")
        elif cmd == "L" or cmd == "LIST":
            msgs = self.list_messages(callsign)
            if not msgs:
                return "No messages."
            lines = ["#   From       To         Subject"]
            for m in msgs[-20:]:
                flag = " " if m.read else "N"
                lines.append(f"{m.msg_id:3d}{flag} {m.from_call:<10s} {m.to_call:<10s} {m.subject[:30]}")
            return "\n".join(lines)
        elif cmd == "R" or cmd == "READ":
            try:
                msg = self.read_message(int(arg))
                if msg:
                    return f"From: {msg.from_call}\nTo: {msg.to_call}\n" \
                           f"Date: {msg.timestamp}\nSubject: {msg.subject}\n\n{msg.body}"
                return "Message not found"
            except ValueError:
                return "Usage: R <message number>"
        elif cmd == "B":
            msgs = self.list_messages(msg_type="B")
            return "\n".join([f"#{m.msg_id} {m.subject}" for m in msgs[-20:]]) or "No bulletins"
        elif cmd == "F":
            files = self.list_files()
            return "\n".join([f"{f['name']} ({f['size']} bytes)" for f in files]) or "No files"
        elif cmd == "Q" or cmd == "QUIT":
            return "73 de " + self.callsign
        else:
            return f"Unknown command: {cmd}. Type H for help."

    def get_status(self):
        return {
            "callsign": self.callsign,
            "total_messages": len(self.messages),
            "unread": sum(1 for m in self.messages if not m.read),
            "bulletins": sum(1 for m in self.messages if m.msg_type == "B"),
            "files_available": len(self.list_files()),
            "kiss_connected": self.kiss_sock is not None,
            "stats": self.stats,
        }


bbs = PacketBBS()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi Packet BBS</title></head><body>
    <h1>Packet Radio BBS</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),3000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(bbs.get_status())

@app.route("/api/messages")
def api_messages():
    call = request.args.get("callsign")
    msgs = bbs.list_messages(call)
    return jsonify({"messages": [m.to_dict() for m in msgs]})

@app.route("/api/message/<int:msg_id>")
def api_read(msg_id):
    msg = bbs.read_message(msg_id)
    return jsonify(msg.to_dict() if msg else {"error": "Not found"})

@app.route("/api/send", methods=["POST"])
def api_send():
    d = request.json or {}
    msg = bbs.post_message(d.get("from", "WEB"), d.get("to", "ALL"),
                           d.get("subject", ""), d.get("body", ""), d.get("type", "P"))
    return jsonify(msg.to_dict())

@app.route("/api/command", methods=["POST"])
def api_command():
    d = request.json or {}
    result = bbs.process_command(d.get("callsign", "WEB"), d.get("command", "H"))
    return jsonify({"response": result})


if __name__ == "__main__":
    try:
        bbs.handle_kiss_connection()
        logger.info("Starting Packet BBS on port 8092")
        app.run(host="0.0.0.0", port=8092, debug=False)
    except KeyboardInterrupt:
        pass
