# bit-cw-paddle — Workshop DIY

**CW Morse Paddle Simulator** — learn Morse code with a virtual paddle key.

---

## Overview

This app teaches CW (Continuous Wave) Morse code communication. Students tap DIT and DAH paddle buttons to send dots and dashes, learning Morse code, timing rules, and the basics of ham radio CW operation.

---

## Features

| Feature | Description |
|---------|-------------|
| **Paddle Buttons** | DIT (short) and DAH (long) with tone playback via Web Audio API |
| **Morse Display** | Visual dots and dashes appear in real time as you key |
| **Auto-Decoder** | Timing-based decoder translates Morse to text automatically |
| **Play Message** | Type text and hear it played back in Morse code |
| **Practice Mode** | Random letter challenge — key it in Morse and verify |
| **Speed Control** | Adjustable WPM (5-30 words per minute) |
| **Tone Control** | Adjustable frequency (400-1000 Hz) |
| **Keyboard Support** | Arrow keys or `.`/`-` as DIT/DAH shortcuts |
| **Trilingual** | English, French, Arabic with full RTL support |
| **8 Themes** | Mosque Gold, Zellige, Andalus, Space, Jungle, Robot, Riad, Medina |

---

## Files

| File | Description |
|------|-------------|
| `index.html` | UI layout — main card, sections A/B/C, help panel |
| `script.js` | i18n, CW simulation engine, template infrastructure |
| `style.css` | Themes, animations, responsive styles (unmodified template) |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Version history |
| `docs/HOWTO.md` | Step-by-step usage guide |

---

## Sections

- **Main Card** — Paddle buttons, Morse display, decoder, speed/tone sliders, play message, practice mode
- **Section A (How It Works)** — 4 timing rules: DIT, DAH, letter gap, word gap
- **Section B (Lab)** — Keying practice, decode incoming Morse, speed test
- **Section C (Challenge)** — Send SOS, decode at 15 WPM, key your name

---

## Morse Code Reference

| Letter | Morse | Letter | Morse | Number | Morse |
|--------|-------|--------|-------|--------|-------|
| A | .- | N | -. | 0 | ----- |
| B | -... | O | --- | 1 | .---- |
| C | -.-. | P | .--. | 2 | ..--- |
| D | -.. | Q | --.- | 3 | ...-- |
| E | . | R | .-. | 4 | ....- |
| F | ..-. | S | ... | 5 | ..... |
| G | --. | T | - | 6 | -.... |
| H | .... | U | ..- | 7 | --... |
| I | .. | V | ...- | 8 | ---.. |
| J | .--- | W | .-- | 9 | ----. |
| K | -.- | X | -..- | | |
| L | .-.. | Y | -.-- | | |
| M | -- | Z | --.. | | |

---

## Timing Rules

- **DIT** = 1 unit
- **DAH** = 3 units
- **Intra-character gap** (between dots/dashes) = 1 unit
- **Inter-character gap** (between letters) = 3 units
- **Word gap** = 7 units
- **1 unit at 15 WPM** = 80 ms

---

## Quick Start

1. Open `index.html` in any modern browser
2. Press **DIT** or **DAH** to start keying Morse code
3. Watch the decoder translate your input in real time
4. Use **Practice Mode** to learn each letter
5. Try the **Challenges** in Section C

---

## Tech Stack

- Vanilla HTML / CSS / JavaScript
- Web Audio API for tone generation
- No frameworks, no dependencies
- PWA-ready with manifest.json

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
