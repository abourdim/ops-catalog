#!/usr/bin/env python3
"""Add Voice Commands + Share Results features to all 488 apps."""

import os, re, subprocess, glob

ROOT = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject ──────────────────────────────────────────────────────

EN_KEYS = (
    "voiceTitle:'\U0001F3A4 Voice',"
    "voiceOn:'Voice ON',"
    "voiceOff:'Voice OFF',"
    "voiceListening:'Listening...',"
    "voiceCmd:'Command recognised',"
    "voiceHelp:'Say: start, stop, reset, help, theme, next, previous',"
    "voice_cmds:'start / stop / reset / help / theme / next / previous',"
    "shareTitle:'\U0001F4E4 Share',"
    "shareBtn:'\U0001F4E4 Share',"
    "shareCopied:'Copied to clipboard!',"
    "shareGenerate:'Generate Summary',"
    "shareExport:'Export JSON',"
)

FR_KEYS = (
    "voiceTitle:'\U0001F3A4 Voix',"
    "voiceOn:'Voix ON',"
    "voiceOff:'Voix OFF',"
    "voiceListening:'\xc9coute...',"
    "voiceCmd:'Commande reconnue',"
    "voiceHelp:'Dites : d\xe9marrer, arr\xeater, aide, th\xe8me, suivant, pr\xe9c\xe9dent',"
    "voice_cmds:'d\xe9marrer / arr\xeater / aide / th\xe8me / suivant / pr\xe9c\xe9dent',"
    "shareTitle:'\U0001F4E4 Partager',"
    "shareBtn:'\U0001F4E4 Partager',"
    "shareCopied:'Copi\xe9 dans le presse-papiers !',"
    "shareGenerate:'G\xe9n\xe9rer le r\xe9sum\xe9',"
    "shareExport:'Exporter JSON',"
)

AR_KEYS = (
    "voiceTitle:'\U0001F3A4 \u0635\u0648\u062a',"
    "voiceOn:'\u0627\u0644\u0635\u0648\u062a \u0645\u0641\u0639\u0644',"
    "voiceOff:'\u0627\u0644\u0635\u0648\u062a \u0645\u0639\u0637\u0644',"
    "voiceListening:'\u062c\u0627\u0631\u064a \u0627\u0644\u0627\u0633\u062a\u0645\u0627\u0639...',"
    "voiceCmd:'\u062a\u0645 \u0627\u0644\u062a\u0639\u0631\u0641 \u0639\u0644\u0649 \u0627\u0644\u0623\u0645\u0631',"
    "voiceHelp:'\u0642\u0644: \u0627\u0628\u062f\u0623\u060c \u062a\u0648\u0642\u0641\u060c \u0645\u0633\u0627\u0639\u062f\u0629',"
    "voice_cmds:'\u0627\u0628\u062f\u0623 / \u062a\u0648\u0642\u0641 / \u0645\u0633\u0627\u0639\u062f\u0629',"
    "shareTitle:'\U0001F4E4 \u0645\u0634\u0627\u0631\u0643\u0629',"
    "shareBtn:'\U0001F4E4 \u0645\u0634\u0627\u0631\u0643\u0629',"
    "shareCopied:'\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!',"
    "shareGenerate:'\u0625\u0646\u0634\u0627\u0621 \u0645\u0644\u062e\u0635',"
    "shareExport:'\u062a\u0635\u062f\u064a\u0631 JSON',"
)


# ── JS functions (raw string so \uXXXX stays literal for JS) ──────────────────

JS_FUNCTIONS = r"""
/* ═══════ Voice Command Engine ═══════ */
function initVoiceControl(){
  if(document.getElementById('voiceBtn'))return;
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR)return;
  var lang=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var btn=document.createElement('button');
  btn.className='voice-btn';btn.id='voiceBtn';
  btn.setAttribute('data-i18n','voiceTitle');
  btn.textContent=lang.voiceTitle||'\ud83c\udfa4 Voice';
  btn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
  var ind=document.createElement('div');
  ind.className='voice-indicator';ind.id='voiceIndicator';
  ind.style.cssText='display:none;position:fixed;top:10px;right:10px;width:12px;height:12px;background:red;border-radius:50%;z-index:9999;';
  document.body.appendChild(ind);
  var tgt=document.querySelector('.header-buttons')||document.querySelector('.sim-controls')||document.querySelector('.card');
  if(tgt)tgt.appendChild(btn);else document.body.appendChild(btn);
  var recognition=new SR();
  recognition.continuous=true;recognition.interimResults=false;
  recognition.lang=document.documentElement.lang==='fr'?'fr-FR':document.documentElement.lang==='ar'?'ar-SA':'en-US';
  var active=false,silenceTimer=null;
  function stopListening(){
    active=false;recognition.stop();ind.style.display='none';
    btn.textContent=lang.voiceOff||'\ud83c\udfa4 Voice OFF';
    if(silenceTimer)clearTimeout(silenceTimer);
  }
  function startListening(){
    active=true;recognition.start();ind.style.display='block';
    ind.style.animation='voicePulse 1s infinite';
    btn.textContent=lang.voiceListening||'\ud83c\udfa4 Listening...';
    resetSilenceTimer();
  }
  function resetSilenceTimer(){
    if(silenceTimer)clearTimeout(silenceTimer);
    silenceTimer=setTimeout(function(){stopListening();},30000);
  }
  if(!document.getElementById('voicePulseStyle')){
    var st=document.createElement('style');st.id='voicePulseStyle';
    st.textContent='@keyframes voicePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.3)}}';
    document.head.appendChild(st);
  }
  var cmdMap={
    'start':function(){var b=document.getElementById('startBtn')||document.querySelector('[data-action=start]');if(b)b.click();},
    'stop':function(){var b=document.getElementById('stopBtn')||document.querySelector('[data-action=stop]');if(b)b.click();},
    'reset':function(){var b=document.getElementById('resetBtn')||document.querySelector('[data-action=reset]');if(b)b.click();},
    'help':function(){var b=document.getElementById('helpBtn');if(b)b.click();},
    'theme':function(){var b=document.getElementById('settingsBtn');if(b)b.click();},
    'next':function(){var a=document.getElementById('pathNextLink');if(a&&a.href)location.href=a.href;},
    'previous':function(){var a=document.getElementById('pathPrevLink');if(a&&a.href)location.href=a.href;},
    'd\xe9marrer':function(){cmdMap['start']();},
    'arr\xeater':function(){cmdMap['stop']();},
    'aide':function(){cmdMap['help']();},
    '\u0627\u0628\u062f\u0623':function(){cmdMap['start']();},
    '\u062a\u0648\u0642\u0641':function(){cmdMap['stop']();}
  };
  recognition.onresult=function(e){
    resetSilenceTimer();
    for(var i=e.resultIndex;i<e.results.length;i++){
      if(e.results[i].isFinal){
        var t=e.results[i][0].transcript.trim().toLowerCase();
        for(var c in cmdMap){if(t.indexOf(c)!==-1){cmdMap[c]();break;}}
      }
    }
  };
  recognition.onerror=function(){if(active)try{recognition.start();}catch(x){}};
  recognition.onend=function(){if(active)try{recognition.start();}catch(x){}};
  btn.addEventListener('click',function(){if(active)stopListening();else startListening();});
}
try{initVoiceControl();}catch(e){}

/* ═══════ Share Results Engine ═══════ */
function initShareSystem(){
  if(document.getElementById('shareBtn'))return;
  var lang=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var btn=document.createElement('button');
  btn.className='share-btn';btn.id='shareBtn';
  btn.setAttribute('data-i18n','shareBtn');
  btn.textContent=lang.shareBtn||'\ud83d\udce4 Share';
  btn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
  var tgt=document.querySelector('.header-buttons')||document.querySelector('.sim-controls')||document.querySelector('.card');
  if(tgt)tgt.appendChild(btn);else document.body.appendChild(btn);
  var expBtn=document.createElement('button');
  expBtn.className='share-btn';expBtn.id='shareExportBtn';
  expBtn.setAttribute('data-i18n','shareExport');
  expBtn.textContent=lang.shareExport||'\ud83d\udce4 Export JSON';
  expBtn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
  if(tgt)tgt.appendChild(expBtn);else document.body.appendChild(expBtn);
  function gatherState(){
    var title=document.querySelector('h1')&&document.querySelector('h1').textContent||'Experiment';
    var params=[];
    document.querySelectorAll('input[type=range]').forEach(function(s){
      var lbl=s.previousElementSibling&&s.previousElementSibling.textContent||s.id||'param';
      params.push(lbl.trim()+': '+s.value);
    });
    var dot=document.getElementById('statusDot');
    var status=dot&&dot.classList.contains('active')?'Running':'Stopped';
    return{title:title,params:params,status:status};
  }
  function buildCard(st){
    var lines=['\ud83d\udd2c '+st.title+' \u2014 Experiment Results',
      '\u2501'.repeat(20),
      'Parameters: '+(st.params.length?st.params.join(' | '):'default'),
      'Status: '+st.status,
      '\u2501'.repeat(20),
      'Generated by Workshop-DIY'];
    return lines.join('\n');
  }
  function copyText(txt){
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(function(){showToast(lang.shareCopied||'Copied!');}).catch(function(){fallbackCopy(txt);});
    }else{fallbackCopy(txt);}
  }
  function fallbackCopy(txt){
    var ta=document.createElement('textarea');ta.value=txt;
    ta.style.cssText='position:fixed;left:-9999px';document.body.appendChild(ta);
    ta.select();try{document.execCommand('copy');showToast(lang.shareCopied||'Copied!');}catch(e){}
    document.body.removeChild(ta);
  }
  function showToast(msg){
    var t=document.getElementById('toastMessage');
    if(t){t.textContent=msg;var p=t.parentElement&&t.parentElement.parentElement;if(p)p.classList.add('show');setTimeout(function(){if(p)p.classList.remove('show');},2000);}
  }
  btn.addEventListener('click',function(){
    var st=gatherState();var card=buildCard(st);copyText(card);
  });
  expBtn.addEventListener('click',function(){
    var st=gatherState();
    var logs=[];
    var logEl=document.getElementById('logContainer');
    if(logEl)logEl.querySelectorAll('.log-entry,.log-line').forEach(function(e){logs.push(e.textContent);});
    var data={title:st.title,params:st.params,status:st.status,logs:logs,exported:new Date().toISOString()};
    var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download=(st.title.replace(/[^a-z0-9]/gi,'_')||'export')+'_data.json';
    a.click();URL.revokeObjectURL(a.href);
  });
}
try{initShareSystem();}catch(e){}
"""

# ── HTML elements ──────────────────────────────────────────────────────────

HTML_VOICE_BTN = '<button class="voice-btn" id="voiceBtn" style="display:none" data-i18n="voiceTitle">\U0001F3A4 Voice</button>'
HTML_VOICE_IND = '<div class="voice-indicator" id="voiceIndicator" style="display:none;position:fixed;top:10px;right:10px;width:12px;height:12px;background:red;border-radius:50%;z-index:9999"></div>'
HTML_SHARE_BTN = '<button class="share-btn" id="shareBtn" data-i18n="shareBtn">\U0001F4E4 Share</button>'

SONIFY_MARKER = '/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550 Data Sonification Engine \u2550\u2550\u2550\u2550\u2550\u2550\u2550 */'

# Regex to match our injected LANG keys (for cleanup)
VOICE_SHARE_KEYS_RE = re.compile(
    r"voiceTitle:'[^']*',voiceOn:'[^']*',voiceOff:'[^']*',voiceListening:'[^']*',"
    r"voiceCmd:'[^']*',voiceHelp:'[^']*',voice_cmds:'[^']*',"
    r"shareTitle:'[^']*',shareBtn:'[^']*',shareCopied:'[^']*',"
    r"shareGenerate:'[^']*',shareExport:'[^']*',"
)


def clean_previous_script(path):
    """Remove any previously injected voice/share content from script.js."""
    with open(path, 'r', encoding='utf-8') as f:
        src = f.read()

    if 'voiceTitle' not in src and 'initVoiceControl' not in src:
        return src

    # Remove injected LANG keys (all three language blocks)
    src = VOICE_SHARE_KEYS_RE.sub('', src)

    # Remove the Voice Command Engine block
    src = re.sub(
        r'\n/\* \u2550+ Voice Command Engine \u2550+ \*/\n.*?try\{initVoiceControl\(\);\}catch\(e\)\{\}\n',
        '\n', src, flags=re.DOTALL)

    # Remove the Share Results Engine block
    src = re.sub(
        r'\n/\* \u2550+ Share Results Engine \u2550+ \*/\n.*?try\{initShareSystem\(\);\}catch\(e\)\{\}\n',
        '\n', src, flags=re.DOTALL)

    # Clean up excessive blank lines
    src = re.sub(r'\n{3,}', '\n\n', src)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(src)

    return src


def clean_previous_html(path):
    """Remove any previously injected voice/share HTML elements."""
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    if 'voiceIndicator' not in html and 'voiceBtn' not in html and 'shareBtn' not in html:
        return html

    html = re.sub(r'\n?<button class="voice-btn"[^>]*>[^<]*</button>', '', html)
    html = re.sub(r'\n?<div class="voice-indicator"[^>]*></div>', '', html)
    html = re.sub(r'\n?<button class="share-btn"[^>]*>[^<]*</button>', '', html)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)

    return html


def process_script(path):
    """Inject LANG keys and JS functions into script.js."""

    # Step 0: clean any previous injection
    src = clean_previous_script(path)

    if 'voiceTitle' in src:
        return 'skip-dirty'

    sonify_pos = src.find(SONIFY_MARKER)
    if sonify_pos == -1:
        return 'no-sonify'

    # Detect format: old has "const LANG = {" (with spaces), new has "const LANG={"
    # Also: old has "  fr: {" on its own line, new has "},fr:{"
    is_old = bool(re.search(r'const\s+LANG\s+=\s+\{', src))

    if is_old:
        # OLD FORMAT (352 apps):
        # The LANG block has ...LANG_BASE.en, / ...LANG_BASE.fr, / ...LANG_BASE.ar,
        # on separate lines inside en/fr/ar sub-objects.
        # Strategy: insert keys right after each ...LANG_BASE.XX, line.

        # Find the LANG object (not LANG_BASE)
        lang_start = -1
        for m in re.finditer(r'const\s+LANG\b', src):
            if 'LANG_BASE' not in src[m.start():m.start()+20]:
                lang_start = m.start()
                break
        if lang_start == -1:
            return 'no-LANG'

        # Find the three spread markers inside LANG (after lang_start)
        en_spread = src.find('...LANG_BASE.en,', lang_start)
        fr_spread = src.find('...LANG_BASE.fr,', lang_start)
        ar_spread = src.find('...LANG_BASE.ar,', lang_start)

        if en_spread == -1 or fr_spread == -1 or ar_spread == -1:
            return 'no-spread'

        # Insert in reverse order (ar, fr, en) to keep positions stable
        # Each spread line ends with ,\n - insert keys on the next line
        ar_end = src.find('\n', ar_spread) + 1  # position right after the \n
        src = src[:ar_end] + '    ' + AR_KEYS + '\n' + src[ar_end:]

        fr_end = src.find('\n', fr_spread) + 1
        src = src[:fr_end] + '    ' + FR_KEYS + '\n' + src[fr_end:]

        en_end = src.find('\n', en_spread) + 1
        src = src[:en_end] + '    ' + EN_KEYS + '\n' + src[en_end:]

    else:
        # NEW FORMAT (136 apps):
        # const LANG={en:{...LANG_BASE.en,key:'val',...},fr:{...},ar:{...}};
        # OR without LANG_BASE spread.
        # Find },fr:{ and },ar:{ boundaries and }}; close.

        lang_start = -1
        for m in re.finditer(r'const\s+LANG\b', src):
            if 'LANG_BASE' not in src[m.start():m.start()+20]:
                lang_start = m.start()
                break
        if lang_start == -1:
            return 'no-LANG'

        region = src[lang_start:sonify_pos]

        fr_match = re.search(r'\}\s*,\s*fr\s*:\s*\{', region)
        if not fr_match:
            return 'no-fr'

        ar_match = re.search(r'\}\s*,\s*ar\s*:\s*\{', region)
        if not ar_match:
            return 'no-ar'

        close_match = re.search(r'\}\s*\}\s*;', region)
        if not close_match:
            return 'no-close'

        # Insert in reverse order.
        # Must ensure a comma before the new keys if last char before } is not ','
        def ensure_comma(s, pos):
            """Return comma prefix if char before pos is not already a comma."""
            i = pos - 1
            while i >= 0 and s[i] in ' \t\n\r':
                i -= 1
            if i >= 0 and s[i] != ',':
                return ','
            return ''

        ar_close = lang_start + close_match.start()
        comma = ensure_comma(src, ar_close)
        src = src[:ar_close] + comma + AR_KEYS + src[ar_close:]

        # Recalculate ar_match position since we may have inserted above
        region2 = src[lang_start:src.find(SONIFY_MARKER)]
        ar_match2 = re.search(r'\}\s*,\s*ar\s*:\s*\{', region2)
        ar_boundary = lang_start + ar_match2.start()
        comma = ensure_comma(src, ar_boundary)
        src = src[:ar_boundary] + comma + FR_KEYS + src[ar_boundary:]

        # Recalculate fr_match position
        region3 = src[lang_start:src.find(SONIFY_MARKER)]
        fr_match2 = re.search(r'\}\s*,\s*fr\s*:\s*\{', region3)
        fr_boundary = lang_start + fr_match2.start()
        comma = ensure_comma(src, fr_boundary)
        src = src[:fr_boundary] + comma + EN_KEYS + src[fr_boundary:]

    # ── Inject JS functions before Sonification Engine ──
    sonify_pos = src.find(SONIFY_MARKER)
    if sonify_pos == -1:
        return 'no-sonify-after'
    src = src[:sonify_pos] + JS_FUNCTIONS + '\n' + src[sonify_pos:]

    with open(path, 'w', encoding='utf-8') as f:
        f.write(src)

    return 'ok'


def process_html(path):
    """Inject HTML elements into index.html."""
    html = clean_previous_html(path)

    insert = '\n' + HTML_VOICE_BTN + '\n' + HTML_VOICE_IND + '\n' + HTML_SHARE_BTN + '\n'
    if '</body>' in html:
        html = html.replace('</body>', insert + '</body>', 1)
    else:
        html += insert

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)

    return 'ok'


def main():
    scripts = sorted(glob.glob(os.path.join(ROOT, '**', 'script.js'), recursive=True))
    print(f'Found {len(scripts)} script.js files')

    stats = {'ok': 0, 'skip': 0, 'error': 0, 'html_ok': 0, 'html_skip': 0, 'html_err': 0}
    errors = []

    for sp in scripts:
        d = os.path.dirname(sp)
        hp = os.path.join(d, 'index.html')

        try:
            result = process_script(sp)
            if result == 'ok':
                stats['ok'] += 1
            elif result.startswith('skip'):
                stats['skip'] += 1
            else:
                stats['error'] += 1
                errors.append(f'  script {result}: {sp}')
        except Exception as ex:
            stats['error'] += 1
            errors.append(f'  script exception: {sp} -> {ex}')

        if os.path.exists(hp):
            try:
                hr = process_html(hp)
                if hr == 'ok':
                    stats['html_ok'] += 1
                elif hr == 'skip':
                    stats['html_skip'] += 1
            except Exception as ex:
                stats['html_err'] += 1
                errors.append(f'  html exception: {hp} -> {ex}')

    print(f'\n=== RESULTS ===')
    print(f'script.js  -- patched: {stats["ok"]}, skipped: {stats["skip"]}, errors: {stats["error"]}')
    print(f'index.html -- patched: {stats["html_ok"]}, skipped: {stats["html_skip"]}, errors: {stats["html_err"]}')

    if errors:
        print(f'\nErrors ({len(errors)}):')
        for e in errors[:20]:
            print(e)

    # ── Syntax check ──
    print(f'\n=== SYNTAX CHECK (node -c) ===')
    # Pick samples from beginning, middle, and end
    sample = scripts[:15] + scripts[200:210] + scripts[-5:]
    ok = fail = 0
    for sp in sample:
        try:
            r = subprocess.run(['node', '-c', sp], capture_output=True, text=True, timeout=10)
            if r.returncode == 0:
                ok += 1
            else:
                fail += 1
                err_lines = r.stderr.strip().split('\n')
                # Show the file path and the error message
                print(f'  FAIL: {sp}')
                for ln in err_lines[:3]:
                    print(f'        {ln[:200]}')
        except Exception as ex:
            fail += 1
            print(f'  ERROR: {sp} -> {ex}')

    print(f'Checked {len(sample)} files: {ok} OK, {fail} FAIL')
    print(f'\nDone!')


if __name__ == '__main__':
    main()
