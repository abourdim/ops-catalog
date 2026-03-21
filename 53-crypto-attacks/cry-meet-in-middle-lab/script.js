/**
 * Meet-in-the-Middle Lab — Workshop DIY v1.0
 * 2DES MITM Attack Simulation
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas
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
    ...LANG_BASE.en,
    title:'Meet-in-the-Middle Lab',subtitle:'Break 2DES double encryption with a time-memory tradeoff',
    mainSection:'Meet-in-the-Middle Attack',mainDesc:'Show why 2DES with 2n-bit key has only n+1 bit security',
    keyBitsLabel:'Key Size (bits per key)',keyBitsHint:'Each key for the mini-cipher (small for demo)',
    ptLabel:'Plaintext (number)',ptHint:'Known plaintext value for the attack',
    encrypt2DES:'Encrypt (2DES)',mitm:'MITM Attack',bruteForce:'Brute Force',reset:'Reset',results:'Results',
    vizTitle:'MITM Visualization',vizHint:'Watch forward and backward tables meet in the middle',
    sectionA:'Attack Reference',sectionB:'Crypto Deep Dive',
    settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',
    langChanged:'Language -> English',themeChanged:'Theme ->',
    encrypted:'Double encryption complete',keysFound:'Keys found!',
    bruteComplete:'Brute force complete',resetDone:'Reset complete',attacking:'Running MITM...',
    howto_1:'The main display shows the Meet In Middle Lab simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for Meet-in-the-Middle Lab. Choose ',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Attack Reference" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_mitm:'MITM: E_K1(P) = D_K2(C). بناء جدول لكل E_K1(P). This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_2des:'2DES: C = E_K2(E_K1(P)). تشفير مزدوج بمفتاحين. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_3des:'3DES: C = E_K3(D_K2(E_K1(P))). يقاوم MITM. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    mathExplain:'Meet-in-the-Middle Attack:\n\nDouble encryption: C = E_K2(E_K1(P))\n\nAttack given known (P, C):\n1. Forward table: For all K1, compute M = E_K1(P), store (M -> K1)\n2. Backward: For all K2, compute M\' = D_K2(C)\n3. If M\' exists in forward table -> found K1, K2\n\nComplexity:\n- Brute force 2DES: O(2^(2n)) time\n- MITM: O(2^n) time + O(2^n) space\n- Effective security: n+1 bits, not 2n bits\n\nExample (n=56 for DES):\n- Expected: 2^112 work\n- Actual: 2^57 work + 2^56 memory'
  ,step1Title:'Set Up',step1Desc:'Configure the parameters for Meet-in-the-Middle Lab. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Attack Reference" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Crypto Deep Dive". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is Meet-in-the-Middle Lab?',faq_a1:'Meet In Middle Lab is an interactive simulation that demonstrates crypto attacks concepts. Show why 2DES with 2n-bit key has only n+1 bit security. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real cryptography behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real cryptography principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to Meet-in-the-Middle Lab! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Choose key size and plaintext value. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Attack Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Meet In Middle Lab! This is like a science experiment on your computer. You get to control a real crypto attacks simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for Meet-in-the-Middle La Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32)  # 32 bytes = 256 bits\\niv = os.urandom(16)   # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key:        {key.hex()}")\\nprint(f"IV:         {iv.hex()}")\\nprint(f"Plaintext:  {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered:  {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',wiki_concept_title:'🔬 What is Meet-in-the-Middle Lab?',wiki_concept:'Meet-in-the-Middle Lab is a technique used in cryptography. Show why 2DES with 2n-bit key has only n+1 bit security. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the parameters for Meet-in-the-Middle Lab. Choose your input settings using the controls in the main card. Each control directly affects the simulation output. Second: Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs. The simulation runs these stages in real time, showing you intermediate results at each step. In real cryptography, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Meet-in-the-Middle Lab has practical applications in cryptography. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Meet-in-the-Middle Lab: Show why 2DES with 2n-bit key has only n+1 bit security. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Choose Algorithm through Set Up Attack to Execute Attack and Analyze Results.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Attack Reference" and "Crypto Deep Dive" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Reverse Engineering',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. Meet In Middle Lab builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Meet In Middle Lab',
    wiki_math: 'The mathematics behind Meet In Middle Lab: With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced reverse engineering practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to reverse engineering. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with reverse engineering: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in reverse engineering.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Reverse Engineering carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Onion Routing',
    gloss1_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
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
    theory: 'Meet In Middle Lab demonstrates key principles from crypto attacks. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world reverse engineering?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional reverse engineering systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:'},
  fr:{
    title:'Labo Attaque par le Milieu',subtitle:'Cassez le double chiffrement 2DES par compromis temps-memoire',
    mainSection:'Attaque par le Milieu',mainDesc:'Montrez pourquoi 2DES avec cle 2n bits n\'a que n+1 bits de securite',
    keyBitsLabel:'Taille de Cle (bits par cle)',keyBitsHint:'Chaque cle du mini-chiffrement',
    ptLabel:'Texte Clair (nombre)',ptHint:'Valeur connue pour l\'attaque',
    encrypt2DES:'Chiffrer (2DES)',mitm:'Attaque MITM',bruteForce:'Force Brute',reset:'Reinitialiser',results:'Resultats',
    vizTitle:'Visualisation MITM',vizHint:'Regardez les tables avant et arriere se rencontrer',
    sectionA:'Reference d\'Attaque',sectionB:'Crypto en Profondeur',
    settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',
    langChanged:'Langue -> Francais',themeChanged:'Theme ->',
    encrypted:'Double chiffrement termine',keysFound:'Cles trouvees!',
    bruteComplete:'Force brute terminee',resetDone:'Reinitialisation complete',attacking:'MITM en cours...',
    howto_1:'L écran principal affiche la simulation Meet In Middle Lab. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for Meet-in-the-Middle Lab. Choose ',howto_2:'Cliquez Chiffrer pour creer le texte chiffre 2DES.',howto_3:'Cliquez Attaque MITM pour recuperer les cles.',howto_4:'Comparez avec le temps de la force brute.',
    wiki_mitm:'MITM: E_K1(P) = D_K2(C). Construire la table de tous les E_K1(P).',
    wiki_2des:'2DES: C = E_K2(E_K1(P)). Double chiffrement a deux cles.',
    wiki_3des:'3DES: C = E_K3(D_K2(E_K1(P))). Resiste a MITM.',
    mathExplain:'Attaque par le Milieu:\n\nDouble chiffrement: C = E_K2(E_K1(P))\n\n1. Table avant: Pour tout K1, M = E_K1(P)\n2. Arriere: Pour tout K2, M\' = D_K2(C)\n3. Si M\' dans la table -> K1, K2 trouves\n\nComplexite: O(2^n) temps + O(2^n) memoire'
  ,step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Meet In Middle Lab est une simulation interactive qui démontre les concepts de attaques crypto. Show why 2DES with 2n-bit key has only n+1 bit security. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Bleichenbacher Attack and Cry Padding Oracle Lab ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 Histoire de rétro-ingénierie',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. Meet In Middle Lab s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Meet In Middle Lab',
    wiki_math: 'Les mathématiques derrière Meet In Middle Lab : With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de rétro-ingénierie utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour rétro-ingénierie. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en rétro-ingénierie : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Rétro-ingénierie implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Onion Routing',
    gloss1_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
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
    theory: 'Meet In Middle Lab démontre les principes clés de attaques crypto. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec reverse engineering dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :'},
  ar:{
    title:'مختبر هجوم اللقاء في المنتصف',subtitle:'اكسر التشفير المزدوج 2DES بمقايضة الوقت والذاكرة',
    mainSection:'هجوم اللقاء في المنتصف',mainDesc:'اظهر لماذا 2DES بمفتاح 2n بت لديه فقط n+1 بت من الامان',
    keyBitsLabel:'حجم المفتاح (بت لكل مفتاح)',keyBitsHint:'كل مفتاح للشيفرة المصغرة',
    ptLabel:'النص الاصلي (رقم)',ptHint:'قيمة معروفة للهجوم',
    encrypt2DES:'تشفير (2DES)',mitm:'هجوم MITM',bruteForce:'قوة غاشمة',reset:'اعادة تعيين',results:'النتائج',
    vizTitle:'تصور MITM',vizHint:'شاهد الجداول الامامية والخلفية تلتقي في المنتصف',
    sectionA:'مرجع الهجوم',sectionB:'تعمق في التشفير',
    settings:'الاعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',
    help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',
    langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',
    encrypted:'اكتمل التشفير المزدوج',keysFound:'تم ايجاد المفاتيح!',
    bruteComplete:'اكتملت القوة الغاشمة',resetDone:'تمت اعادة التعيين',attacking:'تشغيل MITM...',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Meet In Middle Lab. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for Meet-in-the-Middle Lab. Choose ',howto_2:'انقر تشفير لانشاء النص المشفر.',howto_3:'انقر هجوم MITM لاستعادة المفاتيح.',howto_4:'قارن مع وقت القوة الغاشمة.',
    wiki_mitm:'MITM: E_K1(P) = D_K2(C). بناء جدول لكل E_K1(P).',
    wiki_2des:'2DES: C = E_K2(E_K1(P)). تشفير مزدوج بمفتاحين.',
    wiki_3des:'3DES: C = E_K3(D_K2(E_K1(P))). يقاوم MITM.',
    mathExplain:'هجوم اللقاء في المنتصف:\n\nالتشفير المزدوج: C = E_K2(E_K1(P))\n\n1. جدول امامي: لكل K1 احسب M = E_K1(P)\n2. خلفي: لكل K2 احسب M\' = D_K2(C)\n3. اذا M\' في الجدول -> تم ايجاد K1 و K2\n\nالتعقيد: O(2^n) وقت + O(2^n) ذاكرة'
  ,step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Meet In Middle Lab هي محاكاة تفاعلية توضح مفاهيم هجمات التشفير. Show why 2DES with 2n-bit key has only n+1 bit security. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Bleichenbacher Attack and Cry Padding Oracle Lab! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 تاريخ الهندسة العكسية',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. يبني Meet In Middle Lab على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Meet In Middle Lab',
    wiki_math: 'الرياضيات وراء Meet In Middle Lab: With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الهندسة العكسية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الهندسة العكسية. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الهندسة العكسية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الهندسة العكسية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Onion Routing',
    gloss1_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
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
    theory: 'Meet In Middle Lab يوضح المبادئ الأساسية في هجمات التشفير. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـreverse engineering في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:'}
};
let currentLang='en';

function setLanguage(lang){
  currentLang=lang;const s=LANG[lang];if(!s)return;
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;
  const sel=$('langSelect');if(sel)sel.value=lang;
  try{localStorage.setItem('cry-mitm-lang',lang)}catch{}
  log(s.langChanged,'info');buildHelp();buildRef();buildMath();
}
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('cry-mitm-theme',name)}catch{};log(`${LANG[currentLang].themeChanged} ${name}`,'info')}

let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.08);osc.start(t);osc.stop(t+.08)}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.3);osc.start(t);osc.stop(t+.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.25)}}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function togglePanel(panel,overlay){panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'))}

/* ======= MINI BLOCK CIPHER (XOR + S-box substitution) ======= */
const SBOX=[];const SBOX_INV=[];
(function(){for(let i=0;i<256;i++)SBOX[i]=(i*167+53)&0xFF;for(let i=0;i<256;i++)SBOX_INV[SBOX[i]]=i})();

function miniEncrypt(plaintext,key,bits){
  const mask=(1<<bits)-1;
  let v=plaintext&mask;
  // Simple Feistel-like: XOR key, S-box, rotate
  v^=key&mask;
  v=SBOX[v&0xFF]&mask;
  v=((v<<3)|(v>>(bits-3)))&mask;
  v^=(key>>2)&mask;
  return v;
}
function miniDecrypt(ciphertext,key,bits){
  const mask=(1<<bits)-1;
  let v=ciphertext&mask;
  v^=(key>>2)&mask;
  v=((v>>(3))|(v<<(bits-3)))&mask;
  v=SBOX_INV[v&0xFF]&mask;
  v^=key&mask;
  return v;
}

let state={K1:0,K2:0,P:0,C:0,bits:8,forwardTable:{},backwardHits:[],mitmResult:null,bruteResult:null,phase:'idle'};

function encrypt2DES(){
  const bits=parseInt($('keyBitsSelect').value);
  const P=parseInt($('ptInput').value)&((1<<bits)-1);
  const maxKey=(1<<bits);
  const K1=Math.floor(Math.random()*maxKey);
  const K2=Math.floor(Math.random()*maxKey);
  const M=miniEncrypt(P,K1,bits);
  const C=miniEncrypt(M,K2,bits);
  state={K1,K2,P,C,bits,forwardTable:{},backwardHits:[],mitmResult:null,bruteResult:null,phase:'encrypted'};
  const s=LANG[currentLang];
  log(`${s.encrypted}: P=${P}, K1=${K1}, K2=${K2}, C=${C}`,'success');
  $('resultsBox').textContent=`2DES Encryption\nPlaintext: ${P}\nKey1: ${K1} (0x${K1.toString(16)})\nKey2: ${K2} (0x${K2.toString(16)})\nMiddle: ${M}\nCiphertext: ${C}\n\nKey space: 2^${bits} = ${maxKey} per key\nBrute force: 2^${2*bits} = ${maxKey*maxKey}\nMITM: 2 * 2^${bits} = ${2*maxKey}`;
  drawCanvas();
}

function mitmAttack(){
  if(state.phase==='idle'){log('Encrypt first','error');return}
  const s=LANG[currentLang];
  showToast(s.attacking);log(s.attacking,'info');
  const start=performance.now();
  const maxKey=1<<state.bits;

  // Phase 1: Forward table E_K1(P) for all K1
  const forward=new Map();
  for(let k=0;k<maxKey;k++){
    const m=miniEncrypt(state.P,k,state.bits);
    if(!forward.has(m))forward.set(m,[]);
    forward.get(m).push(k);
  }
  state.forwardTable=forward;

  // Phase 2: Backward D_K2(C) for all K2
  let found=null;
  state.backwardHits=[];
  for(let k=0;k<maxKey;k++){
    const m=miniDecrypt(state.C,k,state.bits);
    if(forward.has(m)){
      for(const k1 of forward.get(m)){
        // Verify: full encryption path
        const check=miniEncrypt(miniEncrypt(state.P,k1,state.bits),k,state.bits);
        if(check===state.C){
          state.backwardHits.push({k2:k,k1,m});
          if(!found)found={K1:k1,K2:k};
        }
      }
    }
  }
  const elapsed=performance.now()-start;
  state.mitmResult={found,time:elapsed,ops:2*maxKey,tableSize:maxKey};
  state.phase='mitm-done';hideToast();

  if(found){
    log(`${s.keysFound} K1=${found.K1}, K2=${found.K2} in ${elapsed.toFixed(2)}ms (${2*maxKey} ops)`,'success');
    $('resultsBox').textContent+=`\n\n=== MITM RESULT ===\nK1=${found.K1}, K2=${found.K2}\nTime: ${elapsed.toFixed(2)}ms\nOperations: ${2*maxKey}\nTable entries: ${maxKey}\nMatches found: ${state.backwardHits.length}`;
  }
  drawCanvas();
}

function bruteForceAttack(){
  if(state.phase==='idle'){log('Encrypt first','error');return}
  const start=performance.now();
  const maxKey=1<<state.bits;let ops=0,found=null;
  for(let k1=0;k1<maxKey&&!found;k1++){
    for(let k2=0;k2<maxKey;k2++){
      ops++;
      if(miniEncrypt(miniEncrypt(state.P,k1,state.bits),k2,state.bits)===state.C){
        found={K1:k1,K2:k2};break;
      }
    }
  }
  const elapsed=performance.now()-start;
  state.bruteResult={found,time:elapsed,ops};
  const s=LANG[currentLang];
  log(`${s.bruteComplete}: ${ops} ops in ${elapsed.toFixed(2)}ms`,'info');
  $('resultsBox').textContent+=`\n\n=== BRUTE FORCE ===\nK1=${found?found.K1:'?'}, K2=${found?found.K2:'?'}\nTime: ${elapsed.toFixed(2)}ms\nOperations: ${ops}`;
  if(state.mitmResult){
    const speedup=(state.bruteResult.time/state.mitmResult.time).toFixed(1);
    $('resultsBox').textContent+=`\n\nMITM is ${speedup}x faster!`;
  }
  drawCanvas();
}

function resetAll(){state={K1:0,K2:0,P:0,C:0,bits:8,forwardTable:{},backwardHits:[],mitmResult:null,bruteResult:null,phase:'idle'};$('resultsBox').textContent='';log(LANG[currentLang].resetDone,'info');drawCanvas()}

/* ======= CANVAS ======= */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function drawCanvas(){
  if(!ctx)return;
  const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),muted=getCS('--text-muted'),text=getCS('--text');
  ctx.clearRect(0,0,w,h);

  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';
  ctx.fillText('Meet-in-the-Middle Attack',10,22);

  if(state.phase==='idle'){
    ctx.fillStyle=muted;ctx.font='13px Tajawal';ctx.textAlign='center';
    ctx.fillText('Click "Encrypt (2DES)" to begin',w/2,h/2);ctx.textAlign='left';return;
  }

  // Draw 2DES flow diagram
  const boxW=100,boxH=40,midY=60;
  const pX=20,e1X=150,mX=290,e2X=430,cX=570;

  // Boxes
  [{x:pX,label:'P='+state.P,color:'#4ade80'},{x:e1X,label:'E_K1',color:'#60a5fa'},{x:mX,label:'M=?',color:'#fbbf24'},{x:e2X,label:'E_K2',color:'#60a5fa'},{x:cX,label:'C='+state.C,color:'#f87171'}].forEach(b=>{
    ctx.fillStyle=b.color+'22';ctx.fillRect(b.x,midY,boxW,boxH);
    ctx.strokeStyle=b.color;ctx.lineWidth=1.5;ctx.strokeRect(b.x,midY,boxW,boxH);
    ctx.fillStyle=b.color;ctx.font='bold 11px SF Mono,monospace';ctx.textAlign='center';
    ctx.fillText(b.label,b.x+boxW/2,midY+boxH/2+4);ctx.textAlign='left';
  });
  // Arrows
  [[pX+boxW,e1X],[e1X+boxW,mX],[mX+boxW,e2X],[e2X+boxW,cX]].forEach(([x1,x2])=>{
    ctx.strokeStyle=muted;ctx.beginPath();ctx.moveTo(x1,midY+boxH/2);ctx.lineTo(x2,midY+boxH/2);ctx.stroke();
  });

  // Forward table visualization
  if(state.forwardTable instanceof Map&&state.forwardTable.size>0){
    const tableY=midY+boxH+30;
    ctx.fillStyle='#60a5fa';ctx.font='bold 11px Tajawal';
    ctx.fillText('Forward: E_K1(P) for all K1',10,tableY);

    const maxKey=1<<state.bits;
    const barW=Math.min(4,(w/2-20)/maxKey);
    for(let k=0;k<maxKey;k++){
      const m=miniEncrypt(state.P,k,state.bits);
      const x=10+k*barW;
      const barH=(m/maxKey)*60;
      ctx.fillStyle='#60a5fa33';ctx.fillRect(x,tableY+10+60-barH,barW-1,barH);
    }

    // Backward hits
    ctx.fillStyle='#f87171';ctx.font='bold 11px Tajawal';
    ctx.fillText('Backward: D_K2(C) for all K2',w/2+10,tableY);

    for(let k=0;k<maxKey;k++){
      const m=miniDecrypt(state.C,k,state.bits);
      const x=w/2+10+k*barW;
      const barH=(m/maxKey)*60;
      const isHit=state.backwardHits.some(h=>h.k2===k);
      ctx.fillStyle=isHit?'#4ade80':'#f8717133';
      ctx.fillRect(x,tableY+10+60-barH,barW-1,barH);
    }

    // Match indicator
    if(state.backwardHits.length>0){
      const matchY=tableY+85;
      ctx.fillStyle='#4ade80';ctx.font='bold 12px Tajawal';
      ctx.textAlign='center';ctx.fillText(`Match! K1=${state.backwardHits[0].k1}, K2=${state.backwardHits[0].k2}, M=${state.backwardHits[0].m}`,w/2,matchY);ctx.textAlign='left';
    }
  }

  // Comparison bars
  if(state.mitmResult||state.bruteResult){
    const barY=h-80;
    ctx.fillStyle=accent;ctx.font='bold 11px Tajawal';ctx.fillText('Complexity Comparison:',10,barY);
    const maxOps=Math.max(state.mitmResult?state.mitmResult.ops:0,state.bruteResult?state.bruteResult.ops:0,1);
    const barH=20,barMaxW=w-120;

    if(state.mitmResult){
      const bw=(state.mitmResult.ops/maxOps)*barMaxW;
      ctx.fillStyle='#4ade8044';ctx.fillRect(100,barY+8,bw,barH);
      ctx.fillStyle='#4ade80';ctx.font='10px SF Mono';
      ctx.fillText(`MITM: ${state.mitmResult.ops} ops, ${state.mitmResult.time.toFixed(1)}ms`,10,barY+22);
    }
    if(state.bruteResult){
      const bw=(state.bruteResult.ops/maxOps)*barMaxW;
      ctx.fillStyle='#f8717144';ctx.fillRect(100,barY+34,bw,barH);
      ctx.fillStyle='#f87171';ctx.font='10px SF Mono';
      ctx.fillText(`Brute: ${state.bruteResult.ops} ops, ${state.bruteResult.time.toFixed(1)}ms`,10,barY+48);
    }
  }
}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'MITM',p:s.wiki_mitm},{t:'2DES',p:s.wiki_2des},{t:'3DES',p:s.wiki_3des}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){const s=LANG[currentLang];$('refCard').innerHTML=[{t:'MITM',p:s.wiki_mitm},{t:'2DES',p:s.wiki_2des},{t:'3DES',p:s.wiki_3des}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);
  resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-mitm-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-mitm-theme');if(t)setTheme(t)}catch{}

  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));
  $('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);
  $('themeSelect').onchange=e=>setTheme(e.target.value);
  $('soundToggle').onchange=e=>{soundEnabled=e.target.checked;playSound('click')};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};
  $('copyLogBtn').onclick=async()=>{const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})}});
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$(`help${tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)}`).classList.add('active')}});

  $('encryptBtn').onclick=encrypt2DES;
  $('attackBtn').onclick=mitmAttack;
  $('bruteBtn').onclick=bruteForceAttack;
  $('resetBtn').onclick=resetAll;

  buildHelp();buildRef();buildMath();
  log(LANG[currentLang].ready,'success');drawCanvas();
});

/* ═══════ ENHANCED MEET-IN-THE-MIDDLE VISUALIZATION (IIFE) ═══════ */
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

  // === Double Encryption Pipeline (top) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('2DES Double Encryption Pipeline',10,16);

  const boxes=[
    {label:'P',desc:'Plaintext',x:w*0.05,color:'#4ade80'},
    {label:'E_K1',desc:'Encrypt',x:w*0.22,color:'#60a5fa'},
    {label:'M',desc:'Middle',x:w*0.42,color:'#fbbf24'},
    {label:'E_K2',desc:'Encrypt',x:w*0.60,color:'#60a5fa'},
    {label:'C',desc:'Ciphertext',x:w*0.78,color:'#f87171'}
  ];
  const bW=60,bH=30,bY=28;
  boxes.forEach((b,i)=>{
    _x.fillStyle=b.color+'22';_x.fillRect(b.x,bY,bW,bH);_x.strokeStyle=b.color;_x.strokeRect(b.x,bY,bW,bH);
    _x.fillStyle=b.color;_x.font='bold 10px SF Mono';_x.textAlign='center';
    _x.fillText(b.label,b.x+bW/2,bY+14);_x.fillStyle=mut;_x.font='7px Tajawal';_x.fillText(b.desc,b.x+bW/2,bY+26);_x.textAlign='left';
    if(i<boxes.length-1){
      _x.strokeStyle=mut+'66';_x.beginPath();_x.moveTo(b.x+bW,bY+bH/2);_x.lineTo(boxes[i+1].x,bY+bH/2);_x.stroke();
    }
  });
  // Animated data flow
  const flowPhase=(_t%100)/100;
  const flowX=boxes[0].x+bW+(boxes[4].x-boxes[0].x-bW)*flowPhase;
  _x.fillStyle='#fff';_x.beginPath();_x.arc(flowX,bY+bH/2,4,0,Math.PI*2);_x.fill();

  // === Forward & Backward Table Concept (middle) ===
  const tbY=bY+bH+20;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('MITM: Forward & Backward Hash Tables',10,tbY);

  const halfW=w*0.45;
  // Forward table
  _x.fillStyle='#60a5fa';_x.font='bold 10px SF Mono';_x.fillText('Forward: E_K1(P)',10,tbY+16);
  const nEntries=12;
  const entryH=14;
  for(let i=0;i<nEntries;i++){
    const y=tbY+22+i*entryH;
    const isActive=i<=(_t%nEntries);
    const k1=i*19+3;const m=miniEncrypt(42,k1,8);
    _x.fillStyle=isActive?'#60a5fa22':'rgba(255,255,255,.02)';
    _x.fillRect(10,y,halfW-10,entryH-2);
    _x.fillStyle=isActive?'#60a5fa':mut;_x.font='7px SF Mono';
    _x.fillText(`K1=${k1.toString(16).padStart(2,'0')} -> M=${m.toString(16).padStart(2,'0')}  [stored in table]`,14,y+10);
  }

  // Backward table
  _x.fillStyle='#f87171';_x.font='bold 10px SF Mono';_x.fillText('Backward: D_K2(C)',w*0.52,tbY+16);
  for(let i=0;i<nEntries;i++){
    const y=tbY+22+i*entryH;
    const isActive=i<=(_t%(nEntries+3));
    const k2=i*23+7;const m=miniDecrypt(187,k2,8);
    const isMatch=i===7&&_t%40>20;
    _x.fillStyle=isMatch?'#4ade8044':isActive?'#f8717122':'rgba(255,255,255,.02)';
    _x.fillRect(w*0.52,y,halfW-10,entryH-2);
    _x.fillStyle=isMatch?'#4ade80':isActive?'#f87171':mut;_x.font='7px SF Mono';
    _x.fillText(`K2=${k2.toString(16).padStart(2,'0')} -> M'=${m.toString(16).padStart(2,'0')}  ${isMatch?'<< MATCH!':'[lookup]'}`,w*0.52+4,y+10);
  }

  // Match arrow
  if(_t%40>20){
    const matchY=tbY+22+7*entryH+entryH/2;
    _x.strokeStyle='#4ade80';_x.lineWidth=2;_x.setLineDash([3,3]);
    _x.beginPath();_x.moveTo(halfW,matchY);_x.lineTo(w*0.52,matchY);_x.stroke();
    _x.setLineDash([]);_x.lineWidth=1;
    _x.fillStyle='#4ade80';_x.font='bold 9px SF Mono';_x.textAlign='center';
    _x.fillText('M = M\' => Found K1, K2!',w/2,matchY-6);_x.textAlign='left';
  }

  // === Complexity Comparison Chart (bottom) ===
  const ccY=tbY+22+nEntries*entryH+15;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Why 2DES Fails: Complexity Analysis',10,ccY);

  const bits=[4,6,8,10,12,14,16];
  const chartW=w-40,chartH=h-ccY-35;
  const maxLog=32;
  _x.strokeStyle=mut+'44';_x.beginPath();
  _x.moveTo(30,ccY+8);_x.lineTo(30,ccY+8+chartH);_x.lineTo(30+chartW,ccY+8+chartH);_x.stroke();

  // Brute force line (2^2n)
  _x.strokeStyle='#f87171';_x.lineWidth=2;_x.beginPath();
  bits.forEach((b,i)=>{
    const x=30+i/(bits.length-1)*chartW;
    const y=ccY+8+chartH-(2*b/maxLog)*chartH;
    if(i===0)_x.moveTo(x,y);else _x.lineTo(x,y);
  });_x.stroke();

  // MITM line (2^(n+1))
  _x.strokeStyle='#4ade80';_x.beginPath();
  bits.forEach((b,i)=>{
    const x=30+i/(bits.length-1)*chartW;
    const y=ccY+8+chartH-((b+1)/maxLog)*chartH;
    if(i===0)_x.moveTo(x,y);else _x.lineTo(x,y);
  });_x.stroke();_x.lineWidth=1;

  // Single DES line (2^n)
  _x.strokeStyle='#fbbf24';_x.setLineDash([4,4]);_x.beginPath();
  bits.forEach((b,i)=>{
    const x=30+i/(bits.length-1)*chartW;
    const y=ccY+8+chartH-(b/maxLog)*chartH;
    if(i===0)_x.moveTo(x,y);else _x.lineTo(x,y);
  });_x.stroke();_x.setLineDash([]);

  // Legend
  _x.fillStyle='#f87171';_x.font='8px SF Mono';_x.fillText('Brute 2^(2n)',w-180,ccY+14);
  _x.fillStyle='#4ade80';_x.fillText('MITM 2^(n+1)',w-180,ccY+26);
  _x.fillStyle='#fbbf24';_x.fillText('1DES 2^n',w-180,ccY+38);

  // X-axis labels
  bits.forEach((b,i)=>{
    const x=30+i/(bits.length-1)*chartW;
    _x.fillStyle=mut;_x.font='7px SF Mono';_x.textAlign='center';
    _x.fillText(`${b}`,x,ccY+8+chartH+10);_x.textAlign='left';
  });
  _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText('Key bits (n)',30+chartW/2-20,ccY+8+chartH+20);

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
