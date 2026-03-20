#!/usr/bin/env python3
"""Phase 10: Improve generic README/HOWTO/CHANGES with real app content.

Replaces generic template docs with app-specific content extracted from
index.html and script.js (title, subtitle, sections, controls, features).
"""

import os
import re
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))


def get_app_info(app_dir):
    """Extract app metadata from script.js and index.html."""
    info = {'title': '', 'subtitle': '', 'sections': [], 'buttons': [], 'features': []}

    script_path = os.path.join(app_dir, 'script.js')
    if os.path.exists(script_path):
        with open(script_path, 'r', encoding='utf-8') as f:
            content = f.read()
        m = re.search(r"title\s*:\s*'([^']*)'", content)
        if m:
            info['title'] = re.sub(r'[^\w\s\-/]', '', m.group(1)).strip()
        m = re.search(r"subtitle\s*:\s*'([^']*)'", content)
        if m:
            info['subtitle'] = m.group(1)

        # Extract section names
        for key in ['sectionA', 'sectionB', 'sectionC', 'sectionLearn', 'sectionDemo', 'sectionCode']:
            m = re.search(rf"{key}\s*:\s*'([^']*)'", content)
            if m:
                info['sections'].append(m.group(1))

        # Extract step titles
        for i in range(1, 5):
            m = re.search(rf"step{i}Title\s*:\s*'([^']*)'", content)
            if m:
                info['features'].append(m.group(1))

        # Extract button labels
        for m in re.finditer(r"btn\d\s*:\s*'([^']*)'", content):
            info['buttons'].append(m.group(1))

    if not info['title']:
        info['title'] = os.path.basename(app_dir).replace('-', ' ').title()

    return info


def gen_readme(info, app_name, cat_name):
    title = info['title']
    subtitle = info['subtitle'] or f"An interactive {title} simulation"
    sections = info['sections']
    features = info['features']
    buttons = info['buttons']

    section_list = '\n'.join([f"- {s}" for s in sections]) if sections else "- Interactive simulation"
    feature_list = '\n'.join([f"- {f}" for f in features]) if features else "- Real-time visualization"
    button_list = '\n'.join([f"- {b}" for b in buttons]) if buttons else "- Start/Stop simulation"

    return f"""# {title}

> {subtitle}

**Category:** {cat_name}

## Description
{title} is an interactive educational web app from Workshop-DIY.
It provides a hands-on simulation environment where you can explore,
experiment, and learn about the underlying technology.

## Sections
{section_list}

## How It Works
{feature_list}

## Controls
{button_list}

## Features
- Interactive simulation with real-time visualization
- Trilingual interface (English, French, Arabic with RTL)
- 8 color themes including 2 light modes
- Activity log with filtering and export
- Guided demo walkthrough
- Learning objectives with difficulty badges
- Hardware device code (📦 Device Code section)
- Works offline from `file://` — no server needed

## Quick Start
1. Open `index.html` in any modern browser
2. Read "What You Shall Learn" to understand the goals
3. Follow "How It Works" step cards
4. Try "Watch Demo" for a guided walkthrough
5. Experiment in the main simulation
6. Check the Lab section for hands-on challenges

## Files
| File | Purpose |
|------|---------|
| `index.html` | Main app interface |
| `script.js` | Simulation logic + i18n |
| `style.css` | Shared Workshop-DIY theme |
| `manifest.json` | PWA metadata |
| `sw.js` | Service worker for offline |
| `code/` | Hardware source code |
| `docs/HOWTO.md` | Step-by-step guide |

## License
Workshop-DIY Educational Project
"""


def gen_howto(info, app_name):
    title = info['title']
    steps = info['features']
    buttons = info['buttons']

    step_text = ""
    if steps:
        for i, s in enumerate(steps, 1):
            step_text += f"\n### Step {i}: {s}\nFollow the on-screen instructions for this step.\n"
    else:
        step_text = """
### Step 1: Observe
Look at the main visualization and understand what's being simulated.

### Step 2: Interact
Use the control buttons to start and configure the simulation.

### Step 3: Experiment
Change settings and parameters to see how they affect results.

### Step 4: Analyze
Check the activity log and results panels for detailed data.
"""

    button_text = ""
    if buttons:
        button_text = "\n## Controls\n"
        for b in buttons:
            button_text += f"- **{b}**: Click to activate this function\n"

    return f"""# How To Use: {title}

## Quick Start (5 minutes)

### Open the App
Open `index.html` in your browser. No internet required.

### Read Learning Objectives
The "🎯 What You Shall Learn" section (open by default) tells you what
skills and concepts you'll explore.

### Watch the Demo
Click "▶️ Watch Demo" and press Play for a guided walkthrough.
The demo highlights each element and explains what to do.

## Detailed Steps
{step_text}
{button_text}
## Language & Theme
1. Click the ⚙️ Settings gear icon
2. Choose English, French, or Arabic
3. Pick from 8 color themes
4. Arabic automatically enables right-to-left layout

## Hardware Code
Check the "📦 Device Code" section to find real firmware you can
flash to micro:bit, ESP32, or run on Raspberry Pi / SDR.

## Tips
- Click the ❓ Help button for FAQ and Wiki content
- The activity log can be filtered by type (info, success, error)
- Everything runs locally — your data stays on your device
- Try the Lab section for hands-on experiments
"""


def gen_changes(info):
    title = info['title']
    features = info['features']
    sections = info['sections']

    feature_bullets = ""
    if features:
        feature_bullets = '\n'.join([f"- {f} step card" for f in features])
    else:
        feature_bullets = "- Interactive simulation"

    section_bullets = '\n'.join([f"- {s} section" for s in sections]) if sections else ""

    return f"""# Changelog — {title}

## v2.0.0 — Enhanced Release
- "What You Shall Learn" section with learning objectives and badges
- "How It Works" 4-step cards with trilingual translations
- "Watch Demo" guided walkthrough with auto-play
- "Device Code" section with hardware source files
- 8 kid-friendly FAQ items (EN/FR/AR)
- PWA icons (192px + 512px)
- Service worker for offline support
- Improved documentation

## v1.0.0 — Initial Release
- Full interactive simulation
{feature_bullets}
{section_bullets}
- Trilingual support (EN/FR/AR)
- 8 color themes
- Activity log with filtering
- Help panel with FAQ, How-To, Wiki
"""


fixed = 0

for app_dir in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*'))):
    if not os.path.isdir(app_dir):
        continue
    if not os.path.exists(os.path.join(app_dir, 'index.html')):
        continue

    app_name = os.path.basename(app_dir)
    cat_name = os.path.basename(os.path.dirname(app_dir))

    info = get_app_info(app_dir)

    # Update README.md
    readme_path = os.path.join(app_dir, 'README.md')
    with open(readme_path, 'w', encoding='utf-8') as f:
        f.write(gen_readme(info, app_name, cat_name))

    # Update docs/HOWTO.md
    docs_dir = os.path.join(app_dir, 'docs')
    os.makedirs(docs_dir, exist_ok=True)
    howto_path = os.path.join(docs_dir, 'HOWTO.md')
    with open(howto_path, 'w', encoding='utf-8') as f:
        f.write(gen_howto(info, app_name))

    # Update CHANGES.md
    changes_path = os.path.join(app_dir, 'CHANGES.md')
    with open(changes_path, 'w', encoding='utf-8') as f:
        f.write(gen_changes(info))

    fixed += 1

print(f"✓ Updated docs for {fixed} apps")
