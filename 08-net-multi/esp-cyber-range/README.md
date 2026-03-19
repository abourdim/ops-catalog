# esp-cyber-range -- Workshop DIY

Cyber Range is a Red vs Blue attack/defense training simulator. Students take turns as attackers (Red Team) and defenders (Blue Team) on a simulated corporate network with servers, workstations, databases, firewalls, and IDS.

## What You Learn

- **Red Team Tactics**: Port scanning, vulnerability exploitation, lateral movement, data exfiltration
- **Blue Team Defenses**: Firewalls, IDS, patching, network segmentation
- **Attack/Defense Dynamics**: How defenses counter specific attack types
- **Incident Response**: Real-time event monitoring and scoring

## Features

- Corporate network canvas with 9 nodes (Internet, Firewall, Router, Switches, Servers, Workstation, DB, IDS)
- Red Team panel with 4 attack types, Blue Team panel with 4 defense types
- Score tracking: points for successful attacks and defenses
- Animated attack/defense packets traversing the network
- Real-time event feed with color-coded notifications
- Defense state tracking (firewall blocks port scans, IDS detects lateral movement, etc.)
- Trilingual: English, French, Arabic (RTL)
- 8 visual themes, PWA-ready

## Quick Start

1. Open `index.html`
2. Deploy Blue Team defenses (firewall, IDS, patch, isolate)
3. Launch Red Team attacks (port scan, exploit, lateral, exfil)
4. Watch scores and event feed

## Project Structure

```
esp-cyber-range/
  index.html, script.js, style.css, manifest.json
  docs/HOWTO.md, README.md, CHANGES.md
```

## License

Educational use -- Workshop-DIY project by abourdim.
