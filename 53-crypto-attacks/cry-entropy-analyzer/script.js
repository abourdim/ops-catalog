/**
 * Entropy Analyzer — Workshop DIY v1.0
 * Randomness Quality Tester (Chi-Square, Monte Carlo, Shannon Entropy)
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
    title:'Entropy Analyzer',subtitle:'Test randomness quality with chi-square, Monte Carlo, entropy tests',
    mainSection:'Randomness Tester',mainDesc:'Analyze byte sequences for randomness using multiple statistical tests',
    sourceLabel:'Data Source',sourceHint:'Choose a random source or enter custom data',
    sizeLabel:'Sample Size (bytes)',customLabel:'Custom Hex Data',
    analyze:'Analyze',compareAll:'Compare All Sources',reset:'Reset',results:'Results',
    vizTitle:'Entropy Visualization',vizHint:'Byte distribution, Monte Carlo plot, and entropy metrics',
    sectionA:'Test Reference',sectionB:'Entropy Deep Dive',
    settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',
    langChanged:'Language -> English',themeChanged:'Theme ->',
    analyzing:'Analyzing entropy...',complete:'Analysis complete',resetDone:'Reset complete',
    howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Test Reference" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_shannon:'انتروبيا شانون: H = -sum(p(x) * log2(p(x))). المدى: 0 الى 8.0. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_chi:'مربع كاي: X^2 = sum((ملاحظ-متوقع)^2/متوقع). This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_monte:'مونتي كارلو باي: ازواج كاحداثيات. باي ~ 4 * (داخل الدائرة / الكل). This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_serial:'الارتباط التسلسلي: التبعية بين بايتات متتالية. قرب 0 = جيد. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    mathExplain:'Entropy Tests:\n\n1. Shannon Entropy:\n   H = -sum(p_i * log2(p_i)) for i=0..255\n   Perfect random: H = 8.0 bits/byte\n\n2. Chi-Square Test:\n   X^2 = sum((O_i - E)^2 / E)\n   E = N/256 (expected count per byte)\n   df = 255, accept if p-value > 0.01\n\n3. Monte Carlo Pi Estimation:\n   Take pairs (x,y) as points in [0,255]^2\n   Circle: x^2 + y^2 <= 127.5^2\n   Pi ~ 4 * (inside/total)\n\n4. Serial Correlation:\n   r = (sum(x_i * x_{i+1}) - mean^2*N) / (sum(x_i^2) - mean^2*N)\n   Ideal: r = 0 (no correlation)'
  ,step1Title:'Set Up',step1Desc:'Configure the parameters for Entropy Analyzer. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Test Reference" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Entropy Deep Dive". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is Entropy Analyzer?',faq_a1:'Entropy Analyzer lets you analyze byte sequences for randomness using multiple statistical tests. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real cryptography behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real cryptography principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to Entropy Analyzer! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Choose a data source (CSPRNG, PRNG, weak, or custom). Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Test Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how cryptography works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32)  # 32 bytes = 256 bits\\niv = os.urandom(16)   # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key:        {key.hex()}")\\nprint(f"IV:         {iv.hex()}")\\nprint(f"Plaintext:  {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered:  {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',wiki_concept_title:'🔬 What is Entropy Analyzer?',wiki_concept:'Entropy Analyzer is a technique used in cryptography. Analyze byte sequences for randomness using multiple statistical tests. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the parameters for Entropy Analyzer. Choose your input settings using the controls in the main card. Each control directly affects the simulation output. Second: Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs. The simulation runs these stages in real time, showing you intermediate results at each step. In real cryptography, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Entropy Analyzer has practical applications in cryptography. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Entropy Analyzer: Analyze byte sequences for randomness using multiple statistical tests. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Choose Algorithm through Set Up Attack to Execute Attack and Analyze Results.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Test Reference" and "Entropy Deep Dive" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{
    title:'Analyseur d\'Entropie',subtitle:'Testez la qualite de l\'aleatoire avec chi-carre, Monte Carlo, entropie',
    mainSection:'Testeur d\'Aleatoire',mainDesc:'Analysez des sequences d\'octets avec plusieurs tests statistiques',
    sourceLabel:'Source de Donnees',sourceHint:'Choisissez une source aleatoire ou entrez des donnees',
    sizeLabel:'Taille d\'Echantillon (octets)',customLabel:'Donnees Hex Personnalisees',
    analyze:'Analyser',compareAll:'Comparer Toutes les Sources',reset:'Reinitialiser',results:'Resultats',
    vizTitle:'Visualisation d\'Entropie',vizHint:'Distribution des octets, graphique Monte Carlo et metriques',
    sectionA:'Reference des Tests',sectionB:'Entropie en Profondeur',
    settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',
    langChanged:'Langue -> Francais',themeChanged:'Theme ->',
    analyzing:'Analyse en cours...',complete:'Analyse terminee',resetDone:'Reinitialisation complete'Mes données sont-elles privées ?'octets comme coordonnees pour estimer Pi.',
    howto_1:'Choisissez une source de donnees.',howto_2:'Definissez la taille et cliquez Analyser.',howto_3:'Comparez toutes les sources.',howto_4:'Examinez l\'histogramme et le scatter.',
    wiki_shannon:'Entropie de Shannon: H = -sum(p(x) * log2(p(x))). Plage: 0 a 8.0.',
    wiki_chi:'Chi-Carre: X^2 = sum((observe-attendu)^2/attendu). Accepter si 200 < X^2 < 330.',
    wiki_monte:'Monte Carlo Pi: Paires comme coordonnees. Pi ~ 4 * (dans cercle / total).',
    wiki_serial:'Correlation Serie: Dependance entre octets consecutifs. Pres de 0 = bon.',
    mathExplain:'Tests d\'Entropie:\n\n1. Entropie de Shannon: H = -sum(p_i * log2(p_i))\n2. Test Chi-Carre: X^2 = sum((O_i-E)^2/E)\n3. Monte Carlo Pi: Pi ~ 4 * (dans cercle/total)\n4. Correlation Serie: r pres de 0 = pas de correlation'
  ,step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule cryptographic attacks ! 🔬 Tu peux expérimenter avec breaking encryption en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Birthday Paradox Demo and Cry Rsa Factoring Race ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{
    title:'محلل الانتروبيا',subtitle:'اختبر جودة العشوائية بمربع كاي ومونتي كارلو والانتروبيا',
    mainSection:'اختبار العشوائية',mainDesc:'حلل تسلسلات البايت للعشوائية باستخدام اختبارات احصائية متعددة',
    sourceLabel:'مصدر البيانات',sourceHint:'اختر مصدر عشوائي او ادخل بيانات مخصصة',
    sizeLabel:'حجم العينة (بايت)',customLabel:'بيانات سداسية مخصصة',
    analyze:'تحليل',compareAll:'مقارنة جميع المصادر',reset:'اعادة تعيين',results:'النتائج',
    vizTitle:'تصور الانتروبيا',vizHint:'توزيع البايت ورسم مونتي كارلو ومقاييس الانتروبيا',
    sectionA:'مرجع الاختبارات',sectionB:'تعمق في الانتروبيا',
    settings:'الاعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',
    help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',
    langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',
    analyzing:'جاري التحليل...',complete:'اكتمل التحليل',resetDone:'تمت اعادة التعيين',
    howto_1:'اختر مصدر بيانات.',howto_2:'حدد الحجم وانقر تحليل.',howto_3:'قارن جميع المصادر.',howto_4:'افحص المدرج التكراري والمبعثر.',
    wiki_shannon:'انتروبيا شانون: H = -sum(p(x) * log2(p(x))). المدى: 0 الى 8.0.',
    wiki_chi:'مربع كاي: X^2 = sum((ملاحظ-متوقع)^2/متوقع).',
    wiki_monte:'مونتي كارلو باي: ازواج كاحداثيات. باي ~ 4 * (داخل الدائرة / الكل).',
    wiki_serial:'الارتباط التسلسلي: التبعية بين بايتات متتالية. قرب 0 = جيد.',
    mathExplain:'اختبارات الانتروبيا:\n\n1. انتروبيا شانون: H = -sum(p_i * log2(p_i))\n2. مربع كاي: X^2 = sum((O_i-E)^2/E)\n3. مونتي كارلو: باي ~ 4 * (داخل الدائرة/الكل)\n4. الارتباط التسلسلي: r قرب 0 = بدون ارتباط'
  ,step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي cryptographic attacks! 🔬 يمكنك التجربة مع breaking encryption في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Birthday Paradox Demo and Cry Rsa Factoring Race! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('cry-entropy-lang',lang)}catch{};log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('cry-entropy-theme',name)}catch{};log(`${LANG[currentLang].themeChanged} ${name}`,'info')}
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.08);osc.start(t);osc.stop(t+.08)}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.3);osc.start(t);osc.stop(t+.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.25)}}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function togglePanel(panel,overlay){panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'))}

/* ======= DATA GENERATORS ======= */
function generateData(source,size){
  const data=new Uint8Array(size);
  switch(source){
    case'crypto':
      crypto.getRandomValues(data);break;
    case'math':
      for(let i=0;i<size;i++)data[i]=Math.floor(Math.random()*256);break;
    case'linear':{
      let seed=Date.now()&0xFFFFFFFF;
      for(let i=0;i<size;i++){seed=(seed*1103515245+12345)&0x7FFFFFFF;data[i]=(seed>>16)&0xFF}
      break;
    }
    case'counter':
      for(let i=0;i<size;i++)data[i]=i&0xFF;break;
    case'custom':{
      const hex=$('customInput').value.replace(/[^0-9a-fA-F]/g,'');
      for(let i=0;i<Math.min(size,hex.length/2);i++)data[i]=parseInt(hex.substr(i*2,2),16);
      break;
    }
  }
  return data;
}

/* ======= STATISTICAL TESTS ======= */
function shannonEntropy(data){
  const freq=new Float64Array(256);
  for(let i=0;i<data.length;i++)freq[data[i]]++;
  let H=0;
  for(let i=0;i<256;i++){
    if(freq[i]>0){const p=freq[i]/data.length;H-=p*Math.log2(p)}
  }
  return H;
}

function chiSquare(data){
  const freq=new Float64Array(256);
  for(let i=0;i<data.length;i++)freq[data[i]]++;
  const expected=data.length/256;
  let chi2=0;
  for(let i=0;i<256;i++)chi2+=(freq[i]-expected)**2/expected;
  // Approximate p-value using normal approximation
  const df=255,z=(chi2-df)/Math.sqrt(2*df);
  const pValue=1-0.5*(1+Math.sign(z)*(1-Math.exp(-2*z*z/Math.PI)));
  return{chi2,df,pValue:Math.max(0,Math.min(1,pValue)),freq};
}

function monteCarloPi(data){
  let inside=0,total=0;
  const points=[];
  const r=127.5;
  for(let i=0;i<data.length-1;i+=2){
    const x=data[i],y=data[i+1];
    const dx=x-r,dy=y-r;
    if(dx*dx+dy*dy<=r*r)inside++;
    total++;
    if(points.length<2000)points.push({x,y,inside:dx*dx+dy*dy<=r*r});
  }
  const piEst=4*inside/total;
  const error=Math.abs(piEst-Math.PI);
  return{piEst,error,errorPct:(error/Math.PI*100),inside,total,points};
}

function serialCorrelation(data){
  if(data.length<2)return 0;
  let sum=0,sumSq=0,sumProd=0;
  for(let i=0;i<data.length;i++){sum+=data[i];sumSq+=data[i]*data[i]}
  for(let i=0;i<data.length-1;i++)sumProd+=data[i]*data[i+1];
  const mean=sum/data.length;
  const denom=sumSq-mean*mean*data.length;
  if(denom===0)return 1;
  return(sumProd-mean*mean*(data.length-1))/denom;
}

let state={data:null,results:null,comparisons:[],phase:'idle'};

function analyzeData(){
  const source=$('sourceSelect').value;
  const size=Math.min(65536,Math.max(64,parseInt($('sizeInput').value)||1024));
  const s=LANG[currentLang];
  showToast(s.analyzing);

  const data=generateData(source,size);
  const entropy=shannonEntropy(data);
  const chi=chiSquare(data);
  const mc=monteCarloPi(data);
  const sc=serialCorrelation(data);

  state.data=data;
  state.results={source,size,entropy,chi,mc,sc};
  state.phase='analyzed';
  hideToast();

  const grade=entropy>7.9?'Excellent':entropy>7.5?'Good':entropy>6.0?'Fair':'Poor';
  log(`${s.complete}: ${source} entropy=${entropy.toFixed(4)} bits/byte (${grade})`,'success');

  let out=`=== Entropy Analysis: ${source} ===\n`;
  out+=`Sample size: ${size} bytes\n\n`;
  out+=`Shannon Entropy: ${entropy.toFixed(4)} bits/byte (max 8.0)\n`;
  out+=`Quality: ${grade}\n\n`;
  out+=`Chi-Square: ${chi.chi2.toFixed(2)} (df=${chi.df})\n`;
  out+=`  Expected range: ~200-330 for random data\n`;
  out+=`  Verdict: ${chi.chi2>200&&chi.chi2<330?'PASS':'FAIL'}\n\n`;
  out+=`Monte Carlo Pi: ${mc.piEst.toFixed(6)} (true: 3.141593)\n`;
  out+=`  Error: ${mc.errorPct.toFixed(3)}%\n`;
  out+=`  Verdict: ${mc.errorPct<5?'PASS':'FAIL'}\n\n`;
  out+=`Serial Correlation: ${sc.toFixed(6)}\n`;
  out+=`  Verdict: ${Math.abs(sc)<0.05?'PASS (no correlation)':'FAIL (correlated)'}\n`;
  $('resultsBox').textContent=out;
  drawCanvas();
}

function compareAll(){
  const size=Math.min(65536,Math.max(64,parseInt($('sizeInput').value)||1024));
  const sources=['crypto','math','linear','counter'];
  state.comparisons=sources.map(src=>{
    const data=generateData(src,size);
    return{source:src,entropy:shannonEntropy(data),chi:chiSquare(data).chi2,pi:monteCarloPi(data).piEst,sc:serialCorrelation(data),data};
  });
  state.phase='compared';
  const s=LANG[currentLang];
  log(`${s.complete}: compared ${sources.length} sources`,'success');

  let out=`=== Source Comparison (${size} bytes) ===\n\n`;
  out+=`${'Source'.padEnd(20)} ${'Entropy'.padEnd(10)} ${'Chi-Sq'.padEnd(10)} ${'Pi Est'.padEnd(10)} ${'SerCorr'.padEnd(10)}\n`;
  out+='-'.repeat(60)+'\n';
  state.comparisons.forEach(c=>{
    out+=`${c.source.padEnd(20)} ${c.entropy.toFixed(4).padEnd(10)} ${c.chi.toFixed(1).padEnd(10)} ${c.pi.toFixed(4).padEnd(10)} ${c.sc.toFixed(5).padEnd(10)}\n`;
  });
  $('resultsBox').textContent=out;
  drawCanvas();
}

function resetAll(){state={data:null,results:null,comparisons:[],phase:'idle'};$('resultsBox').textContent='';log(LANG[currentLang].resetDone,'info');drawCanvas()}

/* ======= CANVAS ======= */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function drawCanvas(){
  if(!ctx)return;
  const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';
  ctx.fillText('Entropy Analysis',10,22);

  if(state.phase==='idle'){
    ctx.fillStyle=muted;ctx.font='13px Tajawal';ctx.textAlign='center';
    ctx.fillText('Click "Analyze" to begin',w/2,h/2);ctx.textAlign='left';return;
  }

  if(state.phase==='analyzed'&&state.results){
    const r=state.results;
    ctx.fillStyle=muted;ctx.font='11px Tajawal';
    ctx.fillText(`Source: ${r.source} | ${r.size} bytes | Entropy: ${r.entropy.toFixed(4)} bits/byte`,10,38);

    // Byte frequency histogram (top half)
    const histY=50,histH=120,histW=w-20;
    ctx.fillStyle=accent;ctx.font='bold 10px Tajawal';ctx.fillText('Byte Frequency Distribution',10,histY-2);

    const freq=r.chi.freq;
    const maxF=Math.max(...freq,1);
    const barW=histW/256;
    const expected=r.size/256;

    for(let i=0;i<256;i++){
      const bh=(freq[i]/maxF)*histH;
      const deviation=Math.abs(freq[i]-expected)/expected;
      const color=deviation<0.3?'#4ade80':deviation<0.6?'#fbbf24':'#f87171';
      ctx.fillStyle=color+'66';ctx.fillRect(10+i*barW,histY+histH-bh,barW,bh);
    }
    // Expected line
    const ey=histY+histH-(expected/maxF)*histH;
    ctx.strokeStyle='#f8717188';ctx.setLineDash([2,2]);ctx.beginPath();ctx.moveTo(10,ey);ctx.lineTo(10+histW,ey);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#f87171';ctx.font='8px SF Mono';ctx.fillText('expected',histW-40,ey-3);

    // Monte Carlo scatter (bottom half)
    const mcY=histY+histH+30,mcSize=Math.min(180,(h-mcY-40));
    ctx.fillStyle=accent;ctx.font='bold 10px Tajawal';ctx.fillText('Monte Carlo Pi Estimation',10,mcY-4);

    // Circle boundary
    const mcX=10,mcR=mcSize/2;
    ctx.strokeStyle=muted+'44';ctx.strokeRect(mcX,mcY,mcSize,mcSize);
    ctx.strokeStyle='#60a5fa44';ctx.beginPath();ctx.arc(mcX+mcR,mcY+mcR,mcR,0,Math.PI*2);ctx.stroke();

    // Points
    r.mc.points.forEach(p=>{
      const px=mcX+(p.x/255)*mcSize;
      const py=mcY+(p.y/255)*mcSize;
      ctx.fillStyle=p.inside?'#4ade8033':'#f8717133';
      ctx.fillRect(px,py,2,2);
    });

    ctx.fillStyle=muted;ctx.font='10px SF Mono';
    ctx.fillText(`Pi ~ ${r.mc.piEst.toFixed(4)} (err: ${r.mc.errorPct.toFixed(2)}%)`,mcX+mcSize+15,mcY+15);

    // Entropy gauge
    const gaugeX=mcX+mcSize+15,gaugeY=mcY+35,gaugeW=w-gaugeX-20,gaugeH=20;
    ctx.fillStyle='rgba(255,255,255,0.05)';ctx.fillRect(gaugeX,gaugeY,gaugeW,gaugeH);
    const entFill=(r.entropy/8)*gaugeW;
    const entColor=r.entropy>7.9?'#4ade80':r.entropy>7.5?'#fbbf24':'#f87171';
    ctx.fillStyle=entColor+'66';ctx.fillRect(gaugeX,gaugeY,entFill,gaugeH);
    ctx.strokeStyle=entColor;ctx.strokeRect(gaugeX,gaugeY,gaugeW,gaugeH);
    ctx.fillStyle=entColor;ctx.font='bold 10px SF Mono';
    ctx.fillText(`${r.entropy.toFixed(3)}/8.0 bits`,gaugeX+4,gaugeY+14);

    // Chi-square bar
    const chiY=gaugeY+35;
    ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Chi-Square:',gaugeX,chiY);
    const chiNorm=Math.min(1,r.chi.chi2/600);
    const chiBarW=chiNorm*gaugeW;
    const chiColor=r.chi.chi2>200&&r.chi.chi2<330?'#4ade80':'#f87171';
    ctx.fillStyle=chiColor+'44';ctx.fillRect(gaugeX,chiY+5,chiBarW,15);
    ctx.fillStyle=chiColor;ctx.font='9px SF Mono';
    ctx.fillText(`${r.chi.chi2.toFixed(1)} (200-330=good)`,gaugeX+4,chiY+17);

    // Serial correlation
    const scY=chiY+30;
    ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Serial Corr:',gaugeX,scY);
    const scAbs=Math.abs(r.sc);
    const scColor=scAbs<0.05?'#4ade80':scAbs<0.2?'#fbbf24':'#f87171';
    ctx.fillStyle=scColor;ctx.font='bold 10px SF Mono';
    ctx.fillText(`${r.sc.toFixed(5)} ${scAbs<0.05?'(good)':'(bad)'}`,gaugeX+80,scY);
  }

  if(state.phase==='compared'&&state.comparisons.length>0){
    const barH=60,gap=15;
    let y=50;
    const sources=state.comparisons;
    const colors=['#4ade80','#60a5fa','#fbbf24','#f87171'];

    ctx.fillStyle=muted;ctx.font='11px Tajawal';
    ctx.fillText(`Comparing ${sources.length} sources`,10,38);

    sources.forEach((s,i)=>{
      ctx.fillStyle=colors[i]+'22';ctx.fillRect(10,y,w-20,barH);
      ctx.strokeStyle=colors[i]+'66';ctx.strokeRect(10,y,w-20,barH);
      ctx.fillStyle=colors[i];ctx.font='bold 11px Tajawal';
      ctx.fillText(s.source,15,y+14);

      // Entropy bar
      const entW=((s.entropy/8)*(w-200));
      ctx.fillStyle=colors[i]+'44';ctx.fillRect(120,y+5,entW,12);
      ctx.fillStyle=colors[i];ctx.font='9px SF Mono';
      ctx.fillText(`H=${s.entropy.toFixed(3)}`,120+entW+5,y+14);

      // Stats
      ctx.fillStyle=muted;ctx.font='9px SF Mono';
      ctx.fillText(`Chi2=${s.chi.toFixed(1)}  Pi=${s.pi.toFixed(3)}  SC=${s.sc.toFixed(4)}`,15,y+35);

      // Mini frequency sparkline
      if(s.data){
        const freq=new Float64Array(256);
        for(let j=0;j<s.data.length;j++)freq[s.data[j]]++;
        const maxF=Math.max(...freq,1);
        const sparkW=(w-40)/256;
        for(let j=0;j<256;j++){
          const bh=(freq[j]/maxF)*15;
          ctx.fillStyle=colors[i]+'33';
          ctx.fillRect(15+j*sparkW,y+barH-bh-2,sparkW,bh);
        }
      }
      y+=barH+gap;
    });
  }
}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'Shannon Entropy',p:s.wiki_shannon},{t:'Chi-Square',p:s.wiki_chi},{t:'Monte Carlo Pi',p:s.wiki_monte},{t:'Serial Correlation',p:s.wiki_serial}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){const s=LANG[currentLang];$('refCard').innerHTML=[{t:'Shannon Entropy',p:s.wiki_shannon},{t:'Chi-Square',p:s.wiki_chi},{t:'Monte Carlo Pi',p:s.wiki_monte},{t:'Serial Correlation',p:s.wiki_serial}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);
  resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-entropy-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-entropy-theme');if(t)setTheme(t)}catch{}
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

  $('sourceSelect').onchange=e=>{$('customSection').style.display=e.target.value==='custom'?'':'none'};
  $('analyzeBtn').onclick=analyzeData;
  $('compareBtn').onclick=compareAll;
  $('resetBtn').onclick=resetAll;

  buildHelp();buildRef();buildMath();
  log(LANG[currentLang].ready,'success');drawCanvas();
});

/* ═══════ ENHANCED ENTROPY VISUALIZATION (IIFE) ═══════ */
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

// Live entropy data
let _liveData=new Uint8Array(256);
let _source='crypto';

function refreshData(){
  if(_source==='crypto')crypto.getRandomValues(_liveData);
  else if(_source==='math')for(let i=0;i<256;i++)_liveData[i]=Math.floor(Math.random()*256);
  else if(_source==='counter')for(let i=0;i<256;i++)_liveData[i]=(i+_t)&0xFF;
  else{let s=_t;for(let i=0;i<256;i++){s=(s*1103515245+12345)&0x7FFFFFFF;_liveData[i]=(s>>16)&0xFF}}
}

function draw(){
  const w=_c.getBoundingClientRect().width,h=_c.getBoundingClientRect().height;
  const acc=_gc('--accent'),mut=_gc('--text-muted'),txt=_gc('--text');
  _x.clearRect(0,0,w,h);_t++;

  if(_t%10===0)refreshData();

  // === Byte Heatmap (top-left) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Live Byte Stream Heatmap',10,16);

  const hmW=w*0.38,hmH=100,hmX=10,hmY=24;
  const hmCols=16,hmRows=16;
  const hmCellW=hmW/hmCols,hmCellH=hmH/hmRows;
  for(let i=0;i<Math.min(256,hmCols*hmRows);i++){
    const col=i%hmCols,row=Math.floor(i/hmCols);
    const val=_liveData[i];
    const hue=(val/256)*360;
    _x.fillStyle=`hsla(${hue},60%,${30+val/256*40}%,.7)`;
    _x.fillRect(hmX+col*hmCellW,hmY+row*hmCellH,hmCellW-0.5,hmCellH-0.5);
  }
  // Compute live entropy
  const freq=new Float64Array(256);
  for(let i=0;i<_liveData.length;i++)freq[_liveData[i]]++;
  let H=0;for(let i=0;i<256;i++){if(freq[i]>0){const p=freq[i]/_liveData.length;H-=p*Math.log2(p)}}
  _x.fillStyle=H>7.5?'#4ade80':H>6?'#fbbf24':'#f87171';_x.font='bold 9px SF Mono';
  _x.fillText(`Shannon Entropy: ${H.toFixed(4)} / 8.0 bits`,hmX,hmY+hmH+12);

  // === Bit Pattern Visualization (top-middle) ===
  const bpX=w*0.42,bpW=w*0.25,bpY=10;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Bit Patterns',bpX,16);

  const bitRows=16,bitCols=16;
  const bitCW=bpW/bitCols,bitCH=100/bitRows;
  for(let byte=0;byte<Math.min(bitRows,_liveData.length);byte++){
    for(let bit=7;bit>=0;bit--){
      const val=(_liveData[byte]>>bit)&1;
      const x=bpX+(7-bit)*bitCW*2;
      const y=bpY+18+byte*bitCH;
      _x.fillStyle=val?`${acc}66`:'rgba(255,255,255,.03)';
      _x.fillRect(x,y,bitCW*2-0.5,bitCH-0.5);
    }
  }
  _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText('0-bits dark, 1-bits colored',bpX,bpY+126);

  // === Monte Carlo Pi Scatter (top-right) ===
  const mcX=w*0.70,mcW=w*0.28,mcY=10;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Monte Carlo Pi',mcX,16);
  const mcSize=Math.min(mcW,100);
  const mcR=mcSize/2;
  _x.strokeStyle=mut+'44';_x.strokeRect(mcX,mcY+18,mcSize,mcSize);
  _x.strokeStyle='#60a5fa44';_x.beginPath();_x.arc(mcX+mcR,mcY+18+mcR,mcR,0,Math.PI*2);_x.stroke();

  let inside=0;const nPairs=Math.floor(_liveData.length/2);
  for(let i=0;i<nPairs;i++){
    const x=_liveData[i*2],y=_liveData[i*2+1];
    const dx=x-127.5,dy=y-127.5;
    const isIn=dx*dx+dy*dy<=127.5*127.5;
    if(isIn)inside++;
    _x.fillStyle=isIn?'#4ade8044':'#f8717133';
    const px=mcX+(x/255)*mcSize;
    const py=mcY+18+(y/255)*mcSize;
    _x.fillRect(px,py,2,2);
  }
  const piEst=4*inside/nPairs;
  _x.fillStyle=mut;_x.font='9px SF Mono';
  _x.fillText(`Pi ~ ${piEst.toFixed(3)}`,mcX,mcY+mcSize+32);

  // === Entropy Gauge (middle) ===
  const egY=140,egW=w-20,egH=30;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Entropy Quality Gauge',10,egY);
  // Background
  _x.fillStyle='rgba(255,255,255,.04)';_x.fillRect(10,egY+8,egW,egH);
  // Gradient fill
  const grad=_x.createLinearGradient(10,0,10+egW,0);
  grad.addColorStop(0,'#f87171');grad.addColorStop(0.5,'#fbbf24');grad.addColorStop(0.85,'#4ade80');grad.addColorStop(1,'#4ade80');
  _x.fillStyle=grad;_x.fillRect(10,egY+8,(H/8)*egW,egH);
  _x.strokeStyle=acc;_x.strokeRect(10,egY+8,egW,egH);
  // Needle
  const needleX=10+(H/8)*egW;
  _x.fillStyle='#fff';_x.beginPath();_x.moveTo(needleX,egY+6);_x.lineTo(needleX-4,egY+2);_x.lineTo(needleX+4,egY+2);_x.fill();
  // Labels
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('0 (constant)',10,egY+egH+20);_x.fillText('8.0 (perfect)',egW-55,egY+egH+20);
  const grade=H>7.9?'EXCELLENT':H>7.5?'GOOD':H>6?'FAIR':'POOR';
  _x.fillStyle=H>7.5?'#4ade80':H>6?'#fbbf24':'#f87171';
  _x.font='bold 10px SF Mono';_x.textAlign='center';
  _x.fillText(`${H.toFixed(3)} bits/byte (${grade})`,w/2,egY+22);_x.textAlign='left';

  // === Chi-Square Histogram (bottom-left) ===
  const csY=egY+egH+30,csW=w*0.48,csH=h-csY-25;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Byte Frequency (Chi-Square basis)',10,csY);

  const maxFreq=Math.max(...freq,1);
  const expected=_liveData.length/256;
  const barW=csW/256;
  for(let i=0;i<256;i++){
    if(freq[i]>0){
      const barH=(freq[i]/maxFreq)*(csH-15);
      const deviation=Math.abs(freq[i]-expected)/Math.max(expected,1);
      const color=deviation<0.5?'#4ade80':deviation<1?'#fbbf24':'#f87171';
      _x.fillStyle=color+'55';
      _x.fillRect(10+i*barW,csY+8+csH-15-barH,barW,barH);
    }
  }
  // Expected line
  const expY=csY+8+csH-15-(expected/maxFreq)*(csH-15);
  _x.strokeStyle='#f87171';_x.setLineDash([2,2]);
  _x.beginPath();_x.moveTo(10,expY);_x.lineTo(10+csW,expY);_x.stroke();_x.setLineDash([]);
  // Chi2 value
  let chi2=0;for(let i=0;i<256;i++)chi2+=(freq[i]-expected)**2/Math.max(expected,0.01);
  _x.fillStyle=chi2>200&&chi2<330?'#4ade80':'#f87171';_x.font='9px SF Mono';
  _x.fillText(`Chi2 = ${chi2.toFixed(1)} ${chi2>200&&chi2<330?'(PASS)':'(FAIL)'}`,10,csY+csH-2);

  // === Serial Correlation Plot (bottom-right) ===
  const scX=w*0.52,scY=csY,scW=w*0.46,scH=csH;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Serial Correlation (x[i] vs x[i+1])',scX,scY);

  const scPlotSize=Math.min(scW,scH-20);
  _x.strokeStyle=mut+'33';_x.strokeRect(scX,scY+8,scPlotSize,scPlotSize);
  // Diagonal (perfect correlation line)
  _x.strokeStyle='#f87171';_x.setLineDash([3,3]);
  _x.beginPath();_x.moveTo(scX,scY+8+scPlotSize);_x.lineTo(scX+scPlotSize,scY+8);_x.stroke();_x.setLineDash([]);

  for(let i=0;i<_liveData.length-1;i++){
    const x=scX+(_liveData[i]/255)*scPlotSize;
    const y=scY+8+(1-_liveData[i+1]/255)*scPlotSize;
    _x.fillStyle='rgba(96,165,250,.2)';
    _x.fillRect(x,y,2,2);
  }

  // Correlation coefficient
  let sc=0,sum=0,sumSq=0,sumProd=0;
  for(let i=0;i<_liveData.length;i++){sum+=_liveData[i];sumSq+=_liveData[i]*_liveData[i]}
  for(let i=0;i<_liveData.length-1;i++)sumProd+=_liveData[i]*_liveData[i+1];
  const mean=sum/_liveData.length;
  const denom=sumSq-mean*mean*_liveData.length;
  sc=denom===0?1:(sumProd-mean*mean*(_liveData.length-1))/denom;
  _x.fillStyle=Math.abs(sc)<0.1?'#4ade80':'#f87171';_x.font='bold 9px SF Mono';
  _x.fillText(`r = ${sc.toFixed(4)} ${Math.abs(sc)<0.1?'(good)':'(correlated!)'}`,scX+scPlotSize+5,scY+scPlotSize/2);

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
