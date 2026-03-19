# 🖥️ Pi War Room

**Workshop-DIY Pi Core Learning Lab**

Portable hacking station with multi-tool dashboard on Raspberry Pi. Simulates network scanning, WiFi recon, packet sniffing, brute force, and exploit checking.

## Features

- Terminal-style output for multiple security tools
- Network scanner with host discovery table
- Exploit toolkit with CVE database display
- Tool selector: Nmap, WiFi Recon, Packet Sniff, Brute Force, Exploit Check
- Pi system stats: CPU, RAM, temperature, host count
- Trilingual UI (EN/FR/AR) with RTL support
- 8 themes, activity log, sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | Dashboard with terminal, host table, exploit list, Section C |
| `script.js` | War room simulation, i18n, all UI logic |
| `style.css` | Shared Workshop-DIY theme system |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step guide |

## Quick Start

1. Open `index.html` in a browser
2. Select a tool and click **Run**
3. Watch terminal output and host table populate
4. Explore the exploit database

## Tech Stack

Vanilla JS, zero dependencies.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
