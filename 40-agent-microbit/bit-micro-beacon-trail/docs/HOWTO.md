# HOWTO — bit-micro-beacon-trail

## What You Will Learn

In this workshop you will learn how BLE (Bluetooth Low Energy) beacons work as breadcrumbs to mark and follow a path. You will understand RSSI signal strength, iBeacon concepts, and indoor navigation basics.

---

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- No hardware required — everything is simulated in the browser

---

## Step 1: Open the App

Open `index.html` in your browser. You will see:
- A trail map canvas (the large dark area)
- Three buttons: Drop Beacon, Follow Trail, Clear Trail
- Stats showing beacon count and trail distance
- A beacon list (empty at first)

---

## Step 2: Drop Your First Beacons

**Method A — Click on the canvas:**
Click anywhere on the trail map. A beacon appears as a pulsing gold dot with a number label. Each click adds a new beacon connected to the previous one by a dashed line.

**Method B — Auto-placement:**
Press the **Drop Beacon** button. The app automatically places a beacon near the last one at a random angle and distance. This is useful for quickly building a trail.

Try dropping 5-8 beacons to create a path across the canvas.

---

## Step 3: Read the Beacon List

Below the canvas, the beacon list shows each beacon with:
- **Number and ID** (e.g., #1 BCN-0001)
- **Timestamp** — when it was dropped
- **RSSI** — simulated signal strength in dBm (e.g., -67 dBm)

The RSSI value tells you how strong the beacon signal would be. Values closer to 0 mean stronger signal (closer beacon).

---

## Step 4: Follow the Trail

Press **Follow Trail**. A green arrow appears and starts moving from the first beacon toward the second, then the third, and so on.

Watch the Activity Log (press the scroll icon in the header) to see:
- "Following trail..." when it starts
- "Approaching beacon #N — RSSI: -XX dBm" as it gets closer
- "Reached beacon #N" when it arrives
- "Trail followed!" when complete

Notice how the RSSI values in the beacon list update in real-time as the follower moves.

---

## Step 5: Understand RSSI

RSSI (Received Signal Strength Indicator) is measured in dBm:
- **-30 dBm** = Very close (almost touching)
- **-60 dBm** = Medium distance (a few meters)
- **-90 dBm** = Far away (edge of range)

The simulation uses the log-distance path loss model:
```
RSSI = -59 - 20 * log10(distance)
```
Plus random noise to simulate real-world conditions.

---

## Step 6: Experiment in the Lab (Section B)

Open **Section B — Lab** for guided exercises:

1. **Create a trail** — Drop beacons in a specific pattern (straight line, zigzag, curve)
2. **Follow with signal guidance** — Watch how RSSI guides the follower
3. **Test beacon density** — Compare trails with beacons 20px apart vs 100px apart
4. **Measure accuracy** — See how well the follower stays on path

---

## Step 7: Take the Challenges (Section C)

Open **Section C — Challenge** for advanced tasks:

1. **Loop Trail** — Create a trail that returns to the first beacon. Try to make the start and end points as close as possible.
2. **Missing Beacons** — Mentally remove every other beacon. Could the follower still navigate? Think about what happens when beacons are lost.
3. **Coded Trail** — Assign meaning to beacon positions (e.g., left = 0, right = 1) and encode a binary message in the trail.

---

## Real-World Applications

- **Museum tours**: Follow a beacon trail through exhibits
- **Emergency evacuation**: Beacon breadcrumbs guide people to exits
- **Warehouse navigation**: Workers follow beacon trails to pick items
- **Hiking trails**: Mark paths with weatherproof BLE beacons
- **Asset tracking**: Follow the trail of a moving object through a building

---

## Micro:bit Connection

On a real micro:bit with BLE:
- The micro:bit can act as an iBeacon, broadcasting its ID
- Multiple micro:bits placed along a path create a physical beacon trail
- A scanning device (phone or another micro:bit) detects beacons and their RSSI
- The MakeCode BLE extension enables beacon functionality

---

## Tips

- Use **Settings** (gear icon) to change theme and language
- The **Activity Log** (scroll icon) shows all events — useful for debugging
- Try the **Arabic** language for a right-to-left experience
- Triple-click the logo for a surprise (matrix rain!)
- The Konami code activates retro mode

---

## Glossary

| Term | Definition |
|------|-----------|
| BLE | Bluetooth Low Energy — low-power wireless protocol |
| Beacon | Small BLE transmitter that broadcasts an identifier |
| iBeacon | Apple's BLE beacon standard using UUID + major + minor |
| Eddystone | Google's BLE beacon standard using URL or UID frames |
| RSSI | Received Signal Strength Indicator — signal power in dBm |
| UUID | Universally Unique Identifier — 128-bit beacon ID |
| Major/Minor | 16-bit values in iBeacon for location context |
| Trilateration | Position estimation using distances from 3+ beacons |
| Path Loss | Signal attenuation over distance |
| dBm | Decibels relative to one milliwatt — unit for signal power |
