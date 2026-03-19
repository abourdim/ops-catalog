# 👻 Ghost Beacon — Hidden BLE Messages

**ESP32 broadcasts BLE beacons with hidden encoded messages. Only the right app decodes them.**

Students learn about BLE advertising, iBeacon/Eddystone protocols, steganography in beacons, and proximity messaging.

---

## Features

| Feature | Description |
|---------|-------------|
| Beacon Broadcaster | Encode secret messages into iBeacon, Eddystone, or Custom BLE advertisement packets |
| Beacon Scanner | Detect and list nearby (simulated) BLE beacons with RSSI and protocol info |
| Message Decoder | Extract hidden messages from beacon fields using the correct decoding method |
| RSSI Distance Estimator | Calculate distance from RSSI using the log-distance path loss model |
| BLE Packet Builder | Visualize raw iBeacon and Eddystone frame structures byte by byte |
| Multi-Beacon Radar | Live radar display of multiple beacons with distance and signal strength |
| 3 Challenges | Decode the Ghost, Proximity Treasure Hunt, Beacon Flood Detection |

---

## Encoding Methods

| Method | How it works | Max message length |
|--------|-------------|-------------------|
| UUID Steganography | ASCII bytes encoded into the 16-byte UUID field | 16 chars |
| Major/Minor Fields | Message split across 2-byte Major and 2-byte Minor | 4 chars |
| Namespace Encoding | ASCII bytes in the 10-byte Eddystone Namespace | 10 chars |
| TX Power Modulation | Message encoded as hex pattern in TX metadata | 16 chars |

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Full UI: broadcaster, scanner, decoder, labs, challenges |
| `script.js` | Template v1.2 + BLE simulation engine, encoding/decoding, challenges |
| `style.css` | Shared template styles (8 themes, animations, responsive) |
| `manifest.json` | PWA manifest |
| `docs/CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step usage guide |

---

## Quick Start

1. Open `index.html` in any browser
2. Type a secret message in the broadcaster
3. Choose protocol and encoding method
4. Click **Encode & Broadcast**
5. Start the scanner to detect beacons
6. Select the ghost beacon and decode the hidden message

---

## Sections

- **Main Card** — Beacon Broadcaster + Scanner + Decoder
- **Section A** — How It Works (4 steps: BLE Advertising, Beacon Protocols, Steganography, RSSI)
- **Section B** — Lab (RSSI Distance Estimator, BLE Packet Builder, Multi-Beacon Radar)
- **Section C** — Challenges (Decode the Ghost, Proximity Treasure Hunt, Beacon Flood Detection)

---

## i18n

Trilingual support: English, French, Arabic (with RTL). All UI strings use `data-i18n` attributes.

---

## Tech Stack

- Vanilla JS (zero dependencies)
- Full BLE simulation (no real Bluetooth required)
- Template v1.2 infrastructure (themes, panels, log, sound, easter eggs)
- PWA-ready

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
