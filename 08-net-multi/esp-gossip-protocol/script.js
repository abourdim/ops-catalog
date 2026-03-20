/**
 * Workshop DIY — Gossip Protocol v1.0
 * Epidemic data spreading simulation
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7h-126.8v3.6h126.8zM330.8,203.4h-169.1v3.6h169.1zM330.8,211h-253.7v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.08);o.start(c);o.stop(c+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.3);o.start(c);o.stop(c+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+0.25);o.start(c);o.stop(c+0.25);}}

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
title:'Gossip Protocol',subtitle:'💬 gossip · 🦠 epidemic · 📊 convergence',
disconnected:'Disconnected',connected:'Connected',
mainSection:'Gossip Protocol — Epidemic Spread',mainDesc:'Data spreads like infection through the network',
sectionA:'How It Works',sectionB:'Lab',sectionC:'Challenge',
activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
howto_1:'Click a node or press Seed Node to start the gossip.',
howto_2:'Watch as infected nodes spread data to neighbors each round.',
howto_3:'Adjust the spread probability slider to control infection chance.',
howto_4:'Monitor the stats: round count, infected nodes, and convergence.',
wiki_gossip_title:'💬 Gossip Protocols',wiki_gossip:'Gossip (epidemic) protocols achieve eventual consistency by random peer-to-peer information exchange.',
wiki_epidemic_title:'🦠 Epidemic Models',wiki_epidemic:'SI model: once infected, a node stays infected and keeps spreading. SIR adds recovery.',
wiki_convergence_title:'📊 Convergence',wiki_convergence:'Gossip converges in O(log N) rounds for N nodes, making it very efficient.',
wiki_apps_title:'🔧 Applications',wiki_apps:'Used in Cassandra, DynamoDB, Bitcoin network, and Kubernetes cluster management.',
working:'Working…',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
ready:'💬 Gossip Protocol ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
soundEffects:'🔊 Sound effects',breathingGuide:'Breathing guide',dhikrTap:'Tap',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
nodesLabel:'Nodes:',probLabel:'Spread %:',seedBtn:'Seed Node',resetBtn:'Reset',
statRound:'Round',statInfected:'Infected',statTotal:'Total',statConverged:'Converged',
step1:'One node is "seeded" with data (infected). It knows information that others do not.',
step2:'Each round, every infected node randomly picks a neighbor and shares the data.',
step3:'The neighbor becomes infected with a probability based on the spread percentage.',
step4:'After enough rounds, all nodes converge — everyone has the data.',
labTip1:'Click any node on the canvas to seed it with data.',
labTip2:'Adjust the spread probability to see how it affects convergence speed.',
labTip3:'Try with few nodes (6) vs many (25) to compare behavior.',
labTip4:'Watch the timeline bar fill up as more nodes get infected.',
challenge1:'Achieve 100% convergence in the fewest rounds. What probability is needed?',
challenge2:'Set spread to 10% and observe rounds vs 90%.',
challenge3:'With 25 nodes, predict rounds to convergence at 50%.',
seeded:'Node {id} seeded with data',roundN:'Round {n}',spread:'→ gossips to',infected:'infected!',alreadyHas:'already has data',converged:'All nodes converged!',yes:'Yes',no:'No',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It lets you see how computer networks talk to each other! 🌐 Like X-ray vision for internet traffic.',faq_q2:'How does it work?',faq_a2:'The simulation shows real network protocols — the rules that computers follow to send data across the internet.',faq_q3:'What should I try first?',faq_a3:'Start a scan and watch the packets fly! 📡 Each colored packet is a different type of network message.',faq_q4:'What\'s the real science?',faq_a4:'This is how the entire internet works! TCP/IP, DNS, ARP — these protocols power every website you visit. 🌍',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! See what happens when you inject bad packets or flood the network. That\'s network security! 🛡️',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Totally safe! 🛡️ This is a simulation — no real network traffic. Everything stays in your browser.',faq_q8:'What should I try next?',faq_a8:'Try Esp Cyber Range and Esp Swarm Net! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',learnAge:'Ages:'},
fr:{
title:'Protocole Gossip',subtitle:'💬 rumeur · 🦠 épidémie · 📊 convergence',
disconnected:'Déconnecté',connected:'Connecté',
mainSection:'Protocole Gossip — Propagation Épidémique',mainDesc:'Les données se propagent comme une infection à travers le réseau',
sectionA:'Comment ça marche',sectionB:'Labo',sectionC:'Défi',
activityLog:'Journal',eventsMsg:'Événements',clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
settings:'⚙️ Paramètres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
howto_1:'Cliquez sur un nœud ou appuyez sur Semer pour démarrer.',howto_2:'Regardez les nœuds infectés propager les données.',
howto_3:'Ajustez la probabilité de propagation.',howto_4:'Suivez les statistiques et la convergence.',
wiki_gossip_title:'💬 Protocoles Gossip',wiki_gossip:'Les protocoles gossip atteignent la cohérence éventuelle par échange aléatoire pair-à-pair.',
wiki_epidemic_title:'🦠 Modèles Épidémiques',wiki_epidemic:'Modèle SI : une fois infecté, un nœud reste infecté et continue de propager.',
wiki_convergence_title:'📊 Convergence',wiki_convergence:'Le gossip converge en O(log N) tours pour N nœuds.',
wiki_apps_title:'🔧 Applications',wiki_apps:'Utilisé dans Cassandra, DynamoDB, Bitcoin et Kubernetes.',
working:'En cours…',
t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
ready:'💬 Protocole Gossip prêt !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
soundEffects:'🔊 Effets sonores',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',
nodesLabel:'Nœuds :',probLabel:'Propagation % :',seedBtn:'Semer',resetBtn:'Réinitialiser',
statRound:'Tour',statInfected:'Infectés',statTotal:'Total',statConverged:'Convergé',
step1:'Un nœud est "semé" avec des données (infecté).',step2:'Chaque tour, les nœuds infectés partagent avec un voisin aléatoire.',
step3:'Le voisin est infecté selon la probabilité de propagation.',step4:'Après assez de tours, tous convergent.',
labTip1:'Cliquez sur un nœud pour le semer.',labTip2:'Ajustez la probabilité pour voir l\'effet.',
labTip3:'Comparez 6 nœuds vs 25.',labTip4:'Regardez la barre de progression.',
challenge1:'Convergence 100% en minimum de tours. Quelle probabilité ?',
challenge2:'10% de propagation vs 90% : combien de tours ?',
challenge3:'25 nœuds à 50% : prédisez les tours.',
seeded:'Nœud {id} semé',roundN:'Tour {n}',spread:'→ parle à',infected:'infecté !',alreadyHas:'a déjà les données',converged:'Tous les nœuds ont convergé !',yes:'Oui',no:'Non',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle te permet de voir comment les réseaux communiquent ! 🌐 Comme une vision aux rayons X du trafic internet.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Esp Cyber Range and Esp Swarm Net ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',learnAge:'Âge :'},
ar:{
title:'بروتوكول الثرثرة',subtitle:'💬 ثرثرة · 🦠 وبائي · 📊 تقارب',
disconnected:'غير متصل',connected:'متصل',
mainSection:'بروتوكول الثرثرة — انتشار وبائي',mainDesc:'البيانات تنتشر كالعدوى عبر الشبكة',
sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',
activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
howto_1:'انقر على عقدة أو اضغط بذر لبدء الثرثرة.',howto_2:'شاهد العقد المصابة تنشر البيانات.',
howto_3:'اضبط احتمال الانتشار.',howto_4:'تابع الإحصائيات والتقارب.',
wiki_gossip_title:'💬 بروتوكولات الثرثرة',wiki_gossip:'تحقق بروتوكولات الثرثرة الاتساق النهائي عبر تبادل عشوائي.',
wiki_epidemic_title:'🦠 النماذج الوبائية',wiki_epidemic:'نموذج SI: العقدة المصابة تبقى مصابة وتستمر بالنشر.',
wiki_convergence_title:'📊 التقارب',wiki_convergence:'الثرثرة تتقارب في O(log N) جولة لـ N عقدة.',
wiki_apps_title:'🔧 التطبيقات',wiki_apps:'يُستخدم في Cassandra وDynamoDB وبيتكوين وKubernetes.',
working:'جارٍ…',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
ready:'💬 بروتوكول الثرثرة جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
soundEffects:'🔊 مؤثرات صوتية',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
nodesLabel:'العقد:',probLabel:'نسبة الانتشار:',seedBtn:'بذر عقدة',resetBtn:'إعادة',
statRound:'الجولة',statInfected:'مصابة',statTotal:'المجموع',statConverged:'متقاربة',
step1:'عقدة واحدة تُبذر بالبيانات (مصابة).',step2:'كل جولة، كل عقدة مصابة تختار جارًا عشوائيًا وتشارك البيانات.',
step3:'الجار يُصاب بنسبة احتمال معينة.',step4:'بعد جولات كافية، تتقارب جميع العقد.',
labTip1:'انقر على أي عقدة لبذرها.',labTip2:'اضبط الاحتمال لمشاهدة التأثير.',
labTip3:'قارن 6 عقد مع 25.',labTip4:'شاهد شريط التقدم.',
challenge1:'تقارب 100% بأقل جولات. ما الاحتمال المطلوب؟',
challenge2:'10% مقابل 90%: كم جولة؟',
challenge3:'25 عقدة بنسبة 50%: توقع الجولات.',
seeded:'العقدة {id} بُذرت',roundN:'الجولة {n}',spread:'→ يثرثر مع',infected:'أُصيب!',alreadyHas:'لديه البيانات بالفعل',converged:'جميع العقد تقاربت!',yes:'نعم',no:'لا',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يتيح لك رؤية كيف تتحدث الشبكات! 🌐 مثل رؤية بالأشعة السينية لحركة الإنترنت.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Esp Cyber Range and Esp Swarm Net! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',learnAge:'العمر:'}};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');updateStats();}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const ns=THEME_MELODIES[n];if(!ns)return;const t=audioCtx.currentTime;ns.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+name]||name}`,'info');}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}
let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function openPanel(p,o){const s=$(p),ov=$(o);if(s)s.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const s=$(p),ov=$(o);if(s)s.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
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
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}

/* ═══════ GOSSIP SIMULATION ═══════ */

const G = {
  nodes: [], canvas: null, ctx: null, round: 0, running: false, interval: null,
  spreadProb: 0.6, linkRange: 140,
  anims: [], // {fromId, toId, progress, success}
};

class GNode {
  constructor(id, x, y) {
    this.id = id; this.x = x; this.y = y;
    this.infected = false;
    this.neighbors = [];
    this.pulseTime = 0;
  }
}

function gossipInit() {
  G.canvas = $('gossipCanvas'); if (!G.canvas) return;
  G.ctx = G.canvas.getContext('2d');
  gossipResize(); window.addEventListener('resize', gossipResize);

  G.canvas.addEventListener('click', e => {
    const r = G.canvas.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    const node = G.nodes.find(n => Math.hypot(n.x - mx, n.y - my) < 16);
    if (node && !node.infected) seedNode(node.id);
  });

  const nodeSlider = $('nodeSlider'), nodeVal = $('nodeVal');
  if (nodeSlider) nodeSlider.addEventListener('input', () => {
    if (nodeVal) nodeVal.textContent = nodeSlider.value;
    gossipReset(parseInt(nodeSlider.value));
  });

  const probSlider = $('probSlider'), probVal = $('probVal');
  if (probSlider) probSlider.addEventListener('input', () => {
    G.spreadProb = parseInt(probSlider.value) / 100;
    if (probVal) probVal.textContent = probSlider.value + '%';
  });

  const seedBtn = $('seedBtn');
  if (seedBtn) seedBtn.addEventListener('click', () => {
    const uninfected = G.nodes.filter(n => !n.infected);
    if (uninfected.length > 0) seedNode(uninfected[Math.floor(Math.random() * uninfected.length)].id);
  });

  const resetBtn = $('resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', () => gossipReset(G.nodes.length));

  gossipReset(12);
  gossipRender();
}

function gossipResize() {
  if (!G.canvas) return;
  const r = G.canvas.parentElement.getBoundingClientRect();
  G.canvas.width = r.width - 2; G.canvas.height = 300;
}

function gossipReset(count) {
  if (G.interval) { clearInterval(G.interval); G.interval = null; }
  G.running = false; G.round = 0; G.anims = [];
  G.nodes = [];
  const w = G.canvas ? G.canvas.width : 400, h = G.canvas ? G.canvas.height : 300;
  for (let i = 0; i < count; i++) {
    G.nodes.push(new GNode(i, 30 + Math.random() * (w - 60), 30 + Math.random() * (h - 60)));
  }
  rebuildLinks();
  updateStats();
}

function rebuildLinks() {
  G.nodes.forEach(n => n.neighbors = []);
  for (let i = 0; i < G.nodes.length; i++) {
    for (let j = i + 1; j < G.nodes.length; j++) {
      if (Math.hypot(G.nodes[i].x - G.nodes[j].x, G.nodes[i].y - G.nodes[j].y) < G.linkRange) {
        G.nodes[i].neighbors.push(j);
        G.nodes[j].neighbors.push(i);
      }
    }
  }
  // Ensure connected: connect isolated nodes to nearest
  G.nodes.forEach((n, i) => {
    if (n.neighbors.length === 0) {
      let minD = Infinity, minJ = -1;
      G.nodes.forEach((m, j) => { if (i !== j) { const d = Math.hypot(n.x - m.x, n.y - m.y); if (d < minD) { minD = d; minJ = j; } } });
      if (minJ >= 0) { n.neighbors.push(minJ); G.nodes[minJ].neighbors.push(i); }
    }
  });
}

function seedNode(id) {
  const node = G.nodes[id]; if (!node || node.infected) return;
  node.infected = true;
  node.pulseTime = Date.now();
  const s = LANG[currentLang];
  log(`🦠 ${s.seeded.replace('{id}', String.fromCharCode(65 + id))}`, 'tx');
  playSound('click');
  if (!G.running) startGossip();
  updateStats();
}

function startGossip() {
  G.running = true;
  G.interval = setInterval(gossipRound, 1200);
}

function gossipRound() {
  const infected = G.nodes.filter(n => n.infected);
  if (infected.length === G.nodes.length) {
    clearInterval(G.interval); G.interval = null; G.running = false;
    log(`✅ ${LANG[currentLang].converged}`, 'success');
    showToast(LANG[currentLang].converged, 2500);
    updateStats();
    return;
  }

  G.round++;
  const s = LANG[currentLang];
  log(`📢 ${s.roundN.replace('{n}', G.round)}`, 'info');

  infected.forEach(node => {
    if (node.neighbors.length === 0) return;
    const targetId = node.neighbors[Math.floor(Math.random() * node.neighbors.length)];
    const target = G.nodes[targetId];
    const fromLetter = String.fromCharCode(65 + node.id);
    const toLetter = String.fromCharCode(65 + targetId);

    if (target.infected) {
      G.anims.push({ fromId: node.id, toId: targetId, start: Date.now(), success: false });
    } else if (Math.random() < G.spreadProb) {
      target.infected = true;
      target.pulseTime = Date.now();
      G.anims.push({ fromId: node.id, toId: targetId, start: Date.now(), success: true });
      log(`  ${fromLetter} ${s.spread} ${toLetter} — ${s.infected}`, 'rx');
    } else {
      G.anims.push({ fromId: node.id, toId: targetId, start: Date.now(), success: false });
    }
  });

  updateStats();
}

function updateStats() {
  const infected = G.nodes.filter(n => n.infected).length;
  const total = G.nodes.length;
  const s = LANG[currentLang];
  const sr = $('statRound'), si = $('statInfected'), st = $('statTotal'), sc = $('statConverged');
  if (sr) sr.textContent = G.round;
  if (si) si.textContent = infected;
  if (st) st.textContent = total;
  if (sc) sc.textContent = infected === total ? (s.yes || 'Yes') : (s.no || 'No');
  const fill = $('timelineFill');
  if (fill) fill.style.width = (total > 0 ? (infected / total) * 100 : 0) + '%';
}

function gossipRender() {
  function frame() { gossipDraw(); requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
}

function gossipDraw() {
  const ctx = G.ctx; if (!ctx || !G.canvas) return;
  const w = G.canvas.width, h = G.canvas.height;
  ctx.clearRect(0, 0, w, h);
  const textCol = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#e4ddd0';
  const mutedCol = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8a7e6e';
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Links
  const drawn = new Set();
  G.nodes.forEach(n => {
    n.neighbors.forEach(nId => {
      const key = Math.min(n.id, nId) + '-' + Math.max(n.id, nId);
      if (drawn.has(key)) return; drawn.add(key);
      const m = G.nodes[nId];
      ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y);
      ctx.strokeStyle = mutedCol + '25'; ctx.lineWidth = 1; ctx.stroke();
    });
  });

  // Animations
  const now = Date.now();
  G.anims = G.anims.filter(a => {
    const elapsed = (now - a.start) / 800;
    if (elapsed > 1) return false;
    const from = G.nodes[a.fromId], to = G.nodes[a.toId];
    if (!from || !to) return false;
    const px = from.x + (to.x - from.x) * elapsed;
    const py = from.y + (to.y - from.y) * elapsed;
    ctx.beginPath(); ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = a.success ? '#22c55e' : '#8a7e6e80';
    ctx.fill();
    return true;
  });

  // Nodes
  G.nodes.forEach(node => {
    // Infection pulse
    if (node.infected && now - node.pulseTime < 600) {
      const pulseProgress = (now - node.pulseTime) / 600;
      ctx.beginPath(); ctx.arc(node.x, node.y, 12 + pulseProgress * 12, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34,197,94,${0.3 * (1 - pulseProgress)})`; ctx.fill();
    }

    ctx.beginPath(); ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
    if (node.infected) {
      ctx.fillStyle = '#22c55e40'; ctx.fill();
      ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2.5; ctx.stroke();
    } else {
      ctx.fillStyle = mutedCol + '20'; ctx.fill();
      ctx.strokeStyle = mutedCol + '60'; ctx.lineWidth = 1.5; ctx.stroke();
    }

    ctx.font = 'bold 9px Tajawal, sans-serif'; ctx.fillStyle = textCol;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String.fromCharCode(65 + node.id), node.x, node.y);
  });
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;
  initLogFilters();
  if($('helpBtn'))$('helpBtn').onclick=openHelp;if($('helpCloseBtn'))$('helpCloseBtn').onclick=closeHelp;if($('helpOverlay'))$('helpOverlay').onclick=closeHelp;
  initHelpTabs();
  if($('settingsBtn'))$('settingsBtn').onclick=openSettings;if($('settingsCloseBtn'))$('settingsCloseBtn').onclick=closeSettings;if($('settingsOverlay'))$('settingsOverlay').onclick=closeSettings;
  if($('logBtn'))$('logBtn').onclick=toggleLog;if($('logCloseBtn'))$('logCloseBtn').onclick=closeLog;
  initLogResize();
  const sndT=$('soundToggle');
  if(sndT){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}sndT.checked=soundEnabled;sndT.addEventListener('change',()=>{soundEnabled=sndT.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{};});}
  const brBtn=$('breathingBtn'),dkD=$('dhikrDisplay'),dkB=$('dhikrBtn');
  if(brBtn)brBtn.onclick=()=>{toggleBreathing();if(dkD)dkD.style.display=breathingActive?'flex':'none';};
  if(dkB)dkB.onclick=incrementDhikr;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initKonami();initHijriDate();
  gossipInit();setStatus(true);
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Gossip Protocol: Epidemic data spreading
   with node infection visualization and convergence tracking
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const gNodes=[],gossipMsgs=[];let roundNum=0,infected=0;

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#060810;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  class GNode{
    constructor(x,y,id){this.x=x;this.y=y;this.id=id;this.infected=false;this.infectedTime=0;this.pulse=Math.random()*Math.PI*2;this.neighbors=[];}
    draw(){
      this.pulse+=0.04;const glow=3+Math.sin(this.pulse)*2;
      ctx.save();ctx.shadowColor=this.infected?'#ff6b6b':'#4d96ff';ctx.shadowBlur=glow;
      ctx.beginPath();ctx.arc(this.x,this.y,12,0,Math.PI*2);
      if(this.infected){const t=Math.min(1,(frameCount-this.infectedTime)/30);ctx.fillStyle='rgba(255,107,107,'+(0.2+t*0.3)+')';ctx.strokeStyle='#ff6b6b';}
      else{ctx.fillStyle='rgba(77,150,255,0.15)';ctx.strokeStyle='#4d96ff';}
      ctx.fill();ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
      ctx.font='8px monospace';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=this.infected?'#ff6b6b':'#4d96ff';
      ctx.fillText(this.infected?'\u{1F9E0}':'\u{1F4AD}',this.x,this.y);
      ctx.font='7px monospace';ctx.fillText('N'+this.id,this.x,this.y+18);ctx.restore();
    }
  }

  class GossipMsg{
    constructor(src,tgt){this.sx=src.x;this.sy=src.y;this.tx=tgt.x;this.ty=tgt.y;this.target=tgt;this.progress=0;this.alive=true;}
    update(){this.progress+=0.03;if(this.progress>=1){if(!this.target.infected&&Math.random()<0.7){this.target.infected=true;this.target.infectedTime=frameCount;infected++;}this.alive=false;}return this.alive;}
    draw(){
      const px=this.sx+(this.tx-this.sx)*this.progress,py=this.sy+(this.ty-this.sy)*this.progress;
      ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fillStyle='#ffd93d';ctx.fill();
      ctx.beginPath();ctx.moveTo(this.sx,this.sy);ctx.lineTo(px,py);ctx.strokeStyle='rgba(255,217,61,0.3)';ctx.lineWidth=1;ctx.stroke();
    }
  }

  function drawLinks(){
    gNodes.forEach(n=>{n.neighbors.forEach(nb=>{ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(nb.x,nb.y);
      ctx.strokeStyle=(n.infected&&nb.infected)?'rgba(255,107,107,0.12)':'rgba(77,150,255,0.06)';ctx.lineWidth=1;ctx.stroke();});});
  }

  function drawConvergenceBar(){
    const pct=gNodes.length>0?infected/gNodes.length:0;
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(W/2-100,H-28,200,20);
    ctx.strokeStyle='#fff2';ctx.strokeRect(W/2-100,H-28,200,20);
    const g=ctx.createLinearGradient(W/2-100,0,W/2+100,0);g.addColorStop(0,'#4d96ff');g.addColorStop(0.5,'#ffd93d');g.addColorStop(1,'#ff6b6b');
    ctx.fillStyle=g;ctx.fillRect(W/2-100,H-28,200*pct,20);
    ctx.font='9px monospace';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('Convergence: '+Math.floor(pct*100)+'%',W/2,H-15);ctx.restore();
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,180,68);ctx.strokeStyle='#ff6b6b33';ctx.strokeRect(8,8,180,68);
    ctx.font='10px monospace';ctx.fillStyle='#ff6b6b';ctx.textAlign='left';ctx.fillText('GOSSIP PROTOCOL',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Nodes: '+gNodes.length+'  Infected: '+infected,16,40);
    ctx.fillText('Round: '+roundNum,16,54);
    ctx.fillText('Spread: '+(gNodes.length>0?Math.floor(infected/gNodes.length*100):0)+'%',16,68);ctx.restore();
  }

  function gossipRound(){
    roundNum++;
    gNodes.filter(n=>n.infected).forEach(n=>{
      if(n.neighbors.length===0)return;
      const tgt=n.neighbors[Math.floor(Math.random()*n.neighbors.length)];
      gossipMsgs.push(new GossipMsg(n,tgt));
    });
  }

  function init(){
    ensureCanvas();
    const count=20,margin=40;
    for(let i=0;i<count;i++){const x=margin+Math.random()*(W-2*margin),y=margin+Math.random()*(H-2*margin-30);gNodes.push(new GNode(x,y,i));}
    // Build neighbor graph
    gNodes.forEach(n=>{gNodes.forEach(m=>{if(n===m)return;const dx=n.x-m.x,dy=n.y-m.y;if(Math.sqrt(dx*dx+dy*dy)<120)n.neighbors.push(m);});});
    // Seed initial infection
    const seed=gNodes[Math.floor(Math.random()*gNodes.length)];seed.infected=true;seed.infectedTime=0;infected=1;
    animate();
  }

  function animate(){
    frameCount++;ctx.fillStyle='rgba(6,8,16,0.14)';ctx.fillRect(0,0,W,H);
    drawLinks();
    if(frameCount%60===0&&infected<gNodes.length)gossipRound();
    for(let i=gossipMsgs.length-1;i>=0;i--){if(!gossipMsgs[i].update())gossipMsgs.splice(i,1);else gossipMsgs[i].draw();}
    gNodes.forEach(n=>n.draw());
    // Auto-restart when fully converged
    if(infected>=gNodes.length&&frameCount%300===0){gNodes.forEach(n=>{n.infected=false;n.infectedTime=0;});infected=0;roundNum=0;
      const seed=gNodes[Math.floor(Math.random()*gNodes.length)];seed.infected=true;seed.infectedTime=frameCount;infected=1;}
    drawConvergenceBar();drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,250);
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
