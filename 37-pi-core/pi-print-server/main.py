#!/usr/bin/env python3
"""
Pi Print Server
CUPS-based network print server with web management interface.
Supports USB and network printers with queue management.
"""

import os
import time
import json
import subprocess
import logging
from pathlib import Path
from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("print-server")

app = Flask(__name__)

SPOOL_DIR = Path("/var/spool/pi-print")
SPOOL_DIR.mkdir(parents=True, exist_ok=True)


class PrintServer:
    """Manages CUPS printing subsystem via command-line interface."""

    def __init__(self):
        self.jobs_processed = 0
        self.print_log = []

    def list_printers(self):
        """List all CUPS printers and their status."""
        printers = []
        try:
            result = subprocess.run(["lpstat", "-p", "-d"], capture_output=True, text=True, timeout=10)
            for line in result.stdout.strip().split("\n"):
                if line.startswith("printer"):
                    parts = line.split()
                    name = parts[1] if len(parts) > 1 else "unknown"
                    status = "idle" if "idle" in line.lower() else "busy"
                    enabled = "disabled" not in line.lower()
                    printers.append({"name": name, "status": status, "enabled": enabled})
        except Exception as e:
            logger.error("Failed to list printers: %s", e)
        return printers

    def get_default_printer(self):
        """Get the default CUPS printer name."""
        try:
            result = subprocess.run(["lpstat", "-d"], capture_output=True, text=True, timeout=5)
            if ":" in result.stdout:
                return result.stdout.split(":")[-1].strip()
        except Exception:
            pass
        return None

    def list_jobs(self):
        """List all pending print jobs."""
        jobs = []
        try:
            result = subprocess.run(["lpstat", "-o"], capture_output=True, text=True, timeout=10)
            for line in result.stdout.strip().split("\n"):
                if line.strip():
                    parts = line.split()
                    if len(parts) >= 4:
                        jobs.append({
                            "id": parts[0],
                            "owner": parts[1],
                            "size": parts[2],
                            "submitted": " ".join(parts[3:]),
                        })
        except Exception:
            pass
        return jobs

    def print_file(self, filepath, printer=None, copies=1, options=None):
        """Submit a file to the print queue."""
        if not os.path.exists(filepath):
            return {"error": "File not found"}

        cmd = ["lp"]
        if printer:
            cmd.extend(["-d", printer])
        cmd.extend(["-n", str(copies)])
        if options:
            for key, val in options.items():
                cmd.extend(["-o", f"{key}={val}"])
        cmd.append(filepath)

        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            if result.returncode == 0:
                self.jobs_processed += 1
                job_info = {"file": filepath, "printer": printer or "default",
                            "copies": copies, "time": time.strftime("%H:%M:%S")}
                self.print_log.append(job_info)
                logger.info("Print job submitted: %s", filepath)
                return {"success": True, "output": result.stdout.strip()}
            return {"error": result.stderr.strip()}
        except Exception as e:
            return {"error": str(e)}

    def cancel_job(self, job_id):
        """Cancel a pending print job."""
        try:
            result = subprocess.run(["cancel", job_id], capture_output=True, text=True, timeout=10)
            return result.returncode == 0
        except Exception:
            return False

    def add_printer(self, name, device_uri, driver="everywhere"):
        """Add a new printer via lpadmin."""
        cmd = ["sudo", "lpadmin", "-p", name, "-v", device_uri,
               "-m", driver, "-E"]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
            if result.returncode == 0:
                logger.info("Printer added: %s -> %s", name, device_uri)
                return True
            logger.error("Add printer failed: %s", result.stderr)
        except Exception as e:
            logger.error("Add printer error: %s", e)
        return False

    def detect_usb_printers(self):
        """Detect connected USB printers."""
        printers = []
        try:
            result = subprocess.run(["lpinfo", "-v"], capture_output=True, text=True, timeout=10)
            for line in result.stdout.strip().split("\n"):
                if "usb://" in line:
                    parts = line.split(None, 1)
                    if len(parts) >= 2:
                        printers.append({"type": parts[0], "uri": parts[1]})
        except Exception:
            pass
        return printers

    def get_printer_stats(self, printer_name):
        """Get detailed printer statistics."""
        try:
            result = subprocess.run(["lpstat", "-l", "-p", printer_name],
                                    capture_output=True, text=True, timeout=10)
            return result.stdout.strip()
        except Exception:
            return "No stats available"

    def get_status(self):
        return {
            "printers": self.list_printers(),
            "default_printer": self.get_default_printer(),
            "pending_jobs": self.list_jobs(),
            "jobs_processed": self.jobs_processed,
            "recent_prints": self.print_log[-10:],
        }


server = PrintServer()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi Print Server</title></head><body>
    <h1>Print Server</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),3000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(server.get_status())

@app.route("/api/print", methods=["POST"])
def api_print():
    d = request.json or {}
    result = server.print_file(d.get("file", ""), d.get("printer"),
                               d.get("copies", 1), d.get("options"))
    return jsonify(result)

@app.route("/api/cancel/<job_id>", methods=["POST"])
def api_cancel(job_id):
    return jsonify({"cancelled": server.cancel_job(job_id)})

@app.route("/api/detect")
def api_detect():
    return jsonify({"usb_printers": server.detect_usb_printers()})

@app.route("/api/printers")
def api_printers():
    return jsonify({"printers": server.list_printers()})


if __name__ == "__main__":
    logger.info("Starting Print Server on port 8093")
    app.run(host="0.0.0.0", port=8093, debug=False)
