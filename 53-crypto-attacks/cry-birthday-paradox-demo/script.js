/**
 * Birthday Paradox Demo — Workshop DIY v1.0
 * Hash Collision Visualization
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
    title:'Birthday Paradox Demo',subtitle:'How the birthday paradox makes hash collisions surprisingly easy',
    mainSection:'Birthday Collision Finder',mainDesc:'Generate random hashes and find collisions using the birthday bound',
    hashBitsLabel:'Hash Output Size (bits)',hashBitsHint:'Smaller = faster collisions. Birthday bound ~ sqrt(2^n) = 2^(n/2)',
    trialsLabel:'Simulation Trials',trialsHint:'Number of experiments to average',
    findCollision:'Find Collision',runSim:'Run Simulation',showProb:'Show Probability',reset:'Reset',results:'Results',
    vizTitle:'Collision Visualization',vizHint:'Watch hash values fill buckets until a collision occurs',
    sectionA:'Attack Reference',sectionB:'Math Deep Dive',
    settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',
    langChanged:'Language -> English',themeChanged:'Theme ->',
    collisionFound:'Collision found!',simComplete:'Simulation complete',resetDone:'Reset complete',
    howto_1:'Choose hash output size in bits.',howto_2:'Click Find Collision to see a single collision search.',howto_3:'Click Run Simulation for averaged statistics.',howto_4:'Click Show Probability for the theoretical curve.',
    wiki_birthday:'Birthday Bound: P(collision) = 1 - product((N-i)/N, i=0..k-1) where N=2^n, k=number of hashes.',
    wiki_attack:'Birthday Attack: Generate 2^(n/2) random messages, hash each, store in table. Find two messages with same hash.',
    wiki_defense:'Defense: Use hash with enough bits. SHA-256 has 128-bit collision resistance. MD5/SHA-1 are broken.',
    mathExplain:'Birthday Paradox Mathematics:\n\nP(no collision after k items from N buckets):\nP = product(1 - i/N, i=0..k-1)\n  ~ exp(-k*(k-1)/(2N))\n\nP(collision) ~ 1 - exp(-k^2/(2N))\n\nFor 50% probability: k ~ sqrt(2*N*ln2) ~ 1.177*sqrt(N)\n\nHash function implications:\n- n-bit hash: N = 2^n buckets\n- Birthday bound: k ~ 2^(n/2)\n\nExamples:\n- MD5 (128 bits): ~2^64 hashes for collision\n- SHA-1 (160 bits): ~2^80 hashes\n- SHA-256 (256 bits): ~2^128 hashes'
  ,step1Title:'Choose Algorithm',step1Desc:'Select the cryptographic algorithm and key parameters to analyze.',step2Title:'Set Up Attack',step2Desc:'Configure the attack parameters: known plaintext, side-channel data, or timing.',step3Title:'Execute Attack',step3Desc:'Run the cryptographic attack and attempt to recover the secret key.',step4Title:'Analyze Results',step4Desc:'Evaluate attack success rate and understand the vulnerability exploited.',sectionCode:'Device Code',faq_q1:'What is Birthday Paradox Demo?',faq_a1:'Birthday Paradox Demo lets you generate random hashes and find collisions using the birthday bound. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you select the cryptographic algorithm and key parameters to analyze. Then you configure the attack parameters: known plaintext, side-channel data, or timing.',faq_q3:'What do the controls do?',faq_a3:'Choose hash output size in bits. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'حد عيد الميلاد: احتمال التصادم يزداد بسرعة مع عدد الهاشات.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Bleichenbacher Attack. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to Birthday Paradox Demo! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Choose hash output size in bits. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Attack Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how cryptography works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32)  # 32 bytes = 256 bits\\niv = os.urandom(16)   # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key:        {key.hex()}")\\nprint(f"IV:         {iv.hex()}")\\nprint(f"Plaintext:  {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered:  {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Attack Reference" and "Math Deep Dive" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{
    title:'Demo Paradoxe des Anniversaires',subtitle:'Comment le paradoxe des anniversaires facilite les collisions de hachage',
    mainSection:'Chercheur de Collisions',mainDesc:'Generez des hachages aleatoires et trouvez des collisions',
    hashBitsLabel:'Taille du Hachage (bits)',hashBitsHint:'Plus petit = collisions plus rapides',
    trialsLabel:'Essais de Simulation',trialsHint:'Nombre d\'experiences a moyenner',
    findCollision:'Trouver Collision',runSim:'Lancer Simulation',showProb:'Afficher Probabilite',reset:'Reinitialiser',results:'Resultats',
    vizTitle:'Visualisation des Collisions',vizHint:'Regardez les valeurs de hachage remplir les seaux',
    sectionA:'Reference d\'Attaque',sectionB:'Maths en Profondeur',
    settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',
    langChanged:'Langue -> Francais',themeChanged:'Theme ->',
    collisionFound:'Collision trouvee!',simComplete:'Simulation terminee',resetDone:'Reinitialisation complete',
    howto_1:'Choisissez la taille du hachage.',howto_2:'Cliquez Trouver Collision.',howto_3:'Lancez la simulation pour des statistiques.',howto_4:'Affichez la courbe theorique.',
    wiki_birthday:'Borne Anniversaire: P(collision) augmente rapidement avec le nombre de hachages.',
    wiki_attack:'Attaque: Generer 2^(n/2) messages, hasher, trouver doublon.',
    wiki_defense:'Defense: Utiliser un hachage avec assez de bits. SHA-256 a 128 bits de resistance.',
    mathExplain:'Mathematiques du Paradoxe des Anniversaires:\n\nP(pas de collision) ~ exp(-k^2/(2N))\nPour 50%: k ~ 1.177*sqrt(N)\n\nHachage n bits: collision apres ~2^(n/2) hachages'
  ,step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule cryptographic attacks ! 🔬 Tu peux expérimenter avec breaking encryption en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Timing Oracle Attack and Cry Replay Attack Forge ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{
    title:'عرض مفارقة عيد الميلاد',subtitle:'كيف تجعل مفارقة عيد الميلاد تصادمات الهاش اسهل مما يتوقع',
    mainSection:'باحث تصادمات عيد الميلاد',mainDesc:'ولد هاشات عشوائية واعثر على تصادمات باستخدام حد عيد الميلاد',
    hashBitsLabel:'حجم خرج الهاش (بت)',hashBitsHint:'اصغر = تصادمات اسرع',
    trialsLabel:'تجارب المحاكاة',trialsHint:'عدد التجارب للمتوسط',
    findCollision:'ايجاد تصادم',runSim:'تشغيل المحاكاة',showProb:'عرض الاحتمال',reset:'اعادة تعيين',results:'النتائج',
    vizTitle:'تصور التصادمات',vizHint:'شاهد قيم الهاش تملا الحاويات حتى يحدث تصادم',
    sectionA:'مرجع الهجوم',sectionB:'تعمق رياضي',
    settings:'الاعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',
    help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',
    langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',
    collisionFound:'تم ايجاد تصادم!',simComplete:'اكتملت المحاكاة',resetDone:'تمت اعادة التعيين',
    howto_1:'اختر حجم الهاش.',howto_2:'انقر ايجاد تصادم.',howto_3:'شغل المحاكاة للاحصائيات.',howto_4:'اعرض المنحنى النظري.',
    wiki_birthday:'حد عيد الميلاد: احتمال التصادم يزداد بسرعة مع عدد الهاشات.',
    wiki_attack:'الهجوم: ولد 2^(n/2) رسالة واحسب الهاش واعثر على تكرار.',
    wiki_defense:'الدفاع: استخدم هاش بعدد كاف من البتات.',
    mathExplain:'رياضيات مفارقة عيد الميلاد:\n\nP(بدون تصادم) ~ exp(-k^2/(2N))\nلاحتمال 50%: k ~ 1.177*sqrt(N)\n\nهاش n بت: تصادم بعد ~2^(n/2) هاش'
  ,step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي cryptographic attacks! 🔬 يمكنك التجربة مع breaking encryption في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Timing Oracle Attack and Cry Replay Attack Forge! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('cry-bday-lang',lang)}catch{};log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('cry-bday-theme',name)}catch{};log(`${LANG[currentLang].themeChanged} ${name}`,'info')}

let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.08);osc.start(t);osc.stop(t+.08)}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.3);osc.start(t);osc.stop(t+.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.25)}}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function togglePanel(panel,overlay){panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'))}

/* ======= MINI HASH (simulated) ======= */
function miniHash(input,bits){
  // Simple hash: mix input through multiply-XOR-shift
  let h=0x811c9dc5;
  const str=String(input);
  for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,0x01000193)}
  return(h>>>0)&((1<<bits)-1);
}

let state={hashes:[],collision:null,simResults:[],probCurve:[],phase:'idle'};

function findCollision(){
  const bits=parseInt($('hashBitsSelect').value);
  const N=1<<bits;
  const seen=new Map();
  let count=0;
  state.hashes=[];state.collision=null;

  while(count<N*10){
    const input=`msg_${count}_${Math.random().toString(36).slice(2,8)}`;
    const h=miniHash(input,bits);
    count++;
    state.hashes.push({input,hash:h,collision:false});

    if(seen.has(h)){
      state.collision={input1:seen.get(h),input2:input,hash:h,count};
      state.hashes[state.hashes.length-1].collision=true;
      break;
    }
    seen.set(h,input);
  }

  const s=LANG[currentLang];
  const expected=Math.round(1.177*Math.sqrt(N));
  if(state.collision){
    log(`${s.collisionFound} hash=0x${state.collision.hash.toString(16)} after ${state.collision.count} hashes (expected ~${expected})`,'success');
    let out=`=== Collision Found ===\n`;
    out+=`Hash bits: ${bits}, Space: 2^${bits} = ${N}\n`;
    out+=`Birthday bound: ~${expected} hashes\n`;
    out+=`Actual: ${state.collision.count} hashes\n\n`;
    out+=`Input 1: "${state.collision.input1}"\n`;
    out+=`Input 2: "${state.collision.input2}"\n`;
    out+=`Hash: 0x${state.collision.hash.toString(16).padStart(bits/4,'0')}\n`;
    out+=`\nRatio: ${(state.collision.count/expected).toFixed(2)}x birthday bound`;
    $('resultsBox').textContent=out;
  }
  state.phase='found';
  drawCanvas();
}

function runSimulation(){
  const bits=parseInt($('hashBitsSelect').value);
  const N=1<<bits;
  const trials=Math.min(500,parseInt($('trialsInput').value)||50);
  const results=[];

  for(let t=0;t<trials;t++){
    const seen=new Set();let count=0;
    while(count<N*10){
      const h=Math.floor(Math.random()*N);count++;
      if(seen.has(h)){results.push(count);break}
      seen.add(h);
    }
  }
  state.simResults=results;
  const avg=results.reduce((a,b)=>a+b,0)/results.length;
  const min=Math.min(...results),max=Math.max(...results);
  const expected=1.177*Math.sqrt(N);
  const s=LANG[currentLang];
  log(`${s.simComplete}: avg=${avg.toFixed(1)} over ${trials} trials (expected ~${expected.toFixed(1)})`,'success');
  let out=`=== Simulation Results ===\n`;
  out+=`Hash bits: ${bits}, Space: 2^${bits} = ${N}\n`;
  out+=`Trials: ${trials}\n`;
  out+=`Birthday bound: ~${expected.toFixed(1)}\n`;
  out+=`Average collisions at: ${avg.toFixed(1)} hashes\n`;
  out+=`Min: ${min}, Max: ${max}\n`;
  out+=`Ratio: ${(avg/expected).toFixed(2)}x birthday bound`;
  $('resultsBox').textContent=out;
  state.phase='sim';drawCanvas();
}

function showProbability(){
  const bits=parseInt($('hashBitsSelect').value);
  const N=1<<bits;
  state.probCurve=[];
  for(let k=1;k<=Math.min(N,500);k++){
    // P(collision) ~ 1 - exp(-k*(k-1)/(2*N))
    const p=1-Math.exp(-k*(k-1)/(2*N));
    state.probCurve.push({k,p});
  }
  const s=LANG[currentLang];
  const halfPoint=state.probCurve.find(p=>p.p>=0.5);
  let out=`=== Probability Curve ===\n`;
  out+=`Hash bits: ${bits}, Space: 2^${bits} = ${N}\n`;
  out+=`50% collision at: ~${halfPoint?halfPoint.k:'?'} hashes\n`;
  out+=`Birthday bound: ~${Math.round(1.177*Math.sqrt(N))}\n`;
  out+=`99% collision at: ~${state.probCurve.find(p=>p.p>=0.99)?.k||'>'} hashes`;
  $('resultsBox').textContent=out;
  state.phase='prob';drawCanvas();
}

function resetAll(){state={hashes:[],collision:null,simResults:[],probCurve:[],phase:'idle'};$('resultsBox').textContent='';log(LANG[currentLang].resetDone,'info');drawCanvas()}

/* ======= CANVAS ======= */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function drawCanvas(){
  if(!ctx)return;
  const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),muted=getCS('--text-muted'),text=getCS('--text');
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';
  ctx.fillText('Birthday Paradox',10,22);

  if(state.phase==='idle'){
    ctx.fillStyle=muted;ctx.font='13px Tajawal';ctx.textAlign='center';
    ctx.fillText('Click a button to begin',w/2,h/2);ctx.textAlign='left';return;
  }

  if(state.phase==='found'&&state.hashes.length>0){
    const bits=parseInt($('hashBitsSelect').value);
    const N=1<<bits;
    ctx.fillStyle=muted;ctx.font='11px Tajawal';
    ctx.fillText(`${bits}-bit hash | ${state.hashes.length} hashes generated | Space: ${N}`,10,38);

    // Hash bucket visualization
    const bucketCount=Math.min(N,200);
    const bucketW=Math.max(2,(w-20)/bucketCount);
    const bucketArea={x:10,y:55,w:w-20,h:120};
    const buckets=new Uint16Array(bucketCount);
    state.hashes.forEach(h=>{const b=Math.floor(h.hash/N*bucketCount);if(b<bucketCount)buckets[b]++});
    const maxB=Math.max(...buckets,1);

    for(let i=0;i<bucketCount;i++){
      const x=bucketArea.x+i*bucketW;
      const bh=(buckets[i]/maxB)*bucketArea.h;
      const isCollision=state.collision&&Math.floor(state.collision.hash/N*bucketCount)===i;
      ctx.fillStyle=isCollision?'#f87171':buckets[i]>1?'#fbbf24':'#60a5fa44';
      ctx.fillRect(x,bucketArea.y+bucketArea.h-bh,bucketW-1,bh);
    }
    ctx.strokeStyle=muted+'44';ctx.strokeRect(bucketArea.x,bucketArea.y,bucketArea.w,bucketArea.h);

    if(state.collision){
      ctx.fillStyle='#f87171';ctx.font='bold 12px Tajawal';
      ctx.fillText(`Collision at hash 0x${state.collision.hash.toString(16)} after ${state.collision.count} hashes`,10,bucketArea.y+bucketArea.h+20);
    }

    // Cumulative hash count chart
    const chartY=bucketArea.y+bucketArea.h+35,chartH=h-chartY-30;
    if(chartH>50){
      ctx.fillStyle=accent;ctx.font='bold 11px Tajawal';ctx.fillText('Hash count over time:',10,chartY);
      const maxK=state.hashes.length;
      ctx.strokeStyle='#4ade8088';ctx.lineWidth=2;ctx.beginPath();
      const step=Math.max(1,Math.floor(maxK/300));
      for(let i=0;i<maxK;i+=step){
        const x=10+(i/maxK)*(w-20);
        const y=chartY+14+(1-i/maxK)*chartH;
        if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.stroke();ctx.lineWidth=1;
      // Birthday bound marker
      const expected=1.177*Math.sqrt(N);
      if(expected<maxK){
        const bx=10+(expected/maxK)*(w-20);
        ctx.strokeStyle='#fbbf24';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(bx,chartY+14);ctx.lineTo(bx,chartY+14+chartH);ctx.stroke();ctx.setLineDash([]);
        ctx.fillStyle='#fbbf24';ctx.font='9px SF Mono';ctx.fillText('birthday bound',bx+4,chartY+24);
      }
    }
  }

  if(state.phase==='sim'&&state.simResults.length>0){
    const bits=parseInt($('hashBitsSelect').value);const N=1<<bits;
    ctx.fillStyle=muted;ctx.font='11px Tajawal';
    ctx.fillText(`${bits}-bit hash | ${state.simResults.length} trials`,10,38);

    // Histogram of collision counts
    const min=Math.min(...state.simResults),max=Math.max(...state.simResults);
    const binCount=Math.min(50,max-min+1);
    const binW=(max-min+1)/binCount;
    const bins=new Float64Array(binCount);
    state.simResults.forEach(r=>{const b=Math.min(binCount-1,Math.floor((r-min)/binW));bins[b]++});
    const maxBin=Math.max(...bins,1);

    const chartArea={x:30,y:55,w:w-50,h:h-110};
    const barW=chartArea.w/binCount;
    for(let i=0;i<binCount;i++){
      const bh=(bins[i]/maxBin)*chartArea.h;
      ctx.fillStyle='#60a5fa44';ctx.fillRect(chartArea.x+i*barW,chartArea.y+chartArea.h-bh,barW-1,bh);
    }
    ctx.strokeStyle=muted+'44';ctx.beginPath();ctx.moveTo(chartArea.x,chartArea.y+chartArea.h);ctx.lineTo(chartArea.x+chartArea.w,chartArea.y+chartArea.h);ctx.stroke();

    // Birthday bound marker
    const expected=1.177*Math.sqrt(N);
    const bx=chartArea.x+((expected-min)/(max-min+1))*chartArea.w;
    ctx.strokeStyle='#f87171';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(bx,chartArea.y);ctx.lineTo(bx,chartArea.y+chartArea.h);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#f87171';ctx.font='bold 10px SF Mono';ctx.fillText(`E[k]=${expected.toFixed(0)}`,bx+4,chartArea.y+12);

    // Average marker
    const avg=state.simResults.reduce((a,b)=>a+b,0)/state.simResults.length;
    const ax=chartArea.x+((avg-min)/(max-min+1))*chartArea.w;
    ctx.strokeStyle='#4ade80';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(ax,chartArea.y);ctx.lineTo(ax,chartArea.y+chartArea.h);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#4ade80';ctx.font='bold 10px SF Mono';ctx.fillText(`avg=${avg.toFixed(0)}`,ax+4,chartArea.y+24);

    ctx.fillStyle=muted;ctx.font='9px SF Mono';
    ctx.fillText(`${min}`,chartArea.x,chartArea.y+chartArea.h+14);
    ctx.textAlign='right';ctx.fillText(`${max}`,chartArea.x+chartArea.w,chartArea.y+chartArea.h+14);ctx.textAlign='left';
  }

  if(state.phase==='prob'&&state.probCurve.length>0){
    ctx.fillStyle=muted;ctx.font='11px Tajawal';
    ctx.fillText(`Collision probability vs number of hashes`,10,38);

    const chartArea={x:40,y:55,w:w-60,h:h-100};
    // Axes
    ctx.strokeStyle=muted+'66';ctx.beginPath();ctx.moveTo(chartArea.x,chartArea.y);ctx.lineTo(chartArea.x,chartArea.y+chartArea.h);ctx.lineTo(chartArea.x+chartArea.w,chartArea.y+chartArea.h);ctx.stroke();

    // Curve
    ctx.strokeStyle='#60a5fa';ctx.lineWidth=2;ctx.beginPath();
    state.probCurve.forEach((p,i)=>{
      const x=chartArea.x+(i/state.probCurve.length)*chartArea.w;
      const y=chartArea.y+chartArea.h-p.p*chartArea.h;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });
    ctx.stroke();ctx.lineWidth=1;

    // 50% line
    const halfY=chartArea.y+chartArea.h*0.5;
    ctx.strokeStyle='#fbbf24';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(chartArea.x,halfY);ctx.lineTo(chartArea.x+chartArea.w,halfY);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#fbbf24';ctx.font='10px SF Mono';ctx.fillText('50%',chartArea.x-30,halfY+4);

    // Labels
    ctx.fillStyle=muted;ctx.font='9px SF Mono';
    ctx.fillText('0',chartArea.x-12,chartArea.y+chartArea.h+4);
    ctx.fillText('1.0',chartArea.x-28,chartArea.y+8);
    ctx.fillText(`k (hashes)`,chartArea.x+chartArea.w/2-20,chartArea.y+chartArea.h+16);
    ctx.fillText(`${state.probCurve.length}`,chartArea.x+chartArea.w-10,chartArea.y+chartArea.h+14);
  }
}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'Birthday Bound',p:s.wiki_birthday},{t:'Birthday Attack',p:s.wiki_attack},{t:'Defense',p:s.wiki_defense}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){const s=LANG[currentLang];$('refCard').innerHTML=[{t:'Birthday Bound',p:s.wiki_birthday},{t:'Birthday Attack',p:s.wiki_attack},{t:'Defense',p:s.wiki_defense}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);
  resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-bday-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-bday-theme');if(t)setTheme(t)}catch{}
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

  $('findBtn').onclick=findCollision;
  $('simBtn').onclick=runSimulation;
  $('probBtn').onclick=showProbability;
  $('resetBtn').onclick=resetAll;

  buildHelp();buildRef();buildMath();
  log(LANG[currentLang].ready,'success');drawCanvas();
});

/* ═══════ ENHANCED BIRTHDAY PARADOX VISUALIZATION (IIFE) ═══════ */
(function(){
const _c=document.createElement('canvas');
_c.style.cssText='width:100%;height:340px;border-radius:12px;margin-top:12px;display:block;background:rgba(0,0,0,.12)';
const vizS=document.querySelector('.visualization-section')||document.querySelector('.card');
if(vizS)vizS.appendChild(_c);
const _x=_c.getContext('2d');
let _t=0,_people=[],_collisionT=-1;

function _rs(){const r=_c.getBoundingClientRect();_c.width=r.width*devicePixelRatio;_c.height=r.height*devicePixelRatio;_x.scale(devicePixelRatio,devicePixelRatio)}
window.addEventListener('resize',_rs);_rs();
function _gc(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

// Birthday simulation: 365-day calendar
function resetSim(){_people=[];_collisionT=-1}
resetSim();

function draw(){
  const w=_c.getBoundingClientRect().width,h=_c.getBoundingClientRect().height;
  const acc=_gc('--accent'),mut=_gc('--text-muted'),txt=_gc('--text');
  _x.clearRect(0,0,w,h);_t++;

  // === Calendar Birthday Grid (top-left) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Birthday Calendar (365 days)',10,16);

  const calW=w*0.48,calH=130,calX=10,calY=24;
  const cols=31,rows=12;
  const cellW=calW/cols,cellH=calH/rows;

  // Add a new person every few frames
  if(_t%8===0&&_collisionT<0){
    const bday=Math.floor(Math.random()*365);
    const existing=_people.find(p=>p.bday===bday);
    _people.push({bday,collision:!!existing,id:_people.length});
    if(existing)_collisionT=_t;
  }

  // Draw calendar grid
  const dayCounts=new Array(365).fill(0);
  _people.forEach(p=>dayCounts[p.bday]++);

  for(let month=0;month<12;month++){
    for(let day=0;day<31;day++){
      const dayOfYear=month*30+day;
      if(dayOfYear>=365)continue;
      const x=calX+day*cellW,y=calY+month*cellH;
      const count=dayCounts[dayOfYear];
      if(count>=2){
        _x.fillStyle='#f8717166';_x.fillRect(x,y,cellW-0.5,cellH-0.5);
      }else if(count===1){
        _x.fillStyle=`${acc}44`;_x.fillRect(x,y,cellW-0.5,cellH-0.5);
      }else{
        _x.fillStyle='rgba(255,255,255,.02)';_x.fillRect(x,y,cellW-0.5,cellH-0.5);
      }
    }
  }

  // Stats
  _x.fillStyle=mut;_x.font='9px SF Mono';
  _x.fillText(`People: ${_people.length} / 365 days`,calX,calY+calH+12);
  if(_collisionT>0){
    _x.fillStyle='#f87171';_x.font='bold 9px SF Mono';
    _x.fillText(`Collision at person #${_people.findIndex(p=>p.collision)+1}! (Expected ~23)`,calX+130,calY+calH+12);
  }

  // Reset after finding collision and showing for a bit
  if(_collisionT>0&&_t-_collisionT>120)resetSim();

  // === Probability Theory (top-right) ===
  const ptX=w*0.52,ptY=10,ptW=w*0.46,ptH=130;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Collision Probability Theory',ptX,16);

  // Draw P(collision) for different N values
  const Ns=[{n:365,label:'365 (birthday)',color:'#4ade80'},{n:256,label:'256 (8-bit hash)',color:'#60a5fa'},{n:65536,label:'65536 (16-bit)',color:'#fbbf24'}];

  _x.strokeStyle=mut+'44';_x.beginPath();
  _x.moveTo(ptX+25,ptY+18);_x.lineTo(ptX+25,ptY+ptH);_x.lineTo(ptX+ptW,ptY+ptH);_x.stroke();

  Ns.forEach(ns=>{
    _x.strokeStyle=ns.color;_x.lineWidth=1.5;_x.beginPath();
    const maxK=Math.min(Math.ceil(3*Math.sqrt(ns.n)),300);
    for(let k=1;k<=maxK;k++){
      const prob=1-Math.exp(-k*(k-1)/(2*ns.n));
      const px=ptX+25+(k/maxK)*(ptW-30);
      const py=ptY+ptH-prob*(ptH-22);
      if(k===1)_x.moveTo(px,py);else _x.lineTo(px,py);
    }
    _x.stroke();_x.lineWidth=1;
  });

  // 50% line
  const halfY=ptY+ptH-(ptH-22)*0.5;
  _x.strokeStyle='#f87171';_x.setLineDash([3,3]);
  _x.beginPath();_x.moveTo(ptX+25,halfY);_x.lineTo(ptX+ptW,halfY);_x.stroke();_x.setLineDash([]);
  _x.fillStyle='#f87171';_x.font='7px SF Mono';_x.fillText('50%',ptX+5,halfY+3);

  // Legend
  Ns.forEach((ns,i)=>{
    _x.fillStyle=ns.color;_x.font='8px SF Mono';
    _x.fillText(ns.label,ptX+30,ptY+ptH+12+i*11);
  });

  // === Birthday Bound Table (middle) ===
  const bbY=calY+calH+24,bbW=w;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Birthday Bound: 50% collision probability',10,bbY);

  const bounds=[
    {hash:'MD5',bits:128,bound:'2^64',color:'#f87171',broken:true},
    {hash:'SHA-1',bits:160,bound:'2^80',color:'#f87171',broken:true},
    {hash:'SHA-256',bits:256,bound:'2^128',color:'#4ade80',broken:false},
    {hash:'SHA-384',bits:384,bound:'2^192',color:'#4ade80',broken:false},
    {hash:'SHA-512',bits:512,bound:'2^256',color:'#4ade80',broken:false},
    {hash:'SHA-3-256',bits:256,bound:'2^128',color:'#4ade80',broken:false}
  ];

  const colW=w/6;
  // Header
  _x.fillStyle=acc+'44';_x.fillRect(10,bbY+6,w-20,14);
  ['Hash','Bits','Bound','Status'].forEach((hdr,i)=>{
    _x.fillStyle=acc;_x.font='bold 8px SF Mono';
    _x.fillText(hdr,[14,80,145,220][i],bbY+16);
  });

  bounds.forEach((b,i)=>{
    const y=bbY+22+i*14;
    const isActive=Math.floor(_t/40)%bounds.length===i;
    _x.fillStyle=isActive?b.color+'22':'rgba(255,255,255,.02)';
    _x.fillRect(10,y,w*0.55,13);
    _x.fillStyle=b.color;_x.font='8px SF Mono';
    _x.fillText(b.hash,14,y+10);
    _x.fillStyle=mut;_x.fillText(`${b.bits}`,80,y+10);
    _x.fillText(b.bound,145,y+10);
    _x.fillStyle=b.broken?'#f87171':'#4ade80';_x.font='bold 8px SF Mono';
    _x.fillText(b.broken?'BROKEN':'SECURE',220,y+10);
    // Security bar
    const barW=(b.bits/512)*(w*0.35);
    _x.fillStyle=b.color+'33';_x.fillRect(280,y+1,barW,11);
  });

  // === Animated Hash Collision Demo (bottom) ===
  const acY=bbY+22+bounds.length*14+10;
  if(acY+40<h){
    _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
    _x.fillText('Live: Random hash values approaching collision',10,acY);

    const nDots=Math.min(120,_t%150);
    const hashSpace=256;// 8-bit for visualization
    const radius=Math.min((w-40)/2,(h-acY-25)/2)*0.8;
    const cx=w/2,cy=acY+radius+15;
    _x.strokeStyle=mut+'22';_x.beginPath();_x.arc(cx,cy,radius,0,Math.PI*2);_x.stroke();

    const seen=new Set();let collisionIdx=-1;
    for(let i=0;i<nDots;i++){
      const hash=(i*37+_t*3)%hashSpace;
      if(seen.has(hash)&&collisionIdx<0)collisionIdx=i;
      seen.add(hash);
      const angle=(hash/hashSpace)*Math.PI*2;
      const px=cx+Math.cos(angle)*radius*0.85;
      const py=cy+Math.sin(angle)*radius*0.85;
      const isCollision=i===collisionIdx;
      _x.fillStyle=isCollision?'#f87171':`hsla(${(hash/hashSpace)*360},60%,50%,.5)`;
      _x.beginPath();_x.arc(px,py,isCollision?5:2.5,0,Math.PI*2);_x.fill();
    }
    if(collisionIdx>=0){
      _x.fillStyle='#f87171';_x.font='bold 10px SF Mono';_x.textAlign='center';
      _x.fillText(`Collision at attempt #${collisionIdx}!`,cx,cy);_x.textAlign='left';
    }
  }

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
