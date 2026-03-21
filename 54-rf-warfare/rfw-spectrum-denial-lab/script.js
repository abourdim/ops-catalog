/**
 * Workshop DIY — Spectrum Denial Lab v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Canvas RF Viz
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);}}

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
  en:{
    ...LANG_BASE.en,title:'Spectrum Denial Lab',subtitle:'Spectrum Denial Lab',disconnected:'Idle',connected:'Denying',mainSection:'Spectrum Denial Lab',mainDesc:'RF area denial zones and frequency blocking simulation',sectionA:'Denial Zones',sectionB:'Denial Techniques',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Denial Zones" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',working:'Working...',ready:'Spectrum Denial Lab ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',activateDenial:'Activate Denial',deactivateDenial:'Deactivate',addZone:'Add Zone',resetSim:'Reset',zoneParams:'Denial Zone',freqParams:'Frequency Range',zoneRadius:'Radius (km):',denialPower:'Power (dBm):',startFreq:'Start (MHz):',endFreq:'End (MHz):',denialStatus:'Denial Status',zoneHint:'Active denial zones and blocked bands.',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What is Spectrum Denial Lab?',faq_a1:'Spectrum Denial Lab lets you rf area denial zones and frequency blocking simulation. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real electronic warfare behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Set denial zone radius and power. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real electronic warfare principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Rfw Anti Drone System and Rfw Cognitive Ew. Each app in this category teaches a different aspect of electronic warfare.',demo_s1:'Welcome to Spectrum Denial Lab! Look at the main display — this is where the electronic warfare simulation runs.',demo_s2:'Set denial zone radius and power. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Denial Zones" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of electronic warfare.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'SIGINT',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how electronic warfare works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches electronic warfare concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',wiki_concept_title:'🔬 What is Spectrum Denial Lab?',wiki_concept:'Spectrum Denial Lab is a technique used in electronic warfare. RF area denial zones and frequency blocking simulation. In professional settings, this technology requires HackRF and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Scan the electromagnetic spectrum to identify hostile RF emissions. Second: Analyze the threat signal: frequency, power, modulation, and direction. The simulation runs these stages in real time, showing you intermediate results at each step. In real electronic warfare, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Spectrum Denial Lab has practical applications in electronic warfare. Professionals use similar techniques with HackRF in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Spectrum Denial Lab: RF area denial zones and frequency blocking simulation. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Detect RF Threat through Characterize Signal to Deploy Countermeasure and Assess Effectiveness.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Denial Zones" and "Denial Techniques" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Exploit Development',
    wiki_history: 'The field of exploit development has evolved significantly over the past century. Early pioneers developed foundational techniques using analog equipment. The digital revolution transformed exploit development by enabling software-defined approaches. Modern practitioners use tools like browser to perform tasks that once required rooms full of equipment. Understanding this history helps you appreciate why certain protocols and standards exist today.',
    wiki_math_title: '📐 Mathematics Behind Rfw Spectrum Denial Lab',
    wiki_math: 'The mathematics underpinning rfw spectrum denial lab involves several key concepts. Signal processing relies on Fourier transforms to convert between time and frequency domains. Information theory (Shannon entropy) determines the theoretical limits of data transmission. Probability and statistics help distinguish real signals from noise. Linear algebra enables matrix operations used in encryption and modulation. Understanding these mathematical foundations lets you predict system behavior before building it.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced exploit development practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to exploit development. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with exploit development: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in exploit development.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Exploit Development carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
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
    theory: 'Understanding the theory behind rfw spectrum denial lab requires grasping several interconnected concepts from exploit development. At the most fundamental level, this technology works by manipulating signals — whether electromagnetic waves, digital data streams, or sensor readings. The simulation in this app models these real-world phenomena using mathematical equations running in your browser. Every button press and slider adjustment maps to a real parameter that engineers and researchers tune in professional settings. The key principle is that information can be encoded, transmitted, processed, and decoded using well-defined mathematical operations. Fourier analysis breaks complex signals into simple sine waves. Shannon information theory tells us the maximum data rate for any communication channel. Error correction codes add redundancy so messages survive noise and interference. By experimenting with this simulation, you build intuition for these principles — the same intuition that professionals develop over years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world exploit development?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional exploit development systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr:{
    ...LANG_BASE.fr,title:'Labo Deni Spectral',subtitle:'Labo Deni Spectral',disconnected:'Inactif',connected:'Deni actif',mainSection:'Labo Deni Spectral',mainDesc:'Zones de deni RF et blocage de frequences',sectionA:'Zones de Deni',sectionB:'Techniques de Deni',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Regarde la carte principale en haut. C\'est ton panneau de contrôle. Règle les paramètres avec les curseurs et menus déroulants. Chacun est étiqueté. Commence avec les valeurs par défaut pour voir le comportement normal.',howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',working:'En cours...',ready:'Labo pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',activateDenial:'Activer Deni',deactivateDenial:'Desactiver',addZone:'Ajouter Zone',resetSim:'Reinitialiser',zoneParams:'Zone de Deni',freqParams:'Plage Frequences',zoneRadius:'Rayon (km):',denialPower:'Puissance (dBm):',startFreq:'Debut (MHz):',endFreq:'Fin (MHz):',denialStatus:'Statut Deni',zoneHint:'Zones actives et bandes bloquees.',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Spectrum Denial Lab ?',faq_a1:'Spectrum Denial Lab te permet de simuler guerre électronique. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de guerre électronique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de guerre électronique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de guerre électronique.',demo_s1:'Bienvenue dans Spectrum Denial Lab ! Regarde l\'écran principal — c\'est ici que la simulation de guerre électronique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de guerre électronique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'SIGINT',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne guerre électronique en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de guerre électronique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Code de Démarrage',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6\\nsdr.center_freq = 100e6\\nsdr.gain = 40\\n\\nsamples = sdr.read_samples(256 * 1024)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Pic: {power_dB.max():.1f} dB")\\nsdr.close()',codeExplain:'Ce script Python capture des échantillons IQ depuis un dongle RTL-SDR à 100 MHz. La FFT convertit les échantillons temporels en spectre fréquentiel. La puissance en dB indique l\'intensité — plus c\'est haut, plus le signal est fort.',wiki_concept_title:'🔬 Qu\'est-ce que Spectrum Denial Lab ?',wiki_concept:'Spectrum Denial Lab est une technique utilisée en electronic warfare. Dans un contexte professionnel, cette technologie nécessite HackRF et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de electronic warfare. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'Spectrum Denial Lab a des applications pratiques en electronic warfare. Les professionnels utilisent des techniques similaires avec HackRF. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'Spectrum Denial Lab : RF area denial zones and frequency blocking simulation. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de développement exploits',
    wiki_history: 'Le domaine de développement exploits a considérablement évolué au cours du siècle dernier. Les pionniers ont développé des techniques fondamentales avec des équipements analogiques. La révolution numérique a transformé le domaine en permettant des approches logicielles. Les praticiens modernes utilisent des outils comme browser pour réaliser des tâches qui nécessitaient autrefois des salles entières de matériel. Comprendre cette histoire vous aide à apprécier pourquoi certains protocoles existent.',
    wiki_math_title: '📐 Mathématiques de Rfw Spectrum Denial Lab',
    wiki_math: 'Les mathématiques sous-jacentes impliquent plusieurs concepts clés. Le traitement du signal repose sur les transformées de Fourier. La théorie de information (entropie de Shannon) détermine les limites théoriques. Les probabilités et statistiques distinguent les signaux du bruit. L algèbre linéaire permet les opérations matricielles pour le chiffrement et la modulation. Comprendre ces fondations permet de prédire le comportement du système.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de développement exploits utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour développement exploits. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en développement exploits : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Développement exploits implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
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
    theory: 'Comprendre la théorie derrière cette application nécessite de saisir plusieurs concepts interconnectés de exploit development. Au niveau le plus fondamental, cette technologie fonctionne en manipulant des signaux — ondes électromagnétiques, flux de données numériques ou lectures de capteurs. La simulation modélise ces phénomènes réels à l aide d équations mathématiques dans votre navigateur. Chaque bouton et curseur correspond à un paramètre réel que les ingénieurs ajustent en pratique. Le principe clé est que l information peut être encodée, transmise, traitée et décodée avec des opérations mathématiques bien définies. L analyse de Fourier décompose les signaux complexes. La théorie de l information de Shannon indique le débit maximal pour tout canal de communication. Les codes correcteurs ajoutent de la redondance pour que les messages survivent au bruit. En expérimentant avec cette simulation, vous développez une intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec exploit development dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar:{
    ...LANG_BASE.ar,title:'\u0645\u062e\u062a\u0628\u0631 \u062d\u0631\u0645\u0627\u0646 \u0627\u0644\u0637\u064a\u0641',subtitle:'\u0645\u062e\u062a\u0628\u0631 \u062d\u0631\u0645\u0627\u0646 \u0627\u0644\u0637\u064a\u0641',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u062d\u0631\u0645\u0627\u0646 \u0646\u0634\u0637',mainSection:'\u0645\u062e\u062a\u0628\u0631 \u062d\u0631\u0645\u0627\u0646 \u0627\u0644\u0637\u064a\u0641',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u0645\u0646\u0627\u0637\u0642 \u062d\u0631\u0645\u0627\u0646 RF',sectionA:'\u0645\u0646\u0627\u0637\u0642 \u0627\u0644\u062d\u0631\u0645\u0627\u0646',sectionB:'\u062a\u0642\u0646\u064a\u0627\u062a \u0627\u0644\u062d\u0631\u0645\u0627\u0646',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0627\u0644\u0645\u062e\u062a\u0628\u0631 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',activateDenial:'\u062a\u0641\u0639\u064a\u0644 \u0627\u0644\u062d\u0631\u0645\u0627\u0646',deactivateDenial:'\u0625\u064a\u0642\u0627\u0641',addZone:'\u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u0637\u0642\u0629',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',zoneParams:'\u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u062d\u0631\u0645\u0627\u0646',freqParams:'\u0646\u0637\u0627\u0642 \u0627\u0644\u062a\u0631\u062f\u062f',zoneRadius:'\u0627\u0644\u0646\u0635\u0641 \u0642\u0637\u0631:',denialPower:'\u0627\u0644\u0642\u062f\u0631\u0629:',startFreq:'\u0627\u0644\u0628\u062f\u0627\u064a\u0629:',endFreq:'\u0627\u0644\u0646\u0647\u0627\u064a\u0629:',denialStatus:'\u062d\u0627\u0644\u0629 \u0627\u0644\u062d\u0631\u0645\u0627\u0646',zoneHint:'\u0627\u0644\u0645\u0646\u0627\u0637\u0642 \u0627\u0644\u0646\u0634\u0637\u0629.',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ما هو Spectrum Denial Lab؟',faq_a1:'Spectrum Denial Lab يتيح لك محاكاة الحرب الإلكترونية. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الحرب الإلكترونية. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الحرب الإلكترونية. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الحرب الإلكترونية.',demo_s1:'مرحباً في Spectrum Denial Lab! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الحرب الإلكترونية.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالحرب الإلكترونية.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'SIGINT',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل الحرب الإلكترونية من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الحرب الإلكترونية من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كود البداية',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6\\nsdr.center_freq = 100e6\\nsdr.gain = 40\\n\\nsamples = sdr.read_samples(256 * 1024)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak: {power_dB.max():.1f} dB")\\nsdr.close()',codeExplain:'يلتقط هذا الكود عينات IQ من جهاز RTL-SDR على 100 ميغاهرتز. تحويل FFT يحول العينات الزمنية إلى طيف ترددي. القدرة بالديسيبل تُظهر شدة الإشارة.',wiki_concept_title:'🔬 ما هو Spectrum Denial Lab؟',wiki_concept:'Spectrum Denial Lab هي تقنية تُستخدم في electronic warfare. في البيئات المهنية، تتطلب هذه التقنية HackRF وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من electronic warfare. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'Spectrum Denial Lab له تطبيقات عملية في electronic warfare. يستخدم المحترفون تقنيات مماثلة مع HackRF. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'Spectrum Denial Lab: RF area denial zones and frequency blocking simulation. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ تطوير الثغرات',
    wiki_history: 'تطور مجال تطوير الثغرات بشكل كبير خلال القرن الماضي. طور الرواد تقنيات أساسية باستخدام معدات تناظرية. حولت الثورة الرقمية المجال من خلال تمكين الأساليب البرمجية. يستخدم الممارسون المعاصرون أدوات مثل browser لأداء مهام كانت تتطلب في السابق غرفاً كاملة من المعدات. فهم هذا التاريخ يساعدك على تقدير سبب وجود بروتوكولات ومعايير معينة اليوم.',
    wiki_math_title: '📐 الرياضيات وراء Rfw Spectrum Denial Lab',
    wiki_math: 'تتضمن الرياضيات الكامنة عدة مفاهيم أساسية. تعتمد معالجة الإشارات على تحويلات فورييه للتحويل بين مجالي الزمن والتردد. تحدد نظرية المعلومات (إنتروبيا شانون) الحدود النظرية لنقل البيانات. تساعد الاحتمالات والإحصاء في تمييز الإشارات الحقيقية من الضوضاء. يتيح الجبر الخطي العمليات المصفوفية المستخدمة في التشفير والتعديل.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو تطوير الثغرات المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في تطوير الثغرات. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في تطوير الثغرات: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'تطوير الثغرات يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
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
    theory: 'فهم النظرية الكامنة وراء هذا التطبيق يتطلب استيعاب عدة مفاهيم مترابطة من exploit development. على المستوى الأساسي، تعمل هذه التقنية عن طريق التلاعب بالإشارات — سواء كانت موجات كهرومغناطيسية أو تدفقات بيانات رقمية أو قراءات مستشعرات. تحاكي هذه المحاكاة الظواهر الحقيقية باستخدام معادلات رياضية تعمل في متصفحك. كل زر ومنزلق يتوافق مع معامل حقيقي يضبطه المهندسون والباحثون في الإعدادات المهنية. المبدأ الأساسي هو أن المعلومات يمكن ترميزها ونقلها ومعالجتها وفك ترميزها باستخدام عمليات رياضية محددة. يحلل تحليل فورييه الإشارات المعقدة إلى موجات جيبية بسيطة. تحدد نظرية المعلومات لشانون الحد الأقصى لمعدل البيانات. تضيف رموز تصحيح الأخطاء التكرار حتى تنجو الرسائل من الضوضاء والتداخل.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـexploit development في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}

/* ═══════ THEMES ═══════ */
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sd-log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}

/* ═══════ TOAST / STATUS / SPLASH ═══════ */
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}

/* ═══════ LOG FILTERS ═══════ */
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}

/* ═══════ PANELS ═══════ */
function initPanels(){const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');if(langSel)langSel.onchange=()=>setLanguage(langSel.value);if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};const clearBtn=$('clearLogBtn'),copyBtn=$('copyLogBtn'),expBtn=$('exportLogBtn');if(clearBtn)clearBtn.onclick=clearLog;if(copyBtn)copyBtn.onclick=copyLog;if(expBtn)expBtn.onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});}

/* ═══════ DENIAL DATA ═══════ */
let zones = [];
let denialActive = false;
let time = 0;
let zoneIdCounter = 0;

function addZone(){
  const r = parseFloat($('radiusInput')?.value||15);
  const p = parseFloat($('powerInput')?.value||30);
  const f1 = parseFloat($('startFreqInput')?.value||400);
  const f2 = parseFloat($('endFreqInput')?.value||2500);
  const cx = 100+Math.random()*580;
  const cy = 80+Math.random()*190;
  zoneIdCounter++;
  zones.push({id:'DZ-'+zoneIdCounter, cx, cy, radius:r, power:p, freqStart:f1, freqEnd:f2, active:denialActive});
  log('Zone DZ-'+zoneIdCounter+' added: '+f1+'-'+f2+' MHz, '+r+' km','tx');
}

/* ═══════ ZONE CANVAS ═══════ */
function drawZoneMap(){
  const c=$('zoneCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);

  // Grid
  for(let i=0;i<20;i++){const x=i*W/20;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle='rgba(0,255,136,0.06)';ctx.lineWidth=1;ctx.stroke();}
  for(let i=0;i<10;i++){const y=i*H/10;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.strokeStyle='rgba(0,255,136,0.06)';ctx.stroke();}

  // Terrain reference points
  const pois=[{x:150,y:100,label:'BASE-A'},{x:500,y:200,label:'BASE-B'},{x:350,y:280,label:'HQ'},{x:650,y:120,label:'RELAY'}];
  pois.forEach(p=>{
    ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.7)';ctx.fill();
    ctx.fillStyle='rgba(0,200,255,0.5)';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(p.label,p.x,p.y-8);
  });

  // Denial zones
  zones.forEach(z=>{
    const isActive = denialActive && z.active;
    const r = z.radius*3;
    // Zone circle
    const grad = ctx.createRadialGradient(z.cx,z.cy,0,z.cx,z.cy,r);
    if(isActive){
      grad.addColorStop(0,'rgba(255,50,50,0.3)');
      grad.addColorStop(0.7,'rgba(255,50,50,0.1)');
      grad.addColorStop(1,'rgba(255,50,50,0)');
    } else {
      grad.addColorStop(0,'rgba(100,100,100,0.2)');
      grad.addColorStop(1,'rgba(100,100,100,0)');
    }
    ctx.beginPath();ctx.arc(z.cx,z.cy,r,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();
    // Pulsing border
    if(isActive){
      const pulseR = r+Math.sin(time*3)*8;
      ctx.beginPath();ctx.arc(z.cx,z.cy,pulseR,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,50,50,0.5)';ctx.lineWidth=2;ctx.stroke();
      // Interference lines
      for(let a=0;a<Math.PI*2;a+=Math.PI/6){
        const len=r*0.3+Math.random()*r*0.4;
        ctx.beginPath();ctx.moveTo(z.cx,z.cy);
        ctx.lineTo(z.cx+Math.cos(a+time)*len,z.cy+Math.sin(a+time)*len);
        ctx.strokeStyle='rgba(255,100,50,0.3)';ctx.lineWidth=1;ctx.stroke();
      }
    }
    ctx.fillStyle=isActive?'#ff6666':'#888';ctx.font='10px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(z.id,z.cx,z.cy-r-5);
    ctx.fillText(z.freqStart+'-'+z.freqEnd+' MHz',z.cx,z.cy+4);
  });

  ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('AREA DENIAL MAP',10,18);
  if(denialActive){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('DENIAL ACTIVE — '+zones.length+' ZONES',10,34);}
}

/* ═══════ BAND CANVAS ═══════ */
function drawBandView(){
  const c=$('bandCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);

  // Frequency axis
  ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
  for(let f=0;f<=6000;f+=500){
    const x=(f/6000)*W;
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle='rgba(0,255,136,0.1)';ctx.lineWidth=1;ctx.stroke();
    ctx.fillText(f+'',x,H-3);
  }

  // Denied bands
  zones.forEach(z=>{
    if(!denialActive||!z.active)return;
    const x1=(z.freqStart/6000)*W;
    const x2=(z.freqEnd/6000)*W;
    ctx.fillStyle='rgba(255,50,50,0.3)';
    ctx.fillRect(x1,5,x2-x1,H-20);
    // Noise within denied band
    ctx.beginPath();
    for(let x=x1;x<x2;x+=3){
      const y=H/2+Math.random()*30-15;
      if(x===x1)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle='rgba(255,100,100,0.6)';ctx.lineWidth=1;ctx.stroke();
  });

  // Clean spectrum outside
  ctx.beginPath();
  for(let x=0;x<W;x++){
    let denied=false;
    const freq=(x/W)*6000;
    zones.forEach(z=>{if(denialActive&&z.active&&freq>=z.freqStart&&freq<=z.freqEnd)denied=true;});
    const y=denied?H/2+Math.random()*20-10:H*0.7+Math.random()*6-3;
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle='rgba(0,200,255,0.5)';ctx.lineWidth=1;ctx.stroke();

  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('FREQUENCY DENIAL BANDS (0-6 GHz)',5,14);
}

/* ═══════ ANIMATION ═══════ */
function animate(){time+=0.016;drawZoneMap();drawBandView();updateStats();requestAnimationFrame(animate);}

function updateStats(){
  const stats=$('denialStats');if(!stats)return;
  const activeZones=zones.filter(z=>z.active).length;
  let totalBW=0;zones.forEach(z=>{if(z.active)totalBW+=z.freqEnd-z.freqStart;});
  stats.innerHTML='<b>Zones:</b> '+zones.length+' ('+activeZones+' active)<br><b>Denied BW:</b> '+(denialActive?totalBW:0)+' MHz<br><b>Status:</b> '+(denialActive?'<span style="color:#ff4444">DENYING</span>':'<span style="color:#00cc88">STANDBY</span>');
}

function updateZoneList(){
  const lib=$('zoneList');if(!lib)return;lib.innerHTML='';
  zones.forEach(z=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+(z.active&&denialActive?'rgba(255,50,50,0.1)':'rgba(0,200,255,0.05)');
    row.innerHTML='<span style="color:'+(z.active&&denialActive?'#ff6666':'#66ccff')+'">'+z.id+'</span><span>'+z.freqStart+'-'+z.freqEnd+' MHz</span><span>'+z.radius+' km</span><span>'+z.power+' dBm</span><span style="color:'+(z.active&&denialActive?'#ff4444':'#888')+'">'+(z.active&&denialActive?'DENIED':'READY')+'</span>';
    lib.appendChild(row);
  });
}

/* ═══════ TECHNIQUES ═══════ */
function initTechDatabase(){const db=$('techDatabase');if(!db)return;db.innerHTML=['<b>Broadband Denial:</b> Flood entire frequency ranges with noise.','<b>Selective Denial:</b> Target specific communication bands only.','<b>Reactive Denial:</b> Detect and deny signals on demand.','<b>Layered Denial:</b> Multiple overlapping zones for redundancy.','<b>Time-based Denial:</b> Schedule denial windows for operations.','<b>Adaptive Power:</b> Adjust power based on threat proximity.'].join('<br><br>');}

/* ═══════ CONTROLS ═══════ */
function initControls(){
  $('radiusInput').oninput=()=>{$('radiusLabel').textContent=$('radiusInput').value+' km';};
  $('powerInput').oninput=()=>{$('powerLabel').textContent=$('powerInput').value+' dBm';};
  $('startFreqInput').oninput=()=>{$('startFreqLabel').textContent=$('startFreqInput').value+' MHz';};
  $('endFreqInput').oninput=()=>{$('endFreqLabel').textContent=$('endFreqInput').value+' MHz';};

  $('denyBtn').onclick=()=>{
    denialActive=!denialActive;
    zones.forEach(z=>z.active=denialActive);
    setStatus(denialActive);
    $('denyBtn').querySelector('[data-i18n]').textContent=denialActive?LANG[currentLang].deactivateDenial:LANG[currentLang].activateDenial;
    log(denialActive?'Spectrum denial ACTIVATED — '+zones.length+' zones':'Denial DEACTIVATED',denialActive?'error':'info');
    if(denialActive)showToast('Denial active...',2000);
  };

  $('addZoneBtn').onclick=()=>{addZone();playSound('click');};
  $('resetBtn').onclick=()=>{denialActive=false;zones=[];zoneIdCounter=0;setStatus(false);$('denyBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].activateDenial;log('Simulation reset','info');playSound('click');};
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  initSplash();initPanels();initLogFilters();initTechDatabase();initControls();
  addZone();addZone();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');
  animate();
  setInterval(updateZoneList,1000);
});

/* ═══════ ENHANCED RF CANVAS — SPECTRUM DENIAL ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _coverageHistory=new Array(200).fill(0);let _denialParticles=[];
let _signalAttempts=[];let _interferenceMap=[];

class DenialParticle{constructor(x,y){this.x=x;this.y=y;this.vx=(Math.random()-0.5)*3;this.vy=(Math.random()-0.5)*3;this.life=1;this.decay=0.015+Math.random()*0.015;this.size=1+Math.random()*3;}
update(){this.x+=this.vx;this.y+=this.vy;this.vx*=0.98;this.vy*=0.98;this.life-=this.decay;return this.life>0;}
draw(ctx){ctx.beginPath();ctx.arc(this.x,this.y,this.size*this.life,0,Math.PI*2);ctx.fillStyle='rgba(255,80,50,'+this.life*0.5+')';ctx.fill();}}

/* ── Signal Attempt Monitoring ── */
function drawSignalAttempts(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('SIGNAL PENETRATION ATTEMPTS',5,12);
  const isDeny=typeof denialActive!=='undefined'&&denialActive;
  if(isDeny&&Math.random()>0.92){
    _signalAttempts.push({x:Math.random()*W,freq:100+Math.random()*5800,power:-60+Math.random()*40,blocked:Math.random()>0.2,time:_t});
    if(_signalAttempts.length>40)_signalAttempts.shift();
  }
  _signalAttempts.forEach((a,i)=>{
    const y=25+((a.freq-100)/5800)*(H-35);const age=_t-a.time;const alpha=Math.max(0.1,1-age*0.3);
    ctx.beginPath();ctx.arc(a.x,y,4,0,Math.PI*2);
    ctx.fillStyle=a.blocked?'rgba(255,50,50,'+alpha+')':'rgba(0,255,136,'+alpha+')';ctx.fill();
    if(a.blocked){ctx.beginPath();ctx.moveTo(a.x-4,y-4);ctx.lineTo(a.x+4,y+4);ctx.moveTo(a.x+4,y-4);ctx.lineTo(a.x-4,y+4);
      ctx.strokeStyle='rgba(255,50,50,'+alpha+')';ctx.lineWidth=2;ctx.stroke();}
  });
  const blocked=_signalAttempts.filter(a=>a.blocked).length;
  const total=_signalAttempts.length||1;
  ctx.fillStyle='rgba(255,50,50,0.5)';ctx.font='8px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText('BLOCKED: '+blocked+'/'+total+' ('+(blocked/total*100).toFixed(0)+'%)',W-10,H-5);
}

/* ── Coverage Effectiveness Timeline ── */
function drawCoverageTimeline(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('DENIAL COVERAGE EFFECTIVENESS',5,12);
  const isDeny=typeof denialActive!=='undefined'&&denialActive;
  const zoneCount=typeof zones!=='undefined'?zones.filter(z=>z.active).length:0;
  const eff=isDeny?Math.min(99,zoneCount*25+Math.random()*10):Math.random()*3;
  _coverageHistory.push(eff);if(_coverageHistory.length>200)_coverageHistory.shift();
  // Fill area
  ctx.beginPath();ctx.moveTo(0,H-10);
  _coverageHistory.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/100)*(H-25);ctx.lineTo(x,y);});
  ctx.lineTo(W,H-10);ctx.closePath();
  ctx.fillStyle=isDeny?'rgba(255,50,50,0.1)':'rgba(0,200,255,0.05)';ctx.fill();
  // Line
  ctx.beginPath();
  _coverageHistory.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/100)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=isDeny?'rgba(255,80,80,0.8)':'rgba(0,200,255,0.5)';ctx.lineWidth=2;ctx.stroke();
  const last=_coverageHistory[_coverageHistory.length-1];
  ctx.fillStyle=last>60?'rgba(255,50,50,0.7)':'rgba(255,200,0,0.7)';ctx.font='14px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText(last.toFixed(0)+'%',W-10,30);
}

/* ── Spectral Occupancy Heatmap ── */
function drawSpectralHeatmap(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('SPECTRAL OCCUPANCY HEATMAP',5,12);
  const isDeny=typeof denialActive!=='undefined'&&denialActive;
  const step=8;const rows=Math.floor((H-25)/step);const cols=Math.floor(W/step);
  for(let r=0;r<rows;r++){for(let c=0;c<cols;c++){
    const freq=(c/cols)*6000;const tSlot=r;
    let occ=Math.random()*20;
    if(isDeny&&typeof zones!=='undefined'){zones.forEach(z=>{if(z.active&&freq>=z.freqStart&&freq<=z.freqEnd)occ+=60+Math.random()*30;});}
    const norm=Math.min(1,occ/100);
    const red=norm>0.5?255:norm*500;const grn=norm<0.4?150:150*(1-norm);const blu=norm<0.3?200:0;
    ctx.fillStyle='rgba('+Math.floor(red)+','+Math.floor(grn)+','+Math.floor(blu)+',0.6)';
    ctx.fillRect(c*step,20+r*step,step-1,step-1);
  }}
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
  for(let f=0;f<=6000;f+=1000){const x=(f/6000)*W;ctx.fillText(f+'',x,H-2);}
}

/* ── Zone Overlap Analysis ── */
function drawZoneOverlap(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('ZONE FREQUENCY OVERLAP MATRIX',5,12);
  if(typeof zones==='undefined'||zones.length===0)return;
  const n=zones.length;const cellW=Math.min(40,(W-40)/n);const cellH=Math.min(25,(H-40)/n);
  zones.forEach((za,i)=>{
    zones.forEach((zb,j)=>{
      const x=30+j*cellW;const y=30+i*cellH;
      let overlap=0;
      if(i===j)overlap=1;
      else{const s=Math.max(za.freqStart,zb.freqStart);const e=Math.min(za.freqEnd,zb.freqEnd);
        if(s<e)overlap=(e-s)/Math.max(za.freqEnd-za.freqStart,1);}
      ctx.fillStyle=overlap>0.5?'rgba(255,50,50,0.5)':overlap>0?'rgba(255,200,0,0.3)':'rgba(0,200,255,0.1)';
      ctx.fillRect(x,y,cellW-2,cellH-2);
      if(overlap>0){ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
        ctx.fillText((overlap*100).toFixed(0)+'%',x+cellW/2,y+cellH/2+3);}
    });
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='7px Orbitron,monospace';ctx.textAlign='right';
    ctx.fillText(zones[i].id,28,30+i*cellH+cellH/2+3);
    ctx.textAlign='center';ctx.fillText(zones[i].id,30+i*cellW+cellW/2,28);
  });
}

function enhancedRender(){
  _t+=0.016;
  for(let i=_denialParticles.length-1;i>=0;i--)if(!_denialParticles[i].update())_denialParticles.splice(i,1);
  const zc=_$('zoneCanvas');
  if(zc){const ctx=zc.getContext('2d');
    if(typeof denialActive!=='undefined'&&denialActive&&typeof zones!=='undefined'){
      zones.forEach(z=>{if(z.active){for(let i=0;i<2;i++)_denialParticles.push(new DenialParticle(z.cx,z.cy));}});
      _denialParticles.forEach(p=>p.draw(ctx));
    }
  }
  const bc=_$('bandCanvas');
  if(bc){const ctx=bc.getContext('2d');const W=bc.width,H=bc.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawCoverageTimeline(ctx,W,H*0.5);
    ctx.save();ctx.translate(0,H*0.5);drawSignalAttempts(ctx,W,H*0.5);ctx.restore();}
  requestAnimationFrame(enhancedRender);
}
setTimeout(()=>{enhancedRender();},500);
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
