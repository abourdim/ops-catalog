/**
 * Workshop DIY — Shared Framework v1.0
 * Used by all bio-radio apps. Each app defines LANG, APP_CONFIG, and initApp() before loading this.
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;
const LIGHT_THEMES=['riad','medina'];
const APP_VERSION='1.0';
let soundEnabled=false;
const AudioCtx=window.AudioContext||window.webkitAudioContext;
let audioCtx;

function playSound(t){
  if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();
  const o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;
  if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08)}
  else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3)}
  else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25)}
}

let currentLang='en';
function setLanguage(l){
  currentLang=l;const s=LANG[l];if(!s)return;
  document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(s[k]!=null)e.textContent=s[k]});
  document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k]});
  document.querySelectorAll('[data-i18n-placeholder]').forEach(e=>{const k=e.dataset.i18nPlaceholder;if(s[k]!=null)e.placeholder=s[k]});
  document.title=`${s.title} \u2014 Workshop DIY`;
  document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;
  const sel=$('langSelect');if(sel)sel.value=l;
  try{localStorage.setItem('wdiy-lang',l)}catch(e){}
  log(s.langChanged||'Language changed','info');
}

function setTheme(n){
  document.documentElement.dataset.theme=n;
  document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));
  const sel=$('themeSelect');if(sel)sel.value=n;
  try{localStorage.setItem('wdiy-theme',n)}catch(e){}
  const s=LANG[currentLang];
  log(`${s.themeChanged||'Theme:'} ${s['t_'+n]||n}`,'info');
}

let logContainer;
function log(m,t='info'){
  if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;
  const d=document.createElement('div');d.className=`log-line ${t}`;
  d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;
  logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;
  if(t==='success')playSound('success');else if(t==='error')playSound('error');
}

function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared||'Cleared')}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied||'Copied!','success')}catch(e){log(LANG[currentLang].copyFail||'Failed','error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='log.txt';a.click()}

let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}

function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;if(!logContainer)logContainer=$('logContainer');if(logContainer)Array.from(logContainer.children).forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})})})}

function calcHijriDate(){try{return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch(e){return''}}

function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open')}
function closePanel(p,o,r){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open');const b=$(r);if(b)b.focus()}
function openHelp(){openPanel('helpPanel','helpOverlay')}
function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn')}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}

function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(t=>{t.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));t.classList.add('active');const n=t.dataset.tab;const id='help'+n.charAt(0).toUpperCase()+n.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active')})})}

let breathingActive=false;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive))}
function incrementDhikr(){const c=$('dhikrCounter');if(c)c.textContent=parseInt(c.textContent||'0')+1}

function _initFramework(){
  initSplash();
  const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hC=$('helpCloseBtn'),hO=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hC)hC.onclick=closeHelp;if(hO)hO.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sC=$('settingsCloseBtn'),sO=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sC)sC.onclick=closeSettings;if(sO)sO.onclick=closeSettings;
  const lBtn=$('logBtn'),lC=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog;if(lC)lC.onclick=closeLog;
  const st=$('soundToggle');
  if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch(e){}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch(e){}}}
  const bb=$('breathingBtn'),dd=$('dhikrDisplay'),db=$('dhikrBtn');
  if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none'};
  if(db)db.onclick=incrementDhikr;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});
  const ls=$('langSelect');if(ls)ls.onchange=()=>setLanguage(ls.value);
  const ts=$('themeSelect');if(ts)ts.onchange=()=>setTheme(ts.value);
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch(e){}
  const hd=$('hijriDate');if(hd){const h=calcHijriDate();if(h)hd.textContent=h}
  log(LANG[currentLang].ready||'Ready!','success');
  if(typeof initApp==='function')initApp();
}

document.readyState==='loading'?document.addEventListener('DOMContentLoaded',_initFramework):_initFramework();
