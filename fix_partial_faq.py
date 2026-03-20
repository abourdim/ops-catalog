#!/usr/bin/env python3
"""Fix apps that have faq_q1/q2 but missing q3/q4 — add the missing ones."""

import os
import re
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))

FAQ_Q3Q4 = {
    'en': "faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick from 8 themes.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.'",
    'fr': "faq_q3:'Puis-je changer le th\\u00e8me?',faq_a3:'Oui! Ouvre les Param\\u00e8tres et choisis parmi 8 th\\u00e8mes.',faq_q4:'Mes donn\\u00e9es sont-elles priv\\u00e9es?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.'",
    'ar': "faq_q3:'\\u0647\\u0644 \\u064a\\u0645\\u0643\\u0646\\u0646\\u064a \\u062a\\u063a\\u064a\\u064a\\u0631 \\u0627\\u0644\\u0633\\u0645\\u0629\\u061f',faq_a3:'\\u0646\\u0639\\u0645! \\u0627\\u0641\\u062a\\u062d \\u0627\\u0644\\u0625\\u0639\\u062f\\u0627\\u062f\\u0627\\u062a \\u0648\\u0627\\u062e\\u062a\\u0631.',faq_q4:'\\u0647\\u0644 \\u0628\\u064a\\u0627\\u0646\\u0627\\u062a\\u064a \\u062e\\u0627\\u0635\\u0629\\u061f',faq_a4:'\\u0646\\u0639\\u0645. \\u0643\\u0644 \\u0634\\u064a\\u0621 \\u064a\\u0639\\u0645\\u0644 \\u0645\\u062d\\u0644\\u064a\\u0627\\u064b.'"
}

HTML_Q3Q4 = """        <details class="help-item"><summary data-i18n="faq_q3">Can I change the theme?</summary><p data-i18n="faq_a3">Yes! Open Settings and pick from 8 themes.</p></details>
        <details class="help-item"><summary data-i18n="faq_q4">Is my data private?</summary><p data-i18n="faq_a4">Yes. Everything runs locally in your browser. No data is sent anywhere.</p></details>"""

fixed = 0

for script_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'script.js'))):
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'faq_q4' in content:
        continue
    if 'faq_q1' not in content:
        continue  # No FAQ at all - handled by other script

    app_dir = os.path.dirname(script_path)
    app_name = os.path.basename(app_dir)
    cat_name = os.path.basename(os.path.dirname(app_dir))

    # Find the highest existing faq key
    has_q3 = 'faq_q3' in content
    has_q2 = 'faq_q2' in content

    new_content = content

    for lang in ['en', 'fr', 'ar']:
        lang_start = re.search(rf'\b{lang}\s*:\s*\{{', new_content)
        if not lang_start:
            continue
        start = lang_start.end()
        depth = 1
        pos = start
        while pos < len(new_content) and depth > 0:
            if new_content[pos] == '{': depth += 1
            elif new_content[pos] == '}': depth -= 1
            pos += 1
        close_pos = pos - 1

        if has_q3 and not has_q2:
            # Only add q4
            insert = ",faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.'"
        elif has_q3:
            # Add q4 only
            insert = ",faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.'"
        else:
            # Add q3 and q4
            insert = ',' + FAQ_Q3Q4[lang]

        new_content = new_content[:close_pos] + insert + new_content[close_pos:]

    if new_content != content:
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        # Fix HTML too
        html_path = os.path.join(app_dir, 'index.html')
        if os.path.exists(html_path):
            with open(html_path, 'r', encoding='utf-8') as f:
                html = f.read()
            if 'faq_q4' not in html:
                # Find last faq item and insert after
                last_faq = None
                for m in re.finditer(r'(data-i18n="faq_a\d">[^<]*</p></details>)', html):
                    last_faq = m
                if last_faq:
                    pos = last_faq.end()
                    to_add = '\n' + HTML_Q3Q4 if 'faq_q3' not in html else '\n        <details class="help-item"><summary data-i18n="faq_q4">Is my data private?</summary><p data-i18n="faq_a4">Yes. Everything runs locally in your browser.</p></details>'
                    html = html[:pos] + to_add + html[pos:]
                    with open(html_path, 'w', encoding='utf-8') as f:
                        f.write(html)

        fixed += 1
        print(f"✓ {cat_name}/{app_name}")

print(f"\n=== Fixed {fixed} apps ===")
