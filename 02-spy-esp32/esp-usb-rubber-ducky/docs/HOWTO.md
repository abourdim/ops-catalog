# esp-usb-rubber-ducky — How To Use

## Prerequisites

- A modern web browser
- Optional: ESP32-S2/S3 board with USB HID support

## Lab Walkthrough

### Step 1: Choose a Payload
Select from 3 preset payloads or write your own in the editor using DuckyScript-like commands.

### Step 2: Understand the Commands
- `STRING text` — Types text characters
- `DELAY ms` — Waits for specified milliseconds
- `ENTER` — Presses Enter key
- `GUI r` — Opens Run dialog (Windows key + R)
- `CTRL ALT t` — Opens terminal (Linux)

### Step 3: Deploy the Payload
Click "Deploy" to execute. The virtual terminal shows keystrokes being typed in real time.

### Step 4: Adjust Speed
Use the speed slider to watch in slow motion or execute instantly.

### Step 5: Write Custom Payloads
Create your own harmless payloads. Try opening Notepad and typing a message.

### Step 6: Lab Experiments
Open Section B to analyze payload timing, test detection evasion, and understand USB HID protocols.

### Step 7: Challenges
Complete 3 challenges: write a payload that opens a browser, create a data exfil demo, and design a defense.

## What Each Step Teaches

| Step | Concept |
|------|---------|
| 1 | USB HID attack vectors |
| 2 | DuckyScript payload language |
| 3 | Keystroke injection mechanics |
| 4 | Timing and detection windows |
| 5 | Payload crafting skills |
| 6 | USB protocol analysis |
| 7 | Attack/defense awareness |

## Going Further

- Flash ESP32-S2 with USB HID firmware
- Learn about USB descriptor spoofing
- Study USB endpoint security measures
