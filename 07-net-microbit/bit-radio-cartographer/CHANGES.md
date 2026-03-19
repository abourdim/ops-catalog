# CHANGES — bit-radio-cartographer

## v1.0 — 2026-03-18

### Added
- Interactive heatmap canvas (600x350, 8px grid cells)
- Transmitter placement via click — multiple TXs with power summing
- Real-time RSSI display on mouse hover (dBm + grid coordinates)
- Log-distance path loss model: RSSI = txPower - 10 * n * log10(d) + noise
- Obstacle walls — click-and-drag to draw, adjustable attenuation (5-30 dB)
- Frequency comparison: 2.4 GHz (n=2.8) vs 900 MHz (n=2.2)
- Color-coded heatmap: red (strong) to blue (weak)
- Export heatmap as PNG image (canvas.toDataURL)
- Section A: "How It Works" — 4-step visual guide
- Section B: "Lab" — multi-TX, obstacles, frequency toggle, dead zones
- Section C: "Challenge" — 3 challenges (full coverage, dead zone, 3-TX layout)
- Help panel: FAQ (5 questions), How-To (5 steps), Wiki (RSSI, Propagation, Heatmaps, Coverage)
- Full i18n: English, French, Arabic (all keys)
- Color legend gradient bar (strong to weak)
- Transmitter/obstacle count display
- Built on Workshop-DIY template v1.2 (themes, log, toast, status, sound, easter eggs)
