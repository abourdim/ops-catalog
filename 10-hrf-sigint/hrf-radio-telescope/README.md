# 🔭 Radio Telescope — Hydrogen Line

**Workshop-DIY SIGINT Learning Lab**

1420 MHz hydrogen line radio astronomy simulator. Observe the 21 cm emission from neutral hydrogen and derive the galaxy rotation curve.

## Features

- Spectrum display centered on 1420.405 MHz with real-time FFT simulation
- Hydrogen emission peaks with Doppler shifts from galactic rotation
- Galaxy rotation curve derived from Doppler velocity measurements
- Gain and averaging controls for signal processing
- Observation statistics (peak power, peak frequency, Doppler velocity, SNR)
- Trilingual UI (EN/FR/AR) with RTL support
- 8 themes, activity log, sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | App layout with spectrum canvas, rotation curve, stats, Section C |
| `script.js` | Hydrogen line simulation engine, rendering, i18n, all UI logic |
| `style.css` | Shared Workshop-DIY theme system (do not modify) |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step guide |

## Quick Start

1. Open `index.html` in a browser
2. Click **Start Observation**
3. Watch the hydrogen emission spectrum build up
4. Adjust gain and averaging controls

## Tech Stack

Vanilla JS, HTML5 Canvas, zero dependencies.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
