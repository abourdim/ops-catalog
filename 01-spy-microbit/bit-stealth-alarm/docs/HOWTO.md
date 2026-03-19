# HOWTO — bit-stealth-alarm

## Overview

bit-stealth-alarm is a stealth alarm intrusion detection simulation. It uses simulated (or real) light and accelerometer sensors to detect intruders. When sensor values exceed user-defined thresholds, the alarm triggers.

---

## Getting Started

1. **Open the app** — Load `index.html` in any modern browser.
2. **Explore the main card** — See the alarm status (DISARMED), light and motion gauges, threshold sliders, and action buttons.
3. **Arm the alarm** — Press the green "Arm Alarm" button. The status changes to ARMED (green).
4. **Simulate an intrusion** — Press "Test Intrusion" (red button). Both light and motion spike, triggering the alarm.
5. **Review alerts** — The Alert History shows each triggered event with a timestamp, sensor type, and value.

---

## Understanding the Gauges

- **Light Level** (0-255): Simulates the micro:bit's ambient light reading. Low values = dark room. High values = bright light (door opened).
- **Motion Level** (0-500): Simulates the accelerometer magnitude. Low values = still. High values = movement or vibration.

Both gauges update every 200ms. When a value exceeds its threshold, the gauge bar turns red (danger).

---

## Setting Thresholds

- **Light Threshold** (default: 128): If light exceeds this value while armed, the alarm triggers.
- **Motion Threshold** (default: 150): If motion exceeds this value while armed, the alarm triggers.

Lower thresholds = more sensitive = more false alarms from noise.
Higher thresholds = less sensitive = may miss real intrusions.

---

## Using the Lab

1. **Noise Slider** (0-50): Controls random fluctuation added to sensor values. Higher noise = more realistic but harder to tune thresholds.
2. **Simulate Door Open**: Creates a single light spike (200-255), as if a door opened in a dark room.
3. **Simulate Shake**: Creates a single motion spike (250-450), as if someone bumped or moved the device.
4. **Ambient Light API**: Toggle to use your device's real light sensor (if supported by browser).
5. **DeviceMotion API**: Toggle to use your device's real accelerometer (works on mobile devices).

---

## Challenges

### Challenge 1: Bypass the Alarm
Try to increase light and motion without exceeding thresholds. Adjust sliders carefully and see how slowly you can change values.

### Challenge 2: Find Optimal Thresholds
Set noise to maximum (50). Find threshold values that catch real intrusions (door/shake) but ignore noise fluctuations. What values work best?

### Challenge 3: Design a Silent Alarm
Think about modifying the alarm to log silently without sound or visual alerts. In real security systems, silent alarms alert authorities without warning the intruder.

---

## Alarm States

| State | Color | Behavior |
|-------|-------|----------|
| DISARMED | Gray | No monitoring. Sensors update but no threshold checking. |
| ARMED | Green | Active monitoring. Thresholds checked every 200ms. |
| TRIGGERED | Red (pulsing) | Alert fired. Sound plays. Entry added to history. Auto-rearms after 3 seconds. |

---

## Tips

- Open the Activity Log (scroll icon in header) to see all events with timestamps.
- Switch languages in Settings to see the full interface in English, French, or Arabic.
- Try different themes — each has its own visual style and sound melody.
- Use `?debug=1` in the URL to see FPS and memory usage.

---

## Micro:bit Connection

This version is a **simulation only**. The gauges and thresholds work with simulated data. To connect a real micro:bit:

1. Flash the micro:bit with a program that reads `input.lightLevel()` and accelerometer magnitude.
2. Send sensor data over Web Bluetooth or Web Serial to the browser.
3. Replace the simulation tick with real sensor values in `simulationTick()`.

---

Workshop-DIY — [abourdim](https://github.com/abourdim)
