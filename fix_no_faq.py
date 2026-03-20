#!/usr/bin/env python3
"""Fix apps that have NO FAQ keys at all - add 4 standard FAQ items."""

import os
import re
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))

FAQ_KEYS = {
    'en': "faq_q1:'What is this app?',faq_a1:'An interactive educational simulation from Workshop-DIY. Explore, experiment, and learn!',faq_q2:'How do I use it?',faq_a2:'Use the controls in the main section. Try different settings and watch what happens.',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick a theme. There are 8 to choose from.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.'",
    'fr': "faq_q1:'C\\'est quoi cette appli?',faq_a1:'Une simulation educative interactive de Workshop-DIY. Explore, experimente et apprends!',faq_q2:'Comment l\\'utiliser?',faq_a2:'Utilise les controles dans la section principale. Essaie differents reglages.',faq_q3:'Puis-je changer le theme?',faq_a3:'Oui! Ouvre les Parametres et choisis un theme. Il y en a 8.',faq_q4:'Mes donnees sont-elles privees?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.'",
    'ar': "faq_q1:'ما هذا التطبيق؟',faq_a1:'محاكاة تعليمية تفاعلية من Workshop-DIY. استكشف وجرب وتعلم!',faq_q2:'كيف أستخدمه؟',faq_a2:'استخدم عناصر التحكم في القسم الرئيسي. جرب إعدادات مختلفة.',faq_q3:'هل يمكنني تغيير السمة؟',faq_a3:'نعم! افتح الإعدادات واختر سمة. هناك 8 سمات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.'"
}

HTML_FAQ = """        <details class="help-item"><summary data-i18n="faq_q1">What is this app?</summary><p data-i18n="faq_a1">An interactive educational simulation from Workshop-DIY.</p></details>
        <details class="help-item"><summary data-i18n="faq_q2">How do I use it?</summary><p data-i18n="faq_a2">Use the controls in the main section. Try different settings and watch what happens.</p></details>
        <details class="help-item"><summary data-i18n="faq_q3">Can I change the theme?</summary><p data-i18n="faq_a3">Yes! Open Settings and pick a theme.</p></details>
        <details class="help-item"><summary data-i18n="faq_q4">Is my data private?</summary><p data-i18n="faq_a4">Yes. Everything runs locally in your browser. No data is sent anywhere.</p></details>"""

fixed = 0

for script_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'script.js'))):
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'faq_q1' in content:
        continue  # Already has FAQ

    app_dir = os.path.dirname(script_path)
    app_name = os.path.basename(app_dir)
    cat_name = os.path.basename(os.path.dirname(app_dir))

    # Find each language block in LANG and append FAQ keys
    # Pattern: look for the closing of each lang block
    # The LANG is typically: const LANG = { en:{...}, fr:{...}, ar:{...} }

    new_content = content

    # For compact single-line format: en:{...}, fr:{...}, ar:{...}
    for lang in ['en', 'fr', 'ar']:
        # Find the lang block - match the last key-value before closing brace
        # Look for pattern like: someKey:'value'} or someKey:'value' }
        # We want to insert before the closing } of the lang block

        # Find "lang:{" and then the matching "}"
        lang_start = re.search(rf'\b{lang}\s*:\s*\{{', new_content)
        if not lang_start:
            continue

        # Find the closing brace by counting braces
        start = lang_start.end()
        depth = 1
        pos = start
        while pos < len(new_content) and depth > 0:
            if new_content[pos] == '{':
                depth += 1
            elif new_content[pos] == '}':
                depth -= 1
            pos += 1

        # pos is now after the closing }
        close_pos = pos - 1  # Position of closing }

        # Insert FAQ keys before the closing }
        insert = ',' + FAQ_KEYS[lang]
        new_content = new_content[:close_pos] + insert + new_content[close_pos:]

    if new_content != content:
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        # Also fix index.html - add FAQ items if missing
        html_path = os.path.join(app_dir, 'index.html')
        if os.path.exists(html_path):
            with open(html_path, 'r', encoding='utf-8') as f:
                html = f.read()

            if 'faq_q1' not in html:
                # Find the FAQ help-content div and insert FAQ items
                # Pattern: <div class="help-content" ... data-help="faq"> or similar
                faq_div = re.search(r'(data-help="faq"[^>]*>)', html)
                if faq_div:
                    insert_pos = faq_div.end()
                    html = html[:insert_pos] + '\n' + HTML_FAQ + '\n' + html[insert_pos:]
                    with open(html_path, 'w', encoding='utf-8') as f:
                        f.write(html)

        fixed += 1
        print(f"✓ {cat_name}/{app_name}")

print(f"\n=== Fixed {fixed} apps (added 4 FAQ items) ===")
