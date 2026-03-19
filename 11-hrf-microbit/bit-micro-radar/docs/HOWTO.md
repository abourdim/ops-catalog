# HOWTO — bit-micro-radar

A step-by-step guide for using the Micro Radar EM Map simulator.

---

## Getting Started

1. **Open the app** — Load `index.html` in a modern browser (Chrome, Firefox, Edge, Safari).
2. The radar canvas is displayed in the main card with a dark green background and range rings.
3. Five random objects are seeded on the map at startup.

---

## Running a Radar Sweep

1. Click the **Start Sweep** button (green primary button).
2. The sweep line begins rotating clockwise from north (0 degrees).
3. When the sweep line passes an object, it appears as a bright green blip.
4. Blips fade gradually over 5 seconds, simulating real radar phosphor decay.
5. Click **Stop** to halt the sweep at any time.

---

## Placing Objects

1. Click anywhere on the radar canvas to place a virtual object.
2. The object position is calculated from your click: angle relative to center, distance relative to range.
3. Each new object gets a random type (aircraft, ship, vehicle, drone, unknown).
4. Objects appear in the **detected list** below the canvas once the sweep line passes them.

---

## Adjusting Range

1. Use the **Range** dropdown to select 10m, 50m, or 100m.
2. Range rings rescale automatically to show the new coverage area.
3. Objects beyond the selected range will not appear on screen.
4. Use 10m for close-range detail, 100m for wide-area overview.

---

## Active vs Passive Mode

1. Use the **Mode** dropdown to switch between Active and Passive.
2. **Active mode**: The radar sends out signals and listens for reflections. All objects are detectable.
3. **Passive mode**: The radar only listens for signals emitted by objects. Quiet objects are invisible.
4. About 60% of seeded objects emit signals; the rest are silent.
5. Switch modes during a sweep to see the difference in real time.

---

## Understanding the Display

| Element | Description |
|---------|-------------|
| **Range rings** | Concentric circles showing distance from center. Labels show meters. |
| **Cross-hairs** | Vertical and horizontal lines dividing the display into quadrants. |
| **Cardinal labels** | N (north/up), S (south/down), E (east/right), W (west/left). |
| **Sweep line** | Bright green rotating line. Current scan direction. |
| **Fade trail** | Dim green trail behind the sweep line (30 degrees). |
| **Blips** | Bright dots where objects are detected. Glow fades over 5 seconds. |
| **Center dot** | Your position (the radar antenna location). |

---

## Object List

- Located below the radar canvas.
- Shows each detected object with: **bearing** (degrees), **distance** (meters), **type**.
- Updates in real time as the sweep passes objects.
- The **detection counter** shows the total number of unique objects found.

---

## Challenges

### Challenge 1: Full Sweep Identification
- Start a sweep and try to name every object type before the line completes 360 degrees.
- Watch the object list closely as new blips appear.

### Challenge 2: Moving Target Tracker
- Some objects move between sweeps. Watch for blips that shift position.
- Try to predict where a moving target will be on the next sweep pass.

### Challenge 3: Stealth Detection
- Stealth objects appear as very faint blips (low brightness).
- Switch between Active and Passive modes. Some stealth objects only show in Active mode.
- Look carefully at the radar screen for dim dots that could be missed.

---

## Tips

- **Zoom in**: Use 10m range to see nearby objects in detail.
- **Zoom out**: Use 100m range for a strategic overview.
- **Log panel**: Open the Activity Log (scroll icon) to see detection events.
- **Themes**: Try the Space theme for a sci-fi radar experience.
- **Sound**: Enable sound effects in Settings to hear detection pings.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Escape` | Close all open panels |
| `Ctrl+Z` (in log panel) | Undo last log entry |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Radar canvas is black | Press "Start Sweep" to begin scanning |
| No objects appear | Make sure you are in Active mode; Passive mode hides non-emitting objects |
| Objects outside ring | Increase the range setting (50m or 100m) |
| Blips disappear too fast | This is the 5-second decay timer; keep the sweep running to refresh blips |

---

## Technical Notes

- The radar simulation runs entirely in the browser using Canvas 2D.
- No external libraries or frameworks are used (vanilla JavaScript).
- Sweep rotation speed: 1.5 degrees per animation frame.
- Blip decay time: 5000ms.
- Object detection threshold: 3 degrees angular proximity.
- All data stays local. No network requests are made during simulation.
