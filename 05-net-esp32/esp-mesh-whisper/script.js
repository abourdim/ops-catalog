/**
 * Workshop DIY — esp-mesh-whisper v1.0
 * Self-Healing Mesh Network Simulation
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Sound
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.139885 78.322945 253.991455 136.254120"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752C203.799835,145.619583,204.629318,145.619736,205.933762,145.784378C212.620331,146.628281,217.423569,150.723984,219.325882,157.203781C219.72139,158.550934,219.771454,162.692093,219.406631,163.88208C218.187943,167.857361,216.579514,170.301239,213.792847,172.411835C209.455261,175.697083,203.83429,176.563141,198.809494,174.720413C197.244873,174.146637,196.144424,173.544434,194.478638,172.350433C191.905991,170.506454,190.53334,169.740753,188.031555,168.754135L187.293335,168.462997L187.308884,160.785461C187.317429,156.56282,187.36911,153.000763,187.423706,152.869797z"/><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057L330.790314,210.972504z"/></svg>`;

const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAA+ElEQVR42u3a0Q0AIQwDwO5/aToCH0goxDe1SH2tAwAAAAAAAAAAgJ+bvj8wJz8+RzgBz38AJ+D5D+AEPP8BnICffwAAAAAAAAAAnIDnP4AT8PwHcAKe/wBOwPMfAAAAAAAAAADgBDz/AZyA5z+AE/D8B3ACnv8AAAAAAAAAADgBz38AJ+D5D+AEPP8BnIDnPwAAAAAAAAAAwAl4/gM4Ac9/ACfg+Q/gBDz/AQAAAAAAAABwAp7/AE7A8x/ACXj+AzgBz38AAAAAAAAAAIAT8PwHcAKe/wBOwPMfwAl4/gMAAAAAAAAA4AQ8/wGcgOc/gBPw/AdwAp7/AAAAAAAAAMCJDz2VFRCvlLkAAAAASUVORK5CYII=';

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click': osc.frequency.value = 800; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); break;
    case 'success': osc.frequency.value = 523; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); const o2 = audioCtx.createOscillator(); const g2 = audioCtx.createGain(); o2.connect(g2); g2.connect(audioCtx.destination); g2.gain.value = 0.08; o2.frequency.value = 659; o2.type = 'sine'; g2.gain.exponentialRampToValueAtTime(0.001, t + 0.4); o2.start(t + 0.15); o2.stop(t + 0.4); break;
    case 'error': osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); break;
  }
}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title: 'esp-mesh-whisper', subtitle: '🕸️ mesh · 🔄 heal · 💬 whisper',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Mesh Whisper — Self-Healing Mesh', mainDesc: 'Messages hop node to node, mesh reroutes around failures',
    sectionA: 'How It Works', sectionB: 'Topology Lab', sectionC: 'Challenge',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', theme: 'Theme', export: 'Export', filterAll: 'All',
    settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    msgPlaceholder: 'Message to whisper...',
    sendBtn: 'Send', killBtn: 'Kill Node', healBtn: 'Heal All', resetBtn: 'Reset',
    howStep1: 'ESP32 nodes form a mesh network, each connecting to nearby neighbors.',
    howStep2: 'Messages use BFS routing to find the shortest path between nodes.',
    howStep3: 'When a node dies, the mesh detects the failure and reroutes traffic.',
    howStep4: 'Self-healing rebuilds links automatically when nodes come back online.',
    challenge1: 'What happens when you kill a critical bridge node?',
    challenge2: 'Why does BFS find the shortest path?',
    challenge3: 'How can a mesh network survive multiple node failures?',
    challengeReveal1: 'The mesh splits into two partitions. Messages between partitions fail until the node heals or new links form.',
    challengeReveal2: 'BFS explores all neighbors at distance 1 before distance 2, guaranteeing the first path found is the shortest in an unweighted graph.',
    challengeReveal3: 'Redundancy! Each node connects to multiple neighbors, creating alternate paths. The more connections, the more resilient the mesh.',
    revealBtn: 'Reveal Answer',
    avgHops: 'Avg Hops:', meshDensity: 'Mesh Density:', deadNodes: 'Dead Nodes:',
    howto_1: 'Click on the mesh canvas to select source and destination nodes.',
    howto_2: 'Type a message and click Send to watch it hop through the mesh.',
    howto_3: 'Click Kill Node to destroy a node and see the mesh reroute.',
    howto_4: 'Click Heal All to restore dead nodes and watch links rebuild.',
    wiki_mesh_title: '🕸️ Mesh Topology', wiki_mesh: 'Each node connects to nearby neighbors. Messages hop from node to node using BFS routing.',
    wiki_bfs_title: '🔍 BFS Routing', wiki_bfs: 'Breadth-First Search explores all neighbors before going deeper, finding the shortest path in unweighted graphs.',
    wiki_heal_title: '🔄 Self-Healing', wiki_heal: 'When nodes fail, the mesh detects broken links and finds alternate routes. Recovered nodes rejoin automatically.',
    wiki_esp_title: '📡 ESP-MESH', wiki_esp: 'ESP-MESH supports up to 1000 nodes. Each node can be both a station and an AP simultaneously.',
    working: 'Working…',
    noMsg: 'Enter a message first', noPath: 'No path found!', selectNodes: 'Click two nodes on the canvas first',
    msgSent: 'Message delivered!', nodeKilled: 'Node killed!', meshHealed: 'Mesh healed!', meshReset: 'Mesh reset!',
    sending: 'Routing message...', healing: 'Healing mesh...',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🕸️ Mesh Whisper ready — click nodes to select source & destination!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    soundEffects: '🔊 Sound effects', whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    chatPlaceholder: 'Talk to the robot...', splashHint: 'tap to skip', newVersion: 'UPDATE',
    langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',step1Title:'Scan',step1Desc:'ESP32 nodes form a mesh network, each connecting to nearby neighbors.',step2Title:'Capture',step2Desc:'Messages use BFS routing to find the shortest path between nodes.',step3Title:'Analyze',step3Desc:'When a node dies, the mesh detects the failure and reroutes traffic.',step4Title:'Report',step4Desc:'Self-healing rebuilds links automatically when nodes come back online.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It lets you see how computer networks talk to each other! 🌐 Like X-ray vision for internet traffic.',faq_q2:'How does it work?',faq_a2:'The simulation shows real network protocols — the rules that computers follow to send data across the internet.',faq_q3:'What should I try first?',faq_a3:'Start a scan and watch the packets fly! 📡 Each colored packet is a different type of network message.',faq_q4:'What\'s the real science?',faq_a4:'This is how the entire internet works! TCP/IP, DNS, ARP — these protocols power every website you visit. 🌍',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! See what happens when you inject bad packets or flood the network. That\'s network security! 🛡️',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need ESP32. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Totally safe! 🛡️ This is a simulation — no real network traffic. Everything stays in your browser.',faq_q8:'What should I try next?',faq_a8:'Try Esp Network Cartographer and Esp Signal Ghost! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',learnAge:'Ages:'},
  fr: {
    title: 'esp-mesh-whisper', subtitle: '🕸️ maillage · 🔄 guérir · 💬 murmurer',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'Mesh Whisper — Maillage Auto-Réparant', mainDesc: 'Les messages sautent de noeud en noeud, le maillage contourne les pannes',
    sectionA: 'Comment ça marche', sectionB: 'Labo Topologie', sectionC: 'Défi',
    activityLog: 'Journal', eventsMsg: 'Événements et messages',
    clear: 'Effacer', copy: 'Copier', theme: 'Thème', export: 'Exporter', filterAll: 'Tout',
    settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    msgPlaceholder: 'Message à murmurer...',
    sendBtn: 'Envoyer', killBtn: 'Tuer Noeud', healBtn: 'Guérir Tout', resetBtn: 'Réinitialiser',
    howStep1: 'Les noeuds ESP32 forment un maillage réseau, chacun se connectant aux voisins proches.',
    howStep2: 'Les messages utilisent le routage BFS pour trouver le chemin le plus court.',
    howStep3: 'Quand un noeud meurt, le maillage détecte la panne et reroute le trafic.',
    howStep4: 'L\'auto-guérison reconstruit les liens quand les noeuds reviennent en ligne.',
    challenge1: 'Que se passe-t-il quand vous tuez un noeud pont critique ?',
    challenge2: 'Pourquoi BFS trouve-t-il le chemin le plus court ?',
    challenge3: 'Comment un maillage peut-il survivre à plusieurs pannes ?',
    challengeReveal1: 'Le maillage se divise en deux partitions. Les messages échouent jusqu\'à la guérison du noeud.',
    challengeReveal2: 'BFS explore tous les voisins à distance 1 avant distance 2, garantissant le chemin le plus court.',
    challengeReveal3: 'Redondance ! Chaque noeud se connecte à plusieurs voisins, créant des chemins alternatifs.',
    revealBtn: 'Révéler',
    avgHops: 'Sauts Moy:', meshDensity: 'Densité:', deadNodes: 'Noeuds Morts:',
    howto_1: 'Cliquez sur le canvas pour sélectionner les noeuds source et destination.',
    howto_2: 'Tapez un message et cliquez Envoyer pour le voir traverser le maillage.',
    howto_3: 'Cliquez Tuer Noeud pour détruire un noeud et voir le reroutage.',
    howto_4: 'Cliquez Guérir Tout pour restaurer les noeuds morts.',
    wiki_mesh_title: '🕸️ Topologie Maillage', wiki_mesh: 'Chaque noeud se connecte aux voisins. Les messages sautent de noeud en noeud via BFS.',
    wiki_bfs_title: '🔍 Routage BFS', wiki_bfs: 'La recherche en largeur explore tous les voisins avant d\'aller plus profond.',
    wiki_heal_title: '🔄 Auto-Guérison', wiki_heal: 'Quand les noeuds tombent, le maillage trouve des routes alternatives.',
    wiki_esp_title: '📡 ESP-MESH', wiki_esp: 'ESP-MESH supporte jusqu\'à 1000 noeuds simultanément.',
    working: 'En cours…',
    noMsg: 'Entrez un message', noPath: 'Aucun chemin trouvé !', selectNodes: 'Cliquez d\'abord deux noeuds',
    msgSent: 'Message livré !', nodeKilled: 'Noeud tué !', meshHealed: 'Maillage guéri !', meshReset: 'Maillage réinitialisé !',
    sending: 'Routage du message...', healing: 'Guérison du maillage...',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad', t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🕸️ Mesh Whisper prêt — cliquez les noeuds pour sélectionner source et destination !',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    soundEffects: '🔊 Effets sonores', whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap', musicMode: 'Réactif musique',
    chatPlaceholder: 'Parle au robot...', splashHint: 'appuyer pour passer', newVersion: 'MAJ',
    langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',step1Title:'Scanner',step1Desc:'Les noeuds ESP32 forment un maillage réseau, chacun se connectant aux voisins proches.',step2Title:'Capturer',step2Desc:'Les messages utilisent le routage BFS pour trouver le chemin le plus court.',step3Title:'Analyser',step3Desc:'Quand un noeud meurt, le maillage détecte la panne et reroute le trafic.',step4Title:'Rapporter',step4Desc:'L\'auto-guérison reconstruit les liens quand les noeuds reviennent en ligne.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle te permet de voir comment les réseaux communiquent ! 🌐 Comme une vision aux rayons X du trafic internet.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut ESP32. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Esp Network Cartographer and Esp Signal Ghost ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',learnAge:'Âge :'},
  ar: {
    title: 'esp-mesh-whisper', subtitle: '🕸️ شبكة · 🔄 شفاء · 💬 همس',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'Mesh Whisper — شبكة ذاتية الإصلاح', mainDesc: 'الرسائل تقفز من عقدة لعقدة، الشبكة تعيد التوجيه حول الأعطال',
    sectionA: 'كيف يعمل', sectionB: 'مختبر الطوبولوجيا', sectionC: 'التحدي',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', theme: 'المظهر', export: 'تصدير', filterAll: 'الكل',
    settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    msgPlaceholder: 'رسالة للهمس...',
    sendBtn: 'إرسال', killBtn: 'قتل عقدة', healBtn: 'شفاء الكل', resetBtn: 'إعادة تعيين',
    howStep1: 'عقد ESP32 تشكل شبكة متداخلة، كل عقدة تتصل بالجيران القريبين.',
    howStep2: 'الرسائل تستخدم توجيه BFS لإيجاد أقصر مسار بين العقد.',
    howStep3: 'عندما تموت عقدة، الشبكة تكتشف العطل وتعيد توجيه حركة المرور.',
    howStep4: 'الإصلاح الذاتي يعيد بناء الروابط تلقائياً عندما تعود العقد.',
    challenge1: 'ماذا يحدث عندما تقتل عقدة جسر حرجة؟',
    challenge2: 'لماذا يجد BFS أقصر مسار؟',
    challenge3: 'كيف يمكن للشبكة أن تنجو من أعطال متعددة؟',
    challengeReveal1: 'الشبكة تنقسم إلى قسمين. الرسائل بين الأقسام تفشل حتى تُشفى العقدة.',
    challengeReveal2: 'BFS يستكشف كل الجيران على مسافة 1 قبل مسافة 2، مما يضمن أقصر مسار.',
    challengeReveal3: 'التكرار! كل عقدة تتصل بعدة جيران، مما يخلق مسارات بديلة.',
    revealBtn: 'اكشف الإجابة',
    avgHops: 'متوسط القفزات:', meshDensity: 'كثافة الشبكة:', deadNodes: 'العقد الميتة:',
    howto_1: 'انقر على اللوحة لتحديد عقد المصدر والوجهة.',
    howto_2: 'اكتب رسالة وانقر إرسال لمشاهدتها تعبر الشبكة.',
    howto_3: 'انقر قتل عقدة لتدمير عقدة ومشاهدة إعادة التوجيه.',
    howto_4: 'انقر شفاء الكل لاستعادة العقد الميتة.',
    wiki_mesh_title: '🕸️ طوبولوجيا الشبكة', wiki_mesh: 'كل عقدة تتصل بالجيران. الرسائل تقفز عبر توجيه BFS.',
    wiki_bfs_title: '🔍 توجيه BFS', wiki_bfs: 'البحث بالعرض يستكشف كل الجيران قبل التعمق.',
    wiki_heal_title: '🔄 الإصلاح الذاتي', wiki_heal: 'عند فشل العقد، الشبكة تجد مسارات بديلة.',
    wiki_esp_title: '📡 ESP-MESH', wiki_esp: 'ESP-MESH يدعم حتى 1000 عقدة في وقت واحد.',
    working: 'جارٍ…',
    noMsg: 'أدخل رسالة أولاً', noPath: 'لا مسار متاح!', selectNodes: 'انقر عقدتين أولاً',
    msgSent: 'تم توصيل الرسالة!', nodeKilled: 'تم قتل العقدة!', meshHealed: 'تم شفاء الشبكة!', meshReset: 'تم إعادة تعيين الشبكة!',
    sending: 'توجيه الرسالة...', healing: 'شفاء الشبكة...',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    ready: '🕸️ Mesh Whisper جاهز — انقر العقد لتحديد المصدر والوجهة!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    soundEffects: '🔊 مؤثرات صوتية', whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط', musicMode: 'تفاعل موسيقي',
    chatPlaceholder: 'تحدث مع الروبوت...', splashHint: 'انقر للتخطي', newVersion: 'تحديث',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',step1Title:'مسح',step1Desc:'عقد ESP32 تشكل شبكة متداخلة، كل عقدة تتصل بالجيران القريبين.',step2Title:'التقاط',step2Desc:'الرسائل تستخدم توجيه BFS لإيجاد أقصر مسار بين العقد.',step3Title:'تحليل',step3Desc:'عندما تموت عقدة، الشبكة تكتشف العطل وتعيد توجيه حركة المرور.',step4Title:'تقرير',step4Desc:'الإصلاح الذاتي يعيد بناء الروابط تلقائياً عندما تعود العقد.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يتيح لك رؤية كيف تتحدث الشبكات! 🌐 مثل رؤية بالأشعة السينية لحركة الإنترنت.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج ESP32. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Esp Network Cartographer and Esp Signal Ghost! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',learnAge:'العمر:'}
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => { const k = opt.dataset.i18nOpt; if (s[k] != null) opt.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k = el.dataset.i18nPlaceholder; if (s[k] != null) el.placeholder = s[k]; });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */
function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  const s = LANG[currentLang]; const label = s['t_' + name] || name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(`${s.themeChanged} ${label}`, 'info');
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const d = document.createElement('div'); d.className = `log-line ${type}`;
  d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') playSound('success');
  else if (type === 'error') playSound('error');
  applyLogFilter();
}
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const t = Array.from(logContainer.children).map(d => d.textContent).join('\n'); try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const blob = new Blob([Array.from(logContainer.children).map(d => d.textContent).join('\n')], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); }

/* ═══════ TOAST ═══════ */
let toastTimer = null;
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (toastTimer) clearTimeout(toastTimer); if (ms > 0) toastTimer = setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; } }

/* ═══════ STATUS ═══════ */
function setStatus(connected) { const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang]; if (txt) txt.textContent = connected ? s.connected : s.disconnected; if (pill) pill.classList.toggle('connected', connected); }

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

/* ═══════ LOG FILTERS ═══════ */
let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); playSound('click'); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(line => { if (activeLogFilter === 'all') { line.style.display = ''; return; } line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none'; }); }

/* ═══════ VERSION CHECK ═══════ */
function checkVersion() { try { const stored = localStorage.getItem('wdiy-latest-version'); if (stored && stored !== APP_VERSION) { const btn = $('settingsBtn'); if (btn && !btn.querySelector('.version-update')) { const badge = document.createElement('span'); badge.className = 'version-update'; badge.textContent = LANG[currentLang].newVersion || 'UPDATE'; btn.style.position = 'relative'; badge.style.cssText = 'position:absolute;top:-6px;inset-inline-end:-6px;'; btn.appendChild(badge); } } } catch {} }

/* ═══════ APP MESSAGING ═══════ */
function sendAppMessage(type, data) { try { const msg = { type, data, from: document.title, ts: Date.now() }; localStorage.setItem('wdiy-app-msg', JSON.stringify(msg)); localStorage.removeItem('wdiy-app-msg'); } catch {} }
function onAppMessage(cb) { window.addEventListener('storage', e => { if (e.key !== 'wdiy-app-msg' || !e.newValue) return; try { cb(JSON.parse(e.newValue)); } catch {} }); }

/* ═══════ KONAMI ═══════ */
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
function initKonami() { document.addEventListener('keydown', e => { if (e.key === KONAMI[konamiIdx]) { konamiIdx++; if (konamiIdx === KONAMI.length) { konamiIdx = 0; setTheme('retro'); log('🕹️ KONAMI CODE ACTIVATED!', 'success'); } } else konamiIdx = 0; }); }

/* ═══════ HIJRI DATE ═══════ */
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {} }

/* ═══════ MATRIX RAIN ═══════ */
let matrixRunning = false, matrixAnim = null;
const ARABIC_CHARS = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix() { const canvas = $('matrixCanvas'); if (!canvas) return; if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); canvas.classList.remove('active'); return; } matrixRunning = true; canvas.classList.add('active'); const ctx = canvas.getContext('2d'); canvas.width = window.innerWidth; canvas.height = window.innerHeight; const cols = Math.floor(canvas.width / 16); const drops = Array(cols).fill(1); function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33'; ctx.font = '14px Amiri, serif'; for (let i = 0; i < drops.length; i++) { ctx.fillText(ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)], i * 16, drops[i] * 16); if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; } matrixAnim = requestAnimationFrame(draw); } draw(); }
let logoClickCount = 0, logoClickTimer = null;
function initMatrixTrigger() { const logo = $('logoWrap'); if (!logo) return; logo.style.cursor = 'pointer'; logo.addEventListener('click', () => { logoClickCount++; if (logoClickTimer) clearTimeout(logoClickTimer); if (logoClickCount >= 3) { logoClickCount = 0; toggleMatrix(); } else logoClickTimer = setTimeout(() => logoClickCount = 0, 500); }); }

/* ═══════ DEBUG ═══════ */
function initDebug() { if (!new URLSearchParams(window.location.search).has('debug')) return; const panel = $('debugPanel'); if (!panel) return; panel.classList.add('active'); const fpsEl = $('debugFps'), memEl = $('debugMem'); let frames = 0, last = performance.now(); function tick() { frames++; const now = performance.now(); if (now - last >= 1000) { if (fpsEl) fpsEl.textContent = frames + ' FPS'; if (memEl && performance.memory) memEl.textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB'; frames = 0; last = now; } requestAnimationFrame(tick); } requestAnimationFrame(tick); }

/* ═══════ THEME MELODIES ═══════ */
const THEME_MELODIES = { 'mosque-gold': [330,392,523], 'zellige': [440,523,659], 'andalus': [294,370,440], 'space': [523,659,784], 'jungle': [262,330,392], 'robot': [440,554,659], 'riad': [349,440,523], 'medina': [294,349,440], 'retro': [523,262,523] };
function playThemeMelody(name) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const notes = THEME_MELODIES[name]; if (!notes) return; const t = audioCtx.currentTime; notes.forEach((freq, i) => { const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0.06; g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15); o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2); }); }

/* ═══════ BREATHING ═══════ */
let breathingActive = false, dhikrCount = 0;
function toggleBreathing() { const bands = document.querySelectorAll('.deco-band'); breathingActive = !breathingActive; if (breathingActive) { bands.forEach(b => b.classList.add('breathing')); } else { bands.forEach(b => b.classList.remove('breathing')); dhikrCount = 0; } }
function incrementDhikr() { if (!breathingActive) return; dhikrCount++; playSound('click'); const c = $('dhikrCounter'); if (c) c.textContent = dhikrCount; }

/* ═══════ LOG RESIZE ═══════ */
function initLogResize() { const handle = $('logResizeHandle'), panel = $('logPanel'); if (!handle || !panel) return; let dragging = false, startX, startW; const isRtl = () => document.documentElement.dir === 'rtl'; handle.addEventListener('mousedown', e => { dragging = true; startX = e.clientX; startW = panel.offsetWidth; e.preventDefault(); }); document.addEventListener('mousemove', e => { if (!dragging) return; const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6)) + 'px'); }); document.addEventListener('mouseup', () => { dragging = false; }); try { const saved = localStorage.getItem('wdiy-log-width'); if (saved) document.documentElement.style.setProperty('--log-width', saved); } catch {} }

/* ═══════ PANELS ═══════ */
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
function openPanel(pid, oid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(pid, oid, rid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.remove('open'); if (ov) ov.classList.remove('open'); const btn = $(rid); if (btn) btn.focus(); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;
function openSettings() { const logEl = $('logPanel'); logWasOpen = logEl && logEl.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const sb = $('logPanel'); if (sb) sb.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const sb = $('logPanel'); if (sb) sb.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const sb = $('logPanel'); if (sb && sb.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }
function initHelpTabs() { const tabs = document.querySelectorAll('.help-tab'); const contents = document.querySelectorAll('.help-content'); tabs.forEach(tab => { tab.addEventListener('click', () => { tabs.forEach(t => t.classList.remove('active')); contents.forEach(c => c.classList.remove('active')); tab.classList.add('active'); const target = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)); if (target) target.classList.add('active'); }); }); }

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();
  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp; if (hClose) hClose.onclick = closeHelp; if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();
  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings; if (sClose) sClose.onclick = closeSettings; if (sOv) sOv.onclick = closeSettings;
  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog; if (lClose) lClose.onclick = closeLog;
  initLogResize();
  const soundTgl = $('soundToggle');
  if (soundTgl) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} soundTgl.checked = soundEnabled; soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} if (soundEnabled) playSound('click'); }); }
  const whisperBtn = $('whisperBtn'); if (whisperBtn) whisperBtn.onclick = () => log('🎤 Whisper mode toggled', 'info');
  const breathBtn = $('breathingBtn'), dhikrDisp = $('dhikrDisplay'), dhikrBtn = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => { toggleBreathing(); if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none'; };
  if (dhikrBtn) dhikrBtn.onclick = incrementDhikr;
  const musicBtn = $('musicBtn'); if (musicBtn) musicBtn.onclick = () => log('🎵 Music mode toggled', 'info');
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); });
  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));
  try { const savedLang = localStorage.getItem('wdiy-lang'); const savedTheme = localStorage.getItem('wdiy-theme'); if (savedTheme) setTheme(savedTheme); if (savedLang) setLanguage(savedLang); } catch {}
  checkVersion();
  onAppMessage(msg => log(`📨 ${msg.from}: ${msg.type}`, 'rx'));
  initKonami(); initMatrixTrigger(); initDebug(); initHijriDate();
  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

/* ═══════════════════════════════════════════════════════════════
   MESH WHISPER SIMULATION
   ═══════════════════════════════════════════════════════════════ */

const NODE_NAMES = ['ROOT','NODE-A','NODE-B','NODE-C','NODE-D','NODE-E','NODE-F','NODE-G','NODE-H'];
let meshNodes = [];
let meshLinks = [];
let selectedNodes = []; // [srcIdx, dstIdx]
let animPath = [];
let animStep = -1;
let animTimer = null;
let meshAnimId = null;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function revealChallenge(idx) {
  const el = $('answer' + idx);
  if (!el) return;
  el.classList.toggle('visible');
  playSound('click');
}

function createMesh() {
  const canvas = $('meshCanvas');
  if (!canvas) return;
  const W = canvas.width = canvas.offsetWidth || 500;
  const H = canvas.height = 300;
  meshNodes = [];
  meshLinks = [];
  selectedNodes = [];
  animPath = [];
  animStep = -1;

  // Place nodes in a grid-like pattern with some randomness
  const rows = 3, cols = 3;
  const padX = 60, padY = 50;
  const gapX = (W - padX * 2) / (cols - 1);
  const gapY = (H - padY * 2) / (rows - 1);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;
      if (idx >= NODE_NAMES.length) break;
      meshNodes.push({
        x: padX + c * gapX + (Math.random() - 0.5) * 30,
        y: padY + r * gapY + (Math.random() - 0.5) * 20,
        name: NODE_NAMES[idx],
        alive: true,
        radius: 18
      });
    }
  }

  // Create links: connect nearby nodes (grid neighbors + some diagonals)
  for (let i = 0; i < meshNodes.length; i++) {
    for (let j = i + 1; j < meshNodes.length; j++) {
      const dx = meshNodes[i].x - meshNodes[j].x;
      const dy = meshNodes[i].y - meshNodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < gapX * 1.5) {
        meshLinks.push({ a: i, b: j, alive: true });
      }
    }
  }

  setStatus(true);
  updateNodeInfo();
  drawMesh();
}

function getNeighbors(nodeIdx) {
  const neighbors = [];
  for (const link of meshLinks) {
    if (!link.alive) continue;
    if (link.a === nodeIdx && meshNodes[link.b].alive) neighbors.push(link.b);
    if (link.b === nodeIdx && meshNodes[link.a].alive) neighbors.push(link.a);
  }
  return neighbors;
}

// BFS shortest path
function bfsPath(src, dst) {
  if (src === dst) return [src];
  if (!meshNodes[src].alive || !meshNodes[dst].alive) return null;
  const visited = new Set([src]);
  const queue = [[src]];
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    for (const nb of getNeighbors(current)) {
      if (nb === dst) return [...path, nb];
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push([...path, nb]);
      }
    }
  }
  return null; // no path
}

function updateNodeInfo() {
  const info = $('nodeInfo');
  const aliveCount = meshNodes.filter(n => n.alive).length;
  const aliveLinks = meshLinks.filter(l => l.alive && meshNodes[l.a].alive && meshNodes[l.b].alive).length;
  let pathStr = '—';
  if (selectedNodes.length === 2) {
    const p = bfsPath(selectedNodes[0], selectedNodes[1]);
    pathStr = p ? p.map(i => meshNodes[i].name).join(' → ') : 'NO PATH';
  }
  if (info) info.textContent = `Nodes: ${aliveCount}/${meshNodes.length} | Links: ${aliveLinks} | Path: ${pathStr}`;

  // Update stats
  const dead = $('deadNodes');
  if (dead) dead.textContent = meshNodes.filter(n => !n.alive).length;
  const density = $('meshDensity');
  if (density) {
    const maxLinks = aliveCount * (aliveCount - 1) / 2;
    density.textContent = maxLinks > 0 ? (aliveLinks / maxLinks * 100).toFixed(1) + '%' : '—';
  }
  const avgH = $('avgHops');
  if (avgH) {
    let totalHops = 0, count = 0;
    const alive = meshNodes.map((n, i) => n.alive ? i : -1).filter(i => i >= 0);
    for (let i = 0; i < alive.length; i++) {
      for (let j = i + 1; j < alive.length; j++) {
        const p = bfsPath(alive[i], alive[j]);
        if (p) { totalHops += p.length - 1; count++; }
      }
    }
    avgH.textContent = count > 0 ? (totalHops / count).toFixed(1) : '—';
  }
}

function drawMesh() {
  const canvas = $('meshCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Draw links
  for (const link of meshLinks) {
    if (!link.alive) continue;
    const a = meshNodes[link.a], b = meshNodes[link.b];
    if (!a.alive || !b.alive) continue;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);

    // Check if this link is part of the animated path
    let isOnPath = false;
    if (animPath.length > 1 && animStep >= 0) {
      for (let i = 0; i < animPath.length - 1 && i <= animStep; i++) {
        if ((link.a === animPath[i] && link.b === animPath[i + 1]) ||
            (link.b === animPath[i] && link.a === animPath[i + 1])) {
          isOnPath = true; break;
        }
      }
    }

    ctx.strokeStyle = isOnPath ? '#33ff33' : 'rgba(255,255,255,0.15)';
    ctx.lineWidth = isOnPath ? 3 : 1;
    ctx.stroke();
  }

  // Draw nodes
  for (let i = 0; i < meshNodes.length; i++) {
    const n = meshNodes[i];
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

    if (!n.alive) {
      ctx.fillStyle = 'rgba(192,57,43,0.3)';
      ctx.strokeStyle = '#c0392b';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
    } else if (selectedNodes.includes(i)) {
      ctx.fillStyle = accent;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
    } else if (animPath.includes(i) && animStep >= animPath.indexOf(i)) {
      ctx.fillStyle = '#33ff33';
      ctx.strokeStyle = '#33ff33';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
    }

    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);

    // Label
    ctx.fillStyle = n.alive ? '#fff' : '#666';
    ctx.font = '9px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.name, n.x, n.y);
  }

  // Draw animated message packet
  if (animStep >= 0 && animStep < animPath.length - 1) {
    const from = meshNodes[animPath[animStep]];
    const to = meshNodes[animPath[animStep + 1]];
    const progress = (Date.now() % 500) / 500;
    const px = from.x + (to.x - from.x) * progress;
    const py = from.y + (to.y - from.y) * progress;
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f39c12';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(243,156,18,0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function animateLoop() {
  drawMesh();
  meshAnimId = requestAnimationFrame(animateLoop);
}

function initMeshCanvas() {
  const canvas = $('meshCanvas');
  if (!canvas) return;

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    // Find closest alive node
    let closest = -1, minDist = Infinity;
    for (let i = 0; i < meshNodes.length; i++) {
      if (!meshNodes[i].alive) continue;
      const dx = meshNodes[i].x - x, dy = meshNodes[i].y - y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 30 && d < minDist) { minDist = d; closest = i; }
    }

    if (closest < 0) return;
    playSound('click');

    if (selectedNodes.length < 2) {
      selectedNodes.push(closest);
      log(`📌 Selected: ${meshNodes[closest].name}`, 'info');
    } else {
      selectedNodes = [closest];
      animPath = [];
      animStep = -1;
      log(`📌 New source: ${meshNodes[closest].name}`, 'info');
    }
    updateNodeInfo();
    drawMesh();
  });

  createMesh();
  animateLoop();
}

// Send message animation
async function sendMessage() {
  const s = LANG[currentLang];
  const msg = ($('msgInput') || {}).value || '';
  if (!msg) { log(s.noMsg, 'error'); showToast(s.noMsg, 1500); return; }
  if (selectedNodes.length < 2) { log(s.selectNodes, 'error'); showToast(s.selectNodes, 1500); return; }

  const path = bfsPath(selectedNodes[0], selectedNodes[1]);
  if (!path) { log(s.noPath, 'error'); showToast(s.noPath, 1500); return; }

  animPath = path;
  animStep = 0;
  log(`📤 TX: "${msg}" via ${path.map(i => meshNodes[i].name).join(' → ')}`, 'tx');
  showToast(s.sending, 3000);

  for (let i = 0; i < path.length - 1; i++) {
    animStep = i;
    log(`  ↳ Hop ${i + 1}: ${meshNodes[path[i]].name} → ${meshNodes[path[i + 1]].name}`, 'info');
    await sleep(600);
  }

  animStep = path.length;
  log(`📥 RX: "${msg}" delivered to ${meshNodes[path[path.length - 1]].name}`, 'rx');
  log(s.msgSent, 'success');
  showToast(s.msgSent, 1500);
  setStatus(true);
}

// Kill a random alive non-selected node
function killNode() {
  const s = LANG[currentLang];
  const candidates = meshNodes.map((n, i) => n.alive && !selectedNodes.includes(i) ? i : -1).filter(i => i >= 0);
  if (candidates.length === 0) return;
  const victim = candidates[Math.floor(Math.random() * candidates.length)];
  meshNodes[victim].alive = false;
  animPath = [];
  animStep = -1;
  log(`💀 ${meshNodes[victim].name} killed!`, 'error');
  showToast(s.nodeKilled, 1200);
  updateNodeInfo();
}

// Heal all nodes
async function healMesh() {
  const s = LANG[currentLang];
  showToast(s.healing, 2000);
  for (const n of meshNodes) {
    if (!n.alive) {
      n.alive = true;
      log(`💚 ${n.name} healed!`, 'success');
      await sleep(300);
    }
  }
  for (const l of meshLinks) l.alive = true;
  animPath = [];
  animStep = -1;
  log(s.meshHealed, 'success');
  updateNodeInfo();
}

function initMeshSim() {
  const sendBtnEl = $('sendBtn');
  const killBtnEl = $('killBtn');
  const healBtnEl = $('healBtn');
  const resetBtnEl = $('resetBtn');

  if (sendBtnEl) sendBtnEl.addEventListener('click', sendMessage);
  if (killBtnEl) killBtnEl.addEventListener('click', killNode);
  if (healBtnEl) healBtnEl.addEventListener('click', healMesh);
  if (resetBtnEl) resetBtnEl.addEventListener('click', () => {
    createMesh();
    log(LANG[currentLang].meshReset, 'info');
  });

  setTimeout(initMeshCanvas, 300);
}

// Draw topology minimap
function initTopoCanvas() {
  const canvas = $('topoCanvas');
  if (!canvas) return;
  canvas.width = canvas.offsetWidth || 400;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  function drawTopo() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    const scaleX = canvas.width / ($('meshCanvas')?.width || 500);
    const scaleY = canvas.height / 300;

    for (const link of meshLinks) {
      if (!link.alive) continue;
      const a = meshNodes[link.a], b = meshNodes[link.b];
      if (!a?.alive || !b?.alive) continue;
      ctx.beginPath();
      ctx.moveTo(a.x * scaleX, a.y * scaleY);
      ctx.lineTo(b.x * scaleX, b.y * scaleY);
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (const n of meshNodes) {
      ctx.beginPath();
      ctx.arc(n.x * scaleX, n.y * scaleY, 8, 0, Math.PI * 2);
      ctx.fillStyle = n.alive ? accent : 'rgba(192,57,43,0.5)';
      ctx.fill();
    }
    requestAnimationFrame(drawTopo);
  }
  drawTopo();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { initMeshSim(); setTimeout(initTopoCanvas, 500); });
} else {
  setTimeout(() => { initMeshSim(); setTimeout(initTopoCanvas, 500); }, 50);
}


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
