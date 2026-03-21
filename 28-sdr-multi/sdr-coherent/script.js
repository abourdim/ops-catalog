/**
 * SDR Coherent Receiver — Workshop DIY v1.0
 * Phase-locked multi-SDR combining, beamforming, array processing
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="50" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="75" cy="50" r="8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="33" y1="50" x2="42" y2="50" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2"/><line x1="58" y1="50" x2="67" y2="50" stroke="currentColor" stroke-width="2" stroke-dasharray="3 2"/><path d="M25 30 L50 15 L75 30" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".5"><animate attributeName="opacity" values=".3;.8;.3" dur="2s" repeatCount="indefinite"/></path></svg>`;
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25);}}

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
    ...LANG_BASE.en,title:'SDR Coherent Receiver',subtitle:'🔗 Coherent Receiver — Phase-locked multi-SDR',disconnected:'Disconnected',connected:'Connected',mainSection:'Coherent Receiver',mainDesc:'Phase-locked combining and beamforming simulation',sectionA:'Array Performance',sectionB:'Phase Calibration',sectionC:'Coherent Array Theory',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
howto_1:'The main display shows the Coherent simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for SDR Coherent Receiver. Choose y',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Array Performance" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 مظاهر. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'ثلاثي اللغات مع RTL. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'🔗 Coherent Receiver ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
numElements:'SDR Elements',spacing:'Element Spacing (λ)',steerAngle:'Beam Steering (deg)',sigAngle:'Signal Angle (deg)',snrCtrl:'SNR (dB)',startSim:'▶ Start',stopSim:'⏹ Stop',
arrayGain:'Array Gain:',beamWidth:'Beam Width (-3dB):',sllLabel:'Sidelobe Level:',snrImprove:'SNR Improvement:',nullDepth:'First Null:',
calDesc:'Simulate phase errors and apply calibration.',
theoryIntro:'Coherent multi-SDR arrays combine signals for enhanced performance:',theory1:'Array gain = 10 log10(N) dB for N elements',theory2:'Beamforming focuses sensitivity directionally',theory3:'Phase-locked oscillators essential for coherence',theory4:'Element spacing affects grating lobes',theory5:'Calibration corrects phase/amplitude mismatches',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',simStarted:'▶ Array simulation running',simStopped:'⏹ Stopped',errorsAdded:'Phase errors added',calibDone:'Calibration applied',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Set Up',step1Desc:'Configure the parameters for SDR Coherent Receiver. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Array Performance" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Phase Calibration". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is SDR Coherent Receiver?',faq_a1:'Coherent is an interactive simulation that demonstrates SDR multi-channel concepts. Phase-locked combining and beamforming simulation. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real multi-receiver SDR behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real multi-receiver SDR principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF x2+. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Sdr Correlation and Sdr Doppler Tracker. Each app in this category teaches a different aspect of multi-receiver SDR.',demo_s1:'Welcome to SDR Coherent Receiver! Look at the main display — this is where the multi-receiver SDR simulation runs.',demo_s2:'Set number of elements and spacing. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Array Performance" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of multi-receiver SDR.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Analysis',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Coherent! This is like a science experiment on your computer. You get to control a real SDR multi-channel simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for SDR Coherent Receiver Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches multi-receiver SDR concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',purpose:'SDR Coherent Receiver: Phase-locked combining and beamforming simulation. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure SDR through Capture Signal to Process & Filter and Visualize Output.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Array Performance" and "Phase Calibration" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Sdr Techniques',
    wiki_history: 'Channel allocation evolved from manual planning in early radio to dynamic spectrum access in cognitive radio systems. Coherent builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Coherent',
    wiki_math: 'The mathematics behind Coherent: Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced SDR techniques practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to SDR techniques. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with SDR techniques: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in SDR techniques.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Sdr Techniques carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Channel Width',
    gloss1_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss2_term: 'Latency',
    gloss2_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss3_term: 'Throughput',
    gloss3_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss4_term: 'Protocol',
    gloss4_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss5_term: 'Amplitude',
    gloss5_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    gloss6_term: 'Decibel (dB)',
    gloss6_def: 'A logarithmic unit for expressing ratios. 3 dB = double power, 10 dB = 10× power, 20 dB = 100× power. Used throughout RF and audio engineering.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Coherent demonstrates key principles from SDR multi-channel. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world SDR techniques?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional SDR techniques systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
fr:{title:'Recepteur Coherent SDR',subtitle:'🔗 Recepteur Coherent — Multi-SDR verrouille en phase',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Recepteur Coherent',mainDesc:'Combinaison phase-verrouillee et formation de faisceau',sectionA:'Performance du Reseau',sectionB:'Calibration de Phase',sectionC:'Theorie des Reseaux Coherents',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
howto_1:'L écran principal affiche la simulation Coherent. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for SDR Coherent Receiver. Choose y',howto_2:'Ajustez les angles de pointage et de signal.',howto_3:'Cliquez Demarrer pour le diagramme.',howto_4:'Essayez les erreurs de phase et calibration.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',
working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',ready:'🔗 Recepteur Coherent pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
numElements:'Elements SDR',spacing:'Espacement (λ)',steerAngle:'Pointage (deg)',sigAngle:'Angle Signal (deg)',snrCtrl:'RSB (dB)',startSim:'▶ Demarrer',stopSim:'⏹ Arreter',
arrayGain:'Gain Reseau:',beamWidth:'Ouverture (-3dB):',sllLabel:'Lobes Secondaires:',snrImprove:'Amelioration RSB:',nullDepth:'Premier Nul:',
calDesc:'Simulez des erreurs de phase et calibrez.',
theoryIntro:'Les reseaux coherents multi-SDR combinent pour ameliorer:',theory1:'Gain = 10 log10(N) dB pour N elements',theory2:'Formation de faisceau oriente la sensibilite',theory3:'Oscillateurs verrouilles essentiels',theory4:'L\'espacement affecte les lobes de reseau',theory5:'La calibration corrige les desaccords',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',simStarted:'▶ Simulation en cours',simStopped:'⏹ Arrete',errorsAdded:'Erreurs ajoutees',calibDone:'Calibration appliquee',
t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Coherent est une simulation interactive qui démontre les concepts de SDR multi-canaux. Phase-locked combining and beamforming simulation. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai digital signal processing ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Sdr Farm and Sdr Doppler Tracker ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 Histoire de techniques SDR',
    wiki_history: 'Channel allocation evolved from manual planning in early radio to dynamic spectrum access in cognitive radio systems. Coherent s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Coherent',
    wiki_math: 'Les mathématiques derrière Coherent : Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de techniques SDR utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour techniques SDR. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en techniques SDR : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Techniques sdr implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Channel Width',
    gloss1_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss2_term: 'Latency',
    gloss2_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss3_term: 'Throughput',
    gloss3_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss4_term: 'Protocol',
    gloss4_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss5_term: 'Amplitude',
    gloss5_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    gloss6_term: 'Decibel (dB)',
    gloss6_def: 'A logarithmic unit for expressing ratios. 3 dB = double power, 10 dB = 10× power, 20 dB = 100× power. Used throughout RF and audio engineering.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Coherent démontre les principes clés de SDR multi-canaux. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec SDR techniques dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
ar:{title:'المستقبل المتماسك SDR',subtitle:'🔗 المستقبل المتماسك — متعدد SDR مقفل الطور',disconnected:'غير متصل',connected:'متصل',mainSection:'المستقبل المتماسك',mainDesc:'محاكاة الجمع المقفل الطور وتشكيل الحزمة',sectionA:'اداء المصفوفة',sectionB:'معايرة الطور',sectionC:'نظرية المصفوفات المتماسكة',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
howto_1:'تعرض الشاشة الرئيسية محاكاة Coherent. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for SDR Coherent Receiver. Choose y',howto_2:'اضبط زوايا التوجيه والاشارة.',howto_3:'اضغط ابدا لنمط الحزمة.',howto_4:'جرب اخطاء الطور والمعايرة.',
wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'🔗 المستقبل المتماسك جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',
numElements:'عناصر SDR',spacing:'التباعد (λ)',steerAngle:'زاوية التوجيه (درجة)',sigAngle:'زاوية الاشارة (درجة)',snrCtrl:'نسبة الاشارة للضوضاء (ديسيبل)',startSim:'▶ ابدا',stopSim:'⏹ ايقاف',
arrayGain:'كسب المصفوفة:',beamWidth:'عرض الحزمة:',sllLabel:'مستوى الفصوص الجانبية:',snrImprove:'تحسين SNR:',nullDepth:'العدم الاول:',
calDesc:'حاكِ اخطاء الطور وطبق المعايرة.',
theoryIntro:'مصفوفات SDR المتماسكة تجمع الاشارات لاداء محسن:',theory1:'الكسب = 10 log10(N) ديسيبل لـ N عنصر',theory2:'تشكيل الحزمة يركز الحساسية اتجاهيا',theory3:'المذبذبات المقفلة ضرورية للتماسك',theory4:'التباعد يؤثر على فصوص الشبكة',theory5:'المعايرة تصحح عدم تطابق الطور والسعة',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',simStarted:'▶ محاكاة المصفوفة تعمل',simStopped:'⏹ متوقف',errorsAdded:'تمت اضافة اخطاء الطور',calibDone:'تم تطبيق المعايرة',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Coherent هي محاكاة تفاعلية توضح مفاهيم SDR متعدد القنوات. Phase-locked combining and beamforming simulation. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا digital signal processing حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Sdr Farm and Sdr Doppler Tracker! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 تاريخ تقنيات SDR',
    wiki_history: 'Channel allocation evolved from manual planning in early radio to dynamic spectrum access in cognitive radio systems. يبني Coherent على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Coherent',
    wiki_math: 'الرياضيات وراء Coherent: Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو تقنيات SDR المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في تقنيات SDR. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في تقنيات SDR: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'تقنيات SDR يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Channel Width',
    gloss1_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss2_term: 'Latency',
    gloss2_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss3_term: 'Throughput',
    gloss3_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss4_term: 'Protocol',
    gloss4_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss5_term: 'Amplitude',
    gloss5_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    gloss6_term: 'Decibel (dB)',
    gloss6_def: 'A logarithmic unit for expressing ratios. 3 dB = double power, 10 dB = 10× power, 20 dB = 100× power. Used throughout RF and audio engineering.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Coherent يوضح المبادئ الأساسية في SDR متعدد القنوات. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـSDR techniques في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='coherent-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
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
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),conts=document.querySelectorAll('.help-content');tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));conts.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');}));}

/* ═══════ COHERENT ARRAY SIMULATION ═══════ */
let running=false,animFrame=null;
let phaseErrors=[];
let calibrated=false;

function computeBeamPattern(nElem,dLambda,steerDeg){
  const pts=360;const pattern=new Float32Array(pts);
  const steerRad=steerDeg*Math.PI/180;
  for(let a=0;a<pts;a++){
    const theta=(a-180)*Math.PI/180;
    let re=0,im=0;
    for(let n=0;n<nElem;n++){
      const psi=2*Math.PI*dLambda*n*(Math.sin(theta)-Math.sin(steerRad));
      const errPh=calibrated?0:(phaseErrors[n]||0);
      re+=Math.cos(psi+errPh);
      im+=Math.sin(psi+errPh);
    }
    pattern[a]=Math.sqrt(re*re+im*im)/nElem;
  }
  return pattern;
}

function drawArray(nElem,dLambda,steerDeg,sigDeg){
  const c=$('arrayCanvas');if(!c)return;const ctx=c.getContext('2d'),s=c.width,cx=s/2,cy=s/2;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,s,s);
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Draw elements
  const spacing=Math.min(30,s/(nElem+2));
  const startX=cx-(nElem-1)*spacing/2;
  for(let i=0;i<nElem;i++){
    const ex=startX+i*spacing,ey=cy+40;
    ctx.fillStyle=accent;ctx.beginPath();ctx.arc(ex,ey,6,0,2*Math.PI);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='8px monospace';ctx.fillText('SDR'+(i+1),ex-10,ey+16);
    // Phase error indicator
    const err=phaseErrors[i]||0;
    if(Math.abs(err)>.01&&!calibrated){
      ctx.fillStyle='#f44';ctx.font='8px monospace';ctx.fillText((err*180/Math.PI).toFixed(0)+'°',ex-6,ey-10);
    }
  }
  // Draw beam direction
  const beamRad=steerDeg*Math.PI/180;
  const bx=cx+Math.sin(beamRad)*100,by=cy-Math.cos(beamRad)*100;
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.setLineDash([6,4]);
  ctx.beginPath();ctx.moveTo(cx,cy+40);ctx.lineTo(bx,by);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle=accent;ctx.font='10px Orbitron';ctx.fillText('Beam: '+steerDeg+'°',bx-20,by-8);
  // Draw signal direction
  const sigRad=sigDeg*Math.PI/180;
  const sx2=cx+Math.sin(sigRad)*120,sy2=cy-Math.cos(sigRad)*120;
  ctx.strokeStyle='#4af';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(sx2,sy2);ctx.lineTo(cx,cy+40);ctx.stroke();
  ctx.fillStyle='#4af';ctx.font='10px monospace';ctx.fillText('Signal: '+sigDeg+'°',sx2-20,sy2-8);
  // Wavefronts
  for(let r=20;r<130;r+=25){
    ctx.strokeStyle='#4af';ctx.globalAlpha=.2;ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(sx2,sy2,r,0,2*Math.PI);ctx.stroke();
  }
  ctx.globalAlpha=1;
}

function drawBeam(pattern){
  const c=$('beamCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;
  for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(0,i/4*h);ctx.lineTo(w,i/4*h);ctx.stroke();}
  // 0 line
  ctx.beginPath();ctx.moveTo(w/2,0);ctx.lineTo(w/2,h);ctx.stroke();
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
  const maxP=Math.max(...pattern)||1;
  for(let i=0;i<pattern.length;i++){
    const x=i/pattern.length*w;
    const db=20*Math.log10(pattern[i]/maxP+1e-10);
    const y=h-((db+40)/40)*h;
    if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));
  }
  ctx.stroke();
  ctx.fillStyle='#667';ctx.font='10px Orbitron,monospace';
  ctx.fillText('Beam Pattern (dB)',4,12);ctx.fillText('-90°',4,h-4);ctx.fillText('0°',w/2-8,h-4);ctx.fillText('+90°',w-30,h-4);
}

function drawCombinedSpec(nElem,sigDeg,steerDeg,snrDb){
  const c=$('specCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Simulated spectrum with signal + noise
  const N=256;
  const sigBin=Math.floor(N*.35);
  const angDiff=Math.abs(sigDeg-steerDeg);
  const arrayResponse=Math.max(.01,Math.cos(angDiff*Math.PI/180));
  const effectiveGain=10*Math.log10(nElem)*arrayResponse;
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<N;i++){
    const noise=(Math.random()-.5)*.3;
    let sig=0;if(Math.abs(i-sigBin)<5)sig=.8*arrayResponse*Math.exp(-(i-sigBin)*(i-sigBin)/4);
    const val=sig+noise*.5;
    const x=i/N*w,db=20*Math.log10(Math.abs(val)+.001);
    const y=h/2-db*h*.05;
    if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));
  }
  ctx.stroke();
  ctx.fillStyle='#667';ctx.font='10px Orbitron,monospace';ctx.fillText('Combined Spectrum ('+nElem+' elements)',4,12);
}

function updatePerf(pattern,nElem){
  const maxP=Math.max(...pattern)||1;
  $('gainVal').textContent=(10*Math.log10(nElem)).toFixed(1)+' dB';
  // Beam width
  const peakIdx=pattern.indexOf(Math.max(...pattern));
  const th3=maxP*.707;let lo=peakIdx,hi=peakIdx;
  for(let i=peakIdx;i>=0;i--)if(pattern[i]<th3){lo=i;break;}
  for(let i=peakIdx;i<pattern.length;i++)if(pattern[i]<th3){hi=i;break;}
  $('bwVal2').textContent=((hi-lo)).toFixed(0)+'°';
  // SLL
  let sll=0;
  for(let i=0;i<pattern.length;i++){
    if(Math.abs(i-peakIdx)>20){sll=Math.max(sll,pattern[i]);}
  }
  $('sllVal').textContent=(20*Math.log10(sll/maxP+1e-10)).toFixed(1)+' dB';
  $('snrImpVal').textContent=(10*Math.log10(nElem)).toFixed(1)+' dB';
  // First null
  let nullDepth=1;
  for(let i=peakIdx+5;i<Math.min(peakIdx+60,pattern.length);i++){
    if(pattern[i]<nullDepth)nullDepth=pattern[i];
  }
  $('nullVal').textContent=(20*Math.log10(nullDepth/maxP+1e-10)).toFixed(1)+' dB';
}

function addPhaseErrors(){
  const n=+$('elemSlider').value;
  phaseErrors=[];calibrated=false;
  for(let i=0;i<n;i++)phaseErrors.push((Math.random()-.5)*Math.PI*.5);
  const el=$('phaseStatus');if(el)el.textContent='Errors: '+phaseErrors.map(e=>(e*180/Math.PI).toFixed(1)+'°').join(', ');
  log(LANG[currentLang].errorsAdded,'info');
}
function calibrate(){
  calibrated=true;
  const el=$('phaseStatus');if(el)el.textContent='Calibrated — all errors compensated.';
  log(LANG[currentLang].calibDone,'success');
}

function simLoop(){
  if(!running)return;
  const nElem=+$('elemSlider').value,dLambda=+$('spaceSlider').value/100;
  const steerDeg=+$('steerSlider').value,sigDeg=+$('sigSlider').value,snrDb=+$('snrSlider').value;
  while(phaseErrors.length<nElem)phaseErrors.push(0);
  const pattern=computeBeamPattern(nElem,dLambda,steerDeg);
  drawArray(nElem,dLambda,steerDeg,sigDeg);
  drawBeam(pattern);
  drawCombinedSpec(nElem,sigDeg,steerDeg,snrDb);
  updatePerf(pattern,nElem);
  animFrame=requestAnimationFrame(simLoop);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');simLoop();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hC=$('helpCloseBtn'),hO=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hC)hC.onclick=closeHelp;if(hO)hO.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sC=$('settingsCloseBtn'),sO=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sC)sC.onclick=closeSettings;if(sO)sO.onclick=closeSettings;
  const lBtn=$('logBtn'),lC=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lC)lC.onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const ls=$('langSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));
  const ts=$('themeSelect');if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initHijriDate();
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  $('addErrorBtn').onclick=addPhaseErrors;$('calibBtn').onclick=calibrate;
  $('elemSlider').oninput=function(){$('elemVal').textContent=this.value;};
  $('spaceSlider').oninput=function(){$('spaceVal').textContent=(this.value/100).toFixed(2)+' λ';};
  $('steerSlider').oninput=function(){$('steerVal').textContent=this.value+'°';};
  $('sigSlider').oninput=function(){$('sigVal').textContent=this.value+'°';};
  $('snrSlider').oninput=function(){$('snrVal2').textContent=this.value+' dB';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — SDR Coherent
   Animated phased array beam pattern + array factor visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
function boot(){
  let el=document.getElementById('cohSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='cohSimCanvas';el.width=780;el.height=220;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#040810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.015;cx.fillStyle='#040810';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Array elements at bottom
  const nElem=typeof document.getElementById('elemSlider')!=='undefined'&&document.getElementById('elemSlider')?+document.getElementById('elemSlider').value:8;
  const spacing=Math.min(50,W/(nElem+2));
  const arrayX=W/2-nElem*spacing/2;
  for(let i=0;i<nElem;i++){
    const ex=arrayX+i*spacing+spacing/2,ey=H-25;
    cx.fillStyle='rgba(79,195,247,.6)';cx.beginPath();cx.moveTo(ex,ey-10);cx.lineTo(ex-4,ey);cx.lineTo(ex+4,ey);cx.closePath();cx.fill();
    cx.fillRect(ex-.5,ey,1,8);
  }
  // Beam pattern (polar)
  const bcx=W/2,bcy=H-30,br=H*.6;
  const steer=(typeof document.getElementById('steerSlider')!=='undefined'&&document.getElementById('steerSlider')?+document.getElementById('steerSlider').value:0)*Math.PI/180;
  cx.strokeStyle='rgba(100,200,255,.06)';cx.lineWidth=.5;
  for(let r=20;r<=br;r+=20){cx.beginPath();cx.arc(bcx,bcy,r,-Math.PI,0);cx.stroke();}
  // Array factor
  cx.strokeStyle=acc;cx.lineWidth=2;cx.beginPath();
  for(let a=-180;a<=0;a++){
    const theta=a*Math.PI/180;
    const d=.5;let af2=0;
    for(let n=0;n<nElem;n++)af2+=Math.cos(n*2*Math.PI*d*(Math.sin(theta)-Math.sin(steer)));
    const mag=Math.abs(af2)/nElem;
    const r2=mag*br;
    const px=bcx+Math.cos(theta)*r2,py=bcy+Math.sin(theta)*r2;
    if(a===-180)cx.moveTo(px,py);else cx.lineTo(px,py);
  }
  cx.stroke();
  // Animated wavefront
  const wfAngle=steer;
  for(let w=0;w<5;w++){
    const wr=((t*100+w*40)%200);
    cx.strokeStyle=`rgba(79,195,247,${.15-w*.03})`;cx.lineWidth=1;
    cx.beginPath();const px=bcx+Math.cos(Math.PI/2+wfAngle)*wr;const py=bcy+Math.sin(Math.PI/2+wfAngle)*wr;
    cx.arc(px,py-br*.3,wr*1.5,-Math.PI*.3,Math.PI*.3);cx.stroke();
  }
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText(`Phased Array Beam — ${nElem} elements`,8,14);
  cx.textAlign='right';cx.fillText(`Steer: ${(steer*180/Math.PI).toFixed(0)} deg`,W-8,14);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
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
