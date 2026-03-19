# CHANGES — bit-signal-meter

## v1.0 — 2026-03-18

### Added
- 5x5 LED grid simulation with toggleable cells and brightness levels (dim, on, bright)
- S-meter reading display with real-time S-unit conversion (S0 to S9+60dB)
- dBm value display showing absolute signal power
- Signal source simulator with slider control (-120 to -30 dBm)
- Noise floor slider (-140 to -80 dBm)
- Auto Scan button with animated signal sweep from weak to strong
- SNR (signal-to-noise ratio) live calculation and display
- Bar graph visualization: columns fill from bottom based on signal level
- Noise fluctuation on LED display for realistic simulation
- Section A: "How It Works" — 4-step signal measurement pipeline
- Section B: "Lab" — 4 hands-on experiments (mapping, calibration, SNR, analog vs digital)
- Section C: "Challenge" — 3 challenges (custom patterns, signal-in-noise, peak-hold)
- Help panel with FAQ, How-To, and Wiki tabs
- Wiki entries: S-Meter Scale, dB and dBm, Signal-to-Noise Ratio, LED Matrix Programming
- Full trilingual i18n: English, French, Arabic (RTL)
- docs/HOWTO.md step-by-step guide

### Template
- Based on Workshop-DIY Template v1.2
- Preserved all template infrastructure (themes, panels, log, sound, easter eggs)
- Minimal inline styles for LED grid components only
