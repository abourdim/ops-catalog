#!/usr/bin/env python3
"""Phase 11: i18n deduplication — extract shared template keys into LANG_BASE.

Strategy:
- Identify keys that have IDENTICAL values across 450+ apps (truly shared template text)
- Extract those into a LANG_BASE object defined at the top of each script.js
- Rewrite LANG to use spread: en: {...LANG_BASE.en, ...app-specific}
- This reduces script.js size by ~2-3KB per app without breaking anything

Since apps must work from file://, LANG_BASE is inlined in each script.js
(not loaded externally). The benefit is readability — shared keys are separated
from app-specific customizations.
"""

import os
import re
import glob
from collections import Counter, defaultdict

ROOT = os.path.dirname(os.path.abspath(__file__))


def extract_lang_block(content, lang):
    """Extract a language block's key-value pairs."""
    lang_start = re.search(rf'\b{lang}\s*:\s*\{{', content)
    if not lang_start:
        return {}, -1, -1

    start = lang_start.end()
    depth = 1
    pos = start
    while pos < len(content) and depth > 0:
        if content[pos] == '{': depth += 1
        elif content[pos] == '}': depth -= 1
        pos += 1

    block = content[lang_start.start():pos]

    pairs = {}
    for m in re.finditer(r"(\w+)\s*:\s*'((?:[^'\\]|\\.)*)'", block):
        pairs[m.group(1)] = m.group(2)

    return pairs, lang_start.start(), pos


# ── Step 1: Find truly shared keys (identical value in 450+ apps) ──
print("Analyzing shared i18n keys across all apps...")

key_values = defaultdict(Counter)  # key -> {value: count}

all_scripts = sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'script.js')))

for script_path in all_scripts:
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()
    en_pairs, _, _ = extract_lang_block(content, 'en')
    for k, v in en_pairs.items():
        key_values[k][v] += 1

# Keys where one value dominates (450+ out of 488)
THRESHOLD = 450
shared_keys_en = {}
for key, value_counts in key_values.items():
    most_common_val, count = value_counts.most_common(1)[0]
    if count >= THRESHOLD:
        shared_keys_en[key] = most_common_val

# Exclude keys that are app-specific by nature
EXCLUDE_KEYS = {'title', 'subtitle', 'mainSection', 'mainDesc',
                'step1Title', 'step1Desc', 'step2Title', 'step2Desc',
                'step3Title', 'step3Desc', 'step4Title', 'step4Desc',
                'faq_q1', 'faq_a1', 'faq_q2', 'faq_a2', 'faq_q3', 'faq_a3',
                'faq_q4', 'faq_a4', 'faq_q5', 'faq_a5', 'faq_q6', 'faq_a6',
                'faq_q7', 'faq_a7', 'faq_q8', 'faq_a8',
                'learn1Title', 'learn1Desc', 'learn1Tag',
                'learn2Title', 'learn2Desc', 'learn2Tag',
                'learn3Title', 'learn3Desc', 'learn3Tag',
                'learn4Title', 'learn4Desc', 'learn4Tag',
                'learnLevelVal', 'learnTimeVal', 'learnAgeVal',
                'demo_s1', 'demo_s2', 'demo_s3', 'demo_s4', 'demo_s5',
                'btn1', 'btn2', 'btn3',
                'metric1Label', 'metric1Desc', 'metric2Label', 'metric2Desc',
                'sectionA', 'sectionB', 'sectionC',
                'howStep1', 'howStep2', 'howStep3', 'howStep4',
                'howItWorks1', 'howItWorks2', 'howItWorks3', 'howItWorks4',
                'wiki_t1', 'wiki_d1', 'wiki_t2', 'wiki_d2',
                }

for k in EXCLUDE_KEYS:
    shared_keys_en.pop(k, None)

print(f"Found {len(shared_keys_en)} shared template keys (identical in {THRESHOLD}+ apps)")

# Now get FR and AR shared values too
shared_keys_fr = {}
shared_keys_ar = {}

# Sample from first app that has all shared keys
sample_script = all_scripts[0]
with open(sample_script, 'r', encoding='utf-8') as f:
    sample_content = f.read()

fr_pairs, _, _ = extract_lang_block(sample_content, 'fr')
ar_pairs, _, _ = extract_lang_block(sample_content, 'ar')

for k in shared_keys_en:
    if k in fr_pairs:
        shared_keys_fr[k] = fr_pairs[k]
    if k in ar_pairs:
        shared_keys_ar[k] = ar_pairs[k]

# ── Step 2: Generate LANG_BASE block ──
def format_pairs(pairs):
    items = []
    for k, v in sorted(pairs.items()):
        v_esc = v.replace("'", "\\'")
        items.append(f"    {k}:'{v_esc}'")
    return ',\n'.join(items)

LANG_BASE = f"""// ── Shared i18n keys (template) ──
const LANG_BASE = {{
  en: {{
{format_pairs(shared_keys_en)}
  }},
  fr: {{
{format_pairs(shared_keys_fr)}
  }},
  ar: {{
{format_pairs(shared_keys_ar)}
  }}
}};
"""

# ── Step 3: Process each app ──
print("Processing apps...")
fixed = 0

for script_path in all_scripts:
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'LANG_BASE' in content:
        continue  # Already processed

    # Find LANG declaration
    lang_match = re.search(r'const LANG\s*=\s*\{', content)
    if not lang_match:
        continue

    # Insert LANG_BASE before LANG
    insert_pos = lang_match.start()
    new_content = content[:insert_pos] + LANG_BASE + '\n' + content[insert_pos:]

    # Now modify LANG to use spread syntax for each language
    # We need to add ...LANG_BASE.xx as first entry in each lang block
    for lang in ['en', 'fr', 'ar']:
        # Find "lang: {" in the LANG object (after LANG_BASE insertion)
        # Be careful to find it within the LANG object, not LANG_BASE
        lang_in_lang_obj = re.search(
            rf'(const LANG\s*=\s*\{{[^}}]*?\b{lang}\s*:\s*\{{)',
            new_content,
            re.DOTALL
        )
        if not lang_in_lang_obj:
            # Try simpler: find the lang block after "const LANG = {"
            lang_obj_start = new_content.find('const LANG = {', new_content.find('LANG_BASE'))
            if lang_obj_start < 0:
                continue
            lang_block = re.search(rf'\b{lang}\s*:\s*\{{', new_content[lang_obj_start:])
            if not lang_block:
                continue
            abs_pos = lang_obj_start + lang_block.end()
        else:
            abs_pos = lang_in_lang_obj.end()

        # Check if spread already exists
        after = new_content[abs_pos:abs_pos+30]
        if '...LANG_BASE' in after:
            continue

        # Insert spread
        spread = f'...LANG_BASE.{lang},'
        new_content = new_content[:abs_pos] + '\n    ' + spread + new_content[abs_pos:]

    if new_content != content:
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        fixed += 1
        if fixed % 50 == 0:
            print(f"  ... processed {fixed} apps")

print(f"\n✓ Added LANG_BASE deduplication to {fixed} apps")
print(f"  {len(shared_keys_en)} shared keys extracted per language")
