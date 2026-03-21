#!/usr/bin/env python3
"""Add Mission Briefing + Night Vision features to all 488 apps."""

import os, re, subprocess, hashlib, glob

ROOT = os.path.dirname(os.path.abspath(__file__))

# ── Collect all script.js files ──
scripts = sorted(glob.glob(os.path.join(ROOT, '*', '*', 'script.js')))
print(f'Found {len(scripts)} script.js files')

# Known marker that exists in all files (from previous enrichment)
DAILY_MARKER = '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550 DAILY CHALLENGE \u2550\u2550\u2550\u2550\u2550\u2550\u2550 */'

# ── Helper: generate agent codename from directory name hash ──
def agent_codename(dirpath):
    app_dir = os.path.basename(os.path.dirname(dirpath))
    h = hashlib.md5(app_dir.encode()).hexdigest()[:6].upper()
    return f'AGENT-{h}'

# ── Helper: extract app title from EN block ──
def extract_title(content):
    m = re.search(r"title:\s*'([^']*)'", content)
    if m:
        return m.group(1)
    return 'this app'

# ── LANG keys to inject (per-app, because mission_obj uses the title) ──
def make_en_keys(title, codename):
    t = title.replace("'", "\\x27")
    return (
        "missionTitle:'MISSION BRIEFING',"
        "missionClassified:'CLASSIFIED',"
        "missionObjective:'Your mission objective:',"
        f"missionAgent:'{codename}',"
        "missionSkip:'Skip',"
        "missionGo:'ACCEPT MISSION',"
        f"mission_obj:'Explore and master {t} \\u2014 analyze, experiment, and complete all challenges.',"
        "nightVisionTitle:'Night Vision Mode',"
        "nightVisionOn:'NV ON',"
        "nightVisionOff:'NV OFF',"
        "nightVisionAuto:'Auto NV',"
    )

def make_fr_keys(title, codename):
    t = title.replace("'", "\\x27")
    return (
        "missionTitle:'BRIEFING DE MISSION',"
        "missionClassified:'CLASSIFI\\xc9',"
        "missionObjective:'Objectif de mission :',"
        f"missionAgent:'{codename}',"
        "missionSkip:'Passer',"
        "missionGo:'ACCEPTER LA MISSION',"
        f"mission_obj:'Explorer et ma\\xeetrisez {t} \\u2014 analysez, exp\\xe9rimentez et compl\\xe9tez tous les d\\xe9fis.',"
        "nightVisionTitle:'Mode Vision Nocturne',"
        "nightVisionOn:'VN ON',"
        "nightVisionOff:'VN OFF',"
        "nightVisionAuto:'VN Auto',"
    )

def make_ar_keys(title, codename):
    return (
        "missionTitle:'\\u0625\\u062D\\u0627\\u0637\\u0629 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629',"
        "missionClassified:'\\u0633\\u0631\\u064A',"
        "missionObjective:'\\u0647\\u062F\\u0641 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629:',"
        f"missionAgent:'{codename}',"
        "missionSkip:'\\u062A\\u062E\\u0637\\u064A',"
        "missionGo:'\\u0642\\u0628\\u0648\\u0644 \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629',"
        "mission_obj:'\\u0627\\u0633\\u062A\\u0643\\u0634\\u0641 \\u0648\\u0623\\u062A\\u0642\\u0646 \\u0647\\u0630\\u0627 \\u0627\\u0644\\u062A\\u0637\\u0628\\u064A\\u0642 \\u2014 \\u062D\\u0644\\u0644 \\u0648\\u062C\\u0631\\u0628 \\u0648\\u0623\\u0643\\u0645\\u0644 \\u062C\\u0645\\u064A\\u0639 \\u0627\\u0644\\u062A\\u062D\\u062F\\u064A\\u0627\\u062A.',"
        "nightVisionTitle:'\\u0648\\u0636\\u0639 \\u0627\\u0644\\u0631\\u0624\\u064A\\u0629 \\u0627\\u0644\\u0644\\u064A\\u0644\\u064A\\u0629',"
        "nightVisionOn:'\\u0631\\u0624\\u064A\\u0629 \\u0644\\u064A\\u0644\\u064A\\u0629 ON',"
        "nightVisionOff:'\\u0631\\u0624\\u064A\\u0629 \\u0644\\u064A\\u0644\\u064A\\u0629 OFF',"
        "nightVisionAuto:'\\u0631\\u0624\\u064A\\u0629 \\u0644\\u064A\\u0644\\u064A\\u0629 \\u062A\\u0644\\u0642\\u0627\\u0626\\u064A',"
    )

# ── JS functions (raw string so escape sequences stay literal in JS output) ──
JS_FUNCTIONS = r"""
/* ═══════ MISSION BRIEFING ═══════ */
function initMissionBriefing(){var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var ssKey='mission_seen_'+appDir;if(sessionStorage.getItem(ssKey))return;sessionStorage.setItem(ssKey,'1');var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};var overlay=document.createElement('div');overlay.id='missionOverlay';overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family:monospace;color:#00ff41;overflow:hidden;';var stamp=document.createElement('div');stamp.textContent=L.missionClassified||'CLASSIFIED';stamp.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(3) rotate(-15deg);font-size:4rem;font-weight:bold;color:#ff0000;opacity:0;animation:stampIn 0.6s ease-out 0.3s forwards;pointer-events:none;text-transform:uppercase;letter-spacing:0.3em;';overlay.appendChild(stamp);var box=document.createElement('div');box.style.cssText='max-width:600px;padding:2rem;text-align:center;opacity:0;transition:opacity 0.5s;';var titleEl=document.createElement('h2');titleEl.textContent=L.missionTitle||'MISSION BRIEFING';titleEl.style.cssText='color:#00ff41;font-size:1.5rem;margin-bottom:1rem;letter-spacing:0.2em;text-transform:uppercase;';box.appendChild(titleEl);var objLabel=document.createElement('div');objLabel.textContent=L.missionObjective||'Your mission objective:';objLabel.style.cssText='color:#00aa30;font-size:0.9rem;margin-bottom:0.5rem;';box.appendChild(objLabel);var typewriter=document.createElement('div');typewriter.style.cssText='color:#00ff41;font-size:1.1rem;min-height:3rem;line-height:1.6;text-align:left;border-left:2px solid #00ff41;padding-left:1rem;margin:1rem 0;';box.appendChild(typewriter);var agentEl=document.createElement('div');agentEl.textContent=L.missionAgent||'AGENT-000000';agentEl.style.cssText='color:#ffaa00;font-size:1.2rem;margin:1rem 0;letter-spacing:0.15em;';box.appendChild(agentEl);var goBtn=document.createElement('button');goBtn.textContent=L.missionGo||'ACCEPT MISSION';goBtn.style.cssText='background:#00ff41;color:#000;border:none;padding:0.8rem 2rem;font-size:1rem;font-family:monospace;font-weight:bold;cursor:pointer;text-transform:uppercase;letter-spacing:0.1em;margin-top:1rem;';goBtn.onmouseover=function(){this.style.background='#00cc33';};goBtn.onmouseout=function(){this.style.background='#00ff41';};goBtn.onclick=function(){dismiss();};box.appendChild(goBtn);overlay.appendChild(box);var skipEl=document.createElement('div');skipEl.textContent=L.missionSkip||'Skip';skipEl.style.cssText='position:absolute;top:1rem;right:1.5rem;color:#555;font-size:0.8rem;cursor:pointer;';skipEl.onclick=function(){dismiss();};overlay.appendChild(skipEl);var styleEl=document.createElement('style');styleEl.textContent='@keyframes stampIn{from{transform:translate(-50%,-50%) scale(3) rotate(-15deg);opacity:0}to{transform:translate(-50%,-50%) scale(1) rotate(-12deg);opacity:0.8}}';document.head.appendChild(styleEl);document.body.appendChild(overlay);var missionText=L.mission_obj||'Complete all objectives.';var charIdx=0;setTimeout(function(){stamp.style.opacity='0';stamp.style.transition='opacity 0.5s';setTimeout(function(){stamp.style.display='none';},500);box.style.opacity='1';var iv=setInterval(function(){if(charIdx<missionText.length){typewriter.textContent+=missionText[charIdx];charIdx++;}else{clearInterval(iv);}},30);},1500);var autoTimer=setTimeout(function(){dismiss();},15000);function dismiss(){clearTimeout(autoTimer);if(overlay.parentNode){overlay.style.opacity='0';overlay.style.transition='opacity 0.4s';setTimeout(function(){if(overlay.parentNode)overlay.parentNode.removeChild(overlay);},400);}}}
try{document.addEventListener('DOMContentLoaded',function(){initMissionBriefing();});}catch(e){}

/* ═══════ NIGHT VISION MODE ═══════ */
function initNightVision(){var nvStyle=document.createElement('style');nvStyle.textContent='.night-vision{filter:hue-rotate(80deg) saturate(1.5);background:#001100 !important;}.night-vision *{color:#00ff41 !important;border-color:#00ff4133 !important;}.night-vision::after{content:"";position:fixed;top:0;left:0;width:100%;height:100%;background:repeating-linear-gradient(0deg,rgba(0,255,65,0.03) 0px,rgba(0,255,65,0.03) 1px,transparent 1px,transparent 3px);pointer-events:none;z-index:99998;}.night-vision .card,.night-vision .sidebar{background:#001a00 !important;}';document.head.appendChild(nvStyle);var hour=new Date().getHours();var stored=localStorage.getItem('nightVisionPref');var active=stored!==null?(stored==='on'):(hour>=20||hour<6);if(active)document.body.classList.add('night-vision');var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};var btn=document.createElement('button');btn.className='btn-sm';btn.textContent='\uD83C\uDF19 NV';btn.title=L.nightVisionTitle||'Night Vision Mode';btn.style.cssText='margin-left:0.3rem;font-size:0.75rem;padding:0.2rem 0.5rem;cursor:pointer;';btn.onclick=function(){var isOn=document.body.classList.toggle('night-vision');localStorage.setItem('nightVisionPref',isOn?'on':'off');};var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');if(hdr){hdr.appendChild(btn);}else{btn.style.cssText+='position:fixed;top:0.5rem;right:0.5rem;z-index:9999;';document.body.appendChild(btn);}}
try{initNightVision();}catch(e){}
"""

# ── Helper: ensure trailing comma ──
def ensure_comma(s, pos):
    """Return comma prefix if char before pos is not already a comma."""
    i = pos - 1
    while i >= 0 and s[i] in ' \t\n\r':
        i -= 1
    if i >= 0 and s[i] != ',':
        return ','
    return ''

# ── Counters ──
updated = 0
skipped_existing = 0
skipped_errors = 0
error_files = []

for fpath in scripts:
    with open(fpath, 'r', encoding='utf-8') as f:
        src = f.read()

    # Skip if already patched
    if 'missionTitle' in src:
        skipped_existing += 1
        continue

    title = extract_title(src)
    codename = agent_codename(fpath)
    EN_KEYS = make_en_keys(title, codename)
    FR_KEYS = make_fr_keys(title, codename)
    AR_KEYS = make_ar_keys(title, codename)

    # Find where to insert JS functions: before DAILY CHALLENGE marker
    daily_pos = src.find(DAILY_MARKER)
    if daily_pos == -1:
        # Fallback: try to find any known marker after LANG
        for marker in ['/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550 MENTOR MODE', '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550 Voice Command', '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550 Data Sonification']:
            daily_pos = src.find(marker)
            if daily_pos != -1:
                break
    if daily_pos == -1:
        error_files.append((fpath, 'no-marker'))
        skipped_errors += 1
        continue

    # Detect format: old has "const LANG = {" (with spaces), new has "const LANG={"
    is_old = bool(re.search(r'const\s+LANG\s+=\s+\{', src))

    try:
        if is_old:
            # OLD FORMAT: multi-line with ...LANG_BASE.xx spread markers
            # Find the LANG object (not LANG_BASE)
            lang_start = -1
            for m in re.finditer(r'const\s+LANG\b', src):
                if 'LANG_BASE' not in src[m.start():m.start()+20]:
                    lang_start = m.start()
                    break
            if lang_start == -1:
                error_files.append((fpath, 'no-LANG'))
                skipped_errors += 1
                continue

            # Find the three spread markers inside LANG (after lang_start)
            en_spread = src.find('...LANG_BASE.en,', lang_start)
            fr_spread = src.find('...LANG_BASE.fr,', lang_start)
            ar_spread = src.find('...LANG_BASE.ar,', lang_start)

            if en_spread == -1 or fr_spread == -1 or ar_spread == -1:
                error_files.append((fpath, 'no-spread'))
                skipped_errors += 1
                continue

            # Insert in reverse order (ar, fr, en) to keep positions stable
            ar_end = src.find('\n', ar_spread) + 1
            src = src[:ar_end] + '    ' + AR_KEYS + '\n' + src[ar_end:]

            fr_end = src.find('\n', fr_spread) + 1
            src = src[:fr_end] + '    ' + FR_KEYS + '\n' + src[fr_end:]

            en_end = src.find('\n', en_spread) + 1
            src = src[:en_end] + '    ' + EN_KEYS + '\n' + src[en_end:]

        else:
            # NEW FORMAT: single-line or compact multi-line
            # const LANG={en:{...LANG_BASE.en,...},fr:{...},ar:{...}};
            lang_start = -1
            for m in re.finditer(r'const\s+LANG\b', src):
                if 'LANG_BASE' not in src[m.start():m.start()+20]:
                    lang_start = m.start()
                    break
            if lang_start == -1:
                error_files.append((fpath, 'no-LANG'))
                skipped_errors += 1
                continue

            region = src[lang_start:daily_pos]

            fr_match = re.search(r'\}\s*,\s*fr\s*:\s*\{', region)
            if not fr_match:
                error_files.append((fpath, 'no-fr'))
                skipped_errors += 1
                continue

            ar_match = re.search(r'\}\s*,\s*ar\s*:\s*\{', region)
            if not ar_match:
                error_files.append((fpath, 'no-ar'))
                skipped_errors += 1
                continue

            close_match = re.search(r'\}\s*\}\s*;', region)
            if not close_match:
                error_files.append((fpath, 'no-close'))
                skipped_errors += 1
                continue

            # Insert in reverse order: ar keys, fr keys, en keys
            ar_close = lang_start + close_match.start()
            comma = ensure_comma(src, ar_close)
            src = src[:ar_close] + comma + AR_KEYS + src[ar_close:]

            # Recalculate after insertion
            new_daily_pos = src.find(DAILY_MARKER)
            if new_daily_pos == -1:
                for marker in ['/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550 MENTOR MODE', '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550 Voice Command']:
                    new_daily_pos = src.find(marker)
                    if new_daily_pos != -1:
                        break

            region2 = src[lang_start:new_daily_pos]
            ar_match2 = re.search(r'\}\s*,\s*ar\s*:\s*\{', region2)
            if not ar_match2:
                error_files.append((fpath, 'no-ar2'))
                skipped_errors += 1
                continue
            ar_boundary = lang_start + ar_match2.start()
            comma = ensure_comma(src, ar_boundary)
            src = src[:ar_boundary] + comma + FR_KEYS + src[ar_boundary:]

            # Recalculate again
            new_daily_pos = src.find(DAILY_MARKER)
            if new_daily_pos == -1:
                for marker in ['/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550 MENTOR MODE', '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550 Voice Command']:
                    new_daily_pos = src.find(marker)
                    if new_daily_pos != -1:
                        break

            region3 = src[lang_start:new_daily_pos]
            fr_match2 = re.search(r'\}\s*,\s*fr\s*:\s*\{', region3)
            if not fr_match2:
                error_files.append((fpath, 'no-fr2'))
                skipped_errors += 1
                continue
            fr_boundary = lang_start + fr_match2.start()
            comma = ensure_comma(src, fr_boundary)
            src = src[:fr_boundary] + comma + EN_KEYS + src[fr_boundary:]

        # ── Inject JS functions before DAILY CHALLENGE marker ──
        inject_pos = src.find(DAILY_MARKER)
        if inject_pos == -1:
            for marker in ['/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550 MENTOR MODE', '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550 Voice Command', '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550 Data Sonification']:
                inject_pos = src.find(marker)
                if inject_pos != -1:
                    break
        if inject_pos == -1:
            # Last resort: append at end
            src += '\n' + JS_FUNCTIONS
        else:
            src = src[:inject_pos] + JS_FUNCTIONS + '\n' + src[inject_pos:]

        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(src)
        updated += 1

    except Exception as e:
        error_files.append((fpath, str(e)))
        skipped_errors += 1

print(f'\n=== SUMMARY ===')
print(f'Updated:          {updated}')
print(f'Already patched:  {skipped_existing}')
print(f'Errors/skipped:   {skipped_errors}')
for fp, reason in error_files[:20]:
    print(f'  {reason}: {os.path.relpath(fp, ROOT)}')

# ── Verify syntax on 40 sample files ──
print(f'\n=== SYNTAX CHECK (40 samples) ===')
import random
random.seed(42)
sample_files = scripts[:20] + scripts[-20:]
ok = 0
fail = 0
for fpath in sample_files:
    result = subprocess.run(['node', '-c', fpath], capture_output=True, text=True)
    if result.returncode == 0:
        ok += 1
    else:
        fail += 1
        print(f'  FAIL: {os.path.relpath(fpath, ROOT)}')
        err_msg = result.stderr.strip()
        print(f'    {err_msg[:200]}')

print(f'\nSyntax OK: {ok}/{len(sample_files)}')
print(f'Syntax FAIL: {fail}/{len(sample_files)}')
print(f'\nDone!')
