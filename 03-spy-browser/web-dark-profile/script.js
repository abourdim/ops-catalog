/**
 * Workshop DIY — Dark Profile v1.2
 * Digital Footprint — Search usernames across platforms
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3l-6.5-2.4l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.4l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7H204v3.6h126.8zM330.8,203.4H161.7v3.6h169.1zM330.8,211H77.1v3.6h253.7z"/></svg>`;
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.2';
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);}else if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);}}

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
    title:'Dark Profile', subtitle:'🕵️ Search usernames across platforms',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'Digital Footprint Scanner', mainDesc:'Enter a username to search across platforms',
    sectionA:'Platform Database', sectionB:'Privacy Protection', sectionC:'Exposure Analysis',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', theme:'Theme', export:'Export', filterAll:'All',
    settings:'⚙️ Settings', language:'Language',
    help:'❓ Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    howto_1:'The main display shows the Dark Profile simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Set up the simulation parameters and choose your encryption ', howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Platform Database" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.', howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_themes_title:'🎨 Themes', wiki_themes:'8 built-in themes. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_i18n_title:'🌐 Languages', wiki_i18n:'Trilingual: EN, FR, AR. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_log_title:'📜 Activity Log', wiki_log:'Timestamped log. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_privacy_title:'🔒 Privacy', wiki_privacy:'Local-first. This application processes everything locally in your browser using JavaScript. No data is sent to any server. Your experiments, settings, and results stay on your device. This architecture is called "local-first" and guarantees complete data privacy.',
    working:'Working…',
    t_mosque:'Mosque', t_zellige:'Zellige', t_andalus:'Andalus', t_riad:'Riad', t_medina:'Medina',
    t_space:'Space', t_jungle:'Jungle', t_robot:'Robot',
    ready:'🕵️ Dark Profile ready!',
    logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed',
    soundEffects:'🔊 Sound effects', whisperMode:'Whisper mode', breathingGuide:'Breathing guide',
    dhikrTap:'Tap', musicMode:'Music reactive', splashHint:'tap to skip',
    langChanged:'🌐 Language → English', themeChanged:'🎨 Theme →',
    searchBtn:'Search', enterUsername:'Enter a username first',
    searching:'Searching platforms...', searchDone:'Search complete!',
    found:'FOUND', notFound:'NOT FOUND', riskLabel:'Privacy Risk Score',
    platformText:'The scanner checks 15+ platforms including social media, coding sites, forums, and messaging apps.',
    privacyText:'Use unique usernames per platform, enable 2FA, review privacy settings regularly.',
    exposureText:'Cross-referencing usernames across platforms can reveal identity clusters.',
    exposureBtn:'Generate Exposure Report', generating:'Generating report...',
    reportDone:'Exposure report generated!',
    riskLow:'LOW RISK', riskMed:'MEDIUM RISK', riskHigh:'HIGH RISK', riskCritical:'CRITICAL RISK',step1Title:'Configure',step1Desc:'Set up the simulation parameters and choose your encryption method.',step2Title:'Process',step2Desc:'The data is processed through the chosen algorithm or technique.',step3Title:'Transmit',step3Desc:'The processed signal or message is sent through the communication channel.',step4Title:'Verify',step4Desc:'The receiver decodes, verifies, and validates the received data.',sectionCode:'Device Code',faq_q1:'What is Dark Profile?',faq_a1:'Dark Profile is an interactive simulation that demonstrates covert operations concepts. Enter a username to search across platforms. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real digital security behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Type a username in the search field. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real digital security principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Browser only. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Web Burner Chat and Web Cipher Suite. Each app in this category teaches a different aspect of digital security.',demo_s1:'Welcome to Dark Profile! Look at the main display — this is where the digital security simulation runs.',demo_s2:'Type a username in the search field. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Platform Database" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of digital security.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Cryptography',learn1Desc:'How secret codes protect messages from spies. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cybersecurity',learn2Title:'Wireless Communication',learn2Desc:'How devices send invisible signals through the air. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Wireless',learn3Title:'OPSEC',learn3Desc:'How to keep your operations secret and secure. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Security',learn4Title:'Math in Security',learn4Desc:'How numbers and algorithms make unbreakable codes. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Math',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Dark Profile! This is like a science experiment on your computer. You get to control a real covert operations simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Set up the simulation parameters and choose your e Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches digital security concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Dark Profile: Enter a username to search across platforms. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure through Process to Transmit and Verify.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Platform Database" and "Privacy Protection" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Radio Intelligence',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. Dark Profile builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Web Dark Profile',
    wiki_math: 'The mathematics behind Dark Profile: Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced radio intelligence practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to radio intelligence. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with radio intelligence: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in radio intelligence.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Radio Intelligence carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Dark Profile demonstrates key principles from covert operations. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world radio intelligence?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional radio intelligence systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title:'Profil Sombre', subtitle:'🕵️ Rechercher des pseudos sur les plateformes',
    disconnected:'Deconnecte', connected:'Connecte',
    mainSection:'Scanner Empreinte Numerique', mainDesc:'Entrez un pseudo pour rechercher sur les plateformes',
    sectionA:'Base de Plateformes', sectionB:'Protection Vie Privee', sectionC:'Analyse Exposition',
    activityLog:'Journal', eventsMsg:'Evenements et messages',
    clear:'Effacer', copy:'Copier', theme:'Theme', export:'Exporter', filterAll:'Tout',
    settings:'⚙️ Parametres', language:'Langue',
    help:'❓ Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    howto_1:'L écran principal affiche la simulation Dark Profile. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Set up the simulation parameters and choose your encryption ', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.', howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_themes_title:'🎨 Themes', wiki_themes:'8 themes.',
    wiki_i18n_title:'🌐 Langues', wiki_i18n:'Trilingue.',
    wiki_log_title:'📜 Journal', wiki_log:'Journal horodate.',
    wiki_privacy_title:'🔒 Confidentialite', wiki_privacy:'Local-first.',
    working:'En cours…',
    t_mosque:'Mosquee', t_zellige:'Zellige', t_andalus:'Andalous', t_riad:'Riad', t_medina:'Medina',
    t_space:'Espace', t_jungle:'Jungle', t_robot:'Robot',
    ready:'🕵️ Profil Sombre pret !',
    logCleared:'Journal efface', copied:'Copie !', copyFail:'Echec',
    soundEffects:'🔊 Effets sonores', whisperMode:'Mode murmure', breathingGuide:'Guide respiratoire',
    dhikrTap:'Tap', musicMode:'Reactif musique', splashHint:'appuyer pour passer',
    langChanged:'🌐 Langue → Francais', themeChanged:'🎨 Theme →',
    searchBtn:'Rechercher', enterUsername:'Entrez un pseudo d\'abord',
    searching:'Recherche en cours...', searchDone:'Recherche terminee !',
    found:'TROUVE', notFound:'NON TROUVE', riskLabel:'Score de Risque',
    platformText:'Le scanner verifie 15+ plateformes.',
    privacyText:'Utilisez des pseudos uniques par plateforme.',
    exposureText:'Le croisement des pseudos peut reveler des clusters d\'identite.',
    exposureBtn:'Generer Rapport', generating:'Generation...',
    reportDone:'Rapport genere !',
    riskLow:'RISQUE FAIBLE', riskMed:'RISQUE MOYEN', riskHigh:'RISQUE ELEVE', riskCritical:'RISQUE CRITIQUE',step1Title:'Configurer',step1Desc:'Configure les paramètres de simulation et choisis ta méthode de chiffrement.',step2Title:'Traiter',step2Desc:'Les données sont traitées par l\'algorithme ou la technique choisie.',step3Title:'Transmettre',step3Desc:'Le signal ou message traité est envoyé par le canal de communication.',step4Title:'Vérifier',step4Desc:'Le récepteur décode, vérifie et valide les données reçues.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Dark Profile ?',faq_a1:'Dark Profile est une simulation interactive qui démontre les concepts de opérations secrètes. Enter a username to search across platforms. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de sécurité numérique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de sécurité numérique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Browser only. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de sécurité numérique.',demo_s1:'Bienvenue dans Dark Profile ! Regarde l\'écran principal — c\'est ici que la simulation de sécurité numérique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de sécurité numérique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Cryptographie',learn1Desc:'How secret codes protect messages from spies. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Cybersécurité',learn2Title:'Communication sans fil',learn2Desc:'How devices send invisible signals through the air. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'Sans fil',learn3Title:'OPSEC',learn3Desc:'How to keep your operations secret and secure. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Sécurité',learn4Title:'Maths en sécurité',learn4Desc:'How numbers and algorithms make unbreakable codes. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Maths',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Dark Profile ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de opérations secrètes — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Set up the simulation parameters and choose your e Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de sécurité numérique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chiffrer et Décoder',ch1Desc:'Chiffre un message puis essaie de le décoder manuellement sans regarder la clé. Quels motifs repères-tu dans le texte chiffré ?',ch2Title:'Test de Furtivité',ch2Desc:'Essaie de compléter la mission avec l\'empreinte signal la plus faible possible. Peux-tu descendre sous le seuil de détection ?',ch3Title:'Course à l\'Interception',ch3Desc:'Lance une transmission et mesure le temps de détection. Qu\'est-ce qui affecte ce délai ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',purpose:'Dark Profile : Enter a username to search across platforms. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de renseignement radio',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. Dark Profile s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Web Dark Profile',
    wiki_math: 'Les mathématiques derrière Dark Profile : Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de renseignement radio utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour renseignement radio. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en renseignement radio : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Renseignement radio implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Dark Profile démontre les principes clés de opérations secrètes. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec radio intelligence dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title:'الملف المظلم', subtitle:'🕵️ البحث عن اسماء المستخدمين عبر المنصات',
    disconnected:'غير متصل', connected:'متصل',
    mainSection:'ماسح البصمة الرقمية', mainDesc:'ادخل اسم مستخدم للبحث عبر المنصات',
    sectionA:'قاعدة المنصات', sectionB:'حماية الخصوصية', sectionC:'تحليل التعرض',
    activityLog:'سجل النشاط', eventsMsg:'الاحداث والرسائل',
    clear:'مسح', copy:'نسخ', theme:'المظهر', export:'تصدير', filterAll:'الكل',
    settings:'⚙️ الاعدادات', language:'اللغة',
    help:'❓ مساعدة', faq:'اسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Dark Profile. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Set up the simulation parameters and choose your encryption ', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.', howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_themes_title:'🎨 المظاهر', wiki_themes:'8 مظاهر.',
    wiki_i18n_title:'🌐 اللغات', wiki_i18n:'ثلاثي اللغات.',
    wiki_log_title:'📜 سجل النشاط', wiki_log:'سجل مؤرخ.',
    wiki_privacy_title:'🔒 الخصوصية', wiki_privacy:'محلي اولا.',
    working:'جار…',
    t_mosque:'مسجد', t_zellige:'زليج', t_andalus:'اندلس', t_riad:'رياض', t_medina:'مدينة',
    t_space:'فضاء', t_jungle:'ادغال', t_robot:'روبوت',
    ready:'🕵️ الملف المظلم جاهز!',
    logCleared:'تم مسح السجل', copied:'تم النسخ!', copyFail:'فشل النسخ',
    soundEffects:'🔊 مؤثرات صوتية', whisperMode:'وضع الهمس', breathingGuide:'دليل التنفس',
    dhikrTap:'اضغط', musicMode:'تفاعل موسيقي', splashHint:'انقر للتخطي',
    langChanged:'🌐 اللغة ← العربية', themeChanged:'🎨 المظهر ←',
    searchBtn:'بحث', enterUsername:'ادخل اسم مستخدم اولا',
    searching:'جاري البحث...', searchDone:'اكتمل البحث!',
    found:'موجود', notFound:'غير موجود', riskLabel:'درجة مخاطر الخصوصية',
    platformText:'الماسح يفحص 15+ منصة.',
    privacyText:'استخدم اسماء فريدة لكل منصة.',
    exposureText:'مقارنة الاسماء عبر المنصات يكشف مجموعات الهوية.',
    exposureBtn:'توليد تقرير التعرض', generating:'جاري التوليد...',
    reportDone:'تم توليد التقرير!',
    riskLow:'خطر منخفض', riskMed:'خطر متوسط', riskHigh:'خطر مرتفع', riskCritical:'خطر حرج',step1Title:'تكوين',step1Desc:'اضبط معلمات المحاكاة واختر طريقة التشفير.',step2Title:'معالجة',step2Desc:'تتم معالجة البيانات عبر الخوارزمية أو التقنية المختارة.',step3Title:'إرسال',step3Desc:'يتم إرسال الإشارة أو الرسالة المعالجة عبر قناة الاتصال.',step4Title:'تحقق',step4Desc:'يقوم المستقبل بفك التشفير والتحقق من البيانات المستلمة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Dark Profile؟',faq_a1:'Dark Profile هي محاكاة تفاعلية توضح مفاهيم العمليات السرية. Enter a username to search across platforms. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الأمن الرقمي. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الأمن الرقمي. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Browser only. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الأمن الرقمي.',demo_s1:'مرحباً في Dark Profile! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الأمن الرقمي.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالأمن الرقمي.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'التشفير',learn1Desc:'How secret codes protect messages from spies. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'أمن سيبراني',learn2Title:'الاتصال اللاسلكي',learn2Desc:'How devices send invisible signals through the air. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'لاسلكي',learn3Title:'أمن العمليات',learn3Desc:'How to keep your operations secret and secure. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'أمان',learn4Title:'الرياضيات في الأمن',learn4Desc:'How numbers and algorithms make unbreakable codes. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'رياضيات',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Dark Profile! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالعمليات السرية — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Set up the simulation parameters and choose your e لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الأمن الرقمي من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'تشفير وفك تشفير',ch1Desc:'شفّر رسالة ثم حاول فك تشفيرها يدوياً بدون النظر للمفتاح. ما الأنماط التي تلاحظها؟',ch2Title:'اختبار التخفي',ch2Desc:'حاول إكمال المهمة بأقل بصمة إشارة ممكنة. هل يمكنك النزول تحت عتبة الكشف؟',ch3Title:'سباق الاعتراض',ch3Desc:'ابدأ بثاً وقِس سرعة اعتراضه. ما الذي يؤثر على وقت الكشف؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',purpose:'Dark Profile: Enter a username to search across platforms. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الاستخبارات اللاسلكية',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. يبني Dark Profile على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Web Dark Profile',
    wiki_math: 'الرياضيات وراء Dark Profile: Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الاستخبارات اللاسلكية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الاستخبارات اللاسلكية. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الاستخبارات اللاسلكية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الاستخبارات اللاسلكية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Dark Profile يوضح المبادئ الأساسية في العمليات السرية. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـradio intelligence في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',n);}catch{}log(`${s.themeChanged} ${s['t_'+n]||n}`,'info');}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}

let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const txt=$('statusText'),pill=$('statusPill'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}

let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}
function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const target=$(id);if(target)target.classList.add('active');});});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

/* ═══════ DARK PROFILE SIMULATION ═══════ */

const PLATFORMS = [
  { name: 'Twitter/X', icon: '🐦', category: 'social' },
  { name: 'Instagram', icon: '📸', category: 'social' },
  { name: 'Facebook', icon: '👤', category: 'social' },
  { name: 'TikTok', icon: '🎵', category: 'social' },
  { name: 'LinkedIn', icon: '💼', category: 'professional' },
  { name: 'GitHub', icon: '💻', category: 'coding' },
  { name: 'GitLab', icon: '🦊', category: 'coding' },
  { name: 'Stack Overflow', icon: '📚', category: 'coding' },
  { name: 'Reddit', icon: '🤖', category: 'forum' },
  { name: 'Discord', icon: '🎮', category: 'messaging' },
  { name: 'Telegram', icon: '✈️', category: 'messaging' },
  { name: 'YouTube', icon: '▶️', category: 'media' },
  { name: 'Twitch', icon: '🟣', category: 'media' },
  { name: 'Pinterest', icon: '📌', category: 'social' },
  { name: 'Spotify', icon: '🎧', category: 'media' },
  { name: 'Steam', icon: '🎮', category: 'gaming' },
  { name: 'Medium', icon: '📝', category: 'blog' },
  { name: 'Keybase', icon: '🔑', category: 'security' },
];

function hashUsername(username, platform) {
  let h = 0;
  const str = username.toLowerCase() + platform;
  for (let i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

function isFoundOnPlatform(username, platform) {
  const h = hashUsername(username, platform.name);
  // ~50-70% hit rate depending on username
  const threshold = 0.35 + (username.length % 5) * 0.07;
  return (h % 100) / 100 > threshold;
}

let lastResults = [];

async function searchUsername() {
  const s = LANG[currentLang];
  const input = $('usernameInput');
  const username = input ? input.value.trim() : '';
  if (!username) { log(s.enterUsername, 'error'); return; }

  const grid = $('platformGrid');
  const statusEl = $('searchStatus');
  const riskEl = $('riskScore');
  if (!grid) return;

  grid.innerHTML = '';
  if (statusEl) { statusEl.style.display = 'block'; statusEl.textContent = s.searching; }
  if (riskEl) riskEl.style.display = 'none';
  showToast(s.searching);
  log(`🔍 ${s.searching} "${username}"`, 'tx');
  setStatus(true);

  lastResults = [];
  let foundCount = 0;

  for (let i = 0; i < PLATFORMS.length; i++) {
    const p = PLATFORMS[i];
    const found = isFoundOnPlatform(username, p);
    lastResults.push({ ...p, found });
    if (found) foundCount++;

    const card = document.createElement('div');
    card.style.cssText = `padding:.6rem;border-radius:6px;border:1px solid ${found ? '#33cc5566' : '#ff444466'};background:${found ? '#33cc5511' : '#ff444411'};font-size:.8rem;display:flex;align-items:center;gap:.4rem;opacity:0;transition:opacity .3s;`;
    card.innerHTML = `<span style="font-size:1.2rem;">${p.icon}</span><div><strong>${p.name}</strong><br><span style="color:${found?'#33cc55':'#ff4444'};font-weight:700;font-size:.75rem;">${found ? '✅ '+s.found : '❌ '+s.notFound}</span></div>`;
    grid.appendChild(card);
    await sleep(80);
    card.style.opacity = '1';
  }

  // Risk score
  const ratio = foundCount / PLATFORMS.length;
  const score = Math.round(ratio * 100);
  let riskLevel, riskColor;
  if (score < 25) { riskLevel = s.riskLow; riskColor = '#33cc55'; }
  else if (score < 50) { riskLevel = s.riskMed; riskColor = '#ffaa00'; }
  else if (score < 75) { riskLevel = s.riskHigh; riskColor = '#ff6600'; }
  else { riskLevel = s.riskCritical; riskColor = '#ff2222'; }

  if (riskEl) {
    riskEl.style.display = 'block';
    riskEl.style.background = riskColor + '22';
    riskEl.style.border = `2px solid ${riskColor}`;
    riskEl.innerHTML = `<div style="font-size:2rem;font-weight:900;color:${riskColor};font-family:Orbitron,monospace;">${score}%</div><div style="font-size:.9rem;font-weight:700;">${s.riskLabel}</div><div style="font-size:1.1rem;color:${riskColor};font-weight:700;margin-top:.3rem;">${riskLevel}</div><div style="font-size:.75rem;opacity:.7;margin-top:.3rem;">${foundCount}/${PLATFORMS.length} platforms</div>`;
  }

  if (statusEl) statusEl.textContent = `${s.searchDone} — ${foundCount}/${PLATFORMS.length}`;
  hideToast();
  log(`${s.searchDone} ${foundCount}/${PLATFORMS.length} — ${riskLevel}`, foundCount > PLATFORMS.length * 0.5 ? 'error' : 'success');
}

async function generateExposureReport() {
  const s = LANG[currentLang];
  const results = $('exposureResults');
  if (!results) return;
  if (lastResults.length === 0) { log(s.enterUsername, 'error'); return; }

  results.style.display = 'block';
  results.innerHTML = '';
  showToast(s.generating);
  log(s.generating, 'tx');
  await sleep(800);

  const found = lastResults.filter(r => r.found);
  const categories = {};
  found.forEach(r => { if (!categories[r.category]) categories[r.category] = []; categories[r.category].push(r.name); });

  // Category breakdown
  for (const [cat, platforms] of Object.entries(categories)) {
    const div = document.createElement('div');
    div.style.cssText = 'padding:.5rem;margin:.3rem 0;border-radius:4px;border-left:3px solid var(--accent);font-size:.8rem;';
    div.innerHTML = `<strong style="text-transform:capitalize;">${cat}</strong>: ${platforms.join(', ')}`;
    results.appendChild(div);
    await sleep(200);
  }

  // Recommendations
  const recs = document.createElement('div');
  recs.style.cssText = 'margin-top:.8rem;padding:.6rem;border-radius:6px;background:var(--glass-bg);font-size:.8rem;';
  recs.innerHTML = `<strong>⚠️ Recommendations:</strong><ul style="margin:.3rem 0 0 1rem;padding:0;"><li>Use different usernames per platform</li><li>Enable 2FA on all ${found.length} found accounts</li><li>Review privacy settings on each platform</li><li>Remove unused accounts</li><li>Limit public bio information</li></ul>`;
  results.appendChild(recs);

  hideToast();
  log(s.reportDone, 'success');
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();
  const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
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
  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang');const st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initHijriDate();

  // App-specific
  const searchBtn=$('searchBtn');if(searchBtn)searchBtn.onclick=searchUsername;
  const input=$('usernameInput');if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter')searchUsername();});
  const exposureBtn=$('exposureBtn');if(exposureBtn)exposureBtn.onclick=generateExposureReport;

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED CANVAS — Digital Footprint Radar ═══════ */
(function(){
let rCanvas,rCtx,rAngle=0;
const CATS=[
  {name:'Social',angle:0,color:'#ff4488',items:['Twitter','Instagram','Facebook','TikTok']},
  {name:'Professional',angle:Math.PI*0.33,color:'#4488ff',items:['LinkedIn']},
  {name:'Coding',angle:Math.PI*0.66,color:'#44ff88',items:['GitHub','GitLab','StackOverflow']},
  {name:'Forum',angle:Math.PI,color:'#ffaa44',items:['Reddit']},
  {name:'Messaging',angle:Math.PI*1.33,color:'#cc44ff',items:['Discord','Telegram']},
  {name:'Media',angle:Math.PI*1.66,color:'#44ffff',items:['YouTube','Twitch','Spotify']},
];
const blips=[];
function createRC(){
  const cards=document.querySelectorAll('.card');
  const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');
  w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Digital Footprint Radar</div>';
  const c=document.createElement('canvas');c.width=600;c.height=400;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;cursor:crosshair;';
  w.appendChild(c);t.appendChild(w);return c;
}
function drawR(){
  if(!rCtx)return;
  const w=rCanvas.width,h=rCanvas.height,cx=w/2,cy=h/2,maxR=Math.min(cx,cy)-40;
  rCtx.fillStyle='rgba(6,13,26,0.12)';rCtx.fillRect(0,0,w,h);
  for(let r=1;r<=4;r++){rCtx.beginPath();rCtx.arc(cx,cy,maxR*r/4,0,Math.PI*2);rCtx.strokeStyle='rgba(100,200,150,0.08)';rCtx.lineWidth=1;rCtx.stroke();}
  CATS.forEach(cat=>{
    const ex=cx+Math.cos(cat.angle)*maxR,ey=cy+Math.sin(cat.angle)*maxR;
    rCtx.beginPath();rCtx.moveTo(cx,cy);rCtx.lineTo(ex,ey);rCtx.strokeStyle='rgba(255,255,255,0.06)';rCtx.lineWidth=1;rCtx.stroke();
    rCtx.fillStyle=cat.color;rCtx.font='9px Orbitron,monospace';rCtx.textAlign='center';
    rCtx.fillText(cat.name,cx+Math.cos(cat.angle)*(maxR+20),cy+Math.sin(cat.angle)*(maxR+20));
  });
  rAngle+=0.015;
  const sx=cx+Math.cos(rAngle)*maxR,sy=cy+Math.sin(rAngle)*maxR;
  const gr=rCtx.createLinearGradient(cx,cy,sx,sy);
  gr.addColorStop(0,'rgba(76,255,120,0.4)');gr.addColorStop(1,'rgba(76,255,120,0)');
  rCtx.beginPath();rCtx.moveTo(cx,cy);rCtx.lineTo(sx,sy);rCtx.strokeStyle=gr;rCtx.lineWidth=2;rCtx.stroke();
  rCtx.beginPath();rCtx.moveTo(cx,cy);rCtx.arc(cx,cy,maxR,rAngle-0.4,rAngle);rCtx.lineTo(cx,cy);
  rCtx.fillStyle='rgba(76,255,120,0.04)';rCtx.fill();
  CATS.forEach(cat=>{
    const diff=Math.abs(((rAngle%(Math.PI*2))-cat.angle+Math.PI*2)%(Math.PI*2));
    if(diff<0.03&&Math.random()>0.6){
      cat.items.forEach(p=>{
        if(Math.random()>0.5){
          const d=0.3+Math.random()*0.6,sp=cat.angle+(Math.random()-0.5)*0.4;
          blips.push({x:cx+Math.cos(sp)*maxR*d,y:cy+Math.sin(sp)*maxR*d,life:1,color:cat.color,name:p,size:4+Math.random()*4});
        }
      });
    }
  });
  for(let i=blips.length-1;i>=0;i--){
    const b=blips[i];b.life-=0.005;if(b.life<=0){blips.splice(i,1);continue;}
    rCtx.globalAlpha=b.life;
    rCtx.beginPath();rCtx.arc(b.x,b.y,b.size*b.life,0,Math.PI*2);rCtx.fillStyle=b.color;rCtx.fill();
    rCtx.beginPath();rCtx.arc(b.x,b.y,b.size*b.life+4,0,Math.PI*2);rCtx.strokeStyle=b.color+'66';rCtx.lineWidth=1;rCtx.stroke();
    if(b.life>0.7){rCtx.fillStyle='rgba(255,255,255,0.7)';rCtx.font='7px monospace';rCtx.textAlign='center';rCtx.fillText(b.name,b.x,b.y-b.size-3);}
    rCtx.globalAlpha=1;
  }
  rCtx.beginPath();rCtx.arc(cx,cy,4,0,Math.PI*2);rCtx.fillStyle='#33ff88';rCtx.fill();
  rCtx.fillStyle='rgba(255,255,255,0.3)';rCtx.font='8px monospace';rCtx.textAlign='left';
  rCtx.fillText('Tracking: '+blips.length+' signals | Sweep: '+(rAngle/(Math.PI*2)*360%360).toFixed(0)+'deg',8,h-8);
  requestAnimationFrame(drawR);
}
function initR(){rCanvas=createRC();if(!rCanvas)return;rCtx=rCanvas.getContext('2d');
  rCanvas.addEventListener('click',e=>{const rect=rCanvas.getBoundingClientRect();const mx=(e.clientX-rect.left)*(rCanvas.width/rect.width),my=(e.clientY-rect.top)*(rCanvas.height/rect.height);
    for(let i=0;i<8;i++)blips.push({x:mx+(Math.random()-0.5)*40,y:my+(Math.random()-0.5)*40,life:1,color:CATS[Math.floor(Math.random()*CATS.length)].color,name:'Signal',size:3+Math.random()*5});
  });drawR();}
setTimeout(initR,1500);
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
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this spy tool. First, look at the main control panel above. 🕵️', target:'#helpBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary button to start the simulation. Watch the visualization come alive! ⚡', target:'#settingsBtn', delay:3000},
  {i18n:'demo_s3', text:'Now try changing a setting — slide a slider or pick a different option. See how it changes? 🔄', target:'#logBtn', delay:3000},
  {i18n:'demo_s4', text:'Check the results below. The numbers and graphs show you what happened in real time. 📊', target:'#simCanvas', delay:3000},
  {i18n:'demo_s5', text:'Great job! 🎉 Now try the Lab section below for hands-on experiments. You\'re a real spy now!', target:'#mainCard', delay:3000},
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
