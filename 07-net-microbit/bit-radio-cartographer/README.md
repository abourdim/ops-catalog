# bit-radio-cartographer — Workshop DIY

**Radio signal strength mapping simulation for micro:bit learners.**

Map radio signal strength across an area to create a heatmap. Learn about RSSI, signal propagation, heatmaps, and radio coverage planning.

---

## What This App Teaches

| Concept | Description |
|---------|-------------|
| **RSSI** | Received Signal Strength Indicator — measuring radio power in dBm |
| **Signal Propagation** | How radio signals weaken with distance (log-distance path loss model) |
| **Heatmaps** | Visualizing data intensity across a 2D surface using color gradients |
| **Radio Coverage Planning** | Positioning transmitters to minimize dead zones and maximize coverage |

---

## Features

- **Interactive Heatmap Canvas** — grid-based signal strength visualization (600x350)
- **Transmitter Placement** — click to place multiple transmitters on the map
- **Real-time RSSI** — hover cursor to measure signal strength at any point
- **Obstacle Walls** — draw walls that attenuate signal, creating shadow zones
- **Frequency Comparison** — toggle between 2.4 GHz and 900 MHz propagation models
- **Export** — save heatmap as PNG image
- **Trilingual** — English, French, Arabic (RTL)
- **8 Themes** — Mosque, Zellige, Andalus, Riad, Medina, Space, Jungle, Robot

---

## Signal Model

```
RSSI = txPower - 10 * n * log10(distance) + noise
```

| Parameter | Value |
|-----------|-------|
| `txPower` | -10 dBm at 1m reference |
| `n` (2.4 GHz) | 2.8 (indoor path loss exponent) |
| `n` (900 MHz) | 2.2 (better penetration) |
| `obstacleAtt` | 15 dB default (adjustable 5-30 dB) |
| `noiseFloor` | -100 dBm |
| Cell size | 8px (~0.5m per cell) |

Multiple transmitters use power summing in the linear domain.

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Layout: heatmap canvas, sections A/B/C, help panel |
| `script.js` | i18n (EN/FR/AR), heatmap simulation, all template features |
| `style.css` | Template styles (unmodified) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step guide |
| `CHANGES.md` | Changelog |

---

## Quick Start

1. Open `index.html` in a browser
2. Click **Place Transmitter** then click on the map
3. Hover to see RSSI readings
4. Add obstacles, change frequency, try the challenges

---

## Sections

### A — How It Works
Four steps: place transmitter, measure RSSI, interpolate data, generate heatmap.

### B — Lab
- Multiple transmitters with combined signal
- Wall obstacles with adjustable attenuation
- 2.4 GHz vs 900 MHz frequency comparison
- Dead zone detection

### C — Challenge
1. **Full Coverage** — single TX placement for all cells above -80 dBm
2. **Identify the Dead Zone** — find largest area below -90 dBm
3. **Three-TX Layout** — 95% coverage with 3 transmitters

---

## JS API (App-Specific)

| Function | Description |
|----------|-------------|
| `initHeatmap()` | Initialize canvas, events, buttons |
| `recalcHeatmap()` | Recalculate RSSI for all grid cells |
| `renderHeatmap()` | Draw heatmap, obstacles, transmitters |
| `calcRSSI(col, row)` | Compute RSSI at grid position |
| `clearHeatmap()` | Reset all transmitters and obstacles |
| `exportHeatmap()` | Save canvas as PNG |
| `setFrequency(ghz)` | Switch between 2.4 and 0.9 GHz |

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
