# Replay Lab — Capture & Replay

> Learn why rolling codes defeat replay attacks

## Overview

A hands-on lab demonstrating replay attacks on wireless systems. Capture a transmission waveform and try to replay it. With fixed codes, the replay succeeds. Toggle rolling codes on, and watch the replay fail -- teaching why modern systems use rolling codes.

## Features

- Waveform capture and display
- Capture and replay buttons with visual feedback
- Rolling code toggle to switch between fixed and rolling modes
- Fixed code: replay succeeds (door opens)
- Rolling code: replay fails (code expired)
- Visual code comparison display
- Security concepts guide (Section C)
- Trilingual (EN/FR/AR) with RTL support
- 8 themes, sound effects, activity log

## Files

| File | Description |
|------|-------------|
| `index.html` | App layout with waveform, capture/replay, toggle |
| `script.js` | Replay engine, i18n, theme, panels |
| `style.css` | Shared Workshop-DIY template (DO NOT EDIT) |
| `manifest.json` | PWA manifest |

## Quick Start

Open `index.html` in any modern browser. Click **Transmit** then **Capture** then **Replay**.

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
