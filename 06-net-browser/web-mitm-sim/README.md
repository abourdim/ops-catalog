# 🕵️ MITM Simulator — Play as Eve

**Workshop DIY — Net Browser Collection**

Intercept Alice and Bob's messages, then defend with encryption. See how MITM attacks work and how encryption stops them.

## Features

- 3-party canvas (Alice, Bob, Eve) with message flow visualization
- Eve intercept toggle: read messages when unencrypted
- Encryption toggle: enable TLS/SSL to block Eve
- Animated message travel between parties
- Visual comparison: encrypted vs unencrypted
- Section C: Defense Strategies panel
- Trilingual i18n (EN / FR / AR with RTL)
- 8 themes, activity log, sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | Layout: main card (3-party canvas + controls) + 3 sections |
| `script.js` | i18n, message system, intercept logic, encryption toggle |
| `style.css` | Shared template styles (unchanged) |
| `manifest.json` | PWA manifest |

## Quick Start

Open `index.html`. Send messages between Alice and Bob. Toggle Eve's intercept and encryption.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
