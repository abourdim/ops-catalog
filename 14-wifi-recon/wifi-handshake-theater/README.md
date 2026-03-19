# Handshake Theater — WPA 4-Way

**Animated step-by-step visualization of the WPA2 4-way handshake authentication process.**

## Overview
Handshake Theater animates the EAPOL 4-way handshake that WPA2 uses to establish encrypted sessions. Watch each message exchange, see cryptographic keys being derived in real-time.

## Features
- Step-by-step handshake animation with active/done highlighting
- Key derivation display: PMK, ANonce, SNonce, PTK, GTK, MIC
- Chronological timeline of handshake events
- Section C: educational explanation of WPA2 key hierarchy
- Full i18n: English, French, Arabic (RTL)
- 8 themes with sound effects

## Files
| File | Description |
|------|-------------|
| `index.html` | Main UI with handshake steps, key display, timeline |
| `script.js` | i18n, themes, panels, handshake animation logic |
| `style.css` | Shared stylesheet (do not modify) |
| `manifest.json` | PWA manifest |
| `CHANGES.md` | Version changelog |
| `docs/HOWTO.md` | Step-by-step usage guide |

## Quick Start
Open `index.html` in a browser and click **Play** to watch the handshake unfold.

## License
Workshop-DIY — [abourdim](https://github.com/abourdim)
