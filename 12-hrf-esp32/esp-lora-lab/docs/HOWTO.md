# HOWTO — LoRa Lab

## What is this?
LoRa Lab simulates ESP32 LoRa long-range radio using Chirp Spread Spectrum (CSS). You can visualize chirps on a waterfall display, send simulated messages, and compare range at different spreading factors.

## Quick Start
1. Open `index.html` in any modern browser
2. Select a Spreading Factor (SF7 = fast, SF12 = long range)
3. Choose bandwidth (125/250/500 kHz)
4. Type a message and click Send
5. Watch the chirp sweep across the waterfall

## Understanding the Waterfall
- Colors represent signal intensity (blue = weak, yellow/red = strong)
- Chirps appear as diagonal sweeps from low to high frequency
- Each symbol's starting frequency encodes its value

## Range Calculator
- Open Section A to see Distance vs Power graph
- Green = SF7, Blue = SF9, Purple = SF12
- Higher SF = longer range but slower data rate

## Settings
- **Language**: English, French, Arabic (with RTL)
- **Theme**: 8 visual themes (Mosque, Zellige, Andalus, etc.)
- **Sound**: Toggle click/success/error audio feedback

## Key Parameters
| Parameter | Range | Effect |
|-----------|-------|--------|
| SF | 7-12 | Higher = more range, less speed |
| BW | 125-500 kHz | Higher = more speed, less range |
| TX Power | 2-20 dBm | Higher = more range |

## Files
- `index.html` — UI with embedded styles
- `script.js` — Simulation engine, i18n, themes
- `manifest.json` — PWA manifest
