/**
 * Handshake Theater — WPA 4-Way
 * 4-step handshake animation with key derivation
 * Workshop DIY — Template v1.2 + App Logic
 */

const $ = id => document.getElementById(id);

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7zm21,.-1.6h-6.5v3.2h6.5zm-13,.16.2h-3.2v-16.2h3.2zm19.5,0h-3.2v-16.2h3.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/></svg>`;
const FOOTER_ICON = '';
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  if (type === 'click') { osc.frequency.value = 800; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); }
  else if (type === 'success') { osc.frequency.value = 523; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); }
  else if (type === 'error') { osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); }
}

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
    title: 'Handshake Theater — WPA 4-Way', subtitle: 'Watch the WPA2 4-way handshake unfold',
    disconnected: 'Idle', connected: 'Handshaking',
    mainSection: '4-Way Handshake', mainDesc: 'Step-by-step WPA2 authentication animation',
    sectionA: 'Key Derivation', sectionB: 'Handshake Timeline', sectionC: 'How It Works',
    start: 'Play', reset: 'Reset', client: 'Client (STA)', ap: 'Access Point (AP)',
    step1Title: 'AP → Client: ANonce', step1Desc: 'AP sends its random nonce (ANonce) to the client. Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',
    step2Title: 'Client → AP: SNonce + MIC', step2Desc: 'Client generates SNonce, derives PTK, sends SNonce with MIC proof. Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',
    step3Title: 'AP → Client: GTK + MIC', step3Desc: 'AP derives PTK, verifies MIC, sends encrypted GTK with MIC. This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',
    step4Title: 'Client → AP: ACK', step4Desc: 'Client confirms GTK installation, handshake complete. The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',
    keyDesc: 'Cryptographic keys generated during the handshake',
    howItWorksText: 'The WPA2 4-way handshake establishes a secure connection between a client and an access point. Both sides share a Pre-Shared Key (PSK) which is used to derive the Pairwise Master Key (PMK). The AP sends a random ANonce, the client generates an SNonce, and together they derive the Pairwise Transient Key (PTK) used for encrypting unicast traffic. The Group Temporal Key (GTK) handles broadcast traffic. Message Integrity Codes (MIC) prove each side knows the PMK without revealing it.',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    settings: 'Settings', language: 'Language', theme: 'Theme', soundEffects: 'Sound effects',
    help: 'Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1:'The main display shows the Handshake Theater simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how AP sends its random nonce (ANonce) to the client',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Key Derivation" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_hs_title: '4-Way Handshake', wiki_hs: 'The WPA2 handshake uses EAPOL frames to establish encryption without revealing the password.',
    wiki_keys_title: 'Key Hierarchy', wiki_keys:'PSK → PMK → PTK (unicast) + GTK (broadcast). Each session gets unique keys. Encryption transforms readable data into scrambled ciphertext using a mathematical algorithm and a secret key. Without the correct key, the data appears random. Strong encryption uses keys so large that guessing them would take billions of years.',
    wiki_privacy_title: 'Privacy', wiki_privacy:'Local-first, privacy-first. All data stays in your browser. This application processes everything locally in your browser using JavaScript. No data is sent to any server. Your experiments, settings, and results stay on your device. This architecture is called "local-first" and guarantees complete data privacy.',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: 'Handshake Theater ready!', logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    splashHint: 'tap to skip', working: 'Working...',
    langChanged: 'Language → English', themeChanged: 'Theme →',
    hsStarted: 'Handshake animation started', hsComplete: 'Handshake complete — encrypted session established!',
    hsReset: 'Handshake reset',
    tl1: 'AP generates random ANonce', tl2: 'AP sends EAPOL Message 1 (ANonce)', tl3: 'Client generates SNonce',
    tl4: 'Client derives PTK from PMK + ANonce + SNonce', tl5: 'Client sends EAPOL Message 2 (SNonce + MIC)',
    tl6: 'AP derives PTK, verifies MIC', tl7: 'AP sends EAPOL Message 3 (encrypted GTK + MIC)',
    tl8: 'Client installs PTK and GTK', tl9: 'Client sends EAPOL Message 4 (ACK)',
    tl10: 'Secure encrypted session established',sectionCode:'Device Code',faq_q1:'What is Handshake Theater — WPA 4-Way?',faq_a1:'Handshake Theater is an interactive simulation that demonstrates WiFi security concepts. Step-by-step WPA2 authentication animation. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real WiFi reconnaissance behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Click Play to start the handshake animation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'PSK → PMK → PTK + GTK. Try systematically: set all controls to their defaults, then change one variable at a time. Record what happens at minimum, midpoint, and maximum values. This methodical approach is exactly how researchers and engineers characterize real systems.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need WiFi adapter. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Wifi Beacon Flood and Wifi Channel Heatmap. Each app in this category teaches a different aspect of WiFi reconnaissance.',demo_s1:'Welcome to Handshake Theater — WPA 4-Way! Look at the main display — this is where the WiFi reconnaissance simulation runs.',demo_s2:'Click Play to start the handshake animation. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Key Derivation" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of WiFi reconnaissance.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'WiFi Signals',learn1Desc:'How wireless networks broadcast and receive data. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'WiFi',learn2Title:'WiFi Security',learn2Desc:'How encryption protects wireless connections. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Security',learn3Title:'Channel Analysis',learn3Desc:'How WiFi channels share the radio spectrum. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Spectrum',learn4Title:'WiFi Monitoring',learn4Desc:'How to detect rogue access points and attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Handshake Theater! This is like a science experiment on your computer. You get to control a real WiFi security simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how AP sends its random nonce (ANonce) to the client Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches WiFi reconnaissance concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Packet Trace',ch1Desc:'Send a message through the network and trace every hop it takes. How many nodes does it pass through? What happens if one goes down?',ch2Title:'Latency Hunt',ch2Desc:'Find the bottleneck in the network by measuring latency at each node. Which link is the slowest and why?',ch3Title:'Security Audit',ch3Desc:'Try to find the unencrypted channel in the network. What information can you see? How would you fix it?',codeTitle:'Starter Code',codeLang:'Python (Scapy)',codeSnippet:'from scapy.all import *\\n\\ndef packet_handler(pkt):\\n    if pkt.haslayer(Dot11Beacon):\\n        ssid = pkt[Dot11Elt].info.decode(errors="ignore")\\n        bssid = pkt[Dot11].addr2\\n        channel = int(ord(pkt[Dot11Elt:3].info))\\n        signal = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else "N/A"\\n        print(f"SSID: {ssid:30s}  BSSID: {bssid}  CH: {channel:2d}  Signal: {signal}")\\n\\nprint("Sniffing WiFi beacons... (requires monitor mode)")\\nsniff(iface="wlan0mon", prn=packet_handler, store=0)',codeExplain:'This script uses Scapy to capture WiFi beacon frames — the packets that access points broadcast every ~100ms to announce their presence. Each beacon contains the network name (SSID), MAC address (BSSID), channel number, and signal strength. Your WiFi adapter must be in monitor mode (airmon-ng start wlan0) to capture raw 802.11 frames.',purpose:'Handshake Theater — WPA 4-Way: Step-by-step WPA2 authentication animation. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from AP → Client: ANonce through Client → AP: SNonce + MIC to AP → Client: GTK + MIC and Client → AP: ACK.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Key Derivation" and "Handshake Timeline" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Persona Generator',related1_desc:'Generate probe patterns and MAC addresses',related1_path:'../../15-wifi-spy/wifi-persona-builder/index.html',related2_name:'Hidden Network Scanner',related2_desc:'Active probing & passive monitoring simulation',related2_path:'../../16-wifi-hackrf/wifi-hidden-network/index.html',related3_name:'Movement Detection',related3_desc:'RSSI-based device movement tracking simulation',related3_path:'../../15-wifi-spy/wifi-movement-tracker/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'AP Comparison',pathPrev_path:'../../14-wifi-recon/wifi-evil-twin-spotter/index.html',pathNext_name:'Frame Dissector',pathNext_path:'../../14-wifi-recon/wifi-packet-microscope/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What does SSID stand for?',quiz_q1a:'Signal Strength ID',quiz_q1b:'Service Set Identifier',quiz_q1c:'Secure System ID',quiz_q1d:'Simple Signal ID',quiz_q1_answer:'1',quiz_q2:'Which protocol secures modern Wi-Fi networks?',quiz_q2a:'WEP',quiz_q2b:'WPA3',quiz_q2c:'HTTP',quiz_q2d:'FTP',quiz_q2_answer:'1',quiz_q3:'If frequency doubles, what happens to wavelength?',quiz_q3a:'Doubles',quiz_q3b:'Halves',quiz_q3c:'Stays same',quiz_q3d:'Triples',quiz_q3_answer:'1',quiz_q4:'What does AI stand for?',quiz_q4a:'Automated Input',quiz_q4b:'Artificial Intelligence',quiz_q4c:'Analog Interface',quiz_q4d:'Active Integration',quiz_q4_answer:'1',quiz_q5:'Which frequency range is UHF?',quiz_q5a:'3-30 MHz',quiz_q5b:'30-300 MHz',quiz_q5c:'300 MHz-3 GHz',quiz_q5d:'3-30 GHz',quiz_q5_answer:'2'},
    wiki_history_title: '📜 History of Wifi Security',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. Handshake Theater builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Handshake Theater',
    wiki_math: 'The mathematics behind Handshake Theater: Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). Shannon capacity C = B·log₂(1+SNR) sets the theoretical maximum data rate. WiFi approaches this limit using advanced coding and modulation.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced WiFi security practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to WiFi security. Hardware-based solutions using WiFi adapter offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with WiFi security: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in WiFi security.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Wifi Security carries important ethical and legal responsibilities. Many countries regulate the use of WiFi adapter and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'SSID',
    gloss2_def: 'Service Set Identifier — the network name broadcast by an access point. Clients use SSIDs to identify and connect to specific WiFi networks.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Handshake Theater demonstrates key principles from WiFi security. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. WiFi (802.11) operates on 2.4 GHz and 5 GHz bands. It uses OFDM modulation to transmit data across multiple subcarriers simultaneously. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world WiFi security?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional WiFi security systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use WiFi adapter hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title: 'Handshake Theater — WPA 4 Etapes', subtitle: 'Regardez le handshake WPA2 se derouler',
    disconnected: 'Inactif', connected: 'Authentification',
    mainSection: 'Handshake 4 Etapes', mainDesc: 'Animation d\'authentification WPA2 etape par etape',
    sectionA: 'Derivation des Cles', sectionB: 'Chronologie', sectionC: 'Comment ca marche',
    start: 'Jouer', reset: 'Reinitialiser', client: 'Client (STA)', ap: 'Point d\'Acces (AP)',
    step1Title: 'AP → Client : ANonce', step1Desc: 'L\'AP envoie son nonce aleatoire (ANonce) au client. Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',
    step2Title: 'Client → AP : SNonce + MIC', step2Desc: 'Le client genere SNonce, derive PTK, envoie SNonce avec preuve MIC. Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',
    step3Title: 'AP → Client : GTK + MIC', step3Desc: 'L\'AP derive PTK, verifie MIC, envoie GTK chiffre avec MIC. Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',
    step4Title: 'Client → AP : ACK', step4Desc: 'Le client confirme l\'installation du GTK, handshake termine. Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',
    keyDesc: 'Cles cryptographiques generees pendant le handshake',
    howItWorksText: 'Le handshake WPA2 en 4 etapes etablit une connexion securisee entre un client et un point d\'acces. Les deux cotes partagent une cle pre-partagee (PSK) utilisee pour deriver la cle PMK. L\'AP envoie un ANonce, le client genere un SNonce, et ensemble ils derivent le PTK pour chiffrer le trafic.',
    activityLog: 'Journal', eventsMsg: 'Evenements', clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    settings: 'Parametres', language: 'Langue', theme: 'Theme', soundEffects: 'Effets sonores',
    help: 'Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1:'L écran principal affiche la simulation Handshake Theater. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how AP sends its random nonce (ANonce) to the client', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.', howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_hs_title: 'Handshake', wiki_hs: 'Le handshake WPA2 utilise EAPOL.',
    wiki_keys_title: 'Cles', wiki_keys: 'PSK → PMK → PTK + GTK.',
    wiki_privacy_title: 'Confidentialite', wiki_privacy: 'Tout reste dans votre navigateur.',
    t_mosque: 'Mosquee', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: 'Theater pret !', logCleared: 'Journal efface', copied: 'Copie !', copyFail: 'Echec',
    splashHint: 'appuyer pour passer', working: 'En cours...',
    langChanged: 'Langue → Francais', themeChanged: 'Theme →',
    hsStarted: 'Animation demarree', hsComplete: 'Handshake termine !', hsReset: 'Reinitialise',
    tl1: 'AP genere ANonce', tl2: 'AP envoie Message 1', tl3: 'Client genere SNonce',
    tl4: 'Client derive PTK', tl5: 'Client envoie Message 2', tl6: 'AP verifie MIC',
    tl7: 'AP envoie Message 3', tl8: 'Client installe cles', tl9: 'Client envoie Message 4',
    tl10: 'Session chiffree etablie',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que Handshake Theater — WPA 4-Way ?',faq_a1:'Handshake Theater est une simulation interactive qui démontre les concepts de sécurité WiFi. Step-by-step WPA2 authentication animation. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de reconnaissance WiFi. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de reconnaissance WiFi. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut WiFi adapter. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de reconnaissance WiFi.',demo_s1:'Bienvenue dans Handshake Theater — WPA 4-Way ! Regarde l\'écran principal — c\'est ici que la simulation de reconnaissance WiFi fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de reconnaissance WiFi.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'WiFi Signals',learn1Desc:'How wireless networks broadcast and receive data. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'WiFi',learn2Title:'WiFi Security',learn2Desc:'How encryption protects wireless connections. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'Security',learn3Title:'Channel Analysis',learn3Desc:'How WiFi channels share the radio spectrum. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Spectrum',learn4Title:'WiFi Monitoring',learn4Desc:'How to detect rogue access points and attacks. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Handshake Theater ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de sécurité WiFi — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how AP sends its random nonce (ANonce) to the client Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de reconnaissance WiFi par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Trace de Paquets',ch1Desc:'Envoie un message et trace chaque saut. Combien de nœuds traverse-t-il ? Que se passe-t-il si un tombe ?',ch2Title:'Chasse à la Latence',ch2Desc:'Trouve le goulot d\'étranglement en mesurant la latence à chaque nœud. Quel lien est le plus lent et pourquoi ?',ch3Title:'Audit de Sécurité',ch3Desc:'Trouve le canal non chiffré dans le réseau. Quelles informations vois-tu ? Comment le corriger ?',codeTitle:'Code de Démarrage',codeLang:'Python (Scapy)',codeSnippet:'from scapy.all import *\\n\\ndef packet_handler(pkt):\\n    if pkt.haslayer(Dot11Beacon):\\n        ssid = pkt[Dot11Elt].info.decode(errors="ignore")\\n        bssid = pkt[Dot11].addr2\\n        print(f"SSID: {ssid}  BSSID: {bssid}")\\n\\nsniff(iface="wlan0mon", prn=packet_handler, store=0)',codeExplain:'Ce script utilise Scapy pour capturer les trames beacon WiFi — les paquets que les points d\'accès diffusent toutes les ~100ms. Chaque beacon contient le nom du réseau (SSID), l\'adresse MAC (BSSID), le canal et la puissance du signal. L\'adaptateur doit être en mode moniteur.',purpose:'Handshake Theater — WPA 4-Way : Step-by-step WPA2 authentication animation. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Generateur de Persona',related1_desc:'Generer des motifs de sonde et adresses MAC',related1_path:'../../15-wifi-spy/wifi-persona-builder/index.html',related2_name:'Scanner Reseaux Caches',related2_desc:'Sondage actif et surveillance passive',related2_path:'../../16-wifi-hackrf/wifi-hidden-network/index.html',related3_name:'Detection de Mouvement',related3_desc:'Simulation de suivi par RSSI',related3_path:'../../15-wifi-spy/wifi-movement-tracker/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Comparaison AP',pathPrev_path:'../../14-wifi-recon/wifi-evil-twin-spotter/index.html',pathNext_name:'Dissecteur de Trames',pathNext_path:'../../14-wifi-recon/wifi-packet-microscope/index.html',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'Que signifie SSID ?',quiz_q1a:'Signal Strength ID',quiz_q1b:'Service Set Identifier',quiz_q1c:'Secure System ID',quiz_q1d:'Simple Signal ID',quiz_q1_answer:'1',quiz_q2:'Quel protocole sécurise les réseaux Wi-Fi modernes ?',quiz_q2a:'WEP',quiz_q2b:'WPA3',quiz_q2c:'HTTP',quiz_q2d:'FTP',quiz_q2_answer:'1',quiz_q3:'Si la fréquence double, que devient la longueur d\'onde ?',quiz_q3a:'Double',quiz_q3b:'Divisée par 2',quiz_q3c:'Inchangée',quiz_q3d:'Triplée',quiz_q3_answer:'1',quiz_q4:'Que signifie IA ?',quiz_q4a:'Entrée automatisée',quiz_q4b:'Intelligence Artificielle',quiz_q4c:'Interface analogique',quiz_q4d:'Intégration active',quiz_q4_answer:'1',quiz_q5:'Quelle plage de fréquences est UHF ?',quiz_q5a:'3-30 MHz',quiz_q5b:'30-300 MHz',quiz_q5c:'300 MHz-3 GHz',quiz_q5d:'3-30 GHz',quiz_q5_answer:'2'},
    wiki_history_title: '📜 Histoire de sécurité WiFi',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. Handshake Theater s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Handshake Theater',
    wiki_math: 'Les mathématiques derrière Handshake Theater : Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). Shannon capacity C = B·log₂(1+SNR) sets the theoretical maximum data rate. WiFi approaches this limit using advanced coding and modulation.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de sécurité WiFi utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour sécurité WiFi. Les solutions matérielles avec WiFi adapter offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en sécurité WiFi : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Sécurité wifi implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de WiFi adapter. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'SSID',
    gloss2_def: 'Service Set Identifier — the network name broadcast by an access point. Clients use SSIDs to identify and connect to specific WiFi networks.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Handshake Theater démontre les principes clés de sécurité WiFi. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. WiFi (802.11) operates on 2.4 GHz and 5 GHz bands. It uses OFDM modulation to transmit data across multiple subcarriers simultaneously. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec WiFi security dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel WiFi adapter et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title: 'مسرح المصافحة — WPA رباعي', subtitle: 'شاهد مصافحة WPA2 الرباعية تتكشف',
    disconnected: 'خامل', connected: 'مصافحة',
    mainSection: 'المصافحة الرباعية', mainDesc: 'رسوم متحركة لمصادقة WPA2 خطوة بخطوة',
    sectionA: 'اشتقاق المفاتيح', sectionB: 'الجدول الزمني', sectionC: 'كيف يعمل',
    start: 'تشغيل', reset: 'إعادة', client: 'العميل (STA)', ap: 'نقطة الوصول (AP)',
    step1Title: 'AP → العميل: ANonce', step1Desc: 'ترسل نقطة الوصول رقمها العشوائي. شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',
    step2Title: 'العميل → AP: SNonce + MIC', step2Desc: 'يولد العميل SNonce ويشتق PTK. لاحظ كيف تتغير المؤشرات خلال هذه المرحلة. يسجل سجل النشاط كل حدث لتتبع تسلسل العمليات والتحقق من النتائج.',
    step3Title: 'AP → العميل: GTK + MIC', step3Desc: 'تشتق نقطة الوصول PTK وترسل GTK. تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',
    step4Title: 'العميل → AP: تأكيد', step4Desc: 'يؤكد العميل التثبيت. ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',
    keyDesc: 'المفاتيح المشفرة المولدة أثناء المصافحة',
    howItWorksText: 'تؤسس مصافحة WPA2 الرباعية اتصالاً آمناً. يتشارك الطرفان مفتاحاً مسبقاً لاشتقاق المفاتيح المؤقتة للتشفير.',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث', clear: 'مسح', copy: 'نسخ', export: 'تصدير', filterAll: 'الكل',
    settings: 'الإعدادات', language: 'اللغة', theme: 'المظهر', soundEffects: 'مؤثرات صوتية',
    help: 'مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Handshake Theater. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how AP sends its random nonce (ANonce) to the client', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.', howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_hs_title: 'المصافحة', wiki_hs: 'تستخدم إطارات EAPOL.',
    wiki_keys_title: 'المفاتيح', wiki_keys: 'PSK → PMK → PTK + GTK.',
    wiki_privacy_title: 'الخصوصية', wiki_privacy: 'كل البيانات في متصفحك.',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    ready: 'مسرح المصافحة جاهز!', logCleared: 'تم المسح', copied: 'تم النسخ!', copyFail: 'فشل',
    splashHint: 'انقر للتخطي', working: 'جارٍ...',
    langChanged: 'اللغة ← العربية', themeChanged: 'المظهر ←',
    hsStarted: 'بدأت الرسوم', hsComplete: 'مصافحة مكتملة!', hsReset: 'تم إعادة التعيين',
    tl1: 'AP يولد ANonce', tl2: 'AP يرسل الرسالة 1', tl3: 'العميل يولد SNonce',
    tl4: 'العميل يشتق PTK', tl5: 'العميل يرسل الرسالة 2', tl6: 'AP يتحقق',
    tl7: 'AP يرسل الرسالة 3', tl8: 'العميل يثبت المفاتيح', tl9: 'العميل يرسل الرسالة 4',
    tl10: 'جلسة مشفرة',sectionCode:'كود الجهاز',faq_q1:'ما هو Handshake Theater — WPA 4-Way؟',faq_a1:'Handshake Theater هي محاكاة تفاعلية توضح مفاهيم أمن الواي فاي. Step-by-step WPA2 authentication animation. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في استطلاع الواي فاي. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من استطلاع الواي فاي. نفس المفاهيم يستخدمها المحترفون. جرب بشكل منهجي: اضبط جميع عناصر التحكم على الافتراضي، ثم غير متغيراً واحداً في كل مرة. سجل ما يحدث عند القيم الدنيا والمتوسطة والقصوى.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج WiFi adapter. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من استطلاع الواي فاي.',demo_s1:'مرحباً في Handshake Theater — WPA 4-Way! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة استطلاع الواي فاي.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـاستطلاع الواي فاي.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'WiFi Signals',learn1Desc:'How wireless networks broadcast and receive data. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'WiFi',learn2Title:'WiFi Security',learn2Desc:'How encryption protects wireless connections. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'Security',learn3Title:'Channel Analysis',learn3Desc:'How WiFi channels share the radio spectrum. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Spectrum',learn4Title:'WiFi Monitoring',learn4Desc:'How to detect rogue access points and attacks. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Handshake Theater! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـأمن الواي فاي — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how AP sends its random nonce (ANonce) to the client لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم استطلاع الواي فاي من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'تتبع الحزم',ch1Desc:'أرسل رسالة وتتبع كل قفزة. كم عقدة تمر بها؟ ماذا يحدث إذا سقطت واحدة؟',ch2Title:'البحث عن التأخير',ch2Desc:'اعثر على عنق الزجاجة بقياس التأخير في كل عقدة. أي رابط الأبطأ ولماذا؟',ch3Title:'تدقيق الأمان',ch3Desc:'ابحث عن القناة غير المشفرة. ما المعلومات التي تراها؟ كيف تصلحها؟',codeTitle:'كود البداية',codeLang:'Python (Scapy)',codeSnippet:'from scapy.all import *\\n\\ndef packet_handler(pkt):\\n    if pkt.haslayer(Dot11Beacon):\\n        ssid = pkt[Dot11Elt].info.decode(errors="ignore")\\n        bssid = pkt[Dot11].addr2\\n        print(f"SSID: {ssid}  BSSID: {bssid}")\\n\\nsniff(iface="wlan0mon", prn=packet_handler, store=0)',codeExplain:'يستخدم هذا الكود Scapy لالتقاط إطارات beacon WiFi — الحزم التي تبثها نقاط الوصول كل ~100 مللي ثانية. كل beacon يحتوي اسم الشبكة (SSID) وعنوان MAC (BSSID) والقناة وقوة الإشارة.',purpose:'Handshake Theater — WPA 4-Way: Step-by-step WPA2 authentication animation. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ أمن الواي فاي',
    wiki_history: 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution. يبني Handshake Theater على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Handshake Theater',
    wiki_math: 'الرياضيات وراء Handshake Theater: Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC). Shannon capacity C = B·log₂(1+SNR) sets the theoretical maximum data rate. WiFi approaches this limit using advanced coding and modulation.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو أمن الواي فاي المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في أمن الواي فاي. توفر الحلول المادية باستخدام WiFi adapter أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في أمن الواي فاي: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'أمن الواي فاي يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام WiFi adapter والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Ciphertext',
    gloss1_def: 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    gloss2_term: 'SSID',
    gloss2_def: 'Service Set Identifier — the network name broadcast by an access point. Clients use SSIDs to identify and connect to specific WiFi networks.',
    gloss3_term: 'Latency',
    gloss3_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss4_term: 'Throughput',
    gloss4_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    gloss5_term: 'Protocol',
    gloss5_def: 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.',
    gloss6_term: 'Amplitude',
    gloss6_def: 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Handshake Theater يوضح المبادئ الأساسية في أمن الواي فاي. Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice. WiFi (802.11) operates on 2.4 GHz and 5 GHz bands. It uses OFDM modulation to transmit data across multiple subcarriers simultaneously. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـWiFi security في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة WiFi adapter وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'مولد الشخصيات',related1_desc:'توليد أنماط مسح وعناوين MAC',related1_path:'../../15-wifi-spy/wifi-persona-builder/index.html',related2_name:'ماسح الشبكات المخفية',related2_desc:'محاكاة الفحص النشط والمراقبة السلبية',related2_path:'../../16-wifi-hackrf/wifi-hidden-network/index.html',related3_name:'كشف الحركة',related3_desc:'محاكاة تتبع الحركة بناءً على RSSI',related3_path:'../../15-wifi-spy/wifi-movement-tracker/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'مقارنة AP',pathPrev_path:'../../14-wifi-recon/wifi-evil-twin-spotter/index.html',pathNext_name:'محلل الإطارات',pathNext_path:'../../14-wifi-recon/wifi-packet-microscope/index.html',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'ماذا يعني SSID؟',quiz_q1a:'معرف قوة الإشارة',quiz_q1b:'معرف مجموعة الخدمة',quiz_q1c:'معرف النظام الآمن',quiz_q1d:'معرف الإشارة البسيط',quiz_q1_answer:'1',quiz_q2:'ما البروتوكول الذي يؤمن شبكات الواي فاي الحديثة؟',quiz_q2a:'WEP',quiz_q2b:'WPA3',quiz_q2c:'HTTP',quiz_q2d:'FTP',quiz_q2_answer:'1',quiz_q3:'إذا تضاعف التردد، ماذا يحدث لطول الموجة؟',quiz_q3a:'يتضاعف',quiz_q3b:'ينقسم للنصف',quiz_q3c:'يبقى كما هو',quiz_q3d:'يتضاعف ثلاثاً',quiz_q3_answer:'1',quiz_q4:'ماذا تعني AI؟',quiz_q4a:'إدخال آلي',quiz_q4b:'الذكاء الاصطناعي',quiz_q4c:'واجهة تناظرية',quiz_q4d:'تكامل نشط',quiz_q4_answer:'1',quiz_q5:'ما نطاق التردد UHF؟',quiz_q5a:'3-30 ميغاهرتز',quiz_q5b:'30-300 ميغاهرتز',quiz_q5c:'300 ميغاهرتز-3 غيغاهرتز',quiz_q5d:'3-30 غيغاهرتز',quiz_q5_answer:'2'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang = 'en';
function setLanguage(lang) {
  currentLang = lang; const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => { const k = opt.dataset.i18nOpt; if (s[k] != null) opt.textContent = s[k]; });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info');
}

const THEME_MELODIES = { 'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523] };
function playThemeMelody(name) { if (!soundEnabled || !audioCtx) return; const notes = THEME_MELODIES[name]; if (!notes) return; const t = audioCtx.currentTime; notes.forEach((freq, i) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0.06; g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15); o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2); }); }
function setTheme(name) { document.documentElement.dataset.theme = name; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name)); const sel = $('themeSelect'); if (sel) sel.value = name; try { localStorage.setItem('wdiy-theme', name); } catch {} playThemeMelody(name); log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_' + name] || name}`, 'info'); }

let logContainer;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${type}`; d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (type === 'success') playSound('success'); else if (type === 'error') playSound('error'); applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const t = Array.from(logContainer.children).map(d => d.textContent).join('\n'); try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const lines = Array.from(logContainer.children).map(d => d.textContent); const blob = new Blob([lines.join('\n')], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `handshake-log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); URL.revokeObjectURL(url); }

function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(connected) { const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang]; if (txt) txt.textContent = connected ? s.connected : s.disconnected; if (pill) pill.classList.toggle('connected', connected); }

let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); playSound('click'); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(line => { line.style.display = (activeLogFilter === 'all' || line.classList.contains(activeLogFilter)) ? '' : 'none'; }); }

function openPanel(pid, oid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(pid, oid, rid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.remove('open'); if (ov) ov.classList.remove('open'); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const sb = $('logPanel'); if (sb) sb.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const sb = $('logPanel'); if (sb) sb.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const sb = $('logPanel'); if (sb && sb.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }
function initHelpTabs() { const tabs = document.querySelectorAll('.help-tab'), contents = document.querySelectorAll('.help-content'); tabs.forEach(tab => { tab.addEventListener('click', () => { tabs.forEach(t => t.classList.remove('active')); contents.forEach(c => c.classList.remove('active')); tab.classList.add('active'); const target = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)); if (target) target.classList.add('active'); }); }); }
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day:'numeric', month:'long', year:'numeric' }).format(new Date()); } catch {} }
function initLogResize() { const handle = $('logResizeHandle'), panel = $('logPanel'); if (!handle || !panel) return; let dragging = false, startX, startW; const isRtl = () => document.documentElement.dir === 'rtl'; handle.addEventListener('mousedown', e => { dragging = true; startX = e.clientX; startW = panel.offsetWidth; handle.classList.add('active'); document.body.style.cursor = 'col-resize'; e.preventDefault(); }); document.addEventListener('mousemove', e => { if (!dragging) return; const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6)) + 'px'); }); document.addEventListener('mouseup', () => { if (!dragging) return; dragging = false; handle.classList.remove('active'); document.body.style.cursor = ''; }); }

/* ═══════════════════════════════════════════════════════════════
   APP LOGIC — Handshake Theater
   ═══════════════════════════════════════════════════════════════ */

function randHex(len) { return Array.from({length: len}, () => Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(''); }

let hsRunning = false, currentStep = 0, hsTimeout = null;
let keys = { pmk: '', anonce: '', snonce: '', ptk: '', gtk: '', mic: '' };
let timelineEntries = [];

function resetHandshake() {
  hsRunning = false; currentStep = 0;
  if (hsTimeout) clearTimeout(hsTimeout);
  timelineEntries = [];
  keys = { pmk: '', anonce: '', snonce: '', ptk: '', gtk: '', mic: '' };
  for (let i = 1; i <= 4; i++) { const step = $('step' + i); if (step) step.classList.remove('active', 'done'); }
  const status = $('hsStatus'); if (status) { status.textContent = ''; status.style.cssText = ''; }
  ['keyPMK','keyANonce','keySNonce','keyPTK','keyGTK','keyMIC'].forEach(id => { const el = $(id); if (el) el.textContent = '—'; });
  const tl = $('timeline'); if (tl) tl.innerHTML = '';
  setStatus(false); $('startBtn').disabled = false;
  log(LANG[currentLang].hsReset, 'info');
}

function addTimeline(msg) {
  timelineEntries.push({ time: new Date().toLocaleTimeString(), msg });
  const tl = $('timeline'); if (!tl) return;
  const entry = document.createElement('div');
  entry.style.cssText = 'padding:4px 0;border-bottom:1px solid var(--border);display:flex;gap:8px';
  entry.innerHTML = `<span style="color:var(--accent);font-family:monospace;font-size:.7rem;min-width:70px">${timelineEntries.length}. ${new Date().toLocaleTimeString()}</span><span>${msg}</span>`;
  tl.appendChild(entry);
}

function runStep(stepNum) {
  if (stepNum > 4) {
    const status = $('hsStatus');
    if (status) { status.textContent = LANG[currentLang].hsComplete; status.style.cssText = 'background:rgba(134,239,172,.15);color:#86efac;border:1px solid rgba(134,239,172,.3);border-radius:10px'; }
    setStatus(false); hsRunning = false;
    addTimeline(LANG[currentLang].tl10);
    log(LANG[currentLang].hsComplete, 'success');
    $('startBtn').disabled = false; return;
  }
  const s = LANG[currentLang];
  if (stepNum > 1) { const prev = $('step' + (stepNum - 1)); if (prev) { prev.classList.remove('active'); prev.classList.add('done'); } }
  const step = $('step' + stepNum); if (step) step.classList.add('active');

  switch (stepNum) {
    case 1:
      keys.pmk = randHex(32); keys.anonce = randHex(32);
      $('keyPMK').textContent = keys.pmk; $('keyANonce').textContent = keys.anonce;
      addTimeline(s.tl1); addTimeline(s.tl2);
      log('EAPOL Msg 1: AP → Client (ANonce)', 'tx'); break;
    case 2:
      keys.snonce = randHex(32); keys.ptk = randHex(48); keys.mic = randHex(16);
      $('keySNonce').textContent = keys.snonce; $('keyPTK').textContent = keys.ptk; $('keyMIC').textContent = keys.mic;
      addTimeline(s.tl3); addTimeline(s.tl4); addTimeline(s.tl5);
      log('EAPOL Msg 2: Client → AP (SNonce + MIC)', 'rx'); break;
    case 3:
      keys.gtk = randHex(32); keys.mic = randHex(16);
      $('keyGTK').textContent = keys.gtk; $('keyMIC').textContent = keys.mic;
      addTimeline(s.tl6); addTimeline(s.tl7);
      log('EAPOL Msg 3: AP → Client (GTK + MIC)', 'tx'); break;
    case 4:
      addTimeline(s.tl8); addTimeline(s.tl9);
      log('EAPOL Msg 4: Client → AP (ACK)', 'rx'); break;
  }
  currentStep = stepNum;
  hsTimeout = setTimeout(() => runStep(stepNum + 1), 2000);
}

function startHandshake() {
  if (hsRunning) return;
  resetHandshake(); hsRunning = true; setStatus(true);
  $('startBtn').disabled = true;
  log(LANG[currentLang].hsStarted, 'success');
  hsTimeout = setTimeout(() => runStep(1), 500);
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash(); const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();
  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp; if (hClose) hClose.onclick = closeHelp; if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();
  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings; if (sClose) sClose.onclick = closeSettings; if (sOv) sOv.onclick = closeSettings;
  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog; if (lClose) lClose.onclick = closeLog;
  initLogResize();
  const soundTgl = $('soundToggle');
  if (soundTgl) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} soundTgl.checked = soundEnabled; soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} if (soundEnabled) playSound('click'); }); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); });
  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));
  try { const savedLang = localStorage.getItem('wdiy-lang'); const savedTheme = localStorage.getItem('wdiy-theme'); if (savedTheme) setTheme(savedTheme); if (savedLang) setLanguage(savedLang); } catch {}
  initHijriDate();
  const startBtn = $('startBtn'), resetBtn = $('resetBtn');
  if (startBtn) startBtn.onclick = startHandshake;
  if (resetBtn) resetBtn.onclick = resetHandshake;
  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

/* ═══════ RICH CANVAS SIMULATION — WPA Handshake Packet Flow ═══════ */
(function handshakeCanvas(){
  const CVS_ID='handshakeFlowVis';
  function ensureCanvas(){
    if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);
    const wrap=document.querySelector('.section-card')||document.querySelector('.main-section')||document.querySelector('main');
    if(!wrap)return null;
    const card=document.createElement('div');card.className='section-card';
    card.innerHTML='<div class="section-header"><span class="section-icon">🤝</span> Handshake Packet Flow</div>';
    const c=document.createElement('canvas');c.id=CVS_ID;
    c.style.cssText='width:100%;height:300px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';
    card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c;
  }
  const packets=[];let _raf=null,frameCount=0;
  const stepColors=['#3b82f6','#22c55e','#fbbf24','#a855f7'];
  const stepLabels=['ANonce','SNonce+MIC','GTK+MIC','ACK'];
  function draw(){
    const c=document.getElementById(CVS_ID);if(!c){_raf=null;return;}
    const ctx=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;
    ctx.scale(2,2);const w=W/2,h=H/2;
    ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);
    frameCount++;
    const apX=w*0.15,staX=w*0.85,topY=50,botY=h-30;
    // AP and STA towers
    ctx.fillStyle='rgba(34,197,94,0.15)';ctx.fillRect(apX-20,topY-20,40,botY-topY+40);
    ctx.fillStyle='rgba(59,130,246,0.15)';ctx.fillRect(staX-20,topY-20,40,botY-topY+40);
    // Labels
    ctx.font='bold 10px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillStyle='#22c55e';ctx.fillText('AP',apX,topY-28);
    ctx.fillStyle='#3b82f6';ctx.fillText('STA',staX,topY-28);
    // Vertical lines
    ctx.beginPath();ctx.setLineDash([2,4]);
    ctx.moveTo(apX,topY);ctx.lineTo(apX,botY);
    ctx.moveTo(staX,topY);ctx.lineTo(staX,botY);
    ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);
    // Step indicators
    const cStep=typeof currentStep!=='undefined'?currentStep:0;
    for(let i=0;i<4;i++){
      const y=topY+30+i*(botY-topY-60)/3;
      const fromLeft=i%2===0;
      const fromX=fromLeft?apX:staX;const toX=fromLeft?staX:apX;
      const active=i<cStep;const current=i===cStep-1;
      // Arrow line
      ctx.beginPath();ctx.moveTo(fromX+10*(fromLeft?1:-1),y);ctx.lineTo(toX-10*(fromLeft?1:-1),y);
      ctx.strokeStyle=active?stepColors[i]+'90':'rgba(255,255,255,0.08)';
      ctx.lineWidth=active?2:1;ctx.stroke();
      // Arrowhead
      if(active){
        const dir=fromLeft?1:-1;
        ctx.beginPath();
        ctx.moveTo(toX-15*dir,y-5);ctx.lineTo(toX-5*dir,y);ctx.lineTo(toX-15*dir,y+5);
        ctx.strokeStyle=stepColors[i];ctx.lineWidth=2;ctx.stroke();
      }
      // Label
      ctx.font='8px monospace';ctx.fillStyle=active?stepColors[i]+'cc':'rgba(255,255,255,0.2)';
      ctx.textAlign='center';ctx.fillText('Msg '+(i+1)+': '+stepLabels[i],(apX+staX)/2,y-6);
      // Animate packet blob on current step
      if(current){
        const t=(frameCount%60)/60;
        const px=fromX+(toX-fromX)*t;
        ctx.beginPath();ctx.arc(px,y,5,0,Math.PI*2);
        ctx.fillStyle=stepColors[i];ctx.fill();
        // Trail
        for(let tr=1;tr<=5;tr++){
          const tt=Math.max(0,t-tr*0.04);
          const tx=fromX+(toX-fromX)*tt;
          ctx.beginPath();ctx.arc(tx,y,3,0,Math.PI*2);
          ctx.fillStyle=stepColors[i];ctx.globalAlpha=0.3-tr*0.05;ctx.fill();
        }
        ctx.globalAlpha=1;
      }
    }
    // Key exchange visualization — encrypted data flowing
    if(cStep>=4){
      // Encrypted tunnel effect
      const tunnelY=(topY+botY)/2;
      for(let i=0;i<15;i++){
        const t=((frameCount*2+i*20)%((staX-apX)))/((staX-apX));
        const px=apX+t*(staX-apX);
        const py=tunnelY+Math.sin(t*Math.PI*4+frameCount*0.05)*15;
        ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);
        ctx.fillStyle='#86efac';ctx.globalAlpha=0.3+Math.sin(t*Math.PI)*0.3;ctx.fill();
      }
      ctx.globalAlpha=1;
      ctx.font='bold 10px monospace';ctx.fillStyle='#86efac';ctx.textAlign='center';
      ctx.fillText('ENCRYPTED SESSION ACTIVE',(apX+staX)/2,botY+10);
    }
    // Crypto key particles floating around
    if(typeof hsRunning!=='undefined'&&hsRunning){
      for(let i=0;i<3;i++){
        const kx=w*0.3+Math.sin(frameCount*0.02+i*2)*w*0.15;
        const ky=h*0.3+Math.cos(frameCount*0.015+i*3)*h*0.15;
        ctx.font='7px monospace';ctx.fillStyle='rgba(168,85,247,0.25)';ctx.textAlign='center';
        ctx.fillText('0x'+Math.floor(Math.sin(frameCount*0.01+i)*999999).toString(16),kx,ky);
      }
    }
    _raf=requestAnimationFrame(draw);
  }
  function boot(){const c=ensureCanvas();if(!c)return setTimeout(boot,500);if(!_raf)draw();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
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
