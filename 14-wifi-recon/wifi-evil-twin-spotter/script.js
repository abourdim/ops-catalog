/**
 * Evil Twin Spotter — AP Verifier
 * AP comparison, mismatch alert
 * Workshop DIY — Template v1.2 + App Logic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7zm21,.-1.6h-6.5v3.2h6.5zm-13,.16.2h-3.2v-16.2h3.2zm19.5,0h-3.2v-16.2h3.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const tt=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);o.start(tt);o.stop(tt+0.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.3);o.start(tt);o.stop(tt+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,tt+0.25);o.start(tt);o.stop(tt+0.25)}}
const LANG={
en:{title:'Evil Twin Spotter — AP Verifier',subtitle:'Detect rogue access points by attribute comparison',disconnected:'Disconnected',connected:'Scanning',mainSection:'AP Comparison',mainDesc:'Side-by-side legitimate vs suspicious AP analysis',sectionA:'Mismatch Details',sectionB:'All Detected APs',sectionC:'How It Works',start:'Scan',stop:'Stop',apsScanned:'APs Scanned',twinsDetected:'Twins Detected',mismatches:'Mismatches',noMismatches:'No mismatches detected yet',howItWorksText:'An evil twin is a rogue access point that copies the SSID of a legitimate network to trick users into connecting. While the SSID matches, other attributes often differ — MAC address, channel, encryption type, signal strength, and beacon interval. By comparing these attributes between APs with the same SSID, we can detect potential evil twins.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is an evil twin?',faq_a1:'A rogue AP that copies a legitimate SSID to intercept traffic.',faq_q2:'Is this real detection?',faq_a2:'No, this is a simulation.',faq_q3:'How are evil twins detected?',faq_a3:'By comparing MAC, channel, encryption, signal, beacon interval.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Click Scan to start.',howto_2:'Watch for twin comparisons.',howto_3:'Red rows show mismatches.',howto_4:'Check Mismatch Details.',wiki_twin_title:'Evil Twin',wiki_twin:'A rogue AP mimicking a legitimate network.',wiki_detect_title:'Detection',wiki_detect:'Compare BSSID, channel, encryption.',wiki_privacy_title:'Privacy',wiki_privacy:'All data stays in your browser.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'Evil Twin Spotter ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language → English',themeChanged:'Theme →',simStarted:'Scanning started',simStopped:'Scanning stopped',legitAP:'Legitimate AP detected',evilTwin:'EVIL TWIN DETECTED',safe:'All clear — no evil twins detected',danger:'ALERT: Evil twin detected! Attribute mismatches found.'},
fr:{title:'Detecteur Evil Twin — Verificateur AP',subtitle:'Detectez les points d\'acces malveillants',disconnected:'Deconnecte',connected:'Balayage',mainSection:'Comparaison AP',mainDesc:'Analyse cote a cote: legitime vs suspect',sectionA:'Details des Ecarts',sectionB:'Tous les AP Detectes',sectionC:'Comment ca marche',start:'Scanner',stop:'Arreter',apsScanned:'AP Scannes',twinsDetected:'Jumeaux Detectes',mismatches:'Ecarts',noMismatches:'Aucun ecart detecte',howItWorksText:'Un evil twin est un point d\'acces malveillant qui copie le SSID d\'un reseau legitime. En comparant les attributs (MAC, canal, chiffrement, signal), on peut detecter les jumeaux malveillants.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce qu\'un evil twin?',faq_a1:'Un AP malveillant copiant un SSID legitime.',faq_q2:'Detection reelle?',faq_a2:'Non, simulation.',faq_q3:'Comment detecter?',faq_a3:'Comparer MAC, canal, chiffrement.',faq_q4:'Donnees privees?',faq_a4:'Oui.',howto_1:'Cliquez Scanner.',howto_2:'Observez les comparaisons.',howto_3:'Les ecarts sont en rouge.',howto_4:'Verifiez les details.',wiki_twin_title:'Evil Twin',wiki_twin:'AP imitant un reseau legitime.',wiki_detect_title:'Detection',wiki_detect:'Comparer BSSID, canal, chiffrement.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Tout reste local.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer pour passer',working:'En cours...',langChanged:'Langue → Francais',themeChanged:'Theme →',simStarted:'Scan demarre',simStopped:'Scan arrete',legitAP:'AP legitime detecte',evilTwin:'EVIL TWIN DETECTE',safe:'Tout est clair',danger:'ALERTE: Evil twin detecte!'},
ar:{title:'كاشف التوأم الشرير — محقق AP',subtitle:'اكتشف نقاط الوصول المزيفة بمقارنة السمات',disconnected:'غير متصل',connected:'مسح',mainSection:'مقارنة AP',mainDesc:'تحليل جنباً إلى جنب: شرعي مقابل مشبوه',sectionA:'تفاصيل التباينات',sectionB:'جميع نقاط الوصول',sectionC:'كيف يعمل',start:'مسح',stop:'إيقاف',apsScanned:'AP ممسوحة',twinsDetected:'توائم مكتشفة',mismatches:'تباينات',noMismatches:'لا تباينات حتى الآن',howItWorksText:'التوأم الشرير هو نقطة وصول مزيفة تنسخ SSID لشبكة شرعية. بمقارنة السمات (MAC، القناة، التشفير، الإشارة) يمكننا كشف التوائم المزيفة.',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو التوأم الشرير؟',faq_a1:'نقطة وصول مزيفة تنسخ SSID شبكة شرعية.',faq_q2:'هل هذا كشف حقيقي؟',faq_a2:'لا، محاكاة.',faq_q3:'كيف يتم الكشف؟',faq_a3:'بمقارنة MAC، القناة، التشفير.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم.',howto_1:'انقر مسح.',howto_2:'شاهد المقارنات.',howto_3:'التباينات بالأحمر.',howto_4:'تحقق من التفاصيل.',wiki_twin_title:'التوأم الشرير',wiki_twin:'AP يقلد شبكة شرعية.',wiki_detect_title:'الكشف',wiki_detect:'مقارنة BSSID، القناة، التشفير.',wiki_privacy_title:'الخصوصية',wiki_privacy:'كل البيانات في متصفحك.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'كاشف التوأم الشرير جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',working:'جارٍ...',langChanged:'اللغة ← العربية',themeChanged:'المظهر ←',simStarted:'بدأ المسح',simStopped:'توقف المسح',legitAP:'AP شرعي',evilTwin:'توأم شرير مكتشف!',safe:'كل شيء آمن',danger:'تنبيه: توأم شرير!'}
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
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2)})}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info')}
let logContainer;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`evil-twin-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click')})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none'})}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open')}
function closePanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function closeAllPanels(){closeHelp();closeSettings();closeLog()}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active')})})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;const rtl=()=>document.documentElement.dir==='rtl';h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;h.classList.add('active');document.body.style.cursor='col-resize';e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=rtl()?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px')});document.addEventListener('mouseup',()=>{if(!d)return;d=false;h.classList.remove('active');document.body.style.cursor=''})}

/* ═══════ APP LOGIC — Evil Twin Spotter ═══════ */
function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':')}
const SSIDS=['CoffeeShop_WiFi','Airport_Free','Hotel_Guest','CorpNet','Library_Public','Starbucks','HomeNet-5G'];
const ENCRYPTIONS=['WPA2-PSK','WPA3-SAE','WPA2-Enterprise','Open'];
const VENDORS=['Cisco','Ubiquiti','TP-Link','Netgear','Aruba','Ruckus'];

let simRunning=false,simInterval=null,allAPs=[],twinPairs=[],mismatchEntries=[],totalMismatches=0;

function genLegitAP(){
  return{ssid:SSIDS[Math.floor(Math.random()*SSIDS.length)],mac:randMAC(),channel:([1,6,11])[Math.floor(Math.random()*3)],encryption:ENCRYPTIONS[Math.floor(Math.random()*3)],signal:-30-Math.floor(Math.random()*30),beacon:100,vendor:VENDORS[Math.floor(Math.random()*VENDORS.length)],evil:false};
}
function genEvilTwin(legit){
  const twin={...legit,mac:randMAC(),evil:true};
  // Introduce subtle mismatches
  if(Math.random()>0.3)twin.channel=[1,6,11,3,9][Math.floor(Math.random()*5)];
  if(Math.random()>0.5)twin.encryption=ENCRYPTIONS[Math.floor(Math.random()*ENCRYPTIONS.length)];
  if(Math.random()>0.4)twin.signal=legit.signal+Math.floor(Math.random()*20)-5;
  if(Math.random()>0.6)twin.beacon=[100,102,200][Math.floor(Math.random()*3)];
  twin.vendor=VENDORS[Math.floor(Math.random()*VENDORS.length)];
  return twin;
}

function findMismatches(a,b){
  const mm=[];
  if(a.mac!==b.mac)mm.push({field:'BSSID',legit:a.mac,evil:b.mac});
  if(a.channel!==b.channel)mm.push({field:'Channel',legit:''+a.channel,evil:''+b.channel});
  if(a.encryption!==b.encryption)mm.push({field:'Encryption',legit:a.encryption,evil:b.encryption});
  if(Math.abs(a.signal-b.signal)>5)mm.push({field:'Signal',legit:a.signal+' dBm',evil:b.signal+' dBm'});
  if(a.beacon!==b.beacon)mm.push({field:'Beacon Interval',legit:a.beacon+'ms',evil:b.beacon+'ms'});
  if(a.vendor!==b.vendor)mm.push({field:'Vendor',legit:a.vendor,evil:b.vendor});
  return mm;
}

function renderRow(label,val,mismatch){
  return`<div class="twin-row${mismatch?' mismatch':''}"><span class="attr">${label}</span><span class="val">${val}</span></div>`;
}

function updateUI(){
  $('apScanned').textContent=allAPs.length;
  $('twinCount').textContent=twinPairs.length;
  $('mismatchCount').textContent=totalMismatches;

  const grid=$('twinGrid');
  if(grid&&twinPairs.length>0){
    const latest=twinPairs[twinPairs.length-1];
    const mm=latest.mismatches;
    const mmFields=new Set(mm.map(m=>m.field));
    grid.innerHTML=`
      <div class="twin-card legit"><div class="twin-label legit-label">✅ Legitimate AP</div>
        ${renderRow('SSID',latest.legit.ssid,false)}
        ${renderRow('BSSID',latest.legit.mac,mmFields.has('BSSID'))}
        ${renderRow('Channel',latest.legit.channel,mmFields.has('Channel'))}
        ${renderRow('Encryption',latest.legit.encryption,mmFields.has('Encryption'))}
        ${renderRow('Signal',latest.legit.signal+' dBm',mmFields.has('Signal'))}
        ${renderRow('Beacon',latest.legit.beacon+'ms',mmFields.has('Beacon Interval'))}
        ${renderRow('Vendor',latest.legit.vendor,mmFields.has('Vendor'))}
      </div>
      <div class="twin-card evil"><div class="twin-label evil-label">🚨 Suspected Evil Twin</div>
        ${renderRow('SSID',latest.evil.ssid,false)}
        ${renderRow('BSSID',latest.evil.mac,mmFields.has('BSSID'))}
        ${renderRow('Channel',latest.evil.channel,mmFields.has('Channel'))}
        ${renderRow('Encryption',latest.evil.encryption,mmFields.has('Encryption'))}
        ${renderRow('Signal',latest.evil.signal+' dBm',mmFields.has('Signal'))}
        ${renderRow('Beacon',latest.evil.beacon+'ms',mmFields.has('Beacon Interval'))}
        ${renderRow('Vendor',latest.evil.vendor,mmFields.has('Vendor'))}
      </div>`;
  }

  // Alert
  const box=$('alertBox'),msg=$('alertMsg');
  const s=LANG[currentLang];
  if(twinPairs.length>0){box.className='alert-box active danger';msg.textContent='🚨 '+s.danger}
  else if(allAPs.length>0){box.className='alert-box active safe';msg.textContent='✅ '+s.safe}

  // Mismatch list
  const ml=$('mismatchList');
  if(ml){
    if(mismatchEntries.length===0)ml.innerHTML=`<em>${s.noMismatches}</em>`;
    else ml.innerHTML=mismatchEntries.map(e=>`<div class="mismatch-entry"><span class="field">${e.field}</span><span>Legit: ${e.legit}</span><span>Evil: ${e.evil}</span></div>`).join('');
  }

  // All APs
  const al=$('allAPList');
  if(al){
    al.innerHTML=allAPs.map(a=>`<div style="padding:3px 0;border-bottom:1px solid var(--border);display:flex;gap:8px"><span style="color:${a.evil?'#ef4444':'#22c55e'}">${a.evil?'🚨':'✅'}</span><span style="font-family:monospace;font-size:.68rem">${a.mac}</span><span>${a.ssid}</span><span style="color:var(--text-muted)">Ch${a.channel} ${a.encryption} ${a.signal}dBm</span></div>`).join('');
  }
}

function addAP(){
  const s=LANG[currentLang];
  const legit=genLegitAP();
  allAPs.push(legit);
  log(`${s.legitAP}: ${legit.ssid} (${legit.mac})`,'rx');

  // 30% chance of evil twin
  if(Math.random()<0.3){
    const evil=genEvilTwin(legit);
    allAPs.push(evil);
    const mm=findMismatches(legit,evil);
    twinPairs.push({legit,evil,mismatches:mm});
    mismatchEntries.push(...mm);
    totalMismatches+=mm.length;
    log(`${s.evilTwin}: ${evil.ssid} (${evil.mac}) — ${mm.length} mismatches`,'error');
  }
  updateUI();
}

function startSim(){
  if(simRunning)return;simRunning=true;setStatus(true);
  $('startBtn').disabled=true;$('stopBtn').disabled=false;
  allAPs=[];twinPairs=[];mismatchEntries=[];totalMismatches=0;
  log(LANG[currentLang].simStarted,'success');
  simInterval=setInterval(addAP,2000);
}
function stopSim(){
  simRunning=false;if(simInterval)clearInterval(simInterval);
  setStatus(false);$('startBtn').disabled=false;$('stopBtn').disabled=true;
  log(LANG[currentLang].simStopped,'info');
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}if(soundEnabled)playSound('click')})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels()});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang');const st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ RICH CANVAS SIMULATION — Evil Twin Network Map ═══════ */
(function evilTwinCanvas(){
  const CVS_ID='evilTwinVis';
  function ensureCanvas(){
    if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);
    const wrap=document.querySelector('.section-card')||document.querySelector('.main-section')||document.querySelector('main');
    if(!wrap)return null;
    const card=document.createElement('div');card.className='section-card';
    card.innerHTML='<div class="section-header"><span class="section-icon">👯</span> Twin Detection Network Map</div>';
    const c=document.createElement('canvas');c.id=CVS_ID;
    c.style.cssText='width:100%;height:280px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';
    card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c;
  }
  const apNodes=[];let _raf=null,frameCount=0;
  function draw(){
    const c=document.getElementById(CVS_ID);if(!c){_raf=null;return;}
    const ctx=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;
    ctx.scale(2,2);const w=W/2,h=H/2;
    ctx.fillStyle='rgba(10,10,26,0.15)';ctx.fillRect(0,0,w,h);
    frameCount++;
    // Sync nodes with allAPs
    if(typeof allAPs!=='undefined'){
      while(apNodes.length<allAPs.length&&apNodes.length<40){
        const ap=allAPs[apNodes.length];
        const side=ap.evil?0.7:0.3;
        apNodes.push({x:side*w+(Math.random()-0.5)*w*0.3,y:0.2*h+Math.random()*0.6*h,
          vx:(Math.random()-0.5)*0.2,vy:(Math.random()-0.5)*0.2,
          evil:ap.evil,ssid:ap.ssid,r:ap.evil?6:5,pulsePhase:Math.random()*Math.PI*2});
      }
    }
    // Center dividing line
    ctx.beginPath();ctx.setLineDash([4,4]);
    ctx.moveTo(w/2,10);ctx.lineTo(w/2,h-10);
    ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);
    ctx.font='9px monospace';ctx.fillStyle='rgba(34,197,94,0.4)';ctx.textAlign='center';
    ctx.fillText('LEGITIMATE',w*0.25,15);
    ctx.fillStyle='rgba(239,68,68,0.4)';ctx.fillText('SUSPECTED EVIL',w*0.75,15);
    // Draw connections between twins (same SSID)
    for(let i=0;i<apNodes.length;i++){
      for(let j=i+1;j<apNodes.length;j++){
        if(apNodes[i].evil!==apNodes[j].evil){
          // Draw twin link as warning
          const dx=apNodes[i].x-apNodes[j].x,dy=apNodes[i].y-apNodes[j].y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          if(dist<w*0.7){
            ctx.beginPath();ctx.moveTo(apNodes[i].x,apNodes[i].y);ctx.lineTo(apNodes[j].x,apNodes[j].y);
            const flash=Math.sin(frameCount*0.08)*0.3+0.3;
            ctx.strokeStyle=`rgba(239,68,68,${flash*0.15})`;ctx.lineWidth=1;
            ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
          }
        }
      }
    }
    // Draw AP nodes
    apNodes.forEach(n=>{
      n.x+=n.vx;n.y+=n.vy;
      if(n.x<20||n.x>w-20)n.vx*=-1;if(n.y<25||n.y>h-20)n.vy*=-1;
      n.vx+=(Math.random()-0.5)*0.03;n.vy+=(Math.random()-0.5)*0.03;
      n.vx*=0.98;n.vy*=0.98;
      const pulse=Math.sin(frameCount*0.04+n.pulsePhase)*0.3+0.7;
      const color=n.evil?'#ef4444':'#22c55e';
      // Signal rings
      for(let ring=1;ring<=3;ring++){
        ctx.beginPath();ctx.arc(n.x,n.y,n.r*ring*1.5*pulse,0,Math.PI*2);
        ctx.strokeStyle=color;ctx.globalAlpha=0.06/ring;ctx.lineWidth=1;ctx.stroke();
      }
      ctx.globalAlpha=1;
      // Core
      ctx.beginPath();ctx.arc(n.x,n.y,n.r*pulse,0,Math.PI*2);
      ctx.fillStyle=color+'cc';ctx.fill();ctx.strokeStyle=color+'60';ctx.lineWidth=1.5;ctx.stroke();
      // Warning icon for evil
      if(n.evil){
        ctx.font='bold 8px sans-serif';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('!',n.x,n.y+3);
      }
      // SSID label
      if(apNodes.length<25){
        ctx.font='7px monospace';ctx.fillStyle='rgba(255,255,255,0.35)';ctx.textAlign='center';
        ctx.fillText(n.ssid||'',n.x,n.y+n.r*2+4);
      }
    });
    // Stats
    const legit=apNodes.filter(n=>!n.evil).length;
    const evil=apNodes.filter(n=>n.evil).length;
    ctx.font='9px monospace';ctx.textAlign='left';
    ctx.fillStyle='#22c55e';ctx.fillText('Legit: '+legit,8,h-8);
    ctx.fillStyle='#ef4444';ctx.fillText('Evil: '+evil,80,h-8);
    _raf=requestAnimationFrame(draw);
  }
  function boot(){const c=ensureCanvas();if(!c)return setTimeout(boot,500);if(!_raf)draw();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
