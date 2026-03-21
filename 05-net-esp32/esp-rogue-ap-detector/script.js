/**
 * Workshop DIY — esp-rogue-ap-detector v1.0
 * Evil Twin WiFi AP Detector — Fingerprint & Compare
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.139885 78.322945 253.991455 136.254120"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668z"/><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}

const LANG={
  en:{
    title:'esp-rogue-ap-detector',subtitle:'🔍 scan · 🔬 fingerprint · 🚨 detect',
    disconnected:'Disconnected',connected:'Connected',
    mainSection:'Rogue AP Detector — Evil Twin Finder',mainDesc:'Fingerprint WiFi APs and detect evil twins',
    sectionA:'How It Works',sectionB:'Comparison Lab',sectionC:'Challenge',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
    settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    scanBtn:'Scan APs',injectBtn:'Inject Evil Twin',compareBtn:'Compare',statusCol:'Status',
    alertMsg:'ROGUE AP DETECTED! Evil twin found — do NOT connect!',
    compareDesc:'Click Compare after scanning to see side-by-side fingerprint analysis.',
    howStep1:'ESP32 scans all WiFi channels and records AP fingerprints (BSSID, SSID, channel, encryption).',
    howStep2:'Fingerprints are stored in a known-good database for comparison.',
    howStep3:'On each scan, new APs are compared against the database for mismatches.',
    howStep4:'If an AP shares the SSID but has a different BSSID or channel, it is flagged as a rogue.',
    challenge1:'How does an evil twin attack work?',challenge2:'Why can\'t you rely on SSID alone?',challenge3:'What additional checks could detect a rogue AP?',
    challengeReveal1:'An attacker creates an AP with the same SSID as a legitimate one. Victims connect to the fake AP, allowing the attacker to intercept all traffic.',
    challengeReveal2:'SSIDs are just names — anyone can create an AP with any name. The BSSID (MAC) is harder to spoof but still possible.',
    challengeReveal3:'Check beacon interval timing, probe response patterns, supported rates, vendor OUI, certificate validation, and physical signal direction.',
    revealBtn:'Reveal Answer',
    faq_q1:'What is an evil twin?',faq_a1:'A rogue AP that copies a legitimate network\'s SSID to trick users into connecting.',
    faq_q2:'What is BSSID?',faq_a2:'The MAC address of the AP\'s radio. Each AP has a unique BSSID.',
    faq_q3:'Can evil twins be detected?',faq_a3:'Yes, by comparing fingerprints: BSSID, channel, encryption type, beacon intervals.',
    faq_q4:'Is this a real scanner?',faq_a4:'No. This is a simulation for educational purposes.',
    howto_1:'Click Scan APs to discover nearby access points.',
    howto_2:'Click Inject Evil Twin to simulate a rogue AP attack.',
    howto_3:'Click Compare to see fingerprint differences side by side.',
    howto_4:'Watch for the red alert when a mismatch is detected.',
    wiki_evil_title:'👿 Evil Twin Attack',wiki_evil:'Attacker creates fake AP with same SSID. Victims connect and all traffic is intercepted.',
    wiki_fp_title:'🔬 AP Fingerprinting',wiki_fp:'Collecting BSSID, SSID, channel, encryption to uniquely identify an AP.',
    wiki_detect_title:'🚨 Detection Methods',wiki_detect:'Compare fingerprints against known-good database. Flag BSSID or channel mismatches.',
    wiki_protect_title:'🛡️ Protection',wiki_protect:'Use WPA-Enterprise with certificates, verify fingerprints, use VPN.',
    working:'Working…',scanning:'Scanning WiFi channels...',
    apFound:'APs found',rogueFound:'ROGUE AP detected!',noRogue:'All APs verified — no rogues.',injected:'Evil twin injected!',
    safe:'SAFE',rogue:'ROGUE',known:'Known',unknown:'New',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
    ready:'🔍 Rogue AP Detector ready — scan to fingerprint networks!',
    logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
    splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
  },
  fr:{
    title:'esp-rogue-ap-detector',subtitle:'🔍 scanner · 🔬 empreinte · 🚨 détecter',
    disconnected:'Déconnecté',connected:'Connecté',
    mainSection:'Détecteur AP Rogue — Chasseur de Jumeaux',mainDesc:'Empreinte des AP WiFi et détection de jumeaux maléfiques',
    sectionA:'Comment ça marche',sectionB:'Labo Comparaison',sectionC:'Défi',
    activityLog:'Journal',eventsMsg:'Événements et messages',
    clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
    settings:'⚙️ Paramètres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    scanBtn:'Scanner les AP',injectBtn:'Injecter Jumeau',compareBtn:'Comparer',statusCol:'Statut',
    alertMsg:'AP ROGUE DÉTECTÉ ! Jumeau maléfique trouvé — NE PAS se connecter !',
    compareDesc:'Cliquez Comparer après le scan pour l\'analyse côte à côte.',
    howStep1:'L\'ESP32 scanne tous les canaux WiFi et enregistre les empreintes.',
    howStep2:'Les empreintes sont stockées dans une base de référence.',
    howStep3:'À chaque scan, les AP sont comparés à la base pour détecter les différences.',
    howStep4:'Si un AP partage le SSID mais a un BSSID ou canal différent, il est marqué rogue.',
    challenge1:'Comment fonctionne une attaque jumeau maléfique ?',challenge2:'Pourquoi ne pas se fier au SSID seul ?',challenge3:'Quelles vérifications supplémentaires ?',
    challengeReveal1:'L\'attaquant crée un AP avec le même SSID. Les victimes se connectent au faux AP.',
    challengeReveal2:'Les SSID sont des noms — n\'importe qui peut en créer. Le BSSID est plus dur à usurper.',
    challengeReveal3:'Vérifier l\'intervalle beacon, les réponses probe, les taux supportés, l\'OUI du vendeur.',
    revealBtn:'Révéler',
    faq_q1:'Qu\'est-ce qu\'un jumeau maléfique ?',faq_a1:'Un AP rogue qui copie le SSID d\'un réseau légitime.',
    faq_q2:'Qu\'est-ce que le BSSID ?',faq_a2:'L\'adresse MAC de la radio de l\'AP.',
    faq_q3:'Peut-on détecter les jumeaux ?',faq_a3:'Oui, en comparant les empreintes.',
    faq_q4:'Est-ce un vrai scanner ?',faq_a4:'Non. C\'est une simulation.',
    howto_1:'Cliquez Scanner les AP.',howto_2:'Cliquez Injecter Jumeau pour simuler.',howto_3:'Cliquez Comparer pour l\'analyse.',howto_4:'Surveillez l\'alerte rouge.',
    wiki_evil_title:'👿 Attaque Jumeau',wiki_evil:'L\'attaquant crée un faux AP avec le même SSID.',
    wiki_fp_title:'🔬 Empreinte AP',wiki_fp:'Collecte BSSID, SSID, canal, chiffrement.',
    wiki_detect_title:'🚨 Détection',wiki_detect:'Comparer les empreintes à la base.',
    wiki_protect_title:'🛡️ Protection',wiki_protect:'WPA-Enterprise, certificats, VPN.',
    working:'En cours…',scanning:'Scan des canaux WiFi...',
    apFound:'AP trouvés',rogueFound:'AP ROGUE détecté !',noRogue:'Tous les AP vérifiés.',injected:'Jumeau injecté !',
    safe:'SÛR',rogue:'ROGUE',known:'Connu',unknown:'Nouveau',
    t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
    ready:'🔍 Détecteur prêt — scannez les réseaux !',
    logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
    soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Réactif musique',
    splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',
  },
  ar:{
    title:'esp-rogue-ap-detector',subtitle:'🔍 مسح · 🔬 بصمة · 🚨 كشف',
    disconnected:'غير متصل',connected:'متصل',
    mainSection:'كاشف AP المزيف — مكتشف التوأم الشرير',mainDesc:'بصمة نقاط وصول WiFi وكشف التوائم الشريرة',
    sectionA:'كيف يعمل',sectionB:'مختبر المقارنة',sectionC:'التحدي',
    activityLog:'سجل النشاط',eventsMsg:'الأحداث والرسائل',
    clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
    settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    scanBtn:'مسح نقاط الوصول',injectBtn:'حقن توأم شرير',compareBtn:'مقارنة',statusCol:'الحالة',
    alertMsg:'تم كشف AP مزيف! توأم شرير — لا تتصل!',
    compareDesc:'انقر مقارنة بعد المسح لتحليل البصمات جنباً إلى جنب.',
    howStep1:'ESP32 يمسح كل قنوات WiFi ويسجل بصمات AP.',
    howStep2:'البصمات تُخزن في قاعدة بيانات مرجعية.',
    howStep3:'في كل مسح، تُقارن البصمات الجديدة بالقاعدة.',
    howStep4:'إذا شارك AP نفس SSID لكن بـ BSSID أو قناة مختلفة، يُعلّم كمزيف.',
    challenge1:'كيف يعمل هجوم التوأم الشرير؟',challenge2:'لماذا لا يمكن الاعتماد على SSID وحده؟',challenge3:'ما الفحوصات الإضافية لكشف AP مزيف؟',
    challengeReveal1:'المهاجم ينشئ AP بنفس SSID. الضحايا يتصلون بالـ AP المزيف.',
    challengeReveal2:'SSID مجرد أسماء — أي شخص يمكنه إنشاء AP بأي اسم.',
    challengeReveal3:'فحص توقيت beacon، أنماط الاستجابة، المعدلات المدعومة، OUI الشركة المصنعة.',
    revealBtn:'اكشف الإجابة',
    faq_q1:'ما هو التوأم الشرير؟',faq_a1:'AP مزيف ينسخ SSID شبكة شرعية لخداع المستخدمين.',
    faq_q2:'ما هو BSSID؟',faq_a2:'عنوان MAC لراديو نقطة الوصول.',
    faq_q3:'هل يمكن كشف التوائم؟',faq_a3:'نعم، بمقارنة البصمات.',
    faq_q4:'هل هذا ماسح حقيقي؟',faq_a4:'لا. هذه محاكاة تعليمية.',
    howto_1:'انقر مسح نقاط الوصول.',howto_2:'انقر حقن توأم شرير للمحاكاة.',howto_3:'انقر مقارنة للتحليل.',howto_4:'راقب التنبيه الأحمر.',
    wiki_evil_title:'👿 هجوم التوأم الشرير',wiki_evil:'المهاجم ينشئ AP مزيف بنفس SSID.',
    wiki_fp_title:'🔬 بصمة AP',wiki_fp:'جمع BSSID, SSID, القناة, التشفير لتعريف AP.',
    wiki_detect_title:'🚨 طرق الكشف',wiki_detect:'مقارنة البصمات بقاعدة مرجعية.',
    wiki_protect_title:'🛡️ الحماية',wiki_protect:'استخدم WPA-Enterprise بشهادات وVPN.',
    working:'جارٍ…',scanning:'مسح قنوات WiFi...',
    apFound:'AP وجدت',rogueFound:'تم كشف AP مزيف!',noRogue:'كل الـ AP تم التحقق منها.',injected:'تم حقن التوأم الشرير!',
    safe:'آمن',rogue:'مزيف',known:'معروف',unknown:'جديد',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
    ready:'🔍 كاشف AP المزيف جاهز — امسح لبصمة الشبكات!',
    logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
    soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',
    splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
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



/* ═══════ FRAMEWORK ═══════ */
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${s.themeChanged} ${s['t_'+n]||n}`,'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'||l.classList.contains(activeLogFilter)?'':'none';});}
function onAppMessage(cb){window.addEventListener('storage',e=>{if(e.key!=='wdiy-app-msg'||!e.newValue)return;try{cb(JSON.parse(e.newValue));}catch{}});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءة';
function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoCC=0,logoCT=null;function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';l.addEventListener('click',()=>{logoCC++;if(logoCT)clearTimeout(logoCT);if(logoCC>=3){logoCC=0;toggleMatrix();}else logoCT=setTimeout(()=>logoCC=0,500);});}
function initDebug(){if(!new URLSearchParams(window.location.search).has('debug'))return;const p=$('debugPanel');if(p)p.classList.add('active');}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(name){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[name];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{d=false;});}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');});});}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;
  initLogFilters();
  if($('helpBtn'))$('helpBtn').onclick=openHelp;if($('helpCloseBtn'))$('helpCloseBtn').onclick=closeHelp;if($('helpOverlay'))$('helpOverlay').onclick=closeHelp;
  initHelpTabs();
  if($('settingsBtn'))$('settingsBtn').onclick=openSettings;if($('settingsCloseBtn'))$('settingsCloseBtn').onclick=closeSettings;if($('settingsOverlay'))$('settingsOverlay').onclick=closeSettings;
  if($('logBtn'))$('logBtn').onclick=toggleLog;if($('logCloseBtn'))$('logCloseBtn').onclick=closeLog;
  initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  if($('whisperBtn'))$('whisperBtn').onclick=()=>log('🎤 Whisper toggled','info');
  const bb=$('breathingBtn'),dd=$('dhikrDisplay'),db=$('dhikrBtn');
  if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none';};if(db)db.onclick=incrementDhikr;
  if($('musicBtn'))$('musicBtn').onclick=()=>log('🎵 Music toggled','info');
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const ls=$('langSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));
  const ts=$('themeSelect');if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  onAppMessage(msg=>log(`📨 ${msg.from}: ${msg.type}`,'rx'));
  initKonami();initMatrixTrigger();initDebug();initHijriDate();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   ROGUE AP DETECTOR SIMULATION
   ═══════════════════════════════════════════════════════════════ */

function revealChallenge(idx){const el=$('answer'+idx);if(el)el.classList.toggle('visible');playSound('click');}
function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0').toUpperCase()).join(':');}

// Known-good AP database
const KNOWN_APS=[
  {ssid:'CampusWiFi',bssid:'AA:BB:CC:11:22:33',channel:1,encryption:'WPA2',signal:-42,vendor:'Cisco'},
  {ssid:'LibraryNet',bssid:'DD:EE:FF:44:55:66',channel:6,encryption:'WPA2',signal:-55,vendor:'Aruba'},
  {ssid:'CafeFree',bssid:'11:22:33:AA:BB:CC',channel:11,encryption:'Open',signal:-60,vendor:'TP-Link'},
  {ssid:'AdminSecure',bssid:'99:88:77:66:55:44',channel:3,encryption:'WPA3',signal:-38,vendor:'Ubiquiti'},
  {ssid:'IoT-Sensors',bssid:'FE:DC:BA:98:76:54',channel:9,encryption:'WPA2',signal:-65,vendor:'Espressif'},
];

let scannedAPs=[];
let evilTwinInjected=false;

function scanAPs(){
  const s=LANG[currentLang];
  showToast(s.scanning,2000);
  log(s.scanning,'info');
  setStatus(true);

  setTimeout(()=>{
    // Copy known APs with slight signal variation
    scannedAPs=KNOWN_APS.map(ap=>({
      ...ap,
      signal:ap.signal+Math.floor(Math.random()*10-5),
      isRogue:false
    }));

    // If evil twin was injected, add it
    if(evilTwinInjected){
      scannedAPs.push({
        ssid:'CampusWiFi', // same SSID as legit
        bssid:randMAC(),
        channel:6, // different channel
        encryption:'WPA2',
        signal:-35, // stronger signal to lure victims
        vendor:'Unknown',
        isRogue:true
      });
    }

    // Maybe add a random unknown AP
    if(Math.random()>0.5){
      scannedAPs.push({
        ssid:'Guest-'+Math.floor(Math.random()*100),
        bssid:randMAC(),channel:Math.floor(Math.random()*11)+1,
        encryption:['WPA2','Open','WPA3'][Math.floor(Math.random()*3)],
        signal:-50-Math.floor(Math.random()*30),vendor:'Unknown',isRogue:false
      });
    }

    renderAPTable();
    checkForRogues();
    log(`📡 ${scannedAPs.length} ${s.apFound}`,'success');
    hideToast();
  },1500+Math.random()*800);
}

function renderAPTable(){
  const tbody=$('apTableBody');if(!tbody)return;
  const s=LANG[currentLang];
  tbody.innerHTML='';
  for(const ap of scannedAPs){
    const known=KNOWN_APS.find(k=>k.bssid===ap.bssid);
    const tr=document.createElement('tr');
    if(ap.isRogue)tr.className='rogue';
    tr.innerHTML=`
      <td>${ap.ssid}</td>
      <td style="font-family:Orbitron,monospace;font-size:.65rem">${ap.bssid}</td>
      <td>${ap.channel}</td>
      <td>${ap.encryption}</td>
      <td>${ap.signal} dBm</td>
      <td class="${ap.isRogue?'danger':'safe'}">${ap.isRogue?'🚨 '+s.rogue:known?'✅ '+s.safe:'❓ '+s.unknown}</td>
    `;
    tbody.appendChild(tr);
  }
}

function checkForRogues(){
  const s=LANG[currentLang];
  const alert=$('alertBox');
  const rogues=scannedAPs.filter(a=>a.isRogue);
  if(rogues.length>0){
    if(alert){alert.classList.add('visible');}
    log(`🚨 ${s.rogueFound} SSID="${rogues[0].ssid}" BSSID=${rogues[0].bssid}`,'error');
  }else{
    if(alert)alert.classList.remove('visible');
    log(`✅ ${s.noRogue}`,'success');
  }
}

function injectEvilTwin(){
  const s=LANG[currentLang];
  evilTwinInjected=true;
  log(`👿 ${s.injected} SSID="CampusWiFi"`,'error');
  showToast(s.injected,1500);
  // Auto-rescan
  setTimeout(scanAPs,500);
}

function compareFingerprints(){
  const area=$('compareArea');if(!area)return;
  area.innerHTML='';

  const rogueAP=scannedAPs.find(a=>a.isRogue);
  const legitAP=KNOWN_APS.find(k=>k.ssid==='CampusWiFi');

  if(!rogueAP||!legitAP){
    area.innerHTML='<p style="font-size:.85rem;color:var(--text-muted)">Inject an evil twin first, then compare.</p>';
    return;
  }

  const fields=['ssid','bssid','channel','encryption','signal','vendor'];
  const labels={ssid:'SSID',bssid:'BSSID',channel:'Channel',encryption:'Encryption',signal:'Signal',vendor:'Vendor'};

  // Legit card
  const lc=document.createElement('div');lc.className='compare-card';
  lc.innerHTML=`<h4>✅ Legitimate AP</h4>${fields.map(f=>`<div>${labels[f]}: <strong>${legitAP[f]}</strong></div>`).join('')}`;
  area.appendChild(lc);

  // Rogue card
  const rc=document.createElement('div');rc.className='compare-card';
  rc.innerHTML=`<h4>🚨 Rogue AP</h4>${fields.map(f=>{
    const match=String(rogueAP[f])===String(legitAP[f]);
    return `<div class="${match?'match':'mismatch'}">${labels[f]}: <strong>${rogueAP[f]}</strong> ${match?'✓':'✗ MISMATCH'}</div>`;
  }).join('')}`;
  area.appendChild(rc);

  log('🔬 Fingerprint comparison displayed','info');
}

function initRogueDetector(){
  if($('scanBtn'))$('scanBtn').addEventListener('click',scanAPs);
  if($('injectBtn'))$('injectBtn').addEventListener('click',injectEvilTwin);
  if($('compareBtn'))$('compareBtn').addEventListener('click',compareFingerprints);
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initRogueDetector);}else{setTimeout(initRogueDetector,50);}

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Rogue AP Detector: Evil twin detection
   with AP radar, fingerprint comparison, and alert system
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const aps=[],scanWaves=[];
  const SSIDS=['CoffeeShop_WiFi','Airport_Free','Hotel_Guest','Corp_Net','Library_Public'];
  let radarAngle=0;

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#0a0a14;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  class AP{
    constructor(rogue){
      this.ssid=SSIDS[Math.floor(Math.random()*SSIDS.length)];this.isRogue=rogue;
      this.bssid=Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':');
      this.channel=Math.floor(Math.random()*13)+1;this.rssi=-30-Math.random()*50;
      const a=Math.random()*Math.PI*2,d=60+Math.random()*100;
      this.x=W/2+Math.cos(a)*d;this.y=H/2+Math.sin(a)*d;
      this.pulsePhase=Math.random()*Math.PI*2;this.beaconTimer=0;this.beacons=[];
      this.detected=false;this.detectTimer=0;
    }
    update(){
      this.pulsePhase+=0.04;this.beaconTimer++;
      if(this.beaconTimer%40===0)this.beacons.push({x:this.x,y:this.y,r:0,maxR:50,alpha:0.5});
      for(let i=this.beacons.length-1;i>=0;i--){this.beacons[i].r+=0.8;this.beacons[i].alpha=0.5*(1-this.beacons[i].r/this.beacons[i].maxR);if(this.beacons[i].r>this.beacons[i].maxR)this.beacons.splice(i,1);}
      if(this.isRogue&&!this.detected&&frameCount>120){this.detectTimer++;if(this.detectTimer>60)this.detected=true;}
    }
    draw(){
      this.beacons.forEach(b=>{ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);ctx.strokeStyle=this.isRogue?'rgba(255,60,60,'+b.alpha+')':'rgba(60,200,60,'+b.alpha+')';ctx.lineWidth=1;ctx.stroke();});
      const glow=6+Math.sin(this.pulsePhase)*3;ctx.save();ctx.shadowColor=this.isRogue?'#ff3333':'#33ff33';ctx.shadowBlur=glow;
      ctx.beginPath();ctx.arc(this.x,this.y,16,0,Math.PI*2);ctx.fillStyle=this.isRogue?'rgba(255,50,50,0.2)':'rgba(50,255,50,0.15)';ctx.fill();
      ctx.strokeStyle=this.isRogue?'#ff4444':'#44ff44';ctx.lineWidth=2;ctx.stroke();
      ctx.font='14px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(this.isRogue?'\u{1F6A8}':'\u{1F4E1}',this.x,this.y);ctx.restore();
      ctx.font='8px monospace';ctx.fillStyle=this.isRogue?'#ff6666':'#66ff66';ctx.textAlign='center';ctx.fillText(this.ssid,this.x,this.y-22);
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.fillText('CH:'+this.channel+' '+Math.round(this.rssi)+'dBm',this.x,this.y+24);
      if(this.isRogue&&this.detected){const flash=Math.sin(frameCount*0.15)>0;if(flash){ctx.strokeStyle='#ff0000';ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(this.x,this.y,26,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
        ctx.font='bold 9px monospace';ctx.fillStyle='#ff4444';ctx.fillText('EVIL TWIN',this.x,this.y+36);}
    }
  }

  function drawRadar(){
    radarAngle+=0.015;ctx.save();ctx.translate(W/2,H/2);ctx.rotate(radarAngle);
    const g=ctx.createLinearGradient(0,0,140,0);g.addColorStop(0,'rgba(0,255,100,0.25)');g.addColorStop(1,'rgba(0,255,100,0)');
    ctx.beginPath();ctx.moveTo(0,0);ctx.arc(0,0,140,-0.1,0.1);ctx.closePath();ctx.fillStyle=g;ctx.fill();ctx.restore();
    ctx.beginPath();ctx.arc(W/2,H/2,10,0,Math.PI*2);ctx.fillStyle='#00ff66';ctx.fill();
    ctx.font='7px monospace';ctx.fillStyle='#00ff66';ctx.textAlign='center';ctx.fillText('DETECTOR',W/2,H/2+20);
    [50,100,140].forEach(r=>{ctx.beginPath();ctx.arc(W/2,H/2,r,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,100,0.08)';ctx.lineWidth=1;ctx.stroke();});
  }

  function drawGrid(){ctx.strokeStyle='rgba(0,255,100,0.04)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(W/2,0);ctx.lineTo(W/2,H);ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.stroke();}

  function drawAlertBanner(){
    const rogues=aps.filter(a=>a.isRogue&&a.detected);if(rogues.length===0)return;
    const flash=Math.sin(frameCount*0.1)>0;ctx.save();ctx.fillStyle=flash?'rgba(255,0,0,0.15)':'rgba(255,0,0,0.08)';ctx.fillRect(0,H-32,W,32);
    ctx.font='bold 11px monospace';ctx.fillStyle='#ff4444';ctx.textAlign='center';
    ctx.fillText('\u26A0 '+rogues.length+' ROGUE AP'+(rogues.length>1?'S':'')+' DETECTED \u26A0',W/2,H-14);ctx.restore();
  }

  function drawConnections(){
    aps.forEach(ap=>{ctx.beginPath();ctx.moveTo(ap.x,ap.y);ctx.lineTo(W/2,H/2);ctx.strokeStyle=ap.isRogue?'rgba(255,60,60,0.08)':'rgba(60,255,60,0.06)';ctx.lineWidth=1;ctx.setLineDash([2,6]);ctx.stroke();ctx.setLineDash([]);});
  }

  function drawHUD(){
    const total=aps.length,rogue=aps.filter(a=>a.isRogue).length,detected=aps.filter(a=>a.isRogue&&a.detected).length;
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(8,8,170,68);ctx.strokeStyle='#0f03';ctx.strokeRect(8,8,170,68);
    ctx.font='10px monospace';ctx.fillStyle='#00ff66';ctx.textAlign='left';ctx.fillText('ROGUE AP DETECTOR',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('APs Found: '+total,16,40);ctx.fillText('Legit: '+(total-rogue)+'  Rogue: '+rogue,16,54);
    ctx.fillStyle=detected>0?'#ff4444':'#666';ctx.fillText('Alerts: '+detected,16,68);ctx.restore();
  }

  function init(){
    ensureCanvas();for(let i=0;i<5;i++)aps.push(new AP(false));for(let i=0;i<2;i++)aps.push(new AP(true));
    if(aps.length>5)aps[5].ssid=aps[0].ssid;if(aps.length>6)aps[6].ssid=aps[1].ssid;animate();
  }
  function animate(){
    frameCount++;ctx.fillStyle='rgba(10,10,20,0.16)';ctx.fillRect(0,0,W,H);
    drawGrid();drawRadar();drawConnections();aps.forEach(ap=>{ap.update();ap.draw();});
    if(frameCount%300===0&&aps.length<12){const rogue=Math.random()<0.3;const n=new AP(rogue);if(rogue&&aps.length>0)n.ssid=aps[Math.floor(Math.random()*aps.length)].ssid;aps.push(n);}
    drawAlertBanner();drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,200);
})();
