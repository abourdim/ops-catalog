/**
 * MITM Simulator — Play as Eve
 * Workshop DIY — Net Browser Collection
 * Intercept messages between Alice and Bob
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.139885 78.322945 253.991455 136.254120"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752C203.799835,145.619583,204.629318,145.619736,205.933762,145.784378C212.620331,146.628281,217.423569,150.723984,219.325882,157.203781C219.72139,158.550934,219.771454,162.692093,219.406631,163.88208C218.187943,167.857361,216.579514,170.301239,213.792847,172.411835C209.455261,175.697083,203.83429,176.563141,198.809494,174.720413C197.244873,174.146637,196.144424,173.544434,194.478638,172.350433C191.905991,170.506454,190.53334,169.740753,188.031555,168.754135L187.293335,168.462997L187.308884,160.785461C187.317429,156.56282,187.36911,153.000763,187.423706,152.869797z"/><path style="stroke:none;fill:currentColor" d="M259.791718,157.665863L264.87912,148.034195L272.338226,148.034195L263.03244,163.730896L263.03244,174.991974L256.261322,174.991974L256.261322,164.07489L246.792618,148.034195L254.505173,148.034195z"/><path style="stroke:none;fill:currentColor" d="M240.369812,152.741394L236.495438,152.741394L236.495438,170.284775L240.369812,170.284775L240.369812,174.991974L225.849915,174.991974L225.849915,170.284775L229.724304,170.284775L229.724304,152.741394L225.849915,152.741394L225.849915,148.034195L240.369812,148.034195z"/></svg>`;
const FOOTER_ICON='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}

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

const LANG={
en:{
    ...LANG_BASE.en,title:'MITM Simulator',subtitle:'\uD83D\uDD75\uFE0F Intercept messages between Alice and Bob',
disconnected:'Disconnected',connected:'Connected',
mainSection:'Play as Eve',mainDesc:'Intercept messages between Alice and Bob',
sectionA:'How MITM Attacks Work',sectionB:'Famous MITM Scenarios',sectionC:'Defense Strategies',
activityLog:'Activity Log',eventsMsg:'Events & messages',
clear:'Clear',copy:'Copy',theme:'Theme',settings:'\u2699\uFE0F Settings',language:'Language',
help:'\u2753 Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
howto_1:'Type a message and click Send.',howto_2:'Toggle Eve Intercept to let Eve read messages.',
howto_3:'Toggle Encryption to block Eve from reading.',howto_4:'Open Section C for defense strategies.',
wiki_themes_title:'\uD83C\uDFA8 Themes',wiki_themes:'8 built-in themes.',wiki_i18n_title:'\uD83C\uDF10 Languages',wiki_i18n:'Trilingual: EN, FR, AR with RTL.',
wiki_log_title:'\uD83D\uDCDC Activity Log',wiki_log:'Timestamped, color-coded log.',wiki_privacy_title:'\uD83D\uDD12 Privacy',wiki_privacy:'Local-first. All data stays in your browser.',
working:'Working\u2026',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
ready:'\uD83D\uDD75\uFE0F MITM Simulator ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
export:'Export',filterAll:'All',soundEffects:'\uD83D\uDD0A Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
splashHint:'tap to skip',langChanged:'\uD83C\uDF10 Language \u2192 English',themeChanged:'\uD83C\uDFA8 Theme \u2192',
msgPlaceholder:'Type a message...',sendBtn:'Send',eveIntercept:'\uD83D\uDD75\uFE0F Eve Intercept',encryption:'\uD83D\uDD12 Encryption (TLS)',autoDemo:'Auto Demo',
msgLogTitle:'Message History',
mitmExplain:'In a Man-in-the-Middle (MITM) attack, Eve secretly relays and possibly alters communications between Alice and Bob. Without encryption, Eve can read everything in plaintext. With TLS/SSL encryption, Eve sees only scrambled ciphertext.',
scenariosText:'Public Wi-Fi hotspots are a common MITM attack vector. ARP spoofing redirects traffic through the attacker. DNS spoofing sends victims to fake websites. SSL stripping downgrades HTTPS to HTTP.',
defenseText:'Learn how to defend against MITM attacks with HTTPS, certificate pinning, HSTS, and mutual TLS.',
showDefenseBtn:'Show Defense Guide',
sending:'Sending message...',aliceSays:'Alice',bobSays:'Bob',eveSays:'Eve',
eveReads:'Eve reads plaintext!',eveBlocked:'Eve sees only ciphertext',eveOff:'Eve is not intercepting',
msgDelivered:'Message delivered to Bob',encrypted:'ENCRYPTED',plaintext:'PLAINTEXT',
defense_https:'HTTPS: Encrypts all traffic between browser and server.',
defense_hsts:'HSTS: Forces browsers to always use HTTPS.',
defense_pin:'Certificate Pinning: Prevents fake certificates.',
defense_mtls:'Mutual TLS: Both sides verify each other.',
defense_vpn:'VPN: Encrypts all traffic through a tunnel.',step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code',faq_q1:'What is MITM Simulator?',faq_a1:'MITM Simulator lets you intercept messages between alice and bob. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you the network is scanned to discover active devices and services. Then you network packets are intercepted and captured for analysis.',faq_q3:'What do the controls do?',faq_a3:'Type a message and click Send. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'8 \u0645\u0638\u0627\u0647\u0631.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Browser only. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Web Bgp Simulator and Web Blockchain Messenger. Each app in this category teaches a different aspect of networking.',demo_s1:'Welcome to MITM Simulator! Look at the main display — this is where the networking simulation runs.',demo_s2:'Type a message and click Send. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How MITM Attacks Work" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of networking.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Network Protocols',learn1Desc:'How computers talk to each other using rules called protocols',learn1Tag:'Networking',learn2Title:'Packet Analysis',learn2Desc:'How data is split into tiny packets that travel across the internet',learn2Tag:'Data',learn3Title:'Network Scanning',learn3Desc:'How to discover devices and services on a network',learn3Tag:'Discovery',learn4Title:'Network Security',learn4Desc:'How to spot and stop network attacks',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Beginner 🟢',learnLevel:'Level:',learnTimeVal:'15 min ⏱',learnTime:'Time:',learnAgeVal:'10+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how networking works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches networking concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How MITM Attacks Work" and "Famous MITM Scenarios" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
fr:{title:'MITM Simulateur',subtitle:'\uD83D\uDD75\uFE0F Interceptez les messages entre Alice et Bob',
disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',
mainSection:'Jouez Eve',mainDesc:'Interceptez les messages entre Alice et Bob',
sectionA:'Comment fonctionnent les attaques MITM',sectionB:'Sc\u00e9narios MITM c\u00e9l\u00e8bres',sectionC:'Strat\u00e9gies de d\u00e9fense',
activityLog:'Journal',eventsMsg:'\u00c9v\u00e9nements',
clear:'Effacer',copy:'Copier',theme:'Th\u00e8me',settings:'\u2699\uFE0F Param\u00e8tres',language:'Langue',
help:'\u2753 Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
howto_1:'Tapez un message et cliquez Envoyer.',howto_2:'Activez Interception Eve pour lire les messages.',
howto_3:'Activez Chiffrement pour bloquer Eve.',howto_4:'Ouvrez Section C pour les d\u00e9fenses.',
wiki_themes_title:'\uD83C\uDFA8 Th\u00e8mes',wiki_themes:'8 th\u00e8mes.',wiki_i18n_title:'\uD83C\uDF10 Langues',wiki_i18n:'Trilingue.',
wiki_log_title:'\uD83D\uDCDC Journal',wiki_log:'Journal horodat\u00e9.',wiki_privacy_title:'\uD83D\uDD12 Confidentialit\u00e9',wiki_privacy:'Local-first.',
working:'En cours\u2026',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
ready:'\uD83D\uDD75\uFE0F MITM Simulateur pr\u00eat !',logCleared:'Effac\u00e9',copied:'Copi\u00e9 !',copyFail:'\u00c9chec',
export:'Exporter',filterAll:'Tout',soundEffects:'\uD83D\uDD0A Sons',whisperMode:'Murmure',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',
splashHint:'appuyer pour passer',langChanged:'\uD83C\uDF10 Langue \u2192 Fran\u00e7ais',themeChanged:'\uD83C\uDFA8 Th\u00e8me \u2192',
msgPlaceholder:'Tapez un message...',sendBtn:'Envoyer',eveIntercept:'\uD83D\uDD75\uFE0F Interception Eve',encryption:'\uD83D\uDD12 Chiffrement (TLS)',autoDemo:'D\u00e9mo auto',
msgLogTitle:'Historique des messages',
mitmExplain:'Dans une attaque MITM, Eve relaie secr\u00e8tement les communications entre Alice et Bob. Sans chiffrement, Eve lit tout en clair. Avec TLS, Eve ne voit que du texte chiffr\u00e9.',
scenariosText:'Les hotspots Wi-Fi publics sont un vecteur courant. L\'ARP spoofing redirige le trafic. Le DNS spoofing envoie vers de faux sites.',
defenseText:'D\u00e9fendez-vous avec HTTPS, le certificate pinning, HSTS et le TLS mutuel.',
showDefenseBtn:'Afficher le guide',
sending:'Envoi du message...',aliceSays:'Alice',bobSays:'Bob',eveSays:'Eve',
eveReads:'Eve lit le texte clair !',eveBlocked:'Eve ne voit que du chiffr\u00e9',eveOff:'Eve n\'intercepte pas',
msgDelivered:'Message d\u00e9livr\u00e9 \u00e0 Bob',encrypted:'CHIFFR\u00c9',plaintext:'TEXTE CLAIR',
defense_https:'HTTPS : Chiffre tout le trafic.',
defense_hsts:'HSTS : Force le navigateur \u00e0 utiliser HTTPS.',
defense_pin:'Certificate Pinning : Emp\u00eache les faux certificats.',
defense_mtls:'TLS Mutuel : V\u00e9rification des deux c\u00f4t\u00e9s.',
defense_vpn:'VPN : Chiffre tout le trafic via un tunnel.',step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle te permet de voir comment les réseaux communiquent ! 🌐 Comme une vision aux rayons X du trafic internet.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation montre de vrais protocoles réseau — les règles que les ordinateurs suivent pour envoyer des données.',faq_q3:'Que dois-je essayer ?',faq_a3:'Lance un scan et regarde les paquets voler ! 📡 Chaque paquet coloré est un type de message différent.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est comme ça que tout internet fonctionne ! TCP/IP, DNS, ARP — ces protocoles alimentent chaque site. 🌍',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Vois ce qui se passe quand tu injectes de mauvais paquets. C\'est la sécurité réseau ! 🛡️',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Totalement sûr ! 🛡️ C\'est une simulation — pas de vrai trafic réseau.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Web Blockchain Messenger and Web Botnet Defense ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Protocoles réseau',learn1Desc:'Comment les ordinateurs communiquent avec des protocoles',learn1Tag:'Réseau',learn2Title:'Analyse de paquets',learn2Desc:'Comment les données sont découpées en paquets',learn2Tag:'Données',learn3Title:'Scan réseau',learn3Desc:'Comment découvrir les appareils sur un réseau',learn3Tag:'Découverte',learn4Title:'Sécurité réseau',learn4Desc:'Comment détecter et stopper les attaques réseau',learn4Tag:'Sécurité',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Débutant 🟢',learnLevel:'Niveau :',learnTimeVal:'15 min ⏱',learnTime:'Durée :',learnAgeVal:'10+ 🧒',learnAge:'Âge :'},
ar:{title:'\u0645\u062D\u0627\u0643\u064A MITM',subtitle:'\uD83D\uDD75\uFE0F \u0627\u0639\u062A\u0631\u0636 \u0631\u0633\u0627\u0626\u0644 \u0623\u0644\u064A\u0633 \u0648\u0628\u0648\u0628',
disconnected:'\u063A\u064A\u0631 \u0645\u062A\u0635\u0644',connected:'\u0645\u062A\u0635\u0644',
mainSection:'\u0627\u0644\u0639\u0628 \u0643\u0625\u064A\u0641',mainDesc:'\u0627\u0639\u062A\u0631\u0636 \u0627\u0644\u0631\u0633\u0627\u0626\u0644 \u0628\u064A\u0646 \u0623\u0644\u064A\u0633 \u0648\u0628\u0648\u0628',
sectionA:'\u0643\u064A\u0641 \u062A\u0639\u0645\u0644 \u0647\u062C\u0645\u0627\u062A MITM',sectionB:'\u0633\u064A\u0646\u0627\u0631\u064A\u0648\u0647\u0627\u062A MITM \u0627\u0644\u0634\u0647\u064A\u0631\u0629',sectionC:'\u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A\u0627\u062A \u0627\u0644\u062F\u0641\u0627\u0639',
activityLog:'\u0633\u062C\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062D\u062F\u0627\u062B',
clear:'\u0645\u0633\u062D',copy:'\u0646\u0633\u062E',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u2699\uFE0F \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A',language:'\u0627\u0644\u0644\u063A\u0629',
help:'\u2753 \u0645\u0633\u0627\u0639\u062F\u0629',faq:'\u0623\u0633\u0626\u0644\u0629 \u0634\u0627\u0626\u0639\u0629',howto:'\u0643\u064A\u0641 \u062A\u0633\u062A\u062E\u062F\u0645',wiki:'\u0648\u064A\u0643\u064A',
howto_1:'\u0627\u0643\u062A\u0628 \u0631\u0633\u0627\u0644\u0629 \u0648\u0627\u0646\u0642\u0631 \u0625\u0631\u0633\u0627\u0644.',howto_2:'\u0641\u0639\u0651\u0644 \u0627\u0639\u062A\u0631\u0627\u0636 \u0625\u064A\u0641 \u0644\u0642\u0631\u0627\u0621\u0629 \u0627\u0644\u0631\u0633\u0627\u0626\u0644.',
howto_3:'\u0641\u0639\u0651\u0644 \u0627\u0644\u062A\u0634\u0641\u064A\u0631 \u0644\u0645\u0646\u0639 \u0625\u064A\u0641.',howto_4:'\u0627\u0641\u062A\u062D \u0627\u0644\u0642\u0633\u0645 C \u0644\u0627\u0633\u062A\u0631\u0627\u062A\u064A\u062C\u064A\u0627\u062A \u0627\u0644\u062F\u0641\u0627\u0639.',
wiki_themes_title:'\uD83C\uDFA8 \u0627\u0644\u0645\u0638\u0627\u0647\u0631',wiki_themes:'8 \u0645\u0638\u0627\u0647\u0631.',wiki_i18n_title:'\uD83C\uDF10 \u0627\u0644\u0644\u063A\u0627\u062A',wiki_i18n:'\u062B\u0644\u0627\u062B\u064A \u0627\u0644\u0644\u063A\u0627\u062A.',
wiki_log_title:'\uD83D\uDCDC \u0633\u062C\u0644',wiki_log:'\u0633\u062C\u0644 \u0645\u0624\u0631\u0651\u062E.',wiki_privacy_title:'\uD83D\uDD12 \u0627\u0644\u062E\u0635\u0648\u0635\u064A\u0629',wiki_privacy:'\u0645\u062D\u0644\u064A \u0623\u0648\u0644\u0627\u064B.',
working:'\u062C\u0627\u0631\u064D\u2026',t_mosque:'\u0645\u0633\u062C\u062F',t_zellige:'\u0632\u0644\u064A\u062C',t_andalus:'\u0623\u0646\u062F\u0644\u0633',t_riad:'\u0631\u064A\u0627\u0636',t_medina:'\u0645\u062F\u064A\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062F\u063A\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062A',
ready:'\uD83D\uDD75\uFE0F \u0645\u062D\u0627\u0643\u064A MITM \u062C\u0627\u0647\u0632!',logCleared:'\u062A\u0645 \u0627\u0644\u0645\u0633\u062D',copied:'\u062A\u0645 \u0627\u0644\u0646\u0633\u062E!',copyFail:'\u0641\u0634\u0644',
export:'\u062A\u0635\u062F\u064A\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\uD83D\uDD0A \u0623\u0635\u0648\u0627\u062A',whisperMode:'\u0647\u0645\u0633',breathingGuide:'\u062A\u0646\u0641\u0633',dhikrTap:'\u0627\u0636\u063A\u0637',musicMode:'\u0645\u0648\u0633\u064A\u0642\u0649',
splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u062E\u0637\u064A',langChanged:'\uD83C\uDF10 \u0627\u0644\u0644\u063A\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064A\u0629',themeChanged:'\uD83C\uDFA8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
msgPlaceholder:'\u0627\u0643\u062A\u0628 \u0631\u0633\u0627\u0644\u0629...',sendBtn:'\u0625\u0631\u0633\u0627\u0644',eveIntercept:'\uD83D\uDD75\uFE0F \u0627\u0639\u062A\u0631\u0627\u0636 \u0625\u064A\u0641',encryption:'\uD83D\uDD12 \u062A\u0634\u0641\u064A\u0631 (TLS)',autoDemo:'\u0639\u0631\u0636 \u062A\u0644\u0642\u0627\u0626\u064A',
msgLogTitle:'\u0633\u062C\u0644 \u0627\u0644\u0631\u0633\u0627\u0626\u0644',
mitmExplain:'\u0641\u064A \u0647\u062C\u0648\u0645 MITM\u060C \u062A\u0639\u062A\u0631\u0636 \u0625\u064A\u0641 \u0633\u0631\u0627\u064B \u0627\u0644\u0627\u062A\u0635\u0627\u0644\u0627\u062A \u0628\u064A\u0646 \u0623\u0644\u064A\u0633 \u0648\u0628\u0648\u0628. \u0628\u062F\u0648\u0646 \u062A\u0634\u0641\u064A\u0631\u060C \u062A\u0642\u0631\u0623 \u0625\u064A\u0641 \u0643\u0644 \u0634\u064A\u0621. \u0645\u0639 TLS\u060C \u062A\u0631\u0649 \u0641\u0642\u0637 \u0646\u0635\u0627\u064B \u0645\u0634\u0641\u0631\u0627\u064B.',
scenariosText:'\u0634\u0628\u0643\u0627\u062A Wi-Fi \u0627\u0644\u0639\u0627\u0645\u0629 \u0647\u064A \u0646\u0642\u0637\u0629 \u0647\u062C\u0648\u0645 \u0634\u0627\u0626\u0639\u0629. ARP spoofing \u064A\u0639\u064A\u062F \u062A\u0648\u062C\u064A\u0647 \u0627\u0644\u062D\u0631\u0643\u0629. DNS spoofing \u064A\u0631\u0633\u0644 \u0644\u0645\u0648\u0627\u0642\u0639 \u0645\u0632\u064A\u0641\u0629.',
defenseText:'\u062A\u0639\u0644\u0645 \u0627\u0644\u062F\u0641\u0627\u0639 \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645 HTTPS \u0648certificate pinning \u0648HSTS.',
showDefenseBtn:'\u0639\u0631\u0636 \u062F\u0644\u064A\u0644 \u0627\u0644\u062F\u0641\u0627\u0639',
sending:'\u062C\u0627\u0631\u064D \u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0631\u0633\u0627\u0644\u0629...',aliceSays:'\u0623\u0644\u064A\u0633',bobSays:'\u0628\u0648\u0628',eveSays:'\u0625\u064A\u0641',
eveReads:'\u0625\u064A\u0641 \u062A\u0642\u0631\u0623 \u0627\u0644\u0646\u0635 \u0627\u0644\u0648\u0627\u0636\u062D!',eveBlocked:'\u0625\u064A\u0641 \u062A\u0631\u0649 \u0641\u0642\u0637 \u0646\u0635\u0627\u064B \u0645\u0634\u0641\u0631\u0627\u064B',eveOff:'\u0625\u064A\u0641 \u0644\u0627 \u062A\u0639\u062A\u0631\u0636',
msgDelivered:'\u062A\u0645 \u062A\u0633\u0644\u064A\u0645 \u0627\u0644\u0631\u0633\u0627\u0644\u0629 \u0644\u0628\u0648\u0628',encrypted:'\u0645\u0634\u0641\u0631',plaintext:'\u0646\u0635 \u0648\u0627\u0636\u062D',
defense_https:'HTTPS: \u064A\u0634\u0641\u0631 \u0643\u0644 \u062D\u0631\u0643\u0629 \u0627\u0644\u0645\u0631\u0648\u0631.',
defense_hsts:'HSTS: \u064A\u062C\u0628\u0631 \u0627\u0644\u0645\u062A\u0635\u0641\u062D \u0639\u0644\u0649 HTTPS.',
defense_pin:'Certificate Pinning: \u064A\u0645\u0646\u0639 \u0627\u0644\u0634\u0647\u0627\u062F\u0627\u062A \u0627\u0644\u0645\u0632\u064A\u0641\u0629.',
defense_mtls:'TLS \u0645\u062A\u0628\u0627\u062F\u0644: \u0627\u0644\u0637\u0631\u0641\u0627\u0646 \u064A\u062A\u062D\u0642\u0642\u0627\u0646.',
defense_vpn:'VPN: \u064A\u0634\u0641\u0631 \u0643\u0644 \u0627\u0644\u062D\u0631\u0643\u0629 \u0639\u0628\u0631 \u0646\u0641\u0642.',step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يتيح لك رؤية كيف تتحدث الشبكات! 🌐 مثل رؤية بالأشعة السينية لحركة الإنترنت.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعرض بروتوكولات شبكة حقيقية — القواعد التي تتبعها الحواسيب لإرسال البيانات.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'ابدأ مسحاً وشاهد الحزم تطير! 📡 كل حزمة ملونة هي نوع مختلف من الرسائل.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هكذا يعمل الإنترنت بأكمله! TCP/IP و DNS و ARP — هذه البروتوكولات تشغل كل موقع. 🌍',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! شاهد ما يحدث عند حقن حزم سيئة. هذا هو أمن الشبكات! 🛡️',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ هذه محاكاة — لا حركة شبكة حقيقية.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Web Blockchain Messenger and Web Botnet Defense! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'بروتوكولات الشبكة',learn1Desc:'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات',learn1Tag:'شبكات',learn2Title:'تحليل الحزم',learn2Desc:'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت',learn2Tag:'بيانات',learn3Title:'مسح الشبكة',learn3Desc:'كيف تكتشف الأجهزة والخدمات على الشبكة',learn3Tag:'اكتشاف',learn4Title:'أمن الشبكات',learn4Desc:'كيف تكتشف وتوقف هجمات الشبكة',learn4Tag:'أمان',sectionLearn:'ماذا ستتعلم',learnLevelVal:'مبتدئ 🟢',learnLevel:'المستوى:',learnTimeVal:'15 min ⏱',learnTime:'المدة:',learnAgeVal:'10+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>{const k=el.dataset.i18nPlaceholder;if(s[k]!=null)el.placeholder=s[k];});document.title=`${s.title} \u2014 Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;const s=LANG[currentLang];try{localStorage.setItem('wdiy-theme',n);}catch{}playThemeMelody(n);log(`${s.themeChanged} ${s['t_'+n]||n}`,'info');}
let logContainer,typewriterEnabled=true;
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;const ft=`[${new Date().toLocaleTimeString()}] ${m}`;if(typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,ft);}else{d.textContent=ft;logContainer.appendChild(d);}logContainer.scrollTop=logContainer.scrollHeight;if(t==='success'){playSound('success');pulseBismillah('success');setPetState('happy');}else if(t==='error'){playSound('error');pulseBismillah('error');setPetState('sad');}logHistory.push({m,t,ts:Date.now()});applyLogFilter();resetPetSleep();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='mitm-log.txt';a.click();URL.revokeObjectURL(u);}
let toastTimer=null;function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(12+Math.random()*18);}el.classList.remove('typing');}
const logHistory=[];
function pulseBismillah(t){const b=document.querySelector('.bismillah');if(!b)return;b.classList.remove('pulse-success','pulse-error');void b.offsetWidth;b.classList.add(t==='error'?'pulse-error':'pulse-success');setTimeout(()=>b.classList.remove('pulse-success','pulse-error'),700);}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx&&!(audioCtx=new AudioCtx()))return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'||l.classList.contains(activeLogFilter)?'':'none';});}
const PET_STATES={idle:{class:'pet-idle',duration:0},happy:{class:'pet-happy',duration:3000},sad:{class:'pet-sad',duration:3000},sleep:{class:'pet-sleep',duration:0}};
let petState='idle',petIdleTimer=null,petSleepTimer=null;
function initPixelPet(){const p=document.createElement('div');p.id='pixelPet';p.className='pixel-pet pet-idle';p.innerHTML=`<img src="${FOOTER_ICON}" alt="Bot"/>`;p.addEventListener('click',()=>{setPetState('happy');playSound('success');});const f=document.querySelector('.app-footer');if(f)f.insertBefore(p,f.firstChild);}
function setPetState(s){petState=s;const p=$('pixelPet');if(!p)return;p.classList.remove('pet-idle','pet-happy','pet-sad','pet-sleep');p.classList.add(PET_STATES[s].class);if(petIdleTimer)clearTimeout(petIdleTimer);if(PET_STATES[s].duration>0)petIdleTimer=setTimeout(()=>setPetState('idle'),PET_STATES[s].duration);}
function resetPetSleep(){if(petSleepTimer)clearTimeout(petSleepTimer);if(petState==='sleep')setPetState('idle');petSleepTimer=setTimeout(()=>setPetState('sleep'),60000);}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
let breathingActive=false,dhikrCount=0;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));log(breathingActive?'\uD83E\uDEC1 On':'\uD83E\uDEC1 Off','info');if(!breathingActive&&dhikrCount>0){log(`\uD83D\uDCFF ${dhikrCount}`,'success');dhikrCount=0;}}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
let recognition=null,whisperActive=false;
function toggleWhisper(){if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){log('\uD83C\uDFA4 Not supported','error');return;}if(whisperActive){if(recognition)recognition.stop();whisperActive=false;log('\uD83C\uDFA4 Off','info');return;}const SR=window.SpeechRecognition||window.webkitSpeechRecognition;recognition=new SR();recognition.continuous=true;recognition.interimResults=false;recognition.lang=currentLang==='ar'?'ar-DZ':currentLang==='fr'?'fr-FR':'en-US';recognition.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal){const t=e.results[i][0].transcript.trim();if(t)log(`\uD83C\uDFA4 ${t}`,'rx');}};recognition.onerror=e=>log(`\uD83C\uDFA4 ${e.error}`,'error');recognition.onend=()=>{if(whisperActive)recognition.start();};recognition.start();whisperActive=true;log('\uD83C\uDFA4 On','success');}
function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open');}
function closePanel(p,o,r){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const t=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(t)t.classList.add('active');});});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{d=false;});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('\uD83D\uDD79\uFE0F KONAMI!','success');}}else konamiIdx=0;});}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='\u0628\u0633\u0645\u0627\u0644\u0631\u062D\u0646\u064A\u0648\u0643\u0644\u062A\u0639\u062F\u0641\u0642\u062B\u0635\u0636\u0637\u0638\u063A';
function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return;}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=window.innerWidth;c.height=window.innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);(function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);})();}
function initMatrixTrigger(){const l=$('logoWrap');if(!l)return;l.style.cursor='pointer';let cc=0,ct=null;l.addEventListener('click',()=>{cc++;if(ct)clearTimeout(ct);if(cc>=3){cc=0;toggleMatrix();}else ct=setTimeout(()=>cc=0,500);});}

/* ══════════════════════════════════════════════════════════════
   MITM SIMULATOR ENGINE
   ══════════════════════════════════════════════════════════════ */

const ACTORS={
  alice:{label:'Alice',icon:'\uD83D\uDC69',color:'#22c55e',x:80,y:150},
  eve:  {label:'Eve',  icon:'\uD83D\uDD75\uFE0F',color:'#ef4444',x:350,y:60},
  bob:  {label:'Bob',  icon:'\uD83D\uDC68',color:'#3b82f6',x:620,y:150}
};

let sending=false,msgHistory=[];

function fakeEncrypt(msg){
  let enc='';
  for(let i=0;i<msg.length;i++){
    enc+=String.fromCharCode(((msg.charCodeAt(i)+7+i*3)%94)+33);
  }
  return enc;
}

function drawScene(ctx,w,h,opts){
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='#0a1628';ctx.fillRect(0,0,w,h);

  const eveActive=opts.eveActive;
  const encrypted=opts.encrypted;

  // Draw connection lines
  ctx.setLineDash([]);
  // Alice -> (Eve or Bob)
  if(eveActive){
    // Alice -> Eve
    ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(ACTORS.alice.x,ACTORS.alice.y);ctx.lineTo(ACTORS.eve.x,ACTORS.eve.y);ctx.stroke();
    // Eve -> Bob
    ctx.beginPath();ctx.moveTo(ACTORS.eve.x,ACTORS.eve.y);ctx.lineTo(ACTORS.bob.x,ACTORS.bob.y);ctx.stroke();
  } else {
    // Alice -> Bob direct
    ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(ACTORS.alice.x,ACTORS.alice.y);ctx.lineTo(ACTORS.bob.x,ACTORS.bob.y);ctx.stroke();
  }

  // Encrypted tunnel indicator
  if(encrypted){
    ctx.strokeStyle='rgba(59,130,246,0.25)';ctx.lineWidth=1;ctx.setLineDash([5,5]);
    if(eveActive){
      ctx.beginPath();ctx.moveTo(ACTORS.alice.x+30,ACTORS.alice.y-20);ctx.lineTo(ACTORS.eve.x,ACTORS.eve.y-20);ctx.lineTo(ACTORS.bob.x-30,ACTORS.bob.y-20);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ACTORS.alice.x+30,ACTORS.alice.y+20);ctx.lineTo(ACTORS.eve.x,ACTORS.eve.y+50);ctx.lineTo(ACTORS.bob.x-30,ACTORS.bob.y+20);ctx.stroke();
    } else {
      ctx.beginPath();ctx.moveTo(ACTORS.alice.x+30,ACTORS.alice.y-20);ctx.lineTo(ACTORS.bob.x-30,ACTORS.bob.y-20);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ACTORS.alice.x+30,ACTORS.alice.y+20);ctx.lineTo(ACTORS.bob.x-30,ACTORS.bob.y+20);ctx.stroke();
    }
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(59,130,246,0.4)';ctx.font='10px monospace';ctx.textAlign='center';
    ctx.fillText('TLS ENCRYPTED',w/2,ACTORS.alice.y+45);
  }

  // Draw actors
  Object.values(ACTORS).forEach(a=>{
    if(a===ACTORS.eve&&!eveActive){
      // Draw Eve grayed out
      ctx.globalAlpha=0.3;
    }
    ctx.beginPath();ctx.arc(a.x,a.y,28,0,Math.PI*2);
    ctx.fillStyle=a.color+'22';ctx.fill();
    ctx.strokeStyle=a.color;ctx.lineWidth=2;ctx.stroke();
    ctx.font='22px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle='#fff';ctx.fillText(a.icon,a.x,a.y);
    ctx.font='11px Tajawal,sans-serif';ctx.fillStyle=a.color;
    ctx.fillText(a.label,a.x,a.y+40);
    ctx.globalAlpha=1;
  });

  // Draw packet if animating
  if(opts.packetX!=null&&opts.packetY!=null){
    ctx.beginPath();ctx.arc(opts.packetX,opts.packetY,8,0,Math.PI*2);
    ctx.fillStyle=encrypted?'#3b82f6':'#f59e0b';ctx.globalAlpha=0.8;ctx.fill();ctx.globalAlpha=1;
    ctx.beginPath();ctx.arc(opts.packetX,opts.packetY,4,0,Math.PI*2);
    ctx.fillStyle='#fff';ctx.fill();
    if(opts.packetLabel){
      ctx.font='9px monospace';ctx.fillStyle='rgba(255,255,255,0.7)';ctx.textAlign='center';
      const dl=opts.packetLabel.length>18?opts.packetLabel.substring(0,18)+'...':opts.packetLabel;
      ctx.fillText(dl,opts.packetX,opts.packetY-14);
    }
  }

  // Eve's intercepted data
  if(opts.eveData){
    ctx.font='9px monospace';ctx.textAlign='center';
    ctx.fillStyle=encrypted?'rgba(59,130,246,0.7)':'rgba(239,68,68,0.9)';
    const ed=opts.eveData.length>22?opts.eveData.substring(0,22)+'...':opts.eveData;
    ctx.fillText(ed,ACTORS.eve.x,ACTORS.eve.y+58);
    if(!encrypted){
      ctx.fillStyle='rgba(239,68,68,0.6)';ctx.font='8px sans-serif';
      ctx.fillText('\uD83D\uDC41\uFE0F READING',ACTORS.eve.x,ACTORS.eve.y+70);
    } else {
      ctx.fillStyle='rgba(59,130,246,0.6)';ctx.font='8px sans-serif';
      ctx.fillText('\uD83D\uDD12 BLOCKED',ACTORS.eve.x,ACTORS.eve.y+70);
    }
  }

  ctx.textAlign='start';
}

function lerp(a,b,t){return a+(b-a)*t;}

async function sendMessage(){
  if(sending)return;
  const s=LANG[currentLang];
  const msg=$('msgInput').value.trim();
  if(!msg)return;
  const eveActive=$('eveToggle').checked;
  const encrypted=$('encryptToggle').checked;
  sending=true;setStatus(true);showToast(s.sending);
  log(`\uD83D\uDCE8 ${s.aliceSays} \u2192 ${s.bobSays}: "${msg}" ${encrypted?'[\uD83D\uDD12]':'[\u26A0\uFE0F]'}`,'tx');

  const canvas=$('mitmCanvas');const ctx=canvas.getContext('2d');const w=canvas.width,h=canvas.height;
  const encMsg=fakeEncrypt(msg);
  const transitData=encrypted?encMsg:msg;

  if(eveActive){
    // Phase 1: Alice -> Eve
    for(let t=0;t<=30;t++){
      const prog=t/30;
      const px=lerp(ACTORS.alice.x,ACTORS.eve.x,prog);
      const py=lerp(ACTORS.alice.y,ACTORS.eve.y,prog);
      drawScene(ctx,w,h,{eveActive,encrypted,packetX:px,packetY:py,packetLabel:transitData.substring(0,18),eveData:null});
      await sleep(25);
    }
    playSound('click');

    // Eve intercepts
    if(encrypted){
      log(`\uD83D\uDD12 ${s.eveBlocked}: "${encMsg.substring(0,20)}..."`,'success');
      drawScene(ctx,w,h,{eveActive,encrypted,packetX:null,packetY:null,eveData:encMsg});
    } else {
      log(`\uD83D\uDC41\uFE0F ${s.eveReads} "${msg}"`,'error');
      drawScene(ctx,w,h,{eveActive,encrypted,packetX:null,packetY:null,eveData:msg});
    }
    await sleep(800);

    // Phase 2: Eve -> Bob
    for(let t=0;t<=30;t++){
      const prog=t/30;
      const px=lerp(ACTORS.eve.x,ACTORS.bob.x,prog);
      const py=lerp(ACTORS.eve.y,ACTORS.bob.y,prog);
      drawScene(ctx,w,h,{eveActive,encrypted,packetX:px,packetY:py,packetLabel:transitData.substring(0,18),eveData:encrypted?encMsg:msg});
      await sleep(25);
    }
  } else {
    // Direct: Alice -> Bob
    log(`\u2714\uFE0F ${s.eveOff}`,'info');
    for(let t=0;t<=40;t++){
      const prog=t/40;
      const px=lerp(ACTORS.alice.x,ACTORS.bob.x,prog);
      const py=ACTORS.alice.y;
      drawScene(ctx,w,h,{eveActive,encrypted,packetX:px,packetY:py,packetLabel:transitData.substring(0,18),eveData:null});
      await sleep(25);
    }
  }

  playSound('success');
  log(`\u2705 ${s.msgDelivered}: "${msg}"`,'success');
  drawScene(ctx,w,h,{eveActive,encrypted,packetX:null,packetY:null,eveData:eveActive?(encrypted?encMsg:msg):null});

  // Add to message log
  msgHistory.push({msg,encrypted,eveActive,time:new Date().toLocaleTimeString()});
  renderMsgLog();

  hideToast();sending=false;
}

function renderMsgLog(){
  const wrap=$('msgLog'),body=$('msgLogBody');
  if(!wrap||!body)return;
  if(msgHistory.length===0){wrap.style.display='none';return;}
  wrap.style.display='block';
  body.innerHTML='';
  msgHistory.slice(-10).reverse().forEach(m=>{
    const s=LANG[currentLang];
    const div=document.createElement('div');
    div.style.cssText='padding:.3rem .5rem;margin-bottom:.3rem;border-radius:6px;border-left:3px solid '+(m.eveActive&&!m.encrypted?'#ef4444':m.encrypted?'#3b82f6':'#f59e0b')+';background:rgba(0,0,0,.2);';
    const status=m.encrypted?s.encrypted:s.plaintext;
    const eveStatus=m.eveActive?(m.encrypted?'\uD83D\uDD12':'\uD83D\uDC41\uFE0F'):'\u2014';
    div.innerHTML=`<span style="color:var(--text-muted);font-size:.7rem;">${m.time}</span> <strong>"${m.msg}"</strong> <span style="font-size:.72rem;color:${m.encrypted?'#3b82f6':'#f59e0b'};">[${status}]</span> <span style="font-size:.72rem;">Eve: ${eveStatus}</span>`;
    body.appendChild(div);
  });
}

async function autoDemo(){
  if(sending)return;
  const s=LANG[currentLang];
  const input=$('msgInput');
  const eveToggle=$('eveToggle');
  const encToggle=$('encryptToggle');

  // Step 1: No Eve, no encryption
  input.value='Hello Bob!';eveToggle.checked=false;encToggle.checked=false;
  await sendMessage();await sleep(600);

  // Step 2: Eve ON, no encryption (attack succeeds)
  input.value='My password is 1234';eveToggle.checked=true;encToggle.checked=false;
  await sendMessage();await sleep(600);

  // Step 3: Eve ON, encryption ON (attack fails)
  input.value='Secret project details';eveToggle.checked=true;encToggle.checked=true;
  await sendMessage();await sleep(600);

  // Step 4: Eve OFF, encryption ON (safe)
  input.value='All clear now!';eveToggle.checked=false;encToggle.checked=true;
  await sendMessage();

  log('\uD83C\uDF93 Demo complete! Notice how encryption blocked Eve.','success');
}

function showDefenseGuide(){
  const s=LANG[currentLang];
  const r=$('defenseResults');if(!r)return;
  r.style.display='block';
  const defenses=[
    {icon:'\uD83D\uDD12',text:s.defense_https,color:'#22c55e'},
    {icon:'\uD83D\uDEE1\uFE0F',text:s.defense_hsts,color:'#3b82f6'},
    {icon:'\uD83D\uDCCC',text:s.defense_pin,color:'#f59e0b'},
    {icon:'\uD83D\uDD04',text:s.defense_mtls,color:'#a855f7'},
    {icon:'\uD83D\uDD10',text:s.defense_vpn,color:'#0ea5e9'},
  ];
  r.innerHTML=defenses.map(d=>`<div style="padding:.4rem .6rem;margin-bottom:.3rem;border-radius:6px;border-left:3px solid ${d.color};background:rgba(0,0,0,.2);font-size:.78rem;">${d.icon} ${d.text}</div>`).join('');
  log('\uD83D\uDEE1\uFE0F Defense guide shown','success');
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  $('whisperBtn').onclick=toggleWhisper;
  const bb=$('breathingBtn'),dd=$('dhikrDisplay'),db=$('dhikrBtn');
  if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none';};if(db)db.onclick=incrementDhikr;
  $('musicBtn').onclick=()=>log('\uD83C\uDFB5 Coming soon','info');
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initKonami();initMatrixTrigger();initHijriDate();initPixelPet();

  // App specific
  $('sendBtn').onclick=sendMessage;
  $('autoBtn').onclick=autoDemo;
  const defBtn=$('showDefenseBtn');if(defBtn)defBtn.onclick=showDefenseGuide;
  $('msgInput').addEventListener('keydown',e=>{if(e.key==='Enter')sendMessage();});

  // Initial render
  const c=$('mitmCanvas');
  if(c){
    const ctx=c.getContext('2d');
    drawScene(ctx,c.width,c.height,{eveActive:false,encrypted:false,packetX:null,packetY:null,eveData:null});
  }

  // Enhanced: Packet Sniffer Visualization
  (function(){
  let sCanvas,sCtx;const sniffed=[];
  function createSC(){
    const cards=document.querySelectorAll('.card');const t=cards.length>0?cards[0]:document.body;
    const w=document.createElement('div');w.style.cssText='margin:1rem 0;border-radius:12px;overflow:hidden;border:1px solid var(--glass-border,rgba(255,255,255,0.1));';
    w.innerHTML='<div style="padding:.5rem .8rem;font-size:.75rem;font-weight:700;opacity:.6;text-transform:uppercase;letter-spacing:1px;">Packet Sniffer Waterfall</div>';
    const c=document.createElement('canvas');c.width=620;c.height=220;
    c.style.cssText='width:100%;height:auto;display:block;background:#0a0e1a;';
    w.appendChild(c);t.appendChild(w);return c;
  }
  function drawSC(){
    if(!sCtx)return;const w=sCanvas.width,h=sCanvas.height;
    sCtx.fillStyle='rgba(10,14,26,0.08)';sCtx.fillRect(0,0,w,h);
    // Waterfall - each row is a captured packet
    const rowH=8;const maxRows=Math.floor(h/rowH);
    if(sniffed.length>maxRows)sniffed.shift();
    sniffed.forEach((pkt,i)=>{
      const y=i*rowH;
      // Protocol color band
      const colors={TCP:'#3b82f6',UDP:'#22c55e',HTTP:'#f59e0b',HTTPS:'#10b981',DNS:'#8b5cf6'};
      const proto=['TCP','UDP','HTTP','HTTPS','DNS'][Math.floor(Math.random()*5)];
      if(!pkt.proto)pkt.proto=proto;
      const col=colors[pkt.proto]||'#6b7280';
      fCtx=sCtx;
      // Time column
      sCtx.fillStyle='rgba(255,255,255,0.05)';sCtx.fillRect(0,y,60,rowH-1);
      sCtx.fillStyle='rgba(255,255,255,0.3)';sCtx.font='6px monospace';sCtx.textAlign='left';
      sCtx.fillText(pkt.time||'00:00',2,y+6);
      // Source
      sCtx.fillStyle=col+'22';sCtx.fillRect(62,y,120,rowH-1);
      sCtx.fillStyle=col;sCtx.fillText(pkt.src||'192.168.1.'+Math.floor(Math.random()*255),64,y+6);
      // Dest
      sCtx.fillStyle='rgba(255,255,255,0.03)';sCtx.fillRect(184,y,120,rowH-1);
      sCtx.fillStyle='rgba(255,255,255,0.4)';sCtx.fillText(pkt.dst||'10.0.0.'+Math.floor(Math.random()*255),186,y+6);
      // Protocol
      sCtx.fillStyle=col+'33';sCtx.fillRect(306,y,50,rowH-1);
      sCtx.fillStyle=col;sCtx.fillText(pkt.proto,308,y+6);
      // Data preview (hex)
      sCtx.fillStyle='rgba(255,255,255,0.03)';sCtx.fillRect(358,y,w-358,rowH-1);
      if(!pkt.hex)pkt.hex=Array.from({length:20},()=>Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(' ');
      sCtx.fillStyle=pkt.encrypted?'rgba(16,185,129,0.4)':'rgba(239,68,68,0.4)';
      sCtx.fillText(pkt.encrypted?'[ENCRYPTED]':pkt.hex,360,y+6);
    });
    // Auto-generate packets
    if(Math.random()>0.7){
      sniffed.push({time:new Date().toLocaleTimeString().slice(0,5),
        src:'192.168.1.'+Math.floor(Math.random()*255),
        dst:'10.0.0.'+Math.floor(Math.random()*255),
        encrypted:Math.random()>0.5});
    }
    requestAnimationFrame(drawSC);
  }
  sCanvas=createSC();if(sCanvas){sCtx=sCanvas.getContext('2d');drawSC();}
  })();

  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();


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
