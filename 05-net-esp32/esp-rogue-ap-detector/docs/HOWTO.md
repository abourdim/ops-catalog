# esp-rogue-ap-detector — How To Use

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)

## Lab Walkthrough

### Step 1: Scan for APs
Click "Scan APs" to discover nearby access points. Each AP is shown with its fingerprint.

### Step 2: Review Fingerprints
Check the table: SSID, BSSID (MAC), channel, encryption, signal strength, and status.

### Step 3: Inject an Evil Twin
Click "Inject Evil Twin" to simulate an attacker creating a fake "CampusWiFi" AP with a different BSSID and channel.

### Step 4: Observe Detection
The detector automatically compares fingerprints and shows a red alert when the rogue AP is found.

### Step 5: Compare Fingerprints
Click "Compare" to see the legitimate vs rogue AP side by side with mismatch fields highlighted in red.

### Step 6: Try the Challenges
Test your understanding of evil twin attacks and AP security.

## What Each Step Teaches

| Step | Concept |
|------|---------|
| 1 | WiFi scanning and beacon frames |
| 2 | AP fingerprinting (BSSID, channel, encryption) |
| 3 | Evil twin attack simulation |
| 4 | Rogue AP detection by fingerprint comparison |
| 5 | Forensic analysis of AP differences |
| 6 | Security awareness |
