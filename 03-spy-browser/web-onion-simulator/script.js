/**
 * Workshop DIY — Onion Simulator v1.2
 * Tor Visualization — Watch encrypted messages bounce through relay nodes
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3l-6.5-2.4l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.4l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7H204v3.6h126.8zM330.8,203.4H161.7v3.6h169.1zM330.8,211H77.1v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);}else if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);}}

const LANG={
  en:{title:'Onion Simulator',subtitle:'🧅 Watch encrypted messages bounce through relay nodes',disconnected:'Disconnected',connected:'Connected',mainSection:'Tor Network Visualization',mainDesc:'Send a message through the onion routing network',sectionA:'How Onion Routing Works',sectionB:'Encryption Layers',sectionC:'Circuit Builder',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is Onion Simulator?',faq_a1:'A Tor network visualization showing how messages are encrypted and routed.',faq_q2:'Is this real Tor?',faq_a2:'No. Simulation for educational purposes.',faq_q3:'How do I change the language?',faq_a3:'Open Settings and pick your language.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Type a message in the input field.',howto_2:'Click Send to watch it route through nodes.',howto_3:'Watch encryption layers peel off at each hop.',howto_4:'Build custom circuits in Section C.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual.',wiki_log_title:'📜 Activity Log',wiki_log:'Timestamped log.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'Local-first.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'🧅 Onion Simulator ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',sendBtn:'Send through Tor',onionText:'Onion routing encrypts your message in multiple layers. Each relay peels off one layer.',encryptionText:'Layer 1 (Entry): Knows your IP. Layer 2 (Middle): Knows nothing. Layer 3 (Exit): Sees destination.',circuitText:'Build custom circuits by selecting relay nodes.',newCircuitBtn:'Build New Circuit',encrypting:'Encrypting message...',routing:'Routing through Tor...',delivered:'Message delivered!',layer:'Layer',peeled:'peeled off at',entryNode:'Entry Guard',middleNode:'Middle Relay',exitNode:'Exit Node',destination:'Destination',you:'You',},
  fr:{title:'Simulateur Oignon',subtitle:'🧅 Regardez les messages chiffres rebondir entre les relais',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Visualisation Reseau Tor',mainDesc:'Envoyez un message a travers le reseau oignon',sectionA:'Comment fonctionne le routage oignon',sectionB:'Couches de chiffrement',sectionC:'Constructeur de circuit',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que le Simulateur Oignon ?',faq_a1:'Une visualisation du reseau Tor.',faq_q2:'C\'est du vrai Tor ?',faq_a2:'Non. Simulation educative.',faq_q3:'Comment changer la langue ?',faq_a3:'Ouvrez Parametres.',faq_q4:'Mes donnees sont privees ?',faq_a4:'Oui. Tout est local.',howto_1:'Tapez un message.',howto_2:'Cliquez Envoyer.',howto_3:'Regardez les couches se detacher.',howto_4:'Construisez des circuits.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'🧅 Simulateur Oignon pret !',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',sendBtn:'Envoyer via Tor',onionText:'Le routage oignon chiffre votre message en couches multiples.',encryptionText:'Couche 1 (Entree): connait votre IP. Couche 2 (Milieu): ne sait rien. Couche 3 (Sortie): voit la destination.',circuitText:'Construisez des circuits personnalises.',newCircuitBtn:'Nouveau Circuit',encrypting:'Chiffrement...',routing:'Routage Tor...',delivered:'Message livre !',layer:'Couche',peeled:'retiree a',entryNode:'Garde d\'entree',middleNode:'Relai intermediaire',exitNode:'Noeud de sortie',destination:'Destination',you:'Vous',},
  ar:{title:'محاكي البصل',subtitle:'🧅 شاهد الرسائل المشفرة تتنقل عبر عقد التتابع',disconnected:'غير متصل',connected:'متصل',mainSection:'تصور شبكة Tor',mainDesc:'ارسل رسالة عبر شبكة التوجيه البصلي',sectionA:'كيف يعمل التوجيه البصلي',sectionB:'طبقات التشفير',sectionC:'بناء الدائرة',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو محاكي البصل؟',faq_a1:'تصور لشبكة Tor يوضح كيفية تشفير الرسائل وتوجيهها.',faq_q2:'هل هذا Tor حقيقي؟',faq_a2:'لا. محاكاة تعليمية.',faq_q3:'كيف اغير اللغة؟',faq_a3:'افتح الاعدادات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء محلي.',howto_1:'اكتب رسالة.',howto_2:'انقر ارسال.',howto_3:'شاهد طبقات التشفير تتقشر.',howto_4:'ابن دوائر مخصصة.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي اولا.',working:'جار…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',ready:'🧅 محاكي البصل جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',sendBtn:'ارسال عبر Tor',onionText:'التوجيه البصلي يشفر رسالتك في طبقات متعددة.',encryptionText:'طبقة 1 (مدخل): تعرف IP. طبقة 2 (وسط): لا تعرف شيئا. طبقة 3 (مخرج): ترى الوجهة.',circuitText:'ابن دوائر مخصصة.',newCircuitBtn:'دائرة جديدة',encrypting:'جاري التشفير...',routing:'جاري التوجيه...',delivered:'تم تسليم الرسالة!',layer:'طبقة',peeled:'ازيلت عند',entryNode:'حارس المدخل',middleNode:'عقدة وسطى',exitNode:'عقدة الخروج',destination:'الوجهة',you:'انت',}
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
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info');}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const txt=$('statusText'),pill=$('statusPill'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');});});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

/* ═══════ ONION SIMULATOR ═══════ */

const COUNTRIES = ['🇺🇸 USA','🇩🇪 Germany','🇳🇱 Netherlands','🇨🇭 Switzerland','🇸🇪 Sweden','🇫🇮 Finland','🇮🇸 Iceland','🇷🇴 Romania','🇫🇷 France','🇯🇵 Japan','🇸🇬 Singapore','🇧🇷 Brazil'];
const LAYER_COLORS = ['#ff4444','#ff8800','#ffcc00','#33cc55'];

let circuit = [];
let animating = false;

function pickRandom(arr, count) {
  const copy = [...arr]; const result = [];
  for (let i = 0; i < count && copy.length; i++) { const idx = Math.floor(Math.random() * copy.length); result.push(copy.splice(idx, 1)[0]); }
  return result;
}

function buildCircuit() {
  const nodes = pickRandom(COUNTRIES, 3);
  circuit = [
    { label: LANG[currentLang].you, country: '🏠', x: 0, y: 0.5, type: 'origin' },
    { label: LANG[currentLang].entryNode, country: nodes[0], x: 0.25, y: 0.3, type: 'entry' },
    { label: LANG[currentLang].middleNode, country: nodes[1], x: 0.5, y: 0.7, type: 'middle' },
    { label: LANG[currentLang].exitNode, country: nodes[2], x: 0.75, y: 0.3, type: 'exit' },
    { label: LANG[currentLang].destination, country: '🌐', x: 1, y: 0.5, type: 'dest' },
  ];
  return circuit;
}

function drawNetwork(canvas, ctx, highlight = -1, msgProgress = -1) {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#060d1a'; ctx.fillRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = '#0a1a30'; ctx.lineWidth = 0.5;
  for (let i = 0; i < w; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
  for (let i = 0; i < h; i += 30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

  const pad = 60;
  const nodes = circuit.map(n => ({ ...n, px: pad + n.x * (w - pad * 2), py: pad + n.y * (h - pad * 2) }));

  // Draw connections
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i], b = nodes[i + 1];
    ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py);
    ctx.strokeStyle = i < highlight ? '#33cc5566' : (i === highlight ? LAYER_COLORS[Math.min(i, 3)] + '88' : '#1a3355');
    ctx.lineWidth = i === highlight ? 3 : 1.5;
    ctx.setLineDash(i >= highlight && highlight >= 0 ? [6, 4] : []);
    ctx.stroke(); ctx.setLineDash([]);
  }

  // Draw message packet
  if (msgProgress >= 0 && msgProgress < nodes.length - 1) {
    const a = nodes[msgProgress], b = nodes[msgProgress + 1];
    const t = 0.5;
    const mx = a.px + (b.px - a.px) * t, my = a.py + (b.py - a.py) * t;
    const layers = 3 - msgProgress;
    for (let l = layers; l >= 0; l--) {
      ctx.beginPath(); ctx.arc(mx, my, 12 + l * 6, 0, Math.PI * 2);
      ctx.fillStyle = LAYER_COLORS[l] + '44'; ctx.fill();
      ctx.strokeStyle = LAYER_COLORS[l]; ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.fillStyle = '#fff'; ctx.font = '10px Orbitron'; ctx.textAlign = 'center';
    ctx.fillText('📨', mx, my + 4);
  }

  // Draw nodes
  nodes.forEach((n, i) => {
    const active = i <= highlight + 1;
    const radius = n.type === 'origin' || n.type === 'dest' ? 20 : 24;

    // Glow
    if (active) {
      ctx.beginPath(); ctx.arc(n.px, n.py, radius + 8, 0, Math.PI * 2);
      ctx.fillStyle = (n.type === 'entry' ? '#ff444422' : n.type === 'middle' ? '#ff880022' : n.type === 'exit' ? '#ffcc0022' : '#33cc5522');
      ctx.fill();
    }

    // Node circle
    ctx.beginPath(); ctx.arc(n.px, n.py, radius, 0, Math.PI * 2);
    ctx.fillStyle = active ? '#1a2a44' : '#0d1522';
    ctx.fill();
    ctx.strokeStyle = n.type === 'entry' ? '#ff4444' : n.type === 'middle' ? '#ff8800' : n.type === 'exit' ? '#ffcc00' : '#33cc55';
    ctx.lineWidth = active ? 3 : 1.5; ctx.stroke();

    // Icon
    ctx.fillStyle = '#fff'; ctx.font = '14px serif'; ctx.textAlign = 'center';
    const icon = n.type === 'origin' ? '👤' : n.type === 'dest' ? '🌐' : '🧅';
    ctx.fillText(icon, n.px, n.py + 5);

    // Label
    ctx.fillStyle = '#aabbcc'; ctx.font = '9px Orbitron'; ctx.textAlign = 'center';
    ctx.fillText(n.label, n.px, n.py + radius + 14);
    ctx.fillStyle = '#667788'; ctx.font = '8px monospace';
    ctx.fillText(n.country, n.px, n.py + radius + 26);
  });

  ctx.textAlign = 'start';
}

function fakeEncrypt(msg, layers) {
  let result = msg;
  for (let i = 0; i < layers; i++) {
    result = btoa(unescape(encodeURIComponent(result))).slice(0, 40) + '...';
  }
  return result;
}

async function sendMessage() {
  if (animating) return;
  animating = true;
  const s = LANG[currentLang];
  const input = $('msgInput');
  const msg = input ? input.value.trim() : 'Hello';
  const canvas = $('torCanvas');
  const layerInfo = $('layerInfo');
  if (!canvas) { animating = false; return; }
  const ctx = canvas.getContext('2d');

  buildCircuit();
  showToast(s.encrypting);
  log(`🔐 ${s.encrypting}`, 'tx');
  setStatus(true);

  if (layerInfo) { layerInfo.style.display = 'block'; layerInfo.innerHTML = ''; }

  // Show encryption layers being added
  const encrypted = [];
  encrypted.push(msg);
  for (let i = 0; i < 3; i++) {
    encrypted.push(fakeEncrypt(encrypted[encrypted.length - 1], 1));
    await sleep(400);
    if (layerInfo) {
      const div = document.createElement('div');
      div.style.cssText = `padding:.3rem .5rem;margin:.2rem 0;border-radius:4px;border-left:3px solid ${LAYER_COLORS[2 - i]};font-size:.75rem;font-family:monospace;word-break:break-all;`;
      div.innerHTML = `<strong>${s.layer} ${i + 1}:</strong> ${encrypted[encrypted.length - 1]}`;
      layerInfo.appendChild(div);
    }
    log(`🔐 ${s.layer} ${i + 1} added`, 'info');
  }

  await sleep(300);
  showToast(s.routing);
  log(`🧅 ${s.routing}`, 'tx');

  // Animate through nodes
  for (let hop = 0; hop < 4; hop++) {
    drawNetwork(canvas, ctx, hop, hop);
    await sleep(600);
    drawNetwork(canvas, ctx, hop);
    if (hop < 3) {
      log(`📦 ${s.layer} ${3 - hop} ${s.peeled} ${circuit[hop + 1].label} (${circuit[hop + 1].country})`, 'rx');
    }
    await sleep(400);
  }

  // Final state
  drawNetwork(canvas, ctx, 4);

  // Show delivered message
  if (layerInfo) {
    const div = document.createElement('div');
    div.style.cssText = 'padding:.5rem;margin-top:.5rem;border-radius:4px;background:#33cc5522;border:1px solid #33cc55;font-size:.8rem;text-align:center;';
    div.innerHTML = `✅ <strong>${s.delivered}</strong><br><span style="font-family:monospace;">${msg}</span>`;
    layerInfo.appendChild(div);
  }

  hideToast();
  log(`✅ ${s.delivered}`, 'success');
  animating = false;
}

function buildNewCircuit() {
  buildCircuit();
  const canvas = $('torCanvas');
  if (canvas) drawNetwork(canvas, canvas.getContext('2d'));
  const info = $('circuitInfo');
  if (info) {
    info.innerHTML = circuit.map((n, i) => `<span style="color:${['#33cc55','#ff4444','#ff8800','#ffcc00','#33cc55'][i]};">${n.country} ${n.label}</span>`).join(' → ');
  }
  log('🔄 New circuit built: ' + circuit.map(n => n.country).join(' → '), 'success');
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang');const st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initHijriDate();

  // App-specific
  buildCircuit();
  const canvas=$('torCanvas');if(canvas)drawNetwork(canvas,canvas.getContext('2d'));
  const sendBtn=$('sendBtn');if(sendBtn)sendBtn.onclick=sendMessage;
  const newCircuitBtn=$('newCircuitBtn');if(newCircuitBtn)newCircuitBtn.onclick=buildNewCircuit;

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Onion Layer Encryption Visualizer ═══════ */
(function(){
let lCanvas,lCtx;const layerParticles=[];
function createLC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Onion Layer Encryption Visualizer</div>';
  const c=document.createElement('canvas');c.width=620;c.height=300;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;cursor:pointer;';
  w.appendChild(c);t.appendChild(w);return c;
}
function drawL(){
  if(!lCtx)return;const w=lCanvas.width,h=lCanvas.height,cx=w/2,cy=h/2;
  lCtx.fillStyle='rgba(6,13,26,0.1)';lCtx.fillRect(0,0,w,h);
  lCtx.strokeStyle='#0a1a30';lCtx.lineWidth=0.3;
  for(let i=0;i<w;i+=25){lCtx.beginPath();lCtx.moveTo(i,0);lCtx.lineTo(i,h);lCtx.stroke();}
  for(let i=0;i<h;i+=25){lCtx.beginPath();lCtx.moveTo(0,i);lCtx.lineTo(w,i);lCtx.stroke();}
  const layers=[
    {r:110,color:'#ff4444',label:'Layer 3: Exit Encryption',speed:0.003},
    {r:80,color:'#ff8800',label:'Layer 2: Middle Encryption',speed:0.005},
    {r:50,color:'#ffcc00',label:'Layer 1: Entry Encryption',speed:0.008},
    {r:20,color:'#33cc55',label:'Plaintext Message',speed:0},
  ];
  const t=Date.now()/1000;
  layers.forEach((l,idx)=>{
    const segments=12+idx*4;
    for(let s=0;s<segments;s++){
      const a=(s/segments)*Math.PI*2+t*l.speed*(idx%2===0?1:-1);
      const a2=((s+0.8)/segments)*Math.PI*2+t*l.speed*(idx%2===0?1:-1);
      lCtx.beginPath();lCtx.arc(cx,cy,l.r,a,a2);
      lCtx.strokeStyle=l.color+(idx===3?'cc':'66');lCtx.lineWidth=idx===3?4:8-idx;lCtx.stroke();
    }
    const labelAngle=t*0.3+idx*1.2;
    const lx=cx+Math.cos(labelAngle)*(l.r+18);const ly=cy+Math.sin(labelAngle)*(l.r+18);
    lCtx.fillStyle=l.color;lCtx.font='8px Orbitron,monospace';lCtx.textAlign='center';
    lCtx.fillText(l.label,lx,ly);
    // Orbiting data bits
    for(let b=0;b<3;b++){
      const ba=t*(0.5+idx*0.2)+b*(Math.PI*2/3);
      const bx=cx+Math.cos(ba)*l.r,by=cy+Math.sin(ba)*l.r;
      lCtx.beginPath();lCtx.arc(bx,by,2+idx*0.5,0,Math.PI*2);
      lCtx.fillStyle=l.color;lCtx.fill();
    }
  });
  // Center icon
  lCtx.fillStyle='#fff';lCtx.font='16px serif';lCtx.textAlign='center';lCtx.fillText('📨',cx,cy+6);
  // Particles
  for(let i=layerParticles.length-1;i>=0;i--){
    const p=layerParticles[i];p.life-=0.01;p.r+=0.5;p.angle+=p.speed;
    if(p.life<=0){layerParticles.splice(i,1);continue;}
    const px=cx+Math.cos(p.angle)*p.r,py=cy+Math.sin(p.angle)*p.r;
    lCtx.globalAlpha=p.life;lCtx.beginPath();lCtx.arc(px,py,3,0,Math.PI*2);
    lCtx.fillStyle=p.color;lCtx.fill();lCtx.globalAlpha=1;
  }
  lCtx.fillStyle='rgba(255,255,255,0.3)';lCtx.font='8px monospace';lCtx.textAlign='left';
  lCtx.fillText('Layers: 3 | Cipher: AES-256 | Key Exchange: Curve25519',10,h-8);
  requestAnimationFrame(drawL);
}
function initLC(){lCanvas=createLC();if(!lCanvas)return;lCtx=lCanvas.getContext('2d');
  lCanvas.addEventListener('click',()=>{
    const colors=['#ff4444','#ff8800','#ffcc00','#33cc55'];
    for(let i=0;i<20;i++)layerParticles.push({r:20+Math.random()*30,angle:Math.random()*Math.PI*2,
      speed:(Math.random()-0.5)*0.05,life:1,color:colors[Math.floor(Math.random()*4)]});
  });drawL();}
setTimeout(initLC,1500);
})();
