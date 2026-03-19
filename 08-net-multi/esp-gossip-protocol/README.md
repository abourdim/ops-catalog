# esp-gossip-protocol -- Workshop DIY

Gossip Protocol simulates epidemic data spreading through a network. One node is seeded with data, and through probabilistic peer-to-peer gossip rounds, the information spreads until all nodes converge.

## What You Learn

- **Gossip/Epidemic Protocols**: How data spreads through random peer selection
- **Probability-Based Spreading**: How spread percentage affects convergence speed
- **SI Model**: Susceptible-Infected epidemic model
- **Eventual Consistency**: How distributed systems achieve data convergence

## Features

- Interactive node grid canvas (6-25 nodes) with click-to-seed
- Probability-based gossip rounds with animated data transfer
- Configurable spread percentage (10-100%) and node count
- Timeline progress bar showing infection percentage
- Stats dashboard: round count, infected nodes, convergence status
- Infection pulse animations on newly infected nodes
- Trilingual: English, French, Arabic (RTL)
- 8 visual themes, PWA-ready

## Quick Start

1. Open `index.html`
2. Click any node (or Seed Node button) to start
3. Watch data spread through gossip rounds
4. Adjust spread probability and observe convergence

## Project Structure

```
esp-gossip-protocol/
  index.html, script.js, style.css, manifest.json
  docs/HOWTO.md, README.md, CHANGES.md
```

## License

Educational use -- Workshop-DIY project by abourdim.
