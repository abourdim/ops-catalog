# bit-rf-remote-control — Workshop DIY

> Build your own radio protocol from scratch and control a virtual device.

---

## What You Will Learn

- **Protocol Design**: How to structure a radio frame with preamble, address, command, payload, and checksum fields.
- **Frame Structure**: The role of each field in a data frame and why order matters.
- **Checksums & Error Detection**: XOR checksum computation to detect transmission errors.
- **Command Encoding**: Mapping human actions (UP, DOWN, LEFT, RIGHT, A, B) to hex command codes.
- **Error Injection**: Simulating a noisy wireless channel by flipping random bits.
- **Replay Attacks & Defenses**: Understanding how captured frames can be replayed and how sequence numbers prevent it.

---

## Quick Start

1. Open `index.html` in any modern browser (no server needed).
2. Edit the **Preamble**, **Address**, and **Payload** fields to customize your protocol.
3. Press a **command button** (UP/DOWN/LEFT/RIGHT/A/B) to build and transmit a frame.
4. Watch the **Frame Inspector** for the hex dump and the **Checksum** indicator for pass/fail.
5. Slide the **Error Rate** to inject noise and observe corrupted frames.

---

## Features

| Feature | Description |
|---------|-------------|
| Protocol Frame Builder | Editable hex fields for preamble, address, command, payload, checksum |
| Command Grid | Six buttons that encode commands into the frame |
| Virtual Device | A robot that moves in response to valid commands |
| Frame Inspector | Color-coded hex dump of TX and RX frames |
| Error Rate Slider | Simulates 0-50% bit-flip noise on the channel |
| Checksum Verification | XOR checksum with real-time pass/fail indicator |
| Keyboard Controls | Arrow keys + A/B for quick commanding |
| Trilingual i18n | English, French, Arabic (RTL) |
| 8 Themes | Dark and light Islamic-inspired themes |
| Activity Log | Timestamped TX/RX/info/error log with filters |

---

## How the Simulation Works

1. **Build**: The frame builder assembles bytes from the editable fields.
2. **Checksum**: All frame bytes are XORed together; the result is appended.
3. **Transmit**: The frame is "sent" (TX logged).
4. **Noise**: Based on the error rate slider, random bits may be flipped.
5. **Receive**: The (possibly corrupted) frame is "received" (RX logged).
6. **Verify**: The receiver XORs all bytes; if the result matches the checksum byte, the frame is valid.
7. **Act**: Valid frames move the robot; invalid frames are rejected.

---

## Frame Format

```
[ Preamble ] [ Address ] [ Command ] [ Payload ] [ Checksum ]
   1 byte      1 byte     1 byte      1 byte      1 byte
```

- **Preamble**: Synchronization marker (default `0xAA`).
- **Address**: Device identifier (default `0x01`).
- **Command**: Action code (`0x01`=UP, `0x02`=DOWN, `0x03`=LEFT, `0x04`=RIGHT, `0x10`=A, `0x20`=B).
- **Payload**: Extra data byte (user-defined).
- **Checksum**: XOR of all preceding bytes.

---

## Command Map

| Button | Hex Code | Action |
|--------|----------|--------|
| UP     | `0x01`   | Move robot up |
| DOWN   | `0x02`   | Move robot down |
| LEFT   | `0x03`   | Move robot left |
| RIGHT  | `0x04`   | Move robot right |
| A      | `0x10`   | Pulse action |
| B      | `0x20`   | Reset position |

---

## Challenges

1. **ACK Protocol**: Modify the simulation so the device sends an acknowledgment frame back after each valid command.
2. **1-Bit Error Correction**: Implement Hamming-style parity so the receiver can detect and fix single-bit errors.
3. **Replay Defense**: Add a sequence number to each frame and reject duplicates.

---

## File Structure

```
bit-rf-remote-control/
  index.html      -- Main app page
  script.js       -- App logic, i18n, simulation engine
  style.css       -- Shared Workshop-DIY styles (do not modify)
  manifest.json   -- PWA manifest
  README.md       -- This file
  CHANGES.md      -- Version history
  docs/
    HOWTO.md      -- Step-by-step lab guide
```

---

## JS API (Template)

| Function | Description |
|----------|-------------|
| `log(msg, type)` | Log with typewriter effect. Types: `info`, `success`, `error`, `tx`, `rx` |
| `showToast(msg, ms)` | Toast notification with optional auto-hide |
| `setStatus(bool)` | Green (connected) / red (disconnected) pill |
| `setLanguage(lang)` | `'en'`, `'fr'`, `'ar'` |
| `setTheme(name)` | Theme name with melody |
| `sendCommand(cmd)` | Build frame, inject errors, verify checksum, move robot |

---

## Tech Stack

- Vanilla HTML / CSS / JavaScript
- No frameworks, no build step, no dependencies
- PWA-ready with offline support
- Privacy-first: all data stays in the browser

---

## Credits

Built with the [Workshop-DIY](https://workshop-diy.org) template by abourdim.

## License

Educational use. Free to remix and share.
