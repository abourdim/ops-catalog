# CHANGES — bit-panic-button

## v1.0 — Initial Release

### Added
- Big red PANIC button with radial gradient and pulse animation
- 5-second countdown timer with red flashing display
- Cancel button to abort panic sequence during countdown
- Data vault with 8 simulated classified secret files
- Broadcast alert simulation on 7 radio channels (TX log entries)
- Secure data wipe with progress bar and files disappearing one by one
- Post-wipe status: "WIPED — 0 files remaining"
- Section A (How It Works): 4-step visual explanation of panic protocol
- Section B (Lab): load files, configure countdown (3-15s slider), test panic, verify wipe, reset
- Section C (Challenge): 3 challenges (cancel before wipe, silent panic, dead-man switch)
- Help panel: FAQ (data wipe, broadcast range, false alarms, recovery), How-To (4 steps), Wiki (Emergency Broadcast, Secure Erase, Dead Man Switch, micro:bit Radio)
- Full i18n: English, French, Arabic with all panic-specific keys
- Minimal inline styles for panic-btn-large, countdown, data-vault, wipe-progress, broadcast-pulse
- Template infrastructure preserved: splash, themes, log, toast, status, panels, sound, easter eggs
