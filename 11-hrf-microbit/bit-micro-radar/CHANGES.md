# CHANGES — bit-micro-radar

## v1.0 — 2026-03-18

### Initial Release

- Radar simulation with classic green canvas display (300x300)
- Rotating sweep line with 30-degree fade trail
- Concentric range rings with dynamic scaling (10m, 50m, 100m)
- Cardinal direction labels (N, S, E, W)
- Blip detection: objects glow when sweep line passes their angle
- Blip decay over 5 seconds (classic radar fade effect)
- Active mode: detects all objects
- Passive mode: only detects objects that emit signals
- Click-to-place: add virtual objects by clicking the canvas
- Random object seeding with 5 types: aircraft, ship, vehicle, drone, unknown
- Moving targets: ~30% of objects change position between sweeps
- Stealth objects: ~10% appear as faint blips
- Live object list with bearing, distance, and type
- Real-time detection counter
- Section A: "How It Works" — 4-step radar cycle explanation
- Section B: "Lab" — interactive experiments (place, watch, range, modes)
- Section C: "Challenge" — 3 challenges (full sweep ID, moving tracker, stealth detect)
- Help panel: FAQ, How-To, Wiki (Radar Principles, Polar Coordinates, EM Detection, micro:bit Sensors)
- Full trilingual support: English, French, Arabic (RTL)
- All template features: 8 themes, log panel, toast, status pill, sound effects
- PWA manifest updated for bit-micro-radar
