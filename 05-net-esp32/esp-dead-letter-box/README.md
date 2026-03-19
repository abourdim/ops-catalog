# esp-dead-letter-box — WiFi Dead Drops

ESP32 hidden WiFi AP simulation where agents discover and decrypt secret files from a dead drop vault.

## Features

- WiFi network scanner simulation with hidden AP detection
- Active probe mode for discovering hidden SSIDs
- Encrypted file vault with XOR decryption
- Signal strength slider affecting scan results
- 3 challenges on hidden SSIDs and encryption
- Trilingual i18n (EN/FR/AR) with RTL support
- 8 themes, activity log, sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | Layout with AP scanner, vault, sections A/B/C |
| `script.js` | i18n, AP simulation, XOR encryption, vault |
| `style.css` | Shared template styles (unchanged) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step usage guide |
| `CHANGES.md` | Version changelog |

## Quick Start

Open `index.html` in any modern browser. Click Scan Networks, find the hidden APs, connect, and decrypt files with key: `ESPION`.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
