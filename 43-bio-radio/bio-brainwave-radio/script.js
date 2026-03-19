/**
 * Workshop DIY — Bio Brainwave Radio v1.0
 * EEG to radio transmission via micro:bit
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25)}}
const LANG={en:{title:'Bio Brainwave Radio',subtitle:'EEG brainwaves to radio transmission',disconnected:'Disconnected',connected:'Connected',mainSection:'Brainwave Radio \u2014 EEG to RF',mainDesc:'Transmit brain states via modulated radio',sectionA:'A \u2014 How It Works',sectionC:'C \u2014 Challenges',startEEG:'Start EEG',relaxMode:'Relax',focusMode:'Focus',transmit:'Transmit',activityLog:'Log',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'\u2699\ufe0f Settings',language:'Language',theme:'Theme',help:'\u2753 Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',soundEffects:'\ud83d\udd0a Sound',splashHint:'tap to skip',working:'Working\u2026',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'\ud83e\udde0 Brainwave Radio ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',langChanged:'\ud83c\udf10 English',themeChanged:'\ud83c\udfa8 Theme \u2192'},fr:{title:'Bio Radio C\u00e9r\u00e9brale',subtitle:'EEG vers transmission radio',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'Radio C\u00e9r\u00e9brale \u2014 EEG vers RF',mainDesc:'Transmettre les \u00e9tats c\u00e9r\u00e9braux par radio',sectionA:'A \u2014 Fonctionnement',sectionC:'C \u2014 D\u00e9fis',startEEG:'D\u00e9marrer EEG',relaxMode:'Relaxation',focusMode:'Concentration',transmit:'Transmettre',activityLog:'Journal',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'\u2699\ufe0f Param\u00e8tres',language:'Langue',theme:'Th\u00e8me',help:'\u2753 Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',soundEffects:'\ud83d\udd0a Sons',splashHint:'appuyer',working:'En cours\u2026',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'\ud83e\udde0 Radio c\u00e9r\u00e9brale pr\u00eate!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 Fran\u00e7ais',themeChanged:'\ud83c\udfa8 Th\u00e8me \u2192'},ar:{title:'\u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u0645\u0648\u062c\u0627\u062a \u0627\u0644\u062f\u0645\u0627\u063a\u064a\u0629',subtitle:'EEG \u0625\u0644\u0649 \u0625\u0631\u0633\u0627\u0644 \u0631\u0627\u062f\u064a\u0648\u064a',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u062f\u0645\u0627\u063a \u2014 EEG \u0625\u0644\u0649 RF',mainDesc:'\u0628\u062b \u062d\u0627\u0644\u0627\u062a \u0627\u0644\u062f\u0645\u0627\u063a \u0639\u0628\u0631 \u0625\u0634\u0627\u0631\u0627\u062a \u0631\u0627\u062f\u064a\u0648',sectionA:'\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644',sectionC:'\u062c \u2014 \u062a\u062d\u062f\u064a\u0627\u062a',startEEG:'\u0628\u062f\u0621 EEG',relaxMode:'\u0627\u0633\u062a\u0631\u062e\u0627\u0621',focusMode:'\u062a\u0631\u0643\u064a\u0632',transmit:'\u0625\u0631\u0633\u0627\u0644',activityLog:'\u0633\u062c\u0644',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',settings:'\u2699\ufe0f \u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',help:'\u2753 \u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u062f\u0644\u064a\u0644',wiki:'\u0648\u064a\u0643\u064a',soundEffects:'\ud83d\udd0a \u0635\u0648\u062a',splashHint:'\u0627\u0646\u0642\u0631',working:'\u062c\u0627\u0631\u064d\u2026',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',ready:'\ud83e\udde0 \u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u062f\u0645\u0627\u063a \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a\u0629',themeChanged:'\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190'}};

let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(s[k]!=null)e.textContent=s[k]});document.title=`${s.title} \u2014 Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch(e){}log(s.langChanged,'info')}function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch(e){}const s=LANG[currentLang];log(`${s.themeChanged} ${s['t_'+n]||n}`,'info')}let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error')}function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch(e){log(LANG[currentLang].copyFail,'error')}}function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='log.txt';a.click()}let toastTimer=null;function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}function sleep(ms){return new Promise(r=>setTimeout(r,ms))}let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;if(!logContainer)logContainer=$('logContainer');if(logContainer)Array.from(logContainer.children).forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})})})}function calcHijriDate(){try{return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch(e){return''}}function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open')}function closePanel(p,o,r){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open');const b=$(r);if(b)b.focus()}function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn')}let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false}}function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(t=>{t.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));t.classList.add('active');const n=t.dataset.tab;const id='help'+n.charAt(0).toUpperCase()+n.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active')})})}let breathingActive=false;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive))}function incrementDhikr(){const c=$('dhikrCounter');if(c)c.textContent=parseInt(c.textContent||'0')+1}
function init(){initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();const hBtn=$('helpBtn'),hC=$('helpCloseBtn'),hO=$('helpOverlay');if(hBtn)hBtn.onclick=openHelp;if(hC)hC.onclick=closeHelp;if(hO)hO.onclick=closeHelp;initHelpTabs();const sBtn=$('settingsBtn'),sC=$('settingsCloseBtn'),sO=$('settingsOverlay');if(sBtn)sBtn.onclick=openSettings;if(sC)sC.onclick=closeSettings;if(sO)sO.onclick=closeSettings;const lBtn=$('logBtn'),lC=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lC)lC.onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch(e){}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch(e){}}}const bb=$('breathingBtn'),dd=$('dhikrDisplay'),db=$('dhikrBtn');if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none'};if(db)db.onclick=incrementDhikr;document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});const ls=$('langSelect');if(ls)ls.onchange=()=>setLanguage(ls.value);const ts=$('themeSelect');if(ts)ts.onchange=()=>setTheme(ts.value);try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch(e){}const hd=$('hijriDate');if(hd){const h=calcHijriDate();if(h)hd.textContent=h}log(LANG[currentLang].ready,'success');initApp()}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ BRAINWAVE RADIO SIMULATION ═══════ */
let eegRunning=false,mode='normal';// normal,relax,focus
let alpha=10,theta=6,beta=22,delta=3,focusLevel=50;
let eegData={alpha:[],theta:[],beta:[],delta:[]};

function initApp(){
  const canvas=$('brainCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=320;
  const W=canvas.width,H=canvas.height;let t=0;
  const colors={alpha:'#33ff33',theta:'#6699ff',beta:'#ff3366',delta:'#ffcc00'};
  const bandH=H/4-10;

  function genWave(freq,amp,noise){
    return Math.sin(t*freq*.1)*amp+Math.sin(t*freq*.23)*(amp*.3)+(Math.random()-.5)*noise;
  }

  function frame(){
    ctx.fillStyle='rgba(0,0,0,.1)';ctx.fillRect(0,0,W,H);t+=1;
    if(eegRunning){
      // Adjust bands by mode
      const targetA=mode==='relax'?15:mode==='focus'?6:10;
      const targetB=mode==='focus'?35:mode==='relax'?14:22;
      const targetT=mode==='relax'?8:mode==='focus'?4:6;
      alpha+=(targetA-alpha)*.02+Math.random()*.5-.25;
      beta+=(targetB-beta)*.02+Math.random()*.5-.25;
      theta+=(targetT-theta)*.02+Math.random()*.3-.15;
      delta=2+Math.random()*2;
      focusLevel=Math.round(Math.min(100,Math.max(0,beta/(alpha+.1)*30)));

      const vals={alpha:genWave(alpha,30,5),theta:genWave(theta,25,4),beta:genWave(beta,20,8),delta:genWave(delta,35,3)};
      Object.keys(vals).forEach(k=>{eegData[k].push(vals[k]);if(eegData[k].length>W)eegData[k].shift()});
    }

    // Draw 4 EEG channels
    const bands=['delta','theta','alpha','beta'];
    bands.forEach((band,i)=>{
      const y0=i*bandH+i*10+20;
      ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(0,y0,W,bandH);
      ctx.strokeStyle='rgba(255,255,255,.08)';ctx.strokeRect(0,y0,W,bandH);
      ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='10px Orbitron';ctx.fillText(band.toUpperCase(),5,y0+14);
      const data=eegData[band];if(data.length<2)return;
      ctx.beginPath();ctx.strokeStyle=colors[band];ctx.lineWidth=1.5;
      data.forEach((v,j)=>{const x=j,y=y0+bandH/2-v;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
      ctx.stroke();
    });

    // Focus meter
    ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(W-120,H-40,110,30);
    ctx.fillStyle='#33ff33';ctx.fillRect(W-115,H-35,focusLevel,20);
    ctx.strokeStyle='rgba(255,255,255,.2)';ctx.strokeRect(W-120,H-40,110,30);
    ctx.fillStyle='#fff';ctx.font='bold 11px Orbitron';ctx.fillText(`Focus: ${focusLevel}%`,W-115,H-20);

    // Update stats
    const sa=$('statAlpha'),st=$('statTheta'),sb=$('statBeta'),sf=$('statFocus'),bd=$('bandDisplay');
    if(sa)sa.textContent=alpha.toFixed(1);if(st)st.textContent=theta.toFixed(1);
    if(sb)sb.textContent=beta.toFixed(1);if(sf)sf.textContent=focusLevel;
    if(bd)bd.textContent=`Alpha: ${alpha.toFixed(1)} Hz | Theta: ${theta.toFixed(1)} Hz | Beta: ${beta.toFixed(1)} Hz | Delta: ${delta.toFixed(1)} Hz`;

    requestAnimationFrame(frame);
  }
  frame();

  const startBtn=$('startBtn'),relaxBtn=$('relaxBtn'),focusBtn=$('focusBtn'),txBtn=$('txBtn');
  if(startBtn)startBtn.onclick=()=>{eegRunning=!eegRunning;setStatus(eegRunning);log(eegRunning?'EEG started':'EEG stopped','info')};
  if(relaxBtn)relaxBtn.onclick=()=>{mode='relax';log('Mode: Relaxation \u2014 boosting alpha waves','info')};
  if(focusBtn)focusBtn.onclick=()=>{mode='focus';log('Mode: Focus \u2014 boosting beta waves','info')};
  if(txBtn)txBtn.onclick=()=>{
    if(!eegRunning){log('Start EEG first','error');return}
    const state=focusLevel>60?'FOCUS':focusLevel>40?'NORMAL':'RELAX';
    log(`TX: Brain state [${state}] A:${alpha.toFixed(1)} B:${beta.toFixed(1)} T:${theta.toFixed(1)} Focus:${focusLevel}%`,'tx');
    showToast(`Transmitted: ${state}`,1500);playSound('success');
  };
}
