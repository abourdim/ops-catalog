/**
 * Workshop DIY — DNS Odyssey v1.2
 * Resolution Journey — Watch full recursive DNS resolution step by step
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.42,152.87C187.48,152.74,187.66,152.63,187.82,152.63C188.09,152.63,190.48,151.54,191.62,150.9L194.17,149.21C197.43,146.97,199.24,146.24,202.59,145.78C203.8,145.62,204.63,145.62,205.93,145.78C212.62,146.63,217.42,150.72,219.33,157.2C219.72,158.55,219.77,162.69,219.41,163.88C218.19,167.86,216.58,170.3,213.79,172.41C209.46,175.7,203.83,176.56,198.81,174.72C197.24,174.15,196.14,173.54,194.48,172.35C191.91,170.51,190.53,169.74,188.03,168.75L187.29,168.46L187.31,160.79C187.32,156.56,187.37,153,187.42,152.87z"/><path style="stroke:none;fill:currentColor" d="M259.79,157.67L264.88,148.03L272.34,148.03L263.03,163.73L263.03,174.99L256.26,174.99L256.26,164.07L246.79,148.03L254.51,148.03z"/><path style="stroke:none;fill:currentColor" d="M240.37,152.74L236.5,152.74L236.5,170.28L240.37,170.28L240.37,174.99L225.85,174.99L225.85,170.28L229.72,170.28L229.72,152.74L225.85,152.74L225.85,148.03L240.37,148.03z"/><path style="stroke:none;fill:currentColor" d="M330.79,195.73L203.96,195.73L203.96,199.33L330.79,199.33z"/><path style="stroke:none;fill:currentColor" d="M330.79,203.35L161.69,203.35L161.69,206.96L330.79,206.96z"/><path style="stroke:none;fill:currentColor" d="M330.79,210.97L77.14,210.97L77.14,214.58L330.79,214.58z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH6gMKAjgH2Wn1xgAAAAxJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAvBm8AAAB8IkWQwAAAABJRU5ErkJggg==';
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator();const gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;switch(type){case'click':osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);break;case'success':osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);const o2=audioCtx.createOscillator(),g2=audioCtx.createGain();o2.connect(g2);g2.connect(audioCtx.destination);g2.gain.value=0.08;o2.frequency.value=659;o2.type='sine';g2.gain.exponentialRampToValueAtTime(0.001,t+0.4);o2.start(t+0.15);o2.stop(t+0.4);break;case'error':osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);break;}}

/* ═══════ i18n ═══════ */
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
    title:'DNS Odyssey',subtitle:'Watch full recursive DNS resolution step by step',
    disconnected:'Disconnected',connected:'Connected',
    mainSection:'DNS Resolution Journey',mainDesc:'Recursive DNS resolution step by step',
    sectionA:'DNS Record Types',sectionB:'DNS Security',sectionC:'Resolution History',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
    settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    howto_1:'The main display shows the Dns Odyssey simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how The network is scanned to discover active devices and servic',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "DNS Record Types" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_themes_title:'Themes',wiki_themes:'8 مظاهر. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_i18n_title:'Languages',wiki_i18n:'ثلاثي اللغات. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_log_title:'Activity Log',wiki_log:'سجل مؤرخ. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_privacy_title:'Privacy',wiki_privacy:'محلي اولا. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    working:'Working...',ready:'DNS Odyssey ready!',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
    logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    soundEffects:'Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',
    newVersion:'UPDATE',langChanged:'Language > English',themeChanged:'Theme >',
    resolveBtn:'Resolve',ttlCache:'TTL Cache',
    dnsRefText:'DNS uses record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), NS (nameserver), TXT (text), SOA, PTR. Each has a TTL for caching.',
    secText:'DNSSEC adds signatures to prevent spoofing. DoH and DoT encrypt queries for privacy.',
    historyText:'View previously resolved domains and cached results.',
    resolving:'Resolving domain...',resolved:'Resolution complete!',
    step1:'Browser checks local cache',step2:'Query sent to recursive resolver',step3:'Resolver queries root server (.)',
    step4:'Root refers to TLD server',step5:'Resolver queries TLD server',step6:'TLD refers to authoritative server',
    step7:'Resolver queries authoritative server',step8:'Authoritative returns IP address',step9:'Resolver caches and returns to browser',
    browser:'Browser',resolver:'Resolver',rootSrv:'Root (.)',tldSrv:'TLD',authSrv:'Auth NS',
    cached:'CACHED',ttl:'TTL',ip:'IP',noCache:'Not in cache',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code',faq_q1:'What is DNS Odyssey?',faq_a1:'Dns Odyssey is an interactive simulation that demonstrates network security concepts. Recursive DNS resolution step by step. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real networking behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real networking principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Browser only. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Web Bgp Simulator and Web Blockchain Messenger. Each app in this category teaches a different aspect of networking.',demo_s1:'Welcome to DNS Odyssey! Look at the main display — this is where the networking simulation runs.',demo_s2:'Enter a domain name. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "DNS Record Types" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of networking.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Dns Odyssey! This is like a science experiment on your computer. You get to control a real network security simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how The network is scanned to discover active devices  Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches networking concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Packet Trace',ch1Desc:'Send a message through the network and trace every hop it takes. How many nodes does it pass through? What happens if one goes down?',ch2Title:'Latency Hunt',ch2Desc:'Find the bottleneck in the network by measuring latency at each node. Which link is the slowest and why?',ch3Title:'Security Audit',ch3Desc:'Try to find the unencrypted channel in the network. What information can you see? How would you fix it?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'DNS Odyssey: Recursive DNS resolution step by step. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Scan through Capture to Analyze and Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "DNS Record Types" and "DNS Security" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Antenna Engineering',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. Dns Odyssey builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Web Dns Odyssey',
    wiki_math: 'The mathematics behind Dns Odyssey: Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
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
    theory: 'Dns Odyssey demonstrates key principles from network security. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world antenna engineering?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional antenna engineering systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
  fr:{
    title:'DNS Odyssee',subtitle:'Suivez la resolution DNS recursive etape par etape',
    disconnected:'Deconnecte',connected:'Connecte',
    mainSection:'Voyage de Resolution DNS',mainDesc:'Resolution DNS recursive etape par etape',
    sectionA:'Types d\'Enregistrements DNS',sectionB:'Securite DNS',sectionC:'Historique de Resolution',
    activityLog:'Journal',eventsMsg:'Evenements et messages',
    clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',
    settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    howto_1:'L écran principal affiche la simulation Dns Odyssey. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how The network is scanned to discover active devices and servic',howto_2:'Cliquez Resoudre.',howto_3:'Regardez l\'animation.',howto_4:'Verifiez le cache TTL et l\'historique.',
    wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'Trilingue.',
    wiki_log_title:'Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'Confidentialite',wiki_privacy:'Local-first.',
    working:'En cours...',ready:'DNS Odyssee pret!',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
    logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
    soundEffects:'Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',
    newVersion:'MAJ',langChanged:'Langue > Francais',themeChanged:'Theme >',
    resolveBtn:'Resoudre',ttlCache:'Cache TTL',
    dnsRefText:'DNS utilise les types A, AAAA, CNAME, MX, NS, TXT, SOA, PTR. Chaque enregistrement a un TTL.',
    secText:'DNSSEC ajoute des signatures. DoH et DoT chiffrent les requetes.',
    historyText:'Historique des domaines resolus.',
    resolving:'Resolution en cours...',resolved:'Resolution terminee!',
    step1:'Le navigateur verifie le cache local',step2:'Requete envoyee au resolveur recursif',step3:'Le resolveur interroge le serveur racine (.)',
    step4:'Racine renvoie vers le serveur TLD',step5:'Le resolveur interroge le serveur TLD',step6:'TLD renvoie vers le serveur autoritaire',
    step7:'Le resolveur interroge le serveur autoritaire',step8:'Le serveur autoritaire retourne l\'adresse IP',step9:'Le resolveur met en cache et retourne au navigateur',
    browser:'Navigateur',resolver:'Resolveur',rootSrv:'Racine (.)',tldSrv:'TLD',authSrv:'NS Auth',
    cached:'EN CACHE',ttl:'TTL',ip:'IP',noCache:'Pas en cache',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Dns Odyssey est une simulation interactive qui démontre les concepts de sécurité réseau. Recursive DNS resolution step by step. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Web Packet Racer and Web Firewall Fortress ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 Histoire de ingénierie d\'antennes',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. Dns Odyssey s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Web Dns Odyssey',
    wiki_math: 'Les mathématiques derrière Dns Odyssey : Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
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
    theory: 'Dns Odyssey démontre les principes clés de sécurité réseau. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec antenna engineering dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
  ar:{
    title:'رحلة DNS',subtitle:'شاهد حل DNS التكراري خطوة بخطوة',
    disconnected:'غير متصل',connected:'متصل',
    mainSection:'رحلة حل DNS',mainDesc:'حل DNS التكراري خطوة بخطوة',
    sectionA:'انواع سجلات DNS',sectionB:'امان DNS',sectionC:'سجل الحلول',
    activityLog:'سجل النشاط',eventsMsg:'الاحداث والرسائل',
    clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
    settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Dns Odyssey. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how The network is scanned to discover active devices and servic',howto_2:'انقر حل للبدء.',howto_3:'شاهد الرسوم المتحركة.',howto_4:'تحقق من ذاكرة TTL والسجل.',
    wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'ثلاثي اللغات.',
    wiki_log_title:'سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'الخصوصية',wiki_privacy:'محلي اولا.',
    working:'جار...',ready:'رحلة DNS جاهزة!',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',
    logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
    soundEffects:'مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',
    newVersion:'تحديث',langChanged:'اللغة > العربية',themeChanged:'المظهر >',
    resolveBtn:'حل',ttlCache:'ذاكرة TTL',
    dnsRefText:'يستخدم DNS انواع السجلات A و AAAA و CNAME و MX و NS و TXT. لكل سجل TTL.',
    secText:'يضيف DNSSEC توقيعات رقمية. DoH و DoT يشفران الاستعلامات.',
    historyText:'عرض النطاقات المحلولة سابقا.',
    resolving:'جاري الحل...',resolved:'اكتمل الحل!',
    step1:'المتصفح يتحقق من الذاكرة المحلية',step2:'ارسال الاستعلام الى المحلل التكراري',step3:'المحلل يستعلم خادم الجذر',
    step4:'الجذر يحيل الى خادم TLD',step5:'المحلل يستعلم خادم TLD',step6:'TLD يحيل الى الخادم المعتمد',
    step7:'المحلل يستعلم الخادم المعتمد',step8:'الخادم المعتمد يعيد عنوان IP',step9:'المحلل يخزن ويعيد للمتصفح',
    browser:'المتصفح',resolver:'المحلل',rootSrv:'الجذر (.)',tldSrv:'TLD',authSrv:'NS المعتمد',
    cached:'مخزن',ttl:'TTL',ip:'IP',noCache:'غير مخزن',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Dns Odyssey هي محاكاة تفاعلية توضح مفاهيم أمن الشبكات. Recursive DNS resolution step by step. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Web Packet Racer and Web Firewall Fortress! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 تاريخ هندسة الهوائيات',
    wiki_history: 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet. يبني Dns Odyssey على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Web Dns Odyssey',
    wiki_math: 'الرياضيات وراء Dns Odyssey: Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
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
    theory: 'Dns Odyssey يوضح المبادئ الأساسية في أمن الشبكات. A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـantenna engineering في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const ft=`[${new Date().toLocaleTimeString()}] ${msg}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success'){playSound('success');pulseBismillah('success');setPetState('happy');}else if(type==='error'){playSound('error');pulseBismillah('error');setPetState('sad');}logWithHistory(msg,type);applyLogFilter();resetPetSleep();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url);}
function checkVersion(){try{const s=localStorage.getItem('wdiy-latest-version');if(s&&s!==APP_VERSION){const b=$('settingsBtn');if(b&&!b.querySelector('.version-update')){const bg=document.createElement('span');bg.className='version-update';bg.textContent=LANG[currentLang].newVersion;b.style.position='relative';bg.style.cssText='position:absolute;top:-6px;inset-inline-end:-6px;';b.appendChild(bg);}}}catch{}}
const APP_MSG_KEY='wdiy-app-msg';function sendAppMessage(type,data){try{const msg={type,data,from:document.title,ts:Date.now()};localStorage.setItem(APP_MSG_KEY,JSON.stringify(msg));localStorage.removeItem(APP_MSG_KEY);}catch{}}function onAppMessage(cb){window.addEventListener('storage',e=>{if(e.key!==APP_MSG_KEY||!e.newValue)return;try{cb(JSON.parse(e.newValue));}catch{}});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('KONAMI CODE — RETRO!','success');}}else konamiIdx=0;});}
function pulseBismillah(type){const b=document.querySelector('.bismillah');if(!b)return;b.classList.remove('pulse-success','pulse-error');void b.offsetWidth;b.classList.add(type==='error'?'pulse-error':'pulse-success');setTimeout(()=>b.classList.remove('pulse-success','pulse-error'),700);}
const MORSE={'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---','k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-','u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',' ':'/'};let morseTimeout=null,morseActive=false;function sleep(ms){return new Promise(r=>setTimeout(r,ms));}function initMorseLog(){document.addEventListener('mousedown',e=>{const line=e.target.closest('.log-line');if(!line)return;morseTimeout=setTimeout(()=>{},600);});document.addEventListener('mouseup',()=>{if(morseTimeout){clearTimeout(morseTimeout);morseTimeout=null;}});}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoClickCount=0,logoClickTimer=null;function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';l.addEventListener('click',()=>{logoClickCount++;if(logoClickTimer)clearTimeout(logoClickTimer);if(logoClickCount>=3){logoClickCount=0;toggleMatrix();}else logoClickTimer=setTimeout(()=>logoClickCount=0,500);});}
function initDebug(){if(!new URLSearchParams(window.location.search).has('debug'))return;const p=$('debugPanel');if(!p)return;p.classList.add('active');const f=$('debugFps'),m=$('debugMem');let frames=0,last=performance.now();function tick(){frames++;const now=performance.now();if(now-last>=1000){if(f)f.textContent=frames+' FPS';if(m&&performance.memory)m.textContent=(performance.memory.usedJSHeapSize/1048576).toFixed(1)+' MB';frames=0;last=now;}requestAnimationFrame(tick);}requestAnimationFrame(tick);}
function initShakeReport(){if(!window.DeviceMotionEvent)return;let last=0;window.addEventListener('devicemotion',e=>{const a=e.accelerationIncludingGravity;if(!a)return;if(Math.abs(a.x)+Math.abs(a.y)+Math.abs(a.z)>25&&Date.now()-last>2000){last=Date.now();generateBugReport();}});}
function generateBugReport(){if(!logContainer)logContainer=$('logContainer');const lines=logContainer?Array.from(logContainer.children).map(d=>d.textContent):[];const r={app:document.title,version:APP_VERSION,timestamp:new Date().toISOString(),userAgent:navigator.userAgent,theme:document.documentElement.dataset.theme,lang:currentLang,log:lines.slice(-50)};const blob=new Blob([JSON.stringify(r,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`bug-report-${Date.now()}.json`;a.click();URL.revokeObjectURL(url);}
const logHistory=[];function logWithHistory(msg,type){logHistory.push({msg,type,ts:Date.now()});}function initTimeTravel(){document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.key==='z'){const p=$('logPanel');if(!p||!p.classList.contains('open'))return;e.preventDefault();if(!logContainer)logContainer=$('logContainer');if(logContainer&&logContainer.lastChild){logContainer.removeChild(logContainer.lastChild);logHistory.pop();playSound('click');}}});}
let typewriterEnabled=true;async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(12+Math.random()*18);}el.classList.remove('typing');}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let recognition=null,whisperActive=false;function toggleWhisper(){if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){log('Speech not supported','error');return;}if(whisperActive){if(recognition)recognition.stop();whisperActive=false;return;}const SR=window.SpeechRecognition||window.webkitSpeechRecognition;recognition=new SR();recognition.continuous=true;recognition.interimResults=false;recognition.lang=currentLang==='ar'?'ar-DZ':currentLang==='fr'?'fr-FR':'en-US';recognition.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal){const t=e.results[i][0].transcript.trim();if(t)log(t,'rx');}};recognition.onerror=e=>log(`Error: ${e.error}`,'error');recognition.onend=()=>{if(whisperActive)recognition.start();};recognition.start();whisperActive=true;}
const GHOST_KEY='wdiy-ghost-cursor';let ghostCanvas,ghostCtx,myGhostId=Math.random().toString(36).slice(2,8);function initGhostUsers(){ghostCanvas=document.createElement('canvas');ghostCanvas.style.cssText='position:fixed;inset:0;z-index:9998;pointer-events:none;';document.body.appendChild(ghostCanvas);ghostCtx=ghostCanvas.getContext('2d');ghostCanvas.width=innerWidth;ghostCanvas.height=innerHeight;window.addEventListener('resize',()=>{ghostCanvas.width=innerWidth;ghostCanvas.height=innerHeight;});document.addEventListener('mousemove',e=>{try{localStorage.setItem(GHOST_KEY,JSON.stringify({id:myGhostId,x:e.clientX,y:e.clientY,ts:Date.now()}));}catch{}});const ghosts={};window.addEventListener('storage',e=>{if(e.key!==GHOST_KEY||!e.newValue)return;try{const d=JSON.parse(e.newValue);if(d.id===myGhostId)return;ghosts[d.id]={x:d.x,y:d.y,ts:d.ts};}catch{}});function draw(){ghostCtx.clearRect(0,0,ghostCanvas.width,ghostCanvas.height);const now=Date.now();for(const[id,g]of Object.entries(ghosts)){if(now-g.ts>3000){delete ghosts[id];continue;}ghostCtx.globalAlpha=0.3*(1-(now-g.ts)/3000);ghostCtx.beginPath();ghostCtx.arc(g.x,g.y,6,0,Math.PI*2);ghostCtx.fillStyle='#d4a03c';ghostCtx.fill();}ghostCtx.globalAlpha=1;requestAnimationFrame(draw);}requestAnimationFrame(draw);}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};function playThemeMelody(name){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=THEME_MELODIES[name];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((freq,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=freq;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){const bands=document.querySelectorAll('.deco-band');breathingActive=!breathingActive;if(breathingActive)bands.forEach(b=>b.classList.add('breathing'));else{bands.forEach(b=>b.classList.remove('breathing'));dhikrCount=0;}}function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
const PET_STATES={idle:{class:'pet-idle',duration:0},happy:{class:'pet-happy',duration:3000},sad:{class:'pet-sad',duration:3000},sleep:{class:'pet-sleep',duration:0}};let petState='idle',petIdleTimer=null,petSleepTimer=null;function initPixelPet(){const pet=document.createElement('div');pet.id='pixelPet';pet.className='pixel-pet pet-idle';pet.innerHTML=`<img src="${FOOTER_ICON}" alt="Bot"/>`;pet.addEventListener('click',()=>{setPetState('happy');playSound('success');});const f=document.querySelector('.app-footer');if(f)f.insertBefore(pet,f.firstChild);}function setPetState(s){petState=s;const p=$('pixelPet');if(!p)return;p.classList.remove('pet-idle','pet-happy','pet-sad','pet-sleep');p.classList.add(PET_STATES[s].class);if(petIdleTimer)clearTimeout(petIdleTimer);if(PET_STATES[s].duration>0)petIdleTimer=setTimeout(()=>setPetState('idle'),PET_STATES[s].duration);}function resetPetSleep(){if(petSleepTimer)clearTimeout(petSleepTimer);if(petState==='sleep')setPetState('idle');petSleepTimer=setTimeout(()=>setPetState('sleep'),60000);}
function initLogoTracker(){const l=$('logoWrap');if(!l)return;document.addEventListener('mousemove',e=>{const r=l.getBoundingClientRect();const dx=(e.clientX-(r.left+r.width/2))/(innerWidth/2);const dy=(e.clientY-(r.top+r.height/2))/(innerHeight/2);l.style.transform=`perspective(200px) rotateX(${dy*8}deg) rotateY(${-dx*8}deg)`;});document.addEventListener('mouseleave',()=>{l.style.transition='transform .5s ease-out';l.style.transform='';setTimeout(()=>l.style.transition='',500);});}
let musicAnalyser=null,musicActive=false,musicAnim=null;function toggleMusicMode(){if(musicActive){musicActive=false;if(musicAnim)cancelAnimationFrame(musicAnim);document.querySelectorAll('.deco-band').forEach(b=>{b.style.height='';b.style.opacity='';});document.querySelectorAll('.card').forEach(c=>c.style.transform='');document.documentElement.style.filter='';return;}navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{if(!audioCtx)audioCtx=new AudioCtx();const src=audioCtx.createMediaStreamSource(stream);musicAnalyser=audioCtx.createAnalyser();musicAnalyser.fftSize=256;src.connect(musicAnalyser);musicActive=true;const data=new Uint8Array(musicAnalyser.frequencyBinCount);function viz(){if(!musicActive)return;musicAnalyser.getByteFrequencyData(data);const bass=data.slice(0,10).reduce((a,b)=>a+b,0)/10/255;document.querySelectorAll('.deco-band').forEach(b=>{b.style.height=(2+bass*10)+'px';});document.querySelectorAll('.card').forEach(c=>{c.style.transform=`scale(${1+bass*0.015})`;});musicAnim=requestAnimationFrame(viz);}viz();}).catch(()=>log('Microphone denied','error'));}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let dragging=false,startX,startW;h.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=p.offsetWidth;document.body.style.cursor='col-resize';document.body.style.userSelect='none';e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=(document.documentElement.dir==='rtl')?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;document.body.style.cursor='';document.body.style.userSelect='';});try{const saved=localStorage.getItem('wdiy-log-width');if(saved)document.documentElement.style.setProperty('--log-width',saved);}catch{}}
const FOCUSABLE='button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(rid);if(b)b.focus();}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const target=$(id);if(target)target.classList.add('active');});});}function trapFocus(e){for(const id of['helpPanel','settingsPanel','logPanel']){const sb=$(id);if(!sb||!sb.classList.contains('open'))continue;const focusable=sb.querySelectorAll(FOCUSABLE);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;}}

/* ══════════════════════════════════════════════════════════════
   APP-SPECIFIC: DNS ODYSSEY
   ══════════════════════════════════════════════════════════════ */

const DNS_DB = {
  'www.example.com': { ip: '93.184.216.34', tld: '.com', ns: 'ns1.example.com', ttl: 3600 },
  'www.google.com': { ip: '142.250.80.46', tld: '.com', ns: 'ns1.google.com', ttl: 300 },
  'www.wikipedia.org': { ip: '208.80.154.224', tld: '.org', ns: 'ns0.wikimedia.org', ttl: 600 },
  'mail.yahoo.com': { ip: '98.137.11.164', tld: '.com', ns: 'ns1.yahoo.com', ttl: 1800 },
  'cdn.jsdelivr.net': { ip: '104.16.85.20', tld: '.net', ns: 'ns1.jsdelivr.net', ttl: 900 },
};

let dnsCache = {};
let resolveHistory = [];
let dnsResolving = false;
let dnsCanvas, dnsCtx;

const DNS_NODES = [
  { id: 'browser', x: 70, y: 175, color: '#4fc3f7', label: 'browser' },
  { id: 'resolver', x: 230, y: 175, color: '#ffa726', label: 'resolver' },
  { id: 'root', x: 390, y: 70, color: '#ef5350', label: 'rootSrv' },
  { id: 'tld', x: 520, y: 175, color: '#ab47bc', label: 'tldSrv' },
  { id: 'auth', x: 630, y: 280, color: '#66bb6a', label: 'authSrv' },
];

function drawDnsBase() {
  if (!dnsCtx) return;
  const c = dnsCanvas, ctx = dnsCtx;
  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, c.width, c.height);

  // Draw connections
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  const pairs = [[0,1],[1,2],[1,3],[1,4]];
  pairs.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(DNS_NODES[a].x, DNS_NODES[a].y);
    ctx.lineTo(DNS_NODES[b].x, DNS_NODES[b].y);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  // Draw nodes
  const s = LANG[currentLang];
  DNS_NODES.forEach(node => {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);
    ctx.fillStyle = node.color + '30';
    ctx.fill();
    ctx.strokeStyle = node.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = '11px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s[node.label] || node.label, node.x, node.y + 38);

    // Icon inside
    ctx.font = '16px sans-serif';
    const icons = { browser: '\uD83C\uDF10', resolver: '\uD83D\uDD0D', root: '\uD83C\uDFE0', tld: '\uD83C\uDFF7', auth: '\uD83D\uDCE6' };
    ctx.fillText(icons[node.id] || '', node.x, node.y + 6);
  });
}

function animatePacket(fromIdx, toIdx, color, duration = 600) {
  return new Promise(resolve => {
    const from = DNS_NODES[fromIdx];
    const to = DNS_NODES[toIdx];
    const startTime = performance.now();

    function frame(now) {
      const t = Math.min((now - startTime) / duration, 1);
      drawDnsBase();

      // Draw packet
      const x = from.x + (to.x - from.x) * t;
      const y = from.y + (to.y - from.y) * t;

      // Trail
      dnsCtx.beginPath();
      dnsCtx.moveTo(from.x, from.y);
      dnsCtx.lineTo(x, y);
      dnsCtx.strokeStyle = color;
      dnsCtx.lineWidth = 2;
      dnsCtx.stroke();

      // Packet dot
      dnsCtx.beginPath();
      dnsCtx.arc(x, y, 6, 0, Math.PI * 2);
      dnsCtx.fillStyle = color;
      dnsCtx.fill();
      dnsCtx.beginPath();
      dnsCtx.arc(x, y, 10, 0, Math.PI * 2);
      dnsCtx.strokeStyle = color + '80';
      dnsCtx.lineWidth = 2;
      dnsCtx.stroke();

      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

async function resolveDomain() {
  if (dnsResolving) return;
  dnsResolving = true;
  const s = LANG[currentLang];
  const domain = $('domainInput').value.trim().toLowerCase() || 'www.example.com';
  const stepEl = $('stepDisplay');
  const cacheEl = $('cacheDisplay');

  showToast(s.resolving);
  log(`${s.resolving} ${domain}`, 'tx');
  setStatus(true);

  if (stepEl) { stepEl.style.display = 'block'; stepEl.innerHTML = ''; }

  function addStep(text, color) {
    if (!stepEl) return;
    const div = document.createElement('div');
    div.style.cssText = `padding:.4rem .6rem;margin-bottom:.3rem;border-radius:6px;border-left:3px solid ${color};background:${color}15;animation:fadeIn .3s ease;`;
    div.textContent = text;
    stepEl.appendChild(div);
  }

  // Lookup in our DB or generate random
  let record = DNS_DB[domain];
  if (!record) {
    record = {
      ip: `${Math.floor(Math.random()*223)+1}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}.${Math.floor(Math.random()*256)}`,
      tld: '.' + domain.split('.').pop(),
      ns: `ns1.${domain.split('.').slice(-2).join('.')}`,
      ttl: Math.floor(Math.random() * 3600) + 300
    };
  }

  // Check cache first
  if (dnsCache[domain] && Date.now() - dnsCache[domain].ts < dnsCache[domain].ttl * 1000) {
    addStep(`${s.step1} — ${s.cached}! ${domain} -> ${dnsCache[domain].ip}`, '#66bb6a');
    log(`${s.cached}: ${domain} -> ${dnsCache[domain].ip}`, 'success');
    drawDnsBase();
    hideToast();
    dnsResolving = false;
    return;
  }

  // Step 1: Browser checks cache
  addStep(s.step1 + ' — ' + s.noCache, '#4fc3f7');
  await sleep(500);

  // Step 2: Query to resolver
  addStep(s.step2, '#ffa726');
  await animatePacket(0, 1, '#4fc3f7', 800);
  log(`Browser -> Resolver: ${domain}?`, 'tx');
  await sleep(300);

  // Step 3: Resolver queries root
  addStep(s.step3, '#ef5350');
  await animatePacket(1, 2, '#ffa726', 800);
  log(`Resolver -> Root: ${domain}?`, 'tx');
  await sleep(400);

  // Step 4: Root refers to TLD
  addStep(`${s.step4} (${record.tld})`, '#ef5350');
  await animatePacket(2, 1, '#ef5350', 600);
  log(`Root -> Resolver: Go to ${record.tld} TLD`, 'rx');
  await sleep(300);

  // Step 5: Resolver queries TLD
  addStep(s.step5, '#ab47bc');
  await animatePacket(1, 3, '#ffa726', 800);
  log(`Resolver -> TLD: ${domain}?`, 'tx');
  await sleep(400);

  // Step 6: TLD refers to authoritative
  addStep(`${s.step6} (${record.ns})`, '#ab47bc');
  await animatePacket(3, 1, '#ab47bc', 600);
  log(`TLD -> Resolver: Go to ${record.ns}`, 'rx');
  await sleep(300);

  // Step 7: Resolver queries authoritative
  addStep(s.step7, '#66bb6a');
  await animatePacket(1, 4, '#ffa726', 800);
  log(`Resolver -> Auth: ${domain}?`, 'tx');
  await sleep(400);

  // Step 8: Authoritative returns IP
  addStep(`${s.step8}: ${record.ip}`, '#66bb6a');
  await animatePacket(4, 1, '#66bb6a', 600);
  log(`Auth -> Resolver: A ${record.ip}`, 'rx');
  await sleep(300);

  // Step 9: Resolver returns to browser
  addStep(`${s.step9}: ${record.ip} (TTL: ${record.ttl}s)`, '#4fc3f7');
  await animatePacket(1, 0, '#66bb6a', 800);
  log(`Resolver -> Browser: ${record.ip} (TTL ${record.ttl}s)`, 'rx');

  // Cache the result
  dnsCache[domain] = { ip: record.ip, ttl: record.ttl, ts: Date.now() };
  resolveHistory.push({ domain, ip: record.ip, time: new Date().toLocaleTimeString() });
  updateCacheDisplay();
  updateHistoryDisplay();

  hideToast();
  log(`${s.resolved} ${domain} -> ${record.ip}`, 'success');
  dnsResolving = false;
}

function updateCacheDisplay() {
  const el = $('cacheDisplay');
  const table = $('cacheTable');
  if (!el || !table) return;
  el.style.display = 'block';

  const s = LANG[currentLang];
  let html = '<div style="display:grid;gap:.3rem;">';
  for (const [domain, rec] of Object.entries(dnsCache)) {
    const remaining = Math.max(0, Math.round(rec.ttl - (Date.now() - rec.ts) / 1000));
    const pct = remaining / rec.ttl * 100;
    const color = pct > 50 ? '#66bb6a' : pct > 20 ? '#ffa726' : '#ef5350';
    html += `<div style="display:flex;align-items:center;gap:.5rem;padding:.3rem .5rem;background:rgba(255,255,255,0.03);border-radius:4px;font-family:monospace;">
      <span style="flex:1;">${domain}</span>
      <span style="color:#4fc3f7;">${rec.ip}</span>
      <span style="color:${color};min-width:60px;text-align:right;">${s.ttl}: ${remaining}s</span>
    </div>`;
  }
  html += '</div>';
  table.innerHTML = html;
}

function updateHistoryDisplay() {
  const el = $('historyList');
  if (!el) return;
  let html = '';
  resolveHistory.slice(-10).reverse().forEach(h => {
    html += `<div style="padding:.3rem .5rem;margin-bottom:.2rem;background:rgba(255,255,255,0.03);border-radius:4px;font-size:.8rem;">
      <strong>${h.domain}</strong> -> ${h.ip} <span style="opacity:.5;margin-inline-start:.5rem;">${h.time}</span>
    </div>`;
  });
  el.innerHTML = html || '<em style="opacity:.5;">No history yet</em>';
}

function initDnsOdyssey() {
  dnsCanvas = $('dnsCanvas');
  if (dnsCanvas) {
    dnsCtx = dnsCanvas.getContext('2d');
    drawDnsBase();
  }
  const rb = $('resolveBtn');
  if (rb) rb.addEventListener('click', resolveDomain);
  const input = $('domainInput');
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') resolveDomain(); });
}

const styleTag = document.createElement('style');
styleTag.textContent = `@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`;
document.head.appendChild(styleTag);

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
  initDnsOdyssey();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: DNS Cache TTL Countdown & Query Stats ═══════ */
(function(){
let qCanvas,qCtx;const queryStats={total:0,cached:0,recursive:0};const latencyHistory=[];
function createQC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">DNS Query Statistics & TTL Monitor</div>';
  const c=document.createElement('canvas');c.width=650;c.height=240;
  c.style.cssText='width:100%;height:auto;display:block;background:#0a0e1a;';
  w.appendChild(c);t.appendChild(w);return c;
}
function drawQC(){
  if(!qCtx)return;const w=qCanvas.width,h=qCanvas.height;
  qCtx.fillStyle='rgba(10,14,26,0.1)';qCtx.fillRect(0,0,w,h);
  qCtx.strokeStyle='rgba(255,255,255,0.03)';qCtx.lineWidth=0.5;
  for(let x=0;x<w;x+=20){qCtx.beginPath();qCtx.moveTo(x,0);qCtx.lineTo(x,h);qCtx.stroke();}
  // TTL countdown bars
  const cacheEntries=Object.entries(dnsCache);
  const barStartX=20,barY=20,barW=200,barH=14,gap=4;
  qCtx.fillStyle='rgba(255,255,255,0.5)';qCtx.font='9px Orbitron,sans-serif';qCtx.textAlign='left';
  qCtx.fillText('TTL Cache ('+cacheEntries.length+' entries)',barStartX,barY-5);
  cacheEntries.forEach(([domain,rec],i)=>{
    const y=barY+10+i*(barH+gap);if(y>h-60)return;
    const remaining=Math.max(0,rec.ttl-(Date.now()-rec.ts)/1000);
    const pct=remaining/rec.ttl;
    const color=pct>0.5?'#66bb6a':pct>0.2?'#ffa726':'#ef5350';
    qCtx.fillStyle='rgba(255,255,255,0.04)';qCtx.fillRect(barStartX,y,barW,barH);
    qCtx.fillStyle=color+'44';qCtx.fillRect(barStartX,y,barW*pct,barH);
    qCtx.strokeStyle=color+'44';qCtx.lineWidth=0.5;qCtx.strokeRect(barStartX,y,barW,barH);
    qCtx.fillStyle='rgba(255,255,255,0.6)';qCtx.font='7px monospace';qCtx.textAlign='left';
    qCtx.fillText(domain.substring(0,20),barStartX+3,y+10);
    qCtx.textAlign='right';qCtx.fillStyle=color;
    qCtx.fillText(Math.round(remaining)+'s',barStartX+barW-3,y+10);qCtx.textAlign='left';
  });
  // Latency graph (right side)
  if(latencyHistory.length>100)latencyHistory.shift();
  latencyHistory.push(dnsResolving?50+Math.random()*200:5+Math.random()*20);
  const gx=280,gy=20,gw=w-gx-20,gh=h-50;
  qCtx.strokeStyle='rgba(255,255,255,0.05)';qCtx.lineWidth=1;
  qCtx.strokeRect(gx,gy,gw,gh);
  qCtx.fillStyle='rgba(255,255,255,0.4)';qCtx.font='9px Orbitron';qCtx.textAlign='left';
  qCtx.fillText('Query Latency (ms)',gx,gy-5);
  if(latencyHistory.length>1){
    qCtx.beginPath();
    latencyHistory.forEach((v,i)=>{const x=gx+gw*(i/100),y=gy+gh-Math.min(v/300,1)*gh;i===0?qCtx.moveTo(x,y):qCtx.lineTo(x,y);});
    qCtx.strokeStyle='#4fc3f788';qCtx.lineWidth=1.5;qCtx.stroke();
    // Fill under
    qCtx.lineTo(gx+gw,gy+gh);qCtx.lineTo(gx,gy+gh);qCtx.closePath();
    qCtx.fillStyle='rgba(79,195,247,0.05)';qCtx.fill();
  }
  // Query type pie chart indicators
  queryStats.total=resolveHistory.length;
  queryStats.cached=Object.keys(dnsCache).length;
  queryStats.recursive=Math.max(0,queryStats.total-queryStats.cached);
  const pieX=gx+gw/2,pieY=gy+gh+18;
  qCtx.fillStyle='rgba(255,255,255,0.3)';qCtx.font='8px monospace';qCtx.textAlign='center';
  qCtx.fillText('Total: '+queryStats.total+' | Cached: '+queryStats.cached+' | Recursive: '+queryStats.recursive,pieX,pieY);
  // Active resolution indicator
  if(dnsResolving){
    const flash=Math.sin(Date.now()/200)>0;
    qCtx.fillStyle=flash?'rgba(79,195,247,0.2)':'transparent';
    qCtx.fillRect(gx,gy,gw,3);
  }
  requestAnimationFrame(drawQC);
}
function initQC(){qCanvas=createQC();if(!qCanvas)return;qCtx=qCanvas.getContext('2d');drawQC();}
setTimeout(initQC,2000);
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
