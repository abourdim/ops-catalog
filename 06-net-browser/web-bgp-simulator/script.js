/**
 * Workshop DIY — BGP Simulator v1.2
 * Route Hijacking — Run autonomous systems, inject bad routes, hijack traffic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.42,152.87C187.48,152.74,187.66,152.63,187.82,152.63C188.09,152.63,190.48,151.54,191.62,150.9L194.17,149.21C197.43,146.97,199.24,146.24,202.59,145.78C203.8,145.62,204.63,145.62,205.93,145.78C212.62,146.63,217.42,150.72,219.33,157.2C219.72,158.55,219.77,162.69,219.41,163.88C218.19,167.86,216.58,170.3,213.79,172.41C209.46,175.7,203.83,176.56,198.81,174.72C197.24,174.15,196.14,173.54,194.48,172.35C191.91,170.51,190.53,169.74,188.03,168.75L187.29,168.46L187.31,160.79C187.32,156.56,187.37,153,187.42,152.87z"/><path style="stroke:none;fill:currentColor" d="M259.79,157.67L264.88,148.03L272.34,148.03L263.03,163.73L263.03,174.99L256.26,174.99L256.26,164.07L246.79,148.03L254.51,148.03z"/><path style="stroke:none;fill:currentColor" d="M240.37,152.74L236.5,152.74L236.5,170.28L240.37,170.28L240.37,174.99L225.85,174.99L225.85,170.28L229.72,170.28L229.72,152.74L225.85,152.74L225.85,148.03L240.37,148.03z"/><path style="stroke:none;fill:currentColor" d="M330.79,195.73L203.96,195.73L203.96,199.33L330.79,199.33z"/><path style="stroke:none;fill:currentColor" d="M330.79,203.35L161.69,203.35L161.69,206.96L330.79,206.96z"/><path style="stroke:none;fill:currentColor" d="M330.79,210.97L77.14,210.97L77.14,214.58L330.79,214.58z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH6gMKAjgH2Wn1xgAAAAxJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAvBm8AAAB8IkWQwAAAABJRU5ErkJggg==';
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;switch(type){case'click':osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);break;case'success':osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);break;case'error':osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);break;}}
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
    ...LANG_BASE.en,title:'BGP Simulator',subtitle:'Run autonomous systems, inject bad routes, hijack traffic',disconnected:'Disconnected',connected:'Connected',mainSection:'AS Topology',mainDesc:'BGP route hijacking simulation',sectionA:'BGP Protocol Reference',sectionB:'BGP Security',sectionC:'Attack Analysis',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'View the AS topology.',howto_2:'Click Inject Bad Route.',howto_3:'Click Send Traffic.',howto_4:'Analyze attack in Section C.',wiki_themes_title:'Themes',wiki_themes:'8 built-in themes.',wiki_i18n_title:'Languages',wiki_i18n:'Trilingual.',wiki_log_title:'Activity Log',wiki_log:'Timestamped log.',wiki_privacy_title:'Privacy',wiki_privacy:'Local-first.',working:'Working...',ready:'BGP Simulator ready!',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',newVersion:'UPDATE',langChanged:'Language > English',themeChanged:'Theme >',injectBtn:'Inject Bad Route',resetBtn:'Reset Network',trafficBtn:'Send Traffic',analyzeBtn:'Analyze Attack',bgpRefText:'BGP exchanges routing info between Autonomous Systems. Each AS announces IP prefixes. Route hijacking occurs when an AS announces prefixes it does not own.',secText:'RPKI validates route announcements. BGPsec adds path validation. Route Origin Validation filters invalid prefixes.',analysisText:'Analyze the impact of route hijacking on network traffic.',injecting:'Injecting bad route...',injected:'Bad route injected! Traffic hijacked!',routeNormal:'Normal routing active',routeHijacked:'HIJACKED routing active',resetDone:'Network reset to normal',trafficSent:'Traffic sent',trafficHijacked:'Traffic redirected through attacker!',trafficNormal:'Traffic following normal path',analyzing:'Analyzing attack...',analysisDone:'Attack analysis complete',asLabel:'AS',prefix:'Prefix',path:'Path',nextHop:'Next Hop',status:'Status',legitimate:'Legitimate',malicious:'Malicious',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code',faq_q1:'What is BGP Simulator?',faq_a1:'BGP Simulator lets you bgp route hijacking simulation. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you the network is scanned to discover active devices and services. Then you network packets are intercepted and captured for analysis.',faq_q3:'What do the controls do?',faq_a3:'View the AS topology. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real networking principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Browser only. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Web Blockchain Messenger and Web Botnet Defense. Each app in this category teaches a different aspect of networking.',demo_s1:'Welcome to BGP Simulator! Look at the main display — this is where the networking simulation runs.',demo_s2:'View the AS topology. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "BGP Protocol Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of networking.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how networking works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches networking concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "BGP Protocol Reference" and "BGP Security" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Simulateur BGP',subtitle:'Gerez les systemes autonomes, injectez des routes, detournez le trafic',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Topologie AS',mainDesc:'Simulation de detournement BGP',sectionA:'Reference BGP',sectionB:'Securite BGP',sectionC:'Analyse d\'Attaque',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Voir la topologie AS.',howto_2:'Cliquer Injecter Route.',howto_3:'Envoyer du Trafic.',howto_4:'Analyser l\'attaque.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'Trilingue.',wiki_log_title:'Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Local-first.',working:'En cours...',ready:'Simulateur BGP pret!',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',soundEffects:'Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',newVersion:'MAJ',langChanged:'Langue > Francais',themeChanged:'Theme >',injectBtn:'Injecter Mauvaise Route',resetBtn:'Reinitialiser',trafficBtn:'Envoyer Trafic',analyzeBtn:'Analyser Attaque',bgpRefText:'BGP echange des infos de routage entre systemes autonomes. Le detournement se produit quand un AS annonce des prefixes qu\'il ne possede pas.',secText:'RPKI valide les annonces. BGPsec ajoute la validation de chemin.',analysisText:'Analyser l\'impact du detournement sur le trafic.',injecting:'Injection en cours...',injected:'Route injectee! Trafic detourne!',routeNormal:'Routage normal actif',routeHijacked:'Routage DETOURNE actif',resetDone:'Reseau reinitialise',trafficSent:'Trafic envoye',trafficHijacked:'Trafic redirige via l\'attaquant!',trafficNormal:'Trafic suivant le chemin normal',analyzing:'Analyse en cours...',analysisDone:'Analyse terminee',asLabel:'AS',prefix:'Prefixe',path:'Chemin',nextHop:'Prochain Saut',status:'Statut',legitimate:'Legitime',malicious:'Malveillant',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle te permet de voir comment les réseaux communiquent ! 🌐 Comme une vision aux rayons X du trafic internet.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Web Dns Odyssey and Web Botnet Defense ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',learnAge:'Âge :'},
  ar:{title:'محاكي BGP',subtitle:'ادر انظمة مستقلة واحقن مسارات سيئة واختطف حركة المرور',disconnected:'غير متصل',connected:'متصل',mainSection:'طوبولوجيا AS',mainDesc:'محاكاة اختطاف مسارات BGP',sectionA:'مرجع بروتوكول BGP',sectionB:'امان BGP',sectionC:'تحليل الهجوم',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'عرض طوبولوجيا AS.',howto_2:'انقر حقن مسار سيء.',howto_3:'ارسل حركة مرور.',howto_4:'حلل الهجوم.',wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'الخصوصية',wiki_privacy:'محلي اولا.',working:'جار...',ready:'محاكي BGP جاهز!',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',soundEffects:'مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',newVersion:'تحديث',langChanged:'اللغة > العربية',themeChanged:'المظهر >',injectBtn:'حقن مسار سيء',resetBtn:'اعادة ضبط',trafficBtn:'ارسال حركة مرور',analyzeBtn:'تحليل الهجوم',bgpRefText:'يتبادل BGP معلومات التوجيه بين الانظمة المستقلة. يحدث الاختطاف عندما يعلن AS عن بادئات لا يملكها.',secText:'RPKI يتحقق من الاعلانات. BGPsec يضيف التحقق من المسار.',analysisText:'تحليل تاثير اختطاف المسار على حركة المرور.',injecting:'جاري الحقن...',injected:'تم حقن المسار! تم اختطاف حركة المرور!',routeNormal:'التوجيه الطبيعي نشط',routeHijacked:'التوجيه المختطف نشط',resetDone:'تم اعادة ضبط الشبكة',trafficSent:'تم ارسال حركة المرور',trafficHijacked:'تم اعادة توجيه حركة المرور عبر المهاجم!',trafficNormal:'حركة المرور تتبع المسار الطبيعي',analyzing:'جاري التحليل...',analysisDone:'اكتمل تحليل الهجوم',asLabel:'AS',prefix:'البادئة',path:'المسار',nextHop:'القفزة التالية',status:'الحالة',legitimate:'شرعي',malicious:'خبيث',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يتيح لك رؤية كيف تتحدث الشبكات! 🌐 مثل رؤية بالأشعة السينية لحركة الإنترنت.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Web Dns Odyssey and Web Botnet Defense! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const ft=`[${new Date().toLocaleTimeString()}] ${msg}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success'){playSound('success');pulseBismillah('success');setPetState('happy');}else if(type==='error'){playSound('error');pulseBismillah('error');setPetState('sad');}logWithHistory(msg,type);applyLogFilter();resetPetSleep();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url);}
function checkVersion(){try{const s=localStorage.getItem('wdiy-latest-version');if(s&&s!==APP_VERSION){const b=$('settingsBtn');if(b&&!b.querySelector('.version-update')){const bg=document.createElement('span');bg.className='version-update';bg.textContent='UPDATE';b.style.position='relative';bg.style.cssText='position:absolute;top:-6px;inset-inline-end:-6px;';b.appendChild(bg);}}}catch{}}
const APP_MSG_KEY='wdiy-app-msg';function sendAppMessage(type,data){try{localStorage.setItem(APP_MSG_KEY,JSON.stringify({type,data,from:document.title,ts:Date.now()}));localStorage.removeItem(APP_MSG_KEY);}catch{}}function onAppMessage(cb){window.addEventListener('storage',e=>{if(e.key!==APP_MSG_KEY||!e.newValue)return;try{cb(JSON.parse(e.newValue));}catch{}});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('KONAMI!','success');}}else konamiIdx=0;});}
function pulseBismillah(type){const b=document.querySelector('.bismillah');if(!b)return;b.classList.remove('pulse-success','pulse-error');void b.offsetWidth;b.classList.add(type==='error'?'pulse-error':'pulse-success');setTimeout(()=>b.classList.remove('pulse-success','pulse-error'),700);}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function initMorseLog(){document.addEventListener('mousedown',e=>{const line=e.target.closest('.log-line');if(!line)return;});document.addEventListener('mouseup',()=>{});}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoClickCount=0,logoClickTimer=null;function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';l.addEventListener('click',()=>{logoClickCount++;if(logoClickTimer)clearTimeout(logoClickTimer);if(logoClickCount>=3){logoClickCount=0;toggleMatrix();}else logoClickTimer=setTimeout(()=>logoClickCount=0,500);});}
function initDebug(){if(!new URLSearchParams(window.location.search).has('debug'))return;const p=$('debugPanel');if(!p)return;p.classList.add('active');const f=$('debugFps'),m=$('debugMem');let frames=0,last=performance.now();function tick(){frames++;const now=performance.now();if(now-last>=1000){if(f)f.textContent=frames+' FPS';if(m&&performance.memory)m.textContent=(performance.memory.usedJSHeapSize/1048576).toFixed(1)+' MB';frames=0;last=now;}requestAnimationFrame(tick);}requestAnimationFrame(tick);}
function initShakeReport(){if(!window.DeviceMotionEvent)return;let last=0;window.addEventListener('devicemotion',e=>{const a=e.accelerationIncludingGravity;if(!a)return;if(Math.abs(a.x)+Math.abs(a.y)+Math.abs(a.z)>25&&Date.now()-last>2000){last=Date.now();generateBugReport();}});}
function generateBugReport(){if(!logContainer)logContainer=$('logContainer');const r={app:document.title,version:APP_VERSION,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,theme:document.documentElement.dataset.theme,lang:currentLang,log:(logContainer?Array.from(logContainer.children).map(d=>d.textContent):[]).slice(-50)};const blob=new Blob([JSON.stringify(r,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`bug-report-${Date.now()}.json`;a.click();URL.revokeObjectURL(url);}
const logHistory=[];function logWithHistory(msg,type){logHistory.push({msg,type,ts:Date.now()});}function initTimeTravel(){document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key==='z'){const p=$('logPanel');if(!p||!p.classList.contains('open'))return;e.preventDefault();if(!logContainer)logContainer=$('logContainer');if(logContainer&&logContainer.lastChild){logContainer.removeChild(logContainer.lastChild);logHistory.pop();playSound('click');}}});}
let typewriterEnabled=true;async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(12+Math.random()*18);}el.classList.remove('typing');}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let recognition=null,whisperActive=false;function toggleWhisper(){if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){log('Speech not supported','error');return;}if(whisperActive){if(recognition)recognition.stop();whisperActive=false;return;}const SR=window.SpeechRecognition||window.webkitSpeechRecognition;recognition=new SR();recognition.continuous=true;recognition.interimResults=false;recognition.lang=currentLang==='ar'?'ar-DZ':currentLang==='fr'?'fr-FR':'en-US';recognition.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal){const t=e.results[i][0].transcript.trim();if(t)log(t,'rx');}};recognition.onerror=e=>log(`Error: ${e.error}`,'error');recognition.onend=()=>{if(whisperActive)recognition.start();};recognition.start();whisperActive=true;}
function initGhostUsers(){const gc=document.createElement('canvas');gc.style.cssText='position:fixed;inset:0;z-index:9998;pointer-events:none;';document.body.appendChild(gc);const gctx=gc.getContext('2d');gc.width=innerWidth;gc.height=innerHeight;window.addEventListener('resize',()=>{gc.width=innerWidth;gc.height=innerHeight;});function draw(){gctx.clearRect(0,0,gc.width,gc.height);requestAnimationFrame(draw);}requestAnimationFrame(draw);}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};function playThemeMelody(name){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=THEME_MELODIES[name];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((freq,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=freq;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){const bands=document.querySelectorAll('.deco-band');breathingActive=!breathingActive;if(breathingActive)bands.forEach(b=>b.classList.add('breathing'));else{bands.forEach(b=>b.classList.remove('breathing'));dhikrCount=0;}}function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
const PET_STATES={idle:{class:'pet-idle',duration:0},happy:{class:'pet-happy',duration:3000},sad:{class:'pet-sad',duration:3000},sleep:{class:'pet-sleep',duration:0}};let petState='idle',petIdleTimer=null,petSleepTimer=null;function initPixelPet(){const pet=document.createElement('div');pet.id='pixelPet';pet.className='pixel-pet pet-idle';pet.innerHTML=`<img src="${FOOTER_ICON}" alt="Bot"/>`;pet.addEventListener('click',()=>{setPetState('happy');playSound('success');});const f=document.querySelector('.app-footer');if(f)f.insertBefore(pet,f.firstChild);}function setPetState(s){petState=s;const p=$('pixelPet');if(!p)return;p.classList.remove('pet-idle','pet-happy','pet-sad','pet-sleep');p.classList.add(PET_STATES[s].class);if(petIdleTimer)clearTimeout(petIdleTimer);if(PET_STATES[s].duration>0)petIdleTimer=setTimeout(()=>setPetState('idle'),PET_STATES[s].duration);}function resetPetSleep(){if(petSleepTimer)clearTimeout(petSleepTimer);if(petState==='sleep')setPetState('idle');petSleepTimer=setTimeout(()=>setPetState('sleep'),60000);}
function initLogoTracker(){const l=$('logoWrap');if(!l)return;document.addEventListener('mousemove',e=>{const r=l.getBoundingClientRect();const dx=(e.clientX-(r.left+r.width/2))/(innerWidth/2);const dy=(e.clientY-(r.top+r.height/2))/(innerHeight/2);l.style.transform=`perspective(200px) rotateX(${dy*8}deg) rotateY(${-dx*8}deg)`;});document.addEventListener('mouseleave',()=>{l.style.transition='transform .5s';l.style.transform='';setTimeout(()=>l.style.transition='',500);});}
let musicActive=false,musicAnim=null;function toggleMusicMode(){if(musicActive){musicActive=false;if(musicAnim)cancelAnimationFrame(musicAnim);document.querySelectorAll('.deco-band').forEach(b=>{b.style.height='';b.style.opacity='';});document.documentElement.style.filter='';return;}log('Music mode requires microphone','info');}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let dragging=false,startX,startW;h.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=p.offsetWidth;document.body.style.cursor='col-resize';document.body.style.userSelect='none';e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=(document.documentElement.dir==='rtl')?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;document.body.style.cursor='';document.body.style.userSelect='';});try{const saved=localStorage.getItem('wdiy-log-width');if(saved)document.documentElement.style.setProperty('--log-width',saved);}catch{}}
const FOCUSABLE='button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(rid);if(b)b.focus();}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const target=$(id);if(target)target.classList.add('active');});});}function trapFocus(e){for(const id of['helpPanel','settingsPanel','logPanel']){const sb=$(id);if(!sb||!sb.classList.contains('open'))continue;const focusable=sb.querySelectorAll(FOCUSABLE);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;}}

/* ══════════════════════════════════════════════════════════════
   APP-SPECIFIC: BGP SIMULATOR
   ══════════════════════════════════════════════════════════════ */
const AS_NODES=[
  {id:0,label:'AS 100',x:100,y:200,color:'#4fc3f7',prefix:'10.0.0.0/8',role:'origin'},
  {id:1,label:'AS 200',x:250,y:80,color:'#66bb6a',prefix:'172.16.0.0/12',role:'transit'},
  {id:2,label:'AS 300',x:400,y:80,color:'#ffa726',prefix:'192.168.0.0/16',role:'transit'},
  {id:3,label:'AS 400',x:550,y:200,color:'#ab47bc',prefix:'203.0.113.0/24',role:'destination'},
  {id:4,label:'AS 500',x:250,y:320,color:'#ef5350',prefix:'198.51.100.0/24',role:'attacker'},
  {id:5,label:'AS 600',x:400,y:320,color:'#78909c',prefix:'100.64.0.0/10',role:'transit'},
];
const AS_LINKS=[[0,1],[0,4],[1,2],[2,3],[4,5],[5,3],[1,5]];
let hijacked=false,bgpCanvas,bgpCtx,selectedAS=null,trafficAnim=null;

function drawBgpTopology(){
  if(!bgpCtx)return;const c=bgpCanvas,ctx=bgpCtx;
  ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#0a0e1a';ctx.fillRect(0,0,c.width,c.height);
  // Links
  AS_LINKS.forEach(([a,b])=>{
    ctx.beginPath();ctx.moveTo(AS_NODES[a].x,AS_NODES[a].y);ctx.lineTo(AS_NODES[b].x,AS_NODES[b].y);
    const isHijackPath=hijacked&&((a===4||b===4)||(a===5||b===5));
    ctx.strokeStyle=isHijackPath?'rgba(244,67,54,0.6)':'rgba(255,255,255,0.15)';ctx.lineWidth=isHijackPath?3:1;ctx.stroke();
  });
  // Nodes
  AS_NODES.forEach((node,i)=>{
    const isSelected=selectedAS===i;const isAttacker=node.role==='attacker';
    ctx.beginPath();ctx.arc(node.x,node.y,28,0,Math.PI*2);
    ctx.fillStyle=(isAttacker&&hijacked)?'rgba(244,67,54,0.3)':node.color+'25';ctx.fill();
    ctx.strokeStyle=isSelected?'#fff':node.color;ctx.lineWidth=isSelected?3:2;ctx.stroke();
    if(isAttacker&&hijacked){ctx.beginPath();ctx.arc(node.x,node.y,34,0,Math.PI*2);ctx.strokeStyle='#ef535080';ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);}
    ctx.fillStyle='#fff';ctx.font='bold 11px Orbitron,sans-serif';ctx.textAlign='center';ctx.fillText(node.label,node.x,node.y+4);
    ctx.font='9px monospace';ctx.fillStyle=node.color;ctx.fillText(node.prefix,node.x,node.y+44);
    const icons={origin:'\uD83C\uDFE2',transit:'\uD83D\uDD00',destination:'\uD83C\uDFAF',attacker:'\uD83D\uDC80'};
    ctx.font='14px sans-serif';ctx.fillText(icons[node.role]||'',node.x,node.y-18);
  });
}

function animateTraffic(pathIndices,color,duration=1500){
  return new Promise(resolve=>{
    const start=performance.now();const pts=pathIndices.map(i=>AS_NODES[i]);
    function frame(now){
      const t=Math.min((now-start)/duration,1);drawBgpTopology();
      const totalSegs=pts.length-1;const seg=Math.min(Math.floor(t*totalSegs),totalSegs-1);
      const segT=(t*totalSegs)-seg;
      if(seg<pts.length-1){
        const x=pts[seg].x+(pts[seg+1].x-pts[seg].x)*segT;
        const y=pts[seg].y+(pts[seg+1].y-pts[seg].y)*segT;
        bgpCtx.beginPath();bgpCtx.arc(x,y,8,0,Math.PI*2);bgpCtx.fillStyle=color;bgpCtx.fill();
        bgpCtx.beginPath();bgpCtx.arc(x,y,12,0,Math.PI*2);bgpCtx.strokeStyle=color+'80';bgpCtx.lineWidth=2;bgpCtx.stroke();
        // Trail
        for(let s=0;s<=seg;s++){bgpCtx.beginPath();bgpCtx.moveTo(pts[s].x,pts[s].y);bgpCtx.lineTo(s<seg?pts[s+1].x:x,s<seg?pts[s+1].y:y);bgpCtx.strokeStyle=color;bgpCtx.lineWidth=3;bgpCtx.stroke();}
      }
      if(t<1)requestAnimationFrame(frame);else resolve();
    }
    requestAnimationFrame(frame);
  });
}

async function injectBadRoute(){
  if(hijacked)return;const s=LANG[currentLang];
  showToast(s.injecting);log(s.injecting,'error');
  await sleep(800);
  hijacked=true;drawBgpTopology();
  hideToast();log(s.injected,'error');
  updateRouteTable();setStatus(true);
}

async function sendTraffic(){
  const s=LANG[currentLang];log(s.trafficSent,'tx');
  if(hijacked){
    await animateTraffic([0,4,5,3],'#ef5350',2000);
    log(s.trafficHijacked,'error');
  }else{
    await animateTraffic([0,1,2,3],'#4fc3f7',2000);
    log(s.trafficNormal,'success');
  }
  drawBgpTopology();
}

function resetNetwork(){
  const s=LANG[currentLang];hijacked=false;drawBgpTopology();updateRouteTable();
  log(s.resetDone,'success');
}

function updateRouteTable(){
  const el=$('routeTable');if(!el)return;el.style.display='block';const s=LANG[currentLang];
  let html=`<h3 style="margin:0 0 .5rem;">${s.asLabel} Route Tables</h3>`;
  const normalPath='AS100 > AS200 > AS300 > AS400';
  const hijackPath='AS100 > AS500 > AS600 > AS400';
  html+=`<div style="display:grid;gap:.5rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));">`;
  AS_NODES.forEach(node=>{
    const isAttacker=node.role==='attacker';
    const border=isAttacker&&hijacked?'#ef5350':node.color;
    html+=`<div style="background:var(--glass-bg,rgba(255,255,255,0.05));border:1px solid ${border}40;border-radius:8px;padding:.5rem;font-size:.75rem;">
      <strong style="color:${node.color};">${node.label}</strong>
      <div style="margin-top:.3rem;">${s.prefix}: ${node.prefix}</div>
      <div>${s.path}: ${hijacked&&isAttacker?hijackPath:normalPath}</div>
      <div>${s.status}: <span style="color:${isAttacker&&hijacked?'#ef5350':'#66bb6a'};">${isAttacker&&hijacked?s.malicious:s.legitimate}</span></div>
    </div>`;
  });
  html+='</div>';el.innerHTML=html;
}

async function analyzeAttack(){
  const s=LANG[currentLang];const el=$('analysisResults');if(!el)return;
  showToast(s.analyzing);log(s.analyzing,'tx');await sleep(1000);
  const affected=hijacked?4:0;const color=hijacked?'#ef5350':'#66bb6a';
  el.innerHTML=`<div style="background:var(--glass-bg,rgba(255,255,255,0.05));border:2px solid ${color}40;border-radius:12px;padding:1rem;">
    <h4 style="color:${color};margin:0 0 .5rem;">${hijacked?'ATTACK DETECTED':'Network Healthy'}</h4>
    <div style="font-size:.85rem;line-height:1.8;">
      <div>Status: <strong style="color:${color};">${hijacked?s.routeHijacked:s.routeNormal}</strong></div>
      <div>Affected ASes: <strong>${affected}</strong></div>
      <div>Attacker: <strong>${hijacked?'AS 500 (198.51.100.0/24)':'None'}</strong></div>
      <div>Hijacked prefix: <strong>${hijacked?'203.0.113.0/24 (AS 400)':'None'}</strong></div>
      <div>Normal path: AS100 > AS200 > AS300 > AS400</div>
      ${hijacked?'<div style="color:#ef5350;">Hijacked path: AS100 > AS500 > AS600 > AS400</div>':''}
      <div style="margin-top:.5rem;padding:.5rem;background:rgba(255,255,255,0.03);border-radius:4px;">${hijacked?'Recommendation: Deploy RPKI and ROV filters to prevent route hijacking.':'All routes are validated. No anomalies detected.'}</div>
    </div>
  </div>`;
  el.style.display='block';hideToast();log(s.analysisDone,'success');
}

function initBgpSimulator(){
  bgpCanvas=$('bgpCanvas');if(bgpCanvas){bgpCtx=bgpCanvas.getContext('2d');drawBgpTopology();
    bgpCanvas.addEventListener('click',e=>{const rect=bgpCanvas.getBoundingClientRect();const mx=(e.clientX-rect.left)*(bgpCanvas.width/rect.width);const my=(e.clientY-rect.top)*(bgpCanvas.height/rect.height);
      selectedAS=null;AS_NODES.forEach((node,i)=>{const dx=mx-node.x,dy=my-node.y;if(Math.sqrt(dx*dx+dy*dy)<30)selectedAS=i;});drawBgpTopology();if(selectedAS!==null)log(`Selected ${AS_NODES[selectedAS].label}`,'info');});
  }
  const ib=$('injectBtn');if(ib)ib.addEventListener('click',injectBadRoute);
  const rb=$('resetBtn');if(rb)rb.addEventListener('click',resetNetwork);
  const tb=$('trafficBtn');if(tb)tb.addEventListener('click',sendTraffic);
  const ab=$('analyzeBtn');if(ab)ab.addEventListener('click',analyzeAttack);
  updateRouteTable();
}

const styleTag=document.createElement('style');styleTag.textContent=`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`;document.head.appendChild(styleTag);

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;initLogResize();
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  const whisperBtn=$('whisperBtn');if(whisperBtn)whisperBtn.onclick=toggleWhisper;
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  const musicBtn=$('musicBtn');if(musicBtn)musicBtn.onclick=toggleMusicMode;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();if(e.key==='Tab')trapFocus(e);});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sL=localStorage.getItem('wdiy-lang'),sT=localStorage.getItem('wdiy-theme');if(sT)setTheme(sT);if(sL)setLanguage(sL);}catch{}
  checkVersion();onAppMessage(msg=>log(`${msg.from}: ${msg.type}`,'rx'));
  initKonami();initMorseLog();initMatrixTrigger();initDebug();initShakeReport();initTimeTravel();initHijriDate();initGhostUsers();initPixelPet();initLogoTracker();
  initBgpSimulator();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: BGP Convergence Timeline & Route Table Visualizer ═══════ */
(function(){
let bgCanvas,bgCtx;const routeEvents=[];const bgpParticles=[];let convergenceTime=0;
function createBG(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">BGP Route Propagation Visualizer</div>';
  const c=document.createElement('canvas');c.width=650;c.height=280;
  c.style.cssText='width:100%;height:auto;display:block;background:#0a0e1a;cursor:crosshair;';
  w.appendChild(c);t.appendChild(w);return c;
}
function drawBG(){
  if(!bgCtx)return;const w=bgCanvas.width,h=bgCanvas.height;
  bgCtx.fillStyle='rgba(10,14,26,0.08)';bgCtx.fillRect(0,0,w,h);
  bgCtx.strokeStyle='rgba(255,255,255,0.03)';bgCtx.lineWidth=0.5;
  for(let x=0;x<w;x+=20){bgCtx.beginPath();bgCtx.moveTo(x,0);bgCtx.lineTo(x,h);bgCtx.stroke();}
  for(let y=0;y<h;y+=20){bgCtx.beginPath();bgCtx.moveTo(0,y);bgCtx.lineTo(w,y);bgCtx.stroke();}
  // Route event timeline
  const tH=80,tY=h-tH-10;
  bgCtx.strokeStyle='rgba(255,255,255,0.1)';bgCtx.lineWidth=1;
  bgCtx.beginPath();bgCtx.moveTo(30,tY+tH/2);bgCtx.lineTo(w-30,tY+tH/2);bgCtx.stroke();
  routeEvents.forEach((ev,i)=>{
    const x=30+(w-60)*(i/Math.max(routeEvents.length-1,1));
    const y=tY+tH/2;
    bgCtx.beginPath();bgCtx.arc(x,y,5,0,Math.PI*2);
    bgCtx.fillStyle=ev.type==='hijack'?'#ef5350':ev.type==='update'?'#ffa726':'#66bb6a';
    bgCtx.fill();bgCtx.fillStyle='rgba(255,255,255,0.5)';bgCtx.font='7px monospace';
    bgCtx.textAlign='center';bgCtx.fillText(ev.label,x,y-10);
    bgCtx.fillText(ev.time,x,y+16);
  });
  // AS mini-map (top portion)
  const asScale=0.35,offX=60,offY=10;
  AS_NODES.forEach((n,i)=>{
    const ax=n.x*asScale+offX,ay=n.y*asScale+offY;
    bgCtx.beginPath();bgCtx.arc(ax,ay,12,0,Math.PI*2);
    const isHijack=hijacked&&n.role==='attacker';
    bgCtx.fillStyle=isHijack?'rgba(244,67,54,0.3)':n.color+'25';bgCtx.fill();
    bgCtx.strokeStyle=n.color;bgCtx.lineWidth=1.5;bgCtx.stroke();
    bgCtx.fillStyle='#fff';bgCtx.font='7px Orbitron,sans-serif';bgCtx.textAlign='center';
    bgCtx.fillText(n.label,ax,ay+3);
  });
  AS_LINKS.forEach(([a,b])=>{
    const na=AS_NODES[a],nb=AS_NODES[b];
    bgCtx.beginPath();bgCtx.moveTo(na.x*asScale+offX,na.y*asScale+offY);
    bgCtx.lineTo(nb.x*asScale+offX,nb.y*asScale+offY);
    bgCtx.strokeStyle='rgba(255,255,255,0.1)';bgCtx.lineWidth=0.8;bgCtx.stroke();
  });
  // Route propagation particles
  for(let i=bgpParticles.length-1;i>=0;i--){
    const p=bgpParticles[i];p.t+=0.02;p.x+=(p.tx-p.x)*0.05;p.y+=(p.ty-p.y)*0.05;
    if(p.t>1){bgpParticles.splice(i,1);continue;}
    bgCtx.globalAlpha=1-p.t;bgCtx.beginPath();bgCtx.arc(p.x*asScale+offX,p.y*asScale+offY,4,0,Math.PI*2);
    bgCtx.fillStyle=p.color;bgCtx.fill();bgCtx.globalAlpha=1;
  }
  // Stats
  bgCtx.fillStyle='rgba(255,255,255,0.3)';bgCtx.font='8px monospace';bgCtx.textAlign='right';
  bgCtx.fillText('ASes: '+AS_NODES.length+' | Links: '+AS_LINKS.length+' | Hijacked: '+(hijacked?'YES':'NO'),w-10,18);
  convergenceTime+=0.016;
  bgCtx.fillText('Convergence: '+convergenceTime.toFixed(1)+'s',w-10,30);
  requestAnimationFrame(drawBG);
}
function initBG(){bgCanvas=createBG();if(!bgCtx){bgCtx=bgCanvas.getContext('2d');}
  // Generate initial route events
  ['Peer UP','Route Announce','Path Update','Convergence'].forEach((l,i)=>{
    routeEvents.push({label:l,type:'normal',time:(i*2)+'s'});
  });
  setInterval(()=>{
    if(hijacked&&Math.random()>0.5){
      routeEvents.push({label:'Bad Route',type:'hijack',time:convergenceTime.toFixed(0)+'s'});
      if(routeEvents.length>15)routeEvents.shift();
      const src=AS_NODES[4],dst=AS_NODES[Math.floor(Math.random()*4)];
      bgpParticles.push({x:src.x,y:src.y,tx:dst.x,ty:dst.y,t:0,color:'#ef5350'});
    }else if(Math.random()>0.7){
      const src=AS_NODES[Math.floor(Math.random()*4)],dst=AS_NODES[Math.floor(Math.random()*4)];
      bgpParticles.push({x:src.x,y:src.y,tx:dst.x,ty:dst.y,t:0,color:'#66bb6a'});
    }
  },1000);
  bgCanvas.addEventListener('click',()=>{
    routeEvents.push({label:hijacked?'Hijack Detected':'Update',type:hijacked?'hijack':'update',time:convergenceTime.toFixed(0)+'s'});
    if(routeEvents.length>15)routeEvents.shift();
  });
  drawBG();}
setTimeout(initBG,2000);
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
