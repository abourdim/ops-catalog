# esp-packet-sniffer — How To Use

## Prerequisites

- A modern web browser
- Optional: ESP32 with monitor mode firmware

## Lab Walkthrough

### Step 1: Start Scanning
Click "Start Scan" to begin capturing simulated WiFi packets. The radar display shows detected devices.

### Step 2: Observe the Radar
Devices appear on the circular radar at different distances based on signal strength. Colors indicate device types.

### Step 3: Inspect Packets
Click a captured packet to view its hex dump and decoded 802.11 frame header (type, subtype, addresses, sequence).

### Step 4: Filter by Type
Use the packet type filters to isolate beacons, probe requests, data frames, or management frames.

### Step 5: Change Channel
Switch WiFi channels to see different traffic. Each channel has different activity levels.

### Step 6: Lab Experiments
Open Section B to generate custom traffic, decode headers in detail, and identify hidden devices.

### Step 7: Challenges
Complete 3 challenges: find a hidden device, identify the router, and decode an encrypted frame header.

## What Each Step Teaches

| Step | Concept |
|------|---------|
| 1 | WiFi promiscuous/monitor mode |
| 2 | RSSI and signal strength |
| 3 | 802.11 frame structure |
| 4 | Frame types and subtypes |
| 5 | WiFi channel allocation |
| 6 | Network reconnaissance |
| 7 | Packet analysis skills |

## Going Further

- Use ESP32 with esp_wifi_set_promiscuous() for real capture
- Compare with Wireshark captures
- Learn about pcap file format
