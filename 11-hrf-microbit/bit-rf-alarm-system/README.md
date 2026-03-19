# bit-rf-alarm-system — Workshop DIY v1.0

RF Alarm System — Jam & Spoof Lab. Build a simple radio alarm, then learn to jam and spoof it to understand why real security systems need encryption.

---

## What Students Learn

- How wireless alarm systems communicate over RF (433 MHz)
- Why fixed codes are vulnerable to eavesdropping and replay attacks
- How RF jamming blocks legitimate signals
- How replay attacks capture and retransmit valid codes
- Why rolling codes defeat replay attacks
- Principles of secure RF protocol design (encryption, frequency hopping, challenge-response)

---

## Features

| Feature | Description |
|---------|-------------|
| Alarm Panel | Visual display with Armed/Disarmed/ALERT states and keypad |
| Remote Control | Arm and Disarm buttons simulating RF remote |
| Jam Signal | Flood the channel with noise — blocks all commands |
| Record & Replay | Capture a disarm frame and retransmit it later |
| Signal Quality Meter | Real-time visualization — drops during jamming |
| Security Mode Toggle | Switch between Basic (fixed code) and Secure (rolling codes) |
| Rolling Code Display | Shows the current code used for each transmission |
| Trilingual | English, French, Arabic with RTL support |
| 8 Themes | Mosque, Zellige, Andalus, Space, Jungle, Robot, Riad, Medina |

---

## Files

| File | Description |
|------|-------------|
| `index.html` | UI layout with alarm panel, controls, attack tools, 3 sections |
| `script.js` | i18n (EN/FR/AR), alarm state machine, jam/replay simulation, template features |
| `style.css` | Template styles (DO NOT MODIFY) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step guide for students and teachers |

---

## Quick Start

1. Open `index.html` in a browser
2. Arm the alarm using the "Arm" button
3. Try the attack tools: Jam Signal, Record & Replay
4. Switch to Secure mode and observe how rolling codes defend against replay attacks
5. Explore sections A (How It Works), B (Lab), and C (Challenge)

---

## Simulation Logic

### Alarm State Machine

```
disarmed --[arm]--> armed --[wrong code]--> triggered
armed --[disarm]--> disarmed
triggered --[correct code]--> disarmed
```

### Basic Mode (No Encryption)
- Fixed code: `1234`
- Sent as plaintext on every arm/disarm
- Replay attack works: captured code is always valid

### Secure Mode (Rolling Codes)
- Each transmission generates a unique code (`RC-XXXX`)
- Counter increments after each use
- Replay attack fails: captured code has already been consumed

### Jamming
- Floods the RF channel with noise
- Signal quality drops to near zero
- All arm/disarm commands fail while jammer is active

---

## API (Template)

| Function | Description |
|----------|-------------|
| `log(msg, type)` | Log with typewriter effect. Types: `info`, `success`, `error`, `tx`, `rx` |
| `showToast(msg, ms)` | Toast notification |
| `setStatus(bool)` | Green/red status pill |
| `playSound(type)` | `'click'`, `'success'`, `'error'` |

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
