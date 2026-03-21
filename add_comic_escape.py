#!/usr/bin/env python3
"""Add Comic Strip Generator and Escape Room Mode to all 488 ops-catalog apps."""

import os
import re
import hashlib
import glob
import random
import subprocess
import sys

CATALOG = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject ──────────────────────────────────────────────────────

LANG_EN = (
    "comicTitle:'Comic Strip',"
    "comicProblem:'The Problem',"
    "comicIdea:'The Idea',"
    "comicExperiment:'The Experiment',"
    "comicDiscovery:'The Discovery',"
    "comicDownload:'Download PNG',"
    "escapeTitle:'Escape Room',"
    "escapeClue:'Clue',"
    "escapeHint:'Set {0} to exactly {1} to unlock the next clue',"
    "escapeUnlocked:'Unlocked!',"
    "escapeComplete:'Congratulations! You escaped!',"
    "escapeTime:'Time',"
)

LANG_FR = (
    "comicTitle:'Bande Dessin\\xe9e',"
    "comicProblem:'Le Probl\\xe8me',"
    "comicIdea:'L\\x27Id\\xe9e',"
    "comicExperiment:'L\\x27Exp\\xe9rience',"
    "comicDiscovery:'La D\\xe9couverte',"
    "comicDownload:'T\\xe9l\\xe9charger PNG',"
    "escapeTitle:'Salle d\\x27\\xe9vasion',"
    "escapeClue:'Indice',"
    "escapeHint:'R\\xe9glez {0} \\xe0 exactement {1} pour d\\xe9bloquer l\\x27indice suivant',"
    "escapeUnlocked:'D\\xe9bloqu\\xe9 !',"
    "escapeComplete:'F\\xe9licitations ! Vous vous \\xeates \\xe9vad\\xe9 !',"
    "escapeTime:'Temps',"
)

LANG_AR = (
    "comicTitle:'\u0634\u0631\u064a\u0637 \u0645\u0635\u0648\u0631',"
    "comicProblem:'\u0627\u0644\u0645\u0634\u0643\u0644\u0629',"
    "comicIdea:'\u0627\u0644\u0641\u0643\u0631\u0629',"
    "comicExperiment:'\u0627\u0644\u062a\u062c\u0631\u0628\u0629',"
    "comicDiscovery:'\u0627\u0644\u0627\u0643\u062a\u0634\u0627\u0641',"
    "comicDownload:'\u062a\u062d\u0645\u064a\u0644 PNG',"
    "escapeTitle:'\u063a\u0631\u0641\u0629 \u0627\u0644\u0647\u0631\u0648\u0628',"
    "escapeClue:'\u062f\u0644\u064a\u0644',"
    "escapeHint:'\u0627\u0636\u0628\u0637 {0} \u0639\u0644\u0649 {1} \u0628\u0627\u0644\u0636\u0628\u0637 \u0644\u0641\u062a\u062d \u0627\u0644\u062f\u0644\u064a\u0644 \u0627\u0644\u062a\u0627\u0644\u064a',"
    "escapeUnlocked:'\u062a\u0645 \u0627\u0644\u0641\u062a\u062d!',"
    "escapeComplete:'\u062a\u0647\u0627\u0646\u064a\u0646\u0627! \u0644\u0642\u062f \u0647\u0631\u0628\u062a!',"
    "escapeTime:'\u0627\u0644\u0648\u0642\u062a',"
)

# ── JS functions to inject ────────────────────────────────────────────────────

JS_FUNCTIONS = r"""
/* === COMIC STRIP GENERATOR === */
function initComicStrip(){
 if(document.getElementById('comicStripBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 if(!L.comicTitle)return;
 var btn=document.createElement('button');
 btn.id='comicStripBtn';
 btn.className='btn-icon-only';
 btn.textContent='\u25a4';
 btn.title=L.comicTitle||'Comic Strip';
 btn.style.cssText='cursor:pointer;font-size:1.1rem;';
 btn.onclick=function(){
  var appTitle=(L.title||document.title||'App');
  var appDesc=(L.subtitle||L.mainDesc||'Simulation');
  var sliderLabels=[];
  document.querySelectorAll('input[type="range"]').forEach(function(s,i){
   if(i<3){var lbl=s.previousElementSibling;sliderLabels.push(lbl?lbl.textContent.trim():'Param '+(i+1));}
  });
  if(sliderLabels.length===0)sliderLabels=['Parameter A','Parameter B','Parameter C'];
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:20px;box-sizing:border-box;';
  var box=document.createElement('div');
  box.style.cssText='background:var(--panel,#1a1a2e);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:1.5rem;max-width:860px;width:95%;text-align:center;color:var(--text,#e4ddd0);';
  var h3=document.createElement('h3');
  h3.style.cssText='color:var(--accent,#d4a03c);margin-bottom:1rem;font-family:Orbitron,monospace;';
  h3.textContent=L.comicTitle;
  box.appendChild(h3);
  var canvas=document.createElement('canvas');
  canvas.width=800;canvas.height=400;
  canvas.style.cssText='width:100%;max-width:800px;border-radius:8px;background:#fff;';
  box.appendChild(canvas);
  var ctx=canvas.getContext('2d');
  ctx.fillStyle='#ffffff';ctx.fillRect(0,0,800,400);
  var panels=[
   {x:0,y:0,title:L.comicProblem||'The Problem'},
   {x:400,y:0,title:L.comicIdea||'The Idea'},
   {x:0,y:200,title:L.comicExperiment||'The Experiment'},
   {x:400,y:200,title:L.comicDiscovery||'The Discovery'}
  ];
  panels.forEach(function(p,i){
   ctx.strokeStyle='#222';ctx.lineWidth=2;
   ctx.strokeRect(p.x+2,p.y+2,396,196);
   ctx.fillStyle='#f8f8f0';ctx.fillRect(p.x+3,p.y+3,394,194);
   ctx.fillStyle='#333';ctx.font='bold 13px sans-serif';
   ctx.fillText(p.title,p.x+10,p.y+20);
   var cx=p.x+200,cy=p.y+120;
   ctx.strokeStyle='#555';ctx.lineWidth=2;
   ctx.beginPath();ctx.arc(cx,cy-40,12,0,Math.PI*2);ctx.stroke();
   ctx.beginPath();ctx.moveTo(cx,cy-28);ctx.lineTo(cx,cy+10);ctx.stroke();
   ctx.beginPath();ctx.moveTo(cx,cy-15);ctx.lineTo(cx-18,cy-5);ctx.stroke();
   ctx.beginPath();ctx.moveTo(cx,cy-15);ctx.lineTo(cx+18,cy-5);ctx.stroke();
   ctx.beginPath();ctx.moveTo(cx,cy+10);ctx.lineTo(cx-15,cy+35);ctx.stroke();
   ctx.beginPath();ctx.moveTo(cx,cy+10);ctx.lineTo(cx+15,cy+35);ctx.stroke();
   if(i===0){
    ctx.strokeStyle='#888';ctx.strokeRect(cx+30,cy-30,40,30);
    ctx.fillStyle='#adf';ctx.fillRect(cx+32,cy-28,36,20);
   }
   if(i===1){
    ctx.fillStyle='#ffd700';ctx.beginPath();
    ctx.arc(cx,cy-60,10,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#ffd700';ctx.lineWidth=1.5;
    for(var r=0;r<8;r++){var a=r*Math.PI/4;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*13,cy-60+Math.sin(a)*13);ctx.lineTo(cx+Math.cos(a)*20,cy-60+Math.sin(a)*20);ctx.stroke();}
    ctx.fillStyle='#555';ctx.font='10px sans-serif';
    var descTxt=appDesc.length>35?appDesc.substring(0,35)+'...':appDesc;
    ctx.beginPath();ctx.moveTo(cx+25,cy-55);ctx.lineTo(cx+140,cy-55);ctx.lineTo(cx+140,cy-35);ctx.lineTo(cx+30,cy-35);ctx.lineTo(cx+25,cy-45);ctx.closePath();ctx.strokeStyle='#555';ctx.stroke();ctx.fillStyle='#fafafa';ctx.fill();
    ctx.fillStyle='#333';ctx.font='9px sans-serif';ctx.fillText(descTxt,cx+30,cy-42);
   }
   if(i===2){
    ctx.strokeStyle='#888';
    sliderLabels.forEach(function(lbl,si){
     var sy=cy-20+si*18;
     ctx.fillStyle='#ddd';ctx.fillRect(cx+25,sy,60,6);
     ctx.fillStyle='#d4a03c';ctx.fillRect(cx+25,sy,30+si*8,6);
     ctx.fillStyle='#555';ctx.font='9px sans-serif';ctx.fillText(lbl.substring(0,12),cx+90,sy+6);
    });
   }
   if(i===3){
    ctx.beginPath();ctx.moveTo(cx-18,cy-5);ctx.lineTo(cx-30,cy-25);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx+18,cy-5);ctx.lineTo(cx+30,cy-25);ctx.stroke();
    ctx.fillStyle='var(--accent)';ctx.font='bold 12px sans-serif';
    var titleTxt=appTitle.length>30?appTitle.substring(0,30)+'...':appTitle;
    ctx.fillStyle='#d4a03c';ctx.font='bold 14px sans-serif';
    ctx.fillText(titleTxt,cx-ctx.measureText(titleTxt).width/2,cy+55);
    ctx.fillStyle='#ffd700';ctx.font='16px sans-serif';ctx.fillText('\u2605',cx-25,cy-55);ctx.fillText('\u2605',cx+15,cy-55);ctx.fillText('\u2605',cx-5,cy-62);
   }
  });
  var dlBtn=document.createElement('button');
  dlBtn.textContent=L.comicDownload||'Download PNG';
  dlBtn.style.cssText='margin-top:1rem;background:var(--accent,#d4a03c);color:#000;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.95rem;';
  dlBtn.onclick=function(){
   var link=document.createElement('a');
   link.download='comic-strip.png';
   link.href=canvas.toDataURL('image/png');
   link.click();
  };
  box.appendChild(document.createElement('br'));
  box.appendChild(dlBtn);
  ov.appendChild(box);
  ov.onclick=function(e){if(e.target===ov)ov.remove();};
  document.body.appendChild(ov);
 };
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(btn);
 else{btn.style.cssText+='position:fixed;top:0.5rem;right:5rem;z-index:9999;';document.body.appendChild(btn);}
}
document.addEventListener('DOMContentLoaded',function(){try{initComicStrip();}catch(e){console.warn('ComicStrip init:',e);}});

/* === ESCAPE ROOM MODE === */
function initEscapeRoom(){
 if(document.getElementById('escapeRoomBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 if(!L.escapeTitle)return;
 var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
 function djb2(s){var h=5381;for(var i=0;i<s.length;i++){h=((h<<5)+h)+s.charCodeAt(i);h=h&0x7fffffff;}return h;}
 var seed=djb2(appDir);
 var btn=document.createElement('button');
 btn.id='escapeRoomBtn';
 btn.className='btn-icon-only';
 btn.textContent='\ud83d\udd10';
 btn.title=L.escapeTitle||'Escape Room';
 btn.style.cssText='cursor:pointer;font-size:1rem;';
 btn.onclick=function(){
  var sliders=Array.from(document.querySelectorAll('input[type="range"]'));
  if(sliders.length<1)return;
  var clues=[];
  for(var c=0;c<3;c++){
   var si=(seed+c*7)%sliders.length;
   var sl=sliders[si<0?0:si];
   var mn=parseFloat(sl.min)||0;
   var mx=parseFloat(sl.max)||100;
   var step=parseFloat(sl.step)||1;
   var range=mx-mn;
   var targetRaw=mn+((seed*(c+1)*13)%100)/100*range;
   targetRaw=Math.round(targetRaw/step)*step;
   if(targetRaw<mn)targetRaw=mn;if(targetRaw>mx)targetRaw=mx;
   targetRaw=parseFloat(targetRaw.toFixed(2));
   var lbl=sl.previousElementSibling;
   var paramName=lbl?lbl.textContent.trim():'Parameter '+(si+1);
   clues.push({slider:sl,target:targetRaw,name:paramName});
  }
  var currentClue=0;
  var startTime=Date.now();
  var secretPhrase='AGENT-'+seed.toString(16).toUpperCase().substring(0,6);
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:20px;box-sizing:border-box;';
  var box=document.createElement('div');
  box.style.cssText='background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:2rem;max-width:460px;width:95%;text-align:center;color:var(--text,#e4ddd0);';
  var h3=document.createElement('h3');
  h3.style.cssText='color:var(--accent,#d4a03c);margin-bottom:1rem;font-family:Orbitron,monospace;';
  h3.textContent=L.escapeTitle;
  box.appendChild(h3);
  var timerEl=document.createElement('div');
  timerEl.style.cssText='font-family:monospace;font-size:1.3rem;margin-bottom:1rem;color:#aaa;';
  timerEl.textContent=(L.escapeTime||'Time')+': 00:00';
  box.appendChild(timerEl);
  var clueEl=document.createElement('div');
  clueEl.style.cssText='font-size:1.1rem;margin:1rem 0;padding:1rem;background:rgba(0,0,0,0.3);border-radius:8px;min-height:60px;';
  box.appendChild(clueEl);
  var progressEl=document.createElement('div');
  progressEl.style.cssText='display:flex;justify-content:center;gap:12px;margin:1rem 0;';
  for(var p=0;p<3;p++){
   var dot=document.createElement('span');
   dot.style.cssText='width:18px;height:18px;border-radius:50%;border:2px solid var(--accent,#d4a03c);display:inline-block;';
   dot.dataset.idx=p;
   progressEl.appendChild(dot);
  }
  box.appendChild(progressEl);
  ov.appendChild(box);
  ov.onclick=function(e){if(e.target===ov){ov.remove();clearInterval(timerInt);}};
  document.body.appendChild(ov);
  function showClue(){
   if(currentClue>=3){
    var elapsed=Math.floor((Date.now()-startTime)/1000);
    var mm=String(Math.floor(elapsed/60)).padStart(2,'0');
    var ss=String(elapsed%60).padStart(2,'0');
    clueEl.innerHTML='<div style="font-size:2rem;margin-bottom:0.5rem;">\ud83c\udf89</div>'
     +'<div style="color:#ffd700;font-size:1.2rem;font-weight:bold;">'+(L.escapeComplete||'Congratulations!')+'</div>'
     +'<div style="margin-top:0.8rem;font-family:Orbitron,monospace;font-size:1.5rem;color:#ffd700;letter-spacing:4px;">'+secretPhrase+'</div>'
     +'<div style="margin-top:0.5rem;opacity:0.7;">'+(L.escapeTime||'Time')+': '+mm+':'+ss+'</div>';
    clearInterval(timerInt);
    return;
   }
   var cl=clues[currentClue];
   var hintTxt=(L.escapeHint||'Set {0} to exactly {1} to unlock the next clue').replace('{0}','<strong>'+cl.name+'</strong>').replace('{1}','<strong style="color:#ffd700;">'+cl.target+'</strong>');
   clueEl.innerHTML='<div style="margin-bottom:0.5rem;opacity:0.7;">'+(L.escapeClue||'Clue')+' '+(currentClue+1)+'/3</div>'+hintTxt;
  }
  showClue();
  var timerInt=setInterval(function(){
   var elapsed=Math.floor((Date.now()-startTime)/1000);
   var mm=String(Math.floor(elapsed/60)).padStart(2,'0');
   var ss=String(elapsed%60).padStart(2,'0');
   timerEl.textContent=(L.escapeTime||'Time')+': '+mm+':'+ss;
  },1000);
  function onInput(){
   if(currentClue>=3)return;
   var cl=clues[currentClue];
   var val=parseFloat(cl.slider.value);
   var tolerance=Math.abs((parseFloat(cl.slider.max)||100)-(parseFloat(cl.slider.min)||0))*0.02;
   if(tolerance<0.5)tolerance=0.5;
   if(Math.abs(val-cl.target)<=tolerance){
    var dots=progressEl.querySelectorAll('span');
    if(dots[currentClue])dots[currentClue].style.background='var(--accent,#d4a03c)';
    currentClue++;
    showClue();
   }
  }
  sliders.forEach(function(s){s.addEventListener('input',onInput);});
 };
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(btn);
 else{btn.style.cssText+='position:fixed;top:0.5rem;right:7rem;z-index:9999;';document.body.appendChild(btn);}
}
document.addEventListener('DOMContentLoaded',function(){try{initEscapeRoom();}catch(e){console.warn('EscapeRoom init:',e);}});
"""


def find_script_files():
    """Find all script.js files in the catalog."""
    pattern = os.path.join(CATALOG, '*', '*', 'script.js')
    return sorted(glob.glob(pattern))


def inject_lang_keys(content, lang_en, lang_fr, lang_ar):
    """Inject LANG keys into the appropriate locations in script.js content."""

    # Detect format: old format uses ...LANG_BASE.en, new format uses },fr:{
    is_old_format = '...LANG_BASE.en,' in content
    is_new_format = '},fr:{' in content and not is_old_format

    if is_old_format:
        # Old format: inject after ...LANG_BASE.en, / .fr, / .ar,
        content = content.replace(
            '...LANG_BASE.en,',
            '...LANG_BASE.en,' + lang_en,
            1
        )
        content = content.replace(
            '...LANG_BASE.fr,',
            '...LANG_BASE.fr,' + lang_fr,
            1
        )
        content = content.replace(
            '...LANG_BASE.ar,',
            '...LANG_BASE.ar,' + lang_ar,
            1
        )
    elif is_new_format:
        # New format: const LANG={en:{ ... },fr:{ ... },ar:{ ... }};
        # Inject after the opening en:{ , fr:{ , ar:{

        # For en: inject after first occurrence of "const LANG={en:{"
        content = content.replace(
            'const LANG={en:{',
            'const LANG={en:{' + lang_en,
            1
        )

        # For fr: inject after "},fr:{"
        content = content.replace(
            '},fr:{',
            '},fr:{' + lang_fr,
            1
        )

        # For ar: inject after "},ar:{"
        content = content.replace(
            '},ar:{',
            '},ar:{' + lang_ar,
            1
        )
    else:
        # Fallback: try to find LANG = { en: { pattern
        # Try matching  en: {  after const LANG
        m = re.search(r'(const\s+LANG\s*=\s*\{\s*en\s*:\s*\{)', content)
        if m:
            content = content[:m.end()] + lang_en + content[m.end():]
        m_fr = re.search(r'(,\s*fr\s*:\s*\{)', content)
        if m_fr:
            content = content[:m_fr.end()] + lang_fr + content[m_fr.end():]
        m_ar = re.search(r'(,\s*ar\s*:\s*\{)', content)
        if m_ar:
            content = content[:m_ar.end()] + lang_ar + content[m_ar.end():]

    return content


def find_lang_block_end(content):
    """Find the closing }; of the const LANG block."""
    # Find "const LANG" then look for matching };
    lang_start = content.find('const LANG')
    if lang_start == -1:
        return -1

    # Find the opening { after const LANG
    brace_start = content.find('{', lang_start)
    if brace_start == -1:
        return -1

    depth = 0
    i = brace_start
    while i < len(content):
        ch = content[i]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                # Check if next non-whitespace is ;
                j = i + 1
                while j < len(content) and content[j] in ' \t\n\r':
                    j += 1
                if j < len(content) and content[j] == ';':
                    return j + 1  # position after };
                return i + 1
        # Skip string literals to avoid counting braces inside strings
        if ch == "'" and (i == 0 or content[i-1] != '\\'):
            i += 1
            while i < len(content) and not (content[i] == "'" and content[i-1] != '\\'):
                i += 1
        elif ch == '`':
            i += 1
            while i < len(content) and content[i] != '`':
                i += 1
        i += 1

    return -1


def process_file(filepath):
    """Process a single script.js file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Idempotency check
    if 'comicTitle' in content:
        return False

    # Step 1: Inject LANG keys
    content = inject_lang_keys(content, LANG_EN, LANG_FR, LANG_AR)

    # Step 2: Inject JS functions after the LANG block closing };
    lang_end = find_lang_block_end(content)
    if lang_end != -1:
        content = content[:lang_end] + '\n' + JS_FUNCTIONS + '\n' + content[lang_end:]
    else:
        # Fallback: append at end
        content += '\n' + JS_FUNCTIONS

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return True


def main():
    files = find_script_files()
    print(f'Found {len(files)} script.js files')

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
            print(f'  ERROR: {filepath}: {e}')

    print(f'\nResults: {modified} modified, {skipped} skipped (already done), {len(errors)} errors')

    # Verify 30 random files with node -c
    print('\nVerifying 30 random files with node -c ...')
    sample = random.sample(files, min(30, len(files)))
    ok = 0
    fail = 0
    for filepath in sample:
        result = subprocess.run(
            ['node', '-c', filepath],
            capture_output=True, text=True
        )
        if result.returncode == 0:
            ok += 1
        else:
            fail += 1
            print(f'  FAIL: {filepath}')
            print(f'        {result.stderr.strip()[:200]}')

    print(f'Verification: {ok}/30 passed, {fail}/30 failed')

    if errors:
        print('\nErrors:')
        for fp, err in errors:
            print(f'  {fp}: {err}')


if __name__ == '__main__':
    main()
