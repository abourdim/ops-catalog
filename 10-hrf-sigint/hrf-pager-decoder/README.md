# 📟 Pager Decoder — POCSAG Monitor

**Workshop-DIY SIGINT Learning Lab**

Decode unencrypted pager messages in real time. Simulates a real POCSAG receiver decoding VHF/UHF pager traffic.

## Features

- Live message feed with POCSAG-decoded alphanumeric and numeric messages
- Frequency selector for common pager bands (152/157/466 MHz)
- Address filter to isolate specific pager devices
- Statistics dashboard (total, numeric, alpha, unique addresses)
- Realistic simulated POCSAG data (RIC addresses, function codes, baud rates)
- Trilingual UI (EN/FR/AR) with RTL support
- 8 themes, activity log, sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | App layout with message feed, frequency selector, stats, Section C |
| `script.js` | POCSAG simulation engine, rendering, i18n, all UI logic |
| `style.css` | Shared Workshop-DIY theme system (do not modify) |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step guide |

## Quick Start

1. Open `index.html` in a browser
2. Click **Start Decoder**
3. Watch decoded pager messages appear in the feed
4. Filter by address or switch frequencies

## Tech Stack

Vanilla JS, HTML5, zero dependencies.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
