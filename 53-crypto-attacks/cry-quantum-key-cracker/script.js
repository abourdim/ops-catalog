/**
 * Quantum Key Cracker — Workshop DIY v1.0
 * Simulate Shor's algorithm for RSA factoring via quantum period-finding
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
    ...LANG_BASE.en,title:'Quantum Key Cracker',subtitle:"Simulate Shor's algorithm breaking RSA",mainSection:'Quantum Attack Simulator',mainDesc:'Watch qubits find period via QFT to factor N',modulusLabel:'RSA Modulus N',runShor:"Run Shor's Algorithm",stop:'Stop',results:'Results',vizTitle:'Quantum Circuit Visualization',vizHint:'Watch qubit states evolve through QFT',sectionA:'Algorithm Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',running:'Running quantum simulation...',factored:'N factored!',periodFound:'Period found!',
    faq_q1:"What is Shor's algorithm?",
    howto_1:'Enter an RSA modulus N (product of two primes).',howto_2:"Click Run Shor's Algorithm.",howto_3:'Watch the quantum circuit visualization.',howto_4:'See the period found and factors extracted.',
    wiki_shor:"Shor's algorithm: 1) Pick random a<N, 2) Find period r of a^x mod N using QFT, 3) If r is even, compute gcd(a^(r/2)+-1, N).",wiki_qft:'Quantum Fourier Transform converts computational basis states to frequency domain, revealing the period of modular exponentiation.',wiki_postq:'Post-quantum cryptography: lattice-based (CRYSTALS-Kyber), hash-based (SPHINCS+), code-based schemes resist quantum attacks.',
    mathExplain:"Shor's Algorithm Steps:\n\n1. Choose random a, 1 < a < N\n2. If gcd(a, N) > 1, done (lucky factor)\n3. Quantum period-finding:\n   |0>|1> -> QFT -> measure period r\n   where f(x) = a^x mod N has period r\n4. If r is odd, retry\n5. Compute:\n   p = gcd(a^(r/2) - 1, N)\n   q = gcd(a^(r/2) + 1, N)\n\nComplexity: O((log N)^3) vs O(exp((log N)^(1/3))) classical",step1Title:'Choose Algorithm',step1Desc:'Select the cryptographic algorithm and key parameters to analyze.',step2Title:'Set Up Attack',step2Desc:'Configure the attack parameters: known plaintext, side-channel data, or timing.',step3Title:'Execute Attack',step3Desc:'Run the cryptographic attack and attempt to recover the secret key.',step4Title:'Analyze Results',step4Desc:'Evaluate attack success rate and understand the vulnerability exploited.',sectionCode:'Device Code',faq_q1:'What is Quantum Key Cracker?',faq_a1:'Quantum Key Cracker lets you watch qubits find period via qft to factor n. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you select the cryptographic algorithm and key parameters to analyze. Then you configure the attack parameters: known plaintext, side-channel data, or timing.',faq_q3:'What do the controls do?',faq_a3:'Enter an RSA modulus N (product of two primes). Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'QFT يحول حالات الأساس إلى المجال الترددي.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to Quantum Key Cracker! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Enter an RSA modulus N (product of two primes). Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Algorithm Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how cryptography works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Algorithm Reference" and "Math Deep Dive" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Casseur Quantique',subtitle:"Simulez l'algorithme de Shor cassant RSA",mainSection:'Simulateur Quantique',mainDesc:'Regardez les qubits trouver la periode via QFT',modulusLabel:'Module RSA N',runShor:'Lancer Shor',stop:'Arreter',results:'Resultats',vizTitle:'Circuit Quantique',vizHint:'Regardez les etats des qubits evoluer',sectionA:'Reference',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',running:'Simulation quantique...',factored:'N factorise!',periodFound:'Periode trouvee!',
    howto_1:'Entrez un module N.',howto_2:'Cliquez Lancer.',howto_3:'Regardez le circuit.',howto_4:'Voyez les facteurs.',
    wiki_shor:'Shor: choisir a, trouver la periode de a^x mod N par QFT, calculer gcd.',wiki_qft:'QFT transforme les etats de base en domaine frequentiel.',wiki_postq:'Cryptographie post-quantique: reseaux, hachage, codes correcteurs.',
    mathExplain:'Algorithme de Shor:\n1. Choisir a aleatoire\n2. Si pgcd(a,N)>1, facteur trouve\n3. Trouver la periode r par QFT\n4. Si r pair: p=pgcd(a^(r/2)-1,N)',step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule cryptographic attacks ! 🔬 Tu peux expérimenter avec breaking encryption en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Meet In Middle Lab and Cry Known Plaintext Attack ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'كاسر المفاتيح الكمي',subtitle:'حاكي خوارزمية شور لكسر RSA',mainSection:'محاكي الهجوم الكمي',mainDesc:'شاهد الكيوبتات تجد الدورة عبر QFT',modulusLabel:'معامل RSA N',runShor:'تشغيل شور',stop:'إيقاف',results:'النتائج',vizTitle:'تصور الدائرة الكمية',vizHint:'شاهد حالات الكيوبت تتطور عبر QFT',sectionA:'مرجع',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',running:'جاري المحاكاة الكمية...',factored:'تم تحليل N!',periodFound:'تم إيجاد الدورة!',
    howto_1:'أدخل معامل N.',howto_2:'اضغط تشغيل.',howto_3:'شاهد الدائرة.',howto_4:'شاهد العوامل.',
    wiki_shor:'شور: اختر a، جد دورة a^x mod N بواسطة QFT، احسب القاسم المشترك.',wiki_qft:'QFT يحول حالات الأساس إلى المجال الترددي.',wiki_postq:'تشفير ما بعد الكم: شبكات، تجزئة، رموز تصحيح.',
    mathExplain:'خوارزمية شور:\n1. اختر a عشوائي\n2. إذا gcd(a,N)>1 فقد وجدت عاملا\n3. جد الدورة r بواسطة QFT\n4. إذا r زوجي: p=gcd(a^(r/2)-1,N)',step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي cryptographic attacks! 🔬 يمكنك التجربة مع breaking encryption في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Meet In Middle Lab and Cry Known Plaintext Attack! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;if($('langSelect'))$('langSelect').value=lang;try{localStorage.setItem('cry-qkc-lang',lang)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));if($('themeSelect'))$('themeSelect').value=n;try{localStorage.setItem('cry-qkc-theme',n)}catch{}log(`${LANG[currentLang].themeChanged} ${n}`,'info')}
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const tm=audioCtx.currentTime;o.frequency.value=t==='success'?523:t==='error'?200:800;o.type=t==='error'?'square':'sine';g.gain.exponentialRampToValueAtTime(.001,tm+.2);o.start(tm);o.stop(tm+.2)}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success')}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(p,o){p.classList.toggle('open');if(o)o.classList.toggle('active',p.classList.contains('open'))}

/* ═══════ SHOR'S ALGORITHM SIMULATION ═══════ */
function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a}
function modPow(base,exp,mod){let r=1;base%=mod;while(exp>0){if(exp%2===1)r=(r*base)%mod;exp=Math.floor(exp/2);base=(base*base)%mod}return r}
function findPeriod(a,N){for(let r=1;r<N;r++)if(modPow(a,r,N)===1)return r;return-1}

let running=false,simSteps=[],animFrame,currentStep=0;
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function runShor(){
  const N=parseInt($('modulusInput').value);if(!N||N<6){log('Enter N >= 6','error');return}
  const s=LANG[currentLang];running=true;simSteps=[];currentStep=0;
  log(s.running,'info');showToast(s.running);$('resultsBox').textContent='';

  // Step 1: Check trivial
  if(N%2===0){simSteps.push({type:'trivial',msg:`N=${N} is even. Factor: 2`});finish(2,N/2);return}

  // Step 2: Pick random a
  let a=2+Math.floor(Math.random()*(N-3));let g=gcd(a,N);
  simSteps.push({type:'pick',a,gcd:g,msg:`Picked a=${a}, gcd(${a},${N})=${g}`});
  if(g>1){simSteps.push({type:'lucky',msg:`Lucky! gcd gave factor ${g}`});finish(g,N/g);return}

  // Step 3: Find period (classical simulation of quantum part)
  simSteps.push({type:'qft_start',msg:'Initializing quantum registers...'});
  const modValues=[];for(let x=0;x<N;x++){const v=modPow(a,x,N);modValues.push(v);simSteps.push({type:'mod_exp',x,val:v})}

  const r=findPeriod(a,N);
  simSteps.push({type:'period',r,msg:`QFT measurement: period r=${r}`});

  if(r<0||r%2!==0){
    simSteps.push({type:'retry',msg:'Period is odd or not found. Would retry with new a.'});
    // Try again with different a
    for(let attempt=0;attempt<10;attempt++){
      a=2+Math.floor(Math.random()*(N-3));g=gcd(a,N);if(g>1){finish(g,N/g);return}
      const r2=findPeriod(a,N);if(r2>0&&r2%2===0){
        const p=gcd(modPow(a,r2/2,N)-1,N),q=gcd(modPow(a,r2/2,N)+1,N);
        if(p>1&&p<N){simSteps.push({type:'found',msg:`Retry a=${a}, r=${r2}, factors: ${p}, ${N/p}`});finish(p,N/p);return}
      }
    }
    simSteps.push({type:'fail',msg:'Could not find factors (try different N)'});
    running=false;hideToast();
  }else{
    const half=modPow(a,r/2,N);const p=gcd(half-1,N),q=gcd(half+1,N);
    if(p>1&&p<N){simSteps.push({type:'found',msg:`Factors: ${p} x ${N/p}`});finish(p,N/p)}
    else{simSteps.push({type:'fail',msg:`a^(r/2) mod N = ${half}, gcd gave trivial factors. Retry.`});running=false;hideToast()}
  }
  animateSteps()
}

function finish(p,q){
  running=false;hideToast();const s=LANG[currentLang];
  $('resultsBox').textContent=simSteps.map(s=>s.msg||`x=${s.x}: ${s.a||''}^${s.x||''} mod N = ${s.val||''}`).filter(m=>m).join('\n')+`\n\n${s.factored}\np = ${p}\nq = ${q}\nN = ${p} x ${q} = ${p*q}`;
  log(`${s.factored} ${p} x ${q}`,'success');drawCanvas()
}

function animateSteps(){
  if(currentStep>=simSteps.length){running=false;hideToast();return}
  drawCanvas();currentStep++;
  if(running)animFrame=setTimeout(animateSteps,100)
}

function drawCanvas(){
  if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),accent2=getCS('--accent2'),text=getCS('--text'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText("Shor's Algorithm — Quantum Circuit",10,22);

  const N=parseInt($('modulusInput').value)||15;
  const nQubits=Math.ceil(Math.log2(N))*2;
  ctx.fillStyle=muted;ctx.font='11px Tajawal';ctx.fillText(`N=${N}, Qubits needed: ~${nQubits}`,10,38);

  // Draw qubit wires
  const wireY=60,wireSpacing=25,nWires=Math.min(8,nQubits);
  for(let i=0;i<nWires;i++){
    const y=wireY+i*wireSpacing;ctx.strokeStyle=`${accent}44`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(60,y);ctx.lineTo(w-20,y);ctx.stroke();
    ctx.fillStyle=muted;ctx.font='10px monospace';ctx.fillText(`|q${i}>`,10,y+4);
    // Qubit state circles
    const phase=currentStep*0.3+i*0.5;const stateX=60+((currentStep*5)%(w-100));
    ctx.fillStyle=`${accent}88`;ctx.beginPath();ctx.arc(stateX,y,4+2*Math.sin(phase),0,Math.PI*2);ctx.fill();
  }

  // Draw gates based on steps
  const gateW=30,gateH=20;
  const visibleSteps=simSteps.slice(0,currentStep);
  const modExpSteps=visibleSteps.filter(s=>s.type==='mod_exp');

  // Draw modular exponentiation values as a histogram
  if(modExpSteps.length>0){
    const histY=wireY+nWires*wireSpacing+20,histH=h-histY-40;
    ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('a^x mod N (period visible in pattern)',10,histY-4);
    const barW=Math.max(1,(w-20)/modExpSteps.length);
    modExpSteps.forEach((s,i)=>{
      const barH=(s.val/N)*histH;
      ctx.fillStyle=`${accent}66`;ctx.fillRect(10+i*barW,histY+histH-barH,barW-1,barH);
    });
    // Period markers
    const periodStep=visibleSteps.find(s=>s.type==='period');
    if(periodStep&&periodStep.r>0){
      ctx.strokeStyle='#f87171';ctx.lineWidth=2;ctx.setLineDash([4,4]);
      for(let x=periodStep.r;x<modExpSteps.length;x+=periodStep.r){
        const px=10+x*barW;ctx.beginPath();ctx.moveTo(px,histY);ctx.lineTo(px,histY+histH);ctx.stroke();
      }
      ctx.setLineDash([]);ctx.fillStyle='#f87171';ctx.font='bold 11px Tajawal';ctx.fillText(`Period r=${periodStep.r}`,w/2,histY+histH+16);
    }
  }

  // Status text
  const lastStep=visibleSteps[visibleSteps.length-1];
  if(lastStep&&lastStep.msg){ctx.fillStyle=text;ctx.font='12px Tajawal';ctx.fillText(lastStep.msg,10,h-10)}
}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:"Shor's Algorithm",p:s.wiki_shor},{t:'QFT',p:s.wiki_qft},{t:'Post-Quantum',p:s.wiki_postq}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:"Shor's",p:LANG[currentLang].wiki_shor},{t:'QFT',p:LANG[currentLang].wiki_qft},{t:'Post-Quantum',p:LANG[currentLang].wiki_postq}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-qkc-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-qkc-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};
  $('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})}});
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  $('runBtn').onclick=runShor;$('stopBtn').onclick=()=>{running=false;hideToast();if(animFrame)clearTimeout(animFrame)};
  buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()
});

/* ═══════ ENHANCED QUANTUM VISUALIZATION (IIFE) ═══════ */
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

// Qubit state simulation
const nQubits=8;
let qubits=[];
function initQubits(){
  qubits=[];
  for(let i=0;i<nQubits;i++)qubits.push({alpha:Math.cos(i*0.3),beta:Math.sin(i*0.3),phase:i*0.5,measured:false});
}
initQubits();

function draw(){
  const w=_c.getBoundingClientRect().width,h=_c.getBoundingClientRect().height;
  const acc=_gc('--accent'),mut=_gc('--text-muted'),txt=_gc('--text');
  _x.clearRect(0,0,w,h);_t++;

  // === Bloch Sphere Representations (top) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Qubit States (Bloch Sphere projections)',10,16);

  const sphereR=Math.min(35,(w-40)/(nQubits*2.5));
  for(let i=0;i<nQubits;i++){
    const q=qubits[i];
    q.phase+=0.02+i*0.005;
    const cx=30+i*(sphereR*2.5),cy=55;

    // Draw circle (sphere projection)
    _x.strokeStyle=`${acc}44`;_x.lineWidth=1;
    _x.beginPath();_x.arc(cx,cy,sphereR,0,Math.PI*2);_x.stroke();
    // Cross hairs
    _x.strokeStyle=`${acc}22`;
    _x.beginPath();_x.moveTo(cx-sphereR,cy);_x.lineTo(cx+sphereR,cy);_x.stroke();
    _x.beginPath();_x.moveTo(cx,cy-sphereR);_x.lineTo(cx,cy+sphereR);_x.stroke();

    // State vector
    const theta=Math.acos(q.alpha)*2;
    const phi=q.phase;
    const sx=Math.sin(theta)*Math.cos(phi)*sphereR;
    const sy=-Math.cos(theta)*sphereR;
    _x.strokeStyle='#f87171';_x.lineWidth=2;
    _x.beginPath();_x.moveTo(cx,cy);_x.lineTo(cx+sx,cy+sy);_x.stroke();
    _x.fillStyle='#f87171';_x.beginPath();_x.arc(cx+sx,cy+sy,3,0,Math.PI*2);_x.fill();

    // Probability bars (|0> and |1>)
    const p0=q.alpha*q.alpha,p1=q.beta*q.beta;
    const bW=sphereR*0.6,bH=15;
    const bY=cy+sphereR+4;
    _x.fillStyle='#4ade8044';_x.fillRect(cx-bW,bY,bW*2*p0,bH/2);
    _x.fillStyle='#60a5fa44';_x.fillRect(cx-bW,bY+bH/2,bW*2*p1,bH/2);
    _x.fillStyle=mut;_x.font='7px SF Mono';_x.textAlign='center';
    _x.fillText(`q${i}`,cx,cy-sphereR-3);
    _x.textAlign='left';
    _x.lineWidth=1;
  }

  // === QFT Circuit Diagram (middle) ===
  const qftY=110,qftH=80;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Quantum Fourier Transform Circuit',10,qftY);

  const wireSpacing=qftH/nQubits,gateSize=14;
  for(let i=0;i<nQubits;i++){
    const y=qftY+12+i*wireSpacing;
    // Wire
    _x.strokeStyle=`${acc}33`;_x.beginPath();_x.moveTo(40,y);_x.lineTo(w-20,y);_x.stroke();
    // Label
    _x.fillStyle=mut;_x.font='8px SF Mono';_x.fillText(`|q${i}>`,10,y+3);

    // Hadamard gates
    const hX=60+i*25;
    _x.fillStyle='#c084fc33';_x.fillRect(hX-gateSize/2,y-gateSize/2,gateSize,gateSize);
    _x.strokeStyle='#c084fc';_x.strokeRect(hX-gateSize/2,y-gateSize/2,gateSize,gateSize);
    _x.fillStyle='#c084fc';_x.font='bold 8px SF Mono';_x.textAlign='center';
    _x.fillText('H',hX,y+3);_x.textAlign='left';

    // Controlled rotation gates
    for(let j=i+1;j<Math.min(i+4,nQubits);j++){
      const crX=hX+30+(j-i)*20;
      const ty=qftY+12+j*wireSpacing;
      // Control line
      _x.strokeStyle='#60a5fa44';_x.beginPath();_x.moveTo(crX,y);_x.lineTo(crX,ty);_x.stroke();
      // Control dot
      _x.fillStyle='#60a5fa';_x.beginPath();_x.arc(crX,y,3,0,Math.PI*2);_x.fill();
      // Target
      _x.strokeStyle='#60a5fa';_x.beginPath();_x.arc(crX,ty,5,0,Math.PI*2);_x.stroke();
      _x.beginPath();_x.moveTo(crX,ty-5);_x.lineTo(crX,ty+5);_x.stroke();
      _x.beginPath();_x.moveTo(crX-5,ty);_x.lineTo(crX+5,ty);_x.stroke();
    }

    // Measurement wave
    const phase=_t*0.05+i*0.3;
    const measX=w-50;
    _x.strokeStyle=`hsl(${i*45+120},70%,60%)`;_x.lineWidth=1.5;_x.beginPath();
    for(let p=0;p<20;p++){
      const px=measX+p;
      const py=y+Math.sin(phase+p*0.5)*4*qubits[i].alpha;
      if(p===0)_x.moveTo(px,py);else _x.lineTo(px,py);
    }
    _x.stroke();_x.lineWidth=1;
  }

  // === Period Finding Visualization (bottom-left) ===
  const pfY=qftY+qftH+20,pfW=w*0.48,pfH=h-pfY-25;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Period Finding: a^x mod N',10,pfY);

  const N=parseInt(document.getElementById('modulusInput').value)||15;
  const a=2+(_t%5);
  const nPts=Math.min(N,100);
  const barW=pfW/nPts;
  let period=-1;

  // Compute and display a^x mod N
  let v=1;const vals=[];
  for(let x=0;x<nPts;x++){
    vals.push(v);
    if(x>0&&v===1&&period<0)period=x;
    v=(v*a)%N;
  }

  const maxV=Math.max(...vals,1);
  vals.forEach((v,x)=>{
    const barH=(v/maxV)*(pfH-20);
    const hue=(v/N)*360;
    _x.fillStyle=`hsla(${hue},60%,50%,.5)`;
    _x.fillRect(10+x*barW,pfY+10+pfH-20-barH,barW-1,barH);
  });

  if(period>0){
    _x.strokeStyle='#f87171';_x.setLineDash([3,3]);_x.lineWidth=1.5;
    for(let x=period;x<nPts;x+=period){
      const px=10+x*barW;
      _x.beginPath();_x.moveTo(px,pfY+10);_x.lineTo(px,pfY+pfH-10);_x.stroke();
    }
    _x.setLineDash([]);_x.lineWidth=1;
    _x.fillStyle='#f87171';_x.font='9px SF Mono';
    _x.fillText(`Period r=${period}`,10,pfY+pfH-5);
  }

  // === Quantum vs Classical Complexity (bottom-right) ===
  const qcX=w*0.52,qcY=pfY,qcW=w*0.46,qcH=pfH;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Quantum vs Classical Factoring',qcX,qcY);

  const complexities=[
    {name:'GNFS (classical)',color:'#f87171',fn:n=>Math.exp(1.9*Math.pow(n,1/3)*Math.pow(Math.log(n),2/3))},
    {name:"Shor's (quantum)",color:'#4ade80',fn:n=>Math.pow(n,3)},
    {name:'Trial Division',color:'#fbbf24',fn:n=>Math.pow(2,n/2)}
  ];

  const maxN=80,chartH=qcH-30;
  _x.strokeStyle=mut+'44';_x.beginPath();
  _x.moveTo(qcX+20,qcY+8);_x.lineTo(qcX+20,qcY+8+chartH);_x.lineTo(qcX+qcW,qcY+8+chartH);_x.stroke();

  complexities.forEach((c,ci)=>{
    _x.strokeStyle=c.color;_x.lineWidth=2;_x.beginPath();
    let started=false;
    for(let n=4;n<=maxN;n++){
      const ops=c.fn(n);
      const logOps=Math.log10(Math.max(1,ops));
      const px=qcX+20+(n/maxN)*(qcW-25);
      const py=qcY+8+chartH-Math.min(1,logOps/30)*chartH;
      if(py<qcY+8)break;
      if(!started){_x.moveTo(px,py);started=true}else _x.lineTo(px,py);
    }
    _x.stroke();_x.lineWidth=1;
    _x.fillStyle=c.color;_x.font='8px SF Mono';
    _x.fillText(c.name,qcX+25,qcY+18+ci*11);
  });

  // Post-quantum threat line
  const threatN=30+Math.sin(_t*0.02)*20;
  const threatX=qcX+20+(threatN/maxN)*(qcW-25);
  _x.strokeStyle='rgba(255,255,255,.2)';_x.setLineDash([4,4]);
  _x.beginPath();_x.moveTo(threatX,qcY+8);_x.lineTo(threatX,qcY+8+chartH);_x.stroke();
  _x.setLineDash([]);
  _x.fillStyle=mut;_x.font='8px SF Mono';_x.fillText(`${Math.round(threatN)} bits`,threatX-12,qcY+8+chartH+10);

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
