#!/usr/bin/env python3
"""
add_infra.py — Two features for the ops-catalog:
  1. Build search-index.json from all 488 apps
  2. Inject printWorksheet() button + function into every app
"""

import os, sys, json, re, glob

ROOT = os.path.dirname(os.path.abspath(__file__))

# ── Helpers ──────────────────────────────────────────────────────────────

def extract_en_value(script_text, key):
    """Extract a single-quoted or double-quoted value for a key in the EN block of LANG."""
    # Match key: 'value' or key: "value"  (handles escaped quotes)
    pat = re.compile(rf"""\b{re.escape(key)}\s*:\s*(['"])((?:(?!\1).|\\.)*?)\1""")
    # We need to find it inside the EN block.  Locate the EN block first.
    lang_match = re.search(r'const\s+LANG\s*=\s*\{', script_text)
    if not lang_match:
        return ''
    start = lang_match.end()
    # Find the 'en' block – look for   en: {  or  en:{
    en_match = re.search(r'\ben\s*:\s*\{', script_text[start:])
    if not en_match:
        return ''
    en_start = start + en_match.end()
    # Find the next top-level closing of this block by tracking braces
    depth = 1
    pos = en_start
    while pos < len(script_text) and depth > 0:
        ch = script_text[pos]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
        pos += 1
    en_block = script_text[en_start:pos]
    m = pat.search(en_block)
    return m.group(2) if m else ''


def extract_wiki_titles(en_block_text):
    """Pull wiki entry titles from the EN block to use as keywords."""
    titles = []
    for m in re.finditer(r'wiki_\w+_title\s*:\s*[\'"]([^\'"]+)[\'"]', en_block_text):
        # strip emoji
        t = re.sub(r'[\U00010000-\U0010ffff]|[\u2600-\u27bf]|[\ufe00-\ufe0f]|[\U0001f000-\U0001f9ff]', '', m.group(1)).strip()
        if t:
            titles.append(t)
    return titles


def get_en_block(script_text):
    """Return the text of the EN block inside const LANG = { en: { ... } }"""
    lang_match = re.search(r'const\s+LANG\s*=\s*\{', script_text)
    if not lang_match:
        return ''
    start = lang_match.end()
    en_match = re.search(r'\ben\s*:\s*\{', script_text[start:])
    if not en_match:
        return ''
    en_start = start + en_match.end()
    depth = 1
    pos = en_start
    while pos < len(script_text) and depth > 0:
        ch = script_text[pos]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
        pos += 1
    return script_text[en_start:pos]


def build_keywords(cat_dir, app_dir, main_desc, wiki_titles):
    """Build keyword string from category name, app dir, description, wiki titles."""
    parts = []
    # category name words (strip number prefix)
    cat_name = re.sub(r'^\d+-', '', cat_dir)
    parts.extend(cat_name.replace('-', ' ').split())
    # app dir words
    parts.extend(app_dir.replace('-', ' ').split())
    # mainDesc words
    if main_desc:
        parts.extend(re.findall(r'[a-zA-Z]{3,}', main_desc.lower()))
    # wiki titles
    for t in wiki_titles:
        parts.extend(re.findall(r'[a-zA-Z]{3,}', t.lower()))
    # deduplicate, preserve order
    seen = set()
    unique = []
    for w in parts:
        wl = w.lower()
        if wl not in seen:
            seen.add(wl)
            unique.append(wl)
    return ' '.join(unique)


# ── Find all apps ────────────────────────────────────────────────────────

def find_all_apps():
    """Return sorted list of (cat_dir, app_dir, full_path_to_app_dir)."""
    apps = []
    for cat_dir in sorted(os.listdir(ROOT)):
        cat_path = os.path.join(ROOT, cat_dir)
        if not os.path.isdir(cat_path) or not re.match(r'^\d{2}-', cat_dir):
            continue
        for app_dir in sorted(os.listdir(cat_path)):
            app_path = os.path.join(cat_path, app_dir)
            script_path = os.path.join(app_path, 'script.js')
            index_path = os.path.join(app_path, 'index.html')
            if os.path.isdir(app_path) and os.path.isfile(script_path) and os.path.isfile(index_path):
                apps.append((cat_dir, app_dir, app_path))
    return apps


# ── 1. Search Index ──────────────────────────────────────────────────────

def build_search_index(apps):
    index = []
    for cat_dir, app_dir, app_path in apps:
        script_path = os.path.join(app_path, 'script.js')
        with open(script_path, 'r', encoding='utf-8') as f:
            script_text = f.read()

        title = extract_en_value(script_text, 'title')
        main_desc = extract_en_value(script_text, 'mainDesc')
        en_block = get_en_block(script_text)
        wiki_titles = extract_wiki_titles(en_block)
        keywords = build_keywords(cat_dir, app_dir, main_desc, wiki_titles)
        rel_path = f'{cat_dir}/{app_dir}/index.html'

        index.append({
            'title': title,
            'cat': cat_dir,
            'app': app_dir,
            'desc': main_desc,
            'path': rel_path,
            'keywords': keywords
        })

    out_path = os.path.join(ROOT, 'search-index.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=2)
    print(f'[1/2] search-index.json written with {len(index)} entries.')
    return index


# ── 2. Print Worksheet ──────────────────────────────────────────────────

PRINT_BUTTON_HTML = '<button onclick="printWorksheet()" class="btn-sm" style="margin-left:0.5rem;" data-i18n="printBtn">\U0001f5a8\ufe0f Print</button>'

PRINT_FUNCTION = r"""
function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}
""".strip()

LANG_PRINT_KEYS = {
    'en': "printBtn: '\U0001f5a8\ufe0f Print Worksheet'",
    'fr': "printBtn: '\U0001f5a8\ufe0f Imprimer'",
    'ar': "printBtn: '\U0001f5a8\ufe0f \u0637\u0628\u0627\u0639\u0629'",
}


def inject_print_button_html(html_text):
    """Add print button in the first sidebar-footer found."""
    if 'printWorksheet()' in html_text:
        return html_text, False  # already present

    # Find the first sidebar-footer and inject button before </div> that closes it
    # Pattern: <div class="sidebar-footer">...<span ...>...</span></div>
    # We insert the button before the closing </div> of sidebar-footer
    pat = re.compile(r'(<div\s+class="sidebar-footer">)(.*?)(</div>)', re.DOTALL)
    match = pat.search(html_text)
    if not match:
        return html_text, False

    # Insert button after the last </span> inside sidebar-footer but before </div>
    inner = match.group(2)
    new_inner = inner + PRINT_BUTTON_HTML
    new_html = html_text[:match.start()] + match.group(1) + new_inner + match.group(3) + html_text[match.end():]
    return new_html, True


def find_lang_block_end(script_text):
    """Find the position of the closing '};' of const LANG = { ... };
    Returns the position of the semicolon after the closing brace, or -1."""
    lang_match = re.search(r'const\s+LANG\s*=\s*\{', script_text)
    if not lang_match:
        return -1
    start = lang_match.end()
    depth = 1
    pos = start
    while pos < len(script_text) and depth > 0:
        ch = script_text[pos]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
        pos += 1
    # pos now points right after the closing }
    # Look for the semicolon
    if pos < len(script_text) and script_text[pos] == ';':
        return pos + 1  # position right after };
    return pos  # right after }


def inject_printBtn_lang_key(script_text, lang_code, key_str):
    """Insert printBtn key into a specific language block inside const LANG."""
    if 'printBtn' in script_text:
        return script_text  # already has it

    # Find const LANG
    lang_match = re.search(r'const\s+LANG\s*=\s*\{', script_text)
    if not lang_match:
        return script_text

    lang_start = lang_match.end()

    # For each language block, find the right one and add key
    # We'll do all three in one pass by finding each lang block
    result = script_text
    offset = 0

    for lc, ks in LANG_PRINT_KEYS.items():
        # Find the language block: en: { or en:{
        pat = re.compile(rf'\b{lc}\s*:\s*\{{')
        search_start = lang_start + offset
        # Search within the LANG block area
        m = pat.search(result, search_start)
        if not m:
            continue
        block_start = m.end()
        # Find the closing } of this block
        depth = 1
        pos = block_start
        while pos < len(result) and depth > 0:
            ch = result[pos]
            if ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
            pos += 1
        # pos is right after the closing }
        # Insert just before the closing }
        insert_pos = pos - 1
        # Add a comma and the key
        insertion = ',\n    ' + ks
        result = result[:insert_pos] + insertion + result[insert_pos:]
        offset += len(insertion)

    return result


def inject_print_function(script_text):
    """Append printWorksheet function after the LANG block closing."""
    if 'printWorksheet' in script_text:
        return script_text, False

    end_pos = find_lang_block_end(script_text)
    if end_pos == -1:
        return script_text, False

    injection = '\n\n' + PRINT_FUNCTION + '\n'
    result = script_text[:end_pos] + injection + script_text[end_pos:]
    return result, True


def process_print_worksheet(apps):
    modified_html = 0
    modified_js = 0
    skipped = 0
    errors = []

    for cat_dir, app_dir, app_path in apps:
        script_path = os.path.join(app_path, 'script.js')
        index_path = os.path.join(app_path, 'index.html')
        app_label = f'{cat_dir}/{app_dir}'

        try:
            # Read files
            with open(script_path, 'r', encoding='utf-8') as f:
                script_text = f.read()
            with open(index_path, 'r', encoding='utf-8') as f:
                html_text = f.read()

            # Skip if already has printWorksheet
            if 'printWorksheet' in script_text:
                skipped += 1
                continue

            # 1. Inject print button into index.html
            new_html, html_changed = inject_print_button_html(html_text)
            if html_changed:
                with open(index_path, 'w', encoding='utf-8') as f:
                    f.write(new_html)
                modified_html += 1

            # 2. Add printBtn LANG keys
            new_script = inject_printBtn_lang_key(script_text, None, None)

            # 3. Append printWorksheet function
            new_script, js_changed = inject_print_function(new_script)
            if js_changed or new_script != script_text:
                with open(script_path, 'w', encoding='utf-8') as f:
                    f.write(new_script)
                modified_js += 1

        except Exception as e:
            errors.append(f'{app_label}: {e}')

    print(f'[2/2] Print Worksheet: {modified_html} HTML files, {modified_js} JS files modified, {skipped} skipped (already present).')
    if errors:
        print(f'  ERRORS ({len(errors)}):')
        for e in errors:
            print(f'    {e}')


# ── Main ─────────────────────────────────────────────────────────────────

def main():
    apps = find_all_apps()
    print(f'Found {len(apps)} apps in catalog.')

    # 1. Build search index
    build_search_index(apps)

    # 2. Inject print worksheet
    process_print_worksheet(apps)

    # 3. Verify a sample
    print('\n── Verification ──')
    if apps:
        sample = apps[0]
        cat, app, path = sample
        script_path = os.path.join(path, 'script.js')
        index_path = os.path.join(path, 'index.html')

        with open(script_path, 'r', encoding='utf-8') as f:
            s = f.read()
        with open(index_path, 'r', encoding='utf-8') as f:
            h = f.read()

        checks = [
            ('printWorksheet in script.js', 'printWorksheet' in s),
            ('printBtn in script.js', 'printBtn' in s),
            ('printWorksheet() in index.html', 'printWorksheet()' in h),
        ]
        for label, ok in checks:
            status = 'PASS' if ok else 'FAIL'
            print(f'  [{status}] {cat}/{app}: {label}')

    # Check search index
    si_path = os.path.join(ROOT, 'search-index.json')
    if os.path.exists(si_path):
        with open(si_path, 'r', encoding='utf-8') as f:
            si = json.load(f)
        print(f'  [{"PASS" if len(si) == len(apps) else "FAIL"}] search-index.json: {len(si)} entries')
        if si:
            sample_entry = si[0]
            has_title = bool(sample_entry.get('title'))
            has_desc = bool(sample_entry.get('desc'))
            print(f'  [{"PASS" if has_title else "FAIL"}] First entry has title: {sample_entry.get("title", "")[:50]}')
            print(f'  [{"PASS" if has_desc else "FAIL"}] First entry has desc: {sample_entry.get("desc", "")[:60]}')

    # Syntax check: try to parse a few script.js files with a basic check
    print('\n── Syntax spot-check (JS brace balance) ──')
    for sample in apps[:5]:
        cat, app, path = sample
        sp = os.path.join(path, 'script.js')
        with open(sp, 'r', encoding='utf-8') as f:
            text = f.read()
        # Simple brace balance check (not perfect but catches obvious issues)
        opens = text.count('{') + text.count('(') + text.count('[')
        closes = text.count('}') + text.count(')') + text.count(']')
        # Also check that printBtn key is syntactically OK
        has_print_btn = 'printBtn' in text
        status = 'OK' if has_print_btn else 'MISSING printBtn'
        print(f'  {cat}/{app}: braces={opens}/{closes} {status}')


if __name__ == '__main__':
    main()
