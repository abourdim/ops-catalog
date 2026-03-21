/**
 * Workshop DIY — Meaconing Attack v1.2
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);}}

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
    ...LANG_BASE.en,title:'Meaconing Attack',subtitle:'Meaconing Attack Sim',disconnected:'Idle',connected:'Meaconing',mainSection:'Meaconing Attack Simulator',mainDesc:'Capture, delay, and rebroadcast navigation signals',sectionA:'Captured Signals',sectionB:'Meaconing Theory',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'The main display shows the Meaconing Attack simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Scan the electromagnetic spectrum to identify hostile RF emi',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Captured Signals" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',working:'Working...',ready:'Meaconing Sim ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startMeacon:'Start Meaconing',stopMeacon:'Stop Meaconing',captureSignals:'Capture Signals',resetSim:'Reset',captureParams:'Capture Settings',delayParams:'Delay Settings',captureGain:'Capture Gain (dB):',rebroadcastPower:'Rebroadcast (dBm):',propDelay:'Propagation Delay (us):',numSignals:'Signals Captured:',meaconStatus:'Meaconing Status',signalHint:'Captured navigation signals being rebroadcast.',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What is Meaconing Attack?',faq_a1:'Meaconing Attack is an interactive simulation that demonstrates RF warfare concepts. Capture, delay, and rebroadcast navigation signals. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real electronic warfare behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real electronic warfare principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Rfw Anti Drone System and Rfw Cognitive Ew. Each app in this category teaches a different aspect of electronic warfare.',demo_s1:'Welcome to Meaconing Attack! Look at the main display — this is where the electronic warfare simulation runs.',demo_s2:'Set capture gain and rebroadcast power. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Captured Signals" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of electronic warfare.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'SIGINT',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Meaconing Attack! This is like a science experiment on your computer. You get to control a real RF warfare simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Scan the electromagnetic spectrum to identify host Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches electronic warfare concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',wiki_concept_title:'🔬 What is Meaconing Attack?',wiki_concept:'Meaconing Attack is a technique used in electronic warfare. Capture, delay, and rebroadcast navigation signals. In professional settings, this technology requires HackRF and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Scan the electromagnetic spectrum to identify hostile RF emissions. Second: Analyze the threat signal: frequency, power, modulation, and direction. The simulation runs these stages in real time, showing you intermediate results at each step. In real electronic warfare, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Meaconing Attack has practical applications in electronic warfare. Professionals use similar techniques with HackRF in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Meaconing Attack: Capture, delay, and rebroadcast navigation signals. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Detect RF Threat through Characterize Signal to Deploy Countermeasure and Assess Effectiveness.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Captured Signals" and "Meaconing Theory" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Exploit Development',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. Meaconing Attack builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Rfw Meaconing Attack',
    wiki_math: 'The mathematics behind Meaconing Attack: Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Jam-to-Signal ratio J/S = (Pj·Gj·Rr²)/(Pr·Gr·Rj²). Effective jamming requires J/S > 0 dB at the receiver. Spread spectrum resists jamming by spreading energy.',
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
    gloss3_term: 'Spread Spectrum',
    gloss3_def: 'A technique spreading signal energy across a wide bandwidth. Makes signals harder to jam (requires more power) and detect (signal is below noise floor).',
    gloss4_term: 'Capture Effect',
    gloss4_def: 'When a stronger signal overrides a weaker one at the receiver. Spoofers exploit this by transmitting a slightly stronger fake signal that the receiver locks onto.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Meaconing Attack demonstrates key principles from RF warfare. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. RF jamming overwhelms a target signal with noise or interference. Types include barrage (wideband), spot (narrowband), sweep, and deceptive jamming. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world exploit development?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional exploit development systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
  fr:{title:'Attaque Meaconing',subtitle:'Sim Attaque Meaconing',disconnected:'Inactif',connected:'Meaconing',mainSection:'Simulateur Attaque Meaconing',mainDesc:'Capturer, retarder et retransmettre les signaux de navigation',sectionA:'Signaux Captures',sectionB:'Theorie Meaconing',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'L écran principal affiche la simulation Meaconing Attack. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Scan the electromagnetic spectrum to identify hostile RF emi',howto_2:'Configurer le delai.',howto_3:'Capturer les signaux.',howto_4:'Demarrer le meaconing.',working:'En cours...',ready:'Sim pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startMeacon:'Demarrer Meaconing',stopMeacon:'Arreter Meaconing',captureSignals:'Capturer Signaux',resetSim:'Reinitialiser',captureParams:'Parametres Capture',delayParams:'Parametres Delai',captureGain:'Gain Capture (dB):',rebroadcastPower:'Retransmission (dBm):',propDelay:'Delai (us):',numSignals:'Signaux Captures:',meaconStatus:'Statut Meaconing',signalHint:'Signaux captures et retransmis.',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Meaconing Attack est une simulation interactive qui démontre les concepts de guerre RF. Capture, delay, and rebroadcast navigation signals. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais electronic warfare signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai electromagnetic combat techniques ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Rfw Gps Spoofing Sim and Rfw Comms Interception Hub ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 Histoire de développement exploits',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. Meaconing Attack s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Rfw Meaconing Attack',
    wiki_math: 'Les mathématiques derrière Meaconing Attack : Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Jam-to-Signal ratio J/S = (Pj·Gj·Rr²)/(Pr·Gr·Rj²). Effective jamming requires J/S > 0 dB at the receiver. Spread spectrum resists jamming by spreading energy.',
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
    gloss3_term: 'Spread Spectrum',
    gloss3_def: 'A technique spreading signal energy across a wide bandwidth. Makes signals harder to jam (requires more power) and detect (signal is below noise floor).',
    gloss4_term: 'Capture Effect',
    gloss4_def: 'When a stronger signal overrides a weaker one at the receiver. Spoofers exploit this by transmitting a slightly stronger fake signal that the receiver locks onto.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Meaconing Attack démontre les principes clés de guerre RF. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. RF jamming overwhelms a target signal with noise or interference. Types include barrage (wideband), spot (narrowband), sweep, and deceptive jamming. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec exploit development dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
  ar:{title:'\u0647\u062c\u0648\u0645 \u0627\u0644\u0645\u064a\u0643\u0648\u0646\u064a\u0646\u062c',subtitle:'\u0645\u062d\u0627\u0643\u064a \u0647\u062c\u0648\u0645 \u0627\u0644\u0645\u064a\u0643\u0648\u0646\u064a\u0646\u062c',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u0645\u064a\u0643\u0648\u0646\u064a\u0646\u062c',mainSection:'\u0645\u062d\u0627\u0643\u064a \u0647\u062c\u0648\u0645 \u0627\u0644\u0645\u064a\u0643\u0648\u0646\u064a\u0646\u062c',mainDesc:'\u0627\u0644\u062a\u0642\u0627\u0637 \u0648\u062a\u0623\u062e\u064a\u0631 \u0648\u0625\u0639\u0627\u062f\u0629 \u0628\u062b \u0625\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u0645\u0644\u0627\u062d\u0629',sectionA:'\u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u0645\u0644\u062a\u0642\u0637\u0629',sectionB:'\u0646\u0638\u0631\u064a\u0629 \u0627\u0644\u0645\u064a\u0643\u0648\u0646\u064a\u0646\u062c',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0627\u0644\u0645\u062d\u0627\u0643\u064a \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startMeacon:'\u0628\u062f\u0621 \u0627\u0644\u0645\u064a\u0643\u0648\u0646\u064a\u0646\u062c',stopMeacon:'\u0625\u064a\u0642\u0627\u0641',captureSignals:'\u0627\u0644\u062a\u0642\u0627\u0637 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Meaconing Attack هي محاكاة تفاعلية توضح مفاهيم الحرب الإلكترونية. Capture, delay, and rebroadcast navigation signals. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج electronic warfare signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا electromagnetic combat techniques حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Rfw Gps Spoofing Sim and Rfw Comms Interception Hub! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 تاريخ تطوير الثغرات',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. يبني Meaconing Attack على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Rfw Meaconing Attack',
    wiki_math: 'الرياضيات وراء Meaconing Attack: Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Jam-to-Signal ratio J/S = (Pj·Gj·Rr²)/(Pr·Gr·Rj²). Effective jamming requires J/S > 0 dB at the receiver. Spread spectrum resists jamming by spreading energy.',
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
    gloss3_term: 'Spread Spectrum',
    gloss3_def: 'A technique spreading signal energy across a wide bandwidth. Makes signals harder to jam (requires more power) and detect (signal is below noise floor).',
    gloss4_term: 'Capture Effect',
    gloss4_def: 'When a stronger signal overrides a weaker one at the receiver. Spoofers exploit this by transmitting a slightly stronger fake signal that the receiver locks onto.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Meaconing Attack يوضح المبادئ الأساسية في الحرب الإلكترونية. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. RF jamming overwhelms a target signal with noise or interference. Types include barrage (wideband), spot (narrowband), sweep, and deceptive jamming. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـexploit development في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='meacon-log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function initPanels(){const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');if(langSel)langSel.onchange=()=>setLanguage(langSel.value);if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});}

/* ═══════ MEACONING DATA ═══════ */
let meaconing=false,captured=false,time=0;
let signals=[];let delayHistory=new Array(200).fill(0);

function initSignals(){signals=[];for(let i=0;i<12;i++){signals.push({id:'NAV-'+(i+1),freq:1575.42+Math.random()*10-5,power:-130+Math.random()*20,captured:false,delayed:0,phase:Math.random()*Math.PI*2,orbitAngle:Math.random()*360,elevation:20+Math.random()*60});}}

function drawMeacon(){
  const c=$('meaconCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const cx=W/2,cy=H/2,R=Math.min(W,H)/2-40;
  // Sky grid
  for(let i=1;i<=3;i++){ctx.beginPath();ctx.arc(cx,cy,R*i/3,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.12)';ctx.lineWidth=1;ctx.stroke();}
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.stroke();

  const sigCount=parseInt($('sigCountInput')?.value||6);
  const delay=parseInt($('delayInput')?.value||200);
  const rebroadcast=parseInt($('rebroadcastInput')?.value||5);

  // Satellites
  signals.forEach((sig,i)=>{
    sig.orbitAngle+=0.15;if(sig.orbitAngle>360)sig.orbitAngle-=360;
    const az=sig.orbitAngle*Math.PI/180;const elR=(90-sig.elevation)/90;
    const sx=cx+Math.sin(az)*elR*R;const sy=cy-Math.cos(az)*elR*R;
    const isCaptured=captured&&i<sigCount;sig.captured=isCaptured;

    // Signal line from sat to receiver
    if(isCaptured){
      ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(cx,cy);
      ctx.strokeStyle='rgba(0,200,255,0.3)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    }

    ctx.beginPath();ctx.arc(sx,sy,isCaptured?6:4,0,Math.PI*2);
    ctx.fillStyle=isCaptured?'rgba(0,200,255,0.9)':'rgba(100,100,100,0.5)';ctx.fill();
    ctx.fillStyle=isCaptured?'#66ccff':'#666';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(sig.id,sx,sy-10);
  });

  // Meaconing station (center)
  ctx.beginPath();ctx.arc(cx,cy,12,0,Math.PI*2);
  ctx.fillStyle=meaconing?'rgba(255,50,50,0.9)':captured?'rgba(255,200,0,0.8)':'rgba(0,255,136,0.6)';ctx.fill();
  ctx.fillStyle='#fff';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('MEACON',cx,cy+22);

  // Rebroadcast waves
  if(meaconing){
    for(let r=1;r<=4;r++){
      const rad=30+r*25+Math.sin(time*3)*5;
      ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,50,50,'+(0.4-r*0.08)+')';ctx.lineWidth=2;ctx.stroke();
    }
    // Victim receiver
    const vx=cx+180,vy=cy+80;
    ctx.beginPath();ctx.arc(vx,vy,8,0,Math.PI*2);ctx.fillStyle='rgba(255,200,0,0.8)';ctx.fill();
    ctx.fillStyle='#ffcc00';ctx.font='9px Orbitron,monospace';ctx.fillText('VICTIM',vx,vy-12);
    // Delayed signal line
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(vx,vy);ctx.strokeStyle='rgba(255,50,50,0.5)';ctx.lineWidth=2;ctx.setLineDash([6,3]);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(255,100,100,0.6)';ctx.font='8px Orbitron,monospace';ctx.fillText('+'+delay+'us delay',cx+90,cy+30);
  }

  ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('MEACONING — SIGNAL RELAY VIEW',10,18);
  if(meaconing){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('REBROADCASTING — '+rebroadcast+' dBm',10,34);}
}

function drawDelay(){
  const c=$('delayCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const delay=parseInt($('delayInput')?.value||200);
  const newVal=meaconing?delay+Math.random()*50-25:Math.random()*10;
  delayHistory.push(newVal);if(delayHistory.length>200)delayHistory.shift();
  ctx.beginPath();delayHistory.forEach((v,i)=>{const x=i*(W/200);const y=H-10-v/1200*H*0.8;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=meaconing?'rgba(255,100,100,0.8)':'rgba(0,200,255,0.5)';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('SIGNAL DELAY (microseconds)',5,14);
}

function animate(){time+=0.016;drawMeacon();drawDelay();updateStats();requestAnimationFrame(animate);}

function updateStats(){const stats=$('meaconStats');if(!stats)return;const capturedCount=signals.filter(s=>s.captured).length;stats.innerHTML='<b>Captured:</b> '+capturedCount+' signals<br><b>Delay:</b> '+$('delayInput')?.value+' us<br><b>Rebroadcast:</b> '+$('rebroadcastInput')?.value+' dBm<br><b>Status:</b> '+(meaconing?'<span style="color:#ff4444">MEACONING</span>':captured?'<span style="color:#ffcc00">CAPTURED</span>':'<span style="color:#00cc88">STANDBY</span>');}

function updateSignalList(){const lib=$('signalList');if(!lib)return;lib.innerHTML='';signals.forEach(s=>{const row=document.createElement('div');row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+(s.captured?'rgba(0,200,255,0.08)':'rgba(100,100,100,0.05)');row.innerHTML='<span style="color:'+(s.captured?'#66ccff':'#666')+'">'+s.id+'</span><span>'+s.freq.toFixed(2)+' MHz</span><span>'+s.power.toFixed(0)+' dBm</span><span style="color:'+(s.captured?'#00cc88':'#666')+'">'+(s.captured?'CAPTURED':'---')+'</span>';lib.appendChild(row);});}

function initTechDatabase(){const db=$('techDatabase');if(!db)return;db.innerHTML=['<b>Meaconing:</b> Interception and rebroadcast of navigation signals with added delay.','<b>Delay Injection:</b> Adding propagation delay causes position errors in receivers.','<b>High-Gain Capture:</b> Directional antennas capture weak satellite signals.','<b>Amplified Rebroadcast:</b> Signals rebroadcast at higher power than originals.','<b>Position Drift:</b> Gradually increasing delay causes slow position drift.','<b>Multi-Signal Attack:</b> Capturing multiple satellites enables full position control.'].join('<br><br>');}

function initControls(){
  $('gainInput').oninput=()=>{$('gainLabel').textContent=$('gainInput').value+' dB';};
  $('rebroadcastInput').oninput=()=>{$('rebroadcastLabel').textContent=$('rebroadcastInput').value+' dBm';};
  $('delayInput').oninput=()=>{$('delayLabel').textContent=$('delayInput').value+' us';};
  $('sigCountInput').oninput=()=>{$('sigCountLabel').textContent=$('sigCountInput').value;};
  $('meaconBtn').onclick=()=>{if(!captured){showToast('Capture signals first!',1500);return;}meaconing=!meaconing;setStatus(meaconing);$('meaconBtn').querySelector('[data-i18n]').textContent=meaconing?LANG[currentLang].stopMeacon:LANG[currentLang].startMeacon;log(meaconing?'MEACONING STARTED — rebroadcasting with '+$('delayInput').value+'us delay':'MEACONING STOPPED',meaconing?'error':'info');if(meaconing)showToast('Meaconing active...',2000);};
  $('captureBtn').onclick=()=>{captured=true;const n=parseInt($('sigCountInput').value);signals.forEach((s,i)=>s.captured=i<n);log('Captured '+n+' navigation signals','rx');playSound('success');};
  $('resetBtn').onclick=()=>{meaconing=false;captured=false;setStatus(false);initSignals();delayHistory=new Array(200).fill(0);$('meaconBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].startMeacon;log('Reset','info');playSound('click');};
}

document.addEventListener('DOMContentLoaded',()=>{
  initSplash();initPanels();initLogFilters();initSignals();initTechDatabase();initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');animate();setInterval(updateSignalList,1000);
});

/* ═══════ ENHANCED RF CANVAS — MEACONING ATTACK ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _posErrorTrail=[];let _delayCorrelation=new Array(200).fill(0);
let _signalCompare=[];let _driftHistory=new Array(200).fill(0);

/* ── Position Drift Trail Map ── */
function drawPositionDrift(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('VICTIM POSITION DRIFT MAP',5,12);
  const cx=W/2,cy=H/2;const R=Math.min(W,H)/2-25;
  for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(cx,cy,R*i/4,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.lineWidth=1;ctx.stroke();}
  const isMeacon=typeof meaconing!=='undefined'&&meaconing;
  const delay=parseInt(_$('delayInput')?.value||200);
  // True position
  ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.8)';ctx.fill();
  ctx.fillStyle='rgba(0,200,255,0.5)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('TRUE POS',cx,cy+15);
  if(isMeacon){
    const drift=delay*0.3;const driftAngle=_t*0.2;
    const dx=Math.cos(driftAngle)*drift*0.3;const dy=Math.sin(driftAngle)*drift*0.2;
    _posErrorTrail.push({x:cx+dx+Math.random()*5,y:cy+dy+Math.random()*5});
    if(_posErrorTrail.length>100)_posErrorTrail.shift();
    // Trail
    _posErrorTrail.forEach((p,i)=>{
      const alpha=i/_posErrorTrail.length;
      ctx.beginPath();ctx.arc(p.x,p.y,2,0,Math.PI*2);
      ctx.fillStyle='rgba(255,80,80,'+alpha*0.6+')';ctx.fill();
    });
    // Current spoofed position
    const last=_posErrorTrail[_posErrorTrail.length-1];
    if(last){ctx.beginPath();ctx.arc(last.x,last.y,8,0,Math.PI*2);
      ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fill();
      ctx.beginPath();ctx.arc(last.x,last.y,14+Math.sin(_t*4)*4,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,50,50,0.4)';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle='rgba(255,50,50,0.6)';ctx.font='8px Orbitron,monospace';ctx.fillText('SPOOFED',last.x,last.y-14);
      // Error line
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(last.x,last.y);
      ctx.strokeStyle='rgba(255,200,0,0.5)';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
      const errM=(Math.sqrt((last.x-cx)**2+(last.y-cy)**2)*2).toFixed(0);
      ctx.fillStyle='rgba(255,200,0,0.6)';ctx.fillText(errM+'m error',(cx+last.x)/2,(cy+last.y)/2-8);
    }
    // Scale labels
    [50,100,200].forEach(m=>{const pr=m/(delay*0.6)*R;
      ctx.fillStyle='rgba(255,255,255,0.15)';ctx.font='7px Orbitron,monospace';ctx.fillText(m+'m',cx+pr+3,cy);});
  }
}

/* ── Signal Delay Correlation ── */
function drawDelayCorrelation(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('CROSS-CORRELATION — ORIGINAL vs MEACONED',5,12);
  const isMeacon=typeof meaconing!=='undefined'&&meaconing;
  const delay=parseInt(_$('delayInput')?.value||200);
  // Generate correlation function
  ctx.beginPath();
  for(let x=0;x<W;x++){
    const tau=(x/W-0.5)*1000;// -500 to +500 us
    let corr=Math.exp(-tau*tau/2000);// Original peak at 0
    if(isMeacon)corr+=0.7*Math.exp(-(tau-delay)*(tau-delay)/3000);// Meaconed peak at delay
    const y=H-10-(corr)*(H-30);
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle='rgba(0,200,255,0.7)';ctx.lineWidth=1.5;ctx.stroke();
  // Zero line
  ctx.beginPath();ctx.moveTo(0,H-10);ctx.lineTo(W,H-10);ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;ctx.stroke();
  // Markers
  ctx.beginPath();ctx.moveTo(W/2,20);ctx.lineTo(W/2,H-10);ctx.strokeStyle='rgba(0,255,136,0.3)';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('τ=0',W/2,H-1);
  if(isMeacon){const delayX=W/2+(delay/1000)*W;
    ctx.beginPath();ctx.moveTo(delayX,20);ctx.lineTo(delayX,H-10);ctx.strokeStyle='rgba(255,50,50,0.5)';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(255,50,50,0.5)';ctx.fillText('τ='+delay+'μs',delayX,H-1);}
}

/* ── Navigation Accuracy Degradation ── */
function drawAccuracyDegradation(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('NAVIGATION ACCURACY DEGRADATION',5,12);
  const isMeacon=typeof meaconing!=='undefined'&&meaconing;
  const delay=parseInt(_$('delayInput')?.value||200);
  const drift=isMeacon?Math.min(500,delay*0.8+_t*2+Math.random()*10):Math.random()*3;
  _driftHistory.push(drift);if(_driftHistory.length>200)_driftHistory.shift();
  // Background zones
  ctx.fillStyle='rgba(255,50,50,0.04)';ctx.fillRect(0,20,W,(H-30)*0.3);
  ctx.fillStyle='rgba(255,200,0,0.04)';ctx.fillRect(0,20+(H-30)*0.3,W,(H-30)*0.35);
  ctx.fillStyle='rgba(0,200,100,0.04)';ctx.fillRect(0,20+(H-30)*0.65,W,(H-30)*0.35);
  ctx.beginPath();
  _driftHistory.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/500)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=drift>200?'rgba(255,50,50,0.8)':drift>50?'rgba(255,200,0,0.7)':'rgba(0,200,100,0.6)';
  ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle=drift>200?'rgba(255,50,50,0.7)':'rgba(255,200,0,0.7)';ctx.font='12px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText(drift.toFixed(0)+'m',W-10,30);
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('0m',3,H-8);ctx.fillText('500m',3,23);
}

/* ── Signal Capture Chain Diagram ── */
function drawCaptureChain(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('MEACONING SIGNAL CHAIN',5,12);
  const stages=['SAT Signal','High-Gain\nCapture','Amplify','Delay\nInjection','Rebroadcast','Victim\nReceiver'];
  const isMeacon=typeof meaconing!=='undefined'&&meaconing;
  const isCap=typeof captured!=='undefined'&&captured;
  const stageW=Math.min(80,(W-20)/stages.length-10);
  stages.forEach((s,i)=>{
    const x=10+i*(stageW+10);const y=H/2-15;
    const isActive=(isCap&&i<=2)||(isMeacon&&i<=5);
    ctx.fillStyle=isActive?'rgba(0,200,255,0.15)':'rgba(50,50,50,0.2)';
    ctx.fillRect(x,y,stageW,30);ctx.strokeStyle=isActive?'rgba(0,200,255,0.5)':'rgba(100,100,100,0.3)';
    ctx.lineWidth=1;ctx.strokeRect(x,y,stageW,30);
    if(isActive&&isMeacon){ctx.fillStyle='rgba(0,200,255,0.1)';
      const pulse=Math.sin(_t*4+i)*3;ctx.fillRect(x-pulse,y-pulse,stageW+pulse*2,30+pulse*2);}
    ctx.fillStyle=isActive?'rgba(0,255,136,0.7)':'rgba(100,100,100,0.4)';
    ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
    const lines=s.split('\n');lines.forEach((l,li)=>ctx.fillText(l,x+stageW/2,y+12+li*9));
    if(i<stages.length-1){ctx.beginPath();ctx.moveTo(x+stageW+2,H/2);ctx.lineTo(x+stageW+8,H/2);
      ctx.strokeStyle=isActive?'rgba(0,200,255,0.5)':'rgba(100,100,100,0.2)';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.moveTo(x+stageW+6,H/2-3);ctx.lineTo(x+stageW+10,H/2);ctx.lineTo(x+stageW+6,H/2+3);
      ctx.fillStyle=isActive?'rgba(0,200,255,0.5)':'rgba(100,100,100,0.2)';ctx.fill();}
  });
}

function enhancedRender(){
  _t+=0.016;
  const mc=_$('meaconCanvas');
  if(mc){const ctx=mc.getContext('2d');drawPositionDrift(ctx,mc.width,mc.height);}
  const dc=_$('delayCanvas');
  if(dc){const ctx=dc.getContext('2d');const W=dc.width,H=dc.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawAccuracyDegradation(ctx,W,H);}
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
