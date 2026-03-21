/**
 * RF Bridge — Workshop DIY v1.2
 * Wireless SDR over WiFi bridge simulator
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let soundEnabled = false, currentLang = 'en';
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.06;const n=audioCtx.currentTime;o.frequency.value=t==='click'?800:523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.1)}

const LANG = {
  en:{title:'🌉 RF Bridge',subtitle:'Wireless SDR over WiFi',disconnected:'Disconnected',connected:'Streaming',mainSection:'SDR Stream Status',mainDesc:'ESP32 bridges HackRF data over WiFi',sectionA:'Bandwidth Usage Over Time',sectionB:'Stream Configuration',sectionC:'RF Bridge Theory',connect:'Connect Bridge',disconnect:'Disconnect',theory1:'An RF Bridge connects a HackRF SDR to remote clients over WiFi using an ESP32 as the bridge controller.',theory2:'IQ samples from HackRF are packetized and streamed over UDP/TCP to WiFi clients, enabling wireless SDR access.',theory3:'Key challenges include bandwidth (2 MHz IQ = 8 Mbps raw), latency management, and buffer underrun prevention.',theory4:'The ESP32 handles sample rate conversion, buffering, and WiFi packet management to maintain a stable stream.',splashHint:'tap to skip',ready:'🌉 RF Bridge ready!',langChanged:'Language → English',bridgeConnected:'Bridge connected — streaming IQ data',bridgeDisconnected:'Bridge disconnected'},
  fr:{title:'🌉 Pont RF',subtitle:'SDR sans fil via WiFi',disconnected:'Deconnecte',connected:'En streaming',mainSection:'Statut du flux SDR',mainDesc:'ESP32 relie les donnees HackRF via WiFi',sectionA:'Utilisation bande passante',sectionB:'Configuration du flux',sectionC:'Theorie du pont RF',connect:'Connecter pont',disconnect:'Deconnecter',theory1:'Un pont RF connecte un SDR HackRF a des clients distants via WiFi avec un ESP32.',theory2:'Les echantillons IQ sont empaquetes et transmis via UDP/TCP aux clients WiFi.',theory3:'Les defis principaux incluent la bande passante, la latence et la prevention des sous-depassements.',theory4:'L\'ESP32 gere la conversion de debit, le tampon et la gestion des paquets WiFi.',splashHint:'appuyer pour passer',ready:'🌉 Pont RF pret!',langChanged:'Langue → Francais',bridgeConnected:'Pont connecte — streaming IQ',bridgeDisconnected:'Pont deconnecte'},
  ar:{title:'🌉 جسر RF',subtitle:'SDR لاسلكي عبر WiFi',disconnected:'غير متصل',connected:'بث جارٍ',mainSection:'حالة بث SDR',mainDesc:'ESP32 يربط بيانات HackRF عبر WiFi',sectionA:'استخدام النطاق الترددي',sectionB:'تكوين البث',sectionC:'نظرية جسر RF',connect:'توصيل الجسر',disconnect:'قطع الاتصال',theory1:'يربط جسر RF جهاز HackRF SDR بالعملاء البعيدين عبر WiFi باستخدام ESP32.',theory2:'يتم تجميع عينات IQ وبثها عبر UDP/TCP إلى عملاء WiFi.',theory3:'تشمل التحديات الرئيسية عرض النطاق والتأخير ومنع نفاد المخزن المؤقت.',theory4:'يتعامل ESP32 مع تحويل معدل العينات والتخزين المؤقت وإدارة حزم WiFi.',splashHint:'انقر للتخطي',ready:'🌉 جسر RF جاهز!',langChanged:'اللغة ← العربية',bridgeConnected:'تم توصيل الجسر — بث IQ',bridgeDisconnected:'تم قطع الجسر'}
};

/* === MORSE CODE EASTER EGG === */
function initMorseEasterEgg(){
 if(document.getElementById('morseHint'))return;
 var MORSE_MAP={'.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H','..':'I','.---':'J','-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P','--.-':'Q','.-.':'R','...':'S','-':'T','..-':'U','...-':'V','.--':'W','-..-':'X','-.--':'Y','--..':'Z'};
 var morseSeq=[];var morseTimer=null;var keyDownTime=0;
 var hint=document.createElement('span');hint.id='morseHint';hint.textContent='|';hint.title='Morse';hint.style.cssText='opacity:0.3;cursor:default;font-size:0.7rem;margin:0 4px;';
 var footer=document.querySelector('footer')||document.querySelector('.footer');
 if(footer)footer.appendChild(hint);
 function decodeMorse(){
  var letters=[];var current='';
  for(var i=0;i<morseSeq.length;i++){
   if(morseSeq[i]===' '){if(current){letters.push(MORSE_MAP[current]||'?');current='';}}
   else{current+=morseSeq[i];}
  }
  if(current)letters.push(MORSE_MAP[current]||'?');
  var word=letters.join('');
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  if(word==='SOS'){
   var flash=document.createElement('div');flash.style.cssText='position:fixed;inset:0;background:white;z-index:999999;opacity:0.8;transition:opacity 0.5s;';
   document.body.appendChild(flash);setTimeout(function(){flash.style.opacity='0';setTimeout(function(){flash.remove();},500);},200);
   var ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;';
   var box=document.createElement('div');box.style.cssText='background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:2rem;max-width:420px;width:90%;color:var(--text,#e4ddd0);text-align:center;';
   box.innerHTML='<h3 style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;">'+((L.morseSecret)||'Morse Easter Egg')+'</h3><p style="margin:1rem 0;font-style:italic;line-height:1.6;">'+((L.morseBackstory)||'Origin unknown.')+'</p><button style="background:var(--accent,#d4a03c);color:#000;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-weight:700;" onclick="this.parentElement.parentElement.remove();">OK</button>';
   ov.appendChild(box);ov.onclick=function(e){if(e.target===ov)ov.remove();};document.body.appendChild(ov);
  }else if(word==='HELP'){
   var helpBtn=document.querySelector('[data-panel="help"]')||document.querySelector('.btn-help')||document.querySelector('[title="Help"]');
   if(helpBtn)helpBtn.click();
  }
  if(word.length>0){console.log((L.morseDecoded||'Decoded: ')+word);}
  morseSeq=[];
 }
 document.addEventListener('keydown',function(e){
  if(e.code!=='Space'||e.repeat||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  e.preventDefault();keyDownTime=Date.now();if(morseTimer)clearTimeout(morseTimer);
 });
 document.addEventListener('keyup',function(e){
  if(e.code!=='Space'||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  var dur=Date.now()-keyDownTime;
  morseSeq.push(dur<200?'.':'-');
  if(morseTimer)clearTimeout(morseTimer);
  morseTimer=setTimeout(function(){morseSeq.push(' ');morseTimer=setTimeout(decodeMorse,1000);},300);
 });
}

/* === DNA FINGERPRINT VISUALIZER === */
function initDNAFingerprint(){
 if(document.getElementById('dnaBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var dnaBtn=document.createElement('button');dnaBtn.id='dnaBtn';dnaBtn.className='btn-icon-only';
 dnaBtn.textContent='\uD83E\uDDEC';dnaBtn.title=L.dnaTitle||'DNA Fingerprint';dnaBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(dnaBtn);else{dnaBtn.style.cssText+='position:fixed;top:0.5rem;right:6rem;z-index:9999;';document.body.appendChild(dnaBtn);}
 var panel=null;var canvas=null;var animId=null;
 function getSliderHues(){
  var sliders=document.querySelectorAll('input[type="range"]');var hues=[];
  sliders.forEach(function(s){var min=parseFloat(s.min)||0;var max=parseFloat(s.max)||100;var val=parseFloat(s.value);var ratio=(val-min)/(max-min||1);hues.push(Math.round(ratio*360));});
  if(hues.length===0)hues=[0,120,240];return hues;
 }
 function drawDNA(){
  if(!canvas)return;var ctx=canvas.getContext('2d');var w=canvas.width;var h=canvas.height;
  ctx.clearRect(0,0,w,h);var hues=getSliderHues();var t=Date.now()/1000;
  for(var x=0;x<w;x+=4){
   var phase=x/w*Math.PI*4+t;var y1=h/2+Math.sin(phase)*25;var y2=h/2+Math.sin(phase+Math.PI)*25;
   var hIdx=Math.floor((x/w)*hues.length)%hues.length;var hue=hues[hIdx]||0;
   ctx.beginPath();ctx.arc(x,y1,2,0,Math.PI*2);ctx.fillStyle='hsl('+hue+',80%,60%)';ctx.fill();
   ctx.beginPath();ctx.arc(x,y2,2,0,Math.PI*2);ctx.fillStyle='hsl('+(hue+180)%360+',80%,60%)';ctx.fill();
   if(x%12<4){ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.strokeStyle='hsla('+hue+',60%,50%,0.3)';ctx.lineWidth=1;ctx.stroke();}
  }
  animId=requestAnimationFrame(drawDNA);
 }
 dnaBtn.onclick=function(){
  if(panel){panel.remove();panel=null;if(animId)cancelAnimationFrame(animId);return;}
  panel=document.createElement('div');panel.style.cssText='position:fixed;bottom:80px;right:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;text-align:center;';
  panel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:6px;">'+(L.dnaTitle||'DNA Fingerprint')+'</div>';
  canvas=document.createElement('canvas');canvas.width=200;canvas.height=80;canvas.style.cssText='border-radius:8px;background:rgba(0,0,0,0.3);display:block;';
  panel.appendChild(canvas);
  var saveBtn=document.createElement('button');saveBtn.textContent=L.dnaSave||'Save DNA';
  saveBtn.style.cssText='margin-top:8px;background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 14px;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:700;';
  saveBtn.onclick=function(){var link=document.createElement('a');link.download='dna-fingerprint.png';link.href=canvas.toDataURL();link.click();};
  panel.appendChild(saveBtn);
  var info=document.createElement('div');info.style.cssText='color:var(--text,#e4ddd0);font-size:0.65rem;opacity:0.7;margin-top:4px;';info.textContent=L.dnaInfo||'Unique visual signature';
  panel.appendChild(info);document.body.appendChild(panel);drawDNA();
 };
}

/* === SANDBOX MODE === */
function initSandboxMode(){
 if(document.getElementById('sandboxBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var active=false;var originals=[];var customCount=0;
 var sandboxBtn=document.createElement('button');sandboxBtn.id='sandboxBtn';sandboxBtn.className='btn-icon-only';
 sandboxBtn.textContent='\uD83D\uDD27';sandboxBtn.title=L.sandboxTitle||'Sandbox Mode';sandboxBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(sandboxBtn);else{sandboxBtn.style.cssText+='position:fixed;top:0.5rem;right:9rem;z-index:9999;';document.body.appendChild(sandboxBtn);}
 var controlPanel=null;
 function storeOriginals(){
  originals=[];document.querySelectorAll('input[type="range"]').forEach(function(s){
   originals.push({el:s,min:s.min,max:s.max,val:s.value,step:s.step});
  });
 }
 function unlockSliders(){
  document.querySelectorAll('input[type="range"]').forEach(function(s){s.min='0';s.max='100';});
 }
 function restoreSliders(){
  originals.forEach(function(o){o.el.min=o.min;o.el.max=o.max;o.el.value=o.val;o.el.step=o.step;o.el.dispatchEvent(new Event('input',{bubbles:true}));});
 }
 function addCustomSlider(){
  customCount++;
  var name=prompt('Parameter name:','Custom-'+customCount);if(!name)return;
  var wrap=document.createElement('div');wrap.className='sandbox-custom-slider';wrap.style.cssText='margin:8px 0;padding:6px;background:rgba(0,0,0,0.2);border-radius:8px;';
  var lbl=document.createElement('label');lbl.textContent=name;lbl.style.cssText='color:var(--accent,#d4a03c);font-size:0.75rem;display:block;';
  var sl=document.createElement('input');sl.type='range';sl.min='0';sl.max='100';sl.value='50';sl.style.cssText='width:100%;';
  var valSpan=document.createElement('span');valSpan.textContent='50';valSpan.style.cssText='color:var(--text,#e4ddd0);font-size:0.7rem;';
  sl.oninput=function(){valSpan.textContent=sl.value;console.log('[Sandbox] '+name+': '+sl.value);};
  wrap.appendChild(lbl);wrap.appendChild(sl);wrap.appendChild(valSpan);
  if(controlPanel)controlPanel.appendChild(wrap);
 }
 sandboxBtn.onclick=function(){
  active=!active;
  if(active){
   sandboxBtn.style.background='var(--accent,#d4a03c)';sandboxBtn.style.color='#000';sandboxBtn.style.borderRadius='6px';
   storeOriginals();unlockSliders();
   controlPanel=document.createElement('div');controlPanel.id='sandboxPanel';
   controlPanel.style.cssText='position:fixed;bottom:80px;left:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;min-width:200px;max-height:300px;overflow-y:auto;';
   controlPanel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:8px;">'+(L.sandboxOn||'Sandbox ON')+'</div>';
   var addBtn=document.createElement('button');addBtn.textContent=L.sandboxAdd||'Add Parameter';
   addBtn.style.cssText='background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;font-weight:700;margin-right:6px;';
   addBtn.onclick=addCustomSlider;
   var resetBtn=document.createElement('button');resetBtn.textContent=L.sandboxReset||'Reset Defaults';
   resetBtn.style.cssText='background:transparent;color:var(--accent,#d4a03c);border:1px solid var(--accent,#d4a03c);padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;';
   resetBtn.onclick=function(){restoreSliders();};
   controlPanel.appendChild(addBtn);controlPanel.appendChild(resetBtn);document.body.appendChild(controlPanel);
  }else{
   sandboxBtn.style.background='';sandboxBtn.style.color='';sandboxBtn.style.borderRadius='';
   restoreSliders();
   if(controlPanel){controlPanel.remove();controlPanel=null;}
   document.querySelectorAll('.sandbox-custom-slider').forEach(function(el){el.remove();});
  }
 };
}
document.addEventListener('DOMContentLoaded',function(){try{initMorseEasterEgg();}catch(e){console.warn('Morse init:',e);}try{initDNAFingerprint();}catch(e){console.warn('DNA init:',e);}try{initSandboxMode();}catch(e){console.warn('Sandbox init:',e);}});



function dismissSplash(){const s=$('splash');if(s){s.style.opacity='0';setTimeout(()=>s.style.display='none',500)}}
setTimeout(dismissSplash,3000);
function setLanguage(lang){currentLang=lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(LANG[lang]?.[k])el.textContent=LANG[lang][k]});localStorage.setItem('rfbridge-lang',lang);log(LANG[lang]?.langChanged||'Lang','info')}
function setTheme(name){document.documentElement.setAttribute('data-theme',name);if(LIGHT_THEMES.includes(name))document.documentElement.classList.add('light-theme');else document.documentElement.classList.remove('light-theme');localStorage.setItem('rfbridge-theme',name)}
function log(msg,type='info'){const c=$('logContainer');if(!c)return;const line=document.createElement('div');line.className='log-line log-'+type;line.innerHTML=`<span class="log-ts">${new Date().toLocaleTimeString()}</span><span class="log-badge">${type.toUpperCase()}</span> ${msg}`;c.appendChild(line);c.scrollTop=c.scrollHeight}
function showToast(msg,ms){const t=$('toastIndicator'),m=$('toastMessage');if(m)m.textContent=msg;if(t)t.classList.add('show');if(ms)setTimeout(()=>t?.classList.remove('show'),ms)}
function setStatus(on){const d=$('statusDot'),t=$('statusText');if(d)d.style.background=on?'#0f0':'#f44';if(t)t.textContent=LANG[currentLang]?.[on?'connected':'disconnected']||''}
function openPanel(id,oid){$(id)?.classList.add('open');if(oid)$(oid)?.classList.add('show')}
function closePanel(id,oid){$(id)?.classList.remove('open');if(oid)$(oid)?.classList.remove('show')}

/* ═══════ STREAM SIMULATION ═══════ */
let streaming = false, animFrame = null, startTime = 0;
let bwHistory = [];
const wfCanvas = $('waterfallCanvas');
const wfCtx = wfCanvas ? wfCanvas.getContext('2d') : null;
let wfData = [];

function initWaterfall(){
  if(!wfCtx)return;wfData=[];
  for(let y=0;y<wfCanvas.height;y++){const row=new Float32Array(wfCanvas.width);for(let x=0;x<wfCanvas.width;x++)row[x]=Math.random()*.03;wfData.push(row)}
}

function addSpectrumLine(){
  const W=wfCanvas.width, bw=parseInt($('bwSelect')?.value||2);
  const row=new Float32Array(W);
  // Noise floor
  for(let x=0;x<W;x++) row[x]=Math.random()*.06;
  // Simulated signals based on frequency
  const freq=parseInt($('freqSelect')?.value||2400);
  const numSignals=2+Math.floor(Math.random()*4);
  for(let s=0;s<numSignals;s++){
    const center=Math.floor(Math.random()*W);
    const width=Math.floor(10+Math.random()*30*(bw/2));
    const amp=.3+Math.random()*.7;
    for(let i=-width;i<width;i++){
      const idx=center+i;
      if(idx>=0&&idx<W){const d=Math.abs(i)/width;row[idx]=Math.max(row[idx],amp*(1-d*d)+Math.random()*.05)}
    }
  }
  wfData.push(row);if(wfData.length>wfCanvas.height)wfData.shift();
}

function drawWaterfall(){
  if(!wfCtx)return;
  const W=wfCanvas.width,H=wfCanvas.height;
  const img=wfCtx.createImageData(W,H);
  for(let y=0;y<Math.min(wfData.length,H);y++){
    const row=wfData[y];
    for(let x=0;x<W;x++){
      const v=row[x],idx=(y*W+x)*4;
      if(v<.2){img.data[idx]=0;img.data[idx+1]=0;img.data[idx+2]=Math.floor(v*5*150)}
      else if(v<.5){img.data[idx]=0;img.data[idx+1]=Math.floor((v-.2)*3.3*255);img.data[idx+2]=200}
      else if(v<.8){img.data[idx]=Math.floor((v-.5)*3.3*255);img.data[idx+1]=220;img.data[idx+2]=0}
      else{img.data[idx]=255;img.data[idx+1]=Math.floor((1-(v-.8)*5)*200);img.data[idx+2]=0}
      img.data[idx+3]=255;
    }
  }
  wfCtx.putImageData(img,0,0);
  const freq=parseInt($('freqSelect')?.value||2400),bw=parseInt($('bwSelect')?.value||2);
  wfCtx.fillStyle='rgba(255,255,255,.5)';wfCtx.font='10px Orbitron,monospace';
  wfCtx.fillText(`${freq-bw/2} MHz`,4,12);wfCtx.fillText(`${freq} MHz`,W/2-25,12);wfCtx.fillText(`${freq+bw/2} MHz`,W-75,12);
}

function drawBandwidth(){
  const canvas=$('bwCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  if(bwHistory.length<2)return;
  const max=Math.max(20,...bwHistory);
  ctx.strokeStyle='var(--accent, #d4a017)';ctx.lineWidth=2;ctx.beginPath();
  bwHistory.forEach((v,i)=>{const x=i/(bwHistory.length-1)*W,y=H-10-(v/max)*(H-20);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
  ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='10px monospace';
  ctx.fillText('Mbps',4,14);ctx.fillText(max.toFixed(1),4,28);
}

function updateStats(){
  const bw=parseInt($('bwSelect')?.value||2);
  const baseThroughput=bw*4; // IQ = 4x bandwidth
  const throughput=baseThroughput*(0.85+Math.random()*.15);
  const latency=5+Math.random()*15;
  const dropped=Math.random()*2;
  const elapsed=Math.floor((Date.now()-startTime)/1000);
  const mins=Math.floor(elapsed/60).toString().padStart(2,'0');
  const secs=(elapsed%60).toString().padStart(2,'0');

  $('throughput').textContent=throughput.toFixed(1);
  $('latency').textContent=latency.toFixed(0);
  $('dropped').textContent=dropped.toFixed(1);
  $('uptime').textContent=`${mins}:${secs}`;
  $('bufferBar').style.width=Math.min(100,60+Math.random()*35)+'%';

  bwHistory.push(throughput);if(bwHistory.length>200)bwHistory.shift();
}

function updateConfig(){
  const freq=$('freqSelect')?.value||2400,bw=$('bwSelect')?.value||2;
  const el=$('configPanel');if(!el)return;
  el.innerHTML=`<div>Center Frequency: <strong>${freq} MHz</strong></div><div>Bandwidth: <strong>${bw} MHz</strong></div><div>Sample Rate: <strong>${bw*2} MSPS</strong></div><div>IQ Format: <strong>8-bit I/Q (uint8)</strong></div><div>Protocol: <strong>UDP/TCP Hybrid</strong></div><div>Buffer Size: <strong>256 KB ring</strong></div><div>Packet Size: <strong>1472 bytes (MTU-safe)</strong></div><div>Raw Data Rate: <strong>${bw*4} Mbps</strong></div>`;
}

function animate(){
  if(!streaming)return;
  addSpectrumLine();drawWaterfall();updateStats();
  if(bwHistory.length%10===0)drawBandwidth();
  animFrame=requestAnimationFrame(animate);
}

function connectBridge(){
  if(streaming)return;streaming=true;startTime=Date.now();bwHistory=[];
  setStatus(true);playSound('click');
  log(LANG[currentLang]?.bridgeConnected||'Bridge connected','success');
  updateConfig();animate();
}
function disconnectBridge(){
  streaming=false;if(animFrame)cancelAnimationFrame(animFrame);
  setStatus(false);
  log(LANG[currentLang]?.bridgeDisconnected||'Bridge disconnected','info');
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  const savedLang=localStorage.getItem('rfbridge-lang')||'en';
  const savedTheme=localStorage.getItem('rfbridge-theme')||'mosque-gold';
  if($('langSelect'))$('langSelect').value=savedLang;
  if($('themeSelect'))$('themeSelect').value=savedTheme;
  setLanguage(savedLang);setTheme(savedTheme);

  $('helpBtn')?.addEventListener('click',()=>openPanel('helpPanel','helpOverlay'));
  $('helpCloseBtn')?.addEventListener('click',()=>closePanel('helpPanel','helpOverlay'));
  $('helpOverlay')?.addEventListener('click',()=>closePanel('helpPanel','helpOverlay'));
  $('settingsBtn')?.addEventListener('click',()=>openPanel('settingsPanel','settingsOverlay'));
  $('settingsCloseBtn')?.addEventListener('click',()=>closePanel('settingsPanel','settingsOverlay'));
  $('settingsOverlay')?.addEventListener('click',()=>closePanel('settingsPanel','settingsOverlay'));
  $('logBtn')?.addEventListener('click',()=>$('logPanel')?.classList.toggle('open'));
  $('logCloseBtn')?.addEventListener('click',()=>$('logPanel')?.classList.remove('open'));
  $('langSelect')?.addEventListener('change',e=>setLanguage(e.target.value));
  $('themeSelect')?.addEventListener('change',e=>setTheme(e.target.value));
  $('soundToggle')?.addEventListener('change',e=>{soundEnabled=e.target.checked});
  $('clearLogBtn')?.addEventListener('click',()=>{$('logContainer').innerHTML='';log('Log cleared','info')});
  $('copyLogBtn')?.addEventListener('click',()=>{navigator.clipboard.writeText($('logContainer')?.innerText||'').then(()=>showToast('Copied!',1500))});

  document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$({faq:'helpFaq',howto:'helpHowto',wiki:'helpWiki'}[tab.dataset.tab])?.classList.add('active')})});
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=(f==='all'||l.classList.contains('log-'+f))?'':'none'})})});

  $('connectBtn')?.addEventListener('click',connectBridge);
  $('disconnectBtn')?.addEventListener('click',disconnectBridge);
  $('freqSelect')?.addEventListener('change',updateConfig);
  $('bwSelect')?.addEventListener('change',updateConfig);

  initWaterfall();drawWaterfall();updateConfig();
  setStatus(false);log(LANG[currentLang]?.ready||'Ready','success');
});

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — RF Bridge: Wireless SDR over WiFi with
   IQ stream visualization, bandwidth meter, and buffer status
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simRfBridgeCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const iqSamples=[],streamPkts=[];let bufferLevel=0.5,throughput=0,dropped=0;

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:300px;border-radius:12px;margin:1.2rem 0;display:block;background:#080812;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  /* HackRF device (left) */
  function drawHackRF(){
    ctx.save();ctx.shadowColor='#6bcb77';ctx.shadowBlur=8;
    ctx.beginPath();ctx.rect(20,H/2-25,60,50);ctx.fillStyle='rgba(107,203,119,0.12)';ctx.fill();
    ctx.strokeStyle='#6bcb77';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='10px monospace';ctx.fillStyle='#6bcb77';ctx.textAlign='center';ctx.fillText('HackRF',50,H/2+4);
    ctx.font='7px monospace';ctx.fillStyle='#888';ctx.fillText('SDR',50,H/2+16);ctx.restore();
  }

  /* ESP32 bridge (center) */
  function drawBridge(){
    const bx=W/2,by=H/2;
    const pulse=4+Math.sin(frameCount*0.05)*2;
    ctx.save();ctx.shadowColor='#ffd93d';ctx.shadowBlur=pulse;
    ctx.beginPath();ctx.arc(bx,by,24,0,Math.PI*2);ctx.fillStyle='rgba(255,217,61,0.12)';ctx.fill();
    ctx.strokeStyle='#ffd93d';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='14px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u{1F4F6}',bx,by);
    ctx.font='8px monospace';ctx.fillStyle='#ffd93d';ctx.fillText('ESP32 Bridge',bx,by+32);ctx.restore();
    // Buffer bar
    ctx.fillStyle='#222';ctx.fillRect(bx-25,by+38,50,5);
    const bc=bufferLevel>0.8?'#ff4444':bufferLevel>0.5?'#ffd93d':'#6bcb77';
    ctx.fillStyle=bc;ctx.fillRect(bx-25,by+38,50*bufferLevel,5);
    ctx.font='7px monospace';ctx.fillStyle='#888';ctx.textAlign='center';ctx.fillText('Buffer: '+Math.floor(bufferLevel*100)+'%',bx,by+54);
  }

  /* WiFi client (right) */
  function drawClient(){
    ctx.save();ctx.shadowColor='#4d96ff';ctx.shadowBlur=8;
    ctx.beginPath();ctx.rect(W-80,H/2-25,60,50);ctx.fillStyle='rgba(77,150,255,0.12)';ctx.fill();
    ctx.strokeStyle='#4d96ff';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='10px monospace';ctx.fillStyle='#4d96ff';ctx.textAlign='center';ctx.fillText('Client',W-50,H/2+4);
    ctx.font='7px monospace';ctx.fillStyle='#888';ctx.fillText('WiFi',W-50,H/2+16);ctx.restore();
  }

  /* IQ data stream packets flying between nodes */
  class StreamPkt{
    constructor(phase){this.phase=phase;this.sx=phase===0?80:W/2+24;this.sy=H/2;this.tx=phase===0?W/2-24:W-80;this.ty=H/2;this.progress=0;this.alive=true;}
    update(){this.progress+=0.025;if(this.progress>=1)this.alive=false;return this.alive;}
    draw(){
      const px=this.sx+(this.tx-this.sx)*this.progress,py=this.sy+(this.ty-this.sy)*this.progress+(Math.sin(this.progress*Math.PI*4)*8);
      ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fillStyle=this.phase===0?'#6bcb77':'#4d96ff';ctx.fill();
    }
  }

  /* IQ constellation diagram */
  function drawConstellation(){
    const cx=W/2,cy=H*0.18,r=40;
    ctx.strokeStyle='#fff1';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx-r,cy);ctx.lineTo(cx+r,cy);ctx.moveTo(cx,cy-r);ctx.lineTo(cx,cy+r);ctx.stroke();
    // IQ points
    for(let i=0;i<16;i++){
      const angle=Math.PI*2/16*i+frameCount*0.02;
      const dist=r*0.6+Math.random()*r*0.2;
      const px=cx+Math.cos(angle)*dist,py=cy+Math.sin(angle)*dist;
      ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.6)';ctx.fill();
    }
    ctx.font='7px monospace';ctx.fillStyle='#666';ctx.textAlign='center';ctx.fillText('IQ Constellation',cx,cy+r+10);
  }

  /* Bandwidth timeline at bottom */
  const bwHist=[];
  function drawBWTimeline(){
    bwHist.push(throughput);if(bwHist.length>120)bwHist.shift();
    const bh=40,by=H-bh-8;
    ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(0,by,W,bh);
    ctx.strokeStyle='#fff1';ctx.strokeRect(0,by,W,bh);
    const step=W/120;
    ctx.beginPath();
    bwHist.forEach((v,i)=>{const x=i*step,y=by+bh-v/10*bh;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
    ctx.strokeStyle='rgba(0,200,255,0.5)';ctx.lineWidth=1;ctx.stroke();
    ctx.font='7px monospace';ctx.fillStyle='#666';ctx.textAlign='left';ctx.fillText('Bandwidth (Mbps)',4,by+10);
  }

  /* Connection lines */
  function drawConnections(){
    ctx.beginPath();ctx.moveTo(80,H/2);ctx.lineTo(W/2-24,H/2);ctx.strokeStyle='rgba(107,203,119,0.2)';ctx.lineWidth=2;ctx.setLineDash([4,6]);ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();ctx.moveTo(W/2+24,H/2);ctx.lineTo(W-80,H/2);ctx.strokeStyle='rgba(77,150,255,0.2)';ctx.lineWidth=2;ctx.setLineDash([4,6]);ctx.stroke();ctx.setLineDash([]);
    ctx.font='7px monospace';ctx.fillStyle='#888';ctx.textAlign='center';
    ctx.fillText('USB/SPI',W*0.25,H/2-10);ctx.fillText('WiFi UDP',W*0.75,H/2-10);
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,175,56);ctx.strokeStyle='#ffd93d33';ctx.strokeRect(8,8,175,56);
    ctx.font='10px monospace';ctx.fillStyle='#ffd93d';ctx.textAlign='left';ctx.fillText('\u{1F309} RF BRIDGE',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Throughput: '+throughput.toFixed(1)+' Mbps',16,40);
    ctx.fillText('Dropped: '+dropped+'  Buffer: '+Math.floor(bufferLevel*100)+'%',16,54);ctx.restore();
  }

  function init(){ensureCanvas();animate();}
  function animate(){
    frameCount++;ctx.fillStyle='rgba(8,8,18,0.14)';ctx.fillRect(0,0,W,H);
    throughput=4+Math.sin(frameCount*0.02)*2+Math.random()*0.5;
    bufferLevel=0.3+Math.sin(frameCount*0.01)*0.3+Math.random()*0.1;
    if(bufferLevel>0.9)dropped++;
    drawConnections();drawHackRF();drawBridge();drawClient();drawConstellation();
    if(frameCount%6===0){streamPkts.push(new StreamPkt(0));streamPkts.push(new StreamPkt(1));}
    for(let i=streamPkts.length-1;i>=0;i--){if(!streamPkts[i].update())streamPkts.splice(i,1);else streamPkts[i].draw();}
    drawBWTimeline();drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,300);
})();
