#!/usr/bin/env python3
"""
Rebuild 181 broken apps that lost their body structure.
These apps have FAQ items floating in <body> instead of proper layout.
Uses the working app template (splash, header, mainCard, sidebars).
Preserves all enhanced sections (Learn, Demo, Code, step cards) and FAQ from script.js.
"""
import os, re, glob, json

ROOT = '/home/abdelhak/Desktop/00_amaloun/05_more_apps/ops-catalog'

# ── Extract app metadata from script.js ──────────────────────────────
def extract_meta(script_path):
    """Extract title, subtitle, mainSection, mainDesc, sectionA, sectionB, sectionC from EN block."""
    js = open(script_path, encoding='utf-8').read()
    meta = {}
    for key in ['title', 'subtitle', 'mainSection', 'mainDesc', 'sectionA', 'sectionB', 'sectionC']:
        # Match key: 'value' or key: "value" in first EN block
        m = re.search(rf"(?:^|\n)\s*{key}\s*:\s*['\"](.+?)['\"]", js[:js.find("fr:{")] if "fr:{" in js else js)
        if not m:
            m = re.search(rf"(?:^|\n)\s*{key}\s*:\s*['\"](.+?)['\"]", js)
        if m:
            meta[key] = m.group(1)
    return meta


# ── Extract existing enhanced sections from broken HTML ──────────────
def extract_sections(html):
    """Pull out Learn, Demo, Code, step-grid, and How-It-Works sections."""
    sections = {}

    # Learn section
    m = re.search(r'(<details class="collapsible"[^>]*>\s*<summary>.*?sectionLearn.*?</details>)', html, re.DOTALL)
    if m:
        sections['learn'] = m.group(1)

    # Demo section
    m = re.search(r'(<details class="collapsible"[^>]*>\s*<summary>.*?sectionDemo.*?</details>)', html, re.DOTALL)
    if m:
        sections['demo'] = m.group(1)

    # Device Code section
    m = re.search(r'(<details class="collapsible"[^>]*>\s*<summary>.*?sectionCode.*?</details>)', html, re.DOTALL)
    if m:
        sections['code'] = m.group(1)

    # How It Works (step-grid inside collapsible with sectionA or step-grid standalone)
    m = re.search(r'(<details class="collapsible"[^>]*>\s*<summary>.*?sectionA.*?</details>)', html, re.DOTALL)
    if m:
        sections['sectionA'] = m.group(1)

    m = re.search(r'(<details class="collapsible"[^>]*>\s*<summary>.*?sectionB.*?</details>)', html, re.DOTALL)
    if m:
        sections['sectionB'] = m.group(1)

    # FAQ items
    faq_items = re.findall(r'<details class="help-item">.*?</details>', html, re.DOTALL)
    if faq_items:
        sections['faq'] = '\n        '.join(faq_items)

    # HowTo steps
    howto = re.findall(r'<div class="help-step">.*?</div>', html, re.DOTALL)
    if howto:
        sections['howto'] = ''.join(howto)

    # Wiki entries
    wiki = re.findall(r'<div class="wiki-entry">.*?</div>', html, re.DOTALL)
    if wiki:
        sections['wiki'] = ''.join(wiki)

    return sections


# ── Extract <head> inline CSS ────────────────────────────────────────
def extract_inline_css(html):
    """Extract all <style> content from <head>."""
    styles = re.findall(r'<style>(.*?)</style>', html, re.DOTALL)
    return '\n'.join(styles) if styles else ''


# ── Get category icon ────────────────────────────────────────────────
CAT_ICONS = {
    'spy': '🕵️', 'net': '🌐', 'hrf': '📡', 'wifi': '📶', 'ham': '📻',
    'sdr': '📻', 'ant': '📡', 'pi': '🔧', 'agent': '🕶️', 'bio': '🧬',
    'sonic': '🔊', 'chrono': '⏱️', 'swarm': '🐝', 'phys': '⚛️',
    'dark': '🌑', 'ai': '🤖', 'civ': '🏛️', 'se': '🎭', 'imp': '🔮',
    'cry': '🔐', 'rfw': '📡', 'esc': '🏃'
}

def get_domain_icon(app_dir):
    cat = os.path.basename(os.path.dirname(app_dir))
    for prefix, icon in CAT_ICONS.items():
        if prefix in cat.lower():
            return icon
    return '🔬'


# ── Find a working sibling app for howto/wiki fallback ───────────────
def find_working_sibling(app_dir):
    """Find a working app in the same category to borrow howto/wiki from."""
    cat_dir = os.path.dirname(app_dir)
    for sibling in sorted(glob.glob(os.path.join(cat_dir, '*/index.html'))):
        if sibling == os.path.join(app_dir, 'index.html'):
            continue
        html = open(sibling, encoding='utf-8').read()
        if '<div class="splash"' in html:
            return html
    return None


# ── Detect hardware platform from code/ directory ────────────────────
def detect_platforms(app_dir):
    code_dir = os.path.join(app_dir, 'code')
    if not os.path.isdir(code_dir):
        return []
    return sorted(os.listdir(code_dir))


# ── Build code tabs HTML ─────────────────────────────────────────────
def build_code_html(app_dir):
    platforms = detect_platforms(app_dir)
    if not platforms:
        return ''

    PLATFORM_LABELS = {
        'micropython': 'MicroPython', 'makecode': 'MakeCode', 'arduino': 'Arduino',
        'python': 'Python', 'gnuradio': 'GNURadio'
    }
    PLATFORM_FILES = {
        'micropython': 'main.py', 'makecode': 'main.js', 'arduino': 'main.ino',
        'python': 'main.py', 'gnuradio': 'main.grc'
    }

    tabs = []
    displays = []
    for i, p in enumerate(platforms):
        label = PLATFORM_LABELS.get(p, p.title())
        active = ' active' if i == 0 else ''
        hidden = '' if i == 0 else ' hidden'
        fname = PLATFORM_FILES.get(p, 'main.py')
        tabs.append(f'<button class="code-tab{active}" data-codetarget="{p}">{label}</button>')
        displays.append(f'<div class="code-display{hidden}" id="code-{p}"><p>📄 <a href="code/{p}/{fname}" target="_blank">code/{p}/{fname}</a></p><button class="btn-sm" onclick="window.open(\'code/{p}/{fname}\')">⬇ Download</button></div>')

    return f'''<details class="collapsible">
        <summary><span class="icon">📦</span> <span data-i18n="sectionCode">Device Code</span></summary>
        <div class="card">
          <div class="code-tabs" id="codeTabs">
            {''.join(tabs)}
          </div>
            {''.join(displays)}
        </div>
      </details>'''


# ── Build the full HTML ──────────────────────────────────────────────
def build_html(app_dir, meta, sections, inline_css, og_desc):
    title = meta.get('title', os.path.basename(app_dir).replace('-', ' ').title())
    subtitle = meta.get('subtitle', '')
    main_section = meta.get('mainSection', title)
    main_desc = meta.get('mainDesc', subtitle)
    section_a = meta.get('sectionA', 'Section A')
    section_b = meta.get('sectionB', 'Section B')
    icon = get_domain_icon(app_dir)

    # FAQ fallback
    faq_html = sections.get('faq', '''<details class="help-item"><summary data-i18n="faq_q1">What does this app do?</summary><p data-i18n="faq_a1">Explore and learn!</p></details>''')

    # HowTo fallback
    howto_html = sections.get('howto', '<div class="help-step"><span class="help-step-num">1</span><p data-i18n="howto_1">Explore the main section to get started.</p></div><div class="help-step"><span class="help-step-num">2</span><p data-i18n="howto_2">Open collapsible sections for more features.</p></div><div class="help-step"><span class="help-step-num">3</span><p data-i18n="howto_3">Check the Activity Log for events.</p></div><div class="help-step"><span class="help-step-num">4</span><p data-i18n="howto_4">Use Settings to customize theme and language.</p></div>')

    # Wiki fallback
    wiki_html = sections.get('wiki', '<div class="wiki-entry"><h3 data-i18n="wiki_themes_title">🎨 Themes</h3><p data-i18n="wiki_themes">8 built-in themes.</p></div><div class="wiki-entry"><h3 data-i18n="wiki_i18n_title">🌐 Languages</h3><p data-i18n="wiki_i18n">EN, FR, AR with RTL.</p></div>')

    # Enhanced sections
    learn_html = sections.get('learn', '')
    demo_html = sections.get('demo', '')

    # Code section: prefer existing, otherwise build from code/ dir
    code_html = sections.get('code', build_code_html(app_dir))

    # Section A with step-grid if we have it, otherwise simple collapsible
    if 'sectionA' in sections:
        section_a_html = sections['sectionA']
    else:
        section_a_html = f'''<details class="collapsible" open><summary><span class="icon">{icon}</span> <span data-i18n="sectionA">{section_a}</span></summary><div class="card"><div id="sectionAContent" style="font-size:.8rem;line-height:1.5;color:var(--text-muted);padding:4px;"><div class="step-grid"><div class="step-card"><div class="step-num">1</div><h4 class="step-title" data-i18n="step1Title">Setup</h4><p class="step-desc" data-i18n="step1Desc">Configure the initial parameters</p></div><div class="step-card"><div class="step-num">2</div><h4 class="step-title" data-i18n="step2Title">Execute</h4><p class="step-desc" data-i18n="step2Desc">Run the simulation</p></div><div class="step-card"><div class="step-num">3</div><h4 class="step-title" data-i18n="step3Title">Analyze</h4><p class="step-desc" data-i18n="step3Desc">Review the results</p></div><div class="step-card"><div class="step-num">4</div><h4 class="step-title" data-i18n="step4Title">Iterate</h4><p class="step-desc" data-i18n="step4Desc">Refine and repeat</p></div></div></div></div></details>'''

    if 'sectionB' in sections:
        section_b_html = sections['sectionB']
    else:
        section_b_html = f'''<details class="collapsible"><summary><span class="icon">📚</span> <span data-i18n="sectionB">{section_b}</span></summary><div class="card"><div id="sectionBContent" style="font-size:.78rem;line-height:1.5;"></div></div></details>'''

    # Clean description for meta
    clean_desc = og_desc or f"{title} — Workshop DIY"

    return f'''<!doctype html>
<html lang="en" dir="ltr" data-theme="mosque-gold">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>{title} — Workshop DIY</title>
  <meta name="description" content="{clean_desc}"/>
  <meta name="author" content="Workshop-DIY — abourdim"/>
  <meta property="og:title" content="{title} — Workshop DIY"/>
  <meta property="og:type" content="website"/>
  <link rel="manifest" href="manifest.json"/>
  <meta name="theme-color" content="#08091a"/>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Righteous&family=Tajawal:wght@400;500;700&family=Bangers&family=Orbitron:wght@500;700&display=swap" rel="stylesheet"/>
  <link rel="stylesheet" href="style.css"/>
  <style>
{inline_css}
</style>
</head>
<body>
  <div class="splash" id="splash" onclick="dismissSplash()"><div class="splash-inner"><div class="splash-logo" id="splashLogo"></div><div class="splash-title">Workshop DIY</div><div class="splash-sub" data-i18n="subtitle">{subtitle}</div><div class="splash-hint" data-i18n="splashHint">tap to skip</div></div></div>
  <div class="app"><div class="deco-band top-band" aria-hidden="true"></div><div class="rows-container">
    <div class="header"><div class="bismillah" aria-hidden="true"><span class="bism-ornament">✦</span> بِسْمِ ٱللَّٰهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ <span class="bism-ornament">✦</span></div>
      <div class="title-block"><div class="logo-wrap" id="logoWrap"></div><div><h1 data-i18n="title">{title}</h1><div class="subtitle" data-i18n="subtitle">{subtitle}</div></div></div>
      <div class="header-right"><div class="header-buttons"><button id="helpBtn" class="btn-icon-only">❓</button><button id="settingsBtn" class="btn-icon-only">⚙️</button><button id="logBtn" class="btn-icon-only">📜</button></div>
        <div class="status-pill" id="statusPill"><span class="status-dot" id="statusDot"></span><span id="statusText" data-i18n="disconnected">Idle</span></div></div>
    </div>
    <div class="card" id="mainCard">
      <div class="card-header"><div><div class="card-title"><span class="icon">{icon}</span> <span data-i18n="mainSection">{main_section}</span></div><div class="card-subtitle"><span data-i18n="mainDesc">{main_desc}</span> <span class="version-tag">v1.0</span></div></div></div>
      <div style="position:relative;border-radius:10px;overflow:hidden;border:1px solid var(--border);margin-bottom:10px;">
        <canvas id="simCanvas" width="780" height="260" style="width:100%;display:block;background:#0a0a1a;cursor:crosshair;"></canvas>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px;">
        <button id="startBtn" class="primary"><span class="btn-icon">▶</span> <span data-i18n="btnStart">Start</span></button>
        <button id="stopBtn"><span class="btn-icon">⏹</span> <span data-i18n="btnStop">Stop</span></button>
        <button id="resetBtn"><span class="btn-icon">🔄</span> <span data-i18n="btnReset">Reset</span></button>
      </div>
    </div>

      {learn_html}

      {demo_html}

      {section_a_html}
    {section_b_html}

      {code_html}

  </div>
  <footer class="app-footer"><span class="footer-text">powered by <a href="https://workshop-diy.org" target="_blank" rel="noopener">workshop-diy.org</a></span><span class="hijri-date" id="hijriDate"></span></footer><div class="deco-band bottom-band" aria-hidden="true"></div></div>
  <canvas id="matrixCanvas" class="matrix-canvas"></canvas>
  <div id="debugPanel" class="debug-panel"><span id="debugFps">0 FPS</span><span id="debugMem">0 MB</span></div>
  <div class="sidebar-overlay" id="helpOverlay"></div>
  <aside class="sidebar sidebar-left" id="helpPanel" aria-label="Help" role="dialog" aria-modal="true"><div class="sidebar-header"><span class="sidebar-title" data-i18n="help">❓ Help</span><button id="helpCloseBtn" class="btn-icon-only">✕</button></div><div class="help-tabs"><button class="help-tab active" data-tab="faq">FAQ</button><button class="help-tab" data-tab="howto">How-To</button><button class="help-tab" data-tab="wiki">Wiki</button></div><div class="sidebar-body"><div class="help-content active" id="helpFaq">
        {faq_html}
      </div><div class="help-content" id="helpHowto">{howto_html}</div><div class="help-content" id="helpWiki">{wiki_html}</div></div><div class="sidebar-footer"><span>Workshop DIY</span><span class="badge"><strong>v1.0</strong></span></div></aside>
  <div class="sidebar-overlay" id="settingsOverlay"></div>
  <aside class="sidebar" id="settingsPanel" aria-label="Settings" role="dialog" aria-modal="true"><div class="sidebar-header"><span class="sidebar-title" data-i18n="settings">⚙️ Settings</span><button id="settingsCloseBtn" class="btn-icon-only">✕</button></div><div class="sidebar-body"><div class="sidebar-group"><label class="sidebar-label" data-i18n="language">Language</label><select id="langSelect" class="sidebar-select"><option value="en" selected>🇬🇧 EN</option><option value="fr">🇫🇷 FR</option><option value="ar">🇩🇿 عربي</option></select></div><div class="sidebar-group"><label class="sidebar-label" data-i18n="theme">Theme</label><select id="themeSelect" class="sidebar-select"><option value="mosque-gold">Mosque</option><option value="zellige">Zellige</option><option value="andalus">Andalus</option><option value="riad">Riad</option><option value="medina">Medina</option><option value="space">Space</option><option value="jungle">Jungle</option><option value="robot">Robot</option></select></div><div class="sidebar-group"><label class="toggle-ctrl"><input type="checkbox" id="soundToggle" class="checkbox-ctrl"/><span data-i18n="soundEffects">🔊 Sound effects</span></label></div></div><div class="sidebar-footer"><span>Workshop DIY</span><span class="badge"><strong>v1.0</strong></span></div></aside>
  <aside class="sidebar" id="logPanel" aria-label="Activity Log"><div class="resize-handle" id="logResizeHandle"></div><div class="sidebar-header"><span class="sidebar-title" data-i18n="activityLog">📜 Activity Log</span><div class="log-controls"><button id="clearLogBtn" class="btn-sm"><span class="btn-icon">🧹</span><span data-i18n="clear">Clear</span></button><button id="copyLogBtn" class="btn-sm"><span class="btn-icon">📋</span><span data-i18n="copy">Copy</span></button><button id="logCloseBtn" class="btn-icon-only">✕</button></div></div><div class="log-filters" id="logFilters"><button class="log-filter active" data-filter="all">All</button><button class="log-filter" data-filter="info">Info</button><button class="log-filter" data-filter="success">✓</button><button class="log-filter" data-filter="error">✗</button><button class="log-filter" data-filter="tx">TX</button><button class="log-filter" data-filter="rx">RX</button></div><div class="sidebar-body log-body"><div class="log" id="logContainer" aria-live="polite"></div></div><div class="sidebar-footer"><span data-i18n="eventsMsg">Events</span><span class="badge"><strong>v1.0</strong></span></div></aside>
  <div id="toastIndicator" class="toast-indicator"><div class="toast-inner"><div class="spinner"></div><div id="toastMessage" class="toast-text">Working…</div></div></div>
  <script src="script.js"></script>
</body>
</html>
'''


# ── Main ─────────────────────────────────────────────────────────────
def main():
    fixed = 0
    skipped = 0
    errors = []

    for html_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*/*/index.html'))):
        html = open(html_path, encoding='utf-8').read()

        # Skip apps that already have proper structure
        if '<div class="splash"' in html:
            skipped += 1
            continue

        app_dir = os.path.dirname(html_path)
        app_name = os.path.basename(app_dir)
        cat_name = os.path.basename(os.path.dirname(app_dir))
        script_path = os.path.join(app_dir, 'script.js')

        if not os.path.exists(script_path):
            errors.append(f"No script.js: {cat_name}/{app_name}")
            continue

        try:
            # Extract metadata from script.js
            meta = extract_meta(script_path)

            # Extract existing enhanced sections from broken HTML
            sections = extract_sections(html)

            # Extract inline CSS from broken HTML
            inline_css = extract_inline_css(html)

            # Get OG description
            m = re.search(r'<meta name="description" content="([^"]*)"', html)
            og_desc = m.group(1) if m else ''

            # If missing howto/wiki, try to borrow from working sibling
            if 'howto' not in sections or 'wiki' not in sections:
                sibling_html = find_working_sibling(app_dir)
                if sibling_html:
                    sib_sections = extract_sections(sibling_html)
                    if 'howto' not in sections and 'howto' in sib_sections:
                        sections['howto'] = sib_sections['howto']
                    if 'wiki' not in sections and 'wiki' in sib_sections:
                        sections['wiki'] = sib_sections['wiki']

            # Build and write new HTML
            new_html = build_html(app_dir, meta, sections, inline_css, og_desc)
            open(html_path, 'w', encoding='utf-8').write(new_html)
            fixed += 1

            if fixed % 50 == 0:
                print(f"  ... rebuilt {fixed} apps")

        except Exception as e:
            errors.append(f"Error: {cat_name}/{app_name}: {e}")

    print(f"\n✓ Rebuilt {fixed} broken apps (skipped {skipped} already-good apps)")
    if errors:
        print(f"\n⚠ {len(errors)} errors:")
        for e in errors:
            print(f"  {e}")


if __name__ == '__main__':
    main()
