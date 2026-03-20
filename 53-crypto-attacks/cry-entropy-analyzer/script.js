/**
 * Entropy Analyzer — Workshop DIY v1.0
 * Randomness Quality Tester (Chi-Square, Monte Carlo, Shannon Entropy)
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas
 */
const $=id=>document.getElementById(id);

const LANG={
  en:{
    title:'Entropy Analyzer',subtitle:'Test randomness quality with chi-square, Monte Carlo, entropy tests',
    mainSection:'Randomness Tester',mainDesc:'Analyze byte sequences for randomness using multiple statistical tests',
    sourceLabel:'Data Source',sourceHint:'Choose a random source or enter custom data',
    sizeLabel:'Sample Size (bytes)',customLabel:'Custom Hex Data',
    analyze:'Analyze',compareAll:'Compare All Sources',reset:'Reset',results:'Results',
    vizTitle:'Entropy Visualization',vizHint:'Byte distribution, Monte Carlo plot, and entropy metrics',
    sectionA:'Test Reference',sectionB:'Entropy Deep Dive',
    settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',
    langChanged:'Language -> English',themeChanged:'Theme ->',
    analyzing:'Analyzing entropy...',complete:'Analysis complete',resetDone:'Reset complete',
    faq_q1:'What is entropy in cryptography?',faq_a1:'Shannon entropy measures information content in bits per byte. Ideal random data has 8.0 bits/byte. Low entropy means predictable patterns that attackers can exploit.',
    faq_q2:'What is chi-square test?',faq_a2:'Compares observed byte frequencies to expected uniform distribution. Value near 256 (degrees of freedom) indicates randomness. Too high or too low suggests non-randomness.',
    faq_q3:'What is Monte Carlo Pi test?',faq_a3:'Treats consecutive byte pairs as (x,y) coordinates in a square. The ratio of points inside the inscribed circle should approximate Pi/4. Deviation indicates non-randomness.',
    faq_q4:'Is my data private?', faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere. Your experiments stay on your device.',
    howto_1:'Choose a data source (CSPRNG, PRNG, weak, or custom).',howto_2:'Set sample size and click Analyze.',howto_3:'Click Compare All to test all sources side by side.',howto_4:'Examine the byte histogram and Monte Carlo scatter.',
    wiki_shannon:'Shannon Entropy: H = -sum(p(x) * log2(p(x))) for each byte value. Range: 0 (constant) to 8.0 (perfect random).',
    wiki_chi:'Chi-Square: X^2 = sum((observed-expected)^2/expected). For 256 byte values, df=255. Accept if 200 < X^2 < 330.',
    wiki_monte:'Monte Carlo Pi: Use byte pairs as coordinates. Pi estimate = 4 * (inside circle / total). Should be near 3.14159.',
    wiki_serial:'Serial Correlation: Measures dependency between consecutive bytes. Near 0 = independent (good). Near +/-1 = correlated (bad).',
    mathExplain:'Entropy Tests:\n\n1. Shannon Entropy:\n   H = -sum(p_i * log2(p_i)) for i=0..255\n   Perfect random: H = 8.0 bits/byte\n\n2. Chi-Square Test:\n   X^2 = sum((O_i - E)^2 / E)\n   E = N/256 (expected count per byte)\n   df = 255, accept if p-value > 0.01\n\n3. Monte Carlo Pi Estimation:\n   Take pairs (x,y) as points in [0,255]^2\n   Circle: x^2 + y^2 <= 127.5^2\n   Pi ~ 4 * (inside/total)\n\n4. Serial Correlation:\n   r = (sum(x_i * x_{i+1}) - mean^2*N) / (sum(x_i^2) - mean^2*N)\n   Ideal: r = 0 (no correlation)'
  ,step1Title:'Choose Algorithm',step1Desc:'Select the cryptographic algorithm and key parameters to analyze.',step2Title:'Set Up Attack',step2Desc:'Configure the attack parameters: known plaintext, side-channel data, or timing.',step3Title:'Execute Attack',step3Desc:'Run the cryptographic attack and attempt to recover the secret key.',step4Title:'Analyze Results',step4Desc:'Evaluate attack success rate and understand the vulnerability exploited.',sectionCode:'Device Code'},
  fr:{
    title:'Analyseur d\'Entropie',subtitle:'Testez la qualite de l\'aleatoire avec chi-carre, Monte Carlo, entropie',
    mainSection:'Testeur d\'Aleatoire',mainDesc:'Analysez des sequences d\'octets avec plusieurs tests statistiques',
    sourceLabel:'Source de Donnees',sourceHint:'Choisissez une source aleatoire ou entrez des donnees',
    sizeLabel:'Taille d\'Echantillon (octets)',customLabel:'Donnees Hex Personnalisees',
    analyze:'Analyser',compareAll:'Comparer Toutes les Sources',reset:'Reinitialiser',results:'Resultats',
    vizTitle:'Visualisation d\'Entropie',vizHint:'Distribution des octets, graphique Monte Carlo et metriques',
    sectionA:'Reference des Tests',sectionB:'Entropie en Profondeur',
    settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',
    langChanged:'Langue -> Francais',themeChanged:'Theme ->',
    analyzing:'Analyse en cours...',complete:'Analyse terminee',resetDone:'Reinitialisation complete',
    faq_q1:'Qu\'est-ce que l\'entropie en cryptographie?',faq_a1:'L\'entropie de Shannon mesure le contenu informatif en bits par octet. 8.0 = aleatoire parfait.',
    faq_q2:'Qu\'est-ce que le test chi-carre?',faq_a2:'Compare les frequences observees a la distribution uniforme attendue.',
    faq_q3:'Qu\'est-ce que le test Monte Carlo Pi?',faq_a3:'Utilise des paires d\',
    faq_q4:'Mes données sont-elles privées ?', faq_a4:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée nulle part.'octets comme coordonnees pour estimer Pi.',
    howto_1:'Choisissez une source de donnees.',howto_2:'Definissez la taille et cliquez Analyser.',howto_3:'Comparez toutes les sources.',howto_4:'Examinez l\'histogramme et le scatter.',
    wiki_shannon:'Entropie de Shannon: H = -sum(p(x) * log2(p(x))). Plage: 0 a 8.0.',
    wiki_chi:'Chi-Carre: X^2 = sum((observe-attendu)^2/attendu). Accepter si 200 < X^2 < 330.',
    wiki_monte:'Monte Carlo Pi: Paires comme coordonnees. Pi ~ 4 * (dans cercle / total).',
    wiki_serial:'Correlation Serie: Dependance entre octets consecutifs. Pres de 0 = bon.',
    mathExplain:'Tests d\'Entropie:\n\n1. Entropie de Shannon: H = -sum(p_i * log2(p_i))\n2. Test Chi-Carre: X^2 = sum((O_i-E)^2/E)\n3. Monte Carlo Pi: Pi ~ 4 * (dans cercle/total)\n4. Correlation Serie: r pres de 0 = pas de correlation'
  ,step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.',sectionCode:'Code Appareil'},
  ar:{
    title:'محلل الانتروبيا',subtitle:'اختبر جودة العشوائية بمربع كاي ومونتي كارلو والانتروبيا',
    mainSection:'اختبار العشوائية',mainDesc:'حلل تسلسلات البايت للعشوائية باستخدام اختبارات احصائية متعددة',
    sourceLabel:'مصدر البيانات',sourceHint:'اختر مصدر عشوائي او ادخل بيانات مخصصة',
    sizeLabel:'حجم العينة (بايت)',customLabel:'بيانات سداسية مخصصة',
    analyze:'تحليل',compareAll:'مقارنة جميع المصادر',reset:'اعادة تعيين',results:'النتائج',
    vizTitle:'تصور الانتروبيا',vizHint:'توزيع البايت ورسم مونتي كارلو ومقاييس الانتروبيا',
    sectionA:'مرجع الاختبارات',sectionB:'تعمق في الانتروبيا',
    settings:'الاعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',
    help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',
    langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',
    analyzing:'جاري التحليل...',complete:'اكتمل التحليل',resetDone:'تمت اعادة التعيين',
    faq_q1:'ما هي الانتروبيا في التشفير؟',faq_a1:'انتروبيا شانون تقيس المحتوى المعلوماتي بالبت لكل بايت. 8.0 = عشوائي مثالي.',
    faq_q2:'ما هو اختبار مربع كاي؟',faq_a2:'يقارن الترددات الملاحظة بالتوزيع المنتظم المتوقع.',
    faq_q3:'ما هو اختبار مونتي كارلو باي؟',faq_a3:'يستخدم ازواج البايت كاحداثيات لتقدير باي.',
    faq_q4:'هل بياناتي خاصة؟', faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك. لا يتم إرسال أي بيانات إلى أي مكان.',
    howto_1:'اختر مصدر بيانات.',howto_2:'حدد الحجم وانقر تحليل.',howto_3:'قارن جميع المصادر.',howto_4:'افحص المدرج التكراري والمبعثر.',
    wiki_shannon:'انتروبيا شانون: H = -sum(p(x) * log2(p(x))). المدى: 0 الى 8.0.',
    wiki_chi:'مربع كاي: X^2 = sum((ملاحظ-متوقع)^2/متوقع).',
    wiki_monte:'مونتي كارلو باي: ازواج كاحداثيات. باي ~ 4 * (داخل الدائرة / الكل).',
    wiki_serial:'الارتباط التسلسلي: التبعية بين بايتات متتالية. قرب 0 = جيد.',
    mathExplain:'اختبارات الانتروبيا:\n\n1. انتروبيا شانون: H = -sum(p_i * log2(p_i))\n2. مربع كاي: X^2 = sum((O_i-E)^2/E)\n3. مونتي كارلو: باي ~ 4 * (داخل الدائرة/الكل)\n4. الارتباط التسلسلي: r قرب 0 = بدون ارتباط'
  ,step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.',sectionCode:'كود الجهاز'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('cry-entropy-lang',lang)}catch{};log(s.langChanged,'info');buildHelp();buildRef();buildMath()}
const LIGHT_THEMES=['riad','medina'];
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('cry-entropy-theme',name)}catch{};log(`${LANG[currentLang].themeChanged} ${name}`,'info')}
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.08);osc.start(t);osc.stop(t+.08)}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.3);osc.start(t);osc.stop(t+.3)}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.25)}}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function togglePanel(panel,overlay){panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'))}

/* ======= DATA GENERATORS ======= */
function generateData(source,size){
  const data=new Uint8Array(size);
  switch(source){
    case'crypto':
      crypto.getRandomValues(data);break;
    case'math':
      for(let i=0;i<size;i++)data[i]=Math.floor(Math.random()*256);break;
    case'linear':{
      let seed=Date.now()&0xFFFFFFFF;
      for(let i=0;i<size;i++){seed=(seed*1103515245+12345)&0x7FFFFFFF;data[i]=(seed>>16)&0xFF}
      break;
    }
    case'counter':
      for(let i=0;i<size;i++)data[i]=i&0xFF;break;
    case'custom':{
      const hex=$('customInput').value.replace(/[^0-9a-fA-F]/g,'');
      for(let i=0;i<Math.min(size,hex.length/2);i++)data[i]=parseInt(hex.substr(i*2,2),16);
      break;
    }
  }
  return data;
}

/* ======= STATISTICAL TESTS ======= */
function shannonEntropy(data){
  const freq=new Float64Array(256);
  for(let i=0;i<data.length;i++)freq[data[i]]++;
  let H=0;
  for(let i=0;i<256;i++){
    if(freq[i]>0){const p=freq[i]/data.length;H-=p*Math.log2(p)}
  }
  return H;
}

function chiSquare(data){
  const freq=new Float64Array(256);
  for(let i=0;i<data.length;i++)freq[data[i]]++;
  const expected=data.length/256;
  let chi2=0;
  for(let i=0;i<256;i++)chi2+=(freq[i]-expected)**2/expected;
  // Approximate p-value using normal approximation
  const df=255,z=(chi2-df)/Math.sqrt(2*df);
  const pValue=1-0.5*(1+Math.sign(z)*(1-Math.exp(-2*z*z/Math.PI)));
  return{chi2,df,pValue:Math.max(0,Math.min(1,pValue)),freq};
}

function monteCarloPi(data){
  let inside=0,total=0;
  const points=[];
  const r=127.5;
  for(let i=0;i<data.length-1;i+=2){
    const x=data[i],y=data[i+1];
    const dx=x-r,dy=y-r;
    if(dx*dx+dy*dy<=r*r)inside++;
    total++;
    if(points.length<2000)points.push({x,y,inside:dx*dx+dy*dy<=r*r});
  }
  const piEst=4*inside/total;
  const error=Math.abs(piEst-Math.PI);
  return{piEst,error,errorPct:(error/Math.PI*100),inside,total,points};
}

function serialCorrelation(data){
  if(data.length<2)return 0;
  let sum=0,sumSq=0,sumProd=0;
  for(let i=0;i<data.length;i++){sum+=data[i];sumSq+=data[i]*data[i]}
  for(let i=0;i<data.length-1;i++)sumProd+=data[i]*data[i+1];
  const mean=sum/data.length;
  const denom=sumSq-mean*mean*data.length;
  if(denom===0)return 1;
  return(sumProd-mean*mean*(data.length-1))/denom;
}

let state={data:null,results:null,comparisons:[],phase:'idle'};

function analyzeData(){
  const source=$('sourceSelect').value;
  const size=Math.min(65536,Math.max(64,parseInt($('sizeInput').value)||1024));
  const s=LANG[currentLang];
  showToast(s.analyzing);

  const data=generateData(source,size);
  const entropy=shannonEntropy(data);
  const chi=chiSquare(data);
  const mc=monteCarloPi(data);
  const sc=serialCorrelation(data);

  state.data=data;
  state.results={source,size,entropy,chi,mc,sc};
  state.phase='analyzed';
  hideToast();

  const grade=entropy>7.9?'Excellent':entropy>7.5?'Good':entropy>6.0?'Fair':'Poor';
  log(`${s.complete}: ${source} entropy=${entropy.toFixed(4)} bits/byte (${grade})`,'success');

  let out=`=== Entropy Analysis: ${source} ===\n`;
  out+=`Sample size: ${size} bytes\n\n`;
  out+=`Shannon Entropy: ${entropy.toFixed(4)} bits/byte (max 8.0)\n`;
  out+=`Quality: ${grade}\n\n`;
  out+=`Chi-Square: ${chi.chi2.toFixed(2)} (df=${chi.df})\n`;
  out+=`  Expected range: ~200-330 for random data\n`;
  out+=`  Verdict: ${chi.chi2>200&&chi.chi2<330?'PASS':'FAIL'}\n\n`;
  out+=`Monte Carlo Pi: ${mc.piEst.toFixed(6)} (true: 3.141593)\n`;
  out+=`  Error: ${mc.errorPct.toFixed(3)}%\n`;
  out+=`  Verdict: ${mc.errorPct<5?'PASS':'FAIL'}\n\n`;
  out+=`Serial Correlation: ${sc.toFixed(6)}\n`;
  out+=`  Verdict: ${Math.abs(sc)<0.05?'PASS (no correlation)':'FAIL (correlated)'}\n`;
  $('resultsBox').textContent=out;
  drawCanvas();
}

function compareAll(){
  const size=Math.min(65536,Math.max(64,parseInt($('sizeInput').value)||1024));
  const sources=['crypto','math','linear','counter'];
  state.comparisons=sources.map(src=>{
    const data=generateData(src,size);
    return{source:src,entropy:shannonEntropy(data),chi:chiSquare(data).chi2,pi:monteCarloPi(data).piEst,sc:serialCorrelation(data),data};
  });
  state.phase='compared';
  const s=LANG[currentLang];
  log(`${s.complete}: compared ${sources.length} sources`,'success');

  let out=`=== Source Comparison (${size} bytes) ===\n\n`;
  out+=`${'Source'.padEnd(20)} ${'Entropy'.padEnd(10)} ${'Chi-Sq'.padEnd(10)} ${'Pi Est'.padEnd(10)} ${'SerCorr'.padEnd(10)}\n`;
  out+='-'.repeat(60)+'\n';
  state.comparisons.forEach(c=>{
    out+=`${c.source.padEnd(20)} ${c.entropy.toFixed(4).padEnd(10)} ${c.chi.toFixed(1).padEnd(10)} ${c.pi.toFixed(4).padEnd(10)} ${c.sc.toFixed(5).padEnd(10)}\n`;
  });
  $('resultsBox').textContent=out;
  drawCanvas();
}

function resetAll(){state={data:null,results:null,comparisons:[],phase:'idle'};$('resultsBox').textContent='';log(LANG[currentLang].resetDone,'info');drawCanvas()}

/* ======= CANVAS ======= */
const canvas=$('simCanvas'),ctx=canvas?canvas.getContext('2d'):null;
function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=r.height*devicePixelRatio;ctx.scale(devicePixelRatio,devicePixelRatio)}
function getCS(p){return getComputedStyle(document.documentElement).getPropertyValue(p).trim()}

function drawCanvas(){
  if(!ctx)return;
  const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;
  const accent=getCS('--accent'),muted=getCS('--text-muted');
  ctx.clearRect(0,0,w,h);
  ctx.fillStyle=accent;ctx.font='bold 14px Righteous,Tajawal,sans-serif';
  ctx.fillText('Entropy Analysis',10,22);

  if(state.phase==='idle'){
    ctx.fillStyle=muted;ctx.font='13px Tajawal';ctx.textAlign='center';
    ctx.fillText('Click "Analyze" to begin',w/2,h/2);ctx.textAlign='left';return;
  }

  if(state.phase==='analyzed'&&state.results){
    const r=state.results;
    ctx.fillStyle=muted;ctx.font='11px Tajawal';
    ctx.fillText(`Source: ${r.source} | ${r.size} bytes | Entropy: ${r.entropy.toFixed(4)} bits/byte`,10,38);

    // Byte frequency histogram (top half)
    const histY=50,histH=120,histW=w-20;
    ctx.fillStyle=accent;ctx.font='bold 10px Tajawal';ctx.fillText('Byte Frequency Distribution',10,histY-2);

    const freq=r.chi.freq;
    const maxF=Math.max(...freq,1);
    const barW=histW/256;
    const expected=r.size/256;

    for(let i=0;i<256;i++){
      const bh=(freq[i]/maxF)*histH;
      const deviation=Math.abs(freq[i]-expected)/expected;
      const color=deviation<0.3?'#4ade80':deviation<0.6?'#fbbf24':'#f87171';
      ctx.fillStyle=color+'66';ctx.fillRect(10+i*barW,histY+histH-bh,barW,bh);
    }
    // Expected line
    const ey=histY+histH-(expected/maxF)*histH;
    ctx.strokeStyle='#f8717188';ctx.setLineDash([2,2]);ctx.beginPath();ctx.moveTo(10,ey);ctx.lineTo(10+histW,ey);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#f87171';ctx.font='8px SF Mono';ctx.fillText('expected',histW-40,ey-3);

    // Monte Carlo scatter (bottom half)
    const mcY=histY+histH+30,mcSize=Math.min(180,(h-mcY-40));
    ctx.fillStyle=accent;ctx.font='bold 10px Tajawal';ctx.fillText('Monte Carlo Pi Estimation',10,mcY-4);

    // Circle boundary
    const mcX=10,mcR=mcSize/2;
    ctx.strokeStyle=muted+'44';ctx.strokeRect(mcX,mcY,mcSize,mcSize);
    ctx.strokeStyle='#60a5fa44';ctx.beginPath();ctx.arc(mcX+mcR,mcY+mcR,mcR,0,Math.PI*2);ctx.stroke();

    // Points
    r.mc.points.forEach(p=>{
      const px=mcX+(p.x/255)*mcSize;
      const py=mcY+(p.y/255)*mcSize;
      ctx.fillStyle=p.inside?'#4ade8033':'#f8717133';
      ctx.fillRect(px,py,2,2);
    });

    ctx.fillStyle=muted;ctx.font='10px SF Mono';
    ctx.fillText(`Pi ~ ${r.mc.piEst.toFixed(4)} (err: ${r.mc.errorPct.toFixed(2)}%)`,mcX+mcSize+15,mcY+15);

    // Entropy gauge
    const gaugeX=mcX+mcSize+15,gaugeY=mcY+35,gaugeW=w-gaugeX-20,gaugeH=20;
    ctx.fillStyle='rgba(255,255,255,0.05)';ctx.fillRect(gaugeX,gaugeY,gaugeW,gaugeH);
    const entFill=(r.entropy/8)*gaugeW;
    const entColor=r.entropy>7.9?'#4ade80':r.entropy>7.5?'#fbbf24':'#f87171';
    ctx.fillStyle=entColor+'66';ctx.fillRect(gaugeX,gaugeY,entFill,gaugeH);
    ctx.strokeStyle=entColor;ctx.strokeRect(gaugeX,gaugeY,gaugeW,gaugeH);
    ctx.fillStyle=entColor;ctx.font='bold 10px SF Mono';
    ctx.fillText(`${r.entropy.toFixed(3)}/8.0 bits`,gaugeX+4,gaugeY+14);

    // Chi-square bar
    const chiY=gaugeY+35;
    ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Chi-Square:',gaugeX,chiY);
    const chiNorm=Math.min(1,r.chi.chi2/600);
    const chiBarW=chiNorm*gaugeW;
    const chiColor=r.chi.chi2>200&&r.chi.chi2<330?'#4ade80':'#f87171';
    ctx.fillStyle=chiColor+'44';ctx.fillRect(gaugeX,chiY+5,chiBarW,15);
    ctx.fillStyle=chiColor;ctx.font='9px SF Mono';
    ctx.fillText(`${r.chi.chi2.toFixed(1)} (200-330=good)`,gaugeX+4,chiY+17);

    // Serial correlation
    const scY=chiY+30;
    ctx.fillStyle=muted;ctx.font='10px Tajawal';ctx.fillText('Serial Corr:',gaugeX,scY);
    const scAbs=Math.abs(r.sc);
    const scColor=scAbs<0.05?'#4ade80':scAbs<0.2?'#fbbf24':'#f87171';
    ctx.fillStyle=scColor;ctx.font='bold 10px SF Mono';
    ctx.fillText(`${r.sc.toFixed(5)} ${scAbs<0.05?'(good)':'(bad)'}`,gaugeX+80,scY);
  }

  if(state.phase==='compared'&&state.comparisons.length>0){
    const barH=60,gap=15;
    let y=50;
    const sources=state.comparisons;
    const colors=['#4ade80','#60a5fa','#fbbf24','#f87171'];

    ctx.fillStyle=muted;ctx.font='11px Tajawal';
    ctx.fillText(`Comparing ${sources.length} sources`,10,38);

    sources.forEach((s,i)=>{
      ctx.fillStyle=colors[i]+'22';ctx.fillRect(10,y,w-20,barH);
      ctx.strokeStyle=colors[i]+'66';ctx.strokeRect(10,y,w-20,barH);
      ctx.fillStyle=colors[i];ctx.font='bold 11px Tajawal';
      ctx.fillText(s.source,15,y+14);

      // Entropy bar
      const entW=((s.entropy/8)*(w-200));
      ctx.fillStyle=colors[i]+'44';ctx.fillRect(120,y+5,entW,12);
      ctx.fillStyle=colors[i];ctx.font='9px SF Mono';
      ctx.fillText(`H=${s.entropy.toFixed(3)}`,120+entW+5,y+14);

      // Stats
      ctx.fillStyle=muted;ctx.font='9px SF Mono';
      ctx.fillText(`Chi2=${s.chi.toFixed(1)}  Pi=${s.pi.toFixed(3)}  SC=${s.sc.toFixed(4)}`,15,y+35);

      // Mini frequency sparkline
      if(s.data){
        const freq=new Float64Array(256);
        for(let j=0;j<s.data.length;j++)freq[s.data[j]]++;
        const maxF=Math.max(...freq,1);
        const sparkW=(w-40)/256;
        for(let j=0;j<256;j++){
          const bh=(freq[j]/maxF)*15;
          ctx.fillStyle=colors[i]+'33';
          ctx.fillRect(15+j*sparkW,y+barH-bh-2,sparkW,bh);
        }
      }
      y+=barH+gap;
    });
  }
}

function buildHelp(){const s=LANG[currentLang];$('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');$('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');$('helpWiki').innerHTML=[{t:'Shannon Entropy',p:s.wiki_shannon},{t:'Chi-Square',p:s.wiki_chi},{t:'Monte Carlo Pi',p:s.wiki_monte},{t:'Serial Correlation',p:s.wiki_serial}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildRef(){const s=LANG[currentLang];$('refCard').innerHTML=[{t:'Shannon Entropy',p:s.wiki_shannon},{t:'Chi-Square',p:s.wiki_chi},{t:'Monte Carlo Pi',p:s.wiki_monte},{t:'Serial Correlation',p:s.wiki_serial}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('')}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);
  resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});
  try{const l=localStorage.getItem('cry-entropy-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-entropy-theme');if(t)setTheme(t)}catch{}
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

  $('sourceSelect').onchange=e=>{$('customSection').style.display=e.target.value==='custom'?'':'none'};
  $('analyzeBtn').onclick=analyzeData;
  $('compareBtn').onclick=compareAll;
  $('resetBtn').onclick=resetAll;

  buildHelp();buildRef();buildMath();
  log(LANG[currentLang].ready,'success');drawCanvas();
});

/* ═══════ ENHANCED ENTROPY VISUALIZATION (IIFE) ═══════ */
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

// Live entropy data
let _liveData=new Uint8Array(256);
let _source='crypto';

function refreshData(){
  if(_source==='crypto')crypto.getRandomValues(_liveData);
  else if(_source==='math')for(let i=0;i<256;i++)_liveData[i]=Math.floor(Math.random()*256);
  else if(_source==='counter')for(let i=0;i<256;i++)_liveData[i]=(i+_t)&0xFF;
  else{let s=_t;for(let i=0;i<256;i++){s=(s*1103515245+12345)&0x7FFFFFFF;_liveData[i]=(s>>16)&0xFF}}
}

function draw(){
  const w=_c.getBoundingClientRect().width,h=_c.getBoundingClientRect().height;
  const acc=_gc('--accent'),mut=_gc('--text-muted'),txt=_gc('--text');
  _x.clearRect(0,0,w,h);_t++;

  if(_t%10===0)refreshData();

  // === Byte Heatmap (top-left) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Live Byte Stream Heatmap',10,16);

  const hmW=w*0.38,hmH=100,hmX=10,hmY=24;
  const hmCols=16,hmRows=16;
  const hmCellW=hmW/hmCols,hmCellH=hmH/hmRows;
  for(let i=0;i<Math.min(256,hmCols*hmRows);i++){
    const col=i%hmCols,row=Math.floor(i/hmCols);
    const val=_liveData[i];
    const hue=(val/256)*360;
    _x.fillStyle=`hsla(${hue},60%,${30+val/256*40}%,.7)`;
    _x.fillRect(hmX+col*hmCellW,hmY+row*hmCellH,hmCellW-0.5,hmCellH-0.5);
  }
  // Compute live entropy
  const freq=new Float64Array(256);
  for(let i=0;i<_liveData.length;i++)freq[_liveData[i]]++;
  let H=0;for(let i=0;i<256;i++){if(freq[i]>0){const p=freq[i]/_liveData.length;H-=p*Math.log2(p)}}
  _x.fillStyle=H>7.5?'#4ade80':H>6?'#fbbf24':'#f87171';_x.font='bold 9px SF Mono';
  _x.fillText(`Shannon Entropy: ${H.toFixed(4)} / 8.0 bits`,hmX,hmY+hmH+12);

  // === Bit Pattern Visualization (top-middle) ===
  const bpX=w*0.42,bpW=w*0.25,bpY=10;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Bit Patterns',bpX,16);

  const bitRows=16,bitCols=16;
  const bitCW=bpW/bitCols,bitCH=100/bitRows;
  for(let byte=0;byte<Math.min(bitRows,_liveData.length);byte++){
    for(let bit=7;bit>=0;bit--){
      const val=(_liveData[byte]>>bit)&1;
      const x=bpX+(7-bit)*bitCW*2;
      const y=bpY+18+byte*bitCH;
      _x.fillStyle=val?`${acc}66`:'rgba(255,255,255,.03)';
      _x.fillRect(x,y,bitCW*2-0.5,bitCH-0.5);
    }
  }
  _x.fillStyle=mut;_x.font='8px Tajawal';_x.fillText('0-bits dark, 1-bits colored',bpX,bpY+126);

  // === Monte Carlo Pi Scatter (top-right) ===
  const mcX=w*0.70,mcW=w*0.28,mcY=10;
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Monte Carlo Pi',mcX,16);
  const mcSize=Math.min(mcW,100);
  const mcR=mcSize/2;
  _x.strokeStyle=mut+'44';_x.strokeRect(mcX,mcY+18,mcSize,mcSize);
  _x.strokeStyle='#60a5fa44';_x.beginPath();_x.arc(mcX+mcR,mcY+18+mcR,mcR,0,Math.PI*2);_x.stroke();

  let inside=0;const nPairs=Math.floor(_liveData.length/2);
  for(let i=0;i<nPairs;i++){
    const x=_liveData[i*2],y=_liveData[i*2+1];
    const dx=x-127.5,dy=y-127.5;
    const isIn=dx*dx+dy*dy<=127.5*127.5;
    if(isIn)inside++;
    _x.fillStyle=isIn?'#4ade8044':'#f8717133';
    const px=mcX+(x/255)*mcSize;
    const py=mcY+18+(y/255)*mcSize;
    _x.fillRect(px,py,2,2);
  }
  const piEst=4*inside/nPairs;
  _x.fillStyle=mut;_x.font='9px SF Mono';
  _x.fillText(`Pi ~ ${piEst.toFixed(3)}`,mcX,mcY+mcSize+32);

  // === Entropy Gauge (middle) ===
  const egY=140,egW=w-20,egH=30;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Entropy Quality Gauge',10,egY);
  // Background
  _x.fillStyle='rgba(255,255,255,.04)';_x.fillRect(10,egY+8,egW,egH);
  // Gradient fill
  const grad=_x.createLinearGradient(10,0,10+egW,0);
  grad.addColorStop(0,'#f87171');grad.addColorStop(0.5,'#fbbf24');grad.addColorStop(0.85,'#4ade80');grad.addColorStop(1,'#4ade80');
  _x.fillStyle=grad;_x.fillRect(10,egY+8,(H/8)*egW,egH);
  _x.strokeStyle=acc;_x.strokeRect(10,egY+8,egW,egH);
  // Needle
  const needleX=10+(H/8)*egW;
  _x.fillStyle='#fff';_x.beginPath();_x.moveTo(needleX,egY+6);_x.lineTo(needleX-4,egY+2);_x.lineTo(needleX+4,egY+2);_x.fill();
  // Labels
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText('0 (constant)',10,egY+egH+20);_x.fillText('8.0 (perfect)',egW-55,egY+egH+20);
  const grade=H>7.9?'EXCELLENT':H>7.5?'GOOD':H>6?'FAIR':'POOR';
  _x.fillStyle=H>7.5?'#4ade80':H>6?'#fbbf24':'#f87171';
  _x.font='bold 10px SF Mono';_x.textAlign='center';
  _x.fillText(`${H.toFixed(3)} bits/byte (${grade})`,w/2,egY+22);_x.textAlign='left';

  // === Chi-Square Histogram (bottom-left) ===
  const csY=egY+egH+30,csW=w*0.48,csH=h-csY-25;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Byte Frequency (Chi-Square basis)',10,csY);

  const maxFreq=Math.max(...freq,1);
  const expected=_liveData.length/256;
  const barW=csW/256;
  for(let i=0;i<256;i++){
    if(freq[i]>0){
      const barH=(freq[i]/maxFreq)*(csH-15);
      const deviation=Math.abs(freq[i]-expected)/Math.max(expected,1);
      const color=deviation<0.5?'#4ade80':deviation<1?'#fbbf24':'#f87171';
      _x.fillStyle=color+'55';
      _x.fillRect(10+i*barW,csY+8+csH-15-barH,barW,barH);
    }
  }
  // Expected line
  const expY=csY+8+csH-15-(expected/maxFreq)*(csH-15);
  _x.strokeStyle='#f87171';_x.setLineDash([2,2]);
  _x.beginPath();_x.moveTo(10,expY);_x.lineTo(10+csW,expY);_x.stroke();_x.setLineDash([]);
  // Chi2 value
  let chi2=0;for(let i=0;i<256;i++)chi2+=(freq[i]-expected)**2/Math.max(expected,0.01);
  _x.fillStyle=chi2>200&&chi2<330?'#4ade80':'#f87171';_x.font='9px SF Mono';
  _x.fillText(`Chi2 = ${chi2.toFixed(1)} ${chi2>200&&chi2<330?'(PASS)':'(FAIL)'}`,10,csY+csH-2);

  // === Serial Correlation Plot (bottom-right) ===
  const scX=w*0.52,scY=csY,scW=w*0.46,scH=csH;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Serial Correlation (x[i] vs x[i+1])',scX,scY);

  const scPlotSize=Math.min(scW,scH-20);
  _x.strokeStyle=mut+'33';_x.strokeRect(scX,scY+8,scPlotSize,scPlotSize);
  // Diagonal (perfect correlation line)
  _x.strokeStyle='#f87171';_x.setLineDash([3,3]);
  _x.beginPath();_x.moveTo(scX,scY+8+scPlotSize);_x.lineTo(scX+scPlotSize,scY+8);_x.stroke();_x.setLineDash([]);

  for(let i=0;i<_liveData.length-1;i++){
    const x=scX+(_liveData[i]/255)*scPlotSize;
    const y=scY+8+(1-_liveData[i+1]/255)*scPlotSize;
    _x.fillStyle='rgba(96,165,250,.2)';
    _x.fillRect(x,y,2,2);
  }

  // Correlation coefficient
  let sc=0,sum=0,sumSq=0,sumProd=0;
  for(let i=0;i<_liveData.length;i++){sum+=_liveData[i];sumSq+=_liveData[i]*_liveData[i]}
  for(let i=0;i<_liveData.length-1;i++)sumProd+=_liveData[i]*_liveData[i+1];
  const mean=sum/_liveData.length;
  const denom=sumSq-mean*mean*_liveData.length;
  sc=denom===0?1:(sumProd-mean*mean*(_liveData.length-1))/denom;
  _x.fillStyle=Math.abs(sc)<0.1?'#4ade80':'#f87171';_x.font='bold 9px SF Mono';
  _x.fillText(`r = ${sc.toFixed(4)} ${Math.abs(sc)<0.1?'(good)':'(correlated!)'}`,scX+scPlotSize+5,scY+scPlotSize/2);

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
