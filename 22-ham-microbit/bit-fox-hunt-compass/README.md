# bit-fox-hunt-compass — Workshop DIY

**Fox Hunt Transmitter Finder Simulation** — Learn radio direction finding, signal attenuation, and triangulation through an interactive fox hunting game.

---

## What This App Teaches

Fox hunting (ARDF — Amateur Radio Direction Finding) is a ham radio sport where participants locate hidden transmitters using directional signal strength. Students learn:

- **Direction Finding** — Using signal gradient to determine bearing toward a transmitter
- **Signal Attenuation** — How radio signals weaken with distance (inverse square law)
- **Triangulation** — Combining multiple bearing measurements to pinpoint a location
- **Radio Fox Hunting** — The sport of hidden transmitter hunting

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Main app layout — field canvas, controls, sections A/B/C, help panel |
| `script.js` | i18n (EN/FR/AR), fox hunt simulation, all template features |
| `style.css` | 9 themes, animations, responsive — **DO NOT MODIFY** |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step guide for students |
| `CHANGES.md` | Version changelog |

---

## How It Works

1. Press **New Hunt** to hide a fox (transmitter) at a random location
2. Use **N/S/E/W** buttons (or arrow keys / WASD) to move on the grid
3. Watch the **signal bar** — it gets stronger as you approach the fox
4. Follow the **direction arrow** — it points toward stronger signal
5. When close enough, the fox is revealed with an animation
6. Your **step count** is your score — fewer steps = better (like golf)

---

## Simulation Details

- **Field**: 20x20 grid with player position and hidden fox
- **Signal**: Inverse square law from distance to fox, plus random noise
- **Direction arrow**: Rotates toward fox with noise that decreases as you get closer
- **Signal bar color**: Blue (far) → Green (medium) → Orange (close) → Red (very close)
- **Find threshold**: Distance < 1.5 cells reveals the fox
- **Bearing**: Compass bearing from player to fox in degrees

---

## Challenges

| Challenge | Goal |
|-----------|------|
| Speed Hunter | Find the fox in under 20 steps |
| Triple Fox | Find 3 foxes in one hunt session |
| Moving Fox | Find a fox that changes position every 5 steps |

---

## i18n

Trilingual support: English, Francais, Arabic (with RTL). All text uses `data-i18n` attributes mapped to the `LANG` object.

---

## Template Features

Built on Workshop-DIY Template v1.2:

- 9 themes (6 dark + 2 light Islamic + retro)
- Activity log with typewriter effect
- Sound effects
- Whisper mode (voice-to-log)
- Breathing guide with dhikr counter
- Music reactive mode
- Konami code, Morse code, Matrix rain
- Pixel pet, ghost cursors, night mode
- PWA-ready

---

## Quick Start

Open `index.html` in any modern browser. No build tools or server needed.

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
