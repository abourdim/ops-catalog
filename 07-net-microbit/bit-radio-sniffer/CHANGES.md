# CHANGES — bit-radio-sniffer

## v1.0 (2026-03-18)

### Added
- Spectrum display canvas with bar chart (top) and waterfall scroll (bottom)
- 84-channel selector (micro:bit radio groups 0-83)
- Start Scan, Stop, and Auto Scan controls
- Packet capture list with timestamps, channel, hex data, and decoded text
- Channel info badges (CH, PKT, SIG)
- Section A — "How It Works": 4-step explanation (tune, listen, capture, display)
- Section B — "Lab": Generate Traffic, Burst Mode, Clear Spectrum, Export Capture
- Section C — "Challenge": 3 challenges (hidden message, busiest channel, Caesar cipher)
- Help panel with FAQ, How-To, and Wiki tabs
- Wiki entries: Radio Spectrum, Packet Sniffing, micro:bit Radio Groups, Frequency Hopping
- Full i18n support: English, French, Arabic (RTL)
- Simulated traffic engine with random hex data and readable text messages
- Caesar cipher encoding/decoding for Challenge 3
- Packet export to text file
- All template features: 8 themes, splash screen, activity log, sound effects, Konami code, matrix rain, pixel pet, breathing guide, whisper mode, music reactive mode

### Technical
- Vanilla JS, zero dependencies
- Canvas-based spectrum visualization with decay animation
- Waterfall display with 40-row history
- Max 50 packets in UI view, unlimited in memory
- Responsive spectrum canvas with resize handling
