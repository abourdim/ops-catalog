/**
 * Sonic Sonar Mapper — Workshop DIY v1.0
 * Echolocation room mapping with PPI radar display
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];let currentLang='en',soundEnabled=false;
const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx,analyser,micStream,dataArray,freqArray;
let animId=null,sweepAngle=0,pingCount=0,autoMode=false,points=[];
const LANG={
  en:{title:'Sonar Mapper',subtitle:'Echolocation Room Mapping',disconnected:'Idle',connected:'Scanning',ready:'Sonar Mapper ready!',langChanged:'Language > English',themeChanged:'Theme >',splashHint:'tap to skip',ping:'Ping sent',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Cartographe Sonar',subtitle:'Cartographie par Echolocalisation',disconnected:'Inactif',connected:'Balayage',ready:'Cartographe Sonar pret!',langChanged:'Langue > Francais',themeChanged:'Theme >',splashHint:'appuyer pour passer',ping:'Ping envoye',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'مسح السونار',subtitle:'رسم خرائط بالصدى',disconnected:'خامل',connected:'مسح',ready:'مسح السونار جاهز!',langChanged:'اللغة > العربية',themeChanged:'المظهر >',splashHint:'انقر للتخطي',ping:'تم إرسال النبضة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}
};
function T(k){return(LANG[currentLang]||LANG.en)[k]||LANG.en[k]||k;}
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=(s.title||'Sonar')+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged||'','info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(T('themeChanged')+' '+n,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log('Cleared');}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log('Copied!','success');}catch{log('Copy failed','error');}}
function setStatus(on){const p=$('statusPill'),t=$('statusText');if(t)t.textContent=on?T('connected'):T('disconnected');if(p)p.classList.toggle('connected',on);}
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');setTimeout(()=>s.remove(),600);}
let activeLogFilter='all';function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

const canvas=$('sonarCanvas'),ctx=canvas?canvas.getContext('2d'):null;
const cx=canvas?canvas.width/2:0,cy=canvas?canvas.height/2:0,maxR=Math.min(cx,cy)-20;

function drawSonar(){
  if(!ctx)return;
  ctx.fillStyle='rgba(10,10,26,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);
  // PPI circles
  ctx.strokeStyle='rgba(0,255,170,0.15)';ctx.lineWidth=1;
  for(let r=1;r<=4;r++){ctx.beginPath();ctx.arc(cx,cy,maxR*r/4,0,Math.PI*2);ctx.stroke();}
  // Cross
  ctx.beginPath();ctx.moveTo(cx-maxR,cy);ctx.lineTo(cx+maxR,cy);ctx.moveTo(cx,cy-maxR);ctx.lineTo(cx,cy+maxR);ctx.stroke();
  // Sweep line
  sweepAngle+=0.02;if(sweepAngle>Math.PI*2)sweepAngle-=Math.PI*2;
  const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,maxR);
  grad.addColorStop(0,'rgba(0,255,100,0.3)');grad.addColorStop(1,'rgba(0,255,100,0)');
  ctx.save();ctx.translate(cx,cy);ctx.rotate(sweepAngle);
  ctx.fillStyle=grad;ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,maxR,-0.15,0.15);ctx.fill();
  ctx.restore();
  // Sweep line
  ctx.strokeStyle='rgba(0,255,100,0.8)';ctx.lineWidth=2;ctx.beginPath();
  ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(sweepAngle)*maxR,cy+Math.sin(sweepAngle)*maxR);ctx.stroke();
  // Draw echo points with fade
  const now=Date.now();
  points=points.filter(p=>now-p.time<5000);
  points.forEach(p=>{
    const age=(now-p.time)/5000;const alpha=1-age;
    ctx.fillStyle=`rgba(0,255,100,${alpha})`;ctx.beginPath();
    ctx.arc(cx+p.x,cy+p.y,3+alpha*3,0,Math.PI*2);ctx.fill();
  });
  // Labels
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='10px Orbitron';ctx.textAlign='center';
  ctx.fillText('N',cx,cy-maxR-5);ctx.fillText('S',cx,cy+maxR+12);ctx.fillText('E',cx+maxR+10,cy+4);ctx.fillText('W',cx-maxR-10,cy+4);
  ctx.textAlign='left';ctx.fillText('SONAR PPI',10,15);
  // Range labels
  for(let r=1;r<=4;r++){ctx.fillText((r*2.5).toFixed(1)+'m',cx+maxR*r/4-15,cy-3);}
  if(freqArray&&analyser){analyser.getByteFrequencyData(freqArray);}
  animId=requestAnimationFrame(drawSonar);
}

async function sendPing(){
  if(!audioCtx)audioCtx=new AudioCtx();if(audioCtx.state==='suspended')await audioCtx.resume();
  if(!analyser){
    try{micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false}});
    const src=audioCtx.createMediaStreamSource(micStream);analyser=audioCtx.createAnalyser();analyser.fftSize=4096;
    src.connect(analyser);freqArray=new Uint8Array(analyser.frequencyBinCount);dataArray=new Uint8Array(analyser.fftSize);
    setStatus(true);if(!animId)drawSonar();}catch(e){log('Mic denied','error');return;}
  }
  const freq=parseInt($('pingFreqSelect').value);
  const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
  osc.connect(gain);gain.connect(audioCtx.destination);osc.frequency.value=freq;osc.type='sine';
  gain.gain.setValueAtTime(0.4,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.05);
  osc.start();osc.stop(audioCtx.currentTime+0.05);
  pingCount++;
  // Simulate echo detection after random delay
  const delay=20+Math.random()*80;
  setTimeout(()=>{
    const dist=delay*0.343/2;const angle=sweepAngle+Math.random()*0.5-0.25;
    const r=(dist/10)*maxR;
    points.push({x:Math.cos(angle)*r,y:Math.sin(angle)*r,time:Date.now(),dist});
    $('echoDelay').textContent=delay.toFixed(1)+' ms';$('distValue').textContent=dist.toFixed(2)+' m';
    addEchoLog(delay,dist);
  },delay);
  log(T('ping'),'tx');$('mapStats').innerHTML='Pings: '+pingCount+'<br>Points: '+points.length+'<br>Freq: '+freq+' Hz';
}

function addEchoLog(delay,dist){const el=$('echoLog');if(!el)return;const d=document.createElement('div');d.style.cssText='padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;background:rgba(0,255,100,.1);color:#00ff64;border-left:3px solid #00ff64;';d.textContent='['+new Date().toLocaleTimeString()+'] Echo: '+delay.toFixed(1)+'ms = '+dist.toFixed(2)+'m';el.appendChild(d);el.scrollTop=el.scrollHeight;}
function fillSonarInfo(){const el=$('sonarInfo');if(!el)return;el.innerHTML='<b>Acoustic Echolocation</b><br>Distance = (speed of sound * echo delay) / 2<br>Speed of sound: ~343 m/s at 20C<br><br><b>PPI Display:</b> Plan Position Indicator shows targets as dots at bearing and range from center.<br><br><b>Frequency choice:</b><br>- Low (1-2 kHz): Better wall reflection, less directional<br>- High (4-8 kHz): More directional, better resolution<br><br><b>Applications:</b> Room mapping, obstacle detection, underwater sonar, bat navigation.';}

let autoInterval;
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
  $('pingBtn').onclick=sendPing;
  $('autoBtn').onclick=()=>{if(autoMode){clearInterval(autoInterval);autoMode=false;$('autoBtn').innerHTML='&#x1F504; Auto Scan';log('Auto scan stopped','info');}else{autoMode=true;autoInterval=setInterval(sendPing,1500);$('autoBtn').innerHTML='&#x23F9; Stop Auto';log('Auto scan started','success');}};
  $('clearMapBtn').onclick=()=>{points=[];pingCount=0;log('Map cleared','info');};
  // Draw idle sonar
  if(ctx){ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);drawSonar();}
  fillSonarInfo();log(T('ready'),'success');
});
