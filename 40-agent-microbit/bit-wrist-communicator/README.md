# bit-wrist-communicator — Workshop DIY

**Wrist Communicator: Tap-Pattern Coded Messages Simulation**

Send secret messages through tap patterns on the micro:bit, just like prisoners of war communicated through walls using tap code.

---

## What This App Teaches

- **Tap Code / Polybius Square** — How to encode letters as (row, column) pairs in a 5x5 grid
- **Encoding & Decoding** — Convert text to tap sequences and back
- **Haptic Communication** — Non-visual, non-auditory message transmission via touch
- **POW History** — The fascinating history of tap code used during the Vietnam War
- **Timing & Patterns** — Using pauses to separate data units (row vs. column, letter vs. letter)

---

## Features

| Feature | Description |
|---------|-------------|
| Polybius Grid | Interactive 5x5 grid showing the tap code alphabet (K merged with C) |
| Tap Input | Large tap button with timing-based row/col detection |
| Text Encoder | Type any message and see its full tap-code sequence |
| Audio Playback | Hear the tap sequence with beeps at slow/medium/fast speeds |
| Visual Feedback | Grid cells highlight as letters are decoded |
| Trilingual | English, French, Arabic with full RTL support |
| 8 Themes | Mosque Gold, Zellige, Andalus, Space, Jungle, Robot, Riad, Medina |
| Activity Log | Timestamped log of all encode/decode actions |
| PWA Ready | Works offline after first load |

---

## How to Use

1. **Look at the grid** — Find your letter's row and column position
2. **Tap to encode** — Tap the row count, pause, tap the column count
3. **Watch it decode** — The app detects pauses and decodes your letter
4. **Type & encode** — Enter text in the input field and click "Encode"
5. **Listen & learn** — Click "Play" to hear the tap sequence with audio beeps

---

## Tap Code Reference

The Polybius square used in this app:

|   | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| **1** | A | B | C | D | E |
| **2** | F | G | H | I | J |
| **3** | L | M | N | O | P |
| **4** | Q | R | S | T | U |
| **5** | V | W | X | Y | Z |

- K is merged with C (position 1,3)
- Example: **H** = row 2, col 3 → tap-tap, pause, tap-tap-tap
- Example: **S** = row 4, col 3 → tap-tap-tap-tap, pause, tap-tap-tap

---

## Files

| File | Description |
|------|-------------|
| `index.html` | App layout with tap grid, input area, sections A/B/C, help panel |
| `script.js` | Tap code simulation, i18n (EN/FR/AR), themes, all template features |
| `style.css` | Template styles (8 themes, animations, responsive) — **do not modify** |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step guide for students |
| `CHANGES.md` | Version history |

---

## Challenges

1. **Decode by Ear** — Listen to a tap sequence and decode without looking at the pattern
2. **Speed Encode** — Tap out your full name in under 30 seconds
3. **Shorthand Code** — Invent abbreviations for common words and test with a partner

---

## micro:bit Integration Ideas

- Use Button A/B as tap inputs
- Display decoded letters on the LED matrix
- Use the accelerometer (shake) as a tap trigger for wrist-worn use
- Radio module for sending tap sequences between two micro:bits
- Vibration motor for haptic feedback on received taps

---

## Tech Stack

- Vanilla HTML/CSS/JS — zero frameworks
- Web Audio API for tap beeps
- LocalStorage for preferences
- PWA-ready with manifest

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
