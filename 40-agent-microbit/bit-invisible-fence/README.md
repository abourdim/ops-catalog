# bit-invisible-fence — Workshop DIY

**Invisible Fence — Perimeter Security Sensor Mapping Simulation**

A micro:bit educational web app that teaches students about perimeter security, sensor networks, zone mapping, and breach detection through an interactive simulation.

---

## What It Teaches

- **Perimeter Security** — How physical/electronic barriers protect boundaries
- **Sensor Networks** — Distributed wireless nodes that monitor an environment
- **Zone Mapping** — Dividing a perimeter into monitored segments
- **Breach Detection** — Identifying unauthorized boundary crossings in real-time

---

## Features

| Feature | Description |
|---------|-------------|
| Perimeter Map | Top-down canvas view of area with sensor nodes on boundary |
| Sensor Placement | Click to place sensors with visible detection radius |
| Fence Activation | Connect sensors to form a monitored perimeter line |
| Intruder Simulation | Moving dot that triggers breach alerts when entering sensor zones |
| Zone Tracking | Identifies which zone was breached |
| Coverage Visualization | Shows covered vs uncovered areas |
| Sensor States | Active (green), Triggered (red pulse), Offline (gray) |
| Breach Counter | Tracks total breach events |

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Layout with perimeter map, controls, sections A/B/C, help panel |
| `script.js` | i18n (EN/FR/AR), simulation engine, template infrastructure |
| `style.css` | 9 themes, animations, responsive (DO NOT MODIFY) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step guide for students |

---

## Quick Start

1. Open `index.html` in a browser
2. Click **Add Sensor** then click on the map to place sensors around the perimeter
3. Click **Activate Fence** to enable monitoring
4. Click **Simulate Intruder** then click on the map to test breach detection
5. Watch the zone status and sensor list update in real-time

---

## Sections

### Section A — How It Works
Four steps explaining sensor placement, zone coverage, breach detection, and alert transmission.

### Section B — Lab
Hands-on activities: design a perimeter, test coverage gaps, simulate intruders, optimize placement.

### Section C — Challenge
Three challenges: minimum sensor security, find the gap, and defeat a stealth intruder.

---

## JS API (Template)

| Function | Description |
|----------|-------------|
| `log(msg, type)` | Log with typewriter effect. Types: `info`, `success`, `error`, `tx`, `rx` |
| `showToast(msg, ms)` | Toast notification with optional auto-hide |
| `setStatus(bool)` | Green (connected) / red (disconnected) pill |
| `playSound(type)` | `'click'`, `'success'`, `'error'` |

---

## i18n

Trilingual support: English, French, Arabic (with RTL). All UI text uses `data-i18n` attributes mapped to the `LANG` dictionary in `script.js`.

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
