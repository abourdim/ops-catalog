#!/usr/bin/env python3
"""
Add Auto-Narrator and What-If Engine to all 488 apps in ops-catalog.
Idempotent: skips files that already contain narratorTitle.
Handles both old format (LANG_BASE spread) and new format (inline LANG).
"""

import glob
import os
import subprocess
import sys
import random

BASE = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject ──
LANG_EN = (
    "narratorTitle:'Auto Narrator',"
    "narratorScanning:'Scanning for signals...',"
    "narratorDetected:'Signal detected! Activity: HIGH',"
    "narratorProcessing:'Processing data streams...',"
    "narratorWarning:'Warning: anomaly detected',"
    "narratorAcquired:'Signal acquired successfully',"
    "whatifTitle:'What If?',"
    "whatifIncrease:'Increasing',"
    "whatifDecrease:'Decreasing'"
)

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

# ── JS functions to append after LANG }; ──
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


def process_file(fpath):
    """Process a single script.js file."""
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Idempotency check - but also fix previously broken new-format files
    if 'narratorTitle' in content:
        # Check if this is a broken new-format file (double comma issue)
        if ',,narratorTitle' in content:
            modified = content
            # Fix all double-comma issues around narrator/whatif keys
            while ',,' in modified:
                modified = modified.replace(',,', ',')
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(modified)
            return 'fix'
        return 'skip'

    modified = content

    # Determine format: new format has "},fr:{" inline, old format has "...LANG_BASE.en,"
    is_new_format = '},fr:{' in modified

    if is_new_format:
        # New format: insert EN keys before },fr:{
        # The content before },fr:{ already has a trailing comma, so just insert keys
        modified = modified.replace('},fr:{', LANG_EN + ',},fr:{', 1)
        # Insert FR keys before },ar:{
        modified = modified.replace('},ar:{', LANG_FR + ',},ar:{', 1)
        # Insert AR keys before }};
        modified = modified.replace('}};', LANG_AR + ',}};', 1)
    else:
        # Old format: insert after ...LANG_BASE.en, line
        # EN: insert after the line containing ...LANG_BASE.en,
        modified = modified.replace('...LANG_BASE.en,', '...LANG_BASE.en,' + LANG_EN + ',', 1)
        # FR: insert after the line containing ...LANG_BASE.fr,
        modified = modified.replace('...LANG_BASE.fr,', '...LANG_BASE.fr,' + LANG_FR + ',', 1)
        # AR: insert after the line containing ...LANG_BASE.ar,
        modified = modified.replace('...LANG_BASE.ar,', '...LANG_BASE.ar,' + LANG_AR + ',', 1)

    # Insert JS functions after the LANG closing };
    # We need to find the LANG }; which is followed by Kids Mode or other init functions
    # Strategy: find the }; that closes the LANG object
    # For old format: it's on its own line (just "};")
    # For new format: it's at end of line as "}};", and then next meaningful line starts with /* or function

    if is_new_format:
        # After }};  we insert JS functions
        # Find the first }}; and insert after it
        idx = modified.find('}};')
        if idx != -1:
            insert_pos = idx + 3
            # Skip any newlines after }};
            while insert_pos < len(modified) and modified[insert_pos] in '\r\n':
                insert_pos += 1
            modified = modified[:insert_pos] + JS_FUNCTIONS + '\n' + modified[insert_pos:]
    else:
        # Old format: find the standalone }; that closes LANG
        # It appears after the ar section, typically as a line with just };
        # We need the FIRST }; after "const LANG" that's on its own line
        lang_start = modified.find('const LANG')
        if lang_start == -1:
            lang_start = modified.find('const LANG=')
        if lang_start != -1:
            # Find closing }; - look for \n};\n pattern after LANG
            search_from = lang_start
            # We need to find the }; that closes the LANG block
            # In old format, glossTitle is near the end of ar section, then };
            # Let's find }; after the ar section
            ar_base = modified.find('...LANG_BASE.ar,', search_from)
            if ar_base != -1:
                # Find the next standalone }; after ar section
                pos = ar_base
                while True:
                    idx = modified.find('\n};', pos)
                    if idx == -1:
                        # fallback: find }; anywhere after ar
                        idx = modified.find('};', pos)
                        if idx != -1:
                            insert_pos = idx + 2
                            while insert_pos < len(modified) and modified[insert_pos] in '\r\n':
                                insert_pos += 1
                            modified = modified[:insert_pos] + JS_FUNCTIONS + '\n' + modified[insert_pos:]
                        break
                    # Check it's a standalone };
                    line_start = idx + 1
                    line_end = modified.find('\n', line_start)
                    if line_end == -1:
                        line_end = len(modified)
                    line = modified[line_start:line_end].strip()
                    if line == '};':
                        insert_pos = line_end
                        if insert_pos < len(modified) and modified[insert_pos] == '\n':
                            insert_pos += 1
                        modified = modified[:insert_pos] + JS_FUNCTIONS + '\n' + modified[insert_pos:]
                        break
                    pos = idx + 2

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(modified)

    return 'ok'


def main():
    pattern = os.path.join(BASE, '[0-9]*-*', '*', 'script.js')
    files = sorted(glob.glob(pattern))
    print('Found {} script.js files'.format(len(files)))

    ok_count = 0
    skip_count = 0
    fix_count = 0
    err_count = 0
    errors = []

    for fpath in files:
        try:
            result = process_file(fpath)
            if result == 'skip':
                skip_count += 1
            elif result == 'fix':
                fix_count += 1
            else:
                ok_count += 1
        except Exception as e:
            err_count += 1
            errors.append((fpath, str(e)))

    print('Processed: {} | Fixed: {} | Skipped (idempotent): {} | Errors: {}'.format(ok_count, fix_count, skip_count, err_count))
    for fp, err in errors[:10]:
        print('  ERROR: {} -> {}'.format(fp, err))

    # Verify 30 random files with node -c
    verify_files = random.sample(files, min(30, len(files)))
    print('\nVerifying {} files with node -c ...'.format(len(verify_files)))
    verify_ok = 0
    verify_fail = 0
    for vf in verify_files:
        result = subprocess.run(['node', '-c', vf], capture_output=True, text=True)
        if result.returncode == 0:
            verify_ok += 1
        else:
            verify_fail += 1
            print('  FAIL: {} -> {}'.format(vf, result.stderr.strip()[:200]))

    print('Verification: {} OK, {} FAILED out of {}'.format(verify_ok, verify_fail, len(verify_files)))


if __name__ == '__main__':
    main()
