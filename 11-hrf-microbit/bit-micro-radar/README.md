# bit-micro-radar — Workshop DIY

**Micro Radar EM Map** — Build a radar display from sensor data with micro:bit.

---

## What It Teaches

Students learn how radar systems work by combining physical sensor data (accelerometer, compass) with electromagnetic scanning concepts to create a classic radar-style display. Core topics include:

- **Radar principles** — sweep rotation, signal reflection, blip detection
- **Polar coordinates** — mapping angle + distance instead of x/y
- **Electromagnetic detection** — active vs passive sensing
- **micro:bit sensors** — accelerometer and magnetometer fundamentals
- **Sensor-based mapping** — building a map from sequential scans

---

## Features

| Feature | Description |
|---------|-------------|
| Radar canvas (300x300) | Classic green radar with rotating sweep line and fade trail |
| Blip detection | Objects appear as bright blips when the sweep line passes their position |
| Blip decay | Blips fade over time, just like a real radar screen |
| Range selector | 10m, 50m, 100m — range rings rescale dynamically |
| Active / Passive modes | Active detects all objects; Passive only detects emitters |
| Click-to-place | Click the canvas to add virtual objects at any position |
| Object list | Live list showing bearing, distance, and type for each detected object |
| Detection counter | Real-time count of detected objects |
| Moving targets | Some objects move between sweeps |
| Stealth objects | Faint blips that require attention to detect |
| Trilingual UI | English, French, Arabic with full RTL support |
| 8 themes | Mosque Gold, Zellige, Andalus, Riad, Medina, Space, Jungle, Robot |

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Layout: main card with radar canvas, sections A (How It Works), B (Lab), C (Challenge), help panel |
| `script.js` | i18n (EN/FR/AR), radar simulation engine, blip rendering, object management, template features |
| `style.css` | Shared template styles (DO NOT MODIFY) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step usage guide |
| `CHANGES.md` | Version history |

---

## Quick Start

1. Open `index.html` in any modern browser
2. Press **Start Sweep** to begin radar rotation
3. Click the radar canvas to place virtual objects
4. Watch objects appear as blips on the sweep
5. Adjust **Range** (10m / 50m / 100m) and **Mode** (Active / Passive)

---

## Sections

### Main Card — Radar Display

- Canvas with dark green background, concentric range rings, sweep line with fade trail
- Start/Stop buttons, range selector, detection count, Active/Passive toggle
- Live object list showing bearing, distance, and type

### Section A — How It Works

Four steps explaining the radar scan cycle:
1. Sweep line rotates simulating antenna direction
2. Sensors detect EM signals at each angle
3. Signals plotted on polar coordinates
4. Full rotation builds a complete map

### Section B — Lab

Interactive experiments:
- Place virtual objects on the map
- Watch them appear on the radar during sweeps
- Adjust range and sensitivity
- Compare Active vs Passive detection modes

### Section C — Challenge

Three challenges for students:
1. **Full Sweep Identification** — Identify all objects in one sweep
2. **Moving Target Tracker** — Track a moving target across sweeps
3. **Stealth Detection** — Find the faint stealth object

---

## Help Panel

- **FAQ** — What is this app, how the radar works, Active vs Passive, placing objects
- **How-To** — Start sweep, place objects, adjust range, switch modes
- **Wiki** — Radar Principles, Polar Coordinates, EM Detection, micro:bit Sensors

---

## JS API

All template APIs are available:

| Function | Description |
|----------|-------------|
| `log(msg, type)` | Log with typewriter effect. Types: `info`, `success`, `error`, `tx`, `rx` |
| `showToast(msg, ms)` | Toast notification |
| `setStatus(bool)` | Green/red status pill |
| `startSweep()` | Begin radar sweep |
| `stopSweep()` | Stop radar sweep |
| `seedRadarObjects(n)` | Generate n random objects |

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
