/**
 * Hash Collision Finder — Workshop DIY v1.0
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas Sim
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
    ...LANG_BASE.en,title:'Hash Collision Finder',subtitle:'Find two inputs producing the same hash digest',mainSection:'Collision Search',mainDesc:'Search for hash collisions in truncated digests',bitsLabel:'Hash Bits (truncated)',bitsHint:'Fewer bits = faster collisions (birthday paradox)',startSearch:'Start Search',stop:'Stop',results:'Results',vizTitle:'Collision Visualization',vizHint:'Watch hash values accumulate until a collision is found',sectionA:'Hash Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',found:'Collision found!',searching:'Searching...',noCollision:'No collision yet',howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Hash Reference" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',wiki_hash:'دالة التجزئة تحول بيانات عشوائية إلى بصمة بحجم ثابت. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_birthday:'مفارقة عيد الميلاد: 23 شخصا يكفي لاحتمال 50% لتشارك يوم ميلاد. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_collision:'مقاومة التصادم: O(2^(n/2)) عملية لتجزئة n بت. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',mathExplain:'Birthday Attack Complexity:\nFor n-bit hash: ~2^(n/2) attempts needed\n\n8 bits:  ~16 attempts\n16 bits: ~256 attempts\n24 bits: ~4096 attempts\n32 bits: ~65536 attempts\n\nP(collision after k attempts) = 1 - Product(1 - i/2^n) for i=0..k-1',step1Title:'Set Up',step1Desc:'Configure the parameters for Hash Collision Finder. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Hash Reference" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Math Deep Dive". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is Hash Collision Finder?',faq_a1:'Hash Collision Finder lets you search for hash collisions in truncated digests. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real cryptography behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real cryptography principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to Hash Collision Finder! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Select the number of hash bits. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Hash Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how cryptography works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32)  # 32 bytes = 256 bits\\niv = os.urandom(16)   # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key:        {key.hex()}")\\nprint(f"IV:         {iv.hex()}")\\nprint(f"Plaintext:  {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered:  {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',wiki_concept_title:'🔬 What is Hash Collision Finder?',wiki_concept:'Hash Collision Finder is a technique used in cryptography. Search for hash collisions in truncated digests. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the parameters for Hash Collision Finder. Choose your input settings using the controls in the main card. Each control directly affects the simulation output. Second: Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs. The simulation runs these stages in real time, showing you intermediate results at each step. In real cryptography, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Hash Collision Finder has practical applications in cryptography. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Hash Collision Finder: Search for hash collisions in truncated digests. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Choose Algorithm through Set Up Attack to Execute Attack and Analyze Results.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Hash Reference" and "Math Deep Dive" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Chercheur de Collisions',subtitle:'Trouvez deux entrees produisant le meme condensat',mainSection:'Recherche de Collision',mainDesc:'Cherchez des collisions dans des condensats tronques',bitsLabel:'Bits de Hash (tronques)',bitsHint:'Moins de bits = collisions plus rapides',startSearch:'Lancer Recherche',stop:'Arreter',results:'Resultats',vizTitle:'Visualisation des Collisions',vizHint:'Regardez les hachages s\'accumuler',sectionA:'Reference Hash',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',found:'Collision trouvee!',searching:'Recherche...',noCollision:'Pas encore de collision',howto_1:'Choisissez le nombre de bits.',howto_2:'Cliquez Lancer.',howto_3:'Regardez le canvas.',howto_4:'Une collision apparait quand deux points se chevauchent.',wiki_hash:'Une fonction de hachage mappe des donnees a un condensat de taille fixe.',wiki_birthday:'Paradoxe des anniversaires: 23 personnes suffisent pour 50% de chance de partager un anniversaire.',wiki_collision:'Resistance aux collisions: O(2^(n/2)) operations pour n bits.',mathExplain:'Complexite attaque anniversaire:\nPour hash n bits: ~2^(n/2) essais\n\n8 bits: ~16 essais\n16 bits: ~256 essais\n24 bits: ~4096 essais',step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule cryptographic attacks ! 🔬 Tu peux expérimenter avec breaking encryption en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Replay Attack Forge and Cry Bleichenbacher Attack ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'كاشف تصادم التجزئة',subtitle:'ابحث عن مدخلين ينتجان نفس البصمة',mainSection:'بحث التصادم',mainDesc:'ابحث عن تصادمات في بصمات مقتطعة',bitsLabel:'بتات التجزئة (مقتطعة)',bitsHint:'بتات أقل = تصادمات أسرع',startSearch:'بدء البحث',stop:'إيقاف',results:'النتائج',vizTitle:'تصور التصادم',vizHint:'شاهد قيم التجزئة تتراكم حتى يحدث تصادم',sectionA:'مرجع التجزئة',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',found:'تم إيجاد تصادم!',searching:'جاري البحث...',noCollision:'لا تصادم بعد',howto_1:'اختر عدد البتات.',howto_2:'اضغط بدء البحث.',howto_3:'شاهد اللوحة.',howto_4:'يظهر التصادم عندما تتداخل نقطتان.',wiki_hash:'دالة التجزئة تحول بيانات عشوائية إلى بصمة بحجم ثابت.',wiki_birthday:'مفارقة عيد الميلاد: 23 شخصا يكفي لاحتمال 50% لتشارك يوم ميلاد.',wiki_collision:'مقاومة التصادم: O(2^(n/2)) عملية لتجزئة n بت.',mathExplain:'تعقيد هجوم عيد الميلاد:\nلتجزئة n بت: ~2^(n/2) محاولة\n\n8 بت: ~16 محاولة\n16 بت: ~256 محاولة\n24 بت: ~4096 محاولة',step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي cryptographic attacks! 🔬 يمكنك التجربة مع breaking encryption في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Replay Attack Forge and Cry Bleichenbacher Attack! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('cry-hash-lang',lang)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('cry-hash-theme',name)}catch{}log(`${LANG[currentLang].themeChanged} ${name}`,'info')}
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=.08;const t=audioCtx.currentTime;if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.3);osc.start(t);osc.stop(t+.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.25)}else{osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.08);osc.start(t);osc.stop(t+.08)}}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(panel,overlay){panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'))}

/* ═══════ SIMPLE HASH (djb2-like, truncatable) ═══════ */
function simpleHash(str,bits){let h=5381;for(let i=0;i<str.length;i++)h=((h<<5)+h+str.charCodeAt(i))>>>0;return h&((1<<bits)-1)}

/* ═══════ CANVAS ═══════ */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
let searching=false,hashMap={},attempts=[],collisionPair=null,animFrame;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawSim(){
  if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),accent2=getCS('--accent2'),text=getCS('--text'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);
  const bits=parseInt($('bitsSelect').value)||16,maxVal=1<<bits;
  // Title
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText(`Hash Collision Search (${bits}-bit)`,10,22);
  ctx.fillStyle=muted;ctx.font='11px Tajawal,sans-serif';ctx.fillText(`Attempts: ${attempts.length} / Expected: ~${Math.ceil(Math.sqrt(maxVal))}`,10,38);
  // Hash space grid
  const cols=Math.ceil(Math.sqrt(maxVal)),cellW=(w-20)/cols,gridY=50,gridH=h-60;
  const cellH=gridH/cols;
  // Draw occupied cells
  const occupied=new Set(attempts.map(a=>a.hash));
  occupied.forEach(hv=>{const gx=hv%cols,gy=Math.floor(hv/cols);
    ctx.fillStyle=`${accent}33`;ctx.fillRect(10+gx*cellW,gridY+gy*cellH,Math.max(cellW-.5,1),Math.max(cellH-.5,1))});
  // Draw recent attempts as dots
  const recent=attempts.slice(-200);
  recent.forEach((a,i)=>{const gx=a.hash%cols,gy=Math.floor(a.hash/cols);
    const alpha=.3+.7*(i/recent.length);ctx.fillStyle=a.collision?'#f87171':`rgba(74,222,128,${alpha})`;
    ctx.beginPath();ctx.arc(10+gx*cellW+cellW/2,gridY+gy*cellH+cellH/2,Math.max(2,cellW/3),0,Math.PI*2);ctx.fill()});
  // Collision highlight
  if(collisionPair){const gx=collisionPair.hash%cols,gy=Math.floor(collisionPair.hash/cols);
    ctx.strokeStyle='#f87171';ctx.lineWidth=3;ctx.beginPath();ctx.arc(10+gx*cellW+cellW/2,gridY+gy*cellH+cellH/2,Math.max(8,cellW),0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#f87171';ctx.font='bold 12px Tajawal';ctx.fillText('COLLISION!',10+gx*cellW+cellW+5,gridY+gy*cellH+cellH/2+4)}
  // Progress bar
  const progress=Math.min(1,attempts.length/Math.sqrt(maxVal));
  ctx.fillStyle=`${accent}22`;ctx.fillRect(10,h-12,w-20,8);
  ctx.fillStyle=accent;ctx.fillRect(10,h-12,progress*(w-20),8);
  if(searching)animFrame=requestAnimationFrame(drawSim)
}

function startSearch(){
  const bits=parseInt($('bitsSelect').value);hashMap={};attempts=[];collisionPair=null;searching=true;
  const s=LANG[currentLang];log(s.searching,'info');showToast(s.searching);$('resultsBox').textContent='';resizeCanvas();drawSim();
  let count=0;
  function step(){
    if(!searching)return;
    const batch=100;
    for(let i=0;i<batch;i++){count++;const input=`msg_${count}_${Math.random().toString(36).slice(2)}`;
      const h=simpleHash(input,bits);const entry={input,hash:h,collision:false};
      if(hashMap[h]!==undefined){entry.collision=true;collisionPair={hash:h,input1:hashMap[h],input2:input};
        attempts.push(entry);searching=false;hideToast();drawSim();
        const out=`${s.found}\n\nInput 1: "${collisionPair.input1}"\nInput 2: "${collisionPair.input2}"\nHash: 0x${h.toString(16).padStart(bits/4,'0')} (${h})\n\nAttempts: ${count}\nExpected (birthday): ~${Math.ceil(Math.sqrt(1<<bits))}`;
        $('resultsBox').textContent=out;log(`${s.found} after ${count} attempts`,'success');return}
      hashMap[h]=input;attempts.push(entry)}
    setTimeout(step,0)}
  setTimeout(step,0)}
function stopSearch(){searching=false;hideToast();if(animFrame)cancelAnimationFrame(animFrame);log('Search stopped','info')}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'Hash Functions',p:s.wiki_hash},{t:'Birthday Paradox',p:s.wiki_birthday},{t:'Collision Resistance',p:s.wiki_collision}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=`<div class="wiki-entry"><h3>Hash Functions</h3><p>${LANG[currentLang].wiki_hash}</p></div><div class="wiki-entry"><h3>Birthday Paradox</h3><p>${LANG[currentLang].wiki_birthday}</p></div><div class="wiki-entry"><h3>Collision Resistance</h3><p>${LANG[currentLang].wiki_collision}</p></div>`}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',resizeCanvas);
  try{const l=localStorage.getItem('cry-hash-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-hash-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};
  $('copyLogBtn').onclick=async()=>{const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})}});
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);$(id).classList.add('active')}});
  $('searchBtn').onclick=startSearch;$('stopBtn').onclick=stopSearch;
  buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawSim()
});

/* ═══════ ENHANCED HASH COLLISION VISUALIZATION (IIFE) ═══════ */
(function(){
const _c=document.createElement('canvas');
_c.style.cssText='width:100%;height:340px;border-radius:12px;margin-top:12px;display:block;background:rgba(0,0,0,.12)';
const vizS=document.querySelector('.visualization-section')||document.querySelector('.card');
if(vizS)vizS.appendChild(_c);
const _x=_c.getContext('2d');
let _t=0,_hashGrid=[],_avalanche=[];

function _rs(){const r=_c.getBoundingClientRect();_c.width=r.width*devicePixelRatio;_c.height=r.height*devicePixelRatio;_x.scale(devicePixelRatio,devicePixelRatio)}
window.addEventListener('resize',_rs);_rs();

// Build hash distribution grid
function buildGrid(){
  _hashGrid=[];
  for(let i=0;i<32;i++){
    const row=[];
    for(let j=0;j<32;j++){
      const v=simpleHash(`cell_${i}_${j}_${Math.random()}`,16);
      row.push({val:v,occ:0,age:0});
    }
    _hashGrid.push(row);
  }
}
buildGrid();

// Avalanche effect data: flip 1 bit, see how many output bits change
function genAvalanche(){
  _avalanche=[];
  for(let bit=0;bit<8;bit++){
    const original=`test_message_${_t}`;
    const h1=simpleHash(original,16);
    const modified=String.fromCharCode(original.charCodeAt(0)^(1<<bit))+original.slice(1);
    const h2=simpleHash(modified,16);
    const diff=h1^h2;
    let flipped=0;for(let b=0;b<16;b++)if(diff&(1<<b))flipped++;
    _avalanche.push({inputBit:bit,h1,h2,diff,flipped,ratio:flipped/16});
  }
}

function _gc(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function draw(){
  const w=_c.getBoundingClientRect().width,h=_c.getBoundingClientRect().height;
  const acc=_gc('--accent'),mut=_gc('--text-muted'),txt=_gc('--text');
  _x.clearRect(0,0,w,h);_t++;

  // === Hash Distribution Grid (top-left) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Hash Output Distribution (16-bit)',10,16);
  const gW=w*0.45,gH=130,gX=10,gY=24;
  const cellW=gW/32,cellH=gH/32;

  // Simulate hashing: drop a new value each frame
  const newHash=simpleHash(`msg_${_t}_${Math.random().toString(36)}`,16);
  const gi=newHash%32,gj=Math.floor(newHash/32)%32;
  if(_hashGrid[gi]&&_hashGrid[gi][gj]){_hashGrid[gi][gj].occ++;_hashGrid[gi][gj].age=_t}

  for(let i=0;i<32;i++){
    for(let j=0;j<32;j++){
      const cell=_hashGrid[i][j];
      const intensity=Math.min(1,cell.occ/10);
      const fresh=(_t-cell.age)<30?0.5:0;
      _x.fillStyle=`rgba(74,222,128,${intensity*0.6+fresh})`;
      _x.fillRect(gX+j*cellW,gY+i*cellH,cellW-0.5,cellH-0.5);
    }
  }
  // Highlight newest
  _x.strokeStyle='#f87171';_x.lineWidth=2;
  _x.strokeRect(gX+gj*cellW-1,gY+gi*cellH-1,cellW+2,cellH+2);
  _x.fillStyle=mut;_x.font='9px SF Mono';
  _x.fillText(`Hash: 0x${newHash.toString(16).padStart(4,'0')}  Bucket [${gi},${gj}]`,gX,gY+gH+12);

  // === Avalanche Effect (top-right) ===
  const avX=w*0.52,avY=6;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Avalanche Effect (1-bit input change)',avX,16);

  if(_t%30===0)genAvalanche();
  const avW=w*0.46,avH=130;
  if(_avalanche.length>0){
    const barW=avW/8;
    _avalanche.forEach((a,i)=>{
      const x=avX+i*barW;
      const barH=a.ratio*avH*0.8;
      const color=a.ratio>0.4?'#4ade80':a.ratio>0.2?'#fbbf24':'#f87171';
      _x.fillStyle=color+'44';_x.fillRect(x+2,avY+18+avH-barH,barW-4,barH);
      _x.fillStyle=color;_x.font='bold 9px SF Mono';
      _x.textAlign='center';
      _x.fillText(`${a.flipped}/16`,x+barW/2,avY+18+avH-barH-4);
      _x.fillStyle=mut;_x.font='8px SF Mono';
      _x.fillText(`bit ${a.inputBit}`,x+barW/2,avY+avH+22);
      _x.textAlign='left';
    });
    // Ideal line (50%)
    const idealY=avY+18+avH-0.5*avH*0.8;
    _x.strokeStyle='#f87171';_x.setLineDash([3,3]);
    _x.beginPath();_x.moveTo(avX,idealY);_x.lineTo(avX+avW,idealY);_x.stroke();
    _x.setLineDash([]);
    _x.fillStyle='#f87171';_x.font='8px SF Mono';_x.fillText('ideal 50%',avX+avW-45,idealY-3);
  }

  // === Birthday Probability Curve (bottom-left) ===
  const bpX=10,bpY=gY+gH+26,bpW=w*0.45,bpH=h-bpY-25;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('P(collision) vs attempts (birthday bound)',bpX,bpY);
  _x.strokeStyle=mut+'44';_x.beginPath();
  _x.moveTo(bpX+25,bpY+8);_x.lineTo(bpX+25,bpY+bpH);_x.lineTo(bpX+bpW,bpY+bpH);_x.stroke();

  const bits=parseInt(document.getElementById('bitsSelect').value)||16;
  const N=1<<bits;
  const maxK=Math.min(N,Math.ceil(3*Math.sqrt(N)));
  _x.strokeStyle='#60a5fa';_x.lineWidth=2;_x.beginPath();
  for(let k=1;k<=Math.min(maxK,400);k++){
    const prob=1-Math.exp(-k*(k-1)/(2*N));
    const px=bpX+25+(k/maxK)*(bpW-30);
    const py=bpY+bpH-prob*(bpH-12);
    if(k===1)_x.moveTo(px,py);else _x.lineTo(px,py);
  }
  _x.stroke();_x.lineWidth=1;

  // 50% line
  const halfY=bpY+bpH-0.5*(bpH-12);
  _x.strokeStyle='#fbbf24';_x.setLineDash([4,4]);
  _x.beginPath();_x.moveTo(bpX+25,halfY);_x.lineTo(bpX+bpW,halfY);_x.stroke();_x.setLineDash([]);
  _x.fillStyle='#fbbf24';_x.font='8px SF Mono';_x.fillText('50%',bpX+2,halfY+3);

  // Birthday bound marker
  const bbK=Math.round(1.177*Math.sqrt(N));
  const bbX=bpX+25+(bbK/maxK)*(bpW-30);
  _x.strokeStyle='#f87171';_x.setLineDash([2,2]);
  _x.beginPath();_x.moveTo(bbX,bpY+8);_x.lineTo(bbX,bpY+bpH);_x.stroke();_x.setLineDash([]);
  _x.fillStyle='#f87171';_x.font='8px SF Mono';_x.fillText(`~${bbK}`,bbX-10,bpY+bpH+10);

  // === Hash Internals Animation (bottom-right) ===
  const hiX=w*0.52,hiY=bpY,hiW=w*0.46,hiH=bpH;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Hash Compression (Merkle-Damgard steps)',hiX,hiY);

  const nBlocks=6;
  const bkW=hiW/(nBlocks+1);
  const bkH=30;
  const bkY=hiY+15;
  let state=0x5381;
  for(let i=0;i<nBlocks;i++){
    const x=hiX+i*bkW;
    // Block
    _x.fillStyle=`${acc}22`;_x.fillRect(x+2,bkY,bkW-8,bkH);
    _x.strokeStyle=`${acc}66`;_x.strokeRect(x+2,bkY,bkW-8,bkH);
    // Arrow
    if(i<nBlocks-1){
      _x.strokeStyle=acc;_x.beginPath();_x.moveTo(x+bkW-6,bkY+bkH/2);_x.lineTo(x+bkW+2,bkY+bkH/2);_x.stroke();
      _x.fillStyle=acc;_x.beginPath();_x.moveTo(x+bkW+2,bkY+bkH/2);_x.lineTo(x+bkW-4,bkY+bkH/2-4);_x.lineTo(x+bkW-4,bkY+bkH/2+4);_x.fill();
    }
    // State value (animated)
    const animState=((state<<5)+state+(_t+i*37))>>>0;
    state=animState;
    const displayH=(animState&0xFFFF).toString(16).padStart(4,'0');
    _x.fillStyle=acc;_x.font='bold 8px SF Mono';_x.textAlign='center';
    _x.fillText(`0x${displayH}`,x+bkW/2-2,bkY+bkH/2+3);
    _x.textAlign='left';

    // Block label
    _x.fillStyle=mut;_x.font='7px Tajawal';_x.textAlign='center';
    _x.fillText(i===0?'IV':`B${i}`,x+bkW/2-2,bkY-3);
    _x.textAlign='left';
  }

  // XOR / compression visual
  const compY=bkY+bkH+15;
  for(let i=0;i<16;i++){
    const bx=hiX+i*(hiW/16);
    const bit=(state>>(15-i))&1;
    const flip=Math.sin(_t*0.05+i*0.5)>0?1:0;
    _x.fillStyle=bit?`${acc}88`:'rgba(255,255,255,.05)';
    _x.fillRect(bx,compY,hiW/16-1,12);
    if(flip!==bit){
      _x.fillStyle='#f87171';_x.font='bold 8px SF Mono';_x.textAlign='center';
      _x.fillText(bit.toString(),bx+hiW/32,compY+10);_x.textAlign='left';
    }
  }
  _x.fillStyle=mut;_x.font='9px Tajawal';
  _x.fillText('Internal state bits (XOR cascade)',hiX,compY+25);

  // Collision counter animation
  const ccY=compY+35;
  const progress=(_t%200)/200;
  _x.fillStyle='rgba(255,255,255,.04)';_x.fillRect(hiX,ccY,hiW,16);
  _x.fillStyle=progress>0.8?'#f87171':'#4ade80';
  _x.fillRect(hiX,ccY,progress*hiW,16);
  _x.fillStyle=txt;_x.font='9px SF Mono';
  _x.fillText(`Search progress: ${Math.floor(progress*100)}%  (${Math.floor(progress*Math.sqrt(N))} / ~${Math.ceil(Math.sqrt(N))} birthday bound)`,hiX+4,ccY+12);

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
