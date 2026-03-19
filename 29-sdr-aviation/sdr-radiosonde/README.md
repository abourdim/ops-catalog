# 📋 Workshop-DIY — Web App Template v1.2

**1200+ lines of JS · 1100+ lines of CSS · Zero frameworks · Pure magic.**

---

## Files

| File | Lines | Description |
|------|-------|-------------|
| `index.html` | ~280 | 3-panel layout, splash, all UI elements |
| `script.js` | ~1240 | Everything: i18n, themes, panels, log, sound, easter eggs, pets |
| `style.css` | ~1100 | 9 themes, animations, responsive, all component styles |
| `manifest.json` | ~12 | PWA manifest |

---

## Quick Start

```bash
cd tools/
./new_app.sh my-awesome-app    # or manually copy this folder
```

---

## JS API — Core

| Function | Description |
|----------|-------------|
| `log(msg, type)` | Log with typewriter effect. Types: `info`, `success`, `error`, `tx`, `rx` |
| `showToast(msg, autoHideMs)` | Toast notification. Pass ms to auto-hide |
| `hideToast()` | Hide toast manually |
| `setStatus(bool)` | Green (connected) / red (disconnected) pill |
| `setLanguage(lang)` | `'en'`, `'fr'`, `'ar'` — persisted |
| `setTheme(name)` | Theme name — plays melody, persisted |

## JS API — Panels

| Function | Description |
|----------|-------------|
| `openHelp()` / `closeHelp()` | Left panel (FAQ / How-To / Wiki) |
| `openSettings()` / `closeSettings()` | Right panel (lang / theme / sound / whisper / breathing) |
| `openLog()` / `closeLog()` / `toggleLog()` | Right docked log panel |
| `closeAllPanels()` | Close everything |

## JS API — Features

| Function | Description |
|----------|-------------|
| `playSound(type)` | `'click'`, `'success'`, `'error'` |
| `playThemeMelody(name)` | 3-note melody for a theme |
| `toggleWhisper()` | Start/stop voice-to-log (Web Speech API) |
| `toggleBreathing()` | Start/stop breathing guide + dhikr |
| `toggleMatrix()` | Arabic matrix rain on/off |
| `sendAppMessage(type, data)` | Send to other tabs |
| `onAppMessage(callback)` | Listen for messages from other tabs |
| `generateBugReport()` | Export JSON bug report |
| `setPetState(state)` | `'idle'`, `'happy'`, `'sad'`, `'sleep'` |

## JS API — Constants

| Constant | Description |
|----------|-------------|
| `APP_VERSION` | Current version string |
| `LIGHT_THEMES` | Array of light theme names |
| `THEME_MELODIES` | Map of theme → 3-note frequency array |
| `LANG` | i18n dictionary (en/fr/ar) |

---

## CSS Classes

### Layout

| Class | Use |
|-------|-----|
| `.app` | Main app container |
| `.rows-container` | Content area |
| `.card` | Themed content card |
| `.control-section` | Darker inset panel |
| `.collapsible` | Expandable `<details>` |

### Buttons

| Class | Use |
|-------|-----|
| `button` | Default themed button |
| `button.primary` | Accent CTA |
| `button.fire-btn` | Red danger |
| `.btn-sm` | Small button |
| `.btn-icon-only` | Square icon button (32×32) |

### Sidebar / Panels

| Class | Use |
|-------|-----|
| `.sidebar` | Right-sliding panel |
| `.sidebar-left` | Left-sliding panel |
| `.sidebar-group` | Settings group |
| `.sidebar-label` | Label in panel |
| `.sidebar-select` | Full-width select |

### Log

| Class | Use |
|-------|-----|
| `.log` | Log container |
| `.log-line` | Single entry |
| `.log-filter` | Filter button |
| `.log-body` | Scrollable log area |
| `.resize-handle` | Drag handle for panel width |

### Special

| Class | Use |
|-------|-----|
| `.splash` | Splash screen overlay |
| `.pixel-pet` | Animated footer pet |
| `.breathing` | Pulsating deco band |
| `.dhikr-display` | Dhikr counter UI |
| `.hijri-date` | Hijri calendar date |
| `.ghost-canvas` | Ghost cursor canvas |
| `.matrix-canvas` | Matrix rain canvas |
| `.debug-panel` | FPS/memory monitor |
| `.light-theme` | Applied to `<html>` for light themes |

---

## Easter Eggs Cheat Sheet

| Trigger | Effect |
|---------|--------|
| ↑↑↓↓←→←→BA | Retro CRT theme |
| Triple-click logo | Arabic matrix rain |
| Long-press log line | Morse code via status dot |
| `?debug=1` in URL | FPS + memory monitor |
| Shake phone | Export bug report |
| Ctrl+Z in log panel | Undo last log entry |

---

## Theme Melodies (frequencies in Hz)

| Theme | Note 1 | Note 2 | Note 3 |
|-------|--------|--------|--------|
| Mosque Gold | 330 (E4) | 392 (G4) | 523 (C5) |
| Zellige | 440 (A4) | 523 (C5) | 659 (E5) |
| Andalus | 294 (D4) | 370 (F#4) | 440 (A4) |
| Space | 523 (C5) | 659 (E5) | 784 (G5) |
| Jungle | 262 (C4) | 330 (E4) | 392 (G4) |
| Robot | 440 (A4) | 554 (C#5) | 659 (E5) |
| Riad | 349 (F4) | 440 (A4) | 523 (C5) |
| Medina | 294 (D4) | 349 (F4) | 440 (A4) |
| Retro | 523 (C5) | 262 (C4) | 523 (C5) |

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
