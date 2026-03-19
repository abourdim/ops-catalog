/**
 * Sonic Infrasound Detector — Workshop DIY v1.0
 * Monitor sub-20Hz infrasonic waves from seismic/volcanic/nuclear events
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];let currentLang='en',soundEnabled=false;
const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx,analyser,micStream,dataArray,freqArray;
let isMonitoring=false,animId=null,eventCount=0,maxAmp=0,history=[];
const LANG={
  en:{title:'Infrasound Detector',subtitle:'Detect Earthquakes / Nukes / Volcanoes',disconnected:'Idle',connected:'Monitoring',mainSection:'Infrasound Detector',mainDesc:'Monitor sub-20Hz infrasonic waves',sectionA:'Detection Events',sectionB:'Infrasound Science',startMon:'Start Monitor',stop:'Stop',eventType:'Event Type',amplitude:'Amplitude',stats:'Stats',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',filterAll:'All',soundEffects:'Sound effects',ready:'Infrasound Detector ready!',splashHint:'tap to skip',langChanged:'Language > English',themeChanged:'Theme >',started:'Monitoring started',stopped:'Monitoring stopped',quiet:'QUIET',seismic:'SEISMIC',volcanic:'VOLCANIC',nuclear:'NUCLEAR SIGNATURE',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Detecteur Infrason',subtitle:'Detecter Seismes / Nucleaire / Volcans',disconnected:'Inactif',connected:'Surveillance',mainSection:'Detecteur Infrason',mainDesc:'Surveiller les ondes infrasoniques sub-20Hz',sectionA:'Evenements Detectes',sectionB:'Science Infrasonique',startMon:'Demarrer',stop:'Arreter',eventType:'Type',amplitude:'Amplitude',stats:'Stats',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',filterAll:'Tout',soundEffects:'Effets sonores',ready:'Detecteur infrason pret!',splashHint:'appuyer pour passer',langChanged:'Langue > Francais',themeChanged:'Theme >',started:'Surveillance demarree',stopped:'Surveillance arretee',quiet:'CALME',seismic:'SISMIQUE',volcanic:'VOLCANIQUE',nuclear:'SIGNATURE NUCLEAIRE',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'كاشف الموجات دون الصوتية',subtitle:'كشف الزلازل / النووي / البراكين',disconnected:'خامل',connected:'مراقبة',mainSection:'كاشف الموجات دون الصوتية',mainDesc:'مراقبة الموجات تحت 20 هرتز',sectionA:'أحداث مكتشفة',sectionB:'علم الموجات دون الصوتية',startMon:'بدء المراقبة',stop:'إيقاف',eventType:'نوع الحدث',amplitude:'السعة',stats:'إحصائيات',activityLog:'سجل النشاط',eventsMsg:'أحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',settings:'الإعدادات',language:'اللغة',help:'مساعدة',faq:'أسئلة',howto:'كيف',wiki:'ويكي',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'كاشف الموجات جاهز!',splashHint:'انقر للتخطي',langChanged:'اللغة > العربية',themeChanged:'المظهر >',started:'بدأت المراقبة',stopped:'توقفت المراقبة',quiet:'هادئ',seismic:'زلزالي',volcanic:'بركاني',nuclear:'توقيع نووي',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}
};
function T(k){return(LANG[currentLang]||LANG.en)[k]||LANG.en[k]||k;}
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(T('themeChanged')+' '+n,'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log('Cleared');}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log('Copied!','success');}catch{log('Copy failed','error');}}
function showToast(m,ms=0){const e=$('toastIndicator'),t=$('toastMessage');if(e&&t){t.textContent=m;e.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const e=$('toastIndicator');if(e)e.style.display='none';}
function setStatus(on){const p=$('statusPill'),t=$('statusText');if(t)t.textContent=on?T('connected'):T('disconnected');if(p)p.classList.toggle('connected',on);}
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');setTimeout(()=>s.remove(),600);}
let activeLogFilter='all';
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

const canvas=$('infraCanvas'),ctx=canvas?canvas.getContext('2d'):null;

function drawInfrasound(){
  if(!ctx||!freqArray)return;
  analyser.getByteFrequencyData(freqArray);analyser.getByteTimeDomainData(dataArray);
  // Low freq emphasis — first 50 bins cover 0-~500Hz with 44100/8192
  const binHz=audioCtx.sampleRate/analyser.fftSize;
  const lowBins=Math.min(100,Math.floor(20/binHz));
  let amp=0;for(let i=0;i<lowBins;i++)amp+=freqArray[i];amp/=lowBins;
  history.push(amp);if(history.length>canvas.width)history.shift();
  if(amp>maxAmp)maxAmp=amp;
  // Classify
  let evtType=T('quiet'),color='#22c55e';
  if(amp>150){evtType=T('nuclear');color='#ef4444';if(eventCount===0||history.length%60===0){addDetection('NUCLEAR',amp);eventCount++;}}
  else if(amp>100){evtType=T('volcanic');color='#f59e0b';if(eventCount===0||history.length%90===0){addDetection('VOLCANIC',amp);eventCount++;}}
  else if(amp>60){evtType=T('seismic');color='#3b82f6';if(eventCount===0||history.length%120===0){addDetection('SEISMIC',amp);eventCount++;}}
  $('eventType').textContent=evtType;$('eventType').style.color=color;
  $('ampValue').textContent=amp.toFixed(1)+' dB';
  $('statsInfo').innerHTML='Events: '+eventCount+'<br>Max: '+maxAmp.toFixed(1)+' dB<br>Filter: '+$('filterSelect').value+'<br>Bins: '+lowBins;
  // Draw
  ctx.fillStyle='rgba(10,10,26,0.06)';ctx.fillRect(0,0,canvas.width,canvas.height);
  // Grid
  ctx.strokeStyle='rgba(0,255,170,0.1)';ctx.lineWidth=1;
  for(let y=0;y<canvas.height;y+=50){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
  // Seismograph trace
  ctx.lineWidth=2;ctx.strokeStyle=color;ctx.beginPath();
  for(let i=0;i<history.length;i++){
    const y=canvas.height-history[i]/255*canvas.height;
    i===0?ctx.moveTo(i,y):ctx.lineTo(i,y);
  }
  ctx.stroke();
  // Waveform overlay (thin)
  ctx.lineWidth=1;ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.beginPath();
  const sw=canvas.width/dataArray.length;let x=0;
  for(let i=0;i<dataArray.length;i++){const y=dataArray[i]/128*canvas.height/2;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);x+=sw;}
  ctx.stroke();
  // Labels
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='10px Orbitron';ctx.textAlign='left';
  ctx.fillText('INFRASOUND SEISMOGRAPH',10,15);ctx.fillText('0-20 Hz',10,canvas.height-5);
}
function drawIdle(){if(!ctx)return;ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='rgba(0,255,170,0.15)';ctx.font='13px Orbitron';ctx.textAlign='center';ctx.fillText('INFRASOUND MONITOR — Click Start',canvas.width/2,canvas.height/2);ctx.textAlign='left';}
function animate(){drawInfrasound();animId=requestAnimationFrame(animate);}
function addDetection(type,amp){
  const el=$('detectionLog');if(!el)return;const d=document.createElement('div');
  const colors={SEISMIC:'#3b82f6',VOLCANIC:'#f59e0b',NUCLEAR:'#ef4444'};
  d.style.cssText='padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;background:rgba(0,0,0,.2);color:'+colors[type]+';border-left:3px solid '+colors[type]+';';
  d.textContent='['+new Date().toLocaleTimeString()+'] '+type+' event: '+amp.toFixed(1)+' dB';
  el.appendChild(d);el.scrollTop=el.scrollHeight;log(type+' event detected at '+amp.toFixed(1)+' dB','rx');
}
async function startMonitor(){
  if(!audioCtx)audioCtx=new AudioCtx();if(audioCtx.state==='suspended')await audioCtx.resume();
  try{micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
    const src=audioCtx.createMediaStreamSource(micStream);analyser=audioCtx.createAnalyser();analyser.fftSize=8192;analyser.smoothingTimeConstant=0.9;
    src.connect(analyser);dataArray=new Uint8Array(analyser.fftSize);freqArray=new Uint8Array(analyser.frequencyBinCount);
    isMonitoring=true;setStatus(true);history=[];eventCount=0;maxAmp=0;animate();log(T('started'),'success');
  }catch(e){log('Mic denied: '+e.message,'error');}
}
function stopMonitor(){isMonitoring=false;setStatus(false);if(micStream){micStream.getTracks().forEach(t=>t.stop());micStream=null;}if(animId){cancelAnimationFrame(animId);animId=null;}log(T('stopped'),'info');drawIdle();}
function fillScience(){const el=$('scienceInfo');if(!el)return;el.innerHTML='<b>Infrasound (< 20 Hz)</b><br>Sound below human hearing threshold. Sources:<br>- Earthquakes: 0.01-1 Hz<br>- Volcanic eruptions: 0.5-5 Hz<br>- Nuclear explosions: 0.1-10 Hz<br>- Severe weather: 1-10 Hz<br>- Ocean waves: 0.05-0.5 Hz<br><br><b>Detection Methods:</b><br>- Microbarometers (pressure sensors)<br>- Infrasound arrays (CTBTO network)<br>- Accelerometers<br><br><b>CTBTO:</b> 60+ infrasound stations worldwide monitor for nuclear tests under the Comprehensive Nuclear-Test-Ban Treaty.';}

document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(dismissSplash,2500);
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);else setLanguage('en');}catch{setLanguage('en');}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  $('helpBtn').onclick=()=>{$('helpPanel').classList.toggle('open');$('helpOverlay').classList.toggle('active');};
  $('helpCloseBtn').onclick=$('helpOverlay').onclick=()=>{$('helpPanel').classList.remove('open');$('helpOverlay').classList.remove('active');};
  $('settingsBtn').onclick=()=>{$('settingsPanel').classList.toggle('open');$('settingsOverlay').classList.toggle('active');};
  $('settingsCloseBtn').onclick=$('settingsOverlay').onclick=()=>{$('settingsPanel').classList.remove('open');$('settingsOverlay').classList.remove('active');};
  $('logBtn').onclick=()=>$('logPanel').classList.toggle('open');$('logCloseBtn').onclick=()=>$('logPanel').classList.remove('open');
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);
  $('soundToggle').onchange=e=>{soundEnabled=e.target.checked;};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active');};});
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();};});
  $('startBtn').onclick=startMonitor;$('stopBtn').onclick=stopMonitor;
  drawIdle();fillScience();log(T('ready'),'success');
});
