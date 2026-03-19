# bit-panic-button — Workshop DIY

Emergency alert system and secure data wipe simulation for micro:bit.

## What This App Teaches

**Panic Button** is an emergency system simulation: press a button to broadcast an alert and wipe sensitive data from the micro:bit. Students learn about:

- **Emergency protocols** — how real panic systems work with countdown timers and abort mechanisms
- **Data destruction** — secure erase techniques that overwrite data with random bytes before deletion
- **Broadcast messaging** — radio communication on multiple channels for emergency alerts
- **Dead-man switches** — safety mechanisms that trigger when a user fails to act

## Features

- Big red PANIC button with configurable countdown (3-15 seconds) before data wipe
- Cancel mechanism to abort the panic sequence during countdown
- Simulated data vault with 8 classified secret files
- Broadcast alert simulation on 7 radio channels with TX log entries
- Secure wipe progress bar with files disappearing one by one
- After wipe: vault shows "WIPED — 0 files remaining"
- Trilingual support: English, French, Arabic (with RTL)
- 8 visual themes with musical transitions
- Full activity log with TX/RX filtering

## How to Use

1. Open `index.html` in a modern browser
2. Go to the **Lab** section and click **Load Secret Files**
3. Press the big red **PANIC** button on the main card
4. Watch the 5-second countdown, emergency broadcast on all channels, and data wipe
5. Use **Verify Wipe** to confirm all data has been securely destroyed
6. Use **Reset** to reload the vault and try again

## Sections

| Section | Icon | Description |
|---------|------|-------------|
| Main Card | 🆘 | Panic button, countdown timer, broadcast status, data vault, wipe progress bar |
| How It Works | 🔐 | 4-step visual explanation: detect, countdown, broadcast, wipe |
| Lab | 🧪 | Load files, configure countdown duration, test panic, verify wipe, reset |
| Challenge | 🏆 | 3 challenges for advanced students |

## Challenges

1. **Cancel Before Wipe** — Start a panic and cancel before the data wipe completes
2. **Silent Panic Mode** — Design a wipe that destroys data without broadcasting an alert
3. **Dead-Man Switch** — Auto-trigger panic if the user does NOT press a button every 30 seconds

## Files

| File | Description |
|------|-------------|
| `index.html` | App layout with panic UI, sections A/B/C, help panel |
| `script.js` | i18n (EN/FR/AR), panic simulation, all template features |
| `style.css` | 8 themes, animations, responsive design (DO NOT MODIFY) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step guide for students |

## JS API (Template)

| Function | Description |
|----------|-------------|
| `log(msg, type)` | Log with typewriter. Types: `info`, `success`, `error`, `tx`, `rx` |
| `showToast(msg, ms)` | Toast notification with optional auto-hide |
| `setStatus(bool)` | Green (connected) / red (disconnected) status pill |
| `playSound(type)` | `'click'`, `'success'`, `'error'` |
| `setLanguage(lang)` | `'en'`, `'fr'`, `'ar'` |
| `setTheme(name)` | Theme name with melody |

## Tech Stack

- Vanilla HTML / CSS / JS — zero frameworks, zero dependencies
- PWA-ready with manifest.json
- Local-first, privacy-first — no data leaves the browser

## License

Workshop-DIY Educational Project — [abourdim](https://github.com/abourdim)
