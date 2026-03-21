/**
 * Workshop DIY — Electronic Warfare Sim v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Canvas RF Viz
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){
  if(!soundEnabled) return;
  if(!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value=0.08;
  const t = audioCtx.currentTime;
  if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);}
  else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);}
  else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);}
}

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
    ...LANG_BASE.en,title:'Electronic Warfare Sim',subtitle:'Electronic Warfare Simulator',disconnected:'Idle',connected:'Jamming',mainSection:'Electronic Warfare Simulator',mainDesc:'Simulate jamming, ECM/ECCM and spectrum dominance',sectionA:'Active Emitters',sectionB:'EW Techniques',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'The main display shows the Electronic Warfare Sim simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Scan the electromagnetic spectrum to identify hostile RF emi',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Active Emitters" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',working:'Working...',ready:'EW Sim ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startJam:'Start Jamming',stopJam:'Stop Jamming',deployECM:'Deploy ECM',activateECCM:'Activate ECCM',resetSim:'Reset',jamParams:'Jamming Parameters',ewParams:'EW Parameters',centerFreq:'Center Freq (MHz):',bandwidth:'Bandwidth (MHz):',jamPower:'Jam Power (dBm):',jamType:'Jam Type:',ewStatus:'EW Status',emitterHint:'Detected RF emitters and their status.',barrage:'Barrage',spot:'Spot',sweep:'Sweep',pulse:'Pulse',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What is Electronic Warfare Sim?',faq_a1:'Electronic Warfare Sim is an interactive simulation that demonstrates RF warfare concepts. Simulate jamming, ECM/ECCM and spectrum dominance. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real electronic warfare behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Set jamming frequency and bandwidth. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real electronic warfare principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Rfw Anti Drone System and Rfw Cognitive Ew. Each app in this category teaches a different aspect of electronic warfare.',demo_s1:'Welcome to Electronic Warfare Sim! Look at the main display — this is where the electronic warfare simulation runs.',demo_s2:'Set jamming frequency and bandwidth. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Active Emitters" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of electronic warfare.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'SIGINT',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Electronic Warfare Sim! This is like a science experiment on your computer. You get to control a real RF warfare simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Scan the electromagnetic spectrum to identify host Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches electronic warfare concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',wiki_concept_title:'🔬 What is Electronic Warfare Sim?',wiki_concept:'Electronic Warfare Sim is a technique used in electronic warfare. Simulate jamming, ECM/ECCM and spectrum dominance. In professional settings, this technology requires HackRF and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Scan the electromagnetic spectrum to identify hostile RF emissions. Second: Analyze the threat signal: frequency, power, modulation, and direction. The simulation runs these stages in real time, showing you intermediate results at each step. In real electronic warfare, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Electronic Warfare Sim has practical applications in electronic warfare. Professionals use similar techniques with HackRF in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Electronic Warfare Sim: Simulate jamming, ECM/ECCM and spectrum dominance. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Detect RF Threat through Characterize Signal to Deploy Countermeasure and Assess Effectiveness.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Active Emitters" and "EW Techniques" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
    wiki_history_title: '📜 History of Exploit Development',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. Electronic Warfare Sim builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Rfw Electronic Warfare Sim',
    wiki_math: 'The mathematics behind Electronic Warfare Sim: Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced exploit development practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to exploit development. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with exploit development: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in exploit development.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Exploit Development carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Spectral Density',
    gloss1_def: 'Power distribution across frequencies, measured in watts per hertz. Shows how signal energy is spread across the spectrum — peaks indicate active transmissions.',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Capture Effect',
    gloss4_def: 'When a stronger signal overrides a weaker one at the receiver. Spoofers exploit this by transmitting a slightly stronger fake signal that the receiver locks onto.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Electronic Warfare Sim demonstrates key principles from RF warfare. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world exploit development?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional exploit development systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr:{
    ...LANG_BASE.fr,title:'Sim Guerre Electronique',subtitle:'Simulateur de Guerre Electronique',disconnected:'Inactif',connected:'Brouillage',mainSection:'Simulateur Guerre Electronique',mainDesc:'Simuler le brouillage, ECM/ECCM et dominance spectrale',sectionA:'Emetteurs Actifs',sectionB:'Techniques GE',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'L écran principal affiche la simulation Electronic Warfare Sim. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Scan the electromagnetic spectrum to identify hostile RF emi',howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',working:'En cours...',ready:'Sim GE pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startJam:'Demarrer Brouillage',stopJam:'Arreter Brouillage',deployECM:'Deployer ECM',activateECCM:'Activer ECCM',resetSim:'Reinitialiser',jamParams:'Parametres Brouillage',ewParams:'Parametres GE',centerFreq:'Freq Centre (MHz):',bandwidth:'Bande Passante (MHz):',jamPower:'Puissance (dBm):',jamType:'Type Brouillage:',ewStatus:'Statut GE',emitterHint:'Emetteurs RF detectes et leur statut.',barrage:'Barrage',spot:'Ponctuel',sweep:'Balayage',pulse:'Impulsion',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Electronic Warfare Sim ?',faq_a1:'Electronic Warfare Sim est une simulation interactive qui démontre les concepts de guerre RF. Simulate jamming, ECM/ECCM and spectrum dominance. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de guerre électronique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de guerre électronique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de guerre électronique.',demo_s1:'Bienvenue dans Electronic Warfare Sim ! Regarde l\'écran principal — c\'est ici que la simulation de guerre électronique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de guerre électronique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'SIGINT',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Electronic Warfare Sim ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de guerre RF — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Scan the electromagnetic spectrum to identify host Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de guerre électronique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Code de Démarrage',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6\\nsdr.center_freq = 100e6\\nsdr.gain = 40\\n\\nsamples = sdr.read_samples(256 * 1024)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Pic: {power_dB.max():.1f} dB")\\nsdr.close()',codeExplain:'Ce script Python capture des échantillons IQ depuis un dongle RTL-SDR à 100 MHz. La FFT convertit les échantillons temporels en spectre fréquentiel. La puissance en dB indique l\'intensité — plus c\'est haut, plus le signal est fort.',wiki_concept_title:'🔬 Qu\'est-ce que Electronic Warfare Sim ?',wiki_concept:'Electronic Warfare Sim est une technique utilisée en electronic warfare. Dans un contexte professionnel, cette technologie nécessite HackRF et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de electronic warfare. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'Electronic Warfare Sim a des applications pratiques en electronic warfare. Les professionnels utilisent des techniques similaires avec HackRF. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'Electronic Warfare Sim : Simulate jamming, ECM/ECCM and spectrum dominance. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
    wiki_history_title: '📜 Histoire de développement exploits',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. Electronic Warfare Sim s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Rfw Electronic Warfare Sim',
    wiki_math: 'Les mathématiques derrière Electronic Warfare Sim : Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de développement exploits utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour développement exploits. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en développement exploits : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Développement exploits implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Spectral Density',
    gloss1_def: 'Power distribution across frequencies, measured in watts per hertz. Shows how signal energy is spread across the spectrum — peaks indicate active transmissions.',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Capture Effect',
    gloss4_def: 'When a stronger signal overrides a weaker one at the receiver. Spoofers exploit this by transmitting a slightly stronger fake signal that the receiver locks onto.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Electronic Warfare Sim démontre les principes clés de guerre RF. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec exploit development dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar:{
    ...LANG_BASE.ar,title:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629',subtitle:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u062a\u0634\u0648\u064a\u0634',mainSection:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u0627\u0644\u062a\u0634\u0648\u064a\u0634 \u0648\u0627\u0644\u0625\u062c\u0631\u0627\u0621\u0627\u062a \u0627\u0644\u0645\u0636\u0627\u062f\u0629',sectionA:'\u0627\u0644\u0628\u0627\u0639\u062b\u0627\u062a \u0627\u0644\u0646\u0634\u0637\u0629',sectionB:'\u062a\u0642\u0646\u064a\u0627\u062a \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a\u0629 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startJam:'\u0628\u062f\u0621 \u0627\u0644\u062a\u0634\u0648\u064a\u0634',stopJam:'\u0625\u064a\u0642\u0627\u0641 \u0627\u0644\u062a\u0634\u0648\u064a\u0634',deployECM:'\u0646\u0634\u0631 ECM',activateECCM:'\u062a\u0641\u0639\u064a\u0644 ECCM',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',jamParams:'\u0645\u0639\u0644\u0645\u0627\u062a \u0627\u0644\u062a\u0634\u0648\u064a\u0634',ewParams:'\u0645\u0639\u0644\u0645\u0627\u062a \u0627\u0644\u062d\u0631\u0628',centerFreq:'\u0627\u0644\u062a\u0631\u062f\u062f \u0627\u0644\u0645\u0631\u0643\u0632\u064a:',bandwidth:'\u0639\u0631\u0636 \u0627\u0644\u0646\u0637\u0627\u0642:',jamPower:'\u0642\u062f\u0631\u0629 \u0627\u0644\u062a\u0634\u0648\u064a\u0634:',jamType:'\u0646\u0648\u0639 \u0627\u0644\u062a\u0634\u0648\u064a\u0634:',ewStatus:'\u062d\u0627\u0644\u0629 \u0627\u0644\u062d\u0631\u0628',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ما هو Electronic Warfare Sim؟',faq_a1:'Electronic Warfare Sim هي محاكاة تفاعلية توضح مفاهيم الحرب الإلكترونية. Simulate jamming, ECM/ECCM and spectrum dominance. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في الحرب الإلكترونية. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من الحرب الإلكترونية. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من الحرب الإلكترونية.',demo_s1:'مرحباً في Electronic Warfare Sim! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة الحرب الإلكترونية.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـالحرب الإلكترونية.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'SIGINT',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Electronic Warfare Sim! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالحرب الإلكترونية — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Scan the electromagnetic spectrum to identify host لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم الحرب الإلكترونية من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كود البداية',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6\\nsdr.center_freq = 100e6\\nsdr.gain = 40\\n\\nsamples = sdr.read_samples(256 * 1024)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak: {power_dB.max():.1f} dB")\\nsdr.close()',codeExplain:'يلتقط هذا الكود عينات IQ من جهاز RTL-SDR على 100 ميغاهرتز. تحويل FFT يحول العينات الزمنية إلى طيف ترددي. القدرة بالديسيبل تُظهر شدة الإشارة.',wiki_concept_title:'🔬 ما هو Electronic Warfare Sim؟',wiki_concept:'Electronic Warfare Sim هي تقنية تُستخدم في electronic warfare. في البيئات المهنية، تتطلب هذه التقنية HackRF وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من electronic warfare. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'Electronic Warfare Sim له تطبيقات عملية في electronic warfare. يستخدم المحترفون تقنيات مماثلة مع HackRF. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'Electronic Warfare Sim: Simulate jamming, ECM/ECCM and spectrum dominance. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ تطوير الثغرات',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. يبني Electronic Warfare Sim على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Rfw Electronic Warfare Sim',
    wiki_math: 'الرياضيات وراء Electronic Warfare Sim: Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو تطوير الثغرات المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في تطوير الثغرات. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في تطوير الثغرات: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'تطوير الثغرات يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Spectral Density',
    gloss1_def: 'Power distribution across frequencies, measured in watts per hertz. Shows how signal energy is spread across the spectrum — peaks indicate active transmissions.',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Capture Effect',
    gloss4_def: 'When a stronger signal overrides a weaker one at the receiver. Spoofers exploit this by transmitting a slightly stronger fake signal that the receiver locks onto.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Electronic Warfare Sim يوضح المبادئ الأساسية في الحرب الإلكترونية. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـexploit development في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}

/* ═══════ THEMES ═══════ */
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ew-log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}

/* ═══════ TOAST ═══════ */
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}

/* ═══════ STATUS ═══════ */
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}

/* ═══════ LOG FILTERS ═══════ */
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}

/* ═══════ PANELS ═══════ */
function initPanels(){
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');
  const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');
  if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};
  if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};
  if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};
  if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};
  if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};
  if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};
  if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};
  if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');
  const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');
  if(langSel)langSel.onchange=()=>setLanguage(langSel.value);
  if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);
  if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};
  const clearBtn=$('clearLogBtn'),copyBtn=$('copyLogBtn'),expBtn=$('exportLogBtn');
  if(clearBtn)clearBtn.onclick=clearLog;
  if(copyBtn)copyBtn.onclick=copyLog;
  if(expBtn)expBtn.onclick=exportLog;
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});
}

/* ═══════ EW DATA ═══════ */
let emitters = [];
let jamming = false;
let ecmActive = false;
let eccmActive = false;
let animFrame = null;
let time = 0;
let sweepPhase = 0;
let waterfallData = [];

function initEmitters(){
  emitters = [];
  const bands = [{name:'WiFi 2.4G',freq:2400,bw:80},{name:'WiFi 5G',freq:5200,bw:160},{name:'Radar X',freq:9500,bw:200},{name:'UHF Comms',freq:450,bw:25},{name:'L-Band SAT',freq:1575,bw:20},{name:'S-Band Radar',freq:3000,bw:100},{name:'C-Band VSAT',freq:4200,bw:40},{name:'VHF Radio',freq:150,bw:15}];
  bands.forEach((b,i)=>{
    emitters.push({id:'EM-'+(i+1),name:b.name,freq:b.freq,bw:b.bw,power:-30+Math.random()*40,active:true,jammed:false});
  });
}

/* ═══════ SPECTRUM CANVAS ═══════ */
function drawSpectrum(){
  const c=$('spectrumCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const W=c.width, H=c.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);

  // Grid
  for(let i=0;i<=10;i++){
    const x=i*W/10;
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText((100+i*590).toFixed(0),x,H-5);
  }
  for(let i=0;i<=5;i++){
    const y=i*H/5;
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.stroke();
    ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText((-20-i*20).toFixed(0)+' dBm',2,y+12);
  }

  // Noise floor
  ctx.beginPath();
  for(let x=0;x<W;x++){
    const nf = H*0.75 + Math.random()*10 - 5;
    if(x===0)ctx.moveTo(x,nf);else ctx.lineTo(x,nf);
  }
  ctx.strokeStyle='rgba(0,200,255,0.3)';ctx.lineWidth=1;ctx.stroke();

  // Emitter signals
  const centerFreq=parseFloat($('freqInput')?.value||2400);
  const bw=parseFloat($('bwInput')?.value||50);
  const jamPwr=parseFloat($('powerInput')?.value||20);
  const jamType=$('jamTypeSelect')?.value||'barrage';

  emitters.forEach(em=>{
    if(!em.active)return;
    const fx=(em.freq-100)/(6000-100)*W;
    const sigW=em.bw/(6000-100)*W;
    const sigH=(em.power+100)/120*H*0.7;
    ctx.beginPath();
    ctx.moveTo(fx-sigW,H*0.75);
    ctx.quadraticCurveTo(fx,H*0.75-sigH,fx+sigW,H*0.75);
    ctx.strokeStyle=em.jammed?'rgba(255,50,50,0.6)':'rgba(0,200,255,0.7)';
    ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle=em.jammed?'rgba(255,50,50,0.15)':'rgba(0,200,255,0.1)';
    ctx.fill();
    ctx.fillStyle=em.jammed?'#ff6666':'#66ccff';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(em.name,fx,H*0.75-sigH-8);
  });

  // Jamming visualization
  if(jamming){
    const jx=(centerFreq-100)/(6000-100)*W;
    let jw;
    if(jamType==='barrage') jw=bw*3/(6000-100)*W;
    else if(jamType==='spot') jw=bw*0.5/(6000-100)*W;
    else if(jamType==='sweep'){sweepPhase+=0.02;jw=bw/(6000-100)*W;const offset=Math.sin(sweepPhase)*bw*2/(6000-100)*W;}
    else jw=bw/(6000-100)*W;

    const actualX=jamType==='sweep'?jx+Math.sin(sweepPhase)*bw*2/(6000-100)*W:jx;
    const jamH=(jamPwr+20)/60*H*0.7;

    // Pulse modulation
    const pulseOn=jamType==='pulse'?Math.sin(time*10)>0:true;
    if(pulseOn){
      ctx.beginPath();
      ctx.moveTo(actualX-jw,H*0.75);
      ctx.quadraticCurveTo(actualX,H*0.75-jamH,actualX+jw,H*0.75);
      ctx.fillStyle='rgba(255,50,50,0.25)';ctx.fill();
      ctx.strokeStyle='rgba(255,50,50,0.9)';ctx.lineWidth=2;ctx.stroke();

      // Jam noise
      ctx.beginPath();
      for(let x=actualX-jw;x<actualX+jw;x+=2){
        const ny=H*0.75-jamH*0.5+Math.random()*jamH*0.4;
        if(x===actualX-jw)ctx.moveTo(x,ny);else ctx.lineTo(x,ny);
      }
      ctx.strokeStyle='rgba(255,100,100,0.5)';ctx.lineWidth=1;ctx.stroke();
    }

    // Check which emitters are jammed
    emitters.forEach(em=>{
      em.jammed=jamming&&Math.abs(em.freq-centerFreq)<bw*1.5&&em.power<jamPwr;
      if(eccmActive&&em.jammed)em.jammed=Math.random()>0.5;
    });
  } else {
    emitters.forEach(em=>em.jammed=false);
  }

  // ECM decoy signals
  if(ecmActive){
    for(let i=0;i<5;i++){
      const dx=Math.random()*W;
      const dy=H*0.4+Math.random()*H*0.3;
      ctx.beginPath();ctx.arc(dx,dy,3+Math.random()*4,0,Math.PI*2);
      ctx.fillStyle='rgba(255,200,0,0.6)';ctx.fill();
    }
    ctx.fillStyle='rgba(255,200,0,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='right';
    ctx.fillText('ECM DECOYS ACTIVE',W-10,20);
  }

  // Labels
  ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('RF SPECTRUM ANALYZER',10,18);
  if(jamming){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('JAMMING: '+jamType.toUpperCase()+' @ '+centerFreq+' MHz',10,34);}
  if(eccmActive){ctx.fillStyle='rgba(0,255,200,0.7)';ctx.fillText('ECCM ACTIVE',10,50);}
}

/* ═══════ WATERFALL CANVAS ═══════ */
function drawWaterfall(){
  const c=$('waterfallCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const W=c.width,H=c.height;

  // Shift existing data down
  const imgData=ctx.getImageData(0,0,W,H-1);
  ctx.putImageData(imgData,0,1);

  // Draw new line at top
  const centerFreq=parseFloat($('freqInput')?.value||2400);
  const bw=parseFloat($('bwInput')?.value||50);
  const jamPwr=parseFloat($('powerInput')?.value||20);

  for(let x=0;x<W;x++){
    const freq=100+(x/W)*5900;
    let intensity=Math.random()*30;
    // Emitter contributions
    emitters.forEach(em=>{
      if(!em.active)return;
      const dist=Math.abs(freq-em.freq);
      if(dist<em.bw) intensity+=((em.power+60)/100)*80*(1-dist/em.bw);
    });
    // Jamming contribution
    if(jamming){
      const dist=Math.abs(freq-centerFreq);
      if(dist<bw*1.5) intensity+=((jamPwr+20)/60)*120*(1-dist/(bw*1.5));
    }
    intensity=Math.min(255,intensity);
    const r=intensity>128?255:intensity*2;
    const g=intensity>128?(255-intensity)*2:intensity;
    const b=intensity<64?intensity*4:0;
    ctx.fillStyle='rgb('+r+','+g+','+b+')';
    ctx.fillRect(x,0,1,1);
  }

  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('WATERFALL DISPLAY',5,H-5);
}

/* ═══════ ANIMATION LOOP ═══════ */
function animate(){
  time+=0.016;
  drawSpectrum();
  drawWaterfall();
  updateStats();
  animFrame=requestAnimationFrame(animate);
}

function updateStats(){
  const stats=$('ewStats');if(!stats)return;
  const freq=parseFloat($('freqInput')?.value||2400);
  const bw=parseFloat($('bwInput')?.value||50);
  const pwr=parseFloat($('powerInput')?.value||20);
  const jammedCount=emitters.filter(e=>e.jammed).length;
  stats.innerHTML=
    '<b>Freq:</b> '+freq+' MHz <b>BW:</b> '+bw+' MHz<br>'+
    '<b>Power:</b> '+pwr+' dBm<br>'+
    '<b>Emitters:</b> '+emitters.length+' ('+jammedCount+' jammed)<br>'+
    '<b>ECM:</b> '+(ecmActive?'<span style="color:#ffcc00">ACTIVE</span>':'OFF')+
    ' <b>ECCM:</b> '+(eccmActive?'<span style="color:#00cc88">ACTIVE</span>':'OFF')+'<br>'+
    '<b>Status:</b> '+(jamming?'<span style="color:#ff4444">JAMMING</span>':'<span style="color:#00cc88">STANDBY</span>');
}

/* ═══════ EMITTER LIST ═══════ */
function updateEmitterList(){
  const lib=$('emitterList');if(!lib)return;
  lib.innerHTML='';
  emitters.forEach(em=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+(em.jammed?'rgba(255,50,50,0.1)':'rgba(0,200,255,0.05)');
    row.innerHTML='<span style="color:'+(em.jammed?'#ff6666':'#66ccff')+'">'+em.id+' '+em.name+'</span>'+
      '<span>'+em.freq+' MHz</span>'+
      '<span>'+em.power.toFixed(0)+' dBm</span>'+
      '<span style="color:'+(em.jammed?'#ff4444':'#00cc88')+'">'+(em.jammed?'JAMMED':'ACTIVE')+'</span>';
    lib.appendChild(row);
  });
}

/* ═══════ TECHNIQUES DATABASE ═══════ */
function initTechDatabase(){
  const db=$('techDatabase');if(!db)return;
  db.innerHTML=[
    '<b>Barrage Jamming:</b> Wideband noise across entire frequency range.',
    '<b>Spot Jamming:</b> Concentrated energy on specific frequency.',
    '<b>Sweep Jamming:</b> Rapidly sweeping across a band.',
    '<b>Pulse Jamming:</b> High-power intermittent bursts.',
    '<b>ECM (Electronic Countermeasures):</b> Decoys and false targets.',
    '<b>ECCM (Electronic Counter-Countermeasures):</b> Frequency hopping, spread spectrum.',
  ].join('<br><br>');
}

/* ═══════ CONTROLS ═══════ */
function initControls(){
  $('freqInput').oninput=()=>{$('freqLabel').textContent=$('freqInput').value+' MHz';};
  $('bwInput').oninput=()=>{$('bwLabel').textContent=$('bwInput').value+' MHz';};
  $('powerInput').oninput=()=>{$('powerLabel').textContent=$('powerInput').value+' dBm';};

  $('jamBtn').onclick=()=>{
    jamming=!jamming;
    setStatus(jamming);
    $('jamBtn').querySelector('[data-i18n]').textContent=jamming?LANG[currentLang].stopJam:LANG[currentLang].startJam;
    log(jamming?'Jamming STARTED — '+$('jamTypeSelect').value+' @ '+$('freqInput').value+' MHz':'Jamming STOPPED',jamming?'tx':'info');
    if(jamming)showToast('Jamming active...',2000);
  };

  $('ecmBtn').onclick=()=>{
    ecmActive=!ecmActive;
    log(ecmActive?'ECM deployed — generating decoy signals':'ECM deactivated',ecmActive?'tx':'info');
    playSound(ecmActive?'success':'click');
  };

  $('eccmBtn').onclick=()=>{
    eccmActive=!eccmActive;
    log(eccmActive?'ECCM activated — frequency hopping enabled':'ECCM deactivated',eccmActive?'success':'info');
    playSound(eccmActive?'success':'click');
  };

  $('resetBtn').onclick=()=>{
    jamming=false;ecmActive=false;eccmActive=false;
    setStatus(false);
    initEmitters();
    $('jamBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].startJam;
    log('Simulation reset','info');
    playSound('click');
  };
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  initSplash();
  initPanels();
  initLogFilters();
  initEmitters();
  initTechDatabase();
  initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');
  animate();
  setInterval(updateEmitterList,1000);
});

/* ═══════ ENHANCED RF CANVAS — ELECTRONIC WARFARE ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _threatBearing=new Array(360).fill(-90);
let _jamEfficiency=new Array(200).fill(0);
let _freqHopLog=[];let _ewParticles=[];

class EWParticle{constructor(x,y,vx,vy,c){this.x=x;this.y=y;this.vx=vx;this.vy=vy;this.c=c;this.life=1;this.decay=0.02+Math.random()*0.02;}
update(){this.x+=this.vx;this.y+=this.vy;this.life-=this.decay;return this.life>0;}
draw(ctx){ctx.beginPath();ctx.arc(this.x,this.y,2*this.life,0,Math.PI*2);ctx.fillStyle=this.c.replace('1)',this.life*0.6+')');ctx.fill();}}

/* ── Threat Bearing Display (RWR) ── */
function drawRWR(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('RADAR WARNING RECEIVER',5,12);
  const cx=W/2,cy=H/2,R=Math.min(W,H)/2-25;
  for(let i=1;i<=3;i++){ctx.beginPath();ctx.arc(cx,cy,R*i/3,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.1)';ctx.lineWidth=1;ctx.stroke();}
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.strokeStyle='rgba(0,255,136,0.06)';ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
  ctx.fillText('N',cx,cy-R-5);ctx.fillText('S',cx,cy+R+10);ctx.fillText('E',cx+R+8,cy+3);ctx.fillText('W',cx-R-8,cy+3);
  if(typeof emitters!=='undefined'){
    emitters.forEach((em,i)=>{
      const bearing=(i*45+_t*10)%360;const br=bearing*Math.PI/180;
      const threat=(em.power+60)/100;const dist=0.3+threat*0.5;
      const ex=cx+Math.cos(br-Math.PI/2)*dist*R;const ey=cy+Math.sin(br-Math.PI/2)*dist*R;
      const symbol=em.name.includes('Radar')?'▲':em.name.includes('Comms')?'◆':'●';
      ctx.fillStyle=em.jammed?'rgba(100,100,100,0.5)':threat>0.6?'rgba(255,50,50,0.8)':threat>0.3?'rgba(255,200,0,0.7)':'rgba(0,200,255,0.6)';
      ctx.font='12px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(symbol,ex,ey+4);
      ctx.font='7px Orbitron,monospace';ctx.fillText(em.id,ex,ey-8);
      if(!em.jammed&&threat>0.5){ctx.beginPath();ctx.arc(ex,ey,8+Math.sin(_t*4+i)*3,0,Math.PI*2);ctx.strokeStyle='rgba(255,50,50,0.4)';ctx.lineWidth=1;ctx.stroke();}
    });
  }
  ctx.beginPath();ctx.arc(cx,cy,5,0,Math.PI*2);ctx.fillStyle='rgba(0,255,136,0.8)';ctx.fill();
}

/* ── Jamming Efficiency Chart ── */
function drawJamEfficiency(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('JAMMING EFFICIENCY OVER TIME',5,12);
  const isJam=typeof jamming!=='undefined'&&jamming;
  const pwr=parseFloat(_$('powerInput')?.value||20);
  const eff=isJam?Math.min(99,pwr*2+Math.random()*15):Math.random()*5;
  _jamEfficiency.push(eff);if(_jamEfficiency.length>200)_jamEfficiency.shift();
  ctx.beginPath();
  _jamEfficiency.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/100)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=isJam?'rgba(255,100,0,0.7)':'rgba(0,200,255,0.5)';ctx.lineWidth=2;ctx.stroke();
  ctx.lineTo(W,H-10);ctx.lineTo(0,H-10);ctx.closePath();
  ctx.fillStyle=isJam?'rgba(255,100,0,0.08)':'rgba(0,200,255,0.04)';ctx.fill();
  const lastEff=_jamEfficiency[_jamEfficiency.length-1];
  ctx.fillStyle=lastEff>60?'rgba(0,200,100,0.7)':'rgba(255,200,0,0.7)';ctx.font='14px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText(lastEff.toFixed(0)+'%',W-10,30);
}

/* ── ECCM Frequency Hopping Visualization ── */
function drawECCMHopping(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('ECCM FREQUENCY HOPPING',5,12);
  const isECCM=typeof eccmActive!=='undefined'&&eccmActive;
  if(isECCM&&_t%0.08<0.02){
    _freqHopLog.push({f:100+Math.random()*5800,t:_t});
    if(_freqHopLog.length>120)_freqHopLog.shift();
  }
  _freqHopLog.forEach((h,i)=>{
    const x=(i/120)*W;const y=20+((h.f-100)/5800)*(H-30);
    ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);
    const alpha=1-i/120;
    ctx.fillStyle='rgba(0,255,200,'+alpha*0.7+')';ctx.fill();
    if(i>0){const prev=_freqHopLog[i-1];ctx.beginPath();
      ctx.moveTo(((i-1)/120)*W,20+((prev.f-100)/5800)*(H-30));ctx.lineTo(x,y);
      ctx.strokeStyle='rgba(0,255,200,'+alpha*0.2+')';ctx.lineWidth=0.5;ctx.stroke();}
  });
  if(!isECCM){ctx.fillStyle='rgba(100,100,100,0.4)';ctx.font='11px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('ECCM INACTIVE',W/2,H/2);}
}

/* ── Power Spectral Density 3D View ── */
function drawPSD3D(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('POWER SPECTRAL DENSITY',5,12);
  const isJam=typeof jamming!=='undefined'&&jamming;
  const rows=20;
  for(let r=rows-1;r>=0;r--){
    ctx.beginPath();
    const yOffset=20+r*(H-30)/rows;
    for(let x=0;x<W;x++){
      const f=(x/W)*6000;let psd=-80+Math.random()*3;
      if(typeof emitters!=='undefined')emitters.forEach(em=>{if(Math.abs(f-em.freq)<em.bw)psd+=20;});
      if(isJam){const cf=parseFloat(_$('freqInput')?.value||2400);const bw=parseFloat(_$('bwInput')?.value||50);if(Math.abs(f-cf)<bw*1.5)psd+=15;}
      const h=(psd+85)/50*15;
      const y=yOffset-h+Math.sin(_t+r*0.3)*0.5;
      if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    const alpha=0.1+((rows-r)/rows)*0.4;
    ctx.strokeStyle=isJam?'rgba(255,100,0,'+alpha+')':'rgba(0,200,255,'+alpha+')';ctx.lineWidth=1;ctx.stroke();
  }
}

function enhancedRender(){
  _t+=0.016;
  for(let i=_ewParticles.length-1;i>=0;i--)if(!_ewParticles[i].update())_ewParticles.splice(i,1);
  const specC=_$('spectrumCanvas');
  if(specC){const ctx=specC.getContext('2d');
    drawRWR(ctx,specC.width,specC.height);
    if(typeof jamming!=='undefined'&&jamming){
      for(let i=0;i<2;i++){const a=Math.random()*Math.PI*2;
        _ewParticles.push(new EWParticle(specC.width/2,specC.height/2,Math.cos(a)*2,Math.sin(a)*2,'rgba(255,100,0,1)'));}
      _ewParticles.forEach(p=>p.draw(ctx));
    }
  }
  const wfC=_$('waterfallCanvas');
  if(wfC){const ctx=wfC.getContext('2d');
    drawJamEfficiency(ctx,wfC.width,wfC.height);}
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
