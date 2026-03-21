/**
 * RF Fingerprinter — Device Signatures
 * Workshop DIY — v1.2
 * Capture unique RF patterns from devices
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3V160.8c0-4.2.1-7.8.1-7.9zM208.4,151.3h-6.5v3.2h6.5v-3.2zm-13,16.2h-3.2V151.3h3.2v16.2zm19.5,0h-3.2V151.3h3.2v16.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8V164.1l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9V152.7h-3.9v-4.7h14.5z"/></svg>`;
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;switch(type){case'click':osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);break;case'success':osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);break;case'error':osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);break;}}

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
  en: {
    ...LANG_BASE.en,
    title:'RF Fingerprinter', subtitle:'RF Fingerprinter \u2014 Device Signatures',
    disconnected:'Idle', connected:'Capturing',
    mainSection:'RF Fingerprinter', mainDesc:'Capture unique RF patterns',
    sectionA:'Fingerprint Database', sectionB:'How RF Fingerprinting Works', sectionC:'Device Identification Methods',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', export:'Export', theme:'Theme',
    settings:'\u2699\uFE0F Settings', language:'Language',
    help:'\u2753 Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.', howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Fingerprint Database" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.', howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_fp_title:'RF Fingerprinting', wiki_fp:'Uses hardware imperfections to identify individual devices. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_use_title:'Use Cases', wiki_use:'Rogue device detection, IoT security, forensics. Sensors convert physical phenomena (light, sound, temperature, motion) into electrical signals that a computer can process. The key specifications are sensitivity (smallest change it can detect), range (min to max values), and accuracy (how close to the true value).',
    working:'Working\u2026',
    t_mosque:'Mosque', t_zellige:'Zellige', t_andalus:'Andalus', t_riad:'Riad', t_medina:'Medina',
    t_space:'Space', t_jungle:'Jungle', t_robot:'Robot',
    ready:'\uD83D\uDE80 RF Fingerprinter ready!',
    logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed',
    filterAll:'All', soundEffects:'Sound effects',
    breathingGuide:'Breathing guide', dhikrTap:'Tap', splashHint:'tap to skip',
    langChanged:'\uD83C\uDF10 Language \u2192 English', themeChanged:'\uD83C\uDFA8 Theme \u2192',
    deviceLabel:'Device:', capture:'Capture', store:'Store', compare:'Compare',
    fpDetails:'Fingerprint Details', dbHint:'Capture and store fingerprints to build your database.',
    matchFound:'Match found!', noMatch:'No match in database', similarity:'Similarity:',
    guideTitle:'What Am I Looking At?',
    guideP1:'Every wireless device has tiny manufacturing variations in its radio components.',
    guideP2:'These cause unique patterns in clock drift, frequency offset, power transients, and modulation imperfections.',
    guideP3:'By capturing and analyzing these patterns, individual devices can be identified even among identical models.',
    dbTitle:'Device Identification Methods',step1Title:'Set Up',step1Desc:'Configure the parameters for RF Fingerprinter. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Fingerprint Database" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "How RF Fingerprinting Works". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is RF Fingerprinter?',faq_a1:'RF Fingerprinter lets you capture unique rf patterns. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you set the frequency band, modulation type, and signal parameters. Then you scan the radio spectrum to detect and capture signals of interest.',faq_q3:'What do the controls do?',faq_a3:'Select a device type. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'\u062A\u0633\u062A\u062E\u062F\u0645 \u0639\u064A\u0648\u0628 \u0627\u0644\u0639\u062A\u0627\u062F.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF One. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Hrf Aircraft Radar and Hrf Fm Pirate Radio. Each app in this category teaches a different aspect of signal intelligence.',demo_s1:'Welcome to RF Fingerprinter! Look at the main display — this is where the signal intelligence simulation runs.',demo_s2:'Select a device type. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Fingerprint Database" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of signal intelligence.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how signal intelligence works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches signal intelligence concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',purpose:'RF Fingerprinter: Capture unique RF patterns. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure RF through Capture Spectrum to Analyze Signal and Classify & Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Fingerprint Database" and "How RF Fingerprinting Works" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr: {
    ...LANG_BASE.fr,
    title:'Empreinte RF', subtitle:'Empreinte RF \u2014 Signatures',
    disconnected:'En attente', connected:'Capture',
    mainSection:'Empreinte RF', mainDesc:'Capturer des signatures RF uniques',
    sectionA:'Base d\'Empreintes', sectionB:'Comment \u00e7a marche', sectionC:'M\u00e9thodes d\'Identification',
    activityLog:'Journal', eventsMsg:'\u00c9v\u00e9nements',
    clear:'Effacer', copy:'Copier', export:'Exporter', theme:'Th\u00e8me',
    settings:'\u2699\uFE0F Param\u00e8tres', language:'Langue',
    help:'\u2753 Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    howto_1:'Regarde la carte principale en haut. C\'est ton panneau de contrôle. Règle les paramètres avec les curseurs et menus déroulants. Chacun est étiqueté. Commence avec les valeurs par défaut pour voir le comportement normal.', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.', howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_fp_title:'Empreinte RF', wiki_fp:'Utilise les imperfections mat\u00e9rielles.',
    wiki_use_title:'Cas d\'usage', wiki_use:'D\u00e9tection d\'appareils, s\u00e9curit\u00e9 IoT.',
    working:'En cours\u2026',
    t_mosque:'Mosqu\u00e9e', t_zellige:'Zellige', t_andalus:'Andalous', t_riad:'Riad', t_medina:'M\u00e9dina',
    t_space:'Espace', t_jungle:'Jungle', t_robot:'Robot',
    ready:'\uD83D\uDE80 Empreinte RF pr\u00eate !',
    logCleared:'Effac\u00e9', copied:'Copi\u00e9 !', copyFail:'\u00c9chec',
    filterAll:'Tout', soundEffects:'Effets sonores',
    breathingGuide:'Guide respiratoire', dhikrTap:'Tap', splashHint:'appuyer pour passer',
    langChanged:'\uD83C\uDF10 Langue \u2192 Fran\u00e7ais', themeChanged:'\uD83C\uDFA8 Th\u00e8me \u2192',
    deviceLabel:'Appareil :', capture:'Capturer', store:'Stocker', compare:'Comparer',
    fpDetails:'D\u00e9tails Empreinte', dbHint:'Capturez et stockez pour construire la base.',
    matchFound:'Correspondance !', noMatch:'Aucune correspondance', similarity:'Similarit\u00e9 :',
    guideTitle:'Que vois-je à l\'écran ?',
    guideP1:'Chaque appareil a des variations de fabrication.',
    guideP2:'Cela cr\u00e9e des patterns uniques.',
    guideP3:'En analysant ces patterns, on identifie chaque appareil.',
    dbTitle:'M\u00e9thodes d\'Identification',step1Title:'Configurer',step1Desc:'Configure les paramètres de RF Fingerprinter. Choisis tes réglages à l\'aide des contrôles de la carte principale. Chaque contrôle affecte directement le résultat.',step2Title:'Exécuter',step2Desc:'Appuie sur "Start" pour lancer la simulation. La visualisation se met à jour en temps réel.',step3Title:'Observer',step3Desc:'Étudie la section ci-dessous pour les données détaillées. Les chiffres et graphiques montrent ce qui se passe dans la simulation.',step4Title:'Expérimenter',step4Desc:'Change un paramètre à la fois et relance. Compare les résultats. Essaie des valeurs extrêmes pour découvrir les limites.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que RF Fingerprinter ?',faq_a1:'RF Fingerprinter te permet de simuler renseignement d\'origine électromagnétique. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de renseignement d\'origine électromagnétique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de renseignement d\'origine électromagnétique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF One. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de renseignement d\'origine électromagnétique.',demo_s1:'Bienvenue dans RF Fingerprinter ! Regarde l\'écran principal — c\'est ici que la simulation de renseignement d\'origine électromagnétique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de renseignement d\'origine électromagnétique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne renseignement d\'origine électromagnétique en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de renseignement d\'origine électromagnétique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Code de Démarrage',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6\\nsdr.center_freq = 100e6\\nsdr.gain = 40\\n\\nsamples = sdr.read_samples(256 * 1024)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Pic: {power_dB.max():.1f} dB")\\nsdr.close()',codeExplain:'Ce script Python capture des échantillons IQ depuis un dongle RTL-SDR à 100 MHz. La FFT convertit les échantillons temporels en spectre fréquentiel. La puissance en dB indique l\'intensité — plus c\'est haut, plus le signal est fort.',purpose:'RF Fingerprinter : Capture unique RF patterns. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
  ar: {
    ...LANG_BASE.ar,
    title:'\u0628\u0635\u0645\u0629 RF', subtitle:'\u0628\u0635\u0645\u0629 RF \u2014 \u062A\u0648\u0642\u064A\u0639\u0627\u062A \u0627\u0644\u0623\u062C\u0647\u0632\u0629',
    disconnected:'\u062E\u0627\u0645\u0644', connected:'\u0627\u0644\u062A\u0642\u0627\u0637',
    mainSection:'\u0628\u0635\u0645\u0629 RF', mainDesc:'\u0627\u0644\u062A\u0642\u0627\u0637 \u0623\u0646\u0645\u0627\u0637 RF \u0641\u0631\u064A\u062F\u0629',
    sectionA:'\u0642\u0627\u0639\u062F\u0629 \u0627\u0644\u0628\u0635\u0645\u0627\u062A', sectionB:'\u0643\u064A\u0641 \u062A\u0639\u0645\u0644', sectionC:'\u0637\u0631\u0642 \u0627\u0644\u062A\u0639\u0631\u064A\u0641',
    activityLog:'\u0633\u062C\u0644', eventsMsg:'\u0627\u0644\u0623\u062D\u062F\u0627\u062B',
    clear:'\u0645\u0633\u062D', copy:'\u0646\u0633\u062E', export:'\u062A\u0635\u062F\u064A\u0631', theme:'\u0627\u0644\u0645\u0638\u0647\u0631',
    settings:'\u2699\uFE0F \u0625\u0639\u062F\u0627\u062F\u0627\u062A', language:'\u0627\u0644\u0644\u063A\u0629',
    help:'\u2753 \u0645\u0633\u0627\u0639\u062F\u0629', faq:'\u0623\u0633\u0626\u0644\u0629', howto:'\u0643\u064A\u0641', wiki:'\u0648\u064A\u0643\u064A',
    howto_1:'انظر إلى البطاقة الرئيسية في الأعلى. هذه لوحة التحكم. اضبط المعاملات باستخدام المنزلقات والقوائم. ابدأ بالقيم الافتراضية لرؤية السلوك الطبيعي أولاً.', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.', howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.', howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_fp_title:'\u0628\u0635\u0645\u0629 RF', wiki_fp:'\u062A\u0633\u062A\u062E\u062F\u0645 \u0639\u064A\u0648\u0628 \u0627\u0644\u0639\u062A\u0627\u062F.',
    wiki_use_title:'\u062D\u0627\u0644\u0627\u062A \u0627\u0644\u0627\u0633\u062A\u062E\u062F\u0627\u0645', wiki_use:'\u0643\u0634\u0641 \u0627\u0644\u0623\u062C\u0647\u0632\u0629 \u0627\u0644\u0645\u062E\u0627\u062F\u0639\u0629.',
    working:'\u062C\u0627\u0631\u064D\u2026',
    t_mosque:'\u0645\u0633\u062C\u062F', t_zellige:'\u0632\u0644\u064A\u062C', t_andalus:'\u0623\u0646\u062F\u0644\u0633', t_riad:'\u0631\u064A\u0627\u0636', t_medina:'\u0645\u062F\u064A\u0646\u0629',
    t_space:'\u0641\u0636\u0627\u0621', t_jungle:'\u0623\u062F\u063A\u0627\u0644', t_robot:'\u0631\u0648\u0628\u0648\u062A',
    ready:'\uD83D\uDE80 \u0628\u0635\u0645\u0629 RF \u062C\u0627\u0647\u0632\u0629!',
    logCleared:'\u062A\u0645 \u0627\u0644\u0645\u0633\u062D', copied:'\u062A\u0645!', copyFail:'\u0641\u0634\u0644',
    filterAll:'\u0627\u0644\u0643\u0644', soundEffects:'\u0645\u0624\u062B\u0631\u0627\u062A',
    breathingGuide:'\u062F\u0644\u064A\u0644 \u0627\u0644\u062A\u0646\u0641\u0633', dhikrTap:'\u0627\u0636\u063A\u0637', splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u062E\u0637\u064A',
    langChanged:'\uD83C\uDF10 \u0627\u0644\u0644\u063A\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064A\u0629', themeChanged:'\uD83C\uDFA8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    deviceLabel:'\u0627\u0644\u062C\u0647\u0627\u0632:', capture:'\u0627\u0644\u062A\u0642\u0627\u0637', store:'\u062A\u062E\u0632\u064A\u0646', compare:'\u0645\u0642\u0627\u0631\u0646\u0629',
    fpDetails:'\u062A\u0641\u0627\u0635\u064A\u0644 \u0627\u0644\u0628\u0635\u0645\u0629', dbHint:'\u0627\u0644\u062A\u0642\u0637 \u0648\u062E\u0632\u0646 \u0644\u0628\u0646\u0627\u0621 \u0627\u0644\u0642\u0627\u0639\u062F\u0629.',
    matchFound:'\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631!', noMatch:'\u0644\u0627 \u062A\u0637\u0627\u0628\u0642', similarity:'\u0627\u0644\u062A\u0634\u0627\u0628\u0647:',
    guideTitle:'ماذا أرى على الشاشة؟',
    guideP1:'\u0643\u0644 \u062C\u0647\u0627\u0632 \u0644\u0647 \u062A\u0628\u0627\u064A\u0646\u0627\u062A \u062A\u0635\u0646\u064A\u0639.',
    guideP2:'\u062A\u0633\u0628\u0628 \u0623\u0646\u0645\u0627\u0637 \u0641\u0631\u064A\u062F\u0629.',
    guideP3:'\u064A\u0645\u0643\u0646 \u062A\u0639\u0631\u064A\u0641 \u0643\u0644 \u062C\u0647\u0627\u0632.',
    dbTitle:'\u0637\u0631\u0642 \u0627\u0644\u062A\u0639\u0631\u064A\u0641',step1Title:'إعداد',step1Desc:'اضبط معاملات RF Fingerprinter. اختر إعداداتك باستخدام أدوات التحكم في البطاقة الرئيسية. كل أداة تؤثر مباشرة على نتيجة المحاكاة.',step2Title:'تشغيل',step2Desc:'اضغط "Start" لبدء المحاكاة. شاهد التصور المرئي يتحدث في الوقت الفعلي.',step3Title:'مراقبة',step3Desc:'ادرس القسم أدناه للبيانات التفصيلية. الأرقام والرسوم البيانية تُظهر ما يحدث داخل المحاكاة.',step4Title:'تجريب',step4Desc:'غيّر معاملاً واحداً في كل مرة وأعد التشغيل. قارن النتائج. جرّب قيماً متطرفة لاكتشاف حدود النظام.',sectionCode:'كود الجهاز',faq_q1:'ما هو RF Fingerprinter؟',faq_a1:'RF Fingerprinter يتيح لك محاكاة استخبارات الإشارات. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في استخبارات الإشارات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من استخبارات الإشارات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF One. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من استخبارات الإشارات.',demo_s1:'مرحباً في RF Fingerprinter! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة استخبارات الإشارات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـاستخبارات الإشارات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل استخبارات الإشارات من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم استخبارات الإشارات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كود البداية',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6\\nsdr.center_freq = 100e6\\nsdr.gain = 40\\n\\nsamples = sdr.read_samples(256 * 1024)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak: {power_dB.max():.1f} dB")\\nsdr.close()',codeExplain:'يلتقط هذا الكود عينات IQ من جهاز RTL-SDR على 100 ميغاهرتز. تحويل FFT يحول العينات الزمنية إلى طيف ترددي. القدرة بالديسيبل تُظهر شدة الإشارة.',purpose:'RF Fingerprinter: Capture unique RF patterns. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',learnAge:'العمر:'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=`${s.title} \u2014 Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');buildGuide();buildDatabase();}

/* ═══════ THEMES ═══════ */
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}if(soundEnabled&&audioCtx){const notes=THEME_MELODIES[name];if(notes){const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}}const s=LANG[currentLang];log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}

/* ═══════ TEMPLATE BOILERPLATE ═══════ */
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(rid);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),contents=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));contents.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const tid='help'+n.charAt(0).toUpperCase()+n.slice(1);const tgt=$(tid);if(tgt)tgt.classList.add('active');});});}
function initLogResize(){const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;let dragging=false,startX,startW;handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;document.body.style.cursor='col-resize';e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=startX-e.clientX;const nw=Math.max(200,Math.min(startW+dx,window.innerWidth*0.6));document.documentElement.style.setProperty('--log-width',nw+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;document.body.style.cursor='';});}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){const bands=document.querySelectorAll('.deco-band');breathingActive=!breathingActive;bands.forEach(b=>b.classList.toggle('breathing',breathingActive));}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

/* ═══════════════════════════════════════════════════════════════
   APP-SPECIFIC: RF FINGERPRINTER
   ═══════════════════════════════════════════════════════════════ */

const DEVICES = {
  wifi_ap:   { name:'WiFi Access Point', freq:'2.4 GHz', color:'#3b82f6', harmonics:[3,7,11,17], drift:0.8, transient:15 },
  ble_beacon:{ name:'BLE Beacon',        freq:'2.402 GHz', color:'#8b5cf6', harmonics:[5,9,14,20], drift:1.2, transient:8 },
  zigbee:    { name:'ZigBee Sensor',     freq:'2.405 GHz', color:'#22c55e', harmonics:[4,8,13,19], drift:0.5, transient:12 },
  lora:      { name:'LoRa Module',       freq:'868 MHz', color:'#f59e0b', harmonics:[6,10,16,22], drift:2.0, transient:20 },
  keyfob:    { name:'Car Keyfob',        freq:'433 MHz', color:'#ef4444', harmonics:[2,6,12,18], drift:1.5, transient:10 },
  dect:      { name:'DECT Phone',        freq:'1.88 GHz', color:'#ec4899', harmonics:[3,8,15,21], drift:0.3, transient:6 },
};

let wfCanvas, wfCtx, wfW=780, wfH=200;
let currentFingerprint = null;
let fpDB = [];
let captureAnim = null;

function generateFingerprint(deviceKey) {
  const dev = DEVICES[deviceKey];
  if (!dev) return null;
  const seed = Math.random() * 10000;
  const data = new Float32Array(wfW);
  for (let x = 0; x < wfW; x++) {
    let val = 0;
    // Base carrier
    val += Math.sin(x * 0.05 + seed) * 0.3;
    // Harmonics (unique per device type)
    dev.harmonics.forEach((h, i) => {
      val += Math.sin(x * 0.01 * h + seed * (i + 1)) * (0.2 / (i + 1));
    });
    // Clock drift pattern
    val += Math.sin(x * dev.drift * 0.003 + seed * 0.7) * 0.15;
    // Power transient at start
    if (x < dev.transient) val *= (x / dev.transient);
    // Noise
    val += (Math.random() - 0.5) * 0.1;
    data[x] = val;
  }
  return { deviceKey, deviceName: dev.name, freq: dev.freq, color: dev.color, data, seed, timestamp: Date.now() };
}

function drawWaveform(fp) {
  if (!wfCtx) return;
  wfCtx.fillStyle = '#000';
  wfCtx.fillRect(0, 0, wfW, wfH);
  if (!fp) return;

  // Grid
  wfCtx.strokeStyle = 'rgba(255,255,255,0.05)';
  for (let x = 0; x < wfW; x += 50) { wfCtx.beginPath(); wfCtx.moveTo(x, 0); wfCtx.lineTo(x, wfH); wfCtx.stroke(); }
  for (let y = 0; y < wfH; y += 25) { wfCtx.beginPath(); wfCtx.moveTo(0, y); wfCtx.lineTo(wfW, y); wfCtx.stroke(); }

  // Center line
  wfCtx.beginPath(); wfCtx.strokeStyle='rgba(255,255,255,0.1)'; wfCtx.moveTo(0,wfH/2); wfCtx.lineTo(wfW,wfH/2); wfCtx.stroke();

  // Waveform
  wfCtx.beginPath();
  wfCtx.strokeStyle = fp.color;
  wfCtx.lineWidth = 1.5;
  for (let x = 0; x < wfW; x++) {
    const y = wfH / 2 - fp.data[x] * wfH * 0.4;
    if (x === 0) wfCtx.moveTo(x, y); else wfCtx.lineTo(x, y);
  }
  wfCtx.stroke();

  // Label
  wfCtx.fillStyle = fp.color;
  wfCtx.font = '12px sans-serif';
  wfCtx.fillText(`${fp.deviceName} (${fp.freq})`, 10, 18);
}

function similarity(fp1, fp2) {
  if (!fp1 || !fp2) return 0;
  let sum = 0, n = Math.min(fp1.data.length, fp2.data.length);
  for (let i = 0; i < n; i++) {
    sum += 1 - Math.abs(fp1.data[i] - fp2.data[i]) / 2;
  }
  return sum / n;
}

function doCapture() {
  const dev = $('deviceSelect').value;
  setStatus(true);
  showToast('Capturing...', 1500);
  currentFingerprint = generateFingerprint(dev);
  drawWaveform(currentFingerprint);

  const info = $('fpInfo');
  if (info && currentFingerprint) {
    const d = DEVICES[dev];
    info.innerHTML = `<strong>${d.name}</strong><br>Frequency: ${d.freq}<br>Clock Drift: ${d.drift.toFixed(1)} ppm<br>Transient: ${d.transient} samples<br>Harmonics: ${d.harmonics.join(', ')}<br>Captured: ${new Date().toLocaleTimeString()}`;
  }
  log(`Captured fingerprint: ${DEVICES[dev].name} (${DEVICES[dev].freq})`, 'rx');
  setTimeout(() => setStatus(false), 1000);
}

function doStore() {
  if (!currentFingerprint) { log('No fingerprint to store. Capture first.', 'error'); return; }
  fpDB.push({ ...currentFingerprint, id: fpDB.length + 1 });
  log(`Stored fingerprint #${fpDB.length}: ${currentFingerprint.deviceName}`, 'success');
  updateDBList();
}

function doCompare() {
  if (!currentFingerprint) { log('No fingerprint to compare. Capture first.', 'error'); return; }
  if (fpDB.length === 0) { log('Database empty. Store some fingerprints first.', 'error'); return; }

  let bestMatch = null, bestSim = 0;
  fpDB.forEach(fp => {
    const sim = similarity(currentFingerprint, fp);
    if (sim > bestSim) { bestSim = sim; bestMatch = fp; }
  });

  const mr = $('matchResult');
  const s = LANG[currentLang];
  if (mr) {
    mr.style.display = 'block';
    const pct = (bestSim * 100).toFixed(1);
    if (bestSim > 0.85) {
      mr.innerHTML = `<span style="color:#22c55e;">&#x2713; ${s.matchFound}</span> <strong>${bestMatch.deviceName}</strong> (DB #${bestMatch.id})<br>${s.similarity} <strong>${pct}%</strong>`;
      log(`Match: ${bestMatch.deviceName} (${pct}%)`, 'success');
    } else {
      mr.innerHTML = `<span style="color:#f59e0b;">~ Closest:</span> <strong>${bestMatch.deviceName}</strong> (DB #${bestMatch.id})<br>${s.similarity} <strong>${pct}%</strong> — ${bestSim > 0.7 ? 'Possible match' : s.noMatch}`;
      log(`Closest: ${bestMatch.deviceName} (${pct}%)`, 'info');
    }
  }
}

function updateDBList() {
  const el = $('fpDatabase');
  if (!el) return;
  el.innerHTML = '';
  fpDB.forEach(fp => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:4px 8px;border-radius:8px;background:rgba(0,0,0,.2);border:1px solid var(--border);';
    row.innerHTML = `<span style="width:10px;height:10px;border-radius:50%;background:${fp.color};flex-shrink:0;"></span><span style="flex:1;font-size:.78rem;">#${fp.id} ${fp.deviceName}</span><span style="font-size:.7rem;color:var(--text-muted);">${fp.freq}</span><span style="font-size:.65rem;color:var(--accent);">${new Date(fp.timestamp).toLocaleTimeString()}</span>`;
    el.appendChild(row);
  });
}

function buildGuide() {
  const el = $('fpGuide'); if (!el) return;
  const s = LANG[currentLang];
  el.innerHTML = `<strong>${s.guideTitle}</strong><br><br>${s.guideP1}<br><br>${s.guideP2}<br><br>${s.guideP3}`;
}

function buildDatabase() {
  const el = $('idMethods'); if (!el) return;
  const s = LANG[currentLang];
  const methods = [
    {name:'Clock Skew Analysis', desc:'Measure timestamp drift to identify unique oscillator characteristics'},
    {name:'Transient Analysis', desc:'Capture power-on burst shape unique to each transmitter'},
    {name:'Modulation Imperfections', desc:'Analyze I/Q constellation errors from DAC/mixer non-linearity'},
    {name:'Frequency Offset', desc:'Detect carrier frequency deviation from nominal value'},
    {name:'Spectral Shape', desc:'Compare harmonic patterns and spurious emissions'},
    {name:'Machine Learning', desc:'Train classifiers on multiple features for robust identification'},
  ];
  let html = `<strong>${s.dbTitle}</strong><br><br><div style="display:grid;grid-template-columns:1fr 2fr;gap:4px 8px;"><strong style="font-size:.7rem;">Method</strong><strong style="font-size:.7rem;">Description</strong>`;
  methods.forEach(m => { html += `<span style="color:var(--accent);">${m.name}</span><span style="color:var(--text-muted);">${m.desc}</span>`; });
  html += '</div>';
  el.innerHTML = html;
}

/* Animated waveform */
let animPhase = 0;
function animLoop() {
  if (currentFingerprint) {
    animPhase += 0.02;
    // Add subtle animation to current waveform
    const animFp = { ...currentFingerprint, data: new Float32Array(currentFingerprint.data) };
    for (let i = 0; i < animFp.data.length; i++) {
      animFp.data[i] += Math.sin(i * 0.01 + animPhase) * 0.02;
    }
    drawWaveform(animFp);
  }
  requestAnimationFrame(animLoop);
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw=$('logoWrap'); if(lw) lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog; if(cpb)cpb.onclick=copyLog; if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp; if(hClose)hClose.onclick=closeHelp; if(hOv)hOv.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings; if(sClose)sClose.onclick=closeSettings; if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog; if(lClose)lClose.onclick=closeLog;
  initLogResize();
  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};
  if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect'); if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect'); if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initHijriDate();

  /* App setup */
  wfCanvas = $('waveformCanvas');
  if (wfCanvas) { wfCtx = wfCanvas.getContext('2d'); wfW = wfCanvas.width; wfH = wfCanvas.height; }

  $('captureBtn').onclick = doCapture;
  $('storeBtn').onclick = doStore;
  $('compareBtn').onclick = doCompare;

  buildGuide(); buildDatabase();
  animLoop();
  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — RF Fingerprinter
   Animated spectral fingerprint comparison + harmonic visualizer
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
const rings=[];
function boot(){
  let el=document.getElementById('fpSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='fpSimCanvas';el.width=780;el.height=220;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#06080e;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.02;cx.fillStyle='rgba(6,8,14,.1)';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Draw harmonic bars visualization
  const numBars=48;
  for(let i=0;i<numBars;i++){
    const x=i*(W/numBars),bw=W/numBars-2;
    const h1=Math.abs(Math.sin(i*.3+t*2))*H*.4+Math.sin(i*.7+t*1.3)*H*.15;
    const h2=Math.abs(Math.sin(i*.4+t*1.5+1))*H*.35+Math.cos(i*.5+t)*H*.1;
    cx.fillStyle=`rgba(79,195,247,${.2+Math.abs(Math.sin(i*.2+t))*.3})`;
    cx.fillRect(x+1,H/2-h1,bw,h1);
    cx.fillStyle=`rgba(245,158,11,${.2+Math.abs(Math.cos(i*.3+t))*.3})`;
    cx.fillRect(x+1,H/2,bw,h2);
  }
  // Center label
  cx.fillStyle='rgba(0,0,0,.4)';cx.fillRect(W/2-100,H/2-12,200,24);
  cx.fillStyle=acc;cx.font='11px Orbitron,monospace';cx.textAlign='center';
  cx.fillText('HARMONIC FINGERPRINT ANALYSIS',W/2,H/2+4);
  // Fingerprint rings
  if(Math.random()<.05)rings.push({x:W*.2+Math.random()*W*.6,y:H*.3+Math.random()*H*.4,r:0,maxR:30+Math.random()*40,life:1});
  for(let i=rings.length-1;i>=0;i--){
    const r=rings[i];r.r+=.8;r.life=1-r.r/r.maxR;
    if(r.life<=0){rings.splice(i,1);continue;}
    cx.strokeStyle=`rgba(34,197,94,${r.life*.4})`;cx.lineWidth=1;
    cx.beginPath();cx.arc(r.x,r.y,r.r,0,Math.PI*2);cx.stroke();
  }
  // DB count
  const dbCount=typeof fpDB!=='undefined'?fpDB.length:0;
  cx.fillStyle='rgba(100,200,255,.4)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText(`Fingerprint DB: ${dbCount} entries | Harmonic analysis running`,8,14);
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
