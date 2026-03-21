/**
 * SDR Coherent Receiver — Workshop DIY v1.0
 * Phase-locked multi-SDR combining, beamforming, array processing
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="50" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="75" cy="50" r="8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="33" y1="50" x2="42" y2="50" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2"/><line x1="58" y1="50" x2="67" y2="50" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2"/><path d="M25 30 L50 15 L75 30" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".5"><animate attributeName="opacity" values=".3;.8;.3" dur="2s" repeatCount="indefinite"/></path></svg>`;
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25);}}

const LANG={
en:{title:'SDR Coherent Receiver',subtitle:'🔗 Coherent Receiver — Phase-locked multi-SDR',disconnected:'Disconnected',connected:'Connected',mainSection:'Coherent Receiver',mainDesc:'Phase-locked combining and beamforming simulation',sectionA:'Array Performance',sectionB:'Phase Calibration',sectionC:'Coherent Array Theory',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
faq_q1:'What is a coherent receiver?',faq_a1:'Multiple SDRs with phase-locked clocks combining for better sensitivity.',faq_q2:'What is beamforming?',faq_a2:'Steering antenna pattern by adjusting phase between elements.',faq_q3:'Why calibrate?',faq_a3:'Phase errors degrade array gain and beam pattern.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',
howto_1:'Set number of elements and spacing.',howto_2:'Adjust beam steering and signal angles.',howto_3:'Click Start for beam pattern.',howto_4:'Try phase errors and calibration.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 built-in themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual with RTL.',
working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'🔗 Coherent Receiver ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
numElements:'SDR Elements',spacing:'Element Spacing (λ)',steerAngle:'Beam Steering (deg)',sigAngle:'Signal Angle (deg)',snrCtrl:'SNR (dB)',startSim:'▶ Start',stopSim:'⏹ Stop',
arrayGain:'Array Gain:',beamWidth:'Beam Width (-3dB):',sllLabel:'Sidelobe Level:',snrImprove:'SNR Improvement:',nullDepth:'First Null:',
calDesc:'Simulate phase errors and apply calibration.',
theoryIntro:'Coherent multi-SDR arrays combine signals for enhanced performance:',theory1:'Array gain = 10 log10(N) dB for N elements',theory2:'Beamforming focuses sensitivity directionally',theory3:'Phase-locked oscillators essential for coherence',theory4:'Element spacing affects grating lobes',theory5:'Calibration corrects phase/amplitude mismatches',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',simStarted:'▶ Array simulation running',simStopped:'⏹ Stopped',errorsAdded:'Phase errors added',calibDone:'Calibration applied',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
fr:{title:'Recepteur Coherent SDR',subtitle:'🔗 Recepteur Coherent — Multi-SDR verrouille en phase',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Recepteur Coherent',mainDesc:'Combinaison phase-verrouillee et formation de faisceau',sectionA:'Performance du Reseau',sectionB:'Calibration de Phase',sectionC:'Theorie des Reseaux Coherents',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
faq_q1:'Qu\'est-ce qu\'un recepteur coherent?',faq_a1:'Plusieurs SDR combines avec horloge synchronisee.',faq_q2:'Qu\'est-ce que la formation de faisceau?',faq_a2:'Orienter le diagramme d\'antenne par ajustement de phase.',faq_q3:'Pourquoi calibrer?',faq_a3:'Les erreurs de phase degradent le gain.',faq_q4:'Mes donnees sont privees?',faq_a4:'Oui. Tout est local.',
howto_1:'Reglez le nombre d\'elements et l\'espacement.',howto_2:'Ajustez les angles de pointage et de signal.',howto_3:'Cliquez Demarrer pour le diagramme.',howto_4:'Essayez les erreurs de phase et calibration.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',
working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',ready:'🔗 Recepteur Coherent pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
numElements:'Elements SDR',spacing:'Espacement (λ)',steerAngle:'Pointage (deg)',sigAngle:'Angle Signal (deg)',snrCtrl:'RSB (dB)',startSim:'▶ Demarrer',stopSim:'⏹ Arreter',
arrayGain:'Gain Reseau:',beamWidth:'Ouverture (-3dB):',sllLabel:'Lobes Secondaires:',snrImprove:'Amelioration RSB:',nullDepth:'Premier Nul:',
calDesc:'Simulez des erreurs de phase et calibrez.',
theoryIntro:'Les reseaux coherents multi-SDR combinent pour ameliorer:',theory1:'Gain = 10 log10(N) dB pour N elements',theory2:'Formation de faisceau oriente la sensibilite',theory3:'Oscillateurs verrouilles essentiels',theory4:'L\'espacement affecte les lobes de reseau',theory5:'La calibration corrige les desaccords',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',simStarted:'▶ Simulation en cours',simStopped:'⏹ Arrete',errorsAdded:'Erreurs ajoutees',calibDone:'Calibration appliquee',
t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
ar:{title:'المستقبل المتماسك SDR',subtitle:'🔗 المستقبل المتماسك — متعدد SDR مقفل الطور',disconnected:'غير متصل',connected:'متصل',mainSection:'المستقبل المتماسك',mainDesc:'محاكاة الجمع المقفل الطور وتشكيل الحزمة',sectionA:'اداء المصفوفة',sectionB:'معايرة الطور',sectionC:'نظرية المصفوفات المتماسكة',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
faq_q1:'ما هو المستقبل المتماسك؟',faq_a1:'عدة SDR مجمعة بساعات مقفلة الطور.',faq_q2:'ما هو تشكيل الحزمة؟',faq_a2:'توجيه نمط الهوائي بضبط الطور بين العناصر.',faq_q3:'لماذا المعايرة؟',faq_a3:'اخطاء الطور تقلل كسب المصفوفة.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء محلي.',
howto_1:'اضبط عدد العناصر والتباعد.',howto_2:'اضبط زوايا التوجيه والاشارة.',howto_3:'اضغط ابدا لنمط الحزمة.',howto_4:'جرب اخطاء الطور والمعايرة.',
wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'🔗 المستقبل المتماسك جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',
numElements:'عناصر SDR',spacing:'التباعد (λ)',steerAngle:'زاوية التوجيه (درجة)',sigAngle:'زاوية الاشارة (درجة)',snrCtrl:'نسبة الاشارة للضوضاء (ديسيبل)',startSim:'▶ ابدا',stopSim:'⏹ ايقاف',
arrayGain:'كسب المصفوفة:',beamWidth:'عرض الحزمة:',sllLabel:'مستوى الفصوص الجانبية:',snrImprove:'تحسين SNR:',nullDepth:'العدم الاول:',
calDesc:'حاكِ اخطاء الطور وطبق المعايرة.',
theoryIntro:'مصفوفات SDR المتماسكة تجمع الاشارات لاداء محسن:',theory1:'الكسب = 10 log10(N) ديسيبل لـ N عنصر',theory2:'تشكيل الحزمة يركز الحساسية اتجاهيا',theory3:'المذبذبات المقفلة ضرورية للتماسك',theory4:'التباعد يؤثر على فصوص الشبكة',theory5:'المعايرة تصحح عدم تطابق الطور والسعة',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',simStarted:'▶ محاكاة المصفوفة تعمل',simStopped:'⏹ متوقف',errorsAdded:'تمت اضافة اخطاء الطور',calibDone:'تم تطبيق المعايرة',
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
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='coherent-log.txt';a.click();URL.revokeObjectURL(u);}
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

/* ═══════ COHERENT ARRAY SIMULATION ═══════ */
let running=false,animFrame=null;
let phaseErrors=[];
let calibrated=false;

function computeBeamPattern(nElem,dLambda,steerDeg){
  const pts=360;const pattern=new Float32Array(pts);
  const steerRad=steerDeg*Math.PI/180;
  for(let a=0;a<pts;a++){
    const theta=(a-180)*Math.PI/180;
    let re=0,im=0;
    for(let n=0;n<nElem;n++){
      const psi=2*Math.PI*dLambda*n*(Math.sin(theta)-Math.sin(steerRad));
      const errPh=calibrated?0:(phaseErrors[n]||0);
      re+=Math.cos(psi+errPh);
      im+=Math.sin(psi+errPh);
    }
    pattern[a]=Math.sqrt(re*re+im*im)/nElem;
  }
  return pattern;
}

function drawArray(nElem,dLambda,steerDeg,sigDeg){
  const c=$('arrayCanvas');if(!c)return;const ctx=c.getContext('2d'),s=c.width,cx=s/2,cy=s/2;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,s,s);
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Draw elements
  const spacing=Math.min(30,s/(nElem+2));
  const startX=cx-(nElem-1)*spacing/2;
  for(let i=0;i<nElem;i++){
    const ex=startX+i*spacing,ey=cy+40;
    ctx.fillStyle=accent;ctx.beginPath();ctx.arc(ex,ey,6,0,2*Math.PI);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='8px monospace';ctx.fillText('SDR'+(i+1),ex-10,ey+16);
    // Phase error indicator
    const err=phaseErrors[i]||0;
    if(Math.abs(err)>.01&&!calibrated){
      ctx.fillStyle='#f44';ctx.font='8px monospace';ctx.fillText((err*180/Math.PI).toFixed(0)+'°',ex-6,ey-10);
    }
  }
  // Draw beam direction
  const beamRad=steerDeg*Math.PI/180;
  const bx=cx+Math.sin(beamRad)*100,by=cy-Math.cos(beamRad)*100;
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.setLineDash([6,4]);
  ctx.beginPath();ctx.moveTo(cx,cy+40);ctx.lineTo(bx,by);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle=accent;ctx.font='10px Orbitron';ctx.fillText('Beam: '+steerDeg+'°',bx-20,by-8);
  // Draw signal direction
  const sigRad=sigDeg*Math.PI/180;
  const sx2=cx+Math.sin(sigRad)*120,sy2=cy-Math.cos(sigRad)*120;
  ctx.strokeStyle='#4af';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(sx2,sy2);ctx.lineTo(cx,cy+40);ctx.stroke();
  ctx.fillStyle='#4af';ctx.font='10px monospace';ctx.fillText('Signal: '+sigDeg+'°',sx2-20,sy2-8);
  // Wavefronts
  for(let r=20;r<130;r+=25){
    ctx.strokeStyle='#4af';ctx.globalAlpha=.2;ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(sx2,sy2,r,0,2*Math.PI);ctx.stroke();
  }
  ctx.globalAlpha=1;
}

function drawBeam(pattern){
  const c=$('beamCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;
  for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(0,i/4*h);ctx.lineTo(w,i/4*h);ctx.stroke();}
  // 0 line
  ctx.beginPath();ctx.moveTo(w/2,0);ctx.lineTo(w/2,h);ctx.stroke();
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
  const maxP=Math.max(...pattern)||1;
  for(let i=0;i<pattern.length;i++){
    const x=i/pattern.length*w;
    const db=20*Math.log10(pattern[i]/maxP+1e-10);
    const y=h-((db+40)/40)*h;
    if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));
  }
  ctx.stroke();
  ctx.fillStyle='#667';ctx.font='10px Orbitron,monospace';
  ctx.fillText('Beam Pattern (dB)',4,12);ctx.fillText('-90°',4,h-4);ctx.fillText('0°',w/2-8,h-4);ctx.fillText('+90°',w-30,h-4);
}

function drawCombinedSpec(nElem,sigDeg,steerDeg,snrDb){
  const c=$('specCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Simulated spectrum with signal + noise
  const N=256;
  const sigBin=Math.floor(N*.35);
  const angDiff=Math.abs(sigDeg-steerDeg);
  const arrayResponse=Math.max(.01,Math.cos(angDiff*Math.PI/180));
  const effectiveGain=10*Math.log10(nElem)*arrayResponse;
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<N;i++){
    const noise=(Math.random()-.5)*.3;
    let sig=0;if(Math.abs(i-sigBin)<5)sig=.8*arrayResponse*Math.exp(-(i-sigBin)*(i-sigBin)/4);
    const val=sig+noise*.5;
    const x=i/N*w,db=20*Math.log10(Math.abs(val)+.001);
    const y=h/2-db*h*.05;
    if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));
  }
  ctx.stroke();
  ctx.fillStyle='#667';ctx.font='10px Orbitron,monospace';ctx.fillText('Combined Spectrum ('+nElem+' elements)',4,12);
}

function updatePerf(pattern,nElem){
  const maxP=Math.max(...pattern)||1;
  $('gainVal').textContent=(10*Math.log10(nElem)).toFixed(1)+' dB';
  // Beam width
  const peakIdx=pattern.indexOf(Math.max(...pattern));
  const th3=maxP*.707;let lo=peakIdx,hi=peakIdx;
  for(let i=peakIdx;i>=0;i--)if(pattern[i]<th3){lo=i;break;}
  for(let i=peakIdx;i<pattern.length;i++)if(pattern[i]<th3){hi=i;break;}
  $('bwVal2').textContent=((hi-lo)).toFixed(0)+'°';
  // SLL
  let sll=0;
  for(let i=0;i<pattern.length;i++){
    if(Math.abs(i-peakIdx)>20){sll=Math.max(sll,pattern[i]);}
  }
  $('sllVal').textContent=(20*Math.log10(sll/maxP+1e-10)).toFixed(1)+' dB';
  $('snrImpVal').textContent=(10*Math.log10(nElem)).toFixed(1)+' dB';
  // First null
  let nullDepth=1;
  for(let i=peakIdx+5;i<Math.min(peakIdx+60,pattern.length);i++){
    if(pattern[i]<nullDepth)nullDepth=pattern[i];
  }
  $('nullVal').textContent=(20*Math.log10(nullDepth/maxP+1e-10)).toFixed(1)+' dB';
}

function addPhaseErrors(){
  const n=+$('elemSlider').value;
  phaseErrors=[];calibrated=false;
  for(let i=0;i<n;i++)phaseErrors.push((Math.random()-.5)*Math.PI*.5);
  const el=$('phaseStatus');if(el)el.textContent='Errors: '+phaseErrors.map(e=>(e*180/Math.PI).toFixed(1)+'°').join(', ');
  log(LANG[currentLang].errorsAdded,'info');
}
function calibrate(){
  calibrated=true;
  const el=$('phaseStatus');if(el)el.textContent='Calibrated — all errors compensated.';
  log(LANG[currentLang].calibDone,'success');
}

function simLoop(){
  if(!running)return;
  const nElem=+$('elemSlider').value,dLambda=+$('spaceSlider').value/100;
  const steerDeg=+$('steerSlider').value,sigDeg=+$('sigSlider').value,snrDb=+$('snrSlider').value;
  while(phaseErrors.length<nElem)phaseErrors.push(0);
  const pattern=computeBeamPattern(nElem,dLambda,steerDeg);
  drawArray(nElem,dLambda,steerDeg,sigDeg);
  drawBeam(pattern);
  drawCombinedSpec(nElem,sigDeg,steerDeg,snrDb);
  updatePerf(pattern,nElem);
  animFrame=requestAnimationFrame(simLoop);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');simLoop();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}

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
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  $('addErrorBtn').onclick=addPhaseErrors;$('calibBtn').onclick=calibrate;
  $('elemSlider').oninput=function(){$('elemVal').textContent=this.value;};
  $('spaceSlider').oninput=function(){$('spaceVal').textContent=(this.value/100).toFixed(2)+' λ';};
  $('steerSlider').oninput=function(){$('steerVal').textContent=this.value+'°';};
  $('sigSlider').oninput=function(){$('sigVal').textContent=this.value+'°';};
  $('snrSlider').oninput=function(){$('snrVal2').textContent=this.value+' dB';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — SDR Coherent
   Animated phased array beam pattern + array factor visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
function boot(){
  let el=document.getElementById('cohSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='cohSimCanvas';el.width=780;el.height=220;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#040810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.015;cx.fillStyle='#040810';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Array elements at bottom
  const nElem=typeof document.getElementById('elemSlider')!=='undefined'&&document.getElementById('elemSlider')?+document.getElementById('elemSlider').value:8;
  const spacing=Math.min(50,W/(nElem+2));
  const arrayX=W/2-nElem*spacing/2;
  for(let i=0;i<nElem;i++){
    const ex=arrayX+i*spacing+spacing/2,ey=H-25;
    cx.fillStyle='rgba(79,195,247,.6)';cx.beginPath();cx.moveTo(ex,ey-10);cx.lineTo(ex-4,ey);cx.lineTo(ex+4,ey);cx.closePath();cx.fill();
    cx.fillRect(ex-.5,ey,1,8);
  }
  // Beam pattern (polar)
  const bcx=W/2,bcy=H-30,br=H*.6;
  const steer=(typeof document.getElementById('steerSlider')!=='undefined'&&document.getElementById('steerSlider')?+document.getElementById('steerSlider').value:0)*Math.PI/180;
  cx.strokeStyle='rgba(100,200,255,.06)';cx.lineWidth=.5;
  for(let r=20;r<=br;r+=20){cx.beginPath();cx.arc(bcx,bcy,r,-Math.PI,0);cx.stroke();}
  // Array factor
  cx.strokeStyle=acc;cx.lineWidth=2;cx.beginPath();
  for(let a=-180;a<=0;a++){
    const theta=a*Math.PI/180;
    const d=.5;let af2=0;
    for(let n=0;n<nElem;n++)af2+=Math.cos(n*2*Math.PI*d*(Math.sin(theta)-Math.sin(steer)));
    const mag=Math.abs(af2)/nElem;
    const r2=mag*br;
    const px=bcx+Math.cos(theta)*r2,py=bcy+Math.sin(theta)*r2;
    if(a===-180)cx.moveTo(px,py);else cx.lineTo(px,py);
  }
  cx.stroke();
  // Animated wavefront
  const wfAngle=steer;
  for(let w=0;w<5;w++){
    const wr=((t*100+w*40)%200);
    cx.strokeStyle=`rgba(79,195,247,${.15-w*.03})`;cx.lineWidth=1;
    cx.beginPath();const px=bcx+Math.cos(Math.PI/2+wfAngle)*wr;const py=bcy+Math.sin(Math.PI/2+wfAngle)*wr;
    cx.arc(px,py-br*.3,wr*1.5,-Math.PI*.3,Math.PI*.3);cx.stroke();
  }
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText(`Phased Array Beam — ${nElem} elements`,8,14);
  cx.textAlign='right';cx.fillText(`Steer: ${(steer*180/Math.PI).toFixed(0)} deg`,W-8,14);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
})();
