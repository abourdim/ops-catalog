/**
 * Meet-in-the-Middle Lab — Workshop DIY v1.0
 * 2DES MITM Attack Simulation
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas
 */
const $=id=>document.getElementById(id);

const LANG={
  en:{
    title:'Meet-in-the-Middle Lab',subtitle:'Break 2DES double encryption with a time-memory tradeoff',
    mainSection:'Meet-in-the-Middle Attack',mainDesc:'Show why 2DES with 2n-bit key has only n+1 bit security',
    keyBitsLabel:'Key Size (bits per key)',keyBitsHint:'Each key for the mini-cipher (small for demo)',
    ptLabel:'Plaintext (number)',ptHint:'Known plaintext value for the attack',
    encrypt2DES:'Encrypt (2DES)',mitm:'MITM Attack',bruteForce:'Brute Force',reset:'Reset',results:'Results',
    vizTitle:'MITM Visualization',vizHint:'Watch forward and backward tables meet in the middle',
    sectionA:'Attack Reference',sectionB:'Crypto Deep Dive',
    settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',
    langChanged:'Language -> English',themeChanged:'Theme ->',
    encrypted:'Double encryption complete',keysFound:'Keys found!',
    bruteComplete:'Brute force complete',resetDone:'Reset complete',attacking:'Running MITM...',
    howto_1:'Choose key size and plaintext value.',howto_2:'Click Encrypt to create 2DES ciphertext with random keys.',howto_3:'Click MITM Attack to recover the keys.',howto_4:'Compare with Brute Force timing.',
    wiki_mitm:'MITM: E_K1(P) = D_K2(C). Build table of all E_K1(P), then for each K2, check if D_K2(C) exists in the table.',
    wiki_2des:'2DES: C = E_K2(E_K1(P)). Double encryption with two independent keys K1, K2.',
    wiki_3des:'3DES: C = E_K3(D_K2(E_K1(P))). Encrypt-decrypt-encrypt with three keys resists MITM.',
    mathExplain:'Meet-in-the-Middle Attack:\n\nDouble encryption: C = E_K2(E_K1(P))\n\nAttack given known (P, C):\n1. Forward table: For all K1, compute M = E_K1(P), store (M -> K1)\n2. Backward: For all K2, compute M\' = D_K2(C)\n3. If M\' exists in forward table -> found K1, K2\n\nComplexity:\n- Brute force 2DES: O(2^(2n)) time\n- MITM: O(2^n) time + O(2^n) space\n- Effective security: n+1 bits, not 2n bits\n\nExample (n=56 for DES):\n- Expected: 2^112 work\n- Actual: 2^57 work + 2^56 memory'
  ,step1Title:'Choose Algorithm',step1Desc:'Select the cryptographic algorithm and key parameters to analyze.',step2Title:'Set Up Attack',step2Desc:'Configure the attack parameters: known plaintext, side-channel data, or timing.',step3Title:'Execute Attack',step3Desc:'Run the cryptographic attack and attempt to recover the secret key.',step4Title:'Analyze Results',step4Desc:'Evaluate attack success rate and understand the vulnerability exploited.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates cryptographic attacks! 🔬 You get to experiment with breaking encryption in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real breaking encryption so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real mathematical attacks on ciphers! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Cry Bleichenbacher Attack and Cry Padding Oracle Lab! Each teaches something different. 🚀'},
  fr:{
    title:'Labo Attaque par le Milieu',subtitle:'Cassez le double chiffrement 2DES par compromis temps-memoire',
    mainSection:'Attaque par le Milieu',mainDesc:'Montrez pourquoi 2DES avec cle 2n bits n\'a que n+1 bits de securite',
    keyBitsLabel:'Taille de Cle (bits par cle)',keyBitsHint:'Chaque cle du mini-chiffrement',
    ptLabel:'Texte Clair (nombre)',ptHint:'Valeur connue pour l\'attaque',
    encrypt2DES:'Chiffrer (2DES)',mitm:'Attaque MITM',bruteForce:'Force Brute',reset:'Reinitialiser',results:'Resultats',
    vizTitle:'Visualisation MITM',vizHint:'Regardez les tables avant et arriere se rencontrer',
    sectionA:'Reference d\'Attaque',sectionB:'Crypto en Profondeur',
    settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',
    langChanged:'Langue -> Francais',themeChanged:'Theme ->',
    encrypted:'Double chiffrement termine',keysFound:'Cles trouvees!',
    bruteComplete:'Force brute terminee',resetDone:'Reinitialisation complete',attacking:'MITM en cours...',
    howto_1:'Choisissez la taille de cle et le texte clair.',howto_2:'Cliquez Chiffrer pour creer le texte chiffre 2DES.',howto_3:'Cliquez Attaque MITM pour recuperer les cles.',howto_4:'Comparez avec le temps de la force brute.',
    wiki_mitm:'MITM: E_K1(P) = D_K2(C). Construire la table de tous les E_K1(P).',
    wiki_2des:'2DES: C = E_K2(E_K1(P)). Double chiffrement a deux cles.',
    wiki_3des:'3DES: C = E_K3(D_K2(E_K1(P))). Resiste a MITM.',
    mathExplain:'Attaque par le Milieu:\n\nDouble chiffrement: C = E_K2(E_K1(P))\n\n1. Table avant: Pour tout K1, M = E_K1(P)\n2. Arriere: Pour tout K2, M\' = D_K2(C)\n3. Si M\' dans la table -> K1, K2 trouves\n\nComplexite: O(2^n) temps + O(2^n) memoire'
  ,step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule cryptographic attacks ! 🔬 Tu peux expérimenter avec breaking encryption en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais breaking encryption.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai mathematical attacks on ciphers ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Cry Bleichenbacher Attack and Cry Padding Oracle Lab ! Chacune enseigne quelque chose de différent. 🚀'},
  ar:{
    title:'مختبر هجوم اللقاء في المنتصف',subtitle:'اكسر التشفير المزدوج 2DES بمقايضة الوقت والذاكرة',
    mainSection:'هجوم اللقاء في المنتصف',mainDesc:'اظهر لماذا 2DES بمفتاح 2n بت لديه فقط n+1 بت من الامان',
    keyBitsLabel:'حجم المفتاح (بت لكل مفتاح)',keyBitsHint:'كل مفتاح للشيفرة المصغرة',
    ptLabel:'النص الاصلي (رقم)',ptHint:'قيمة معروفة للهجوم',
    encrypt2DES:'تشفير (2DES)',mitm:'هجوم MITM',bruteForce:'قوة غاشمة',reset:'اعادة تعيين',results:'النتائج',
    vizTitle:'تصور MITM',vizHint:'شاهد الجداول الامامية والخلفية تلتقي في المنتصف',
    sectionA:'مرجع الهجوم',sectionB:'تعمق في التشفير',
    settings:'الاعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',
    help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',
    langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',
    encrypted:'اكتمل التشفير المزدوج',keysFound:'تم ايجاد المفاتيح!',
    bruteComplete:'اكتملت القوة الغاشمة',resetDone:'تمت اعادة التعيين',attacking:'تشغيل MITM...',
    howto_1:'اختر حجم المفتاح والنص الاصلي.',howto_2:'انقر تشفير لانشاء النص المشفر.',howto_3:'انقر هجوم MITM لاستعادة المفاتيح.',howto_4:'قارن مع وقت القوة الغاشمة.',
    wiki_mitm:'MITM: E_K1(P) = D_K2(C). بناء جدول لكل E_K1(P).',
    wiki_2des:'2DES: C = E_K2(E_K1(P)). تشفير مزدوج بمفتاحين.',
    wiki_3des:'3DES: C = E_K3(D_K2(E_K1(P))). يقاوم MITM.',
    mathExplain:'هجوم اللقاء في المنتصف:\n\nالتشفير المزدوج: C = E_K2(E_K1(P))\n\n1. جدول امامي: لكل K1 احسب M = E_K1(P)\n2. خلفي: لكل K2 احسب M\' = D_K2(C)\n3. اذا M\' في الجدول -> تم ايجاد K1 و K2\n\nالتعقيد: O(2^n) وقت + O(2^n) ذاكرة'
  ,step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي cryptographic attacks! 🔬 يمكنك التجربة مع breaking encryption في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج breaking encryption حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا mathematical attacks on ciphers حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Cry Bleichenbacher Attack and Cry Padding Oracle Lab! كل واحد يعلّم شيئاً مختلفاً. 🚀'}
};
let currentLang='en';

function setLanguage(lang){
  currentLang=lang;const s=LANG[lang];if(!s)return;
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;
  const sel=$('langSelect');if(sel)sel.value=lang;
  try{localStorage.setItem('cry-mitm-lang',lang)}catch{}
  log(s.langChanged,'info');buildHelp();buildRef();buildMath();
}
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('cry-mitm-theme',name)}catch{};log(`${LANG[currentLang].themeChanged} ${name}`,'info')}

let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.08);osc.start(t);osc.stop(t+.08)}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.3);osc.start(t);osc.stop(t+.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.25)}}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function togglePanel(panel,overlay){panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'))}

/* ======= MINI BLOCK CIPHER (XOR + S-box substitution) ======= */
const SBOX=[];const SBOX_INV=[];
(function(){for(let i=0;i<256;i++)SBOX[i]=(i*167+53)&0xFF;for(let i=0;i<256;i++)SBOX_INV[SBOX[i]]=i})();

function miniEncrypt(plaintext,key,bits){
  const mask=(1<<bits)-1;
  let v=plaintext&mask;
  // Simple Feistel-like: XOR key, S-box, rotate
  v^=key&mask;
  v=SBOX[v&0xFF]&mask;
  v=((v<<3)|(v>>(bits-3)))&mask;
  v^=(key>>2)&mask;
  return v;
}
function miniDecrypt(ciphertext,key,bits){
  const mask=(1<<bits)-1;
  let v=ciphertext&mask;
  v^=(key>>2)&mask;
  v=((v>>(3))|(v<<(bits-3)))&mask;
  v=SBOX_INV[v&0xFF]&mask;
  v^=key&mask;
  return v;
}

let state={K1:0,K2:0,P:0,C:0,bits:8,forwardTable:{},backwardHits:[],mitmResult:null,bruteResult:null,phase:'idle'};

function encrypt2DES(){
  const bits=parseInt($('keyBitsSelect').value);
  const P=parseInt($('ptInput').value)&((1<<bits)-1);
  const maxKey=(1<<bits);
  const K1=Math.floor(Math.random()*maxKey);
  const K2=Math.floor(Math.random()*maxKey);
  const M=miniEncrypt(P,K1,bits);
  const C=miniEncrypt(M,K2,bits);
  state={K1,K2,P,C,bits,forwardTable:{},backwardHits:[],mitmResult:null,bruteResult:null,phase:'encrypted'};
  const s=LANG[currentLang];
  log(`${s.encrypted}: P=${P}, K1=${K1}, K2=${K2}, C=${C}`,'success');
  $('resultsBox').textContent=`2DES Encryption\nPlaintext: ${P}\nKey1: ${K1} (0x${K1.toString(16)})\nKey2: ${K2} (0x${K2.toString(16)})\nMiddle: ${M}\nCiphertext: ${C}\n\nKey space: 2^${bits} = ${maxKey} per key\nBrute force: 2^${2*bits} = ${maxKey*maxKey}\nMITM: 2 * 2^${bits} = ${2*maxKey}`;
  drawCanvas();
}

function mitmAttack(){
  if(state.phase==='idle'){log('Encrypt first','error');return}
  const s=LANG[currentLang];
  showToast(s.attacking);log(s.attacking,'info');
  const start=performance.now();
  const maxKey=1<<state.bits;

  // Phase 1: Forward table E_K1(P) for all K1
  const forward=new Map();
  for(let k=0;k<maxKey;k++){
    const m=miniEncrypt(state.P,k,state.bits);
    if(!forward.has(m))forward.set(m,[]);
    forward.get(m).push(k);
  }
  state.forwardTable=forward;

  // Phase 2: Backward D_K2(C) for all K2
  let found=null;
  state.backwardHits=[];
  for(let k=0;k<maxKey;k++){
    const m=miniDecrypt(state.C,k,state.bits);
    if(forward.has(m)){
      for(const k1 of forward.get(m)){
        // Verify: full encryption path
        const check=miniEncrypt(miniEncrypt(state.P,k1,state.bits),k,state.bits);
        if(check===state.C){
          state.backwardHits.push({k2:k,k1,m});
          if(!found)found={K1:k1,K2:k};
        }
      }
    }
  }
  const elapsed=performance.now()-start;
  state.mitmResult={found,time:elapsed,ops:2*maxKey,tableSize:maxKey};
  state.phase='mitm-done';hideToast();

  if(found){
    log(`${s.keysFound} K1=${found.K1}, K2=${found.K2} in ${elapsed.toFixed(2)}ms (${2*maxKey} ops)`,'success');
    $('resultsBox').textContent+=`\n\n=== MITM RESULT ===\nK1=${found.K1}, K2=${found.K2}\nTime: ${elapsed.toFixed(2)}ms\nOperations: ${2*maxKey}\nTable entries: ${maxKey}\nMatches found: ${state.backwardHits.length}`;
  }
  drawCanvas();
}

function bruteForceAttack(){
  if(state.phase==='idle'){log('Encrypt first','error');return}
  const start=performance.now();
  const maxKey=1<<state.bits;let ops=0,found=null;
  for(let k1=0;k1<maxKey&&!found;k1++){
    for(let k2=0;k2<maxKey;k2++){
      ops++;
      if(miniEncrypt(miniEncrypt(state.P,k1,state.bits),k2,state.bits)===state.C){
        found={K1:k1,K2:k2};break;
      }
    }
  }
  const elapsed=performance.now()-start;
  state.bruteResult={found,time:elapsed,ops};
  const s=LANG[currentLang];
  log(`${s.bruteComplete}: ${ops} ops in ${elapsed.toFixed(2)}ms`,'info');
  $('resultsBox').textContent+=`\n\n=== BRUTE FORCE ===\nK1=${found?found.K1:'?'}, K2=${found?found.K2:'?'}\nTime: ${elapsed.toFixed(2)}ms\nOperations: ${ops}`;
  if(state.mitmResult){
    const speedup=(state.bruteResult.time/state.mitmResult.time).toFixed(1);
    $('resultsBox').textContent+=`\n\nMITM is ${speedup}x faster!`;
  }
  drawCanvas();
}

function resetAll(){state={K1:0,K2:0,P:0,C:0,bits:8,forwardTable:{},backwardHits:[],mitmResult:null,bruteResult:null,phase:'idle'};$('resultsBox').textContent='';log(LANG[currentLang].resetDone,'info');drawCanvas()}

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
  ctx.fillText('Meet-in-the-Middle Attack',10,22);

  if(state.phase==='idle'){
    ctx.fillStyle=muted;ctx.font='13px Tajawal';ctx.textAlign='center';
    ctx.fillText('Click "Encrypt (2DES)" to begin',w/2,h/2);ctx.textAlign='left';return;
  }

  // Draw 2DES flow diagram
  const boxW=100,boxH=40,midY=60;
  const pX=20,e1X=150,mX=290,e2X=430,cX=570;

  // Boxes
  [{x:pX,label:'P='+state.P,color:'#4ade80'},{x:e1X,label:'E_K1',color:'#60a5fa'},{x:mX,label:'M=?',color:'#fbbf24'},{x:e2X,label:'E_K2',color:'#60a5fa'},{x:cX,label:'C='+state.C,color:'#f87171'}].forEach(b=>{
    ctx.fillStyle=b.color+'22';ctx.fillRect(b.x,midY,boxW,boxH);
    ctx.strokeStyle=b.color;ctx.lineWidth=1.5;ctx.strokeRect(b.x,midY,boxW,boxH);
    ctx.fillStyle=b.color;ctx.font='bold 11px SF Mono,monospace';ctx.textAlign='center';
    ctx.fillText(b.label,b.x+boxW/2,midY+boxH/2+4);ctx.textAlign='left';
  });
  // Arrows
  [[pX+boxW,e1X],[e1X+boxW,mX],[mX+boxW,e2X],[e2X+boxW,cX]].forEach(([x1,x2])=>{
    ctx.strokeStyle=muted;ctx.beginPath();ctx.moveTo(x1,midY+boxH/2);ctx.lineTo(x2,midY+boxH/2);ctx.stroke();
  });

  // Forward table visualization
  if(state.forwardTable instanceof Map&&state.forwardTable.size>0){
    const tableY=midY+boxH+30;
    ctx.fillStyle='#60a5fa';ctx.font='bold 11px Tajawal';
    ctx.fillText('Forward: E_K1(P) for all K1',10,tableY);

    const maxKey=1<<state.bits;
    const barW=Math.min(4,(w/2-20)/maxKey);
    for(let k=0;k<maxKey;k++){
      const m=miniEncrypt(state.P,k,state.bits);
      const x=10+k*barW;
      const barH=(m/maxKey)*60;
      ctx.fillStyle='#60a5fa33';ctx.fillRect(x,tableY+10+60-barH,barW-1,barH);
    }

    // Backward hits
    ctx.fillStyle='#f87171';ctx.font='bold 11px Tajawal';
    ctx.fillText('Backward: D_K2(C) for all K2',w/2+10,tableY);

    for(let k=0;k<maxKey;k++){
      const m=miniDecrypt(state.C,k,state.bits);
      const x=w/2+10+k*barW;
      const barH=(m/maxKey)*60;
      const isHit=state.backwardHits.some(h=>h.k2===k);
      ctx.fillStyle=isHit?'#4ade80':'#f8717133';
      ctx.fillRect(x,tableY+10+60-barH,barW-1,barH);
    }

    // Match indicator
    if(state.backwardHits.length>0){
      const matchY=tableY+85;
      ctx.fillStyle='#4ade80';ctx.font='bold 12px Tajawal';
      ctx.textAlign='center';ctx.fillText(`Match! K1=${state.backwardHits[0].k1}, K2=${state.backwardHits[0].k2}, M=${state.backwardHits[0].m}`,w/2,matchY);ctx.textAlign='left';
    }
  }

  // Comparison bars
  if(state.mitmResult||state.bruteResult){
    const barY=h-80;
    ctx.fillStyle=accent;ctx.font='bold 11px Tajawal';ctx.fillText('Complexity Comparison:',10,barY);
    const maxOps=Math.max(state.mitmResult?state.mitmResult.ops:0,state.bruteResult?state.bruteResult.ops:0,1);
    const barH=20,barMaxW=w-120;

    if(state.mitmResult){
      const bw=(state.mitmResult.ops/maxOps)*barMaxW;
      ctx.fillStyle='#4ade8044';ctx.fillRect(100,barY+8,bw,barH);
      ctx.fillStyle='#4ade80';ctx.font='10px SF Mono';
      ctx.fillText(`MITM: ${state.mitmResult.ops} ops, ${state.mitmResult.time.toFixed(1)}ms`,10,barY+22);
    }
    if(state.bruteResult){
      const bw=(state.bruteResult.ops/maxOps)*barMaxW;
      ctx.fillStyle='#f8717144';ctx.fillRect(100,barY+34,bw,barH);
      ctx.fillStyle='#f87171';ctx.font='10px SF Mono';
      ctx.fillText(`Brute: ${state.bruteResult.ops} ops, ${state.bruteResult.time.toFixed(1)}ms`,10,barY+48);
    }
  }
}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'MITM',p:s.wiki_mitm},{t:'2DES',p:s.wiki_2des},{t:'3DES',p:s.wiki_3des}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){const s=LANG[currentLang];$('refCard').innerHTML=[{t:'MITM',p:s.wiki_mitm},{t:'2DES',p:s.wiki_2des},{t:'3DES',p:s.wiki_3des}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);
  resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-mitm-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-mitm-theme');if(t)setTheme(t)}catch{}

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

  $('encryptBtn').onclick=encrypt2DES;
  $('attackBtn').onclick=mitmAttack;
  $('bruteBtn').onclick=bruteForceAttack;
  $('resetBtn').onclick=resetAll;

  buildHelp();buildRef();buildMath();
  log(LANG[currentLang].ready,'success');drawCanvas();
});

/* ═══════ ENHANCED MEET-IN-THE-MIDDLE VISUALIZATION (IIFE) ═══════ */
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

  // === Double Encryption Pipeline (top) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('2DES Double Encryption Pipeline',10,16);

  const boxes=[
    {label:'P',desc:'Plaintext',x:w*0.05,color:'#4ade80'},
    {label:'E_K1',desc:'Encrypt',x:w*0.22,color:'#60a5fa'},
    {label:'M',desc:'Middle',x:w*0.42,color:'#fbbf24'},
    {label:'E_K2',desc:'Encrypt',x:w*0.60,color:'#60a5fa'},
    {label:'C',desc:'Ciphertext',x:w*0.78,color:'#f87171'}
  ];
  const bW=60,bH=30,bY=28;
  boxes.forEach((b,i)=>{
    _x.fillStyle=b.color+'22';_x.fillRect(b.x,bY,bW,bH);_x.strokeStyle=b.color;_x.strokeRect(b.x,bY,bW,bH);
    _x.fillStyle=b.color;_x.font='bold 10px SF Mono';_x.textAlign='center';
    _x.fillText(b.label,b.x+bW/2,bY+14);_x.fillStyle=mut;_x.font='7px Tajawal';_x.fillText(b.desc,b.x+bW/2,bY+26);_x.textAlign='left';
    if(i<boxes.length-1){
      _x.strokeStyle=mut+'66';_x.beginPath();_x.moveTo(b.x+bW,bY+bH/2);_x.lineTo(boxes[i+1].x,bY+bH/2);_x.stroke();
    }
  });
  // Animated data flow
  const flowPhase=(_t%100)/100;
  const flowX=boxes[0].x+bW+(boxes[4].x-boxes[0].x-bW)*flowPhase;
  _x.fillStyle='#fff';_x.beginPath();_x.arc(flowX,bY+bH/2,4,0,Math.PI*2);_x.fill();

  // === Forward & Backward Table Concept (middle) ===
  const tbY=bY+bH+20;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('MITM: Forward & Backward Hash Tables',10,tbY);

  const halfW=w*0.45;
  // Forward table
  _x.fillStyle='#60a5fa';_x.font='bold 10px SF Mono';_x.fillText('Forward: E_K1(P)',10,tbY+16);
  const nEntries=12;
  const entryH=14;
  for(let i=0;i<nEntries;i++){
    const y=tbY+22+i*entryH;
    const isActive=i<=(_t%nEntries);
    const k1=i*19+3;const m=miniEncrypt(42,k1,8);
    _x.fillStyle=isActive?'#60a5fa22':'rgba(255,255,255,.02)';
    _x.fillRect(10,y,halfW-10,entryH-2);
    _x.fillStyle=isActive?'#60a5fa':mut;_x.font='7px SF Mono';
    _x.fillText(`K1=${k1.toString(16).padStart(2,'0')} -> M=${m.toString(16).padStart(2,'0')}  [stored in table]`,14,y+10);
  }

  // Backward table
  _x.fillStyle='#f87171';_x.font='bold 10px SF Mono';_x.fillText('Backward: D_K2(C)',w*0.52,tbY+16);
  for(let i=0;i<nEntries;i++){
    const y=tbY+22+i*entryH;
    const isActive=i<=(_t%(nEntries+3));
    const k2=i*23+7;const m=miniDecrypt(187,k2,8);
    const isMatch=i===7&&_t%40>20;
    _x.fillStyle=isMatch?'#4ade8044':isActive?'#f8717122':'rgba(255,255,255,.02)';
    _x.fillRect(w*0.52,y,halfW-10,entryH-2);
    _x.fillStyle=isMatch?'#4ade80':isActive?'#f87171':mut;_x.font='7px SF Mono';
    _x.fillText(`K2=${k2.toString(16).padStart(2,'0')} -> M'=${m.toString(16).padStart(2,'0')}  ${isMatch?'<< MATCH!':'[lookup]'}`,w*0.52+4,y+10);
  }

  // Match arrow
  if(_t%40>20){
    const matchY=tbY+22+7*entryH+entryH/2;
    _x.strokeStyle='#4ade80';_x.lineWidth=2;_x.setLineDash([3,3]);
    _x.beginPath();_x.moveTo(halfW,matchY);_x.lineTo(w*0.52,matchY);_x.stroke();
    _x.setLineDash([]);_x.lineWidth=1;
    _x.fillStyle='#4ade80';_x.font='bold 9px SF Mono';_x.textAlign='center';
    _x.fillText('M = M\' => Found K1, K2!',w/2,matchY-6);_x.textAlign='left';
  }

  // === Complexity Comparison Chart (bottom) ===
  const ccY=tbY+22+nEntries*entryH+15;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Why 2DES Fails: Complexity Analysis',10,ccY);

  const bits=[4,6,8,10,12,14,16];
  const chartW=w-40,chartH=h-ccY-35;
  const maxLog=32;
  _x.strokeStyle=mut+'44';_x.beginPath();
  _x.moveTo(30,ccY+8);_x.lineTo(30,ccY+8+chartH);_x.lineTo(30+chartW,ccY+8+chartH);_x.stroke();

  // Brute force line (2^2n)
  _x.strokeStyle='#f87171';_x.lineWidth=2;_x.beginPath();
  bits.forEach((b,i)=>{
    const x=30+i/(bits.length-1)*chartW;
    const y=ccY+8+chartH-(2*b/maxLog)*chartH;
    if(i===0)_x.moveTo(x,y);else _x.lineTo(x,y);
  });_x.stroke();

  // MITM line (2^(n+1))
  _x.strokeStyle='#4ade80';_x.beginPath();
  bits.forEach((b,i)=>{
    const x=30+i/(bits.length-1)*chartW;
    const y=ccY+8+chartH-((b+1)/maxLog)*chartH;
    if(i===0)_x.moveTo(x,y);else _x.lineTo(x,y);
  });_x.stroke();_x.lineWidth=1;

  // Single DES line (2^n)
  _x.strokeStyle='#fbbf24';_x.setLineDash([4,4]);_x.beginPath();
  bits.forEach((b,i)=>{
    const x=30+i/(bits.length-1)*chartW;
    const y=ccY+8+chartH-(b/maxLog)*chartH;
    if(i===0)_x.moveTo(x,y);else _x.lineTo(x,y);
  });_x.stroke();_x.setLineDash([]);

  // Legend
  _x.fillStyle='#f87171';_x.font='8px SF Mono';_x.fillText('Brute 2^(2n)',w-180,ccY+14);
  _x.fillStyle='#4ade80';_x.fillText('MITM 2^(n+1)',w-180,ccY+26);
  _x.fillStyle='#fbbf24';_x.fillText('1DES 2^n',w-180,ccY+38);

  // X-axis labels
  bits.forEach((b,i)=>{
    const x=30+i/(bits.length-1)*chartW;
    _x.fillStyle=mut;_x.font='7px SF Mono';_x.textAlign='center';
    _x.fillText(`${b}`,x,ccY+8+chartH+10);_x.textAlign='left';
  });
  _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText('Key bits (n)',30+chartW/2-20,ccY+8+chartH+20);

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
