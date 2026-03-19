/**
 * Sonic Ultrasonic Data Link — Workshop DIY v1.0
 * Transmit data via 20kHz+ ultrasound FSK modem
 * Themes · i18n (EN/FR/AR) · RTL · Log · Canvas visualizations
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let currentLang = 'en', soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx, analyser, micStream, dataArray, freqArray, fftSize = 2048;
let isTransmitting = false, isListening = false, animId = null;

const LANG = {
  en: { title:'Ultrasonic Data Link', subtitle:'20kHz+ Acoustic Modem', disconnected:'Idle', connected:'Active',
    mainSection:'Ultrasonic Data Link', mainDesc:'Transmit text via 20kHz+ ultrasound carrier',
    sectionA:'Transmission Log', sectionB:'Protocol Reference', transmit:'Transmit', receive:'Listen',
    carrier:'Carrier:', baudRate:'Baud:', txStatus:'TX Status', rxStatus:'RX Output', signalInfo:'Signal',
    activityLog:'Activity Log', eventsMsg:'Events', clear:'Clear', copy:'Copy', theme:'Theme',
    settings:'Settings', language:'Language', help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki', filterAll:'All',
    soundEffects:'Sound effects', ready:'Ultrasonic Data Link ready!', txLogHint:'TX/RX messages appear here.',
    splashHint:'tap to skip', langChanged:'Language > English', themeChanged:'Theme >',
    txStart:'TX: Transmitting...', txDone:'TX: Complete', rxStart:'RX: Listening...', rxStop:'RX: Stopped', noMsg:'Enter a message first',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot' },
  fr: { title:'Liaison Ultrasonique', subtitle:'Modem Acoustique 20kHz+', disconnected:'Inactif', connected:'Actif',
    mainSection:'Liaison Ultrasonique', mainDesc:'Transmettre du texte via porteuse ultrasonique',
    sectionA:'Journal de Transmission', sectionB:'Reference Protocole', transmit:'Transmettre', receive:'Ecouter',
    carrier:'Porteuse:', baudRate:'Debit:', txStatus:'Etat TX', rxStatus:'Sortie RX', signalInfo:'Signal',
    activityLog:'Journal', eventsMsg:'Evenements', clear:'Effacer', copy:'Copier', theme:'Theme',
    settings:'Parametres', language:'Langue', help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki', filterAll:'Tout',
    soundEffects:'Effets sonores', ready:'Liaison ultrasonique prete!', txLogHint:'Messages TX/RX ici.',
    splashHint:'appuyer pour passer', langChanged:'Langue > Francais', themeChanged:'Theme >',
    txStart:'TX: Transmission...', txDone:'TX: Termine', rxStart:'RX: Ecoute...', rxStop:'RX: Arrete', noMsg:'Entrez un message',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot' },
  ar: { title:'رابط البيانات فوق الصوتي', subtitle:'مودم صوتي 20kHz+', disconnected:'خامل', connected:'نشط',
    mainSection:'رابط البيانات فوق الصوتي', mainDesc:'إرسال النصوص عبر حامل فوق صوتي',
    sectionA:'سجل الإرسال', sectionB:'مرجع البروتوكول', transmit:'إرسال', receive:'استماع',
    carrier:'الحامل:', baudRate:'السرعة:', txStatus:'حالة الإرسال', rxStatus:'مخرج الاستقبال', signalInfo:'الإشارة',
    activityLog:'سجل النشاط', eventsMsg:'أحداث', clear:'مسح', copy:'نسخ', theme:'المظهر',
    settings:'الإعدادات', language:'اللغة', help:'مساعدة', faq:'أسئلة', howto:'كيف', wiki:'ويكي', filterAll:'الكل',
    soundEffects:'مؤثرات صوتية', ready:'رابط البيانات جاهز!', txLogHint:'رسائل الإرسال والاستقبال هنا.',
    splashHint:'انقر للتخطي', langChanged:'اللغة > العربية', themeChanged:'المظهر >',
    txStart:'إرسال جاري...', txDone:'إرسال اكتمل', rxStart:'استقبال جاري...', rxStop:'استقبال توقف', noMsg:'أدخل رسالة أولاً',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت' }
};
function T(k){return (LANG[currentLang]||LANG.en)[k]||LANG.en[k]||k;}

/* ═══════ FRAMEWORK ═══════ */
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
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

/* ═══════ CANVAS ═══════ */
const specCanvas=$('spectrogramCanvas'),specCtx=specCanvas?specCanvas.getContext('2d'):null;
const waveCanvas=$('waveformCanvas'),waveCtx=waveCanvas?waveCanvas.getContext('2d'):null;

function drawSpectrogram(){
  if(!specCtx||!freqArray)return;analyser.getByteFrequencyData(freqArray);
  const img=specCtx.getImageData(1,0,specCanvas.width-1,specCanvas.height);specCtx.putImageData(img,0,0);
  const step=freqArray.length/specCanvas.height;
  for(let y=0;y<specCanvas.height;y++){
    const val=freqArray[Math.floor((specCanvas.height-y)*step)]||0;
    const r=val>200?255:val>100?val:0,g=val>200?val-100:val>100?255:val*2,b=val>100?0:val;
    specCtx.fillStyle=`rgb(${r},${g},${b})`;specCtx.fillRect(specCanvas.width-1,y,1,1);
  }
}
function drawWaveform(){
  if(!waveCtx||!dataArray)return;analyser.getByteTimeDomainData(dataArray);
  waveCtx.fillStyle='rgba(10,10,26,0.3)';waveCtx.fillRect(0,0,waveCanvas.width,waveCanvas.height);
  waveCtx.lineWidth=2;waveCtx.strokeStyle='#00ffaa';waveCtx.beginPath();
  const sw=waveCanvas.width/dataArray.length;let x=0;
  for(let i=0;i<dataArray.length;i++){const y=dataArray[i]/128*waveCanvas.height/2;i===0?waveCtx.moveTo(x,y):waveCtx.lineTo(x,y);x+=sw;}
  waveCtx.stroke();
}
function animate(){drawSpectrogram();drawWaveform();animId=requestAnimationFrame(animate);}
function drawIdle(){
  if(specCtx){specCtx.fillStyle='#0a0a1a';specCtx.fillRect(0,0,specCanvas.width,specCanvas.height);specCtx.fillStyle='rgba(0,255,170,0.15)';specCtx.font='13px Orbitron';specCtx.textAlign='center';specCtx.fillText('SPECTROGRAM — Start Listening or Transmit',specCanvas.width/2,specCanvas.height/2);}
  if(waveCtx){waveCtx.fillStyle='#0a0a1a';waveCtx.fillRect(0,0,waveCanvas.width,waveCanvas.height);waveCtx.strokeStyle='rgba(0,255,170,0.3)';waveCtx.lineWidth=1;waveCtx.beginPath();waveCtx.moveTo(0,waveCanvas.height/2);waveCtx.lineTo(waveCanvas.width,waveCanvas.height/2);waveCtx.stroke();}
}

/* ═══════ AUDIO ═══════ */
async function initAudio(){if(!audioCtx)audioCtx=new AudioCtx();if(audioCtx.state==='suspended')await audioCtx.resume();}
async function startListening(){
  await initAudio();try{
    micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
    const src=audioCtx.createMediaStreamSource(micStream);analyser=audioCtx.createAnalyser();analyser.fftSize=fftSize;
    src.connect(analyser);dataArray=new Uint8Array(analyser.fftSize);freqArray=new Uint8Array(analyser.frequencyBinCount);
    isListening=true;setStatus(true);animate();log(T('rxStart'),'rx');$('rxBtn').innerHTML='Stop';updateSignalInfo();
  }catch(e){log('Mic denied: '+e.message,'error');}
}
function stopListening(){isListening=false;setStatus(false);if(micStream){micStream.getTracks().forEach(t=>t.stop());micStream=null;}if(animId){cancelAnimationFrame(animId);animId=null;}log(T('rxStop'),'rx');$('rxBtn').innerHTML='📥 '+T('receive');drawIdle();}
function updateSignalInfo(){const i=$('signalInfo');if(!i)return;const c=$('carrierSelect').value,b=$('baudSelect').value;i.innerHTML='Carrier: '+(c/1000).toFixed(1)+' kHz<br>Baud: '+b+' bps<br>Mode: FSK<br>Bits/char: 8';}

async function transmitMessage(text){
  if(!text){log(T('noMsg'),'error');return;}await initAudio();
  if(!analyser){analyser=audioCtx.createAnalyser();analyser.fftSize=fftSize;dataArray=new Uint8Array(analyser.fftSize);freqArray=new Uint8Array(analyser.frequencyBinCount);animate();}
  isTransmitting=true;setStatus(true);const carrier=parseInt($('carrierSelect').value),baud=parseInt($('baudSelect').value),bitDur=1/baud;
  const f0=carrier-200,f1=carrier+200;log(T('txStart'),'tx');addTxLog('TX',text);$('txStatusText').textContent='Transmitting...';$('txStatusText').style.color='#22c55e';
  const bits=[];for(let i=0;i<text.length;i++){const c=text.charCodeAt(i);bits.push(0);for(let b=0;b<8;b++)bits.push((c>>b)&1);bits.push(1);}
  const dur=bits.length*bitDur,osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
  osc.connect(gain);gain.connect(audioCtx.destination);if(analyser)gain.connect(analyser);gain.gain.value=0.5;osc.type='sine';
  const now=audioCtx.currentTime;for(let i=0;i<bits.length;i++)osc.frequency.setValueAtTime(bits[i]?f1:f0,now+i*bitDur);
  osc.start(now);osc.stop(now+dur);
  const st=Date.now(),iv=setInterval(()=>{const p=Math.min(100,(Date.now()-st)/1000/dur*100);$('txFill').style.width=p+'%';
    if(p>=100){clearInterval(iv);isTransmitting=false;$('txStatusText').textContent='Complete';log(T('txDone'),'success');setTimeout(()=>{$('txFill').style.width='0%';$('txStatusText').textContent='Ready';$('txStatusText').style.color='';setStatus(isListening);},2000);}},50);
}
function addTxLog(dir,msg){const el=$('txLog');if(!el)return;const d=document.createElement('div');d.style.cssText='padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;'+(dir==='TX'?'background:rgba(34,197,94,.1);color:#22c55e;border-left:3px solid #22c55e;':'background:rgba(59,130,246,.1);color:#3b82f6;border-left:3px solid #3b82f6;');d.textContent='['+new Date().toLocaleTimeString()+'] '+dir+': '+msg;el.appendChild(d);el.scrollTop=el.scrollHeight;}
function fillProtocol(){const el=$('protocolInfo');if(!el)return;el.innerHTML='<b>FSK Modulation Protocol</b><br>Carrier: 18-22 kHz<br>Binary 0 = carrier - 200 Hz<br>Binary 1 = carrier + 200 Hz<br>Frame: [START:0][8 data bits LSB][STOP:1]<br>Range: 1-5 meters<br><br><b>Applications:</b> covert data exfiltration, cross-device comms, air-gap bridging.';}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(dismissSplash,2500);
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);else setLanguage('en');}catch{setLanguage('en');}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  $('helpBtn').onclick=()=>{$('helpPanel').classList.toggle('open');$('helpOverlay').classList.toggle('active');};
  $('helpCloseBtn').onclick=$('helpOverlay').onclick=()=>{$('helpPanel').classList.remove('open');$('helpOverlay').classList.remove('active');};
  $('settingsBtn').onclick=()=>{$('settingsPanel').classList.toggle('open');$('settingsOverlay').classList.toggle('active');};
  $('settingsCloseBtn').onclick=$('settingsOverlay').onclick=()=>{$('settingsPanel').classList.remove('open');$('settingsOverlay').classList.remove('active');};
  $('logBtn').onclick=()=>$('logPanel').classList.toggle('open');
  $('logCloseBtn').onclick=()=>$('logPanel').classList.remove('open');
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);
  $('soundToggle').onchange=e=>{soundEnabled=e.target.checked;};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active');};});
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();};});
  $('txBtn').onclick=()=>transmitMessage($('txInput').value);
  $('rxBtn').onclick=()=>{isListening?stopListening():startListening();};
  $('carrierSelect').onchange=updateSignalInfo;$('baudSelect').onchange=updateSignalInfo;
  drawIdle();updateSignalInfo();fillProtocol();log(T('ready'),'success');
});
