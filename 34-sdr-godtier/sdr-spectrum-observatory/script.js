/**
 * SDR Spectrum Observatory — Workshop DIY v1.0
 * 24/7 spectrum monitoring and anomaly detection.
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="60" width="8" height="30" rx="2" fill="currentColor" opacity=".7"><animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite"/><animate attributeName="y" values="60;80;60" dur="1s" repeatCount="indefinite"/></rect><rect x="25" y="40" width="8" height="50" rx="2" fill="currentColor" opacity=".8"><animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite"/><animate attributeName="y" values="40;70;40" dur="1.2s" repeatCount="indefinite"/></rect><rect x="40" y="20" width="8" height="70" rx="2" fill="currentColor"><animate attributeName="height" values="70;30;70" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="20;60;20" dur="0.8s" repeatCount="indefinite"/></rect><rect x="55" y="35" width="8" height="55" rx="2" fill="currentColor" opacity=".85"><animate attributeName="height" values="55;15;55" dur="1.1s" repeatCount="indefinite"/><animate attributeName="y" values="35;75;35" dur="1.1s" repeatCount="indefinite"/></rect><rect x="70" y="50" width="8" height="40" rx="2" fill="currentColor" opacity=".75"><animate attributeName="height" values="40;10;40" dur="0.9s" repeatCount="indefinite"/><animate attributeName="y" values="50;80;50" dur="0.9s" repeatCount="indefinite"/></rect><rect x="85" y="55" width="8" height="35" rx="2" fill="currentColor" opacity=".6"><animate attributeName="height" values="35;5;35" dur="1.3s" repeatCount="indefinite"/><animate attributeName="y" values="55;85;55" dur="1.3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,c+.08);o.start(c);o.stop(c+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,c+.3);o.start(c);o.stop(c+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+.25);o.start(c);o.stop(c+.25);}}
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
    ...LANG_BASE.en,title:'Spectrum Observatory',subtitle:'24/7 Spectrum Monitoring',disconnected:'Idle',connected:'Monitoring',mainSection:'Spectrum Monitor',mainDesc:'Continuous spectrum monitoring and anomaly detection',sectionA:'Observatory Stats',sectionB:'Observatory Guide',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'The main display shows the Spectrum Observatory simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for Spectrum Observatory. Choose yo',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Observatory Stats" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',wiki_themes_title:'Themes',wiki_themes:'8 مظاهر. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_i18n_title:'Languages',wiki_i18n:'EN, FR, AR. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',working:'Working...',filterAll:'All',soundEffects:'Sound effects',ready:'Observatory ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',bandLabel:'Frequency Band',threshLabel:'Alert Threshold (dB)',startMon:'Start Monitoring',stopMon:'Stop',resetMon:'Reset',scanTime:'Monitoring Time:',anomalies:'Anomalies:',peakSig:'Peak Signal:',noiseFloor:'Noise Floor:',occupancy:'Occupancy:',guideIntro:'Spectrum observatory monitors RF bands:',guide1:'Real-time spectrum and waterfall',guide2:'Automatic anomaly detection',guide3:'Band occupancy stats',guide4:'Alert system for unexpected TX',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',monStarted:'Monitoring started',monStopped:'Stopped',monReset:'Reset',anomalyDetected:'ANOMALY detected at',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Set Up',step1Desc:'Configure the parameters for Spectrum Observatory. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Observatory Stats" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Observatory Guide". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is Spectrum Observatory?',faq_a1:'Spectrum Observatory is an interactive simulation that demonstrates advanced SDR concepts. Continuous spectrum monitoring and anomaly detection. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real advanced SDR behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real advanced SDR principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Full stack. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Sdr Os and Sdr Server. Each app in this category teaches a different aspect of advanced SDR.',demo_s1:'Welcome to Spectrum Observatory! Look at the main display — this is where the advanced SDR simulation runs.',demo_s2:'Select frequency band. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Observatory Stats" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of advanced SDR.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Analysis',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Spectrum Observatory! This is like a science experiment on your computer. You get to control a real advanced SDR simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for Spectrum Observatory. Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches advanced SDR concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',purpose:'Spectrum Observatory: Continuous spectrum monitoring and anomaly detection. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure SDR through Capture Signal to Process & Filter and Visualize Output.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Observatory Stats" and "Observatory Guide" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Radio Astronomy',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. Spectrum Observatory builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Spectrum Observatory',
    wiki_math: 'The mathematics behind Spectrum Observatory: Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced radio astronomy practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to radio astronomy. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with radio astronomy: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in radio astronomy.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Radio Astronomy carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Spectral Density',
    gloss1_def: 'Power distribution across frequencies, measured in watts per hertz. Shows how signal energy is spread across the spectrum — peaks indicate active transmissions.',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Spectrum Observatory demonstrates key principles from advanced SDR. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world radio astronomy?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional radio astronomy systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
  fr:{title:'Observatoire Spectral',subtitle:'Surveillance Spectrale 24/7',disconnected:'Inactif',connected:'Surveillance',mainSection:'Moniteur Spectral',mainDesc:'Surveillance continue et detection d\'anomalies',sectionA:'Statistiques',sectionB:'Guide',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'L écran principal affiche la simulation Spectrum Observatory. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for Spectrum Observatory. Choose yo',howto_2:'Definissez le seuil.',howto_3:'Demarrez.',howto_4:'Surveillez les alertes.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'EN, FR, AR.',working:'En cours...',filterAll:'Tout',soundEffects:'Effets',ready:'Observatoire pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',bandLabel:'Bande',threshLabel:'Seuil (dB)',startMon:'Demarrer',stopMon:'Arreter',resetMon:'Reinitialiser',scanTime:'Temps:',anomalies:'Anomalies:',peakSig:'Signal pic:',noiseFloor:'Plancher:',occupancy:'Occupation:',guideIntro:'L\'observatoire surveille les bandes RF:',guide1:'Spectre et cascade en temps reel',guide2:'Detection automatique d\'anomalies',guide3:'Statistiques d\'occupation',guide4:'Alertes pour transmissions inattendues',splashHint:'passer',langChanged:'Langue: Francais',themeChanged:'Theme:',monStarted:'Surveillance demarree',monStopped:'Arretee',monReset:'Reinitialise',anomalyDetected:'ANOMALIE detectee a',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Spectrum Observatory est une simulation interactive qui démontre les concepts de SDR avancé. Continuous spectrum monitoring and anomaly detection. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai digital signal processing ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Sdr Universal Decoder and Sdr Os ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 Histoire de radioastronomie',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. Spectrum Observatory s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Spectrum Observatory',
    wiki_math: 'Les mathématiques derrière Spectrum Observatory : Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de radioastronomie utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour radioastronomie. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en radioastronomie : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Radioastronomie implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Spectral Density',
    gloss1_def: 'Power distribution across frequencies, measured in watts per hertz. Shows how signal energy is spread across the spectrum — peaks indicate active transmissions.',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Spectrum Observatory démontre les principes clés de SDR avancé. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec radio astronomy dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
  ar:{title:'مرصد الطيف',subtitle:'مراقبة الطيف على مدار الساعة',disconnected:'خامل',connected:'مراقبة',mainSection:'مراقب الطيف',mainDesc:'مراقبة مستمرة للطيف وكشف الشذوذ',sectionA:'احصائيات',sectionB:'الدليل',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة',howto:'كيفية',wiki:'ويكي',howto_1:'تعرض الشاشة الرئيسية محاكاة Spectrum Observatory. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for Spectrum Observatory. Choose yo',howto_2:'اضبط حد التنبيه.',howto_3:'ابدا المراقبة.',howto_4:'راقب التنبيهات.',wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'EN, FR, AR.',working:'جارٍ...',filterAll:'الكل',soundEffects:'مؤثرات',ready:'المرصد جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',bandLabel:'نطاق التردد',threshLabel:'حد التنبيه (dB)',startMon:'بدء المراقبة',stopMon:'ايقاف',resetMon:'اعادة',scanTime:'وقت المراقبة:',anomalies:'الشذوذات:',peakSig:'ذروة الاشارة:',noiseFloor:'ارضية الضوضاء:',occupancy:'الاشغال:',guideIntro:'مرصد الطيف يراقب نطاقات RF:',guide1:'طيف وشلال في الوقت الحقيقي',guide2:'كشف تلقائي للشذوذ',guide3:'احصائيات الاشغال',guide4:'نظام تنبيه للارسالات غير المتوقعة',splashHint:'تخطي',langChanged:'اللغة: العربية',themeChanged:'المظهر:',monStarted:'بدات المراقبة',monStopped:'توقفت',monReset:'اعادة ضبط',anomalyDetected:'تم كشف شذوذ عند',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Spectrum Observatory هي محاكاة تفاعلية توضح مفاهيم SDR متقدم. Continuous spectrum monitoring and anomaly detection. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا digital signal processing حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Sdr Universal Decoder and Sdr Os! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'SDR Basics',learn1Desc:'How software turns radio waves into digital data',learn1Tag:'SDR',learn2Title:'DSP Fundamentals',learn2Desc:'How math filters and transforms radio signals',learn2Tag:'DSP',learn3Title:'Modulation',learn3Desc:'How information rides on radio carrier waves',learn3Tag:'Signals',learn4Title:'Spectrum Analysis',learn4Desc:'How to read the waterfall and frequency displays',learn4Tag:'Analysis',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 تاريخ الفلك الراديوي',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. يبني Spectrum Observatory على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Spectrum Observatory',
    wiki_math: 'الرياضيات وراء Spectrum Observatory: Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الفلك الراديوي المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الفلك الراديوي. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الفلك الراديوي: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الفلك الراديوي يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Spectral Density',
    gloss1_def: 'Power distribution across frequencies, measured in watts per hertz. Shows how signal energy is spread across the spectrum — peaks indicate active transmissions.',
    gloss2_term: 'Onion Routing',
    gloss2_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Spectrum Observatory يوضح المبادئ الأساسية في SDR متقدم. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـradio astronomy في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};
let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;$('langSelect').value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+t;d.textContent='['+new Date().toLocaleTimeString()+'] '+m;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;applyLogFilter();}
function clearLog(){$('logContainer').innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='observatory-log.txt';a.click();URL.revokeObjectURL(u);}
function setStatus(c){const s=LANG[currentLang];$('statusText').textContent=c?s.connected:s.disconnected;$('statusPill').classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();}));}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){try{$('hijriDate').textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
let logWasOpen=false;function openSettings(){logWasOpen=$('logPanel')?.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){$('logPanel')?.classList.add('open');document.body.classList.add('log-open');}function closeLog(){$('logPanel')?.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

/* ═══════ SPECTRUM OBSERVATORY SIMULATION ═══════ */
let running=false,animFrame=null,startTime=0,anomalyCount=0;
const BANDS={fm:{lo:88,hi:108,unit:'MHz',sigs:[{f:0.15,p:-20},{f:0.35,p:-25},{f:0.55,p:-22},{f:0.75,p:-28}]},air:{lo:118,hi:137,unit:'MHz',sigs:[{f:0.2,p:-35},{f:0.6,p:-40}]},ism:{lo:433,hi:434,unit:'MHz',sigs:[{f:0.5,p:-30}]},cell:{lo:700,hi:900,unit:'MHz',sigs:[{f:0.1,p:-25},{f:0.3,p:-20},{f:0.5,p:-22},{f:0.7,p:-18},{f:0.9,p:-24}]},wifi:{lo:2400,hi:2500,unit:'MHz',sigs:[{f:0.25,p:-20},{f:0.5,p:-18},{f:0.75,p:-22}]}};

function genSpectrum(band){
  const N=400,spec=new Float32Array(N);
  const b=BANDS[band];if(!b)return spec;
  for(let i=0;i<N;i++){spec[i]=-60+Math.random()*5;}
  for(const s of b.sigs){const ci=Math.floor(s.f*N),spread=10+Math.random()*5;for(let i=Math.max(0,ci-15);i<Math.min(N,ci+15);i++){const d=Math.abs(i-ci);spec[i]=Math.max(spec[i],s.p+Math.random()*3-d*d*0.1);}}
  // Random anomaly
  if(Math.random()<0.03){const ai=Math.floor(Math.random()*N);spec[ai]=-10+Math.random()*5;}
  return spec;
}

function drawSpectrum(spec,thresh){
  const c=$('spectrumCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(0,i*h/6);ctx.lineTo(w,i*h/6);ctx.stroke();}
  // Threshold line
  const thY=h*(1-(thresh+60)/60);ctx.strokeStyle='#ff333355';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,thY);ctx.lineTo(w,thY);ctx.stroke();ctx.setLineDash([]);
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<spec.length;i++){const x=i/spec.length*w,y=h*(1-(spec[i]+60)/60);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();
  ctx.lineTo(w,h);ctx.lineTo(0,h);ctx.closePath();ctx.fillStyle=accent.replace(')',',0.1)').replace('rgb','rgba');ctx.fill();
  const b=BANDS[$('bandSelect').value];
  ctx.fillStyle='#8899aa';ctx.font='10px Orbitron,monospace';
  if(b){ctx.fillText(b.lo+' '+b.unit,4,h-4);ctx.fillText(b.hi+' '+b.unit,w-70,h-4);}
}

function drawWaterfall(spec){
  const c=$('waterfallCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  const img=ctx.getImageData(0,0,w,h-1);ctx.putImageData(img,0,1);
  for(let i=0;i<w;i++){const si=Math.floor(i/w*spec.length),val=Math.max(0,Math.min(1,(spec[si]+60)/60));
    let r,g,b;if(val<.25){r=0;g=0;b=Math.floor(val*4*255);}else if(val<.5){r=0;g=Math.floor((val-.25)*4*255);b=255;}
    else if(val<.75){r=Math.floor((val-.5)*4*255);g=255;b=255-Math.floor((val-.5)*4*255);}else{r=255;g=255-Math.floor((val-.75)*4*255);b=0;}
    ctx.fillStyle=`rgb(${r},${g},${b})`;ctx.fillRect(i,0,1,1);}
}

function drawAlerts(spec,thresh){
  const c=$('alertCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  let hasAnomaly=false;
  for(let i=0;i<spec.length;i++){if(spec[i]>thresh){const x=i/spec.length*w;ctx.fillStyle='#ff3333';ctx.fillRect(x-2,5,4,h-10);hasAnomaly=true;}}
  if(hasAnomaly){ctx.fillStyle='#ff3333';ctx.font='12px Orbitron,monospace';ctx.fillText('ALERT: Signal above threshold!',10,h/2+4);}
  else{ctx.fillStyle='#44ff44';ctx.font='12px Orbitron,monospace';ctx.fillText('All clear - no anomalies',10,h/2+4);}
  return hasAnomaly;
}

function monLoop(){if(!running)return;
  const band=$('bandSelect').value,thresh=+$('threshSlider').value;
  const spec=genSpectrum(band);drawSpectrum(spec,thresh);drawWaterfall(spec);
  const hasAnomaly=drawAlerts(spec,thresh);
  if(hasAnomaly&&Math.random()<0.1){anomalyCount++;const b=BANDS[band];
    const f=(b.lo+Math.random()*(b.hi-b.lo)).toFixed(1);
    log(LANG[currentLang].anomalyDetected+' '+f+' '+b.unit,'error');playSound('error');}
  const peak=Math.max(...spec),noise=spec.reduce((a,b)=>a+b,0)/spec.length;
  let occ=0;for(let i=0;i<spec.length;i++)if(spec[i]>-45)occ++;occ=Math.round(occ/spec.length*100);
  $('scanTimeVal').textContent=Math.floor((Date.now()-startTime)/1000)+'s';
  $('anomaliesVal').textContent=anomalyCount;$('peakSigVal').textContent=peak.toFixed(1)+' dB';
  $('noiseFloorVal').textContent=noise.toFixed(1)+' dB';$('occupancyVal').textContent=occ+'%';
  animFrame=requestAnimationFrame(monLoop);}
function startMon(){if(running)return;running=true;startTime=Date.now();setStatus(true);log(LANG[currentLang].monStarted,'success');monLoop();}
function stopMon(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].monStopped,'info');}
function resetMon(){stopMon();anomalyCount=0;['spectrumCanvas','waterfallCanvas','alertCanvas'].forEach(id=>{const c=$(id);c.getContext('2d').clearRect(0,0,c.width,c.height);});
  $('scanTimeVal').textContent='0s';$('anomaliesVal').textContent='0';$('peakSigVal').textContent='-- dB';$('noiseFloorVal').textContent='-- dB';$('occupancyVal').textContent='0%';
  log(LANG[currentLang].monReset,'info');}

function init(){
  initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',function(){setLanguage(this.value);});$('themeSelect').addEventListener('change',function(){setTheme(this.value);});
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();
  $('startBtn').onclick=startMon;$('stopBtn').onclick=stopMon;$('resetBtn').onclick=resetMon;
  $('threshSlider').oninput=function(){$('threshVal').textContent=this.value+' dB';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Spectrum Observatory
   Animated wideband panoramic spectrum + anomaly detection
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const specHist=[];
function boot(){
  let el=document.getElementById('obsSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='obsSimCanvas';el.width=780;el.height=220;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#030608;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function genSpec(){
  const n=256,d=new Float32Array(n);
  for(let i=0;i<n;i++)d[i]=-100+(Math.random()-.5)*4;
  // Known bands
  const bands=[{c:30,w:8,p:25},{c:80,w:5,p:20},{c:128,w:15,p:30},{c:180,w:4,p:18},{c:220,w:10,p:22}];
  bands.forEach(b=>{for(let i=0;i<n;i++){const dist=(i-b.c)/b.w;d[i]+=b.p*Math.exp(-.5*dist*dist);}});
  // Random transient
  if(Math.random()<.1){const c=Math.floor(Math.random()*n),w=1+Math.random()*3;
    for(let i=0;i<n;i++){const dist=(i-c)/w;d[i]+=35*Math.exp(-.5*dist*dist);}}
  return d;
}
function pCol(v){const n=Math.max(0,Math.min(1,(v+100)/60));
  if(n<.25)return[0,0,n*4*200|0];if(n<.5){const t=(n-.25)*4;return[0,t*200|0,200];}
  if(n<.75){const t=(n-.5)*4;return[t*255|0,200,(1-t)*200|0];}
  const u=(n-.75)*4;return[255,200+u*55|0,u*200|0];
}
function tick(){
  t+=.016;
  specHist.unshift(genSpec());if(specHist.length>H-25)specHist.pop();
  cx.fillStyle='#030608';cx.fillRect(0,0,W,H);
  // Waterfall
  for(let r=0;r<specHist.length;r++){
    const line=specHist[r];
    for(let i=0;i<256;i++){
      const[rr,g,b]=pCol(line[i]);
      cx.fillStyle=`rgb(${rr},${g},${b})`;
      cx.fillRect(i/256*W,20+r,Math.ceil(W/256)+1,1);
    }
  }
  // Overlay current spectrum line at top
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  if(specHist.length>0){
    cx.strokeStyle=acc+'88';cx.lineWidth=1;cx.beginPath();
    const cur=specHist[0];
    for(let i=0;i<256;i++){const x=i/256*W;const y=20-((cur[i]+100)/60)*18;if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);}
    cx.stroke();
  }
  // Band labels
  cx.fillStyle='rgba(255,255,255,.15)';cx.font='7px monospace';cx.textAlign='center';
  const labels=[{x:30,l:'HF'},{x:80,l:'VHF'},{x:128,l:'UHF'},{x:180,l:'L-Band'},{x:220,l:'S-Band'}];
  labels.forEach(lb=>{cx.fillText(lb.l,lb.x/256*W,16);});
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Panoramic Spectrum Observatory — Wideband Monitor',8,12);
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
