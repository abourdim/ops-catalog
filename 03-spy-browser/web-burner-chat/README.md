# 💬 Burner Chat — Ephemeral P2P

**Workshop DIY — Spy Browser Collection**

Encrypted chat that vanishes when you close the tab. Messages auto-destruct with configurable timers.

## Features

- Simulated P2P chat with fake peer "Agent Shadow"
- Configurable self-destruct timer (10s/30s/60s/never)
- Message burn animation with countdown
- E2E encryption visual indicator
- Encryption inspector showing simulated AES-256-GCM details
- 12 spy-themed auto-replies
- Trilingual i18n (EN / FR / AR with RTL), 8 themes

## Files

| File | Description |
|------|-------------|
| `index.html` | Chat UI + 3 sections (E2E, Ephemeral, Inspector) + help |
| `script.js` | i18n, chat simulation, encryption visual, self-destruct timers |
| `style.css` | Shared template styles (unchanged) |
| `manifest.json` | PWA manifest |

## Quick Start

Open `index.html`. Type a message, click Send, watch the peer reply and messages self-destruct.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
