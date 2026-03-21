#!/usr/bin/env python3
"""Add particle celebrations and comparison mode to all 488 apps in ops-catalog."""

import os, re, subprocess, random

ROOT = os.path.dirname(os.path.abspath(__file__))

# ── LANG keys to inject ──
# Use \x27 for apostrophes INSIDE single-quoted JS strings

LANG_EN = (
    "particleTitle:'\xf0\x9f\x8e\x86 Particles',particleToggle:'Toggle Particles',"
    "compareTitle:'\xf0\x9f\x93\x8a Compare',compareSave:'Save',compareLoad:'Load',"
    "compareDiff:'Difference',compareClear:'Clear',compareSlotA:'Experiment A',"
    "compareSlotB:'Experiment B',compareResult:'Comparison Result',"
)

LANG_FR = (
    "particleTitle:'\xf0\x9f\x8e\x86 Particules',particleToggle:'Basculer Particules',"
    "compareTitle:'\xf0\x9f\x93\x8a Comparer',compareSave:'Sauvegarder',compareLoad:'Charger',"
    "compareDiff:'Diff\u00e9rence',compareClear:'Effacer',compareSlotA:'Exp\u00e9rience A',"
    "compareSlotB:'Exp\u00e9rience B',compareResult:'R\u00e9sultat de comparaison',"
)

LANG_AR = (
    "particleTitle:'\xf0\x9f\x8e\x86 \u062c\u0632\u064a\u0626\u0627\u062a',particleToggle:'\u062a\u0628\u062f\u064a\u0644 \u0627\u0644\u062c\u0632\u064a\u0626\u0627\u062a',"
    "compareTitle:'\xf0\x9f\x93\x8a \u0645\u0642\u0627\u0631\u0646\u0629',compareSave:'\u062d\u0641\u0638',compareLoad:'\u062a\u062d\u0645\u064a\u0644',"
    "compareDiff:'\u0627\u0644\u0641\u0631\u0642',compareClear:'\u0645\u0633\u062d',compareSlotA:'\u062a\u062c\u0631\u0628\u0629 \u0623',"
    "compareSlotB:'\u062a\u062c\u0631\u0628\u0629 \u0628',compareResult:'\u0646\u062a\u064a\u062c\u0629 \u0627\u0644\u0645\u0642\u0627\u0631\u0646\u0629',"
)

# ── JS functions to append after LANG block ──
JS_FUNC = r"""
/* ═══════ Particle Celebrations ═══════ */
function initParticles(){
  if(document.getElementById('particleCanvas')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var canvas=document.createElement('canvas');
  canvas.id='particleCanvas';
  canvas.style.cssText='position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;';
  document.body.appendChild(canvas);
  var ctx=canvas.getContext('2d');
  var particles=[];
  var animId=null;
  var colors=['#ff6b6b','#feca57','#48dbfb','#ff9ff3','#54a0ff','#5f27cd','#01a3a4','#00d2d3'];
  function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);
  function drawStar(cx,cy,r){ctx.beginPath();for(var i=0;i<5;i++){var a=Math.PI/2+i*Math.PI*2/5;ctx.lineTo(cx+Math.cos(a)*r,cy-Math.sin(a)*r);a+=Math.PI/5;ctx.lineTo(cx+Math.cos(a)*r*0.4,cy-Math.sin(a)*r*0.4);}ctx.closePath();ctx.fill();}
  function spawnParticles(x,y,count){
    var n=count||Math.floor(50+Math.random()*30);
    for(var i=0;i<n;i++){
      var angle=Math.random()*Math.PI*2;
      var speed=2+Math.random()*6;
      var shape=Math.floor(Math.random()*3);
      particles.push({x:x,y:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
        color:colors[Math.floor(Math.random()*colors.length)],
        size:3+Math.random()*5,life:1,decay:0.008+Math.random()*0.012,
        shape:shape,rotation:Math.random()*Math.PI*2,rotSpeed:(Math.random()-0.5)*0.2});
    }
    if(!animId) animate();
  }
  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i=particles.length-1;i>=0;i--){
      var p=particles[i];
      p.x+=p.vx;p.y+=p.vy;p.vy+=0.1;p.vx*=0.99;p.vy*=0.99;
      p.life-=p.decay;p.rotation+=p.rotSpeed;
      if(p.life<=0){particles.splice(i,1);continue;}
      ctx.save();ctx.globalAlpha=p.life;ctx.fillStyle=p.color;
      ctx.translate(p.x,p.y);ctx.rotate(p.rotation);
      if(p.shape===0){ctx.beginPath();ctx.arc(0,0,p.size,0,Math.PI*2);ctx.fill();}
      else if(p.shape===1){ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);}
      else{drawStar(0,0,p.size);}
      ctx.restore();
    }
    if(particles.length>0){animId=requestAnimationFrame(animate);}
    else{ctx.clearRect(0,0,canvas.width,canvas.height);animId=null;}
  }
  window.triggerCelebration=function(x,y){spawnParticles(x||window.innerWidth/2,y||window.innerHeight/2);};
  window.triggerFireworks=function(){
    for(var i=0;i<3;i++){
      (function(idx){setTimeout(function(){
        spawnParticles(100+Math.random()*(window.innerWidth-200),100+Math.random()*(window.innerHeight-300),70);
      },idx*400);})(i);
    }
  };
  /* Hook into achievement system */
  var origDispatch=window.dispatchEvent;
  window.addEventListener('achievement-unlocked',function(e){
    var rect=document.body.getBoundingClientRect();
    window.triggerCelebration(rect.width/2,rect.height/3);
  });
  /* Hook into quiz/challenge completion */
  document.addEventListener('click',function(e){
    var btn=e.target;
    if(!btn)return;
    var txt=(btn.textContent||'').toLowerCase();
    var idn=(btn.id||'').toLowerCase();
    /* Challenge reveal */
    if(idn.indexOf('reveal')>=0||idn.indexOf('answer')>=0||txt.indexOf('reveal')>=0){
      var r=btn.getBoundingClientRect();
      spawnParticles(r.left+r.width/2,r.top+r.height/2,30);
    }
    /* Quiz submit - check score after small delay */
    if(idn.indexOf('quiz')>=0&&(idn.indexOf('submit')>=0||txt.indexOf('submit')>=0)){
      setTimeout(function(){
        var scoreEl=document.querySelector('[id*="quizScore"]')||document.querySelector('[id*="score"]');
        if(scoreEl){
          var m=scoreEl.textContent.match(/(\d+)\s*[%\/]/);
          if(m){var pct=parseInt(m[1]);if(pct>60){window.triggerFireworks();}}
        }
      },500);
    }
    /* Daily challenge complete */
    if(idn.indexOf('daily')>=0&&(idn.indexOf('complete')>=0||idn.indexOf('done')>=0||txt.indexOf('complete')>=0)){
      window.triggerFireworks();
    }
  });
}

/* ═══════ Comparison Mode ═══════ */
function initComparisonMode(){
  if(document.getElementById('comparePanel')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var appKey='compare_'+window.location.pathname.replace(/[^a-z0-9]/gi,'_');
  var saved=JSON.parse(localStorage.getItem(appKey)||'{"a":null,"b":null}');
  function getSliders(){
    var sliders=document.querySelectorAll('input[type="range"]');
    var data=[];
    sliders.forEach(function(s){
      var label='';
      var prev=s.previousElementSibling;
      if(prev&&(prev.tagName==='LABEL'||prev.tagName==='SPAN')){label=prev.textContent.trim();}
      if(!label){var lbl=s.closest('label');if(lbl){label=lbl.textContent.replace(/[\d.]+/g,'').trim();}}
      if(!label){var par=s.parentElement;if(par){var sp=par.querySelector('label,span,.label');if(sp)label=sp.textContent.trim();}}
      if(!label) label=s.id||s.name||('slider-'+data.length);
      data.push({id:s.id||('s'+data.length),label:label,value:parseFloat(s.value),min:parseFloat(s.min||0),max:parseFloat(s.max||100)});
    });
    return data;
  }
  function setSliders(data){
    if(!data)return;
    var sliders=document.querySelectorAll('input[type="range"]');
    data.forEach(function(d,i){
      if(sliders[i]){sliders[i].value=d.value;sliders[i].dispatchEvent(new Event('input',{bubbles:true}));}
    });
  }
  function buildTable(){
    if(!saved.a&&!saved.b) return '<div style="opacity:0.5;font-size:0.8rem;padding:0.5rem;">Save experiments to A and B slots to compare.</div>';
    var html='<table style="width:100%;border-collapse:collapse;font-size:0.78rem;margin-top:0.5rem;">';
    html+='<tr style="border-bottom:1px solid rgba(255,255,255,0.15);"><th style="text-align:left;padding:4px;">Parameter</th>';
    html+='<th style="padding:4px;">'+(L.compareSlotA||'Exp A')+'</th>';
    html+='<th style="padding:4px;">'+(L.compareSlotB||'Exp B')+'</th>';
    html+='<th style="padding:4px;">\u0394 Change</th></tr>';
    var rows=saved.a||saved.b;
    if(rows){rows.forEach(function(r,i){
      var a=saved.a?saved.a[i]:null;
      var b=saved.b?saved.b[i]:null;
      var va=a?a.value:'-';var vb=b?b.value:'-';
      var delta='';var clr='rgba(255,255,255,0.5)';
      if(a&&b){
        var diff=b.value-a.value;
        if(a.value!==0){var pct=Math.round((diff/a.value)*100);delta=(diff>0?'+':'')+pct+'%';
          if(diff>0)clr='#2ecc71';else if(diff<0)clr='#e74c3c';else{clr='rgba(255,255,255,0.4)';delta='0%';}
        }else{delta=diff>0?'+'+diff.toFixed(1):diff.toFixed(1);if(diff>0)clr='#2ecc71';else if(diff<0)clr='#e74c3c';}
      }
      html+='<tr style="border-bottom:1px solid rgba(255,255,255,0.06);">';
      html+='<td style="padding:3px 4px;opacity:0.85;">'+(a?a.label:(b?b.label:''))+'</td>';
      html+='<td style="padding:3px 4px;text-align:center;">'+(typeof va==='number'?va.toFixed(1):va)+'</td>';
      html+='<td style="padding:3px 4px;text-align:center;">'+(typeof vb==='number'?vb.toFixed(1):vb)+'</td>';
      html+='<td style="padding:3px 4px;text-align:center;color:'+clr+';font-weight:600;">'+delta+'</td></tr>';
    });}
    html+='</table>';return html;
  }
  function persist(){localStorage.setItem(appKey,JSON.stringify(saved));}
  /* Build UI */
  var panel=document.createElement('div');
  panel.id='comparePanel';
  panel.style.cssText='display:none;padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
  panel.innerHTML='<div style="font-weight:600;margin-bottom:0.5rem;" data-i18n="compareTitle">'+(L.compareTitle||'\xf0\x9f\x93\x8a Compare')+'</div>'
    +'<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.5rem;">'
    +'<button id="compareSaveA" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(54,160,255,0.15);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareSave">'+(L.compareSave||'Save')+' A</button>'
    +'<button id="compareSaveB" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,107,107,0.15);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareSave">'+(L.compareSave||'Save')+' B</button>'
    +'<button id="compareLoadA" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareLoad">'+(L.compareLoad||'Load')+' A</button>'
    +'<button id="compareLoadB" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareLoad">'+(L.compareLoad||'Load')+' B</button>'
    +'<button id="compareClear" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareClear">'+(L.compareClear||'Clear')+'</button>'
    +'</div>'
    +'<div id="compareTable"></div>';
  var toggleBtn=document.createElement('button');
  toggleBtn.id='compareToggleBtn';
  toggleBtn.style.cssText='padding:0.4rem 0.9rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:inherit;cursor:pointer;font-size:0.85rem;margin:0.3rem 0;';
  toggleBtn.setAttribute('data-i18n','compareTitle');
  toggleBtn.textContent=L.compareTitle||'\xf0\x9f\x93\x8a Compare';
  var target=document.getElementById('mainCard');
  if(target&&target.parentNode){target.parentNode.insertBefore(toggleBtn,target.nextSibling);toggleBtn.parentNode.insertBefore(panel,toggleBtn.nextSibling);}
  else{var fc=document.querySelector('.rows-container')||document.querySelector('.app');if(fc){fc.appendChild(toggleBtn);fc.appendChild(panel);}}
  toggleBtn.addEventListener('click',function(){
    var v=panel.style.display;panel.style.display=v==='none'?'block':'none';
    if(v==='none'){document.getElementById('compareTable').innerHTML=buildTable();}
  });
  document.getElementById('compareSaveA').addEventListener('click',function(){saved.a=getSliders();persist();document.getElementById('compareTable').innerHTML=buildTable();});
  document.getElementById('compareSaveB').addEventListener('click',function(){saved.b=getSliders();persist();document.getElementById('compareTable').innerHTML=buildTable();});
  document.getElementById('compareLoadA').addEventListener('click',function(){setSliders(saved.a);});
  document.getElementById('compareLoadB').addEventListener('click',function(){setSliders(saved.b);});
  document.getElementById('compareClear').addEventListener('click',function(){saved={a:null,b:null};persist();document.getElementById('compareTable').innerHTML=buildTable();});
}
document.addEventListener('DOMContentLoaded',function(){try{initParticles();}catch(e){console.warn('Particles init:',e);}try{initComparisonMode();}catch(e){console.warn('Compare init:',e);}});
"""

def find_app_dirs():
    """Find all app directories containing script.js and index.html."""
    apps = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        if 'script.js' in filenames and 'index.html' in filenames:
            apps.append(dirpath)
    apps.sort()
    return apps


def inject_lang_keys_old(content):
    """Inject LANG keys into old-format files (using ...LANG_BASE.xx spread, multi-line)."""
    modified = False

    m = re.search(r'(\.\.\.LANG_BASE\.en\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + '\n    ' + LANG_EN + '\n    ' + content[insert_pos:]
        modified = True

    m = re.search(r'(\.\.\.LANG_BASE\.fr\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + '\n    ' + LANG_FR + '\n    ' + content[insert_pos:]
        modified = True

    m = re.search(r'(\.\.\.LANG_BASE\.ar\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + '\n    ' + LANG_AR + '\n    ' + content[insert_pos:]
        modified = True

    return content, modified


def inject_lang_keys_new(content):
    """Inject LANG keys into new-format files (single-line LANG with ...LANG_BASE.xx)."""
    modified = False

    m = re.search(r'(\.\.\.LANG_BASE\.en\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + LANG_EN + content[insert_pos:]
        modified = True

    m = re.search(r'(\.\.\.LANG_BASE\.fr\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + LANG_FR + content[insert_pos:]
        modified = True

    m = re.search(r'(\.\.\.LANG_BASE\.ar\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + LANG_AR + content[insert_pos:]
        modified = True

    return content, modified


def detect_format(content):
    """Detect old vs new format. Old has multi-line LANG, new has single-line."""
    m = re.search(r'const\s+LANG\s*=\s*\{', content)
    if not m:
        return None
    line_start = content.rfind('\n', 0, m.start()) + 1
    line_end = content.find('\n', m.end())
    if line_end == -1:
        line_end = len(content)
    line = content[line_start:line_end]
    if '...LANG_BASE.en' in line:
        return 'new'
    return 'old'


def find_lang_block_end(content):
    """Find the closing }; of the LANG block."""
    m = re.search(r'const\s+LANG\s*=\s*\{', content)
    if not m:
        return -1
    start = m.end() - 1
    depth = 0
    i = start
    while i < len(content):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                j = i + 1
                while j < len(content) and content[j] in ' \t\n':
                    j += 1
                if j < len(content) and content[j] == ';':
                    return j + 1
                return i + 1
        i += 1
    return -1


def process_script(app_dir):
    """Process script.js for a single app."""
    path = os.path.join(app_dir, 'script.js')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already injected
    if 'particleTitle' in content:
        return 'skip'

    fmt = detect_format(content)
    if fmt is None:
        if 'const LANG' in content:
            print(f"    DEBUG: 'const LANG' found but detect_format returned None")
        return 'no_lang'

    # Inject LANG keys
    if fmt == 'old':
        content, modified = inject_lang_keys_old(content)
    else:
        content, modified = inject_lang_keys_new(content)

    if not modified:
        return 'no_inject'

    # Find end of LANG block and inject JS functions
    lang_end = find_lang_block_end(content)
    if lang_end == -1:
        return 'no_lang_end'

    content = content[:lang_end] + '\n' + JS_FUNC + '\n' + content[lang_end:]

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    return 'ok'


def main():
    apps = find_app_dirs()
    print(f"Found {len(apps)} apps")

    stats = {'ok': 0, 'skip': 0, 'no_lang': 0, 'no_inject': 0, 'no_lang_end': 0, 'errors': 0}

    for app_dir in apps:
        rel = os.path.relpath(app_dir, ROOT)
        try:
            result = process_script(app_dir)
            stats[result] = stats.get(result, 0) + 1

            if result == 'ok':
                print(f"  [OK] {rel}")
            elif result == 'skip':
                pass
            else:
                print(f"  [{result.upper()}] {rel}")
        except Exception as e:
            stats['errors'] += 1
            print(f"  [ERROR] {rel}: {e}")

    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"{'='*60}")
    print(f"  Total apps found:    {len(apps)}")
    print(f"  JS injected OK:      {stats['ok']}")
    print(f"  JS already done:     {stats['skip']}")
    print(f"  No LANG block:       {stats['no_lang']}")
    print(f"  No inject point:     {stats['no_inject']}")
    print(f"  No LANG end:         {stats.get('no_lang_end', 0)}")
    print(f"  Errors:              {stats['errors']}")

    # ── Syntax check with node -c on 30 random samples ──
    print(f"\n{'='*60}")
    print(f"SYNTAX CHECK (node -c on 30 samples)")
    print(f"{'='*60}")

    ok_apps = [d for d in apps if os.path.exists(os.path.join(d, 'script.js'))]
    samples = random.sample(ok_apps, min(30, len(ok_apps)))
    syntax_ok = 0
    syntax_fail = 0

    for app_dir in samples:
        js_path = os.path.join(app_dir, 'script.js')
        rel = os.path.relpath(js_path, ROOT)
        try:
            result = subprocess.run(
                ['node', '-c', js_path],
                capture_output=True, text=True, timeout=10
            )
            if result.returncode == 0:
                syntax_ok += 1
            else:
                syntax_fail += 1
                print(f"  [FAIL] {rel}")
                print(f"         {result.stderr.strip()[:200]}")
        except Exception as e:
            syntax_fail += 1
            print(f"  [FAIL] {rel}: {e}")

    print(f"\n  Syntax OK: {syntax_ok}/{syntax_ok+syntax_fail}")
    if syntax_fail == 0:
        print(f"  All {syntax_ok} samples passed syntax check!")
    else:
        print(f"  FAILURES: {syntax_fail}")

    print(f"\nDone!")


if __name__ == '__main__':
    main()
