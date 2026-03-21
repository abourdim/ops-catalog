#!/usr/bin/env python3
"""
add_pomodoro_portfolio.py
Adds Pomodoro Timer + 3D Card Flip to all 488 apps,
and creates a standalone portfolio.html page.
"""

import os, re, random, subprocess, json

BASE = os.path.dirname(os.path.abspath(__file__))

# ─── LANG keys to inject ───
LANG_EN = (
    "pomodoroTitle:'Pomodoro Timer',"
    "pomodoroFocus:'Focus',"
    "pomodoroBreak:'Break',"
    "pomodoroStart:'Start',"
    "pomodoroPause:'Pause',"
    "pomodoroReset:'Reset',"
    "pomodoroDone:'Session complete!',"
    "flipTitle:'Secret Stats',"
    "flipStats:'Hidden Statistics',"
    "flipTime:'Time Spent',"
    "flipChanges:'Parameter Changes',"
    "flipGame:'Click the Target',"
    "flipBack:'Flip Back',"
)

LANG_FR = (
    "pomodoroTitle:'Minuteur Pomodoro',"
    "pomodoroFocus:'Concentration',"
    "pomodoroBreak:'Pause',"
    "pomodoroStart:'D\\x27marrer',"
    "pomodoroPause:'Pause',"
    "pomodoroReset:'R\\x27initialiser',"
    "pomodoroDone:'Session termin\\x27e!',"
    "flipTitle:'Stats Secr\\x27tes',"
    "flipStats:'Statistiques Cach\\x27es',"
    "flipTime:'Temps Pass\\x27',"
    "flipChanges:'Modifications',"
    "flipGame:'Cliquez la Cible',"
    "flipBack:'Retourner',"
)

LANG_AR = (
    "pomodoroTitle:'\u0645\u0624\u0642\u062a \u0628\u0648\u0645\u0648\u062f\u0648\u0631\u0648',"
    "pomodoroFocus:'\u062a\u0631\u0643\u064a\u0632',"
    "pomodoroBreak:'\u0627\u0633\u062a\u0631\u0627\u062d\u0629',"
    "pomodoroStart:'\u0628\u062f\u0621',"
    "pomodoroPause:'\u0625\u064a\u0642\u0627\u0641',"
    "pomodoroReset:'\u0625\u0639\u0627\u062f\u0629',"
    "pomodoroDone:'\u0627\u0643\u062a\u0645\u0644\u062a \u0627\u0644\u062c\u0644\u0633\u0629!',"
    "flipTitle:'\u0625\u062d\u0635\u0627\u0626\u064a\u0627\u062a \u0633\u0631\u064a\u0629',"
    "flipStats:'\u0625\u062d\u0635\u0627\u0626\u064a\u0627\u062a \u0645\u062e\u0641\u064a\u0629',"
    "flipTime:'\u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0645\u0633\u062a\u063a\u0631\u0642',"
    "flipChanges:'\u0627\u0644\u062a\u063a\u064a\u064a\u0631\u0627\u062a',"
    "flipGame:'\u0627\u0646\u0642\u0631 \u0627\u0644\u0647\u062f\u0641',"
    "flipBack:'\u0627\u0631\u062c\u0639',"
)

# ─── JS functions to inject after LANG block ───
JS_FUNCTIONS = r'''
/* ═══════ POMODORO TIMER ═══════ */
function initPomodoro(){
  if(document.getElementById('pomodoroPanel'))return;
  var L=LANG[currentLang]||LANG.en;
  var appName=document.title||location.pathname.split('/').filter(Boolean).pop()||'unknown';
  var hdrBtns=document.querySelector('.header-buttons');
  if(!hdrBtns)return;
  var btn=document.createElement('button');
  btn.className='btn-icon-only';btn.id='pomodoroBtn';btn.textContent='\u{1F345}';btn.title=L.pomodoroTitle||'Pomodoro';
  hdrBtns.insertBefore(btn,hdrBtns.firstChild);
  var panel=document.createElement('div');panel.id='pomodoroPanel';
  panel.style.cssText='display:none;position:fixed;top:60px;right:16px;z-index:10000;background:var(--card,#1a1a2e);border:2px solid var(--accent,#e94560);border-radius:16px;padding:20px;min-width:220px;box-shadow:0 8px 32px rgba(0,0,0,0.5);font-family:inherit;color:var(--text,#eee);';
  panel.innerHTML='<div style="text-align:center;font-weight:700;font-size:1.1rem;margin-bottom:12px;" id="pomTitle">'+(L.pomodoroTitle||'Pomodoro')+'</div>'
    +'<div style="text-align:center;margin-bottom:8px;"><svg width="120" height="120" id="pomRingSvg"><circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/><circle id="pomRing" cx="60" cy="60" r="52" fill="none" stroke="var(--accent,#e94560)" stroke-width="8" stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="0" transform="rotate(-90 60 60)" style="transition:stroke-dashoffset 1s linear;"/><text x="60" y="60" text-anchor="middle" dominant-baseline="central" fill="var(--text,#eee)" font-size="24" font-weight="700" id="pomTime">25:00</text></svg></div>'
    +'<div style="text-align:center;margin-bottom:8px;font-size:0.85rem;" id="pomMode">'+(L.pomodoroFocus||'Focus')+'</div>'
    +'<div style="display:flex;gap:6px;justify-content:center;margin-bottom:10px;">'
    +'<button id="pomStart" style="padding:6px 14px;border:none;border-radius:8px;background:var(--accent,#e94560);color:#fff;cursor:pointer;font-weight:600;">'+(L.pomodoroStart||'Start')+'</button>'
    +'<button id="pomPause" style="padding:6px 14px;border:none;border-radius:8px;background:#555;color:#fff;cursor:pointer;font-weight:600;display:none;">'+(L.pomodoroPause||'Pause')+'</button>'
    +'<button id="pomReset" style="padding:6px 14px;border:none;border-radius:8px;background:#333;color:#fff;cursor:pointer;font-weight:600;">'+(L.pomodoroReset||'Reset')+'</button></div>'
    +'<div style="text-align:center;font-size:0.8rem;opacity:0.7;" id="pomSessions">\u{1F345} 0</div>';
  document.body.appendChild(panel);
  var FOCUS=25*60,BREAK=5*60,remaining=FOCUS,running=false,isFocus=true,sessions=0,interval=null,circumf=2*Math.PI*52;
  var ring=document.getElementById('pomRing'),timeEl=document.getElementById('pomTime'),modeEl=document.getElementById('pomMode'),sessEl=document.getElementById('pomSessions');
  var startBtn=document.getElementById('pomStart'),pauseBtn=document.getElementById('pomPause'),resetBtn=document.getElementById('pomReset');
  function fmt(s){var m=Math.floor(s/60),ss=s%60;return String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0');}
  function updateRing(){var total=isFocus?FOCUS:BREAK;var pct=remaining/total;ring.setAttribute('stroke-dashoffset',String(circumf*(1-pct)));}
  function tick(){
    if(!running)return;
    remaining--;timeEl.textContent=fmt(remaining);updateRing();
    if(remaining<=0){clearInterval(interval);running=false;
      startBtn.style.display='inline-block';pauseBtn.style.display='none';
      pomBeep();
      if(isFocus){sessions++;sessEl.textContent='\u{1F345} '+sessions;
        try{var k='pomodoro_'+appName;var d=JSON.parse(localStorage.getItem(k)||'[]');d.push({ts:Date.now(),app:appName});localStorage.setItem(k,JSON.stringify(d));}catch(e){}
        var mc=document.getElementById('mainCard');if(mc)mc.style.boxShadow='';
        isFocus=false;remaining=BREAK;modeEl.textContent=(LANG[currentLang]||LANG.en).pomodoroBreak||'Break';
        ring.setAttribute('stroke','#2ecc71');
      }else{isFocus=true;remaining=FOCUS;modeEl.textContent=(LANG[currentLang]||LANG.en).pomodoroFocus||'Focus';
        ring.setAttribute('stroke','var(--accent,#e94560)');
      }
      timeEl.textContent=fmt(remaining);updateRing();
    }
  }
  function pomBeep(){try{var ac=new(window.AudioContext||window.webkitAudioContext)();var o=ac.createOscillator();var g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=880;o.type='sine';g.gain.value=0.15;var t=ac.currentTime;g.gain.exponentialRampToValueAtTime(0.001,t+0.5);o.start(t);o.stop(t+0.5);}catch(e){}}
  startBtn.onclick=function(){if(running)return;running=true;interval=setInterval(tick,1000);startBtn.style.display='none';pauseBtn.style.display='inline-block';
    if(isFocus){var mc=document.getElementById('mainCard');if(mc)mc.style.boxShadow='0 0 20px rgba(233,69,96,0.4)';}};
  pauseBtn.onclick=function(){running=false;clearInterval(interval);startBtn.style.display='inline-block';pauseBtn.style.display='none';};
  resetBtn.onclick=function(){running=false;clearInterval(interval);isFocus=true;remaining=FOCUS;timeEl.textContent=fmt(remaining);ring.setAttribute('stroke-dashoffset','0');ring.setAttribute('stroke','var(--accent,#e94560)');modeEl.textContent=(LANG[currentLang]||LANG.en).pomodoroFocus||'Focus';startBtn.style.display='inline-block';pauseBtn.style.display='none';var mc=document.getElementById('mainCard');if(mc)mc.style.boxShadow='';};
  btn.onclick=function(){panel.style.display=panel.style.display==='none'?'block':'none';};
  document.addEventListener('click',function(e){if(!panel.contains(e.target)&&e.target!==btn&&panel.style.display==='block')panel.style.display='none';});
}

/* ═══════ 3D CARD FLIP ═══════ */
function initCardFlip(){
  var mc=document.getElementById('mainCard');if(!mc||mc.dataset.flipInit)return;mc.dataset.flipInit='1';
  var L=LANG[currentLang]||LANG.en;
  var appName=document.title||location.pathname.split('/').filter(Boolean).pop()||'unknown';
  var style=document.createElement('style');
  style.textContent='.flip-wrapper{perspective:1000px;}.flip-inner{position:relative;transform-style:preserve-3d;transition:transform 0.6s ease;}.flip-inner.flipped{transform:rotateY(180deg);}.flip-front,.flip-back{backface-visibility:hidden;}.flip-back{position:absolute;top:0;left:0;width:100%;height:100%;transform:rotateY(180deg);background:var(--card,#1a1a2e);border-radius:inherit;padding:20px;overflow-y:auto;box-sizing:border-box;color:var(--text,#eee);display:flex;flex-direction:column;gap:10px;}.flip-back h3{margin:0;font-size:1.2rem;color:var(--accent,#e94560);}.flip-back .stat-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.1);font-size:0.9rem;}.flip-target-area{position:relative;width:100%;height:120px;background:rgba(0,0,0,0.3);border-radius:8px;overflow:hidden;cursor:crosshair;}.flip-dot{position:absolute;width:20px;height:20px;background:#e94560;border-radius:50%;cursor:pointer;transition:none;}.flip-back-btn{padding:8px 16px;border:none;border-radius:8px;background:var(--accent,#e94560);color:#fff;cursor:pointer;font-weight:600;align-self:center;margin-top:auto;}';
  document.head.appendChild(style);
  var wrapper=document.createElement('div');wrapper.className='flip-wrapper';
  mc.parentNode.insertBefore(wrapper,mc);
  var inner=document.createElement('div');inner.className='flip-inner';
  wrapper.appendChild(inner);
  mc.classList.add('flip-front');inner.appendChild(mc);
  var back=document.createElement('div');back.className='flip-back';
  var timeKey='apptime_'+appName,changeKey='appchanges_'+appName,scoreKey='quizScore_'+appName;
  var timeSpent=0;try{timeSpent=parseInt(localStorage.getItem(timeKey)||'0');}catch(e){}
  var changes=0;try{changes=parseInt(localStorage.getItem(changeKey)||'0');}catch(e){}
  var bestScore=0;try{bestScore=parseInt(localStorage.getItem(scoreKey)||'0');}catch(e){}
  var facts=['Radio waves travel at the speed of light.','The first computer bug was a real moth.','WiFi stands for nothing - it is a brand name.','Bluetooth is named after a Viking king.','The first email was sent in 1971.','morse code SOS does not stand for anything.','A byte has 256 possible values.','The first webcam watched a coffee pot.','GPS needs 4 satellites for 3D positioning.','Arduino was named after a bar in Italy.'];
  var fact=facts[Math.floor(Math.random()*facts.length)];
  back.innerHTML='<h3>\u{1F510} '+(L.flipTitle||'Secret Stats')+'</h3>'
    +'<div class="stat-row"><span>'+(L.flipTime||'Time Spent')+'</span><span id="flipTimeVal">'+Math.floor(timeSpent/60)+'m '+timeSpent%60+'s</span></div>'
    +'<div class="stat-row"><span>'+(L.flipChanges||'Parameter Changes')+'</span><span>'+changes+'</span></div>'
    +'<div class="stat-row"><span>Best Quiz Score</span><span>'+bestScore+'%</span></div>'
    +'<div class="stat-row"><span>Achievements</span><span id="flipBadges">-</span></div>'
    +'<div style="font-size:0.85rem;"><strong>'+(L.flipGame||'Click the Target')+'</strong><div class="flip-target-area" id="flipTargetArea"></div><div style="text-align:center;margin-top:4px;font-size:0.8rem;" id="flipGameScore">Score: 0</div></div>'
    +'<div style="font-size:0.8rem;font-style:italic;opacity:0.7;">\u{1F4A1} '+fact+'</div>'
    +'<button class="flip-back-btn" id="flipBackBtn">\u{21A9}\uFE0F '+(L.flipBack||'Flip Back')+'</button>';
  inner.appendChild(back);
  var gameScore=0,gameActive=false;
  function spawnDot(){var area=document.getElementById('flipTargetArea');if(!area)return;area.innerHTML='';var dot=document.createElement('div');dot.className='flip-dot';dot.style.left=Math.random()*(area.offsetWidth-20)+'px';dot.style.top=Math.random()*(area.offsetHeight-20)+'px';dot.onclick=function(e){e.stopPropagation();gameScore++;var el=document.getElementById('flipGameScore');if(el)el.textContent='Score: '+gameScore;spawnDot();};area.appendChild(dot);}
  mc.addEventListener('dblclick',function(e){if(inner.classList.contains('flipped'))return;inner.classList.add('flipped');gameScore=0;var el=document.getElementById('flipGameScore');if(el)el.textContent='Score: 0';spawnDot();
    try{var badges=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('badge_')===0){badges.push(k.replace('badge_',''));}}var bEl=document.getElementById('flipBadges');if(bEl)bEl.textContent=badges.length?badges.join(', '):'-';}catch(e){}});
  document.getElementById('flipBackBtn').onclick=function(e){e.stopPropagation();inner.classList.remove('flipped');};
  setInterval(function(){try{var v=parseInt(localStorage.getItem(timeKey)||'0');localStorage.setItem(timeKey,String(v+1));}catch(e){}},1000);
}
'''

def find_all_script_js():
    """Find all script.js files in category/app dirs."""
    scripts = []
    for cat in sorted(os.listdir(BASE)):
        cat_path = os.path.join(BASE, cat)
        if not os.path.isdir(cat_path) or not re.match(r'^\d{2}-', cat):
            continue
        for app in sorted(os.listdir(cat_path)):
            app_path = os.path.join(cat_path, app)
            sjs = os.path.join(app_path, 'script.js')
            if os.path.isfile(sjs):
                scripts.append(sjs)
    return scripts


def inject_lang_keys(content):
    """Inject LANG keys into en/fr/ar blocks."""
    # Find the LANG block
    lang_start = content.find('const LANG = {')
    if lang_start == -1:
        lang_start = content.find('const LANG={')
    if lang_start == -1:
        return content, False

    # Find ar: section and closing };
    ar_pos = -1
    for marker in ['  ar: {', '  ar:{', ' ar:{', '\nar:{', ',ar:{']:
        ar_pos = content.find(marker, lang_start)
        if ar_pos != -1:
            break
    if ar_pos == -1:
        return content, False

    lang_end = content.find('\n};', ar_pos)
    if lang_end == -1:
        # Try }};  format (minified, closing on same line)
        lang_end = content.find('}};', ar_pos)
        if lang_end == -1:
            return content, False
        lang_end_len = 3  # '}};'
        lang_block = content[lang_start:lang_end + lang_end_len]
    else:
        lang_end_len = 3  # '\n};'  but we include \n so +3 from position
        lang_block = content[lang_start:lang_end + lang_end_len]

    def inject_after_sandbox_reset(block, lang_keys, section_markers):
        """Inject lang keys after sandboxReset in a language section."""
        sec_pos = -1
        for marker in section_markers:
            sec_pos = block.find(marker)
            if sec_pos != -1:
                break
        if sec_pos == -1:
            return block, False

        # Find next section or end to limit our search
        next_sections = []
        for nm in ['  fr:', ' fr:{', '\nfr:{', ',fr:{', '  ar:', ' ar:{', '\nar:{', ',ar:{']:
            np = block.find(nm, sec_pos + 5)
            if np != -1:
                next_sections.append(np)
        # Also find the end '};'
        end_pos = block.find('\n};', sec_pos)
        if end_pos != -1:
            next_sections.append(end_pos)
        end_pos2 = block.find('}};', sec_pos)
        if end_pos2 != -1:
            next_sections.append(end_pos2)
        boundary = min(next_sections) if next_sections else len(block)

        # Find sandboxReset within this section
        sr_pos = block.find("sandboxReset:'", sec_pos)
        if sr_pos == -1 or sr_pos > boundary:
            sr_pos = block.find("sandboxReset:", sec_pos)
        if sr_pos == -1 or sr_pos > boundary:
            return block, False

        # Find the end of sandboxReset value: pattern is 'value',
        after_sr = block.find("',", sr_pos)
        if after_sr == -1 or after_sr > boundary:
            return block, False
        insert_pos = after_sr + 2  # right after the comma

        # Insert the lang keys inline (no newline needed for minified)
        block = block[:insert_pos] + lang_keys + block[insert_pos:]
        return block, True

    new_block = lang_block
    ok1 = ok2 = ok3 = False

    new_block, ok1 = inject_after_sandbox_reset(new_block, LANG_EN, ['  en: {', '  en:{', ' en:{', '\nen:{', '{en:{'])
    new_block, ok2 = inject_after_sandbox_reset(new_block, LANG_FR, ['  fr: {', '  fr:{', ' fr:{', '\nfr:{', ',fr:{'])
    new_block, ok3 = inject_after_sandbox_reset(new_block, LANG_AR, ['  ar: {', '  ar:{', ' ar:{', '\nar:{', ',ar:{'])

    if not (ok1 and ok2 and ok3):
        return content, False

    content = content[:lang_start] + new_block + content[lang_start + len(lang_block):]
    return content, True


def inject_js_functions(content):
    """Inject initPomodoro and initCardFlip functions after the LANG block."""
    lang_start = content.find('const LANG = {')
    if lang_start == -1:
        lang_start = content.find('const LANG={')
    if lang_start == -1:
        return content, False

    # Find ar: section with various formats
    for marker in ['  ar: {', '  ar:{', ' ar:{', '\nar:{', ',ar:{']:
        ar_pos = content.find(marker, lang_start)
        if ar_pos != -1:
            break
    if ar_pos == -1:
        return content, False

    lang_end = content.find('\n};', ar_pos)
    if lang_end != -1:
        insert_pos = lang_end + 3  # after '\n};'
    else:
        lang_end = content.find('}};', ar_pos)
        if lang_end == -1:
            return content, False
        insert_pos = lang_end + 3  # after '}};'

    content = content[:insert_pos] + '\n' + JS_FUNCTIONS + content[insert_pos:]
    return content, True


def inject_init_calls(content):
    """Add DOMContentLoaded init calls for pomodoro and card flip."""
    # Find the DOMContentLoaded pattern at end of file
    # Pattern: document.readyState === 'loading'
    #   ? document.addEventListener('DOMContentLoaded', init)
    #   : init();
    # OR just append at the end

    init_code = """
/* ═══════ INIT POMODORO + CARD FLIP ═══════ */
document.addEventListener('DOMContentLoaded', function(){
  try { initPomodoro(); } catch(e) { console.warn('Pomodoro init error:', e); }
  try { initCardFlip(); } catch(e) { console.warn('CardFlip init error:', e); }
});
"""
    content = content.rstrip() + '\n' + init_code
    return content, True


def process_script(filepath):
    """Process a single script.js file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Idempotency check
    if 'pomodoroTitle' in content:
        return 'skip'

    # Check it has LANG block
    if 'const LANG = {' not in content and 'const LANG={' not in content:
        return 'no_lang'

    original = content

    content, ok1 = inject_lang_keys(content)
    if not ok1:
        return 'lang_fail'

    content, ok2 = inject_js_functions(content)
    if not ok2:
        return 'js_fail'

    content, ok3 = inject_init_calls(content)
    if not ok3:
        return 'init_fail'

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return 'ok'


def create_portfolio_html():
    """Create the standalone portfolio.html page."""
    html = r'''<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Student Portfolio — Workshop DIY</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
:root{--bg:#0a0a1a;--card:#141428;--accent:#e94560;--accent2:#0f3460;--text:#eaeaea;--text2:#999;--border:rgba(255,255,255,0.08);}
body{font-family:'Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;padding:0;}
.topbar{position:sticky;top:0;z-index:100;background:rgba(10,10,26,0.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:12px 24px;}
.topbar h1{font-size:1.3rem;color:var(--accent);}
.topbar-actions{display:flex;gap:8px;align-items:center;}
.topbar-actions button,.topbar-actions select{padding:6px 14px;border:1px solid var(--border);border-radius:8px;background:var(--card);color:var(--text);cursor:pointer;font-size:0.85rem;}
.topbar-actions button:hover{background:var(--accent);color:#fff;border-color:var(--accent);}
.container{max-width:1100px;margin:0 auto;padding:24px;}
.section{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;margin-bottom:20px;}
.section h2{font-size:1.15rem;color:var(--accent);margin-bottom:16px;display:flex;align-items:center;gap:8px;}
.profile-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;}
.profile-stat{background:rgba(255,255,255,0.03);border-radius:12px;padding:16px;text-align:center;}
.profile-stat .val{font-size:2rem;font-weight:700;color:var(--accent);}
.profile-stat .lbl{font-size:0.8rem;color:var(--text2);margin-top:4px;}
.badge-grid{display:flex;flex-wrap:wrap;gap:10px;}
.badge-item{background:rgba(233,69,96,0.1);border:1px solid rgba(233,69,96,0.3);border-radius:10px;padding:8px 14px;font-size:0.85rem;display:flex;align-items:center;gap:6px;}
.cert-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;}
.cert-card{background:linear-gradient(135deg,#1a1a3e,#0f3460);border:2px solid var(--accent);border-radius:12px;padding:20px;text-align:center;position:relative;overflow:hidden;}
.cert-card::before{content:'';position:absolute;top:-30px;right:-30px;width:80px;height:80px;background:var(--accent);opacity:0.1;border-radius:50%;}
.cert-card h3{font-size:1rem;margin-bottom:6px;}
.cert-card p{font-size:0.8rem;color:var(--text2);}
.rating-list,.log-list,.quiz-list,.collection-list{display:flex;flex-direction:column;gap:8px;}
.rating-item,.log-item,.quiz-item,.collection-item{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:rgba(255,255,255,0.03);border-radius:10px;font-size:0.88rem;}
.stars{color:#f1c40f;}
.heatmap{display:grid;grid-template-columns:repeat(52,1fr);gap:2px;margin-bottom:16px;}
.heatmap-cell{width:100%;aspect-ratio:1;border-radius:2px;background:rgba(255,255,255,0.05);}
.heatmap-cell.l1{background:rgba(233,69,96,0.2);}
.heatmap-cell.l2{background:rgba(233,69,96,0.4);}
.heatmap-cell.l3{background:rgba(233,69,96,0.6);}
.heatmap-cell.l4{background:rgba(233,69,96,0.9);}
.timeline-list{display:flex;flex-direction:column;gap:6px;max-height:300px;overflow-y:auto;}
.timeline-item{font-size:0.82rem;padding:8px 12px;background:rgba(255,255,255,0.03);border-radius:8px;border-left:3px solid var(--accent);}
.empty{text-align:center;color:var(--text2);padding:20px;font-size:0.9rem;}
@media print{.topbar{position:static;}.topbar-actions{display:none;}.section{break-inside:avoid;}body{background:#fff;color:#222;}.section{background:#f9f9f9;border-color:#ddd;}.section h2{color:#c0392b;}.profile-stat .val{color:#c0392b;}}
[dir="rtl"] .timeline-item{border-left:none;border-right:3px solid var(--accent);}
</style>
</head>
<body>
<div class="topbar">
  <h1 id="pageTitle">&#x1F393; Student Portfolio</h1>
  <div class="topbar-actions">
    <select id="langToggle" onchange="switchLang(this.value)">
      <option value="en">&#x1F1EC;&#x1F1E7; EN</option>
      <option value="fr">&#x1F1EB;&#x1F1F7; FR</option>
      <option value="ar">&#x1F1E9;&#x1F1FF; AR</option>
    </select>
    <button onclick="exportHTML()">&#x1F4E5; Export</button>
    <button onclick="window.print()">&#x1F5A8;&#xFE0F; Print</button>
  </div>
</div>
<div class="container" id="content">
  <div class="section" id="profileSection">
    <h2 data-i18n="profile">&#x1F575;&#xFE0F; Profile</h2>
    <div class="profile-grid" id="profileGrid"></div>
  </div>
  <div class="section" id="achieveSection">
    <h2 data-i18n="achievements">&#x1F3C6; Achievements</h2>
    <div class="badge-grid" id="badgeGrid"></div>
  </div>
  <div class="section" id="certSection">
    <h2 data-i18n="certificates">&#x1F4DC; Certificates</h2>
    <div class="cert-grid" id="certGrid"></div>
  </div>
  <div class="section" id="ratingSection">
    <h2 data-i18n="topRatings">&#x2B50; Top Ratings</h2>
    <div class="rating-list" id="ratingList"></div>
  </div>
  <div class="section" id="logSection">
    <h2 data-i18n="expLogs">&#x1F9EA; Experiment Logs</h2>
    <div class="log-list" id="logList"></div>
  </div>
  <div class="section" id="quizSection">
    <h2 data-i18n="quizScores">&#x1F4DD; Quiz Scores</h2>
    <div class="quiz-list" id="quizList"></div>
  </div>
  <div class="section" id="collectSection">
    <h2 data-i18n="collections">&#x1F4DA; Collections</h2>
    <div class="collection-list" id="collectList"></div>
  </div>
  <div class="section" id="timelineSection">
    <h2 data-i18n="timeline">&#x1F4C5; Activity Timeline</h2>
    <div class="heatmap" id="heatmap"></div>
    <div class="timeline-list" id="timelineList"></div>
  </div>
</div>
<script>
var PLANG={
  en:{profile:'&#x1F575;&#xFE0F; Profile',achievements:'&#x1F3C6; Achievements',certificates:'&#x1F4DC; Certificates',topRatings:'&#x2B50; Top Ratings',expLogs:'&#x1F9EA; Experiment Logs',quizScores:'&#x1F4DD; Quiz Scores',collections:'&#x1F4DA; Collections',timeline:'&#x1F4C5; Activity Timeline',title:'&#x1F393; Student Portfolio',rank:'Spy Rank',xp:'Total XP',since:'Member Since',noData:'No data yet',sessions:'Pomodoro Sessions'},
  fr:{profile:'&#x1F575;&#xFE0F; Profil',achievements:'&#x1F3C6; Succ\u00e8s',certificates:'&#x1F4DC; Certificats',topRatings:'&#x2B50; Meilleures Notes',expLogs:'&#x1F9EA; Journaux',quizScores:'&#x1F4DD; Scores Quiz',collections:'&#x1F4DA; Collections',timeline:'&#x1F4C5; Chronologie',title:'&#x1F393; Portfolio \u00c9tudiant',rank:'Rang Espion',xp:'XP Total',since:'Membre Depuis',noData:'Pas de donn\u00e9es',sessions:'Sessions Pomodoro'},
  ar:{profile:'&#x1F575;&#xFE0F; \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a',achievements:'&#x1F3C6; \u0627\u0644\u0625\u0646\u062c\u0627\u0632\u0627\u062a',certificates:'&#x1F4DC; \u0627\u0644\u0634\u0647\u0627\u062f\u0627\u062a',topRatings:'&#x2B50; \u0623\u0641\u0636\u0644 \u0627\u0644\u062a\u0642\u064a\u064a\u0645\u0627\u062a',expLogs:'&#x1F9EA; \u0633\u062c\u0644\u0627\u062a',quizScores:'&#x1F4DD; \u0646\u062a\u0627\u0626\u062c',collections:'&#x1F4DA; \u0627\u0644\u0645\u062c\u0645\u0648\u0639\u0627\u062a',timeline:'&#x1F4C5; \u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064a',title:'&#x1F393; \u0645\u0644\u0641 \u0627\u0644\u0637\u0627\u0644\u0628',rank:'\u0627\u0644\u0631\u062a\u0628\u0629',xp:'XP',since:'\u0639\u0636\u0648 \u0645\u0646\u0630',noData:'\u0644\u0627 \u062a\u0648\u062c\u062f \u0628\u064a\u0627\u0646\u0627\u062a',sessions:'\u062c\u0644\u0633\u0627\u062a \u0628\u0648\u0645\u0648\u062f\u0648\u0631\u0648'}
};
var curLang='en';
function switchLang(l){
  curLang=l;
  document.documentElement.lang=l;
  document.documentElement.dir=l==='ar'?'rtl':'ltr';
  document.getElementById('pageTitle').innerHTML=PLANG[l].title;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var k=el.getAttribute('data-i18n');if(PLANG[l][k])el.innerHTML=PLANG[l][k];
  });
  buildAll();
}
function getAllLS(){
  var data={};
  try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);data[k]=localStorage.getItem(k);}}catch(e){}
  return data;
}
function getRanks(){return[{min:0,name:'Recruit'},{min:100,name:'Field Agent'},{min:500,name:'Operative'},{min:1500,name:'Handler'},{min:5000,name:'Station Chief'},{min:15000,name:'Director'}];}
function getRank(xp){var ranks=getRanks();var r=ranks[0].name;for(var i=0;i<ranks.length;i++){if(xp>=ranks[i].min)r=ranks[i].name;}return r;}
function buildAll(){
  var ls=getAllLS();var L=PLANG[curLang];
  // Profile
  var xp=0,earliest=Date.now(),pomSessions=0;
  Object.keys(ls).forEach(function(k){
    if(k.indexOf('pomodoro_')===0){try{var arr=JSON.parse(ls[k]);pomSessions+=arr.length;arr.forEach(function(s){if(s.ts<earliest)earliest=s.ts;});}catch(e){}}
    if(k.indexOf('apptime_')===0){xp+=Math.floor(parseInt(ls[k]||'0')/60);}
    if(k.indexOf('quizScore_')===0){xp+=parseInt(ls[k]||'0');}
  });
  var pg=document.getElementById('profileGrid');
  pg.innerHTML='<div class="profile-stat"><div class="val">'+getRank(xp)+'</div><div class="lbl">'+L.rank+'</div></div>'
    +'<div class="profile-stat"><div class="val">'+xp+'</div><div class="lbl">'+L.xp+'</div></div>'
    +'<div class="profile-stat"><div class="val">'+new Date(earliest).toLocaleDateString()+'</div><div class="lbl">'+L.since+'</div></div>'
    +'<div class="profile-stat"><div class="val">'+pomSessions+'</div><div class="lbl">'+L.sessions+'</div></div>';
  // Achievements
  var badges=[];
  Object.keys(ls).forEach(function(k){if(k.indexOf('badge_')===0)badges.push(k.replace('badge_',''));});
  var bg=document.getElementById('badgeGrid');
  bg.innerHTML=badges.length?badges.map(function(b){return'<div class="badge-item">\u{1F3C5} '+b+'</div>';}).join(''):'<div class="empty">'+L.noData+'</div>';
  // Certificates
  var cats={};
  Object.keys(ls).forEach(function(k){if(k.indexOf('apptime_')===0){var parts=k.replace('apptime_','').split('/');if(parts.length>0)cats[parts[0]]=(cats[parts[0]]||0)+parseInt(ls[k]||'0');}});
  var cg=document.getElementById('certGrid');
  var catKeys=Object.keys(cats).filter(function(c){return cats[c]>600;});
  cg.innerHTML=catKeys.length?catKeys.map(function(c){return'<div class="cert-card"><h3>\u{1F4DC} '+c+'</h3><p>'+Math.floor(cats[c]/60)+' min completed</p></div>';}).join(''):'<div class="empty">'+L.noData+'</div>';
  // Top Ratings
  var ratings=[];
  Object.keys(ls).forEach(function(k){if(k.indexOf('rating_')===0){var v=parseInt(ls[k]||'0');if(v>=4)ratings.push({app:k.replace('rating_',''),stars:v});}});
  ratings.sort(function(a,b){return b.stars-a.stars;});
  var rl=document.getElementById('ratingList');
  rl.innerHTML=ratings.length?ratings.slice(0,20).map(function(r){return'<div class="rating-item"><span>'+r.app+'</span><span class="stars">'+'\u2B50'.repeat(r.stars)+'</span></div>';}).join(''):'<div class="empty">'+L.noData+'</div>';
  // Experiment Logs
  var logs=[];
  Object.keys(ls).forEach(function(k){if(k.indexOf('lablog_')===0){try{var arr=JSON.parse(ls[k]);arr.forEach(function(e){e._app=k.replace('lablog_','');logs.push(e);});}catch(e){}}});
  logs.sort(function(a,b){return(b.ts||0)-(a.ts||0);});
  var ll=document.getElementById('logList');
  ll.innerHTML=logs.length?logs.slice(0,30).map(function(l){return'<div class="log-item"><span>'+l._app+'</span><span>'+(l.note||'')+'</span></div>';}).join(''):'<div class="empty">'+L.noData+'</div>';
  // Quiz Scores
  var quizzes=[];
  Object.keys(ls).forEach(function(k){if(k.indexOf('quizScore_')===0)quizzes.push({app:k.replace('quizScore_',''),score:parseInt(ls[k]||'0')});});
  quizzes.sort(function(a,b){return b.score-a.score;});
  var ql=document.getElementById('quizList');
  ql.innerHTML=quizzes.length?quizzes.slice(0,30).map(function(q){return'<div class="quiz-item"><span>'+q.app+'</span><span>'+q.score+'%</span></div>';}).join(''):'<div class="empty">'+L.noData+'</div>';
  // Collections
  var colls=[];
  Object.keys(ls).forEach(function(k){if(k.indexOf('bookmark_')===0||k.indexOf('collection_')===0)colls.push(k);});
  var cl=document.getElementById('collectList');
  cl.innerHTML=colls.length?colls.map(function(c){return'<div class="collection-item"><span>'+c+'</span></div>';}).join(''):'<div class="empty">'+L.noData+'</div>';
  // Timeline heatmap
  var hm=document.getElementById('heatmap');
  var dayCounts={};
  Object.keys(ls).forEach(function(k){
    if(k.indexOf('pomodoro_')===0){try{JSON.parse(ls[k]).forEach(function(s){var d=new Date(s.ts).toISOString().slice(0,10);dayCounts[d]=(dayCounts[d]||0)+1;});}catch(e){}}
  });
  var cells='';var now=new Date();
  for(var i=364;i>=0;i--){var d=new Date(now);d.setDate(d.getDate()-i);var dk=d.toISOString().slice(0,10);var c=dayCounts[dk]||0;var lvl=c===0?'':c<2?'l1':c<4?'l2':c<7?'l3':'l4';cells+='<div class="heatmap-cell '+lvl+'" title="'+dk+': '+c+'"></div>';}
  hm.innerHTML=cells;
  // Session history
  var sessions=[];
  Object.keys(ls).forEach(function(k){
    if(k.indexOf('pomodoro_')===0){try{JSON.parse(ls[k]).forEach(function(s){s._app=k.replace('pomodoro_','');sessions.push(s);});}catch(e){}}
  });
  sessions.sort(function(a,b){return(b.ts||0)-(a.ts||0);});
  var tl=document.getElementById('timelineList');
  tl.innerHTML=sessions.length?sessions.slice(0,50).map(function(s){return'<div class="timeline-item"><strong>'+s._app+'</strong> &mdash; '+new Date(s.ts).toLocaleString()+'</div>';}).join(''):'<div class="empty">'+L.noData+'</div>';
}
function exportHTML(){
  var ls=getAllLS();
  var clone=document.documentElement.cloneNode(true);
  var script=clone.querySelector('script')||document.createElement('script');
  var inject=document.createElement('script');
  inject.textContent='(function(){var d='+JSON.stringify(ls)+';Object.keys(d).forEach(function(k){try{localStorage.setItem(k,d[k]);}catch(e){}});})();';
  clone.querySelector('head').appendChild(inject);
  var blob=new Blob(['<!DOCTYPE html>'+clone.outerHTML],{type:'text/html'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='portfolio-export.html';a.click();URL.revokeObjectURL(a.href);
}
buildAll();
</script>
</body>
</html>'''
    out_path = os.path.join(BASE, 'portfolio.html')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"[OK] Created {out_path}")


def verify_random_files(scripts, n=30):
    """Verify n random files with node -c."""
    sample = random.sample(scripts, min(n, len(scripts)))
    ok = 0
    fail = 0
    for s in sample:
        result = subprocess.run(['node', '-c', s], capture_output=True, text=True)
        if result.returncode == 0:
            ok += 1
        else:
            fail += 1
            print(f"  [FAIL] {s}: {result.stderr.strip()[:120]}")
    print(f"[VERIFY] {ok}/{ok+fail} passed syntax check")
    return fail == 0


def main():
    print("=" * 60)
    print("Pomodoro + Card Flip Injector + Portfolio Generator")
    print("=" * 60)

    scripts = find_all_script_js()
    print(f"Found {len(scripts)} script.js files")

    results = {'ok': 0, 'skip': 0, 'no_lang': 0, 'lang_fail': 0, 'js_fail': 0, 'init_fail': 0, 'error': 0}
    for i, s in enumerate(scripts):
        try:
            r = process_script(s)
            results[r] = results.get(r, 0) + 1
            if (i + 1) % 50 == 0:
                print(f"  Processed {i+1}/{len(scripts)}...")
        except Exception as e:
            results['error'] += 1
            print(f"  [ERROR] {s}: {e}")

    print(f"\nResults:")
    for k, v in results.items():
        if v > 0:
            print(f"  {k}: {v}")

    print(f"\nCreating portfolio.html...")
    create_portfolio_html()

    print(f"\nVerifying 30 random files...")
    verify_random_files(scripts)

    print("\nDone!")


if __name__ == '__main__':
    main()
