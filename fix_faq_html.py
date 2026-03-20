#!/usr/bin/env python3
"""Fix FAQ HTML for apps where gen_faq.py couldn't replace (different HTML structure).

Some apps have FAQ items with different formatting (multiline, indented differently).
This script replaces any existing FAQ items with the standard 8-item format,
pulling the EN text from script.js.
"""

import os
import re
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))

def get_faq_from_script(script_path):
    """Extract EN FAQ q/a pairs from script.js."""
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find EN block
    en_start = re.search(r'\ben\s*:\s*\{', content)
    if not en_start:
        return {}

    start = en_start.end()
    depth = 1
    pos = start
    while pos < len(content) and depth > 0:
        if content[pos] == '{': depth += 1
        elif content[pos] == '}': depth -= 1
        pos += 1
    block = content[en_start.start():pos]

    faqs = {}
    for i in range(1, 9):
        q_m = re.search(rf"faq_q{i}\s*:\s*'((?:[^'\\]|\\.)*)'", block)
        a_m = re.search(rf"faq_a{i}\s*:\s*'((?:[^'\\]|\\.)*)'", block)
        if q_m and a_m:
            faqs[i] = (q_m.group(1).replace("\\'", "'"), a_m.group(1).replace("\\'", "'"))

    return faqs


fixed = 0

for html_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'index.html'))):
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    if 'faq_q8' in html:
        continue  # Already has 8 items

    if 'faq_q1' not in html:
        continue  # No FAQ section at all

    app_dir = os.path.dirname(html_path)
    script_path = os.path.join(app_dir, 'script.js')
    if not os.path.exists(script_path):
        continue

    faqs = get_faq_from_script(script_path)
    if len(faqs) < 8:
        continue

    # Find all FAQ items in HTML and replace them
    # Match from first faq_q to last faq_a details block
    # Use a broad pattern that handles different formatting

    # Find the FAQ container region
    first_faq = re.search(r'(\s*)<(details|div)[^>]*>.*?data-i18n="faq_q1"', html, re.DOTALL)
    if not first_faq:
        continue

    indent = first_faq.group(1)
    start_pos = first_faq.start()

    # Find the last FAQ item
    last_faq_end = start_pos
    for i in range(1, 9):
        for m in re.finditer(rf'data-i18n="faq_a{i}"[^<]*</p>\s*</details>', html):
            if m.end() > last_faq_end:
                last_faq_end = m.end()

    if last_faq_end <= start_pos:
        # Try broader pattern
        for m in re.finditer(r'</details>', html[start_pos:]):
            candidate = start_pos + m.end()
            remaining = html[candidate:candidate+200]
            if 'faq_q' not in remaining and ('help-content' in remaining or '</div>' in remaining[:50]):
                last_faq_end = candidate
                break
        if last_faq_end <= start_pos:
            continue

    # Generate new FAQ HTML
    items = []
    for i in range(1, 9):
        q, a = faqs[i]
        items.append(f'        <details class="help-item"><summary data-i18n="faq_q{i}">{q}</summary><p data-i18n="faq_a{i}">{a}</p></details>')

    new_faq = '\n'.join(items)

    html = html[:start_pos] + '\n' + new_faq + html[last_faq_end:]

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)

    fixed += 1

print(f"✓ Fixed FAQ HTML in {fixed} apps")
print(f"Total with faq_q8 in HTML: {fixed + 242}")
