/**
 * Padding Oracle Lab — Workshop DIY v1.0
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
    ...LANG_BASE.en,title:'Padding Oracle Lab',subtitle:'Exploit CBC padding oracle to decrypt byte-by-byte',mainSection:'Padding Oracle Attack',mainDesc:'Simulate padding oracle on AES-CBC',ptLabel:'Secret Plaintext',ptHint:'This message will be encrypted; try to recover it',encrypt:'Encrypt',startAttack:'Start Attack',stop:'Stop',results:'Results',vizTitle:'Attack Visualization',vizHint:'Watch the oracle leak plaintext byte by byte',sectionA:'Attack Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',encrypted:'Message encrypted',attacking:'Attacking...',decrypted:'Decrypted!',padValid:'Padding valid',padInvalid:'Padding invalid',
    howto_1:'Enter a secret message.',howto_2:'Click Encrypt to create the ciphertext.',howto_3:'Click Start Attack to begin byte-by-byte decryption.',howto_4:'Watch the canvas as each byte is recovered.',
    wiki_cbc:'CBC mode XORs each plaintext block with the previous ciphertext block before encryption.',wiki_pkcs7:'PKCS#7 padding fills the last block: if 3 bytes remain, pad with 03 03 03.',wiki_oracle:'The oracle returns true/false for valid padding, leaking information about the decrypted intermediate value.',
    mathExplain:'Padding Oracle Attack:\n\nC = IV || C1 || C2 || ... || Cn\nD(Ck) = Ik (intermediate value)\nPk = Ck-1 XOR Ik\n\nAttacker modifies Ck-1 byte by byte:\nFor each guess g (0..255):\n  Set Ck-1[last] = g\n  If oracle says valid padding:\n    Ik[last] = g XOR 0x01\n    Pk[last] = original_Ck-1[last] XOR Ik[last]\n\nRepeat for all bytes, all blocks.',step1Title:'Choose Algorithm',step1Desc:'Select the cryptographic algorithm and key parameters to analyze.',step2Title:'Set Up Attack',step2Desc:'Configure the attack parameters: known plaintext, side-channel data, or timing.',step3Title:'Execute Attack',step3Desc:'Run the cryptographic attack and attempt to recover the secret key.',step4Title:'Analyze Results',step4Desc:'Evaluate attack success rate and understand the vulnerability exploited.',sectionCode:'Device Code',faq_q1:'What is Padding Oracle Lab?',faq_a1:'Padding Oracle Lab lets you simulate padding oracle on aes-cbc. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you select the cryptographic algorithm and key parameters to analyze. Then you configure the attack parameters: known plaintext, side-channel data, or timing.',faq_q3:'What do the controls do?',faq_a3:'Enter a secret message. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'وضع CBC يطبق XOR على كل كتلة مع الكتلة المشفرة السابقة.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Cry Aes Side Channel and Cry Birthday Paradox Demo. Each app in this category teaches a different aspect of cryptography.',demo_s1:'Welcome to Padding Oracle Lab! Look at the main display — this is where the cryptography simulation runs.',demo_s2:'Enter a secret message. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Attack Reference" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of cryptography.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how cryptography works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches cryptography concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'Starter Code',codeLang:'Python',codeSnippet:'from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes\\nimport os\\n\\n# Generate a random 256-bit key and 128-bit IV\\nkey = os.urandom(32)  # 32 bytes = 256 bits\\niv = os.urandom(16)   # 16 bytes = 128 bits\\n\\n# Encrypt\\ncipher = Cipher(algorithms.AES(key), modes.CBC(iv))\\nencryptor = cipher.encryptor()\\nplaintext = b"Attack at dawn!!" # Must be 16-byte aligned\\nciphertext = encryptor.update(plaintext) + encryptor.finalize()\\n\\nprint(f"Key:        {key.hex()}")\\nprint(f"IV:         {iv.hex()}")\\nprint(f"Plaintext:  {plaintext}")\\nprint(f"Ciphertext: {ciphertext.hex()}")\\n\\n# Decrypt\\ndecryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).decryptor()\\nrecovered = decryptor.update(ciphertext) + decryptor.finalize()\\nprint(f"Recovered:  {recovered}")',codeExplain:'This script demonstrates AES-256-CBC encryption. AES operates on 16-byte blocks — the plaintext must be exactly 16 bytes (or padded). The key (256 bits) determines the encryption, and the IV (initialization vector) ensures that encrypting the same plaintext twice produces different ciphertext. CBC mode chains blocks together so changing one plaintext byte affects all subsequent ciphertext blocks.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Attack Reference" and "Math Deep Dive" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Labo Oracle de Rembourrage',subtitle:'Exploitez l\'oracle de rembourrage CBC',mainSection:'Attaque Oracle',mainDesc:'Simulez l\'attaque sur AES-CBC',ptLabel:'Texte Clair Secret',ptHint:'Ce message sera chiffre; essayez de le recuperer',encrypt:'Chiffrer',startAttack:'Lancer Attaque',stop:'Arreter',results:'Resultats',vizTitle:'Visualisation',vizHint:'Regardez l\'oracle reveler le texte octet par octet',sectionA:'Reference',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',encrypted:'Message chiffre',attacking:'Attaque en cours...',decrypted:'Dechiffre!',padValid:'Rembourrage valide',padInvalid:'Rembourrage invalide'Mes données sont-elles privées ?'autres systemes.',
    howto_1:'Entrez un message secret.',howto_2:'Cliquez Chiffrer.',howto_3:'Cliquez Lancer Attaque.',howto_4:'Regardez la recuperation.',
    wiki_cbc:'Le mode CBC XOR chaque bloc avec le bloc chiffre precedent.',wiki_pkcs7:'PKCS#7: si 3 octets restent, remplir avec 03 03 03.',wiki_oracle:'L\'oracle repond vrai/faux pour le rembourrage.',
    mathExplain:'Attaque Oracle de Rembourrage:\n\nC = IV || C1 || C2\nD(Ck) = Ik\nPk = Ck-1 XOR Ik\n\nModifier Ck-1 octet par octet pour deduire Ik.',step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule cryptographic attacks ! 🔬 Tu peux expérimenter avec breaking encryption en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Birthday Paradox Demo and Cry Entropy Analyzer ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'مختبر هجوم الحشو',subtitle:'استغل هجوم الحشو لفك التشفير بايت ببايت',mainSection:'هجوم أوراكل الحشو',mainDesc:'حاكي هجوم الحشو على AES-CBC',ptLabel:'النص السري',ptHint:'سيتم تشفير هذه الرسالة، حاول استرجاعها',encrypt:'تشفير',startAttack:'بدء الهجوم',stop:'إيقاف',results:'النتائج',vizTitle:'تصور الهجوم',vizHint:'شاهد الأوراكل يسرّب النص بايت ببايت',sectionA:'مرجع الهجوم',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',encrypted:'تم التشفير',attacking:'جاري الهجوم...',decrypted:'تم فك التشفير!',padValid:'حشو صالح',padInvalid:'حشو غير صالح',
    howto_1:'أدخل رسالة سرية.',howto_2:'اضغط تشفير.',howto_3:'اضغط بدء الهجوم.',howto_4:'شاهد استرجاع كل بايت.',
    wiki_cbc:'وضع CBC يطبق XOR على كل كتلة مع الكتلة المشفرة السابقة.',wiki_pkcs7:'PKCS#7: إذا بقيت 3 بايتات، املأ بـ 03 03 03.',wiki_oracle:'الأوراكل يرد صحيح/خطأ للحشو.',
    mathExplain:'هجوم أوراكل الحشو:\n\nC = IV || C1 || C2\nD(Ck) = Ik\nPk = Ck-1 XOR Ik\n\nعدّل Ck-1 بايت ببايت لاستنتاج Ik.',step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي cryptographic attacks! 🔬 يمكنك التجربة مع breaking encryption في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Birthday Paradox Demo and Cry Entropy Analyzer! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('cry-pad-lang',lang)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('cry-pad-theme',name)}catch{}log(`${LANG[currentLang].themeChanged} ${name}`,'info')}
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const t=audioCtx.currentTime;if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,t+.3);o.start(t);o.stop(t+.3)}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,t+.25);o.start(t);o.stop(t+.25)}}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success')}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(panel,overlay){panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'))}

/* ═══════ SIMULATED CBC ENCRYPTION ═══════ */
let cipherBlocks=[],ivBlock=[],secretKey=[],blockSize=8,running=false,recoveredBytes=[],currentByteIdx=-1,currentGuess=0;
function randBytes(n){const a=[];for(let i=0;i<n;i++)a.push(Math.floor(Math.random()*256));return a}
function xorBlocks(a,b){return a.map((v,i)=>v^b[i])}
function simpleBlockEncrypt(block,key){return block.map((v,i)=>(v+key[i%key.length]+37)&0xff)}
function simpleBlockDecrypt(block,key){return block.map((v,i)=>(v-key[i%key.length]-37+512)&0xff)}
function pkcs7Pad(data){const pad=blockSize-(data.length%blockSize);const r=[...data];for(let i=0;i<pad;i++)r.push(pad);return r}
function checkPadding(block){const last=block[block.length-1];if(last<1||last>blockSize)return false;for(let i=0;i<last;i++)if(block[block.length-1-i]!==last)return false;return true}

function doEncrypt(){
  const pt=$('ptInput').value;const bytes=Array.from(pt).map(c=>c.charCodeAt(0));
  const padded=pkcs7Pad(bytes);secretKey=randBytes(blockSize);ivBlock=randBytes(blockSize);cipherBlocks=[];
  let prev=ivBlock;
  for(let i=0;i<padded.length;i+=blockSize){const block=padded.slice(i,i+blockSize);const xored=xorBlocks(block,prev);const enc=simpleBlockEncrypt(xored,secretKey);cipherBlocks.push(enc);prev=enc}
  recoveredBytes=[];currentByteIdx=-1;currentGuess=0;
  const s=LANG[currentLang];log(s.encrypted,'success');
  $('resultsBox').textContent=`IV: [${ivBlock.map(b=>b.toString(16).padStart(2,'0')).join(' ')}]\nBlocks: ${cipherBlocks.length}\nCiphertext: [${cipherBlocks.flat().map(b=>b.toString(16).padStart(2,'0')).join(' ')}]`;
  drawCanvas()
}

function paddingOracle(modifiedPrev,cipherBlock){
  const decrypted=simpleBlockDecrypt(cipherBlock,secretKey);const result=xorBlocks(decrypted,modifiedPrev);return checkPadding(result)
}

function startAttack(){
  if(cipherBlocks.length===0){doEncrypt()}
  running=true;recoveredBytes=new Array(cipherBlocks.length*blockSize).fill(null);
  const s=LANG[currentLang];log(s.attacking,'info');showToast(s.attacking);
  let blockIdx=0,bytePos=blockSize-1,intermediateValues=new Array(blockSize).fill(0);
  function attackStep(){
    if(!running)return;
    const prevBlock=blockIdx===0?ivBlock:cipherBlocks[blockIdx-1];const currBlock=cipherBlocks[blockIdx];
    const padVal=blockSize-bytePos;const modified=[...prevBlock];
    // Set already-known bytes
    for(let i=blockSize-1;i>bytePos;i--)modified[i]=intermediateValues[i]^padVal;
    modified[bytePos]=currentGuess;
    const globalIdx=blockIdx*blockSize+bytePos;
    if(paddingOracle(modified,currBlock)){
      intermediateValues[bytePos]=currentGuess^padVal;
      const plainByte=prevBlock[bytePos]^intermediateValues[bytePos];
      recoveredBytes[globalIdx]=plainByte;
      log(`Byte ${globalIdx}: 0x${plainByte.toString(16).padStart(2,'0')} = '${plainByte>=32&&plainByte<127?String.fromCharCode(plainByte):'.'}'`,'success');
      currentGuess=0;bytePos--;
      if(bytePos<0){blockIdx++;bytePos=blockSize-1;intermediateValues=new Array(blockSize).fill(0);
        if(blockIdx>=cipherBlocks.length){running=false;hideToast();const recovered=recoveredBytes.filter(b=>b!==null).map(b=>b>=32&&b<127?String.fromCharCode(b):'.').join('');
          $('resultsBox').textContent+=`\n\nRecovered: "${recovered}"\n\n${s.decrypted}`;log(s.decrypted,'success');drawCanvas();return}
      }
    }else{currentGuess++;if(currentGuess>255){log('Byte exhausted, skipping','error');currentGuess=0;bytePos--;
      if(bytePos<0){blockIdx++;bytePos=blockSize-1;intermediateValues=new Array(blockSize).fill(0);if(blockIdx>=cipherBlocks.length){running=false;hideToast();drawCanvas();return}}
    }}
    drawCanvas();setTimeout(attackStep,5)
  }
  attackStep()
}

/* ═══════ CANVAS ═══════ */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawCanvas(){
  if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),text=getCS('--text'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText('Padding Oracle Attack',10,22);
  // Draw blocks
  const totalBytes=cipherBlocks.length*blockSize;if(totalBytes===0)return;
  const cellW=Math.min(40,(w-20)/totalBytes),cellH=40,startY=50;
  // IV
  ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('IV',10,startY-4);
  ivBlock.forEach((b,i)=>{ctx.fillStyle=`${accent}22`;ctx.fillRect(10+i*cellW,startY,cellW-2,cellH);ctx.fillStyle=muted;ctx.font='9px monospace';ctx.fillText(b.toString(16).padStart(2,'0'),12+i*cellW,startY+25)});
  // Cipher blocks
  ctx.fillStyle=muted;ctx.fillText('Ciphertext',10,startY+cellH+14);
  cipherBlocks.flat().forEach((b,i)=>{ctx.fillStyle=`${accent}22`;ctx.fillRect(10+i*cellW,startY+cellH+20,cellW-2,cellH);ctx.fillStyle=muted;ctx.font='9px monospace';ctx.fillText(b.toString(16).padStart(2,'0'),12+i*cellW,startY+cellH+45)});
  // Recovered plaintext
  ctx.fillStyle=accent;ctx.fillText('Recovered Plaintext',10,startY+2*cellH+50);
  recoveredBytes.forEach((b,i)=>{
    const isRecovered=b!==null;ctx.fillStyle=isRecovered?`${accent}44`:'rgba(255,255,255,.05)';
    ctx.fillRect(10+i*cellW,startY+2*cellH+56,cellW-2,cellH);
    if(isRecovered){ctx.fillStyle=accent;ctx.font='bold 11px monospace';const ch=b>=32&&b<127?String.fromCharCode(b):'.';ctx.fillText(ch,14+i*cellW,startY+2*cellH+80)}
  });
  // Progress
  const recovered=recoveredBytes.filter(b=>b!==null).length;const pct=totalBytes>0?(recovered/totalBytes*100).toFixed(0):0;
  ctx.fillStyle=text;ctx.font='12px Tajawal';ctx.fillText(`Progress: ${recovered}/${totalBytes} bytes (${pct}%)`,10,startY+3*cellH+80);
  // Query visualization
  if(running){ctx.fillStyle='#f8717144';const qy=startY+3*cellH+95;ctx.fillRect(10,qy,w-20,30);ctx.fillStyle='#f87171';ctx.font='11px monospace';ctx.fillText(`Trying byte guess: 0x${currentGuess.toString(16).padStart(2,'0')} (${currentGuess}/255)`,14,qy+20);
    const bar=(currentGuess/255)*(w-24);ctx.fillStyle='#f8717166';ctx.fillRect(12,qy+24,bar,4)}
}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'CBC Mode',p:s.wiki_cbc},{t:'PKCS#7',p:s.wiki_pkcs7},{t:'Padding Oracle',p:s.wiki_oracle}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'CBC',p:LANG[currentLang].wiki_cbc},{t:'PKCS#7',p:LANG[currentLang].wiki_pkcs7},{t:'Oracle',p:LANG[currentLang].wiki_oracle}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-pad-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-pad-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};
  $('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})}});
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  $('encryptBtn').onclick=doEncrypt;$('attackBtn').onclick=startAttack;$('stopBtn').onclick=()=>{running=false;hideToast();log('Attack stopped','info')};
  buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()
});

/* ═══════ ENHANCED PADDING ORACLE VISUALIZATION (IIFE) ═══════ */
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

// Simulate oracle queries distribution
let _oracleHist=new Array(256).fill(0);
let _xorMatrix=[];
function buildXorMatrix(){
  _xorMatrix=[];
  for(let i=0;i<16;i++){
    const row=[];
    for(let j=0;j<16;j++)row.push((i*16+j)^((i+j+_t)&0xFF));
    _xorMatrix.push(row);
  }
}

function draw(){
  const w=_c.getBoundingClientRect().width,h=_c.getBoundingClientRect().height;
  const acc=_gc('--accent'),mut=_gc('--text-muted'),txt=_gc('--text');
  _x.clearRect(0,0,w,h);_t++;

  // === CBC Mode Block Diagram (top) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('CBC Decryption Pipeline (vulnerable to padding oracle)',10,16);

  const nBlocks=4,bW=Math.min(120,(w-80)/nBlocks),bH=35,bY=30;
  for(let i=0;i<nBlocks;i++){
    const x=20+i*(bW+15);
    // Ciphertext block
    _x.fillStyle='#f8717122';_x.fillRect(x,bY,bW,bH);
    _x.strokeStyle='#f8717166';_x.strokeRect(x,bY,bW,bH);
    _x.fillStyle='#f87171';_x.font='bold 9px SF Mono';_x.textAlign='center';
    _x.fillText(i===0?'IV':`C${i}`,x+bW/2,bY+14);
    // Animated bytes
    const animByte=((0xAB+_t*3+i*47)&0xFF).toString(16).padStart(2,'0');
    _x.fillStyle=mut;_x.font='8px SF Mono';
    _x.fillText(`0x${animByte}...`,x+bW/2,bY+28);
    _x.textAlign='left';

    // Decrypt box
    const dY=bY+bH+12;
    _x.fillStyle='#60a5fa22';_x.fillRect(x+bW*0.15,dY,bW*0.7,22);
    _x.strokeStyle='#60a5fa66';_x.strokeRect(x+bW*0.15,dY,bW*0.7,22);
    _x.fillStyle='#60a5fa';_x.font='bold 8px SF Mono';_x.textAlign='center';
    _x.fillText('D_K',x+bW/2,dY+14);_x.textAlign='left';

    // XOR symbol
    const xorY=dY+28;
    _x.fillStyle='#fbbf24';_x.font='bold 12px SF Mono';_x.textAlign='center';
    _x.fillText('\u2295',x+bW/2,xorY+10);_x.textAlign='left';

    // Arrow from prev ciphertext
    if(i>0){
      _x.strokeStyle='#f87171';_x.setLineDash([2,2]);
      const prevX=20+(i-1)*(bW+15)+bW/2;
      _x.beginPath();_x.moveTo(prevX,bY+bH);_x.lineTo(prevX,xorY+2);_x.lineTo(x+bW/2-8,xorY+2);_x.stroke();
      _x.setLineDash([]);
    }

    // Plaintext output
    const pY=xorY+18;
    const isRecovering=(_t%nBlocks)===i;
    _x.fillStyle=isRecovering?'#4ade8044':'rgba(255,255,255,.04)';
    _x.fillRect(x,pY,bW,bH);
    _x.strokeStyle=isRecovering?'#4ade80':mut+'33';_x.strokeRect(x,pY,bW,bH);
    _x.fillStyle=isRecovering?'#4ade80':mut;_x.font='bold 9px SF Mono';_x.textAlign='center';
    _x.fillText(`P${i+1}`,x+bW/2,pY+14);_x.textAlign='left';

    // Down arrows
    _x.strokeStyle=mut+'44';
    _x.beginPath();_x.moveTo(x+bW/2,bY+bH);_x.lineTo(x+bW/2,dY);_x.stroke();
    _x.beginPath();_x.moveTo(x+bW/2,dY+22);_x.lineTo(x+bW/2,xorY);_x.stroke();
    _x.beginPath();_x.moveTo(x+bW/2,xorY+16);_x.lineTo(x+bW/2,pY);_x.stroke();
  }

  // === PKCS#7 Padding Visualization (middle-left) ===
  const padY=bY+bH+100,padX=10,padW=w*0.45;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('PKCS#7 Padding Values',padX,padY);
  for(let padVal=1;padVal<=8;padVal++){
    const y=padY+8+(padVal-1)*18;
    const totalBytes=8;
    const cW=padW/totalBytes;
    for(let b=0;b<totalBytes;b++){
      const isPad=b>=totalBytes-padVal;
      _x.fillStyle=isPad?'#fbbf2433':'#60a5fa11';
      _x.fillRect(padX+b*cW,y,cW-2,14);
      _x.strokeStyle=isPad?'#fbbf2466':mut+'22';_x.strokeRect(padX+b*cW,y,cW-2,14);
      if(isPad){
        _x.fillStyle='#fbbf24';_x.font='bold 8px SF Mono';_x.textAlign='center';
        _x.fillText(`0${padVal}`,padX+b*cW+cW/2,y+11);_x.textAlign='left';
      }
    }
    _x.fillStyle=mut;_x.font='8px Tajawal';
    _x.fillText(`pad=${padVal}`,padX+padW+4,y+11);
  }

  // === Oracle Query Heatmap (middle-right) ===
  const oqX=w*0.52,oqY=padY;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Oracle Query Byte Guesses (0x00-0xFF)',oqX,oqY);
  buildXorMatrix();
  const mCW=(w*0.46)/16,mCH=9;
  for(let i=0;i<16;i++){
    for(let j=0;j<16;j++){
      const val=_xorMatrix[i][j];
      const isValid=val===1||val===(_t%256);
      _x.fillStyle=isValid?'#4ade8088':`rgba(${val},${60},${255-val},.15)`;
      _x.fillRect(oqX+j*mCW,oqY+8+i*mCH,mCW-1,mCH-1);
    }
  }
  // Current guess highlight
  const guessVal=_t%256;
  const gi=Math.floor(guessVal/16),gj=guessVal%16;
  _x.strokeStyle='#f87171';_x.lineWidth=2;
  _x.strokeRect(oqX+gj*mCW-1,oqY+8+gi*mCH-1,mCW+1,mCH+1);_x.lineWidth=1;
  _x.fillStyle=mut;_x.font='9px SF Mono';
  _x.fillText(`Testing: 0x${guessVal.toString(16).padStart(2,'0')}  (${guessVal}/255)`,oqX,oqY+8+16*mCH+12);

  // === XOR Intermediate Value Recovery (bottom) ===
  const ixY=Math.max(padY+155,oqY+8+16*mCH+25);
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Intermediate Value Recovery: I[k] = guess XOR pad_value',10,ixY);

  const nBytes=8;
  const ixCW=Math.min(60,(w-20)/nBytes);
  for(let i=0;i<nBytes;i++){
    const x=10+i*ixCW;
    const recovered=i<Math.floor((_t%80)/10);
    const current=i===Math.floor((_t%80)/10);
    // Guess value
    _x.fillStyle='#f8717122';_x.fillRect(x,ixY+10,ixCW-4,22);
    _x.fillStyle='#f87171';_x.font='bold 8px SF Mono';_x.textAlign='center';
    _x.fillText(`g=${((_t+i*19)&0xFF).toString(16)}`,x+ixCW/2-2,ixY+24);
    // XOR arrow
    _x.fillStyle='#fbbf24';_x.font='bold 10px SF Mono';
    _x.fillText('\u2295',x+ixCW/2-2,ixY+40);
    // Intermediate value
    _x.fillStyle=recovered?'#4ade8044':current?'#fbbf2444':'rgba(255,255,255,.04)';
    _x.fillRect(x,ixY+46,ixCW-4,22);
    if(recovered){
      _x.fillStyle='#4ade80';_x.font='bold 9px SF Mono';
      _x.fillText(`0x${((0xDE+i*0x11)&0xFF).toString(16)}`,x+ixCW/2-2,ixY+60);
    }else if(current){
      _x.fillStyle='#fbbf24';_x.fillText('?',x+ixCW/2-2,ixY+60);
    }
    _x.textAlign='left';
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
