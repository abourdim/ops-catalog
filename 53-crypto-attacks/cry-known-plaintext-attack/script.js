/**
 * Known Plaintext Attack — Workshop DIY v1.0
 * XOR known plaintext with ciphertext to recover key stream
 */
const $=id=>document.getElementById(id);// ── Shared i18n keys (template) ──
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
    ...LANG_BASE.en,title:'Known Plaintext Attack',subtitle:'Recover encryption keys using known pairs',mainSection:'KPA Key Recovery',mainDesc:'XOR known plaintext with ciphertext to recover key stream',ready:'Ready',langChanged:'Language -> English',themeChanged:'Theme ->',recovered:'Key stream recovered!',howto_1:'The main display shows the Known Plaintext Attack simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for Known Plaintext Attack. Choose ',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "the data section" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',wiki_xor:'XOR: C = P XOR K. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_stream:'تشفير التدفق يولد تيارا شبه عشوائي. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_defense:'الدفاع: لا تعد استخدام تيارات المفاتيح. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',mathExplain:'Known Plaintext Attack on XOR Cipher:\n\nEncryption: C = P XOR K\nGiven: P (known plaintext), C (ciphertext)\nRecover: K = C XOR P\n\nDecrypt any message: P2 = C2 XOR K\n\nFor repeating-key XOR:\nC[i] = P[i] XOR K[i mod keylen]\nK[i mod keylen] = C[i] XOR P[i]',step1Title:'Set Up',step1Desc:'Configure the parameters for Known Plaintext Attack. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Analysis" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Data View". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is Known Plaintext Attack?',faq_a1:'Known Plaintext Attack is an interactive simulation that demonstrates crypto attacks concepts. XOR known plaintext with ciphertext to recover key stream. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real cryptography behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real cryptography principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to Known Plaintext Attack! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Enter the known plaintext. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "the first section" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Known Plaintext Attack! This is like a science experiment on your computer. You get to control a real crypto attacks simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for Known Plaintext Attac Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32)  # 32 bytes = 256 bits\\niv = os.urandom(16)   # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key:        {key.hex()}")\\nprint(f"IV:         {iv.hex()}")\\nprint(f"Plaintext:  {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered:  {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',wiki_concept_title:'🔬 What is Known Plaintext Attack?',wiki_concept:'Known Plaintext Attack is a technique used in cryptography. XOR known plaintext with ciphertext to recover key stream. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the parameters for Known Plaintext Attack. Choose your input settings using the controls in the main card. Each control directly affects the simulation output. Second: Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs. The simulation runs these stages in real time, showing you intermediate results at each step. In real cryptography, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Known Plaintext Attack has practical applications in cryptography. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Known Plaintext Attack: XOR known plaintext with ciphertext to recover key stream. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Choose Algorithm through Set Up Attack to Execute Attack and Analyze Results.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Analysis" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Reverse Engineering',
    wiki_history: 'From the Vigenère cipher (1553) to DES (1977) to AES (2001), cipher design has evolved from substitution tables to complex mathematical transformations. Known Plaintext Attack builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Known Plaintext Attack',
    wiki_math: 'The mathematics behind Known Plaintext Attack: Cipher strength is measured in bits of security. AES-256 provides 256-bit security, meaning 2^256 operations to brute-force — more than atoms in the universe. XOR has perfect balance: for any fixed key bit, the output is equally likely to be 0 or 1. This property makes it ideal for mixing key material with plaintext. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced reverse engineering practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to reverse engineering. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with reverse engineering: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in reverse engineering.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Reverse Engineering carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Key Space',
    gloss1_def: 'The total number of possible keys for a cipher. Larger key spaces make brute-force attacks computationally infeasible.',
    gloss2_term: 'One-Time Pad',
    gloss2_def: 'An encryption technique using a random key as long as the message, XORed once. Mathematically proven unbreakable if the key is truly random and never reused.',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Known Plaintext Attack demonstrates key principles from crypto attacks. A cipher is a specific algorithm for performing encryption and decryption. Block ciphers process fixed-size chunks; stream ciphers process one bit at a time. XOR (exclusive OR) is a bitwise operation where the output is 1 only when inputs differ. It is reversible: A⊕B⊕B = A, making it fundamental to many ciphers. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world reverse engineering?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional reverse engineering systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Field Comms — Secure Channel',related1_desc:'Portable encrypted comms with mesh relay and HF backup',related1_path:'../../39-agent-gear/kit-field-comms/index.html',related2_name:'WiFi Pineapple DIY — Rogue AP Lab',related2_desc:'Build a DIY rogue access point and learn evil twin detection',related2_path:'../../52-hardware-implants/imp-wifi-pineapple-diy/index.html',related3_name:'Watering Hole Architect',related3_desc:'Design targeted website compromise strategies',related3_path:'../../51-social-engineering/se-watering-hole-architect/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Collision Search',pathPrev_path:'../../53-crypto-attacks/cry-hash-collision-finder/index.html',pathNext_name:'Length Extension Attack',pathNext_path:'../../53-crypto-attacks/cry-length-extension-lab/index.html',
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What does RSA stand for?',quiz_q1a:'Random Secure Algorithm',quiz_q1b:'Rivest-Shamir-Adleman',quiz_q1c:'Rapid Signal Authentication',quiz_q1d:'Radio Security Architecture',quiz_q1_answer:'1',quiz_q2:'What is the key space of a Caesar cipher?',quiz_q2a:'256',quiz_q2b:'26',quiz_q2c:'128',quiz_q2d:'52',quiz_q2_answer:'1',quiz_q3:'Which cipher uses a keyword for polyalphabetic substitution?',quiz_q3a:'ROT13',quiz_q3b:'Vigenère',quiz_q3c:'Caesar',quiz_q3d:'Morse',quiz_q3_answer:'1',quiz_q4:'What is machine learning?',quiz_q4a:'Programming robots',quiz_q4b:'Systems that learn from data',quiz_q4c:'Manual computation',quiz_q4d:'Hardware design',quiz_q4_answer:'1',quiz_q5:'What does AI stand for?',quiz_q5a:'Automated Input',quiz_q5b:'Artificial Intelligence',quiz_q5c:'Analog Interface',quiz_q5d:'Active Integration',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'The SolarWinds attack (2020) compromised 18,000 organizations by hiding malware inside trusted software updates. Attackers had 9 months of undetected access to US Treasury, Commerce, and Homeland Security systems.',realworld2:'Heartbleed (2014) was a buffer overflow in OpenSSL that let attackers read 64KB of server memory per request — potentially grabbing private keys, passwords, and session tokens from any HTTPS server worldwide.',realworld3:'Alan Turing\'s team at Bletchley Park cracked the Enigma machine during WWII, reading 84,000 encrypted German messages per month by 1945. This achievement shortened the war by an estimated 2 years.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In AI frontier, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in AI frontier and reveal the hidden complexity beneath simple-looking systems.'},
fr:{title:'Attaque Texte Clair Connu',subtitle:'Recuperez les cles avec des paires connues',mainSection:'Recuperation de Cle',mainDesc:'XOR du texte connu avec le chiffre',ready:'Pret',langChanged:'Langue -> Francais',themeChanged:'Theme ->',recovered:'Flux de cle recupere!',howto_1:'L écran principal affiche la simulation Known Plaintext Attack. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for Known Plaintext Attack. Choose ',howto_2:'Cliquez Chiffrer.',howto_3:'Cliquez Recuperer.',howto_4:'Dechiffrez d\'autres messages.',wiki_xor:'XOR: C = P XOR K.',wiki_stream:'Les chiffrements par flux generent un flux pseudo-aleatoire.',wiki_defense:'Defense: ne jamais reutiliser les flux de cles.',mathExplain:'C = P XOR K\nK = C XOR P',step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Known Plaintext Attack est une simulation interactive qui démontre les concepts de attaques crypto. XOR known plaintext with ciphertext to recover key stream. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Bleichenbacher Attack and Cry Elliptic Curve Attack ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 Histoire de rétro-ingénierie',
    wiki_history: 'From the Vigenère cipher (1553) to DES (1977) to AES (2001), cipher design has evolved from substitution tables to complex mathematical transformations. Known Plaintext Attack s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Known Plaintext Attack',
    wiki_math: 'Les mathématiques derrière Known Plaintext Attack : Cipher strength is measured in bits of security. AES-256 provides 256-bit security, meaning 2^256 operations to brute-force — more than atoms in the universe. XOR has perfect balance: for any fixed key bit, the output is equally likely to be 0 or 1. This property makes it ideal for mixing key material with plaintext. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de rétro-ingénierie utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour rétro-ingénierie. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en rétro-ingénierie : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Rétro-ingénierie implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Key Space',
    gloss1_def: 'The total number of possible keys for a cipher. Larger key spaces make brute-force attacks computationally infeasible.',
    gloss2_term: 'One-Time Pad',
    gloss2_def: 'An encryption technique using a random key as long as the message, XORed once. Mathematically proven unbreakable if the key is truly random and never reused.',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Known Plaintext Attack démontre les principes clés de attaques crypto. A cipher is a specific algorithm for performing encryption and decryption. Block ciphers process fixed-size chunks; stream ciphers process one bit at a time. XOR (exclusive OR) is a bitwise operation where the output is 1 only when inputs differ. It is reversible: A⊕B⊕B = A, making it fundamental to many ciphers. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec reverse engineering dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Comms Terrain — Canal Sécurisé',related1_desc:'Communications chiffrées portables avec relais maillé et HF de secours',related1_path:'../../39-agent-gear/kit-field-comms/index.html',related2_name:'WiFi Pineapple DIY — Point d\\',related2_desc:'Construisez un point d\\',related2_path:'../../52-hardware-implants/imp-wifi-pineapple-diy/index.html',related3_name:'Architecte Watering Hole',related3_desc:'Concevoir des stratégies de compromission web',related3_path:'../../51-social-engineering/se-watering-hole-architect/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Recherche de Collision',pathPrev_path:'../../53-crypto-attacks/cry-hash-collision-finder/index.html',pathNext_name:'Attaque Extension de Longueur',pathNext_path:'../../53-crypto-attacks/cry-length-extension-lab/index.html',
    printBtn: '🖨️ Imprimer',realworldTitle:'🌍 Histoires réelles',realworld1:'L\'attaque SolarWinds (2020) a compromis 18 000 organisations en cachant des malwares dans des mises à jour logicielles de confiance.',realworld2:'Heartbleed (2014) était un dépassement de tampon dans OpenSSL qui permettait aux attaquants de lire 64 Ko de mémoire serveur par requête.',realworld3:'L\'équipe d\'Alan Turing à Bletchley Park a décrypté la machine Enigma pendant la WWII, lisant 84 000 messages allemands chiffrés par mois en 1945.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En frontière IA, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en frontière IA et révèlent la complexité cachée sous des systèmes simples en apparence.'},
ar:{title:'هجوم النص المعروف',subtitle:'استرجع مفاتيح التشفير باستخدام أزواج معروفة',mainSection:'استرجاع المفتاح',mainDesc:'XOR النص المعروف مع المشفر لاسترجاع تيار المفتاح',ready:'جاهز',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',recovered:'تم استرجاع تيار المفتاح!',howto_1:'تعرض الشاشة الرئيسية محاكاة Known Plaintext Attack. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for Known Plaintext Attack. Choose ',howto_2:'اضغط تشفير.',howto_3:'اضغط استرجاع.',howto_4:'فك تشفير رسائل أخرى.',wiki_xor:'XOR: C = P XOR K.',wiki_stream:'تشفير التدفق يولد تيارا شبه عشوائي.',wiki_defense:'الدفاع: لا تعد استخدام تيارات المفاتيح.',mathExplain:'C = P XOR K\nK = C XOR P',step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Known Plaintext Attack هي محاكاة تفاعلية توضح مفاهيم هجمات التشفير. XOR known plaintext with ciphertext to recover key stream. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Bleichenbacher Attack and Cry Elliptic Curve Attack! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 تاريخ الهندسة العكسية',
    wiki_history: 'From the Vigenère cipher (1553) to DES (1977) to AES (2001), cipher design has evolved from substitution tables to complex mathematical transformations. يبني Known Plaintext Attack على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Known Plaintext Attack',
    wiki_math: 'الرياضيات وراء Known Plaintext Attack: Cipher strength is measured in bits of security. AES-256 provides 256-bit security, meaning 2^256 operations to brute-force — more than atoms in the universe. XOR has perfect balance: for any fixed key bit, the output is equally likely to be 0 or 1. This property makes it ideal for mixing key material with plaintext. With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الهندسة العكسية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الهندسة العكسية. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الهندسة العكسية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الهندسة العكسية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Key Space',
    gloss1_def: 'The total number of possible keys for a cipher. Larger key spaces make brute-force attacks computationally infeasible.',
    gloss2_term: 'One-Time Pad',
    gloss2_def: 'An encryption technique using a random key as long as the message, XORed once. Mathematically proven unbreakable if the key is truly random and never reused.',
    gloss3_term: 'Onion Routing',
    gloss3_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss4_term: 'Latency',
    gloss4_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss5_term: 'Throughput',
    gloss5_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss6_term: 'Protocol',
    gloss6_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Known Plaintext Attack يوضح المبادئ الأساسية في هجمات التشفير. A cipher is a specific algorithm for performing encryption and decryption. Block ciphers process fixed-size chunks; stream ciphers process one bit at a time. XOR (exclusive OR) is a bitwise operation where the output is 1 only when inputs differ. It is reversible: A⊕B⊕B = A, making it fundamental to many ciphers. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـreverse engineering في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'اتصالات ميدانية — قناة آمنة',related1_desc:'اتصالات مشفرة محمولة مع ترحيل شبكي ونسخ HF احتياطي',related1_path:'../../39-agent-gear/kit-field-comms/index.html',related2_name:'WiFi Pineapple — مختبر نقطة الوصول المزيفة',related2_desc:'بناء نقطة وصول مزيفة وتعلم كشف التوائم الشريرة',related2_path:'../../52-hardware-implants/imp-wifi-pineapple-diy/index.html',related3_name:'مهندس حفرة المياه',related3_desc:'تصميم استراتيجيات اختراق المواقع',related3_path:'../../51-social-engineering/se-watering-hole-architect/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'بحث التصادم',pathPrev_path:'../../53-crypto-attacks/cry-hash-collision-finder/index.html',pathNext_name:'هجوم تمديد الطول',pathNext_path:'../../53-crypto-attacks/cry-length-extension-lab/index.html',
    printBtn: '🖨️ طباعة',realworldTitle:'🌍 قصص واقعية',realworld1:'اخترق هجوم سولار ويندز (2020) أكثر من 18000 منظمة من خلال إخفاء برامج ضارة داخل تحديثات البرمجيات الموثوقة.',realworld2:'كانت ثغرة هارتبليد (2014) تجاوزًا في المخزن المؤقت في OpenSSL سمح للمهاجمين بقراءة 64 كيلوبايت من ذاكرة الخادم لكل طلب.',realworld3:'فك فريق آلان تورينغ في بلتشلي بارك شفرة آلة إنغما خلال الحرب العالمية الثانية وقرأ 84000 رسالة ألمانية مشفرة شهريًا بحلول عام 1945.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في حدود الذكاء معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في حدود الذكاء وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.'}};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});

function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;if($('langSelect'))$('langSelect').value=l;try{localStorage.setItem('cry-kpa-lang',l)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));if($('themeSelect'))$('themeSelect').value=n;try{localStorage.setItem('cry-kpa-theme',n)}catch{}}
let soundEnabled=false;function playSound(t){if(!soundEnabled)return;const a=new(window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);g.gain.value=.08;o.frequency.value=t==='success'?523:200;g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.2);o.start();o.stop(a.currentTime+.2)}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success')}
function showToast(m){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(p,o){p.classList.toggle('open');if(o)o.classList.toggle('active',p.classList.contains('open'))}
/* ═══════ XOR CIPHER ═══════ */
let secretKey='SECRETKEY',ptBytes=[],ctBytes=[],keyBytes=[],recoveredKey=[];
function xorEncrypt(pt,key){return pt.map((b,i)=>b^key.charCodeAt(i%key.length))}
function doEncrypt(){const pt=$('ptInput').value;ptBytes=Array.from(pt).map(c=>c.charCodeAt(0));ctBytes=xorEncrypt(ptBytes,secretKey);keyBytes=Array.from(secretKey).map(c=>c.charCodeAt(0));recoveredKey=[];
  $('resultsBox').textContent=`Plaintext:  "${pt}"\nCiphertext: [${ctBytes.map(b=>b.toString(16).padStart(2,'0')).join(' ')}]\n(Key is hidden from attacker)`;log('Encrypted with secret key','success');drawCanvas()}
function recoverKey(){if(ctBytes.length===0){doEncrypt()}recoveredKey=ctBytes.map((c,i)=>c^ptBytes[i]);
  const keyStr=recoveredKey.map(b=>String.fromCharCode(b)).join('');const s=LANG[currentLang];
  $('resultsBox').textContent+=`\n\n--- KEY RECOVERY ---\nRecovered key bytes: [${recoveredKey.map(b=>b.toString(16).padStart(2,'0')).join(' ')}]\nRecovered key: "${keyStr}"\nActual key:    "${secretKey}"\nMatch: ${keyStr.slice(0,secretKey.length)===secretKey?'YES':'PARTIAL'}`;
  log(s.recovered,'success');drawCanvas()}
function decryptUnknown(){if(recoveredKey.length===0){recoverKey()}const ct2=$('unknownInput').value.split(' ').map(h=>parseInt(h,16)).filter(n=>!isNaN(n));
  if(ct2.length===0){log('Enter hex ciphertext','error');return}
  const pt2=ct2.map((c,i)=>String.fromCharCode(c^recoveredKey[i%recoveredKey.length])).join('');
  $('resultsBox').textContent+=`\n\nDecrypted unknown: "${pt2}"`;log(`Decrypted: "${pt2}"`,'success');drawCanvas()}
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawCanvas(){if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;const accent=getCS('--accent'),muted=getCS('--text-muted');ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText('Known Plaintext XOR Attack',10,22);
  if(ptBytes.length===0)return;const cellW=Math.min(40,(w-20)/ptBytes.length),rowH=45,startY=50;
  // Plaintext row
  ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Known Plaintext (P)',10,startY-4);
  ptBytes.forEach((b,i)=>{ctx.fillStyle='#4ade8033';ctx.fillRect(10+i*cellW,startY,cellW-2,rowH-5);ctx.fillStyle='#4ade80';ctx.font='9px monospace';ctx.fillText(String.fromCharCode(b),14+i*cellW,startY+15);ctx.fillText(b.toString(16).padStart(2,'0'),14+i*cellW,startY+30)});
  // Ciphertext row
  const ctY=startY+rowH+10;ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Ciphertext (C)',10,ctY-4);
  ctBytes.forEach((b,i)=>{ctx.fillStyle=`${accent}33`;ctx.fillRect(10+i*cellW,ctY,cellW-2,rowH-5);ctx.fillStyle=accent;ctx.font='9px monospace';ctx.fillText(b.toString(16).padStart(2,'0'),14+i*cellW,ctY+20)});
  // XOR arrows
  const xorY=ctY+rowH+5;ctx.fillStyle='#f87171';ctx.font='bold 12px monospace';ptBytes.forEach((_,i)=>{ctx.fillText('XOR',12+i*cellW,xorY+10)});
  // Recovered key row
  const keyY=xorY+25;ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Recovered Key (K = P XOR C)',10,keyY-4);
  (recoveredKey.length?recoveredKey:new Array(ptBytes.length).fill(null)).forEach((b,i)=>{
    ctx.fillStyle=b!==null?'#f8717133':'rgba(255,255,255,.05)';ctx.fillRect(10+i*cellW,keyY,cellW-2,rowH-5);
    if(b!==null){ctx.fillStyle='#f87171';ctx.font='bold 10px monospace';ctx.fillText(String.fromCharCode(b),14+i*cellW,keyY+15);ctx.fillText(b.toString(16).padStart(2,'0'),14+i*cellW,keyY+30)}})}
function buildControls(){$('controlsArea').innerHTML=`<div class="control-section"><div class="section-header"><div class="section-title">Known Plaintext</div></div><input type="text" id="ptInput" value="Hello, World! This is a known message." placeholder="Known plaintext"/></div><div class="control-section"><div style="display:flex;gap:8px;flex-wrap:wrap"><button id="encBtn" class="primary" style="flex:1">Encrypt</button><button id="recoverBtn" style="flex:1">Recover Key (XOR)</button></div></div><div class="control-section"><div class="section-header"><div class="section-title">Unknown Ciphertext (hex, space-separated)</div></div><input type="text" id="unknownInput" placeholder="e.g. 1b 0a 1c ..."/><button id="decBtn" class="btn-sm" style="margin-top:6px">Decrypt Unknown</button></div>`;
  $('encBtn').onclick=doEncrypt;$('recoverBtn').onclick=recoverKey;$('decBtn').onclick=decryptUnknown}
function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'XOR',p:s.wiki_xor},{t:'Stream',p:s.wiki_stream},{t:'Defense',p:s.wiki_defense}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'XOR',p:LANG[currentLang].wiki_xor},{t:'Stream',p:LANG[currentLang].wiki_stream},{t:'Defense',p:LANG[currentLang].wiki_defense}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}
document.addEventListener('DOMContentLoaded',()=>{splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-kpa-lang');if(l&&LANG[l])setLanguage(l)}catch{}try{const t=localStorage.getItem('cry-kpa-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};$('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};$('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  buildControls();buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()});

/* ═══════ ENHANCED KPA VISUALIZATION (IIFE) ═══════ */
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

  // === XOR Truth Table (top-left) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('XOR Operation Properties',10,16);

  const ttW=w*0.3;
  const rows=[['A','B','A^B'],['0','0','0'],['0','1','1'],['1','0','1'],['1','1','0']];
  rows.forEach((row,i)=>{
    const y=24+i*16;
    const isHeader=i===0;
    row.forEach((cell,j)=>{
      const x=10+j*(ttW/3);
      _x.fillStyle=isHeader?acc+'44':'rgba(255,255,255,.03)';
      _x.fillRect(x,y,ttW/3-2,14);
      _x.fillStyle=isHeader?acc:cell==='1'?'#4ade80':'#f87171';
      _x.font=isHeader?'bold 9px SF Mono':'9px SF Mono';_x.textAlign='center';
      _x.fillText(cell,x+ttW/6,y+11);_x.textAlign='left';
    });
  });
  // Key property
  _x.fillStyle='#fbbf24';_x.font='bold 9px SF Mono';
  _x.fillText('P XOR K = C',10,110);
  _x.fillText('C XOR P = K',10,124);
  _x.fillText('C XOR K = P',10,138);
  _x.fillStyle=mut;_x.font='8px Tajawal';
  _x.fillText('XOR is self-inverse!',10,154);

  // === Binary XOR Animation (top-middle) ===
  const bxX=w*0.33,bxW=w*0.34;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Byte-level XOR Recovery',bxX,16);

  const animByte=(_t%8);
  const plainByte=0x48+animByte;// 'H','e','l','l','o'...
  const keyByte=0x53+animByte;
  const cipherByte=plainByte^keyByte;

  for(let bit=7;bit>=0;bit--){
    const x=bxX+(7-bit)*18;
    const pBit=(plainByte>>bit)&1;
    const kBit=(keyByte>>bit)&1;
    const cBit=(cipherByte>>bit)&1;
    // Plaintext bit
    _x.fillStyle=pBit?'#4ade8066':'rgba(255,255,255,.05)';
    _x.fillRect(x,28,16,16);_x.fillStyle=pBit?'#4ade80':mut;_x.font='bold 9px SF Mono';_x.textAlign='center';
    _x.fillText(pBit.toString(),x+8,40);
    // XOR symbol
    _x.fillStyle='#fbbf24';_x.font='bold 10px SF Mono';_x.fillText('\u2295',x+8,58);
    // Key bit
    _x.fillStyle=kBit?'#f8717166':'rgba(255,255,255,.05)';
    _x.fillRect(x,64,16,16);_x.fillStyle=kBit?'#f87171':mut;_x.font='bold 9px SF Mono';
    _x.fillText(kBit.toString(),x+8,76);
    // Equals
    _x.fillStyle=mut;_x.font='bold 10px SF Mono';_x.fillText('=',x+8,94);
    // Cipher bit
    _x.fillStyle=cBit?'#60a5fa66':'rgba(255,255,255,.05)';
    _x.fillRect(x,100,16,16);_x.fillStyle=cBit?'#60a5fa':mut;_x.font='bold 9px SF Mono';
    _x.fillText(cBit.toString(),x+8,112);
    _x.textAlign='left';
  }

  // Labels
  _x.fillStyle='#4ade80';_x.font='8px SF Mono';_x.fillText(`P=0x${plainByte.toString(16)}='${String.fromCharCode(plainByte)}'`,bxX,126);
  _x.fillStyle='#f87171';_x.fillText(`K=0x${keyByte.toString(16)}`,bxX+80,126);
  _x.fillStyle='#60a5fa';_x.fillText(`C=0x${cipherByte.toString(16)}`,bxX+140,126);

  // === Key Stream Reuse Vulnerability (top-right) ===
  const krX=w*0.68,krW=w*0.3;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Key Reuse Attack',krX,16);

  _x.fillStyle='#f87171';_x.font='9px SF Mono';
  _x.fillText('If K reused:',krX,30);
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('C1 = P1 ^ K',krX,44);
  _x.fillText('C2 = P2 ^ K',krX,58);
  _x.fillText('C1^C2 = P1^P2',krX,76);
  _x.fillStyle='#fbbf24';_x.font='bold 8px SF Mono';
  _x.fillText('Key cancels out!',krX,92);
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('If P1 known:',krX,110);
  _x.fillText('P2 = C1^C2^P1',krX,124);
  _x.fillStyle='#4ade80';_x.font='bold 8px SF Mono';
  _x.fillText('All messages exposed!',krX,140);

  // === Frequency Analysis (bottom-left) ===
  const faY=164,faW=w*0.48,faH=h-faY-25;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Ciphertext Frequency Analysis (XOR cipher)',10,faY);

  // Generate frequency data for a simple XOR cipher
  const msg='The quick brown fox jumps over the lazy dog. Crypto is fun!';
  const key='KEY';
  const freq=new Array(256).fill(0);
  for(let i=0;i<msg.length;i++){
    const c=msg.charCodeAt(i)^key.charCodeAt(i%key.length);
    freq[c]++;
  }
  const maxFreq=Math.max(...freq,1);
  const barW=faW/128;
  for(let i=0;i<128;i++){
    if(freq[i]>0){
      const barH=(freq[i]/maxFreq)*(faH-20);
      const hue=(i/128)*360;
      _x.fillStyle=`hsla(${hue},60%,50%,.5)`;
      _x.fillRect(10+i*barW,faY+10+faH-20-barH,barW-1,barH);
    }
  }
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('Non-uniform distribution reveals patterns',10,faY+faH-2);

  // === Stream Cipher Architecture (bottom-right) ===
  const scX=w*0.52,scY=faY,scW=w*0.46,scH=faH;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Stream Cipher Key Stream',scX,scY);

  // PRNG box
  _x.fillStyle='#c084fc33';_x.fillRect(scX,scY+12,80,35);_x.strokeStyle='#c084fc';_x.strokeRect(scX,scY+12,80,35);
  _x.fillStyle='#c084fc';_x.font='bold 9px SF Mono';_x.textAlign='center';
  _x.fillText('PRNG',scX+40,scY+25);
  _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText('(seed=key)',scX+40,scY+38);_x.textAlign='left';

  // Key stream output
  const ksY=scY+55;
  const streamLen=Math.min(16,Math.floor(scW/22));
  for(let i=0;i<streamLen;i++){
    const x=scX+i*22;
    const val=((0xAB*(_t+i)+0x37)&0xFF);
    const active=i<=(_t%streamLen);
    _x.fillStyle=active?'#c084fc33':'rgba(255,255,255,.03)';
    _x.fillRect(x,ksY,20,16);
    if(active){_x.fillStyle='#c084fc';_x.font='bold 7px SF Mono';_x.textAlign='center';_x.fillText(val.toString(16),x+10,ksY+12);_x.textAlign='left'}
  }
  _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText('Key stream bytes',scX,ksY+28);

  // XOR with plaintext
  const xorY=ksY+35;
  _x.fillStyle='#fbbf24';_x.font='bold 10px SF Mono';
  for(let i=0;i<Math.min(streamLen,8);i++){
    _x.fillText('\u2295',scX+i*22+6,xorY+10);
  }

  // Plaintext row
  const ptY=xorY+18;
  for(let i=0;i<Math.min(streamLen,8);i++){
    const x=scX+i*22;
    const ch=msg.charCodeAt(i);
    _x.fillStyle='#4ade8033';_x.fillRect(x,ptY,20,16);
    _x.fillStyle='#4ade80';_x.font='7px SF Mono';_x.textAlign='center';
    _x.fillText(ch.toString(16),x+10,ptY+12);_x.textAlign='left';
  }
  _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText('= Ciphertext',scX,ptY+28);

  // Defense note
  const defY=ptY+38;
  if(defY+15<h){
    _x.fillStyle='#4ade80';_x.font='bold 9px SF Mono';
    _x.fillText('Defense: Never reuse nonce/key (AES-GCM, ChaCha20-Poly1305)',scX,defY);
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
