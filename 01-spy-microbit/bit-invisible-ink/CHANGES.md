# CHANGES — bit-invisible-ink

## v1.0 — 2026-03-18

### Added
- Message composer with textarea (max 280 chars) and live character count
- Timer selector dropdown: 5s, 10s, 30s, 60s self-destruct options
- "Send Secret Message" button with simulated encryption and BLE transfer
- Message queue system supporting multiple pending messages with badge counter
- Received message display with fade-in animation
- Self-destruct countdown with visual progress bar
- Character-by-character burn animation (scramble random chars then dissolve)
- Read receipt indicator with precise timestamp logging
- Screenshot detection (PrintScreen key, visibility change) that accelerates destruction
- Destruction log panel in Lab section tracking all sent/read/destroyed events
- Section A (How It Works): 4-step visual guide
- Section B (Lab): 3 hands-on experiments
- Section C (Challenge): 3 coding challenges
- Help panel with FAQ, How-To, and Wiki tabs
  - FAQ: Invisible Ink overview, timer mechanics, read receipts, privacy
  - How-To: 4-step usage guide
  - Wiki: Ephemeral Messaging, Self-Destruct Timer, Read Receipts, Digital Forensics
- Full i18n support for EN, FR, AR (all app-specific keys)
- Custom `<style>` block for message-compose, burn-effect, destruct-timer, read-receipt
- Updated manifest.json for PWA
- README.md with full documentation
- CHANGES.md (this file)
- docs/HOWTO.md step-by-step tutorial
