# 📊 ISM Band Explorer

**Workshop-DIY SIGINT Learning Lab**

Scan and identify devices on 433/868/915 MHz ISM bands. Simulates rtl_433 device detection with protocol identification.

## Features

- ISM band spectrum display with real-time device bursts
- Device list with protocol, signal strength, and last-seen timestamps
- Protocol identification panel with modulation and data rate details
- Band selector (433/868/915 MHz) with per-band device databases
- Simulated devices: weather stations, car keys, LoRa, Zigbee, TPMS, and more
- Trilingual UI (EN/FR/AR) with RTL support
- 8 themes, activity log, sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | App layout with spectrum, device list, protocol ID, Section C |
| `script.js` | ISM simulation engine, rendering, i18n, all UI logic |
| `style.css` | Shared Workshop-DIY theme system (do not modify) |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step guide |

## Quick Start

1. Open `index.html` in a browser
2. Click **Start Scanner**
3. Watch devices appear on the spectrum and in the device list
4. Click a device for protocol details

## Tech Stack

Vanilla JS, HTML5 Canvas, zero dependencies.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
