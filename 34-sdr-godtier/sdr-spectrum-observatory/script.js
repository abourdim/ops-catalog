/**
 * SDR Spectrum Observatory — Workshop DIY v1.0
 * 24/7 spectrum monitoring and anomaly detection.
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="60" width="8" height="30" rx="2" fill="currentColor" opacity=".7"><animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite"/><animate attributeName="y" values="60;80;60" dur="1s" repeatCount="indefinite"/></rect><rect x="25" y="40" width="8" height="50" rx="2" fill="currentColor" opacity=".8"><animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite"/><animate attributeName="y" values="40;70;40" dur="1.2s" repeatCount="indefinite"/></rect><rect x="40" y="20" width="8" height="70" rx="2" fill="currentColor"><animate attributeName="height" values="70;30;70" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="20;60;20" dur="0.8s" repeatCount="indefinite"/></rect><rect x="55" y="35" width="8" height="55" rx="2" fill="currentColor" opacity=".85"><animate attributeName="height" values="55;15;55" dur="1.1s" repeatCount="indefinite"/><animate attributeName="y" values="35;75;35" dur="1.1s" repeatCount="indefinite"/></rect><rect x="70" y="50" width="8" height="40" rx="2" fill="currentColor" opacity=".75"><animate attributeName="height" values="40;10;40" dur="0.9s" repeatCount="indefinite"/><animate attributeName="y" values="50;80;50" dur="0.9s" repeatCount="indefinite"/></rect><rect x="85" y="55" width="8" height="35" rx="2" fill="currentColor" opacity=".6"><animate attributeName="height" values="35;5;35" dur="1.3s" repeatCount="indefinite"/><animate attributeName="y" values="55;85;55" dur="1.3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,c+.08);o.start(c);o.stop(c+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,c+.3);o.start(c);o.stop(c+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+.25);o.start(c);o.stop(c+.25);}}
const LANG={
  en:{title:'Spectrum Observatory',subtitle:'24/7 Spectrum Monitoring',disconnected:'Idle',connected:'Monitoring',mainSection:'Spectrum Monitor',mainDesc:'Continuous spectrum monitoring and anomaly detection',sectionA:'Observatory Stats',sectionB:'Observatory Guide',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is the Observatory?',faq_a1:'Continuous 24/7 spectrum monitoring.',faq_q2:'How does it work?',faq_a2:'Select band, set threshold, start.',faq_q3:'What are anomalies?',faq_a3:'Signals exceeding threshold.',faq_q4:'Private?',faq_a4:'Yes. Local simulation.',howto_1:'Select frequency band.',howto_2:'Set alert threshold.',howto_3:'Start monitoring.',howto_4:'Watch for alerts.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Languages',wiki_i18n:'EN, FR, AR.',working:'Working...',filterAll:'All',soundEffects:'Sound effects',ready:'Observatory ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',bandLabel:'Frequency Band',threshLabel:'Alert Threshold (dB)',startMon:'Start Monitoring',stopMon:'Stop',resetMon:'Reset',scanTime:'Monitoring Time:',anomalies:'Anomalies:',peakSig:'Peak Signal:',noiseFloor:'Noise Floor:',occupancy:'Occupancy:',guideIntro:'Spectrum observatory monitors RF bands:',guide1:'Real-time spectrum and waterfall',guide2:'Automatic anomaly detection',guide3:'Band occupancy stats',guide4:'Alert system for unexpected TX',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',monStarted:'Monitoring started',monStopped:'Stopped',monReset:'Reset',anomalyDetected:'ANOMALY detected at',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Observatoire Spectral',subtitle:'Surveillance Spectrale 24/7',disconnected:'Inactif',connected:'Surveillance',mainSection:'Moniteur Spectral',mainDesc:'Surveillance continue et detection d\'anomalies',sectionA:'Statistiques',sectionB:'Guide',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que l\'observatoire?',faq_a1:'Surveillance spectrale continue 24/7.',faq_q2:'Comment ca marche?',faq_a2:'Selectionnez la bande et demarrez.',faq_q3:'Anomalies?',faq_a3:'Signaux depassant le seuil.',faq_q4:'Prive?',faq_a4:'Oui. Simulation locale.',howto_1:'Selectionnez la bande.',howto_2:'Definissez le seuil.',howto_3:'Demarrez.',howto_4:'Surveillez les alertes.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'EN, FR, AR.',working:'En cours...',filterAll:'Tout',soundEffects:'Effets',ready:'Observatoire pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',bandLabel:'Bande',threshLabel:'Seuil (dB)',startMon:'Demarrer',stopMon:'Arreter',resetMon:'Reinitialiser',scanTime:'Temps:',anomalies:'Anomalies:',peakSig:'Signal pic:',noiseFloor:'Plancher:',occupancy:'Occupation:',guideIntro:'L\'observatoire surveille les bandes RF:',guide1:'Spectre et cascade en temps reel',guide2:'Detection automatique d\'anomalies',guide3:'Statistiques d\'occupation',guide4:'Alertes pour transmissions inattendues',splashHint:'passer',langChanged:'Langue: Francais',themeChanged:'Theme:',monStarted:'Surveillance demarree',monStopped:'Arretee',monReset:'Reinitialise',anomalyDetected:'ANOMALIE detectee a',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'مرصد الطيف',subtitle:'مراقبة الطيف على مدار الساعة',disconnected:'خامل',connected:'مراقبة',mainSection:'مراقب الطيف',mainDesc:'مراقبة مستمرة للطيف وكشف الشذوذ',sectionA:'احصائيات',sectionB:'الدليل',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة',howto:'كيفية',wiki:'ويكي',faq_q1:'ما هو المرصد؟',faq_a1:'مراقبة طيفية مستمرة 24/7.',faq_q2:'كيف يعمل؟',faq_a2:'اختر النطاق واضبط الحد وابدا.',faq_q3:'ما هي الشذوذات؟',faq_a3:'اشارات تتجاوز الحد.',faq_q4:'خاصة؟',faq_a4:'نعم. محاكاة محلية.',howto_1:'اختر نطاق التردد.',howto_2:'اضبط حد التنبيه.',howto_3:'ابدا المراقبة.',howto_4:'راقب التنبيهات.',wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'EN, FR, AR.',working:'جارٍ...',filterAll:'الكل',soundEffects:'مؤثرات',ready:'المرصد جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',bandLabel:'نطاق التردد',threshLabel:'حد التنبيه (dB)',startMon:'بدء المراقبة',stopMon:'ايقاف',resetMon:'اعادة',scanTime:'وقت المراقبة:',anomalies:'الشذوذات:',peakSig:'ذروة الاشارة:',noiseFloor:'ارضية الضوضاء:',occupancy:'الاشغال:',guideIntro:'مرصد الطيف يراقب نطاقات RF:',guide1:'طيف وشلال في الوقت الحقيقي',guide2:'كشف تلقائي للشذوذ',guide3:'احصائيات الاشغال',guide4:'نظام تنبيه للارسالات غير المتوقعة',splashHint:'تخطي',langChanged:'اللغة: العربية',themeChanged:'المظهر:',monStarted:'بدات المراقبة',monStopped:'توقفت',monReset:'اعادة ضبط',anomalyDetected:'تم كشف شذوذ عند',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'}
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
function exportLog(){const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='observatory-log.txt';a.click();URL.revokeObjectURL(u);}
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

/* ═══════ SPECTRUM OBSERVATORY SIMULATION ═══════ */
let running=false,animFrame=null,startTime=0,anomalyCount=0;
const BANDS={fm:{lo:88,hi:108,unit:'MHz',sigs:[{f:0.15,p:-20},{f:0.35,p:-25},{f:0.55,p:-22},{f:0.75,p:-28}]},air:{lo:118,hi:137,unit:'MHz',sigs:[{f:0.2,p:-35},{f:0.6,p:-40}]},ism:{lo:433,hi:434,unit:'MHz',sigs:[{f:0.5,p:-30}]},cell:{lo:700,hi:900,unit:'MHz',sigs:[{f:0.1,p:-25},{f:0.3,p:-20},{f:0.5,p:-22},{f:0.7,p:-18},{f:0.9,p:-24}]},wifi:{lo:2400,hi:2500,unit:'MHz',sigs:[{f:0.25,p:-20},{f:0.5,p:-18},{f:0.75,p:-22}]}};

function genSpectrum(band){
  const N=400,spec=new Float32Array(N);
  const b=BANDS[band];if(!b)return spec;
  for(let i=0;i<N;i++){spec[i]=-60+Math.random()*5;}
  for(const s of b.sigs){const ci=Math.floor(s.f*N),spread=10+Math.random()*5;for(let i=Math.max(0,ci-15);i<Math.min(N,ci+15);i++){const d=Math.abs(i-ci);spec[i]=Math.max(spec[i],s.p+Math.random()*3-d*d*0.1);}}
  // Random anomaly
  if(Math.random()<0.03){const ai=Math.floor(Math.random()*N);spec[ai]=-10+Math.random()*5;}
  return spec;
}

function drawSpectrum(spec,thresh){
  const c=$('spectrumCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(0,i*h/6);ctx.lineTo(w,i*h/6);ctx.stroke();}
  // Threshold line
  const thY=h*(1-(thresh+60)/60);ctx.strokeStyle='#ff333355';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,thY);ctx.lineTo(w,thY);ctx.stroke();ctx.setLineDash([]);
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<spec.length;i++){const x=i/spec.length*w,y=h*(1-(spec[i]+60)/60);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
  ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fillStyle=accent.replace(')',',0.1)').replace('rgb','rgba');ctx.fill();
  const b=BANDS[$('bandSelect').value];
  ctx.fillStyle='#8899aa';ctx.font='10px Orbitron,monospace';
  if(b){ctx.fillText(b.lo+' '+b.unit,4,h-4);ctx.fillText(b.hi+' '+b.unit,w-70,h-4);}
}

function drawWaterfall(spec){
  const c=$('waterfallCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  const img=ctx.getImageData(0,0,w,h-1);ctx.putImageData(img,0,1);
  for(let i=0;i<w;i++){const si=Math.floor(i/w*spec.length),val=Math.max(0,Math.min(1,(spec[si]+60)/60));
    let r,g,b;if(val<.25){r=0;g=0;b=Math.floor(val*4*255);}else if(val<.5){r=0;g=Math.floor((val-.25)*4*255);b=255;}
    else if(val<.75){r=Math.floor((val-.5)*4*255);g=255;b=255-Math.floor((val-.5)*4*255);}else{r=255;g=255-Math.floor((val-.75)*4*255);b=0;}
    ctx.fillStyle=`rgb(${r},${g},${b})`;ctx.fillRect(i,0,1,1);}
}

function drawAlerts(spec,thresh){
  const c=$('alertCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  let hasAnomaly=false;
  for(let i=0;i<spec.length;i++){if(spec[i]>thresh){const x=i/spec.length*w;ctx.fillStyle='#ff3333';ctx.fillRect(x-2,5,4,h-10);hasAnomaly=true;}}
  if(hasAnomaly){ctx.fillStyle='#ff3333';ctx.font='12px Orbitron,monospace';ctx.fillText('ALERT: Signal above threshold!',10,h/2+4);}
  else{ctx.fillStyle='#44ff44';ctx.font='12px Orbitron,monospace';ctx.fillText('All clear - no anomalies',10,h/2+4);}
  return hasAnomaly;
}

function monLoop(){if(!running)return;
  const band=$('bandSelect').value,thresh=+$('threshSlider').value;
  const spec=genSpectrum(band);drawSpectrum(spec,thresh);drawWaterfall(spec);
  const hasAnomaly=drawAlerts(spec,thresh);
  if(hasAnomaly&&Math.random()<0.1){anomalyCount++;const b=BANDS[band];
    const f=(b.lo+Math.random()*(b.hi-b.lo)).toFixed(1);
    log(LANG[currentLang].anomalyDetected+' '+f+' '+b.unit,'error');playSound('error');}
  const peak=Math.max(...spec),noise=spec.reduce((a,b)=>a+b,0)/spec.length;
  let occ=0;for(let i=0;i<spec.length;i++)if(spec[i]>-45)occ++;occ=Math.round(occ/spec.length*100);
  $('scanTimeVal').textContent=Math.floor((Date.now()-startTime)/1000)+'s';
  $('anomaliesVal').textContent=anomalyCount;$('peakSigVal').textContent=peak.toFixed(1)+' dB';
  $('noiseFloorVal').textContent=noise.toFixed(1)+' dB';$('occupancyVal').textContent=occ+'%';
  animFrame=requestAnimationFrame(monLoop);}
function startMon(){if(running)return;running=true;startTime=Date.now();setStatus(true);log(LANG[currentLang].monStarted,'success');monLoop();}
function stopMon(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].monStopped,'info');}
function resetMon(){stopMon();anomalyCount=0;['spectrumCanvas','waterfallCanvas','alertCanvas'].forEach(id=>{const c=$(id);c.getContext('2d').clearRect(0,0,c.width,c.height);});
  $('scanTimeVal').textContent='0s';$('anomaliesVal').textContent='0';$('peakSigVal').textContent='-- dB';$('noiseFloorVal').textContent='-- dB';$('occupancyVal').textContent='0%';
  log(LANG[currentLang].monReset,'info');}

function init(){
  initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',function(){setLanguage(this.value);});$('themeSelect').addEventListener('change',function(){setTheme(this.value);});
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();
  $('startBtn').onclick=startMon;$('stopBtn').onclick=stopMon;$('resetBtn').onclick=resetMon;
  $('threshSlider').oninput=function(){$('threshVal').textContent=this.value+' dB';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Spectrum Observatory
   Animated wideband panoramic spectrum + anomaly detection
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const specHist=[];
function boot(){
  let el=document.getElementById('obsSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='obsSimCanvas';el.width=780;el.height=220;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#030608;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function genSpec(){
  const n=256,d=new Float32Array(n);
  for(let i=0;i<n;i++)d[i]=-100+(Math.random()-.5)*4;
  // Known bands
  const bands=[{c:30,w:8,p:25},{c:80,w:5,p:20},{c:128,w:15,p:30},{c:180,w:4,p:18},{c:220,w:10,p:22}];
  bands.forEach(b=>{for(let i=0;i<n;i++){const dist=(i-b.c)/b.w;d[i]+=b.p*Math.exp(-.5*dist*dist);}});
  // Random transient
  if(Math.random()<.1){const c=Math.floor(Math.random()*n),w=1+Math.random()*3;
    for(let i=0;i<n;i++){const dist=(i-c)/w;d[i]+=35*Math.exp(-.5*dist*dist);}}
  return d;
}
function pCol(v){const n=Math.max(0,Math.min(1,(v+100)/60));
  if(n<.25)return[0,0,n*4*200|0];if(n<.5){const t=(n-.25)*4;return[0,t*200|0,200];}
  if(n<.75){const t=(n-.5)*4;return[t*255|0,200,(1-t)*200|0];}
  const u=(n-.75)*4;return[255,200+u*55|0,u*200|0];
}
function tick(){
  t+=.016;
  specHist.unshift(genSpec());if(specHist.length>H-25)specHist.pop();
  cx.fillStyle='#030608';cx.fillRect(0,0,W,H);
  // Waterfall
  for(let r=0;r<specHist.length;r++){
    const line=specHist[r];
    for(let i=0;i<256;i++){
      const[rr,g,b]=pCol(line[i]);
      cx.fillStyle=`rgb(${rr},${g},${b})`;
      cx.fillRect(i/256*W,20+r,Math.ceil(W/256)+1,1);
    }
  }
  // Overlay current spectrum line at top
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  if(specHist.length>0){
    cx.strokeStyle=acc+'88';cx.lineWidth=1;cx.beginPath();
    const cur=specHist[0];
    for(let i=0;i<256;i++){const x=i/256*W;const y=20-((cur[i]+100)/60)*18;if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);}
    cx.stroke();
  }
  // Band labels
  cx.fillStyle='rgba(255,255,255,.15)';cx.font='7px monospace';cx.textAlign='center';
  const labels=[{x:30,l:'HF'},{x:80,l:'VHF'},{x:128,l:'UHF'},{x:180,l:'L-Band'},{x:220,l:'S-Band'}];
  labels.forEach(lb=>{cx.fillText(lb.l,lb.x/256*W,16);});
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Panoramic Spectrum Observatory — Wideband Monitor',8,12);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
})();
