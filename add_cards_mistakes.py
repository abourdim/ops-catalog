#!/usr/bin/env python3
"""Add Mission Cards and Mistake Detector features to all 488 apps."""

import glob
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject ──
LANG_EN = (
    "missionCardTitle:'Share Mission',"
    "missionCardChallenge:'Can you match this signal?',"
    "missionCardDownload:'Download Card',"
    "mistakeTitle:'Tip',"
    "mistakeMin:'Setting to minimum may produce no output',"
    "mistakeMax:'Maximum may cause signal clipping',"
    "mistakeCombo:'Extreme combination detected',"
)

LANG_FR = (
    "missionCardTitle:'Partager Mission',"
    "missionCardChallenge:'Pouvez-vous reproduire ce signal?',"
    "missionCardDownload:'T\\x27l\\x27charger Carte',"
    "mistakeTitle:'Conseil',"
    "mistakeMin:'Le minimum peut ne produire aucun r\\x27sultat',"
    "mistakeMax:'Le maximum peut causer un \\x27cr\\x27tage',"
    "mistakeCombo:'Combinaison extr\\x27me d\\x27tect\\x27e',"
)

LANG_AR = (
    "missionCardTitle:'\u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u0645\u0647\u0645\u0629',"
    "missionCardChallenge:'\u0647\u0644 \u064a\u0645\u0643\u0646\u0643 \u0645\u0637\u0627\u0628\u0642\u0629 \u0647\u0630\u0647 \u0627\u0644\u0625\u0634\u0627\u0631\u0629\u061f',"
    "missionCardDownload:'\u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0628\u0637\u0627\u0642\u0629',"
    "mistakeTitle:'\u0646\u0635\u064a\u062d\u0629',"
    "mistakeMin:'\u0642\u062f \u0644\u0627 \u064a\u0646\u062a\u062c \u0627\u0644\u062d\u062f \u0627\u0644\u0623\u062f\u0646\u0649 \u0623\u064a \u0646\u062a\u064a\u062c\u0629',"
    "mistakeMax:'\u0642\u062f \u064a\u0633\u0628\u0628 \u0627\u0644\u062d\u062f \u0627\u0644\u0623\u0642\u0635\u0649 \u0642\u0637\u0639 \u0627\u0644\u0625\u0634\u0627\u0631\u0629',"
    "mistakeCombo:'\u062a\u0645 \u0627\u0643\u062a\u0634\u0627\u0641 \u062a\u0631\u0643\u064a\u0628\u0629 \u0645\u062a\u0637\u0631\u0641\u0629',"
)

# ── JS code for both features ──
JS_CODE = r"""
/* ═══════ Mission Cards ═══════ */
function initMissionCards(){
 if(document.getElementById('missionCardBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.sim-controls')||document.querySelector('.card');
 if(!hdr)return;
 var btn=document.createElement('button');
 btn.id='missionCardBtn';
 btn.className='btn-icon-only';
 btn.textContent='\ud83d\udccb';
 btn.title=L.missionCardTitle||'Share Mission';
 btn.onclick=function(){
  var canvas=document.createElement('canvas');
  canvas.width=400;canvas.height=250;
  var ctx=canvas.getContext('2d');
  /* background */
  ctx.fillStyle='#1a1a2e';
  ctx.fillRect(0,0,400,250);
  /* gradient border */
  var grad=ctx.createLinearGradient(0,0,400,250);
  grad.addColorStop(0,'#00ff88');grad.addColorStop(1,'#0088ff');
  ctx.strokeStyle=grad;ctx.lineWidth=4;
  ctx.strokeRect(2,2,396,246);
  /* title */
  var titleEl=document.querySelector('.app-title')||document.querySelector('h1')||document.querySelector('.card-title');
  var appTitle=titleEl?titleEl.textContent.trim():'Workshop-DIY';
  ctx.fillStyle='#00ff88';ctx.font='bold 20px monospace';
  ctx.textAlign='center';
  ctx.fillText(appTitle,200,40);
  /* subtitle */
  ctx.fillStyle='#ff6600';ctx.font='bold 14px monospace';
  ctx.fillText('MISSION CHALLENGE',200,65);
  /* slider values */
  var sliders=document.querySelectorAll('input[type=range]');
  var params=[];
  sliders.forEach(function(s){
   var lbl=s.previousElementSibling||s.parentElement;
   var name=s.id||s.name||(lbl?lbl.textContent.trim().substring(0,10):'param');
   params.push(name.replace(/[^a-zA-Z0-9]/g,'').substring(0,8)+'='+s.value);
  });
  var paramStr=params.slice(0,4).join(', ');
  ctx.fillStyle='#aaaacc';ctx.font='12px monospace';
  ctx.fillText('Parameters: '+(paramStr||'default'),200,95);
  /* challenge text */
  var challengeText=L.missionCardChallenge||'Can you match this signal?';
  ctx.fillStyle='#ffffff';ctx.font='italic 13px monospace';
  ctx.fillText(challengeText,200,130);
  /* QR-style decorative corners */
  ctx.fillStyle='#00ff88';
  var cs=18;
  ctx.fillRect(15,15,cs,cs);ctx.fillRect(15,18,6,12);ctx.fillRect(18,15,12,6);
  ctx.fillRect(400-15-cs,15,cs,cs);ctx.fillRect(400-15-6,18,6,12);ctx.fillRect(400-15-cs,15,12,6);
  ctx.fillRect(15,250-15-cs,cs,cs);ctx.fillRect(15,250-15-cs,6,12);ctx.fillRect(18,250-15-6,12,6);
  ctx.fillRect(400-15-cs,250-15-cs,cs,cs);ctx.fillRect(400-15-6,250-15-cs,6,12);ctx.fillRect(400-15-cs,250-15-6,12,6);
  /* watermark */
  ctx.fillStyle='rgba(255,255,255,0.15)';ctx.font='10px monospace';
  ctx.fillText('Workshop-DIY',200,240);
  /* download */
  canvas.toBlob(function(blob){
   var url=URL.createObjectURL(blob);
   var a=document.createElement('a');
   a.href=url;a.download='mission-card.png';
   document.body.appendChild(a);a.click();
   document.body.removeChild(a);
   URL.revokeObjectURL(url);
  },'image/png');
  /* copy challenge to clipboard */
  var clipText=appTitle+' - MISSION CHALLENGE\nParameters: '+(paramStr||'default')+'\n'+challengeText;
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(clipText).catch(function(){});}
 };
 hdr.appendChild(btn);
}

/* ═══════ Mistake Detector ═══════ */
function initMistakeDetector(){
 if(document.getElementById('mistakeDetectorStyle'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var style=document.createElement('style');
 style.id='mistakeDetectorStyle';
 style.textContent='.mistake-banner{position:relative;background:#443300;color:#ffdd57;border:1px solid #ffdd57;border-radius:6px;padding:8px 28px 8px 12px;margin:8px auto;max-width:600px;font-size:13px;z-index:90;animation:mistakeFadeIn .3s}'
  +'.mistake-banner .mistake-x{position:absolute;right:6px;top:4px;cursor:pointer;background:none;border:none;color:#ffdd57;font-size:16px;line-height:1}'
  +'@keyframes mistakeFadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}';
 document.head.appendChild(style);
 var currentBanner=null;
 var dismissTimer=null;
 function showWarning(msg){
  if(currentBanner&&currentBanner.parentNode)currentBanner.parentNode.removeChild(currentBanner);
  if(dismissTimer)clearTimeout(dismissTimer);
  var mc=document.querySelector('.mainCard')||document.querySelector('.card')||document.querySelector('.sim-controls');
  if(!mc)return;
  var div=document.createElement('div');
  div.className='mistake-banner';
  var title=L.mistakeTitle||'Tip';
  div.innerHTML='<strong>'+title+':</strong> '+msg+'<button class="mistake-x" aria-label="close">\u00d7</button>';
  div.querySelector('.mistake-x').onclick=function(){if(div.parentNode)div.parentNode.removeChild(div);currentBanner=null;};
  mc.parentNode.insertBefore(div,mc.nextSibling);
  currentBanner=div;
  dismissTimer=setTimeout(function(){if(div.parentNode)div.parentNode.removeChild(div);if(currentBanner===div)currentBanner=null;},5000);
 }
 var relatedPairs=[['frequency','power'],['freq','power'],['gain','sensitivity']];
 function checkSliders(){
  var sliders=document.querySelectorAll('input[type=range]');
  sliders.forEach(function(s){
   var min=parseFloat(s.min)||0;
   var max=parseFloat(s.max)||100;
   var val=parseFloat(s.value);
   var lbl=s.previousElementSibling;
   var label=s.id||s.name||(lbl?lbl.textContent.trim():'parameter');
   if(val<=min){
    showWarning((L.mistakeMin||'Setting to minimum may produce no output')+' ('+label+')');
    return;
   }
   if(val>=max){
    showWarning((L.mistakeMax||'Maximum may cause signal clipping')+' ('+label+')');
    return;
   }
  });
  /* check related pairs */
  var sliderMap={};
  sliders.forEach(function(s){
   var lbl=((s.id||s.name||'')+' '+(s.previousElementSibling?s.previousElementSibling.textContent:'')).toLowerCase();
   var min=parseFloat(s.min)||0;var max=parseFloat(s.max)||100;var val=parseFloat(s.value);
   var pct=(val-min)/(max-min||1);
   relatedPairs.forEach(function(pair){
    pair.forEach(function(kw){if(lbl.indexOf(kw)>=0)sliderMap[kw]=pct;});
   });
  });
  relatedPairs.forEach(function(pair){
   var a=sliderMap[pair[0]],b=sliderMap[pair[1]];
   if(a!==undefined&&b!==undefined&&((a<0.05&&b<0.05)||(a>0.95&&b>0.95)||(a<0.05&&b>0.95)||(a>0.95&&b<0.05))){
    showWarning(L.mistakeCombo||'Extreme combination detected');
   }
  });
 }
 document.addEventListener('input',function(e){
  if(e.target&&e.target.type==='range')checkSliders();
 });
}
"""


def find_script_files():
    """Find all script.js files matching [0-9]*-*/*/script.js."""
    pattern = os.path.join(ROOT, '[0-9]*-*', '*', 'script.js')
    files = sorted(glob.glob(pattern))
    return files


def inject_lang_keys(content):
    """Insert LANG keys after ...LANG_BASE.en, / .fr, / .ar, markers."""
    # Insert after ...LANG_BASE.en,
    if '...LANG_BASE.en,' in content:
        content = content.replace('...LANG_BASE.en,', '...LANG_BASE.en,' + LANG_EN, 1)
    # Insert after ...LANG_BASE.fr,
    if '...LANG_BASE.fr,' in content:
        content = content.replace('...LANG_BASE.fr,', '...LANG_BASE.fr,' + LANG_FR, 1)
    # Insert after ...LANG_BASE.ar,
    if '...LANG_BASE.ar,' in content:
        content = content.replace('...LANG_BASE.ar,', '...LANG_BASE.ar,' + LANG_AR, 1)
    return content


def inject_js(content):
    """Insert JS code + init calls after the LANG }; block."""
    # Find the LANG = { ... }; and insert after it
    # The LANG block ends with a line that is just `};`
    # We need to find the closing `};` of the LANG object
    # Strategy: find `const LANG = {` then find matching `};`
    lang_start = content.find('const LANG = {')
    if lang_start < 0:
        lang_start = content.find('const LANG={')
    if lang_start < 0:
        return content

    # Find the closing `};` after the LANG declaration
    # We need to track brace depth
    brace_depth = 0
    i = content.index('{', lang_start)
    started = False
    close_pos = -1
    while i < len(content):
        ch = content[i]
        if ch == '{':
            brace_depth += 1
            started = True
        elif ch == '}':
            brace_depth -= 1
            if started and brace_depth == 0:
                # Find the semicolon
                j = i + 1
                while j < len(content) and content[j] in ' \t\n\r':
                    j += 1
                if j < len(content) and content[j] == ';':
                    close_pos = j + 1
                else:
                    close_pos = i + 1
                break
        i += 1

    if close_pos < 0:
        return content

    # Insert JS code and init calls after the LANG closing
    init_calls = "\ntry{initMissionCards();}catch(e){}\ntry{initMistakeDetector();}catch(e){}\n"
    content = content[:close_pos] + JS_CODE + init_calls + content[close_pos:]
    return content


def process_file(filepath):
    """Process a single script.js file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Idempotent check
    if 'missionCardTitle' in content:
        return False

    # Inject LANG keys
    content = inject_lang_keys(content)

    # Inject JS code
    content = inject_js(content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return True


def verify_files(files, count=30):
    """Verify N files with node -c."""
    import random
    sample = random.sample(files, min(count, len(files)))
    errors = 0
    for f in sample:
        result = subprocess.run(['node', '-c', f], capture_output=True, text=True)
        if result.returncode != 0:
            print(f"  SYNTAX ERROR: {f}")
            print(f"    {result.stderr.strip()}")
            errors += 1
        else:
            print(f"  OK: {os.path.relpath(f, ROOT)}")
    return errors


def main():
    files = find_script_files()
    print(f"Found {len(files)} script.js files")

    modified = 0
    skipped = 0
    for filepath in files:
        try:
            if process_file(filepath):
                modified += 1
            else:
                skipped += 1
        except Exception as e:
            print(f"ERROR processing {filepath}: {e}")

    print(f"\nModified: {modified}")
    print(f"Skipped (already had feature): {skipped}")
    print(f"Total: {modified + skipped}")

    print(f"\nVerifying 30 random files with node -c ...")
    errors = verify_files(files, 30)
    if errors:
        print(f"\n{errors} file(s) had syntax errors!")
        sys.exit(1)
    else:
        print("\nAll 30 verified files passed syntax check.")


if __name__ == '__main__':
    main()
