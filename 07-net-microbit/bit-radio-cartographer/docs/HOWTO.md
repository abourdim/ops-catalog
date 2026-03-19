# HOWTO — bit-radio-cartographer

## Getting Started

### Step 1: Open the App
Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari). No server required — everything runs locally.

### Step 2: Place a Transmitter
1. Click the **Place Transmitter** button (📡)
2. Click anywhere on the heatmap canvas
3. The heatmap updates instantly showing signal strength radiating from the transmitter
4. Red = strong signal (close to TX), blue = weak signal (far away)

### Step 3: Read Signal Strength
- Hover your mouse over the heatmap
- The **RSSI display** below the canvas shows the signal strength in dBm at the cursor position
- The **Position** shows current grid coordinates

### Step 4: Add More Transmitters
- Click **Place Transmitter** again and click on a different spot
- Multiple transmitters combine their signal (power summing)
- Observe how coverage improves with more transmitters

### Step 5: Add Obstacles
1. Click the **Add Obstacle** button (🧱)
2. Click and drag on the canvas to draw a wall
3. Walls attenuate the signal — notice the shadow zone behind them
4. Adjust attenuation strength in the Lab section (5-30 dB slider)

### Step 6: Compare Frequencies
In the **Lab** section:
- Click **2.4 GHz** or **900 MHz** to switch propagation models
- 2.4 GHz: higher path loss exponent (n=2.8), signals fade faster
- 900 MHz: lower path loss (n=2.2), better obstacle penetration

### Step 7: Export Your Heatmap
- Click **Export Heatmap** (💾) to download as a PNG image
- Use it in reports, presentations, or to compare different layouts

---

## Understanding the Heatmap Colors

| Color | RSSI Range | Quality |
|-------|-----------|---------|
| Red | > -30 dBm | Excellent |
| Orange | -30 to -50 dBm | Very Good |
| Yellow | -50 to -67 dBm | Good |
| Green | -67 to -80 dBm | Fair |
| Blue | -80 to -90 dBm | Weak |
| Dark Blue | < -90 dBm | Dead Zone |

---

## Challenges

### Challenge 1: Full Coverage
- Goal: Place ONE transmitter so every cell is above -80 dBm
- Tip: Try the center first, then adjust if obstacles block signal

### Challenge 2: Identify the Dead Zone
- Place 2 obstacles and 1 transmitter
- Find the largest area below -90 dBm
- Count the affected cells by hovering over the blue region

### Challenge 3: Three-TX Layout
- Design a layout with 3 transmitters
- Goal: 95%+ coverage (almost no blue/dark cells)
- Minimize signal overlap between transmitters
- Export your best result

---

## Tips

- The signal follows the **log-distance path loss model**: each doubling of distance costs about 8-9 dB
- Obstacles add a flat attenuation penalty to any signal path crossing them
- Multiple transmitters help eliminate dead zones but can cause interference in overlapping areas
- Lower frequencies (900 MHz) penetrate walls better than higher frequencies (2.4 GHz)
- The noise floor is at -100 dBm — anything below is undetectable

---

## Settings

- **Language**: English, French, Arabic (with RTL support)
- **Theme**: 8 themes available in Settings (⚙️)
- **Sound**: Toggle sound effects in Settings
- **Activity Log**: View all events and actions (📜)
