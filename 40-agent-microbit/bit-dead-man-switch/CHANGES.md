# CHANGES — bit-dead-man-switch

## v1.0 — 2026-03-18

### Added
- Dead Man's Switch simulation with ACTIVE / WARNING / ALERT state machine
- Real-time motion activity canvas (scrolling accelerometer trace)
- Watchdog countdown timer with configurable timeout (5-60 seconds)
- Mouse movement detection over canvas as motion simulation input
- DeviceMotion API support for real accelerometer data on mobile
- "Simulate Movement" button to manually reset the watchdog
- Two-tone siren alarm sound on alert trigger
- Alert log with timestamped history of triggered events
- Simulated SOS radio broadcast via app messaging
- Section A: "How It Works" — 4-step explanation
- Section B: "Lab" — hands-on experimentation guide
- Section C: "Challenge" — 3 progressive challenges
- Help panel with FAQ, How-To, and Wiki (Dead Man's Switch, Watchdog Timers, Inactivity Detection, Safety Systems)
- Full trilingual support (EN/FR/AR) with all custom i18n keys
- All template features preserved (themes, log, toast, panels, easter eggs)

### Technical
- Canvas-based motion graph with real-time rendering at 60fps
- State transitions: ACTIVE (green) → WARNING (yellow, last 20%) → ALERT (red, flashing)
- Motion magnitude decay for natural-looking graph visualization
- Alarm sound uses Web Audio API sawtooth oscillator for siren effect
- Compatible with DeviceMotion API for real sensor input
