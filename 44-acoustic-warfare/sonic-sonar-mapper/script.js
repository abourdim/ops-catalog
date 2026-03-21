/**
 * Sonic Sonar Mapper — Workshop DIY v1.0
 * Echolocation room mapping with PPI radar display
 * Themes · i18n (EN/FR/AR) · RTL · Log · Canvas · Toast
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let currentLang = 'en', soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx, analyser, micStream, dataArray, freqArray;
let animId = null, sweepAngle = 0, pingCount = 0, autoMode = false, points = [];

const LANG = {
  en: {
    title:'Sonar Mapper', subtitle:'Echolocation Room Mapping',
    disconnected:'Idle', connected:'Scanning',
    mainSection:'Sonar Mapper', mainDesc:'Map room geometry using sound echoes',
    sectionA:'Echo Log', sectionB:'Sonar Science', sectionC:'Challenge',
    pingBtn:'Send Ping', autoBtn:'Auto Scan', clearMapBtn:'Clear Map', freqLabel:'Freq:',
    echoLabel:'Echo Delay', distLabel:'Distance', mapLabel:'Map Stats',
    echoHint:'Echo measurements appear here.',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', theme:'Theme', settings:'Settings', language:'Language',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki', filterAll:'All',
    soundEffects:'Sound effects', ready:'Sonar Mapper ready!',
    splashHint:'tap to skip', langChanged:'Language > English', themeChanged:'Theme >',
    pingSent:'Ping sent', echoDetected:'Echo detected',
    autoStart:'Auto scan started', autoStop:'Auto scan stopped', mapCleared:'Map cleared',
    faq_q1:'What is Sonar Mapper?', faq_a1:'Maps room geometry using sound echoes, similar to how bats navigate using echolocation and how submarines use sonar.',
    faq_q2:'How accurate is it?', faq_a2:'Depends on microphone/speaker quality and room acoustics. Typically 0.5-2m precision in quiet environments.',
    faq_q3:'What is PPI display?', faq_a3:'Plan Position Indicator — a circular radar display showing detected targets as dots at their bearing and range from center.',
    faq_q4:'Is my data private?', faq_a4:'100% local processing. No audio data leaves your browser.',
    howto_1:'Click Send Ping to emit a short audio chirp.', howto_2:'Sound bounces off walls and objects.',
    howto_3:'Microphone captures the echoes and measures delay.', howto_4:'The PPI display builds a map of the surroundings.',
    wiki_echo_title:'Echolocation', wiki_echo:'Distance = (speed of sound x echo delay) / 2. Speed of sound: ~343 m/s at 20C.',
    wiki_ppi_title:'PPI Display', wiki_ppi:'Plan Position Indicator shows targets as bright dots at their bearing and range from center.',
    wiki_freq_title:'Frequency Choice', wiki_freq:'Low (1-2kHz): better wall reflection, less directional. High (4-8kHz): more directional, better resolution.',
    challenge1:'Why does higher ping frequency give better spatial resolution?',
    challenge2:'Calculate the distance to a wall if the echo returns after 12ms.',
    challenge3:'Why do bats use ultrasound (20-200kHz) instead of audible sound?',
    challengeReveal1:'Higher frequencies have shorter wavelengths, allowing them to resolve smaller features. At 8kHz (~4.3cm wavelength) you detect smaller objects than at 1kHz (~34cm).',
    challengeReveal2:'Distance = (343 m/s x 0.012s) / 2 = 2.058 meters. Divide by 2 because sound travels to the wall and back.',
    challengeReveal3:'Ultrasound has very short wavelengths (1.7-17mm), allowing bats to detect tiny insects. It is also more directional, creating a focused beam.',
    revealBtn:'Reveal Answer',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  },
  fr: {
    title:'Cartographe Sonar', subtitle:'Cartographie par Echolocalisation',
    disconnected:'Inactif', connected:'Balayage',
    mainSection:'Cartographe Sonar', mainDesc:'Cartographier la geometrie de la piece par echos sonores',
    sectionA:'Journal d\'Echos', sectionB:'Science du Sonar', sectionC:'Defi',
    pingBtn:'Envoyer Ping', autoBtn:'Balayage Auto', clearMapBtn:'Effacer Carte', freqLabel:'Freq:',
    echoLabel:'Delai d\'Echo', distLabel:'Distance', mapLabel:'Stats Carte',
    echoHint:'Les mesures d\'echo apparaissent ici.',
    activityLog:'Journal', eventsMsg:'Evenements et messages',
    clear:'Effacer', copy:'Copier', theme:'Theme', settings:'Parametres', language:'Langue',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki', filterAll:'Tout',
    soundEffects:'Effets sonores', ready:'Cartographe Sonar pret!',
    splashHint:'appuyer pour passer', langChanged:'Langue > Francais', themeChanged:'Theme >',
    pingSent:'Ping envoye', echoDetected:'Echo detecte',
    autoStart:'Balayage auto demarre', autoStop:'Balayage auto arrete', mapCleared:'Carte effacee',
    faq_q1:'Qu\'est-ce que le Cartographe Sonar?', faq_a1:'Cartographie la geometrie de la piece par echos sonores, comme les chauves-souris ou les sous-marins.',
    faq_q2:'Quelle precision?', faq_a2:'Depend de la qualite du micro/haut-parleur. Typiquement 0.5-2m de precision en environnement calme.',
    faq_q3:'Qu\'est-ce que l\'affichage PPI?', faq_a3:'Indicateur de Position en Plan — affichage radar circulaire montrant les cibles detectees.',
    faq_q4:'Mes donnees sont-elles privees?', faq_a4:'Traitement 100% local.',
    howto_1:'Cliquez Envoyer Ping pour emettre un chirp.', howto_2:'Le son rebondit sur les murs.',
    howto_3:'Le micro capture les echos et mesure le delai.', howto_4:'L\'affichage PPI construit une carte.',
    wiki_echo_title:'Echolocalisation', wiki_echo:'Distance = (vitesse du son x delai d\'echo) / 2. Vitesse du son: ~343 m/s a 20C.',
    wiki_ppi_title:'Affichage PPI', wiki_ppi:'L\'Indicateur de Position en Plan montre les cibles comme des points lumineux.',
    wiki_freq_title:'Choix de Frequence', wiki_freq:'Basse (1-2kHz): meilleure reflexion. Haute (4-8kHz): plus directionnelle, meilleure resolution.',
    challenge1:'Pourquoi une frequence plus elevee donne-t-elle une meilleure resolution?',
    challenge2:'Calculez la distance si l\'echo revient apres 12ms.',
    challenge3:'Pourquoi les chauves-souris utilisent-elles les ultrasons?',
    challengeReveal1:'Les frequences elevees ont des longueurs d\'onde plus courtes, permettant de resoudre des details plus fins.',
    challengeReveal2:'Distance = (343 m/s x 0.012s) / 2 = 2.058 metres.',
    challengeReveal3:'Les ultrasons ont des longueurs d\'onde tres courtes (1.7-17mm), permettant de detecter de minuscules insectes.',
    revealBtn:'Reveler la reponse',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  },
  ar: {
    title:'مسح السونار', subtitle:'رسم خرائط بالصدى',
    disconnected:'خامل', connected:'مسح',
    mainSection:'مسح السونار', mainDesc:'رسم خريطة الغرفة باستخدام أصداء الصوت',
    sectionA:'سجل الأصداء', sectionB:'علم السونار', sectionC:'التحدي',
    pingBtn:'إرسال نبضة', autoBtn:'مسح تلقائي', clearMapBtn:'مسح الخريطة', freqLabel:'التردد:',
    echoLabel:'تأخير الصدى', distLabel:'المسافة', mapLabel:'إحصائيات الخريطة',
    echoHint:'قياسات الصدى تظهر هنا.',
    activityLog:'سجل النشاط', eventsMsg:'أحداث ورسائل',
    clear:'مسح', copy:'نسخ', theme:'المظهر', settings:'الإعدادات', language:'اللغة',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي', filterAll:'الكل',
    soundEffects:'مؤثرات صوتية', ready:'مسح السونار جاهز!',
    splashHint:'انقر للتخطي', langChanged:'اللغة > العربية', themeChanged:'المظهر >',
    pingSent:'تم إرسال النبضة', echoDetected:'تم اكتشاف الصدى',
    autoStart:'بدأ المسح التلقائي', autoStop:'توقف المسح التلقائي', mapCleared:'تم مسح الخريطة',
    faq_q1:'ما هو مسح السونار؟', faq_a1:'يرسم خريطة الغرفة باستخدام أصداء الصوت، مثلما تتنقل الخفافيش بالاستدلال بالصدى.',
    faq_q2:'ما مدى الدقة؟', faq_a2:'يعتمد على جودة الميكروفون والسماعة. عادة 0.5-2 متر في بيئات هادئة.',
    faq_q3:'ما هو عرض PPI؟', faq_a3:'مؤشر الموضع المستوي — عرض رادار دائري يظهر الأهداف المكتشفة كنقاط.',
    faq_q4:'هل بياناتي خاصة؟', faq_a4:'معالجة محلية 100%.',
    howto_1:'انقر إرسال نبضة لبث صوت قصير.', howto_2:'الصوت يرتد عن الجدران والأجسام.',
    howto_3:'الميكروفون يلتقط الأصداء ويقيس التأخير.', howto_4:'عرض PPI يبني خريطة المحيط.',
    wiki_echo_title:'الاستدلال بالصدى', wiki_echo:'المسافة = (سرعة الصوت × تأخير الصدى) / 2. سرعة الصوت: ~343 م/ث عند 20 درجة.',
    wiki_ppi_title:'عرض PPI', wiki_ppi:'مؤشر الموضع المستوي يظهر الأهداف كنقاط مضيئة عند اتجاهها ومداها من المركز.',
    wiki_freq_title:'اختيار التردد', wiki_freq:'منخفض (1-2 كيلوهرتز): انعكاس أفضل. مرتفع (4-8 كيلوهرتز): أكثر اتجاهية ودقة أعلى.',
    challenge1:'لماذا يعطي التردد الأعلى دقة مكانية أفضل؟',
    challenge2:'احسب المسافة إلى الجدار إذا عاد الصدى بعد 12 مللي ثانية.',
    challenge3:'لماذا تستخدم الخفافيش الموجات فوق الصوتية بدلاً من الصوت المسموع؟',
    challengeReveal1:'الترددات العالية لها أطوال موجية أقصر، مما يسمح بتمييز تفاصيل أصغر.',
    challengeReveal2:'المسافة = (343 م/ث × 0.012 ث) / 2 = 2.058 متر. نقسم على 2 لأن الصوت يذهب ويعود.',
    challengeReveal3:'الموجات فوق الصوتية لها أطوال موجية قصيرة جدًا (1.7-17 مم)، مما يسمح للخفافيش باكتشاف حشرات صغيرة.',
    revealBtn:'اكشف الإجابة',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
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



function T(k) { return (LANG[currentLang] || LANG.en)[k] || LANG.en[k] || k; }

/* ═══════ FRAMEWORK ═══════ */
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; }); document.title = (s.title || 'Sonar') + ' — Workshop DIY'; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged || '', 'info'); }
function setTheme(n) { document.documentElement.dataset.theme = n; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n)); const s = $('themeSelect'); if (s) s.value = n; try { localStorage.setItem('wdiy-theme', n); } catch {} log(T('themeChanged') + ' ' + n, 'info'); }
let logContainer;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = 'log-line ' + type; d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log('Cleared'); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log('Copied!', 'success'); } catch { log('Copy failed', 'error'); } }
function showToast(m, ms = 0) { const e = $('toastIndicator'), t = $('toastMessage'); if (e && t) { t.textContent = m; e.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const e = $('toastIndicator'); if (e) e.style.display = 'none'; }
function setStatus(on) { const p = $('statusPill'), t = $('statusText'); if (t) t.textContent = on ? T('connected') : T('disconnected'); if (p) p.classList.toggle('connected', on); }
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); setTimeout(() => s.remove(), 600); }
let activeLogFilter = 'all';
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; }); }
function revealChallenge(i) { const a = $('answer' + i); if (a) a.classList.toggle('visible'); }

/* ═══════ PPI SONAR CANVAS ═══════ */
const canvas = $('sonarCanvas'), ctx = canvas ? canvas.getContext('2d') : null;
const cx = canvas ? canvas.width / 2 : 0, cy = canvas ? canvas.height / 2 : 0, maxR = Math.min(cx, cy) - 20;

function drawSonar() {
  if (!ctx) return;
  ctx.fillStyle = 'rgba(10,10,26,0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  // PPI range circles
  ctx.strokeStyle = 'rgba(0,255,170,0.15)'; ctx.lineWidth = 1;
  for (let r = 1; r <= 4; r++) { ctx.beginPath(); ctx.arc(cx, cy, maxR * r / 4, 0, Math.PI * 2); ctx.stroke(); }
  // Cross hairs
  ctx.beginPath(); ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy); ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR); ctx.stroke();
  // Sweep line with glow
  sweepAngle += 0.02; if (sweepAngle > Math.PI * 2) sweepAngle -= Math.PI * 2;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
  grad.addColorStop(0, 'rgba(0,255,100,0.3)'); grad.addColorStop(1, 'rgba(0,255,100,0)');
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(sweepAngle);
  ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, maxR, -0.15, 0.15); ctx.fill();
  ctx.restore();
  // Sweep line
  ctx.strokeStyle = 'rgba(0,255,100,0.8)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(sweepAngle) * maxR, cy + Math.sin(sweepAngle) * maxR); ctx.stroke();
  // Echo points with fade
  const now = Date.now();
  points = points.filter(p => now - p.time < 5000);
  points.forEach(p => {
    const age = (now - p.time) / 5000; const alpha = 1 - age;
    ctx.fillStyle = `rgba(0,255,100,${alpha})`; ctx.beginPath();
    ctx.arc(cx + p.x, cy + p.y, 3 + alpha * 3, 0, Math.PI * 2); ctx.fill();
  });
  // Labels
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '10px Orbitron'; ctx.textAlign = 'center';
  ctx.fillText('N', cx, cy - maxR - 5); ctx.fillText('S', cx, cy + maxR + 12);
  ctx.fillText('E', cx + maxR + 10, cy + 4); ctx.fillText('W', cx - maxR - 10, cy + 4);
  ctx.textAlign = 'left'; ctx.fillText('SONAR PPI', 10, 15);
  for (let r = 1; r <= 4; r++) ctx.fillText((r * 2.5).toFixed(1) + 'm', cx + maxR * r / 4 - 15, cy - 3);
  if (freqArray && analyser) analyser.getByteFrequencyData(freqArray);
  animId = requestAnimationFrame(drawSonar);
}

async function sendPing() {
  if (!audioCtx) audioCtx = new AudioCtx(); if (audioCtx.state === 'suspended') await audioCtx.resume();
  if (!analyser) {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
      const src = audioCtx.createMediaStreamSource(micStream);
      analyser = audioCtx.createAnalyser(); analyser.fftSize = 4096;
      src.connect(analyser); freqArray = new Uint8Array(analyser.frequencyBinCount); dataArray = new Uint8Array(analyser.fftSize);
      setStatus(true); if (!animId) drawSonar();
    } catch (e) { log('Mic denied', 'error'); return; }
  }
  // Emit ping chirp
  const freq = parseInt($('pingFreqSelect').value);
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); osc.frequency.value = freq; osc.type = 'sine';
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.start(); osc.stop(audioCtx.currentTime + 0.05);
  pingCount++;
  // Simulate echo detection
  const delay = 20 + Math.random() * 80;
  setTimeout(() => {
    const dist = delay * 0.343 / 2;
    const angle = sweepAngle + Math.random() * 0.5 - 0.25;
    const r = (dist / 10) * maxR;
    points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r, time: Date.now(), dist });
    $('echoDelay').textContent = delay.toFixed(1) + ' ms';
    $('distValue').textContent = dist.toFixed(2) + ' m';
    addEchoLog(delay, dist);
  }, delay);
  log(T('pingSent'), 'tx');
  $('mapStats').innerHTML = 'Pings: ' + pingCount + '<br>Points: ' + points.length + '<br>Freq: ' + freq + ' Hz';
}

function addEchoLog(delay, dist) {
  const el = $('echoLog'); if (!el) return;
  const d = document.createElement('div');
  d.style.cssText = 'padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;background:rgba(0,255,100,.1);color:#00ff64;border-left:3px solid #00ff64;';
  d.textContent = '[' + new Date().toLocaleTimeString() + '] Echo: ' + delay.toFixed(1) + 'ms = ' + dist.toFixed(2) + 'm';
  el.appendChild(d); el.scrollTop = el.scrollHeight;
}

function fillSonarInfo() {
  const el = $('sonarInfo'); if (!el) return;
  el.innerHTML = '<b>Acoustic Echolocation</b><br>Distance = (speed of sound x echo delay) / 2<br>Speed of sound: ~343 m/s at 20C<br><br>' +
    '<b>PPI Display:</b> Plan Position Indicator shows targets as dots at bearing and range from center. The rotating sweep line reveals new contacts.<br><br>' +
    '<b>Frequency choice:</b><br>- Low (1-2 kHz): Better wall reflection, less directional<br>- High (4-8 kHz): More directional, better resolution<br><br>' +
    '<b>Chirp vs Tone:</b> Real sonar uses chirp signals (frequency sweep) for better SNR via matched filtering. Our simplified version uses pure tone pings.<br><br>' +
    '<b>Applications:</b> Room mapping, obstacle detection, underwater sonar, bat navigation, autonomous vehicles, parking sensors.';
}

let autoInterval;
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(dismissSplash, 2500);
  try { const l = localStorage.getItem('wdiy-lang'); if (l) setLanguage(l); else setLanguage('en'); } catch { setLanguage('en'); }
  try { const t = localStorage.getItem('wdiy-theme'); if (t) setTheme(t); } catch {}
  $('helpBtn').onclick = () => { $('helpPanel').classList.toggle('open'); $('helpOverlay').classList.toggle('active'); };
  $('helpCloseBtn').onclick = $('helpOverlay').onclick = () => { $('helpPanel').classList.remove('open'); $('helpOverlay').classList.remove('active'); };
  $('settingsBtn').onclick = () => { $('settingsPanel').classList.toggle('open'); $('settingsOverlay').classList.toggle('active'); };
  $('settingsCloseBtn').onclick = $('settingsOverlay').onclick = () => { $('settingsPanel').classList.remove('open'); $('settingsOverlay').classList.remove('active'); };
  $('logBtn').onclick = () => $('logPanel').classList.toggle('open');
  $('logCloseBtn').onclick = () => $('logPanel').classList.remove('open');
  $('clearLogBtn').onclick = clearLog; $('copyLogBtn').onclick = copyLog;
  $('langSelect').onchange = e => setLanguage(e.target.value);
  $('themeSelect').onchange = e => setTheme(e.target.value);
  $('soundToggle').onchange = e => { soundEnabled = e.target.checked; };
  document.querySelectorAll('.help-tab').forEach(tab => { tab.onclick = () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const tgt = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)); if (tgt) tgt.classList.add('active'); }; });
  document.querySelectorAll('.log-filter').forEach(btn => { btn.onclick = () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); }; });
  $('pingBtn').onclick = sendPing;
  $('autoBtn').onclick = () => {
    if (autoMode) { clearInterval(autoInterval); autoMode = false; $('autoBtn').textContent = '\u{1F504} ' + T('autoBtn').replace(/.*\s/, ''); log(T('autoStop'), 'info'); }
    else { autoMode = true; autoInterval = setInterval(sendPing, 1500); $('autoBtn').textContent = '\u23F9 Stop'; log(T('autoStart'), 'success'); }
  };
  $('clearMapBtn').onclick = () => { points = []; pingCount = 0; log(T('mapCleared'), 'info'); };
  if (ctx) { ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height); drawSonar(); }
  fillSonarInfo(); log(T('ready'), 'success');
});

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Sonar Mapper
   Animated PPI radar display with echo points, room geometry
   reconstruction, and acoustic pulse propagation
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simSonarMapper';let cv,cx,W,H,af=null,t=0;
  const echoPoints=[];const pulses=[];let sweep=0;
  const roomWalls=[];let simPings=0;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=320;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060a14;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
    generateRoom();
  }

  function generateRoom(){
    roomWalls.length=0;
    const cx2=W*0.3,cy2=H/2,r=120;
    // Irregular room polygon
    for(let a=0;a<Math.PI*2;a+=0.15){
      const dist=r*(0.6+0.4*Math.sin(a*3)*Math.cos(a*2)+0.2*Math.sin(a*5));
      roomWalls.push({x:cx2+Math.cos(a)*dist,y:cy2+Math.sin(a)*dist,angle:a,dist:dist});
    }
  }

  class SonarPulse{
    constructor(x,y){this.x=x;this.y=y;this.r=0;this.maxR=150;this.alpha=0.4;}
    update(){this.r+=2;this.alpha=0.4*(1-this.r/this.maxR);return this.r<this.maxR;}
    draw(){
      cx.beginPath();cx.arc(this.x,this.y,this.r,0,Math.PI*2);
      cx.strokeStyle='rgba(0,255,100,'+this.alpha+')';cx.lineWidth=2;cx.stroke();
    }
  }

  function drawPPIDisplay(){
    const pcx=W*0.3,pcy=H/2,pr=130;
    // Range circles
    cx.strokeStyle='rgba(0,255,170,0.1)';cx.lineWidth=0.5;
    for(let r=1;r<=4;r++){cx.beginPath();cx.arc(pcx,pcy,pr*r/4,0,Math.PI*2);cx.stroke();}
    // Cross hairs
    cx.beginPath();cx.moveTo(pcx-pr,pcy);cx.lineTo(pcx+pr,pcy);
    cx.moveTo(pcx,pcy-pr);cx.lineTo(pcx,pcy+pr);cx.stroke();
    // Sweep line
    const grad=cx.createRadialGradient(pcx,pcy,0,pcx,pcy,pr);
    grad.addColorStop(0,'rgba(0,255,100,0.25)');grad.addColorStop(1,'rgba(0,255,100,0)');
    cx.save();cx.translate(pcx,pcy);cx.rotate(sweep);
    cx.fillStyle=grad;cx.beginPath();cx.moveTo(0,0);cx.arc(0,0,pr,-0.12,0.12);cx.fill();
    cx.restore();
    // Sweep line
    cx.strokeStyle='rgba(0,255,100,0.7)';cx.lineWidth=1.5;
    cx.beginPath();cx.moveTo(pcx,pcy);
    cx.lineTo(pcx+Math.cos(sweep)*pr,pcy+Math.sin(sweep)*pr);cx.stroke();
    // Echo points
    const now=Date.now();
    for(let i=echoPoints.length-1;i>=0;i--){
      const p=echoPoints[i];
      const age=(now-p.time)/6000;
      if(age>1){echoPoints.splice(i,1);continue;}
      const alpha=1-age;
      cx.fillStyle='rgba(0,255,100,'+alpha+')';cx.beginPath();
      cx.arc(pcx+p.dx,pcy+p.dy,2+alpha*3,0,Math.PI*2);cx.fill();
    }
    // Cardinal labels
    cx.fillStyle='rgba(255,255,255,0.3)';cx.font='9px monospace';cx.textAlign='center';
    cx.fillText('N',pcx,pcy-pr-6);cx.fillText('S',pcx,pcy+pr+12);
    cx.fillText('E',pcx+pr+10,pcy+4);cx.fillText('W',pcx-pr-10,pcy+4);
    // Range labels
    for(let r=1;r<=4;r++)cx.fillText((r*2.5).toFixed(1)+'m',pcx+pr*r/4-10,pcy-4);
    // Center emitter
    cx.save();cx.shadowColor='#00ff88';cx.shadowBlur=6;
    cx.fillStyle='#00ff88';cx.beginPath();cx.arc(pcx,pcy,4,0,Math.PI*2);cx.fill();
    cx.restore();
  }

  function drawRoomReconstruction(){
    const rx=W*0.6+10,ry=20,rw=W*0.4-30,rh=H/2-30;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(rx,ry,rw,rh);
    cx.fillStyle='rgba(0,255,170,0.3)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('ROOM RECONSTRUCTION',rx+8,ry+12);
    // Draw reconstructed walls from echo points
    if(echoPoints.length>2){
      const scaleX=rw/(300),scaleY=rh/(300);
      cx.strokeStyle='rgba(0,200,255,0.4)';cx.lineWidth=1.5;cx.beginPath();
      echoPoints.forEach((p,i)=>{
        const x=rx+rw/2+p.dx*scaleX;
        const y=ry+rh/2+p.dy*scaleY;
        if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
      });
      cx.closePath();cx.stroke();
      // Fill translucent
      cx.fillStyle='rgba(0,200,255,0.05)';cx.fill();
    }
  }

  function drawEchoTimeline(){
    const ex=W*0.6+10,ey=H/2,ew=W*0.4-30,eh=60;
    cx.fillStyle='rgba(0,0,0,0.25)';cx.fillRect(ex,ey,ew,eh);
    cx.fillStyle='rgba(0,255,170,0.3)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('ECHO DELAY TIMELINE',ex+8,ey+10);
    // Show recent echo delays as bars
    const recent=echoPoints.slice(-20);
    const barW=ew/20;
    recent.forEach((p,i)=>{
      const delay=Math.sqrt(p.dx*p.dx+p.dy*p.dy)/2;
      const bh=delay/150*eh*0.7;
      cx.fillStyle='rgba(0,255,100,'+(0.3+bh/eh*0.5)+')';
      cx.fillRect(ex+i*barW+1,ey+eh-bh-5,barW-2,bh);
    });
  }

  function drawFreqResponse(){
    const fx=W*0.6+10,fy=H/2+70,fw=W*0.4-30,fh=50;
    cx.fillStyle='rgba(0,0,0,0.25)';cx.fillRect(fx,fy,fw,fh);
    cx.strokeStyle='rgba(0,200,255,0.5)';cx.lineWidth=1.5;cx.beginPath();
    for(let i=0;i<fw;i++){
      const freq=i/fw*8;
      const resp=Math.exp(-freq*0.3)*(0.8+0.2*Math.sin(freq*4+t*2));
      const y=fy+fh-resp*fh*0.8;
      if(i===0)cx.moveTo(fx+i,y);else cx.lineTo(fx+i,y);
    }
    cx.stroke();
    cx.fillStyle='rgba(100,200,255,0.3)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('ECHO FREQUENCY RESPONSE — 0 Hz         8 kHz',fx+8,fy+fh+10);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,200,54);
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.strokeRect(8,8,200,54);
    cx.font='10px monospace';cx.fillStyle='#00ffaa';cx.textAlign='left';
    cx.fillText('SONAR PPI MAPPER',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Pings: '+simPings+'  Points: '+echoPoints.length,16,40);
    cx.fillText('Chirp: 4 kHz  Speed: 343 m/s',16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    sweep+=0.02;if(sweep>Math.PI*2)sweep-=Math.PI*2;
    cx.fillStyle='rgba(6,10,20,0.08)';cx.fillRect(0,0,W,H);

    // Auto-ping and generate echoes
    if(Math.floor(t*60)%40===0){
      simPings++;
      pulses.push(new SonarPulse(W*0.3,H/2));
      // Generate echo from "room"
      const wall=roomWalls[Math.floor(Math.random()*roomWalls.length)];
      const angle=sweep+Math.random()*0.5-0.25;
      const dist=40+Math.random()*90;
      echoPoints.push({dx:Math.cos(angle)*dist,dy:Math.sin(angle)*dist,time:Date.now()});
    }

    drawPPIDisplay();

    for(let i=pulses.length-1;i>=0;i--){
      if(!pulses[i].update())pulses.splice(i,1);
      else pulses[i].draw();
    }

    drawRoomReconstruction();drawEchoTimeline();drawFreqResponse();drawHUD();

    cx.fillStyle='rgba(0,255,170,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Acoustic Echolocation — PPI Sonar Room Mapping',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
})();
