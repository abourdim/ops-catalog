/**
 * Firewall Fortress — Rule Defense
 * Workshop DIY — Net Browser Collection
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M259.8,157.7L264.9,148H272.3L263,163.7V175H256.3V164.1L246.8,148H254.5z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7H236.5V170.3H240.4V175H225.8V170.3H229.7V152.7H225.8V148H240.4z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={
en:{title:'Firewall Fortress',subtitle:'🏰 Write firewall rules to block attacks',disconnected:'Disconnected',connected:'Connected',mainSection:'Rule Defense',mainDesc:'Block attack packets with firewall rules',sectionA:'How Firewalls Work',sectionB:'Common Attack Patterns',sectionC:'Advanced Rules',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is Firewall Fortress?',faq_a1:'A tower defense game where you write firewall rules to block attack packets.',faq_q2:'How do I win?',faq_a2:'Add DENY rules to block red attack packets. Green packets are safe. Survive all waves!',faq_q3:'How do I change the language?',faq_a3:'Open Settings and pick your language.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Add firewall rules using the rule editor.',howto_2:'Click Start Wave to begin.',howto_3:'Watch packets stream in — blocked = points, passed = damage.',howto_4:'Add more rules between waves.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual.',wiki_log_title:'📜 Activity Log',wiki_log:'Game log.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'Local-first.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'🏰 Firewall Fortress ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',score:'Score',lives:'Lives',wave:'Wave',ruleEditor:'Rule Editor',addRule:'Add',startWave:'Start Wave',resetGame:'Reset',loadPreset:'Load Preset Rules',blocked:'BLOCKED',passed:'PASSED — Damage!',waveComplete:'Wave complete!',gameOver:'GAME OVER!',firewallText:'Firewalls filter traffic based on rules. Each rule specifies criteria and an action (ALLOW or DENY).',attackText:'Common attacks include port scanning, SYN floods, and payload injection.',advancedText:'Use wildcards (*) to match any value. Order matters: rules checked top to bottom.'},
fr:{title:'Firewall Fortress',subtitle:'🏰 Ecrivez des regles pour bloquer les attaques',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Defense par regles',mainDesc:'Bloquez les paquets d\'attaque',sectionA:'Fonctionnement des pare-feu',sectionB:'Patterns d\'attaque',sectionC:'Regles avancees',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que Firewall Fortress ?',faq_a1:'Un jeu de defense ou vous ecrivez des regles pare-feu.',faq_q2:'Comment gagner ?',faq_a2:'Ajoutez des regles DENY pour bloquer les paquets rouges.',faq_q3:'Comment changer la langue ?',faq_a3:'Ouvre Parametres.',faq_q4:'Donnees privees ?',faq_a4:'Oui, tout est local.',howto_1:'Ajoutez des regles avec l\'editeur.',howto_2:'Cliquez Demarrer la vague.',howto_3:'Regardez les paquets — bloques = points, passes = degats.',howto_4:'Ajoutez des regles entre les vagues.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal de jeu.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'🏰 Firewall Fortress pret !',logCleared:'Efface',copied:'Copie !',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'🔊 Sons',whisperMode:'Murmure',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',score:'Score',lives:'Vies',wave:'Vague',ruleEditor:'Editeur de regles',addRule:'Ajouter',startWave:'Demarrer',resetGame:'Reinitialiser',loadPreset:'Charger regles',blocked:'BLOQUE',passed:'PASSE — Degat!',waveComplete:'Vague terminee!',gameOver:'FIN DU JEU!',firewallText:'Les pare-feu filtrent le trafic selon des regles.',attackText:'Les attaques courantes incluent le scan de ports et les floods SYN.',advancedText:'Utilisez * pour correspondre a tout. L\'ordre compte.'},
ar:{title:'حصن الجدار الناري',subtitle:'🏰 اكتب قواعد لصد الهجمات',disconnected:'غير متصل',connected:'متصل',mainSection:'الدفاع بالقواعد',mainDesc:'اصد حزم الهجوم بقواعد الجدار الناري',sectionA:'كيف تعمل الجدران النارية',sectionB:'أنماط الهجوم الشائعة',sectionC:'قواعد متقدمة',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو حصن الجدار الناري؟',faq_a1:'لعبة دفاع تكتب فيها قواعد جدار ناري لصد حزم الهجوم.',faq_q2:'كيف أفوز؟',faq_a2:'أضف قواعد DENY لصد الحزم الحمراء. الخضراء آمنة.',faq_q3:'كيف أغيّر اللغة؟',faq_a3:'افتح الإعدادات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم، كل شيء محلي.',howto_1:'أضف قواعد باستخدام المحرر.',howto_2:'انقر بدء الموجة.',howto_3:'شاهد الحزم — المحجوبة = نقاط، العابرة = ضرر.',howto_4:'أضف قواعد بين الموجات.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل',wiki_log:'سجل اللعبة.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي أولاً.',working:'جارٍ…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'🏰 حصن الجدار الناري جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',export:'تصدير',filterAll:'الكل',soundEffects:'🔊 أصوات',whisperMode:'همس',breathingGuide:'تنفس',dhikrTap:'اضغط',musicMode:'موسيقى',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',score:'النقاط',lives:'الأرواح',wave:'الموجة',ruleEditor:'محرر القواعد',addRule:'إضافة',startWave:'بدء الموجة',resetGame:'إعادة',loadPreset:'تحميل قواعد جاهزة',blocked:'محجوب',passed:'عبر — ضرر!',waveComplete:'اكتملت الموجة!',gameOver:'انتهت اللعبة!',firewallText:'الجدران النارية تفلتر حركة المرور حسب قواعد.',attackText:'الهجمات الشائعة تشمل فحص المنافذ وفيضانات SYN.',advancedText:'استخدم * لمطابقة أي قيمة. الترتيب مهم.'}
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
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${s.themeChanged} ${s['t_'+n]||n}`,'info');}
let logContainer,typewriterEnabled=true;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;const ft=`[${new Date().toLocaleTimeString()}] ${m}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(t==='success'){playSound('success');pulseBismillah('success');setPetState('happy');}else if(t==='error'){playSound('error');pulseBismillah('error');setPetState('sad');}logHistory.push({m,t,ts:Date.now()});applyLogFilter();resetPetSleep();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='firewall-log.txt';a.click();URL.revokeObjectURL(u);}
let toastTimer=null;function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(12+Math.random()*18);}el.classList.remove('typing');}
const logHistory=[];
function pulseBismillah(t){const b=document.querySelector('.bismillah');if(!b)return;b.classList.remove('pulse-success','pulse-error');void b.offsetWidth;b.classList.add(t==='error'?'pulse-error':'pulse-success');setTimeout(()=>b.classList.remove('pulse-success','pulse-error'),700);}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx&&!(audioCtx=new AudioCtx()))return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'||l.classList.contains(activeLogFilter)?'':'none';});}
const PET_STATES={idle:{class:'pet-idle',duration:0},happy:{class:'pet-happy',duration:3000},sad:{class:'pet-sad',duration:3000},sleep:{class:'pet-sleep',duration:0}};
let petState='idle',petIdleTimer=null,petSleepTimer=null;
function initPixelPet(){const p=document.createElement('div');p.id='pixelPet';p.className='pixel-pet pet-idle';p.innerHTML=`<img src="${FOOTER_ICON}" alt="Bot"/>`;p.addEventListener('click',()=>{setPetState('happy');playSound('success');});const f=document.querySelector('.app-footer');if(f)f.insertBefore(p,f.firstChild);}
function setPetState(s){petState=s;const p=$('pixelPet');if(!p)return;p.classList.remove('pet-idle','pet-happy','pet-sad','pet-sleep');p.classList.add(PET_STATES[s].class);if(petIdleTimer)clearTimeout(petIdleTimer);if(PET_STATES[s].duration>0)petIdleTimer=setTimeout(()=>setPetState('idle'),PET_STATES[s].duration);}
function resetPetSleep(){if(petSleepTimer)clearTimeout(petSleepTimer);if(petState==='sleep')setPetState('idle');petSleepTimer=setTimeout(()=>setPetState('sleep'),60000);}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let breathingActive=false,dhikrCount=0;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));log(breathingActive?'🫁 On':'🫁 Off','info');if(!breathingActive&&dhikrCount>0){log(`📿 ${dhikrCount}`,'success');dhikrCount=0;}}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
let recognition=null,whisperActive=false;
function toggleWhisper(){if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){log('🎤 Not supported','error');return;}if(whisperActive){if(recognition)recognition.stop();whisperActive=false;log('🎤 Off','info');return;}const SR=window.SpeechRecognition||window.webkitSpeechRecognition;recognition=new SR();recognition.continuous=true;recognition.interimResults=false;recognition.lang=currentLang==='ar'?'ar-DZ':currentLang==='fr'?'fr-FR':'en-US';recognition.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal){const t=e.results[i][0].transcript.trim();if(t)log(`🎤 ${t}`,'rx');}};recognition.onerror=e=>log(`🎤 ${e.error}`,'error');recognition.onend=()=>{if(whisperActive)recognition.start();};recognition.start();whisperActive=true;log('🎤 On','success');}
function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open');}
function closePanel(p,o,r){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const t=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(t)t.classList.add('active');});});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{d=false;});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}

/* ══════════════════════════════════════════════════════════════
   FIREWALL FORTRESS ENGINE
   ══════════════════════════════════════════════════════════════ */
const ATTACK_IPS=['10.0.66.6','192.168.99.1','172.16.0.100','10.10.10.10','198.51.100.5','203.0.113.42'];
const SAFE_IPS=['192.168.1.10','192.168.1.20','10.0.0.5','172.16.1.50'];
const PROTOS=['TCP','UDP','ICMP'];
const ATTACK_PORTS=[22,23,445,3389,8080,4444,31337];
const SAFE_PORTS=[80,443,53,25,110];

let rules=[],score=0,lives=5,wave=1,gameRunning=false,packets=[],gameAnim=null;

function genPacket(isAttack){
  const proto=PROTOS[Math.floor(Math.random()*PROTOS.length)];
  const src=isAttack?ATTACK_IPS[Math.floor(Math.random()*ATTACK_IPS.length)]:SAFE_IPS[Math.floor(Math.random()*SAFE_IPS.length)];
  const dst='192.168.1.1';
  const port=isAttack?ATTACK_PORTS[Math.floor(Math.random()*ATTACK_PORTS.length)]:SAFE_PORTS[Math.floor(Math.random()*SAFE_PORTS.length)];
  return {x:-30,y:30+Math.random()*190,speed:1+Math.random()*2+wave*0.3,proto,src,dst,port,isAttack,blocked:false,passed:false,fadeOut:0};
}

function matchRule(pkt,rule){
  if(rule.proto!=='*'&&rule.proto!==pkt.proto)return false;
  if(rule.src!=='*'&&rule.src!==pkt.src)return false;
  if(rule.dst!=='*'&&rule.dst!==pkt.dst)return false;
  if(rule.port!=='*'&&parseInt(rule.port)!==pkt.port)return false;
  return true;
}

function checkPacket(pkt){
  for(const r of rules){
    if(matchRule(pkt,r))return r.action;
  }
  return 'ALLOW'; // default allow
}

function renderGame(){
  const c=$('gameCanvas');if(!c)return;const ctx=c.getContext('2d');const w=c.width,h=c.height;
  ctx.clearRect(0,0,w,h);ctx.fillStyle='#0a1628';ctx.fillRect(0,0,w,h);
  // Firewall wall
  const wallX=w*0.7;
  ctx.fillStyle='rgba(255,255,255,0.05)';ctx.fillRect(wallX-3,0,6,h);
  ctx.strokeStyle='var(--accent,#d4a03c)';ctx.lineWidth=2;ctx.setLineDash([5,5]);
  ctx.beginPath();ctx.moveTo(wallX,0);ctx.lineTo(wallX,h);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='12px Tajawal';ctx.fillText('🏰 FIREWALL',wallX-40,h-10);
  // Packets
  packets.forEach(p=>{
    if(p.fadeOut>0){
      ctx.globalAlpha=1-p.fadeOut;
    }
    const color=p.blocked?'#22c55e':p.isAttack?'#ef4444':p.passed?'#fbbf24':'#3b82f6';
    ctx.fillStyle=color;ctx.beginPath();
    // Packet shape
    const sz=12;
    ctx.fillRect(p.x-sz/2,p.y-sz/2,sz,sz);
    ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=1;ctx.strokeRect(p.x-sz/2,p.y-sz/2,sz,sz);
    // Label
    ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='8px monospace';ctx.textAlign='center';
    ctx.fillText(`${p.proto}:${p.port}`,p.x,p.y-10);
    ctx.fillText(p.src.split('.').slice(-1)[0],p.x,p.y+20);
    // Block/pass indicator
    if(p.blocked){
      ctx.fillStyle='#22c55e';ctx.font='14px sans-serif';ctx.fillText('✗',p.x,p.y+4);
    }
    ctx.globalAlpha=1;ctx.textAlign='start';
  });
}

async function runWave(){
  if(gameRunning)return;
  const s=LANG[currentLang];
  gameRunning=true;setStatus(true);
  showToast(`${s.wave} ${wave}`);log(`🏰 ${s.wave} ${wave} starting...`,'tx');
  packets=[];
  const packetCount=5+wave*3;
  const attackRatio=0.4+wave*0.05;

  for(let i=0;i<packetCount;i++){
    if(lives<=0)break;
    const isAttack=Math.random()<attackRatio;
    const pkt=genPacket(isAttack);
    packets.push(pkt);
    // Animate packet moving right
    while(pkt.x<$('gameCanvas').width*0.7&&!pkt.blocked){
      pkt.x+=pkt.speed*3;renderGame();await sleep(20);
    }
    if(!pkt.blocked){
      // Check against rules at firewall
      const action=checkPacket(pkt);
      if(action==='DENY'){
        pkt.blocked=true;score+=10*wave;
        log(`🛡️ ${s.blocked}: ${pkt.proto} ${pkt.src}:${pkt.port}`,'success');
        playSound('success');
      }else{
        // Packet passes
        pkt.passed=true;
        if(pkt.isAttack){
          lives--;log(`💥 ${s.passed} ${pkt.proto} ${pkt.src}:${pkt.port}`,'error');playSound('error');
        }else{
          score+=5;log(`✓ Safe packet passed: ${pkt.proto} :${pkt.port}`,'info');
        }
        // Animate passing through
        while(pkt.x<$('gameCanvas').width+30){pkt.x+=pkt.speed*3;renderGame();await sleep(20);}
      }
    }
    // Animate blocked packet fading
    if(pkt.blocked){for(let f=0;f<10;f++){pkt.fadeOut=f/10;renderGame();await sleep(30);}}
    updateUI();
    await sleep(100);
  }
  if(lives>0){
    log(`${s.waveComplete} ${s.score}: ${score}`,'success');
    wave++;
  }else{
    log(`${s.gameOver} ${s.score}: ${score}`,'error');
  }
  gameRunning=false;hideToast();updateUI();renderGame();
}

function updateUI(){
  $('scoreVal').textContent=score;
  $('livesVal').textContent='❤️'.repeat(Math.max(0,lives));
  $('waveVal').textContent=wave;
}

function addRule(){
  const r={proto:$('ruleProto').value,src:$('ruleSrc').value.trim()||'*',dst:$('ruleDst').value.trim()||'*',port:$('rulePort').value.trim()||'*',action:$('ruleAction').value};
  rules.push(r);
  renderRules();
  log(`📋 Rule added: ${r.action} ${r.proto} ${r.src}→${r.dst}:${r.port}`,'info');
  playSound('click');
}

function renderRules(){
  const list=$('ruleList');list.innerHTML='';
  rules.forEach((r,i)=>{
    const div=document.createElement('div');
    div.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:2px 4px;border-bottom:1px solid var(--border);';
    div.innerHTML=`<span style="color:${r.action==='DENY'?'#ef4444':'#22c55e'};">${r.action}</span> <span>${r.proto} ${r.src}→${r.dst}:${r.port}</span> <button class="btn-sm" onclick="removeRule(${i})" style="padding:1px 4px;font-size:.65rem;">✕</button>`;
    list.appendChild(div);
  });
}

function removeRule(i){rules.splice(i,1);renderRules();playSound('click');}

function resetGame(){
  score=0;lives=5;wave=1;packets=[];gameRunning=false;rules=[];
  updateUI();renderRules();renderGame();log('🔄 Game reset','info');
}

function loadPreset(){
  rules=[
    {proto:'*',src:'10.0.66.6',dst:'*',port:'*',action:'DENY'},
    {proto:'TCP',src:'*',dst:'*',port:'4444',action:'DENY'},
    {proto:'TCP',src:'*',dst:'*',port:'31337',action:'DENY'},
    {proto:'*',src:'198.51.100.5',dst:'*',port:'*',action:'DENY'},
  ];
  renderRules();log('📋 Preset rules loaded','success');
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  $('whisperBtn').onclick=toggleWhisper;
  const bb=$('breathingBtn'),dd=$('dhikrDisplay'),db=$('dhikrBtn');
  if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none';};if(db)db.onclick=incrementDhikr;
  $('musicBtn').onclick=()=>log('🎵 Coming soon','info');
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initKonami();initHijriDate();initPixelPet();

  // App specific
  $('addRuleBtn').onclick=addRule;
  $('startWaveBtn').onclick=runWave;
  $('resetGameBtn').onclick=resetGame;
  $('presetBtn').onclick=loadPreset;
  updateUI();renderGame();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Firewall Rule Match Heatmap ═══════ */
(function(){
let fCanvas,fCtx;const ruleHits=[];const portHeatmap=new Array(65536).fill(0);
function createFC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Firewall Analytics Dashboard</div>';
  const c=document.createElement('canvas');c.width=650;c.height=220;
  c.style.cssText='width:100%;height:auto;display:block;background:#0a1628;';
  w.appendChild(c);t.appendChild(w);return c;
}
function drawFC(){
  if(!fCtx)return;const w=fCanvas.width,h=fCanvas.height;
  fCtx.fillStyle='rgba(10,22,40,0.1)';fCtx.fillRect(0,0,w,h);
  // Port scan visualization (top half)
  const portH=h/2-10;
  const ports=[22,23,25,53,80,110,443,445,3389,4444,8080,31337];
  const barW=Math.floor((w-40)/ports.length)-4;
  ports.forEach((port,i)=>{
    const x=20+i*(barW+4);
    const isAttack=ATTACK_PORTS.includes(port);
    const hitCount=ruleHits.filter(r=>r.port===port).length;
    const barFill=Math.min(hitCount*8,portH);
    fCtx.fillStyle='rgba(255,255,255,0.03)';fCtx.fillRect(x,5,barW,portH);
    fCtx.fillStyle=isAttack?'rgba(244,67,54,0.3)':'rgba(59,130,246,0.3)';
    fCtx.fillRect(x,5+portH-barFill,barW,barFill);
    fCtx.strokeStyle=isAttack?'#ef444444':'#3b82f644';fCtx.lineWidth=0.5;fCtx.strokeRect(x,5,barW,portH);
    fCtx.fillStyle=isAttack?'#ef4444':'#3b82f6';fCtx.font='7px monospace';fCtx.textAlign='center';
    fCtx.fillText(':'+port,x+barW/2,portH+18);
    fCtx.fillStyle='rgba(255,255,255,0.5)';fCtx.fillText(hitCount.toString(),x+barW/2,portH-barFill>10?5+portH-barFill-3:14);
  });
  // Rule match timeline (bottom half)
  const tY=h/2+15;
  fCtx.strokeStyle='rgba(255,255,255,0.05)';fCtx.lineWidth=1;
  fCtx.beginPath();fCtx.moveTo(20,tY);fCtx.lineTo(w-20,tY);fCtx.stroke();
  const recent=ruleHits.slice(-50);
  recent.forEach((hit,i)=>{
    const x=20+(w-40)*(i/50);const y=tY+10+Math.random()*40;
    fCtx.beginPath();fCtx.arc(x,y,3,0,Math.PI*2);
    fCtx.fillStyle=hit.blocked?'#22c55e':'#ef4444';fCtx.fill();
  });
  // Stats bar
  const blocked=ruleHits.filter(r=>r.blocked).length;const passed=ruleHits.length-blocked;
  fCtx.fillStyle='rgba(255,255,255,0.4)';fCtx.font='8px monospace';fCtx.textAlign='left';
  fCtx.fillText('Rules: '+rules.length+' | Blocked: '+blocked+' | Passed: '+passed+' | Score: '+score+' | Wave: '+wave,10,h-5);
  requestAnimationFrame(drawFC);
}
// Hook into packet checking
const origCheckPacket=window.checkPacket;
if(typeof checkPacket==='function'){
  window.checkPacket=function(pkt){
    const result=origCheckPacket(pkt);
    ruleHits.push({port:pkt.port,proto:pkt.proto,src:pkt.src,blocked:result==='DENY',ts:Date.now()});
    if(ruleHits.length>200)ruleHits.shift();
    return result;
  };
}
function initFC(){fCanvas=createFC();if(!fCanvas)return;fCtx=fCanvas.getContext('2d');drawFC();}
setTimeout(initFC,2000);
})();
