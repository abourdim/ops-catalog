/**
 * Workshop DIY — Onion Simulator v1.2
 * Tor Visualization — Watch encrypted messages bounce through relay nodes
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3l-6.5-2.4l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.4l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7H204v3.6h126.8zM330.8,203.4H161.7v3.6h169.1zM330.8,211H77.1v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);}else if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);}}

const LANG={
  en:{matrixTitle:'Matrix Rain',matrixOn:'Matrix ON',matrixOff:'Matrix OFF',ratingTitle:'Rate this app',ratingYours:'You rated',ratingThanks:'Thanks for rating!',flashTitle:'Flashcards',flashKnow:'Know it',flashReview:'Review later',flashDone:'All cards reviewed!',flashProgress:'{0} of {1} remaining',flash_t1:'Signal',flash_d1:'A detectable transmitted energy pattern used to convey information.',flash_t2:'Encryption',flash_d2:'The process of encoding data so only authorized parties can read it.',flash_t3:'Protocol',flash_d3:'A set of rules governing data exchange between devices or systems.',flash_t4:'Frequency',flash_d4:'The number of cycles per second of a periodic signal, measured in Hertz.',flash_t5:'Authentication',flash_d5:'The process of verifying the identity of a user, device, or system.',certTitle:'Certificate of Completion',certComplete:'Congratulations! All apps completed!',certProgress:'{0} of {1} apps completed',certDownload:'Download Certificate',certName:'Workshop DIY',annotTitle:'Annotation Mode',annotDraw:'Freehand',annotArrow:'Arrow',annotCircle:'Circle',annotText:'Text',annotUndo:'Undo',annotClear:'Clear All',annotSave:'Save as PNG',annotExit:'Exit Annotation',bookmarkTitle:'My Bookmarks',bookmarkAdd:'Add Bookmark',bookmarkRemove:'Remove',bookmarkCollection:'Add to Collection',bookmarkNew:'New Collection',bookmarkEmpty:'No bookmarks yet',morseSecret:'Morse Easter Egg',morseBackstory:'This tool was originally designed in 1962 by a covert CIA unit operating from a bookshop in Vienna. It was smuggled across the Iron Curtain inside a hollowed-out chess piece.',morseDecoded:'Decoded: ',dnaTitle:'DNA Fingerprint',dnaSave:'Save DNA',dnaInfo:'Unique visual signature of current parameters',sandboxTitle:'Sandbox Mode',sandboxOn:'Sandbox ON',sandboxOff:'Sandbox OFF',sandboxAdd:'Add Parameter',sandboxReset:'Reset Defaults',pomodoroTitle:'Pomodoro Timer',pomodoroFocus:'Focus',pomodoroBreak:'Break',pomodoroStart:'Start',pomodoroPause:'Pause',pomodoroReset:'Reset',pomodoroDone:'Session complete!',flipTitle:'Secret Stats',flipStats:'Hidden Statistics',flipTime:'Time Spent',flipChanges:'Parameter Changes',flipGame:'Click the Target',flipBack:'Flip Back',profTitle:'Professor',profGreet:'Hello Agent! I\x27m Professor Workshop. Ask me anything about Web Onion Simulator!',profWhat:'What is this?',profHow:'How does it work?',profWhy:'Why is this important?',profChallenge:'Give me a challenge',profMore:'Tell me more',profQuiz:'Quiz me',profUnknown:'Good question! Try exploring the Spy Browser features to find out.',profPlaceholder:'Ask the professor...',title:'Onion Simulator',subtitle:'🧅 Watch encrypted messages bounce through relay nodes',disconnected:'Disconnected',connected:'Connected',mainSection:'Tor Network Visualization',mainDesc:'Send a message through the onion routing network',sectionA:'How Onion Routing Works',sectionB:'Encryption Layers',sectionC:'Circuit Builder',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is Onion Simulator?',faq_a1:'A Tor network visualization showing how messages are encrypted and routed.',faq_q2:'Is this real Tor?',faq_a2:'No. Simulation for educational purposes.',faq_q3:'How do I change the language?',faq_a3:'Open Settings and pick your language.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Type a message in the input field.',howto_2:'Click Send to watch it route through nodes.',howto_3:'Watch encryption layers peel off at each hop.',howto_4:'Build custom circuits in Section C.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual.',wiki_log_title:'📜 Activity Log',wiki_log:'Timestamped log.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'Local-first.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'🧅 Onion Simulator ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',sendBtn:'Send through Tor',onionText:'Onion routing encrypts your message in multiple layers. Each relay peels off one layer.',encryptionText:'Layer 1 (Entry): Knows your IP. Layer 2 (Middle): Knows nothing. Layer 3 (Exit): Sees destination.',circuitText:'Build custom circuits by selecting relay nodes.',newCircuitBtn:'Build New Circuit',encrypting:'Encrypting message...',routing:'Routing through Tor...',delivered:'Message delivered!',layer:'Layer',peeled:'peeled off at',entryNode:'Entry Guard',middleNode:'Middle Relay',exitNode:'Exit Node',destination:'Destination',you:'You',},
  fr:{matrixTitle:'Pluie Matrix',matrixOn:'Matrix ACTIV\x27',matrixOff:'Matrix D\x27SACTIV\x27',ratingTitle:'Noter cette appli',ratingYours:'Votre note',ratingThanks:'Merci pour votre note !',flashTitle:'Cartes M\xe9moire',flashKnow:'Je sais',flashReview:'\xc0 revoir',flashDone:'Toutes les cartes r\xe9vis\xe9es !',flashProgress:'{0} sur {1} restantes',flash_t1:'Signal',flash_d1:'Un motif d\x27\xe9nergie transmis d\xe9tectable utilis\xe9 pour transmettre des informations.',flash_t2:'Chiffrement',flash_d2:'Le processus d\x27encodage des donn\xe9es pour que seules les parties autoris\xe9es puissent les lire.',flash_t3:'Protocole',flash_d3:'Un ensemble de r\xe8gles r\xe9gissant l\x27\xe9change de donn\xe9es entre appareils ou syst\xe8mes.',flash_t4:'Fr\xe9quence',flash_d4:'Le nombre de cycles par seconde d\x27un signal p\xe9riodique, mesur\xe9 en Hertz.',flash_t5:'Authentification',flash_d5:'Le processus de v\xe9rification de l\x27identit\xe9 d\x27un utilisateur, appareil ou syst\xe8me.',certTitle:'Certificat de R\xe9ussite',certComplete:'F\xe9licitations ! Toutes les apps termin\xe9es !',certProgress:'{0} sur {1} apps termin\xe9es',certDownload:'T\xe9l\xe9charger le Certificat',certName:'Workshop DIY',annotTitle:'Mode Annotation',annotDraw:'Main lev\x27e',annotArrow:'Fl\x27che',annotCircle:'Cercle',annotText:'Texte',annotUndo:'Annuler',annotClear:'Tout effacer',annotSave:'Enregistrer en PNG',annotExit:'Quitter l\x27annotation',bookmarkTitle:'Mes Favoris',bookmarkAdd:'Ajouter aux favoris',bookmarkRemove:'Supprimer',bookmarkCollection:'Ajouter \x27 la collection',bookmarkNew:'Nouvelle collection',bookmarkEmpty:'Aucun favori pour l\x27instant',morseSecret:'Morse Easter Egg',morseBackstory:'Cet outil a ete concu en 1962 par une unite secrete de la CIA operant depuis une librairie a Vienne. Il a ete passe de l autre cote du rideau de fer dans une piece d echecs evidee.',morseDecoded:'D\x27cod\x27: ',dnaTitle:'Empreinte ADN',dnaSave:'Sauvegarder ADN',dnaInfo:'Signature visuelle unique des param\x27tres actuels',sandboxTitle:'Mode Bac \x27 sable',sandboxOn:'Bac \x27 sable ACTIV\x27',sandboxOff:'Bac \x27 sable D\x27SACTIV\x27',sandboxAdd:'Ajouter Param\x27tre',sandboxReset:'R\x27initialiser',pomodoroTitle:'Minuteur Pomodoro',pomodoroFocus:'Concentration',pomodoroBreak:'Pause',pomodoroStart:'D\x27marrer',pomodoroPause:'Pause',pomodoroReset:'R\x27initialiser',pomodoroDone:'Session termin\x27e!',flipTitle:'Stats Secr\x27tes',flipStats:'Statistiques Cach\x27es',flipTime:'Temps Pass\x27',flipChanges:'Modifications',flipGame:'Cliquez la Cible',flipBack:'Retourner',profTitle:'Professeur',profGreet:'Bonjour Agent ! Je suis le Professeur Atelier. Pose-moi n\x27importe quelle question sur Web Onion Simulator !',profWhat:'C\x27est quoi ?',profHow:'Comment \xe7a marche ?',profWhy:'Pourquoi c\x27est important ?',profChallenge:'Donne-moi un d\xe9fi',profMore:'Dis-moi plus',profQuiz:'Teste-moi',profUnknown:'Bonne question ! Essaie d\x27explorer les fonctions de Spy Browser pour le d\xe9couvrir.',profPlaceholder:'Demande au professeur...',title:'Simulateur Oignon',subtitle:'🧅 Regardez les messages chiffres rebondir entre les relais',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Visualisation Reseau Tor',mainDesc:'Envoyez un message a travers le reseau oignon',sectionA:'Comment fonctionne le routage oignon',sectionB:'Couches de chiffrement',sectionC:'Constructeur de circuit',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Qu\'est-ce que le Simulateur Oignon ?',faq_a1:'Une visualisation du reseau Tor.',faq_q2:'C\'est du vrai Tor ?',faq_a2:'Non. Simulation educative.',faq_q3:'Comment changer la langue ?',faq_a3:'Ouvrez Parametres.',faq_q4:'Mes donnees sont privees ?',faq_a4:'Oui. Tout est local.',howto_1:'Tapez un message.',howto_2:'Cliquez Envoyer.',howto_3:'Regardez les couches se detacher.',howto_4:'Construisez des circuits.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'🧅 Simulateur Oignon pret !',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',sendBtn:'Envoyer via Tor',onionText:'Le routage oignon chiffre votre message en couches multiples.',encryptionText:'Couche 1 (Entree): connait votre IP. Couche 2 (Milieu): ne sait rien. Couche 3 (Sortie): voit la destination.',circuitText:'Construisez des circuits personnalises.',newCircuitBtn:'Nouveau Circuit',encrypting:'Chiffrement...',routing:'Routage Tor...',delivered:'Message livre !',layer:'Couche',peeled:'retiree a',entryNode:'Garde d\'entree',middleNode:'Relai intermediaire',exitNode:'Noeud de sortie',destination:'Destination',you:'Vous',},
  ar:{matrixTitle:'مطر الماتريكس',matrixOn:'الماتريكس مفعل',matrixOff:'الماتريكس معطل',ratingTitle:'قيّم هذا التطبيق',ratingYours:'تقييمك',ratingThanks:'شكرا على التقييم!',flashTitle:'بطاقات تعليمية',flashKnow:'أعرفها',flashReview:'راجع لاحقاً',flashDone:'تمت مراجعة جميع البطاقات!',flashProgress:'{0} من {1} متبقية',flash_t1:'إشارة',flash_d1:'نمط طاقة مرسل قابل للكشف يستخدم لنقل المعلومات.',flash_t2:'تشفير',flash_d2:'عملية ترميز البيانات بحيث لا يمكن قراءتها إلا للأطراف المصرح لها.',flash_t3:'بروتوكول',flash_d3:'مجموعة قواعد تحكم تبادل البيانات بين الأجهزة.',flash_t4:'تردد',flash_d4:'عدد الدورات في الثانية لإشارة دورية، تقاس بالهرتز.',flash_t5:'مصادقة',flash_d5:'عملية التحقق من هوية المستخدم أو الجهاز أو النظام.',certTitle:'شهادة إتمام',certComplete:'تهانينا! تم إكمال جميع التطبيقات!',certProgress:'{0} من {1} تطبيقات مكتملة',certDownload:'تحميل الشهادة',certName:'Workshop DIY',annotTitle:'وضع التعليق',annotDraw:'رسم حر',annotArrow:'سهم',annotCircle:'دائرة',annotText:'نص',annotUndo:'تراجع',annotClear:'مسح الكل',annotSave:'حفظ كصورة',annotExit:'خروج من التعليق',bookmarkTitle:'مفضلاتي',bookmarkAdd:'إضافة للمفضلة',bookmarkRemove:'إزالة',bookmarkCollection:'إضافة إلى مجموعة',bookmarkNew:'مجموعة جديدة',bookmarkEmpty:'لا توجد مفضلات بعد',morseSecret:'بيضة مورس الفصحية',morseBackstory:'تم اكتشاف هذه الأداة في خزنة سرية',morseDecoded:'تم فك التشفير: ',dnaTitle:'بصمة الحمض النووي',dnaSave:'حفظ البصمة',dnaInfo:'توقيع بصري فريد للمعلمات الحالية',sandboxTitle:'وضع التجربة',sandboxOn:'التجربة مفعلة',sandboxOff:'التجربة معطلة',sandboxAdd:'إضافة معلمة',sandboxReset:'إعادة التعيين',pomodoroTitle:'مؤقت بومودورو',pomodoroFocus:'تركيز',pomodoroBreak:'استراحة',pomodoroStart:'بدء',pomodoroPause:'إيقاف',pomodoroReset:'إعادة',pomodoroDone:'اكتملت الجلسة!',flipTitle:'إحصائيات سرية',flipStats:'إحصائيات مخفية',flipTime:'الوقت المستغرق',flipChanges:'التغييرات',flipGame:'انقر الهدف',flipBack:'ارجع',profTitle:'الأستاذ',profGreet:'مرحبا أيها العميل! أنا الأستاذ ورشة. اسألني أي شيء!',profWhat:'ما هذا؟',profHow:'كيف يعمل؟',profWhy:'لماذا هذا مهم؟',profChallenge:'أعطني تحديا',profMore:'أخبرني المزيد',profQuiz:'اختبرني',profUnknown:'سؤال جيد! حاول استكشاف الميزات لمعرفة الإجابة.',profPlaceholder:'اسأل الأستاذ...',title:'محاكي البصل',subtitle:'🧅 شاهد الرسائل المشفرة تتنقل عبر عقد التتابع',disconnected:'غير متصل',connected:'متصل',mainSection:'تصور شبكة Tor',mainDesc:'ارسل رسالة عبر شبكة التوجيه البصلي',sectionA:'كيف يعمل التوجيه البصلي',sectionB:'طبقات التشفير',sectionC:'بناء الدائرة',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',faq_q1:'ما هو محاكي البصل؟',faq_a1:'تصور لشبكة Tor يوضح كيفية تشفير الرسائل وتوجيهها.',faq_q2:'هل هذا Tor حقيقي؟',faq_a2:'لا. محاكاة تعليمية.',faq_q3:'كيف اغير اللغة؟',faq_a3:'افتح الاعدادات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء محلي.',howto_1:'اكتب رسالة.',howto_2:'انقر ارسال.',howto_3:'شاهد طبقات التشفير تتقشر.',howto_4:'ابن دوائر مخصصة.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي اولا.',working:'جار…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',ready:'🧅 محاكي البصل جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',sendBtn:'ارسال عبر Tor',onionText:'التوجيه البصلي يشفر رسالتك في طبقات متعددة.',encryptionText:'طبقة 1 (مدخل): تعرف IP. طبقة 2 (وسط): لا تعرف شيئا. طبقة 3 (مخرج): ترى الوجهة.',circuitText:'ابن دوائر مخصصة.',newCircuitBtn:'دائرة جديدة',encrypting:'جاري التشفير...',routing:'جاري التوجيه...',delivered:'تم تسليم الرسالة!',layer:'طبقة',peeled:'ازيلت عند',entryNode:'حارس المدخل',middleNode:'عقدة وسطى',exitNode:'عقدة الخروج',destination:'الوجهة',you:'انت',}
};

/* ═══════ POMODORO TIMER ═══════ */
function initPomodoro(){
  if(document.getElementById('pomodoroPanel'))return;
  var L=LANG[currentLang]||LANG.en;
  var appName=document.title||location.pathname.split('/').filter(Boolean).pop()||'unknown';
  var hdrBtns=document.querySelector('.header-buttons');
  if(!hdrBtns)return;
  var btn=document.createElement('button');
  btn.className='btn-icon-only';btn.id='pomodoroBtn';btn.textContent='\u{1F345}';btn.title=L.pomodoroTitle||'Pomodoro';
  hdrBtns.insertBefore(btn,hdrBtns.firstChild);
  var panel=document.createElement('div');panel.id='pomodoroPanel';
  panel.style.cssText='display:none;position:fixed;top:60px;right:16px;z-index:10000;background:var(--card,#1a1a2e);border:2px solid var(--accent,#e94560);border-radius:16px;padding:20px;min-width:220px;box-shadow:0 8px 32px rgba(0,0,0,0.5);font-family:inherit;color:var(--text,#eee);';
  panel.innerHTML='<div style="text-align:center;font-weight:700;font-size:1.1rem;margin-bottom:12px;" id="pomTitle">'+(L.pomodoroTitle||'Pomodoro')+'</div>'
    +'<div style="text-align:center;margin-bottom:8px;"><svg width="120" height="120" id="pomRingSvg"><circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/><circle id="pomRing" cx="60" cy="60" r="52" fill="none" stroke="var(--accent,#e94560)" stroke-width="8" stroke-linecap="round" stroke-dasharray="326.73" stroke-dashoffset="0" transform="rotate(-90 60 60)" style="transition:stroke-dashoffset 1s linear;"/><text x="60" y="60" text-anchor="middle" dominant-baseline="central" fill="var(--text,#eee)" font-size="24" font-weight="700" id="pomTime">25:00</text></svg></div>'
    +'<div style="text-align:center;margin-bottom:8px;font-size:0.85rem;" id="pomMode">'+(L.pomodoroFocus||'Focus')+'</div>'
    +'<div style="display:flex;gap:6px;justify-content:center;margin-bottom:10px;">'
    +'<button id="pomStart" style="padding:6px 14px;border:none;border-radius:8px;background:var(--accent,#e94560);color:#fff;cursor:pointer;font-weight:600;">'+(L.pomodoroStart||'Start')+'</button>'
    +'<button id="pomPause" style="padding:6px 14px;border:none;border-radius:8px;background:#555;color:#fff;cursor:pointer;font-weight:600;display:none;">'+(L.pomodoroPause||'Pause')+'</button>'
    +'<button id="pomReset" style="padding:6px 14px;border:none;border-radius:8px;background:#333;color:#fff;cursor:pointer;font-weight:600;">'+(L.pomodoroReset||'Reset')+'</button></div>'
    +'<div style="text-align:center;font-size:0.8rem;opacity:0.7;" id="pomSessions">\u{1F345} 0</div>';
  document.body.appendChild(panel);
  var FOCUS=25*60,BREAK=5*60,remaining=FOCUS,running=false,isFocus=true,sessions=0,interval=null,circumf=2*Math.PI*52;
  var ring=document.getElementById('pomRing'),timeEl=document.getElementById('pomTime'),modeEl=document.getElementById('pomMode'),sessEl=document.getElementById('pomSessions');
  var startBtn=document.getElementById('pomStart'),pauseBtn=document.getElementById('pomPause'),resetBtn=document.getElementById('pomReset');
  function fmt(s){var m=Math.floor(s/60),ss=s%60;return String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0');}
  function updateRing(){var total=isFocus?FOCUS:BREAK;var pct=remaining/total;ring.setAttribute('stroke-dashoffset',String(circumf*(1-pct)));}
  function tick(){
    if(!running)return;
    remaining--;timeEl.textContent=fmt(remaining);updateRing();
    if(remaining<=0){clearInterval(interval);running=false;
      startBtn.style.display='inline-block';pauseBtn.style.display='none';
      pomBeep();
      if(isFocus){sessions++;sessEl.textContent='\u{1F345} '+sessions;
        try{var k='pomodoro_'+appName;var d=JSON.parse(localStorage.getItem(k)||'[]');d.push({ts:Date.now(),app:appName});localStorage.setItem(k,JSON.stringify(d));}catch(e){}
        var mc=document.getElementById('mainCard');if(mc)mc.style.boxShadow='';
        isFocus=false;remaining=BREAK;modeEl.textContent=(LANG[currentLang]||LANG.en).pomodoroBreak||'Break';
        ring.setAttribute('stroke','#2ecc71');
      }else{isFocus=true;remaining=FOCUS;modeEl.textContent=(LANG[currentLang]||LANG.en).pomodoroFocus||'Focus';
        ring.setAttribute('stroke','var(--accent,#e94560)');
      }
      timeEl.textContent=fmt(remaining);updateRing();
    }
  }
  function pomBeep(){try{var ac=new(window.AudioContext||window.webkitAudioContext)();var o=ac.createOscillator();var g=ac.createGain();o.connect(g);g.connect(ac.destination);o.frequency.value=880;o.type='sine';g.gain.value=0.15;var t=ac.currentTime;g.gain.exponentialRampToValueAtTime(0.001,t+0.5);o.start(t);o.stop(t+0.5);}catch(e){}}
  startBtn.onclick=function(){if(running)return;running=true;interval=setInterval(tick,1000);startBtn.style.display='none';pauseBtn.style.display='inline-block';
    if(isFocus){var mc=document.getElementById('mainCard');if(mc)mc.style.boxShadow='0 0 20px rgba(233,69,96,0.4)';}};
  pauseBtn.onclick=function(){running=false;clearInterval(interval);startBtn.style.display='inline-block';pauseBtn.style.display='none';};
  resetBtn.onclick=function(){running=false;clearInterval(interval);isFocus=true;remaining=FOCUS;timeEl.textContent=fmt(remaining);ring.setAttribute('stroke-dashoffset','0');ring.setAttribute('stroke','var(--accent,#e94560)');modeEl.textContent=(LANG[currentLang]||LANG.en).pomodoroFocus||'Focus';startBtn.style.display='inline-block';pauseBtn.style.display='none';var mc=document.getElementById('mainCard');if(mc)mc.style.boxShadow='';};
  btn.onclick=function(){panel.style.display=panel.style.display==='none'?'block':'none';};
  document.addEventListener('click',function(e){if(!panel.contains(e.target)&&e.target!==btn&&panel.style.display==='block')panel.style.display='none';});
}

/* ═══════ 3D CARD FLIP ═══════ */
function initCardFlip(){
  var mc=document.getElementById('mainCard');if(!mc||mc.dataset.flipInit)return;mc.dataset.flipInit='1';
  var L=LANG[currentLang]||LANG.en;
  var appName=document.title||location.pathname.split('/').filter(Boolean).pop()||'unknown';
  var style=document.createElement('style');
  style.textContent='.flip-wrapper{perspective:1000px;}.flip-inner{position:relative;transform-style:preserve-3d;transition:transform 0.6s ease;}.flip-inner.flipped{transform:rotateY(180deg);}.flip-front,.flip-back{backface-visibility:hidden;}.flip-back{position:absolute;top:0;left:0;width:100%;height:100%;transform:rotateY(180deg);background:var(--card,#1a1a2e);border-radius:inherit;padding:20px;overflow-y:auto;box-sizing:border-box;color:var(--text,#eee);display:flex;flex-direction:column;gap:10px;}.flip-back h3{margin:0;font-size:1.2rem;color:var(--accent,#e94560);}.flip-back .stat-row{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.1);font-size:0.9rem;}.flip-target-area{position:relative;width:100%;height:120px;background:rgba(0,0,0,0.3);border-radius:8px;overflow:hidden;cursor:crosshair;}.flip-dot{position:absolute;width:20px;height:20px;background:#e94560;border-radius:50%;cursor:pointer;transition:none;}.flip-back-btn{padding:8px 16px;border:none;border-radius:8px;background:var(--accent,#e94560);color:#fff;cursor:pointer;font-weight:600;align-self:center;margin-top:auto;}';
  document.head.appendChild(style);
  var wrapper=document.createElement('div');wrapper.className='flip-wrapper';
  mc.parentNode.insertBefore(wrapper,mc);
  var inner=document.createElement('div');inner.className='flip-inner';
  wrapper.appendChild(inner);
  mc.classList.add('flip-front');inner.appendChild(mc);
  var back=document.createElement('div');back.className='flip-back';
  var timeKey='apptime_'+appName,changeKey='appchanges_'+appName,scoreKey='quizScore_'+appName;
  var timeSpent=0;try{timeSpent=parseInt(localStorage.getItem(timeKey)||'0');}catch(e){}
  var changes=0;try{changes=parseInt(localStorage.getItem(changeKey)||'0');}catch(e){}
  var bestScore=0;try{bestScore=parseInt(localStorage.getItem(scoreKey)||'0');}catch(e){}
  var facts=['Radio waves travel at the speed of light.','The first computer bug was a real moth.','WiFi stands for nothing - it is a brand name.','Bluetooth is named after a Viking king.','The first email was sent in 1971.','morse code SOS does not stand for anything.','A byte has 256 possible values.','The first webcam watched a coffee pot.','GPS needs 4 satellites for 3D positioning.','Arduino was named after a bar in Italy.'];
  var fact=facts[Math.floor(Math.random()*facts.length)];
  back.innerHTML='<h3>\u{1F510} '+(L.flipTitle||'Secret Stats')+'</h3>'
    +'<div class="stat-row"><span>'+(L.flipTime||'Time Spent')+'</span><span id="flipTimeVal">'+Math.floor(timeSpent/60)+'m '+timeSpent%60+'s</span></div>'
    +'<div class="stat-row"><span>'+(L.flipChanges||'Parameter Changes')+'</span><span>'+changes+'</span></div>'
    +'<div class="stat-row"><span>Best Quiz Score</span><span>'+bestScore+'%</span></div>'
    +'<div class="stat-row"><span>Achievements</span><span id="flipBadges">-</span></div>'
    +'<div style="font-size:0.85rem;"><strong>'+(L.flipGame||'Click the Target')+'</strong><div class="flip-target-area" id="flipTargetArea"></div><div style="text-align:center;margin-top:4px;font-size:0.8rem;" id="flipGameScore">Score: 0</div></div>'
    +'<div style="font-size:0.8rem;font-style:italic;opacity:0.7;">\u{1F4A1} '+fact+'</div>'
    +'<button class="flip-back-btn" id="flipBackBtn">\u{21A9}\uFE0F '+(L.flipBack||'Flip Back')+'</button>';
  inner.appendChild(back);
  var gameScore=0,gameActive=false;
  function spawnDot(){var area=document.getElementById('flipTargetArea');if(!area)return;area.innerHTML='';var dot=document.createElement('div');dot.className='flip-dot';dot.style.left=Math.random()*(area.offsetWidth-20)+'px';dot.style.top=Math.random()*(area.offsetHeight-20)+'px';dot.onclick=function(e){e.stopPropagation();gameScore++;var el=document.getElementById('flipGameScore');if(el)el.textContent='Score: '+gameScore;spawnDot();};area.appendChild(dot);}
  mc.addEventListener('dblclick',function(e){if(inner.classList.contains('flipped'))return;inner.classList.add('flipped');gameScore=0;var el=document.getElementById('flipGameScore');if(el)el.textContent='Score: 0';spawnDot();
    try{var badges=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('badge_')===0){badges.push(k.replace('badge_',''));}}var bEl=document.getElementById('flipBadges');if(bEl)bEl.textContent=badges.length?badges.join(', '):'-';}catch(e){}});
  document.getElementById('flipBackBtn').onclick=function(e){e.stopPropagation();inner.classList.remove('flipped');};
  setInterval(function(){try{var v=parseInt(localStorage.getItem(timeKey)||'0');localStorage.setItem(timeKey,String(v+1));}catch(e){}},1000);
}


/* ═══════ PROFESSOR CHAT ═══════ */
function initProfessorChat(){
  var L=LANG[document.documentElement.lang||'en'];
  if(!L||!L.profTitle)return;
  var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
  var storageKey='profChat_'+appDir;
  var isOpen=false;
  var history=[];
  try{var saved=sessionStorage.getItem(storageKey);if(saved)history=JSON.parse(saved);}catch(e){}
  var greeted=history.length>0;

  /* ── floating button ── */
  var fab=document.createElement('button');
  fab.className='btn-icon-only';
  fab.setAttribute('aria-label',L.profTitle||'Professor');
  fab.textContent='\uD83C\uDF93';
  fab.style.cssText='position:fixed;bottom:18px;left:18px;z-index:10100;width:48px;height:48px;border-radius:50%;border:2px solid var(--accent,#d4af37);background:var(--card-bg,#1a1a2e);color:#fff;font-size:1.5rem;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;transition:transform 0.2s;';
  fab.onmouseenter=function(){fab.style.transform='scale(1.15)';};
  fab.onmouseleave=function(){fab.style.transform='scale(1)';};
  document.body.appendChild(fab);

  /* ── chat panel ── */
  var panel=document.createElement('div');
  panel.id='profChatPanel';
  panel.style.cssText='position:fixed;bottom:75px;left:18px;z-index:10101;width:300px;height:400px;background:var(--card-bg,#12121f);border:1px solid var(--accent,#d4af37);border-radius:12px;display:none;flex-direction:column;box-shadow:0 8px 32px rgba(0,0,0,0.6);font-family:inherit;overflow:hidden;';

  /* header */
  var hdr=document.createElement('div');
  hdr.style.cssText='display:flex;align-items:center;gap:8px;padding:10px 12px;background:rgba(212,175,55,0.12);border-bottom:1px solid rgba(212,175,55,0.2);flex-shrink:0;';
  var avatar=document.createElement('div');
  avatar.style.cssText='width:32px;height:32px;border-radius:50%;background:var(--accent,#d4af37);display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:0.9rem;color:#000;flex-shrink:0;';
  avatar.textContent='P';
  var hdrTitle=document.createElement('span');
  hdrTitle.style.cssText='font-weight:600;font-size:0.95rem;color:var(--text,#eee);flex:1;';
  hdrTitle.textContent=L.profTitle||'Professor';
  var closeBtn=document.createElement('button');
  closeBtn.textContent='\u2715';
  closeBtn.style.cssText='background:none;border:none;color:var(--text,#aaa);font-size:1.1rem;cursor:pointer;padding:2px 6px;';
  closeBtn.onclick=function(){togglePanel(false);};
  hdr.appendChild(avatar);hdr.appendChild(hdrTitle);hdr.appendChild(closeBtn);
  panel.appendChild(hdr);

  /* messages area */
  var msgs=document.createElement('div');
  msgs.id='profMsgs';
  msgs.style.cssText='flex:1;overflow-y:auto;padding:10px;display:flex;flex-direction:column;gap:8px;';
  panel.appendChild(msgs);

  /* quick buttons */
  var qbar=document.createElement('div');
  qbar.style.cssText='display:flex;flex-wrap:wrap;gap:4px;padding:6px 10px;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0;';
  var quickKeys=[
    {key:'profWhat',fallback:'What is this?'},
    {key:'profHow',fallback:'How does it work?'},
    {key:'profWhy',fallback:'Why is this important?'},
    {key:'profChallenge',fallback:'Give me a challenge'}
  ];
  quickKeys.forEach(function(q){
    var qb=document.createElement('button');
    qb.textContent=L[q.key]||q.fallback;
    qb.style.cssText='font-size:0.7rem;padding:3px 8px;border-radius:12px;border:1px solid rgba(212,175,55,0.3);background:rgba(212,175,55,0.08);color:var(--text,#ccc);cursor:pointer;white-space:nowrap;';
    qb.onclick=function(){handleUserMsg(L[q.key]||q.fallback);};
    qbar.appendChild(qb);
  });
  panel.appendChild(qbar);

  /* input area */
  var ibar=document.createElement('div');
  ibar.style.cssText='display:flex;gap:6px;padding:8px 10px;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0;';
  var inp=document.createElement('input');
  inp.type='text';
  inp.placeholder=L.profPlaceholder||'Ask the professor...';
  inp.style.cssText='flex:1;padding:6px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.06);color:var(--text,#eee);font-size:0.85rem;outline:none;';
  inp.onkeydown=function(e){if(e.key==='Enter'&&inp.value.trim()){handleUserMsg(inp.value.trim());inp.value='';}};
  var sendBtn=document.createElement('button');
  sendBtn.textContent='\u27A4';
  sendBtn.style.cssText='padding:6px 10px;border-radius:8px;border:1px solid var(--accent,#d4af37);background:rgba(212,175,55,0.15);color:var(--accent,#d4af37);cursor:pointer;font-size:0.9rem;';
  sendBtn.onclick=function(){if(inp.value.trim()){handleUserMsg(inp.value.trim());inp.value='';}};
  ibar.appendChild(inp);ibar.appendChild(sendBtn);
  panel.appendChild(ibar);
  document.body.appendChild(panel);

  /* ── helpers ── */
  function addBubble(text,isUser,typewriter){
    var bub=document.createElement('div');
    bub.style.cssText='max-width:85%;padding:8px 12px;border-radius:10px;font-size:0.82rem;line-height:1.45;word-wrap:break-word;'+(isUser?'align-self:flex-end;background:rgba(212,175,55,0.18);color:var(--text,#eee);':'align-self:flex-start;background:rgba(255,255,255,0.07);color:var(--text,#ddd);');
    msgs.appendChild(bub);
    msgs.scrollTop=msgs.scrollHeight;
    if(typewriter&&!isUser){
      var i=0;bub.textContent='';
      var iv=setInterval(function(){if(i<text.length){bub.textContent+=text[i];i++;msgs.scrollTop=msgs.scrollHeight;}else{clearInterval(iv);}},30);
    }else{
      bub.textContent=text;
    }
    return bub;
  }

  function saveHistory(){
    try{sessionStorage.setItem(storageKey,JSON.stringify(history.slice(-50)));}catch(e){}
  }

  function getAnswer(q){
    var ql=q.toLowerCase();
    /* What is this? */
    if(ql.indexOf('what')>=0||ql.indexOf('quoi')>=0||ql.indexOf('\u0645\u0627 ')>=0||ql===((L.profWhat||'').toLowerCase())){
      return L.mainDesc||L.subtitle||'This is an interactive workshop app.';
    }
    /* How does it work? */
    if(ql.indexOf('how')>=0||ql.indexOf('comment')>=0||ql.indexOf('marche')>=0||ql.indexOf('\u0643\u064a\u0641')>=0||ql===((L.profHow||'').toLowerCase())){
      var parts=[];
      if(L.step1Desc)parts.push(L.step1Desc);
      if(L.step2Desc)parts.push(L.step2Desc);
      if(L.step3Desc)parts.push(L.step3Desc);
      return parts.length?parts.join(' \u2192 '):(L.mainDesc||'Explore the controls to see how it works!');
    }
    /* Why is this important? */
    if(ql.indexOf('why')>=0||ql.indexOf('important')>=0||ql.indexOf('pourquoi')>=0||ql.indexOf('\u0644\u0645\u0627\u0630\u0627')>=0||ql===((L.profWhy||'').toLowerCase())){
      var r=L.purpose||'';
      if(!r){var lp=[];for(var k=1;k<=4;k++){if(L['learn'+k])lp.push(L['learn'+k]);}r=lp.join(' ');}
      return r||'Understanding these concepts builds real-world skills!';
    }
    /* Give me a challenge */
    if(ql.indexOf('challenge')>=0||ql.indexOf('d\xe9fi')>=0||ql.indexOf('\u062a\u062d\u062f\u064a')>=0||ql===((L.profChallenge||'').toLowerCase())){
      return L.challenge1||L.daily_d1||'Try changing every parameter and observe the results!';
    }
    /* Tell me more */
    if(ql.indexOf('more')>=0||ql.indexOf('plus')>=0||ql.indexOf('\u0627\u0644\u0645\u0632\u064a\u062f')>=0||ql===((L.profMore||'').toLowerCase())){
      var wk=[];for(var w=1;w<=5;w++){if(L['wiki'+w+'_title'])wk.push(L['wiki'+w+'_title']+': '+( L['wiki'+w+'_text']||''));}
      return wk.length?wk.join(' | '):(L.mainDesc||'Explore the Wiki tab for deeper knowledge!');
    }
    /* Quiz me */
    if(ql.indexOf('quiz')>=0||ql.indexOf('test')>=0||ql.indexOf('\u0627\u062e\u062a\u0628\u0631')>=0||ql===((L.profQuiz||'').toLowerCase())){
      if(typeof initQuizMode==='function'){try{initQuizMode();}catch(e){}}
      return L.quiz_q1||(L.challenge1?'Here is a challenge: '+L.challenge1:'Try the Quiz feature if available!');
    }
    /* Unknown */
    return L.profUnknown||'Good question! Try exploring the features to find out.';
  }

  function handleUserMsg(text){
    history.push({r:'u',t:text});
    addBubble(text,true,false);
    var answer=getAnswer(text);
    history.push({r:'p',t:answer});
    saveHistory();
    setTimeout(function(){addBubble(answer,false,true);},300);
  }

  function togglePanel(show){
    isOpen=typeof show==='boolean'?show:!isOpen;
    panel.style.display=isOpen?'flex':'none';
    if(isOpen&&!greeted){
      greeted=true;
      var greet=L.profGreet||('Hello Agent! I\x27m Professor Workshop. Ask me anything!');
      history.push({r:'p',t:greet});
      saveHistory();
      addBubble(greet,false,true);
    }
    if(isOpen)inp.focus();
  }

  /* restore history */
  function restoreHistory(){
    history.forEach(function(m){addBubble(m.t,m.r==='u',false);});
  }

  fab.onclick=function(){togglePanel();};

  /* restore on load if history exists */
  if(history.length>0){restoreHistory();}
}

document.addEventListener('DOMContentLoaded',function(){try{initProfessorChat();}catch(e){console.warn('ProfessorChat init:',e);}});


/* === MATRIX RAIN BACKGROUND === */
function initMatrixRain(){
 if(document.getElementById('matrixRainBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var STORAGE_KEY='matrixRain_'+location.pathname;
 var canvas=null;var ctx=null;var animId=null;var active=false;
 var columns=[];var fontSize=14;var drops=[];
 var KATAKANA='\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F2\u30F3';
 var LATIN='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
 var DIGITS='0123456789';
 var charPool=KATAKANA+LATIN+DIGITS;
 var kw=document.querySelector('meta[name="keywords"]');
 if(kw&&kw.content)charPool+=kw.content.replace(/[\s,]+/g,'').toUpperCase();
 var matrixBtn=document.createElement('button');matrixBtn.id='matrixRainBtn';matrixBtn.className='btn-icon-only';
 matrixBtn.textContent='\u25C9';matrixBtn.title=L.matrixTitle||'Matrix Rain';matrixBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(matrixBtn);else{matrixBtn.style.cssText+='position:fixed;top:0.5rem;right:12rem;z-index:9999;';document.body.appendChild(matrixBtn);}
 function createCanvas(){
  canvas=document.createElement('canvas');canvas.id='matrixRainCanvas';
  canvas.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
  document.body.insertBefore(canvas,document.body.firstChild);
  ctx=canvas.getContext('2d');resize();
 }
 function resize(){
  if(!canvas)return;canvas.width=window.innerWidth;canvas.height=window.innerHeight;
  var cols=Math.floor(canvas.width/fontSize);drops=[];
  for(var i=0;i<cols;i++)drops[i]=Math.random()*canvas.height/fontSize|0;
 }
 function draw(){
  if(!canvas||!ctx)return;
  ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#00ff41';ctx.font=fontSize+'px monospace';
  for(var i=0;i<drops.length;i++){
   var ch=charPool[Math.floor(Math.random()*charPool.length)];
   var x=i*fontSize;var y=drops[i]*fontSize;
   ctx.globalAlpha=0.6+Math.random()*0.4;
   ctx.fillText(ch,x,y);
   if(y>canvas.height&&Math.random()>0.975)drops[i]=0;
   drops[i]++;
  }
  ctx.globalAlpha=1;
  animId=requestAnimationFrame(draw);
 }
 function start(){
  active=true;createCanvas();draw();
  matrixBtn.style.background='#00ff41';matrixBtn.style.color='#000';matrixBtn.style.borderRadius='6px';
  try{localStorage.setItem(STORAGE_KEY,'1');}catch(e){}
 }
 function stop(){
  active=false;if(animId)cancelAnimationFrame(animId);animId=null;
  if(canvas){canvas.remove();canvas=null;ctx=null;}
  matrixBtn.style.background='';matrixBtn.style.color='';matrixBtn.style.borderRadius='';
  try{localStorage.removeItem(STORAGE_KEY);}catch(e){}
 }
 matrixBtn.onclick=function(){if(active)stop();else start();};
 window.addEventListener('resize',function(){if(active)resize();});
 try{if(localStorage.getItem(STORAGE_KEY)==='1')start();}catch(e){}
}

/* === APP RATING SYSTEM === */
function initRating(){
 if(document.getElementById('appRatingWrap'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var appPath=location.pathname.replace(/\/index\.html$/,'').replace(/\/$/,'');
 var STORAGE_KEY='appRating_'+appPath;
 var INDEX_KEY='ratingsIndex';
 var wrap=document.createElement('div');wrap.id='appRatingWrap';
 wrap.style.cssText='display:flex;align-items:center;gap:8px;margin:4px 0;flex-wrap:wrap;';
 var starsWrap=document.createElement('span');starsWrap.style.cssText='display:inline-flex;gap:2px;cursor:pointer;';
 var msgSpan=document.createElement('span');msgSpan.style.cssText='font-size:0.75rem;color:var(--accent,#c8aa64);opacity:0.8;';
 var currentRating=0;
 try{currentRating=parseInt(localStorage.getItem(STORAGE_KEY))||0;}catch(e){}
 var stars=[];
 for(var i=1;i<=5;i++){
  (function(idx){
   var star=document.createElement('span');
   star.textContent=idx<=currentRating?'\u2605':'\u2606';
   star.style.cssText='font-size:1.2rem;color:'+(idx<=currentRating?'#ffd700':'#888')+';transition:color 0.2s;user-select:none;';
   star.onmouseenter=function(){for(var j=0;j<5;j++){stars[j].style.color=j<idx?'#ffd700':'#888';stars[j].textContent=j<idx?'\u2605':'\u2606';}};
   star.onclick=function(){
    currentRating=idx;
    try{localStorage.setItem(STORAGE_KEY,String(idx));
     var index={};try{index=JSON.parse(localStorage.getItem(INDEX_KEY)||'{}');}catch(e){}
     index[appPath]=idx;localStorage.setItem(INDEX_KEY,JSON.stringify(index));
    }catch(e){}
    for(var j=0;j<5;j++){stars[j].style.color=j<idx?'#ffd700':'#888';stars[j].textContent=j<idx?'\u2605':'\u2606';}
    msgSpan.textContent=(L.ratingYours||'You rated')+': '+idx+'/5';
   };
   stars.push(star);starsWrap.appendChild(star);
  })(i);
 }
 starsWrap.onmouseleave=function(){for(var j=0;j<5;j++){stars[j].style.color=j<currentRating?'#ffd700':'#888';stars[j].textContent=j<currentRating?'\u2605':'\u2606';}};
 wrap.appendChild(starsWrap);
 if(currentRating>0)msgSpan.textContent=(L.ratingYours||'You rated')+': '+currentRating+'/5';
 wrap.appendChild(msgSpan);
 var titleEl=document.querySelector('.main-title')||document.querySelector('h1')||document.querySelector('.app-title');
 if(titleEl&&titleEl.parentNode)titleEl.parentNode.insertBefore(wrap,titleEl.nextSibling);
 else{wrap.style.cssText+='position:fixed;top:3rem;left:1rem;z-index:9999;';document.body.appendChild(wrap);}
}
document.addEventListener('DOMContentLoaded',function(){try{initMatrixRain();}catch(e){console.warn('Matrix init:',e);}try{initRating();}catch(e){console.warn('Rating init:',e);}});



/* === FLASHCARD SYSTEM === */
function initFlashcards(){
 if(document.getElementById('flashcardsBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 if(!L.flashTitle)return;
 var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
 var storageKey='flash_score_'+appDir;
 var cards=[];
 for(var i=1;i<=5;i++){
  var t=L['flash_t'+i];var d=L['flash_d'+i];
  if(t&&d)cards.push({term:t,def:d});
 }
 if(cards.length===0)return;
 var btn=document.createElement('button');
 btn.id='flashcardsBtn';
 btn.className='btn-icon-only';
 btn.textContent='\ud83c\udccf';
 btn.title=L.flashTitle||'Flashcards';
 btn.style.cssText='cursor:pointer;font-size:1.1rem;';
 btn.onclick=function(){
  var deck=cards.slice();
  var known=0;
  var total=deck.length;
  var touchStartX=0;
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:20px;box-sizing:border-box;';
  var box=document.createElement('div');
  box.style.cssText='max-width:420px;width:95%;text-align:center;color:var(--text,#e4ddd0);';
  var h3=document.createElement('h3');
  h3.style.cssText='color:var(--accent,#d4a03c);margin-bottom:0.8rem;font-family:Orbitron,monospace;';
  h3.textContent=L.flashTitle;
  box.appendChild(h3);
  var progBar=document.createElement('div');
  progBar.style.cssText='background:rgba(255,255,255,0.1);border-radius:8px;height:8px;margin-bottom:1rem;overflow:hidden;';
  var progFill=document.createElement('div');
  progFill.style.cssText='height:100%;background:var(--accent,#d4a03c);border-radius:8px;transition:width 0.3s;width:0%;';
  progBar.appendChild(progFill);
  box.appendChild(progBar);
  var progText=document.createElement('div');
  progText.style.cssText='font-size:0.85rem;opacity:0.7;margin-bottom:1rem;';
  box.appendChild(progText);
  var cardWrap=document.createElement('div');
  cardWrap.style.cssText='perspective:800px;margin-bottom:1.2rem;';
  var card=document.createElement('div');
  card.style.cssText='width:100%;min-height:200px;position:relative;transform-style:preserve-3d;transition:transform 0.5s;cursor:pointer;';
  var front=document.createElement('div');
  front.style.cssText='position:absolute;inset:0;backface-visibility:hidden;background:var(--panel,#1a1a2e);border:2px solid var(--accent,#d4a03c);border-radius:14px;display:flex;align-items:center;justify-content:center;padding:1.5rem;font-size:1.3rem;font-weight:700;color:var(--accent,#d4a03c);font-family:Orbitron,monospace;min-height:200px;box-sizing:border-box;';
  var back=document.createElement('div');
  back.style.cssText='position:absolute;inset:0;backface-visibility:hidden;background:var(--panel,#1a1a2e);border:2px solid var(--accent,#d4a03c);border-radius:14px;display:flex;align-items:center;justify-content:center;padding:1.5rem;font-size:1rem;color:var(--text,#e4ddd0);transform:rotateY(180deg);min-height:200px;box-sizing:border-box;line-height:1.5;';
  card.appendChild(front);card.appendChild(back);
  cardWrap.appendChild(card);box.appendChild(cardWrap);
  var flipped=false;
  card.onclick=function(){flipped=!flipped;card.style.transform=flipped?'rotateY(180deg)':'rotateY(0)';};
  cardWrap.addEventListener('touchstart',function(e){touchStartX=e.touches[0].clientX;},{passive:true});
  cardWrap.addEventListener('touchend',function(e){
   var dx=e.changedTouches[0].clientX-touchStartX;
   if(Math.abs(dx)>50){if(dx>0)doKnow();else doReview();}
  });
  var btns=document.createElement('div');
  btns.style.cssText='display:flex;gap:1rem;justify-content:center;';
  var reviewBtn=document.createElement('button');
  reviewBtn.style.cssText='background:#c0392b;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.95rem;';
  reviewBtn.textContent='\u2717 '+(L.flashReview||'Review later');
  var knowBtn=document.createElement('button');
  knowBtn.style.cssText='background:#27ae60;color:#fff;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.95rem;';
  knowBtn.textContent='\u2713 '+(L.flashKnow||'Know it');
  btns.appendChild(reviewBtn);btns.appendChild(knowBtn);
  box.appendChild(btns);
  ov.appendChild(box);
  ov.onclick=function(e){if(e.target===ov)ov.remove();};
  document.body.appendChild(ov);
  function updateCard(){
   if(deck.length===0){
    front.textContent='\ud83c\udf89';
    back.textContent=L.flashDone||'All cards reviewed!';
    progFill.style.width='100%';
    progText.textContent=(L.flashProgress||'{0} of {1} remaining').replace('{0}','0').replace('{1}',String(total));
    try{localStorage.setItem(storageKey,JSON.stringify({known:known,total:total,date:new Date().toISOString()}));}catch(e){}
    reviewBtn.style.display='none';knowBtn.style.display='none';
    return;
   }
   flipped=false;card.style.transform='rotateY(0)';
   front.textContent=deck[0].term;
   back.textContent=deck[0].def;
   var pct=Math.round((1-deck.length/total)*100);
   progFill.style.width=pct+'%';
   progText.textContent=(L.flashProgress||'{0} of {1} remaining').replace('{0}',String(deck.length)).replace('{1}',String(total));
  }
  function doKnow(){if(deck.length>0){deck.shift();known++;updateCard();}}
  function doReview(){if(deck.length>0){var c=deck.shift();deck.push(c);updateCard();}}
  knowBtn.onclick=function(e){e.stopPropagation();doKnow();};
  reviewBtn.onclick=function(e){e.stopPropagation();doReview();};
  updateCard();
 };
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(btn);
 else{btn.style.cssText+='position:fixed;top:0.5rem;right:8rem;z-index:9999;';document.body.appendChild(btn);}
}
document.addEventListener('DOMContentLoaded',function(){try{initFlashcards();}catch(e){console.warn('Flashcards init:',e);}});

/* === PROGRESS CERTIFICATE === */
function initCertificate(){
 if(document.getElementById('certBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 if(!L.certTitle)return;
 var pathParts=location.pathname.split('/').filter(Boolean);
 var catDir='';var appDir='';
 for(var p=0;p<pathParts.length-1;p++){
  if(/^\d{2}-/.test(pathParts[p])){catDir=pathParts[p];appDir=pathParts[p+1]||'';break;}
 }
 if(!catDir)return;
 var catKey='cert_cat_'+catDir;
 var visited={};
 try{visited=JSON.parse(localStorage.getItem(catKey)||'{}');}catch(e){}
 if(appDir){visited[appDir]=Date.now();try{localStorage.setItem(catKey,JSON.stringify(visited));}catch(e){}}
 var siblingApps=[];
 try{
  var scripts=document.querySelectorAll('script[src]');
  scripts.forEach(function(s){
   var src=s.getAttribute('src')||'';
   if(src.indexOf('catalog')>-1||src.indexOf('index')>-1){
    var m=src.match(/(\d{2}-[^/]+)/);
    if(m)catDir=m[1];
   }
  });
 }catch(e){}
 var catName=catDir.replace(/^\d{2}-/,'').replace(/-/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();});
 var btn=document.createElement('button');
 btn.id='certBtn';
 btn.className='btn-icon-only';
 btn.textContent='\ud83c\udfc6';
 btn.title=L.certTitle||'Certificate';
 btn.style.cssText='cursor:pointer;font-size:1.1rem;';
 btn.onclick=function(){
  var visitedCount=Object.keys(visited).length;
  var totalApps=Math.max(visitedCount,3);
  var allDone=visitedCount>=totalApps&&visitedCount>1;
  var ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;overflow-y:auto;padding:20px;box-sizing:border-box;';
  var box=document.createElement('div');
  box.style.cssText='background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:2rem;max-width:660px;width:95%;text-align:center;color:var(--text,#e4ddd0);';
  var h3=document.createElement('h3');
  h3.style.cssText='color:var(--accent,#d4a03c);margin-bottom:1rem;font-family:Orbitron,monospace;';
  h3.textContent=L.certTitle;
  box.appendChild(h3);
  var progWrap=document.createElement('div');
  progWrap.style.cssText='margin-bottom:1rem;';
  var progBar=document.createElement('div');
  progBar.style.cssText='background:rgba(255,255,255,0.1);border-radius:8px;height:10px;overflow:hidden;margin-bottom:0.5rem;';
  var progFill=document.createElement('div');
  var pct=totalApps>0?Math.min(100,Math.round(visitedCount/totalApps*100)):0;
  progFill.style.cssText='height:100%;background:var(--accent,#d4a03c);border-radius:8px;transition:width 0.5s;width:'+pct+'%;';
  progBar.appendChild(progFill);
  progWrap.appendChild(progBar);
  var progLabel=document.createElement('div');
  progLabel.style.cssText='font-size:0.9rem;opacity:0.8;';
  progLabel.textContent=(L.certProgress||'{0} of {1} apps completed').replace('{0}',String(visitedCount)).replace('{1}',String(totalApps));
  progWrap.appendChild(progLabel);
  box.appendChild(progWrap);
  if(allDone){
   var canvas=document.createElement('canvas');
   canvas.width=600;canvas.height=400;
   canvas.style.cssText='width:100%;max-width:600px;border-radius:8px;margin:1rem 0;';
   box.appendChild(canvas);
   var ctx=canvas.getContext('2d');
   ctx.fillStyle='#0b0d24';ctx.fillRect(0,0,600,400);
   ctx.strokeStyle='#d4a03c';ctx.lineWidth=6;
   ctx.strokeRect(10,10,580,380);
   ctx.strokeStyle='#b8941f';ctx.lineWidth=2;
   ctx.strokeRect(18,18,564,364);
   ctx.fillStyle='#d4a03c';ctx.font='bold 22px Orbitron,monospace';
   var certText=L.certTitle||'CERTIFICATE OF COMPLETION';
   ctx.fillText(certText,(600-ctx.measureText(certText).width)/2,70);
   ctx.strokeStyle='#d4a03c';ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(100,85);ctx.lineTo(500,85);ctx.stroke();
   ctx.fillStyle='#e4ddd0';ctx.font='16px Tajawal,sans-serif';
   var compText=L.certComplete||'Congratulations! All apps completed!';
   ctx.fillText(compText,(600-ctx.measureText(compText).width)/2,130);
   ctx.fillStyle='#d4a03c';ctx.font='bold 20px Orbitron,monospace';
   ctx.fillText(catName,(600-ctx.measureText(catName).width)/2,180);
   ctx.fillStyle='#e4ddd0';ctx.font='14px Tajawal,sans-serif';
   var dateStr=new Date().toLocaleDateString();
   ctx.fillText(dateStr,(600-ctx.measureText(dateStr).width)/2,220);
   var ranks=['Recruit','Field Agent','Special Agent','Senior Operative','Shadow Commander','Ghost Director'];
   var rank=ranks[Math.min(ranks.length-1,Math.floor(visitedCount/3))];
   ctx.fillStyle='#ffd700';ctx.font='bold 18px Orbitron,monospace';
   ctx.fillText(rank,(600-ctx.measureText(rank).width)/2,260);
   ctx.beginPath();ctx.arc(300,330,35,0,Math.PI*2);
   ctx.fillStyle='rgba(212,160,60,0.15)';ctx.fill();
   ctx.strokeStyle='#d4a03c';ctx.lineWidth=3;ctx.stroke();
   ctx.beginPath();ctx.arc(300,330,28,0,Math.PI*2);
   ctx.strokeStyle='#b8941f';ctx.lineWidth=1.5;ctx.stroke();
   ctx.fillStyle='#d4a03c';ctx.font='bold 20px serif';
   ctx.fillText('\u2605',292,337);
   ctx.fillStyle='rgba(212,160,60,0.08)';ctx.font='10px monospace';
   var certName=L.certName||'Workshop DIY';
   ctx.fillStyle='#888';ctx.font='11px Tajawal,sans-serif';
   ctx.fillText(certName,(600-ctx.measureText(certName).width)/2,390);
   var dlBtn=document.createElement('button');
   dlBtn.textContent=L.certDownload||'Download Certificate';
   dlBtn.style.cssText='margin-top:1rem;background:var(--accent,#d4a03c);color:#000;border:none;padding:10px 24px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.95rem;';
   dlBtn.onclick=function(){
    var link=document.createElement('a');
    link.download='certificate-'+catDir+'.png';
    link.href=canvas.toDataURL('image/png');
    link.click();
   };
   box.appendChild(dlBtn);
  }else{
   var lockMsg=document.createElement('div');
   lockMsg.style.cssText='font-size:2.5rem;margin:1rem 0;';
   lockMsg.textContent='\ud83d\udd12';
   box.appendChild(lockMsg);
   var hint=document.createElement('div');
   hint.style.cssText='opacity:0.6;font-size:0.9rem;';
   hint.textContent='Visit all apps in this category to unlock the certificate.';
   box.appendChild(hint);
  }
  var appList=document.createElement('div');
  appList.style.cssText='margin-top:1rem;text-align:left;max-height:150px;overflow-y:auto;padding:0.5rem;background:rgba(0,0,0,0.3);border-radius:8px;font-size:0.8rem;';
  Object.keys(visited).sort().forEach(function(a){
   var row=document.createElement('div');
   row.style.cssText='padding:2px 4px;opacity:0.7;';
   row.textContent='\u2713 '+a;
   appList.appendChild(row);
  });
  if(Object.keys(visited).length>0)box.appendChild(appList);
  ov.appendChild(box);
  ov.onclick=function(e){if(e.target===ov)ov.remove();};
  document.body.appendChild(ov);
 };
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(btn);
 else{btn.style.cssText+='position:fixed;top:0.5rem;right:9.5rem;z-index:9999;';document.body.appendChild(btn);}
}
document.addEventListener('DOMContentLoaded',function(){try{initCertificate();}catch(e){console.warn('Certificate init:',e);}});



/* === ANNOTATION MODE === */
function initAnnotation(){
 if(document.getElementById('annotBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var annotBtn=document.createElement('button');annotBtn.id='annotBtn';annotBtn.className='btn-icon-only';
 annotBtn.textContent='\u270F\uFE0F';annotBtn.title=L.annotTitle||'Annotation Mode';annotBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(annotBtn);else{annotBtn.style.cssText+='position:fixed;top:0.5rem;right:8rem;z-index:9999;';document.body.appendChild(annotBtn);}
 var annotActive=false;var overlay=null;var toolbar=null;var ctx=null;
 var currentTool='pen';var currentColor='#ff0000';var currentWidth=3;
 var undoStack=[];var isDrawing=false;var startX=0;var startY=0;
 var colors=['#ff0000','#ffff00','#00cc00','#3399ff','#ffffff'];
 var appKey='annot_'+window.location.pathname;
 function createOverlay(){
  var simC=document.getElementById('simCanvas');
  if(!simC)return null;
  var rect=simC.getBoundingClientRect();
  var c=document.createElement('canvas');c.id='annotOverlay';
  c.width=simC.width;c.height=simC.height;
  c.style.cssText='position:absolute;top:'+rect.top+'px;left:'+rect.left+'px;width:'+rect.width+'px;height:'+rect.height+'px;z-index:9990;cursor:crosshair;';
  document.body.appendChild(c);
  var saved=sessionStorage.getItem(appKey);
  if(saved){var img=new Image();img.onload=function(){c.getContext('2d').drawImage(img,0,0);};img.src=saved;}
  return c;
 }
 function saveState(){
  if(overlay)undoStack.push(overlay.toDataURL());
  if(undoStack.length>30)undoStack.shift();
 }
 function persistSession(){if(overlay)sessionStorage.setItem(appKey,overlay.toDataURL());}
 function createToolbar(){
  var tb=document.createElement('div');tb.id='annotToolbar';
  tb.style.cssText='position:fixed;top:60px;right:10px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:10px;z-index:9995;display:flex;flex-direction:column;gap:6px;align-items:center;font-size:0.75rem;color:var(--text,#e4ddd0);';
  var tools=[{id:'pen',label:L.annotDraw||'Freehand',icon:'\u270D\uFE0F'},{id:'arrow',label:L.annotArrow||'Arrow',icon:'\u2197\uFE0F'},{id:'circle',label:L.annotCircle||'Circle',icon:'\u2B55'},{id:'text',label:L.annotText||'Text',icon:'\uD83C\uDD70\uFE0F'}];
  tools.forEach(function(t){
   var b=document.createElement('button');b.textContent=t.icon;b.title=t.label;b.dataset.tool=t.id;
   b.style.cssText='background:'+(currentTool===t.id?'var(--accent,#d4a03c)':'transparent')+';color:'+(currentTool===t.id?'#000':'var(--text,#e4ddd0)')+';border:1px solid var(--accent,#d4a03c);padding:4px 8px;border-radius:6px;cursor:pointer;font-size:1rem;width:36px;height:36px;';
   b.onclick=function(){currentTool=t.id;updateToolbar();};
   tb.appendChild(b);
  });
  var colorRow=document.createElement('div');colorRow.style.cssText='display:flex;gap:3px;margin:4px 0;';
  colors.forEach(function(c){
   var cb=document.createElement('div');
   cb.style.cssText='width:20px;height:20px;border-radius:50%;cursor:pointer;border:2px solid '+(currentColor===c?'var(--accent,#d4a03c)':'transparent')+';background:'+c+';';
   cb.dataset.color=c;cb.onclick=function(){currentColor=c;updateToolbar();};
   colorRow.appendChild(cb);
  });
  tb.appendChild(colorRow);
  var widthRow=document.createElement('div');widthRow.style.cssText='display:flex;gap:4px;';
  [{w:2,label:'thin'},{w:4,label:'med'},{w:8,label:'thick'}].forEach(function(s){
   var wb=document.createElement('button');wb.textContent=s.label;
   wb.style.cssText='background:'+(currentWidth===s.w?'var(--accent,#d4a03c)':'transparent')+';color:'+(currentWidth===s.w?'#000':'var(--text,#e4ddd0)')+';border:1px solid var(--accent,#d4a03c);padding:2px 6px;border-radius:4px;cursor:pointer;font-size:0.65rem;';
   wb.onclick=function(){currentWidth=s.w;updateToolbar();};
   tb.appendChild(wb);
  });
  tb.appendChild(widthRow);
  var actions=[
   {label:L.annotUndo||'Undo',icon:'\u21A9\uFE0F',fn:function(){if(undoStack.length>0){var d=undoStack.pop();var img=new Image();img.onload=function(){ctx.clearRect(0,0,overlay.width,overlay.height);ctx.drawImage(img,0,0);persistSession();};img.src=d;}else{ctx.clearRect(0,0,overlay.width,overlay.height);persistSession();}}},
   {label:L.annotClear||'Clear All',icon:'\uD83D\uDDD1\uFE0F',fn:function(){saveState();ctx.clearRect(0,0,overlay.width,overlay.height);persistSession();}},
   {label:L.annotSave||'Save as PNG',icon:'\uD83D\uDCBE',fn:function(){
    var simC=document.getElementById('simCanvas');if(!simC)return;
    var merged=document.createElement('canvas');merged.width=simC.width;merged.height=simC.height;
    var mCtx=merged.getContext('2d');mCtx.drawImage(simC,0,0);if(overlay)mCtx.drawImage(overlay,0,0);
    var link=document.createElement('a');link.download='annotated-simulation.png';link.href=merged.toDataURL();link.click();
   }},
   {label:L.annotExit||'Exit Annotation',icon:'\u274C',fn:function(){annotBtn.click();}}
  ];
  actions.forEach(function(a){
   var ab=document.createElement('button');ab.textContent=a.icon+' '+a.label;
   ab.style.cssText='background:transparent;color:var(--text,#e4ddd0);border:1px solid var(--accent,#d4a03c);padding:4px 8px;border-radius:6px;cursor:pointer;font-size:0.7rem;width:100%;text-align:left;';
   ab.onclick=a.fn;tb.appendChild(ab);
  });
  document.body.appendChild(tb);return tb;
 }
 function updateToolbar(){
  if(!toolbar)return;
  toolbar.querySelectorAll('[data-tool]').forEach(function(b){
   b.style.background=b.dataset.tool===currentTool?'var(--accent,#d4a03c)':'transparent';
   b.style.color=b.dataset.tool===currentTool?'#000':'var(--text,#e4ddd0)';
  });
  toolbar.querySelectorAll('[data-color]').forEach(function(b){
   b.style.borderColor=b.dataset.color===currentColor?'var(--accent,#d4a03c)':'transparent';
  });
 }
 function getPos(e){
  var r=overlay.getBoundingClientRect();
  var scaleX=overlay.width/r.width;var scaleY=overlay.height/r.height;
  return{x:(e.clientX-r.left)*scaleX,y:(e.clientY-r.top)*scaleY};
 }
 function onDown(e){
  e.preventDefault();isDrawing=true;saveState();
  var p=getPos(e.touches?e.touches[0]:e);startX=p.x;startY=p.y;
  if(currentTool==='pen'){ctx.beginPath();ctx.moveTo(p.x,p.y);}
  if(currentTool==='text'){var txt=prompt('Text:');if(txt){ctx.font='bold '+Math.max(14,currentWidth*4)+'px sans-serif';ctx.fillStyle=currentColor;ctx.fillText(txt,p.x,p.y);persistSession();}isDrawing=false;}
 }
 function onMove(e){
  if(!isDrawing)return;e.preventDefault();
  var p=getPos(e.touches?e.touches[0]:e);
  if(currentTool==='pen'){ctx.strokeStyle=currentColor;ctx.lineWidth=currentWidth;ctx.lineCap='round';ctx.lineJoin='round';ctx.lineTo(p.x,p.y);ctx.stroke();}
 }
 function onUp(e){
  if(!isDrawing)return;isDrawing=false;
  var p=getPos(e.changedTouches?e.changedTouches[0]:e);
  if(currentTool==='arrow'){
   ctx.strokeStyle=currentColor;ctx.lineWidth=currentWidth;ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(startX,startY);ctx.lineTo(p.x,p.y);ctx.stroke();
   var angle=Math.atan2(p.y-startY,p.x-startX);var hl=12+currentWidth*2;
   ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-hl*Math.cos(angle-0.4),p.y-hl*Math.sin(angle-0.4));ctx.stroke();
   ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-hl*Math.cos(angle+0.4),p.y-hl*Math.sin(angle+0.4));ctx.stroke();
  }
  if(currentTool==='circle'){
   var dx=p.x-startX;var dy=p.y-startY;var rad=Math.sqrt(dx*dx+dy*dy);
   ctx.strokeStyle=currentColor;ctx.lineWidth=currentWidth;
   ctx.beginPath();ctx.arc(startX,startY,rad,0,Math.PI*2);ctx.stroke();
  }
  persistSession();
 }
 annotBtn.onclick=function(){
  annotActive=!annotActive;
  if(annotActive){
   annotBtn.style.background='var(--accent,#d4a03c)';annotBtn.style.color='#000';annotBtn.style.borderRadius='8px';
   overlay=createOverlay();
   if(overlay){ctx=overlay.getContext('2d');
    overlay.addEventListener('mousedown',onDown);overlay.addEventListener('mousemove',onMove);overlay.addEventListener('mouseup',onUp);
    overlay.addEventListener('touchstart',onDown,{passive:false});overlay.addEventListener('touchmove',onMove,{passive:false});overlay.addEventListener('touchend',onUp);
   }
   toolbar=createToolbar();
  }else{
   annotBtn.style.background='';annotBtn.style.color='';annotBtn.style.borderRadius='';
   if(overlay){overlay.remove();overlay=null;ctx=null;}
   if(toolbar){toolbar.remove();toolbar=null;}
  }
 };
}

/* === BOOKMARK COLLECTIONS === */
function initBookmarks(){
 if(document.getElementById('bmkBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var STORAGE_KEY='ops_bookmarks';
 var appPath=window.location.pathname;
 function loadData(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{collections:{'default':[]}};}catch(e){return{collections:{'default':[]}};}};
 function saveData(d){localStorage.setItem(STORAGE_KEY,JSON.stringify(d));}
 function isBookmarked(){var d=loadData();for(var c in d.collections){if(d.collections[c].indexOf(appPath)!==-1)return true;}return false;}
 function countAll(){var d=loadData();var n=0;var seen={};for(var c in d.collections){d.collections[c].forEach(function(p){if(!seen[p]){seen[p]=1;n++;}});}return n;}
 var bmkBtn=document.createElement('button');bmkBtn.id='bmkBtn';bmkBtn.className='btn-icon-only';
 bmkBtn.style.cssText='cursor:pointer;font-size:1rem;position:relative;';
 var badge=document.createElement('span');badge.id='bmkBadge';
 badge.style.cssText='position:absolute;top:-4px;right:-4px;background:#d4a03c;color:#000;font-size:0.55rem;font-weight:700;border-radius:50%;width:16px;height:16px;display:flex;align-items:center;justify-content:center;pointer-events:none;';
 bmkBtn.appendChild(badge);
 function updateBtn(){
  var bm=isBookmarked();bmkBtn.textContent=bm?'\u2B50':'\u2606';bmkBtn.title=bm?(L.bookmarkRemove||'Remove'):(L.bookmarkAdd||'Add Bookmark');
  bmkBtn.appendChild(badge);var cnt=countAll();badge.textContent=cnt>0?cnt:'';badge.style.display=cnt>0?'flex':'none';
 }
 updateBtn();
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(bmkBtn);else{bmkBtn.style.cssText+='position:fixed;top:0.5rem;right:10rem;z-index:9999;';document.body.appendChild(bmkBtn);}
 var panel=null;var pressTimer=null;
 function toggleBookmark(){
  var d=loadData();
  if(isBookmarked()){for(var c in d.collections){var idx=d.collections[c].indexOf(appPath);if(idx!==-1)d.collections[c].splice(idx,1);}
  }else{if(!d.collections['default'])d.collections['default']=[];d.collections['default'].push(appPath);}
  saveData(d);updateBtn();
 }
 function openManager(){
  if(panel){panel.remove();panel=null;return;}
  var d=loadData();
  panel=document.createElement('div');panel.id='bmkPanel';
  panel.style.cssText='position:fixed;top:50px;right:10px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:14px;z-index:9998;width:280px;max-height:70vh;overflow-y:auto;color:var(--text,#e4ddd0);font-size:0.8rem;';
  var header=document.createElement('h3');header.textContent=L.bookmarkTitle||'My Bookmarks';
  header.style.cssText='color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.9rem;margin:0 0 10px 0;';
  panel.appendChild(header);
  var allPaths={};for(var c in d.collections){d.collections[c].forEach(function(p){if(!allPaths[p])allPaths[p]=[];allPaths[p].push(c);});}
  var paths=Object.keys(allPaths);
  if(paths.length===0){var empty=document.createElement('p');empty.textContent=L.bookmarkEmpty||'No bookmarks yet';empty.style.cssText='opacity:0.5;font-style:italic;';panel.appendChild(empty);}
  else{paths.forEach(function(p){
   var row=document.createElement('div');row.style.cssText='display:flex;align-items:center;gap:6px;margin:4px 0;padding:4px;border-radius:6px;background:rgba(255,255,255,0.05);';
   var link=document.createElement('a');link.href=p;link.textContent=p.split('/').filter(Boolean).pop()||p;
   link.style.cssText='color:var(--accent,#d4a03c);text-decoration:none;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:0.75rem;';
   row.appendChild(link);
   var colSel=document.createElement('select');colSel.style.cssText='background:var(--panel,#0b0d24);color:var(--text,#e4ddd0);border:1px solid var(--accent,#d4a03c);border-radius:4px;font-size:0.65rem;padding:1px 4px;';
   for(var cn in d.collections){var opt=document.createElement('option');opt.value=cn;opt.textContent=cn;if(allPaths[p].indexOf(cn)!==-1)opt.selected=true;colSel.appendChild(opt);}
   colSel.onchange=function(){var nd=loadData();for(var cc in nd.collections){var ii=nd.collections[cc].indexOf(p);if(ii!==-1)nd.collections[cc].splice(ii,1);}if(!nd.collections[colSel.value])nd.collections[colSel.value]=[];nd.collections[colSel.value].push(p);saveData(nd);updateBtn();openManager();openManager();};
   row.appendChild(colSel);
   var rmBtn=document.createElement('button');rmBtn.textContent='\u274C';rmBtn.title=L.bookmarkRemove||'Remove';
   rmBtn.style.cssText='background:transparent;border:none;color:#ff4444;cursor:pointer;font-size:0.8rem;padding:2px;';
   rmBtn.onclick=function(){var nd=loadData();for(var cc in nd.collections){var ii=nd.collections[cc].indexOf(p);if(ii!==-1)nd.collections[cc].splice(ii,1);}saveData(nd);updateBtn();openManager();openManager();};
   row.appendChild(rmBtn);
   panel.appendChild(row);
  });}
  var divider=document.createElement('hr');divider.style.cssText='border:none;border-top:1px solid var(--accent,#d4a03c);margin:10px 0;opacity:0.3;';
  panel.appendChild(divider);
  var newRow=document.createElement('div');newRow.style.cssText='display:flex;gap:4px;';
  var newInput=document.createElement('input');newInput.placeholder=L.bookmarkNew||'New Collection';
  newInput.style.cssText='flex:1;background:var(--panel,#0b0d24);color:var(--text,#e4ddd0);border:1px solid var(--accent,#d4a03c);border-radius:6px;padding:4px 8px;font-size:0.75rem;';
  var newBtn=document.createElement('button');newBtn.textContent='+';
  newBtn.style.cssText='background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 10px;border-radius:6px;cursor:pointer;font-weight:700;';
  newBtn.onclick=function(){var name=newInput.value.trim();if(name){var nd=loadData();if(!nd.collections[name])nd.collections[name]=[];saveData(nd);openManager();openManager();}};
  newRow.appendChild(newInput);newRow.appendChild(newBtn);panel.appendChild(newRow);
  document.body.appendChild(panel);
 }
 bmkBtn.addEventListener('click',function(e){if(!pressTimer)toggleBookmark();pressTimer=null;});
 bmkBtn.addEventListener('mousedown',function(){pressTimer=setTimeout(function(){pressTimer='long';openManager();},500);});
 bmkBtn.addEventListener('mouseup',function(){if(pressTimer&&pressTimer!=='long')clearTimeout(pressTimer);});
 bmkBtn.addEventListener('mouseleave',function(){if(pressTimer&&pressTimer!=='long')clearTimeout(pressTimer);});
 bmkBtn.addEventListener('contextmenu',function(e){e.preventDefault();openManager();});
}
document.addEventListener('DOMContentLoaded',function(){try{initAnnotation();}catch(e){console.warn('Annotation init:',e);}try{initBookmarks();}catch(e){console.warn('Bookmarks init:',e);}});



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
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info');}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const txt=$('statusText'),pill=$('statusPill'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');});});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

/* ═══════ ONION SIMULATOR ═══════ */

const COUNTRIES = ['🇺🇸 USA','🇩🇪 Germany','🇳🇱 Netherlands','🇨🇭 Switzerland','🇸🇪 Sweden','🇫🇮 Finland','🇮🇸 Iceland','🇷🇴 Romania','🇫🇷 France','🇯🇵 Japan','🇸🇬 Singapore','🇧🇷 Brazil'];
const LAYER_COLORS = ['#ff4444','#ff8800','#ffcc00','#33cc55'];

let circuit = [];
let animating = false;

function pickRandom(arr, count) {
  const copy = [...arr]; const result = [];
  for (let i = 0; i < count && copy.length; i++) { const idx = Math.floor(Math.random() * copy.length); result.push(copy.splice(idx, 1)[0]); }
  return result;
}

function buildCircuit() {
  const nodes = pickRandom(COUNTRIES, 3);
  circuit = [
    { label: LANG[currentLang].you, country: '🏠', x: 0, y: 0.5, type: 'origin' },
    { label: LANG[currentLang].entryNode, country: nodes[0], x: 0.25, y: 0.3, type: 'entry' },
    { label: LANG[currentLang].middleNode, country: nodes[1], x: 0.5, y: 0.7, type: 'middle' },
    { label: LANG[currentLang].exitNode, country: nodes[2], x: 0.75, y: 0.3, type: 'exit' },
    { label: LANG[currentLang].destination, country: '🌐', x: 1, y: 0.5, type: 'dest' },
  ];
  return circuit;
}

function drawNetwork(canvas, ctx, highlight = -1, msgProgress = -1) {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#060d1a'; ctx.fillRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = '#0a1a30'; ctx.lineWidth = 0.5;
  for (let i = 0; i < w; i += 30) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
  for (let i = 0; i < h; i += 30) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

  const pad = 60;
  const nodes = circuit.map(n => ({ ...n, px: pad + n.x * (w - pad * 2), py: pad + n.y * (h - pad * 2) }));

  // Draw connections
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i], b = nodes[i + 1];
    ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py);
    ctx.strokeStyle = i < highlight ? '#33cc5566' : (i === highlight ? LAYER_COLORS[Math.min(i, 3)] + '88' : '#1a3355');
    ctx.lineWidth = i === highlight ? 3 : 1.5;
    ctx.setLineDash(i >= highlight && highlight >= 0 ? [6, 4] : []);
    ctx.stroke(); ctx.setLineDash([]);
  }

  // Draw message packet
  if (msgProgress >= 0 && msgProgress < nodes.length - 1) {
    const a = nodes[msgProgress], b = nodes[msgProgress + 1];
    const t = 0.5;
    const mx = a.px + (b.px - a.px) * t, my = a.py + (b.py - a.py) * t;
    const layers = 3 - msgProgress;
    for (let l = layers; l >= 0; l--) {
      ctx.beginPath(); ctx.arc(mx, my, 12 + l * 6, 0, Math.PI * 2);
      ctx.fillStyle = LAYER_COLORS[l] + '44'; ctx.fill();
      ctx.strokeStyle = LAYER_COLORS[l]; ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.fillStyle = '#fff'; ctx.font = '10px Orbitron'; ctx.textAlign = 'center';
    ctx.fillText('📨', mx, my + 4);
  }

  // Draw nodes
  nodes.forEach((n, i) => {
    const active = i <= highlight + 1;
    const radius = n.type === 'origin' || n.type === 'dest' ? 20 : 24;

    // Glow
    if (active) {
      ctx.beginPath(); ctx.arc(n.px, n.py, radius + 8, 0, Math.PI * 2);
      ctx.fillStyle = (n.type === 'entry' ? '#ff444422' : n.type === 'middle' ? '#ff880022' : n.type === 'exit' ? '#ffcc0022' : '#33cc5522');
      ctx.fill();
    }

    // Node circle
    ctx.beginPath(); ctx.arc(n.px, n.py, radius, 0, Math.PI * 2);
    ctx.fillStyle = active ? '#1a2a44' : '#0d1522';
    ctx.fill();
    ctx.strokeStyle = n.type === 'entry' ? '#ff4444' : n.type === 'middle' ? '#ff8800' : n.type === 'exit' ? '#ffcc00' : '#33cc55';
    ctx.lineWidth = active ? 3 : 1.5; ctx.stroke();

    // Icon
    ctx.fillStyle = '#fff'; ctx.font = '14px serif'; ctx.textAlign = 'center';
    const icon = n.type === 'origin' ? '👤' : n.type === 'dest' ? '🌐' : '🧅';
    ctx.fillText(icon, n.px, n.py + 5);

    // Label
    ctx.fillStyle = '#aabbcc'; ctx.font = '9px Orbitron'; ctx.textAlign = 'center';
    ctx.fillText(n.label, n.px, n.py + radius + 14);
    ctx.fillStyle = '#667788'; ctx.font = '8px monospace';
    ctx.fillText(n.country, n.px, n.py + radius + 26);
  });

  ctx.textAlign = 'start';
}

function fakeEncrypt(msg, layers) {
  let result = msg;
  for (let i = 0; i < layers; i++) {
    result = btoa(unescape(encodeURIComponent(result))).slice(0, 40) + '...';
  }
  return result;
}

async function sendMessage() {
  if (animating) return;
  animating = true;
  const s = LANG[currentLang];
  const input = $('msgInput');
  const msg = input ? input.value.trim() : 'Hello';
  const canvas = $('torCanvas');
  const layerInfo = $('layerInfo');
  if (!canvas) { animating = false; return; }
  const ctx = canvas.getContext('2d');

  buildCircuit();
  showToast(s.encrypting);
  log(`🔐 ${s.encrypting}`, 'tx');
  setStatus(true);

  if (layerInfo) { layerInfo.style.display = 'block'; layerInfo.innerHTML = ''; }

  // Show encryption layers being added
  const encrypted = [];
  encrypted.push(msg);
  for (let i = 0; i < 3; i++) {
    encrypted.push(fakeEncrypt(encrypted[encrypted.length - 1], 1));
    await sleep(400);
    if (layerInfo) {
      const div = document.createElement('div');
      div.style.cssText = `padding:.3rem .5rem;margin:.2rem 0;border-radius:4px;border-left:3px solid ${LAYER_COLORS[2 - i]};font-size:.75rem;font-family:monospace;word-break:break-all;`;
      div.innerHTML = `<strong>${s.layer} ${i + 1}:</strong> ${encrypted[encrypted.length - 1]}`;
      layerInfo.appendChild(div);
    }
    log(`🔐 ${s.layer} ${i + 1} added`, 'info');
  }

  await sleep(300);
  showToast(s.routing);
  log(`🧅 ${s.routing}`, 'tx');

  // Animate through nodes
  for (let hop = 0; hop < 4; hop++) {
    drawNetwork(canvas, ctx, hop, hop);
    await sleep(600);
    drawNetwork(canvas, ctx, hop);
    if (hop < 3) {
      log(`📦 ${s.layer} ${3 - hop} ${s.peeled} ${circuit[hop + 1].label} (${circuit[hop + 1].country})`, 'rx');
    }
    await sleep(400);
  }

  // Final state
  drawNetwork(canvas, ctx, 4);

  // Show delivered message
  if (layerInfo) {
    const div = document.createElement('div');
    div.style.cssText = 'padding:.5rem;margin-top:.5rem;border-radius:4px;background:#33cc5522;border:1px solid #33cc55;font-size:.8rem;text-align:center;';
    div.innerHTML = `✅ <strong>${s.delivered}</strong><br><span style="font-family:monospace;">${msg}</span>`;
    layerInfo.appendChild(div);
  }

  hideToast();
  log(`✅ ${s.delivered}`, 'success');
  animating = false;
}

function buildNewCircuit() {
  buildCircuit();
  const canvas = $('torCanvas');
  if (canvas) drawNetwork(canvas, canvas.getContext('2d'));
  const info = $('circuitInfo');
  if (info) {
    info.innerHTML = circuit.map((n, i) => `<span style="color:${['#33cc55','#ff4444','#ff8800','#ffcc00','#33cc55'][i]};">${n.country} ${n.label}</span>`).join(' → ');
  }
  log('🔄 New circuit built: ' + circuit.map(n => n.country).join(' → '), 'success');
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang');const st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initHijriDate();

  // App-specific
  buildCircuit();
  const canvas=$('torCanvas');if(canvas)drawNetwork(canvas,canvas.getContext('2d'));
  const sendBtn=$('sendBtn');if(sendBtn)sendBtn.onclick=sendMessage;
  const newCircuitBtn=$('newCircuitBtn');if(newCircuitBtn)newCircuitBtn.onclick=buildNewCircuit;

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Onion Layer Encryption Visualizer ═══════ */
(function(){
let lCanvas,lCtx;const layerParticles=[];
function createLC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Onion Layer Encryption Visualizer</div>';
  const c=document.createElement('canvas');c.width=620;c.height=300;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;cursor:pointer;';
  w.appendChild(c);t.appendChild(w);return c;
}
function drawL(){
  if(!lCtx)return;const w=lCanvas.width,h=lCanvas.height,cx=w/2,cy=h/2;
  lCtx.fillStyle='rgba(6,13,26,0.1)';lCtx.fillRect(0,0,w,h);
  lCtx.strokeStyle='#0a1a30';lCtx.lineWidth=0.3;
  for(let i=0;i<w;i+=25){lCtx.beginPath();lCtx.moveTo(i,0);lCtx.lineTo(i,h);lCtx.stroke();}
  for(let i=0;i<h;i+=25){lCtx.beginPath();lCtx.moveTo(0,i);lCtx.lineTo(w,i);lCtx.stroke();}
  const layers=[
    {r:110,color:'#ff4444',label:'Layer 3: Exit Encryption',speed:0.003},
    {r:80,color:'#ff8800',label:'Layer 2: Middle Encryption',speed:0.005},
    {r:50,color:'#ffcc00',label:'Layer 1: Entry Encryption',speed:0.008},
    {r:20,color:'#33cc55',label:'Plaintext Message',speed:0},
  ];
  const t=Date.now()/1000;
  layers.forEach((l,idx)=>{
    const segments=12+idx*4;
    for(let s=0;s<segments;s++){
      const a=(s/segments)*Math.PI*2+t*l.speed*(idx%2===0?1:-1);
      const a2=((s+0.8)/segments)*Math.PI*2+t*l.speed*(idx%2===0?1:-1);
      lCtx.beginPath();lCtx.arc(cx,cy,l.r,a,a2);
      lCtx.strokeStyle=l.color+(idx===3?'cc':'66');lCtx.lineWidth=idx===3?4:8-idx;lCtx.stroke();
    }
    const labelAngle=t*0.3+idx*1.2;
    const lx=cx+Math.cos(labelAngle)*(l.r+18);const ly=cy+Math.sin(labelAngle)*(l.r+18);
    lCtx.fillStyle=l.color;lCtx.font='8px Orbitron,monospace';lCtx.textAlign='center';
    lCtx.fillText(l.label,lx,ly);
    // Orbiting data bits
    for(let b=0;b<3;b++){
      const ba=t*(0.5+idx*0.2)+b*(Math.PI*2/3);
      const bx=cx+Math.cos(ba)*l.r,by=cy+Math.sin(ba)*l.r;
      lCtx.beginPath();lCtx.arc(bx,by,2+idx*0.5,0,Math.PI*2);
      lCtx.fillStyle=l.color;lCtx.fill();
    }
  });
  // Center icon
  lCtx.fillStyle='#fff';lCtx.font='16px serif';lCtx.textAlign='center';lCtx.fillText('📨',cx,cy+6);
  // Particles
  for(let i=layerParticles.length-1;i>=0;i--){
    const p=layerParticles[i];p.life-=0.01;p.r+=0.5;p.angle+=p.speed;
    if(p.life<=0){layerParticles.splice(i,1);continue;}
    const px=cx+Math.cos(p.angle)*p.r,py=cy+Math.sin(p.angle)*p.r;
    lCtx.globalAlpha=p.life;lCtx.beginPath();lCtx.arc(px,py,3,0,Math.PI*2);
    lCtx.fillStyle=p.color;lCtx.fill();lCtx.globalAlpha=1;
  }
  lCtx.fillStyle='rgba(255,255,255,0.3)';lCtx.font='8px monospace';lCtx.textAlign='left';
  lCtx.fillText('Layers: 3 | Cipher: AES-256 | Key Exchange: Curve25519',10,h-8);
  requestAnimationFrame(drawL);
}
function initLC(){lCanvas=createLC();if(!lCanvas)return;lCtx=lCanvas.getContext('2d');
  lCanvas.addEventListener('click',()=>{
    const colors=['#ff4444','#ff8800','#ffcc00','#33cc55'];
    for(let i=0;i<20;i++)layerParticles.push({r:20+Math.random()*30,angle:Math.random()*Math.PI*2,
      speed:(Math.random()-0.5)*0.05,life:1,color:colors[Math.floor(Math.random()*4)]});
  });drawL();}
setTimeout(initLC,1500);
})();

/* ═══════ INIT POMODORO + CARD FLIP ═══════ */
document.addEventListener('DOMContentLoaded', function(){
  try { initPomodoro(); } catch(e) { console.warn('Pomodoro init error:', e); }
  try { initCardFlip(); } catch(e) { console.warn('CardFlip init error:', e); }
});
