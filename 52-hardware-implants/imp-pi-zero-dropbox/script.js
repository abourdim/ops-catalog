/**
 * imp-pi-zero-dropbox — Workshop DIY
 * Raspberry Pi Zero network drop box simulation for pentest training
 * Framework: Themes, i18n, RTL, Log, Toast, Status, Panels, Sound, Canvas
 */

const $ = id => document.getElementById(id);

const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="30" width="60" height="40" rx="4" fill="none" stroke="currentColor" stroke-width="2"/><rect x="25" y="35" width="15" height="10" rx="1" fill="currentColor" opacity=".3"/><circle cx="70" cy="38" r="3" fill="currentColor"/><line x1="50" y1="70" x2="50" y2="85" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="89" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="15" y="45" width="8" height="6" rx="1" fill="currentColor" opacity=".5"/><rect x="77" y="45" width="8" height="6" rx="1" fill="currentColor" opacity=".5"/></svg>`;

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  if (type === 'click') { osc.frequency.value = 800; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); }
  else if (type === 'success') { osc.frequency.value = 523; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); }
  else if (type === 'error') { osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); }
}

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
    title: 'Pi Zero Dropbox', subtitle: '📦 drop · 🔓 pivot · 🛡️ detect',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Pi Zero Drop Box — Network Implant Lab',
    mainDesc: 'Simulate Raspberry Pi Zero drop box deployment for network penetration testing',
    sectionA: 'How It Works', sectionB: 'Lab — Network Topology', sectionC: 'Challenge',
    deployBtn: 'Deploy Box', pivotBtn: 'Pivot Network', detectBtn: 'Detect Implant',
    howStep1: 'A Pi Zero drop box is a small single-board computer hidden inside a target network via Ethernet.',
    howStep2: 'Once connected, it phones home via reverse SSH tunnel or cellular modem, bypassing firewalls.',
    howStep3: 'The attacker uses the implant as a pivot point to scan internal subnets and exfiltrate data.',
    howStep4: 'Detection relies on 802.1X port authentication, network monitoring, and physical security audits.',
    ready: '📦 Pi Zero Drop Box ready — select deployment mode!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    working: 'Working…', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    splashHint: 'tap to skip',step1Title:'Design Implant',step1Desc:'A Pi Zero drop box is a small single-board computer hidden inside a target network via Ethernet.',step2Title:'Build & Program',step2Desc:'Once connected, it phones home via reverse SSH tunnel or cellular modem, bypassing firewalls.',step3Title:'Deploy',step3Desc:'The attacker uses the implant as a pivot point to scan internal subnets and exfiltrate data.',step4Title:'Monitor & Extract',step4Desc:'Detection relies on 802.1X port authentication, network monitoring, and physical security audits.',sectionCode:'Device Code',faq_q1:'What is Pi Zero Dropbox?',faq_a1:'Pi Zero Dropbox is an interactive simulation that demonstrates hardware implants concepts. Simulate Raspberry Pi Zero drop box deployment for network penetration testing. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real hardware security behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Click Start to begin the simulation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real hardware security principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Imp Covert Audio Implant and Imp Evil Maid Toolkit. Each app in this category teaches a different aspect of hardware security.',demo_s1:'Welcome to Pi Zero Dropbox! Look at the main display — this is where the hardware security simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of hardware security.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Hardware Design',learn1Desc:'How covert devices are built from components. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Electronics',learn2Title:'Firmware',learn2Desc:'How embedded code controls hardware implants. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Programming',learn3Title:'Detection',learn3Desc:'How to find hidden hardware in your environment. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Counter-Intel',learn4Title:'Physical Security',learn4Desc:'How to protect spaces from unauthorized devices. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Pi Zero Dropbox! This is like a science experiment on your computer. You get to control a real hardware implants simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how A Pi Zero drop box is a small single-board compute Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches hardware security concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Pi Zero Dropbox?',wiki_concept:'Pi Zero Dropbox is a technique used in hardware security. Simulate Raspberry Pi Zero drop box deployment for network penetration testing. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: A Pi Zero drop box is a small single-board computer hidden inside a target network via Ethernet. Second: Once connected, it phones home via reverse SSH tunnel or cellular modem, bypassing firewalls. The simulation runs these stages in real time, showing you intermediate results at each step. In real hardware security, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Pi Zero Dropbox has practical applications in hardware security. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Pi Zero Dropbox: Simulate Raspberry Pi Zero drop box deployment for network penetration testing. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Design Implant through Build & Program to Deploy and Monitor & Extract.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Lab — Network Topology" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Privacy Tools',
    wiki_history: 'Port scanning became prominent with nmap (1997). Modern scanners combine multiple techniques: SYN scan, UDP scan, OS fingerprinting, and service detection. Pi Zero Dropbox builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Imp Pi Zero Dropbox',
    wiki_math: 'The mathematics behind Pi Zero Dropbox: Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N. Transmission probability T ≈ e^(-2κL) where κ = √(2m(V₀-E))/ℏ and L is barrier width. Even a 1 nm increase in L can reduce T by orders of magnitude.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced privacy tools practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to privacy tools. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with privacy tools: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in privacy tools.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Privacy Tools carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Port',
    gloss1_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'Wave Function',
    gloss3_def: 'A mathematical description of a quantum particle state (ψ). |ψ|² gives the probability density of finding the particle at any position. It does not abruptly stop at barriers.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Pi Zero Dropbox demonstrates key principles from hardware implants. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. Quantum tunneling allows particles to pass through barriers they classically could not. The probability decreases exponentially with barrier width and height. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world privacy tools?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional privacy tools systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: 'Pi Zero Dropbox', subtitle: '📦 déployer · 🔓 pivoter · 🛡️ détecter',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'Pi Zero Drop Box — Implant réseau',
    mainDesc: 'Simulez le déploiement d\'une drop box Pi Zero pour les tests de pénétration',
    sectionA: 'Comment ça marche', sectionB: 'Labo — Topologie réseau', sectionC: 'Défi',
    deployBtn: 'Déployer', pivotBtn: 'Pivoter', detectBtn: 'Détecter',
    ready: '📦 Drop Box prête !',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    working: 'En cours…', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    splashHint: 'appuyer pour passer',step1Title:'Concevoir l\'implant',step1Desc:'A Pi Zero drop box is a small single-board computer hidden inside a target network via Ethernet.',step2Title:'Construire et programmer',step2Desc:'Once connected, it phones home via reverse SSH tunnel or cellular modem, bypassing firewalls.',step3Title:'Déployer',step3Desc:'The attacker uses the implant as a pivot point to scan internal subnets and exfiltrate data.',step4Title:'Surveiller et extraire',step4Desc:'Detection relies on 802.1X port authentication, network monitoring, and physical security audits.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Pi Zero Dropbox ?',faq_a1:'Pi Zero Dropbox est une simulation interactive qui démontre les concepts de implants matériels. Simulate Raspberry Pi Zero drop box deployment for network penetration testing. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de sécurité matérielle. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de sécurité matérielle. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de sécurité matérielle.',demo_s1:'Bienvenue dans Pi Zero Dropbox ! Regarde l\'écran principal — c\'est ici que la simulation de sécurité matérielle fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de sécurité matérielle.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Hardware Design',learn1Desc:'How covert devices are built from components. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Electronics',learn2Title:'Firmware',learn2Desc:'How embedded code controls hardware implants. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'Programming',learn3Title:'Detection',learn3Desc:'How to find hidden hardware in your environment. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Counter-Intel',learn4Title:'Physical Security',learn4Desc:'How to protect spaces from unauthorized devices. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Pi Zero Dropbox ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de implants matériels — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how A Pi Zero drop box is a small single-board compute Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de sécurité matérielle par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chiffrer et Décoder',ch1Desc:'Chiffre un message puis essaie de le décoder manuellement sans regarder la clé. Quels motifs repères-tu dans le texte chiffré ?',ch2Title:'Test de Furtivité',ch2Desc:'Essaie de compléter la mission avec l\'empreinte signal la plus faible possible. Peux-tu descendre sous le seuil de détection ?',ch3Title:'Course à l\'Interception',ch3Desc:'Lance une transmission et mesure le temps de détection. Qu\'est-ce qui affecte ce délai ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',wiki_concept_title:'🔬 Qu\'est-ce que Pi Zero Dropbox ?',wiki_concept:'Pi Zero Dropbox est une technique utilisée en hardware security. Dans un contexte professionnel, cette technologie nécessite Mixed et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de hardware security. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'Pi Zero Dropbox a des applications pratiques en hardware security. Les professionnels utilisent des techniques similaires avec Mixed. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'Pi Zero Dropbox : Simulate Raspberry Pi Zero drop box deployment for network penetration testing. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de outils de confidentialité',
    wiki_history: 'Port scanning became prominent with nmap (1997). Modern scanners combine multiple techniques: SYN scan, UDP scan, OS fingerprinting, and service detection. Pi Zero Dropbox s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Imp Pi Zero Dropbox',
    wiki_math: 'Les mathématiques derrière Pi Zero Dropbox : Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N. Transmission probability T ≈ e^(-2κL) where κ = √(2m(V₀-E))/ℏ and L is barrier width. Even a 1 nm increase in L can reduce T by orders of magnitude.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de outils de confidentialité utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour outils de confidentialité. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en outils de confidentialité : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Outils de confidentialité implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Port',
    gloss1_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'Wave Function',
    gloss3_def: 'A mathematical description of a quantum particle state (ψ). |ψ|² gives the probability density of finding the particle at any position. It does not abruptly stop at barriers.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Pi Zero Dropbox démontre les principes clés de implants matériels. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. Quantum tunneling allows particles to pass through barriers they classically could not. The probability decreases exponentially with barrier width and height. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec privacy tools dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: 'Pi Zero Dropbox', subtitle: '📦 نشر · 🔓 محور · 🛡️ كشف',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'صندوق الإسقاط Pi Zero — مختبر زرعات الشبكة',
    mainDesc: 'محاكاة نشر صندوق إسقاط Pi Zero لاختبار اختراق الشبكات',
    sectionA: 'كيف يعمل', sectionB: 'المختبر', sectionC: 'التحدي',
    deployBtn: 'نشر', pivotBtn: 'محور', detectBtn: 'كشف',
    ready: '📦 صندوق الإسقاط جاهز!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', working: 'جارٍ…',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    splashHint: 'انقر للتخطي',step1Title:'تصميم الزرع',step1Desc:'A Pi Zero drop box is a small single-board computer hidden inside a target network via Ethernet.',step2Title:'بناء وبرمجة',step2Desc:'Once connected, it phones home via reverse SSH tunnel or cellular modem, bypassing firewalls.',step3Title:'نشر',step3Desc:'The attacker uses the implant as a pivot point to scan internal subnets and exfiltrate data.',step4Title:'مراقبة واستخراج',step4Desc:'Detection relies on 802.1X port authentication, network monitoring, and physical security audits.',sectionCode:'كود الجهاز',faq_q1:'ما هو Pi Zero Dropbox؟',faq_a1:'Pi Zero Dropbox هي محاكاة تفاعلية توضح مفاهيم الغرسات المادية. Simulate Raspberry Pi Zero drop box deployment for network penetration testing. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في أمن الأجهزة. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من أمن الأجهزة. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من أمن الأجهزة.',demo_s1:'مرحباً في Pi Zero Dropbox! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة أمن الأجهزة.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـأمن الأجهزة.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Hardware Design',learn1Desc:'How covert devices are built from components. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Electronics',learn2Title:'Firmware',learn2Desc:'How embedded code controls hardware implants. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'Programming',learn3Title:'Detection',learn3Desc:'How to find hidden hardware in your environment. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Counter-Intel',learn4Title:'Physical Security',learn4Desc:'How to protect spaces from unauthorized devices. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Pi Zero Dropbox! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالغرسات المادية — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how A Pi Zero drop box is a small single-board compute لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم أمن الأجهزة من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'تشفير وفك تشفير',ch1Desc:'شفّر رسالة ثم حاول فك تشفيرها يدوياً بدون النظر للمفتاح. ما الأنماط التي تلاحظها؟',ch2Title:'اختبار التخفي',ch2Desc:'حاول إكمال المهمة بأقل بصمة إشارة ممكنة. هل يمكنك النزول تحت عتبة الكشف؟',ch3Title:'سباق الاعتراض',ch3Desc:'ابدأ بثاً وقِس سرعة اعتراضه. ما الذي يؤثر على وقت الكشف؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',wiki_concept_title:'🔬 ما هو Pi Zero Dropbox؟',wiki_concept:'Pi Zero Dropbox هي تقنية تُستخدم في hardware security. في البيئات المهنية، تتطلب هذه التقنية Mixed وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من hardware security. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'Pi Zero Dropbox له تطبيقات عملية في hardware security. يستخدم المحترفون تقنيات مماثلة مع Mixed. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'Pi Zero Dropbox: Simulate Raspberry Pi Zero drop box deployment for network penetration testing. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ أدوات الخصوصية',
    wiki_history: 'Port scanning became prominent with nmap (1997). Modern scanners combine multiple techniques: SYN scan, UDP scan, OS fingerprinting, and service detection. يبني Pi Zero Dropbox على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Imp Pi Zero Dropbox',
    wiki_math: 'الرياضيات وراء Pi Zero Dropbox: Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N. Transmission probability T ≈ e^(-2κL) where κ = √(2m(V₀-E))/ℏ and L is barrier width. Even a 1 nm increase in L can reduce T by orders of magnitude.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو أدوات الخصوصية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في أدوات الخصوصية. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في أدوات الخصوصية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'أدوات الخصوصية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Port',
    gloss1_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'Wave Function',
    gloss3_def: 'A mathematical description of a quantum particle state (ψ). |ψ|² gives the probability density of finding the particle at any position. It does not abruptly stop at barriers.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Pi Zero Dropbox يوضح المبادئ الأساسية في الغرسات المادية. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. Quantum tunneling allows particles to pass through barriers they classically could not. The probability decreases exponentially with barrier width and height. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـprivacy tools في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};
let currentLang = 'en';
function setLanguage(lang) {
  currentLang = lang; const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info');
}
function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  log(`${LANG[currentLang].themeChanged} ${name}`, 'info');
}

let logContainer;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${type}`; d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (type === 'success') playSound('success'); else if (type === 'error') playSound('error'); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const blob = new Blob([Array.from(logContainer.children).map(d => d.textContent).join('\n')], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `log-${new Date().toISOString().slice(0, 10)}.txt`; a.click(); }

let toastTimer = null;
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (toastTimer) clearTimeout(toastTimer); if (ms > 0) toastTimer = setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(connected) { const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang]; if (txt) txt.textContent = connected ? s.connected : s.disconnected; if (pill) pill.classList.toggle('connected', connected); }

let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(line => { line.style.display = (activeLogFilter === 'all' || line.classList.contains(activeLogFilter)) ? '' : 'none'; }); }
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {} }

function openPanel(pid, oid) { const s = $(pid), o = $(oid); if (s) s.classList.add('open'); if (o) o.classList.add('open'); }
function closePanel(pid, oid) { const s = $(pid), o = $(oid); if (s) s.classList.remove('open'); if (o) o.classList.remove('open'); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); } function closeHelp() { closePanel('helpPanel', 'helpOverlay'); }
function openSettings() { openPanel('settingsPanel', 'settingsOverlay'); } function closeSettings() { closePanel('settingsPanel', 'settingsOverlay'); }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function initHelpTabs() { document.querySelectorAll('.help-tab').forEach(tab => { tab.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const target = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)); if (target) target.classList.add('active'); }); }); }
function revealChallenge(idx) { const el = $('answer' + idx); if (el) el.classList.toggle('visible'); playSound('click'); }

let matrixRunning = false, matrixAnim = null;
function toggleMatrix() { const canvas = $('matrixCanvas'); if (!canvas) return; if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); canvas.classList.remove('active'); return; } matrixRunning = true; canvas.classList.add('active'); const ctx = canvas.getContext('2d'); canvas.width = innerWidth; canvas.height = innerHeight; const cols = Math.floor(canvas.width / 16), drops = Array(cols).fill(1); const chars = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذ01'; (function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33'; ctx.font = '14px Amiri'; for (let i = 0; i < drops.length; i++) { ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * 16, drops[i] * 16); if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; } matrixAnim = requestAnimationFrame(draw); })(); }

/* ═══════ APP-SPECIFIC: PI ZERO DROP BOX ═══════ */

let deployed = false;
let netParticles = [];
let discoveredHosts = [];
let waveTime = 0;

const networkNodes = [
  { id: 'gw', label: 'GATEWAY', x: 0.5, y: 0.1, color: '#4488ff' },
  { id: 'sw', label: 'SWITCH', x: 0.5, y: 0.35, color: '#888' },
  { id: 'srv1', label: 'SRV-01', x: 0.2, y: 0.6, color: '#33ff33' },
  { id: 'srv2', label: 'SRV-02', x: 0.5, y: 0.6, color: '#33ff33' },
  { id: 'ws1', label: 'WS-01', x: 0.8, y: 0.6, color: '#33ff33' },
  { id: 'pi', label: 'PI-ZERO', x: 0.8, y: 0.35, color: '#ff3333' },
];
const netLinks = [
  ['gw', 'sw'], ['sw', 'srv1'], ['sw', 'srv2'], ['sw', 'ws1'], ['sw', 'pi']
];

function getNode(id) { return networkNodes.find(n => n.id === id); }

function initSimCanvas() {
  const canvas = $('simCanvas'); if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 500; canvas.height = 260;

  function draw() {
    ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    waveTime += 0.02;

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
    for (let y = 0; y < canvas.height; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

    // Links
    netLinks.forEach(([a, b]) => {
      const na = getNode(a), nb = getNode(b);
      const ax = na.x * canvas.width, ay = na.y * canvas.height;
      const bx = nb.x * canvas.width, by = nb.y * canvas.height;
      ctx.strokeStyle = (a === 'pi' || b === 'pi') && deployed ? '#ff3333' : '#333';
      ctx.lineWidth = (a === 'pi' || b === 'pi') && deployed ? 2 : 1;
      ctx.setLineDash((a === 'pi' || b === 'pi') ? [4, 6] : []);
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      ctx.setLineDash([]);
    });

    // Nodes
    networkNodes.forEach(node => {
      const nx = node.x * canvas.width, ny = node.y * canvas.height;
      const isPI = node.id === 'pi';

      // Node box
      ctx.fillStyle = isPI ? '#220000' : '#111';
      ctx.strokeStyle = isPI ? (deployed ? '#ff3333' : '#661111') : node.color;
      ctx.lineWidth = isPI && deployed ? 2 : 1.5;
      ctx.beginPath(); ctx.roundRect(nx - 28, ny - 14, 56, 28, 4); ctx.fill(); ctx.stroke();

      // Blink for pi when deployed
      if (isPI && deployed) {
        const blink = Math.sin(waveTime * 4) > 0;
        ctx.fillStyle = blink ? '#ff0000' : '#440000';
        ctx.beginPath(); ctx.arc(nx + 20, ny - 8, 3, 0, Math.PI * 2); ctx.fill();
      }

      // Label
      ctx.fillStyle = isPI ? '#ff3333' : node.color;
      ctx.font = '8px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, nx, ny + 4);
      ctx.textAlign = 'left';
    });

    // Reverse tunnel (phone-home line to top)
    if (deployed) {
      const piNode = getNode('pi');
      const px = piNode.x * canvas.width, py = piNode.y * canvas.height;
      ctx.strokeStyle = '#ff6600'; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(px, py - 14); ctx.lineTo(px + 30, 10); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#ff6600'; ctx.font = '7px Orbitron';
      ctx.fillText('C2 TUNNEL', px + 5, 18);

      // Scanning animation
      const scanRadius = ((waveTime * 30) % 80);
      ctx.strokeStyle = `rgba(255, 51, 51, ${0.3 - scanRadius / 300})`;
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(px, py, scanRadius, 0, Math.PI * 2); ctx.stroke();
    }

    // Particles
    for (let i = netParticles.length - 1; i >= 0; i--) {
      const p = netParticles[i];
      p.x += p.vx; p.y += p.vy; p.life -= 0.015;
      if (p.life <= 0) { netParticles.splice(i, 1); continue; }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color || '#33ff33';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size || 2.5, 0, Math.PI * 2); ctx.fill();
      if (p.label) { ctx.font = '6px Orbitron'; ctx.fillText(p.label, p.x + 4, p.y - 2); }
      ctx.globalAlpha = 1;
    }

    // Status bar
    const mode = ($('deployModeSelect') || {}).value || 'ethernet';
    ctx.fillStyle = deployed ? 'rgba(255,51,51,0.15)' : 'rgba(51,255,51,0.1)';
    ctx.fillRect(50, canvas.height - 25, canvas.width - 100, 10);
    ctx.fillStyle = deployed ? '#ff3333' : '#33ff33'; ctx.font = '9px Orbitron';
    ctx.fillText(`MODE: ${mode.toUpperCase()} | HOSTS: ${discoveredHosts.length}`, 50, canvas.height - 8);

    requestAnimationFrame(draw);
  }
  draw();
}

function spawnNetPackets(fromId, toId, count, color) {
  const canvas = $('simCanvas'); if (!canvas) return;
  const from = getNode(fromId), to = getNode(toId);
  if (!from || !to) return;
  const fx = from.x * canvas.width, fy = from.y * canvas.height;
  const tx = to.x * canvas.width, ty = to.y * canvas.height;
  const labels = ['SYN', 'ACK', 'SSH', 'ARP', 'DNS', 'TCP', 'SCAN'];
  for (let i = 0; i < count; i++) {
    const progress = Math.random();
    netParticles.push({
      x: fx + (tx - fx) * progress + (Math.random() - 0.5) * 10,
      y: fy + (ty - fy) * progress + (Math.random() - 0.5) * 10,
      vx: (tx - fx) / 80 + (Math.random() - 0.5) * 0.5,
      vy: (ty - fy) / 80 + (Math.random() - 0.5) * 0.5,
      life: 0.4 + Math.random() * 0.4,
      color: color || '#ff3333',
      size: 2 + Math.random() * 2,
      label: Math.random() > 0.6 ? labels[Math.floor(Math.random() * labels.length)] : null
    });
  }
}

function randomIP() { return `10.0.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 254) + 1}`; }

function initDropBoxSim() {
  const deployBtn = $('deployBtn'), pivotBtn = $('pivotBtn'), detectBtn = $('detectBtn');
  const dataLog = $('dataLog'), outputDisplay = $('outputDisplay');
  const implantDot = $('implantDot'), implantStatusText = $('implantStatusText');

  let deployInterval = null;

  if (deployBtn) deployBtn.addEventListener('click', () => {
    deployed = !deployed;
    deployBtn.textContent = deployed ? 'Recall Box' : (LANG[currentLang].deployBtn || 'Deploy Box');
    if (implantDot) implantDot.classList.toggle('active', deployed);
    if (implantStatusText) implantStatusText.textContent = deployed ? 'Pi Zero: DEPLOYED' : 'Pi Zero: Offline';
    setStatus(deployed);

    if (deployed) {
      const mode = ($('deployModeSelect') || {}).value || 'ethernet';
      log(`📦 Pi Zero deployed via ${mode} — establishing C2 tunnel...`, 'success');
      showToast('Deploying drop box...', 2000);
      spawnNetPackets('pi', 'sw', 10, '#ff3333');

      setTimeout(() => {
        log('🔗 Reverse SSH tunnel established to C2 server', 'success');
        log(`📡 Obtained IP: ${randomIP()} via DHCP`, 'rx');
      }, 1500);

      deployInterval = setInterval(() => {
        if (!deployed) { clearInterval(deployInterval); return; }
        const ip = randomIP();
        discoveredHosts.push(ip);
        spawnNetPackets('pi', ['srv1', 'srv2', 'ws1'][Math.floor(Math.random() * 3)], 4, '#ff3333');
        if (dataLog) {
          dataLog.textContent = discoveredHosts.slice(-8).map((h, i) =>
            `[${new Date().toLocaleTimeString()}] Host ${i + 1}: ${h} — port scan in progress`
          ).join('\n');
        }
        log(`📡 Host discovered: ${ip}`, 'rx');
      }, 3000);
    } else {
      if (deployInterval) clearInterval(deployInterval);
      log('⬛ Pi Zero recalled — tunnel closed', 'info');
    }
  });

  if (pivotBtn) pivotBtn.addEventListener('click', () => {
    if (!deployed) { log('Deploy the drop box first', 'error'); return; }
    showToast('Pivoting through internal network...', 2500);
    log('🔓 Pivoting via Pi Zero to internal subnets...', 'info');
    spawnNetPackets('pi', 'srv1', 8, '#ff6600');
    spawnNetPackets('pi', 'srv2', 8, '#ff6600');
    spawnNetPackets('pi', 'ws1', 8, '#ff6600');

    setTimeout(() => {
      const results = [
        'PIVOT RESULTS',
        '══════════════════',
        `Hosts discovered: ${discoveredHosts.length}`,
        `Subnets reached: 10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24`,
        `Open services found:`,
        `  10.0.0.1  — SSH (22), HTTP (80)`,
        `  10.0.1.15 — SMB (445), RDP (3389)`,
        `  10.0.2.30 — MySQL (3306), HTTP (8080)`,
        '',
        `Credentials captured: 3 NTLM hashes`,
        `Data exfiltrated: 12.4 MB`,
        `Tunnel latency: ${(20 + Math.random() * 80).toFixed(0)}ms`
      ].join('\n');
      if (outputDisplay) outputDisplay.textContent = results;
      log('🔓 Pivot complete — 3 subnets reached, services enumerated', 'success');
      hideToast();
    }, 2000);
  });

  if (detectBtn) detectBtn.addEventListener('click', () => {
    showToast('Running network anomaly detection...', 2500);
    log('🛡️ Scanning for unauthorized devices on network...', 'info');
    spawnNetPackets('gw', 'sw', 15, '#4488ff');

    setTimeout(() => {
      const found = deployed;
      const defenses = found ? [
        '⚠️ ROGUE DEVICE DETECTED',
        '══════════════════',
        'MAC: B8:27:EB:xx:xx:xx (Raspberry Pi)',
        'IP: 10.0.0.247 (DHCP assigned)',
        `Port: Switch port 24 (unauthorized)`,
        'Suspicious: Reverse SSH tunnel to external IP',
        'Traffic: ARP scanning detected',
        '',
        'RECOMMENDED ACTIONS:',
        '• Isolate switch port immediately',
        '• Enable 802.1X port authentication',
        '• Review physical access logs',
        '• Forensic image the device'
      ] : [
        '✅ NETWORK CLEAN',
        '══════════════════',
        'All devices authenticated via 802.1X',
        'No rogue MAC addresses detected',
        'No unauthorized tunnels found',
        'ARP table consistent',
        '',
        'DEFENSES ACTIVE:',
        '• 802.1X port auth enabled',
        '• DHCP snooping active',
        '• Dynamic ARP inspection ON',
        '• Port security: sticky MAC'
      ];
      if (outputDisplay) outputDisplay.textContent = defenses.join('\n');
      log(found ? '🚨 Rogue Raspberry Pi detected on port 24!' : '✅ Network clean — no rogue devices', found ? 'error' : 'success');
      hideToast();
    }, 2000);
  });

  const sweepBtn = $('sweepBtn');
  if (sweepBtn) sweepBtn.addEventListener('click', () => {
    spawnNetPackets('sw', 'srv1', 8, '#d4a03c');
    spawnNetPackets('sw', 'srv2', 8, '#d4a03c');
    spawnNetPackets('sw', 'ws1', 8, '#d4a03c');
    log('📡 Network topology scan initiated...', 'info');
    showToast('Mapping network topology...', 3000);
    let step = 0;
    const phases = ['ARP discovery', 'Port scanning (top 100)', 'Service enumeration', 'OS fingerprinting', 'Vulnerability scan'];
    const iv = setInterval(() => {
      if (step < phases.length) {
        if (dataLog) dataLog.textContent += `\n[SCAN] ${phases[step]}...`;
        step++;
      } else {
        clearInterval(iv);
        log('📡 Network scan complete', 'success');
      }
    }, 500);
  });
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash(); const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  $('clearLogBtn') && ($('clearLogBtn').onclick = clearLog); $('copyLogBtn') && ($('copyLogBtn').onclick = copyLog); $('exportLogBtn') && ($('exportLogBtn').onclick = exportLog);
  initLogFilters();
  $('helpBtn') && ($('helpBtn').onclick = openHelp); $('helpCloseBtn') && ($('helpCloseBtn').onclick = closeHelp); $('helpOverlay') && ($('helpOverlay').onclick = closeHelp); initHelpTabs();
  $('settingsBtn') && ($('settingsBtn').onclick = openSettings); $('settingsCloseBtn') && ($('settingsCloseBtn').onclick = closeSettings); $('settingsOverlay') && ($('settingsOverlay').onclick = closeSettings);
  $('logBtn') && ($('logBtn').onclick = toggleLog); $('logCloseBtn') && ($('logCloseBtn').onclick = closeLog);
  const soundTgl = $('soundToggle');
  if (soundTgl) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} soundTgl.checked = soundEnabled; soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeHelp(); closeSettings(); closeLog(); } });
  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));
  try { const sl = localStorage.getItem('wdiy-lang'), st = localStorage.getItem('wdiy-theme'); if (st) setTheme(st); if (sl) setLanguage(sl); } catch {}
  initHijriDate(); initSimCanvas(); initDropBoxSim();
  log(LANG[currentLang].ready, 'success');
}
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();


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
