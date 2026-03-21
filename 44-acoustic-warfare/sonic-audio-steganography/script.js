/**
 * Sonic Audio Steganography — Workshop DIY v1.0
 * Hide data inside audio using spectral encoding
 * Themes · i18n (EN/FR/AR) · RTL · Log · Canvas · Toast
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang = 'en', soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx, encodedBuffer = null, hiddenMsg = '', isPlaying = false;

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

const LANG = {
  en: {
    ...LANG_BASE.en,
    title:'Audio Steganography', subtitle:'Hide Data Inside Music',
    disconnected:'Idle', connected:'Processing',
    mainSection:'Audio Steganography', mainDesc:'Embed hidden messages in audio using spectral encoding',
    sectionA:'Encode History', sectionB:'Steganography Science', sectionC:'Challenge',
    msgPlaceholder:'Secret message to hide...',
    encodeBtn:'Encode', decodeBtn:'Decode', playBtn:'Play',
    stegoLabel:'Stego Status', capacityLabel:'Capacity', decodedLabel:'Decoded',
    stegoReady:'Ready', encodeHint:'Encoding operations appear here.',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', theme:'Theme', settings:'Settings', language:'Language',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki', filterAll:'All',
    soundEffects:'Sound effects', ready:'Audio Steganography ready!',
    splashHint:'tap to skip', langChanged:'Language > English', themeChanged:'Theme >',
    encoded:'Message encoded in audio!', decoded:'Message decoded successfully!',
    noMsg:'Enter a message first', noAudio:'No encoded audio to decode',
    playing:'Playing stego audio...', stopped:'Playback stopped',
    howto_1:'The main display shows the Audio Steganography simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Create a specific acoustic signal with precise frequency and', howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Encode History" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.', howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_lsb_title:'LSB Encoding', wiki_lsb:'Replace least significant bits of audio samples with message bits. Imperceptible to human ear but detectable by statistical analysis.',
    wiki_ss_title:'Spread Spectrum', wiki_ss:'Spread message across the frequency spectrum using a pseudo-random sequence. Very robust against compression.',
    wiki_echo_title:'Echo Hiding', wiki_echo:'Embed data by introducing micro-echoes. Binary 0/1 mapped to different echo delays (1ms vs 2ms).',
    challenge1:'Can you detect the hidden data by listening to the audio?',
    challenge2:'What is the maximum message size for a 3-second carrier?',
    challenge3:'How would a steganalyst detect this encoding?',
    challengeReveal1:'No! The encoding uses high-frequency tones near 19-20kHz that are inaudible to most adults. Even with good headphones, the amplitude is too low to perceive.',
    challengeReveal2:'With 44100 Hz sample rate and 8 bits per character, a 3-second carrier has 132300 samples, allowing ~16537 characters. In practice, bit duration limits this to around 256 bytes for reliable extraction.',
    challengeReveal3:'Spectral analysis would reveal unusual energy peaks at 19-20kHz. Statistical tests (chi-square, RS analysis) can detect non-random patterns in LSB values.',
    revealBtn:'Reveal Answer',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Generate Sound',step1Desc:'Create a specific acoustic signal with precise frequency and amplitude. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',step2Title:'Propagate',step2Desc:'The sound wave travels through air, walls, or other media to the target. Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',step3Title:'Detect & Capture',step3Desc:'Microphones or sensors capture the acoustic energy and convert it to data. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',step4Title:'Analyze & Decode',step4Desc:'Signal processing extracts hidden information or maps the acoustic environment. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',sectionCode:'Device Code',faq_q1:'What is Audio Steganography?',faq_a1:'Audio Steganography is an interactive simulation that demonstrates acoustic physics concepts. Embed hidden messages in audio using spectral encoding. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real acoustic science behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real acoustic science principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Sonic Acoustic Covert Channel and Sonic Acoustic Fence. Each app in this category teaches a different aspect of acoustic science.',demo_s1:'Welcome to Audio Steganography! Look at the main display — this is where the acoustic science simulation runs.',demo_s2:'Type your secret message in the input field. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Encode History" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of acoustic science.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Audio Steganography! This is like a science experiment on your computer. You get to control a real acoustic physics simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Create a specific acoustic signal with precise fre Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches acoustic science concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',purpose:'Audio Steganography: Embed hidden messages in audio using spectral encoding. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Generate Sound through Propagate to Detect & Capture and Analyze & Decode.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Encode History" and "Steganography Science" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Dead Drop — BLE Message Transfer',related1_desc:'Encrypt and exchange secret messages via BLE simulation',related1_path:'../../45-time-manipulation/chrono-chronos-beacon/index.html',related2_name:'Dead Drop — BLE Message Transfer',related2_desc:'Encrypt and exchange secret messages via BLE simulation',related2_path:'../../46-swarm-intelligence/swarm-particle-swarm-optimizer/index.html',related3_name:'Gait ID \\u2014 WiFi Person Identification',related3_desc:'WiFi channel state information identifies people by walking pattern',related3_path:'../../43-bio-radio/bio-walking-gait-id/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Acoustic Levitator',pathPrev_path:'../../44-acoustic-warfare/sonic-acoustic-levitator/index.html',pathNext_name:'Dead Drop — BLE Message Transfer',pathNext_path:'../../44-acoustic-warfare/sonic-dolphin-attack-lab/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What unit is commonly used for signal strength?',quiz_q1a:'Hertz',quiz_q1b:'Decibels (dBm)',quiz_q1c:'Watts only',quiz_q1d:'Meters',quiz_q1_answer:'1',quiz_q2:'What frequency range can humans hear?',quiz_q2a:'1-100 Hz',quiz_q2b:'20-20,000 Hz',quiz_q2c:'100-50,000 Hz',quiz_q2d:'1-1,000 Hz',quiz_q2_answer:'1',quiz_q3:'What is signal-to-noise ratio (SNR)?',quiz_q3a:'Signal color',quiz_q3b:'Ratio of signal power to noise power',quiz_q3c:'Signal speed',quiz_q3d:'Number of signals',quiz_q3_answer:'1',quiz_q4:'What is the relationship between wavelength and frequency?',quiz_q4a:'Directly proportional',quiz_q4b:'Inversely proportional',quiz_q4c:'No relationship',quiz_q4d:'Exponential',quiz_q4_answer:'1',quiz_q5:'What is sampling rate in digital signal processing?',quiz_q5a:'Signal color',quiz_q5b:'Number of samples per second',quiz_q5c:'Wire thickness',quiz_q5d:'Antenna height',quiz_q5_answer:'1'},
    wiki_history_title: '📜 History of Physics',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. Audio Steganography builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Sonic Audio Steganography',
    wiki_math: 'The mathematics behind Audio Steganography: Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Embedding capacity depends on cover size. A 1 MP image with 1-bit LSB can hide 375 KB. PSNR > 40 dB typically means the modification is visually imperceptible.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced physics practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to physics. Hardware-based solutions using browser offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with physics: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in physics.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Physics carries important ethical and legal responsibilities. Many countries regulate the use of browser and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'Hertz (Hz)',
    gloss2_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
    gloss3_term: 'LSB Insertion',
    gloss3_def: 'Least Significant Bit insertion — replacing the lowest bit of each pixel with a message bit. Changes are invisible to the eye but detectable by statistical analysis.',
    gloss4_term: 'Resonance',
    gloss4_def: 'When a system vibrates at its natural frequency, amplitude increases dramatically. Resonance enables acoustic attacks on specific structures and is key to musical instrument design.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Audio Steganography demonstrates key principles from acoustic physics. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Steganography hides data within cover media (images, audio, video) so its existence is undetectable. Unlike encryption, the goal is to hide the communication itself. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world physics?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional physics systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use browser hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title:'Steganographie Audio', subtitle:'Cacher des Donnees dans la Musique',
    disconnected:'Inactif', connected:'Traitement',
    mainSection:'Steganographie Audio', mainDesc:'Integrer des messages caches dans l\'audio par encodage spectral',
    sectionA:'Historique d\'Encodage', sectionB:'Science de la Steganographie', sectionC:'Defi',
    msgPlaceholder:'Message secret a cacher...',
    encodeBtn:'Encoder', decodeBtn:'Decoder', playBtn:'Jouer',
    stegoLabel:'Etat Stego', capacityLabel:'Capacite', decodedLabel:'Decode',
    stegoReady:'Pret', encodeHint:'Les operations d\'encodage apparaissent ici.',
    activityLog:'Journal', eventsMsg:'Evenements et messages',
    clear:'Effacer', copy:'Copier', theme:'Theme', settings:'Parametres', language:'Langue',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki', filterAll:'Tout',
    soundEffects:'Effets sonores', ready:'Steganographie audio prete!',
    splashHint:'appuyer pour passer', langChanged:'Langue > Francais', themeChanged:'Theme >',
    encoded:'Message encode dans l\'audio!', decoded:'Message decode avec succes!',
    noMsg:'Entrez d\'abord un message', noAudio:'Pas d\'audio encode a decoder',
    playing:'Lecture de l\'audio stego...', stopped:'Lecture arretee',
    howto_1:'L écran principal affiche la simulation Audio Steganography. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Create a specific acoustic signal with precise frequency and', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.', howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_lsb_title:'Encodage LSB', wiki_lsb:'Remplacer les bits de poids faible des echantillons audio par les bits du message. Imperceptible a l\'oreille.',
    wiki_ss_title:'Spectre Etale', wiki_ss:'Etaler le message sur le spectre frequentiel avec une sequence pseudo-aleatoire. Tres robuste contre la compression.',
    wiki_echo_title:'Masquage par Echo', wiki_echo:'Integrer les donnees en introduisant des micro-echos. Bit 0/1 corresponds a differents delais d\'echo.',
    challenge1:'Pouvez-vous detecter les donnees cachees en ecoutant l\'audio?',
    challenge2:'Quelle est la taille maximale du message pour un porteur de 3 secondes?',
    challenge3:'Comment un steganalyste detecterait-il cet encodage?',
    challengeReveal1:'Non! L\'encodage utilise des tons haute frequence pres de 19-20kHz inaudibles pour la plupart des adultes.',
    challengeReveal2:'Avec 44100 Hz et 8 bits par caractere, un porteur de 3s a 132300 echantillons, permettant ~16537 caracteres. En pratique, ~256 octets pour une extraction fiable.',
    challengeReveal3:'L\'analyse spectrale revelerait des pics d\'energie inhabituels a 19-20kHz. Des tests statistiques detecteraient des motifs non aleatoires.',
    revealBtn:'Reveler la reponse',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Générer le son',step1Desc:'Crée un signal acoustique avec une fréquence et amplitude précises. Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',step2Title:'Propager',step2Desc:'L\'onde sonore se déplace dans l\'air, les murs ou d\'autres milieux. Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',step3Title:'Détecter et capturer',step3Desc:'Les microphones capturent l\'énergie acoustique et la convertissent. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',step4Title:'Analyser et décoder',step4Desc:'Le traitement extrait les informations cachées ou cartographie l\'environnement. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Audio Steganography ?',faq_a1:'Audio Steganography est une simulation interactive qui démontre les concepts de physique acoustique. Embed hidden messages in audio using spectral encoding. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de science acoustique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de science acoustique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut Mixed. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de science acoustique.',demo_s1:'Bienvenue dans Audio Steganography ! Regarde l\'écran principal — c\'est ici que la simulation de science acoustique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de science acoustique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Audio Steganography ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de physique acoustique — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Create a specific acoustic signal with precise fre Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de science acoustique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Balayage de Paramètre',ch1Desc:'Change systématiquement une variable en gardant les autres constantes. Peux-tu trouver la relation entrée-sortie ?',ch2Title:'Cas Limite',ch2Desc:'Pousse un paramètre à sa valeur extrême. Que se passe-t-il ? Le système se comporte-t-il différemment aux limites ?',ch3Title:'Prédis Puis Teste',ch3Desc:'Avant de démarrer, prédis le résultat. Avais-tu raison ? Qu\'as-tu manqué ?',codeTitle:'Comment Marche Cette Appli',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Chaque appli utilise un Canvas HTML5 pour la visualisation en temps réel. La fonction draw() s\'exécute ~60 fois par seconde via requestAnimationFrame. Elle efface l\'écran, dessine l\'état actuel, et programme la prochaine image. C\'est la même technique que dans les jeux vidéo.',purpose:'Audio Steganography : Embed hidden messages in audio using spectral encoding. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Dead Drop — Transfert BLE',related1_desc:'Chiffrez et échangez des messages secrets via simulation BLE',related1_path:'../../45-time-manipulation/chrono-chronos-beacon/index.html',related2_name:'Dead Drop — Transfert BLE',related2_desc:'Chiffrez et échangez des messages secrets via simulation BLE',related2_path:'../../46-swarm-intelligence/swarm-particle-swarm-optimizer/index.html',related3_name:'Gait ID \\u2014 WiFi Person Identification',related3_desc:'WiFi channel state information identifies people by walking pattern',related3_path:'../../43-bio-radio/bio-walking-gait-id/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Levitateur Acoustique',pathPrev_path:'../../44-acoustic-warfare/sonic-acoustic-levitator/index.html',pathNext_name:'Dead Drop — Transfert BLE',pathNext_path:'../../44-acoustic-warfare/sonic-dolphin-attack-lab/index.html',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'Quelle unité mesure la puissance du signal ?',quiz_q1a:'Hertz',quiz_q1b:'Décibels (dBm)',quiz_q1c:'Watts uniquement',quiz_q1d:'Mètres',quiz_q1_answer:'1',quiz_q2:'Quelle plage de fréquences l\'humain peut-il entendre ?',quiz_q2a:'1-100 Hz',quiz_q2b:'20-20 000 Hz',quiz_q2c:'100-50 000 Hz',quiz_q2d:'1-1 000 Hz',quiz_q2_answer:'1',quiz_q3:'Qu\'est-ce que le rapport signal/bruit (SNR) ?',quiz_q3a:'Couleur du signal',quiz_q3b:'Rapport puissance signal/bruit',quiz_q3c:'Vitesse du signal',quiz_q3d:'Nombre de signaux',quiz_q3_answer:'1',quiz_q4:'Quelle relation entre longueur d\'onde et fréquence ?',quiz_q4a:'Directement proportionnelle',quiz_q4b:'Inversement proportionnelle',quiz_q4c:'Aucune relation',quiz_q4d:'Exponentielle',quiz_q4_answer:'1',quiz_q5:'Qu\'est-ce que le taux d\'échantillonnage ?',quiz_q5a:'Couleur du signal',quiz_q5b:'Nombre d\'échantillons par seconde',quiz_q5c:'Épaisseur du fil',quiz_q5d:'Hauteur d\'antenne',quiz_q5_answer:'1'},
    wiki_history_title: '📜 Histoire de physique',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. Audio Steganography s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Sonic Audio Steganography',
    wiki_math: 'Les mathématiques derrière Audio Steganography : Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Embedding capacity depends on cover size. A 1 MP image with 1-bit LSB can hide 375 KB. PSNR > 40 dB typically means the modification is visually imperceptible.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de physique utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour physique. Les solutions matérielles avec browser offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en physique : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Physique implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de browser. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'Hertz (Hz)',
    gloss2_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
    gloss3_term: 'LSB Insertion',
    gloss3_def: 'Least Significant Bit insertion — replacing the lowest bit of each pixel with a message bit. Changes are invisible to the eye but detectable by statistical analysis.',
    gloss4_term: 'Resonance',
    gloss4_def: 'When a system vibrates at its natural frequency, amplitude increases dramatically. Resonance enables acoustic attacks on specific structures and is key to musical instrument design.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Audio Steganography démontre les principes clés de physique acoustique. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Steganography hides data within cover media (images, audio, video) so its existence is undetectable. Unlike encryption, the goal is to hide the communication itself. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec physics dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel browser et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title:'إخفاء صوتي', subtitle:'إخفاء البيانات داخل الموسيقى',
    disconnected:'خامل', connected:'معالجة',
    mainSection:'الإخفاء الصوتي', mainDesc:'تضمين رسائل مخفية في الصوت باستخدام الترميز الطيفي',
    sectionA:'سجل التشفير', sectionB:'علم الإخفاء', sectionC:'التحدي',
    msgPlaceholder:'الرسالة السرية للإخفاء...',
    encodeBtn:'تشفير', decodeBtn:'فك التشفير', playBtn:'تشغيل',
    stegoLabel:'حالة الإخفاء', capacityLabel:'السعة', decodedLabel:'مفكوك',
    stegoReady:'جاهز', encodeHint:'عمليات التشفير تظهر هنا.',
    activityLog:'سجل النشاط', eventsMsg:'أحداث ورسائل',
    clear:'مسح', copy:'نسخ', theme:'المظهر', settings:'الإعدادات', language:'اللغة',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي', filterAll:'الكل',
    soundEffects:'مؤثرات صوتية', ready:'الإخفاء الصوتي جاهز!',
    splashHint:'انقر للتخطي', langChanged:'اللغة > العربية', themeChanged:'المظهر >',
    encoded:'تم تشفير الرسالة في الصوت!', decoded:'تم فك الرسالة بنجاح!',
    noMsg:'أدخل رسالة أولاً', noAudio:'لا يوجد صوت مشفر لفك تشفيره',
    playing:'تشغيل الصوت المخفي...', stopped:'توقف التشغيل',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Audio Steganography. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Create a specific acoustic signal with precise frequency and', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.', howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_lsb_title:'ترميز LSB', wiki_lsb:'استبدال البتات الأقل أهمية في عينات الصوت ببتات الرسالة. غير محسوس للأذن البشرية.',
    wiki_ss_title:'الطيف المنتشر', wiki_ss:'نشر الرسالة عبر الطيف الترددي باستخدام تسلسل شبه عشوائي. متين ضد الضغط.',
    wiki_echo_title:'إخفاء بالصدى', wiki_echo:'تضمين البيانات بإدخال أصداء دقيقة. البت 0/1 يُعيّن لتأخيرات صدى مختلفة.',
    challenge1:'هل يمكنك اكتشاف البيانات المخفية بالاستماع للصوت؟',
    challenge2:'ما الحجم الأقصى للرسالة لحامل من 3 ثوان؟',
    challenge3:'كيف يكتشف محلل الإخفاء هذا الترميز؟',
    challengeReveal1:'لا! الترميز يستخدم نغمات عالية التردد قرب 19-20 كيلوهرتز غير مسموعة لمعظم البالغين.',
    challengeReveal2:'بمعدل 44100 هرتز و 8 بتات لكل حرف، حامل 3 ثوان يحوي 132300 عينة، مما يسمح بـ ~256 بايت لاستخراج موثوق.',
    challengeReveal3:'التحليل الطيفي سيكشف قمم طاقة غير عادية عند 19-20 كيلوهرتز. اختبارات إحصائية تكشف أنماطًا غير عشوائية.',
    revealBtn:'اكشف الإجابة',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
  ,step1Title:'توليد الصوت',step1Desc:'أنشئ إشارة صوتية بتردد وسعة محددين. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',step2Title:'انتشار',step2Desc:'تنتقل الموجة الصوتية عبر الهواء أو الجدران أو الوسائط الأخرى. لاحظ كيف تتغير المؤشرات خلال هذه المرحلة. يسجل سجل النشاط كل حدث لتتبع تسلسل العمليات والتحقق من النتائج.',step3Title:'كشف والتقاط',step3Desc:'تلتقط الميكروفونات الطاقة الصوتية وتحولها إلى بيانات. تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',step4Title:'تحليل وفك تشفير',step4Desc:'تستخرج المعالجة المعلومات المخفية أو ترسم خريطة البيئة. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',sectionCode:'كود الجهاز',faq_q1:'ما هو Audio Steganography؟',faq_a1:'Audio Steganography هي محاكاة تفاعلية توضح مفاهيم الفيزياء الصوتية. Embed hidden messages in audio using spectral encoding. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في علم الصوتيات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من علم الصوتيات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج Mixed. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من علم الصوتيات.',demo_s1:'مرحباً في Audio Steganography! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة علم الصوتيات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـعلم الصوتيات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Acoustics',learn1Desc:'How sound waves travel through air and materials. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'Physics',learn2Title:'Ultrasonic Tech',learn2Desc:'How high-frequency sound enables hidden communication. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'Signals',learn3Title:'Audio Analysis',learn3Desc:'How to capture and analyze sound patterns. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Analysis',learn4Title:'Acoustic Defense',learn4Desc:'How to detect and counter acoustic attacks. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Audio Steganography! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالفيزياء الصوتية — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Create a specific acoustic signal with precise fre لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم علم الصوتيات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'مسح المعاملات',ch1Desc:'غيّر متغيراً واحداً بشكل منهجي مع تثبيت الباقي. هل تجد العلاقة بين المدخل والمخرج؟',ch2Title:'الحالة الحدية',ch2Desc:'ادفع معاملاً لقيمته القصوى. ماذا يحدث؟ هل يتصرف النظام بشكل مختلف عند الحدود؟',ch3Title:'توقع ثم اختبر',ch3Desc:'قبل الضغط على بدء، توقع ما سيحدث. هل كنت محقاً؟ ما الذي فاتك؟',codeTitle:'كيف يعمل هذا التطبيق',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'يستخدم كل تطبيق Canvas HTML5 للتصوير المرئي في الوقت الفعلي. دالة draw() تعمل ~60 مرة في الثانية. تمسح الشاشة، ترسم الحالة الحالية، وتجدول الإطار التالي.',purpose:'Audio Steganography: Embed hidden messages in audio using spectral encoding. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الفيزياء',
    wiki_history: 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits. يبني Audio Steganography على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Sonic Audio Steganography',
    wiki_math: 'الرياضيات وراء Audio Steganography: Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2. Embedding capacity depends on cover size. A 1 MP image with 1-bit LSB can hide 375 KB. PSNR > 40 dB typically means the modification is visually imperceptible.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الفيزياء المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الفيزياء. توفر الحلول المادية باستخدام browser أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الفيزياء: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الفيزياء يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام browser والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'SNR',
    gloss1_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss2_term: 'Hertz (Hz)',
    gloss2_def: 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
    gloss3_term: 'LSB Insertion',
    gloss3_def: 'Least Significant Bit insertion — replacing the lowest bit of each pixel with a message bit. Changes are invisible to the eye but detectable by statistical analysis.',
    gloss4_term: 'Resonance',
    gloss4_def: 'When a system vibrates at its natural frequency, amplitude increases dramatically. Resonance enables acoustic attacks on specific structures and is key to musical instrument design.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Audio Steganography يوضح المبادئ الأساسية في الفيزياء الصوتية. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data. Steganography hides data within cover media (images, audio, video) so its existence is undetectable. Unlike encryption, the goal is to hide the communication itself. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـphysics في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة browser وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'Dead Drop — نقل رسائل BLE',related1_desc:'شفّر وتبادل رسائل سرية عبر محاكاة BLE',related1_path:'../../45-time-manipulation/chrono-chronos-beacon/index.html',related2_name:'Dead Drop — نقل رسائل BLE',related2_desc:'شفّر وتبادل رسائل سرية عبر محاكاة BLE',related2_path:'../../46-swarm-intelligence/swarm-particle-swarm-optimizer/index.html',related3_name:'Gait ID \\u2014 WiFi Person Identification',related3_desc:'WiFi channel state information identifies people by walking pattern',related3_path:'../../43-bio-radio/bio-walking-gait-id/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'الرافعة الصوتية',pathPrev_path:'../../44-acoustic-warfare/sonic-acoustic-levitator/index.html',pathNext_name:'Dead Drop — نقل رسائل BLE',pathNext_path:'../../44-acoustic-warfare/sonic-dolphin-attack-lab/index.html',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'ما الوحدة الشائعة لقياس قوة الإشارة؟',quiz_q1a:'هرتز',quiz_q1b:'ديسيبل (dBm)',quiz_q1c:'واط فقط',quiz_q1d:'أمتار',quiz_q1_answer:'1',quiz_q2:'ما نطاق التردد الذي يسمعه الإنسان؟',quiz_q2a:'1-100 هرتز',quiz_q2b:'20-20,000 هرتز',quiz_q2c:'100-50,000 هرتز',quiz_q2d:'1-1,000 هرتز',quiz_q2_answer:'1',quiz_q3:'ما هي نسبة الإشارة إلى الضوضاء (SNR)؟',quiz_q3a:'لون الإشارة',quiz_q3b:'نسبة قوة الإشارة للضوضاء',quiz_q3c:'سرعة الإشارة',quiz_q3d:'عدد الإشارات',quiz_q3_answer:'1',quiz_q4:'ما العلاقة بين طول الموجة والتردد؟',quiz_q4a:'تناسب طردي',quiz_q4b:'تناسب عكسي',quiz_q4c:'لا علاقة',quiz_q4d:'أسية',quiz_q4_answer:'1',quiz_q5:'ما هو معدل أخذ العينات في معالجة الإشارات الرقمية؟',quiz_q5a:'لون الإشارة',quiz_q5b:'عدد العينات في الثانية',quiz_q5c:'سمك السلك',quiz_q5d:'ارتفاع الهوائي',quiz_q5_answer:'1'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


function T(k) { return (LANG[currentLang] || LANG.en)[k] || LANG.en[k] || k; }

/* ═══════ FRAMEWORK ═══════ */
function setLanguage(lang) {
  currentLang = lang; const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k = el.dataset.i18nPlaceholder; if (s[k] != null) el.placeholder = s[k]; });
  document.title = (s.title || '') + ' — Workshop DIY';
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}
function setTheme(n) {
  document.documentElement.dataset.theme = n;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n));
  const s = $('themeSelect'); if (s) s.value = n;
  try { localStorage.setItem('wdiy-theme', n); } catch {}
  log(T('themeChanged') + ' ' + n, 'info');
}
let logContainer;
function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const d = document.createElement('div'); d.className = 'log-line ' + type;
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
  logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; applyLogFilter();
}
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log('Cleared'); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log('Copied!', 'success'); } catch { log('Copy failed', 'error'); } }
function showToast(m, ms = 0) { const e = $('toastIndicator'), t = $('toastMessage'); if (e && t) { t.textContent = m; e.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const e = $('toastIndicator'); if (e) e.style.display = 'none'; }
function setStatus(on) { const p = $('statusPill'), t = $('statusText'); if (t) t.textContent = on ? T('connected') : T('disconnected'); if (p) p.classList.toggle('connected', on); }
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); setTimeout(() => s.remove(), 600); }
let activeLogFilter = 'all';
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; }); }
function revealChallenge(i) { const a = $('answer' + i); if (a) a.classList.toggle('visible'); }

/* ═══════ CANVAS ═══════ */
const stegoCanvas = $('stegoCanvas'), stegoCtx = stegoCanvas ? stegoCanvas.getContext('2d') : null;
const diffCanvas = $('diffCanvas'), diffCtx = diffCanvas ? diffCanvas.getContext('2d') : null;

function generateCarrierAudio(duration = 3) {
  if (!audioCtx) audioCtx = new AudioCtx();
  const sr = audioCtx.sampleRate, len = sr * duration;
  const buf = audioCtx.createBuffer(1, len, sr); const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    const t = i / sr;
    data[i] = 0.3 * Math.sin(2 * Math.PI * 440 * t) + 0.2 * Math.sin(2 * Math.PI * 554 * t) +
              0.15 * Math.sin(2 * Math.PI * 659 * t) + 0.1 * Math.sin(2 * Math.PI * 880 * t) +
              (Math.random() - 0.5) * 0.05;
  }
  return buf;
}

function encodeMessage(msg) {
  if (!msg) { log(T('noMsg'), 'error'); return; }
  if (!audioCtx) audioCtx = new AudioCtx();
  hiddenMsg = msg; const carrier = generateCarrierAudio(3);
  const data = carrier.getChannelData(0); const sr = audioCtx.sampleRate;
  // Convert message to bits
  const bits = [];
  for (let i = 0; i < msg.length; i++) { const c = msg.charCodeAt(i); for (let b = 7; b >= 0; b--) bits.push((c >> b) & 1); }
  const samplesPerBit = Math.floor(data.length / bits.length);
  // Encode bits as high-frequency tones
  for (let i = 0; i < bits.length; i++) {
    const start = i * samplesPerBit; const freq = bits[i] ? 19500 : 19000;
    for (let j = 0; j < samplesPerBit; j++) data[start + j] += 0.008 * Math.sin(2 * Math.PI * freq * (j / sr));
  }
  encodedBuffer = carrier; setStatus(true);
  $('stegoStatus').textContent = 'ENCODED'; $('stegoStatus').style.color = '#22c55e';
  $('capacityValue').textContent = msg.length + ' / 256 bytes';
  drawSpectrogram(data, stegoCtx, stegoCanvas); drawDiff(bits);
  addEncodeLog('ENCODE', msg);
  log(T('encoded'), 'success');
  showToast(T('encoded'), 2000);
}

function decodeMessage() {
  if (!encodedBuffer) { log(T('noAudio'), 'error'); return; }
  $('decodedMsg').textContent = hiddenMsg; $('decodedMsg').style.color = '#3b82f6';
  addEncodeLog('DECODE', hiddenMsg);
  log(T('decoded'), 'success');
}

function playAudio() {
  if (!encodedBuffer || !audioCtx) { log(T('noAudio'), 'error'); return; }
  const src = audioCtx.createBufferSource(); src.buffer = encodedBuffer; src.connect(audioCtx.destination); src.start();
  isPlaying = true; log(T('playing'), 'tx');
  src.onended = () => { isPlaying = false; log(T('stopped'), 'info'); };
}

function drawSpectrogram(data, ctx, canvas) {
  if (!ctx) return;
  ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 1; ctx.beginPath();
  const step = Math.floor(data.length / canvas.width);
  for (let x = 0; x < canvas.width; x++) {
    const y = canvas.height / 2 + data[x * step] * canvas.height / 2;
    x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();
  // Spectral heat overlay
  ctx.fillStyle = 'rgba(0,255,136,0.05)';
  for (let x = 0; x < canvas.width; x += 4) {
    const val = Math.abs(data[x * step]) * canvas.height;
    ctx.fillRect(x, canvas.height - val, 3, val);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '10px Orbitron';
  ctx.fillText('CARRIER AUDIO + HIDDEN DATA', 10, 15);
  ctx.fillText('Waveform', 10, canvas.height - 5);
}

function drawDiff(bits) {
  if (!diffCtx) return;
  diffCtx.fillStyle = '#0a0a1a'; diffCtx.fillRect(0, 0, diffCanvas.width, diffCanvas.height);
  const bw = diffCanvas.width / bits.length;
  for (let i = 0; i < bits.length; i++) {
    diffCtx.fillStyle = bits[i] ? 'rgba(59,130,246,0.7)' : 'rgba(239,68,68,0.3)';
    diffCtx.fillRect(i * bw, bits[i] ? 10 : diffCanvas.height / 2, bw - 1, bits[i] ? diffCanvas.height / 2 - 10 : diffCanvas.height / 2 - 10);
  }
  diffCtx.fillStyle = 'rgba(255,255,255,0.4)'; diffCtx.font = '10px Orbitron';
  diffCtx.fillText('BIT PATTERN (blue=1, red=0)', 10, diffCanvas.height - 3);
}

function drawIdle() {
  if (stegoCtx) { stegoCtx.fillStyle = '#0a0a1a'; stegoCtx.fillRect(0, 0, stegoCanvas.width, stegoCanvas.height); stegoCtx.fillStyle = 'rgba(0,255,170,0.15)'; stegoCtx.font = '13px Orbitron'; stegoCtx.textAlign = 'center'; stegoCtx.fillText('AUDIO STEGANOGRAPHY — Encode a Message', stegoCanvas.width / 2, stegoCanvas.height / 2); stegoCtx.textAlign = 'left'; }
  if (diffCtx) { diffCtx.fillStyle = '#0a0a1a'; diffCtx.fillRect(0, 0, diffCanvas.width, diffCanvas.height); diffCtx.fillStyle = 'rgba(0,255,170,0.1)'; diffCtx.font = '10px Orbitron'; diffCtx.fillText('BIT PATTERN — encode to visualize', 10, diffCanvas.height / 2); }
}

function addEncodeLog(op, msg) {
  const el = $('encodeLog'); if (!el) return;
  const d = document.createElement('div');
  d.style.cssText = 'padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;' +
    (op === 'ENCODE' ? 'background:rgba(34,197,94,.1);color:#22c55e;border-left:3px solid #22c55e;' : 'background:rgba(59,130,246,.1);color:#3b82f6;border-left:3px solid #3b82f6;');
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + op + ': "' + msg + '" (' + msg.length + ' bytes)';
  el.appendChild(d); el.scrollTop = el.scrollHeight;
}

function fillStegoInfo() {
  const el = $('stegoInfo'); if (!el) return;
  el.innerHTML = '<b>Audio Steganography Methods</b><br><br>' +
    '<b>1. LSB Encoding:</b> Replace least significant bits of audio samples with message bits. Imperceptible to human ear.<br><br>' +
    '<b>2. Spread Spectrum:</b> Spread message across frequency spectrum using pseudo-random sequence. Robust against compression.<br><br>' +
    '<b>3. Echo Hiding:</b> Embed data by introducing micro-echoes. Binary 0/1 mapped to different echo delays.<br><br>' +
    '<b>4. Phase Coding:</b> Replace phase of initial audio segment with encoded data. Very robust method.<br><br>' +
    '<b>5. Tone Insertion:</b> Add inaudible high-frequency tones representing data bits (used in this app).<br><br>' +
    '<b>Detection (Steganalysis):</b> Chi-square test, RS analysis, spectral anomaly detection, comparison with original carrier.';
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(dismissSplash, 2500);
  try { const l = localStorage.getItem('wdiy-lang'); if (l) setLanguage(l); else setLanguage('en'); } catch { setLanguage('en'); }
  try { const t = localStorage.getItem('wdiy-theme'); if (t) setTheme(t); } catch {}
  $('helpBtn').onclick = () => { $('helpPanel').classList.toggle('open'); $('helpOverlay').classList.toggle('active'); };
  $('helpCloseBtn').onclick = $('helpOverlay').onclick = () => { $('helpPanel').classList.remove('open'); $('helpOverlay').classList.remove('active'); };
  $('settingsBtn').onclick = () => { $('settingsPanel').classList.toggle('open'); $('settingsOverlay').classList.toggle('active'); };
  $('settingsCloseBtn').onclick = $('settingsOverlay').onclick = () => { $('settingsPanel').classList.remove('open'); $('settingsOverlay').classList.remove('active'); };
  $('logBtn').onclick = () => $('logPanel').classList.toggle('open');
  $('logCloseBtn').onclick = () => $('logPanel').classList.remove('open');
  $('clearLogBtn').onclick = clearLog; $('copyLogBtn').onclick = copyLog;
  $('langSelect').onchange = e => setLanguage(e.target.value);
  $('themeSelect').onchange = e => setTheme(e.target.value);
  $('soundToggle').onchange = e => { soundEnabled = e.target.checked; };
  document.querySelectorAll('.help-tab').forEach(tab => { tab.onclick = () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const tgt = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)); if (tgt) tgt.classList.add('active'); }; });
  document.querySelectorAll('.log-filter').forEach(btn => { btn.onclick = () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); }; });
  $('encodeBtn').onclick = () => encodeMessage($('hideInput').value);
  $('decodeBtn').onclick = decodeMessage;
  $('playBtn').onclick = playAudio;
  drawIdle(); fillStegoInfo(); log(T('ready'), 'success');
});

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Audio Steganography
   Animated spectral encoding with carrier waveform, hidden data
   embedding, and real-time frequency analysis display
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simAudioStego';let cv,cx,W,H,af=null,t=0;
  const spectrumBins=128;const carrierData=new Float32Array(spectrumBins);
  const stegoData=new Float32Array(spectrumBins);
  const bitStream=[];let bitIdx=0,msgText='HIDDEN MESSAGE ENCODED IN AUDIO SPECTRUM';
  const waterfall=[];const WATERFALL_ROWS=80;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=320;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060812;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
    generateBits();
  }

  function generateBits(){
    bitStream.length=0;
    for(let i=0;i<msgText.length;i++){
      const c=msgText.charCodeAt(i);
      for(let b=7;b>=0;b--)bitStream.push((c>>b)&1);
    }
  }

  function updateSpectrum(){
    for(let i=0;i<spectrumBins;i++){
      const freq=i/spectrumBins;
      // Carrier: musical tones at 440Hz harmonics
      let val=0;
      val+=0.6*Math.exp(-Math.pow((freq-0.1)*20,2));
      val+=0.4*Math.exp(-Math.pow((freq-0.15)*20,2));
      val+=0.3*Math.exp(-Math.pow((freq-0.2)*20,2));
      val+=Math.random()*0.05;
      carrierData[i]=val;

      // Stego: carrier + hidden high-freq tones
      const bit=bitStream[(bitIdx+i)%bitStream.length];
      const stegoFreq=bit?0.88:0.85;
      const stegoPeak=0.15*Math.exp(-Math.pow((freq-stegoFreq)*40,2));
      stegoData[i]=val+stegoPeak+Math.random()*0.02;
    }
    bitIdx=(bitIdx+1)%bitStream.length;
  }

  function drawWaveform(y,h,label,color){
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(20,y,W-40,h);
    cx.strokeStyle=color;cx.lineWidth=1.5;cx.beginPath();
    for(let i=0;i<W-40;i++){
      const tt=(i/(W-40))*8+t*4;
      const val=Math.sin(tt*8)*0.3+Math.sin(tt*12)*0.2+Math.sin(tt*2)*0.4;
      const py=y+h/2+val*h*0.35;
      if(i===0)cx.moveTo(20+i,py);else cx.lineTo(20+i,py);
    }
    cx.stroke();
    cx.fillStyle=color.replace('0.7','0.4');cx.font='8px monospace';cx.textAlign='left';
    cx.fillText(label,28,y+12);
  }

  function drawSpectrumComparison(){
    const sy=85,sh=65,sw=(W-60)/2;
    // Carrier spectrum
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(20,sy,sw,sh);
    for(let i=0;i<spectrumBins;i++){
      const x=20+i/spectrumBins*sw;
      const bh=carrierData[i]*sh*0.85;
      cx.fillStyle='hsla(140,70%,50%,'+(0.3+carrierData[i]*0.5)+')';
      cx.fillRect(x,sy+sh-bh,sw/spectrumBins-0.5,bh);
    }
    cx.fillStyle='rgba(0,255,136,0.4)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('CARRIER SPECTRUM (clean)',28,sy+12);

    // Stego spectrum
    const sx2=30+sw;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(sx2,sy,sw,sh);
    for(let i=0;i<spectrumBins;i++){
      const x=sx2+i/spectrumBins*sw;
      const bh=stegoData[i]*sh*0.85;
      const isHidden=i/spectrumBins>0.82&&i/spectrumBins<0.92;
      cx.fillStyle=isHidden?'hsla(0,70%,50%,'+(0.4+stegoData[i]*0.4)+')':'hsla(200,70%,50%,'+(0.3+stegoData[i]*0.5)+')';
      cx.fillRect(x,sy+sh-bh,sw/spectrumBins-0.5,bh);
    }
    cx.fillStyle='rgba(100,150,255,0.4)';cx.font='8px monospace';
    cx.fillText('STEGO SPECTRUM (data at 19-20kHz)',sx2+8,sy+12);

    // Arrow between
    cx.fillStyle='rgba(255,255,255,0.2)';cx.font='14px sans-serif';cx.textAlign='center';
    cx.fillText('>',20+sw+5,sy+sh/2+4);
  }

  function drawWaterfall(){
    const wy=160,wh=80,ww=W-40;
    // Add new row
    const row=[];
    for(let i=0;i<spectrumBins;i++)row.push(stegoData[i]);
    waterfall.push(row);
    if(waterfall.length>WATERFALL_ROWS)waterfall.shift();

    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(20,wy,ww,wh);
    const rowH=wh/WATERFALL_ROWS;
    const colW=ww/spectrumBins;
    for(let r=0;r<waterfall.length;r++){
      for(let c=0;c<spectrumBins;c++){
        const val=waterfall[r][c];
        if(val<0.1)continue;
        const isHidden=c/spectrumBins>0.82&&c/spectrumBins<0.92;
        const rr=isHidden?Math.floor(val*255):0;
        const gg=isHidden?Math.floor(val*100):Math.floor(val*255);
        const bb=isHidden?0:Math.floor(val*100);
        cx.fillStyle='rgba('+rr+','+gg+','+bb+','+(val*0.8)+')';
        cx.fillRect(20+c*colW,wy+r*rowH,colW,rowH);
      }
    }
    cx.fillStyle='rgba(255,255,255,0.3)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('SPECTROGRAM WATERFALL — Hidden data visible at high frequencies (red)',28,wy+wh+12);
  }

  function drawBitPattern(){
    const bx=20,by=260,bw=W-40,bh=18;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(bx,by,bw,bh);
    const visible=Math.min(bitStream.length,120);
    const cellW=bw/visible;
    for(let i=0;i<visible;i++){
      const bit=bitStream[(bitIdx+i)%bitStream.length];
      cx.fillStyle=bit?'rgba(59,130,246,0.6)':'rgba(239,68,68,0.25)';
      cx.fillRect(bx+i*cellW+0.5,by+1,cellW-1,bh-2);
    }
    cx.fillStyle='rgba(100,200,255,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('ENCODED BIT STREAM (blue=1, red=0)',bx+4,by-3);
  }

  function drawDecodedMsg(){
    const dx=20,dy=285,dw=W-40;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(dx,dy,dw,20);
    const charPos=Math.floor(bitIdx/8)%msgText.length;
    const decoded=msgText.substring(0,charPos+1);
    cx.fillStyle='#22c55e';cx.font='11px monospace';cx.textAlign='left';
    cx.fillText('DECODED> '+decoded+(Math.sin(t*5)>0?'\u2588':''),dx+8,dy+14);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,200,54);
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.strokeRect(8,8,200,54);
    cx.font='10px monospace';cx.fillStyle='#00ffaa';cx.textAlign='left';
    cx.fillText('AUDIO STEGANOGRAPHY',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Spectral Encoding Simulation',16,40);
    cx.fillText('Bits: '+bitStream.length+'  Method: Tone Insert',16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(6,8,18,0.12)';cx.fillRect(0,0,W,H);

    updateSpectrum();
    drawWaveform(15,55,'CARRIER + HIDDEN DATA WAVEFORM','rgba(0,255,136,0.7)');
    drawSpectrumComparison();
    drawWaterfall();
    drawBitPattern();
    drawDecodedMsg();
    drawHUD();

    cx.fillStyle='rgba(0,255,170,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Audio Steganography — Spectral Tone Insertion Encoding',8,H-8);

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
function setupLinks(){const L=LANG[document.documentElement.lang||'en'];['related1','related2','related3'].forEach(k=>{const a=document.getElementById(k+'Link');if(a&&L[k+'_path'])a.href=L[k+'_path'];});const pp=document.getElementById('pathPrevLink'),pn=document.getElementById('pathNextLink');if(pp&&L.pathPrev_path)pp.href=L.pathPrev_path;if(pn&&L.pathNext_path)pn.href=L.pathNext_path;if(pp&&!L.pathPrev_path)document.getElementById('pathPrevP').style.display='none';if(pn&&!L.pathNext_path)document.getElementById('pathNextP').style.display='none';}document.addEventListener('DOMContentLoaded',setupLinks);
