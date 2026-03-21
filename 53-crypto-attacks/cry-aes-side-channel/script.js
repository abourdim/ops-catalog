/**
 * AES Side Channel — Workshop DIY v1.0
 * Simulate power analysis attack on AES S-box lookups
 */
const $=id=>document.getElementById(id);
const SBOX=[0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16];
function hammingWeight(v){let c=0;while(v){c+=v&1;v>>=1}return c}
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
    ...LANG_BASE.en,title:'AES Side Channel',subtitle:'Observe power/timing leaks during AES rounds',mainSection:'Side Channel Analysis',mainDesc:'Visualize simulated power traces from AES S-box',keyLabel:'AES Key (hex)',ptLabel:'Plaintext (hex)',tracesLabel:'Number of Traces',capture:'Capture Traces',analyze:'Analyze (CPA)',stop:'Stop',results:'Results',vizTitle:'Power Trace Visualization',vizHint:'Simulated power consumption during AES S-box lookups',sectionA:'Attack Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',capturing:'Capturing traces...',analyzing:'Running CPA...',keyRecovered:'Key byte recovered!',howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Attack Reference" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_sbox:'صندوق S هو العملية غير الخطية الرئيسية في AES. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_hamming:'نموذج وزن هامينغ: الطاقة تتناسب مع عدد البتات 1. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_cpa:'CPA يحسب ارتباط بيرسون بين الطاقة الافتراضية والمقاسة. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    mathExplain:'CPA Attack on AES:\n\nFor each key byte guess k (0..255):\n  For each trace i:\n    h[i] = HW(SBox[plaintext[i] XOR k])\n  correlation[k] = Pearson(h, measured_power)\n\nCorrect key byte has highest correlation.\n\nHamming Weight: HW(x) = number of 1-bits in x\nPearson: r = cov(X,Y) / (std(X) * std(Y))',step1Title:'Set Up',step1Desc:'Configure the parameters for AES Side Channel. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Attack Reference" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Math Deep Dive". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is AES Side Channel?',faq_a1:'AES Side Channel lets you visualize simulated power traces from aes s-box. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you select the cryptographic algorithm and key parameters to analyze. Then you configure the attack parameters: known plaintext, side-channel data, or timing.',faq_q3:'What do the controls do?',faq_a3:'Enter AES key and plaintext in hex. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'صندوق S هو العملية غير الخطية الرئيسية في AES.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Birthday Paradox Demo and Cry Bleichenbacher Attack. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to AES Side Channel! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Enter AES key and plaintext in hex. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Attack Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how cryptography works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32)  # 32 bytes = 256 bits\\niv = os.urandom(16)   # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key:        {key.hex()}")\\nprint(f"IV:         {iv.hex()}")\\nprint(f"Plaintext:  {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered:  {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',purpose:'AES Side Channel: Visualize simulated power traces from AES S-box. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Choose Algorithm through Set Up Attack to Execute Attack and Analyze Results.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Attack Reference" and "Math Deep Dive" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Canal Auxiliaire AES',subtitle:'Observez les fuites de puissance/temps pendant AES',mainSection:'Analyse Canal Auxiliaire',mainDesc:'Visualisez les traces de puissance simulees',keyLabel:'Cle AES (hex)',ptLabel:'Texte clair (hex)',tracesLabel:'Nombre de traces',capture:'Capturer',analyze:'Analyser (CPA)',stop:'Arreter',results:'Resultats',vizTitle:'Visualisation Traces',vizHint:'Consommation electrique simulee pendant AES',sectionA:'Reference',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',capturing:'Capture en cours...',analyzing:'CPA en cours...',keyRecovered:'Octet de cle recupere!',howto_1:'Entrez cle et texte clair en hex.',howto_2:'Cliquez Capturer.',howto_3:'Cliquez Analyser.',howto_4:'Regardez les correlations.',
    wiki_sbox:'La S-box est l\'operation non-lineaire principale d\'AES.',wiki_hamming:'Modele poids de Hamming: puissance ~ nombre de bits 1.',wiki_cpa:'CPA calcule la correlation de Pearson entre puissance hypothetique et mesuree.',
    mathExplain:'Attaque CPA sur AES:\n\nPour chaque hypothese k (0..255):\n  h[i] = HW(SBox[texte[i] XOR k])\n  correlation[k] = Pearson(h, puissance)\n\nLa bonne cle a la plus haute correlation.',step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule cryptographic attacks ! 🔬 Tu peux expérimenter avec breaking encryption en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Entropy Analyzer and Cry Certificate Forgery Lab ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'القناة الجانبية AES',subtitle:'راقب تسريبات الطاقة والتوقيت أثناء جولات AES',mainSection:'تحليل القناة الجانبية',mainDesc:'تصور آثار الطاقة المحاكاة من بحث S-box',keyLabel:'مفتاح AES (hex)',ptLabel:'نص أصلي (hex)',tracesLabel:'عدد الآثار',capture:'التقاط',analyze:'تحليل CPA',stop:'إيقاف',results:'النتائج',vizTitle:'تصور آثار الطاقة',vizHint:'استهلاك الطاقة المحاكى أثناء AES',sectionA:'مرجع',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',capturing:'جاري الالتقاط...',analyzing:'جاري تحليل CPA...',keyRecovered:'تم استرجاع بايت المفتاح!',howto_1:'أدخل المفتاح والنص بالست عشري.',howto_2:'اضغط التقاط.',howto_3:'اضغط تحليل.',howto_4:'شاهد الارتباطات.',
    wiki_sbox:'صندوق S هو العملية غير الخطية الرئيسية في AES.',wiki_hamming:'نموذج وزن هامينغ: الطاقة تتناسب مع عدد البتات 1.',wiki_cpa:'CPA يحسب ارتباط بيرسون بين الطاقة الافتراضية والمقاسة.',
    mathExplain:'هجوم CPA على AES:\n\nلكل تخمين k (0..255):\n  h[i] = HW(SBox[نص[i] XOR k])\n  الارتباط[k] = بيرسون(h, الطاقة)\n\nالمفتاح الصحيح له أعلى ارتباط.',step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي cryptographic attacks! 🔬 يمكنك التجربة مع breaking encryption في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Entropy Analyzer and Cry Certificate Forgery Lab! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;if($('langSelect'))$('langSelect').value=lang;try{localStorage.setItem('cry-aes-lang',lang)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));if($('themeSelect'))$('themeSelect').value=name;try{localStorage.setItem('cry-aes-theme',name)}catch{}log(`${LANG[currentLang].themeChanged} ${name}`,'info')}
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const tm=audioCtx.currentTime;o.frequency.value=t==='success'?523:t==='error'?200:800;o.type=t==='error'?'square':'sine';g.gain.exponentialRampToValueAtTime(.001,tm+.2);o.start(tm);o.stop(tm+.2)}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success')}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(p,o){p.classList.toggle('open');if(o)o.classList.toggle('active',p.classList.contains('open'))}

/* ═══════ POWER TRACE SIMULATION ═══════ */
let traces=[],plaintexts=[],correlations=[],running=false;
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function parseHex(s){const h=s.replace(/\s/g,'');const a=[];for(let i=0;i<h.length;i+=2)a.push(parseInt(h.substr(i,2),16)||0);return a}

function captureTraces(){
  const key=parseHex($('keyInput').value),nTraces=parseInt($('traceCount').value)||50;
  traces=[];plaintexts=[];const s=LANG[currentLang];log(s.capturing,'info');showToast(s.capturing);
  for(let t=0;t<nTraces;t++){
    const pt=[];for(let i=0;i<key.length;i++)pt.push(Math.floor(Math.random()*256));
    plaintexts.push(pt);
    const trace=[];
    for(let i=0;i<key.length;i++){
      const sboxOut=SBOX[pt[i]^key[i]];const hw=hammingWeight(sboxOut);
      trace.push(hw+(Math.random()-.5)*2); // hw + noise
    }
    traces.push(trace);
  }
  hideToast();log(`Captured ${nTraces} traces`,'success');
  $('resultsBox').textContent=`Captured ${nTraces} traces\nKey bytes: ${key.length}\nTrace length: ${key.length} points per trace`;
  drawCanvas()
}

function analyzeCPA(){
  if(traces.length===0){captureTraces()}
  const s=LANG[currentLang];log(s.analyzing,'info');showToast(s.analyzing);
  correlations=[];const nBytes=traces[0].length;const recovered=[];
  for(let byteIdx=0;byteIdx<nBytes;byteIdx++){
    let bestCorr=-1,bestKey=0;const byteCorrs=[];
    for(let guess=0;guess<256;guess++){
      const hyp=plaintexts.map(pt=>hammingWeight(SBOX[pt[byteIdx]^guess]));
      const measured=traces.map(t=>t[byteIdx]);
      const r=pearson(hyp,measured);byteCorrs.push(r);
      if(r>bestCorr){bestCorr=r;bestKey=guess}
    }
    correlations.push(byteCorrs);recovered.push(bestKey);
    log(`Byte ${byteIdx}: 0x${bestKey.toString(16).padStart(2,'0')} (corr=${bestCorr.toFixed(4)})`,'success');
  }
  hideToast();
  $('resultsBox').textContent+=`\n\nRecovered key: ${recovered.map(b=>b.toString(16).padStart(2,'0')).join('')}\nOriginal key:  ${$('keyInput').value.replace(/\s/g,'')}\n\n${s.keyRecovered}`;
  drawCanvas()
}

function pearson(x,y){
  const n=x.length;let sx=0,sy=0,sxy=0,sx2=0,sy2=0;
  for(let i=0;i<n;i++){sx+=x[i];sy+=y[i];sxy+=x[i]*y[i];sx2+=x[i]*x[i];sy2+=y[i]*y[i]}
  const num=n*sxy-sx*sy,den=Math.sqrt((n*sx2-sx*sx)*(n*sy2-sy*sy));
  return den===0?0:num/den;
}

function drawCanvas(){
  if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),accent2=getCS('--accent2'),text=getCS('--text'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText('AES Side Channel Attack',10,22);

  if(traces.length>0){
    // Draw power traces (top half)
    const traceH=(h-50)/2,traceY=40;
    ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText(`Power Traces (${traces.length} captures)`,10,traceY-4);
    const nPts=traces[0].length,pxPerPt=(w-20)/nPts;
    const maxShow=Math.min(30,traces.length);
    for(let t=0;t<maxShow;t++){
      const alpha=.15+.5*(t/maxShow);ctx.strokeStyle=`rgba(74,222,128,${alpha})`;ctx.lineWidth=1;ctx.beginPath();
      for(let i=0;i<nPts;i++){const val=traces[t][i]/8;const x=10+i*pxPerPt;const y=traceY+traceH/2-val*traceH*.4;
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();
    }
    // X axis labels
    for(let i=0;i<nPts;i++){ctx.fillStyle=muted;ctx.font='9px monospace';ctx.fillText(`B${i}`,10+i*pxPerPt,traceY+traceH+12)}
  }

  if(correlations.length>0){
    // Draw correlation heatmap (bottom half)
    const corrY=h/2+20,corrH=h/2-30;
    ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('CPA Correlation per Key Guess',10,corrY-4);
    const nBytes=correlations.length;
    for(let b=0;b<nBytes;b++){
      const bw=(w-20)/nBytes;
      // Draw correlation curve for this byte
      const maxCorr=Math.max(...correlations[b]);const bestGuess=correlations[b].indexOf(maxCorr);
      ctx.fillStyle=accent;ctx.font='9px monospace';ctx.fillText(`B${b}:0x${bestGuess.toString(16).padStart(2,'0')}`,10+b*bw,corrY+12);
      // Mini bar chart
      for(let g=0;g<256;g++){
        const x=10+b*bw+(g/256)*bw;const ch=correlations[b][g]*corrH*.6;
        ctx.fillStyle=g===bestGuess?'#f87171':`${accent}22`;ctx.fillRect(x,corrY+corrH-ch,Math.max(1,bw/256),ch);
      }
    }
  }
}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'S-Box',p:s.wiki_sbox},{t:'Hamming Weight',p:s.wiki_hamming},{t:'CPA',p:s.wiki_cpa}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'S-Box',p:LANG[currentLang].wiki_sbox},{t:'Hamming Weight',p:LANG[currentLang].wiki_hamming},{t:'CPA',p:LANG[currentLang].wiki_cpa}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-aes-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-aes-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};
  $('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})}});
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  $('captureBtn').onclick=captureTraces;$('analyzeBtn').onclick=analyzeCPA;$('stopBtn').onclick=()=>{running=false;hideToast()};
  buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()
});

/* ═══════ ENHANCED AES SIDE-CHANNEL VISUALIZATION (IIFE) ═══════ */
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

  // === S-Box Visualization (top-left) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('AES S-Box (16x16)',10,16);
  const sW=w*0.38,sH=130,sX=10,sY=24;
  const cellW=sW/16,cellH=sH/16;
  for(let i=0;i<16;i++){
    for(let j=0;j<16;j++){
      const idx=i*16+j;
      const val=SBOX[idx];
      const hw=hammingWeight(val);
      const intensity=hw/8;
      const isActive=idx===(_t%256);
      _x.fillStyle=isActive?'#f87171':`rgba(${Math.floor(intensity*200)+30},${Math.floor((1-intensity)*150)+40},${100},${intensity*0.6+0.1})`;
      _x.fillRect(sX+j*cellW,sY+i*cellH,cellW-0.5,cellH-0.5);
    }
  }
  // Active cell label
  const activeIdx=_t%256;
  _x.fillStyle=mut;_x.font='9px SF Mono';
  _x.fillText(`S[0x${activeIdx.toString(16).padStart(2,'0')}] = 0x${SBOX[activeIdx].toString(16).padStart(2,'0')}  HW=${hammingWeight(SBOX[activeIdx])}`,sX,sY+sH+12);

  // === Hamming Weight Distribution (top-right) ===
  const hwX=w*0.42,hwY=6;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('S-Box Hamming Weight Distribution',hwX,16);
  const hwW=w*0.56,hwH=130;
  const hwDist=new Array(9).fill(0);
  for(let i=0;i<256;i++)hwDist[hammingWeight(SBOX[i])]++;
  const maxHW=Math.max(...hwDist);
  const barW=hwW/9;
  for(let hw=0;hw<=8;hw++){
    const barH=(hwDist[hw]/maxHW)*hwH*0.8;
    const color=`hsl(${hw*30+120},60%,50%)`;
    _x.fillStyle=color+'44';_x.fillRect(hwX+hw*barW+5,hwY+18+hwH-barH,barW-10,barH);
    _x.fillStyle=color;_x.font='bold 9px SF Mono';_x.textAlign='center';
    _x.fillText(`HW=${hw}`,hwX+hw*barW+barW/2,hwY+hwH+22);
    _x.fillText(`${hwDist[hw]}`,hwX+hw*barW+barW/2,hwY+18+hwH-barH-4);
    _x.textAlign='left';
  }

  // === Simulated Power Trace (middle) ===
  const ptY=sY+sH+28,ptH=60,ptW=w-20;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Simulated Power Trace (single encryption)',10,ptY);

  // Generate a fake power trace with S-box lookups visible
  _x.strokeStyle='#4ade80';_x.lineWidth=1.5;_x.beginPath();
  const traceLen=200;
  for(let i=0;i<traceLen;i++){
    const x=10+i*(ptW/traceLen);
    const sboxPoint=(i%25)===12;
    const baseNoise=(Math.sin(i*0.3+_t*0.05)*2+Math.random()*1.5);
    const sboxSpike=sboxPoint?hammingWeight(SBOX[(_t+i)&0xFF])*2:0;
    const y=ptY+12+ptH/2-(baseNoise+sboxSpike)*3;
    if(i===0)_x.moveTo(x,y);else _x.lineTo(x,y);
  }
  _x.stroke();_x.lineWidth=1;

  // Mark S-box lookup points
  for(let i=0;i<traceLen;i++){
    if((i%25)===12){
      const x=10+i*(ptW/traceLen);
      _x.strokeStyle='#f8717144';_x.beginPath();_x.moveTo(x,ptY+10);_x.lineTo(x,ptY+10+ptH);_x.stroke();
    }
  }
  _x.fillStyle=mut;_x.font='8px SF Mono';_x.fillText('S-box lookup spikes marked in red',10,ptY+ptH+20);

  // === CPA Correlation Matrix (bottom) ===
  const cpY=ptY+ptH+30,cpW=w-20,cpH=h-cpY-25;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('CPA Correlation: 256 key guesses x 16 byte positions',10,cpY);

  const corrCols=Math.min(128,Math.floor(cpW/3)),corrRows=16;
  const corrCW=cpW/corrCols,corrCH=Math.min(cpH/corrRows-0.5,(cpH-15)/corrRows);
  for(let i=0;i<corrRows;i++){
    for(let j=0;j<corrCols;j++){
      // Simulated correlation: correct key byte should have highest correlation
      const correctKey=(0xA5+i*0x11)&0xFF;
      const guess=Math.floor(j*256/corrCols);
      const dist=Math.abs(guess-correctKey);
      const corr=Math.exp(-dist*dist/800)+Math.sin(_t*0.02+i+j*0.1)*0.05;
      const isCorrect=dist<2;
      _x.fillStyle=isCorrect?`rgba(248,113,113,${corr})`:`rgba(96,165,250,${corr*0.5})`;
      _x.fillRect(10+j*corrCW,cpY+8+i*corrCH,corrCW-0.5,corrCH-0.5);
    }
    // Byte label
    _x.fillStyle=mut;_x.font='7px SF Mono';
    _x.fillText(`B${i}`,cpW+14,cpY+8+i*corrCH+corrCH/2+2);
  }
  _x.fillStyle='#f87171';_x.font='8px SF Mono';
  _x.fillText('Correct key bytes show peak correlation (red columns)',10,cpY+8+corrRows*corrCH+12);

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
