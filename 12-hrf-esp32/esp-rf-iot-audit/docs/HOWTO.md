# HOWTO — RF IoT Audit

## What is this?
RF IoT Audit simulates an ESP32 scanning WiFi, BLE, and ESP-NOW protocols simultaneously. It reveals all wireless IoT devices in range and flags security issues.

## Quick Start
1. Open `index.html` in a browser
2. Click "Start Audit" to begin scanning
3. Watch all 3 panels populate with devices
4. Check the Protocol Distribution chart for traffic patterns
5. Review the Audit Report for security warnings

## The 3 Protocols
| Protocol | What it finds |
|----------|---------------|
| WiFi (802.11) | Access points, SSIDs, encryption type |
| BLE | Phones, wearables, trackers, IoT devices |
| ESP-NOW | Peer-to-peer ESP32 sensor data |

## Security Flags
- **OPEN WiFi**: Unencrypted networks nearby
- **ESP-NOW traffic**: Check if encrypted
- **BLE Trackers**: AirTag/Tile-like devices in range
