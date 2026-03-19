/**
 * Workshop DIY — IMSI Catcher Sim v1.2
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={
  en:{title:'IMSI Catcher Sim',subtitle:'IMSI Catcher Sim',disconnected:'Idle',connected:'Deployed',mainSection:'IMSI Catcher Sim',mainDesc:'Simulate fake base station interception',sectionA:'Captured Devices',sectionB:'IMSI Techniques',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',working:'Working...',ready:'IMSI Catcher ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:'},
  fr:{title:'Sim Capteur IMSI',subtitle:'Sim Capteur IMSI',disconnected:'Inactif',connected:'Deploye',mainSection:'Sim Capteur IMSI',mainDesc:'Simuler interception par fausse station',sectionA:'Appareils Captures',sectionB:'Techniques IMSI',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',working:'En cours...',ready:'Capteur IMSI pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Sons',splashHint:'appuyer',langChanged:'Francais',themeChanged:'Theme:'},
  ar:{title:'\u0645\u062d\u0627\u0643\u064a IMSI',subtitle:'\u0645\u062d\u0627\u0643\u064a IMSI',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u0645\u0646\u0634\u0648\u0631',mainSection:'\u0645\u062d\u0627\u0643\u064a IMSI',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u0627\u0639\u062a\u0631\u0627\u0636 \u0627\u0644\u0627\u062a\u0635\u0627\u0644\u0627\u062a',sectionA:'\u0623\u062c\u0647\u0632\u0629 \u0645\u0644\u062a\u0642\u0637\u0629',sectionB:'\u062a\u0642\u0646\u064a\u0627\u062a',activityLog:'\u0633\u062c\u0644',eventsMsg:'\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0645\u0638\u0647\u0631',settings:'\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',working:'\u062c\u0627\u0631\u064d...',ready:'\u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0635\u0648\u062a',splashHint:'\u0627\u0646\u0642\u0631',langChanged:'\u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:'}
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

/* ═══════ IMSI SIM ═══════ */
let deployed=false,time=0,devices=[];
function genIMSI(){return '60302'+Array.from({length:10},()=>Math.floor(Math.random()*10)).join('');}
function genIMEI(){return Array.from({length:15},()=>Math.floor(Math.random()*10)).join('');}
function initDevices(){devices=[];for(let i=0;i<12;i++){devices.push({imsi:genIMSI(),imei:genIMEI(),rssi:-50-Math.random()*40,dist:50+Math.random()*500,connected:false,x:Math.random()*700+40,y:Math.random()*250+40,vx:(Math.random()-0.5)*1.5,vy:(Math.random()-0.5)*1,type:['Phone','Tablet','IoT','Phone','Phone','Phone'][i%6]});}}

function drawCellView(){
  const c=$('cellCanvas');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const cx=W/2,cy=H/2;
  // Cell tower
  ctx.beginPath();ctx.moveTo(cx-4,cy+20);ctx.lineTo(cx+4,cy+20);ctx.lineTo(cx+2,cy-15);ctx.lineTo(cx-2,cy-15);ctx.closePath();
  ctx.fillStyle=deployed?'rgba(255,80,80,0.8)':'rgba(0,200,255,0.6)';ctx.fill();
  // Antenna
  ctx.beginPath();ctx.arc(cx,cy-20,6,0,Math.PI*2);ctx.fillStyle=deployed?'rgba(255,80,80,0.9)':'rgba(0,200,255,0.7)';ctx.fill();
  // Coverage rings
  const pwr=parseInt($('txPower')?.value||20);
  const maxR=pwr*6;
  for(let i=1;i<=3;i++){
    ctx.beginPath();ctx.arc(cx,cy,maxR*i/3,0,Math.PI*2);
    ctx.strokeStyle=deployed?'rgba(255,80,80,'+(0.3-i*0.08)+')':'rgba(0,200,255,'+(0.15-i*0.04)+')';
    ctx.lineWidth=1;ctx.stroke();
  }
  if(deployed){
    ctx.beginPath();ctx.arc(cx,cy,maxR*(0.8+Math.sin(time*3)*0.1),0,Math.PI*2);
    ctx.strokeStyle='rgba(255,80,80,0.15)';ctx.lineWidth=2;ctx.stroke();
  }
  // Devices
  devices.forEach((d,i)=>{
    d.x+=d.vx*0.3;d.y+=d.vy*0.2;
    if(d.x<20||d.x>W-20)d.vx*=-1;if(d.y<20||d.y>H-20)d.vy*=-1;
    const dist=Math.sqrt((d.x-cx)**2+(d.y-cy)**2);
    d.connected=deployed&&dist<maxR;
    ctx.beginPath();ctx.arc(d.x,d.y,4,0,Math.PI*2);
    ctx.fillStyle=d.connected?'rgba(255,100,100,0.8)':'rgba(100,200,255,0.5)';ctx.fill();
    if(d.connected){
      ctx.beginPath();ctx.moveTo(d.x,d.y);ctx.lineTo(cx,cy);ctx.strokeStyle='rgba(255,80,80,0.15)';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
      ctx.beginPath();ctx.arc(d.x,d.y,8+Math.sin(time*4+i)*3,0,Math.PI*2);ctx.strokeStyle='rgba(255,80,80,0.3)';ctx.stroke();
    }
    ctx.fillStyle=d.connected?'#ff8888':'#88bbff';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(d.type,d.x,d.y-8);
  });
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='11px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('CELL COVERAGE MAP — FAKE BTS',8,16);
  if(deployed){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('BTS DEPLOYED — CAPTURING',8,32);}
}

function drawSpecView(){
  const c=$('specCanvas');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const bands={gsm900:900,gsm1800:1800,lte700:700,lte2100:2100};
  const freq=bands[$('band')?.value||'gsm900']||900;
  ctx.beginPath();
  for(let x=0;x<W;x++){const f=x/W*3000;let y=H*0.85;const diff=Math.abs(f-freq);
    if(diff<50)y=deployed?H*0.1:H*0.3;else if(diff<100)y=H*0.5;
    y+=Math.random()*3;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.strokeStyle=deployed?'rgba(255,80,80,0.7)':'rgba(0,200,255,0.5)';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='10px Orbitron,monospace';ctx.fillText('CELLULAR SPECTRUM — 0-3 GHz | '+$('band')?.value,5,14);
}

function animate(){time+=0.016;drawCellView();drawSpecView();updateInfo();requestAnimationFrame(animate);}
function updateInfo(){const s=$('infoStats');if(!s)return;const caught=devices.filter(d=>d.connected).length;s.innerHTML='<b>Band:</b> '+($('band')?.value||'gsm900')+'<br><b>Power:</b> '+($('txPower')?.value||20)+' dBm<br><b>Devices:</b> '+devices.length+' in range<br><b>Captured:</b> <span style="color:'+(caught?'#ff4444':'#00cc88')+'">'+caught+'</span><br><b>MCC/MNC:</b> '+($('mcc')?.value||603)+'/'+($('mnc')?.value||'02');}

function updateDevList(){const lib=$('libraryList');if(!lib)return;lib.innerHTML='';devices.filter(d=>d.connected).forEach(d=>{const r=document.createElement('div');r.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.75rem;background:rgba(255,50,50,0.08)';r.innerHTML='<span style="color:#ff8888">'+d.imsi.slice(0,8)+'...</span><span>'+d.type+'</span><span>RSSI: '+d.rssi.toFixed(0)+'</span><span style="color:#ff4444">CAUGHT</span>';lib.appendChild(r);});}

function initControls(){
  $('txPower').oninput=()=>{$('txPowerLabel').textContent=$('txPower').value+' dBm';};
  $('startBtn').onclick=()=>{deployed=!deployed;setStatus(deployed);$('startBtn').querySelector('span:last-child').textContent=deployed?'Shutdown BTS':'Deploy BTS';log(deployed?'FAKE BTS DEPLOYED on '+$('band').value+' — MCC:'+$('mcc').value+' MNC:'+$('mnc').value:'BTS shutdown',deployed?'tx':'info');};
  $('analyzeBtn').onclick=()=>{showToast('Scanning cellular devices...',1500);setTimeout(()=>{log('Scan: '+devices.length+' devices, '+devices.filter(d=>d.connected).length+' captured','success');hideToast();},1500);};
  $('resetBtn').onclick=()=>{deployed=false;setStatus(false);initDevices();log('Simulation reset','info');};
}
function initRefDB(){const db=$('refDatabase');if(!db)return;db.innerHTML=['<b>Stingray/IMSI Catcher:</b> Fake base station forcing phones to connect.','<b>Downgrade Attack:</b> Force 4G/5G devices to fall back to 2G (no encryption).','<b>Identity Capture:</b> Collect IMSI, IMEI, and TMSI identifiers.','<b>Man-in-the-Middle:</b> Intercept calls and SMS in real-time.','<b>Location Tracking:</b> Triangulate device positions via signal strength.','<b>Silent SMS:</b> Send invisible pings to confirm device presence.'].join('<br><br>');}

document.addEventListener('DOMContentLoaded',()=>{initSplash();initPanels();initLogFilters();initDevices();initRefDB();initControls();try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}log(LANG[currentLang].ready,'success');animate();setInterval(updateDevList,1000);});
