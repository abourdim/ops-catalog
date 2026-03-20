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
  en:{title:'GPS Spoofing Sim',subtitle:'GPS Spoofing Simulator',disconnected:'Idle',connected:'Spoofing',mainSection:'GPS Spoofing Simulator',mainDesc:'Simulate satellite spoofing and position manipulation',sectionA:'Satellite Constellation',sectionB:'Spoofing Techniques',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is this app?',faq_a1:'A GPS spoofing simulator for educational RF warfare studies.',faq_q2:'How does it work?',faq_a2:'Broadcasting fake GPS signals stronger than real ones.',faq_q3:'Is this real?',faq_a3:'No. Visual simulation only.',faq_q4:'Data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Set target coordinates.',howto_2:'Adjust power and satellite count.',howto_3:'Click Start Spoofing.',howto_4:'Use Detect to analyze anomalies.',working:'Working...',ready:'GPS Spoofing Sim ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startSpoof:'Start Spoofing',detectSpoof:'Detect Spoof',resetSim:'Reset',spoofTarget:'Spoof Target',spoofParams:'Spoof Parameters',latitude:'Latitude:',longitude:'Longitude:',power:'Power (dBm):',satellites:'Spoofed Sats:',sigInfo:'Position Info',satHint:'GPS satellites and spoofed status.',transmitted:'Signal transmitted',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.'},
  fr:{title:'Sim Spoofing GPS',subtitle:'Simulateur de Spoofing GPS',disconnected:'Inactif',connected:'Spoofing',mainSection:'Simulateur Spoofing GPS',mainDesc:'Simuler le spoofing satellite et la manipulation de position',sectionA:'Constellation Satellite',sectionB:'Techniques de Spoofing',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'C\'est quoi?',faq_a1:'Un simulateur de spoofing GPS educatif.',faq_q2:'Comment ca marche?',faq_a2:'En emettant de faux signaux GPS.',faq_q3:'C\'est reel?',faq_a3:'Non. Simulation visuelle.',faq_q4:'Donnees privees?',faq_a4:'Oui. Tout est local.',howto_1:'Definir les coordonnees.',howto_2:'Ajuster puissance et satellites.',howto_3:'Cliquer Demarrer.',howto_4:'Utiliser Detecter.',working:'En cours...',ready:'Sim GPS pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startSpoof:'Demarrer Spoofing',detectSpoof:'Detecter Spoof',resetSim:'Reinitialiser',spoofTarget:'Cible Spoof',spoofParams:'Parametres Spoof',latitude:'Latitude:',longitude:'Longitude:',power:'Puissance (dBm):',satellites:'Sats Spoofes:',sigInfo:'Info Position',satHint:'Satellites GPS et leur statut.',transmitted:'Signal transmis',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.'},
  ar:{title:'\u0645\u062d\u0627\u0643\u064a \u062a\u0632\u064a\u064a\u0641 GPS',subtitle:'\u0645\u062d\u0627\u0643\u064a \u062a\u0632\u064a\u064a\u0641 \u0625\u0634\u0627\u0631\u0627\u062a GPS',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u062a\u0632\u064a\u064a\u0641',mainSection:'\u0645\u062d\u0627\u0643\u064a \u062a\u0632\u064a\u064a\u0641 GPS',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u062a\u0632\u064a\u064a\u0641 \u0627\u0644\u0623\u0642\u0645\u0627\u0631 \u0627\u0644\u0635\u0646\u0627\u0639\u064a\u0629',sectionA:'\u0643\u0648\u0643\u0628\u0629 \u0627\u0644\u0623\u0642\u0645\u0627\u0631',sectionB:'\u062a\u0642\u0646\u064a\u0627\u062a \u0627\u0644\u062a\u0632\u064a\u064a\u0641',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0645\u062d\u0627\u0643\u064a GPS \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startSpoof:'\u0628\u062f\u0621 \u0627\u0644\u062a\u0632\u064a\u064a\u0641',detectSpoof:'\u0643\u0634\u0641 \u0627\u0644\u062a\u0632\u064a\u064a\u0641',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',spoofTarget:'\u0647\u062f\u0641 \u0627\u0644\u062a\u0632\u064a\u064a\u0641',spoofParams:'\u0645\u0639\u0644\u0645\u0627\u062a',latitude:'\u062e\u0637 \u0627\u0644\u0639\u0631\u0636:',longitude:'\u062e\u0637 \u0627\u0644\u0637\u0648\u0644:',power:'\u0627\u0644\u0642\u062f\u0631\u0629:',satellites:'\u0623\u0642\u0645\u0627\u0631 \u0645\u0632\u064a\u0641\u0629:',sigInfo:'\u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0644\u0645\u0648\u0642\u0639',satHint:'\u0623\u0642\u0645\u0627\u0631 GPS \u0648\u062d\u0627\u0644\u062a\u0647\u0627.',transmitted:'\u062a\u0645 \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0625\u0634\u0627\u0631\u0629',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.'}
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

/* ═══════ ENHANCED RF CANVAS VISUALIZATION ═══════ */
(function(){
  const _$ = id => document.getElementById(id);
  let _t = 0, _frame = null;
  const _particles = [];
  const _spoofTrails = [];
  let _constellationPhase = 0;
  let _spectrumData = new Float32Array(512).fill(-90);
  let _waterfallBuf = [];
  const MAX_WF_ROWS = 120;

  /* ── Particle System for Signal Propagation ── */
  class SignalParticle {
    constructor(x, y, tx, ty, color, speed) {
      this.x = x; this.y = y; this.tx = tx; this.ty = ty;
      this.color = color; this.speed = speed || 2;
      this.life = 1; this.decay = 0.015 + Math.random() * 0.01;
      this.size = 1.5 + Math.random() * 2;
      const dx = tx - x, dy = ty - y, d = Math.sqrt(dx*dx + dy*dy);
      this.vx = (dx / d) * this.speed; this.vy = (dy / d) * this.speed;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      this.life -= this.decay;
      return this.life > 0;
    }
    draw(ctx) {
      ctx.beginPath(); ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
      ctx.fillStyle = this.color.replace('1)', this.life * 0.8 + ')');
      ctx.fill();
    }
  }

  function spawnSatelliteParticles(cx, cy, sats, isSpoofing) {
    sats.forEach((sat, i) => {
      if (Math.random() > 0.06) return;
      const az = sat.azimuth * Math.PI / 180;
      const elR = (90 - sat.elevation) / 90;
      const sx = cx + Math.sin(az) * elR * 120;
      const sy = cy - Math.cos(az) * elR * 120;
      const col = sat.spoofed ? 'rgba(255,60,60,' : 'rgba(0,200,255,';
      _particles.push(new SignalParticle(sx, sy, cx, cy, col + '1)', 1.5 + Math.random()));
    });
  }

  /* ── Constellation Geometry Overlay ── */
  function drawConstellationGeometry(ctx, W, H, sats) {
    _constellationPhase += 0.005;
    const cx = W / 2, cy = H / 2;
    ctx.save(); ctx.globalAlpha = 0.12;
    sats.forEach((s1, i) => {
      sats.forEach((s2, j) => {
        if (j <= i) return;
        const az1 = s1.azimuth * Math.PI / 180, az2 = s2.azimuth * Math.PI / 180;
        const r1 = (90 - s1.elevation) / 90, r2 = (90 - s2.elevation) / 90;
        const x1 = cx + Math.sin(az1) * r1 * 100, y1 = cy - Math.cos(az1) * r1 * 100;
        const x2 = cx + Math.sin(az2) * r2 * 100, y2 = cy - Math.cos(az2) * r2 * 100;
        const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        if (dist < 120) {
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          ctx.strokeStyle = (s1.spoofed || s2.spoofed) ? '#ff4444' : '#00ccff';
          ctx.lineWidth = 0.8; ctx.stroke();
        }
      });
    });
    ctx.restore();
  }

  /* ── GDOP (Geometric Dilution of Precision) Heatmap ── */
  function drawGDOPHeatmap(ctx, W, H, sats) {
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 30;
    const step = 16;
    ctx.save(); ctx.globalAlpha = 0.08;
    for (let gx = 0; gx < W; gx += step) {
      for (let gy = 0; gy < H; gy += step) {
        const dx = gx - cx, dy = gy - cy;
        if (Math.sqrt(dx * dx + dy * dy) > R) continue;
        let minDist = Infinity;
        sats.forEach(s => {
          const az = s.azimuth * Math.PI / 180;
          const elR = (90 - s.elevation) / 90;
          const sx = cx + Math.sin(az) * elR * R;
          const sy = cy - Math.cos(az) * elR * R;
          const d = Math.sqrt((gx - sx) ** 2 + (gy - sy) ** 2);
          if (d < minDist) minDist = d;
        });
        const gdop = Math.min(1, minDist / 150);
        const r = Math.floor(gdop * 255), g = Math.floor((1 - gdop) * 200);
        ctx.fillStyle = 'rgb(' + r + ',' + g + ',50)';
        ctx.fillRect(gx, gy, step - 1, step - 1);
      }
    }
    ctx.restore();
  }

  /* ── Enhanced Spectrum Analyzer ── */
  function drawAdvancedSpectrum(ctx, W, H, isSpoofing, power) {
    // Generate realistic GPS L-band spectrum
    for (let i = 0; i < 512; i++) {
      const f = 1150 + (i / 512) * 700; // 1150-1850 MHz range
      let level = -90 + Math.random() * 3;
      // L1 signal at 1575.42 MHz
      const l1Diff = Math.abs(f - 1575.42);
      if (l1Diff < 12) level += 25 * Math.exp(-l1Diff * l1Diff / 50);
      // L2 at 1227.60 MHz
      const l2Diff = Math.abs(f - 1227.60);
      if (l2Diff < 10) level += 20 * Math.exp(-l2Diff * l2Diff / 40);
      // L5 at 1176.45 MHz
      const l5Diff = Math.abs(f - 1176.45);
      if (l5Diff < 10) level += 18 * Math.exp(-l5Diff * l5Diff / 35);
      if (isSpoofing) {
        if (l1Diff < 15) level += power + 20 + Math.random() * 8;
        if (l2Diff < 12) level += (power + 15) * 0.6 + Math.random() * 5;
      }
      _spectrumData[i] = _spectrumData[i] * 0.7 + level * 0.3;
    }
    // Draw spectrum
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(255,50,50,0.8)'); grad.addColorStop(0.5, 'rgba(255,200,0,0.6)');
    grad.addColorStop(1, 'rgba(0,200,100,0.4)');
    ctx.beginPath();
    for (let i = 0; i < 512; i++) {
      const x = (i / 512) * W;
      const y = H - 15 - ((_spectrumData[i] + 95) / 70) * (H - 30);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H - 15); ctx.lineTo(0, H - 15); ctx.closePath();
    ctx.fillStyle = isSpoofing ? 'rgba(255,50,50,0.1)' : 'rgba(0,200,255,0.08)';
    ctx.fill();
    ctx.beginPath();
    for (let i = 0; i < 512; i++) {
      const x = (i / 512) * W;
      const y = H - 15 - ((_spectrumData[i] + 95) / 70) * (H - 30);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = isSpoofing ? 'rgba(255,80,80,0.9)' : 'rgba(0,200,255,0.7)';
    ctx.lineWidth = 1.5; ctx.stroke();
    // Frequency labels
    ctx.fillStyle = 'rgba(0,255,136,0.35)'; ctx.font = '8px Orbitron,monospace'; ctx.textAlign = 'center';
    [1176, 1228, 1381, 1575, 1602, 1800].forEach(f => {
      const x = ((f - 1150) / 700) * W;
      ctx.fillText(f + '', x, H - 2);
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H - 15);
      ctx.strokeStyle = 'rgba(0,255,136,0.06)'; ctx.lineWidth = 1; ctx.stroke();
    });
    // Band labels
    ctx.fillStyle = 'rgba(0,200,255,0.5)'; ctx.font = '9px Orbitron,monospace';
    const l5x = ((1176.45 - 1150) / 700) * W;
    const l2x = ((1227.60 - 1150) / 700) * W;
    const l1x = ((1575.42 - 1150) / 700) * W;
    ctx.fillText('L5', l5x, 12); ctx.fillText('L2', l2x, 12); ctx.fillText('L1', l1x, 12);
  }

  /* ── Waterfall Display ── */
  function drawWaterfall(ctx, W, H, isSpoofing) {
    const row = new Uint8Array(W);
    for (let x = 0; x < W; x++) {
      const idx = Math.floor((x / W) * 512);
      const val = Math.max(0, Math.min(255, (_spectrumData[idx] + 95) * 3.5));
      row[x] = val;
    }
    _waterfallBuf.unshift(row);
    if (_waterfallBuf.length > MAX_WF_ROWS) _waterfallBuf.pop();
    const rowH = H / MAX_WF_ROWS;
    _waterfallBuf.forEach((r, ri) => {
      for (let x = 0; x < W; x += 2) {
        const v = r[x];
        const red = v > 180 ? 255 : v > 100 ? v * 2 : v;
        const grn = v > 180 ? (255 - v) : v > 80 ? v : v * 0.5;
        const blu = v < 80 ? v * 2 : 0;
        ctx.fillStyle = 'rgb(' + (red | 0) + ',' + (grn | 0) + ',' + (blu | 0) + ')';
        ctx.fillRect(x, ri * rowH, 2, rowH + 1);
      }
    });
  }

  /* ── Doppler Shift Visualization ── */
  function drawDopplerShift(ctx, W, H, sats) {
    ctx.save(); ctx.globalAlpha = 0.6;
    ctx.fillStyle = 'rgba(0,255,136,0.4)'; ctx.font = '9px Orbitron,monospace';
    ctx.textAlign = 'left'; ctx.fillText('DOPPLER SHIFT (Hz)', 5, 12);
    const barH = (H - 25) / Math.max(sats.length, 1);
    sats.forEach((sat, i) => {
      const doppler = Math.sin(_t * sat.orbitSpeed + sat.phase) * 4500;
      const y = 20 + i * barH;
      const bw = (doppler / 5000) * (W / 2 - 20);
      ctx.fillStyle = sat.spoofed ? 'rgba(255,60,60,0.4)' : 'rgba(0,200,255,0.3)';
      ctx.fillRect(W / 2, y, bw, barH - 2);
      ctx.fillStyle = sat.spoofed ? '#ff6666' : '#66ccff';
      ctx.font = '7px Orbitron,monospace'; ctx.textAlign = 'right';
      ctx.fillText(sat.id, W / 2 - 4, y + barH / 2 + 3);
      ctx.textAlign = 'left';
      ctx.fillText((doppler > 0 ? '+' : '') + doppler.toFixed(0), W / 2 + bw + 4, y + barH / 2 + 3);
    });
    // Zero line
    ctx.beginPath(); ctx.moveTo(W / 2, 18); ctx.lineTo(W / 2, H);
    ctx.strokeStyle = 'rgba(255,200,0,0.3)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
  }

  /* ── C/N0 (Carrier-to-Noise) Bar Chart ── */
  function drawCN0Bars(ctx, W, H, sats) {
    ctx.fillStyle = 'rgba(0,255,136,0.4)'; ctx.font = '9px Orbitron,monospace';
    ctx.textAlign = 'left'; ctx.fillText('C/N0 (dB-Hz)', 5, 12);
    const barW = Math.max(8, (W - 20) / sats.length - 4);
    sats.forEach((sat, i) => {
      const x = 10 + i * (barW + 4);
      let cn0 = 30 + sat.snr * 0.8 + Math.sin(_t + sat.phase) * 2;
      if (sat.spoofed) cn0 += 8 + Math.random() * 5;
      const barH = (cn0 / 55) * (H - 35);
      const col = sat.spoofed ? (cn0 > 45 ? 'rgba(255,50,50,0.7)' : 'rgba(255,100,60,0.5)')
                               : (cn0 > 40 ? 'rgba(0,200,100,0.6)' : 'rgba(0,150,255,0.5)');
      ctx.fillStyle = col;
      ctx.fillRect(x, H - 18 - barH, barW, barH);
      ctx.strokeStyle = sat.spoofed ? 'rgba(255,80,80,0.5)' : 'rgba(0,200,255,0.3)';
      ctx.lineWidth = 1; ctx.strokeRect(x, H - 18 - barH, barW, barH);
      ctx.fillStyle = sat.spoofed ? '#ff6666' : '#aaa';
      ctx.font = '7px Orbitron,monospace'; ctx.textAlign = 'center';
      ctx.fillText(sat.id.split('-')[1], x + barW / 2, H - 5);
      ctx.fillText(cn0.toFixed(0), x + barW / 2, H - 22 - barH);
    });
    // Threshold line
    const threshY = H - 18 - (35 / 55) * (H - 35);
    ctx.beginPath(); ctx.moveTo(5, threshY); ctx.lineTo(W - 5, threshY);
    ctx.strokeStyle = 'rgba(255,200,0,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,200,0,0.4)'; ctx.font = '7px Orbitron,monospace';
    ctx.textAlign = 'right'; ctx.fillText('MIN LOCK', W - 5, threshY - 3);
  }

  /* ── Position Error Scatter Plot ── */
  let _posErrors = [];
  function drawPositionError(ctx, W, H, isSpoofing, power) {
    ctx.fillStyle = 'rgba(0,255,136,0.4)'; ctx.font = '9px Orbitron,monospace';
    ctx.textAlign = 'left'; ctx.fillText('POSITION ERROR SCATTER (m)', 5, 12);
    const cx = W / 2, cy = H / 2 + 5;
    // Grid circles (meters)
    [20, 50, 100, 200].forEach(r => {
      const pr = r / 250 * Math.min(W, H) / 2;
      ctx.beginPath(); ctx.arc(cx, cy, pr, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,255,136,0.1)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = 'rgba(0,255,136,0.2)'; ctx.font = '7px Orbitron,monospace';
      ctx.textAlign = 'left'; ctx.fillText(r + 'm', cx + pr + 2, cy);
    });
    // Generate new error point
    if (_t % 0.1 < 0.02) {
      let ex, ey;
      if (isSpoofing) {
        const drift = (power + 10) * 3;
        ex = drift + (Math.random() - 0.3) * 40;
        ey = drift * 0.7 + (Math.random() - 0.5) * 30;
      } else {
        ex = (Math.random() - 0.5) * 15;
        ey = (Math.random() - 0.5) * 15;
      }
      _posErrors.push({ x: ex, y: ey, age: 0 });
      if (_posErrors.length > 80) _posErrors.shift();
    }
    _posErrors.forEach(p => {
      p.age += 0.01;
      const px = cx + (p.x / 250) * Math.min(W, H) / 2;
      const py = cy + (p.y / 250) * Math.min(W, H) / 2;
      const alpha = Math.max(0.1, 1 - p.age);
      ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      const dist = Math.sqrt(p.x * p.x + p.y * p.y);
      ctx.fillStyle = dist > 100 ? 'rgba(255,50,50,' + alpha + ')' :
                      dist > 30 ? 'rgba(255,200,0,' + alpha + ')' :
                      'rgba(0,200,100,' + alpha + ')';
      ctx.fill();
    });
    // Crosshair
    ctx.beginPath(); ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
    ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1; ctx.stroke();
  }

  /* ── Time Series: Pseudorange Residuals ── */
  let _pseudorangeResiduals = new Array(200).fill(0);
  function drawPseudorangeResiduals(ctx, W, H, isSpoofing, power) {
    const newVal = isSpoofing ? (power + 10) * 2 + Math.sin(_t * 2) * 15 + Math.random() * 10
                              : Math.random() * 4 - 2;
    _pseudorangeResiduals.push(newVal);
    if (_pseudorangeResiduals.length > 200) _pseudorangeResiduals.shift();
    ctx.fillStyle = 'rgba(0,255,136,0.4)'; ctx.font = '9px Orbitron,monospace';
    ctx.textAlign = 'left'; ctx.fillText('PSEUDORANGE RESIDUALS (m)', 5, 12);
    // Draw
    ctx.beginPath();
    _pseudorangeResiduals.forEach((v, i) => {
      const x = (i / 200) * W;
      const y = H / 2 - (v / 80) * (H / 2 - 15);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = isSpoofing ? 'rgba(255,80,80,0.8)' : 'rgba(0,200,255,0.7)';
    ctx.lineWidth = 1.5; ctx.stroke();
    // Zero line
    ctx.beginPath(); ctx.moveTo(0, H / 2); ctx.lineTo(W, H / 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.stroke();
    // Alarm threshold
    [20, -20].forEach(th => {
      const y = H / 2 - (th / 80) * (H / 2 - 15);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
      ctx.strokeStyle = 'rgba(255,200,0,0.3)'; ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
    });
  }

  /* ── Master Enhanced Render ── */
  function enhancedRender() {
    _t += 0.016;
    // Update particles
    for (let i = _particles.length - 1; i >= 0; i--) {
      if (!_particles[i].update()) _particles.splice(i, 1);
    }
    // Draw on sky canvas overlay
    const skyC = _$('skyCanvas');
    if (skyC) {
      const ctx = skyC.getContext('2d');
      const W = skyC.width, H = skyC.height;
      if (typeof satellites !== 'undefined' && satellites.length > 0) {
        drawConstellationGeometry(ctx, W, H, satellites);
        drawGDOPHeatmap(ctx, W, H, satellites);
        spawnSatelliteParticles(W / 2, H / 2, satellites, typeof spoofing !== 'undefined' && spoofing);
        _particles.forEach(p => p.draw(ctx));
      }
    }
    // Draw enhanced spectrum on signal canvas
    const sigC = _$('signalCanvas');
    if (sigC) {
      const ctx = sigC.getContext('2d');
      const W = sigC.width, H = sigC.height;
      const isSpoofing = typeof spoofing !== 'undefined' && spoofing;
      const pwr = parseFloat(_$('powerInput')?.value || -10);
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, H);
      drawAdvancedSpectrum(ctx, W, H * 0.55, isSpoofing, pwr);
      ctx.save(); ctx.translate(0, H * 0.55);
      drawWaterfall(ctx, W, H * 0.45, isSpoofing);
      ctx.restore();
    }
    _frame = requestAnimationFrame(enhancedRender);
  }

  // Start after a short delay to not interfere with main init
  setTimeout(() => { enhancedRender(); }, 500);
})();
