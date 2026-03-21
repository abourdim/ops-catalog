/**
 * Radio Telescope — Hydrogen Line — Workshop DIY
 * Simulated 1420.405 MHz hydrogen line radio astronomy
 * Themes . i18n . RTL . Log . Toast . Status . Panels . Sound
 */

const $ = id => document.getElementById(id);

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.2';

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
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
    title: 'Radio Telescope', subtitle: '🔭 1420 MHz hydrogen line radio astronomy',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Radio Telescope — Hydrogen Line', mainDesc: '1420.405 MHz hydrogen emission spectrum',
    sectionA: 'Galaxy Rotation Curve', sectionB: 'Observation Log', sectionC: 'Hydrogen Line Explained',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    theme: 'Theme', settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    faq_q1: 'What is the hydrogen line?', faq_a1: 'A 1420.405 MHz radio signal emitted by neutral hydrogen atoms. It is the most important frequency in radio astronomy.',
    faq_q2: 'Do I need a radio telescope?', faq_a2: 'No, this is a simulator. Real observations use an RTL-SDR with a filtered LNA and a horn antenna.',
    faq_q3: 'What is Doppler shift?', faq_a3: 'When hydrogen moves toward or away from us, the frequency shifts. This reveals the velocity of gas clouds.',
    faq_q4: 'Is my data private?', faq_a4: 'Yes. Everything runs locally in your browser.',
    howto_1: 'Click "Start Observation" to begin simulated hydrogen line reception.',
    howto_2: 'Watch the spectrum build up around 1420.405 MHz.',
    howto_3: 'Adjust gain and averaging to improve signal visibility.',
    howto_4: 'Check the galaxy rotation curve derived from Doppler measurements.',
    wiki_h1_title: '📡 Hydrogen Line', wiki_h1: '21 cm emission at 1420.405 MHz from neutral hydrogen spin-flip transitions.',
    wiki_doppler_title: '🌀 Doppler Effect', wiki_doppler: 'Frequency shifts reveal radial velocity of hydrogen gas clouds.',
    wiki_privacy_title: '🔒 Privacy', wiki_privacy: 'All data stays in your browser.',
    working: 'Working...', ready: '🔭 Radio Telescope ready!',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    soundEffects: '🔊 Sound effects', whisperMode: 'Whisper mode',
    breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    splashHint: 'tap to skip', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    startScan: 'Start Observation', stopScan: 'Stop', integration: 'integration',
    gainLabel: 'Gain:', avgLabel: 'Averaging:',
    peakLabel: 'Peak Power (dB)', peakFreqLabel: 'Peak Freq (MHz)',
    dopplerLabel: 'Doppler (km/s)', snrLabel: 'SNR (dB)',
    rotationHint: 'Doppler shifts in the hydrogen line reveal how fast different parts of the galaxy rotate',
    h1Info: 'The hydrogen line (21 cm line) at 1420.405 MHz is emitted by neutral hydrogen atoms when the electron spin-flips. This transition is detectable across the galaxy due to the vast amount of hydrogen in interstellar space. By measuring Doppler shifts, radio astronomers map the rotation of the Milky Way.',
    obsStarted: '📡 Observation started — tuned to 1420.405 MHz', obsStopped: '🔴 Observation stopped',
    h1Detected: '🌟 Hydrogen line detected!', signalUpdate: '📊 Signal update',
  },
  fr: {
    title: 'Radiotélescope', subtitle: '🔭 Radioastronomie — raie hydrogène 1420 MHz',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'Radiotélescope — Raie Hydrogène', mainDesc: 'Spectre d\'émission hydrogène à 1420.405 MHz',
    sectionA: 'Courbe de rotation galactique', sectionB: 'Journal d\'observation', sectionC: 'Raie hydrogène expliquée',
    activityLog: 'Journal', eventsMsg: 'Événements et messages',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    theme: 'Thème', settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    faq_q1: 'Qu\'est-ce que la raie hydrogène ?', faq_a1: 'Un signal radio à 1420.405 MHz émis par l\'hydrogène neutre. La fréquence la plus importante en radioastronomie.',
    faq_q2: 'Ai-je besoin d\'un radiotélescope ?', faq_a2: 'Non, c\'est un simulateur. Les vraies observations utilisent un RTL-SDR avec LNA filtré.',
    faq_q3: 'Qu\'est-ce que le décalage Doppler ?', faq_a3: 'Quand l\'hydrogène se déplace, la fréquence change. Cela révèle la vitesse des nuages de gaz.',
    faq_q4: 'Mes données sont privées ?', faq_a4: 'Oui. Tout fonctionne localement.',
    howto_1: 'Cliquez "Démarrer" pour lancer l\'observation simulée.',
    howto_2: 'Observez le spectre se construire autour de 1420.405 MHz.',
    howto_3: 'Ajustez le gain et le moyennage pour améliorer la visibilité.',
    howto_4: 'Consultez la courbe de rotation galactique.',
    wiki_h1_title: '📡 Raie Hydrogène', wiki_h1: 'Émission à 21 cm / 1420.405 MHz.',
    wiki_doppler_title: '🌀 Effet Doppler', wiki_doppler: 'Les décalages fréquentiels révèlent la vitesse radiale du gaz.',
    wiki_privacy_title: '🔒 Confidentialité', wiki_privacy: 'Tout reste dans votre navigateur.',
    working: 'En cours...', ready: '🔭 Radiotélescope prêt !',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_riad: 'Riad', t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    soundEffects: '🔊 Effets sonores', whisperMode: 'Mode murmure',
    breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap', musicMode: 'Réactif musique',
    splashHint: 'appuyer pour passer', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    startScan: 'Démarrer', stopScan: 'Arrêter', integration: 'intégration',
    gainLabel: 'Gain :', avgLabel: 'Moyennage :',
    peakLabel: 'Puissance crête (dB)', peakFreqLabel: 'Fréq. crête (MHz)',
    dopplerLabel: 'Doppler (km/s)', snrLabel: 'RSB (dB)',
    rotationHint: 'Les décalages Doppler révèlent la vitesse de rotation des parties de la galaxie',
    h1Info: 'La raie hydrogène à 1420.405 MHz est émise par l\'hydrogène neutre lors du retournement de spin de l\'électron.',
    obsStarted: '📡 Observation démarrée — accordé sur 1420.405 MHz', obsStopped: '🔴 Observation arrêtée',
    h1Detected: '🌟 Raie hydrogène détectée !', signalUpdate: '📊 Mise à jour signal',
  },
  ar: {
    title: 'تلسكوب راديوي', subtitle: '🔭 فلك راديوي — خط الهيدروجين 1420 ميغاهرتز',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'تلسكوب راديوي — خط الهيدروجين', mainDesc: 'طيف انبعاث الهيدروجين عند 1420.405 ميغاهرتز',
    sectionA: 'منحنى دوران المجرة', sectionB: 'سجل الرصد', sectionC: 'شرح خط الهيدروجين',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', filterAll: 'الكل',
    theme: 'المظهر', settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    faq_q1: 'ما هو خط الهيدروجين؟', faq_a1: 'إشارة راديوية عند 1420.405 ميغاهرتز من ذرات الهيدروجين المحايدة.',
    faq_q2: 'هل أحتاج تلسكوب راديوي؟', faq_a2: 'لا، هذا محاكي. الرصد الحقيقي يستخدم RTL-SDR مع LNA مفلتر.',
    faq_q3: 'ما هو انزياح دوبلر؟', faq_a3: 'عندما يتحرك الهيدروجين نحونا أو بعيدًا، يتغير التردد.',
    faq_q4: 'هل بياناتي خاصة؟', faq_a4: 'نعم. كل شيء يعمل محليًا.',
    howto_1: 'اضغط "بدء الرصد" لتشغيل محاكاة استقبال خط الهيدروجين.',
    howto_2: 'شاهد الطيف يتشكل حول 1420.405 ميغاهرتز.',
    howto_3: 'اضبط الكسب والتوسيط لتحسين رؤية الإشارة.',
    howto_4: 'تابع منحنى دوران المجرة.',
    wiki_h1_title: '📡 خط الهيدروجين', wiki_h1: 'انبعاث 21 سم عند 1420.405 ميغاهرتز.',
    wiki_doppler_title: '🌀 تأثير دوبلر', wiki_doppler: 'انزياحات التردد تكشف سرعة سحب الغاز.',
    wiki_privacy_title: '🔒 الخصوصية', wiki_privacy: 'كل البيانات تبقى في متصفحك.',
    working: 'جارٍ...', ready: '🔭 التلسكوب الراديوي جاهز!',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس',
    t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    soundEffects: '🔊 مؤثرات صوتية', whisperMode: 'وضع الهمس',
    breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط', musicMode: 'تفاعل موسيقي',
    splashHint: 'انقر للتخطي', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    startScan: 'بدء الرصد', stopScan: 'إيقاف', integration: 'تكامل',
    gainLabel: 'الكسب:', avgLabel: 'التوسيط:',
    peakLabel: 'القدرة القصوى (dB)', peakFreqLabel: 'تردد القمة (MHz)',
    dopplerLabel: 'دوبلر (كم/ث)', snrLabel: 'نسبة الإشارة للضجيج (dB)',
    rotationHint: 'انزياحات دوبلر في خط الهيدروجين تكشف سرعة دوران أجزاء المجرة',
    h1Info: 'خط الهيدروجين عند 1420.405 ميغاهرتز ينبعث من ذرات الهيدروجين المحايدة عند انقلاب دوران الإلكترون.',
    obsStarted: '📡 بدأ الرصد — مضبوط على 1420.405 ميغاهرتز', obsStopped: '🔴 توقف الرصد',
    h1Detected: '🌟 تم كشف خط الهيدروجين!', signalUpdate: '📊 تحديث الإشارة',
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

const THEME_MELODIES = {'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+name]||name}`, 'info');
}
function playThemeMelody(name) {
  if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[name]; if (!notes) return; const t = audioCtx.currentTime;
  notes.forEach((freq, i) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type='sine'; o.frequency.value=freq; g.gain.value=0.06; g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15); o.start(t+i*0.15); o.stop(t+i*0.15+0.2); });
}

/* ======= LOG ======= */
let logContainer, typewriterEnabled = true;
const logHistory = [];
function log(msg, type='info') {
  if (!logContainer) logContainer=$('logContainer'); if (!logContainer) return;
  const d=document.createElement('div'); d.className=`log-line ${type}`;
  const fullText=`[${new Date().toLocaleTimeString()}] ${msg}`;
  if (typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,fullText);}
  else{d.textContent=fullText;logContainer.appendChild(d);}
  logContainer.scrollTop=logContainer.scrollHeight;
  if(type==='success')playSound('success'); else if(type==='error')playSound('error');
  logHistory.push({msg,type,ts:Date.now()}); applyLogFilter();
}
async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(8+Math.random()*12);}el.classList.remove('typing');}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const text=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const blob=new Blob([text],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`radio-telescope-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url);}

let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}

let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}

let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}

const FOCUSABLE='button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(rid);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}
function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab,tid='help'+n.charAt(0).toUpperCase()+n.slice(1);const target=$(tid);if(target)target.classList.add('active');});});}
function initLogResize(){const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;let dragging=false,startX,startW;const isRtl=()=>document.documentElement.dir==='rtl';handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=isRtl()?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

let whisperActive=false;
function toggleWhisper(){whisperActive=!whisperActive;log(whisperActive?'🎤 Whisper mode on':'🎤 Whisper mode off','info');}
let breathingActive=false;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));log(breathingActive?'🫁 Breathing guide on':'🫁 Breathing guide off','info');}
let dhikrCount=0;
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;playSound('click');}
function toggleMusicMode(){log('🎵 Music mode toggled','info');}

let matrixRunning=false,matrixAnim=null;
const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix(){const canvas=$('matrixCanvas');if(!canvas)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);canvas.classList.remove('active');return;}matrixRunning=true;canvas.classList.add('active');const ctx=canvas.getContext('2d');canvas.width=window.innerWidth;canvas.height=window.innerHeight;const cols=Math.floor(canvas.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){const ch=ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)];ctx.fillText(ch,i*16,drops[i]*16);if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoClickCount=0,logoClickTimer=null;
function initMatrixTrigger(){const logo=$('logoWrap');if(!logo)return;logo.style.cursor='pointer';logo.addEventListener('click',()=>{logoClickCount++;if(logoClickTimer)clearTimeout(logoClickTimer);if(logoClickCount>=3){logoClickCount=0;toggleMatrix();}else{logoClickTimer=setTimeout(()=>logoClickCount=0,500);}});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI CODE — RETRO!','success');}}else konamiIdx=0;});}

/* =======================================================================
   RADIO TELESCOPE — HYDROGEN LINE SIMULATION ENGINE
   ======================================================================= */

const H1_FREQ = 1420.405;  // MHz — hydrogen line
const BANDWIDTH = 4.0;     // MHz total bandwidth displayed
const NUM_BINS = 512;      // FFT bins
const C_LIGHT = 299792.458; // km/s

let simRunning = false;
let simInterval = null;
let animFrame = null;
let integrationSec = 0;
let spectrumData = new Float64Array(NUM_BINS);
let avgBuffer = [];
let gainVal = 20;
let avgVal = 5;

// Galaxy rotation curve data points (radius kpc, velocity km/s)
const ROTATION_DATA = [];

function freqForBin(i) {
  return (H1_FREQ - BANDWIDTH / 2) + (i / NUM_BINS) * BANDWIDTH;
}

function binForFreq(f) {
  return Math.round(((f - (H1_FREQ - BANDWIDTH / 2)) / BANDWIDTH) * NUM_BINS);
}

function gaussianNoise() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function generateSpectrum() {
  const data = new Float64Array(NUM_BINS);
  const noiseFloor = -80;

  for (let i = 0; i < NUM_BINS; i++) {
    data[i] = noiseFloor + gaussianNoise() * (3.0 / Math.sqrt(Math.max(1, avgVal)));
  }

  // Main hydrogen emission peak — slightly Doppler-shifted
  const dopplerShift = (Math.sin(Date.now() / 30000) * 0.15); // slow drift
  const peakCenter = binForFreq(H1_FREQ + dopplerShift);
  const peakWidth = 8 + Math.random() * 4;
  const peakHeight = gainVal * 0.8 + Math.random() * 5;

  for (let i = 0; i < NUM_BINS; i++) {
    const dist = (i - peakCenter) / peakWidth;
    data[i] += peakHeight * Math.exp(-0.5 * dist * dist);
  }

  // Secondary emission (distant arm, larger Doppler)
  const arm2Center = binForFreq(H1_FREQ - 0.3 + Math.sin(Date.now() / 50000) * 0.1);
  const arm2Width = 12;
  const arm2Height = gainVal * 0.3 + Math.random() * 3;
  for (let i = 0; i < NUM_BINS; i++) {
    const dist = (i - arm2Center) / arm2Width;
    data[i] += arm2Height * Math.exp(-0.5 * dist * dist);
  }

  // Absorption dip
  const absCenter = binForFreq(H1_FREQ + 0.5);
  const absWidth = 5;
  for (let i = 0; i < NUM_BINS; i++) {
    const dist = (i - absCenter) / absWidth;
    data[i] -= 4 * Math.exp(-0.5 * dist * dist);
  }

  return data;
}

function updateSpectrum() {
  const newData = generateSpectrum();
  avgBuffer.push(newData);
  if (avgBuffer.length > avgVal) avgBuffer.shift();

  // Average
  for (let i = 0; i < NUM_BINS; i++) {
    let sum = 0;
    for (let j = 0; j < avgBuffer.length; j++) sum += avgBuffer[j][i];
    spectrumData[i] = sum / avgBuffer.length;
  }

  integrationSec++;
  const itEl = $('integrationTime');
  if (itEl) itEl.innerHTML = `${integrationSec}s <span data-i18n="integration">${LANG[currentLang].integration}</span>`;

  // Find peak
  let peakVal = -Infinity, peakBin = 0;
  for (let i = 0; i < NUM_BINS; i++) {
    if (spectrumData[i] > peakVal) { peakVal = spectrumData[i]; peakBin = i; }
  }
  const peakF = freqForBin(peakBin);
  const doppler = ((peakF - H1_FREQ) / H1_FREQ) * C_LIGHT;

  // Noise floor estimate
  const sortedVals = [...spectrumData].sort((a, b) => a - b);
  const noiseEst = sortedVals[Math.floor(NUM_BINS * 0.25)];
  const snr = peakVal - noiseEst;

  const pp = $('peakPower'); if (pp) pp.textContent = peakVal.toFixed(1);
  const pf = $('peakFreq'); if (pf) pf.textContent = peakF.toFixed(3);
  const ds = $('dopplerShift'); if (ds) ds.textContent = doppler.toFixed(1);
  const sv = $('snrValue'); if (sv) sv.textContent = snr.toFixed(1);

  // Add rotation curve data point
  if (integrationSec % 5 === 0) {
    const radius = 3 + Math.random() * 12;
    const vel = 180 + 40 * Math.log(radius / 3) + (Math.random() - 0.5) * 20;
    ROTATION_DATA.push({ r: radius, v: vel });
    if (ROTATION_DATA.length > 50) ROTATION_DATA.shift();
  }

  if (integrationSec === 3) {
    log(LANG[currentLang].h1Detected, 'success');
  }
  if (integrationSec % 10 === 0) {
    log(`${LANG[currentLang].signalUpdate} — Peak: ${peakVal.toFixed(1)} dB @ ${peakF.toFixed(3)} MHz, Doppler: ${doppler.toFixed(1)} km/s`, 'rx');
  }
}

/* ======= SPECTRUM DRAWING ======= */
function drawSpectrum() {
  const canvas = $('spectrumCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = 'rgba(100,200,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 8; i++) {
    const x = (i / 8) * W;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let i = 0; i <= 5; i++) {
    const y = (i / 5) * H;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Frequency labels
  ctx.fillStyle = 'rgba(100,200,255,0.4)';
  ctx.font = '9px Orbitron, monospace';
  ctx.textAlign = 'center';
  for (let i = 0; i <= 8; i++) {
    const f = freqForBin(Math.floor((i / 8) * NUM_BINS));
    ctx.fillText(f.toFixed(2), (i / 8) * W, H - 4);
  }

  // H1 marker line
  const h1x = ((H1_FREQ - (H1_FREQ - BANDWIDTH / 2)) / BANDWIDTH) * W;
  ctx.strokeStyle = 'rgba(255,100,100,0.3)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(h1x, 0); ctx.lineTo(h1x, H); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255,100,100,0.5)';
  ctx.font = '8px Orbitron, monospace';
  ctx.fillText('1420.405', h1x, 12);

  // Spectrum line
  if (!simRunning && integrationSec === 0) return;

  const minDb = -90, maxDb = -30;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < NUM_BINS; i++) {
    const x = (i / NUM_BINS) * W;
    const y = H - ((spectrumData[i] - minDb) / (maxDb - minDb)) * (H - 25);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Fill under curve
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
  ctx.fillStyle = accent.replace(')', ',0.1)').replace('rgb', 'rgba');
  ctx.fill();

  // Info label
  ctx.fillStyle = 'rgba(100,200,255,0.4)';
  ctx.font = '10px Orbitron, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`RX: ${H1_FREQ.toFixed(3)} MHz | BW: ${BANDWIDTH} MHz | Bins: ${NUM_BINS}`, 8, 12);
}

/* ======= ROTATION CURVE DRAWING ======= */
function drawRotationCurve() {
  const canvas = $('rotationCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, W, H);

  // Axes
  ctx.strokeStyle = 'rgba(100,200,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(50, H - 30); ctx.lineTo(W - 10, H - 30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(50, 10); ctx.lineTo(50, H - 30); ctx.stroke();

  // Labels
  ctx.fillStyle = 'rgba(100,200,255,0.4)';
  ctx.font = '9px Orbitron, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Distance from center (kpc)', W / 2, H - 4);
  ctx.save();
  ctx.translate(12, H / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Velocity (km/s)', 0, 0);
  ctx.restore();

  // X axis ticks
  for (let r = 0; r <= 15; r += 3) {
    const x = 50 + (r / 15) * (W - 60);
    ctx.fillText(r.toString(), x, H - 18);
  }
  // Y axis ticks
  for (let v = 0; v <= 300; v += 50) {
    const y = H - 30 - (v / 300) * (H - 50);
    ctx.textAlign = 'right';
    ctx.fillText(v.toString(), 45, y + 3);
  }

  // Expected Keplerian curve (dashed)
  ctx.strokeStyle = 'rgba(255,100,100,0.3)';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let r = 1; r <= 15; r += 0.5) {
    const v = 220 * Math.sqrt(3 / r);
    const x = 50 + (r / 15) * (W - 60);
    const y = H - 30 - (Math.min(v, 300) / 300) * (H - 50);
    if (r === 1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Flat observed curve (theoretical)
  ctx.strokeStyle = 'rgba(100,200,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let r = 1; r <= 15; r += 0.5) {
    const v = 180 + 40 * Math.log(r / 3);
    const x = 50 + (r / 15) * (W - 60);
    const y = H - 30 - (Math.max(0, Math.min(v, 300)) / 300) * (H - 50);
    if (r === 1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Data points
  ROTATION_DATA.forEach(pt => {
    const x = 50 + (pt.r / 15) * (W - 60);
    const y = H - 30 - (Math.max(0, Math.min(pt.v, 300)) / 300) * (H - 50);
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
  });

  // Legend
  ctx.font = '8px Orbitron, monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,100,100,0.5)';
  ctx.fillText('--- Keplerian (no dark matter)', 60, 20);
  ctx.fillStyle = 'rgba(100,200,255,0.4)';
  ctx.fillText('--- Observed (flat = dark matter)', 60, 32);
  ctx.fillStyle = accent;
  ctx.fillText('● Measured data points', 60, 44);
}

function drawLoop() {
  if (!simRunning) return;
  drawSpectrum();
  drawRotationCurve();
  animFrame = requestAnimationFrame(drawLoop);
}

function startSim() {
  if (simRunning) return;
  simRunning = true;
  setStatus(true);
  log(LANG[currentLang].obsStarted, 'success');
  integrationSec = 0;
  avgBuffer = [];
  ROTATION_DATA.length = 0;
  simInterval = setInterval(updateSpectrum, 1000);
  drawLoop();
}

function stopSim() {
  if (!simRunning) return;
  simRunning = false;
  setStatus(false);
  if (simInterval) { clearInterval(simInterval); simInterval = null; }
  if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
  log(LANG[currentLang].obsStopped, 'info');
}

/* ======= INIT ======= */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;

  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();

  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;
  initLogResize();

  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}

  const whisperBtn=$('whisperBtn');if(whisperBtn)whisperBtn.onclick=toggleWhisper;
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};
  if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  const musicBtn=$('musicBtn');if(musicBtn)musicBtn.onclick=toggleMusicMode;

  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});

  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sL=localStorage.getItem('wdiy-lang'),sT=localStorage.getItem('wdiy-theme');if(sT)setTheme(sT);if(sL)setLanguage(sL);}catch{}

  initKonami();
  initMatrixTrigger();
  initHijriDate();

  // App-specific
  const startBtn=$('startBtn'),stopBtn=$('stopBtn');
  if(startBtn)startBtn.onclick=startSim;
  if(stopBtn)stopBtn.onclick=stopSim;

  const gainSlider=$('gainSlider');
  if(gainSlider)gainSlider.addEventListener('input',()=>{gainVal=parseInt(gainSlider.value);});
  const avgSlider=$('avgSlider');
  if(avgSlider)avgSlider.addEventListener('input',()=>{avgVal=parseInt(avgSlider.value);});

  // Initial draw
  drawSpectrum();
  drawRotationCurve();

  log(LANG[currentLang].ready,'success');
}

document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
