#!/usr/bin/env python3
"""Fix step descriptions in FR/AR blocks that incorrectly contain EN text.

The add_how_it_works.py script extracted existing howStep content but didn't
properly separate by language block, so FR and AR blocks got EN descriptions
with translated titles. This script fixes the FR and AR step descriptions
for apps that had existing howStep content.
"""

import os
import re
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))


def find_lang_block_range(content, lang):
    """Find the start and end positions of a language block in the LANG object."""
    lang_start = re.search(rf'\b{lang}\s*:\s*\{{', content)
    if not lang_start:
        return None, None
    start = lang_start.end()
    depth = 1
    pos = start
    while pos < len(content) and depth > 0:
        if content[pos] == '{':
            depth += 1
        elif content[pos] == '}':
            depth -= 1
        pos += 1
    return lang_start.start(), pos  # start of "lang:{" to after closing "}"


def get_step_descs_in_block(block_text):
    """Extract step descriptions from a language block."""
    descs = {}
    for i in range(1, 5):
        m = re.search(rf"step{i}Desc\s*:\s*'((?:[^'\\]|\\.)*)'", block_text)
        if m:
            descs[i] = m.group(1)
    return descs


def get_howstep_descs_in_block(block_text):
    """Extract howStep descriptions from a language block."""
    descs = {}
    for i in range(1, 5):
        m = re.search(rf"howStep{i}\s*:\s*'((?:[^'\\]|\\.)*)'", block_text)
        if m:
            descs[i] = m.group(1)
    return descs


fixed = 0

for script_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'script.js'))):
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'step1Title' not in content:
        continue

    # Check if FR block has EN text in step descriptions
    # Get EN block's step descriptions
    en_start, en_end = find_lang_block_range(content, 'en')
    fr_start, fr_end = find_lang_block_range(content, 'fr')
    ar_start, ar_end = find_lang_block_range(content, 'ar')

    if en_start is None or fr_start is None:
        continue

    en_block = content[en_start:en_end]
    fr_block = content[fr_start:fr_end]

    en_descs = get_step_descs_in_block(en_block)
    fr_descs = get_step_descs_in_block(fr_block)

    if not en_descs or not fr_descs:
        continue

    # Check if FR descriptions are same as EN (wrong!)
    needs_fix = False
    for i in range(1, 5):
        if i in en_descs and i in fr_descs:
            if en_descs[i] == fr_descs[i] and not en_descs[i].startswith(('L\'', 'Le ', 'La ', 'Les ', 'Un ', 'Une ')):
                needs_fix = True
                break

    if not needs_fix:
        continue

    # Get the original howStep content from FR and AR blocks (if it exists)
    fr_howstep = get_howstep_descs_in_block(fr_block)

    ar_block = content[ar_start:ar_end] if ar_start is not None else ''
    ar_howstep = get_howstep_descs_in_block(ar_block)
    ar_descs = get_step_descs_in_block(ar_block)

    new_content = content

    # Fix FR block: replace EN step descriptions with FR howStep content
    for i in range(1, 5):
        if i in fr_howstep and fr_howstep[i] != en_descs.get(i, ''):
            # Replace in FR block only
            old_pattern = f"step{i}Desc:'{re.escape(fr_descs[i])}'"
            # Find this pattern specifically in the FR block area
            fr_s, fr_e = find_lang_block_range(new_content, 'fr')
            if fr_s is not None:
                fr_text = new_content[fr_s:fr_e]
                new_fr_desc = fr_howstep[i].replace("'", "\\'")
                new_text = re.sub(
                    rf"step{i}Desc:'(?:[^'\\]|\\.)*'",
                    f"step{i}Desc:'{new_fr_desc}'",
                    fr_text,
                    count=1
                )
                new_content = new_content[:fr_s] + new_text + new_content[fr_e:]

    # Fix AR block
    for i in range(1, 5):
        if i in ar_howstep and ar_howstep[i] != en_descs.get(i, ''):
            ar_s, ar_e = find_lang_block_range(new_content, 'ar')
            if ar_s is not None:
                ar_text = new_content[ar_s:ar_e]
                new_ar_desc = ar_howstep[i].replace("'", "\\'")
                new_text = re.sub(
                    rf"step{i}Desc:'(?:[^'\\]|\\.)*'",
                    f"step{i}Desc:'{new_ar_desc}'",
                    ar_text,
                    count=1
                )
                new_content = new_content[:ar_s] + new_text + new_content[ar_e:]

    if new_content != content:
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        fixed += 1

print(f"✓ Fixed FR/AR step descriptions in {fixed} apps")
