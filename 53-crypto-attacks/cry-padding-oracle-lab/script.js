/**
 * Padding Oracle Lab — Workshop DIY v1.0
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas Sim
 */
const $=id=>document.getElementById(id);
const LANG={
  en:{title:'Padding Oracle Lab',subtitle:'Exploit CBC padding oracle to decrypt byte-by-byte',mainSection:'Padding Oracle Attack',mainDesc:'Simulate padding oracle on AES-CBC',ptLabel:'Secret Plaintext',ptHint:'This message will be encrypted; try to recover it',encrypt:'Encrypt',startAttack:'Start Attack',stop:'Stop',results:'Results',vizTitle:'Attack Visualization',vizHint:'Watch the oracle leak plaintext byte by byte',sectionA:'Attack Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',encrypted:'Message encrypted',attacking:'Attacking...',decrypted:'Decrypted!',padValid:'Padding valid',padInvalid:'Padding invalid',
    faq_q1:'What is a padding oracle?',faq_a1:'A server that reveals whether decrypted ciphertext has valid PKCS#7 padding. This tiny leak allows full decryption.',faq_q2:'How does the attack work?',faq_a2:'By modifying the previous ciphertext block and checking padding validity, the attacker can deduce each plaintext byte.',faq_q3:'Is this attack real?',faq_a3:'Yes! This was used against ASP.NET, TLS, and many other systems. It is the reason PKCS#7 padding must be authenticated.',
    howto_1:'Enter a secret message.',howto_2:'Click Encrypt to create the ciphertext.',howto_3:'Click Start Attack to begin byte-by-byte decryption.',howto_4:'Watch the canvas as each byte is recovered.',
    wiki_cbc:'CBC mode XORs each plaintext block with the previous ciphertext block before encryption.',wiki_pkcs7:'PKCS#7 padding fills the last block: if 3 bytes remain, pad with 03 03 03.',wiki_oracle:'The oracle returns true/false for valid padding, leaking information about the decrypted intermediate value.',
    mathExplain:'Padding Oracle Attack:\n\nC = IV || C1 || C2 || ... || Cn\nD(Ck) = Ik (intermediate value)\nPk = Ck-1 XOR Ik\n\nAttacker modifies Ck-1 byte by byte:\nFor each guess g (0..255):\n  Set Ck-1[last] = g\n  If oracle says valid padding:\n    Ik[last] = g XOR 0x01\n    Pk[last] = original_Ck-1[last] XOR Ik[last]\n\nRepeat for all bytes, all blocks.'},
  fr:{title:'Labo Oracle de Rembourrage',subtitle:'Exploitez l\'oracle de rembourrage CBC',mainSection:'Attaque Oracle',mainDesc:'Simulez l\'attaque sur AES-CBC',ptLabel:'Texte Clair Secret',ptHint:'Ce message sera chiffre; essayez de le recuperer',encrypt:'Chiffrer',startAttack:'Lancer Attaque',stop:'Arreter',results:'Resultats',vizTitle:'Visualisation',vizHint:'Regardez l\'oracle reveler le texte octet par octet',sectionA:'Reference',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',encrypted:'Message chiffre',attacking:'Attaque en cours...',decrypted:'Dechiffre!',padValid:'Rembourrage valide',padInvalid:'Rembourrage invalide',
    faq_q1:'Qu\'est-ce qu\'un oracle de rembourrage?',faq_a1:'Un serveur qui revele si le dechiffrement a un rembourrage PKCS#7 valide.',faq_q2:'Comment fonctionne l\'attaque?',faq_a2:'En modifiant le bloc precedent et verifiant le rembourrage, l\'attaquant deduit chaque octet.',faq_q3:'Attaque reelle?',faq_a3:'Oui! Utilisee contre ASP.NET, TLS et d\'autres systemes.',
    howto_1:'Entrez un message secret.',howto_2:'Cliquez Chiffrer.',howto_3:'Cliquez Lancer Attaque.',howto_4:'Regardez la recuperation.',
    wiki_cbc:'Le mode CBC XOR chaque bloc avec le bloc chiffre precedent.',wiki_pkcs7:'PKCS#7: si 3 octets restent, remplir avec 03 03 03.',wiki_oracle:'L\'oracle repond vrai/faux pour le rembourrage.',
    mathExplain:'Attaque Oracle de Rembourrage:\n\nC = IV || C1 || C2\nD(Ck) = Ik\nPk = Ck-1 XOR Ik\n\nModifier Ck-1 octet par octet pour deduire Ik.'},
  ar:{title:'مختبر هجوم الحشو',subtitle:'استغل هجوم الحشو لفك التشفير بايت ببايت',mainSection:'هجوم أوراكل الحشو',mainDesc:'حاكي هجوم الحشو على AES-CBC',ptLabel:'النص السري',ptHint:'سيتم تشفير هذه الرسالة، حاول استرجاعها',encrypt:'تشفير',startAttack:'بدء الهجوم',stop:'إيقاف',results:'النتائج',vizTitle:'تصور الهجوم',vizHint:'شاهد الأوراكل يسرّب النص بايت ببايت',sectionA:'مرجع الهجوم',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',encrypted:'تم التشفير',attacking:'جاري الهجوم...',decrypted:'تم فك التشفير!',padValid:'حشو صالح',padInvalid:'حشو غير صالح',
    faq_q1:'ما هو أوراكل الحشو؟',faq_a1:'خادم يكشف ما إذا كان الحشو PKCS#7 صحيحا بعد فك التشفير.',faq_q2:'كيف يعمل الهجوم؟',faq_a2:'بتعديل كتلة النص المشفر السابقة والتحقق من صحة الحشو.',faq_q3:'هل الهجوم حقيقي؟',faq_a3:'نعم! استُخدم ضد ASP.NET وTLS وأنظمة أخرى.',
    howto_1:'أدخل رسالة سرية.',howto_2:'اضغط تشفير.',howto_3:'اضغط بدء الهجوم.',howto_4:'شاهد استرجاع كل بايت.',
    wiki_cbc:'وضع CBC يطبق XOR على كل كتلة مع الكتلة المشفرة السابقة.',wiki_pkcs7:'PKCS#7: إذا بقيت 3 بايتات، املأ بـ 03 03 03.',wiki_oracle:'الأوراكل يرد صحيح/خطأ للحشو.',
    mathExplain:'هجوم أوراكل الحشو:\n\nC = IV || C1 || C2\nD(Ck) = Ik\nPk = Ck-1 XOR Ik\n\nعدّل Ck-1 بايت ببايت لاستنتاج Ik.'}
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
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('cry-pad-lang',lang)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('cry-pad-theme',name)}catch{}log(`${LANG[currentLang].themeChanged} ${name}`,'info')}
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const t=audioCtx.currentTime;if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,t+.3);o.start(t);o.stop(t+.3)}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,t+.25);o.start(t);o.stop(t+.25)}}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success')}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(panel,overlay){panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'))}

/* ═══════ SIMULATED CBC ENCRYPTION ═══════ */
let cipherBlocks=[],ivBlock=[],secretKey=[],blockSize=8,running=false,recoveredBytes=[],currentByteIdx=-1,currentGuess=0;
function randBytes(n){const a=[];for(let i=0;i<n;i++)a.push(Math.floor(Math.random()*256));return a}
function xorBlocks(a,b){return a.map((v,i)=>v^b[i])}
function simpleBlockEncrypt(block,key){return block.map((v,i)=>(v+key[i%key.length]+37)&0xff)}
function simpleBlockDecrypt(block,key){return block.map((v,i)=>(v-key[i%key.length]-37+512)&0xff)}
function pkcs7Pad(data){const pad=blockSize-(data.length%blockSize);const r=[...data];for(let i=0;i<pad;i++)r.push(pad);return r}
function checkPadding(block){const last=block[block.length-1];if(last<1||last>blockSize)return false;for(let i=0;i<last;i++)if(block[block.length-1-i]!==last)return false;return true}

function doEncrypt(){
  const pt=$('ptInput').value;const bytes=Array.from(pt).map(c=>c.charCodeAt(0));
  const padded=pkcs7Pad(bytes);secretKey=randBytes(blockSize);ivBlock=randBytes(blockSize);cipherBlocks=[];
  let prev=ivBlock;
  for(let i=0;i<padded.length;i+=blockSize){const block=padded.slice(i,i+blockSize);const xored=xorBlocks(block,prev);const enc=simpleBlockEncrypt(xored,secretKey);cipherBlocks.push(enc);prev=enc}
  recoveredBytes=[];currentByteIdx=-1;currentGuess=0;
  const s=LANG[currentLang];log(s.encrypted,'success');
  $('resultsBox').textContent=`IV: [${ivBlock.map(b=>b.toString(16).padStart(2,'0')).join(' ')}]\nBlocks: ${cipherBlocks.length}\nCiphertext: [${cipherBlocks.flat().map(b=>b.toString(16).padStart(2,'0')).join(' ')}]`;
  drawCanvas()
}

function paddingOracle(modifiedPrev,cipherBlock){
  const decrypted=simpleBlockDecrypt(cipherBlock,secretKey);const result=xorBlocks(decrypted,modifiedPrev);return checkPadding(result)
}

function startAttack(){
  if(cipherBlocks.length===0){doEncrypt()}
  running=true;recoveredBytes=new Array(cipherBlocks.length*blockSize).fill(null);
  const s=LANG[currentLang];log(s.attacking,'info');showToast(s.attacking);
  let blockIdx=0,bytePos=blockSize-1,intermediateValues=new Array(blockSize).fill(0);
  function attackStep(){
    if(!running)return;
    const prevBlock=blockIdx===0?ivBlock:cipherBlocks[blockIdx-1];const currBlock=cipherBlocks[blockIdx];
    const padVal=blockSize-bytePos;const modified=[...prevBlock];
    // Set already-known bytes
    for(let i=blockSize-1;i>bytePos;i--)modified[i]=intermediateValues[i]^padVal;
    modified[bytePos]=currentGuess;
    const globalIdx=blockIdx*blockSize+bytePos;
    if(paddingOracle(modified,currBlock)){
      intermediateValues[bytePos]=currentGuess^padVal;
      const plainByte=prevBlock[bytePos]^intermediateValues[bytePos];
      recoveredBytes[globalIdx]=plainByte;
      log(`Byte ${globalIdx}: 0x${plainByte.toString(16).padStart(2,'0')} = '${plainByte>=32&&plainByte<127?String.fromCharCode(plainByte):'.'}'`,'success');
      currentGuess=0;bytePos--;
      if(bytePos<0){blockIdx++;bytePos=blockSize-1;intermediateValues=new Array(blockSize).fill(0);
        if(blockIdx>=cipherBlocks.length){running=false;hideToast();const recovered=recoveredBytes.filter(b=>b!==null).map(b=>b>=32&&b<127?String.fromCharCode(b):'.').join('');
          $('resultsBox').textContent+=`\n\nRecovered: "${recovered}"\n\n${s.decrypted}`;log(s.decrypted,'success');drawCanvas();return}
      }
    }else{currentGuess++;if(currentGuess>255){log('Byte exhausted, skipping','error');currentGuess=0;bytePos--;
      if(bytePos<0){blockIdx++;bytePos=blockSize-1;intermediateValues=new Array(blockSize).fill(0);if(blockIdx>=cipherBlocks.length){running=false;hideToast();drawCanvas();return}}
    }}
    drawCanvas();setTimeout(attackStep,5)
  }
  attackStep()
}

/* ═══════ CANVAS ═══════ */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawCanvas(){
  if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),text=getCS('--text'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText('Padding Oracle Attack',10,22);
  // Draw blocks
  const totalBytes=cipherBlocks.length*blockSize;if(totalBytes===0)return;
  const cellW=Math.min(40,(w-20)/totalBytes),cellH=40,startY=50;
  // IV
  ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('IV',10,startY-4);
  ivBlock.forEach((b,i)=>{ctx.fillStyle=`${accent}22`;ctx.fillRect(10+i*cellW,startY,cellW-2,cellH);ctx.fillStyle=muted;ctx.font='9px monospace';ctx.fillText(b.toString(16).padStart(2,'0'),12+i*cellW,startY+25)});
  // Cipher blocks
  ctx.fillStyle=muted;ctx.fillText('Ciphertext',10,startY+cellH+14);
  cipherBlocks.flat().forEach((b,i)=>{ctx.fillStyle=`${accent}22`;ctx.fillRect(10+i*cellW,startY+cellH+20,cellW-2,cellH);ctx.fillStyle=muted;ctx.font='9px monospace';ctx.fillText(b.toString(16).padStart(2,'0'),12+i*cellW,startY+cellH+45)});
  // Recovered plaintext
  ctx.fillStyle=accent;ctx.fillText('Recovered Plaintext',10,startY+2*cellH+50);
  recoveredBytes.forEach((b,i)=>{
    const isRecovered=b!==null;ctx.fillStyle=isRecovered?`${accent}44`:'rgba(255,255,255,.05)';
    ctx.fillRect(10+i*cellW,startY+2*cellH+56,cellW-2,cellH);
    if(isRecovered){ctx.fillStyle=accent;ctx.font='bold 11px monospace';const ch=b>=32&&b<127?String.fromCharCode(b):'.';ctx.fillText(ch,14+i*cellW,startY+2*cellH+80)}
  });
  // Progress
  const recovered=recoveredBytes.filter(b=>b!==null).length;const pct=totalBytes>0?(recovered/totalBytes*100).toFixed(0):0;
  ctx.fillStyle=text;ctx.font='12px Tajawal';ctx.fillText(`Progress: ${recovered}/${totalBytes} bytes (${pct}%)`,10,startY+3*cellH+80);
  // Query visualization
  if(running){ctx.fillStyle='#f8717144';const qy=startY+3*cellH+95;ctx.fillRect(10,qy,w-20,30);ctx.fillStyle='#f87171';ctx.font='11px monospace';ctx.fillText(`Trying byte guess: 0x${currentGuess.toString(16).padStart(2,'0')} (${currentGuess}/255)`,14,qy+20);
    const bar=(currentGuess/255)*(w-24);ctx.fillStyle='#f8717166';ctx.fillRect(12,qy+24,bar,4)}
}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'CBC Mode',p:s.wiki_cbc},{t:'PKCS#7',p:s.wiki_pkcs7},{t:'Padding Oracle',p:s.wiki_oracle}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'CBC',p:LANG[currentLang].wiki_cbc},{t:'PKCS#7',p:LANG[currentLang].wiki_pkcs7},{t:'Oracle',p:LANG[currentLang].wiki_oracle}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-pad-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-pad-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};
  $('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})}});
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  $('encryptBtn').onclick=doEncrypt;$('attackBtn').onclick=startAttack;$('stopBtn').onclick=()=>{running=false;hideToast();log('Attack stopped','info')};
  buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()
});

/* ═══════ ENHANCED PADDING ORACLE VISUALIZATION (IIFE) ═══════ */
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

// Simulate oracle queries distribution
let _oracleHist=new Array(256).fill(0);
let _xorMatrix=[];
function buildXorMatrix(){
  _xorMatrix=[];
  for(let i=0;i<16;i++){
    const row=[];
    for(let j=0;j<16;j++)row.push((i*16+j)^((i+j+_t)&0xFF));
    _xorMatrix.push(row);
  }
}

function draw(){
  const w=_c.getBoundingClientRect().width,h=_c.getBoundingClientRect().height;
  const acc=_gc('--accent'),mut=_gc('--text-muted'),txt=_gc('--text');
  _x.clearRect(0,0,w,h);_t++;

  // === CBC Mode Block Diagram (top) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('CBC Decryption Pipeline (vulnerable to padding oracle)',10,16);

  const nBlocks=4,bW=Math.min(120,(w-80)/nBlocks),bH=35,bY=30;
  for(let i=0;i<nBlocks;i++){
    const x=20+i*(bW+15);
    // Ciphertext block
    _x.fillStyle='#f8717122';_x.fillRect(x,bY,bW,bH);
    _x.strokeStyle='#f8717166';_x.strokeRect(x,bY,bW,bH);
    _x.fillStyle='#f87171';_x.font='bold 9px SF Mono';_x.textAlign='center';
    _x.fillText(i===0?'IV':`C${i}`,x+bW/2,bY+14);
    // Animated bytes
    const animByte=((0xAB+_t*3+i*47)&0xFF).toString(16).padStart(2,'0');
    _x.fillStyle=mut;_x.font='8px SF Mono';
    _x.fillText(`0x${animByte}...`,x+bW/2,bY+28);
    _x.textAlign='left';

    // Decrypt box
    const dY=bY+bH+12;
    _x.fillStyle='#60a5fa22';_x.fillRect(x+bW*0.15,dY,bW*0.7,22);
    _x.strokeStyle='#60a5fa66';_x.strokeRect(x+bW*0.15,dY,bW*0.7,22);
    _x.fillStyle='#60a5fa';_x.font='bold 8px SF Mono';_x.textAlign='center';
    _x.fillText('D_K',x+bW/2,dY+14);_x.textAlign='left';

    // XOR symbol
    const xorY=dY+28;
    _x.fillStyle='#fbbf24';_x.font='bold 12px SF Mono';_x.textAlign='center';
    _x.fillText('\u2295',x+bW/2,xorY+10);_x.textAlign='left';

    // Arrow from prev ciphertext
    if(i>0){
      _x.strokeStyle='#f87171';_x.setLineDash([2,2]);
      const prevX=20+(i-1)*(bW+15)+bW/2;
      _x.beginPath();_x.moveTo(prevX,bY+bH);_x.lineTo(prevX,xorY+2);_x.lineTo(x+bW/2-8,xorY+2);_x.stroke();
      _x.setLineDash([]);
    }

    // Plaintext output
    const pY=xorY+18;
    const isRecovering=(_t%nBlocks)===i;
    _x.fillStyle=isRecovering?'#4ade8044':'rgba(255,255,255,.04)';
    _x.fillRect(x,pY,bW,bH);
    _x.strokeStyle=isRecovering?'#4ade80':mut+'33';_x.strokeRect(x,pY,bW,bH);
    _x.fillStyle=isRecovering?'#4ade80':mut;_x.font='bold 9px SF Mono';_x.textAlign='center';
    _x.fillText(`P${i+1}`,x+bW/2,pY+14);_x.textAlign='left';

    // Down arrows
    _x.strokeStyle=mut+'44';
    _x.beginPath();_x.moveTo(x+bW/2,bY+bH);_x.lineTo(x+bW/2,dY);_x.stroke();
    _x.beginPath();_x.moveTo(x+bW/2,dY+22);_x.lineTo(x+bW/2,xorY);_x.stroke();
    _x.beginPath();_x.moveTo(x+bW/2,xorY+16);_x.lineTo(x+bW/2,pY);_x.stroke();
  }

  // === PKCS#7 Padding Visualization (middle-left) ===
  const padY=bY+bH+100,padX=10,padW=w*0.45;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('PKCS#7 Padding Values',padX,padY);
  for(let padVal=1;padVal<=8;padVal++){
    const y=padY+8+(padVal-1)*18;
    const totalBytes=8;
    const cW=padW/totalBytes;
    for(let b=0;b<totalBytes;b++){
      const isPad=b>=totalBytes-padVal;
      _x.fillStyle=isPad?'#fbbf2433':'#60a5fa11';
      _x.fillRect(padX+b*cW,y,cW-2,14);
      _x.strokeStyle=isPad?'#fbbf2466':mut+'22';_x.strokeRect(padX+b*cW,y,cW-2,14);
      if(isPad){
        _x.fillStyle='#fbbf24';_x.font='bold 8px SF Mono';_x.textAlign='center';
        _x.fillText(`0${padVal}`,padX+b*cW+cW/2,y+11);_x.textAlign='left';
      }
    }
    _x.fillStyle=mut;_x.font='8px Tajawal';
    _x.fillText(`pad=${padVal}`,padX+padW+4,y+11);
  }

  // === Oracle Query Heatmap (middle-right) ===
  const oqX=w*0.52,oqY=padY;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Oracle Query Byte Guesses (0x00-0xFF)',oqX,oqY);
  buildXorMatrix();
  const mCW=(w*0.46)/16,mCH=9;
  for(let i=0;i<16;i++){
    for(let j=0;j<16;j++){
      const val=_xorMatrix[i][j];
      const isValid=val===1||val===(_t%256);
      _x.fillStyle=isValid?'#4ade8088':`rgba(${val},${60},${255-val},.15)`;
      _x.fillRect(oqX+j*mCW,oqY+8+i*mCH,mCW-1,mCH-1);
    }
  }
  // Current guess highlight
  const guessVal=_t%256;
  const gi=Math.floor(guessVal/16),gj=guessVal%16;
  _x.strokeStyle='#f87171';_x.lineWidth=2;
  _x.strokeRect(oqX+gj*mCW-1,oqY+8+gi*mCH-1,mCW+1,mCH+1);_x.lineWidth=1;
  _x.fillStyle=mut;_x.font='9px SF Mono';
  _x.fillText(`Testing: 0x${guessVal.toString(16).padStart(2,'0')}  (${guessVal}/255)`,oqX,oqY+8+16*mCH+12);

  // === XOR Intermediate Value Recovery (bottom) ===
  const ixY=Math.max(padY+155,oqY+8+16*mCH+25);
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Intermediate Value Recovery: I[k] = guess XOR pad_value',10,ixY);

  const nBytes=8;
  const ixCW=Math.min(60,(w-20)/nBytes);
  for(let i=0;i<nBytes;i++){
    const x=10+i*ixCW;
    const recovered=i<Math.floor((_t%80)/10);
    const current=i===Math.floor((_t%80)/10);
    // Guess value
    _x.fillStyle='#f8717122';_x.fillRect(x,ixY+10,ixCW-4,22);
    _x.fillStyle='#f87171';_x.font='bold 8px SF Mono';_x.textAlign='center';
    _x.fillText(`g=${((_t+i*19)&0xFF).toString(16)}`,x+ixCW/2-2,ixY+24);
    // XOR arrow
    _x.fillStyle='#fbbf24';_x.font='bold 10px SF Mono';
    _x.fillText('\u2295',x+ixCW/2-2,ixY+40);
    // Intermediate value
    _x.fillStyle=recovered?'#4ade8044':current?'#fbbf2444':'rgba(255,255,255,.04)';
    _x.fillRect(x,ixY+46,ixCW-4,22);
    if(recovered){
      _x.fillStyle='#4ade80';_x.font='bold 9px SF Mono';
      _x.fillText(`0x${((0xDE+i*0x11)&0xFF).toString(16)}`,x+ixCW/2-2,ixY+60);
    }else if(current){
      _x.fillStyle='#fbbf24';_x.fillText('?',x+ixCW/2-2,ixY+60);
    }
    _x.textAlign='left';
  }

  requestAnimationFrame(draw);
}
draw();
})();
