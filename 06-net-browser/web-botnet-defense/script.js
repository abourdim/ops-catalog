/**
 * Workshop DIY — Botnet Defense v1.2
 * Command & Control — Simulated botnet: compromised nodes, C2, DDoS
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.42,152.87C187.48,152.74,187.66,152.63,187.82,152.63C188.09,152.63,190.48,151.54,191.62,150.9L194.17,149.21C197.43,146.97,199.24,146.24,202.59,145.78C203.8,145.62,204.63,145.62,205.93,145.78C212.62,146.63,217.42,150.72,219.33,157.2C219.72,158.55,219.77,162.69,219.41,163.88C218.19,167.86,216.58,170.3,213.79,172.41C209.46,175.7,203.83,176.56,198.81,174.72L187.29,168.46L187.31,160.79z"/><path style="stroke:none;fill:currentColor" d="M259.79,157.67L264.88,148.03H272.34L263.03,163.73V174.99H256.26V164.07L246.79,148.03H254.51z"/><path style="stroke:none;fill:currentColor" d="M240.37,152.74H236.5V170.28H240.37V174.99H225.85V170.28H229.72V152.74H225.85V148.03H240.37z"/><path style="stroke:none;fill:currentColor" d="M330.79,195.73H203.96V199.33H330.79z"/><path style="stroke:none;fill:currentColor" d="M330.79,203.35H161.69V206.96H330.79z"/><path style="stroke:none;fill:currentColor" d="M330.79,210.97H77.14V214.58H330.79z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH6gMKAjgH2Wn1xgAAAAxJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAvBm8AAAB8IkWQwAAAABJRU5ErkJggg==';
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={
  en:{title:'Botnet Defense',subtitle:'Simulated botnet: compromised nodes, C2, DDoS',disconnected:'Disconnected',connected:'Connected',mainSection:'Botnet Network',mainDesc:'Command & Control simulation',sectionA:'Botnet Architecture',sectionB:'Defense Strategies',sectionC:'C2 Trace-Back',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is Botnet Defense?',faq_a1:'A botnet simulation where you defend against compromised nodes and DDoS.',faq_q2:'Is this a real botnet?',faq_a2:'No, everything is simulated safely.',faq_q3:'How do I change the language?',faq_a3:'Open Settings.',faq_q4:'Is my data private?',faq_a4:'Yes. Local only.',howto_1:'Watch C2 infect nodes.',howto_2:'Launch DDoS to see the effect.',howto_3:'Click and isolate infected nodes.',howto_4:'Trace the C2 in Section C.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Languages',wiki_i18n:'Trilingual.',wiki_log_title:'Activity Log',wiki_log:'Timestamped log.',wiki_privacy_title:'Privacy',wiki_privacy:'Local-first.',working:'Working...',ready:'Botnet Defense ready!',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',newVersion:'UPDATE',langChanged:'Language > English',themeChanged:'Theme >',infectBtn:'Spread Infection',ddosBtn:'Launch DDoS',isolateBtn:'Isolate Selected',resetBtn:'Reset Network',traceBtn:'Trace C2',botRefText:'A botnet is compromised computers controlled by a C2 server. Bots launch DDoS, steal data, mine crypto.',defenseText:'Monitor traffic anomalies, isolate compromised nodes, sinkhole C2 domains, deploy IDS.',traceText:'Trace the command chain from bots back to the C2 server.',infecting:'Spreading infection...',infected:'Node infected!',allInfected:'All nodes compromised!',ddosLaunching:'Launching DDoS attack...',ddosActive:'DDoS attack active on target!',isolating:'Isolating node...',isolated:'Node isolated and quarantined!',tracing:'Tracing C2 server...',traced:'C2 server located!',resetDone:'Network reset to clean state',c2Server:'C2 Server',target:'Target',bot:'Bot',clean:'Clean',compromised:'Compromised',quarantined:'Quarantined',ddosTarget:'DDoS Target',selectNode:'Click a node to select it',},
  fr:{title:'Defense Botnet',subtitle:'Botnet simule: noeuds compromis, C2, DDoS',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Reseau Botnet',mainDesc:'Simulation Command & Control',sectionA:'Architecture Botnet',sectionB:'Strategies de Defense',sectionC:'Tracage C2',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que Defense Botnet?',faq_a1:'Une simulation de botnet avec defense active.',faq_q2:'C\'est un vrai botnet?',faq_a2:'Non, tout est simule.',faq_q3:'Changer la langue?',faq_a3:'Ouvrez Parametres.',faq_q4:'Donnees privees?',faq_a4:'Oui.',howto_1:'Voir l\'infection se propager.',howto_2:'Lancer une attaque DDoS.',howto_3:'Isoler les noeuds infectes.',howto_4:'Tracer le C2.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'Trilingue.',wiki_log_title:'Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Local.',working:'En cours...',ready:'Defense Botnet pret!',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',soundEffects:'Sons',whisperMode:'Murmure',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',splashHint:'passer',newVersion:'MAJ',langChanged:'Langue > Francais',themeChanged:'Theme >',infectBtn:'Propager Infection',ddosBtn:'Lancer DDoS',isolateBtn:'Isoler Selection',resetBtn:'Reinitialiser',traceBtn:'Tracer C2',botRefText:'Un botnet est un reseau de machines compromises controlees par un serveur C2.',defenseText:'Surveiller le trafic, isoler les noeuds, sinkholer les domaines C2.',traceText:'Tracer la chaine de commande vers le serveur C2.',infecting:'Propagation...',infected:'Noeud infecte!',allInfected:'Tous compromis!',ddosLaunching:'Lancement DDoS...',ddosActive:'DDoS actif!',isolating:'Isolation...',isolated:'Noeud isole!',tracing:'Tracage C2...',traced:'C2 localise!',resetDone:'Reseau reinitialise',c2Server:'Serveur C2',target:'Cible',bot:'Bot',clean:'Sain',compromised:'Compromis',quarantined:'En quarantaine',ddosTarget:'Cible DDoS',selectNode:'Cliquez un noeud',},
  ar:{title:'دفاع البوتنت',subtitle:'بوتنت محاكى: عقد مخترقة، خادم C2، هجوم DDoS',disconnected:'غير متصل',connected:'متصل',mainSection:'شبكة البوتنت',mainDesc:'محاكاة القيادة والسيطرة',sectionA:'هيكل البوتنت',sectionB:'استراتيجيات الدفاع',sectionC:'تتبع C2',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو دفاع البوتنت؟',faq_a1:'محاكاة بوتنت مع دفاع نشط ضد العقد المخترقة.',faq_q2:'هل هذا بوتنت حقيقي؟',faq_a2:'لا، كل شيء محاكاة.',faq_q3:'كيف اغير اللغة؟',faq_a3:'افتح الاعدادات.',faq_q4:'بياناتي خاصة؟',faq_a4:'نعم.',howto_1:'شاهد انتشار العدوى.',howto_2:'اطلق هجوم DDoS.',howto_3:'اعزل العقد المصابة.',howto_4:'تتبع C2.',wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'الخصوصية',wiki_privacy:'محلي.',working:'جار...',ready:'دفاع البوتنت جاهز!',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',soundEffects:'صوت',whisperMode:'همس',breathingGuide:'تنفس',dhikrTap:'اضغط',musicMode:'موسيقى',splashHint:'تخطي',newVersion:'تحديث',langChanged:'اللغة > العربية',themeChanged:'المظهر >',infectBtn:'نشر العدوى',ddosBtn:'اطلاق DDoS',isolateBtn:'عزل المحدد',resetBtn:'اعادة ضبط',traceBtn:'تتبع C2',botRefText:'البوتنت شبكة اجهزة مخترقة يتحكم فيها خادم C2.',defenseText:'راقب حركة المرور، اعزل العقد، اغرق نطاقات C2.',traceText:'تتبع سلسلة الاوامر الى خادم C2.',infecting:'جاري نشر العدوى...',infected:'تم اختراق العقدة!',allInfected:'كل العقد مخترقة!',ddosLaunching:'جاري اطلاق DDoS...',ddosActive:'هجوم DDoS نشط!',isolating:'جاري العزل...',isolated:'تم عزل العقدة!',tracing:'جاري تتبع C2...',traced:'تم تحديد موقع C2!',resetDone:'تم اعادة ضبط الشبكة',c2Server:'خادم C2',target:'الهدف',bot:'بوت',clean:'نظيف',compromised:'مخترق',quarantined:'معزول',ddosTarget:'هدف DDoS',selectNode:'انقر على عقدة',}
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


/* ═══════ TEMPLATE BOILERPLATE (same as other apps) ═══════ */
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const ft=`[${new Date().toLocaleTimeString()}] ${msg}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success'){playSound('success');pulseBismillah('success');setPetState('happy');}else if(type==='error'){playSound('error');pulseBismillah('error');setPetState('sad');}logWithHistory(msg,type);applyLogFilter();resetPetSleep();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url);}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function pulseBismillah(type){const b=document.querySelector('.bismillah');if(!b)return;b.classList.remove('pulse-success','pulse-error');void b.offsetWidth;b.classList.add(type==='error'?'pulse-error':'pulse-success');setTimeout(()=>b.classList.remove('pulse-success','pulse-error'),700);}
const logHistory=[];function logWithHistory(msg,type){logHistory.push({msg,type,ts:Date.now()});}function initTimeTravel(){document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key==='z'){const p=$('logPanel');if(!p||!p.classList.contains('open'))return;e.preventDefault();if(!logContainer)logContainer=$('logContainer');if(logContainer&&logContainer.lastChild){logContainer.removeChild(logContainer.lastChild);logHistory.pop();playSound('click');}}});}
let typewriterEnabled=true;async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(12+Math.random()*18);}el.classList.remove('typing');}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function toggleWhisper(){}function toggleMusicMode(){log('Music mode requires microphone','info');}
function initGhostUsers(){const gc=document.createElement('canvas');gc.style.cssText='position:fixed;inset:0;z-index:9998;pointer-events:none;';document.body.appendChild(gc);gc.width=innerWidth;gc.height=innerHeight;}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};function playThemeMelody(name){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=THEME_MELODIES[name];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((freq,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=freq;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>breathingActive?b.classList.add('breathing'):b.classList.remove('breathing'));if(!breathingActive)dhikrCount=0;}function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
const PET_STATES={idle:{class:'pet-idle',duration:0},happy:{class:'pet-happy',duration:3000},sad:{class:'pet-sad',duration:3000},sleep:{class:'pet-sleep',duration:0}};let petState='idle',petIdleTimer=null,petSleepTimer=null;function initPixelPet(){const pet=document.createElement('div');pet.id='pixelPet';pet.className='pixel-pet pet-idle';pet.innerHTML=`<img src="${FOOTER_ICON}" alt="Bot"/>`;pet.addEventListener('click',()=>{setPetState('happy');playSound('success');});const f=document.querySelector('.app-footer');if(f)f.insertBefore(pet,f.firstChild);}function setPetState(s){petState=s;const p=$('pixelPet');if(!p)return;p.classList.remove('pet-idle','pet-happy','pet-sad','pet-sleep');p.classList.add(PET_STATES[s].class);if(petIdleTimer)clearTimeout(petIdleTimer);if(PET_STATES[s].duration>0)petIdleTimer=setTimeout(()=>setPetState('idle'),PET_STATES[s].duration);}function resetPetSleep(){if(petSleepTimer)clearTimeout(petSleepTimer);if(petState==='sleep')setPetState('idle');petSleepTimer=setTimeout(()=>setPetState('sleep'),60000);}
function initLogoTracker(){const l=$('logoWrap');if(!l)return;document.addEventListener('mousemove',e=>{const r=l.getBoundingClientRect();const dx=(e.clientX-(r.left+r.width/2))/(innerWidth/2);const dy=(e.clientY-(r.top+r.height/2))/(innerHeight/2);l.style.transform=`perspective(200px) rotateX(${dy*8}deg) rotateY(${-dx*8}deg)`;});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let dragging=false,startX,startW;h.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=p.offsetWidth;document.body.style.cursor='col-resize';document.body.style.userSelect='none';e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=(document.documentElement.dir==='rtl')?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;document.body.style.cursor='';document.body.style.userSelect='';});}
const FOCUSABLE='button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(rid);if(b)b.focus();}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');});});}function trapFocus(e){for(const id of['helpPanel','settingsPanel','logPanel']){const sb=$(id);if(!sb||!sb.classList.contains('open'))continue;const focusable=sb.querySelectorAll(FOCUSABLE);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;}}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ';function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#ef5350';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoClickCount=0,logoClickTimer=null;function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';l.addEventListener('click',()=>{logoClickCount++;if(logoClickTimer)clearTimeout(logoClickTimer);if(logoClickCount>=3){logoClickCount=0;toggleMatrix();}else logoClickTimer=setTimeout(()=>logoClickCount=0,500);});}
function initKonami(){const K=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let idx=0;document.addEventListener('keydown',e=>{if(e.key===K[idx]){idx++;if(idx===K.length){idx=0;setTheme('retro');log('KONAMI!','success');}}else idx=0;});}
function initDebug(){if(!new URLSearchParams(window.location.search).has('debug'))return;const p=$('debugPanel');if(p)p.classList.add('active');}

/* ══════════════════════════════════════════════════════════════
   APP-SPECIFIC: BOTNET DEFENSE
   ══════════════════════════════════════════════════════════════ */
const BOT_NODES=[
  {id:0,x:350,y:50,role:'c2',label:'C2',color:'#ef5350',status:'compromised'},
  {id:1,x:150,y:150,role:'bot',label:'Bot-1',color:'#78909c',status:'clean'},
  {id:2,x:300,y:150,role:'bot',label:'Bot-2',color:'#78909c',status:'clean'},
  {id:3,x:450,y:150,role:'bot',label:'Bot-3',color:'#78909c',status:'clean'},
  {id:4,x:100,y:270,role:'bot',label:'Bot-4',color:'#78909c',status:'clean'},
  {id:5,x:250,y:270,role:'bot',label:'Bot-5',color:'#78909c',status:'clean'},
  {id:6,x:400,y:270,role:'bot',label:'Bot-6',color:'#78909c',status:'clean'},
  {id:7,x:550,y:270,role:'bot',label:'Bot-7',color:'#78909c',status:'clean'},
  {id:8,x:600,y:150,role:'bot',label:'Bot-8',color:'#78909c',status:'clean'},
  {id:9,x:350,y:360,role:'target',label:'Target',color:'#4fc3f7',status:'clean'},
];
const BOT_LINKS=[[0,1],[0,2],[0,3],[0,8],[1,4],[2,5],[3,6],[8,7]];
let selectedBot=null,ddosActive=false,botCanvas,botCtx;

function getNodeColor(node){
  if(node.status==='compromised')return'#ef5350';
  if(node.status==='quarantined')return'#ff9800';
  if(node.role==='target')return ddosActive?'#ef5350':'#4fc3f7';
  if(node.role==='c2')return'#ef5350';
  return'#66bb6a';
}

function drawBotnet(){
  if(!botCtx)return;const c=botCanvas,ctx=botCtx;
  ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#060a12';ctx.fillRect(0,0,c.width,c.height);
  // Links
  BOT_LINKS.forEach(([a,b])=>{
    const na=BOT_NODES[a],nb=BOT_NODES[b];
    if(na.status==='quarantined'||nb.status==='quarantined')return;
    ctx.beginPath();ctx.moveTo(na.x,na.y);ctx.lineTo(nb.x,nb.y);
    const infected=na.status==='compromised'&&nb.status==='compromised';
    ctx.strokeStyle=infected?'rgba(244,67,54,0.4)':'rgba(255,255,255,0.08)';ctx.lineWidth=infected?2:1;ctx.stroke();
  });
  // DDoS lines
  if(ddosActive){
    const target=BOT_NODES[9];
    BOT_NODES.filter(n=>n.status==='compromised'&&n.role==='bot').forEach(bot=>{
      ctx.beginPath();ctx.moveTo(bot.x,bot.y);ctx.lineTo(target.x,target.y);
      ctx.strokeStyle='rgba(244,67,54,0.3)';ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    });
    // Pulse on target
    const pulse=Math.sin(Date.now()/200)*5;
    ctx.beginPath();ctx.arc(target.x,target.y,30+pulse,0,Math.PI*2);ctx.strokeStyle='rgba(244,67,54,0.4)';ctx.lineWidth=3;ctx.stroke();
  }
  // Nodes
  BOT_NODES.forEach((node,i)=>{
    const color=getNodeColor(node);const isSelected=selectedBot===i;
    ctx.beginPath();ctx.arc(node.x,node.y,22,0,Math.PI*2);
    ctx.fillStyle=color+'25';ctx.fill();ctx.strokeStyle=isSelected?'#fff':color;ctx.lineWidth=isSelected?3:2;ctx.stroke();
    if(node.status==='quarantined'){ctx.beginPath();ctx.moveTo(node.x-15,node.y-15);ctx.lineTo(node.x+15,node.y+15);ctx.moveTo(node.x+15,node.y-15);ctx.lineTo(node.x-15,node.y+15);ctx.strokeStyle='#ff9800';ctx.lineWidth=2;ctx.stroke();}
    const icons={c2:'\uD83D\uDDA5',bot:node.status==='compromised'?'\uD83E\uDDA0':'\uD83D\uDCBB',target:'\uD83C\uDFAF'};
    ctx.fillStyle='#fff';ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText(icons[node.role]||'',node.x,node.y+5);
    ctx.font='9px Orbitron,sans-serif';ctx.fillStyle=color;ctx.fillText(node.label,node.x,node.y+38);
  });
}

async function spreadInfection(){
  const s=LANG[currentLang];showToast(s.infecting);log(s.infecting,'error');setStatus(true);
  const bots=BOT_NODES.filter(n=>n.role==='bot'&&n.status==='clean');
  for(const bot of bots){
    await sleep(500);bot.status='compromised';drawBotnet();log(`${s.infected} ${bot.label}`,'error');
  }
  hideToast();if(bots.length===0)log(s.allInfected,'error');else log(s.allInfected,'error');
}

async function launchDDoS(){
  const s=LANG[currentLang];
  const infected=BOT_NODES.filter(n=>n.status==='compromised'&&n.role==='bot');
  if(infected.length===0){log('No infected bots to launch DDoS!','error');return;}
  showToast(s.ddosLaunching);log(s.ddosLaunching,'error');await sleep(800);
  ddosActive=true;drawBotnet();hideToast();log(`${s.ddosActive} (${infected.length} bots)`,'error');
  // Auto-stop after 5 seconds
  setTimeout(()=>{ddosActive=false;drawBotnet();},5000);
}

function isolateSelected(){
  const s=LANG[currentLang];
  if(selectedBot===null){log(s.selectNode,'info');return;}
  const node=BOT_NODES[selectedBot];
  if(node.role==='c2'){log('Cannot isolate C2 directly! Trace it first.','error');return;}
  if(node.role==='target'){log('Cannot isolate the target!','error');return;}
  if(node.status==='quarantined'){log('Already quarantined!','info');return;}
  node.status='quarantined';selectedBot=null;drawBotnet();
  log(`${s.isolated} ${node.label}`,'success');
}

function resetBotnet(){
  const s=LANG[currentLang];
  BOT_NODES.forEach(n=>{if(n.role==='bot')n.status='clean';});
  ddosActive=false;selectedBot=null;drawBotnet();log(s.resetDone,'success');
}

async function traceC2(){
  const s=LANG[currentLang];const el=$('traceResults');if(!el)return;
  showToast(s.tracing);log(s.tracing,'tx');await sleep(1500);
  const infected=BOT_NODES.filter(n=>n.status==='compromised'&&n.role==='bot').length;
  const quarantined=BOT_NODES.filter(n=>n.status==='quarantined').length;
  el.innerHTML=`<div style="background:var(--glass-bg,rgba(255,255,255,0.05));border:2px solid #ef535040;border-radius:12px;padding:1rem;">
    <h4 style="color:#ef5350;margin:0 0 .5rem;">C2 Server Traced!</h4>
    <div style="font-size:.85rem;line-height:1.8;">
      <div>C2 IP: <strong style="color:#ef5350;">198.51.100.66</strong></div>
      <div>C2 Domain: <strong>evil-c2.darknet.xyz</strong></div>
      <div>Protocol: <strong>HTTPS + Custom Binary</strong></div>
      <div>Active Bots: <strong style="color:#ef5350;">${infected}</strong></div>
      <div>Quarantined: <strong style="color:#ff9800;">${quarantined}</strong></div>
      <div>Clean: <strong style="color:#66bb6a;">${8-infected-quarantined}</strong></div>
      <div style="margin-top:.5rem;padding:.5rem;background:rgba(76,175,80,0.1);border-radius:4px;">
        Recommendation: Sinkhole domain evil-c2.darknet.xyz and block IP 198.51.100.66 at firewall.
      </div>
    </div>
  </div>`;
  el.style.display='block';hideToast();log(s.traced,'success');
}

function initBotnet(){
  botCanvas=$('botCanvas');if(botCanvas){botCtx=botCanvas.getContext('2d');drawBotnet();
    botCanvas.addEventListener('click',e=>{const rect=botCanvas.getBoundingClientRect();const mx=(e.clientX-rect.left)*(botCanvas.width/rect.width);const my=(e.clientY-rect.top)*(botCanvas.height/rect.height);
      selectedBot=null;BOT_NODES.forEach((node,i)=>{if(Math.sqrt((mx-node.x)**2+(my-node.y)**2)<25)selectedBot=i;});drawBotnet();
      if(selectedBot!==null)log(`Selected ${BOT_NODES[selectedBot].label} (${BOT_NODES[selectedBot].status})`,'info');
    });
  }
  const ib=$('infectBtn');if(ib)ib.addEventListener('click',spreadInfection);
  const db=$('ddosBtn');if(db)db.addEventListener('click',launchDDoS);
  const isb=$('isolateBtn');if(isb)isb.addEventListener('click',isolateSelected);
  const rb=$('resetBotBtn');if(rb)rb.addEventListener('click',resetBotnet);
  const tb=$('traceBtn');if(tb)tb.addEventListener('click',traceC2);
}

const styleTag=document.createElement('style');styleTag.textContent=`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`;document.head.appendChild(styleTag);

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;initLogResize();
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  const whisperBtn=$('whisperBtn');if(whisperBtn)whisperBtn.onclick=toggleWhisper;
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  const musicBtn=$('musicBtn');if(musicBtn)musicBtn.onclick=toggleMusicMode;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();if(e.key==='Tab')trapFocus(e);});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sL=localStorage.getItem('wdiy-lang'),sT=localStorage.getItem('wdiy-theme');if(sT)setTheme(sT);if(sL)setLanguage(sL);}catch{}
  initKonami();initMatrixTrigger();initDebug();initTimeTravel();initHijriDate();initGhostUsers();initPixelPet();initLogoTracker();
  initBotnet();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: DDoS Traffic Flow Visualizer ═══════ */
(function(){
let dCanvas,dCtx;const flowParticles=[];const trafficBars=[];
function createDC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">DDoS Traffic Monitor</div>';
  const c=document.createElement('canvas');c.width=650;c.height=240;
  c.style.cssText='width:100%;height:auto;display:block;background:#060a12;';
  w.appendChild(c);t.appendChild(w);return c;
}
function drawDC(){
  if(!dCtx)return;const w=dCanvas.width,h=dCanvas.height;
  dCtx.fillStyle='rgba(6,10,18,0.1)';dCtx.fillRect(0,0,w,h);
  dCtx.strokeStyle='rgba(255,255,255,0.02)';dCtx.lineWidth=0.5;
  for(let x=0;x<w;x+=20){dCtx.beginPath();dCtx.moveTo(x,0);dCtx.lineTo(x,h);dCtx.stroke();}
  // Traffic bars
  const infected=BOT_NODES.filter(n=>n.status==='compromised'&&n.role==='bot').length;
  const quarantined=BOT_NODES.filter(n=>n.status==='quarantined').length;
  const barData=[
    {label:'Infected',val:infected,max:8,color:'#ef5350'},
    {label:'Quarantined',val:quarantined,max:8,color:'#ff9800'},
    {label:'Clean',val:8-infected-quarantined,max:8,color:'#66bb6a'},
    {label:'DDoS Level',val:ddosActive?infected*12:0,max:100,color:'#ff4444'},
    {label:'Defense',val:quarantined*15,max:100,color:'#4fc3f7'},
  ];
  const barW=80,barH=h-50,barGap=20,startX=40;
  barData.forEach((d,i)=>{
    const x=startX+i*(barW+barGap);
    if(!trafficBars[i])trafficBars[i]=0;
    trafficBars[i]+=(d.val/d.max-trafficBars[i])*0.05;
    const fill=trafficBars[i]*barH;
    dCtx.fillStyle='rgba(255,255,255,0.03)';dCtx.fillRect(x,20,barW,barH);
    dCtx.fillStyle=d.color+'44';dCtx.fillRect(x,20+barH-fill,barW,fill);
    dCtx.strokeStyle=d.color+'66';dCtx.lineWidth=1;dCtx.strokeRect(x,20,barW,barH);
    // Glow at top of bar
    if(fill>5){const grd=dCtx.createLinearGradient(x,20+barH-fill,x,20+barH-fill+10);
      grd.addColorStop(0,d.color+'44');grd.addColorStop(1,'transparent');
      dCtx.fillStyle=grd;dCtx.fillRect(x,20+barH-fill,barW,10);}
    dCtx.fillStyle=d.color;dCtx.font='9px Orbitron,sans-serif';dCtx.textAlign='center';
    dCtx.fillText(d.label,x+barW/2,h-8);
    dCtx.fillStyle='#fff';dCtx.fillText(d.val.toString(),x+barW/2,15);
  });
  // Attack flow particles
  if(ddosActive){
    for(let i=0;i<2;i++)flowParticles.push({x:Math.random()*w,y:0,vy:2+Math.random()*3,life:1,color:'#ef5350',size:2+Math.random()*3});
  }
  for(let i=flowParticles.length-1;i>=0;i--){
    const p=flowParticles[i];p.y+=p.vy;p.life-=0.01;
    if(p.life<=0||p.y>h){flowParticles.splice(i,1);continue;}
    dCtx.globalAlpha=p.life*0.5;dCtx.beginPath();dCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
    dCtx.fillStyle=p.color;dCtx.fill();dCtx.globalAlpha=1;
  }
  // Alert banner
  if(ddosActive){
    const flash=Math.sin(Date.now()/200)>0;
    dCtx.fillStyle=flash?'rgba(244,67,54,0.15)':'transparent';dCtx.fillRect(0,0,w,20);
    dCtx.fillStyle='#ef5350';dCtx.font='10px Orbitron,sans-serif';dCtx.textAlign='center';
    dCtx.fillText('DDOS ATTACK IN PROGRESS',w/2,14);
  }
  requestAnimationFrame(drawDC);
}
function initDC(){dCanvas=createDC();if(!dCanvas)return;dCtx=dCanvas.getContext('2d');drawDC();}
setTimeout(initDC,2000);
})();
