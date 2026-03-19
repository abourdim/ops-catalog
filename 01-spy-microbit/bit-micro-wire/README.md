# bit-micro-wire — Workshop DIY

**BLE Audio Streaming & Transcription Simulation for micro:bit**

---

## Overview

bit-micro-wire simulates a covert audio surveillance device built around the micro:bit V2 microphone. Students learn about audio sampling, BLE data transfer, packetization, and basic transcription concepts through a hands-on browser simulation.

The app captures live microphone audio (or falls back to a sine wave) and visualizes the waveform in real time. Audio samples are virtually chunked into 20-byte BLE packets, with adjustable packet loss to demonstrate the effects of wireless transmission errors.

---

## Features

| Feature | Description |
|---------|-------------|
| Live waveform | Real-time canvas visualization via Web Audio AnalyserNode |
| Volume meter | RMS-based volume bar updated each frame |
| BLE packetization | Simulated 20-byte packet chunking with loss slider |
| Fake transcription | Spy-themed phrases with noise corruption based on packet loss |
| Stream stats | Live counters for packets sent, bytes transferred, and latency |
| Trilingual | English, French, Arabic with full RTL support |
| 8 themes | Mosque Gold, Zellige, Andalus, Space, Jungle, Robot, Riad, Medina |
| PWA ready | Manifest, offline-capable, installable |

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Layout: main card, 3 collapsible sections (How It Works, Lab, Challenge), help panel |
| `script.js` | i18n (EN/FR/AR), Web Audio simulation, waveform drawing, BLE stats, transcription |
| `style.css` | Shared template styles (not modified) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step usage guide |
| `CHANGES.md` | Changelog |

---

## Quick Start

1. Open `index.html` in any modern browser
2. Click **Start Listening** to begin audio capture
3. Watch the waveform and volume meter update live
4. Click **Transcribe** to see simulated spy intercepts
5. Open the **Lab** section to adjust packet loss and sample rate
6. Try the **Challenge** section for hands-on exercises

---

## Learning Objectives

- Understand audio sampling at 8-bit / 8 kHz
- Learn how BLE packetization works with 20-byte MTU
- Observe how packet loss degrades audio quality
- Calculate BLE throughput requirements for real-time audio
- Explore voice compression concepts (delta encoding)

---

## Technical Notes

- **Audio source**: Web Audio API `getUserMedia()` for real microphone, or `OscillatorNode` sine wave fallback
- **Waveform**: `AnalyserNode.getByteTimeDomainData()` drawn on `<canvas>`
- **Volume**: RMS calculation from time-domain samples
- **BLE simulation**: Virtual chunking of 8000 samples/sec into 20-byte packets (400 packets/sec)
- **Packet loss**: Random sample replacement with silence (value 128) based on slider percentage
- **Transcription**: Random selection from spy-themed phrase arrays, with character-level noise injection

---

## API Reference

Uses all template APIs: `log()`, `showToast()`, `hideToast()`, `setStatus()`, `setLanguage()`, `setTheme()`, `playSound()`.

### App-specific functions

| Function | Description |
|----------|-------------|
| `startListening()` | Start mic capture or sine wave, begin waveform drawing |
| `stopListening()` | Stop all audio, clear animation |
| `doTranscribe()` | Generate a random spy phrase with noise |
| `initMicroWire()` | Wire up all buttons and sliders |

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
