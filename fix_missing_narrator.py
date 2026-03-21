#!/usr/bin/env python3
"""
Fix 110 script.js files that have narratorTitle in EN LANG keys
but are missing:
  - FR narrator/whatif LANG keys
  - AR narrator/whatif LANG keys
  - initAutoNarrator() function
  - initWhatIfEngine() function

The original add_narrator_whatif.py skipped these files because its
idempotency check (`if 'narratorTitle' in content`) matched the EN
keys that were already present from template generation.
"""

import glob
import os
import subprocess
import sys

BASE = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject into FR and AR blocks ──
LANG_FR = (
    "narratorTitle:'Narrateur Auto',"
    "narratorScanning:'Recherche de signaux...',"
    "narratorDetected:'Signal d\\x27tect\\x27! Activit\\x27: HAUTE',"
    "narratorProcessing:'Traitement des donn\\x27es...',"
    "narratorWarning:'Alerte: anomalie d\\x27tect\\x27e',"
    "narratorAcquired:'Signal acquis avec succ\\x27s',"
    "whatifTitle:'Et si?',"
    "whatifIncrease:'Augmenter',"
    "whatifDecrease:'Diminuer'"
)

LANG_AR = (
    "narratorTitle:'\u0627\u0644\u0631\u0627\u0648\u064a \u0627\u0644\u062a\u0644\u0642\u0627\u0626\u064a',"
    "narratorScanning:'...\u062c\u0627\u0631\u064a \u0627\u0644\u0628\u062d\u062b \u0639\u0646 \u0625\u0634\u0627\u0631\u0627\u062a',"
    "narratorDetected:'!\u062a\u0645 \u0627\u0643\u062a\u0634\u0627\u0641 \u0625\u0634\u0627\u0631\u0629',"
    "narratorProcessing:'...\u0645\u0639\u0627\u0644\u062c\u0629 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a',"
    "narratorWarning:'\u062a\u062d\u0630\u064a\u0631: \u062a\u0645 \u0627\u0643\u062a\u0634\u0627\u0641 \u0634\u0630\u0648\u0630',"
    "narratorAcquired:'\u062a\u0645 \u0627\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0627\u0644\u0625\u0634\u0627\u0631\u0629 \u0628\u0646\u062c\u0627\u062d',"
    "whatifTitle:'\u0645\u0627\u0630\u0627 \u0644\u0648\u061f',"
    "whatifIncrease:'\u0632\u064a\u0627\u062f\u0629',"
    "whatifDecrease:'\u062a\u0642\u0644\u064a\u0644'"
)

# ── JS functions ──
JS_FUNCTIONS = r"""
/* ═══════ Auto-Narrator ═══════ */
function initAutoNarrator(){
 if(document.getElementById('narratorBox'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var box=document.createElement('div');
 box.id='narratorBox';
 box.style.cssText='position:fixed;bottom:18px;left:50%;transform:translateX(-50%);width:300px;background:rgba(0,0,0,0.78);color:#0f0;font-family:monospace;font-size:13px;padding:10px 16px;border-radius:10px;z-index:9999;text-align:center;pointer-events:none;opacity:0;transition:opacity 0.4s;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
 document.body.appendChild(box);
 var hideTimer=null;
 var running=false;
 var lastText='';
 function showNarration(txt){
  if(txt===lastText)return;
  lastText=txt;
  box.textContent=txt;
  box.style.opacity='1';
  if(hideTimer)clearTimeout(hideTimer);
  hideTimer=setTimeout(function(){box.style.opacity='0';},3000);
 }
 var startBtn=document.getElementById('startBtn');
 if(startBtn){
  startBtn.addEventListener('click',function(){running=true;});
 }
 var stopBtn=document.getElementById('stopBtn');
 if(stopBtn){
  stopBtn.addEventListener('click',function(){running=false;});
 }
 var resetBtn=document.getElementById('resetBtn');
 if(resetBtn){
  resetBtn.addEventListener('click',function(){running=false;});
 }
 var canvas=document.getElementById('simCanvas');
 if(canvas){
  var ctx=null;
  try{ctx=canvas.getContext('2d',{willReadFrequently:true});}catch(e){}
  if(ctx){
   setInterval(function(){
    if(!running)return;
    try{
     var w=canvas.width||300;
     var h=canvas.height||150;
     var data=ctx.getImageData(0,0,Math.min(w,100),Math.min(h,100)).data;
     var rSum=0,gSum=0,bSum=0,total=0;
     for(var i=0;i<data.length;i+=16){
      rSum+=data[i];gSum+=data[i+1];bSum+=data[i+2];total++;
     }
     if(total===0)return;
     var rAvg=rSum/total,gAvg=gSum/total,bAvg=bSum/total;
     var brightness=(rAvg+gAvg+bAvg)/3;
     if(rAvg>gAvg*1.5&&rAvg>bAvg*1.5){
      showNarration(L.narratorWarning||'Warning: anomaly detected');
     }else if(gAvg>rAvg*1.3&&gAvg>bAvg*1.3){
      showNarration(L.narratorAcquired||'Signal acquired successfully');
     }else if(brightness>170){
      showNarration(L.narratorDetected||'Signal detected! Activity: HIGH');
     }else if(brightness<50){
      showNarration(L.narratorScanning||'Scanning for signals...');
     }else{
      showNarration(L.narratorProcessing||'Processing data streams...');
     }
    }catch(e){}
   },500);
  }
 }
 var sliders=document.querySelectorAll('input[type=range]');
 for(var s=0;s<sliders.length;s++){
  (function(sl){
   sl.addEventListener('input',function(){
    if(!running)return;
    var label='parameter';
    var lbl=sl.previousElementSibling;
    if(lbl&&lbl.textContent)label=lbl.textContent.replace(/[:\s]+$/,'');
    showNarration('Adjusting '+label+' to '+sl.value+'...');
   });
  })(sliders[s]);
 }
 var hdr=document.querySelector('.header-buttons')||document.querySelector('header');
 if(hdr){
  var btn=document.createElement('button');
  btn.className='btn-icon-only';
  btn.textContent='\ud83d\udce1';
  btn.title=L.narratorTitle||'Auto Narrator';
  btn.style.cssText='background:none;border:1px solid currentColor;border-radius:6px;cursor:pointer;font-size:18px;padding:4px 8px;margin-left:4px;';
  var vis=true;
  btn.addEventListener('click',function(){
   vis=!vis;
   box.style.display=vis?'block':'none';
  });
  hdr.appendChild(btn);
 }
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initAutoNarrator);}
else{initAutoNarrator();}

/* ═══════ What-If Engine ═══════ */
function initWhatIfEngine(){
 if(document.querySelector('.whatif-btn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var kwMap={frequency:'oscillation speed',power:'signal strength',range:'detection distance',sensitivity:'noise threshold',speed:'processing rate',gain:'amplification level',threshold:'trigger point',delay:'response time'};
 var sliders=document.querySelectorAll('input[type=range]');
 for(var s=0;s<sliders.length;s++){
  (function(sl){
   var btn=document.createElement('button');
   btn.className='whatif-btn';
   btn.textContent='?';
   btn.title=L.whatifTitle||'What If?';
   btn.style.cssText='background:rgba(0,0,0,0.6);color:#0ff;border:1px solid #0ff;border-radius:50%;width:22px;height:22px;font-size:13px;cursor:pointer;margin-left:6px;padding:0;line-height:20px;text-align:center;vertical-align:middle;flex-shrink:0;';
   sl.parentNode.insertBefore(btn,sl.nextSibling);
   btn.addEventListener('click',function(e){
    e.stopPropagation();
    var existing=document.querySelector('.whatif-popup');
    if(existing)existing.remove();
    var label='parameter';
    var lbl=sl.previousElementSibling;
    if(lbl&&lbl.textContent)label=lbl.textContent.replace(/[:\s]+$/,'').toLowerCase();
    var val=parseInt(sl.value,10);
    var min=parseInt(sl.min||'0',10);
    var max=parseInt(sl.max||'100',10);
    var mid=(min+max)/2;
    var pct=max>min?Math.round(((val-min)/(max-min))*100):50;
    var kw='behavior';
    for(var k in kwMap){
     if(label.indexOf(k)!==-1){kw=kwMap[k];break;}
    }
    var incWord=L.whatifIncrease||'Increasing';
    var decWord=L.whatifDecrease||'Decreasing';
    var txt=incWord+' '+label+' will increase '+kw+', potentially revealing hidden patterns. '+decWord+' it will reduce '+kw+'. Currently at '+pct+'%.';
    var popup=document.createElement('div');
    popup.className='whatif-popup';
    popup.style.cssText='position:absolute;background:rgba(0,0,20,0.92);color:#0ff;font-size:12px;padding:10px 14px;border-radius:8px;border:1px solid #0ff;max-width:260px;z-index:10000;box-shadow:0 4px 16px rgba(0,255,255,0.15);line-height:1.5;';
    popup.textContent=txt;
    document.body.appendChild(popup);
    var rect=sl.getBoundingClientRect();
    popup.style.left=Math.max(4,rect.left+window.scrollX)+'px';
    popup.style.top=(rect.bottom+window.scrollY+6)+'px';
    function closePopup(){popup.remove();document.removeEventListener('click',closePopup);}
    setTimeout(function(){document.addEventListener('click',closePopup);},10);
   });
  })(sliders[s]);
 }
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initWhatIfEngine);}
else{initWhatIfEngine();}
"""


def find_lang_closing(content):
    """Find the }; that closes the const LANG block.

    Strategy: find 'const LANG={' then find matching closing '};'
    by counting braces.
    """
    lang_start = content.find('const LANG={')
    if lang_start == -1:
        lang_start = content.find('const LANG ={')
    if lang_start == -1:
        lang_start = content.find('const LANG =')
    if lang_start == -1:
        return -1

    # Find the opening { after const LANG
    brace_start = content.find('{', lang_start)
    if brace_start == -1:
        return -1

    # Count braces to find matching close
    depth = 0
    in_string = False
    string_char = None
    i = brace_start
    while i < len(content):
        ch = content[i]

        if in_string:
            if ch == '\\':
                i += 2
                continue
            if ch == string_char:
                in_string = False
        else:
            if ch in ("'", '"', '`'):
                in_string = True
                string_char = ch
            elif ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
                if depth == 0:
                    # Found the matching close brace
                    # Look for ; after it
                    j = i + 1
                    while j < len(content) and content[j] in ' \t':
                        j += 1
                    if j < len(content) and content[j] == ';':
                        return j + 1  # position after };
                    return i + 1  # position after }
        i += 1
    return -1


def find_fr_block_start(content):
    """Find where the fr:{ block starts inside const LANG, to inject FR keys."""
    lang_start = content.find('const LANG={')
    if lang_start == -1:
        lang_start = content.find('const LANG ={')
    if lang_start == -1:
        lang_start = content.find('const LANG =')
    if lang_start == -1:
        return -1, -1

    # For old format with spread: find ...LANG_BASE.fr,
    fr_spread = content.find('...LANG_BASE.fr,', lang_start)
    if fr_spread != -1:
        # Insert after ...LANG_BASE.fr,
        return fr_spread + len('...LANG_BASE.fr,'), 'old'

    # For new format: find fr:{ after const LANG
    # We need to find the fr block opening
    fr_idx = content.find('fr:{', lang_start)
    if fr_idx != -1:
        return fr_idx + len('fr:{'), 'new'

    # Try with space
    fr_idx = content.find('fr: {', lang_start)
    if fr_idx != -1:
        return fr_idx + len('fr: {'), 'new'

    return -1, None


def find_ar_block_start(content):
    """Find where the ar:{ block starts inside const LANG, to inject AR keys."""
    lang_start = content.find('const LANG={')
    if lang_start == -1:
        lang_start = content.find('const LANG ={')
    if lang_start == -1:
        lang_start = content.find('const LANG =')
    if lang_start == -1:
        return -1, -1

    # For old format with spread: find ...LANG_BASE.ar,
    ar_spread = content.find('...LANG_BASE.ar,', lang_start)
    if ar_spread != -1:
        return ar_spread + len('...LANG_BASE.ar,'), 'old'

    # For new format: find ar:{ after const LANG
    ar_idx = content.find('ar:{', lang_start)
    if ar_idx != -1:
        return ar_idx + len('ar:{'), 'new'

    ar_idx = content.find('ar: {', lang_start)
    if ar_idx != -1:
        return ar_idx + len('ar: {'), 'new'

    return -1, None


def process_file(fpath):
    """Fix a single script.js file that has narratorTitle but missing functions."""
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Safety: skip if already has the functions
    if 'initAutoNarrator' in content:
        return 'skip'

    # Must have narratorTitle (we only fix files that had partial injection)
    if 'narratorTitle' not in content:
        return 'skip-no-narrator'

    modified = content

    # Step 1: Inject FR narrator keys if missing
    if 'Narrateur Auto' not in modified:
        fr_pos, fr_fmt = find_fr_block_start(modified)
        if fr_pos > 0:
            modified = modified[:fr_pos] + LANG_FR + ',' + modified[fr_pos:]

    # Step 2: Inject AR narrator keys if missing
    if '\u0627\u0644\u0631\u0627\u0648\u064a \u0627\u0644\u062a\u0644\u0642\u0627\u0626\u064a' not in modified:
        ar_pos, ar_fmt = find_ar_block_start(modified)
        if ar_pos > 0:
            modified = modified[:ar_pos] + LANG_AR + ',' + modified[ar_pos:]

    # Step 3: Inject JS functions after LANG };
    lang_end = find_lang_closing(modified)
    if lang_end > 0:
        # Skip any whitespace/newlines after };
        insert_pos = lang_end
        while insert_pos < len(modified) and modified[insert_pos] in '\r\n':
            insert_pos += 1
        modified = modified[:insert_pos] + JS_FUNCTIONS + '\n' + modified[insert_pos:]
    else:
        # Fallback: append to end of file
        modified = modified.rstrip() + '\n' + JS_FUNCTIONS + '\n'

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(modified)

    return 'fixed'


def main():
    pattern = os.path.join(BASE, '[0-9]*-*', '*', 'script.js')
    files = sorted(glob.glob(pattern))
    print(f'Total script.js files: {len(files)}')

    # Find files missing initAutoNarrator
    missing = [f for f in files if 'initAutoNarrator' not in open(f).read()]
    print(f'Missing initAutoNarrator: {len(missing)}')

    fixed = 0
    skipped = 0
    errors = []

    for fpath in missing:
        try:
            result = process_file(fpath)
            if result == 'fixed':
                fixed += 1
            else:
                skipped += 1
                print(f'  Skipped: {fpath} ({result})')
        except Exception as e:
            errors.append((fpath, str(e)))
            print(f'  ERROR: {fpath} -> {e}')

    print(f'\nFixed: {fixed} | Skipped: {skipped} | Errors: {len(errors)}')

    # Verify ALL fixed files with node -c
    print(f'\nVerifying all {fixed} fixed files with node -c ...')
    # Re-scan to find the ones we fixed
    newly_fixed = [f for f in missing if 'initAutoNarrator' in open(f).read()]
    verify_ok = 0
    verify_fail = 0
    for vf in newly_fixed:
        result = subprocess.run(['node', '-c', vf], capture_output=True, text=True)
        if result.returncode == 0:
            verify_ok += 1
        else:
            verify_fail += 1
            print(f'  FAIL: {vf} -> {result.stderr.strip()[:200]}')

    print(f'Verification: {verify_ok} OK, {verify_fail} FAILED out of {len(newly_fixed)}')

    # Final count
    still_missing = sum(1 for f in files if 'initAutoNarrator' not in open(f).read())
    print(f'\nFinal: {still_missing} files still missing initAutoNarrator out of {len(files)}')


if __name__ == '__main__':
    main()
