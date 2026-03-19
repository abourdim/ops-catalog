# HOWTO — bit-extraction-signal

Step-by-step guide for the emergency extraction beacon simulation.

---

## 1. Open the App

Open `index.html` in any modern browser. The app loads with the beacon in **STANDBY** mode.

---

## 2. Fill in the Extraction Request

### Agent ID
Enter your call sign or agent identifier (up to 12 characters). Example: `ALPHA-7`, `BRAVO-12`.

### Status
Select your current situation from the dropdown:
- **OK** — no injuries, routine extraction
- **Injured** — medical attention needed on arrival
- **Compromised** — position may be known, proceed with caution
- **Under fire** — active engagement, immediate extraction required

### Grid Coordinates
Enter your location in military grid format. Example: `37N 4512 7834`.

### Priority Level
Choose the urgency:
- **Low (routine)** — green pulse, 5-second repeat, 15-30s response
- **Medium (urgent)** — yellow pulse, 3-second repeat, 8-20s response
- **High (critical)** — orange pulse, 2-second repeat, 4-12s response
- **MAYDAY** — red flashing pulse, 1-second repeat, 2-6s response

---

## 3. Activate the Beacon

Click the **Activate Beacon** button. You will see:
- Beacon status changes to **BROADCASTING**
- Expanding concentric circle animation begins (color matches priority)
- Hex-encoded emergency packet appears in the frame display
- Response timer starts counting
- Activity log records the TX frame

The beacon automatically re-broadcasts at the priority-dependent interval.

---

## 4. Wait for Rescue

After a simulated delay (shorter for higher priority), the rescue team acknowledges:
- Beacon status changes to **ACKNOWLEDGED**
- Pulse animation stops
- Success message appears in log and toast notification

---

## 5. Cancel (Optional)

Click **Cancel** at any time to stop broadcasting and return to STANDBY mode.

---

## 6. Explore the Sections

### Section A — How It Works
Learn the 4-step process: encode, transmit, repeat, acknowledge.

### Section B — Lab
Hands-on experiments:
1. Build different messages and compare encoded frames
2. Change priority levels and observe pulse speed/color changes
3. Decode intercepted beacon hex strings
4. Measure response times across priority levels

### Section C — Challenge
1. Encode a MAYDAY signal in minimum bytes
2. Decode an unknown beacon frame
3. Design a stealth extraction protocol

---

## 7. Customize

- **Theme**: Settings > Theme (8 options)
- **Language**: Settings > Language (English, French, Arabic)
- **Sound**: Settings > Sound effects toggle

---

## Tips

- The hex frame updates on each re-broadcast (timestamp changes)
- The XOR checksum at the end validates frame integrity
- MAYDAY priority triggers the fastest response and most urgent visual cues
- Open the Activity Log to see all TX/RX events in chronological order
