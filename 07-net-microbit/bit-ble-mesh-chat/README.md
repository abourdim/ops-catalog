# bit-ble-mesh-chat -- Workshop DIY

BLE Mesh Chat is an interactive web simulation that teaches students how multi-hop mesh networking works. Devices (nodes) relay messages to each other across a network -- if node A cannot reach node C directly, node B relays the message.

## What You Learn

- **Mesh Networking**: How devices form a self-healing web topology
- **Message Routing**: Flooding algorithm and how messages propagate
- **TTL (Time-To-Live)**: Why messages need an expiry counter to prevent infinite loops
- **Multi-Hop Communication**: How relays extend the reach of BLE radio

## Features

- Interactive canvas with draggable nodes and clickable links
- Real-time message animation showing hops between nodes
- Configurable node count (3-8 via slider, up to 12 via canvas clicks)
- TTL selector (1-5) to control message lifespan
- Source/destination dropdowns for targeted messaging
- Link breaking/restoring to test network resilience
- Hop counter and delivery status (success / expired / unreachable)
- Full activity log with TX/RX/info filtering
- Trilingual support: English, French, Arabic (RTL)
- 8 visual themes (6 dark + 2 light)
- PWA-ready with offline support

## Quick Start

1. Open `index.html` in a modern browser
2. Adjust the node count slider to build your mesh
3. Select source and destination nodes
4. Set the TTL and type a message
5. Click **Send** and watch the message travel through the network

## Interactions

| Action | Effect |
|--------|--------|
| Click empty canvas | Add a new node |
| Right-click a node | Remove node |
| Drag a node | Reposition and rebuild links |
| Click a link line | Break or restore connection |
| Adjust slider | Set node count (3-8) |

## Tech Stack

- Vanilla HTML/CSS/JS (no frameworks)
- Canvas 2D for network visualization
- Workshop-DIY template v1.0 (themes, i18n, log, panels, easter eggs)

## Project Structure

```
bit-ble-mesh-chat/
  index.html        Main app page
  script.js         App logic + mesh simulation
  style.css         Theme system (do not modify)
  manifest.json     PWA manifest
  docs/
    HOWTO.md        Step-by-step guide
  README.md         This file
  CHANGES.md        Version history
```

## API Reference

### Mesh Simulation

| Function | Description |
|----------|-------------|
| `meshInit()` | Initialize canvas, events, and default nodes |
| `meshGenerateNodes(n)` | Create n random nodes with auto-linking |
| `meshSendMessage()` | Flood a message from source to destination |
| `meshRebuildLinks()` | Recalculate connections based on distance |
| `meshCanReach(src, dest)` | BFS reachability check |

### Template Core (inherited)

| Function | Description |
|----------|-------------|
| `log(msg, type)` | Log with typewriter effect. Types: info, success, error, tx, rx |
| `showToast(msg, ms)` | Toast notification with auto-hide |
| `setStatus(bool)` | Connected/disconnected indicator |
| `setLanguage(lang)` | Switch language: en, fr, ar |
| `setTheme(name)` | Switch visual theme |
| `playSound(type)` | Play click, success, or error sound |

## Easter Eggs

| Trigger | Effect |
|---------|--------|
| Up Up Down Down Left Right Left Right B A | Retro CRT theme |
| Triple-click logo | Arabic matrix rain |
| Long-press log line | Morse code blink |
| `?debug=1` in URL | FPS + memory monitor |
| Shake phone | Export bug report |
| Ctrl+Z in log panel | Undo last log entry |

## License

Educational use -- Workshop-DIY project by abourdim.
