#!/usr/bin/env python3
"""
add_kids_mode.py — Inject Kids Mode system into all 488 apps.
Handles both old format (LANG_BASE spread markers) and new format (inline boundaries).
"""

import glob
import os
import re
import random
import subprocess
import sys

CATALOG = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject ──
LANG_EN = "kidsMode:'Kids Mode',kidsMascotHi:'Hi there, Agent!',kidsMission:'Mission Timer',kidsMissionDone:'Mission Complete!',kidsStickers:'Stickers',"
LANG_FR = "kidsMode:'Mode Enfant',kidsMascotHi:'Salut, Agent!',kidsMission:'Chrono Mission',kidsMissionDone:'Mission Accomplie!',kidsStickers:'Autocollants',"
LANG_AR = "kidsMode:'\\u0648\\u0636\\u0639 \\u0627\\u0644\\u0623\\u0637\\u0641\\u0627\\u0644',kidsMascotHi:'\\u0645\\u0631\\u062d\\u0628\\u0627 \\u0623\\u064a\\u0647\\u0627 \\u0627\\u0644\\u0639\\u0645\\u064a\\u0644!',kidsMission:'\\u0645\\u0624\\u0642\\u062a \\u0627\\u0644\\u0645\\u0647\\u0645\\u0629',kidsMissionDone:'!\\u0627\\u0644\\u0645\\u0647\\u0645\\u0629 \\u0645\\u0643\\u062a\\u0645\\u0644\\u0629',kidsStickers:'\\u0645\\u0644\\u0635\\u0642\\u0627\\u062a',"

# ── JS function to inject ──
KIDS_MODE_JS = r'''
/* ═══════ Kids Mode ═══════ */
function initKidsMode(){
 if(document.getElementById('kidsToggleBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var STICKER_SET=['🚀','🔬','🛸','🤖','🔭','🧪','🕵️','🧲','💡','⚡','🌟','🧬','📡','🔮','🛰️','🎯','🧠','💎','🔑','🗝️'];

 /* ── CSS injection ── */
 var style=document.createElement('style');
 style.textContent='.kids-mode .card,.kids-mode .sidebar-body,.kids-mode .help-content{font-size:115%!important;letter-spacing:0.3px!important}'
  +'.kids-mode .expert-only,.kids-mode .advanced{display:none!important}'
  +'.kids-mascot{position:fixed;bottom:12px;left:12px;width:40px;height:40px;z-index:9999;pointer-events:none;display:none}'
  +'.kids-mode .kids-mascot{display:block}'
  +'@keyframes kmBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}'
  +'@keyframes kmHappy{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}'
  +'.kids-mascot svg{animation:kmBounce 1.5s ease-in-out infinite}'
  +'.kids-mascot.km-happy svg{animation:kmHappy 0.4s ease-in-out}'
  +'.kids-mascot .km-thought{position:absolute;top:-16px;left:50%;transform:translateX(-50%);font-size:16px;display:none}'
  +'.kids-mascot.km-thinking .km-thought{display:block}'
  +'.km-mission-timer{position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.75);color:#0f0;padding:6px 14px;border-radius:8px;font-family:monospace;font-size:15px;z-index:9998;display:none}'
  +'.kids-mode .km-mission-timer.km-active{display:block}'
  +'.km-confetti{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;display:flex;align-items:center;justify-content:center;font-size:32px;opacity:0;transition:opacity 0.3s}'
  +'.km-confetti.km-show{opacity:1}'
  +'.kids-read-btn{background:none;border:none;cursor:pointer;font-size:14px;padding:2px 4px;opacity:0.7}'
  +'.kids-read-btn:hover{opacity:1}'
  +'.km-sticker-badge{position:absolute;top:-4px;right:-4px;background:#e74c3c;color:#fff;border-radius:50%;width:16px;height:16px;font-size:9px;display:flex;align-items:center;justify-content:center;pointer-events:none}';
 document.head.appendChild(style);

 /* ── Toggle button ── */
 var hdr=document.querySelector('.header-buttons');
 if(!hdr)return;
 var btn=document.createElement('button');
 btn.id='kidsToggleBtn';
 btn.className='btn-icon-only';
 btn.style.position='relative';
 btn.textContent='\uD83D\uDE80 '+(L.kidsMode||'Kids');
 hdr.appendChild(btn);

 var badge=document.createElement('span');
 badge.className='km-sticker-badge';
 badge.style.display='none';
 btn.appendChild(badge);

 /* ── Mascot ── */
 var mascotDiv=document.createElement('div');
 mascotDiv.className='kids-mascot';
 mascotDiv.innerHTML='<span class="km-thought">❓</span>'
  +'<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">'
  +'<rect x="8" y="10" width="24" height="20" rx="4" fill="#4fc3f7"/>'
  +'<rect x="6" y="6" width="28" height="6" rx="3" fill="#29b6f6"/>'
  +'<circle class="km-eye-l" cx="15" cy="20" r="3" fill="#fff"/>'
  +'<circle class="km-eye-r" cx="25" cy="20" r="3" fill="#fff"/>'
  +'<circle cx="15" cy="20" r="1.5" fill="#333"/>'
  +'<circle cx="25" cy="20" r="1.5" fill="#333"/>'
  +'<rect x="13" y="26" width="14" height="2" rx="1" fill="#fff"/>'
  +'<rect x="12" y="32" width="6" height="6" rx="2" fill="#4fc3f7"/>'
  +'<rect x="22" y="32" width="6" height="6" rx="2" fill="#4fc3f7"/>'
  +'<line x1="20" y1="2" x2="20" y2="6" stroke="#ffd54f" stroke-width="2" stroke-linecap="round"/>'
  +'<circle cx="20" cy="1" r="2" fill="#ffd54f"/>'
  +'</svg>';
 document.body.appendChild(mascotDiv);

 /* ── Mission timer ── */
 var timerDiv=document.createElement('div');
 timerDiv.className='km-mission-timer';
 timerDiv.textContent=(L.kidsMission||'Mission Timer')+': 60s';
 document.body.appendChild(timerDiv);

 /* ── Confetti overlay ── */
 var confettiDiv=document.createElement('div');
 confettiDiv.className='km-confetti';
 document.body.appendChild(confettiDiv);

 /* ── Audio helper ── */
 var KAudioCtx=window.AudioContext||window.webkitAudioContext;
 var kAudioCtx;
 function playTone(freq,duration,type){
  if(!document.body.classList.contains('kids-mode'))return;
  try{
   if(!kAudioCtx)kAudioCtx=new KAudioCtx();
   var osc=kAudioCtx.createOscillator();
   var g=kAudioCtx.createGain();
   osc.type=type||'sine';
   osc.frequency.value=freq;
   g.gain.value=0.08;
   osc.connect(g);g.connect(kAudioCtx.destination);
   osc.start();
   g.gain.exponentialRampToValueAtTime(0.001,kAudioCtx.currentTime+duration/1000);
   osc.stop(kAudioCtx.currentTime+duration/1000);
  }catch(e){}
 }
 function playChord(freqs,dur){
  for(var i=0;i<freqs.length;i++)playTone(freqs[i],dur,'sine');
 }

 /* ── Sticker system ── */
 var stickersKey='kidsStickers';
 function getStickers(){try{return JSON.parse(localStorage.getItem(stickersKey))||[];}catch(e){return[];}}
 function addSticker(){
  var s=getStickers();
  s.push(STICKER_SET[Math.floor(Math.random()*STICKER_SET.length)]);
  localStorage.setItem(stickersKey,JSON.stringify(s));
  updateBadge();
  setMascotState('happy');
 }
 function updateBadge(){
  var s=getStickers();
  if(s.length>0){badge.textContent=s.length;badge.style.display='flex';}
  else{badge.style.display='none';}
 }

 /* ── Mascot states ── */
 function setMascotState(state){
  mascotDiv.classList.remove('km-happy','km-thinking');
  if(state==='happy'){
   mascotDiv.classList.add('km-happy');
   var eyeL=mascotDiv.querySelector('.km-eye-l');
   var eyeR=mascotDiv.querySelector('.km-eye-r');
   if(eyeL)eyeL.textContent='\u2B50';
   if(eyeR)eyeR.textContent='\u2B50';
   setTimeout(function(){
    mascotDiv.classList.remove('km-happy');
    if(eyeL)eyeL.textContent='';
    if(eyeR)eyeR.textContent='';
   },800);
  }else if(state==='thinking'){
   mascotDiv.classList.add('km-thinking');
  }
 }

 /* ── Help panel observer for thinking state ── */
 var helpObs=new MutationObserver(function(){
  var helpOpen=document.querySelector('.help-panel.open,.help-panel.active,.help-panel[style*="display: block"],.help-panel.show');
  if(helpOpen&&document.body.classList.contains('kids-mode')){setMascotState('thinking');}
  else{mascotDiv.classList.remove('km-thinking');}
 });
 helpObs.observe(document.body,{attributes:true,subtree:true,childList:true});

 /* ── Read-aloud buttons ── */
 function addReadButtons(){
  document.querySelectorAll('.kids-read-btn').forEach(function(b){b.remove();});
  if(!document.body.classList.contains('kids-mode'))return;
  document.querySelectorAll('.sidebar p[data-i18n],.sidebar-body p[data-i18n]').forEach(function(p){
   var rb=document.createElement('button');
   rb.className='kids-read-btn';
   rb.textContent='\uD83D\uDD0A';
   rb.title='Read aloud';
   rb.addEventListener('click',function(e){
    e.stopPropagation();
    var u=new SpeechSynthesisUtterance(p.textContent);
    u.rate=0.9;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
   });
   p.parentNode.insertBefore(rb,p.nextSibling);
  });
 }

 /* ── Mission timer logic ── */
 var missionInterval=null;
 function startMission(){
  if(!document.body.classList.contains('kids-mode'))return;
  if(missionInterval)clearInterval(missionInterval);
  var secs=60;
  timerDiv.classList.add('km-active');
  timerDiv.textContent=(L.kidsMission||'Mission Timer')+': '+secs+'s';
  missionInterval=setInterval(function(){
   secs--;
   if(secs<=0){
    clearInterval(missionInterval);
    missionInterval=null;
    timerDiv.textContent=(L.kidsMissionDone||'Mission Complete!');
    showConfetti();
    setTimeout(function(){timerDiv.classList.remove('km-active');},3000);
   }else{
    timerDiv.textContent=(L.kidsMission||'Mission Timer')+': '+secs+'s';
   }
  },1000);
 }

 function showConfetti(){
  var burst=['🎉','🎊','⭐','🌟','🚀','💫','✨','🎆','🏆','🥇'];
  var txt='';
  for(var i=0;i<15;i++)txt+=burst[Math.floor(Math.random()*burst.length)];
  confettiDiv.textContent=txt;
  confettiDiv.classList.add('km-show');
  setTimeout(function(){confettiDiv.classList.remove('km-show');},2500);
 }

 /* ── Sound hooks ── */
 function hookSounds(){
  var startBtn=document.getElementById('startBtn')||document.querySelector('[data-action="start"]');
  var stopBtn=document.getElementById('stopBtn')||document.querySelector('[data-action="stop"]');
  var resetBtn=document.getElementById('resetBtn')||document.querySelector('[data-action="reset"]');
  if(startBtn)startBtn.addEventListener('click',function(){
   playTone(440,200,'sine');setTimeout(function(){playTone(880,200,'sine');},50);
   startMission();
   setMascotState('happy');
  });
  if(stopBtn)stopBtn.addEventListener('click',function(){
   playTone(880,200,'sine');setTimeout(function(){playTone(440,200,'sine');},50);
  });
  if(resetBtn)resetBtn.addEventListener('click',function(){playTone(660,100,'square');});

  document.addEventListener('click',function(e){
   var t=e.target;
   if(t&&t.classList&&t.classList.contains('quiz-option')){
    setTimeout(function(){
     if(t.classList.contains('correct')){playChord([523.25,659.25,783.99],300);}
     else if(t.classList.contains('wrong')){playTone(300,200,'sawtooth');}
    },100);
   }
  });
 }

 /* ── Toggle logic ── */
 var saved=localStorage.getItem('kidsMode');
 if(saved==='on')document.body.classList.add('kids-mode');

 function toggleKids(){
  document.body.classList.toggle('kids-mode');
  var on=document.body.classList.contains('kids-mode');
  localStorage.setItem('kidsMode',on?'on':'off');
  if(on){addReadButtons();addSticker();}
  else{document.querySelectorAll('.kids-read-btn').forEach(function(b){b.remove();});}
 }
 btn.addEventListener('click',toggleKids);

 /* ── Init ── */
 updateBadge();
 hookSounds();
 if(document.body.classList.contains('kids-mode')){addReadButtons();addSticker();}
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initKidsMode);}
else{initKidsMode();}
'''


def find_script_files():
    """Find all script.js files matching [0-9]*-*/*/script.js"""
    pattern = os.path.join(CATALOG, '[0-9]*-*', '*', 'script.js')
    return sorted(glob.glob(pattern))


def is_old_format(content):
    """Old format has ...LANG_BASE.fr, spread marker"""
    return '...LANG_BASE.fr,' in content


def inject_lang_keys(content):
    """Inject LANG keys into en/fr/ar blocks."""
    if is_old_format(content):
        # Old format: inject after ...LANG_BASE.en, / .fr, / .ar,
        if 'LANG_BASE.en,' in content and LANG_EN not in content:
            content = content.replace('...LANG_BASE.en,', '...LANG_BASE.en,' + LANG_EN, 1)
        if 'LANG_BASE.fr,' in content and LANG_FR not in content:
            content = content.replace('...LANG_BASE.fr,', '...LANG_BASE.fr,' + LANG_FR, 1)
        if 'LANG_BASE.ar,' in content and LANG_AR not in content:
            content = content.replace('...LANG_BASE.ar,', '...LANG_BASE.ar,' + LANG_AR, 1)
    else:
        # New format: uses },fr:{ and },ar:{ and }}; boundaries
        # en block: after first { of en:{
        # Find const LANG={en:{ or const LANG = { en: {
        en_match = re.search(r'const\s+LANG\s*=\s*\{\s*en\s*:\s*\{', content)
        if en_match and LANG_EN not in content:
            pos = en_match.end()
            content = content[:pos] + LANG_EN + content[pos:]

        # fr block: after },fr:{
        fr_match = re.search(r'\},\s*fr\s*:\s*\{', content)
        if fr_match and LANG_FR not in content:
            pos = fr_match.end()
            content = content[:pos] + LANG_FR + content[pos:]

        # ar block: after },ar:{
        ar_match = re.search(r'\},\s*ar\s*:\s*\{', content)
        if ar_match and LANG_AR not in content:
            pos = ar_match.end()
            content = content[:pos] + LANG_AR + content[pos:]

    return content


def find_lang_block_end(content):
    """Find the position right after the LANG block closing };
    The LANG block starts with 'const LANG' (not LANG_BASE) and ends with '};'
    """
    # Find start of LANG block - must be 'const LANG=' or 'const LANG ' but not LANG_BASE
    lang_start = -1
    for m in re.finditer(r'const\s+LANG\s*[={\s]', content):
        # Make sure it's not LANG_BASE
        after = content[m.start():m.start()+30]
        if 'LANG_BASE' not in after:
            lang_start = m.start()
            break
    if lang_start == -1:
        return -1

    # For compact format ending with }};
    # For multi-line format ending with };\n on its own line
    # We need to find the matching closing

    # Strategy: from lang_start, track brace depth
    i = content.index('{', lang_start)
    depth = 0
    in_string = False
    string_char = None
    escaped = False

    while i < len(content):
        c = content[i]

        if escaped:
            escaped = False
            i += 1
            continue

        if c == '\\':
            escaped = True
            i += 1
            continue

        if in_string:
            if c == string_char:
                in_string = False
            i += 1
            continue

        if c in ("'", '"', '`'):
            in_string = True
            string_char = c
            i += 1
            continue

        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                # Found the closing } of const LANG = {...}
                # Now skip the ;
                j = i + 1
                while j < len(content) and content[j] in (' ', '\t'):
                    j += 1
                if j < len(content) and content[j] == ';':
                    return j + 1  # position after ;
                return i + 1

        i += 1

    return -1


def inject_js_function(content):
    """Inject the initKidsMode function after the LANG block closing."""
    pos = find_lang_block_end(content)
    if pos == -1:
        return content, False

    content = content[:pos] + '\n' + KIDS_MODE_JS + content[pos:]
    return content, True


def process_file(filepath):
    """Process a single script.js file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Idempotency check
    if "kidsMode:" in content and 'initKidsMode' in content:
        return 'skipped'

    # Inject LANG keys
    content = inject_lang_keys(content)

    # Inject JS function
    content, ok = inject_js_function(content)
    if not ok:
        return 'error_no_lang_block'

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return 'ok'


def main():
    files = find_script_files()
    print('Found {} script.js files'.format(len(files)))

    results = {'ok': 0, 'skipped': 0, 'error_no_lang_block': 0, 'errors': []}

    for filepath in files:
        try:
            status = process_file(filepath)
            if status in results:
                results[status] += 1
            else:
                results['errors'].append((filepath, status))
        except Exception as e:
            results['errors'].append((filepath, str(e)))

    print('\n=== SUMMARY ===')
    print('Total files:    {}'.format(len(files)))
    print('Injected OK:    {}'.format(results['ok']))
    print('Skipped (exist):{}'.format(results['skipped']))
    print('No LANG block:  {}'.format(results['error_no_lang_block']))
    print('Errors:         {}'.format(len(results['errors'])))

    if results['errors']:
        print('\nError details:')
        for path, err in results['errors'][:10]:
            print('  {} -> {}'.format(path, err))

    # Verify 30 random files with node -c
    print('\n=== SYNTAX VERIFICATION (30 random files) ===')
    verify_files = random.sample(files, min(30, len(files)))
    pass_count = 0
    fail_count = 0
    for vf in verify_files:
        try:
            result = subprocess.run(
                ['node', '-c', vf],
                capture_output=True, text=True, timeout=10
            )
            if result.returncode == 0:
                pass_count += 1
            else:
                fail_count += 1
                print('  FAIL: {} -> {}'.format(vf, result.stderr.strip()[:120]))
        except Exception as e:
            fail_count += 1
            print('  FAIL: {} -> {}'.format(vf, str(e)[:120]))

    print('Syntax check: {}/{} passed'.format(pass_count, len(verify_files)))

    if fail_count > 0:
        print('\nWARNING: {} files failed syntax check!'.format(fail_count))
        return 1
    else:
        print('\nAll verified files pass syntax check.')
        return 0


if __name__ == '__main__':
    sys.exit(main())
