/**
 * Timing Oracle Attack — Workshop DIY v1.0
 * Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas Timing Visualization
 */
const $=id=>document.getElementById(id);

/* ======= i18n ======= */
const LANG={
  en:{
    title:'Timing Oracle Attack',subtitle:'Exploit timing differences to leak secrets byte by byte',
    mainSection:'Timing Oracle',mainDesc:'Observe how naive byte-by-byte comparison leaks timing information',
    secretLabel:'Secret Token (hidden)',secretHint:'The server secret you are trying to discover',
    guessLabel:'Your Guess',guessHint:'Enter a guess or run the automatic attack',
    randomize:'Random',probeOnce:'Probe Once',autoAttack:'Auto Attack',stop:'Stop',reset:'Reset',results:'Results',
    vizTitle:'Timing Visualization',vizHint:'Watch timing differences reveal the secret character by character',
    sectionA:'Attack Reference',sectionB:'Timing Deep Dive',
    settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    activityLog:'Activity Log',ready:'Ready',splashHint:'tap to skip',
    langChanged:'Language -> English',themeChanged:'Theme ->',
    probing:'Probing...',found:'Secret fully recovered!',attacking:'Auto-attacking...',stopped:'Attack stopped',
    resetDone:'Reset complete',byteFound:'Byte found!',
    faq_q1:'What is a timing attack?',faq_a1:'A side-channel attack that exploits time differences in operations. Naive string comparison checks byte-by-byte and returns early on mismatch, leaking how many bytes matched.',
    faq_q2:'How does the oracle work?',faq_a2:'Each correct byte adds a measurable delay. By trying all 256 values for each position, the one with the longest response time reveals the correct byte.',
    faq_q3:'How to defend?',faq_a3:'Use constant-time comparison functions that always check all bytes regardless of match position. Most crypto libraries provide these.',
    faq_q4:'Is my data private?', faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere. Your experiments stay on your device.',
    howto_1:'Set or randomize a secret token.',howto_2:'Click Probe Once to measure timing for your guess.',howto_3:'Click Auto Attack to recover the secret automatically.',howto_4:'Watch the canvas show timing bars per character.',
    wiki_naive:'Naive comparison: for(i=0;i<len;i++) if(a[i]!=b[i]) return false; — leaks position of first mismatch via timing.',
    wiki_constant:'Constant-time: result=0; for(i=0;i<len;i++) result|=a[i]^b[i]; return result===0; — always same time.',
    wiki_real:'Real-world: OpenSSL CVE-2014-0160 (Heartbleed) and HMAC verification timing leaks in web frameworks.',
    mathExplain:'Timing Attack Model:\nNaive compare(secret, guess):\n  for i in 0..len:\n    if secret[i] != guess[i]: return false  // early exit!\n  return true\n\nAttacker measures: T(guess) ~ k * matching_prefix_length\n\nFor position i, try all chars c:\n  guess[i] = c\n  measure T(guess)\n  secret[i] = argmax_c T(guess)\n\nComplexity: O(n * |alphabet|) instead of O(|alphabet|^n)\nFor 8-char secret with 62 chars: 496 vs 2.18 * 10^14 attempts'
  ,step1Title:'Choose Algorithm',step1Desc:'Select the cryptographic algorithm and key parameters to analyze.',step2Title:'Set Up Attack',step2Desc:'Configure the attack parameters: known plaintext, side-channel data, or timing.',step3Title:'Execute Attack',step3Desc:'Run the cryptographic attack and attempt to recover the secret key.',step4Title:'Analyze Results',step4Desc:'Evaluate attack success rate and understand the vulnerability exploited.'},
  fr:{
    title:'Attaque Oracle Temporel',subtitle:'Exploitez les differences de temps pour reveler les secrets octet par octet',
    mainSection:'Oracle Temporel',mainDesc:'Observez comment la comparaison naive octet par octet fuit des informations temporelles',
    secretLabel:'Jeton Secret (cache)',secretHint:'Le secret serveur que vous essayez de decouvrir',
    guessLabel:'Votre Estimation',guessHint:'Entrez une estimation ou lancez l\'attaque automatique',
    randomize:'Aleatoire',probeOnce:'Sonder',autoAttack:'Attaque Auto',stop:'Arreter',reset:'Reinitialiser',results:'Resultats',
    vizTitle:'Visualisation Temporelle',vizHint:'Regardez les differences de temps reveler le secret caractere par caractere',
    sectionA:'Reference d\'Attaque',sectionB:'Approfondissement Temporel',
    settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    activityLog:'Journal',ready:'Pret',splashHint:'appuyer pour passer',
    langChanged:'Langue -> Francais',themeChanged:'Theme ->',
    probing:'Sondage...',found:'Secret entierement recupere!',attacking:'Attaque automatique...',stopped:'Attaque arretee',
    resetDone:'Reinitialisation complete',byteFound:'Octet trouve!',
    faq_q1:'Qu\'est-ce qu\'une attaque temporelle?',faq_a1:'Une attaque par canal auxiliaire qui exploite les differences de temps dans les operations.',
    faq_q2:'Comment fonctionne l\'oracle?',faq_a2:'Chaque octet correct ajoute un delai mesurable.',
    faq_q3:'Comment se defendre?',faq_a3:'Utilisez des fonctions de comparaison a temps constant.',
    faq_q4:'Mes données sont-elles privées ?', faq_a4:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée nulle part.',
    howto_1:'Definissez ou randomisez un jeton secret.',howto_2:'Cliquez Sonder pour mesurer le temps.',howto_3:'Cliquez Attaque Auto pour recuperer le secret.',howto_4:'Regardez le canvas montrer les barres de temps.',
    wiki_naive:'Comparaison naive: retourne false au premier octet different, fuitant la position.',
    wiki_constant:'Temps constant: verifie toujours tous les octets, meme temps.',
    wiki_real:'Monde reel: vulnerabilites HMAC dans les frameworks web.',
    mathExplain:'Modele d\'Attaque Temporelle:\nComparaison naive retourne au premier echec.\nAttaquant mesure le temps proportionnel au prefixe correct.\nComplexite: O(n * |alphabet|) au lieu de O(|alphabet|^n)'
  ,step1Title:'Choisir l\'algorithme',step1Desc:'Sélectionne l\'algorithme cryptographique et les paramètres de clé.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres : texte clair connu, canal latéral ou timing.',step3Title:'Exécuter l\'attaque',step3Desc:'Lance l\'attaque cryptographique et tente de récupérer la clé.',step4Title:'Analyser les résultats',step4Desc:'Évalue le taux de réussite et comprends la vulnérabilité exploitée.'},
  ar:{
    title:'هجوم اوراكل التوقيت',subtitle:'استغل فروقات التوقيت لكشف الاسرار بايت تلو بايت',
    mainSection:'اوراكل التوقيت',mainDesc:'شاهد كيف تسرب المقارنة البسيطة بايت تلو بايت معلومات التوقيت',
    secretLabel:'الرمز السري (مخفي)',secretHint:'السر الذي تحاول اكتشافه',
    guessLabel:'تخمينك',guessHint:'ادخل تخمينا او شغل الهجوم التلقائي',
    randomize:'عشوائي',probeOnce:'فحص مرة',autoAttack:'هجوم تلقائي',stop:'ايقاف',reset:'اعادة تعيين',results:'النتائج',
    vizTitle:'تصور التوقيت',vizHint:'شاهد فروقات التوقيت تكشف السر حرفا تلو حرف',
    sectionA:'مرجع الهجوم',sectionB:'تعمق في التوقيت',
    settings:'الاعدادات',language:'اللغة',theme:'المظهر',soundEffects:'مؤثرات صوتية',
    help:'مساعدة',faq:'اسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
    activityLog:'سجل النشاط',ready:'جاهز',splashHint:'انقر للتخطي',
    langChanged:'اللغة <- العربية',themeChanged:'المظهر <-',
    probing:'جاري الفحص...',found:'تم استعادة السر بالكامل!',attacking:'هجوم تلقائي...',stopped:'تم ايقاف الهجوم',
    resetDone:'تمت اعادة التعيين',byteFound:'تم ايجاد البايت!',
    faq_q1:'ما هو هجوم التوقيت؟',faq_a1:'هجوم قناة جانبية يستغل فروقات الوقت في العمليات.',
    faq_q2:'كيف يعمل الاوراكل؟',faq_a2:'كل بايت صحيح يضيف تاخيرا قابلا للقياس.',
    faq_q3:'كيف تدافع؟',faq_a3:'استخدم دوال مقارنة ذات وقت ثابت.',
    faq_q4:'هل بياناتي خاصة؟', faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك. لا يتم إرسال أي بيانات إلى أي مكان.',
    howto_1:'حدد او ولد رمزا سريا عشوائيا.',howto_2:'انقر فحص مرة لقياس التوقيت.',howto_3:'انقر هجوم تلقائي لاستعادة السر.',howto_4:'شاهد اعمدة التوقيت على اللوحة.',
    wiki_naive:'مقارنة بسيطة: تعود false عند اول اختلاف مسربة الموقع.',
    wiki_constant:'وقت ثابت: تفحص جميع البايتات دائما.',
    wiki_real:'واقعي: ثغرات HMAC في اطر العمل الويب.',
    mathExplain:'نموذج هجوم التوقيت:\nالمقارنة البسيطة تعود عند اول فشل.\nالمهاجم يقيس الوقت المتناسب مع طول البادئة الصحيحة.\nالتعقيد: O(n * |الابجدية|) بدلا من O(|الابجدية|^n)'
  ,step1Title:'اختيار الخوارزمية',step1Desc:'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.',step2Title:'إعداد الهجوم',step2Desc:'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.',step3Title:'تنفيذ الهجوم',step3Desc:'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.',step4Title:'تحليل النتائج',step4Desc:'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.'}
};
let currentLang='en';

function setLanguage(lang){
  currentLang=lang;const s=LANG[lang];if(!s)return;
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;
  const sel=$('langSelect');if(sel)sel.value=lang;
  try{localStorage.setItem('cry-timing-lang',lang)}catch{}
  log(s.langChanged,'info');buildHelp();buildRef();buildMath();
}

const LIGHT_THEMES=['riad','medina'];
function setTheme(name){
  document.documentElement.dataset.theme=name;
  document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));
  const sel=$('themeSelect');if(sel)sel.value=name;
  try{localStorage.setItem('cry-timing-theme',name)}catch{}
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

function togglePanel(panel,overlay){
  panel.classList.toggle('open');if(overlay)overlay.classList.toggle('active',panel.classList.contains('open'));
}

/* ======= TIMING ORACLE SIMULATION ======= */
const CHARSET='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const DELAY_PER_MATCH=50; // simulated ms per matching byte

// Simulated vulnerable comparison: returns time proportional to matching prefix
function vulnerableCompare(secret,guess){
  let matchCount=0;
  for(let i=0;i<Math.min(secret.length,guess.length);i++){
    if(secret[i]===guess[i])matchCount++;else break;
  }
  // Simulate timing: base + delay per match + noise
  const baseTime=10+Math.random()*5;
  return{time:baseTime+matchCount*DELAY_PER_MATCH+Math.random()*8,matches:matchCount,total:secret.length};
}

let attackState={running:false,recovered:'',timings:[],probeResults:[],currentPos:0,charTimings:{}};
let animFrame;

function probeOnce(){
  const secret=$('secretInput').value;
  const guess=$('guessInput').value;
  const result=vulnerableCompare(secret,guess);
  attackState.probeResults.push({guess,time:result.time,matches:result.matches});
  const s=LANG[currentLang];
  log(`Probe: "${guess}" -> ${result.time.toFixed(1)}ms (${result.matches}/${result.total} match)`,'info');
  let out=`Guess: "${guess}"\nResponse time: ${result.time.toFixed(2)}ms\n`;
  out+=`Matching prefix: ${result.matches} / ${result.total} bytes\n`;
  out+=`Correct prefix: "${secret.slice(0,result.matches)}"\n`;
  if(result.matches===result.total)out+=`\nFULL MATCH! Secret recovered!`;
  $('resultsBox').textContent=out;
  drawCanvas();
}

function autoAttack(){
  const secret=$('secretInput').value;
  if(!secret){log('No secret set','error');return}
  const s=LANG[currentLang];
  attackState={running:true,recovered:'',timings:[],probeResults:[],currentPos:0,charTimings:{}};
  showToast(s.attacking);log(s.attacking,'info');

  function attackPosition(pos){
    if(!attackState.running||pos>=secret.length){
      attackState.running=false;hideToast();
      if(pos>=secret.length){
        log(`${s.found}: "${attackState.recovered}"`,'success');
        $('guessInput').value=attackState.recovered;
      }
      drawCanvas();return;
    }
    attackState.currentPos=pos;
    let bestChar='',bestTime=-1;
    const charResults=[];
    let ci=0;

    function tryNextChar(){
      if(!attackState.running){hideToast();return}
      if(ci>=CHARSET.length){
        // Pick the char with highest time
        attackState.recovered+=bestChar;
        attackState.timings.push({pos,char:bestChar,time:bestTime,all:charResults});
        $('guessInput').value=attackState.recovered;
        log(`Position ${pos}: '${bestChar}' (${bestTime.toFixed(1)}ms) - ${s.byteFound}`,'success');
        drawCanvas();
        setTimeout(()=>attackPosition(pos+1),100);
        return;
      }
      const c=CHARSET[ci];
      const guess=attackState.recovered+c+'_'.repeat(Math.max(0,secret.length-pos-1));
      const result=vulnerableCompare(secret,guess);
      charResults.push({char:c,time:result.time});
      if(result.time>bestTime){bestTime=result.time;bestChar=c}
      ci++;
      attackState.charTimings={pos,results:charResults,bestChar,bestTime};
      drawCanvas();
      setTimeout(tryNextChar,15);
    }
    tryNextChar();
  }
  attackPosition(0);
}

function stopAttack(){attackState.running=false;hideToast();log(LANG[currentLang].stopped,'info')}
function resetAll(){
  attackState={running:false,recovered:'',timings:[],probeResults:[],currentPos:0,charTimings:{}};
  $('resultsBox').textContent='';$('guessInput').value='';
  log(LANG[currentLang].resetDone,'info');drawCanvas();
}

function randomSecret(){
  let s='';for(let i=0;i<8;i++)s+=CHARSET[Math.floor(Math.random()*CHARSET.length)];
  $('secretInput').value=s;log(`New secret generated (${s.length} chars)`,'info');
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
  ctx.fillText('Timing Oracle Attack',10,22);

  const secret=$('secretInput').value||'';
  ctx.fillStyle=muted;ctx.font='11px Tajawal,sans-serif';
  ctx.fillText(`Secret length: ${secret.length} | Recovered: "${attackState.recovered}"`,10,38);

  // Draw recovered bytes as blocks
  const blockW=Math.min(50,(w-40)/Math.max(secret.length,1)),blockH=30,startY=50;
  for(let i=0;i<secret.length;i++){
    const x=10+i*(blockW+4);
    const recovered=i<attackState.recovered.length;
    const current=i===attackState.currentPos&&attackState.running;
    ctx.fillStyle=recovered?'#4ade8033':current?'#fbbf2433':'rgba(255,255,255,0.05)';
    ctx.fillRect(x,startY,blockW,blockH);
    ctx.strokeStyle=recovered?'#4ade80':current?'#fbbf24':muted+'44';
    ctx.lineWidth=1.5;ctx.strokeRect(x,startY,blockW,blockH);
    if(recovered){
      ctx.fillStyle='#4ade80';ctx.font='bold 14px SF Mono,monospace';
      ctx.textAlign='center';ctx.fillText(attackState.recovered[i],x+blockW/2,startY+20);ctx.textAlign='left';
    }else if(current){
      ctx.fillStyle='#fbbf24';ctx.font='bold 10px Tajawal';
      ctx.textAlign='center';ctx.fillText('?',x+blockW/2,startY+20);ctx.textAlign='left';
    }
  }

  // Draw timing bars for current position
  const ct=attackState.charTimings;
  if(ct&&ct.results&&ct.results.length>0){
    const barArea={x:10,y:startY+blockH+20,w:w-20,h:h-startY-blockH-60};
    ctx.fillStyle=accent;ctx.font='bold 11px Tajawal,sans-serif';
    ctx.fillText(`Position ${ct.pos}: Testing characters (${ct.results.length}/${CHARSET.length})`,barArea.x,barArea.y-4);

    const maxTime=Math.max(...ct.results.map(r=>r.time),1);
    const barW=Math.max(2,Math.min(12,(barArea.w-10)/ct.results.length-1));

    ct.results.forEach((r,i)=>{
      const x=barArea.x+i*(barW+1);
      const barH=(r.time/maxTime)*barArea.h*0.85;
      const isBest=r.char===ct.bestChar;
      ctx.fillStyle=isBest?'#f87171':'#60a5fa44';
      ctx.fillRect(x,barArea.y+barArea.h-barH,barW,barH);
      if(isBest&&barW>6){
        ctx.fillStyle='#f87171';ctx.font='bold 9px SF Mono';
        ctx.textAlign='center';ctx.fillText(r.char,x+barW/2,barArea.y+barArea.h-barH-4);ctx.textAlign='left';
      }
    });

    // Axis
    ctx.strokeStyle=muted+'44';ctx.beginPath();ctx.moveTo(barArea.x,barArea.y+barArea.h);ctx.lineTo(barArea.x+barArea.w,barArea.y+barArea.h);ctx.stroke();
    ctx.fillStyle=muted;ctx.font='9px SF Mono';
    ctx.fillText(`0ms`,barArea.x,barArea.y+barArea.h+12);
    ctx.fillText(`${maxTime.toFixed(0)}ms`,barArea.x+barArea.w-30,barArea.y-4);
  }

  // Draw historical timing data if available
  if(attackState.timings.length>0&&(!ct||!ct.results||ct.results.length===0)){
    const histY=startY+blockH+20;
    ctx.fillStyle=accent;ctx.font='bold 11px Tajawal';
    ctx.fillText('Recovered byte timings:',10,histY);
    const maxT=Math.max(...attackState.timings.map(t=>t.time));
    attackState.timings.forEach((t,i)=>{
      const x=10,y=histY+14+i*22,barW=(t.time/maxT)*(w-120);
      ctx.fillStyle='#4ade8033';ctx.fillRect(x,y,barW,16);
      ctx.fillStyle='#4ade80';ctx.font='10px SF Mono';
      ctx.fillText(`[${i}] '${t.char}' ${t.time.toFixed(1)}ms`,x+4,y+12);
    });
  }

  if(attackState.running)animFrame=requestAnimationFrame(drawCanvas);
}

/* ======= BUILD HELP ======= */
function buildHelp(){
  const s=LANG[currentLang];
  $('helpFaq').innerHTML=[{q:s.faq_q1,a:s.faq_a1},{q:s.faq_q2,a:s.faq_a2},{q:s.faq_q3,a:s.faq_a3}].map(i=>`<details class="help-item"><summary>${i.q}</summary><p>${i.a}</p></details>`).join('');
  $('helpHowto').innerHTML=[s.howto_1,s.howto_2,s.howto_3,s.howto_4].map((t,i)=>`<div class="help-step"><span class="help-step-num">${i+1}</span><p>${t}</p></div>`).join('');
  $('helpWiki').innerHTML=[{t:'Naive Compare',p:s.wiki_naive},{t:'Constant-Time',p:s.wiki_constant},{t:'Real-World',p:s.wiki_real}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('');
}
function buildRef(){
  const s=LANG[currentLang];
  $('refCard').innerHTML=[{t:'Naive Compare',p:s.wiki_naive},{t:'Constant-Time',p:s.wiki_constant},{t:'Real-World',p:s.wiki_real}].map(i=>`<div class="wiki-entry"><h3>${i.t}</h3><p>${i.p}</p></div>`).join('');
}
function buildMath(){$('mathBox').textContent=LANG[currentLang].mathExplain}

/* ======= INIT ======= */
document.addEventListener('DOMContentLoaded',()=>{
  splashTimer=setTimeout(dismissSplash,2500);
  resizeCanvas();window.addEventListener('resize',()=>{resizeCanvas();drawCanvas()});

  try{const l=localStorage.getItem('cry-timing-lang');if(l&&LANG[l])setLanguage(l)}catch{}
  try{const t=localStorage.getItem('cry-timing-theme');if(t)setTheme(t)}catch{}

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

  $('probeBtn').onclick=probeOnce;
  $('autoBtn').onclick=autoAttack;
  $('stopBtn').onclick=stopAttack;
  $('resetBtn').onclick=resetAll;
  $('randomSecretBtn').onclick=randomSecret;

  buildHelp();buildRef();buildMath();
  log(LANG[currentLang].ready,'success');drawCanvas();
});

/* ═══════ ENHANCED TIMING ORACLE VISUALIZATION (IIFE) ═══════ */
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

  // === Naive vs Constant-Time Comparison (top) ===
  _x.fillStyle=acc;_x.font='bold 12px Righteous,Tajawal,sans-serif';
  _x.fillText('Naive vs Constant-Time String Comparison',10,16);

  const secret='S3cR3tKy';
  const nBytes=secret.length;
  const cellW=Math.min(45,(w-20)/(nBytes+1));

  // Naive comparison (top row)
  const naiveY=30;
  _x.fillStyle='#f87171';_x.font='bold 9px SF Mono';_x.fillText('NAIVE (vulnerable):',10,naiveY);
  const matchPos=_t%nBytes;
  for(let i=0;i<nBytes;i++){
    const x=10+i*cellW;
    const isChecked=i<=matchPos;
    const isMatch=i<matchPos;
    const isMismatch=i===matchPos;
    _x.fillStyle=isMatch?'#4ade8044':isMismatch?'#f8717144':'rgba(255,255,255,.03)';
    _x.fillRect(x,naiveY+6,cellW-3,28);
    _x.strokeStyle=isChecked?(isMatch?'#4ade80':'#f87171'):mut+'22';_x.strokeRect(x,naiveY+6,cellW-3,28);
    // Byte
    _x.fillStyle=isChecked?(isMatch?'#4ade80':'#f87171'):mut;_x.font='bold 10px SF Mono';_x.textAlign='center';
    _x.fillText(isChecked?(isMatch?'=':'X'):'?',x+cellW/2-1.5,naiveY+24);
    _x.textAlign='left';
  }
  // Early exit arrow
  const exitX=10+matchPos*cellW+cellW/2;
  _x.fillStyle='#f87171';_x.font='bold 8px SF Mono';
  _x.fillText('RETURN false',exitX+5,naiveY+42);
  _x.strokeStyle='#f87171';_x.beginPath();_x.moveTo(exitX,naiveY+34);_x.lineTo(exitX,naiveY+44);_x.stroke();

  // Constant time (second row)
  const constY=naiveY+55;
  _x.fillStyle='#4ade80';_x.font='bold 9px SF Mono';_x.fillText('CONSTANT-TIME (secure):',10,constY);
  for(let i=0;i<nBytes;i++){
    const x=10+i*cellW;
    const phase=(_t*0.1+i)%1;
    _x.fillStyle=`rgba(96,165,250,${0.2+phase*0.3})`;
    _x.fillRect(x,constY+6,cellW-3,28);
    _x.strokeStyle='#60a5fa66';_x.strokeRect(x,constY+6,cellW-3,28);
    _x.fillStyle='#60a5fa';_x.font='bold 10px SF Mono';_x.textAlign='center';
    _x.fillText('XOR',x+cellW/2-1.5,constY+24);_x.textAlign='left';
  }
  _x.fillStyle='#4ade80';_x.font='8px SF Mono';
  _x.fillText('Always checks ALL bytes, same time regardless of match position',10,constY+42);

  // === Timing Distribution per Position (middle) ===
  const tdY=constY+55;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Measured Response Time per Secret Position',10,tdY);

  const tdW=w-20,tdH=80;
  const posCount=8;
  const barGroupW=tdW/posCount;

  for(let pos=0;pos<posCount;pos++){
    const groupX=10+pos*barGroupW;
    // Draw multiple measurements as dots
    for(let trial=0;trial<20;trial++){
      const baseTime=10+pos*DELAY_PER_MATCH;
      const noise=(Math.random()-0.5)*15;
      const time=baseTime+noise;
      const y=tdY+10+tdH-(time/(posCount*DELAY_PER_MATCH+20))*tdH;
      _x.fillStyle=`rgba(96,165,250,${0.3+trial*0.03})`;
      _x.beginPath();_x.arc(groupX+barGroupW/2+(Math.random()-0.5)*barGroupW*0.6,y,2,0,Math.PI*2);_x.fill();
    }
    // Mean line
    const meanTime=10+pos*DELAY_PER_MATCH;
    const meanY=tdY+10+tdH-(meanTime/(posCount*DELAY_PER_MATCH+20))*tdH;
    _x.strokeStyle='#f87171';_x.lineWidth=2;
    _x.beginPath();_x.moveTo(groupX+5,meanY);_x.lineTo(groupX+barGroupW-5,meanY);_x.stroke();_x.lineWidth=1;
    // Position label
    _x.fillStyle=mut;_x.font='8px SF Mono';_x.textAlign='center';
    _x.fillText(`pos ${pos}`,groupX+barGroupW/2,tdY+tdH+14);_x.textAlign='left';
  }
  // Trend line
  _x.strokeStyle='#fbbf24';_x.setLineDash([3,3]);_x.lineWidth=1.5;_x.beginPath();
  for(let pos=0;pos<posCount;pos++){
    const x=10+pos*barGroupW+barGroupW/2;
    const y=tdY+10+tdH-((10+pos*DELAY_PER_MATCH)/(posCount*DELAY_PER_MATCH+20))*tdH;
    if(pos===0)_x.moveTo(x,y);else _x.lineTo(x,y);
  }
  _x.stroke();_x.setLineDash([]);_x.lineWidth=1;
  _x.fillStyle='#fbbf24';_x.font='8px SF Mono';
  _x.fillText('Linear trend = timing leak!',w-160,tdY+15);

  // === Attack Complexity (bottom) ===
  const acY=tdY+tdH+22;
  _x.fillStyle=acc;_x.font='bold 11px Righteous,Tajawal,sans-serif';
  _x.fillText('Attack Complexity Reduction',10,acY);

  const secretLen=8,alphabetSize=62;
  const bruteForce=Math.pow(alphabetSize,secretLen);
  const timingAttack=secretLen*alphabetSize;
  const bfLog=Math.log10(bruteForce);
  const taLog=Math.log10(timingAttack);
  const maxLog=bfLog;
  const barMaxW=w-180;

  // Brute force bar
  const bfBarW=(bfLog/maxLog)*barMaxW;
  _x.fillStyle='#f8717133';_x.fillRect(140,acY+8,bfBarW,18);
  _x.fillStyle='#f87171';_x.font='bold 9px SF Mono';
  _x.fillText(`Brute: ${alphabetSize}^${secretLen}`,10,acY+20);
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText(`= ${bruteForce.toExponential(1)}`,140+bfBarW+5,acY+20);

  // Timing attack bar
  const taBarW=(taLog/maxLog)*barMaxW;
  _x.fillStyle='#4ade8033';_x.fillRect(140,acY+30,taBarW,18);
  _x.fillStyle='#4ade80';_x.font='bold 9px SF Mono';
  _x.fillText(`Timing: ${secretLen}*${alphabetSize}`,10,acY+42);
  _x.fillStyle=mut;_x.font='8px SF Mono';
  _x.fillText(`= ${timingAttack}`,140+taBarW+5,acY+42);

  // Speedup
  const speedup=bruteForce/timingAttack;
  _x.fillStyle='#fbbf24';_x.font='bold 10px SF Mono';
  _x.fillText(`${speedup.toExponential(1)}x faster!`,w/2,acY+58);

  requestAnimationFrame(draw);
}
draw();
})();
