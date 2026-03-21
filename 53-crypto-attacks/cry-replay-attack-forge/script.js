/**
 * Replay Attack Forge — Workshop DIY v1.0
 * Simulate capture and replay of authentication tokens
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
    ...LANG_BASE.en,title:'Replay Attack Forge',subtitle:'Capture and replay authentication tokens',mainSection:'Replay Attack Lab',mainDesc:'Intercept and replay captured auth tokens',authenticate:'Authenticate (legit)',capture:'Capture Token',replay:'Replay Attack',useNonce:'Enable nonce protection',results:'Results',vizTitle:'Network Traffic',vizHint:'Watch packets flow between client, attacker, and server',sectionA:'Attack Reference',sectionB:'Defense Strategies',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',authSuccess:'Authentication successful',captured:'Token captured by attacker!',replaySuccess:'Replay attack SUCCESS - unauthorized access!',replayBlocked:'Replay BLOCKED - nonce already used!',noToken:'No token captured yet',
    howto_1:'Click Authenticate to perform a legitimate login.',howto_2:'Click Capture to intercept the authentication token.',howto_3:'Click Replay to attempt unauthorized access.',howto_4:'Toggle nonce protection to see the defense.',
    wiki_replay:'Replay attack: re-sending a valid captured packet to impersonate the original sender.',wiki_nonce:'Nonce: a random value included in each message, making each request unique and non-replayable.',wiki_timestamp:'Timestamp-based defense: reject messages with timestamps outside an acceptable window.',
    mathExplain:'Defense Strategies:\n\n1. Nonce (Number Used Once)\n   Server generates random nonce per session\n   Client includes nonce in signed request\n   Server rejects duplicate nonces\n\n2. Timestamps\n   Request includes current timestamp\n   Server rejects if |now - timestamp| > threshold\n\n3. Sequence Numbers\n   Monotonically increasing counter\n   Server rejects if seq <= last_seen\n\n4. Challenge-Response\n   Server sends random challenge\n   Client responds with HMAC(secret, challenge)',step1Title:'Choose Algorithm',step1Desc:'Select the cryptographic algorithm and key parameters to analyze.',step2Title:'Set Up Attack',step2Desc:'Configure the attack parameters: known plaintext, side-channel data, or timing.',step3Title:'Execute Attack',step3Desc:'Run the cryptographic attack and attempt to recover the secret key.',step4Title:'Analyze Results',step4Desc:'Evaluate attack success rate and understand the vulnerability exploited.',sectionCode:'Device Code',faq_q1:'What is Replay Attack Forge?',faq_a1:'Replay Attack Forge lets you intercept and replay captured auth tokens. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you select the cryptographic algorithm and key parameters to analyze. Then you configure the attack parameters: known plaintext, side-channel data, or timing.',faq_q3:'What do the controls do?',faq_a3:'Click Authenticate to perform a legitimate login. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'هجوم الإعادة: إعادة إرسال حزمة صالحة ملتقطة.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to Replay Attack Forge! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Click Authenticate to perform a legitimate login. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Attack Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how cryptography works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32)  # 32 bytes = 256 bits\\niv = os.urandom(16)   # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key:        {key.hex()}")\\nprint(f"IV:         {iv.hex()}")\\nprint(f"Plaintext:  {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered:  {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Attack Reference" and "Defense Strategies" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Forge Attaque Rejeu',subtitle:'Capturez et rejouez des jetons d\'authentification',mainSection:'Labo Attaque Rejeu',mainDesc:'Interceptez et rejouez des jetons captures',authenticate:'Authentifier',capture:'Capturer Jeton',replay:'Attaque Rejeu',useNonce:'Activer protection nonce',results:'Resultats',vizTitle:'Trafic Reseau',vizHint:'Regardez les paquets circuler',sectionA:'Reference',sectionB:'Strategies Defense',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',authSuccess:'Authentification reussie',captured:'Jeton capture par l\'attaquant!',replaySuccess:'Rejeu REUSSI - acces non autorise!',replayBlocked:'Rejeu BLOQUE - nonce deja utilise!',noToken:'Aucun jeton capture',howto_1:'Cliquez Authentifier.',howto_2:'Cliquez Capturer.',howto_3:'Cliquez Rejeu.',howto_4:'Activez le nonce.',
    wiki_replay:'Rejeu: renvoyer un paquet valide capture.',wiki_nonce:'Nonce: valeur aleatoire unique par message.',wiki_timestamp:'Defense par horodatage: rejeter les messages hors fenetre.',mathExplain:'Strategies de defense:\n1. Nonce\n2. Horodatage\n3. Numeros de sequence\n4. Challenge-Reponse',step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule cryptographic attacks ! 🔬 Tu peux expérimenter avec breaking encryption en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Elliptic Curve Attack and Cry Birthday Paradox Demo ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'تزوير هجوم الإعادة',subtitle:'التقط وأعد تشغيل رموز المصادقة',mainSection:'مختبر هجوم الإعادة',mainDesc:'اعترض وأعد تشغيل الرموز الملتقطة',authenticate:'مصادقة',capture:'التقاط الرمز',replay:'هجوم الإعادة',useNonce:'تفعيل حماية nonce',results:'النتائج',vizTitle:'حركة الشبكة',vizHint:'شاهد الحزم تتدفق بين العميل والمهاجم والخادم',sectionA:'مرجع',sectionB:'استراتيجيات الدفاع',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',authSuccess:'نجحت المصادقة',captured:'تم التقاط الرمز!',replaySuccess:'نجح هجوم الإعادة - وصول غير مصرح!',replayBlocked:'تم حظر الإعادة - nonce مستخدم!',noToken:'لم يتم التقاط رمز بعد',howto_1:'اضغط مصادقة.',howto_2:'اضغط التقاط.',howto_3:'اضغط هجوم الإعادة.',howto_4:'فعّل حماية nonce.',
    wiki_replay:'هجوم الإعادة: إعادة إرسال حزمة صالحة ملتقطة.',wiki_nonce:'Nonce: قيمة عشوائية فريدة لكل رسالة.',wiki_timestamp:'الدفاع بالطابع الزمني: رفض الرسائل خارج النافذة المقبولة.',mathExplain:'استراتيجيات الدفاع:\n1. Nonce\n2. طابع زمني\n3. أرقام تسلسلية\n4. تحدي-استجابة',step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي cryptographic attacks! 🔬 يمكنك التجربة مع breaking encryption في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Elliptic Curve Attack and Cry Birthday Paradox Demo! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;if($('langSelect'))$('langSelect').value=lang;try{localStorage.setItem('cry-rep-lang',lang)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));if($('themeSelect'))$('themeSelect').value=n;try{localStorage.setItem('cry-rep-theme',n)}catch{}}
let soundEnabled=false;function playSound(t){if(!soundEnabled)return;const a=new(window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);g.gain.value=.08;o.frequency.value=t==='success'?523:200;g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.2);o.start();o.stop(a.currentTime+.2)}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success')}
function showToast(m){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(p,o){p.classList.toggle('open');if(o)o.classList.toggle('active',p.classList.contains('open'))}

/* ═══════ REPLAY ATTACK SIMULATION ═══════ */
let capturedToken=null,usedNonces=new Set(),packets=[],animFrame;
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function randHex(n){let s='';for(let i=0;i<n;i++)s+='0123456789abcdef'[Math.floor(Math.random()*16)];return s}

function authenticate(){
  const nonce=randHex(8);const token=`user=alice&nonce=${nonce}&sig=${randHex(16)}`;
  usedNonces.add(nonce);const s=LANG[currentLang];
  packets.push({from:'client',to:'server',token,type:'auth',time:Date.now()});
  packets.push({from:'server',to:'client',token:'ACCESS_GRANTED',type:'response',time:Date.now()+500});
  log(s.authSuccess,'success');
  $('resultsBox').textContent=`Legitimate Authentication:\nToken: ${token}\nNonce: ${nonce}\nResult: ACCESS GRANTED`;
  drawCanvas()
}

function captureToken(){
  if(packets.length===0){authenticate()}
  const authPacket=packets.find(p=>p.type==='auth');
  if(authPacket){capturedToken=authPacket.token;const s=LANG[currentLang];
    packets.push({from:'attacker',to:'attacker',token:capturedToken,type:'capture',time:Date.now()});
    log(s.captured,'error');$('resultsBox').textContent+=`\n\nATTACKER CAPTURED:\n${capturedToken}`;drawCanvas()}
}

function replayAttack(){
  const s=LANG[currentLang];
  if(!capturedToken){log(s.noToken,'error');return}
  const nonceProtected=$('nonceToggle').checked;
  packets.push({from:'attacker',to:'server',token:capturedToken,type:'replay',time:Date.now()});
  if(nonceProtected){
    const nonceMatch=capturedToken.match(/nonce=([a-f0-9]+)/);
    if(nonceMatch&&usedNonces.has(nonceMatch[1])){
      packets.push({from:'server',to:'attacker',token:'REPLAY_BLOCKED',type:'blocked',time:Date.now()+500});
      log(s.replayBlocked,'success');$('resultsBox').textContent+=`\n\nReplay Attack: BLOCKED\nNonce ${nonceMatch[1]} already used!`;
    }
  }else{
    packets.push({from:'server',to:'attacker',token:'ACCESS_GRANTED',type:'response',time:Date.now()+500});
    log(s.replaySuccess,'error');$('resultsBox').textContent+=`\n\nReplay Attack: SUCCESS!\nAttacker gained unauthorized access!`;
  }
  drawCanvas()
}

function drawCanvas(){
  if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),text=getCS('--text'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);
  // Draw entities
  const entities=[{name:'Client',x:w*.15,y:60,color:'#4ade80'},{name:'Attacker',x:w*.5,y:60,color:'#f87171'},{name:'Server',x:w*.85,y:60,color:'#60a5fa'}];
  entities.forEach(e=>{ctx.fillStyle=e.color+'44';ctx.fillRect(e.x-35,e.y-15,70,30);ctx.strokeStyle=e.color;ctx.strokeRect(e.x-35,e.y-15,70,30);ctx.fillStyle=e.color;ctx.font='bold 11px Tajawal';ctx.textAlign='center';ctx.fillText(e.name,e.x,e.y+5)});
  ctx.textAlign='left';
  // Draw vertical lines
  entities.forEach(e=>{ctx.strokeStyle=`${e.color}33`;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(e.x,e.y+20);ctx.lineTo(e.x,h-20);ctx.stroke();ctx.setLineDash([])});
  // Draw packets
  const startY=100,packetH=35;
  packets.slice(-7).forEach((p,i)=>{
    const y=startY+i*packetH;const fromE=entities.find(e=>e.name.toLowerCase()===p.from);const toE=entities.find(e=>e.name.toLowerCase()===p.to);
    if(!fromE||!toE)return;
    const color=p.type==='replay'?'#f87171':p.type==='blocked'?'#fbbf24':p.type==='capture'?'#f87171':accent;
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(fromE.x,y);ctx.lineTo(toE.x,y);ctx.stroke();
    // Arrow
    const dx=toE.x-fromE.x;const dir=dx>0?1:-1;
    ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(toE.x,y);ctx.lineTo(toE.x-dir*8,y-4);ctx.lineTo(toE.x-dir*8,y+4);ctx.fill();
    // Label
    ctx.fillStyle=color;ctx.font='9px monospace';const label=p.type==='replay'?'REPLAY':p.type==='blocked'?'BLOCKED':p.type==='capture'?'CAPTURED':p.token.slice(0,25)+'...';
    ctx.fillText(label,Math.min(fromE.x,toE.x)+10,y-6)
  });
  ctx.lineWidth=1
}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'Replay Attack',p:s.wiki_replay},{t:'Nonce',p:s.wiki_nonce},{t:'Timestamp Defense',p:s.wiki_timestamp}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'Replay',p:LANG[currentLang].wiki_replay},{t:'Nonce',p:LANG[currentLang].wiki_nonce},{t:'Timestamp',p:LANG[currentLang].wiki_timestamp}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-rep-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-rep-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};
  $('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  $('authBtn').onclick=authenticate;$('captureBtn').onclick=captureToken;$('replayBtn').onclick=replayAttack;
  buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()
});

/* ═══════ ENHANCED REPLAY ATTACK VISUALIZATION (IIFE) ═══════ */
(function(){
const _c=document.createElement('canvas');
_c.style.cssText='width:100%;height:340px;border-radius:12px;margin-top:12px;display:block;background:rgba(0,0,0,.12)';
const vizS=document.querySelector('.visualization-section')||document.querySelector('.card');
if(vizS)vizS.appendChild(_c);
const _x=_c.getContext('2d');
let _t=0,_particles=[];

function _rs(){const r=_c.getBoundingClientRect();_c.width=r.width*devicePixelRatio;_c.height=r.height*devicePixelRatio;_x.scale(devicePixelRatio,devicePixelRatio)}
window.addEventListener('resize',_rs);_rs();
function _gc(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function draw(){
  const w=_c.getBoundingClientRect().width,h=_c.getBoundingClientRect().height;
  const acc=_gc('--accent'),mut=_gc('--text-muted'),txt=_gc('--text');
  _x.clearRect(0,0,w,h);_t++;

  // === Network Topology (top) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Network Authentication Flow',10,16);

  const nodes=[
    {name:'Client',x:w*0.12,y:65,icon:'C',color:'#4ade80'},
    {name:'Router',x:w*0.35,y:45,icon:'R',color:'#60a5fa'},
    {name:'Attacker',x:w*0.35,y:90,icon:'A',color:'#f87171'},
    {name:'Server',x:w*0.58,y:65,icon:'S',color:'#c084fc'},
    {name:'Auth DB',x:w*0.78,y:65,icon:'DB',color:'#fbbf24'}
  ];

  // Draw connections
  const conns=[[0,1],[1,3],[3,4],[1,2]];
  conns.forEach(([a,b])=>{
    _x.strokeStyle=mut+'44';_x.lineWidth=1;
    _x.beginPath();_x.moveTo(nodes[a].x,nodes[a].y);_x.lineTo(nodes[b].x,nodes[b].y);_x.stroke();
  });

  // Animated packet along connections
  const packetConn=_t%120<30?0:_t%120<60?1:_t%120<90?2:3;
  const progress=(_t%30)/30;
  if(packetConn<conns.length){
    const[a,b]=conns[packetConn];
    const px=nodes[a].x+(nodes[b].x-nodes[a].x)*progress;
    const py=nodes[a].y+(nodes[b].y-nodes[a].y)*progress;
    _x.fillStyle=packetConn===3?'#f87171':'#4ade80';
    _x.beginPath();_x.arc(px,py,5,0,Math.PI*2);_x.fill();
    _x.fillStyle='#fff';_x.font='bold 6px SF Mono';_x.textAlign='center';
    _x.fillText('PKT',px,py+2);_x.textAlign='left';
  }

  // Draw nodes
  nodes.forEach(n=>{
    _x.fillStyle=n.color+'33';_x.beginPath();_x.arc(n.x,n.y,20,0,Math.PI*2);_x.fill();
    _x.strokeStyle=n.color;_x.lineWidth=2;_x.beginPath();_x.arc(n.x,n.y,20,0,Math.PI*2);_x.stroke();
    _x.fillStyle=n.color;_x.font='bold 10px SF Mono';_x.textAlign='center';
    _x.fillText(n.icon,n.x,n.y+4);
    _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText(n.name,n.x,n.y+30);
    _x.textAlign='left';_x.lineWidth=1;
  });

  // === Token Structure (middle-left) ===
  const tkY=120,tkW=w*0.48;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Authentication Token Structure',10,tkY);

  const fields=[
    {name:'user',val:'alice',color:'#4ade80',w:0.2},
    {name:'nonce',val:randHex(8),color:'#60a5fa',w:0.25},
    {name:'timestamp',val:Date.now().toString(36).slice(-6),color:'#fbbf24',w:0.25},
    {name:'HMAC-sig',val:randHex(8),color:'#c084fc',w:0.3}
  ];
  let fx=10;
  fields.forEach(f=>{
    const fw=f.w*tkW;
    _x.fillStyle=f.color+'22';_x.fillRect(fx,tkY+8,fw-3,35);
    _x.strokeStyle=f.color+'66';_x.strokeRect(fx,tkY+8,fw-3,35);
    _x.fillStyle=f.color;_x.font='bold 8px SF Mono';_x.fillText(f.name,fx+3,tkY+20);
    _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText(f.val,fx+3,tkY+35);
    fx+=fw;
  });

  // === Nonce Defense Timeline (middle-right) ===
  const ndX=w*0.52,ndY=tkY;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Nonce Lifecycle & Expiration',ndX,ndY);

  const nNonces=8;
  const nW=(w*0.46)/nNonces;
  for(let i=0;i<nNonces;i++){
    const x=ndX+i*nW;
    const age=(_t+i*20)%100;
    const isExpired=age>70;
    const isActive=age<30;
    _x.fillStyle=isExpired?'#f8717133':isActive?'#4ade8044':'#fbbf2433';
    _x.fillRect(x,ndY+8,nW-3,35);
    _x.fillStyle=isExpired?'#f87171':isActive?'#4ade80':'#fbbf24';
    _x.font='7px SF Mono';_x.textAlign='center';
    _x.fillText(`N${i}`,x+nW/2,ndY+20);
    _x.fillText(isExpired?'EXPIRED':isActive?'ACTIVE':'AGING',x+nW/2,ndY+36);
    // TTL bar
    const ttl=Math.max(0,1-age/100);
    _x.fillStyle=`rgba(${isExpired?248:74},${isExpired?113:222},${isExpired?113:128},.3)`;
    _x.fillRect(x+2,ndY+38,ttl*(nW-7),4);
    _x.textAlign='left';
  }

  // === Replay Detection Matrix (bottom-left) ===
  const rdY=tkY+55,rdW=w*0.48,rdH=h-rdY-65;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Challenge-Response Protocol',10,rdY);

  const steps=[
    {label:'1. Client -> Server: Hello',color:'#4ade80'},
    {label:'2. Server -> Client: Challenge (random)',color:'#c084fc'},
    {label:'3. Client -> Server: HMAC(key, challenge)',color:'#4ade80'},
    {label:'4. Server verifies HMAC',color:'#c084fc'},
    {label:'5. Attacker replays step 3...',color:'#f87171'},
    {label:'6. Server rejects: stale challenge!',color:'#f87171'}
  ];
  steps.forEach((s,i)=>{
    const y=rdY+12+i*18;
    const active=Math.floor(_t/40)%steps.length===i;
    _x.fillStyle=active?s.color+'44':'rgba(255,255,255,.02)';
    _x.fillRect(10,y,rdW-5,16);
    _x.fillStyle=active?s.color:mut;
    _x.font='9px SF Mono';_x.fillText(s.label,14,y+12);
    if(active){
      _x.fillStyle=s.color;_x.beginPath();_x.arc(rdW+2,y+8,3,0,Math.PI*2);_x.fill();
    }
  });

  // === Timestamp Window (bottom-right) ===
  const twX=w*0.52,twY=rdY,twW=w*0.46,twH=h-rdY-65;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Timestamp Acceptance Window',twX,twY);

  const windowSize=60;
  const timeline=twW-10;
  const now=_t%200;
  // Timeline
  _x.fillStyle='rgba(255,255,255,.03)';_x.fillRect(twX,twY+15,timeline,25);
  // Acceptance window
  const winStart=Math.max(0,(now-windowSize/2)/200)*timeline;
  const winEnd=Math.min(200,(now+windowSize/2))/200*timeline;
  _x.fillStyle='#4ade8022';_x.fillRect(twX+winStart,twY+15,winEnd-winStart,25);
  _x.strokeStyle='#4ade80';_x.strokeRect(twX+winStart,twY+15,winEnd-winStart,25);
  // Now marker
  const nowX=twX+(now/200)*timeline;
  _x.fillStyle='#fbbf24';_x.beginPath();_x.moveTo(nowX,twY+12);_x.lineTo(nowX-4,twY+8);_x.lineTo(nowX+4,twY+8);_x.fill();
  _x.fillStyle='#fbbf24';_x.font='7px SF Mono';_x.fillText('NOW',nowX-8,twY+7);

  // Incoming requests (some in window, some out)
  for(let i=0;i<12;i++){
    const reqTime=(i*17+_t*0.5)%200;
    const rx=twX+(reqTime/200)*timeline;
    const inWindow=Math.abs(reqTime-now)<windowSize/2;
    _x.fillStyle=inWindow?'#4ade80':'#f87171';
    _x.beginPath();_x.arc(rx,twY+28,3,0,Math.PI*2);_x.fill();
  }

  _x.fillStyle=mut;_x.font='8px Tajawal';
  _x.fillText('Green = accepted, Red = rejected (outside window)',twX,twY+50);

  // === Sequence Number Counter (bottom) ===
  const seqY=h-55;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Sequence Number Defense',10,seqY);
  const seqCount=16;
  const seqW=(w-20)/seqCount;
  for(let i=0;i<seqCount;i++){
    const val=(_t+i*7)%256;
    const isMonotonic=i===0||val>((_t+(i-1)*7)%256);
    _x.fillStyle=isMonotonic?'#4ade8022':'#f8717122';
    _x.fillRect(10+i*seqW,seqY+8,seqW-2,22);
    _x.fillStyle=isMonotonic?'#4ade80':'#f87171';_x.font='bold 8px SF Mono';_x.textAlign='center';
    _x.fillText(`${val}`,10+i*seqW+seqW/2,seqY+22);
    _x.textAlign='left';
  }
  _x.fillStyle=mut;_x.font='8px Tajawal';
  _x.fillText('Monotonically increasing sequence prevents replay',10,seqY+38);

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
