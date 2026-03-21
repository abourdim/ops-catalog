/**
 * Workshop DIY — esp-packet-storm v1.0
 * Network Traffic Generator with Cyberpunk Visualization
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.139885 78.322945 253.991455 136.254120"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663z"/><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}

// ── Shared i18n keys (template) ──
const LANG_BASE = {
  en: {
    copied:'Copied!',
    demoNext:'Next',
    demoPause:'Pause',
    demoPlay:'Play',
    demoPrev:'Prev',
    learnAge:'Ages:',
    learnLevel:'Level:',
    learnTime:'Time:',
    logCleared:'Log cleared',
    sectionCode:'Device Code',
    sectionDemo:'Watch Demo',
    sectionLearn:'What You Shall Learn',
    splashHint:'tap to skip'
  },
  fr: {
    copied:'Copié !',
    demoNext:'Suiv',
    demoPause:'Pause',
    demoPlay:'Jouer',
    demoPrev:'Préc',
    learnAge:'Âge :',
    learnLevel:'Niveau :',
    learnTime:'Durée :',
    logCleared:'Journal effacé',
    sectionCode:'Code Appareil',
    sectionDemo:'Voir la Démo',
    sectionLearn:'Ce que tu vas apprendre',
    splashHint:'appuyer pour passer'
  },
  ar: {
    copied:'تم النسخ!',
    demoNext:'التالي',
    demoPause:'إيقاف',
    demoPlay:'تشغيل',
    demoPrev:'السابق',
    learnAge:'العمر:',
    learnLevel:'المستوى:',
    learnTime:'المدة:',
    logCleared:'تم مسح السجل',
    sectionCode:'كود الجهاز',
    sectionDemo:'شاهد العرض',
    sectionLearn:'ماذا ستتعلم',
    splashHint:'انقر للتخطي'
  }
};

const LANG={
  en:{
    ...LANG_BASE.en,
    title:'Packet Storm',subtitle:'⚡ generate · 📊 analyze · 🌊 storm',
    disconnected:'Disconnected',connected:'Connected',
    mainSection:'Packet Storm — Traffic Generator',mainDesc:'Generate fake network traffic with cyberpunk visualization',
    sectionA:'How It Works',sectionB:'Protocol Lab',sectionC:'Challenge',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
    settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    startBtn:'Start Storm',stopBtn:'Stop',totalPackets:'Total Packets',pps:'Packets/sec',totalBytesLabel:'Bytes',
    howStep1:'The generator creates fake network packets with realistic headers.',
    howStep2:'Each packet type (TCP, UDP, ICMP, ARP) has its own header structure and color.',
    howStep3:'The matrix-style canvas shows packets flowing in real-time.',
    howStep4:'The hex inspector shows raw packet bytes like Wireshark.',
    challenge1:'What is the difference between TCP and UDP?',
    challenge2:'Why is ARP important for network attacks?',
    challenge3:'How can you detect a packet storm on a real network?',
    challengeReveal1:'TCP is connection-oriented with error checking. UDP is connectionless — faster but unreliable. TCP = phone call, UDP = postcard.',
    challengeReveal2:'ARP maps IP to MAC addresses. ARP spoofing lets attackers redirect traffic (man-in-the-middle).',
    challengeReveal3:'Monitor bandwidth, check for unusual packet rates, use IDS/IPS, and look for traffic patterns deviating from baseline.',
    revealBtn:'Reveal Answer',labDesc:'The protocol breakdown bar shows the ratio of different packet types.',
    howto_1:'Select a protocol type (TCP, UDP, ICMP, ARP, or MIX).',
    howto_2:'Adjust the rate slider to control packets per second.',
    howto_3:'Click Start Storm to begin generating packets.',
    howto_4:'Watch the hex inspector and protocol bar for analysis.',
    wiki_tcp_title:'🔵 TCP',wiki_tcp:'Reliable, ordered, connection-oriented. Used for web, email, file transfer.',
    wiki_udp_title:'🟢 UDP',wiki_udp:'Fast, connectionless, no delivery guarantee. Used for streaming, gaming, DNS.',
    wiki_icmp_title:'🟡 ICMP',wiki_icmp:'Used for ping, traceroute, and network diagnostics.',
    wiki_arp_title:'🔴 ARP',wiki_arp:'Maps IP addresses to MAC addresses on local networks.',
    working:'Working…',stormStarted:'Packet storm started!',stormStopped:'Storm stopped.',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
    ready:'⚡ Packet Storm ready — select protocol and unleash!',
    logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
    splashHint:'tap to skip',newVersion:'UPDATE',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',step1Title:'Scan',step1Desc:'The generator creates fake network packets with realistic headers.',step2Title:'Capture',step2Desc:'Each packet type (TCP, UDP, ICMP, ARP) has its own header structure and color.',step3Title:'Analyze',step3Desc:'The matrix-style canvas shows packets flowing in real-time.',step4Title:'Report',step4Desc:'The hex inspector shows raw packet bytes like Wireshark.',sectionCode:'Device Code',faq_q1:'What is Packet Storm?',faq_a1:'Packet Storm lets you generate fake network traffic with cyberpunk visualization. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you the generator creates fake network packets with realistic headers. Then you each packet type (tcp, udp, icmp, arp) has its own header structure and color.',faq_q3:'What do the controls do?',faq_a3:'Select a protocol type (TCP, UDP, ICMP, ARP, or MIX). Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'موثوق، مرتب، موجّه بالاتصال.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need ESP32. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Arp Detective and Esp Captive Portal. Each app in this category teaches a different aspect of networking.',demo_s1:'Welcome to Packet Storm! Look at the main display — this is where the networking simulation runs.',demo_s2:'Select a protocol type (TCP, UDP, ICMP, ARP, or MIX). Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of networking.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how networking works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches networking concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Protocol Lab" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{
    title:'Packet Storm',subtitle:'⚡ générer · 📊 analyser · 🌊 tempête',
    disconnected:'Déconnecté',connected:'Connecté',
    mainSection:'Packet Storm — Générateur de trafic',mainDesc:'Générez du faux trafic réseau avec visualisation cyberpunk',
    sectionA:'Comment ça marche',sectionB:'Labo Protocoles',sectionC:'Défi',
    activityLog:'Journal',eventsMsg:'Événements et messages',
    clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
    settings:'⚙️ Paramètres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    startBtn:'Lancer la tempête',stopBtn:'Arrêter',totalPackets:'Total Paquets',pps:'Paquets/sec',totalBytesLabel:'Octets',
    howStep1:'Le générateur crée de faux paquets réseau avec des en-têtes réalistes.',
    howStep2:'Chaque type (TCP, UDP, ICMP, ARP) a sa propre structure et couleur.',
    howStep3:'Le canvas montre les paquets en temps réel style Matrix.',
    howStep4:'L\'inspecteur hex montre les octets bruts comme Wireshark.',
    challenge1:'Quelle différence entre TCP et UDP ?',challenge2:'Pourquoi ARP est important pour les attaques ?',challenge3:'Comment détecter une tempête de paquets ?',
    challengeReveal1:'TCP est orienté connexion avec vérification. UDP est sans connexion — plus rapide mais non fiable.',
    challengeReveal2:'ARP associe IP aux adresses MAC. L\'usurpation ARP permet le man-in-the-middle.',
    challengeReveal3:'Surveiller la bande passante, vérifier les taux inhabituels, utiliser IDS/IPS.',
    revealBtn:'Révéler',labDesc:'La barre montre la répartition des types de paquets.',
    howto_1:'Sélectionnez un type de protocole.',howto_2:'Ajustez le débit avec le curseur.',howto_3:'Cliquez Lancer pour générer les paquets.',howto_4:'Observez l\'inspecteur hex et la barre de protocoles.',
    wiki_tcp_title:'🔵 TCP',wiki_tcp:'Fiable, ordonné, orienté connexion.',wiki_udp_title:'🟢 UDP',wiki_udp:'Rapide, sans connexion.',wiki_icmp_title:'🟡 ICMP',wiki_icmp:'Pour ping et traceroute.',wiki_arp_title:'🔴 ARP',wiki_arp:'Associe IP aux adresses MAC.',
    working:'En cours…',stormStarted:'Tempête lancée !',stormStopped:'Tempête arrêtée.',
    t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
    ready:'⚡ Packet Storm prêt — sélectionnez et déchaînez !',
    logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
    soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Réactif musique',
    splashHint:'appuyer pour passer',newVersion:'MAJ',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',step1Title:'Scanner',step1Desc:'Le générateur crée de faux paquets réseau avec des en-têtes réalistes.',step2Title:'Capturer',step2Desc:'Chaque type (TCP, UDP, ICMP, ARP) a sa propre structure et couleur.',step3Title:'Analyser',step3Desc:'Le canvas montre les paquets en temps réel style Matrix.',step4Title:'Rapporter',step4Desc:'L\'inspecteur hex montre les octets bruts comme Wireshark.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle te permet de voir comment les réseaux communiquent ! 🌐 Comme une vision aux rayons X du trafic internet.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut ESP32. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Esp Rogue Ap Detector and Esp Dns Playground ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',learnAge:'Âge :'},
  ar:{
    title:'Packet Storm',subtitle:'⚡ توليد · 📊 تحليل · 🌊 عاصفة',
    disconnected:'غير متصل',connected:'متصل',
    mainSection:'Packet Storm — مولّد حركة مرور',mainDesc:'ولّد حركة شبكة مزيفة مع تصور سايبربانك',
    sectionA:'كيف يعمل',sectionB:'مختبر البروتوكولات',sectionC:'التحدي',
    activityLog:'سجل النشاط',eventsMsg:'الأحداث والرسائل',
    clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
    settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    startBtn:'بدء العاصفة',stopBtn:'إيقاف',totalPackets:'مجموع الحزم',pps:'حزم/ثانية',totalBytesLabel:'بايت',
    howStep1:'المولّد ينشئ حزم شبكة مزيفة بترويسات واقعية.',
    howStep2:'كل نوع حزمة (TCP, UDP, ICMP, ARP) له بنية ولون خاص.',
    howStep3:'اللوحة تعرض الحزم تتدفق بأسلوب ماتريكس.',
    howStep4:'المفتش السداسي يعرض بايتات الحزم الخام.',
    challenge1:'ما الفرق بين TCP و UDP؟',challenge2:'لماذا ARP مهم للهجمات؟',challenge3:'كيف تكتشف عاصفة حزم؟',
    challengeReveal1:'TCP موجّه بالاتصال مع فحص الأخطاء. UDP بدون اتصال — أسرع لكن غير موثوق.',
    challengeReveal2:'ARP يربط IP بعناوين MAC. تزييف ARP يتيح هجمات الوسيط.',
    challengeReveal3:'مراقبة عرض النطاق، فحص معدلات غير عادية، استخدام أنظمة IDS/IPS.',
    revealBtn:'اكشف الإجابة',labDesc:'شريط البروتوكولات يوضح نسبة أنواع الحزم.',
    howto_1:'اختر نوع البروتوكول.',howto_2:'اضبط المعدل بالمنزلق.',howto_3:'انقر بدء العاصفة لتوليد الحزم.',howto_4:'راقب المفتش السداسي وشريط البروتوكولات.',
    wiki_tcp_title:'🔵 TCP',wiki_tcp:'موثوق، مرتب، موجّه بالاتصال.',wiki_udp_title:'🟢 UDP',wiki_udp:'سريع، بدون اتصال.',wiki_icmp_title:'🟡 ICMP',wiki_icmp:'للبينغ وتتبع المسار.',wiki_arp_title:'🔴 ARP',wiki_arp:'يربط عناوين IP بعناوين MAC.',
    working:'جارٍ…',stormStarted:'بدأت العاصفة!',stormStopped:'توقفت العاصفة.',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
    ready:'⚡ Packet Storm جاهز — اختر البروتوكول وأطلق العاصفة!',
    logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
    soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',
    splashHint:'انقر للتخطي',newVersion:'تحديث',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',step1Title:'مسح',step1Desc:'المولّد ينشئ حزم شبكة مزيفة بترويسات واقعية.',step2Title:'التقاط',step2Desc:'كل نوع حزمة (TCP, UDP, ICMP, ARP) له بنية ولون خاص.',step3Title:'تحليل',step3Desc:'اللوحة تعرض الحزم تتدفق بأسلوب ماتريكس.',step4Title:'تقرير',step4Desc:'المفتش السداسي يعرض بايتات الحزم الخام.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يتيح لك رؤية كيف تتحدث الشبكات! 🌐 مثل رؤية بالأشعة السينية لحركة الإنترنت.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج ESP32. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Esp Rogue Ap Detector and Esp Dns Playground! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',learnAge:'العمر:'}
};

/* ═══════ FRAMEWORK (same across all apps) ═══════ */
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const k=el.dataset.i18nPlaceholder;if(s[k]!=null)el.placeholder=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${s.themeChanged} ${s['t_'+n]||n}`,'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}));a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();}
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'||l.classList.contains(activeLogFilter)?'':'none';});}
function checkVersion(){}
function sendAppMessage(){}
function onAppMessage(cb){window.addEventListener('storage',e=>{if(e.key!=='wdiy-app-msg'||!e.newValue)return;try{cb(JSON.parse(e.newValue));}catch{}});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix(){const canvas=$('matrixCanvas');if(!canvas)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);canvas.classList.remove('active');return;}matrixRunning=true;canvas.classList.add('active');const ctx=canvas.getContext('2d');canvas.width=window.innerWidth;canvas.height=window.innerHeight;const cols=Math.floor(canvas.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoClickCount=0,logoClickTimer=null;
function initMatrixTrigger(){const logo=$('logoWrap');if(!logo)return;logo.style.cursor='pointer';logo.addEventListener('click',()=>{logoClickCount++;if(logoClickTimer)clearTimeout(logoClickTimer);if(logoClickCount>=3){logoClickCount=0;toggleMatrix();}else logoClickTimer=setTimeout(()=>logoClickCount=0,500);});}
function initDebug(){if(!new URLSearchParams(window.location.search).has('debug'))return;const panel=$('debugPanel');if(panel)panel.classList.add('active');}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(name){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[name];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let breathingActive=false,dhikrCount=0;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initLogResize(){const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;let dragging=false,startX,startW;handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{dragging=false;});}
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
  if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none';};
  if(db)db.onclick=incrementDhikr;
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
   PACKET STORM SIMULATION
   ═══════════════════════════════════════════════════════════════ */

function revealChallenge(idx){const el=$('answer'+idx);if(el)el.classList.toggle('visible');playSound('click');}

const PROTO_COLORS={TCP:'#3498db',UDP:'#2ecc71',ICMP:'#f1c40f',ARP:'#e74c3c'};
const PROTO_LIST=['TCP','UDP','ICMP','ARP'];

let stormRunning=false;
let stormInterval=null;
let stormAnimId=null;
let particles=[];
let stats={TCP:0,UDP:0,ICMP:0,ARP:0,total:0,bytes:0};
let lastSecond=Date.now();
let ppsCounter=0;

function randIP(){return `${Math.floor(Math.random()*223)+1}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*254)+1}`;}
function randMAC(){return Array.from({length:6},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':');}
function randPort(){return Math.floor(Math.random()*65535)+1;}
function randByte(){return Math.floor(Math.random()*256).toString(16).padStart(2,'0');}

function generatePacket(proto){
  if(proto==='MIX')proto=PROTO_LIST[Math.floor(Math.random()*PROTO_LIST.length)];
  const srcIP=randIP(),dstIP=randIP();
  let header='',size=0;
  switch(proto){
    case'TCP':
      const srcPort=randPort(),dstPort=[80,443,8080,22,3306][Math.floor(Math.random()*5)];
      const flags=['SYN','ACK','SYN-ACK','FIN','PSH-ACK'][Math.floor(Math.random()*5)];
      const seq=Math.floor(Math.random()*0xFFFFFFFF);
      header=`TCP ${srcIP}:${srcPort} → ${dstIP}:${dstPort} [${flags}] Seq=${seq.toString(16)}`;
      size=20+Math.floor(Math.random()*1460);break;
    case'UDP':
      const sp=randPort(),dp=[53,67,123,5353,1900][Math.floor(Math.random()*5)];
      header=`UDP ${srcIP}:${sp} → ${dstIP}:${dp} Len=${Math.floor(Math.random()*512)}`;
      size=8+Math.floor(Math.random()*512);break;
    case'ICMP':
      const icmpType=[0,3,8,11][Math.floor(Math.random()*4)];
      const typeNames={0:'Echo Reply',3:'Dest Unreachable',8:'Echo Request',11:'Time Exceeded'};
      header=`ICMP ${srcIP} → ${dstIP} Type=${icmpType} (${typeNames[icmpType]}) TTL=${Math.floor(Math.random()*64)+1}`;
      size=28+Math.floor(Math.random()*64);break;
    case'ARP':
      const op=Math.random()>0.5?'Request':'Reply';
      header=`ARP ${op}: Who has ${dstIP}? Tell ${srcIP} (${randMAC()})`;
      size=28;break;
  }
  // Generate hex bytes
  const hexBytes=Array.from({length:Math.min(size,32)},()=>randByte()).join(' ');
  return{proto,header,hexBytes,size,color:PROTO_COLORS[proto]};
}

function spawnParticle(pkt){
  const canvas=$('stormCanvas');if(!canvas)return;
  particles.push({
    x:0,y:Math.random()*canvas.height,
    vx:2+Math.random()*4,vy:(Math.random()-0.5)*1.5,
    life:1,color:pkt.color,size:2+Math.random()*3,
    char:pkt.proto[0]
  });
}

function drawStorm(){
  const canvas=$('stormCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');
  canvas.width=canvas.offsetWidth||500;
  const W=canvas.width,H=canvas.height;

  ctx.fillStyle='rgba(0,0,0,0.12)';
  ctx.fillRect(0,0,W,H);

  // Grid lines
  ctx.strokeStyle='rgba(51,255,51,0.03)';
  ctx.lineWidth=1;
  for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx;p.y+=p.vy;p.life-=0.008;
    if(p.life<=0||p.x>W+20){particles.splice(i,1);continue;}
    ctx.globalAlpha=p.life;
    ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fillStyle=p.color;ctx.fill();
    // Trail
    ctx.beginPath();ctx.moveTo(p.x-p.vx*5,p.y);ctx.lineTo(p.x,p.y);
    ctx.strokeStyle=p.color;ctx.lineWidth=1;ctx.stroke();
    // Letter
    ctx.font='8px Orbitron,monospace';ctx.fillStyle='#fff';ctx.textAlign='center';
    ctx.fillText(p.char,p.x,p.y+3);
  }
  ctx.globalAlpha=1;

  stormAnimId=requestAnimationFrame(drawStorm);
}

function updateStats(){
  const now=Date.now();
  if(now-lastSecond>=1000){
    $('ppsRate').textContent=ppsCounter;
    ppsCounter=0;lastSecond=now;
  }
  $('totalPkts').textContent=stats.total;
  $('totalBytes').textContent=stats.bytes>1024?(stats.bytes/1024).toFixed(1)+'K':stats.bytes;
  $('tcpCount').textContent=stats.TCP;
  $('udpCount').textContent=stats.UDP;
  $('icmpCount').textContent=stats.ICMP;
  $('arpCount').textContent=stats.ARP;

  // Protocol bar
  const bar=$('protocolBar');
  if(bar&&stats.total>0){
    bar.innerHTML='';
    for(const p of PROTO_LIST){
      const pct=(stats[p]/stats.total*100);
      if(pct>0){
        const div=document.createElement('div');
        div.style.width=pct+'%';div.style.background=PROTO_COLORS[p];
        div.textContent=pct>8?`${p} ${pct.toFixed(0)}%`:'';
        bar.appendChild(div);
      }
    }
  }
}

function startStorm(){
  if(stormRunning)return;
  stormRunning=true;
  const s=LANG[currentLang];
  setStatus(true);
  log(s.stormStarted,'success');

  const rate=parseInt(($('rateSlider')||{}).value||30);
  const proto=($('protoSelect')||{}).value||'TCP';
  const interval=Math.max(10,1000/rate);

  stormInterval=setInterval(()=>{
    const pkt=generatePacket(proto);
    stats[pkt.proto]++;stats.total++;stats.bytes+=pkt.size;
    ppsCounter++;
    spawnParticle(pkt);
    // Update hex inspector with latest packet
    const hex=$('hexInspector');
    if(hex){
      const line=`${pkt.header}\n${pkt.hexBytes}\n`;
      hex.textContent=line+hex.textContent.slice(0,800);
    }
    updateStats();
  },interval);

  drawStorm();
}

function stopStorm(){
  if(!stormRunning)return;
  stormRunning=false;
  if(stormInterval){clearInterval(stormInterval);stormInterval=null;}
  if(stormAnimId){cancelAnimationFrame(stormAnimId);stormAnimId=null;}
  setStatus(false);
  log(LANG[currentLang].stormStopped,'info');
}

function initPacketStorm(){
  if($('startBtn'))$('startBtn').addEventListener('click',startStorm);
  if($('stopBtn'))$('stopBtn').addEventListener('click',stopStorm);

  const rateSlider=$('rateSlider'),rateLabel=$('rateLabel');
  if(rateSlider&&rateLabel){
    rateSlider.addEventListener('input',()=>{
      rateLabel.textContent=rateSlider.value+' pps';
      if(stormRunning){stopStorm();startStorm();}
    });
  }
}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initPacketStorm);}else{setTimeout(initPacketStorm,50);}

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Packet Storm: Cyberpunk traffic generator
   with matrix-style packet rain and protocol visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';let canvas,ctx,animId,W,H,frameCount=0,totalPkts=0,pps=0,ppsCtr=0,lastPps=0;
  const packets=[],bursts=[],hexCols=[];
  const PROTOS=[{name:'TCP',color:'#ff4444'},{name:'UDP',color:'#4d96ff'},{name:'ICMP',color:'#ffd93d'},{name:'ARP',color:'#6bcb77'},{name:'DNS',color:'#ff78ae'},{name:'HTTP',color:'#e879f9'}];

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#0a0612;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  class Packet{
    constructor(){
      this.proto=PROTOS[Math.floor(Math.random()*PROTOS.length)];this.x=Math.random()*W;this.y=-20;
      this.vy=1.5+Math.random()*3;this.vx=(Math.random()-0.5)*0.5;this.size=6+Math.random()*10;
      this.rotation=Math.random()*Math.PI;this.rotSpeed=(Math.random()-0.5)*0.08;this.alpha=1;
    }
    update(){this.y+=this.vy;this.x+=this.vx;this.rotation+=this.rotSpeed;if(this.y>H-30)this.alpha-=0.05;return this.alpha>0&&this.y<H+40;}
    draw(){
      ctx.save();ctx.globalAlpha=this.alpha;ctx.translate(this.x,this.y);ctx.rotate(this.rotation);
      ctx.fillStyle=this.proto.color+'33';ctx.fillRect(-this.size/2,-this.size/2,this.size,this.size);
      ctx.strokeStyle=this.proto.color;ctx.lineWidth=1;ctx.strokeRect(-this.size/2,-this.size/2,this.size,this.size);ctx.restore();
      ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.x-this.vx*8,this.y-this.vy*6);ctx.strokeStyle=this.proto.color+'44';ctx.lineWidth=1;ctx.stroke();
      ctx.font='7px monospace';ctx.fillStyle=this.proto.color+'aa';ctx.textAlign='center';ctx.fillText(this.proto.name,this.x,this.y+this.size+6);
    }
  }

  class Burst{
    constructor(x,y,c){this.x=x;this.y=y;this.color=c;this.parts=[];
      for(let i=0;i<8;i++){const a=Math.PI*2/8*i;this.parts.push({x:0,y:0,vx:Math.cos(a)*2,vy:Math.sin(a)*2,life:1});}
    }
    update(){this.parts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vx*=0.95;p.vy*=0.95;p.life-=0.04;});return this.parts.some(p=>p.life>0);}
    draw(){this.parts.forEach(p=>{if(p.life<=0)return;ctx.beginPath();ctx.arc(this.x+p.x,this.y+p.y,2,0,Math.PI*2);ctx.fillStyle=this.color+Math.floor(p.life*255).toString(16).padStart(2,'0');ctx.fill();});}
  }

  function initHexBg(){
    const c=Math.floor(W/20);for(let i=0;i<c;i++)hexCols.push({x:i*20,y:Math.random()*H,speed:0.3+Math.random(),chars:Array.from({length:12},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0'))});
  }
  function drawHexBg(){
    ctx.font='9px monospace';ctx.textAlign='left';
    hexCols.forEach(col=>{col.y+=col.speed;if(col.y>H+150)col.y=-150;col.chars.forEach((ch,i)=>{ctx.fillStyle='rgba(128,0,255,'+(0.03+i*0.005)+')';ctx.fillText(ch,col.x,col.y+i*12);});if(Math.random()<0.03)col.chars[Math.floor(Math.random()*col.chars.length)]=Math.floor(Math.random()*256).toString(16).padStart(2,'0');});
  }

  function drawProtoBars(){
    const counts={};PROTOS.forEach(p=>counts[p.name]=0);packets.forEach(pk=>counts[pk.proto.name]++);
    const bW=Math.min(60,(W-40)/PROTOS.length-8),sX=(W-PROTOS.length*(bW+8))/2;
    PROTOS.forEach((p,i)=>{const bx=sX+i*(bW+8),bh=Math.min(40,counts[p.name]*3);
      ctx.fillStyle=p.color+'44';ctx.fillRect(bx,H-8-bh,bW,bh);ctx.strokeStyle=p.color;ctx.lineWidth=1;ctx.strokeRect(bx,H-8-bh,bW,bh);
      ctx.fillStyle=p.color;ctx.font='8px monospace';ctx.textAlign='center';ctx.fillText(p.name,bx+bW/2,H-2);});
  }

  function drawStormMeter(){
    const intensity=Math.min(1,packets.length/50);
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(W-170,8,162,60);ctx.strokeStyle='#f0f3';ctx.strokeRect(W-170,8,162,60);
    ctx.font='10px monospace';ctx.fillStyle='#e879f9';ctx.textAlign='left';ctx.fillText('STORM INTENSITY',W-162,24);
    ctx.fillStyle='#222';ctx.fillRect(W-162,30,146,10);
    const g=ctx.createLinearGradient(W-162,0,W-16,0);g.addColorStop(0,'#4d96ff');g.addColorStop(0.5,'#ffd93d');g.addColorStop(1,'#ff4444');
    ctx.fillStyle=g;ctx.fillRect(W-162,30,146*intensity,10);
    ctx.fillStyle='#aaa';ctx.fillText('Packets: '+totalPkts+'  PPS: '+pps,W-162,56);ctx.restore();
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(8,8,160,44);ctx.strokeStyle='#f0f3';ctx.strokeRect(8,8,160,44);
    ctx.font='10px monospace';ctx.fillStyle='#e879f9';ctx.textAlign='left';ctx.fillText('PACKET STORM',16,24);
    ctx.fillStyle='#aaa';ctx.fillText('Active: '+packets.length+'  Frame: '+frameCount,16,42);ctx.restore();
  }

  function init(){ensureCanvas();initHexBg();lastPps=performance.now();animate();}
  function animate(){
    frameCount++;ctx.fillStyle='rgba(10,6,18,0.14)';ctx.fillRect(0,0,W,H);drawHexBg();
    const sr=2+Math.sin(frameCount*0.01)*2;for(let i=0;i<sr;i++){packets.push(new Packet());totalPkts++;ppsCtr++;}
    const now=performance.now();if(now-lastPps>=1000){pps=ppsCtr;ppsCtr=0;lastPps=now;}
    for(let i=packets.length-1;i>=0;i--){if(!packets[i].update()){if(packets[i].y>=H-50)bursts.push(new Burst(packets[i].x,H-20,packets[i].proto.color));packets.splice(i,1);}else packets[i].draw();}
    for(let i=bursts.length-1;i>=0;i--){if(!bursts[i].update())bursts.splice(i,1);else bursts[i].draw();}
    drawProtoBars();drawStormMeter();drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,200);
})();


// ── Code Tab Switching ──
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('code-tab')) {
    var tabs = e.target.parentElement;
    tabs.querySelectorAll('.code-tab').forEach(function(t) { t.classList.remove('active'); });
    e.target.classList.add('active');
    var target = e.target.getAttribute('data-codetarget');
    var card = tabs.closest('.card');
    card.querySelectorAll('.code-display').forEach(function(d) { d.classList.add('hidden'); });
    var show = card.querySelector('#code-' + target);
    if (show) show.classList.remove('hidden');
  }
});

var DEMO_STEPS = [
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬', target:'#helpBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary action button to start. Watch the visualization respond in real time! ⚡', target:'#settingsBtn', delay:3000},
  {i18n:'demo_s3', text:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄', target:'#logBtn', delay:3000},
  {i18n:'demo_s4', text:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊', target:'#simCanvas', delay:3000},
  {i18n:'demo_s5', text:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!', target:'#mainCard', delay:3000},
];

// ── Demo Engine ──
var _demoStep = 0, _demoPlaying = false, _demoTimer = null;
var _demoSteps = (typeof DEMO_STEPS !== 'undefined') ? DEMO_STEPS : [];

function demoNav(dir) {
  _demoStep = Math.max(0, Math.min(_demoSteps.length - 1, _demoStep + dir));
  demoShow();
}

function demoToggle() {
  _demoPlaying = !_demoPlaying;
  var btn = document.getElementById('demoPlayBtn');
  if (btn) btn.innerHTML = _demoPlaying ? '⏸ <span data-i18n="demoPause">Pause</span>' : '▶ <span data-i18n="demoPlay">Play</span>';
  if (_demoPlaying) {
    demoShow();
    _demoTimer = setInterval(function() {
      if (_demoStep < _demoSteps.length - 1) { _demoStep++; demoShow(); }
      else { _demoPlaying = false; clearInterval(_demoTimer); var b = document.getElementById('demoPlayBtn'); if(b) b.innerHTML = '▶ <span data-i18n="demoPlay">Play</span>'; }
    }, 3000);
  } else {
    clearInterval(_demoTimer);
  }
}

function demoShow() {
  var step = _demoSteps[_demoStep];
  if (!step) return;
  var numEl = document.getElementById('demoCurrentStep');
  var narEl = document.getElementById('demoNarration');
  var barEl = document.getElementById('demoProgressBar');
  if (numEl) numEl.textContent = (_demoStep + 1) + '/' + _demoSteps.length;
  if (narEl) { narEl.setAttribute('data-i18n', step.i18n); narEl.textContent = step.text; if (typeof applyLang === 'function') applyLang(); }
  if (barEl) barEl.style.width = ((_demoStep + 1) / _demoSteps.length * 100) + '%';
  // Remove old highlights
  document.querySelectorAll('.demo-highlight').forEach(function(el) { el.classList.remove('demo-highlight'); });
  // Add highlight
  if (step.target) { var t = document.querySelector(step.target); if (t) { t.classList.add('demo-highlight'); t.scrollIntoView({behavior:'smooth', block:'center'}); } }
}

// Service Worker Registration (skip on file://)
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(function(){});
}
