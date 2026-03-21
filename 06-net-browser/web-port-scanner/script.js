/**
 * Port Scanner — Virtual Nmap
 * Workshop DIY — Net Browser Collection
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M259.8,157.7L264.9,148H272.3L263,163.7V175H256.3V164.1L246.8,148H254.5z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7H236.5V170.3H240.4V175H225.8V170.3H229.7V152.7H225.8V148H240.4z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={
en:{title:'Port Scanner',subtitle:'🔓 Scan virtual servers and discover ports',disconnected:'Disconnected',connected:'Connected',mainSection:'Virtual Nmap',mainDesc:'Scan servers, discover open ports and services',sectionA:'How Port Scanning Works',sectionB:'Common Ports Reference',sectionC:'Vulnerability Assessment',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is Port Scanner?',faq_a1:'A simulated Nmap-like scanner for discovering open ports on virtual servers.',faq_q2:'Is this scanning real servers?',faq_a2:'No, all servers are virtual simulations.',faq_q3:'How do I change the language?',faq_a3:'Open Settings and pick your language.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Select a target server.',howto_2:'Click Scan to start.',howto_3:'Review discovered ports and services.',howto_4:'Open Section C for vulnerability assessment.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual.',wiki_log_title:'📜 Activity Log',wiki_log:'Scan log.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'Local-first.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'🔓 Port Scanner ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',scanBtn:'Scan',port:'Port',state:'State',service:'Service',version:'Version',scanning:'Scanning',scanComplete:'Scan complete!',openPorts:'open ports found',osDetected:'OS Detected',assessBtn:'Assess Vulnerabilities',noScanYet:'Run a scan first!',vulnFound:'vulnerabilities found',scanText:'Port scanning sends probes to ports on a target. Open ports respond, closed send RST, filtered give no response.',portsText:'Well-known ports: 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS, 3306 MySQL, 3389 RDP.',vulnText:'Assess open ports for known vulnerabilities. Outdated services and default credentials are common risks.'},
fr:{title:'Port Scanner',subtitle:'🔓 Scannez des serveurs virtuels',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Nmap Virtuel',mainDesc:'Scannez les serveurs, decouvrez ports et services',sectionA:'Fonctionnement du scan',sectionB:'Ports courants',sectionC:'Evaluation des vulnerabilites',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que Port Scanner ?',faq_a1:'Un scanner simule type Nmap.',faq_q2:'Est-ce un vrai scan ?',faq_a2:'Non, serveurs virtuels.',faq_q3:'Comment changer la langue ?',faq_a3:'Ouvre Parametres.',faq_q4:'Donnees privees ?',faq_a4:'Oui, local.',howto_1:'Selectionne un serveur cible.',howto_2:'Clique Scanner.',howto_3:'Examine ports et services.',howto_4:'Ouvre Section C pour les vulnerabilites.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal de scan.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'🔓 Port Scanner pret !',logCleared:'Efface',copied:'Copie !',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'🔊 Sons',whisperMode:'Murmure',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',scanBtn:'Scanner',port:'Port',state:'Etat',service:'Service',version:'Version',scanning:'Scan en cours',scanComplete:'Scan termine !',openPorts:'ports ouverts trouves',osDetected:'OS detecte',assessBtn:'Evaluer les vulnerabilites',noScanYet:'Lancez un scan d\'abord !',vulnFound:'vulnerabilites trouvees',scanText:'Le scan de ports envoie des sondes aux ports d\'une cible.',portsText:'Ports connus: 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS.',vulnText:'Evaluez les ports ouverts pour des vulnerabilites connues.'},
ar:{title:'ماسح المنافذ',subtitle:'🔓 امسح خوادم افتراضية واكتشف المنافذ',disconnected:'غير متصل',connected:'متصل',mainSection:'Nmap افتراضي',mainDesc:'امسح الخوادم واكتشف المنافذ والخدمات',sectionA:'كيف يعمل مسح المنافذ',sectionB:'مرجع المنافذ الشائعة',sectionC:'تقييم الثغرات',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو ماسح المنافذ؟',faq_a1:'ماسح محاكى مثل Nmap لاكتشاف المنافذ المفتوحة.',faq_q2:'هل هذا مسح حقيقي؟',faq_a2:'لا، خوادم افتراضية للتعليم.',faq_q3:'كيف أغيّر اللغة؟',faq_a3:'افتح الإعدادات.',faq_q4:'بياناتي خاصة؟',faq_a4:'نعم، محلي.',howto_1:'حدد خادماً هدفاً.',howto_2:'انقر مسح.',howto_3:'راجع المنافذ والخدمات.',howto_4:'افتح القسم C لتقييم الثغرات.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل',wiki_log:'سجل المسح.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي أولاً.',working:'جارٍ…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'🔓 ماسح المنافذ جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',export:'تصدير',filterAll:'الكل',soundEffects:'🔊 أصوات',whisperMode:'همس',breathingGuide:'تنفس',dhikrTap:'اضغط',musicMode:'موسيقى',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',scanBtn:'مسح',port:'منفذ',state:'الحالة',service:'الخدمة',version:'الإصدار',scanning:'جاري المسح',scanComplete:'اكتمل المسح!',openPorts:'منافذ مفتوحة',osDetected:'نظام التشغيل المكتشف',assessBtn:'تقييم الثغرات',noScanYet:'قم بمسح أولاً!',vulnFound:'ثغرات مكتشفة',scanText:'مسح المنافذ يرسل تحقيقات للمنافذ على الهدف.',portsText:'المنافذ المعروفة: 22 SSH, 25 SMTP, 53 DNS, 80 HTTP, 443 HTTPS.',vulnText:'قيّم المنافذ المفتوحة بحثاً عن ثغرات معروفة.'}
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
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info');}
let logContainer,typewriterEnabled=true;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;const ft=`[${new Date().toLocaleTimeString()}] ${m}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(t==='success'){playSound('success');pulseBismillah('success');setPetState('happy');}else if(t==='error'){playSound('error');pulseBismillah('error');setPetState('sad');}logHistory.push({m,t,ts:Date.now()});applyLogFilter();resetPetSleep();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='portscan-log.txt';a.click();URL.revokeObjectURL(u);}
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
function playThemeMelody(n){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
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
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
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
   PORT SCANNER ENGINE
   ══════════════════════════════════════════════════════════════ */
const SERVERS=[
  {name:'Web Server',ip:'192.168.1.10',os:'Ubuntu 22.04 LTS (Linux 5.15)',ports:[
    {port:22,state:'open',service:'SSH',version:'OpenSSH 8.9p1'},
    {port:80,state:'open',service:'HTTP',version:'Apache 2.4.52'},
    {port:443,state:'open',service:'HTTPS',version:'Apache 2.4.52 + OpenSSL 3.0.2'},
    {port:3306,state:'filtered',service:'MySQL',version:''},
    {port:8080,state:'closed',service:'HTTP-Proxy',version:''},
    {port:25,state:'closed',service:'SMTP',version:''},
    {port:21,state:'closed',service:'FTP',version:''},
    {port:53,state:'closed',service:'DNS',version:''},
  ],vulns:['Apache 2.4.52 — CVE-2022-31813 (mod_proxy bypass)','OpenSSH 8.9 — No critical CVEs','MySQL filtered — good firewall policy']},
  {name:'Mail Server',ip:'192.168.1.20',os:'Debian 11 (Linux 5.10)',ports:[
    {port:25,state:'open',service:'SMTP',version:'Postfix 3.5.13'},
    {port:110,state:'open',service:'POP3',version:'Dovecot 2.3.13'},
    {port:143,state:'open',service:'IMAP',version:'Dovecot 2.3.13'},
    {port:587,state:'open',service:'Submission',version:'Postfix 3.5.13'},
    {port:993,state:'open',service:'IMAPS',version:'Dovecot 2.3.13'},
    {port:22,state:'open',service:'SSH',version:'OpenSSH 8.4p1'},
    {port:80,state:'closed',service:'HTTP',version:''},
    {port:443,state:'closed',service:'HTTPS',version:''},
  ],vulns:['Dovecot 2.3.13 — CVE-2022-30550 (privilege escalation)','Postfix 3.5 — No critical CVEs','POP3 open — consider disabling for IMAP-only']},
  {name:'Database Server',ip:'192.168.1.30',os:'CentOS Stream 9 (Linux 5.14)',ports:[
    {port:3306,state:'open',service:'MySQL',version:'MySQL 8.0.32'},
    {port:5432,state:'open',service:'PostgreSQL',version:'PostgreSQL 15.2'},
    {port:6379,state:'open',service:'Redis',version:'Redis 7.0.8'},
    {port:27017,state:'filtered',service:'MongoDB',version:''},
    {port:22,state:'open',service:'SSH',version:'OpenSSH 8.7p1'},
    {port:80,state:'closed',service:'HTTP',version:''},
  ],vulns:['Redis 7.0.8 — No auth configured (HIGH RISK)','MySQL 8.0 — Ensure strong passwords','PostgreSQL 15 — Check pg_hba.conf access']},
  {name:'Game Server',ip:'10.0.0.50',os:'Windows Server 2022',ports:[
    {port:3389,state:'open',service:'RDP',version:'Microsoft Terminal Services'},
    {port:25565,state:'open',service:'Minecraft',version:'Paper 1.19.3'},
    {port:27015,state:'open',service:'Source Engine',version:'Valve SRCDS'},
    {port:7777,state:'open',service:'Game Port',version:'Unreal Engine 5'},
    {port:445,state:'filtered',service:'SMB',version:''},
    {port:135,state:'filtered',service:'RPC',version:''},
  ],vulns:['RDP open — Enable NLA, use strong passwords','SMB filtered — good practice','Multiple game ports exposed — use VPN for admin']},
  {name:'File Server',ip:'172.16.0.100',os:'FreeNAS 13.0 (FreeBSD 13.1)',ports:[
    {port:21,state:'open',service:'FTP',version:'ProFTPD 1.3.7e'},
    {port:22,state:'open',service:'SSH',version:'OpenSSH 9.1p1'},
    {port:139,state:'open',service:'NetBIOS',version:'Samba 4.17.5'},
    {port:445,state:'open',service:'SMB',version:'Samba 4.17.5'},
    {port:80,state:'open',service:'HTTP',version:'nginx 1.24.0'},
    {port:443,state:'open',service:'HTTPS',version:'nginx 1.24.0'},
  ],vulns:['FTP open — Use SFTP instead (FTP is unencrypted)','Samba 4.17 — CVE-2023-0225 (info disclosure)','NetBIOS open — Disable if not needed']},
  {name:'IoT Gateway',ip:'192.168.1.1',os:'OpenWrt 22.03 (Linux 5.10)',ports:[
    {port:22,state:'open',service:'SSH',version:'Dropbear 2022.83'},
    {port:53,state:'open',service:'DNS',version:'dnsmasq 2.86'},
    {port:80,state:'open',service:'HTTP',version:'uhttpd 1.0'},
    {port:443,state:'open',service:'HTTPS',version:'uhttpd 1.0 + wolfSSL'},
    {port:1883,state:'open',service:'MQTT',version:'Mosquitto 2.0.15'},
    {port:8883,state:'filtered',service:'MQTTS',version:''},
  ],vulns:['MQTT open without TLS — HIGH RISK for IoT','uhttpd — Change default admin password','Dropbear SSH — Update to latest version']}
];

let scanning=false,lastScanIdx=-1,lastScanPorts=[];

async function runScan(){
  if(scanning)return;
  const s=LANG[currentLang];
  const idx=parseInt($('serverSelect').value);
  const server=SERVERS[idx];
  scanning=true;lastScanIdx=idx;lastScanPorts=[];
  setStatus(true);showToast(`${s.scanning} ${server.ip}...`);
  log(`🔍 ${s.scanning} ${server.name} (${server.ip})...`,'tx');

  $('progressBar').style.display='block';
  $('portResults').style.display='block';
  $('osFingerprint').style.display='none';
  const body=$('portBody');body.innerHTML='';
  const portsToScan=[...server.ports].sort(()=>Math.random()-0.5);
  const total=portsToScan.length;

  for(let i=0;i<total;i++){
    const p=portsToScan[i];
    const pct=Math.round(((i+1)/total)*100);
    $('progressFill').style.width=pct+'%';
    $('progressText').textContent=`${s.scanning} port ${p.port}... ${pct}%`;

    await sleep(200+Math.random()*400);

    const stateColor=p.state==='open'?'#22c55e':p.state==='closed'?'#ef4444':'#f59e0b';
    const stateIcon=p.state==='open'?'🟢':p.state==='closed'?'🔴':'🟡';
    const tr=document.createElement('tr');
    tr.style.cssText='border-bottom:1px solid var(--border);opacity:0;transition:opacity .3s;';
    tr.innerHTML=`<td style="padding:.3rem;font-family:monospace;">${p.port}</td><td style="padding:.3rem;color:${stateColor};font-weight:700;">${stateIcon} ${p.state}</td><td style="padding:.3rem;">${p.service}</td><td style="padding:.3rem;font-size:.75rem;color:var(--text-muted);">${p.version||'—'}</td>`;
    body.appendChild(tr);
    requestAnimationFrame(()=>tr.style.opacity='1');

    if(p.state==='open'){
      log(`🟢 ${p.port}/${p.service} OPEN — ${p.version}`,'success');
      lastScanPorts.push(p);
    }else if(p.state==='filtered'){
      log(`🟡 ${p.port}/${p.service} FILTERED`,'info');
    }
    playSound('click');
  }

  // OS Fingerprint
  await sleep(300);
  const osDiv=$('osFingerprint');
  osDiv.style.display='block';
  osDiv.innerHTML=`<span style="color:var(--accent);font-weight:700;">🖥️ ${s.osDetected}:</span> ${server.os}`;
  log(`🖥️ ${s.osDetected}: ${server.os}`,'info');

  $('progressFill').style.width='100%';
  $('progressText').textContent='100%';
  const openCount=server.ports.filter(p=>p.state==='open').length;
  hideToast();scanning=false;
  log(`${s.scanComplete} ${openCount} ${s.openPorts}`,'success');
}

function assessVulns(){
  const s=LANG[currentLang];
  const r=$('vulnResults');if(!r)return;
  if(lastScanIdx<0){r.style.display='block';r.innerHTML=`<p style="color:var(--text-muted);">${s.noScanYet}</p>`;return;}
  const server=SERVERS[lastScanIdx];
  r.style.display='block';
  let html=`<div style="font-weight:700;margin-bottom:.3rem;color:#f59e0b;">⚠️ ${server.vulns.length} ${s.vulnFound}</div>`;
  server.vulns.forEach(v=>{
    const isHigh=v.includes('HIGH');
    html+=`<div style="padding:.3rem .5rem;margin-bottom:.3rem;border-radius:6px;border-left:3px solid ${isHigh?'#ef4444':'#f59e0b'};background:rgba(0,0,0,.2);font-size:.78rem;">${v}</div>`;
  });
  r.innerHTML=html;
  log(`⚠️ ${server.vulns.length} ${s.vulnFound} on ${server.name}`,'error');
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
  $('scanBtn').onclick=runScan;
  $('assessBtn').onclick=assessVulns;
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Port Scan Visualization Grid ═══════ */
(function(){
let pCanvas,pCtx;const portGrid=new Array(256).fill(0);const scanBeams=[];
function createPC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Port Map Visualizer</div>';
  const c=document.createElement('canvas');c.width=620;c.height=260;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;cursor:crosshair;';
  w.appendChild(c);t.appendChild(w);return c;
}
function drawPC(){
  if(!pCtx)return;const w=pCanvas.width,h=pCanvas.height;
  pCtx.fillStyle='rgba(6,13,26,0.08)';pCtx.fillRect(0,0,w,h);
  // Port grid (16x16)
  const cols=32,rows=8,cellW=(w-40)/cols,cellH=(h-80)/rows;
  const wellKnown={21:'FTP',22:'SSH',23:'Telnet',25:'SMTP',53:'DNS',80:'HTTP',110:'POP3',443:'HTTPS',445:'SMB',3389:'RDP',8080:'Proxy'};
  const openPorts=[22,80,443,8080,3389,21,25,53,110,445];
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const port=r*cols+c+1;const x=20+c*cellW,y=25+r*cellH;
      const isOpen=openPorts.includes(port);
      const isScanning=scanning&&Math.random()>0.98;
      // Decay scan animation
      if(isScanning)portGrid[port%256]=1;
      if(portGrid[port%256]>0)portGrid[port%256]-=0.01;
      const intensity=portGrid[port%256];
      pCtx.fillStyle=isOpen?'rgba(239,68,68,'+(0.2+intensity*0.3)+')':'rgba(59,130,246,'+(intensity*0.15)+')';
      pCtx.fillRect(x,y,cellW-1,cellH-1);
      if(isOpen){pCtx.strokeStyle='#ef444444';pCtx.lineWidth=0.5;pCtx.strokeRect(x,y,cellW-1,cellH-1);}
      // Port number label for well-known
      if(wellKnown[port]){
        pCtx.fillStyle='rgba(255,255,255,0.5)';pCtx.font='5px monospace';pCtx.textAlign='center';
        pCtx.fillText(port.toString(),x+cellW/2,y+cellH/2+2);
      }
    }
  }
  // Scan beam
  if(scanning){
    const beamX=20+(Date.now()/10)%((w-40));
    pCtx.fillStyle='rgba(59,130,246,0.1)';pCtx.fillRect(beamX,25,3,rows*cellH);
  }
  // Legend & stats
  const ly=h-40;
  pCtx.fillStyle='#ef4444';pCtx.fillRect(20,ly,8,8);
  pCtx.fillStyle='rgba(255,255,255,0.4)';pCtx.font='8px monospace';pCtx.textAlign='left';
  pCtx.fillText('Open',32,ly+7);
  pCtx.fillStyle='#3b82f6';pCtx.fillRect(80,ly,8,8);
  pCtx.fillStyle='rgba(255,255,255,0.4)';pCtx.fillText('Closed/Filtered',92,ly+7);
  pCtx.fillText('Ports 1-256 | Status: '+(scanning?'SCANNING':'IDLE'),20,h-8);
  pCtx.fillText('Well-known: FTP(21) SSH(22) HTTP(80) HTTPS(443) RDP(3389)',250,h-8);
  requestAnimationFrame(drawPC);
}
function initPC(){pCanvas=createPC();if(!pCanvas)return;pCtx=pCanvas.getContext('2d');
  pCanvas.addEventListener('click',e=>{
    const rect=pCanvas.getBoundingClientRect();const mx=(e.clientX-rect.left)*(pCanvas.width/rect.width);
    const my=(e.clientY-rect.top)*(pCanvas.height/rect.height);
    const cols=32,cellW=(pCanvas.width-40)/cols,cellH=(pCanvas.height-80)/8;
    const col=Math.floor((mx-20)/cellW),row=Math.floor((my-25)/cellH);
    if(col>=0&&col<cols&&row>=0&&row<8){const port=row*cols+col+1;portGrid[port%256]=1;}
  });
  drawPC();}
setTimeout(initPC,2000);
})();
