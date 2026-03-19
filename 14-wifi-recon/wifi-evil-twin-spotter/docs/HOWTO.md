# How-To Guide — Evil Twin Spotter

## Overview
Detects evil twin APs by comparing attributes of networks sharing the same SSID.

## Steps
1. Open `index.html` in a browser
2. Click **Scan** to begin AP discovery
3. Legitimate APs appear with green checkmarks
4. When an evil twin is detected, a side-by-side comparison shows mismatched attributes in red
5. Check **Mismatch Details** for all differences found
6. View **All Detected APs** for the complete list

## Tips
- Evil twins copy the SSID but differ in BSSID, channel, encryption, or vendor
- Signal strength anomalies can indicate a nearby rogue AP
- Beacon interval mismatches are a strong indicator of different hardware
