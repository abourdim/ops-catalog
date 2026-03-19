# How-To Guide — WiFi Sonar

## Overview
WiFi Sonar is a simulated radar-style visualizer for 802.11 wireless frames. It renders Access Points (APs) as fixed nodes on a sonar radar and client devices as orbiting dots.

## Step-by-Step

### 1. Launch the App
Open `index.html` in any modern browser. A splash screen appears briefly.

### 2. Start the Sonar
Click the **Start** button on the main card. The radar sweep begins, revealing APs and clients.

### 3. Observe the Radar
- **Gold dots** = Access Points (fixed position)
- **Blue dots** = Client devices (orbiting their AP)
- The sweep beam highlights devices as it passes over them
- SSID labels appear above each AP

### 4. View Device List
Expand the **Device List** section to see a table of all detected devices with MAC address, type, SSID, signal strength, and frame count.

### 5. Check Frame Statistics
Expand **Frame Statistics** to see the breakdown:
- **Management** frames (beacons, probes)
- **Control** frames (ACK, RTS, CTS)
- **Data** frames (payload)

### 6. Learn How It Works
Expand **How It Works** for an educational explanation of WiFi monitoring concepts.

### 7. Stop the Sonar
Click **Stop** to halt the simulation and freeze the current state.

## Settings
- **Language**: English, French, Arabic (with RTL)
- **Theme**: 8 visual themes (Mosque, Zellige, Andalus, etc.)
- **Sound**: Toggle sound effects on/off

## Tips
- The Activity Log records all events (new APs, clients, frame captures)
- Use log filters to focus on specific event types
- Export logs for later analysis
