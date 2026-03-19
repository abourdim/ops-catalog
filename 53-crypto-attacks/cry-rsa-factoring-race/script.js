/**
 * RSA Factoring Race — Workshop DIY v1.0
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas Sim
 */
const $=id=>document.getElementById(id);

/* ═══════ i18n ═══════ */
const LANG={
  en:{
    title:'RSA Factoring Race',subtitle:'Race algorithms to factor RSA moduli N=p*q',
    mainSection:'Factoring Lab',mainDesc:'Enter semiprime N, race Trial Division vs Pollard Rho vs Fermat',
    modulusLabel:'RSA Modulus N',modulusHint:'Enter a semiprime or generate one',
    generate:'Generate',startRace:'Start Race',stop:'Stop',results:'Results',
    vizTitle:'Factoring Visualization',vizHint:'Watch algorithms race to find factors on canvas',
    sectionA:'Algorithm Reference',sectionB:'Math Deep Dive',
    settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    activityLog:'Activity Log',ready:'Ready',
    splashHint:'tap to skip',
    langChanged:'Language -> English',themeChanged:'Theme ->',
    trialDiv:'Trial Division',pollardRho:"Pollard's Rho",fermat:"Fermat's Method",
    found:'Factor found!',noFactor:'No factor found (prime?)',racing:'Racing...',
    faq_q1:'What is RSA factoring?',faq_a1:'RSA security relies on the difficulty of factoring large semiprimes N=p*q. This app races different algorithms.',
    faq_q2:'Is this real RSA?',faq_a2:'No. Small numbers for education. Real RSA uses 2048+ bit keys.',
    faq_q3:'Which algorithm wins?',faq_a3:'Pollard Rho is generally fastest for random semiprimes. Fermat excels when factors are close.',
    howto_1:'Enter N or generate a semiprime.',howto_2:'Click Start Race.',howto_3:'Watch the canvas visualization.',howto_4:'Compare timings in results.',
    wiki_trial:'Tests every integer 2..sqrt(N). O(sqrt(N)) complexity.',
    wiki_pollard:'Pseudo-random sequence + cycle detection. Expected O(N^1/4).',
    wiki_fermat:'Searches a,b where N=a^2-b^2=(a-b)(a+b). Best when factors are close.',
    mathExplain:'RSA Key Generation:\n1. Choose two primes p, q\n2. Compute N = p * q (modulus)\n3. Compute phi = (p-1)(q-1)\n4. Choose e coprime to phi\n5. Compute d = e^-1 mod phi\n\nSecurity depends on difficulty of factoring N back into p and q.'
  },
  fr:{
    title:'Course Factorisation RSA',subtitle:'Faites courir les algorithmes pour factoriser N=p*q',
    mainSection:'Labo Factorisation',mainDesc:'Entrez un semi-premier N, lancez Division, Pollard Rho, Fermat',
    modulusLabel:'Module RSA N',modulusHint:'Entrez un semi-premier ou generez-en un',
    generate:'Generer',startRace:'Lancer la Course',stop:'Arreter',results:'Resultats',
    vizTitle:'Visualisation Factorisation',vizHint:'Regardez les algorithmes chercher les facteurs',
    sectionA:'Reference Algorithmes',sectionB:'Maths Approfondies',
    settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    activityLog:'Journal',ready:'Pret',
    splashHint:'appuyer pour passer',
    langChanged:'Langue -> Francais',themeChanged:'Theme ->',
    trialDiv:'Division par Essai',pollardRho:'Rho de Pollard',fermat:'Methode de Fermat',
    found:'Facteur trouve!',noFactor:'Aucun facteur (premier?)',racing:'Course en cours...',
    faq_q1:'Qu\'est-ce que la factorisation RSA?',faq_a1:'La securite RSA repose sur la difficulte de factoriser de grands semi-premiers N=p*q.',
    faq_q2:'C\'est du vrai RSA?',faq_a2:'Non. Petits nombres pour l\'apprentissage.',
    faq_q3:'Quel algorithme gagne?',faq_a3:'Pollard Rho est generalement le plus rapide.',
    howto_1:'Entrez N ou generez un semi-premier.',howto_2:'Cliquez Lancer.',howto_3:'Regardez la visualisation.',howto_4:'Comparez les temps.',
    wiki_trial:'Teste chaque entier 2..sqrt(N). Complexite O(sqrt(N)).',
    wiki_pollard:'Sequence pseudo-aleatoire + detection de cycle. O(N^1/4) attendu.',
    wiki_fermat:'Cherche a,b ou N=a^2-b^2. Optimal quand les facteurs sont proches.',
    mathExplain:'Generation de cle RSA:\n1. Choisir deux premiers p, q\n2. Calculer N = p * q\n3. Calculer phi = (p-1)(q-1)\n4. Choisir e copremier a phi\n5. Calculer d = e^-1 mod phi'
  },
  ar:{
    title:'سباق تحليل RSA',subtitle:'سابق الخوارزميات لتحليل عوامل RSA حيث N=p*q',
    mainSection:'مختبر التحليل',mainDesc:'أدخل عدد شبه أولي N وسابق خوارزميات التحليل',
    modulusLabel:'معامل RSA N',modulusHint:'أدخل عددا شبه أولي أو ولّد واحدا',
    generate:'توليد',startRace:'بدء السباق',stop:'إيقاف',results:'النتائج',
    vizTitle:'تصور التحليل',vizHint:'شاهد الخوارزميات تتسابق لإيجاد العوامل',
    sectionA:'مرجع الخوارزميات',sectionB:'تعمق رياضي',
    settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',
    help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    activityLog:'سجل النشاط',ready:'جاهز',
    splashHint:'انقر للتخطي',
    langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',
    trialDiv:'القسمة التجريبية',pollardRho:'رو بولارد',fermat:'طريقة فيرما',
    found:'تم إيجاد العامل!',noFactor:'لا يوجد عامل (أولي؟)',racing:'جاري السباق...',
    faq_q1:'ما هو تحليل RSA؟',faq_a1:'أمان RSA يعتمد على صعوبة تحليل الأعداد شبه الأولية الكبيرة.',
    faq_q2:'هل هذا RSA حقيقي؟',faq_a2:'لا. أعداد صغيرة للتعليم.',
    faq_q3:'أي خوارزمية تفوز؟',faq_a3:'رو بولارد عادة الأسرع. فيرما الأفضل عندما العوامل متقاربة.',
    howto_1:'أدخل N أو ولّد عددا شبه أولي.',howto_2:'اضغط بدء السباق.',howto_3:'شاهد التصور البصري.',howto_4:'قارن الأوقات.',
    wiki_trial:'يختبر كل عدد من 2 إلى جذر N. تعقيد O(sqrt(N)).',
    wiki_pollard:'تسلسل شبه عشوائي + كشف الدورات. O(N^1/4) متوقع.',
    wiki_fermat:'يبحث عن a,b حيث N=a^2-b^2. الأفضل عندما العوامل متقاربة.',
    mathExplain:'توليد مفتاح RSA:\n1. اختر عددين أوليين p, q\n2. احسب N = p * q\n3. احسب phi = (p-1)(q-1)\n4. اختر e أولي نسبيا مع phi\n5. احسب d = e^-1 mod phi'
  }
};
let currentLang='en';

function setLanguage(lang){
  currentLang=lang;const s=LANG[lang];if(!s)return;
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  document.documentElement.lang=lang;
  const sel=$('langSelect');if(sel)sel.value=lang;
  try{localStorage.setItem('cry-rsa-lang',lang)}catch{}
  log(s.langChanged,'info');buildHelp();buildRef();buildMath();
}

/* ═══════ THEMES ═══════ */
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){
  document.documentElement.dataset.theme=name;
  document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));
  const sel=$('themeSelect');if(sel)sel.value=name;
  try{localStorage.setItem('cry-rsa-theme',name)}catch{}
  log(`${LANG[currentLang].themeChanged} ${name}`,'info');
}

/* ═══════ SOUND ═══════ */
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){
  if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();
  const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
  osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=.08;const t=audioCtx.currentTime;
  if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.08);osc.start(t);osc.stop(t+.08)}
  else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.3);osc.start(t);osc.stop(t+.3)}
  else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.25)}
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){
  if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;
  const d=document.createElement('div');d.className=`log-line ${type}`;
  d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;
  if(type==='success')playSound('success');else if(type==='error')playSound('error');
}

/* ═══════ TOAST ═══════ */
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}

/* ═══════ PANELS ═══════ */
function togglePanel(panel,overlay){
  panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'));
}

/* ═══════ FACTORING ALGORITHMS ═══════ */
function isPrime(n){if(n<2)return false;if(n<4)return true;if(n%2===0||n%3===0)return false;for(let i=5;i*i<=n;i+=6)if(n%i===0||n%(i+2)===0)return false;return true}
function randomPrime(min,max){let p;do{p=min+Math.floor(Math.random()*(max-min))}while(!isPrime(p));return p}

function trialDivision(n,stepCb){
  const start=performance.now();let steps=0;
  if(n%2===0){stepCb&&stepCb(2,steps);return{factor:2,steps:1,time:performance.now()-start}}
  for(let i=3;i*i<=n;i+=2){steps++;if(stepCb)stepCb(i,steps);if(n%i===0)return{factor:i,steps,time:performance.now()-start}}
  return{factor:null,steps,time:performance.now()-start}
}

function pollardRho(n,stepCb){
  const start=performance.now();let steps=0;
  if(n%2===0)return{factor:2,steps:1,time:performance.now()-start};
  let x=Math.floor(Math.random()*(n-2))+2,y=x,c=Math.floor(Math.random()*(n-1))+1,d=1;
  const f=v=>(Number(BigInt(v)*BigInt(v)+BigInt(c))%n+n)%n;
  function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a}
  while(d===1&&steps<1e6){x=f(x);y=f(f(y));d=gcd(Math.abs(x-y),n);steps++;if(stepCb)stepCb(x,steps)}
  if(d!==n&&d!==1)return{factor:d,steps,time:performance.now()-start};
  return{factor:null,steps,time:performance.now()-start}
}

function fermatFactor(n,stepCb){
  const start=performance.now();let steps=0;
  if(n%2===0)return{factor:2,steps:1,time:performance.now()-start};
  let a=Math.ceil(Math.sqrt(n));
  while(steps<1e6){const b2=a*a-n;const b=Math.round(Math.sqrt(b2));steps++;
    if(stepCb)stepCb(a,steps);
    if(b*b===b2&&a-b>1&&a+b<n)return{factor:a-b,steps,time:performance.now()-start};
    a++;
  }
  return{factor:null,steps,time:performance.now()-start}
}

/* ═══════ CANVAS SIMULATION ═══════ */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
let animFrame,raceData={trial:[],pollard:[],fermat:[]},raceRunning=false;

function resizeCanvas(){
  if(!canvas)return;const r=canvas.getBoundingClientRect();
  canvas.width=r.width*window.devicePixelRatio;canvas.height=r.height*window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio,window.devicePixelRatio);
}

function getCS(prop){return getComputedStyle(document.documentElement).getPropertyValue(prop).trim()}

function drawRace(){
  if(!ctx)return;
  const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),accent2=getCS('--accent2'),text=getCS('--text'),muted=getCS('--text-muted');

  ctx.clearRect(0,0,w,h);
  ctx.fillStyle='rgba(0,0,0,.05)';ctx.fillRect(0,0,w,h);

  // Title
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';
  ctx.fillText('RSA Factoring Race',10,22);
  const N=$('modulusInput')?parseInt($('modulusInput').value):1073;
  ctx.fillStyle=muted;ctx.font='11px Tajawal,sans-serif';
  ctx.fillText(`N = ${N}`,10,38);

  const lanes=[
    {name:LANG[currentLang].trialDiv,data:raceData.trial,color:'#f87171'},
    {name:LANG[currentLang].pollardRho,data:raceData.pollard,color:'#4ade80'},
    {name:LANG[currentLang].fermat,data:raceData.fermat,color:'#60a5fa'}
  ];

  const laneH=(h-60)/3,startY=50;

  lanes.forEach((lane,i)=>{
    const y=startY+i*laneH;
    // Lane background
    ctx.fillStyle=`${lane.color}11`;ctx.fillRect(5,y,w-10,laneH-5);
    ctx.strokeStyle=`${lane.color}44`;ctx.strokeRect(5,y,w-10,laneH-5);
    // Lane label
    ctx.fillStyle=lane.color;ctx.font='bold 12px Tajawal,sans-serif';
    ctx.fillText(lane.name,12,y+16);

    // Progress bar
    const maxSteps=Math.max(1,...lanes.map(l=>l.data.length));
    const progress=lane.data.length/maxSteps;
    ctx.fillStyle=`${lane.color}33`;ctx.fillRect(10,y+22,progress*(w-25),12);
    ctx.fillStyle=lane.color;ctx.fillRect(10,y+22,Math.min(progress*(w-25),progress*(w-25)),12);

    // Steps count
    ctx.fillStyle=text;ctx.font='10px SF Mono,monospace';
    ctx.fillText(`Steps: ${lane.data.length}`,12,y+50);

    // Draw number line of tested values
    if(lane.data.length>0){
      const last=lane.data[lane.data.length-1];
      ctx.fillStyle=muted;ctx.fillText(`Current: ${last.val}`,120,y+50);

      // Mini scatter plot of tested values
      const sqrtN=Math.sqrt(N);
      const plotY=y+58,plotH=laneH-70;
      if(plotH>10){
        ctx.strokeStyle=`${lane.color}22`;ctx.beginPath();ctx.moveTo(10,plotY+plotH);ctx.lineTo(w-10,plotY+plotH);ctx.stroke();
        const maxVals=Math.min(lane.data.length,200);
        const startIdx=Math.max(0,lane.data.length-maxVals);
        for(let j=startIdx;j<lane.data.length;j++){
          const v=lane.data[j].val;
          const px=10+((j-startIdx)/(maxVals))*(w-25);
          const py=plotY+plotH-(v/sqrtN)*plotH*.8;
          ctx.fillStyle=`${lane.color}88`;
          ctx.beginPath();ctx.arc(px,Math.max(plotY,Math.min(plotY+plotH,py)),2,0,Math.PI*2);ctx.fill();
        }
        // Mark found factor
        if(lane.data.length>0&&lane.data[lane.data.length-1].found){
          const fv=lane.data[lane.data.length-1].val;
          ctx.fillStyle=lane.color;ctx.font='bold 11px Tajawal';
          ctx.fillText(`p=${fv}, q=${N/fv}`,w/2,y+50);
          ctx.beginPath();ctx.arc(w-30,plotY+plotH/2,8,0,Math.PI*2);ctx.fillStyle=lane.color;ctx.fill();
          ctx.fillStyle='#fff';ctx.font='bold 10px sans-serif';ctx.fillText('!',w-33,plotY+plotH/2+4);
        }
      }
    }
  });

  if(raceRunning)animFrame=requestAnimationFrame(drawRace);
}

function startRace(){
  const N=parseInt($('modulusInput').value);
  if(!N||N<4){log('Enter N >= 4','error');return}
  raceData={trial:[],pollard:[],fermat:[]};
  raceRunning=true;
  const s=LANG[currentLang];
  log(s.racing,'info');showToast(s.racing);
  $('resultsBox').textContent='';

  resizeCanvas();drawRace();

  // Run algorithms asynchronously using setTimeout chunks
  let trialDone=false,pollardDone=false,fermatDone=false;
  let trialResult=null,pollardResult=null,fermatResult=null;

  // Trial Division
  const trialStart=performance.now();
  let ti=2,trialSteps=0;
  function trialStep(){
    if(!raceRunning)return;
    const batch=500;
    for(let b=0;b<batch&&ti*ti<=N;b++){
      trialSteps++;raceData.trial.push({val:ti,found:false});
      if(N%ti===0){raceData.trial[raceData.trial.length-1].found=true;trialResult={factor:ti,steps:trialSteps,time:performance.now()-trialStart};trialDone=true;checkAllDone();return}
      ti+=ti===2?1:2;
    }
    if(ti*ti>N){trialResult={factor:null,steps:trialSteps,time:performance.now()-trialStart};trialDone=true;checkAllDone();return}
    setTimeout(trialStep,0);
  }

  // Pollard Rho
  const pollardStart=performance.now();
  let px=Math.floor(Math.random()*(N-2))+2,py=px,pc=Math.floor(Math.random()*(N-1))+1,pd=1,pSteps=0;
  function gcd(a,b){a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b]}return a}
  function pf(v){return(Number(BigInt(v)*BigInt(v)+BigInt(pc))%N+N)%N}
  function pollardStep(){
    if(!raceRunning)return;
    const batch=500;
    for(let b=0;b<batch;b++){
      px=pf(px);py=pf(pf(py));pd=gcd(Math.abs(px-py),N);pSteps++;
      raceData.pollard.push({val:px,found:false});
      if(pd!==1&&pd!==N){raceData.pollard[raceData.pollard.length-1].found=true;pollardResult={factor:pd,steps:pSteps,time:performance.now()-pollardStart};pollardDone=true;checkAllDone();return}
      if(pd===N||pSteps>1e5){pollardResult={factor:null,steps:pSteps,time:performance.now()-pollardStart};pollardDone=true;checkAllDone();return}
    }
    setTimeout(pollardStep,0);
  }

  // Fermat
  const fermatStart=performance.now();
  let fa=Math.ceil(Math.sqrt(N)),fSteps=0;
  function fermatStep(){
    if(!raceRunning)return;
    const batch=500;
    for(let b=0;b<batch;b++){
      const b2=fa*fa-N;const fb=Math.round(Math.sqrt(b2));fSteps++;
      raceData.fermat.push({val:fa,found:false});
      if(fb*fb===b2&&fa-fb>1&&fa+fb<N){raceData.fermat[raceData.fermat.length-1].found=true;fermatResult={factor:fa-fb,steps:fSteps,time:performance.now()-fermatStart};fermatDone=true;checkAllDone();return}
      fa++;if(fSteps>1e5){fermatResult={factor:null,steps:fSteps,time:performance.now()-fermatStart};fermatDone=true;checkAllDone();return}
    }
    setTimeout(fermatStep,0);
  }

  function checkAllDone(){
    if(!trialDone||!pollardDone||!fermatDone)return;
    raceRunning=false;hideToast();drawRace();
    const s=LANG[currentLang];
    let out=`N = ${N}\n\n`;
    [{name:s.trialDiv,r:trialResult},{name:s.pollardRho,r:pollardResult},{name:s.fermat,r:fermatResult}].forEach(a=>{
      out+=`${a.name}:\n`;
      if(a.r.factor){out+=`  ${s.found} p=${a.r.factor}, q=${N/a.r.factor}\n`;out+=`  Steps: ${a.r.steps}, Time: ${a.r.time.toFixed(2)}ms\n\n`;log(`${a.name}: p=${a.r.factor} (${a.r.steps} steps, ${a.r.time.toFixed(1)}ms)`,'success')}
      else{out+=`  ${s.noFactor}\n  Steps: ${a.r.steps}, Time: ${a.r.time.toFixed(2)}ms\n\n`;log(`${a.name}: ${s.noFactor}`,'error')}
    });
    // Determine winner
    const results=[{name:s.trialDiv,r:trialResult},{name:s.pollardRho,r:pollardResult},{name:s.fermat,r:fermatResult}].filter(a=>a.r.factor);
    if(results.length){results.sort((a,b)=>a.r.time-b.r.time);out+=`Winner: ${results[0].name} (${results[0].r.time.toFixed(2)}ms)`}
    $('resultsBox').textContent=out;
  }

  setTimeout(trialStep,0);setTimeout(pollardStep,0);setTimeout(fermatStep,0);
}

function stopRace(){raceRunning=false;hideToast();if(animFrame)cancelAnimationFrame(animFrame);log('Race stopped','info')}

/* ═══════ BUILD DYNAMIC SECTIONS ═══════ */
function buildHelp(){
  const s=LANG[currentLang];
  $('helpFaq').innerHTML=[
    {q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}
  ].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');
  $('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');
  $('helpWiki').innerHTML=[
    {t:s.trialDiv,p:s.wiki_trial},{t:s.pollardRho,p:s.wiki_pollard},{t:s.fermat,p:s.wiki_fermat}
  ].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('');
}

function buildRef(){
  const s=LANG[currentLang];
  $('refCard').innerHTML=[
    {t:s.trialDiv,p:s.wiki_trial},{t:s.pollardRho,p:s.wiki_pollard},{t:s.fermat,p:s.wiki_fermat}
  ].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('');
}

function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);
  resizeCanvas();window.addEventListener('resize',resizeCanvas);

  // Restore prefs
  try{const l=localStorage.getItem('cry-rsa-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-rsa-theme');if(t)setTheme(t)}catch{}

  // Panels
  $('helpBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('helpCloseBtn').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('helpOverlay').onclick=()=>togglePanel($('helpPanel'),$('helpOverlay'));
  $('settingsBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('settingsCloseBtn').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('settingsOverlay').onclick=()=>togglePanel($('settingsPanel'),$('settingsOverlay'));
  $('logBtn').onclick=()=>togglePanel($('logPanel'));
  $('logCloseBtn').onclick=()=>togglePanel($('logPanel'));

  // Settings
  $('langSelect').onchange=e=>setLanguage(e.target.value);
  $('themeSelect').onchange=e=>setTheme(e.target.value);
  $('soundToggle').onchange=e=>{soundEnabled=e.target.checked;playSound('click')};

  // Log
  $('clearLogBtn').onclick=()=>{logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log('Log cleared')};
  $('copyLogBtn').onclick=async()=>{const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log('Copied!','success')}catch{log('Copy failed','error')}};

  // Log filters
  document.querySelectorAll('.log-filter').forEach(btn=>{
    btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
      const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=f==='all'||l.classList.contains(f)?'':'none'})}
  });

  // Help tabs
  document.querySelectorAll('.help-tab').forEach(tab=>{
    tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');
      document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));
      $(`help${tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1)}`).classList.add('active')}
  });

  // Race controls
  $('raceBtn').onclick=startRace;
  $('stopBtn').onclick=stopRace;
  $('genBtn').onclick=()=>{const p=randomPrime(50,500),q=randomPrime(50,500);$('modulusInput').value=p*q;log(`Generated N=${p*q} (${p} x ${q})`,'success')};

  buildHelp();buildRef();buildMath();
  log(LANG[currentLang].ready,'success');

  // Draw initial canvas
  drawRace();
});

/* ═══════ ENHANCED CRYPTO VISUALIZATION (IIFE) ═══════ */
(function(){
const _c2=document.createElement('canvas');
_c2.id='cryptoVizCanvas';
_c2.style.cssText='width:100%;height:340px;border-radius:12px;margin-top:12px;display:block;background:rgba(0,0,0,.12)';
const vizSect=document.querySelector('.visualization-section')||document.querySelector('.card');
if(vizSect)vizSect.appendChild(_c2);
const _x2=_c2.getContext('2d');
let _raf,_tick=0,_primes=[],_sieve=[],_keyBits=[];

function _resize(){const r=_c2.getBoundingClientRect();_c2.width=r.width*devicePixelRatio;_c2.height=r.height*devicePixelRatio;_x2.scale(devicePixelRatio,devicePixelRatio)}
window.addEventListener('resize',_resize);_resize();

// Generate small primes via Sieve of Eratosthenes for visualization
function genSieve(max){
  const s=new Uint8Array(max+1);
  for(let i=2;i*i<=max;i++)if(!s[i])for(let j=i*i;j<=max;j+=i)s[j]=1;
  _primes=[];_sieve=s;
  for(let i=2;i<=max;i++)if(!s[i])_primes.push(i);
}
genSieve(500);

// Generate RSA key space visualization data
function genKeySpace(){
  _keyBits=[];
  for(let i=0;i<64;i++){
    const b=[];
    for(let j=0;j<64;j++)b.push(Math.random());
    _keyBits.push(b);
  }
}
genKeySpace();

function _gc(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function drawEnhanced(){
  const w=_c2.getBoundingClientRect().width,h=_c2.getBoundingClientRect().height;
  const acc=_gc('--accent'),acc2=_gc('--accent2'),txt=_gc('--text'),mut=_gc('--text-muted');
  _x2.clearRect(0,0,w,h);
  _tick++;

  // === Section 1: Prime Sieve Visualization (top-left) ===
  _x2.fillStyle=acc;_x2.font='bold 12px Righteous,Tajawal,sans-serif';
  _x2.fillText('Prime Number Sieve (Eratosthenes)',10,18);
  const sieveW=w*0.48,sieveH=90,sieveX=10,sieveY=28;
  const cols=Math.ceil(Math.sqrt(500)),cellSz=Math.min(sieveW/cols,sieveH/Math.ceil(500/cols));
  for(let n=2;n<=Math.min(500,cols*Math.ceil(sieveH/cellSz));n++){
    const col=(n-2)%cols,row=Math.floor((n-2)/cols);
    const cx=sieveX+col*cellSz,cy=sieveY+row*cellSz;
    if(cy>sieveY+sieveH)break;
    const isPrime=!_sieve[n];
    const isActive=(n<=(_tick%500)+2);
    if(isPrime){
      _x2.fillStyle=isActive?`${acc}cc`:`${acc}44`;
      _x2.beginPath();_x2.arc(cx+cellSz/2,cy+cellSz/2,cellSz*0.35,0,Math.PI*2);_x2.fill();
    }else{
      _x2.fillStyle='rgba(255,255,255,.03)';
      _x2.fillRect(cx+1,cy+1,cellSz-2,cellSz-2);
    }
  }
  _x2.fillStyle=mut;_x2.font='9px Tajawal';
  _x2.fillText(`Primes found: ${_primes.length} in [2..500]`,sieveX,sieveY+sieveH+12);

  // === Section 2: RSA Key Space Heatmap (top-right) ===
  const ksX=w*0.52,ksY=10;
  _x2.fillStyle=acc2||acc;_x2.font='bold 12px Righteous,Tajawal,sans-serif';
  _x2.fillText('RSA Key Space Exploration',ksX,18);
  const ksW=w*0.46,ksH=90;
  const kCellW=ksW/64,kCellH=ksH/64;
  for(let i=0;i<64;i++){
    for(let j=0;j<64;j++){
      const val=_keyBits[i][j];
      const dist=Math.sqrt((i-32)**2+(j-32)**2)/45;
      const wave=Math.sin(_tick*0.03+i*0.1+j*0.1)*0.3+0.5;
      const heat=val*wave*(1-dist*0.5);
      const r=Math.floor(heat*180+40),g=Math.floor(heat*80+20),b=Math.floor((1-heat)*120+60);
      _x2.fillStyle=`rgb(${r},${g},${b})`;
      _x2.fillRect(ksX+j*kCellW,ksY+18+i*kCellH,kCellW,kCellH);
    }
  }
  // Scanning line
  const scanY=ksY+18+(_tick%64)*kCellH;
  _x2.fillStyle='rgba(255,255,255,.15)';
  _x2.fillRect(ksX,scanY,ksW,kCellH*2);
  _x2.fillStyle=mut;_x2.font='9px Tajawal';
  _x2.fillText('2048-bit key space (each pixel = 2^20 keys)',ksX,ksY+ksH+30);

  // === Section 3: Factoring Complexity Curves (bottom-left) ===
  const crvX=10,crvY=sieveY+sieveH+26,crvW=w*0.48,crvH=h-crvY-30;
  _x2.fillStyle=acc;_x2.font='bold 11px Righteous,Tajawal,sans-serif';
  _x2.fillText('Factoring Complexity: bits vs operations',crvX,crvY);
  // Axes
  _x2.strokeStyle=mut+'44';_x2.lineWidth=1;
  _x2.beginPath();_x2.moveTo(crvX+30,crvY+10);_x2.lineTo(crvX+30,crvY+crvH);_x2.lineTo(crvX+crvW,crvY+crvH);_x2.stroke();
  _x2.fillStyle=mut;_x2.font='8px SF Mono,monospace';
  _x2.fillText('bits',crvX+crvW/2,crvY+crvH+12);

  const algos=[
    {name:'Trial Div O(2^(n/2))',color:'#f87171',fn:x=>Math.pow(2,x/2)},
    {name:'Pollard Rho O(2^(n/4))',color:'#4ade80',fn:x=>Math.pow(2,x/4)},
    {name:'GNFS O(e^(n^(1/3)))',color:'#60a5fa',fn:x=>Math.exp(1.923*Math.pow(x*Math.log(2),1/3)*Math.pow(Math.log(x*Math.log(2)),2/3))},
    {name:"Shor's O(n^3)",color:'#c084fc',fn:x=>Math.pow(x,3)}
  ];

  const maxBits=120,maxOps=Math.pow(2,60);
  algos.forEach((algo,ai)=>{
    _x2.strokeStyle=algo.color;_x2.lineWidth=1.5;_x2.beginPath();
    let started=false;
    for(let b=4;b<=maxBits;b++){
      const ops=algo.fn(b);
      const px=crvX+30+(b/maxBits)*(crvW-35);
      const logOps=Math.log2(Math.max(1,ops));
      const py=crvY+crvH-(logOps/60)*crvH+10;
      if(py<crvY+10)break;
      if(!started){_x2.moveTo(px,py);started=true}else _x2.lineTo(px,py);
    }
    _x2.stroke();
    // Label with animated pulse at current tick position
    const labelY=crvY+18+ai*11;
    _x2.fillStyle=algo.color;_x2.font='8px SF Mono';
    _x2.fillText(algo.name,crvX+35,labelY);
  });

  // Animated cursor showing "current factoring progress"
  const curBit=32+Math.sin(_tick*0.02)*28;
  const curX=crvX+30+(curBit/maxBits)*(crvW-35);
  _x2.strokeStyle='rgba(255,255,255,.4)';_x2.setLineDash([3,3]);
  _x2.beginPath();_x2.moveTo(curX,crvY+10);_x2.lineTo(curX,crvY+crvH);_x2.stroke();
  _x2.setLineDash([]);
  _x2.fillStyle='#fff';_x2.font='8px SF Mono';
  _x2.fillText(`${Math.round(curBit)} bits`,curX-12,crvY+crvH+12);

  // === Section 4: Modular Arithmetic Animation (bottom-right) ===
  const modX=w*0.52,modY=crvY,modW=w*0.46,modH=crvH;
  _x2.fillStyle=acc2||acc;_x2.font='bold 11px Righteous,Tajawal,sans-serif';
  _x2.fillText('Modular Exponentiation: a^x mod N',modX,modY);

  const N=97,a=3;
  const orbLen=Math.min(N,96);
  const orbCX=modX+modW/2,orbCY=modY+modH/2+5;
  const orbR=Math.min(modW,modH)*0.35;

  // Draw orbit circle
  _x2.strokeStyle=mut+'22';_x2.lineWidth=1;
  _x2.beginPath();_x2.arc(orbCX,orbCY,orbR,0,Math.PI*2);_x2.stroke();

  // Plot a^x mod N values around the circle
  let val=1;
  for(let x=0;x<orbLen;x++){
    const angle=(x/orbLen)*Math.PI*2-Math.PI/2;
    const px=orbCX+Math.cos(angle)*orbR;
    const py=orbCY+Math.sin(angle)*orbR;
    const isActive=x<=(_tick%orbLen);
    const sz=isActive?3.5:2;
    _x2.fillStyle=isActive?`hsl(${(val/N)*360},70%,60%)`:`${acc}22`;
    _x2.beginPath();_x2.arc(px,py,sz,0,Math.PI*2);_x2.fill();

    // Connect sequential values with lines
    if(x>0&&isActive){
      const prevAngle=((x-1)/orbLen)*Math.PI*2-Math.PI/2;
      const ppx=orbCX+Math.cos(prevAngle)*orbR;
      const ppy=orbCY+Math.sin(prevAngle)*orbR;
      _x2.strokeStyle=`hsla(${(val/N)*360},70%,60%,.2)`;_x2.lineWidth=0.8;
      _x2.beginPath();_x2.moveTo(ppx,ppy);_x2.lineTo(px,py);_x2.stroke();
    }
    val=(val*a)%N;
  }

  // Center text
  _x2.fillStyle=txt;_x2.font='bold 10px SF Mono';_x2.textAlign='center';
  _x2.fillText(`${a}^x mod ${N}`,orbCX,orbCY-6);
  _x2.fillStyle=mut;_x2.font='9px Tajawal';
  _x2.fillText(`x = ${_tick%orbLen}`,orbCX,orbCY+8);
  _x2.fillText(`val = ${(() => {let v=1;for(let i=0;i<_tick%orbLen;i++)v=(v*a)%N;return v})()}`,orbCX,orbCY+20);
  _x2.textAlign='left';

  // Phi function visualization (small)
  const phiY=modY+modH-20;
  _x2.fillStyle=mut;_x2.font='9px SF Mono';
  _x2.fillText(`phi(${N})=${(() => {let c=0;for(let i=1;i<N;i++){let g=N,b=i;while(b){[g,b]=[b,g%b]}if(g===1)c++}return c})()}  |  Period detection via GCD`,modX,phiY);

  _raf=requestAnimationFrame(drawEnhanced);
}
drawEnhanced();
})();
