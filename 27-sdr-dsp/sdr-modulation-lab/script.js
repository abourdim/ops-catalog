/**
 * SDR Modulation Lab — Workshop DIY v1.0
 * Explore AM, FM, SSB, PSK, QAM modulation with live constellation and spectrum
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M5 50 Q15 20 25 50 Q35 80 45 50 Q55 20 65 50 Q75 80 85 50 Q95 20 100 50" stroke="currentColor" fill="none" stroke-width="3"><animate attributeName="d" values="M5 50 Q15 20 25 50 Q35 80 45 50 Q55 20 65 50 Q75 80 85 50 Q95 20 100 50;M5 50 Q15 35 25 50 Q35 65 45 50 Q55 35 65 50 Q75 65 85 50 Q95 35 100 50;M5 50 Q15 20 25 50 Q35 80 45 50 Q55 20 65 50 Q75 80 85 50 Q95 20 100 50" dur="2s" repeatCount="indefinite"/></path></svg>`;
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25);}}

const LANG={
en:{title:'SDR Modulation Lab',subtitle:'📻 Modulation Lab — AM, FM, PSK, QAM and more',disconnected:'Disconnected',connected:'Connected',mainSection:'Modulation Lab',mainDesc:'Visualize analog and digital modulation schemes',sectionA:'Signal Metrics',sectionB:'Demodulation Test',sectionC:'Modulation Theory',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
faq_q1:'What is the Modulation Lab?',faq_a1:'An interactive tool to visualize analog and digital modulation schemes.',faq_q2:'What modulation types?',faq_a2:'AM, DSB-SC, SSB, FM, BPSK, QPSK, 16-QAM.',faq_q3:'What is a constellation diagram?',faq_a3:'Shows symbols as I/Q points. Spread = noise level.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',
howto_1:'Select a modulation type.',howto_2:'Adjust carrier freq and mod index.',howto_3:'Set SNR to add noise.',howto_4:'Click Start for live displays.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 built-in themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual with RTL.',
working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'📻 Modulation Lab ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
modType:'Modulation Type',carrFreq:'Carrier Freq (Hz)',modIdx:'Mod Index / Depth',snrCtrl:'SNR (dB)',startMod:'▶ Start',stopMod:'⏹ Stop',
berLabel:'BER:',evmLabel:'EVM:',bwOccLabel:'Bandwidth Occupied:',powerLabel:'Signal Power:',
demodDesc:'Demodulated baseband output shown above.',
theoryIntro:'Modulation encodes information onto a carrier wave:',theory1:'AM — amplitude varies with message',theory2:'FM — frequency varies with message',theory3:'SSB — single sideband for BW efficiency',theory4:'PSK — phase shifts encode digital bits',theory5:'QAM — combines amplitude and phase for high data rates',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',modStarted:'▶ Modulation running',modStopped:'⏹ Stopped',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configure SDR',step1Desc:'Set the center frequency, sample rate, and gain for the SDR receiver.',step2Title:'Capture Signal',step2Desc:'Raw I/Q samples are captured from the radio spectrum in real time.',step3Title:'Process & Filter',step3Desc:'Digital signal processing applies filters, FFT, and demodulation algorithms.',step4Title:'Visualize Output',step4Desc:'The processed signal is displayed as spectrum, waterfall, or decoded data.'},
fr:{title:'Labo Modulation SDR',subtitle:'📻 Labo Modulation — AM, FM, PSK, QAM et plus',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Labo Modulation',mainDesc:'Visualisez les schemas de modulation analogiques et numeriques',sectionA:'Metriques Signal',sectionB:'Test Demodulation',sectionC:'Theorie Modulation',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
faq_q1:'Qu\'est-ce que le Labo Modulation?',faq_a1:'Un outil interactif pour visualiser les modulations.',faq_q2:'Quels types de modulation?',faq_a2:'AM, DSB-SC, SSB, FM, BPSK, QPSK, 16-QAM.',faq_q3:'Qu\'est-ce qu\'un diagramme de constellation?',faq_a3:'Montre les symboles en I/Q. La dispersion indique le bruit.',faq_q4:'Mes donnees sont privees?',faq_a4:'Oui. Tout est local.',
howto_1:'Selectionnez un type de modulation.',howto_2:'Ajustez la porteuse et l\'indice.',howto_3:'Reglez le RSB pour ajouter du bruit.',howto_4:'Cliquez Demarrer pour les affichages en direct.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',
working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',ready:'📻 Labo Modulation pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
modType:'Type Modulation',carrFreq:'Freq Porteuse (Hz)',modIdx:'Indice Modulation',snrCtrl:'RSB (dB)',startMod:'▶ Demarrer',stopMod:'⏹ Arreter',
berLabel:'TEB:',evmLabel:'EVM:',bwOccLabel:'Bande Occupee:',powerLabel:'Puissance Signal:',
demodDesc:'Sortie bande de base demodule ci-dessus.',
theoryIntro:'La modulation encode l\'information sur une porteuse:',theory1:'AM — l\'amplitude varie avec le message',theory2:'FM — la frequence varie avec le message',theory3:'SSB — bande laterale unique pour l\'efficacite',theory4:'PSK — les sauts de phase encodent les bits',theory5:'QAM — combine amplitude et phase pour haut debit',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',modStarted:'▶ Modulation en cours',modStopped:'⏹ Arrete',
t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.'},
ar:{title:'مختبر التعديل SDR',subtitle:'📻 مختبر التعديل — AM، FM، PSK، QAM والمزيد',disconnected:'غير متصل',connected:'متصل',mainSection:'مختبر التعديل',mainDesc:'تصور مخططات التعديل التناظرية والرقمية',sectionA:'مقاييس الاشارة',sectionB:'اختبار ازالة التعديل',sectionC:'نظرية التعديل',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
faq_q1:'ما هو مختبر التعديل؟',faq_a1:'اداة تفاعلية لتصور مخططات التعديل.',faq_q2:'ما انواع التعديل؟',faq_a2:'AM، DSB-SC، SSB، FM، BPSK، QPSK، 16-QAM.',faq_q3:'ما هو مخطط الكوكبة؟',faq_a3:'يظهر الرموز كنقاط I/Q. الانتشار يشير للضوضاء.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء محلي.',
howto_1:'اختر نوع التعديل.',howto_2:'اضبط تردد الحامل ومعامل التعديل.',howto_3:'اضبط نسبة الاشارة للضوضاء.',howto_4:'اضغط ابدا للعرض المباشر.',
wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'📻 مختبر التعديل جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',
modType:'نوع التعديل',carrFreq:'تردد الحامل (هرتز)',modIdx:'معامل التعديل',snrCtrl:'نسبة الاشارة للضوضاء (ديسيبل)',startMod:'▶ ابدا',stopMod:'⏹ ايقاف',
berLabel:'معدل خطا البت:',evmLabel:'EVM:',bwOccLabel:'عرض النطاق المشغول:',powerLabel:'قدرة الاشارة:',
demodDesc:'خرج النطاق الاساسي المزال تعديله.',
theoryIntro:'التعديل يشفر المعلومات على موجة حاملة:',theory1:'AM — السعة تتغير مع الرسالة',theory2:'FM — التردد يتغير مع الرسالة',theory3:'SSB — نطاق جانبي واحد لكفاءة النطاق',theory4:'PSK — قفزات الطور تشفر البتات',theory5:'QAM — يجمع السعة والطور لمعدلات بيانات عالية',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',modStarted:'▶ التعديل يعمل',modStopped:'⏹ متوقف',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='modulation-lab-log.txt';a.click();URL.revokeObjectURL(u);}
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

/* ═══════ MODULATION SIMULATION ═══════ */
let running=false,animFrame=null;
const SR=8192,N=1024;
let phase=0,symIdx=0;

function addNoise(buf,snrDb){
  const sigPow=buf.reduce((a,v)=>a+v*v,0)/buf.length;
  const noisePow=sigPow/Math.pow(10,snrDb/10);
  const std=Math.sqrt(noisePow);
  for(let i=0;i<buf.length;i++)buf[i]+=std*(Math.random()+Math.random()+Math.random()+Math.random()-2)*0.7;
  return buf;
}

function modulate(type,fc,modIdx,snrDb){
  const buf=new Float32Array(N);
  const dt=1/SR;
  const m=modIdx/100;
  const msgFreq=fc/10;
  // Generate random bits for digital
  const bits=[];for(let i=0;i<64;i++)bits.push(Math.random()>0.5?1:0);
  const constPts=[];

  for(let i=0;i<N;i++){
    const t=i*dt;
    switch(type){
      case 'am':
        buf[i]=(1+m*Math.sin(2*Math.PI*msgFreq*t))*Math.cos(2*Math.PI*fc*t);break;
      case 'dsb':
        buf[i]=m*Math.sin(2*Math.PI*msgFreq*t)*Math.cos(2*Math.PI*fc*t);break;
      case 'ssb':{
        const msg=Math.sin(2*Math.PI*msgFreq*t);
        const hilbert=Math.cos(2*Math.PI*msgFreq*t);
        buf[i]=msg*Math.cos(2*Math.PI*fc*t)-hilbert*Math.sin(2*Math.PI*fc*t);break;}
      case 'fm':
        phase+=2*Math.PI*fc*dt+m*5*Math.sin(2*Math.PI*msgFreq*t)*dt;
        buf[i]=Math.cos(phase);break;
      case 'bpsk':{
        const bitIdx=Math.floor(i/(N/bits.length))%bits.length;
        const sym=bits[bitIdx]*2-1;
        buf[i]=sym*Math.cos(2*Math.PI*fc*t);
        if(i%(N/bits.length)===0)constPts.push({i:sym,q:0});break;}
      case 'qpsk':{
        const si=Math.floor(i/(N/32))%32;
        const b0=bits[si*2%bits.length]*2-1,b1=bits[(si*2+1)%bits.length]*2-1;
        buf[i]=(b0*Math.cos(2*Math.PI*fc*t)-b1*Math.sin(2*Math.PI*fc*t))/Math.SQRT2;
        if(i%(N/32)===0)constPts.push({i:b0/Math.SQRT2,q:b1/Math.SQRT2});break;}
      case 'qam16':{
        const si2=Math.floor(i/(N/16))%16;
        const bitsI=((si2>>2)&3)*2-3;
        const bitsQ=(si2&3)*2-3;
        buf[i]=(bitsI*Math.cos(2*Math.PI*fc*t)-bitsQ*Math.sin(2*Math.PI*fc*t))/3;
        if(i%(N/16)===0)constPts.push({i:bitsI/3,q:bitsQ/3});break;}
    }
  }
  addNoise(buf,snrDb);
  // Add noise to constellation
  const nStd=0.1*Math.pow(10,-snrDb/20);
  constPts.forEach(p=>{p.i+=(Math.random()-.5)*nStd*2;p.q+=(Math.random()-.5)*nStd*2;});
  return {buf,constPts};
}

function computeSpectrum(buf){
  const mag=new Float32Array(N/2);
  for(let k=0;k<N/2;k++){
    let re=0,im=0;
    for(let n=0;n<N;n++){const a=-2*Math.PI*k*n/N;re+=buf[n]*Math.cos(a);im+=buf[n]*Math.sin(a);}
    mag[k]=Math.sqrt(re*re+im*im)/N;
  }
  return mag;
}

function drawTime(buf){
  const c=$('timeCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  const show=Math.min(512,buf.length);
  for(let i=0;i<show;i++){const x=i/show*w,y=h/2-buf[i]*h*.4;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.stroke();
  ctx.fillStyle='#667';ctx.font='10px Orbitron,monospace';ctx.fillText('Time Domain',4,12);
}

function drawSpectrum(mag){
  const c=$('specCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;
  for(let i=1;i<5;i++){const y=i/5*h;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  const mx=Math.max(...mag)||1;
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<mag.length;i++){const x=i/mag.length*w,db=20*Math.log10(mag[i]/mx+1e-10),y=h-((db+60)/60)*h;if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));}
  ctx.stroke();
  ctx.fillStyle='#667';ctx.font='10px Orbitron,monospace';ctx.fillText('Spectrum',4,12);ctx.fillText('0 Hz',4,h-4);ctx.fillText((SR/2)+' Hz',w-60,h-4);
}

function drawConstellation(pts){
  const c=$('constCanvas');if(!c)return;const ctx=c.getContext('2d'),s=c.width,cx=s/2,cy=s/2,r=s/2-20;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,s,s);
  ctx.strokeStyle='#223';ctx.lineWidth=.5;
  ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(s,cy);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,0);ctx.lineTo(cx,s);ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,r*.7,0,2*Math.PI);ctx.stroke();
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  pts.forEach(p=>{
    const px=cx+p.i*r*1.2,py=cy-p.q*r*1.2;
    ctx.fillStyle=accent;ctx.globalAlpha=.7;ctx.beginPath();ctx.arc(px,py,3,0,2*Math.PI);ctx.fill();
  });
  ctx.globalAlpha=1;ctx.fillStyle='#667';ctx.font='10px monospace';
  ctx.fillText('I',s-14,cy-4);ctx.fillText('Q',cx+4,12);ctx.fillText('Constellation',4,12);
}

function demodulate(buf,type,fc){
  const out=new Float32Array(buf.length);
  const dt=1/SR;
  if(type==='am'){
    // Envelope detection
    for(let i=0;i<buf.length;i++)out[i]=Math.abs(buf[i]);
    // Simple LP filter
    for(let i=1;i<buf.length;i++)out[i]=out[i-1]+.05*(out[i]-out[i-1]);
  }else if(type==='fm'){
    for(let i=1;i<buf.length;i++){
      const p1=Math.atan2(buf[i]*Math.sin(2*Math.PI*fc*i*dt),buf[i]*Math.cos(2*Math.PI*fc*i*dt));
      const p0=Math.atan2(buf[i-1]*Math.sin(2*Math.PI*fc*(i-1)*dt),buf[i-1]*Math.cos(2*Math.PI*fc*(i-1)*dt));
      let dp=p1-p0;if(dp>Math.PI)dp-=2*Math.PI;if(dp<-Math.PI)dp+=2*Math.PI;
      out[i]=dp;
    }
  }else{
    // Coherent demod
    for(let i=0;i<buf.length;i++)out[i]=buf[i]*Math.cos(2*Math.PI*fc*i*dt)*2;
    // LP filter
    for(let i=1;i<buf.length;i++)out[i]=out[i-1]+.02*(out[i]-out[i-1]);
  }
  return out;
}

function drawDemod(buf){
  const c=$('demodCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
  ctx.strokeStyle='#4a4';ctx.lineWidth=1.5;ctx.beginPath();
  const show=Math.min(512,buf.length);
  for(let i=0;i<show;i++){const x=i/show*w,y=h/2-buf[i]*h*.3;if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));}
  ctx.stroke();
  ctx.fillStyle='#4a4';ctx.font='10px monospace';ctx.fillText('Demodulated',4,12);
}

function updateMetrics(mag,constPts,snrDb){
  // BER estimate (simplified)
  const ber=type==='bpsk'||type==='qpsk'||type==='qam16'?(.5*Math.exp(-snrDb/4)).toExponential(2):'N/A';
  $('berVal').textContent=ber;
  // EVM
  if(constPts.length>0){
    let evm=0;constPts.forEach(p=>{const d=Math.sqrt(p.i*p.i+p.q*p.q);evm+=(d-1)*(d-1);});
    evm=Math.sqrt(evm/constPts.length)*100;
    $('evmVal').textContent=evm.toFixed(1)+'%';
  }else $('evmVal').textContent='N/A';
  // BW
  const mx=Math.max(...mag)||1;let lo=0,hi=mag.length-1;
  for(let i=0;i<mag.length;i++){if(mag[i]>mx*.1){lo=i;break;}}
  for(let i=mag.length-1;i>=0;i--){if(mag[i]>mx*.1){hi=i;break;}}
  $('bwOccVal').textContent=(((hi-lo)/mag.length)*(SR/2)).toFixed(0)+' Hz';
  // Power
  let pw=0;for(let i=0;i<mag.length;i++)pw+=mag[i]*mag[i];
  $('powerVal').textContent=(10*Math.log10(pw+1e-20)).toFixed(1)+' dBm';
}

let type='am';
function simLoop(){
  if(!running)return;
  type=$('modType').value;
  const fc=+$('carrSlider').value,mi=+$('modSlider').value,snr=+$('snrSlider').value;
  const {buf,constPts}=modulate(type,fc,mi,snr);
  drawTime(buf);
  const mag=computeSpectrum(buf);
  drawSpectrum(mag);
  drawConstellation(constPts);
  const demod=demodulate(buf,type,fc);
  drawDemod(demod);
  updateMetrics(mag,constPts,snr);
  animFrame=requestAnimationFrame(simLoop);
}

function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].modStarted,'success');simLoop();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].modStopped,'info');}

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
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  $('carrSlider').oninput=function(){$('carrVal').textContent=this.value+' Hz';};
  $('modSlider').oninput=function(){$('modVal').textContent=this.value+'%';};
  $('snrSlider').oninput=function(){$('snrVal').textContent=this.value+' dB';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Modulation Lab
   Animated carrier + message + modulated waveform overlay
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
function boot(){
  let el=document.getElementById('modLabSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='modLabSimCanvas';el.width=780;el.height=180;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060a14;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.02;cx.fillStyle='#060a14';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  const third=H/3;
  // Message signal
  cx.strokeStyle='#4fc3f7';cx.lineWidth=1;cx.beginPath();
  for(let i=0;i<W;i++){const x=i,tt=i/W+t;cx.lineTo(x,third*.5-Math.sin(tt*8)*third*.3);} cx.stroke();
  cx.fillStyle='rgba(79,195,247,.4)';cx.font='8px monospace';cx.fillText('Message',4,12);
  // Carrier
  cx.strokeStyle='rgba(255,255,255,.15)';cx.lineWidth=.5;cx.beginPath();
  for(let i=0;i<W;i++){const x=i,tt=i/W+t;cx.lineTo(x,third+third*.5-Math.sin(tt*60)*third*.3);} cx.stroke();
  cx.fillStyle='rgba(255,255,255,.3)';cx.font='8px monospace';cx.fillText('Carrier',4,third+12);
  // AM Modulated
  cx.strokeStyle=acc;cx.lineWidth=1.5;cx.beginPath();
  for(let i=0;i<W;i++){
    const x=i,tt=i/W+t;
    const msg=.5+.5*Math.sin(tt*8);const y=2*third+third*.5-msg*Math.sin(tt*60)*third*.35;
    if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
  }
  cx.stroke();
  // Envelope
  cx.strokeStyle=acc+'44';cx.lineWidth=1;cx.setLineDash([3,3]);cx.beginPath();
  for(let i=0;i<W;i++){const x=i,tt=i/W+t;const msg=.5+.5*Math.sin(tt*8);cx.lineTo(x,2*third+third*.5-msg*third*.35);}
  cx.stroke();cx.setLineDash([]);
  cx.fillStyle=acc+'88';cx.font='8px monospace';cx.fillText('AM Output',4,2*third+12);
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='right';
  cx.fillText('Modulation Breakdown',W-8,14);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
})();
