/**
 * Workshop DIY — Bio Muscle Telegraph v1.0
 * EMG to Morse code transmission
 */
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
    ...LANG_BASE.en,title:'Bio Muscle Telegraph',subtitle:'Muscles tap Morse code',disconnected:'Disconnected',connected:'Connected',mainSection:'Muscle Telegraph \u2014 EMG to Morse',mainDesc:'Muscle contractions converted to Morse code',ready:'\ud83d\udcaa Muscle Telegraph ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Attach Sensors',step1Desc:'Place biosensors on the body to measure physiological signals.',step2Title:'Capture Biosignal',step2Desc:'The sensor captures real-time biological data like heart rate or muscle activity.',step3Title:'Process & Modulate',step3Desc:'Biosignal data is processed and converted into a radio-compatible format.',step4Title:'Transmit & Decode',step4Desc:'The bio-encoded signal is transmitted wirelessly and decoded at the receiver.',sectionCode:'Device Code',faq_q1:'What is Bio Muscle Telegraph?',faq_a1:'Bio Muscle Telegraph lets you muscle contractions converted to morse code. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real biomedical signals behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real biomedical signals principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Bio Body Antenna and Bio Brainwave Radio. Each app in this category teaches a different aspect of biomedical signals.',demo_s1:'Welcome to Bio Muscle Telegraph! Look at the main display — this is where the biomedical signals simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "the first section" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of biomedical signals.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how biomedical signals works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches biomedical signals concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Bio Muscle Telegraph?',wiki_concept:'Bio Muscle Telegraph is a technique used in biomedical signals. Muscle contractions converted to Morse code. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Place biosensors on the body to measure physiological signals. Second: The sensor captures real-time biological data like heart rate or muscle activity. The simulation runs these stages in real time, showing you intermediate results at each step. In real biomedical signals, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Bio Muscle Telegraph has practical applications in biomedical signals. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Bio Muscle Telegraph: Muscle contractions converted to Morse code. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Attach Sensors through Capture Biosignal to Process & Modulate and Transmit & Decode.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Analysis" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Bioelectronics',
    wiki_history: 'The field of bioelectronics has evolved significantly over the past century. Early pioneers developed foundational techniques using analog equipment. The digital revolution transformed bioelectronics by enabling software-defined approaches. Modern practitioners use tools like biosensors to perform tasks that once required rooms full of equipment. Understanding this history helps you appreciate why certain protocols and standards exist today.',
    wiki_math_title: '📐 Mathematics Behind Muscle Telegraph',
    wiki_math: 'The mathematics underpinning muscle telegraph involves several key concepts. Signal processing relies on Fourier transforms to convert between time and frequency domains. Information theory (Shannon entropy) determines the theoretical limits of data transmission. Probability and statistics help distinguish real signals from noise. Linear algebra enables matrix operations used in encryption and modulation. Understanding these mathematical foundations lets you predict system behavior before building it.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced bioelectronics practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to bioelectronics. Hardware-based solutions using biosensors offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with bioelectronics: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in bioelectronics.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Bioelectronics carries important ethical and legal responsibilities. Many countries regulate the use of biosensors and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
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
    theory: 'Understanding the theory behind muscle telegraph requires grasping several interconnected concepts from bioelectronics. At the most fundamental level, this technology works by manipulating signals — whether electromagnetic waves, digital data streams, or sensor readings. The simulation in this app models these real-world phenomena using mathematical equations running in your browser. Every button press and slider adjustment maps to a real parameter that engineers and researchers tune in professional settings. The key principle is that information can be encoded, transmitted, processed, and decoded using well-defined mathematical operations. Fourier analysis breaks complex signals into simple sine waves. Shannon information theory tells us the maximum data rate for any communication channel. Error correction codes add redundancy so messages survive noise and interference. By experimenting with this simulation, you build intuition for these principles — the same intuition that professionals develop over years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world bioelectronics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional bioelectronics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use biosensors hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
  fr:{title:'Bio T\u00e9l\u00e9graphe Musculaire',subtitle:'Les muscles tapent du Morse',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'T\u00e9l\u00e9graphe Musculaire \u2014 EMG en Morse',mainDesc:'Contractions musculaires converties en code Morse',ready:'\ud83d\udcaa T\u00e9l\u00e9graphe pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Fixer les capteurs',step1Desc:'Place les biocapteurs sur le corps pour mesurer les signaux physiologiques.',step2Title:'Capturer le biosignal',step2Desc:'Le capteur enregistre les données biologiques en temps réel.',step3Title:'Traiter et moduler',step3Desc:'Les données sont traitées et converties en format radio compatible.',step4Title:'Émettre et décoder',step4Desc:'Le signal bio-encodé est transmis sans fil et décodé au récepteur.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule bio-signals ! 🔬 Tu peux expérimenter avec body signals into radio en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais body signals into radio.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai biometric radio technology ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Bio Nerve Impulse Detector and Bio Heartbeat Cipher ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',
    wiki_history_title: '📜 Histoire de bioélectronique',
    wiki_history: 'Le domaine de bioélectronique a considérablement évolué au cours du siècle dernier. Les pionniers ont développé des techniques fondamentales avec des équipements analogiques. La révolution numérique a transformé le domaine en permettant des approches logicielles. Les praticiens modernes utilisent des outils comme biosensors pour réaliser des tâches qui nécessitaient autrefois des salles entières de matériel. Comprendre cette histoire vous aide à apprécier pourquoi certains protocoles existent.',
    wiki_math_title: '📐 Mathématiques de Muscle Telegraph',
    wiki_math: 'Les mathématiques sous-jacentes impliquent plusieurs concepts clés. Le traitement du signal repose sur les transformées de Fourier. La théorie de information (entropie de Shannon) détermine les limites théoriques. Les probabilités et statistiques distinguent les signaux du bruit. L algèbre linéaire permet les opérations matricielles pour le chiffrement et la modulation. Comprendre ces fondations permet de prédire le comportement du système.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de bioélectronique utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour bioélectronique. Les solutions matérielles avec biosensors offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en bioélectronique : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Bioélectronique implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de biosensors. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
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
    theory: 'Comprendre la théorie derrière cette application nécessite de saisir plusieurs concepts interconnectés de bioelectronics. Au niveau le plus fondamental, cette technologie fonctionne en manipulant des signaux — ondes électromagnétiques, flux de données numériques ou lectures de capteurs. La simulation modélise ces phénomènes réels à l aide d équations mathématiques dans votre navigateur. Chaque bouton et curseur correspond à un paramètre réel que les ingénieurs ajustent en pratique. Le principe clé est que l information peut être encodée, transmise, traitée et décodée avec des opérations mathématiques bien définies. L analyse de Fourier décompose les signaux complexes. La théorie de l information de Shannon indique le débit maximal pour tout canal de communication. Les codes correcteurs ajoutent de la redondance pour que les messages survivent au bruit. En expérimentant avec cette simulation, vous développez une intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec bioelectronics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel biosensors et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
  ar:{title:'\u062a\u0644\u063a\u0631\u0627\u0641 \u0627\u0644\u0639\u0636\u0644\u0627\u062a',subtitle:'\u0627\u0644\u0639\u0636\u0644\u0627\u062a \u062a\u0646\u0642\u0631 \u0634\u0641\u0631\u0629 \u0645\u0648\u0631\u0633',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u062a\u0644\u063a\u0631\u0627\u0641 \u0627\u0644\u0639\u0636\u0644\u0627\u062a \u2014 EMG \u0625\u0644\u0649 \u0645\u0648\u0631\u0633',mainDesc:'\u0627\u0646\u0642\u0628\u0627\u0636\u0627\u062a \u0639\u0636\u0644\u064a\u0629 \u062a\u062a\u062d\u0648\u0644 \u0644\u0634\u0641\u0631\u0629 \u0645\u0648\u0631\u0633',ready:'\ud83d\udcaa \u062a\u0644\u063a\u0631\u0627\u0641 \u0627\u0644\u0639\u0636\u0644\u0627\u062a \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',step1Title:'تثبيت المستشعرات',step1Desc:'ضع المستشعرات الحيوية على الجسم لقياس الإشارات الفسيولوجية.',step2Title:'التقاط الإشارة الحيوية',step2Desc:'يلتقط المستشعر البيانات البيولوجية في الوقت الفعلي.',step3Title:'معالجة وتعديل',step3Desc:'تتم معالجة البيانات وتحويلها إلى صيغة متوافقة مع الراديو.',step4Title:'إرسال وفك تشفير',step4Desc:'يتم بث الإشارة المشفرة حيوياً لاسلكياً وفك تشفيرها.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي bio-signals! 🔬 يمكنك التجربة مع body signals into radio في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج body signals into radio حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا biometric radio technology حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Bio Nerve Impulse Detector and Bio Heartbeat Cipher! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',
    wiki_history_title: '📜 تاريخ الإلكترونيات الحيوية',
    wiki_history: 'تطور مجال الإلكترونيات الحيوية بشكل كبير خلال القرن الماضي. طور الرواد تقنيات أساسية باستخدام معدات تناظرية. حولت الثورة الرقمية المجال من خلال تمكين الأساليب البرمجية. يستخدم الممارسون المعاصرون أدوات مثل biosensors لأداء مهام كانت تتطلب في السابق غرفاً كاملة من المعدات. فهم هذا التاريخ يساعدك على تقدير سبب وجود بروتوكولات ومعايير معينة اليوم.',
    wiki_math_title: '📐 الرياضيات وراء Muscle Telegraph',
    wiki_math: 'تتضمن الرياضيات الكامنة عدة مفاهيم أساسية. تعتمد معالجة الإشارات على تحويلات فورييه للتحويل بين مجالي الزمن والتردد. تحدد نظرية المعلومات (إنتروبيا شانون) الحدود النظرية لنقل البيانات. تساعد الاحتمالات والإحصاء في تمييز الإشارات الحقيقية من الضوضاء. يتيح الجبر الخطي العمليات المصفوفية المستخدمة في التشفير والتعديل.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الإلكترونيات الحيوية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الإلكترونيات الحيوية. توفر الحلول المادية باستخدام biosensors أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الإلكترونيات الحيوية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الإلكترونيات الحيوية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام biosensors والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
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
    theory: 'فهم النظرية الكامنة وراء هذا التطبيق يتطلب استيعاب عدة مفاهيم مترابطة من bioelectronics. على المستوى الأساسي، تعمل هذه التقنية عن طريق التلاعب بالإشارات — سواء كانت موجات كهرومغناطيسية أو تدفقات بيانات رقمية أو قراءات مستشعرات. تحاكي هذه المحاكاة الظواهر الحقيقية باستخدام معادلات رياضية تعمل في متصفحك. كل زر ومنزلق يتوافق مع معامل حقيقي يضبطه المهندسون والباحثون في الإعدادات المهنية. المبدأ الأساسي هو أن المعلومات يمكن ترميزها ونقلها ومعالجتها وفك ترميزها باستخدام عمليات رياضية محددة. يحلل تحليل فورييه الإشارات المعقدة إلى موجات جيبية بسيطة. تحدد نظرية المعلومات لشانون الحد الأقصى لمعدل البيانات. تضيف رموز تصحيح الأخطاء التكرار حتى تنجو الرسائل من الضوضاء والتداخل.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـbioelectronics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة biosensors وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};

const MORSE_MAP={'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---','k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-','u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','0':'-----',' ':'/'};
const MORSE_REV=Object.fromEntries(Object.entries(MORSE_MAP).map(([k,v])=>[v,k]));

let emgRunning=false,emgData=[],morseBuffer='',decodedText='',charCount=0,emgLevel=0;

function initApp(){
  const canvas=$('emgCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=300;
  const W=canvas.width,H=canvas.height;let t=0,flexing=false,flexStart=0;

  function frame(){
    ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(0,0,W,H);t++;
    if(emgRunning){
      const noise=(Math.random()-.5)*30;
      emgLevel=flexing?200+Math.random()*150:noise+15;
      emgData.push(emgLevel);if(emgData.length>W)emgData.shift();
      const se=$('statEMG');if(se)se.textContent=Math.round(Math.abs(emgLevel));
    }
    // Draw EMG trace
    if(emgData.length>1){
      ctx.beginPath();ctx.strokeStyle=emgLevel>100?'#ff6633':'#33ff33';ctx.lineWidth=1.5;
      emgData.forEach((v,i)=>{const x=i,y=H/2-v/400*H;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
      ctx.stroke();
    }
    // Threshold line
    ctx.strokeStyle='rgba(255,204,0,.3)';ctx.setLineDash([6,6]);
    ctx.beginPath();ctx.moveTo(0,H/2-100/400*H);ctx.lineTo(W,H/2-100/400*H);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,H/2+100/400*H);ctx.lineTo(W,H/2+100/400*H);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(255,204,0,.3)';ctx.font='9px Orbitron';ctx.fillText('THRESHOLD',W-80,H/2-100/400*H-5);
    requestAnimationFrame(frame);
  }
  frame();

  const startBtn=$('startBtn'),flexBtn=$('flexBtn'),holdBtn=$('holdBtn'),decodeBtn=$('decodeBtn'),encodeBtn=$('encodeBtn');

  if(startBtn)startBtn.onclick=()=>{emgRunning=!emgRunning;setStatus(emgRunning);log(emgRunning?'EMG started':'EMG stopped','info')};

  if(flexBtn){
    flexBtn.onmousedown=flexBtn.ontouchstart=()=>{if(!emgRunning)return;emgLevel=250;morseBuffer+='.';updateMorse();log('DOT (.)','tx');playSound('click')};
  }
  if(holdBtn){
    holdBtn.onmousedown=holdBtn.ontouchstart=()=>{if(!emgRunning)return;emgLevel=350;morseBuffer+='-';updateMorse();log('DASH (-)','tx');playSound('click')};
  }

  if(decodeBtn)decodeBtn.onclick=()=>{
    if(!morseBuffer){log('No Morse to decode','error');return}
    const words=morseBuffer.split(' / ').map(w=>w.split(' ').map(c=>MORSE_REV[c]||'?').join('')).join(' ');
    decodedText=words;charCount+=words.replace(/ /g,'').length;
    const md=$('morseDisplay'),sc=$('statChars');
    if(md)md.textContent=`${morseBuffer} | ${words.toUpperCase()}`;
    if(sc)sc.textContent=charCount;
    log(`Decoded: ${words.toUpperCase()}`,'success');morseBuffer='';
  };

  if(encodeBtn)encodeBtn.onclick=()=>{
    const msg=($('msgInput')||{}).value||'';if(!msg){log('Enter message','error');return}
    morseBuffer=msg.toLowerCase().split('').map(c=>MORSE_MAP[c]||'').join(' ');
    updateMorse();log(`Encoded: ${morseBuffer}`,'tx');
  };

  // Space key = letter separator, Enter = word separator
  document.addEventListener('keydown',e=>{
    if(!emgRunning)return;
    if(e.code==='Space'&&!e.target.matches('input')){e.preventDefault();morseBuffer+=' ';updateMorse()}
    if(e.code==='Slash'){morseBuffer+=' / ';updateMorse()}
  });

  function updateMorse(){const md=$('morseDisplay');if(md)md.textContent=morseBuffer||'...';}
}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ MUSCLE TELEGRAPH CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootMuscleViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(255,100,50,.12);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- Morse code map --- */
    var MORSE={'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---','k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-','u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..'};
    var MORSE_REV={};Object.keys(MORSE).forEach(function(k){MORSE_REV[MORSE[k]]=k;});

    /* --- state --- */
    var emgBuffer=new Float32Array(W);
    var rectifiedBuffer=new Float32Array(W);
    var morseSymbols=[]; // {type:'dot'|'dash'|'space',time:t}
    var decodedChars=[];
    var currentWord='';
    var isFlexing=false,flexIntensity=0,flexTimer=0;
    var autoMode=true,autoMsg='SOS HELLO WORLD';
    var autoIdx=0,autoSymIdx=0,autoDelay=0;
    var muscleGroups=[
      {name:'Bicep',x:0.22,y:0.42,active:false,emgScale:1.0},
      {name:'Forearm',x:0.28,y:0.58,active:true,emgScale:0.8},
      {name:'Wrist Flex',x:0.32,y:0.68,active:false,emgScale:0.6}
    ];
    var activeMuscle=1;
    var spectrogramData=[];
    var MAX_SPEC=80;

    /* --- arm outline points --- */
    var armTop=[[0.08,0.30],[0.14,0.28],[0.22,0.30],[0.28,0.35],[0.35,0.45],[0.40,0.55],[0.42,0.65],[0.40,0.72]];
    var armBot=[[0.08,0.50],[0.14,0.52],[0.22,0.55],[0.28,0.58],[0.35,0.62],[0.40,0.68],[0.42,0.72]];

    /* scale to arm region */
    var armW=280,armH=300,armOX=10,armOY=200;
    function ax(nx){return armOX+nx*armW;}
    function ay(ny){return armOY+ny*armH;}

    /* --- auto-send morse --- */
    function autoStep(){
      if(!autoMode)return;
      autoDelay-=0.016;
      if(autoDelay>0)return;

      if(autoIdx>=autoMsg.length){autoIdx=0;autoSymIdx=0;}
      var ch=autoMsg[autoIdx].toLowerCase();
      if(ch===' '){
        morseSymbols.push({type:'space',time:t});
        decodedChars.push(' ');
        autoIdx++;autoSymIdx=0;autoDelay=0.6;
        return;
      }
      var code=MORSE[ch];
      if(!code){autoIdx++;autoSymIdx=0;return;}
      if(autoSymIdx>=code.length){
        /* letter done, decode */
        decodedChars.push(ch.toUpperCase());
        autoIdx++;autoSymIdx=0;autoDelay=0.4;
        return;
      }
      var sym=code[autoSymIdx];
      isFlexing=true;
      flexIntensity=sym==='.'?0.6:1.0;
      flexTimer=sym==='.'?0.12:0.35;
      morseSymbols.push({type:sym==='.'?'dot':'dash',time:t});
      autoSymIdx++;autoDelay=sym==='.'?0.25:0.5;
    }

    /* --- draw morse tape --- */
    function drawMorseTape(x,y,w,h){
      ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(x,y,w,h);
      ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.strokeRect(x,y,w,h);

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('MORSE OUTPUT TAPE',x+5,y+12);

      /* draw recent symbols */
      var startIdx=Math.max(0,morseSymbols.length-40);
      var tx=x+10;
      for(var i=startIdx;i<morseSymbols.length;i++){
        var sym=morseSymbols[i];
        if(sym.type==='dot'){
          ctx.fillStyle='#ff6633';ctx.beginPath();ctx.arc(tx,y+h/2+5,4,0,Math.PI*2);ctx.fill();
          tx+=12;
        }else if(sym.type==='dash'){
          ctx.fillStyle='#ff6633';ctx.fillRect(tx-2,y+h/2+1,18,8);
          tx+=24;
        }else{
          tx+=15;
        }
        if(tx>x+w-10)break;
      }

      /* decoded text */
      var decoded=decodedChars.slice(-30).join('');
      ctx.fillStyle='#33ff33';ctx.font='bold 12px Orbitron,monospace';
      ctx.fillText(decoded,x+10,y+h-10);
    }

    /* --- main frame --- */
    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.12)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      /* auto morse stepping */
      autoStep();

      /* flex timer */
      if(flexTimer>0){flexTimer-=0.016;if(flexTimer<=0){isFlexing=false;flexIntensity=0;}}

      /* generate EMG signal */
      var noise=(Math.random()-0.5)*0.08;
      var mg=muscleGroups[activeMuscle];
      var emgVal=isFlexing?(flexIntensity*mg.emgScale*(0.7+Math.random()*0.3)+Math.sin(t*120)*0.15*flexIntensity):noise*0.3;
      var rectVal=Math.abs(emgVal);

      /* shift buffers */
      for(var i=0;i<W-1;i++){emgBuffer[i]=emgBuffer[i+1];rectifiedBuffer[i]=rectifiedBuffer[i+1];}
      emgBuffer[W-1]=emgVal;rectifiedBuffer[W-1]=rectVal;

      /* ---- SECTION 1: Raw EMG (top) ---- */
      var emgY0=0,emgH=H*0.22;
      ctx.save();ctx.beginPath();ctx.rect(0,emgY0,W,emgH);ctx.clip();
      ctx.fillStyle='rgba(6,6,16,0.3)';ctx.fillRect(0,emgY0,W,emgH);

      /* threshold lines */
      ctx.strokeStyle='rgba(255,204,0,0.15)';ctx.setLineDash([4,4]);ctx.lineWidth=0.5;
      var threshY=emgH*0.3;
      ctx.beginPath();ctx.moveTo(0,emgY0+threshY);ctx.lineTo(W,emgY0+threshY);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,emgY0+emgH-threshY);ctx.lineTo(W,emgY0+emgH-threshY);ctx.stroke();
      ctx.setLineDash([]);

      /* draw raw EMG */
      ctx.beginPath();ctx.strokeStyle=isFlexing?'#ff6633':'#33ff33';ctx.lineWidth=1.5;
      for(var i=0;i<W;i++){
        var y=emgY0+emgH/2-emgBuffer[i]*emgH*0.8;
        if(i===0)ctx.moveTo(i,y);else ctx.lineTo(i,y);
      }
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('RAW EMG SIGNAL',10,emgY0+12);
      ctx.fillStyle='rgba(255,204,0,0.3)';ctx.fillText('THRESHOLD',W-70,emgY0+threshY-3);

      /* ---- SECTION 2: Rectified EMG ---- */
      var rectY0=emgH+5,rectH=H*0.13;
      ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(0,rectY0,W,rectH);

      ctx.beginPath();ctx.strokeStyle='#ffcc00';ctx.lineWidth=1.2;
      for(var i=0;i<W;i++){
        var y=rectY0+rectH-rectifiedBuffer[i]*rectH*1.6;
        if(i===0)ctx.moveTo(i,y);else ctx.lineTo(i,y);
      }
      ctx.stroke();
      /* filled area */
      ctx.fillStyle='rgba(255,204,0,0.08)';ctx.beginPath();ctx.moveTo(0,rectY0+rectH);
      for(var i=0;i<W;i++){
        var y=rectY0+rectH-rectifiedBuffer[i]*rectH*1.6;ctx.lineTo(i,y);
      }
      ctx.lineTo(W,rectY0+rectH);ctx.closePath();ctx.fill();

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('RECTIFIED + ENVELOPE',10,rectY0+12);

      /* ---- SECTION 3: EMG Spectrogram ---- */
      var specY0=rectY0+rectH+5,specH=H*0.18;
      /* build spectrum from recent EMG */
      var specRow=[];
      for(var b=0;b<64;b++){
        var freq=b*8;// 0-512Hz
        var amp=0.02;
        if(isFlexing){
          /* EMG spectrum: broad 20-150Hz with peaks at muscle firing freq */
          amp+=Math.exp(-(freq-80)*(freq-80)/3000)*flexIntensity*0.5;
          amp+=Math.exp(-(freq-40)*(freq-40)/1000)*flexIntensity*0.3;
          amp+=Math.random()*0.05*flexIntensity;
        }
        amp+=Math.random()*0.02;
        specRow.push(Math.min(1,amp));
      }
      spectrogramData.push(specRow);
      if(spectrogramData.length>MAX_SPEC)spectrogramData.shift();

      var cellW=W/64,cellH=specH/MAX_SPEC;
      for(var row=0;row<spectrogramData.length;row++){
        for(var col=0;col<64;col++){
          var v=spectrogramData[row][col];
          var r=Math.min(255,v*600)|0;
          var g=Math.min(255,Math.max(0,(v-0.15)*500))|0;
          var bl=Math.max(0,(0.5-v)*200)|0;
          ctx.fillStyle='rgb('+r+','+g+','+bl+')';
          ctx.fillRect(col*cellW,specY0+row*cellH,cellW+0.5,cellH+0.5);
        }
      }
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('EMG SPECTROGRAM (0-512Hz)',10,specY0+12);

      /* ---- SECTION 4: Bottom — Arm + Morse ---- */
      var botY=specY0+specH+8;

      /* ---- Arm diagram (left) ---- */
      var armRegW=W*0.38;
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(0,botY,armRegW,H-botY);

      /* arm outline */
      ctx.strokeStyle='rgba(0,200,255,0.2)';ctx.lineWidth=1.5;
      ctx.beginPath();
      armTop.forEach(function(p,i){var x=p[0]*armRegW*2+10,y=botY+(p[1]-0.25)*300;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
      ctx.stroke();
      ctx.beginPath();
      armBot.forEach(function(p,i){var x=p[0]*armRegW*2+10,y=botY+(p[1]-0.25)*300;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
      ctx.stroke();

      /* muscle groups / electrodes */
      muscleGroups.forEach(function(mg2,idx){
        var ex=mg2.x*armRegW*2+10,ey=botY+(mg2.y-0.25)*300;
        var isAct=idx===activeMuscle;

        /* electrode */
        ctx.beginPath();ctx.arc(ex,ey,isAct?8:5,0,Math.PI*2);
        ctx.fillStyle=isAct?(isFlexing?'#ff6633':'#33ff33')+'88':'rgba(100,100,200,0.3)';
        ctx.fill();ctx.strokeStyle=isAct?'#fff':'rgba(255,255,255,0.2)';ctx.lineWidth=1;ctx.stroke();

        /* EMG burst animation */
        if(isAct&&isFlexing){
          for(var r=0;r<2;r++){
            var rad=12+r*10+Math.sin(t*8)*4;
            ctx.beginPath();ctx.arc(ex,ey,rad,0,Math.PI*2);
            ctx.strokeStyle='rgba(255,100,50,'+(0.3-r*0.12)+')';ctx.stroke();
          }
        }

        ctx.fillStyle=isAct?'#fff':'rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
        ctx.fillText(mg2.name,ex+12,ey+3);
      });

      /* muscle contraction visualization */
      if(isFlexing){
        var mx=muscleGroups[activeMuscle].x*armRegW*2+10;
        var my=botY+(muscleGroups[activeMuscle].y-0.25)*300;
        /* fiber lines */
        ctx.strokeStyle='rgba(255,100,50,0.15)';ctx.lineWidth=0.5;
        for(var f=0;f<8;f++){
          var fy=my-20+f*5;
          var contraction=Math.sin(t*30+f)*3*flexIntensity;
          ctx.beginPath();ctx.moveTo(mx-25,fy);
          for(var fx=mx-25;fx<mx+25;fx+=3){
            ctx.lineTo(fx,fy+Math.sin((fx+t*50)*0.3)*contraction);
          }
          ctx.stroke();
        }
      }

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('MUSCLE ELECTRODE MAP',10,botY+12);

      /* ---- Morse tape (right) ---- */
      drawMorseTape(armRegW+10,botY,W-armRegW-20,H-botY-5);

      /* ---- Morse code reference (small) ---- */
      var refX=armRegW+20,refY=botY+45;
      ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('A .-  B -...  C -.-.  D -..  E .  F ..-.',refX,refY);
      ctx.fillText('G --.  H ....  I ..  J .---  K -.-  L .-..',refX,refY+11);
      ctx.fillText('S ...  O ---  SPACE = /  DOT=short  DASH=long',refX,refY+22);

      /* ---- HUD ---- */
      ctx.strokeStyle='rgba(255,100,50,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl=18;ctx.strokeStyle='rgba(255,100,50,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl,c[1]);ctx.stroke();
      });

      /* flex indicator */
      if(isFlexing){
        ctx.fillStyle='rgba(255,100,50,'+(0.5+Math.sin(t*10)*0.3)+')';
        ctx.beginPath();ctx.arc(W-20,14,5,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#ff6633';ctx.font='9px Orbitron,monospace';ctx.fillText('FLEX',W-60,17);
      }else{
        ctx.fillStyle='rgba(0,255,100,0.4)';ctx.beginPath();ctx.arc(W-20,14,3,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';ctx.fillText('IDLE',W-55,17);
      }

      /* divider lines */
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(0,emgH);ctx.lineTo(W,emgH);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,rectY0);ctx.lineTo(W,rectY0);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,specY0);ctx.lineTo(W,specY0);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,botY-3);ctx.lineTo(W,botY-3);ctx.stroke();

      requestAnimationFrame(frame);
    }

    /* click to switch muscle groups */
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(W/rect.width);
      var my=(e.clientY-rect.top)*(H/rect.height);
      var armRegW=W*0.38;
      var botY=H*0.22+5+H*0.13+5+H*0.18+8;
      muscleGroups.forEach(function(mg2,idx){
        var ex=mg2.x*armRegW*2+10,ey=botY+(mg2.y-0.25)*300;
        var dist=Math.sqrt((mx-ex)*(mx-ex)+(my-ey)*(my-ey));
        if(dist<20)activeMuscle=idx;
      });
    });

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootMuscleViz);
  else setTimeout(bootMuscleViz,200);
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
