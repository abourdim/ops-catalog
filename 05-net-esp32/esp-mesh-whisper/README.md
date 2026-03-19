# esp-mesh-whisper — Mesh Whisper

Self-healing ESP32 mesh network simulation. Messages hop node to node using BFS routing. Kill nodes to see the mesh reroute around failures, then heal to watch links rebuild.

## Features

- Interactive mesh canvas with 9 ESP32 nodes
- BFS shortest-path routing with hop-by-hop animation
- Kill nodes to simulate failures, mesh auto-reroutes
- Heal all to restore dead nodes with visual transition
- Topology lab with density and hop statistics
- 3 challenges with reveal answers
- Trilingual i18n (EN/FR/AR) with RTL support
- 8 themes, activity log, sound effects

## Files

| File | Description |
|------|-------------|
| `index.html` | Layout with mesh canvas, sections A/B/C, help panel |
| `script.js` | i18n, simulation engine, BFS routing, canvas rendering |
| `style.css` | Shared template styles (unchanged) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step usage guide |
| `CHANGES.md` | Version changelog |

## Quick Start

Open `index.html` in any modern browser. Click two nodes on the mesh canvas to select source and destination, type a message, and click Send.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
