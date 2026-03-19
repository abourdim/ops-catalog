# 📡 Pi SDR Station

**Workshop-DIY Pi Core Learning Lab**

Dedicated SDR receiver server on Raspberry Pi. Simulates a full rtl_tcp-based SDR server with waterfall display, FFT spectrum, demodulation modes, and Pi system monitoring.

## Features

- Real-time waterfall display with color-mapped signal intensity
- FFT spectrum analyzer with gain-responsive visualization
- Frequency tuning from 24 MHz to 1766 MHz
- Multiple demodulation modes: FM, AM, USB, LSB, RAW IQ
- Adjustable gain and sample rate controls
- Pi system stats: CPU, RAM, temperature, uptime
- Audio output level meter with SNR display
- Trilingual UI (EN/FR/AR) with RTL support
- 8 themes, activity log, sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | Dashboard layout with waterfall, FFT, controls, Section C |
| `script.js` | SDR simulation engine, rendering, i18n, all UI logic |
| `style.css` | Shared Workshop-DIY theme system |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step guide |

## Quick Start

1. Open `index.html` in a browser
2. Click **Start SDR** to begin reception
3. Adjust frequency, gain, and mode
4. Watch the waterfall and FFT displays

## Tech Stack

Vanilla JS, HTML5 Canvas, zero dependencies.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
