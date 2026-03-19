# CHANGES — bit-wrist-communicator

## v1.0 — 2026-03-18

### Added
- Polybius square (5x5 tap code grid) with interactive visual display
- Tap input area with timing-based row/column detection
- Text-to-tap encoder: type a message and see the full tap sequence
- Tap-to-text decoder: tap manually and watch letters appear
- Audio playback of tap sequences with adjustable speed (slow/medium/fast)
- Visual grid cell highlighting during decode and playback
- Decoded message display with running text output
- Encoded pattern display showing (row,col) pairs
- Section A: "How It Works" — 4-step explanation of tap code
- Section B: "Lab" — hands-on practice instructions
- Section C: "Challenge" — 3 progressively harder challenges
- Help panel with FAQ, How-To, and Wiki tabs
- Wiki entries: Tap Code, Polybius Square, Haptic Communication, POW Communication
- Full trilingual support (English, French, Arabic) with all i18n keys
- Double-click tap area to reset decoded message
- All template features preserved (8 themes, activity log, sound effects, Konami code, matrix rain, etc.)

### Technical
- Polybius square with K merged into C (standard tap code convention)
- Timing state machine: GAP_MS=600ms between row/col, LETTER_MS=1400ms between letters
- Web Audio API beeps for tap feedback
- Speed-adjustable playback with visual tap button animation
- Grid built dynamically from POLYBIUS array
