/**
 * SDR Server — Workshop DIY v1.0
 * Remote SDR server simulation. Share SDR over network.
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="60" width="8" height="30" rx="2" fill="currentColor" opacity=".7"><animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite"/><animate attributeName="y" values="60;80;60" dur="1s" repeatCount="indefinite"/></rect><rect x="25" y="40" width="8" height="50" rx="2" fill="currentColor" opacity=".8"><animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite"/><animate attributeName="y" values="40;70;40" dur="1.2s" repeatCount="indefinite"/></rect><rect x="40" y="20" width="8" height="70" rx="2" fill="currentColor"><animate attributeName="height" values="70;30;70" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="20;60;20" dur="0.8s" repeatCount="indefinite"/></rect><rect x="55" y="35" width="8" height="55" rx="2" fill="currentColor" opacity=".85"><animate attributeName="height" values="55;15;55" dur="1.1s" repeatCount="indefinite"/><animate attributeName="y" values="35;75;35" dur="1.1s" repeatCount="indefinite"/></rect><rect x="70" y="50" width="8" height="40" rx="2" fill="currentColor" opacity=".75"><animate attributeName="height" values="40;10;40" dur="0.9s" repeatCount="indefinite"/><animate attributeName="y" values="50;80;50" dur="0.9s" repeatCount="indefinite"/></rect><rect x="85" y="55" width="8" height="35" rx="2" fill="currentColor" opacity=".6"><animate attributeName="height" values="35;5;35" dur="1.3s" repeatCount="indefinite"/><animate attributeName="y" values="55;85;55" dur="1.3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,c+.08);o.start(c);o.stop(c+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,c+.3);o.start(c);o.stop(c+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+.25);o.start(c);o.stop(c+.25);}}
const LANG={
  en:{title:'SDR Server',subtitle:'Remote SDR Server',disconnected:'Offline',connected:'Online',mainSection:'Server Dashboard',mainDesc:'Remote SDR server with client connections',sectionA:'Server Stats',sectionB:'Server Guide',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is SDR Server?',faq_a1:'Remote SDR sharing server simulation.',faq_q2:'How does it work?',faq_a2:'Start the server to simulate sharing SDR data.',faq_q3:'Real server?',faq_a3:'Simulated with realistic metrics.',faq_q4:'Private?',faq_a4:'Yes. All local.',howto_1:'Set port and sample rate.',howto_2:'Click Start Server.',howto_3:'Watch clients connect.',howto_4:'Monitor bandwidth.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Languages',wiki_i18n:'EN, FR, AR.',working:'Working...',filterAll:'All',soundEffects:'Sound effects',ready:'SDR Server ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',portLabel:'Server Port',sampleRate:'Sample Rate',maxClients:'Max Clients',startServer:'Start Server',stopServer:'Stop',resetServer:'Reset',serverStatus:'Status:',connClients:'Connected:',dataRate:'Data Rate:',totalSent:'Total Sent:',serverUptime:'Uptime:',guideIntro:'SDR Server shares SDR hardware over network:',guide1:'Start server to accept client connections',guide2:'Clients receive real-time IQ data',guide3:'Bandwidth monitoring per client',guide4:'Multiple clients tune different frequencies',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',serverStarted:'Server started on port',serverStopped:'Server stopped',serverReset:'Server reset',clientConn:'Client connected:',clientDisc:'Client disconnected:',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Serveur SDR',subtitle:'Serveur SDR distant',disconnected:'Hors ligne',connected:'En ligne',mainSection:'Tableau de Bord',mainDesc:'Serveur SDR distant avec connexions',sectionA:'Stats Serveur',sectionB:'Guide',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que le Serveur SDR?',faq_a1:'Simulation de serveur SDR distant.',faq_q2:'Comment ca marche?',faq_a2:'Demarrez pour simuler le partage.',faq_q3:'Vrai serveur?',faq_a3:'Simule avec des metriques realistes.',faq_q4:'Prive?',faq_a4:'Oui. Tout local.',howto_1:'Configurez port et debit.',howto_2:'Demarrez le serveur.',howto_3:'Observez les connexions.',howto_4:'Surveillez la bande passante.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'EN, FR, AR.',working:'En cours...',filterAll:'Tout',soundEffects:'Effets',ready:'Serveur SDR pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',portLabel:'Port',sampleRate:'Debit',maxClients:'Max Clients',startServer:'Demarrer',stopServer:'Arreter',resetServer:'Reinitialiser',serverStatus:'Statut:',connClients:'Connectes:',dataRate:'Debit:',totalSent:'Total envoye:',serverUptime:'Temps:',guideIntro:'Le serveur SDR partage le materiel SDR:',guide1:'Demarrez pour accepter les clients',guide2:'Les clients recoivent des donnees IQ',guide3:'Surveillance de la bande passante',guide4:'Plusieurs clients simultanement',splashHint:'passer',langChanged:'Langue: Francais',themeChanged:'Theme:',serverStarted:'Serveur demarre sur port',serverStopped:'Serveur arrete',serverReset:'Serveur reinitialise',clientConn:'Client connecte:',clientDisc:'Client deconnecte:',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'خادم SDR',subtitle:'خادم SDR عن بعد',disconnected:'غير متصل',connected:'متصل',mainSection:'لوحة الخادم',mainDesc:'خادم SDR عن بعد مع اتصالات العملاء',sectionA:'احصائيات',sectionB:'الدليل',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة',howto:'كيفية',wiki:'ويكي',faq_q1:'ما هو خادم SDR؟',faq_a1:'محاكاة خادم SDR عن بعد.',faq_q2:'كيف يعمل؟',faq_a2:'شغل الخادم لمحاكاة مشاركة البيانات.',faq_q3:'خادم حقيقي؟',faq_a3:'محاكاة بمقاييس واقعية.',faq_q4:'خاصة؟',faq_a4:'نعم. كل شيء محلي.',howto_1:'اضبط المنفذ والمعدل.',howto_2:'شغل الخادم.',howto_3:'راقب اتصالات العملاء.',howto_4:'راقب النطاق الترددي.',wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'EN, FR, AR.',working:'جارٍ...',filterAll:'الكل',soundEffects:'مؤثرات',ready:'خادم SDR جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',portLabel:'المنفذ',sampleRate:'معدل العينات',maxClients:'اقصى عدد',startServer:'تشغيل الخادم',stopServer:'ايقاف',resetServer:'اعادة',serverStatus:'الحالة:',connClients:'متصلون:',dataRate:'معدل البيانات:',totalSent:'اجمالي الارسال:',serverUptime:'وقت التشغيل:',guideIntro:'خادم SDR يشارك العتاد عبر الشبكة:',guide1:'شغل الخادم لقبول العملاء',guide2:'العملاء يستقبلون بيانات IQ',guide3:'مراقبة النطاق الترددي',guide4:'عدة عملاء يضبطون ترددات مختلفة',splashHint:'تخطي',langChanged:'اللغة: العربية',themeChanged:'المظهر:',serverStarted:'بدا الخادم على المنفذ',serverStopped:'توقف الخادم',serverReset:'اعادة ضبط الخادم',clientConn:'عميل متصل:',clientDisc:'عميل انقطع:',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'}
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


let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;$('langSelect').value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+t;d.textContent='['+new Date().toLocaleTimeString()+'] '+m;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;applyLogFilter();}
function clearLog(){$('logContainer').innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='sdr-server-log.txt';a.click();URL.revokeObjectURL(u);}
function setStatus(c){const s=LANG[currentLang];$('statusText').textContent=c?s.connected:s.disconnected;$('statusPill').classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();}));}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){try{$('hijriDate').textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
let logWasOpen=false;function openSettings(){logWasOpen=$('logPanel')?.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){$('logPanel')?.classList.add('open');document.body.classList.add('log-open');}function closeLog(){$('logPanel')?.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

/* ═══════ SERVER SIMULATION ═══════ */
let running=false,animFrame=null,startTime=0,totalBytes=0;
const bwHistory=[];const clients=[];const clientIPs=['192.168.1.42','10.0.0.15','172.16.0.8','192.168.2.100','10.10.1.50'];

function simLoop(){if(!running)return;
  const maxC=+$('maxClientsSlider').value,sr=+$('srSelect').value;
  // Randomly connect/disconnect clients
  if(Math.random()<0.02&&clients.length<maxC){const ip=clientIPs[Math.floor(Math.random()*clientIPs.length)];if(!clients.find(c=>c.ip===ip)){clients.push({ip,freq:(88+Math.random()*20).toFixed(1),connected:Date.now()});log(LANG[currentLang].clientConn+' '+ip,'rx');}}
  if(Math.random()<0.01&&clients.length>0){const rem=clients.splice(Math.floor(Math.random()*clients.length),1)[0];log(LANG[currentLang].clientDisc+' '+rem.ip,'info');}
  // Calculate bandwidth
  const bytesPerSec=clients.length*sr*2;totalBytes+=bytesPerSec/60;
  const mbps=(bytesPerSec/1024/1024).toFixed(2);
  bwHistory.push(+mbps);if(bwHistory.length>100)bwHistory.shift();
  // Draw bandwidth chart
  const c=$('bandwidthCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(0,i*h/5);ctx.lineTo(w,i*h/5);ctx.stroke();}
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  if(bwHistory.length>1){const mx=Math.max(...bwHistory)||1;ctx.strokeStyle='#44ff88';ctx.lineWidth=2;ctx.beginPath();
    for(let i=0;i<bwHistory.length;i++){const x=i/(bwHistory.length-1)*w,y=h-bwHistory[i]/mx*(h-20);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
  ctx.fillStyle='#8899aa';ctx.font='10px Orbitron,monospace';ctx.fillText('Bandwidth: '+mbps+' MB/s',8,14);
  // Draw clients
  const cc=$('clientsCanvas'),cctx=cc.getContext('2d'),cw=cc.width,ch=cc.height;
  cctx.fillStyle='#0a0a1a';cctx.fillRect(0,0,cw,ch);
  clients.forEach((cl,i)=>{const x=10+i*160,y=10;
    cctx.fillStyle='#1a2a3a';cctx.fillRect(x,y,150,ch-20);cctx.strokeStyle=accent;cctx.strokeRect(x,y,150,ch-20);
    cctx.fillStyle='#44ff88';cctx.font='10px Orbitron,monospace';cctx.fillText(cl.ip,x+8,y+18);
    cctx.fillStyle='#aaa';cctx.fillText(cl.freq+' MHz',x+8,y+34);
    const dur=((Date.now()-cl.connected)/1000).toFixed(0);cctx.fillText(dur+'s',x+8,y+50);
    // Activity indicator
    cctx.fillStyle=Math.random()>0.3?'#44ff88':'#333';cctx.beginPath();cctx.arc(x+140,y+18,4,0,Math.PI*2);cctx.fill();
  });
  if(clients.length===0){cctx.fillStyle='#556';cctx.font='12px Orbitron,monospace';cctx.fillText('No clients connected',cw/2-80,ch/2);}
  // Stats
  $('srvStatusVal').textContent=running?'Online':'Offline';$('connClientsVal').textContent=clients.length;
  $('dataRateVal').textContent=mbps+' MB/s';$('totalSentVal').textContent=(totalBytes/1024/1024).toFixed(1)+' MB';
  $('srvUptimeVal').textContent=Math.floor((Date.now()-startTime)/1000)+'s';
  animFrame=requestAnimationFrame(simLoop);
}
function startServer(){if(running)return;running=true;startTime=Date.now();setStatus(true);log(LANG[currentLang].serverStarted+' '+$('portInput').value,'success');simLoop();}
function stopServer(){running=false;if(animFrame)cancelAnimationFrame(animFrame);clients.length=0;setStatus(false);log(LANG[currentLang].serverStopped,'info');}
function resetServer(){stopServer();totalBytes=0;bwHistory.length=0;$('portInput').value=1234;$('srSelect').value='2048000';$('maxClientsSlider').value=5;$('maxClientsVal').textContent='5';
  ['bandwidthCanvas','clientsCanvas'].forEach(id=>{const c=$(id);c.getContext('2d').clearRect(0,0,c.width,c.height);});
  $('srvStatusVal').textContent='Offline';$('connClientsVal').textContent='0';$('dataRateVal').textContent='0 MB/s';$('totalSentVal').textContent='0 MB';$('srvUptimeVal').textContent='0s';
  log(LANG[currentLang].serverReset,'info');}

function init(){
  initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{};});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',function(){setLanguage(this.value);});$('themeSelect').addEventListener('change',function(){setTheme(this.value);});
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();
  $('startBtn').onclick=startServer;$('stopBtn').onclick=stopServer;$('resetBtn').onclick=resetServer;
  $('maxClientsSlider').oninput=function(){$('maxClientsVal').textContent=this.value;};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — SDR Server
   Animated client connections + data throughput graph
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const throughput=[];const clients=[];
function boot(){
  let el=document.getElementById('srvSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='srvSimCanvas';el.width=780;el.height=200;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  for(let i=0;i<5;i++)clients.push({x:120+Math.random()*(W-240),y:40+Math.random()*(H-80),active:Math.random()>.3,phase:Math.random()*Math.PI*2});
}
function tick(){
  t+=.02;cx.fillStyle='#060810';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Server in center
  const sx=W/2,sy=H/2;
  cx.fillStyle='rgba(100,200,255,.1)';cx.fillRect(sx-30,sy-20,60,40);
  cx.strokeStyle='rgba(100,200,255,.3)';cx.strokeRect(sx-30,sy-20,60,40);
  cx.fillStyle=acc;cx.font='10px Orbitron,monospace';cx.textAlign='center';cx.fillText('SERVER',sx,sy+4);
  // Client nodes
  clients.forEach((c,i)=>{
    c.phase+=.02;c.x=sx+Math.cos(i/clients.length*Math.PI*2+t*.3)*150;
    c.y=sy+Math.sin(i/clients.length*Math.PI*2+t*.3)*70;
    cx.fillStyle=c.active?'rgba(34,197,94,.2)':'rgba(239,68,68,.2)';
    cx.beginPath();cx.arc(c.x,c.y,12,0,Math.PI*2);cx.fill();
    cx.strokeStyle=c.active?'#22c55e':'#ef4444';cx.lineWidth=1;cx.stroke();
    cx.fillStyle='rgba(255,255,255,.4)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText(`C${i+1}`,c.x,c.y+3);
    // Data flow lines
    if(c.active){
      cx.strokeStyle='rgba(34,197,94,.15)';cx.lineWidth=1;cx.setLineDash([3,5]);
      cx.beginPath();cx.moveTo(c.x,c.y);cx.lineTo(sx,sy);cx.stroke();cx.setLineDash([]);
      const dot=(t*60+i*20)%Math.hypot(c.x-sx,c.y-sy);
      const ratio=dot/Math.hypot(c.x-sx,c.y-sy);
      const dx=c.x+(sx-c.x)*ratio,dy=c.y+(sy-c.y)*ratio;
      cx.fillStyle=acc;cx.beginPath();cx.arc(dx,dy,2,0,Math.PI*2);cx.fill();
    }
  });
  // Throughput sparkline
  throughput.push(50+Math.random()*40+Math.sin(t)*20);if(throughput.length>80)throughput.shift();
  cx.strokeStyle=acc+'88';cx.lineWidth=1;cx.beginPath();
  throughput.forEach((v,i)=>{const x=W-200+i*2,y=H-10-v*.5;if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);});
  cx.stroke();
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='7px monospace';cx.textAlign='right';
  cx.fillText(`${throughput[throughput.length-1]?.toFixed(0)||0} Mbps`,W-8,H-4);
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('SDR Server — Client Topology',8,14);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
})();
