/**
 * Quantum Key Cracker — Workshop DIY v1.0
 * Simulate Shor's algorithm for RSA factoring via quantum period-finding
 */
const $=id=>document.getElementById(id);
const LANG={
  en:{title:'Quantum Key Cracker',subtitle:"Simulate Shor's algorithm breaking RSA",mainSection:'Quantum Attack Simulator',mainDesc:'Watch qubits find period via QFT to factor N',modulusLabel:'RSA Modulus N',runShor:"Run Shor's Algorithm",stop:'Stop',results:'Results',vizTitle:'Quantum Circuit Visualization',vizHint:'Watch qubit states evolve through QFT',sectionA:'Algorithm Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',running:'Running quantum simulation...',factored:'N factored!',periodFound:'Period found!',
    faq_q1:"What is Shor's algorithm?",faq_a1:'A quantum algorithm that factors integers in polynomial time, breaking RSA. It uses quantum period-finding via QFT.',faq_q2:'Does this use real qubits?',faq_a2:'No, this is a classical simulation. Real quantum computers with enough qubits could factor large RSA moduli.',faq_q3:'When will RSA be broken?',faq_a3:'Estimates vary: 2030-2050 for sufficiently large quantum computers. Post-quantum cryptography is being developed.',
    howto_1:'Enter an RSA modulus N (product of two primes).',howto_2:"Click Run Shor's Algorithm.",howto_3:'Watch the quantum circuit visualization.',howto_4:'See the period found and factors extracted.',
    wiki_shor:"Shor's algorithm: 1) Pick random a<N, 2) Find period r of a^x mod N using QFT, 3) If r is even, compute gcd(a^(r/2)+-1, N).",wiki_qft:'Quantum Fourier Transform converts computational basis states to frequency domain, revealing the period of modular exponentiation.',wiki_postq:'Post-quantum cryptography: lattice-based (CRYSTALS-Kyber), hash-based (SPHINCS+), code-based schemes resist quantum attacks.',
    mathExplain:"Shor's Algorithm Steps:\n\n1. Choose random a, 1 < a < N\n2. If gcd(a, N) > 1, done (lucky factor)\n3. Quantum period-finding:\n   |0>|1> -> QFT -> measure period r\n   where f(x) = a^x mod N has period r\n4. If r is odd, retry\n5. Compute:\n   p = gcd(a^(r/2) - 1, N)\n   q = gcd(a^(r/2) + 1, N)\n\nComplexity: O((log N)^3) vs O(exp((log N)^(1/3))) classical"},
  fr:{title:'Casseur Quantique',subtitle:"Simulez l'algorithme de Shor cassant RSA",mainSection:'Simulateur Quantique',mainDesc:'Regardez les qubits trouver la periode via QFT',modulusLabel:'Module RSA N',runShor:'Lancer Shor',stop:'Arreter',results:'Resultats',vizTitle:'Circuit Quantique',vizHint:'Regardez les etats des qubits evoluer',sectionA:'Reference',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',running:'Simulation quantique...',factored:'N factorise!',periodFound:'Periode trouvee!',
    faq_q1:'Algorithme de Shor?',faq_a1:'Algorithme quantique qui factorise en temps polynomial, cassant RSA.',faq_q2:'Vrais qubits?',faq_a2:'Non, simulation classique.',faq_q3:'Quand RSA sera casse?',faq_a3:'Estimations: 2030-2050.',
    howto_1:'Entrez un module N.',howto_2:'Cliquez Lancer.',howto_3:'Regardez le circuit.',howto_4:'Voyez les facteurs.',
    wiki_shor:'Shor: choisir a, trouver la periode de a^x mod N par QFT, calculer gcd.',wiki_qft:'QFT transforme les etats de base en domaine frequentiel.',wiki_postq:'Cryptographie post-quantique: reseaux, hachage, codes correcteurs.',
    mathExplain:'Algorithme de Shor:\n1. Choisir a aleatoire\n2. Si pgcd(a,N)>1, facteur trouve\n3. Trouver la periode r par QFT\n4. Si r pair: p=pgcd(a^(r/2)-1,N)'},
  ar:{title:'كاسر المفاتيح الكمي',subtitle:'حاكي خوارزمية شور لكسر RSA',mainSection:'محاكي الهجوم الكمي',mainDesc:'شاهد الكيوبتات تجد الدورة عبر QFT',modulusLabel:'معامل RSA N',runShor:'تشغيل شور',stop:'إيقاف',results:'النتائج',vizTitle:'تصور الدائرة الكمية',vizHint:'شاهد حالات الكيوبت تتطور عبر QFT',sectionA:'مرجع',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',running:'جاري المحاكاة الكمية...',factored:'تم تحليل N!',periodFound:'تم إيجاد الدورة!',
    faq_q1:'ما هي خوارزمية شور؟',faq_a1:'خوارزمية كمية تحلل الأعداد في زمن متعدد الحدود.',faq_q2:'كيوبتات حقيقية؟',faq_a2:'لا، محاكاة كلاسيكية.',faq_q3:'متى سيُكسر RSA؟',faq_a3:'التقديرات: 2030-2050.',
    howto_1:'أدخل معامل N.',howto_2:'اضغط تشغيل.',howto_3:'شاهد الدائرة.',howto_4:'شاهد العوامل.',
    wiki_shor:'شور: اختر a، جد دورة a^x mod N بواسطة QFT، احسب القاسم المشترك.',wiki_qft:'QFT يحول حالات الأساس إلى المجال الترددي.',wiki_postq:'تشفير ما بعد الكم: شبكات، تجزئة، رموز تصحيح.',
    mathExplain:'خوارزمية شور:\n1. اختر a عشوائي\n2. إذا gcd(a,N)>1 فقد وجدت عاملا\n3. جد الدورة r بواسطة QFT\n4. إذا r زوجي: p=gcd(a^(r/2)-1,N)'}
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
