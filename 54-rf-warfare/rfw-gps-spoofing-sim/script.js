/**
 * Workshop DIY — GPS Spoofing Sim v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Canvas RF Viz
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){
  if(!soundEnabled) return;
  if(!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value=0.08;
  const t = audioCtx.currentTime;
  if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);}
  else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);}
  else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);}
}

/* ═══════ i18n ═══════ */
const LANG = {
  en:{title:'GPS Spoofing Sim',subtitle:'GPS Spoofing Simulator',disconnected:'Idle',connected:'Spoofing',mainSection:'GPS Spoofing Simulator',mainDesc:'Simulate satellite spoofing and position manipulation',sectionA:'Satellite Constellation',sectionB:'Spoofing Techniques',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is this app?',faq_a1:'A GPS spoofing simulator for educational RF warfare studies.',faq_q2:'How does it work?',faq_a2:'Broadcasting fake GPS signals stronger than real ones.',faq_q3:'Is this real?',faq_a3:'No. Visual simulation only.',faq_q4:'Data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Set target coordinates.',howto_2:'Adjust power and satellite count.',howto_3:'Click Start Spoofing.',howto_4:'Use Detect to analyze anomalies.',working:'Working...',ready:'GPS Spoofing Sim ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startSpoof:'Start Spoofing',detectSpoof:'Detect Spoof',resetSim:'Reset',spoofTarget:'Spoof Target',spoofParams:'Spoof Parameters',latitude:'Latitude:',longitude:'Longitude:',power:'Power (dBm):',satellites:'Spoofed Sats:',sigInfo:'Position Info',satHint:'GPS satellites and spoofed status.',transmitted:'Signal transmitted'},
  fr:{title:'Sim Spoofing GPS',subtitle:'Simulateur de Spoofing GPS',disconnected:'Inactif',connected:'Spoofing',mainSection:'Simulateur Spoofing GPS',mainDesc:'Simuler le spoofing satellite et la manipulation de position',sectionA:'Constellation Satellite',sectionB:'Techniques de Spoofing',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'C\'est quoi?',faq_a1:'Un simulateur de spoofing GPS educatif.',faq_q2:'Comment ca marche?',faq_a2:'En emettant de faux signaux GPS.',faq_q3:'C\'est reel?',faq_a3:'Non. Simulation visuelle.',faq_q4:'Donnees privees?',faq_a4:'Oui. Tout est local.',howto_1:'Definir les coordonnees.',howto_2:'Ajuster puissance et satellites.',howto_3:'Cliquer Demarrer.',howto_4:'Utiliser Detecter.',working:'En cours...',ready:'Sim GPS pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startSpoof:'Demarrer Spoofing',detectSpoof:'Detecter Spoof',resetSim:'Reinitialiser',spoofTarget:'Cible Spoof',spoofParams:'Parametres Spoof',latitude:'Latitude:',longitude:'Longitude:',power:'Puissance (dBm):',satellites:'Sats Spoofes:',sigInfo:'Info Position',satHint:'Satellites GPS et leur statut.',transmitted:'Signal transmis'},
  ar:{title:'\u0645\u062d\u0627\u0643\u064a \u062a\u0632\u064a\u064a\u0641 GPS',subtitle:'\u0645\u062d\u0627\u0643\u064a \u062a\u0632\u064a\u064a\u0641 \u0625\u0634\u0627\u0631\u0627\u062a GPS',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u062a\u0632\u064a\u064a\u0641',mainSection:'\u0645\u062d\u0627\u0643\u064a \u062a\u0632\u064a\u064a\u0641 GPS',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u062a\u0632\u064a\u064a\u0641 \u0627\u0644\u0623\u0642\u0645\u0627\u0631 \u0627\u0644\u0635\u0646\u0627\u0639\u064a\u0629',sectionA:'\u0643\u0648\u0643\u0628\u0629 \u0627\u0644\u0623\u0642\u0645\u0627\u0631',sectionB:'\u062a\u0642\u0646\u064a\u0627\u062a \u0627\u0644\u062a\u0632\u064a\u064a\u0641',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0645\u062d\u0627\u0643\u064a GPS \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startSpoof:'\u0628\u062f\u0621 \u0627\u0644\u062a\u0632\u064a\u064a\u0641',detectSpoof:'\u0643\u0634\u0641 \u0627\u0644\u062a\u0632\u064a\u064a\u0641',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',spoofTarget:'\u0647\u062f\u0641 \u0627\u0644\u062a\u0632\u064a\u064a\u0641',spoofParams:'\u0645\u0639\u0644\u0645\u0627\u062a',latitude:'\u062e\u0637 \u0627\u0644\u0639\u0631\u0636:',longitude:'\u062e\u0637 \u0627\u0644\u0637\u0648\u0644:',power:'\u0627\u0644\u0642\u062f\u0631\u0629:',satellites:'\u0623\u0642\u0645\u0627\u0631 \u0645\u0632\u064a\u0641\u0629:',sigInfo:'\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0645\u0648\u0642\u0639',satHint:'\u0623\u0642\u0645\u0627\u0631 GPS \u0648\u062d\u0627\u0644\u062a\u0647\u0627.',transmitted:'\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u0634\u0627\u0631\u0629'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}

/* ═══════ THEMES ═══════ */
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}

/* ═══════ TOAST ═══════ */
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}

/* ═══════ STATUS ═══════ */
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}

/* ═══════ LOG FILTERS ═══════ */
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}

/* ═══════ PANELS ═══════ */
function initPanels(){
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');
  const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');
  if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};
  if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};
  if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};
  if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};
  if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};
  if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};
  if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};
  if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');
  const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');
  if(langSel)langSel.onchange=()=>setLanguage(langSel.value);
  if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);
  if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};
  const clearBtn=$('clearLogBtn'),copyBtn=$('copyLogBtn'),expBtn=$('exportLogBtn');
  if(clearBtn)clearBtn.onclick=clearLog;
  if(copyBtn)copyBtn.onclick=copyLog;
  if(expBtn)expBtn.onclick=exportLog;
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});
}

/* ═══════ GPS SATELLITE DATA ═══════ */
let satellites = [];
let spoofing = false;
let animFrame = null;
let time = 0;

function initSatellites(){
  satellites = [];
  for(let i=0;i<12;i++){
    satellites.push({
      id: 'PRN-'+(i+1),
      azimuth: Math.random()*360,
      elevation: 10+Math.random()*70,
      snr: 25+Math.random()*20,
      spoofed: false,
      orbitSpeed: 0.1+Math.random()*0.3,
      phase: Math.random()*Math.PI*2
    });
  }
}

/* ═══════ SKY VIEW CANVAS ═══════ */
function drawSkyView(){
  const c=$('skyCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const W=c.width, H=c.height, cx=W/2, cy=H/2, R=Math.min(W,H)/2-30;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);

  // Grid circles
  for(let i=1;i<=3;i++){
    ctx.beginPath();ctx.arc(cx,cy,R*i/3,0,Math.PI*2);
    ctx.strokeStyle='rgba(0,255,136,0.15)';ctx.lineWidth=1;ctx.stroke();
  }
  // Cross hairs
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.strokeStyle='rgba(0,255,136,0.1)';ctx.stroke();

  // Labels
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='11px Orbitron,monospace';ctx.textAlign='center';
  ctx.fillText('N',cx,cy-R-8);ctx.fillText('S',cx,cy+R+14);ctx.fillText('E',cx+R+14,cy+4);ctx.fillText('W',cx-R-14,cy+4);
  ctx.fillText('90',cx+8,cy+4);ctx.fillText('60',cx+R/3+10,cy+4);ctx.fillText('30',cx+R*2/3+10,cy+4);

  // Satellites
  const spoofCount = parseInt($('satCount')?.value||4);
  satellites.forEach((sat,i)=>{
    sat.azimuth += sat.orbitSpeed*0.3;
    if(sat.azimuth>360)sat.azimuth-=360;
    const az = sat.azimuth * Math.PI/180;
    const elR = (90-sat.elevation)/90;
    const sx = cx + Math.sin(az)*elR*R;
    const sy = cy - Math.cos(az)*elR*R;
    const isSpoofed = spoofing && i<spoofCount;
    sat.spoofed = isSpoofed;

    // Satellite marker
    ctx.beginPath();ctx.arc(sx,sy,isSpoofed?7:5,0,Math.PI*2);
    ctx.fillStyle=isSpoofed?'rgba(255,50,50,0.9)':'rgba(0,200,255,0.8)';ctx.fill();
    if(isSpoofed){
      ctx.beginPath();ctx.arc(sx,sy,12+Math.sin(time*3+i)*4,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,50,50,0.4)';ctx.lineWidth=2;ctx.stroke();
    }
    ctx.fillStyle=isSpoofed?'#ff6666':'#66ccff';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(sat.id,sx,sy-10);
  });

  // Spoof target position marker
  if(spoofing){
    const spoofLat=parseFloat($('latInput')?.value||0);
    const spoofLon=parseFloat($('lonInput')?.value||0);
    const tx=cx+spoofLon/180*R*0.8;
    const ty=cy-spoofLat/90*R*0.8;
    ctx.beginPath();ctx.arc(tx,ty,6,0,Math.PI*2);ctx.fillStyle='rgba(255,200,0,0.9)';ctx.fill();
    ctx.beginPath();ctx.arc(tx,ty,15+Math.sin(time*4)*5,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,200,0,0.4)';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='#ffcc00';ctx.font='10px Orbitron,monospace';
    ctx.fillText('TARGET',tx,ty-18);
    ctx.fillText(spoofLat.toFixed(1)+'N '+spoofLon.toFixed(1)+'E',tx,ty+22);
  }

  // Title overlay
  ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('SKY VIEW - SATELLITE CONSTELLATION',10,18);
  if(spoofing){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('SPOOFING ACTIVE',10,34);}
}

/* ═══════ SIGNAL CANVAS ═══════ */
let signalHistory = new Array(200).fill(0);
function drawSignalView(){
  const c=$('signalCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);

  // Generate signal data
  const power=parseFloat($('powerInput')?.value||-10);
  const newVal=spoofing?-40+power+Math.random()*10:-60+Math.random()*5;
  signalHistory.push(newVal);
  if(signalHistory.length>200)signalHistory.shift();

  // Draw signal
  ctx.beginPath();
  signalHistory.forEach((v,i)=>{
    const x=i*(W/200);
    const y=H/2-(v+60)/(80)*H;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  });
  ctx.strokeStyle=spoofing?'rgba(255,50,50,0.8)':'rgba(0,200,255,0.6)';ctx.lineWidth=2;ctx.stroke();

  // Threshold line
  const threshY=H/2-(-30+60)/80*H;
  ctx.beginPath();ctx.moveTo(0,threshY);ctx.lineTo(W,threshY);
  ctx.strokeStyle='rgba(255,200,0,0.4)';ctx.lineWidth=1;ctx.setLineDash([5,5]);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(255,200,0,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('DETECTION THRESHOLD',5,threshY-5);
  ctx.fillText('SIGNAL POWER (dBm)',5,14);
}

/* ═══════ ANIMATION LOOP ═══════ */
function animate(){
  time+=0.016;
  drawSkyView();
  drawSignalView();
  updateStats();
  animFrame=requestAnimationFrame(animate);
}

function updateStats(){
  const stats=$('posStats');if(!stats)return;
  const lat=parseFloat($('latInput')?.value||0);
  const lon=parseFloat($('lonInput')?.value||0);
  const pwr=parseFloat($('powerInput')?.value||0);
  const sats=parseInt($('satCount')?.value||4);
  const spoofedCount=spoofing?sats:0;
  stats.innerHTML=
    '<b>Lat:</b> '+lat.toFixed(1)+'&deg; <b>Lon:</b> '+lon.toFixed(1)+'&deg;<br>'+
    '<b>Power:</b> '+pwr+' dBm<br>'+
    '<b>Satellites:</b> '+satellites.length+' ('+spoofedCount+' spoofed)<br>'+
    '<b>Status:</b> '+(spoofing?'<span style="color:#ff4444">SPOOFING</span>':'<span style="color:#00cc88">CLEAN</span>');
}

/* ═══════ SATELLITE LIBRARY ═══════ */
function updateSatLibrary(){
  const lib=$('satLibrary');if(!lib)return;
  lib.innerHTML='';
  satellites.forEach(sat=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+
      (sat.spoofed?'rgba(255,50,50,0.1)':'rgba(0,200,255,0.05)');
    row.innerHTML='<span style="color:'+(sat.spoofed?'#ff6666':'#66ccff')+'">'+sat.id+'</span>'+
      '<span>Az:'+sat.azimuth.toFixed(0)+'&deg; El:'+sat.elevation.toFixed(0)+'&deg;</span>'+
      '<span>SNR:'+sat.snr.toFixed(0)+' dB</span>'+
      '<span style="color:'+(sat.spoofed?'#ff4444':'#00cc88')+'">'+(sat.spoofed?'SPOOFED':'CLEAN')+'</span>';
    lib.appendChild(row);
  });
}

/* ═══════ TECHNIQUES DATABASE ═══════ */
function initTechDatabase(){
  const db=$('techDatabase');if(!db)return;
  db.innerHTML=[
    '<b>Meaconing:</b> Rebroadcasting authentic GPS signals with delay.',
    '<b>Carry-off:</b> Gradually shifting receiver position by increasing fake signal power.',
    '<b>Nulling:</b> Using directional antennas to cancel real GPS signals.',
    '<b>Replay Attack:</b> Recording and replaying valid GPS signals.',
    '<b>Constellation Sim:</b> Generating full fake satellite constellation.',
    '<b>Time Injection:</b> Manipulating GPS time synchronization.',
  ].join('<br><br>');
}

/* ═══════ CONTROLS ═══════ */
function initControls(){
  $('latInput').oninput=()=>{$('latLabel').textContent=parseFloat($('latInput').value).toFixed(1);};
  $('lonInput').oninput=()=>{$('lonLabel').textContent=parseFloat($('lonInput').value).toFixed(1);};
  $('powerInput').oninput=()=>{$('powerLabel').textContent=$('powerInput').value+' dBm';};
  $('satCount').oninput=()=>{$('satLabel').textContent=$('satCount').value;};

  $('spoofBtn').onclick=()=>{
    spoofing=!spoofing;
    setStatus(spoofing);
    $('spoofBtn').querySelector('[data-i18n]').textContent=spoofing?'Stop Spoofing':LANG[currentLang].startSpoof;
    log(spoofing?'GPS spoofing STARTED — injecting fake signals':'GPS spoofing STOPPED',spoofing?'tx':'info');
    if(spoofing)showToast('Spoofing active...',2000);
  };

  $('detectBtn').onclick=()=>{
    showToast('Analyzing signal anomalies...',1500);
    setTimeout(()=>{
      if(spoofing){
        const pwr=parseFloat($('powerInput').value);
        const confidence=Math.min(99,50+Math.abs(pwr+10)*3+Math.random()*10);
        log('SPOOF DETECTED! Confidence: '+confidence.toFixed(1)+'% — Power anomaly: '+pwr+' dBm','error');
      } else {
        log('No spoofing detected. All signals nominal.','success');
      }
      hideToast();
    },1500);
  };

  $('resetBtn').onclick=()=>{
    spoofing=false;
    setStatus(false);
    initSatellites();
    signalHistory=new Array(200).fill(0);
    $('spoofBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].startSpoof;
    log('Simulation reset','info');
    playSound('click');
  };
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  initSplash();
  initPanels();
  initLogFilters();
  initSatellites();
  initTechDatabase();
  initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');
  animate();
  setInterval(updateSatLibrary,1000);
});
