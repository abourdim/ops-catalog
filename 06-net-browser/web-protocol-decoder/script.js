/**
 * Protocol Decoder — Packet Autopsy
 * Workshop DIY — Net Browser Collection
 * Paste hex and watch layer-by-layer decoding
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.139885 78.322945 253.991455 136.254120"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752C203.799835,145.619583,204.629318,145.619736,205.933762,145.784378C212.620331,146.628281,217.423569,150.723984,219.325882,157.203781C219.72139,158.550934,219.771454,162.692093,219.406631,163.88208C218.187943,167.857361,216.579514,170.301239,213.792847,172.411835C209.455261,175.697083,203.83429,176.563141,198.809494,174.720413C197.244873,174.146637,196.144424,173.544434,194.478638,172.350433C191.905991,170.506454,190.53334,169.740753,188.031555,168.754135L187.293335,168.462997L187.308884,160.785461C187.317429,156.56282,187.36911,153.000763,187.423706,152.869797z"/><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M259.791718,157.665863L264.87912,148.034195L272.338226,148.034195L263.03244,163.730896L263.03244,174.991974L256.261322,174.991974L256.261322,164.07489L246.792618,148.034195L254.505173,148.034195L259.791718,157.665863z"/><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M240.369812,152.741394L236.495438,152.741394L236.495438,170.284775L240.369812,170.284775L240.369812,174.991974L225.849915,174.991974L225.849915,170.284775L229.724304,170.284775L229.724304,152.741394L225.849915,152.741394L225.849915,148.034195L240.369812,148.034195L240.369812,152.741394z"/></svg>`;
const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAABAGlDQ1BpY2MAABiVY2BgPMEABCwGDAy5eSVFQe5OChGRUQrsDxgYgRAMEpOLCxhwA6Cqb9cgai/r4lGHC3CmpBYnA+kPQKxSBLQcaKQIkC2SDmFrgNhJELYNiF1eUlACZAeA2EUhQc5AdgqQrZGOxE5CYicXFIHU9wDZNrk5pckIdzPwpOaFBgNpDiCWYShmCGJwZ3AC+R+iJH8RA4PFVwYG5gkIsaSZDAzbWxkYJG4hxFQWMDDwtzAwbDuPEEOESUFiUSJYiAWImdLSGBg+LWdg4I1kYBC+wMDAFQ0LCBxuUwC7zZ0hHwjTGXIYUoEingx5DMkMekCWEYMBgyGDGQCm1j8/yRb+6wAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJTUUH6gMKAjgH2Wn1xgAADEhJREFUeNrtmXtsVNedx7/n3Nfce2eu5+kZezx+MOMZO2PjOOAHBNdAbAR2Uchjo6br7YISqFiiRFrSKIrUAGLdpJtEVTdSkaJVUsRuVEVyE2GSUqALbDYP0WR5WCU2sbFj3MTYBgebuWPPzL1n/wCzxPEjJgmj1c5HOn/NOb97vt9zH7/fb4AMGTJkyJAhQ4YMGf4/Qr6LICdOnIAoimRychIAWE1NTbp1ff+89dZbsNlsiEaj2W63+6eapu212Wyvulyuza';
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.2';

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain(); osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08; const t = audioCtx.currentTime; switch(type) { case 'click': osc.frequency.value=800; osc.type='sine'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.08); osc.start(t); osc.stop(t+0.08); break; case 'success': osc.frequency.value=523; osc.type='sine'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.3); osc.start(t); osc.stop(t+0.3); break; case 'error': osc.frequency.value=200; osc.type='square'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.25); osc.start(t); osc.stop(t+0.25); break; } }

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

const LANG = {
  en: {
    ...LANG_BASE.en,
    title:'Protocol Decoder', subtitle:'📋 Layer-by-layer packet decoding',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'Packet Autopsy', mainDesc:'Paste hex and watch layer-by-layer decoding',
    sectionA:'OSI Model Layers', sectionB:'Hex Encoding Guide', sectionC:'Protocol Reference',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', theme:'Theme', settings:'⚙️ Settings', language:'Language',
    help:'❓ Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.', howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "OSI Model Layers" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.', howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_themes_title:'🎨 Themes', wiki_themes:'8 built-in themes. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.', wiki_i18n_title:'🌐 Languages', wiki_i18n:'Trilingual: EN, FR, AR with RTL. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_log_title:'📜 Activity Log', wiki_log:'Timestamped, color-coded log. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.', wiki_privacy_title:'🔒 Privacy', wiki_privacy:'Local-first. All data stays in your browser. This application processes everything locally in your browser using JavaScript. No data is sent to any server. Your experiments, settings, and results stay on your device. This architecture is called "local-first" and guarantees complete data privacy.',
    working:'Working…', t_mosque:'Mosque', t_zellige:'Zellige', t_andalus:'Andalus', t_riad:'Riad', t_medina:'Medina', t_space:'Space', t_jungle:'Jungle', t_robot:'Robot',
    ready:'📋 Protocol Decoder ready!', logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed',
    export:'Export', filterAll:'All', soundEffects:'🔊 Sound effects', whisperMode:'Whisper mode', breathingGuide:'Breathing guide', dhikrTap:'Tap', musicMode:'Music reactive',
    splashHint:'tap to skip', newVersion:'UPDATE', langChanged:'🌐 Language → English', themeChanged:'🎨 Theme →',
    hexPlaceholder:'Paste hex bytes here...', decodeBtn:'Decode',
    sampleHTTP:'HTTP GET', sampleDNS:'DNS Query', sampleTCP:'TCP SYN',
    osiText:'The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application. Network packets are encapsulated layer by layer.',
    hexText:'Hexadecimal (base-16) represents binary data using digits 0-9 and letters A-F. Each hex pair represents one byte.',
    protoRefText:'Quick reference for common protocol fields and their byte positions in a packet.',
    showRefBtn:'Show Reference Table',
    layerEthernet:'Ethernet Layer (L2)', layerIP:'IP Layer (L3)', layerTCP:'TCP Layer (L4)', layerHTTP:'HTTP Layer (L7)',
    layerUDP:'UDP Layer (L4)', layerDNS:'DNS Layer (L7)',
    decoding:'Decoding packet...', decoded:'Packet decoded!', invalidHex:'Invalid hex input',
    srcMAC:'Src MAC', dstMAC:'Dst MAC', etherType:'EtherType',
    srcIP:'Src IP', dstIP:'Dst IP', ttl:'TTL', protocol:'Protocol', version:'Version', headerLen:'Header Length',
    srcPort:'Src Port', dstPort:'Dst Port', seqNum:'Seq Number', flags:'Flags', windowSize:'Window Size',
    method:'Method', host:'Host', path:'Path', httpVer:'HTTP Version',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code',faq_q1:'What is Protocol Decoder?',faq_a1:'Protocol Decoder lets you paste hex and watch layer-by-layer decoding. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real networking behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Paste hex bytes or click a sample button. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real networking principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Browser only. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Web Bgp Simulator and Web Blockchain Messenger. Each app in this category teaches a different aspect of networking.',demo_s1:'Welcome to Protocol Decoder! Look at the main display — this is where the networking simulation runs.',demo_s2:'Paste hex bytes or click a sample button. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "OSI Model Layers" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of networking.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how networking works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches networking concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Packet Trace',ch1Desc:'Send a message through the network and trace every hop it takes. How many nodes does it pass through? What happens if one goes down?',ch2Title:'Latency Hunt',ch2Desc:'Find the bottleneck in the network by measuring latency at each node. Which link is the slowest and why?',ch3Title:'Security Audit',ch3Desc:'Try to find the unencrypted channel in the network. What information can you see? How would you fix it?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Protocol Decoder: Paste hex and watch layer-by-layer decoding. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Scan through Capture to Analyze and Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "OSI Model Layers" and "Hex Encoding Guide" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Antenna Engineering',
    wiki_history: 'The field of antenna engineering has evolved significantly over the past century. Early pioneers developed foundational techniques using analog equipment. The digital revolution transformed antenna engineering by enabling software-defined approaches. Modern practitioners use tools like HackRF SDR to perform tasks that once required rooms full of equipment. Understanding this history helps you appreciate why certain protocols and standards exist today.',
    wiki_math_title: '📐 Mathematics Behind Web Protocol Decoder',
    wiki_math: 'The mathematics underpinning web protocol decoder involves several key concepts. Signal processing relies on Fourier transforms to convert between time and frequency domains. Information theory (Shannon entropy) determines the theoretical limits of data transmission. Probability and statistics help distinguish real signals from noise. Linear algebra enables matrix operations used in encryption and modulation. Understanding these mathematical foundations lets you predict system behavior before building it.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced antenna engineering practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to antenna engineering. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with antenna engineering: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in antenna engineering.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Antenna Engineering carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Signal',
    gloss1_def: 'A varying quantity (voltage, electromagnetic wave, or data stream) that carries information. In this simulation, signals are represented visually so you can see how they change over time and respond to your controls.',
    gloss2_term: 'Parameter',
    gloss2_def: 'A configurable value that changes system behavior. Each slider and input in this app controls a specific parameter. Changing parameters lets you explore cause-and-effect relationships in the simulation.',
    gloss3_term: 'Simulation',
    gloss3_def: 'A software model that mimics real-world behavior. This app simulates real equipment and processes so you can learn safely without hardware. The physics and mathematics are real — only the signals are virtual.',
    gloss4_term: 'Protocol',
    gloss4_def: 'A set of rules that defines how data is formatted, transmitted, and received. Protocols ensure that different devices can communicate. Examples include WiFi (802.11), Bluetooth, HTTP, and TCP/IP.',
    gloss5_term: 'Frequency',
    gloss5_def: 'The number of cycles a signal completes per second, measured in Hertz (Hz). Higher frequencies carry more data but travel shorter distances. Radio frequencies range from 3 kHz to 300 GHz.',
    gloss6_term: 'Encryption',
    gloss6_def: 'The process of converting readable data (plaintext) into an unreadable format (ciphertext) using a mathematical algorithm and a key. Only someone with the correct key can decrypt and read the original data.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Understanding the theory behind web protocol decoder requires grasping several interconnected concepts from antenna engineering. At the most fundamental level, this technology works by manipulating signals — whether electromagnetic waves, digital data streams, or sensor readings. The simulation in this app models these real-world phenomena using mathematical equations running in your browser. Every button press and slider adjustment maps to a real parameter that engineers and researchers tune in professional settings. The key principle is that information can be encoded, transmitted, processed, and decoded using well-defined mathematical operations. Fourier analysis breaks complex signals into simple sine waves. Shannon information theory tells us the maximum data rate for any communication channel. Error correction codes add redundancy so messages survive noise and interference. By experimenting with this simulation, you build intuition for these principles — the same intuition that professionals develop over years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world antenna engineering?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional antenna engineering systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title:'Protocol Decoder', subtitle:'📋 Decodage couche par couche',
    disconnected:'Deconnecte', connected:'Connecte',
    mainSection:'Autopsie de paquet', mainDesc:'Collez du hex et regardez le decodage couche par couche',
    sectionA:'Couches du modele OSI', sectionB:'Guide encodage hex', sectionC:'Reference protocoles',
    activityLog:'Journal', eventsMsg:'Evenements et messages',
    clear:'Effacer', copy:'Copier', theme:'Theme', settings:'⚙️ Parametres', language:'Langue',
    help:'❓ Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    howto_1:'Regarde la carte principale en haut. C\'est ton panneau de contrôle. Règle les paramètres avec les curseurs et menus déroulants. Chacun est étiqueté. Commence avec les valeurs par défaut pour voir le comportement normal.', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.', howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_themes_title:'🎨 Themes', wiki_themes:'8 themes integres.', wiki_i18n_title:'🌐 Langues', wiki_i18n:'Trilingue : EN, FR, AR.',
    wiki_log_title:'📜 Journal', wiki_log:'Journal horodate.', wiki_privacy_title:'🔒 Confidentialite', wiki_privacy:'Local-first.',
    working:'En cours…', t_mosque:'Mosquee', t_zellige:'Zellige', t_andalus:'Andalous', t_riad:'Riad', t_medina:'Medina', t_space:'Espace', t_jungle:'Jungle', t_robot:'Robot',
    ready:'📋 Protocol Decoder pret !', logCleared:'Journal efface', copied:'Copie !', copyFail:'Echec',
    export:'Exporter', filterAll:'Tout', soundEffects:'🔊 Effets sonores', whisperMode:'Mode murmure', breathingGuide:'Guide respiratoire', dhikrTap:'Tap', musicMode:'Reactif musique',
    splashHint:'appuyer pour passer', newVersion:'MAJ', langChanged:'🌐 Langue → Francais', themeChanged:'🎨 Theme →',
    hexPlaceholder:'Collez des octets hex ici...', decodeBtn:'Decoder',
    sampleHTTP:'HTTP GET', sampleDNS:'Requete DNS', sampleTCP:'TCP SYN',
    osiText:'Le modele OSI a 7 couches. Les paquets sont encapsules couche par couche.',
    hexText:'L\'hexadecimal (base-16) represente les donnees binaires avec 0-9 et A-F.',
    protoRefText:'Reference rapide des champs protocolaires.', showRefBtn:'Afficher la reference',
    layerEthernet:'Couche Ethernet (L2)', layerIP:'Couche IP (L3)', layerTCP:'Couche TCP (L4)', layerHTTP:'Couche HTTP (L7)',
    layerUDP:'Couche UDP (L4)', layerDNS:'Couche DNS (L7)',
    decoding:'Decodage du paquet...', decoded:'Paquet decode !', invalidHex:'Hex invalide',
    srcMAC:'MAC Src', dstMAC:'MAC Dst', etherType:'EtherType',
    srcIP:'IP Src', dstIP:'IP Dst', ttl:'TTL', protocol:'Protocole', version:'Version', headerLen:'Longueur entete',
    srcPort:'Port Src', dstPort:'Port Dst', seqNum:'Num Sequence', flags:'Drapeaux', windowSize:'Taille fenetre',
    method:'Methode', host:'Hote', path:'Chemin', httpVer:'Version HTTP',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Protocol Decoder ?',faq_a1:'Protocol Decoder te permet de simuler réseaux. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de réseaux. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de réseaux. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Browser only. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de réseaux.',demo_s1:'Bienvenue dans Protocol Decoder ! Regarde l\'écran principal — c\'est ici que la simulation de réseaux fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de réseaux.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'How to discover devices and services on a network. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'How to spot and stop network attacks. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne réseaux en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de réseaux par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Trace de Paquets',ch1Desc:'Envoie un message et trace chaque saut. Combien de nœuds traverse-t-il ? Que se passe-t-il si un tombe ?',ch2Title:'Chasse à la Latence',ch2Desc:'Trouve le goulot d\'étranglement en mesurant la latence à chaque nœud. Quel lien est le plus lent et pourquoi ?',ch3Title:'Audit de Sécurité',ch3Desc:'Trouve le canal non chiffré dans le réseau. Quelles informations vois-tu ? Comment le corriger ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',purpose:'Protocol Decoder : Paste hex and watch layer-by-layer decoding. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de ingénierie d\'antennes',
    wiki_history: 'Le domaine de ingénierie d\'antennes a considérablement évolué au cours du siècle dernier. Les pionniers ont développé des techniques fondamentales avec des équipements analogiques. La révolution numérique a transformé le domaine en permettant des approches logicielles. Les praticiens modernes utilisent des outils comme HackRF SDR pour réaliser des tâches qui nécessitaient autrefois des salles entières de matériel. Comprendre cette histoire vous aide à apprécier pourquoi certains protocoles existent.',
    wiki_math_title: '📐 Mathématiques de Web Protocol Decoder',
    wiki_math: 'Les mathématiques sous-jacentes impliquent plusieurs concepts clés. Le traitement du signal repose sur les transformées de Fourier. La théorie de information (entropie de Shannon) détermine les limites théoriques. Les probabilités et statistiques distinguent les signaux du bruit. L algèbre linéaire permet les opérations matricielles pour le chiffrement et la modulation. Comprendre ces fondations permet de prédire le comportement du système.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de ingénierie d\'antennes utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour ingénierie d\'antennes. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en ingénierie d\'antennes : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Ingénierie d\'antennes implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Signal',
    gloss1_def: 'Une grandeur variable (tension, onde électromagnétique ou flux de données) qui transporte des informations. Dans cette simulation, les signaux sont représentés visuellement pour observer leurs changements.',
    gloss2_term: 'Paramètre',
    gloss2_def: 'Une valeur configurable qui modifie le comportement du système. Chaque curseur de cette app contrôle un paramètre spécifique. Modifier les paramètres permet d explorer les relations cause-effet.',
    gloss3_term: 'Simulation',
    gloss3_def: 'Un modèle logiciel qui imite le comportement réel. Cette app simule de vrais équipements pour apprendre en toute sécurité sans matériel. La physique et les mathématiques sont réelles — seuls les signaux sont virtuels.',
    gloss4_term: 'Protocole',
    gloss4_def: 'Un ensemble de règles définissant le format, la transmission et la réception des données. Les protocoles permettent la communication entre appareils différents. Exemples : WiFi, Bluetooth, HTTP, TCP/IP.',
    gloss5_term: 'Fréquence',
    gloss5_def: 'Le nombre de cycles qu un signal complète par seconde, mesuré en Hertz (Hz). Les fréquences plus élevées transportent plus de données mais parcourent de plus courtes distances.',
    gloss6_term: 'Chiffrement',
    gloss6_def: 'Le processus de conversion de données lisibles (texte clair) en format illisible (texte chiffré) à l aide d un algorithme mathématique et d une clé. Seule la bonne clé permet de déchiffrer.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Comprendre la théorie derrière cette application nécessite de saisir plusieurs concepts interconnectés de antenna engineering. Au niveau le plus fondamental, cette technologie fonctionne en manipulant des signaux — ondes électromagnétiques, flux de données numériques ou lectures de capteurs. La simulation modélise ces phénomènes réels à l aide d équations mathématiques dans votre navigateur. Chaque bouton et curseur correspond à un paramètre réel que les ingénieurs ajustent en pratique. Le principe clé est que l information peut être encodée, transmise, traitée et décodée avec des opérations mathématiques bien définies. L analyse de Fourier décompose les signaux complexes. La théorie de l information de Shannon indique le débit maximal pour tout canal de communication. Les codes correcteurs ajoutent de la redondance pour que les messages survivent au bruit. En expérimentant avec cette simulation, vous développez une intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec antenna engineering dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title:'محلل البروتوكول', subtitle:'📋 فك تشفير الحزم طبقة بطبقة',
    disconnected:'غير متصل', connected:'متصل',
    mainSection:'تشريح الحزمة', mainDesc:'الصق hex وشاهد الفك طبقة بطبقة',
    sectionA:'طبقات نموذج OSI', sectionB:'دليل ترميز Hex', sectionC:'مرجع البروتوكولات',
    activityLog:'سجل النشاط', eventsMsg:'الأحداث والرسائل',
    clear:'مسح', copy:'نسخ', theme:'المظهر', settings:'⚙️ الإعدادات', language:'اللغة',
    help:'❓ مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي',
    howto_1:'انظر إلى البطاقة الرئيسية في الأعلى. هذه لوحة التحكم. اضبط المعاملات باستخدام المنزلقات والقوائم. ابدأ بالقيم الافتراضية لرؤية السلوك الطبيعي أولاً.', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.', howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_themes_title:'🎨 المظاهر', wiki_themes:'8 مظاهر مدمجة.', wiki_i18n_title:'🌐 اللغات', wiki_i18n:'ثلاثي اللغات.',
    wiki_log_title:'📜 سجل النشاط', wiki_log:'سجل مؤرّخ.', wiki_privacy_title:'🔒 الخصوصية', wiki_privacy:'محلي أولاً.',
    working:'جارٍ…', t_mosque:'مسجد', t_zellige:'زليج', t_andalus:'أندلس', t_riad:'رياض', t_medina:'مدينة', t_space:'فضاء', t_jungle:'أدغال', t_robot:'روبوت',
    ready:'📋 محلل البروتوكول جاهز!', logCleared:'تم مسح السجل', copied:'تم النسخ!', copyFail:'فشل النسخ',
    export:'تصدير', filterAll:'الكل', soundEffects:'🔊 مؤثرات صوتية', whisperMode:'وضع الهمس', breathingGuide:'دليل التنفس', dhikrTap:'اضغط', musicMode:'تفاعل موسيقي',
    splashHint:'انقر للتخطي', newVersion:'تحديث', langChanged:'🌐 اللغة ← العربية', themeChanged:'🎨 المظهر ←',
    hexPlaceholder:'الصق بايتات hex هنا...', decodeBtn:'فك التشفير',
    sampleHTTP:'HTTP GET', sampleDNS:'استعلام DNS', sampleTCP:'TCP SYN',
    osiText:'نموذج OSI يحتوي 7 طبقات. الحزم مغلفة طبقة بطبقة.',
    hexText:'النظام الست عشري يمثل البيانات الثنائية باستخدام 0-9 و A-F.',
    protoRefText:'مرجع سريع لحقول البروتوكولات.', showRefBtn:'عرض جدول المرجع',
    layerEthernet:'طبقة Ethernet (L2)', layerIP:'طبقة IP (L3)', layerTCP:'طبقة TCP (L4)', layerHTTP:'طبقة HTTP (L7)',
    layerUDP:'طبقة UDP (L4)', layerDNS:'طبقة DNS (L7)',
    decoding:'جاري فك تشفير الحزمة...', decoded:'تم فك تشفير الحزمة!', invalidHex:'إدخال hex غير صالح',
    srcMAC:'MAC المصدر', dstMAC:'MAC الوجهة', etherType:'نوع Ether',
    srcIP:'IP المصدر', dstIP:'IP الوجهة', ttl:'TTL', protocol:'بروتوكول', version:'إصدار', headerLen:'طول الرأس',
    srcPort:'منفذ المصدر', dstPort:'منفذ الوجهة', seqNum:'رقم التسلسل', flags:'أعلام', windowSize:'حجم النافذة',
    method:'الطريقة', host:'المضيف', path:'المسار', httpVer:'إصدار HTTP',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Protocol Decoder؟',faq_a1:'Protocol Decoder يتيح لك محاكاة الشبكات. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الشبكات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الشبكات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Browser only. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الشبكات.',demo_s1:'مرحباً في Protocol Decoder! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الشبكات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالشبكات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'How to discover devices and services on a network. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'How to spot and stop network attacks. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل الشبكات من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الشبكات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'تتبع الحزم',ch1Desc:'أرسل رسالة وتتبع كل قفزة. كم عقدة تمر بها؟ ماذا يحدث إذا سقطت واحدة؟',ch2Title:'البحث عن التأخير',ch2Desc:'اعثر على عنق الزجاجة بقياس التأخير في كل عقدة. أي رابط الأبطأ ولماذا؟',ch3Title:'تدقيق الأمان',ch3Desc:'ابحث عن القناة غير المشفرة. ما المعلومات التي تراها؟ كيف تصلحها؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',purpose:'Protocol Decoder: Paste hex and watch layer-by-layer decoding. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ هندسة الهوائيات',
    wiki_history: 'تطور مجال هندسة الهوائيات بشكل كبير خلال القرن الماضي. طور الرواد تقنيات أساسية باستخدام معدات تناظرية. حولت الثورة الرقمية المجال من خلال تمكين الأساليب البرمجية. يستخدم الممارسون المعاصرون أدوات مثل HackRF SDR لأداء مهام كانت تتطلب في السابق غرفاً كاملة من المعدات. فهم هذا التاريخ يساعدك على تقدير سبب وجود بروتوكولات ومعايير معينة اليوم.',
    wiki_math_title: '📐 الرياضيات وراء Web Protocol Decoder',
    wiki_math: 'تتضمن الرياضيات الكامنة عدة مفاهيم أساسية. تعتمد معالجة الإشارات على تحويلات فورييه للتحويل بين مجالي الزمن والتردد. تحدد نظرية المعلومات (إنتروبيا شانون) الحدود النظرية لنقل البيانات. تساعد الاحتمالات والإحصاء في تمييز الإشارات الحقيقية من الضوضاء. يتيح الجبر الخطي العمليات المصفوفية المستخدمة في التشفير والتعديل.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو هندسة الهوائيات المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في هندسة الهوائيات. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في هندسة الهوائيات: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'هندسة الهوائيات يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'إشارة',
    gloss1_def: 'كمية متغيرة (جهد كهربائي أو موجة كهرومغناطيسية أو تدفق بيانات) تحمل معلومات. في هذه المحاكاة، تُمثل الإشارات بصرياً لمراقبة تغيراتها مع الوقت.',
    gloss2_term: 'معامل',
    gloss2_def: 'قيمة قابلة للتكوين تغير سلوك النظام. كل شريط تمرير في هذا التطبيق يتحكم في معامل محدد. تغيير المعاملات يتيح لك استكشاف علاقات السبب والنتيجة.',
    gloss3_term: 'محاكاة',
    gloss3_def: 'نموذج برمجي يحاكي السلوك الحقيقي. يحاكي هذا التطبيق معدات وعمليات حقيقية للتعلم بأمان بدون أجهزة. الفيزياء والرياضيات حقيقية — الإشارات فقط افتراضية.',
    gloss4_term: 'بروتوكول',
    gloss4_def: 'مجموعة قواعد تحدد كيفية تنسيق البيانات وإرسالها واستقبالها. تضمن البروتوكولات تواصل الأجهزة المختلفة. أمثلة: واي فاي وبلوتوث و HTTP و TCP/IP.',
    gloss5_term: 'تردد',
    gloss5_def: 'عدد الدورات التي تكملها إشارة في الثانية، يُقاس بالهرتز. الترددات الأعلى تحمل بيانات أكثر لكنها تنتقل لمسافات أقصر. تتراوح ترددات الراديو من 3 كيلوهرتز إلى 300 غيغاهرتز.',
    gloss6_term: 'تشفير',
    gloss6_def: 'عملية تحويل البيانات المقروءة (نص عادي) إلى صيغة غير مقروءة (نص مشفر) باستخدام خوارزمية رياضية ومفتاح. فقط من يملك المفتاح الصحيح يمكنه فك التشفير.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'فهم النظرية الكامنة وراء هذا التطبيق يتطلب استيعاب عدة مفاهيم مترابطة من antenna engineering. على المستوى الأساسي، تعمل هذه التقنية عن طريق التلاعب بالإشارات — سواء كانت موجات كهرومغناطيسية أو تدفقات بيانات رقمية أو قراءات مستشعرات. تحاكي هذه المحاكاة الظواهر الحقيقية باستخدام معادلات رياضية تعمل في متصفحك. كل زر ومنزلق يتوافق مع معامل حقيقي يضبطه المهندسون والباحثون في الإعدادات المهنية. المبدأ الأساسي هو أن المعلومات يمكن ترميزها ونقلها ومعالجتها وفك ترميزها باستخدام عمليات رياضية محددة. يحلل تحليل فورييه الإشارات المعقدة إلى موجات جيبية بسيطة. تحدد نظرية المعلومات لشانون الحد الأقصى لمعدل البيانات. تضيف رموز تصحيح الأخطاء التكرار حتى تنجو الرسائل من الضوضاء والتداخل.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـantenna engineering في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

let currentLang = 'en';
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.querySelectorAll('[data-i18n-opt]').forEach(opt => { const k = opt.dataset.i18nOpt; if (s[k] != null) opt.textContent = s[k]; }); document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k = el.dataset.i18nPlaceholder; if (s[k] != null) el.placeholder = s[k]; }); document.title = `${s.title} — Workshop DIY`; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
function setTheme(name) { document.documentElement.dataset.theme = name; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name)); const sel = $('themeSelect'); if (sel) sel.value = name; const s = LANG[currentLang]; try { localStorage.setItem('wdiy-theme', name); } catch {} playThemeMelody(name); log(`${s.themeChanged} ${s['t_'+name]||name}`, 'info'); }

let logContainer, typewriterEnabled = true;
function log(msg, type='info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${type}`; const ft = `[${new Date().toLocaleTimeString()}] ${msg}`; if (typewriterEnabled) { logContainer.appendChild(d); typewriterAppend(d, ft); } else { d.textContent = ft; logContainer.appendChild(d); } logContainer.scrollTop = logContainer.scrollHeight; if (type==='success') { playSound('success'); pulseBismillah('success'); setPetState('happy'); } else if (type==='error') { playSound('error'); pulseBismillah('error'); setPetState('sad'); } logHistory.push({msg,type,ts:Date.now()}); applyLogFilter(); resetPetSleep(); }
function clearLog() { if (!logContainer) logContainer=$('logContainer'); if (logContainer) logContainer.innerHTML=''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer=$('logContainer'); if (!logContainer) return; const t = Array.from(logContainer.children).map(d=>d.textContent).join('\n'); try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied,'success'); } catch { log(LANG[currentLang].copyFail,'error'); } }
function exportLog() { if (!logContainer) logContainer=$('logContainer'); if (!logContainer) return; const blob = new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'}); const u=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=u; a.download=`protocol-decoder-log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); URL.revokeObjectURL(u); }

let toastTimer = null;
function showToast(msg, ms=0) { const el=$('toastIndicator'),t=$('toastMessage'); if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';} if(toastTimer)clearTimeout(toastTimer); if(ms>0)toastTimer=setTimeout(hideToast,ms); }
function hideToast() { const el=$('toastIndicator'); if(el)el.style.display='none'; if(toastTimer){clearTimeout(toastTimer);toastTimer=null;} }
function setStatus(c) { const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang]; if(t)t.textContent=c?s.connected:s.disconnected; if(p)p.classList.toggle('connected',c); }
let splashTimer;
function dismissSplash() { const s=$('splash'); if(!s)return; s.classList.add('hidden'); if(splashTimer)clearTimeout(splashTimer); setTimeout(()=>s.remove(),600); playSound('click'); }
function initSplash() { const s=$('splash'); if(!s)return; const sl=$('splashLogo'); if(sl)sl.innerHTML=LOGO_SVG; splashTimer=setTimeout(dismissSplash,2500); }

function sleep(ms) { return new Promise(r=>setTimeout(r,ms)); }
async function typewriterAppend(el, text) { el.classList.add('typing'); el.textContent=''; for(let i=0;i<text.length;i++){el.textContent+=text[i]; if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight; await sleep(12+Math.random()*18);} el.classList.remove('typing'); }
const logHistory = [];
function pulseBismillah(type) { const b=document.querySelector('.bismillah'); if(!b)return; b.classList.remove('pulse-success','pulse-error'); void b.offsetWidth; b.classList.add(type==='error'?'pulse-error':'pulse-success'); setTimeout(()=>b.classList.remove('pulse-success','pulse-error'),700); }

const THEME_MELODIES = {'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(name) { if(!soundEnabled)return; if(!audioCtx)audioCtx=new AudioCtx(); const notes=THEME_MELODIES[name]; if(!notes)return; const t=audioCtx.currentTime; notes.forEach((f,i)=>{const o=audioCtx.createOscillator();const g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);}); }

let activeLogFilter='all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});}); }
function applyLogFilter() { if(!logContainer)logContainer=$('logContainer'); if(!logContainer)return; Array.from(logContainer.children).forEach(l=>{if(activeLogFilter==='all'){l.style.display='';return;} l.style.display=l.classList.contains(activeLogFilter)?'':'none';}); }

const PET_STATES={idle:{class:'pet-idle',duration:0},happy:{class:'pet-happy',duration:3000},sad:{class:'pet-sad',duration:3000},sleep:{class:'pet-sleep',duration:0}};
let petState='idle',petIdleTimer=null,petSleepTimer=null;
function initPixelPet(){const p=document.createElement('div');p.id='pixelPet';p.className='pixel-pet pet-idle';p.innerHTML=`<img src="${FOOTER_ICON}" alt="Bot"/>`;p.addEventListener('click',()=>{setPetState('happy');playSound('success');});const f=document.querySelector('.app-footer');if(f)f.insertBefore(p,f.firstChild);}
function setPetState(s){petState=s;const p=$('pixelPet');if(!p)return;p.classList.remove('pet-idle','pet-happy','pet-sad','pet-sleep');p.classList.add(PET_STATES[s].class);if(petIdleTimer)clearTimeout(petIdleTimer);const d=PET_STATES[s].duration;if(d>0)petIdleTimer=setTimeout(()=>setPetState('idle'),d);}
function resetPetSleep(){if(petSleepTimer)clearTimeout(petSleepTimer);if(petState==='sleep')setPetState('idle');petSleepTimer=setTimeout(()=>setPetState('sleep'),60000);}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

let breathingActive=false,dhikrCount=0;
function toggleBreathing(){const bands=document.querySelectorAll('.deco-band');breathingActive=!breathingActive;if(breathingActive){bands.forEach(b=>b.classList.add('breathing'));log('🫁 Breathing guide on','info');}else{bands.forEach(b=>b.classList.remove('breathing'));if(dhikrCount>0)log(`📿 Dhikr: ${dhikrCount}`,'success');dhikrCount=0;log('🫁 Breathing guide off','info');}}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}

let recognition=null,whisperActive=false;
function toggleWhisper(){if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){log('🎤 Speech not supported','error');return;}if(whisperActive){if(recognition)recognition.stop();whisperActive=false;log('🎤 Whisper off','info');return;}const SR=window.SpeechRecognition||window.webkitSpeechRecognition;recognition=new SR();recognition.continuous=true;recognition.interimResults=false;recognition.lang=currentLang==='ar'?'ar-DZ':currentLang==='fr'?'fr-FR':'en-US';recognition.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++){if(e.results[i].isFinal){const t=e.results[i][0].transcript.trim();if(t)log(`🎤 ${t}`,'rx');}}};recognition.onerror=e=>log(`🎤 Error: ${e.error}`,'error');recognition.onend=()=>{if(whisperActive)recognition.start();};recognition.start();whisperActive=true;log('🎤 Whisper on','success');}

const FOCUSABLE='button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');if(sb){const f=sb.querySelector(FOCUSABLE);if(f)f.focus();}}
function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(rid);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const t=$('help'+n.charAt(0).toUpperCase()+n.slice(1));if(t)t.classList.add('active');});});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;const rtl=()=>document.documentElement.dir==='rtl';h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;h.classList.add('active');document.body.style.cursor='col-resize';document.body.style.userSelect='none';e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=rtl()?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{if(!d)return;d=false;h.classList.remove('active');document.body.style.cursor='';document.body.style.userSelect='';});}

const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}

let matrixRunning=false,matrixAnim=null;
const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const cols=Math.floor(c.width/16);const drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';let cc=0,ct=null;l.addEventListener('click',()=>{cc++;if(ct)clearTimeout(ct);if(cc>=3){cc=0;toggleMatrix();}else ct=setTimeout(()=>cc=0,500);});}

/* ══════════════════════════════════════════════════════════════
   PROTOCOL DECODER ENGINE
   ══════════════════════════════════════════════════════════════ */

const LAYER_COLORS = {
  ethernet: '#3b82f6',
  ip: '#22c55e',
  tcp: '#f59e0b',
  udp: '#a855f7',
  http: '#ef4444',
  dns: '#ec4899',
};

const SAMPLE_PACKETS = {
  http: 'AA BB CC DD EE FF 11 22 33 44 55 66 08 00 45 00 00 3C 1C 46 40 00 40 06 B1 E6 AC 10 0A 63 D8 3A D0 8E C0 A8 00 50 00 00 00 01 00 00 00 00 50 02 20 00 91 7C 00 00 47 45 54 20 2F 69 6E 64 65 78 2E 68 74 6D 6C 20 48 54 54 50 2F 31 2E 31 0D 0A 48 6F 73 74 3A 20 65 78 61 6D 70 6C 65 2E 63 6F 6D',
  dns: 'AA BB CC DD EE FF 11 22 33 44 55 66 08 00 45 00 00 3C 1C 46 40 00 40 11 B1 E6 AC 10 0A 63 08 08 08 08 C3 50 00 35 00 28 00 00 AB CD 01 00 00 01 00 00 00 00 00 00 07 65 78 61 6D 70 6C 65 03 63 6F 6D 00 00 01 00 01',
  tcp: 'AA BB CC DD EE FF 11 22 33 44 55 66 08 00 45 00 00 28 1C 46 40 00 40 06 B1 E6 C0 A8 01 64 D8 3A D0 8E C0 01 01 BB 00 00 00 00 00 00 00 00 50 02 72 10 00 00 00 00',
};

function hexToBytes(hex) {
  const clean = hex.replace(/[^0-9A-Fa-f]/g, '');
  const bytes = [];
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.substr(i, 2), 16));
  }
  return bytes;
}

function bytesToMAC(bytes) {
  return bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(':');
}

function bytesToIP(bytes) {
  return bytes.join('.');
}

function bytesToHex(bytes) {
  return bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
}

function bytesToASCII(bytes) {
  return bytes.map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('');
}

function createLayerCard(title, color, fields, byteRange) {
  const div = document.createElement('div');
  div.style.cssText = `border-left:4px solid ${color};border-radius:8px;padding:.7rem;margin-bottom:.5rem;background:rgba(0,0,0,.2);border:1px solid var(--border);border-left:4px solid ${color};opacity:0;transform:translateY(10px);transition:opacity .4s,transform .4s;`;
  let html = `<div style="font-weight:700;font-size:.85rem;color:${color};margin-bottom:.3rem;">${title}</div>`;
  html += `<div style="font-size:.75rem;color:var(--text-muted);margin-bottom:.3rem;">Bytes ${byteRange}</div>`;
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:.3rem;">';
  fields.forEach(([label, value]) => {
    html += `<div style="font-size:.78rem;"><span style="color:var(--text-muted);">${label}:</span> <span style="color:var(--text);font-family:monospace;">${value}</span></div>`;
  });
  html += '</div>';
  div.innerHTML = html;
  return div;
}

function decodeEthernet(bytes, s) {
  const dstMAC = bytesToMAC(bytes.slice(0, 6));
  const srcMAC = bytesToMAC(bytes.slice(6, 12));
  const etherType = '0x' + bytes[12].toString(16).padStart(2, '0') + bytes[13].toString(16).padStart(2, '0');
  const etherLabel = etherType === '0x0800' ? 'IPv4' : etherType === '0x86dd' ? 'IPv6' : etherType === '0x0806' ? 'ARP' : etherType;
  return createLayerCard(s.layerEthernet, LAYER_COLORS.ethernet, [
    [s.dstMAC, dstMAC], [s.srcMAC, srcMAC], [s.etherType, `${etherType} (${etherLabel})`]
  ], '0-13');
}

function decodeIP(bytes, offset, s) {
  const ver = (bytes[offset] >> 4);
  const ihl = (bytes[offset] & 0x0F) * 4;
  const ttl = bytes[offset + 8];
  const proto = bytes[offset + 9];
  const protoName = proto === 6 ? 'TCP' : proto === 17 ? 'UDP' : proto === 1 ? 'ICMP' : proto.toString();
  const srcIP = bytesToIP(bytes.slice(offset + 12, offset + 16));
  const dstIP = bytesToIP(bytes.slice(offset + 16, offset + 20));
  return { card: createLayerCard(s.layerIP, LAYER_COLORS.ip, [
    [s.version, 'IPv' + ver], [s.headerLen, ihl + ' bytes'], [s.ttl, ttl.toString()],
    [s.protocol, `${proto} (${protoName})`], [s.srcIP, srcIP], [s.dstIP, dstIP]
  ], `14-${13 + ihl}`), proto, ihl };
}

function decodeTCP(bytes, offset, s) {
  const srcPort = (bytes[offset] << 8) | bytes[offset + 1];
  const dstPort = (bytes[offset + 2] << 8) | bytes[offset + 3];
  const seqNum = ((bytes[offset+4]<<24)|(bytes[offset+5]<<16)|(bytes[offset+6]<<8)|bytes[offset+7])>>>0;
  const dataOff = (bytes[offset + 12] >> 4) * 4;
  const flagsByte = bytes[offset + 13];
  const flagNames = [];
  if (flagsByte & 0x02) flagNames.push('SYN');
  if (flagsByte & 0x10) flagNames.push('ACK');
  if (flagsByte & 0x01) flagNames.push('FIN');
  if (flagsByte & 0x04) flagNames.push('RST');
  if (flagsByte & 0x08) flagNames.push('PSH');
  const win = (bytes[offset + 14] << 8) | bytes[offset + 15];
  return { card: createLayerCard(s.layerTCP, LAYER_COLORS.tcp, [
    [s.srcPort, srcPort.toString()], [s.dstPort, dstPort.toString()],
    [s.seqNum, seqNum.toString()], [s.flags, flagNames.join(', ') || 'none'],
    [s.windowSize, win.toString()]
  ], `${offset}-${offset + dataOff - 1}`), dataOff };
}

function decodeUDP(bytes, offset, s) {
  const srcPort = (bytes[offset] << 8) | bytes[offset + 1];
  const dstPort = (bytes[offset + 2] << 8) | bytes[offset + 3];
  const length = (bytes[offset + 4] << 8) | bytes[offset + 5];
  return { card: createLayerCard(s.layerUDP, LAYER_COLORS.udp, [
    [s.srcPort, srcPort.toString()], [s.dstPort, dstPort.toString()],
    ['Length', length + ' bytes']
  ], `${offset}-${offset + 7}`) };
}

function decodeHTTP(bytes, offset, s) {
  const ascii = bytesToASCII(bytes.slice(offset));
  const lines = ascii.split('\r\n').filter(l => l.length > 0);
  const fields = [];
  if (lines[0]) {
    const parts = lines[0].split(' ');
    fields.push([s.method, parts[0] || '?']);
    fields.push([s.path, parts[1] || '?']);
    fields.push([s.httpVer, parts[2] || '?']);
  }
  for (let i = 1; i < Math.min(lines.length, 4); i++) {
    const [k, ...v] = lines[i].split(':');
    if (k && v.length) fields.push([k.trim(), v.join(':').trim()]);
  }
  return createLayerCard(s.layerHTTP, LAYER_COLORS.http, fields, `${offset}-${bytes.length - 1}`);
}

function decodeDNS(bytes, offset, s) {
  const id = '0x' + ((bytes[offset] << 8) | bytes[offset + 1]).toString(16).padStart(4, '0');
  const flags = '0x' + ((bytes[offset + 2] << 8) | bytes[offset + 3]).toString(16).padStart(4, '0');
  const qdCount = (bytes[offset + 4] << 8) | bytes[offset + 5];
  // Parse domain name
  let domain = '', i = offset + 12;
  while (i < bytes.length && bytes[i] !== 0) {
    const len = bytes[i]; i++;
    for (let j = 0; j < len && i < bytes.length; j++, i++) domain += String.fromCharCode(bytes[i]);
    if (bytes[i] !== 0) domain += '.';
  }
  return createLayerCard(s.layerDNS, LAYER_COLORS.dns, [
    ['Transaction ID', id], ['Flags', flags],
    ['Questions', qdCount.toString()], ['Query', domain || 'N/A']
  ], `${offset}-${bytes.length - 1}`);
}

let decoding = false;

async function runDecode() {
  if (decoding) return;
  const s = LANG[currentLang];
  const hexInput = $('hexInput').value.trim();
  if (!hexInput) { log(s.invalidHex, 'error'); return; }

  const bytes = hexToBytes(hexInput);
  if (bytes.length < 14) { log(s.invalidHex, 'error'); return; }

  decoding = true;
  setStatus(true);
  showToast(s.decoding);
  log(s.decoding, 'tx');

  const output = $('layerOutput');
  output.innerHTML = '';

  // Hex dump display
  const hexDump = document.createElement('div');
  hexDump.style.cssText = 'font-family:monospace;font-size:.72rem;line-height:1.6;padding:.5rem;border-radius:8px;background:rgba(0,0,0,.3);border:1px solid var(--border);margin-bottom:.5rem;word-break:break-all;';
  hexDump.id = 'hexDump';
  hexDump.textContent = bytesToHex(bytes);
  output.appendChild(hexDump);

  await sleep(400);

  // Layer 2: Ethernet
  const ethCard = decodeEthernet(bytes, s);
  output.appendChild(ethCard);
  requestAnimationFrame(() => { ethCard.style.opacity = '1'; ethCard.style.transform = 'translateY(0)'; });
  log(`${s.layerEthernet}: ${bytesToMAC(bytes.slice(6,12))} → ${bytesToMAC(bytes.slice(0,6))}`, 'info');
  playSound('click');
  await sleep(600);

  // Layer 3: IP
  if (bytes.length >= 34) {
    const { card: ipCard, proto, ihl } = decodeIP(bytes, 14, s);
    output.appendChild(ipCard);
    requestAnimationFrame(() => { ipCard.style.opacity = '1'; ipCard.style.transform = 'translateY(0)'; });
    log(`${s.layerIP}: ${bytesToIP(bytes.slice(26,30))} → ${bytesToIP(bytes.slice(30,34))}`, 'info');
    playSound('click');
    await sleep(600);

    const l4Offset = 14 + ihl;

    // Layer 4: TCP or UDP
    if (proto === 6 && bytes.length >= l4Offset + 20) {
      const { card: tcpCard, dataOff } = decodeTCP(bytes, l4Offset, s);
      output.appendChild(tcpCard);
      requestAnimationFrame(() => { tcpCard.style.opacity = '1'; tcpCard.style.transform = 'translateY(0)'; });
      const sp = (bytes[l4Offset]<<8)|bytes[l4Offset+1], dp = (bytes[l4Offset+2]<<8)|bytes[l4Offset+3];
      log(`${s.layerTCP}: :${sp} → :${dp}`, 'info');
      playSound('click');
      await sleep(600);

      // Layer 7: HTTP
      const appOffset = l4Offset + dataOff;
      if (appOffset < bytes.length) {
        const httpCard = decodeHTTP(bytes, appOffset, s);
        output.appendChild(httpCard);
        requestAnimationFrame(() => { httpCard.style.opacity = '1'; httpCard.style.transform = 'translateY(0)'; });
        log(`${s.layerHTTP}: ${bytesToASCII(bytes.slice(appOffset, appOffset + 20))}...`, 'info');
        playSound('click');
      }
    } else if (proto === 17 && bytes.length >= l4Offset + 8) {
      const { card: udpCard } = decodeUDP(bytes, l4Offset, s);
      output.appendChild(udpCard);
      requestAnimationFrame(() => { udpCard.style.opacity = '1'; udpCard.style.transform = 'translateY(0)'; });
      const dp = (bytes[l4Offset+2]<<8)|bytes[l4Offset+3];
      log(`${s.layerUDP}: port ${dp}`, 'info');
      playSound('click');
      await sleep(600);

      // Layer 7: DNS
      if (dp === 53 && bytes.length > l4Offset + 8) {
        const dnsCard = decodeDNS(bytes, l4Offset + 8, s);
        output.appendChild(dnsCard);
        requestAnimationFrame(() => { dnsCard.style.opacity = '1'; dnsCard.style.transform = 'translateY(0)'; });
        log(`${s.layerDNS}: query decoded`, 'info');
        playSound('click');
      }
    }
  }

  hideToast();
  decoding = false;
  log(s.decoded, 'success');
}

function showProtoRef() {
  const s = LANG[currentLang];
  const r = $('refResults');
  if (!r) return;
  r.style.display = 'block';
  r.innerHTML = `
    <table style="width:100%;border-collapse:collapse;font-size:.78rem;">
      <thead><tr style="border-bottom:2px solid var(--accent);"><th style="text-align:left;padding:.3rem;">Layer</th><th style="text-align:left;padding:.3rem;">Field</th><th style="text-align:left;padding:.3rem;">Bytes</th><th style="text-align:left;padding:.3rem;">Size</th></tr></thead>
      <tbody>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.ethernet};">Ethernet</td><td>Dst MAC</td><td>0-5</td><td>6B</td></tr>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.ethernet};">Ethernet</td><td>Src MAC</td><td>6-11</td><td>6B</td></tr>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.ethernet};">Ethernet</td><td>EtherType</td><td>12-13</td><td>2B</td></tr>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.ip};">IP</td><td>Src IP</td><td>26-29</td><td>4B</td></tr>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.ip};">IP</td><td>Dst IP</td><td>30-33</td><td>4B</td></tr>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.ip};">IP</td><td>TTL</td><td>22</td><td>1B</td></tr>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.tcp};">TCP</td><td>Src Port</td><td>34-35</td><td>2B</td></tr>
        <tr style="border-bottom:1px solid var(--border);"><td style="padding:.3rem;color:${LAYER_COLORS.tcp};">TCP</td><td>Dst Port</td><td>36-37</td><td>2B</td></tr>
        <tr><td style="padding:.3rem;color:${LAYER_COLORS.tcp};">TCP</td><td>Flags</td><td>47</td><td>1B</td></tr>
      </tbody>
    </table>`;
  log('📖 Protocol reference shown', 'success');
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw=$('logoWrap'); if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;
  initLogResize();
  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  const whisperBtn=$('whisperBtn');if(whisperBtn)whisperBtn.onclick=toggleWhisper;
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtnEl=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};
  if(dhikrBtnEl)dhikrBtnEl.onclick=incrementDhikr;
  const musicBtn=$('musicBtn');if(musicBtn)musicBtn.onclick=()=>log('🎵 Coming soon','info');
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang');const st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initKonami();initMatrixTrigger();initHijriDate();initPixelPet();

  // App-specific
  $('decodeBtn').onclick = runDecode;
  $('sample1Btn').onclick = () => { $('hexInput').value = SAMPLE_PACKETS.http; playSound('click'); };
  $('sample2Btn').onclick = () => { $('hexInput').value = SAMPLE_PACKETS.dns; playSound('click'); };
  $('sample3Btn').onclick = () => { $('hexInput').value = SAMPLE_PACKETS.tcp; playSound('click'); };
  const showRefBtnEl = $('showRefBtn');
  if (showRefBtnEl) showRefBtnEl.onclick = showProtoRef;

  log(LANG[currentLang].ready, 'success');
}

document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Protocol Stack Visualizer Canvas ═══════ */
(function(){
let psCanvas,psCtx;const stackLayers=[];const dataFlow=[];
function createPS(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">OSI Protocol Stack Visualizer</div>';
  const c=document.createElement('canvas');c.width=620;c.height=280;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;cursor:pointer;';
  w.appendChild(c);t.appendChild(w);return c;
}
const OSI_LAYERS=[
  {name:'Application',proto:'HTTP/DNS/FTP',color:'#ef4444',y:0},
  {name:'Transport',proto:'TCP/UDP',color:'#f59e0b',y:0},
  {name:'Network',proto:'IP/ICMP',color:'#22c55e',y:0},
  {name:'Data Link',proto:'Ethernet/WiFi',color:'#3b82f6',y:0},
  {name:'Physical',proto:'Bits/Signals',color:'#8b5cf6',y:0},
];
function drawPS(){
  if(!psCtx)return;const w=psCanvas.width,h=psCanvas.height;
  psCtx.fillStyle='rgba(6,13,26,0.08)';psCtx.fillRect(0,0,w,h);
  // Draw OSI stack (left side)
  const stackX=20,stackW=180,layerH=42,stackY=20;
  OSI_LAYERS.forEach((l,i)=>{
    l.y=stackY+i*layerH;
    const pulse=Math.sin(Date.now()/500+i*0.5)*0.03;
    psCtx.fillStyle=l.color+(Math.floor(20+pulse*200).toString(16).padStart(2,'0'));
    psCtx.fillRect(stackX,l.y,stackW,layerH-3);
    psCtx.strokeStyle=l.color+'44';psCtx.lineWidth=1;psCtx.strokeRect(stackX,l.y,stackW,layerH-3);
    psCtx.fillStyle=l.color;psCtx.font='10px Orbitron,sans-serif';psCtx.textAlign='left';
    psCtx.fillText('L'+(5-i)+': '+l.name,stackX+6,l.y+16);
    psCtx.fillStyle='rgba(255,255,255,0.4)';psCtx.font='8px monospace';
    psCtx.fillText(l.proto,stackX+6,l.y+30);
  });
  // Encapsulation visualization (right side)
  const encX=230,encW=w-encX-20,encY=30;
  psCtx.fillStyle='rgba(255,255,255,0.3)';psCtx.font='9px Orbitron';psCtx.textAlign='left';
  psCtx.fillText('Packet Encapsulation',encX,encY-8);
  // Draw nested packet
  const t=Date.now()/1000;
  OSI_LAYERS.forEach((l,i)=>{
    const pad=i*25;const bx=encX+pad,by=encY+10+i*5;
    const bw=encW-pad*2,bh=180-i*20;
    if(bw>0&&bh>0){
      const glow=Math.sin(t+i)*0.05+0.05;
      psCtx.fillStyle=l.color+Math.floor(glow*255).toString(16).padStart(2,'0');
      psCtx.fillRect(bx,by,bw,bh);
      psCtx.strokeStyle=l.color+'66';psCtx.lineWidth=1;psCtx.strokeRect(bx,by,bw,bh);
      // Header label
      psCtx.fillStyle=l.color;psCtx.font='7px monospace';psCtx.textAlign='left';
      psCtx.fillText('HDR-L'+(5-i),bx+3,by+10);
    }
  });
  // Data bits flowing down stack
  if(Math.random()>0.85){dataFlow.push({x:stackX+stackW/2+(Math.random()-0.5)*60,y:stackY,speed:1+Math.random()*2,life:1,color:OSI_LAYERS[Math.floor(Math.random()*5)].color});}
  for(let i=dataFlow.length-1;i>=0;i--){
    const d=dataFlow[i];d.y+=d.speed;d.life-=0.008;
    if(d.life<=0||d.y>h){dataFlow.splice(i,1);continue;}
    psCtx.globalAlpha=d.life*0.6;psCtx.beginPath();psCtx.arc(d.x,d.y,2,0,Math.PI*2);
    psCtx.fillStyle=d.color;psCtx.fill();psCtx.globalAlpha=1;
  }
  // Stats
  psCtx.fillStyle='rgba(255,255,255,0.3)';psCtx.font='8px monospace';psCtx.textAlign='left';
  psCtx.fillText('OSI Model: 5 layers | Data units flowing: '+dataFlow.length,10,h-8);
  requestAnimationFrame(drawPS);
}
function initPS(){psCanvas=createPS();if(!psCanvas)return;psCtx=psCanvas.getContext('2d');
  psCanvas.addEventListener('click',()=>{for(let i=0;i<10;i++)dataFlow.push({x:110+(Math.random()-0.5)*100,y:20,speed:1.5+Math.random()*2,life:1,color:OSI_LAYERS[Math.floor(Math.random()*5)].color});});
  drawPS();}
setTimeout(initPS,2000);
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
