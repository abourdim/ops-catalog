# ⏪ RF Time Machine — Spectrum DVR

**Workshop-DIY SIGINT Learning Lab**

Record, rewind, and replay RF spectrum with a waterfall display and timeline scrubber.

## Features

- Waterfall display with color-coded signal intensity
- Record/Stop/Play/Rewind transport controls
- Timeline scrubber for seeking to any point in recorded history
- Live spectrum view showing current FFT frame
- Recording info panel (frames, duration, center frequency, bandwidth)
- Simulated signals that appear and disappear over time
- Up to 300 frames of recording history
- Trilingual UI (EN/FR/AR) with RTL support
- 8 themes, activity log, sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | App layout with waterfall, spectrum, timeline, Section C |
| `script.js` | Spectrum DVR simulation engine, rendering, i18n, all UI logic |
| `style.css` | Shared Workshop-DIY theme system (do not modify) |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step guide |

## Quick Start

1. Open `index.html` in a browser
2. Click **Record** to start capturing spectrum
3. Click **Stop** then drag the timeline scrubber to rewind
4. Click **Play** to replay from current position

## Tech Stack

Vanilla JS, HTML5 Canvas, zero dependencies.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
