/**
 * SDR FFT Racing — Workshop DIY v1.0
 * Race FFT algorithms — DFT vs Cooley-Tukey vs Split-Radix
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text x="10" y="60" font-size="50" fill="currentColor" font-family="Orbitron">🏎️</text><rect x="5" y="75" width="90" height="6" rx="3" fill="currentColor" opacity=".2"/><rect x="5" y="75" width="60" height="6" rx="3" fill="currentColor" opacity=".8"><animate attributeName="width" values="10;90;10" dur="2s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25);}}

const LANG={
en:{title:'SDR FFT Racing',subtitle:'🏎️ FFT Racing — Compare FFT algorithms',disconnected:'Disconnected',connected:'Connected',mainSection:'FFT Racing',mainDesc:'Race DFT vs Cooley-Tukey vs Split-Radix',sectionA:'Race Results',sectionB:'Complexity Chart',sectionC:'FFT Theory',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
faq_q1:'What is FFT Racing?',faq_a1:'A benchmark comparing FFT algorithm implementations in your browser.',faq_q2:'Why is DFT slow?',faq_a2:'Naive DFT is O(N²). FFT is O(N log N) — much faster for large N.',faq_q3:'What do windows do?',faq_a3:'Window functions reduce spectral leakage by tapering edges.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',
howto_1:'Choose FFT size and test signal.',howto_2:'Select a window function.',howto_3:'Set iteration count.',howto_4:'Click Race to benchmark!',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 built-in themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual with RTL.',
working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'🏎️ FFT Racing ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
fftSizeLabel:'FFT Size',sigType:'Test Signal',windowType:'Window Function',iterations:'Race Iterations',raceBtn:'🏁 Race!',resetBtn:'↺ Reset',
theoryIntro:'The Fast Fourier Transform revolutionized signal processing:',theory1:'DFT: O(N²) — direct, simple but slow',theory2:'Cooley-Tukey: O(N log N) — divide and conquer',theory3:'Split-Radix: O(N log N) — fewer multiplications',theory4:'Windowing reduces spectral leakage',theory5:'Zero-padding increases frequency resolution',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',raceStarted:'🏁 Race started!',raceComplete:'🏆 Race complete!',resetDone:'↺ Reset',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
fr:{title:'Course FFT SDR',subtitle:'🏎️ Course FFT — Comparez les algorithmes',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Course FFT',mainDesc:'DFT vs Cooley-Tukey vs Split-Radix',sectionA:'Resultats de Course',sectionB:'Graphe Complexite',sectionC:'Theorie FFT',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
faq_q1:'Qu\'est-ce que la Course FFT?',faq_a1:'Un benchmark comparant les implementations FFT dans le navigateur.',faq_q2:'Pourquoi la DFT est lente?',faq_a2:'La DFT naive est O(N²). La FFT est O(N log N).',faq_q3:'A quoi servent les fenetres?',faq_a3:'Reduisent les fuites spectrales.',faq_q4:'Mes donnees sont privees?',faq_a4:'Oui. Tout est local.',
howto_1:'Choisissez la taille FFT et le signal.',howto_2:'Selectionnez une fenetre.',howto_3:'Reglez le nombre d\'iterations.',howto_4:'Cliquez Course pour benchmarker!',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',
working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',ready:'🏎️ Course FFT prete!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
fftSizeLabel:'Taille FFT',sigType:'Signal Test',windowType:'Fenetre',iterations:'Iterations',raceBtn:'🏁 Course!',resetBtn:'↺ Reinitialiser',
theoryIntro:'La FFT a revolutionne le traitement du signal:',theory1:'DFT: O(N²) — directe, simple mais lente',theory2:'Cooley-Tukey: O(N log N) — diviser pour regner',theory3:'Split-Radix: O(N log N) — moins de multiplications',theory4:'Le fenetrage reduit les fuites spectrales',theory5:'Le zero-padding augmente la resolution frequentielle',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',raceStarted:'🏁 Course lancee!',raceComplete:'🏆 Course terminee!',resetDone:'↺ Reinitialise',
t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
ar:{title:'سباق FFT للراديو البرمجي',subtitle:'🏎️ سباق FFT — قارن خوارزميات FFT',disconnected:'غير متصل',connected:'متصل',mainSection:'سباق FFT',mainDesc:'DFT ضد Cooley-Tukey ضد Split-Radix',sectionA:'نتائج السباق',sectionB:'مخطط التعقيد',sectionC:'نظرية FFT',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
faq_q1:'ما هو سباق FFT؟',faq_a1:'معيار يقارن تطبيقات خوارزميات FFT في المتصفح.',faq_q2:'لماذا DFT بطيئة؟',faq_a2:'DFT المباشرة O(N²). FFT هي O(N log N).',faq_q3:'ماذا تفعل النوافذ؟',faq_a3:'تقلل التسرب الطيفي.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء محلي.',
howto_1:'اختر حجم FFT والاشارة.',howto_2:'اختر دالة نافذة.',howto_3:'اضبط عدد التكرارات.',howto_4:'اضغط سباق للمقارنة!',
wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'🏎️ سباق FFT جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',
fftSizeLabel:'حجم FFT',sigType:'اشارة الاختبار',windowType:'دالة النافذة',iterations:'التكرارات',raceBtn:'🏁 سباق!',resetBtn:'↺ اعادة',
theoryIntro:'FFT احدثت ثورة في معالجة الاشارات:',theory1:'DFT: O(N²) — مباشرة، بسيطة لكن بطيئة',theory2:'Cooley-Tukey: O(N log N) — فرق تسد',theory3:'Split-Radix: O(N log N) — عمليات ضرب اقل',theory4:'النوافذ تقلل التسرب الطيفي',theory5:'حشو الاصفار يزيد دقة التردد',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',raceStarted:'🏁 بدا السباق!',raceComplete:'🏆 انتهى السباق!',resetDone:'↺ اعادة ضبط',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='fft-racing-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){const s=$(p),ov=$(o);if(s)s.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const s=$(p),ov=$(o);if(s)s.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),conts=document.querySelectorAll('.help-content');tabs.forEach(tab=>tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));conts.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');}));}

/* ═══════ SIGNAL GENERATION ═══════ */
function generateSignal(type,N){
  const buf=new Float32Array(N);
  for(let i=0;i<N;i++){
    const t=i/N;
    switch(type){
      case 'sine':buf[i]=Math.sin(2*Math.PI*5*t)+.5*Math.sin(2*Math.PI*13*t)+.3*Math.sin(2*Math.PI*27*t);break;
      case 'noise':buf[i]=Math.random()*2-1;break;
      case 'impulse':buf[i]=i===0?1:0;break;
      case 'chirp':buf[i]=Math.sin(2*Math.PI*(5+50*t)*t);break;
    }
  }
  return buf;
}

function applyWindow(buf,type){
  const N=buf.length,out=new Float32Array(N);
  for(let i=0;i<N;i++){
    let w=1;
    if(type==='hann')w=.5*(1-Math.cos(2*Math.PI*i/(N-1)));
    else if(type==='hamming')w=.54-.46*Math.cos(2*Math.PI*i/(N-1));
    else if(type==='blackman')w=.42-.5*Math.cos(2*Math.PI*i/(N-1))+.08*Math.cos(4*Math.PI*i/(N-1));
    out[i]=buf[i]*w;
  }
  return out;
}

/* ═══════ FFT ALGORITHMS ═══════ */
// Naive DFT O(N²)
function naiveDFT(re,im){
  const N=re.length;const outRe=new Float32Array(N),outIm=new Float32Array(N);
  for(let k=0;k<N;k++){
    for(let n=0;n<N;n++){
      const a=-2*Math.PI*k*n/N;
      outRe[k]+=re[n]*Math.cos(a)-im[n]*Math.sin(a);
      outIm[k]+=re[n]*Math.sin(a)+im[n]*Math.cos(a);
    }
  }
  return{re:outRe,im:outIm};
}

// Cooley-Tukey radix-2 DIT
function cooleyTukey(re,im){
  const N=re.length;
  if(N<=1)return{re:new Float32Array(re),im:new Float32Array(im)};
  // Bit reversal
  const outRe=new Float32Array(re),outIm=new Float32Array(im);
  let j=0;
  for(let i=0;i<N;i++){
    if(i<j){const tr=outRe[i];outRe[i]=outRe[j];outRe[j]=tr;const ti=outIm[i];outIm[i]=outIm[j];outIm[j]=ti;}
    let m=N>>1;while(m>=1&&j>=m){j-=m;m>>=1;}j+=m;
  }
  // Butterfly
  for(let len=2;len<=N;len<<=1){
    const half=len>>1;const wRe=Math.cos(-2*Math.PI/len),wIm=Math.sin(-2*Math.PI/len);
    for(let i=0;i<N;i+=len){
      let uRe=1,uIm=0;
      for(let k=0;k<half;k++){
        const tRe=uRe*outRe[i+k+half]-uIm*outIm[i+k+half];
        const tIm=uRe*outIm[i+k+half]+uIm*outRe[i+k+half];
        outRe[i+k+half]=outRe[i+k]-tRe;outIm[i+k+half]=outIm[i+k]-tIm;
        outRe[i+k]+=tRe;outIm[i+k]+=tIm;
        const newU=uRe*wRe-uIm*wIm;uIm=uRe*wIm+uIm*wRe;uRe=newU;
      }
    }
  }
  return{re:outRe,im:outIm};
}

// Split-Radix (simplified — uses same CT core with slight optimization)
function splitRadix(re,im){
  const N=re.length;
  const outRe=new Float32Array(re),outIm=new Float32Array(im);
  // Same bit reversal
  let j=0;
  for(let i=0;i<N;i++){
    if(i<j){const tr=outRe[i];outRe[i]=outRe[j];outRe[j]=tr;const ti=outIm[i];outIm[i]=outIm[j];outIm[j]=ti;}
    let m=N>>1;while(m>=1&&j>=m){j-=m;m>>=1;}j+=m;
  }
  // Butterfly with twiddle factor caching
  const twRe=new Float32Array(N/2),twIm=new Float32Array(N/2);
  for(let i=0;i<N/2;i++){twRe[i]=Math.cos(-2*Math.PI*i/N);twIm[i]=Math.sin(-2*Math.PI*i/N);}
  for(let len=2;len<=N;len<<=1){
    const half=len>>1;const step=N/len;
    for(let i=0;i<N;i+=len){
      for(let k=0;k<half;k++){
        const idx=k*step;
        const tRe=twRe[idx]*outRe[i+k+half]-twIm[idx]*outIm[i+k+half];
        const tIm=twRe[idx]*outIm[i+k+half]+twIm[idx]*outRe[i+k+half];
        outRe[i+k+half]=outRe[i+k]-tRe;outIm[i+k+half]=outIm[i+k]-tIm;
        outRe[i+k]+=tRe;outIm[i+k]+=tIm;
      }
    }
  }
  return{re:outRe,im:outIm};
}

function getMagnitude(res,N){
  const mag=new Float32Array(N/2);
  for(let i=0;i<N/2;i++)mag[i]=Math.sqrt(res.re[i]*res.re[i]+res.im[i]*res.im[i])/N;
  return mag;
}

/* ═══════ RACE & DRAWING ═══════ */
function runRace(){
  const N=+$('fftSize').value;
  const sigType=$('sigType').value;
  const winType=$('windowType').value;
  const iters=+$('iterSlider').value;

  log(LANG[currentLang].raceStarted,'info');
  showToast('Racing...');setStatus(true);

  const raw=generateSignal(sigType,N);
  const sig=applyWindow(raw,winType);
  const im=new Float32Array(N);

  // Benchmark DFT
  let t0=performance.now();
  let dftRes;
  for(let i=0;i<iters;i++)dftRes=naiveDFT(sig,im);
  const dftMs=performance.now()-t0;

  // Benchmark Cooley-Tukey
  t0=performance.now();
  let ctRes;
  for(let i=0;i<iters;i++)ctRes=cooleyTukey(sig,im);
  const ctMs=performance.now()-t0;

  // Benchmark Split-Radix
  t0=performance.now();
  let srRes;
  for(let i=0;i<iters;i++)srRes=splitRadix(sig,im);
  const srMs=performance.now()-t0;

  // Update results
  $('dftTime').textContent=dftMs.toFixed(2)+' ms';
  $('ctTime').textContent=ctMs.toFixed(2)+' ms';
  $('srTime').textContent=srMs.toFixed(2)+' ms';

  // Error
  let maxErr=0;
  for(let i=0;i<N;i++){
    const dr=Math.abs(dftRes.re[i]-ctRes.re[i]);
    const di=Math.abs(dftRes.im[i]-ctRes.im[i]);
    maxErr=Math.max(maxErr,dr,di);
  }
  $('errorVal').textContent=maxErr.toExponential(3);

  // Draw race bars
  drawRace(dftMs,ctMs,srMs);

  // Draw spectrum comparison
  const dftMag=getMagnitude(dftRes,N);
  const ctMag=getMagnitude(ctRes,N);
  drawSpecCompare(dftMag,ctMag,N);

  // Complexity chart
  drawComplexity();

  hideToast();
  log(`${LANG[currentLang].raceComplete} DFT=${dftMs.toFixed(1)}ms CT=${ctMs.toFixed(1)}ms SR=${srMs.toFixed(1)}ms`,'success');
}

function drawRace(dft,ct,sr){
  const c=$('raceCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  const maxT=Math.max(dft,ct,sr,1);
  const bars=[{name:'🐌 Naive DFT',t:dft,color:'#f44'},{name:'🚗 Cooley-Tukey',t:ct,color:'#4af'},{name:'🏎️ Split-Radix',t:sr,color:'#4f4'}];
  const barH=50,gap=20,startY=30;
  bars.forEach((b,i)=>{
    const y=startY+i*(barH+gap);
    const bw=(b.t/maxT)*(w-200);
    ctx.fillStyle=b.color+'33';ctx.fillRect(120,y,w-200,barH);
    ctx.fillStyle=b.color;
    // Animate-like fill
    ctx.fillRect(120,y,bw,barH);
    ctx.fillStyle='#fff';ctx.font='14px Orbitron,monospace';
    ctx.fillText(b.name,4,y+32);
    ctx.fillText(b.t.toFixed(1)+' ms',130+bw+8,y+32);
  });
  // Winner
  const winner=bars.reduce((a,b)=>a.t<b.t?a:b);
  ctx.fillStyle=winner.color;ctx.font='bold 16px Orbitron';
  ctx.fillText('🏆 Winner: '+winner.name,w/2-100,h-10);
}

function drawSpecCompare(dftMag,ctMag,N){
  const c=$('specCompare');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  const mx=Math.max(...dftMag)||1;
  // DFT result
  ctx.strokeStyle='#f44';ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<N/2;i++){const x=i/(N/2)*w,db=20*Math.log10(dftMag[i]/mx+1e-10),y=h-((db+60)/60)*h;if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));}
  ctx.stroke();
  // CT result (should overlap perfectly)
  ctx.strokeStyle='#4af';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();
  for(let i=0;i<N/2;i++){const x=i/(N/2)*w,db=20*Math.log10(ctMag[i]/mx+1e-10),y=h-((db+60)/60)*h;if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));}
  ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#f44';ctx.font='10px monospace';ctx.fillText('DFT',4,12);
  ctx.fillStyle='#4af';ctx.fillText('FFT (should overlap)',40,12);
}

function drawComplexity(){
  const c=$('complexityCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  const sizes=[16,32,64,128,256,512,1024,2048,4096];
  const maxOps=4096*4096;
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;
  for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(0,i/5*h);ctx.lineTo(w,i/5*h);ctx.stroke();}
  // O(N²) curve
  ctx.strokeStyle='#f44';ctx.lineWidth=2;ctx.beginPath();
  sizes.forEach((n,i)=>{const x=(i/(sizes.length-1))*w;const y=h-(n*n/maxOps)*h;if(i===0)ctx.moveTo(x,Math.max(0,y));else ctx.lineTo(x,Math.max(0,y));});
  ctx.stroke();
  // O(N log N) curve
  ctx.strokeStyle='#4f4';ctx.lineWidth=2;ctx.beginPath();
  sizes.forEach((n,i)=>{const x=(i/(sizes.length-1))*w;const y=h-(n*Math.log2(n)/maxOps)*h;if(i===0)ctx.moveTo(x,Math.max(0,y));else ctx.lineTo(x,Math.max(0,y));});
  ctx.stroke();
  ctx.fillStyle='#f44';ctx.font='10px monospace';ctx.fillText('O(N²) DFT',4,14);
  ctx.fillStyle='#4f4';ctx.fillText('O(N log N) FFT',4,28);
  ctx.fillStyle='#667';
  sizes.forEach((n,i)=>{const x=(i/(sizes.length-1))*w;ctx.fillText(n+'',x,h-4);});
}

function resetRace(){
  [$('raceCanvas'),$('specCompare'),$('complexityCanvas')].forEach(c=>{if(c)c.getContext('2d').clearRect(0,0,c.width,c.height);});
  $('dftTime').textContent='-- ms';$('ctTime').textContent='-- ms';$('srTime').textContent='-- ms';$('errorVal').textContent='--';
  setStatus(false);log(LANG[currentLang].resetDone,'info');
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hC=$('helpCloseBtn'),hO=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hC)hC.onclick=closeHelp;if(hO)hO.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sC=$('settingsCloseBtn'),sO=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sC)sC.onclick=closeSettings;if(sO)sO.onclick=closeSettings;
  const lBtn=$('logBtn'),lC=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lC)lC.onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const ls=$('langSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));
  const ts=$('themeSelect');if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initHijriDate();
  $('raceBtn').onclick=()=>setTimeout(runRace,50);
  $('resetBtn').onclick=resetRace;
  $('iterSlider').oninput=function(){$('iterVal').textContent=this.value;};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);
