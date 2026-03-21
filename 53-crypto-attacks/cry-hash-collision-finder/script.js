/**
 * Hash Collision Finder — Workshop DIY v1.0
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas Sim
 */
const $=id=>document.getElementById(id);
const LANG={
  en:{title:'Hash Collision Finder',subtitle:'Find two inputs producing the same hash digest',mainSection:'Collision Search',mainDesc:'Search for hash collisions in truncated digests',bitsLabel:'Hash Bits (truncated)',bitsHint:'Fewer bits = faster collisions (birthday paradox)',startSearch:'Start Search',stop:'Stop',results:'Results',vizTitle:'Collision Visualization',vizHint:'Watch hash values accumulate until a collision is found',sectionA:'Hash Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',found:'Collision found!',searching:'Searching...',noCollision:'No collision yet',faq_q1:'What is a hash collision?',faq_a1:'When two different inputs produce the same hash output. Ideally impossible but becomes likely with truncated hashes.',faq_q2:'Why truncate the hash?',faq_a2:'Full SHA-256 has 2^256 possible outputs. Truncating to 16 bits means only 65536 possible values, making collisions feasible.',faq_q3:'What is the birthday paradox?',faq_a3:'You only need about sqrt(N) random values to find a collision among N possibilities. For 16 bits, ~256 inputs suffice.',howto_1:'Select the number of hash bits.',howto_2:'Click Start Search to begin.',howto_3:'Watch the canvas as hashes accumulate.',howto_4:'A collision appears when two dots overlap.',wiki_hash:'A hash function maps arbitrary data to a fixed-size digest. SHA-256 produces 256-bit output.',wiki_birthday:'Birthday paradox: in a group of 23 people, there is a 50% chance two share a birthday (365 possibilities).',wiki_collision:'Collision resistance: it should take O(2^(n/2)) operations to find a collision for an n-bit hash.',mathExplain:'Birthday Attack Complexity:\nFor n-bit hash: ~2^(n/2) attempts needed\n\n8 bits:  ~16 attempts\n16 bits: ~256 attempts\n24 bits: ~4096 attempts\n32 bits: ~65536 attempts\n\nP(collision after k attempts) = 1 - Product(1 - i/2^n) for i=0..k-1'},
  fr:{title:'Chercheur de Collisions',subtitle:'Trouvez deux entrees produisant le meme condensat',mainSection:'Recherche de Collision',mainDesc:'Cherchez des collisions dans des condensats tronques',bitsLabel:'Bits de Hash (tronques)',bitsHint:'Moins de bits = collisions plus rapides',startSearch:'Lancer Recherche',stop:'Arreter',results:'Resultats',vizTitle:'Visualisation des Collisions',vizHint:'Regardez les hachages s\'accumuler',sectionA:'Reference Hash',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',found:'Collision trouvee!',searching:'Recherche...',noCollision:'Pas encore de collision',faq_q1:'Qu\'est-ce qu\'une collision?',faq_a1:'Quand deux entrees differentes produisent le meme condensat.',faq_q2:'Pourquoi tronquer?',faq_a2:'SHA-256 complet a 2^256 sorties possibles. Tronquer a 16 bits = 65536 valeurs.',faq_q3:'Paradoxe des anniversaires?',faq_a3:'Il faut environ sqrt(N) valeurs pour trouver une collision parmi N possibilites.',howto_1:'Choisissez le nombre de bits.',howto_2:'Cliquez Lancer.',howto_3:'Regardez le canvas.',howto_4:'Une collision apparait quand deux points se chevauchent.',wiki_hash:'Une fonction de hachage mappe des donnees a un condensat de taille fixe.',wiki_birthday:'Paradoxe des anniversaires: 23 personnes suffisent pour 50% de chance de partager un anniversaire.',wiki_collision:'Resistance aux collisions: O(2^(n/2)) operations pour n bits.',mathExplain:'Complexite attaque anniversaire:\nPour hash n bits: ~2^(n/2) essais\n\n8 bits: ~16 essais\n16 bits: ~256 essais\n24 bits: ~4096 essais'},
  ar:{title:'كاشف تصادم التجزئة',subtitle:'ابحث عن مدخلين ينتجان نفس البصمة',mainSection:'بحث التصادم',mainDesc:'ابحث عن تصادمات في بصمات مقتطعة',bitsLabel:'بتات التجزئة (مقتطعة)',bitsHint:'بتات أقل = تصادمات أسرع',startSearch:'بدء البحث',stop:'إيقاف',results:'النتائج',vizTitle:'تصور التصادم',vizHint:'شاهد قيم التجزئة تتراكم حتى يحدث تصادم',sectionA:'مرجع التجزئة',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',found:'تم إيجاد تصادم!',searching:'جاري البحث...',noCollision:'لا تصادم بعد',faq_q1:'ما هو تصادم التجزئة؟',faq_a1:'عندما ينتج مدخلان مختلفان نفس البصمة.',faq_q2:'لماذا الاقتطاع؟',faq_a2:'SHA-256 الكامل له 2^256 مخرج. الاقتطاع إلى 16 بت = 65536 قيمة.',faq_q3:'مفارقة عيد الميلاد؟',faq_a3:'تحتاج فقط sqrt(N) قيمة لإيجاد تصادم من بين N احتمال.',howto_1:'اختر عدد البتات.',howto_2:'اضغط بدء البحث.',howto_3:'شاهد اللوحة.',howto_4:'يظهر التصادم عندما تتداخل نقطتان.',wiki_hash:'دالة التجزئة تحول بيانات عشوائية إلى بصمة بحجم ثابت.',wiki_birthday:'مفارقة عيد الميلاد: 23 شخصا يكفي لاحتمال 50% لتشارك يوم ميلاد.',wiki_collision:'مقاومة التصادم: O(2^(n/2)) عملية لتجزئة n بت.',mathExplain:'تعقيد هجوم عيد الميلاد:\nلتجزئة n بت: ~2^(n/2) محاولة\n\n8 بت: ~16 محاولة\n16 بت: ~256 محاولة\n24 بت: ~4096 محاولة'}
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


let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('cry-hash-lang',lang)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('cry-hash-theme',name)}catch{}log(`${LANG[currentLang].themeChanged} ${name}`,'info')}
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=.08;const t=audioCtx.currentTime;if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.3);osc.start(t);osc.stop(t+.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.25)}else{osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.08);osc.start(t);osc.stop(t+.08)}}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(panel,overlay){panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'))}

/* ═══════ SIMPLE HASH (djb2-like, truncatable) ═══════ */
function simpleHash(str,bits){let h=5381;for(let i=0;i<str.length;i++)h=((h<<5)+h+str.charCodeAt(i))>>>0;return h&((1<<bits)-1)}

/* ═══════ CANVAS ═══════ */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
let searching=false,hashMap={},attempts=[],collisionPair=null,animFrame;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawSim(){
  if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),accent2=getCS('--accent2'),text=getCS('--text'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);
  const bits=parseInt($('bitsSelect').value)||16,maxVal=1<<bits;
  // Title
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText(`Hash Collision Search (${bits}-bit)`,10,22);
  ctx.fillStyle=muted;ctx.font='11px Tajawal,sans-serif';ctx.fillText(`Attempts: ${attempts.length} / Expected: ~${Math.ceil(Math.sqrt(maxVal))}`,10,38);
  // Hash space grid
  const cols=Math.ceil(Math.sqrt(maxVal)),cellW=(w-20)/cols,gridY=50,gridH=h-60;
  const cellH=gridH/cols;
  // Draw occupied cells
  const occupied=new Set(attempts.map(a=>a.hash));
  occupied.forEach(hv=>{const gx=hv%cols,gy=Math.floor(hv/cols);
    ctx.fillStyle=`${accent}33`;ctx.fillRect(10+gx*cellW,gridY+gy*cellH,Math.max(cellW-.5,1),Math.max(cellH-.5,1))});
  // Draw recent attempts as dots
  const recent=attempts.slice(-200);
  recent.forEach((a,i)=>{const gx=a.hash%cols,gy=Math.floor(a.hash/cols);
    const alpha=.3+.7*(i/recent.length);ctx.fillStyle=a.collision?'#f87171':`rgba(74,222,128,${alpha})`;
    ctx.beginPath();ctx.arc(10+gx*cellW+cellW/2,gridY+gy*cellH+cellH/2,Math.max(2,cellW/3),0,Math.PI*2);ctx.fill()});
  // Collision highlight
  if(collisionPair){const gx=collisionPair.hash%cols,gy=Math.floor(collisionPair.hash/cols);
    ctx.strokeStyle='#f87171';ctx.lineWidth=3;ctx.beginPath();ctx.arc(10+gx*cellW+cellW/2,gridY+gy*cellH+cellH/2,Math.max(8,cellW),0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#f87171';ctx.font='bold 12px Tajawal';ctx.fillText('COLLISION!',10+gx*cellW+cellW+5,gridY+gy*cellH+cellH/2+4)}
  // Progress bar
  const progress=Math.min(1,attempts.length/Math.sqrt(maxVal));
  ctx.fillStyle=`${accent}22`;ctx.fillRect(10,h-12,w-20,8);
  ctx.fillStyle=accent;ctx.fillRect(10,h-12,progress*(w-20),8);
  if(searching)animFrame=requestAnimationFrame(drawSim)
}

function startSearch(){
  const bits=parseInt($('bitsSelect').value);hashMap={};attempts=[];collisionPair=null;searching=true;
  const s=LANG[currentLang];log(s.searching,'info');showToast(s.searching);$('resultsBox').textContent='';resizeCanvas();drawSim();
  let count=0;
  function step(){
    if(!searching)return;
    const batch=100;
    for(let i=0;i<batch;i++){count++;const input=`msg_${count}_${Math.random().toString(36).slice(2)}`;
      const h=simpleHash(input,bits);const entry={input,hash:h,collision:false};
      if(hashMap[h]!==undefined){entry.collision=true;collisionPair={hash:h,input1:hashMap[h],input2:input};
        attempts.push(entry);searching=false;hideToast();drawSim();
        const out=`${s.found}\n\nInput 1: "${collisionPair.input1}"\nInput 2: "${collisionPair.input2}"\nHash: 0x${h.toString(16).padStart(bits/4,'0')} (${h})\n\nAttempts: ${count}\nExpected (birthday): ~${Math.ceil(Math.sqrt(1<<bits))}`;
        $('resultsBox').textContent=out;log(`${s.found} after ${count} attempts`,'success');return}
      hashMap[h]=input;attempts.push(entry)}
    setTimeout(step,0)}
  setTimeout(step,0)}
function stopSearch(){searching=false;hideToast();if(animFrame)cancelAnimationFrame(animFrame);log('Search stopped','info')}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'Hash Functions',p:s.wiki_hash},{t:'Birthday Paradox',p:s.wiki_birthday},{t:'Collision Resistance',p:s.wiki_collision}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=`<div class="wiki-entry"><h3>Hash Functions</h3><p>${LANG[currentLang].wiki_hash}</p></div><div class="wiki-entry"><h3>Birthday Paradox</h3><p>${LANG[currentLang].wiki_birthday}</p></div><div class="wiki-entry"><h3>Collision Resistance</h3><p>${LANG[currentLang].wiki_collision}</p></div>`}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',resizeCanvas);
  try{const l=localStorage.getItem('cry-hash-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-hash-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};
  $('copyLogBtn').onclick=async()=>{const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})}});
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);$(id).classList.add('active')}});
  $('searchBtn').onclick=startSearch;$('stopBtn').onclick=stopSearch;
  buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawSim()
});

/* ═══════ ENHANCED HASH COLLISION VISUALIZATION (IIFE) ═══════ */
(function(){
const _c=document.createElement('canvas');
_c.style.cssText='width:100%;height:340px;border-radius:12px;margin-top:12px;display:block;background:rgba(0,0,0,.12)';
const vizS=document.querySelector('.visualization-section')||document.querySelector('.card');
if(vizS)vizS.appendChild(_c);
const _x=_c.getContext('2d');
let _t=0,_hashGrid=[],_avalanche=[];

function _rs(){const r=_c.getBoundingClientRect();_c.width=r.width*devicePixelRatio;_c.height=r.height*devicePixelRatio;_x.scale(devicePixelRatio,devicePixelRatio)}
window.addEventListener('resize',_rs);_rs();

// Build hash distribution grid
function buildGrid(){
  _hashGrid=[];
  for(let i=0;i<32;i++){
    const row=[];
    for(let j=0;j<32;j++){
      const v=simpleHash(`cell_${i}_${j}_${Math.random()}`,16);
      row.push({val:v,occ:0,age:0});
    }
    _hashGrid.push(row);
  }
}
buildGrid();

// Avalanche effect data: flip 1 bit, see how many output bits change
function genAvalanche(){
  _avalanche=[];
  for(let bit=0;bit<8;bit++){
    const original=`test_message_${_t}`;
    const h1=simpleHash(original,16);
    const modified=String.fromCharCode(original.charCodeAt(0)^(1<<bit))+original.slice(1);
    const h2=simpleHash(modified,16);
    const diff=h1^h2;
    let flipped=0;for(let b=0;b<16;b++)if(diff&(1<<b))flipped++;
    _avalanche.push({inputBit:bit,h1,h2,diff,flipped,ratio:flipped/16});
  }
}

function _gc(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function draw(){
  const w=_c.getBoundingClientRect().width,h=_c.getBoundingClientRect().height;
  const acc=_gc('--accent'),mut=_gc('--text-muted'),txt=_gc('--text');
  _x.clearRect(0,0,w,h);_t++;

  // === Hash Distribution Grid (top-left) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Hash Output Distribution (16-bit)',10,16);
  const gW=w*0.45,gH=130,gX=10,gY=24;
  const cellW=gW/32,cellH=gH/32;

  // Simulate hashing: drop a new value each frame
  const newHash=simpleHash(`msg_${_t}_${Math.random().toString(36)}`,16);
  const gi=newHash%32,gj=Math.floor(newHash/32)%32;
  if(_hashGrid[gi]&&_hashGrid[gi][gj]){_hashGrid[gi][gj].occ++;_hashGrid[gi][gj].age=_t}

  for(let i=0;i<32;i++){
    for(let j=0;j<32;j++){
      const cell=_hashGrid[i][j];
      const intensity=Math.min(1,cell.occ/10);
      const fresh=(_t-cell.age)<30?0.5:0;
      _x.fillStyle=`rgba(74,222,128,${intensity*0.6+fresh})`;
      _x.fillRect(gX+j*cellW,gY+i*cellH,cellW-0.5,cellH-0.5);
    }
  }
  // Highlight newest
  _x.strokeStyle='#f87171';_x.lineWidth=2;
  _x.strokeRect(gX+gj*cellW-1,gY+gi*cellH-1,cellW+2,cellH+2);
  _x.fillStyle=mut;_x.font='9px SF Mono';
  _x.fillText(`Hash: 0x${newHash.toString(16).padStart(4,'0')}  Bucket [${gi},${gj}]`,gX,gY+gH+12);

  // === Avalanche Effect (top-right) ===
  const avX=w*0.52,avY=6;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Avalanche Effect (1-bit input change)',avX,16);

  if(_t%30===0)genAvalanche();
  const avW=w*0.46,avH=130;
  if(_avalanche.length>0){
    const barW=avW/8;
    _avalanche.forEach((a,i)=>{
      const x=avX+i*barW;
      const barH=a.ratio*avH*0.8;
      const color=a.ratio>0.4?'#4ade80':a.ratio>0.2?'#fbbf24':'#f87171';
      _x.fillStyle=color+'44';_x.fillRect(x+2,avY+18+avH-barH,barW-4,barH);
      _x.fillStyle=color;_x.font='bold 9px SF Mono';
      _x.textAlign='center';
      _x.fillText(`${a.flipped}/16`,x+barW/2,avY+18+avH-barH-4);
      _x.fillStyle=mut;_x.font='8px SF Mono';
      _x.fillText(`bit ${a.inputBit}`,x+barW/2,avY+avH+22);
      _x.textAlign='left';
    });
    // Ideal line (50%)
    const idealY=avY+18+avH-0.5*avH*0.8;
    _x.strokeStyle='#f87171';_x.setLineDash([3,3]);
    _x.beginPath();_x.moveTo(avX,idealY);_x.lineTo(avX+avW,idealY);_x.stroke();
    _x.setLineDash([]);
    _x.fillStyle='#f87171';_x.font='8px SF Mono';_x.fillText('ideal 50%',avX+avW-45,idealY-3);
  }

  // === Birthday Probability Curve (bottom-left) ===
  const bpX=10,bpY=gY+gH+26,bpW=w*0.45,bpH=h-bpY-25;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('P(collision) vs attempts (birthday bound)',bpX,bpY);
  _x.strokeStyle=mut+'44';_x.beginPath();
  _x.moveTo(bpX+25,bpY+8);_x.lineTo(bpX+25,bpY+bpH);_x.lineTo(bpX+bpW,bpY+bpH);_x.stroke();

  const bits=parseInt(document.getElementById('bitsSelect').value)||16;
  const N=1<<bits;
  const maxK=Math.min(N,Math.ceil(3*Math.sqrt(N)));
  _x.strokeStyle='#60a5fa';_x.lineWidth=2;_x.beginPath();
  for(let k=1;k<=Math.min(maxK,400);k++){
    const prob=1-Math.exp(-k*(k-1)/(2*N));
    const px=bpX+25+(k/maxK)*(bpW-30);
    const py=bpY+bpH-prob*(bpH-12);
    if(k===1)_x.moveTo(px,py);else _x.lineTo(px,py);
  }
  _x.stroke();_x.lineWidth=1;

  // 50% line
  const halfY=bpY+bpH-0.5*(bpH-12);
  _x.strokeStyle='#fbbf24';_x.setLineDash([4,4]);
  _x.beginPath();_x.moveTo(bpX+25,halfY);_x.lineTo(bpX+bpW,halfY);_x.stroke();_x.setLineDash([]);
  _x.fillStyle='#fbbf24';_x.font='8px SF Mono';_x.fillText('50%',bpX+2,halfY+3);

  // Birthday bound marker
  const bbK=Math.round(1.177*Math.sqrt(N));
  const bbX=bpX+25+(bbK/maxK)*(bpW-30);
  _x.strokeStyle='#f87171';_x.setLineDash([2,2]);
  _x.beginPath();_x.moveTo(bbX,bpY+8);_x.lineTo(bbX,bpY+bpH);_x.stroke();_x.setLineDash([]);
  _x.fillStyle='#f87171';_x.font='8px SF Mono';_x.fillText(`~${bbK}`,bbX-10,bpY+bpH+10);

  // === Hash Internals Animation (bottom-right) ===
  const hiX=w*0.52,hiY=bpY,hiW=w*0.46,hiH=bpH;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Hash Compression (Merkle-Damgard steps)',hiX,hiY);

  const nBlocks=6;
  const bkW=hiW/(nBlocks+1);
  const bkH=30;
  const bkY=hiY+15;
  let state=0x5381;
  for(let i=0;i<nBlocks;i++){
    const x=hiX+i*bkW;
    // Block
    _x.fillStyle=`${acc}22`;_x.fillRect(x+2,bkY,bkW-8,bkH);
    _x.strokeStyle=`${acc}66`;_x.strokeRect(x+2,bkY,bkW-8,bkH);
    // Arrow
    if(i<nBlocks-1){
      _x.strokeStyle=acc;_x.beginPath();_x.moveTo(x+bkW-6,bkY+bkH/2);_x.lineTo(x+bkW+2,bkY+bkH/2);_x.stroke();
      _x.fillStyle=acc;_x.beginPath();_x.moveTo(x+bkW+2,bkY+bkH/2);_x.lineTo(x+bkW-4,bkY+bkH/2-4);_x.lineTo(x+bkW-4,bkY+bkH/2+4);_x.fill();
    }
    // State value (animated)
    const animState=((state<<5)+state+(_t+i*37))>>>0;
    state=animState;
    const displayH=(animState&0xFFFF).toString(16).padStart(4,'0');
    _x.fillStyle=acc;_x.font='bold 8px SF Mono';_x.textAlign='center';
    _x.fillText(`0x${displayH}`,x+bkW/2-2,bkY+bkH/2+3);
    _x.textAlign='left';

    // Block label
    _x.fillStyle=mut;_x.font='7px Tajawal';_x.textAlign='center';
    _x.fillText(i===0?'IV':`B${i}`,x+bkW/2-2,bkY-3);
    _x.textAlign='left';
  }

  // XOR / compression visual
  const compY=bkY+bkH+15;
  for(let i=0;i<16;i++){
    const bx=hiX+i*(hiW/16);
    const bit=(state>>(15-i))&1;
    const flip=Math.sin(_t*0.05+i*0.5)>0?1:0;
    _x.fillStyle=bit?`${acc}88`:'rgba(255,255,255,.05)';
    _x.fillRect(bx,compY,hiW/16-1,12);
    if(flip!==bit){
      _x.fillStyle='#f87171';_x.font='bold 8px SF Mono';_x.textAlign='center';
      _x.fillText(bit.toString(),bx+hiW/32,compY+10);_x.textAlign='left';
    }
  }
  _x.fillStyle=mut;_x.font='9px Tajawal';
  _x.fillText('Internal state bits (XOR cascade)',hiX,compY+25);

  // Collision counter animation
  const ccY=compY+35;
  const progress=(_t%200)/200;
  _x.fillStyle='rgba(255,255,255,.04)';_x.fillRect(hiX,ccY,hiW,16);
  _x.fillStyle=progress>0.8?'#f87171':'#4ade80';
  _x.fillRect(hiX,ccY,progress*hiW,16);
  _x.fillStyle=txt;_x.font='9px SF Mono';
  _x.fillText(`Search progress: ${Math.floor(progress*100)}%  (${Math.floor(progress*Math.sqrt(N))} / ~${Math.ceil(Math.sqrt(N))} birthday bound)`,hiX+4,ccY+12);

  requestAnimationFrame(draw);
}
draw();
})();
