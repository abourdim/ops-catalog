#!/usr/bin/env python3
"""Phase 12: Validate all 488 apps — check for required files, features, and quality."""

import os
import re
import glob
import json

ROOT = os.path.dirname(os.path.abspath(__file__))

REQUIRED_FILES = ['index.html', 'script.js', 'style.css', 'manifest.json',
                  'README.md', 'CHANGES.md', 'sw.js']
REQUIRED_DIRS = ['docs', 'code']
REQUIRED_DOC_FILES = ['docs/HOWTO.md']

checks = {
    'total': 0,
    'pass': 0,
    'fail': 0,
    'issues': [],
}

results = []

for app_dir in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*'))):
    if not os.path.isdir(app_dir):
        continue
    if not os.path.exists(os.path.join(app_dir, 'index.html')):
        continue

    app_name = os.path.basename(app_dir)
    cat_name = os.path.basename(os.path.dirname(app_dir))
    app_id = f"{cat_name}/{app_name}"
    checks['total'] += 1

    issues = []

    # Check required files
    for f in REQUIRED_FILES:
        path = os.path.join(app_dir, f)
        if not os.path.exists(path):
            issues.append(f"Missing {f}")
        elif os.path.getsize(path) == 0:
            issues.append(f"Empty {f}")

    # Check required dirs
    for d in REQUIRED_DIRS:
        if not os.path.isdir(os.path.join(app_dir, d)):
            issues.append(f"Missing {d}/")

    # Check docs
    for f in REQUIRED_DOC_FILES:
        if not os.path.exists(os.path.join(app_dir, f)):
            issues.append(f"Missing {f}")

    # Check icons
    for size in [192, 512]:
        if not os.path.exists(os.path.join(app_dir, f'icon-{size}.png')):
            issues.append(f"Missing icon-{size}.png")

    # Check manifest.json quality
    manifest_path = os.path.join(app_dir, 'manifest.json')
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, 'r', encoding='utf-8') as f:
                manifest = json.load(f)
            if 'my-project' in manifest.get('name', ''):
                issues.append("manifest.json still has 'my-project'")
        except:
            issues.append("manifest.json is invalid JSON")

    # Check script.js features
    script_path = os.path.join(app_dir, 'script.js')
    if os.path.exists(script_path):
        with open(script_path, 'r', encoding='utf-8') as f:
            script = f.read()

        if 'step1Title' not in script:
            issues.append("Missing step cards i18n (step1Title)")
        if 'faq_q8' not in script:
            issues.append("Missing 8-item FAQ (faq_q8)")
        if 'sectionCode' not in script:
            issues.append("Missing Device Code i18n")
        if 'sectionDemo' not in script:
            issues.append("Missing Demo i18n")
        if 'sectionLearn' not in script:
            issues.append("Missing Learn i18n")
        if 'DEMO_STEPS' not in script:
            issues.append("Missing DEMO_STEPS array")

        # Check trilingual
        if 'en:{' not in script and 'en: {' not in script:
            issues.append("Missing EN language block")
        if 'fr:{' not in script and 'fr: {' not in script and 'fr:{' not in script:
            # More flexible check
            if not re.search(r'\bfr\s*:\s*\{', script):
                issues.append("Missing FR language block")
        if not re.search(r'\bar\s*:\s*\{', script):
            issues.append("Missing AR language block")

    # Check HTML features
    html_path = os.path.join(app_dir, 'index.html')
    if os.path.exists(html_path):
        with open(html_path, 'r', encoding='utf-8') as f:
            html = f.read()

        if 'href="style.css"' not in html:
            issues.append("Missing external style.css link")
        if 'faq_q8' not in html:
            issues.append("Missing 8 FAQ items in HTML")

    if issues:
        checks['fail'] += 1
        checks['issues'].append((app_id, issues))
    else:
        checks['pass'] += 1

    results.append((app_id, len(issues) == 0, issues))

# ── Report ──
print("=" * 60)
print("  VALIDATION REPORT — Workshop-DIY Catalog")
print("=" * 60)
print(f"\n  Total apps: {checks['total']}")
print(f"  ✅ PASS:    {checks['pass']}")
print(f"  ❌ FAIL:    {checks['fail']}")
print(f"  Pass rate:  {checks['pass']/checks['total']*100:.1f}%\n")

if checks['issues']:
    # Group by issue type
    issue_counts = {}
    for app_id, issues in checks['issues']:
        for issue in issues:
            issue_counts[issue] = issue_counts.get(issue, 0) + 1

    print("  Issue Summary:")
    for issue, count in sorted(issue_counts.items(), key=lambda x: -x[1]):
        print(f"    {count:3d} apps: {issue}")

    print(f"\n  First 10 failing apps:")
    for app_id, issues in checks['issues'][:10]:
        print(f"    {app_id}: {', '.join(issues[:3])}")

print("\n" + "=" * 60)
