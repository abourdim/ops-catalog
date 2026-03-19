# HOWTO — web-exif-eraser Workshop Guide

## Overview

This workshop teaches students about the hidden metadata embedded in digital photos and why it is a privacy risk. Students will scan images for EXIF data, understand what it reveals, and learn how to scrub it before sharing photos online.

---

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge)
- No internet connection required (runs entirely offline)
- No prior knowledge needed

---

## Workshop Flow (30-45 minutes)

### Part 1: Introduction (5 min)

1. Open `index.html` in a browser
2. Explain the concept: "Every photo you take contains hidden data — your location, your device, the exact time. Anyone can extract it."
3. Open the Help panel (❓) and review the FAQ

### Part 2: Scan a Photo (10 min)

1. Click **Use sample image** to load a demo photo
2. Observe the canvas-drawn image appear
3. Look at the **Metadata (Before)** table — point out dangerous fields:
   - GPS coordinates (reveals location)
   - Camera Model (identifies your device)
   - Date/Time (reveals when)
   - Artist (reveals who)
4. Note the **Privacy Risk** badge — it should show HIGH
5. Open the Activity Log to see the detailed extraction

### Part 3: Scrub the Data (10 min)

1. Click **Scrub Metadata**
2. Watch the log as each field is removed one by one
3. Observe the **Metadata (After)** table — all fields show "—"
4. Check the Privacy Risk badge — it should now show CLEAN
5. Look at the stats: fields before, after, and removed
6. Open Section B to see the side-by-side comparison

### Part 4: Challenges (15 min)

1. Open Section C ("Challenge")
2. **Challenge 1: Find the Spy** — Click start, analyze the metadata to find location, device, and time
3. **Challenge 2: Spot the Difference** — Learn that scrubbed and unscrubbed images look identical
4. **Challenge 3: Privacy Audit** — Race to scrub 5 images and earn a privacy score

### Part 5: Discussion (5 min)

- What surprised you about the data hidden in photos?
- Do you check metadata before sharing photos?
- How would you protect yourself going forward?

---

## Key Learning Points

1. Every digital photo contains hidden EXIF metadata
2. GPS coordinates in photos reveal your exact location
3. Metadata is invisible — you must actively check and remove it
4. Scrubbing metadata preserves image quality while removing private data
5. Always scrub photos before sharing on social media

---

## Tips for Facilitators

- Start with "Has anyone ever checked what data is hidden in their photos?" — most students will say no
- The GPS field is the most impactful — show how it could reveal a home address
- Batch scrub demo shows the concept at scale
- Challenge 3 gamifies the process and motivates practice
- Encourage students to check their own phone camera settings after the workshop
