/**
 * X.509 Certificate Forgery Lab — Workshop DIY v1.0
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas PKI Visualization
 */
const $=id=>document.getElementById(id);

/* ======= i18n ======= */
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
    title:'X.509 Certificate Forgery Lab',subtitle:'Forge certificates, explore PKI chain validation bypass',
    mainSection:'Certificate Forge',mainDesc:'Create root CA, intermediate, and leaf certificates, then attempt forgery',
    caLabel:'Root CA Common Name',caHint:'Name for the trusted root certificate authority',
    leafLabel:'Target Domain',leafHint:'Domain the forged certificate will claim',
    attackLabel:'Attack Type',
    forgeCert:'Forge Certificate',verifyChain:'Verify Chain',reset:'Reset',results:'Results',
    vizTitle:'PKI Chain Visualization',vizHint:'Watch the certificate chain and forgery attempts',
    sectionA:'Attack Reference',sectionB:'PKI Deep Dive',
    settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',
    langChanged:'Language -> English',themeChanged:'Theme ->',
    selfSigned:'Self-Signed Forgery',chainBreak:'Chain Validation Bypass',
    nullByte:'Null-Byte CN Injection',hashCollision:'Hash Collision (MD5)',
    forging:'Forging certificate...',forged:'Certificate forged!',
    verifying:'Verifying chain...',chainValid:'Chain VALID',chainInvalid:'Chain INVALID (forgery detected)',
    resetDone:'All certificates cleared',
    howto_1:'Enter a root CA name and target domain.',howto_2:'Choose an attack type from the dropdown.',howto_3:'Click Forge Certificate to create the forged chain.',howto_4:'Click Verify Chain to see if the forgery is detected.',
    wiki_self:'Self-signed: Certificate signed by its own key, not a trusted CA. Browsers reject unless manually trusted.',
    wiki_chain:'Chain bypass: Missing intermediate validation. Attacker creates fake intermediate CA.',
    wiki_null:'Null-byte: CN=evil.com\\x00.target.com tricks parsers that stop at \\0.',
    wiki_md5:'MD5 collision: Two different certificates with identical MD5 hash, enabling signature forgery.',
    mathExplain:'X.509 Certificate Chain:\n1. Root CA (self-signed, trusted by OS/browser)\n2. Intermediate CA (signed by Root)\n3. Leaf cert (signed by Intermediate)\n\nValidation: Browser walks chain from leaf to root,\nchecking each signature: verify(parent.pubkey, child.sig)\n\nAttack vectors:\n- Self-signed: skip chain entirely\n- Chain break: forge intermediate with different key\n- Null-byte: CN parsing vulnerability\n- MD5 collision: forge cert with matching hash'
  ,step1Title:'Choose Algorithm',step1Desc:'Select the cryptographic algorithm and key parameters to analyze.',step2Title:'Set Up Attack',step2Desc:'Configure the attack parameters: known plaintext, side-channel data, or timing.',step3Title:'Execute Attack',step3Desc:'Run the cryptographic attack and attempt to recover the secret key.',step4Title:'Analyze Results',step4Desc:'Evaluate attack success rate and understand the vulnerability exploited.',sectionCode:'Device Code',faq_q1:'What is X.509 Certificate Forgery Lab?',faq_a1:'X.509 Certificate Forgery Lab lets you create root ca, intermediate, and leaf certificates, then attempt forgery. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you select the cryptographic algorithm and key parameters to analyze. Then you configure the attack parameters: known plaintext, side-channel data, or timing.',faq_q3:'What do the controls do?',faq_a3:'Enter a root CA name and target domain. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'ذاتي التوقيع: شهادة موقعة بمفتاحها الخاص، غير موثوقة من CA.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to X.509 Certificate Forgery Lab! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Enter a root CA name and target domain. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Attack Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how cryptography works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Attack Reference" and "PKI Deep Dive" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{
    title:'Labo Falsification de Certificats X.509',subtitle:'Falsifiez des certificats, contournez la validation PKI',
    mainSection:'Forge de Certificat',mainDesc:'Creez un CA racine, intermediaire et certificat feuille, puis tentez la falsification',
    caLabel:'Nom du CA Racine',caHint:'Nom de l\'autorite de certification racine',
    leafLabel:'Domaine Cible',leafHint:'Domaine que le certificat falsifie revendiquera',
    attackLabel:'Type d\'Attaque',
    forgeCert:'Falsifier le Certificat',verifyChain:'Verifier la Chaine',reset:'Reinitialiser',results:'Resultats',
    vizTitle:'Visualisation de la Chaine PKI',vizHint:'Observez la chaine de certificats et les tentatives de falsification',
    sectionA:'Reference des Attaques',sectionB:'PKI en Profondeur',
    settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',
    langChanged:'Langue -> Francais',themeChanged:'Theme ->',
    selfSigned:'Falsification Auto-Signee',chainBreak:'Contournement de Chaine',
    nullByte:'Injection Null-Byte CN',hashCollision:'Collision de Hachage (MD5)',
    forging:'Falsification en cours...',forged:'Certificat falsifie!',
    verifying:'Verification de la chaine...',chainValid:'Chaine VALIDE',chainInvalid:'Chaine INVALIDE (falsification detectee)',
    resetDone:'Tous les certificats effaces',
    howto_1:'Entrez un nom de CA racine et un domaine cible.',howto_2:'Choisissez un type d\'attaque.',howto_3:'Cliquez sur Falsifier le Certificat.',howto_4:'Cliquez sur Verifier la Chaine.',
    wiki_self:'Auto-signe: Certificat signe par sa propre cle, non approuve par un CA.',
    wiki_chain:'Contournement de chaine: Validation intermediaire manquante.',
    wiki_null:'Null-byte: CN=evil.com\\x00.cible.com trompe les parseurs.',
    wiki_md5:'Collision MD5: Deux certificats differents avec le meme hachage MD5.',
    mathExplain:'Chaine de Certificats X.509:\n1. CA Racine (auto-signe, approuve par OS/navigateur)\n2. CA Intermediaire (signe par Racine)\n3. Certificat feuille (signe par Intermediaire)\n\nValidation: Le navigateur parcourt la chaine,\nverifiant chaque signature.'
  ,step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule cryptographic attacks ! 🔬 Tu peux expérimenter avec breaking encryption en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Aes Side Channel and Cry Replay Attack Forge ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{
    title:'مختبر تزوير شهادات X.509',subtitle:'زور الشهادات واستكشف تجاوز التحقق من سلسلة PKI',
    mainSection:'ورشة تزوير الشهادات',mainDesc:'انشئ سلطة جذرية ووسيطة وشهادة طرفية ثم حاول التزوير',
    caLabel:'اسم السلطة الجذرية',caHint:'اسم سلطة التصديق الجذرية الموثوقة',
    leafLabel:'النطاق المستهدف',leafHint:'النطاق الذي ستدعيه الشهادة المزورة',
    attackLabel:'نوع الهجوم',
    forgeCert:'تزوير الشهادة',verifyChain:'التحقق من السلسلة',reset:'اعادة تعيين',results:'النتائج',
    vizTitle:'تصور سلسلة PKI',vizHint:'شاهد سلسلة الشهادات ومحاولات التزوير',
    sectionA:'مرجع الهجمات',sectionB:'تعمق في PKI',
    settings:'الاعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',
    help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',
    langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',
    selfSigned:'تزوير ذاتي التوقيع',chainBreak:'تجاوز التحقق من السلسلة',
    nullByte:'حقن بايت فارغ في CN',hashCollision:'تصادم هاش MD5',
    forging:'جاري تزوير الشهادة...',forged:'تم تزوير الشهادة!',
    verifying:'جاري التحقق من السلسلة...',chainValid:'السلسلة صالحة',chainInvalid:'السلسلة غير صالحة (تم كشف التزوير)',
    resetDone:'تم مسح جميع الشهادات',
    howto_1:'ادخل اسم السلطة الجذرية والنطاق المستهدف.',howto_2:'اختر نوع الهجوم.',howto_3:'انقر تزوير الشهادة.',howto_4:'انقر التحقق من السلسلة.',
    wiki_self:'ذاتي التوقيع: شهادة موقعة بمفتاحها الخاص، غير موثوقة من CA.',
    wiki_chain:'تجاوز السلسلة: عدم التحقق من الشهادة الوسيطة.',
    wiki_null:'بايت فارغ: CN=evil.com\\x00.target.com يخدع المحللين.',
    wiki_md5:'تصادم MD5: شهادتان مختلفتان بنفس هاش MD5.',
    mathExplain:'سلسلة شهادات X.509:\n1. السلطة الجذرية (ذاتية التوقيع، موثوقة من النظام)\n2. السلطة الوسيطة (موقعة من الجذرية)\n3. شهادة طرفية (موقعة من الوسيطة)\n\nالتحقق: المتصفح يتنقل من الشهادة الطرفية الى الجذرية'
  ,step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي cryptographic attacks! 🔬 يمكنك التجربة مع breaking encryption في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Aes Side Channel and Cry Replay Attack Forge! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';

function setLanguage(lang){
  currentLang=lang;const s=LANG[lang];if(!s)return;
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.documentElement.lang=lang;
  const sel=$('langSelect');if(sel)sel.value=lang;
  try{localStorage.setItem('cry-cert-lang',lang)}catch{}
  log(s.langChanged,'info');buildHelp();buildRef();buildMath();
}

/* ======= THEMES ======= */
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){
  document.documentElement.dataset.theme=name;
  document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));
  const sel=$('themeSelect');if(sel)sel.value=name;
  try{localStorage.setItem('cry-cert-theme',name)}catch{}
  log(`${LANG[currentLang].themeChanged} ${name}`,'info');
}

/* ======= SOUND ======= */
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){
  if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();
  const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
  osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=.08;const t=audioCtx.currentTime;
  if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.08);osc.start(t);osc.stop(t+.08)}
  else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.3);osc.start(t);osc.stop(t+.3)}
  else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.25)}
}

/* ======= LOG ======= */
let logContainer;
function log(msg,type='info'){
  if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;
  const d=document.createElement('div');d.className=`log-line ${type}`;
  d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;
  if(type==='success')playSound('success');else if(type==='error')playSound('error');
}

/* ======= TOAST ======= */
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}

/* ======= SPLASH ======= */
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}

/* ======= PANELS ======= */
function togglePanel(panel,overlay){
  panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'));
}

/* ======= CRYPTO HELPERS ======= */
function randomHex(len){let h='';for(let i=0;i<len;i++)h+='0123456789abcdef'[Math.floor(Math.random()*16)];return h}
function simpleHash(str){let h=0;for(let i=0;i<str.length;i++){h=((h<<5)-h)+str.charCodeAt(i);h|=0}return Math.abs(h).toString(16).padStart(8,'0')}

/* ======= CERTIFICATE MODEL ======= */
let certChain={root:null,intermediate:null,leaf:null,forged:null};
let animState={phase:'idle',progress:0,particles:[]};
let animFrame;

function makeCert(cn,issuer,isCa,keyId){
  return{
    cn,issuer,isCa,
    serial:randomHex(16),
    keyId:keyId||randomHex(8),
    notBefore:new Date().toISOString().slice(0,10),
    notAfter:new Date(Date.now()+365*86400000).toISOString().slice(0,10),
    sigAlgo:'SHA-256 with RSA',
    sig:randomHex(64),
    pubkey:randomHex(32),
    fingerprint:randomHex(40)
  };
}

function buildLegitChain(){
  const caName=$('caNameInput').value||'TrustRoot CA';
  const domain=$('domainInput').value||'secure.example.com';
  const rootKey=randomHex(8);
  certChain.root=makeCert(caName,caName,true,rootKey);
  certChain.root.sig=simpleHash(caName+rootKey);
  const intKey=randomHex(8);
  certChain.intermediate=makeCert('Intermediate CA',caName,true,intKey);
  certChain.intermediate.sig=simpleHash('Intermediate CA'+rootKey);
  certChain.leaf=makeCert(domain,'Intermediate CA',false,randomHex(8));
  certChain.leaf.sig=simpleHash(domain+intKey);
  certChain.forged=null;
}

function forgeCertificate(){
  const s=LANG[currentLang];
  const attack=$('attackSelect').value;
  const domain=$('domainInput').value||'secure.example.com';
  const caName=$('caNameInput').value||'TrustRoot CA';

  buildLegitChain();
  showToast(s.forging);log(s.forging,'info');

  let forged;
  switch(attack){
    case'self-signed':
      forged=makeCert(domain,domain,false);
      forged.attackType='self-signed';
      forged.weakness='No chain to trusted CA';
      break;
    case'chain-break':
      const fakeInt=makeCert('Fake Intermediate CA',caName,true);
      fakeInt.sig=randomHex(64);
      forged=makeCert(domain,'Fake Intermediate CA',false);
      forged.fakeIntermediate=fakeInt;
      forged.attackType='chain-break';
      forged.weakness='Intermediate signature mismatch';
      break;
    case'null-byte':
      forged=makeCert('attacker.com\\x00.'+domain,'Intermediate CA',false);
      forged.displayCN=domain;
      forged.realCN='attacker.com\\x00.'+domain;
      forged.attackType='null-byte';
      forged.weakness='CN parsing stops at null byte';
      break;
    case'collision':
      forged=makeCert(domain,'Intermediate CA',false);
      forged.sigAlgo='MD5 with RSA';
      forged.sig=certChain.leaf.sig;
      forged.attackType='collision';
      forged.weakness='MD5 hash collision allows signature reuse';
      break;
  }
  certChain.forged=forged;

  animState={phase:'forging',progress:0,particles:[]};
  for(let i=0;i<20;i++)animState.particles.push({x:Math.random(),y:Math.random(),vx:(Math.random()-.5)*.02,vy:(Math.random()-.5)*.02,life:1});

  setTimeout(()=>{
    animState.phase='forged';
    hideToast();log(s.forged,'success');
    showResults();drawCanvas();
  },1200);

  drawCanvas();
}

function verifyChain(){
  const s=LANG[currentLang];
  if(!certChain.root){log('No certificates to verify','error');return}
  showToast(s.verifying);log(s.verifying,'info');
  animState={phase:'verifying',progress:0,particles:[]};

  setTimeout(()=>{
    let valid=true,reason='';
    if(certChain.forged){
      const f=certChain.forged;
      switch(f.attackType){
        case'self-signed':valid=false;reason='Self-signed cert: issuer is not a trusted CA';break;
        case'chain-break':valid=false;reason='Intermediate CA signature does not match root CA public key';break;
        case'null-byte':
          const strictCheck=true;
          if(strictCheck){valid=false;reason='Null byte detected in CN field - modern validators reject this'}
          else{valid=true;reason='Vulnerable parser accepted null-byte CN'}
          break;
        case'collision':
          const useSHA256=certChain.leaf.sigAlgo.includes('SHA-256');
          if(useSHA256){valid=false;reason='SHA-256 detects forgery - MD5 collision does not transfer'}
          else{valid=true;reason='MD5 collision exploited successfully!'}
          break;
      }
    }
    animState.phase=valid?'valid':'invalid';
    hideToast();
    if(valid){log(s.chainValid,'success')}else{log(`${s.chainInvalid}: ${reason}`,'error')}
    $('resultsBox').textContent+=`\n\nVerification: ${valid?'PASS':'FAIL'}\nReason: ${reason}`;
    drawCanvas();
  },1500);
  drawCanvas();
}

function showResults(){
  const f=certChain.forged;if(!f)return;
  let out=`=== Forged Certificate ===\n`;
  out+=`CN: ${f.cn}\nIssuer: ${f.issuer}\nSerial: ${f.serial}\n`;
  out+=`Sig Algorithm: ${f.sigAlgo}\nSignature: ${f.sig.slice(0,32)}...\n`;
  out+=`Attack: ${f.attackType}\nWeakness: ${f.weakness}\n`;
  if(f.realCN)out+=`Real CN: ${f.realCN}\nDisplay CN: ${f.displayCN}\n`;
  out+=`\n=== Legitimate Chain ===\n`;
  out+=`Root: ${certChain.root.cn} (${certChain.root.fingerprint.slice(0,16)}...)\n`;
  out+=`Intermediate: ${certChain.intermediate.cn}\n`;
  out+=`Leaf: ${certChain.leaf.cn}\n`;
  $('resultsBox').textContent=out;
}

function resetAll(){
  certChain={root:null,intermediate:null,leaf:null,forged:null};
  animState={phase:'idle',progress:0,particles:[]};
  $('resultsBox').textContent='';
  log(LANG[currentLang].resetDone,'info');
  drawCanvas();
}

/* ======= CANVAS VISUALIZATION ======= */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;

function resizeCanvas(){
  if(!canvas)return;const r=canvas.getBoundingClientRect();
  canvas.width=r.width*window.devicePixelRatio;canvas.height=r.height*window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
}

function getCS(prop){return getComputedStyle(document.documentElement).getPropertyValue(prop).trim()}

function drawCertBox(x,y,w,h,cert,color,label){
  ctx.fillStyle=color+'22';ctx.fillRect(x,y,w,h);
  ctx.strokeStyle=color+'88';ctx.lineWidth=2;ctx.strokeRect(x,y,w,h);
  ctx.fillStyle=color;ctx.font='bold 11px Righteous,Tajawal,sans-serif';
  ctx.fillText(label,x+8,y+16);
  if(cert){
    ctx.fillStyle=getCS('--text');ctx.font='10px Tajawal,sans-serif';
    ctx.fillText(`CN: ${cert.cn.length>25?cert.cn.slice(0,25)+'...':cert.cn}`,x+8,y+32);
    ctx.fillStyle=getCS('--text-muted');
    ctx.fillText(`Serial: ${cert.serial.slice(0,12)}...`,x+8,y+46);
    ctx.fillText(`Key: ${cert.keyId}`,x+8,y+58);
    if(cert.isCa){ctx.fillStyle='#4ade80';ctx.fillText('CA:TRUE',x+w-55,y+16)}
  }
}

function drawArrow(x1,y1,x2,y2,color,dashed){
  ctx.strokeStyle=color;ctx.lineWidth=2;
  if(dashed)ctx.setLineDash([4,4]);else ctx.setLineDash([]);
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  const angle=Math.atan2(y2-y1,x2-x1);
  ctx.fillStyle=color;ctx.beginPath();
  ctx.moveTo(x2,y2);ctx.lineTo(x2-10*Math.cos(angle-0.4),y2-10*Math.sin(angle-0.4));
  ctx.lineTo(x2-10*Math.cos(angle+0.4),y2-10*Math.sin(angle+0.4));ctx.fill();
  ctx.setLineDash([]);
}

function drawCanvas(){
  if(!ctx)return;
  const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),accent2=getCS('--accent2'),text=getCS('--text'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);

  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';
  ctx.fillText('PKI Certificate Chain',10,22);
  ctx.fillStyle=muted;ctx.font='11px Tajawal,sans-serif';
  ctx.fillText(`Phase: ${animState.phase}`,10,38);

  if(!certChain.root){
    ctx.fillStyle=muted;ctx.font='13px Tajawal,sans-serif';
    ctx.textAlign='center';ctx.fillText('Click "Forge Certificate" to begin',w/2,h/2);ctx.textAlign='left';
    return;
  }

  const bw=180,bh=68,gap=20;
  const startX=(w-bw*3-gap*2)/2,startY=55;

  drawCertBox(startX,startY,bw,bh,certChain.root,'#4ade80','Root CA');
  drawCertBox(startX+bw+gap,startY,bw,bh,certChain.intermediate,'#60a5fa','Intermediate CA');
  drawCertBox(startX+(bw+gap)*2,startY,bw,bh,certChain.leaf,'#fbbf24','Leaf Cert');

  drawArrow(startX+bw,startY+bh/2,startX+bw+gap,startY+bh/2,'#4ade8088');
  drawArrow(startX+bw*2+gap,startY+bh/2,startX+bw*2+gap*2,startY+bh/2,'#60a5fa88');

  ctx.fillStyle=muted;ctx.font='9px SF Mono,monospace';
  ctx.fillText('signs',startX+bw+2,startY+bh/2-5);
  ctx.fillText('signs',startX+bw*2+gap+2,startY+bh/2-5);

  if(certChain.forged){
    const fy=startY+bh+50;
    drawCertBox(startX+bw+gap,fy,bw,bh,certChain.forged,'#f87171','FORGED');

    if(certChain.forged.fakeIntermediate){
      drawCertBox(startX,fy,bw,bh,certChain.forged.fakeIntermediate,'#fb923c','Fake Intermediate');
      drawArrow(startX+bw,fy+bh/2,startX+bw+gap,fy+bh/2,'#f8717188',true);
    }

    drawArrow(startX+bw+gap+bw/2,startY+bh+5,startX+bw+gap+bw/2,fy-5,'#f8717166',true);
    ctx.fillStyle='#f87171';ctx.font='bold 10px Tajawal';
    ctx.fillText('FORGERY ATTEMPT',startX+bw+gap+10,fy-10);

    if(animState.phase==='valid'){
      ctx.fillStyle='#4ade8044';ctx.fillRect(0,fy+bh+10,w,30);
      ctx.fillStyle='#4ade80';ctx.font='bold 14px Righteous';
      ctx.textAlign='center';ctx.fillText('CHAIN VALID (vulnerable!)',w/2,fy+bh+30);ctx.textAlign='left';
    }else if(animState.phase==='invalid'){
      ctx.fillStyle='#f8717144';ctx.fillRect(0,fy+bh+10,w,30);
      ctx.fillStyle='#f87171';ctx.font='bold 14px Righteous';
      ctx.textAlign='center';ctx.fillText('FORGERY DETECTED - CHAIN INVALID',w/2,fy+bh+30);ctx.textAlign='left';
    }
  }

  // Animate particles during forging
  if(animState.phase==='forging'||animState.phase==='verifying'){
    animState.particles.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;p.life-=0.01;
      if(p.life>0){
        ctx.fillStyle=`${animState.phase==='forging'?'#f87171':'#60a5fa'}${Math.floor(p.life*255).toString(16).padStart(2,'0')}`;
        ctx.beginPath();ctx.arc(p.x*w,50+p.y*(h-60),3,0,Math.PI*2);ctx.fill();
      }
    });
    animFrame=requestAnimationFrame(drawCanvas);
  }
}

/* ======= BUILD DYNAMIC SECTIONS ======= */
function buildHelp(){
  const s=LANG[currentLang];
  $('helpFaq').innerHTML=[
    {q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}
  ].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');
  $('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');
  $('helpWiki').innerHTML=[
    {t:s.selfSigned,p:s.wiki_self},{t:s.chainBreak,p:s.wiki_chain},{t:s.nullByte,p:s.wiki_null},{t:s.hashCollision,p:s.wiki_md5}
  ].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('');
}
function buildRef(){
  const s=LANG[currentLang];
  $('refCard').innerHTML=[
    {t:s.selfSigned,p:s.wiki_self},{t:s.chainBreak,p:s.wiki_chain},{t:s.nullByte,p:s.wiki_null},{t:s.hashCollision,p:s.wiki_md5}
  ].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('');
}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

/* ======= INIT ======= */
document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);
  resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});

  try{const l=localStorage.getItem('cry-cert-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-cert-theme');if(t)setTheme(t)}catch{}

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

  $('forgeBtn').onclick=forgeCertificate;
  $('verifyBtn').onclick=verifyChain;
  $('resetBtn').onclick=resetAll;

  buildHelp();buildRef();buildMath();
  log(LANG[currentLang].ready,'success');
  drawCanvas();
});

/* ═══════ ENHANCED PKI CERTIFICATE VISUALIZATION (IIFE) ═══════ */
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

  // === X.509 Certificate Fields (top-left) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('X.509 Certificate Structure (ASN.1 DER)',10,16);

  const fields=[
    {name:'Version',val:'v3',color:'#60a5fa',w:40},
    {name:'Serial',val:randomHex(4),color:'#c084fc',w:60},
    {name:'Sig Algorithm',val:'SHA-256/RSA',color:'#fbbf24',w:80},
    {name:'Issuer',val:'Root CA',color:'#4ade80',w:60},
    {name:'Validity',val:'2024-2025',color:'#60a5fa',w:65},
    {name:'Subject',val:'*.example.com',color:'#f87171',w:85},
    {name:'Public Key',val:'RSA-2048',color:'#c084fc',w:65}
  ];
  let fx=10;
  const certY=24;
  fields.forEach((f,i)=>{
    const isActive=Math.floor(_t/30)%fields.length===i;
    _x.fillStyle=isActive?f.color+'44':f.color+'15';
    _x.fillRect(fx,certY,f.w,40);_x.strokeStyle=f.color+'66';_x.strokeRect(fx,certY,f.w,40);
    _x.fillStyle=f.color;_x.font='bold 7px SF Mono';_x.textAlign='center';
    _x.fillText(f.name,fx+f.w/2,certY+14);
    _x.fillStyle=mut;_x.font='6px SF Mono';
    _x.fillText(f.val,fx+f.w/2,certY+30);_x.textAlign='left';
    fx+=f.w+3;
  });
  // Signature
  _x.fillStyle='#f8717133';_x.fillRect(fx,certY,w-fx-10,40);
  _x.strokeStyle='#f87171';_x.strokeRect(fx,certY,w-fx-10,40);
  _x.fillStyle='#f87171';_x.font='bold 7px SF Mono';_x.textAlign='center';
  _x.fillText('Signature',fx+(w-fx-10)/2,certY+14);
  _x.fillStyle=mut;_x.font='6px SF Mono';
  _x.fillText(randomHex(8)+'...',fx+(w-fx-10)/2,certY+30);_x.textAlign='left';

  // === Trust Chain Tree (middle-left) ===
  const tcY=certY+55,tcW=w*0.48,tcH=120;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('PKI Trust Hierarchy',10,tcY);

  const tree=[
    {level:0,x:tcW/2,y:tcY+15,label:'Root CA',color:'#4ade80',children:[1,2]},
    {level:1,x:tcW*0.25,y:tcY+55,label:'Int CA-1',color:'#60a5fa',children:[3,4]},
    {level:1,x:tcW*0.75,y:tcY+55,label:'Int CA-2',color:'#60a5fa',children:[5]},
    {level:2,x:tcW*0.1,y:tcY+95,label:'site-a.com',color:'#fbbf24',children:[]},
    {level:2,x:tcW*0.35,y:tcY+95,label:'site-b.com',color:'#fbbf24',children:[]},
    {level:2,x:tcW*0.7,y:tcY+95,label:'site-c.com',color:'#fbbf24',children:[]}
  ];
  // Draw edges
  tree.forEach((node,i)=>{
    node.children.forEach(ci=>{
      _x.strokeStyle=node.color+'66';_x.lineWidth=1;
      _x.beginPath();_x.moveTo(node.x+10,node.y+10);_x.lineTo(tree[ci].x+10,tree[ci].y);_x.stroke();
    });
  });
  // Draw nodes
  tree.forEach(node=>{
    const isActive=Math.floor(_t/25)%3===node.level;
    _x.fillStyle=isActive?node.color+'44':node.color+'22';
    _x.fillRect(node.x-20,node.y,60,18);_x.strokeStyle=node.color;_x.strokeRect(node.x-20,node.y,60,18);
    _x.fillStyle=node.color;_x.font='bold 7px SF Mono';_x.textAlign='center';
    _x.fillText(node.label,node.x+10,node.y+12);_x.textAlign='left';
  });

  // === Attack Types Comparison (middle-right) ===
  const atX=w*0.52,atY=tcY;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Certificate Attack Vectors',atX,atY);

  const attacks=[
    {name:'Self-Signed',desc:'No trusted CA chain',severity:0.3,era:'Basic',color:'#fbbf24'},
    {name:'Null-Byte CN',desc:'Parser truncation trick',severity:0.7,era:'CVE-2009',color:'#f87171'},
    {name:'MD5 Collision',desc:'Rogue CA certificate',severity:0.9,era:'Flame 2012',color:'#f87171'},
    {name:'Chain Break',desc:'Fake intermediate CA',severity:0.5,era:'Ongoing',color:'#fb923c'},
    {name:'BGP Hijack+CA',desc:'Domain validation bypass',severity:0.8,era:'2018+',color:'#f87171'},
    {name:'CT Log Bypass',desc:'Avoid transparency',severity:0.4,era:'Theoretical',color:'#fbbf24'}
  ];

  const atW=w*0.46;
  attacks.forEach((a,i)=>{
    const y=atY+12+i*19;
    const barW=a.severity*atW*0.5;
    const isActive=Math.floor(_t/40)%attacks.length===i;
    _x.fillStyle=isActive?a.color+'44':'rgba(255,255,255,.02)';
    _x.fillRect(atX,y,atW,17);
    _x.fillStyle=a.color+'44';_x.fillRect(atX+90,y+2,barW,13);
    _x.fillStyle=isActive?a.color:mut;_x.font='bold 8px SF Mono';
    _x.fillText(a.name,atX+3,y+12);
    _x.fillStyle=mut;_x.font='7px SF Mono';
    _x.fillText(a.era,atX+atW-35,y+12);
  });

  // === TLS Handshake (bottom) ===
  const tlsY=tcY+tcH+10;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('TLS Certificate Verification Flow',10,tlsY);

  const tlsSteps=[
    {label:'ClientHello',from:0.1,to:0.5,color:'#4ade80',y:0},
    {label:'ServerHello + Cert',from:0.5,to:0.1,color:'#60a5fa',y:1},
    {label:'Verify Cert Chain',from:0.1,to:0.1,color:'#fbbf24',y:2},
    {label:'Check Revocation (CRL/OCSP)',from:0.1,to:0.3,color:'#c084fc',y:3},
    {label:'Key Exchange',from:0.1,to:0.5,color:'#4ade80',y:4},
    {label:'Encrypted Session',from:0.1,to:0.5,color:'#4ade80',y:5}
  ];

  const tlsW=w-20,tlsH=h-tlsY-20;
  const stepH=Math.min(16,tlsH/tlsSteps.length);
  const activeStep=Math.floor(_t/40)%tlsSteps.length;
  tlsSteps.forEach((s,i)=>{
    const y=tlsY+8+i*stepH;
    _x.fillStyle=i===activeStep?s.color+'33':'rgba(255,255,255,.02)';
    _x.fillRect(10,y,tlsW,stepH-2);
    // Arrow
    const ax=10+s.from*tlsW,bx=10+s.to*tlsW;
    _x.strokeStyle=i<=activeStep?s.color:mut+'44';_x.lineWidth=i===activeStep?2:1;
    _x.beginPath();_x.moveTo(ax,y+stepH/2);_x.lineTo(bx,y+stepH/2);_x.stroke();
    const dir=bx>ax?1:-1;
    _x.fillStyle=s.color;_x.beginPath();_x.moveTo(bx,y+stepH/2);_x.lineTo(bx-dir*6,y+stepH/2-3);_x.lineTo(bx-dir*6,y+stepH/2+3);_x.fill();
    _x.lineWidth=1;
    // Label
    _x.fillStyle=i<=activeStep?s.color:mut;_x.font='bold 8px SF Mono';
    _x.fillText(s.label,Math.min(ax,bx)+Math.abs(bx-ax)/2-30,y+stepH/2-5);
  });

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
