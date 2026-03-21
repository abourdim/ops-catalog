/**
 * Collision Visualizer — Workshop DIY v1.2
 * 2.4GHz signal collision and BER simulator
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let soundEnabled = false, currentLang = 'en';
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.06;const n=audioCtx.currentTime;o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.1)}

const LANG = {
  en:{title:'💥 Collision Visualizer',subtitle:'2.4GHz Signal Collision',disconnected:'Idle',connected:'Simulating',mainSection:'Dual TX Collision Zone',mainDesc:'Two transmitters, one frequency — watch bits collide',sectionA:'BER Over Time',sectionB:'Collision Analysis',sectionC:'Collision Theory',startSim:'Start Simulation',stop:'Stop',theory1:'When two transmitters broadcast on the same frequency simultaneously, their signals overlap and interfere, causing bit errors.',theory2:'The Bit Error Rate (BER) depends on relative power. Equal power causes maximum interference.',theory3:'CSMA/CA (WiFi) and frequency hopping (BLE) minimize collisions but cannot eliminate them in the 2.4 GHz band.',theory4:'The simulation shows how power difference between TX1 and TX2 affects BER — stronger signals dominate (capture effect).',splashHint:'tap to skip',ready:'💥 Collision Visualizer ready!',langChanged:'Language → English',simStarted:'Collision simulation started',simStopped:'Simulation stopped'},
  fr:{title:'💥 Visualiseur de Collision',subtitle:'Collision de signaux 2.4GHz',disconnected:'Inactif',connected:'Simulation',mainSection:'Zone de collision double TX',mainDesc:'Deux emetteurs, une frequence — observez les collisions',sectionA:'BER au fil du temps',sectionB:'Analyse des collisions',sectionC:'Theorie des collisions',startSim:'Demarrer simulation',stop:'Arreter',theory1:'Quand deux emetteurs transmettent sur la meme frequence, leurs signaux interferent, causant des erreurs de bits.',theory2:'Le taux d\'erreur binaire depend de la puissance relative. Puissance egale = interference maximale.',theory3:'CSMA/CA et le saut de frequence minimisent les collisions mais ne les eliminent pas.',theory4:'La simulation montre comment la difference de puissance affecte le BER — effet de capture.',splashHint:'appuyer pour passer',ready:'💥 Visualiseur pret!',langChanged:'Langue → Francais',simStarted:'Simulation demarree',simStopped:'Simulation arretee'},
  ar:{title:'💥 عارض التصادم',subtitle:'تصادم إشارات 2.4GHz',disconnected:'خامل',connected:'محاكاة',mainSection:'منطقة تصادم TX مزدوج',mainDesc:'مرسلان، تردد واحد — شاهد تصادم البتات',sectionA:'BER عبر الزمن',sectionB:'تحليل التصادم',sectionC:'نظرية التصادم',startSim:'بدء المحاكاة',stop:'إيقاف',theory1:'عندما يبث مرسلان على نفس التردد، تتداخل إشاراتهما مسببة أخطاء في البتات.',theory2:'يعتمد معدل خطأ البت على القوة النسبية. القوة المتساوية تسبب أقصى تداخل.',theory3:'CSMA/CA وقفز التردد يقللان التصادمات لكن لا يمنعانها.',theory4:'تُظهر المحاكاة كيف يؤثر فرق القوة بين TX1 وTX2 على BER.',splashHint:'انقر للتخطي',ready:'💥 عارض التصادم جاهز!',langChanged:'اللغة ← العربية',simStarted:'بدأت المحاكاة',simStopped:'توقفت المحاكاة'}
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
function setLanguage(lang){currentLang=lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(LANG[lang]?.[k])el.textContent=LANG[lang][k]});localStorage.setItem('collision-lang',lang);log(LANG[lang]?.langChanged||'Lang','info')}
function setTheme(name){document.documentElement.setAttribute('data-theme',name);if(LIGHT_THEMES.includes(name))document.documentElement.classList.add('light-theme');else document.documentElement.classList.remove('light-theme');localStorage.setItem('collision-theme',name)}
function log(msg,type='info'){const c=$('logContainer');if(!c)return;const line=document.createElement('div');line.className='log-line log-'+type;line.innerHTML=`<span class="log-ts">${new Date().toLocaleTimeString()}</span><span class="log-badge">${type.toUpperCase()}</span> ${msg}`;c.appendChild(line);c.scrollTop=c.scrollHeight}
function showToast(msg,ms){const t=$('toastIndicator'),m=$('toastMessage');if(m)m.textContent=msg;if(t)t.classList.add('show');if(ms)setTimeout(()=>t?.classList.remove('show'),ms)}
function setStatus(on){const d=$('statusDot'),t=$('statusText');if(d)d.style.background=on?'#0f0':'#f44';if(t)t.textContent=LANG[currentLang]?.[on?'connected':'disconnected']||''}
function openPanel(id,oid){$(id)?.classList.add('open');if(oid)$(oid)?.classList.add('show')}
function closePanel(id,oid){$(id)?.classList.remove('open');if(oid)$(oid)?.classList.remove('show')}

/* ═══════ COLLISION SIMULATION ═══════ */
let simulating = false, animFrame = null;
let totalBits = 0, errorBits = 0, collisionCount = 0;
let berHistory = [];
let bitBuffer = [];
const canvas = $('collisionCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

function calcBER(p1, p2){
  // BER based on SIR (signal to interference ratio)
  const sir = Math.abs(p1 - p2); // dB difference
  if(sir > 10) return 0.001; // capture effect — almost no errors
  if(sir > 6) return 0.01;
  if(sir > 3) return 0.05;
  return 0.15 + (1 - sir/3) * 0.2; // equal power = ~35% BER max
}

function generateBits(count, ber){
  const bits = [];
  for(let i = 0; i < count; i++){
    const sent = Math.random() < 0.5 ? 1 : 0;
    const error = Math.random() < ber;
    bits.push({sent, received: error ? (1 - sent) : sent, error});
    totalBits++;
    if(error){errorBits++;collisionCount++}
  }
  return bits;
}

function drawCollision(){
  if(!ctx) return;
  const W = canvas.width, H = canvas.height;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  const p1 = parseInt($('tx1Power')?.value || 10);
  const p2 = parseInt($('tx2Power')?.value || 10);
  const t = Date.now() / 1000;

  // Draw TX1 signal (blue, from left)
  ctx.strokeStyle = '#3ba5f7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for(let x = 0; x < W; x++){
    const amp = (p1 / 20) * (H / 4);
    const decay = Math.max(0, 1 - x / (W * 0.7));
    const y = H / 2 + Math.sin(x * 0.05 + t * 3) * amp * decay;
    if(x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Draw TX2 signal (orange, from right)
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for(let x = 0; x < W; x++){
    const amp = (p2 / 20) * (H / 4);
    const decay = Math.max(0, 1 - (W - x) / (W * 0.7));
    const y = H / 2 + Math.sin(x * 0.06 + t * 2.5 + 1.5) * amp * decay;
    if(x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Collision zone (red overlay in the middle)
  const overlapStart = W * 0.25, overlapEnd = W * 0.75;
  const ber = calcBER(p1, p2);
  const alpha = Math.min(0.4, ber * 1.5);
  ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
  ctx.fillRect(overlapStart, 0, overlapEnd - overlapStart, H);

  // Labels
  ctx.fillStyle = '#3ba5f7';
  ctx.font = '12px Orbitron,monospace';
  ctx.fillText(`TX1: ${p1}dBm`, 10, 18);
  ctx.fillStyle = '#f97316';
  ctx.fillText(`TX2: ${p2}dBm`, W - 100, 18);
  ctx.fillStyle = '#f44';
  ctx.fillText('COLLISION ZONE', W / 2 - 60, 18);
}

function updateBitStream(){
  const p1 = parseInt($('tx1Power')?.value || 10);
  const p2 = parseInt($('tx2Power')?.value || 10);
  const ber = calcBER(p1, p2);
  const newBits = generateBits(16, ber);
  bitBuffer.push(...newBits);
  if(bitBuffer.length > 512) bitBuffer = bitBuffer.slice(-512);

  // Render bit stream
  const el = $('bitStream');
  if(el){
    el.innerHTML = bitBuffer.map(b =>
      `<span class="${b.error ? 'bit-err' : 'bit-ok'}">${b.received}</span>`
    ).join('');
    el.scrollTop = el.scrollHeight;
  }

  // Update stats
  const currentBER = totalBits > 0 ? (errorBits / totalBits * 100) : 0;
  $('berVal').textContent = currentBER.toFixed(2) + '%';
  $('collisions').textContent = collisionCount;
  $('goodBits').textContent = totalBits - errorBits;
  $('totalBits').textContent = totalBits;

  berHistory.push(currentBER);
  if(berHistory.length > 200) berHistory.shift();
}

function drawBERChart(){
  const c = $('berCanvas');
  if(!c) return;
  const cx = c.getContext('2d'), W = c.width, H = c.height;
  cx.fillStyle = '#000';
  cx.fillRect(0, 0, W, H);
  if(berHistory.length < 2) return;
  const max = Math.max(1, ...berHistory);
  cx.strokeStyle = '#f44';
  cx.lineWidth = 2;
  cx.beginPath();
  berHistory.forEach((v, i) => {
    const x = i / (berHistory.length - 1) * W;
    const y = H - 10 - (v / max) * (H - 20);
    if(i === 0) cx.moveTo(x, y); else cx.lineTo(x, y);
  });
  cx.stroke();
  cx.fillStyle = 'rgba(255,255,255,.4)';
  cx.font = '10px monospace';
  cx.fillText('BER %', 4, 14);
  cx.fillText(max.toFixed(1) + '%', 4, 28);
}

function updateAnalysis(){
  const el = $('analysisPanel');
  if(!el) return;
  const p1 = parseInt($('tx1Power')?.value || 10);
  const p2 = parseInt($('tx2Power')?.value || 10);
  const sir = Math.abs(p1 - p2);
  const ber = calcBER(p1, p2);
  const capture = sir > 6;
  el.innerHTML = `<div>TX1 Power: <strong>${p1} dBm</strong></div><div>TX2 Power: <strong>${p2} dBm</strong></div><div>Power Difference (SIR): <strong>${sir} dB</strong></div><div>Instantaneous BER: <strong style="color:${ber>.1?'#f44':ber>.01?'#f90':'#0f0'}">${(ber*100).toFixed(2)}%</strong></div><div>Capture Effect: <strong style="color:${capture?'#0f0':'#f44'}">${capture?'YES — stronger signal dominates':'NO — heavy interference'}</strong></div><hr style="border-color:rgba(255,255,255,.1);margin:8px 0"><div>Total bits: ${totalBits} | Errors: ${errorBits} | Good: ${totalBits-errorBits}</div><div>${sir < 3 ? 'Both signals at similar power — maximum collision damage!' : sir < 6 ? 'Partial capture — significant errors remain' : 'Strong capture effect — weaker signal suppressed'}</div>`;
}

function animate(){
  if(!simulating) return;
  drawCollision();
  updateBitStream();
  if(totalBits % 100 < 20) drawBERChart();
  if(totalBits % 50 < 20) updateAnalysis();
  animFrame = requestAnimationFrame(animate);
}

function startSim(){
  if(simulating) return;
  simulating = true;
  totalBits = 0; errorBits = 0; collisionCount = 0;
  berHistory = []; bitBuffer = [];
  setStatus(true); playSound('click');
  log(LANG[currentLang]?.simStarted || 'Simulation started', 'success');
  animate();
}
function stopSim(){
  simulating = false;
  if(animFrame) cancelAnimationFrame(animFrame);
  setStatus(false);
  log(LANG[currentLang]?.simStopped || 'Simulation stopped', 'info');
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('collision-lang') || 'en';
  const savedTheme = localStorage.getItem('collision-theme') || 'mosque-gold';
  if($('langSelect')) $('langSelect').value = savedLang;
  if($('themeSelect')) $('themeSelect').value = savedTheme;
  setLanguage(savedLang); setTheme(savedTheme);

  $('helpBtn')?.addEventListener('click', () => openPanel('helpPanel', 'helpOverlay'));
  $('helpCloseBtn')?.addEventListener('click', () => closePanel('helpPanel', 'helpOverlay'));
  $('helpOverlay')?.addEventListener('click', () => closePanel('helpPanel', 'helpOverlay'));
  $('settingsBtn')?.addEventListener('click', () => openPanel('settingsPanel', 'settingsOverlay'));
  $('settingsCloseBtn')?.addEventListener('click', () => closePanel('settingsPanel', 'settingsOverlay'));
  $('settingsOverlay')?.addEventListener('click', () => closePanel('settingsPanel', 'settingsOverlay'));
  $('logBtn')?.addEventListener('click', () => $('logPanel')?.classList.toggle('open'));
  $('logCloseBtn')?.addEventListener('click', () => $('logPanel')?.classList.remove('open'));
  $('langSelect')?.addEventListener('change', e => setLanguage(e.target.value));
  $('themeSelect')?.addEventListener('change', e => setTheme(e.target.value));
  $('soundToggle')?.addEventListener('change', e => { soundEnabled = e.target.checked });
  $('clearLogBtn')?.addEventListener('click', () => { $('logContainer').innerHTML = ''; log('Log cleared', 'info') });
  $('copyLogBtn')?.addEventListener('click', () => { navigator.clipboard.writeText($('logContainer')?.innerText || '').then(() => showToast('Copied!', 1500)) });

  $('tx1Power')?.addEventListener('input', e => { $('tx1Val').textContent = e.target.value });
  $('tx2Power')?.addEventListener('input', e => { $('tx2Val').textContent = e.target.value });

  document.querySelectorAll('.help-tab').forEach(tab => { tab.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); $({faq:'helpFaq',howto:'helpHowto',wiki:'helpWiki'}[tab.dataset.tab])?.classList.add('active') }) });
  document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); const f = btn.dataset.filter; document.querySelectorAll('.log-line').forEach(l => { l.style.display = (f === 'all' || l.classList.contains('log-' + f)) ? '' : 'none' }) }) });

  $('simBtn')?.addEventListener('click', startSim);
  $('stopBtn')?.addEventListener('click', stopSim);

  setStatus(false);
  log(LANG[currentLang]?.ready || 'Ready', 'success');
});

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Collision Visualizer: Dual transmitter
   signal collision zone with BER visualization and capture effect
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCollCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const waves1=[],waves2=[],sparks=[];
  let ber=0,totalBitsVis=0,errorBitsVis=0;
  const tx1={x:0,y:0,power:0.7,freq:2.44};
  const tx2={x:0,y:0,power:0.5,freq:2.44};

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:300px;border-radius:12px;margin:1.2rem 0;display:block;background:#0a0810;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
    tx1.x=W*0.2;tx1.y=H/2;tx2.x=W*0.8;tx2.y=H/2;
  }

  class Wave{
    constructor(x,y,color){this.x=x;this.y=y;this.r=0;this.maxR=Math.min(W,H)*0.6;this.alpha=0.5;this.color=color;}
    update(){this.r+=2;this.alpha=0.5*(1-this.r/this.maxR);return this.r<this.maxR;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.strokeStyle=this.color.replace('1)',this.alpha+')');ctx.lineWidth=2;ctx.stroke();}
  }

  class Spark{
    constructor(x,y){this.x=x;this.y=y;this.vx=(Math.random()-0.5)*5;this.vy=(Math.random()-0.5)*5;this.life=1;this.size=2+Math.random()*2;}
    update(){this.x+=this.vx;this.y+=this.vy;this.vx*=0.95;this.vy*=0.95;this.life-=0.03;return this.life>0;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.size*this.life,0,Math.PI*2);ctx.fillStyle='rgba(255,200,50,'+this.life+')';ctx.fill();}
  }

  function drawTX(tx,label,color){
    ctx.save();ctx.shadowColor=color;ctx.shadowBlur=8;
    ctx.beginPath();ctx.arc(tx.x,tx.y,18,0,Math.PI*2);ctx.fillStyle=color.replace('1)','0.2)');ctx.fill();
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u{1F4E1}',tx.x,tx.y);
    ctx.font='8px monospace';ctx.fillStyle=color;ctx.fillText(label,tx.x,tx.y+26);
    // Power bar
    ctx.fillStyle='#222';ctx.fillRect(tx.x-20,tx.y+32,40,5);
    ctx.fillStyle=color;ctx.fillRect(tx.x-20,tx.y+32,40*tx.power,5);
    ctx.font='7px monospace';ctx.fillStyle='#888';ctx.fillText(Math.floor(tx.power*100)+'%',tx.x,tx.y+46);
    ctx.restore();
  }

  function drawCollisionZone(){
    const cx=W/2,cy=H/2;
    // Interference pattern
    const berLevel=Math.min(1,ber);
    ctx.save();ctx.globalAlpha=0.2+berLevel*0.3;
    const grad=ctx.createRadialGradient(cx,cy,10,cx,cy,80);
    grad.addColorStop(0,'rgba(255,100,50,'+(berLevel*0.5)+')');
    grad.addColorStop(1,'rgba(255,100,50,0)');
    ctx.fillStyle=grad;ctx.fillRect(cx-80,cy-80,160,160);ctx.restore();
    // Collision label
    if(berLevel>0.1){
      ctx.font='bold 10px monospace';ctx.fillStyle='rgba(255,200,50,'+(0.5+Math.sin(frameCount*0.1)*0.3)+')';
      ctx.textAlign='center';ctx.fillText('\u{1F4A5} COLLISION ZONE',cx,cy-40);
    }
  }

  function drawSignalWaveform(){
    const y1=H*0.15,y2=H*0.85,ww=W*0.6,sx=(W-ww)/2;
    // TX1 waveform
    ctx.beginPath();ctx.moveTo(sx,y1);
    for(let x=0;x<ww;x++){const v=Math.sin((x+frameCount*3)*0.05)*tx1.power*20;ctx.lineTo(sx+x,y1+v);}
    ctx.strokeStyle='rgba(255,100,100,0.4)';ctx.lineWidth=1;ctx.stroke();
    // TX2 waveform
    ctx.beginPath();ctx.moveTo(sx,y2);
    for(let x=0;x<ww;x++){const v=Math.sin((x+frameCount*3)*0.05+1)*tx2.power*20;ctx.lineTo(sx+x,y2+v);}
    ctx.strokeStyle='rgba(100,100,255,0.4)';ctx.lineWidth=1;ctx.stroke();
    // Combined (center)
    ctx.beginPath();ctx.moveTo(sx,H/2);
    for(let x=0;x<ww;x++){const v1=Math.sin((x+frameCount*3)*0.05)*tx1.power*15;const v2=Math.sin((x+frameCount*3)*0.05+1)*tx2.power*15;ctx.lineTo(sx+x,H/2+v1+v2);}
    ctx.strokeStyle='rgba(255,200,100,0.3)';ctx.lineWidth=1;ctx.stroke();
  }

  function drawBERMeter(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(W/2-80,H-30,160,22);
    ctx.strokeStyle='#fff2';ctx.strokeRect(W/2-80,H-30,160,22);
    const g=ctx.createLinearGradient(W/2-80,0,W/2+80,0);g.addColorStop(0,'#6bcb77');g.addColorStop(0.5,'#ffd93d');g.addColorStop(1,'#ff4444');
    ctx.fillStyle='#222';ctx.fillRect(W/2-75,H-26,150,14);ctx.fillStyle=g;ctx.fillRect(W/2-75,H-26,150*Math.min(1,ber),14);
    ctx.font='8px monospace';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('BER: '+(ber*100).toFixed(1)+'%',W/2,H-16);ctx.restore();
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,185,56);ctx.strokeStyle='#f903';ctx.strokeRect(8,8,185,56);
    ctx.font='10px monospace';ctx.fillStyle='#ff9944';ctx.textAlign='left';ctx.fillText('\u{1F4A5} COLLISION VISUALIZER',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Bits: '+totalBitsVis+'  Errors: '+errorBitsVis,16,40);
    ctx.fillText('BER: '+(ber*100).toFixed(2)+'%',16,54);ctx.restore();
  }

  function init(){ensureCanvas();animate();}
  function animate(){
    frameCount++;ctx.fillStyle='rgba(10,8,16,0.14)';ctx.fillRect(0,0,W,H);
    // Slowly vary power
    tx1.power=0.5+Math.sin(frameCount*0.005)*0.3;tx2.power=0.5+Math.cos(frameCount*0.007)*0.3;
    // BER calculation based on power difference
    const diff=Math.abs(tx1.power-tx2.power);ber=Math.max(0.01,0.5-diff*1.5);
    totalBitsVis+=10;errorBitsVis+=Math.round(ber*10);
    // Waves
    if(frameCount%12===0){waves1.push(new Wave(tx1.x,tx1.y,'rgba(255,100,100,1)'));waves2.push(new Wave(tx2.x,tx2.y,'rgba(100,100,255,1)'));}
    for(let i=waves1.length-1;i>=0;i--){if(!waves1[i].update())waves1.splice(i,1);else waves1[i].draw();}
    for(let i=waves2.length-1;i>=0;i--){if(!waves2[i].update())waves2.splice(i,1);else waves2[i].draw();}
    drawCollisionZone();drawSignalWaveform();
    // Collision sparks
    if(ber>0.2&&frameCount%4===0){for(let i=0;i<2;i++)sparks.push(new Spark(W/2+(Math.random()-0.5)*40,H/2+(Math.random()-0.5)*40));}
    for(let i=sparks.length-1;i>=0;i--){if(!sparks[i].update())sparks.splice(i,1);else sparks[i].draw();}
    drawTX(tx1,'TX1','rgba(255,100,100,1)');drawTX(tx2,'TX2','rgba(100,100,255,1)');
    drawBERMeter();drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,300);
})();
