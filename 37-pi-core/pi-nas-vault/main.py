#!/usr/bin/env python3
"""
Pi NAS Vault
Network-attached encrypted storage server on Raspberry Pi.
Provides Samba/NFS shares with LUKS encryption and web management.
"""

import os
import time
import json
import hashlib
import subprocess
import logging
import shutil
from pathlib import Path
from flask import Flask, jsonify, request, render_template_string

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("nas-vault")

app = Flask(__name__)

# --- Configuration ---
STORAGE_MOUNT = "/mnt/nas-vault"
SHARE_DIR = Path(STORAGE_MOUNT) / "shares"
LUKS_DEVICE = "/dev/sda1"
LUKS_MAPPER = "nas-vault"
SAMBA_CONFIG = "/etc/samba/smb.conf"


class NASController:
    """Manages encrypted NAS storage, shares, and services."""

    def __init__(self):
        self.vault_unlocked = False
        self.shares = {}
        self.transfer_log = []

    def get_disk_info(self):
        """Get storage device information."""
        info = {"devices": [], "mount_points": []}
        try:
            result = subprocess.run(["lsblk", "-J", "-o",
                                     "NAME,SIZE,TYPE,MOUNTPOINT,FSTYPE"],
                                    capture_output=True, text=True, timeout=10)
            info["devices"] = json.loads(result.stdout).get("blockdevices", [])
        except Exception as e:
            logger.error("lsblk failed: %s", e)

        try:
            result = subprocess.run(["df", "-h", "--output=source,size,used,avail,pcent,target"],
                                    capture_output=True, text=True, timeout=10)
            info["mount_points"] = result.stdout.strip()
        except Exception:
            pass
        return info

    def unlock_vault(self, passphrase):
        """Unlock LUKS encrypted storage volume."""
        try:
            result = subprocess.run(
                ["sudo", "cryptsetup", "luksOpen", LUKS_DEVICE, LUKS_MAPPER],
                input=passphrase.encode(), capture_output=True, timeout=30
            )
            if result.returncode != 0:
                logger.error("LUKS unlock failed: %s", result.stderr.decode())
                return False

            # Mount the decrypted volume
            os.makedirs(STORAGE_MOUNT, exist_ok=True)
            subprocess.run(["sudo", "mount", f"/dev/mapper/{LUKS_MAPPER}", STORAGE_MOUNT],
                          capture_output=True, timeout=10)

            self.vault_unlocked = True
            SHARE_DIR.mkdir(parents=True, exist_ok=True)
            logger.info("Vault unlocked and mounted at %s", STORAGE_MOUNT)
            return True
        except Exception as e:
            logger.error("Vault unlock error: %s", e)
            return False

    def lock_vault(self):
        """Lock the encrypted volume."""
        try:
            subprocess.run(["sudo", "umount", STORAGE_MOUNT], capture_output=True, timeout=10)
            subprocess.run(["sudo", "cryptsetup", "luksClose", LUKS_MAPPER],
                          capture_output=True, timeout=10)
            self.vault_unlocked = False
            logger.info("Vault locked")
            return True
        except Exception as e:
            logger.error("Vault lock error: %s", e)
            return False

    def create_share(self, name, read_only=False):
        """Create a new Samba share directory."""
        share_path = SHARE_DIR / name
        share_path.mkdir(parents=True, exist_ok=True)

        self.shares[name] = {
            "path": str(share_path),
            "read_only": read_only,
            "created": time.strftime("%Y-%m-%d %H:%M:%S"),
        }
        self._update_samba_config()
        logger.info("Share created: %s at %s", name, share_path)
        return True

    def _update_samba_config(self):
        """Generate Samba configuration for active shares."""
        config_lines = [
            "[global]",
            "   workgroup = PILAB",
            "   server string = Pi NAS Vault",
            "   security = user",
            "   map to guest = never",
            "   log file = /var/log/samba/%m.log",
            "   max log size = 50",
            "",
        ]
        for name, info in self.shares.items():
            config_lines.extend([
                f"[{name}]",
                f"   path = {info['path']}",
                f"   read only = {'yes' if info['read_only'] else 'no'}",
                "   browseable = yes",
                "   valid users = @pilab",
                "   create mask = 0664",
                "   directory mask = 0775",
                "",
            ])

        try:
            with open(SAMBA_CONFIG, "w") as f:
                f.write("\n".join(config_lines))
            subprocess.run(["sudo", "systemctl", "reload", "smbd"], capture_output=True)
        except PermissionError:
            logger.warning("Cannot write Samba config (need root)")

    def get_share_usage(self):
        """Get disk usage for each share."""
        usage = {}
        for name, info in self.shares.items():
            path = Path(info["path"])
            if path.exists():
                total_size = sum(f.stat().st_size for f in path.rglob("*") if f.is_file())
                file_count = sum(1 for f in path.rglob("*") if f.is_file())
                usage[name] = {
                    "size_bytes": total_size,
                    "size_mb": round(total_size / (1024 * 1024), 2),
                    "file_count": file_count,
                }
        return usage

    def get_storage_health(self):
        """Check storage device SMART health."""
        try:
            result = subprocess.run(
                ["sudo", "smartctl", "-H", LUKS_DEVICE.replace("1", "")],
                capture_output=True, text=True, timeout=10
            )
            return result.stdout.strip()
        except Exception:
            return "SMART data unavailable"

    def restart_services(self):
        """Restart Samba and NFS services."""
        for svc in ["smbd", "nmbd"]:
            subprocess.run(["sudo", "systemctl", "restart", svc], capture_output=True)
        logger.info("NAS services restarted")

    def get_status(self):
        disk = shutil.disk_usage(STORAGE_MOUNT) if os.path.ismount(STORAGE_MOUNT) else None
        return {
            "vault_unlocked": self.vault_unlocked,
            "storage": {
                "total_gb": round(disk.total / (1024**3), 2) if disk else 0,
                "used_gb": round(disk.used / (1024**3), 2) if disk else 0,
                "free_gb": round(disk.free / (1024**3), 2) if disk else 0,
                "percent_used": round(disk.used / disk.total * 100, 1) if disk else 0,
            } if disk else None,
            "shares": self.shares,
            "share_usage": self.get_share_usage(),
        }


nas = NASController()


@app.route("/")
def index():
    return render_template_string("""
    <html><head><title>Pi NAS Vault</title></head><body>
    <h1>NAS Vault</h1>
    <div id="s"></div>
    <script>setInterval(()=>fetch('/api/status').then(r=>r.json()).then(d=>{
        document.getElementById('s').innerText=JSON.stringify(d,null,2);
    }),5000);</script></body></html>
    """)

@app.route("/api/status")
def api_status():
    return jsonify(nas.get_status())

@app.route("/api/unlock", methods=["POST"])
def api_unlock():
    passphrase = request.json.get("passphrase", "")
    ok = nas.unlock_vault(passphrase)
    return jsonify({"unlocked": ok})

@app.route("/api/lock", methods=["POST"])
def api_lock():
    ok = nas.lock_vault()
    return jsonify({"locked": ok})

@app.route("/api/share", methods=["POST"])
def api_create_share():
    data = request.json or {}
    nas.create_share(data.get("name", "default"), data.get("read_only", False))
    return jsonify({"shares": nas.shares})

@app.route("/api/health")
def api_health():
    return jsonify({"smart": nas.get_storage_health(), "disks": nas.get_disk_info()})


if __name__ == "__main__":
    logger.info("Starting NAS Vault on port 8091")
    app.run(host="0.0.0.0", port=8091, debug=False)
