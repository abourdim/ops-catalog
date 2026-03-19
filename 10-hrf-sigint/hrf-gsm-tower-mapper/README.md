# 🗼 GSM Tower Mapper

**Workshop-DIY SIGINT Learning Lab**

Scan and map GSM/LTE cell towers with Cell ID, LAC, band, operator, and signal strength.

## Features

- Tower map canvas with coverage circles and animated pulsing
- Tower list with Cell ID, LAC, band, MCC/MNC, signal strength, distance
- Signal details panel on tower selection
- Click-to-select on map and table
- Simulated operators: Mobilis, Djezzy, Ooredoo, Orange, SFR, Vodafone
- Bands: GSM 900/1800, UMTS 2100, LTE 800/1800/2600
- Trilingual UI (EN/FR/AR) with RTL support
- 8 themes, activity log, sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | App layout with tower map, tower list, details, Section C |
| `script.js` | Tower simulation engine, rendering, i18n, all UI logic |
| `style.css` | Shared Workshop-DIY theme system (do not modify) |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step guide |

## Quick Start

1. Open `index.html` in a browser
2. Click **Start Scan**
3. Watch towers appear on the map
4. Click any tower for details

## Tech Stack

Vanilla JS, HTML5 Canvas, zero dependencies.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
