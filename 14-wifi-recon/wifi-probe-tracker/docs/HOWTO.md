# How-To Guide — Probe Tracker

## Overview
Probe Tracker simulates WiFi probe request capture to demonstrate how devices leak location information through normal WiFi behavior.

## Step-by-Step

### 1. Launch the App
Open `index.html` in any modern browser.

### 2. Start Capturing
Click **Start** to begin the probe request simulation.

### 3. Watch the Probe Log
Observe probe requests appearing in real-time with MAC address, SSID name, and signal strength.

### 4. Check Device-Network Mapping
Expand the mapping section to see which devices have probed which networks. Each SSID reveals a location the device has visited.

### 5. Review Privacy Risk
Expand **Privacy Risk Analysis** to see the severity rating based on the number of networks and location categories revealed.

### 6. Learn How It Works
Expand **How It Works** for an explanation of why probe requests are a privacy concern.

### 7. Stop Capturing
Click **Stop** to halt the simulation.

## Tips
- Devices probe for multiple SSIDs, building a location profile over time
- The risk level increases as more networks from different location categories are revealed
- Export the activity log for detailed analysis
