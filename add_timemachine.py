#!/usr/bin/env python3
"""
Add Time Machine feature to all 488 apps in ops-catalog.
- Injects LANG keys (tmTitle, tmRecord, etc.) into EN/FR/AR blocks
- Injects initTimeMachine() function after the LANG block
- Adds DOMContentLoaded listener
- Idempotent: skips files already containing tmTitle
"""

import os
import re
import random
import subprocess
import sys

CATALOG = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject ──────────────────────────────────────────────────────

LANG_EN = (
    "tmTitle:'Time Machine',"
    "tmRecord:'Record',"
    "tmStop:'Stop',"
    "tmPlay:'Play',"
    "tmPause:'Pause',"
    "tmSpeed:'Speed',"
    "tmScrub:'Scrub timeline',"
    "tmRecording:'Recording...',"
    "tmPlaying:'Playing...',"
)

LANG_FR = (
    "tmTitle:'Machine \xe0 remonter le temps',"
    "tmRecord:'Enregistrer',"
    "tmStop:'Arr\\xeater',"
    "tmPlay:'Lire',"
    "tmPause:'Pause',"
    "tmSpeed:'Vitesse',"
    "tmScrub:'Parcourir la chronologie',"
    "tmRecording:'Enregistrement...',"
    "tmPlaying:'Lecture en cours...',"
)

LANG_AR = (
    "tmTitle:'\u0622\u0644\u0629 \u0627\u0644\u0632\u0645\u0646',"
    "tmRecord:'\u062a\u0633\u062c\u064a\u0644',"
    "tmStop:'\u0625\u064a\u0642\u0627\u0641',"
    "tmPlay:'\u062a\u0634\u063a\u064a\u0644',"
    "tmPause:'\u0625\u064a\u0642\u0627\u0641 \u0645\u0624\u0642\u062a',"
    "tmSpeed:'\u0627\u0644\u0633\u0631\u0639\u0629',"
    "tmScrub:'\u062a\u0635\u0641\u062d \u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064a',"
    "tmRecording:'\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u0633\u062c\u064a\u0644...',"
    "tmPlaying:'\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u0634\u063a\u064a\u0644...',"
)

# ── initTimeMachine function ─────────────────────────────────────────────────

TM_FUNCTION = r"""
/* ═══════ Time Machine ═══════ */
function initTimeMachine(){
 if(document.getElementById('tmBar'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 if(!L.tmTitle)return;
 var state={recording:false,playing:false,speed:1,frames:[],snapshots:[],startTime:0,playIdx:0,playTimer:null,snapTimer:null,recTimer:null};
 var MAX_DURATION=60000;
 var FRAME_INTERVAL=500;
 var SNAP_INTERVAL=2000;

 /* ── CSS ── */
 var style=document.createElement('style');
 style.textContent=''
  +'.tm-bar{position:fixed;bottom:0;left:0;right:0;z-index:99998;background:rgba(11,13,36,0.95);border-top:2px solid var(--accent,#d4a03c);padding:8px 16px;display:flex;align-items:center;gap:8px;font-family:monospace;font-size:0.8rem;color:var(--text,#e4ddd0);transition:transform 0.3s;}'
  +'.tm-bar.tm-hidden{transform:translateY(100%);}'
  +'.tm-bar button{background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-weight:700;font-size:0.75rem;}'
  +'.tm-bar button:hover{opacity:0.85;}'
  +'.tm-bar button.tm-rec{background:#e53935;color:#fff;}'
  +'.tm-bar button.tm-rec.active{animation:tmPulse 1s infinite;}'
  +'@keyframes tmPulse{0%,100%{opacity:1;}50%{opacity:0.4;}}'
  +'.tm-bar select{background:var(--bg2,#23272e);color:var(--fg,#e0e0e0);border:1px solid var(--border,#444);border-radius:4px;padding:2px 4px;font-size:0.75rem;}'
  +'.tm-scrub{flex:1;min-width:80px;accent-color:var(--accent,#d4a03c);}'
  +'.tm-time{min-width:90px;text-align:center;font-variant-numeric:tabular-nums;}'
  +'.tm-ticks{position:relative;height:4px;flex:1;min-width:80px;}'
  +'.tm-tick{position:absolute;top:0;width:2px;height:4px;background:var(--accent,#d4a03c);}';
 document.head.appendChild(style);

 /* ── Bar HTML ── */
 var bar=document.createElement('div');
 bar.id='tmBar';
 bar.className='tm-bar tm-hidden';
 var recBtn=document.createElement('button');recBtn.className='tm-rec';recBtn.textContent='\u23FA '+L.tmRecord;
 var stopBtn=document.createElement('button');stopBtn.textContent='\u23F9 '+L.tmStop;stopBtn.style.display='none';
 var playBtn=document.createElement('button');playBtn.textContent='\u25B6 '+L.tmPlay;playBtn.disabled=true;
 var pauseBtn=document.createElement('button');pauseBtn.textContent='\u23F8 '+L.tmPause;pauseBtn.style.display='none';
 var speedSel=document.createElement('select');
 speedSel.title=L.tmSpeed;
 ['0.5','1','2'].forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=v+'x';if(v==='1')o.selected=true;speedSel.appendChild(o);});
 var scrub=document.createElement('input');scrub.type='range';scrub.className='tm-scrub';scrub.min='0';scrub.max='0';scrub.value='0';scrub.title=L.tmScrub;
 var timeDisp=document.createElement('span');timeDisp.className='tm-time';timeDisp.textContent='00:00 / 00:00';
 var ticks=document.createElement('div');ticks.className='tm-ticks';
 var statusSpan=document.createElement('span');statusSpan.style.cssText='font-size:0.7rem;opacity:0.7;min-width:80px;text-align:right;';

 bar.appendChild(recBtn);bar.appendChild(stopBtn);bar.appendChild(playBtn);bar.appendChild(pauseBtn);
 bar.appendChild(speedSel);bar.appendChild(scrub);bar.appendChild(timeDisp);bar.appendChild(ticks);bar.appendChild(statusSpan);
 document.body.appendChild(bar);

 /* ── Toggle button in header ── */
 var togBtn=document.createElement('button');
 togBtn.className='btn-icon-only';
 togBtn.textContent='\u23F0';
 togBtn.title=L.tmTitle;
 togBtn.style.cssText='cursor:pointer;font-size:1rem;';
 togBtn.onclick=function(){bar.classList.toggle('tm-hidden');};
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(togBtn);
 else{togBtn.style.cssText+='position:fixed;top:0.5rem;right:5rem;z-index:9999;';document.body.appendChild(togBtn);}

 /* ── Helpers ── */
 function fmt(ms){var s=Math.floor(ms/1000);var m=Math.floor(s/60);s=s%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}

 function captureInputs(){
  var data={};
  document.querySelectorAll('input[type="range"],input[type="number"],select').forEach(function(el){
   var key=el.id||el.name||el.getAttribute('data-param');
   if(key)data[key]=el.value;
  });
  return data;
 }

 function restoreInputs(data){
  if(!data)return;
  Object.keys(data).forEach(function(key){
   var el=document.getElementById(key)||document.querySelector('[name="'+key+'"]')||document.querySelector('[data-param="'+key+'"]');
   if(el){el.value=data[key];var ev=new Event('input',{bubbles:true});el.dispatchEvent(ev);}
  });
 }

 function captureSnapshot(){
  var c=document.querySelector('canvas');
  if(!c)return null;
  try{return c.toDataURL('image/jpeg',0.3);}catch(e){return null;}
 }

 function showSnapshot(dataUrl){
  if(!dataUrl)return;
  var c=document.querySelector('canvas');
  if(!c)return;
  var ctx=c.getContext('2d');
  var img=new Image();
  img.onload=function(){ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(img,0,0,c.width,c.height);};
  img.src=dataUrl;
 }

 function findSnapshotAt(t){
  for(var i=state.snapshots.length-1;i>=0;i--){
   if(state.snapshots[i].t<=t)return state.snapshots[i].data;
  }
  return null;
 }

 function addTick(t,maxT){
  if(maxT<=0)return;
  var d=document.createElement('div');
  d.className='tm-tick';
  d.style.left=(t/maxT*100)+'%';
  ticks.appendChild(d);
 }

 function updateTime(){
  if(state.frames.length===0){timeDisp.textContent='00:00 / 00:00';return;}
  var cur=parseInt(scrub.value)||0;
  var max=state.frames.length>0?state.frames[state.frames.length-1].t:0;
  timeDisp.textContent=fmt(cur)+' / '+fmt(max);
 }

 function saveSession(){
  try{
   var payload={frames:state.frames,snapshots:state.snapshots};
   sessionStorage.setItem('tm_session',JSON.stringify(payload));
  }catch(e){/* quota exceeded — ignore */}
 }

 /* ── Record ── */
 function startRecording(){
  state.frames=[];state.snapshots=[];ticks.innerHTML='';
  state.recording=true;state.startTime=Date.now();
  recBtn.classList.add('active');recBtn.textContent='\u23FA '+L.tmRecording;
  stopBtn.style.display='';playBtn.disabled=true;
  statusSpan.textContent=L.tmRecording;
  var prevInputs=JSON.stringify(captureInputs());
  state.recTimer=setInterval(function(){
   var t=Date.now()-state.startTime;
   if(t>MAX_DURATION){stopRecording();return;}
   var inputs=captureInputs();
   var curStr=JSON.stringify(inputs);
   state.frames.push({t:t,inputs:inputs});
   if(curStr!==prevInputs){addTick(t,MAX_DURATION);prevInputs=curStr;}
   scrub.max=String(t);scrub.value=String(t);updateTime();
  },FRAME_INTERVAL);
  state.snapTimer=setInterval(function(){
   if(!state.recording)return;
   var t=Date.now()-state.startTime;
   var snap=captureSnapshot();
   if(snap)state.snapshots.push({t:t,data:snap});
  },SNAP_INTERVAL);
 }

 function stopRecording(){
  state.recording=false;
  clearInterval(state.recTimer);clearInterval(state.snapTimer);
  recBtn.classList.remove('active');recBtn.textContent='\u23FA '+L.tmRecord;
  stopBtn.style.display='none';
  playBtn.disabled=state.frames.length===0;
  statusSpan.textContent='';
  saveSession();
 }

 /* ── Playback ── */
 function startPlayback(){
  if(state.frames.length===0)return;
  state.playing=true;state.playIdx=0;
  var startVal=parseInt(scrub.value)||0;
  for(var i=0;i<state.frames.length;i++){if(state.frames[i].t>=startVal){state.playIdx=i;break;}}
  playBtn.style.display='none';pauseBtn.style.display='';
  statusSpan.textContent=L.tmPlaying;
  function step(){
   if(!state.playing||state.playIdx>=state.frames.length){stopPlayback();return;}
   var frame=state.frames[state.playIdx];
   restoreInputs(frame.inputs);
   var snap=findSnapshotAt(frame.t);
   if(snap)showSnapshot(snap);
   scrub.value=String(frame.t);updateTime();
   state.playIdx++;
   var nextDelay=FRAME_INTERVAL/state.speed;
   if(state.playIdx<state.frames.length){
    var dt=state.frames[state.playIdx].t-frame.t;
    nextDelay=dt/state.speed;
   }
   state.playTimer=setTimeout(step,Math.max(16,nextDelay));
  }
  step();
 }

 function stopPlayback(){
  state.playing=false;
  clearTimeout(state.playTimer);
  playBtn.style.display='';pauseBtn.style.display='none';
  statusSpan.textContent='';
 }

 /* ── Events ── */
 recBtn.onclick=function(){if(!state.recording)startRecording();};
 stopBtn.onclick=function(){if(state.recording)stopRecording();if(state.playing)stopPlayback();};
 playBtn.onclick=function(){startPlayback();};
 pauseBtn.onclick=function(){stopPlayback();};
 speedSel.onchange=function(){state.speed=parseFloat(this.value)||1;};
 scrub.oninput=function(){
  if(state.playing)stopPlayback();
  var t=parseInt(this.value)||0;
  for(var i=state.frames.length-1;i>=0;i--){
   if(state.frames[i].t<=t){restoreInputs(state.frames[i].inputs);break;}
  }
  var snap=findSnapshotAt(t);
  if(snap)showSnapshot(snap);
  updateTime();
 };
}
document.addEventListener('DOMContentLoaded',function(){try{initTimeMachine();}catch(e){console.warn('TimeMachine init:',e);}});
"""

# ── Processing logic ─────────────────────────────────────────────────────────

def find_script_files():
    """Find all script.js files in the catalog."""
    results = []
    for root, dirs, files in os.walk(CATALOG):
        if 'script.js' in files:
            results.append(os.path.join(root, 'script.js'))
    results.sort()
    return results


def inject_lang_old_format(content):
    """Inject LANG keys after ...LANG_BASE.en, / .fr, / .ar, spread syntax."""
    # EN: inject after ...LANG_BASE.en,
    content = content.replace(
        '...LANG_BASE.en,',
        '...LANG_BASE.en,' + LANG_EN,
        1
    )
    # FR: inject after ...LANG_BASE.fr,
    content = content.replace(
        '...LANG_BASE.fr,',
        '...LANG_BASE.fr,' + LANG_FR,
        1
    )
    # AR: inject after ...LANG_BASE.ar,
    content = content.replace(
        '...LANG_BASE.ar,',
        '...LANG_BASE.ar,' + LANG_AR,
        1
    )
    return content


def inject_lang_new_format(content):
    """Inject LANG keys for files using inline },fr:{ / },ar:{ format.
    These files have no ...LANG_BASE spread in the LANG block itself,
    but they DO have ...LANG_BASE.en, inside the LANG block.
    Actually they do — the new format also uses ...LANG_BASE.en, etc.
    Let me handle both cases."""

    # Check if it has ...LANG_BASE.en, inside LANG block
    if '...LANG_BASE.en,' in content:
        content = content.replace(
            '...LANG_BASE.en,',
            '...LANG_BASE.en,' + LANG_EN,
            1
        )
    else:
        # Inject after the en:{ opening of LANG
        # Find const LANG={en:{ and inject after it
        content = re.sub(
            r'(const\s+LANG\s*=\s*\{\s*en\s*:\s*\{)',
            r'\1' + LANG_EN,
            content,
            count=1
        )

    # For fr block: inject after },fr:{
    if '...LANG_BASE.fr,' in content:
        content = content.replace(
            '...LANG_BASE.fr,',
            '...LANG_BASE.fr,' + LANG_FR,
            1
        )
    else:
        content = content.replace(
            '},fr:{',
            '},fr:{' + LANG_FR,
            1
        )

    # For ar block: inject after },ar:{
    if '...LANG_BASE.ar,' in content:
        content = content.replace(
            '...LANG_BASE.ar,',
            '...LANG_BASE.ar,' + LANG_AR,
            1
        )
    else:
        content = content.replace(
            '},ar:{',
            '},ar:{' + LANG_AR,
            1
        )

    return content


def inject_function(content):
    """Inject the initTimeMachine function after the LANG block closing '};'."""
    # Find the LANG block. It starts with 'const LANG' and ends with '};'
    # We need the SECOND '};' if LANG_BASE exists, or the first one after
    # 'const LANG'

    # Strategy: find 'const LANG' position, then find the next '};' after it
    lang_match = re.search(r'^const\s+LANG\s*=\s*\{', content, re.MULTILINE)
    if not lang_match:
        # Try single-line const LANG={
        lang_match = re.search(r'const\s+LANG\s*=\s*\{', content)

    if not lang_match:
        return content, False

    lang_start = lang_match.start()

    # Find closing }; after the LANG block
    # Need to handle both multi-line and inline formats
    # For inline format (new): the LANG ends with }};  on a line
    # For multi-line (old): ends with ^};$ on its own line

    # Search for }; after lang_start, tracking brace depth
    rest = content[lang_start:]
    depth = 0
    i = lang_match.end() - lang_start  # start after the opening {
    depth = 1  # we've seen one {
    in_string = False
    string_char = None
    escape_next = False

    while i < len(rest) and depth > 0:
        ch = rest[i]
        if escape_next:
            escape_next = False
            i += 1
            continue
        if ch == '\\':
            escape_next = True
            i += 1
            continue
        if in_string:
            if ch == string_char:
                in_string = False
            i += 1
            continue
        if ch in ("'", '"', '`'):
            in_string = True
            string_char = ch
            i += 1
            continue
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
        i += 1

    if depth != 0:
        return content, False

    # i now points right after the closing }
    # Check for ; after }
    close_pos = lang_start + i
    if close_pos < len(content) and content[close_pos] == ';':
        close_pos += 1

    # Insert the function after the closing };
    content = content[:close_pos] + '\n' + TM_FUNCTION.strip() + '\n' + content[close_pos:]
    return content, True


def process_file(filepath):
    """Process a single script.js file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Idempotency check
    if 'tmTitle' in content:
        return 'skipped'

    # Check if LANG block exists
    if 'const LANG' not in content:
        return 'no-lang'

    # Determine format
    is_new_format = '},fr:{' in content

    # Inject LANG keys
    if is_new_format:
        content = inject_lang_new_format(content)
    else:
        content = inject_lang_old_format(content)

    # Inject function
    content, success = inject_function(content)
    if not success:
        return 'func-fail'

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return 'ok'


def main():
    files = find_script_files()
    print(f'Found {len(files)} script.js files')

    stats = {'ok': 0, 'skipped': 0, 'no-lang': 0, 'func-fail': 0, 'error': 0}
    errors = []
    processed = []

    for fp in files:
        try:
            result = process_file(fp)
            stats[result] += 1
            if result == 'ok':
                processed.append(fp)
            elif result in ('no-lang', 'func-fail'):
                errors.append((fp, result))
        except Exception as e:
            stats['error'] += 1
            errors.append((fp, str(e)))

    print(f'\nResults:')
    print(f'  OK:        {stats["ok"]}')
    print(f'  Skipped:   {stats["skipped"]}')
    print(f'  No LANG:   {stats["no-lang"]}')
    print(f'  Func fail: {stats["func-fail"]}')
    print(f'  Error:     {stats["error"]}')

    if errors:
        print(f'\nIssues ({len(errors)}):')
        for fp, err in errors[:10]:
            print(f'  {fp}: {err}')
        if len(errors) > 10:
            print(f'  ... and {len(errors) - 10} more')

    # Verify 30 random files with node -c
    if processed:
        sample = random.sample(processed, min(30, len(processed)))
        print(f'\nVerifying {len(sample)} random files with node -c ...')
        ok_count = 0
        fail_count = 0
        for fp in sample:
            try:
                result = subprocess.run(
                    ['node', '-c', fp],
                    capture_output=True, text=True, timeout=10
                )
                if result.returncode == 0:
                    ok_count += 1
                else:
                    fail_count += 1
                    print(f'  FAIL: {fp}')
                    print(f'    {result.stderr.strip()[:200]}')
            except Exception as e:
                fail_count += 1
                print(f'  ERROR: {fp}: {e}')

        print(f'Verification: {ok_count}/{len(sample)} passed')

    return 0 if stats['error'] == 0 and stats['func-fail'] == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
