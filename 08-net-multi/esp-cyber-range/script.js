/**
 * Workshop DIY — Cyber Range v1.0
 * Red vs Blue — Attack/Defense Training Simulator
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7h-126.8v3.6h126.8z"/><path style="stroke:none;fill:currentColor" d="M330.8,203.4h-169.1v3.6h169.1z"/><path style="stroke:none;fill:currentColor" d="M330.8,211h-253.7v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.08);o.start(c);o.stop(c+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.3);o.start(c);o.stop(c+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+0.25);o.start(c);o.stop(c+0.25);}}

const LANG={
en:{
title:'Cyber Range',subtitle:'⚔️ red team · 🛡️ blue team · 🏢 network',
disconnected:'Disconnected',connected:'Connected',
mainSection:'Cyber Range — Red vs Blue',mainDesc:'Physical network for attack/defense training',
sectionA:'How It Works',sectionB:'Lab',sectionC:'Challenge',
activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
howto_1:'Use Red Team buttons to launch attacks against the corporate network.',
howto_2:'Use Blue Team buttons to deploy defenses before or after attacks.',
howto_3:'Watch the canvas for attack animations and the event feed for details.',
howto_4:'Try to outscore the opposing team by timing attacks and defenses.',
wiki_red_title:'⚔️ Red Team',wiki_red:'Red teams simulate real attackers using reconnaissance, exploitation, and lateral movement.',
wiki_blue_title:'🛡️ Blue Team',wiki_blue:'Blue teams defend using firewalls, IDS, patching, segmentation, and incident response.',
wiki_ids_title:'🔍 Intrusion Detection',wiki_ids:'IDS monitors network traffic patterns and signatures to detect attacks.',
wiki_seg_title:'🔒 Network Segmentation',wiki_seg:'Segmentation divides a network into isolated zones to contain breaches.',
working:'Working…',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
ready:'⚔️ Cyber Range ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
soundEffects:'🔊 Sound effects',breathingGuide:'Breathing guide',dhikrTap:'Tap',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
redTeam:'Red Team',blueTeam:'Blue Team',
redTools:'Red Team — Attack',blueTools:'Blue Team — Defend',
atkPortScan:'Port Scan',atkExploit:'Exploit Vulnerability',atkLateral:'Lateral Movement',atkExfil:'Data Exfiltration',
defFirewall:'Enable Firewall',defIDS:'Deploy IDS',defPatch:'Patch Systems',defIsolate:'Isolate Segment',
step1:'The corporate network has servers, workstations, and a database connected through switches and routers.',
step2:'Red Team launches attacks: port scanning, exploiting vulnerabilities, and lateral movement.',
step3:'Blue Team defends: firewalls, IDS, patching, and isolating compromised segments.',
step4:'Points are scored for successful attacks and defenses. Highest score wins.',
labTip1:'Start by enabling the firewall (Blue) before Red Team attacks.',
labTip2:'Launch a port scan (Red) to discover open services, then exploit.',
labTip3:'Deploy IDS (Blue) to detect lateral movement.',
labTip4:'Watch the event feed for real-time notifications.',
challenge1:'As Red Team, exfiltrate data without Blue Team detecting you.',
challenge2:'As Blue Team, defend all assets with a perfect score.',
challenge3:'Play both sides: launch an attack, then counter it with the right defense.',
atkPortScanOK:'Port scan found 3 open ports on web server',atkPortScanBlocked:'Port scan blocked by firewall!',
atkExploitOK:'Exploited CVE-2024-1234 on web server!',atkExploitBlocked:'Exploit failed — systems are patched!',
atkLateralOK:'Moved laterally to database server',atkLateralBlocked:'Lateral movement detected by IDS!',
atkExfilOK:'Data exfiltrated: 2.3 GB stolen!',atkExfilBlocked:'Exfiltration blocked — segment isolated!',
defFirewallOK:'Firewall enabled — blocking unauthorized traffic',defIDSOK:'IDS deployed — monitoring for anomalies',
defPatchOK:'All systems patched — vulnerabilities closed',defIsolateOK:'Network segment isolated — containment active',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It lets you see how computer networks talk to each other! 🌐 Like X-ray vision for internet traffic.',faq_q2:'How does it work?',faq_a2:'The simulation shows real network protocols — the rules that computers follow to send data across the internet.',faq_q3:'What should I try first?',faq_a3:'Start a scan and watch the packets fly! 📡 Each colored packet is a different type of network message.',faq_q4:'What\'s the real science?',faq_a4:'This is how the entire internet works! TCP/IP, DNS, ARP — these protocols power every website you visit. 🌍',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! See what happens when you inject bad packets or flood the network. That\'s network security! 🛡️',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Totally safe! 🛡️ This is a simulation — no real network traffic. Everything stays in your browser.',faq_q8:'What should I try next?',faq_a8:'Try Esp Swarm Net and Esp Internet Simulator! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',learnAge:'Ages:'},
fr:{
title:'Cyber Range',subtitle:'⚔️ équipe rouge · 🛡️ équipe bleue · 🏢 réseau',
disconnected:'Déconnecté',connected:'Connecté',
mainSection:'Cyber Range — Rouge vs Bleu',mainDesc:'Réseau physique pour entraînement attaque/défense',
sectionA:'Comment ça marche',sectionB:'Labo',sectionC:'Défi',
activityLog:'Journal',eventsMsg:'Événements',clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
settings:'⚙️ Paramètres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
howto_1:'Utilisez les boutons Équipe Rouge pour lancer des attaques.',howto_2:'Utilisez les boutons Équipe Bleue pour déployer des défenses.',
howto_3:'Regardez le canevas et le flux d\'événements.',howto_4:'Essayez de surpasser l\'équipe adverse.',
wiki_red_title:'⚔️ Équipe Rouge',wiki_red:'Les équipes rouges simulent de vrais attaquants.',
wiki_blue_title:'🛡️ Équipe Bleue',wiki_blue:'Les équipes bleues défendent avec pare-feu, IDS, correctifs.',
wiki_ids_title:'🔍 Détection d\'Intrusion',wiki_ids:'L\'IDS surveille le trafic pour détecter les attaques.',
wiki_seg_title:'🔒 Segmentation',wiki_seg:'La segmentation divise un réseau en zones isolées.',
working:'En cours…',
t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
ready:'⚔️ Cyber Range prêt !',logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
soundEffects:'🔊 Effets sonores',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',
redTeam:'Équipe Rouge',blueTeam:'Équipe Bleue',
redTools:'Équipe Rouge — Attaque',blueTools:'Équipe Bleue — Défense',
atkPortScan:'Scan de Ports',atkExploit:'Exploiter Vulnérabilité',atkLateral:'Mouvement Latéral',atkExfil:'Exfiltration de Données',
defFirewall:'Activer Pare-feu',defIDS:'Déployer IDS',defPatch:'Patcher Systèmes',defIsolate:'Isoler Segment',
step1:'Le réseau d\'entreprise a des serveurs, postes de travail et base de données connectés.',
step2:'L\'Équipe Rouge lance des attaques : scan de ports, exploitation, mouvement latéral.',
step3:'L\'Équipe Bleue défend : pare-feu, IDS, correctifs, isolation des segments.',
step4:'Des points sont marqués pour les attaques et défenses réussies.',
labTip1:'Commencez par activer le pare-feu avant les attaques.',labTip2:'Lancez un scan de ports pour découvrir les services.',
labTip3:'Déployez l\'IDS pour détecter le mouvement latéral.',labTip4:'Regardez le flux d\'événements en temps réel.',
challenge1:'En tant qu\'Équipe Rouge, exfiltrez des données sans être détecté.',
challenge2:'En tant qu\'Équipe Bleue, défendez avec un score parfait.',
challenge3:'Jouez les deux côtés : attaquez puis contrez avec la bonne défense.',
atkPortScanOK:'Scan trouvé 3 ports ouverts sur le serveur web',atkPortScanBlocked:'Scan bloqué par le pare-feu !',
atkExploitOK:'CVE-2024-1234 exploité sur le serveur !',atkExploitBlocked:'Exploit échoué — systèmes patchés !',
atkLateralOK:'Mouvement latéral vers le serveur de base de données',atkLateralBlocked:'Mouvement latéral détecté par l\'IDS !',
atkExfilOK:'Données exfiltrées : 2.3 Go volés !',atkExfilBlocked:'Exfiltration bloquée — segment isolé !',
defFirewallOK:'Pare-feu activé — trafic non autorisé bloqué',defIDSOK:'IDS déployé — surveillance des anomalies',
defPatchOK:'Systèmes patchés — vulnérabilités fermées',defIsolateOK:'Segment réseau isolé — confinement actif',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle te permet de voir comment les réseaux communiquent ! 🌐 Comme une vision aux rayons X du trafic internet.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Esp Swarm Net and Esp Internet Simulator ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',learnAge:'Âge :'},
ar:{
title:'ميدان السيبراني',subtitle:'⚔️ فريق أحمر · 🛡️ فريق أزرق · 🏢 شبكة',
disconnected:'غير متصل',connected:'متصل',
mainSection:'الميدان السيبراني — أحمر ضد أزرق',mainDesc:'شبكة فيزيائية للتدريب على الهجوم والدفاع',
sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',
activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
howto_1:'استخدم أزرار الفريق الأحمر لشن الهجمات.',howto_2:'استخدم أزرار الفريق الأزرق لنشر الدفاعات.',
howto_3:'شاهد اللوحة وتغذية الأحداث.',howto_4:'حاول التفوق على الفريق المنافس.',
wiki_red_title:'⚔️ الفريق الأحمر',wiki_red:'الفرق الحمراء تحاكي المهاجمين الحقيقيين.',
wiki_blue_title:'🛡️ الفريق الأزرق',wiki_blue:'الفرق الزرقاء تدافع بالجدران النارية وأنظمة كشف التسلل والتحديثات.',
wiki_ids_title:'🔍 كشف التسلل',wiki_ids:'نظام كشف التسلل يراقب أنماط حركة المرور للكشف عن الهجمات.',
wiki_seg_title:'🔒 تجزئة الشبكة',wiki_seg:'التجزئة تقسم الشبكة إلى مناطق معزولة لاحتواء الاختراقات.',
working:'جارٍ…',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
ready:'⚔️ الميدان السيبراني جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
soundEffects:'🔊 مؤثرات صوتية',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
redTeam:'الفريق الأحمر',blueTeam:'الفريق الأزرق',
redTools:'الفريق الأحمر — هجوم',blueTools:'الفريق الأزرق — دفاع',
atkPortScan:'مسح المنافذ',atkExploit:'استغلال ثغرة',atkLateral:'حركة جانبية',atkExfil:'تسريب بيانات',
defFirewall:'تفعيل الجدار الناري',defIDS:'نشر نظام كشف التسلل',defPatch:'تحديث الأنظمة',defIsolate:'عزل القطاع',
step1:'شبكة الشركة تحتوي على خوادم ومحطات عمل وقاعدة بيانات.',
step2:'الفريق الأحمر يشن هجمات: مسح منافذ واستغلال ثغرات وحركة جانبية.',
step3:'الفريق الأزرق يدافع: جدران نارية وأنظمة كشف تسلل وتحديثات وعزل.',
step4:'يتم تسجيل نقاط للهجمات والدفاعات الناجحة.',
labTip1:'ابدأ بتفعيل الجدار الناري قبل الهجمات.',labTip2:'أطلق مسح منافذ لاكتشاف الخدمات.',
labTip3:'انشر نظام كشف التسلل للكشف عن الحركة الجانبية.',labTip4:'راقب تغذية الأحداث.',
challenge1:'كفريق أحمر، سرّب بيانات دون أن يكتشفك الفريق الأزرق.',
challenge2:'كفريق أزرق، ادفع بنتيجة مثالية بدون هجمات ناجحة.',
challenge3:'العب الجانبين: اشن هجومًا ثم صدّه بالدفاع المناسب.',
atkPortScanOK:'مسح المنافذ وجد 3 منافذ مفتوحة',atkPortScanBlocked:'مسح المنافذ حُظر بالجدار الناري!',
atkExploitOK:'تم استغلال CVE-2024-1234!',atkExploitBlocked:'فشل الاستغلال — الأنظمة محدّثة!',
atkLateralOK:'حركة جانبية نحو خادم قاعدة البيانات',atkLateralBlocked:'حركة جانبية كُشفت بنظام كشف التسلل!',
atkExfilOK:'تم تسريب 2.3 جيجابايت!',atkExfilBlocked:'التسريب حُظر — القطاع معزول!',
defFirewallOK:'الجدار الناري مُفعّل — حظر حركة المرور غير المصرح بها',defIDSOK:'نظام كشف التسلل مُنشر — مراقبة الشذوذ',
defPatchOK:'جميع الأنظمة محدّثة — الثغرات مُغلقة',defIsolateOK:'قطاع الشبكة معزول — الاحتواء نشط',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يتيح لك رؤية كيف تتحدث الشبكات! 🌐 مثل رؤية بالأشعة السينية لحركة الإنترنت.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Esp Swarm Net and Esp Internet Simulator! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',learnAge:'العمر:'}};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
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
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
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

/* ═══════ CYBER RANGE SIMULATION ═══════ */

const RANGE_NODES = [
  {id:'internet',label:'Internet',icon:'🌐',color:'#8a7e6e',x:0.08,y:0.15},
  {id:'fw',label:'Firewall',icon:'🛡️',color:'#f97316',x:0.25,y:0.15},
  {id:'router',label:'Router',icon:'🔀',color:'#a3e635',x:0.45,y:0.15},
  {id:'switch1',label:'Switch A',icon:'🔌',color:'#22d3ee',x:0.35,y:0.5},
  {id:'switch2',label:'Switch B',icon:'🔌',color:'#22d3ee',x:0.65,y:0.5},
  {id:'web',label:'Web Server',icon:'🖥️',color:'#3b82f6',x:0.20,y:0.82},
  {id:'workstation',label:'Workstation',icon:'💻',color:'#c084fc',x:0.45,y:0.82},
  {id:'db',label:'Database',icon:'🗄️',color:'#ef4444',x:0.70,y:0.82},
  {id:'ids',label:'IDS',icon:'🔍',color:'#facc15',x:0.88,y:0.35},
];

const RANGE_LINKS = [
  ['internet','fw'],['fw','router'],['router','switch1'],['router','switch2'],
  ['switch1','web'],['switch1','workstation'],['switch2','db'],['switch2','ids'],
];

let rangeCanvas, rangeCtx;
let redScore = 0, blueScore = 0;
let defenses = { firewall: false, ids: false, patch: false, isolate: false };
let attackAnims = []; // {from, to, progress, color, label}

function rangeInit() {
  rangeCanvas = $('rangeCanvas'); if (!rangeCanvas) return;
  rangeCtx = rangeCanvas.getContext('2d');
  rangeResize(); window.addEventListener('resize', rangeResize);

  // Red team buttons
  document.querySelectorAll('[data-attack]').forEach(btn => {
    btn.addEventListener('click', () => { handleAttack(btn.dataset.attack); playSound('click'); });
  });

  // Blue team buttons
  document.querySelectorAll('[data-defend]').forEach(btn => {
    btn.addEventListener('click', () => { handleDefense(btn.dataset.defend); playSound('click'); });
  });

  rangeRender();
}

function rangeResize() {
  if (!rangeCanvas) return;
  const r = rangeCanvas.parentElement.getBoundingClientRect();
  rangeCanvas.width = r.width - 2; rangeCanvas.height = 250;
}

function handleAttack(type) {
  const s = LANG[currentLang];
  let success = false, msg = '';

  switch (type) {
    case 'portscan':
      success = !defenses.firewall;
      msg = success ? s.atkPortScanOK : s.atkPortScanBlocked;
      addAnim('internet', 'web', success ? '#ef4444' : '#8a7e6e');
      break;
    case 'exploit':
      success = !defenses.patch;
      msg = success ? s.atkExploitOK : s.atkExploitBlocked;
      addAnim('internet', 'web', success ? '#ef4444' : '#8a7e6e');
      break;
    case 'lateral':
      success = !defenses.ids;
      msg = success ? s.atkLateralOK : s.atkLateralBlocked;
      addAnim('web', 'db', success ? '#ef4444' : '#8a7e6e');
      break;
    case 'exfil':
      success = !defenses.isolate;
      msg = success ? s.atkExfilOK : s.atkExfilBlocked;
      addAnim('db', 'internet', success ? '#ef4444' : '#8a7e6e');
      break;
  }

  if (success) { redScore += 10; log(`⚔️ ${msg}`, 'error'); }
  else { blueScore += 5; log(`🛡️ ${msg}`, 'success'); }

  addEvent(msg, success ? 'event-red' : 'event-blue');
  updateScores();
}

function handleDefense(type) {
  const s = LANG[currentLang];
  defenses[type] = true;
  let msg = '';
  switch (type) {
    case 'firewall': msg = s.defFirewallOK; addAnim('fw', 'router', '#3b82f6'); break;
    case 'ids': msg = s.defIDSOK; addAnim('ids', 'switch2', '#facc15'); break;
    case 'patch': msg = s.defPatchOK; addAnim('router', 'web', '#22c55e'); break;
    case 'isolate': msg = s.defIsolateOK; addAnim('switch2', 'db', '#3b82f6'); break;
  }
  blueScore += 5;
  log(`🛡️ ${msg}`, 'success');
  addEvent(msg, 'event-blue');
  updateScores();
}

function addAnim(fromId, toId, color) {
  attackAnims.push({ fromId, toId, progress: 0, color, startTime: Date.now() });
}

function addEvent(text, cls) {
  const feed = $('eventFeed'); if (!feed) return;
  const div = document.createElement('div');
  div.className = cls;
  div.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

function updateScores() {
  const rs = $('redScore'), bs = $('blueScore');
  if (rs) rs.textContent = redScore;
  if (bs) bs.textContent = blueScore;
}

function rangeRender() {
  function frame() { rangeDraw(); requestAnimationFrame(frame); }
  requestAnimationFrame(frame);
}

function rangeDraw() {
  const ctx = rangeCtx; if (!ctx || !rangeCanvas) return;
  const w = rangeCanvas.width, h = rangeCanvas.height;
  ctx.clearRect(0, 0, w, h);
  const textCol = getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#e4ddd0';
  const mutedCol = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8a7e6e';

  // Links
  RANGE_LINKS.forEach(([aId, bId]) => {
    const a = RANGE_NODES.find(n => n.id === aId), b = RANGE_NODES.find(n => n.id === bId);
    if (!a || !b) return;
    ctx.beginPath(); ctx.moveTo(a.x * w, a.y * h); ctx.lineTo(b.x * w, b.y * h);
    ctx.strokeStyle = mutedCol + '30'; ctx.lineWidth = 2; ctx.stroke();
  });

  // Defense indicators
  if (defenses.firewall) { const n = RANGE_NODES.find(n => n.id === 'fw'); ctx.beginPath(); ctx.arc(n.x*w, n.y*h, 24, 0, Math.PI*2); ctx.strokeStyle = '#3b82f680'; ctx.lineWidth = 3; ctx.setLineDash([4,3]); ctx.stroke(); ctx.setLineDash([]); }
  if (defenses.ids) { const n = RANGE_NODES.find(n => n.id === 'ids'); ctx.beginPath(); ctx.arc(n.x*w, n.y*h, 24, 0, Math.PI*2); ctx.strokeStyle = '#facc1580'; ctx.lineWidth = 3; ctx.setLineDash([4,3]); ctx.stroke(); ctx.setLineDash([]); }

  // Nodes
  RANGE_NODES.forEach(node => {
    const px = node.x * w, py = node.y * h;
    ctx.beginPath(); ctx.arc(px, py, 18, 0, Math.PI * 2);
    ctx.fillStyle = node.color + '25'; ctx.fill();
    ctx.strokeStyle = node.color; ctx.lineWidth = 2; ctx.stroke();
    ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(node.icon, px, py);
    ctx.font = 'bold 8px Tajawal, sans-serif'; ctx.fillStyle = textCol;
    ctx.fillText(node.label, px, py + 26);
  });

  // Attack/defense animations
  const now = Date.now();
  attackAnims = attackAnims.filter(a => {
    const elapsed = (now - a.startTime) / 1000;
    if (elapsed > 1.5) return false;
    const progress = Math.min(elapsed / 1.0, 1);
    const from = RANGE_NODES.find(n => n.id === a.fromId);
    const to = RANGE_NODES.find(n => n.id === a.toId);
    if (!from || !to) return false;
    const fx = from.x * w, fy = from.y * h, tx = to.x * w, ty = to.y * h;
    const px = fx + (tx - fx) * progress, py = fy + (ty - fy) * progress;
    ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fillStyle = a.color; ctx.fill();
    ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2);
    ctx.fillStyle = a.color + '30'; ctx.fill();
    return true;
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
  rangeInit();setStatus(true);
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Cyber Range: Red vs Blue attack/defense
   training with network topology and live attack animations
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const netNodes=[],attacks=[],defenses=[],particles=[];
  let redScore=0,blueScore=0;

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:340px;border-radius:12px;margin:1.2rem 0;display:block;background:#080810;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  const NODE_TYPES=[
    {name:'Firewall',icon:'\u{1F6E1}',color:'#4d96ff'},
    {name:'Web Server',icon:'\u{1F5A5}',color:'#6bcb77'},
    {name:'Database',icon:'\u{1F4BE}',color:'#ffd93d'},
    {name:'Router',icon:'\u{1F500}',color:'#00ccff'},
    {name:'Workstation',icon:'\u{1F4BB}',color:'#ff78ae'},
    {name:'IDS',icon:'\u{1F50D}',color:'#e879f9'}
  ];

  class NetNode{
    constructor(x,y,type){this.x=x;this.y=y;this.type=type;this.shieldActive=false;this.shieldTimer=0;this.compromised=false;this.pulse=Math.random()*Math.PI*2;}
    draw(){
      this.pulse+=0.03;const glow=4+Math.sin(this.pulse)*2;
      ctx.save();
      if(this.compromised){ctx.shadowColor='#ff4444';ctx.shadowBlur=glow+4;}
      else if(this.shieldActive){ctx.shadowColor='#4d96ff';ctx.shadowBlur=glow+6;}
      else{ctx.shadowColor=this.type.color;ctx.shadowBlur=glow;}
      ctx.beginPath();ctx.arc(this.x,this.y,20,0,Math.PI*2);
      ctx.fillStyle=this.compromised?'rgba(255,40,40,0.2)':this.shieldActive?'rgba(77,150,255,0.2)':'rgba(255,255,255,0.05)';
      ctx.fill();ctx.strokeStyle=this.compromised?'#ff4444':this.shieldActive?'#4d96ff':this.type.color;ctx.lineWidth=2;ctx.stroke();
      if(this.shieldActive){ctx.beginPath();ctx.arc(this.x,this.y,26,0,Math.PI*2);ctx.strokeStyle='rgba(77,150,255,0.4)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);this.shieldTimer--;if(this.shieldTimer<=0)this.shieldActive=false;}
      ctx.shadowBlur=0;ctx.font='16px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(this.type.icon,this.x,this.y);
      ctx.font='7px monospace';ctx.fillStyle=this.type.color;ctx.fillText(this.type.name,this.x,this.y+28);ctx.restore();
    }
  }

  class Attack{
    constructor(src,tgt){this.sx=src.x;this.sy=src.y;this.tx=tgt.x;this.ty=tgt.y;this.target=tgt;
      this.progress=0;this.speed=0.015+Math.random()*0.01;this.alive=true;
      this.type=['Port Scan','SQL Inject','Lateral Mv','Brute Force','XSS'][Math.floor(Math.random()*5)];
    }
    update(){
      this.progress+=this.speed;
      if(this.progress>=1){
        if(this.target.shieldActive){blueScore+=10;for(let i=0;i<8;i++)particles.push(new Particle(this.tx,this.ty,'#4d96ff'));}
        else{this.target.compromised=true;redScore+=10;for(let i=0;i<8;i++)particles.push(new Particle(this.tx,this.ty,'#ff4444'));setTimeout(()=>{this.target.compromised=false;},2000);}
        this.alive=false;
      }
      return this.alive;
    }
    draw(){
      const px=this.sx+(this.tx-this.sx)*this.progress,py=this.sy+(this.ty-this.sy)*this.progress;
      ctx.beginPath();ctx.moveTo(this.sx,this.sy);ctx.lineTo(px,py);
      ctx.strokeStyle='rgba(255,60,60,0.5)';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);ctx.fillStyle='#ff4444';ctx.fill();
      ctx.font='7px monospace';ctx.fillStyle='#ff6666';ctx.textAlign='center';ctx.fillText(this.type,px,py-10);
    }
  }

  class Particle{
    constructor(x,y,color){this.x=x;this.y=y;this.color=color;this.vx=(Math.random()-0.5)*4;this.vy=(Math.random()-0.5)*4;this.life=1;}
    update(){this.x+=this.vx;this.y+=this.vy;this.vx*=0.95;this.vy*=0.95;this.life-=0.03;return this.life>0;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,2*this.life,0,Math.PI*2);ctx.fillStyle=this.color+Math.floor(this.life*200).toString(16).padStart(2,'0');ctx.fill();}
  }

  function drawLinks(){
    for(let i=0;i<netNodes.length;i++)for(let j=i+1;j<netNodes.length;j++){
      const dx=netNodes[i].x-netNodes[j].x,dy=netNodes[i].y-netNodes[j].y;
      if(Math.sqrt(dx*dx+dy*dy)<160){ctx.beginPath();ctx.moveTo(netNodes[i].x,netNodes[i].y);ctx.lineTo(netNodes[j].x,netNodes[j].y);ctx.strokeStyle='rgba(100,100,200,0.08)';ctx.lineWidth=1;ctx.stroke();}
    }
  }

  function drawScoreboard(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,200,74);ctx.strokeStyle='#8884';ctx.strokeRect(8,8,200,74);
    ctx.font='10px monospace';ctx.textAlign='left';
    ctx.fillStyle='#ff4444';ctx.fillText('\u2694 RED TEAM: '+redScore,16,26);
    ctx.fillStyle='#4d96ff';ctx.fillText('\u{1F6E1} BLUE TEAM: '+blueScore,16,42);
    ctx.fillStyle='#aaa';ctx.fillText('Nodes: '+netNodes.length+'  Attacks: '+attacks.length,16,58);
    ctx.fillText('Frame: '+frameCount,16,72);ctx.restore();
  }

  function drawGrid(){ctx.strokeStyle='rgba(100,100,200,0.04)';ctx.lineWidth=1;for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}}

  function init(){
    ensureCanvas();
    const cx=W/2,cy=H/2;
    for(let i=0;i<NODE_TYPES.length;i++){const a=Math.PI*2/NODE_TYPES.length*i,r=80+Math.random()*40;netNodes.push(new NetNode(cx+Math.cos(a)*r,cy+Math.sin(a)*r,NODE_TYPES[i]));}
    for(let i=0;i<3;i++){const a=Math.random()*Math.PI*2,r=40+Math.random()*30;netNodes.push(new NetNode(cx+Math.cos(a)*r,cy+Math.sin(a)*r,NODE_TYPES[Math.floor(Math.random()*NODE_TYPES.length)]));}
    animate();
  }

  function animate(){
    frameCount++;ctx.fillStyle='rgba(8,8,16,0.15)';ctx.fillRect(0,0,W,H);drawGrid();drawLinks();
    netNodes.forEach(n=>n.draw());
    if(frameCount%120===0&&netNodes.length>1){const src=netNodes[Math.floor(Math.random()*netNodes.length)];let tgt;do{tgt=netNodes[Math.floor(Math.random()*netNodes.length)];}while(tgt===src);attacks.push(new Attack(src,tgt));}
    if(frameCount%90===0){const n=netNodes[Math.floor(Math.random()*netNodes.length)];n.shieldActive=true;n.shieldTimer=180;blueScore+=5;}
    for(let i=attacks.length-1;i>=0;i--){if(!attacks[i].update())attacks.splice(i,1);else attacks[i].draw();}
    for(let i=particles.length-1;i>=0;i--){if(!particles[i].update())particles.splice(i,1);else particles[i].draw();}
    drawScoreboard();animId=requestAnimationFrame(animate);
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
