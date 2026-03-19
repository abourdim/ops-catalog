# 🏰 Firewall Fortress — Rule Defense

**Workshop DIY — Net Browser Collection**

Tower defense game: write firewall rules to block attack packets. Blocked = points, passed = damage.

## Features

- Packet stream canvas with animated packets flowing left to right
- Rule editor (source IP, destination IP, port, protocol, action)
- Score and lives display
- Wave system with increasing difficulty
- Color-coded packets (safe=green, attack=red, suspicious=yellow)
- Section C: Advanced Rules panel
- Trilingual i18n (EN / FR / AR with RTL)
- 8 themes, activity log, sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | Layout: main card (game canvas + rule editor) + 3 sections |
| `script.js` | i18n, packet generator, rule engine, game loop |
| `style.css` | Shared template styles (unchanged) |
| `manifest.json` | PWA manifest |

## Quick Start

Open `index.html`. Add firewall rules, then click Start to defend against incoming packets.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
