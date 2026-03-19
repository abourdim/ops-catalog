# bit-satellite-alarm — Workshop DIY

Satellite pass alert simulation for micro:bit learners. Predict when the ISS or satellites pass overhead and trigger visual/audio alerts.

---

## What This App Teaches

- **Orbital mechanics basics** — how satellites follow predictable paths around Earth
- **Pass prediction** — calculating when a satellite crosses your visible sky
- **Elevation & azimuth** — the coordinate system for pointing at objects in the sky
- **Real-time tracking concepts** — countdown timers, trajectory visualization, alert systems

---

## Features

| Feature | Description |
|---------|-------------|
| Sky map | Polar projection canvas showing satellite trajectory arcs with elevation circles (30/60/90) and cardinal directions |
| Pass list | Table of the next 5 predicted passes with time, max elevation, and duration |
| Countdown timer | Live countdown to the next satellite pass |
| Alarm system | Flash + sound alert when a pass begins |
| Simulate Pass | Accelerated animation of an ISS pass across the sky map |
| Lab controls | Adjust observer latitude/longitude, orbit altitude, and inclination |
| Pass timer | Stopwatch to measure pass duration |
| Trilingual | Full EN/FR/AR support with RTL for Arabic |

---

## Sections

### Main Card
- Polar sky map canvas (300x300)
- Next pass countdown (Orbitron monospace)
- Satellite info grid: name, elevation, azimuth, visibility
- Upcoming 5 passes table
- Set Alarm / Simulate Pass buttons
- Observer location display

### Section A — How It Works
Four-step explanation of satellite pass prediction:
1. Satellites orbit at known trajectories (TLE data)
2. Predict when orbit crosses observer sky
3. Calculate elevation/azimuth over time
4. Trigger alarm at pass start

### Section B — Lab
Interactive experimentation:
- Observer latitude/longitude sliders
- Orbit altitude slider (200-2000 km)
- Orbit inclination slider (0-90 degrees)
- Run Simulation, Reset, Timer buttons

### Section C — Challenge
Three challenges:
1. Predict the next visible pass
2. Calculate ISS speed from pass timing
3. Find the highest elevation pass

### Help Panel
- **FAQ** — 4 questions about app purpose, real-time tracking, elevation/azimuth, observer location
- **How-To** — 4 steps for using the app
- **Wiki** — Orbital Mechanics, Pass Prediction, Elevation & Azimuth, ISS Facts

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Main layout with sky map, pass list, sections A/B/C, help panel |
| `script.js` | i18n (EN/FR/AR), satellite simulation, sky map renderer, pass prediction, alarm system |
| `style.css` | Template styles (DO NOT MODIFY) |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Version changelog |
| `docs/HOWTO.md` | Detailed usage guide |

---

## Template API Used

| Function | Usage in App |
|----------|-------------|
| `log(msg, type)` | Log pass events, alarm triggers, simulation status |
| `showToast(msg)` | Toast notifications |
| `setStatus(bool)` | Connection status indicator |
| `playSound(type)` | Alarm beeps, button clicks, success/error feedback |
| `setLanguage(lang)` | Switch EN/FR/AR with full i18n |
| `setTheme(name)` | 8 themes with musical melodies |

---

## Quick Start

1. Open `index.html` in a browser
2. The sky map draws automatically with the polar projection
3. Click **Simulate Pass** to watch an ISS pass animation
4. Click **Set Alarm** to arm the alert for the next predicted pass
5. Open **Lab** to experiment with different locations and orbits

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
