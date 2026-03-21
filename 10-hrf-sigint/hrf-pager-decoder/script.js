/**
 * Pager Decoder — POCSAG Monitor — Workshop DIY
 * Simulated POCSAG pager message decoding with feed, frequency selector, stats
 * Themes . i18n . RTL . Log . Toast . Status . Panels . Sound
 */

const $ = id => document.getElementById(id);

/* ======= LOGO SVG ======= */
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.2';

/* ======= SOUND ======= */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click': osc.frequency.value = 800; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); break;
    case 'success': osc.frequency.value = 523; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); break;
    case 'error': osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); break;
  }
}

/* ======= i18n ======= */
const LANG = {
  en: {
    title: 'Pager Decoder', subtitle: '📟 Decode pager messages in real time',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Pager Decoder — POCSAG Monitor', mainDesc: 'Decode unencrypted pager messages in real time',
    sectionA: 'Frequency Settings', sectionB: 'Statistics', sectionC: 'POCSAG Explained',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    theme: 'Theme', settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    faq_q1: 'What is POCSAG?', faq_a1: 'A paging protocol for one-way text/numeric messages, transmitted unencrypted on radio frequencies.',
    faq_q2: 'Do I need hardware?', faq_a2: 'No, this is a simulator. Real decoding uses an RTL-SDR dongle and multimon-ng.',
    faq_q3: 'What is a RIC address?', faq_a3: 'Radio Identity Code — a unique 7-digit number assigned to each pager device.',
    faq_q4: 'Is my data private?', faq_a4: 'Yes. Everything runs locally in your browser.',
    howto_1: 'Click "Start Decoder" to begin simulated POCSAG reception.',
    howto_2: 'Watch decoded messages appear in the feed with timestamps.',
    howto_3: 'Filter by pager address to isolate specific devices.',
    howto_4: 'Switch frequencies to monitor different pager channels.',
    wiki_pocsag_title: '📟 POCSAG', wiki_pocsag: 'Post Office Code Standardisation Advisory Group protocol, 512/1200/2400 baud.',
    wiki_privacy_title: '🔒 Privacy', wiki_privacy: 'All data stays in your browser.',
    working: 'Working...',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '📟 Pager Decoder ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    soundEffects: '🔊 Sound effects',
    whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap',
    musicMode: 'Music reactive', splashHint: 'tap to skip',
    langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    startScan: 'Start Decoder', stopScan: 'Stop',
    messagesDecoded: 'messages', filterAddr: 'Filter address:',
    freqHint: 'Common POCSAG pager frequencies (MHz)',
    statTotalLabel: 'Total Messages', statNumericLabel: 'Numeric',
    statAlphaLabel: 'Alphanumeric', statAddrsLabel: 'Unique Addresses',
    pocsagInfo: 'POCSAG (Post Office Code Standardisation Advisory Group) is a paging protocol used worldwide. Messages are transmitted unencrypted at 512, 1200, or 2400 baud on VHF/UHF frequencies. Each pager has a unique address (RIC). Messages can be numeric-only or alphanumeric. With an RTL-SDR and software like multimon-ng, anyone can decode these signals.',
    decoderStarted: '📡 POCSAG decoder started on', decoderStopped: '🔴 Decoder stopped',
    newMessage: 'MSG', freqChanged: '📻 Frequency →',
  },
  fr: {
    title: 'Decodeur Pager', subtitle: '📟 Decodez les messages pager en temps reel',
    disconnected: 'Deconnecte', connected: 'Connecte',
    mainSection: 'Decodeur Pager — Moniteur POCSAG', mainDesc: 'Decodez les messages pager non chiffres en temps reel',
    sectionA: 'Parametres frequence', sectionB: 'Statistiques', sectionC: 'POCSAG explique',
    activityLog: 'Journal', eventsMsg: 'Evenements et messages',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    theme: 'Theme', settings: '⚙️ Parametres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    faq_q1: 'Qu\'est-ce que POCSAG ?', faq_a1: 'Un protocole de radiomessagerie pour messages texte/numeriques, transmis non chiffres.',
    faq_q2: 'Ai-je besoin de materiel ?', faq_a2: 'Non, c\'est un simulateur. Le vrai decodage utilise un dongle RTL-SDR.',
    faq_q3: 'Qu\'est-ce qu\'une adresse RIC ?', faq_a3: 'Radio Identity Code — un numero unique a 7 chiffres pour chaque pager.',
    faq_q4: 'Mes donnees sont privees ?', faq_a4: 'Oui. Tout fonctionne localement.',
    howto_1: 'Cliquez "Demarrer" pour lancer la reception POCSAG simulee.',
    howto_2: 'Observez les messages decodes apparaitre dans le flux.',
    howto_3: 'Filtrez par adresse pour isoler un pager specifique.',
    howto_4: 'Changez de frequence pour surveiller d\'autres canaux.',
    wiki_pocsag_title: '📟 POCSAG', wiki_pocsag: 'Protocole de radiomessagerie, 512/1200/2400 baud.',
    wiki_privacy_title: '🔒 Confidentialite', wiki_privacy: 'Tout reste dans votre navigateur.',
    working: 'En cours...',
    t_mosque: 'Mosquee', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '📟 Decodeur Pager pret !',
    logCleared: 'Journal efface', copied: 'Copie !', copyFail: 'Echec',
    soundEffects: '🔊 Effets sonores',
    whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap',
    musicMode: 'Reactif musique', splashHint: 'appuyer pour passer',
    langChanged: '🌐 Langue → Francais', themeChanged: '🎨 Theme →',
    startScan: 'Demarrer', stopScan: 'Arreter',
    messagesDecoded: 'messages', filterAddr: 'Filtrer adresse :',
    freqHint: 'Frequences pager POCSAG courantes (MHz)',
    statTotalLabel: 'Total messages', statNumericLabel: 'Numerique',
    statAlphaLabel: 'Alphanumerique', statAddrsLabel: 'Adresses uniques',
    pocsagInfo: 'POCSAG est un protocole de radiomessagerie mondial. Les messages sont transmis non chiffres a 512, 1200 ou 2400 baud sur VHF/UHF.',
    decoderStarted: '📡 Decodeur POCSAG demarre sur', decoderStopped: '🔴 Decodeur arrete',
    newMessage: 'MSG', freqChanged: '📻 Frequence →',
  },
  ar: {
    title: 'فك تشفير البيجر', subtitle: '📟 فك تشفير رسائل البيجر في الوقت الحقيقي',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'فك تشفير البيجر — مراقب POCSAG', mainDesc: 'فك تشفير رسائل البيجر غير المشفرة',
    sectionA: 'اعدادات التردد', sectionB: 'احصائيات', sectionC: 'شرح POCSAG',
    activityLog: 'سجل النشاط', eventsMsg: 'الاحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', filterAll: 'الكل',
    theme: 'المظهر', settings: '⚙️ الاعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'اسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    faq_q1: 'ما هو POCSAG؟', faq_a1: 'بروتوكول استدعاء لرسائل نصية/رقمية احادية الاتجاه، تُبث بدون تشفير.',
    faq_q2: 'هل احتاج اجهزة؟', faq_a2: 'لا، هذا محاكي. الفك الحقيقي يستخدم RTL-SDR.',
    faq_q3: 'ما هو عنوان RIC؟', faq_a3: 'رمز هوية الراديو — رقم فريد من 7 ارقام لكل جهاز بيجر.',
    faq_q4: 'هل بياناتي خاصة؟', faq_a4: 'نعم. كل شيء يعمل محليًا في متصفحك.',
    howto_1: 'اضغط "بدء فك التشفير" لتشغيل محاكاة POCSAG.',
    howto_2: 'شاهد الرسائل المفككة تظهر في التغذية.',
    howto_3: 'فلتر حسب العنوان لعزل اجهزة معينة.',
    howto_4: 'غير التردد لمراقبة قنوات مختلفة.',
    wiki_pocsag_title: '📟 POCSAG', wiki_pocsag: 'بروتوكول استدعاء 512/1200/2400 بود.',
    wiki_privacy_title: '🔒 الخصوصية', wiki_privacy: 'كل البيانات تبقى في متصفحك.',
    working: 'جارٍ...',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'اندلس',
    t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'ادغال', t_robot: 'روبوت',
    ready: '📟 فك تشفير البيجر جاهز!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    soundEffects: '🔊 مؤثرات صوتية',
    whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط',
    musicMode: 'تفاعل موسيقي', splashHint: 'انقر للتخطي',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    startScan: 'بدء فك التشفير', stopScan: 'ايقاف',
    messagesDecoded: 'رسالة', filterAddr: 'فلتر العنوان:',
    freqHint: 'ترددات بيجر POCSAG الشائعة (ميغاهرتز)',
    statTotalLabel: 'اجمالي الرسائل', statNumericLabel: 'رقمية',
    statAlphaLabel: 'ابجدية رقمية', statAddrsLabel: 'عناوين فريدة',
    pocsagInfo: 'POCSAG بروتوكول استدعاء عالمي. الرسائل تبث بدون تشفير على ترددات VHF/UHF.',
    decoderStarted: '📡 بدا فك تشفير POCSAG على', decoderStopped: '🔴 توقف فك التشفير',
    newMessage: 'رسالة', freqChanged: '📻 التردد →',
  }
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



let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => { const k = opt.dataset.i18nOpt; if (s[k] != null) opt.textContent = s[k]; });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ======= THEMES ======= */
const THEME_MELODIES = {
  'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],
  'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],
  'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]
};

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  const s = LANG[currentLang]; const label = s['t_' + name] || name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(`${s.themeChanged} ${label}`, 'info');
}

function playThemeMelody(name) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[name]; if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => {
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0.06;
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15);
    o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2);
  });
}

/* ======= LOG ======= */
let logContainer;
let typewriterEnabled = true;
const logHistory = [];

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  const fullText = `[${new Date().toLocaleTimeString()}] ${msg}`;
  if (typewriterEnabled) { logContainer.appendChild(d); typewriterAppend(d, fullText); }
  else { d.textContent = fullText; logContainer.appendChild(d); }
  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') playSound('success');
  else if (type === 'error') playSound('error');
  logHistory.push({ msg, type, ts: Date.now() });
  applyLogFilter();
}

async function typewriterAppend(el, text) {
  el.classList.add('typing'); el.textContent = '';
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    if (el.parentElement) el.parentElement.scrollTop = el.parentElement.scrollHeight;
    await sleep(8 + Math.random() * 12);
  }
  el.classList.remove('typing');
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); }
}
function exportLog() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const text = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  const blob = new Blob([text], { type: 'text/plain' }); const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `pager-decoder-log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); URL.revokeObjectURL(url);
}

/* ======= LOG FILTERS ======= */
let activeLogFilter = 'all';
function initLogFilters() {
  document.querySelectorAll('.log-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); playSound('click');
    });
  });
}
function applyLogFilter() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  Array.from(logContainer.children).forEach(line => {
    if (activeLogFilter === 'all') { line.style.display = ''; return; }
    line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none';
  });
}

/* ======= TOAST ======= */
let toastTimer = null;
function showToast(msg, autoHideMs = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; }
  if (toastTimer) clearTimeout(toastTimer);
  if (autoHideMs > 0) toastTimer = setTimeout(hideToast, autoHideMs);
}
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; } }

/* ======= STATUS ======= */
function setStatus(connected) {
  const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang];
  if (txt) txt.textContent = connected ? s.connected : s.disconnected;
  if (pill) pill.classList.toggle('connected', connected);
}

/* ======= SPLASH ======= */
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

/* ======= PANELS ======= */
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
function openPanel(pid, oid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(pid, oid, rid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.remove('open'); if (ov) ov.classList.remove('open'); const btn = $(rid); if (btn) btn.focus(); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const sb = $('logPanel'); if (sb) sb.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const sb = $('logPanel'); if (sb) sb.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const sb = $('logPanel'); if (sb && sb.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }

function initHelpTabs() {
  document.querySelectorAll('.help-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const n = tab.dataset.tab, tid = 'help' + n.charAt(0).toUpperCase() + n.slice(1);
      const target = $(tid); if (target) target.classList.add('active');
    });
  });
}

function initLogResize() {
  const handle = $('logResizeHandle'), panel = $('logPanel');
  if (!handle || !panel) return;
  let dragging = false, startX, startW;
  const isRtl = () => document.documentElement.dir === 'rtl';
  handle.addEventListener('mousedown', e => { dragging = true; startX = e.clientX; startW = panel.offsetWidth; e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (!dragging) return; const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6)) + 'px'); });
  document.addEventListener('mouseup', () => { if (!dragging) return; dragging = false; });
}

/* ======= HIJRI DATE ======= */
function initHijriDate() {
  const el = $('hijriDate'); if (!el) return;
  try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day:'numeric', month:'long', year:'numeric' }).format(new Date()); } catch {}
}

/* ======= WHISPER / BREATHING / MUSIC (stubs) ======= */
let whisperActive = false;
function toggleWhisper() { whisperActive = !whisperActive; log(whisperActive ? '🎤 Whisper mode on' : '🎤 Whisper mode off', 'info'); }
let breathingActive = false;
function toggleBreathing() {
  breathingActive = !breathingActive;
  document.querySelectorAll('.deco-band').forEach(b => b.classList.toggle('breathing', breathingActive));
  log(breathingActive ? '🫁 Breathing guide on' : '🫁 Breathing guide off', 'info');
}
let dhikrCount = 0;
function incrementDhikr() { if (!breathingActive) return; dhikrCount++; const c = $('dhikrCounter'); if (c) c.textContent = dhikrCount; playSound('click'); }
function toggleMusicMode() { log('🎵 Music mode toggled', 'info'); }

/* ======= MATRIX RAIN ======= */
let matrixRunning = false, matrixAnim = null;
const ARABIC_CHARS = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix() {
  const canvas = $('matrixCanvas'); if (!canvas) return;
  if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); canvas.classList.remove('active'); return; }
  matrixRunning = true; canvas.classList.add('active');
  const ctx = canvas.getContext('2d'); canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 16), drops = Array(cols).fill(1);
  function draw() { if (!matrixRunning) return; ctx.fillStyle='rgba(0,0,0,0.05)'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33'; ctx.font='14px Amiri,serif'; for(let i=0;i<drops.length;i++){const ch=ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)]; ctx.fillText(ch,i*16,drops[i]*16); if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0; drops[i]++;} matrixAnim=requestAnimationFrame(draw); }
  draw();
}
let logoClickCount = 0, logoClickTimer = null;
function initMatrixTrigger() {
  const logo = $('logoWrap'); if (!logo) return; logo.style.cursor = 'pointer';
  logo.addEventListener('click', () => { logoClickCount++; if (logoClickTimer) clearTimeout(logoClickTimer); if (logoClickCount >= 3) { logoClickCount = 0; toggleMatrix(); } else { logoClickTimer = setTimeout(() => logoClickCount = 0, 500); } });
}

/* ======= KONAMI CODE ======= */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
function initKonami() {
  document.addEventListener('keydown', e => { if (e.key === KONAMI[konamiIdx]) { konamiIdx++; if (konamiIdx === KONAMI.length) { konamiIdx = 0; setTheme('retro'); log('🕹️ KONAMI CODE — RETRO!', 'success'); } } else konamiIdx = 0; });
}

/* =======================================================================
   PAGER DECODER — POCSAG SIMULATION ENGINE
   ======================================================================= */

const ALPHA_MESSAGES = [
  'CALL DR SMITH EXT 4521',
  'PATIENT ROOM 302 NEEDS ATTENTION',
  'FIRE ALARM ZONE 7 ACTIVATED',
  'MEET AT LOADING DOCK B 1500H',
  'CODE BLUE ICU BED 12',
  'MAINTENANCE REQ ELEVATOR 3',
  'DELIVERY TRUCK AT GATE 2',
  'SHIFT CHANGE REPORT DUE',
  'SECURITY SWEEP FLOOR 5 COMPLETE',
  'LAB RESULTS READY FOR PICKUP',
  'PARKING LOT C FULL',
  'HVAC UNIT 7 OFFLINE',
  'VISITOR AT RECEPTION FOR DR JONES',
  'PHARMACY ORDER 88721 READY',
  'AMBULANCE ETA 12 MIN BAY 3',
  'CAFETERIA CLOSING IN 30 MIN',
  'SERVER ROOM TEMP ALERT 28C',
  'WATER LEAK DETECTED BASEMENT',
  'STAFF MEETING RM 401 1400H',
  'RADIOLOGY REPORT URGENT',
];

const NUMERIC_MESSAGES = [
  '5551234567', '9118004321', '411*2*88', '143*7*55',
  '800-555-0123', '911', '0800123456', '555-0199',
  '2125551234', '3015550987', '123456789', '0612345678',
];

const PAGER_ADDRS = [
  '1234567','2345678','3456789','4567890','5678901',
  '6789012','7890123','8901234','9012345','0123456',
  '1111111','2222222','3333333','4444444','5555555',
];

const BAUD_RATES = [512, 1200, 2400];

let simRunning = false;
let simInterval = null;
let currentFreq = '152.0250';
let totalMessages = 0;
let numericCount = 0;
let alphaCount = 0;
let uniqueAddrs = new Set();
let messages = [];

function genMessage() {
  const isAlpha = Math.random() > 0.35;
  const addr = PAGER_ADDRS[Math.floor(Math.random() * PAGER_ADDRS.length)];
  const func = Math.floor(Math.random() * 4);
  const baud = BAUD_RATES[Math.floor(Math.random() * BAUD_RATES.length)];
  let text;
  if (isAlpha) {
    text = ALPHA_MESSAGES[Math.floor(Math.random() * ALPHA_MESSAGES.length)];
  } else {
    text = NUMERIC_MESSAGES[Math.floor(Math.random() * NUMERIC_MESSAGES.length)];
  }
  return {
    timestamp: new Date().toLocaleTimeString(),
    addr,
    func,
    baud,
    type: isAlpha ? 'ALPHA' : 'NUM',
    text,
    freq: currentFreq
  };
}

function addMessageToFeed(msg) {
  const feed = $('messageFeed');
  if (!feed) return;

  const filterVal = ($('addrFilter') || {}).value || '';
  if (filterVal && !msg.addr.includes(filterVal)) return;

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  const typeColor = msg.type === 'ALPHA' ? '#4fc3f7' : '#81c784';

  const div = document.createElement('div');
  div.style.cssText = 'padding:6px 8px;border-bottom:1px solid rgba(255,255,255,0.05);animation:fadeIn .3s;';
  div.innerHTML = `
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
      <span style="color:${accent};font-size:.65rem;">${msg.timestamp}</span>
      <span style="background:rgba(255,255,255,0.08);padding:1px 6px;border-radius:3px;font-size:.65rem;">${msg.baud} baud</span>
      <span style="color:${typeColor};font-weight:bold;font-size:.7rem;">[${msg.type}]</span>
      <span style="opacity:.5;font-size:.65rem;">ADDR:</span>
      <span style="color:${accent};font-size:.7rem;">${msg.addr}</span>
      <span style="opacity:.5;font-size:.65rem;">FN:${msg.func}</span>
    </div>
    <div style="margin-top:3px;padding-inline-start:8px;color:rgba(255,255,255,0.85);font-size:.75rem;word-break:break-all;">${msg.text}</div>
  `;
  feed.insertBefore(div, feed.firstChild);

  // Limit feed to 100 messages
  while (feed.children.length > 100) feed.removeChild(feed.lastChild);
}

function updateStats() {
  const el1 = $('statTotal'); if (el1) el1.textContent = totalMessages;
  const el2 = $('statNumeric'); if (el2) el2.textContent = numericCount;
  const el3 = $('statAlpha'); if (el3) el3.textContent = alphaCount;
  const el4 = $('statAddrs'); if (el4) el4.textContent = uniqueAddrs.size;
  const mc = $('msgCount');
  if (mc) mc.innerHTML = `${totalMessages} <span data-i18n="messagesDecoded">${LANG[currentLang].messagesDecoded}</span>`;
}

function simTick() {
  // 1-3 messages per tick
  const count = 1 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const msg = genMessage();
    messages.push(msg);
    totalMessages++;
    if (msg.type === 'NUM') numericCount++;
    else alphaCount++;
    uniqueAddrs.add(msg.addr);
    addMessageToFeed(msg);
    log(`${LANG[currentLang].newMessage} [${msg.type}] ${msg.addr} FN:${msg.func} — ${msg.text.substring(0, 30)}${msg.text.length > 30 ? '...' : ''}`, 'rx');
  }
  updateStats();
}

function startSim() {
  if (simRunning) return;
  simRunning = true;
  setStatus(true);
  log(`${LANG[currentLang].decoderStarted} ${currentFreq} MHz`, 'success');
  simInterval = setInterval(simTick, 1500 + Math.random() * 2000);
  simTick();
}

function stopSim() {
  if (!simRunning) return;
  simRunning = false;
  setStatus(false);
  if (simInterval) { clearInterval(simInterval); simInterval = null; }
  log(LANG[currentLang].decoderStopped, 'info');
}

function setFrequency(freq) {
  currentFreq = freq;
  const fd = $('freqDisplay');
  if (fd) fd.textContent = freq + ' MHz';
  document.querySelectorAll('.freq-btn').forEach(b => {
    b.classList.toggle('primary', b.dataset.freq === freq);
  });
  log(`${LANG[currentLang].freqChanged} ${freq} MHz`, 'info');
  playSound('click');
}

function initFreqButtons() {
  document.querySelectorAll('.freq-btn').forEach(btn => {
    btn.addEventListener('click', () => setFrequency(btn.dataset.freq));
  });
}

/* ======= INIT ======= */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;

  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();

  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp; if (hClose) hClose.onclick = closeHelp; if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();
  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings; if (sClose) sClose.onclick = closeSettings; if (sOv) sOv.onclick = closeSettings;
  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog; if (lClose) lClose.onclick = closeLog;
  initLogResize();

  const soundTgl = $('soundToggle');
  if (soundTgl) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} soundTgl.checked = soundEnabled; soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }); }

  const whisperBtn = $('whisperBtn'); if (whisperBtn) whisperBtn.onclick = toggleWhisper;
  const breathBtn = $('breathingBtn'), dhikrDisp = $('dhikrDisplay'), dhikrBtn = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => { toggleBreathing(); if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none'; };
  if (dhikrBtn) dhikrBtn.onclick = incrementDhikr;
  const musicBtn = $('musicBtn'); if (musicBtn) musicBtn.onclick = toggleMusicMode;

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); });

  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));
  try { const sL = localStorage.getItem('wdiy-lang'), sT = localStorage.getItem('wdiy-theme'); if (sT) setTheme(sT); if (sL) setLanguage(sL); } catch {}

  initKonami();
  initMatrixTrigger();
  initHijriDate();

  // App-specific
  const startBtn = $('startBtn'), stopBtn = $('stopBtn');
  if (startBtn) startBtn.onclick = startSim;
  if (stopBtn) stopBtn.onclick = stopSim;
  initFreqButtons();

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
