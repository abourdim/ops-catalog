# bit-dead-man-switch — Workshop DIY

**Dead Man's Switch — Motion Monitor & Alert Simulation for micro:bit**

A browser-based educational app that simulates a dead man's switch safety system. If the micro:bit (or simulated motion input) detects no movement for a configurable period, the system triggers an emergency alert with sound, logging, and a simulated SOS broadcast.

---

## What Students Learn

- **Inactivity detection** — how accelerometers measure movement and stillness
- **Watchdog timers** — periodic reset mechanisms used in embedded systems
- **State machines** — ACTIVE / WARNING / ALERT transition logic
- **Safety systems** — real-world dead man's switch applications (trains, lone-worker devices)

---

## Features

| Feature | Description |
|---------|-------------|
| Motion graph | Real-time scrolling canvas showing accelerometer magnitude |
| Watchdog timer | Configurable countdown (5-60s) that resets on motion |
| State machine | ACTIVE (green) → WARNING (yellow, last 20%) → ALERT (red, flashing) |
| Alert system | Alarm sound + log entry + simulated SOS radio broadcast |
| Mouse simulation | Move mouse over canvas to simulate accelerometer input |
| DeviceMotion API | Real accelerometer data on mobile devices |
| Alert log | Timestamped history of triggered emergency events |
| Trilingual | English, French, Arabic with RTL support |
| 8 themes | Mosque Gold, Zellige, Andalus, Riad, Medina, Space, Jungle, Robot |

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Layout with main card, 3 sections (How It Works, Lab, Challenge), help panel |
| `script.js` | Simulation engine, i18n (EN/FR/AR), all template features |
| `style.css` | Themes, animations, responsive layout (DO NOT MODIFY) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step lab guide |
| `CHANGES.md` | Version history |

---

## Quick Start

1. Open `index.html` in a browser
2. Click **Activate Switch** to start the watchdog timer
3. Move your mouse over the motion canvas to keep the timer alive
4. Stop moving — watch the countdown reach WARNING then ALERT
5. Adjust the timeout slider to test different sensitivity levels

---

## API Reference

### Template APIs (inherited)

| Function | Description |
|----------|-------------|
| `log(msg, type)` | Log with typewriter effect. Types: `info`, `success`, `error`, `tx`, `rx` |
| `showToast(msg, ms)` | Toast notification with optional auto-hide |
| `setStatus(bool)` | Green (connected) / red (disconnected) pill |
| `playSound(type)` | `'click'`, `'success'`, `'error'` |
| `setLanguage(lang)` | `'en'`, `'fr'`, `'ar'` |
| `setTheme(name)` | Theme name from 8 available themes |

### App-Specific Functions

| Function | Description |
|----------|-------------|
| `activateSwitch()` | Start the watchdog timer and motion monitoring |
| `deactivateSwitch()` | Stop the switch and reset state |
| `simulateMotion()` | Inject fake motion to reset the watchdog |
| `onMotionDetected(mag)` | Handle motion event with magnitude 0-1 |
| `triggerAlert()` | Fire the emergency alert (sound + log + broadcast) |
| `playAlarmSound()` | Two-tone siren alarm via Web Audio API |

---

## Sections

### Section A — How It Works
4-step explanation: accelerometer monitoring → watchdog timer → alert trigger → SOS broadcast.

### Section B — Lab
Hands-on experimentation: adjust timeout values, use mouse as motion sim, observe state transitions, configure sensitivity.

### Section C — Challenge
1. Trigger alert in exactly 10 seconds
2. Keep the switch alive for 2 full minutes
3. Design a two-stage alert (WARNING beep at 50%, full ALERT at 0%)

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
