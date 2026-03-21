#!/usr/bin/env python3
"""
add_crosslinks.py — Add Related Apps and Learning Path sections to all apps in ops-catalog.

For each app:
  1. Adds LANG keys for related apps (3 from related categories) and learning path (prev/next in same category)
  2. Inserts HTML blocks for Related Apps and Learning Path in index.html
  3. Adds a JS snippet to wire up links
"""

import os
import re
import hashlib
import sys

BASE = os.path.dirname(os.path.abspath(__file__))

# ── Category relationship groups ──
CATEGORY_GROUPS = {
    'spy_covert': ['01', '02', '03', '40', '55'],
    'rf_sdr': ['04', '07', '09', '10', '11', '12', '13', '27', '28', '29', '30', '31', '32', '33', '34', '54'],
    'wifi': ['14', '15', '16', '17'],
    'iot_wireless': ['18', '19', '20', '21', '22', '23'],
    'network': ['05', '06', '08', '50'],
    'security': ['37', '51', '52', '53', '54'],
    'science': ['43', '44', '45', '46', '47'],
    'crypto': ['38', '39', '53'],
    'other': ['24', '25', '26', '35', '36', '41', '42', '48', '49'],
}

# Build reverse lookup: category_num -> list of related category nums (excluding self)
def build_related_categories():
    cat_to_groups = {}
    for group_name, cats in CATEGORY_GROUPS.items():
        for c in cats:
            if c not in cat_to_groups:
                cat_to_groups[c] = set()
            cat_to_groups[c].update(cats)
    # For each cat, related = all cats in its groups minus itself
    related = {}
    for c, group_cats in cat_to_groups.items():
        related[c] = sorted(group_cats - {c})
    return related

RELATED_CATS = build_related_categories()


def get_category_num(cat_dir_name):
    """Extract category number like '01' from '01-spy-microbit'."""
    m = re.match(r'^(\d{2})-', cat_dir_name)
    return m.group(1) if m else None


def scan_apps():
    """Scan all categories and apps, return list of app info dicts."""
    apps = []
    for entry in sorted(os.listdir(BASE)):
        cat_path = os.path.join(BASE, entry)
        if not os.path.isdir(cat_path):
            continue
        cat_num = get_category_num(entry)
        if cat_num is None:
            continue
        for app_name in sorted(os.listdir(cat_path)):
            app_path = os.path.join(cat_path, app_name)
            script_path = os.path.join(app_path, 'script.js')
            index_path = os.path.join(app_path, 'index.html')
            if not os.path.isfile(script_path) or not os.path.isfile(index_path):
                continue
            # Extract title and mainDesc from script.js
            try:
                with open(script_path, 'r', encoding='utf-8', errors='replace') as f:
                    js_content = f.read()
            except:
                continue

            info = {
                'cat_num': cat_num,
                'cat_dir': entry,
                'app_name': app_name,
                'app_path': app_path,
                'script_path': script_path,
                'index_path': index_path,
                'rel_dir': f'{entry}/{app_name}',  # e.g. "01-spy-microbit/bit-agent-id"
            }

            # Extract EN title and mainDesc
            info['en_title'] = extract_lang_field(js_content, 'en', 'mainSection') or app_name
            info['en_desc'] = extract_lang_field(js_content, 'en', 'mainDesc') or ''
            info['fr_title'] = extract_lang_field(js_content, 'fr', 'mainSection') or info['en_title']
            info['fr_desc'] = extract_lang_field(js_content, 'fr', 'mainDesc') or info['en_desc']
            info['ar_title'] = extract_lang_field(js_content, 'ar', 'mainSection') or info['en_title']
            info['ar_desc'] = extract_lang_field(js_content, 'ar', 'mainDesc') or info['en_desc']

            apps.append(info)
    return apps


def extract_lang_field(js_content, lang, field):
    """Extract a field value from the LANG object for a given language."""
    # Try to find the field in the language block
    # Pattern: field:'value' or field:"value"
    # We need to find the right language section first
    # Look for patterns like:  mainDesc:'...' or mainDesc:"..."
    # Since fields can be on same line, search broadly

    # Strategy: find all occurrences of field:'...' and pick the one in the right lang block
    # Simple approach: find all mainDesc values, assign by order (en=0, fr=1, ar=2)
    pattern = re.compile(rf"""{field}\s*:\s*(['"])((?:(?!\1).|\\.)*?)\1""")
    matches = list(pattern.finditer(js_content))
    lang_idx = {'en': 0, 'fr': 1, 'ar': 2}
    idx = lang_idx.get(lang, 0)
    if idx < len(matches):
        return matches[idx].group(2).replace("\\'", "'").replace('\\"', '"')
    return None


def deterministic_pick(app_path, candidates, n=3):
    """Pick n items from candidates deterministically based on app_path hash."""
    if not candidates:
        return []
    h = hashlib.md5(app_path.encode()).hexdigest()
    seed = int(h, 16)
    # Shuffle deterministically
    indexed = list(enumerate(candidates))
    indexed.sort(key=lambda x: hashlib.md5(f"{h}_{x[0]}".encode()).hexdigest())
    return [item for _, item in indexed[:n]]


def compute_relative_path(from_app, to_app):
    """Compute relative path from one app to another's index.html."""
    # from: cat_dir/app_name/  -> to: cat_dir/app_name/index.html
    # relative: ../../to_cat_dir/to_app_name/index.html
    return f"../../{to_app['cat_dir']}/{to_app['app_name']}/index.html"


def js_escape(s):
    """Escape string for JS single-quoted string."""
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n').replace('\r', '')


SETUP_LINKS_SNIPPET = """function setupLinks(){const L=LANG[document.documentElement.lang||'en'];['related1','related2','related3'].forEach(k=>{const a=document.getElementById(k+'Link');if(a&&L[k+'_path'])a.href=L[k+'_path'];});const pp=document.getElementById('pathPrevLink'),pn=document.getElementById('pathNextLink');if(pp&&L.pathPrev_path)pp.href=L.pathPrev_path;if(pn&&L.pathNext_path)pn.href=L.pathNext_path;if(pp&&!L.pathPrev_path)document.getElementById('pathPrevP').style.display='none';if(pn&&!L.pathNext_path)document.getElementById('pathNextP').style.display='none';}document.addEventListener('DOMContentLoaded',setupLinks);"""

HTML_BLOCK = """<div class="wiki-entry" id="relatedBlock"><h3 data-i18n="relatedTitle">🔗 Related Apps</h3>
<div class="related-app"><a id="related1Link" href="#"><strong data-i18n="related1_name">App</strong></a><p data-i18n="related1_desc" style="font-size:0.8rem;opacity:0.7;margin:0;">Description</p></div>
<div class="related-app"><a id="related2Link" href="#"><strong data-i18n="related2_name">App</strong></a><p data-i18n="related2_desc" style="font-size:0.8rem;opacity:0.7;margin:0;">Description</p></div>
<div class="related-app"><a id="related3Link" href="#"><strong data-i18n="related3_name">App</strong></a><p data-i18n="related3_desc" style="font-size:0.8rem;opacity:0.7;margin:0;">Description</p></div></div>
<div class="wiki-entry" id="pathBlock"><h3 data-i18n="pathTitle">🛤️ Learning Path</h3>
<p id="pathPrevP" style="margin:0.3rem 0;"><span style="opacity:0.6;">← Previous:</span> <a id="pathPrevLink" href="#" data-i18n="pathPrev_name">...</a></p>
<p id="pathNextP" style="margin:0.3rem 0;"><span style="opacity:0.6;">Next →</span> <a id="pathNextLink" href="#" data-i18n="pathNext_name">...</a></p></div>"""


def build_lang_keys(app, related_apps, prev_app, next_app):
    """Build the LANG key strings to inject for en, fr, ar."""
    keys = {}
    for lang in ('en', 'fr', 'ar'):
        title_key = f'{lang}_title'
        desc_key = f'{lang}_desc'
        lines = []
        if lang == 'en':
            lines.append("relatedTitle:'\\ud83d\\udd17 Related Apps'")
        elif lang == 'fr':
            lines.append("relatedTitle:'\\ud83d\\udd17 Apps Similaires'")
        else:
            lines.append("relatedTitle:'\\ud83d\\udd17 تطبيقات ذات صلة'")

        for i, rel in enumerate(related_apps, 1):
            name_val = js_escape(rel.get(title_key, rel['en_title']))
            desc_val = js_escape(rel.get(desc_key, rel['en_desc']))
            path_val = compute_relative_path(app, rel)
            lines.append(f"related{i}_name:'{name_val}'")
            lines.append(f"related{i}_desc:'{desc_val}'")
            lines.append(f"related{i}_path:'{path_val}'")

        # Fill missing related slots with empty
        for i in range(len(related_apps) + 1, 4):
            lines.append(f"related{i}_name:''")
            lines.append(f"related{i}_desc:''")
            lines.append(f"related{i}_path:''")

        if lang == 'en':
            lines.append("pathTitle:'\\ud83d\\udee4\\ufe0f Learning Path'")
        elif lang == 'fr':
            lines.append("pathTitle:'\\ud83d\\udee4\\ufe0f Parcours'")
        else:
            lines.append("pathTitle:'\\ud83d\\udee4\\ufe0f مسار التعلم'")

        if prev_app:
            lines.append(f"pathPrev_name:'{js_escape(prev_app.get(title_key, prev_app['en_title']))}'")
            lines.append(f"pathPrev_path:'{compute_relative_path(app, prev_app)}'")
        else:
            lines.append("pathPrev_name:''")
            lines.append("pathPrev_path:''")

        if next_app:
            lines.append(f"pathNext_name:'{js_escape(next_app.get(title_key, next_app['en_title']))}'")
            lines.append(f"pathNext_path:'{compute_relative_path(app, next_app)}'")
        else:
            lines.append("pathNext_name:''")
            lines.append("pathNext_path:''")

        keys[lang] = ','.join(lines)
    return keys


def inject_lang_keys(js_content, lang_keys):
    """Inject new keys into the LANG object in script.js.
    Handles both LANG_BASE.en spread and direct en:{} patterns.
    """
    # Strategy: find the closing of each language block (en, fr, ar) inside LANG
    # and insert our keys before the closing

    # Find the LANG = { or LANG={ declaration
    lang_start = re.search(r'const\s+LANG\s*=\s*\{', js_content)
    if not lang_start:
        return None

    start_pos = lang_start.start()

    # We need to find the three language blocks and insert before their closing
    # Pattern: we look for learnAge:'...'} or glossTitle:'...'} as the last key before block close
    # More robust: find each lang block opening and its matching close

    result = js_content
    # Process in reverse order (ar, fr, en) to preserve positions
    for lang in ('ar', 'fr', 'en'):
        keys_str = lang_keys[lang]
        # Find the lang block inside LANG (after start_pos)
        # Look for patterns like:  en:{ or en :{ or en: {
        block_pattern = re.compile(rf'(\b{lang}\s*:\s*\{{)', re.MULTILINE)
        matches = list(block_pattern.finditer(result, start_pos))
        if not matches:
            continue

        # Take the first match after LANG start
        block_match = matches[0]
        block_start = block_match.end()  # position right after the opening {

        # Find the matching closing } by counting braces
        depth = 1
        pos = block_start
        while pos < len(result) and depth > 0:
            if result[pos] == '{':
                depth += 1
            elif result[pos] == '}':
                depth -= 1
            pos += 1

        # pos is now right after the closing }
        close_pos = pos - 1  # position of closing }

        # Insert our keys before the closing }
        # Check if there's a comma before
        before_close = result[:close_pos].rstrip()
        if before_close and before_close[-1] not in (',', '{'):
            insert_str = ',' + keys_str
        else:
            insert_str = keys_str

        result = result[:close_pos] + insert_str + result[close_pos:]

    return result


def inject_html(html_content):
    """Insert the Related Apps and Learning Path HTML before the first sidebar-footer with 'Workshop DIY'."""
    # Try two patterns: old template and new template
    markers = [
        '<div class="sidebar-footer"><span>Workshop DIY</span><span class="badge">',
        '<div class="sidebar-footer"><span>Workshop DIY</span>',
        '<div class="sidebar-footer"><span>Workshop DIY v1.0</span>',
    ]
    for marker in markers:
        idx = html_content.find(marker)
        if idx != -1:
            return html_content[:idx] + HTML_BLOCK + html_content[idx:]

    # Fallback for templates without sidebar-footer: insert before the </aside> that closes the help panel
    # The help panel aside contains id="helpPanel"
    help_marker = 'id="helpPanel"'
    hp_idx = html_content.find(help_marker)
    if hp_idx != -1:
        # Find the closing </aside> for this panel
        # Search for </aside> after the help panel start
        close_aside = '</aside>'
        ca_idx = html_content.find(close_aside, hp_idx)
        if ca_idx != -1:
            return html_content[:ca_idx] + HTML_BLOCK + html_content[ca_idx:]

    return None


def inject_js_snippet(js_content):
    """Add the setupLinks function at the end of script.js."""
    return js_content.rstrip() + '\n' + SETUP_LINKS_SNIPPET + '\n'


def main():
    print("Scanning apps...")
    apps = scan_apps()
    print(f"Found {len(apps)} apps")

    # Build category -> apps mapping
    cat_apps = {}
    for app in apps:
        cat_apps.setdefault(app['cat_num'], []).append(app)

    # Sort apps within each category alphabetically
    for cat_num in cat_apps:
        cat_apps[cat_num].sort(key=lambda a: a['app_name'])

    # Build all apps by cat for related lookups
    all_by_cat = {}
    for app in apps:
        all_by_cat.setdefault(app['cat_num'], []).append(app)

    modified = 0
    skipped = 0
    errors = 0

    for app in apps:
        # Check if already processed
        try:
            with open(app['script_path'], 'r', encoding='utf-8', errors='replace') as f:
                js_content = f.read()
        except Exception as e:
            print(f"  ERROR reading {app['script_path']}: {e}")
            errors += 1
            continue

        if 'related1_name' in js_content:
            skipped += 1
            continue

        # ── Find related apps (from other categories) ──
        cat_num = app['cat_num']
        related_cat_nums = RELATED_CATS.get(cat_num, [])

        # Collect candidate apps from related categories (not same category)
        candidates = []
        for rc in related_cat_nums:
            if rc != cat_num:
                candidates.extend(all_by_cat.get(rc, []))

        # If no related categories found, pick from any other category
        if not candidates:
            candidates = [a for a in apps if a['cat_num'] != cat_num]

        related_apps = deterministic_pick(app['rel_dir'], candidates, 3)

        # ── Find learning path (prev/next in same category) ──
        same_cat = cat_apps.get(cat_num, [])
        app_idx = None
        for i, a in enumerate(same_cat):
            if a['app_name'] == app['app_name'] and a['cat_dir'] == app['cat_dir']:
                app_idx = i
                break

        prev_app = same_cat[app_idx - 1] if app_idx and app_idx > 0 else None
        next_app = same_cat[app_idx + 1] if app_idx is not None and app_idx < len(same_cat) - 1 else None

        # ── Build and inject LANG keys ──
        lang_keys = build_lang_keys(app, related_apps, prev_app, next_app)
        new_js = inject_lang_keys(js_content, lang_keys)
        if new_js is None:
            print(f"  WARN: Could not find LANG object in {app['script_path']}")
            errors += 1
            continue

        # ── Add setupLinks snippet ──
        new_js = inject_js_snippet(new_js)

        # ── Inject HTML ──
        try:
            with open(app['index_path'], 'r', encoding='utf-8', errors='replace') as f:
                html_content = f.read()
        except Exception as e:
            print(f"  ERROR reading {app['index_path']}: {e}")
            errors += 1
            continue

        new_html = inject_html(html_content)
        if new_html is None:
            print(f"  WARN: Could not find sidebar-footer in {app['index_path']}")
            errors += 1
            continue

        # ── Write files ──
        try:
            with open(app['script_path'], 'w', encoding='utf-8') as f:
                f.write(new_js)
            with open(app['index_path'], 'w', encoding='utf-8') as f:
                f.write(new_html)
            modified += 1
        except Exception as e:
            print(f"  ERROR writing {app['app_name']}: {e}")
            errors += 1
            continue

    print(f"\nDone! Modified: {modified}, Skipped (already done): {skipped}, Errors: {errors}")
    return 0 if errors == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
