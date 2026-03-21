/**
 * BLE X-Ray — Workshop DIY v1.2
 * 2.4GHz BLE frequency hopping visualizer
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let soundEnabled = false, currentLang = 'en';
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.06;const n=audioCtx.currentTime;o.frequency.value=t==='click'?800:523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.1)}

const LANG = {
  en: {
    title:'💙 BLE X-Ray', subtitle:'1600 hops/sec Frequency Hopping',
    disconnected:'Disconnected', connected:'Scanning',
    mainSection:'2.4 GHz BLE Channel Waterfall', mainDesc:'Watch BLE frequency hopping in real-time',
    sectionA:'Channel Usage Histogram', sectionB:'BLE Device List', sectionC:'BLE Frequency Hopping Theory',
    startScan:'Start Scan', stop:'Stop', hopSpeed:'Hop Speed:',
    theory1:'BLE uses 40 channels in the 2.4 GHz ISM band (2402-2480 MHz), each 2 MHz wide. 37 are data channels, 3 are advertising (37, 38, 39).',
    theory2:'Connected devices hop across data channels at 1600 hops/second using an algorithm seeded by the access address.',
    theory3:'Adaptive Frequency Hopping (AFH) lets BLE skip channels with interference from WiFi, improving coexistence.',
    theory4:'The waterfall shows channel activity over time. Bright dots indicate active transmissions on that channel.',
    faq_q1:'What is BLE X-Ray?', faq_a1:'A BLE frequency hopping visualizer for the 2.4 GHz band.',
    faq_q2:'Why 1600 hops/sec?', faq_a2:'BLE spec defines 1600 channel changes per second for connected devices.',
    faq_q3:'What are advertising channels?', faq_a3:'Channels 37, 38, 39 used for device discovery.',
    splashHint:'tap to skip', ready:'💙 BLE X-Ray ready!',
    langChanged:'Language → English', scanStarted:'Scan started', scanStopped:'Scan stopped',
  },
  fr: {
    title:'💙 BLE X-Ray', subtitle:'1600 sauts/sec Saut de frequence',
    disconnected:'Deconnecte', connected:'En scan',
    mainSection:'Cascade BLE 2.4 GHz', mainDesc:'Visualisez le saut de frequence BLE en temps reel',
    sectionA:'Histogramme d\'utilisation', sectionB:'Liste appareils BLE', sectionC:'Theorie saut de frequence BLE',
    startScan:'Demarrer scan', stop:'Arreter', hopSpeed:'Vitesse de saut:',
    theory1:'BLE utilise 40 canaux dans la bande ISM 2.4 GHz (2402-2480 MHz), chacun de 2 MHz. 37 canaux de donnees, 3 de publicite.',
    theory2:'Les appareils connectes sautent entre les canaux a 1600 sauts/seconde.',
    theory3:'Le saut de frequence adaptatif (AFH) permet d\'eviter les canaux perturbes par le WiFi.',
    theory4:'La cascade montre l\'activite des canaux au fil du temps.',
    faq_q1:'Qu\'est-ce que BLE X-Ray?', faq_a1:'Un visualiseur de saut de frequence BLE sur la bande 2.4 GHz.',
    faq_q2:'Pourquoi 1600 sauts/sec?', faq_a2:'La spec BLE definit 1600 changements de canal par seconde.',
    faq_q3:'Quels sont les canaux de publicite?', faq_a3:'Canaux 37, 38, 39 pour la decouverte.',
    splashHint:'appuyer pour passer', ready:'💙 BLE X-Ray pret!',
    langChanged:'Langue → Francais', scanStarted:'Scan demarre', scanStopped:'Scan arrete',
  },
  ar: {
    title:'💙 BLE X-Ray', subtitle:'1600 قفزة/ثانية تردد القفز',
    disconnected:'غير متصل', connected:'جارٍ المسح',
    mainSection:'شلال قنوات BLE 2.4 GHz', mainDesc:'شاهد قفز التردد BLE في الوقت الفعلي',
    sectionA:'مخطط استخدام القنوات', sectionB:'قائمة أجهزة BLE', sectionC:'نظرية قفز تردد BLE',
    startScan:'بدء المسح', stop:'إيقاف', hopSpeed:'سرعة القفز:',
    theory1:'يستخدم BLE 40 قناة في نطاق ISM 2.4 GHz. 37 قناة بيانات و3 قنوات إعلان.',
    theory2:'تقفز الأجهزة المتصلة بين القنوات بمعدل 1600 قفزة/ثانية.',
    theory3:'يتيح AFH تخطي القنوات المتداخلة مع WiFi.',
    theory4:'يعرض الشلال نشاط القنوات عبر الزمن.',
    faq_q1:'ما هو BLE X-Ray؟', faq_a1:'عارض قفز تردد BLE على نطاق 2.4 GHz.',
    faq_q2:'لماذا 1600 قفزة/ثانية؟', faq_a2:'تحدد مواصفات BLE 1600 تغيير قناة في الثانية.',
    faq_q3:'ما هي قنوات الإعلان؟', faq_a3:'القنوات 37، 38، 39 للاكتشاف.',
    splashHint:'انقر للتخطي', ready:'💙 BLE X-Ray جاهز!',
    langChanged:'اللغة ← العربية', scanStarted:'بدأ المسح', scanStopped:'توقف المسح',
  }
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

function setLanguage(lang){
  currentLang=lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(LANG[lang]?.[k])el.textContent=LANG[lang][k]});
  localStorage.setItem('ble-lang',lang);log(LANG[lang]?.langChanged||'Language changed','info');
}
function setTheme(name){
  document.documentElement.setAttribute('data-theme',name);
  if(LIGHT_THEMES.includes(name))document.documentElement.classList.add('light-theme');
  else document.documentElement.classList.remove('light-theme');
  localStorage.setItem('ble-theme',name);
}
function log(msg,type='info'){
  const c=$('logContainer');if(!c)return;const line=document.createElement('div');
  line.className='log-line log-'+type;line.innerHTML=`<span class="log-ts">${new Date().toLocaleTimeString()}</span><span class="log-badge">${type.toUpperCase()}</span> ${msg}`;
  c.appendChild(line);c.scrollTop=c.scrollHeight;
}
function showToast(msg,ms){const t=$('toastIndicator'),m=$('toastMessage');if(m)m.textContent=msg;if(t)t.classList.add('show');if(ms)setTimeout(()=>t?.classList.remove('show'),ms)}
function setStatus(on){const d=$('statusDot'),t=$('statusText');if(d)d.style.background=on?'#0f0':'#f44';if(t)t.textContent=LANG[currentLang]?.[on?'connected':'disconnected']||''}
function openPanel(id,oid){$(id)?.classList.add('open');if(oid)$(oid)?.classList.add('show')}
function closePanel(id,oid){$(id)?.classList.remove('open');if(oid)$(oid)?.classList.remove('show')}

/* ═══════ BLE SIMULATION ═══════ */
const NUM_CHANNELS = 40;
const ADV_CHANNELS = [37, 38, 39];
const DATA_CHANNELS = Array.from({length:37}, (_,i) => i);
let scanning = false, animFrame = null;
let hopCount = 0, pktCount = 0;
let currentChannel = 0;
let channelHist = new Uint32Array(NUM_CHANNELS);
let wfData = [];
const wfCanvas = $('waterfallCanvas');
const wfCtx = wfCanvas ? wfCanvas.getContext('2d') : null;

// Simulated BLE devices
const SIM_DEVICES = [
  {name:'iPhone-BLE', mac:'A4:83:E7:1F:22:01', rssi:-45, type:'Phone'},
  {name:'Galaxy-Watch', mac:'B8:27:EB:33:44:02', rssi:-62, type:'Wearable'},
  {name:'AirPods-Pro', mac:'DC:A6:32:55:66:03', rssi:-38, type:'Audio'},
  {name:'Fitbit-HR', mac:'E4:5F:01:77:88:04', rssi:-71, type:'Fitness'},
  {name:'Smart-Lock', mac:'00:1A:7D:99:AA:05', rssi:-55, type:'IoT'},
  {name:'BLE-Beacon', mac:'12:34:56:78:9A:06', rssi:-80, type:'Beacon'},
];

// Hopping algorithm (simplified)
let hopIncrement = 13; // prime, wraps around 37 data channels
function nextHop(){
  currentChannel = (currentChannel + hopIncrement) % 37;
  // Occasionally hit advertising channels
  if(Math.random() < 0.08) currentChannel = ADV_CHANNELS[Math.floor(Math.random()*3)];
  return currentChannel;
}

function initWaterfall(){
  if(!wfCtx) return;
  wfData = [];
  for(let i=0;i<wfCanvas.height;i++){
    const row = new Float32Array(NUM_CHANNELS);
    for(let j=0;j<NUM_CHANNELS;j++) row[j] = Math.random()*0.03;
    wfData.push(row);
  }
}

function addWaterfallLine(){
  const row = new Float32Array(NUM_CHANNELS);
  for(let j=0;j<NUM_CHANNELS;j++) row[j] = Math.random()*0.04; // noise floor

  // Add active hop
  const ch = nextHop();
  row[ch] = 0.7 + Math.random()*0.3;
  channelHist[ch]++;
  hopCount++;

  // Simulate other devices hopping too
  const numOther = Math.floor(Math.random()*3);
  for(let k=0;k<numOther;k++){
    const otherCh = Math.floor(Math.random()*37);
    row[otherCh] = Math.max(row[otherCh], 0.3 + Math.random()*0.4);
    channelHist[otherCh]++;
    pktCount++;
  }
  pktCount++;

  wfData.push(row);
  if(wfData.length > wfCanvas.height) wfData.shift();

  $('currentCh').textContent = ch;
  $('currentFreq').textContent = 2402 + ch * 2;
  $('hopCount').textContent = hopCount;
  $('pktCount').textContent = pktCount;
}

function drawWaterfall(){
  if(!wfCtx) return;
  const W = wfCanvas.width, H = wfCanvas.height;
  const img = wfCtx.createImageData(W, H);
  const colW = W / NUM_CHANNELS;

  for(let y=0; y<Math.min(wfData.length, H); y++){
    const row = wfData[y];
    for(let ch=0; ch<NUM_CHANNELS; ch++){
      const v = row[ch];
      const x0 = Math.floor(ch * colW);
      const x1 = Math.floor((ch+1) * colW);
      let r,g,b;
      if(v < 0.2){r=0;g=0;b=Math.floor(v*5*80)}
      else if(v < 0.5){r=0;g=Math.floor((v-.2)*3.3*200);b=255}
      else if(v < 0.8){r=Math.floor((v-.5)*3.3*255);g=200;b=Math.floor((1-(v-.5)*3.3)*255)}
      else{r=255;g=Math.floor((1-(v-.8)*5)*200);b=0}
      for(let x=x0;x<x1&&x<W;x++){
        const idx=(y*W+x)*4;
        img.data[idx]=r;img.data[idx+1]=g;img.data[idx+2]=b;img.data[idx+3]=255;
      }
    }
  }
  wfCtx.putImageData(img,0,0);

  // Channel labels
  wfCtx.fillStyle='rgba(255,255,255,.5)';wfCtx.font='9px Orbitron,monospace';
  for(let ch=0;ch<NUM_CHANNELS;ch+=5){
    wfCtx.fillText(ch+'', ch*colW+2, 10);
  }
  // Advertising channel markers
  wfCtx.fillStyle='rgba(255,0,0,.6)';
  ADV_CHANNELS.forEach(ch=>{
    const x=ch*colW;wfCtx.fillRect(x,0,colW,2);
  });
}

function drawHistogram(){
  const canvas=$('histCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  const max=Math.max(1,...channelHist);
  const bw=W/NUM_CHANNELS;
  for(let ch=0;ch<NUM_CHANNELS;ch++){
    const h=(channelHist[ch]/max)*(H-30);
    const isAdv = ADV_CHANNELS.includes(ch);
    ctx.fillStyle=isAdv?'#f44':'#0af';
    ctx.fillRect(ch*bw+1, H-20-h, bw-2, h);
  }
  ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='9px monospace';
  for(let ch=0;ch<NUM_CHANNELS;ch+=5) ctx.fillText(ch+'', ch*bw+2, H-6);
  ctx.fillText('ADV',37*bw-10,H-6);
}

function renderDevices(){
  const el=$('deviceList');if(!el)return;
  el.innerHTML = SIM_DEVICES.map(d=>{
    const rssi = d.rssi + Math.floor(Math.random()*6-3);
    const bars = rssi > -50 ? '████' : rssi > -65 ? '███░' : rssi > -75 ? '██░░' : '█░░░';
    return `<div style="padding:4px 0;border-bottom:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between"><span style="color:#0af">${d.name}</span><span style="opacity:.6">${d.mac}</span><span>${bars} ${rssi}dBm</span><span style="color:var(--accent)">${d.type}</span></div>`;
  }).join('');
}

let speedMult = 4;
function animate(){
  if(!scanning) return;
  for(let i=0;i<speedMult;i++) addWaterfallLine();
  drawWaterfall();
  if(hopCount % 50 === 0) drawHistogram();
  if(hopCount % 100 === 0) renderDevices();
  animFrame = requestAnimationFrame(animate);
}

function startScan(){
  if(scanning) return;
  scanning = true;
  setStatus(true);
  log(LANG[currentLang]?.scanStarted||'Scan started','success');
  playSound('click');
  animate();
}

function stopScan(){
  scanning = false;
  if(animFrame) cancelAnimationFrame(animFrame);
  setStatus(false);
  log(LANG[currentLang]?.scanStopped||'Scan stopped','info');
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  const savedLang=localStorage.getItem('ble-lang')||'en';
  const savedTheme=localStorage.getItem('ble-theme')||'mosque-gold';
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

  document.querySelectorAll('.help-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));
      tab.classList.add('active');
      ({faq:'helpFaq',howto:'helpHowto',wiki:'helpWiki'})[tab.dataset.tab]&&$( ({faq:'helpFaq',howto:'helpHowto',wiki:'helpWiki'})[tab.dataset.tab])?.classList.add('active');
    });
  });

  document.querySelectorAll('.log-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');const f=btn.dataset.filter;
      document.querySelectorAll('.log-line').forEach(l=>{l.style.display=(f==='all'||l.classList.contains('log-'+f))?'':'none'});
    });
  });

  $('startBtn')?.addEventListener('click', startScan);
  $('stopBtn')?.addEventListener('click', stopScan);
  $('hopSpeed')?.addEventListener('change',e=>{speedMult=parseInt(e.target.value)});

  initWaterfall();drawWaterfall();drawHistogram();renderDevices();
  setStatus(false);
  log(LANG[currentLang]?.ready||'Ready','success');
});

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — BLE X-Ray: 2.4GHz frequency hopping
   waterfall with channel activity, adaptive hopping, and
   advertising channel highlights
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simBleCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const channels=40,channelW=0,hopHistory=[];
  let currentCh=0,hopTimer=0,advTimer=0;
  const ADV_CHANNELS=[37,38,39];

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:300px;border-radius:12px;margin:1.2rem 0;display:block;background:#080818;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  function drawChannelGrid(){
    const cw=W/channels;
    ctx.font='7px monospace';ctx.textAlign='center';
    for(let i=0;i<channels;i++){
      const x=i*cw;
      const isAdv=ADV_CHANNELS.includes(i);
      ctx.strokeStyle=isAdv?'rgba(255,100,100,0.15)':'rgba(100,100,255,0.06)';
      ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H-20);ctx.stroke();
      ctx.fillStyle=isAdv?'#ff6b6b':'rgba(100,150,255,0.3)';
      ctx.fillText(i,x+cw/2,H-6);
    }
  }

  function drawWaterfall(){
    const cw=W/channels;const rowH=3;
    // Shift existing content down
    if(frameCount>1){
      const imgData=ctx.getImageData(0,0,canvas.width,(H-20)*(devicePixelRatio||1));
      ctx.putImageData(imgData,0,rowH*(devicePixelRatio||1));
    }
    // Draw new row at top
    ctx.fillStyle='rgba(8,8,24,0.95)';ctx.fillRect(0,0,W,rowH);
    // Active channel
    const x=currentCh*cw;
    const isAdv=ADV_CHANNELS.includes(currentCh);
    const intensity=0.5+Math.random()*0.5;
    ctx.fillStyle=isAdv?'rgba(255,100,100,'+intensity+')':'rgba(0,180,255,'+intensity+')';
    ctx.fillRect(x,0,cw,rowH);
    // Noise on random channels
    for(let i=0;i<3;i++){
      const nc=Math.floor(Math.random()*channels);
      ctx.fillStyle='rgba(50,100,50,'+(Math.random()*0.15)+')';
      ctx.fillRect(nc*cw,0,cw,rowH);
    }
    // WiFi interference band (channels 1-14 overlap)
    if(Math.random()<0.1){
      const wifiStart=Math.floor(Math.random()*10);
      ctx.fillStyle='rgba(255,200,0,0.06)';
      ctx.fillRect(wifiStart*cw,0,cw*5,rowH);
    }
  }

  function drawCurrentHop(){
    const cw=W/channels,x=currentCh*cw+cw/2;
    ctx.save();ctx.shadowColor='#0cf';ctx.shadowBlur=10;
    ctx.beginPath();ctx.arc(x,8,4,0,Math.PI*2);ctx.fillStyle='#0cf';ctx.fill();ctx.restore();
    ctx.font='8px monospace';ctx.fillStyle='#0cf';ctx.textAlign='center';ctx.fillText('CH '+currentCh,x,22);
  }

  function drawFreqLabel(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(W/2-80,H-38,160,16);
    ctx.font='9px monospace';ctx.fillStyle='#aaa';ctx.textAlign='center';
    const freq=2402+currentCh*2;ctx.fillText('2.4 GHz ISM Band \u2014 '+freq+' MHz',W/2,H-28);ctx.restore();
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,170,56);ctx.strokeStyle='#0cf3';ctx.strokeRect(8,8,170,56);
    ctx.font='10px monospace';ctx.fillStyle='#0cf';ctx.textAlign='left';ctx.fillText('\u{1F499} BLE X-RAY',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Channel: '+currentCh+'  Freq: '+(2402+currentCh*2)+' MHz',16,40);
    ctx.fillText('Hops: '+frameCount+'  1600 hop/s',16,54);ctx.restore();
  }

  function hop(){
    // Adaptive frequency hopping — skip some channels
    const blocked=new Set();
    for(let i=0;i<5;i++)blocked.add(Math.floor(Math.random()*37));
    let next;
    if(Math.random()<0.15){next=ADV_CHANNELS[Math.floor(Math.random()*3)];}
    else{do{next=Math.floor(Math.random()*37);}while(blocked.has(next));}
    currentCh=next;
    hopHistory.push(currentCh);if(hopHistory.length>100)hopHistory.shift();
  }

  function init(){ensureCanvas();animate();}
  function animate(){
    frameCount++;hopTimer++;
    if(hopTimer>=2){hopTimer=0;hop();}
    drawWaterfall();drawChannelGrid();drawCurrentHop();drawFreqLabel();drawHUD();
    animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,300);
})();
