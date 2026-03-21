/**
 * SDR RF 101 — Workshop DIY v1.0
 * RF fundamentals course. Learn radio theory interactively.
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="60" width="8" height="30" rx="2" fill="currentColor" opacity=".7"><animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite"/><animate attributeName="y" values="60;80;60" dur="1s" repeatCount="indefinite"/></rect><rect x="25" y="40" width="8" height="50" rx="2" fill="currentColor" opacity=".8"><animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite"/><animate attributeName="y" values="40;70;40" dur="1.2s" repeatCount="indefinite"/></rect><rect x="40" y="20" width="8" height="70" rx="2" fill="currentColor"><animate attributeName="height" values="70;30;70" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="20;60;20" dur="0.8s" repeatCount="indefinite"/></rect><rect x="55" y="35" width="8" height="55" rx="2" fill="currentColor" opacity=".85"><animate attributeName="height" values="55;15;55" dur="1.1s" repeatCount="indefinite"/><animate attributeName="y" values="35;75;35" dur="1.1s" repeatCount="indefinite"/></rect><rect x="70" y="50" width="8" height="40" rx="2" fill="currentColor" opacity=".75"><animate attributeName="height" values="40;10;40" dur="0.9s" repeatCount="indefinite"/><animate attributeName="y" values="50;80;50" dur="0.9s" repeatCount="indefinite"/></rect><rect x="85" y="55" width="8" height="35" rx="2" fill="currentColor" opacity=".6"><animate attributeName="height" values="35;5;35" dur="1.3s" repeatCount="indefinite"/><animate attributeName="y" values="55;85;55" dur="1.3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,t+.08);o.start(t);o.stop(t+.08);}else if(type==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,t+.3);o.start(t);o.stop(t+.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+.25);o.start(t);o.stop(t+.25);}}

const LANG={
  en:{title:'SDR RF 101',subtitle:'RF Fundamentals Course',disconnected:'Ready',connected:'Running',mainSection:'RF Wave Explorer',mainDesc:'Visualize electromagnetic wave properties',sectionA:'Measurements',sectionB:'RF Theory',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is RF 101?',faq_a1:'An interactive RF fundamentals course.',faq_q2:'How do I learn?',faq_a2:'Adjust wave parameters and see effects.',faq_q3:'What topics?',faq_a3:'Waves, frequency, propagation, power, impedance.',faq_q4:'Private?',faq_a4:'Yes. Local only.',howto_1:'Select an RF topic.',howto_2:'Adjust frequency, amplitude, phase.',howto_3:'Watch live updates.',howto_4:'Check measurements.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Languages',wiki_i18n:'Trilingual.',working:'Working...',filterAll:'All',soundEffects:'Sound effects',ready:'RF 101 ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',topicLabel:'Topic',freqLabel:'Frequency (Hz)',ampLabel:'Amplitude',phaseLabel:'Phase (deg)',startSim:'Start',stopSim:'Stop',resetSim:'Reset',wavelength:'Wavelength:',period:'Period:',powerDbm:'Power:',veloc:'Velocity:',theoryIntro:'Fundamental concepts of radio frequency:',theory1:'Wavelength = c/f',theory2:'Power in dBm = 10*log10(P/1mW)',theory3:'Free space path loss grows with f and d',theory4:'Impedance matching maximizes power transfer',theory5:'RF propagates via ground, sky, or LOS',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',simStarted:'Simulation started',simStopped:'Stopped',simReset:'Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'SDR RF 101',subtitle:'Cours Fondamentaux RF',disconnected:'Pret',connected:'En marche',mainSection:'Explorateur Ondes RF',mainDesc:'Visualisez les proprietes des ondes',sectionA:'Mesures',sectionB:'Theorie RF',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que RF 101?',faq_a1:'Cours interactif de fondamentaux RF.',faq_q2:'Comment apprendre?',faq_a2:'Ajustez les parametres.',faq_q3:'Quels sujets?',faq_a3:'Ondes, frequence, propagation, puissance.',faq_q4:'Privees?',faq_a4:'Oui. Local uniquement.',howto_1:'Selectionnez un sujet RF.',howto_2:'Ajustez frequence, amplitude, phase.',howto_3:'Observez en direct.',howto_4:'Consultez les mesures.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'Trilingue.',working:'En cours...',filterAll:'Tout',soundEffects:'Effets sonores',ready:'RF 101 pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',topicLabel:'Sujet',freqLabel:'Frequence (Hz)',ampLabel:'Amplitude',phaseLabel:'Phase (deg)',startSim:'Demarrer',stopSim:'Arreter',resetSim:'Reinitialiser',wavelength:'Longueur d\'onde:',period:'Periode:',powerDbm:'Puissance:',veloc:'Vitesse:',theoryIntro:'Concepts fondamentaux de la radiofrequence:',theory1:'Lambda = c/f',theory2:'Puissance en dBm = 10*log10(P/1mW)',theory3:'Attenuation augmente avec f et d',theory4:'Adaptation d\'impedance maximise le transfert',theory5:'Propagation par sol, ciel ou LOS',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',simStarted:'Simulation demarree',simStopped:'Arretee',simReset:'Reinitialise',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'اساسيات RF',subtitle:'دورة اساسيات الترددات الراديوية',disconnected:'جاهز',connected:'يعمل',mainSection:'مستكشف موجات RF',mainDesc:'تصور خصائص الموجات الكهرومغناطيسية',sectionA:'القياسات',sectionB:'نظرية RF',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة شائعة',howto:'كيفية',wiki:'ويكي',faq_q1:'ما هو RF 101؟',faq_a1:'دورة تفاعلية في اساسيات RF.',faq_q2:'كيف اتعلم؟',faq_a2:'اضبط معلمات الموجة.',faq_q3:'ما المواضيع؟',faq_a3:'الموجات والتردد والانتشار والطاقة.',faq_q4:'خاصة؟',faq_a4:'نعم. محلي فقط.',howto_1:'اختر موضوع RF.',howto_2:'اضبط التردد والسعة والطور.',howto_3:'شاهد التحديثات.',howto_4:'راجع القياسات.',wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'ثلاثي اللغات.',working:'جارٍ...',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'RF 101 جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',topicLabel:'الموضوع',freqLabel:'التردد (هرتز)',ampLabel:'السعة',phaseLabel:'الطور (درجة)',startSim:'ابدا',stopSim:'ايقاف',resetSim:'اعادة',wavelength:'الطول الموجي:',period:'الدورة:',powerDbm:'الطاقة:',veloc:'السرعة:',theoryIntro:'مفاهيم اساسية في الترددات الراديوية:',theory1:'الطول الموجي = c/f',theory2:'الطاقة بـ dBm',theory3:'فقد المسار يزداد',theory4:'مطابقة المعاوقة تزيد نقل الطاقة',theory5:'انتشار RF عبر الارض او السماء',splashHint:'انقر للتخطي',langChanged:'اللغة: العربية',themeChanged:'المظهر:',simStarted:'بدات المحاكاة',simStopped:'توقفت',simReset:'اعادة ضبط',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'}
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
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='rf101-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}
function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l?.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){$('logPanel')?.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){$('logPanel')?.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),conts=document.querySelectorAll('.help-content');tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));conts.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);$(id)?.classList.add('active');}));}

/* ═══════ RF WAVE SIMULATION ═══════ */
let running=false,animFrame=null,timeOffset=0;
function drawWave(){
  if(!running)return;
  const freq=+$('freqSlider').value,amp=+$('ampSlider').value/100,phase=+$('phaseSlider').value*Math.PI/180;
  const c=$('waveCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=0.5;
  ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
  for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(0,i*h/4);ctx.lineTo(w,i*h/4);ctx.stroke();}
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
  for(let i=0;i<w;i++){const t=i/w*0.01+timeOffset;const y=h/2-amp*Math.sin(2*Math.PI*freq*t+phase)*(h/2)*0.85;if(i===0)ctx.moveTo(0,y);else ctx.lineTo(i,y);}
  ctx.stroke();
  ctx.strokeStyle='#4488ff55';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();
  for(let i=0;i<w;i++){const t=i/w*0.01+timeOffset;const y=h/2-0.5*Math.sin(2*Math.PI*freq*2*t)*(h/2)*0.85;if(i===0)ctx.moveTo(0,y);else ctx.lineTo(i,y);}
  ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#8899aa';ctx.font='10px Orbitron,monospace';ctx.fillText(freq+' Hz, '+Math.round(amp*100)+'%',8,16);
  const sc=$('specCanvas'),sctx=sc.getContext('2d'),sw=sc.width,sh=sc.height;
  sctx.fillStyle='#0a0a1a';sctx.fillRect(0,0,sw,sh);
  sctx.strokeStyle='#1a2a3a';for(let i=0;i<5;i++){sctx.beginPath();sctx.moveTo(0,i*sh/5);sctx.lineTo(sw,i*sh/5);sctx.stroke();}
  const fN=freq/5000;sctx.fillStyle=accent;sctx.fillRect(fN*sw-3,sh*0.1,6,sh*0.8*amp);
  sctx.fillStyle=accent+'55';sctx.fillRect(fN*2*sw-2,sh*0.3,4,sh*0.4*0.5);
  sctx.fillStyle='#8899aa';sctx.font='10px Orbitron,monospace';sctx.fillText('0',4,sh-4);sctx.fillText('5 kHz',sw-50,sh-4);sctx.fillText('Spectrum',8,14);
  const wl=3e8/freq;$('waveLenVal').textContent=wl>=1?wl.toFixed(2)+' m':(wl*100).toFixed(2)+' cm';
  $('periodVal').textContent=(1000/freq).toFixed(3)+' ms';
  $('powerVal').textContent=(10*Math.log10(amp*1000+0.001)).toFixed(1)+' dBm';
  timeOffset+=0.0001;animFrame=requestAnimationFrame(drawWave);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawWave();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();timeOffset=0;$('freqSlider').value=1000;$('freqVal').textContent='1000 Hz';$('ampSlider').value=80;$('ampVal').textContent='80%';$('phaseSlider').value=0;$('phaseVal').textContent='0 deg';['waveCanvas','specCanvas'].forEach(id=>{const c=$(id);if(c)c.getContext('2d').clearRect(0,0,c.width,c.height);});$('waveLenVal').textContent='-- m';$('periodVal').textContent='-- ms';$('powerVal').textContent='-- dBm';log(LANG[currentLang].simReset,'info');}

function init(){
  initSplash();$('logoWrap').innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{};});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',function(){setLanguage(this.value);});
  $('themeSelect').addEventListener('change',function(){setTheme(this.value);});
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initHijriDate();
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;
  $('freqSlider').oninput=function(){$('freqVal').textContent=this.value+' Hz';};
  $('ampSlider').oninput=function(){$('ampVal').textContent=this.value+'%';};
  $('phaseSlider').oninput=function(){$('phaseVal').textContent=this.value+' deg';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — RF 101
   Animated EM wave propagation + wavelength visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
function boot(){
  let el=document.getElementById('rf101SimCanvas');
  if(!el){el=document.createElement('canvas');el.id='rf101SimCanvas';el.width=780;el.height=200;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#040810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.03;cx.fillStyle='#040810';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  const mid=H/2;
  // E-field wave (vertical polarization)
  cx.strokeStyle=acc;cx.lineWidth=2;cx.beginPath();
  for(let i=0;i<W;i++){const x=i,y=mid-Math.sin(i*.03-t*3)*H*.3;if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);}
  cx.stroke();
  // B-field wave (90 degrees offset, dimmer)
  cx.strokeStyle='#4fc3f7';cx.lineWidth=1.5;cx.beginPath();
  for(let i=0;i<W;i++){const x=i,y=mid-Math.cos(i*.03-t*3)*H*.25;if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);}
  cx.stroke();
  // Wavelength marker
  const wl=Math.PI*2/.03;const wlStart=100,wlEnd=wlStart+wl;
  cx.strokeStyle='rgba(255,255,255,.3)';cx.lineWidth=1;cx.setLineDash([3,3]);
  cx.beginPath();cx.moveTo(wlStart,mid+H*.35);cx.lineTo(wlStart,mid-H*.35);cx.stroke();
  cx.beginPath();cx.moveTo(wlEnd,mid+H*.35);cx.lineTo(wlEnd,mid-H*.35);cx.stroke();
  cx.beginPath();cx.moveTo(wlStart,mid+H*.33);cx.lineTo(wlEnd,mid+H*.33);cx.stroke();cx.setLineDash([]);
  cx.fillStyle='rgba(255,255,255,.4)';cx.font='10px monospace';cx.textAlign='center';
  cx.fillText('lambda',wlStart+(wlEnd-wlStart)/2,mid+H*.33-5);
  // Direction arrow
  cx.strokeStyle='rgba(255,255,255,.2)';cx.lineWidth=1.5;
  cx.beginPath();cx.moveTo(W-60,mid);cx.lineTo(W-20,mid);cx.stroke();
  cx.beginPath();cx.moveTo(W-20,mid);cx.lineTo(W-28,mid-5);cx.moveTo(W-20,mid);cx.lineTo(W-28,mid+5);cx.stroke();
  cx.fillStyle='rgba(255,255,255,.3)';cx.fillText('propagation',W-40,mid-10);
  // Labels
  cx.fillStyle=acc+'88';cx.font='9px monospace';cx.textAlign='left';cx.fillText('E-field',8,30);
  cx.fillStyle='#4fc3f788';cx.fillText('B-field',8,42);
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';
  cx.fillText('EM Wave Propagation — E and B fields',8,14);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
})();
