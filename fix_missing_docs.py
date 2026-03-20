#!/usr/bin/env python3
"""Phase 0C: Add missing manifest.json, README.md, CHANGES.md, docs/HOWTO.md to categories 43-55."""

import os
import re
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))

def get_app_title(app_dir):
    """Extract title from index.html or script.js."""
    script = os.path.join(app_dir, 'script.js')
    if os.path.exists(script):
        with open(script, 'r', encoding='utf-8') as f:
            content = f.read()
        m = re.search(r"title\s*:\s*'([^']*)'", content)
        if m:
            # Strip emoji
            title = re.sub(r'[^\w\s\-/]', '', m.group(1)).strip()
            return title

    html = os.path.join(app_dir, 'index.html')
    if os.path.exists(html):
        with open(html, 'r', encoding='utf-8') as f:
            content = f.read()
        m = re.search(r'<title>([^<]+)</title>', content)
        if m:
            return m.group(1).strip()

    return os.path.basename(app_dir).replace('-', ' ').title()

def gen_manifest(app_name, title, description):
    return f'''{{"name": "{title} — Workshop DIY",
  "short_name": "{title}",
  "description": "{description}",
  "start_url": ".",
  "display": "standalone",
  "background_color": "#08091a",
  "theme_color": "#08091a",
  "icons": [
    {{"src": "icon-192.png", "sizes": "192x192", "type": "image/png"}},
    {{"src": "icon-512.png", "sizes": "512x512", "type": "image/png"}}
  ]
}}'''

def gen_readme(app_name, title, description):
    return f"""# {title}

> A Workshop-DIY educational web app

## Description
{description}

## Features
- Interactive simulation with real-time visualization
- Trilingual interface (English, French, Arabic with RTL)
- 8 color themes including 2 light modes
- Activity log with filtering and export
- Works offline from `file://` — no server needed

## Quick Start
1. Open `index.html` in any modern browser
2. Explore the main simulation section
3. Try different settings and watch the results
4. Open collapsible sections for deeper learning

## Files
| File | Purpose |
|------|---------|
| `index.html` | Main app interface |
| `script.js` | Simulation logic + i18n |
| `style.css` | Shared Workshop-DIY theme |
| `manifest.json` | PWA metadata |
| `docs/HOWTO.md` | Step-by-step guide |

## License
Workshop-DIY Educational Project
"""

def gen_changes(title):
    return f"""# Changelog — {title}

## v1.0.0 — Initial Release
- Full interactive simulation
- Trilingual support (EN/FR/AR)
- 8 color themes
- Activity log with filtering
- Help panel with FAQ, How-To, Wiki
"""

def gen_howto(title, description):
    return f"""# How To Use: {title}

## Quick Start (5 minutes)

### Step 1: Open the App
Open `index.html` in your browser. No internet required.

### Step 2: Explore the Main Section
Use the controls to start the simulation. Try different settings.

### Step 3: Watch the Results
Observe the visualization and check the activity log for details.

### Step 4: Go Deeper
Open the collapsible sections below the main area for theory and experiments.

### Step 5: Change Language/Theme
Open Settings (gear icon) to switch between English, French, or Arabic.
Pick from 8 themes to customize the look.

## Tips
- Click the Help button for FAQ and Wiki content
- The activity log can be filtered by type (info, success, error)
- Everything runs locally — your data stays on your device
"""

fixed = 0

for app_dir in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*'))):
    if not os.path.isdir(app_dir):
        continue
    if not os.path.exists(os.path.join(app_dir, 'index.html')):
        continue

    app_name = os.path.basename(app_dir)
    cat_name = os.path.basename(os.path.dirname(app_dir))

    title = get_app_title(app_dir)
    description = f"An interactive {title} simulation for educational exploration."

    needs_fix = False

    # manifest.json
    manifest_path = os.path.join(app_dir, 'manifest.json')
    if not os.path.exists(manifest_path):
        with open(manifest_path, 'w', encoding='utf-8') as f:
            f.write(gen_manifest(app_name, title, description))
        needs_fix = True

    # README.md
    readme_path = os.path.join(app_dir, 'README.md')
    if not os.path.exists(readme_path):
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(gen_readme(app_name, title, description))
        needs_fix = True

    # CHANGES.md
    changes_path = os.path.join(app_dir, 'CHANGES.md')
    if not os.path.exists(changes_path):
        with open(changes_path, 'w', encoding='utf-8') as f:
            f.write(gen_changes(title))
        needs_fix = True

    # docs/HOWTO.md
    docs_dir = os.path.join(app_dir, 'docs')
    howto_path = os.path.join(docs_dir, 'HOWTO.md')
    if not os.path.exists(howto_path):
        os.makedirs(docs_dir, exist_ok=True)
        with open(howto_path, 'w', encoding='utf-8') as f:
            f.write(gen_howto(title, description))
        needs_fix = True

    if needs_fix:
        fixed += 1
        print(f"✓ {cat_name}/{app_name}")

print(f"\n=== Generated docs for {fixed} apps ===")
