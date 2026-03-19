# esp-swarm-net -- Workshop DIY

Swarm Net is an interactive web simulation of ESP-NOW fleet coordination. Multiple nodes move in formation patterns (line, circle, V-shape, grid, scatter), responding to commands from a browser-based command center.

## What You Learn

- **Swarm Intelligence**: How decentralized agents achieve coordinated behavior
- **ESP-NOW Protocol**: Peer-to-peer wireless communication without Wi-Fi infrastructure
- **Formation Control**: Geometric pattern assignment and smooth interpolation
- **Telemetry**: Real-time monitoring of node positions, message counts, and coherence

## Features

- Canvas with 3-12 animated swarm nodes moving in formation
- 5 formation types: scatter, line, circle, V-shape, grid
- Command input for rotate, halt, patrol, scatter, rally
- Click-to-set rally point with convergence animation
- Speed and node count sliders
- Real-time telemetry dashboard (formation, nodes, messages, coherence)
- ESP-NOW communication line visualization between nearby nodes
- Node trails showing movement history
- Full activity log with TX/RX filtering
- Trilingual support: English, French, Arabic (RTL)
- 8 visual themes (6 dark + 2 light)
- PWA-ready

## Quick Start

1. Open `index.html` in a modern browser
2. Select a formation (line, circle, etc.)
3. Adjust speed and node count sliders
4. Type commands like "rotate" or "patrol" and press Send
5. Click on the canvas to set a rally point

## Tech Stack

- Vanilla HTML/CSS/JS (no frameworks)
- Canvas 2D for swarm visualization
- Workshop-DIY template v1.0

## Project Structure

```
esp-swarm-net/
  index.html        Main app page
  script.js         App logic + swarm simulation
  style.css         Theme system (do not modify)
  manifest.json     PWA manifest
  docs/
    HOWTO.md        Step-by-step guide
  README.md         This file
  CHANGES.md        Version history
```

## License

Educational use -- Workshop-DIY project by abourdim.
