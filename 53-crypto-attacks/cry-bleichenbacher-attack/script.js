/**
 * Bleichenbacher Attack — Workshop DIY v1.0
 * RSA PKCS#1 v1.5 Padding Oracle Simulation
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas
 */
const $=id=>document.getElementById(id);

const LANG={
  en:{
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
    faq_q1:'What is Bleichenbacher\'s attack?',faq_a1:'A chosen-ciphertext attack against RSA PKCS#1 v1.5. The attacker sends modified ciphertexts and uses the server\'s "valid/invalid padding" response as an oracle to gradually decrypt the message.',
    faq_q2:'What is PKCS#1 v1.5 padding?',faq_a2:'Format: 0x00 0x02 [random non-zero bytes] 0x00 [message]. The server checks this format after decryption and reveals whether padding was valid.',
    faq_q3:'How many queries needed?',faq_a3:'Typically ~1 million oracle queries for a 1024-bit key. This demo uses tiny keys to make it interactive.',
    howto_1:'Click Setup Keys to generate RSA parameters.',howto_2:'Enter a short plaintext message.',howto_3:'Click Start Attack to run the simulation.',howto_4:'Watch the interval converge on the canvas.',
    wiki_padding:'PKCS#1 v1.5: EB = 00 || 02 || PS || 00 || M where PS is random non-zero padding of length >= 8 bytes.',
    wiki_oracle:'Padding Oracle: Server decrypts c and checks if plaintext starts with 00 02. This 1-bit leak enables full plaintext recovery.',
    wiki_intervals:'Interval Narrowing: Each conforming ciphertext narrows the range [a,b] containing the plaintext. After enough queries, a=b=plaintext.',
    mathExplain:'Bleichenbacher Attack Steps:\n1. Given ciphertext c = m^e mod N\n2. Choose random s, compute c\' = c * s^e mod N\n3. Server decrypts: (c\')^d = m*s mod N\n4. If result has valid PKCS#1 padding -> oracle says YES\n5. Each YES response constrains m to interval [a,b]\n6. Iterate with different s values to narrow [a,b]\n7. When a=b, plaintext m is recovered\n\nPKCS#1 v1.5 format (k-byte key):\n00 02 [PS >= 8 random bytes] 00 [message]\nValid range: 2*B <= m < 3*B where B = 2^(8*(k-2))'
  },
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
    faq_q1:'Qu\'est-ce que l\'attaque Bleichenbacher?',faq_a1:'Une attaque a texte chiffre choisi contre RSA PKCS#1 v1.5.',
    faq_q2:'Qu\'est-ce que le remplissage PKCS#1 v1.5?',faq_a2:'Format: 0x00 0x02 [octets non-nuls] 0x00 [message].',
    faq_q3:'Combien de requetes?',faq_a3:'Environ 1 million pour une cle 1024 bits. Cette demo utilise de petites cles.',
    howto_1:'Cliquez Generer Cles.',howto_2:'Entrez un court message.',howto_3:'Cliquez Lancer l\'Attaque.',howto_4:'Regardez la convergence de l\'intervalle.',
    wiki_padding:'PKCS#1 v1.5: EB = 00 || 02 || PS || 00 || M',
    wiki_oracle:'Oracle: Le serveur revele si le remplissage est valide apres dechiffrement.',
    wiki_intervals:'Retrecissement: Chaque texte conforme retrecit l\'intervalle [a,b].',
    mathExplain:'Etapes de l\'attaque Bleichenbacher:\n1. Texte chiffre c = m^e mod N\n2. Choisir s, calculer c\' = c * s^e mod N\n3. Le serveur dechiffre et verifie le remplissage\n4. Chaque reponse positive retrecit l\'intervalle\n5. Quand a=b, le message est recupere'
  },
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
    faq_q1:'ما هو هجوم بلايخنباخر؟',faq_a1:'هجوم نص مشفر مختار ضد RSA PKCS#1 v1.5.',
    faq_q2:'ما هو حشو PKCS#1 v1.5؟',faq_a2:'الصيغة: 0x00 0x02 [بايتات عشوائية غير صفرية] 0x00 [الرسالة].',
    faq_q3:'كم استعلام مطلوب؟',faq_a3:'حوالي مليون استعلام لمفتاح 1024 بت.',
    howto_1:'انقر توليد المفاتيح.',howto_2:'ادخل رسالة قصيرة.',howto_3:'انقر بدء الهجوم.',howto_4:'شاهد تقارب المجال.',
    wiki_padding:'PKCS#1 v1.5: EB = 00 || 02 || PS || 00 || M',
    wiki_oracle:'الاوراكل: الخادم يكشف ما اذا كان الحشو صالحا.',
    wiki_intervals:'تضييق المجال: كل نص مطابق يضيق المجال [a,b].',
    mathExplain:'خطوات هجوم بلايخنباخر:\n1. النص المشفر c = m^e mod N\n2. اختر s واحسب c\' = c * s^e mod N\n3. الخادم يفك التشفير ويتحقق من الحشو\n4. كل اجابة ايجابية تضيق المجال\n5. عندما a=b يتم استعادة الرسالة'
  }
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
