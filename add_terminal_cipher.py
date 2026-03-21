#!/usr/bin/env python3
"""Add Mini Terminal + Cipher Toolkit to all 488 apps in ops-catalog."""

import os, re, subprocess, random

ROOT = os.path.dirname(os.path.abspath(__file__))

# ══════════════════════════════════════════════════════════════════
# LANG keys — Terminal
# ══════════════════════════════════════════════════════════════════

TERM_LANG_EN = (
    "termTitle:'>_ Terminal',"
    "termPlaceholder:'Type a command...',"
    "termHelp:'Commands: help, start, stop, reset, theme [name], lang [en|fr|ar], set [param] [value], get [param], list, export, clear, status, about, cipher',"
    "termUnknown:'Unknown command. Type help for available commands.',"
    "termWelcome:'Terminal ready. Type help to get started.',"
)

TERM_LANG_FR = (
    "termTitle:'>_ Terminal',"
    "termPlaceholder:'Tapez une commande...',"
    "termHelp:'Commandes : help, start, stop, reset, theme [nom], lang [en|fr|ar], set [param] [valeur], get [param], list, export, clear, status, about, cipher',"
    "termUnknown:'Commande inconnue. Tapez help pour la liste.',"
    "termWelcome:'Terminal pr\\x eat. Tapez help pour commencer.',"
).replace("pr\\x eat", "pr\\x27et")
# fix: build the \x27 properly
TERM_LANG_FR = (
    "termTitle:'>_ Terminal',"
    "termPlaceholder:'Tapez une commande...',"
    "termHelp:'Commandes : help, start, stop, reset, theme [nom], lang [en|fr|ar], set [param] [valeur], get [param], list, export, clear, status, about, cipher',"
    "termUnknown:'Commande inconnue. Tapez help pour la liste.',"
    "termWelcome:'Terminal pr\\x27et. Tapez help pour commencer.',"
)

TERM_LANG_AR = (
    "termTitle:'>_ \u0627\u0644\u0637\u0631\u0641\u064a\u0629',"
    "termPlaceholder:'\u0627\u0643\u062a\u0628 \u0623\u0645\u0631\u0627\u064b...',"
    "termHelp:'\u0627\u0644\u0623\u0648\u0627\u0645\u0631: help, start, stop, reset, theme, lang, set, get, list, export, clear, status, about, cipher',"
    "termUnknown:'\u0623\u0645\u0631 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641. \u0627\u0643\u062a\u0628 help \u0644\u0644\u0645\u0633\u0627\u0639\u062f\u0629.',"
    "termWelcome:'\u0627\u0644\u0637\u0631\u0641\u064a\u0629 \u062c\u0627\u0647\u0632\u0629. \u0627\u0643\u062a\u0628 help \u0644\u0644\u0628\u062f\u0621.',"
)

# ══════════════════════════════════════════════════════════════════
# LANG keys — Cipher Toolkit
# ══════════════════════════════════════════════════════════════════

CIPHER_LANG_EN = (
    "cipherTitle:'\U0001f510 Cipher Toolkit',"
    "cipherInput:'Input text',"
    "cipherOutput:'Output',"
    "cipherEncode:'Encode',"
    "cipherDecode:'Decode',"
    "cipherMethod:'Method',"
    "cipherKey:'Key',"
    "cipherCopy:'Copy',"
)

CIPHER_LANG_FR = (
    "cipherTitle:'\U0001f510 Bo\\x27ite \\x27a chiffrement',"
).replace("Bo\\x27ite \\x27a", "Bo\\xeete \\xe0")
# fix: proper French
CIPHER_LANG_FR = (
    "cipherTitle:'\U0001f510 Chiffrement',"
    "cipherInput:'Texte source',"
    "cipherOutput:'R\\xe9sultat',"
    "cipherEncode:'Encoder',"
    "cipherDecode:'D\\xe9coder',"
    "cipherMethod:'M\\xe9thode',"
    "cipherKey:'Cl\\xe9',"
    "cipherCopy:'Copier',"
)

CIPHER_LANG_AR = (
    "cipherTitle:'\U0001f510 \u0623\u062f\u0648\u0627\u062a \u0627\u0644\u062a\u0634\u0641\u064a\u0631',"
    "cipherInput:'\u0627\u0644\u0646\u0635 \u0627\u0644\u0645\u062f\u062e\u0644',"
    "cipherOutput:'\u0627\u0644\u0646\u062a\u064a\u062c\u0629',"
    "cipherEncode:'\u062a\u0634\u0641\u064a\u0631',"
    "cipherDecode:'\u0641\u0643 \u0627\u0644\u062a\u0634\u0641\u064a\u0631',"
    "cipherMethod:'\u0627\u0644\u0637\u0631\u064a\u0642\u0629',"
    "cipherKey:'\u0627\u0644\u0645\u0641\u062a\u0627\u062d',"
    "cipherCopy:'\u0646\u0633\u062e',"
)

# ══════════════════════════════════════════════════════════════════
# JS — Mini Terminal
# ══════════════════════════════════════════════════════════════════

JS_TERMINAL = r"""
/* ═══════ Mini Terminal ═══════ */
function initTerminal(){
  if(document.getElementById('miniTerminal')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var visible=false, history=[], histIdx=-1, MAX_LINES=100;
  var wrap=document.createElement('div');wrap.id='miniTerminal';
  wrap.style.cssText='position:fixed;bottom:0;left:0;right:0;height:260px;background:#0a0a0a;border-top:2px solid #0f0;z-index:99999;display:none;flex-direction:column;font-family:monospace;font-size:13px;transition:transform 0.25s ease;transform:translateY(100%);';
  var hdr=document.createElement('div');hdr.style.cssText='display:flex;align-items:center;padding:4px 10px;background:#111;border-bottom:1px solid #0f0;color:#0f0;';
  hdr.innerHTML='<span style="flex:1;font-weight:bold;" data-i18n="termTitle">'+(L.termTitle||'>_ Terminal')+'</span><button id="termCloseBtn" style="background:none;border:none;color:#0f0;font-size:18px;cursor:pointer;">\u2715</button>';
  var out=document.createElement('div');out.id='termOutput';out.style.cssText='flex:1;overflow-y:auto;padding:8px 10px;color:#0f0;white-space:pre-wrap;word-break:break-all;';
  var row=document.createElement('div');row.style.cssText='display:flex;align-items:center;padding:4px 10px;background:#111;border-top:1px solid #222;';
  row.innerHTML='<span style="color:#0f0;margin-right:6px;">$</span>';
  var inp=document.createElement('input');inp.id='termInput';inp.type='text';inp.setAttribute('autocomplete','off');inp.setAttribute('spellcheck','false');inp.placeholder=L.termPlaceholder||'Type a command...';
  inp.style.cssText='flex:1;background:transparent;border:none;outline:none;color:#0f0;font-family:monospace;font-size:13px;caret-color:#0f0;';
  row.appendChild(inp);wrap.appendChild(hdr);wrap.appendChild(out);wrap.appendChild(row);document.body.appendChild(wrap);
  var togBtn=document.createElement('button');togBtn.id='termToggleBtn';togBtn.textContent='>_';togBtn.title='Terminal';
  togBtn.style.cssText='position:fixed;bottom:10px;right:10px;z-index:99998;width:40px;height:40px;border-radius:50%;background:#111;color:#0f0;border:1px solid #0f0;font-family:monospace;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0.7;transition:opacity 0.2s;';
  togBtn.onmouseenter=function(){this.style.opacity='1';};togBtn.onmouseleave=function(){this.style.opacity='0.7';};
  document.body.appendChild(togBtn);
  function show(){wrap.style.display='flex';setTimeout(function(){wrap.style.transform='translateY(0)';},10);visible=true;inp.focus();}
  function hide(){wrap.style.transform='translateY(100%)';setTimeout(function(){wrap.style.display='none';},260);visible=false;}
  function toggle(){visible?hide():show();}
  togBtn.addEventListener('click',toggle);
  document.getElementById('termCloseBtn').addEventListener('click',hide);
  document.addEventListener('keydown',function(e){if(e.key==='`'&&!e.ctrlKey&&!e.altKey&&document.activeElement!==inp&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA'){e.preventDefault();toggle();}});
  function appendLine(txt,color){
    var d=document.createElement('div');d.style.color=color||'#0f0';d.textContent=txt;out.appendChild(d);
    while(out.children.length>MAX_LINES)out.removeChild(out.firstChild);
    out.scrollTop=out.scrollHeight;
  }
  appendLine(L.termWelcome||'Terminal ready. Type help to get started.','#0f0');
  function exec(cmd){
    cmd=cmd.trim();if(!cmd)return;
    history.push(cmd);histIdx=history.length;
    appendLine('> '+cmd,'#888');
    var parts=cmd.split(/\s+/),c=parts[0].toLowerCase(),args=parts.slice(1);
    switch(c){
      case 'help':appendLine(L.termHelp||'Commands: help, start, stop, reset, theme, lang, set, get, list, export, clear, status, about, cipher','#0f0');break;
      case 'start':if(typeof window.startSim==='function'){window.startSim();appendLine('Simulation started.','#0f0');}else{var sb=document.querySelector('[onclick*="start"]')||document.getElementById('startBtn');if(sb){sb.click();appendLine('Start triggered.','#0f0');}else appendLine('No start function found.','#f44');}break;
      case 'stop':if(typeof window.stopSim==='function'){window.stopSim();appendLine('Simulation stopped.','#0f0');}else{var sb2=document.querySelector('[onclick*="stop"]')||document.getElementById('stopBtn');if(sb2){sb2.click();appendLine('Stop triggered.','#0f0');}else appendLine('No stop function found.','#f44');}break;
      case 'reset':if(typeof window.resetSim==='function'){window.resetSim();appendLine('Simulation reset.','#0f0');}else{var sb3=document.querySelector('[onclick*="reset"]')||document.getElementById('resetBtn');if(sb3){sb3.click();appendLine('Reset triggered.','#0f0');}else appendLine('No reset function found.','#f44');}break;
      case 'theme':if(args[0]&&typeof window.setTheme==='function'){window.setTheme(args[0]);appendLine('Theme set to '+args[0],'#0f0');}else if(!args[0]){appendLine('Usage: theme [name] — mosque, zellige, andalus, riad, medina, space, jungle, robot','#ff0');}else{appendLine('setTheme not available.','#f44');}break;
      case 'lang':if(args[0]&&/^(en|fr|ar)$/.test(args[0])){document.documentElement.lang=args[0];if(typeof window.applyLang==='function')window.applyLang(args[0]);appendLine('Language set to '+args[0],'#0f0');}else{appendLine('Usage: lang [en|fr|ar]','#ff0');}break;
      case 'set':if(args.length>=2){var sliders=document.querySelectorAll('input[type=range]');var found=false;sliders.forEach(function(s){var lbl=s.parentElement?s.parentElement.textContent.toLowerCase():'';if(lbl.indexOf(args[0].toLowerCase())!==-1){s.value=parseFloat(args[1]);s.dispatchEvent(new Event('input',{bubbles:true}));found=true;appendLine('Set '+args[0]+' = '+args[1],'#0f0');}});if(!found)appendLine('Parameter "'+args[0]+'" not found.','#f44');}else{appendLine('Usage: set [param] [value]','#ff0');}break;
      case 'get':if(args[0]){var sliders2=document.querySelectorAll('input[type=range]');var found2=false;sliders2.forEach(function(s){var lbl=s.parentElement?s.parentElement.textContent.toLowerCase():'';if(lbl.indexOf(args[0].toLowerCase())!==-1){appendLine(args[0]+' = '+s.value,'#0f0');found2=true;}});if(!found2)appendLine('Parameter "'+args[0]+'" not found.','#f44');}else{appendLine('Usage: get [param]','#ff0');}break;
      case 'list':var sliders3=document.querySelectorAll('input[type=range]');if(sliders3.length===0){appendLine('No parameters found.','#ff0');}else{sliders3.forEach(function(s){var lbl=(s.previousElementSibling?s.previousElementSibling.textContent:s.parentElement?s.parentElement.textContent:'?').trim().substring(0,40);appendLine('  '+lbl+' = '+s.value,'#0f0');});}break;
      case 'export':if(typeof window.exportLog==='function'){window.exportLog();appendLine('Export triggered.','#0f0');}else{appendLine('No export function available.','#f44');}break;
      case 'clear':out.innerHTML='';break;
      case 'status':var st=document.getElementById('statusText');appendLine('Status: '+(st?st.textContent:'unknown'),'#0f0');var sliders4=document.querySelectorAll('input[type=range]');appendLine('Parameters: '+sliders4.length,'#0f0');appendLine('Language: '+(document.documentElement.lang||'en'),'#0f0');break;
      case 'about':var ti=document.querySelector('[data-i18n="title"]');appendLine('App: '+(ti?ti.textContent:'Unknown'),'#0f0');appendLine('Framework: Vanilla JS + HTML5 Canvas','#0f0');appendLine('Trilingual: EN / FR / AR','#0f0');break;
      case 'cipher':if(typeof window.toggleCipherToolkit==='function'){window.toggleCipherToolkit();appendLine('Cipher toolkit opened.','#0f0');}else{appendLine('Cipher toolkit not available.','#f44');}break;
      default:appendLine(L.termUnknown||'Unknown command. Type help for available commands.','#f44');
    }
  }
  inp.addEventListener('keydown',function(e){
    if(e.key==='Enter'){exec(inp.value);inp.value='';}
    else if(e.key==='ArrowUp'){e.preventDefault();if(histIdx>0){histIdx--;inp.value=history[histIdx];}}
    else if(e.key==='ArrowDown'){e.preventDefault();if(histIdx<history.length-1){histIdx++;inp.value=history[histIdx];}else{histIdx=history.length;inp.value='';}}
  });
}
document.addEventListener('DOMContentLoaded',function(){try{initTerminal();}catch(e){console.warn('Terminal init:',e);}});
"""

# ══════════════════════════════════════════════════════════════════
# JS — Cipher Toolkit
# ══════════════════════════════════════════════════════════════════

JS_CIPHER = r"""
/* ═══════ Cipher Toolkit ═══════ */
function initCipherToolkit(){
  if(document.getElementById('cipherModal')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var MORSE={'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','.'  :'.-.-.-',','  :'--..--','?'  :'..--..',' ':' / '};
  var RMORSE={};for(var k in MORSE)RMORSE[MORSE[k]]=k;
  function caesar(t,n,dec){n=parseInt(n)||3;if(dec)n=26-n;return t.replace(/[a-zA-Z]/g,function(c){var base=c<='Z'?65:97;return String.fromCharCode((c.charCodeAt(0)-base+n)%26+base);});}
  function xorCipher(t,key){if(!key)key='K';var o='';for(var i=0;i<t.length;i++){o+=String.fromCharCode(t.charCodeAt(i)^key.charCodeAt(i%key.length));}return o;}
  function toMorse(t){return t.toUpperCase().split('').map(function(c){return MORSE[c]||c;}).join(' ');}
  function fromMorse(t){return t.split(' / ').map(function(w){return w.split(' ').map(function(c){return RMORSE[c]||c;}).join('');}).join(' ');}
  function rot13(t){return caesar(t,13,false);}
  function atbash(t){return t.replace(/[a-zA-Z]/g,function(c){var base=c<='Z'?65:97;return String.fromCharCode(base+25-(c.charCodeAt(0)-base));});}
  function toBin(t){return t.split('').map(function(c){return ('00000000'+c.charCodeAt(0).toString(2)).slice(-8);}).join(' ');}
  function fromBin(t){return t.trim().split(/\s+/).map(function(b){return String.fromCharCode(parseInt(b,2));}).join('');}
  function encode(t,m,key){switch(m){case 'caesar':return caesar(t,key,false);case 'xor':return btoa(xorCipher(t,key));case 'morse':return toMorse(t);case 'base64':return btoa(unescape(encodeURIComponent(t)));case 'rot13':return rot13(t);case 'atbash':return atbash(t);case 'binary':return toBin(t);default:return t;}}
  function decode(t,m,key){switch(m){case 'caesar':return caesar(t,key,true);case 'xor':try{return xorCipher(atob(t),key);}catch(e){return 'Invalid input';}case 'morse':return fromMorse(t);case 'base64':try{return decodeURIComponent(escape(atob(t)));}catch(e){return 'Invalid Base64';}case 'rot13':return rot13(t);case 'atbash':return atbash(t);case 'binary':return fromBin(t);default:return t;}}
  var overlay=document.createElement('div');overlay.id='cipherOverlay';
  overlay.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:100000;display:none;align-items:center;justify-content:center;';
  var modal=document.createElement('div');modal.id='cipherModal';
  modal.style.cssText='background:#1a1a2e;border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:1.2rem;width:92%;max-width:420px;color:#e8e8e8;font-family:system-ui,sans-serif;max-height:90vh;overflow-y:auto;';
  modal.innerHTML='<div style="display:flex;align-items:center;margin-bottom:0.8rem;"><span style="flex:1;font-weight:bold;font-size:1.05rem;" data-i18n="cipherTitle">'+(L.cipherTitle||'\uD83D\uDD10 Cipher Toolkit')+'</span><button id="cipherCloseBtn" style="background:none;border:none;color:#e8e8e8;font-size:20px;cursor:pointer;">\u2715</button></div>'
    +'<textarea id="cipherIn" rows="3" placeholder="'+(L.cipherInput||'Input text')+'" style="width:100%;box-sizing:border-box;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.6rem;font-size:0.9rem;resize:vertical;margin-bottom:0.6rem;" data-i18n-placeholder="cipherInput"></textarea>'
    +'<div style="display:flex;gap:0.5rem;margin-bottom:0.6rem;flex-wrap:wrap;">'
    +'<select id="cipherMethod" style="flex:1;min-width:120px;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.4rem;font-size:0.85rem;"><option value="caesar">Caesar</option><option value="xor">XOR</option><option value="morse">Morse</option><option value="base64">Base64</option><option value="rot13">ROT13</option><option value="atbash">Atbash</option><option value="binary">Binary</option></select>'
    +'<input id="cipherKey" type="text" placeholder="'+(L.cipherKey||'Key')+'" value="3" style="width:70px;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.4rem;font-size:0.85rem;" data-i18n-placeholder="cipherKey">'
    +'</div>'
    +'<div style="display:flex;gap:0.5rem;margin-bottom:0.6rem;">'
    +'<button id="cipherEncBtn" style="flex:1;padding:0.5rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(0,180,80,0.2);color:#0f0;cursor:pointer;font-size:0.85rem;" data-i18n="cipherEncode">'+(L.cipherEncode||'Encode')+'</button>'
    +'<button id="cipherDecBtn" style="flex:1;padding:0.5rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(0,120,255,0.2);color:#4af;cursor:pointer;font-size:0.85rem;" data-i18n="cipherDecode">'+(L.cipherDecode||'Decode')+'</button>'
    +'</div>'
    +'<div style="position:relative;"><textarea id="cipherOut" rows="3" readonly placeholder="'+(L.cipherOutput||'Output')+'" style="width:100%;box-sizing:border-box;background:#0d0d1a;color:#0f0;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.6rem;font-size:0.9rem;resize:vertical;" data-i18n-placeholder="cipherOutput"></textarea>'
    +'<button id="cipherCopyBtn" style="position:absolute;top:6px;right:6px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#e8e8e8;cursor:pointer;padding:2px 8px;font-size:0.75rem;" data-i18n="cipherCopy">'+(L.cipherCopy||'Copy')+'</button></div>';
  overlay.appendChild(modal);document.body.appendChild(overlay);
  var cipherBtn=document.createElement('button');cipherBtn.id='cipherToggleBtn';cipherBtn.textContent='\uD83D\uDD10';cipherBtn.title='Cipher';
  cipherBtn.style.cssText='position:fixed;bottom:10px;right:56px;z-index:99998;width:40px;height:40px;border-radius:50%;background:#1a1a2e;color:#e8e8e8;border:1px solid rgba(255,255,255,0.15);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0.7;transition:opacity 0.2s;';
  cipherBtn.onmouseenter=function(){this.style.opacity='1';};cipherBtn.onmouseleave=function(){this.style.opacity='0.7';};
  document.body.appendChild(cipherBtn);
  function showCipher(){overlay.style.display='flex';}
  function hideCipher(){overlay.style.display='none';}
  window.toggleCipherToolkit=function(){overlay.style.display==='flex'?hideCipher():showCipher();};
  cipherBtn.addEventListener('click',window.toggleCipherToolkit);
  document.getElementById('cipherCloseBtn').addEventListener('click',hideCipher);
  overlay.addEventListener('click',function(e){if(e.target===overlay)hideCipher();});
  document.getElementById('cipherEncBtn').addEventListener('click',function(){
    var t=document.getElementById('cipherIn').value,m=document.getElementById('cipherMethod').value,k=document.getElementById('cipherKey').value;
    document.getElementById('cipherOut').value=encode(t,m,k);
  });
  document.getElementById('cipherDecBtn').addEventListener('click',function(){
    var t=document.getElementById('cipherIn').value,m=document.getElementById('cipherMethod').value,k=document.getElementById('cipherKey').value;
    document.getElementById('cipherOut').value=decode(t,m,k);
  });
  document.getElementById('cipherCopyBtn').addEventListener('click',function(){
    var o=document.getElementById('cipherOut');
    if(navigator.clipboard){navigator.clipboard.writeText(o.value).then(function(){document.getElementById('cipherCopyBtn').textContent='\u2705';setTimeout(function(){document.getElementById('cipherCopyBtn').textContent=L.cipherCopy||'Copy';},1500);});}
    else{o.select();document.execCommand('copy');document.getElementById('cipherCopyBtn').textContent='\u2705';setTimeout(function(){document.getElementById('cipherCopyBtn').textContent=L.cipherCopy||'Copy';},1500);}
  });
}
document.addEventListener('DOMContentLoaded',function(){try{initCipherToolkit();}catch(e){console.warn('Cipher init:',e);}});
"""


# ══════════════════════════════════════════════════════════════════
# Helpers
# ══════════════════════════════════════════════════════════════════

def find_app_dirs():
    apps = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        if 'script.js' in filenames and 'index.html' in filenames:
            apps.append(dirpath)
    apps.sort()
    return apps


def detect_format(content):
    """Detect old vs new format. Old = multiline LANG block, New = compact single-line."""
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


def inject_lang_keys(content, fmt):
    """Inject terminal + cipher LANG keys into en/fr/ar blocks."""
    modified = False
    all_en = TERM_LANG_EN + CIPHER_LANG_EN
    all_fr = TERM_LANG_FR + CIPHER_LANG_FR
    all_ar = TERM_LANG_AR + CIPHER_LANG_AR

    if fmt == 'old':
        sep = '\n    '
    else:
        sep = ''

    for lang_code, keys in [('en', all_en), ('fr', all_fr), ('ar', all_ar)]:
        m = re.search(r'(\.\.\.LANG_BASE\.' + lang_code + r'\s*,?)', content)
        if m:
            insert_pos = m.end()
            content = content[:insert_pos] + sep + keys + sep + content[insert_pos:]
            modified = True

    return content, modified


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
    path = os.path.join(app_dir, 'script.js')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already injected
    if 'termTitle' in content:
        return 'skip'

    fmt = detect_format(content)
    if fmt is None:
        return 'no_lang'

    # Inject LANG keys
    content, modified = inject_lang_keys(content, fmt)
    if not modified:
        return 'no_inject'

    # Find end of LANG block and inject JS functions
    lang_end = find_lang_block_end(content)
    if lang_end == -1:
        return 'no_lang_end'

    content = content[:lang_end] + '\n' + JS_TERMINAL + '\n' + JS_CIPHER + '\n' + content[lang_end:]

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
    print(f"  Already had feature: {stats['skip']}")
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
            print(f"  [ERROR] {rel}: {e}")

    print(f"\n  Syntax OK:   {syntax_ok}/{len(samples)}")
    print(f"  Syntax FAIL: {syntax_fail}/{len(samples)}")

    if syntax_fail == 0:
        print(f"\n  ALL SYNTAX CHECKS PASSED!")
    else:
        print(f"\n  WARNING: {syntax_fail} files have syntax errors!")


if __name__ == '__main__':
    main()
