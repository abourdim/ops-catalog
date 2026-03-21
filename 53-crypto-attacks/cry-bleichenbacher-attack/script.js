/**
 * Bleichenbacher Attack — Workshop DIY v1.0
 * RSA PKCS#1 v1.5 Padding Oracle Simulation
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
    title:'Bleichenbacher Attack',subtitle:'RSA PKCS#1 v1.5 padding oracle million-message attack',
    mainSection:'Padding Oracle Lab',mainDesc:'Simulate PKCS#1 v1.5 padding oracle to decrypt RSA ciphertext',
    keyLabel:'RSA Key Size (bits)',keyHint:'Simulated small key for demonstration',
    msgLabel:'Plaintext Message',msgHint:'Message to encrypt and then attack',
    setupKeys:'Setup Keys',startAttack:'Start Attack',stop:'Stop',reset:'Reset',results:'Results',
    vizTitle:'Attack Visualization',vizHint:'Watch interval narrowing as padding oracle reveals plaintext',
    sectionA:'Attack Reference',sectionB:'PKCS#1 Deep Dive',
    settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',
    langChanged:'Language -> English',themeChanged:'Theme ->',
    keysReady:'RSA keys generated',attacking:'Running Bleichenbacher attack...',
    decrypted:'Plaintext recovered!',stopped:'Attack stopped',resetDone:'Reset complete',
    oracleQuery:'Oracle query',conforming:'PKCS conforming!',nonConforming:'Non-conforming',
    intervalNarrowed:'Interval narrowed',
    howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Attack Reference" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_padding:'PKCS#1 v1.5: EB = 00 || 02 || PS || 00 || M. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_oracle:'الاوراكل: الخادم يكشف ما اذا كان الحشو صالحا. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    wiki_intervals:'تضييق المجال: كل نص مطابق يضيق المجال [a,b]. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',
    mathExplain:'Bleichenbacher Attack Steps:\n1. Given ciphertext c = m^e mod N\n2. Choose random s, compute c\' = c * s^e mod N\n3. Server decrypts: (c\')^d = m*s mod N\n4. If result has valid PKCS#1 padding -> oracle says YES\n5. Each YES response constrains m to interval [a,b]\n6. Iterate with different s values to narrow [a,b]\n7. When a=b, plaintext m is recovered\n\nPKCS#1 v1.5 format (k-byte key):\n00 02 [PS >= 8 random bytes] 00 [message]\nValid range: 2*B <= m < 3*B where B = 2^(8*(k-2))'
  ,step1Title:'Set Up',step1Desc:'Configure the parameters for Bleichenbacher Attack. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Attack Reference" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "PKCS#1 Deep Dive". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is Bleichenbacher Attack?',faq_a1:'Bleichenbacher Attack lets you simulate pkcs#1 v1.5 padding oracle to decrypt rsa ciphertext. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you select the cryptographic algorithm and key parameters to analyze. Then you configure the attack parameters: known plaintext, side-channel data, or timing.',faq_q3:'What do the controls do?',faq_a3:'Click Setup Keys to generate RSA parameters. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'PKCS#1 v1.5: EB = 00 || 02 || PS || 00 || M',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to Bleichenbacher Attack! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Click Setup Keys to generate RSA parameters. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Attack Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how cryptography works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32)  # 32 bytes = 256 bits\\niv = os.urandom(16)   # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key:        {key.hex()}")\\nprint(f"IV:         {iv.hex()}")\\nprint(f"Plaintext:  {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered:  {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',purpose:'Bleichenbacher Attack: Simulate PKCS#1 v1.5 padding oracle to decrypt RSA ciphertext. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Choose Algorithm through Set Up Attack to Execute Attack and Analyze Results.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Attack Reference" and "PKCS#1 Deep Dive" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{
    title:'Attaque de Bleichenbacher',subtitle:'Attaque oracle de remplissage RSA PKCS#1 v1.5',
    mainSection:'Labo Oracle de Remplissage',mainDesc:'Simulez l\'oracle de remplissage PKCS#1 v1.5 pour dechiffrer un texte RSA',
    keyLabel:'Taille de Cle RSA (bits)',keyHint:'Petite cle simulee pour demonstration',
    msgLabel:'Message en Clair',msgHint:'Message a chiffrer puis attaquer',
    setupKeys:'Generer Cles',startAttack:'Lancer l\'Attaque',stop:'Arreter',reset:'Reinitialiser',results:'Resultats',
    vizTitle:'Visualisation de l\'Attaque',vizHint:'Regardez l\'intervalle se retrecir',
    sectionA:'Reference d\'Attaque',sectionB:'PKCS#1 en Profondeur',
    settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',
    langChanged:'Langue -> Francais',themeChanged:'Theme ->',
    keysReady:'Cles RSA generees',attacking:'Attaque Bleichenbacher en cours...',
    decrypted:'Message recupere!',stopped:'Attaque arretee',resetDone:'Reinitialisation complete',
    oracleQuery:'Requete oracle',conforming:'Remplissage conforme!',nonConforming:'Non conforme',
    intervalNarrowed:'Intervalle retreci',
    howto_1:'Cliquez Generer Cles.',howto_2:'Entrez un court message.',howto_3:'Cliquez Lancer l\'Attaque.',howto_4:'Regardez la convergence de l\'intervalle.',
    wiki_padding:'PKCS#1 v1.5: EB = 00 || 02 || PS || 00 || M',
    wiki_oracle:'Oracle: Le serveur revele si le remplissage est valide apres dechiffrement.',
    wiki_intervals:'Retrecissement: Chaque texte conforme retrecit l\'intervalle [a,b].',
    mathExplain:'Etapes de l\'attaque Bleichenbacher:\n1. Texte chiffre c = m^e mod N\n2. Choisir s, calculer c\' = c * s^e mod N\n3. Le serveur dechiffre et verifie le remplissage\n4. Chaque reponse positive retrecit l\'intervalle\n5. Quand a=b, le message est recupere'
  ,step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule cryptographic attacks ! 🔬 Tu peux expérimenter avec breaking encryption en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Rsa Factoring Race and Cry Replay Attack Forge ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{
    title:'هجوم بلايخنباخر',subtitle:'هجوم اوراكل حشو RSA PKCS#1 v1.5 بمليون رسالة',
    mainSection:'مختبر اوراكل الحشو',mainDesc:'محاكاة اوراكل حشو PKCS#1 v1.5 لفك تشفير نص RSA',
    keyLabel:'حجم مفتاح RSA (بت)',keyHint:'مفتاح صغير للتوضيح',
    msgLabel:'الرسالة الاصلية',msgHint:'رسالة للتشفير ثم الهجوم',
    setupKeys:'توليد المفاتيح',startAttack:'بدء الهجوم',stop:'ايقاف',reset:'اعادة تعيين',results:'النتائج',
    vizTitle:'تصور الهجوم',vizHint:'شاهد تضيق المجال كلما كشف الاوراكل النص الاصلي',
    sectionA:'مرجع الهجوم',sectionB:'تعمق في PKCS#1',
    settings:'الاعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',
    help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',
    langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',
    keysReady:'تم توليد مفاتيح RSA',attacking:'تشغيل هجوم بلايخنباخر...',
    decrypted:'تم استعادة النص الاصلي!',stopped:'تم ايقاف الهجوم',resetDone:'تمت اعادة التعيين',
    oracleQuery:'استعلام اوراكل',conforming:'حشو مطابق!',nonConforming:'غير مطابق',
    intervalNarrowed:'تم تضييق المجال',
    howto_1:'انقر توليد المفاتيح.',howto_2:'ادخل رسالة قصيرة.',howto_3:'انقر بدء الهجوم.',howto_4:'شاهد تقارب المجال.',
    wiki_padding:'PKCS#1 v1.5: EB = 00 || 02 || PS || 00 || M',
    wiki_oracle:'الاوراكل: الخادم يكشف ما اذا كان الحشو صالحا.',
    wiki_intervals:'تضييق المجال: كل نص مطابق يضيق المجال [a,b].',
    mathExplain:'خطوات هجوم بلايخنباخر:\n1. النص المشفر c = m^e mod N\n2. اختر s واحسب c\' = c * s^e mod N\n3. الخادم يفك التشفير ويتحقق من الحشو\n4. كل اجابة ايجابية تضيق المجال\n5. عندما a=b يتم استعادة الرسالة'
  ,step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي cryptographic attacks! 🔬 يمكنك التجربة مع breaking encryption في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Rsa Factoring Race and Cry Replay Attack Forge! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';

function setLanguage(lang){
  currentLang=lang;const s=LANG[lang];if(!s)return;
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;
  const sel=$('langSelect');if(sel)sel.value=lang;
  try{localStorage.setItem('cry-bleich-lang',lang)}catch{}
  log(s.langChanged,'info');buildHelp();buildRef();buildMath();
}

const LIGHT_THEMES=['riad','medina'];
function setTheme(name){
  document.documentElement.dataset.theme=name;
  document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));
  const sel=$('themeSelect');if(sel)sel.value=name;
  try{localStorage.setItem('cry-bleich-theme',name)}catch{}
  log(`${LANG[currentLang].themeChanged} ${name}`,'info');
}

let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){
  if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();
  const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
  osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=.08;const t=audioCtx.currentTime;
  if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.08);osc.start(t);osc.stop(t+.08)}
  else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.3);osc.start(t);osc.stop(t+.3)}
  else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.25)}
}

let logContainer;
function log(msg,type='info'){
  if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;
  const d=document.createElement('div');d.className=`log-line ${type}`;
  d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;
  if(type==='success')playSound('success');else if(type==='error')playSound('error');
}

function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}

let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function togglePanel(panel,overlay){panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'))}

/* ======= TINY RSA + PKCS SIMULATION ======= */
function modPow(base,exp,mod){
  let result=1n;base=((base%mod)+mod)%mod;
  while(exp>0n){if(exp%2n===1n)result=result*base%mod;exp/=2n;base=base*base%mod}
  return result;
}
function gcd(a,b){while(b>0n){[a,b]=[b,a%b]}return a}
function modInverse(a,m){let[old_r,r]=[a,m],[old_s,s]=[1n,0n];while(r!==0n){const q=old_r/r;[old_r,r]=[r,old_r-q*r];[old_s,s]=[s,old_s-q*s]}return((old_s%m)+m)%m}
function isPrime(n){if(n<2n)return false;if(n<4n)return true;if(n%2n===0n||n%3n===0n)return false;for(let i=5n;i*i<=n;i+=6n)if(n%i===0n||n%(i+2n)===0n)return false;return true}
function randomPrime(bits){const min=1n<<BigInt(bits-1),max=(1n<<BigInt(bits))-1n;let p;do{p=min+BigInt(Math.floor(Math.random()*Number(max-min)))}while(!isPrime(p));return p}

let rsaKeys=null,ciphertext=null,plainNum=null;
let attackState={running:false,queries:0,intervals:[],history:[],sValue:1n,phase:'idle'};

function setupKeys(){
  const bits=parseInt($('keySizeSelect').value);
  const halfBits=Math.max(4,bits>>1);
  let p,q;
  do{p=randomPrime(halfBits);q=randomPrime(halfBits)}while(p===q);
  const N=p*q,phi=(p-1n)*(q-1n);
  let e=65537n;if(gcd(e,phi)!==1n)e=3n;
  const d=modInverse(e,phi);
  rsaKeys={p,q,N,e,d,bits};

  // PKCS#1 v1.5 encode message
  const msg=$('msgInput').value||'Hi';
  const kBytes=Math.ceil(bits/8);
  const msgBytes=[];for(let i=0;i<msg.length;i++)msgBytes.push(msg.charCodeAt(i));
  // 00 02 [PS] 00 [M]
  const psLen=Math.max(1,kBytes-3-msgBytes.length);
  const encoded=[0,2];
  for(let i=0;i<psLen;i++)encoded.push(1+Math.floor(Math.random()*254));
  encoded.push(0);
  encoded.push(...msgBytes);
  while(encoded.length<kBytes)encoded.unshift(0);

  plainNum=encoded.reduce((a,b)=>a*256n+BigInt(b),0n);
  ciphertext=modPow(plainNum,e,N);

  attackState={running:false,queries:0,intervals:[{a:2n*(1n<<BigInt(8*(kBytes-2))),b:3n*(1n<<BigInt(8*(kBytes-2)))-1n}],history:[],sValue:1n,phase:'setup'};

  const s=LANG[currentLang];
  log(`${s.keysReady}: N=${N} (${bits}-bit), e=${e}`,'success');
  let out=`RSA Setup Complete\n`;
  out+=`N = ${N}\ne = ${e}\nd = ${d}\np = ${p}, q = ${q}\n\n`;
  out+=`Message: "${msg}"\nEncoded (PKCS): ${encoded.map(b=>b.toString(16).padStart(2,'0')).join(' ')}\n`;
  out+=`Plaintext number: ${plainNum}\nCiphertext: ${ciphertext}\n`;
  $('resultsBox').textContent=out;
  drawCanvas();
}

function paddingOracle(c){
  // Decrypt and check if starts with 00 02
  const m=modPow(c,rsaKeys.d,rsaKeys.N);
  const kBytes=Math.ceil(rsaKeys.bits/8);
  const bytes=[];let tmp=m;
  for(let i=0;i<kBytes;i++){bytes.unshift(Number(tmp&0xFFn));tmp>>=8n}
  return bytes[0]===0&&bytes[1]===2;
}

function startAttack(){
  if(!rsaKeys||!ciphertext){log('Setup keys first','error');return}
  const s=LANG[currentLang];
  attackState.running=true;attackState.phase='attacking';attackState.queries=0;
  attackState.sValue=rsaKeys.N/(3n*(1n<<BigInt(8*(Math.ceil(rsaKeys.bits/8)-2))));
  if(attackState.sValue<1n)attackState.sValue=1n;
  showToast(s.attacking);log(s.attacking,'info');

  function step(){
    if(!attackState.running)return;

    // Search for s where c*s^e mod N has valid padding
    let found=false;
    const batchSize=100;
    for(let i=0;i<batchSize&&!found;i++){
      attackState.sValue++;
      const cs=ciphertext*modPow(attackState.sValue,rsaKeys.e,rsaKeys.N)%rsaKeys.N;
      attackState.queries++;
      if(paddingOracle(cs)){
        found=true;
        // Narrow intervals
        const kBytes=Math.ceil(rsaKeys.bits/8);
        const B=1n<<BigInt(8*(kBytes-2));
        const newIntervals=[];
        for(const iv of attackState.intervals){
          const rMin=(iv.a*attackState.sValue-3n*B+rsaKeys.N)/(rsaKeys.N);
          const rMax=(iv.b*attackState.sValue-2n*B)/(rsaKeys.N);
          for(let r=rMin;r<=rMax;r++){
            const lo=(2n*B+r*rsaKeys.N+attackState.sValue-1n)/attackState.sValue;
            const hi=(3n*B-1n+r*rsaKeys.N)/attackState.sValue;
            const a=lo>iv.a?lo:iv.a;const b=hi<iv.b?hi:iv.b;
            if(a<=b)newIntervals.push({a,b});
          }
        }
        if(newIntervals.length>0)attackState.intervals=newIntervals;
        attackState.history.push({s:attackState.sValue,q:attackState.queries,intervals:newIntervals.length,
          width:attackState.intervals.length>0?Number(attackState.intervals[0].b-attackState.intervals[0].a):0});
        log(`${s.conforming} s=${attackState.sValue} (query #${attackState.queries}, intervals: ${newIntervals.length})`,'success');
      }
    }

    if(!found){
      log(`${s.oracleQuery} #${attackState.queries}: ${s.nonConforming} (batch of ${batchSize})`,'info');
    }

    // Check convergence
    if(attackState.intervals.length===1&&attackState.intervals[0].a===attackState.intervals[0].b){
      attackState.running=false;attackState.phase='done';hideToast();
      const recovered=attackState.intervals[0].a;
      const kBytes=Math.ceil(rsaKeys.bits/8);
      const bytes=[];let tmp=recovered;
      for(let i=0;i<kBytes;i++){bytes.unshift(Number(tmp&0xFFn));tmp>>=8n}
      const sepIdx=bytes.indexOf(0,2);
      const msgBytes=sepIdx>=0?bytes.slice(sepIdx+1):[];
      const msgStr=msgBytes.map(b=>String.fromCharCode(b)).join('');
      log(`${s.decrypted} "${msgStr}" after ${attackState.queries} queries`,'success');
      $('resultsBox').textContent+=`\n\n=== ATTACK RESULT ===\nRecovered plaintext: "${msgStr}"\nOracle queries: ${attackState.queries}\nFinal interval: [${attackState.intervals[0].a}]`;
      drawCanvas();return;
    }

    drawCanvas();
    if(attackState.running)setTimeout(step,10);
  }
  step();
}

function stopAttack(){attackState.running=false;hideToast();log(LANG[currentLang].stopped,'info')}
function resetAll(){
  rsaKeys=null;ciphertext=null;plainNum=null;
  attackState={running:false,queries:0,intervals:[],history:[],sValue:1n,phase:'idle'};
  $('resultsBox').textContent='';log(LANG[currentLang].resetDone,'info');drawCanvas();
}

/* ======= CANVAS ======= */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function drawCanvas(){
  if(!ctx)return;
  const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),accent2=getCS('--accent2'),text=getCS('--text'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);

  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';
  ctx.fillText('Bleichenbacher PKCS#1 v1.5 Oracle',10,22);

  if(!rsaKeys){
    ctx.fillStyle=muted;ctx.font='13px Tajawal';ctx.textAlign='center';
    ctx.fillText('Click "Setup Keys" to begin',w/2,h/2);ctx.textAlign='left';return;
  }

  ctx.fillStyle=muted;ctx.font='11px Tajawal';
  ctx.fillText(`N=${rsaKeys.N} | Queries: ${attackState.queries} | Intervals: ${attackState.intervals.length}`,10,38);

  // Draw PKCS padding structure
  const boxY=50,boxH=40;
  const parts=[{label:'00',w:30,color:'#f87171'},{label:'02',w:30,color:'#fbbf24'},{label:'PS (random)',w:120,color:'#60a5fa'},{label:'00',w:30,color:'#f87171'},{label:'Message',w:100,color:'#4ade80'}];
  let px=10;
  parts.forEach(p=>{
    ctx.fillStyle=p.color+'33';ctx.fillRect(px,boxY,p.w,boxH);
    ctx.strokeStyle=p.color;ctx.lineWidth=1;ctx.strokeRect(px,boxY,p.w,boxH);
    ctx.fillStyle=p.color;ctx.font='bold 10px SF Mono';ctx.textAlign='center';
    ctx.fillText(p.label,px+p.w/2,boxY+boxH/2+4);ctx.textAlign='left';
    px+=p.w+2;
  });

  // Draw interval visualization
  const ivY=boxY+boxH+30;
  ctx.fillStyle=accent;ctx.font='bold 11px Tajawal';
  ctx.fillText('Plaintext Search Interval:',10,ivY);

  if(attackState.intervals.length>0){
    const kBytes=Math.ceil(rsaKeys.bits/8);
    const B=1n<<BigInt(8*(kBytes-2));
    const totalRange=Number(3n*B-2n*B);
    const barY=ivY+10,barH=30,barW=w-20;

    // Full range background
    ctx.fillStyle='rgba(255,255,255,0.05)';ctx.fillRect(10,barY,barW,barH);
    ctx.strokeStyle=muted+'44';ctx.strokeRect(10,barY,barW,barH);

    // Current intervals
    attackState.intervals.forEach(iv=>{
      const aOff=Number(iv.a-2n*B);const bOff=Number(iv.b-2n*B);
      const x1=10+(aOff/totalRange)*barW;
      const x2=10+(bOff/totalRange)*barW;
      ctx.fillStyle='#4ade8044';ctx.fillRect(x1,barY,Math.max(2,x2-x1),barH);
      ctx.strokeStyle='#4ade80';ctx.strokeRect(x1,barY,Math.max(2,x2-x1),barH);
    });

    // True plaintext marker
    if(plainNum){
      const pOff=Number(plainNum-2n*B);
      const px=10+(pOff/totalRange)*barW;
      ctx.fillStyle='#f87171';ctx.beginPath();ctx.moveTo(px,barY-8);ctx.lineTo(px-5,barY-2);ctx.lineTo(px+5,barY-2);ctx.fill();
      ctx.fillStyle='#f87171';ctx.font='9px SF Mono';ctx.fillText('m',px-3,barY-10);
    }

    ctx.fillStyle=muted;ctx.font='9px SF Mono';
    ctx.fillText('2B',10,barY+barH+12);ctx.fillText('3B-1',barW-20,barY+barH+12);
  }

  // History chart
  if(attackState.history.length>1){
    const chartY=ivY+80,chartH=h-chartY-30,chartW=w-40;
    ctx.fillStyle=accent;ctx.font='bold 11px Tajawal';
    ctx.fillText('Interval Width vs Oracle Queries:',10,chartY-5);

    const maxW=Math.max(...attackState.history.map(h=>h.width),1);
    ctx.strokeStyle=muted+'44';ctx.beginPath();ctx.moveTo(20,chartY);ctx.lineTo(20,chartY+chartH);ctx.lineTo(20+chartW,chartY+chartH);ctx.stroke();

    ctx.strokeStyle='#4ade80';ctx.lineWidth=2;ctx.beginPath();
    attackState.history.forEach((h,i)=>{
      const x=20+i/(attackState.history.length-1)*chartW;
      const y=chartY+chartH-(h.width/maxW)*chartH;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });
    ctx.stroke();ctx.lineWidth=1;

    ctx.fillStyle=muted;ctx.font='9px SF Mono';
    ctx.fillText('Queries',20+chartW/2,chartY+chartH+14);
    ctx.save();ctx.translate(12,chartY+chartH/2);ctx.rotate(-Math.PI/2);ctx.fillText('Width',0,0);ctx.restore();
  }

  if(attackState.phase==='done'){
    ctx.fillStyle='#4ade8044';ctx.fillRect(0,h-35,w,35);
    ctx.fillStyle='#4ade80';ctx.font='bold 14px Righteous';ctx.textAlign='center';
    ctx.fillText('PLAINTEXT RECOVERED!',w/2,h-12);ctx.textAlign='left';
  }
}

/* ======= BUILD ======= */
function buildHelp(){
  const s=LANG[currentLang];
  $('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');
  $('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');
  $('helpWiki').innerHTML=[{t:'PKCS#1 v1.5 Padding',p:s.wiki_padding},{t:'Padding Oracle',p:s.wiki_oracle},{t:'Interval Narrowing',p:s.wiki_intervals}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('');
}
function buildRef(){
  const s=LANG[currentLang];
  $('refCard').innerHTML=[{t:'PKCS#1 v1.5 Padding',p:s.wiki_padding},{t:'Padding Oracle',p:s.wiki_oracle},{t:'Interval Narrowing',p:s.wiki_intervals}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('');
}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

/* ======= INIT ======= */
document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);
  resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-bleich-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-bleich-theme');if(t)setTheme(t)}catch{}

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

  $('setupBtn').onclick=setupKeys;
  $('attackBtn').onclick=startAttack;
  $('stopBtn').onclick=stopAttack;
  $('resetBtn').onclick=resetAll;

  buildHelp();buildRef();buildMath();
  log(LANG[currentLang].ready,'success');drawCanvas();
});

/* ═══════ ENHANCED BLEICHENBACHER VISUALIZATION (IIFE) ═══════ */
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

  // === PKCS#1 v1.5 Padding Detail (top) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('PKCS#1 v1.5 Encryption Block (k bytes)',10,16);

  const kBytes=16;// simplified
  const cellW=Math.min(30,(w-20)/kBytes);
  const padLen=kBytes-3-4;// 4 byte message
  for(let i=0;i<kBytes;i++){
    const x=10+i*cellW;
    let color,label;
    if(i===0){color='#f87171';label='00'}
    else if(i===1){color='#fbbf24';label='02'}
    else if(i<2+padLen){color='#60a5fa';label=((Math.random()*254+1)|0).toString(16).padStart(2,'0')}
    else if(i===2+padLen){color='#f87171';label='00'}
    else{color='#4ade80';label=String.fromCharCode(0x41+i-2-padLen-1)}

    _x.fillStyle=color+'33';_x.fillRect(x,24,cellW-2,30);
    _x.strokeStyle=color+'66';_x.strokeRect(x,24,cellW-2,30);
    _x.fillStyle=color;_x.font='bold 7px SF Mono';_x.textAlign='center';
    _x.fillText(label,x+cellW/2-1,40);
    _x.textAlign='left';
  }
  // Bracket labels
  _x.fillStyle=mut;_x.font='8px Tajawal';
  _x.fillText('00 02',10,62);_x.fillText('PS (random, >= 8 bytes)',10+3*cellW,62);
  _x.fillText('00',10+(2+padLen)*cellW,62);_x.fillText('Message',10+(3+padLen)*cellW,62);

  // === Oracle Response Model (middle-left) ===
  const orY=75,orW=w*0.45;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Padding Oracle Decision',10,orY);

  const responses=[
    {test:'Starts with 00 02?',result:_t%3!==0,y:0},
    {test:'PS length >= 8?',result:_t%5!==0,y:1},
    {test:'Separator 00 found?',result:_t%4!==0,y:2}
  ];
  responses.forEach((r,i)=>{
    const y=orY+12+i*22;
    _x.fillStyle=r.result?'#4ade8033':'#f8717133';
    _x.fillRect(10,y,orW,20);
    _x.fillStyle=r.result?'#4ade80':'#f87171';_x.font='9px SF Mono';
    _x.fillText(`${r.test} ${r.result?'YES':'NO'}`,14,y+14);
    _x.fillStyle=r.result?'#4ade80':'#f87171';
    _x.beginPath();_x.arc(orW-5,y+10,5,0,Math.PI*2);_x.fill();
  });
  const allPass=responses.every(r=>r.result);
  _x.fillStyle=allPass?'#4ade80':'#f87171';_x.font='bold 10px SF Mono';
  _x.fillText(allPass?'PKCS CONFORMING':'NON-CONFORMING',10,orY+80);

  // === Interval Narrowing Animation (middle-right) ===
  const inX=w*0.52,inY=orY;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Interval Narrowing Over Queries',inX,inY);

  const inW=w*0.46,inH=80;
  const nSteps=12;
  for(let i=0;i<nSteps;i++){
    const y=inY+10+i*(inH/nSteps);
    const shrink=Math.pow(0.7,i);
    const center=0.5+Math.sin(i*0.8)*0.1;
    const lo=Math.max(0,center-shrink/2);
    const hi=Math.min(1,center+shrink/2);
    const isActive=i<=(_t%nSteps);
    _x.fillStyle=isActive?'#4ade8022':'rgba(255,255,255,.02)';
    _x.fillRect(inX+lo*inW,y,Math.max(2,(hi-lo)*inW),inH/nSteps-2);
    _x.strokeStyle=isActive?'#4ade80':mut+'22';
    _x.strokeRect(inX+lo*inW,y,Math.max(2,(hi-lo)*inW),inH/nSteps-2);
    if(isActive){
      _x.fillStyle=mut;_x.font='6px SF Mono';
      _x.fillText(`q${i+1}`,inX-14,y+inH/nSteps/2+2);
    }
  }
  // Plaintext marker
  const pmX=inX+0.48*inW;
  _x.strokeStyle='#f87171';_x.setLineDash([2,2]);
  _x.beginPath();_x.moveTo(pmX,inY+10);_x.lineTo(pmX,inY+inH+8);_x.stroke();
  _x.setLineDash([]);
  _x.fillStyle='#f87171';_x.font='bold 7px SF Mono';_x.fillText('m',pmX-3,inY+inH+16);

  // === Multiplier Search (bottom-left) ===
  const msY=orY+95,msW=w*0.48,msH=h-msY-55;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Adaptive Multiplier Search: c\'= c * s^e mod N',10,msY);

  const sVals=30;
  const sBarW=msW/sVals;
  for(let i=0;i<sVals;i++){
    const isConforming=(i+_t)%7===0;
    const barH=Math.random()*msH*0.7+5;
    _x.fillStyle=isConforming?'#4ade8066':'#60a5fa22';
    _x.fillRect(10+i*sBarW,msY+10+msH-barH,sBarW-2,barH);
    if(isConforming){
      _x.fillStyle='#4ade80';_x.font='bold 7px SF Mono';_x.textAlign='center';
      _x.fillText('!',10+i*sBarW+sBarW/2,msY+10+msH-barH-3);_x.textAlign='left';
    }
  }
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('Green = PKCS conforming (oracle says YES)',10,msY+msH+16);

  // === RSA Homomorphic Property (bottom-right) ===
  const rpX=w*0.52,rpY=msY;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('RSA Malleability (homomorphic)',rpX,rpY);

  const formulas=[
    {text:'c = m^e mod N',color:'#60a5fa'},
    {text:"c' = c * s^e mod N",color:'#fbbf24'},
    {text:"(c')^d = (c * s^e)^d mod N",color:'#c084fc'},
    {text:"      = c^d * (s^e)^d mod N",color:'#c084fc'},
    {text:'      = m * s mod N',color:'#f87171'},
    {text:'',color:mut},
    {text:'If m*s has valid padding:',color:mut},
    {text:'  2B <= m*s < 3B',color:'#4ade80'},
    {text:'  => m in [2B/s, 3B/s]',color:'#4ade80'}
  ];

  formulas.forEach((f,i)=>{
    const y=rpY+14+i*14;
    const isActive=Math.floor(_t/30)%formulas.length===i;
    if(isActive&&f.text){
      _x.fillStyle=f.color+'22';_x.fillRect(rpX,y-2,w*0.46,13);
    }
    _x.fillStyle=f.color;_x.font='9px SF Mono';
    _x.fillText(f.text,rpX+4,y+8);
  });

  // === Attack Progress Indicator (bottom) ===
  const apY=h-35;
  const progress=(_t%300)/300;
  _x.fillStyle='rgba(255,255,255,.04)';_x.fillRect(10,apY,w-20,20);
  const color=progress<0.3?'#f87171':progress<0.7?'#fbbf24':'#4ade80';
  _x.fillStyle=color+'44';_x.fillRect(10,apY,progress*(w-20),20);
  _x.strokeStyle=color;_x.strokeRect(10,apY,w-20,20);
  _x.fillStyle=txt;_x.font='bold 9px SF Mono';_x.textAlign='center';
  _x.fillText(`Oracle Queries: ~${Math.floor(progress*1000000)} / 1,000,000  (${Math.floor(progress*100)}%)`,w/2,apY+14);
  _x.textAlign='left';

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
