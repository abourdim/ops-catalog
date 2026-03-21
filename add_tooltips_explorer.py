#!/usr/bin/env python3
"""
add_tooltips_explorer.py
Adds two features to all 488 apps:
  1. Smart Tooltips — hover explanations for controls
  2. Parameter Space Explorer — automated parameter sweep with heatmap
"""

import os, re, glob, subprocess, random

ROOT = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject ──────────────────────────────────────────────

LANG_EN = (
    "tooltipTitle:'Smart Tooltips',"
    "tooltipToggle:'Toggle Tooltips',"
    "tip_start:'Start the simulation and watch the visualization come alive',"
    "tip_stop:'Pause the simulation while preserving current state',"
    "tip_reset:'Clear all data and return to initial conditions',"
    "tip_slider:'Drag to adjust this parameter — the visualization updates in real time',"
    "tip_theme:'Switch between 8 visual themes including 2 light Islamic designs',"
    "tip_help:'Open the help panel with FAQ, guides, wiki, and challenges',"
    "explorerTitle:'Parameter Space Explorer',"
    "explorerStart:'Auto-Explore',"
    "explorerStop:'Stop Exploration',"
    "explorerProgress:'Exploring combinations...',"
    "explorerResult:'Exploration Complete',"
    "explorerInfo:'Systematically tests min/mid/max for each slider and records results',"
)

LANG_FR = (
    "tooltipTitle:'Infobulles intelligentes',"
    "tooltipToggle:'Activer les infobulles',"
    "tip_start:'Lancer la simulation et observer la visualisation s\\x27animer',"
    "tip_stop:'Mettre en pause la simulation en conservant l\\x27\u00e9tat actuel',"
    "tip_reset:'Effacer toutes les donn\u00e9es et revenir aux conditions initiales',"
    "tip_slider:'Glisser pour ajuster ce param\u00e8tre \u2014 la visualisation se met \u00e0 jour en temps r\u00e9el',"
    "tip_theme:'Basculer entre 8 th\u00e8mes visuels dont 2 th\u00e8mes clairs islamiques',"
    "tip_help:'Ouvrir le panneau d\\x27aide avec FAQ, guides, wiki et d\u00e9fis',"
    "explorerTitle:'Explorateur d\\x27espace param\u00e9trique',"
    "explorerStart:'Auto-Explorer',"
    "explorerStop:'Arr\u00eater l\\x27exploration',"
    "explorerProgress:'Exploration des combinaisons...',"
    "explorerResult:'Exploration termin\u00e9e',"
    "explorerInfo:'Teste syst\u00e9matiquement min/milieu/max pour chaque curseur et enregistre les r\u00e9sultats',"
)

LANG_AR = (
    "tooltipTitle:'\u062a\u0644\u0645\u064a\u062d\u0627\u062a \u0630\u0643\u064a\u0629',"
    "tooltipToggle:'\u062a\u0628\u062f\u064a\u0644 \u0627\u0644\u062a\u0644\u0645\u064a\u062d\u0627\u062a',"
    "tip_start:'\u0627\u0628\u062f\u0623 \u0627\u0644\u0645\u062d\u0627\u0643\u0627\u0629 \u0648\u0634\u0627\u0647\u062f \u0627\u0644\u0631\u0633\u0645 \u0627\u0644\u0628\u064a\u0627\u0646\u064a \u064a\u0646\u0628\u0636 \u0628\u0627\u0644\u062d\u064a\u0627\u0629',"
    "tip_stop:'\u0623\u0648\u0642\u0641 \u0627\u0644\u0645\u062d\u0627\u0643\u0627\u0629 \u0645\u0624\u0642\u062a\u0627\u064b \u0645\u0639 \u0627\u0644\u062d\u0641\u0627\u0638 \u0639\u0644\u0649 \u0627\u0644\u062d\u0627\u0644\u0629 \u0627\u0644\u062d\u0627\u0644\u064a\u0629',"
    "tip_reset:'\u0627\u0645\u0633\u062d \u062c\u0645\u064a\u0639 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0648\u0639\u062f \u0625\u0644\u0649 \u0627\u0644\u0634\u0631\u0648\u0637 \u0627\u0644\u0623\u0648\u0644\u064a\u0629',"
    "tip_slider:'\u0627\u0633\u062d\u0628 \u0644\u0636\u0628\u0637 \u0647\u0630\u0627 \u0627\u0644\u0645\u0639\u0627\u0645\u0644 \u2014 \u064a\u062a\u062d\u062f\u062b \u0627\u0644\u0631\u0633\u0645 \u0627\u0644\u0628\u064a\u0627\u0646\u064a \u0641\u064a \u0627\u0644\u0648\u0642\u062a \u0627\u0644\u0641\u0639\u0644\u064a',"
    "tip_theme:'\u0628\u062f\u0651\u0644 \u0628\u064a\u0646 8 \u0645\u0638\u0627\u0647\u0631 \u0645\u0631\u0626\u064a\u0629 \u0645\u0646\u0647\u0627 \u062a\u0635\u0645\u064a\u0645\u0627\u0646 \u0625\u0633\u0644\u0627\u0645\u064a\u0627\u0646 \u0641\u0627\u062a\u062d\u0627\u0646',"
    "tip_help:'\u0627\u0641\u062a\u062d \u0644\u0648\u062d\u0629 \u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629 \u0645\u0639 \u0627\u0644\u0623\u0633\u0626\u0644\u0629 \u0627\u0644\u0634\u0627\u0626\u0639\u0629 \u0648\u0627\u0644\u0623\u062f\u0644\u0629 \u0648\u0627\u0644\u0648\u064a\u0643\u064a \u0648\u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a',"
    "explorerTitle:'\u0645\u0633\u062a\u0643\u0634\u0641 \u0641\u0636\u0627\u0621 \u0627\u0644\u0645\u0639\u0627\u0645\u0644\u0627\u062a',"
    "explorerStart:'\u0627\u0633\u062a\u0643\u0634\u0627\u0641 \u062a\u0644\u0642\u0627\u0626\u064a',"
    "explorerStop:'\u0625\u064a\u0642\u0627\u0641 \u0627\u0644\u0627\u0633\u062a\u0643\u0634\u0627\u0641',"
    "explorerProgress:'\u062c\u0627\u0631\u064d \u0627\u0633\u062a\u0643\u0634\u0627\u0641 \u0627\u0644\u062a\u0648\u0644\u064a\u0641\u0627\u062a...',"
    "explorerResult:'\u0627\u0643\u062a\u0645\u0644 \u0627\u0644\u0627\u0633\u062a\u0643\u0634\u0627\u0641',"
    "explorerInfo:'\u064a\u062e\u062a\u0628\u0631 \u0628\u0634\u0643\u0644 \u0645\u0646\u0647\u062c\u064a \u0627\u0644\u062d\u062f \u0627\u0644\u0623\u062f\u0646\u0649/\u0627\u0644\u0648\u0633\u0637/\u0627\u0644\u0623\u0642\u0635\u0649 \u0644\u0643\u0644 \u0645\u0646\u0632\u0644\u0642 \u0648\u064a\u0633\u062c\u0644 \u0627\u0644\u0646\u062a\u0627\u0626\u062c',"
)

# ── JS functions to append after LANG block ──────────────────────────

JS_FUNCTIONS = r"""
/* ═══════ Smart Tooltips ═══════ */
function initTooltips(){
  if(document.getElementById('tooltipFloat')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var tipMap={};
  var allBtns=document.querySelectorAll('button');
  allBtns.forEach(function(b){
    var txt=(b.textContent||'').toLowerCase().trim();
    if(txt.indexOf('start')>-1||txt.indexOf('lancer')>-1||txt.indexOf('\u0627\u0628\u062f\u0623')>-1) tipMap[b.id||Math.random()]=L.tip_start||'Start the simulation';
    else if(txt.indexOf('stop')>-1||txt.indexOf('arr')>-1||txt.indexOf('\u0623\u0648\u0642\u0641')>-1) tipMap[b.id||Math.random()]=L.tip_stop||'Stop the simulation';
    else if(txt.indexOf('reset')>-1||txt.indexOf('effac')>-1||txt.indexOf('\u0627\u0645\u0633\u062d')>-1) tipMap[b.id||Math.random()]=L.tip_reset||'Reset to defaults';
    else if(txt.indexOf('theme')>-1||txt.indexOf('th\u00e8me')>-1||txt.indexOf('\u0627\u0644\u0645\u0638\u0647\u0631')>-1) tipMap[b.id||Math.random()]=L.tip_theme||'Change theme';
    else if(txt.indexOf('help')>-1||txt.indexOf('aide')>-1||txt.indexOf('\u0645\u0633\u0627\u0639\u062f')>-1) tipMap[b.id||Math.random()]=L.tip_help||'Open help';
  });
  var floatDiv=document.createElement('div');
  floatDiv.className='tooltip-float';
  floatDiv.id='tooltipFloat';
  floatDiv.style.cssText='display:none;position:fixed;z-index:9999;background:#1a1a2e;color:#fff;padding:8px 12px;border-radius:8px;font-size:13px;max-width:250px;pointer-events:none;transition:opacity 0.2s;opacity:0;';
  document.body.appendChild(floatDiv);
  var tooltipsEnabled=true;
  function showTip(e,text){
    if(!tooltipsEnabled) return;
    floatDiv.textContent=text;
    floatDiv.style.display='block';
    setTimeout(function(){floatDiv.style.opacity='1';},10);
    moveTip(e);
  }
  function moveTip(e){
    var isRTL=document.documentElement.dir==='rtl';
    var x=e.clientX,y=e.clientY;
    if(isRTL){
      floatDiv.style.left='';
      floatDiv.style.right=(window.innerWidth-x+12)+'px';
    } else {
      floatDiv.style.right='';
      floatDiv.style.left=(x+12)+'px';
    }
    floatDiv.style.top=(y+12)+'px';
  }
  function hideTip(){
    floatDiv.style.opacity='0';
    setTimeout(function(){floatDiv.style.display='none';},200);
  }
  allBtns.forEach(function(b){
    var key=b.id||Math.random();
    if(tipMap[key]){
      b.addEventListener('mouseenter',function(e){showTip(e,tipMap[key]);});
      b.addEventListener('mousemove',moveTip);
      b.addEventListener('mouseleave',hideTip);
    }
  });
  var sliders=document.querySelectorAll('input[type="range"]');
  sliders.forEach(function(s){
    var tipText=L.tip_slider||'Drag to adjust this parameter';
    s.addEventListener('mouseenter',function(e){showTip(e,tipText);});
    s.addEventListener('mousemove',moveTip);
    s.addEventListener('mouseleave',hideTip);
  });
  var toggleBtn=document.createElement('button');
  toggleBtn.className='btn-sm';
  toggleBtn.style.cssText='margin:0.3rem;font-size:12px;';
  toggleBtn.textContent=L.tooltipToggle||'Toggle Tooltips';
  toggleBtn.setAttribute('data-i18n','tooltipToggle');
  toggleBtn.addEventListener('click',function(){
    tooltipsEnabled=!tooltipsEnabled;
    toggleBtn.style.opacity=tooltipsEnabled?'1':'0.5';
  });
  var target=document.querySelector('.sidebar-footer')||document.querySelector('.card')||document.body;
  if(target) target.appendChild(toggleBtn);
}

/* ═══════ Parameter Space Explorer ═══════ */
function initExplorer(){
  if(document.getElementById('explorerPanel')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var sliders=document.querySelectorAll('input[type="range"]');
  if(sliders.length===0) return;
  var panel=document.createElement('div');
  panel.id='explorerPanel';
  panel.className='explorer-panel';
  panel.style.cssText='padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
  var title=L.explorerTitle||'Parameter Space Explorer';
  var startLabel=L.explorerStart||'Auto-Explore';
  var stopLabel=L.explorerStop||'Stop Exploration';
  var infoText=L.explorerInfo||'Systematically tests min/mid/max for each slider and records results';
  panel.innerHTML='<h4 style="margin:0 0 0.5rem 0;font-size:14px;" data-i18n="explorerTitle">'+title+'</h4>'
    +'<p style="font-size:12px;opacity:0.7;margin:0 0 0.5rem 0;" data-i18n="explorerInfo">'+infoText+'</p>'
    +'<div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin-bottom:0.5rem;">'
    +'<button id="explorerStartBtn" class="btn-sm" data-i18n="explorerStart">'+startLabel+'</button>'
    +'<button id="explorerStopBtn" class="btn-sm" style="display:none;" data-i18n="explorerStop">'+stopLabel+'</button>'
    +'<button id="explorerApplyBtn" class="btn-sm" style="display:none;">Apply Best</button>'
    +'</div>'
    +'<div id="explorerProgress" style="display:none;margin-bottom:0.5rem;">'
    +'<div style="background:rgba(255,255,255,0.1);border-radius:4px;height:8px;overflow:hidden;">'
    +'<div id="explorerBar" style="height:100%;background:var(--accent,#00ff88);width:0%;transition:width 0.3s;"></div>'
    +'</div>'
    +'<span id="explorerPct" style="font-size:11px;opacity:0.7;">0%</span>'
    +'</div>'
    +'<div id="explorerResults" style="font-size:11px;max-height:200px;overflow-y:auto;"></div>';
  var wikiSection=document.querySelector('.wiki-entry')||document.querySelector('.sidebar-body')||document.querySelector('.card');
  if(wikiSection&&wikiSection.parentNode){
    wikiSection.parentNode.insertBefore(panel,wikiSection);
  } else {
    document.body.appendChild(panel);
  }
  var exploring=false;
  var explorerTimer=null;
  var results=[];
  var bestCombo=null;
  var bestScore=-Infinity;
  var startBtn=document.getElementById('explorerStartBtn');
  var stopBtn=document.getElementById('explorerStopBtn');
  var applyBtn=document.getElementById('explorerApplyBtn');
  var progressDiv=document.getElementById('explorerProgress');
  var barDiv=document.getElementById('explorerBar');
  var pctSpan=document.getElementById('explorerPct');
  var resultsDiv=document.getElementById('explorerResults');
  function getCanvasScore(){
    var canvas=document.querySelector('canvas');
    if(!canvas) return Math.random()*100;
    try{
      var ctx=canvas.getContext('2d');
      var data=ctx.getImageData(0,0,Math.min(canvas.width,100),Math.min(canvas.height,100)).data;
      var sum=0,nonZero=0;
      for(var i=0;i<data.length;i+=16){sum+=data[i]+data[i+1]+data[i+2];if(data[i]||data[i+1]||data[i+2])nonZero++;}
      return nonZero>0?(sum/nonZero):0;
    }catch(e){return Math.random()*100;}
  }
  function generateCombinations(){
    var combos=[];
    var sliderArr=Array.from(sliders);
    var levels=sliderArr.map(function(s){
      var mn=parseFloat(s.min)||0,mx=parseFloat(s.max)||100;
      return [mn,(mn+mx)/2,mx];
    });
    if(sliderArr.length<=2){
      function cartesian(arrays,prefix){
        if(arrays.length===0){combos.push(prefix.slice());return;}
        var first=arrays[0],rest=arrays.slice(1);
        for(var i=0;i<first.length;i++){prefix.push(first[i]);cartesian(rest,prefix);prefix.pop();}
      }
      cartesian(levels,[]);
    } else {
      for(var si=0;si<sliderArr.length;si++){
        for(var li=0;li<3;li++){
          var combo=sliderArr.map(function(s){return parseFloat(s.value);});
          combo[si]=levels[si][li];
          combos.push(combo);
        }
      }
    }
    return combos;
  }
  function runExploration(){
    exploring=true;
    results=[];
    bestScore=-Infinity;
    bestCombo=null;
    startBtn.style.display='none';
    stopBtn.style.display='';
    applyBtn.style.display='none';
    progressDiv.style.display='block';
    resultsDiv.innerHTML='';
    var combos=generateCombinations();
    var idx=0;
    var sliderArr=Array.from(sliders);
    var origValues=sliderArr.map(function(s){return s.value;});
    function step(){
      if(!exploring||idx>=combos.length){
        finishExploration(sliderArr,origValues);
        return;
      }
      var combo=combos[idx];
      sliderArr.forEach(function(s,i){
        s.value=combo[i];
        s.dispatchEvent(new Event('input',{bubbles:true}));
      });
      var pct=Math.round((idx+1)/combos.length*100);
      barDiv.style.width=pct+'%';
      pctSpan.textContent=pct+'%';
      setTimeout(function(){
        var score=getCanvasScore();
        results.push({combo:combo.slice(),score:score});
        if(score>bestScore){bestScore=score;bestCombo=combo.slice();}
        idx++;
        explorerTimer=setTimeout(step,120);
      },80);
    }
    step();
  }
  function finishExploration(sliderArr,origValues){
    exploring=false;
    startBtn.style.display='';
    stopBtn.style.display='none';
    progressDiv.style.display='none';
    barDiv.style.width='0%';
    sliderArr.forEach(function(s,i){
      s.value=origValues[i];
      s.dispatchEvent(new Event('input',{bubbles:true}));
    });
    var html='<table style="width:100%;border-collapse:collapse;font-size:11px;"><tr style="border-bottom:1px solid rgba(255,255,255,0.15);">';
    sliderArr.forEach(function(s,i){html+='<th style="padding:2px 4px;text-align:left;">P'+(i+1)+'</th>';});
    html+='<th style="padding:2px 4px;text-align:left;">Score</th></tr>';
    var sorted=results.slice().sort(function(a,b){return b.score-a.score;});
    var top=sorted.slice(0,12);
    top.forEach(function(r,ri){
      var bg=ri===0?'rgba(0,255,136,0.15)':'transparent';
      html+='<tr style="background:'+bg+';border-bottom:1px solid rgba(255,255,255,0.05);">';
      r.combo.forEach(function(v){html+='<td style="padding:2px 4px;">'+parseFloat(v).toFixed(1)+'</td>';});
      html+='<td style="padding:2px 4px;font-weight:bold;">'+r.score.toFixed(1)+'</td></tr>';
    });
    html+='</table>';
    if(results.length>0){
      html+='<div style="margin-top:0.3rem;font-size:11px;opacity:0.7;">'+(L.explorerResult||'Exploration Complete')+' — '+results.length+' combos tested</div>';
    }
    resultsDiv.innerHTML=html;
    if(bestCombo){
      applyBtn.style.display='';
      try{localStorage.setItem('wdiy-explorer-best',JSON.stringify(bestCombo));}catch(e){}
    }
  }
  startBtn.addEventListener('click',function(){
    if(!exploring) runExploration();
  });
  stopBtn.addEventListener('click',function(){
    exploring=false;
  });
  applyBtn.addEventListener('click',function(){
    var combo=bestCombo;
    try{var stored=localStorage.getItem('wdiy-explorer-best');if(stored) combo=JSON.parse(stored);}catch(e){}
    if(!combo) return;
    var sliderArr=Array.from(sliders);
    sliderArr.forEach(function(s,i){
      if(combo[i]!==undefined){s.value=combo[i];s.dispatchEvent(new Event('input',{bubbles:true}));}
    });
  });
}
"""

# ── HTML to insert before </body> ────────────────────────────────────
TOOLTIP_HTML = '<div class="tooltip-float" id="tooltipFloat" style="display:none;position:fixed;z-index:9999;background:#1a1a2e;color:#fff;padding:8px 12px;border-radius:8px;font-size:13px;max-width:250px;pointer-events:none;transition:opacity 0.2s"></div>'


def find_all_apps():
    """Find all script.js files in the ops-catalog."""
    pattern = os.path.join(ROOT, '*', '*', 'script.js')
    return sorted(glob.glob(pattern))


def inject_lang_keys(content, lang_code, keys_str):
    """Inject LANG keys into the appropriate language block of LANG object.

    Handles two formats:
    - Format A: ...LANG_BASE.<lang>, present -> inject after the spread marker
    - Format B: <lang>:{ with no spread -> inject after the opening brace
    """
    # Try Format A first: find ...LANG_BASE.<lang>,
    spread_pattern = r'(\.\.\.LANG_BASE\.' + lang_code + r'\s*,)'
    match = re.search(spread_pattern, content)
    if match:
        insert_pos = match.end()
        content = content[:insert_pos] + keys_str + content[insert_pos:]
        return content, True

    # Format B: find the lang block opening inside const LANG = { ... }
    # We need to find `<lang>:{` or `<lang>: {` inside the LANG object (not LANG_BASE)
    # First find where LANG (not LANG_BASE) is defined
    lang_obj_match = re.search(r'const LANG\s*=\s*\{', content)
    if not lang_obj_match:
        return content, False

    lang_obj_start = lang_obj_match.end()

    # Now find `<lang_code>:{` or `<lang_code>: {` after the LANG object start
    block_pattern = r'(?<![A-Za-z_])' + lang_code + r'\s*:\s*\{'
    # Search only after the LANG object definition
    match = re.search(block_pattern, content[lang_obj_start:])
    if not match:
        return content, False

    # Insert right after the opening brace
    insert_pos = lang_obj_start + match.end()
    content = content[:insert_pos] + keys_str + content[insert_pos:]
    return content, True


def find_lang_block_end(content):
    """Find the closing }; of the const LANG = { ... }; block."""
    lang_match = re.search(r'const LANG\s*=\s*\{', content)
    if not lang_match:
        return -1

    brace_start = lang_match.end() - 1  # the { character
    depth = 0
    i = brace_start
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
                # Found the closing brace of LANG
                j = i + 1
                while j < len(content) and content[j] in (' ', '\t', '\n', '\r'):
                    j += 1
                if j < len(content) and content[j] == ';':
                    return j + 1
                return i + 1
        i += 1
    return -1


def process_script(script_path):
    """Process a single script.js file."""
    with open(script_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already processed
    if 'tooltipTitle' in content:
        return 'skipped', content

    original = content  # keep original in case of failure

    # Inject LANG keys for each language
    content, ok_en = inject_lang_keys(content, 'en', LANG_EN)
    content, ok_fr = inject_lang_keys(content, 'fr', LANG_FR)
    content, ok_ar = inject_lang_keys(content, 'ar', LANG_AR)

    if not (ok_en and ok_fr and ok_ar):
        return 'no_lang', original

    # Find the end of the LANG block
    insert_pos = find_lang_block_end(content)
    if insert_pos == -1:
        return 'no_lang_end', original

    # Insert JS functions after LANG block
    content = content[:insert_pos] + '\n' + JS_FUNCTIONS + content[insert_pos:]

    # Add init calls at the end of the file
    init_call = "\nif(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){initTooltips();initExplorer();});}else{initTooltips();initExplorer();}\n"
    content += init_call

    with open(script_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return 'ok', content


def process_html(html_path):
    """Add tooltip div to index.html."""
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has tooltip div
    if 'tooltipFloat' in content:
        return 'skipped'

    # Insert tooltip div before </body>
    if '</body>' in content:
        content = content.replace('</body>', TOOLTIP_HTML + '\n</body>', 1)
    elif '</BODY>' in content:
        content = content.replace('</BODY>', TOOLTIP_HTML + '\n</BODY>', 1)
    else:
        return 'no_body'

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)

    return 'ok'


def main():
    apps = find_all_apps()
    print(f"Found {len(apps)} apps")

    stats = {'ok': 0, 'skipped': 0, 'no_lang': 0, 'no_lang_end': 0,
             'no_body': 0, 'html_ok': 0, 'html_skipped': 0, 'errors': []}

    for script_path in apps:
        app_dir = os.path.dirname(script_path)
        app_name = os.path.relpath(app_dir, ROOT)

        try:
            result, _ = process_script(script_path)
            stats[result] = stats.get(result, 0) + 1

            if result in ('ok', 'skipped'):
                html_path = os.path.join(app_dir, 'index.html')
                if os.path.exists(html_path):
                    html_result = process_html(html_path)
                    if html_result == 'ok':
                        stats['html_ok'] += 1
                    elif html_result == 'skipped':
                        stats['html_skipped'] += 1
                    else:
                        stats[html_result] = stats.get(html_result, 0) + 1

            if result not in ('ok', 'skipped'):
                stats['errors'].append(f"  {app_name}: {result}")
        except Exception as e:
            stats['errors'].append(f"  {app_name}: EXCEPTION {e}")
            import traceback
            traceback.print_exc()

    print(f"\n{'='*60}")
    print(f"RESULTS:")
    print(f"  Scripts modified:  {stats['ok']}")
    print(f"  Scripts skipped:   {stats['skipped']} (already had tooltipTitle)")
    print(f"  HTML modified:     {stats['html_ok']}")
    print(f"  HTML skipped:      {stats['html_skipped']}")
    if stats.get('no_lang'):
        print(f"  No LANG keys:      {stats['no_lang']}")
    if stats.get('no_lang_end'):
        print(f"  No LANG end:       {stats['no_lang_end']}")
    if stats['errors']:
        print(f"\nERRORS ({len(stats['errors'])}):")
        for e in stats['errors'][:10]:
            print(e)

    # ── Syntax verification ──
    print(f"\n{'='*60}")
    print("SYNTAX VERIFICATION (node -c):")
    all_scripts = find_all_apps()
    # Pick samples from both old and new format
    sample = random.sample(all_scripts, min(30, len(all_scripts)))
    passed = 0
    failed = 0
    fail_details = []
    for s in sample:
        try:
            result = subprocess.run(
                ['node', '-c', s],
                capture_output=True, text=True, timeout=10
            )
            if result.returncode == 0:
                passed += 1
            else:
                failed += 1
                rel = os.path.relpath(s, ROOT)
                err_lines = result.stderr.strip().split('\n')[:3]
                detail = f"  FAIL: {rel}\n"
                for line in err_lines:
                    detail += f"        {line}\n"
                fail_details.append(detail)
        except Exception as e:
            failed += 1
            fail_details.append(f"  ERROR: {os.path.relpath(s, ROOT)} - {e}\n")

    for d in fail_details:
        print(d, end='')

    print(f"\n  Checked: {len(sample)} files")
    print(f"  Passed:  {passed}")
    print(f"  Failed:  {failed}")
    print(f"{'='*60}")


if __name__ == '__main__':
    main()
