# HOWTO — bit-field-scanner

## Getting Started

### Step 1: Open the App
Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari). No server required — everything runs locally.

### Step 2: Start Scanning
Press the **Start Scan** button on the main card. The app will begin simulating sensor readings every second.

### Step 3: Read the HUD
- **Threat Level** — The large indicator at the top shows GREEN (safe), YELLOW (caution), or RED (alert)
- **5 Gauges** — Each sensor has a fill bar and numeric value updated in real time
- **Threat Log** — Scrollable log of all threat assessments with timestamps

### Step 4: Stop Scanning
Press **Stop** to halt the simulation. Gauges freeze at their last reading.

---

## Using the Lab

### Sensor Simulators
Open the **Lab** section and use the 5 sliders to manually set each sensor value:
- **Light** — drag from 0 (dark) to 255 (bright)
- **Temperature** — drag from -10°C to 50°C
- **Motion** — drag from 0 (still) to 2000 mg (strong shake)
- **Sound** — drag from 0 (silent) to 255 (loud)
- **Magnetic** — drag from 0° to 360° (compass heading)

The main card gauges and threat level update instantly as you move sliders.

### Custom Threat Rules
Write rules in the textarea, one per line:
```
light > 80 => +20
motion > 60 => +30
sound > 70 => +25
```
This means: if the normalized light value exceeds 80, add 20 points to the threat score. Press **Apply Rules** to activate.

### Real-Time HUD Canvas
The radar-style canvas shows:
- **Concentric circles** — distance from center represents threat intensity
- **Sweep line** — rotates continuously, color matches threat level
- **Sensor blips** — 5 dots positioned by normalized value (closer to edge = higher reading)
- **Center score** — current composite threat score

---

## Challenges

### Challenge 1: Room Calibration
**Goal:** Set thresholds so the HUD reads GREEN for your room's normal conditions.

1. Open the Lab section
2. Set sliders to match your room (e.g., medium light, ~22°C, low motion/sound)
3. Note the threat score — it should be below 30 (GREEN)
4. Simulate opening a window (raise temp slider, add motion) — score should reach YELLOW

### Challenge 2: Intruder Detection
**Goal:** Make the scanner detect a person entering without false alarms.

1. Set baseline values for an empty room
2. Write custom rules that trigger on motion + sound spikes:
   ```
   motion > 50 => +30
   sound > 40 => +25
   ```
3. Test: low motion/sound should stay GREEN, high values should go RED
4. Adjust thresholds until only significant movement triggers alerts

### Challenge 3: Custom Threat Category
**Goal:** Design a new alert level using at least 3 sensors.

1. Imagine a scenario (e.g., "storm warning" = high light + high sound + temp drop)
2. Write rules that combine multiple sensors:
   ```
   light > 90 => +15
   sound > 60 => +20
   temp > 10 => +15
   ```
3. Test your rules and document the scenario in the threat log

---

## Understanding the Algorithm

The threat score is calculated as:

```
score = SUM( normalize(sensor) * weight ) + custom_rule_bonuses
```

Where:
- `normalize()` maps raw values to 0–100
- Weights: Motion 30%, Sound 25%, Light 15%, Temperature 15%, Magnetic 15%
- Custom rules add bonus points when conditions are met

Threat levels:
- **GREEN** — score below 30 (all clear)
- **YELLOW** — score 30–70 (elevated activity)
- **RED** — score above 70 (active threat)

---

## Tips

- Use the Activity Log (📜) to track all events and readings
- Try different themes in Settings — the HUD canvas adapts
- Enable sound effects for audio feedback on threat level changes
- The HUD canvas radar shows sensor positions — blips closer to the edge mean higher readings
- Random "intruder detected" events occur during scanning to simulate real-world scenarios

---

## Connecting a Real micro:bit

This app simulates sensors by default. To connect a real micro:bit v2:

1. Flash the micro:bit with a UART service that streams sensor readings
2. Use Web Bluetooth to pair from the browser
3. Parse incoming data and update `sensorData` object directly
4. The HUD, gauges, and threat algorithm work identically with real data

---

Workshop-DIY — [abourdim](https://github.com/abourdim)
