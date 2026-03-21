/**
 * Length Extension Lab — Workshop DIY v1.0
 * Demonstrate length extension attack on Merkle-Damgard hashes
 */
const $=id=>document.getElementById(id);
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
  ,
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
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

const LANG={en:{
    ...LANG_BASE.en,title:'Length Extension Lab',subtitle:'Exploit Merkle-Damgard hash to forge MACs',mainSection:'Length Extension Attack',mainDesc:'Forge valid MAC by extending known hash without the secret',computeMAC:'Compute MAC',forgeMAC:'Forge Extended MAC',results:'Results',vizTitle:'Merkle-Damgard Visualization',vizHint:'See how the hash chain allows extension',sectionA:'Attack Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',macComputed:'MAC computed',forged:'MAC forged successfully!',howto_1:'The main display shows the Length Extension Lab simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for Length Extension Lab. Choose yo',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Attack Reference" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',wiki_md:'ميركل-دامغارد: معالجة بالكتل، سلسلة مخرجات الضغط. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_ext:'التمديد: استخدام مخرج التجزئة كحالة أولية. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_hmac:'HMAC: تجزئتان متداخلتان تمنعان التمديد. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',mathExplain:'Length Extension Attack:\n\nGiven: MAC = H(secret || message)\nKnown: len(secret), message, MAC\nGoal: compute H(secret || message || padding || append)\n\nSteps:\n1. Reconstruct padding for (secret || message)\n2. Set hash internal state = MAC value\n3. Continue hashing: H_state(append)\n4. Result = valid MAC for extended message\n\nPadding (MD): message || 0x80 || 0x00...00 || length_bits',step1Title:'Set Up',step1Desc:'Configure the parameters for Length Extension Lab. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Attack Reference" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Math Deep Dive". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is Length Extension Lab?',faq_a1:'Length Extension Lab is an interactive simulation that demonstrates crypto attacks concepts. Forge valid MAC by extending known hash without the secret. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real cryptography behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real cryptography principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to Length Extension Lab! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Enter original message. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Attack Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Length Extension Lab! This is like a science experiment on your computer. You get to control a real crypto attacks simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for Length Extension Lab. Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32)  # 32 bytes = 256 bits\\niv = os.urandom(16)   # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key:        {key.hex()}")\\nprint(f"IV:         {iv.hex()}")\\nprint(f"Plaintext:  {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered:  {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',wiki_concept_title:'🔬 What is Length Extension Lab?',wiki_concept:'Length Extension Lab is a technique used in cryptography. Forge valid MAC by extending known hash without the secret. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the parameters for Length Extension Lab. Choose your input settings using the controls in the main card. Each control directly affects the simulation output. Second: Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs. The simulation runs these stages in real time, showing you intermediate results at each step. In real cryptography, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Length Extension Lab has practical applications in cryptography. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Length Extension Lab: Forge valid MAC by extending known hash without the secret. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Choose Algorithm through Set Up Attack to Execute Attack and Analyze Results.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Attack Reference" and "Math Deep Dive" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Reverse Engineering',
    wiki_history: 'MD5 (1992) was broken by 2004. SHA-1 (1995) was deprecated in 2017. SHA-256 and SHA-3 (Keccak) are current standards. Length Extension Lab builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Length Extension Lab',
    wiki_math: 'The mathematics behind Length Extension Lab: Birthday paradox: collision probability exceeds 50% after ~2^(n/2) hashes, not 2^n. For SHA-256, that is 2^128 — still computationally infeasible. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced reverse engineering practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to reverse engineering. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with reverse engineering: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in reverse engineering.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Reverse Engineering carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Collision',
    gloss1_def: 'When two different inputs produce the same hash output. A secure hash function makes finding collisions computationally infeasible (requires ~2^(n/2) attempts).',
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
    theory: 'Length Extension Lab demonstrates key principles from crypto attacks. Cryptographic hash functions map arbitrary data to fixed-size digests. They must be one-way (irreversible), collision-resistant, and avalanche (small input change → big output change). Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world reverse engineering?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional reverse engineering systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Anti-Drone RF System',related1_desc:'Detect, track, and neutralize drones via RF jamming',related1_path:'../../54-rf-warfare/rfw-anti-drone-system/index.html',related2_name:'Directed Energy Simulator',related2_desc:'High-power RF beam simulation and phased array steering',related2_path:'../../54-rf-warfare/rfw-directed-energy-sim/index.html',related3_name:'Remote Station Dashboard',related3_desc:'Full remote antenna operation and control station',related3_path:'../../38-pi-antenna/pi-remote-antenna-station/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'KPA Key Recovery',pathPrev_path:'../../53-crypto-attacks/cry-known-plaintext-attack/index.html',pathNext_name:'Meet-in-the-Middle Attack',pathNext_path:'../../53-crypto-attacks/cry-meet-in-middle-lab/index.html',
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What is public key cryptography?',quiz_q1a:'Using same key for encrypt/decrypt',quiz_q1b:'Using a key pair (public and private)',quiz_q1c:'No keys needed',quiz_q1d:'Password-based only',quiz_q1_answer:'1',quiz_q2:'What does AI stand for?',quiz_q2a:'Automated Input',quiz_q2b:'Artificial Intelligence',quiz_q2c:'Analog Interface',quiz_q2d:'Active Integration',quiz_q2_answer:'1',quiz_q3:'What is a hash function?',quiz_q3a:'Encryption method',quiz_q3b:'One-way function producing fixed-size output',quiz_q3c:'Compression algorithm',quiz_q3d:'Random number generator',quiz_q3_answer:'1',quiz_q4:'What does RSA stand for?',quiz_q4a:'Random Secure Algorithm',quiz_q4b:'Rivest-Shamir-Adleman',quiz_q4c:'Rapid Signal Authentication',quiz_q4d:'Radio Security Architecture',quiz_q4_answer:'1',quiz_q5:'What is a neural network?',quiz_q5a:'Physical wires',quiz_q5b:'Computing system inspired by biological neurons',quiz_q5c:'Social network',quiz_q5d:'Radio network',quiz_q5_answer:'1'},
fr:{title:'Labo Extension de Longueur',subtitle:'Exploitez Merkle-Damgard pour forger des MACs',mainSection:'Attaque Extension de Longueur',mainDesc:'Forgez un MAC valide en etendant un condensat connu',computeMAC:'Calculer MAC',forgeMAC:'Forger MAC Etendu',results:'Resultats',vizTitle:'Visualisation Merkle-Damgard',vizHint:'Voyez comment la chaine permet l\'extension',sectionA:'Reference',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',macComputed:'MAC calcule',forged:'MAC forge avec succes!',howto_1:'L écran principal affiche la simulation Length Extension Lab. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for Length Extension Lab. Choose yo',howto_2:'Cliquez Calculer MAC.',howto_3:'Entrez les donnees a ajouter.',howto_4:'Cliquez Forger.',wiki_md:'Merkle-Damgard: traite par blocs, chaine les sorties.',wiki_ext:'Extension: utilise le hash comme etat initial, continue le hachage.',wiki_hmac:'HMAC: deux hachages imbriques empechent l\'extension.',mathExplain:'Attaque Extension de Longueur:\nDonne: MAC = H(secret || message)\nBut: H(secret || message || padding || ajout)',step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Length Extension Lab est une simulation interactive qui démontre les concepts de attaques crypto. Forge valid MAC by extending known hash without the secret. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Timing Oracle Attack and Cry Meet In Middle Lab ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 Histoire de rétro-ingénierie',
    wiki_history: 'MD5 (1992) was broken by 2004. SHA-1 (1995) was deprecated in 2017. SHA-256 and SHA-3 (Keccak) are current standards. Length Extension Lab s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Length Extension Lab',
    wiki_math: 'Les mathématiques derrière Length Extension Lab : Birthday paradox: collision probability exceeds 50% after ~2^(n/2) hashes, not 2^n. For SHA-256, that is 2^128 — still computationally infeasible. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de rétro-ingénierie utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour rétro-ingénierie. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en rétro-ingénierie : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Rétro-ingénierie implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Collision',
    gloss1_def: 'When two different inputs produce the same hash output. A secure hash function makes finding collisions computationally infeasible (requires ~2^(n/2) attempts).',
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
    theory: 'Length Extension Lab démontre les principes clés de attaques crypto. Cryptographic hash functions map arbitrary data to fixed-size digests. They must be one-way (irreversible), collision-resistant, and avalanche (small input change → big output change). Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec reverse engineering dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Systeme RF Anti-Drone',related1_desc:'Detecter, suivre et neutraliser les drones',related1_path:'../../54-rf-warfare/rfw-anti-drone-system/index.html',related2_name:'Simulateur Energie Dirigee',related2_desc:'Simulation faisceau RF haute puissance',related2_path:'../../54-rf-warfare/rfw-directed-energy-sim/index.html',related3_name:'Tableau de bord station distante',related3_desc:'Station de contrôle et d\\',related3_path:'../../38-pi-antenna/pi-remote-antenna-station/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Recuperation de Cle',pathPrev_path:'../../53-crypto-attacks/cry-known-plaintext-attack/index.html',pathNext_name:'Attaque par le Milieu',pathNext_path:'../../53-crypto-attacks/cry-meet-in-middle-lab/index.html',
    printBtn: '🖨️ Imprimer'},
ar:{title:'مختبر تمديد الطول',subtitle:'استغل بنية ميركل-دامغارد لتزوير MACs',mainSection:'هجوم تمديد الطول',mainDesc:'زوّر MAC صالح بتمديد تجزئة معروفة بدون السر',computeMAC:'حساب MAC',forgeMAC:'تزوير MAC ممتد',results:'النتائج',vizTitle:'تصور ميركل-دامغارد',vizHint:'شاهد كيف تسمح السلسلة بالتمديد',sectionA:'مرجع',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',macComputed:'تم حساب MAC',forged:'تم تزوير MAC بنجاح!',howto_1:'تعرض الشاشة الرئيسية محاكاة Length Extension Lab. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for Length Extension Lab. Choose yo',howto_2:'اضغط حساب MAC.',howto_3:'أدخل البيانات المراد إضافتها.',howto_4:'اضغط تزوير.',wiki_md:'ميركل-دامغارد: معالجة بالكتل، سلسلة مخرجات الضغط.',wiki_ext:'التمديد: استخدام مخرج التجزئة كحالة أولية.',wiki_hmac:'HMAC: تجزئتان متداخلتان تمنعان التمديد.',mathExplain:'هجوم تمديد الطول:\nمعطى: MAC = H(سر || رسالة)\nالهدف: H(سر || رسالة || حشو || إضافة)',step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Length Extension Lab هي محاكاة تفاعلية توضح مفاهيم هجمات التشفير. Forge valid MAC by extending known hash without the secret. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Timing Oracle Attack and Cry Meet In Middle Lab! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 تاريخ الهندسة العكسية',
    wiki_history: 'MD5 (1992) was broken by 2004. SHA-1 (1995) was deprecated in 2017. SHA-256 and SHA-3 (Keccak) are current standards. يبني Length Extension Lab على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Length Extension Lab',
    wiki_math: 'الرياضيات وراء Length Extension Lab: Birthday paradox: collision probability exceeds 50% after ~2^(n/2) hashes, not 2^n. For SHA-256, that is 2^128 — still computationally infeasible. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الهندسة العكسية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الهندسة العكسية. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الهندسة العكسية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الهندسة العكسية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Collision',
    gloss1_def: 'When two different inputs produce the same hash output. A secure hash function makes finding collisions computationally infeasible (requires ~2^(n/2) attempts).',
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
    theory: 'Length Extension Lab يوضح المبادئ الأساسية في هجمات التشفير. Cryptographic hash functions map arbitrary data to fixed-size digests. They must be one-way (irreversible), collision-resistant, and avalanche (small input change → big output change). Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـreverse engineering في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'\\u0646\\u0638\\u0627\\u0645 RF \\u0645\\u0636\\u0627\\u062f \\u0644\\u0644\\u0637\\u0627\\u0626\\u0631\\u0627\\u062a',related1_desc:'\\u0643\\u0634\\u0641 \\u0648\\u062a\\u062a\\u0628\\u0639 \\u0648\\u062a\\u062d\\u064a\\u064a\\u062f \\u0627\\u0644\\u0637\\u0627\\u0626\\u0631\\u0627\\u062a \\u0628\\u062f\\u0648\\u0646 \\u0637\\u064a\\u0627\\u0631',related1_path:'../../54-rf-warfare/rfw-anti-drone-system/index.html',related2_name:'\\u0645\\u062d\\u0627\\u0643\\u064a \\u0627\\u0644\\u0637\\u0627\\u0642\\u0629 \\u0627\\u0644\\u0645\\u0648\\u062c\\u0647\\u0629',related2_desc:'\\u0645\\u062d\\u0627\\u0643\\u0627\\u0629 \\u062d\\u0632\\u0645\\u0629 RF \\u0639\\u0627\\u0644\\u064a\\u0629 \\u0627\\u0644\\u0637\\u0627\\u0642\\u0629',related2_path:'../../54-rf-warfare/rfw-directed-energy-sim/index.html',related3_name:'لوحة تحكم المحطة البعيدة',related3_desc:'محطة تحكم وتشغيل هوائي عن بعد كاملة',related3_path:'../../38-pi-antenna/pi-remote-antenna-station/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'استرجاع المفتاح',pathPrev_path:'../../53-crypto-attacks/cry-known-plaintext-attack/index.html',pathNext_name:'هجوم اللقاء في المنتصف',pathNext_path:'../../53-crypto-attacks/cry-meet-in-middle-lab/index.html',
    printBtn: '🖨️ طباعة'}};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});

function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;if($('langSelect'))$('langSelect').value=l;try{localStorage.setItem('cry-le-lang',l)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));if($('themeSelect'))$('themeSelect').value=n;try{localStorage.setItem('cry-le-theme',n)}catch{}}
let soundEnabled=false;function playSound(t){if(!soundEnabled)return;const a=new(window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);g.gain.value=.08;o.frequency.value=t==='success'?523:200;g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.2);o.start();o.stop(a.currentTime+.2)}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success')}
function showToast(m){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(p,o){p.classList.toggle('open');if(o)o.classList.toggle('active',p.classList.contains('open'))}

/* ═══════ SIMPLIFIED HASH (Merkle-Damgard-like) ═══════ */
const SECRET='mysecretkey';let originalMAC=null,blocks=[],forgedBlocks=[];
function simpleHash(data,initState=0x67452301){let h=initState;const bs=[];for(let i=0;i<data.length;i++){h=((h<<5)+h+data.charCodeAt(i))>>>0;if((i+1)%8===0||i===data.length-1)bs.push({block:data.slice(Math.max(0,i-7),i+1),state:h})}return{hash:h,blocks:bs}}
function computeMAC(){const msg=$('msgInput').value;const fullMsg=SECRET+msg;const result=simpleHash(fullMsg);originalMAC=result.hash;blocks=result.blocks;
  const s=LANG[currentLang];log(s.macComputed,'success');
  $('resultsBox').textContent=`Original Message: "${msg}"\nMAC = H(secret || msg) = 0x${originalMAC.toString(16).padStart(8,'0')}\nSecret length: ${SECRET.length} (unknown to attacker)\nBlocks processed: ${blocks.length}`;drawCanvas()}

function forgeMAC(){if(!originalMAC){computeMAC()}const append=$('appendInput').value;const padding='\x80'+'\x00'.repeat(7);
  const extResult=simpleHash(padding+append,originalMAC);forgedBlocks=extResult.blocks;
  const forgedHash=extResult.hash;
  // Verify: compute actual hash of full extended message
  const fullExtended=SECRET+$('msgInput').value+padding+append;const verify=simpleHash(fullExtended);
  const s=LANG[currentLang];
  $('resultsBox').textContent+=`\n\n--- LENGTH EXTENSION ATTACK ---\nAppended data: "${append}"\nForged MAC: 0x${forgedHash.toString(16).padStart(8,'0')}\nVerification: 0x${verify.hash.toString(16).padStart(8,'0')}\nMatch: ${forgedHash===verify.hash?'YES - FORGED!':'NO'}\n\nAttacker created valid MAC for:\n"${$('msgInput').value}${padding}${append}"\nwithout knowing the secret!`;
  log(s.forged,'success');drawCanvas()}

const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawCanvas(){if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),text=getCS('--text'),muted=getCS('--text-muted');ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText('Merkle-Damgard Hash Chain',10,22);
  // Draw original chain
  if(blocks.length>0){ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Original: H(secret || message)',10,45);
    const bw=Math.min(80,(w-40)/(blocks.length+1)),by=60,bh=50;
    // IV
    ctx.fillStyle='#4ade8033';ctx.fillRect(10,by,bw-4,bh);ctx.fillStyle='#4ade80';ctx.font='9px monospace';ctx.fillText('IV',14,by+15);ctx.fillText('0x67452301',14,by+30);
    blocks.forEach((b,i)=>{const x=10+(i+1)*bw;ctx.strokeStyle=accent;ctx.beginPath();ctx.moveTo(x-4,by+bh/2);ctx.lineTo(x,by+bh/2);ctx.stroke();
      ctx.fillStyle=i<blocks.length-1?`${accent}33`:'#f8717133';ctx.fillRect(x,by,bw-4,bh);ctx.fillStyle=i<blocks.length-1?accent:'#f87171';ctx.font='8px monospace';ctx.fillText(b.block.slice(0,8),x+2,by+15);ctx.fillText('0x'+b.state.toString(16).padStart(8,'0'),x+2,by+35)})}
  // Draw forged extension
  if(forgedBlocks.length>0){const fy=140;ctx.fillStyle='#f87171';ctx.font='10px Tajawal';ctx.fillText('Forged Extension: resume from MAC state',10,fy-5);
    const bw=Math.min(80,(w-40)/(forgedBlocks.length+1)),bh=50;
    ctx.fillStyle='#f8717133';ctx.fillRect(10,fy,bw-4,bh);ctx.fillStyle='#f87171';ctx.font='9px monospace';ctx.fillText('MAC state',14,fy+15);ctx.fillText('0x'+originalMAC.toString(16).padStart(8,'0'),14,fy+35);
    forgedBlocks.forEach((b,i)=>{const x=10+(i+1)*bw;ctx.strokeStyle='#f87171';ctx.beginPath();ctx.moveTo(x-4,fy+bh/2);ctx.lineTo(x,fy+bh/2);ctx.stroke();
      ctx.fillStyle='#f8717133';ctx.fillRect(x,fy,bw-4,bh);ctx.fillStyle='#f87171';ctx.font='8px monospace';ctx.fillText(b.block.slice(0,8),x+2,fy+15);ctx.fillText('0x'+b.state.toString(16).padStart(8,'0'),x+2,fy+35)})}
  // Explanation
  ctx.fillStyle=muted;ctx.font='11px Tajawal';ctx.fillText('The attacker uses the MAC output as the new initial state,',10,h-40);ctx.fillText('then continues hashing with the appended data.',10,h-24)}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'Merkle-Damgard',p:s.wiki_md},{t:'Extension',p:s.wiki_ext},{t:'HMAC Defense',p:s.wiki_hmac}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'Merkle-Damgard',p:LANG[currentLang].wiki_md},{t:'Extension',p:LANG[currentLang].wiki_ext},{t:'HMAC',p:LANG[currentLang].wiki_hmac}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}
document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-le-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-le-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};$('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  $('hashBtn').onclick=computeMAC;$('forgeBtn').onclick=forgeMAC;
  buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()});

/* ═══════ ENHANCED LENGTH EXTENSION VISUALIZATION (IIFE) ═══════ */
(function(){
const _c=document.createElement('canvas');
_c.style.cssText='width:100%;height:340px;border-radius:12px;margin-top:12px;display:block;background:rgba(0,0,0,.12)';
const vizS=document.querySelector('.visualization-section')||document.querySelector('.card');
if(vizS)vizS.appendChild(_c);
const _x=_c.getContext('2d');
let _t=0;

function _rs(){const r=_c.getBoundingClientRect();_c.width=r.width*devicePixelRatio;_c.height=r.height*devicePixelRatio;_x.scale(devicePixelRatio,devicePixelRatio)}
window.addEventListener('resize',_rs);_rs();
function _gc(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function draw(){
  const w=_c.getBoundingClientRect().width,h=_c.getBoundingClientRect().height;
  const acc=_gc('--accent'),mut=_gc('--text-muted'),txt=_gc('--text');
  _x.clearRect(0,0,w,h);_t++;

  // === Merkle-Damgard Architecture (top) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Merkle-Damgard Hash Construction',10,16);

  const nBlocks=7,bW=Math.min(85,(w-60)/(nBlocks+1)),bH=30,bY=30;
  // IV
  _x.fillStyle='#c084fc33';_x.fillRect(5,bY,bW*0.6,bH);_x.strokeStyle='#c084fc66';_x.strokeRect(5,bY,bW*0.6,bH);
  _x.fillStyle='#c084fc';_x.font='bold 8px SF Mono';_x.textAlign='center';_x.fillText('IV',5+bW*0.3,bY+12);
  const animState=(0x67452301+_t*137)>>>0;
  _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText(`0x${(animState&0xFFFF).toString(16)}`,5+bW*0.3,bY+24);_x.textAlign='left';

  for(let i=0;i<nBlocks;i++){
    const x=5+bW*0.6+5+i*bW;
    const isSecret=i<2;
    const isMsg=i>=2&&i<5;
    const isPad=i===5;
    const isExt=i===6;
    const color=isSecret?'#f87171':isMsg?'#4ade80':isPad?'#fbbf24':'#c084fc';

    // Compression function box
    _x.fillStyle=color+'22';_x.fillRect(x,bY,bW-5,bH);_x.strokeStyle=color+'66';_x.strokeRect(x,bY,bW-5,bH);

    // Arrow from previous
    _x.strokeStyle=color+'88';_x.beginPath();_x.moveTo(x-5,bY+bH/2);_x.lineTo(x,bY+bH/2);_x.stroke();
    _x.fillStyle=color;_x.beginPath();_x.moveTo(x,bY+bH/2);_x.lineTo(x-4,bY+bH/2-3);_x.lineTo(x-4,bY+bH/2+3);_x.fill();

    // Block label
    _x.fillStyle=color;_x.font='bold 7px SF Mono';_x.textAlign='center';
    const label=isSecret?`SECRET[${i}]`:isMsg?`MSG[${i-2}]`:isPad?'PAD':'EXTEND';
    _x.fillText(label,x+bW/2-2.5,bY+12);

    // State value
    const state=((_t*31+i*0x9E3779B9)>>>0)&0xFFFF;
    _x.fillStyle=mut;_x.font='7px SF Mono';
    _x.fillText(`h=${state.toString(16)}`,x+bW/2-2.5,bY+24);
    _x.textAlign='left';

    // Input from top (message block)
    _x.strokeStyle=color+'44';
    _x.beginPath();_x.moveTo(x+bW/2-2.5,bY-5);_x.lineTo(x+bW/2-2.5,bY);_x.stroke();
    _x.fillStyle=color+'33';_x.fillRect(x+5,bY-18,bW-15,13);
    _x.fillStyle=color;_x.font='6px SF Mono';_x.textAlign='center';
    _x.fillText(isSecret?'[secret]':isMsg?`m${i-2}`:'pad/ext',x+bW/2-2.5,bY-9);_x.textAlign='left';
  }

  // Output label
  const outX=5+bW*0.6+5+nBlocks*bW;
  _x.fillStyle='#f87171';_x.font='bold 9px SF Mono';
  _x.fillText('MAC',outX,bY+18);

  // === Attack Anatomy (middle) ===
  const aaY=bY+bH+30;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Length Extension Attack Steps',10,aaY);

  const attackSteps=[
    {step:'1',desc:'Attacker knows: H(secret || msg), len(secret), msg',color:'#60a5fa'},
    {step:'2',desc:'Reconstruct padding: msg || 0x80 || zeros || length',color:'#fbbf24'},
    {step:'3',desc:'Set internal state = known MAC output value',color:'#f87171'},
    {step:'4',desc:'Continue hashing: H_state(appended_data)',color:'#c084fc'},
    {step:'5',desc:'Result = valid MAC for (secret||msg||pad||append)',color:'#4ade80'}
  ];

  attackSteps.forEach((s,i)=>{
    const y=aaY+10+i*20;
    const isActive=Math.floor(_t/50)%attackSteps.length===i;
    _x.fillStyle=isActive?s.color+'33':'rgba(255,255,255,.02)';
    _x.fillRect(10,y,w*0.48-5,18);
    _x.fillStyle=isActive?s.color:mut;_x.font='9px SF Mono';
    _x.fillText(`[${s.step}] ${s.desc}`,14,y+13);
    if(isActive){
      _x.fillStyle=s.color;
      _x.beginPath();_x.arc(w*0.48,y+9,3,0,Math.PI*2);_x.fill();
    }
  });

  // === Vulnerable vs Immune Hashes (middle-right) ===
  const vhX=w*0.52,vhY=aaY;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Hash Function Vulnerability',vhX,vhY);

  const hashes=[
    {name:'MD5',bits:128,vulnerable:true,broken:true},
    {name:'SHA-1',bits:160,vulnerable:true,broken:true},
    {name:'SHA-256',bits:256,vulnerable:true,broken:false},
    {name:'SHA-512',bits:512,vulnerable:true,broken:false},
    {name:'SHA-3',bits:256,vulnerable:false,broken:false},
    {name:'BLAKE2',bits:256,vulnerable:false,broken:false},
    {name:'HMAC-*',bits:0,vulnerable:false,broken:false}
  ];

  const hhW=w*0.46,hhBarW=hhW-80;
  hashes.forEach((hf,i)=>{
    const y=vhY+10+i*16;
    _x.fillStyle=hf.vulnerable?'#f8717122':'#4ade8022';
    _x.fillRect(vhX,y,hhW,14);
    _x.fillStyle=hf.vulnerable?(hf.broken?'#f87171':'#fbbf24'):'#4ade80';
    _x.font='bold 8px SF Mono';_x.fillText(hf.name,vhX+4,y+10);
    // Status
    const status=hf.vulnerable?(hf.broken?'VULNERABLE+BROKEN':'VULNERABLE (MD construct)'):'IMMUNE';
    _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText(status,vhX+60,y+10);
    // Indicator
    _x.fillStyle=hf.vulnerable?'#f87171':'#4ade80';
    _x.beginPath();_x.arc(vhX+hhW-10,y+7,4,0,Math.PI*2);_x.fill();
  });

  // === MD Padding Visualization (bottom) ===
  const pdY=Math.max(aaY+115,vhY+130);
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Merkle-Damgard Padding (64-byte block)',10,pdY);

  const totalBytes=64;
  const byteW=Math.min(12,(w-20)/totalBytes);
  const msgLen=(_t%30)+5;
  for(let i=0;i<totalBytes;i++){
    const x=10+i*byteW;
    let color,label;
    if(i<msgLen){color='#4ade80';label=((0x41+i)&0x7F).toString(16)}
    else if(i===msgLen){color='#fbbf24';label='80'}
    else if(i<56){color=mut+'22';label='00'}
    else{color='#c084fc';label=((msgLen*8)>>(56-i)*8&0xFF).toString(16).padStart(2,'0').slice(-2)}
    _x.fillStyle=typeof color==='string'&&color.length<8?color+'33':color;
    _x.fillRect(x,pdY+10,byteW-1,18);
    _x.fillStyle=typeof color==='string'&&color.length<8?color:mut;
    _x.font='bold 6px SF Mono';_x.textAlign='center';
    _x.fillText(label,x+byteW/2,pdY+22);_x.textAlign='left';
  }

  // Legend
  const legY=pdY+34;
  [{c:'#4ade80',t:'Message'},{c:'#fbbf24',t:'0x80'},{c:mut,t:'Zero fill'},{c:'#c084fc',t:'Length (bits)'}].forEach((l,i)=>{
    const lx=10+i*90;
    _x.fillStyle=l.c;_x.fillRect(lx,legY,8,8);
    _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText(l.t,lx+12,legY+8);
  });

  // === HMAC Defense Diagram (bottom-right) ===
  const hmY=pdY+50;
  if(hmY+40<h){
    _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
    _x.fillText('HMAC = H(K xor opad || H(K xor ipad || msg))  -- immune to extension',10,hmY);
    const pipeW=w-20,pipeH=20;
    const stages=['K xor ipad','H_inner(msg)','K xor opad','H_outer','HMAC'];
    const stW=pipeW/stages.length;
    stages.forEach((s,i)=>{
      const x=10+i*stW;
      const progress=(_t%100)/100;
      const active=progress*stages.length>i&&progress*stages.length<i+1;
      _x.fillStyle=active?'#4ade8044':'rgba(255,255,255,.03)';
      _x.fillRect(x,hmY+8,stW-4,pipeH);
      _x.strokeStyle=active?'#4ade80':mut+'33';_x.strokeRect(x,hmY+8,stW-4,pipeH);
      _x.fillStyle=active?'#4ade80':mut;_x.font='bold 7px SF Mono';_x.textAlign='center';
      _x.fillText(s,x+stW/2-2,hmY+22);_x.textAlign='left';
      if(i<stages.length-1){_x.fillStyle=acc;_x.beginPath();_x.moveTo(x+stW-4,hmY+18);_x.lineTo(x+stW,hmY+15);_x.lineTo(x+stW,hmY+21);_x.fill()}
    });
  }

  requestAnimationFrame(draw);
}
draw();
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
function setupLinks(){const L=LANG[document.documentElement.lang||'en'];['related1','related2','related3'].forEach(k=>{const a=document.getElementById(k+'Link');if(a&&L[k+'_path'])a.href=L[k+'_path'];});const pp=document.getElementById('pathPrevLink'),pn=document.getElementById('pathNextLink');if(pp&&L.pathPrev_path)pp.href=L.pathPrev_path;if(pn&&L.pathNext_path)pn.href=L.pathNext_path;if(pp&&!L.pathPrev_path)document.getElementById('pathPrevP').style.display='none';if(pn&&!L.pathNext_path)document.getElementById('pathNextP').style.display='none';}document.addEventListener('DOMContentLoaded',setupLinks);
