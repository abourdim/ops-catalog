/**
 * Length Extension Lab — Workshop DIY v1.0
 * Demonstrate length extension attack on Merkle-Damgard hashes
 */
const $=id=>document.getElementById(id);
const LANG={en:{title:'Length Extension Lab',subtitle:'Exploit Merkle-Damgard hash to forge MACs',mainSection:'Length Extension Attack',mainDesc:'Forge valid MAC by extending known hash without the secret',computeMAC:'Compute MAC',forgeMAC:'Forge Extended MAC',results:'Results',vizTitle:'Merkle-Damgard Visualization',vizHint:'See how the hash chain allows extension',sectionA:'Attack Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',macComputed:'MAC computed',forged:'MAC forged successfully!',howto_1:'Enter original message.',howto_2:'Click Compute MAC to create H(secret||msg).',howto_3:'Enter data to append.',howto_4:'Click Forge to create valid H(secret||msg||pad||append).',wiki_md:'Merkle-Damgard: process message in blocks, chain compression function outputs. Final state = hash.',wiki_ext:'Length extension: use hash output as initial state, continue hashing with appended data.',wiki_hmac:'HMAC: H(K xor opad || H(K xor ipad || msg)). Two nested hashes prevent length extension.',mathExplain:'Length Extension Attack:\n\nGiven: MAC = H(secret || message)\nKnown: len(secret), message, MAC\nGoal: compute H(secret || message || padding || append)\n\nSteps:\n1. Reconstruct padding for (secret || message)\n2. Set hash internal state = MAC value\n3. Continue hashing: H_state(append)\n4. Result = valid MAC for extended message\n\nPadding (MD): message || 0x80 || 0x00...00 || length_bits',step1Title:'Choose Algorithm',step1Desc:'Select the cryptographic algorithm and key parameters to analyze.',step2Title:'Set Up Attack',step2Desc:'Configure the attack parameters: known plaintext, side-channel data, or timing.',step3Title:'Execute Attack',step3Desc:'Run the cryptographic attack and attempt to recover the secret key.',step4Title:'Analyze Results',step4Desc:'Evaluate attack success rate and understand the vulnerability exploited.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates cryptographic attacks! 🔬 You get to experiment with breaking encryption in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real breaking encryption so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real mathematical attacks on ciphers! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Cry Timing Oracle Attack and Cry Meet In Middle Lab! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',learnAge:'Ages:'},
fr:{title:'Labo Extension de Longueur',subtitle:'Exploitez Merkle-Damgard pour forger des MACs',mainSection:'Attaque Extension de Longueur',mainDesc:'Forgez un MAC valide en etendant un condensat connu',computeMAC:'Calculer MAC',forgeMAC:'Forger MAC Etendu',results:'Resultats',vizTitle:'Visualisation Merkle-Damgard',vizHint:'Voyez comment la chaine permet l\'extension',sectionA:'Reference',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',macComputed:'MAC calcule',forged:'MAC forge avec succes!',howto_1:'Entrez le message.',howto_2:'Cliquez Calculer MAC.',howto_3:'Entrez les donnees a ajouter.',howto_4:'Cliquez Forger.',wiki_md:'Merkle-Damgard: traite par blocs, chaine les sorties.',wiki_ext:'Extension: utilise le hash comme etat initial, continue le hachage.',wiki_hmac:'HMAC: deux hachages imbriques empechent l\'extension.',mathExplain:'Attaque Extension de Longueur:\nDonne: MAC = H(secret || message)\nBut: H(secret || message || padding || ajout)',step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule cryptographic attacks ! 🔬 Tu peux expérimenter avec breaking encryption en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Timing Oracle Attack and Cry Meet In Middle Lab ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
ar:{title:'مختبر تمديد الطول',subtitle:'استغل بنية ميركل-دامغارد لتزوير MACs',mainSection:'هجوم تمديد الطول',mainDesc:'زوّر MAC صالح بتمديد تجزئة معروفة بدون السر',computeMAC:'حساب MAC',forgeMAC:'تزوير MAC ممتد',results:'النتائج',vizTitle:'تصور ميركل-دامغارد',vizHint:'شاهد كيف تسمح السلسلة بالتمديد',sectionA:'مرجع',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',macComputed:'تم حساب MAC',forged:'تم تزوير MAC بنجاح!',howto_1:'أدخل الرسالة.',howto_2:'اضغط حساب MAC.',howto_3:'أدخل البيانات المراد إضافتها.',howto_4:'اضغط تزوير.',wiki_md:'ميركل-دامغارد: معالجة بالكتل، سلسلة مخرجات الضغط.',wiki_ext:'التمديد: استخدام مخرج التجزئة كحالة أولية.',wiki_hmac:'HMAC: تجزئتان متداخلتان تمنعان التمديد.',mathExplain:'هجوم تمديد الطول:\nمعطى: MAC = H(سر || رسالة)\nالهدف: H(سر || رسالة || حشو || إضافة)',step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي cryptographic attacks! 🔬 يمكنك التجربة مع breaking encryption في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Timing Oracle Attack and Cry Meet In Middle Lab! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Encryption',learn1Desc:'How mathematical algorithms protect secrets',learn1Tag:'Cryptography',learn2Title:'Attack Methods',learn2Desc:'How cryptanalysts break encryption schemes',learn2Tag:'Offensive',learn3Title:'Statistical Analysis',learn3Desc:'How patterns in data reveal encrypted content',learn3Tag:'Math',learn4Title:'Strong Crypto',learn4Desc:'How to choose unbreakable encryption methods',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}};
let currentLang='en';function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;if($('langSelect'))$('langSelect').value=l;try{localStorage.setItem('cry-le-lang',l)}catch{}log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));if($('themeSelect'))$('themeSelect').value=n;try{localStorage.setItem('cry-le-theme',n)}catch{}}
let soundEnabled=false;function playSound(t){if(!soundEnabled)return;const a=new(window.AudioContext||window.webkitAudioContext)();const o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);g.gain.value=.08;o.frequency.value=t==='success'?523:200;g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.2);o.start();o.stop(a.currentTime+.2)}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success')}
function showToast(m){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function togglePanel(p,o){p.classList.toggle('open');if(o)o.classList.toggle('active',p.classList.contains('open'))}

/* ═══════ SIMPLIFIED HASH (Merkle-Damgard-like) ═══════ */
const SECRET='mysecretkey';let originalMAC=null,blocks=[],forgedBlocks=[];
function simpleHash(data,initState=0x67452301){let h=initState;const bs=[];for(let i=0;i<data.length;i++){h=((h<<5)+h+data.charCodeAt(i))>>>0;if((i+1)%8===0||i===data.length-1)bs.push({block:data.slice(Math.max(0,i-7),i+1),state:h})}return{hash:h,blocks:bs}}
function computeMAC(){const msg=$('msgInput').value;const fullMsg=SECRET+msg;const result=simpleHash(fullMsg);originalMAC=result.hash;blocks=result.blocks;
  const s=LANG[currentLang];log(s.macComputed,'success');
  $('resultsBox').textContent=`Original Message: "${msg}"\nMAC = H(secret || msg) = 0x${originalMAC.toString(16).padStart(8,'0')}\nSecret length: ${SECRET.length} (unknown to attacker)\nBlocks processed: ${blocks.length}`;drawCanvas()}

function forgeMAC(){if(!originalMAC){computeMAC()}const append=$('appendInput').value;const padding='\x80'+'\x00'.repeat(7);
  const extResult=simpleHash(padding+append,originalMAC);forgedBlocks=extResult.blocks;
  const forgedHash=extResult.hash;
  // Verify: compute actual hash of full extended message
  const fullExtended=SECRET+$('msgInput').value+padding+append;const verify=simpleHash(fullExtended);
  const s=LANG[currentLang];
  $('resultsBox').textContent+=`\n\n--- LENGTH EXTENSION ATTACK ---\nAppended data: "${append}"\nForged MAC: 0x${forgedHash.toString(16).padStart(8,'0')}\nVerification: 0x${verify.hash.toString(16).padStart(8,'0')}\nMatch: ${forgedHash===verify.hash?'YES - FORGED!':'NO'}\n\nAttacker created valid MAC for:\n"${$('msgInput').value}${padding}${append}"\nwithout knowing the secret!`;
  log(s.forged,'success');drawCanvas()}

const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}
function drawCanvas(){if(!ctx)return;const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),text=getCS('--text'),muted=getCS('--text-muted');ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';ctx.fillText('Merkle-Damgard Hash Chain',10,22);
  // Draw original chain
  if(blocks.length>0){ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Original: H(secret || message)',10,45);
    const bw=Math.min(80,(w-40)/(blocks.length+1)),by=60,bh=50;
    // IV
    ctx.fillStyle='#4ade8033';ctx.fillRect(10,by,bw-4,bh);ctx.fillStyle='#4ade80';ctx.font='9px monospace';ctx.fillText('IV',14,by+15);ctx.fillText('0x67452301',14,by+30);
    blocks.forEach((b,i)=>{const x=10+(i+1)*bw;ctx.strokeStyle=accent;ctx.beginPath();ctx.moveTo(x-4,by+bh/2);ctx.lineTo(x,by+bh/2);ctx.stroke();
      ctx.fillStyle=i<blocks.length-1?`${accent}33`:'#f8717133';ctx.fillRect(x,by,bw-4,bh);ctx.fillStyle=i<blocks.length-1?accent:'#f87171';ctx.font='8px monospace';ctx.fillText(b.block.slice(0,8),x+2,by+15);ctx.fillText('0x'+b.state.toString(16).padStart(8,'0'),x+2,by+35)})}
  // Draw forged extension
  if(forgedBlocks.length>0){const fy=140;ctx.fillStyle='#f87171';ctx.font='10px Tajawal';ctx.fillText('Forged Extension: resume from MAC state',10,fy-5);
    const bw=Math.min(80,(w-40)/(forgedBlocks.length+1)),bh=50;
    ctx.fillStyle='#f8717133';ctx.fillRect(10,fy,bw-4,bh);ctx.fillStyle='#f87171';ctx.font='9px monospace';ctx.fillText('MAC state',14,fy+15);ctx.fillText('0x'+originalMAC.toString(16).padStart(8,'0'),14,fy+35);
    forgedBlocks.forEach((b,i)=>{const x=10+(i+1)*bw;ctx.strokeStyle='#f87171';ctx.beginPath();ctx.moveTo(x-4,fy+bh/2);ctx.lineTo(x,fy+bh/2);ctx.stroke();
      ctx.fillStyle='#f8717133';ctx.fillRect(x,fy,bw-4,bh);ctx.fillStyle='#f87171';ctx.font='8px monospace';ctx.fillText(b.block.slice(0,8),x+2,fy+15);ctx.fillText('0x'+b.state.toString(16).padStart(8,'0'),x+2,fy+35)})}
  // Explanation
  ctx.fillStyle=muted;ctx.font='11px Tajawal';ctx.fillText('The attacker uses the MAC output as the new initial state,',10,h-40);ctx.fillText('then continues hashing with the appended data.',10,h-24)}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'Merkle-Damgard',p:s.wiki_md},{t:'Extension',p:s.wiki_ext},{t:'HMAC Defense',p:s.wiki_hmac}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){$('refCard').innerHTML=[{t:'Merkle-Damgard',p:LANG[currentLang].wiki_md},{t:'Extension',p:LANG[currentLang].wiki_ext},{t:'HMAC',p:LANG[currentLang].wiki_hmac}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}
document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-le-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-le-theme');if(t)setTheme(t)}catch{}
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));$('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));$('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));$('logCloseBtn').onclick=()=>togglePanel($('logPanel'));
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);$('soundToggle').onchange=e=>{soundEnabled=e.target.checked};
  $('clearLogBtn').onclick=()=>{$('logContainer').innerHTML='';log('Log cleared')};$('copyLogBtn').onclick=async()=>{try{await navigator.clipboard.writeText(Array.from($('logContainer').children).map(d=>d.textContent).join('\n'));log('Copied!','success')}catch{log('Copy failed','error')}};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)).classList.add('active')}});
  $('hashBtn').onclick=computeMAC;$('forgeBtn').onclick=forgeMAC;
  buildHelp();buildRef();buildMath();log(LANG[currentLang].ready,'success');drawCanvas()});

/* ═══════ ENHANCED LENGTH EXTENSION VISUALIZATION (IIFE) ═══════ */
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

  // === Merkle-Damgard Architecture (top) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Merkle-Damgard Hash Construction',10,16);

  const nBlocks=7,bW=Math.min(85,(w-60)/(nBlocks+1)),bH=30,bY=30;
  // IV
  _x.fillStyle='#c084fc33';_x.fillRect(5,bY,bW*0.6,bH);_x.strokeStyle='#c084fc66';_x.strokeRect(5,bY,bW*0.6,bH);
  _x.fillStyle='#c084fc';_x.font='bold 8px SF Mono';_x.textAlign='center';_x.fillText('IV',5+bW*0.3,bY+12);
  const animState=(0x67452301+_t*137)>>>0;
  _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText(`0x${(animState&0xFFFF).toString(16)}`,5+bW*0.3,bY+24);_x.textAlign='left';

  for(let i=0;i<nBlocks;i++){
    const x=5+bW*0.6+5+i*bW;
    const isSecret=i<2;
    const isMsg=i>=2&&i<5;
    const isPad=i===5;
    const isExt=i===6;
    const color=isSecret?'#f87171':isMsg?'#4ade80':isPad?'#fbbf24':'#c084fc';

    // Compression function box
    _x.fillStyle=color+'22';_x.fillRect(x,bY,bW-5,bH);_x.strokeStyle=color+'66';_x.strokeRect(x,bY,bW-5,bH);

    // Arrow from previous
    _x.strokeStyle=color+'88';_x.beginPath();_x.moveTo(x-5,bY+bH/2);_x.lineTo(x,bY+bH/2);_x.stroke();
    _x.fillStyle=color;_x.beginPath();_x.moveTo(x,bY+bH/2);_x.lineTo(x-4,bY+bH/2-3);_x.lineTo(x-4,bY+bH/2+3);_x.fill();

    // Block label
    _x.fillStyle=color;_x.font='bold 7px SF Mono';_x.textAlign='center';
    const label=isSecret?`SECRET[${i}]`:isMsg?`MSG[${i-2}]`:isPad?'PAD':'EXTEND';
    _x.fillText(label,x+bW/2-2.5,bY+12);

    // State value
    const state=((_t*31+i*0x9E3779B9)>>>0)&0xFFFF;
    _x.fillStyle=mut;_x.font='7px SF Mono';
    _x.fillText(`h=${state.toString(16)}`,x+bW/2-2.5,bY+24);
    _x.textAlign='left';

    // Input from top (message block)
    _x.strokeStyle=color+'44';
    _x.beginPath();_x.moveTo(x+bW/2-2.5,bY-5);_x.lineTo(x+bW/2-2.5,bY);_x.stroke();
    _x.fillStyle=color+'33';_x.fillRect(x+5,bY-18,bW-15,13);
    _x.fillStyle=color;_x.font='6px SF Mono';_x.textAlign='center';
    _x.fillText(isSecret?'[secret]':isMsg?`m${i-2}`:'pad/ext',x+bW/2-2.5,bY-9);_x.textAlign='left';
  }

  // Output label
  const outX=5+bW*0.6+5+nBlocks*bW;
  _x.fillStyle='#f87171';_x.font='bold 9px SF Mono';
  _x.fillText('MAC',outX,bY+18);

  // === Attack Anatomy (middle) ===
  const aaY=bY+bH+30;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Length Extension Attack Steps',10,aaY);

  const attackSteps=[
    {step:'1',desc:'Attacker knows: H(secret || msg), len(secret), msg',color:'#60a5fa'},
    {step:'2',desc:'Reconstruct padding: msg || 0x80 || zeros || length',color:'#fbbf24'},
    {step:'3',desc:'Set internal state = known MAC output value',color:'#f87171'},
    {step:'4',desc:'Continue hashing: H_state(appended_data)',color:'#c084fc'},
    {step:'5',desc:'Result = valid MAC for (secret||msg||pad||append)',color:'#4ade80'}
  ];

  attackSteps.forEach((s,i)=>{
    const y=aaY+10+i*20;
    const isActive=Math.floor(_t/50)%attackSteps.length===i;
    _x.fillStyle=isActive?s.color+'33':'rgba(255,255,255,.02)';
    _x.fillRect(10,y,w*0.48-5,18);
    _x.fillStyle=isActive?s.color:mut;_x.font='9px SF Mono';
    _x.fillText(`[${s.step}] ${s.desc}`,14,y+13);
    if(isActive){
      _x.fillStyle=s.color;
      _x.beginPath();_x.arc(w*0.48,y+9,3,0,Math.PI*2);_x.fill();
    }
  });

  // === Vulnerable vs Immune Hashes (middle-right) ===
  const vhX=w*0.52,vhY=aaY;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Hash Function Vulnerability',vhX,vhY);

  const hashes=[
    {name:'MD5',bits:128,vulnerable:true,broken:true},
    {name:'SHA-1',bits:160,vulnerable:true,broken:true},
    {name:'SHA-256',bits:256,vulnerable:true,broken:false},
    {name:'SHA-512',bits:512,vulnerable:true,broken:false},
    {name:'SHA-3',bits:256,vulnerable:false,broken:false},
    {name:'BLAKE2',bits:256,vulnerable:false,broken:false},
    {name:'HMAC-*',bits:0,vulnerable:false,broken:false}
  ];

  const hhW=w*0.46,hhBarW=hhW-80;
  hashes.forEach((hf,i)=>{
    const y=vhY+10+i*16;
    _x.fillStyle=hf.vulnerable?'#f8717122':'#4ade8022';
    _x.fillRect(vhX,y,hhW,14);
    _x.fillStyle=hf.vulnerable?(hf.broken?'#f87171':'#fbbf24'):'#4ade80';
    _x.font='bold 8px SF Mono';_x.fillText(hf.name,vhX+4,y+10);
    // Status
    const status=hf.vulnerable?(hf.broken?'VULNERABLE+BROKEN':'VULNERABLE (MD construct)'):'IMMUNE';
    _x.fillStyle=mut;_x.font='7px SF Mono';_x.fillText(status,vhX+60,y+10);
    // Indicator
    _x.fillStyle=hf.vulnerable?'#f87171':'#4ade80';
    _x.beginPath();_x.arc(vhX+hhW-10,y+7,4,0,Math.PI*2);_x.fill();
  });

  // === MD Padding Visualization (bottom) ===
  const pdY=Math.max(aaY+115,vhY+130);
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Merkle-Damgard Padding (64-byte block)',10,pdY);

  const totalBytes=64;
  const byteW=Math.min(12,(w-20)/totalBytes);
  const msgLen=(_t%30)+5;
  for(let i=0;i<totalBytes;i++){
    const x=10+i*byteW;
    let color,label;
    if(i<msgLen){color='#4ade80';label=((0x41+i)&0x7F).toString(16)}
    else if(i===msgLen){color='#fbbf24';label='80'}
    else if(i<56){color=mut+'22';label='00'}
    else{color='#c084fc';label=((msgLen*8)>>(56-i)*8&0xFF).toString(16).padStart(2,'0').slice(-2)}
    _x.fillStyle=typeof color==='string'&&color.length<8?color+'33':color;
    _x.fillRect(x,pdY+10,byteW-1,18);
    _x.fillStyle=typeof color==='string'&&color.length<8?color:mut;
    _x.font='bold 6px SF Mono';_x.textAlign='center';
    _x.fillText(label,x+byteW/2,pdY+22);_x.textAlign='left';
  }

  // Legend
  const legY=pdY+34;
  [{c:'#4ade80',t:'Message'},{c:'#fbbf24',t:'0x80'},{c:mut,t:'Zero fill'},{c:'#c084fc',t:'Length (bits)'}].forEach((l,i)=>{
    const lx=10+i*90;
    _x.fillStyle=l.c;_x.fillRect(lx,legY,8,8);
    _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText(l.t,lx+12,legY+8);
  });

  // === HMAC Defense Diagram (bottom-right) ===
  const hmY=pdY+50;
  if(hmY+40<h){
    _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
    _x.fillText('HMAC = H(K xor opad || H(K xor ipad || msg))  -- immune to extension',10,hmY);
    const pipeW=w-20,pipeH=20;
    const stages=['K xor ipad','H_inner(msg)','K xor opad','H_outer','HMAC'];
    const stW=pipeW/stages.length;
    stages.forEach((s,i)=>{
      const x=10+i*stW;
      const progress=(_t%100)/100;
      const active=progress*stages.length>i&&progress*stages.length<i+1;
      _x.fillStyle=active?'#4ade8044':'rgba(255,255,255,.03)';
      _x.fillRect(x,hmY+8,stW-4,pipeH);
      _x.strokeStyle=active?'#4ade80':mut+'33';_x.strokeRect(x,hmY+8,stW-4,pipeH);
      _x.fillStyle=active?'#4ade80':mut;_x.font='bold 7px SF Mono';_x.textAlign='center';
      _x.fillText(s,x+stW/2-2,hmY+22);_x.textAlign='left';
      if(i<stages.length-1){_x.fillStyle=acc;_x.beginPath();_x.moveTo(x+stW-4,hmY+18);_x.lineTo(x+stW,hmY+15);_x.lineTo(x+stW,hmY+21);_x.fill()}
    });
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
