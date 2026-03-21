#!/usr/bin/env python3
"""Add data sonification system to all 488 apps in ops-catalog."""

import os, re, subprocess, random

ROOT = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject ──
# Use regular single quotes for JS string delimiters
# Use \x27 INSIDE strings only where an apostrophe is needed (e.g. d\x27onde)
EMOJI = "\U0001f50a"  # speaker emoji

LANG_EN = (
    "sonifyTitle:'" + EMOJI + " Data Sonification',"
    "sonifyOn:'Sonification ON',"
    "sonifyOff:'Sonification OFF',"
    "sonifyFreq:'Frequency',"
    "sonifyVol:'Volume',"
    "sonifyWave:'Waveform',"
    "sonifyInfo:'Turn data into sound',"
)

LANG_FR = (
    "sonifyTitle:'" + EMOJI + " Sonification des donn\u00e9es',"
    "sonifyOn:'Sonification activ\u00e9e',"
    "sonifyOff:'Sonification d\u00e9sactiv\u00e9e',"
    "sonifyFreq:'Fr\u00e9quence',"
    "sonifyVol:'Volume',"
    "sonifyWave:'Forme d\\x27onde',"
    "sonifyInfo:'Transformez les donn\u00e9es en son',"
)

LANG_AR = (
    "sonifyTitle:'" + EMOJI + " \u062a\u062d\u0648\u064a\u0644 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0625\u0644\u0649 \u0635\u0648\u062a',"
    "sonifyOn:'\u0627\u0644\u0635\u0648\u062a \u0645\u064f\u0641\u0639\u064e\u0644',"
    "sonifyOff:'\u0627\u0644\u0635\u0648\u062a \u0645\u064f\u0639\u0637\u064e\u0644',"
    "sonifyFreq:'\u0627\u0644\u062a\u0631\u062f\u062f',"
    "sonifyVol:'\u0627\u0644\u0635\u0648\u062a',"
    "sonifyWave:'\u0634\u0643\u0644 \u0627\u0644\u0645\u0648\u062c\u0629',"
    "sonifyInfo:'\u062d\u0648\u0651\u0644 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0625\u0644\u0649 \u0635\u0648\u062a',"
)

# ── JS function to append after LANG block ──
JS_FUNC = r"""
/* ═══════ Data Sonification Engine ═══════ */
function initSonification(){
  if(document.getElementById('sonifyPanel')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var panel=document.createElement('div');
  panel.id='sonifyPanel';
  panel.className='sonify-panel';
  panel.style.cssText='padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
  panel.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;">'
    +'<button id="sonifyToggle" style="padding:0.4rem 0.9rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:inherit;cursor:pointer;font-size:0.85rem;" data-i18n="sonifyTitle">'+(L.sonifyTitle||'\uD83D\uDD0A Data Sonification')+'</button>'
    +'<span id="sonifyStatus" style="font-size:0.75rem;opacity:0.6;" data-i18n="sonifyOff">'+(L.sonifyOff||'Sonification OFF')+'</span>'
    +'<span id="sonifyFreqDisp" style="font-size:0.7rem;opacity:0.5;margin-left:auto;">440 Hz</span>'
    +'</div>'
    +'<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">'
    +'<label style="font-size:0.75rem;opacity:0.7;" data-i18n="sonifyVol">'+(L.sonifyVol||'Volume')+'</label>'
    +'<input type="range" id="sonifyVolSlider" min="0" max="100" value="30" style="flex:1;accent-color:var(--accent,#d4a03c);">'
    +'</div>'
    +'<canvas id="sonifyWaveCanvas" width="280" height="60" style="width:100%;height:60px;border-radius:6px;background:#0a0a1a;border:1px solid rgba(255,255,255,0.06);display:block;"></canvas>'
    +'<div style="font-size:0.7rem;opacity:0.45;margin-top:0.3rem;" data-i18n="sonifyInfo">'+(L.sonifyInfo||'Turn data into sound')+'</div>';
  var target=document.getElementById('mainCard');
  if(target&&target.parentNode){target.parentNode.insertBefore(panel,target.nextSibling);}
  else{var fc=document.querySelector('.rows-container')||document.querySelector('.app');if(fc)fc.appendChild(panel);}
  var actx=null,osc=null,gain=null,analyser=null,running=false;
  var toggle=document.getElementById('sonifyToggle');
  var status=document.getElementById('sonifyStatus');
  var freqDisp=document.getElementById('sonifyFreqDisp');
  var volSlider=document.getElementById('sonifyVolSlider');
  var wCanvas=document.getElementById('sonifyWaveCanvas');
  var wCtx=wCanvas.getContext('2d');
  function startAudio(){
    if(!actx){actx=new(window.AudioContext||window.webkitAudioContext)();}
    if(actx.state==='suspended'){actx.resume();}
    analyser=actx.createAnalyser();analyser.fftSize=256;
    osc=actx.createOscillator();osc.type='sine';osc.frequency.value=440;
    gain=actx.createGain();gain.gain.value=volSlider.value/300;
    osc.connect(gain);gain.connect(analyser);analyser.connect(actx.destination);
    osc.start();running=true;drawWave();
  }
  function stopAudio(){
    running=false;
    try{if(osc){osc.stop();osc.disconnect();}}catch(e){}
    try{if(gain){gain.disconnect();}}catch(e){}
    try{if(analyser){analyser.disconnect();}}catch(e){}
    osc=null;gain=null;analyser=null;
    wCtx.clearRect(0,0,wCanvas.width,wCanvas.height);
  }
  function drawWave(){
    if(!running||!analyser)return;
    var buf=new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(buf);
    wCtx.fillStyle='#0a0a1a';wCtx.fillRect(0,0,wCanvas.width,wCanvas.height);
    wCtx.lineWidth=2;wCtx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent')||'#d4a03c';
    wCtx.beginPath();
    var sl=wCanvas.width/buf.length;var x=0;
    for(var i=0;i<buf.length;i++){var v=buf[i]/128.0;var y=v*wCanvas.height/2;if(i===0){wCtx.moveTo(x,y);}else{wCtx.lineTo(x,y);}x+=sl;}
    wCtx.stroke();requestAnimationFrame(drawWave);
  }
  function mapData(){
    var c=document.getElementById('simCanvas');
    if(!c)return 440;
    try{var cx=c.getContext('2d');var d=cx.getImageData(0,0,1,c.height);var sum=0;for(var i=0;i<d.data.length;i+=4){sum+=d.data[i]+d.data[i+1]+d.data[i+2];}var avg=sum/(d.data.length/4*3);return 200+avg/255*1800;}catch(e){return 440;}
  }
  var sonifyInterval=null;
  toggle.addEventListener('click',function(){
    if(running){stopAudio();if(sonifyInterval){clearInterval(sonifyInterval);sonifyInterval=null;}
      status.textContent=(L.sonifyOff||'Sonification OFF');toggle.style.background='rgba(255,255,255,0.07)';
    }else{startAudio();
      sonifyInterval=setInterval(function(){
        if(!running||!osc)return;
        var f=mapData();osc.frequency.setTargetAtTime(f,actx.currentTime,0.05);
        freqDisp.textContent=Math.round(f)+' Hz';
        if(f>1500){osc.type='sawtooth';}else if(f>800){osc.type='square';}else{osc.type='sine';}
      },100);
      status.textContent=(L.sonifyOn||'Sonification ON');toggle.style.background='rgba(255,255,255,0.18)';
    }
  });
  volSlider.addEventListener('input',function(){if(gain){gain.gain.value=this.value/300;}});
}
document.addEventListener('DOMContentLoaded',function(){try{initSonification();}catch(e){console.warn('Sonification init:',e);}});
"""

# ── HTML to insert (after mainCard closing tag) ──
HTML_PANEL = """
    <div class="sonify-panel" id="sonifyPanel" style="display:none;"></div>
"""

def find_app_dirs():
    """Find all app directories containing script.js and index.html."""
    apps = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        if 'script.js' in filenames and 'index.html' in filenames:
            apps.append(dirpath)
    apps.sort()
    return apps


def inject_lang_keys_old(content):
    """Inject LANG keys into old-format files (using ...LANG_BASE.xx spread)."""
    modified = False

    # EN block: find ...LANG_BASE.en, and insert after that line
    m = re.search(r'(\.\.\.LANG_BASE\.en\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + '\n    ' + LANG_EN + '\n    ' + content[insert_pos:]
        modified = True

    # FR block
    m = re.search(r'(\.\.\.LANG_BASE\.fr\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + '\n    ' + LANG_FR + '\n    ' + content[insert_pos:]
        modified = True

    # AR block
    m = re.search(r'(\.\.\.LANG_BASE\.ar\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + '\n    ' + LANG_AR + '\n    ' + content[insert_pos:]
        modified = True

    return content, modified


def inject_lang_keys_new(content):
    """Inject LANG keys into new-format files (using en:{ / fr:{ / ar:{ directly)."""
    modified = False

    # Find const LANG={en:{ or const LANG = { en: {
    # For new format, keys are right after ...LANG_BASE.en, on same long line
    # Same pattern as old format - they still use ...LANG_BASE.xx
    m = re.search(r'(\.\.\.LANG_BASE\.en\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + LANG_EN + content[insert_pos:]
        modified = True

    m = re.search(r'(\.\.\.LANG_BASE\.fr\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + LANG_FR + content[insert_pos:]
        modified = True

    m = re.search(r'(\.\.\.LANG_BASE\.ar\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + LANG_AR + content[insert_pos:]
        modified = True

    return content, modified


def detect_format(content):
    """Detect old vs new format. Old has multi-line LANG, new has single-line."""
    # Old format: const LANG = {\n  en: {\n    ...LANG_BASE.en,
    # New format: const LANG={en:{...LANG_BASE.en,title:...
    m = re.search(r'const\s+LANG\s*=\s*\{', content)
    if not m:
        return None
    # Check if 'en:{' appears on same line as 'const LANG'
    line_start = content.rfind('\n', 0, m.start()) + 1
    line_end = content.find('\n', m.end())
    if line_end == -1:
        line_end = len(content)
    line = content[line_start:line_end]
    if '...LANG_BASE.en' in line:
        return 'new'
    return 'old'


def find_lang_block_end(content):
    """Find the closing }; of the LANG block."""
    m = re.search(r'const\s+LANG\s*=\s*\{', content)
    if not m:
        return -1
    # Count braces from LANG = {
    start = m.end() - 1  # position of {
    depth = 0
    i = start
    while i < len(content):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                # Find the ; after }
                j = i + 1
                while j < len(content) and content[j] in ' \t\n':
                    j += 1
                if j < len(content) and content[j] == ';':
                    return j + 1
                return i + 1
        i += 1
    return -1


def clean_previous(content):
    """Remove previously injected sonification content."""
    if 'sonifyTitle' not in content:
        return content

    # Remove JS function block (between marker comment and DOMContentLoaded listener)
    # Use a careful regex that starts from our specific comment
    content = re.sub(
        r'\n/\* ={3,} Data Sonification Engine ={3,} \*/\n'
        r'function initSonification\(\)\{.*?\n\}\n'
        r"document\.addEventListener\('DOMContentLoaded',function\(\)\{try\{initSonification\(\);\}catch\(e\)\{console\.warn\('Sonification init:',e\);\}\}\);",
        '', content, flags=re.DOTALL)

    # Remove injected sonify LANG keys
    SONIFY_KEYS = ['sonifyTitle', 'sonifyOn', 'sonifyOff', 'sonifyFreq', 'sonifyVol', 'sonifyWave', 'sonifyInfo']

    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if 'sonifyTitle:' in line:
            s = line.strip()
            # Check if line ONLY contains sonify keys (old format, separate line)
            test = s
            for key in SONIFY_KEYS:
                # Remove key:'value', patterns (value may contain \x27 for escaped apostrophes)
                test = re.sub(key + r""":'[^']*(?:\\x27[^']*)*',?""", '', test)
            test = test.strip().rstrip(',').strip()
            if test == '' or test == '//':
                # Line only had sonify keys, skip it entirely
                continue
            else:
                # Mixed line: remove only sonify keys from it
                for key in SONIFY_KEYS:
                    line = re.sub(key + r""":'[^']*(?:\\x27[^']*)*',?""", '', line)
        new_lines.append(line)
    return '\n'.join(new_lines)


def process_script(app_dir):
    """Process script.js for a single app."""
    path = os.path.join(app_dir, 'script.js')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Clean any previous injection
    content = clean_previous(content)

    fmt = detect_format(content)
    if fmt is None:
        # Debug: check if LANG exists but regex misses it
        if 'const LANG' in content:
            print(f"    DEBUG: 'const LANG' found in text but detect_format returned None")
        return 'no_lang'

    # Inject LANG keys
    if fmt == 'old':
        content, modified = inject_lang_keys_old(content)
    else:
        content, modified = inject_lang_keys_new(content)

    if not modified:
        return 'no_inject'

    # Find end of LANG block and inject JS function
    lang_end = find_lang_block_end(content)
    if lang_end == -1:
        return 'no_lang_end'

    content = content[:lang_end] + '\n' + JS_FUNC + '\n' + content[lang_end:]

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    return 'ok'


def process_html(app_dir):
    """Process index.html for a single app — insert sonify panel placeholder."""
    path = os.path.join(app_dir, 'index.html')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Clean previous injection
    if 'sonifyPanel' in content:
        content = re.sub(r'\s*<div class="sonify-panel" id="sonifyPanel"[^>]*></div>\s*', '\n', content)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

    # Strategy: insert after mainCard closing </div>
    # Find id="mainCard" then find matching closing </div>
    # Simpler: insert before the first <details class="collapsible"
    m = re.search(r'(<details\s+class="collapsible")', content)
    if m:
        content = content[:m.start()] + HTML_PANEL.strip() + '\n' + content[m.start():]
    else:
        # Fallback: insert before </body>
        m = re.search(r'</body>', content, re.IGNORECASE)
        if m:
            content = content[:m.start()] + HTML_PANEL.strip() + '\n' + content[m.start():]
        else:
            return 'no_insert'

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    return 'ok'


def main():
    apps = find_app_dirs()
    print(f"Found {len(apps)} apps")

    stats = {'ok': 0, 'skip': 0, 'no_lang': 0, 'no_inject': 0, 'no_lang_end': 0, 'html_ok': 0, 'html_skip': 0, 'errors': 0}

    for app_dir in apps:
        rel = os.path.relpath(app_dir, ROOT)
        try:
            result = process_script(app_dir)
            stats[result] = stats.get(result, 0) + 1

            html_result = process_html(app_dir)
            if html_result == 'ok':
                stats['html_ok'] += 1
            elif html_result == 'skip':
                stats['html_skip'] += 1

            if result == 'ok':
                print(f"  [OK] {rel}")
            elif result == 'skip':
                pass  # silent for skips
            else:
                print(f"  [{result.upper()}] {rel}")
        except Exception as e:
            stats['errors'] += 1
            print(f"  [ERROR] {rel}: {e}")

    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"{'='*60}")
    print(f"  Total apps found:    {len(apps)}")
    print(f"  JS injected OK:      {stats['ok']}")
    print(f"  JS already done:     {stats['skip']}")
    print(f"  HTML injected OK:    {stats['html_ok']}")
    print(f"  HTML already done:   {stats['html_skip']}")
    print(f"  No LANG block:       {stats['no_lang']}")
    print(f"  No inject point:     {stats['no_inject']}")
    print(f"  Errors:              {stats['errors']}")

    # ── Syntax check with node -c on 25 random samples ──
    print(f"\n{'='*60}")
    print(f"SYNTAX CHECK (node -c on 25 samples)")
    print(f"{'='*60}")

    ok_apps = [d for d in apps if os.path.exists(os.path.join(d, 'script.js'))]
    samples = random.sample(ok_apps, min(25, len(ok_apps)))
    syntax_ok = 0
    syntax_fail = 0

    for app_dir in samples:
        js_path = os.path.join(app_dir, 'script.js')
        rel = os.path.relpath(js_path, ROOT)
        try:
            result = subprocess.run(
                ['node', '-c', js_path],
                capture_output=True, text=True, timeout=10
            )
            if result.returncode == 0:
                syntax_ok += 1
            else:
                syntax_fail += 1
                print(f"  [FAIL] {rel}")
                print(f"         {result.stderr.strip()[:200]}")
        except Exception as e:
            syntax_fail += 1
            print(f"  [ERROR] {rel}: {e}")

    print(f"\n  Syntax OK:   {syntax_ok}/{len(samples)}")
    print(f"  Syntax FAIL: {syntax_fail}/{len(samples)}")

    if syntax_fail == 0:
        print(f"\n  ALL SYNTAX CHECKS PASSED!")
    else:
        print(f"\n  WARNING: {syntax_fail} files have syntax errors!")


if __name__ == '__main__':
    main()
