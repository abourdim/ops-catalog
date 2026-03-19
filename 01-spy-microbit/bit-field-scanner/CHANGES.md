# CHANGES — bit-field-scanner

## v1.0 — 2026-03-18

### Added
- Main HUD card with threat level indicator (GREEN / YELLOW / RED)
- 5 sensor gauges: Light (0–255), Temperature (-10 to 50°C), Motion (0–2000 mg), Sound (0–255), Magnetic (0–360°)
- Start Scan / Stop buttons for auto-scanning simulation
- Simulated sensor noise and random "intruder detected" events
- Threat assessment log with color-coded timestamped entries
- Section A: "How It Works" — 4-step explanation of sensor fusion pipeline
- Section B: "Lab" — interactive sliders for each sensor, custom threat rules editor, real-time HUD canvas with radar sweep
- Section C: "Challenge" — 3 guided challenges (room calibration, intruder detection, custom threat category)
- Help panel: FAQ (4 questions), How-To (4 steps), Wiki (Sensor Fusion, Threat Assessment, HUD Design, micro:bit Sensors)
- Full trilingual support: English, French, Arabic with RTL
- HUD canvas with radar sweep animation, sensor blips, and threat-colored rendering
- Weighted threat algorithm with configurable sensor weights
- Custom rules parser (format: `sensor > threshold => +bonus`)
- Scan-line CSS animation on active gauges
- Minimal inline styles for threat-indicator, sensor-gauge, hud-grid, scan-line

### Infrastructure (from template v1.2)
- 9 themes (6 dark + 2 light Islamic + retro)
- Splash screen, Activity Log, Settings panel
- Sound effects, Whisper mode, Breathing guide
- Konami code, Matrix rain, Morse blink, Debug panel
- Pixel pet, Ghost cursors, Night mode, Logo tracker
- PWA manifest
