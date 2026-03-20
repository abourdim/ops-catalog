/**
 * Workshop DIY — Drone Hijacker Sim v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Canvas RF Viz
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={
  en:{title:'Drone Hijacker Sim',subtitle:'Drone Hijacker Sim',disconnected:'Idle',connected:'Hijacking',mainSection:'Drone Hijacker Sim',mainDesc:'Simulate drone RF link hijacking',sectionA:'Detected Drones',sectionB:'Attack Vectors',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',working:'Working...',ready:'Drone Hijacker ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startHijack:'Hijack Link',analyze:'Scan Links',resetSim:'Reset',faq_q1:'What is this app?',faq_a1:'An interactive educational simulation from Workshop-DIY. Explore, experiment, and learn!',faq_q2:'How do I use it?',faq_a2:'Use the controls in the main section. Try different settings and watch what happens.',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick a theme. There are 8 to choose from.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.'},
  fr:{title:'Sim Piratage Drone',subtitle:'Sim Piratage Drone',disconnected:'Inactif',connected:'Piratage',mainSection:'Sim Piratage Drone',mainDesc:'Simuler le piratage de lien RF drone',sectionA:'Drones Detectes',sectionB:'Vecteurs d\'Attaque',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',working:'En cours...',ready:'Pirate Drone pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startHijack:'Pirater Lien',analyze:'Scanner',resetSim:'Reinitialiser',faq_q1:'C\'est quoi cette appli?',faq_a1:'Une simulation educative interactive de Workshop-DIY. Explore, experimente et apprends!',faq_q2:'Comment l\'utiliser?',faq_a2:'Utilise les controles dans la section principale. Essaie differents reglages.',faq_q3:'Puis-je changer le theme?',faq_a3:'Oui! Ouvre les Parametres et choisis un theme. Il y en a 8.',faq_q4:'Mes donnees sont-elles privees?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.'},
  ar:{title:'\u0645\u062d\u0627\u0643\u064a \u0627\u062e\u062a\u0637\u0627\u0641 \u0627\u0644\u0637\u0627\u0626\u0631\u0627\u062a',subtitle:'\u0645\u062d\u0627\u0643\u064a \u0627\u062e\u062a\u0637\u0627\u0641 \u0627\u0644\u0637\u0627\u0626\u0631\u0627\u062a',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u0627\u062e\u062a\u0637\u0627\u0641',mainSection:'\u0645\u062d\u0627\u0643\u064a \u0627\u062e\u062a\u0637\u0627\u0641',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u0627\u062e\u062a\u0637\u0627\u0641 \u0631\u0648\u0627\u0628\u0637 RF',sectionA:'\u0637\u0627\u0626\u0631\u0627\u062a \u0645\u0643\u062a\u0634\u0641\u0629',sectionB:'\u0646\u0627\u0642\u0644\u0627\u062a \u0627\u0644\u0647\u062c\u0648\u0645',activityLog:'\u0633\u062c\u0644',eventsMsg:'\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0645\u0638\u0647\u0631',settings:'\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',working:'\u062c\u0627\u0631\u064d...',ready:'\u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a',splashHint:'\u0627\u0646\u0642\u0631',langChanged:'\u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startHijack:'\u0627\u062e\u062a\u0637\u0627\u0641',analyze:'\u0645\u0633\u062d',resetSim:'\u0625\u0639\u0627\u062f\u0629',faq_q1:'ما هذا التطبيق؟',faq_a1:'محاكاة تعليمية تفاعلية من Workshop-DIY. استكشف وجرب وتعلم!',faq_q2:'كيف أستخدمه؟',faq_a2:'استخدم عناصر التحكم في القسم الرئيسي. جرب إعدادات مختلفة.',faq_q3:'هل يمكنني تغيير السمة؟',faq_a3:'نعم! افتح الإعدادات واختر سمة. هناك 8 سمات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.'}
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

/* ═══════ ENHANCED RF CANVAS — DRONE HIJACKER ═══════ */
(function(){
const _$=id=>document.getElementById(id);
let _t=0;
let _linkQuality=new Array(250).fill(100);
let _packetLoss=new Array(250).fill(0);
let _telemetryBuf=[];
const MAX_TEL=80;
let _signalConst=[];
for(let i=0;i<64;i++)_signalConst.push({i:Math.random()*2-1,q:Math.random()*2-1});
let _hopHistory=[];
let _droneTrails={};

/* ── Signal Constellation Diagram (IQ Plot) ── */
function drawConstellation(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('IQ CONSTELLATION — COMMAND LINK',5,12);
  const cx=W/2,cy=H/2,R=Math.min(W,H)/2-20;
  ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.1)';ctx.lineWidth=1;ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,R*0.6,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.stroke();
  const isHijack=typeof hijacking!=='undefined'&&hijacking;
  _signalConst.forEach((pt,i)=>{
    let ni=pt.i+Math.random()*0.1-0.05;
    let nq=pt.q+Math.random()*0.1-0.05;
    if(isHijack){ni+=Math.random()*0.6-0.3;nq+=Math.random()*0.6-0.3;}
    const px=cx+ni*R*0.8,py=cy+nq*R*0.8;
    ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);
    ctx.fillStyle=isHijack?'rgba(255,80,80,'+(0.4+Math.random()*0.4)+')':'rgba(0,200,255,'+(0.5+Math.random()*0.3)+')';
    ctx.fill();
  });
  if(isHijack){ctx.fillStyle='rgba(255,50,50,0.6)';ctx.font='8px Orbitron,monospace';ctx.fillText('SIGNAL DEGRADED',W-110,H-5);}
}

/* ── Link Quality & Packet Loss Chart ── */
function drawLinkQuality(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('LINK QUALITY / PACKET LOSS',5,12);
  const isHijack=typeof hijacking!=='undefined'&&hijacking;
  const pwr=parseInt(_$('injectPower')?.value||20);
  let q=isHijack?Math.max(5,100-pwr*2+Math.random()*20):95+Math.random()*5;
  let pl=isHijack?Math.min(80,pwr*1.5+Math.random()*15):Math.random()*2;
  _linkQuality.push(q);if(_linkQuality.length>250)_linkQuality.shift();
  _packetLoss.push(pl);if(_packetLoss.length>250)_packetLoss.shift();
  // Quality
  ctx.beginPath();
  _linkQuality.forEach((v,i)=>{const x=(i/250)*W;const y=20+(100-v)/100*(H-30);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(0,200,255,0.7)';ctx.lineWidth=1.5;ctx.stroke();
  // Packet loss
  ctx.beginPath();
  _packetLoss.forEach((v,i)=>{const x=(i/250)*W;const y=20+(100-v)/100*(H-30);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(255,80,80,0.7)';ctx.lineWidth=1.5;ctx.stroke();
  // Labels
  ctx.fillStyle='rgba(0,200,255,0.5)';ctx.font='7px Orbitron,monospace';ctx.fillText('Quality: '+q.toFixed(0)+'%',W-120,H-15);
  ctx.fillStyle='rgba(255,80,80,0.5)';ctx.fillText('Loss: '+pl.toFixed(0)+'%',W-120,H-5);
}

/* ── Frequency Hopping Tracker ── */
function drawFreqHopping(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('FREQUENCY HOPPING PATTERN',5,12);
  if(_t%0.15<0.02){
    const freq=2400+Math.floor(Math.random()*80)*5;
    _hopHistory.push({t:_t,f:freq});
    if(_hopHistory.length>150)_hopHistory.shift();
  }
  _hopHistory.forEach((h,i)=>{
    const x=(i/150)*W;
    const y=25+((h.f-2400)/400)*(H-35);
    ctx.beginPath();ctx.arc(x,y,2,0,Math.PI*2);
    const age=1-i/150;
    ctx.fillStyle='rgba(0,200,255,'+age*0.7+')';ctx.fill();
    if(i>0){ctx.beginPath();const prev=_hopHistory[i-1];
      ctx.moveTo(((i-1)/150)*W,25+((prev.f-2400)/400)*(H-35));ctx.lineTo(x,y);
      ctx.strokeStyle='rgba(0,200,255,'+age*0.2+')';ctx.lineWidth=0.5;ctx.stroke();}
  });
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';ctx.textAlign='right';
  for(let f=2400;f<=2480;f+=20){const y=25+((f-2400)/400)*(H-35);ctx.fillText(f+'',W-3,y+3);}
}

/* ── Drone Altitude Profile ── */
function drawAltProfile(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('ALTITUDE PROFILE — TRACKED DRONES',5,12);
  if(typeof drones==='undefined')return;
  drones.forEach((d,i)=>{
    if(!_droneTrails[d.name])_droneTrails[d.name]=[];
    _droneTrails[d.name].push(d.alt+Math.sin(_t*2+i)*10);
    if(_droneTrails[d.name].length>200)_droneTrails[d.name].shift();
    const trail=_droneTrails[d.name];
    const colors=['rgba(0,200,255,','rgba(0,255,136,','rgba(255,200,0,','rgba(200,100,255,','rgba(255,100,100,','rgba(100,255,200,'];
    ctx.beginPath();
    trail.forEach((alt,j)=>{const x=(j/200)*W;const y=H-10-(alt/400)*(H-30);if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
    ctx.strokeStyle=colors[i%colors.length]+'0.6)';ctx.lineWidth=1;ctx.stroke();
  });
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';
  for(let a=0;a<=400;a+=100){const y=H-10-(a/400)*(H-30);ctx.fillText(a+'m',3,y+3);}
}

/* ── MAVLink Protocol Packet View ── */
function drawProtocolView(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('PROTOCOL PACKET ANALYSIS',5,12);
  const isHijack=typeof hijacking!=='undefined'&&hijacking;
  const proto=_$('protocol')?.value||'mavlink';
  const packetTypes=['HEARTBEAT','GPS_RAW','ATTITUDE','RC_CHANNELS','SYS_STATUS','COMMAND_LONG','MISSION_ITEM','PARAM_VALUE'];
  const rows=Math.min(packetTypes.length,Math.floor((H-25)/18));
  for(let i=0;i<rows;i++){
    const y=25+i*18;
    const rate=10+Math.random()*40;
    const barW=(rate/50)*(W-180);
    const injected=isHijack&&i<3;
    ctx.fillStyle=injected?'rgba(255,50,50,0.2)':'rgba(0,200,255,0.08)';ctx.fillRect(5,y-1,W-10,16);
    ctx.fillStyle=injected?'rgba(255,50,50,0.3)':'rgba(0,200,255,0.2)';ctx.fillRect(140,y+2,barW,10);
    ctx.fillStyle=injected?'#ff6666':'#66ccff';ctx.font='8px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText(packetTypes[i],10,y+11);
    ctx.fillStyle='rgba(255,255,255,0.4)';ctx.textAlign='right';
    ctx.fillText(rate.toFixed(0)+' pkt/s',W-10,y+11);
    if(injected){ctx.fillStyle='rgba(255,50,50,0.7)';ctx.font='7px Orbitron,monospace';ctx.textAlign='right';ctx.fillText('INJECTED',135,y+11);}
  }
}

/* ── RF Power Density Map ── */
function drawPowerDensity(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('RF POWER DENSITY MAP',5,12);
  const isHijack=typeof hijacking!=='undefined'&&hijacking;
  const step=12;
  for(let gx=0;gx<W;gx+=step){for(let gy=20;gy<H;gy+=step){
    let power=-70+Math.random()*5;
    const cx=W/2,cy=H-30;
    const dist=Math.sqrt((gx-cx)**2+(gy-cy)**2);
    power+=Math.max(0,30-dist*0.1);
    if(isHijack){const ax=W/2-150,ay=H-30;
      const aDist=Math.sqrt((gx-ax)**2+(gy-ay)**2);
      power+=Math.max(0,40-aDist*0.12);}
    const norm=Math.max(0,Math.min(1,(power+70)/50));
    const r=norm>0.6?255:norm*400;
    const g=norm>0.3&&norm<0.7?200:norm<0.3?norm*600:0;
    const b=norm<0.3?200-norm*600:0;
    ctx.fillStyle='rgba('+Math.floor(r)+','+Math.floor(g)+','+Math.floor(b)+',0.35)';
    ctx.fillRect(gx,gy,step-1,step-1);
  }}
}

function enhancedRender(){
  _t+=0.016;
  const dc=_$('droneCanvas');
  if(dc){const ctx=dc.getContext('2d');const W=dc.width,H=dc.height;
    drawPowerDensity(ctx,W,H);}
  const lc=_$('linkCanvas');
  if(lc){const ctx=lc.getContext('2d');const W=lc.width,H=lc.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawConstellation(ctx,W*0.4,H);
    ctx.save();ctx.translate(W*0.4,0);drawLinkQuality(ctx,W*0.6,H*0.5);
    ctx.restore();ctx.save();ctx.translate(W*0.4,H*0.5);drawFreqHopping(ctx,W*0.6,H*0.5);ctx.restore();}
  requestAnimationFrame(enhancedRender);
}
setTimeout(()=>{enhancedRender();},500);
})();
