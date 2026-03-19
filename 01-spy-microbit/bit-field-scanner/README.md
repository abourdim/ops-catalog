# bit-field-scanner — Workshop DIY

**Multi-sensor threat assessment HUD for micro:bit v2.**

---

## What It Teaches

Field Scanner creates a heads-up display combining all micro:bit sensors (light, temperature, accelerometer, compass, microphone) into a single threat assessment dashboard. Students learn about:

- **Sensor fusion** — combining multiple data sources into a unified reading
- **Data normalization** — scaling different sensor ranges to a common 0–100 scale
- **Threat classification** — weighted algorithms that map composite scores to GREEN / YELLOW / RED
- **HUD design** — real-time gauges, color coding, radar sweep visualization

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Layout: main HUD card, 3 collapsible sections (How It Works, Lab, Challenge), help panel |
| `script.js` | i18n (EN/FR/AR), sensor simulation, threat algorithm, HUD canvas, template infrastructure |
| `style.css` | 9 themes, animations, responsive — **do not modify** |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step student guide |
| `CHANGES.md` | Changelog |

---

## Quick Start

1. Open `index.html` in a browser
2. Press **Start Scan** to begin sensor polling simulation
3. Watch the 5 gauges update and the threat level change in real time
4. Open **Lab** to manually adjust sensors with sliders
5. Open **Challenge** for guided exercises

---

## Sensor Ranges

| Sensor | Range | Unit | Weight |
|--------|-------|------|--------|
| Light | 0–255 | lux (relative) | 15% |
| Temperature | -10 to 50 | °C | 15% |
| Motion | 0–2000 | mg (milli-g) | 30% |
| Sound | 0–255 | amplitude | 25% |
| Magnetic | 0–360 | degrees | 15% |

---

## Threat Algorithm

1. Each raw reading is **normalized** to 0–100
2. Normalized values are multiplied by **sensor weights**
3. Weighted values are **summed** into a composite score
4. Custom rules can add **bonus points** to the score
5. Final score maps to: **GREEN** (< 30), **YELLOW** (30–70), **RED** (> 70)

---

## Custom Rules Format

Write rules in the Lab textarea, one per line:

```
light > 80 => +20
motion > 60 => +30
sound > 70 => +25
```

Each rule adds bonus points when the normalized sensor value exceeds the threshold.

---

## Trilingual Support

- **English** (default)
- **Francais** — full translation
- **Arabic** — full translation with automatic RTL layout

All text uses `data-i18n` attributes.

---

## JS API (inherited from template)

| Function | Description |
|----------|-------------|
| `log(msg, type)` | Log to activity panel. Types: `info`, `success`, `error`, `tx`, `rx` |
| `showToast(msg, ms)` | Toast notification with optional auto-hide |
| `setStatus(bool)` | Green/red status pill |
| `playSound(type)` | `click`, `success`, `error` |
| `startScan()` | Begin auto-scanning simulation |
| `stopScan()` | Stop scanning |

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
