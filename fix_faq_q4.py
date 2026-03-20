#!/usr/bin/env python3
"""Phase 0B: Add missing faq_q4 to apps that only have 3 FAQ items."""

import os
import re
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))

FAQ_Q4 = {
    'en': ("faq_q4:'Is my data private?', faq_a4:'Yes. Everything runs locally in your browser. "
           "No data is sent anywhere. Your experiments stay on your device.'"),
    'fr': ("faq_q4:'Mes données sont-elles privées ?', faq_a4:'Oui. Tout fonctionne localement "
           "dans ton navigateur. Aucune donnée n\\'est envoyée nulle part.'"),
    'ar': ("faq_q4:'هل بياناتي خاصة؟', faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك. "
           "لا يتم إرسال أي بيانات إلى أي مكان.'"),
}

HTML_FAQ_Q4 = ('        <details class="help-item"><summary data-i18n="faq_q4">'
               'Is my data private?</summary><p data-i18n="faq_a4">'
               'Yes. Everything runs locally in your browser. No data is sent anywhere.</p></details>')

fixed_count = 0
errors = []

# Find all script.js files missing faq_q4
for script_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'script.js'))):
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'faq_q4' in content:
        continue  # Already has faq_q4

    if 'faq_q3' not in content:
        continue  # No FAQ at all, skip

    app_dir = os.path.dirname(script_path)
    app_name = os.path.basename(app_dir)
    cat_name = os.path.basename(os.path.dirname(app_dir))

    # --- Fix script.js ---
    # Insert faq_q4 after faq_q3/faq_a3 for each language block
    new_content = content

    # For each language, find faq_a3 line and append faq_q4 after it
    for lang_key, faq_line in FAQ_Q4.items():
        # Match the faq_a3 line (ends with quote + comma or quote + newline)
        pattern = r"(faq_a3:'[^']*')"
        matches = list(re.finditer(pattern, new_content))
        if not matches:
            pattern = r'(faq_a3:"[^"]*")'
            matches = list(re.finditer(pattern, new_content))

        # We need to insert after each faq_a3 occurrence (one per language)
        # Process in reverse to maintain positions
        if lang_key == 'en' and len(matches) >= 1:
            m = matches[0]
            insert_pos = m.end()
            # Check if there's a comma after
            rest = new_content[insert_pos:]
            if rest and rest[0] == ',':
                new_content = new_content[:insert_pos+1] + '\n    ' + faq_line + ',' + new_content[insert_pos+1:]
            else:
                new_content = new_content[:insert_pos] + ',\n    ' + faq_line + new_content[insert_pos:]
        elif lang_key == 'fr' and len(matches) >= 2:
            m = matches[1]
            insert_pos = m.end()
            rest = new_content[insert_pos:]
            if rest and rest[0] == ',':
                new_content = new_content[:insert_pos+1] + '\n    ' + faq_line + ',' + new_content[insert_pos+1:]
            else:
                new_content = new_content[:insert_pos] + ',\n    ' + faq_line + new_content[insert_pos:]
        elif lang_key == 'ar' and len(matches) >= 3:
            m = matches[2]
            insert_pos = m.end()
            rest = new_content[insert_pos:]
            if rest and rest[0] == ',':
                new_content = new_content[:insert_pos+1] + '\n    ' + faq_line + ',' + new_content[insert_pos+1:]
            else:
                new_content = new_content[:insert_pos] + ',\n    ' + faq_line + new_content[insert_pos:]

    if new_content != content:
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
    else:
        errors.append(f"WARN: Could not inject faq_q4 into {cat_name}/{app_name}/script.js")
        continue

    # --- Fix index.html ---
    html_path = os.path.join(app_dir, 'index.html')
    if os.path.exists(html_path):
        with open(html_path, 'r', encoding='utf-8') as f:
            html = f.read()

        if 'faq_q4' not in html and 'faq_q3' in html:
            # Insert after the last faq_q3 details element
            html = html.replace(
                '</details>\n      </div><!-- end faq -->',
                '</details>\n' + HTML_FAQ_Q4 + '\n      </div><!-- end faq -->'
            )
            # Try alternative pattern if the above didn't match
            if 'faq_q4' not in html:
                # Find the last faq_a3 closing tag and insert after it
                pattern = r'(data-i18n="faq_a3">[^<]*</p></details>)'
                match = re.search(pattern, html)
                if match:
                    insert_pos = match.end()
                    html = html[:insert_pos] + '\n' + HTML_FAQ_Q4 + html[insert_pos:]

            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(html)

    fixed_count += 1
    print(f"✓ {cat_name}/{app_name}")

print(f"\n=== Fixed {fixed_count} apps ===")
if errors:
    print(f"\n=== {len(errors)} warnings ===")
    for e in errors:
        print(e)
