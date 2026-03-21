/**
 * X.509 Certificate Forgery Lab — Workshop DIY v1.0
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas PKI Visualization
 */
const $=id=>document.getElementById(id);

/* ======= i18n ======= */
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
    title:'X.509 Certificate Forgery Lab',subtitle:'Forge certificates, explore PKI chain validation bypass',
    mainSection:'Certificate Forge',mainDesc:'Create root CA, intermediate, and leaf certificates, then attempt forgery',
    caLabel:'Root CA Common Name',caHint:'Name for the trusted root certificate authority',
    leafLabel:'Target Domain',leafHint:'Domain the forged certificate will claim',
    attackLabel:'Attack Type',
    forgeCert:'Forge Certificate',verifyChain:'Verify Chain',reset:'Reset',results:'Results',
    vizTitle:'PKI Chain Visualization',vizHint:'Watch the certificate chain and forgery attempts',
    sectionA:'Attack Reference',sectionB:'PKI Deep Dive',
    settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',
    langChanged:'Language -> English',themeChanged:'Theme ->',
    selfSigned:'Self-Signed Forgery',chainBreak:'Chain Validation Bypass',
    nullByte:'Null-Byte CN Injection',hashCollision:'Hash Collision (MD5)',
    forging:'Forging certificate...',forged:'Certificate forged!',
    verifying:'Verifying chain...',chainValid:'Chain VALID',chainInvalid:'Chain INVALID (forgery detected)',
    resetDone:'All certificates cleared',
    howto_1:'The main display shows the Certificate Forgery Lab simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for X.509 Certificate Forgery Lab. ',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Attack Reference" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_self:'ذاتي التوقيع: شهادة موقعة بمفتاحها الخاص، غير موثوقة من CA. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_chain:'تجاوز السلسلة: عدم التحقق من الشهادة الوسيطة. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_null:'بايت فارغ: CN=evil.com\\x00.target.com يخدع المحللين. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_md5:'تصادم MD5: شهادتان مختلفتان بنفس هاش MD5. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    mathExplain:'X.509 Certificate Chain:\n1. Root CA (self-signed, trusted by OS/browser)\n2. Intermediate CA (signed by Root)\n3. Leaf cert (signed by Intermediate)\n\nValidation: Browser walks chain from leaf to root,\nchecking each signature: verify(parent.pubkey, child.sig)\n\nAttack vectors:\n- Self-signed: skip chain entirely\n- Chain break: forge intermediate with different key\n- Null-byte: CN parsing vulnerability\n- MD5 collision: forge cert with matching hash'
  ,step1Title:'Set Up',step1Desc:'Configure the parameters for X.509 Certificate Forgery Lab. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Attack Reference" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "PKI Deep Dive". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is X.509 Certificate Forgery Lab?',faq_a1:'Certificate Forgery Lab is an interactive simulation that demonstrates crypto attacks concepts. Create root CA, intermediate, and leaf certificates, then attempt forgery. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real cryptography behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real cryptography principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to X.509 Certificate Forgery Lab! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Enter a root CA name and target domain. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Attack Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Certificate Forgery Lab! This is like a science experiment on your computer. You get to control a real crypto attacks simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for X.509 Certificate For Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32)  # 32 bytes = 256 bits\\niv = os.urandom(16)   # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key:        {key.hex()}")\\nprint(f"IV:         {iv.hex()}")\\nprint(f"Plaintext:  {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered:  {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',wiki_concept_title:'🔬 What is X.509 Certificate Forgery Lab?',wiki_concept:'X.509 Certificate Forgery Lab is a technique used in cryptography. Create root CA, intermediate, and leaf certificates, then attempt forgery. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the parameters for X.509 Certificate Forgery Lab. Choose your input settings using the controls in the main card. Each control directly affects the simulation output. Second: Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs. The simulation runs these stages in real time, showing you intermediate results at each step. In real cryptography, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'X.509 Certificate Forgery Lab has practical applications in cryptography. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'X.509 Certificate Forgery Lab: Create root CA, intermediate, and leaf certificates, then attempt forgery. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Choose Algorithm through Set Up Attack to Execute Attack and Analyze Results.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Attack Reference" and "PKI Deep Dive" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Reverse Engineering',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. Certificate Forgery Lab builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Certificate Forgery Lab',
    wiki_math: 'The mathematics behind Certificate Forgery Lab: With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
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
    theory: 'Certificate Forgery Lab demonstrates key principles from crypto attacks. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world reverse engineering?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional reverse engineering systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Field Comms — Secure Channel',related1_desc:'Portable encrypted comms with mesh relay and HF backup',related1_path:'../../39-agent-gear/kit-field-comms/index.html',related2_name:'Magnetic Stripe Cloner — Card Skimming Lab',related2_desc:'Simulate magnetic stripe reading, cloning, and skimmer detection',related2_path:'../../52-hardware-implants/imp-magnetic-stripe-cloner/index.html',related3_name:'Deepfake Voice Cloner',related3_desc:'AI voice cloning simulation for security awareness',related3_path:'../../51-social-engineering/se-deepfake-voice-cloner/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Padding Oracle Lab',pathPrev_path:'../../53-crypto-attacks/cry-bleichenbacher-attack/index.html',pathNext_name:'EC Discrete Log',pathNext_path:'../../53-crypto-attacks/cry-elliptic-curve-attack/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What is a hash function?',quiz_q1a:'Encryption method',quiz_q1b:'One-way function producing fixed-size output',quiz_q1c:'Compression algorithm',quiz_q1d:'Random number generator',quiz_q1_answer:'1',quiz_q2:'What is a neural network?',quiz_q2a:'Physical wires',quiz_q2b:'Computing system inspired by biological neurons',quiz_q2c:'Social network',quiz_q2d:'Radio network',quiz_q2_answer:'1',quiz_q3:'What is public key cryptography?',quiz_q3a:'Using same key for encrypt/decrypt',quiz_q3b:'Using a key pair (public and private)',quiz_q3c:'No keys needed',quiz_q3d:'Password-based only',quiz_q3_answer:'1',quiz_q4:'What does RSA stand for?',quiz_q4a:'Random Secure Algorithm',quiz_q4b:'Rivest-Shamir-Adleman',quiz_q4c:'Rapid Signal Authentication',quiz_q4d:'Radio Security Architecture',quiz_q4_answer:'1',quiz_q5:'What is machine learning?',quiz_q5a:'Programming robots',quiz_q5b:'Systems that learn from data',quiz_q5c:'Manual computation',quiz_q5d:'Hardware design',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'The SolarWinds attack (2020) compromised 18,000 organizations by hiding malware inside trusted software updates. Attackers had 9 months of undetected access to US Treasury, Commerce, and Homeland Security systems.',realworld2:'Heartbleed (2014) was a buffer overflow in OpenSSL that let attackers read 64KB of server memory per request — potentially grabbing private keys, passwords, and session tokens from any HTTPS server worldwide.',realworld3:'Alan Turing\'s team at Bletchley Park cracked the Enigma machine during WWII, reading 84,000 encrypted German messages per month by 1945. This achievement shortened the war by an estimated 2 years.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In AI frontier, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in AI frontier and reveal the hidden complexity beneath simple-looking systems.',proTipTitle:'💡 Pro Tips',proTip1:'Use your browser\\x27s Performance tab to measure frame rate. If the simulation drops below 30fps, reduce the data points or update interval for smoother animation.',proTip2:'Export simulation data using the Copy button, paste into a spreadsheet, and create your own charts. Comparing multiple runs in a chart reveals patterns invisible on screen.',funFactTitle:'🎯 Did You Know?',funFact:'The Caesar cipher, used by Julius Caesar 2000 years ago, shifts each letter by a fixed number. With only 25 possible shifts, a child can crack it in minutes — yet it secured Roman military communications.',mistakeTitle:'⚠️ Common Mistakes',mistake1:'Changing multiple parameters at once makes it impossible to isolate cause and effect. Always change ONE variable at a time.',mistake2:'Skipping the baseline measurement. Without knowing the default behavior, you cannot measure how your changes affect the system.',mistake3:'Ignoring the activity log. It records every event with timestamps — essential for understanding sequences and debugging unexpected results.'},
  fr:{
    title:'Labo Falsification de Certificats X.509',subtitle:'Falsifiez des certificats, contournez la validation PKI',
    mainSection:'Forge de Certificat',mainDesc:'Creez un CA racine, intermediaire et certificat feuille, puis tentez la falsification',
    caLabel:'Nom du CA Racine',caHint:'Nom de l\'autorite de certification racine',
    leafLabel:'Domaine Cible',leafHint:'Domaine que le certificat falsifie revendiquera',
    attackLabel:'Type d\'Attaque',
    forgeCert:'Falsifier le Certificat',verifyChain:'Verifier la Chaine',reset:'Reinitialiser',results:'Resultats',
    vizTitle:'Visualisation de la Chaine PKI',vizHint:'Observez la chaine de certificats et les tentatives de falsification',
    sectionA:'Reference des Attaques',sectionB:'PKI en Profondeur',
    settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',
    langChanged:'Langue -> Francais',themeChanged:'Theme ->',
    selfSigned:'Falsification Auto-Signee',chainBreak:'Contournement de Chaine',
    nullByte:'Injection Null-Byte CN',hashCollision:'Collision de Hachage (MD5)',
    forging:'Falsification en cours...',forged:'Certificat falsifie!',
    verifying:'Verification de la chaine...',chainValid:'Chaine VALIDE',chainInvalid:'Chaine INVALIDE (falsification detectee)',
    resetDone:'Tous les certificats effaces',
    howto_1:'L écran principal affiche la simulation Certificate Forgery Lab. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for X.509 Certificate Forgery Lab. ',howto_2:'Choisissez un type d\'attaque.',howto_3:'Cliquez sur Falsifier le Certificat.',howto_4:'Cliquez sur Verifier la Chaine.',
    wiki_self:'Auto-signe: Certificat signe par sa propre cle, non approuve par un CA.',
    wiki_chain:'Contournement de chaine: Validation intermediaire manquante.',
    wiki_null:'Null-byte: CN=evil.com\\x00.cible.com trompe les parseurs.',
    wiki_md5:'Collision MD5: Deux certificats differents avec le meme hachage MD5.',
    mathExplain:'Chaine de Certificats X.509:\n1. CA Racine (auto-signe, approuve par OS/navigateur)\n2. CA Intermediaire (signe par Racine)\n3. Certificat feuille (signe par Intermediaire)\n\nValidation: Le navigateur parcourt la chaine,\nverifiant chaque signature.'
  ,step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Certificate Forgery Lab est une simulation interactive qui démontre les concepts de attaques crypto. Create root CA, intermediate, and leaf certificates, then attempt forgery. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Aes Side Channel and Cry Replay Attack Forge ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 Histoire de rétro-ingénierie',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. Certificate Forgery Lab s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Certificate Forgery Lab',
    wiki_math: 'Les mathématiques derrière Certificate Forgery Lab : With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
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
    theory: 'Certificate Forgery Lab démontre les principes clés de attaques crypto. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec reverse engineering dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Comms Terrain — Canal Sécurisé',related1_desc:'Communications chiffrées portables avec relais maillé et HF de secours',related1_path:'../../39-agent-gear/kit-field-comms/index.html',related2_name:'Cloneur de piste magnétique',related2_desc:'Simulez la lecture et le clonage de piste magnétique',related2_path:'../../52-hardware-implants/imp-magnetic-stripe-cloner/index.html',related3_name:'Clonage Vocal Deepfake',related3_desc:'Simulation de clonage vocal IA pour la sensibilisation à la sécurité',related3_path:'../../51-social-engineering/se-deepfake-voice-cloner/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Labo Oracle de Remplissage',pathPrev_path:'../../53-crypto-attacks/cry-bleichenbacher-attack/index.html',pathNext_name:'Log Discret EC',pathNext_path:'../../53-crypto-attacks/cry-elliptic-curve-attack/index.html',
    printBtn: '🖨️ Imprimer',realworldTitle:'🌍 Histoires réelles',realworld1:'L\'attaque SolarWinds (2020) a compromis 18 000 organisations en cachant des malwares dans des mises à jour logicielles de confiance.',realworld2:'Heartbleed (2014) était un dépassement de tampon dans OpenSSL qui permettait aux attaquants de lire 64 Ko de mémoire serveur par requête.',realworld3:'L\'équipe d\'Alan Turing à Bletchley Park a décrypté la machine Enigma pendant la WWII, lisant 84 000 messages allemands chiffrés par mois en 1945.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En frontière IA, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en frontière IA et révèlent la complexité cachée sous des systèmes simples en apparence.'},
  ar:{
    title:'مختبر تزوير شهادات X.509',subtitle:'زور الشهادات واستكشف تجاوز التحقق من سلسلة PKI',
    mainSection:'ورشة تزوير الشهادات',mainDesc:'انشئ سلطة جذرية ووسيطة وشهادة طرفية ثم حاول التزوير',
    caLabel:'اسم السلطة الجذرية',caHint:'اسم سلطة التصديق الجذرية الموثوقة',
    leafLabel:'النطاق المستهدف',leafHint:'النطاق الذي ستدعيه الشهادة المزورة',
    attackLabel:'نوع الهجوم',
    forgeCert:'تزوير الشهادة',verifyChain:'التحقق من السلسلة',reset:'اعادة تعيين',results:'النتائج',
    vizTitle:'تصور سلسلة PKI',vizHint:'شاهد سلسلة الشهادات ومحاولات التزوير',
    sectionA:'مرجع الهجمات',sectionB:'تعمق في PKI',
    settings:'الاعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',
    help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',
    langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',
    selfSigned:'تزوير ذاتي التوقيع',chainBreak:'تجاوز التحقق من السلسلة',
    nullByte:'حقن بايت فارغ في CN',hashCollision:'تصادم هاش MD5',
    forging:'جاري تزوير الشهادة...',forged:'تم تزوير الشهادة!',
    verifying:'جاري التحقق من السلسلة...',chainValid:'السلسلة صالحة',chainInvalid:'السلسلة غير صالحة (تم كشف التزوير)',
    resetDone:'تم مسح جميع الشهادات',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Certificate Forgery Lab. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for X.509 Certificate Forgery Lab. ',howto_2:'اختر نوع الهجوم.',howto_3:'انقر تزوير الشهادة.',howto_4:'انقر التحقق من السلسلة.',
    wiki_self:'ذاتي التوقيع: شهادة موقعة بمفتاحها الخاص، غير موثوقة من CA.',
    wiki_chain:'تجاوز السلسلة: عدم التحقق من الشهادة الوسيطة.',
    wiki_null:'بايت فارغ: CN=evil.com\\x00.target.com يخدع المحللين.',
    wiki_md5:'تصادم MD5: شهادتان مختلفتان بنفس هاش MD5.',
    mathExplain:'سلسلة شهادات X.509:\n1. السلطة الجذرية (ذاتية التوقيع، موثوقة من النظام)\n2. السلطة الوسيطة (موقعة من الجذرية)\n3. شهادة طرفية (موقعة من الوسيطة)\n\nالتحقق: المتصفح يتنقل من الشهادة الطرفية الى الجذرية'
  ,step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Certificate Forgery Lab هي محاكاة تفاعلية توضح مفاهيم هجمات التشفير. Create root CA, intermediate, and leaf certificates, then attempt forgery. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Aes Side Channel and Cry Replay Attack Forge! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',
    wiki_history_title: '📜 تاريخ الهندسة العكسية',
    wiki_history: 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention. يبني Certificate Forgery Lab على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Certificate Forgery Lab',
    wiki_math: 'الرياضيات وراء Certificate Forgery Lab: With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
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
    theory: 'Certificate Forgery Lab يوضح المبادئ الأساسية في هجمات التشفير. Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـreverse engineering في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'اتصالات ميدانية — قناة آمنة',related1_desc:'اتصالات مشفرة محمولة مع ترحيل شبكي ونسخ HF احتياطي',related1_path:'../../39-agent-gear/kit-field-comms/index.html',related2_name:'مستنسخ الشريط المغناطيسي — مختبر النسخ',related2_desc:'محاكاة قراءة واستنساخ الشريط المغناطيسي وكشف أجهزة النسخ',related2_path:'../../52-hardware-implants/imp-magnetic-stripe-cloner/index.html',related3_name:'مُستنسخ الصوت المزيّف',related3_desc:'محاكاة استنساخ الصوت للتوعية الأمنية',related3_path:'../../51-social-engineering/se-deepfake-voice-cloner/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'مختبر اوراكل الحشو',pathPrev_path:'../../53-crypto-attacks/cry-bleichenbacher-attack/index.html',pathNext_name:'لوغاريتم متقطع EC',pathNext_path:'../../53-crypto-attacks/cry-elliptic-curve-attack/index.html',
    printBtn: '🖨️ طباعة',realworldTitle:'🌍 قصص واقعية',realworld1:'اخترق هجوم سولار ويندز (2020) أكثر من 18000 منظمة من خلال إخفاء برامج ضارة داخل تحديثات البرمجيات الموثوقة.',realworld2:'كانت ثغرة هارتبليد (2014) تجاوزًا في المخزن المؤقت في OpenSSL سمح للمهاجمين بقراءة 64 كيلوبايت من ذاكرة الخادم لكل طلب.',realworld3:'فك فريق آلان تورينغ في بلتشلي بارك شفرة آلة إنغما خلال الحرب العالمية الثانية وقرأ 84000 رسالة ألمانية مشفرة شهريًا بحلول عام 1945.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في حدود الذكاء معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في حدود الذكاء وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.'}
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
  try{localStorage.setItem('cry-cert-lang',lang)}catch{}
  log(s.langChanged,'info');buildHelp();buildRef();buildMath();
}

/* ======= THEMES ======= */
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){
  document.documentElement.dataset.theme=name;
  document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));
  const sel=$('themeSelect');if(sel)sel.value=name;
  try{localStorage.setItem('cry-cert-theme',name)}catch{}
  log(`${LANG[currentLang].themeChanged} ${name}`,'info');
}

/* ======= SOUND ======= */
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){
  if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();
  const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
  osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=.08;const t=audioCtx.currentTime;
  if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.08);osc.start(t);osc.stop(t+.08)}
  else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.3);osc.start(t);osc.stop(t+.3)}
  else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.25)}
}

/* ======= LOG ======= */
let logContainer;
function log(msg,type='info'){
  if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;
  const d=document.createElement('div');d.className=`log-line ${type}`;
  d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;
  if(type==='success')playSound('success');else if(type==='error')playSound('error');
}

/* ======= TOAST ======= */
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}

/* ======= SPLASH ======= */
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}

/* ======= PANELS ======= */
function togglePanel(panel,overlay){
  panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'));
}

/* ======= CRYPTO HELPERS ======= */
function randomHex(len){let h='';for(let i=0;i<len;i++)h+='0123456789abcdef'[Math.floor(Math.random()*16)];return h}
function simpleHash(str){let h=0;for(let i=0;i<str.length;i++){h=((h<<5)-h)+str.charCodeAt(i);h|=0}return Math.abs(h).toString(16).padStart(8,'0')}

/* ======= CERTIFICATE MODEL ======= */
let certChain={root:null,intermediate:null,leaf:null,forged:null};
let animState={phase:'idle',progress:0,particles:[]};
let animFrame;

function makeCert(cn,issuer,isCa,keyId){
  return{
    cn,issuer,isCa,
    serial:randomHex(16),
    keyId:keyId||randomHex(8),
    notBefore:new Date().toISOString().slice(0,10),
    notAfter:new Date(Date.now()+365*86400000).toISOString().slice(0,10),
    sigAlgo:'SHA-256 with RSA',
    sig:randomHex(64),
    pubkey:randomHex(32),
    fingerprint:randomHex(40)
  };
}

function buildLegitChain(){
  const caName=$('caNameInput').value||'TrustRoot CA';
  const domain=$('domainInput').value||'secure.example.com';
  const rootKey=randomHex(8);
  certChain.root=makeCert(caName,caName,true,rootKey);
  certChain.root.sig=simpleHash(caName+rootKey);
  const intKey=randomHex(8);
  certChain.intermediate=makeCert('Intermediate CA',caName,true,intKey);
  certChain.intermediate.sig=simpleHash('Intermediate CA'+rootKey);
  certChain.leaf=makeCert(domain,'Intermediate CA',false,randomHex(8));
  certChain.leaf.sig=simpleHash(domain+intKey);
  certChain.forged=null;
}

function forgeCertificate(){
  const s=LANG[currentLang];
  const attack=$('attackSelect').value;
  const domain=$('domainInput').value||'secure.example.com';
  const caName=$('caNameInput').value||'TrustRoot CA';

  buildLegitChain();
  showToast(s.forging);log(s.forging,'info');

  let forged;
  switch(attack){
    case'self-signed':
      forged=makeCert(domain,domain,false);
      forged.attackType='self-signed';
      forged.weakness='No chain to trusted CA';
      break;
    case'chain-break':
      const fakeInt=makeCert('Fake Intermediate CA',caName,true);
      fakeInt.sig=randomHex(64);
      forged=makeCert(domain,'Fake Intermediate CA',false);
      forged.fakeIntermediate=fakeInt;
      forged.attackType='chain-break';
      forged.weakness='Intermediate signature mismatch';
      break;
    case'null-byte':
      forged=makeCert('attacker.com\\x00.'+domain,'Intermediate CA',false);
      forged.displayCN=domain;
      forged.realCN='attacker.com\\x00.'+domain;
      forged.attackType='null-byte';
      forged.weakness='CN parsing stops at null byte';
      break;
    case'collision':
      forged=makeCert(domain,'Intermediate CA',false);
      forged.sigAlgo='MD5 with RSA';
      forged.sig=certChain.leaf.sig;
      forged.attackType='collision';
      forged.weakness='MD5 hash collision allows signature reuse';
      break;
  }
  certChain.forged=forged;

  animState={phase:'forging',progress:0,particles:[]};
  for(let i=0;i<20;i++)animState.particles.push({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.02,vy:(Math.random()-.5)*.02,life:1});

  setTimeout(()=>{
    animState.phase='forged';
    hideToast();log(s.forged,'success');
    showResults();drawCanvas();
  },1200);

  drawCanvas();
}

function verifyChain(){
  const s=LANG[currentLang];
  if(!certChain.root){log('No certificates to verify','error');return}
  showToast(s.verifying);log(s.verifying,'info');
  animState={phase:'verifying',progress:0,particles:[]};

  setTimeout(()=>{
    let valid=true,reason='';
    if(certChain.forged){
      const f=certChain.forged;
      switch(f.attackType){
        case'self-signed':valid=false;reason='Self-signed cert: issuer is not a trusted CA';break;
        case'chain-break':valid=false;reason='Intermediate CA signature does not match root CA public key';break;
        case'null-byte':
          const strictCheck=true;
          if(strictCheck){valid=false;reason='Null byte detected in CN field - modern validators reject this'}
          else{valid=true;reason='Vulnerable parser accepted null-byte CN'}
          break;
        case'collision':
          const useSHA256=certChain.leaf.sigAlgo.includes('SHA-256');
          if(useSHA256){valid=false;reason='SHA-256 detects forgery - MD5 collision does not transfer'}
          else{valid=true;reason='MD5 collision exploited successfully!'}
          break;
      }
    }
    animState.phase=valid?'valid':'invalid';
    hideToast();
    if(valid){log(s.chainValid,'success')}else{log(`${s.chainInvalid}: ${reason}`,'error')}
    $('resultsBox').textContent+=`\n\nVerification: ${valid?'PASS':'FAIL'}\nReason: ${reason}`;
    drawCanvas();
  },1500);
  drawCanvas();
}

function showResults(){
  const f=certChain.forged;if(!f)return;
  let out=`=== Forged Certificate ===\n`;
  out+=`CN: ${f.cn}\nIssuer: ${f.issuer}\nSerial: ${f.serial}\n`;
  out+=`Sig Algorithm: ${f.sigAlgo}\nSignature: ${f.sig.slice(0,32)}...\n`;
  out+=`Attack: ${f.attackType}\nWeakness: ${f.weakness}\n`;
  if(f.realCN)out+=`Real CN: ${f.realCN}\nDisplay CN: ${f.displayCN}\n`;
  out+=`\n=== Legitimate Chain ===\n`;
  out+=`Root: ${certChain.root.cn} (${certChain.root.fingerprint.slice(0,16)}...)\n`;
  out+=`Intermediate: ${certChain.intermediate.cn}\n`;
  out+=`Leaf: ${certChain.leaf.cn}\n`;
  $('resultsBox').textContent=out;
}

function resetAll(){
  certChain={root:null,intermediate:null,leaf:null,forged:null};
  animState={phase:'idle',progress:0,particles:[]};
  $('resultsBox').textContent='';
  log(LANG[currentLang].resetDone,'info');
  drawCanvas();
}

/* ======= CANVAS VISUALIZATION ======= */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;

function resizeCanvas(){
  if(!canvas)return;const r=canvas.getBoundingClientRect();
  canvas.width=r.width*window.devicePixelRatio;canvas.height=r.height*window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
}

function getCS(prop){return getComputedStyle(document.documentElement).getPropertyValue(prop).trim()}

function drawCertBox(x,y,w,h,cert,color,label){
  ctx.fillStyle=color+'22';ctx.fillRect(x,y,w,h);
  ctx.strokeStyle=color+'88';ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);
  ctx.fillStyle=color;ctx.font='bold 11px Righteous,Tajawal,sans-serif';
  ctx.fillText(label,x+8,y+16);
  if(cert){
    ctx.fillStyle=getCS('--text');ctx.font='10px Tajawal,sans-serif';
    ctx.fillText(`CN: ${cert.cn.length>25?cert.cn.slice(0,25)+'...':cert.cn}`,x+8,y+32);
    ctx.fillStyle=getCS('--text-muted');
    ctx.fillText(`Serial: ${cert.serial.slice(0,12)}...`,x+8,y+46);
    ctx.fillText(`Key: ${cert.keyId}`,x+8,y+58);
    if(cert.isCa){ctx.fillStyle='#4ade80';ctx.fillText('CA:TRUE',x+w-55,y+16)}
  }
}

function drawArrow(x1,y1,x2,y2,color,dashed){
  ctx.strokeStyle=color;ctx.lineWidth=2;
  if(dashed)ctx.setLineDash([4,4]);else ctx.setLineDash([]);
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  const angle=Math.atan2(y2-y1,x2-x1);
  ctx.fillStyle=color;ctx.beginPath();
  ctx.moveTo(x2,y2);ctx.lineTo(x2-10*Math.cos(angle-0.4),y2-10*Math.sin(angle-0.4));
  ctx.lineTo(x2-10*Math.cos(angle+0.4),y2-10*Math.sin(angle+0.4));ctx.fill();
  ctx.setLineDash([]);
}

function drawCanvas(){
  if(!ctx)return;
  const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),accent2=getCS('--accent2'),text=getCS('--text'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);

  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';
  ctx.fillText('PKI Certificate Chain',10,22);
  ctx.fillStyle=muted;ctx.font='11px Tajawal,sans-serif';
  ctx.fillText(`Phase: ${animState.phase}`,10,38);

  if(!certChain.root){
    ctx.fillStyle=muted;ctx.font='13px Tajawal,sans-serif';
    ctx.textAlign='center';ctx.fillText('Click "Forge Certificate" to begin',w/2,h/2);ctx.textAlign='left';
    return;
  }

  const bw=180,bh=68,gap=20;
  const startX=(w-bw*3-gap*2)/2,startY=55;

  drawCertBox(startX,startY,bw,bh,certChain.root,'#4ade80','Root CA');
  drawCertBox(startX+bw+gap,startY,bw,bh,certChain.intermediate,'#60a5fa','Intermediate CA');
  drawCertBox(startX+(bw+gap)*2,startY,bw,bh,certChain.leaf,'#fbbf24','Leaf Cert');

  drawArrow(startX+bw,startY+bh/2,startX+bw+gap,startY+bh/2,'#4ade8088');
  drawArrow(startX+bw*2+gap,startY+bh/2,startX+bw*2+gap*2,startY+bh/2,'#60a5fa88');

  ctx.fillStyle=muted;ctx.font='9px SF Mono,monospace';
  ctx.fillText('signs',startX+bw+2,startY+bh/2-5);
  ctx.fillText('signs',startX+bw*2+gap+2,startY+bh/2-5);

  if(certChain.forged){
    const fy=startY+bh+50;
    drawCertBox(startX+bw+gap,fy,bw,bh,certChain.forged,'#f87171','FORGED');

    if(certChain.forged.fakeIntermediate){
      drawCertBox(startX,fy,bw,bh,certChain.forged.fakeIntermediate,'#fb923c','Fake Intermediate');
      drawArrow(startX+bw,fy+bh/2,startX+bw+gap,fy+bh/2,'#f8717188',true);
    }

    drawArrow(startX+bw+gap+bw/2,startY+bh+5,startX+bw+gap+bw/2,fy-5,'#f8717166',true);
    ctx.fillStyle='#f87171';ctx.font='bold 10px Tajawal';
    ctx.fillText('FORGERY ATTEMPT',startX+bw+gap+10,fy-10);

    if(animState.phase==='valid'){
      ctx.fillStyle='#4ade8044';ctx.fillRect(0,fy+bh+10,w,30);
      ctx.fillStyle='#4ade80';ctx.font='bold 14px Righteous';
      ctx.textAlign='center';ctx.fillText('CHAIN VALID (vulnerable!)',w/2,fy+bh+30);ctx.textAlign='left';
    }else if(animState.phase==='invalid'){
      ctx.fillStyle='#f8717144';ctx.fillRect(0,fy+bh+10,w,30);
      ctx.fillStyle='#f87171';ctx.font='bold 14px Righteous';
      ctx.textAlign='center';ctx.fillText('FORGERY DETECTED - CHAIN INVALID',w/2,fy+bh+30);ctx.textAlign='left';
    }
  }

  // Animate particles during forging
  if(animState.phase==='forging'||animState.phase==='verifying'){
    animState.particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.life-=0.01;
      if(p.life>0){
        ctx.fillStyle=`${animState.phase==='forging'?'#f87171':'#60a5fa'}${Math.floor(p.life*255).toString(16).padStart(2,'0')}`;
        ctx.beginPath();ctx.arc(p.x*w,50+p.y*(h-60),3,0,Math.PI*2);ctx.fill();
      }
    });
    animFrame=requestAnimationFrame(drawCanvas);
  }
}

/* ======= BUILD DYNAMIC SECTIONS ======= */
function buildHelp(){
  const s=LANG[currentLang];
  $('helpFaq').innerHTML=[
    {q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}
  ].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');
  $('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');
  $('helpWiki').innerHTML=[
    {t:s.selfSigned,p:s.wiki_self},{t:s.chainBreak,p:s.wiki_chain},{t:s.nullByte,p:s.wiki_null},{t:s.hashCollision,p:s.wiki_md5}
  ].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('');
}
function buildRef(){
  const s=LANG[currentLang];
  $('refCard').innerHTML=[
    {t:s.selfSigned,p:s.wiki_self},{t:s.chainBreak,p:s.wiki_chain},{t:s.nullByte,p:s.wiki_null},{t:s.hashCollision,p:s.wiki_md5}
  ].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('');
}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

/* ======= INIT ======= */
document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);
  resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});

  try{const l=localStorage.getItem('cry-cert-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-cert-theme');if(t)setTheme(t)}catch{}

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

  document.querySelectorAll('.log-filter').forEach(btn=>{
    btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
      const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})}
  });

  document.querySelectorAll('.help-tab').forEach(tab=>{
    tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');
      document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));
      $(`help${tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)}`).classList.add('active')}
  });

  $('forgeBtn').onclick=forgeCertificate;
  $('verifyBtn').onclick=verifyChain;
  $('resetBtn').onclick=resetAll;

  buildHelp();buildRef();buildMath();
  log(LANG[currentLang].ready,'success');
  drawCanvas();
});

/* ═══════ ENHANCED PKI CERTIFICATE VISUALIZATION (IIFE) ═══════ */
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

  // === X.509 Certificate Fields (top-left) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('X.509 Certificate Structure (ASN.1 DER)',10,16);

  const fields=[
    {name:'Version',val:'v3',color:'#60a5fa',w:40},
    {name:'Serial',val:randomHex(4),color:'#c084fc',w:60},
    {name:'Sig Algorithm',val:'SHA-256/RSA',color:'#fbbf24',w:80},
    {name:'Issuer',val:'Root CA',color:'#4ade80',w:60},
    {name:'Validity',val:'2024-2025',color:'#60a5fa',w:65},
    {name:'Subject',val:'*.example.com',color:'#f87171',w:85},
    {name:'Public Key',val:'RSA-2048',color:'#c084fc',w:65}
  ];
  let fx=10;
  const certY=24;
  fields.forEach((f,i)=>{
    const isActive=Math.floor(_t/30)%fields.length===i;
    _x.fillStyle=isActive?f.color+'44':f.color+'15';
    _x.fillRect(fx,certY,f.w,40);_x.strokeStyle=f.color+'66';_x.strokeRect(fx,certY,f.w,40);
    _x.fillStyle=f.color;_x.font='bold 7px SF Mono';_x.textAlign='center';
    _x.fillText(f.name,fx+f.w/2,certY+14);
    _x.fillStyle=mut;_x.font='6px SF Mono';
    _x.fillText(f.val,fx+f.w/2,certY+30);_x.textAlign='left';
    fx+=f.w+3;
  });
  // Signature
  _x.fillStyle='#f8717133';_x.fillRect(fx,certY,w-fx-10,40);
  _x.strokeStyle='#f87171';_x.strokeRect(fx,certY,w-fx-10,40);
  _x.fillStyle='#f87171';_x.font='bold 7px SF Mono';_x.textAlign='center';
  _x.fillText('Signature',fx+(w-fx-10)/2,certY+14);
  _x.fillStyle=mut;_x.font='6px SF Mono';
  _x.fillText(randomHex(8)+'...',fx+(w-fx-10)/2,certY+30);_x.textAlign='left';

  // === Trust Chain Tree (middle-left) ===
  const tcY=certY+55,tcW=w*0.48,tcH=120;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('PKI Trust Hierarchy',10,tcY);

  const tree=[
    {level:0,x:tcW/2,y:tcY+15,label:'Root CA',color:'#4ade80',children:[1,2]},
    {level:1,x:tcW*0.25,y:tcY+55,label:'Int CA-1',color:'#60a5fa',children:[3,4]},
    {level:1,x:tcW*0.75,y:tcY+55,label:'Int CA-2',color:'#60a5fa',children:[5]},
    {level:2,x:tcW*0.1,y:tcY+95,label:'site-a.com',color:'#fbbf24',children:[]},
    {level:2,x:tcW*0.35,y:tcY+95,label:'site-b.com',color:'#fbbf24',children:[]},
    {level:2,x:tcW*0.7,y:tcY+95,label:'site-c.com',color:'#fbbf24',children:[]}
  ];
  // Draw edges
  tree.forEach((node,i)=>{
    node.children.forEach(ci=>{
      _x.strokeStyle=node.color+'66';_x.lineWidth=1;
      _x.beginPath();_x.moveTo(node.x+10,node.y+10);_x.lineTo(tree[ci].x+10,tree[ci].y);_x.stroke();
    });
  });
  // Draw nodes
  tree.forEach(node=>{
    const isActive=Math.floor(_t/25)%3===node.level;
    _x.fillStyle=isActive?node.color+'44':node.color+'22';
    _x.fillRect(node.x-20,node.y,60,18);_x.strokeStyle=node.color;_x.strokeRect(node.x-20,node.y,60,18);
    _x.fillStyle=node.color;_x.font='bold 7px SF Mono';_x.textAlign='center';
    _x.fillText(node.label,node.x+10,node.y+12);_x.textAlign='left';
  });

  // === Attack Types Comparison (middle-right) ===
  const atX=w*0.52,atY=tcY;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Certificate Attack Vectors',atX,atY);

  const attacks=[
    {name:'Self-Signed',desc:'No trusted CA chain',severity:0.3,era:'Basic',color:'#fbbf24'},
    {name:'Null-Byte CN',desc:'Parser truncation trick',severity:0.7,era:'CVE-2009',color:'#f87171'},
    {name:'MD5 Collision',desc:'Rogue CA certificate',severity:0.9,era:'Flame 2012',color:'#f87171'},
    {name:'Chain Break',desc:'Fake intermediate CA',severity:0.5,era:'Ongoing',color:'#fb923c'},
    {name:'BGP Hijack+CA',desc:'Domain validation bypass',severity:0.8,era:'2018+',color:'#f87171'},
    {name:'CT Log Bypass',desc:'Avoid transparency',severity:0.4,era:'Theoretical',color:'#fbbf24'}
  ];

  const atW=w*0.46;
  attacks.forEach((a,i)=>{
    const y=atY+12+i*19;
    const barW=a.severity*atW*0.5;
    const isActive=Math.floor(_t/40)%attacks.length===i;
    _x.fillStyle=isActive?a.color+'44':'rgba(255,255,255,.02)';
    _x.fillRect(atX,y,atW,17);
    _x.fillStyle=a.color+'44';_x.fillRect(atX+90,y+2,barW,13);
    _x.fillStyle=isActive?a.color:mut;_x.font='bold 8px SF Mono';
    _x.fillText(a.name,atX+3,y+12);
    _x.fillStyle=mut;_x.font='7px SF Mono';
    _x.fillText(a.era,atX+atW-35,y+12);
  });

  // === TLS Handshake (bottom) ===
  const tlsY=tcY+tcH+10;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('TLS Certificate Verification Flow',10,tlsY);

  const tlsSteps=[
    {label:'ClientHello',from:0.1,to:0.5,color:'#4ade80',y:0},
    {label:'ServerHello + Cert',from:0.5,to:0.1,color:'#60a5fa',y:1},
    {label:'Verify Cert Chain',from:0.1,to:0.1,color:'#fbbf24',y:2},
    {label:'Check Revocation (CRL/OCSP)',from:0.1,to:0.3,color:'#c084fc',y:3},
    {label:'Key Exchange',from:0.1,to:0.5,color:'#4ade80',y:4},
    {label:'Encrypted Session',from:0.1,to:0.5,color:'#4ade80',y:5}
  ];

  const tlsW=w-20,tlsH=h-tlsY-20;
  const stepH=Math.min(16,tlsH/tlsSteps.length);
  const activeStep=Math.floor(_t/40)%tlsSteps.length;
  tlsSteps.forEach((s,i)=>{
    const y=tlsY+8+i*stepH;
    _x.fillStyle=i===activeStep?s.color+'33':'rgba(255,255,255,.02)';
    _x.fillRect(10,y,tlsW,stepH-2);
    // Arrow
    const ax=10+s.from*tlsW,bx=10+s.to*tlsW;
    _x.strokeStyle=i<=activeStep?s.color:mut+'44';_x.lineWidth=i===activeStep?2:1;
    _x.beginPath();_x.moveTo(ax,y+stepH/2);_x.lineTo(bx,y+stepH/2);_x.stroke();
    const dir=bx>ax?1:-1;
    _x.fillStyle=s.color;_x.beginPath();_x.moveTo(bx,y+stepH/2);_x.lineTo(bx-dir*6,y+stepH/2-3);_x.lineTo(bx-dir*6,y+stepH/2+3);_x.fill();
    _x.lineWidth=1;
    // Label
    _x.fillStyle=i<=activeStep?s.color:mut;_x.font='bold 8px SF Mono';
    _x.fillText(s.label,Math.min(ax,bx)+Math.abs(bx-ax)/2-30,y+stepH/2-5);
  });

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
