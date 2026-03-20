#!/usr/bin/env python3
"""Fix demo HTML for apps where gen_demo.py couldn't find the insertion point."""

import os
import re
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))

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

fixed = 0

for html_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'index.html'))):
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    if 'sectionDemo' in html:
        continue

    # Add CSS if needed
    if '.demo-player' not in html:
        style_end = html.rfind('</style>')
        if style_end > 0:
            html = html[:style_end] + DEMO_CSS + html[style_end:]

    # Try multiple insertion strategies
    inserted = False

    # Strategy 1: After sectionA How It Works or sectionHIW
    for pattern in [
        r'</details>\s*\n\s*<!-- ═+ SECTION B',
        r'</details>\s*\n\s*<details class="collapsible">\s*<summary><span class="icon">🧪',
        r'</details>\s*\n\s*<details class="collapsible">\s*<summary><span class="icon">📦',
    ]:
        m = re.search(pattern, html)
        if m:
            pos = html.find('</details>', m.start()) + len('</details>')
            html = html[:pos] + '\n' + DEMO_HTML + '\n' + html[pos:]
            inserted = True
            break

    if not inserted:
        # Strategy 2: After the LAST </details> before footer
        footer = re.search(r'\s*</div>\s*\n\s*<footer', html)
        if not footer:
            footer = re.search(r'<footer', html)

        if footer:
            # Find all </details> before footer
            last_details = None
            for m in re.finditer(r'</details>', html[:footer.start()]):
                last_details = m

            if last_details:
                pos = last_details.end()
                html = html[:pos] + '\n' + DEMO_HTML + html[pos:]
                inserted = True

    if not inserted:
        # Strategy 3: Before </body> or <script src="script.js">
        script_tag = re.search(r'\s*<script src="script\.js"', html)
        if script_tag:
            pos = script_tag.start()
            html = html[:pos] + '\n' + DEMO_HTML + '\n' + html[pos:]
            inserted = True

    if not inserted:
        # Strategy 4: Before </body>
        body_end = html.rfind('</body>')
        if body_end > 0:
            html = html[:body_end] + DEMO_HTML + '\n' + html[body_end:]
            inserted = True

    if inserted:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html)
        fixed += 1

remaining = sum(1 for p in glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'index.html'))
                if 'sectionDemo' not in open(p).read())
print(f"✓ Fixed demo HTML in {fixed} apps")
print(f"Remaining without demo: {remaining}")
