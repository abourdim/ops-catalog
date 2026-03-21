/**
 * SDR OS — Workshop DIY v1.0
 * Full SDR operating system in browser with virtual desktop and SDR apps.
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="60" width="8" height="30" rx="2" fill="currentColor" opacity=".7"><animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite"/><animate attributeName="y" values="60;80;60" dur="1s" repeatCount="indefinite"/></rect><rect x="25" y="40" width="8" height="50" rx="2" fill="currentColor" opacity=".8"><animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite"/><animate attributeName="y" values="40;70;40" dur="1.2s" repeatCount="indefinite"/></rect><rect x="40" y="20" width="8" height="70" rx="2" fill="currentColor"><animate attributeName="height" values="70;30;70" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="20;60;20" dur="0.8s" repeatCount="indefinite"/></rect><rect x="55" y="35" width="8" height="55" rx="2" fill="currentColor" opacity=".85"><animate attributeName="height" values="55;15;55" dur="1.1s" repeatCount="indefinite"/><animate attributeName="y" values="35;75;35" dur="1.1s" repeatCount="indefinite"/></rect><rect x="70" y="50" width="8" height="40" rx="2" fill="currentColor" opacity=".75"><animate attributeName="height" values="40;10;40" dur="0.9s" repeatCount="indefinite"/><animate attributeName="y" values="50;80;50" dur="0.9s" repeatCount="indefinite"/></rect><rect x="85" y="55" width="8" height="35" rx="2" fill="currentColor" opacity=".6"><animate attributeName="height" values="35;5;35" dur="1.3s" repeatCount="indefinite"/><animate attributeName="y" values="55;85;55" dur="1.3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,t+.08);o.start(t);o.stop(t+.08);}else if(type==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,t+.3);o.start(t);o.stop(t+.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+.25);o.start(t);o.stop(t+.25);}}
const LANG={
  en:{title:'SDR OS',subtitle:'Full SDR Operating System in Browser',disconnected:'Boot',connected:'Online',mainSection:'SDR Desktop',mainDesc:'Virtual desktop with SDR applications',sectionA:'System Monitor',sectionB:'OS Guide',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is SDR OS?',faq_a1:'A complete SDR OS in your browser.',faq_q2:'How to use?',faq_a2:'Launch apps from the dropdown.',faq_q3:'Real OS?',faq_a3:'Simulated SDR desktop with canvas apps.',faq_q4:'Private?',faq_a4:'Yes. All local.',howto_1:'Select an SDR app.',howto_2:'Click Launch.',howto_3:'Monitor system resources.',howto_4:'Reboot to reset.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Languages',wiki_i18n:'EN, FR, AR.',working:'Working...',filterAll:'All',soundEffects:'Sound effects',ready:'SDR OS booted!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',appLabel:'Launch App',launchApp:'Launch',closeApp:'Close App',reboot:'Reboot',cpu:'CPU:',mem:'Memory:',sdrDev:'SDR Device:',uptime:'Uptime:',appsRunning:'Apps:',guideIntro:'SDR OS provides a complete SDR environment:',guide1:'Launch multiple SDR apps on virtual desktop',guide2:'Spectrum analyzer shows frequency domain',guide3:'Waterfall shows time-frequency',guide4:'Signal recorder captures IQ data',guide5:'Demodulator supports AM/FM/SSB/Digital',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',launched:'Launched:',closed:'App closed',rebooted:'OS rebooted',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'SDR OS',subtitle:'Systeme d\'exploitation SDR complet',disconnected:'Demarrage',connected:'En ligne',mainSection:'Bureau SDR',mainDesc:'Bureau virtuel avec applications SDR',sectionA:'Moniteur Systeme',sectionB:'Guide OS',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que SDR OS?',faq_a1:'Un OS SDR complet dans le navigateur.',faq_q2:'Comment l\'utiliser?',faq_a2:'Lancez des apps depuis le menu.',faq_q3:'Vrai OS?',faq_a3:'Environnement simule avec canvas.',faq_q4:'Prive?',faq_a4:'Oui. Tout local.',howto_1:'Selectionnez une app.',howto_2:'Cliquez Lancer.',howto_3:'Surveillez les ressources.',howto_4:'Redemarrez pour reinitialiser.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'EN, FR, AR.',working:'En cours...',filterAll:'Tout',soundEffects:'Effets',ready:'SDR OS demarre!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',appLabel:'Lancer App',launchApp:'Lancer',closeApp:'Fermer',reboot:'Redemarrer',cpu:'CPU:',mem:'Memoire:',sdrDev:'Appareil SDR:',uptime:'Temps:',appsRunning:'Apps:',guideIntro:'SDR OS fournit un environnement SDR complet:',guide1:'Lancez plusieurs apps SDR',guide2:'Analyseur de spectre',guide3:'Affichage en cascade',guide4:'Enregistreur de signaux',guide5:'Demodulateur multi-mode',splashHint:'passer',langChanged:'Langue: Francais',themeChanged:'Theme:',launched:'Lance:',closed:'App fermee',rebooted:'OS redemarre',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'نظام SDR',subtitle:'نظام تشغيل SDR كامل في المتصفح',disconnected:'تشغيل',connected:'متصل',mainSection:'سطح مكتب SDR',mainDesc:'سطح مكتب افتراضي مع تطبيقات SDR',sectionA:'مراقب النظام',sectionB:'دليل النظام',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة',howto:'كيفية',wiki:'ويكي',faq_q1:'ما هو نظام SDR؟',faq_a1:'نظام تشغيل SDR كامل في المتصفح.',faq_q2:'كيف استخدمه؟',faq_a2:'شغل التطبيقات من القائمة.',faq_q3:'نظام حقيقي؟',faq_a3:'بيئة محاكاة بالكانفاس.',faq_q4:'خاصة؟',faq_a4:'نعم. كل شيء محلي.',howto_1:'اختر تطبيق SDR.',howto_2:'انقر تشغيل.',howto_3:'راقب موارد النظام.',howto_4:'اعد التشغيل للضبط.',wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'EN, FR, AR.',working:'جارٍ...',filterAll:'الكل',soundEffects:'مؤثرات',ready:'تم تشغيل نظام SDR!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',appLabel:'تشغيل تطبيق',launchApp:'تشغيل',closeApp:'اغلاق',reboot:'اعادة تشغيل',cpu:'المعالج:',mem:'الذاكرة:',sdrDev:'جهاز SDR:',uptime:'وقت التشغيل:',appsRunning:'التطبيقات:',guideIntro:'نظام SDR يوفر بيئة كاملة:',guide1:'شغل عدة تطبيقات SDR',guide2:'محلل الطيف يعرض مجال التردد',guide3:'عرض الشلال للوقت-التردد',guide4:'مسجل الاشارات يلتقط بيانات IQ',guide5:'مزيل التضمين يدعم عدة انماط',splashHint:'تخطي',langChanged:'اللغة: العربية',themeChanged:'المظهر:',launched:'تم تشغيل:',closed:'تم اغلاق التطبيق',rebooted:'تم اعادة تشغيل النظام',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'}
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
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;applyLogFilter();}
function clearLog(){$('logContainer').innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='sdr-os-log.txt';a.click();URL.revokeObjectURL(u);}
function setStatus(c){const s=LANG[currentLang];$('statusText').textContent=c?s.connected:s.disconnected;$('statusPill').classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();}));}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){try{$('hijriDate').textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
let logWasOpen=false;function openSettings(){logWasOpen=$('logPanel')?.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){$('logPanel')?.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){$('logPanel')?.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

/* ═══════ OS DESKTOP SIMULATION ═══════ */
let animFrame=null,bootTime=Date.now();
const openApps=[];const appColors={spectrum:'#ff4444',waterfall:'#4488ff',recorder:'#44ff88',demod:'#ffaa00',scanner:'#ff44ff',terminal:'#88ff88'};
const appNames={spectrum:'Spectrum',waterfall:'Waterfall',recorder:'Recorder',demod:'Demodulator',scanner:'Scanner',terminal:'Terminal'};

function drawDesktop(){
  const c=$('desktopCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  // Desktop background
  ctx.fillStyle='#0a0a2a';ctx.fillRect(0,0,w,h);
  // Grid pattern
  ctx.strokeStyle='#111133';ctx.lineWidth=0.5;
  for(let i=0;i<w;i+=20){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,h);ctx.stroke();}
  for(let i=0;i<h;i+=20){ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(w,i);ctx.stroke();}
  // Taskbar
  ctx.fillStyle='#111133';ctx.fillRect(0,h-30,w,30);
  ctx.fillStyle='#8899aa';ctx.font='11px Orbitron,monospace';
  const time=new Date().toLocaleTimeString();
  ctx.fillText('SDR-OS v1.0',8,h-10);ctx.fillText(time,w-80,h-10);
  ctx.fillText('Apps: '+openApps.length,w/2-30,h-10);
  // Draw open app windows
  openApps.forEach((app,i)=>{
    const wx=20+i*130,wy=20,ww=250,wh=160;
    // Window chrome
    ctx.fillStyle='#1a1a3a';ctx.fillRect(wx,wy,ww,wh);
    ctx.strokeStyle=appColors[app]||'#555';ctx.lineWidth=2;ctx.strokeRect(wx,wy,ww,wh);
    // Title bar
    ctx.fillStyle='#222244';ctx.fillRect(wx,wy,ww,20);
    ctx.fillStyle=appColors[app]||'#fff';ctx.font='10px Orbitron,monospace';
    ctx.fillText(appNames[app]||app,wx+8,wy+14);
    // App content simulation
    const cx=wx+5,cy=wy+25,cw=ww-10,ch=wh-30;
    if(app==='spectrum'||app==='scanner'){
      ctx.strokeStyle=appColors[app];ctx.lineWidth=1;ctx.beginPath();
      for(let x=0;x<cw;x++){const f=x/cw;const v=Math.sin(f*30+Date.now()/200)*0.3+Math.random()*0.2+0.3;ctx.lineTo(cx+x,cy+ch-v*ch);}
      ctx.stroke();
    }else if(app==='waterfall'){
      for(let y=0;y<ch;y+=2){for(let x=0;x<cw;x+=3){const v=Math.random();const r=v>0.5?Math.floor(v*255):0;const b=v<=0.5?Math.floor(v*2*255):255-Math.floor((v-0.5)*2*255);ctx.fillStyle=`rgb(${r},0,${b})`;ctx.fillRect(cx+x,cy+y,3,2);}}
    }else if(app==='recorder'){
      ctx.fillStyle='#ff3333';ctx.beginPath();ctx.arc(cx+20,cy+ch/2,8,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#aaa';ctx.font='10px monospace';ctx.fillText('REC '+((Date.now()-bootTime)/1000).toFixed(0)+'s',cx+35,cy+ch/2+4);
      ctx.fillStyle='#333';ctx.fillRect(cx+5,cy+ch-20,cw-10,12);ctx.fillStyle='#44ff44';
      ctx.fillRect(cx+5,cy+ch-20,((Date.now()/100)%100)/100*(cw-10),12);
    }else if(app==='demod'){
      ctx.strokeStyle='#ffaa00';ctx.lineWidth=1;ctx.beginPath();
      for(let x=0;x<cw;x++){const t=x/cw+Date.now()/1000;ctx.lineTo(cx+x,cy+ch/2+Math.sin(t*20)*ch*0.3);}
      ctx.stroke();
      ctx.fillStyle='#aaa';ctx.font='9px monospace';ctx.fillText('FM 98.5 MHz',cx+5,cy+14);
    }else if(app==='terminal'){
      ctx.fillStyle='#000';ctx.fillRect(cx,cy,cw,ch);
      ctx.fillStyle='#00ff00';ctx.font='9px monospace';
      const lines=['sdr@os:~$ rtl_sdr -f 100e6','Found 1 device(s)','Sampling at 2.048 MSPS','Reading samples...','sdr@os:~$ _'];
      lines.forEach((l,li)=>ctx.fillText(l,cx+4,cy+12+li*12));
    }
  });
  // Desktop icons if no apps
  if(openApps.length===0){
    ctx.fillStyle='#556';ctx.font='14px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText('SDR OS Desktop',w/2,h/2-10);ctx.fillText('Launch an app to begin',w/2,h/2+15);ctx.textAlign='left';
  }
  // Update system monitor
  $('cpuVal').textContent=Math.min(100,openApps.length*15+Math.floor(Math.random()*10))+'%';
  $('memVal').textContent=(64+openApps.length*128)+' MB';
  $('uptimeVal').textContent=Math.floor((Date.now()-bootTime)/1000)+'s';
  $('appsVal').textContent=openApps.length;
  animFrame=requestAnimationFrame(drawDesktop);
}

function launchApp(){
  const app=$('appSelect').value;
  if(openApps.includes(app)){log(appNames[app]+' already running','error');return;}
  if(openApps.length>=4){log('Max 4 apps','error');return;}
  openApps.push(app);setStatus(true);
  log(LANG[currentLang].launched+' '+appNames[app],'success');
}
function closeApp(){
  if(openApps.length===0)return;
  const removed=openApps.pop();
  log(LANG[currentLang].closed+' ('+appNames[removed]+')','info');
  if(openApps.length===0)setStatus(false);
}
function rebootOS(){
  openApps.length=0;bootTime=Date.now();setStatus(false);
  const c=$('desktopCanvas');c.getContext('2d').clearRect(0,0,c.width,c.height);
  $('cpuVal').textContent='0%';$('memVal').textContent='0 MB';$('uptimeVal').textContent='0s';$('appsVal').textContent='0';
  log(LANG[currentLang].rebooted,'info');
  setTimeout(()=>{setStatus(true);log('Boot complete','success');},500);
}

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
  $('launchBtn').onclick=launchApp;$('closeAppBtn').onclick=closeApp;$('rebootBtn').onclick=rebootOS;
  setStatus(true);drawDesktop();
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — SDR OS
   Animated desktop environment + system monitor + task manager
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const cpuHist=[];const memHist=[];
function boot(){
  let el=document.getElementById('osSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='osSimCanvas';el.width=780;el.height=220;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#0a0c14;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.016;cx.fillStyle='#0a0c14';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // CPU usage history
  cpuHist.push(20+Math.random()*60+Math.sin(t)*15);if(cpuHist.length>100)cpuHist.shift();
  memHist.push(40+Math.random()*20+Math.sin(t*.5)*10);if(memHist.length>100)memHist.shift();
  // CPU graph
  const gx=20,gy=25,gw=W*.44,gh=H*.4;
  cx.fillStyle='rgba(100,200,255,.03)';cx.fillRect(gx,gy,gw,gh);
  cx.strokeStyle='rgba(100,200,255,.1)';cx.lineWidth=.5;
  for(let i=0;i<5;i++){cx.beginPath();cx.moveTo(gx,gy+i*gh/4);cx.lineTo(gx+gw,gy+i*gh/4);cx.stroke();}
  cx.strokeStyle='#22c55e';cx.lineWidth=1.5;cx.beginPath();
  cpuHist.forEach((v,i)=>{const x=gx+i/100*gw,y=gy+gh-v/100*gh;if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);});cx.stroke();
  cx.fillStyle='#22c55e';cx.font='9px monospace';cx.fillText(`CPU: ${cpuHist[cpuHist.length-1]?.toFixed(0)||0}%`,gx+5,gy+12);
  // Memory graph
  const mx=W*.52,my=25,mw=W*.44,mh=H*.4;
  cx.fillStyle='rgba(100,200,255,.03)';cx.fillRect(mx,my,mw,mh);
  cx.strokeStyle='#4fc3f7';cx.lineWidth=1.5;cx.beginPath();
  memHist.forEach((v,i)=>{const x=mx+i/100*mw,y=my+mh-v/100*mh;if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);});cx.stroke();
  cx.fillStyle='#4fc3f7';cx.font='9px monospace';cx.fillText(`MEM: ${memHist[memHist.length-1]?.toFixed(0)||0}%`,mx+5,my+12);
  // Process list at bottom
  const procs=[{name:'sdr_receiver',cpu:15+Math.random()*10,pid:1024},{name:'fft_worker',cpu:8+Math.random()*5,pid:1025},
    {name:'demod_am',cpu:3+Math.random()*3,pid:1026},{name:'waterfall_ui',cpu:12+Math.random()*8,pid:1027},
    {name:'audio_out',cpu:2+Math.random()*2,pid:1028},{name:'spectrum_log',cpu:1+Math.random(),pid:1029}];
  cx.fillStyle='rgba(0,0,0,.4)';cx.fillRect(0,H*.55,W,H*.45);
  cx.fillStyle='rgba(100,200,255,.4)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('PID     PROCESS              CPU%',20,H*.55+14);
  procs.forEach((p,i)=>{
    cx.fillStyle='rgba(200,230,255,.3)';cx.font='8px monospace';
    cx.fillText(`${p.pid}    ${p.name.padEnd(20)} ${p.cpu.toFixed(1)}%`,20,H*.55+28+i*14);
    cx.fillStyle=acc+'44';cx.fillRect(280,H*.55+19+i*14,p.cpu*3,8);
  });
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('SDR-OS System Monitor',8,14);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
})();
