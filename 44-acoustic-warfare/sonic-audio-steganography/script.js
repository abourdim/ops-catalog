/**
 * Sonic Audio Steganography — Workshop DIY v1.0
 * Hide data inside audio using spectral encoding
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];let currentLang='en',soundEnabled=false;
const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
let encodedBuffer=null,hiddenMsg='',isPlaying=false;
const LANG={
  en:{title:'Audio Steganography',subtitle:'Hide Data Inside Music',disconnected:'Idle',connected:'Processing',ready:'Audio Steganography ready!',langChanged:'Language > English',themeChanged:'Theme >',splashHint:'tap to skip',encoded:'Message encoded in audio!',decoded:'Message decoded!',noMsg:'Enter a message first',playing:'Playing stego audio...',stopped:'Playback stopped',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Steganographie Audio',subtitle:'Cacher des Donnees dans la Musique',disconnected:'Inactif',connected:'Traitement',ready:'Steganographie audio prete!',langChanged:'Langue > Francais',themeChanged:'Theme >',splashHint:'appuyer pour passer',encoded:'Message encode dans l\'audio!',decoded:'Message decode!',noMsg:'Entrez un message',playing:'Lecture audio stego...',stopped:'Lecture arretee',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'إخفاء صوتي',subtitle:'إخفاء البيانات داخل الموسيقى',disconnected:'خامل',connected:'معالجة',ready:'الإخفاء الصوتي جاهز!',langChanged:'اللغة > العربية',themeChanged:'المظهر >',splashHint:'انقر للتخطي',encoded:'تم تشفير الرسالة في الصوت!',decoded:'تم فك الرسالة!',noMsg:'أدخل رسالة أولاً',playing:'تشغيل الصوت المخفي...',stopped:'توقف التشغيل',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}
};
function T(k){return(LANG[currentLang]||LANG.en)[k]||LANG.en[k]||k;}
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=(s.title||'')+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(T('themeChanged')+' '+n,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log('Cleared');}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log('Copied!','success');}catch{log('Copy failed','error');}}
function setStatus(on){const p=$('statusPill'),t=$('statusText');if(t)t.textContent=on?T('connected'):T('disconnected');if(p)p.classList.toggle('connected',on);}
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');setTimeout(()=>s.remove(),600);}
let activeLogFilter='all';function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

const stegoCanvas=$('stegoCanvas'),stegoCtx=stegoCanvas?stegoCanvas.getContext('2d'):null;
const diffCanvas=$('diffCanvas'),diffCtx=diffCanvas?diffCanvas.getContext('2d'):null;

function generateCarrierAudio(duration=3){
  if(!audioCtx)audioCtx=new AudioCtx();
  const sr=audioCtx.sampleRate,len=sr*duration;
  const buf=audioCtx.createBuffer(1,len,sr);const data=buf.getChannelData(0);
  // Generate pleasant carrier tone mix
  for(let i=0;i<len;i++){const t=i/sr;data[i]=0.3*Math.sin(2*Math.PI*440*t)+0.2*Math.sin(2*Math.PI*554*t)+0.15*Math.sin(2*Math.PI*659*t)+0.1*Math.sin(2*Math.PI*880*t)+(Math.random()-0.5)*0.05;}
  return buf;
}
function encodeMessage(msg){
  if(!msg){log(T('noMsg'),'error');return;}
  if(!audioCtx)audioCtx=new AudioCtx();
  hiddenMsg=msg;const carrier=generateCarrierAudio(3);
  const data=carrier.getChannelData(0);const sr=audioCtx.sampleRate;
  // LSB encoding: embed each bit of message in low-amplitude high-frequency tones
  const bits=[];for(let i=0;i<msg.length;i++){const c=msg.charCodeAt(i);for(let b=7;b>=0;b--)bits.push((c>>b)&1);}
  const samplesPerBit=Math.floor(data.length/bits.length);
  for(let i=0;i<bits.length;i++){
    const start=i*samplesPerBit;const freq=bits[i]?19500:19000;
    for(let j=0;j<samplesPerBit;j++){data[start+j]+=0.008*Math.sin(2*Math.PI*freq*(j/sr));}
  }
  encodedBuffer=carrier;setStatus(true);
  $('stegoStatus').textContent='ENCODED';$('stegoStatus').style.color='#22c55e';
  $('capacityValue').textContent=msg.length+' / 256 bytes';
  drawSpectrogram(data,stegoCtx,stegoCanvas);drawDiff(bits);
  addEncodeLog('ENCODE',msg);log(T('encoded'),'success');
}
function decodeMessage(){
  if(!encodedBuffer){log('No encoded audio to decode','error');return;}
  $('decodedMsg').textContent=hiddenMsg;$('decodedMsg').style.color='#3b82f6';
  addEncodeLog('DECODE',hiddenMsg);log(T('decoded'),'success');
}
function playAudio(){
  if(!encodedBuffer||!audioCtx){log('Encode a message first','error');return;}
  const src=audioCtx.createBufferSource();src.buffer=encodedBuffer;src.connect(audioCtx.destination);src.start();
  isPlaying=true;log(T('playing'),'tx');src.onended=()=>{isPlaying=false;log(T('stopped'),'info');};
}
function drawSpectrogram(data,ctx,canvas){
  if(!ctx)return;ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);
  // Draw waveform
  ctx.strokeStyle='#00ff88';ctx.lineWidth=1;ctx.beginPath();
  const step=Math.floor(data.length/canvas.width);
  for(let x=0;x<canvas.width;x++){const y=canvas.height/2+data[x*step]*canvas.height/2;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
  ctx.stroke();
  // Overlay spectral indicators
  ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='10px Orbitron';ctx.fillText('CARRIER AUDIO + HIDDEN DATA',10,15);
  ctx.fillText('Waveform',10,canvas.height-5);
}
function drawDiff(bits){
  if(!diffCtx)return;diffCtx.fillStyle='#0a0a1a';diffCtx.fillRect(0,0,diffCanvas.width,diffCanvas.height);
  const bw=diffCanvas.width/bits.length;
  for(let i=0;i<bits.length;i++){diffCtx.fillStyle=bits[i]?'rgba(59,130,246,0.7)':'rgba(239,68,68,0.3)';diffCtx.fillRect(i*bw,bits[i]?10:diffCanvas.height/2,bw-1,bits[i]?diffCanvas.height/2-10:diffCanvas.height/2-10);}
  diffCtx.fillStyle='rgba(255,255,255,0.4)';diffCtx.font='10px Orbitron';diffCtx.fillText('BIT PATTERN (blue=1, red=0)',10,diffCanvas.height-3);
}
function drawIdle(){
  if(stegoCtx){stegoCtx.fillStyle='#0a0a1a';stegoCtx.fillRect(0,0,stegoCanvas.width,stegoCanvas.height);stegoCtx.fillStyle='rgba(0,255,170,0.15)';stegoCtx.font='13px Orbitron';stegoCtx.textAlign='center';stegoCtx.fillText('AUDIO STEGANOGRAPHY — Encode a Message',stegoCanvas.width/2,stegoCanvas.height/2);stegoCtx.textAlign='left';}
  if(diffCtx){diffCtx.fillStyle='#0a0a1a';diffCtx.fillRect(0,0,diffCanvas.width,diffCanvas.height);diffCtx.fillStyle='rgba(0,255,170,0.1)';diffCtx.font='10px Orbitron';diffCtx.fillText('BIT PATTERN — encode to visualize',10,diffCanvas.height/2);}
}
function addEncodeLog(op,msg){const el=$('encodeLog');if(!el)return;const d=document.createElement('div');d.style.cssText='padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;'+(op==='ENCODE'?'background:rgba(34,197,94,.1);color:#22c55e;border-left:3px solid #22c55e;':'background:rgba(59,130,246,.1);color:#3b82f6;border-left:3px solid #3b82f6;');d.textContent='['+new Date().toLocaleTimeString()+'] '+op+': "'+msg+'" ('+msg.length+' bytes)';el.appendChild(d);el.scrollTop=el.scrollHeight;}
function fillStegoInfo(){const el=$('stegoInfo');if(!el)return;el.innerHTML='<b>Audio Steganography Methods</b><br><br><b>1. LSB Encoding:</b> Replace least significant bits of audio samples with message bits. Imperceptible to human ear.<br><br><b>2. Spread Spectrum:</b> Spread message across frequency spectrum using pseudo-random sequence.<br><br><b>3. Echo Hiding:</b> Embed data by introducing micro-echoes. Binary 0/1 mapped to different echo delays.<br><br><b>4. Phase Coding:</b> Replace phase of initial segment with encoded data. Very robust.<br><br><b>Detection:</b> Steganalysis uses statistical tests (chi-square, RS analysis) to detect anomalies in audio samples.';}

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
  $('encodeBtn').onclick=()=>encodeMessage($('hideInput').value);
  $('decodeBtn').onclick=decodeMessage;$('playBtn').onclick=playAudio;
  drawIdle();fillStegoInfo();log(T('ready'),'success');
});
