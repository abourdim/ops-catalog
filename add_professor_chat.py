#!/usr/bin/env python3
"""Add AI Professor Chat feature to all 488 apps in ops-catalog."""

import os, re, glob, subprocess, random

ROOT = os.path.dirname(os.path.abspath(__file__))


def get_category(dirpath):
    """Extract domain keyword from the category directory name."""
    parts = dirpath.replace(ROOT, '').strip('/').split('/')
    if len(parts) >= 1:
        cat = parts[0]
        cat = re.sub(r'^\d+-', '', cat)
        return cat.replace('-', ' ')
    return 'technology'


def get_app_name(dirpath):
    """Extract short app name from directory."""
    return os.path.basename(dirpath)


# ── LANG key strings ──

def make_en_keys(category, app_name):
    pretty = app_name.replace('-', ' ').title()
    cat = category.title()
    return (
        "profTitle:'Professor',"
        "profGreet:'Hello Agent! I\\x27m Professor Workshop. Ask me anything about " + pretty + "!',"
        "profWhat:'What is this?',"
        "profHow:'How does it work?',"
        "profWhy:'Why is this important?',"
        "profChallenge:'Give me a challenge',"
        "profMore:'Tell me more',"
        "profQuiz:'Quiz me',"
        "profUnknown:'Good question! Try exploring the " + cat + " features to find out.',"
        "profPlaceholder:'Ask the professor...',"
    )


def make_fr_keys(category, app_name):
    pretty = app_name.replace('-', ' ').title()
    cat = category.title()
    return (
        "profTitle:'Professeur',"
        "profGreet:'Bonjour Agent ! Je suis le Professeur Atelier. Pose-moi n\\x27importe quelle question sur " + pretty + " !',"
        "profWhat:'C\\x27est quoi ?',"
        "profHow:'Comment \\xe7a marche ?',"
        "profWhy:'Pourquoi c\\x27est important ?',"
        "profChallenge:'Donne-moi un d\\xe9fi',"
        "profMore:'Dis-moi plus',"
        "profQuiz:'Teste-moi',"
        "profUnknown:'Bonne question ! Essaie d\\x27explorer les fonctions de " + cat + " pour le d\\xe9couvrir.',"
        "profPlaceholder:'Demande au professeur...',"
    )


def make_ar_keys(category, app_name):
    return (
        "profTitle:'\u0627\u0644\u0623\u0633\u062a\u0627\u0630',"
        "profGreet:'\u0645\u0631\u062d\u0628\u0627 \u0623\u064a\u0647\u0627 \u0627\u0644\u0639\u0645\u064a\u0644! \u0623\u0646\u0627 \u0627\u0644\u0623\u0633\u062a\u0627\u0630 \u0648\u0631\u0634\u0629. \u0627\u0633\u0623\u0644\u0646\u064a \u0623\u064a \u0634\u064a\u0621!',"
        "profWhat:'\u0645\u0627 \u0647\u0630\u0627\u061f',"
        "profHow:'\u0643\u064a\u0641 \u064a\u0639\u0645\u0644\u061f',"
        "profWhy:'\u0644\u0645\u0627\u0630\u0627 \u0647\u0630\u0627 \u0645\u0647\u0645\u061f',"
        "profChallenge:'\u0623\u0639\u0637\u0646\u064a \u062a\u062d\u062f\u064a\u0627',"
        "profMore:'\u0623\u062e\u0628\u0631\u0646\u064a \u0627\u0644\u0645\u0632\u064a\u062f',"
        "profQuiz:'\u0627\u062e\u062a\u0628\u0631\u0646\u064a',"
        "profUnknown:'\u0633\u0624\u0627\u0644 \u062c\u064a\u062f! \u062d\u0627\u0648\u0644 \u0627\u0633\u062a\u0643\u0634\u0627\u0641 \u0627\u0644\u0645\u064a\u0632\u0627\u062a \u0644\u0645\u0639\u0631\u0641\u0629 \u0627\u0644\u0625\u062c\u0627\u0628\u0629.',"
        "profPlaceholder:'\u0627\u0633\u0623\u0644 \u0627\u0644\u0623\u0633\u062a\u0627\u0630...',"
    )


# ── JS function to append ──
JS_FUNCTIONS = r"""
/* ═══════ PROFESSOR CHAT ═══════ */
function initProfessorChat(){
  var L=LANG[document.documentElement.lang||'en'];
  if(!L||!L.profTitle)return;
  var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
  var storageKey='profChat_'+appDir;
  var isOpen=false;
  var history=[];
  try{var saved=sessionStorage.getItem(storageKey);if(saved)history=JSON.parse(saved);}catch(e){}
  var greeted=history.length>0;

  /* ── floating button ── */
  var fab=document.createElement('button');
  fab.className='btn-icon-only';
  fab.setAttribute('aria-label',L.profTitle||'Professor');
  fab.textContent='\uD83C\uDF93';
  fab.style.cssText='position:fixed;bottom:18px;left:18px;z-index:10100;width:48px;height:48px;border-radius:50%;border:2px solid var(--accent,#d4af37);background:var(--card-bg,#1a1a2e);color:#fff;font-size:1.5rem;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;transition:transform 0.2s;';
  fab.onmouseenter=function(){fab.style.transform='scale(1.15)';};
  fab.onmouseleave=function(){fab.style.transform='scale(1)';};
  document.body.appendChild(fab);

  /* ── chat panel ── */
  var panel=document.createElement('div');
  panel.id='profChatPanel';
  panel.style.cssText='position:fixed;bottom:75px;left:18px;z-index:10101;width:300px;height:400px;background:var(--card-bg,#12121f);border:1px solid var(--accent,#d4af37);border-radius:12px;display:none;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,0.6);font-family:inherit;overflow:hidden;';

  /* header */
  var hdr=document.createElement('div');
  hdr.style.cssText='display:flex;align-items:center;gap:8px;padding:10px 12px;background:rgba(212,175,55,0.12);border-bottom:1px solid rgba(212,175,55,0.2);flex-shrink:0;';
  var avatar=document.createElement('div');
  avatar.style.cssText='width:32px;height:32px;border-radius:50%;background:var(--accent,#d4af37);display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.9rem;color:#000;flex-shrink:0;';
  avatar.textContent='P';
  var hdrTitle=document.createElement('span');
  hdrTitle.style.cssText='font-weight:600;font-size:0.95rem;color:var(--text,#eee);flex:1;';
  hdrTitle.textContent=L.profTitle||'Professor';
  var closeBtn=document.createElement('button');
  closeBtn.textContent='\u2715';
  closeBtn.style.cssText='background:none;border:none;color:var(--text,#aaa);font-size:1.1rem;cursor:pointer;padding:2px 6px;';
  closeBtn.onclick=function(){togglePanel(false);};
  hdr.appendChild(avatar);hdr.appendChild(hdrTitle);hdr.appendChild(closeBtn);
  panel.appendChild(hdr);

  /* messages area */
  var msgs=document.createElement('div');
  msgs.id='profMsgs';
  msgs.style.cssText='flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;';
  panel.appendChild(msgs);

  /* quick buttons */
  var qbar=document.createElement('div');
  qbar.style.cssText='display:flex;flex-wrap:wrap;gap:4px;padding:6px 10px;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0;';
  var quickKeys=[
    {key:'profWhat',fallback:'What is this?'},
    {key:'profHow',fallback:'How does it work?'},
    {key:'profWhy',fallback:'Why is this important?'},
    {key:'profChallenge',fallback:'Give me a challenge'}
  ];
  quickKeys.forEach(function(q){
    var qb=document.createElement('button');
    qb.textContent=L[q.key]||q.fallback;
    qb.style.cssText='font-size:0.7rem;padding:3px 8px;border-radius:12px;border:1px solid rgba(212,175,55,0.3);background:rgba(212,175,55,0.08);color:var(--text,#ccc);cursor:pointer;white-space:nowrap;';
    qb.onclick=function(){handleUserMsg(L[q.key]||q.fallback);};
    qbar.appendChild(qb);
  });
  panel.appendChild(qbar);

  /* input area */
  var ibar=document.createElement('div');
  ibar.style.cssText='display:flex;gap:6px;padding:8px 10px;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0;';
  var inp=document.createElement('input');
  inp.type='text';
  inp.placeholder=L.profPlaceholder||'Ask the professor...';
  inp.style.cssText='flex:1;padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:var(--text,#eee);font-size:0.85rem;outline:none;';
  inp.onkeydown=function(e){if(e.key==='Enter'&&inp.value.trim()){handleUserMsg(inp.value.trim());inp.value='';}};
  var sendBtn=document.createElement('button');
  sendBtn.textContent='\u27A4';
  sendBtn.style.cssText='padding:6px 10px;border-radius:8px;border:1px solid var(--accent,#d4af37);background:rgba(212,175,55,0.15);color:var(--accent,#d4af37);cursor:pointer;font-size:0.9rem;';
  sendBtn.onclick=function(){if(inp.value.trim()){handleUserMsg(inp.value.trim());inp.value='';}};
  ibar.appendChild(inp);ibar.appendChild(sendBtn);
  panel.appendChild(ibar);
  document.body.appendChild(panel);

  /* ── helpers ── */
  function addBubble(text,isUser,typewriter){
    var bub=document.createElement('div');
    bub.style.cssText='max-width:85%;padding:8px 12px;border-radius:10px;font-size:0.82rem;line-height:1.45;word-wrap:break-word;'+(isUser?'align-self:flex-end;background:rgba(212,175,55,0.18);color:var(--text,#eee);':'align-self:flex-start;background:rgba(255,255,255,0.07);color:var(--text,#ddd);');
    msgs.appendChild(bub);
    msgs.scrollTop=msgs.scrollHeight;
    if(typewriter&&!isUser){
      var i=0;bub.textContent='';
      var iv=setInterval(function(){if(i<text.length){bub.textContent+=text[i];i++;msgs.scrollTop=msgs.scrollHeight;}else{clearInterval(iv);}},30);
    }else{
      bub.textContent=text;
    }
    return bub;
  }

  function saveHistory(){
    try{sessionStorage.setItem(storageKey,JSON.stringify(history.slice(-50)));}catch(e){}
  }

  function getAnswer(q){
    var ql=q.toLowerCase();
    /* What is this? */
    if(ql.indexOf('what')>=0||ql.indexOf('quoi')>=0||ql.indexOf('\u0645\u0627 ')>=0||ql===((L.profWhat||'').toLowerCase())){
      return L.mainDesc||L.subtitle||'This is an interactive workshop app.';
    }
    /* How does it work? */
    if(ql.indexOf('how')>=0||ql.indexOf('comment')>=0||ql.indexOf('marche')>=0||ql.indexOf('\u0643\u064a\u0641')>=0||ql===((L.profHow||'').toLowerCase())){
      var parts=[];
      if(L.step1Desc)parts.push(L.step1Desc);
      if(L.step2Desc)parts.push(L.step2Desc);
      if(L.step3Desc)parts.push(L.step3Desc);
      return parts.length?parts.join(' \u2192 '):(L.mainDesc||'Explore the controls to see how it works!');
    }
    /* Why is this important? */
    if(ql.indexOf('why')>=0||ql.indexOf('important')>=0||ql.indexOf('pourquoi')>=0||ql.indexOf('\u0644\u0645\u0627\u0630\u0627')>=0||ql===((L.profWhy||'').toLowerCase())){
      var r=L.purpose||'';
      if(!r){var lp=[];for(var k=1;k<=4;k++){if(L['learn'+k])lp.push(L['learn'+k]);}r=lp.join(' ');}
      return r||'Understanding these concepts builds real-world skills!';
    }
    /* Give me a challenge */
    if(ql.indexOf('challenge')>=0||ql.indexOf('d\xe9fi')>=0||ql.indexOf('\u062a\u062d\u062f\u064a')>=0||ql===((L.profChallenge||'').toLowerCase())){
      return L.challenge1||L.daily_d1||'Try changing every parameter and observe the results!';
    }
    /* Tell me more */
    if(ql.indexOf('more')>=0||ql.indexOf('plus')>=0||ql.indexOf('\u0627\u0644\u0645\u0632\u064a\u062f')>=0||ql===((L.profMore||'').toLowerCase())){
      var wk=[];for(var w=1;w<=5;w++){if(L['wiki'+w+'_title'])wk.push(L['wiki'+w+'_title']+': '+( L['wiki'+w+'_text']||''));}
      return wk.length?wk.join(' | '):(L.mainDesc||'Explore the Wiki tab for deeper knowledge!');
    }
    /* Quiz me */
    if(ql.indexOf('quiz')>=0||ql.indexOf('test')>=0||ql.indexOf('\u0627\u062e\u062a\u0628\u0631')>=0||ql===((L.profQuiz||'').toLowerCase())){
      if(typeof initQuizMode==='function'){try{initQuizMode();}catch(e){}}
      return L.quiz_q1||(L.challenge1?'Here is a challenge: '+L.challenge1:'Try the Quiz feature if available!');
    }
    /* Unknown */
    return L.profUnknown||'Good question! Try exploring the features to find out.';
  }

  function handleUserMsg(text){
    history.push({r:'u',t:text});
    addBubble(text,true,false);
    var answer=getAnswer(text);
    history.push({r:'p',t:answer});
    saveHistory();
    setTimeout(function(){addBubble(answer,false,true);},300);
  }

  function togglePanel(show){
    isOpen=typeof show==='boolean'?show:!isOpen;
    panel.style.display=isOpen?'flex':'none';
    if(isOpen&&!greeted){
      greeted=true;
      var greet=L.profGreet||('Hello Agent! I\x27m Professor Workshop. Ask me anything!');
      history.push({r:'p',t:greet});
      saveHistory();
      addBubble(greet,false,true);
    }
    if(isOpen)inp.focus();
  }

  /* restore history */
  function restoreHistory(){
    history.forEach(function(m){addBubble(m.t,m.r==='u',false);});
  }

  fab.onclick=function(){togglePanel();};

  /* restore on load if history exists */
  if(history.length>0){restoreHistory();}
}
"""

# DOMContentLoaded listener line
JS_INIT = "document.addEventListener('DOMContentLoaded',function(){try{initProfessorChat();}catch(e){console.warn('ProfessorChat init:',e);}});\n"


def process_script(filepath):
    """Inject LANG keys and JS functions into script.js. Returns True if modified."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Idempotency check
    if 'profTitle' in content:
        return False

    dirpath = os.path.dirname(filepath)
    category = get_category(dirpath)
    app_name = get_app_name(dirpath)

    en_keys = make_en_keys(category, app_name)
    fr_keys = make_fr_keys(category, app_name)
    ar_keys = make_ar_keys(category, app_name)

    # ── Inject LANG keys ──
    # Strategy: inject after sandboxReset in each language block
    # EN: after sandboxReset:'Reset Defaults',
    en_anchor = "sandboxReset:'Reset Defaults',"
    if en_anchor in content:
        content = content.replace(en_anchor, en_anchor + en_keys, 1)
    else:
        # Fallback: inject after first occurrence of "en: {" line's morseSecret block
        m = re.search(r"(en:\s*\{morseSecret:'[^']*',)", content)
        if m:
            content = content[:m.end()] + en_keys + content[m.end():]

    # FR: after sandboxReset for fr block (file has literal \x27 = 4 chars)
    fr_anchor = "sandboxReset:'R\\x27initialiser',"
    if fr_anchor in content:
        content = content.replace(fr_anchor, fr_anchor + fr_keys, 1)
    else:
        # Fallback: find fr:{ block and inject after morseDecoded key
        fr_match = re.search(r"(fr:\s*\{[^}]*?sandboxReset:'[^']*',)", content)
        if fr_match:
            content = content[:fr_match.end()] + fr_keys + content[fr_match.end():]

    # AR: after sandboxReset for ar block
    ar_anchor = "sandboxReset:'\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u062a\u0639\u064a\u064a\u0646',"
    if ar_anchor in content:
        content = content.replace(ar_anchor, ar_anchor + ar_keys, 1)
    else:
        # Fallback: find ar:{ block and inject after first key
        m = re.search(r"(ar:\s*\{morseSecret:'[^']*',)", content)
        if m:
            content = content[:m.end()] + ar_keys + content[m.end():]

    # ── Inject JS functions after the LANG block closing ──
    # Find the first standalone '};' after 'const LANG'
    lang_pos = content.find('const LANG')
    if lang_pos >= 0:
        lines = content.split('\n')
        char_count = 0
        lang_line = 0
        for i, line in enumerate(lines):
            if char_count <= lang_pos < char_count + len(line) + 1:
                lang_line = i
                break
            char_count += len(line) + 1

        # Find first standalone '};' after lang_line
        inserted = False
        for i in range(lang_line + 1, len(lines)):
            if lines[i].strip() == '};':
                lines.insert(i + 1, JS_FUNCTIONS)
                lines.insert(i + 2, JS_INIT)
                content = '\n'.join(lines)
                inserted = True
                break

        if not inserted:
            # Fallback: append at end
            content += '\n' + JS_FUNCTIONS + '\n' + JS_INIT

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    return True


def main():
    pattern = os.path.join(ROOT, '*', '*', 'script.js')
    scripts = sorted(glob.glob(pattern))

    print(f'Found {len(scripts)} script.js files')

    modified = 0
    skipped = 0
    errors = []

    for script_path in scripts:
        try:
            if process_script(script_path):
                modified += 1
            else:
                skipped += 1
        except Exception as e:
            errors.append(f'{script_path}: {e}')

    print(f'\n--- RESULTS ---')
    print(f'script.js modified: {modified}')
    print(f'script.js skipped (already had profTitle): {skipped}')
    if errors:
        print(f'\nERRORS ({len(errors)}):')
        for e in errors:
            print(f'  {e}')

    # Syntax check with node -c on 30 random sample files
    print(f'\n--- SYNTAX VALIDATION (node -c) ---')
    random.seed(42)
    sample = random.sample(scripts, min(30, len(scripts)))
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
    print(f'Total apps processed: {modified + skipped}')
    print(f'Professor Chat added to: {modified} apps')
    print(f'Already had feature: {skipped}')
    print(f'Errors: {len(errors)}')


if __name__ == '__main__':
    main()
