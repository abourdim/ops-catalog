/**
 * Length Extension Lab — Workshop DIY v1.0
 * Demonstrate length extension attack on Merkle-Damgard hashes
 */
const $=id=>document.getElementById(id);
const LANG={en:{title:'Length Extension Lab',subtitle:'Exploit Merkle-Damgard hash to forge MACs',mainSection:'Length Extension Attack',mainDesc:'Forge valid MAC by extending known hash without the secret',computeMAC:'Compute MAC',forgeMAC:'Forge Extended MAC',results:'Results',vizTitle:'Merkle-Damgard Visualization',vizHint:'See how the hash chain allows extension',sectionA:'Attack Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',macComputed:'MAC computed',forged:'MAC forged successfully!',faq_q1:'What is a length extension attack?',faq_a1:'Given H(secret||msg) and len(secret), compute H(secret||msg||padding||append) without knowing the secret.',faq_q2:'Which hashes are vulnerable?',faq_a2:'MD5, SHA-1, SHA-256, SHA-512. HMAC, SHA-3, and BLAKE2 are immune.',faq_q3:'Why does this work?',faq_a3:'Merkle-Damgard hashes output their internal state. You can resume hashing from that state.',howto_1:'Enter original message.',howto_2:'Click Compute MAC to create H(secret||msg).',howto_3:'Enter data to append.',howto_4:'Click Forge to create valid H(secret||msg||pad||append).',wiki_md:'Merkle-Damgard: process message in blocks, chain compression function outputs. Final state = hash.',wiki_ext:'Length extension: use hash output as initial state, continue hashing with appended data.',wiki_hmac:'HMAC: H(K xor opad || H(K xor ipad || msg)). Two nested hashes prevent length extension.',mathExplain:'Length Extension Attack:\n\nGiven: MAC = H(secret || message)\nKnown: len(secret), message, MAC\nGoal: compute H(secret || message || padding || append)\n\nSteps:\n1. Reconstruct padding for (secret || message)\n2. Set hash internal state = MAC value\n3. Continue hashing: H_state(append)\n4. Result = valid MAC for extended message\n\nPadding (MD): message || 0x80 || 0x00...00 || length_bits'},
fr:{title:'Labo Extension de Longueur',subtitle:'Exploitez Merkle-Damgard pour forger des MACs',mainSection:'Attaque Extension de Longueur',mainDesc:'Forgez un MAC valide en etendant un condensat connu',computeMAC:'Calculer MAC',forgeMAC:'Forger MAC Etendu',results:'Resultats',vizTitle:'Visualisation Merkle-Damgard',vizHint:'Voyez comment la chaine permet l\'extension',sectionA:'Reference',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',macComputed:'MAC calcule',forged:'MAC forge avec succes!',faq_q1:'Extension de longueur?',faq_a1:'Calculer H(secret||msg||padding||ajout) sans connaitre le secret.',faq_q2:'Quels hash sont vulnerables?',faq_a2:'MD5, SHA-1, SHA-256. HMAC et SHA-3 sont immunises.',faq_q3:'Pourquoi ca marche?',faq_a3:'Les hash Merkle-Damgard exposent leur etat interne.',howto_1:'Entrez le message.',howto_2:'Cliquez Calculer MAC.',howto_3:'Entrez les donnees a ajouter.',howto_4:'Cliquez Forger.',wiki_md:'Merkle-Damgard: traite par blocs, chaine les sorties.',wiki_ext:'Extension: utilise le hash comme etat initial, continue le hachage.',wiki_hmac:'HMAC: deux hachages imbriques empechent l\'extension.',mathExplain:'Attaque Extension de Longueur:\nDonne: MAC = H(secret || message)\nBut: H(secret || message || padding || ajout)'},
ar:{title:'مختبر تمديد الطول',subtitle:'استغل بنية ميركل-دامغارد لتزوير MACs',mainSection:'هجوم تمديد الطول',mainDesc:'زوّر MAC صالح بتمديد تجزئة معروفة بدون السر',computeMAC:'حساب MAC',forgeMAC:'تزوير MAC ممتد',results:'النتائج',vizTitle:'تصور ميركل-دامغارد',vizHint:'شاهد كيف تسمح السلسلة بالتمديد',sectionA:'مرجع',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',macComputed:'تم حساب MAC',forged:'تم تزوير MAC بنجاح!',faq_q1:'ما هو هجوم تمديد الطول؟',faq_a1:'حساب H(سر||رسالة||حشو||إضافة) بدون معرفة السر.',faq_q2:'أي تجزئات معرضة؟',faq_a2:'MD5, SHA-1, SHA-256. HMAC وSHA-3 محصنة.',faq_q3:'لماذا يعمل؟',faq_a3:'تجزئات ميركل-دامغارد تكشف حالتها الداخلية.',howto_1:'أدخل الرسالة.',howto_2:'اضغط حساب MAC.',howto_3:'أدخل البيانات المراد إضافتها.',howto_4:'اضغط تزوير.',wiki_md:'ميركل-دامغارد: معالجة بالكتل، سلسلة مخرجات الضغط.',wiki_ext:'التمديد: استخدام مخرج التجزئة كحالة أولية.',wiki_hmac:'HMAC: تجزئتان متداخلتان تمنعان التمديد.',mathExplain:'هجوم تمديد الطول:\nمعطى: MAC = H(سر || رسالة)\nالهدف: H(سر || رسالة || حشو || إضافة)'}};

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


let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;if($('langSelect'))$('langSelect').value=l;try{localStorage.setItem('cry-le-lang',l)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));if($('themeSelect'))$('themeSelect').value=n;try{localStorage.setItem('cry-le-theme',n)}catch{}}
let soundEnabled=false;function playSound(t){if(!soundEnabled)return;const a=new(window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);g.gain.value=.08;o.frequency.value=t==='success'?523:200;g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.2);o.start();o.stop(a.currentTime+.2)}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success')}
function showToast(m){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(p,o){p.classList.toggle('open');if(o)o.classList.toggle('active',p.classList.contains('open'))}

/* ═══════ SIMPLIFIED HASH (Merkle-Damgard-like) ═══════ */
const SECRET='mysecretkey';let originalMAC=null,blocks=[],forgedBlocks=[];
function simpleHash(data,initState=0x67452301){let h=initState;const bs=[];for(let i=0;i<data.length;i++){h=((h<<5)+h+data.charCodeAt(i))>>>0;if((i+1)%8===0||i===data.length-1)bs.push({block:data.slice(Math.max(0,i-7),i+1),state:h})}return{hash:h,blocks:bs}}
function computeMAC(){const msg=$('msgInput').value;const fullMsg=SECRET+msg;const result=simpleHash(fullMsg);originalMAC=result.hash;blocks=result.blocks;
  const s=LANG[currentLang];log(s.macComputed,'success');
  $('resultsBox').textContent=`Original Message: "${msg}"\nMAC = H(secret || msg) = 0x${originalMAC.toString(16).padStart(8,'0')}\nSecret length: ${SECRET.length} (unknown to attacker)\nBlocks processed: ${blocks.length}`;drawCanvas()}

function forgeMAC(){if(!originalMAC){computeMAC()}const append=$('appendInput').value;const padding='\x80'+'\x00'.repeat(7);
  const extResult=simpleHash(padding+append,originalMAC);forgedBlocks=extResult.blocks;
  const forgedHash=extResult.hash;
  // Verify: compute actual hash of full extended message
  const fullExtended=SECRET+$('msgInput').value+padding+append;const verify=simpleHash(fullExtended);
  const s=LANG[currentLang];
  $('resultsBox').textContent+=`\n\n--- LENGTH EXTENSION ATTACK ---\nAppended data: "${append}"\nForged MAC: 0x${forgedHash.toString(16).padStart(8,'0')}\nVerification: 0x${verify.hash.toString(16).padStart(8,'0')}\nMatch: ${forgedHash===verify.hash?'YES - FORGED!':'NO'}\n\nAttacker created valid MAC for:\n"${$('msgInput').value}${padding}${append}"\nwithout knowing the secret!`;
  log(s.forged,'success');drawCanvas()}

const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawCanvas(){if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),text=getCS('--text'),muted=getCS('--text-muted');ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText('Merkle-Damgard Hash Chain',10,22);
  // Draw original chain
  if(blocks.length>0){ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Original: H(secret || message)',10,45);
    const bw=Math.min(80,(w-40)/(blocks.length+1)),by=60,bh=50;
    // IV
    ctx.fillStyle='#4ade8033';ctx.fillRect(10,by,bw-4,bh);ctx.fillStyle='#4ade80';ctx.font='9px monospace';ctx.fillText('IV',14,by+15);ctx.fillText('0x67452301',14,by+30);
    blocks.forEach((b,i)=>{const x=10+(i+1)*bw;ctx.strokeStyle=accent;ctx.beginPath();ctx.moveTo(x-4,by+bh/2);ctx.lineTo(x,by+bh/2);ctx.stroke();
      ctx.fillStyle=i<blocks.length-1?`${accent}33`:'#f8717133';ctx.fillRect(x,by,bw-4,bh);ctx.fillStyle=i<blocks.length-1?accent:'#f87171';ctx.font='8px monospace';ctx.fillText(b.block.slice(0,8),x+2,by+15);ctx.fillText('0x'+b.state.toString(16).padStart(8,'0'),x+2,by+35)})}
  // Draw forged extension
  if(forgedBlocks.length>0){const fy=140;ctx.fillStyle='#f87171';ctx.font='10px Tajawal';ctx.fillText('Forged Extension: resume from MAC state',10,fy-5);
    const bw=Math.min(80,(w-40)/(forgedBlocks.length+1)),bh=50;
    ctx.fillStyle='#f8717133';ctx.fillRect(10,fy,bw-4,bh);ctx.fillStyle='#f87171';ctx.font='9px monospace';ctx.fillText('MAC state',14,fy+15);ctx.fillText('0x'+originalMAC.toString(16).padStart(8,'0'),14,fy+35);
    forgedBlocks.forEach((b,i)=>{const x=10+(i+1)*bw;ctx.strokeStyle='#f87171';ctx.beginPath();ctx.moveTo(x-4,fy+bh/2);ctx.lineTo(x,fy+bh/2);ctx.stroke();
      ctx.fillStyle='#f8717133';ctx.fillRect(x,fy,bw-4,bh);ctx.fillStyle='#f87171';ctx.font='8px monospace';ctx.fillText(b.block.slice(0,8),x+2,fy+15);ctx.fillText('0x'+b.state.toString(16).padStart(8,'0'),x+2,fy+35)})}
  // Explanation
  ctx.fillStyle=muted;ctx.font='11px Tajawal';ctx.fillText('The attacker uses the MAC output as the new initial state,',10,h-40);ctx.fillText('then continues hashing with the appended data.',10,h-24)}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'Merkle-Damgard',p:s.wiki_md},{t:'Extension',p:s.wiki_ext},{t:'HMAC Defense',p:s.wiki_hmac}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'Merkle-Damgard',p:LANG[currentLang].wiki_md},{t:'Extension',p:LANG[currentLang].wiki_ext},{t:'HMAC',p:LANG[currentLang].wiki_hmac}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}
document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-le-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-le-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};$('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  $('hashBtn').onclick=computeMAC;$('forgeBtn').onclick=forgeMAC;
  buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()});

/* ═══════ ENHANCED LENGTH EXTENSION VISUALIZATION (IIFE) ═══════ */
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

  // === Merkle-Damgard Architecture (top) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Merkle-Damgard Hash Construction',10,16);

  const nBlocks=7,bW=Math.min(85,(w-60)/(nBlocks+1)),bH=30,bY=30;
  // IV
  _x.fillStyle='#c084fc33';_x.fillRect(5,bY,bW*0.6,bH);_x.strokeStyle='#c084fc66';_x.strokeRect(5,bY,bW*0.6,bH);
  _x.fillStyle='#c084fc';_x.font='bold 8px SF Mono';_x.textAlign='center';_x.fillText('IV',5+bW*0.3,bY+12);
  const animState=(0x67452301+_t*137)>>>0;
  _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText(`0x${(animState&0xFFFF).toString(16)}`,5+bW*0.3,bY+24);_x.textAlign='left';

  for(let i=0;i<nBlocks;i++){
    const x=5+bW*0.6+5+i*bW;
    const isSecret=i<2;
    const isMsg=i>=2&&i<5;
    const isPad=i===5;
    const isExt=i===6;
    const color=isSecret?'#f87171':isMsg?'#4ade80':isPad?'#fbbf24':'#c084fc';

    // Compression function box
    _x.fillStyle=color+'22';_x.fillRect(x,bY,bW-5,bH);_x.strokeStyle=color+'66';_x.strokeRect(x,bY,bW-5,bH);

    // Arrow from previous
    _x.strokeStyle=color+'88';_x.beginPath();_x.moveTo(x-5,bY+bH/2);_x.lineTo(x,bY+bH/2);_x.stroke();
    _x.fillStyle=color;_x.beginPath();_x.moveTo(x,bY+bH/2);_x.lineTo(x-4,bY+bH/2-3);_x.lineTo(x-4,bY+bH/2+3);_x.fill();

    // Block label
    _x.fillStyle=color;_x.font='bold 7px SF Mono';_x.textAlign='center';
    const label=isSecret?`SECRET[${i}]`:isMsg?`MSG[${i-2}]`:isPad?'PAD':'EXTEND';
    _x.fillText(label,x+bW/2-2.5,bY+12);

    // State value
    const state=((_t*31+i*0x9E3779B9)>>>0)&0xFFFF;
    _x.fillStyle=mut;_x.font='7px SF Mono';
    _x.fillText(`h=${state.toString(16)}`,x+bW/2-2.5,bY+24);
    _x.textAlign='left';

    // Input from top (message block)
    _x.strokeStyle=color+'44';
    _x.beginPath();_x.moveTo(x+bW/2-2.5,bY-5);_x.lineTo(x+bW/2-2.5,bY);_x.stroke();
    _x.fillStyle=color+'33';_x.fillRect(x+5,bY-18,bW-15,13);
    _x.fillStyle=color;_x.font='6px SF Mono';_x.textAlign='center';
    _x.fillText(isSecret?'[secret]':isMsg?`m${i-2}`:'pad/ext',x+bW/2-2.5,bY-9);_x.textAlign='left';
  }

  // Output label
  const outX=5+bW*0.6+5+nBlocks*bW;
  _x.fillStyle='#f87171';_x.font='bold 9px SF Mono';
  _x.fillText('MAC',outX,bY+18);

  // === Attack Anatomy (middle) ===
  const aaY=bY+bH+30;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Length Extension Attack Steps',10,aaY);

  const attackSteps=[
    {step:'1',desc:'Attacker knows: H(secret || msg), len(secret), msg',color:'#60a5fa'},
    {step:'2',desc:'Reconstruct padding: msg || 0x80 || zeros || length',color:'#fbbf24'},
    {step:'3',desc:'Set internal state = known MAC output value',color:'#f87171'},
    {step:'4',desc:'Continue hashing: H_state(appended_data)',color:'#c084fc'},
    {step:'5',desc:'Result = valid MAC for (secret||msg||pad||append)',color:'#4ade80'}
  ];

  attackSteps.forEach((s,i)=>{
    const y=aaY+10+i*20;
    const isActive=Math.floor(_t/50)%attackSteps.length===i;
    _x.fillStyle=isActive?s.color+'33':'rgba(255,255,255,.02)';
    _x.fillRect(10,y,w*0.48-5,18);
    _x.fillStyle=isActive?s.color:mut;_x.font='9px SF Mono';
    _x.fillText(`[${s.step}] ${s.desc}`,14,y+13);
    if(isActive){
      _x.fillStyle=s.color;
      _x.beginPath();_x.arc(w*0.48,y+9,3,0,Math.PI*2);_x.fill();
    }
  });

  // === Vulnerable vs Immune Hashes (middle-right) ===
  const vhX=w*0.52,vhY=aaY;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Hash Function Vulnerability',vhX,vhY);

  const hashes=[
    {name:'MD5',bits:128,vulnerable:true,broken:true},
    {name:'SHA-1',bits:160,vulnerable:true,broken:true},
    {name:'SHA-256',bits:256,vulnerable:true,broken:false},
    {name:'SHA-512',bits:512,vulnerable:true,broken:false},
    {name:'SHA-3',bits:256,vulnerable:false,broken:false},
    {name:'BLAKE2',bits:256,vulnerable:false,broken:false},
    {name:'HMAC-*',bits:0,vulnerable:false,broken:false}
  ];

  const hhW=w*0.46,hhBarW=hhW-80;
  hashes.forEach((hf,i)=>{
    const y=vhY+10+i*16;
    _x.fillStyle=hf.vulnerable?'#f8717122':'#4ade8022';
    _x.fillRect(vhX,y,hhW,14);
    _x.fillStyle=hf.vulnerable?(hf.broken?'#f87171':'#fbbf24'):'#4ade80';
    _x.font='bold 8px SF Mono';_x.fillText(hf.name,vhX+4,y+10);
    // Status
    const status=hf.vulnerable?(hf.broken?'VULNERABLE+BROKEN':'VULNERABLE (MD construct)'):'IMMUNE';
    _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText(status,vhX+60,y+10);
    // Indicator
    _x.fillStyle=hf.vulnerable?'#f87171':'#4ade80';
    _x.beginPath();_x.arc(vhX+hhW-10,y+7,4,0,Math.PI*2);_x.fill();
  });

  // === MD Padding Visualization (bottom) ===
  const pdY=Math.max(aaY+115,vhY+130);
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Merkle-Damgard Padding (64-byte block)',10,pdY);

  const totalBytes=64;
  const byteW=Math.min(12,(w-20)/totalBytes);
  const msgLen=(_t%30)+5;
  for(let i=0;i<totalBytes;i++){
    const x=10+i*byteW;
    let color,label;
    if(i<msgLen){color='#4ade80';label=((0x41+i)&0x7F).toString(16)}
    else if(i===msgLen){color='#fbbf24';label='80'}
    else if(i<56){color=mut+'22';label='00'}
    else{color='#c084fc';label=((msgLen*8)>>(56-i)*8&0xFF).toString(16).padStart(2,'0').slice(-2)}
    _x.fillStyle=typeof color==='string'&&color.length<8?color+'33':color;
    _x.fillRect(x,pdY+10,byteW-1,18);
    _x.fillStyle=typeof color==='string'&&color.length<8?color:mut;
    _x.font='bold 6px SF Mono';_x.textAlign='center';
    _x.fillText(label,x+byteW/2,pdY+22);_x.textAlign='left';
  }

  // Legend
  const legY=pdY+34;
  [{c:'#4ade80',t:'Message'},{c:'#fbbf24',t:'0x80'},{c:mut,t:'Zero fill'},{c:'#c084fc',t:'Length (bits)'}].forEach((l,i)=>{
    const lx=10+i*90;
    _x.fillStyle=l.c;_x.fillRect(lx,legY,8,8);
    _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText(l.t,lx+12,legY+8);
  });

  // === HMAC Defense Diagram (bottom-right) ===
  const hmY=pdY+50;
  if(hmY+40<h){
    _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
    _x.fillText('HMAC = H(K xor opad || H(K xor ipad || msg))  -- immune to extension',10,hmY);
    const pipeW=w-20,pipeH=20;
    const stages=['K xor ipad','H_inner(msg)','K xor opad','H_outer','HMAC'];
    const stW=pipeW/stages.length;
    stages.forEach((s,i)=>{
      const x=10+i*stW;
      const progress=(_t%100)/100;
      const active=progress*stages.length>i&&progress*stages.length<i+1;
      _x.fillStyle=active?'#4ade8044':'rgba(255,255,255,.03)';
      _x.fillRect(x,hmY+8,stW-4,pipeH);
      _x.strokeStyle=active?'#4ade80':mut+'33';_x.strokeRect(x,hmY+8,stW-4,pipeH);
      _x.fillStyle=active?'#4ade80':mut;_x.font='bold 7px SF Mono';_x.textAlign='center';
      _x.fillText(s,x+stW/2-2,hmY+22);_x.textAlign='left';
      if(i<stages.length-1){_x.fillStyle=acc;_x.beginPath();_x.moveTo(x+stW-4,hmY+18);_x.lineTo(x+stW,hmY+15);_x.lineTo(x+stW,hmY+21);_x.fill()}
    });
  }

  requestAnimationFrame(draw);
}
draw();
})();
