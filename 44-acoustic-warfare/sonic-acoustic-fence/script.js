/**
 * Sonic Acoustic Fence — Workshop DIY v1.0
 * Ultrasonic Doppler perimeter detector
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];let currentLang='en',soundEnabled=false;
const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx,analyser,micStream,freqArray,osc,gainNode;
let isArmed=false,animId=null,alertLevel=0,peakShift=0,intrusionCount=0;

const LANG={
  en:{title:'Acoustic Fence',subtitle:'Ultrasonic Doppler Perimeter Detector',disconnected:'Idle',connected:'Armed',mainSection:'Acoustic Fence',mainDesc:'Emit ultrasonic tone, detect Doppler shifts from movement',sectionA:'Intrusion Events',sectionB:'Doppler Theory',arm:'Arm Fence',disarm:'Disarm',alertLevel:'Alert Level',dopplerShift:'Doppler Shift',fenceStatus:'Fence Status',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',filterAll:'All',soundEffects:'Sound effects',ready:'Acoustic Fence ready!',splashHint:'tap to skip',langChanged:'Language > English',themeChanged:'Theme >',armed:'Fence ARMED',disarmed:'Fence disarmed',intrusion:'INTRUSION DETECTED!',approaching:'APPROACHING',retreating:'RETREATING',secure:'SECURE',eventHint:'Motion events appear here.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Cloture Acoustique',subtitle:'Detecteur Doppler Perimetrique',disconnected:'Inactif',connected:'Arme',mainSection:'Cloture Acoustique',mainDesc:'Emettre un ultrason, detecter les mouvements par effet Doppler',sectionA:'Evenements Intrusion',sectionB:'Theorie Doppler',arm:'Armer',disarm:'Desarmer',alertLevel:'Niveau Alerte',dopplerShift:'Decalage Doppler',fenceStatus:'Etat Cloture',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',filterAll:'Tout',soundEffects:'Effets sonores',ready:'Cloture acoustique prete!',splashHint:'appuyer pour passer',langChanged:'Langue > Francais',themeChanged:'Theme >',armed:'Cloture ARMEE',disarmed:'Cloture desarmee',intrusion:'INTRUSION DETECTEE!',approaching:'APPROCHE',retreating:'ELOIGNEMENT',secure:'SECURISE',eventHint:'Evenements de mouvement ici.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'السياج الصوتي',subtitle:'كاشف دوبلر المحيطي',disconnected:'خامل',connected:'مسلح',mainSection:'السياج الصوتي',mainDesc:'إصدار نغمة فوق صوتية وكشف الحركة بتأثير دوبلر',sectionA:'أحداث التسلل',sectionB:'نظرية دوبلر',arm:'تسليح',disarm:'إلغاء التسليح',alertLevel:'مستوى التنبيه',dopplerShift:'إزاحة دوبلر',fenceStatus:'حالة السياج',activityLog:'سجل النشاط',eventsMsg:'أحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',settings:'الإعدادات',language:'اللغة',help:'مساعدة',faq:'أسئلة',howto:'كيف',wiki:'ويكي',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'السياج الصوتي جاهز!',splashHint:'انقر للتخطي',langChanged:'اللغة > العربية',themeChanged:'المظهر >',armed:'السياج مسلح',disarmed:'السياج معطل',intrusion:'تسلل مكتشف!',approaching:'اقتراب',retreating:'ابتعاد',secure:'آمن',eventHint:'أحداث الحركة تظهر هنا.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}
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

/* ═══════ DOPPLER CANVAS ═══════ */
const canvas=$('dopplerCanvas'),ctx=canvas?canvas.getContext('2d'):null;
let dopplerHistory=[];

function drawDoppler(){
  if(!ctx||!freqArray)return;
  analyser.getByteFrequencyData(freqArray);
  const toneFreq=parseInt($('toneSelect').value);
  const binHz=audioCtx.sampleRate/analyser.fftSize;
  const toneBin=Math.round(toneFreq/binHz);
  const searchRange=30;
  let maxVal=0,maxBin=toneBin;
  for(let i=Math.max(0,toneBin-searchRange);i<Math.min(freqArray.length,toneBin+searchRange);i++){
    if(freqArray[i]>maxVal){maxVal=freqArray[i];maxBin=i;}
  }
  const shift=(maxBin-toneBin)*binHz;
  const sensitivity=parseInt($('sensitivityRange').value);
  const threshold=15-sensitivity;
  dopplerHistory.push({shift,level:maxVal,time:Date.now()});
  if(dopplerHistory.length>canvas.width)dopplerHistory.shift();

  // Detect intrusion
  if(Math.abs(shift)>threshold&&maxVal>50){
    alertLevel=Math.min(100,alertLevel+5);
    if(alertLevel>60){
      $('alertText').textContent=T('intrusion');$('alertText').style.color='#ef4444';
      $('alertFill').style.background='#ef4444';
      if(alertLevel===65){intrusionCount++;addEvent(shift);log(T('intrusion'),'error');}
    }else{
      $('alertText').textContent=shift>0?T('approaching'):T('retreating');$('alertText').style.color='#f59e0b';$('alertFill').style.background='#f59e0b';
    }
  }else{alertLevel=Math.max(0,alertLevel-2);if(alertLevel<10){$('alertText').textContent=T('secure');$('alertText').style.color='#22c55e';$('alertFill').style.background='#22c55e';}}
  $('alertFill').style.width=alertLevel+'%';
  $('shiftValue').textContent=shift.toFixed(1)+' Hz';
  $('direction').textContent=Math.abs(shift)<threshold?'---':shift>0?'>>> APPROACHING':'<<< RETREATING';
  $('fenceInfo').innerHTML='Armed: '+toneFreq/1000+' kHz<br>Sensitivity: '+sensitivity+'/10<br>Intrusions: '+intrusionCount;

  // Draw
  ctx.fillStyle='rgba(10,10,26,0.08)';ctx.fillRect(0,0,canvas.width,canvas.height);
  // Center line
  ctx.strokeStyle='rgba(0,255,170,0.2)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,canvas.height/2);ctx.lineTo(canvas.width,canvas.height/2);ctx.stroke();ctx.setLineDash([]);
  // Doppler trace
  ctx.lineWidth=2;ctx.strokeStyle=alertLevel>60?'#ef4444':alertLevel>20?'#f59e0b':'#22c55e';ctx.beginPath();
  for(let i=0;i<dopplerHistory.length;i++){
    const y=canvas.height/2-dopplerHistory[i].shift*2;
    i===0?ctx.moveTo(i,y):ctx.lineTo(i,y);
  }
  ctx.stroke();
  // Level bars at right
  ctx.fillStyle='rgba(0,255,170,0.3)';
  for(let i=toneBin-searchRange;i<toneBin+searchRange;i++){
    const x=canvas.width-60+(i-(toneBin-searchRange));
    const h=freqArray[i]/255*canvas.height;
    ctx.fillRect(x,canvas.height-h,1,h);
  }
  // Labels
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='10px Orbitron';ctx.fillText('DOPPLER SHIFT',10,15);
  ctx.fillText('+Hz',canvas.width-75,15);ctx.fillText('-Hz',canvas.width-75,canvas.height-5);
}

function drawIdle(){
  if(!ctx)return;ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='rgba(0,255,170,0.15)';ctx.font='13px Orbitron';ctx.textAlign='center';
  ctx.fillText('DOPPLER RADAR — Arm Fence to Start',canvas.width/2,canvas.height/2);ctx.textAlign='left';
}

function animate(){drawDoppler();animId=requestAnimationFrame(animate);}

function addEvent(shift){
  const el=$('eventLog');if(!el)return;const d=document.createElement('div');
  d.style.cssText='padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;background:rgba(239,68,68,.1);color:#ef4444;border-left:3px solid #ef4444;';
  d.textContent='['+new Date().toLocaleTimeString()+'] INTRUSION: Doppler shift '+shift.toFixed(1)+' Hz';
  el.appendChild(d);el.scrollTop=el.scrollHeight;
}

/* ═══════ ARM/DISARM ═══════ */
async function armFence(){
  if(!audioCtx)audioCtx=new AudioCtx();if(audioCtx.state==='suspended')await audioCtx.resume();
  try{
    micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
    const src=audioCtx.createMediaStreamSource(micStream);analyser=audioCtx.createAnalyser();analyser.fftSize=4096;
    src.connect(analyser);freqArray=new Uint8Array(analyser.frequencyBinCount);
    // Emit tone
    osc=audioCtx.createOscillator();gainNode=audioCtx.createGain();
    osc.connect(gainNode);gainNode.connect(audioCtx.destination);
    osc.frequency.value=parseInt($('toneSelect').value);osc.type='sine';gainNode.gain.value=0.3;osc.start();
    isArmed=true;setStatus(true);dopplerHistory=[];alertLevel=0;intrusionCount=0;
    animate();log(T('armed'),'success');
  }catch(e){log('Mic denied: '+e.message,'error');}
}
function disarmFence(){
  isArmed=false;setStatus(false);
  if(osc){try{osc.stop();}catch{}osc=null;}
  if(micStream){micStream.getTracks().forEach(t=>t.stop());micStream=null;}
  if(animId){cancelAnimationFrame(animId);animId=null;}
  alertLevel=0;$('alertFill').style.width='0%';$('alertText').textContent=T('secure');$('alertText').style.color='#22c55e';
  log(T('disarmed'),'info');drawIdle();
}

function fillTheory(){const el=$('theoryInfo');if(!el)return;el.innerHTML='<b>Doppler Effect</b><br>When a sound source and observer move relative to each other, the observed frequency changes.<br><br><b>f_observed = f_source * (v + v_observer) / (v + v_source)</b><br><br>For our perimeter detector:<br>- We emit a constant ultrasonic tone<br>- The microphone picks up reflections<br>- Moving objects cause frequency shift in reflections<br>- Positive shift = object approaching<br>- Negative shift = object retreating<br><br><b>Applications:</b> Perimeter security, motion detection, speed measurement, medical ultrasound.';}

/* ═══════ INIT ═══════ */
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
  $('armBtn').onclick=armFence;$('disarmBtn').onclick=disarmFence;
  drawIdle();fillTheory();log(T('ready'),'success');
});
