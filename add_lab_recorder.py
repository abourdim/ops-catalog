#!/usr/bin/env python3
"""Add Lab Notebook + Data Recorder features to all 488 apps."""

import os, re, glob, subprocess

ROOT = os.path.dirname(os.path.abspath(__file__))


# ── LANG keys ──

EN_KEYS = (
    "labTitle:'\xf0\x9f\x93\x93 Lab Notebook',"
    "labGenerate:'\xf0\x9f\x93\x93 Lab Report',"
    "labExport:'Export Report',"
    "labHypothesis:'HYPOTHESIS',"
    "labMethod:'METHOD',"
    "labObservation:'OBSERVATIONS',"
    "labConclusion:'CONCLUSION',"
    "labSession:'Session',"
    "recorderTitle:'\xe2\x8f\xba Data Recorder',"
    "recorderStart:'\xe2\x8f\xba Record',"
    "recorderStop:'\xe2\x8f\xb9 Stop',"
    "recorderClear:'Clear',"
    "recorderExport:'Export CSV',"
    "recorderPoints:'pts',"
    "recorderGraph:'Graph',"
)

FR_KEYS = (
    "labTitle:'\xf0\x9f\x93\x93 Cahier de labo',"
    "labGenerate:'\xf0\x9f\x93\x93 Rapport de labo',"
    "labExport:'Exporter le rapport',"
    "labHypothesis:'HYPOTH\\xc8SE',"
    "labMethod:'M\\xc9THODE',"
    "labObservation:'OBSERVATIONS',"
    "labConclusion:'CONCLUSION',"
    "labSession:'Session',"
    "recorderTitle:'\xe2\x8f\xba Enregistreur',"
    "recorderStart:'\xe2\x8f\xba Enregistrer',"
    "recorderStop:'\xe2\x8f\xb9 Arr\\xeater',"
    "recorderClear:'Effacer',"
    "recorderExport:'Exporter CSV',"
    "recorderPoints:'pts',"
    "recorderGraph:'Graphique',"
)

AR_KEYS = (
    "labTitle:'\xf0\x9f\x93\x93 \u062f\u0641\u062a\u0631 \u0627\u0644\u0645\u062e\u062a\u0628\u0631',"
    "labGenerate:'\xf0\x9f\x93\x93 \u062a\u0642\u0631\u064a\u0631 \u0627\u0644\u0645\u062e\u062a\u0628\u0631',"
    "labExport:'\u062a\u0635\u062f\u064a\u0631 \u0627\u0644\u062a\u0642\u0631\u064a\u0631',"
    "labHypothesis:'\u0627\u0644\u0641\u0631\u0636\u064a\u0629',"
    "labMethod:'\u0627\u0644\u0645\u0646\u0647\u062c\u064a\u0629',"
    "labObservation:'\u0627\u0644\u0645\u0644\u0627\u062d\u0638\u0627\u062a',"
    "labConclusion:'\u0627\u0644\u062e\u0644\u0627\u0635\u0629',"
    "labSession:'\u0627\u0644\u062c\u0644\u0633\u0629',"
    "recorderTitle:'\xe2\x8f\xba \u0645\u0633\u062c\u0644 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a',"
    "recorderStart:'\xe2\x8f\xba \u062a\u0633\u062c\u064a\u0644',"
    "recorderStop:'\xe2\x8f\xb9 \u0625\u064a\u0642\u0627\u0641',"
    "recorderClear:'\u0645\u0633\u062d',"
    "recorderExport:'\u062a\u0635\u062f\u064a\u0631 CSV',"
    "recorderPoints:'\u0646\u0642\u0637\u0629',"
    "recorderGraph:'\u0631\u0633\u0645 \u0628\u064a\u0627\u0646\u064a',"
)


# ── JS functions ──
JS_FUNCTIONS = r"""
/* ═══════ LAB NOTEBOOK ═══════ */
function initLabNotebook(){var L=LANG[document.documentElement.lang||'en'];var panel=document.getElementById('labRecorderPanel');if(!panel||!L.labTitle)return;var _labLog=[];var _labStart=Date.now();var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var storageKey=appDir+'_labLog';var btnGen=document.getElementById('labGenBtn');var btnExp=document.getElementById('labExpBtn');if(!btnGen)return;document.querySelectorAll('input[type="range"],input[type="number"]').forEach(function(inp){var prevVal=inp.value;inp.addEventListener('input',function(){_labLog.push({t:Date.now()-_labStart,param:inp.id||inp.name||'slider',oldVal:prevVal,newVal:inp.value});prevVal=inp.value;});});function genReport(){var title=document.title||appDir;var dur=Math.round((Date.now()-_labStart)/1000);var mins=Math.floor(dur/60);var secs=dur%60;var paramCounts={};var paramMins={};var paramMaxs={};_labLog.forEach(function(e){if(!paramCounts[e.param])paramCounts[e.param]=0;paramCounts[e.param]++;var v=parseFloat(e.newVal);if(!isNaN(v)){if(paramMins[e.param]===undefined||v<paramMins[e.param])paramMins[e.param]=v;if(paramMaxs[e.param]===undefined||v>paramMaxs[e.param])paramMaxs[e.param]=v;}});var params=Object.keys(paramCounts);var totalAdj=_labLog.length;var mostMod=params.length?params.reduce(function(a,b){return paramCounts[a]>paramCounts[b]?a:b;}):'-';var allSliders=document.querySelectorAll('input[type="range"],input[type="number"]');var coverage=allSliders.length?Math.round(params.length/allSliders.length*100):0;var obs='';params.forEach(function(p){obs+='  - '+p+': changed '+paramCounts[p]+' times';if(paramMins[p]!==undefined)obs+=', range '+paramMins[p]+'\u2192'+paramMaxs[p];obs+='\n';});var report='\u2550\u2550\u2550 LAB NOTEBOOK \u2550\u2550\u2550\n'+'App: '+title+'\n'+'Date: '+new Date().toISOString().slice(0,10)+'\n'+'Duration: '+mins+'m '+secs+'s\n\n'+L.labHypothesis+'\n"Changing '+mostMod+' affects '+title+' behavior"\n\n'+L.labMethod+'\nParameters tested: '+params.join(', ')+'\nTotal adjustments: '+totalAdj+'\n\n'+L.labObservation+'\n'+obs+'\n'+L.labConclusion+'\nMost sensitive parameter: '+mostMod+'\nExploration coverage: '+coverage+'%\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n';return report;}btnGen.onclick=function(){var report=genReport();var box=document.getElementById('labReportBox');if(box){box.textContent=report;box.style.display='block';}try{localStorage.setItem(storageKey,JSON.stringify({date:new Date().toISOString(),log:_labLog}));}catch(e){}if(typeof playSound==='function')playSound('success');};btnExp.onclick=function(){var report=genReport();var blob=new Blob([report],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=appDir+'-lab-report.txt';a.click();URL.revokeObjectURL(a.href);};}

/* ═══════ DATA RECORDER ═══════ */
function initDataRecorder(){var L=LANG[document.documentElement.lang||'en'];var panel=document.getElementById('labRecorderPanel');if(!panel||!L.recorderTitle)return;var recBtn=document.getElementById('recStartBtn');var clearBtn=document.getElementById('recClearBtn');var expBtn=document.getElementById('recExpBtn');var recCanvas=document.getElementById('recCanvas');var recStatus=document.getElementById('recStatus');if(!recBtn||!recCanvas)return;var ctx=recCanvas.getContext('2d');var recording=false;var recData=[];var recTimer=null;var maxPts=500;function sampleValues(){var vals={};document.querySelectorAll('input[type="range"],input[type="number"]').forEach(function(inp){var k=inp.id||inp.name||'v'+Math.random().toString(36).slice(2,5);vals[k]=parseFloat(inp.value)||0;});document.querySelectorAll('[id]').forEach(function(el){if(el.tagName==='INPUT')return;var txt=el.textContent;var m=txt.match(/[\d]+\.?[\d]*/);if(m&&txt.length<20&&el.id)vals['_'+el.id]=parseFloat(m[0]);});return vals;}function drawGraph(){ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,recCanvas.width,recCanvas.height);if(recData.length<2)return;var keys=Object.keys(recData[0].values);var firstKey=keys[0];if(!firstKey)return;var vals=recData.map(function(d){return d.values[firstKey]||0;});var mn=Math.min.apply(null,vals);var mx=Math.max.apply(null,vals);if(mn===mx){mn-=1;mx+=1;}var w=recCanvas.width;var h=recCanvas.height;var pad=4;ctx.strokeStyle='#33ff88';ctx.lineWidth=1.5;ctx.beginPath();for(var i=0;i<vals.length;i++){var x=pad+(w-2*pad)*(i/(vals.length-1));var y=h-pad-(h-2*pad)*((vals[i]-mn)/(mx-mn));if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.fillStyle='#33ff8840';ctx.lineTo(w-pad,h-pad);ctx.lineTo(pad,h-pad);ctx.fill();}var rafId=null;function animLoop(){drawGraph();if(recording)rafId=requestAnimationFrame(animLoop);}recBtn.onclick=function(){if(!recording){recording=true;recBtn.textContent=L.recorderStop;recBtn.style.background='rgba(255,60,60,0.2)';recTimer=setInterval(function(){if(recData.length>=maxPts){clearInterval(recTimer);recording=false;recBtn.textContent=L.recorderStart;recBtn.style.background='';return;}recData.push({time:Date.now(),values:sampleValues()});recStatus.textContent=(L.recorderTitle||'Recording')+': '+recData.length+' '+(L.recorderPoints||'pts');},500);rafId=requestAnimationFrame(animLoop);}else{recording=false;clearInterval(recTimer);if(rafId)cancelAnimationFrame(rafId);recBtn.textContent=L.recorderStart;recBtn.style.background='';drawGraph();}};clearBtn.onclick=function(){recData=[];recStatus.textContent='';ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,recCanvas.width,recCanvas.height);};expBtn.onclick=function(){if(!recData.length)return;var keys=Object.keys(recData[0].values);var header='time,'+keys.join(',')+'\n';var rows=recData.map(function(d){return d.time+','+keys.map(function(k){return d.values[k]||0;}).join(',');}).join('\n');var csv=header+rows;var blob=new Blob([csv],{type:'text/csv'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';a.download=appDir+'-recording.csv';a.click();URL.revokeObjectURL(a.href);};drawGraph();}

document.addEventListener('DOMContentLoaded',function(){initLabNotebook();initDataRecorder();});
"""


# ── HTML to insert ──
HTML_INSERT = (
    '<div id="labRecorderPanel" style="margin:1rem 0;padding:1rem;border-radius:10px;'
    'background:rgba(var(--accent-rgb,212,175,55),0.06);border:1px solid rgba(var(--accent-rgb,212,175,55),0.15);">'
    '<h3 data-i18n="labTitle" style="margin:0 0 0.5rem;">\xf0\x9f\x93\x93 Lab Notebook</h3>'
    '<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.5rem;">'
    '<button class="btn-sm" id="labGenBtn" data-i18n="labGenerate" '
    'style="padding:0.3rem 0.7rem;border-radius:16px;border:1px solid var(--accent,#d4af37);'
    'background:rgba(var(--accent-rgb,212,175,55),0.1);cursor:pointer;font-size:0.78rem;color:inherit;">'
    '\xf0\x9f\x93\x93 Lab Report</button>'
    '<button class="btn-sm" id="labExpBtn" data-i18n="labExport" '
    'style="padding:0.3rem 0.7rem;border-radius:16px;border:1px solid var(--accent,#d4af37);'
    'background:rgba(var(--accent-rgb,212,175,55),0.1);cursor:pointer;font-size:0.78rem;color:inherit;">'
    'Export Report</button></div>'
    '<pre id="labReportBox" style="display:none;max-height:200px;overflow:auto;padding:0.6rem;'
    'border-radius:8px;background:var(--bg,#000);color:var(--accent,#33ff33);font-size:0.72rem;'
    'white-space:pre-wrap;border:1px solid var(--border,#222);margin-bottom:0.8rem;"></pre>'
    '<h3 data-i18n="recorderTitle" style="margin:0.8rem 0 0.4rem;">\xe2\x8f\xba Data Recorder</h3>'
    '<div style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;margin-bottom:0.4rem;">'
    '<button class="btn-sm" id="recStartBtn" data-i18n="recorderStart" '
    'style="padding:0.3rem 0.7rem;border-radius:16px;border:1px solid var(--accent,#d4af37);'
    'background:rgba(var(--accent-rgb,212,175,55),0.1);cursor:pointer;font-size:0.78rem;color:inherit;">'
    '\xe2\x8f\xba Record</button>'
    '<button class="btn-sm" id="recClearBtn" data-i18n="recorderClear" '
    'style="padding:0.3rem 0.7rem;border-radius:16px;border:1px solid var(--accent,#d4af37);'
    'background:rgba(var(--accent-rgb,212,175,55),0.1);cursor:pointer;font-size:0.78rem;color:inherit;">'
    'Clear</button>'
    '<button class="btn-sm" id="recExpBtn" data-i18n="recorderExport" '
    'style="padding:0.3rem 0.7rem;border-radius:16px;border:1px solid var(--accent,#d4af37);'
    'background:rgba(var(--accent-rgb,212,175,55),0.1);cursor:pointer;font-size:0.78rem;color:inherit;">'
    'Export CSV</button>'
    '<span id="recStatus" style="font-size:0.75rem;opacity:0.7;"></span></div>'
    '<canvas id="recCanvas" width="200" height="80" '
    'style="width:100%;max-width:200px;border-radius:8px;background:#0a0a1a;'
    'border:1px solid var(--border,#222);"></canvas>'
    '</div>'
)


def process_script(filepath):
    """Inject LANG keys and JS functions into script.js. Returns True if modified."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already has these features
    if 'labTitle' in content and 'initLabNotebook' in content:
        return False

    needs_lang_keys = 'labTitle' not in content

    # Determine format: old (has ...LANG_BASE.fr on its own line) or new (inline)
    has_spread_fr = '...LANG_BASE.fr' in content

    if has_spread_fr and needs_lang_keys:
        # OLD FORMAT: multi-line with ...LANG_BASE.en, ...LANG_BASE.fr, ...LANG_BASE.ar
        content = content.replace(
            '...LANG_BASE.en,\n',
            '...LANG_BASE.en,\n    ' + EN_KEYS + '\n',
            1
        )
        content = content.replace(
            '...LANG_BASE.fr,\n',
            '...LANG_BASE.fr,\n    ' + FR_KEYS + '\n',
            1
        )
        content = content.replace(
            '...LANG_BASE.ar,\n',
            '...LANG_BASE.ar,\n    ' + AR_KEYS + '\n',
            1
        )
    elif not has_spread_fr and needs_lang_keys:
        # NEW FORMAT: const LANG={en:{...LANG_BASE.en,...},fr:{...},ar:{...}};
        # EN: insert after ...LANG_BASE.en,
        content = content.replace(
            '...LANG_BASE.en,',
            '...LANG_BASE.en,' + EN_KEYS,
            1
        )
        # FR: find },fr:{ after ...LANG_BASE.en and insert keys
        base_en_pos = content.find('...LANG_BASE.en,')
        if base_en_pos >= 0:
            fr_marker = '},fr:{'
            fr_pos = content.find(fr_marker, base_en_pos)
            if fr_pos >= 0:
                insert_at = fr_pos + len(fr_marker)
                content = content[:insert_at] + FR_KEYS + content[insert_at:]

            # AR: find },ar:{ after fr block
            ar_marker = '},ar:{'
            ar_pos = content.find(ar_marker, fr_pos + 1 if fr_pos >= 0 else base_en_pos)
            if ar_pos >= 0:
                insert_at = ar_pos + len(ar_marker)
                content = content[:insert_at] + AR_KEYS + content[insert_at:]

    # Append JS functions after the LANG closing block
    lang_base_pos = content.find('...LANG_BASE.en')
    js_inserted = 'initLabNotebook' in content
    if lang_base_pos >= 0 and not js_inserted:
        if has_spread_fr:
            # OLD FORMAT: find standalone '};' on its own line after ...LANG_BASE.ar
            ar_pos = content.find('...LANG_BASE.ar', lang_base_pos)
            if ar_pos >= 0:
                lines = content.split('\n')
                char_count = 0
                ar_line = 0
                for i, line in enumerate(lines):
                    if char_count <= ar_pos < char_count + len(line) + 1:
                        ar_line = i
                        break
                    char_count += len(line) + 1
                for i in range(ar_line + 1, len(lines)):
                    if lines[i].strip() == '};':
                        lines.insert(i + 1, JS_FUNCTIONS)
                        content = '\n'.join(lines)
                        js_inserted = True
                        break
        else:
            # NEW FORMAT: find '}};' that closes the LANG object
            ar_marker_pos = content.find('},ar:{', lang_base_pos)
            if ar_marker_pos < 0:
                ar_marker_pos = lang_base_pos
            close_pos = content.find('}};', ar_marker_pos)
            if close_pos >= 0:
                insert_pos = close_pos + 3
                if insert_pos < len(content) and content[insert_pos] == '\n':
                    insert_pos += 1
                content = content[:insert_pos] + '\n' + JS_FUNCTIONS + '\n' + content[insert_pos:]
                js_inserted = True

        if not js_inserted:
            # Fallback: find first standalone '};' after LANG_BASE.en
            lines = content.split('\n')
            found_lang = False
            for i, line in enumerate(lines):
                if '...LANG_BASE.en' in line:
                    found_lang = True
                if found_lang and line.strip() == '};':
                    lines.insert(i + 1, JS_FUNCTIONS)
                    content = '\n'.join(lines)
                    js_inserted = True
                    break

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    return True


def process_html(filepath):
    """Insert HTML elements into index.html. Returns True if modified."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'labRecorderPanel' in content:
        return False

    # Try anchor patterns in order of preference
    anchors = [
        ('id="sonifyPanel"', True),    # insert after sonifyPanel div
        ('id="helpGuide"', False),      # insert before helpGuide
        ('id="theoryBlock"', False),    # insert before theoryBlock
        ('explorerTitle">', False),     # insert before explorerTitle
    ]

    inserted = False
    for anchor, after in anchors:
        if anchor in content:
            pos = content.find(anchor)
            if after:
                # Find the end of the element containing this anchor
                # sonifyPanel is <div ... id="sonifyPanel" style="display:none;"></div>
                end_tag = content.find('</div>', pos)
                if end_tag >= 0:
                    insert_pos = end_tag + len('</div>')
                    content = content[:insert_pos] + '\n' + HTML_INSERT + '\n' + content[insert_pos:]
                    inserted = True
                    break
            else:
                # Insert before the element containing this anchor
                # Walk backwards to find the opening '<'
                tag_start = content.rfind('<', 0, pos)
                if tag_start >= 0:
                    content = content[:tag_start] + HTML_INSERT + '\n' + content[tag_start:]
                    inserted = True
                    break

    if not inserted:
        # Fallback: insert before <script src="script.js">
        marker = '<script src="script.js"></script>'
        if marker in content:
            content = content.replace(marker, HTML_INSERT + '\n' + marker, 1)
            inserted = True
        else:
            # Last fallback: before </body>
            content = content.replace('</body>', HTML_INSERT + '\n</body>', 1)
            inserted = True

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    return True


def main():
    pattern = os.path.join(ROOT, '*', '*', 'script.js')
    scripts = sorted(glob.glob(pattern))

    print(f'Found {len(scripts)} script.js files')

    js_modified = 0
    js_skipped = 0
    html_modified = 0
    html_skipped = 0
    errors = []

    for script_path in scripts:
        app_dir = os.path.dirname(script_path)
        html_path = os.path.join(app_dir, 'index.html')

        try:
            if process_script(script_path):
                js_modified += 1
            else:
                js_skipped += 1

            if os.path.exists(html_path):
                if process_html(html_path):
                    html_modified += 1
                else:
                    html_skipped += 1
        except Exception as e:
            errors.append(f'{script_path}: {e}')

    print(f'\n--- RESULTS ---')
    print(f'script.js modified: {js_modified}')
    print(f'script.js skipped (already had features): {js_skipped}')
    print(f'index.html modified: {html_modified}')
    print(f'index.html skipped: {html_skipped}')
    if errors:
        print(f'\nERRORS ({len(errors)}):')
        for e in errors:
            print(f'  {e}')

    # Syntax check with node -c on 30 sample files
    print(f'\n--- SYNTAX VALIDATION (node -c) ---')
    step = max(1, len(scripts) // 30)
    sample = scripts[::step][:30]
    syntax_ok = 0
    syntax_fail = 0
    for s in sample:
        try:
            result = subprocess.run(
                ['node', '-c', s],
                capture_output=True, text=True, timeout=10
            )
            if result.returncode == 0:
                syntax_ok += 1
            else:
                syntax_fail += 1
                print(f'  FAIL: {s}')
                print(f'    {result.stderr.strip()[:200]}')
        except Exception as e:
            syntax_fail += 1
            print(f'  ERROR: {s}: {e}')

    print(f'Syntax OK: {syntax_ok}/{len(sample)}')
    print(f'Syntax FAIL: {syntax_fail}/{len(sample)}')

    print(f'\n--- SUMMARY ---')
    print(f'Total apps processed: {js_modified + js_skipped}')
    print(f'Features added to: {js_modified} script.js + {html_modified} index.html')
    print(f'Already had features: {js_skipped}')
    print(f'Errors: {len(errors)}')


if __name__ == '__main__':
    main()
