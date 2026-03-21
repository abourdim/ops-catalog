/**
 * Workshop DIY — Internet Simulator v1.0
 * Desktop Internet: DNS/Web/Router/Firewall nodes
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7h-126.8v3.6h126.8z"/><path style="stroke:none;fill:currentColor" d="M330.8,203.4h-169.1v3.6h169.1z"/><path style="stroke:none;fill:currentColor" d="M330.8,211h-253.7v3.6h253.7z"/></svg>`;
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;switch(type){case'click':o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);break;case'success':o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);break;case'error':o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;}}

const LANG={
en:{
title:'Internet Simulator',subtitle:'🌍 DNS · 🖥️ web · 🔀 router · 🛡️ firewall',
disconnected:'Disconnected',connected:'Connected',
mainSection:'Internet Simulator — Desktop Internet',mainDesc:'Each node is DNS/web/router/firewall, build the internet',
sectionA:'How It Works',sectionB:'Lab',sectionC:'Challenge',
activityLog:'Activity Log',eventsMsg:'Events & messages',
clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
settings:'⚙️ Settings',language:'Language',
help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
faq_q1:'What does DNS do?',faq_a1:'DNS translates human-readable domain names like workshop-diy.org into IP addresses that computers use to communicate.',
faq_q2:'What is a router?',faq_a2:'A router forwards data packets between networks, choosing the best path for each packet to reach its destination.',
faq_q3:'How does a firewall protect the network?',faq_a3:'A firewall inspects traffic against security rules. It blocks unauthorized access while permitting legitimate communication.',
faq_q4:'What is HTTP?',faq_a4:'HTTP is the protocol used to transfer web pages. A client sends a request and the server sends back a response.',
howto_1:'Enter a URL in the input field (or use the default).',
howto_2:'Click Send Request and watch the packet travel through the network.',
howto_3:'Follow the animated packet as it hops through DNS, router, firewall, and web server.',
howto_4:'Read the request log to see details of each hop.',
wiki_dns_title:'🌐 DNS',wiki_dns:'The Domain Name System is the phonebook of the internet. It translates domain names to IP addresses.',
wiki_http_title:'📄 HTTP/HTTPS',wiki_http:'HTTP is the foundation of data communication on the web. HTTPS adds encryption via TLS.',
wiki_fw_title:'🛡️ Firewalls',wiki_fw:'Firewalls monitor network traffic and enforce security policies.',
wiki_router_title:'🔀 Routing',wiki_router:'Routing is the process of selecting paths in a network to send data packets.',
working:'Working…',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
ready:'🌍 Internet Simulator ready!',
logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
sendRequest:'Send Request',legClient:'Client',legDNS:'DNS',legRouter:'Router',legFirewall:'Firewall',legWebServer:'Web Server',
step1:'Client types a URL and sends an HTTP request. First stop: the DNS server to resolve the domain name to an IP address.',
step2:'The router forwards the packet through the network, choosing the best path between nodes.',
step3:'The firewall inspects the packet. If allowed, it passes through; if blocked, it is dropped.',
step4:'The web server receives the request, processes it, and sends the HTTP response back through the same path.',
labTip1:'Enter different URLs to see how DNS resolution changes the request path.',
labTip2:'Watch the animated packet travel through DNS, router, firewall, and web server.',
labTip3:'The request log shows each hop with timing information.',
labTip4:'Try blocked URLs to see how the firewall drops packets.',
challenge1:'Trace the full journey of an HTTP request from client to server and back, noting every hop.',
challenge2:'Try requesting a blocked domain and observe the firewall dropping the packet.',
challenge3:'Explain why the response follows the reverse path through the same router and firewall.',
dnsResolving:'DNS resolving',dnsResolved:'DNS resolved',routerForward:'Router forwarding packet',
fwAllowed:'Firewall: ALLOWED',fwBlocked:'Firewall: BLOCKED',serverResponse:'Web server responding',
responseReceived:'Response received by client',requestBlocked:'Request blocked by firewall',
},
fr:{
title:'Simulateur Internet',subtitle:'🌍 DNS · 🖥️ web · 🔀 routeur · 🛡️ pare-feu',
disconnected:'Déconnecté',connected:'Connecté',
mainSection:'Simulateur Internet — Internet de Bureau',mainDesc:'Chaque nœud est DNS/web/routeur/pare-feu, construisez l\'internet',
sectionA:'Comment ça marche',sectionB:'Labo',sectionC:'Défi',
activityLog:'Journal',eventsMsg:'Événements et messages',
clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
settings:'⚙️ Paramètres',language:'Langue',
help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
faq_q1:'Que fait le DNS ?',faq_a1:'Le DNS traduit les noms de domaine en adresses IP que les ordinateurs utilisent pour communiquer.',
faq_q2:'Qu\'est-ce qu\'un routeur ?',faq_a2:'Un routeur transmet les paquets entre réseaux en choisissant le meilleur chemin.',
faq_q3:'Comment un pare-feu protège le réseau ?',faq_a3:'Un pare-feu inspecte le trafic selon des règles de sécurité et bloque les accès non autorisés.',
faq_q4:'Qu\'est-ce que HTTP ?',faq_a4:'HTTP est le protocole de transfert de pages web. Le client envoie une requête et le serveur renvoie une réponse.',
howto_1:'Entrez une URL dans le champ (ou utilisez celle par défaut).',howto_2:'Cliquez Envoyer et regardez le paquet traverser le réseau.',
howto_3:'Suivez le paquet animé à travers DNS, routeur, pare-feu et serveur web.',howto_4:'Lisez le journal de requêtes pour les détails de chaque saut.',
wiki_dns_title:'🌐 DNS',wiki_dns:'Le DNS est l\'annuaire d\'Internet. Il traduit les noms de domaine en adresses IP.',
wiki_http_title:'📄 HTTP/HTTPS',wiki_http:'HTTP est la base de la communication web. HTTPS ajoute le chiffrement via TLS.',
wiki_fw_title:'🛡️ Pare-feu',wiki_fw:'Les pare-feu surveillent le trafic réseau et appliquent les politiques de sécurité.',
wiki_router_title:'🔀 Routage',wiki_router:'Le routage est le processus de sélection des chemins dans un réseau pour envoyer les paquets.',
working:'En cours…',
t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
ready:'🌍 Simulateur Internet prêt !',
logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Réactif musique',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',
sendRequest:'Envoyer',legClient:'Client',legDNS:'DNS',legRouter:'Routeur',legFirewall:'Pare-feu',legWebServer:'Serveur Web',
step1:'Le client tape une URL et envoie une requête HTTP. Premier arrêt : le serveur DNS pour résoudre le nom de domaine.',
step2:'Le routeur transmet le paquet à travers le réseau en choisissant le meilleur chemin.',
step3:'Le pare-feu inspecte le paquet. S\'il est autorisé, il passe ; sinon, il est rejeté.',
step4:'Le serveur web reçoit la requête, la traite et renvoie la réponse HTTP par le même chemin.',
labTip1:'Entrez différentes URLs pour voir comment la résolution DNS change.',labTip2:'Regardez le paquet animé traverser DNS, routeur, pare-feu et serveur.',
labTip3:'Le journal montre chaque saut avec le timing.',labTip4:'Essayez des URLs bloquées pour voir le pare-feu rejeter le paquet.',
challenge1:'Tracez le parcours complet d\'une requête HTTP du client au serveur et retour.',
challenge2:'Essayez un domaine bloqué et observez le pare-feu rejeter le paquet.',
challenge3:'Expliquez pourquoi la réponse suit le chemin inverse par le même routeur et pare-feu.',
dnsResolving:'Résolution DNS',dnsResolved:'DNS résolu',routerForward:'Routeur transmet le paquet',
fwAllowed:'Pare-feu : AUTORISÉ',fwBlocked:'Pare-feu : BLOQUÉ',serverResponse:'Serveur web répond',
responseReceived:'Réponse reçue par le client',requestBlocked:'Requête bloquée par le pare-feu',
},
ar:{
title:'محاكي الإنترنت',subtitle:'🌍 DNS · 🖥️ ويب · 🔀 موجّه · 🛡️ جدار ناري',
disconnected:'غير متصل',connected:'متصل',
mainSection:'محاكي الإنترنت — إنترنت مكتبي',mainDesc:'كل عقدة هي DNS/ويب/موجّه/جدار ناري، ابنِ الإنترنت',
sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',
activityLog:'سجل النشاط',eventsMsg:'الأحداث والرسائل',
clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
settings:'⚙️ الإعدادات',language:'اللغة',
help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
faq_q1:'ماذا يفعل DNS؟',faq_a1:'DNS يترجم أسماء النطاقات مثل workshop-diy.org إلى عناوين IP يستخدمها الكمبيوتر للتواصل.',
faq_q2:'ما هو الموجّه؟',faq_a2:'الموجّه ينقل حزم البيانات بين الشبكات ويختار أفضل مسار لكل حزمة.',
faq_q3:'كيف يحمي الجدار الناري الشبكة؟',faq_a3:'الجدار الناري يفحص حركة المرور وفق قواعد أمنية ويحظر الوصول غير المصرح به.',
faq_q4:'ما هو HTTP؟',faq_a4:'HTTP هو البروتوكول المستخدم لنقل صفحات الويب. يرسل العميل طلبًا ويرد الخادم باستجابة.',
howto_1:'أدخل عنوان URL في الحقل.',howto_2:'انقر إرسال وشاهد الحزمة تعبر الشبكة.',
howto_3:'تابع الحزمة المتحركة عبر DNS والموجّه والجدار الناري وخادم الويب.',howto_4:'اقرأ سجل الطلبات لمعرفة تفاصيل كل قفزة.',
wiki_dns_title:'🌐 DNS',wiki_dns:'نظام أسماء النطاقات هو دليل هاتف الإنترنت. يترجم أسماء النطاقات إلى عناوين IP.',
wiki_http_title:'📄 HTTP/HTTPS',wiki_http:'HTTP هو أساس اتصالات البيانات على الويب. HTTPS يضيف التشفير عبر TLS.',
wiki_fw_title:'🛡️ الجدران النارية',wiki_fw:'الجدران النارية تراقب حركة مرور الشبكة وتطبق سياسات الأمان.',
wiki_router_title:'🔀 التوجيه',wiki_router:'التوجيه هو عملية اختيار المسارات في الشبكة لإرسال حزم البيانات.',
working:'جارٍ…',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
ready:'🌍 محاكي الإنترنت جاهز!',
logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
sendRequest:'إرسال',legClient:'عميل',legDNS:'DNS',legRouter:'موجّه',legFirewall:'جدار ناري',legWebServer:'خادم ويب',
step1:'يكتب العميل عنوان URL ويرسل طلب HTTP. المحطة الأولى: خادم DNS لحل اسم النطاق إلى عنوان IP.',
step2:'الموجّه ينقل الحزمة عبر الشبكة مختارًا أفضل مسار بين العقد.',
step3:'الجدار الناري يفحص الحزمة. إذا سُمح بها تمر، وإلا تُسقط.',
step4:'خادم الويب يستقبل الطلب ويعالجه ويرسل استجابة HTTP عبر نفس المسار.',
labTip1:'أدخل عناوين URL مختلفة لمشاهدة تغير مسار الطلب.',labTip2:'شاهد الحزمة المتحركة تعبر DNS والموجّه والجدار الناري والخادم.',
labTip3:'سجل الطلبات يُظهر كل قفزة مع معلومات التوقيت.',labTip4:'جرّب عناوين محظورة لمشاهدة الجدار الناري يُسقط الحزمة.',
challenge1:'تتبع الرحلة الكاملة لطلب HTTP من العميل إلى الخادم والعودة.',
challenge2:'جرّب طلب نطاق محظور ولاحظ الجدار الناري يُسقط الحزمة.',
challenge3:'اشرح لماذا تتبع الاستجابة المسار العكسي عبر نفس الموجّه والجدار الناري.',
dnsResolving:'جارٍ حل DNS',dnsResolved:'تم حل DNS',routerForward:'الموجّه ينقل الحزمة',
fwAllowed:'الجدار الناري: مسموح',fwBlocked:'الجدار الناري: محظور',serverResponse:'خادم الويب يستجيب',
responseReceived:'استُلمت الاستجابة من العميل',requestBlocked:'تم حظر الطلب بواسطة الجدار الناري',
}};

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
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}

const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const ns=THEME_MELODIES[n];if(!ns)return;const t=audioCtx.currentTime;ns.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+name]||name}`,'info');}

let logContainer,typewriterEnabled=true;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const txt=`[${new Date().toLocaleTimeString()}] ${msg}`;if(typewriterEnabled){logContainer.appendChild(d);twA(d,txt);}else{d.textContent=txt;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');if(type==='error')playSound('error');applyLogFilter();}
async function twA(el,t){el.textContent='';for(let i=0;i<t.length;i++){el.textContent+=t[i];await new Promise(r=>setTimeout(r,8+Math.random()*12));}}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}

let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}

let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

function openPanel(p,o){const s=$(p),ov=$(o);if(s)s.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const s=$(p),ov=$(o);if(s)s.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}
function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const tgt=$('help'+n.charAt(0).toUpperCase()+n.slice(1));if(tgt)tgt.classList.add('active');});});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=(document.documentElement.dir==='rtl')?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{d=false;});}

let breathingActive=false,dhikrCount=0;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI CODE — RETRO!','success');}}else konamiIdx=0;});}

/* ═══════ INTERNET SIMULATION ═══════ */

const NET_NODES = [
  { id: 'client',  label: 'Client',     icon: '💻', color: '#3b82f6', x: 0.08, y: 0.5 },
  { id: 'dns',     label: 'DNS Server',  icon: '🌐', color: '#22d3ee', x: 0.28, y: 0.18 },
  { id: 'router',  label: 'Router',      icon: '🔀', color: '#a3e635', x: 0.38, y: 0.55 },
  { id: 'firewall',label: 'Firewall',    icon: '🛡️', color: '#f97316', x: 0.62, y: 0.55 },
  { id: 'server',  label: 'Web Server',  icon: '🖥️', color: '#c084fc', x: 0.88, y: 0.5 },
];

const NET_LINKS = [
  ['client','dns'], ['client','router'], ['dns','router'],
  ['router','firewall'], ['firewall','server'],
];

const BLOCKED_DOMAINS = ['malware.bad', 'phishing.evil', 'hack.test'];
const DNS_TABLE = {
  'workshop-diy.org': '192.168.1.10',
  'example.com': '93.184.216.34',
  'google.com': '142.250.80.46',
};

let netCanvas, netCtx, netAnim = null;
let packet = null; // {x, y, fromIdx, toIdx, progress, path, pathIdx, color, returning}

function netInit() {
  netCanvas = $('netCanvas'); if (!netCanvas) return;
  netCtx = netCanvas.getContext('2d');
  netResize(); window.addEventListener('resize', netResize);

  const btn = $('requestBtn'), input = $('urlInput');
  if (btn) btn.addEventListener('click', sendHTTPRequest);
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') sendHTTPRequest(); });

  netRender();
}

function netResize() {
  if (!netCanvas) return;
  const r = netCanvas.parentElement.getBoundingClientRect();
  netCanvas.width = r.width - 2;
  netCanvas.height = 300;
}

function getNodePos(node) {
  return { x: node.x * netCanvas.width, y: node.y * netCanvas.height };
}

function sendHTTPRequest() {
  if (packet) return; // already animating
  const input = $('urlInput');
  const url = (input ? input.value.trim() : '') || 'http://workshop-diy.org';
  const domain = url.replace(/^https?:\/\//, '').split('/')[0];
  const s = LANG[currentLang];
  const reqLog = $('requestLog');
  if (reqLog) reqLog.innerHTML = '';

  const isBlocked = BLOCKED_DOMAINS.includes(domain);
  const ip = DNS_TABLE[domain] || `10.0.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;

  // Build path: client -> dns -> router -> firewall -> (server or blocked)
  const path = isBlocked
    ? ['client', 'dns', 'router', 'firewall']
    : ['client', 'dns', 'router', 'firewall', 'server'];

  log(`📤 TX HTTP GET ${url}`, 'tx');
  addHop(`→ Client sends request for ${domain}`);

  let hopIdx = 0;
  packet = { path, hopIdx: 0, progress: 0, domain, ip, isBlocked, returning: false };

  function animate() {
    if (!packet) return;
    packet.progress += 0.025;
    if (packet.progress >= 1) {
      packet.progress = 0;
      const arrived = packet.path[packet.hopIdx + 1];

      // Process arrival
      if (!packet.returning) {
        if (arrived === 'dns') { addHop(`🌐 ${s.dnsResolving}: ${domain} → ${ip}`); log(`🌐 ${s.dnsResolved}: ${domain} → ${ip}`, 'info'); }
        else if (arrived === 'router') { addHop(`🔀 ${s.routerForward}`); log(`🔀 ${s.routerForward}`, 'info'); }
        else if (arrived === 'firewall') {
          if (packet.isBlocked) {
            addHop(`🛡️ ${s.fwBlocked} — ${domain}`, true);
            log(`🛡️ ${s.requestBlocked}: ${domain}`, 'error');
            showToast(s.requestBlocked, 2500);
            packet = null; return;
          } else {
            addHop(`🛡️ ${s.fwAllowed}`);
            log(`🛡️ ${s.fwAllowed}`, 'success');
          }
        }
        else if (arrived === 'server') {
          addHop(`🖥️ ${s.serverResponse}: 200 OK`);
          log(`📥 RX HTTP 200 OK from ${ip}`, 'rx');
          // Start return journey
          packet.returning = true;
          packet.path = ['server', 'firewall', 'router', 'client'];
          packet.hopIdx = 0;
          packet.progress = 0;
          netAnim = requestAnimationFrame(animate);
          return;
        }
      } else {
        if (arrived === 'client') {
          addHop(`💻 ${s.responseReceived}`);
          log(`✅ ${s.responseReceived}`, 'success');
          showToast(s.responseReceived, 2000);
          packet = null; return;
        }
      }

      packet.hopIdx++;
      if (packet.hopIdx >= packet.path.length - 1) { packet = null; return; }
    }
    netAnim = requestAnimationFrame(animate);
  }
  netAnim = requestAnimationFrame(animate);
}

function addHop(text, isError) {
  const reqLog = $('requestLog'); if (!reqLog) return;
  const div = document.createElement('div');
  div.className = 'hop' + (isError ? ' active' : '');
  div.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
  reqLog.appendChild(div);
  reqLog.scrollTop = reqLog.scrollHeight;
}

function netRender() {
  function frame() {
    netDraw();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function netDraw() {
  const ctx = netCtx; if (!ctx || !netCanvas) return;
  const w = netCanvas.width, h = netCanvas.height;
  ctx.clearRect(0, 0, w, h);
  const textCol = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#e4ddd0';
  const mutedCol = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8a7e6e';

  // Draw links
  NET_LINKS.forEach(([aId, bId]) => {
    const a = NET_NODES.find(n => n.id === aId), b = NET_NODES.find(n => n.id === bId);
    if (!a || !b) return;
    const pa = getNodePos(a), pb = getNodePos(b);
    ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y);
    ctx.strokeStyle = mutedCol + '40'; ctx.lineWidth = 2; ctx.stroke();
  });

  // Draw nodes
  NET_NODES.forEach(node => {
    const p = getNodePos(node);
    // Glow
    ctx.beginPath(); ctx.arc(p.x, p.y, 28, 0, Math.PI * 2);
    ctx.fillStyle = node.color + '15'; ctx.fill();
    // Circle
    ctx.beginPath(); ctx.arc(p.x, p.y, 22, 0, Math.PI * 2);
    ctx.fillStyle = node.color + '30'; ctx.fill();
    ctx.strokeStyle = node.color; ctx.lineWidth = 2; ctx.stroke();
    // Icon
    ctx.font = '18px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(node.icon, p.x, p.y);
    // Label
    ctx.font = 'bold 10px Tajawal, sans-serif'; ctx.fillStyle = textCol;
    ctx.fillText(node.label, p.x, p.y + 34);
  });

  // Draw packet
  if (packet && packet.path.length > 1 && packet.hopIdx < packet.path.length - 1) {
    const fromNode = NET_NODES.find(n => n.id === packet.path[packet.hopIdx]);
    const toNode = NET_NODES.find(n => n.id === packet.path[packet.hopIdx + 1]);
    if (fromNode && toNode) {
      const pf = getNodePos(fromNode), pt = getNodePos(toNode);
      const px = pf.x + (pt.x - pf.x) * packet.progress;
      const py = pf.y + (pt.y - pf.y) * packet.progress;
      // Packet glow
      ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2);
      const col = packet.returning ? '#22c55e' : '#ef4444';
      ctx.fillStyle = col; ctx.fill();
      ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2);
      ctx.fillStyle = col + '30'; ctx.fill();
      // Label
      ctx.font = '10px sans-serif'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(packet.returning ? 'RES' : 'REQ', px, py);
    }
  }
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hC=$('helpCloseBtn'),hO=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hC)hC.onclick=closeHelp;if(hO)hO.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sC=$('settingsCloseBtn'),sO=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sC)sC.onclick=closeSettings;if(sO)sO.onclick=closeSettings;
  const lBtn=$('logBtn'),lC=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog;if(lC)lC.onclick=closeLog;
  initLogResize();
  const sndT=$('soundToggle');
  if(sndT){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}sndT.checked=soundEnabled;sndT.addEventListener('change',()=>{soundEnabled=sndT.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  const brBtn=$('breathingBtn'),dkD=$('dhikrDisplay'),dkB=$('dhikrBtn');
  if(brBtn)brBtn.onclick=()=>{toggleBreathing();if(dkD)dkD.style.display=breathingActive?'flex':'none';};
  if(dkB)dkB.onclick=incrementDhikr;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initKonami();initHijriDate();
  netInit();setStatus(true);
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Internet Simulator: DNS/Web/Router/Firewall
   packet journey with animated network topology
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const inetNodes=[],pkts=[],particles=[];let reqCount=0;

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#060812;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  const INET_TYPES=[
    {name:'Client',icon:'\u{1F4BB}',color:'#4d96ff'},
    {name:'DNS',icon:'\u{1F4D6}',color:'#ffd93d'},
    {name:'Router',icon:'\u{1F500}',color:'#00ccff'},
    {name:'Firewall',icon:'\u{1F6E1}',color:'#ff6b6b'},
    {name:'Web Server',icon:'\u{1F310}',color:'#6bcb77'},
    {name:'CDN',icon:'\u26A1',color:'#e879f9'}
  ];

  class InetNode{
    constructor(x,y,type){this.x=x;this.y=y;this.type=type;this.pulse=Math.random()*Math.PI*2;this.active=false;this.activeTimer=0;}
    draw(){
      this.pulse+=0.03;if(this.active){this.activeTimer--;if(this.activeTimer<=0)this.active=false;}
      const glow=4+Math.sin(this.pulse)*2;ctx.save();ctx.shadowColor=this.active?'#fff':this.type.color;ctx.shadowBlur=this.active?glow+6:glow;
      ctx.beginPath();ctx.arc(this.x,this.y,18,0,Math.PI*2);ctx.fillStyle=this.active?'rgba(255,255,255,0.15)':'rgba(255,255,255,0.05)';ctx.fill();
      ctx.strokeStyle=this.active?'#fff':this.type.color;ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
      ctx.font='14px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(this.type.icon,this.x,this.y);
      ctx.font='7px monospace';ctx.fillStyle=this.type.color;ctx.fillText(this.type.name,this.x,this.y+26);ctx.restore();
    }
  }

  class NetPacket{
    constructor(path,label){this.path=path;this.step=0;this.progress=0;this.speed=0.02+Math.random()*0.01;this.label=label;this.alive=true;}
    update(){
      this.progress+=this.speed;
      if(this.progress>=1){
        this.path[this.step].active=true;this.path[this.step].activeTimer=30;
        this.step++;this.progress=0;
        if(this.step>=this.path.length-1)this.alive=false;
      }
      return this.alive;
    }
    draw(){
      if(this.step>=this.path.length-1)return;
      const src=this.path[this.step],tgt=this.path[this.step+1];
      const px=src.x+(tgt.x-src.x)*this.progress,py=src.y+(tgt.y-src.y)*this.progress;
      // Trail
      ctx.beginPath();ctx.moveTo(src.x,src.y);ctx.lineTo(px,py);ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=2;ctx.stroke();
      // Packet dot
      ctx.beginPath();ctx.arc(px,py,5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
      ctx.beginPath();ctx.arc(px,py,8,0,Math.PI*2);ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=1;ctx.stroke();
      ctx.font='7px monospace';ctx.fillStyle='#ffd93d';ctx.textAlign='center';ctx.fillText(this.label,px,py-12);
    }
  }

  function drawLinks(){
    for(let i=0;i<inetNodes.length-1;i++){
      ctx.beginPath();ctx.moveTo(inetNodes[i].x,inetNodes[i].y);ctx.lineTo(inetNodes[i+1].x,inetNodes[i+1].y);
      ctx.strokeStyle='rgba(100,100,200,0.1)';ctx.lineWidth=1;ctx.setLineDash([4,8]);ctx.stroke();ctx.setLineDash([]);
    }
  }

  function drawGrid(){ctx.strokeStyle='rgba(100,100,200,0.03)';ctx.lineWidth=1;for(let x=0;x<W;x+=50){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=0;y<H;y+=50){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}}

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,190,58);ctx.strokeStyle='#0cf3';ctx.strokeRect(8,8,190,58);
    ctx.font='10px monospace';ctx.fillStyle='#00ccff';ctx.textAlign='left';ctx.fillText('INTERNET SIMULATOR',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Nodes: '+inetNodes.length+'  Requests: '+reqCount,16,40);
    ctx.fillText('Active Packets: '+pkts.length,16,54);ctx.restore();
  }

  function sendRequest(){
    const labels=['HTTP GET','DNS Query','TCP SYN','TLS Hello','ICMP Ping','HTTP POST'];
    const label=labels[Math.floor(Math.random()*labels.length)];
    const path=[...inetNodes];if(Math.random()>0.5)path.reverse();
    pkts.push(new NetPacket(path,label));reqCount++;
  }

  function init(){
    ensureCanvas();
    const spacing=W/(INET_TYPES.length+1);
    INET_TYPES.forEach((t,i)=>{inetNodes.push(new InetNode(spacing*(i+1),H/2+(Math.sin(i*0.8)*40),t));});
    animate();
  }

  function animate(){
    frameCount++;ctx.fillStyle='rgba(6,8,18,0.14)';ctx.fillRect(0,0,W,H);drawGrid();drawLinks();
    inetNodes.forEach(n=>n.draw());
    if(frameCount%80===0)sendRequest();
    for(let i=pkts.length-1;i>=0;i--){if(!pkts[i].update()){for(let p=0;p<6;p++){const last=pkts[i].path[pkts[i].path.length-1];particles.push({x:last.x,y:last.y,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3,life:1,color:'#6bcb77'});}pkts.splice(i,1);}else pkts[i].draw();}
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.life-=0.03;if(p.life<=0){particles.splice(i,1);}else{ctx.beginPath();ctx.arc(p.x,p.y,2*p.life,0,Math.PI*2);ctx.fillStyle=p.color+Math.floor(p.life*200).toString(16).padStart(2,'0');ctx.fill();}}
    drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,250);
})();
