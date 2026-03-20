#!/usr/bin/env python3
"""Fix FAQ HTML for remaining apps that have non-standard FAQ format.

These apps have FAQ items without data-i18n attributes or with a different structure.
Replace the entire FAQ content div with standardized 8-item FAQ.
"""

import os
import re
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))

def get_faq_from_script(script_path):
    """Extract EN FAQ q/a pairs from script.js."""
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()
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
        continue

    app_dir = os.path.dirname(html_path)
    script_path = os.path.join(app_dir, 'script.js')
    if not os.path.exists(script_path):
        continue

    faqs = get_faq_from_script(script_path)
    if len(faqs) < 8:
        continue

    # Strategy: find the helpFaq div and replace its entire content
    # Pattern: id="helpFaq"> ... </div>
    faq_div = re.search(r'(id="helpFaq"[^>]*>)', html)
    if not faq_div:
        continue

    div_start = faq_div.end()

    # Find the matching closing </div>
    depth = 1
    pos = div_start
    while pos < len(html) and depth > 0:
        next_open = html.find('<div', pos)
        next_close = html.find('</div>', pos)
        if next_close == -1:
            break
        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open + 4
        else:
            depth -= 1
            if depth == 0:
                div_end = next_close
                break
            pos = next_close + 6

    if depth != 0:
        continue

    # Generate new content
    items = []
    for i in range(1, 9):
        q, a = faqs[i]
        items.append(f'<details class="help-item"><summary data-i18n="faq_q{i}">{q}</summary><p data-i18n="faq_a{i}">{a}</p></details>')
    new_content = '\n        '.join(items)

    html = html[:div_start] + '\n        ' + new_content + '\n      ' + html[div_end:]

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    fixed += 1

print(f"✓ Fixed FAQ HTML in {fixed} more apps")
remaining = 0
for p in glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'index.html')):
    with open(p, 'r') as f:
        if 'faq_q8' not in f.read():
            remaining += 1
print(f"Remaining without faq_q8: {remaining}")
