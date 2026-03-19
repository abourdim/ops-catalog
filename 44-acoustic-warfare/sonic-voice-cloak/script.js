/**
 * Sonic Voice Cloak — Workshop DIY v1.0
 * Real-time voice disguiser with pitch/effects
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];let currentLang='en',soundEnabled=false;
const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx,analyser,micStream,dataArray,freqArray;
let isActive=false,animId=null,pitchNode,distNode,gainNode,bqFilter;
const PRESETS={deep:{pitch:0.6,dist:50,label:'Deep Vader'},high:{pitch:2.0,dist:0,label:'Chipmunk'},robot:{pitch:1.0,dist:200,label:'Robot'},whisper:{pitch:1.2,dist:0,label:'Whisper'},demon:{pitch:0.4,dist:300,label:'Demon'}};
const LANG={en:{title:'Voice Cloak',subtitle:'Real-Time Voice Disguiser',disconnected:'Idle',connected:'Cloaked',ready:'Voice Cloak ready!',langChanged:'Language > English',themeChanged:'Theme >',splashHint:'tap to skip',started:'Voice cloak activated',stopped:'Voice cloak deactivated',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
fr:{title:'Masque Vocal',subtitle:'Deguiseur de Voix Temps Reel',disconnected:'Inactif',connected:'Masque',ready:'Masque vocal pret!',langChanged:'Langue > Francais',themeChanged:'Theme >',splashHint:'appuyer pour passer',started:'Masque vocal active',stopped:'Masque vocal desactive',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
ar:{title:'عباءة الصوت',subtitle:'مغير الصوت الفوري',disconnected:'خامل',connected:'مقنع',ready:'عباءة الصوت جاهزة!',langChanged:'اللغة > العربية',themeChanged:'المظهر >',splashHint:'انقر للتخطي',started:'تم تفعيل عباءة الصوت',stopped:'تم إيقاف عباءة الصوت',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};
function T(k){return(LANG[currentLang]||LANG.en)[k]||LANG.en[k]||k;}
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=(s.title||'')+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(T('themeChanged')+' '+n,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log('Cleared');}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log('Copied!','success');}catch{log('Copy failed','error');}}
function setStatus(on){const p=$('statusPill'),t=$('statusText');if(t)t.textContent=on?T('connected'):T('disconnected');if(p)p.classList.toggle('connected',on);}
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');setTimeout(()=>s.remove(),600);}
let activeLogFilter='all';function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

const canvas=$('voiceCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function drawVoice(){
  if(!ctx||!freqArray||!dataArray)return;
  analyser.getByteFrequencyData(freqArray);analyser.getByteTimeDomainData(dataArray);
  ctx.fillStyle='rgba(10,10,26,0.15)';ctx.fillRect(0,0,canvas.width,canvas.height);
  // Frequency bars
  const barW=canvas.width/128;
  for(let i=0;i<128;i++){const h=freqArray[i]/255*canvas.height;const hue=i*2;ctx.fillStyle=`hsla(${hue},80%,50%,0.7)`;ctx.fillRect(i*barW,canvas.height-h,barW-1,h);}
  // Waveform overlay
  ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=1.5;ctx.beginPath();
  const sw=canvas.width/dataArray.length;let x=0;
  for(let i=0;i<dataArray.length;i++){const y=dataArray[i]/128*canvas.height/2;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);x+=sw;}ctx.stroke();
  // Level meter
  let rms=0;for(let i=0;i<dataArray.length;i++){const v=(dataArray[i]-128)/128;rms+=v*v;}rms=Math.sqrt(rms/dataArray.length);
  $('levelFill').style.width=Math.min(100,rms*500)+'%';
  // Labels
  ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='10px Orbitron';ctx.fillText('VOICE SPECTRUM',10,15);
  animId=requestAnimationFrame(drawVoice);
}
function drawIdle(){if(!ctx)return;ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='rgba(0,255,170,0.15)';ctx.font='13px Orbitron';ctx.textAlign='center';ctx.fillText('VOICE CLOAK — Click Start',canvas.width/2,canvas.height/2);ctx.textAlign='left';}

async function startCloak(){
  if(!audioCtx)audioCtx=new AudioCtx();if(audioCtx.state==='suspended')await audioCtx.resume();
  try{micStream=await navigator.mediaDevices.getUserMedia({audio:true});
  const src=audioCtx.createMediaStreamSource(micStream);
  analyser=audioCtx.createAnalyser();analyser.fftSize=2048;dataArray=new Uint8Array(analyser.fftSize);freqArray=new Uint8Array(analyser.frequencyBinCount);
  // Distortion
  distNode=audioCtx.createWaveShaper();distNode.oversample='4x';
  // Biquad filter for pitch shifting illusion
  bqFilter=audioCtx.createBiquadFilter();bqFilter.type='lowpass';bqFilter.frequency.value=3000;
  gainNode=audioCtx.createGain();gainNode.gain.value=0.8;
  src.connect(analyser);src.connect(distNode);distNode.connect(bqFilter);bqFilter.connect(gainNode);gainNode.connect(audioCtx.destination);
  applyVoicePreset();
  isActive=true;setStatus(true);$('cloakStatus').textContent='ACTIVE';$('cloakStatus').style.color='#22c55e';
  drawVoice();log(T('started'),'success');
  }catch(e){log('Mic denied: '+e.message,'error');}
}
function stopCloak(){isActive=false;setStatus(false);if(micStream){micStream.getTracks().forEach(t=>t.stop());micStream=null;}if(animId){cancelAnimationFrame(animId);animId=null;}$('cloakStatus').textContent='Inactive';$('cloakStatus').style.color='';log(T('stopped'),'info');drawIdle();}

function makeDistortionCurve(amount){const n=44100,c=new Float32Array(n);for(let i=0;i<n;i++){const x=i*2/n-1;c[i]=amount>0?(3+amount)*x*20*(Math.PI/180)/(Math.PI+amount*Math.abs(x)):x;}return c;}
function applyVoicePreset(){
  const preset=$('voiceSelect').value;const p=PRESETS[preset]||PRESETS.deep;
  $('pitchRange').value=p.pitch;$('pitchVal').textContent=p.pitch.toFixed(1)+'x';
  $('distRange').value=p.dist;$('distVal').textContent=p.dist;
  if(distNode)distNode.curve=makeDistortionCurve(p.dist);
  if(bqFilter){const freq=p.pitch>1?Math.min(8000,3000*p.pitch):Math.max(500,3000*p.pitch);bqFilter.frequency.value=freq;}
  $('voiceInfo').innerHTML='Preset: '+p.label+'<br>Pitch: '+p.pitch+'x<br>Distortion: '+p.dist+'<br>Filter: '+Math.round(bqFilter?bqFilter.frequency.value:0)+' Hz';
}
function fillPresets(){const el=$('presetList');if(!el)return;Object.entries(PRESETS).forEach(([k,v])=>{const d=document.createElement('div');d.style.cssText='padding:6px 10px;border-radius:6px;font-size:.8rem;cursor:pointer;background:rgba(0,0,0,.2);border:1px solid var(--border);';d.innerHTML='<b>'+v.label+'</b> — Pitch: '+v.pitch+'x, Dist: '+v.dist;d.onclick=()=>{$('voiceSelect').value=k;applyVoicePreset();};el.appendChild(d);});}
function fillDSP(){const el=$('dspInfo');if(!el)return;el.innerHTML='<b>Voice Transformation DSP</b><br><br><b>Pitch Shifting:</b> Changes the fundamental frequency. Lower pitch = deeper voice, higher = chipmunk.<br><br><b>Waveshaping Distortion:</b> Non-linear transfer function adds harmonics. Creates robotic/demonic effects.<br><br><b>Biquad Filtering:</b> Shapes frequency response. Low-pass for deep voices, high-pass for thin voices.<br><br><b>Real Applications:</b> Witness protection, anonymous tips, VoIP privacy, entertainment, voice acting.<br><br><b>Counter-measures:</b> Advanced voice biometrics can sometimes reverse pitch shifts. Combining multiple effects provides better anonymity.';}

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
  $('cloakBtn').onclick=startCloak;$('stopCloakBtn').onclick=stopCloak;
  $('voiceSelect').onchange=applyVoicePreset;
  $('pitchRange').oninput=e=>{$('pitchVal').textContent=parseFloat(e.target.value).toFixed(1)+'x';if(bqFilter)bqFilter.frequency.value=3000*parseFloat(e.target.value);};
  $('distRange').oninput=e=>{$('distVal').textContent=e.target.value;if(distNode)distNode.curve=makeDistortionCurve(parseInt(e.target.value));};
  drawIdle();fillPresets();fillDSP();log(T('ready'),'success');
});
