/**
 * Workshop DIY — Radar Jammer Lab v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Canvas RF Viz
 */
const $=id=>document.getElementById(id);
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
    ...LANG_BASE.en,title:'Radar Jammer Lab',subtitle:'Radar Jammer Lab',disconnected:'Idle',connected:'Jamming',mainSection:'Radar Jammer Lab',mainDesc:'Simulate radar jamming and ECM techniques',sectionA:'Jamming History',sectionB:'ECM Reference',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',working:'Working...',ready:'Radar Jammer Lab ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startJam:'Start Jamming',analyze:'Analyze',resetSim:'Reset',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What is Radar Jammer Lab?',faq_a1:'Radar Jammer Lab is an interactive simulation that demonstrates RF warfare concepts. Simulate radar jamming and ECM techniques. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real electronic warfare behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real electronic warfare principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Rfw Anti Drone System and Rfw Cognitive Ew. Each app in this category teaches a different aspect of electronic warfare.',demo_s1:'Welcome to Radar Jammer Lab! Look at the main display — this is where the electronic warfare simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Jamming History" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of electronic warfare.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'SIGINT',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Radar Jammer Lab! This is like a science experiment on your computer. You get to control a real RF warfare simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Scan the electromagnetic spectrum to identify host Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches electronic warfare concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',wiki_concept_title:'🔬 What is Radar Jammer Lab?',wiki_concept:'Radar Jammer Lab is a technique used in electronic warfare. Simulate radar jamming and ECM techniques. In professional settings, this technology requires HackRF and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Scan the electromagnetic spectrum to identify hostile RF emissions. Second: Analyze the threat signal: frequency, power, modulation, and direction. The simulation runs these stages in real time, showing you intermediate results at each step. In real electronic warfare, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Radar Jammer Lab has practical applications in electronic warfare. Professionals use similar techniques with HackRF in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Radar Jammer Lab: Simulate radar jamming and ECM techniques. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Detect RF Threat through Characterize Signal to Deploy Countermeasure and Assess Effectiveness.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Jamming History" and "ECM Reference" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Exploit Development',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. Radar Jammer Lab builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Rfw Radar Jammer Lab',
    wiki_math: 'The mathematics behind Radar Jammer Lab: Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Radar range equation: R_max = (Pt·G²·λ²·σ / (4π)³·Smin)^(1/4). Doppler shift fd = 2v·f₀/c gives target velocity.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced exploit development practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to exploit development. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with exploit development: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in exploit development.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Exploit Development carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'Hertz (Hz)',
    gloss2_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
    gloss3_term: 'Doppler Shift',
    gloss3_def: 'Frequency change caused by relative motion between transmitter and receiver. Approaching objects shift frequency up; receding objects shift it down. fd = 2v·f₀/c.',
    gloss4_term: 'Spread Spectrum',
    gloss4_def: 'A technique spreading signal energy across a wide bandwidth. Makes signals harder to jam (requires more power) and detect (signal is below noise floor).',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Radar Jammer Lab demonstrates key principles from RF warfare. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Radar transmits electromagnetic pulses and measures reflections to detect objects. Range, velocity, and angle can be determined from the echo characteristics. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world exploit development?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional exploit development systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
  fr:{title:'Labo Brouilleur Radar',subtitle:'Labo Brouilleur Radar',disconnected:'Inactif',connected:'Brouillage',mainSection:'Labo Brouilleur Radar',mainDesc:'Simuler le brouillage radar et les techniques CME',sectionA:'Historique',sectionB:'Reference CME',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',working:'En cours...',ready:'Labo Brouilleur pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startJam:'Demarrer Brouillage',analyze:'Analyser',resetSim:'Reinitialiser',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Radar Jammer Lab est une simulation interactive qui démontre les concepts de guerre RF. Simulate radar jamming and ECM techniques. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais electronic warfare signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai electromagnetic combat techniques ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Rfw Comms Interception Hub and Rfw Anti Drone System ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 Histoire de développement exploits',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. Radar Jammer Lab s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Rfw Radar Jammer Lab',
    wiki_math: 'Les mathématiques derrière Radar Jammer Lab : Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Radar range equation: R_max = (Pt·G²·λ²·σ / (4π)³·Smin)^(1/4). Doppler shift fd = 2v·f₀/c gives target velocity.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de développement exploits utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour développement exploits. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en développement exploits : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Développement exploits implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'Hertz (Hz)',
    gloss2_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
    gloss3_term: 'Doppler Shift',
    gloss3_def: 'Frequency change caused by relative motion between transmitter and receiver. Approaching objects shift frequency up; receding objects shift it down. fd = 2v·f₀/c.',
    gloss4_term: 'Spread Spectrum',
    gloss4_def: 'A technique spreading signal energy across a wide bandwidth. Makes signals harder to jam (requires more power) and detect (signal is below noise floor).',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Radar Jammer Lab démontre les principes clés de guerre RF. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Radar transmits electromagnetic pulses and measures reflections to detect objects. Range, velocity, and angle can be determined from the echo characteristics. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec exploit development dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
  ar:{title:'\u0645\u062e\u062a\u0628\u0631 \u062a\u0634\u0648\u064a\u0634 \u0627\u0644\u0631\u0627\u062f\u0627\u0631',subtitle:'\u0645\u062e\u062a\u0628\u0631 \u062a\u0634\u0648\u064a\u0634 \u0627\u0644\u0631\u0627\u062f\u0627\u0631',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u062a\u0634\u0648\u064a\u0634',mainSection:'\u0645\u062e\u062a\u0628\u0631 \u062a\u0634\u0648\u064a\u0634 \u0627\u0644\u0631\u0627\u062f\u0627\u0631',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u062a\u0634\u0648\u064a\u0634 \u0627\u0644\u0631\u0627\u062f\u0627\u0631',sectionA:'\u0627\u0644\u0633\u062c\u0644',sectionB:'\u0645\u0631\u062c\u0639',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',working:'\u062c\u0627\u0631\u064d...',ready:'\u0645\u062e\u062a\u0628\u0631 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startJam:'\u0628\u062f\u0621 \u0627\u0644\u062a\u0634\u0648\u064a\u0634',analyze:'\u062a\u062d\u0644\u064a\u0644',resetSim:'\u0625\u0639\u0627\u062f\u0629',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Radar Jammer Lab هي محاكاة تفاعلية توضح مفاهيم الحرب الإلكترونية. Simulate radar jamming and ECM techniques. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج electronic warfare signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا electromagnetic combat techniques حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Rfw Comms Interception Hub and Rfw Anti Drone System! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 تاريخ تطوير الثغرات',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. يبني Radar Jammer Lab على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Rfw Radar Jammer Lab',
    wiki_math: 'الرياضيات وراء Radar Jammer Lab: Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Radar range equation: R_max = (Pt·G²·λ²·σ / (4π)³·Smin)^(1/4). Doppler shift fd = 2v·f₀/c gives target velocity.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو تطوير الثغرات المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في تطوير الثغرات. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في تطوير الثغرات: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'تطوير الثغرات يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'Hertz (Hz)',
    gloss2_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
    gloss3_term: 'Doppler Shift',
    gloss3_def: 'Frequency change caused by relative motion between transmitter and receiver. Approaching objects shift frequency up; receding objects shift it down. fd = 2v·f₀/c.',
    gloss4_term: 'Spread Spectrum',
    gloss4_def: 'A technique spreading signal energy across a wide bandwidth. Makes signals harder to jam (requires more power) and detect (signal is below noise floor).',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Radar Jammer Lab يوضح المبادئ الأساسية في الحرب الإلكترونية. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Radar transmits electromagnetic pulses and measures reflections to detect objects. Range, velocity, and angle can be determined from the echo characteristics. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـexploit development في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(s[k]!=null)e.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+n,'info');}

let logContainer;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+t;d.textContent='['+new Date().toLocaleTimeString()+'] '+m;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(on){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=on?s.connected:s.disconnected;if(p)p.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

function initPanels(){
  const hBtn=$('helpBtn'),hC=$('helpCloseBtn'),hP=$('helpPanel'),hO=$('helpOverlay');
  const sBtn=$('settingsBtn'),sC=$('settingsCloseBtn'),sP=$('settingsPanel'),sO=$('settingsOverlay');
  const lBtn=$('logBtn'),lC=$('logCloseBtn'),lP=$('logPanel');
  if(hBtn)hBtn.onclick=()=>{hP.classList.toggle('open');hO.classList.toggle('active');};
  if(hC)hC.onclick=()=>{hP.classList.remove('open');hO.classList.remove('active');};
  if(hO)hO.onclick=()=>{hP.classList.remove('open');hO.classList.remove('active');};
  if(sBtn)sBtn.onclick=()=>{sP.classList.toggle('open');sO.classList.toggle('active');};
  if(sC)sC.onclick=()=>{sP.classList.remove('open');sO.classList.remove('active');};
  if(sO)sO.onclick=()=>{sP.classList.remove('open');sO.classList.remove('active');};
  if(lBtn)lBtn.onclick=()=>lP.classList.toggle('open');
  if(lC)lC.onclick=()=>lP.classList.remove('open');
  const ls=$('langSelect'),ts=$('themeSelect'),st=$('soundToggle');
  if(ls)ls.onchange=()=>setLanguage(ls.value);
  if(ts)ts.onchange=()=>setTheme(ts.value);
  if(st)st.onchange=()=>{soundEnabled=st.checked;};
  if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;
  if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;
  if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active');});});
}

/* ═══════ RADAR SIM ═══════ */
let jamming=false,time=0,sweepAngle=0,targets=[];
function initTargets(){targets=[];for(let i=0;i<8;i++)targets.push({r:0.2+Math.random()*0.7,a:Math.random()*Math.PI*2,rcs:5+Math.random()*20,speed:0.001+Math.random()*0.003});}

function drawRadar(){
  const c=$('radarCanvas');if(!c)return;
  const ctx=c.getContext('2d'),W=c.width,H=c.height,cx=W/2,cy=H/2,R=Math.min(W,H)/2-20;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // PPI scope circles
  for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(cx,cy,R*i/4,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,70,0.12)';ctx.lineWidth=1;ctx.stroke();}
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.strokeStyle='rgba(0,255,70,0.08)';ctx.stroke();
  // Sweep beam
  sweepAngle+=0.03;
  const grad=ctx.createConicalGradient?null:null;
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,sweepAngle-0.15,sweepAngle);ctx.closePath();
  ctx.fillStyle='rgba(0,255,70,0.15)';ctx.fill();
  ctx.beginPath();ctx.moveTo(cx,cy);
  ctx.lineTo(cx+Math.cos(sweepAngle)*R,cy+Math.sin(sweepAngle)*R);
  ctx.strokeStyle='rgba(0,255,70,0.6)';ctx.lineWidth=2;ctx.stroke();
  // Targets
  const jamPwr=parseInt($('jamPower')?.value||50)/100;
  targets.forEach(t=>{
    t.a+=t.speed;
    const tx=cx+Math.cos(t.a)*t.r*R,ty=cy+Math.sin(t.a)*t.r*R;
    const angleDiff=Math.abs(((sweepAngle-t.a)%(Math.PI*2)+Math.PI*2)%(Math.PI*2));
    const fade=angleDiff<0.5?1-angleDiff/0.5:Math.max(0,1-angleDiff/3);
    if(jamming&&Math.random()<jamPwr*0.7){
      // Jammed—scatter blips
      const jx=tx+(Math.random()-0.5)*60*jamPwr,jy=ty+(Math.random()-0.5)*60*jamPwr;
      ctx.beginPath();ctx.arc(jx,jy,2,0,Math.PI*2);ctx.fillStyle='rgba(0,255,70,'+fade*0.3+')';ctx.fill();
    } else {
      ctx.beginPath();ctx.arc(tx,ty,3+t.rcs/10,0,Math.PI*2);ctx.fillStyle='rgba(0,255,70,'+fade*0.8+')';ctx.fill();
    }
  });
  // Noise jamming overlay
  if(jamming){
    const jType=$('jamType')?.value||'noise';
    if(jType==='noise'){
      for(let i=0;i<300*jamPwr;i++){
        const rx=Math.random()*W,ry=Math.random()*H;
        const dist=Math.sqrt((rx-cx)**2+(ry-cy)**2);
        if(dist<R){ctx.fillStyle='rgba(0,255,70,'+(Math.random()*0.15*jamPwr)+')';ctx.fillRect(rx,ry,2,2);}
      }
    } else if(jType==='spot'){
      const band=R*0.1;
      ctx.fillStyle='rgba(0,255,70,'+jamPwr*0.3+')';
      ctx.fillRect(cx-R,cy-band,R*2,band*2);
    } else if(jType==='sweep'){
      const sw=time*2%Math.PI*2;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,sw-0.3,sw+0.3);ctx.closePath();
      ctx.fillStyle='rgba(255,100,0,'+jamPwr*0.3+')';ctx.fill();
    }
  }
  ctx.fillStyle='rgba(0,255,70,0.5)';ctx.font='11px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('PPI SCOPE — RANGE: '+($('radarRange')?.value||100)+' km',8,16);
  if(jamming){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('ECM ACTIVE — '+($('jamType')?.value||'noise').toUpperCase(),8,32);}
}

function drawSpectrum(){
  const c=$('spectrumCanvas');if(!c)return;
  const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const freq=parseFloat($('radarFreq')?.value||10);
  const jamPwr=parseInt($('jamPower')?.value||50);
  // Radar return signal
  ctx.beginPath();
  for(let x=0;x<W;x++){
    const f=x/W*40;
    let y=H*0.8;
    const diff=Math.abs(f-freq);
    if(diff<1)y=H*0.2*(diff/1);
    if(jamming){y=Math.min(y,H*0.1+Math.random()*H*0.4*(jamPwr/100));}
    y+=Math.random()*3;
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle=jamming?'rgba(255,100,0,0.7)':'rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='10px Orbitron,monospace';ctx.fillText('SPECTRUM — 0-40 GHz',5,14);
}

function animate(){time+=0.016;drawRadar();drawSpectrum();updateInfo();requestAnimationFrame(animate);}
function updateInfo(){
  const s=$('infoStats');if(!s)return;
  s.innerHTML='<b>Type:</b> '+($('jamType')?.value||'noise')+'<br><b>Power:</b> '+($('jamPower')?.value||50)+' dBm<br><b>Freq:</b> '+($('radarFreq')?.value||10)+' GHz<br><b>Status:</b> '+(jamming?'<span style="color:#ff4444">JAMMING</span>':'<span style="color:#00cc88">STANDBY</span>');
}

function initControls(){
  $('jamPower').oninput=()=>{$('jamPowerLabel').textContent=$('jamPower').value+' dBm';};
  $('radarFreq').oninput=()=>{$('radarFreqLabel').textContent=$('radarFreq').value+' GHz';};
  $('radarRange').oninput=()=>{$('radarRangeLabel').textContent=$('radarRange').value+' km';};
  $('startBtn').onclick=()=>{jamming=!jamming;setStatus(jamming);$('startBtn').querySelector('span:last-child').textContent=jamming?'Stop Jamming':LANG[currentLang].startJam;log(jamming?'Jamming ACTIVE — '+$('jamType').value+' mode':'Jamming stopped',jamming?'tx':'info');};
  $('analyzeBtn').onclick=()=>{showToast('Analyzing ECM effectiveness...',1500);setTimeout(()=>{const eff=jamming?(parseInt($('jamPower').value)*0.8+Math.random()*20).toFixed(1):0;log('ECM Analysis: '+eff+'% target suppression','success');hideToast();},1500);};
  $('resetBtn').onclick=()=>{jamming=false;setStatus(false);initTargets();log('Simulation reset','info');};
}

function initRefDB(){
  const db=$('refDatabase');if(!db)return;
  db.innerHTML=['<b>Noise Barrage:</b> Broadband noise across entire radar bandwidth.','<b>Spot Jamming:</b> Concentrated energy on specific radar frequency.','<b>Sweep Jamming:</b> Rapidly sweeping across frequency range.','<b>Deceptive ECM:</b> False targets via range-gate pull-off (RGPO).','<b>DRFM:</b> Digital RF Memory for coherent deception.','<b>Cross-eye:</b> Angular deception using phase-shifted signals.'].join('<br><br>');
}

document.addEventListener('DOMContentLoaded',()=>{
  initSplash();initPanels();initLogFilters();initTargets();initRefDB();initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');animate();
});

/* ═══════ ENHANCED RF CANVAS — RADAR JAMMER ═══════ */
(function(){
  const _$=id=>document.getElementById(id);
  let _t=0;
  const _particles=[];
  let _rcsHistory=new Array(200).fill(0);
  let _doppler=new Float32Array(256).fill(-80);
  let _wfBuf=[];
  const MAX_WF=100;
  let _falseTargets=[];
  for(let i=0;i<15;i++)_falseTargets.push({r:0.1+Math.random()*0.8,a:Math.random()*Math.PI*2,speed:0.01+Math.random()*0.02,size:2+Math.random()*4,blink:Math.random()*Math.PI*2});

  class JamParticle{constructor(x,y,a){this.x=x;this.y=y;this.vx=Math.cos(a)*3;this.vy=Math.sin(a)*3;this.life=1;this.decay=0.02+Math.random()*0.02;this.size=1+Math.random()*2;}
  update(){this.x+=this.vx;this.y+=this.vy;this.life-=this.decay;return this.life>0;}
  draw(ctx){ctx.beginPath();ctx.arc(this.x,this.y,this.size*this.life,0,Math.PI*2);ctx.fillStyle='rgba(255,100,0,'+this.life*0.6+')';ctx.fill();}}

  /* ── A-Scope Display ── */
  function drawAScope(ctx,W,H){
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText('A-SCOPE — RANGE vs AMPLITUDE',5,12);
    const isJam=typeof jamming!=='undefined'&&jamming;
    const pwr=parseInt(_$('jamPower')?.value||50)/100;
    ctx.beginPath();
    for(let x=0;x<W;x++){
      const range=x/W;let amp=H*0.85+Math.random()*4;
      if(typeof targets!=='undefined')targets.forEach(t=>{const d=Math.abs(range-t.r);if(d<0.03){amp=H*0.2+d/0.03*H*0.5;if(isJam&&Math.random()<pwr*0.6)amp=H*0.3+Math.random()*H*0.4;}});
      if(isJam){amp-=Math.random()*H*0.15*pwr;}
      if(x===0)ctx.moveTo(x,amp);else ctx.lineTo(x,amp);
    }
    ctx.strokeStyle=isJam?'rgba(255,100,0,0.7)':'rgba(0,255,70,0.7)';ctx.lineWidth=1.5;ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,H*0.85);ctx.lineTo(W,H*0.85);ctx.strokeStyle='rgba(0,255,70,0.15)';ctx.lineWidth=1;ctx.stroke();
    for(let i=0;i<=5;i++){const x=i*W/5;ctx.fillStyle='rgba(0,255,136,0.25)';ctx.fillText((i*20)+'km',x+2,H-3);}
  }

  /* ── Doppler Processing Display ── */
  function drawDoppler(ctx,W,H){
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText('DOPPLER VELOCITY PROFILE',5,12);
    const isJam=typeof jamming!=='undefined'&&jamming;
    const pwr=parseInt(_$('jamPower')?.value||50)/100;
    for(let i=0;i<256;i++){
      const v=(i-128)/128*500;
      let level=-80+Math.random()*3;
      if(typeof targets!=='undefined')targets.forEach(t=>{const tV=t.speed*10000;if(Math.abs(v-tV)<30)level+=20;});
      if(isJam)level+=Math.random()*25*pwr;
      _doppler[i]=_doppler[i]*0.8+level*0.2;
    }
    ctx.beginPath();
    for(let i=0;i<256;i++){const x=(i/256)*W;const y=H-10-((_doppler[i]+85)/60)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
    ctx.strokeStyle=isJam?'rgba(255,100,0,0.6)':'rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
    ctx.beginPath();ctx.moveTo(W/2,15);ctx.lineTo(W/2,H-10);ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1;ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText('0 m/s',W/2,H-1);ctx.fillText('-500',5,H-1);ctx.fillText('+500',W-20,H-1);
  }

  /* ── False Target Generator (DRFM) ── */
  function drawDRFM(ctx,W,H,cx,cy,R){
    const isJam=typeof jamming!=='undefined'&&jamming;
    if(!isJam)return;
    const jType=_$('jamType')?.value||'noise';
    if(jType!=='noise'){
      _falseTargets.forEach((ft,i)=>{
        ft.a+=ft.speed;
        const fx=cx+Math.cos(ft.a)*ft.r*R;
        const fy=cy+Math.sin(ft.a)*ft.r*R;
        const fade=0.3+Math.sin(_t*3+ft.blink)*0.3;
        ctx.beginPath();ctx.arc(fx,fy,ft.size*(0.5+Math.sin(_t*5+i)*0.3),0,Math.PI*2);
        ctx.fillStyle='rgba(0,255,70,'+fade+')';ctx.fill();
      });
      ctx.fillStyle='rgba(255,200,0,0.5)';ctx.font='9px Orbitron,monospace';ctx.textAlign='right';
      ctx.fillText('DRFM FALSE TARGETS: '+_falseTargets.length,W-8,H-8);
    }
  }

  /* ── RCS Fluctuation Chart ── */
  function drawRCSChart(ctx,W,H){
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText('TARGET RCS FLUCTUATION (dBsm)',5,12);
    const isJam=typeof jamming!=='undefined'&&jamming;
    let rcs=5+Math.sin(_t*2)*3+Math.random()*2;
    if(isJam){rcs+=Math.random()*15-5;rcs*=(0.3+Math.random()*0.7);}
    _rcsHistory.push(rcs);if(_rcsHistory.length>200)_rcsHistory.shift();
    ctx.beginPath();
    _rcsHistory.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-((v+5)/25)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
    ctx.strokeStyle='rgba(0,200,255,0.7)';ctx.lineWidth=1.5;ctx.stroke();
    if(isJam){ctx.fillStyle='rgba(255,100,0,0.3)';ctx.font='8px Orbitron,monospace';ctx.fillText('ECM DEGRADED',W-100,25);}
  }

  /* ── Radar Waterfall ── */
  function drawRadarWaterfall(ctx,W,H){
    const isJam=typeof jamming!=='undefined'&&jamming;
    const pwr=parseInt(_$('jamPower')?.value||50)/100;
    const row=new Uint8Array(W);
    for(let x=0;x<W;x++){
      let v=Math.random()*20;
      if(typeof targets!=='undefined')targets.forEach(t=>{const d=Math.abs(x/W-t.r);if(d<0.02)v+=60;});
      if(isJam)v+=Math.random()*80*pwr;
      row[x]=Math.min(255,v);
    }
    _wfBuf.unshift(row);if(_wfBuf.length>MAX_WF)_wfBuf.pop();
    const rh=H/MAX_WF;
    _wfBuf.forEach((r,ri)=>{for(let x=0;x<W;x+=2){const v=r[x];
      ctx.fillStyle='rgb('+(v>150?255:v*1.7)+','+(v>100?v:v*0.5)+','+(v<60?v*3:0)+')';
      ctx.fillRect(x,ri*rh,2,rh+1);}});
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText('RANGE-TIME WATERFALL',5,H-5);
  }

  /* ── Burn-Through Range Calculator ── */
  function drawBurnThrough(ctx,W,H){
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText('BURN-THROUGH ANALYSIS',5,12);
    const pwr=parseInt(_$('jamPower')?.value||50);
    const freq=parseFloat(_$('radarFreq')?.value||10);
    const radarPwr=80;
    const burnRange=Math.sqrt(radarPwr/(pwr*0.1+0.01))*20;
    const maxRange=parseInt(_$('radarRange')?.value||100);
    // Range bar
    ctx.fillStyle='rgba(0,200,255,0.15)';ctx.fillRect(10,30,W-20,20);
    const burnX=Math.min(1,burnRange/maxRange)*(W-20);
    ctx.fillStyle='rgba(255,50,50,0.3)';ctx.fillRect(10,30,burnX,20);
    ctx.fillStyle='rgba(0,255,70,0.3)';ctx.fillRect(10+burnX,30,W-20-burnX,20);
    ctx.strokeStyle='rgba(255,200,0,0.8)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(10+burnX,25);ctx.lineTo(10+burnX,55);ctx.stroke();
    ctx.fillStyle='rgba(255,200,0,0.7)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText('BURN-THROUGH: '+burnRange.toFixed(1)+' km',10+burnX,22);
    ctx.fillStyle='rgba(255,80,80,0.6)';ctx.textAlign='left';ctx.fillText('JAMMED ZONE',15,44);
    ctx.fillStyle='rgba(0,200,100,0.6)';ctx.textAlign='right';ctx.fillText('DETECTION ZONE',W-15,44);
    // J/S ratio indicator
    const jsRatio=pwr-radarPwr+20*Math.log10(50/(burnRange||1));
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText('J/S Ratio: '+(jsRatio>0?'+':'')+jsRatio.toFixed(1)+' dB',10,70);
    ctx.fillText('Radar Power: '+radarPwr+' dBm | Jammer: '+pwr+' dBm',10,82);
    ctx.fillText('Frequency: '+freq+' GHz',10,94);
    // Effectiveness gauge
    const eff=Math.min(100,Math.max(0,pwr*1.2-20));
    const gaugeW=W-20;
    ctx.fillStyle='rgba(50,50,50,0.5)';ctx.fillRect(10,105,gaugeW,12);
    const gColor=eff>70?'rgba(0,200,100,0.7)':eff>40?'rgba(255,200,0,0.7)':'rgba(255,50,50,0.7)';
    ctx.fillStyle=gColor;ctx.fillRect(10,105,gaugeW*eff/100,12);
    ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText('ECM EFFECTIVENESS: '+eff.toFixed(0)+'%',W/2,115);
  }

  function enhancedRender(){
    _t+=0.016;
    for(let i=_particles.length-1;i>=0;i--)if(!_particles[i].update())_particles.splice(i,1);
    const rc=_$('radarCanvas');
    if(rc){const ctx=rc.getContext('2d');const W=rc.width,H=rc.height;
      const cx=W/2,cy=H/2,R=Math.min(W,H)/2-20;
      drawDRFM(ctx,W,H,cx,cy,R);
      if(typeof jamming!=='undefined'&&jamming){
        for(let i=0;i<3;i++){const a=Math.random()*Math.PI*2;_particles.push(new JamParticle(cx,cy,a));}
        _particles.forEach(p=>p.draw(ctx));
      }
    }
    const sc=_$('spectrumCanvas');
    if(sc){const ctx=sc.getContext('2d');const W=sc.width,H=sc.height;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
      drawAScope(ctx,W,H*0.5);
      ctx.save();ctx.translate(0,H*0.5);drawDoppler(ctx,W,H*0.5);ctx.restore();
    }
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
