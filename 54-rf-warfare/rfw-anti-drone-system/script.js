/**
 * Workshop DIY — Anti-Drone System v1.2
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
    ...LANG_BASE.en,title:'Anti-Drone System',subtitle:'Anti-Drone System',disconnected:'Idle',connected:'Active',mainSection:'Anti-Drone RF System',mainDesc:'Detect, track, and neutralize drones via RF jamming',sectionA:'Drone Tracks',sectionB:'C-UAS Technology',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'The main display shows the Anti Drone System simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Scan the electromagnetic spectrum to identify hostile RF emi',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Drone Tracks" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',working:'Working...',ready:'Anti-Drone System ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startDetect:'Start Detection',stopDetect:'Stop Detection',engageJam:'Engage Jammer',disengageJam:'Disengage',resetSim:'Reset',detParams:'Detection',jamParams:'Jamming',radarRange:'Radar Range (km):',sensitivity:'Sensitivity:',jamPower:'Jam Power (W):',jamBand:'Jam Band:',sysStatus:'System Status',droneHint:'Tracked drone contacts and threat levels.',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What is Anti-Drone System?',faq_a1:'Anti Drone System is an interactive simulation that demonstrates RF warfare concepts. Detect, track, and neutralize drones via RF jamming. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real electronic warfare behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real electronic warfare principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Rfw Cognitive Ew and Rfw Comms Interception Hub. Each app in this category teaches a different aspect of electronic warfare.',demo_s1:'Welcome to Anti-Drone System! Look at the main display — this is where the electronic warfare simulation runs.',demo_s2:'Set radar range and sensitivity. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Drone Tracks" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of electronic warfare.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'SIGINT',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Anti Drone System! This is like a science experiment on your computer. You get to control a real RF warfare simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Scan the electromagnetic spectrum to identify host Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches electronic warfare concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',wiki_concept_title:'🔬 What is Anti-Drone System?',wiki_concept:'Anti-Drone System is a technique used in electronic warfare. Detect, track, and neutralize drones via RF jamming. In professional settings, this technology requires HackRF and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Scan the electromagnetic spectrum to identify hostile RF emissions. Second: Analyze the threat signal: frequency, power, modulation, and direction. The simulation runs these stages in real time, showing you intermediate results at each step. In real electronic warfare, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Anti-Drone System has practical applications in electronic warfare. Professionals use similar techniques with HackRF in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Anti-Drone System: Detect, track, and neutralize drones via RF jamming. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Detect RF Threat through Characterize Signal to Deploy Countermeasure and Assess Effectiveness.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Drone Tracks" and "C-UAS Technology" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Exploit Development',
    wiki_history: 'AM radio began in 1906. FM followed in 1933. Digital modulation (PSK, QAM) emerged in the 1960s. Modern 5G uses 256-QAM for high data rates. Anti Drone System builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Rfw Anti Drone System',
    wiki_math: 'The mathematics behind Anti Drone System: QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced exploit development practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to exploit development. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with exploit development: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in exploit development.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Exploit Development carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Constellation Diagram',
    gloss1_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss2_term: 'Port',
    gloss2_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Capture Effect',
    gloss4_def: 'When a stronger signal overrides a weaker one at the receiver. Spoofers exploit this by transmitting a slightly stronger fake signal that the receiver locks onto.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Anti Drone System demonstrates key principles from RF warfare. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world exploit development?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional exploit development systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
  fr:{title:'Systeme Anti-Drone',subtitle:'Systeme Anti-Drone',disconnected:'Inactif',connected:'Actif',mainSection:'Systeme RF Anti-Drone',mainDesc:'Detecter, suivre et neutraliser les drones',sectionA:'Pistes Drones',sectionB:'Technologie C-UAS',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',working:'En cours...',ready:'Systeme pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startDetect:'Demarrer Detection',stopDetect:'Arreter',engageJam:'Activer Brouilleur',disengageJam:'Desactiver',resetSim:'Reinitialiser',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Anti Drone System est une simulation interactive qui démontre les concepts de guerre RF. Detect, track, and neutralize drones via RF jamming. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais electronic warfare signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai electromagnetic combat techniques ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Rfw Comms Interception Hub and Rfw Radar Jammer Lab ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 Histoire de développement exploits',
    wiki_history: 'AM radio began in 1906. FM followed in 1933. Digital modulation (PSK, QAM) emerged in the 1960s. Modern 5G uses 256-QAM for high data rates. Anti Drone System s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Rfw Anti Drone System',
    wiki_math: 'Les mathématiques derrière Anti Drone System : QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de développement exploits utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour développement exploits. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en développement exploits : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Développement exploits implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Constellation Diagram',
    gloss1_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss2_term: 'Port',
    gloss2_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Capture Effect',
    gloss4_def: 'When a stronger signal overrides a weaker one at the receiver. Spoofers exploit this by transmitting a slightly stronger fake signal that the receiver locks onto.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Anti Drone System démontre les principes clés de guerre RF. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec exploit development dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
  ar:{title:'\u0646\u0638\u0627\u0645 \u0645\u0636\u0627\u062f \u0644\u0644\u0637\u0627\u0626\u0631\u0627\u062a',subtitle:'\u0646\u0638\u0627\u0645 \u0645\u0636\u0627\u062f \u0644\u0644\u0637\u0627\u0626\u0631\u0627\u062a',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u0646\u0634\u0637',mainSection:'\u0646\u0638\u0627\u0645 RF \u0645\u0636\u0627\u062f \u0644\u0644\u0637\u0627\u0626\u0631\u0627\u062a',mainDesc:'\u0643\u0634\u0641 \u0648\u062a\u062a\u0628\u0639 \u0648\u062a\u062d\u064a\u064a\u062f \u0627\u0644\u0637\u0627\u0626\u0631\u0627\u062a \u0628\u062f\u0648\u0646 \u0637\u064a\u0627\u0631',sectionA:'\u0645\u0633\u0627\u0631\u0627\u062a \u0627\u0644\u0637\u0627\u0626\u0631\u0627\u062a',sectionB:'\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627 C-UAS',activityLog:'\u0633\u062c\u0644',eventsMsg:'\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0627\u0644\u0646\u0638\u0627\u0645 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a',splashHint:'\u0627\u0646\u0642\u0631',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startDetect:'\u0628\u062f\u0621 \u0627\u0644\u0643\u0634\u0641',stopDetect:'\u0625\u064a\u0642\u0627\u0641',engageJam:'\u062a\u0634\u063a\u064a\u0644 \u0627\u0644\u0645\u0634\u0648\u0634',disengageJam:'\u0625\u064a\u0642\u0627\u0641',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Anti Drone System هي محاكاة تفاعلية توضح مفاهيم الحرب الإلكترونية. Detect, track, and neutralize drones via RF jamming. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج electronic warfare signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا electromagnetic combat techniques حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Rfw Comms Interception Hub and Rfw Radar Jammer Lab! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 تاريخ تطوير الثغرات',
    wiki_history: 'AM radio began in 1906. FM followed in 1933. Digital modulation (PSK, QAM) emerged in the 1960s. Modern 5G uses 256-QAM for high data rates. يبني Anti Drone System على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Rfw Anti Drone System',
    wiki_math: 'الرياضيات وراء Anti Drone System: QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR. Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو تطوير الثغرات المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في تطوير الثغرات. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في تطوير الثغرات: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'تطوير الثغرات يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Constellation Diagram',
    gloss1_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss2_term: 'Port',
    gloss2_def: 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Capture Effect',
    gloss4_def: 'When a stronger signal overrides a weaker one at the receiver. Spoofers exploit this by transmitting a slightly stronger fake signal that the receiver locks onto.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Anti Drone System يوضح المبادئ الأساسية في الحرب الإلكترونية. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـexploit development في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};
let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='cuas-log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function initPanels(){const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');if(langSel)langSel.onchange=()=>setLanguage(langSel.value);if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});}

let detecting=false,jamming=false,time=0;let drones=[];

function initDrones(){drones=[];const types=['Quadcopter','Hexacopter','Fixed-Wing','FPV Racer','Reconnaissance'];for(let i=0;i<6;i++){const angle=Math.random()*Math.PI*2;const dist=0.3+Math.random()*0.6;drones.push({id:'UAS-'+(i+1),type:types[Math.floor(Math.random()*types.length)],angle,dist,speed:0.002+Math.random()*0.005,alt:(50+Math.random()*400).toFixed(0),threat:['LOW','MED','HIGH'][Math.floor(Math.random()*3)],jammed:false,neutralized:false});}}

function drawRadar(){
  const c=$('radarCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const cx=W/2,cy=H/2,R=Math.min(W,H)/2-30;
  // Rings
  for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(cx,cy,R*i/4,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.12)';ctx.lineWidth=1;ctx.stroke();}
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.stroke();
  // Range labels
  const range=parseInt($('rangeInput')?.value||10);
  ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
  for(let i=1;i<=4;i++)ctx.fillText((range*i/4).toFixed(0)+'km',cx+R*i/4,cy+12);
  // Sweep
  if(detecting){const angle=time*1.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(angle)*R,cy+Math.sin(angle)*R);ctx.strokeStyle='rgba(0,255,136,0.5)';ctx.lineWidth=2;ctx.stroke();const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,R);grad.addColorStop(0,'rgba(0,255,136,0.12)');grad.addColorStop(1,'rgba(0,255,136,0)');ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,angle-0.4,angle);ctx.closePath();ctx.fillStyle=grad;ctx.fill();}
  // Drones
  drones.forEach(d=>{
    d.angle+=d.speed;if(d.angle>Math.PI*2)d.angle-=Math.PI*2;
    if(d.neutralized){d.dist+=0.001;if(d.dist>1)d.dist=1;}
    const dx=cx+Math.cos(d.angle)*d.dist*R;const dy=cy+Math.sin(d.angle)*d.dist*R;
    if(!detecting&&!d.neutralized)return;
    const color=d.neutralized?'rgba(100,100,100,0.5)':d.jammed?'rgba(255,200,0,0.9)':d.threat==='HIGH'?'rgba(255,50,50,0.9)':d.threat==='MED'?'rgba(255,200,0,0.8)':'rgba(0,200,255,0.7)';
    ctx.beginPath();ctx.arc(dx,dy,6,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
    if(d.threat==='HIGH'&&!d.neutralized&&detecting){ctx.beginPath();ctx.arc(dx,dy,12+Math.sin(time*5)*3,0,Math.PI*2);ctx.strokeStyle='rgba(255,50,50,0.5)';ctx.lineWidth=2;ctx.stroke();}
    if(d.jammed&&!d.neutralized){for(let j=0;j<3;j++){ctx.beginPath();ctx.arc(dx,dy,8+j*6+Math.sin(time*4)*2,0,Math.PI*2);ctx.strokeStyle='rgba(255,100,0,'+(0.3-j*0.08)+')';ctx.lineWidth=1;ctx.stroke();}}
    ctx.fillStyle=d.neutralized?'#666':d.jammed?'#ffcc00':'#66ccff';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(d.id,dx,dy-10);
  });
  // Center
  ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);ctx.fillStyle='rgba(0,255,136,0.8)';ctx.fill();ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('C-UAS RADAR',10,18);
  if(jamming){ctx.fillStyle='rgba(255,100,0,0.8)';ctx.fillText('JAMMING ACTIVE',10,34);}
}

function drawRF(){
  const c=$('rfCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // Show drone RF signatures
  ctx.beginPath();for(let x=0;x<W;x++){let y=H*0.7+Math.random()*6;if(detecting){const f=x/W*6;drones.forEach(d=>{if(d.neutralized)return;const dFreq=d.type==='FPV Racer'?5.8:2.4;if(Math.abs(f-dFreq)<0.3)y-=20+Math.random()*15;});}if(jamming){const band=$('jamBandSelect')?.value||'2.4ghz';const jf=band==='2.4ghz'?2.4:band==='5.8ghz'?5.8:band==='gps'?1.575:3;if(Math.abs(x/W*6-jf)<0.5)y-=30+Math.random()*20;}if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.strokeStyle='rgba(0,200,255,0.6)';ctx.lineWidth=1;ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('RF SPECTRUM (0-6 GHz)',5,14);
}

function animate(){
  time+=0.016;
  if(jamming){drones.forEach(d=>{d.jammed=true;if(Math.random()>0.995&&!d.neutralized){d.neutralized=true;log('UAS '+d.id+' NEUTRALIZED','success');}});}
  drawRadar();drawRF();updateStats();requestAnimationFrame(animate);
}
function updateStats(){const stats=$('sysStats');if(!stats)return;const tracked=drones.filter(d=>detecting&&!d.neutralized).length;const neutralized=drones.filter(d=>d.neutralized).length;stats.innerHTML='<b>Tracked:</b> '+tracked+'<br><b>Neutralized:</b> '+neutralized+'<br><b>Jammer:</b> '+(jamming?'<span style="color:#ff8800">ENGAGED</span>':'OFF')+'<br><b>Status:</b> '+(detecting?'<span style="color:#00ff88">ACTIVE</span>':'<span style="color:#888">STANDBY</span>');}
function updateDroneList(){const lib=$('droneList');if(!lib)return;lib.innerHTML='';drones.forEach(d=>{const row=document.createElement('div');row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+(d.neutralized?'rgba(100,100,100,0.1)':d.threat==='HIGH'?'rgba(255,50,50,0.1)':'rgba(0,200,255,0.05)');row.innerHTML='<span style="color:'+(d.neutralized?'#666':d.threat==='HIGH'?'#ff6666':'#66ccff')+'">'+d.id+'</span><span>'+d.type+'</span><span>'+d.alt+'m</span><span style="color:'+(d.threat==='HIGH'?'#ff4444':d.threat==='MED'?'#ffcc00':'#00cc88')+'">'+d.threat+'</span><span style="color:'+(d.neutralized?'#666':d.jammed?'#ff8800':'#00cc88')+'">'+(d.neutralized?'DOWN':d.jammed?'JAMMED':'TRACK')+'</span>';lib.appendChild(row);});}
function initTechDatabase(){const db=$('techDatabase');if(!db)return;db.innerHTML=['<b>RF Detection:</b> Identifying drone control and video link frequencies.','<b>2.4/5.8 GHz Jamming:</b> Disrupting WiFi and FPV control links.','<b>GPS Denial:</b> Blocking GPS to force drone return-to-home or land.','<b>Protocol Analysis:</b> Identifying drone make and model from RF signature.','<b>Directional Jamming:</b> Focused beam to minimize collateral disruption.','<b>Layered Defense:</b> Combining detection, tracking, and multiple countermeasures.'].join('<br><br>');}

function initControls(){
  $('rangeInput').oninput=()=>{$('rangeLabel').textContent=$('rangeInput').value+' km';};
  $('sensInput').oninput=()=>{$('sensLabel').textContent=$('sensInput').value+'%';};
  $('jamPowerInput').oninput=()=>{$('jamPowerLabel').textContent=$('jamPowerInput').value+' W';};
  $('detectBtn').onclick=()=>{detecting=!detecting;setStatus(detecting);$('detectBtn').querySelector('[data-i18n]').textContent=detecting?LANG[currentLang].stopDetect:LANG[currentLang].startDetect;log(detecting?'Detection STARTED — scanning for UAS':'Detection STOPPED',detecting?'rx':'info');if(detecting)showToast('Scanning...',2000);};
  $('jamBtn').onclick=()=>{jamming=!jamming;$('jamBtn').querySelector('[data-i18n]').textContent=jamming?LANG[currentLang].disengageJam:LANG[currentLang].engageJam;log(jamming?'JAMMER ENGAGED — '+$('jamBandSelect').value:'Jammer disengaged',jamming?'error':'info');if(jamming)showToast('Jamming...',2000);};
  $('resetBtn').onclick=()=>{detecting=false;jamming=false;setStatus(false);initDrones();$('detectBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].startDetect;$('jamBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].engageJam;log('Reset','info');playSound('click');};
}

document.addEventListener('DOMContentLoaded',()=>{
  initSplash();initPanels();initLogFilters();initDrones();initTechDatabase();initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');animate();setInterval(updateDroneList,1000);
});

/* ═══════ ENHANCED RF CANVAS — ANTI-DRONE SYSTEM ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _detectionHist=new Array(200).fill(0);let _neutralizeHist=new Array(200).fill(0);
let _radarParticles=[];let _threatLevel=new Array(200).fill(0);

class RadarPulse{constructor(cx,cy){this.cx=cx;this.cy=cy;this.r=0;this.maxR=200;this.speed=3;this.life=1;}
update(){this.r+=this.speed;this.life=1-this.r/this.maxR;return this.r<this.maxR;}
draw(ctx){ctx.beginPath();ctx.arc(this.cx,this.cy,this.r,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,'+this.life*0.3+')';ctx.lineWidth=2;ctx.stroke();}}

/* ── Threat Assessment Gauge ── */
function drawThreatGauge(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('THREAT LEVEL ASSESSMENT',5,12);
  const isDet=typeof detecting!=='undefined'&&detecting;
  const isJam=typeof jamming!=='undefined'&&jamming;
  const highCount=typeof drones!=='undefined'?drones.filter(d=>d.threat==='HIGH'&&!d.neutralized).length:0;
  const totalActive=typeof drones!=='undefined'?drones.filter(d=>!d.neutralized).length:0;
  const threat=isDet?Math.min(100,highCount*30+totalActive*10+Math.random()*5):0;
  _threatLevel.push(threat);if(_threatLevel.length>200)_threatLevel.shift();
  // Gauge arc
  const cx=W/2,cy=H*0.7,R=Math.min(W,H)*0.35;
  const startA=Math.PI*0.8,endA=Math.PI*2.2;
  // Background arc
  ctx.beginPath();ctx.arc(cx,cy,R,startA,endA);ctx.strokeStyle='rgba(50,50,50,0.3)';ctx.lineWidth=12;ctx.stroke();
  // Color zones
  const greenEnd=startA+(endA-startA)*0.4;const yellowEnd=startA+(endA-startA)*0.7;
  ctx.beginPath();ctx.arc(cx,cy,R,startA,greenEnd);ctx.strokeStyle='rgba(0,200,100,0.3)';ctx.lineWidth=12;ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,R,greenEnd,yellowEnd);ctx.strokeStyle='rgba(255,200,0,0.3)';ctx.lineWidth=12;ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,R,yellowEnd,endA);ctx.strokeStyle='rgba(255,50,50,0.3)';ctx.lineWidth=12;ctx.stroke();
  // Needle
  const needleA=startA+(threat/100)*(endA-startA);
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(needleA)*R*0.9,cy+Math.sin(needleA)*R*0.9);
  ctx.strokeStyle=threat>70?'rgba(255,50,50,0.9)':threat>40?'rgba(255,200,0,0.8)':'rgba(0,200,100,0.7)';
  ctx.lineWidth=3;ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fill();
  ctx.fillStyle=threat>70?'rgba(255,50,50,0.8)':'rgba(255,200,0,0.7)';ctx.font='18px Orbitron,monospace';ctx.textAlign='center';
  ctx.fillText(threat.toFixed(0),cx,cy+R*0.4);
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';ctx.fillText('THREAT LEVEL',cx,cy+R*0.55);
}

/* ── Kill Chain Timeline ── */
function drawKillChain(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('C-UAS KILL CHAIN',5,12);
  const isDet=typeof detecting!=='undefined'&&detecting;
  const isJam=typeof jamming!=='undefined'&&jamming;
  const stages=['DETECT','CLASSIFY','TRACK','IDENTIFY','ENGAGE','NEUTRALIZE'];
  const activeStage=!isDet?-1:!isJam?2:5;
  const stageW=(W-20)/stages.length;
  stages.forEach((s,i)=>{
    const x=10+i*stageW;const y=28;const isActive=i<=activeStage;
    ctx.fillStyle=isActive?(i>=4?'rgba(255,50,50,0.2)':'rgba(0,200,255,0.15)'):'rgba(50,50,50,0.15)';
    ctx.fillRect(x,y,stageW-4,40);
    if(isActive&&i===activeStage){ctx.strokeStyle='rgba(255,200,0,0.6)';ctx.lineWidth=2;ctx.strokeRect(x,y,stageW-4,40);}
    ctx.fillStyle=isActive?(i>=4?'#ff6666':'#66ccff'):'rgba(100,100,100,0.4)';
    ctx.font='8px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(s,x+stageW/2-2,y+25);
    if(i<stages.length-1){ctx.fillStyle=isActive&&i<activeStage?'rgba(0,200,255,0.5)':'rgba(100,100,100,0.2)';
      ctx.beginPath();ctx.moveTo(x+stageW-6,y+20);ctx.lineTo(x+stageW+2,y+20);ctx.lineTo(x+stageW-2,y+17);ctx.moveTo(x+stageW+2,y+20);ctx.lineTo(x+stageW-2,y+23);ctx.stroke();}
  });
  // Timeline progress bar
  const progress=activeStage>=0?(activeStage+1)/stages.length*100:0;
  ctx.fillStyle='rgba(50,50,50,0.3)';ctx.fillRect(10,75,W-20,8);
  ctx.fillStyle=progress>80?'rgba(0,200,100,0.6)':progress>40?'rgba(255,200,0,0.5)':'rgba(0,200,255,0.4)';
  ctx.fillRect(10,75,(W-20)*progress/100,8);
}

/* ── Detection/Neutralization Stats ── */
function drawDetNeutStats(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('DETECTION vs NEUTRALIZATION RATE',5,12);
  const isDet=typeof detecting!=='undefined'&&detecting;
  const isJam=typeof jamming!=='undefined'&&jamming;
  const det=isDet?(typeof drones!=='undefined'?drones.filter(d=>!d.neutralized).length:0)*15+Math.random()*10:0;
  const neut=isJam?(typeof drones!=='undefined'?drones.filter(d=>d.neutralized).length:0)*20+Math.random()*8:0;
  _detectionHist.push(det);if(_detectionHist.length>200)_detectionHist.shift();
  _neutralizeHist.push(neut);if(_neutralizeHist.length>200)_neutralizeHist.shift();
  ctx.beginPath();
  _detectionHist.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/100)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  ctx.beginPath();
  _neutralizeHist.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/100)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(255,100,0,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='rgba(0,200,255,0.5)';ctx.font='8px Orbitron,monospace';ctx.fillText('Detect',W-80,H-15);
  ctx.fillStyle='rgba(255,100,0,0.5)';ctx.fillText('Neutralize',W-80,H-5);
}

/* ── RF Signature Classification ── */
function drawRFClassification(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('RF SIGNATURE CLASSIFICATION',5,12);
  if(typeof drones==='undefined')return;
  const isDet=typeof detecting!=='undefined'&&detecting;
  const classTypes=[{name:'DJI Phantom',band:'2.4 GHz',proto:'Lightbridge',color:'#66ccff'},{name:'FPV Racer',band:'5.8 GHz',proto:'Analog Video',color:'#ff6666'},{name:'DJI Mavic',band:'2.4/5.8 GHz',proto:'OcuSync',color:'#66ff88'},{name:'Parrot',band:'2.4 GHz WiFi',proto:'802.11',color:'#ffcc00'},{name:'Unknown',band:'900 MHz',proto:'Custom',color:'#cc66ff'}];
  const barH=Math.min(22,(H-25)/classTypes.length);
  classTypes.forEach((ct,i)=>{
    const y=25+i*barH;const count=isDet?Math.floor(Math.random()*3):0;
    const conf=isDet?60+Math.random()*35:0;
    ctx.fillStyle=count>0?ct.color.replace('#','rgba(').replace(/(..)(..)(..)/,(m,r,g,b)=>parseInt(r,16)+','+parseInt(g,16)+','+parseInt(b,16))+',0.15)':'rgba(50,50,50,0.1)';
    ctx.fillRect(5,y,W-10,barH-2);
    ctx.fillStyle=count>0?ct.color:'rgba(100,100,100,0.4)';ctx.font='8px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText(ct.name+' — '+ct.band,10,y+barH/2+3);
    if(count>0){ctx.textAlign='right';ctx.fillText(conf.toFixed(0)+'% conf',W-10,y+barH/2+3);}
  });
}

function enhancedRender(){
  _t+=0.016;
  for(let i=_radarParticles.length-1;i>=0;i--)if(!_radarParticles[i].update())_radarParticles.splice(i,1);
  const rc=_$('radarCanvas');
  if(rc){const ctx=rc.getContext('2d');
    if(typeof detecting!=='undefined'&&detecting&&_t%0.3<0.02){_radarParticles.push(new RadarPulse(rc.width/2,rc.height/2));}
    _radarParticles.forEach(p=>p.draw(ctx));
  }
  const rfc=_$('rfCanvas');
  if(rfc){const ctx=rfc.getContext('2d');const W=rfc.width,H=rfc.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawThreatGauge(ctx,W*0.4,H);
    ctx.save();ctx.translate(W*0.4,0);drawKillChain(ctx,W*0.6,H);ctx.restore();}
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
