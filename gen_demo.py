#!/usr/bin/env python3
"""Phase 4: Add 'Watch Demo' guided walkthrough section to all 488 apps.

Adds a 5-step auto-playing demo with:
- Narration text (kid-friendly, trilingual)
- Highlight target elements
- Play/Pause/Prev/Next controls
- Progress bar
"""

import os
import re
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))


def get_domain(cat_dir):
    prefix = cat_dir.split('-')[0]
    domain_map = {
        '01': 'spy', '02': 'spy', '03': 'spy', '04': 'spy',
        '05': 'net', '06': 'net', '07': 'net', '08': 'net', '09': 'net',
        '10': 'hrf', '11': 'hrf', '12': 'hrf', '13': 'hrf',
        '14': 'wifi', '15': 'wifi', '16': 'wifi', '17': 'wifi', '18': 'wifi',
        '19': 'ham', '20': 'ham', '21': 'ham', '22': 'ham', '23': 'ham',
        '24': 'ham', '25': 'ham', '26': 'ham',
        '27': 'sdr', '28': 'sdr', '29': 'sdr', '30': 'sdr',
        '31': 'sdr', '32': 'sdr', '33': 'sdr', '34': 'sdr',
        '35': 'ant', '36': 'pi', '37': 'pi', '38': 'pi',
        '39': 'agent', '40': 'agent', '41': 'ant', '42': 'agent',
        '43': 'bio', '44': 'sonic', '45': 'chrono', '46': 'swarm',
        '47': 'phys', '48': 'dark', '49': 'ai', '50': 'civ',
        '51': 'se', '52': 'imp', '53': 'cry', '54': 'rfw', '55': 'esc',
    }
    return domain_map.get(prefix, 'spy')


# Demo narration per domain (5 steps each) — EN/FR/AR
DEMO_NARRATION = {
    'spy': {
        'en': [
            "Welcome! Let's explore this spy tool. First, look at the main control panel above. 🕵️",
            "Click the primary button to start the simulation. Watch the visualization come alive! ⚡",
            "Now try changing a setting — slide a slider or pick a different option. See how it changes? 🔄",
            "Check the results below. The numbers and graphs show you what happened in real time. 📊",
            "Great job! 🎉 Now try the Lab section below for hands-on experiments. You're a real spy now!",
        ],
        'fr': [
            "Bienvenue ! Explorons cet outil d'espion. D'abord, regarde le panneau de contrôle. 🕵️",
            "Clique sur le bouton principal pour démarrer. Regarde la visualisation s'animer ! ⚡",
            "Maintenant change un réglage — déplace un curseur ou choisis une option. Tu vois la différence ? 🔄",
            "Vérifie les résultats. Les chiffres et graphiques montrent ce qui s'est passé. 📊",
            "Bravo ! 🎉 Essaie maintenant la section Labo pour des expériences pratiques !",
        ],
        'ar': [
            "مرحباً! لنستكشف أداة التجسس هذه. أولاً، انظر إلى لوحة التحكم الرئيسية. 🕵️",
            "اضغط على الزر الرئيسي لبدء المحاكاة. شاهد التصور يتحرك! ⚡",
            "الآن جرب تغيير إعداد — حرك شريط تمرير أو اختر خياراً مختلفاً. هل ترى الفرق؟ 🔄",
            "تحقق من النتائج. الأرقام والرسوم البيانية تُظهر ما حدث. 📊",
            "أحسنت! 🎉 جرب الآن قسم المختبر للتجارب العملية!",
        ],
    },
}

# Generate for remaining domains with similar pattern
for domain in ['net', 'wifi', 'ham', 'sdr', 'hrf', 'ant', 'pi', 'agent',
               'bio', 'sonic', 'chrono', 'swarm', 'phys', 'dark', 'ai',
               'civ', 'se', 'imp', 'cry', 'rfw', 'esc']:
    if domain in DEMO_NARRATION:
        continue
    DEMO_NARRATION[domain] = {
        'en': [
            f"Welcome! Let's explore this simulation together. Look at the main section above. 🔬",
            "Click the primary action button to start. Watch the visualization respond in real time! ⚡",
            "Now change a setting — try a slider or dropdown. See how the output changes? 🔄",
            "Check the results — the graphs and numbers show what's happening under the hood. 📊",
            "Awesome! 🎉 You've got the basics. Try the Lab section below for deeper experiments!",
        ],
        'fr': [
            f"Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬",
            "Clique sur le bouton d'action pour démarrer. Regarde la visualisation réagir ! ⚡",
            "Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄",
            "Vérifie les résultats — les graphiques montrent ce qui se passe. 📊",
            "Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !",
        ],
        'ar': [
            f"مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬",
            "اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡",
            "غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄",
            "تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊",
            "رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!",
        ],
    }


DEMO_HTML = """
      <details class="collapsible">
        <summary><span class="icon">▶️</span> <span data-i18n="sectionDemo">Watch Demo</span></summary>
        <div class="card">
          <div class="demo-player">
            <div class="demo-step-display">
              <div class="demo-step-num" id="demoCurrentStep">1/5</div>
              <div class="demo-narration" id="demoNarration" data-i18n="demo_s1">Click Play to start the guided demo...</div>
            </div>
            <div class="demo-progress"><div class="demo-progress-bar" id="demoProgressBar" style="width:0%"></div></div>
            <div class="demo-controls">
              <button class="btn-sm" id="demoPrevBtn" onclick="demoNav(-1)">⏮ <span data-i18n="demoPrev">Prev</span></button>
              <button class="btn-sm primary" id="demoPlayBtn" onclick="demoToggle()">▶ <span data-i18n="demoPlay">Play</span></button>
              <button class="btn-sm" id="demoNextBtn" onclick="demoNav(1)"><span data-i18n="demoNext">Next</span> ⏭</button>
            </div>
          </div>
        </div>
      </details>"""


DEMO_CSS = """
    /* Demo player */
    .demo-player { padding: 0.5rem; }
    .demo-step-display { display: flex; align-items: flex-start; gap: 0.8rem; margin-bottom: 0.8rem; }
    .demo-step-num { font-size: 0.8rem; opacity: 0.6; white-space: nowrap; padding-top: 0.2rem; }
    .demo-narration { font-size: 0.95rem; line-height: 1.5; min-height: 2.5em; }
    .demo-progress { height: 4px; background: rgba(var(--accent-rgb), 0.15); border-radius: 2px; margin-bottom: 0.8rem; }
    .demo-progress-bar { height: 100%; background: var(--accent); border-radius: 2px; transition: width 0.4s ease; }
    .demo-controls { display: flex; gap: 0.5rem; justify-content: center; }
"""


DEMO_JS = """
// ── Demo Engine ──
var _demoStep = 0, _demoPlaying = false, _demoTimer = null;
var _demoSteps = (typeof DEMO_STEPS !== 'undefined') ? DEMO_STEPS : [];

function demoNav(dir) {
  _demoStep = Math.max(0, Math.min(_demoSteps.length - 1, _demoStep + dir));
  demoShow();
}

function demoToggle() {
  _demoPlaying = !_demoPlaying;
  var btn = document.getElementById('demoPlayBtn');
  if (btn) btn.innerHTML = _demoPlaying ? '⏸ <span data-i18n="demoPause">Pause</span>' : '▶ <span data-i18n="demoPlay">Play</span>';
  if (_demoPlaying) {
    demoShow();
    _demoTimer = setInterval(function() {
      if (_demoStep < _demoSteps.length - 1) { _demoStep++; demoShow(); }
      else { _demoPlaying = false; clearInterval(_demoTimer); var b = document.getElementById('demoPlayBtn'); if(b) b.innerHTML = '▶ <span data-i18n=\"demoPlay\">Play</span>'; }
    }, 3000);
  } else {
    clearInterval(_demoTimer);
  }
}

function demoShow() {
  var step = _demoSteps[_demoStep];
  if (!step) return;
  var numEl = document.getElementById('demoCurrentStep');
  var narEl = document.getElementById('demoNarration');
  var barEl = document.getElementById('demoProgressBar');
  if (numEl) numEl.textContent = (_demoStep + 1) + '/' + _demoSteps.length;
  if (narEl) { narEl.setAttribute('data-i18n', step.i18n); narEl.textContent = step.text; if (typeof applyLang === 'function') applyLang(); }
  if (barEl) barEl.style.width = ((_demoStep + 1) / _demoSteps.length * 100) + '%';
  // Remove old highlights
  document.querySelectorAll('.demo-highlight').forEach(function(el) { el.classList.remove('demo-highlight'); });
  // Add highlight
  if (step.target) { var t = document.querySelector(step.target); if (t) { t.classList.add('demo-highlight'); t.scrollIntoView({behavior:'smooth', block:'center'}); } }
}
"""


def get_btn_ids(html_content):
    """Extract button IDs from HTML for demo targeting."""
    ids = []
    for m in re.finditer(r'id="(btn\d+|[a-zA-Z]+Btn)"', html_content):
        ids.append('#' + m.group(1))
    return ids[:3]  # First 3 buttons


def inject_demo_html(html_content):
    """Add demo section after step-grid/sectionA and before sectionB/Lab."""
    if 'sectionDemo' in html_content:
        return html_content, False

    # Insert before sectionB or before the Device Code section
    insert_patterns = [
        r'<!-- ═+ SECTION B',
        r'<details\s+class="collapsible"[^>]*>\s*<summary>.*?data-i18n="sectionB"',
        r'<details\s+class="collapsible">\s*<summary>.*?data-i18n="sectionCode"',
        r'<details\s+class="collapsible">\s*<summary><span class="icon">📦',
    ]

    for pattern in insert_patterns:
        m = re.search(pattern, html_content, re.DOTALL)
        if m:
            pos = m.start()
            html_content = html_content[:pos] + DEMO_HTML + '\n\n      ' + html_content[pos:]
            return html_content, True

    # Fallback: insert before footer
    footer = re.search(r'</div>\s*<footer', html_content)
    if footer:
        pos = footer.start()
        html_content = html_content[:pos] + DEMO_HTML + '\n    ' + html_content[pos:]
        return html_content, True

    return html_content, False


def inject_demo_css(html_content):
    """Add demo CSS."""
    if '.demo-player' in html_content:
        return html_content

    style_end = html_content.rfind('</style>')
    if style_end > 0:
        html_content = html_content[:style_end] + DEMO_CSS + html_content[style_end:]
    return html_content


def inject_demo_js_and_i18n(script_content, demo_steps_en, demo_steps_fr, demo_steps_ar, btn_ids):
    """Add DEMO_STEPS array and demo engine to script.js."""
    if 'DEMO_STEPS' in script_content:
        return script_content

    # Build DEMO_STEPS array
    steps_js = "var DEMO_STEPS = [\n"
    for i, (text, target) in enumerate(zip(demo_steps_en, btn_ids + ['#simCanvas', '#mainCard'])):
        steps_js += f"  {{i18n:'demo_s{i+1}', text:'{text.replace(chr(39), chr(92)+chr(39))}', target:'{target}', delay:3000}},\n"
    steps_js += "];\n"

    # Add i18n keys
    new_content = script_content

    i18n_additions = {
        'en': [],
        'fr': [],
        'ar': [],
    }

    for i, text in enumerate(demo_steps_en, 1):
        i18n_additions['en'].append(f"demo_s{i}:'{text.replace(chr(39), chr(92)+chr(39))}'")
    for i, text in enumerate(demo_steps_fr, 1):
        i18n_additions['fr'].append(f"demo_s{i}:'{text.replace(chr(39), chr(92)+chr(39))}'")
    for i, text in enumerate(demo_steps_ar, 1):
        i18n_additions['ar'].append(f"demo_s{i}:'{text.replace(chr(39), chr(92)+chr(39))}'")

    # Add common keys
    i18n_additions['en'].extend(["sectionDemo:'Watch Demo'", "demoPlay:'Play'", "demoPause:'Pause'", "demoPrev:'Prev'", "demoNext:'Next'"])
    i18n_additions['fr'].extend(["sectionDemo:'Voir la Démo'", "demoPlay:'Jouer'", "demoPause:'Pause'", "demoPrev:'Préc'", "demoNext:'Suiv'"])
    i18n_additions['ar'].extend(["sectionDemo:'شاهد العرض'", "demoPlay:'تشغيل'", "demoPause:'إيقاف'", "demoPrev:'السابق'", "demoNext:'التالي'"])

    for lang in ['en', 'fr', 'ar']:
        lang_start = re.search(rf'\b{lang}\s*:\s*\{{', new_content)
        if not lang_start:
            continue
        start = lang_start.end()
        depth = 1
        pos = start
        while pos < len(new_content) and depth > 0:
            if new_content[pos] == '{': depth += 1
            elif new_content[pos] == '}': depth -= 1
            pos += 1
        close_pos = pos - 1
        insert = ',' + ','.join(i18n_additions[lang])
        new_content = new_content[:close_pos] + insert + new_content[close_pos:]

    # Add DEMO_STEPS and engine at the end
    new_content += '\n' + steps_js + DEMO_JS

    return new_content


# ═══════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════

fixed = 0

for script_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'script.js'))):
    app_dir = os.path.dirname(script_path)
    app_name = os.path.basename(app_dir)
    cat_name = os.path.basename(os.path.dirname(app_dir))
    domain = get_domain(cat_name)

    with open(script_path, 'r', encoding='utf-8') as f:
        script_content = f.read()

    if 'DEMO_STEPS' in script_content:
        continue

    html_path = os.path.join(app_dir, 'index.html')
    if not os.path.exists(html_path):
        continue

    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Get demo narration for this domain
    narration = DEMO_NARRATION.get(domain, DEMO_NARRATION['spy'])
    demo_en = narration['en']
    demo_fr = narration['fr']
    demo_ar = narration['ar']

    # Get button IDs for targeting
    btn_ids = get_btn_ids(html_content)
    if not btn_ids:
        btn_ids = ['#mainCard']

    # Inject HTML
    html_content = inject_demo_css(html_content)
    html_content, html_ok = inject_demo_html(html_content)

    if html_ok:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

    # Inject JS
    new_script = inject_demo_js_and_i18n(script_content, demo_en, demo_fr, demo_ar, btn_ids)
    if new_script != script_content:
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(new_script)

    fixed += 1
    if fixed % 50 == 0:
        print(f"  ... processed {fixed} apps")

print(f"\n✓ Added demo section to {fixed} apps")
