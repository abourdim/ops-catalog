# bit-extraction-signal — Workshop DIY

Emergency extraction beacon simulation for micro:bit learning.

---

## What It Teaches

- **Emergency beacons**: how ELT, PLB, and EPIRB devices work
- **Signal encoding**: packing identity, status, and location into compact binary frames
- **Priority levels**: triage logic (routine, urgent, critical, MAYDAY)
- **Rescue protocols**: acknowledgment, response times, extraction procedures

---

## Files

| File | Description |
|------|-------------|
| `index.html` | UI: beacon controls, pulse animation, frame display, 3 learning sections |
| `script.js` | Simulation engine, i18n (EN/FR/AR), template infrastructure |
| `style.css` | Template styles (do not modify) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step usage guide |
| `CHANGES.md` | Version history |

---

## Quick Start

1. Open `index.html` in a browser
2. Enter an Agent ID (e.g., `ALPHA-7`)
3. Select your status and priority level
4. Enter grid coordinates (e.g., `37N 4512 7834`)
5. Click **Activate Beacon**
6. Watch the pulse animation and hex-encoded frame
7. Wait for simulated rescue acknowledgment

---

## Simulation Details

### Frame Encoding

The beacon encodes a 25-byte emergency packet:

| Offset | Size | Field |
|--------|------|-------|
| 0 | 1 | Header (0xE0 OR priority) |
| 1 | 1 | Status code (0x00-0x03) |
| 2-9 | 8 | Agent ID (ASCII, padded) |
| 10-21 | 12 | Grid coordinates (ASCII, padded) |
| 22-23 | 2 | Timestamp (minutes since midnight) |
| 24 | 1 | XOR checksum |

### Priority Levels

| Level | Pulse Speed | Color | Repeat Interval | Response Time |
|-------|-------------|-------|-----------------|---------------|
| Low (routine) | 3s | Green | 5s | 15-30s |
| Medium (urgent) | 2s | Yellow | 3s | 8-20s |
| High (critical) | 1.2s | Orange | 2s | 4-12s |
| MAYDAY | 0.6s | Red | 1s | 2-6s |

### Status Codes

| Code | Value | Meaning |
|------|-------|---------|
| 0x00 | OK | Agent is uninjured |
| 0x01 | Injured | Agent needs medical attention |
| 0x02 | Compromised | Position may be known to adversary |
| 0x03 | Under fire | Active engagement, immediate extraction needed |

---

## i18n

Trilingual support: English, French, Arabic (RTL). All UI text uses `data-i18n` attributes mapped to the `LANG` dictionary in `script.js`.

---

## Template APIs Used

| Function | Usage |
|----------|-------|
| `log(msg, type)` | Log beacon events (info, success, error, tx, rx) |
| `showToast(msg, ms)` | Notifications for activation, errors, rescue ack |
| `setStatus(bool)` | Green when broadcasting, red when standby |
| `playSound(type)` | Audio feedback for actions |

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
