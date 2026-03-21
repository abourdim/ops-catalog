#!/usr/bin/env python3
"""
Add two features to all 488 ops-catalog apps:
  1. Matrix Rain Background (toggle button)
  2. App Rating System (5-star near title)

Also creates two standalone pages:
  - periodic-table.html
  - split.html

Idempotent: checks for 'matrixTitle' before modifying.
"""

import os
import re
import glob
import random
import subprocess
import sys
import json

BASE = os.path.dirname(os.path.abspath(__file__))


# ── LANG keys to inject ──────────────────────────────────────

def make_lang_en():
    return (
        "matrixTitle:'Matrix Rain',"
        "matrixOn:'Matrix ON',"
        "matrixOff:'Matrix OFF',"
        "ratingTitle:'Rate this app',"
        "ratingYours:'You rated',"
        "ratingThanks:'Thanks for rating!',"
    )


def make_lang_fr():
    return (
        "matrixTitle:'Pluie Matrix',"
        "matrixOn:'Matrix ACTIV\\x27',"
        "matrixOff:'Matrix D\\x27SACTIV\\x27',"
        "ratingTitle:'Noter cette appli',"
        "ratingYours:'Votre note',"
        "ratingThanks:'Merci pour votre note !',"
    )


def make_lang_ar():
    return (
        "matrixTitle:'\u0645\u0637\u0631 \u0627\u0644\u0645\u0627\u062a\u0631\u064a\u0643\u0633',"
        "matrixOn:'\u0627\u0644\u0645\u0627\u062a\u0631\u064a\u0643\u0633 \u0645\u0641\u0639\u0644',"
        "matrixOff:'\u0627\u0644\u0645\u0627\u062a\u0631\u064a\u0643\u0633 \u0645\u0639\u0637\u0644',"
        "ratingTitle:'\u0642\u064a\u0651\u0645 \u0647\u0630\u0627 \u0627\u0644\u062a\u0637\u0628\u064a\u0642',"
        "ratingYours:'\u062a\u0642\u064a\u064a\u0645\u0643',"
        "ratingThanks:'\u0634\u0643\u0631\u0627 \u0639\u0644\u0649 \u0627\u0644\u062a\u0642\u064a\u064a\u0645!',"
    )


# ── JS functions to inject ────────────────────────────────────

JS_FUNCTIONS = r"""
/* === MATRIX RAIN BACKGROUND === */
function initMatrixRain(){
 if(document.getElementById('matrixRainBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var STORAGE_KEY='matrixRain_'+location.pathname;
 var canvas=null;var ctx=null;var animId=null;var active=false;
 var columns=[];var fontSize=14;var drops=[];
 var KATAKANA='\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F2\u30F3';
 var LATIN='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 var DIGITS='0123456789';
 var charPool=KATAKANA+LATIN+DIGITS;
 var kw=document.querySelector('meta[name="keywords"]');
 if(kw&&kw.content)charPool+=kw.content.replace(/[\s,]+/g,'').toUpperCase();
 var matrixBtn=document.createElement('button');matrixBtn.id='matrixRainBtn';matrixBtn.className='btn-icon-only';
 matrixBtn.textContent='\u25C9';matrixBtn.title=L.matrixTitle||'Matrix Rain';matrixBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(matrixBtn);else{matrixBtn.style.cssText+='position:fixed;top:0.5rem;right:12rem;z-index:9999;';document.body.appendChild(matrixBtn);}
 function createCanvas(){
  canvas=document.createElement('canvas');canvas.id='matrixRainCanvas';
  canvas.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.insertBefore(canvas,document.body.firstChild);
  ctx=canvas.getContext('2d');resize();
 }
 function resize(){
  if(!canvas)return;canvas.width=window.innerWidth;canvas.height=window.innerHeight;
  var cols=Math.floor(canvas.width/fontSize);drops=[];
  for(var i=0;i<cols;i++)drops[i]=Math.random()*canvas.height/fontSize|0;
 }
 function draw(){
  if(!canvas||!ctx)return;
  ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#00ff41';ctx.font=fontSize+'px monospace';
  for(var i=0;i<drops.length;i++){
   var ch=charPool[Math.floor(Math.random()*charPool.length)];
   var x=i*fontSize;var y=drops[i]*fontSize;
   ctx.globalAlpha=0.6+Math.random()*0.4;
   ctx.fillText(ch,x,y);
   if(y>canvas.height&&Math.random()>0.975)drops[i]=0;
   drops[i]++;
  }
  ctx.globalAlpha=1;
  animId=requestAnimationFrame(draw);
 }
 function start(){
  active=true;createCanvas();draw();
  matrixBtn.style.background='#00ff41';matrixBtn.style.color='#000';matrixBtn.style.borderRadius='6px';
  try{localStorage.setItem(STORAGE_KEY,'1');}catch(e){}
 }
 function stop(){
  active=false;if(animId)cancelAnimationFrame(animId);animId=null;
  if(canvas){canvas.remove();canvas=null;ctx=null;}
  matrixBtn.style.background='';matrixBtn.style.color='';matrixBtn.style.borderRadius='';
  try{localStorage.removeItem(STORAGE_KEY);}catch(e){}
 }
 matrixBtn.onclick=function(){if(active)stop();else start();};
 window.addEventListener('resize',function(){if(active)resize();});
 try{if(localStorage.getItem(STORAGE_KEY)==='1')start();}catch(e){}
}

/* === APP RATING SYSTEM === */
function initRating(){
 if(document.getElementById('appRatingWrap'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var appPath=location.pathname.replace(/\/index\.html$/,'').replace(/\/$/,'');
 var STORAGE_KEY='appRating_'+appPath;
 var INDEX_KEY='ratingsIndex';
 var wrap=document.createElement('div');wrap.id='appRatingWrap';
 wrap.style.cssText='display:flex;align-items:center;gap:8px;margin:4px 0;flex-wrap:wrap;';
 var starsWrap=document.createElement('span');starsWrap.style.cssText='display:inline-flex;gap:2px;cursor:pointer;';
 var msgSpan=document.createElement('span');msgSpan.style.cssText='font-size:0.75rem;color:var(--accent,#c8aa64);opacity:0.8;';
 var currentRating=0;
 try{currentRating=parseInt(localStorage.getItem(STORAGE_KEY))||0;}catch(e){}
 var stars=[];
 for(var i=1;i<=5;i++){
  (function(idx){
   var star=document.createElement('span');
   star.textContent=idx<=currentRating?'\u2605':'\u2606';
   star.style.cssText='font-size:1.2rem;color:'+(idx<=currentRating?'#ffd700':'#888')+';transition:color 0.2s;user-select:none;';
   star.onmouseenter=function(){for(var j=0;j<5;j++){stars[j].style.color=j<idx?'#ffd700':'#888';stars[j].textContent=j<idx?'\u2605':'\u2606';}};
   star.onclick=function(){
    currentRating=idx;
    try{localStorage.setItem(STORAGE_KEY,String(idx));
     var index={};try{index=JSON.parse(localStorage.getItem(INDEX_KEY)||'{}');}catch(e){}
     index[appPath]=idx;localStorage.setItem(INDEX_KEY,JSON.stringify(index));
    }catch(e){}
    for(var j=0;j<5;j++){stars[j].style.color=j<idx?'#ffd700':'#888';stars[j].textContent=j<idx?'\u2605':'\u2606';}
    msgSpan.textContent=(L.ratingYours||'You rated')+': '+idx+'/5';
   };
   stars.push(star);starsWrap.appendChild(star);
  })(i);
 }
 starsWrap.onmouseleave=function(){for(var j=0;j<5;j++){stars[j].style.color=j<currentRating?'#ffd700':'#888';stars[j].textContent=j<currentRating?'\u2605':'\u2606';}};
 wrap.appendChild(starsWrap);
 if(currentRating>0)msgSpan.textContent=(L.ratingYours||'You rated')+': '+currentRating+'/5';
 wrap.appendChild(msgSpan);
 var titleEl=document.querySelector('.main-title')||document.querySelector('h1')||document.querySelector('.app-title');
 if(titleEl&&titleEl.parentNode)titleEl.parentNode.insertBefore(wrap,titleEl.nextSibling);
 else{wrap.style.cssText+='position:fixed;top:3rem;left:1rem;z-index:9999;';document.body.appendChild(wrap);}
}
document.addEventListener('DOMContentLoaded',function(){try{initMatrixRain();}catch(e){console.warn('Matrix init:',e);}try{initRating();}catch(e){console.warn('Rating init:',e);}});
"""


def process_file(filepath):
    """Process a single script.js file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Idempotency check
    if 'matrixTitle' in content:
        return False

    lang_en = make_lang_en()
    lang_fr = make_lang_fr()
    lang_ar = make_lang_ar()

    # Check for LANG_BASE spread format (old format)
    en_pattern = '...LANG_BASE.en,'
    fr_pattern = '...LANG_BASE.fr,'
    ar_pattern = '...LANG_BASE.ar,'

    if en_pattern in content:
        content = content.replace(en_pattern, en_pattern + lang_en, 1)
        if fr_pattern in content:
            content = content.replace(fr_pattern, fr_pattern + lang_fr, 1)
        if ar_pattern in content:
            content = content.replace(ar_pattern, ar_pattern + lang_ar, 1)
    else:
        # New format: inline LANG without LANG_BASE
        lang_pos = content.find('const LANG')
        if lang_pos == -1:
            print(f"  WARNING: No LANG block found in {filepath}")
            return False

        # Inject after en:{
        en_match = re.search(r'(en\s*:\s*\{)', content[lang_pos:])
        if en_match:
            ins_pos = lang_pos + en_match.end()
            content = content[:ins_pos] + lang_en + content[ins_pos:]

        # Inject into fr block
        fr_match = re.search(r'(\},\s*\n?\s*fr\s*:\s*\{)', content)
        if fr_match:
            ins_pos = fr_match.end()
            content = content[:ins_pos] + lang_fr + content[ins_pos:]

        # Inject into ar block
        ar_match = re.search(r'(\},\s*\n?\s*ar\s*:\s*\{)', content)
        if ar_match:
            ins_pos = ar_match.end()
            content = content[:ins_pos] + lang_ar + content[ins_pos:]

    # Find the LANG block closing }; using brace counting
    lang_start = content.find('const LANG')
    if lang_start == -1:
        print(f"  WARNING: No LANG block found in {filepath}")
        return False

    brace_start = content.index('{', lang_start)
    brace_depth = 0
    in_string = False
    string_char = None
    pos = brace_start

    while pos < len(content):
        ch = content[pos]
        if in_string:
            if ch == '\\':
                pos += 2
                continue
            if ch == string_char:
                in_string = False
        else:
            if ch in ("'", '"', '`'):
                in_string = True
                string_char = ch
            elif ch == '{':
                brace_depth += 1
            elif ch == '}':
                brace_depth -= 1
                if brace_depth == 0:
                    end_pos = pos + 1
                    while end_pos < len(content) and content[end_pos] in (' ', '\t'):
                        end_pos += 1
                    if end_pos < len(content) and content[end_pos] == ';':
                        end_pos += 1
                    content = content[:end_pos] + '\n' + JS_FUNCTIONS + '\n' + content[end_pos:]
                    break
        pos += 1

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return True


# ── Standalone pages ──────────────────────────────────────────

def create_periodic_table():
    """Create periodic-table.html"""
    html = r'''<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Periodic Table of Apps — Workshop DIY</title>
<link href="https://fonts.googleapis.com/css2?family=Righteous&family=Orbitron:wght@400;700&family=Share+Tech+Mono&family=Tajawal:wght@400;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{min-height:100vh;background:#06080f;font-family:'Share Tech Mono',monospace;color:#e0d8c8}
#topBar{position:sticky;top:0;z-index:100;background:rgba(6,8,15,0.95);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid rgba(200,168,78,0.2)}
#topBar h1{font-family:'Righteous',sans-serif;color:#c8a84e;font-size:18px;letter-spacing:2px}
#controls{display:flex;gap:10px;align-items:center}
#searchBox{background:rgba(255,255,255,0.06);border:1px solid rgba(200,168,78,0.3);border-radius:6px;padding:6px 12px;color:#e0d8c8;font-family:'Share Tech Mono',monospace;font-size:13px;width:200px}
#searchBox::placeholder{color:#888}
#langBtns button{background:transparent;border:1px solid transparent;color:#c8a84e88;font-family:'Orbitron',sans-serif;font-size:10px;padding:3px 8px;border-radius:4px;cursor:pointer;transition:.2s}
#langBtns button.active{border-color:#c8a84e;color:#c8a84e;background:rgba(200,168,78,0.12)}
#legend{display:flex;flex-wrap:wrap;gap:6px;padding:10px 20px;justify-content:center}
.legend-item{display:flex;align-items:center;gap:4px;font-size:11px;color:#aaa}
.legend-dot{width:10px;height:10px;border-radius:2px}
#grid{display:flex;flex-wrap:wrap;gap:6px;padding:20px;justify-content:center;max-width:1600px;margin:0 auto}
.element{width:80px;height:90px;border-radius:6px;padding:5px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:transform .15s,box-shadow .15s;position:relative;border:1px solid rgba(255,255,255,0.08);overflow:hidden}
.element:hover{transform:scale(1.15);box-shadow:0 0 20px rgba(200,168,78,0.4);z-index:10}
.element .atomic{font-family:'Orbitron',sans-serif;font-size:9px;color:rgba(255,255,255,0.5);position:absolute;top:3px;left:5px}
.element .symbol{font-family:'Orbitron',sans-serif;font-size:18px;font-weight:700;color:#fff;text-shadow:0 0 8px rgba(255,255,255,0.2)}
.element .elname{font-size:8px;color:rgba(255,255,255,0.7);text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:100%;margin-top:2px}
.element.hidden{display:none}
#popup{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#0b0d24;border:2px solid #c8a84e;border-radius:14px;padding:24px;z-index:200;max-width:400px;width:90%;text-align:center}
#popupOverlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:199}
#popup h3{font-family:'Righteous',sans-serif;color:#c8a84e;margin-bottom:6px;font-size:20px}
#popup .cat{font-family:'Orbitron',sans-serif;font-size:11px;color:#888;margin-bottom:8px}
#popup .desc{font-size:13px;color:#bbb;line-height:1.5;margin-bottom:14px}
#popup .openBtn{display:inline-block;background:#c8a84e;color:#06080f;font-family:'Orbitron',sans-serif;font-size:12px;font-weight:700;padding:8px 24px;border-radius:6px;text-decoration:none;border:none;cursor:pointer;transition:.2s}
#popup .openBtn:hover{background:#e0c06e;transform:scale(1.05)}
#popup .closeBtn{position:absolute;top:10px;right:14px;background:none;border:none;color:#888;font-size:18px;cursor:pointer}
#count{text-align:center;padding:8px;font-size:12px;color:#888}
</style>
</head>
<body>
<div id="topBar">
 <h1 id="pageTitle">Periodic Table of Apps</h1>
 <div id="controls">
  <input type="text" id="searchBox" placeholder="Search apps...">
  <div id="langBtns">
   <button class="active" data-lang="en">EN</button>
   <button data-lang="fr">FR</button>
   <button data-lang="ar">AR</button>
  </div>
 </div>
</div>
<div id="legend"></div>
<div id="count"></div>
<div id="grid"></div>
<div id="popupOverlay" onclick="closePopup()"></div>
<div id="popup">
 <button class="closeBtn" onclick="closePopup()">&times;</button>
 <h3 id="popTitle"></h3>
 <div class="cat" id="popCat"></div>
 <div class="desc" id="popDesc"></div>
 <a class="openBtn" id="popOpen" href="#">Open App</a>
</div>
<script>
var TITLES={
 en:{pageTitle:'Periodic Table of Apps',search:'Search apps...',open:'Open App'},
 fr:{pageTitle:'Tableau P\u00e9riodique des Apps',search:'Chercher des apps...',open:'Ouvrir'},
 ar:{pageTitle:'\u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u062f\u0648\u0631\u064a \u0644\u0644\u062a\u0637\u0628\u064a\u0642\u0627\u062a',search:'\u0628\u062d\u062b...',open:'\u0641\u062a\u062d'}
};
var COLORS=['#e74c3c','#e67e22','#f1c40f','#2ecc71','#1abc9c','#3498db','#9b59b6','#e84393','#00cec9','#6c5ce7','#fd79a8','#00b894','#fdcb6e','#74b9ff','#a29bfe','#fab1a0','#55efc4','#81ecec','#dfe6e9','#636e72','#2d3436','#b2bec3','#d63031','#0984e3','#6c5ce7'];
var apps=[];var categories=[];var catColors={};var currentLang='en';

function makeSymbol(title){
 var w=title.replace(/[^a-zA-Z0-9]/g,'');
 if(w.length===0)w='Xx';
 if(w.length===1)return w.toUpperCase();
 return w[0].toUpperCase()+w[1].toLowerCase();
}

function loadApps(){
 fetch('search-index.json').then(function(r){return r.json();}).then(function(data){
  apps=data;
  var catSet={};
  apps.forEach(function(a){if(!catSet[a.cat]){catSet[a.cat]=true;categories.push(a.cat);}});
  categories.sort();
  categories.forEach(function(c,i){catColors[c]=COLORS[i%COLORS.length];});
  renderLegend();renderGrid();updateCount();
 }).catch(function(err){
  document.getElementById('grid').innerHTML='<p style="color:#e74c3c;padding:40px;">Failed to load search-index.json. Make sure this file is served over HTTP or place it alongside this page.</p>';
 });
}

function renderLegend(){
 var el=document.getElementById('legend');el.innerHTML='';
 categories.forEach(function(c){
  var d=document.createElement('div');d.className='legend-item';
  d.innerHTML='<span class="legend-dot" style="background:'+catColors[c]+'"></span>'+c;
  el.appendChild(d);
 });
}

function renderGrid(){
 var g=document.getElementById('grid');g.innerHTML='';
 apps.forEach(function(a,idx){
  var el=document.createElement('div');el.className='element';
  el.style.background='linear-gradient(135deg,'+catColors[a.cat]+'22,'+catColors[a.cat]+'08)';
  el.style.borderColor=catColors[a.cat]+'44';
  el.setAttribute('data-title',(a.title||'').toLowerCase());
  el.setAttribute('data-keywords',(a.keywords||'').toLowerCase());
  el.setAttribute('data-cat',(a.cat||'').toLowerCase());
  el.setAttribute('data-idx',idx);
  el.innerHTML='<span class="atomic">'+(idx+1)+'</span><span class="symbol" style="color:'+catColors[a.cat]+'">'+makeSymbol(a.title)+'</span><span class="elname">'+truncate(a.title,10)+'</span>';
  el.title=a.title+' \u2014 '+a.desc;
  el.onclick=function(){showPopup(idx);};
  g.appendChild(el);
 });
}

function truncate(s,n){return s.length>n?s.substring(0,n)+'\u2026':s;}

function showPopup(idx){
 var a=apps[idx];if(!a)return;
 var T=TITLES[currentLang]||TITLES.en;
 document.getElementById('popTitle').textContent=a.title;
 document.getElementById('popCat').textContent=a.cat;
 document.getElementById('popDesc').textContent=a.desc;
 document.getElementById('popOpen').textContent=T.open;
 document.getElementById('popOpen').href=a.path;
 document.getElementById('popup').style.display='block';
 document.getElementById('popupOverlay').style.display='block';
}
function closePopup(){
 document.getElementById('popup').style.display='none';
 document.getElementById('popupOverlay').style.display='none';
}

function updateCount(){
 var visible=document.querySelectorAll('.element:not(.hidden)').length;
 document.getElementById('count').textContent=visible+' / '+apps.length+' apps';
}

document.getElementById('searchBox').addEventListener('input',function(){
 var q=this.value.toLowerCase().trim();
 document.querySelectorAll('.element').forEach(function(el){
  if(!q){el.classList.remove('hidden');return;}
  var t=el.getAttribute('data-title')+' '+el.getAttribute('data-keywords')+' '+el.getAttribute('data-cat');
  el.classList.toggle('hidden',t.indexOf(q)===-1);
 });
 updateCount();
});

document.querySelectorAll('#langBtns button').forEach(function(btn){
 btn.onclick=function(){
  currentLang=btn.getAttribute('data-lang');
  document.querySelectorAll('#langBtns button').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  var T=TITLES[currentLang]||TITLES.en;
  document.getElementById('pageTitle').textContent=T.pageTitle;
  document.getElementById('searchBox').placeholder=T.search;
  if(currentLang==='ar'){document.documentElement.dir='rtl';document.documentElement.lang='ar';}
  else{document.documentElement.dir='ltr';document.documentElement.lang=currentLang;}
 };
});

document.addEventListener('keydown',function(e){if(e.key==='Escape')closePopup();});
loadApps();
</script>
</body>
</html>'''
    path = os.path.join(BASE, 'periodic-table.html')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"  Created: periodic-table.html")


def create_split_viewer():
    """Create split.html"""
    html = r'''<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Split Viewer — Workshop DIY</title>
<link href="https://fonts.googleapis.com/css2?family=Righteous&family=Orbitron:wght@400;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{height:100%;overflow:hidden;background:#06080f;font-family:'Share Tech Mono',monospace;color:#e0d8c8}
#toolbar{height:44px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;background:rgba(6,8,15,0.95);border-bottom:1px solid rgba(200,168,78,0.2);z-index:100;position:relative}
#toolbar h1{font-family:'Righteous',sans-serif;color:#c8a84e;font-size:15px;letter-spacing:1px}
#toolbar .actions{display:flex;gap:8px;align-items:center}
#toolbar button{background:rgba(200,168,78,0.15);border:1px solid rgba(200,168,78,0.3);color:#c8a84e;font-family:'Orbitron',sans-serif;font-size:10px;padding:4px 10px;border-radius:5px;cursor:pointer;transition:.2s}
#toolbar button:hover{background:rgba(200,168,78,0.3)}
#splitWrap{display:flex;height:calc(100vh - 44px);position:relative}
.pane{flex:1;display:flex;flex-direction:column;min-width:60px;overflow:hidden}
.pane-header{height:36px;display:flex;align-items:center;gap:6px;padding:0 8px;background:rgba(0,0,0,0.3);border-bottom:1px solid rgba(200,168,78,0.15)}
.pane-header select{flex:1;background:#0b0d24;border:1px solid rgba(200,168,78,0.3);color:#e0d8c8;font-family:'Share Tech Mono',monospace;font-size:11px;padding:3px 6px;border-radius:4px}
.pane-header button{background:none;border:1px solid rgba(200,168,78,0.2);color:#c8a84e;font-size:12px;padding:2px 8px;border-radius:4px;cursor:pointer}
.pane-header button:hover{background:rgba(200,168,78,0.15)}
.pane iframe{flex:1;border:none;background:#fff;width:100%;height:100%}
#divider{width:6px;background:rgba(200,168,78,0.2);cursor:col-resize;flex-shrink:0;position:relative;z-index:10;transition:background .2s}
#divider:hover,#divider.active{background:#c8a84e}
#divider::after{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:2px;height:30px;background:rgba(200,168,78,0.5);border-radius:1px}
.pane.fullscreen{position:fixed;top:0;left:0;width:100%!important;height:100%!important;z-index:200}
.pane.fullscreen .pane-header{position:absolute;top:0;left:0;right:0;z-index:1;background:rgba(0,0,0,0.7)}
.pane.fullscreen iframe{position:absolute;top:36px;left:0;right:0;bottom:0;height:calc(100% - 36px)}
</style>
</head>
<body>
<div id="toolbar">
 <h1>Split Viewer</h1>
 <div class="actions">
  <button id="swapBtn" title="Swap panes">&#8644; Swap</button>
  <button id="resetBtn" title="Reset split">Reset</button>
 </div>
</div>
<div id="splitWrap">
 <div class="pane" id="paneL">
  <div class="pane-header">
   <select id="selL"><option value="">-- Select App --</option></select>
   <button class="fsBtn" data-pane="paneL" title="Fullscreen">&#x26F6;</button>
  </div>
  <iframe id="frameL" src="about:blank"></iframe>
 </div>
 <div id="divider"></div>
 <div class="pane" id="paneR">
  <div class="pane-header">
   <select id="selR"><option value="">-- Select App --</option></select>
   <button class="fsBtn" data-pane="paneR" title="Fullscreen">&#x26F6;</button>
  </div>
  <iframe id="frameR" src="about:blank"></iframe>
 </div>
</div>
<script>
var apps=[];
function loadApps(){
 fetch('search-index.json').then(function(r){return r.json();}).then(function(data){
  apps=data;populateSelects();
 }).catch(function(){
  /* fallback for file:// — try XMLHttpRequest */
  var xhr=new XMLHttpRequest();xhr.open('GET','search-index.json',true);
  xhr.onload=function(){if(xhr.status===200||xhr.status===0){apps=JSON.parse(xhr.responseText);populateSelects();}};
  xhr.send();
 });
}
function populateSelects(){
 var cats={};apps.forEach(function(a){if(!cats[a.cat])cats[a.cat]=[];cats[a.cat].push(a);});
 var catKeys=Object.keys(cats).sort();
 ['selL','selR'].forEach(function(id){
  var sel=document.getElementById(id);
  catKeys.forEach(function(c){
   var og=document.createElement('optgroup');og.label=c;
   cats[c].forEach(function(a){
    var o=document.createElement('option');o.value=a.path;o.textContent=a.title;og.appendChild(o);
   });
   sel.appendChild(og);
  });
 });
}
document.getElementById('selL').onchange=function(){document.getElementById('frameL').src=this.value||'about:blank';};
document.getElementById('selR').onchange=function(){document.getElementById('frameR').src=this.value||'about:blank';};

/* Draggable divider */
var divider=document.getElementById('divider');
var splitWrap=document.getElementById('splitWrap');
var paneL=document.getElementById('paneL');
var paneR=document.getElementById('paneR');
var dragging=false;

divider.addEventListener('mousedown',function(e){e.preventDefault();dragging=true;divider.classList.add('active');
 document.querySelectorAll('iframe').forEach(function(f){f.style.pointerEvents='none';});});
document.addEventListener('mousemove',function(e){
 if(!dragging)return;
 var rect=splitWrap.getBoundingClientRect();
 var x=e.clientX-rect.left;var total=rect.width-6;
 var pct=Math.max(5,Math.min(95,(x/total)*100));
 paneL.style.flex='0 0 '+pct+'%';paneR.style.flex='0 0 '+(100-pct)+'%';
});
document.addEventListener('mouseup',function(){
 if(dragging){dragging=false;divider.classList.remove('active');
  document.querySelectorAll('iframe').forEach(function(f){f.style.pointerEvents='';});}
});

/* Touch support */
divider.addEventListener('touchstart',function(e){e.preventDefault();dragging=true;divider.classList.add('active');
 document.querySelectorAll('iframe').forEach(function(f){f.style.pointerEvents='none';});},{passive:false});
document.addEventListener('touchmove',function(e){
 if(!dragging)return;var t=e.touches[0];
 var rect=splitWrap.getBoundingClientRect();
 var x=t.clientX-rect.left;var total=rect.width-6;
 var pct=Math.max(5,Math.min(95,(x/total)*100));
 paneL.style.flex='0 0 '+pct+'%';paneR.style.flex='0 0 '+(100-pct)+'%';
});
document.addEventListener('touchend',function(){
 if(dragging){dragging=false;divider.classList.remove('active');
  document.querySelectorAll('iframe').forEach(function(f){f.style.pointerEvents='';});}
});

/* Swap */
document.getElementById('swapBtn').onclick=function(){
 var sl=document.getElementById('selL');var sr=document.getElementById('selR');
 var fl=document.getElementById('frameL');var fr=document.getElementById('frameR');
 var tmpV=sl.value;sl.value=sr.value;sr.value=tmpV;
 var tmpS=fl.src;fl.src=fr.src;fr.src=tmpS;
};
/* Reset */
document.getElementById('resetBtn').onclick=function(){paneL.style.flex='1';paneR.style.flex='1';};

/* Fullscreen per pane */
document.querySelectorAll('.fsBtn').forEach(function(btn){
 btn.onclick=function(){
  var pane=document.getElementById(btn.getAttribute('data-pane'));
  pane.classList.toggle('fullscreen');
  btn.textContent=pane.classList.contains('fullscreen')?'\u2716':'\u26F6';
 };
});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){document.querySelectorAll('.pane.fullscreen').forEach(function(p){p.classList.remove('fullscreen');});document.querySelectorAll('.fsBtn').forEach(function(b){b.textContent='\u26F6';});}});

loadApps();
</script>
</body>
</html>'''
    path = os.path.join(BASE, 'split.html')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"  Created: split.html")


def main():
    print("=" * 60)
    print("Add Matrix Rain + Rating System to all apps")
    print("=" * 60)

    # Step 1: Create standalone pages
    print("\nStep 1: Creating standalone pages...")
    create_periodic_table()
    create_split_viewer()

    # Step 2: Find all script.js files
    pattern = os.path.join(BASE, '[0-9][0-9]-*', '*', 'script.js')
    files = sorted(glob.glob(pattern))
    print(f"\nStep 2: Found {len(files)} script.js files")

    # Step 3: Inject features
    modified = 0
    skipped = 0
    errors = 0

    for filepath in files:
        try:
            if process_file(filepath):
                modified += 1
                if modified <= 5:
                    print(f"  Modified: {os.path.relpath(filepath, BASE)}")
                elif modified == 6:
                    print("  ... (remaining modifications suppressed)")
            else:
                skipped += 1
        except Exception as e:
            errors += 1
            print(f"  ERROR in {filepath}: {e}")

    print(f"\nStep 3: Modified: {modified}, Skipped (already done): {skipped}, Errors: {errors}")

    # Step 4: Verify 30 random files with node -c
    if files:
        sample = random.sample(files, min(30, len(files)))
        print(f"\nStep 4: Verifying {len(sample)} random files with node -c...")
        v_ok = 0
        v_fail = 0
        for f in sample:
            r = subprocess.run(['node', '-c', f], capture_output=True, text=True)
            if r.returncode == 0:
                v_ok += 1
            else:
                v_fail += 1
                rel = os.path.relpath(f, BASE)
                print(f"  FAIL: {rel} -> {r.stderr.strip()[:150]}")
        print(f"Verification: {v_ok} OK, {v_fail} FAIL out of {len(sample)}")

    print("\nDone!")


if __name__ == '__main__':
    main()
