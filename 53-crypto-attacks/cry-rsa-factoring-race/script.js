/**
 * RSA Factoring Race — Workshop DIY v1.0
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas Sim
 */
const $=id=>document.getElementById(id);

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

const LANG={
  en:{
    ...LANG_BASE.en,
    title:'RSA Factoring Race',subtitle:'Race algorithms to factor RSA moduli N=p*q',
    mainSection:'Factoring Lab',mainDesc:'Enter semiprime N, race Trial Division vs Pollard Rho vs Fermat',
    modulusLabel:'RSA Modulus N',modulusHint:'Enter a semiprime or generate one',
    generate:'Generate',startRace:'Start Race',stop:'Stop',results:'Results',
    vizTitle:'Factoring Visualization',vizHint:'Watch algorithms race to find factors on canvas',
    sectionA:'Algorithm Reference',sectionB:'Math Deep Dive',
    settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    activityLog:'Activity Log',ready:'Ready',
    splashHint:'tap to skip',
    langChanged:'Language -> English',themeChanged:'Theme ->',
    trialDiv:'Trial Division',pollardRho:"Pollard's Rho",fermat:"Fermat's Method",
    found:'Factor found!',noFactor:'No factor found (prime?)',racing:'Racing...',
    howto_1:'The main display shows the Rsa Factoring Race simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for RSA Factoring Race. Choose your',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Algorithm Reference" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_trial:'يختبر كل عدد من 2 إلى جذر N. تعقيد O(sqrt(N)). This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_pollard:'تسلسل شبه عشوائي + كشف الدورات. O(N^1/4) متوقع. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_fermat:'يبحث عن a,b حيث N=a^2-b^2. الأفضل عندما العوامل متقاربة. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    mathExplain:'RSA Key Generation:\n1. Choose two primes p, q\n2. Compute N = p * q (modulus)\n3. Compute phi = (p-1)(q-1)\n4. Choose e coprime to phi\n5. Compute d = e^-1 mod phi\n\nSecurity depends on difficulty of factoring N back into p and q.'
  ,step1Title:'Set Up',step1Desc:'Configure the parameters for RSA Factoring Race. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Algorithm Reference" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Math Deep Dive". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is RSA Factoring Race?',faq_a1:'Rsa Factoring Race is an interactive simulation that demonstrates crypto attacks concepts. Enter semiprime N, race Trial Division vs Pollard Rho vs Fermat. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real cryptography behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real cryptography principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to RSA Factoring Race! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Enter N or generate a semiprime. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Algorithm Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Rsa Factoring Race! This is like a science experiment on your computer. You get to control a real crypto attacks simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for RSA Factoring Race. C Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32)  # 32 bytes = 256 bits\\niv = os.urandom(16)   # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key:        {key.hex()}")\\nprint(f"IV:         {iv.hex()}")\\nprint(f"Plaintext:  {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered:  {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',wiki_concept_title:'🔬 What is RSA Factoring Race?',wiki_concept:'RSA Factoring Race is a technique used in cryptography. Enter semiprime N, race Trial Division vs Pollard Rho vs Fermat. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the parameters for RSA Factoring Race. Choose your input settings using the controls in the main card. Each control directly affects the simulation output. Second: Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs. The simulation runs these stages in real time, showing you intermediate results at each step. In real cryptography, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'RSA Factoring Race has practical applications in cryptography. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'RSA Factoring Race: Enter semiprime N, race Trial Division vs Pollard Rho vs Fermat. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Choose Algorithm through Set Up Attack to Execute Attack and Analyze Results.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Algorithm Reference" and "Math Deep Dive" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Reverse Engineering',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. Rsa Factoring Race builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Rsa Factoring Race',
    wiki_math: 'The mathematics behind Rsa Factoring Race: With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N. RSA: choose primes p,q; compute n=p·q, φ=(p-1)(q-1); choose e coprime to φ; compute d=e⁻¹ mod φ. Encrypt: c=mᵉ mod n. Decrypt: m=cᵈ mod n.',
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
    gloss2_term: 'Public Key',
    gloss2_def: 'The freely shared half of an asymmetric key pair, used for encryption or signature verification. The corresponding private key must remain secret.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Rsa Factoring Race demonstrates key principles from crypto attacks. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. RSA is an asymmetric cipher based on the difficulty of factoring large semiprime numbers. A public key encrypts; only the private key can decrypt. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world reverse engineering?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional reverse engineering systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Communications Interception Hub',related1_desc:'SIGINT collection, signal analysis and traffic monitoring',related1_path:'../../54-rf-warfare/rfw-comms-interception-hub/index.html',related2_name:'VPN Gateway Dashboard',related2_desc:'WireGuard VPN server and gateway manager',related2_path:'../../37-pi-core/pi-vpn-gateway/index.html',related3_name:'GPS Tracker Builder — Covert Tracking Lab',related3_desc:'Build covert GPS trackers and learn vehicle/asset tracking detection',related3_path:'../../52-hardware-implants/imp-gps-tracker-builder/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Replay Attack Lab',pathPrev_path:'../../53-crypto-attacks/cry-replay-attack-forge/index.html',pathNext_name:'Timing Oracle',pathNext_path:'../../53-crypto-attacks/cry-timing-oracle-attack/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What is machine learning?',quiz_q1a:'Programming robots',quiz_q1b:'Systems that learn from data',quiz_q1c:'Manual computation',quiz_q1d:'Hardware design',quiz_q1_answer:'1',quiz_q2:'What is a neural network?',quiz_q2a:'Physical wires',quiz_q2b:'Computing system inspired by biological neurons',quiz_q2c:'Social network',quiz_q2d:'Radio network',quiz_q2_answer:'1',quiz_q3:'What is a hash function?',quiz_q3a:'Encryption method',quiz_q3b:'One-way function producing fixed-size output',quiz_q3c:'Compression algorithm',quiz_q3d:'Random number generator',quiz_q3_answer:'1',quiz_q4:'What is public key cryptography?',quiz_q4a:'Using same key for encrypt/decrypt',quiz_q4b:'Using a key pair (public and private)',quiz_q4c:'No keys needed',quiz_q4d:'Password-based only',quiz_q4_answer:'1',quiz_q5:'What does AI stand for?',quiz_q5a:'Automated Input',quiz_q5b:'Artificial Intelligence',quiz_q5c:'Analog Interface',quiz_q5d:'Active Integration',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'Heartbleed (2014) was a buffer overflow in OpenSSL that let attackers read 64KB of server memory per request — potentially grabbing private keys, passwords, and session tokens from any HTTPS server worldwide.',realworld2:'Alan Turing\'s team at Bletchley Park cracked the Enigma machine during WWII, reading 84,000 encrypted German messages per month by 1945. This achievement shortened the war by an estimated 2 years.',realworld3:'The SolarWinds attack (2020) compromised 18,000 organizations by hiding malware inside trusted software updates. Attackers had 9 months of undetected access to US Treasury, Commerce, and Homeland Security systems.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In AI frontier, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in AI frontier and reveal the hidden complexity beneath simple-looking systems.'},
  fr:{
    title:'Course Factorisation RSA',subtitle:'Faites courir les algorithmes pour factoriser N=p*q',
    mainSection:'Labo Factorisation',mainDesc:'Entrez un semi-premier N, lancez Division, Pollard Rho, Fermat',
    modulusLabel:'Module RSA N',modulusHint:'Entrez un semi-premier ou generez-en un',
    generate:'Generer',startRace:'Lancer la Course',stop:'Arreter',results:'Resultats',
    vizTitle:'Visualisation Factorisation',vizHint:'Regardez les algorithmes chercher les facteurs',
    sectionA:'Reference Algorithmes',sectionB:'Maths Approfondies',
    settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    activityLog:'Journal',ready:'Pret',
    splashHint:'appuyer pour passer',
    langChanged:'Langue -> Francais',themeChanged:'Theme ->',
    trialDiv:'Division par Essai',pollardRho:'Rho de Pollard',fermat:'Methode de Fermat',
    found:'Facteur trouve!',noFactor:'Aucun facteur (premier?)',racing:'Course en cours...',
    howto_1:'L écran principal affiche la simulation Rsa Factoring Race. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for RSA Factoring Race. Choose your',howto_2:'Cliquez Lancer.',howto_3:'Regardez la visualisation.',howto_4:'Comparez les temps.',
    wiki_trial:'Teste chaque entier 2..sqrt(N). Complexite O(sqrt(N)).',
    wiki_pollard:'Sequence pseudo-aleatoire + detection de cycle. O(N^1/4) attendu.',
    wiki_fermat:'Cherche a,b ou N=a^2-b^2. Optimal quand les facteurs sont proches.',
    mathExplain:'Generation de cle RSA:\n1. Choisir deux premiers p, q\n2. Calculer N = p * q\n3. Calculer phi = (p-1)(q-1)\n4. Choisir e copremier a phi\n5. Calculer d = e^-1 mod phi'
  ,step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Rsa Factoring Race est une simulation interactive qui démontre les concepts de attaques crypto. Enter semiprime N, race Trial Division vs Pollard Rho vs Fermat. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Bleichenbacher Attack and Cry Padding Oracle Lab ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 Histoire de rétro-ingénierie',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. Rsa Factoring Race s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Rsa Factoring Race',
    wiki_math: 'Les mathématiques derrière Rsa Factoring Race : With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N. RSA: choose primes p,q; compute n=p·q, φ=(p-1)(q-1); choose e coprime to φ; compute d=e⁻¹ mod φ. Encrypt: c=mᵉ mod n. Decrypt: m=cᵈ mod n.',
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
    gloss2_term: 'Public Key',
    gloss2_def: 'The freely shared half of an asymmetric key pair, used for encryption or signature verification. The corresponding private key must remain secret.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Rsa Factoring Race démontre les principes clés de attaques crypto. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. RSA is an asymmetric cipher based on the difficulty of factoring large semiprime numbers. A public key encrypts; only the private key can decrypt. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec reverse engineering dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Hub d\\',related1_desc:'Collecte SIGINT et analyse du trafic',related1_path:'../../54-rf-warfare/rfw-comms-interception-hub/index.html',related2_name:'Tableau de bord passerelle VPN',related2_desc:'Gestionnaire de serveur VPN WireGuard',related2_path:'../../37-pi-core/pi-vpn-gateway/index.html',related3_name:'Constructeur de traceur GPS',related3_desc:'Construisez des traceurs GPS cachés et apprenez la détection',related3_path:'../../52-hardware-implants/imp-gps-tracker-builder/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Labo Attaque Rejeu',pathPrev_path:'../../53-crypto-attacks/cry-replay-attack-forge/index.html',pathNext_name:'Oracle Temporel',pathNext_path:'../../53-crypto-attacks/cry-timing-oracle-attack/index.html',
    printBtn: '🖨️ Imprimer',realworldTitle:'🌍 Histoires réelles',realworld1:'Heartbleed (2014) était un dépassement de tampon dans OpenSSL qui permettait aux attaquants de lire 64 Ko de mémoire serveur par requête.',realworld2:'L\'équipe d\'Alan Turing à Bletchley Park a décrypté la machine Enigma pendant la WWII, lisant 84 000 messages allemands chiffrés par mois en 1945.',realworld3:'L\'attaque SolarWinds (2020) a compromis 18 000 organisations en cachant des malwares dans des mises à jour logicielles de confiance.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En frontière IA, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en frontière IA et révèlent la complexité cachée sous des systèmes simples en apparence.'},
  ar:{
    title:'سباق تحليل RSA',subtitle:'سابق الخوارزميات لتحليل عوامل RSA حيث N=p*q',
    mainSection:'مختبر التحليل',mainDesc:'أدخل عدد شبه أولي N وسابق خوارزميات التحليل',
    modulusLabel:'معامل RSA N',modulusHint:'أدخل عددا شبه أولي أو ولّد واحدا',
    generate:'توليد',startRace:'بدء السباق',stop:'إيقاف',results:'النتائج',
    vizTitle:'تصور التحليل',vizHint:'شاهد الخوارزميات تتسابق لإيجاد العوامل',
    sectionA:'مرجع الخوارزميات',sectionB:'تعمق رياضي',
    settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',
    help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    activityLog:'سجل النشاط',ready:'جاهز',
    splashHint:'انقر للتخطي',
    langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',
    trialDiv:'القسمة التجريبية',pollardRho:'رو بولارد',fermat:'طريقة فيرما',
    found:'تم إيجاد العامل!',noFactor:'لا يوجد عامل (أولي؟)',racing:'جاري السباق...',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Rsa Factoring Race. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for RSA Factoring Race. Choose your',howto_2:'اضغط بدء السباق.',howto_3:'شاهد التصور البصري.',howto_4:'قارن الأوقات.',
    wiki_trial:'يختبر كل عدد من 2 إلى جذر N. تعقيد O(sqrt(N)).',
    wiki_pollard:'تسلسل شبه عشوائي + كشف الدورات. O(N^1/4) متوقع.',
    wiki_fermat:'يبحث عن a,b حيث N=a^2-b^2. الأفضل عندما العوامل متقاربة.',
    mathExplain:'توليد مفتاح RSA:\n1. اختر عددين أوليين p, q\n2. احسب N = p * q\n3. احسب phi = (p-1)(q-1)\n4. اختر e أولي نسبيا مع phi\n5. احسب d = e^-1 mod phi'
  ,step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Rsa Factoring Race هي محاكاة تفاعلية توضح مفاهيم هجمات التشفير. Enter semiprime N, race Trial Division vs Pollard Rho vs Fermat. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Bleichenbacher Attack and Cry Padding Oracle Lab! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 تاريخ الهندسة العكسية',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. يبني Rsa Factoring Race على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Rsa Factoring Race',
    wiki_math: 'الرياضيات وراء Rsa Factoring Race: With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N. RSA: choose primes p,q; compute n=p·q, φ=(p-1)(q-1); choose e coprime to φ; compute d=e⁻¹ mod φ. Encrypt: c=mᵉ mod n. Decrypt: m=cᵈ mod n.',
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
    gloss2_term: 'Public Key',
    gloss2_def: 'The freely shared half of an asymmetric key pair, used for encryption or signature verification. The corresponding private key must remain secret.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Rsa Factoring Race يوضح المبادئ الأساسية في هجمات التشفير. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. RSA is an asymmetric cipher based on the difficulty of factoring large semiprime numbers. A public key encrypts; only the private key can decrypt. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـreverse engineering في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'\\u0645\\u0631\\u0643\\u0632 \\u0627\\u0639\\u062a\\u0631\\u0627\\u0636 \\u0627\\u0644\\u0627\\u062a\\u0635\\u0627\\u0644\\u0627\\u062a',related1_desc:'\\u062c\\u0645\\u0639 \\u0627\\u0644\\u0627\\u0633\\u062a\\u062e\\u0628\\u0627\\u0631\\u0627\\u062a \\u0648\\u062a\\u062d\\u0644\\u064a\\u0644 \\u0627\\u0644\\u0625\\u0634\\u0627\\u0631\\u0627\\u062a',related1_path:'../../54-rf-warfare/rfw-comms-interception-hub/index.html',related2_name:'لوحة تحكم بوابة VPN',related2_desc:'مدير خادم وبوابة WireGuard VPN',related2_path:'../../37-pi-core/pi-vpn-gateway/index.html',related3_name:'مُنشئ متتبع GPS — مختبر التتبع السري',related3_desc:'بناء متتبعات GPS مخفية وتعلم كشف أجهزة التتبع',related3_path:'../../52-hardware-implants/imp-gps-tracker-builder/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'مختبر هجوم الإعادة',pathPrev_path:'../../53-crypto-attacks/cry-replay-attack-forge/index.html',pathNext_name:'اوراكل التوقيت',pathNext_path:'../../53-crypto-attacks/cry-timing-oracle-attack/index.html',
    printBtn: '🖨️ طباعة',realworldTitle:'🌍 قصص واقعية',realworld1:'كانت ثغرة هارتبليد (2014) تجاوزًا في المخزن المؤقت في OpenSSL سمح للمهاجمين بقراءة 64 كيلوبايت من ذاكرة الخادم لكل طلب.',realworld2:'فك فريق آلان تورينغ في بلتشلي بارك شفرة آلة إنغما خلال الحرب العالمية الثانية وقرأ 84000 رسالة ألمانية مشفرة شهريًا بحلول عام 1945.',realworld3:'اخترق هجوم سولار ويندز (2020) أكثر من 18000 منظمة من خلال إخفاء برامج ضارة داخل تحديثات البرمجيات الموثوقة.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في حدود الذكاء معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في حدود الذكاء وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});

function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang='en';

function setLanguage(lang){
  currentLang=lang;const s=LANG[lang];if(!s)return;
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.documentElement.lang=lang;
  const sel=$('langSelect');if(sel)sel.value=lang;
  try{localStorage.setItem('cry-rsa-lang',lang)}catch{}
  log(s.langChanged,'info');buildHelp();buildRef();buildMath();
}

/* ═══════ THEMES ═══════ */
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){
  document.documentElement.dataset.theme=name;
  document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));
  const sel=$('themeSelect');if(sel)sel.value=name;
  try{localStorage.setItem('cry-rsa-theme',name)}catch{}
  log(`${LANG[currentLang].themeChanged} ${name}`,'info');
}

/* ═══════ SOUND ═══════ */
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){
  if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();
  const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
  osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=.08;const t=audioCtx.currentTime;
  if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.08);osc.start(t);osc.stop(t+.08)}
  else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.3);osc.start(t);osc.stop(t+.3)}
  else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.25)}
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){
  if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;
  const d=document.createElement('div');d.className=`log-line ${type}`;
  d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;
  if(type==='success')playSound('success');else if(type==='error')playSound('error');
}

/* ═══════ TOAST ═══════ */
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}

/* ═══════ PANELS ═══════ */
function togglePanel(panel,overlay){
  panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'));
}

/* ═══════ FACTORING ALGORITHMS ═══════ */
function isPrime(n){if(n<2)return false;if(n<4)return true;if(n%2===0||n%3===0)return false;for(let i=5;i*i<=n;i+=6)if(n%i===0||n%(i+2)===0)return false;return true}
function randomPrime(min,max){let p;do{p=min+Math.floor(Math.random()*(max-min))}while(!isPrime(p));return p}

function trialDivision(n,stepCb){
  const start=performance.now();let steps=0;
  if(n%2===0){stepCb&&stepCb(2,steps);return{factor:2,steps:1,time:performance.now()-start}}
  for(let i=3;i*i<=n;i+=2){steps++;if(stepCb)stepCb(i,steps);if(n%i===0)return{factor:i,steps,time:performance.now()-start}}
  return{factor:null,steps,time:performance.now()-start}
}

function pollardRho(n,stepCb){
  const start=performance.now();let steps=0;
  if(n%2===0)return{factor:2,steps:1,time:performance.now()-start};
  let x=Math.floor(Math.random()*(n-2))+2,y=x,c=Math.floor(Math.random()*(n-1))+1,d=1;
  const f=v=>(Number(BigInt(v)*BigInt(v)+BigInt(c))%n+n)%n;
  function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a}
  while(d===1&&steps<1e6){x=f(x);y=f(f(y));d=gcd(Math.abs(x-y),n);steps++;if(stepCb)stepCb(x,steps)}
  if(d!==n&&d!==1)return{factor:d,steps,time:performance.now()-start};
  return{factor:null,steps,time:performance.now()-start}
}

function fermatFactor(n,stepCb){
  const start=performance.now();let steps=0;
  if(n%2===0)return{factor:2,steps:1,time:performance.now()-start};
  let a=Math.ceil(Math.sqrt(n));
  while(steps<1e6){const b2=a*a-n;const b=Math.round(Math.sqrt(b2));steps++;
    if(stepCb)stepCb(a,steps);
    if(b*b===b2&&a-b>1&&a+b<n)return{factor:a-b,steps,time:performance.now()-start};
    a++;
  }
  return{factor:null,steps,time:performance.now()-start}
}

/* ═══════ CANVAS SIMULATION ═══════ */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
let animFrame,raceData={trial:[],pollard:[],fermat:[]},raceRunning=false;

function resizeCanvas(){
  if(!canvas)return;const r=canvas.getBoundingClientRect();
  canvas.width=r.width*window.devicePixelRatio;canvas.height=r.height*window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
}

function getCS(prop){return getComputedStyle(document.documentElement).getPropertyValue(prop).trim()}

function drawRace(){
  if(!ctx)return;
  const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),accent2=getCS('--accent2'),text=getCS('--text'),muted=getCS('--text-muted');

  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='rgba(0,0,0,.05)';ctx.fillRect(0,0,w,h);

  // Title
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';
  ctx.fillText('RSA Factoring Race',10,22);
  const N=$('modulusInput')?parseInt($('modulusInput').value):1073;
  ctx.fillStyle=muted;ctx.font='11px Tajawal,sans-serif';
  ctx.fillText(`N = ${N}`,10,38);

  const lanes=[
    {name:LANG[currentLang].trialDiv,data:raceData.trial,color:'#f87171'},
    {name:LANG[currentLang].pollardRho,data:raceData.pollard,color:'#4ade80'},
    {name:LANG[currentLang].fermat,data:raceData.fermat,color:'#60a5fa'}
  ];

  const laneH=(h-60)/3,startY=50;

  lanes.forEach((lane,i)=>{
    const y=startY+i*laneH;
    // Lane background
    ctx.fillStyle=`${lane.color}11`;ctx.fillRect(5,y,w-10,laneH-5);
    ctx.strokeStyle=`${lane.color}44`;ctx.strokeRect(5,y,w-10,laneH-5);
    // Lane label
    ctx.fillStyle=lane.color;ctx.font='bold 12px Tajawal,sans-serif';
    ctx.fillText(lane.name,12,y+16);

    // Progress bar
    const maxSteps=Math.max(1,...lanes.map(l=>l.data.length));
    const progress=lane.data.length/maxSteps;
    ctx.fillStyle=`${lane.color}33`;ctx.fillRect(10,y+22,progress*(w-25),12);
    ctx.fillStyle=lane.color;ctx.fillRect(10,y+22,Math.min(progress*(w-25),progress*(w-25)),12);

    // Steps count
    ctx.fillStyle=text;ctx.font='10px SF Mono,monospace';
    ctx.fillText(`Steps: ${lane.data.length}`,12,y+50);

    // Draw number line of tested values
    if(lane.data.length>0){
      const last=lane.data[lane.data.length-1];
      ctx.fillStyle=muted;ctx.fillText(`Current: ${last.val}`,120,y+50);

      // Mini scatter plot of tested values
      const sqrtN=Math.sqrt(N);
      const plotY=y+58,plotH=laneH-70;
      if(plotH>10){
        ctx.strokeStyle=`${lane.color}22`;ctx.beginPath();ctx.moveTo(10,plotY+plotH);ctx.lineTo(w-10,plotY+plotH);ctx.stroke();
        const maxVals=Math.min(lane.data.length,200);
        const startIdx=Math.max(0,lane.data.length-maxVals);
        for(let j=startIdx;j<lane.data.length;j++){
          const v=lane.data[j].val;
          const px=10+((j-startIdx)/(maxVals))*(w-25);
          const py=plotY+plotH-(v/sqrtN)*plotH*.8;
          ctx.fillStyle=`${lane.color}88`;
          ctx.beginPath();ctx.arc(px,Math.max(plotY,Math.min(plotY+plotH,py)),2,0,Math.PI*2);ctx.fill();
        }
        // Mark found factor
        if(lane.data.length>0&&lane.data[lane.data.length-1].found){
          const fv=lane.data[lane.data.length-1].val;
          ctx.fillStyle=lane.color;ctx.font='bold 11px Tajawal';
          ctx.fillText(`p=${fv}, q=${N/fv}`,w/2,y+50);
          ctx.beginPath();ctx.arc(w-30,plotY+plotH/2,8,0,Math.PI*2);ctx.fillStyle=lane.color;ctx.fill();
          ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.fillText('!',w-33,plotY+plotH/2+4);
        }
      }
    }
  });

  if(raceRunning)animFrame=requestAnimationFrame(drawRace);
}

function startRace(){
  const N=parseInt($('modulusInput').value);
  if(!N||N<4){log('Enter N >= 4','error');return}
  raceData={trial:[],pollard:[],fermat:[]};
  raceRunning=true;
  const s=LANG[currentLang];
  log(s.racing,'info');showToast(s.racing);
  $('resultsBox').textContent='';

  resizeCanvas();drawRace();

  // Run algorithms asynchronously using setTimeout chunks
  let trialDone=false,pollardDone=false,fermatDone=false;
  let trialResult=null,pollardResult=null,fermatResult=null;

  // Trial Division
  const trialStart=performance.now();
  let ti=2,trialSteps=0;
  function trialStep(){
    if(!raceRunning)return;
    const batch=500;
    for(let b=0;b<batch&&ti*ti<=N;b++){
      trialSteps++;raceData.trial.push({val:ti,found:false});
      if(N%ti===0){raceData.trial[raceData.trial.length-1].found=true;trialResult={factor:ti,steps:trialSteps,time:performance.now()-trialStart};trialDone=true;checkAllDone();return}
      ti+=ti===2?1:2;
    }
    if(ti*ti>N){trialResult={factor:null,steps:trialSteps,time:performance.now()-trialStart};trialDone=true;checkAllDone();return}
    setTimeout(trialStep,0);
  }

  // Pollard Rho
  const pollardStart=performance.now();
  let px=Math.floor(Math.random()*(N-2))+2,py=px,pc=Math.floor(Math.random()*(N-1))+1,pd=1,pSteps=0;
  function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a}
  function pf(v){return(Number(BigInt(v)*BigInt(v)+BigInt(pc))%N+N)%N}
  function pollardStep(){
    if(!raceRunning)return;
    const batch=500;
    for(let b=0;b<batch;b++){
      px=pf(px);py=pf(pf(py));pd=gcd(Math.abs(px-py),N);pSteps++;
      raceData.pollard.push({val:px,found:false});
      if(pd!==1&&pd!==N){raceData.pollard[raceData.pollard.length-1].found=true;pollardResult={factor:pd,steps:pSteps,time:performance.now()-pollardStart};pollardDone=true;checkAllDone();return}
      if(pd===N||pSteps>1e5){pollardResult={factor:null,steps:pSteps,time:performance.now()-pollardStart};pollardDone=true;checkAllDone();return}
    }
    setTimeout(pollardStep,0);
  }

  // Fermat
  const fermatStart=performance.now();
  let fa=Math.ceil(Math.sqrt(N)),fSteps=0;
  function fermatStep(){
    if(!raceRunning)return;
    const batch=500;
    for(let b=0;b<batch;b++){
      const b2=fa*fa-N;const fb=Math.round(Math.sqrt(b2));fSteps++;
      raceData.fermat.push({val:fa,found:false});
      if(fb*fb===b2&&fa-fb>1&&fa+fb<N){raceData.fermat[raceData.fermat.length-1].found=true;fermatResult={factor:fa-fb,steps:fSteps,time:performance.now()-fermatStart};fermatDone=true;checkAllDone();return}
      fa++;if(fSteps>1e5){fermatResult={factor:null,steps:fSteps,time:performance.now()-fermatStart};fermatDone=true;checkAllDone();return}
    }
    setTimeout(fermatStep,0);
  }

  function checkAllDone(){
    if(!trialDone||!pollardDone||!fermatDone)return;
    raceRunning=false;hideToast();drawRace();
    const s=LANG[currentLang];
    let out=`N = ${N}\n\n`;
    [{name:s.trialDiv,r:trialResult},{name:s.pollardRho,r:pollardResult},{name:s.fermat,r:fermatResult}].forEach(a=>{
      out+=`${a.name}:\n`;
      if(a.r.factor){out+=`  ${s.found} p=${a.r.factor}, q=${N/a.r.factor}\n`;out+=`  Steps: ${a.r.steps}, Time: ${a.r.time.toFixed(2)}ms\n\n`;log(`${a.name}: p=${a.r.factor} (${a.r.steps} steps, ${a.r.time.toFixed(1)}ms)`,'success')}
      else{out+=`  ${s.noFactor}\n  Steps: ${a.r.steps}, Time: ${a.r.time.toFixed(2)}ms\n\n`;log(`${a.name}: ${s.noFactor}`,'error')}
    });
    // Determine winner
    const results=[{name:s.trialDiv,r:trialResult},{name:s.pollardRho,r:pollardResult},{name:s.fermat,r:fermatResult}].filter(a=>a.r.factor);
    if(results.length){results.sort((a,b)=>a.r.time-b.r.time);out+=`Winner: ${results[0].name} (${results[0].r.time.toFixed(2)}ms)`}
    $('resultsBox').textContent=out;
  }

  setTimeout(trialStep,0);setTimeout(pollardStep,0);setTimeout(fermatStep,0);
}

function stopRace(){raceRunning=false;hideToast();if(animFrame)cancelAnimationFrame(animFrame);log('Race stopped','info')}

/* ═══════ BUILD DYNAMIC SECTIONS ═══════ */
function buildHelp(){
  const s=LANG[currentLang];
  $('helpFaq').innerHTML=[
    {q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}
  ].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');
  $('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');
  $('helpWiki').innerHTML=[
    {t:s.trialDiv,p:s.wiki_trial},{t:s.pollardRho,p:s.wiki_pollard},{t:s.fermat,p:s.wiki_fermat}
  ].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('');
}

function buildRef(){
  const s=LANG[currentLang];
  $('refCard').innerHTML=[
    {t:s.trialDiv,p:s.wiki_trial},{t:s.pollardRho,p:s.wiki_pollard},{t:s.fermat,p:s.wiki_fermat}
  ].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('');
}

function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);
  resizeCanvas();window.addEventListener('resize',resizeCanvas);

  // Restore prefs
  try{const l=localStorage.getItem('cry-rsa-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-rsa-theme');if(t)setTheme(t)}catch{}

  // Panels
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));
  $('logCloseBtn').onclick=()=>togglePanel($('logPanel'));

  // Settings
  $('langSelect').onchange=e=>setLanguage(e.target.value);
  $('themeSelect').onchange=e=>setTheme(e.target.value);
  $('soundToggle').onchange=e=>{soundEnabled=e.target.checked;playSound('click')};

  // Log
  $('clearLogBtn').onclick=()=>{logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log('Log cleared')};
  $('copyLogBtn').onclick=async()=>{const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log('Copied!','success')}catch{log('Copy failed','error')}};

  // Log filters
  document.querySelectorAll('.log-filter').forEach(btn=>{
    btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
      const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})}
  });

  // Help tabs
  document.querySelectorAll('.help-tab').forEach(tab=>{
    tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');
      document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));
      $(`help${tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)}`).classList.add('active')}
  });

  // Race controls
  $('raceBtn').onclick=startRace;
  $('stopBtn').onclick=stopRace;
  $('genBtn').onclick=()=>{const p=randomPrime(50,500),q=randomPrime(50,500);$('modulusInput').value=p*q;log(`Generated N=${p*q} (${p} x ${q})`,'success')};

  buildHelp();buildRef();buildMath();
  log(LANG[currentLang].ready,'success');

  // Draw initial canvas
  drawRace();
});

/* ═══════ ENHANCED CRYPTO VISUALIZATION (IIFE) ═══════ */
(function(){
const _c2=document.createElement('canvas');
_c2.id='cryptoVizCanvas';
_c2.style.cssText='width:100%;height:340px;border-radius:12px;margin-top:12px;display:block;background:rgba(0,0,0,.12)';
const vizSect=document.querySelector('.visualization-section')||document.querySelector('.card');
if(vizSect)vizSect.appendChild(_c2);
const _x2=_c2.getContext('2d');
let _raf,_tick=0,_primes=[],_sieve=[],_keyBits=[];

function _resize(){const r=_c2.getBoundingClientRect();_c2.width=r.width*devicePixelRatio;_c2.height=r.height*devicePixelRatio;_x2.scale(devicePixelRatio,devicePixelRatio)}
window.addEventListener('resize',_resize);_resize();

// Generate small primes via Sieve of Eratosthenes for visualization
function genSieve(max){
  const s=new Uint8Array(max+1);
  for(let i=2;i*i<=max;i++)if(!s[i])for(let j=i*i;j<=max;j+=i)s[j]=1;
  _primes=[];_sieve=s;
  for(let i=2;i<=max;i++)if(!s[i])_primes.push(i);
}
genSieve(500);

// Generate RSA key space visualization data
function genKeySpace(){
  _keyBits=[];
  for(let i=0;i<64;i++){
    const b=[];
    for(let j=0;j<64;j++)b.push(Math.random());
    _keyBits.push(b);
  }
}
genKeySpace();

function _gc(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function drawEnhanced(){
  const w=_c2.getBoundingClientRect().width,h=_c2.getBoundingClientRect().height;
  const acc=_gc('--accent'),acc2=_gc('--accent2'),txt=_gc('--text'),mut=_gc('--text-muted');
  _x2.clearRect(0,0,w,h);
  _tick++;

  // === Section 1: Prime Sieve Visualization (top-left) ===
  _x2.fillStyle=acc;_x2.font='bold 12px Righteous,Tajawal,sans-serif';
  _x2.fillText('Prime Number Sieve (Eratosthenes)',10,18);
  const sieveW=w*0.48,sieveH=90,sieveX=10,sieveY=28;
  const cols=Math.ceil(Math.sqrt(500)),cellSz=Math.min(sieveW/cols,sieveH/Math.ceil(500/cols));
  for(let n=2;n<=Math.min(500,cols*Math.ceil(sieveH/cellSz));n++){
    const col=(n-2)%cols,row=Math.floor((n-2)/cols);
    const cx=sieveX+col*cellSz,cy=sieveY+row*cellSz;
    if(cy>sieveY+sieveH)break;
    const isPrime=!_sieve[n];
    const isActive=(n<=(_tick%500)+2);
    if(isPrime){
      _x2.fillStyle=isActive?`${acc}cc`:`${acc}44`;
      _x2.beginPath();_x2.arc(cx+cellSz/2,cy+cellSz/2,cellSz*0.35,0,Math.PI*2);_x2.fill();
    }else{
      _x2.fillStyle='rgba(255,255,255,.03)';
      _x2.fillRect(cx+1,cy+1,cellSz-2,cellSz-2);
    }
  }
  _x2.fillStyle=mut;_x2.font='9px Tajawal';
  _x2.fillText(`Primes found: ${_primes.length} in [2..500]`,sieveX,sieveY+sieveH+12);

  // === Section 2: RSA Key Space Heatmap (top-right) ===
  const ksX=w*0.52,ksY=10;
  _x2.fillStyle=acc2||acc;_x2.font='bold 12px Righteous,Tajawal,sans-serif';
  _x2.fillText('RSA Key Space Exploration',ksX,18);
  const ksW=w*0.46,ksH=90;
  const kCellW=ksW/64,kCellH=ksH/64;
  for(let i=0;i<64;i++){
    for(let j=0;j<64;j++){
      const val=_keyBits[i][j];
      const dist=Math.sqrt((i-32)**2+(j-32)**2)/45;
      const wave=Math.sin(_tick*0.03+i*0.1+j*0.1)*0.3+0.5;
      const heat=val*wave*(1-dist*0.5);
      const r=Math.floor(heat*180+40),g=Math.floor(heat*80+20),b=Math.floor((1-heat)*120+60);
      _x2.fillStyle=`rgb(${r},${g},${b})`;
      _x2.fillRect(ksX+j*kCellW,ksY+18+i*kCellH,kCellW,kCellH);
    }
  }
  // Scanning line
  const scanY=ksY+18+(_tick%64)*kCellH;
  _x2.fillStyle='rgba(255,255,255,.15)';
  _x2.fillRect(ksX,scanY,ksW,kCellH*2);
  _x2.fillStyle=mut;_x2.font='9px Tajawal';
  _x2.fillText('2048-bit key space (each pixel = 2^20 keys)',ksX,ksY+ksH+30);

  // === Section 3: Factoring Complexity Curves (bottom-left) ===
  const crvX=10,crvY=sieveY+sieveH+26,crvW=w*0.48,crvH=h-crvY-30;
  _x2.fillStyle=acc;_x2.font='bold 11px Righteous,Tajawal,sans-serif';
  _x2.fillText('Factoring Complexity: bits vs operations',crvX,crvY);
  // Axes
  _x2.strokeStyle=mut+'44';_x2.lineWidth=1;
  _x2.beginPath();_x2.moveTo(crvX+30,crvY+10);_x2.lineTo(crvX+30,crvY+crvH);_x2.lineTo(crvX+crvW,crvY+crvH);_x2.stroke();
  _x2.fillStyle=mut;_x2.font='8px SF Mono,monospace';
  _x2.fillText('bits',crvX+crvW/2,crvY+crvH+12);

  const algos=[
    {name:'Trial Div O(2^(n/2))',color:'#f87171',fn:x=>Math.pow(2,x/2)},
    {name:'Pollard Rho O(2^(n/4))',color:'#4ade80',fn:x=>Math.pow(2,x/4)},
    {name:'GNFS O(e^(n^(1/3)))',color:'#60a5fa',fn:x=>Math.exp(1.923*Math.pow(x*Math.log(2),1/3)*Math.pow(Math.log(x*Math.log(2)),2/3))},
    {name:"Shor's O(n^3)",color:'#c084fc',fn:x=>Math.pow(x,3)}
  ];

  const maxBits=120,maxOps=Math.pow(2,60);
  algos.forEach((algo,ai)=>{
    _x2.strokeStyle=algo.color;_x2.lineWidth=1.5;_x2.beginPath();
    let started=false;
    for(let b=4;b<=maxBits;b++){
      const ops=algo.fn(b);
      const px=crvX+30+(b/maxBits)*(crvW-35);
      const logOps=Math.log2(Math.max(1,ops));
      const py=crvY+crvH-(logOps/60)*crvH+10;
      if(py<crvY+10)break;
      if(!started){_x2.moveTo(px,py);started=true}else _x2.lineTo(px,py);
    }
    _x2.stroke();
    // Label with animated pulse at current tick position
    const labelY=crvY+18+ai*11;
    _x2.fillStyle=algo.color;_x2.font='8px SF Mono';
    _x2.fillText(algo.name,crvX+35,labelY);
  });

  // Animated cursor showing "current factoring progress"
  const curBit=32+Math.sin(_tick*0.02)*28;
  const curX=crvX+30+(curBit/maxBits)*(crvW-35);
  _x2.strokeStyle='rgba(255,255,255,.4)';_x2.setLineDash([3,3]);
  _x2.beginPath();_x2.moveTo(curX,crvY+10);_x2.lineTo(curX,crvY+crvH);_x2.stroke();
  _x2.setLineDash([]);
  _x2.fillStyle='#fff';_x2.font='8px SF Mono';
  _x2.fillText(`${Math.round(curBit)} bits`,curX-12,crvY+crvH+12);

  // === Section 4: Modular Arithmetic Animation (bottom-right) ===
  const modX=w*0.52,modY=crvY,modW=w*0.46,modH=crvH;
  _x2.fillStyle=acc2||acc;_x2.font='bold 11px Righteous,Tajawal,sans-serif';
  _x2.fillText('Modular Exponentiation: a^x mod N',modX,modY);

  const N=97,a=3;
  const orbLen=Math.min(N,96);
  const orbCX=modX+modW/2,orbCY=modY+modH/2+5;
  const orbR=Math.min(modW,modH)*0.35;

  // Draw orbit circle
  _x2.strokeStyle=mut+'22';_x2.lineWidth=1;
  _x2.beginPath();_x2.arc(orbCX,orbCY,orbR,0,Math.PI*2);_x2.stroke();

  // Plot a^x mod N values around the circle
  let val=1;
  for(let x=0;x<orbLen;x++){
    const angle=(x/orbLen)*Math.PI*2-Math.PI/2;
    const px=orbCX+Math.cos(angle)*orbR;
    const py=orbCY+Math.sin(angle)*orbR;
    const isActive=x<=(_tick%orbLen);
    const sz=isActive?3.5:2;
    _x2.fillStyle=isActive?`hsl(${(val/N)*360},70%,60%)`:`${acc}22`;
    _x2.beginPath();_x2.arc(px,py,sz,0,Math.PI*2);_x2.fill();

    // Connect sequential values with lines
    if(x>0&&isActive){
      const prevAngle=((x-1)/orbLen)*Math.PI*2-Math.PI/2;
      const ppx=orbCX+Math.cos(prevAngle)*orbR;
      const ppy=orbCY+Math.sin(prevAngle)*orbR;
      _x2.strokeStyle=`hsla(${(val/N)*360},70%,60%,.2)`;_x2.lineWidth=0.8;
      _x2.beginPath();_x2.moveTo(ppx,ppy);_x2.lineTo(px,py);_x2.stroke();
    }
    val=(val*a)%N;
  }

  // Center text
  _x2.fillStyle=txt;_x2.font='bold 10px SF Mono';_x2.textAlign='center';
  _x2.fillText(`${a}^x mod ${N}`,orbCX,orbCY-6);
  _x2.fillStyle=mut;_x2.font='9px Tajawal';
  _x2.fillText(`x = ${_tick%orbLen}`,orbCX,orbCY+8);
  _x2.fillText(`val = ${(() => {let v=1;for(let i=0;i<_tick%orbLen;i++)v=(v*a)%N;return v})()}`,orbCX,orbCY+20);
  _x2.textAlign='left';

  // Phi function visualization (small)
  const phiY=modY+modH-20;
  _x2.fillStyle=mut;_x2.font='9px SF Mono';
  _x2.fillText(`phi(${N})=${(() => {let c=0;for(let i=1;i<N;i++){let g=N,b=i;while(b){[g,b]=[b,g%b]}if(g===1)c++}return c})()}  |  Period detection via GCD`,modX,phiY);

  _raf=requestAnimationFrame(drawEnhanced);
}
drawEnhanced();
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
