/**
 * Known Plaintext Attack — Workshop DIY v1.0
 * XOR known plaintext with ciphertext to recover key stream
 */
const $=id=>document.getElementById(id);// ── Shared i18n keys (template) ──
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
    ...LANG_BASE.en,title:'Known Plaintext Attack',subtitle:'Recover encryption keys using known pairs',mainSection:'KPA Key Recovery',mainDesc:'XOR known plaintext with ciphertext to recover key stream',ready:'Ready',langChanged:'Language -> English',themeChanged:'Theme ->',recovered:'Key stream recovered!',howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "the data section" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',wiki_xor:'XOR: C = P XOR K. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_stream:'تشفير التدفق يولد تيارا شبه عشوائي. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_defense:'الدفاع: لا تعد استخدام تيارات المفاتيح. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',mathExplain:'Known Plaintext Attack on XOR Cipher:\n\nEncryption: C = P XOR K\nGiven: P (known plaintext), C (ciphertext)\nRecover: K = C XOR P\n\nDecrypt any message: P2 = C2 XOR K\n\nFor repeating-key XOR:\nC[i] = P[i] XOR K[i mod keylen]\nK[i mod keylen] = C[i] XOR P[i]',step1Title:'Set Up',step1Desc:'Configure the parameters for Known Plaintext Attack. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "Analysis" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "Data View". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is Known Plaintext Attack?',faq_a1:'Known Plaintext Attack lets you xor known plaintext with ciphertext to recover key stream. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you select the cryptographic algorithm and key parameters to analyze. Then you configure the attack parameters: known plaintext, side-channel data, or timing.',faq_q3:'What do the controls do?',faq_a3:'Enter the known plaintext. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'تشفير التدفق يولد تيارا شبه عشوائي.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to Known Plaintext Attack! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Enter the known plaintext. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "the first section" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how cryptography works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32)  # 32 bytes = 256 bits\\niv = os.urandom(16)   # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key:        {key.hex()}")\\nprint(f"IV:         {iv.hex()}")\\nprint(f"Plaintext:  {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered:  {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',purpose:'Known Plaintext Attack: XOR known plaintext with ciphertext to recover key stream. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Choose Algorithm through Set Up Attack to Execute Attack and Analyze Results.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Analysis" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
fr:{title:'Attaque Texte Clair Connu',subtitle:'Recuperez les cles avec des paires connues',mainSection:'Recuperation de Cle',mainDesc:'XOR du texte connu avec le chiffre',ready:'Pret',langChanged:'Langue -> Francais',themeChanged:'Theme ->',recovered:'Flux de cle recupere!',howto_1:'Entrez le texte connu.',howto_2:'Cliquez Chiffrer.',howto_3:'Cliquez Recuperer.',howto_4:'Dechiffrez d\'autres messages.',wiki_xor:'XOR: C = P XOR K.',wiki_stream:'Les chiffrements par flux generent un flux pseudo-aleatoire.',wiki_defense:'Defense: ne jamais reutiliser les flux de cles.',mathExplain:'C = P XOR K\nK = C XOR P',step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule cryptographic attacks ! 🔬 Tu peux expérimenter avec breaking encryption en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Bleichenbacher Attack and Cry Elliptic Curve Attack ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
ar:{title:'هجوم النص المعروف',subtitle:'استرجع مفاتيح التشفير باستخدام أزواج معروفة',mainSection:'استرجاع المفتاح',mainDesc:'XOR النص المعروف مع المشفر لاسترجاع تيار المفتاح',ready:'جاهز',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',recovered:'تم استرجاع تيار المفتاح!',howto_1:'أدخل النص المعروف.',howto_2:'اضغط تشفير.',howto_3:'اضغط استرجاع.',howto_4:'فك تشفير رسائل أخرى.',wiki_xor:'XOR: C = P XOR K.',wiki_stream:'تشفير التدفق يولد تيارا شبه عشوائي.',wiki_defense:'الدفاع: لا تعد استخدام تيارات المفاتيح.',mathExplain:'C = P XOR K\nK = C XOR P',step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي cryptographic attacks! 🔬 يمكنك التجربة مع breaking encryption في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Bleichenbacher Attack and Cry Elliptic Curve Attack! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}};
let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;if($('langSelect'))$('langSelect').value=l;try{localStorage.setItem('cry-kpa-lang',l)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));if($('themeSelect'))$('themeSelect').value=n;try{localStorage.setItem('cry-kpa-theme',n)}catch{}}
let soundEnabled=false;function playSound(t){if(!soundEnabled)return;const a=new(window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);g.gain.value=.08;o.frequency.value=t==='success'?523:200;g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.2);o.start();o.stop(a.currentTime+.2)}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success')}
function showToast(m){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(p,o){p.classList.toggle('open');if(o)o.classList.toggle('active',p.classList.contains('open'))}
/* ═══════ XOR CIPHER ═══════ */
let secretKey='SECRETKEY',ptBytes=[],ctBytes=[],keyBytes=[],recoveredKey=[];
function xorEncrypt(pt,key){return pt.map((b,i)=>b^key.charCodeAt(i%key.length))}
function doEncrypt(){const pt=$('ptInput').value;ptBytes=Array.from(pt).map(c=>c.charCodeAt(0));ctBytes=xorEncrypt(ptBytes,secretKey);keyBytes=Array.from(secretKey).map(c=>c.charCodeAt(0));recoveredKey=[];
  $('resultsBox').textContent=`Plaintext:  "${pt}"\nCiphertext: [${ctBytes.map(b=>b.toString(16).padStart(2,'0')).join(' ')}]\n(Key is hidden from attacker)`;log('Encrypted with secret key','success');drawCanvas()}
function recoverKey(){if(ctBytes.length===0){doEncrypt()}recoveredKey=ctBytes.map((c,i)=>c^ptBytes[i]);
  const keyStr=recoveredKey.map(b=>String.fromCharCode(b)).join('');const s=LANG[currentLang];
  $('resultsBox').textContent+=`\n\n--- KEY RECOVERY ---\nRecovered key bytes: [${recoveredKey.map(b=>b.toString(16).padStart(2,'0')).join(' ')}]\nRecovered key: "${keyStr}"\nActual key:    "${secretKey}"\nMatch: ${keyStr.slice(0,secretKey.length)===secretKey?'YES':'PARTIAL'}`;
  log(s.recovered,'success');drawCanvas()}
function decryptUnknown(){if(recoveredKey.length===0){recoverKey()}const ct2=$('unknownInput').value.split(' ').map(h=>parseInt(h,16)).filter(n=>!isNaN(n));
  if(ct2.length===0){log('Enter hex ciphertext','error');return}
  const pt2=ct2.map((c,i)=>String.fromCharCode(c^recoveredKey[i%recoveredKey.length])).join('');
  $('resultsBox').textContent+=`\n\nDecrypted unknown: "${pt2}"`;log(`Decrypted: "${pt2}"`,'success');drawCanvas()}
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawCanvas(){if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;const accent=getCS('--accent'),muted=getCS('--text-muted');ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText('Known Plaintext XOR Attack',10,22);
  if(ptBytes.length===0)return;const cellW=Math.min(40,(w-20)/ptBytes.length),rowH=45,startY=50;
  // Plaintext row
  ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Known Plaintext (P)',10,startY-4);
  ptBytes.forEach((b,i)=>{ctx.fillStyle='#4ade8033';ctx.fillRect(10+i*cellW,startY,cellW-2,rowH-5);ctx.fillStyle='#4ade80';ctx.font='9px monospace';ctx.fillText(String.fromCharCode(b),14+i*cellW,startY+15);ctx.fillText(b.toString(16).padStart(2,'0'),14+i*cellW,startY+30)});
  // Ciphertext row
  const ctY=startY+rowH+10;ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Ciphertext (C)',10,ctY-4);
  ctBytes.forEach((b,i)=>{ctx.fillStyle=`${accent}33`;ctx.fillRect(10+i*cellW,ctY,cellW-2,rowH-5);ctx.fillStyle=accent;ctx.font='9px monospace';ctx.fillText(b.toString(16).padStart(2,'0'),14+i*cellW,ctY+20)});
  // XOR arrows
  const xorY=ctY+rowH+5;ctx.fillStyle='#f87171';ctx.font='bold 12px monospace';ptBytes.forEach((_,i)=>{ctx.fillText('XOR',12+i*cellW,xorY+10)});
  // Recovered key row
  const keyY=xorY+25;ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Recovered Key (K = P XOR C)',10,keyY-4);
  (recoveredKey.length?recoveredKey:new Array(ptBytes.length).fill(null)).forEach((b,i)=>{
    ctx.fillStyle=b!==null?'#f8717133':'rgba(255,255,255,.05)';ctx.fillRect(10+i*cellW,keyY,cellW-2,rowH-5);
    if(b!==null){ctx.fillStyle='#f87171';ctx.font='bold 10px monospace';ctx.fillText(String.fromCharCode(b),14+i*cellW,keyY+15);ctx.fillText(b.toString(16).padStart(2,'0'),14+i*cellW,keyY+30)}})}
function buildControls(){$('controlsArea').innerHTML=`<div class="control-section"><div class="section-header"><div class="section-title">Known Plaintext</div></div><input type="text" id="ptInput" value="Hello, World! This is a known message." placeholder="Known plaintext"/></div><div class="control-section"><div style="display:flex;gap:8px;flex-wrap:wrap"><button id="encBtn" class="primary" style="flex:1">Encrypt</button><button id="recoverBtn" style="flex:1">Recover Key (XOR)</button></div></div><div class="control-section"><div class="section-header"><div class="section-title">Unknown Ciphertext (hex, space-separated)</div></div><input type="text" id="unknownInput" placeholder="e.g. 1b 0a 1c ..."/><button id="decBtn" class="btn-sm" style="margin-top:6px">Decrypt Unknown</button></div>`;
  $('encBtn').onclick=doEncrypt;$('recoverBtn').onclick=recoverKey;$('decBtn').onclick=decryptUnknown}
function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'XOR',p:s.wiki_xor},{t:'Stream',p:s.wiki_stream},{t:'Defense',p:s.wiki_defense}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'XOR',p:LANG[currentLang].wiki_xor},{t:'Stream',p:LANG[currentLang].wiki_stream},{t:'Defense',p:LANG[currentLang].wiki_defense}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}
document.addEventListener('DOMContentLoaded',()=>{splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-kpa-lang');if(l&&LANG[l])setLanguage(l)}catch{}try{const t=localStorage.getItem('cry-kpa-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};$('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};$('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  buildControls();buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()});

/* ═══════ ENHANCED KPA VISUALIZATION (IIFE) ═══════ */
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

  // === XOR Truth Table (top-left) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('XOR Operation Properties',10,16);

  const ttW=w*0.3;
  const rows=[['A','B','A^B'],['0','0','0'],['0','1','1'],['1','0','1'],['1','1','0']];
  rows.forEach((row,i)=>{
    const y=24+i*16;
    const isHeader=i===0;
    row.forEach((cell,j)=>{
      const x=10+j*(ttW/3);
      _x.fillStyle=isHeader?acc+'44':'rgba(255,255,255,.03)';
      _x.fillRect(x,y,ttW/3-2,14);
      _x.fillStyle=isHeader?acc:cell==='1'?'#4ade80':'#f87171';
      _x.font=isHeader?'bold 9px SF Mono':'9px SF Mono';_x.textAlign='center';
      _x.fillText(cell,x+ttW/6,y+11);_x.textAlign='left';
    });
  });
  // Key property
  _x.fillStyle='#fbbf24';_x.font='bold 9px SF Mono';
  _x.fillText('P XOR K = C',10,110);
  _x.fillText('C XOR P = K',10,124);
  _x.fillText('C XOR K = P',10,138);
  _x.fillStyle=mut;_x.font='8px Tajawal';
  _x.fillText('XOR is self-inverse!',10,154);

  // === Binary XOR Animation (top-middle) ===
  const bxX=w*0.33,bxW=w*0.34;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Byte-level XOR Recovery',bxX,16);

  const animByte=(_t%8);
  const plainByte=0x48+animByte;// 'H','e','l','l','o'...
  const keyByte=0x53+animByte;
  const cipherByte=plainByte^keyByte;

  for(let bit=7;bit>=0;bit--){
    const x=bxX+(7-bit)*18;
    const pBit=(plainByte>>bit)&1;
    const kBit=(keyByte>>bit)&1;
    const cBit=(cipherByte>>bit)&1;
    // Plaintext bit
    _x.fillStyle=pBit?'#4ade8066':'rgba(255,255,255,.05)';
    _x.fillRect(x,28,16,16);_x.fillStyle=pBit?'#4ade80':mut;_x.font='bold 9px SF Mono';_x.textAlign='center';
    _x.fillText(pBit.toString(),x+8,40);
    // XOR symbol
    _x.fillStyle='#fbbf24';_x.font='bold 10px SF Mono';_x.fillText('\u2295',x+8,58);
    // Key bit
    _x.fillStyle=kBit?'#f8717166':'rgba(255,255,255,.05)';
    _x.fillRect(x,64,16,16);_x.fillStyle=kBit?'#f87171':mut;_x.font='bold 9px SF Mono';
    _x.fillText(kBit.toString(),x+8,76);
    // Equals
    _x.fillStyle=mut;_x.font='bold 10px SF Mono';_x.fillText('=',x+8,94);
    // Cipher bit
    _x.fillStyle=cBit?'#60a5fa66':'rgba(255,255,255,.05)';
    _x.fillRect(x,100,16,16);_x.fillStyle=cBit?'#60a5fa':mut;_x.font='bold 9px SF Mono';
    _x.fillText(cBit.toString(),x+8,112);
    _x.textAlign='left';
  }

  // Labels
  _x.fillStyle='#4ade80';_x.font='8px SF Mono';_x.fillText(`P=0x${plainByte.toString(16)}='${String.fromCharCode(plainByte)}'`,bxX,126);
  _x.fillStyle='#f87171';_x.fillText(`K=0x${keyByte.toString(16)}`,bxX+80,126);
  _x.fillStyle='#60a5fa';_x.fillText(`C=0x${cipherByte.toString(16)}`,bxX+140,126);

  // === Key Stream Reuse Vulnerability (top-right) ===
  const krX=w*0.68,krW=w*0.3;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Key Reuse Attack',krX,16);

  _x.fillStyle='#f87171';_x.font='9px SF Mono';
  _x.fillText('If K reused:',krX,30);
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('C1 = P1 ^ K',krX,44);
  _x.fillText('C2 = P2 ^ K',krX,58);
  _x.fillText('C1^C2 = P1^P2',krX,76);
  _x.fillStyle='#fbbf24';_x.font='bold 8px SF Mono';
  _x.fillText('Key cancels out!',krX,92);
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('If P1 known:',krX,110);
  _x.fillText('P2 = C1^C2^P1',krX,124);
  _x.fillStyle='#4ade80';_x.font='bold 8px SF Mono';
  _x.fillText('All messages exposed!',krX,140);

  // === Frequency Analysis (bottom-left) ===
  const faY=164,faW=w*0.48,faH=h-faY-25;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Ciphertext Frequency Analysis (XOR cipher)',10,faY);

  // Generate frequency data for a simple XOR cipher
  const msg='The quick brown fox jumps over the lazy dog. Crypto is fun!';
  const key='KEY';
  const freq=new Array(256).fill(0);
  for(let i=0;i<msg.length;i++){
    const c=msg.charCodeAt(i)^key.charCodeAt(i%key.length);
    freq[c]++;
  }
  const maxFreq=Math.max(...freq,1);
  const barW=faW/128;
  for(let i=0;i<128;i++){
    if(freq[i]>0){
      const barH=(freq[i]/maxFreq)*(faH-20);
      const hue=(i/128)*360;
      _x.fillStyle=`hsla(${hue},60%,50%,.5)`;
      _x.fillRect(10+i*barW,faY+10+faH-20-barH,barW-1,barH);
    }
  }
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('Non-uniform distribution reveals patterns',10,faY+faH-2);

  // === Stream Cipher Architecture (bottom-right) ===
  const scX=w*0.52,scY=faY,scW=w*0.46,scH=faH;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Stream Cipher Key Stream',scX,scY);

  // PRNG box
  _x.fillStyle='#c084fc33';_x.fillRect(scX,scY+12,80,35);_x.strokeStyle='#c084fc';_x.strokeRect(scX,scY+12,80,35);
  _x.fillStyle='#c084fc';_x.font='bold 9px SF Mono';_x.textAlign='center';
  _x.fillText('PRNG',scX+40,scY+25);
  _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText('(seed=key)',scX+40,scY+38);_x.textAlign='left';

  // Key stream output
  const ksY=scY+55;
  const streamLen=Math.min(16,Math.floor(scW/22));
  for(let i=0;i<streamLen;i++){
    const x=scX+i*22;
    const val=((0xAB*(_t+i)+0x37)&0xFF);
    const active=i<=(_t%streamLen);
    _x.fillStyle=active?'#c084fc33':'rgba(255,255,255,.03)';
    _x.fillRect(x,ksY,20,16);
    if(active){_x.fillStyle='#c084fc';_x.font='bold 7px SF Mono';_x.textAlign='center';_x.fillText(val.toString(16),x+10,ksY+12);_x.textAlign='left'}
  }
  _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText('Key stream bytes',scX,ksY+28);

  // XOR with plaintext
  const xorY=ksY+35;
  _x.fillStyle='#fbbf24';_x.font='bold 10px SF Mono';
  for(let i=0;i<Math.min(streamLen,8);i++){
    _x.fillText('\u2295',scX+i*22+6,xorY+10);
  }

  // Plaintext row
  const ptY=xorY+18;
  for(let i=0;i<Math.min(streamLen,8);i++){
    const x=scX+i*22;
    const ch=msg.charCodeAt(i);
    _x.fillStyle='#4ade8033';_x.fillRect(x,ptY,20,16);
    _x.fillStyle='#4ade80';_x.font='7px SF Mono';_x.textAlign='center';
    _x.fillText(ch.toString(16),x+10,ptY+12);_x.textAlign='left';
  }
  _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText('= Ciphertext',scX,ptY+28);

  // Defense note
  const defY=ptY+38;
  if(defY+15<h){
    _x.fillStyle='#4ade80';_x.font='bold 9px SF Mono';
    _x.fillText('Defense: Never reuse nonce/key (AES-GCM, ChaCha20-Poly1305)',scX,defY);
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
