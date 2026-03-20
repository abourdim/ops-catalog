# Execution Prompt for Claude

Use this prompt in a new Claude Code conversation to execute the improvement plan.

---

## Context

You are working on a 488-app educational web catalog at `/home/abdelhak/Desktop/00_amaloun/05_more_apps/`. Read `plan.md` (in the `ops-catalog/` directory) for the full improvement plan with 12 phases.

## Current State
- 488 apps across 55 categories (01-spy-microbit through 55-escape-evasion)
- Categories 01-42 also exist in `05_more_apps/` parent dir; categories 43-55 are ops-catalog only (43-bio-radio, 44-acoustic-warfare, 45-time-manipulation, 46-swarm-intelligence, 47-impossible-physics, 48-dark-arts, 49-ai-radio, 50-civilization-hacks, 51-social-engineering, 52-hardware-implants, 53-crypto-attacks, 54-rf-warfare, 55-escape-evasion)
- Each app has 7 files: index.html, script.js, style.css, manifest.json, README.md, CHANGES.md, docs/HOWTO.md
- All style.css files are identical (1,205 lines, 8 themes, RTL support)
- Template at: `tools/web_app_template/`
- Best reference app: `01-spy-microbit/bit-agent-id/` (has step cards, custom FAQ, lab experiments)
- Git repo is in `ops-catalog/` with remote `git@github.com:abourdim/ops-catalog.git`

## What Needs to Be Done (12 phases, in order)

### TOP PRIORITY — Educational Content (Phases 1-5)

**Phase 1: `add_how_it_works.py`** — Add 4-step "How It Works" cards to 470 apps missing them. Reference: bit-agent-id. CSS classes already exist. Generate app-specific steps + trilingual i18n (EN/FR/AR).

**Phase 2: `gen_code.py`** — Add `code/` folder to each app with real hardware source code: MicroPython + MakeCode JS (micro:bit), Arduino .ino (ESP32), Python (SDR/WiFi/RPi), GNURadio .grc (SDR/Ham). Also add a "Device Code" tab in index.html with copy/download.

**Phase 3: `gen_faq.py`** — Replace 4 generic FAQ items with 8 kid-friendly Q&A pairs per app. Fun tone, analogies, emojis, short sentences. Ages 10-16. Trilingual.

**Phase 4: `gen_demo.py`** — Add "Watch Demo" section with auto-playing 5-7 step guided walkthrough. Highlights target elements, narrates in kid-friendly language, has play/pause/prev/next controls. Add new CSS classes to style.css.

**Phase 5: `gen_learn.py`** — Add "What You Shall Learn" as first collapsible (open by default) with 4-6 learning items (icon + title + description + tag) plus Level/Time/Age badges. Add new CSS classes to style.css.

### Infrastructure Fixes (Phases 6-11, independent)

**Phase 6: `fix_manifests.py`** — Fix 94 manifest.json files still showing "my-project".
**Phase 7: `gen_icons.py`** — Generate icon-192.png + icon-512.png for all apps (Pillow).
**Phase 8: `fix_inline_css.py`** — Remove duplicate inline CSS from index.html files.
**Phase 9: `gen_sw.py`** — Add service workers for offline support (conditional on HTTP).
**Phase 10: `fix_docs.py`** — Improve generic README/HOWTO/CHANGES with real app content.
**Phase 11: `fix_i18n.py`** — Deduplicate shared i18n keys across all script.js files.

### Quality Gate (Phase 12)

**Phase 12: `validate_apps.py`** — Validation script checking all files, manifests, step cards, icons.

## Section Order in Each App (after all phases)
1. 🎯 What You Shall Learn (open by default)
2. 🔧 How It Works (4 step cards)
3. ▶️ Watch Demo (guided walkthrough)
4. 🧪 Lab Experiments (existing)
5. 📦 Device Code (hardware source)
6. 🏆 Challenges (existing, if present)

## Constraints
- Must preserve vanilla JS (no frameworks, no build step)
- Must work from `file://` (no server required)
- Each app must remain standalone (copy one dir = working app)
- style.css stays identical across all apps (shared template)
- All text must have i18n in EN, FR, AR with RTL support for Arabic
- All batch operations via Python scripts (can't manually edit 488 apps)
- Kid-friendly tone: ages 10-16, analogies, short sentences, emojis OK, no unexplained jargon

## How to Execute
1. Read `plan.md` for full details on each phase
2. Start with Phase 1 — create `add_how_it_works.py` and run it
3. Verify: open a few apps in browser, check step cards display
4. Move to Phase 2, then 3, etc.
5. After each phase, spot-check 3+ apps from different categories
6. After all phases, run `validate_apps.py`
7. Commit and push to `ops-catalog` repo

## Key Files to Read First
- `plan.md` — Full 12-phase plan with HTML/CSS/JS patterns, i18n keys, verification steps
- `01-spy-microbit/bit-agent-id/index.html` — Best reference app (has step cards)
- `01-spy-microbit/bit-agent-id/script.js` — Reference for i18n structure, FAQ, step keys
- `tools/web_app_template/style.css` — Shared CSS with existing step-card classes
- `tools/web_app_template/script.js` — Template JS with LANG object structure
- `BUILD_STATUS.md` — Current project status
