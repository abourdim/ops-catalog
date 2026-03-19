# bit-spy-compass

Spy compass waypoint navigation simulation built with the Workshop-DIY template. Uses the micro:bit magnetometer (or browser DeviceOrientation API) to navigate to secret waypoints using compass bearings.

## What You'll Learn

- **Magnetometer** — how the micro:bit reads Earth's magnetic field
- **Compass Bearings** — measuring direction as degrees from North (0-360)
- **Waypoint Navigation** — moving from point to point using bearing calculations
- **Map Plotting** — visualizing position, waypoints, and trail on a 2D canvas

## Quick Start

1. Open `index.html` in a browser (or serve with any static server).
2. The compass needle rotates automatically in simulation mode, or uses your device's magnetometer if available.
3. Select a target waypoint from the dropdown and press **Navigate**.
4. Turn your device (or watch the simulation) until the bearing difference drops below 5 degrees for 3 seconds — mission complete!

## Features

- Animated compass rose with rotating needle and cardinal markers
- 3 preset spy waypoints (Alpha Base, Bravo Tower, Charlie Bunker)
- Real-time bearing difference display
- Arrived detection (less than 5 degrees for 3 seconds)
- Map canvas with position dot, waypoint markers, and trail line
- DeviceOrientation API support for real compass data
- Trilingual interface (EN / FR / AR) with full RTL support
- 8 themes, activity log, sound effects, and all Workshop-DIY template features

## Files

| File | Description |
|------|-------------|
| `index.html` | App structure — compass, waypoints, map, challenges |
| `script.js` | Simulation engine, LANG object, template infrastructure |
| `style.css` | Workshop-DIY shared stylesheet (do not modify) |
| `manifest.json` | PWA manifest |
| `CHANGES.md` | Version changelog |
| `docs/HOWTO.md` | Step-by-step lab guide |

## Version

**v1.0** — Initial release

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
