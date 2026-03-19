# HOWTO — bit-invisible-fence

## Getting Started

### Step 1: Open the App
Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari). No installation or server required.

### Step 2: Place Sensors
1. Click the **Add Sensor** button (blue)
2. Your cursor changes to a crosshair
3. Click anywhere on the perimeter map canvas to place a sensor node
4. The sensor appears as a green dot with a label (S1, S2, etc.)
5. Repeat to place multiple sensors around the perimeter

### Step 3: Activate the Fence
1. Click the **Activate Fence** button
2. Sensors connect with a dashed green line forming the fence perimeter
3. Detection radius circles appear around each sensor
4. The status pill turns green (Connected)
5. The zone status shows "ALL ZONES SECURE"

### Step 4: Simulate an Intruder
1. Click the **Simulate Intruder** button (red)
2. Click on the map to place a moving intruder dot (orange)
3. The intruder moves automatically and bounces off edges
4. When the intruder enters a sensor's radius:
   - The sensor turns red and pulses
   - Zone status changes to "BREACH — ZONE X"
   - A red BREACH alert flashes on the map
   - The breach counter increments
   - An alert is logged

### Step 5: Deactivate
Click **Deactivate** to turn off the fence, clear the intruder, and reset sensor states.

---

## Understanding the Display

### Sensor States
- **Green circle** = Active (monitoring normally)
- **Red pulsing circle** = Triggered (intruder detected in zone)
- **Gray circle** = Offline (not responding)

### Zone Status
- **Green "ALL ZONES SECURE"** = No breach detected
- **Red flashing "BREACH — ZONE X"** = Intruder detected in zone X

### Coverage
- **Light green shaded circles** = Areas covered by sensors
- **Dark areas** = Coverage gaps (unmonitored zones)
- **Dashed green line** = Fence perimeter connecting sensors

---

## Lab Activities

### Activity 1: Design a Perimeter
Place sensors around the edges of the map to create a complete boundary. Aim for overlapping coverage.

### Activity 2: Find Coverage Gaps
Activate the fence and look for dark (uncovered) areas. Can you trace a path from outside to inside without passing through any sensor radius?

### Activity 3: Test with Intruder
Place an intruder and observe which sensors trigger. Does your fence detect all crossing attempts?

### Activity 4: Optimize Placement
Remove unnecessary sensors and reposition others. Goal: minimum sensors with maximum coverage.

---

## Challenges

### Challenge 1: Minimum Security
Secure the entire map perimeter using only 4 sensors. Hint: place them at corners with maximum radius overlap.

### Challenge 2: Find the Gap
Place 3 sensors leaving an obvious gap. Then find and fix it with one additional sensor.

### Challenge 3: Stealth Intruder
Design a fence, then try to find a path through uncovered areas. Redesign until no gap exists.

---

## Tips

- Sensors have a fixed detection radius of 50 pixels
- Place sensors where edges meet for best coverage
- Overlapping zones create redundancy (a good thing for security)
- The intruder bounces off map edges, so corner sensors are valuable
- Use the Activity Log to track all breach events and sensor activity
- Change language in Settings to see the app in French or Arabic

---

## Settings

- **Language**: English, French, Arabic (RTL supported)
- **Theme**: 8 visual themes available
- **Sound**: Toggle sound effects for alerts and interactions
- **Activity Log**: View, filter, clear, copy, or export all events

---

## Concepts Learned

| Concept | Real-World Application |
|---------|----------------------|
| Perimeter Security | Building security, border control, facility protection |
| Sensor Networks | IoT deployments, environmental monitoring, smart homes |
| Zone Mapping | Security system design, coverage planning |
| Breach Detection | Alarm systems, intrusion detection, access control |

---

Workshop-DIY — [abourdim](https://github.com/abourdim)
