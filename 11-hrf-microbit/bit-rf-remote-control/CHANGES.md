# Changelog — bit-rf-remote-control

## v1.0 — Initial Release

### Added
- Protocol Frame Builder with editable hex fields (preamble, address, command, payload, checksum).
- Command Grid: UP, DOWN, LEFT, RIGHT, A, B buttons mapped to hex command codes.
- Virtual Device Display: a robot that moves on valid commands, with trail dots.
- Frame Inspector: color-coded hex dump showing TX and RX frames side by side.
- Error Rate Slider (0-50%): simulates noisy channel with random bit flips.
- XOR Checksum: automatic computation on transmit; verification on receive with pass/fail indicator.
- Keyboard controls: arrow keys for movement, A/B keys for actions.
- Trilingual i18n: English, French, Arabic with full RTL support.
- Section A (How It Works): 4-step protocol design walkthrough.
- Section B (Lab): hands-on experiments with frame formats and error rates.
- Section C (Challenge): ACK protocol, 1-bit error correction, replay attack defense.
- Help Panel: FAQ, How-To, Wiki with radio protocol topics.
- Full Workshop-DIY template infrastructure: splash, themes, log, toast, settings, easter eggs.

### Technical
- Vanilla JS only, no dependencies.
- PWA manifest included.
- All text uses data-i18n for trilingual support.
- Minimal inline styles for simulation components; main CSS untouched.
