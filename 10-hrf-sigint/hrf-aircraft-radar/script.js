/**
 * Aircraft Radar — ADS-B Receiver — Workshop DIY
 * Simulated ADS-B aircraft tracking with sky map, altitude chart, flight table
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Sound
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;

const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABhSURBVDhPY2AYBaNhMBoGDAwMDP8ZGP4zMDD8h2IYGQM1M0Ixwy+oGAYGa2ZCMVTDK6gYE0JNLxMUwzTAMUwDHMM0wDFMAxzDNMAxTAMcwzTAMUwDHMM0UOswGA0DRgYGABIGGq0+CXOkAAAAAElFTkSuQmCC';

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
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

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title: 'Aircraft Radar', subtitle: '✈️ Plot every aircraft overhead with altitude, speed, callsign',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Aircraft Radar — ADS-B Receiver', mainDesc: 'Plot every aircraft overhead with altitude, speed, callsign',
    sectionA: 'Altitude Chart', sectionB: 'Aircraft Table', sectionC: 'ADS-B Explained',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    theme: 'Theme', settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    faq_q1: 'What is this app?', faq_a1: 'An ADS-B aircraft radar simulator. It shows how SDR receivers decode aircraft transponder broadcasts to plot flights on a map in real time.',
    faq_q2: 'Do I need real hardware?', faq_a2: 'No. This app simulates ADS-B reception with realistic aircraft data. In real life you would use an RTL-SDR dongle tuned to 1090 MHz.',
    faq_q3: 'What is a squawk code?', faq_a3: 'A 4-digit octal code assigned by ATC. Special codes: 7500 (hijack), 7600 (radio failure), 7700 (emergency).',
    faq_q4: 'Is my data private?', faq_a4: 'Yes. Everything runs locally in your browser. No data is sent anywhere.',
    howto_1: 'Click "Start Receiver" to begin simulated ADS-B reception.',
    howto_2: 'Watch aircraft appear on the sky map with callsign labels.',
    howto_3: 'Click an aircraft icon to see detailed flight information.',
    howto_4: 'Check the altitude chart and aircraft table for all tracked flights.',
    wiki_adsb_title: '📡 ADS-B', wiki_adsb: 'Automatic Dependent Surveillance-Broadcast on 1090 MHz.',
    wiki_squawk_title: '🔢 Squawk Codes', wiki_squawk: '4-digit transponder codes. 7500=hijack, 7600=radio fail, 7700=emergency.',
    wiki_privacy_title: '🔒 Privacy', wiki_privacy: 'Local-first, privacy-first. All data stays in your browser.',
    working: 'Working…',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '✈️ Aircraft Radar ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    soundEffects: '🔊 Sound effects',
    whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap',
    musicMode: 'Music reactive', splashHint: 'tap to skip',
    langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    startScan: 'Start Receiver', stopScan: 'Stop',
    aircraftTracked: 'aircraft tracked',
    callsignLabel: 'Callsign:', altitudeLabel: 'Altitude:', speedLabel: 'Speed:',
    headingLabel: 'Heading:', squawkLabel: 'Squawk:', typeLabel: 'Type:',
    thCallsign: 'Callsign', thAlt: 'Alt (ft)', thSpeed: 'Speed (kt)', thHeading: 'Hdg', thSquawk: 'Squawk', thType: 'Type',
    adsbInfo: 'ADS-B (Automatic Dependent Surveillance-Broadcast) is a surveillance technology where aircraft broadcast their GPS position, altitude, speed, and identification. Operating on 1090 MHz, these unencrypted signals can be received with an RTL-SDR dongle and a simple antenna. This app simulates the decoded output of an ADS-B receiver.',
    receiverStarted: '📡 ADS-B receiver started on 1090 MHz', receiverStopped: '🔴 Receiver stopped',
    newAircraft: 'New aircraft detected:', aircraftLost: 'Aircraft lost:',
  },
  fr: {
    title: 'Radar Aérien', subtitle: '✈️ Tracez chaque avion avec altitude, vitesse, indicatif',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'Radar Aérien — Récepteur ADS-B', mainDesc: 'Tracez chaque avion avec altitude, vitesse, indicatif',
    sectionA: 'Graphique d\'altitude', sectionB: 'Table des avions', sectionC: 'ADS-B expliqué',
    activityLog: 'Journal', eventsMsg: 'Événements et messages',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    theme: 'Thème', settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    faq_q1: 'Qu\'est-ce que cette appli ?', faq_a1: 'Un simulateur de radar ADS-B. Il montre comment les récepteurs SDR décodent les transpondeurs d\'avions pour tracer les vols sur une carte.',
    faq_q2: 'Ai-je besoin de matériel ?', faq_a2: 'Non. L\'appli simule la réception ADS-B. En vrai, il faut un dongle RTL-SDR sur 1090 MHz.',
    faq_q3: 'Qu\'est-ce qu\'un code squawk ?', faq_a3: 'Un code octal à 4 chiffres assigné par le contrôle aérien. Codes spéciaux : 7500, 7600, 7700.',
    faq_q4: 'Mes données sont privées ?', faq_a4: 'Oui. Tout fonctionne localement dans votre navigateur.',
    howto_1: 'Cliquez "Démarrer" pour lancer la réception ADS-B simulée.',
    howto_2: 'Observez les avions apparaître sur la carte.',
    howto_3: 'Cliquez un avion pour voir ses informations de vol.',
    howto_4: 'Consultez le graphique d\'altitude et la table des avions.',
    wiki_adsb_title: '📡 ADS-B', wiki_adsb: 'Surveillance automatique dépendante par diffusion sur 1090 MHz.',
    wiki_squawk_title: '🔢 Codes Squawk', wiki_squawk: 'Codes transpondeur à 4 chiffres.',
    wiki_privacy_title: '🔒 Confidentialité', wiki_privacy: 'Tout reste dans votre navigateur.',
    working: 'En cours…',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_riad: 'Riad', t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '✈️ Radar aérien prêt !',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    soundEffects: '🔊 Effets sonores',
    whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap',
    musicMode: 'Réactif musique', splashHint: 'appuyer pour passer',
    langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    startScan: 'Démarrer', stopScan: 'Arrêter',
    aircraftTracked: 'avions suivis',
    callsignLabel: 'Indicatif :', altitudeLabel: 'Altitude :', speedLabel: 'Vitesse :',
    headingLabel: 'Cap :', squawkLabel: 'Squawk :', typeLabel: 'Type :',
    thCallsign: 'Indicatif', thAlt: 'Alt (ft)', thSpeed: 'Vit (kt)', thHeading: 'Cap', thSquawk: 'Squawk', thType: 'Type',
    adsbInfo: 'L\'ADS-B est une technologie de surveillance où les avions diffusent leur position GPS, altitude, vitesse et identification sur 1090 MHz.',
    receiverStarted: '📡 Récepteur ADS-B démarré sur 1090 MHz', receiverStopped: '🔴 Récepteur arrêté',
    newAircraft: 'Nouvel avion détecté :', aircraftLost: 'Avion perdu :',
  },
  ar: {
    title: 'رادار الطائرات', subtitle: '✈️ تتبع كل طائرة بالارتفاع والسرعة والإشارة',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'رادار الطائرات — مستقبل ADS-B', mainDesc: 'تتبع كل طائرة بالارتفاع والسرعة والإشارة',
    sectionA: 'مخطط الارتفاع', sectionB: 'جدول الطائرات', sectionC: 'شرح ADS-B',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', filterAll: 'الكل',
    theme: 'المظهر', settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    faq_q1: 'ما هذا التطبيق؟', faq_a1: 'محاكي رادار ADS-B. يوضح كيف تفك أجهزة SDR إشارات الطائرات لرسمها على خريطة.',
    faq_q2: 'هل أحتاج أجهزة حقيقية؟', faq_a2: 'لا. التطبيق يحاكي استقبال ADS-B. في الواقع تحتاج RTL-SDR على 1090 ميغاهرتز.',
    faq_q3: 'ما هو رمز Squawk؟', faq_a3: 'رمز ثماني من 4 أرقام. رموز خاصة: 7500 (اختطاف)، 7600 (عطل راديو)، 7700 (طوارئ).',
    faq_q4: 'هل بياناتي خاصة؟', faq_a4: 'نعم. كل شيء يعمل محليًا في متصفحك.',
    howto_1: 'اضغط "بدء الاستقبال" لتشغيل محاكاة ADS-B.',
    howto_2: 'شاهد الطائرات تظهر على خريطة السماء.',
    howto_3: 'اضغط على طائرة لرؤية معلومات الرحلة.',
    howto_4: 'تابع مخطط الارتفاع وجدول الطائرات.',
    wiki_adsb_title: '📡 ADS-B', wiki_adsb: 'مراقبة تلقائية بالبث على 1090 ميغاهرتز.',
    wiki_squawk_title: '🔢 رموز Squawk', wiki_squawk: 'رموز جهاز الإرسال والاستقبال من 4 أرقام.',
    wiki_privacy_title: '🔒 الخصوصية', wiki_privacy: 'كل البيانات تبقى في متصفحك.',
    working: 'جارٍ…',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس',
    t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    ready: '✈️ رادار الطائرات جاهز!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    soundEffects: '🔊 مؤثرات صوتية',
    whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط',
    musicMode: 'تفاعل موسيقي', splashHint: 'انقر للتخطي',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    startScan: 'بدء الاستقبال', stopScan: 'إيقاف',
    aircraftTracked: 'طائرة متتبعة',
    callsignLabel: 'الإشارة:', altitudeLabel: 'الارتفاع:', speedLabel: 'السرعة:',
    headingLabel: 'الاتجاه:', squawkLabel: 'Squawk:', typeLabel: 'النوع:',
    thCallsign: 'الإشارة', thAlt: 'الارتفاع', thSpeed: 'السرعة', thHeading: 'الاتجاه', thSquawk: 'Squawk', thType: 'النوع',
    adsbInfo: 'ADS-B هي تقنية مراقبة حيث تبث الطائرات موقعها GPS وارتفاعها وسرعتها وهويتها على 1090 ميغاهرتز.',
    receiverStarted: '📡 بدأ مستقبل ADS-B على 1090 ميغاهرتز', receiverStopped: '🔴 توقف المستقبل',
    newAircraft: 'طائرة جديدة:', aircraftLost: 'فقدت طائرة:',
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

/* ═══════ THEMES ═══════ */
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

/* ═══════ LOG ═══════ */
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
  const a = document.createElement('a'); a.href = url; a.download = `aircraft-radar-log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); URL.revokeObjectURL(url);
}

/* ═══════ LOG FILTERS ═══════ */
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

/* ═══════ TOAST ═══════ */
let toastTimer = null;
function showToast(msg, autoHideMs = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; }
  if (toastTimer) clearTimeout(toastTimer);
  if (autoHideMs > 0) toastTimer = setTimeout(hideToast, autoHideMs);
}
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; } }

/* ═══════ STATUS ═══════ */
function setStatus(connected) {
  const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang];
  if (txt) txt.textContent = connected ? s.connected : s.disconnected;
  if (pill) pill.classList.toggle('connected', connected);
}

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

/* ═══════ PANELS ═══════ */
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

/* ═══════ HIJRI DATE ═══════ */
function initHijriDate() {
  const el = $('hijriDate'); if (!el) return;
  try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day:'numeric', month:'long', year:'numeric' }).format(new Date()); } catch {}
}

/* ═══════ WHISPER / BREATHING / MUSIC (stubs) ═══════ */
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

/* ═══════════════════════════════════════════════════════════
   AIRCRAFT RADAR — SIMULATION ENGINE
   ═══════════════════════════════════════════════════════════ */

const AIRLINES = ['DAH','AZA','BAW','DLH','AFR','UAE','THY','RYR','EZY','QTR','SAS','KLM','IBE','TAP','RAM'];
const AC_TYPES = ['B738','A320','B77W','A321','B789','A332','E190','B737','A319','CRJ9','B763','A20N','B38M','A359','B772'];

let aircraft = [];
let selectedAC = null;
let simRunning = false;
let simInterval = null;
let nextId = 1;

function randCallsign() {
  return AIRLINES[Math.floor(Math.random() * AIRLINES.length)] + (100 + Math.floor(Math.random() * 9000));
}

function randSquawk() {
  const digits = () => Math.floor(Math.random() * 8);
  return '' + digits() + digits() + digits() + digits();
}

function createAircraft() {
  const edge = Math.floor(Math.random() * 4);
  let x, y, vx, vy;
  const speed = 0.3 + Math.random() * 0.7;
  switch (edge) {
    case 0: x = -0.05; y = Math.random(); vx = speed; vy = (Math.random() - 0.5) * 0.3; break;
    case 1: x = 1.05; y = Math.random(); vx = -speed; vy = (Math.random() - 0.5) * 0.3; break;
    case 2: x = Math.random(); y = -0.05; vx = (Math.random() - 0.5) * 0.3; vy = speed; break;
    default: x = Math.random(); y = 1.05; vx = (Math.random() - 0.5) * 0.3; vy = -speed; break;
  }
  const alt = 5000 + Math.floor(Math.random() * 40000);
  const spd = 180 + Math.floor(Math.random() * 350);
  const heading = Math.round(Math.atan2(vx, -vy) * 180 / Math.PI + 360) % 360;
  return {
    id: nextId++,
    callsign: randCallsign(),
    x, y, vx: vx * 0.002, vy: vy * 0.002,
    altitude: alt,
    speed: spd,
    heading,
    squawk: randSquawk(),
    type: AC_TYPES[Math.floor(Math.random() * AC_TYPES.length)],
    altHistory: [alt],
    age: 0
  };
}

function startSim() {
  if (simRunning) return;
  simRunning = true;
  setStatus(true);
  log(LANG[currentLang].receiverStarted, 'success');

  // Seed initial aircraft
  for (let i = 0; i < 5 + Math.floor(Math.random() * 4); i++) {
    const ac = createAircraft();
    ac.x = 0.1 + Math.random() * 0.8;
    ac.y = 0.1 + Math.random() * 0.8;
    aircraft.push(ac);
    log(`${LANG[currentLang].newAircraft} ${ac.callsign} (${ac.type}) FL${Math.floor(ac.altitude / 100)}`, 'rx');
  }

  simInterval = setInterval(simTick, 1000);
  drawLoop();
}

function stopSim() {
  if (!simRunning) return;
  simRunning = false;
  setStatus(false);
  if (simInterval) { clearInterval(simInterval); simInterval = null; }
  log(LANG[currentLang].receiverStopped, 'info');
}

function simTick() {
  // Move aircraft
  aircraft.forEach(ac => {
    ac.x += ac.vx;
    ac.y += ac.vy;
    ac.altitude += Math.floor((Math.random() - 0.5) * 200);
    ac.altitude = Math.max(1000, Math.min(45000, ac.altitude));
    ac.speed += Math.floor((Math.random() - 0.5) * 10);
    ac.speed = Math.max(150, Math.min(550, ac.speed));
    ac.altHistory.push(ac.altitude);
    if (ac.altHistory.length > 60) ac.altHistory.shift();
    ac.age++;
  });

  // Remove aircraft that left the area
  const before = aircraft.length;
  aircraft = aircraft.filter(ac => ac.x > -0.1 && ac.x < 1.1 && ac.y > -0.1 && ac.y < 1.1);
  if (aircraft.length < before) {
    log(`${LANG[currentLang].aircraftLost} ${before - aircraft.length} aircraft`, 'info');
  }

  // Occasionally add new aircraft
  if (Math.random() < 0.15 && aircraft.length < 20) {
    const ac = createAircraft();
    aircraft.push(ac);
    log(`${LANG[currentLang].newAircraft} ${ac.callsign} (${ac.type}) FL${Math.floor(ac.altitude / 100)}`, 'rx');
  }

  // Update count
  const countEl = $('aircraftCount');
  if (countEl) countEl.innerHTML = `${aircraft.length} <span data-i18n="aircraftTracked">${LANG[currentLang].aircraftTracked}</span>`;

  // Update table
  updateTable();
  drawAltChart();
}

/* ═══════ SKY MAP DRAWING ═══════ */
let skyCanvas, skyCtx;
let animFrame;

function drawLoop() {
  if (!simRunning) return;
  drawSkyMap();
  animFrame = requestAnimationFrame(drawLoop);
}

function drawSkyMap() {
  if (!skyCanvas) { skyCanvas = $('skyMap'); if (!skyCanvas) return; skyCtx = skyCanvas.getContext('2d'); }
  const W = skyCanvas.width, H = skyCanvas.height;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Background
  skyCtx.fillStyle = '#0a0e1a';
  skyCtx.fillRect(0, 0, W, H);

  // Grid rings
  skyCtx.strokeStyle = 'rgba(100,200,255,0.08)';
  skyCtx.lineWidth = 1;
  const cx = W / 2, cy = H / 2;
  for (let r = 50; r < Math.max(W, H); r += 80) {
    skyCtx.beginPath();
    skyCtx.arc(cx, cy, r, 0, Math.PI * 2);
    skyCtx.stroke();
  }
  // Crosshairs
  skyCtx.beginPath();
  skyCtx.moveTo(0, cy); skyCtx.lineTo(W, cy);
  skyCtx.moveTo(cx, 0); skyCtx.lineTo(cx, H);
  skyCtx.stroke();

  // Compass labels
  skyCtx.fillStyle = 'rgba(100,200,255,0.3)';
  skyCtx.font = '11px Orbitron, monospace';
  skyCtx.textAlign = 'center';
  skyCtx.fillText('N', cx, 14);
  skyCtx.fillText('S', cx, H - 6);
  skyCtx.fillText('E', W - 10, cy + 4);
  skyCtx.fillText('W', 12, cy + 4);

  // Draw aircraft
  aircraft.forEach(ac => {
    const px = ac.x * W;
    const py = ac.y * H;
    const isSelected = selectedAC && selectedAC.id === ac.id;

    // Trail
    skyCtx.strokeStyle = isSelected ? accent : 'rgba(100,200,255,0.15)';
    skyCtx.lineWidth = 1;
    skyCtx.beginPath();
    skyCtx.moveTo(px, py);
    skyCtx.lineTo(px - ac.vx * 5000, py - ac.vy * 5000);
    skyCtx.stroke();

    // Aircraft icon (triangle pointing in heading direction)
    const angle = ac.heading * Math.PI / 180;
    const size = isSelected ? 10 : 7;
    skyCtx.save();
    skyCtx.translate(px, py);
    skyCtx.rotate(angle);
    skyCtx.fillStyle = isSelected ? accent : '#4fc3f7';
    skyCtx.beginPath();
    skyCtx.moveTo(0, -size);
    skyCtx.lineTo(-size * 0.6, size * 0.6);
    skyCtx.lineTo(size * 0.6, size * 0.6);
    skyCtx.closePath();
    skyCtx.fill();
    skyCtx.restore();

    // Callsign label
    skyCtx.fillStyle = isSelected ? accent : 'rgba(200,230,255,0.7)';
    skyCtx.font = isSelected ? 'bold 10px Orbitron, monospace' : '9px Orbitron, monospace';
    skyCtx.textAlign = 'left';
    skyCtx.fillText(ac.callsign, px + 12, py - 4);
    skyCtx.fillStyle = 'rgba(200,230,255,0.4)';
    skyCtx.font = '8px Orbitron, monospace';
    skyCtx.fillText(`FL${Math.floor(ac.altitude / 100)} ${ac.speed}kt`, px + 12, py + 8);

    // Selection ring
    if (isSelected) {
      skyCtx.strokeStyle = accent;
      skyCtx.lineWidth = 1.5;
      skyCtx.beginPath();
      skyCtx.arc(px, py, 16, 0, Math.PI * 2);
      skyCtx.stroke();
    }
  });

  // Receiver label
  skyCtx.fillStyle = 'rgba(100,200,255,0.4)';
  skyCtx.font = '10px Orbitron, monospace';
  skyCtx.textAlign = 'left';
  skyCtx.fillText('RX: 1090.000 MHz  |  ADS-B  |  Mode-S', 8, H - 8);
}

/* ═══════ ALTITUDE CHART ═══════ */
function drawAltChart() {
  const canvas = $('altChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, W, H);

  // Y axis labels
  ctx.fillStyle = 'rgba(100,200,255,0.3)';
  ctx.font = '9px Orbitron, monospace';
  ctx.textAlign = 'right';
  for (let alt = 0; alt <= 45000; alt += 10000) {
    const y = H - (alt / 45000) * (H - 20) - 10;
    ctx.fillText(`FL${alt / 100}`, 38, y + 3);
    ctx.strokeStyle = 'rgba(100,200,255,0.06)';
    ctx.beginPath(); ctx.moveTo(42, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Draw each aircraft's altitude history
  const colors = ['#4fc3f7','#81c784','#ffb74d','#e57373','#ba68c8','#4db6ac','#fff176','#f06292','#90a4ae','#aed581'];
  aircraft.forEach((ac, idx) => {
    if (ac.altHistory.length < 2) return;
    const color = selectedAC && selectedAC.id === ac.id ? accent : colors[idx % colors.length];
    ctx.strokeStyle = color;
    ctx.lineWidth = selectedAC && selectedAC.id === ac.id ? 2 : 1;
    ctx.beginPath();
    ac.altHistory.forEach((alt, i) => {
      const x = 44 + (i / 60) * (W - 50);
      const y = H - (alt / 45000) * (H - 20) - 10;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Label at end
    const lastAlt = ac.altHistory[ac.altHistory.length - 1];
    const lx = 44 + ((ac.altHistory.length - 1) / 60) * (W - 50);
    const ly = H - (lastAlt / 45000) * (H - 20) - 10;
    ctx.fillStyle = color;
    ctx.font = '8px Orbitron, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(ac.callsign, lx + 4, ly - 2);
  });
}

/* ═══════ AIRCRAFT TABLE ═══════ */
function updateTable() {
  const tbody = $('aircraftBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  aircraft.forEach(ac => {
    const tr = document.createElement('tr');
    const isSel = selectedAC && selectedAC.id === ac.id;
    tr.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    if (isSel) tr.style.color = accent;
    tr.style.cursor = 'pointer';
    tr.innerHTML = `
      <td style="padding:4px 8px;font-weight:${isSel?'bold':'normal'}">${ac.callsign}</td>
      <td style="padding:4px 8px">${ac.altitude.toLocaleString()}</td>
      <td style="padding:4px 8px">${ac.speed}</td>
      <td style="padding:4px 8px">${ac.heading}°</td>
      <td style="padding:4px 8px">${ac.squawk}</td>
      <td style="padding:4px 8px">${ac.type}</td>
    `;
    tr.onclick = () => selectAircraft(ac);
    tbody.appendChild(tr);
  });
}

function selectAircraft(ac) {
  selectedAC = ac;
  const info = $('flightInfo');
  if (info) info.style.display = 'block';
  $('infoCallsign').textContent = ac.callsign;
  $('infoAlt').textContent = ac.altitude.toLocaleString() + ' ft';
  $('infoSpeed').textContent = ac.speed + ' kt';
  $('infoHeading').textContent = ac.heading + '°';
  $('infoSquawk').textContent = ac.squawk;
  $('infoType').textContent = ac.type;
  log(`✈️ Selected ${ac.callsign} — FL${Math.floor(ac.altitude / 100)}`, 'info');
}

/* ═══════ SKY MAP CLICK ═══════ */
function initMapClick() {
  const canvas = $('skyMap');
  if (!canvas) return;
  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width;
    const my = (e.clientY - rect.top) / rect.height;
    let closest = null, minDist = Infinity;
    aircraft.forEach(ac => {
      const d = Math.hypot(ac.x - mx, ac.y - my);
      if (d < minDist) { minDist = d; closest = ac; }
    });
    if (closest && minDist < 0.05) selectAircraft(closest);
  });
}

/* ═══════ MATRIX RAIN ═══════ */
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

/* ═══════ KONAMI CODE ═══════ */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
function initKonami() {
  document.addEventListener('keydown', e => { if (e.key === KONAMI[konamiIdx]) { konamiIdx++; if (konamiIdx === KONAMI.length) { konamiIdx = 0; setTheme('retro'); log('🕹️ KONAMI CODE — RETRO!', 'success'); } } else konamiIdx = 0; });
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;

  // Log buttons
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();

  // Panels
  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp; if (hClose) hClose.onclick = closeHelp; if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();
  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings; if (sClose) sClose.onclick = closeSettings; if (sOv) sOv.onclick = closeSettings;
  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog; if (lClose) lClose.onclick = closeLog;
  initLogResize();

  // Sound
  const soundTgl = $('soundToggle');
  if (soundTgl) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} soundTgl.checked = soundEnabled; soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }); }

  // Settings features
  const whisperBtn = $('whisperBtn'); if (whisperBtn) whisperBtn.onclick = toggleWhisper;
  const breathBtn = $('breathingBtn'), dhikrDisp = $('dhikrDisplay'), dhikrBtn = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => { toggleBreathing(); if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none'; };
  if (dhikrBtn) dhikrBtn.onclick = incrementDhikr;
  const musicBtn = $('musicBtn'); if (musicBtn) musicBtn.onclick = toggleMusicMode;

  // Keys
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); });

  // Language / theme
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
  initMapClick();

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
