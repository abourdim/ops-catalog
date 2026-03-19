# Probe Tracker — Location Leaks

**WiFi probe request simulator revealing device-to-network location leaks.**

## Overview

Probe Tracker simulates the capture of 802.11 probe requests — management frames that WiFi devices continuously broadcast to find known networks. These probes leak SSID names, revealing a device's location history (hotels, airports, offices, homes).

## Features

- Live probe request log with MAC, SSID, signal strength
- Device-to-network mapping table
- Privacy risk analysis with severity rating
- Statistics: total probes, unique devices, networks revealed, probe rate
- Section C: educational explanation of probe request privacy risks
- Full i18n: English, French, Arabic (RTL)
- 8 themes with sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | Main UI with probe log, mapping table, risk analysis |
| `script.js` | i18n, themes, panels, probe simulation logic |
| `style.css` | Shared stylesheet (do not modify) |
| `manifest.json` | PWA manifest |
| `CHANGES.md` | Version changelog |
| `docs/HOWTO.md` | Step-by-step usage guide |

## Quick Start

Open `index.html` in a browser and click **Start** to begin the simulation.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
