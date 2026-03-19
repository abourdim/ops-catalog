# bit-micro-vpn — Workshop DIY

**Micro VPN: End-to-end encrypted relay simulation for micro:bit learning.**

---

## What This App Teaches

Students learn core networking security concepts through hands-on simulation:

- **E2E Encryption** — XOR cipher demonstrates how only endpoints can read messages
- **Relay/Proxy Concepts** — Packets travel through intermediate nodes that forward but cannot read encrypted data
- **VPN Tunneling** — Visualize the encrypted pipe between Alice and Bob
- **Man-in-the-Middle Attacks** — See why intermediaries fail to read encrypted traffic, and succeed without encryption

---

## Features

| Feature | Description |
|---------|-------------|
| Tunnel Canvas | Animated packet traveling Alice -> Relay(s) -> Bob |
| XOR Encryption | Symmetric cipher with shared key |
| Relay View | Shows what the relay node sees (hex cipher text or plaintext) |
| Receiver View | Shows Bob's decrypted message |
| Encryption Toggle | Turn E2E on/off to compare |
| Multi-Hop | 1-3 relay nodes |
| MITM Simulation | Attacker tries to read at relay |
| Trilingual | English, French, Arabic (RTL) |
| 8 Themes | Mosque, Zellige, Andalus, Riad, Medina, Space, Jungle, Robot |

---

## Files

| File | Description |
|------|-------------|
| `index.html` | UI layout: tunnel canvas, controls, sections A/B/C, help panel |
| `script.js` | VPN simulation logic, i18n (EN/FR/AR), all template features |
| `style.css` | Themes, animations, responsive layout (DO NOT MODIFY) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step guide for students |
| `CHANGES.md` | Version history |

---

## Quick Start

1. Open `index.html` in a browser
2. Type a secret message
3. Click **Encrypt & Send**
4. Watch the packet travel through the encrypted tunnel
5. Toggle encryption off and try again — see the difference!

---

## Sections

### Main Card
- Tunnel visualization canvas
- Message input + Encrypt & Send button
- Hop slider (1-3 relay nodes)
- Encryption toggle with padlock indicator
- Relay view (what the relay sees)
- Receiver view (what Bob sees)
- MITM attack button

### Section A: How It Works
4 steps explaining the E2E encryption flow.

### Section B: Lab
3 experiments: toggle encryption, multi-hop, MITM attack.

### Section C: Challenge
3 challenges: read as relay, sniff without encryption, design key exchange.

### Help Panel
- **FAQ** — What is Micro VPN, XOR, relay nodes, MITM
- **How-To** — Step-by-step usage guide
- **Wiki** — E2E Encryption, VPN Tunneling, Relay Nodes, Man-in-the-Middle

---

## JS API (VPN-specific)

| Function | Description |
|----------|-------------|
| `xorEncrypt(text, key)` | XOR cipher (encrypt/decrypt) |
| `toHexDisplay(text)` | Convert to hex string for relay view |
| `drawTunnel(progress, hops, encrypted)` | Render tunnel canvas |
| `animateTunnel(hops, encrypted)` | Animate packet through tunnel |
| `vpnSendMessage()` | Encrypt and send message |
| `vpnMitmAttack()` | Simulate MITM attack |
| `vpnToggleEncryption()` | Toggle E2E on/off |

---

## Template APIs (inherited)

| Function | Description |
|----------|-------------|
| `log(msg, type)` | Log with typewriter. Types: info, success, error, tx, rx |
| `showToast(msg, ms)` | Toast notification |
| `setStatus(bool)` | Green/red status pill |
| `playSound(type)` | click, success, error |
| `setLanguage(lang)` | en, fr, ar |
| `setTheme(name)` | 8 themes + retro |

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
