# bit-frequency-duel — Workshop DIY

**2.4GHz Waterfall Spectrum Simulator for micro:bit Education**

---

## What This App Teaches

Frequency Duel visualizes the 2.4GHz ISM band as a real-time waterfall display (spectrogram). Students see simulated micro:bit signals alongside WiFi and Bluetooth traffic, learning about:

- **Spectrum sharing** — many devices coexist in the same 2.4GHz band
- **Interference** — what happens when signals overlap in frequency
- **Channel selection** — choosing the right micro:bit channel to avoid WiFi
- **Waterfall displays** — how professionals read spectrograms

---

## Quick Start

1. Open `index.html` in a browser (no server needed)
2. Watch the waterfall display scroll with simulated WiFi, Bluetooth, and noise
3. Select a channel (0–83) and power level (0–7)
4. Press **Transmit** to send a micro:bit burst and see it on the spectrum
5. Check the interference meter and find a clear channel

---

## Files

| File | Description |
|------|-------------|
| `index.html` | UI layout with waterfall canvas, sliders, sections A/B/C, help panel |
| `script.js` | Template engine + i18n (EN/FR/AR) + waterfall simulation |
| `style.css` | 9 themes, animations, responsive layout (do not modify) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step lab guide for students |
| `CHANGES.md` | Version history |

---

## Simulation Details

### Waterfall Display
- Canvas scrolls upward at ~12 rows/second
- Each row represents the full 2.400–2.485 GHz band (85 columns)
- Color heatmap: dark blue (noise) -> blue (weak) -> green (medium) -> yellow (strong) -> red (very strong)

### Signal Types
| Signal | Color | Pattern |
|--------|-------|---------|
| micro:bit | Green | Narrow 1MHz spike at selected channel |
| WiFi | Blue-yellow | Wide 20MHz bumps at channels 1, 6, 11 |
| Bluetooth | Purple spikes | Random narrow hops across band |
| Noise | Dark gray | Low-level random floor |

### Interference Calculation
- Measures overlap between selected micro:bit channel and WiFi center frequencies
- WiFi centers at 2412, 2437, 2462 MHz (columns 12, 37, 62)
- Interference 0% = clear channel, 100% = direct WiFi overlap

---

## i18n

Trilingual: English, French, Arabic (RTL). All UI text uses `data-i18n` attributes mapped to the `LANG` object in `script.js`.

---

## API Used

| Function | Purpose |
|----------|---------|
| `log(msg, type)` | Log events (info, success, error, tx, rx) |
| `showToast(msg, ms)` | Toast notification |
| `setStatus(bool)` | Connection status pill |
| `playSound(type)` | Audio feedback |

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
