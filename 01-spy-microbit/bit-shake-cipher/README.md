# bit-shake-cipher

Shake-pattern cipher unlock simulation for the micro:bit. Students create secret shake patterns using accelerometer data to encrypt and unlock messages, learning about physical authentication and pattern recognition.

## What You'll Learn

- **Accelerometer data** — reading X/Y/Z acceleration values from the micro:bit sensor
- **Pattern recognition** — recording and comparing motion sequences
- **Physical authentication** — using gestures as cryptographic keys
- **DTW matching** — Dynamic Time Warping algorithm for flexible pattern comparison

## Quick Start

1. Open `index.html` in any modern browser
2. Click **Record Pattern** and move your mouse (or shake your phone)
3. Type a secret message and click **Lock**
4. Click **Shake to Unlock** and reproduce your shake pattern
5. Check the match score to see how close you got

No server or build step required. Works offline as a PWA.

## Features

- Real-time accelerometer visualizer (3-axis bars)
- Shake pattern recorder with 4-second capture window
- XOR encryption using pattern hash as key
- DTW-based pattern similarity comparison
- Interactive lab with side-by-side pattern comparison
- 3 progressive challenges (complexity, brute force, false positives)
- Trilingual UI (English, French, Arabic with RTL)
- 8 visual themes (6 dark + 2 light)
- Activity log, sound effects, and easter eggs
- Mobile support via DeviceMotion API fallback

## Files

| File | Description |
|------|-------------|
| `index.html` | App shell with main card, sections A/B/C, help panel |
| `script.js` | Template infrastructure + shake cipher simulation logic |
| `style.css` | Multi-theme template styles (do not modify) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step lab guide |
| `CHANGES.md` | Version changelog |

## Version

**v1.0** — Initial release with shake pattern recording, XOR encryption, DTW matching, lab, and challenges.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
