# 📶 bit-signal-meter — Workshop DIY

**Signal Meter S-Meter Display on micro:bit 5x5 LED Matrix**

A Workshop-DIY educational web app that simulates a radio signal strength meter (S-meter) on the micro:bit's 5x5 LED matrix. Students learn about signal measurement, S-units, dB scales, and LED matrix programming.

---

## What You Learn

- **S-Meter Scale**: S1 to S9+ signal strength units used in amateur radio
- **dB and dBm**: Decibel scales for measuring signal power
- **Signal-to-Noise Ratio (SNR)**: How noise affects signal readability
- **LED Matrix Programming**: Mapping data to a 5x5 grid display
- **Bar Graph Visualization**: Representing analog values as visual columns

---

## Features

| Feature | Description |
|---------|-------------|
| 5x5 LED Grid | Interactive div-based LED matrix with toggleable cells |
| S-Meter Reading | Real-time S-unit display (S0 to S9+60dB) |
| dBm Display | Absolute power reading in dBm |
| Signal Slider | Simulate signal levels from -120 to -30 dBm |
| Noise Floor Slider | Adjustable background noise level |
| Auto Scan | Animated sweep from weak to strong signal |
| SNR Display | Live signal-to-noise ratio calculation |
| Bar Graph | LED columns fill based on signal strength |

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Layout: LED grid, sliders, S-meter display, 3 sections, help panel |
| `script.js` | i18n (EN/FR/AR), simulation engine, LED control, S-unit conversion |
| `style.css` | Template themes and animations (do not modify) |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step guide |

---

## Quick Start

1. Open `index.html` in a browser
2. Move the **Signal Level** slider to change the simulated signal strength
3. Watch the LED matrix bar graph respond in real-time
4. Read the S-meter value and dBm display
5. Adjust the **Noise Floor** slider to see SNR effects
6. Click **Auto Scan** for an animated signal sweep

---

## S-Meter Reference

| S-Unit | dBm | Description |
|--------|-----|-------------|
| S1 | -121 | Barely perceptible |
| S2 | -115 | Very weak |
| S3 | -109 | Weak |
| S4 | -103 | Fair |
| S5 | -97 | Fairly good |
| S6 | -91 | Good |
| S7 | -85 | Moderately strong |
| S8 | -79 | Strong |
| S9 | -73 | Very strong |
| S9+10 | -63 | Extremely strong |
| S9+20 | -53 | Very extremely strong |

Each S-unit = 6 dB of signal change.

---

## Sections

### How It Works (Section A)
Four steps explaining the signal measurement pipeline: antenna reception, ADC conversion, dB/S-unit calculation, and LED bar graph display.

### Lab (Section B)
Hands-on experiments: mapping signals to LED patterns, calibrating the S-meter, measuring SNR, and comparing analog vs digital meters.

### Challenge (Section C)
Three challenges: designing custom LED patterns per S-level, finding signals in noise, and building a peak-hold meter.

---

## Trilingual Support

- **English** (EN) — default
- **Francais** (FR) — full translation
- **Arabic** (AR) — full translation with RTL support

---

## Template API Used

| Function | Usage |
|----------|-------|
| `log(msg, type)` | Log signal events (info, success, error, tx, rx) |
| `showToast(msg)` | Show scanning status |
| `hideToast()` | Hide scanning toast |
| `setStatus(bool)` | Green/red connection indicator during scan |
| `setLanguage(lang)` | Switch language (en/fr/ar) |
| `setTheme(name)` | Switch visual theme |
| `playSound(type)` | Audio feedback on interactions |

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
