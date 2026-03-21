/**
 * WiFi Sonar — Living Map
 * Sonar radar canvas with APs fixed and clients orbiting
 * Workshop DIY — Template v1.2 + App Logic
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7zm21,.-1.6h-6.5v3.2h6.5zm-13,.16.2h-3.2v-16.2h3.2zm19.5,0h-3.2v-16.2h3.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/></svg>`;
const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAA+ElEQVR4nO3bMQ6DMBBA0Y+4/5WTG1BQIKTYXq/f1JGsmcEYGAAAAAAAAAAAAAAAAAAAAPifTu/P5+eu';

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  if (type === 'click') { osc.frequency.value = 800; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); }
  else if (type === 'success') { osc.frequency.value = 523; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); }
  else if (type === 'error') { osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); }
}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title: 'WiFi Sonar — Living Map', subtitle: 'Every WiFi frame on sonar radar',
    disconnected: 'Disconnected', connected: 'Scanning',
    mainSection: 'Sonar Radar', mainDesc: 'APs fixed on radar, clients orbiting around them',
    sectionA: 'Device List', sectionB: 'Frame Statistics', sectionC: 'How It Works',
    start: 'Start', stop: 'Stop', totalFrames: 'Total Frames', apCount: 'APs', clientCount: 'Clients',
    colMAC: 'MAC', colType: 'Type', colSSID: 'SSID', colSignal: 'Signal', colFrames: 'Frames',
    frameBreakdown: 'Frame Type Breakdown',
    howItWorksText: 'WiFi Sonar simulates a wireless monitoring tool that captures 802.11 frames. Access Points (APs) appear as fixed nodes on the radar, while client devices orbit around their associated AP. Frame types include Management (beacons, probes), Control (ACK, RTS/CTS), and Data frames. The sonar sweep reveals devices as they transmit, just like a real radar system detects objects.',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    settings: 'Settings', language: 'Language', theme: 'Theme',
    soundEffects: 'Sound effects',
    help: 'Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    faq_q1: 'What is WiFi Sonar?', faq_a1: 'A radar-style visualizer for WiFi devices. APs appear fixed, clients orbit around their associated AP.',
    faq_q2: 'Is this capturing real WiFi?', faq_a2: 'No, this is a simulation. Real WiFi monitoring requires monitor mode hardware and special drivers.',
    faq_q3: 'What are the frame types?', faq_a3: 'Management (beacons, probes), Control (ACK, RTS/CTS), and Data frames. Each serves a different role in 802.11.',
    faq_q4: 'Is my data private?', faq_a4: 'Yes. Everything runs locally in your browser. No data is sent anywhere.',
    howto_1: 'Click Start to begin the sonar simulation.',
    howto_2: 'Watch APs appear as fixed nodes and clients orbit around them.',
    howto_3: 'Open the Device List to see all detected devices.',
    howto_4: 'Check Frame Statistics for a breakdown of captured frame types.',
    wiki_radar_title: 'Sonar Radar', wiki_radar: 'The radar sweeps 360 degrees, revealing devices as the beam passes over them.',
    wiki_frames_title: 'Frame Types', wiki_frames: '802.11 frames: Management, Control, Data.',
    wiki_privacy_title: 'Privacy', wiki_privacy: 'Local-first, privacy-first. All data stays in your browser.',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: 'Sonar ready!', logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    splashHint: 'tap to skip', working: 'Working...',
    langChanged: 'Language → English', themeChanged: 'Theme →',
    simStarted: 'Sonar scanning started', simStopped: 'Sonar scanning stopped',
    newAP: 'New AP detected', newClient: 'New client detected',
    beacon: 'Beacon', probe: 'Probe Req', probeResp: 'Probe Resp', ack: 'ACK', data: 'Data', rts: 'RTS', cts: 'CTS',
    management: 'Management', control: 'Control', dataType: 'Data',
  },
  fr: {
    title: 'WiFi Sonar — Carte Vivante', subtitle: 'Chaque trame WiFi sur le radar sonar',
    disconnected: 'Deconnecte', connected: 'Balayage',
    mainSection: 'Radar Sonar', mainDesc: 'AP fixes sur le radar, clients en orbite autour',
    sectionA: 'Liste des appareils', sectionB: 'Statistiques de trames', sectionC: 'Comment ca marche',
    start: 'Demarrer', stop: 'Arreter', totalFrames: 'Trames totales', apCount: 'AP', clientCount: 'Clients',
    colMAC: 'MAC', colType: 'Type', colSSID: 'SSID', colSignal: 'Signal', colFrames: 'Trames',
    frameBreakdown: 'Repartition par type de trame',
    howItWorksText: 'WiFi Sonar simule un outil de surveillance sans fil qui capture les trames 802.11. Les points d\'acces (AP) apparaissent comme des noeuds fixes sur le radar, tandis que les appareils clients orbitent autour de leur AP associe. Les types de trames incluent Gestion (balises, sondes), Controle (ACK, RTS/CTS) et Donnees.',
    activityLog: 'Journal', eventsMsg: 'Evenements et messages',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    settings: 'Parametres', language: 'Langue', theme: 'Theme',
    soundEffects: 'Effets sonores',
    help: 'Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    faq_q1: 'Qu\'est-ce que WiFi Sonar ?', faq_a1: 'Un visualiseur radar pour les appareils WiFi. Les AP sont fixes, les clients orbitent.',
    faq_q2: 'Capture-t-il du vrai WiFi ?', faq_a2: 'Non, c\'est une simulation. La vraie surveillance WiFi necessite du materiel en mode moniteur.',
    faq_q3: 'Quels sont les types de trames ?', faq_a3: 'Gestion (balises, sondes), Controle (ACK, RTS/CTS) et Donnees.',
    faq_q4: 'Mes donnees sont-elles privees ?', faq_a4: 'Oui. Tout fonctionne localement dans votre navigateur.',
    howto_1: 'Cliquez sur Demarrer pour lancer la simulation sonar.',
    howto_2: 'Observez les AP comme noeuds fixes et les clients en orbite.',
    howto_3: 'Ouvrez la liste des appareils pour voir les peripheriques detectes.',
    howto_4: 'Consultez les statistiques pour une repartition des trames.',
    wiki_radar_title: 'Radar Sonar', wiki_radar: 'Le radar balaye 360 degres, revelant les appareils.',
    wiki_frames_title: 'Types de trames', wiki_frames: 'Trames 802.11 : Gestion, Controle, Donnees.',
    wiki_privacy_title: 'Confidentialite', wiki_privacy: 'Tout reste dans votre navigateur.',
    t_mosque: 'Mosquee', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: 'Sonar pret !', logCleared: 'Journal efface', copied: 'Copie !', copyFail: 'Echec',
    splashHint: 'appuyer pour passer', working: 'En cours...',
    langChanged: 'Langue → Francais', themeChanged: 'Theme →',
    simStarted: 'Balayage sonar demarre', simStopped: 'Balayage sonar arrete',
    newAP: 'Nouvel AP detecte', newClient: 'Nouveau client detecte',
    beacon: 'Balise', probe: 'Sonde Req', probeResp: 'Sonde Resp', ack: 'ACK', data: 'Donnees', rts: 'RTS', cts: 'CTS',
    management: 'Gestion', control: 'Controle', dataType: 'Donnees',
  },
  ar: {
    title: 'سونار WiFi — خريطة حية', subtitle: 'كل إطار WiFi على رادار السونار',
    disconnected: 'غير متصل', connected: 'مسح جارٍ',
    mainSection: 'رادار السونار', mainDesc: 'نقاط الوصول ثابتة، العملاء يدورون حولها',
    sectionA: 'قائمة الأجهزة', sectionB: 'إحصائيات الإطارات', sectionC: 'كيف يعمل',
    start: 'بدء', stop: 'إيقاف', totalFrames: 'إجمالي الإطارات', apCount: 'نقاط وصول', clientCount: 'عملاء',
    colMAC: 'MAC', colType: 'نوع', colSSID: 'SSID', colSignal: 'إشارة', colFrames: 'إطارات',
    frameBreakdown: 'تفصيل أنواع الإطارات',
    howItWorksText: 'يحاكي سونار WiFi أداة مراقبة لاسلكية تلتقط إطارات 802.11. تظهر نقاط الوصول كعقد ثابتة على الرادار، بينما تدور أجهزة العملاء حول نقطة الوصول المرتبطة بها. تشمل أنواع الإطارات: الإدارة والتحكم والبيانات.',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', filterAll: 'الكل',
    settings: 'الإعدادات', language: 'اللغة', theme: 'المظهر',
    soundEffects: 'مؤثرات صوتية',
    help: 'مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    faq_q1: 'ما هو سونار WiFi؟', faq_a1: 'عارض بنمط الرادار لأجهزة WiFi. نقاط الوصول ثابتة، العملاء يدورون.',
    faq_q2: 'هل يلتقط WiFi حقيقي؟', faq_a2: 'لا، هذه محاكاة. المراقبة الحقيقية تتطلب أجهزة خاصة.',
    faq_q3: 'ما هي أنواع الإطارات؟', faq_a3: 'إدارة (إشارات، فحص)، تحكم (ACK, RTS/CTS)، وبيانات.',
    faq_q4: 'هل بياناتي خاصة؟', faq_a4: 'نعم. كل شيء يعمل محلياً في متصفحك.',
    howto_1: 'انقر بدء لتشغيل محاكاة السونار.',
    howto_2: 'شاهد نقاط الوصول كعقد ثابتة والعملاء يدورون.',
    howto_3: 'افتح قائمة الأجهزة لرؤية الأجهزة المكتشفة.',
    howto_4: 'تحقق من إحصائيات الإطارات.',
    wiki_radar_title: 'رادار السونار', wiki_radar: 'يمسح الرادار 360 درجة كاشفاً الأجهزة.',
    wiki_frames_title: 'أنواع الإطارات', wiki_frames: 'إطارات 802.11: إدارة، تحكم، بيانات.',
    wiki_privacy_title: 'الخصوصية', wiki_privacy: 'كل البيانات تبقى في متصفحك.',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    ready: 'السونار جاهز!', logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    splashHint: 'انقر للتخطي', working: 'جارٍ...',
    langChanged: 'اللغة ← العربية', themeChanged: 'المظهر ←',
    simStarted: 'بدأ مسح السونار', simStopped: 'توقف مسح السونار',
    newAP: 'نقطة وصول جديدة', newClient: 'عميل جديد',
    beacon: 'إشارة', probe: 'طلب فحص', probeResp: 'رد فحص', ack: 'ACK', data: 'بيانات', rts: 'RTS', cts: 'CTS',
    management: 'إدارة', control: 'تحكم', dataType: 'بيانات',
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
const THEME_MELODIES = { 'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523] };

function playThemeMelody(name) {
  if (!soundEnabled || !audioCtx) return;
  const notes = THEME_MELODIES[name]; if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0.06; g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15); o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2); });
}

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  const s = LANG[currentLang], label = s['t_' + name] || name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(`${s.themeChanged} ${label}`, 'info');
}

/* ═══════ LOG ═══════ */
let logContainer, typewriterEnabled = true;

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d);
  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') playSound('success');
  else if (type === 'error') playSound('error');
  applyLogFilter();
}

function clearLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (logContainer) logContainer.innerHTML = '';
  log(LANG[currentLang].logCleared);
}

async function copyLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); }
  catch { log(LANG[currentLang].copyFail, 'error'); }
}

function exportLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const lines = Array.from(logContainer.children).map(d => d.textContent);
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `sonar-log-${new Date().toISOString().slice(0,10)}.txt`; a.click();
  URL.revokeObjectURL(url);
}

/* ═══════ TOAST ═══════ */
function showToast(msg, ms = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; }
  if (ms > 0) setTimeout(hideToast, ms);
}
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }

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
    line.style.display = (activeLogFilter === 'all' || line.classList.contains(activeLogFilter)) ? '' : 'none';
  });
}

/* ═══════ PANELS ═══════ */
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
  const tabs = document.querySelectorAll('.help-tab'), contents = document.querySelectorAll('.help-content');
  tabs.forEach(tab => { tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active')); contents.forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const target = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1));
    if (target) target.classList.add('active');
  }); });
}

/* ═══════ HIJRI DATE ═══════ */
function initHijriDate() {
  const el = $('hijriDate'); if (!el) return;
  try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day:'numeric', month:'long', year:'numeric' }).format(new Date()); } catch {}
}

/* ═══════ LOG RESIZE ═══════ */
function initLogResize() {
  const handle = $('logResizeHandle'), panel = $('logPanel');
  if (!handle || !panel) return;
  let dragging = false, startX, startW;
  const isRtl = () => document.documentElement.dir === 'rtl';
  handle.addEventListener('mousedown', e => { dragging = true; startX = e.clientX; startW = panel.offsetWidth; handle.classList.add('active'); document.body.style.cursor = 'col-resize'; e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (!dragging) return; const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6)) + 'px'); });
  document.addEventListener('mouseup', () => { if (!dragging) return; dragging = false; handle.classList.remove('active'); document.body.style.cursor = ''; });
}

/* ═══════════════════════════════════════════════════════════════
   APP LOGIC — WiFi Sonar Radar
   ═══════════════════════════════════════════════════════════════ */

const SSIDS = ['HomeNet-5G', 'CoffeeShop_Free', 'NETGEAR-2.4', 'xfinitywifi', 'TP-Link_A3F2', 'Linksys00443', 'FBI-Surveillance-Van', 'PrettyFly4AWifi', 'BillWiTheScienceFi', 'DropItLikeItsHotspot', 'Virus.exe', 'Martin_Router_King', 'LANofTheFree', 'HideYoKidsHideYoWiFi', 'TheLANBeforeTime', 'GetOffMyLAN', 'YellAtYourWiFi', 'AllYourBandwidth', 'NachoWiFi', 'ClickHere4Virus'];
const VENDORS = ['Intel', 'Broadcom', 'Qualcomm', 'Realtek', 'MediaTek', 'Atheros', 'Apple', 'Samsung', 'Huawei', 'Cisco'];
const FRAME_TYPES = ['beacon', 'probe', 'probeResp', 'ack', 'data', 'rts', 'cts'];

function randMAC() {
  return Array.from({length:6}, () => Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':');
}

let simRunning = false, simAnim = null, sweepAngle = 0;
let aps = [], clients = [], totalFrameCount = 0;
let frameStats = { management: 0, control: 0, data: 0 };

function generateAPs(count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + Math.random() * 0.5;
    const dist = 0.25 + Math.random() * 0.55;
    result.push({
      mac: randMAC(), ssid: SSIDS[i % SSIDS.length], vendor: VENDORS[Math.floor(Math.random() * VENDORS.length)],
      signal: -30 - Math.floor(Math.random() * 50), channel: Math.floor(Math.random() * 13) + 1,
      angle, dist, frames: 0, type: 'AP', clients: []
    });
  }
  return result;
}

function generateClients(apList) {
  const result = [];
  apList.forEach(ap => {
    const numClients = 1 + Math.floor(Math.random() * 4);
    for (let i = 0; i < numClients; i++) {
      const c = {
        mac: randMAC(), vendor: VENDORS[Math.floor(Math.random() * VENDORS.length)],
        signal: ap.signal - 10 - Math.floor(Math.random() * 20),
        ap: ap, orbitRadius: 0.04 + Math.random() * 0.08,
        orbitAngle: Math.random() * Math.PI * 2, orbitSpeed: 0.005 + Math.random() * 0.02,
        frames: 0, type: 'Client'
      };
      ap.clients.push(c);
      result.push(c);
    }
  });
  return result;
}

function drawSonar() {
  const canvas = $('sonarCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const maxR = Math.min(cx, cy) - 20;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  const accent2 = getComputedStyle(document.documentElement).getPropertyValue('--accent2').trim() || '#0ea5e9';

  // Background
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, 0, W, H);

  // Grid circles
  ctx.strokeStyle = accent + '30';
  ctx.lineWidth = 0.5;
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath(); ctx.arc(cx, cy, maxR * i / 4, 0, Math.PI * 2); ctx.stroke();
  }
  // Cross hairs
  ctx.beginPath(); ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR); ctx.stroke();

  // Sweep beam
  const gradient = ctx.createConicalGradient ? null : null;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, maxR, sweepAngle - 0.4, sweepAngle, false);
  ctx.closePath();
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
  grad.addColorStop(0, accent + '40');
  grad.addColorStop(1, accent + '05');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  // Sweep line
  ctx.strokeStyle = accent + 'AA';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(sweepAngle) * maxR, cy + Math.sin(sweepAngle) * maxR);
  ctx.stroke();

  // Draw APs
  aps.forEach(ap => {
    const x = cx + Math.cos(ap.angle) * ap.dist * maxR;
    const y = cy + Math.sin(ap.angle) * ap.dist * maxR;

    // Glow when sweep passes
    const angleDiff = Math.abs(((sweepAngle - ap.angle) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
    const glow = angleDiff < 0.5 ? 1 - angleDiff / 0.5 : 0;

    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.4 + glow * 0.6;
    ctx.beginPath(); ctx.arc(x, y, 6 + glow * 4, 0, Math.PI * 2); ctx.fill();

    // Ring
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.2 + glow * 0.3;
    ctx.beginPath(); ctx.arc(x, y, 12 + glow * 6, 0, Math.PI * 2); ctx.stroke();

    ctx.globalAlpha = 0.8;
    ctx.fillStyle = accent;
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(ap.ssid.substring(0, 12), x, y - 14);

    ctx.globalAlpha = 1;

    // Draw clients orbiting this AP
    ap.clients.forEach(c => {
      const cx2 = x + Math.cos(c.orbitAngle) * c.orbitRadius * maxR;
      const cy2 = y + Math.sin(c.orbitAngle) * c.orbitRadius * maxR;

      const cAngle = Math.atan2(cy2 - cy, cx2 - cx);
      const cDiff = Math.abs(((sweepAngle - cAngle) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
      const cGlow = cDiff < 0.5 ? 1 - cDiff / 0.5 : 0;

      ctx.fillStyle = accent2;
      ctx.globalAlpha = 0.3 + cGlow * 0.7;
      ctx.beginPath(); ctx.arc(cx2, cy2, 3 + cGlow * 2, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    });
  });

  // Center dot
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.8;
  ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = 1;
}

function simTick() {
  if (!simRunning) return;

  sweepAngle += 0.02;
  if (sweepAngle > Math.PI * 2) sweepAngle -= Math.PI * 2;

  // Orbit clients
  clients.forEach(c => { c.orbitAngle += c.orbitSpeed; });

  // Generate random frames
  if (Math.random() < 0.3) {
    const ftype = FRAME_TYPES[Math.floor(Math.random() * FRAME_TYPES.length)];
    totalFrameCount++;
    if (ftype === 'beacon' || ftype === 'probe' || ftype === 'probeResp') frameStats.management++;
    else if (ftype === 'ack' || ftype === 'rts' || ftype === 'cts') frameStats.control++;
    else frameStats.data++;

    // Attribute to random device
    const allDevices = [...aps, ...clients];
    if (allDevices.length > 0) {
      const dev = allDevices[Math.floor(Math.random() * allDevices.length)];
      dev.frames++;
    }

    $('totalFrames').textContent = totalFrameCount;
    $('apCount').textContent = aps.length;
    $('clientCount').textContent = clients.length;
  }

  drawSonar();
  simAnim = requestAnimationFrame(simTick);
}

function updateDeviceTable() {
  const tbody = $('deviceTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  aps.forEach(ap => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td style="font-family:monospace;font-size:.7rem">${ap.mac}</td><td>AP</td><td>${ap.ssid}</td><td>${ap.signal} dBm</td><td>${ap.frames}</td>`;
    tbody.appendChild(tr);
  });
  clients.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td style="font-family:monospace;font-size:.7rem">${c.mac}</td><td>Client</td><td>-</td><td>${c.signal} dBm</td><td>${c.frames}</td>`;
    tbody.appendChild(tr);
  });
}

function updateFrameStats() {
  const el = $('frameStats');
  if (!el) return;
  const s = LANG[currentLang];
  el.innerHTML = `
    <div style="flex:1;min-width:100px;padding:8px;border-radius:8px;background:rgba(0,0,0,.2);text-align:center">
      <div style="font-size:1.1rem;font-weight:700;color:var(--accent)">${frameStats.management}</div>
      <div style="font-size:.7rem;color:var(--text-muted)">${s.management}</div>
    </div>
    <div style="flex:1;min-width:100px;padding:8px;border-radius:8px;background:rgba(0,0,0,.2);text-align:center">
      <div style="font-size:1.1rem;font-weight:700;color:var(--accent2)">${frameStats.control}</div>
      <div style="font-size:.7rem;color:var(--text-muted)">${s.control}</div>
    </div>
    <div style="flex:1;min-width:100px;padding:8px;border-radius:8px;background:rgba(0,0,0,.2);text-align:center">
      <div style="font-size:1.1rem;font-weight:700;color:#86efac">${frameStats.data}</div>
      <div style="font-size:.7rem;color:var(--text-muted)">${s.dataType}</div>
    </div>`;
}

function startSim() {
  if (simRunning) return;
  simRunning = true;
  setStatus(true);
  $('startBtn').disabled = true;
  $('stopBtn').disabled = false;

  aps = generateAPs(8);
  clients = generateClients(aps);
  totalFrameCount = 0;
  frameStats = { management: 0, control: 0, data: 0 };
  sweepAngle = 0;

  // Clear and redraw canvas
  const canvas = $('sonarCanvas');
  if (canvas) { const ctx = canvas.getContext('2d'); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height); }

  log(LANG[currentLang].simStarted, 'success');
  aps.forEach(ap => log(`${LANG[currentLang].newAP}: ${ap.ssid} (${ap.mac}) ch${ap.channel}`, 'rx'));

  simTick();

  // Periodic table and stats update
  simUpdateInterval = setInterval(() => {
    updateDeviceTable();
    updateFrameStats();
  }, 1000);
}

let simUpdateInterval;

function stopSim() {
  simRunning = false;
  if (simAnim) cancelAnimationFrame(simAnim);
  if (simUpdateInterval) clearInterval(simUpdateInterval);
  setStatus(false);
  $('startBtn').disabled = false;
  $('stopBtn').disabled = true;
  log(LANG[currentLang].simStopped, 'info');
  updateDeviceTable();
  updateFrameStats();
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;

  // Log buttons
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();

  // Help panel
  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp; if (hClose) hClose.onclick = closeHelp; if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();

  // Settings panel
  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings; if (sClose) sClose.onclick = closeSettings; if (sOv) sOv.onclick = closeSettings;

  // Log panel
  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog; if (lClose) lClose.onclick = closeLog;
  initLogResize();

  // Sound toggle
  const soundTgl = $('soundToggle');
  if (soundTgl) {
    try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {}
    soundTgl.checked = soundEnabled;
    soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} if (soundEnabled) playSound('click'); });
  }

  // Escape key
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); });

  // Language dropdown
  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));

  // Restore saved prefs
  try {
    const savedLang = localStorage.getItem('wdiy-lang');
    const savedTheme = localStorage.getItem('wdiy-theme');
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLanguage(savedLang);
  } catch {}

  initHijriDate();

  // App buttons
  const startBtn = $('startBtn'), stopBtn = $('stopBtn');
  if (startBtn) startBtn.onclick = startSim;
  if (stopBtn) stopBtn.onclick = stopSim;

  // Init canvas
  const canvas = $('sonarCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
