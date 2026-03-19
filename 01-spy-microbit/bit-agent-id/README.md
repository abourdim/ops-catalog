# bit-agent-id — Workshop DIY

**Encrypted BLE Identity Authentication Simulation for micro:bit**

---

## What It Teaches

Agent ID creates a secure identity badge using the micro:bit. Each agent has an encrypted BLE identity that others can verify. Students learn about:

- **Public/Private Key Concepts** — How asymmetric key pairs work
- **Digital Signatures** — Signing data with private keys, verifying with public keys
- **Identity Authentication** — Proving you are who you claim to be
- **BLE Broadcasting** — How Bluetooth Low Energy transmits identity tokens

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Main UI with agent card, 3 sections (How It Works, Lab, Challenge), help panel |
| `script.js` | Full simulation engine, i18n (EN/FR/AR), crypto helpers, template infrastructure |
| `style.css` | Template styles (8 themes, animations, responsive) — DO NOT MODIFY |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step workshop guide |

---

## Features

### Main Card
- **Agent Card** — ID badge display with codename, clearance level, emoji avatar, unique ID hash
- **Generate Identity** — Creates a simulated key pair and signs the agent identity
- **Broadcast ID** — Simulates BLE advertisement packets with the signed token
- **Verify Agent** — Scans for a nearby agent and checks their signature (VERIFIED/IMPOSTOR)
- **Key Pair Display** — Shows the truncated public key hash

### Section A: How It Works
4-step visual guide: Generate Keys, Sign Identity, Broadcast via BLE, Verify Signature

### Section B: Lab
- **Experiment 1** — Generate multiple agent identities and compare hashes
- **Experiment 2** — Forge a fake identity and observe verification failure
- **Experiment 3** — Side-by-side comparison of authentic vs forged identities

### Section C: Challenge
1. Create a fake ID that passes verification (hint: you need the private key)
2. Implement multi-factor authentication with a time-based second factor
3. Design a revocation system for compromised keys

### Help Panel
- **FAQ** — What is Agent ID, how verification works, can you forge, privacy
- **How-To** — 4-step guide to using the app
- **Wiki** — Digital Signatures, Public Key Cryptography, Identity Verification, BLE Authentication

---

## Simulation Details

### Crypto (Simplified)
- **Hash**: FNV-1a based hash function expanded to 64 hex characters
- **Key Pair**: Simulated RSA-like keys using small primes (p, q, e, d, n)
- **Sign**: Modular exponentiation `(hash^d) mod n` + hash suffix
- **Verify**: Signature consistency check against public key

### BLE Simulation
- ADV_IND flags, device name, manufacturer data, service data, TX power
- Realistic packet structure logged to Activity Log

---

## i18n

Trilingual support: English, French, Arabic (RTL). All UI text uses `data-i18n` attributes.

---

## Quick Start

1. Open `index.html` in a browser
2. Click **Generate Identity** to create your agent profile
3. Click **Broadcast ID** to simulate BLE transmission
4. Click **Verify Agent** to check a received identity
5. Explore the Lab and Challenge sections

---

## JS API (Template)

| Function | Description |
|----------|-------------|
| `log(msg, type)` | Log with typewriter effect (info, success, error, tx, rx) |
| `showToast(msg, ms)` | Toast notification |
| `setStatus(bool)` | Status pill (connected/disconnected) |
| `playSound(type)` | Sound effects (click, success, error) |
| `setLanguage(lang)` | Switch language (en, fr, ar) |
| `setTheme(name)` | Switch theme |

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
