# ✈️ Aircraft Radar — ADS-B Receiver

**Workshop-DIY SIGINT Learning Lab**

Plot every aircraft overhead with altitude, speed, callsign. Simulates a real ADS-B receiver decoding 1090 MHz transponder broadcasts.

## Features

- Sky map canvas with animated aircraft icons and callsign labels
- Real-time altitude chart with per-aircraft traces
- Aircraft table with sortable columns
- Flight info panel on aircraft selection
- Click aircraft on map or table to inspect
- Realistic simulated ADS-B data (callsigns, squawk codes, flight levels)
- Trilingual UI (EN/FR/AR) with RTL support
- 8 themes, activity log, sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | App layout with sky map, altitude chart, table, Section C |
| `script.js` | Simulation engine, rendering, i18n, all UI logic |
| `style.css` | Shared Workshop-DIY theme system (do not modify) |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step guide |

## Quick Start

1. Open `index.html` in a browser
2. Click **Start Receiver**
3. Watch aircraft appear on the sky map
4. Click any aircraft for details

## Tech Stack

Vanilla JS, HTML5 Canvas, zero dependencies.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
