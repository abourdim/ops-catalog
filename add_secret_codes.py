#!/usr/bin/env python3
"""
Add Secret Code system to all 488 Workshop-DIY apps.
Each app gets a unique 4-digit code derived from MD5 of its directory name.
Idempotent: skips files that already have secretTitle.
"""

import os
import hashlib
import subprocess
import random

BASE = os.path.dirname(os.path.abspath(__file__))

def get_secret_code(dirname):
    """Derive a 4-digit numeric code from MD5 of dirname."""
    h = hashlib.md5(dirname.encode()).hexdigest()
    digits = ''
    for c in h:
        d = int(c, 16) % 10
        digits += str(d)
        if len(digits) == 4:
            break
    return digits

# LANG keys for en/fr/ar
LANG_EN = (
    "secretTitle:'Secret Vault',"
    "secretFound:'Code Found!',"
    "secretHint:'Set all sliders to center...',"
    "secretCount:'Codes collected',"
    "secretReveal:'Reveal Code'"
)

LANG_FR = (
    "secretTitle:'Coffre Secret',"
    "secretFound:'Code Trouv\\x27!',"
    "secretHint:'Mettez tous les curseurs au centre...',"
    "secretCount:'Codes collect\\x27s',"
    "secretReveal:'R\\x27v\\x27ler Code'"
)

LANG_AR = (
    "secretTitle:'\\u0627\\u0644\\u062e\\u0632\\u0646\\u0629 \\u0627\\u0644\\u0633\\u0631\\u064a\\u0629',"
    "secretFound:'!\\u062a\\u0645 \\u0627\\u0644\\u0639\\u062b\\u0648\\u0631 \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0631\\u0645\\u0632',"
    "secretHint:'...\\u0627\\u0636\\u0628\\u0637 \\u062c\\u0645\\u064a\\u0639 \\u0627\\u0644\\u0645\\u0646\\u0632\\u0644\\u0642\\u0627\\u062a \\u0639\\u0644\\u0649 \\u0627\\u0644\\u0648\\u0633\\u0637',"
    "secretCount:'\\u0627\\u0644\\u0631\\u0645\\u0648\\u0632 \\u0627\\u0644\\u0645\\u062c\\u0645\\u0639\\u0629',"
    "secretReveal:'\\u0643\\u0634\\u0641 \\u0627\\u0644\\u0631\\u0645\\u0632'"
)

# The initSecretCode JS function template
# {CODE} will be replaced with the 4-digit code per app
JS_FUNC = r"""
/* === SECRET CODE SYSTEM === */
function initSecretCode(){var CODE='{CODE}';var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var storageKey='secret_'+appDir;var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};if(!L.secretTitle)return;var found=localStorage.getItem(storageKey);function countCodes(){var c=0;for(var i=0;i<localStorage.length;i++){if(localStorage.key(i).indexOf('secret_')===0&&localStorage.getItem(localStorage.key(i)).length===4)c++;}return c;}var lockBtn=document.createElement('button');lockBtn.className='btn-icon-only';lockBtn.textContent='\uD83D\uDD12';lockBtn.title=L.secretTitle||'Secret Vault';lockBtn.style.cssText='cursor:pointer;font-size:1rem;';lockBtn.onclick=function(){var cc=countCodes();var codes=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k.indexOf('secret_')===0){var v=localStorage.getItem(k);if(v&&v.length===4)codes.push(k.replace('secret_','')+': '+v);}}var ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;';var box=document.createElement('div');box.style.cssText='background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:1.5rem;max-width:420px;width:90%;max-height:80vh;overflow-y:auto;color:var(--text,#e4ddd0);text-align:center;';box.innerHTML='<h3 style="color:var(--accent,#d4a03c);margin-bottom:0.8rem;font-family:Orbitron,monospace;">'+(L.secretTitle||'Secret Vault')+'</h3><p style="font-size:1.2rem;margin:0.5rem 0;">'+(L.secretCount||'Codes collected')+': <strong>'+cc+'/488</strong></p><div style="margin:0.8rem 0;text-align:left;font-family:monospace;font-size:0.75rem;max-height:200px;overflow-y:auto;background:rgba(0,0,0,0.3);padding:0.5rem;border-radius:8px;">'+((codes.length>0)?codes.join('<br>'):'<em>'+L.secretHint+'</em>')+'</div><button style="background:var(--accent,#d4a03c);color:#000;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-weight:700;" onclick="this.parentElement.parentElement.remove();">OK</button>';ov.appendChild(box);ov.onclick=function(e){if(e.target===ov)ov.remove();};document.body.appendChild(ov);};var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');if(hdr)hdr.appendChild(lockBtn);else{lockBtn.style.cssText+='position:fixed;top:0.5rem;right:3rem;z-index:9999;';document.body.appendChild(lockBtn);}function checkSliders(){var sliders=document.querySelectorAll('input[type="range"]');if(sliders.length===0)return false;var allMid=true;sliders.forEach(function(s){var min=parseFloat(s.min)||0;var max=parseFloat(s.max)||100;var mid=(min+max)/2;var range=max-min;var tolerance=range*0.05;var val=parseFloat(s.value);if(Math.abs(val-mid)>tolerance)allMid=false;});return allMid;}function onSliderInput(){if(found)return;if(!checkSliders())return;found=CODE;localStorage.setItem(storageKey,CODE);lockBtn.textContent='\uD83D\uDD13';var cc=countCodes();var popup=document.createElement('div');popup.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;';var inner=document.createElement('div');inner.style.cssText='background:var(--panel,#0b0d24);border:3px solid #ffd700;border-radius:14px;padding:2rem;max-width:350px;width:90%;text-align:center;color:var(--text,#e4ddd0);animation:secretGlow 1.5s ease-in-out infinite alternate;';inner.innerHTML='<div style="font-size:3rem;margin-bottom:0.5rem;">&#127775;</div><h3 style="color:#ffd700;font-family:Orbitron,monospace;">'+(L.secretFound||'Code Found!')+'</h3><div style="font-family:Orbitron,monospace;font-size:2rem;color:#ffd700;margin:1rem 0;letter-spacing:6px;">'+CODE+'</div><p style="font-size:0.9rem;opacity:0.8;">'+(L.secretCount||'Codes collected')+': '+cc+'/488</p><button style="background:#ffd700;color:#000;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-weight:700;margin-top:1rem;" onclick="this.parentElement.parentElement.remove();">OK</button>';popup.appendChild(inner);popup.onclick=function(e){if(e.target===popup)popup.remove();};document.body.appendChild(popup);var glowStyle=document.createElement('style');glowStyle.textContent='@keyframes secretGlow{from{box-shadow:0 0 20px rgba(255,215,0,0.3);}to{box-shadow:0 0 40px rgba(255,215,0,0.7),0 0 80px rgba(255,215,0,0.3);}}';document.head.appendChild(glowStyle);}if(found){lockBtn.textContent='\uD83D\uDD13';}document.querySelectorAll('input[type="range"]').forEach(function(s){s.addEventListener('input',onSliderInput);});}
document.addEventListener('DOMContentLoaded',function(){try{initSecretCode();}catch(e){console.warn('SecretCode init:',e);}});
"""


def find_script_files():
    """Find all script.js files in app subdirectories (depth 3)."""
    scripts = []
    for cat_dir in sorted(os.listdir(BASE)):
        cat_path = os.path.join(BASE, cat_dir)
        if not os.path.isdir(cat_path) or cat_dir.startswith('.') or cat_dir.startswith('__'):
            continue
        # Skip non-app dirs
        if not cat_dir[0].isdigit():
            continue
        for app_dir in sorted(os.listdir(cat_path)):
            app_path = os.path.join(cat_path, app_dir)
            if not os.path.isdir(app_path):
                continue
            script = os.path.join(app_path, 'script.js')
            if os.path.isfile(script):
                scripts.append((script, app_dir))
    return scripts


def inject_lang(content, lang_keys_en, lang_keys_fr, lang_keys_ar):
    """Inject LANG keys into the correct positions.
    Old format: insert after ...LANG_BASE.en, / .fr, / .ar,
    New format: insert before },fr:{ / },ar:{ / }};
    """
    # Old format: ...LANG_BASE.en,
    if '...LANG_BASE.en,' in content:
        content = content.replace(
            '...LANG_BASE.en,',
            '...LANG_BASE.en,' + lang_keys_en + ',',
            1
        )
        content = content.replace(
            '...LANG_BASE.fr,',
            '...LANG_BASE.fr,' + lang_keys_fr + ',',
            1
        )
        content = content.replace(
            '...LANG_BASE.ar,',
            '...LANG_BASE.ar,' + lang_keys_ar + ',',
            1
        )
    else:
        # New format: insert before },fr:{ and },ar:{ and }};
        content = content.replace('},fr:{', ',' + lang_keys_en + '},fr:{', 1)
        content = content.replace('},ar:{', ',' + lang_keys_fr + '},ar:{', 1)
        content = content.replace('}};', ',' + lang_keys_ar + '}};', 1)

    return content


def inject_js(content, code):
    """Inject the initSecretCode function after the LANG }; block."""
    js_code = JS_FUNC.replace('{CODE}', code)

    # Find the LANG }; — it's typically the second }; in the file
    # We need to find the closing of const LANG = { ... };
    # Strategy: find "const LANG" then find its closing };
    lang_start = content.find('const LANG')
    if lang_start == -1:
        # Try window.LANG
        lang_start = content.find('window.LANG')
    if lang_start == -1:
        # Fallback: append at end
        content += js_code
        return content

    # Find the }; that closes LANG
    # Count braces from lang_start
    brace_count = 0
    in_string = False
    string_char = None
    i = content.find('{', lang_start)
    if i == -1:
        content += js_code
        return content

    pos = i
    while pos < len(content):
        c = content[pos]
        if in_string:
            if c == '\\':
                pos += 2
                continue
            if c == string_char:
                in_string = False
        else:
            if c in ("'", '"', '`'):
                in_string = True
                string_char = c
            elif c == '{':
                brace_count += 1
            elif c == '}':
                brace_count -= 1
                if brace_count == 0:
                    # Found the closing }
                    # Check for ;
                    semi_pos = pos + 1
                    while semi_pos < len(content) and content[semi_pos] in (' ', '\t', '\r', '\n'):
                        semi_pos += 1
                    if semi_pos < len(content) and content[semi_pos] == ';':
                        insert_pos = semi_pos + 1
                    else:
                        insert_pos = pos + 1
                    content = content[:insert_pos] + js_code + content[insert_pos:]
                    return content
        pos += 1

    # Fallback
    content += js_code
    return content


def main():
    scripts = find_script_files()
    print(f"Found {len(scripts)} script.js files")

    modified = 0
    skipped = 0
    errors = 0

    for script_path, app_dir in scripts:
        try:
            with open(script_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # Idempotency check
            if 'secretTitle' in content:
                skipped += 1
                continue

            code = get_secret_code(app_dir)

            # Inject LANG keys
            content = inject_lang(content, LANG_EN, LANG_FR, LANG_AR)

            # Inject JS function
            content = inject_js(content, code)

            with open(script_path, 'w', encoding='utf-8') as f:
                f.write(content)

            modified += 1

        except Exception as e:
            print(f"  ERROR {script_path}: {e}")
            errors += 1

    print(f"\nResults: {modified} modified, {skipped} skipped (already had secretTitle), {errors} errors")

    # Verify 30 random files with node -c
    print("\nVerifying 30 files with node -c ...")
    verify_files = scripts[:30] if len(scripts) <= 30 else random.sample(scripts, 30)
    verify_ok = 0
    verify_fail = 0
    for script_path, app_dir in verify_files:
        result = subprocess.run(
            ['node', '-c', script_path],
            capture_output=True, text=True
        )
        if result.returncode == 0:
            verify_ok += 1
        else:
            verify_fail += 1
            print(f"  FAIL: {script_path}")
            print(f"    {result.stderr.strip()[:200]}")

    print(f"Verification: {verify_ok}/30 passed, {verify_fail} failed")


if __name__ == '__main__':
    main()
