/**
 * Signal Zoo — Modulation Encyclopedia — Workshop DIY
 * AM, FM, FSK, BPSK, QPSK, 16-QAM, LoRa, Zigbee visualizer
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;switch(t){case'click':o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.08);o.start(c);o.stop(c+0.08);break;case'success':o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.3);o.start(c);o.stop(c+0.3);break;case'error':o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+0.25);o.start(c);o.stop(c+0.25);break;}}

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
    ...LANG_BASE.en,title:'Signal Zoo',subtitle:'🦁 AM, FM, FSK, PSK, LoRa, Zigbee',disconnected:'Disconnected',connected:'Connected',mainSection:'Signal Zoo — Modulation Encyclopedia',mainDesc:'Select a modulation to explore its waveform, spectrum, and constellation',sectionA:'Spectrum View',sectionB:'Constellation Diagram',sectionC:'Modulation Explained',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'The main display shows the Signal Zoo simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for Signal Zoo. Choose your input s',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Spectrum View" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',wiki_mod_title:'📡 Modulation',wiki_mod:'ترميز المعلومات على موجة حاملة. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'كل البيانات تبقى في متصفحك. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',working:'Working...',ready:'🦁 Signal Zoo ready!',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',modExplained:'Radio modulation encodes information onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PSK). Digital modulations like FSK shift between discrete frequencies. LoRa uses chirp spread spectrum for long range. Each has unique waveform, spectral, and constellation characteristics.',modSelected:'📡 Modulation →',step1Title:'Set Up',step1Desc:'Configure the parameters for Signal Zoo. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Spectrum View" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Constellation Diagram". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is Signal Zoo?',faq_a1:'Signal Zoo is an interactive simulation that demonstrates SIGINT concepts. Select a modulation to explore its waveform, spectrum, and constellation. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real signal intelligence behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real signal intelligence principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF One. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Hrf Aircraft Radar and Hrf Fm Pirate Radio. Each app in this category teaches a different aspect of signal intelligence.',demo_s1:'Welcome to Signal Zoo! Look at the main display — this is where the signal intelligence simulation runs.',demo_s2:'Click a modulation button (AM, FM, FSK, etc.) to select it. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Spectrum View" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of signal intelligence.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Signal Zoo! This is like a science experiment on your computer. You get to control a real SIGINT simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for Signal Zoo. Choose yo Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches signal intelligence concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',purpose:'Signal Zoo: Select a modulation to explore its waveform, spectrum, and constellation. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure RF through Capture Spectrum to Analyze Signal and Classify & Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Spectrum View" and "Constellation Diagram" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Sigint',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. Signal Zoo builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Signal Zoo',
    wiki_math: 'The mathematics behind Signal Zoo: Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced SIGINT practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to SIGINT. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with SIGINT: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in SIGINT.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Sigint carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Spectral Density',
    gloss1_def: 'Power distribution across frequencies, measured in watts per hertz. Shows how signal energy is spread across the spectrum — peaks indicate active transmissions.',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Signal Zoo demonstrates key principles from SIGINT. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world SIGINT?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional SIGINT systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
  fr:{title:'Signal Zoo',subtitle:'🦁 AM, FM, FSK, PSK, LoRa, Zigbee',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Signal Zoo — Encyclopedie des Modulations',mainDesc:'Selectionnez une modulation pour explorer sa forme d\'onde et son spectre',sectionA:'Vue spectrale',sectionB:'Diagramme de constellation',sectionC:'Modulation expliquee',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'L écran principal affiche la simulation Signal Zoo. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for Signal Zoo. Choose your input s',howto_2:'Voyez la forme d\'onde temporelle.',howto_3:'Ouvrez la vue spectrale.',howto_4:'Ouvrez le diagramme de constellation.',wiki_mod_title:'📡 Modulation',wiki_mod:'Encodage d\'information sur une onde porteuse.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Tout reste dans votre navigateur.',working:'En cours...',ready:'🦁 Signal Zoo pret !',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',modExplained:'La modulation radio encode l\'information sur une onde porteuse en variant son amplitude, sa frequence ou sa phase.',modSelected:'📡 Modulation →',step1Title:'Configurer RF',step1Desc:'Règle la bande de fréquence, le type de modulation et les paramètres.',step2Title:'Capturer le spectre',step2Desc:'Scanne le spectre radio pour détecter et capturer les signaux.',step3Title:'Analyser le signal',step3Desc:'Applique le traitement du signal pour identifier la modulation et la source.',step4Title:'Classifier et rapporter',step4Desc:'Catégorise le type de signal et enregistre les résultats.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Signal Zoo est une simulation interactive qui démontre les concepts de renseignement électronique. Select a modulation to explore its waveform, spectrum, and constellation. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio frequency patterns.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai signal intelligence ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR or HackRF. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Hrf Pager Decoder and Hrf Spectrum Wars ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',
    wiki_history_title: '📜 Histoire de renseignement électronique',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. Signal Zoo s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Signal Zoo',
    wiki_math: 'Les mathématiques derrière Signal Zoo : Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de renseignement électronique utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour renseignement électronique. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en renseignement électronique : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Renseignement électronique implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Spectral Density',
    gloss1_def: 'Power distribution across frequencies, measured in watts per hertz. Shows how signal energy is spread across the spectrum — peaks indicate active transmissions.',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Signal Zoo démontre les principes clés de renseignement électronique. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec SIGINT dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
  ar:{title:'حديقة الإشارات',subtitle:'🦁 AM, FM, FSK, PSK, LoRa, Zigbee',disconnected:'غير متصل',connected:'متصل',mainSection:'حديقة الإشارات — موسوعة التعديل',mainDesc:'اختر نوع تعديل لاستكشاف شكل الموجة والطيف والكوكبة',sectionA:'عرض الطيف',sectionB:'مخطط الكوكبة',sectionC:'شرح التعديل',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',theme:'المظهر',settings:'⚙️ الإعدادات',language:'اللغة',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'تعرض الشاشة الرئيسية محاكاة Signal Zoo. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for Signal Zoo. Choose your input s',howto_2:'شاهد شكل الموجة الزمني.',howto_3:'افتح عرض الطيف.',howto_4:'افتح مخطط الكوكبة.',wiki_mod_title:'📡 التعديل',wiki_mod:'ترميز المعلومات على موجة حاملة.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'كل البيانات تبقى في متصفحك.',working:'جارٍ...',ready:'🦁 حديقة الإشارات جاهزة!',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',modExplained:'تعديل الراديو يرمز المعلومات على موجة حاملة بتغيير سعتها أو ترددها أو طورها.',modSelected:'📡 التعديل →',step1Title:'تكوين RF',step1Desc:'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.',step2Title:'التقاط الطيف',step2Desc:'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.',step3Title:'تحليل الإشارة',step3Desc:'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.',step4Title:'تصنيف والتقرير',step4Desc:'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Signal Zoo هي محاكاة تفاعلية توضح مفاهيم الاستخبارات الإلكترونية. Select a modulation to explore its waveform, spectrum, and constellation. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio frequency patterns حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا signal intelligence حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR or HackRF. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Hrf Pager Decoder and Hrf Spectrum Wars! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',
    wiki_history_title: '📜 تاريخ الاستخبارات الإلكترونية',
    wiki_history: 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations. يبني Signal Zoo على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Signal Zoo',
    wiki_math: 'الرياضيات وراء Signal Zoo: Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الاستخبارات الإلكترونية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الاستخبارات الإلكترونية. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الاستخبارات الإلكترونية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الاستخبارات الإلكترونية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Spectral Density',
    gloss1_def: 'Power distribution across frequencies, measured in watts per hertz. Shows how signal energy is spread across the spectrum — peaks indicate active transmissions.',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Signal Zoo يوضح المبادئ الأساسية في الاستخبارات الإلكترونية. The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـSIGINT في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info');}
function playThemeMelody(n){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}

let logContainer,typewriterEnabled=true;const logHistory=[];
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const ft=`[${new Date().toLocaleTimeString()}] ${msg}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');logHistory.push({msg,type,ts:Date.now()});applyLogFilter();}
async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await new Promise(r=>setTimeout(r,8+Math.random()*12));}el.classList.remove('typing');}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const text=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const blob=new Blob([text],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`signal-zoo-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(r);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab,tid='help'+n.charAt(0).toUpperCase()+n.slice(1);const target=$(tid);if(target)target.classList.add('active');});});}
function initLogResize(){const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;let dragging=false,startX,startW;const isRtl=()=>document.documentElement.dir==='rtl';handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=isRtl()?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let whisperActive=false;function toggleWhisper(){whisperActive=!whisperActive;log(whisperActive?'🎤 Whisper on':'🎤 Whisper off','info');}
let breathingActive=false;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));log(breathingActive?'🫁 Breathing on':'🫁 Breathing off','info');}
let dhikrCount=0;function incrementDhikr(){if(!breathingActive)return;dhikrCount++;const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;playSound('click');}
function toggleMusicMode(){log('🎵 Music toggled','info');}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix(){const cv=$('matrixCanvas');if(!cv)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);cv.classList.remove('active');return;}matrixRunning=true;cv.classList.add('active');const ctx=cv.getContext('2d');cv.width=window.innerWidth;cv.height=window.innerHeight;const cols=Math.floor(cv.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,cv.width,cv.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>cv.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoClickCount=0,logoClickTimer=null;function initMatrixTrigger(){const logo=$('logoWrap');if(!logo)return;logo.style.cursor='pointer';logo.addEventListener('click',()=>{logoClickCount++;if(logoClickTimer)clearTimeout(logoClickTimer);if(logoClickCount>=3){logoClickCount=0;toggleMatrix();}else logoClickTimer=setTimeout(()=>logoClickCount=0,500);});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI!','success');}}else konamiIdx=0;});}

/* =======================================================================
   SIGNAL ZOO — MODULATION SIMULATION ENGINE
   ======================================================================= */
const MOD_INFO = {
  am:{name:'AM — Amplitude Modulation',desc:'Carrier amplitude varies with the message signal. Simple but bandwidth-inefficient. Used in broadcast radio (530-1700 kHz).'},
  fm:{name:'FM — Frequency Modulation',desc:'Carrier frequency varies with the message. Better noise immunity than AM. Used in FM radio (88-108 MHz), two-way radio.'},
  fsk:{name:'FSK — Frequency Shift Keying',desc:'Digital modulation switching between two frequencies for 0 and 1. Used in modems, pagers, POCSAG, weather sensors.'},
  bpsk:{name:'BPSK — Binary Phase Shift Keying',desc:'Phase shifts 180 degrees between symbols. 1 bit per symbol. Very robust, used in GPS L1, DSSS.'},
  qpsk:{name:'QPSK — Quadrature Phase Shift Keying',desc:'4 phase states encoding 2 bits per symbol. Used in DVB-S, 3G/4G downlink, satellite comms.'},
  qam16:{name:'16-QAM — Quadrature Amplitude Modulation',desc:'16 states combining 4 amplitude and 4 phase levels. 4 bits per symbol. Used in WiFi, LTE, cable modems.'},
  lora:{name:'LoRa — Chirp Spread Spectrum',desc:'Linear frequency chirps spread across bandwidth. Extreme range (10+ km), very low data rate. Used in IoT/LPWAN.'},
  zigbee:{name:'Zigbee — O-QPSK with Half-Sine',desc:'Offset QPSK with half-sine pulse shaping. IEEE 802.15.4 at 2.4 GHz. Used in home automation mesh networks.'}
};

let currentMod = 'am';
let animFrame = null;
let phase = 0;

function selectMod(mod) {
  currentMod = mod;
  document.querySelectorAll('.mod-btn').forEach(b => b.classList.toggle('primary', b.dataset.mod === mod));
  const info = $('modInfo');
  if (info) info.textContent = MOD_INFO[mod].desc;
  setStatus(true);
  log(`${LANG[currentLang].modSelected} ${MOD_INFO[mod].name}`, 'success');
  playSound('click');
  drawAll();
}

function drawAll() {
  drawWaveform();
  drawSpectrum();
  drawConstellation();
}

/* ======= WAVEFORM ======= */
function drawWaveform() {
  const cv = $('waveformCanvas'); if (!cv) return;
  const ctx = cv.getContext('2d'); const W = cv.width, H = cv.height;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  ctx.fillStyle = '#0a0e1a'; ctx.fillRect(0, 0, W, H);

  // Grid + center line
  ctx.strokeStyle = 'rgba(100,200,255,0.06)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();
  for (let i = 0; i <= 8; i++) { const x = (i/8)*W; ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }

  const bits = [1,0,1,1,0,0,1,0,1,0,1,1,0,1,0,0];
  const fc = 8; // carrier cycles per screen width
  const fm_mod = 2; // message freq

  ctx.strokeStyle = accent; ctx.lineWidth = 1.5; ctx.beginPath();

  for (let px = 0; px < W; px++) {
    const t = px / W;
    const bitIdx = Math.floor(t * bits.length) % bits.length;
    const bit = bits[bitIdx];
    const bitT = (t * bits.length) % 1;
    let y = 0;

    switch (currentMod) {
      case 'am': {
        const msg = 0.5 + 0.5 * Math.sin(2 * Math.PI * fm_mod * t);
        y = msg * Math.sin(2 * Math.PI * fc * t * 4);
        break;
      }
      case 'fm': {
        const integral = t + 0.3 * Math.sin(2 * Math.PI * fm_mod * t) / (2 * Math.PI * fm_mod);
        y = Math.sin(2 * Math.PI * fc * 4 * integral);
        break;
      }
      case 'fsk': {
        const freq = bit ? fc * 6 : fc * 3;
        y = Math.sin(2 * Math.PI * freq * t);
        break;
      }
      case 'bpsk': {
        const phaseShift = bit ? 0 : Math.PI;
        y = Math.sin(2 * Math.PI * fc * 4 * t + phaseShift);
        break;
      }
      case 'qpsk': {
        const symIdx = Math.floor(t * bits.length / 2) % (bits.length / 2);
        const b0 = bits[symIdx * 2], b1 = bits[symIdx * 2 + 1];
        const qphase = [Math.PI/4, 3*Math.PI/4, 5*Math.PI/4, 7*Math.PI/4][b0*2+b1];
        y = Math.sin(2 * Math.PI * fc * 4 * t + qphase);
        break;
      }
      case 'qam16': {
        const si = Math.floor(t * bits.length / 4) % (bits.length / 4);
        const amp = (bits[si*4]*2 + bits[si*4+1]) / 3;
        const qp = (bits[(si*4+2)%bits.length]*2 + bits[(si*4+3)%bits.length]) * Math.PI/6;
        y = (0.3 + 0.7 * amp) * Math.sin(2 * Math.PI * fc * 4 * t + qp);
        break;
      }
      case 'lora': {
        // Chirp: frequency increases linearly within each symbol
        const chirpT = (t * 4) % 1;
        const instantFreq = fc * 2 + fc * 6 * chirpT;
        y = Math.sin(2 * Math.PI * instantFreq * t + Math.PI * fc * 6 * chirpT * chirpT / 2);
        break;
      }
      case 'zigbee': {
        // O-QPSK with half-sine
        const phI = bit ? 0 : Math.PI;
        const halfSine = Math.sin(Math.PI * bitT);
        y = halfSine * Math.sin(2 * Math.PI * fc * 4 * t + phI);
        break;
      }
    }

    const py = H/2 - y * (H/2 - 10);
    if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Bit indicators at top
  ctx.fillStyle = 'rgba(100,200,255,0.3)'; ctx.font = '9px Orbitron,monospace'; ctx.textAlign = 'center';
  bits.forEach((b, i) => {
    const x = (i + 0.5) / bits.length * W;
    ctx.fillText(b.toString(), x, 14);
  });

  ctx.fillStyle = 'rgba(100,200,255,0.4)'; ctx.font = '10px Orbitron,monospace'; ctx.textAlign = 'left';
  ctx.fillText(MOD_INFO[currentMod].name, 8, H - 6);
}

/* ======= SPECTRUM ======= */
function drawSpectrum() {
  const cv = $('spectrumCanvas'); if (!cv) return;
  const ctx = cv.getContext('2d'); const W = cv.width, H = cv.height;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  ctx.fillStyle = '#0a0e1a'; ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(100,200,255,0.06)'; ctx.lineWidth = 1;
  for (let i = 0; i <= 8; i++) { ctx.beginPath(); ctx.moveTo((i/8)*W,0); ctx.lineTo((i/8)*W,H); ctx.stroke(); }
  for (let i = 0; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(0,(i/4)*H); ctx.lineTo(W,(i/4)*H); ctx.stroke(); }

  const cx = W / 2; // carrier at center

  ctx.strokeStyle = accent; ctx.lineWidth = 2; ctx.beginPath();

  for (let px = 0; px < W; px++) {
    const f = (px - cx) / (W / 8); // normalized freq
    let power = 0;

    switch (currentMod) {
      case 'am':
        power = 0.8 * Math.exp(-f*f*2) + 0.3 * Math.exp(-(f-1)*(f-1)*8) + 0.3 * Math.exp(-(f+1)*(f+1)*8);
        break;
      case 'fm':
        power = 0.3 * Math.exp(-f*f*0.3);
        for (let n = -3; n <= 3; n++) power += 0.2 * Math.exp(-(f-n*0.5)*(f-n*0.5)*12);
        break;
      case 'fsk':
        power = 0.6 * Math.exp(-(f-0.8)*(f-0.8)*6) + 0.6 * Math.exp(-(f+0.8)*(f+0.8)*6);
        break;
      case 'bpsk':
        power = 0.7 * Math.pow(Math.sin(Math.PI*f+0.001)/(Math.PI*f+0.001), 2) * 1.5;
        power = Math.max(0, power);
        break;
      case 'qpsk':
        power = 0.6 * Math.pow(Math.sin(Math.PI*f*0.7+0.001)/(Math.PI*f*0.7+0.001), 2) * 1.2;
        power = Math.max(0, power);
        break;
      case 'qam16':
        power = 0.8 * Math.pow(Math.sin(Math.PI*f*0.5+0.001)/(Math.PI*f*0.5+0.001), 2);
        power = Math.max(0, power);
        break;
      case 'lora':
        power = 0.5 * (Math.abs(f) < 2.5 ? 1 : 0) + 0.05;
        power *= (1 + 0.1 * Math.sin(f * 10));
        break;
      case 'zigbee':
        power = 0.6 * Math.exp(-f*f*0.8) * (1 + 0.3 * Math.cos(f * 4));
        break;
    }

    power += Math.random() * 0.02;
    const py = H - power * (H - 20) - 10;
    if (px === 0) ctx.moveTo(px, Math.max(5, py)); else ctx.lineTo(px, Math.max(5, py));
  }
  ctx.stroke();

  ctx.fillStyle = 'rgba(100,200,255,0.4)'; ctx.font = '9px Orbitron,monospace'; ctx.textAlign = 'center';
  ctx.fillText('fc', cx, H - 4);
  ctx.fillText('Frequency →', W - 50, H - 4);
  ctx.textAlign = 'left'; ctx.fillText('Power (dB) ↑', 8, 14);
}

/* ======= CONSTELLATION ======= */
function drawConstellation() {
  const cv = $('constellationCanvas'); if (!cv) return;
  const ctx = cv.getContext('2d'); const S = cv.width;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  ctx.fillStyle = '#0a0e1a'; ctx.fillRect(0, 0, S, S);

  const cx = S/2, cy = S/2, r = S/2 - 30;

  // Axes
  ctx.strokeStyle = 'rgba(100,200,255,0.1)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(S, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, S); ctx.stroke();

  // Unit circle
  ctx.strokeStyle = 'rgba(100,200,255,0.06)';
  ctx.beginPath(); ctx.arc(cx, cy, r * 0.7, 0, Math.PI * 2); ctx.stroke();

  ctx.fillStyle = 'rgba(100,200,255,0.3)'; ctx.font = '9px Orbitron,monospace';
  ctx.textAlign = 'center'; ctx.fillText('I', S - 12, cy - 4);
  ctx.fillText('Q', cx + 8, 14);

  let points = [];
  const noiseAmt = 0.05;

  switch (currentMod) {
    case 'am':
      for (let i = 0; i < 40; i++) { const a = 0.2 + Math.random() * 0.8; points.push([a + (Math.random()-0.5)*noiseAmt*2, (Math.random()-0.5)*noiseAmt*3]); }
      break;
    case 'fm':
      for (let i = 0; i < 60; i++) { const ang = Math.random() * Math.PI * 2; points.push([0.6*Math.cos(ang)+(Math.random()-0.5)*0.15, 0.6*Math.sin(ang)+(Math.random()-0.5)*0.15]); }
      break;
    case 'fsk':
      for (let i = 0; i < 30; i++) { points.push([0.7+(Math.random()-0.5)*noiseAmt*2, (Math.random()-0.5)*noiseAmt*3]); points.push([-0.7+(Math.random()-0.5)*noiseAmt*2, (Math.random()-0.5)*noiseAmt*3]); }
      break;
    case 'bpsk':
      for (let i = 0; i < 30; i++) { points.push([0.7+(Math.random()-0.5)*noiseAmt*2, (Math.random()-0.5)*noiseAmt*3]); points.push([-0.7+(Math.random()-0.5)*noiseAmt*2, (Math.random()-0.5)*noiseAmt*3]); }
      break;
    case 'qpsk':
      [[0.7,0.7],[-0.7,0.7],[-0.7,-0.7],[0.7,-0.7]].forEach(([i,q])=>{for(let k=0;k<15;k++)points.push([i+(Math.random()-0.5)*noiseAmt*3,q+(Math.random()-0.5)*noiseAmt*3]);});
      break;
    case 'qam16':
      for(let i=-3;i<=3;i+=2)for(let q=-3;q<=3;q+=2){for(let k=0;k<6;k++)points.push([i/4+(Math.random()-0.5)*noiseAmt*2,q/4+(Math.random()-0.5)*noiseAmt*2]);}
      break;
    case 'lora':
      for (let i = 0; i < 80; i++) { const ang = Math.random()*Math.PI*2; const rad = 0.5+0.2*Math.random(); points.push([rad*Math.cos(ang), rad*Math.sin(ang)]); }
      break;
    case 'zigbee':
      [[0.7,0.7],[-0.7,0.7],[-0.7,-0.7],[0.7,-0.7]].forEach(([i,q])=>{for(let k=0;k<12;k++){const t=k/12*Math.PI/2;points.push([i*Math.cos(t)-q*Math.sin(t)*0.3+(Math.random()-0.5)*noiseAmt*2,q*Math.cos(t)+i*Math.sin(t)*0.3+(Math.random()-0.5)*noiseAmt*2]);}});
      break;
  }

  ctx.fillStyle = accent;
  points.forEach(([i, q]) => {
    const px = cx + i * r;
    const py = cy - q * r;
    ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
  });

  // Ideal points overlay
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1;
  let ideals = [];
  switch (currentMod) {
    case 'bpsk': ideals = [[0.7,0],[-0.7,0]]; break;
    case 'qpsk': ideals = [[0.7,0.7],[-0.7,0.7],[-0.7,-0.7],[0.7,-0.7]]; break;
    case 'qam16': for(let i=-3;i<=3;i+=2)for(let q=-3;q<=3;q+=2)ideals.push([i/4,q/4]); break;
  }
  ideals.forEach(([i,q])=>{ctx.beginPath();ctx.arc(cx+i*r,cy-q*r,6,0,Math.PI*2);ctx.stroke();});
}

/* ======= ANIMATION ======= */
function animateLoop() {
  phase += 0.02;
  drawWaveform();
  animFrame = requestAnimationFrame(animateLoop);
}

/* ======= INIT ======= */
function init() {
  initSplash(); const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;initLogResize();
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  const whisperBtn=$('whisperBtn');if(whisperBtn)whisperBtn.onclick=toggleWhisper;
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};
  if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  const musicBtn=$('musicBtn');if(musicBtn)musicBtn.onclick=toggleMusicMode;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sL=localStorage.getItem('wdiy-lang'),sT=localStorage.getItem('wdiy-theme');if(sT)setTheme(sT);if(sL)setLanguage(sL);}catch{}
  initKonami();initMatrixTrigger();initHijriDate();

  // Modulation buttons
  document.querySelectorAll('.mod-btn').forEach(btn=>{btn.addEventListener('click',()=>selectMod(btn.dataset.mod));});
  selectMod('am');
  animateLoop();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Signal Zoo
   Animated modulation comparison grid + eye diagram
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
function boot(){
  let el=document.getElementById('zooSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='zooSimCanvas';el.width=780;el.height=220;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.03;cx.fillStyle='#060810';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Eye diagram simulation
  const eyeW=W*.45,eyeH=H-40,eyeX=W*.52,eyeY=20;
  cx.strokeStyle='rgba(100,200,255,.06)';cx.lineWidth=.5;
  cx.beginPath();cx.moveTo(eyeX,eyeY+eyeH/2);cx.lineTo(eyeX+eyeW,eyeY+eyeH/2);cx.stroke();
  // Draw multiple overlaid eye traces
  for(let trace=0;trace<30;trace++){
    const noise=(Math.random()-.5)*.15;const jitter=(Math.random()-.5)*5;
    cx.strokeStyle=`rgba(${parseInt(acc.slice(1,3),16)||212},${parseInt(acc.slice(3,5),16)||160},${parseInt(acc.slice(5,7),16)||60},.12)`;
    cx.lineWidth=1;cx.beginPath();
    for(let i=0;i<100;i++){
      const x=eyeX+jitter+i/100*eyeW;
      const sym=(i/50)%2<1?1:-1;const trans=Math.abs((i%50)/50-.5)*2;
      const y=eyeY+eyeH/2-(sym*(1-Math.exp(-trans*5))+noise*(1-trans))*eyeH*.35;
      if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
    }
    cx.stroke();
  }
  cx.fillStyle='rgba(0,0,0,.5)';cx.fillRect(eyeX+eyeW/2-35,eyeY,70,16);
  cx.fillStyle=acc;cx.font='10px Orbitron,monospace';cx.textAlign='center';cx.fillText('EYE DIAGRAM',eyeX+eyeW/2,eyeY+12);
  // Mini modulation previews on left
  const mods=['AM','FM','BPSK','QPSK'];const pw=W*.42/2,ph=(H-30)/2;
  mods.forEach((m,idx)=>{
    const mx=8+(idx%2)*pw,my=18+Math.floor(idx/2)*ph;
    cx.strokeStyle='rgba(100,200,255,.08)';cx.strokeRect(mx,my,pw-6,ph-6);
    cx.fillStyle='rgba(100,200,255,.3)';cx.font='8px monospace';cx.fillText(m,mx+4,my+10);
    cx.strokeStyle=`rgba(${100+idx*40},${200-idx*20},255,.3)`;cx.lineWidth=1;cx.beginPath();
    for(let i=0;i<60;i++){
      const xt=mx+4+i/60*(pw-14),tt=i/60+t;
      let y=my+ph/2-3;
      if(m==='AM')y-=(.5+.5*Math.sin(tt*4))*Math.sin(tt*20)*(ph*.25);
      else if(m==='FM')y-=Math.sin(tt*20+3*Math.sin(tt*4))*(ph*.25);
      else if(m==='BPSK')y-=(Math.floor(tt*3)%2?1:-1)*Math.sin(tt*20)*(ph*.25);
      else y-=Math.sin(tt*20+[.785,2.356,3.927,5.498][Math.floor(tt*2)%4])*(ph*.25);
      if(i===0)cx.moveTo(xt,y);else cx.lineTo(xt,y);
    }
    cx.stroke();
  });
  cx.fillStyle='rgba(100,200,255,.4)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Modulation Zoo — Eye Diagram + Mini Previews',8,12);
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
