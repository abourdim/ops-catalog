# web-exif-eraser — Workshop DIY

**Strip hidden metadata from photos before sharing — privacy-first EXIF scrubber simulation**

---

## What It Teaches

EXIF Eraser helps students understand the hidden metadata embedded in every digital photo. Students learn about:

- **EXIF Metadata** — What data cameras and phones secretly embed in photos
- **GPS Geotagging** — How photos reveal your exact location
- **Privacy Risks** — Why metadata can be dangerous when shared online
- **Metadata Scrubbing** — How to remove hidden data before sharing

---

## Files

| File | Description |
|------|-------------|
| `index.html` | Main UI with upload zone, metadata tables, 3 sections (How It Works, Comparison Lab, Challenge), help panel |
| `script.js` | Full simulation engine, fake EXIF generator, scrubber, i18n (EN/FR/AR), template infrastructure |
| `style.css` | Template styles (8 themes, animations, responsive) — DO NOT MODIFY |
| `manifest.json` | PWA manifest |
| `README.md` | This file |
| `CHANGES.md` | Changelog |
| `docs/HOWTO.md` | Step-by-step workshop guide |

---

## Features

### Main Card
- **Upload Zone** — Drag & drop or click to upload an image (or use sample)
- **Sample Image** — Canvas-drawn mosque scene with generated EXIF
- **Metadata Table (Before)** — Shows all hidden EXIF fields with values
- **Privacy Risk Badge** — HIGH/MEDIUM/LOW/CLEAN indicator
- **Scrub Button** — Animated removal of each metadata field
- **Metadata Table (After)** — Shows scrubbed (empty) fields
- **Stats Row** — Fields before, after, and removed count

### Section A — How It Works
- 4-step visual guide: What is EXIF, Why dangerous, How scrubbing works, Best practices

### Section B — Comparison Lab
- Side-by-side before/after comparison
- Batch scrub (3 samples) with sequential logging

### Section C — Challenge
- **Find the Spy** — Analyze mystery photo metadata to find location/device/time
- **Spot the Difference** — Visual comparison showing metadata is invisible
- **Privacy Audit** — Timed scrub of 5 images with scoring

---

## i18n

Full trilingual support: English, French, Arabic (RTL).

---

## License

Workshop-DIY — [abourdim](https://github.com/abourdim)
