/**
 * Elliptic Curve Attack — Workshop DIY v1.0
 * Solve ECDLP on small curves using Baby-Step Giant-Step
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

const LANG={en:{
    ...LANG_BASE.en,title:'Elliptic Curve Attack',subtitle:'Solve the discrete log on weak elliptic curves',mainSection:'EC Discrete Log',mainDesc:'Visualize point addition and BSGS on curves',results:'Results',vizTitle:'Elliptic Curve Visualization',vizHint:'See point addition and scalar multiplication',sectionA:'Curve Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',solving:'Solving ECDLP...',solved:'Discrete log found!',howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "Curve Reference" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',wiki_ec:'منحنى إهليلجي: y^2 = x^3 + ax + b (mod p). This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_add:'جمع النقاط: قاعدة الوتر والمماس. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_bsgs:'BSGS: خطوات صغيرة {jG}، خطوات كبيرة {Q-imG}. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',mathExplain:'Elliptic Curve y^2 = x^3 + ax + b (mod p)\n\nPoint Addition:\nP + Q: lambda = (yQ-yP)/(xQ-xP) mod p\nxR = lambda^2 - xP - xQ mod p\nyR = lambda(xP-xR) - yP mod p\n\nPoint Doubling:\n2P: lambda = (3xP^2+a)/(2yP) mod p\n\nBSGS to solve Q = kG:\nm = ceil(sqrt(n))\nBaby: {jG : j=0..m}\nGiant: {Q-imG : i=0..m}\nMatch: k = im + j',step1Title:'Set Up',step1Desc:'Configure the parameters for Elliptic Curve Attack. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Curve Reference" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Math Deep Dive". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is Elliptic Curve Attack?',faq_a1:'Elliptic Curve Attack lets you visualize point addition and bsgs on curves. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real cryptography behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real cryptography principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to Elliptic Curve Attack! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Set curve parameters (a, b, p). Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Curve Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how cryptography works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32)  # 32 bytes = 256 bits\\niv = os.urandom(16)   # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key:        {key.hex()}")\\nprint(f"IV:         {iv.hex()}")\\nprint(f"Plaintext:  {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered:  {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',wiki_concept_title:'🔬 What is Elliptic Curve Attack?',wiki_concept:'Elliptic Curve Attack is a technique used in cryptography. Visualize point addition and BSGS on curves. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the parameters for Elliptic Curve Attack. Choose your input settings using the controls in the main card. Each control directly affects the simulation output. Second: Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs. The simulation runs these stages in real time, showing you intermediate results at each step. In real cryptography, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Elliptic Curve Attack has practical applications in cryptography. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Elliptic Curve Attack: Visualize point addition and BSGS on curves. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Choose Algorithm through Set Up Attack to Execute Attack and Analyze Results.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Curve Reference" and "Math Deep Dive" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
fr:{title:'Attaque Courbe Elliptique',subtitle:'Resolvez le log discret sur courbes faibles',mainSection:'Log Discret EC',mainDesc:'Visualisez l\'addition de points et BSGS',results:'Resultats',vizTitle:'Visualisation Courbe',vizHint:'Addition de points et multiplication scalaire',sectionA:'Reference',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',solving:'Resolution ECDLP...',solved:'Log discret trouve!',howto_1:'Definir les parametres.',howto_2:'Definir G et Q.',howto_3:'Cliquer Resoudre.',howto_4:'Regarder BSGS.',wiki_ec:'Courbe elliptique: y^2 = x^3 + ax + b (mod p).',wiki_add:'Addition de points: regle de la corde et tangente.',wiki_bsgs:'BSGS: baby steps {jG}, giant steps {Q-imG}.',mathExplain:'y^2 = x^3 + ax + b (mod p)\n\nBSGS: m = ceil(sqrt(n))',step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule cryptographic attacks ! 🔬 Tu peux expérimenter avec breaking encryption en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Length Extension Lab and Cry Meet In Middle Lab ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
ar:{title:'هجوم المنحنى الإهليلجي',subtitle:'حل مسألة اللوغاريتم المتقطع على منحنيات ضعيفة',mainSection:'لوغاريتم متقطع EC',mainDesc:'تصور جمع النقاط و BSGS',results:'النتائج',vizTitle:'تصور المنحنى',vizHint:'جمع النقاط والضرب العددي',sectionA:'مرجع',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',solving:'جاري حل ECDLP...',solved:'تم إيجاد اللوغاريتم!',howto_1:'عيّن المعاملات.',howto_2:'عيّن G و Q.',howto_3:'اضغط حل.',howto_4:'شاهد BSGS.',wiki_ec:'منحنى إهليلجي: y^2 = x^3 + ax + b (mod p).',wiki_add:'جمع النقاط: قاعدة الوتر والمماس.',wiki_bsgs:'BSGS: خطوات صغيرة {jG}، خطوات كبيرة {Q-imG}.',mathExplain:'y^2 = x^3 + ax + b (mod p)\n\nBSGS: m = ceil(sqrt(n))',step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي cryptographic attacks! 🔬 يمكنك التجربة مع breaking encryption في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Length Extension Lab and Cry Meet In Middle Lab! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}};
let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;if($('langSelect'))$('langSelect').value=l;try{localStorage.setItem('cry-ec-lang',l)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));if($('themeSelect'))$('themeSelect').value=n;try{localStorage.setItem('cry-ec-theme',n)}catch{}}
let soundEnabled=false;function playSound(t){if(!soundEnabled)return;const a=new(window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);g.gain.value=.08;o.frequency.value=t==='success'?523:200;g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.2);o.start();o.stop(a.currentTime+.2)}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success')}
function showToast(m){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(p,o){p.classList.toggle('open');if(o)o.classList.toggle('active',p.classList.contains('open'))}

/* ═══════ ELLIPTIC CURVE MATH (mod p) ═══════ */
let curveA=2,curveB=3,curveP=97,points=[],babySteps=[],giantSteps=[];
function modInverse(a,p){let[old_r,r]=[a%p,p],[old_s,s]=[1,0];while(r!==0){const q=Math.floor(old_r/r);[old_r,r]=[r,old_r-q*r];[old_s,s]=[s,old_s-q*s]}return((old_s%p)+p)%p}
function ecAdd(P,Q,a,p){if(!P)return Q;if(!Q)return P;if(P[0]===Q[0]&&P[1]===Q[1]){if(P[1]===0)return null;const lam=((3*P[0]*P[0]+a)*modInverse(2*P[1],p))%p;const x=((lam*lam-2*P[0])%p+p)%p;const y=((lam*(P[0]-x)-P[1])%p+p)%p;return[x,y]}
  if(P[0]===Q[0])return null;const lam=((Q[1]-P[1])*modInverse((Q[0]-P[0]+p)%p,p))%p;const lp=((lam%p)+p)%p;const x=((lp*lp-P[0]-Q[0])%p+p)%p;const y=((lp*(P[0]-x)-P[1])%p+p)%p;return[x,y]}
function ecMul(k,P,a,p){let R=null,Q=[...P];while(k>0){if(k&1)R=ecAdd(R,Q,a,p);Q=ecAdd(Q,Q,a,p);k>>=1}return R}
function findCurvePoints(){points=[];for(let x=0;x<curveP;x++){const rhs=(x*x*x+curveA*x+curveB)%curveP;for(let y=0;y<curveP;y++)if((y*y)%curveP===rhs)points.push([x,y])}}

function solveDLP(){
  findCurvePoints();if(points.length<2){log('Not enough points on curve','error');return}
  const G=points[0];const secret=Math.floor(Math.random()*(points.length-1))+1;const Q=ecMul(secret,G,curveA,curveP);
  const n=points.length+1;const m=Math.ceil(Math.sqrt(n));const s=LANG[currentLang];
  log(s.solving,'info');showToast(s.solving);
  // Baby steps: jG for j=0..m
  babySteps=[];const baby={};let jP=null;
  for(let j=0;j<=m;j++){const key=jP?`${jP[0]},${jP[1]}`:'inf';baby[key]=j;babySteps.push({j,point:jP?[...jP]:null});jP=ecAdd(jP,G,curveA,curveP)}
  // Giant steps: Q-imG for i=0..m
  const mG=ecMul(m,G,curveA,curveP);const negmG=mG?[mG[0],(curveP-mG[1])%curveP]:null;
  giantSteps=[];let gamma=Q?[...Q]:null;let found=-1;
  for(let i=0;i<=m;i++){const key=gamma?`${gamma[0]},${gamma[1]}`:'inf';giantSteps.push({i,point:gamma?[...gamma]:null});
    if(baby[key]!==undefined){found=i*m+baby[key];break}
    gamma=ecAdd(gamma,negmG,curveA,curveP)}
  hideToast();
  $('resultsBox').textContent=`Curve: y^2 = x^3 + ${curveA}x + ${curveB} (mod ${curveP})\nPoints on curve: ${points.length}\nG = (${G[0]}, ${G[1]})\nQ = kG = (${Q?Q[0]:'inf'}, ${Q?Q[1]:'inf'})\n\nBSGS: m = ${m}\nBaby steps: ${babySteps.length}\nGiant steps: ${giantSteps.length}\n\n${found>=0?`k = ${found} (secret was ${secret})\n${found===secret?s.solved:'Mismatch - try again'}`:'No solution found'}`;
  if(found>=0)log(`${s.solved} k=${found}`,'success');drawCanvas()
}

const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawCanvas(){if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),muted=getCS('--text-muted');ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText(`EC: y^2 = x^3 + ${curveA}x + ${curveB} (mod ${curveP})`,10,22);
  // Plot curve points
  if(points.length>0){const scale=Math.min((w-40)/curveP,(h-60)/curveP);const ox=20,oy=40;
    // Grid
    ctx.strokeStyle=`${accent}11`;for(let i=0;i<=curveP;i+=10){ctx.beginPath();ctx.moveTo(ox+i*scale,oy);ctx.lineTo(ox+i*scale,oy+curveP*scale);ctx.stroke();ctx.beginPath();ctx.moveTo(ox,oy+i*scale);ctx.lineTo(ox+curveP*scale,oy+i*scale);ctx.stroke()}
    // Points
    points.forEach(p=>{ctx.fillStyle=`${accent}44`;ctx.beginPath();ctx.arc(ox+p[0]*scale,oy+(curveP-p[1])*scale,3,0,Math.PI*2);ctx.fill()});
    // Baby steps
    babySteps.forEach(b=>{if(b.point){ctx.fillStyle='#4ade80';ctx.beginPath();ctx.arc(ox+b.point[0]*scale,oy+(curveP-b.point[1])*scale,4,0,Math.PI*2);ctx.fill()}});
    // Giant steps
    giantSteps.forEach(g=>{if(g.point){ctx.strokeStyle='#f87171';ctx.lineWidth=2;ctx.beginPath();ctx.arc(ox+g.point[0]*scale,oy+(curveP-g.point[1])*scale,6,0,Math.PI*2);ctx.stroke()}});
    ctx.lineWidth=1;
    // Legend
    ctx.fillStyle='#4ade80';ctx.font='10px Tajawal';ctx.fillText('Baby steps (green)',w-150,h-30);
    ctx.fillStyle='#f87171';ctx.fillText('Giant steps (red)',w-150,h-16)}}

function buildControls(){$('controlsArea').innerHTML=`<div class="control-section"><div class="section-header"><div class="section-title">Curve Parameters</div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><div style="flex:1"><label style="font-size:.72rem;color:var(--text-muted)">a</label><input type="number" id="paramA" value="2"/></div><div style="flex:1"><label style="font-size:.72rem;color:var(--text-muted)">b</label><input type="number" id="paramB" value="3"/></div><div style="flex:1"><label style="font-size:.72rem;color:var(--text-muted)">p (prime)</label><input type="number" id="paramP" value="97"/></div></div></div><div class="control-section"><div style="display:flex;gap:8px"><button id="solveBtn" class="primary" style="flex:1">Solve ECDLP (BSGS)</button></div></div>`;
  $('solveBtn').onclick=()=>{curveA=parseInt($('paramA').value);curveB=parseInt($('paramB').value);curveP=parseInt($('paramP').value);solveDLP()}}
function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'EC',p:s.wiki_ec},{t:'Addition',p:s.wiki_add},{t:'BSGS',p:s.wiki_bsgs}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'EC',p:LANG[currentLang].wiki_ec},{t:'Addition',p:LANG[currentLang].wiki_add},{t:'BSGS',p:LANG[currentLang].wiki_bsgs}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}
document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-ec-lang');if(l&&LANG[l])setLanguage(l)}catch{}try{const t=localStorage.getItem('cry-ec-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};$('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  buildControls();buildHelp();buildRef();buildMath();findCurvePoints();log(LANG[currentLang].ready,'success');drawCanvas()});

/* ═══════ ENHANCED ELLIPTIC CURVE VISUALIZATION (IIFE) ═══════ */
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

  // === Real-valued EC curve (top-left) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Elliptic Curve (real plane): y^2 = x^3 + ax + b',10,16);

  const ecW=w*0.45,ecH=140,ecX=20,ecY=28;
  const a=-1,b=1;
  // Draw axes
  _x.strokeStyle=mut+'44';_x.lineWidth=1;
  _x.beginPath();_x.moveTo(ecX+ecW/2,ecY);_x.lineTo(ecX+ecW/2,ecY+ecH);_x.stroke();
  _x.beginPath();_x.moveTo(ecX,ecY+ecH/2);_x.lineTo(ecX+ecW,ecY+ecH/2);_x.stroke();

  // Plot curve
  _x.strokeStyle='#60a5fa';_x.lineWidth=2;
  const scale=ecH/6;
  for(let sign=-1;sign<=1;sign+=2){
    _x.beginPath();let started=false;
    for(let px=-2;px<=3;px+=0.02){
      const rhs=px*px*px+a*px+b;
      if(rhs<0)continue;
      const py=sign*Math.sqrt(rhs);
      const sx=ecX+ecW/2+px*scale*0.9;
      const sy=ecY+ecH/2-py*scale*0.6;
      if(sx<ecX||sx>ecX+ecW||sy<ecY||sy>ecY+ecH)continue;
      if(!started){_x.moveTo(sx,sy);started=true}else _x.lineTo(sx,sy);
    }
    _x.stroke();
  }
  _x.lineWidth=1;

  // Animate point addition P+Q=R
  const phase=_t*0.01;
  const Px=-0.5+Math.sin(phase)*0.3;
  const Pyrhs=Px*Px*Px+a*Px+b;
  if(Pyrhs>=0){
    const Py=Math.sqrt(Pyrhs);
    const Qx=1.2;const Qyrhs=Qx*Qx*Qx+a*Qx+b;
    if(Qyrhs>=0){
      const Qy=Math.sqrt(Qyrhs);
      // Draw P
      const spx=ecX+ecW/2+Px*scale*0.9,spy=ecY+ecH/2-Py*scale*0.6;
      _x.fillStyle='#4ade80';_x.beginPath();_x.arc(spx,spy,4,0,Math.PI*2);_x.fill();
      _x.fillStyle='#4ade80';_x.font='bold 9px SF Mono';_x.fillText('P',spx+6,spy-2);
      // Draw Q
      const sqx=ecX+ecW/2+Qx*scale*0.9,sqy=ecY+ecH/2-Qy*scale*0.6;
      _x.fillStyle='#fbbf24';_x.beginPath();_x.arc(sqx,sqy,4,0,Math.PI*2);_x.fill();
      _x.fillText('Q',sqx+6,sqy-2);
      // Line through P and Q
      _x.strokeStyle='#f8717144';_x.setLineDash([3,3]);
      _x.beginPath();_x.moveTo(spx-50,spy+(sqy-spy)/(sqx-spx)*(-50));_x.lineTo(sqx+50,sqy-(sqy-spy)/(sqx-spx)*(-50));_x.stroke();
      _x.setLineDash([]);
    }
  }

  // === Group Order and Subgroups (top-right) ===
  const goX=w*0.52,goY=10;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Curve Point Group Structure',goX,16);

  const p=curveP;
  const nPts=points.length||50;
  const goW=w*0.46,goH=140;
  const radius=Math.min(goW,goH)*0.35;
  const cx=goX+goW/2,cy=goY+goH/2+10;

  // Draw cyclic group as circle
  _x.strokeStyle=mut+'33';_x.lineWidth=1;
  _x.beginPath();_x.arc(cx,cy,radius,0,Math.PI*2);_x.stroke();

  // Place points around circle
  const displayPts=Math.min(nPts,60);
  for(let i=0;i<displayPts;i++){
    const angle=(i/displayPts)*Math.PI*2-Math.PI/2;
    const px=cx+Math.cos(angle)*radius;
    const py=cy+Math.sin(angle)*radius;
    const isGenerator=i===0;
    const isActive=i<=(_t%displayPts);
    const sz=isGenerator?5:isActive?3:2;
    _x.fillStyle=isGenerator?'#f87171':isActive?'#4ade80':`${acc}33`;
    _x.beginPath();_x.arc(px,py,sz,0,Math.PI*2);_x.fill();

    // Scalar multiplication path
    if(isActive&&i>0){
      const prevAngle=((i-1)/displayPts)*Math.PI*2-Math.PI/2;
      const ppx=cx+Math.cos(prevAngle)*radius;
      const ppy=cy+Math.sin(prevAngle)*radius;
      _x.strokeStyle='#4ade8022';_x.beginPath();_x.moveTo(ppx,ppy);_x.lineTo(px,py);_x.stroke();
    }
  }
  _x.fillStyle=mut;_x.font='9px SF Mono';_x.textAlign='center';
  _x.fillText(`|E| = ${nPts} points`,cx,cy+4);
  _x.fillText(`GF(${p})`,cx,cy+16);_x.textAlign='left';

  // === BSGS Algorithm Steps (bottom-left) ===
  const bsY=ecY+ecH+20,bsW=w*0.48,bsH=h-bsY-25;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Baby-Step Giant-Step Algorithm',10,bsY);

  const m=Math.ceil(Math.sqrt(nPts));
  const babyW=bsW*0.48,giantW=bsW*0.48;

  // Baby steps table
  _x.fillStyle='#4ade80';_x.font='bold 9px SF Mono';_x.fillText(`Baby Steps (0..${m})`,10,bsY+14);
  const bRows=Math.min(m,12);
  for(let j=0;j<bRows;j++){
    const y=bsY+22+j*12;
    const active=j<=(_t%(bRows+5));
    _x.fillStyle=active?'#4ade8033':'rgba(255,255,255,.02)';
    _x.fillRect(10,y,babyW,10);
    _x.fillStyle=active?'#4ade80':mut;_x.font='7px SF Mono';
    _x.fillText(`j=${j}: jG = (${(j*7+3)%p}, ${(j*11+5)%p})`,12,y+8);
  }

  // Giant steps table
  _x.fillStyle='#f87171';_x.font='bold 9px SF Mono';_x.fillText(`Giant Steps (0..${m})`,10+babyW+10,bsY+14);
  for(let i=0;i<bRows;i++){
    const y=bsY+22+i*12;
    const active=i<=(_t%(bRows+5));
    _x.fillStyle=active?'#f8717133':'rgba(255,255,255,.02)';
    _x.fillRect(10+babyW+10,y,giantW,10);
    _x.fillStyle=active?'#f87171':mut;_x.font='7px SF Mono';
    _x.fillText(`i=${i}: Q-imG = (${(i*13+2)%p}, ${(i*17+1)%p})`,12+babyW+10,y+8);
  }

  // Match indicator
  if(_t%80>60){
    const matchY=bsY+22+5*12;
    _x.strokeStyle='#fbbf24';_x.lineWidth=2;
    _x.strokeRect(10,matchY,babyW,10);
    _x.strokeRect(10+babyW+10,matchY,giantW,10);
    _x.fillStyle='#fbbf24';_x.font='bold 9px SF Mono';
    _x.fillText('MATCH! k = im + j',10+bsW/2-40,bsY+bsH-5);
    _x.lineWidth=1;
  }

  // === Key Size Security Levels (bottom-right) ===
  const ksX=w*0.52,ksY=bsY,ksW=w*0.46;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('ECC vs RSA Key Size Comparison',ksX,ksY);

  const comparisons=[
    {ecc:160,rsa:1024,aes:80,color:'#f87171'},
    {ecc:224,rsa:2048,aes:112,color:'#fbbf24'},
    {ecc:256,rsa:3072,aes:128,color:'#4ade80'},
    {ecc:384,rsa:7680,aes:192,color:'#60a5fa'},
    {ecc:521,rsa:15360,aes:256,color:'#c084fc'}
  ];

  const maxRSA=15360,barMaxW=ksW-100;
  _x.fillStyle=mut;_x.font='8px SF Mono';_x.fillText('ECC   RSA      Security',ksX,ksY+14);

  comparisons.forEach((c,i)=>{
    const y=ksY+22+i*24;
    // ECC bar
    const eccW=(c.ecc/521)*barMaxW*0.15;
    _x.fillStyle=c.color+'66';_x.fillRect(ksX,y,eccW,10);
    _x.fillStyle=c.color;_x.font='bold 7px SF Mono';_x.fillText(`${c.ecc}`,ksX+eccW+3,y+8);
    // RSA bar
    const rsaW=(c.rsa/maxRSA)*barMaxW*0.7;
    _x.fillStyle=c.color+'33';_x.fillRect(ksX,y+11,rsaW,8);
    _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText(`RSA-${c.rsa}`,ksX+rsaW+3,y+18);
    // AES equivalent
    _x.fillStyle=c.color;_x.font='bold 7px SF Mono';
    _x.fillText(`= AES-${c.aes}`,ksX+barMaxW+10,y+12);
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
