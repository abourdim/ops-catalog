# bit-invisible-ink — Workshop DIY v1.0

**Invisible Ink: Self-Destructing Messages Simulation for micro:bit**

Send secret messages that vanish after being read. Learn about ephemeral messaging, timer-based destruction, and read-receipt tracking.

---

## What This App Teaches

| Concept | Description |
|---------|-------------|
| Ephemeral Messaging | Messages designed to disappear after being read |
| Self-Destruct Timer | Countdown mechanism that triggers message deletion |
| Read Receipts | Confirmation and timestamp when a message is opened |
| Digital Forensics | Understanding data persistence and recovery |

---

## Files

| File | Description |
|------|-------------|
| `index.html` | UI layout: composer, received-message area, burn animation, sections A/B/C, help panel |
| `script.js` | i18n (EN/FR/AR), simulation engine (queue, countdown, burn, read receipts), template features |
| `style.css` | 9 themes, animations, responsive layout (DO NOT MODIFY) |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step tutorial |

---

## Quick Start

1. Open `index.html` in a browser
2. Type a secret message in the compose area
3. Select a self-destruct timer (5s, 10s, 30s, 60s)
4. Click **Send Secret Message**
5. Watch the message appear, count down, and burn away

---

## Features

- **Message Composer** with character count (max 280)
- **Timer Selector** dropdown (5s / 10s / 30s / 60s)
- **Simulated BLE Transfer** with encryption animation
- **Message Queue** supporting multiple pending messages
- **Character-by-Character Burn** with scramble + dissolve animation
- **Read Receipts** with precise timestamps
- **Screenshot Detection** that accelerates destruction
- **Destruction Log** in the Lab section
- **Trilingual** support (English, French, Arabic with RTL)
- **8 Themes** with melody on switch

---

## Sections

### Main Card
Message composer, timer selector, send button, received message display, countdown, burn area, read receipt indicator.

### Section A — How It Works
4-step visual guide: compose, set timer, recipient opens, message destroyed.

### Section B — Lab
Hands-on experiments: send multiple messages, attempt screenshots, analyze destruction log.

### Section C — Challenge
3 challenges: recover destroyed message, build read-once mechanism, implement screenshot detection.

---

## JS API (App-Specific)

| Function | Description |
|----------|-------------|
| `initInvisibleInk()` | Wire up composer, send button, screenshot detection |
| `enqueueMessage(text, timerSeconds)` | Encrypt, transmit simulation, add to queue |
| `processNextMessage()` | Display next message from queue |
| `displayReceivedMessage(msg)` | Show message with fade-in, start countdown |
| `burnMessage(msg, ...)` | Character-by-character scramble + dissolve |
| `onScreenshotAttempt()` | Detect screenshot, accelerate destruction |
| `addDestructionLogEntry(entry)` | Append to destruction log panel |

## JS API (Template)

| Function | Description |
|----------|-------------|
| `log(msg, type)` | Typewriter log. Types: `info`, `success`, `error`, `tx`, `rx` |
| `showToast(msg, ms)` | Toast notification with optional auto-hide |
| `setStatus(bool)` | Connected / Disconnected pill |
| `playSound(type)` | `'click'`, `'success'`, `'error'` |
| `setLanguage(lang)` | `'en'`, `'fr'`, `'ar'` |
| `setTheme(name)` | Theme name with melody |

---

## i18n Keys (App-Specific)

All keys are defined in `LANG.en`, `LANG.fr`, and `LANG.ar`:

`composePlaceholder`, `sendMsg`, `selfDestructIn`, `burnComplete`, `stepA1`-`stepA4`, `labTask1Title`, `labTask1Desc`, `labTask2Title`, `labTask2Desc`, `labTask3Title`, `labTask3Desc`, `challenge1`-`challenge3`, `msgEncrypting`, `msgTransmitting`, `msgQueued`, `msgReceived`, `msgOpened`, `msgDestroyed`, `msgBurning`, `screenshotDetected`, `noMessage`, `readAt`, `pendingMsgs`

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
