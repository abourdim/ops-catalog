/**
 * X.509 Certificate Forgery Lab — Workshop DIY v1.0
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas PKI Visualization
 */
const $=id=>document.getElementById(id);

/* ======= i18n ======= */
const LANG={
  en:{
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
    faq_q1:'What is certificate forgery?',faq_a1:'Creating a fake X.509 certificate that impersonates a legitimate server, bypassing PKI trust chain validation.',
    faq_q2:'What is a null-byte attack?',faq_a2:'Injecting \\0 in the CN field so validators see a truncated domain. e.g. evil.com\\0.good.com passes as good.com.',
    faq_q3:'Why MD5 collisions matter?',faq_a3:'MD5 hash collisions allow forging a rogue CA certificate with the same signature as a legitimate one.',
    howto_1:'Enter a root CA name and target domain.',howto_2:'Choose an attack type from the dropdown.',howto_3:'Click Forge Certificate to create the forged chain.',howto_4:'Click Verify Chain to see if the forgery is detected.',
    wiki_self:'Self-signed: Certificate signed by its own key, not a trusted CA. Browsers reject unless manually trusted.',
    wiki_chain:'Chain bypass: Missing intermediate validation. Attacker creates fake intermediate CA.',
    wiki_null:'Null-byte: CN=evil.com\\x00.target.com tricks parsers that stop at \\0.',
    wiki_md5:'MD5 collision: Two different certificates with identical MD5 hash, enabling signature forgery.',
    mathExplain:'X.509 Certificate Chain:\n1. Root CA (self-signed, trusted by OS/browser)\n2. Intermediate CA (signed by Root)\n3. Leaf cert (signed by Intermediate)\n\nValidation: Browser walks chain from leaf to root,\nchecking each signature: verify(parent.pubkey, child.sig)\n\nAttack vectors:\n- Self-signed: skip chain entirely\n- Chain break: forge intermediate with different key\n- Null-byte: CN parsing vulnerability\n- MD5 collision: forge cert with matching hash'
  },
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
    faq_q1:'Qu\'est-ce que la falsification de certificat?',faq_a1:'Creer un faux certificat X.509 qui usurpe l\'identite d\'un serveur legitime.',
    faq_q2:'Qu\'est-ce qu\'une attaque null-byte?',faq_a2:'Injection de \\0 dans le champ CN pour tromper les validateurs.',
    faq_q3:'Pourquoi les collisions MD5 comptent?',faq_a3:'Les collisions MD5 permettent de falsifier un certificat CA rogue avec la meme signature.',
    howto_1:'Entrez un nom de CA racine et un domaine cible.',howto_2:'Choisissez un type d\'attaque.',howto_3:'Cliquez sur Falsifier le Certificat.',howto_4:'Cliquez sur Verifier la Chaine.',
    wiki_self:'Auto-signe: Certificat signe par sa propre cle, non approuve par un CA.',
    wiki_chain:'Contournement de chaine: Validation intermediaire manquante.',
    wiki_null:'Null-byte: CN=evil.com\\x00.cible.com trompe les parseurs.',
    wiki_md5:'Collision MD5: Deux certificats differents avec le meme hachage MD5.',
    mathExplain:'Chaine de Certificats X.509:\n1. CA Racine (auto-signe, approuve par OS/navigateur)\n2. CA Intermediaire (signe par Racine)\n3. Certificat feuille (signe par Intermediaire)\n\nValidation: Le navigateur parcourt la chaine,\nverifiant chaque signature.'
  },
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
    faq_q1:'ما هو تزوير الشهادات؟',faq_a1:'انشاء شهادة X.509 مزيفة تنتحل هوية خادم شرعي لتجاوز سلسلة الثقة.',
    faq_q2:'ما هو هجوم البايت الفارغ؟',faq_a2:'حقن \\0 في حقل CN لخداع المحققين الذين يتوقفون عند البايت الفارغ.',
    faq_q3:'لماذا تصادمات MD5 مهمة؟',faq_a3:'تصادمات MD5 تسمح بتزوير شهادة CA مارقة بنفس التوقيع.',
    howto_1:'ادخل اسم السلطة الجذرية والنطاق المستهدف.',howto_2:'اختر نوع الهجوم.',howto_3:'انقر تزوير الشهادة.',howto_4:'انقر التحقق من السلسلة.',
    wiki_self:'ذاتي التوقيع: شهادة موقعة بمفتاحها الخاص، غير موثوقة من CA.',
    wiki_chain:'تجاوز السلسلة: عدم التحقق من الشهادة الوسيطة.',
    wiki_null:'بايت فارغ: CN=evil.com\\x00.target.com يخدع المحللين.',
    wiki_md5:'تصادم MD5: شهادتان مختلفتان بنفس هاش MD5.',
    mathExplain:'سلسلة شهادات X.509:\n1. السلطة الجذرية (ذاتية التوقيع، موثوقة من النظام)\n2. السلطة الوسيطة (موقعة من الجذرية)\n3. شهادة طرفية (موقعة من الوسيطة)\n\nالتحقق: المتصفح يتنقل من الشهادة الطرفية الى الجذرية'
  }
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
