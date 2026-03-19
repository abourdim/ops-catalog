# bit-micro-beacon-trail — Workshop DIY

**BLE Beacon Trail Simulator** — Drop BLE beacons as breadcrumbs to mark a path, then follow the trail using signal strength.

---

## What This App Teaches

- **BLE Beacons**: How Bluetooth Low Energy beacons broadcast identity packets
- **iBeacon / Eddystone**: Beacon protocol concepts (UUID, major/minor values)
- **Location Marking**: Dropping beacons to create waypoints along a path
- **Path Tracking**: Following ordered beacon sequences using RSSI proximity
- **RSSI Fundamentals**: Signal strength, path loss, noise, and distance estimation
- **Indoor Navigation**: How beacon networks enable wayfinding without GPS

---

## Features

| Feature | Description |
|---------|-------------|
| Trail Map Canvas | Interactive canvas to drop and visualize beacons |
| Drop Beacon | Place beacons by clicking on canvas or auto-placement |
| Follow Trail | Animated position marker navigates beacon-to-beacon |
| RSSI Simulation | Realistic signal strength with path loss and noise |
| Beacon List | Scrollable numbered list with timestamp and RSSI |
| Trail Stats | Live beacon count and total trail distance |
| Trilingual | English, French, Arabic with RTL support |
| 8 Themes | Mosque Gold, Zellige, Andalus, Space, Jungle, Robot, Riad, Medina |

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Layout with trail map, controls, 3 sections, help panel |
| `script.js` | i18n, simulation engine, canvas rendering, all template features |
| `style.css` | 8 themes, animations, responsive (DO NOT MODIFY) |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step guide for students |

---

## Quick Start

1. Open `index.html` in a browser
2. Click on the trail map to drop beacons
3. Press **Follow Trail** to watch the position arrow navigate
4. Observe RSSI values changing in the beacon list
5. Try the challenges in Section C

---

## Simulation Details

### Beacon Model

Each beacon stores:
- `id` — Unique hex identifier (e.g., BCN-0001)
- `x, y` — Position on the canvas
- `timestamp` — When it was dropped
- `rssi` — Simulated signal strength in dBm

### RSSI Formula

```
RSSI = A - 10 * n * log10(d)
```
- `A` = RSSI at 1 meter reference distance (-59 dBm)
- `n` = Path loss exponent (2.0 for indoor)
- `d` = Distance in pixels (scaled)
- Gaussian noise of +/- 3 dBm added for realism

### Follow Algorithm

1. Position marker starts at first beacon
2. Linearly interpolates toward next beacon
3. RSSI updates in real-time as distance decreases
4. Logs approach events at 25%, 50%, 75% progress
5. Marks beacon as reached when arrived

---

## JS API

| Function | Description |
|----------|-------------|
| `dropBeaconAt(x, y)` | Drop a beacon at canvas coordinates |
| `dropBeaconAuto()` | Auto-place a beacon near the last one |
| `startFollowTrail()` | Animate following the beacon trail |
| `clearTrailData()` | Remove all beacons and reset |
| `simulateRSSI(distance)` | Calculate RSSI for a given distance |
| `log(msg, type)` | Log with typewriter effect |
| `showToast(msg, ms)` | Toast notification |
| `setStatus(bool)` | Connection status pill |
| `playSound(type)` | Sound effects: click, success, error |

---

## Sections

### Section A — How It Works
Four steps explaining the beacon trail concept: drop, broadcast, scan, RSSI proximity.

### Section B — Lab
Hands-on exercises: create trails, follow with signal guidance, test beacon density, measure accuracy.

### Section C — Challenge
Three challenges: loop trail, follow with 50% missing beacons, coded beacon secret trail.

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
