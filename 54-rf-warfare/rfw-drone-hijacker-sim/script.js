/**
 * Workshop DIY — Drone Hijacker Sim v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Canvas RF Viz
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={
  en:{title:'Drone Hijacker Sim',subtitle:'Drone Hijacker Sim',disconnected:'Idle',connected:'Hijacking',mainSection:'Drone Hijacker Sim',mainDesc:'Simulate drone RF link hijacking',sectionA:'Detected Drones',sectionB:'Attack Vectors',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',working:'Working...',ready:'Drone Hijacker ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startHijack:'Hijack Link',analyze:'Scan Links',resetSim:'Reset'},
  fr:{title:'Sim Piratage Drone',subtitle:'Sim Piratage Drone',disconnected:'Inactif',connected:'Piratage',mainSection:'Sim Piratage Drone',mainDesc:'Simuler le piratage de lien RF drone',sectionA:'Drones Detectes',sectionB:'Vecteurs d\'Attaque',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',working:'En cours...',ready:'Pirate Drone pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startHijack:'Pirater Lien',analyze:'Scanner',resetSim:'Reinitialiser'},
  ar:{title:'\u0645\u062d\u0627\u0643\u064a \u0627\u062e\u062a\u0637\u0627\u0641 \u0627\u0644\u0637\u0627\u0626\u0631\u0627\u062a',subtitle:'\u0645\u062d\u0627\u0643\u064a \u0627\u062e\u062a\u0637\u0627\u0641 \u0627\u0644\u0637\u0627\u0626\u0631\u0627\u062a',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u0627\u062e\u062a\u0637\u0627\u0641',mainSection:'\u0645\u062d\u0627\u0643\u064a \u0627\u062e\u062a\u0637\u0627\u0641',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u0627\u062e\u062a\u0637\u0627\u0641 \u0631\u0648\u0627\u0628\u0637 RF',sectionA:'\u0637\u0627\u0626\u0631\u0627\u062a \u0645\u0643\u062a\u0634\u0641\u0629',sectionB:'\u0646\u0627\u0642\u0644\u0627\u062a \u0627\u0644\u0647\u062c\u0648\u0645',activityLog:'\u0633\u062c\u0644',eventsMsg:'\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0645\u0638\u0647\u0631',settings:'\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',working:'\u062c\u0627\u0631\u064d...',ready:'\u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a',splashHint:'\u0627\u0646\u0642\u0631',langChanged:'\u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startHijack:'\u0627\u062e\u062a\u0637\u0627\u0641',analyze:'\u0645\u0633\u062d',resetSim:'\u0625\u0639\u0627\u062f\u0629'}
};
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(s[k]!=null)e.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+n,'info');}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+t;d.textContent='['+new Date().toLocaleTimeString()+'] '+m;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(on){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=on?s.connected:s.disconnected;if(p)p.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initPanels(){const hB=$('helpBtn'),hC=$('helpCloseBtn'),hP=$('helpPanel'),hO=$('helpOverlay'),sB=$('settingsBtn'),sC=$('settingsCloseBtn'),sP=$('settingsPanel'),sO=$('settingsOverlay'),lB=$('logBtn'),lC=$('logCloseBtn'),lP=$('logPanel');if(hB)hB.onclick=()=>{hP.classList.toggle('open');hO.classList.toggle('active');};if(hC)hC.onclick=()=>{hP.classList.remove('open');hO.classList.remove('active');};if(hO)hO.onclick=()=>{hP.classList.remove('open');hO.classList.remove('active');};if(sB)sB.onclick=()=>{sP.classList.toggle('open');sO.classList.toggle('active');};if(sC)sC.onclick=()=>{sP.classList.remove('open');sO.classList.remove('active');};if(sO)sO.onclick=()=>{sP.classList.remove('open');sO.classList.remove('active');};if(lB)lB.onclick=()=>lP.classList.toggle('open');if(lC)lC.onclick=()=>lP.classList.remove('open');const ls=$('langSelect'),ts=$('themeSelect'),st=$('soundToggle');if(ls)ls.onchange=()=>setLanguage(ls.value);if(ts)ts.onchange=()=>setTheme(ts.value);if(st)st.onchange=()=>{soundEnabled=st.checked;};if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const tg=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tg)tg.classList.add('active');});});}

/* ═══════ DRONE SIM ═══════ */
let hijacking=false,time=0,drones=[];
function initDrones(){drones=[];const names=['Phantom-4','Mavic-Pro','Inspire-2','Matrice-300','FPV-Racer','Skydio-X2','Autel-Evo','Parrot-Anafi'];for(let i=0;i<6;i++){drones.push({name:names[i%names.length]+'-'+Math.floor(Math.random()*99),x:100+Math.random()*580,y:50+Math.random()*200,alt:50+Math.random()*300,freq:900+Math.floor(Math.random()*5)*1000,rssi:-40-Math.random()*30,protocol:['mavlink','dsmx','wifi','lightbridge'][i%4],hijacked:false,vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*1,phase:Math.random()*Math.PI*2});}}

function drawDroneView(){
  const c=$('droneCanvas');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // Grid
  for(let x=0;x<W;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle='rgba(0,255,136,0.05)';ctx.lineWidth=1;ctx.stroke();}
  for(let y=0;y<H;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  // Ground station
  ctx.beginPath();ctx.arc(W/2,H-30,8,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.8)';ctx.fill();
  ctx.fillStyle='rgba(0,200,255,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('GCS',W/2,H-12);
  // Attacker
  if(hijacking){ctx.beginPath();ctx.arc(W/2-150,H-30,8,0,Math.PI*2);ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fill();ctx.fillStyle='rgba(255,50,50,0.5)';ctx.fillText('ATTACKER',W/2-150,H-12);}
  // Drones
  drones.forEach((d,i)=>{
    d.x+=d.vx+Math.sin(time*2+d.phase)*0.5;d.y+=d.vy*0.3+Math.cos(time*1.5+d.phase)*0.3;
    if(d.x<30||d.x>W-30)d.vx*=-1;if(d.y<20||d.y>H-80)d.vy*=-1;
    d.x=Math.max(30,Math.min(W-30,d.x));d.y=Math.max(20,Math.min(H-80,d.y));
    const hj=hijacking&&i<3;d.hijacked=hj;
    // Link line to GCS
    ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(W/2,H-30);ctx.strokeStyle=hj?'rgba(255,50,50,0.15)':'rgba(0,200,255,0.15)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    // Hijack link line
    if(hj){ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(W/2-150,H-30);ctx.strokeStyle='rgba(255,50,50,0.5)';ctx.lineWidth=2;ctx.setLineDash([6,3]);ctx.stroke();ctx.setLineDash([]);
      // Pulse
      ctx.beginPath();ctx.arc(d.x,d.y,18+Math.sin(time*5+i)*6,0,Math.PI*2);ctx.strokeStyle='rgba(255,50,50,0.3)';ctx.lineWidth=2;ctx.stroke();}
    // Drone marker
    ctx.save();ctx.translate(d.x,d.y);
    ctx.beginPath();ctx.moveTo(0,-8);ctx.lineTo(8,4);ctx.lineTo(-8,4);ctx.closePath();
    ctx.fillStyle=hj?'rgba(255,80,80,0.9)':'rgba(0,220,160,0.8)';ctx.fill();ctx.restore();
    ctx.fillStyle=hj?'#ff6666':'#66ffaa';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(d.name,d.x,d.y-14);
    if(hj)ctx.fillText('HIJACKED',d.x,d.y+16);
  });
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='11px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('AIRSPACE MONITOR — DRONE TRACKING',8,16);
  if(hijacking){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('LINK HIJACK ACTIVE',8,32);}
}

function drawLinkView(){
  const c=$('linkCanvas');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const freq=parseInt($('linkFreq')?.value||2400);
  ctx.beginPath();
  for(let x=0;x<W;x++){const f=x/W*6000;let y=H*0.85;const diff=Math.abs(f-freq);if(diff<200)y=H*0.15+H*0.7*(diff/200);
    if(hijacking&&diff<300)y=Math.min(y,H*0.1+Math.random()*H*0.3);y+=Math.random()*2;
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.strokeStyle=hijacking?'rgba(255,80,80,0.7)':'rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='10px Orbitron,monospace';ctx.fillText('LINK SPECTRUM — 0-6 GHz',5,14);
}

function animate(){time+=0.016;drawDroneView();drawLinkView();updateInfo();requestAnimationFrame(animate);}
function updateInfo(){const s=$('infoStats');if(!s)return;const hc=drones.filter(d=>d.hijacked).length;s.innerHTML='<b>Drones:</b> '+drones.length+' detected<br><b>Hijacked:</b> <span style="color:'+(hc?'#ff4444':'#00cc88')+'">'+hc+'</span><br><b>Freq:</b> '+($('linkFreq')?.value||2400)+' MHz<br><b>Protocol:</b> '+($('protocol')?.value||'mavlink');}

function updateDroneList(){const lib=$('libraryList');if(!lib)return;lib.innerHTML='';drones.forEach(d=>{const r=document.createElement('div');r.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+(d.hijacked?'rgba(255,50,50,0.1)':'rgba(0,200,255,0.05)');r.innerHTML='<span style="color:'+(d.hijacked?'#ff6666':'#66ffaa')+'">'+d.name+'</span><span>'+d.protocol+'</span><span>'+d.freq+' MHz</span><span>RSSI: '+d.rssi.toFixed(0)+'</span><span style="color:'+(d.hijacked?'#ff4444':'#00cc88')+'">'+(d.hijacked?'HIJACKED':'SECURE')+'</span>';lib.appendChild(r);});}

function initControls(){
  $('linkFreq').oninput=()=>{$('linkFreqLabel').textContent=$('linkFreq').value+' MHz';};
  $('injectPower').oninput=()=>{$('injectPowerLabel').textContent=$('injectPower').value+' dBm';};
  $('altitude').oninput=()=>{$('altLabel').textContent=$('altitude').value+' m';};
  $('startBtn').onclick=()=>{hijacking=!hijacking;setStatus(hijacking);$('startBtn').querySelector('span:last-child').textContent=hijacking?'Release Link':LANG[currentLang].startHijack;log(hijacking?'HIJACK ACTIVE — overriding command links on '+$('protocol').value:'Link hijack released',hijacking?'tx':'info');};
  $('analyzeBtn').onclick=()=>{showToast('Scanning drone links...',1500);setTimeout(()=>{log('Scan complete: '+drones.length+' drone links detected','success');hideToast();},1500);};
  $('resetBtn').onclick=()=>{hijacking=false;setStatus(false);initDrones();log('Simulation reset','info');};
}
function initRefDB(){const db=$('refDatabase');if(!db)return;db.innerHTML=['<b>Command Injection:</b> Override MAVLink/DSMX commands with stronger signal.','<b>GPS Spoofing:</b> Feed false GPS to redirect drone flight path.','<b>De-auth Attack:</b> Disconnect WiFi FPV drones from controller.','<b>Replay Attack:</b> Record and replay control packets.','<b>Protocol Exploit:</b> Leverage unencrypted telemetry channels.','<b>Signal Jamming:</b> Deny command link forcing fail-safe behavior.'].join('<br><br>');}

document.addEventListener('DOMContentLoaded',()=>{initSplash();initPanels();initLogFilters();initDrones();initRefDB();initControls();try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}log(LANG[currentLang].ready,'success');animate();setInterval(updateDroneList,1000);});
