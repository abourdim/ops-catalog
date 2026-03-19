# Simulation Guide

## How the Web Simulator Works

The ESP-Vault web app simulates the three-factor authentication process that would run on a real ESP32. No hardware is needed to learn the concepts.

## Step 1: Fingerprint Scanner

**How to use:** Press and hold the fingerprint pad for 2 seconds.

**What it simulates:** The AS608 fingerprint sensor captures an image, converts it to a template, and searches the internal database for a match. The progress bar represents the scan duration.

**Real hardware:** The sensor communicates via UART at 57600 baud. The ESP32 sends commands and receives match results with confidence scores.

## Step 2: NFC Token

**How to use:** Click the NFC area 3 times with a consistent rhythm (not too fast, not too slow).

**What it simulates:** Tapping an NFC tag against the PN532 reader. The rhythm check simulates the timing validation that prevents accidental triggers. Each tap represents an NFC field detection event.

**Real hardware:** The PN532 reader detects ISO 14443A tags within ~4cm range. It reads the tag's UID (4-7 bytes) and compares it against an authorized list.

**Rhythm rules:**
- Each interval between taps must be 200-2000ms
- All intervals must be roughly equal (within 60% of the average)

## Step 3: PIN Keypad

**How to use:** Enter the code 1337 using the numeric buttons, then press the checkmark button. Press C to clear.

**What it simulates:** A 4x3 matrix keypad connected to ESP32 GPIO pins. The matrix scanning technique uses row-column intersection to detect which key is pressed.

**Real hardware:** The ESP32 sets rows as outputs and columns as inputs with pull-ups. It scans each row and reads columns to determine the pressed key.

## Vault Unlock

When all 3 factors are verified, the vault door animates open and secret files are revealed. The door handle spins, the door swings open, and classified documents appear with a staggered animation.

Press the Reset button to lock the vault and start over.

## Learning Objectives

After completing this simulation, students should understand:
1. The three categories of authentication factors
2. Why multi-factor auth is stronger than single-factor
3. How fingerprint sensors capture and match prints
4. How NFC readers communicate with tags
5. How matrix keypads work with GPIO scanning
6. How ESP32 integrates multiple sensors
