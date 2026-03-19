# How-To Guide — Packet Microscope

## Overview
Generates simulated 802.11 frames and dissects them with color-coded hex dumps.

## Steps
1. Open `index.html` in a browser
2. Click **Capture** to start generating frames
3. See the color-coded hex dump with field legend above
4. Click any frame in **Captured Frames** to dissect it
5. Review decoded values in the field grid below the hex dump
6. Check **Frame Type Statistics** for Management/Control/Data breakdown

## Tips
- Each color in the hex dump maps to a specific 802.11 field
- Frame Control (red) identifies the frame type and subtype
- The three MAC addresses serve different roles: DA, SA, and BSSID
