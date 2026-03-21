/**
 * SDR Filter Forge — Workshop DIY v1.0
 * Design, visualize and test digital filters for SDR
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M10 80 Q25 20 50 50 Q75 80 90 20" stroke="currentColor" fill="none" stroke-width="4" stroke-linecap="round"><animate attributeName="d" values="M10 80 Q25 20 50 50 Q75 80 90 20;M10 50 Q25 80 50 50 Q75 20 90 50;M10 80 Q25 20 50 50 Q75 80 90 20" dur="3s" repeatCount="indefinite"/></path><circle cx="30" cy="40" r="5" fill="currentColor" opacity=".6"><animate attributeName="cy" values="40;60;40" dur="2s" repeatCount="indefinite"/></circle><circle cx="70" cy="60" r="5" fill="currentColor" opacity=".6"><animate attributeName="cy" values="60;40;60" dur="2s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25);}}

const LANG={
en:{title:'SDR Filter Forge',subtitle:'🔬 Filter Forge — Design your digital filters',disconnected:'Disconnected',connected:'Connected',mainSection:'Filter Forge',mainDesc:'Design, visualize and test digital filters',sectionA:'Filter Coefficients',sectionB:'Live Test Signal',sectionC:'Filter Theory',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is Filter Forge?',faq_a1:'A tool for designing and testing digital filters for SDR.',faq_q2:'FIR vs IIR?',faq_a2:'FIR: always stable, linear phase. IIR: more efficient, can be unstable.',faq_q3:'What is the pole-zero plot?',faq_a3:'Shows poles and zeros on the complex plane. Poles inside unit circle = stable.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Choose a filter type and parameters.',howto_2:'Adjust order and cutoff.',howto_3:'Click Design to see frequency response.',howto_4:'Click Test to apply to a sample signal.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 built-in themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual with RTL.',working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'🔬 Filter Forge ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',filterDesign:'Filter Design',orderLabel:'Filter Order',cutoffLabel:'Cutoff (normalized 0-1)',designBtn:'🔨 Design',testBtn:'🧪 Test',resetBtn:'↺ Reset',testDesc:'Apply filter to test signal — see before/after.',theoryIntro:'Digital filters selectively pass or block frequency components:',theory1:'FIR — always stable, linear phase',theory2:'IIR — more efficient, can be unstable',theory3:'Butterworth — maximally flat passband',theory4:'Pole-Zero plot — poles inside unit circle = stable',theory5:'Group delay — phase distortion measure',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',designed:'🔨 Filter designed',tested:'🧪 Filter tested on signal',resetDone:'↺ Filter reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
fr:{title:'Forge de Filtres SDR',subtitle:'🔬 Forge de Filtres — Concevez vos filtres numeriques',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Forge de Filtres',mainDesc:'Concevez, visualisez et testez des filtres numeriques',sectionA:'Coefficients du Filtre',sectionB:'Signal Test en Direct',sectionC:'Theorie des Filtres',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que la Forge de Filtres?',faq_a1:'Un outil pour concevoir et tester des filtres numeriques SDR.',faq_q2:'FIR vs IIR?',faq_a2:'FIR: toujours stable, phase lineaire. IIR: plus efficace, peut etre instable.',faq_q3:'Qu\'est-ce que le diagramme poles-zeros?',faq_a3:'Montre poles et zeros sur le plan complexe.',faq_q4:'Mes donnees sont privees?',faq_a4:'Oui. Tout fonctionne localement.',howto_1:'Choisissez un type de filtre.',howto_2:'Ajustez l\'ordre et la coupure.',howto_3:'Cliquez Concevoir pour la reponse.',howto_4:'Cliquez Tester pour appliquer au signal.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes integres.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',ready:'🔬 Forge de Filtres prete!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',filterDesign:'Conception Filtre',orderLabel:'Ordre du Filtre',cutoffLabel:'Coupure (normalisee 0-1)',designBtn:'🔨 Concevoir',testBtn:'🧪 Tester',resetBtn:'↺ Reinitialiser',testDesc:'Appliquer le filtre a un signal test.',theoryIntro:'Les filtres numeriques passent ou bloquent selectivement les frequences:',theory1:'FIR — toujours stable, phase lineaire',theory2:'IIR — plus efficace, peut etre instable',theory3:'Butterworth — reponse maximalement plate',theory4:'Diagramme poles-zeros — poles dans le cercle unite = stable',theory5:'Retard de groupe — mesure de distorsion de phase',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',designed:'🔨 Filtre concu',tested:'🧪 Filtre teste',resetDone:'↺ Filtre reinitialise',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
ar:{title:'مسبك المرشحات SDR',subtitle:'🔬 مسبك المرشحات — صمم مرشحاتك الرقمية',disconnected:'غير متصل',connected:'متصل',mainSection:'مسبك المرشحات',mainDesc:'صمم وتصور واختبر المرشحات الرقمية',sectionA:'معاملات المرشح',sectionB:'اشارة اختبار حية',sectionC:'نظرية المرشحات',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',faq_q1:'ما هو مسبك المرشحات؟',faq_a1:'اداة لتصميم واختبار المرشحات الرقمية SDR.',faq_q2:'FIR مقابل IIR؟',faq_a2:'FIR: مستقر دائما. IIR: اكثر كفاءة لكن قد يكون غير مستقر.',faq_q3:'ما هو مخطط القطب والصفر؟',faq_a3:'يظهر الاقطاب والاصفار على المستوى المركب.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء محلي.',howto_1:'اختر نوع المرشح.',howto_2:'اضبط الرتبة والقطع.',howto_3:'اضغط تصميم لرؤية الاستجابة.',howto_4:'اضغط اختبار لتطبيقه على اشارة.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر مدمجة.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'🔬 مسبك المرشحات جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',filterDesign:'تصميم المرشح',orderLabel:'رتبة المرشح',cutoffLabel:'القطع (معياري 0-1)',designBtn:'🔨 تصميم',testBtn:'🧪 اختبار',resetBtn:'↺ اعادة',testDesc:'طبق المرشح على اشارة اختبار.',theoryIntro:'المرشحات الرقمية تمرر او تحجب مكونات التردد بشكل انتقائي:',theory1:'FIR — مستقر دائما، طور خطي',theory2:'IIR — اكثر كفاءة، قد يكون غير مستقر',theory3:'باترورث — استجابة مسطحة قصوى',theory4:'مخطط القطب-الصفر — الاقطاب داخل دائرة الوحدة = مستقر',theory5:'تاخير المجموعة — قياس تشوه الطور',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',designed:'🔨 تم تصميم المرشح',tested:'🧪 تم اختبار المرشح',resetDone:'↺ تم اعادة ضبط المرشح',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'}
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
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='filter-forge-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
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

/* ═══════ FILTER DESIGN ENGINE ═══════ */
let filterCoeffs=[];
let filterType='fir-lp';

function designFIR(order,cutoff,type){
  const h=new Float32Array(order);
  const M=order-1;
  for(let n=0;n<=M;n++){
    const w=.54-.46*Math.cos(2*Math.PI*n/M); // Hamming window
    if(n===M/2){h[n]=cutoff*w;}
    else{const x=n-M/2;h[n]=(Math.sin(Math.PI*cutoff*x)/(Math.PI*x))*w;}
  }
  if(type.includes('hp')){for(let i=0;i<order;i++)h[i]=-h[i];h[Math.floor(M/2)]+=1;}
  if(type.includes('bp')){
    const lp=designFIR(order,cutoff*1.3,'fir-lp');
    const hp=designFIR(order,cutoff*.7,'fir-hp');
    for(let i=0;i<order;i++)h[i]=lp[i]+hp[i];
  }
  return h;
}

function designIIR(order,cutoff,type){
  // Simple Butterworth approximation using cascaded biquads
  const sections=Math.ceil(order/2);
  const coeffs=[];
  const wc=Math.tan(Math.PI*cutoff/2);
  for(let i=0;i<sections;i++){
    const theta=Math.PI*(2*i+1)/(2*order);
    const a1=-2*Math.cos(theta);
    const q=1/(2*Math.cos(theta));
    if(type.includes('lp')){
      coeffs.push({b:[wc*wc,2*wc*wc,wc*wc],a:[1+wc/q+wc*wc,2*(wc*wc-1),1-wc/q+wc*wc]});
    }else if(type.includes('hp')){
      coeffs.push({b:[1,-2,1],a:[1+wc/q+wc*wc,2*(wc*wc-1),1-wc/q+wc*wc]});
    }else{
      coeffs.push({b:[wc,0,-wc],a:[1+wc/q+wc*wc,2*(wc*wc-1),1-wc/q+wc*wc]});
    }
  }
  return coeffs;
}

function computeFreqResponse(coeffs,isFIR,N){
  const mag=new Float32Array(N);
  for(let k=0;k<N;k++){
    const w=Math.PI*k/N;
    if(isFIR){
      let re=0,im=0;
      for(let n=0;n<coeffs.length;n++){re+=coeffs[n]*Math.cos(-w*n);im+=coeffs[n]*Math.sin(-w*n);}
      mag[k]=Math.sqrt(re*re+im*im);
    }else{
      let totalMag=1;
      for(const sec of coeffs){
        let reN=0,imN=0,reD=0,imD=0;
        for(let n=0;n<sec.b.length;n++){reN+=sec.b[n]*Math.cos(-w*n);imN+=sec.b[n]*Math.sin(-w*n);}
        for(let n=0;n<sec.a.length;n++){reD+=sec.a[n]*Math.cos(-w*n);imD+=sec.a[n]*Math.sin(-w*n);}
        const magN=Math.sqrt(reN*reN+imN*imN);
        const magD=Math.sqrt(reD*reD+imD*imD);
        totalMag*=magN/(magD+1e-20);
      }
      mag[k]=totalMag;
    }
  }
  return mag;
}

function drawFreqResponse(mag){
  const c=$('freqResponseCanvas');if(!c)return;
  const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;
  for(let i=0;i<10;i++){ctx.beginPath();ctx.moveTo(0,i/10*h);ctx.lineTo(w,i/10*h);ctx.stroke();}
  for(let i=0;i<10;i++){ctx.beginPath();ctx.moveTo(i/10*w,0);ctx.lineTo(i/10*w,h);ctx.stroke();}
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  const maxM=Math.max(...mag)||1;
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
  for(let i=0;i<mag.length;i++){
    const x=i/mag.length*w;
    const db=20*Math.log10(mag[i]/maxM+1e-10);
    const y=h-((db+60)/60)*h;
    if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));
  }
  ctx.stroke();
  ctx.fillStyle='#8899aa';ctx.font='10px Orbitron,monospace';
  ctx.fillText('0',4,h-4);ctx.fillText('π',w-12,h-4);ctx.fillText('0 dB',4,12);ctx.fillText('-60 dB',4,h-14);
}

function drawPoleZero(coeffs,isFIR){
  const c=$('poleZeroCanvas');if(!c)return;
  const ctx=c.getContext('2d'),s=c.width,r=s/2-20,cx=s/2,cy=s/2;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,s,s);
  // Unit circle
  ctx.strokeStyle='#334';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,2*Math.PI);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-r-10,cy);ctx.lineTo(cx+r+10,cy);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,cy-r-10);ctx.lineTo(cx,cy+r+10);ctx.stroke();
  ctx.fillStyle='#556';ctx.font='10px monospace';ctx.fillText('Re',cx+r+2,cy-4);ctx.fillText('Im',cx+4,cy-r-4);
  // Zeros (o) and Poles (x)
  if(isFIR){
    // FIR: zeros from polynomial roots approximation (just show on unit circle for display)
    const N=coeffs.length;
    for(let k=0;k<N;k++){
      const angle=2*Math.PI*k/N;
      const zx=cx+r*Math.cos(angle)*.8;const zy=cy-r*Math.sin(angle)*.8;
      ctx.strokeStyle='#0ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(zx,zy,4,0,2*Math.PI);ctx.stroke();
    }
  }else{
    // IIR: show poles and zeros from biquad sections
    const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
    for(const sec of coeffs){
      // Approximate pole positions
      const a1=-sec.a[1]/sec.a[0],a2=sec.a[2]/sec.a[0];
      const disc=a1*a1-4*a2;
      if(disc>=0){
        const p1=(a1+Math.sqrt(disc))/2,p2=(a1-Math.sqrt(disc))/2;
        [[p1,0],[p2,0]].forEach(([pr,pi])=>{
          const px=cx+pr*r;const py=cy-pi*r;
          ctx.strokeStyle='#f44';ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(px-4,py-4);ctx.lineTo(px+4,py+4);ctx.stroke();
          ctx.beginPath();ctx.moveTo(px+4,py-4);ctx.lineTo(px-4,py+4);ctx.stroke();
        });
      }else{
        const realP=a1/2,imagP=Math.sqrt(-disc)/2;
        [[realP,imagP],[realP,-imagP]].forEach(([pr,pi])=>{
          const px=cx+pr*r;const py=cy-pi*r;
          ctx.strokeStyle='#f44';ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(px-4,py-4);ctx.lineTo(px+4,py+4);ctx.stroke();
          ctx.beginPath();ctx.moveTo(px+4,py-4);ctx.lineTo(px-4,py+4);ctx.stroke();
        });
      }
      // Zeros
      const b1=-sec.b[1]/sec.b[0],b2=sec.b[2]/sec.b[0];
      const dz=b1*b1-4*b2;
      if(dz>=0){
        [[( b1+Math.sqrt(dz))/2,0],[(b1-Math.sqrt(dz))/2,0]].forEach(([zr,zi])=>{
          const zx=cx+zr*r;const zy=cy-zi*r;
          ctx.strokeStyle='#0ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(zx,zy,4,0,2*Math.PI);ctx.stroke();
        });
      }
    }
  }
  ctx.fillStyle='#0ff';ctx.font='10px monospace';ctx.fillText('○ zeros',8,16);
  ctx.fillStyle='#f44';ctx.fillText('× poles',8,30);
}

function showCoeffs(coeffs,isFIR){
  const el=$('coeffDisplay');if(!el)return;
  if(isFIR){
    el.textContent='FIR Coefficients (h[n]):\n'+Array.from(coeffs).map((v,i)=>`h[${i}] = ${v.toFixed(8)}`).join('\n');
  }else{
    let txt='IIR Biquad Sections:\n';
    coeffs.forEach((sec,i)=>{
      txt+=`\nSection ${i+1}:\n  b = [${sec.b.map(v=>v.toFixed(6)).join(', ')}]\n  a = [${sec.a.map(v=>v.toFixed(6)).join(', ')}]\n`;
    });
    el.textContent=txt;
  }
}

function designFilter(){
  const type=$('filterDesign').value;
  const order=+$('orderSlider').value;
  const cutoff=+$('cutoffSlider').value/100;
  const isFIR=type.startsWith('fir');
  let coeffs;
  if(isFIR){coeffs=designFIR(order,cutoff,type);}
  else{coeffs=designIIR(order,cutoff,type);}
  filterCoeffs=coeffs;filterType=type;
  const mag=computeFreqResponse(coeffs,isFIR,400);
  drawFreqResponse(mag);
  drawPoleZero(coeffs,isFIR);
  showCoeffs(coeffs,isFIR);
  setStatus(true);
  log(LANG[currentLang].designed+` (${type}, order=${order}, fc=${cutoff.toFixed(2)})`,'success');
}

function testFilter(){
  if(!filterCoeffs.length&&!filterCoeffs.b){log('Design a filter first','error');return;}
  const c=$('testCanvas');if(!c)return;
  const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  const N=512;
  // Generate multi-frequency test signal
  const sig=new Float32Array(N);
  for(let i=0;i<N;i++){
    sig[i]=.3*Math.sin(2*Math.PI*5*i/N)+.3*Math.sin(2*Math.PI*20*i/N)+.3*Math.sin(2*Math.PI*50*i/N)+(Math.random()-.5)*.1;
  }
  // Apply filter
  const isFIR=filterType.startsWith('fir');
  let filtered;
  if(isFIR){
    filtered=new Float32Array(N);
    for(let i=0;i<N;i++){let s=0;for(let j=0;j<filterCoeffs.length;j++){if(i-j>=0)s+=filterCoeffs[j]*sig[i-j];}filtered[i]=s;}
  }else{
    filtered=new Float32Array(sig);
    for(const sec of filterCoeffs){
      const out=new Float32Array(N);let x1=0,x2=0,y1=0,y2=0;
      for(let i=0;i<N;i++){
        out[i]=(sec.b[0]*filtered[i]+sec.b[1]*x1+sec.b[2]*x2-sec.a[1]*y1-sec.a[2]*y2)/sec.a[0];
        x2=x1;x1=filtered[i];y2=y1;y1=out[i];
      }
      filtered=out;
    }
  }
  // Draw original (dim)
  ctx.strokeStyle='#555';ctx.lineWidth=1;ctx.beginPath();
  for(let i=0;i<N;i++){const x=i/N*w,y=h/2-sig[i]*h*.4;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
  // Draw filtered (accent)
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
  for(let i=0;i<N;i++){const x=i/N*w,y=h/2-filtered[i]*h*.4;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
  ctx.fillStyle='#555';ctx.font='10px monospace';ctx.fillText('Original',4,12);
  ctx.fillStyle=accent;ctx.fillText('Filtered',4,24);
  log(LANG[currentLang].tested,'success');
}

function resetFilter(){
  filterCoeffs=[];
  $('orderSlider').value=16;$('orderVal').textContent='16';
  $('cutoffSlider').value=50;$('cutoffVal').textContent='0.50';
  $('filterDesign').value='fir-lp';
  [$('freqResponseCanvas'),$('poleZeroCanvas'),$('testCanvas')].forEach(c=>{if(c)c.getContext('2d').clearRect(0,0,c.width,c.height);});
  $('coeffDisplay').textContent='Design a filter to see coefficients here.';
  setStatus(false);
  log(LANG[currentLang].resetDone,'info');
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
  $('designBtn').onclick=designFilter;$('testBtn').onclick=testFilter;$('resetBtn').onclick=resetFilter;
  $('orderSlider').oninput=function(){$('orderVal').textContent=this.value;};
  $('cutoffSlider').oninput=function(){$('cutoffVal').textContent=(this.value/100).toFixed(2);};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Filter Forge
   Animated impulse response + cascading filter stages
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
function boot(){
  let el=document.getElementById('filterSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='filterSimCanvas';el.width=780;el.height=180;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.02;cx.fillStyle='#060810';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Animated impulse response
  cx.strokeStyle=acc;cx.lineWidth=1.5;cx.beginPath();
  const irW=W*.45;
  for(let i=0;i<200;i++){
    const x=20+i/200*irW;const n=i-100;
    const sinc=n===0?1:Math.sin(Math.PI*n*.1)/(Math.PI*n*.1);
    const win=.54-.46*Math.cos(2*Math.PI*i/200);
    const decay=Math.exp(-Math.abs(n)*.01)*Math.sin(t*3+n*.05)*.1;
    const y=H/2-(sinc*win+decay)*H*.35;
    if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
  }
  cx.stroke();
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='8px monospace';cx.fillText('Impulse Response h[n]',25,20);
  // Filter cascade blocks on right
  const stages=[{label:'LPF',fc:'500'},{label:'HPF',fc:'200'},{label:'BPF',fc:'350'}];
  stages.forEach((s,i)=>{
    const sx=W*.55+i*90,sy=H*.25;
    cx.fillStyle='rgba(100,200,255,.06)';cx.fillRect(sx,sy,75,50);
    cx.strokeStyle='rgba(100,200,255,.2)';cx.strokeRect(sx,sy,75,50);
    cx.fillStyle=acc;cx.font='10px Orbitron,monospace';cx.textAlign='center';
    cx.fillText(s.label,sx+37,sy+22);cx.fillStyle='rgba(200,230,255,.3)';cx.font='8px monospace';
    cx.fillText('fc='+s.fc,sx+37,sy+38);
    if(i<stages.length-1){
      cx.strokeStyle='rgba(100,200,255,.15)';cx.lineWidth=1;
      cx.beginPath();cx.moveTo(sx+75,sy+25);cx.lineTo(sx+90,sy+25);cx.stroke();
      const dx=(t*40)%15;cx.fillStyle=acc;cx.beginPath();cx.arc(sx+75+dx,sy+25,2,0,Math.PI*2);cx.fill();
    }
  });
  // Passband shape at bottom
  cx.strokeStyle='#4f4';cx.lineWidth=1;cx.beginPath();
  for(let i=0;i<W;i++){
    const f=i/W;const lp=1/(1+Math.pow(f/.3,8));
    const y=H-10-lp*50;if(i===0)cx.moveTo(i,y);else cx.lineTo(i,y);
  }
  cx.stroke();
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Filter Forge — Impulse + Cascade Stages',8,14);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
})();
