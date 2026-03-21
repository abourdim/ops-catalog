/**
 * MITM Simulator — Play as Eve
 * Workshop DIY — Net Browser Collection
 * Intercept messages between Alice and Bob
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.139885 78.322945 253.991455 136.254120"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752C203.799835,145.619583,204.629318,145.619736,205.933762,145.784378C212.620331,146.628281,217.423569,150.723984,219.325882,157.203781C219.72139,158.550934,219.771454,162.692093,219.406631,163.88208C218.187943,167.857361,216.579514,170.301239,213.792847,172.411835C209.455261,175.697083,203.83429,176.563141,198.809494,174.720413C197.244873,174.146637,196.144424,173.544434,194.478638,172.350433C191.905991,170.506454,190.53334,169.740753,188.031555,168.754135L187.293335,168.462997L187.308884,160.785461C187.317429,156.56282,187.36911,153.000763,187.423706,152.869797z"/><path style="stroke:none;fill:currentColor" d="M259.791718,157.665863L264.87912,148.034195L272.338226,148.034195L263.03244,163.730896L263.03244,174.991974L256.261322,174.991974L256.261322,164.07489L246.792618,148.034195L254.505173,148.034195z"/><path style="stroke:none;fill:currentColor" d="M240.369812,152.741394L236.495438,152.741394L236.495438,170.284775L240.369812,170.284775L240.369812,174.991974L225.849915,174.991974L225.849915,170.284775L229.724304,170.284775L229.724304,152.741394L225.849915,152.741394L225.849915,148.034195L240.369812,148.034195z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}

/* ═══════ i18n ═══════ */
const LANG={
en:{matrixTitle:'Matrix Rain',matrixOn:'Matrix ON',matrixOff:'Matrix OFF',ratingTitle:'Rate this app',ratingYours:'You rated',ratingThanks:'Thanks for rating!',flashTitle:'Flashcards',flashKnow:'Know it',flashReview:'Review later',flashDone:'All cards reviewed!',flashProgress:'{0} of {1} remaining',flash_t1:'Signal',flash_d1:'A detectable transmitted energy pattern used to convey information.',flash_t2:'Encryption',flash_d2:'The process of encoding data so only authorized parties can read it.',flash_t3:'Protocol',flash_d3:'A set of rules governing data exchange between devices or systems.',flash_t4:'Frequency',flash_d4:'The number of cycles per second of a periodic signal, measured in Hertz.',flash_t5:'Authentication',flash_d5:'The process of verifying the identity of a user, device, or system.',certTitle:'Certificate of Completion',certComplete:'Congratulations! All apps completed!',certProgress:'{0} of {1} apps completed',certDownload:'Download Certificate',certName:'Workshop DIY',annotTitle:'Annotation Mode',annotDraw:'Freehand',annotArrow:'Arrow',annotCircle:'Circle',annotText:'Text',annotUndo:'Undo',annotClear:'Clear All',annotSave:'Save as PNG',annotExit:'Exit Annotation',bookmarkTitle:'My Bookmarks',bookmarkAdd:'Add Bookmark',bookmarkRemove:'Remove',bookmarkCollection:'Add to Collection',bookmarkNew:'New Collection',bookmarkEmpty:'No bookmarks yet',morseSecret:'Morse Easter Egg',morseBackstory:'Originally a secret mesh protocol designed for submarine communication in the North Atlantic. The first prototype ran on vacuum tubes salvaged from a sunken destroyer.',morseDecoded:'Decoded: ',dnaTitle:'DNA Fingerprint',dnaSave:'Save DNA',dnaInfo:'Unique visual signature of current parameters',sandboxTitle:'Sandbox Mode',sandboxOn:'Sandbox ON',sandboxOff:'Sandbox OFF',sandboxAdd:'Add Parameter',sandboxReset:'Reset Defaults',pomodoroTitle:'Pomodoro Timer',pomodoroFocus:'Focus',pomodoroBreak:'Break',pomodoroStart:'Start',pomodoroPause:'Pause',pomodoroReset:'Reset',pomodoroDone:'Session complete!',flipTitle:'Secret Stats',flipStats:'Hidden Statistics',flipTime:'Time Spent',flipChanges:'Parameter Changes',flipGame:'Click the Target',flipBack:'Flip Back',profTitle:'Professor',profGreet:'Hello Agent! I\x27m Professor Workshop. Ask me anything about Web Mitm Sim!',profWhat:'What is this?',profHow:'How does it work?',profWhy:'Why is this important?',profChallenge:'Give me a challenge',profMore:'Tell me more',profQuiz:'Quiz me',profUnknown:'Good question! Try exploring the Net Browser features to find out.',profPlaceholder:'Ask the professor...',title:'MITM Simulator',subtitle:'\uD83D\uDD75\uFE0F Intercept messages between Alice and Bob',
disconnected:'Disconnected',connected:'Connected',
mainSection:'Play as Eve',mainDesc:'Intercept messages between Alice and Bob',
sectionA:'How MITM Attacks Work',sectionB:'Famous MITM Scenarios',sectionC:'Defense Strategies',
activityLog:'Activity Log',eventsMsg:'Events & messages',
clear:'Clear',copy:'Copy',theme:'Theme',settings:'\u2699\uFE0F Settings',language:'Language',
help:'\u2753 Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
faq_q1:'What is MITM Simulator?',faq_a1:'A visual simulator showing how Eve intercepts messages between Alice and Bob, and how encryption prevents it.',
faq_q2:'Is this a real attack?',faq_a2:'No, this is a simulation for educational purposes. No real network traffic is involved.',
faq_q3:'How do I change the language?',faq_a3:'Open Settings and pick your language. Arabic enables RTL automatically.',
faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser.',
howto_1:'Type a message and click Send.',howto_2:'Toggle Eve Intercept to let Eve read messages.',
howto_3:'Toggle Encryption to block Eve from reading.',howto_4:'Open Section C for defense strategies.',
wiki_themes_title:'\uD83C\uDFA8 Themes',wiki_themes:'8 built-in themes.',wiki_i18n_title:'\uD83C\uDF10 Languages',wiki_i18n:'Trilingual: EN, FR, AR with RTL.',
wiki_log_title:'\uD83D\uDCDC Activity Log',wiki_log:'Timestamped, color-coded log.',wiki_privacy_title:'\uD83D\uDD12 Privacy',wiki_privacy:'Local-first. All data stays in your browser.',
working:'Working\u2026',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
ready:'\uD83D\uDD75\uFE0F MITM Simulator ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
export:'Export',filterAll:'All',soundEffects:'\uD83D\uDD0A Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
splashHint:'tap to skip',langChanged:'\uD83C\uDF10 Language \u2192 English',themeChanged:'\uD83C\uDFA8 Theme \u2192',
msgPlaceholder:'Type a message...',sendBtn:'Send',eveIntercept:'\uD83D\uDD75\uFE0F Eve Intercept',encryption:'\uD83D\uDD12 Encryption (TLS)',autoDemo:'Auto Demo',
msgLogTitle:'Message History',
mitmExplain:'In a Man-in-the-Middle (MITM) attack, Eve secretly relays and possibly alters communications between Alice and Bob. Without encryption, Eve can read everything in plaintext. With TLS/SSL encryption, Eve sees only scrambled ciphertext.',
scenariosText:'Public Wi-Fi hotspots are a common MITM attack vector. ARP spoofing redirects traffic through the attacker. DNS spoofing sends victims to fake websites. SSL stripping downgrades HTTPS to HTTP.',
defenseText:'Learn how to defend against MITM attacks with HTTPS, certificate pinning, HSTS, and mutual TLS.',
showDefenseBtn:'Show Defense Guide',
sending:'Sending message...',aliceSays:'Alice',bobSays:'Bob',eveSays:'Eve',
eveReads:'Eve reads plaintext!',eveBlocked:'Eve sees only ciphertext',eveOff:'Eve is not intercepting',
msgDelivered:'Message delivered to Bob',encrypted:'ENCRYPTED',plaintext:'PLAINTEXT',
defense_https:'HTTPS: Encrypts all traffic between browser and server.',
defense_hsts:'HSTS: Forces browsers to always use HTTPS.',
defense_pin:'Certificate Pinning: Prevents fake certificates.',
defense_mtls:'Mutual TLS: Both sides verify each other.',
defense_vpn:'VPN: Encrypts all traffic through a tunnel.',
},
fr:{matrixTitle:'Pluie Matrix',matrixOn:'Matrix ACTIV\x27',matrixOff:'Matrix D\x27SACTIV\x27',ratingTitle:'Noter cette appli',ratingYours:'Votre note',ratingThanks:'Merci pour votre note !',flashTitle:'Cartes M\xe9moire',flashKnow:'Je sais',flashReview:'\xc0 revoir',flashDone:'Toutes les cartes r\xe9vis\xe9es !',flashProgress:'{0} sur {1} restantes',flash_t1:'Signal',flash_d1:'Un motif d\x27\xe9nergie transmis d\xe9tectable utilis\xe9 pour transmettre des informations.',flash_t2:'Chiffrement',flash_d2:'Le processus d\x27encodage des donn\xe9es pour que seules les parties autoris\xe9es puissent les lire.',flash_t3:'Protocole',flash_d3:'Un ensemble de r\xe8gles r\xe9gissant l\x27\xe9change de donn\xe9es entre appareils ou syst\xe8mes.',flash_t4:'Fr\xe9quence',flash_d4:'Le nombre de cycles par seconde d\x27un signal p\xe9riodique, mesur\xe9 en Hertz.',flash_t5:'Authentification',flash_d5:'Le processus de v\xe9rification de l\x27identit\xe9 d\x27un utilisateur, appareil ou syst\xe8me.',certTitle:'Certificat de R\xe9ussite',certComplete:'F\xe9licitations ! Toutes les apps termin\xe9es !',certProgress:'{0} sur {1} apps termin\xe9es',certDownload:'T\xe9l\xe9charger le Certificat',certName:'Workshop DIY',annotTitle:'Mode Annotation',annotDraw:'Main lev\x27e',annotArrow:'Fl\x27che',annotCircle:'Cercle',annotText:'Texte',annotUndo:'Annuler',annotClear:'Tout effacer',annotSave:'Enregistrer en PNG',annotExit:'Quitter l\x27annotation',bookmarkTitle:'Mes Favoris',bookmarkAdd:'Ajouter aux favoris',bookmarkRemove:'Supprimer',bookmarkCollection:'Ajouter \x27 la collection',bookmarkNew:'Nouvelle collection',bookmarkEmpty:'Aucun favori pour l\x27instant',morseSecret:'Morse Easter Egg',morseBackstory:'A l origine un protocole mesh secret concu pour la communication sous-marine dans l Atlantique Nord. Le premier prototype fonctionnait avec des tubes a vide recuperes d un destroyer coule.',morseDecoded:'D\x27cod\x27: ',dnaTitle:'Empreinte ADN',dnaSave:'Sauvegarder ADN',dnaInfo:'Signature visuelle unique des param\x27tres actuels',sandboxTitle:'Mode Bac \x27 sable',sandboxOn:'Bac \x27 sable ACTIV\x27',sandboxOff:'Bac \x27 sable D\x27SACTIV\x27',sandboxAdd:'Ajouter Param\x27tre',sandboxReset:'R\x27initialiser',pomodoroTitle:'Minuteur Pomodoro',pomodoroFocus:'Concentration',pomodoroBreak:'Pause',pomodoroStart:'D\x27marrer',pomodoroPause:'Pause',pomodoroReset:'R\x27initialiser',pomodoroDone:'Session termin\x27e!',flipTitle:'Stats Secr\x27tes',flipStats:'Statistiques Cach\x27es',flipTime:'Temps Pass\x27',flipChanges:'Modifications',flipGame:'Cliquez la Cible',flipBack:'Retourner',profTitle:'Professeur',profGreet:'Bonjour Agent ! Je suis le Professeur Atelier. Pose-moi n\x27importe quelle question sur Web Mitm Sim !',profWhat:'C\x27est quoi ?',profHow:'Comment \xe7a marche ?',profWhy:'Pourquoi c\x27est important ?',profChallenge:'Donne-moi un d\xe9fi',profMore:'Dis-moi plus',profQuiz:'Teste-moi',profUnknown:'Bonne question ! Essaie d\x27explorer les fonctions de Net Browser pour le d\xe9couvrir.',profPlaceholder:'Demande au professeur...',title:'MITM Simulateur',subtitle:'\uD83D\uDD75\uFE0F Interceptez les messages entre Alice et Bob',
disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',
mainSection:'Jouez Eve',mainDesc:'Interceptez les messages entre Alice et Bob',
sectionA:'Comment fonctionnent les attaques MITM',sectionB:'Sc\u00e9narios MITM c\u00e9l\u00e8bres',sectionC:'Strat\u00e9gies de d\u00e9fense',
activityLog:'Journal',eventsMsg:'\u00c9v\u00e9nements',
clear:'Effacer',copy:'Copier',theme:'Th\u00e8me',settings:'\u2699\uFE0F Param\u00e8tres',language:'Langue',
help:'\u2753 Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
faq_q1:'Qu\'est-ce que MITM Simulateur ?',faq_a1:'Un simulateur visuel montrant comment Eve intercepte les messages.',
faq_q2:'Est-ce une vraie attaque ?',faq_a2:'Non, c\'est une simulation \u00e9ducative.',
faq_q3:'Comment changer la langue ?',faq_a3:'Ouvre Param\u00e8tres.',
faq_q4:'Donn\u00e9es priv\u00e9es ?',faq_a4:'Oui, tout est local.',
howto_1:'Tapez un message et cliquez Envoyer.',howto_2:'Activez Interception Eve pour lire les messages.',
howto_3:'Activez Chiffrement pour bloquer Eve.',howto_4:'Ouvrez Section C pour les d\u00e9fenses.',
wiki_themes_title:'\uD83C\uDFA8 Th\u00e8mes',wiki_themes:'8 th\u00e8mes.',wiki_i18n_title:'\uD83C\uDF10 Langues',wiki_i18n:'Trilingue.',
wiki_log_title:'\uD83D\uDCDC Journal',wiki_log:'Journal horodat\u00e9.',wiki_privacy_title:'\uD83D\uDD12 Confidentialit\u00e9',wiki_privacy:'Local-first.',
working:'En cours\u2026',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
ready:'\uD83D\uDD75\uFE0F MITM Simulateur pr\u00eat !',logCleared:'Effac\u00e9',copied:'Copi\u00e9 !',copyFail:'\u00c9chec',
export:'Exporter',filterAll:'Tout',soundEffects:'\uD83D\uDD0A Sons',whisperMode:'Murmure',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',
splashHint:'appuyer pour passer',langChanged:'\uD83C\uDF10 Langue \u2192 Fran\u00e7ais',themeChanged:'\uD83C\uDFA8 Th\u00e8me \u2192',
msgPlaceholder:'Tapez un message...',sendBtn:'Envoyer',eveIntercept:'\uD83D\uDD75\uFE0F Interception Eve',encryption:'\uD83D\uDD12 Chiffrement (TLS)',autoDemo:'D\u00e9mo auto',
msgLogTitle:'Historique des messages',
mitmExplain:'Dans une attaque MITM, Eve relaie secr\u00e8tement les communications entre Alice et Bob. Sans chiffrement, Eve lit tout en clair. Avec TLS, Eve ne voit que du texte chiffr\u00e9.',
scenariosText:'Les hotspots Wi-Fi publics sont un vecteur courant. L\'ARP spoofing redirige le trafic. Le DNS spoofing envoie vers de faux sites.',
defenseText:'D\u00e9fendez-vous avec HTTPS, le certificate pinning, HSTS et le TLS mutuel.',
showDefenseBtn:'Afficher le guide',
sending:'Envoi du message...',aliceSays:'Alice',bobSays:'Bob',eveSays:'Eve',
eveReads:'Eve lit le texte clair !',eveBlocked:'Eve ne voit que du chiffr\u00e9',eveOff:'Eve n\'intercepte pas',
msgDelivered:'Message d\u00e9livr\u00e9 \u00e0 Bob',encrypted:'CHIFFR\u00c9',plaintext:'TEXTE CLAIR',
defense_https:'HTTPS : Chiffre tout le trafic.',
defense_hsts:'HSTS : Force le navigateur \u00e0 utiliser HTTPS.',
defense_pin:'Certificate Pinning : Emp\u00eache les faux certificats.',
defense_mtls:'TLS Mutuel : V\u00e9rification des deux c\u00f4t\u00e9s.',
defense_vpn:'VPN : Chiffre tout le trafic via un tunnel.',
},
ar:{matrixTitle:'مطر الماتريكس',matrixOn:'الماتريكس مفعل',matrixOff:'الماتريكس معطل',ratingTitle:'قيّم هذا التطبيق',ratingYours:'تقييمك',ratingThanks:'شكرا على التقييم!',flashTitle:'بطاقات تعليمية',flashKnow:'أعرفها',flashReview:'راجع لاحقاً',flashDone:'تمت مراجعة جميع البطاقات!',flashProgress:'{0} من {1} متبقية',flash_t1:'إشارة',flash_d1:'نمط طاقة مرسل قابل للكشف يستخدم لنقل المعلومات.',flash_t2:'تشفير',flash_d2:'عملية ترميز البيانات بحيث لا يمكن قراءتها إلا للأطراف المصرح لها.',flash_t3:'بروتوكول',flash_d3:'مجموعة قواعد تحكم تبادل البيانات بين الأجهزة.',flash_t4:'تردد',flash_d4:'عدد الدورات في الثانية لإشارة دورية، تقاس بالهرتز.',flash_t5:'مصادقة',flash_d5:'عملية التحقق من هوية المستخدم أو الجهاز أو النظام.',certTitle:'شهادة إتمام',certComplete:'تهانينا! تم إكمال جميع التطبيقات!',certProgress:'{0} من {1} تطبيقات مكتملة',certDownload:'تحميل الشهادة',certName:'Workshop DIY',annotTitle:'وضع التعليق',annotDraw:'رسم حر',annotArrow:'سهم',annotCircle:'دائرة',annotText:'نص',annotUndo:'تراجع',annotClear:'مسح الكل',annotSave:'حفظ كصورة',annotExit:'خروج من التعليق',bookmarkTitle:'مفضلاتي',bookmarkAdd:'إضافة للمفضلة',bookmarkRemove:'إزالة',bookmarkCollection:'إضافة إلى مجموعة',bookmarkNew:'مجموعة جديدة',bookmarkEmpty:'لا توجد مفضلات بعد',morseSecret:'بيضة مورس الفصحية',morseBackstory:'تم اكتشاف هذه الأداة في خزنة سرية',morseDecoded:'تم فك التشفير: ',dnaTitle:'بصمة الحمض النووي',dnaSave:'حفظ البصمة',dnaInfo:'توقيع بصري فريد للمعلمات الحالية',sandboxTitle:'وضع التجربة',sandboxOn:'التجربة مفعلة',sandboxOff:'التجربة معطلة',sandboxAdd:'إضافة معلمة',sandboxReset:'إعادة التعيين',pomodoroTitle:'مؤقت بومودورو',pomodoroFocus:'تركيز',pomodoroBreak:'استراحة',pomodoroStart:'بدء',pomodoroPause:'إيقاف',pomodoroReset:'إعادة',pomodoroDone:'اكتملت الجلسة!',flipTitle:'إحصائيات سرية',flipStats:'إحصائيات مخفية',flipTime:'الوقت المستغرق',flipChanges:'التغييرات',flipGame:'انقر الهدف',flipBack:'ارجع',profTitle:'الأستاذ',profGreet:'مرحبا أيها العميل! أنا الأستاذ ورشة. اسألني أي شيء!',profWhat:'ما هذا؟',profHow:'كيف يعمل؟',profWhy:'لماذا هذا مهم؟',profChallenge:'أعطني تحديا',profMore:'أخبرني المزيد',profQuiz:'اختبرني',profUnknown:'سؤال جيد! حاول استكشاف الميزات لمعرفة الإجابة.',profPlaceholder:'اسأل الأستاذ...',title:'\u0645\u062D\u0627\u0643\u064A MITM',subtitle:'\uD83D\uDD75\uFE0F \u0627\u0639\u062A\u0631\u0636 \u0631\u0633\u0627\u0626\u0644 \u0623\u0644\u064A\u0633 \u0648\u0628\u0648\u0628',
disconnected:'\u063A\u064A\u0631 \u0645\u062A\u0635\u0644',connected:'\u0645\u062A\u0635\u0644',
mainSection:'\u0627\u0644\u0639\u0628 \u0643\u0625\u064A\u0641',mainDesc:'\u0627\u0639\u062A\u0631\u0636 \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u0628\u064A\u0646 \u0623\u0644\u064A\u0633 \u0648\u0628\u0648\u0628',
sectionA:'\u0643\u064A\u0641 \u062A\u0639\u0645\u0644 \u0647\u062C\u0645\u0627\u062A MITM',sectionB:'\u0633\u064A\u0646\u0627\u0631\u064A\u0648\u0647\u0627\u062A MITM \u0627\u0644\u0634\u0647\u064A\u0631\u0629',sectionC:'\u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A\u0627\u062A \u0627\u0644\u062F\u0641\u0627\u0639',
activityLog:'\u0633\u062C\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062D\u062F\u0627\u062B',
clear:'\u0645\u0633\u062D',copy:'\u0646\u0633\u062E',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u2699\uFE0F \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A',language:'\u0627\u0644\u0644\u063A\u0629',
help:'\u2753 \u0645\u0633\u0627\u0639\u062F\u0629',faq:'\u0623\u0633\u0626\u0644\u0629 \u0634\u0627\u0626\u0639\u0629',howto:'\u0643\u064A\u0641 \u062A\u0633\u062A\u062E\u062F\u0645',wiki:'\u0648\u064A\u0643\u064A',
faq_q1:'\u0645\u0627 \u0647\u0648 \u0645\u062D\u0627\u0643\u064A MITM\u061F',faq_a1:'\u0645\u062D\u0627\u0643\u064A \u0628\u0635\u0631\u064A \u064A\u0648\u0636\u062D \u0643\u064A\u0641 \u062A\u0639\u062A\u0631\u0636 \u0625\u064A\u0641 \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u0648\u0643\u064A\u0641 \u064A\u0645\u0646\u0639\u0647\u0627 \u0627\u0644\u062A\u0634\u0641\u064A\u0631.',
faq_q2:'\u0647\u0644 \u0647\u0630\u0627 \u0647\u062C\u0648\u0645 \u062D\u0642\u064A\u0642\u064A\u061F',faq_a2:'\u0644\u0627\u060C \u0647\u0630\u0647 \u0645\u062D\u0627\u0643\u0627\u0629 \u062A\u0639\u0644\u064A\u0645\u064A\u0629.',
faq_q3:'\u0643\u064A\u0641 \u0623\u063A\u064A\u0651\u0631 \u0627\u0644\u0644\u063A\u0629\u061F',faq_a3:'\u0627\u0641\u062A\u062D \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A.',
faq_q4:'\u0647\u0644 \u0628\u064A\u0627\u0646\u0627\u062A\u064A \u062E\u0627\u0635\u0629\u061F',faq_a4:'\u0646\u0639\u0645\u060C \u0643\u0644 \u0634\u064A\u0621 \u0645\u062D\u0644\u064A.',
howto_1:'\u0627\u0643\u062A\u0628 \u0631\u0633\u0627\u0644\u0629 \u0648\u0627\u0646\u0642\u0631 \u0625\u0631\u0633\u0627\u0644.',howto_2:'\u0641\u0639\u0651\u0644 \u0627\u0639\u062A\u0631\u0627\u0636 \u0625\u064A\u0641 \u0644\u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0631\u0633\u0627\u0626\u0644.',
howto_3:'\u0641\u0639\u0651\u0644 \u0627\u0644\u062A\u0634\u0641\u064A\u0631 \u0644\u0645\u0646\u0639 \u0625\u064A\u0641.',howto_4:'\u0627\u0641\u062A\u062D \u0627\u0644\u0642\u0633\u0645 C \u0644\u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A\u0627\u062A \u0627\u0644\u062F\u0641\u0627\u0639.',
wiki_themes_title:'\uD83C\uDFA8 \u0627\u0644\u0645\u0638\u0627\u0647\u0631',wiki_themes:'8 \u0645\u0638\u0627\u0647\u0631.',wiki_i18n_title:'\uD83C\uDF10 \u0627\u0644\u0644\u063A\u0627\u062A',wiki_i18n:'\u062B\u0644\u0627\u062B\u064A \u0627\u0644\u0644\u063A\u0627\u062A.',
wiki_log_title:'\uD83D\uDCDC \u0633\u062C\u0644',wiki_log:'\u0633\u062C\u0644 \u0645\u0624\u0631\u0651\u062E.',wiki_privacy_title:'\uD83D\uDD12 \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629',wiki_privacy:'\u0645\u062D\u0644\u064A \u0623\u0648\u0644\u0627\u064B.',
working:'\u062C\u0627\u0631\u064D\u2026',t_mosque:'\u0645\u0633\u062C\u062F',t_zellige:'\u0632\u0644\u064A\u062C',t_andalus:'\u0623\u0646\u062F\u0644\u0633',t_riad:'\u0631\u064A\u0627\u0636',t_medina:'\u0645\u062F\u064A\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062F\u063A\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062A',
ready:'\uD83D\uDD75\uFE0F \u0645\u062D\u0627\u0643\u064A MITM \u062C\u0627\u0647\u0632!',logCleared:'\u062A\u0645 \u0627\u0644\u0645\u0633\u062D',copied:'\u062A\u0645 \u0627\u0644\u0646\u0633\u062E!',copyFail:'\u0641\u0634\u0644',
export:'\u062A\u0635\u062F\u064A\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\uD83D\uDD0A \u0623\u0635\u0648\u0627\u062A',whisperMode:'\u0647\u0645\u0633',breathingGuide:'\u062A\u0646\u0641\u0633',dhikrTap:'\u0627\u0636\u063A\u0637',musicMode:'\u0645\u0648\u0633\u064A\u0642\u0649',
splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u062E\u0637\u064A',langChanged:'\uD83C\uDF10 \u0627\u0644\u0644\u063A\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064A\u0629',themeChanged:'\uD83C\uDFA8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
msgPlaceholder:'\u0627\u0643\u062A\u0628 \u0631\u0633\u0627\u0644\u0629...',sendBtn:'\u0625\u0631\u0633\u0627\u0644',eveIntercept:'\uD83D\uDD75\uFE0F \u0627\u0639\u062A\u0631\u0627\u0636 \u0625\u064A\u0641',encryption:'\uD83D\uDD12 \u062A\u0634\u0641\u064A\u0631 (TLS)',autoDemo:'\u0639\u0631\u0636 \u062A\u0644\u0642\u0627\u0626\u064A',
msgLogTitle:'\u0633\u062C\u0644 \u0627\u0644\u0631\u0633\u0627\u0626\u0644',
mitmExplain:'\u0641\u064A \u0647\u062C\u0648\u0645 MITM\u060C \u062A\u0639\u062A\u0631\u0636 \u0625\u064A\u0641 \u0633\u0631\u0627\u064B \u0627\u0644\u0627\u062A\u0635\u0627\u0644\u0627\u062A \u0628\u064A\u0646 \u0623\u0644\u064A\u0633 \u0648\u0628\u0648\u0628. \u0628\u062F\u0648\u0646 \u062A\u0634\u0641\u064A\u0631\u060C \u062A\u0642\u0631\u0623 \u0625\u064A\u0641 \u0643\u0644 \u0634\u064A\u0621. \u0645\u0639 TLS\u060C \u062A\u0631\u0649 \u0641\u0642\u0637 \u0646\u0635\u0627\u064B \u0645\u0634\u0641\u0631\u0627\u064B.',
scenariosText:'\u0634\u0628\u0643\u0627\u062A Wi-Fi \u0627\u0644\u0639\u0627\u0645\u0629 \u0647\u064A \u0646\u0642\u0637\u0629 \u0647\u062C\u0648\u0645 \u0634\u0627\u0626\u0639\u0629. ARP spoofing \u064A\u0639\u064A\u062F \u062A\u0648\u062C\u064A\u0647 \u0627\u0644\u062D\u0631\u0643\u0629. DNS spoofing \u064A\u0631\u0633\u0644 \u0644\u0645\u0648\u0627\u0642\u0639 \u0645\u0632\u064A\u0641\u0629.',
defenseText:'\u062A\u0639\u0644\u0645 \u0627\u0644\u062F\u0641\u0627\u0639 \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645 HTTPS \u0648certificate pinning \u0648HSTS.',
showDefenseBtn:'\u0639\u0631\u0636 \u062F\u0644\u064A\u0644 \u0627\u0644\u062F\u0641\u0627\u0639',
sending:'\u062C\u0627\u0631\u064D \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629...',aliceSays:'\u0623\u0644\u064A\u0633',bobSays:'\u0628\u0648\u0628',eveSays:'\u0625\u064A\u0641',
eveReads:'\u0625\u064A\u0641 \u062A\u0642\u0631\u0623 \u0627\u0644\u0646\u0635 \u0627\u0644\u0648\u0627\u0636\u062D!',eveBlocked:'\u0625\u064A\u0641 \u062A\u0631\u0649 \u0641\u0642\u0637 \u0646\u0635\u0627\u064B \u0645\u0634\u0641\u0631\u0627\u064B',eveOff:'\u0625\u064A\u0641 \u0644\u0627 \u062A\u0639\u062A\u0631\u0636',
msgDelivered:'\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0644\u0628\u0648\u0628',encrypted:'\u0645\u0634\u0641\u0631',plaintext:'\u0646\u0635 \u0648\u0627\u0636\u062D',
defense_https:'HTTPS: \u064A\u0634\u0641\u0631 \u0643\u0644 \u062D\u0631\u0643\u0629 \u0627\u0644\u0645\u0631\u0648\u0631.',
defense_hsts:'HSTS: \u064A\u062C\u0628\u0631 \u0627\u0644\u0645\u062A\u0635\u0641\u062D \u0639\u0644\u0649 HTTPS.',
defense_pin:'Certificate Pinning: \u064A\u0645\u0646\u0639 \u0627\u0644\u0634\u0647\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u0632\u064A\u0641\u0629.',
defense_mtls:'TLS \u0645\u062A\u0628\u0627\u062F\u0644: \u0627\u0644\u0637\u0631\u0641\u0627\u0646 \u064A\u062A\u062D\u0642\u0642\u0627\u0646.',
defense_vpn:'VPN: \u064A\u0634\u0641\u0631 \u0643\u0644 \u0627\u0644\u062D\u0631\u0643\u0629 \u0639\u0628\u0631 \u0646\u0641\u0642.',
}
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
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const k=el.dataset.i18nPlaceholder;if(s[k]!=null)el.placeholder=s[k];});document.title=`${s.title} \u2014 Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${s.themeChanged} ${s['t_'+n]||n}`,'info');}
let logContainer,typewriterEnabled=true;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;const ft=`[${new Date().toLocaleTimeString()}] ${m}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(t==='success'){playSound('success');pulseBismillah('success');setPetState('happy');}else if(t==='error'){playSound('error');pulseBismillah('error');setPetState('sad');}logHistory.push({m,t,ts:Date.now()});applyLogFilter();resetPetSleep();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='mitm-log.txt';a.click();URL.revokeObjectURL(u);}
let toastTimer=null;function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(12+Math.random()*18);}el.classList.remove('typing');}
const logHistory=[];
function pulseBismillah(t){const b=document.querySelector('.bismillah');if(!b)return;b.classList.remove('pulse-success','pulse-error');void b.offsetWidth;b.classList.add(t==='error'?'pulse-error':'pulse-success');setTimeout(()=>b.classList.remove('pulse-success','pulse-error'),700);}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx&&!(audioCtx=new AudioCtx()))return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'||l.classList.contains(activeLogFilter)?'':'none';});}
const PET_STATES={idle:{class:'pet-idle',duration:0},happy:{class:'pet-happy',duration:3000},sad:{class:'pet-sad',duration:3000},sleep:{class:'pet-sleep',duration:0}};
let petState='idle',petIdleTimer=null,petSleepTimer=null;
function initPixelPet(){const p=document.createElement('div');p.id='pixelPet';p.className='pixel-pet pet-idle';p.innerHTML=`<img src="${FOOTER_ICON}" alt="Bot"/>`;p.addEventListener('click',()=>{setPetState('happy');playSound('success');});const f=document.querySelector('.app-footer');if(f)f.insertBefore(p,f.firstChild);}
function setPetState(s){petState=s;const p=$('pixelPet');if(!p)return;p.classList.remove('pet-idle','pet-happy','pet-sad','pet-sleep');p.classList.add(PET_STATES[s].class);if(petIdleTimer)clearTimeout(petIdleTimer);if(PET_STATES[s].duration>0)petIdleTimer=setTimeout(()=>setPetState('idle'),PET_STATES[s].duration);}
function resetPetSleep(){if(petSleepTimer)clearTimeout(petSleepTimer);if(petState==='sleep')setPetState('idle');petSleepTimer=setTimeout(()=>setPetState('sleep'),60000);}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let breathingActive=false,dhikrCount=0;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));log(breathingActive?'\uD83E\uDEC1 On':'\uD83E\uDEC1 Off','info');if(!breathingActive&&dhikrCount>0){log(`\uD83D\uDCFF ${dhikrCount}`,'success');dhikrCount=0;}}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
let recognition=null,whisperActive=false;
function toggleWhisper(){if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){log('\uD83C\uDFA4 Not supported','error');return;}if(whisperActive){if(recognition)recognition.stop();whisperActive=false;log('\uD83C\uDFA4 Off','info');return;}const SR=window.SpeechRecognition||window.webkitSpeechRecognition;recognition=new SR();recognition.continuous=true;recognition.interimResults=false;recognition.lang=currentLang==='ar'?'ar-DZ':currentLang==='fr'?'fr-FR':'en-US';recognition.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal){const t=e.results[i][0].transcript.trim();if(t)log(`\uD83C\uDFA4 ${t}`,'rx');}};recognition.onerror=e=>log(`\uD83C\uDFA4 ${e.error}`,'error');recognition.onend=()=>{if(whisperActive)recognition.start();};recognition.start();whisperActive=true;log('\uD83C\uDFA4 On','success');}
function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open');}
function closePanel(p,o,r){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const t=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(t)t.classList.add('active');});});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{d=false;});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('\uD83D\uDD79\uFE0F KONAMI!','success');}}else konamiIdx=0;});}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='\u0628\u0633\u0645\u0627\u0644\u0631\u062D\u0646\u064A\u0648\u0643\u0644\u062A\u0639\u062F\u0641\u0642\u062B\u0635\u0636\u0637\u0638\u063A';
function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);(function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);})();}
function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';let cc=0,ct=null;l.addEventListener('click',()=>{cc++;if(ct)clearTimeout(ct);if(cc>=3){cc=0;toggleMatrix();}else ct=setTimeout(()=>cc=0,500);});}

/* ══════════════════════════════════════════════════════════════
   MITM SIMULATOR ENGINE
   ══════════════════════════════════════════════════════════════ */

const ACTORS={
  alice:{label:'Alice',icon:'\uD83D\uDC69',color:'#22c55e',x:80,y:150},
  eve:  {label:'Eve',  icon:'\uD83D\uDD75\uFE0F',color:'#ef4444',x:350,y:60},
  bob:  {label:'Bob',  icon:'\uD83D\uDC68',color:'#3b82f6',x:620,y:150}
};

let sending=false,msgHistory=[];

function fakeEncrypt(msg){
  let enc='';
  for(let i=0;i<msg.length;i++){
    enc+=String.fromCharCode(((msg.charCodeAt(i)+7+i*3)%94)+33);
  }
  return enc;
}

function drawScene(ctx,w,h,opts){
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#0a1628';ctx.fillRect(0,0,w,h);

  const eveActive=opts.eveActive;
  const encrypted=opts.encrypted;

  // Draw connection lines
  ctx.setLineDash([]);
  // Alice -> (Eve or Bob)
  if(eveActive){
    // Alice -> Eve
    ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(ACTORS.alice.x,ACTORS.alice.y);ctx.lineTo(ACTORS.eve.x,ACTORS.eve.y);ctx.stroke();
    // Eve -> Bob
    ctx.beginPath();ctx.moveTo(ACTORS.eve.x,ACTORS.eve.y);ctx.lineTo(ACTORS.bob.x,ACTORS.bob.y);ctx.stroke();
  } else {
    // Alice -> Bob direct
    ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(ACTORS.alice.x,ACTORS.alice.y);ctx.lineTo(ACTORS.bob.x,ACTORS.bob.y);ctx.stroke();
  }

  // Encrypted tunnel indicator
  if(encrypted){
    ctx.strokeStyle='rgba(59,130,246,0.25)';ctx.lineWidth=1;ctx.setLineDash([5,5]);
    if(eveActive){
      ctx.beginPath();ctx.moveTo(ACTORS.alice.x+30,ACTORS.alice.y-20);ctx.lineTo(ACTORS.eve.x,ACTORS.eve.y-20);ctx.lineTo(ACTORS.bob.x-30,ACTORS.bob.y-20);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ACTORS.alice.x+30,ACTORS.alice.y+20);ctx.lineTo(ACTORS.eve.x,ACTORS.eve.y+50);ctx.lineTo(ACTORS.bob.x-30,ACTORS.bob.y+20);ctx.stroke();
    } else {
      ctx.beginPath();ctx.moveTo(ACTORS.alice.x+30,ACTORS.alice.y-20);ctx.lineTo(ACTORS.bob.x-30,ACTORS.bob.y-20);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ACTORS.alice.x+30,ACTORS.alice.y+20);ctx.lineTo(ACTORS.bob.x-30,ACTORS.bob.y+20);ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(59,130,246,0.4)';ctx.font='10px monospace';ctx.textAlign='center';
    ctx.fillText('TLS ENCRYPTED',w/2,ACTORS.alice.y+45);
  }

  // Draw actors
  Object.values(ACTORS).forEach(a=>{
    if(a===ACTORS.eve&&!eveActive){
      // Draw Eve grayed out
      ctx.globalAlpha=0.3;
    }
    ctx.beginPath();ctx.arc(a.x,a.y,28,0,Math.PI*2);
    ctx.fillStyle=a.color+'22';ctx.fill();
    ctx.strokeStyle=a.color;ctx.lineWidth=2;ctx.stroke();
    ctx.font='22px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#fff';ctx.fillText(a.icon,a.x,a.y);
    ctx.font='11px Tajawal,sans-serif';ctx.fillStyle=a.color;
    ctx.fillText(a.label,a.x,a.y+40);
    ctx.globalAlpha=1;
  });

  // Draw packet if animating
  if(opts.packetX!=null&&opts.packetY!=null){
    ctx.beginPath();ctx.arc(opts.packetX,opts.packetY,8,0,Math.PI*2);
    ctx.fillStyle=encrypted?'#3b82f6':'#f59e0b';ctx.globalAlpha=0.8;ctx.fill();ctx.globalAlpha=1;
    ctx.beginPath();ctx.arc(opts.packetX,opts.packetY,4,0,Math.PI*2);
    ctx.fillStyle='#fff';ctx.fill();
    if(opts.packetLabel){
      ctx.font='9px monospace';ctx.fillStyle='rgba(255,255,255,0.7)';ctx.textAlign='center';
      const dl=opts.packetLabel.length>18?opts.packetLabel.substring(0,18)+'...':opts.packetLabel;
      ctx.fillText(dl,opts.packetX,opts.packetY-14);
    }
  }

  // Eve's intercepted data
  if(opts.eveData){
    ctx.font='9px monospace';ctx.textAlign='center';
    ctx.fillStyle=encrypted?'rgba(59,130,246,0.7)':'rgba(239,68,68,0.9)';
    const ed=opts.eveData.length>22?opts.eveData.substring(0,22)+'...':opts.eveData;
    ctx.fillText(ed,ACTORS.eve.x,ACTORS.eve.y+58);
    if(!encrypted){
      ctx.fillStyle='rgba(239,68,68,0.6)';ctx.font='8px sans-serif';
      ctx.fillText('\uD83D\uDC41\uFE0F READING',ACTORS.eve.x,ACTORS.eve.y+70);
    } else {
      ctx.fillStyle='rgba(59,130,246,0.6)';ctx.font='8px sans-serif';
      ctx.fillText('\uD83D\uDD12 BLOCKED',ACTORS.eve.x,ACTORS.eve.y+70);
    }
  }

  ctx.textAlign='start';
}

function lerp(a,b,t){return a+(b-a)*t;}

async function sendMessage(){
  if(sending)return;
  const s=LANG[currentLang];
  const msg=$('msgInput').value.trim();
  if(!msg)return;
  const eveActive=$('eveToggle').checked;
  const encrypted=$('encryptToggle').checked;
  sending=true;setStatus(true);showToast(s.sending);
  log(`\uD83D\uDCE8 ${s.aliceSays} \u2192 ${s.bobSays}: "${msg}" ${encrypted?'[\uD83D\uDD12]':'[\u26A0\uFE0F]'}`,'tx');

  const canvas=$('mitmCanvas');const ctx=canvas.getContext('2d');const w=canvas.width,h=canvas.height;
  const encMsg=fakeEncrypt(msg);
  const transitData=encrypted?encMsg:msg;

  if(eveActive){
    // Phase 1: Alice -> Eve
    for(let t=0;t<=30;t++){
      const prog=t/30;
      const px=lerp(ACTORS.alice.x,ACTORS.eve.x,prog);
      const py=lerp(ACTORS.alice.y,ACTORS.eve.y,prog);
      drawScene(ctx,w,h,{eveActive,encrypted,packetX:px,packetY:py,packetLabel:transitData.substring(0,18),eveData:null});
      await sleep(25);
    }
    playSound('click');

    // Eve intercepts
    if(encrypted){
      log(`\uD83D\uDD12 ${s.eveBlocked}: "${encMsg.substring(0,20)}..."`,'success');
      drawScene(ctx,w,h,{eveActive,encrypted,packetX:null,packetY:null,eveData:encMsg});
    } else {
      log(`\uD83D\uDC41\uFE0F ${s.eveReads} "${msg}"`,'error');
      drawScene(ctx,w,h,{eveActive,encrypted,packetX:null,packetY:null,eveData:msg});
    }
    await sleep(800);

    // Phase 2: Eve -> Bob
    for(let t=0;t<=30;t++){
      const prog=t/30;
      const px=lerp(ACTORS.eve.x,ACTORS.bob.x,prog);
      const py=lerp(ACTORS.eve.y,ACTORS.bob.y,prog);
      drawScene(ctx,w,h,{eveActive,encrypted,packetX:px,packetY:py,packetLabel:transitData.substring(0,18),eveData:encrypted?encMsg:msg});
      await sleep(25);
    }
  } else {
    // Direct: Alice -> Bob
    log(`\u2714\uFE0F ${s.eveOff}`,'info');
    for(let t=0;t<=40;t++){
      const prog=t/40;
      const px=lerp(ACTORS.alice.x,ACTORS.bob.x,prog);
      const py=ACTORS.alice.y;
      drawScene(ctx,w,h,{eveActive,encrypted,packetX:px,packetY:py,packetLabel:transitData.substring(0,18),eveData:null});
      await sleep(25);
    }
  }

  playSound('success');
  log(`\u2705 ${s.msgDelivered}: "${msg}"`,'success');
  drawScene(ctx,w,h,{eveActive,encrypted,packetX:null,packetY:null,eveData:eveActive?(encrypted?encMsg:msg):null});

  // Add to message log
  msgHistory.push({msg,encrypted,eveActive,time:new Date().toLocaleTimeString()});
  renderMsgLog();

  hideToast();sending=false;
}

function renderMsgLog(){
  const wrap=$('msgLog'),body=$('msgLogBody');
  if(!wrap||!body)return;
  if(msgHistory.length===0){wrap.style.display='none';return;}
  wrap.style.display='block';
  body.innerHTML='';
  msgHistory.slice(-10).reverse().forEach(m=>{
    const s=LANG[currentLang];
    const div=document.createElement('div');
    div.style.cssText='padding:.3rem .5rem;margin-bottom:.3rem;border-radius:6px;border-left:3px solid '+(m.eveActive&&!m.encrypted?'#ef4444':m.encrypted?'#3b82f6':'#f59e0b')+';background:rgba(0,0,0,.2);';
    const status=m.encrypted?s.encrypted:s.plaintext;
    const eveStatus=m.eveActive?(m.encrypted?'\uD83D\uDD12':'\uD83D\uDC41\uFE0F'):'\u2014';
    div.innerHTML=`<span style="color:var(--text-muted);font-size:.7rem;">${m.time}</span> <strong>"${m.msg}"</strong> <span style="font-size:.72rem;color:${m.encrypted?'#3b82f6':'#f59e0b'};">[${status}]</span> <span style="font-size:.72rem;">Eve: ${eveStatus}</span>`;
    body.appendChild(div);
  });
}

async function autoDemo(){
  if(sending)return;
  const s=LANG[currentLang];
  const input=$('msgInput');
  const eveToggle=$('eveToggle');
  const encToggle=$('encryptToggle');

  // Step 1: No Eve, no encryption
  input.value='Hello Bob!';eveToggle.checked=false;encToggle.checked=false;
  await sendMessage();await sleep(600);

  // Step 2: Eve ON, no encryption (attack succeeds)
  input.value='My password is 1234';eveToggle.checked=true;encToggle.checked=false;
  await sendMessage();await sleep(600);

  // Step 3: Eve ON, encryption ON (attack fails)
  input.value='Secret project details';eveToggle.checked=true;encToggle.checked=true;
  await sendMessage();await sleep(600);

  // Step 4: Eve OFF, encryption ON (safe)
  input.value='All clear now!';eveToggle.checked=false;encToggle.checked=true;
  await sendMessage();

  log('\uD83C\uDF93 Demo complete! Notice how encryption blocked Eve.','success');
}

function showDefenseGuide(){
  const s=LANG[currentLang];
  const r=$('defenseResults');if(!r)return;
  r.style.display='block';
  const defenses=[
    {icon:'\uD83D\uDD12',text:s.defense_https,color:'#22c55e'},
    {icon:'\uD83D\uDEE1\uFE0F',text:s.defense_hsts,color:'#3b82f6'},
    {icon:'\uD83D\uDCCC',text:s.defense_pin,color:'#f59e0b'},
    {icon:'\uD83D\uDD04',text:s.defense_mtls,color:'#a855f7'},
    {icon:'\uD83D\uDD10',text:s.defense_vpn,color:'#0ea5e9'},
  ];
  r.innerHTML=defenses.map(d=>`<div style="padding:.4rem .6rem;margin-bottom:.3rem;border-radius:6px;border-left:3px solid ${d.color};background:rgba(0,0,0,.2);font-size:.78rem;">${d.icon} ${d.text}</div>`).join('');
  log('\uD83D\uDEE1\uFE0F Defense guide shown','success');
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  $('whisperBtn').onclick=toggleWhisper;
  const bb=$('breathingBtn'),dd=$('dhikrDisplay'),db=$('dhikrBtn');
  if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none';};if(db)db.onclick=incrementDhikr;
  $('musicBtn').onclick=()=>log('\uD83C\uDFB5 Coming soon','info');
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initKonami();initMatrixTrigger();initHijriDate();initPixelPet();

  // App specific
  $('sendBtn').onclick=sendMessage;
  $('autoBtn').onclick=autoDemo;
  const defBtn=$('showDefenseBtn');if(defBtn)defBtn.onclick=showDefenseGuide;
  $('msgInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendMessage();});

  // Initial render
  const c=$('mitmCanvas');
  if(c){
    const ctx=c.getContext('2d');
    drawScene(ctx,c.width,c.height,{eveActive:false,encrypted:false,packetX:null,packetY:null,eveData:null});
  }

  // Enhanced: Packet Sniffer Visualization
  (function(){
  let sCanvas,sCtx;const sniffed=[];
  function createSC(){
    const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
    const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
    w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Packet Sniffer Waterfall</div>';
    const c=document.createElement('canvas');c.width=620;c.height=220;
    c.style.cssText='width:100%;height:auto;display:block;background:#0a0e1a;';
    w.appendChild(c);t.appendChild(w);return c;
  }
  function drawSC(){
    if(!sCtx)return;const w=sCanvas.width,h=sCanvas.height;
    sCtx.fillStyle='rgba(10,14,26,0.08)';sCtx.fillRect(0,0,w,h);
    // Waterfall - each row is a captured packet
    const rowH=8;const maxRows=Math.floor(h/rowH);
    if(sniffed.length>maxRows)sniffed.shift();
    sniffed.forEach((pkt,i)=>{
      const y=i*rowH;
      // Protocol color band
      const colors={TCP:'#3b82f6',UDP:'#22c55e',HTTP:'#f59e0b',HTTPS:'#10b981',DNS:'#8b5cf6'};
      const proto=['TCP','UDP','HTTP','HTTPS','DNS'][Math.floor(Math.random()*5)];
      if(!pkt.proto)pkt.proto=proto;
      const col=colors[pkt.proto]||'#6b7280';
      fCtx=sCtx;
      // Time column
      sCtx.fillStyle='rgba(255,255,255,0.05)';sCtx.fillRect(0,y,60,rowH-1);
      sCtx.fillStyle='rgba(255,255,255,0.3)';sCtx.font='6px monospace';sCtx.textAlign='left';
      sCtx.fillText(pkt.time||'00:00',2,y+6);
      // Source
      sCtx.fillStyle=col+'22';sCtx.fillRect(62,y,120,rowH-1);
      sCtx.fillStyle=col;sCtx.fillText(pkt.src||'192.168.1.'+Math.floor(Math.random()*255),64,y+6);
      // Dest
      sCtx.fillStyle='rgba(255,255,255,0.03)';sCtx.fillRect(184,y,120,rowH-1);
      sCtx.fillStyle='rgba(255,255,255,0.4)';sCtx.fillText(pkt.dst||'10.0.0.'+Math.floor(Math.random()*255),186,y+6);
      // Protocol
      sCtx.fillStyle=col+'33';sCtx.fillRect(306,y,50,rowH-1);
      sCtx.fillStyle=col;sCtx.fillText(pkt.proto,308,y+6);
      // Data preview (hex)
      sCtx.fillStyle='rgba(255,255,255,0.03)';sCtx.fillRect(358,y,w-358,rowH-1);
      if(!pkt.hex)pkt.hex=Array.from({length:20},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(' ');
      sCtx.fillStyle=pkt.encrypted?'rgba(16,185,129,0.4)':'rgba(239,68,68,0.4)';
      sCtx.fillText(pkt.encrypted?'[ENCRYPTED]':pkt.hex,360,y+6);
    });
    // Auto-generate packets
    if(Math.random()>0.7){
      sniffed.push({time:new Date().toLocaleTimeString().slice(0,5),
        src:'192.168.1.'+Math.floor(Math.random()*255),
        dst:'10.0.0.'+Math.floor(Math.random()*255),
        encrypted:Math.random()>0.5});
    }
    requestAnimationFrame(drawSC);
  }
  sCanvas=createSC();if(sCanvas){sCtx=sCanvas.getContext('2d');drawSC();}
  })();

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ INIT POMODORO + CARD FLIP ═══════ */
document.addEventListener('DOMContentLoaded', function(){
  try { initPomodoro(); } catch(e) { console.warn('Pomodoro init error:', e); }
  try { initCardFlip(); } catch(e) { console.warn('CardFlip init error:', e); }
});
