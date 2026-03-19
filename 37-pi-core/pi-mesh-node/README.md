# 🔗 Pi Mesh Node

**Workshop-DIY Pi Core Learning Lab**

LoRa mesh messaging node for off-grid communication. Simulates a full Meshtastic-style mesh network with node map, message routing, and signal monitoring.

## Features

- Interactive node map canvas with animated mesh topology
- Message console with send/receive simulation
- LoRa channel and spreading factor configuration
- RSSI and SNR signal quality monitoring
- 6 simulated mesh nodes with relay hops
- Trilingual UI (EN/FR/AR) with RTL support
- 8 themes, activity log, sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | Dashboard with mesh map, message console, Section C |
| `script.js` | Mesh simulation engine, i18n, all UI logic |
| `style.css` | Shared Workshop-DIY theme system |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step guide |

## Quick Start

1. Open `index.html` in a browser
2. Click **Start Mesh** to activate the node
3. Watch messages arrive from other nodes
4. Type and send your own messages

## Tech Stack

Vanilla JS, HTML5 Canvas, zero dependencies.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
