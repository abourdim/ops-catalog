# HOWTO — bit-radio-sniffer

## Getting Started

### Step 1: Open the App
Open `index.html` in a modern browser (Chrome, Firefox, Edge, Safari). The app loads instantly with no server required.

### Step 2: Understand the Spectrum Display
The main canvas has two halves:
- **Top (Bar Chart)**: Each vertical bar represents one of 84 radio channels. Taller bars mean more activity. Colors shift from green (low) to red (high).
- **Bottom (Waterfall)**: Shows activity history scrolling downward. Brighter pixels mean more traffic at that moment.

### Step 3: Select a Channel
Use the slider below the spectrum to pick a channel (0-83). The selected channel is highlighted with a colored border on the spectrum.

### Step 4: Start Scanning
- **Start Scan**: Monitors only the selected channel. Packets captured on that channel appear in the list below.
- **Auto Scan**: Sweeps through all 84 channels one by one, capturing traffic on each.
- **Stop**: Stops any active scan.

### Step 5: Read Captured Packets
Each captured packet shows:
- **Time**: When it was captured
- **CH**: Which channel it was on
- **Hex**: Raw data in hexadecimal
- **Decoded**: Human-readable text (if the data contains printable characters)

---

## Using the Lab

### Generate Traffic
Click "Generate Traffic" to inject 15 random packets across random channels. Watch the spectrum bars grow.

### Burst Mode
Click "Burst Mode" to send heavy traffic (20 packets) concentrated on 5 random channels. This creates visible spikes on the spectrum.

### Clear Spectrum
Resets all channel activity, clears the waterfall, and empties the packet list.

### Export Capture
Downloads all captured packets as a tab-separated text file for analysis in a spreadsheet or text editor.

---

## Completing the Challenges

### Challenge 1: Find the Hidden Message
1. Click "Start Challenge" in the Challenge section
2. Click "Auto Scan" in the main card
3. Watch the log and packet list for a readable message
4. The challenge completes automatically when the message is found

### Challenge 2: Identify Busiest Channel
1. Click "Start Challenge" — this triggers a traffic burst
2. Look at the spectrum bar chart to find the tallest bar
3. A prompt appears asking for the channel number
4. Enter the correct channel number to complete

### Challenge 3: Decode the Transmission
1. Click "Start Challenge" — a Caesar-cipher-encoded message is placed on a random channel
2. Use Auto Scan to find and capture the encoded message
3. The hint in the log tells you the shift value
4. A prompt appears asking for the decoded text
5. Shift each letter back by the given number to decode

**Caesar Cipher Example**: With shift 3, "D" becomes "A", "E" becomes "B", etc.

---

## Settings

- **Language**: Switch between English, French, and Arabic (Arabic enables RTL layout)
- **Theme**: Choose from 8 visual themes
- **Sound Effects**: Toggle audio feedback for actions
- **Whisper Mode**: Voice-to-log using speech recognition
- **Breathing Guide**: Relaxation mode with dhikr counter

---

## Tips

- Use the Activity Log (click the scroll icon in the header) to see all events
- Long-press a log line to see it blinked in Morse code on the status dot
- Triple-click the logo for Arabic matrix rain
- Try the Konami code for a retro theme surprise
- Shake your phone (mobile) to generate a bug report

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Escape | Close all panels |
| Ctrl+Z (in log) | Undo last log entry |

---

## For Teachers

This simulation covers these learning objectives:
1. Understanding radio frequency bands and channel allocation
2. The concept of packet-based communication
3. Spectrum analysis and visualization techniques
4. Basic cryptography (Caesar cipher)
5. Data representation (hex encoding/decoding)

Suggested classroom flow:
1. Demo the spectrum display with Auto Scan (5 min)
2. Let students explore the Lab section (10 min)
3. Challenge 1 as a group activity (5 min)
4. Challenge 2 individually (5 min)
5. Challenge 3 as a pair activity (10 min)
6. Discussion: How does this relate to real radio communication? (5 min)
