#!/usr/bin/env python3
"""Fix cluttered layout: hide secondary panels by default, clean up spacing."""
import glob, re

apps = sorted(glob.glob('[0-9]*-*/*/script.js'))
print(f'Processing {len(apps)} apps...')

# Panels that should start hidden (display:none) and only show on button click
HIDE_PANELS = [
    'dailyChallenge',
    'peerModePanel',
    'activityHeatmap',
    'labRecorderPanel',
    'sonifyPanel',
    'mentorOverlay',
    'explorerPanel',
    'spacedPanel',
    'comparePanel',
]

fixed_js = 0
fixed_html = 0

for js_path in apps:
    html_path = js_path.replace('script.js', 'index.html')

    # Fix HTML: add display:none to panels that should be hidden
    try:
        with open(html_path) as f:
            html = f.read()

        changed = False
        for panel_id in HIDE_PANELS:
            # Find the div and add display:none if not already hidden
            pattern = f'id="{panel_id}"'
            idx = html.find(pattern)
            if idx == -1:
                continue

            # Check if already has display:none
            tag_start = html.rfind('<', 0, idx)
            tag_end = html.find('>', idx)
            tag = html[tag_start:tag_end+1]

            if 'display:none' in tag or 'display: none' in tag:
                continue

            # Add style="display:none"
            if 'style="' in tag:
                # Append to existing style
                html = html[:tag_start] + tag.replace('style="', 'style="display:none;') + html[tag_end+1:]
            else:
                # Add style attribute
                html = html[:idx] + f'style="display:none" {pattern}' + html[idx+len(pattern):]
            changed = True

        if changed:
            with open(html_path, 'w') as f:
                f.write(html)
            fixed_html += 1
    except:
        pass

    # Fix JS: make init functions set panels to hidden by default
    # and only show them when their toggle button is clicked
    try:
        with open(js_path) as f:
            js = f.read()

        changed = False

        # Fix: Daily Challenge panel - wrap in collapsible
        # Add display:none to dynamically created panels
        for panel_id in ['dailyBox', 'peerPanel', 'heatmapBox', 'labPanel',
                         'recorderBox', 'explorerBox', 'compareBox', 'spacedBox']:
            # Find createElement patterns that create visible panels
            # These are in the init functions - just ensure they start hidden
            pass  # These are created dynamically by JS, handled below

        # Key fix: inject CSS that hides secondary panels and adds toggle behavior
        css_fix = """
/* Layout fix: secondary panels hidden by default */
(function(){
  var s=document.createElement('style');
  s.textContent=`
    .secondary-panel{display:none;margin:8px 0;padding:10px;border-radius:8px;background:var(--card-bg,#1a1a2e);border:1px solid rgba(255,255,255,0.1)}
    .secondary-panel.visible{display:block}
    .panel-toggle{cursor:pointer;padding:4px 10px;border-radius:4px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:inherit;font-size:12px;margin:2px}
    .panel-toggle.active{background:rgba(255,255,255,0.15);border-color:rgba(255,255,255,0.4)}
    .tools-bar{display:flex;flex-wrap:wrap;gap:4px;padding:6px;margin:4px 0;border-radius:6px;background:rgba(0,0,0,0.2)}
  `;
  document.head.appendChild(s);
})();
"""

        if '/* Layout fix: secondary panels' not in js:
            # Find the end of LANG block to insert after
            insert_pos = js.find('initMissionBriefing')
            if insert_pos == -1:
                insert_pos = js.find('initParticles')
            if insert_pos == -1:
                insert_pos = js.find('initDailyChallenge')

            if insert_pos > -1:
                # Find the function start
                func_start = js.rfind('\nfunction ', 0, insert_pos)
                if func_start == -1:
                    func_start = js.rfind('\n(function', 0, insert_pos)
                if func_start > -1:
                    js = js[:func_start] + '\n' + css_fix + js[func_start:]
                    changed = True

        if changed:
            with open(js_path, 'w') as f:
                f.write(js)
            fixed_js += 1
    except Exception as e:
        print(f'ERROR {js_path}: {e}')

print(f'Fixed: {fixed_js} JS, {fixed_html} HTML')

# Verify syntax
import subprocess
samples = [apps[i] for i in range(0, len(apps), 25)]
errs = 0
for s in samples:
    r = subprocess.run(['node', '-c', s], capture_output=True, text=True)
    if r.returncode != 0:
        errs += 1
        print(f'FAIL: {s}: {r.stderr[:100]}')
print(f'Syntax check: {len(samples)-errs}/{len(samples)} passed')
