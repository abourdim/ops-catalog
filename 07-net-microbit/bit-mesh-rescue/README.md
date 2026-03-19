# bit-mesh-rescue — Workshop DIY

Self-healing mesh network simulation for micro:bit learning.

---

## What You Learn

- **Network Resilience** — how mesh networks survive node failures
- **Self-Healing** — automatic route recalculation using BFS
- **Redundant Paths** — why multiple paths between nodes matter
- **Fault Tolerance** — designing systems that keep working when parts fail
- **Heartbeat Protocol** — detecting failures through periodic signals
- **Single Point of Failure (SPOF)** — identifying and eliminating weak links

---

## How It Works

1. **Build** a mesh network by adding nodes (5-10 recommended)
2. **Break** the network by killing nodes — watch connections turn red
3. **Heal** the network — BFS finds new routes through surviving nodes
4. **Test** message delivery to verify network connectivity

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Main UI with canvas, controls, 3 learning sections, help panel |
| `script.js` | Mesh simulation engine + full template infrastructure |
| `style.css` | 9 themes, animations, responsive layout (DO NOT MODIFY) |
| `manifest.json` | PWA manifest |
| `docs/HOWTO.md` | Step-by-step guide for students |

---

## Simulation Features

- **Canvas-based visualization** with color-coded nodes (green/red/yellow)
- **Auto-connect** — nodes connect to nearby peers within range
- **Kill mode** — click nodes to simulate failures
- **BFS healing** — automatic route recalculation with animation
- **Message test** — send a message and watch it traverse the network
- **Health meter** — real-time percentage of network health
- **Heartbeat animation** — pulsing glow on active nodes

---

## Sections

| Section | Icon | Content |
|---------|------|---------|
| Main Card | 🔄 | Network canvas, controls, health meter, stats |
| How It Works | 🔐 | 4 steps: neighbor tables, heartbeat, BFS recalculation, new paths |
| Lab | 🧪 | 4 hands-on exercises: build, kill, heal, stress test |
| Challenge | 🏆 | 3 challenges: survive 50% failure, find SPOF, design no-SPOF network |

---

## i18n

Full trilingual support: English, French, Arabic (with RTL).

---

## Template Features (inherited)

- 9 themes with musical melodies
- Activity log with typewriter effect
- Whisper mode, breathing guide, pixel pet
- Konami code, matrix rain, morse code
- Ghost cursors, AR mode, AI chat
- PWA-ready, local-first, privacy-first

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
