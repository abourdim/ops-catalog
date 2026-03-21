/**
 * Workshop DIY — Phishing Trainer v1.2
 * Spot the Fake — Score points by identifying phishing attempts
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3l-6.5-2.4l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.4l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7H204v3.6h126.8zM330.8,203.4H161.7v3.6h169.1zM330.8,211H77.1v3.6h253.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const c=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.08);o.start(c);o.stop(c+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,c+0.3);o.start(c);o.stop(c+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,c+0.25);o.start(c);o.stop(c+0.25);}}

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
    ...LANG_BASE.en,title:'Phishing Trainer',subtitle:'🎣 Score points by identifying phishing attempts',disconnected:'Disconnected',connected:'Connected',mainSection:'Spot the Fake',mainDesc:'Is this email/URL real or a phishing attempt?',sectionA:'Phishing Red Flags',sectionB:'Protection Guide',sectionC:'Statistics',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'The main display shows the Phishing Trainer simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Set up the simulation parameters and choose your encryption ',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Phishing Red Flags" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 مظاهر. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'ثلاثي اللغات. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_log_title:'📜 Activity Log',wiki_log:'سجل مؤرخ. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_privacy_title:'🔒 Privacy',wiki_privacy:'محلي اولا. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',working:'Working…',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'🎣 Phishing Trainer ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',realBtn:'Legitimate',fakeBtn:'Phishing',nextBtn:'Next Question',scoreLabel:'Score',questionLabel:'Question',correct:'Correct!',wrong:'Wrong!',redFlagsText:'Look for: misspelled domains, urgent language, suspicious sender, generic greetings, mismatched URLs.',protectionText:'Hover over links before clicking. Check sender domain. Never enter credentials from email links. Enable 2FA.',statsBtn:'Show Statistics',gameOver:'Game Over!',accuracy:'Accuracy',restart:'Restart',step1Title:'Configure',step1Desc:'Set up the simulation parameters and choose your encryption method. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',step2Title:'Process',step2Desc:'The data is processed through the chosen algorithm or technique. Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',step3Title:'Transmit',step3Desc:'The processed signal or message is sent through the communication channel. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',step4Title:'Verify',step4Desc:'The receiver decodes, verifies, and validates the received data. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',sectionCode:'Device Code',faq_q1:'What is Phishing Trainer?',faq_a1:'Phishing Trainer is an interactive simulation that demonstrates covert operations concepts. Is this email/URL real or a phishing attempt?. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real digital security behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real digital security principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Browser only. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Web Burner Chat and Web Cipher Suite. Each app in this category teaches a different aspect of digital security. Try systematically: set all controls to their defaults, then change one variable at a time. Record what happens at minimum, midpoint, and maximum values. This methodical approach is exactly how researchers and engineers characterize real systems.',demo_s1:'Welcome to Phishing Trainer! Look at the main display — this is where the digital security simulation runs.',demo_s2:'Read the email/URL scenario. Watch how the visualization reacts. Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Phishing Red Flags" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of digital security.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Cryptography',learn1Desc:'How secret codes protect messages from spies. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cybersecurity',learn2Title:'Wireless Communication',learn2Desc:'How devices send invisible signals through the air. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Wireless',learn3Title:'OPSEC',learn3Desc:'How to keep your operations secret and secure. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Security',learn4Title:'Math in Security',learn4Desc:'How numbers and algorithms make unbreakable codes. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Math',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Phishing Trainer! This is like a science experiment on your computer. You get to control a real covert operations simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Set up the simulation parameters and choose your e Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches digital security concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Phishing Trainer: Is this email/URL real or a phishing attempt?. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure through Process to Transmit and Verify.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Phishing Red Flags" and "Protection Guide" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    wiki_history_title: '📜 History of Radio Intelligence',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. Phishing Trainer builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Web Phishing Trainer',
    wiki_math: 'The mathematics behind Phishing Trainer: Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced radio intelligence practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to radio intelligence. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with radio intelligence: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in radio intelligence.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Radio Intelligence carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Domain Spoofing',
    gloss4_def: 'Creating a domain name visually similar to a legitimate one (e.g., goog1e.com). Unicode homoglyph attacks use characters from different alphabets that look identical.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Phishing Trainer demonstrates key principles from covert operations. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world radio intelligence?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional radio intelligence systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'esc-exfiltration-olympics',related1_desc:'',related1_path:'../../55-escape-evasion/esc-exfiltration-olympics/index.html',related2_name:'Dark Net Radio — Private Mesh',related2_desc:'ESP32 mesh topology: encrypted offline communication',related2_path:'../../02-spy-esp32/esp-dark-net-radio/index.html',related3_name:'Anti-Forensics Engine',related3_desc:'Secure wipe, log sanitization & timestamp obfuscation',related3_path:'../../55-escape-evasion/esc-anti-forensics-toolkit/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Attack Simulator',pathPrev_path:'../../03-spy-browser/web-password-cracker/index.html',pathNext_name:'Steganography Lab',pathNext_path:'../../03-spy-browser/web-steganography-lab/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What is a neural network?',quiz_q1a:'Physical wires',quiz_q1b:'Computing system inspired by biological neurons',quiz_q1c:'Social network',quiz_q1d:'Radio network',quiz_q1_answer:'1',quiz_q2:'What does AI stand for?',quiz_q2a:'Automated Input',quiz_q2b:'Artificial Intelligence',quiz_q2c:'Analog Interface',quiz_q2d:'Active Integration',quiz_q2_answer:'1',quiz_q3:'What does SIGINT stand for?',quiz_q3a:'Signal Integration',quiz_q3b:'Signals Intelligence',quiz_q3c:'Simple Interception',quiz_q3d:'System Intelligence',quiz_q3_answer:'1',quiz_q4:'What is steganography?',quiz_q4a:'Loud communication',quiz_q4b:'Hiding messages within other data',quiz_q4c:'Deleting files',quiz_q4d:'Broadcasting signals',quiz_q4_answer:'1',quiz_q5:'What is a dead drop?',quiz_q5a:'Failed connection',quiz_q5b:'Secret location for exchanging messages',quiz_q5c:'Broken antenna',quiz_q5d:'Empty frequency',quiz_q5_answer:'1'},
  fr:{title:'Entraineur Phishing',subtitle:'🎣 Marquez des points en identifiant les tentatives de phishing',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Trouvez le Faux',mainDesc:'Cet email/URL est-il reel ou du phishing ?',sectionA:'Signaux d\'alerte',sectionB:'Guide de protection',sectionC:'Statistiques',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',export:'Exporter',filterAll:'Tout',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'L écran principal affiche la simulation Phishing Trainer. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Set up the simulation parameters and choose your encryption ',howto_2:'Cliquez Legitime ou Phishing.',howto_3:'Lisez l\'explication.',howto_4:'Cliquez Suivant.',wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue.',wiki_log_title:'📜 Journal',wiki_log:'Journal horodate.',wiki_privacy_title:'🔒 Confidentialite',wiki_privacy:'Local-first.',working:'En cours…',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'🎣 Entraineur Phishing pret !',logCleared:'Journal efface',copied:'Copie !',copyFail:'Echec',soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Reactif musique',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',realBtn:'Legitime',fakeBtn:'Phishing',nextBtn:'Question Suivante',scoreLabel:'Score',questionLabel:'Question',correct:'Correct !',wrong:'Faux !',redFlagsText:'Cherchez: domaines mal orthographies, urgence, expediteur suspect, URL non concordantes.',protectionText:'Survolez les liens avant de cliquer. Verifiez le domaine expediteur. Activez la 2FA.',statsBtn:'Voir Statistiques',gameOver:'Partie Terminee !',accuracy:'Precision',restart:'Recommencer',step1Title:'Configurer',step1Desc:'Configure les paramètres de simulation et choisis ta méthode de chiffrement. Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',step2Title:'Traiter',step2Desc:'Les données sont traitées par l\'algorithme ou la technique choisie. Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',step3Title:'Transmettre',step3Desc:'Le signal ou message traité est envoyé par le canal de communication. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',step4Title:'Vérifier',step4Desc:'Le récepteur décode, vérifie et valide les données reçues. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Phishing Trainer est une simulation interactive qui démontre les concepts de opérations secrètes. Is this email/URL real or a phishing attempt?. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle te montre étape par étape comment les agents secrets protègent leurs messages.',faq_q3:'Que dois-je essayer d\'abord ?',faq_a3:'Clique sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'Ça utilise de la vraie cryptographie — les mêmes maths qui protègent tes messages WhatsApp ! 🔐',faq_q5:'Je peux le casser ?',faq_a5:'Essaie la section Labo ! Vois si tu peux craquer le code. C\'est comme ça que pensent les vrais chercheurs ! 💪',faq_q6:'Quel matériel me faut-il ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'100% sûr ! 🛡️ Tout tourne localement dans ton navigateur. Pas besoin d\'internet.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Web Cipher Suite and Web Exif Eraser ! Chacune enseigne quelque chose de différent. 🚀. Essayez systématiquement : mettez tous les contrôles par défaut, puis changez une variable à la fois. Notez ce qui se passe aux valeurs minimale, médiane et maximale.',demo_s1:'Bienvenue ! Explorons cet outil d\'espion. D\'abord, regarde le panneau de contrôle. 🕵️',demo_s2:'Clique sur le bouton principal pour démarrer. Regarde la visualisation s\'animer ! ⚡',demo_s3:'Maintenant change un réglage — déplace un curseur ou choisis une option. Tu vois la différence ? 🔄',demo_s4:'Vérifie les résultats. Les chiffres et graphiques montrent ce qui s\'est passé. 📊',demo_s5:'Bravo ! 🎉 Essaie maintenant la section Labo pour des expériences pratiques !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Cryptographie',learn1Desc:'Comment les codes secrets protègent les messages',learn1Tag:'Cybersécurité',learn2Title:'Communication sans fil',learn2Desc:'Comment les appareils envoient des signaux invisibles',learn2Tag:'Sans fil',learn3Title:'OPSEC',learn3Desc:'Comment garder tes opérations secrètes et sécurisées',learn3Tag:'Sécurité',learn4Title:'Maths en sécurité',learn4Desc:'Comment les nombres créent des codes incassables',learn4Tag:'Maths',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 Histoire de renseignement radio',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. Phishing Trainer s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Web Phishing Trainer',
    wiki_math: 'Les mathématiques derrière Phishing Trainer : Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de renseignement radio utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour renseignement radio. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en renseignement radio : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Renseignement radio implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Domain Spoofing',
    gloss4_def: 'Creating a domain name visually similar to a legitimate one (e.g., goog1e.com). Unicode homoglyph attacks use characters from different alphabets that look identical.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Phishing Trainer démontre les principes clés de opérations secrètes. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec radio intelligence dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'esc-exfiltration-olympics',related1_desc:'',related1_path:'../../55-escape-evasion/esc-exfiltration-olympics/index.html',related2_name:'Dark Net Radio — Mesh Privé',related2_desc:'Topologie mesh ESP32 : communication chiffrée hors ligne',related2_path:'../../02-spy-esp32/esp-dark-net-radio/index.html',related3_name:'Moteur Anti-Forensique',related3_desc:'Effacement securise et sanitisation',related3_path:'../../55-escape-evasion/esc-anti-forensics-toolkit/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Simulateur d\\',pathPrev_path:'../../03-spy-browser/web-password-cracker/index.html',pathNext_name:'Labo St\\u00E9ganographie',pathNext_path:'../../03-spy-browser/web-steganography-lab/index.html',
    printBtn: '🖨️ Imprimer'},
  ar:{title:'مدرب التصيد',subtitle:'🎣 اكسب نقاطا بتحديد محاولات التصيد',disconnected:'غير متصل',connected:'متصل',mainSection:'اكتشف المزيف',mainDesc:'هل هذا البريد/الرابط حقيقي ام تصيد؟',sectionA:'علامات التصيد',sectionB:'دليل الحماية',sectionC:'الاحصائيات',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'تعرض الشاشة الرئيسية محاكاة Phishing Trainer. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Set up the simulation parameters and choose your encryption ',howto_2:'انقر شرعي او تصيد.',howto_3:'اقرا التفسير.',howto_4:'انقر التالي.',wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات.',wiki_log_title:'📜 سجل النشاط',wiki_log:'سجل مؤرخ.',wiki_privacy_title:'🔒 الخصوصية',wiki_privacy:'محلي اولا.',working:'جار…',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',ready:'🎣 مدرب التصيد جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',realBtn:'شرعي',fakeBtn:'تصيد',nextBtn:'السؤال التالي',scoreLabel:'النتيجة',questionLabel:'السؤال',correct:'صحيح!',wrong:'خطا!',redFlagsText:'ابحث عن: نطاقات مكتوبة خطا، لغة عاجلة، مرسل مشبوه.',protectionText:'مرر فوق الروابط قبل النقر. تحقق من نطاق المرسل. فعل المصادقة الثنائية.',statsBtn:'عرض الاحصائيات',gameOver:'انتهت اللعبة!',accuracy:'الدقة',restart:'اعادة',step1Title:'تكوين',step1Desc:'اضبط معلمات المحاكاة واختر طريقة التشفير. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',step2Title:'معالجة',step2Desc:'تتم معالجة البيانات عبر الخوارزمية أو التقنية المختارة. لاحظ كيف تتغير المؤشرات خلال هذه المرحلة. يسجل سجل النشاط كل حدث لتتبع تسلسل العمليات والتحقق من النتائج.',step3Title:'إرسال',step3Desc:'يتم إرسال الإشارة أو الرسالة المعالجة عبر قناة الاتصال. تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',step4Title:'تحقق',step4Desc:'يقوم المستقبل بفك التشفير والتحقق من البيانات المستلمة. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'Phishing Trainer هي محاكاة تفاعلية توضح مفاهيم العمليات السرية. Is this email/URL real or a phishing attempt?. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تُظهر لك خطوة بخطوة كيف يحمي العملاء السريون رسائلهم.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم غيّر الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'يستخدم تشفيراً حقيقياً — نفس الرياضيات التي تحمي رسائل WhatsApp! 🔐',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب قسم المختبر! حاول كسر الشيفرة. هكذا يفكر الباحثون الأمنيون! 💪',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن 100%! 🛡️ كل شيء يعمل محلياً في متصفحك. لا حاجة للإنترنت.',faq_q8:'ماذا أجرب بعد ذلك؟',faq_a8:'جرب Web Cipher Suite and Web Exif Eraser! كل واحد يعلّم شيئاً مختلفاً. 🚀. جرب بشكل منهجي: اضبط جميع عناصر التحكم على الافتراضي، ثم غير متغيراً واحداً في كل مرة. سجل ما يحدث عند القيم الدنيا والمتوسطة والقصوى.',demo_s1:'مرحباً! لنستكشف أداة التجسس هذه. أولاً، انظر إلى لوحة التحكم الرئيسية. 🕵️',demo_s2:'اضغط على الزر الرئيسي لبدء المحاكاة. شاهد التصور يتحرك! ⚡. تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',demo_s3:'الآن جرب تغيير إعداد — حرك شريط تمرير أو اختر خياراً مختلفاً. هل ترى الفرق؟ 🔄',demo_s4:'تحقق من النتائج. الأرقام والرسوم البيانية تُظهر ما حدث. 📊',demo_s5:'أحسنت! 🎉 جرب الآن قسم المختبر للتجارب العملية!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'التشفير',learn1Desc:'كيف تحمي الشفرات السرية الرسائل',learn1Tag:'أمن سيبراني',learn2Title:'الاتصال اللاسلكي',learn2Desc:'كيف ترسل الأجهزة إشارات غير مرئية',learn2Tag:'لاسلكي',learn3Title:'أمن العمليات',learn3Desc:'كيف تحافظ على سرية عملياتك وأمانها',learn3Tag:'أمان',learn4Title:'الرياضيات في الأمن',learn4Desc:'كيف تصنع الأرقام والخوارزميات شفرات غير قابلة للكسر',learn4Tag:'رياضيات',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',
    wiki_history_title: '📜 تاريخ الاستخبارات اللاسلكية',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. يبني Phishing Trainer على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Web Phishing Trainer',
    wiki_math: 'الرياضيات وراء Phishing Trainer: Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الاستخبارات اللاسلكية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الاستخبارات اللاسلكية. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الاستخبارات اللاسلكية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الاستخبارات اللاسلكية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'Channel Width',
    gloss2_def: 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    gloss3_term: 'SNR',
    gloss3_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss4_term: 'Domain Spoofing',
    gloss4_def: 'Creating a domain name visually similar to a legitimate one (e.g., goog1e.com). Unicode homoglyph attacks use characters from different alphabets that look identical.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Phishing Trainer يوضح المبادئ الأساسية في العمليات السرية. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـradio intelligence في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'esc-exfiltration-olympics',related1_desc:'',related1_path:'../../55-escape-evasion/esc-exfiltration-olympics/index.html',related2_name:'راديو الشبكة المظلمة — Mesh خاص',related2_desc:'طوبولوجيا mesh ESP32: اتصال مشفر بدون إنترنت',related2_path:'../../02-spy-esp32/esp-dark-net-radio/index.html',related3_name:'محرك مكافحة الطب الشرعي',related3_desc:'مسح آمن وتنظيف السجلات',related3_path:'../../55-escape-evasion/esc-anti-forensics-toolkit/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'محاكي الهجوم',pathPrev_path:'../../03-spy-browser/web-password-cracker/index.html',pathNext_name:'\\u0645\\u062E\\u062A\\u0628\\u0631 \\u0627\\u0644\\u0625\\u062E\\u0641\\u0627\\u0621',pathNext_path:'../../03-spy-browser/web-steganography-lab/index.html',
    printBtn: '🖨️ طباعة'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');});});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

/* ═══════ PHISHING SCENARIOS ═══════ */

const SCENARIOS = [
  { type:'email', fake:true,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> security@amaz0n-verify.com<br><strong>Subject:</strong> URGENT: Your account will be suspended!<br><br>Dear Customer,<br><br>We detected unusual activity on your account. Click <u style="color:#4488ff;">here</u> immediately to verify your identity or your account will be permanently suspended within 24 hours.<br><br>Amazon Security Team</div>',
    explanation:'Red flags: misspelled domain (amaz0n with zero), urgent threatening language, generic greeting "Dear Customer", pressure to act immediately, suspicious sender domain.',
  },
  { type:'email', fake:false,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> noreply@github.com<br><strong>Subject:</strong> [GitHub] A new device signed in<br><br>Hi username,<br><br>A new device signed into your GitHub account on March 15, 2024 from Chrome on Windows.<br><br>If this was you, no action is needed. If not, please review your security settings at github.com/settings/security.</div>',
    explanation:'Legitimate: correct domain (github.com), personalized greeting, informational tone (no threats), tells you no action needed if expected, directs to official domain.',
  },
  { type:'url', fake:true,
    content:'<div style="font-family:monospace;font-size:1.1rem;text-align:center;padding:1rem;"><span style="color:#ff4444;">https://www.paypa1.com/signin</span><br><br><div style="font-size:.8rem;font-family:sans-serif;">PayPal Login Page<br>"Enter your email and password to access your account"</div></div>',
    explanation:'Red flags: domain is "paypa1" (number 1 instead of letter l). Real PayPal is paypal.com. Attackers use lookalike characters to trick users.',
  },
  { type:'email', fake:true,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> admin@micros0ft-support.net<br><strong>Subject:</strong> Your Office 365 password expires today<br><br>Your password for Office 365 expires today. Click the button below to keep your current password.<br><br><span style="background:#0078d4;color:#fff;padding:8px 16px;border-radius:4px;">Keep My Password</span><br><br>If you did not request this, ignore this email.</div>',
    explanation:'Red flags: fake domain (micros0ft with zero, and .net instead of .com), passwords do not "expire" like this, Microsoft sends from microsoft.com, suspicious call-to-action.',
  },
  { type:'url', fake:false,
    content:'<div style="font-family:monospace;font-size:1.1rem;text-align:center;padding:1rem;"><span style="color:#33cc55;">https://accounts.google.com/signin</span><br><br><div style="font-size:.8rem;font-family:sans-serif;">Google Sign-In Page<br>🔒 Secure connection verified</div></div>',
    explanation:'Legitimate: correct official Google domain (accounts.google.com), HTTPS with valid certificate, standard sign-in page URL structure.',
  },
  { type:'email', fake:true,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> prince.ahmed@nigeria-royal.ng<br><strong>Subject:</strong> Urgent Business Proposal - $4.5M USD<br><br>Dear Friend,<br><br>I am Prince Ahmed, son of the late King. I need your help to transfer $4,500,000 USD. You will receive 30% commission. Please send your bank details immediately.<br><br>God Bless, Prince Ahmed</div>',
    explanation:'Classic advance-fee scam (419 scam): unsolicited offer of large money, requests bank details, urgent tone, claims royal connection, too good to be true.',
  },
  { type:'email', fake:false,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> no-reply@accounts.google.com<br><strong>Subject:</strong> Security alert for your Google Account<br><br>Hi User,<br><br>Someone just used your password to try to sign in to your account from a new device.<br><br>Details:<br>Date: March 15, 2024<br>Device: iPhone<br>Location: Paris, France<br><br>Check activity at myaccount.google.com</div>',
    explanation:'Legitimate: official Google domain, specific details provided, calm informational tone, directs to official Google domain, no request for credentials.',
  },
  { type:'url', fake:true,
    content:'<div style="font-family:monospace;font-size:1.1rem;text-align:center;padding:1rem;"><span style="color:#ff4444;">https://netflix-billing-update.herokuapp.com/login</span><br><br><div style="font-size:.8rem;font-family:sans-serif;">Netflix Login - Update Billing<br>"Please verify your payment method"</div></div>',
    explanation:'Red flags: not on netflix.com domain, hosted on herokuapp.com (free hosting), combines "billing-update" in URL to create urgency, Netflix would never host on third-party domains.',
  },
  { type:'email', fake:true,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> helpdesk@yourcompany-it.com<br><strong>Subject:</strong> IT Department: Mandatory Software Update<br><br>All Employees,<br><br>Please download and install the attached security patch immediately. Failure to comply within 2 hours will result in network access being revoked.<br><br>Attachment: security_update.exe<br><br>IT Department</div>',
    explanation:'Red flags: external domain pretending to be internal IT, executable attachment (.exe), artificial urgency with threats, legitimate IT would use internal systems not email attachments.',
  },
  { type:'url', fake:false,
    content:'<div style="font-family:monospace;font-size:1.1rem;text-align:center;padding:1rem;"><span style="color:#33cc55;">https://www.amazon.com/gp/css/order-history</span><br><br><div style="font-size:.8rem;font-family:sans-serif;">Amazon - Your Orders<br>🔒 Secure connection verified</div></div>',
    explanation:'Legitimate: official amazon.com domain, standard URL path structure for order history, HTTPS with valid certificate.',
  },
  { type:'email', fake:true,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> support@app1e-id.com<br><strong>Subject:</strong> Your Apple ID has been locked<br><br>Dear Apple User,<br><br>For your protection, your Apple ID has been locked due to suspicious activity. Verify your identity within 24 hours or your account will be permanently disabled.<br><br><span style="background:#333;color:#fff;padding:8px 16px;border-radius:4px;">Verify Now</span></div>',
    explanation:'Red flags: domain "app1e" uses number 1 instead of letter l, threatening language with deadline, generic greeting, Apple sends from apple.com.',
  },
  { type:'email', fake:false,
    content:'<div style="font-family:sans-serif;"><strong>From:</strong> noreply@linkedin.com<br><strong>Subject:</strong> John Smith viewed your profile<br><br>Hi User,<br><br>John Smith and 3 others viewed your profile this week.<br><br>See all views on linkedin.com/me/profile-views</div>',
    explanation:'Legitimate: official linkedin.com domain, standard notification format, no urgency, directs to official LinkedIn URL, common notification type.',
  },
];

let currentQ = 0, score = 0, answered = false;
let answers = [];

function showScenario() {
  const s = LANG[currentLang];
  const box = $('scenarioBox');
  const expl = $('explanation');
  const nextBtn = $('nextBtn');
  const realBtn = $('realBtn');
  const fakeBtn = $('fakeBtn');
  const qNum = $('questionNum');
  const scoreDisp = $('scoreDisplay');
  const totalDisp = $('totalDisplay');

  if (currentQ >= SCENARIOS.length) {
    // Game over
    if (box) {
      const pct = SCENARIOS.length > 0 ? Math.round(score / SCENARIOS.length * 100) : 0;
      box.innerHTML = `<div style="text-align:center;padding:1rem;"><div style="font-size:2rem;font-weight:900;font-family:Orbitron;">${s.gameOver}</div><div style="font-size:3rem;margin:.5rem 0;color:${pct >= 70 ? '#33cc55' : '#ff4444'};">${pct}%</div><div style="font-size:1rem;">${s.accuracy}: ${score}/${SCENARIOS.length}</div><br><button class="btn-sm primary" onclick="restartGame()">🔄 ${s.restart}</button></div>`;
    }
    if (realBtn) realBtn.style.display = 'none';
    if (fakeBtn) fakeBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    if (expl) expl.style.display = 'none';
    log(`${s.gameOver} ${score}/${SCENARIOS.length}`, score >= SCENARIOS.length * 0.7 ? 'success' : 'error');
    return;
  }

  const scenario = SCENARIOS[currentQ];
  if (box) box.innerHTML = `<div style="margin-bottom:.5rem;"><span style="font-size:.7rem;opacity:.6;text-transform:uppercase;letter-spacing:1px;">${scenario.type === 'email' ? '📧 EMAIL' : '🔗 URL'}</span></div>${scenario.content}`;
  if (expl) expl.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';
  if (realBtn) { realBtn.style.display = ''; realBtn.disabled = false; }
  if (fakeBtn) { fakeBtn.style.display = ''; fakeBtn.disabled = false; }
  if (qNum) qNum.textContent = currentQ + 1;
  if (scoreDisp) scoreDisp.textContent = score;
  if (totalDisp) totalDisp.textContent = SCENARIOS.length;
  answered = false;
}

function answer(userSaysFake) {
  if (answered) return;
  answered = true;
  const s = LANG[currentLang];
  const scenario = SCENARIOS[currentQ];
  const correct = userSaysFake === scenario.fake;
  if (correct) score++;
  answers.push({ q: currentQ, correct });

  const expl = $('explanation');
  const nextBtn = $('nextBtn');
  const realBtn = $('realBtn');
  const fakeBtn = $('fakeBtn');
  const scoreDisp = $('scoreDisplay');

  if (scoreDisp) scoreDisp.textContent = score;
  if (realBtn) realBtn.disabled = true;
  if (fakeBtn) fakeBtn.disabled = true;

  if (expl) {
    expl.style.display = 'block';
    expl.style.background = correct ? '#33cc5522' : '#ff444422';
    expl.style.border = `1px solid ${correct ? '#33cc55' : '#ff4444'}`;
    expl.innerHTML = `<strong style="color:${correct ? '#33cc55' : '#ff4444'};">${correct ? '✅ ' + s.correct : '❌ ' + s.wrong}</strong><br><br>${scenario.explanation}`;
  }
  if (nextBtn) nextBtn.style.display = 'block';
  log(`${correct ? '✅' : '❌'} Q${currentQ + 1}: ${correct ? s.correct : s.wrong}`, correct ? 'success' : 'error');
  setStatus(true);
}

function nextQuestion() {
  currentQ++;
  showScenario();
}

function restartGame() {
  currentQ = 0; score = 0; answers = [];
  showScenario();
  log('🔄 Game restarted', 'info');
}

function showStats() {
  const s = LANG[currentLang];
  const results = $('statsResults');
  if (!results) return;
  results.style.display = 'block';
  const total = answers.length;
  const correct = answers.filter(a => a.correct).length;
  const pct = total > 0 ? Math.round(correct / total * 100) : 0;
  results.innerHTML = `<div style="text-align:center;font-size:.85rem;"><div style="font-size:2rem;font-weight:900;color:${pct >= 70 ? '#33cc55' : '#ff4444'};">${pct}%</div><div>${s.accuracy}: ${correct}/${total}</div><div style="margin-top:.5rem;">Phishing detected: ${answers.filter((a, i) => SCENARIOS[i] && SCENARIOS[i].fake && a.correct).length}</div><div>Legitimate identified: ${answers.filter((a, i) => SCENARIOS[i] && !SCENARIOS[i].fake && a.correct).length}</div></div>`;
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang');const st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initHijriDate();

  // App-specific
  const realBtn=$('realBtn');if(realBtn)realBtn.onclick=()=>answer(false);
  const fakeBtn=$('fakeBtn');if(fakeBtn)fakeBtn.onclick=()=>answer(true);
  const nextBtn=$('nextBtn');if(nextBtn)nextBtn.onclick=nextQuestion;
  const statsBtn=$('statsBtn');if(statsBtn)statsBtn.onclick=showStats;
  showScenario();

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ ENHANCED: Threat Detection Matrix Canvas ═══════ */
(function(){
let tCanvas,tCtx;const threats=[];const scanLines=[];let tScore=0,tTotal=0;
function createTC(){
  const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
  const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
  w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Threat Detection Matrix</div>';
  const c=document.createElement('canvas');c.width=620;c.height=260;
  c.style.cssText='width:100%;height:auto;display:block;background:#060d1a;';
  w.appendChild(c);t.appendChild(w);return c;
}
const THREAT_TYPES=[
  {name:'Spoofed Domain',color:'#ff4444',icon:'🔗'},
  {name:'Urgent Language',color:'#ff8800',icon:'⚠️'},
  {name:'Generic Greeting',color:'#ffcc00',icon:'👤'},
  {name:'Credential Request',color:'#cc44ff',icon:'🔑'},
  {name:'Mismatched URL',color:'#ff6699',icon:'🌐'},
  {name:'Legitimate',color:'#33cc55',icon:'✅'},
];
function spawnThreat(){
  const tt=THREAT_TYPES[Math.floor(Math.random()*THREAT_TYPES.length)];
  threats.push({x:tCanvas.width+20,y:30+Math.random()*(tCanvas.height-80),
    type:tt,speed:0.5+Math.random()*1.5,size:8+Math.random()*6,life:1,detected:false});
}
function drawT(){
  if(!tCtx)return;const w=tCanvas.width,h=tCanvas.height;
  tCtx.fillStyle='rgba(6,13,26,0.1)';tCtx.fillRect(0,0,w,h);
  // Grid
  tCtx.strokeStyle='#0a1a30';tCtx.lineWidth=0.3;
  for(let i=0;i<w;i+=25){tCtx.beginPath();tCtx.moveTo(i,0);tCtx.lineTo(i,h);tCtx.stroke();}
  for(let i=0;i<h;i+=25){tCtx.beginPath();tCtx.moveTo(0,i);tCtx.lineTo(w,i);tCtx.stroke();}
  // Detection line
  const lineX=w*0.3;tCtx.strokeStyle='rgba(255,255,255,0.1)';tCtx.lineWidth=2;
  tCtx.setLineDash([5,5]);tCtx.beginPath();tCtx.moveTo(lineX,0);tCtx.lineTo(lineX,h);tCtx.stroke();tCtx.setLineDash([]);
  tCtx.fillStyle='rgba(255,255,255,0.2)';tCtx.font='9px Orbitron,monospace';tCtx.textAlign='center';
  tCtx.fillText('DETECTION LINE',lineX,h-8);
  // Threats
  for(let i=threats.length-1;i>=0;i--){
    const t=threats[i];t.x-=t.speed;
    if(t.x<lineX&&!t.detected){t.detected=true;tTotal++;
      if(t.type.color!=='#33cc55')tScore++;
      scanLines.push({y:t.y,life:1,color:t.type.color});}
    if(t.x<-20||t.life<=0){threats.splice(i,1);continue;}
    if(t.detected)t.life-=0.02;
    tCtx.globalAlpha=t.life;
    // Threat dot
    tCtx.beginPath();tCtx.arc(t.x,t.y,t.size,0,Math.PI*2);
    tCtx.fillStyle=t.type.color+'44';tCtx.fill();
    tCtx.strokeStyle=t.type.color;tCtx.lineWidth=2;tCtx.stroke();
    tCtx.fillStyle='#fff';tCtx.font='10px serif';tCtx.textAlign='center';
    tCtx.fillText(t.type.icon,t.x,t.y+4);
    if(!t.detected){tCtx.fillStyle=t.type.color;tCtx.font='7px monospace';tCtx.fillText(t.type.name,t.x,t.y+t.size+10);}
    tCtx.globalAlpha=1;
  }
  // Scan lines
  for(let i=scanLines.length-1;i>=0;i--){
    const s=scanLines[i];s.life-=0.02;
    if(s.life<=0){scanLines.splice(i,1);continue;}
    tCtx.globalAlpha=s.life*0.3;tCtx.fillStyle=s.color;
    tCtx.fillRect(0,s.y-2,lineX,4);tCtx.globalAlpha=1;
  }
  // Score
  tCtx.fillStyle='rgba(255,255,255,0.5)';tCtx.font='10px Orbitron,monospace';tCtx.textAlign='left';
  tCtx.fillText('Detected: '+tScore+'/'+tTotal+' threats | Active: '+threats.length,10,18);
  // Legend
  const lx=w-180;
  THREAT_TYPES.forEach((tt,i)=>{
    tCtx.fillStyle=tt.color;tCtx.font='8px monospace';tCtx.textAlign='left';
    tCtx.fillText(tt.icon+' '+tt.name,lx,18+i*14);
  });
  requestAnimationFrame(drawT);
}
function initTC(){tCanvas=createTC();if(!tCanvas)return;tCtx=tCanvas.getContext('2d');
  setInterval(()=>{if(Math.random()>0.3)spawnThreat();},800);
  tCanvas.addEventListener('click',e=>{
    const rect=tCanvas.getBoundingClientRect();
    const mx=(e.clientX-rect.left)*(tCanvas.width/rect.width),my=(e.clientY-rect.top)*(tCanvas.height/rect.height);
    threats.forEach(t=>{if(Math.abs(t.x-mx)<15&&Math.abs(t.y-my)<15&&!t.detected){
      t.detected=true;t.life=0.5;tTotal++;if(t.type.color!=='#33cc55')tScore++;
      scanLines.push({y:t.y,life:1,color:t.type.color});}});
  });drawT();}
setTimeout(initTC,1500);
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
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this spy tool. First, look at the main control panel above. 🕵️', target:'#helpBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary button to start the simulation. Watch the visualization come alive! ⚡', target:'#settingsBtn', delay:3000},
  {i18n:'demo_s3', text:'Now try changing a setting — slide a slider or pick a different option. See how it changes? 🔄', target:'#logBtn', delay:3000},
  {i18n:'demo_s4', text:'Check the results below. The numbers and graphs show you what happened in real time. 📊', target:'#simCanvas', delay:3000},
  {i18n:'demo_s5', text:'Great job! 🎉 Now try the Lab section below for hands-on experiments. You\'re a real spy now!', target:'#mainCard', delay:3000},
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
