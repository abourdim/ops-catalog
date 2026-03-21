#!/usr/bin/env python3
"""
Fix cluttered layout by wrapping dynamically-created panels in collapsible sections.
Injects a wrapper function that intercepts panel creation and hides them by default.
"""
import glob, re, subprocess

apps = sorted(glob.glob('[0-9]*-*/*/script.js'))
print(f'Processing {len(apps)} apps...')

# This JS snippet intercepts all the init functions and wraps their output
# in collapsible <details> elements
WRAPPER_JS = r"""
/* === LAYOUT CLEANUP === */
(function(){
  /* Hide dynamically-created panels: wrap them in <details> so they collapse */
  document.addEventListener('DOMContentLoaded',function(){
    setTimeout(function(){
      /* Panels to collapse (id -> label) */
      var panels = {
        'dailyChallenge': '\uD83D\uDCC5 Daily Challenge',
        'peerModePanel': '\uD83D\uDC65 Peer Mode',
        'activityHeatmap': '\uD83D\uDFE9 Activity Heatmap',
        'labRecorderPanel': '\uD83D\uDCD3 Lab & Recorder',
        'sonifyPanel': '\uD83D\uDD0A Sonification',
        'explorerPanel': '\uD83D\uDD0D Parameter Explorer',
        'spacedPanel': '\uD83D\uDCC5 Spaced Repetition'
      };
      Object.keys(panels).forEach(function(id){
        var el = document.getElementById(id);
        if(!el || el.parentElement.tagName === 'DETAILS') return;
        var det = document.createElement('details');
        det.className = 'collapsible tool-panel';
        det.style.cssText = 'margin:6px 0;border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0;overflow:hidden';
        var sum = document.createElement('summary');
        sum.style.cssText = 'padding:8px 12px;cursor:pointer;font-size:13px;font-weight:600;list-style:none;background:rgba(0,0,0,0.2);color:inherit';
        sum.textContent = panels[id];
        det.appendChild(sum);
        el.parentNode.insertBefore(det, el);
        el.style.display = '';
        el.style.padding = '8px 12px';
        det.appendChild(el);
      });
      /* Also wrap the compare button area */
      var cmpBtn = document.querySelector('.compare-toggle,.compare-btn,[onclick*="compare"],[id*="compare"]');
      if(cmpBtn && cmpBtn.parentElement.tagName !== 'DETAILS'){
        cmpBtn.style.fontSize = '12px';
      }
      /* Clean up: move floating buttons to a tools bar if many exist */
      var floats = document.querySelectorAll('[style*="position:fixed"][style*="bottom"]');
      if(floats.length > 2){
        var bar = document.createElement('div');
        bar.style.cssText = 'position:fixed;bottom:10px;right:10px;display:flex;gap:6px;z-index:9990;flex-direction:column;align-items:flex-end';
        bar.id = 'toolsFloat';
        floats.forEach(function(f){
          if(f.id === 'mentorOverlay' || f.id === 'tooltipFloat' || f.id === 'voiceIndicator' || f.id === 'particleCanvas') return;
          f.style.position = 'relative';
          f.style.bottom = 'auto';
          f.style.right = 'auto';
          f.style.margin = '0';
          bar.appendChild(f);
        });
        if(bar.children.length > 0) document.body.appendChild(bar);
      }
    }, 500);
  });
})();
"""

fixed = 0
for js_path in apps:
    with open(js_path) as f:
        js = f.read()

    if '/* === LAYOUT CLEANUP ===' in js:
        continue

    # Append at end of file
    js += '\n' + WRAPPER_JS
    with open(js_path, 'w') as f:
        f.write(js)
    fixed += 1

print(f'Injected layout cleanup in {fixed}/{len(apps)} files')

# Syntax check
samples = [apps[i] for i in range(0, len(apps), 20)]
errs = 0
for s in samples:
    r = subprocess.run(['node', '-c', s], capture_output=True, text=True)
    if r.returncode != 0:
        errs += 1
        print(f'FAIL: {s}: {r.stderr[:120]}')
print(f'Syntax: {len(samples)-errs}/{len(samples)} passed')
