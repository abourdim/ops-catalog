/**
 * LoRa Lab — Workshop DIY v1.2
 * ESP32 LoRa chirp spread spectrum simulator
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Sound
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.3,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.4-2.4c-2.6-1.8-3.9-2.6-6.4-3.6l-.7-.3V160.8c0-4.2.1-7.8.1-7.9z"/></svg>`;
const FOOTER_ICON = '';
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch(type) {
    case 'click': osc.frequency.value=800; osc.type='sine'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.08); osc.start(t); osc.stop(t+0.08); break;
    case 'success': osc.frequency.value=523; osc.type='sine'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.3); osc.start(t); osc.stop(t+0.3); break;
    case 'error': osc.frequency.value=200; osc.type='square'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.25); osc.start(t); osc.stop(t+0.25); break;
  }
}

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
    title: '📶 LoRa Lab', subtitle: 'Long Range Radio — Chirp Spread Spectrum',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Chirp Spread Spectrum Waterfall', mainDesc: 'ESP32 LoRa sends km range, see chirp spectrum',
    sectionA: 'Range Calculator — Distance vs Power', sectionB: 'LoRa Message Log', sectionC: 'LoRa Theory — How Chirps Work',
    sfLabel: 'Spreading Factor:', bwLabel: 'BW:', txPower: 'TX Power:',
    sendBtn: '📡 Send', estRange: 'Est. Range:', dataRate: 'Rate:', airtime: 'Airtime:',
    theory1: 'LoRa uses Chirp Spread Spectrum (CSS) modulation. Each symbol is a frequency sweep (chirp) across the entire bandwidth.',
    theory2: 'Higher Spreading Factors (SF7-SF12) trade data rate for range. SF12 is 64x slower than SF7 but reaches much farther.',
    theory3: 'The waterfall shows how chirps sweep from low to high frequency. Each starting frequency encodes a different symbol value.',
    theory4: 'Link budget: LoRa achieves -137 dBm sensitivity at SF12/125kHz, enabling 15+ km range in open terrain.',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    settings: '⚙️ Settings', language: 'Language', theme: 'Theme',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "Range Calculator — Distance vs Power" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_themes_title: '🎨 Themes', wiki_themes:'8 built-in themes. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_i18n_title: '🌐 Languages', wiki_i18n:'EN/FR/AR with RTL. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_log_title: '📜 Activity Log', wiki_log:'TX/RX event log. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_privacy_title: '🔒 Privacy', wiki_privacy:'100% local simulation. This application processes everything locally in your browser using JavaScript. No data is sent to any server. Your experiments, settings, and results stay on your device. This architecture is called "local-first" and guarantees complete data privacy.',
    soundEffects: '🔊 Sound effects', whisperMode: 'Whisper mode',
    breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    splashHint: 'tap to skip', ready: '📶 LoRa Lab ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    working: 'Working…', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    msgSent: 'Message sent via LoRa', chirpAnim: 'Chirp animation active',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Set Up',step1Desc:'Configure the parameters for 📶 LoRa Lab. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Range Calculator — Distance vs Power" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "LoRa Message Log". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is 📶 LoRa Lab?',faq_a1:'📶 LoRa Lab lets you esp32 lora sends km range, see chirp spectrum. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you set the frequency band, modulation type, and signal parameters. Then you scan the radio spectrum to detect and capture signals of interest.',faq_q3:'What do the controls do?',faq_a3:'Select SF and bandwidth from controls. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real RF engineering principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF + ESP32. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Ble Xray and Esp Collision Visualizer. Each app in this category teaches a different aspect of RF engineering.',demo_s1:'Welcome to 📶 LoRa Lab! Look at the main display — this is where the RF engineering simulation runs.',demo_s2:'Select SF and bandwidth from controls. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Range Calculator — Distance vs Power" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of RF engineering.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how RF engineering works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches RF engineering concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'This Arduino sketch connects the ESP32 to a WiFi network. WiFi.mode(WIFI_STA) sets it as a client (station mode). The while loop waits until connected, then prints the IP address. From here you can add HTTP servers, MQTT, UDP packets, or BLE scanning.',purpose:'📶 LoRa Lab: ESP32 LoRa sends km range, see chirp spectrum. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure RF through Capture Spectrum to Analyze Signal and Classify & Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Range Calculator — Distance vs Power" and "LoRa Message Log" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr: {
    ...LANG_BASE.fr,
    title: '📶 Labo LoRa', subtitle: 'Radio Longue Portee — Spectre Chirp',
    disconnected: 'Deconnecte', connected: 'Connecte',
    mainSection: 'Cascade Chirp Spread Spectrum', mainDesc: 'ESP32 LoRa envoie a des km, voir le spectre chirp',
    sectionA: 'Calculateur de portee — Distance vs Puissance', sectionB: 'Journal Messages LoRa', sectionC: 'Theorie LoRa — Fonctionnement des chirps',
    sfLabel: 'Facteur d\'etalement:', bwLabel: 'BP:', txPower: 'Puissance TX:',
    sendBtn: '📡 Envoyer', estRange: 'Portee est.:', dataRate: 'Debit:', airtime: 'Temps air:',
    theory1: 'LoRa utilise la modulation CSS (Chirp Spread Spectrum). Chaque symbole est un balayage de frequence sur toute la bande.',
    theory2: 'Les facteurs d\'etalement plus eleves (SF7-SF12) echangent le debit contre la portee.',
    theory3: 'La cascade montre comment les chirps balayent de basse a haute frequence.',
    theory4: 'Bilan de liaison: LoRa atteint -137 dBm de sensibilite a SF12/125kHz, permettant 15+ km.',
    activityLog: 'Journal', eventsMsg: 'Evenements et messages',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    settings: '⚙️ Parametres', language: 'Langue', theme: 'Theme',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1:'Regarde la carte principale en haut. C\'est ton panneau de contrôle. Règle les paramètres avec les curseurs et menus déroulants. Chacun est étiqueté. Commence avec les valeurs par défaut pour voir le comportement normal.', howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.', howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_themes_title: '🎨 Themes', wiki_themes: '8 themes integres.',
    wiki_i18n_title: '🌐 Langues', wiki_i18n: 'EN/FR/AR avec RTL.',
    wiki_log_title: '📜 Journal', wiki_log: 'Journal TX/RX.',
    wiki_privacy_title: '🔒 Confidentialite', wiki_privacy: 'Simulation 100% locale.',
    soundEffects: '🔊 Effets sonores', whisperMode: 'Mode murmure',
    breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap', musicMode: 'Reactif musique',
    splashHint: 'appuyer pour passer', ready: '📶 Labo LoRa pret!',
    logCleared: 'Journal efface', copied: 'Copie!', copyFail: 'Echec',
    working: 'En cours…', langChanged: '🌐 Langue → Francais', themeChanged: '🎨 Theme →',
    msgSent: 'Message envoye via LoRa',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configurer',step1Desc:'Configure les paramètres de 📶 LoRa Lab. Choisis tes réglages à l\'aide des contrôles de la carte principale. Chaque contrôle affecte directement le résultat.',step2Title:'Exécuter',step2Desc:'Appuie sur "Start" pour lancer la simulation. La visualisation se met à jour en temps réel.',step3Title:'Observer',step3Desc:'Étudie la section ci-dessous pour les données détaillées. Les chiffres et graphiques montrent ce qui se passe dans la simulation.',step4Title:'Expérimenter',step4Desc:'Change un paramètre à la fois et relance. Compare les résultats. Essaie des valeurs extrêmes pour découvrir les limites.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que 📶 LoRa Lab ?',faq_a1:'📶 LoRa Lab te permet de simuler ingénierie RF. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de ingénierie RF. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de ingénierie RF. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF + ESP32. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de ingénierie RF.',demo_s1:'Bienvenue dans 📶 LoRa Lab ! Regarde l\'écran principal — c\'est ici que la simulation de ingénierie RF fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de ingénierie RF.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne ingénierie RF en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de ingénierie RF par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Code de Démarrage',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'Ce sketch Arduino connecte l\'ESP32 à un réseau WiFi. WiFi.mode(WIFI_STA) le configure en mode client. La boucle while attend la connexion, puis affiche l\'adresse IP. Ensuite tu peux ajouter des serveurs HTTP, MQTT, UDP ou du scan BLE.',purpose:'📶 LoRa Lab : ESP32 LoRa sends km range, see chirp spectrum. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
  ar: {
    ...LANG_BASE.ar,
    title: '📶 مختبر LoRa', subtitle: 'راديو بعيد المدى — طيف Chirp',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'شلال طيف Chirp المنتشر', mainDesc: 'ESP32 LoRa يرسل لمسافات كيلومترات',
    sectionA: 'حاسبة المدى — المسافة مقابل القوة', sectionB: 'سجل رسائل LoRa', sectionC: 'نظرية LoRa — كيف تعمل Chirps',
    sfLabel: 'عامل الانتشار:', bwLabel: 'عرض النطاق:', txPower: 'قوة الإرسال:',
    sendBtn: '📡 إرسال', estRange: 'المدى المقدر:', dataRate: 'المعدل:', airtime: 'وقت البث:',
    theory1: 'يستخدم LoRa تعديل CSS. كل رمز هو مسح تردد عبر كامل عرض النطاق.',
    theory2: 'عوامل الانتشار الأعلى تستبدل معدل البيانات بالمدى.',
    theory3: 'يُظهر الشلال كيف تمسح chirps من تردد منخفض إلى عالٍ.',
    theory4: 'ميزانية الربط: يحقق LoRa حساسية -137 dBm عند SF12/125kHz، مما يتيح مدى 15+ كم.',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', filterAll: 'الكل',
    settings: '⚙️ الإعدادات', language: 'اللغة', theme: 'المظهر',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    howto_1:'انظر إلى البطاقة الرئيسية في الأعلى. هذه لوحة التحكم. اضبط المعاملات باستخدام المنزلقات والقوائم. ابدأ بالقيم الافتراضية لرؤية السلوك الطبيعي أولاً.', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.', howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_themes_title: '🎨 المظاهر', wiki_themes: '8 مظاهر مدمجة.',
    wiki_i18n_title: '🌐 اللغات', wiki_i18n: 'EN/FR/AR مع RTL.',
    wiki_log_title: '📜 سجل النشاط', wiki_log: 'سجل أحداث TX/RX.',
    wiki_privacy_title: '🔒 الخصوصية', wiki_privacy: 'محاكاة محلية 100%.',
    soundEffects: '🔊 مؤثرات صوتية', whisperMode: 'وضع الهمس',
    breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط', musicMode: 'تفاعل موسيقي',
    splashHint: 'انقر للتخطي', ready: '📶 مختبر LoRa جاهز!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    working: 'جارٍ…', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    msgSent: 'تم إرسال الرسالة عبر LoRa',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',step1Title:'إعداد',step1Desc:'اضبط معاملات 📶 LoRa Lab. اختر إعداداتك باستخدام أدوات التحكم في البطاقة الرئيسية. كل أداة تؤثر مباشرة على نتيجة المحاكاة.',step2Title:'تشغيل',step2Desc:'اضغط "Start" لبدء المحاكاة. شاهد التصور المرئي يتحدث في الوقت الفعلي.',step3Title:'مراقبة',step3Desc:'ادرس القسم أدناه للبيانات التفصيلية. الأرقام والرسوم البيانية تُظهر ما يحدث داخل المحاكاة.',step4Title:'تجريب',step4Desc:'غيّر معاملاً واحداً في كل مرة وأعد التشغيل. قارن النتائج. جرّب قيماً متطرفة لاكتشاف حدود النظام.',sectionCode:'كود الجهاز',faq_q1:'ما هو 📶 LoRa Lab؟',faq_a1:'📶 LoRa Lab يتيح لك محاكاة هندسة الترددات. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في هندسة الترددات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من هندسة الترددات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF + ESP32. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من هندسة الترددات.',demo_s1:'مرحباً في 📶 LoRa Lab! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة هندسة الترددات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـهندسة الترددات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل هندسة الترددات من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم هندسة الترددات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كود البداية',codeLang:'Arduino (ESP32)',codeSnippet:'#include <WiFi.h>\\n\\nconst char* ssid = "MyNetwork";\\nconst char* pass = "secret123";\\n\\nvoid setup() {\\n  Serial.begin(115200);\\n  WiFi.mode(WIFI_STA);\\n  WiFi.begin(ssid, pass);\\n  while (WiFi.status() != WL_CONNECTED) {\\n    delay(500);\\n    Serial.print(".");\\n  }\\n  Serial.println("\\nConnected!");\\n  Serial.println(WiFi.localIP());\\n}\\n\\nvoid loop() {\\n  // Your code here\\n}',codeExplain:'يوصل هذا الكود ESP32 بشبكة WiFi. الوضع WIFI_STA يضبطه كعميل. حلقة while تنتظر الاتصال ثم تطبع عنوان IP. بعدها يمكنك إضافة خوادم HTTP أو MQTT أو مسح BLE.',purpose:'📶 LoRa Lab: ESP32 LoRa sends km range, see chirp spectrum. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',learnAge:'العمر:'}
};

let currentLang = 'en';

/* ═══════ THEME MELODIES ═══════ */
const THEME_MELODIES = {
  'mosque-gold':[330,392,523],zellige:[440,523,659],andalus:[294,370,440],
  space:[523,659,784],jungle:[262,330,392],robot:[440,554,659],
  riad:[349,440,523],medina:[294,349,440],retro:[523,262,523]
};
function playThemeMelody(name){
  if(!soundEnabled)return; if(!audioCtx)audioCtx=new AudioCtx();
  const notes=THEME_MELODIES[name]||THEME_MELODIES['mosque-gold'];
  notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();
    o.connect(g);g.connect(audioCtx.destination);o.frequency.value=f;o.type='sine';
    g.gain.value=0.06;const t=audioCtx.currentTime+i*0.15;
    g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);});
}

/* ═══════ SPLASH ═══════ */
function dismissSplash(){const s=$('splash');if(s)s.style.opacity='0';setTimeout(()=>{if(s)s.style.display='none'},500);}
setTimeout(dismissSplash,3000);

/* ═══════ i18n ENGINE ═══════ */
function setLanguage(lang){
  currentLang=lang;
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const k=el.getAttribute('data-i18n'); if(LANG[lang]&&LANG[lang][k])el.textContent=LANG[lang][k];
  });
  localStorage.setItem('lora-lang',lang);
  log(LANG[lang]?.langChanged||'Language changed','info');
}

/* ═══════ THEME ENGINE ═══════ */
function setTheme(name){
  document.documentElement.setAttribute('data-theme',name);
  if(LIGHT_THEMES.includes(name))document.documentElement.classList.add('light-theme');
  else document.documentElement.classList.remove('light-theme');
  localStorage.setItem('lora-theme',name);
  playThemeMelody(name);
  log((LANG[currentLang]?.themeChanged||'Theme →')+' '+name,'info');
}

/* ═══════ LOG ═══════ */
function log(msg,type='info'){
  const c=$('logContainer'); if(!c)return;
  const line=document.createElement('div');
  line.className='log-line log-'+type;
  const ts=new Date().toLocaleTimeString();
  line.innerHTML=`<span class="log-ts">${ts}</span> <span class="log-badge">${type.toUpperCase()}</span> ${msg}`;
  c.appendChild(line); c.scrollTop=c.scrollHeight;
}

/* ═══════ TOAST ═══════ */
function showToast(msg,ms){
  const t=$('toastIndicator'),m=$('toastMessage');
  if(m)m.textContent=msg; if(t)t.classList.add('show');
  if(ms)setTimeout(hideToast,ms);
}
function hideToast(){const t=$('toastIndicator');if(t)t.classList.remove('show');}

/* ═══════ STATUS ═══════ */
function setStatus(on){
  const d=$('statusDot'),t=$('statusText');
  if(d){d.style.background=on?'#0f0':'#f44';}
  if(t)t.textContent=LANG[currentLang]?.[on?'connected':'disconnected']||'';
}

/* ═══════ PANELS ═══════ */
function openHelp(){$('helpPanel')?.classList.add('open');$('helpOverlay')?.classList.add('show');}
function closeHelp(){$('helpPanel')?.classList.remove('open');$('helpOverlay')?.classList.remove('show');}
function openSettings(){$('settingsPanel')?.classList.add('open');$('settingsOverlay')?.classList.add('show');}
function closeSettings(){$('settingsPanel')?.classList.remove('open');$('settingsOverlay')?.classList.remove('show');}
function openLog(){$('logPanel')?.classList.add('open');}
function closeLog(){$('logPanel')?.classList.remove('open');}
function toggleLog(){$('logPanel')?.classList.toggle('open');}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}

/* ═══════ LORA SIMULATION ═══════ */
const wfCanvas = $('waterfallCanvas');
const wfCtx = wfCanvas ? wfCanvas.getContext('2d') : null;
let wfData = [];
let chirpActive = false;
let chirpPhase = 0;
let animFrame;

function getLoraParams() {
  const sf = parseInt($('sfSelect')?.value || 12);
  const bw = parseInt($('bwSelect')?.value || 125);
  const power = parseInt($('powerSelect')?.value || 20);
  const dataRate = Math.round(sf * (bw * 1000) / Math.pow(2, sf) * 0.8);
  const snrTable = {7:-7.5,8:-10,9:-12.5,10:-15,11:-17.5,12:-20};
  const sensitivity = -174 + 10*Math.log10(bw*1000) + 6 + (snrTable[sf]||-20);
  const linkBudget = power - sensitivity;
  const range = Math.pow(10, (linkBudget - 32.44 - 20*Math.log10(868)) / 20);
  const tSym = Math.pow(2,sf) / (bw*1000) * 1000;
  const nSym = 8 + Math.max(Math.ceil((80-4*sf+28)/(4*sf))*5, 0);
  const airtime = Math.round((12.25+nSym)*tSym);
  return {sf,bw,power,dataRate,sensitivity:Math.round(sensitivity),range:range.toFixed(1),airtime,linkBudget:Math.round(linkBudget)};
}

function updateRangeDisplay(){
  const p=getLoraParams();
  const rv=$('rangeValue'),dr=$('dataRateValue'),at=$('airtimeValue');
  if(rv)rv.textContent=p.range+' km';
  if(dr)dr.textContent=p.dataRate+' bps';
  if(at)at.textContent=p.airtime+' ms';
}

function initWaterfall(){
  if(!wfCtx)return;
  const W=wfCanvas.width,H=wfCanvas.height; wfData=[];
  for(let i=0;i<H;i++){const row=new Float32Array(W);for(let x=0;x<W;x++)row[x]=Math.random()*0.05;wfData.push(row);}
}

function addChirpLine(sf){
  if(!wfCtx)return;
  const W=wfCanvas.width;
  const row=new Float32Array(W);
  for(let x=0;x<W;x++)row[x]=Math.random()*0.08;
  if(chirpActive){
    const cw=W/(sf-5), center=chirpPhase%W;
    for(let i=-cw/2;i<cw/2;i++){
      const idx=Math.floor((center+i+W)%W);
      if(idx>=0&&idx<W){const d=Math.abs(i)/(cw/2);row[idx]=Math.max(row[idx],(1-d*d)*0.9+Math.random()*0.1);}
    }
    chirpPhase+=W/(sf*2);
  }
  wfData.push(row);
  if(wfData.length>wfCanvas.height)wfData.shift();
}

function drawWaterfall(){
  if(!wfCtx)return;
  const W=wfCanvas.width,H=wfCanvas.height;
  const img=wfCtx.createImageData(W,H);
  for(let y=0;y<Math.min(wfData.length,H);y++){
    const row=wfData[y];
    for(let x=0;x<W;x++){
      const v=row[x],idx=(y*W+x)*4;
      if(v<0.25){img.data[idx]=0;img.data[idx+1]=Math.floor(v*4*255);img.data[idx+2]=255;}
      else if(v<0.5){img.data[idx]=0;img.data[idx+1]=255;img.data[idx+2]=Math.floor((1-(v-0.25)*4)*255);}
      else if(v<0.75){img.data[idx]=Math.floor((v-0.5)*4*255);img.data[idx+1]=255;img.data[idx+2]=0;}
      else{img.data[idx]=255;img.data[idx+1]=Math.floor((1-(v-0.75)*4)*255);img.data[idx+2]=0;}
      img.data[idx+3]=255;
    }
  }
  wfCtx.putImageData(img,0,0);
  wfCtx.fillStyle='rgba(255,255,255,0.7)';wfCtx.font='10px Orbitron,monospace';
  wfCtx.fillText('868.0 MHz',5,12);wfCtx.fillText('868.125 MHz',W-80,12);
}

function drawRangeGraph(){
  const canvas=$('rangeCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;
  for(let i=1;i<10;i++){ctx.beginPath();ctx.moveTo(i*W/10,0);ctx.lineTo(i*W/10,H);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i*H/10);ctx.lineTo(W,i*H/10);ctx.stroke();}
  ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='11px Orbitron,monospace';
  ctx.fillText('TX Power (dBm)',W/2-50,H-5);
  ctx.save();ctx.rotate(-Math.PI/2);ctx.fillText('Range (km)',-H/2-30,14);ctx.restore();
  const sfs=[{sf:7,color:'#0f0'},{sf:9,color:'#44f'},{sf:12,color:'#a0f'}];
  const powers=[2,5,8,10,12,14,17,20],maxRange=25;
  sfs.forEach(({sf,color})=>{
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();
    powers.forEach((p,i)=>{
      const snr={7:-7.5,9:-12.5,12:-20};const sens=-174+10*Math.log10(125000)+6+snr[sf];
      const lb=p-sens;const range=Math.pow(10,(lb-32.44-20*Math.log10(868))/20);
      const x=40+(p-2)/18*(W-60),y=H-30-Math.min(range,maxRange)/maxRange*(H-50);
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });ctx.stroke();
    ctx.fillStyle=color;
    powers.forEach(p=>{
      const snr={7:-7.5,9:-12.5,12:-20};const sens=-174+10*Math.log10(125000)+6+snr[sf];
      const lb=p-sens;const range=Math.pow(10,(lb-32.44-20*Math.log10(868))/20);
      const x=40+(p-2)/18*(W-60),y=H-30-Math.min(range,maxRange)/maxRange*(H-50);
      ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();
    });
  });
  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='9px monospace';
  powers.forEach(p=>{const x=40+(p-2)/18*(W-60);ctx.fillText(p+'',x-5,H-18);});
  for(let r=0;r<=maxRange;r+=5){const y=H-30-r/maxRange*(H-50);ctx.fillText(r+'km',2,y+3);}
}

function sendLoraMessage(){
  const msg=$('msgInput')?.value||'HELLO';
  if(!msg.trim())return;
  const p=getLoraParams();
  chirpActive=true;chirpPhase=0;playSound('click');
  log(`TX [SF${p.sf}/${p.bw}kHz/${p.power}dBm] "${msg}" — ${p.airtime}ms airtime`,'tx');
  setStatus(true);showToast(LANG[currentLang]?.msgSent||'Sent',2000);
  const ll=$('loraLog');
  if(ll){
    const ts=new Date().toLocaleTimeString();
    ll.innerHTML+=`<div style="margin-bottom:4px;color:#0f0">📡 ${ts} TX SF${p.sf} BW${p.bw} PWR${p.power} → "${msg}" [${p.airtime}ms]</div>`;
    setTimeout(()=>{
      const rssi=-40-Math.random()*80,snr=10-Math.random()*15;
      ll.innerHTML+=`<div style="margin-bottom:4px;color:#4af">📥 ${new Date().toLocaleTimeString()} RX RSSI:${rssi.toFixed(0)}dBm SNR:${snr.toFixed(1)}dB → "${msg}"</div>`;
      log(`RX "${msg}" RSSI:${rssi.toFixed(0)}dBm SNR:${snr.toFixed(1)}dB`,'rx');
      ll.scrollTop=ll.scrollHeight;
    },p.airtime+500);
  }
  setTimeout(()=>{chirpActive=false;},p.airtime+200);
  $('msgInput').value='';
}

function animate(){addChirpLine(getLoraParams().sf);drawWaterfall();animFrame=requestAnimationFrame(animate);}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  const lw=$('logoWrap'),sl=$('splashLogo');
  if(lw)lw.innerHTML=LOGO_SVG;if(sl)sl.innerHTML=LOGO_SVG;
  const savedLang=localStorage.getItem('lora-lang')||'en';
  const savedTheme=localStorage.getItem('lora-theme')||'mosque-gold';
  if($('langSelect'))$('langSelect').value=savedLang;
  if($('themeSelect'))$('themeSelect').value=savedTheme;
  setLanguage(savedLang);setTheme(savedTheme);

  $('helpBtn')?.addEventListener('click',openHelp);
  $('helpCloseBtn')?.addEventListener('click',closeHelp);
  $('helpOverlay')?.addEventListener('click',closeHelp);
  $('settingsBtn')?.addEventListener('click',openSettings);
  $('settingsCloseBtn')?.addEventListener('click',closeSettings);
  $('settingsOverlay')?.addEventListener('click',closeSettings);
  $('logBtn')?.addEventListener('click',toggleLog);
  $('logCloseBtn')?.addEventListener('click',closeLog);
  $('langSelect')?.addEventListener('change',e=>setLanguage(e.target.value));
  $('themeSelect')?.addEventListener('change',e=>setTheme(e.target.value));
  $('soundToggle')?.addEventListener('change',e=>{soundEnabled=e.target.checked;});
  $('sendBtn')?.addEventListener('click',sendLoraMessage);
  $('msgInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')sendLoraMessage();});
  $('sfSelect')?.addEventListener('change',()=>{updateRangeDisplay();drawRangeGraph();});
  $('bwSelect')?.addEventListener('change',()=>{updateRangeDisplay();drawRangeGraph();});
  $('powerSelect')?.addEventListener('change',()=>{updateRangeDisplay();drawRangeGraph();});

  $('clearLogBtn')?.addEventListener('click',()=>{$('logContainer').innerHTML='';log(LANG[currentLang]?.logCleared||'Cleared','info');});
  $('copyLogBtn')?.addEventListener('click',()=>{
    navigator.clipboard.writeText($('logContainer')?.innerText||'').then(()=>showToast(LANG[currentLang]?.copied||'Copied',1500)).catch(()=>showToast(LANG[currentLang]?.copyFail||'Failed',1500));
  });
  $('exportLogBtn')?.addEventListener('click',()=>{
    const blob=new Blob([$('logContainer')?.innerText||''],{type:'text/plain'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='lora-lab-log.txt';a.click();
  });

  document.querySelectorAll('.log-filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');const f=btn.dataset.filter;
      document.querySelectorAll('.log-line').forEach(l=>{l.style.display=(f==='all'||l.classList.contains('log-'+f))?'':'none';});
    });
  });

  document.querySelectorAll('.help-tab').forEach(tab=>{
    tab.addEventListener('click',()=>{
      document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));
      tab.classList.add('active');
      const tgt=tab.dataset.tab;
      if(tgt==='faq')$('helpFaq')?.classList.add('active');
      if(tgt==='howto')$('helpHowto')?.classList.add('active');
      if(tgt==='wiki')$('helpWiki')?.classList.add('active');
    });
  });

  initWaterfall();updateRangeDisplay();drawRangeGraph();animate();
  setStatus(false);log(LANG[currentLang]?.ready||'Ready','success');

  setInterval(()=>{
    if(!chirpActive&&Math.random()<0.3){chirpActive=true;chirpPhase=Math.random()*(wfCanvas?.width||800);setTimeout(()=>{chirpActive=false;},500+Math.random()*1000);}
  },3000);
});

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — LoRa Lab: Chirp spread spectrum with
   upchirp/downchirp visualization, spreading factor display,
   and long-range signal propagation
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simLoraCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const chirps=[],waveRings=[];let sf=7,bw=125,txCount=0;
  const SFs=[7,8,9,10,11,12];

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:300px;border-radius:12px;margin:1.2rem 0;display:block;background:#080812;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  /* Chirp signal — frequency sweep */
  class Chirp{
    constructor(up){this.up=up;this.x=up?40:W-40;this.progress=0;this.speed=0.005+Math.random()*0.005;this.alive=true;this.sf=sf;this.y=H/2;}
    update(){this.progress+=this.speed;if(this.progress>=1)this.alive=false;return this.alive;}
    draw(){
      const startX=this.up?40:W-40,endX=this.up?W-40:40;
      const px=startX+(endX-startX)*this.progress;
      // Draw chirp waveform
      ctx.beginPath();
      const samples=60;
      for(let i=0;i<=samples;i++){
        const t=i/samples*this.progress;
        const sx=startX+(endX-startX)*t;
        const freq=this.up?(0.5+t*3):(3.5-t*3);
        const amp=20*(1-Math.abs(t-this.progress)*3);
        const sy=this.y+Math.sin(t*freq*30+frameCount*0.1)*Math.max(0,amp);
        if(i===0)ctx.moveTo(sx,sy);else ctx.lineTo(sx,sy);
      }
      ctx.strokeStyle=this.up?'rgba(0,200,255,0.6)':'rgba(255,150,0,0.6)';ctx.lineWidth=2;ctx.stroke();
      // Head dot
      ctx.beginPath();ctx.arc(px,this.y,5,0,Math.PI*2);ctx.fillStyle=this.up?'#0cf':'#f90';ctx.fill();
      ctx.font='7px monospace';ctx.fillStyle=this.up?'#0cf':'#f90';ctx.textAlign='center';
      ctx.fillText(this.up?'UPCHIRP':'DOWNCHIRP',px,this.y-14);
    }
  }

  /* Long range signal ring */
  class WaveRing{
    constructor(x,y){this.x=x;this.y=y;this.r=10;this.maxR=200;this.alpha=0.4;}
    update(){this.r+=0.5;this.alpha=0.4*(1-this.r/this.maxR);return this.r<this.maxR;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.strokeStyle='rgba(0,200,255,'+this.alpha+')';ctx.lineWidth=1;ctx.stroke();}
  }

  /* Frequency-time spectrogram at bottom */
  function drawSpectrogram(){
    const sh=60,sy=H-sh-20;
    ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(0,sy,W,sh);
    ctx.strokeStyle='#fff1';ctx.strokeRect(0,sy,W,sh);
    // Moving chirp pattern
    const sliceW=3;
    for(let x=0;x<W;x+=sliceW){
      const t=(x+frameCount*2)%W/W;
      const freq=t*sh;
      ctx.fillStyle='rgba(0,180,255,'+(0.1+Math.sin(t*Math.PI)*0.2)+')';
      ctx.fillRect(x,sy+sh-freq-2,sliceW,3);
      // Mirror downchirp
      ctx.fillStyle='rgba(255,150,0,'+(0.05+Math.cos(t*Math.PI)*0.1)+')';
      ctx.fillRect(x,sy+freq,sliceW,3);
    }
    ctx.font='7px monospace';ctx.fillStyle='#666';ctx.textAlign='left';ctx.fillText('Freq',4,sy+10);ctx.fillText('Time \u2192',W-40,sy+sh-4);
  }

  /* Gateway and end-device */
  function drawDevices(){
    // End device (left)
    ctx.save();ctx.shadowColor='#0cf';ctx.shadowBlur=6;
    ctx.beginPath();ctx.arc(40,H/2,16,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.15)';ctx.fill();ctx.strokeStyle='#0cf';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u{1F4E1}',40,H/2);
    ctx.font='7px monospace';ctx.fillStyle='#0cf';ctx.fillText('End Device',40,H/2+24);ctx.restore();
    // Gateway (right)
    ctx.save();ctx.shadowColor='#6bcb77';ctx.shadowBlur=6;
    ctx.beginPath();ctx.arc(W-40,H/2,16,0,Math.PI*2);ctx.fillStyle='rgba(107,203,119,0.15)';ctx.fill();ctx.strokeStyle='#6bcb77';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u{1F3F0}',W-40,H/2);
    ctx.font='7px monospace';ctx.fillStyle='#6bcb77';ctx.fillText('Gateway',W-40,H/2+24);ctx.restore();
  }

  function drawSFIndicator(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(W/2-50,8,100,30);ctx.strokeStyle='#0cf3';ctx.strokeRect(W/2-50,8,100,30);
    ctx.font='10px monospace';ctx.fillStyle='#0cf';ctx.textAlign='center';ctx.fillText('SF'+sf+' BW'+bw+'kHz',W/2,28);ctx.restore();
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,175,56);ctx.strokeStyle='#0cf3';ctx.strokeRect(8,8,175,56);
    ctx.font='10px monospace';ctx.fillStyle='#0cf';ctx.textAlign='left';ctx.fillText('LORA LAB',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('SF: '+sf+'  BW: '+bw+'kHz',16,40);ctx.fillText('Transmissions: '+txCount,16,54);ctx.restore();
  }

  function init(){ensureCanvas();animate();}
  function animate(){
    frameCount++;ctx.fillStyle='rgba(8,8,18,0.14)';ctx.fillRect(0,0,W,H);
    // Cycle SF
    if(frameCount%300===0){sf=SFs[Math.floor(Math.random()*SFs.length)];bw=[125,250,500][Math.floor(Math.random()*3)];}
    // Spawn chirps
    if(frameCount%80===0){chirps.push(new Chirp(true));waveRings.push(new WaveRing(40,H/2));txCount++;}
    if(frameCount%120===0){chirps.push(new Chirp(false));waveRings.push(new WaveRing(W-40,H/2));}
    for(let i=waveRings.length-1;i>=0;i--){if(!waveRings[i].update())waveRings.splice(i,1);else waveRings[i].draw();}
    drawDevices();
    for(let i=chirps.length-1;i>=0;i--){if(!chirps[i].update())chirps.splice(i,1);else chirps[i].draw();}
    drawSpectrogram();drawSFIndicator();drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,300);
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
