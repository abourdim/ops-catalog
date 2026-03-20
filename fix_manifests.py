#!/usr/bin/env python3
"""Phase 6: Fix manifest.json — replace 'my-project' with real app names."""

import os
import re
import glob
import json

ROOT = os.path.dirname(os.path.abspath(__file__))

def get_title(app_dir):
    script = os.path.join(app_dir, 'script.js')
    if os.path.exists(script):
        with open(script, 'r', encoding='utf-8') as f:
            content = f.read()
        m = re.search(r"title\s*:\s*'([^']*)'", content)
        if m:
            title = re.sub(r'[^\w\s\-/]', '', m.group(1)).strip()
            return title

    html = os.path.join(app_dir, 'index.html')
    if os.path.exists(html):
        with open(html, 'r', encoding='utf-8') as f:
            content = f.read()
        m = re.search(r'<title>([^<]+)</title>', content)
        if m:
            return m.group(1).replace(' — Workshop DIY', '').strip()

    return os.path.basename(app_dir).replace('-', ' ').title()

fixed = 0
for manifest_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'manifest.json'))):
    with open(manifest_path, 'r', encoding='utf-8') as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            # Try to fix malformed JSON
            f.seek(0)
            content = f.read()
            content = re.sub(r',\s*}', '}', content)
            content = re.sub(r',\s*]', ']', content)
            try:
                data = json.loads(content)
            except:
                continue

    app_dir = os.path.dirname(manifest_path)
    title = get_title(app_dir)

    needs_fix = False
    if data.get('name', '').startswith('my-project') or data.get('short_name', '').startswith('my-project'):
        needs_fix = True
    if 'Workshop DIY' not in data.get('name', ''):
        needs_fix = True

    if needs_fix:
        data['name'] = f"{title} — Workshop DIY"
        data['short_name'] = title[:30]
        if 'description' not in data or data['description'] == '':
            data['description'] = f"An interactive {title} simulation for educational exploration."
        if 'start_url' not in data:
            data['start_url'] = '.'
        if 'display' not in data:
            data['display'] = 'standalone'
        if 'background_color' not in data:
            data['background_color'] = '#08091a'
        if 'theme_color' not in data:
            data['theme_color'] = '#08091a'

        with open(manifest_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        fixed += 1

print(f"✓ Fixed {fixed} manifest.json files")
