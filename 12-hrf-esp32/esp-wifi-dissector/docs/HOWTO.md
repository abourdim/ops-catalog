# HOWTO — WiFi Dissector

## What is this?
WiFi Dissector simulates 802.11 frame capture and decoding. Each byte is color-coded by field (Frame Control, Duration, MAC addresses, Sequence Control, Body, FCS).

## Quick Start
1. Open `index.html` in a browser
2. Select a frame type (Beacon, Data, etc.)
3. Click "Generate Frame"
4. Hover over hex bytes to see field details
5. Open "Layer-by-Layer Decode" for full breakdown

## Frame Types
| Type | FC Bytes | Description |
|------|----------|-------------|
| Beacon | 80 00 | AP announcement |
| Probe Request | 40 00 | Client scanning |
| Data | 08 01 | Payload transfer |
| ACK | D4 00 | Acknowledgement |
| RTS | B4 00 | Request to Send |
| Auth | B0 00 | Authentication |

## Color Legend
- **Red** — Frame Control
- **Blue** — Duration/ID
- **Teal** — Address 1 (Receiver)
- **Yellow** — Address 2 (Transmitter)
- **Orange** — Address 3 (BSSID)
- **Dark** — Sequence Control
- **Purple** — Frame Body
- **Gray** — FCS (CRC-32)

## Auto Capture
Click "Auto Capture" to continuously generate frames with realistic traffic distribution (heavy on beacons and data). Statistics chart updates live.
