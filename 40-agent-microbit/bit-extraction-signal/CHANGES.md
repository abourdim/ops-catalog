# CHANGES — bit-extraction-signal

## v1.0 — 2026-03-18

### Added
- Emergency extraction beacon simulation with 4 priority levels
- Binary frame encoder: agent ID + status + priority + grid + timestamp + checksum
- Expanding concentric circle pulse animation (color and speed vary by priority)
- Response timer tracking time since beacon activation
- Hex dump display of encoded emergency packet
- Simulated rescue acknowledgment with priority-dependent random delay
- Periodic re-broadcast at intervals based on priority level
- Cancel function to stop broadcast and return to standby
- Section A: "How It Works" — 4-step explanation of beacon encoding and rescue flow
- Section B: "Lab" — hands-on experiments with message building and decoding
- Section C: "Challenge" — 3 challenges (minimum-byte MAYDAY, unknown frame decode, stealth protocol)
- Help panel: FAQ (4 questions), How-To (4 steps), Wiki (Emergency Beacons, ELT/PLB, Signal Encoding, Rescue Protocols)
- Full i18n: English, French, Arabic with all beacon-specific keys
- Minimal inline styles for beacon-display, pulse-ring, priority-indicator, frame-hex
- PWA manifest updated for bit-extraction-signal

### Based On
- Workshop-DIY template v1.2 (themes, panels, log, sound, easter eggs preserved)
