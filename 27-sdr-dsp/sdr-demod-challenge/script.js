/**
 * SDR Demod Challenge — Workshop DIY v1.0
 * Gamified modulation identification with spectrum/waterfall
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="10 5"><animate attributeName="stroke-dashoffset" values="0;60" dur="3s" repeatCount="indefinite"/></circle><text x="35" y="58" font-size="28" fill="currentColor">?</text></svg>`;
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25);}}

const LANG={
en:{title:'SDR Demod Challenge',subtitle:'🎯 Demod Challenge — Identify mystery signals',disconnected:'Disconnected',connected:'Connected',mainSection:'Demod Challenge',mainDesc:'Identify the modulation, decode the message',sectionA:'Scoreboard',sectionB:'Demod Toolbox',sectionC:'Signal Recognition Guide',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
faq_q1:'What is Demod Challenge?',faq_a1:'A gamified quiz to identify modulation types from spectrum and waterfall.',faq_q2:'How do I score?',faq_a2:'Correct ID earns points. Streaks give bonus.',faq_q3:'What are demod tools?',faq_a3:'Apply different demodulators to help identify the signal.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',
howto_1:'Click New Challenge for a mystery signal.',howto_2:'Study spectrum and waterfall patterns.',howto_3:'Use demod tools for clues.',howto_4:'Click the correct modulation to score!',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 built-in themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual with RTL.',
working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'🎯 Demod Challenge ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
levelLabel:'Level',score:'Score:',streak:'Streak:',yourGuess:'Your Guess — What modulation is this?',newChallenge:'🎲 New Challenge',hintBtn:'💡 Hint',revealBtn:'👁 Reveal',
totalAttempts:'Total Attempts:',correct:'Correct:',accuracy:'Accuracy:',bestStreak:'Best Streak:',
theoryIntro:'Tips for identifying modulation by spectrum:',theory1:'AM: carrier + two symmetric sidebands',theory2:'FM: wider bandwidth, spread carrier energy',theory3:'SSB: single sideband, no carrier',theory4:'BPSK/QPSK: sinc-shaped spectrum',theory5:'CW: narrow spike, on-off keying on waterfall',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
correctGuess:'✅ Correct!',wrongGuess:'❌ Wrong!',hintMsg:'💡 Hint:',revealed:'👁 Answer:',newChal:'🎲 New challenge loaded',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
fr:{title:'Defi Demodulation SDR',subtitle:'🎯 Defi Demod — Identifiez les signaux mysteres',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Defi Demodulation',mainDesc:'Identifiez la modulation, decodez le message',sectionA:'Tableau de Score',sectionB:'Boite a Outils Demod',sectionC:'Guide de Reconnaissance',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
faq_q1:'Qu\'est-ce que le Defi Demod?',faq_a1:'Un quiz ludique pour identifier les modulations.',faq_q2:'Comment marquer?',faq_a2:'Bonne identification = points. Series = bonus.',faq_q3:'Que sont les outils demod?',faq_a3:'Appliquez differents demodulateurs pour identifier.',faq_q4:'Mes donnees sont privees?',faq_a4:'Oui. Tout est local.',
howto_1:'Cliquez Nouveau Defi.',howto_2:'Etudiez spectre et waterfall.',howto_3:'Utilisez les outils demod.',howto_4:'Cliquez la bonne modulation!',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',
working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',ready:'🎯 Defi Demod pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
levelLabel:'Niveau',score:'Score:',streak:'Serie:',yourGuess:'Votre Reponse — Quelle modulation?',newChallenge:'🎲 Nouveau Defi',hintBtn:'💡 Indice',revealBtn:'👁 Reveler',
totalAttempts:'Tentatives:',correct:'Correct:',accuracy:'Precision:',bestStreak:'Meilleure Serie:',
theoryIntro:'Astuces pour identifier la modulation par le spectre:',theory1:'AM: porteuse + deux bandes laterales',theory2:'FM: bande plus large',theory3:'SSB: bande laterale unique',theory4:'BPSK/QPSK: spectre en sinc',theory5:'CW: pic etroit, manipulation par tout ou rien',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',
correctGuess:'✅ Correct!',wrongGuess:'❌ Faux!',hintMsg:'💡 Indice:',revealed:'👁 Reponse:',newChal:'🎲 Nouveau defi charge',
t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
ar:{title:'تحدي ازالة التعديل SDR',subtitle:'🎯 تحدي ازالة التعديل — حدد الاشارات الغامضة',disconnected:'غير متصل',connected:'متصل',mainSection:'تحدي ازالة التعديل',mainDesc:'حدد التعديل وفك تشفير الرسالة',sectionA:'لوحة النتائج',sectionB:'ادوات ازالة التعديل',sectionC:'دليل التعرف على الاشارات',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
faq_q1:'ما هو تحدي ازالة التعديل؟',faq_a1:'اختبار لعبي لتحديد انواع التعديل من الطيف.',faq_q2:'كيف احرز نقاط؟',faq_a2:'التحديد الصحيح يحرز نقاط. التتابع يعطي مكافاة.',faq_q3:'ما هي ادوات ازالة التعديل؟',faq_a3:'طبق مزيلات تعديل مختلفة للتعرف.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء محلي.',
howto_1:'اضغط تحدي جديد.',howto_2:'ادرس الطيف والشلال.',howto_3:'استخدم ادوات ازالة التعديل.',howto_4:'اضغط التعديل الصحيح للتسجيل!',
wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'🎯 تحدي ازالة التعديل جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',
levelLabel:'المستوى',score:'النقاط:',streak:'التتابع:',yourGuess:'تخمينك — ما هذا التعديل؟',newChallenge:'🎲 تحدي جديد',hintBtn:'💡 تلميح',revealBtn:'👁 كشف',
totalAttempts:'اجمالي المحاولات:',correct:'صحيح:',accuracy:'الدقة:',bestStreak:'افضل تتابع:',
theoryIntro:'نصائح لتحديد التعديل من الطيف:',theory1:'AM: حامل + نطاقين جانبيين متماثلين',theory2:'FM: عرض نطاق اوسع',theory3:'SSB: نطاق جانبي واحد بدون حامل',theory4:'BPSK/QPSK: طيف شكل sinc',theory5:'CW: ذروة ضيقة، نمط تشغيل/ايقاف',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
correctGuess:'✅ صحيح!',wrongGuess:'❌ خطا!',hintMsg:'💡 تلميح:',revealed:'👁 الجواب:',newChal:'🎲 تم تحميل تحدي جديد',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'}
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
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');buildGuessButtons();}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='demod-challenge-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){const s=$(p),ov=$(o);if(s)s.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const s=$(p),ov=$(o);if(s)s.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),conts=document.querySelectorAll('.help-content');tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));conts.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');}));}

/* ═══════ CHALLENGE ENGINE ═══════ */
const MODS=['AM','FM','SSB','BPSK','QPSK','CW','Noise','Chirp'];
const HINTS={AM:'Two symmetric sidebands around carrier',FM:'Wide bandwidth, spread energy',SSB:'One sideband only, no carrier',BPSK:'Sinc spectrum, 180-degree phase shifts',QPSK:'Wider sinc, 4 phase states',CW:'Very narrow, on-off pattern',Noise:'Flat broadband spectrum',Chirp:'Frequency sweeps upward over time'};
let currentMod='',level=1,score=0,streak=0,bestStreak=0,totalAttempts=0,correctCount=0;
let signalBuf=null,animFrame=null;
const SR=8192,N=1024;

function generateChallenge(){
  currentMod=MODS[Math.floor(Math.random()*MODS.length)];
  const buf=new Float32Array(N),dt=1/SR,fc=800+Math.random()*400;
  for(let i=0;i<N;i++){const t=i*dt;
    switch(currentMod){
      case'AM':buf[i]=(1+.7*Math.sin(2*Math.PI*50*t))*Math.cos(2*Math.PI*fc*t);break;
      case'FM':{const ph=2*Math.PI*fc*t+8*Math.sin(2*Math.PI*30*t);buf[i]=Math.cos(ph);break;}
      case'SSB':{const m=Math.sin(2*Math.PI*80*t),h=Math.cos(2*Math.PI*80*t);buf[i]=m*Math.cos(2*Math.PI*fc*t)-h*Math.sin(2*Math.PI*fc*t);break;}
      case'BPSK':{const bit=Math.floor(i/64)%2?1:-1;buf[i]=bit*Math.cos(2*Math.PI*fc*t);break;}
      case'QPSK':{const s2=Math.floor(i/64)%4;const ang=[.785,2.356,3.927,5.498][s2];buf[i]=Math.cos(2*Math.PI*fc*t+ang);break;}
      case'CW':{const on=Math.sin(2*Math.PI*2*t)>0?1:0;buf[i]=on*Math.cos(2*Math.PI*fc*t);break;}
      case'Noise':buf[i]=Math.random()*2-1;break;
      case'Chirp':buf[i]=Math.sin(2*Math.PI*(fc*.5+fc*2*(i/N))*t);break;
    }
    buf[i]+=(Math.random()-.5)*.15;
  }
  signalBuf=buf;
  drawAll();
  $('feedback').textContent='';$('feedback').style.color='';
  $('levelNum').textContent=level;
  setStatus(true);
  log(LANG[currentLang].newChal,'info');
}

function computeSpec(buf){
  const mag=new Float32Array(N/2);
  for(let k=0;k<N/2;k++){let re=0,im=0;for(let n=0;n<N;n++){const a=-2*Math.PI*k*n/N;re+=buf[n]*Math.cos(a);im+=buf[n]*Math.sin(a);}mag[k]=Math.sqrt(re*re+im*im)/N;}
  return mag;
}

function drawAll(){
  if(!signalBuf)return;
  const mag=computeSpec(signalBuf);
  // Spectrum
  const c1=$('specCanvas');if(c1){const ctx=c1.getContext('2d'),w=c1.width,h=c1.height;
    ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    const mx=Math.max(...mag)||1;
    ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
    for(let i=0;i<mag.length;i++){const x=i/mag.length*w,db=20*Math.log10(mag[i]/mx+1e-10),y=h-((db+60)/60)*h;if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));}
    ctx.stroke();ctx.fillStyle='#667';ctx.font='10px Orbitron,monospace';ctx.fillText('Mystery Spectrum',4,12);
  }
  // Waterfall
  const c2=$('waterfallCanvas');if(c2){const ctx=c2.getContext('2d'),w=c2.width,h=c2.height;
    const img=ctx.getImageData(0,0,w,h-2);ctx.putImageData(img,0,2);
    const mx=Math.max(...mag)||1;
    for(let x=0;x<w;x++){
      const idx=Math.floor(x/w*mag.length),val=mag[idx]/mx;
      const db=Math.max(0,Math.min(1,(20*Math.log10(val+1e-10)+60)/60));
      let r,g,b;
      if(db<.25){r=0;g=0;b=Math.floor(db*4*255);}else if(db<.5){r=0;g=Math.floor((db-.25)*4*255);b=255;}
      else if(db<.75){r=Math.floor((db-.5)*4*255);g=255;b=255-Math.floor((db-.5)*4*255);}
      else{r=255;g=255-Math.floor((db-.75)*4*255);b=0;}
      ctx.fillStyle=`rgb(${r},${g},${b})`;ctx.fillRect(x,0,1,2);
    }
  }
}

function makeGuess(guess){
  totalAttempts++;
  const fb=$('feedback');
  if(guess===currentMod){
    correctCount++;streak++;score+=10+streak*2;
    if(streak>bestStreak)bestStreak=streak;
    level=Math.min(10,Math.floor(correctCount/3)+1);
    fb.textContent=LANG[currentLang].correctGuess+' +'+( 10+streak*2)+' pts';fb.style.color='#4f4';
    log(LANG[currentLang].correctGuess+' '+currentMod,'success');
    setTimeout(generateChallenge,1500);
  }else{
    streak=0;score=Math.max(0,score-5);
    fb.textContent=LANG[currentLang].wrongGuess+' -5 pts';fb.style.color='#f44';
    log(LANG[currentLang].wrongGuess+' (was '+currentMod+', guessed '+guess+')','error');
  }
  $('scoreVal').textContent=score;$('streakVal').textContent=streak;
  $('totalVal').textContent=totalAttempts;$('correctVal').textContent=correctCount;
  $('accVal').textContent=totalAttempts?Math.round(correctCount/totalAttempts*100)+'%':'0%';
  $('bestStreakVal').textContent=bestStreak;$('levelNum').textContent=level;
}

function showHint(){
  const h=HINTS[currentMod]||'Look at the spectrum shape carefully.';
  $('feedback').textContent=LANG[currentLang].hintMsg+' '+h;$('feedback').style.color='#ff8';
  log(LANG[currentLang].hintMsg+' '+h,'info');
}
function revealAnswer(){
  $('feedback').textContent=LANG[currentLang].revealed+' '+currentMod;$('feedback').style.color='#4af';
  streak=0;$('streakVal').textContent=0;
  log(LANG[currentLang].revealed+' '+currentMod,'info');
}

function tryDemod(type){
  if(!signalBuf)return;
  const c=$('demodCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  const out=new Float32Array(N);const fc=1000,dt=1/SR;
  if(type==='envelope'){for(let i=0;i<N;i++)out[i]=Math.abs(signalBuf[i]);for(let i=1;i<N;i++)out[i]=out[i-1]+.05*(out[i]-out[i-1]);}
  else if(type==='coherent'){for(let i=0;i<N;i++)out[i]=signalBuf[i]*Math.cos(2*Math.PI*fc*i*dt)*2;for(let i=1;i<N;i++)out[i]=out[i-1]+.02*(out[i]-out[i-1]);}
  else if(type==='fm'){for(let i=1;i<N;i++){const p1=Math.atan2(signalBuf[i],signalBuf[Math.max(0,i-1)]);let dp=p1;if(dp>Math.PI)dp-=2*Math.PI;if(dp<-Math.PI)dp+=2*Math.PI;out[i]=dp;}}
  else if(type==='psk'){for(let i=0;i<N;i++){const sym=Math.floor(i/64);const prev=Math.max(0,(sym-1)*64);out[i]=signalBuf[i]*signalBuf[prev]>0?1:-1;}}
  ctx.strokeStyle='#4f4';ctx.lineWidth=1.5;ctx.beginPath();
  const show=Math.min(512,N);for(let i=0;i<show;i++){const x=i/show*w,y=h/2-out[i]*h*.3;if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));}
  ctx.stroke();ctx.fillStyle='#4f4';ctx.font='10px monospace';ctx.fillText('Demod: '+type,4,12);
  log('Tried demod: '+type,'tx');
}

function buildGuessButtons(){
  const el=$('guessButtons');if(!el)return;el.innerHTML='';
  MODS.forEach(m=>{const b=document.createElement('button');b.className='btn-sm';b.textContent=m;b.onclick=()=>makeGuess(m);el.appendChild(b);});
}

// Animate waterfall continuously
let wfAnim=null;
function wfLoop(){if(!signalBuf){wfAnim=requestAnimationFrame(wfLoop);return;}
  // Re-generate with slight variation for waterfall scrolling
  const fc=800+Math.random()*400,dt=1/SR;
  for(let i=0;i<N;i++){const t=i*dt;
    switch(currentMod){
      case'AM':signalBuf[i]=(1+.7*Math.sin(2*Math.PI*50*t))*Math.cos(2*Math.PI*fc*t);break;
      case'FM':signalBuf[i]=Math.cos(2*Math.PI*fc*t+8*Math.sin(2*Math.PI*30*t));break;
      case'SSB':{const m=Math.sin(2*Math.PI*80*t);signalBuf[i]=m*Math.cos(2*Math.PI*fc*t);break;}
      case'BPSK':signalBuf[i]=(Math.floor(i/64)%2?1:-1)*Math.cos(2*Math.PI*fc*t);break;
      case'QPSK':signalBuf[i]=Math.cos(2*Math.PI*fc*t+[.785,2.356,3.927,5.498][Math.floor(i/64)%4]);break;
      case'CW':signalBuf[i]=(Math.sin(2*Math.PI*2*t)>0?1:0)*Math.cos(2*Math.PI*fc*t);break;
      case'Noise':signalBuf[i]=Math.random()*2-1;break;
      case'Chirp':signalBuf[i]=Math.sin(2*Math.PI*(fc*.5+fc*2*(i/N))*t);break;
    }
    signalBuf[i]+=(Math.random()-.5)*.15;
  }
  drawAll();wfAnim=requestAnimationFrame(wfLoop);
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hC=$('helpCloseBtn'),hO=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hC)hC.onclick=closeHelp;if(hO)hO.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sC=$('settingsCloseBtn'),sO=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sC)sC.onclick=closeSettings;if(sO)sO.onclick=closeSettings;
  const lBtn=$('logBtn'),lC=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lC)lC.onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const ls=$('langSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));
  const ts=$('themeSelect');if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initHijriDate();
  $('newChalBtn').onclick=generateChallenge;$('hintBtn').onclick=showHint;$('revealBtn').onclick=revealAnswer;
  buildGuessButtons();generateChallenge();wfLoop();
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Demod Challenge
   Animated signal constellation scramble + score fireworks
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const pts=[];
function boot(){
  let el=document.getElementById('demodSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='demodSimCanvas';el.width=780;el.height=200;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#06080e;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.02;cx.fillStyle='rgba(6,8,14,.12)';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Rotating constellation
  const ccx=W*.25,ccy=H/2,cr=H*.35;
  cx.strokeStyle='rgba(100,200,255,.08)';cx.lineWidth=1;
  cx.beginPath();cx.arc(ccx,ccy,cr,0,Math.PI*2);cx.stroke();
  cx.beginPath();cx.moveTo(ccx-cr-5,ccy);cx.lineTo(ccx+cr+5,ccy);cx.stroke();
  cx.beginPath();cx.moveTo(ccx,ccy-cr-5);cx.lineTo(ccx,ccy+cr+5);cx.stroke();
  const numPts=32;
  for(let i=0;i<numPts;i++){
    const a=i/numPts*Math.PI*2+t*.5;const r2=cr*(.4+.3*Math.sin(i*1.7+t));
    const px=ccx+Math.cos(a)*r2+(Math.random()-.5)*4;
    const py=ccy+Math.sin(a)*r2+(Math.random()-.5)*4;
    cx.fillStyle=acc;cx.globalAlpha=.5;cx.beginPath();cx.arc(px,py,2.5,0,Math.PI*2);cx.fill();cx.globalAlpha=1;
  }
  // Signal type indicator ring
  const modTypes=['AM','FM','SSB','BPSK','QPSK','CW'];
  modTypes.forEach((m,i)=>{
    const a=i/modTypes.length*Math.PI*2-Math.PI/2+t*.2;
    const mx=W*.65+Math.cos(a)*60,my=H/2+Math.sin(a)*60;
    const isCurrent=typeof currentMod!=='undefined'&&currentMod===m;
    cx.fillStyle=isCurrent?acc:'rgba(100,200,255,.2)';cx.font=isCurrent?'bold 11px monospace':'9px monospace';
    cx.textAlign='center';cx.fillText(m,mx,my+4);
    if(isCurrent){cx.strokeStyle=acc+'66';cx.lineWidth=1;cx.beginPath();cx.arc(mx,my,16,0,Math.PI*2);cx.stroke();}
  });
  // Score/streak display
  const sc=typeof score!=='undefined'?score:0,st=typeof streak!=='undefined'?streak:0;
  cx.fillStyle='rgba(0,0,0,.4)';cx.fillRect(W*.55,8,90,20);
  cx.fillStyle='#4f4';cx.font='10px Orbitron,monospace';cx.textAlign='center';
  cx.fillText(`${sc} pts | x${st}`,W*.55+45,22);
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Signal Identification — Constellation View',8,14);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
})();
