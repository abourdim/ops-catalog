/**
 * Sonic Acoustic Levitator — Workshop DIY v1.0
 * ESP32 ultrasonic levitation array controller with standing wave visualization
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];let currentLang='en',soundEnabled=false;
let isLevitating=false,animId=null,phase=180,power=80,freq=40000,time=0,particleY=0,connected=false;
const LANG={en:{title:'Acoustic Levitator',subtitle:'ESP32 Ultrasonic Levitation',disconnected:'Disconnected',connected:'Connected',ready:'Acoustic Levitator ready!',langChanged:'Language > English',themeChanged:'Theme >',splashHint:'tap to skip',levOn:'Levitation ON',levOff:'Levitation OFF',espConnected:'ESP32 connected (sim)',espDisconnected:'ESP32 disconnected',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
fr:{title:'Levitateur Acoustique',subtitle:'Levitation Ultrasonique ESP32',disconnected:'Deconnecte',connected:'Connecte',ready:'Levitateur acoustique pret!',langChanged:'Langue > Francais',themeChanged:'Theme >',splashHint:'appuyer pour passer',levOn:'Levitation ON',levOff:'Levitation OFF',espConnected:'ESP32 connecte (sim)',espDisconnected:'ESP32 deconnecte',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
ar:{title:'الرافعة الصوتية',subtitle:'رفع بالموجات فوق الصوتية ESP32',disconnected:'غير متصل',connected:'متصل',ready:'الرافعة الصوتية جاهزة!',langChanged:'اللغة > العربية',themeChanged:'المظهر >',splashHint:'انقر للتخطي',levOn:'الرفع مفعل',levOff:'الرفع معطل',espConnected:'ESP32 متصل (محاكاة)',espDisconnected:'ESP32 غير متصل',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};
function T(k){return(LANG[currentLang]||LANG.en)[k]||LANG.en[k]||k;}
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=(s.title||'')+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(T('themeChanged')+' '+n,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log('Cleared');}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log('Copied!','success');}catch{log('Copy failed','error');}}
function setStatus(on){const p=$('statusPill'),t=$('statusText');if(t)t.textContent=on?T('connected'):T('disconnected');if(p)p.classList.toggle('connected',on);}
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');setTimeout(()=>s.remove(),600);}
let activeLogFilter='all';function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

const canvas=$('levCanvas'),ctx=canvas?canvas.getContext('2d'):null;
const W=canvas?canvas.width:780,H=canvas?canvas.height:350;

function drawLevitator(){
  if(!ctx)return;time+=0.03;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const cx=W/2,topY=30,botY=H-30,arrayH=botY-topY;
  // Draw transducer arrays (top and bottom)
  ctx.fillStyle='#333';ctx.fillRect(cx-150,topY-10,300,15);ctx.fillRect(cx-150,botY-5,300,15);
  // Transducer dots
  for(let i=0;i<10;i++){const x=cx-135+i*30;
    ctx.fillStyle=isLevitating?`hsl(${120+i*10},80%,50%)`:'#555';
    ctx.beginPath();ctx.arc(x,topY,5,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(x,botY,5,0,Math.PI*2);ctx.fill();}
  if(isLevitating){
    // Standing wave
    const wavelength=343000/freq;const nodes=Math.floor(arrayH/(wavelength*50));
    const phaseRad=phase*Math.PI/180;
    for(let y=topY;y<botY;y++){
      const normY=(y-topY)/arrayH;
      const pressure=Math.abs(Math.sin(normY*Math.PI*nodes+phaseRad))*Math.cos(time*3);
      const w=pressure*100*(power/100);
      const hue=120-pressure*120;
      ctx.fillStyle=`hsla(${hue},80%,50%,${pressure*0.4})`;
      ctx.fillRect(cx-w,y,w*2,1);
    }
    // Pressure node markers
    const nodePositions=[];
    for(let n=0;n<nodes;n++){
      const ny=topY+arrayH*(n+0.5)/nodes;nodePositions.push(ny);
      ctx.strokeStyle='rgba(0,255,100,0.3)';ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(cx-120,ny);ctx.lineTo(cx+120,ny);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='rgba(0,255,100,0.5)';ctx.font='9px Orbitron';ctx.fillText('NODE '+(n+1),cx+125,ny+3);
    }
    // Levitating particle
    if(nodePositions.length>0){
      const targetY=nodePositions[Math.floor(nodePositions.length/2)];
      particleY+=(targetY-particleY)*0.05;
      const wobble=Math.sin(time*5)*2;
      ctx.fillStyle='#ffffff';ctx.shadowColor='#00ff88';ctx.shadowBlur=15;
      ctx.beginPath();ctx.arc(cx+wobble,particleY+Math.sin(time*2)*3,6,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
    }
    // Wave propagation lines
    ctx.strokeStyle='rgba(0,200,255,0.15)';ctx.lineWidth=1;
    for(let w=0;w<3;w++){const r=(time*50+w*40)%150;ctx.beginPath();ctx.arc(cx,topY,r,0,Math.PI);ctx.stroke();ctx.beginPath();ctx.arc(cx,botY,r,Math.PI,Math.PI*2);ctx.stroke();}
  }
  // Labels
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='10px Orbitron';ctx.fillText('ACOUSTIC LEVITATION ARRAY',10,15);
  ctx.fillText('TOP ARRAY',cx-30,topY-15);ctx.fillText('BOTTOM ARRAY',cx-40,botY+25);
  if(isLevitating)ctx.fillText('STANDING WAVE ACTIVE',10,H-5);
  $('arrayInfo').innerHTML='Freq: '+(freq/1000)+' kHz<br>Phase: '+phase+'°<br>Power: '+power+'%<br>Wavelength: '+(343000/freq).toFixed(2)+' mm';
  animId=requestAnimationFrame(drawLevitator);
}
function connectESP(){connected=true;setStatus(true);$('espStatus').textContent='Connected (sim)';$('espStatus').style.color='#22c55e';log(T('espConnected'),'success');}
function startLevitation(){if(!connected){log('Connect ESP32 first','error');return;}isLevitating=true;$('levStatus').textContent='ACTIVE';$('levStatus').style.color='#22c55e';log(T('levOn'),'success');fillNodes();}
function stopLevitation(){isLevitating=false;$('levStatus').textContent='OFF';$('levStatus').style.color='';log(T('levOff'),'info');}
function fillNodes(){const el=$('nodeList');if(!el)return;el.innerHTML='';const wavelength=343000/freq;const arrayH=H-60;const nodes=Math.floor(arrayH/(wavelength*50));
for(let n=0;n<nodes;n++){const d=document.createElement('div');d.style.cssText='padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;background:rgba(0,255,100,.1);color:#00ff64;border-left:3px solid #00ff64;';d.textContent='Node '+(n+1)+': position '+((n+0.5)/nodes*100).toFixed(1)+'% — stable trap point';el.appendChild(d);}}
function fillPhysics(){const el=$('physicsInfo');if(!el)return;el.innerHTML='<b>Acoustic Levitation</b><br><br>Objects can be trapped at pressure nodes of a standing wave where the acoustic radiation force balances gravity.<br><br><b>Standing Wave:</b> Created when two opposing transducer arrays emit phase-locked ultrasonic waves. Constructive/destructive interference creates fixed pressure nodes and anti-nodes.<br><br><b>Key Parameters:</b><br>- Frequency: 25-40 kHz typical<br>- Phase: Controls node position<br>- Power: Must overcome gravity<br>- Wavelength at 40kHz: ~8.6mm<br><br><b>Applications:</b> Containerless processing, pharmaceutical research, materials science, space experiments.';}

document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(dismissSplash,2500);try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);else setLanguage('en');}catch{setLanguage('en');}try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  $('helpBtn').onclick=()=>{$('helpPanel').classList.toggle('open');$('helpOverlay').classList.toggle('active');};$('helpCloseBtn').onclick=$('helpOverlay').onclick=()=>{$('helpPanel').classList.remove('open');$('helpOverlay').classList.remove('active');};$('settingsBtn').onclick=()=>{$('settingsPanel').classList.toggle('open');$('settingsOverlay').classList.toggle('active');};$('settingsCloseBtn').onclick=$('settingsOverlay').onclick=()=>{$('settingsPanel').classList.remove('open');$('settingsOverlay').classList.remove('active');};$('logBtn').onclick=()=>$('logPanel').classList.toggle('open');$('logCloseBtn').onclick=()=>$('logPanel').classList.remove('open');$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked;};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active');};});
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();};});
  $('connectBtn').onclick=connectESP;$('levitateBtn').onclick=startLevitation;$('dropBtn').onclick=stopLevitation;
  $('freqSelect').onchange=e=>{freq=parseInt(e.target.value);if(isLevitating)fillNodes();};
  $('phaseRange').oninput=e=>{phase=parseInt(e.target.value);$('phaseVal').textContent=phase+'°';};
  $('powerRange').oninput=e=>{power=parseInt(e.target.value);$('powerVal').textContent=power+'%';};
  fillPhysics();drawLevitator();log(T('ready'),'success');
});
