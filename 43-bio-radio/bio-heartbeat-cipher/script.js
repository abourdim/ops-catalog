/**
 * Workshop DIY — Bio Heartbeat Cipher v1.0
 * Heartbeat R-R intervals as one-time pad encryption
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25)}}

const LANG={
  en:{title:'Bio Heartbeat Cipher',subtitle:'Your heartbeat encrypts messages',disconnected:'Disconnected',connected:'Connected',mainSection:'Heartbeat Cipher \u2014 OTP Encryption',mainDesc:'R-R intervals generate one-time pad keys',sectionA:'A \u2014 How It Works',sectionC:'C \u2014 Challenges',startHeart:'Start Heartbeat',genKey:'Generate Key',encryptBtn:'Encrypt',decryptBtn:'Decrypt',statEntropy:'bits entropy',statKeys:'keys',step1Title:'Heartbeat Sensing',step1Desc:'micro:bit detects heartbeat. Each R-R interval is unique.',step2Title:'R-R Extraction',step2Desc:'Heart rate variability provides true randomness.',step3Title:'OTP Key Gen',step3Desc:'R-R intervals hashed to create one-time pad keys.',step4Title:'XOR Encryption',step4Desc:'Message XOR key = ciphertext. Key never reused.',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'\u2699\ufe0f Settings',language:'Language',theme:'Theme',help:'\u2753 Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',soundEffects:'\ud83d\udd0a Sound effects',splashHint:'tap to skip',working:'Working\u2026',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'\u2764 Heartbeat Cipher ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',langChanged:'\ud83c\udf10 Language \u2192 English',themeChanged:'\ud83c\udfa8 Theme \u2192'},
  fr:{title:'Bio Chiffre Cardiaque',subtitle:'Votre battement chiffre les messages',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'Chiffre Cardiaque \u2014 Chiffrement OTP',mainDesc:'Les intervalles R-R g\u00e9n\u00e8rent des cl\u00e9s OTP',sectionA:'A \u2014 Fonctionnement',sectionC:'C \u2014 D\u00e9fis',startHeart:'D\u00e9marrer',genKey:'G\u00e9n\u00e9rer Cl\u00e9',encryptBtn:'Chiffrer',decryptBtn:'D\u00e9chiffrer',statEntropy:'bits entropie',statKeys:'cl\u00e9s',activityLog:'Journal',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'\u2699\ufe0f Param\u00e8tres',language:'Langue',theme:'Th\u00e8me',help:'\u2753 Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',soundEffects:'\ud83d\udd0a Sons',splashHint:'appuyer',working:'En cours\u2026',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'\u2764 Chiffre cardiaque pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 Langue \u2192 FR',themeChanged:'\ud83c\udfa8 Th\u00e8me \u2192'},
  ar:{title:'\u0634\u0641\u0631\u0629 \u0646\u0628\u0636 \u0627\u0644\u0642\u0644\u0628',subtitle:'\u0646\u0628\u0636 \u0642\u0644\u0628\u0643 \u064a\u0634\u0641\u0631 \u0627\u0644\u0631\u0633\u0627\u0626\u0644',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u0634\u0641\u0631\u0629 \u0627\u0644\u0642\u0644\u0628 \u2014 \u062a\u0634\u0641\u064a\u0631 OTP',mainDesc:'\u0641\u062a\u0631\u0627\u062a R-R \u062a\u0648\u0644\u062f \u0645\u0641\u0627\u062a\u064a\u062d OTP',sectionA:'\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644',sectionC:'\u062c \u2014 \u062a\u062d\u062f\u064a\u0627\u062a',startHeart:'\u0628\u062f\u0621',genKey:'\u062a\u0648\u0644\u064a\u062f \u0645\u0641\u062a\u0627\u062d',encryptBtn:'\u062a\u0634\u0641\u064a\u0631',decryptBtn:'\u0641\u0643 \u062a\u0634\u0641\u064a\u0631',statEntropy:'\u0628\u062a \u0625\u0646\u062a\u0631\u0648\u0628\u064a',statKeys:'\u0645\u0641\u0627\u062a\u064a\u062d',activityLog:'\u0633\u062c\u0644',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',settings:'\u2699\ufe0f \u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',help:'\u2753 \u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u062f\u0644\u064a\u0644',wiki:'\u0648\u064a\u0643\u064a',soundEffects:'\ud83d\udd0a \u0635\u0648\u062a',splashHint:'\u0627\u0646\u0642\u0631',working:'\u062c\u0627\u0631\u064d\u2026',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',ready:'\u2764 \u0634\u0641\u0631\u0629 \u0627\u0644\u0642\u0644\u0628 \u062c\u0627\u0647\u0632\u0629!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a\u0629',themeChanged:'\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.title=`${s.title} \u2014 Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang)}catch(e){}log(s.langChanged,'info')}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name)}catch(e){}const s=LANG[currentLang];log(`${s.themeChanged} ${s['t_'+name]||name}`,'info')}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch(e){log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='log.txt';a.click()}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{line.style.display=f==='all'||line.classList.contains(f)?'':'none'})})})}
function calcHijriDate(){try{return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch(e){return''}}
function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open')}
function closePanel(p,o,r){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open');const b=$(r);if(b)b.focus()}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn')}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const tid='help'+n.charAt(0).toUpperCase()+n.slice(1);const tgt=$(tid);if(tgt)tgt.classList.add('active')})})}
let breathingActive=false;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive))}
function incrementDhikr(){const c=$('dhikrCounter');if(c)c.textContent=parseInt(c.textContent||'0')+1}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hC=$('helpCloseBtn'),hO=$('helpOverlay');if(hBtn)hBtn.onclick=openHelp;if(hC)hC.onclick=closeHelp;if(hO)hO.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sC=$('settingsCloseBtn'),sO=$('settingsOverlay');if(sBtn)sBtn.onclick=openSettings;if(sC)sC.onclick=closeSettings;if(sO)sO.onclick=closeSettings;
  const lBtn=$('logBtn'),lC=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lC)lC.onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch(e){}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch(e){}}}
  const bb=$('breathingBtn'),dd=$('dhikrDisplay'),db=$('dhikrBtn');if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none'};if(db)db.onclick=incrementDhikr;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});
  const ls=$('langSelect');if(ls)ls.onchange=()=>setLanguage(ls.value);
  const ts=$('themeSelect');if(ts)ts.onchange=()=>setTheme(ts.value);
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch(e){}
  const hd=$('hijriDate');if(hd){const h=calcHijriDate();if(h)hd.textContent=h}
  log(LANG[currentLang].ready,'success');initApp();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ HEARTBEAT CIPHER SIMULATION ═══════ */
let heartRunning=false,heartAnim=null,rrIntervals=[],otpKey=[],keysGenerated=0;
let bpm=72,lastBeat=0,beatPhase=0;

function initApp(){
  const canvas=$('heartCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=280;
  const W=canvas.width,H=canvas.height;
  let ecgData=[],t=0;

  function generateECG(phase){
    // Simulate ECG waveform
    const p=phase%1;
    if(p<.05)return Math.sin(p/.05*Math.PI)*.3;// P wave
    if(p<.1)return 0;
    if(p<.12)return -.2;// Q
    if(p<.16)return Math.sin((p-.12)/.04*Math.PI)*1;// R peak
    if(p<.2)return -.3;// S
    if(p<.35)return Math.sin((p-.2)/.15*Math.PI)*.15;// T wave
    return 0;
  }

  function frame(){
    ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(0,0,W,H);
    t+=.016;
    if(heartRunning){
      const interval=60/bpm;
      beatPhase+=.016/interval;
      if(beatPhase>=1){
        beatPhase-=1;
        const rr=Math.round(interval*1000+Math.random()*60-30);
        rrIntervals.push(rr);if(rrIntervals.length>100)rrIntervals.shift();
        bpm=Math.round(68+Math.sin(t*.3)*8+Math.random()*4);
        const bd=$('bpmDisplay'),sb=$('statBPM'),sr=$('statRR');
        if(bd)bd.textContent=`\u2764 ${bpm} BPM`;if(sb)sb.textContent=bpm;if(sr)sr.textContent=rr;
      }
      const ecgVal=generateECG(beatPhase);
      ecgData.push(ecgVal);if(ecgData.length>W)ecgData.shift();
    }

    // Draw ECG trace
    if(ecgData.length>1){
      ctx.beginPath();ctx.strokeStyle='#ff3366';ctx.lineWidth=2;ctx.shadowColor='#ff3366';ctx.shadowBlur=8;
      ecgData.forEach((v,i)=>{const x=i,y=H/2-v*H*.35;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
      ctx.stroke();ctx.shadowBlur=0;
    }
    // Grid
    ctx.strokeStyle='rgba(255,255,255,.05)';ctx.lineWidth=.5;
    for(let i=0;i<W;i+=50){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,H);ctx.stroke()}
    for(let i=0;i<H;i+=50){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(W,i);ctx.stroke()}

    // R-R interval display
    if(rrIntervals.length>1){
      const rx=W-200,ry=20;
      ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(rx,ry,180,100);
      ctx.strokeStyle='rgba(255,255,255,.1)';ctx.strokeRect(rx,ry,180,100);
      ctx.fillStyle='#ffcc00';ctx.font='bold 11px Orbitron';ctx.fillText('R-R Intervals (ms)',rx+10,ry+16);
      ctx.fillStyle='rgba(255,255,255,.6)';ctx.font='9px Orbitron';
      const last10=rrIntervals.slice(-10);
      last10.forEach((rr,i)=>{ctx.fillText(`${rr}`,rx+10+(i%5)*35,ry+35+Math.floor(i/5)*18)});
    }

    // OTP Key display
    if(otpKey.length>0){
      ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(10,H-50,W-20,40);
      ctx.fillStyle='#33ff33';ctx.font='10px Orbitron';
      ctx.fillText('OTP KEY: '+otpKey.map(b=>b.toString(16).padStart(2,'0')).join(' ').slice(0,120),20,H-25);
    }

    heartAnim=requestAnimationFrame(frame);
  }
  frame();

  // Controls
  const startBtn=$('startBtn'),genKeyBtn=$('genKeyBtn'),encBtn=$('encryptBtn'),decBtn=$('decryptBtn');
  if(startBtn)startBtn.onclick=()=>{heartRunning=!heartRunning;setStatus(heartRunning);log(heartRunning?'Heartbeat started':'Heartbeat stopped','info')};
  if(genKeyBtn)genKeyBtn.onclick=generateOTPKey;
  if(encBtn)encBtn.onclick=encryptMessage;
  if(decBtn)decBtn.onclick=decryptMessage;
}

function generateOTPKey(){
  if(rrIntervals.length<8){log('Need at least 8 heartbeats for key generation','error');return}
  otpKey=[];
  // Hash R-R intervals to generate key bytes
  for(let i=0;i<rrIntervals.length&&otpKey.length<64;i++){
    const rr=rrIntervals[i];
    otpKey.push((rr*31+i*17)&0xFF);
    otpKey.push(((rr>>3)^(rr<<2))&0xFF);
  }
  keysGenerated++;
  const entropy=Math.round(Math.log2(rrIntervals.length)*otpKey.length);
  const se=$('statEntropy'),sk=$('statKeys');
  if(se)se.textContent=entropy;if(sk)sk.textContent=keysGenerated;
  log(`Key generated: ${otpKey.length} bytes, ~${entropy} bits entropy`,'success');
  showToast('OTP Key Generated!',1500);
}

function encryptMessage(){
  const msg=($('msgInput')||{}).value||'';
  if(!msg){log('Enter a message first','error');return}
  if(otpKey.length===0){log('Generate a key first','error');return}
  let cipher='';
  for(let i=0;i<msg.length;i++){
    cipher+=String.fromCharCode(msg.charCodeAt(i)^otpKey[i%otpKey.length]);
  }
  const hex=Array.from(cipher).map(c=>c.charCodeAt(0).toString(16).padStart(2,'0')).join(' ');
  const out=$('cipherOutput');if(out)out.textContent=hex;
  log(`Encrypted: ${hex.slice(0,60)}...`,'tx');playSound('success');
}

function decryptMessage(){
  const out=$('cipherOutput');if(!out||!out.textContent.trim())return;
  if(otpKey.length===0){log('Need key to decrypt','error');return}
  const hex=out.textContent.trim().split(' ');
  let plain='';
  for(let i=0;i<hex.length;i++){
    const byte=parseInt(hex[i],16);
    if(!isNaN(byte))plain+=String.fromCharCode(byte^otpKey[i%otpKey.length]);
  }
  out.textContent=plain;
  log(`Decrypted: ${plain}`,'rx');playSound('success');
}
