#!/usr/bin/env python3
"""Add Spy Rank progression system to all 488 apps in ops-catalog."""

import glob
import os
import re
import random
import subprocess
import sys

CATALOG = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject ──
# Use raw strings so \x27 is literal backslash-x-2-7 (JS hex escape for apostrophe)
LANG_EN = r"rankTitle:'Spy Rank',rankRecruit:'Recruit',rankAgent:'Agent',rankSpecial:'Special Agent',rankCommander:'Commander',rankDirector:'Director',rankStats:'Your Stats',rankNext:'Points to next rank',"

LANG_FR = r"rankTitle:'Rang d\x27Espion',rankRecruit:'Recrue',rankAgent:'Agent',rankSpecial:'Agent Sp\x27cial',rankCommander:'Commandant',rankDirector:'Directeur',rankStats:'Vos Statistiques',rankNext:'Points au prochain rang',"

LANG_AR = "rankTitle:'\u0631\u062a\u0628\u0629 \u0627\u0644\u062c\u0627\u0633\u0648\u0633',rankRecruit:'\u0645\u062c\u0646\u062f',rankAgent:'\u0639\u0645\u064a\u0644',rankSpecial:'\u0639\u0645\u064a\u0644 \u062e\u0627\u0635',rankCommander:'\u0642\u0627\u0626\u062f',rankDirector:'\u0645\u062f\u064a\u0631',rankStats:'\u0625\u062d\u0635\u0627\u0626\u064a\u0627\u062a\u0643',rankNext:'\u0646\u0642\u0627\u0637 \u0644\u0644\u0631\u062a\u0628\u0629 \u0627\u0644\u062a\u0627\u0644\u064a\u0629',"

# ── initSpyRank function (no backticks!) ──
INIT_SPY_RANK = r"""
/* ═══════ Spy Rank ═══════ */
function initSpyRank(){
 if(document.getElementById('spyRankBtn'))return;
 var appId=location.pathname.replace(/[^a-zA-Z0-9]/g,'_');
 try{localStorage.setItem('rank_visited_'+appId,'1');}catch(e){}
 var style=document.createElement('style');
 style.textContent='.spy-rank-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;}.spy-rank-popup{background:#1a1a2e;color:#e0e0e0;border-radius:16px;padding:28px 32px;max-width:370px;width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.6);font-family:inherit;position:relative;}.spy-rank-popup h2{margin:0 0 16px;font-size:1.3em;text-align:center;}.spy-rank-popup .sr-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #2a2a4a;}.spy-rank-popup .sr-close{position:absolute;top:8px;right:14px;background:none;border:none;color:#e0e0e0;font-size:1.4em;cursor:pointer;}.spy-rank-popup .sr-badge{text-align:center;font-size:2em;margin-bottom:8px;}';
 document.head.appendChild(style);
 function t(k){try{var L=typeof LANG!=='undefined'?LANG:null;if(!L)return k;var c=document.documentElement.lang||localStorage.getItem('lang')||'en';if(L[c]&&L[c][k])return L[c][k];if(L.en&&L.en[k])return L.en[k];return k;}catch(e){return k;}}
 function calcScore(){
  var visited=0,quizScore=0,quizCount=0,achieve=0,stickers=0;
  try{
   for(var i=0;i<localStorage.length;i++){
    var key=localStorage.key(i);
    if(key.indexOf('rank_visited_')===0)visited++;
    if(key.indexOf('quiz_score_')===0){quizCount++;quizScore+=parseInt(localStorage.getItem(key))||0;}
    if(key.indexOf('achieve_')===0)achieve++;
   }
   stickers=parseInt(localStorage.getItem('kidsStickers'))||0;
  }catch(e){}
  var total=visited+quizScore+achieve+stickers;
  return{visited:visited,quizScore:quizScore,quizCount:quizCount,achieve:achieve,stickers:stickers,total:total};
 }
 function getRank(total){
  if(total>=51)return{name:t('rankDirector'),emoji:'\uD83D\uDC51',min:51,next:null};
  if(total>=31)return{name:t('rankCommander'),emoji:'\uD83C\uDF96\uFE0F',min:31,next:51};
  if(total>=16)return{name:t('rankSpecial'),emoji:'\u2B50',min:16,next:31};
  if(total>=6)return{name:t('rankAgent'),emoji:'\uD83D\uDD75\uFE0F',min:6,next:16};
  return{name:t('rankRecruit'),emoji:'\uD83D\uDD30',min:0,next:6};
 }
 function showPopup(){
  var s=calcScore();var r=getRank(s.total);
  var overlay=document.createElement('div');overlay.className='spy-rank-overlay';
  var popup=document.createElement('div');popup.className='spy-rank-popup';
  var closeBtn=document.createElement('button');closeBtn.className='sr-close';closeBtn.textContent='\u00D7';
  closeBtn.onclick=function(){overlay.remove();};
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  var badge=document.createElement('div');badge.className='sr-badge';badge.textContent=r.emoji;
  var title=document.createElement('h2');title.textContent=t('rankTitle')+' \u2014 '+r.name;
  var statsTitle=document.createElement('h3');statsTitle.textContent=t('rankStats');statsTitle.style.cssText='margin:12px 0 8px;font-size:1em;color:#8888cc;';
  popup.appendChild(closeBtn);popup.appendChild(badge);popup.appendChild(title);popup.appendChild(statsTitle);
  var rows=[
   ['\uD83D\uDCF1 Apps',s.visited],
   ['\uD83C\uDFAF Quiz',s.quizScore+(s.quizCount?' ('+s.quizCount+')':'')],
   ['\uD83C\uDF1F Missions',s.achieve],
   ['\uD83C\uDF1F Stickers',s.stickers],
   ['\uD83D\uDCCA Total',s.total]
  ];
  for(var i=0;i<rows.length;i++){
   var row=document.createElement('div');row.className='sr-row';
   var lbl=document.createElement('span');lbl.textContent=rows[i][0];
   var val=document.createElement('strong');val.textContent=rows[i][1];
   row.appendChild(lbl);row.appendChild(val);popup.appendChild(row);
  }
  if(r.next!==null){
   var nxt=document.createElement('div');nxt.style.cssText='text-align:center;margin-top:14px;color:#8888cc;font-size:0.9em;';
   nxt.textContent=t('rankNext')+': '+(r.next-s.total);
   popup.appendChild(nxt);
  }
  overlay.appendChild(popup);document.body.appendChild(overlay);
 }
 var score=calcScore();var rank=getRank(score.total);
 var btn=document.createElement('button');btn.id='spyRankBtn';btn.className='btn-icon-only';
 btn.title=t('rankTitle')+' \u2014 '+rank.name;btn.textContent=rank.emoji;
 btn.onclick=showPopup;
 var hdr=document.querySelector('.header-buttons');if(hdr)hdr.appendChild(btn);
}
initSpyRank();
"""

def find_script_files():
    """Find all script.js files matching [0-9]*-*/*/script.js"""
    pattern = os.path.join(CATALOG, '[0-9]*-*', '*', 'script.js')
    return sorted(glob.glob(pattern))

def already_injected(content):
    """Check if rankTitle key already exists"""
    return 'rankTitle' in content

def inject_lang_keys(content):
    """Inject LANG keys into both old and new format files using str.replace."""
    # Old format markers: ...LANG_BASE.en, / ...LANG_BASE.fr, / ...LANG_BASE.ar,
    # Insert our keys right after the spread marker
    old_en = '...LANG_BASE.en,'
    old_fr = '...LANG_BASE.fr,'
    old_ar = '...LANG_BASE.ar,'

    if old_en in content:
        # Old format (with LANG_BASE spread)
        content = content.replace(old_en, old_en + LANG_EN, 1)
        content = content.replace(old_fr, old_fr + LANG_FR, 1)
        content = content.replace(old_ar, old_ar + LANG_AR, 1)
    else:
        # New format: },fr:{ / },ar:{ / }};
        # Find the LANG block and inject before boundaries
        # EN keys: insert before },fr:{
        idx_fr = content.find('},fr:{')
        if idx_fr == -1:
            idx_fr = content.find('}, fr: {')
        if idx_fr != -1:
            content = content[:idx_fr] + ',' + LANG_EN + content[idx_fr:]

        # FR keys: insert before },ar:{ (find the one after fr section)
        # We need to find },ar:{ that comes after },fr:{
        idx_ar = content.find('},ar:{')
        if idx_ar == -1:
            idx_ar = content.find('}, ar: {')
        if idx_ar != -1:
            content = content[:idx_ar] + ',' + LANG_FR + content[idx_ar:]

        # AR keys: insert before }}; (end of LANG)
        # Find }}; that closes LANG - search from end of ar section
        idx_end = content.find('}};')
        if idx_end != -1:
            content = content[:idx_end] + ',' + LANG_AR + content[idx_end:]

    return content

def inject_function(content):
    """Inject initSpyRank() after the LANG block closing."""
    # Old format: }; on its own line after ar section
    if '...LANG_BASE.ar' in content:
        ar_pos = content.find('...LANG_BASE.ar')
        if ar_pos != -1:
            # Find the next standalone }; on its own line after ar section
            rest = content[ar_pos:]
            m = re.search(r'\n};(\s*\n)', rest)
            if m:
                insert_pos = ar_pos + m.start() + len('\n};')
                content = content[:insert_pos] + INIT_SPY_RANK + content[insert_pos:]
                return content

    # New format: }}; at end of a line (closes LANG block)
    lang_match = re.search(r'const LANG\s*=\s*\{', content)
    if lang_match:
        rest = content[lang_match.start():]
        m = re.search(r'}};', rest)
        if m:
            insert_pos = lang_match.start() + m.start() + len('}};')
            content = content[:insert_pos] + INIT_SPY_RANK + content[insert_pos:]
            return content

    # Fallback: append at end
    content += INIT_SPY_RANK
    return content

def process_file(filepath):
    """Process a single script.js file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if already_injected(content):
        return 'skipped'

    content = inject_lang_keys(content)
    content = inject_function(content)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return 'injected'

def main():
    files = find_script_files()
    print('Found {} script.js files'.format(len(files)))

    injected = 0
    skipped = 0
    errors = []

    for filepath in files:
        try:
            result = process_file(filepath)
            if result == 'injected':
                injected += 1
            else:
                skipped += 1
        except Exception as e:
            errors.append((filepath, str(e)))
            print('ERROR: {} - {}'.format(filepath, e))

    print('\nResults:')
    print('  Injected: {}'.format(injected))
    print('  Skipped (already had rankTitle): {}'.format(skipped))
    print('  Errors: {}'.format(len(errors)))

    if errors:
        for fp, err in errors:
            print('  ERR: {} -> {}'.format(fp, err))

    # Verify 30 random files with node -c
    print('\nVerifying 30 random files with node -c...')
    sample = random.sample(files, min(30, len(files)))
    ok = 0
    fail = 0
    for fp in sample:
        result = subprocess.run(['node', '-c', fp], capture_output=True, text=True)
        if result.returncode == 0:
            ok += 1
        else:
            fail += 1
            short_err = result.stderr.strip().split('\n')[0] if result.stderr else 'unknown'
            print('  FAIL: {} -> {}'.format(os.path.basename(os.path.dirname(fp)), short_err))

    print('Verification: {} OK, {} FAIL out of {}'.format(ok, fail, len(sample)))

if __name__ == '__main__':
    main()
