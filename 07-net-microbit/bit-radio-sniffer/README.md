# 📻 bit-radio-sniffer — Workshop DIY v1.0

**Radio Sniffer Simulation — Scan micro:bit radio channels and analyze traffic patterns.**

A browser-based educational tool that simulates radio frequency scanning using micro:bit's 84 radio groups. Students learn about radio communication, packet sniffing, spectrum analysis, and frequency hopping — all without hardware.

---

## What You Learn

- **Radio Groups**: How micro:bit uses 84 separate communication channels (0-83) on the 2.4GHz ISM band
- **Packet Sniffing**: Capturing and inspecting data transmitted over radio channels
- **Spectrum Analysis**: Reading bar charts and waterfall displays to understand channel activity
- **Frequency Hopping**: Why switching channels improves security and reduces interference
- **Data Encoding**: Hex representation, text decoding, and Caesar cipher basics

---

## Features

| Feature | Description |
|---------|-------------|
| Spectrum Display | Real-time bar chart + waterfall canvas showing activity across 84 channels |
| Channel Selector | Slider to tune to any channel (0-83) |
| Start/Stop Scan | Monitor a single channel for packet traffic |
| Auto Scan | Sweep through all 84 channels automatically |
| Packet Capture | Live list of captured packets with hex data + decoded text |
| Lab Mode | Generate fake traffic, burst mode, clear spectrum, export captures |
| 3 Challenges | Find hidden messages, identify busiest channels, crack Caesar ciphers |
| Trilingual | English, French, Arabic (RTL) |
| 8 Themes | Mosque, Zellige, Andalus, Space, Jungle, Robot, Riad, Medina |

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Main UI — spectrum display, controls, sections A/B/C, help panel |
| `script.js` | Simulation engine, i18n (EN/FR/AR), all template features |
| `style.css` | 8 themes, responsive layout, animations (DO NOT MODIFY) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step guide for students |
| `CHANGES.md` | Version history |

---

## Quick Start

1. Open `index.html` in any modern browser
2. Click **Start Scan** to monitor the selected channel
3. Use **Auto Scan** to sweep all 84 channels
4. Open the **Lab** section to generate simulated traffic
5. Try the **Challenges** to test your skills

---

## Sections

### Main Card
- Spectrum canvas (bar chart + waterfall)
- Channel selector (0-83)
- Scan controls (Start, Stop, Auto Scan)
- Packet capture list with hex + decoded text
- Channel info badges (CH, PKT, SIG)

### Section A — How It Works
Four steps: Tune to Channel, Listen for Packets, Capture & Decode, Display on Spectrum.

### Section B — Lab
- Generate Traffic: inject random packets across channels
- Burst Mode: concentrate heavy traffic on a few channels
- Clear Spectrum: reset all activity data
- Export Capture: save packets as a text file

### Section C — Challenge
1. **Find the Hidden Message**: A secret message is transmitted on a random channel
2. **Identify Busiest Channel**: After a burst, name the channel with highest activity
3. **Decode the Transmission**: Crack a Caesar-cipher-encoded message

---

## JS API (App-Specific)

| Function | Description |
|----------|-------------|
| `startScan()` | Monitor the selected channel |
| `stopScan()` | Stop all scanning |
| `startAutoScan()` | Sweep through all 84 channels |
| `generateTraffic()` | Inject random packets on random channels |
| `generateBurst()` | Heavy traffic burst on 5 random channels |
| `clearSpectrum()` | Reset spectrum and packet list |
| `exportCapture()` | Download captured packets as text |
| `startChallenge1()` | Start hidden message challenge |
| `startChallenge2()` | Start busiest channel challenge |
| `startChallenge3()` | Start Caesar cipher challenge |

All template APIs (`log()`, `showToast()`, `setStatus()`, `playSound()`, etc.) are fully available.

---

## micro:bit Connection (Future)

This version is a **simulation**. To connect to real micro:bit hardware:
1. Use Web Bluetooth or Web Serial API
2. Flash the micro:bit with a radio sniffer program (MakeCode or MicroPython)
3. Replace `simulateChannelTraffic()` with real radio data

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
