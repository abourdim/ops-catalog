/**
 * Elliptic Curve Attack — Workshop DIY v1.0
 * Solve ECDLP on small curves using Baby-Step Giant-Step
 */
const $=id=>document.getElementById(id);
const LANG={en:{title:'Elliptic Curve Attack',subtitle:'Solve the discrete log on weak elliptic curves',mainSection:'EC Discrete Log',mainDesc:'Visualize point addition and BSGS on curves',results:'Results',vizTitle:'Elliptic Curve Visualization',vizHint:'See point addition and scalar multiplication',sectionA:'Curve Reference',sectionB:'Math Deep Dive',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',langChanged:'Language -> English',themeChanged:'Theme ->',solving:'Solving ECDLP...',solved:'Discrete log found!',faq_q1:'What is ECDLP?',faq_a1:'Elliptic Curve Discrete Log Problem: given P and Q=kP, find k. This is hard for large curves but feasible for small ones.',faq_q2:'What is BSGS?',faq_a2:'Baby-Step Giant-Step: a meet-in-the-middle algorithm that solves DLP in O(sqrt(n)) time and space.',faq_q3:'How is ECC used?',faq_a3:'ECDSA for signatures, ECDH for key exchange. Based on the difficulty of ECDLP on large curves (256+ bits).',howto_1:'Set curve parameters (a, b, p).',howto_2:'Set base point G and target Q.',howto_3:'Click Solve to find k where Q=kG.',howto_4:'Watch BSGS algorithm on canvas.',wiki_ec:'Elliptic curve: y^2 = x^3 + ax + b (mod p). Points form a group under addition.',wiki_add:'Point addition: geometric chord-and-tangent rule translated to modular arithmetic.',wiki_bsgs:'BSGS: compute baby steps {jG : j=0..m}, giant steps {Q-imG : i=0..m} where m=ceil(sqrt(n)). Find match.',mathExplain:'Elliptic Curve y^2 = x^3 + ax + b (mod p)\n\nPoint Addition:\nP + Q: lambda = (yQ-yP)/(xQ-xP) mod p\nxR = lambda^2 - xP - xQ mod p\nyR = lambda(xP-xR) - yP mod p\n\nPoint Doubling:\n2P: lambda = (3xP^2+a)/(2yP) mod p\n\nBSGS to solve Q = kG:\nm = ceil(sqrt(n))\nBaby: {jG : j=0..m}\nGiant: {Q-imG : i=0..m}\nMatch: k = im + j'},
fr:{title:'Attaque Courbe Elliptique',subtitle:'Resolvez le log discret sur courbes faibles',mainSection:'Log Discret EC',mainDesc:'Visualisez l\'addition de points et BSGS',results:'Resultats',vizTitle:'Visualisation Courbe',vizHint:'Addition de points et multiplication scalaire',sectionA:'Reference',sectionB:'Maths',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Sons',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',langChanged:'Langue -> Francais',themeChanged:'Theme ->',solving:'Resolution ECDLP...',solved:'Log discret trouve!',faq_q1:'ECDLP?',faq_a1:'Trouver k tel que Q=kP. Difficile pour les grandes courbes.',faq_q2:'BSGS?',faq_a2:'Baby-Step Giant-Step: algorithme en O(sqrt(n)).',faq_q3:'Utilisation ECC?',faq_a3:'ECDSA pour signatures, ECDH pour echange de cles.',howto_1:'Definir les parametres.',howto_2:'Definir G et Q.',howto_3:'Cliquer Resoudre.',howto_4:'Regarder BSGS.',wiki_ec:'Courbe elliptique: y^2 = x^3 + ax + b (mod p).',wiki_add:'Addition de points: regle de la corde et tangente.',wiki_bsgs:'BSGS: baby steps {jG}, giant steps {Q-imG}.',mathExplain:'y^2 = x^3 + ax + b (mod p)\n\nBSGS: m = ceil(sqrt(n))'},
ar:{title:'هجوم المنحنى الإهليلجي',subtitle:'حل مسألة اللوغاريتم المتقطع على منحنيات ضعيفة',mainSection:'لوغاريتم متقطع EC',mainDesc:'تصور جمع النقاط و BSGS',results:'النتائج',vizTitle:'تصور المنحنى',vizHint:'جمع النقاط والضرب العددي',sectionA:'مرجع',sectionB:'تعمق رياضي',settings:'الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات',help:'مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',activityLog:'سجل',ready:'جاهز',splashHint:'انقر للتخطي',langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',solving:'جاري حل ECDLP...',solved:'تم إيجاد اللوغاريتم!',faq_q1:'ما هو ECDLP؟',faq_a1:'إيجاد k حيث Q=kP. صعب للمنحنيات الكبيرة.',faq_q2:'ما هو BSGS؟',faq_a2:'خطوة صغيرة-خطوة كبيرة: خوارزمية O(sqrt(n)).',faq_q3:'استخدام ECC؟',faq_a3:'ECDSA للتوقيعات، ECDH لتبادل المفاتيح.',howto_1:'عيّن المعاملات.',howto_2:'عيّن G و Q.',howto_3:'اضغط حل.',howto_4:'شاهد BSGS.',wiki_ec:'منحنى إهليلجي: y^2 = x^3 + ax + b (mod p).',wiki_add:'جمع النقاط: قاعدة الوتر والمماس.',wiki_bsgs:'BSGS: خطوات صغيرة {jG}، خطوات كبيرة {Q-imG}.',mathExplain:'y^2 = x^3 + ax + b (mod p)\n\nBSGS: m = ceil(sqrt(n))'}};
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
