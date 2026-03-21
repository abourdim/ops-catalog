#!/usr/bin/env python3
"""
add_features.py — Adds keyboard shortcuts + achievement badges to all 488 apps.
"""

import os
import re
import sys
import subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))

# ─── JS code blocks ───

KEYBOARD_SHORTCUTS_JS = r"""
/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});
""".strip()

ACHIEVEMENTS_JS = r"""
/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});
""".strip()

# ─── LANG keys to add ───

LANG_KEYS = {
    'en': {
        'shortcutsTitle': '\u2328\ufe0f Keyboard Shortcuts',
        'shortcutsInfo': '? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
        'achieveTitle': '\U0001F3C6 Achievements',
        'achieveExplorer': 'Explorer \u2014 visited 4+ help tabs',
        'achieveScientist': 'Scientist \u2014 revealed 2+ challenge answers',
        'achieveExperimenter': 'Experimenter \u2014 changed 5+ parameters',
    },
    'fr': {
        'shortcutsTitle': '\u2328\ufe0f Raccourcis Clavier',
        'shortcutsInfo': '? = Aide, Esc = Fermer, S = D\u00e9marrer, R = R\u00e9initialiser, 1-9 = Onglets',
        'achieveTitle': '\U0001F3C6 Succ\u00e8s',
        'achieveExplorer': 'Explorateur \u2014 visit\u00e9 4+ onglets aide',
        'achieveScientist': 'Scientifique \u2014 r\u00e9v\u00e9l\u00e9 2+ r\u00e9ponses d\u00e9fi',
        'achieveExperimenter': 'Exp\u00e9rimentateur \u2014 chang\u00e9 5+ param\u00e8tres',
    },
    'ar': {
        'shortcutsTitle': '\u2328\ufe0f \u0627\u062e\u062a\u0635\u0627\u0631\u0627\u062a \u0644\u0648\u062d\u0629 \u0627\u0644\u0645\u0641\u0627\u062a\u064a\u062d',
        'shortcutsInfo': '? = \u0645\u0633\u0627\u0639\u062f\u0629\u060c Esc = \u0625\u063a\u0644\u0627\u0642\u060c S = \u0628\u062f\u0621\u060c R = \u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646\u060c 1-9 = \u0623\u0644\u0633\u0646\u0629',
        'achieveTitle': '\U0001F3C6 \u0625\u0646\u062c\u0627\u0632\u0627\u062a',
        'achieveExplorer': '\u0645\u0633\u062a\u0643\u0634\u0641 \u2014 \u0632\u064a\u0627\u0631\u0629 4+ \u0623\u0644\u0633\u0646\u0629 \u0645\u0633\u0627\u0639\u062f\u0629',
        'achieveScientist': '\u0639\u0627\u0644\u0645 \u2014 \u0643\u0634\u0641 2+ \u0625\u062c\u0627\u0628\u0627\u062a \u062a\u062d\u062f\u064a',
        'achieveExperimenter': '\u0645\u062c\u0631\u0628 \u2014 \u062a\u063a\u064a\u064a\u0631 5+ \u0645\u0639\u0627\u0645\u0644\u0627\u062a',
    },
}

# ─── HTML blocks ───

SHORTCUTS_HTML = '<div class="guide-item" id="shortcutsBlock"><h3 data-i18n="shortcutsTitle">\u2328\ufe0f Keyboard Shortcuts</h3><p data-i18n="shortcutsInfo" style="font-size:0.85rem;">? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs</p></div>'

ACHIEVE_HTML = '<div class="guide-item" id="achieveBlock"><h3 data-i18n="achieveTitle">\U0001F3C6 Achievements</h3><div id="achievementBadges" style="font-size:1.5rem;margin:0.5rem 0;"></div><p data-i18n="achieveExplorer" style="font-size:0.8rem;margin:0.2rem 0;">\U0001F5FA\ufe0f Explorer</p><p data-i18n="achieveScientist" style="font-size:0.8rem;margin:0.2rem 0;">\U0001F52C Scientist</p><p data-i18n="achieveExperimenter" style="font-size:0.8rem;margin:0.2rem 0;">\u2697\ufe0f Experimenter</p></div>'


def build_lang_line(key, value):
    """Build a LANG key:value string, escaping single quotes in value."""
    escaped = value.replace("'", "\\'")
    return f"    {key}:'{escaped}'"


def inject_lang_keys_into_block(content, lang_code, keys_dict):
    """
    Find the closing of a lang block (en/fr/ar) inside LANG or LANG_BASE and
    inject new keys before the closing brace.

    We look for patterns in both LANG_BASE and LANG objects.
    For LANG_BASE: blocks like `en: { ... },`
    For LANG (with spread): blocks like `en: { ...LANG_BASE.en, ... },` or `... }`
    """
    # We need to add keys to both LANG_BASE and LANG blocks for the given lang_code
    lines_to_add = ',\n'.join(build_lang_line(k, v) for k, v in keys_dict.items())

    # Strategy: find all blocks for this lang_code and add keys before closing
    # Pattern: find `lang_code: {` then the matching `}` (with optional `,`)
    # We'll do this more carefully by finding the LANG_BASE block and LANG block separately

    return content


def find_all_lang_blocks(content, lang_code):
    """Find start positions of all `lang_code: {` blocks."""
    pattern = re.compile(r'^\s*' + re.escape(lang_code) + r'\s*:\s*\{', re.MULTILINE)
    return list(pattern.finditer(content))


def find_block_end(content, start_of_brace):
    """Find the matching closing brace for the opening brace at position start_of_brace."""
    depth = 0
    i = start_of_brace
    while i < len(content):
        ch = content[i]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                return i
        elif ch == "'" or ch == '"' or ch == '`':
            # skip string
            quote = ch
            i += 1
            while i < len(content) and content[i] != quote:
                if content[i] == '\\':
                    i += 1  # skip escaped char
                i += 1
        i += 1
    return -1


def add_keys_to_lang_block(content, lang_code, keys_dict):
    """Add LANG keys to all blocks for the given language code."""
    matches = find_all_lang_blocks(content, lang_code)
    # Process in reverse order so positions don't shift
    for m in reversed(matches):
        brace_start = content.index('{', m.start())
        brace_end = find_block_end(content, brace_start)
        if brace_end == -1:
            continue

        # Check what's right before the closing brace
        pre = content[brace_start+1:brace_end].rstrip()

        # Build the keys to insert
        lines_to_add = ',\n'.join(build_lang_line(k, v) for k, v in keys_dict.items())

        # Check if the block already ends with a comma or not
        if pre.endswith(','):
            insertion = '\n' + lines_to_add + '\n  '
        else:
            insertion = ',\n' + lines_to_add + '\n  '

        content = content[:brace_end] + insertion + content[brace_end:]

    return content


def process_script(script_path):
    """Process a single script.js file."""
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has these features (use exact comment markers)
    if '/* Keyboard shortcuts */' in content and 'checkAchievements' in content:
        return 'skipped'

    modified = False

    # 1. Add LANG keys to all lang blocks (en, fr, ar) in both LANG_BASE and LANG
    for lang_code, keys in LANG_KEYS.items():
        # Check if keys already present
        if 'shortcutsTitle' not in content:
            content = add_keys_to_lang_block(content, lang_code, keys)
            modified = True

    # 2. Add keyboard shortcuts + achievements JS after the LANG closing `};`
    # Find the LANG = { ... }; block end
    # The LANG object is the second `};` at the start of a line (first is LANG_BASE)
    if '/* Keyboard shortcuts */' not in content:
        # Find `const LANG = {`
        lang_match = re.search(r'^const LANG\s*=\s*\{', content, re.MULTILINE)
        if lang_match:
            brace_start = content.index('{', lang_match.start())
            brace_end = find_block_end(content, brace_start)
            if brace_end != -1:
                # Find the `};` after the closing brace
                semi_pos = content.index(';', brace_end)
                insert_pos = semi_pos + 1
                injection = '\n\n' + KEYBOARD_SHORTCUTS_JS + '\n\n' + ACHIEVEMENTS_JS + '\n'
                content = content[:insert_pos] + injection + content[insert_pos:]
                modified = True

    if modified:
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return 'modified'
    return 'unchanged'


def process_html(html_path):
    """Process a single index.html file."""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has these features
    if 'shortcutsBlock' in content and 'achieveBlock' in content:
        return 'skipped'

    modified = False

    # Insert after theoryBlock closing </div>
    # Pattern: id="theoryBlock"...followed by </div></div>
    # We insert after the theoryBlock's closing </div>
    if 'shortcutsBlock' not in content:
        # Find theoryBlock and its closing </div>
        # The theoryBlock is: <div class="guide-item" id="theoryBlock">...<p ...>...</p></div>
        # After it there's typically </div></div>
        # We want to insert right after theoryBlock's closing </div>

        # Strategy: find `id="theoryBlock"` then find the matching closing </div>
        tb_idx = content.find('id="theoryBlock"')
        if tb_idx != -1:
            # Go back to find the opening <div of theoryBlock
            div_start = content.rfind('<div', 0, tb_idx)
            if div_start != -1:
                # Find the matching closing </div> for this div
                # Count nested divs
                pos = div_start
                depth = 0
                while pos < len(content):
                    open_match = content.find('<div', pos)
                    close_match = content.find('</div>', pos)
                    if close_match == -1:
                        break
                    if open_match != -1 and open_match < close_match:
                        depth += 1
                        pos = open_match + 4
                    else:
                        depth -= 1
                        if depth == 0:
                            # This is the closing </div> of theoryBlock
                            insert_pos = close_match + len('</div>')
                            content = content[:insert_pos] + SHORTCUTS_HTML + ACHIEVE_HTML + content[insert_pos:]
                            modified = True
                            break
                        pos = close_match + 6

    if modified:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return 'modified'
    return 'unchanged'


def find_all_apps():
    """Find all app directories (category/app pairs)."""
    apps = []
    for category in sorted(os.listdir(ROOT)):
        cat_path = os.path.join(ROOT, category)
        if not os.path.isdir(cat_path) or not re.match(r'^\d{2}-', category):
            continue
        for app in sorted(os.listdir(cat_path)):
            app_path = os.path.join(cat_path, app)
            script = os.path.join(app_path, 'script.js')
            html = os.path.join(app_path, 'index.html')
            if os.path.isfile(script) and os.path.isfile(html):
                apps.append((script, html))
    return apps


def syntax_check(script_path):
    """Run node --check on a script.js file. Returns (path, ok, error)."""
    try:
        result = subprocess.run(
            ['node', '--check', script_path],
            capture_output=True, text=True, timeout=10
        )
        if result.returncode == 0:
            return (script_path, True, '')
        else:
            return (script_path, False, result.stderr.strip())
    except Exception as e:
        return (script_path, False, str(e))


def main():
    apps = find_all_apps()
    print(f"Found {len(apps)} apps")

    js_stats = {'modified': 0, 'skipped': 0, 'unchanged': 0}
    html_stats = {'modified': 0, 'skipped': 0, 'unchanged': 0}

    for i, (script, html) in enumerate(apps):
        rel = os.path.relpath(script, ROOT)
        result_js = process_script(script)
        result_html = process_html(html)
        js_stats[result_js] += 1
        html_stats[result_html] += 1
        if (i + 1) % 50 == 0:
            print(f"  processed {i+1}/{len(apps)}...")

    print(f"\nscript.js: {js_stats}")
    print(f"index.html: {html_stats}")

    # Syntax check on first 30 files
    print("\nRunning syntax check on 30 sample files...")
    errors = 0
    checked = 0
    for script, _ in apps[:30]:
        path, ok, err = syntax_check(script)
        checked += 1
        if not ok:
            errors += 1
            print(f"  FAIL: {os.path.relpath(path, ROOT)}")
            print(f"        {err}")
    print(f"\nSyntax check: {checked} checked, {errors} errors")

    if errors > 0:
        print("WARNING: Some files have syntax errors!")
        sys.exit(1)
    else:
        print("All syntax checks passed!")


if __name__ == '__main__':
    main()
