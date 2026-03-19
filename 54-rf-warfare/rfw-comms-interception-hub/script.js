/**
 * Workshop DIY — Comms Interception Hub v1.2
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);}}
const LANG={
  en:{title:'Comms Interception Hub',subtitle:'Comms Interception Hub',disconnected:'Idle',connected:'Intercepting',mainSection:'Communications Interception Hub',mainDesc:'SIGINT collection, signal analysis and traffic monitoring',sectionA:'Intercepted Channels',sectionB:'SIGINT Methods',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is this app?',faq_a1:'A SIGINT interception simulator for educational RF studies.',faq_q2:'What is SIGINT?',faq_a2:'Signals Intelligence — intercepting and analyzing communications.',faq_q3:'Is this real?',faq_a3:'No. Visual simulation only.',faq_q4:'Data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Tune receiver frequency.',howto_2:'Set bandwidth and modulation.',howto_3:'Start intercepting signals.',howto_4:'Use Auto-Scan to find channels.',working:'Working...',ready:'Interception Hub ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startIntercept:'Start Intercept',stopIntercept:'Stop Intercept',autoScan:'Auto-Scan',resetSim:'Reset',rxParams:'Receiver Settings',analysisParams:'Analysis',rxFreq:'Tune Freq (MHz):',rxBw:'RX Bandwidth (kHz):',modType:'Modulation:',squelch:'Squelch:',hubStatus:'Hub Status',channelHint:'Detected communications channels.'},
  fr:{title:'Hub Interception Comms',subtitle:'Hub Interception Comms',disconnected:'Inactif',connected:'Interception',mainSection:'Hub d\'Interception Communications',mainDesc:'Collecte SIGINT et analyse du trafic',sectionA:'Canaux Interceptes',sectionB:'Methodes SIGINT',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'C\'est quoi?',faq_a1:'Un simulateur d\'interception SIGINT educatif.',faq_q2:'C\'est quoi SIGINT?',faq_a2:'Renseignement d\'origine electromagnetique.',faq_q3:'C\'est reel?',faq_a3:'Non. Simulation visuelle.',faq_q4:'Donnees privees?',faq_a4:'Oui. Tout est local.',howto_1:'Regler la frequence.',howto_2:'Configurer bande passante.',howto_3:'Demarrer l\'interception.',howto_4:'Scanner automatiquement.',working:'En cours...',ready:'Hub pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startIntercept:'Demarrer Interception',stopIntercept:'Arreter',autoScan:'Auto-Scan',resetSim:'Reinitialiser'},
  ar:{title:'\u0645\u0631\u0643\u0632 \u0627\u0639\u062a\u0631\u0627\u0636 \u0627\u0644\u0627\u062a\u0635\u0627\u0644\u0627\u062a',subtitle:'\u0645\u0631\u0643\u0632 \u0627\u0639\u062a\u0631\u0627\u0636 \u0627\u0644\u0627\u062a\u0635\u0627\u0644\u0627\u062a',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u0627\u0639\u062a\u0631\u0627\u0636',mainSection:'\u0645\u0631\u0643\u0632 \u0627\u0639\u062a\u0631\u0627\u0636 \u0627\u0644\u0627\u062a\u0635\u0627\u0644\u0627\u062a',mainDesc:'\u062c\u0645\u0639 \u0627\u0644\u0627\u0633\u062a\u062e\u0628\u0627\u0631\u0627\u062a \u0648\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a',sectionA:'\u0627\u0644\u0642\u0646\u0648\u0627\u062a \u0627\u0644\u0645\u0639\u062a\u0631\u0636\u0629',sectionB:'\u0637\u0631\u0642 SIGINT',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0627\u0644\u0645\u0631\u0643\u0632 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startIntercept:'\u0628\u062f\u0621 \u0627\u0644\u0627\u0639\u062a\u0631\u0627\u0636',stopIntercept:'\u0625\u064a\u0642\u0627\u0641',autoScan:'\u0641\u062d\u0635 \u062a\u0644\u0642\u0627\u0626\u064a',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sigint-log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function initPanels(){const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');if(langSel)langSel.onchange=()=>setLanguage(langSel.value);if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});}

/* ═══════ SIGINT DATA ═══════ */
let intercepting=false,autoScanning=false,time=0;
let channels=[];let trafficHistory=new Array(300).fill(0);

function initChannels(){channels=[];const types=['Voice','Data','Telemetry','Beacon','Burst','FHSS','OFDM','CW'];for(let i=0;i<10;i++){channels.push({id:'CH-'+(i+1),freq:(100+Math.random()*5900).toFixed(1),type:types[Math.floor(Math.random()*types.length)],power:(-80+Math.random()*50).toFixed(0),active:Math.random()>0.3,intercepted:false,traffic:0});}}

function drawSigint(){
  const c=$('sigintCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // Grid
  for(let i=0;i<=12;i++){const x=i*W/12;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle='rgba(0,255,136,0.06)';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';ctx.fillText((i*500)+'',x,H-3);}
  for(let i=0;i<=6;i++){const y=i*H/6;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.strokeStyle='rgba(0,255,136,0.06)';ctx.stroke();}

  // Noise floor
  ctx.beginPath();for(let x=0;x<W;x++){const nf=H*0.8+Math.random()*10-5;if(x===0)ctx.moveTo(x,nf);else ctx.lineTo(x,nf);}ctx.strokeStyle='rgba(0,200,255,0.2)';ctx.lineWidth=1;ctx.stroke();

  // Channel signals
  const tuneFreq=parseFloat($('freqInput')?.value||900);const rxBw=parseFloat($('bwInput')?.value||25);
  channels.forEach(ch=>{
    if(!ch.active)return;
    const fx=(parseFloat(ch.freq)/6000)*W;const sigH=(parseFloat(ch.power)+100)/120*H*0.6;
    ctx.beginPath();const w=10+Math.random()*10;
    ctx.moveTo(fx-w,H*0.8);ctx.quadraticCurveTo(fx,H*0.8-sigH,fx+w,H*0.8);
    ctx.strokeStyle=ch.intercepted?'rgba(0,255,136,0.8)':'rgba(0,200,255,0.5)';ctx.lineWidth=2;ctx.stroke();
    if(ch.intercepted){ctx.fillStyle='rgba(0,255,136,0.1)';ctx.fill();}
    ctx.fillStyle=ch.intercepted?'#00ff88':'#66ccff';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(ch.id+' '+ch.type,fx,H*0.8-sigH-6);
  });

  // Tuning indicator
  const tuneX=(tuneFreq/6000)*W;const bwW=(rxBw/1000/6000)*W*50;
  ctx.fillStyle='rgba(255,200,0,0.1)';ctx.fillRect(tuneX-bwW,0,bwW*2,H);
  ctx.beginPath();ctx.moveTo(tuneX,0);ctx.lineTo(tuneX,H);ctx.strokeStyle='rgba(255,200,0,0.5)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(255,200,0,0.6)';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(tuneFreq+' MHz',tuneX,15);

  // Auto-scan sweep
  if(autoScanning){const sweepX=(time*60%W);ctx.beginPath();ctx.moveTo(sweepX,0);ctx.lineTo(sweepX,H);ctx.strokeStyle='rgba(0,255,136,0.4)';ctx.lineWidth=2;ctx.stroke();}

  // Check interceptions
  if(intercepting){channels.forEach(ch=>{const dist=Math.abs(parseFloat(ch.freq)-tuneFreq);ch.intercepted=dist<rxBw*2&&ch.active;if(ch.intercepted)ch.traffic+=Math.random()*5;});}else{channels.forEach(ch=>ch.intercepted=false);}

  ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('SIGINT SPECTRUM — 0 to 6 GHz',10,18);
  if(intercepting){ctx.fillStyle='rgba(0,255,136,0.8)';ctx.fillText('INTERCEPTING @ '+tuneFreq+' MHz',10,34);}
}

function drawTraffic(){
  const c=$('trafficCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const intCount=channels.filter(c=>c.intercepted).length;
  const newVal=intercepting?intCount*10+Math.random()*20:Math.random()*2;
  trafficHistory.push(newVal);if(trafficHistory.length>300)trafficHistory.shift();
  // Bar chart style
  const barW=W/300;
  trafficHistory.forEach((v,i)=>{const bh=v/80*H*0.8;ctx.fillStyle=v>40?'rgba(0,255,136,0.7)':v>20?'rgba(0,200,255,0.6)':'rgba(100,100,100,0.3)';ctx.fillRect(i*barW,H-bh,barW-1,bh);});
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('TRAFFIC ACTIVITY',5,14);
}

function animate(){time+=0.016;drawSigint();drawTraffic();updateStats();requestAnimationFrame(animate);}
function updateStats(){const stats=$('hubStats');if(!stats)return;const intCount=channels.filter(c=>c.intercepted).length;const activeCount=channels.filter(c=>c.active).length;stats.innerHTML='<b>Channels:</b> '+activeCount+' active<br><b>Intercepted:</b> '+intCount+'<br><b>Auto-Scan:</b> '+(autoScanning?'<span style="color:#ffcc00">ON</span>':'OFF')+'<br><b>Status:</b> '+(intercepting?'<span style="color:#00ff88">INTERCEPTING</span>':'<span style="color:#888">STANDBY</span>');}
function updateChannelList(){const lib=$('channelList');if(!lib)return;lib.innerHTML='';channels.forEach(ch=>{if(!ch.active)return;const row=document.createElement('div');row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+(ch.intercepted?'rgba(0,255,136,0.08)':'rgba(0,200,255,0.05)');row.innerHTML='<span style="color:'+(ch.intercepted?'#00ff88':'#66ccff')+'">'+ch.id+'</span><span>'+ch.freq+' MHz</span><span>'+ch.type+'</span><span>'+ch.power+' dBm</span><span style="color:'+(ch.intercepted?'#00ff88':'#888')+'">'+(ch.intercepted?'CAPTURED':'---')+'</span>';lib.appendChild(row);});}
function initTechDatabase(){const db=$('techDatabase');if(!db)return;db.innerHTML=['<b>COMINT:</b> Communications Intelligence — intercepting voice and data.','<b>ELINT:</b> Electronic Intelligence — analyzing radar and sensor emissions.','<b>Direction Finding:</b> Locating transmitters via signal triangulation.','<b>Traffic Analysis:</b> Studying communication patterns without content.','<b>Demodulation:</b> Extracting information from modulated signals.','<b>Frequency Hopping:</b> Tracking signals across frequency changes.'].join('<br><br>');}

function initControls(){
  $('freqInput').oninput=()=>{$('freqLabel').textContent=$('freqInput').value+' MHz';};
  $('bwInput').oninput=()=>{$('bwLabel').textContent=$('bwInput').value+' kHz';};
  $('squelchInput').oninput=()=>{$('squelchLabel').textContent=$('squelchInput').value+'%';};
  $('interceptBtn').onclick=()=>{intercepting=!intercepting;setStatus(intercepting);$('interceptBtn').querySelector('[data-i18n]').textContent=intercepting?LANG[currentLang].stopIntercept:LANG[currentLang].startIntercept;log(intercepting?'Interception STARTED @ '+$('freqInput').value+' MHz':'Interception STOPPED',intercepting?'rx':'info');if(intercepting)showToast('Intercepting...',2000);};
  $('scanBtn').onclick=()=>{autoScanning=!autoScanning;log(autoScanning?'Auto-scan ENABLED':'Auto-scan DISABLED',autoScanning?'success':'info');if(autoScanning){let scanIdx=0;const interval=setInterval(()=>{if(!autoScanning){clearInterval(interval);return;}const freq=100+scanIdx*50;$('freqInput').value=freq;$('freqLabel').textContent=freq+' MHz';scanIdx++;if(scanIdx>118)scanIdx=0;},200);}playSound(autoScanning?'success':'click');};
  $('resetBtn').onclick=()=>{intercepting=false;autoScanning=false;setStatus(false);initChannels();trafficHistory=new Array(300).fill(0);$('interceptBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].startIntercept;log('Reset','info');playSound('click');};
}

document.addEventListener('DOMContentLoaded',()=>{
  initSplash();initPanels();initLogFilters();initChannels();initTechDatabase();initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');animate();setInterval(updateChannelList,1000);
});
