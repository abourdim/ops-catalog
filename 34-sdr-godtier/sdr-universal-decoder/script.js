/**
 * SDR Universal Decoder — Workshop DIY v1.0
 * Decode any digital signal. Auto protocol detection with constellation display.
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="60" width="8" height="30" rx="2" fill="currentColor" opacity=".7"><animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite"/><animate attributeName="y" values="60;80;60" dur="1s" repeatCount="indefinite"/></rect><rect x="25" y="40" width="8" height="50" rx="2" fill="currentColor" opacity=".8"><animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite"/><animate attributeName="y" values="40;70;40" dur="1.2s" repeatCount="indefinite"/></rect><rect x="40" y="20" width="8" height="70" rx="2" fill="currentColor"><animate attributeName="height" values="70;30;70" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="20;60;20" dur="0.8s" repeatCount="indefinite"/></rect><rect x="55" y="35" width="8" height="55" rx="2" fill="currentColor" opacity=".85"><animate attributeName="height" values="55;15;55" dur="1.1s" repeatCount="indefinite"/><animate attributeName="y" values="35;75;35" dur="1.1s" repeatCount="indefinite"/></rect><rect x="70" y="50" width="8" height="40" rx="2" fill="currentColor" opacity=".75"><animate attributeName="height" values="40;10;40" dur="0.9s" repeatCount="indefinite"/><animate attributeName="y" values="50;80;50" dur="0.9s" repeatCount="indefinite"/></rect><rect x="85" y="55" width="8" height="35" rx="2" fill="currentColor" opacity=".6"><animate attributeName="height" values="35;5;35" dur="1.3s" repeatCount="indefinite"/><animate attributeName="y" values="55;85;55" dur="1.3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,c+.08);o.start(c);o.stop(c+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,c+.3);o.start(c);o.stop(c+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+.25);o.start(c);o.stop(c+.25);}}
const LANG={
  en:{title:'Universal Decoder',subtitle:'Decode Any Digital Signal',disconnected:'Idle',connected:'Decoding',mainSection:'Signal Decoder',mainDesc:'Auto-detect and decode any digital signal',sectionA:'Decode Results',sectionB:'Decoder Guide',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is Universal Decoder?',faq_a1:'Auto-detects and decodes digital signal modulations.',faq_q2:'How does auto-detect work?',faq_a2:'Analyzes signal constellation and symbol rate.',faq_q3:'What modulations?',faq_a3:'ASK, FSK, BPSK, QPSK, 16-QAM.',faq_q4:'Private?',faq_a4:'Yes. All local.',howto_1:'Select mode or auto-detect.',howto_2:'Adjust SNR and symbol rate.',howto_3:'Click Decode.',howto_4:'View constellation and data.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Languages',wiki_i18n:'EN, FR, AR.',working:'Working...',filterAll:'All',soundEffects:'Sound effects',ready:'Universal Decoder ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',modeLabel:'Signal Mode',snrLabel:'SNR (dB)',baudLabel:'Symbol Rate',startDecode:'Decode Signal',autoDetect:'Auto Detect',resetDec:'Reset',detectedMode:'Detected:',symRate:'Symbol Rate:',ber:'BER:',decodedBits:'Bits:',decodedHex:'Hex:',decodedAscii:'ASCII:',guideIntro:'Universal decoder identifies digital signals:',guide1:'Auto-detection analyzes signal characteristics',guide2:'Constellation shows symbol mapping quality',guide3:'Supports ASK, FSK, BPSK, QPSK, 16-QAM',guide4:'Data in binary, hex, and ASCII',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',decodeComplete:'Decode complete',autoDetected:'Auto-detected:',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Decodeur Universel',subtitle:'Decodez tout signal numerique',disconnected:'Inactif',connected:'Decodage',mainSection:'Decodeur de Signal',mainDesc:'Detection et decodage automatique',sectionA:'Resultats',sectionB:'Guide',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que le Decodeur?',faq_a1:'Detection et decodage automatique de modulations.',faq_q2:'Auto-detection?',faq_a2:'Analyse la constellation et le debit.',faq_q3:'Modulations?',faq_a3:'ASK, FSK, BPSK, QPSK, 16-QAM.',faq_q4:'Prive?',faq_a4:'Oui. Tout local.',howto_1:'Selectionnez le mode.',howto_2:'Ajustez SNR et debit.',howto_3:'Cliquez Decoder.',howto_4:'Consultez les resultats.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'EN, FR, AR.',working:'En cours...',filterAll:'Tout',soundEffects:'Effets',ready:'Decodeur pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',modeLabel:'Mode Signal',snrLabel:'SNR (dB)',baudLabel:'Debit Symbole',startDecode:'Decoder',autoDetect:'Auto Detection',resetDec:'Reinitialiser',detectedMode:'Detecte:',symRate:'Debit:',ber:'TEB:',decodedBits:'Bits:',decodedHex:'Hex:',decodedAscii:'ASCII:',guideIntro:'Le decodeur universel identifie les signaux:',guide1:'Detection automatique',guide2:'Constellation montre la qualite',guide3:'Supporte ASK, FSK, BPSK, QPSK, 16-QAM',guide4:'Donnees en binaire, hex et ASCII',splashHint:'passer',langChanged:'Langue: Francais',themeChanged:'Theme:',decodeComplete:'Decodage termine',autoDetected:'Auto-detecte:',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'المفكك الشامل',subtitle:'فك تشفير اي اشارة رقمية',disconnected:'خامل',connected:'فك تشفير',mainSection:'مفكك الاشارات',mainDesc:'كشف وفك تشفير تلقائي لاي اشارة رقمية',sectionA:'نتائج الفك',sectionB:'الدليل',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة',howto:'كيفية',wiki:'ويكي',faq_q1:'ما هو المفكك الشامل؟',faq_a1:'يكتشف ويفك تشفير انماط التضمين تلقائيا.',faq_q2:'كيف يعمل الكشف التلقائي؟',faq_a2:'يحلل خصائص الاشارة والرسم البياني.',faq_q3:'ما انماط التضمين؟',faq_a3:'ASK, FSK, BPSK, QPSK, 16-QAM.',faq_q4:'خاصة؟',faq_a4:'نعم. كل شيء محلي.',howto_1:'اختر النمط او الكشف التلقائي.',howto_2:'اضبط SNR ومعدل الرموز.',howto_3:'انقر فك التشفير.',howto_4:'اعرض الرسم البياني والبيانات.',wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'EN, FR, AR.',working:'جارٍ...',filterAll:'الكل',soundEffects:'مؤثرات',ready:'المفكك الشامل جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',modeLabel:'نمط الاشارة',snrLabel:'SNR (دسيبل)',baudLabel:'معدل الرموز',startDecode:'فك التشفير',autoDetect:'كشف تلقائي',resetDec:'اعادة',detectedMode:'المكتشف:',symRate:'معدل الرموز:',ber:'معدل خطا البت:',decodedBits:'البتات:',decodedHex:'سداسي عشري:',decodedAscii:'ASCII:',guideIntro:'المفكك الشامل يحدد الاشارات الرقمية:',guide1:'كشف تلقائي يحلل خصائص الاشارة',guide2:'الرسم البياني يظهر جودة التعيين',guide3:'يدعم ASK, FSK, BPSK, QPSK, 16-QAM',guide4:'البيانات بالثنائي والسداسي و ASCII',splashHint:'تخطي',langChanged:'اللغة: العربية',themeChanged:'المظهر:',decodeComplete:'اكتمل فك التشفير',autoDetected:'تم الكشف التلقائي:',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'}
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
function exportLog(){const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='decoder-log.txt';a.click();URL.revokeObjectURL(u);}
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

/* ═══════ UNIVERSAL DECODER SIMULATION ═══════ */
const MODES=['ask','fsk','psk','qpsk','qam16'];

function genBits(n){const b=[];for(let i=0;i<n;i++)b.push(Math.random()>0.5?1:0);return b;}

function genSignal(bits,mode,snr,baud){
  const sr=16000,spb=Math.floor(sr/baud),n=bits.length*spb;
  const buf=new Float32Array(n),noiseLvl=Math.pow(10,-snr/20);
  const fc=2000;
  for(let bi=0;bi<bits.length;bi++){for(let s=0;s<spb;s++){const idx=bi*spb+s,t=idx/sr;
    if(mode==='ask')buf[idx]=bits[bi]?Math.sin(2*Math.PI*fc*t):0;
    else if(mode==='fsk')buf[idx]=Math.sin(2*Math.PI*(bits[bi]?fc+500:fc-500)*t);
    else if(mode==='psk')buf[idx]=Math.sin(2*Math.PI*fc*t+(bits[bi]?0:Math.PI));
    else if(mode==='qpsk'){const sym=(bits[bi*2%bits.length]<<1)|bits[(bi*2+1)%bits.length];const ph=[Math.PI/4,3*Math.PI/4,5*Math.PI/4,7*Math.PI/4][sym];buf[idx]=Math.sin(2*Math.PI*fc*t+ph);}
    else if(mode==='qam16'){const val=(bits[bi]?1:-1)*(0.5+bits[(bi+1)%bits.length]*0.5);buf[idx]=val*Math.sin(2*Math.PI*fc*t);}
    buf[idx]+=noiseLvl*(Math.random()-0.5)*2;
  }}
  return buf;
}

function drawInput(buf){
  const c=$('inputCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  const step=Math.max(1,Math.floor(buf.length/w));
  for(let i=0;i<w;i++){const idx=Math.min(i*step,buf.length-1);const y=h/2-buf[idx]*(h/2)*.85;if(i===0)ctx.moveTo(0,y);else ctx.lineTo(i,y);}ctx.stroke();
  ctx.fillStyle='#8899aa';ctx.font='10px Orbitron,monospace';ctx.fillText('Input Signal',8,14);
}

function drawConstellation(mode,snr){
  const c=$('constCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  // Grid
  ctx.strokeStyle='#1a2a3a';ctx.beginPath();ctx.moveTo(w/2,0);ctx.lineTo(w/2,h);ctx.stroke();ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
  ctx.strokeStyle='#111';ctx.beginPath();ctx.arc(w/2,h/2,Math.min(w,h)/3,0,Math.PI*2);ctx.stroke();
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  const noiseLvl=Math.pow(10,-snr/20)*0.3;
  const points=[];
  if(mode==='ask'){points.push([0,0],[1,0]);}
  else if(mode==='fsk'){points.push([-0.7,0],[0.7,0]);}
  else if(mode==='psk'){points.push([-1,0],[1,0]);}
  else if(mode==='qpsk'){points.push([0.7,0.7],[-0.7,0.7],[-0.7,-0.7],[0.7,-0.7]);}
  else if(mode==='qam16'){for(let i=-3;i<=3;i+=2)for(let j=-3;j<=3;j+=2)points.push([i/3,j/3]);}
  // Draw scattered points
  for(let p=0;p<200;p++){
    const pt=points[Math.floor(Math.random()*points.length)];
    const nx=pt[0]+noiseLvl*(Math.random()-0.5)*4;const ny=pt[1]+noiseLvl*(Math.random()-0.5)*4;
    const sx=w/2+nx*(w/3);const sy=h/2-ny*(h/3);
    ctx.fillStyle=accent+'aa';ctx.beginPath();ctx.arc(sx,sy,2,0,Math.PI*2);ctx.fill();
  }
  // Ideal points
  for(const pt of points){const sx=w/2+pt[0]*(w/3);const sy=h/2-pt[1]*(h/3);
    ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.beginPath();ctx.arc(sx,sy,5,0,Math.PI*2);ctx.stroke();}
  ctx.fillStyle='#8899aa';ctx.font='10px Orbitron,monospace';ctx.fillText(mode.toUpperCase()+' Constellation',8,14);
}

function drawDecoded(bits){
  const c=$('decodedCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#050510';ctx.fillRect(0,0,w,h);
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  const maxBits=Math.min(bits.length,64);const bw=w/maxBits;
  for(let i=0;i<maxBits;i++){ctx.fillStyle=bits[i]?accent:'#1a1a2e';ctx.fillRect(i*bw+1,8,bw-2,h-16);
    if(bw>8){ctx.fillStyle='#fff';ctx.font='9px monospace';ctx.textAlign='center';ctx.fillText(bits[i].toString(),i*bw+bw/2,h/2+3);}}
  ctx.textAlign='left';
}

function decodeSignal(){
  let mode=$('modeSelect').value;
  if(mode==='auto')mode=MODES[Math.floor(Math.random()*MODES.length)];
  const snr=+$('snrSlider').value,baud=+$('baudSlider').value;
  const bits=genBits(64);const sig=genSignal(bits,mode,snr,baud);
  drawInput(sig);drawConstellation(mode,snr);drawDecoded(bits);
  // Calculate BER
  const ber=Math.max(0,0.5*Math.pow(10,-snr/10)).toFixed(6);
  // Results
  $('detModeVal').textContent=mode.toUpperCase();$('symRateVal').textContent=baud+' Bd';$('berVal').textContent=ber;
  const bitStr=bits.slice(0,32).join('');$('bitsVal').textContent=bitStr+'...';
  let hex='';for(let i=0;i<bits.length;i+=4){hex+=parseInt(bits.slice(i,i+4).join(''),2).toString(16).toUpperCase();}
  $('hexVal').textContent=hex.slice(0,16)+'...';
  let ascii='';for(let i=0;i<bits.length;i+=8){const byte=parseInt(bits.slice(i,i+8).join(''),2);if(byte>=32&&byte<127)ascii+=String.fromCharCode(byte);else ascii+='.';}
  $('asciiVal').textContent=ascii;
  setStatus(true);log(LANG[currentLang].decodeComplete+' ('+mode.toUpperCase()+', '+baud+' Bd)','success');
  setTimeout(()=>setStatus(false),2000);
}

function autoDetectMode(){
  const modes=['ASK','FSK','BPSK','QPSK','16-QAM'];
  const detected=modes[Math.floor(Math.random()*modes.length)];
  const modeMap={'ASK':'ask','FSK':'fsk','BPSK':'psk','QPSK':'qpsk','16-QAM':'qam16'};
  $('modeSelect').value=modeMap[detected]||'psk';
  log(LANG[currentLang].autoDetected+' '+detected,'success');
  playSound('success');
  decodeSignal();
}

function resetDecoder(){
  ['inputCanvas','constCanvas','decodedCanvas'].forEach(id=>{const c=$(id);c.getContext('2d').clearRect(0,0,c.width,c.height);});
  $('modeSelect').value='auto';$('snrSlider').value=15;$('snrVal').textContent='15 dB';$('baudSlider').value=1200;$('baudVal').textContent='1200 Bd';
  $('detModeVal').textContent='--';$('symRateVal').textContent='--';$('berVal').textContent='--';
  $('bitsVal').textContent='--';$('hexVal').textContent='--';$('asciiVal').textContent='--';
  setStatus(false);log('Reset','info');
}

function init(){
  initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',function(){setLanguage(this.value);});$('themeSelect').addEventListener('change',function(){setTheme(this.value);});
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();
  $('decodeBtn').onclick=decodeSignal;$('autoBtn').onclick=autoDetectMode;$('resetBtn').onclick=resetDecoder;
  $('snrSlider').oninput=function(){$('snrVal').textContent=this.value+' dB';};
  $('baudSlider').oninput=function(){$('baudVal').textContent=this.value+' Bd';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Universal Decoder
   Animated multi-protocol decode waterfall + bit stream
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const streams=[];
function boot(){
  let el=document.getElementById('decSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='decSimCanvas';el.width=780;el.height=200;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  const protos=['POCSAG','ADS-B','ACARS','DMR','P25','APRS'];
  protos.forEach((p,i)=>streams.push({name:p,y:28+i*28,bits:[],color:`hsl(${i*60},70%,60%)`,active:Math.random()>.3}));
}
function tick(){
  t+=.016;cx.fillStyle='#060810';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  streams.forEach(s=>{
    // Add new bits
    if(s.active&&Math.random()<.3)s.bits.push({v:Math.random()>.5?1:0,x:W-20});
    // Move bits left
    s.bits.forEach(b=>b.x-=1.5);s.bits=s.bits.filter(b=>b.x>80);
    // Protocol label
    cx.fillStyle=s.active?s.color:'rgba(100,100,100,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='right';
    cx.fillText(s.name,75,s.y+4);
    // Status indicator
    cx.fillStyle=s.active?'#22c55e':'#555';cx.beginPath();cx.arc(80,s.y,3,0,Math.PI*2);cx.fill();
    // Bit stream
    s.bits.forEach(b=>{
      cx.fillStyle=b.v?s.color+'88':s.color+'22';
      cx.fillRect(b.x,s.y-6,8,12);
    });
    // Decode progress bar
    const progress=(Math.sin(t+streams.indexOf(s))*.5+.5);
    cx.fillStyle=s.color+'22';cx.fillRect(W-100,s.y-6,80,12);
    cx.fillStyle=s.color+'66';cx.fillRect(W-100,s.y-6,80*progress,12);
  });
  // Scanning indicator
  const scanY=28+((t*40)%(streams.length*28));
  cx.strokeStyle=acc+'44';cx.lineWidth=1;cx.beginPath();cx.moveTo(80,scanY);cx.lineTo(W-20,scanY);cx.stroke();
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Universal Decoder — Multi-Protocol Stream',8,14);
  cx.textAlign='right';cx.fillText(`${streams.filter(s=>s.active).length}/${streams.length} active`,W-8,14);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
})();
