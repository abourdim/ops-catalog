/**
 * Known Plaintext Attack — Workshop DIY v1.0
 * XOR known plaintext with ciphertext to recover key stream
 */
const $=id=>document.getElementById(id);const LANG={en:{title:'Known Plaintext Attack',subtitle:'Recover encryption keys using known pairs',mainSection:'KPA Key Recovery',mainDesc:'XOR known plaintext with ciphertext to recover key stream',ready:'Ready',langChanged:'Language -> English',themeChanged:'Theme ->',recovered:'Key stream recovered!',faq_q1:'What is a known-plaintext attack?',faq_a1:'When the attacker has both plaintext and its ciphertext, they can XOR them to extract the key or key stream.',faq_q2:'Which ciphers are vulnerable?',faq_a2:'Stream ciphers and XOR-based ciphers. Block ciphers in proper modes (CBC with IV) resist this.',faq_q3:'Why does XOR work?',faq_a3:'If C = P XOR K, then K = C XOR P. XOR is its own inverse.',howto_1:'Enter the known plaintext.',howto_2:'Click Encrypt to see the ciphertext.',howto_3:'Click Recover Key to XOR plaintext with ciphertext.',howto_4:'Use the recovered key to decrypt unknown messages.',wiki_xor:'XOR cipher: C = P XOR K. Simplest stream cipher.',wiki_stream:'Stream ciphers generate a pseudo-random key stream. If any plaintext-ciphertext pair is known, the key stream is revealed.',wiki_defense:'Defense: never reuse key streams (nonces), use authenticated encryption (AES-GCM).',mathExplain:'Known Plaintext Attack on XOR Cipher:\n\nEncryption: C = P XOR K\nGiven: P (known plaintext), C (ciphertext)\nRecover: K = C XOR P\n\nDecrypt any message: P2 = C2 XOR K\n\nFor repeating-key XOR:\nC[i] = P[i] XOR K[i mod keylen]\nK[i mod keylen] = C[i] XOR P[i]'},
fr:{title:'Attaque Texte Clair Connu',subtitle:'Recuperez les cles avec des paires connues',mainSection:'Recuperation de Cle',mainDesc:'XOR du texte connu avec le chiffre',ready:'Pret',langChanged:'Langue -> Francais',themeChanged:'Theme ->',recovered:'Flux de cle recupere!',faq_q1:'Attaque texte clair connu?',faq_a1:'Avec le texte clair et le chiffre, XOR extrait la cle.',faq_q2:'Quels chiffrements?',faq_a2:'Chiffrements par flux et XOR.',faq_q3:'Pourquoi XOR?',faq_a3:'Si C=P XOR K, alors K=C XOR P.',howto_1:'Entrez le texte connu.',howto_2:'Cliquez Chiffrer.',howto_3:'Cliquez Recuperer.',howto_4:'Dechiffrez d\'autres messages.',wiki_xor:'XOR: C = P XOR K.',wiki_stream:'Les chiffrements par flux generent un flux pseudo-aleatoire.',wiki_defense:'Defense: ne jamais reutiliser les flux de cles.',mathExplain:'C = P XOR K\nK = C XOR P'},
ar:{title:'هجوم النص المعروف',subtitle:'استرجع مفاتيح التشفير باستخدام أزواج معروفة',mainSection:'استرجاع المفتاح',mainDesc:'XOR النص المعروف مع المشفر لاسترجاع تيار المفتاح',ready:'جاهز',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',recovered:'تم استرجاع تيار المفتاح!',faq_q1:'ما هو هجوم النص المعروف؟',faq_a1:'عندما يملك المهاجم النص الأصلي والمشفر، يمكنه استخراج المفتاح بـ XOR.',faq_q2:'أي تشفيرات معرضة؟',faq_a2:'تشفير التدفق و XOR.',faq_q3:'لماذا XOR؟',faq_a3:'إذا C=P XOR K، فإن K=C XOR P.',howto_1:'أدخل النص المعروف.',howto_2:'اضغط تشفير.',howto_3:'اضغط استرجاع.',howto_4:'فك تشفير رسائل أخرى.',wiki_xor:'XOR: C = P XOR K.',wiki_stream:'تشفير التدفق يولد تيارا شبه عشوائي.',wiki_defense:'الدفاع: لا تعد استخدام تيارات المفاتيح.',mathExplain:'C = P XOR K\nK = C XOR P'}};

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


let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;if($('langSelect'))$('langSelect').value=l;try{localStorage.setItem('cry-kpa-lang',l)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));if($('themeSelect'))$('themeSelect').value=n;try{localStorage.setItem('cry-kpa-theme',n)}catch{}}
let soundEnabled=false;function playSound(t){if(!soundEnabled)return;const a=new(window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);g.gain.value=.08;o.frequency.value=t==='success'?523:200;g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.2);o.start();o.stop(a.currentTime+.2)}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success')}
function showToast(m){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(p,o){p.classList.toggle('open');if(o)o.classList.toggle('active',p.classList.contains('open'))}
/* ═══════ XOR CIPHER ═══════ */
let secretKey='SECRETKEY',ptBytes=[],ctBytes=[],keyBytes=[],recoveredKey=[];
function xorEncrypt(pt,key){return pt.map((b,i)=>b^key.charCodeAt(i%key.length))}
function doEncrypt(){const pt=$('ptInput').value;ptBytes=Array.from(pt).map(c=>c.charCodeAt(0));ctBytes=xorEncrypt(ptBytes,secretKey);keyBytes=Array.from(secretKey).map(c=>c.charCodeAt(0));recoveredKey=[];
  $('resultsBox').textContent=`Plaintext:  "${pt}"\nCiphertext: [${ctBytes.map(b=>b.toString(16).padStart(2,'0')).join(' ')}]\n(Key is hidden from attacker)`;log('Encrypted with secret key','success');drawCanvas()}
function recoverKey(){if(ctBytes.length===0){doEncrypt()}recoveredKey=ctBytes.map((c,i)=>c^ptBytes[i]);
  const keyStr=recoveredKey.map(b=>String.fromCharCode(b)).join('');const s=LANG[currentLang];
  $('resultsBox').textContent+=`\n\n--- KEY RECOVERY ---\nRecovered key bytes: [${recoveredKey.map(b=>b.toString(16).padStart(2,'0')).join(' ')}]\nRecovered key: "${keyStr}"\nActual key:    "${secretKey}"\nMatch: ${keyStr.slice(0,secretKey.length)===secretKey?'YES':'PARTIAL'}`;
  log(s.recovered,'success');drawCanvas()}
function decryptUnknown(){if(recoveredKey.length===0){recoverKey()}const ct2=$('unknownInput').value.split(' ').map(h=>parseInt(h,16)).filter(n=>!isNaN(n));
  if(ct2.length===0){log('Enter hex ciphertext','error');return}
  const pt2=ct2.map((c,i)=>String.fromCharCode(c^recoveredKey[i%recoveredKey.length])).join('');
  $('resultsBox').textContent+=`\n\nDecrypted unknown: "${pt2}"`;log(`Decrypted: "${pt2}"`,'success');drawCanvas()}
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawCanvas(){if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;const accent=getCS('--accent'),muted=getCS('--text-muted');ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText('Known Plaintext XOR Attack',10,22);
  if(ptBytes.length===0)return;const cellW=Math.min(40,(w-20)/ptBytes.length),rowH=45,startY=50;
  // Plaintext row
  ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Known Plaintext (P)',10,startY-4);
  ptBytes.forEach((b,i)=>{ctx.fillStyle='#4ade8033';ctx.fillRect(10+i*cellW,startY,cellW-2,rowH-5);ctx.fillStyle='#4ade80';ctx.font='9px monospace';ctx.fillText(String.fromCharCode(b),14+i*cellW,startY+15);ctx.fillText(b.toString(16).padStart(2,'0'),14+i*cellW,startY+30)});
  // Ciphertext row
  const ctY=startY+rowH+10;ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Ciphertext (C)',10,ctY-4);
  ctBytes.forEach((b,i)=>{ctx.fillStyle=`${accent}33`;ctx.fillRect(10+i*cellW,ctY,cellW-2,rowH-5);ctx.fillStyle=accent;ctx.font='9px monospace';ctx.fillText(b.toString(16).padStart(2,'0'),14+i*cellW,ctY+20)});
  // XOR arrows
  const xorY=ctY+rowH+5;ctx.fillStyle='#f87171';ctx.font='bold 12px monospace';ptBytes.forEach((_,i)=>{ctx.fillText('XOR',12+i*cellW,xorY+10)});
  // Recovered key row
  const keyY=xorY+25;ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Recovered Key (K = P XOR C)',10,keyY-4);
  (recoveredKey.length?recoveredKey:new Array(ptBytes.length).fill(null)).forEach((b,i)=>{
    ctx.fillStyle=b!==null?'#f8717133':'rgba(255,255,255,.05)';ctx.fillRect(10+i*cellW,keyY,cellW-2,rowH-5);
    if(b!==null){ctx.fillStyle='#f87171';ctx.font='bold 10px monospace';ctx.fillText(String.fromCharCode(b),14+i*cellW,keyY+15);ctx.fillText(b.toString(16).padStart(2,'0'),14+i*cellW,keyY+30)}})}
function buildControls(){$('controlsArea').innerHTML=`<div class="control-section"><div class="section-header"><div class="section-title">Known Plaintext</div></div><input type="text" id="ptInput" value="Hello, World! This is a known message." placeholder="Known plaintext"/></div><div class="control-section"><div style="display:flex;gap:8px;flex-wrap:wrap"><button id="encBtn" class="primary" style="flex:1">Encrypt</button><button id="recoverBtn" style="flex:1">Recover Key (XOR)</button></div></div><div class="control-section"><div class="section-header"><div class="section-title">Unknown Ciphertext (hex, space-separated)</div></div><input type="text" id="unknownInput" placeholder="e.g. 1b 0a 1c ..."/><button id="decBtn" class="btn-sm" style="margin-top:6px">Decrypt Unknown</button></div>`;
  $('encBtn').onclick=doEncrypt;$('recoverBtn').onclick=recoverKey;$('decBtn').onclick=decryptUnknown}
function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'XOR',p:s.wiki_xor},{t:'Stream',p:s.wiki_stream},{t:'Defense',p:s.wiki_defense}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'XOR',p:LANG[currentLang].wiki_xor},{t:'Stream',p:LANG[currentLang].wiki_stream},{t:'Defense',p:LANG[currentLang].wiki_defense}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}
document.addEventListener('DOMContentLoaded',()=>{splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-kpa-lang');if(l&&LANG[l])setLanguage(l)}catch{}try{const t=localStorage.getItem('cry-kpa-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};$('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};$('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  buildControls();buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()});

/* ═══════ ENHANCED KPA VISUALIZATION (IIFE) ═══════ */
(function(){
const _c=document.createElement('canvas');
_c.style.cssText='width:100%;height:340px;border-radius:12px;margin-top:12px;display:block;background:rgba(0,0,0,.12)';
const vizS=document.querySelector('.visualization-section')||document.querySelector('.card');
if(vizS)vizS.appendChild(_c);
const _x=_c.getContext('2d');
let _t=0;

function _rs(){const r=_c.getBoundingClientRect();_c.width=r.width*devicePixelRatio;_c.height=r.height*devicePixelRatio;_x.scale(devicePixelRatio,devicePixelRatio)}
window.addEventListener('resize',_rs);_rs();
function _gc(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function draw(){
  const w=_c.getBoundingClientRect().width,h=_c.getBoundingClientRect().height;
  const acc=_gc('--accent'),mut=_gc('--text-muted'),txt=_gc('--text');
  _x.clearRect(0,0,w,h);_t++;

  // === XOR Truth Table (top-left) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('XOR Operation Properties',10,16);

  const ttW=w*0.3;
  const rows=[['A','B','A^B'],['0','0','0'],['0','1','1'],['1','0','1'],['1','1','0']];
  rows.forEach((row,i)=>{
    const y=24+i*16;
    const isHeader=i===0;
    row.forEach((cell,j)=>{
      const x=10+j*(ttW/3);
      _x.fillStyle=isHeader?acc+'44':'rgba(255,255,255,.03)';
      _x.fillRect(x,y,ttW/3-2,14);
      _x.fillStyle=isHeader?acc:cell==='1'?'#4ade80':'#f87171';
      _x.font=isHeader?'bold 9px SF Mono':'9px SF Mono';_x.textAlign='center';
      _x.fillText(cell,x+ttW/6,y+11);_x.textAlign='left';
    });
  });
  // Key property
  _x.fillStyle='#fbbf24';_x.font='bold 9px SF Mono';
  _x.fillText('P XOR K = C',10,110);
  _x.fillText('C XOR P = K',10,124);
  _x.fillText('C XOR K = P',10,138);
  _x.fillStyle=mut;_x.font='8px Tajawal';
  _x.fillText('XOR is self-inverse!',10,154);

  // === Binary XOR Animation (top-middle) ===
  const bxX=w*0.33,bxW=w*0.34;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Byte-level XOR Recovery',bxX,16);

  const animByte=(_t%8);
  const plainByte=0x48+animByte;// 'H','e','l','l','o'...
  const keyByte=0x53+animByte;
  const cipherByte=plainByte^keyByte;

  for(let bit=7;bit>=0;bit--){
    const x=bxX+(7-bit)*18;
    const pBit=(plainByte>>bit)&1;
    const kBit=(keyByte>>bit)&1;
    const cBit=(cipherByte>>bit)&1;
    // Plaintext bit
    _x.fillStyle=pBit?'#4ade8066':'rgba(255,255,255,.05)';
    _x.fillRect(x,28,16,16);_x.fillStyle=pBit?'#4ade80':mut;_x.font='bold 9px SF Mono';_x.textAlign='center';
    _x.fillText(pBit.toString(),x+8,40);
    // XOR symbol
    _x.fillStyle='#fbbf24';_x.font='bold 10px SF Mono';_x.fillText('\u2295',x+8,58);
    // Key bit
    _x.fillStyle=kBit?'#f8717166':'rgba(255,255,255,.05)';
    _x.fillRect(x,64,16,16);_x.fillStyle=kBit?'#f87171':mut;_x.font='bold 9px SF Mono';
    _x.fillText(kBit.toString(),x+8,76);
    // Equals
    _x.fillStyle=mut;_x.font='bold 10px SF Mono';_x.fillText('=',x+8,94);
    // Cipher bit
    _x.fillStyle=cBit?'#60a5fa66':'rgba(255,255,255,.05)';
    _x.fillRect(x,100,16,16);_x.fillStyle=cBit?'#60a5fa':mut;_x.font='bold 9px SF Mono';
    _x.fillText(cBit.toString(),x+8,112);
    _x.textAlign='left';
  }

  // Labels
  _x.fillStyle='#4ade80';_x.font='8px SF Mono';_x.fillText(`P=0x${plainByte.toString(16)}='${String.fromCharCode(plainByte)}'`,bxX,126);
  _x.fillStyle='#f87171';_x.fillText(`K=0x${keyByte.toString(16)}`,bxX+80,126);
  _x.fillStyle='#60a5fa';_x.fillText(`C=0x${cipherByte.toString(16)}`,bxX+140,126);

  // === Key Stream Reuse Vulnerability (top-right) ===
  const krX=w*0.68,krW=w*0.3;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Key Reuse Attack',krX,16);

  _x.fillStyle='#f87171';_x.font='9px SF Mono';
  _x.fillText('If K reused:',krX,30);
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('C1 = P1 ^ K',krX,44);
  _x.fillText('C2 = P2 ^ K',krX,58);
  _x.fillText('C1^C2 = P1^P2',krX,76);
  _x.fillStyle='#fbbf24';_x.font='bold 8px SF Mono';
  _x.fillText('Key cancels out!',krX,92);
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('If P1 known:',krX,110);
  _x.fillText('P2 = C1^C2^P1',krX,124);
  _x.fillStyle='#4ade80';_x.font='bold 8px SF Mono';
  _x.fillText('All messages exposed!',krX,140);

  // === Frequency Analysis (bottom-left) ===
  const faY=164,faW=w*0.48,faH=h-faY-25;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Ciphertext Frequency Analysis (XOR cipher)',10,faY);

  // Generate frequency data for a simple XOR cipher
  const msg='The quick brown fox jumps over the lazy dog. Crypto is fun!';
  const key='KEY';
  const freq=new Array(256).fill(0);
  for(let i=0;i<msg.length;i++){
    const c=msg.charCodeAt(i)^key.charCodeAt(i%key.length);
    freq[c]++;
  }
  const maxFreq=Math.max(...freq,1);
  const barW=faW/128;
  for(let i=0;i<128;i++){
    if(freq[i]>0){
      const barH=(freq[i]/maxFreq)*(faH-20);
      const hue=(i/128)*360;
      _x.fillStyle=`hsla(${hue},60%,50%,.5)`;
      _x.fillRect(10+i*barW,faY+10+faH-20-barH,barW-1,barH);
    }
  }
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('Non-uniform distribution reveals patterns',10,faY+faH-2);

  // === Stream Cipher Architecture (bottom-right) ===
  const scX=w*0.52,scY=faY,scW=w*0.46,scH=faH;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Stream Cipher Key Stream',scX,scY);

  // PRNG box
  _x.fillStyle='#c084fc33';_x.fillRect(scX,scY+12,80,35);_x.strokeStyle='#c084fc';_x.strokeRect(scX,scY+12,80,35);
  _x.fillStyle='#c084fc';_x.font='bold 9px SF Mono';_x.textAlign='center';
  _x.fillText('PRNG',scX+40,scY+25);
  _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText('(seed=key)',scX+40,scY+38);_x.textAlign='left';

  // Key stream output
  const ksY=scY+55;
  const streamLen=Math.min(16,Math.floor(scW/22));
  for(let i=0;i<streamLen;i++){
    const x=scX+i*22;
    const val=((0xAB*(_t+i)+0x37)&0xFF);
    const active=i<=(_t%streamLen);
    _x.fillStyle=active?'#c084fc33':'rgba(255,255,255,.03)';
    _x.fillRect(x,ksY,20,16);
    if(active){_x.fillStyle='#c084fc';_x.font='bold 7px SF Mono';_x.textAlign='center';_x.fillText(val.toString(16),x+10,ksY+12);_x.textAlign='left'}
  }
  _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText('Key stream bytes',scX,ksY+28);

  // XOR with plaintext
  const xorY=ksY+35;
  _x.fillStyle='#fbbf24';_x.font='bold 10px SF Mono';
  for(let i=0;i<Math.min(streamLen,8);i++){
    _x.fillText('\u2295',scX+i*22+6,xorY+10);
  }

  // Plaintext row
  const ptY=xorY+18;
  for(let i=0;i<Math.min(streamLen,8);i++){
    const x=scX+i*22;
    const ch=msg.charCodeAt(i);
    _x.fillStyle='#4ade8033';_x.fillRect(x,ptY,20,16);
    _x.fillStyle='#4ade80';_x.font='7px SF Mono';_x.textAlign='center';
    _x.fillText(ch.toString(16),x+10,ptY+12);_x.textAlign='left';
  }
  _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText('= Ciphertext',scX,ptY+28);

  // Defense note
  const defY=ptY+38;
  if(defY+15<h){
    _x.fillStyle='#4ade80';_x.font='bold 9px SF Mono';
    _x.fillText('Defense: Never reuse nonce/key (AES-GCM, ChaCha20-Poly1305)',scX,defY);
  }

  requestAnimationFrame(draw);
}
draw();
})();
