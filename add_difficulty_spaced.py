#!/usr/bin/env python3
"""Add Difficulty Levels + Spaced Repetition features to all 488 apps in ops-catalog."""

import os, re, subprocess, random

ROOT = os.path.dirname(os.path.abspath(__file__))

# ════════════════════════════════════════════════════════════
# LANG keys — Feature 1: Difficulty Levels
# ════════════════════════════════════════════════════════════

DIFF_LANG_EN = (
    "diffTitle:'Difficulty',"
    "diffBeginner:'\U0001f7e2 Beginner',"
    "diffIntermediate:'\U0001f7e1 Intermediate',"
    "diffExpert:'\U0001f534 Expert',"
    "diffInfo:'Choose your complexity level',"
)

DIFF_LANG_FR = (
    "diffTitle:'Difficult\u00e9',"
    "diffBeginner:'\U0001f7e2 D\u00e9butant',"
    "diffIntermediate:'\U0001f7e1 Interm\u00e9diaire',"
    "diffExpert:'\U0001f534 Expert',"
    "diffInfo:'Choisissez votre niveau de complexit\u00e9',"
)

DIFF_LANG_AR = (
    "diffTitle:'\u0627\u0644\u0645\u0633\u062a\u0648\u0649',"
    "diffBeginner:'\U0001f7e2 \u0645\u0628\u062a\u062f\u0626',"
    "diffIntermediate:'\U0001f7e1 \u0645\u062a\u0648\u0633\u0637',"
    "diffExpert:'\U0001f534 \u062e\u0628\u064a\u0631',"
    "diffInfo:'\u0627\u062e\u062a\u0631 \u0645\u0633\u062a\u0648\u0649 \u0627\u0644\u062a\u0639\u0642\u064a\u062f',"
)

# ════════════════════════════════════════════════════════════
# LANG keys — Feature 2: Spaced Repetition
# ════════════════════════════════════════════════════════════

SPACED_LANG_EN = (
    "spacedTitle:'\U0001f4c5 Spaced Review',"
    "spacedReview:'Review',"
    "spacedNext:'Next review',"
    "spacedMastered:'Mastered',"
    "spacedNew:'New \u2014 not yet studied',"
    "spacedDue:'Due for review!',"
    "spacedInfo:'Smart review reminders based on the forgetting curve',"
)

SPACED_LANG_FR = (
    "spacedTitle:'\U0001f4c5 R\u00e9vision espac\u00e9e',"
    "spacedReview:'R\u00e9viser',"
    "spacedNext:'Prochaine r\u00e9vision',"
    "spacedMastered:'Ma\u00eetris\u00e9',"
    "spacedNew:'Nouveau \u2014 pas encore \u00e9tudi\u00e9',"
    "spacedDue:'R\u00e9vision n\u00e9cessaire !',"
    "spacedInfo:'Rappels intelligents bas\u00e9s sur la courbe de l\\x27oubli',"
)

SPACED_LANG_AR = (
    "spacedTitle:'\U0001f4c5 \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629 \u0627\u0644\u0645\u062a\u0628\u0627\u0639\u062f\u0629',"
    "spacedReview:'\u0645\u0631\u0627\u062c\u0639\u0629',"
    "spacedNext:'\u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629 \u0627\u0644\u062a\u0627\u0644\u064a\u0629',"
    "spacedMastered:'\u0645\u064f\u062a\u0642\u064e\u0646',"
    "spacedNew:'\u062c\u062f\u064a\u062f \u2014 \u0644\u0645 \u064a\u064f\u062f\u0631\u064e\u0633 \u0628\u0639\u062f',"
    "spacedDue:'\u062d\u0627\u0646 \u0648\u0642\u062a \u0627\u0644\u0645\u0631\u0627\u062c\u0639\u0629!',"
    "spacedInfo:'\u062a\u0630\u0643\u064a\u0631\u0627\u062a \u0630\u0643\u064a\u0629 \u0628\u0646\u0627\u0621\u064b \u0639\u0644\u0649 \u0645\u0646\u062d\u0646\u0649 \u0627\u0644\u0646\u0633\u064a\u0627\u0646',"
)

# ════════════════════════════════════════════════════════════
# JS functions
# ════════════════════════════════════════════════════════════

JS_DIFFICULTY = """
/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550 Difficulty Levels \u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
function initDifficultyLevels(){
  if(document.getElementById('diffToggleBar'))return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
  var storageKey='diff_'+appDir;
  var saved=localStorage.getItem(storageKey)||'intermediate';
  /* inject CSS */
  var style=document.createElement('style');
  style.textContent=''
    +'.diff-beginner .sim-controls input[type="range"]:nth-of-type(n+4),.diff-beginner .sim-controls .slider-row:nth-of-type(n+4){display:none !important;}'
    +'.diff-beginner label,.diff-beginner .sidebar-label{font-size:1rem !important;}'
    +'.diff-beginner .card-subtitle{font-size:0.95rem !important;}'
    +'.diff-expert{font-size:0.88rem;}'
    +'.diff-expert .card,.diff-expert .collapsible{padding:0.5rem !important;}'
    +'.diff-expert .card-header{padding:0.4rem 0.5rem !important;}'
    +'.diff-toggle-bar{display:flex;gap:0.4rem;align-items:center;padding:0.4rem 0.6rem;border-radius:8px;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.08);margin-bottom:0.5rem;flex-wrap:wrap;}'
    +'.diff-toggle-bar button{padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;transition:all 0.2s;}'
    +'.diff-toggle-bar button.active{background:var(--accent,#d4a03c);color:var(--bg,#08091a);font-weight:700;border-color:var(--accent,#d4a03c);}'
    +'.diff-toggle-bar .diff-label{font-size:0.75rem;opacity:0.6;margin-right:0.3rem;}'
    +'#diffExpertData{display:none;margin:0.5rem 0;padding:0.6rem;border-radius:8px;background:#0a0a1a;border:1px solid rgba(255,255,255,0.08);font-family:monospace;font-size:0.7rem;color:#8f8;max-height:120px;overflow-y:auto;white-space:pre-wrap;word-break:break-all;}'
    +'.diff-expert #diffExpertData{display:block;}';
  document.head.appendChild(style);
  /* build toggle bar */
  var bar=document.createElement('div');
  bar.id='diffToggleBar';
  bar.className='diff-toggle-bar';
  bar.innerHTML='<span class="diff-label" data-i18n="diffTitle">'+(L.diffTitle||'Difficulty')+'</span>'
    +'<button data-diff="beginner" data-i18n="diffBeginner">'+(L.diffBeginner||'\U0001f7e2 Beginner')+'</button>'
    +'<button data-diff="intermediate" data-i18n="diffIntermediate">'+(L.diffIntermediate||'\U0001f7e1 Intermediate')+'</button>'
    +'<button data-diff="expert" data-i18n="diffExpert">'+(L.diffExpert||'\U0001f534 Expert')+'</button>'
    +'<span style="font-size:0.65rem;opacity:0.4;margin-left:auto;" data-i18n="diffInfo">'+(L.diffInfo||'Choose your complexity level')+'</span>';
  var header=document.querySelector('.header');
  if(header&&header.parentNode){header.parentNode.insertBefore(bar,header.nextSibling);}
  else{var app=document.querySelector('.app')||document.body;app.insertBefore(bar,app.firstChild);}
  /* expert data readout */
  var expertDiv=document.createElement('div');
  expertDiv.id='diffExpertData';
  var mainCard=document.getElementById('mainCard');
  if(mainCard&&mainCard.parentNode){mainCard.parentNode.insertBefore(expertDiv,mainCard.nextSibling);}
  function setDiff(level){
    document.body.classList.remove('diff-beginner','diff-intermediate','diff-expert');
    document.body.classList.add('diff-'+level);
    bar.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-diff')===level);});
    localStorage.setItem(storageKey,level);
    if(level==='beginner'){
      var hw=document.querySelector('details.collapsible');
      if(hw&&!hw.open)hw.open=true;
    }
    if(level==='expert'){updateExpertData();}
    else{expertDiv.textContent='';}
  }
  function updateExpertData(){
    if(!document.body.classList.contains('diff-expert'))return;
    var data={};
    document.querySelectorAll('input[type="range"]').forEach(function(s){
      var label=s.previousElementSibling?s.previousElementSibling.textContent:s.id;
      data[label||s.id||'slider']=parseFloat(s.value).toFixed(4);
    });
    document.querySelectorAll('select').forEach(function(s){
      if(s.id!=='langSelect'&&s.id!=='themeSelect'){
        data[s.id||'select']=s.value;
      }
    });
    expertDiv.textContent=JSON.stringify(data,null,2);
  }
  bar.addEventListener('click',function(e){
    var btn=e.target.closest('button[data-diff]');
    if(btn)setDiff(btn.getAttribute('data-diff'));
  });
  setDiff(saved);
  /* update expert readout periodically */
  setInterval(function(){if(document.body.classList.contains('diff-expert'))updateExpertData();},2000);
  /* listen for slider changes */
  document.addEventListener('input',function(e){if(e.target.type==='range'&&document.body.classList.contains('diff-expert'))updateExpertData();});
}
"""

JS_SPACED = """
/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550 Spaced Repetition \u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
function initSpacedRepetition(){
  if(document.getElementById('spacedPanel'))return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
  var storageKey='spaced_'+appDir;
  var now=Date.now();
  var DAY=86400000;
  /* load or create record */
  var rec;
  try{rec=JSON.parse(localStorage.getItem(storageKey));}catch(e){rec=null;}
  if(!rec){rec={visits:0,lastVisit:0,interval:1,ease:2.5};}
  /* SM-2 inspired update */
  var timeSinceLast=now-rec.lastVisit;
  var intervalMs=rec.interval*DAY;
  if(rec.visits===0){
    rec.interval=1;
  }else if(rec.visits===1){
    rec.interval=3;
  }else{
    if(timeSinceLast<intervalMs*0.5){
      /* visited too early, keep interval */
    }else if(timeSinceLast>intervalMs){
      /* visited late, reduce ease slightly */
      rec.ease=Math.max(1.3,rec.ease-0.15);
      rec.interval=Math.round(rec.interval*rec.ease);
    }else{
      rec.interval=Math.round(rec.interval*rec.ease);
    }
  }
  rec.visits++;
  rec.lastVisit=now;
  localStorage.setItem(storageKey,JSON.stringify(rec));
  /* determine status */
  var nextReviewMs=rec.lastVisit+rec.interval*DAY;
  var status,statusIcon,statusClass;
  if(rec.visits<=1){
    status=L.spacedNew||'New \u2014 not yet studied';statusIcon='\u26aa';statusClass='spaced-new';
  }else if(now>nextReviewMs){
    status=L.spacedDue||'Due for review!';statusIcon='\U0001f534';statusClass='spaced-due';
  }else if(nextReviewMs-now<DAY){
    status=(L.spacedNext||'Next review')+': '+(L.spacedReview||'Review')+' \u2014 tomorrow';statusIcon='\U0001f7e1';statusClass='spaced-soon';
  }else{
    var daysLeft=Math.ceil((nextReviewMs-now)/DAY);
    status=(L.spacedMastered||'Mastered')+' \u2014 '+(L.spacedNext||'Next review')+' '+daysLeft+' days';statusIcon='\U0001f7e2';statusClass='spaced-mastered';
  }
  /* scan other apps for due reviews */
  var totalVisited=0,dueCount=0,masteredCount=0;
  var dueApps=[];
  for(var i=0;i<localStorage.length;i++){
    var key=localStorage.key(i);
    if(key&&key.indexOf('spaced_')===0){
      try{
        var other=JSON.parse(localStorage.getItem(key));
        if(other&&other.visits>0){
          totalVisited++;
          var otherNext=other.lastVisit+other.interval*DAY;
          if(now>otherNext){
            dueCount++;
            dueApps.push(key.replace('spaced_',''));
          }else{
            masteredCount++;
          }
        }
      }catch(e){}
    }
  }
  /* inject CSS */
  var style=document.createElement('style');
  style.textContent=''
    +'#spacedPanel{padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.08);}'
    +'#spacedPanel h4{margin:0 0 0.4rem;font-size:0.9rem;}'
    +'.spaced-status{display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0;font-size:0.85rem;}'
    +'.spaced-status .spaced-icon{font-size:1.1rem;}'
    +'.spaced-summary{display:flex;gap:1rem;flex-wrap:wrap;margin:0.5rem 0;font-size:0.75rem;opacity:0.7;}'
    +'.spaced-summary span{white-space:nowrap;}'
    +'.spaced-due-list{margin-top:0.5rem;font-size:0.75rem;max-height:80px;overflow-y:auto;}'
    +'.spaced-due-list a{color:var(--accent,#d4a03c);text-decoration:none;margin-right:0.5rem;}'
    +'.spaced-due-list a:hover{text-decoration:underline;}'
    +'#spacedMarkBtn{padding:0.3rem 0.7rem;border-radius:6px;border:1px solid var(--accent,#d4a03c);background:rgba(var(--accent-rgb,212,175,55),0.15);color:inherit;cursor:pointer;font-size:0.78rem;margin-top:0.4rem;}'
    +'#spacedMarkBtn:hover{background:rgba(var(--accent-rgb,212,175,55),0.3);}';
  document.head.appendChild(style);
  /* build panel */
  var panel=document.createElement('div');
  panel.id='spacedPanel';
  var dueLinksHtml='';
  if(dueApps.length>0){
    dueLinksHtml='<div class="spaced-due-list"><strong>'+(L.spacedDue||'Due for review!')+'</strong><br>';
    dueApps.slice(0,8).forEach(function(d){
      dueLinksHtml+='<a href="../../'+d+'/index.html" title="'+d+'">'+d+'</a> ';
    });
    if(dueApps.length>8)dueLinksHtml+='<span>... +'+(dueApps.length-8)+' more</span>';
    dueLinksHtml+='</div>';
  }
  panel.innerHTML='<h4 data-i18n="spacedTitle">'+(L.spacedTitle||'\U0001f4c5 Spaced Review')+'</h4>'
    +'<div class="spaced-status"><span class="spaced-icon">'+statusIcon+'</span><span>'+status+'</span></div>'
    +'<div class="spaced-summary">'
    +'<span>\U0001f4da '+totalVisited+' visited</span>'
    +'<span>\U0001f534 '+dueCount+' due</span>'
    +'<span>\U0001f7e2 '+masteredCount+' on track</span>'
    +'</div>'
    +'<button id="spacedMarkBtn" data-i18n="spacedReview">\u2705 '+(L.spacedReview||'Mark as Reviewed')+'</button>'
    +dueLinksHtml
    +'<div style="font-size:0.65rem;opacity:0.4;margin-top:0.4rem;" data-i18n="spacedInfo">'+(L.spacedInfo||'Smart review reminders based on the forgetting curve')+'</div>';
  /* insert near sidebar footer or after last collapsible */
  var target=document.querySelector('.sidebar-footer');
  if(target&&target.parentNode){
    target.parentNode.insertBefore(panel,target);
  }else{
    var lastDetails=document.querySelectorAll('details.collapsible');
    if(lastDetails.length>0){
      var ld=lastDetails[lastDetails.length-1];
      ld.parentNode.insertBefore(panel,ld.nextSibling);
    }else{
      var app=document.querySelector('.app')||document.body;
      app.appendChild(panel);
    }
  }
  /* mark as reviewed button */
  var markBtn=document.getElementById('spacedMarkBtn');
  if(markBtn){
    markBtn.addEventListener('click',function(){
      rec.lastVisit=Date.now();
      if(rec.visits>=3){
        rec.interval=Math.round(rec.interval*rec.ease);
        rec.ease=Math.min(3.0,rec.ease+0.1);
      }
      localStorage.setItem(storageKey,JSON.stringify(rec));
      markBtn.textContent='\u2705 '+(L.spacedMastered||'Reviewed!');
      markBtn.disabled=true;
      markBtn.style.opacity='0.5';
    });
  }
}
"""

JS_INIT = """
document.addEventListener('DOMContentLoaded',function(){try{initDifficultyLevels();}catch(e){console.warn('Difficulty init:',e);}try{initSpacedRepetition();}catch(e){console.warn('Spaced init:',e);}});
"""

# ════════════════════════════════════════════════════════════
# HTML panel for spaced repetition
# ════════════════════════════════════════════════════════════

HTML_SPACED = '<div id="spacedPanel"></div>'


# ════════════════════════════════════════════════════════════
# Helper functions
# ════════════════════════════════════════════════════════════

def find_app_dirs():
    """Find all app directories containing script.js and index.html."""
    apps = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        if 'script.js' in filenames and 'index.html' in filenames:
            apps.append(dirpath)
    apps.sort()
    return apps


def inject_lang_keys(content):
    """Inject LANG keys into files using ...LANG_BASE.xx spread markers."""
    modified = False

    # EN block
    m = re.search(r'(\.\.\.LANG_BASE\.en\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + '\n    ' + DIFF_LANG_EN + SPACED_LANG_EN + '\n    ' + content[insert_pos:]
        modified = True

    # FR block
    m = re.search(r'(\.\.\.LANG_BASE\.fr\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + '\n    ' + DIFF_LANG_FR + SPACED_LANG_FR + '\n    ' + content[insert_pos:]
        modified = True

    # AR block
    m = re.search(r'(\.\.\.LANG_BASE\.ar\s*,?)', content)
    if m:
        insert_pos = m.end()
        content = content[:insert_pos] + '\n    ' + DIFF_LANG_AR + SPACED_LANG_AR + '\n    ' + content[insert_pos:]
        modified = True

    return content, modified


def find_lang_block_end(content):
    """Find the closing }; of the LANG block."""
    m = re.search(r'const\s+LANG\s*=\s*\{', content)
    if not m:
        return -1
    start = m.end() - 1  # position of {
    depth = 0
    i = start
    while i < len(content):
        c = content[i]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                j = i + 1
                while j < len(content) and content[j] in ' \t\n':
                    j += 1
                if j < len(content) and content[j] == ';':
                    return j + 1
                return i + 1
        # skip strings to avoid counting braces inside them
        elif c == "'" and i > 0:
            i += 1
            while i < len(content) and content[i] != "'":
                if content[i] == '\\':
                    i += 1
                i += 1
        elif c == '"' and i > 0:
            i += 1
            while i < len(content) and content[i] != '"':
                if content[i] == '\\':
                    i += 1
                i += 1
        elif c == '`':
            i += 1
            while i < len(content) and content[i] != '`':
                if content[i] == '\\':
                    i += 1
                i += 1
        i += 1
    return -1


def clean_previous(content):
    """Remove previously injected difficulty/spaced content so we can re-inject."""
    if 'diffTitle' not in content:
        return content

    # Remove JS function blocks
    content = re.sub(
        r'\n/\* .{0,10}Difficulty Levels .{0,10}\*/\n'
        r'function initDifficultyLevels\(\)\{.*?\n\}\n',
        '\n', content, flags=re.DOTALL)

    content = re.sub(
        r'\n/\* .{0,10}Spaced Repetition .{0,10}\*/\n'
        r'function initSpacedRepetition\(\)\{.*?\n\}\n',
        '\n', content, flags=re.DOTALL)

    # Remove the DOMContentLoaded listener for our features
    content = re.sub(
        r"\ndocument\.addEventListener\('DOMContentLoaded',function\(\)\{"
        r"try\{initDifficultyLevels\(\);\}catch\(e\)\{console\.warn\('Difficulty init:',e\);\}"
        r"try\{initSpacedRepetition\(\);\}catch\(e\)\{console\.warn\('Spaced init:',e\);\}"
        r"\}\);\n",
        '\n', content)

    # Remove injected LANG keys
    DIFF_KEYS = ['diffTitle', 'diffBeginner', 'diffIntermediate', 'diffExpert', 'diffInfo']
    SPACED_KEYS = ['spacedTitle', 'spacedReview', 'spacedNext', 'spacedMastered', 'spacedNew', 'spacedDue', 'spacedInfo']
    ALL_KEYS = DIFF_KEYS + SPACED_KEYS

    lines = content.split('\n')
    new_lines = []
    for line in lines:
        if 'diffTitle:' in line or 'spacedTitle:' in line:
            s = line.strip()
            test = s
            for key in ALL_KEYS:
                test = re.sub(key + r""":'[^']*(?:\\x27[^']*)*',?""", '', test)
            test = test.strip().rstrip(',').strip()
            if test == '' or test == '//':
                continue
            else:
                for key in ALL_KEYS:
                    line = re.sub(key + r""":'[^']*(?:\\x27[^']*)*',?""", '', line)
        new_lines.append(line)
    return '\n'.join(new_lines)


def process_script(app_dir):
    """Process script.js for a single app."""
    path = os.path.join(app_dir, 'script.js')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Clean any previous injection
    content = clean_previous(content)

    # Check LANG block exists
    if 'LANG_BASE' not in content:
        return 'no_lang'

    # Inject LANG keys
    content, modified = inject_lang_keys(content)
    if not modified:
        return 'no_inject'

    # Find end of LANG block and inject JS functions
    lang_end = find_lang_block_end(content)
    if lang_end == -1:
        return 'no_lang_end'

    content = content[:lang_end] + '\n' + JS_DIFFICULTY + JS_SPACED + JS_INIT + '\n' + content[lang_end:]

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    return 'ok'


def process_html(app_dir):
    """Process index.html — insert spacedPanel placeholder."""
    path = os.path.join(app_dir, 'index.html')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Clean previous injection
    if 'spacedPanel' in content:
        content = re.sub(r'\s*<div id="spacedPanel"></div>\s*', '\n', content)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)

    # Insert before sidebar-footer or before </body>
    m = re.search(r'(<div\s+class="sidebar-footer")', content)
    if m:
        content = content[:m.start()] + HTML_SPACED + '\n' + content[m.start():]
    else:
        m = re.search(r'</body>', content, re.IGNORECASE)
        if m:
            content = content[:m.start()] + HTML_SPACED + '\n' + content[m.start():]
        else:
            return 'no_insert'

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    return 'ok'


def main():
    apps = find_app_dirs()
    print(f"Found {len(apps)} apps")

    stats = {'ok': 0, 'skip': 0, 'no_lang': 0, 'no_inject': 0, 'no_lang_end': 0,
             'html_ok': 0, 'html_skip': 0, 'errors': 0}

    for app_dir in apps:
        rel = os.path.relpath(app_dir, ROOT)
        try:
            result = process_script(app_dir)
            stats[result] = stats.get(result, 0) + 1

            html_result = process_html(app_dir)
            if html_result == 'ok':
                stats['html_ok'] += 1
            elif html_result == 'skip':
                stats['html_skip'] += 1

            if result == 'ok':
                print(f"  [OK] {rel}")
            elif result != 'skip':
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
    print(f"  HTML injected OK:    {stats['html_ok']}")
    print(f"  HTML already done:   {stats['html_skip']}")
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

    print(f"\n  Syntax OK:   {syntax_ok}/{syntax_ok+syntax_fail}")
    print(f"  Syntax FAIL: {syntax_fail}/{syntax_ok+syntax_fail}")
    print(f"\nDone!")


if __name__ == '__main__':
    main()
