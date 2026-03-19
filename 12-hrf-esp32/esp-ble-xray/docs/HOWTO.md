# HOWTO — BLE X-Ray

## What is this?
BLE X-Ray visualizes Bluetooth Low Energy frequency hopping across the 2.4 GHz ISM band. BLE uses 40 channels (2 MHz each) and hops at 1600 times per second.

## Quick Start
1. Open `index.html` in a browser
2. Click "Start Scan" to begin simulation
3. Watch the waterfall fill with channel activity
4. Blue dots = data channels, Red markers = advertising channels

## Understanding the Display
- **Waterfall**: Time flows downward, each column is a BLE channel (0-39)
- **Histogram**: Shows which channels are used most
- **Device List**: Simulated BLE devices with signal strength

## BLE Channel Map
- Channels 0-36: Data channels (used by connected devices)
- Channel 37: 2402 MHz (advertising)
- Channel 38: 2426 MHz (advertising)
- Channel 39: 2480 MHz (advertising)
