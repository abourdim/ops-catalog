# bit-stealth-alarm — Workshop DIY

**Stealth alarm intrusion detection simulation using micro:bit light and accelerometer sensors.**

---

## What It Teaches

Students learn about sensor thresholds, event detection, and security systems by building a stealth alarm that uses the micro:bit's light sensor and accelerometer to detect intruders. When light changes (door opens) or movement is detected (someone touches the device), an alert triggers.

---

## Files

| File | Description |
|------|-------------|
| `index.html` | App layout: alarm dashboard, gauges, thresholds, 3 collapsible sections, help panel |
| `script.js` | Template infrastructure + alarm state machine, sensor simulation, threshold logic, i18n (EN/FR/AR) |
| `style.css` | 9 themes, animations, responsive (DO NOT EDIT) |
| `manifest.json` | PWA manifest |

---

## Features

- **Alarm State Machine**: Disarmed → Armed → Triggered → Auto-rearm
- **Light Simulation**: Ambient light baseline with noise + door-open spike events
- **Motion Simulation**: Resting baseline with noise + shake spike events
- **Threshold Sliders**: Adjustable light (0-255) and motion (0-500) thresholds
- **Alert History**: Timestamped log of all triggered events with sensor type and value
- **Real Sensor Support**: Optional Ambient Light API and DeviceMotion API integration
- **Adjustable Noise**: Simulation noise slider to test threshold robustness
- **Trilingual**: English, French, Arabic with full RTL support
- **8 Themes**: 6 dark + 2 light Islamic themes

---

## Sections

| Section | Icon | Content |
|---------|------|---------|
| Main Card | 🚨 | Alarm status, gauges, threshold sliders, buttons, alert history |
| How It Works | 🔐 | 4 steps: sampling, comparison, triggering, logging |
| Lab | 🧪 | Noise slider, door/shake simulation, real sensor toggles |
| Challenges | 🏆 | 3 challenges: bypass alarm, find optimal thresholds, design silent alarm |

---

## JS API — Alarm

| Function | Description |
|----------|-------------|
| `armAlarm()` | Arm the alarm — start monitoring sensors |
| `disarmAlarm()` | Disarm the alarm — stop monitoring |
| `testIntrusion()` | Simulate a full intrusion (light + motion spike) |
| `triggerAlarm(type, value)` | Trigger alert with sensor type and value |
| `updateAlarmDisplay()` | Update status display color and text |
| `addAlertEntry(type, value)` | Add entry to alert history |
| `simulationTick()` | Called every 200ms — updates sensor values and checks thresholds |

---

## How to Use

1. Open `index.html` in a browser
2. Set light and motion thresholds with the sliders
3. Press **Arm Alarm** to activate monitoring
4. Use **Test Intrusion** or the Lab section to trigger events
5. Watch the gauges, status, and alert history respond in real time
6. Adjust thresholds and noise to explore sensitivity vs. reliability

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
