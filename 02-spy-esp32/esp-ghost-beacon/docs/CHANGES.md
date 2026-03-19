# Changelog — Ghost Beacon

## v1.2 (2025-03-18)

### Added
- Beacon Broadcaster with 3 protocols: iBeacon, Eddystone, Custom BLE ADV
- 4 encoding methods: UUID Steganography, Major/Minor Fields, Namespace Encoding, TX Power Modulation
- Beacon Scanner with simulated ambient beacons and ghost beacon detection
- Hidden Message Decoder with protocol-aware decoding
- Pulsing broadcast animation with concentric rings
- Section A: How It Works (4 educational steps)
  - BLE Advertising Basics
  - Beacon Protocols (iBeacon & Eddystone)
  - Steganography in Beacons
  - Proximity & RSSI
- Section B: Lab — Beacon Experiments
  - RSSI Distance Estimator (log-distance path loss model)
  - BLE Packet Builder (iBeacon, Eddystone-UID, Eddystone-URL frame visualization)
  - Multi-Beacon Radar (live canvas radar with sweep animation)
- Section C: 3 Challenges
  - Decode the Ghost: find and decode a mystery beacon
  - Proximity Treasure Hunt: walk closer to reveal a proximity-locked message
  - Beacon Flood Detection: identify a suspicious fake beacon among legitimate ones
- Full trilingual i18n (EN/FR/AR) with data-i18n attributes
- Help panel: FAQ (BLE, iBeacon, Eddystone, steganography, RSSI), How-To (4 steps), Wiki (BLE Advertising, Beacon Protocols, Steganography, Privacy)
- TX Power slider (-40 to +4 dBm)
- All template v1.2 features preserved (themes, panels, log, sound, easter eggs)

### Infrastructure
- Built on Workshop-DIY Template v1.2
- style.css untouched
- PWA manifest updated
