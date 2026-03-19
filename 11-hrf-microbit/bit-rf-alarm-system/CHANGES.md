# CHANGES — bit-rf-alarm-system

## v1.0 — 2026-03-18

### Added
- Alarm panel with Armed/Disarmed/ALERT visual states
- Keypad for manual code entry (code: 1234)
- Remote control buttons: Arm and Disarm
- RF jamming simulation — floods channel, blocks commands, signal meter drops
- Record & Replay attack — captures disarm frame, retransmits it
- Security mode toggle: Basic (fixed code "1234") vs Secure (rolling codes)
- Rolling code display showing current transmission code
- Signal quality meter with real-time animation during jamming
- Section A: How It Works — 4-step explanation of RF alarm vulnerabilities
- Section B: Lab — 4 guided experiments (jam, replay, secure mode, rolling codes)
- Section C: Challenge — 3 challenges (disarm without code, defeat rolling codes, design unbreakable alarm)
- Help panel: FAQ (4 items), How-To (4 steps), Wiki (RF Jamming, Replay Attacks, Rolling Codes, Secure RF Protocols)
- Full trilingual support: English, French, Arabic
- All text uses data-i18n keys
- Minimal inline styles for alarm-specific components (alarm-panel, keypad, signal-meter, attack-tools)
- Template infrastructure preserved: themes, log, toast, status, panels, sound, easter eggs
