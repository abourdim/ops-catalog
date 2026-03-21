#!/usr/bin/env python3
"""Add Daily Challenge + Mentor Mode to all 488 apps."""

import os, re, glob, subprocess, random

ROOT = os.path.dirname(os.path.abspath(__file__))

# ── Category keywords from directory names ──
def get_category(dirpath):
    """Extract domain keyword from the category directory name."""
    parts = dirpath.replace(ROOT, '').strip('/').split('/')
    if len(parts) >= 1:
        cat = parts[0]  # e.g. '55-escape-evasion'
        # strip number prefix
        cat = re.sub(r'^\d+-', '', cat)
        return cat.replace('-', ' ')
    return 'technology'

def get_app_name(dirpath):
    """Extract short app name from directory."""
    return os.path.basename(dirpath)

# ── LANG key strings ──
def make_en_keys(category, app_name):
    pretty = app_name.replace('-', ' ').title()
    cat = category.title()
    return (
        "dailyTitle:\x27\U0001f4c5 Daily Challenge\x27,"
        "dailyChallenge:\x27Today\\x27s Challenge\x27,"
        "dailyHint:\x27Show Hint\x27,"
        "dailyStreak:\x27Streak\x27,"
        "dailyComplete:\x27Mark Complete\x27,"
        f"daily_d1:\x27Explain how {pretty} works to a friend in under 60 seconds.\x27,"
        f"daily_d2:\x27Find 3 real-world applications of {cat} concepts shown here.\x27,"
        f"daily_d3:\x27Change one parameter to its extreme value and document what happens.\x27,"
        f"daily_d4:\x27Draw a diagram showing the data flow in this {cat} simulation.\x27,"
        f"daily_d5:\x27Write pseudocode for the main algorithm used in this app.\x27,"
        f"daily_d6:\x27Compare results at default vs modified settings and note 3 differences.\x27,"
        f"daily_d7:\x27Create a hypothesis about what happens if you double the main parameter, then test it.\x27,"
        "mentorTitle:\x27\U0001f393 Guided Tutorial\x27,"
        "mentorStart:\x27Start Tutorial\x27,"
        "mentorNext:\x27Next\x27,"
        "mentorPrev:\x27Previous\x27,"
        "mentorDone:\x27Finish\x27,"
        "mentorStep:\x27Step\x27,"
        "mentor_s1:\x27Look at the main visualization area — this is where the simulation runs in real time.\x27,"
        "mentor_s2:\x27Press Start to begin the simulation. Watch how the display reacts to your input.\x27,"
        "mentor_s3:\x27Try adjusting one slider — watch how it affects the output immediately.\x27,"
        "mentor_s4:\x27Open the Help panel and explore the Wiki tab for deeper knowledge.\x27,"
        "mentor_s5:\x27Complete one challenge to test your understanding of the concepts.\x27,"
    )

def make_fr_keys(category, app_name):
    pretty = app_name.replace('-', ' ').title()
    cat = category.title()
    return (
        "dailyTitle:\x27\U0001f4c5 D\\xe9fi du jour\x27,"
        "dailyChallenge:\x27D\\xe9fi d\\x27aujourd\\x27hui\x27,"
        "dailyHint:\x27Voir l\\x27indice\x27,"
        "dailyStreak:\x27S\\xe9rie\x27,"
        "dailyComplete:\x27Marquer termin\\xe9\x27,"
        f"daily_d1:\x27Explique comment {pretty} fonctionne \\xe0 un ami en moins de 60 secondes.\x27,"
        f"daily_d2:\x27Trouve 3 applications r\\xe9elles des concepts de {cat} montr\\xe9s ici.\x27,"
        f"daily_d3:\x27Change un param\\xe8tre \\xe0 sa valeur extr\\xeame et documente ce qui se passe.\x27,"
        f"daily_d4:\x27Dessine un diagramme montrant le flux de donn\\xe9es dans cette simulation de {cat}.\x27,"
        f"daily_d5:\x27\\xc9cris le pseudocode de l\\x27algorithme principal utilis\\xe9 dans cette app.\x27,"
        f"daily_d6:\x27Compare les r\\xe9sultats avec les param\\xe8tres par d\\xe9faut et modifi\\xe9s et note 3 diff\\xe9rences.\x27,"
        f"daily_d7:\x27Formule une hypoth\\xe8se sur ce qui se passe si tu doubles le param\\xe8tre principal, puis teste-la.\x27,"
        "mentorTitle:\x27\U0001f393 Tutoriel guid\\xe9\x27,"
        "mentorStart:\x27D\\xe9marrer le tutoriel\x27,"
        "mentorNext:\x27Suivant\x27,"
        "mentorPrev:\x27Pr\\xe9c\\xe9dent\x27,"
        "mentorDone:\x27Terminer\x27,"
        "mentorStep:\x27\\xc9tape\x27,"
        "mentor_s1:\x27Regarde la zone de visualisation principale — c\\x27est l\\xe0 que la simulation tourne en temps r\\xe9el.\x27,"
        "mentor_s2:\x27Appuie sur D\\xe9marrer pour lancer la simulation. Observe comment l\\x27affichage r\\xe9agit.\x27,"
        "mentor_s3:\x27Essaie de modifier un curseur — observe comment cela affecte le r\\xe9sultat imm\\xe9diatement.\x27,"
        "mentor_s4:\x27Ouvre le panneau Aide et explore l\\x27onglet Wiki pour approfondir tes connaissances.\x27,"
        "mentor_s5:\x27Compl\\xe8te un d\\xe9fi pour tester ta compr\\xe9hension des concepts.\x27,"
    )

def make_ar_keys(category, app_name):
    pretty = app_name.replace('-', ' ').title()
    return (
        "dailyTitle:'\U0001f4c5 \u062a\u062d\u062f\u064a \u0627\u0644\u064a\u0648\u0645',"
        "dailyChallenge:'\u062a\u062d\u062f\u064a \u0627\u0644\u064a\u0648\u0645',"
        "dailyHint:'\u0625\u0638\u0647\u0627\u0631 \u0627\u0644\u062a\u0644\u0645\u064a\u062d',"
        "dailyStreak:'\u0633\u0644\u0633\u0644\u0629',"
        "dailyComplete:'\u0625\u0643\u0645\u0627\u0644',"
        "daily_d1:'\u0627\u0634\u0631\u062d \u0643\u064a\u0641 \u064a\u0639\u0645\u0644 \u0647\u0630\u0627 \u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u0644\u0635\u062f\u064a\u0642 \u0641\u064a \u0623\u0642\u0644 \u0645\u0646 60 \u062b\u0627\u0646\u064a\u0629.',"
        "daily_d2:'\u0627\u0628\u062d\u062b \u0639\u0646 3 \u062a\u0637\u0628\u064a\u0642\u0627\u062a \u0648\u0627\u0642\u0639\u064a\u0629 \u0644\u0644\u0645\u0641\u0627\u0647\u064a\u0645 \u0627\u0644\u0645\u0639\u0631\u0648\u0636\u0629 \u0647\u0646\u0627.',"
        "daily_d3:'\u063a\u064a\u0651\u0631 \u0645\u0639\u0644\u0645\u0629 \u0648\u0627\u062d\u062f\u0629 \u0625\u0644\u0649 \u0642\u064a\u0645\u062a\u0647\u0627 \u0627\u0644\u0642\u0635\u0648\u0649 \u0648\u0648\u062b\u0651\u0642 \u0645\u0627 \u064a\u062d\u062f\u062b.',"
        "daily_d4:'\u0627\u0631\u0633\u0645 \u0645\u062e\u0637\u0637\u0627\u064b \u064a\u0648\u0636\u062d \u062a\u062f\u0641\u0642 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0641\u064a \u0647\u0630\u0647 \u0627\u0644\u0645\u062d\u0627\u0643\u0627\u0629.',"
        "daily_d5:'\u0627\u0643\u062a\u0628 \u0627\u0644\u0643\u0648\u062f \u0627\u0644\u0632\u0627\u0626\u0641 \u0644\u0644\u062e\u0648\u0627\u0631\u0632\u0645\u064a\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645\u0629 \u0641\u064a \u0647\u0630\u0627 \u0627\u0644\u062a\u0637\u0628\u064a\u0642.',"
        "daily_d6:'\u0642\u0627\u0631\u0646 \u0627\u0644\u0646\u062a\u0627\u0626\u062c \u0628\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u0627\u0641\u062a\u0631\u0627\u0636\u064a\u0629 \u0648\u0627\u0644\u0645\u0639\u062f\u0644\u0629 \u0648\u0644\u0627\u062d\u0638 3 \u0627\u062e\u062a\u0644\u0627\u0641\u0627\u062a.',"
        "daily_d7:'\u0636\u0639 \u0641\u0631\u0636\u064a\u0629 \u062d\u0648\u0644 \u0645\u0627 \u064a\u062d\u062f\u062b \u0625\u0630\u0627 \u0636\u0627\u0639\u0641\u062a \u0627\u0644\u0645\u0639\u0644\u0645\u0629 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629 \u062b\u0645 \u0627\u062e\u062a\u0628\u0631\u0647\u0627.',"
        "mentorTitle:'\U0001f393 \u062f\u0644\u064a\u0644 \u062a\u0639\u0644\u064a\u0645\u064a',"
        "mentorStart:'\u0628\u062f\u0621 \u0627\u0644\u062f\u0644\u064a\u0644',"
        "mentorNext:'\u0627\u0644\u062a\u0627\u0644\u064a',"
        "mentorPrev:'\u0627\u0644\u0633\u0627\u0628\u0642',"
        "mentorDone:'\u0625\u0646\u0647\u0627\u0621',"
        "mentorStep:'\u062e\u0637\u0648\u0629',"
        "mentor_s1:'\u0627\u0646\u0638\u0631 \u0625\u0644\u0649 \u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u0639\u0631\u0636 \u0627\u0644\u0631\u0626\u064a\u0633\u064a\u0629 \u2014 \u0647\u0646\u0627 \u062a\u0639\u0645\u0644 \u0627\u0644\u0645\u062d\u0627\u0643\u0627\u0629 \u0641\u064a \u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0641\u0639\u0644\u064a.',"
        "mentor_s2:'\u0627\u0636\u063a\u0637 \u0639\u0644\u0649 \u0627\u0628\u062f\u0623 \u0644\u062a\u0634\u063a\u064a\u0644 \u0627\u0644\u0645\u062d\u0627\u0643\u0627\u0629. \u0631\u0627\u0642\u0628 \u0643\u064a\u0641 \u064a\u062a\u0641\u0627\u0639\u0644 \u0627\u0644\u0639\u0631\u0636.',"
        "mentor_s3:'\u062c\u0631\u0651\u0628 \u062a\u0639\u062f\u064a\u0644 \u0634\u0631\u064a\u0637 \u062a\u0645\u0631\u064a\u0631 \u0648\u0627\u062d\u062f \u2014 \u0644\u0627\u062d\u0638 \u0643\u064a\u0641 \u064a\u0624\u062b\u0631 \u0639\u0644\u0649 \u0627\u0644\u0646\u062a\u064a\u062c\u0629 \u0641\u0648\u0631\u0627\u064b.',"
        "mentor_s4:'\u0627\u0641\u062a\u062d \u0644\u0648\u062d\u0629 \u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629 \u0648\u0627\u0633\u062a\u0643\u0634\u0641 \u062a\u0628\u0648\u064a\u0628 \u0627\u0644\u0648\u064a\u0643\u064a \u0644\u0645\u0639\u0631\u0641\u0629 \u0623\u0639\u0645\u0642.',"
        "mentor_s5:'\u0623\u0643\u0645\u0644 \u062a\u062d\u062f\u064a\u0627\u064b \u0648\u0627\u062d\u062f\u0627\u064b \u0644\u0627\u062e\u062a\u0628\u0627\u0631 \u0641\u0647\u0645\u0643 \u0644\u0644\u0645\u0641\u0627\u0647\u064a\u0645.',"
    )


# ── JS functions to append ──
JS_FUNCTIONS = r"""
/* ═══════ DAILY CHALLENGE ═══════ */
function initDailyChallenge(){const L=LANG[document.documentElement.lang||'en'];const dc=document.getElementById('dailyChallenge');if(!dc||!L.dailyTitle)return;const dayIndex=new Date().getDay();const challengeKey='daily_d'+(dayIndex===0?7:dayIndex);const appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';const streakKey=appDir+'_streak';let streak=parseInt(localStorage.getItem(streakKey)||'0');const lastDate=localStorage.getItem(streakKey+'_date')||'';const today=new Date().toDateString();dc.innerHTML='<h3 data-i18n="dailyTitle">'+L.dailyTitle+'</h3>'+'<p style="font-size:0.95rem;margin:0.5rem 0;" data-i18n="'+challengeKey+'">'+(L[challengeKey]||'Complete today\x27s challenge!')+'</p>'+'<button class="btn-sm" id="dailyHintBtn" style="margin:0.3rem 0;" data-i18n="dailyHint">'+L.dailyHint+'</button>'+'<p id="dailyHintText" style="display:none;font-size:0.8rem;opacity:0.7;margin:0.3rem 0;">Think step by step. Break the problem into smaller parts.</p>'+'<div style="margin:0.5rem 0;font-size:1.1rem;">\ud83d\udd25 <span data-i18n="dailyStreak">'+L.dailyStreak+'</span>: <strong id="streakCount">'+streak+'</strong></div>'+'<button class="btn-sm" id="dailyCompleteBtn" data-i18n="dailyComplete">'+L.dailyComplete+'</button>';document.getElementById('dailyHintBtn').onclick=function(){const h=document.getElementById('dailyHintText');h.style.display=h.style.display==='none'?'block':'none';};document.getElementById('dailyCompleteBtn').onclick=function(){if(lastDate===today)return;streak++;localStorage.setItem(streakKey,streak);localStorage.setItem(streakKey+'_date',today);document.getElementById('streakCount').textContent=streak;this.textContent='\u2705';this.disabled=true;if(typeof playSound==='function')playSound('success');};}

/* ═══════ MENTOR MODE ═══════ */
function initMentorMode(){const L=LANG[document.documentElement.lang||'en'];const ov=document.getElementById('mentorOverlay');if(!ov||!L.mentorTitle)return;let step=0;const total=5;const appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';const doneKey=appDir+'_mentor_done';function renderStep(){const s=L['mentor_s'+(step+1)]||'Step '+(step+1);ov.innerHTML='<div style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9998;" id="mentorBg"></div>'+'<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;background:var(--card-bg,#1a1a2e);border:2px solid var(--accent,#d4af37);border-radius:12px;padding:1.5rem;max-width:400px;width:90%;text-align:center;color:var(--text,#fff);">'+'<h3 data-i18n="mentorTitle">'+L.mentorTitle+'</h3>'+'<p style="font-size:0.8rem;opacity:0.6;margin:0.3rem 0;">'+(L.mentorStep||'Step')+' '+(step+1)+'/'+total+'</p>'+'<p style="font-size:0.95rem;line-height:1.5;margin:1rem 0;" data-i18n="mentor_s'+(step+1)+'">'+s+'</p>'+'<div style="display:flex;gap:0.5rem;justify-content:center;margin-top:1rem;">'+(step>0?'<button class="btn-sm" id="mentorPrevBtn" data-i18n="mentorPrev">'+(L.mentorPrev||'Previous')+'</button>':'')+(step<total-1?'<button class="btn-sm" id="mentorNextBtn" data-i18n="mentorNext">'+(L.mentorNext||'Next')+'</button>':'<button class="btn-sm" id="mentorDoneBtn" data-i18n="mentorDone">'+(L.mentorDone||'Finish')+'</button>')+'</div></div>';var bg=document.getElementById('mentorBg');if(bg)bg.onclick=closeMentor;if(document.getElementById('mentorPrevBtn'))document.getElementById('mentorPrevBtn').onclick=function(){step--;renderStep();};if(document.getElementById('mentorNextBtn'))document.getElementById('mentorNextBtn').onclick=function(){step++;renderStep();};if(document.getElementById('mentorDoneBtn'))document.getElementById('mentorDoneBtn').onclick=closeMentor;}function closeMentor(){ov.innerHTML='';ov.style.display='none';localStorage.setItem(doneKey,'1');}var tb=document.getElementById('mentorTriggerBtn');if(tb)tb.onclick=function(){step=0;ov.style.display='block';renderStep();};}

document.addEventListener('DOMContentLoaded',function(){initDailyChallenge();initMentorMode();});
"""

# ── HTML to insert ──
HTML_INSERT = (
    '<div class="daily-challenge" id="dailyChallenge" style="margin:1rem 0;padding:1rem;border-radius:10px;'
    'background:rgba(var(--accent-rgb,212,175,55),0.08);border:1px solid rgba(var(--accent-rgb,212,175,55),0.2);"></div>'
    '<div class="mentor-overlay" id="mentorOverlay" style="display:none;"></div>'
    '<button id="mentorTriggerBtn" class="btn-sm" '
    'style="margin:0.5rem 0.3rem;padding:0.4rem 0.8rem;border-radius:20px;border:1px solid var(--accent,#d4af37);'
    'background:rgba(var(--accent-rgb,212,175,55),0.1);cursor:pointer;font-size:0.8rem;color:inherit;"'
    ' data-i18n="mentorStart">\U0001f393 Tutorial</button>'
)


def process_script(filepath):
    """Inject LANG keys and JS functions into script.js. Returns True if modified."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has these features (both LANG keys AND JS functions)
    if ('dailyTitle' in content or 'mentorTitle' in content) and 'initDailyChallenge' in content:
        return False

    dirpath = os.path.dirname(filepath)
    category = get_category(dirpath)
    app_name = get_app_name(dirpath)

    en_keys = make_en_keys(category, app_name)
    fr_keys = make_fr_keys(category, app_name)
    ar_keys = make_ar_keys(category, app_name)

    # Determine format: old (has ...LANG_BASE.fr) or new (no ...LANG_BASE.fr)
    has_spread_fr = '...LANG_BASE.fr' in content
    needs_lang_keys = 'dailyTitle' not in content

    if has_spread_fr and needs_lang_keys:
        # OLD FORMAT: multi-line with ...LANG_BASE.en, ...LANG_BASE.fr, ...LANG_BASE.ar
        # Insert EN keys after ...LANG_BASE.en, line
        content = content.replace(
            '...LANG_BASE.en,\n',
            '...LANG_BASE.en,\n    ' + en_keys + '\n',
            1
        )
        # Insert FR keys after ...LANG_BASE.fr, line
        content = content.replace(
            '...LANG_BASE.fr,\n',
            '...LANG_BASE.fr,\n    ' + fr_keys + '\n',
            1
        )
        # Insert AR keys after ...LANG_BASE.ar, line
        content = content.replace(
            '...LANG_BASE.ar,\n',
            '...LANG_BASE.ar,\n    ' + ar_keys + '\n',
            1
        )
    elif not has_spread_fr and needs_lang_keys:
        # NEW FORMAT: const LANG={en:{\n    ...LANG_BASE.en, then inline keys
        # fr:{ and ar:{ are inline without spread markers
        # EN: insert after ...LANG_BASE.en,
        content = content.replace(
            '...LANG_BASE.en,',
            '...LANG_BASE.en,' + en_keys,
            1
        )
        # FR: For the new format, fr block starts with },fr:{ inline.
        # We need to find the fr:{ transition and insert after it
        # The pattern is },fr:{...  we insert our keys right after },fr:{
        # But we need to be careful — there could be },fr:{ in LANG_BASE too.
        # The LANG_BASE fr block looks like: fr: {\n    copied:...
        # The LANG block fr looks like: },fr:{title:...  (inline, no newline)
        # Strategy: find },fr:{ that is NOT preceded by newline (inline in LANG)
        # Actually in the new format sample (esc-vpn-chain-builder), the pattern is:
        # mistake3:'..text..'},fr:{title:'VPN...
        # So we replace the FIRST },fr:{ occurrence after ...LANG_BASE.en
        # Let's find the position of ...LANG_BASE.en and then find },fr:{ after it
        base_en_pos = content.find('...LANG_BASE.en,')
        if base_en_pos >= 0:
            fr_marker = '},fr:{'
            fr_pos = content.find(fr_marker, base_en_pos)
            if fr_pos >= 0:
                insert_at = fr_pos + len(fr_marker)
                content = content[:insert_at] + fr_keys + content[insert_at:]

            # AR: similarly find },ar:{ after the fr block
            ar_marker = '},ar:{'
            ar_pos = content.find(ar_marker, fr_pos + 1 if fr_pos >= 0 else base_en_pos)
            if ar_pos >= 0:
                insert_at = ar_pos + len(ar_marker)
                content = content[:insert_at] + ar_keys + content[insert_at:]

    # Append JS functions after the LANG closing (only if not already present)
    # Old format: LANG closes with standalone '};' on its own line after ...LANG_BASE.ar block
    # New format: LANG closes with '}};' inline at end of ar block
    lang_base_pos = content.find('...LANG_BASE.en')
    js_inserted = 'initDailyChallenge' in content  # Already has JS functions
    if lang_base_pos >= 0 and not js_inserted:
        if has_spread_fr:
            # OLD FORMAT: find standalone '};' on its own line after ...LANG_BASE.ar
            ar_pos = content.find('...LANG_BASE.ar', lang_base_pos)
            if ar_pos >= 0:
                lines = content.split('\n')
                # Find which line has ...LANG_BASE.ar
                char_count = 0
                ar_line = 0
                for i, line in enumerate(lines):
                    if char_count <= ar_pos < char_count + len(line) + 1:
                        ar_line = i
                        break
                    char_count += len(line) + 1
                # Find first standalone '};' after ar_line
                for i in range(ar_line + 1, len(lines)):
                    if lines[i].strip() == '};':
                        lines.insert(i + 1, JS_FUNCTIONS)
                        content = '\n'.join(lines)
                        js_inserted = True
                        break
        else:
            # NEW FORMAT: find '}};' that closes the LANG object
            # The LANG object is: const LANG={en:{...},fr:{...},ar:{...}};
            # We need to find the correct '}};' — the one that closes ar block + LANG
            # Strategy: find ...LANG_BASE.ar or },ar:{ and then find '}};' after it
            ar_marker_pos = content.find('},ar:{', lang_base_pos)
            if ar_marker_pos < 0:
                ar_marker_pos = lang_base_pos
            close_pos = content.find('}};', ar_marker_pos)
            if close_pos >= 0:
                insert_pos = close_pos + 3
                # Skip one trailing newline if present
                if insert_pos < len(content) and content[insert_pos] == '\n':
                    insert_pos += 1
                content = content[:insert_pos] + '\n' + JS_FUNCTIONS + '\n' + content[insert_pos:]
                js_inserted = True

        if not js_inserted:
            # Fallback: find first standalone '};' after LANG_BASE.en
            lines = content.split('\n')
            found_lang = False
            for i, line in enumerate(lines):
                if '...LANG_BASE.en' in line:
                    found_lang = True
                if found_lang and line.strip() == '};':
                    lines.insert(i + 1, JS_FUNCTIONS)
                    content = '\n'.join(lines)
                    js_inserted = True
                    break

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    return True


def process_html(filepath):
    """Insert HTML elements into index.html. Returns True if modified."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'dailyChallenge' in content or 'mentorOverlay' in content:
        return False

    # Insert before <script src="script.js"></script>
    marker = '<script src="script.js"></script>'
    if marker in content:
        content = content.replace(marker, HTML_INSERT + marker, 1)
    else:
        # Fallback: insert before </body>
        content = content.replace('</body>', HTML_INSERT + '</body>', 1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    return True


def main():
    # Find all script.js files
    pattern = os.path.join(ROOT, '*', '*', 'script.js')
    scripts = sorted(glob.glob(pattern))

    print(f'Found {len(scripts)} script.js files')

    js_modified = 0
    js_skipped = 0
    html_modified = 0
    html_skipped = 0
    errors = []

    for script_path in scripts:
        app_dir = os.path.dirname(script_path)
        html_path = os.path.join(app_dir, 'index.html')

        try:
            if process_script(script_path):
                js_modified += 1
            else:
                js_skipped += 1

            if os.path.exists(html_path):
                if process_html(html_path):
                    html_modified += 1
                else:
                    html_skipped += 1
        except Exception as e:
            errors.append(f'{script_path}: {e}')

    print(f'\n--- RESULTS ---')
    print(f'script.js modified: {js_modified}')
    print(f'script.js skipped (already had features): {js_skipped}')
    print(f'index.html modified: {html_modified}')
    print(f'index.html skipped: {html_skipped}')
    if errors:
        print(f'\nERRORS ({len(errors)}):')
        for e in errors:
            print(f'  {e}')

    # Syntax check with node -c on 25 sample files spread across categories
    print(f'\n--- SYNTAX VALIDATION (node -c) ---')
    step = max(1, len(scripts) // 25)
    sample = scripts[::step][:25]
    syntax_ok = 0
    syntax_fail = 0
    for s in sample:
        try:
            result = subprocess.run(
                ['node', '-c', s],
                capture_output=True, text=True, timeout=10
            )
            if result.returncode == 0:
                syntax_ok += 1
            else:
                syntax_fail += 1
                print(f'  FAIL: {s}')
                print(f'    {result.stderr.strip()[:200]}')
        except Exception as e:
            syntax_fail += 1
            print(f'  ERROR: {s}: {e}')

    print(f'Syntax OK: {syntax_ok}/{len(sample)}')
    print(f'Syntax FAIL: {syntax_fail}/{len(sample)}')

    print(f'\n--- SUMMARY ---')
    print(f'Total apps processed: {js_modified + js_skipped}')
    print(f'Features added to: {js_modified} script.js + {html_modified} index.html')
    print(f'Already had features: {js_skipped}')
    print(f'Errors: {len(errors)}')


if __name__ == '__main__':
    main()
