/**
 * Workshop DIY — Swarm Net v1.0
 * ESP-NOW Fleet Coordination Simulator
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Sound
 */

const $ = id => document.getElementById(id);

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7c0-4.2.1-7.8.1-7.9z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7h-126.8v3.6h126.8z"/><path style="stroke:none;fill:currentColor" d="M330.8,203.4h-169.1v3.6h169.1z"/><path style="stroke:none;fill:currentColor" d="M330.8,211h-253.7v3.6h253.7z"/></svg>`;

const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAA';

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

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
    title: 'Swarm Net', subtitle: '🐝 swarm · 📡 ESP-NOW · 🎯 formation',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Swarm Net — ESP-NOW Fleet', mainDesc: 'Coordinated swarm intelligence with browser command center',
    sectionA: 'How It Works', sectionB: 'Lab', sectionC: 'Challenge',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', theme: 'Theme', export: 'Export', filterAll: 'All',
    settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1: 'Choose a formation using the buttons below the canvas to command the swarm.',
    howto_2: 'Adjust speed and node count to see different swarm behaviors.',
    howto_3: 'Type commands in the input field and press Send to issue orders.',
    howto_4: 'Click on the canvas to set a rally point and watch nodes converge.',
    wiki_swarm_title: '🐝 Swarm Robotics', wiki_swarm: 'Swarm robotics coordinates large numbers of simple robots to perform tasks through local interactions, without centralized control.',
    wiki_espnow_title: '📡 ESP-NOW Protocol', wiki_espnow: 'ESP-NOW supports up to 20 encrypted peers with 250-byte payloads at sub-millisecond latency. No router needed.',
    wiki_formation_title: '🎯 Formation Control', wiki_formation: 'Formation control assigns each agent a unique slot in a geometric pattern. Consensus algorithms keep the group coherent.',
    wiki_telemetry_title: '📊 Telemetry', wiki_telemetry: 'Telemetry is the automatic measurement and wireless transmission of data from remote sources to a monitoring station.',
    working: 'Working…',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🐝 Swarm Net ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    soundEffects: '🔊 Sound effects', whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    chatPlaceholder: 'Talk to the robot...', splashHint: 'tap to skip', newVersion: 'UPDATE',
    langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    speedLabel: 'Speed:', countLabel: 'Nodes:',
    fScatter: 'Scatter', fLine: 'Line', fCircle: 'Circle', fVshape: 'V-Shape', fGrid: 'Grid',
    sendCmd: 'Send', cmdPlaceholder: 'Command (e.g. rotate, halt, patrol)...',
    teleFormation: 'Formation', teleNodes: 'Active Nodes', teleMessages: 'Messages', teleCoherence: 'Coherence',
    step1: 'Each ESP32 node broadcasts its position via ESP-NOW, a low-latency peer-to-peer protocol.',
    step2: 'The command center sends formation orders (line, circle, scatter) to all nodes simultaneously.',
    step3: 'Nodes calculate their target position based on formation type and smoothly move toward it.',
    step4: 'Telemetry (position, battery, signal) flows back to the dashboard in real-time via ESP-NOW relay.',
    labTip1: 'Use formation buttons to see how nodes reorganize in real-time.',
    labTip2: 'Adjust the speed slider to control how fast nodes converge to their target positions.',
    labTip3: 'Type commands like "rotate", "halt", or "patrol" to send orders to the swarm.',
    labTip4: 'Click on the canvas to set a rally point — all nodes will converge there.',
    challenge1: 'Get all nodes into circle formation with 100% coherence in under 5 seconds.',
    challenge2: 'Send a "patrol" command and observe how nodes sweep the canvas area systematically.',
    challenge3: 'Set a rally point, then switch to V-shape formation — watch the swarm reorganize mid-flight.',
    cmdReceived: 'Command received', cmdRotate: 'Rotating formation', cmdHalt: 'All nodes halted',
    cmdPatrol: 'Patrol mode engaged', cmdRally: 'Rally point set', cmdUnknown: 'Unknown command',
    formationChanged: 'Formation →', rallySet: 'Rally point set',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It lets you see how computer networks talk to each other! 🌐 Like X-ray vision for internet traffic.',faq_q2:'How does it work?',faq_a2:'The simulation shows real network protocols — the rules that computers follow to send data across the internet.',faq_q3:'What should I try first?',faq_a3:'Start a scan and watch the packets fly! 📡 Each colored packet is a different type of network message.',faq_q4:'What\'s the real science?',faq_a4:'This is how the entire internet works! TCP/IP, DNS, ARP — these protocols power every website you visit. 🌍',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! See what happens when you inject bad packets or flood the network. That\'s network security! 🛡️',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Totally safe! 🛡️ This is a simulation — no real network traffic. Everything stays in your browser.',faq_q8:'What should I try next?',faq_a8:'Try Esp Cyber Range and Esp Internet Simulator! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next'},
  fr: {
    title: 'Swarm Net', subtitle: '🐝 essaim · 📡 ESP-NOW · 🎯 formation',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'Swarm Net — Flotte ESP-NOW', mainDesc: 'Intelligence d\'essaim coordonnée avec centre de commande navigateur',
    sectionA: 'Comment ça marche', sectionB: 'Labo', sectionC: 'Défi',
    activityLog: 'Journal', eventsMsg: 'Événements et messages',
    clear: 'Effacer', copy: 'Copier', theme: 'Thème', export: 'Exporter', filterAll: 'Tout',
    settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1: 'Choisissez une formation avec les boutons sous le canevas pour commander l\'essaim.',
    howto_2: 'Ajustez la vitesse et le nombre de nœuds pour observer différents comportements.',
    howto_3: 'Tapez des commandes dans le champ et appuyez sur Envoyer pour donner des ordres.',
    howto_4: 'Cliquez sur le canevas pour définir un point de ralliement.',
    wiki_swarm_title: '🐝 Robotique d\'Essaim', wiki_swarm: 'La robotique d\'essaim coordonne de nombreux robots simples pour accomplir des tâches par interactions locales.',
    wiki_espnow_title: '📡 Protocole ESP-NOW', wiki_espnow: 'ESP-NOW supporte jusqu\'à 20 pairs chiffrés avec des paquets de 250 octets à latence sub-milliseconde.',
    wiki_formation_title: '🎯 Contrôle de Formation', wiki_formation: 'Le contrôle de formation assigne à chaque agent une place unique dans un motif géométrique.',
    wiki_telemetry_title: '📊 Télémétrie', wiki_telemetry: 'La télémétrie est la mesure automatique et la transmission sans fil de données depuis des sources distantes.',
    working: 'En cours…',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad', t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🐝 Swarm Net prêt !',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    soundEffects: '🔊 Effets sonores', whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap', musicMode: 'Réactif musique',
    chatPlaceholder: 'Parle au robot...', splashHint: 'appuyer pour passer', newVersion: 'MAJ',
    langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    speedLabel: 'Vitesse :', countLabel: 'Nœuds :',
    fScatter: 'Dispersé', fLine: 'Ligne', fCircle: 'Cercle', fVshape: 'V', fGrid: 'Grille',
    sendCmd: 'Envoyer', cmdPlaceholder: 'Commande (ex: rotate, halt, patrol)...',
    teleFormation: 'Formation', teleNodes: 'Nœuds Actifs', teleMessages: 'Messages', teleCoherence: 'Cohérence',
    step1: 'Chaque nœud ESP32 diffuse sa position via ESP-NOW, un protocole pair-à-pair à faible latence.',
    step2: 'Le centre de commande envoie des ordres de formation à tous les nœuds simultanément.',
    step3: 'Les nœuds calculent leur position cible selon le type de formation et s\'y déplacent en douceur.',
    step4: 'La télémétrie revient au tableau de bord en temps réel via relais ESP-NOW.',
    labTip1: 'Utilisez les boutons de formation pour voir la réorganisation des nœuds en temps réel.',
    labTip2: 'Ajustez le curseur de vitesse pour contrôler la convergence des nœuds.',
    labTip3: 'Tapez des commandes comme "rotate", "halt" ou "patrol" pour donner des ordres.',
    labTip4: 'Cliquez sur le canevas pour définir un point de ralliement.',
    challenge1: 'Mettez tous les nœuds en formation cercle avec 100% de cohérence en moins de 5 secondes.',
    challenge2: 'Envoyez "patrol" et observez comment les nœuds balaient la zone systématiquement.',
    challenge3: 'Définissez un point de ralliement, puis passez en V — regardez le réorganisation en vol.',
    cmdReceived: 'Commande reçue', cmdRotate: 'Rotation de la formation', cmdHalt: 'Tous les nœuds arrêtés',
    cmdPatrol: 'Mode patrouille engagé', cmdRally: 'Point de ralliement défini', cmdUnknown: 'Commande inconnue',
    formationChanged: 'Formation →', rallySet: 'Point de ralliement défini',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle te permet de voir comment les réseaux communiquent ! 🌐 Comme une vision aux rayons X du trafic internet.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Esp Cyber Range and Esp Internet Simulator ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv'},
  ar: {
    title: 'Swarm Net', subtitle: '🐝 سرب · 📡 ESP-NOW · 🎯 تشكيل',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'شبكة السرب — أسطول ESP-NOW', mainDesc: 'ذكاء سرب منسق مع مركز قيادة في المتصفح',
    sectionA: 'كيف يعمل', sectionB: 'المختبر', sectionC: 'التحدي',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', theme: 'المظهر', export: 'تصدير', filterAll: 'الكل',
    settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    howto_1: 'اختر تشكيلاً باستخدام الأزرار أسفل اللوحة لقيادة السرب.',
    howto_2: 'اضبط السرعة وعدد العقد لمشاهدة سلوكيات مختلفة.',
    howto_3: 'اكتب أوامر في حقل الإدخال واضغط إرسال.',
    howto_4: 'انقر على اللوحة لتحديد نقطة تجمع.',
    wiki_swarm_title: '🐝 روبوتات السرب', wiki_swarm: 'تنسق روبوتات السرب أعدادًا كبيرة من الروبوتات البسيطة لأداء المهام.',
    wiki_espnow_title: '📡 بروتوكول ESP-NOW', wiki_espnow: 'يدعم ESP-NOW حتى 20 نظيرًا مشفرًا بزمن انتقال أقل من ميلي ثانية.',
    wiki_formation_title: '🎯 التحكم في التشكيل', wiki_formation: 'يعين التحكم في التشكيل لكل عامل مكانًا فريدًا في نمط هندسي.',
    wiki_telemetry_title: '📊 القياس عن بُعد', wiki_telemetry: 'القياس عن بُعد هو القياس التلقائي والإرسال اللاسلكي للبيانات من مصادر بعيدة.',
    working: 'جارٍ…',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    ready: '🐝 شبكة السرب جاهزة!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    soundEffects: '🔊 مؤثرات صوتية', whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط', musicMode: 'تفاعل موسيقي',
    chatPlaceholder: 'تحدث مع الروبوت...', splashHint: 'انقر للتخطي', newVersion: 'تحديث',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    speedLabel: 'السرعة:', countLabel: 'العقد:',
    fScatter: 'تفرق', fLine: 'خط', fCircle: 'دائرة', fVshape: 'V', fGrid: 'شبكة',
    sendCmd: 'إرسال', cmdPlaceholder: 'أمر (مثل: rotate, halt, patrol)...',
    teleFormation: 'التشكيل', teleNodes: 'العقد النشطة', teleMessages: 'الرسائل', teleCoherence: 'التماسك',
    step1: 'كل عقدة ESP32 تبث موقعها عبر ESP-NOW.',
    step2: 'يرسل مركز القيادة أوامر التشكيل لجميع العقد في وقت واحد.',
    step3: 'تحسب العقد موقعها المستهدف وتتحرك بسلاسة نحوه.',
    step4: 'تتدفق القياسات إلى لوحة المعلومات في الوقت الفعلي عبر ترحيل ESP-NOW.',
    labTip1: 'استخدم أزرار التشكيل لمشاهدة إعادة تنظيم العقد.',
    labTip2: 'اضبط شريط السرعة للتحكم في سرعة التقارب.',
    labTip3: 'اكتب أوامر مثل "rotate" أو "halt" أو "patrol".',
    labTip4: 'انقر على اللوحة لتحديد نقطة تجمع.',
    challenge1: 'اجعل جميع العقد في تشكيل دائري مع تماسك 100% في أقل من 5 ثوانٍ.',
    challenge2: 'أرسل أمر "patrol" ولاحظ كيف تمسح العقد المساحة.',
    challenge3: 'حدد نقطة تجمع ثم انتقل إلى تشكيل V — شاهد إعادة التنظيم.',
    cmdReceived: 'تم استلام الأمر', cmdRotate: 'تدوير التشكيل', cmdHalt: 'توقف جميع العقد',
    cmdPatrol: 'وضع الدورية مُفعّل', cmdRally: 'تم تحديد نقطة التجمع', cmdUnknown: 'أمر غير معروف',
    formationChanged: 'التشكيل →', rallySet: 'تم تحديد نقطة التجمع',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يتيح لك رؤية كيف تتحدث الشبكات! 🌐 مثل رؤية بالأشعة السينية لحركة الإنترنت.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Esp Cyber Range and Esp Internet Simulator! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي'}
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

const THEME_MELODIES = { 'mosque-gold': [330,392,523], 'zellige': [440,523,659], 'andalus': [294,370,440], 'space': [523,659,784], 'jungle': [262,330,392], 'robot': [440,554,659], 'riad': [349,440,523], 'medina': [294,349,440], 'retro': [523,262,523] };

function playThemeMelody(name) {
  if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[name]; if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0.06; g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15); o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2); });
}

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  const s = LANG[currentLang];
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(`${s.themeChanged} ${s['t_' + name] || name}`, 'info');
}

/* ═══════ LOG ═══════ */

let logContainer, typewriterEnabled = true;

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const d = document.createElement('div'); d.className = `log-line ${type}`;
  const txt = `[${new Date().toLocaleTimeString()}] ${msg}`;
  if (typewriterEnabled) { logContainer.appendChild(d); twAppend(d, txt); } else { d.textContent = txt; logContainer.appendChild(d); }
  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') { playSound('success'); pulseBismillah('success'); }
  else if (type === 'error') { playSound('error'); pulseBismillah('error'); }
  applyLogFilter();
}

async function twAppend(el, text) { el.textContent = ''; for (let i = 0; i < text.length; i++) { el.textContent += text[i]; await new Promise(r => setTimeout(r, 8 + Math.random() * 12)); } }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const b = new Blob([Array.from(logContainer.children).map(d => d.textContent).join('\n')], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = `log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); URL.revokeObjectURL(u); }

/* ═══════ TOAST / STATUS / SPLASH ═══════ */

let toastTimer = null;
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (toastTimer) clearTimeout(toastTimer); if (ms > 0) toastTimer = setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(c) { const p = $('statusPill'), t = $('statusText'), s = LANG[currentLang]; if (t) t.textContent = c ? s.connected : s.disconnected; if (p) p.classList.toggle('connected', c); }
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }
function pulseBismillah(type) { const b = document.querySelector('.bismillah'); if (!b) return; b.classList.remove('pulse-success','pulse-error'); void b.offsetWidth; b.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success'); setTimeout(() => b.classList.remove('pulse-success','pulse-error'), 700); }

/* ═══════ LOG FILTERS ═══════ */

let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); playSound('click'); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; }); }

/* ═══════ PANELS ═══════ */

function openPanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(p, o, r) { const s = $(p), ov = $(o); if (s) s.classList.remove('open'); if (ov) ov.classList.remove('open'); const b = $(r); if (b) b.focus(); }
function openHelp() { openPanel('helpPanel','helpOverlay'); }
function closeHelp() { closePanel('helpPanel','helpOverlay','helpBtn'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel','settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel','settingsOverlay','settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }
function initHelpTabs() { const tabs = document.querySelectorAll('.help-tab'), cs = document.querySelectorAll('.help-content'); tabs.forEach(tab => { tab.addEventListener('click', () => { tabs.forEach(t => t.classList.remove('active')); cs.forEach(c => c.classList.remove('active')); tab.classList.add('active'); const n = tab.dataset.tab; const tgt = $('help' + n.charAt(0).toUpperCase() + n.slice(1)); if (tgt) tgt.classList.add('active'); }); }); }

/* ═══════ BREATHING / HIJRI / KONAMI / MATRIX ═══════ */

let breathingActive = false, dhikrCount = 0;
function toggleBreathing() { breathingActive = !breathingActive; document.querySelectorAll('.deco-band').forEach(b => b.classList.toggle('breathing', breathingActive)); }
function incrementDhikr() { if (!breathingActive) return; dhikrCount++; playSound('click'); const c = $('dhikrCounter'); if (c) c.textContent = dhikrCount; }
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {} }

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
function initKonami() { document.addEventListener('keydown', e => { if (e.key === KONAMI[konamiIdx]) { konamiIdx++; if (konamiIdx === KONAMI.length) { konamiIdx = 0; setTheme('retro'); log('🕹️ KONAMI CODE — RETRO MODE!', 'success'); } } else konamiIdx = 0; }); }

let matrixRunning = false, matrixAnim = null;
function toggleMatrix() { const c = $('matrixCanvas'); if (!c) return; if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); c.classList.remove('active'); return; } matrixRunning = true; c.classList.add('active'); const ctx = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight; const cols = Math.floor(c.width / 16), drops = Array(cols).fill(1); const chars = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذ'; (function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0,0,c.width,c.height); ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33'; ctx.font = '14px Amiri'; for (let i = 0; i < drops.length; i++) { ctx.fillText(chars[Math.floor(Math.random()*chars.length)], i*16, drops[i]*16); if (drops[i]*16>c.height&&Math.random()>0.975) drops[i]=0; drops[i]++; } matrixAnim = requestAnimationFrame(draw); })(); }
let logoClickCount = 0, logoClickTimer = null;
function initMatrixTrigger() { const l = $('logoWrap'); if (!l) return; l.style.cursor = 'pointer'; l.addEventListener('click', () => { logoClickCount++; if (logoClickTimer) clearTimeout(logoClickTimer); if (logoClickCount >= 3) { logoClickCount = 0; toggleMatrix(); } else logoClickTimer = setTimeout(() => logoClickCount = 0, 500); }); }

/* ═══════ LOG RESIZE ═══════ */

function initLogResize() { const h = $('logResizeHandle'), p = $('logPanel'); if (!h||!p) return; let d = false, sx, sw; const rtl = () => document.documentElement.dir === 'rtl'; h.addEventListener('mousedown', e => { d = true; sx = e.clientX; sw = p.offsetWidth; h.classList.add('active'); document.body.style.cursor = 'col-resize'; document.body.style.userSelect = 'none'; e.preventDefault(); }); document.addEventListener('mousemove', e => { if (!d) return; const dx = rtl() ? (e.clientX - sx) : (sx - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(sw + dx, innerWidth * 0.6)) + 'px'); }); document.addEventListener('mouseup', () => { if (!d) return; d = false; h.classList.remove('active'); document.body.style.cursor = ''; document.body.style.userSelect = ''; }); try { const s = localStorage.getItem('wdiy-log-width'); if (s) document.documentElement.style.setProperty('--log-width', s); } catch {} }

/* ═══════ SWARM SIMULATION ═══════ */

const SWARM = {
  nodes: [], canvas: null, ctx: null, formation: 'scatter', speed: 5, animFrame: null,
  msgCount: 0, rallyPoint: null, rotating: false, rotationAngle: 0, halted: false,
  patrolling: false, patrolIdx: 0,
  colors: ['#d4a03c','#38bdf8','#4ade80','#c084fc','#a3e635','#3b82f6','#f97316','#ef4444','#22d3ee','#f472b6','#facc15','#34d399'],
};

class SwarmNode {
  constructor(id, x, y, color) { this.id = id; this.x = x; this.y = y; this.tx = x; this.ty = y; this.color = color; this.trail = []; this.radius = 10; }
}

function swarmInit() {
  SWARM.canvas = $('swarmCanvas'); if (!SWARM.canvas) return;
  SWARM.ctx = SWARM.canvas.getContext('2d');
  swarmResize(); window.addEventListener('resize', swarmResize);

  SWARM.canvas.addEventListener('click', e => {
    const r = SWARM.canvas.getBoundingClientRect();
    SWARM.rallyPoint = { x: e.clientX - r.left, y: e.clientY - r.top };
    SWARM.nodes.forEach(n => { n.tx = SWARM.rallyPoint.x + (Math.random()-.5)*30; n.ty = SWARM.rallyPoint.y + (Math.random()-.5)*30; });
    SWARM.halted = false;
    log(`📍 ${LANG[currentLang].rallySet} (${Math.round(SWARM.rallyPoint.x)}, ${Math.round(SWARM.rallyPoint.y)})`, 'info');
    SWARM.msgCount++; updateTelemetry();
  });

  document.querySelectorAll('[data-formation]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-formation]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); SWARM.formation = btn.dataset.formation;
      SWARM.halted = false; SWARM.patrolling = false;
      swarmSetFormation(SWARM.formation);
      log(`🎯 ${LANG[currentLang].formationChanged} ${LANG[currentLang]['f' + cap(SWARM.formation)] || SWARM.formation}`, 'tx');
      SWARM.msgCount++; updateTelemetry(); playSound('click');
    });
  });

  const spd = $('swarmSpeed'); if (spd) spd.addEventListener('input', () => { SWARM.speed = parseInt(spd.value); });
  const cnt = $('swarmCount'), cv = $('countVal');
  if (cnt) cnt.addEventListener('input', () => { if (cv) cv.textContent = cnt.value; swarmGen(parseInt(cnt.value)); swarmSetFormation(SWARM.formation); updateTelemetry(); });

  const cmdBtn = $('cmdSendBtn'), cmdIn = $('cmdInput');
  if (cmdBtn) cmdBtn.addEventListener('click', swarmCmd);
  if (cmdIn) cmdIn.addEventListener('keydown', e => { if (e.key === 'Enter') swarmCmd(); });

  swarmGen(6); swarmSetFormation('scatter'); swarmRender();
}

function swarmResize() { if (!SWARM.canvas) return; const r = SWARM.canvas.parentElement.getBoundingClientRect(); SWARM.canvas.width = r.width - 2; SWARM.canvas.height = 320; }

function swarmGen(n) {
  SWARM.nodes = [];
  const w = SWARM.canvas ? SWARM.canvas.width : 400, h = SWARM.canvas ? SWARM.canvas.height : 320;
  for (let i = 0; i < n; i++) SWARM.nodes.push(new SwarmNode(i, 40 + Math.random() * (w-80), 40 + Math.random() * (h-80), SWARM.colors[i % SWARM.colors.length]));
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function swarmSetFormation(type) {
  const w = SWARM.canvas ? SWARM.canvas.width : 400, h = SWARM.canvas ? SWARM.canvas.height : 320;
  const cx = w/2, cy = h/2, n = SWARM.nodes.length;
  SWARM.nodes.forEach((nd, i) => {
    switch (type) {
      case 'line': nd.tx = 60 + (w-120) * (i / Math.max(n-1,1)); nd.ty = cy; break;
      case 'circle': { const a = (2*Math.PI*i)/n, r = Math.min(w,h)*0.35; nd.tx = cx + r*Math.cos(a); nd.ty = cy + r*Math.sin(a); break; }
      case 'vshape': { const half = Math.floor(n/2); if (i===0) { nd.tx = cx; nd.ty = cy-60; } else if (i<=half) { nd.tx = cx-i*40; nd.ty = cy-60+i*30; } else { nd.tx = cx+(i-half)*40; nd.ty = cy-60+(i-half)*30; } break; }
      case 'grid': { const cols = Math.ceil(Math.sqrt(n)); const gx = i%cols, gy = Math.floor(i/cols), sp = 50; nd.tx = cx-(cols-1)*sp/2+gx*sp; nd.ty = cy-(Math.ceil(n/cols)-1)*sp/2+gy*sp; break; }
      default: nd.tx = 40+Math.random()*(w-80); nd.ty = 40+Math.random()*(h-80);
    }
  });
}

function swarmCmd() {
  const input = $('cmdInput'); if (!input) return;
  const cmd = input.value.trim().toLowerCase(); input.value = ''; if (!cmd) return;
  const s = LANG[currentLang]; log(`📤 TX CMD: "${cmd}"`, 'tx'); SWARM.msgCount++;
  switch (cmd) {
    case 'rotate': SWARM.rotating = !SWARM.rotating; SWARM.halted = false; log(`🔄 ${s.cmdRotate}`, 'success'); break;
    case 'halt': SWARM.halted = true; SWARM.rotating = false; SWARM.patrolling = false; log(`🛑 ${s.cmdHalt}`, 'info'); break;
    case 'patrol': SWARM.patrolling = true; SWARM.halted = false; SWARM.patrolIdx = 0; log(`🔍 ${s.cmdPatrol}`, 'success'); break;
    case 'scatter': SWARM.formation = 'scatter'; SWARM.halted = false; SWARM.rotating = false; SWARM.patrolling = false; swarmSetFormation('scatter'); document.querySelectorAll('[data-formation]').forEach(b => b.classList.toggle('active', b.dataset.formation === 'scatter')); log(`💨 ${s.formationChanged} ${s.fScatter}`, 'tx'); break;
    case 'rally': { const w = SWARM.canvas.width, h = SWARM.canvas.height; SWARM.rallyPoint = {x:w/2,y:h/2}; SWARM.nodes.forEach(n => { n.tx = w/2+(Math.random()-.5)*30; n.ty = h/2+(Math.random()-.5)*30; }); SWARM.halted = false; log(`📍 ${s.cmdRally}`, 'success'); break; }
    default: log(`❓ ${s.cmdUnknown}: "${cmd}"`, 'error');
  }
  updateTelemetry(); playSound('click');
}

function updateTelemetry() {
  const s = LANG[currentLang];
  const tf = $('teleFormation'), tn = $('teleNodes'), tm = $('teleMessages'), tc = $('teleCoherence');
  if (tf) tf.textContent = s['f' + cap(SWARM.formation)] || SWARM.formation;
  if (tn) tn.textContent = SWARM.nodes.length;
  if (tm) tm.textContent = SWARM.msgCount;
  let td = 0; SWARM.nodes.forEach(n => { td += Math.hypot(n.x-n.tx, n.y-n.ty); });
  if (tc) tc.textContent = Math.max(0, Math.round((1 - td/(SWARM.nodes.length*200))*100)) + '%';
}

function swarmRender() {
  let last = 0;
  function frame(time) {
    const dt = Math.min((time - last) / 16, 3); last = time;
    if (!SWARM.halted) {
      const spd = SWARM.speed * 0.8 * dt;
      const w = SWARM.canvas ? SWARM.canvas.width : 400, h = SWARM.canvas ? SWARM.canvas.height : 320;
      if (SWARM.rotating) { SWARM.rotationAngle += 0.02*dt; const cx = w/2, cy = h/2; SWARM.nodes.forEach((nd,i) => { const a = (2*Math.PI*i)/SWARM.nodes.length + SWARM.rotationAngle, r = Math.min(w,h)*0.3; nd.tx = cx+r*Math.cos(a); nd.ty = cy+r*Math.sin(a); }); }
      if (SWARM.patrolling) { const pts = [{x:w*.2,y:h*.2},{x:w*.8,y:h*.2},{x:w*.8,y:h*.8},{x:w*.2,y:h*.8}]; const tgt = pts[SWARM.patrolIdx%pts.length]; let allC = true; SWARM.nodes.forEach((n,i) => { n.tx = tgt.x+(i-SWARM.nodes.length/2)*20; n.ty = tgt.y; if (Math.hypot(n.x-n.tx,n.y-n.ty)>15) allC = false; }); if (allC) { SWARM.patrolIdx++; SWARM.msgCount++; } }
      SWARM.nodes.forEach(n => { const dx = n.tx-n.x, dy = n.ty-n.y, d = Math.hypot(dx,dy); if (d>1) { n.x += (dx/d)*spd; n.y += (dy/d)*spd; } n.trail.push({x:n.x,y:n.y}); if (n.trail.length>15) n.trail.shift(); });
      updateTelemetry();
    }
    swarmDraw();
    SWARM.animFrame = requestAnimationFrame(frame);
  }
  SWARM.animFrame = requestAnimationFrame(frame);
}

function swarmDraw() {
  const ctx = SWARM.ctx; if (!ctx||!SWARM.canvas) return;
  const w = SWARM.canvas.width, h = SWARM.canvas.height;
  ctx.clearRect(0,0,w,h);
  const textCol = getComputedStyle(document.documentElement).getPropertyValue('--text').trim()||'#e4ddd0';
  const mutedCol = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim()||'#8a7e6e';

  // Communication lines
  for (let i = 0; i < SWARM.nodes.length; i++) for (let j = i+1; j < SWARM.nodes.length; j++) {
    const a = SWARM.nodes[i], b = SWARM.nodes[j], d = Math.hypot(a.x-b.x,a.y-b.y);
    if (d<150) { ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle = mutedCol + Math.round((1-d/150)*40).toString(16).padStart(2,'0'); ctx.lineWidth = 0.8; ctx.stroke(); }
  }

  // Trails
  SWARM.nodes.forEach(n => { if (n.trail.length<2) return; ctx.beginPath(); ctx.moveTo(n.trail[0].x,n.trail[0].y); for (let i=1;i<n.trail.length;i++) ctx.lineTo(n.trail[i].x,n.trail[i].y); ctx.strokeStyle = n.color+'30'; ctx.lineWidth = 2; ctx.stroke(); });

  // Rally point
  if (SWARM.rallyPoint) { ctx.beginPath(); ctx.arc(SWARM.rallyPoint.x,SWARM.rallyPoint.y,8+Math.sin(Date.now()/300)*3,0,Math.PI*2); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.setLineDash([3,3]); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = '#ef444440'; ctx.fill(); }

  // Nodes
  SWARM.nodes.forEach(n => {
    ctx.beginPath(); ctx.arc(n.x,n.y,n.radius+4,0,Math.PI*2); ctx.fillStyle = n.color+'15'; ctx.fill();
    ctx.beginPath(); ctx.arc(n.x,n.y,n.radius,0,Math.PI*2); ctx.fillStyle = n.color+'40'; ctx.fill(); ctx.strokeStyle = n.color; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = 'bold 10px Tajawal,sans-serif'; ctx.fillStyle = textCol; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(String.fromCharCode(65+n.id), n.x, n.y);
  });

  // ESP-NOW pulse
  if (Date.now()%2000<100) { const s = SWARM.nodes[Math.floor(Math.random()*SWARM.nodes.length)]; if (s) { ctx.beginPath(); ctx.arc(s.x,s.y,25,0,Math.PI*2); ctx.strokeStyle = s.color+'60'; ctx.lineWidth = 1; ctx.stroke(); } }
}

/* ═══════ INIT ═══════ */

function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();
  const hBtn = $('helpBtn'), hC = $('helpCloseBtn'), hO = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp; if (hC) hC.onclick = closeHelp; if (hO) hO.onclick = closeHelp;
  initHelpTabs();
  const sBtn = $('settingsBtn'), sC = $('settingsCloseBtn'), sO = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings; if (sC) sC.onclick = closeSettings; if (sO) sO.onclick = closeSettings;
  const lBtn = $('logBtn'), lC = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog; if (lC) lC.onclick = closeLog;
  initLogResize();
  const sndT = $('soundToggle');
  if (sndT) { try { soundEnabled = localStorage.getItem('wdiy-sound')==='true'; } catch {} sndT.checked = soundEnabled; sndT.addEventListener('change', () => { soundEnabled = sndT.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} if (soundEnabled) playSound('click'); }); }
  const brBtn = $('breathingBtn'), dkD = $('dhikrDisplay'), dkB = $('dhikrBtn');
  if (brBtn) brBtn.onclick = () => { toggleBreathing(); if (dkD) dkD.style.display = breathingActive ? 'flex' : 'none'; };
  if (dkB) dkB.onclick = incrementDhikr;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); });
  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));
  try { const sl = localStorage.getItem('wdiy-lang'), st = localStorage.getItem('wdiy-theme'); if (st) setTheme(st); if (sl) setLanguage(sl); } catch {}
  initKonami(); initMatrixTrigger(); initHijriDate();
  swarmInit(); setStatus(true);
  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Swarm Net: ESP-NOW fleet coordination
   with swarm agents, formation patterns, and mesh communication
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const bots=[],msgs=[],trails=[];let formation='scatter',msgCount=0;

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#060810;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  class Bot{
    constructor(x,y,id){this.x=x;this.y=y;this.id=id;this.tx=x;this.ty=y;this.vx=0;this.vy=0;
      this.hue=200+Math.random()*60;this.pulse=Math.random()*Math.PI*2;this.trail=[];}
    update(){
      const dx=this.tx-this.x,dy=this.ty-this.y;this.vx+=(dx*0.01-this.vx*0.05);this.vy+=(dy*0.01-this.vy*0.05);
      this.x+=this.vx;this.y+=this.vy;this.pulse+=0.04;
      this.trail.push({x:this.x,y:this.y,alpha:1});if(this.trail.length>20)this.trail.shift();
      this.trail.forEach(t=>t.alpha-=0.03);
    }
    draw(){
      // Trail
      this.trail.forEach(t=>{if(t.alpha<=0)return;ctx.beginPath();ctx.arc(t.x,t.y,2,0,Math.PI*2);ctx.fillStyle='hsla('+this.hue+',70%,60%,'+(t.alpha*0.2)+')';ctx.fill();});
      const glow=3+Math.sin(this.pulse)*2;ctx.save();ctx.shadowColor='hsl('+this.hue+',80%,60%)';ctx.shadowBlur=glow;
      ctx.beginPath();ctx.arc(this.x,this.y,8,0,Math.PI*2);ctx.fillStyle='hsla('+this.hue+',60%,50%,0.3)';ctx.fill();
      ctx.strokeStyle='hsl('+this.hue+',80%,60%)';ctx.lineWidth=1.5;ctx.stroke();ctx.shadowBlur=0;
      ctx.font='6px monospace';ctx.textAlign='center';ctx.fillStyle='hsl('+this.hue+',80%,70%)';ctx.fillText('B'+this.id,this.x,this.y+14);ctx.restore();
    }
  }

  class Msg{
    constructor(src,tgt){this.sx=src.x;this.sy=src.y;this.tx=tgt.x;this.ty=tgt.y;this.progress=0;this.alive=true;}
    update(){this.progress+=0.04;if(this.progress>=1)this.alive=false;return this.alive;}
    draw(){
      const px=this.sx+(this.tx-this.sx)*this.progress,py=this.sy+(this.ty-this.sy)*this.progress;
      ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);ctx.fillStyle='rgba(255,217,61,'+(1-this.progress)+')';ctx.fill();
    }
  }

  function drawMesh(){
    for(let i=0;i<bots.length;i++)for(let j=i+1;j<bots.length;j++){
      const dx=bots[i].x-bots[j].x,dy=bots[i].y-bots[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<100){ctx.beginPath();ctx.moveTo(bots[i].x,bots[i].y);ctx.lineTo(bots[j].x,bots[j].y);
        ctx.strokeStyle='rgba(100,200,255,'+(0.15*(1-d/100))+')';ctx.lineWidth=1;ctx.stroke();}
    }
  }

  function setFormation(){
    const formations=['circle','grid','scatter','vee'];
    formation=formations[Math.floor(Math.random()*formations.length)];
    const cx=W/2,cy=H/2;
    bots.forEach((b,i)=>{
      if(formation==='circle'){const a=Math.PI*2/bots.length*i;b.tx=cx+Math.cos(a)*80;b.ty=cy+Math.sin(a)*80;}
      else if(formation==='grid'){const cols=Math.ceil(Math.sqrt(bots.length));b.tx=cx-60+(i%cols)*30;b.ty=cy-60+Math.floor(i/cols)*30;}
      else if(formation==='vee'){b.tx=cx+i*15-bots.length*7;b.ty=cy-Math.abs(i-bots.length/2)*15;}
      else{b.tx=40+Math.random()*(W-80);b.ty=40+Math.random()*(H-80);}
    });
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,185,68);ctx.strokeStyle='#0cf3';ctx.strokeRect(8,8,185,68);
    ctx.font='10px monospace';ctx.fillStyle='#00ccff';ctx.textAlign='left';ctx.fillText('SWARM NET',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Bots: '+bots.length+'  Formation: '+formation,16,40);
    ctx.fillText('Messages: '+msgCount,16,54);ctx.fillText('Frame: '+frameCount,16,68);ctx.restore();
  }

  function init(){
    ensureCanvas();
    for(let i=0;i<12;i++)bots.push(new Bot(W/2+(Math.random()-0.5)*100,H/2+(Math.random()-0.5)*100,i));
    setFormation();animate();
  }

  function animate(){
    frameCount++;ctx.fillStyle='rgba(6,8,16,0.12)';ctx.fillRect(0,0,W,H);
    drawMesh();bots.forEach(b=>{b.update();b.draw();});
    // Random ESP-NOW messages
    if(frameCount%15===0&&bots.length>1){const a=bots[Math.floor(Math.random()*bots.length)];let b;do{b=bots[Math.floor(Math.random()*bots.length)];}while(b===a);msgs.push(new Msg(a,b));msgCount++;}
    for(let i=msgs.length-1;i>=0;i--){if(!msgs[i].update())msgs.splice(i,1);else msgs[i].draw();}
    if(frameCount%300===0)setFormation();
    drawHUD();animId=requestAnimationFrame(animate);
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
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬', target:'#settingsCloseBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary action button to start. Watch the visualization respond in real time! ⚡', target:'#whisperBtn', delay:3000},
  {i18n:'demo_s3', text:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄', target:'#breathingBtn', delay:3000},
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
