# How-To Guide — Deauth Detector

## Overview
Simulates a wireless IDS that monitors for deauthentication and disassociation attacks.

## Steps
1. Open `index.html` in a browser
2. Click **Monitor** to start the IDS
3. Watch for WARNING (yellow) and CRITICAL (red) alert banners
4. Check **Attack Timeline** for chronological event history
5. View **Targeted Devices** to see which clients are being attacked
6. Click **Stop** to halt monitoring

## Tips
- Attack rate above 10/min triggers WARNING, above 30/min triggers CRITICAL
- The timeline shows all frame types: deauth (red), disassoc (orange), normal (green)
- Targeted devices table tracks which attacker MAC is hitting each target
