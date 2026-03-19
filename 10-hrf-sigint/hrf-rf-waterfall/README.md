# RF Waterfall — Spectrum Display

> Live waterfall showing WiFi, Bluetooth, FM, keyfobs

## Overview

A simulated RF spectrum waterfall display that visualizes radio frequency activity as a scrolling spectrogram. Signals at known frequencies (FM, WiFi, BLE, ISM 433 MHz, etc.) appear in real time with color-coded power levels.

## Features

- Scrolling waterfall canvas (0-6 GHz range)
- Signal labels overlay at known frequencies
- Frequency tuner with center/span controls
- Quick presets: FM, ISM 433, ISM 915, WiFi 2.4, WiFi 5
- Color scale legend (-120 to 0 dBm)
- Auto-detected signal list with hit counters
- Frequency database reference
- Trilingual (EN/FR/AR) with RTL support
- 8 themes, sound effects, activity log

## Files

| File | Description |
|------|-------------|
| `index.html` | App layout with waterfall canvas and controls |
| `script.js` | Simulation engine, i18n, theme, panels |
| `style.css` | Shared Workshop-DIY template (DO NOT EDIT) |
| `manifest.json` | PWA manifest |

## Quick Start

Open `index.html` in any modern browser. Click **Start Scan** to begin.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
