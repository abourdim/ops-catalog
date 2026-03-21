/**
 * Subnet Architect — Network Designer
 * Workshop DIY — Net Browser Collection
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.139885 78.322945 253.991455 136.254120"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752z"/><path style="stroke:none;fill:currentColor" d="M259.791718,157.665863L264.87912,148.034195L272.338226,148.034195L263.03244,163.730896L263.03244,174.991974L256.261322,174.991974L256.261322,164.07489L246.792618,148.034195L254.505173,148.034195z"/><path style="stroke:none;fill:currentColor" d="M240.369812,152.741394L236.495438,152.741394L236.495438,170.284775L240.369812,170.284775L240.369812,174.991974L225.849915,174.991974L225.849915,170.284775L229.724304,170.284775L229.724304,152.741394L225.849915,152.741394L225.849915,148.034195L240.369812,148.034195z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH6gMKAjgH2Wn1xg==';
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
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
    ...LANG_BASE.en,title:'Subnet Architect',subtitle:'🏗️ Drag-and-drop network design',disconnected:'Disconnected',connected:'Connected',mainSection:'Network Designer',mainDesc:'Place devices, connect them, simulate traffic',sectionA:'Subnetting Basics',sectionB:'IP Address Classes',sectionC:'Failure Simulation',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'The main display shows the Subnet Architect simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how The network is scanned to discover active devices and servic',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Subnetting Basics" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 مظاهر. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'ثلاثي اللغات. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_log_title:'📜 Activity Log',wiki_log:'سجل مؤرّخ. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'محلي أولاً. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'🏗️ Subnet Architect ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',router:'Router',switch:'Switch',host:'Host',firewall:'Firewall',connectMode:'Connect',simulate:'Simulate',clearCanvas:'Clear',selectedDevice:'Selected:',assignIP:'Assign',failLink:'Fail Random Link',restore:'Restore All',subnetText:'Subnetting divides a network into smaller sub-networks. A /24 means 256 addresses.',ipClassText:'Class A: 10.0.0.0/8, Class B: 172.16.0.0/12, Class C: 192.168.0.0/16.',failText:'Test network resilience by simulating link failures.',devicePlaced:'Device placed',connectionMade:'Connection created',trafficSim:'Traffic simulation running',linkFailed:'Link failed!',allRestored:'All links restored',noDevices:'Place devices first!',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code',faq_q1:'What is Subnet Architect?',faq_a1:'Subnet Architect is an interactive simulation that demonstrates network security concepts. Place devices, connect them, simulate traffic. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real networking behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real networking principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Browser only. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Web Bgp Simulator and Web Blockchain Messenger. Each app in this category teaches a different aspect of networking.',demo_s1:'Welcome to Subnet Architect! Look at the main display — this is where the networking simulation runs.',demo_s2:'Click a device button then click on the canvas. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Subnetting Basics" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of networking.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Subnet Architect! This is like a science experiment on your computer. You get to control a real network security simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how The network is scanned to discover active devices  Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches networking concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Packet Trace',ch1Desc:'Send a message through the network and trace every hop it takes. How many nodes does it pass through? What happens if one goes down?',ch2Title:'Latency Hunt',ch2Desc:'Find the bottleneck in the network by measuring latency at each node. Which link is the slowest and why?',ch3Title:'Security Audit',ch3Desc:'Try to find the unencrypted channel in the network. What information can you see? How would you fix it?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Subnet Architect: Place devices, connect them, simulate traffic. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Scan through Capture to Analyze and Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Subnetting Basics" and "IP Address Classes" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Antenna Engineering',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. Subnet Architect builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Web Subnet Architect',
    wiki_math: 'The mathematics behind Subnet Architect: Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced antenna engineering practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to antenna engineering. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with antenna engineering: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in antenna engineering.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Antenna Engineering carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Header',
    gloss1_def: 'Metadata prepended to a packet containing source/destination addresses, protocol info, and error-checking fields. Headers enable routing and delivery.',
    gloss2_term: 'Port',
    gloss2_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Subnet Architect demonstrates key principles from network security. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world antenna engineering?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional antenna engineering systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
fr:{title:'Subnet Architect',subtitle:'🏗️ Conception reseau glisser-deposer',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Concepteur Reseau',mainDesc:'Placez des appareils, connectez-les, simulez le trafic',sectionA:'Bases du sous-reseautage',sectionB:'Classes d\'adresses IP',sectionC:'Simulation de panne',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'L écran principal affiche la simulation Subnet Architect. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how The network is scanned to discover active devices and servic',howto_2:'Clique Connecter puis deux appareils.',howto_3:'Selectionne et assigne une IP.',howto_4:'Clique Simuler pour le trafic.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'🏗️ Subnet Architect pret !',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'🔊 Sons',whisperMode:'Murmure',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',router:'Routeur',switch:'Commutateur',host:'Hote',firewall:'Pare-feu',connectMode:'Connecter',simulate:'Simuler',clearCanvas:'Effacer',selectedDevice:'Selectionne:',assignIP:'Assigner',failLink:'Couper un lien',restore:'Restaurer',subnetText:'Le sous-reseautage divise un reseau en sous-reseaux plus petits.',ipClassText:'Classe A: 10.0.0.0/8, Classe B: 172.16.0.0/12, Classe C: 192.168.0.0/16.',failText:'Testez la resilience du reseau.',devicePlaced:'Appareil place',connectionMade:'Connexion creee',trafficSim:'Simulation de trafic',linkFailed:'Lien coupe !',allRestored:'Liens restaures',noDevices:'Placez des appareils d\'abord !',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Subnet Architect est une simulation interactive qui démontre les concepts de sécurité réseau. Place devices, connect them, simulate traffic. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Web Certificate Inspector and Web Darknet Simulator ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 Histoire de ingénierie d\'antennes',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. Subnet Architect s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Web Subnet Architect',
    wiki_math: 'Les mathématiques derrière Subnet Architect : Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de ingénierie d\'antennes utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour ingénierie d\'antennes. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en ingénierie d\'antennes : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Ingénierie d\'antennes implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Header',
    gloss1_def: 'Metadata prepended to a packet containing source/destination addresses, protocol info, and error-checking fields. Headers enable routing and delivery.',
    gloss2_term: 'Port',
    gloss2_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Subnet Architect démontre les principes clés de sécurité réseau. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec antenna engineering dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
ar:{title:'مهندس الشبكات الفرعية',subtitle:'🏗️ تصميم شبكة بالسحب والإفلات',disconnected:'غير متصل',connected:'متصل',mainSection:'مصمم الشبكة',mainDesc:'ضع أجهزة، اربطها، حاكِ حركة المرور',sectionA:'أساسيات الشبكات الفرعية',sectionB:'فئات عناوين IP',sectionC:'محاكاة الأعطال',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'تعرض الشاشة الرئيسية محاكاة Subnet Architect. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how The network is scanned to discover active devices and servic',howto_2:'انقر اتصال ثم جهازين.',howto_3:'حدد جهازاً وعيّن IP.',howto_4:'انقر محاكاة لمشاهدة التدفق.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل النشاط',wiki_log:'سجل مؤرّخ.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي أولاً.',working:'جارٍ…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',ready:'🏗️ مهندس الشبكات جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',export:'تصدير',filterAll:'الكل',soundEffects:'🔊 أصوات',whisperMode:'همس',breathingGuide:'تنفس',dhikrTap:'اضغط',musicMode:'موسيقى',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',router:'موجه',switch:'مبدّل',host:'مضيف',firewall:'جدار ناري',connectMode:'اتصال',simulate:'محاكاة',clearCanvas:'مسح',selectedDevice:'المحدد:',assignIP:'تعيين',failLink:'قطع رابط عشوائي',restore:'استعادة الكل',subnetText:'الشبكات الفرعية تقسم الشبكة إلى أقسام أصغر.',ipClassText:'فئة A: 10.0.0.0/8، فئة B: 172.16.0.0/12، فئة C: 192.168.0.0/16.',failText:'اختبر مرونة الشبكة بمحاكاة أعطال الروابط.',devicePlaced:'تم وضع الجهاز',connectionMade:'تم إنشاء اتصال',trafficSim:'محاكاة حركة المرور',linkFailed:'رابط مقطوع!',allRestored:'تم استعادة الروابط',noDevices:'ضع أجهزة أولاً!',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Subnet Architect هي محاكاة تفاعلية توضح مفاهيم أمن الشبكات. Place devices, connect them, simulate traffic. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Web Certificate Inspector and Web Darknet Simulator! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 تاريخ هندسة الهوائيات',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. يبني Subnet Architect على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Web Subnet Architect',
    wiki_math: 'الرياضيات وراء Subnet Architect: Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو هندسة الهوائيات المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في هندسة الهوائيات. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في هندسة الهوائيات: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'هندسة الهوائيات يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Header',
    gloss1_def: 'Metadata prepended to a packet containing source/destination addresses, protocol info, and error-checking fields. Headers enable routing and delivery.',
    gloss2_term: 'Port',
    gloss2_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Subnet Architect يوضح المبادئ الأساسية في أمن الشبكات. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـantenna engineering في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${s.themeChanged} ${s['t_'+n]||n}`,'info');}

let logContainer,typewriterEnabled=true;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const ft=`[${new Date().toLocaleTimeString()}] ${msg}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success'){playSound('success');pulseBismillah('success');setPetState('happy');}else if(type==='error'){playSound('error');pulseBismillah('error');setPetState('sad');}logHistory.push({msg,type,ts:Date.now()});applyLogFilter();resetPetSleep();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='subnet-log.txt';a.click();URL.revokeObjectURL(u);}
let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(12+Math.random()*18);}el.classList.remove('typing');}
const logHistory=[];
function pulseBismillah(t){const b=document.querySelector('.bismillah');if(!b)return;b.classList.remove('pulse-success','pulse-error');void b.offsetWidth;b.classList.add(t==='error'?'pulse-error':'pulse-success');setTimeout(()=>b.classList.remove('pulse-success','pulse-error'),700);}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
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
function toggleBreathing(){const bands=document.querySelectorAll('.deco-band');breathingActive=!breathingActive;bands.forEach(b=>b.classList.toggle('breathing',breathingActive));log(breathingActive?'🫁 Breathing on':'🫁 Breathing off','info');if(!breathingActive&&dhikrCount>0){log(`📿 Dhikr: ${dhikrCount}`,'success');dhikrCount=0;}}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
let recognition=null,whisperActive=false;
function toggleWhisper(){if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){log('🎤 Not supported','error');return;}if(whisperActive){if(recognition)recognition.stop();whisperActive=false;log('🎤 Off','info');return;}const SR=window.SpeechRecognition||window.webkitSpeechRecognition;recognition=new SR();recognition.continuous=true;recognition.interimResults=false;recognition.lang=currentLang==='ar'?'ar-DZ':currentLang==='fr'?'fr-FR':'en-US';recognition.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal){const t=e.results[i][0].transcript.trim();if(t)log(`🎤 ${t}`,'rx');}};recognition.onerror=e=>log(`🎤 ${e.error}`,'error');recognition.onend=()=>{if(whisperActive)recognition.start();};recognition.start();whisperActive=true;log('🎤 On','success');}
const FOCUSABLE='button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
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
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغ';
function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);(function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);})();}
function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';let cc=0,ct=null;l.addEventListener('click',()=>{cc++;if(ct)clearTimeout(ct);if(cc>=3){cc=0;toggleMatrix();}else ct=setTimeout(()=>cc=0,500);});}

/* ══════════════════════════════════════════════════════════════
   SUBNET ARCHITECT ENGINE
   ══════════════════════════════════════════════════════════════ */
const DEVICE_TYPES={router:{icon:'🔀',color:'#3b82f6',r:22},switch:{icon:'🔌',color:'#22c55e',r:20},host:{icon:'💻',color:'#f59e0b',r:18},firewall:{icon:'🛡️',color:'#ef4444',r:22}};
let devices=[],connections=[],selectedDevice=null,connectMode=false,connectFirst=null;
let placingType=null,simRunning=false,simAnim=null,trafficParticles=[];

function renderCanvas(){
  const canvas=$('netCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#0a1628';ctx.fillRect(0,0,w,h);
  // Grid
  ctx.strokeStyle='rgba(255,255,255,0.03)';ctx.lineWidth=1;
  for(let x=0;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=0;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  // Connections
  connections.forEach(c=>{
    const d1=devices[c.from],d2=devices[c.to];if(!d1||!d2)return;
    ctx.strokeStyle=c.failed?'#ef4444':'rgba(255,255,255,0.3)';
    ctx.lineWidth=c.failed?1:2;
    if(c.failed){ctx.setLineDash([5,5]);}else{ctx.setLineDash([]);}
    ctx.beginPath();ctx.moveTo(d1.x,d1.y);ctx.lineTo(d2.x,d2.y);ctx.stroke();
    ctx.setLineDash([]);
  });
  // Traffic particles
  trafficParticles.forEach(p=>{
    ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);
    ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent2').trim()||'#0ea5e9';
    ctx.globalAlpha=0.8;ctx.fill();ctx.globalAlpha=1;
  });
  // Devices
  devices.forEach((d,i)=>{
    const dt=DEVICE_TYPES[d.type];
    // Glow if selected
    if(selectedDevice===i){
      ctx.beginPath();ctx.arc(d.x,d.y,dt.r+6,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,255,0.1)';ctx.fill();
      ctx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
      ctx.lineWidth=2;ctx.stroke();
    }
    // Body
    ctx.beginPath();ctx.arc(d.x,d.y,dt.r,0,Math.PI*2);
    ctx.fillStyle=dt.color+'33';ctx.fill();
    ctx.strokeStyle=dt.color;ctx.lineWidth=2;ctx.stroke();
    // Icon
    ctx.font='16px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(dt.icon,d.x,d.y);
    // Label
    ctx.font='10px Tajawal,sans-serif';ctx.fillStyle='#fff';ctx.globalAlpha=0.7;
    ctx.fillText(d.ip||d.type,d.x,d.y+dt.r+12);ctx.globalAlpha=1;
  });
  // Connect mode indicator
  if(connectMode&&connectFirst!==null){
    const d=devices[connectFirst];
    ctx.beginPath();ctx.arc(d.x,d.y,DEVICE_TYPES[d.type].r+10,0,Math.PI*2);
    ctx.strokeStyle='#22c55e';ctx.lineWidth=2;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
  }
}

function getDeviceAt(x,y){
  for(let i=devices.length-1;i>=0;i--){
    const d=devices[i],dt=DEVICE_TYPES[d.type];
    const dx=d.x-x,dy=d.y-y;
    if(dx*dx+dy*dy<=dt.r*dt.r)return i;
  }
  return -1;
}

function canvasClick(e){
  const canvas=$('netCanvas');const rect=canvas.getBoundingClientRect();
  const scaleX=canvas.width/rect.width,scaleY=canvas.height/rect.height;
  const x=(e.clientX-rect.left)*scaleX,y=(e.clientY-rect.top)*scaleY;
  const s=LANG[currentLang];

  if(connectMode){
    const idx=getDeviceAt(x,y);
    if(idx===-1)return;
    if(connectFirst===null){connectFirst=idx;renderCanvas();return;}
    if(idx!==connectFirst){
      connections.push({from:connectFirst,to:idx,failed:false});
      log(`${s.connectionMade}: ${devices[connectFirst].type} ↔ ${devices[idx].type}`,'success');
    }
    connectFirst=null;connectMode=false;renderCanvas();return;
  }
  if(placingType){
    devices.push({type:placingType,x,y,ip:''});
    log(`${s.devicePlaced}: ${placingType} (${Math.round(x)},${Math.round(y)})`,'info');
    placingType=null;renderCanvas();return;
  }
  // Select device
  const idx=getDeviceAt(x,y);
  if(idx>=0){
    selectedDevice=idx;
    const d=devices[idx];
    $('ipPanel').style.display='flex';
    $('selectedLabel').textContent=`${DEVICE_TYPES[d.type].icon} ${d.type} #${idx}`;
    $('ipInput').value=d.ip||'';
  }else{
    selectedDevice=null;
    $('ipPanel').style.display='none';
  }
  renderCanvas();
}

let dragIdx=-1,dragOff={x:0,y:0};
function canvasMouseDown(e){
  const canvas=$('netCanvas');const rect=canvas.getBoundingClientRect();
  const scaleX=canvas.width/rect.width,scaleY=canvas.height/rect.height;
  const x=(e.clientX-rect.left)*scaleX,y=(e.clientY-rect.top)*scaleY;
  if(placingType||connectMode)return;
  const idx=getDeviceAt(x,y);
  if(idx>=0){dragIdx=idx;dragOff={x:devices[idx].x-x,y:devices[idx].y-y};}
}
function canvasMouseMove(e){
  if(dragIdx<0)return;
  const canvas=$('netCanvas');const rect=canvas.getBoundingClientRect();
  const scaleX=canvas.width/rect.width,scaleY=canvas.height/rect.height;
  const x=(e.clientX-rect.left)*scaleX,y=(e.clientY-rect.top)*scaleY;
  devices[dragIdx].x=x+dragOff.x;devices[dragIdx].y=y+dragOff.y;
  renderCanvas();
}
function canvasMouseUp(){dragIdx=-1;}

function assignIP(){
  if(selectedDevice===null)return;
  devices[selectedDevice].ip=$('ipInput').value.trim();
  log(`IP assigned: ${devices[selectedDevice].ip} → ${devices[selectedDevice].type} #${selectedDevice}`,'success');
  renderCanvas();
}

async function simulateTraffic(){
  if(simRunning||devices.length<2||connections.length===0){log(LANG[currentLang].noDevices,'error');return;}
  const s=LANG[currentLang];simRunning=true;setStatus(true);showToast(s.trafficSim);log(s.trafficSim,'tx');
  trafficParticles=[];
  for(let wave=0;wave<3;wave++){
    const activeConns=connections.filter(c=>!c.failed);
    if(activeConns.length===0)break;
    const c=activeConns[Math.floor(Math.random()*activeConns.length)];
    const d1=devices[c.from],d2=devices[c.to];
    for(let t=0;t<=30;t++){
      const prog=t/30;
      trafficParticles=[{x:d1.x+(d2.x-d1.x)*prog,y:d1.y+(d2.y-d1.y)*prog}];
      renderCanvas();await sleep(30);
    }
    trafficParticles=[];renderCanvas();
    log(`📦 ${d1.type}${d1.ip?' ('+d1.ip+')':''} → ${d2.type}${d2.ip?' ('+d2.ip+')':''}`,'rx');
    await sleep(200);
  }
  trafficParticles=[];simRunning=false;hideToast();log(s.trafficSim+' ✓','success');renderCanvas();
}

function failRandomLink(){
  const active=connections.filter(c=>!c.failed);
  if(active.length===0)return;
  const c=active[Math.floor(Math.random()*active.length)];
  c.failed=true;
  log(LANG[currentLang].linkFailed+` ${devices[c.from].type} ↔ ${devices[c.to].type}`,'error');
  renderCanvas();
}
function restoreAll(){connections.forEach(c=>c.failed=false);log(LANG[currentLang].allRestored,'success');renderCanvas();}
function clearCanvas(){devices=[];connections=[];selectedDevice=null;connectMode=false;connectFirst=null;trafficParticles=[];$('ipPanel').style.display='none';renderCanvas();log('Canvas cleared','info');}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;
  initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  $('whisperBtn').onclick=toggleWhisper;
  const bb=$('breathingBtn'),dd=$('dhikrDisplay'),db=$('dhikrBtn');
  if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none';};
  if(db)db.onclick=incrementDhikr;
  $('musicBtn').onclick=()=>log('🎵 Coming soon','info');
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initKonami();initMatrixTrigger();initHijriDate();initPixelPet();

  // App-specific
  const canvas=$('netCanvas');
  canvas.addEventListener('click',canvasClick);
  canvas.addEventListener('mousedown',canvasMouseDown);
  canvas.addEventListener('mousemove',canvasMouseMove);
  canvas.addEventListener('mouseup',canvasMouseUp);
  canvas.addEventListener('mouseleave',canvasMouseUp);
  $('addRouterBtn').onclick=()=>{placingType='router';connectMode=false;playSound('click');};
  $('addSwitchBtn').onclick=()=>{placingType='switch';connectMode=false;playSound('click');};
  $('addHostBtn').onclick=()=>{placingType='host';connectMode=false;playSound('click');};
  $('addFirewallBtn').onclick=()=>{placingType='firewall';connectMode=false;playSound('click');};
  $('connectBtn').onclick=()=>{connectMode=!connectMode;placingType=null;connectFirst=null;playSound('click');};
  $('simBtn').onclick=simulateTraffic;
  $('clearCanvasBtn').onclick=clearCanvas;
  $('assignIPBtn').onclick=assignIP;
  $('failLinkBtn').onclick=failRandomLink;
  $('restoreBtn').onclick=restoreAll;
  renderCanvas();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: IP Address Space Visualizer ═══════ */
(function(){
let ipCanvas,ipCtx;const ipBlocks=[];
function createIC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">IP Address Space Map</div>';
  const c=document.createElement('canvas');c.width=620;c.height=260;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;cursor:crosshair;';
  w.appendChild(c);t.appendChild(w);return c;
}
const SUBNETS=[
  {cidr:'/8',hosts:16777214,color:'#ef4444',name:'Class A'},
  {cidr:'/16',hosts:65534,color:'#f59e0b',name:'Class B'},
  {cidr:'/24',hosts:254,color:'#22c55e',name:'Class C'},
  {cidr:'/28',hosts:14,color:'#3b82f6',name:'Small'},
  {cidr:'/30',hosts:2,color:'#8b5cf6',name:'P2P Link'},
];
function initBlocks(){
  ipBlocks.length=0;
  const cols=16,rows=16,cellW=(620-40)/cols,cellH=(260-80)/rows;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const idx=r*cols+c;
      const subnet=SUBNETS[Math.floor(Math.random()*SUBNETS.length)];
      ipBlocks.push({x:20+c*cellW,y:25+r*cellH,w:cellW-1,h:cellH-1,
        subnet,ip:idx+'.0.0.0',intensity:Math.random(),pulsePhase:Math.random()*Math.PI*2});
    }
  }
}
function drawIC(){
  if(!ipCtx)return;const w=ipCanvas.width,h=ipCanvas.height;
  ipCtx.fillStyle='rgba(6,13,26,0.06)';ipCtx.fillRect(0,0,w,h);
  // IP blocks
  ipBlocks.forEach(b=>{
    const pulse=Math.sin(Date.now()/800+b.pulsePhase)*0.1;
    const alpha=0.1+b.intensity*0.15+pulse;
    ipCtx.fillStyle=b.subnet.color+Math.floor(alpha*255).toString(16).padStart(2,'0');
    ipCtx.fillRect(b.x,b.y,b.w,b.h);
    // Border on hover intensity
    if(b.intensity>0.7){
      ipCtx.strokeStyle=b.subnet.color+'44';ipCtx.lineWidth=0.5;ipCtx.strokeRect(b.x,b.y,b.w,b.h);
    }
  });
  // Subnet utilization bars
  const barY=h-45;
  SUBNETS.forEach((s,i)=>{
    const count=ipBlocks.filter(b=>b.subnet===s).length;
    const x=20+i*120,bw=100;
    ipCtx.fillStyle='rgba(255,255,255,0.03)';ipCtx.fillRect(x,barY,bw,10);
    ipCtx.fillStyle=s.color+'44';ipCtx.fillRect(x,barY,bw*(count/256),10);
    ipCtx.fillStyle=s.color;ipCtx.font='7px monospace';ipCtx.textAlign='left';
    ipCtx.fillText(s.name+' '+s.cidr+': '+count,x,barY+22);
  });
  // Legend
  ipCtx.fillStyle='rgba(255,255,255,0.3)';ipCtx.font='8px monospace';ipCtx.textAlign='left';
  ipCtx.fillText('256 address blocks | Click to reassign subnets',10,h-5);
  requestAnimationFrame(drawIC);
}
function initIC(){ipCanvas=createIC();if(!ipCanvas)return;ipCtx=ipCanvas.getContext('2d');
  initBlocks();
  ipCanvas.addEventListener('click',e=>{
    const rect=ipCanvas.getBoundingClientRect();
    const mx=(e.clientX-rect.left)*(ipCanvas.width/rect.width),my=(e.clientY-rect.top)*(ipCanvas.height/rect.height);
    ipBlocks.forEach(b=>{
      if(mx>=b.x&&mx<=b.x+b.w&&my>=b.y&&my<=b.y+b.h){
        b.subnet=SUBNETS[(SUBNETS.indexOf(b.subnet)+1)%SUBNETS.length];
        b.intensity=1;b.pulsePhase=0;
      }
    });
  });
  drawIC();}
setTimeout(initIC,2000);
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
