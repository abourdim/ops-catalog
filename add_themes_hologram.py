#!/usr/bin/env python3
"""
add_themes_hologram.py
Adds Signal Visualizer Themes (initSignalThemes) and Hologram Effect (initHologramEffect)
to every script.js matching [0-9]*-*/*/script.js inside the ops-catalog directory.
Idempotent: skips files that already contain vizThemeTitle.
"""

import os, sys, glob, subprocess, random

CATALOG = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject ──
LANG_EN = (
    "vizThemeTitle:'Visual Theme',"
    "vizDefault:'Default',"
    "vizOscilloscope:'Oscilloscope',"
    "vizThermal:'Thermal',"
    "vizNightVision:'Night Vision',"
    "vizRadar:'Radar',"
    "vizMatrix:'Matrix',"
    "hologramTitle:'Hologram',"
)

LANG_FR = (
    "vizThemeTitle:'Th\\x27me Visuel',"
    "vizDefault:'D\\x27faut',"
    "vizOscilloscope:'Oscilloscope',"
    "vizThermal:'Thermique',"
    "vizNightVision:'Vision Nocturne',"
    "vizRadar:'Radar',"
    "vizMatrix:'Matrice',"
    "hologramTitle:'Hologramme',"
)

LANG_AR = (
    "vizThemeTitle:'\\u0627\\u0644\\u0633\\u0645\\u0629 \\u0627\\u0644\\u0628\\u0635\\u0631\\u064A\\u0629',"
    "vizDefault:'\\u0627\\u0641\\u062A\\u0631\\u0627\\u0636\\u064A',"
    "vizOscilloscope:'\\u0631\\u0627\\u0633\\u0645 \\u0627\\u0644\\u0630\\u0628\\u0630\\u0628\\u0627\\u062A',"
    "vizThermal:'\\u062D\\u0631\\u0627\\u0631\\u064A',"
    "vizNightVision:'\\u0631\\u0624\\u064A\\u0629 \\u0644\\u064A\\u0644\\u064A\\u0629',"
    "vizRadar:'\\u0631\\u0627\\u062F\\u0627\\u0631',"
    "vizMatrix:'\\u0645\\u0635\\u0641\\u0648\\u0641\\u0629',"
    "hologramTitle:'\\u0647\\u0648\\u0644\\u0648\\u063A\\u0631\\u0627\\u0645',"
)

# ── JS code for both features ──
JS_CODE = r"""
/* ═══════ Signal Visualizer Themes ═══════ */
function initSignalThemes(){
 if(document.getElementById('vizThemeSelect'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var themes={
  default:{filter:'',cls:''},
  oscilloscope:{filter:'hue-rotate(120deg) saturate(2) brightness(1.2)',cls:'viz-oscilloscope'},
  thermal:{filter:'hue-rotate(-30deg) saturate(3) contrast(1.3)',cls:'viz-thermal'},
  nightvision:{filter:'brightness(1.5) contrast(1.5) sepia(1) hue-rotate(70deg) saturate(5)',cls:'viz-nightvision'},
  radar:{filter:'grayscale(0.5) brightness(1.3) contrast(1.5)',cls:'viz-radar'},
  matrix:{filter:'brightness(1.2) contrast(2) saturate(0)',cls:'viz-matrix'}
 };
 var labels={
  default:L.vizDefault||'Default',
  oscilloscope:L.vizOscilloscope||'Oscilloscope',
  thermal:L.vizThermal||'Thermal',
  nightvision:L.vizNightVision||'Night Vision',
  radar:L.vizRadar||'Radar',
  matrix:L.vizMatrix||'Matrix'
 };
 var style=document.createElement('style');
 style.textContent='.viz-theme-wrap{position:relative;display:inline-block;margin:6px 0;}'
  +'.viz-theme-wrap select{padding:6px 28px 6px 10px;border-radius:8px;border:1px solid var(--border,#444);background:var(--bg2,#23272e);color:var(--fg,#e0e0e0);font-size:.85rem;cursor:pointer;appearance:none;-webkit-appearance:none;}'
  +'.viz-theme-wrap::after{content:"";position:absolute;right:10px;top:50%;transform:translateY(-50%);border:5px solid transparent;border-top-color:var(--fg,#e0e0e0);pointer-events:none;}'
  +'.viz-overlay{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;border-radius:inherit;}'
  +'.viz-oscilloscope .viz-overlay{background:rgba(0,255,0,0.07);}'
  +'.viz-radar .viz-overlay{background:conic-gradient(from 0deg,transparent 0%,rgba(0,255,0,0.12) 10%,transparent 20%);animation:vizSweep 3s linear infinite;}'
  +'@keyframes vizSweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}'
  +'.viz-matrix .viz-overlay{background:rgba(0,255,0,0.1);}';
 document.head.appendChild(style);
 var mc=document.getElementById('mainCard');
 if(!mc)return;
 var wrap=document.createElement('div');
 wrap.style.cssText='padding:0 16px 8px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;';
 var lbl=document.createElement('label');
 lbl.textContent=(L.vizThemeTitle||'Visual Theme')+': ';
 lbl.style.cssText='font-size:.85rem;font-weight:600;';
 lbl.setAttribute('for','vizThemeSelect');
 var sw=document.createElement('div');
 sw.className='viz-theme-wrap';
 var sel=document.createElement('select');
 sel.id='vizThemeSelect';
 var keys=['default','oscilloscope','thermal','nightvision','radar','matrix'];
 keys.forEach(function(k){var o=document.createElement('option');o.value=k;o.textContent=labels[k];sel.appendChild(o);});
 sw.appendChild(sel);
 wrap.appendChild(lbl);
 wrap.appendChild(sw);
 var canvas=document.getElementById('simCanvas');
 var parent=canvas?canvas.parentElement:null;
 if(parent){
  var overlay=document.createElement('div');
  overlay.className='viz-overlay';
  parent.style.position='relative';
  parent.appendChild(overlay);
 }
 var saved=localStorage.getItem('vizTheme');
 if(saved&&themes[saved]){sel.value=saved;}
 function apply(t){
  var th=themes[t]||themes['default'];
  if(canvas)canvas.style.filter=th.filter;
  if(parent){
   keys.forEach(function(k){if(themes[k].cls)parent.classList.remove(themes[k].cls);});
   if(th.cls)parent.classList.add(th.cls);
  }
  localStorage.setItem('vizTheme',t);
 }
 sel.addEventListener('change',function(){apply(sel.value);});
 apply(sel.value);
 var sections=mc.querySelectorAll('.collapsible, details, [class*=section]');
 if(sections.length>0){mc.insertBefore(wrap,sections[0]);}
 else{mc.appendChild(wrap);}
}
document.addEventListener('DOMContentLoaded',function(){try{initSignalThemes();}catch(e){console.warn('SignalThemes init:',e);}});

/* ═══════ Hologram Effect ═══════ */
function initHologramEffect(){
 if(!window.matchMedia('(hover: hover)').matches)return;
 var mc=document.getElementById('mainCard');
 if(!mc)return;
 mc.style.transition='transform 0.1s ease-out';
 mc.style.transformStyle='preserve-3d';
 var sheen=document.createElement('div');
 sheen.style.cssText='position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999;border-radius:inherit;opacity:0;transition:opacity 0.3s;';
 mc.style.position=mc.style.position||'relative';
 mc.appendChild(sheen);
 mc.addEventListener('mousemove',function(e){
  var r=mc.getBoundingClientRect();
  var cx=r.left+r.width/2;
  var cy=r.top+r.height/2;
  var dx=(e.clientX-cx)/(r.width/2);
  var dy=(e.clientY-cy)/(r.height/2);
  var rotY=dx*5;
  var rotX=-dy*5;
  mc.style.transform='perspective(800px) rotateY('+rotY+'deg) rotateX('+rotX+'deg)';
  sheen.style.opacity='0.12';
  sheen.style.background='radial-gradient(circle at '+((dx+1)*50)+'% '+((dy+1)*50)+'%, rgba(255,255,255,0.25), transparent 60%)';
 });
 mc.addEventListener('mouseleave',function(){
  mc.style.transform='perspective(800px) rotateY(0deg) rotateX(0deg)';
  sheen.style.opacity='0';
 });
}
document.addEventListener('DOMContentLoaded',function(){try{initHologramEffect();}catch(e){console.warn('Hologram init:',e);}});
"""

def process_file(filepath):
    """Inject LANG keys and JS code into a single script.js. Returns True if modified."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Idempotent check
    if 'vizThemeTitle' in content:
        return False

    modified = False

    # ── Insert LANG keys ──
    # Old format: ...LANG_BASE.en, / .fr, / .ar,
    for marker, lang_keys in [
        ('...LANG_BASE.en,', LANG_EN),
        ('...LANG_BASE.fr,', LANG_FR),
        ('...LANG_BASE.ar,', LANG_AR),
    ]:
        idx = content.find(marker)
        if idx != -1:
            insert_pos = idx + len(marker)
            content = content[:insert_pos] + lang_keys + content[insert_pos:]
            modified = True

    # New format: },fr:{ / },ar:{ / }};
    if not modified:
        for marker, lang_keys in [
            ('},fr:{', LANG_EN),   # en section ends before fr
            ('},ar:{', LANG_FR),   # fr section ends before ar
            ('}};', LANG_AR),      # ar section ends at }};
        ]:
            idx = content.find(marker)
            if idx != -1:
                content = content[:idx] + ',' + lang_keys + content[idx:]
                modified = True

    # ── Insert JS code after the LANG }; ──
    # Find the LANG = { ... }; block end
    lang_start = content.find('const LANG')
    if lang_start == -1:
        lang_start = content.find('var LANG')
    if lang_start != -1:
        # Find the matching closing };
        # We look for the }; that closes the LANG object
        # Strategy: find lines with just }; after the LANG declaration
        search_from = lang_start
        brace_count = 0
        in_lang = False
        insert_js_pos = -1
        i = search_from
        while i < len(content):
            ch = content[i]
            if ch == '{':
                brace_count += 1
                in_lang = True
            elif ch == '}':
                brace_count -= 1
                if in_lang and brace_count == 0:
                    # Found the closing brace, look for the ;
                    j = i + 1
                    while j < len(content) and content[j] in ' \t\r':
                        j += 1
                    if j < len(content) and content[j] == ';':
                        insert_js_pos = j + 1
                    else:
                        insert_js_pos = i + 1
                    break
            i += 1

        if insert_js_pos != -1:
            content = content[:insert_js_pos] + JS_CODE + content[insert_js_pos:]
            modified = True

    if modified:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

    return modified


def main():
    pattern = os.path.join(CATALOG, '[0-9]*-*', '*', 'script.js')
    files = sorted(glob.glob(pattern))
    print('Found {} script.js files'.format(len(files)))

    modified = 0
    skipped = 0
    errors = []

    for filepath in files:
        try:
            if process_file(filepath):
                modified += 1
            else:
                skipped += 1
        except Exception as e:
            errors.append((filepath, str(e)))
            print('ERROR: {} - {}'.format(filepath, e))

    print('Modified: {}'.format(modified))
    print('Skipped (already done): {}'.format(skipped))
    print('Errors: {}'.format(len(errors)))

    # Verify syntax of 30 random files with node -c
    if modified > 0:
        all_modified = [f for f in files if 'vizThemeTitle' in open(f, 'r', encoding='utf-8').read()]
        sample = random.sample(all_modified, min(30, len(all_modified)))
        print('\nVerifying syntax of {} files with node -c ...'.format(len(sample)))
        fail_count = 0
        for filepath in sample:
            result = subprocess.run(['node', '-c', filepath], capture_output=True, text=True)
            if result.returncode != 0:
                fail_count += 1
                print('SYNTAX ERROR: {}'.format(filepath))
                print('  {}'.format(result.stderr.strip()))
        if fail_count == 0:
            print('All {} files passed syntax check.'.format(len(sample)))
        else:
            print('{} files FAILED syntax check!'.format(fail_count))

    if errors:
        for fp, err in errors:
            print('  {} : {}'.format(fp, err))


if __name__ == '__main__':
    main()
