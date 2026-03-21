#!/usr/bin/env python3
"""
Add Spy Dossier Generator and Personal Leaderboard to all 488 apps in ops-catalog.
Idempotent: skips files that already contain dossierTitle.
Handles both old format (LANG_BASE spread) and new format (inline LANG).
"""

import glob
import os
import re
import random
import subprocess
import sys

CATALOG = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject ──
LANG_EN = (
    "dossierTitle:'Classified Dossier',"
    "dossierStamp:'TOP SECRET',"
    "dossierAgent:'Agent Designation',"
    "dossierMission:'Mission Briefing',"
    "dossierRedacted:'[REDACTED]',"
    "dossierDownload:'Download Dossier',"
    "leaderTitle:'Personal Records',"
    "leaderApps:'Apps Explored',"
    "leaderAccuracy:'Quiz Accuracy',"
    "leaderStreak:'Best Streak',"
    "leaderCategory:'Category Breakdown',"
)

LANG_FR = (
    "dossierTitle:'Dossier Classifi\\x27',"
    "dossierStamp:'ULTRA SECRET',"
    "dossierAgent:'D\\x27signation Agent',"
    "dossierMission:'Briefing Mission',"
    "dossierRedacted:'[CENSUR\\x27]',"
    "dossierDownload:'T\\x27l\\x27charger Dossier',"
    "leaderTitle:'Records Personnels',"
    "leaderApps:'Apps Explor\\x27es',"
    "leaderAccuracy:'Pr\\x27cision Quiz',"
    "leaderStreak:'Meilleure S\\x27rie',"
    "leaderCategory:'R\\x27partition Cat\\x27gories',"
)

LANG_AR = (
    "dossierTitle:'\u0645\u0644\u0641 \u0633\u0631\u064a',"
    "dossierStamp:'\u0633\u0631\u064a \u0644\u0644\u063a\u0627\u064a\u0629',"
    "dossierAgent:'\u062a\u0639\u064a\u064a\u0646 \u0627\u0644\u0639\u0645\u064a\u0644',"
    "dossierMission:'\u0625\u062d\u0627\u0637\u0629 \u0627\u0644\u0645\u0647\u0645\u0629',"
    "dossierRedacted:'[\u0645\u062d\u062c\u0648\u0628]',"
    "dossierDownload:'\u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0645\u0644\u0641',"
    "leaderTitle:'\u0627\u0644\u0633\u062c\u0644\u0627\u062a \u0627\u0644\u0634\u062e\u0635\u064a\u0629',"
    "leaderApps:'\u0627\u0644\u062a\u0637\u0628\u064a\u0642\u0627\u062a \u0627\u0644\u0645\u0633\u062a\u0643\u0634\u0641\u0629',"
    "leaderAccuracy:'\u062f\u0642\u0629 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631',"
    "leaderStreak:'\u0623\u0641\u0636\u0644 \u0633\u0644\u0633\u0644\u0629',"
    "leaderCategory:'\u062a\u0648\u0632\u064a\u0639 \u0627\u0644\u0641\u0626\u0627\u062a',"
)

# ── initSpyDossier + initLeaderboard functions (no backticks!) ──
INIT_FUNCTIONS = r"""
/* ═══════ Spy Dossier ═══════ */
function initSpyDossier(){
 if(document.getElementById('dossierBtn'))return;
 var style=document.createElement('style');
 style.textContent='.dossier-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:20px;box-sizing:border-box;}'
  +'.dossier-doc{background:linear-gradient(135deg,#2c2416 0%,#3d3222 25%,#2c2416 50%,#3d3222 75%,#2c2416 100%);color:#d4c5a0;border:3px double #8b7355;border-radius:4px;padding:32px 28px;max-width:600px;width:95%;font-family:Courier New,monospace;position:relative;box-shadow:0 0 40px rgba(0,0,0,0.8);}'
  +'.dossier-doc .stamp{position:absolute;top:40px;right:30px;font-size:2.2em;font-weight:bold;color:rgba(200,30,30,0.45);transform:rotate(-15deg);border:4px solid rgba(200,30,30,0.45);padding:4px 18px;pointer-events:none;animation:stampIn 0.5s ease-out;}'
  +'@keyframes stampIn{0%{transform:rotate(-15deg) scale(3);opacity:0;}70%{transform:rotate(-15deg) scale(0.95);opacity:1;}100%{transform:rotate(-15deg) scale(1);opacity:1;}}'
  +'.dossier-doc h2{text-align:center;border-bottom:2px solid #8b7355;padding-bottom:10px;margin-bottom:16px;letter-spacing:2px;animation:typeIn 0.8s steps(30);overflow:hidden;white-space:nowrap;}'
  +'@keyframes typeIn{from{width:0;}to{width:100%;}}'
  +'.dossier-doc .d-section{margin:14px 0;padding:10px;border:1px solid #5a4a32;background:rgba(0,0,0,0.15);border-radius:3px;}'
  +'.dossier-doc .d-section h3{margin:0 0 6px;font-size:0.95em;color:#c8a96e;text-transform:uppercase;letter-spacing:1px;}'
  +'.dossier-doc .d-section p{margin:4px 0;font-size:0.88em;line-height:1.5;}'
  +'.dossier-doc .d-redacted{background:#111;color:#111;padding:3px 12px;cursor:pointer;border-radius:2px;margin:6px 0;display:block;transition:color 0.3s;user-select:none;font-size:0.88em;}'
  +'.dossier-doc .d-redacted.revealed{color:#d4c5a0;background:#222;}'
  +'.dossier-doc .d-footer{text-align:center;margin-top:18px;padding-top:10px;border-top:2px solid #8b7355;font-size:0.8em;color:#8b7355;}'
  +'.dossier-doc .d-close{position:absolute;top:8px;right:12px;background:none;border:none;color:#d4c5a0;font-size:1.5em;cursor:pointer;z-index:2;}'
  +'.dossier-doc .d-download{display:block;margin:12px auto 0;background:#5a4a32;color:#d4c5a0;border:1px solid #8b7355;padding:8px 20px;cursor:pointer;border-radius:3px;font-family:inherit;}';
 document.head.appendChild(style);
 function t(k){try{var L=typeof LANG!=='undefined'?LANG:null;if(!L)return k;var c=document.documentElement.lang||localStorage.getItem('lang')||'en';if(L[c]&&L[c][k])return L[c][k];if(L.en&&L.en[k])return L.en[k];return k;}catch(e){return k;}}
 function getAppTitle(){var el=document.querySelector('.main-title')||document.querySelector('h1');if(el)return el.textContent.trim();var tK=t('title');if(tK!=='title')return tK;return document.title||'Unknown App';}
 function getAgentHash(){var p=location.pathname.replace(/[^a-zA-Z0-9]/g,'');var h=0;for(var i=0;i<p.length;i++){h=((h<<5)-h)+p.charCodeAt(i);h=h&h;}return 'AGENT-'+Math.abs(h).toString(16).toUpperCase().substring(0,6);}
 function getMainDesc(){var el=document.querySelector('.main-desc')||document.querySelector('[data-i18n="mainDesc"]');if(el)return el.textContent.trim();var d=t('mainDesc');if(d!=='mainDesc')return d;return 'Mission parameters classified.';}
 function getSliderValues(){var sliders=document.querySelectorAll('input[type=range]');var result=[];for(var i=0;i<sliders.length;i++){var s=sliders[i];var label=s.getAttribute('aria-label')||s.id||('Param-'+(i+1));result.push(label+': '+s.value);}return result;}
 function getNumericDisplays(){var result=[];var els=document.querySelectorAll('.metric-value, .stat-value, [data-metric]');for(var i=0;i<Math.min(els.length,5);i++){result.push(els[i].textContent.trim());}return result;}
 function isSimRunning(){var statusEl=document.querySelector('.status-dot, .status-indicator');if(statusEl){var cls=statusEl.className||'';if(cls.indexOf('active')>=0||cls.indexOf('running')>=0||cls.indexOf('green')>=0)return true;}return false;}
 var spyPhrases=['The owl flies at midnight.','Trust no one.','The fox is in the henhouse.','Rendezvous at coordinates 51.5074 N, 0.1278 W.','Package delivered to dead drop.','Sweep for bugs before proceeding.','Use one-time pad for next transmission.','The eagle has landed.','Maintain radio silence until 0600.'];
 function showDossier(){
  var overlay=document.createElement('div');overlay.className='dossier-overlay';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  var doc=document.createElement('div');doc.className='dossier-doc';
  var closeBtn=document.createElement('button');closeBtn.className='d-close';closeBtn.textContent='\u00D7';closeBtn.onclick=function(){overlay.remove();};
  doc.appendChild(closeBtn);
  var stamp=document.createElement('div');stamp.className='stamp';stamp.textContent=t('dossierStamp');doc.appendChild(stamp);
  var title=document.createElement('h2');title.textContent=t('dossierTitle')+' \u2014 '+getAppTitle();doc.appendChild(title);
  var secAgent=document.createElement('div');secAgent.className='d-section';
  var hAgent=document.createElement('h3');hAgent.textContent=t('dossierAgent');secAgent.appendChild(hAgent);
  var pAgent=document.createElement('p');pAgent.textContent=getAgentHash();secAgent.appendChild(pAgent);doc.appendChild(secAgent);
  var secMission=document.createElement('div');secMission.className='d-section';
  var hMission=document.createElement('h3');hMission.textContent=t('dossierMission');secMission.appendChild(hMission);
  var pMission=document.createElement('p');pMission.textContent=getMainDesc();secMission.appendChild(pMission);doc.appendChild(secMission);
  var sliders=getSliderValues();
  if(sliders.length>0){
   var secParams=document.createElement('div');secParams.className='d-section';
   var hParams=document.createElement('h3');hParams.textContent='Parameters Log';secParams.appendChild(hParams);
   for(var i=0;i<sliders.length;i++){var pp=document.createElement('p');pp.textContent='\u25B8 '+sliders[i];secParams.appendChild(pp);}
   doc.appendChild(secParams);
  }
  var obs=getNumericDisplays();
  if(obs.length>0){
   var secObs=document.createElement('div');secObs.className='d-section';
   var hObs=document.createElement('h3');hObs.textContent='Observations';secObs.appendChild(hObs);
   for(var i=0;i<obs.length;i++){var po=document.createElement('p');po.textContent='\u25C6 '+obs[i];secObs.appendChild(po);}
   doc.appendChild(secObs);
  }
  var secStatus=document.createElement('div');secStatus.className='d-section';
  var hStatus=document.createElement('h3');hStatus.textContent='Status';secStatus.appendChild(hStatus);
  var pStatus=document.createElement('p');pStatus.textContent=isSimRunning()?'MISSION ACTIVE \u25C9':'MISSION COMPLETE \u2713';pStatus.style.fontWeight='bold';pStatus.style.color=isSimRunning()?'#66cc66':'#ccaa44';secStatus.appendChild(pStatus);doc.appendChild(secStatus);
  var secRedacted=document.createElement('div');secRedacted.className='d-section';
  var hRedacted=document.createElement('h3');hRedacted.textContent='Classified Intel';secRedacted.appendChild(hRedacted);
  for(var r=0;r<3;r++){
   var bar=document.createElement('span');bar.className='d-redacted';
   var hidden=spyPhrases[Math.floor(Math.random()*spyPhrases.length)];
   try{var fk=t('funFact');if(fk!=='funFact'&&r===0)hidden=fk;}catch(e){}
   bar.textContent=t('dossierRedacted');bar.setAttribute('data-hidden',hidden);
   bar.onclick=function(){if(this.classList.contains('revealed')){this.classList.remove('revealed');this.textContent=t('dossierRedacted');}else{this.classList.add('revealed');this.textContent=this.getAttribute('data-hidden');}};
   secRedacted.appendChild(bar);
  }
  doc.appendChild(secRedacted);
  var footer=document.createElement('div');footer.className='d-footer';
  var now=new Date();footer.textContent='Workshop-DIY \u2014 Eyes Only \u2014 '+now.toISOString().split('T')[0];doc.appendChild(footer);
  var dlBtn=document.createElement('button');dlBtn.className='d-download';dlBtn.textContent=t('dossierDownload');
  dlBtn.onclick=function(){var pw=window.open('','_blank');if(!pw)return;pw.document.write('<!DOCTYPE html><html><head><title>Dossier</title><style>body{background:#2c2416;color:#d4c5a0;font-family:Courier New,monospace;padding:40px;}h2{text-align:center;border-bottom:2px solid #8b7355;padding-bottom:10px;}.stamp{color:rgba(200,30,30,0.5);font-size:2em;font-weight:bold;text-align:center;transform:rotate(-15deg);margin:20px;}.section{margin:14px 0;padding:10px;border:1px solid #5a4a32;}.footer{text-align:center;margin-top:20px;border-top:2px solid #8b7355;padding-top:10px;font-size:0.8em;color:#8b7355;}@media print{body{background:#fff;color:#333;}.stamp{color:rgba(200,30,30,0.3);}}</style></head><body>');pw.document.write(doc.innerHTML);pw.document.write('</body></html>');pw.document.close();setTimeout(function(){pw.print();},300);};
  doc.appendChild(dlBtn);
  overlay.appendChild(doc);document.body.appendChild(overlay);
 }
 var btn=document.createElement('button');btn.id='dossierBtn';btn.className='btn-icon-only';
 btn.title=t('dossierTitle');btn.textContent='\uD83D\uDCC4';
 btn.onclick=showDossier;
 var hdr=document.querySelector('.header-buttons');if(hdr)hdr.appendChild(btn);
}
initSpyDossier();

/* ═══════ Personal Leaderboard ═══════ */
function initLeaderboard(){
 if(document.getElementById('leaderboardBtn'))return;
 var style=document.createElement('style');
 style.textContent='.leader-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.88);z-index:99999;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:20px;box-sizing:border-box;}'
  +'.leader-popup{background:#1a1a2e;color:#e0e0e0;border-radius:16px;padding:28px 26px;max-width:420px;width:95%;box-shadow:0 8px 32px rgba(0,0,0,0.6);font-family:inherit;position:relative;}'
  +'.leader-popup h2{margin:0 0 16px;font-size:1.3em;text-align:center;}'
  +'.leader-popup .lr-close{position:absolute;top:8px;right:14px;background:none;border:none;color:#e0e0e0;font-size:1.4em;cursor:pointer;}'
  +'.leader-popup .lr-stat{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #2a2a4a;}'
  +'.leader-popup .lr-stat .lr-label{color:#aaa;}'
  +'.leader-popup .lr-stat .lr-value{font-weight:bold;color:#66ccff;}'
  +'.leader-popup .lr-rank-bar{margin:14px 0;}'
  +'.leader-popup .lr-rank-bar .lr-bar-bg{height:10px;background:#2a2a4a;border-radius:5px;overflow:hidden;margin-top:4px;}'
  +'.leader-popup .lr-rank-bar .lr-bar-fill{height:100%;background:linear-gradient(90deg,#4488cc,#66ccff);border-radius:5px;transition:width 0.5s;}'
  +'.leader-popup .lr-section-title{margin:14px 0 8px;font-size:0.95em;color:#8888cc;}'
  +'.leader-popup .lr-records{font-size:0.85em;padding:6px 0;}'
  +'.leader-popup .lr-records div{padding:3px 0;}';
 document.head.appendChild(style);
 function t(k){try{var L=typeof LANG!=='undefined'?LANG:null;if(!L)return k;var c=document.documentElement.lang||localStorage.getItem('lang')||'en';if(L[c]&&L[c][k])return L[c][k];if(L.en&&L.en[k])return L.en[k];return k;}catch(e){return k;}}
 function gatherStats(){
  var visited=0,quizTotal=0,quizCount=0,fastest=Infinity,streak=0,stickers=0,cats={};
  try{
   for(var i=0;i<localStorage.length;i++){
    var key=localStorage.key(i);
    if(key.indexOf('rank_visited_')===0){visited++;var parts=key.split('_');if(parts.length>=3){var cat=parts[2]||'other';cats[cat]=(cats[cat]||0)+1;}}
    if(key.indexOf('quiz_score_')===0){quizCount++;quizTotal+=parseInt(localStorage.getItem(key))||0;}
    if(key.indexOf('mission_time_')===0){var mt=parseInt(localStorage.getItem(key))||0;if(mt>0&&mt<fastest)fastest=mt;}
   }
   streak=parseInt(localStorage.getItem('daily_streak'))||0;
   stickers=parseInt(localStorage.getItem('kidsStickers'))||0;
  }catch(e){}
  if(fastest===Infinity)fastest=0;
  var accuracy=quizCount>0?Math.round(quizTotal/quizCount)+'%':'N/A';
  return{visited:visited,accuracy:accuracy,fastest:fastest,streak:streak,stickers:stickers,cats:cats};
 }
 function getRank(visited){
  var ranks=[{name:'Recruit',emoji:'\uD83D\uDD30',min:0},{name:'Agent',emoji:'\uD83D\uDD75\uFE0F',min:5},{name:'Special Agent',emoji:'\u2B50',min:15},{name:'Commander',emoji:'\uD83C\uDF96\uFE0F',min:30},{name:'Director',emoji:'\uD83D\uDC51',min:50}];
  var current=ranks[0];var next=ranks[1];
  for(var i=ranks.length-1;i>=0;i--){if(visited>=ranks[i].min){current=ranks[i];next=ranks[i+1]||null;break;}}
  return{current:current,next:next};
 }
 function drawPie(canvas,cats){
  var ctx=canvas.getContext('2d');var w=canvas.width;var h=canvas.height;var cx=w/2;var cy=h/2;var r=Math.min(cx,cy)-10;
  var keys=Object.keys(cats);if(keys.length===0){ctx.fillStyle='#444';ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText('No data yet',cx,cy);return;}
  var total=0;for(var i=0;i<keys.length;i++)total+=cats[keys[i]];
  var colors=['#4488cc','#cc6644','#44cc66','#cc44aa','#cccc44','#44cccc','#8866cc','#cc8844','#6688cc','#88cc44'];
  var startAngle=-Math.PI/2;
  for(var i=0;i<keys.length;i++){
   var slice=cats[keys[i]]/total*Math.PI*2;
   ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,startAngle,startAngle+slice);ctx.closePath();
   ctx.fillStyle=colors[i%colors.length];ctx.fill();
   var mid=startAngle+slice/2;var lx=cx+Math.cos(mid)*(r*0.65);var ly=cy+Math.sin(mid)*(r*0.65);
   if(slice>0.3){ctx.fillStyle='#fff';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText(keys[i].substring(0,8),lx,ly);}
   startAngle+=slice;
  }
 }
 function showLeaderboard(){
  var stats=gatherStats();var rank=getRank(stats.visited);
  var overlay=document.createElement('div');overlay.className='leader-overlay';
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  var popup=document.createElement('div');popup.className='leader-popup';
  var closeBtn=document.createElement('button');closeBtn.className='lr-close';closeBtn.textContent='\u00D7';closeBtn.onclick=function(){overlay.remove();};
  popup.appendChild(closeBtn);
  var titleEl=document.createElement('h2');titleEl.textContent='\uD83C\uDFC6 '+t('leaderTitle');popup.appendChild(titleEl);
  var rows=[
   [t('leaderApps'),stats.visited],
   [t('leaderAccuracy'),stats.accuracy],
   ['Fastest Mission',stats.fastest>0?stats.fastest+'s':'\u2014'],
   [t('leaderStreak'),stats.streak],
   ['Total Stickers',stats.stickers]
  ];
  for(var i=0;i<rows.length;i++){
   var row=document.createElement('div');row.className='lr-stat';
   var lbl=document.createElement('span');lbl.className='lr-label';lbl.textContent=rows[i][0];
   var val=document.createElement('span');val.className='lr-value';val.textContent=rows[i][1];
   row.appendChild(lbl);row.appendChild(val);popup.appendChild(row);
  }
  var rankDiv=document.createElement('div');rankDiv.className='lr-rank-bar';
  var rankLabel=document.createElement('div');rankLabel.textContent=rank.current.emoji+' '+rank.current.name+(rank.next?' \u2192 '+rank.next.emoji+' '+rank.next.name:'');rankLabel.style.fontSize='0.9em';
  rankDiv.appendChild(rankLabel);
  var barBg=document.createElement('div');barBg.className='lr-bar-bg';
  var barFill=document.createElement('div');barFill.className='lr-bar-fill';
  var pct=0;
  if(rank.next){pct=Math.min(100,Math.round((stats.visited-rank.current.min)/(rank.next.min-rank.current.min)*100));}else{pct=100;}
  barFill.style.width=pct+'%';barBg.appendChild(barFill);rankDiv.appendChild(barBg);popup.appendChild(rankDiv);
  var catTitle=document.createElement('div');catTitle.className='lr-section-title';catTitle.textContent=t('leaderCategory');popup.appendChild(catTitle);
  var canvas=document.createElement('canvas');canvas.width=300;canvas.height=200;canvas.style.cssText='display:block;margin:0 auto;';
  popup.appendChild(canvas);
  drawPie(canvas,stats.cats);
  var recTitle=document.createElement('div');recTitle.className='lr-section-title';recTitle.textContent='Personal Best';popup.appendChild(recTitle);
  var recDiv=document.createElement('div');recDiv.className='lr-records';
  var recItems=['\u2605 Apps: '+stats.visited,'\u2605 Streak: '+stats.streak,'\u2605 Stickers: '+stats.stickers];
  for(var i=0;i<recItems.length;i++){var rd=document.createElement('div');rd.textContent=recItems[i];recDiv.appendChild(rd);}
  popup.appendChild(recDiv);
  overlay.appendChild(popup);document.body.appendChild(overlay);
 }
 var btn=document.createElement('button');btn.id='leaderboardBtn';btn.className='btn-icon-only';
 btn.title=t('leaderTitle');btn.textContent='\uD83C\uDFC6';
 btn.onclick=showLeaderboard;
 var hdr=document.querySelector('.header-buttons');if(hdr)hdr.appendChild(btn);
}
initLeaderboard();
"""


def find_script_files():
    """Find all script.js files matching [0-9]*-*/*/script.js"""
    pattern = os.path.join(CATALOG, '[0-9]*-*', '*', 'script.js')
    return sorted(glob.glob(pattern))


def already_injected(content):
    """Check if dossierTitle key already exists"""
    return 'dossierTitle' in content


def inject_lang_keys_old_format(content):
    """Old format: has ...LANG_BASE.en, / ...LANG_BASE.fr, / ...LANG_BASE.ar, on separate lines."""
    content = content.replace('...LANG_BASE.en,', '...LANG_BASE.en,' + LANG_EN, 1)
    content = content.replace('...LANG_BASE.fr,', '...LANG_BASE.fr,' + LANG_FR, 1)
    content = content.replace('...LANG_BASE.ar,', '...LANG_BASE.ar,' + LANG_AR, 1)
    return content


def inject_lang_keys_new_format(content):
    """New format: uses },fr:{ / },ar:{ / }}; boundaries inline."""
    # For new format we need regex but must escape replacement strings
    en_repl = (',' + LANG_EN + '},fr:{').replace('\\', '\\\\')
    content = re.sub(
        r'},\s*fr:\s*\{',
        en_repl,
        content,
        count=1
    )
    fr_repl = (',' + LANG_FR + '},ar:{').replace('\\', '\\\\')
    content = re.sub(
        r'},\s*ar:\s*\{',
        fr_repl,
        content,
        count=1
    )
    ar_repl = (',' + LANG_AR + '}};').replace('\\', '\\\\')
    # Find the }}; that closes LANG after ar section
    lang_match = re.search(r'const LANG\s*=\s*\{', content)
    if lang_match:
        rest = content[lang_match.start():]
        m = re.search(r'}};', rest)
        if m:
            pos = lang_match.start() + m.start()
            content = content[:pos] + ',' + LANG_AR + '}};' + content[pos + len('}};'):]
    return content


def inject_function(content):
    """Inject initSpyDossier() and initLeaderboard() after the LANG block closing."""
    # Old format: }; on its own line after ar section
    if re.search(r'\.\.\.LANG_BASE\.ar', content):
        ar_match = re.search(r'\.\.\.LANG_BASE\.ar', content)
        if ar_match:
            rest = content[ar_match.start():]
            m = re.search(r'\n};(\s*\n)', rest)
            if m:
                insert_pos = ar_match.start() + m.start() + len('\n};')
                content = content[:insert_pos] + INIT_FUNCTIONS + content[insert_pos:]
                return content

    # New format: }}; at end of a line
    lang_match = re.search(r'const LANG\s*=\s*\{', content)
    if lang_match:
        rest = content[lang_match.start():]
        m = re.search(r'}};', rest)
        if m:
            insert_pos = lang_match.start() + m.start() + len('}};')
            content = content[:insert_pos] + INIT_FUNCTIONS + content[insert_pos:]
            return content

    # Fallback: just append at the end
    content += INIT_FUNCTIONS
    return content


def process_file(filepath):
    """Process a single script.js file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if already_injected(content):
        return 'skipped'

    # Determine format and inject LANG keys
    has_lang_base_spread = '...LANG_BASE.en,' in content

    if has_lang_base_spread:
        fr_on_own_line = re.search(r'^\s*fr:\s*\{', content, re.MULTILINE)
        if fr_on_own_line:
            content = inject_lang_keys_old_format(content)
        else:
            # Has spread but fr is inline — still use old format injection
            content = inject_lang_keys_old_format(content)
    else:
        content = inject_lang_keys_new_format(content)

    # Inject functions
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
    print('  Skipped (already had dossierTitle): {}'.format(skipped))
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
            print('  FAIL: {} -> {}'.format(fp, result.stderr.strip()))

    print('Verification: {} OK, {} FAIL out of {}'.format(ok, fail, len(sample)))


if __name__ == '__main__':
    main()
