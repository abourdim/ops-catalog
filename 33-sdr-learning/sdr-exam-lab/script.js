/**
 * SDR Exam Lab — Workshop DIY v1.0
 * SDR certification exam prep with interactive quizzes and signal visualization.
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="60" width="8" height="30" rx="2" fill="currentColor" opacity=".7"><animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite"/><animate attributeName="y" values="60;80;60" dur="1s" repeatCount="indefinite"/></rect><rect x="25" y="40" width="8" height="50" rx="2" fill="currentColor" opacity=".8"><animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite"/><animate attributeName="y" values="40;70;40" dur="1.2s" repeatCount="indefinite"/></rect><rect x="40" y="20" width="8" height="70" rx="2" fill="currentColor"><animate attributeName="height" values="70;30;70" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="20;60;20" dur="0.8s" repeatCount="indefinite"/></rect><rect x="55" y="35" width="8" height="55" rx="2" fill="currentColor" opacity=".85"><animate attributeName="height" values="55;15;55" dur="1.1s" repeatCount="indefinite"/><animate attributeName="y" values="35;75;35" dur="1.1s" repeatCount="indefinite"/></rect><rect x="70" y="50" width="8" height="40" rx="2" fill="currentColor" opacity=".75"><animate attributeName="height" values="40;10;40" dur="0.9s" repeatCount="indefinite"/><animate attributeName="y" values="50;80;50" dur="0.9s" repeatCount="indefinite"/></rect><rect x="85" y="55" width="8" height="35" rx="2" fill="currentColor" opacity=".6"><animate attributeName="height" values="35;5;35" dur="1.3s" repeatCount="indefinite"/><animate attributeName="y" values="55;85;55" dur="1.3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,t+.08);o.start(t);o.stop(t+.08);}else if(type==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,t+.3);o.start(t);o.stop(t+.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+.25);o.start(t);o.stop(t+.25);}}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title:'SDR Exam Lab',subtitle:'SDR Certification Exam Prep',
    disconnected:'Ready',connected:'Exam Active',
    mainSection:'Exam Questions',mainDesc:'Test your SDR & RF knowledge',
    sectionA:'Score & Progress',sectionB:'Study Guide',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',
    settings:'Settings',language:'Language',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    faq_q1:'What is SDR Exam Lab?',faq_a1:'Interactive SDR certification exam prep with signal visualizations.',
    faq_q2:'How does scoring work?',faq_a2:'Each correct answer scores a point. Track streaks for bonus motivation.',
    faq_q3:'Are questions random?',faq_a3:'Yes, questions are randomly selected from each category pool.',
    faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',
    howto_1:'Select a category to focus on.',howto_2:'Read the question and click an answer.',
    howto_3:'Check the signal canvas for visual hints.',howto_4:'Review your score and progress chart.',
    wiki_themes_title:'Themes',wiki_themes:'8 built-in themes.',
    wiki_i18n_title:'Languages',wiki_i18n:'Trilingual: EN, FR, AR with RTL.',
    working:'Working...',filterAll:'All',soundEffects:'Sound effects',
    ready:'Exam Lab ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    categoryLabel:'Category',nextQ:'Next Question',resetExam:'Reset Exam',
    totalQ:'Questions:',correctQ:'Correct:',scorePercent:'Score:',streak:'Streak:',
    studyIntro:'Key topics for SDR certification:',
    study1:'RF propagation, wavelength, and frequency relationships',
    study2:'Sampling theorem and ADC resolution requirements',
    study3:'Filter types: FIR vs IIR, passband specifications',
    study4:'AM, FM, SSB, PSK, QAM modulation schemes',
    study5:'Antenna gain, impedance matching, SWR',
    correct:'Correct!',incorrect:'Incorrect.',
    splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Configure SDR',step1Desc:'Set the center frequency, sample rate, and gain for the SDR receiver.',step2Title:'Capture Signal',step2Desc:'Raw I/Q samples are captured from the radio spectrum in real time.',step3Title:'Process & Filter',step3Desc:'Digital signal processing applies filters, FFT, and demodulation algorithms.',step4Title:'Visualize Output',step4Desc:'The processed signal is displayed as spectrum, waterfall, or decoded data.',sectionCode:'Device Code'},
  fr: {
    title:'Labo Examen SDR',subtitle:'Preparation examen certification SDR',
    disconnected:'Pret',connected:'Examen actif',
    mainSection:'Questions d\'examen',mainDesc:'Testez vos connaissances SDR & RF',
    sectionA:'Score & Progression',sectionB:'Guide d\'etude',
    activityLog:'Journal',eventsMsg:'Evenements',
    clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',
    settings:'Parametres',language:'Langue',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    faq_q1:'Qu\'est-ce que le Labo Examen?',faq_a1:'Preparation interactive a la certification SDR.',
    faq_q2:'Comment fonctionne le score?',faq_a2:'Chaque bonne reponse donne un point.',
    faq_q3:'Les questions sont aleatoires?',faq_a3:'Oui, selectionnees dans chaque categorie.',
    faq_q4:'Mes donnees sont privees?',faq_a4:'Oui. Tout est local.',
    howto_1:'Selectionnez une categorie.',howto_2:'Lisez et repondez.',
    howto_3:'Consultez le canvas pour des indices visuels.',howto_4:'Consultez votre score.',
    wiki_themes_title:'Themes',wiki_themes:'8 themes integres.',
    wiki_i18n_title:'Langues',wiki_i18n:'Trilingue avec RTL.',
    working:'En cours...',filterAll:'Tout',soundEffects:'Effets sonores',
    ready:'Labo Examen pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
    categoryLabel:'Categorie',nextQ:'Question suivante',resetExam:'Reinitialiser',
    totalQ:'Questions:',correctQ:'Correct:',scorePercent:'Score:',streak:'Serie:',
    studyIntro:'Sujets cles pour la certification SDR:',
    study1:'Propagation RF, longueur d\'onde et frequence',
    study2:'Theoreme d\'echantillonnage et resolution ADC',
    study3:'Types de filtres: FIR vs IIR',
    study4:'Schemas de modulation AM, FM, SSB, PSK, QAM',
    study5:'Gain d\'antenne, adaptation d\'impedance, ROS',
    correct:'Correct!',incorrect:'Incorrect.',
    splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.',sectionCode:'Code Appareil'},
  ar: {
    title:'مختبر امتحان SDR',subtitle:'تحضير امتحان شهادة SDR',
    disconnected:'جاهز',connected:'الامتحان نشط',
    mainSection:'اسئلة الامتحان',mainDesc:'اختبر معرفتك بـ SDR و RF',
    sectionA:'النتيجة والتقدم',sectionB:'دليل الدراسة',
    activityLog:'سجل النشاط',eventsMsg:'الاحداث',
    clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',
    settings:'الاعدادات',language:'اللغة',
    help:'مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
    faq_q1:'ما هو مختبر الامتحان؟',faq_a1:'تحضير تفاعلي لامتحان شهادة SDR.',
    faq_q2:'كيف يعمل النظام؟',faq_a2:'كل اجابة صحيحة تعطي نقطة.',
    faq_q3:'هل الاسئلة عشوائية؟',faq_a3:'نعم، يتم اختيارها عشوائيا.',
    faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء محلي.',
    howto_1:'اختر فئة.',howto_2:'اقرا واجب.',
    howto_3:'راجع الرسم للحصول على تلميحات.',howto_4:'راجع نتيجتك.',
    wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر مدمجة.',
    wiki_i18n_title:'اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
    working:'جارٍ...',filterAll:'الكل',soundEffects:'مؤثرات صوتية',
    ready:'مختبر الامتحان جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',
    categoryLabel:'الفئة',nextQ:'السؤال التالي',resetExam:'اعادة الامتحان',
    totalQ:'الاسئلة:',correctQ:'صحيح:',scorePercent:'النتيجة:',streak:'سلسلة:',
    studyIntro:'مواضيع رئيسية لشهادة SDR:',
    study1:'انتشار RF والطول الموجي والتردد',
    study2:'نظرية العينات ودقة ADC',
    study3:'انواع المرشحات: FIR مقابل IIR',
    study4:'انظمة التضمين AM, FM, SSB, PSK, QAM',
    study5:'كسب الهوائي ومطابقة المعاوقة',
    correct:'صحيح!',incorrect:'خطا.',
    splashHint:'انقر للتخطي',langChanged:'اللغة: العربية',themeChanged:'المظهر:',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'
  ,step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.',sectionCode:'كود الجهاز'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='exam-lab-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
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

/* ═══════ EXAM SIMULATION ═══════ */
const QUESTIONS = {
  rf: [
    {q:'What is the speed of electromagnetic waves in vacuum?',a:['3x10^8 m/s','3x10^6 m/s','3x10^10 m/s','3x10^4 m/s'],c:0,sig:'sine'},
    {q:'Wavelength of a 100 MHz signal?',a:['3 meters','30 meters','0.3 meters','300 meters'],c:0,sig:'sine'},
    {q:'What does dBm measure?',a:['Power relative to 1 mW','Voltage gain','Current ratio','Frequency offset'],c:0,sig:'noise'},
    {q:'Free-space path loss increases with?',a:['Both frequency and distance','Only distance','Only frequency','Neither'],c:0,sig:'chirp'},
    {q:'What is the impedance of most RF systems?',a:['50 ohms','75 ohms','100 ohms','25 ohms'],c:0,sig:'square'},
  ],
  dsp: [
    {q:'Nyquist rate for a 4 kHz signal?',a:['8 kHz','4 kHz','16 kHz','2 kHz'],c:0,sig:'sine'},
    {q:'What does FFT compute?',a:['Frequency spectrum','Time delay','Phase noise','Bit error rate'],c:0,sig:'noise'},
    {q:'FIR filters are always?',a:['Stable','Unstable','Recursive','Non-linear'],c:0,sig:'square'},
    {q:'Windowing in FFT reduces?',a:['Spectral leakage','Sampling rate','Noise floor','Gain'],c:0,sig:'chirp'},
    {q:'A low-pass filter removes?',a:['High frequencies','Low frequencies','All frequencies','DC offset'],c:0,sig:'sine'},
  ],
  mod: [
    {q:'AM stands for?',a:['Amplitude Modulation','Angular Modulation','Adaptive Mixing','Analog Multiplexing'],c:0,sig:'am'},
    {q:'FM has better noise immunity than AM because?',a:['Information is in frequency changes','It uses more bandwidth','It has higher power','It uses digital encoding'],c:0,sig:'fm'},
    {q:'SSB saves bandwidth by removing?',a:['One sideband and carrier','Both sidebands','The carrier only','The baseband'],c:0,sig:'sine'},
    {q:'QAM modulates both?',a:['Amplitude and phase','Frequency and phase','Amplitude and frequency','Phase and time'],c:0,sig:'noise'},
    {q:'BPSK uses how many phase states?',a:['2','4','8','16'],c:0,sig:'square'},
  ],
  ant: [
    {q:'A dipole antenna is how long at resonance?',a:['Half wavelength','Full wavelength','Quarter wavelength','Two wavelengths'],c:0,sig:'sine'},
    {q:'Antenna gain is measured in?',a:['dBi or dBd','Watts','Ohms','Hertz'],c:0,sig:'chirp'},
    {q:'SWR of 1:1 means?',a:['Perfect match','Total reflection','No signal','Short circuit'],c:0,sig:'square'},
    {q:'A Yagi antenna is?',a:['Directional','Omnidirectional','Isotropic','Parabolic'],c:0,sig:'noise'},
    {q:'Ground plane antennas are typically?',a:['Quarter wave vertical','Full wave loop','Half wave dipole','Helical'],c:0,sig:'sine'},
  ],
  reg: [
    {q:'ISM band at 2.4 GHz is used by?',a:['WiFi, Bluetooth, microwave ovens','Only WiFi','Only Bluetooth','Only radar'],c:0,sig:'noise'},
    {q:'Amateur radio requires?',a:['A license','No license','Only registration','Only an antenna'],c:0,sig:'sine'},
    {q:'Maximum power for Part 15 devices?',a:['1 watt EIRP','100 watts','10 watts','No limit'],c:0,sig:'square'},
    {q:'ITU stands for?',a:['International Telecommunication Union','Internet Technology Unit','Integrated Transmission Utility','Internal Tech Union'],c:0,sig:'chirp'},
    {q:'Spurious emissions must be?',a:['Below regulatory limits','Eliminated entirely','Above noise floor','Equal to carrier'],c:0,sig:'noise'},
  ]
};

let totalAnswered=0, correctCount=0, streak=0, maxStreak=0;
const scoreHistory=[];
let currentQuestion=null, answered=false;

function pickQuestion(){
  const cat = $('categorySelect').value;
  const pool = QUESTIONS[cat];
  const idx = Math.floor(Math.random()*pool.length);
  return {...pool[idx], cat};
}

function drawExamSignal(sigType){
  const c=$('examCanvas');if(!c)return;
  const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=0.5;
  for(let i=0;i<8;i++){ctx.beginPath();ctx.moveTo(0,i*h/8);ctx.lineTo(w,i*h/8);ctx.stroke();}
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
  const freq=sigType==='chirp'?0.02:0.05;
  for(let i=0;i<w;i++){
    const t=i/w;let y;
    if(sigType==='sine')y=Math.sin(2*Math.PI*t*20);
    else if(sigType==='square')y=Math.sign(Math.sin(2*Math.PI*t*15));
    else if(sigType==='noise')y=(Math.random()-0.5)*2;
    else if(sigType==='chirp')y=Math.sin(2*Math.PI*(5+30*t)*t);
    else if(sigType==='am')y=Math.sin(2*Math.PI*t*25)*(0.5+0.5*Math.sin(2*Math.PI*t*3));
    else if(sigType==='fm')y=Math.sin(2*Math.PI*t*20+5*Math.sin(2*Math.PI*t*3));
    else y=Math.sin(2*Math.PI*t*20);
    const py=h/2-y*(h/2)*0.8;
    if(i===0)ctx.moveTo(0,py);else ctx.lineTo(i,py);
  }
  ctx.stroke();
  ctx.fillStyle='#8899aa';ctx.font='10px Orbitron,monospace';
  ctx.fillText(sigType.toUpperCase()+' signal',8,16);
}

function drawScoreChart(){
  const c=$('scoreChart');if(!c)return;
  const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  if(scoreHistory.length<2)return;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
  for(let i=0;i<scoreHistory.length;i++){
    const x=i/(scoreHistory.length-1)*w;
    const y=h-(scoreHistory[i]/100)*h;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.stroke();
  for(let i=0;i<scoreHistory.length;i++){
    const x=i/(scoreHistory.length-1)*w;
    const y=h-(scoreHistory[i]/100)*h;
    ctx.fillStyle=accent;ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();
  }
  ctx.fillStyle='#556';ctx.font='10px Orbitron,monospace';
  ctx.fillText('Score over time',8,14);
}

function showQuestion(){
  answered=false;
  currentQuestion=pickQuestion();
  $('questionText').textContent=currentQuestion.q;
  const ab=$('answersBox');ab.innerHTML='';
  const fb=$('feedbackBox');fb.style.display='none';
  currentQuestion.a.forEach((ans,i)=>{
    const btn=document.createElement('button');
    btn.className='btn-sm';btn.style.cssText='display:block;width:100%;text-align:left;margin:4px 0;padding:8px 12px;';
    btn.textContent=String.fromCharCode(65+i)+'. '+ans;
    btn.onclick=()=>checkAnswer(i);
    ab.appendChild(btn);
  });
  drawExamSignal(currentQuestion.sig);
  setStatus(true);
}

function checkAnswer(idx){
  if(answered)return;
  answered=true;
  const fb=$('feedbackBox');fb.style.display='block';
  const correct=idx===currentQuestion.c;
  totalAnswered++;
  if(correct){
    correctCount++;streak++;if(streak>maxStreak)maxStreak=streak;
    fb.textContent=LANG[currentLang].correct;fb.style.color='#4f4';
    log(LANG[currentLang].correct+' ('+currentQuestion.a[currentQuestion.c]+')','success');
  } else {
    streak=0;
    fb.textContent=LANG[currentLang].incorrect+' '+currentQuestion.a[currentQuestion.c];
    fb.style.color='#f44';
    log(LANG[currentLang].incorrect+' -> '+currentQuestion.a[currentQuestion.c],'error');
  }
  const pct=totalAnswered>0?Math.round(correctCount/totalAnswered*100):0;
  scoreHistory.push(pct);
  $('totalQVal').textContent=totalAnswered;
  $('correctQVal').textContent=correctCount;
  $('scoreVal').textContent=pct+'%';
  $('streakVal').textContent=streak;
  drawScoreChart();
  const btns=$('answersBox').querySelectorAll('button');
  btns.forEach((b,i)=>{
    b.style.opacity=i===currentQuestion.c?'1':'0.4';
    if(i===currentQuestion.c)b.style.background='rgba(0,200,0,0.2)';
    if(i===idx&&!correct)b.style.background='rgba(200,0,0,0.2)';
  });
}

function resetExam(){
  totalAnswered=0;correctCount=0;streak=0;maxStreak=0;scoreHistory.length=0;
  $('totalQVal').textContent='0';$('correctQVal').textContent='0';
  $('scoreVal').textContent='0%';$('streakVal').textContent='0';
  const c=$('scoreChart');if(c)c.getContext('2d').clearRect(0,0,c.width,c.height);
  const ec=$('examCanvas');if(ec)ec.getContext('2d').clearRect(0,0,ec.width,ec.height);
  setStatus(false);
  $('questionText').textContent='';$('answersBox').innerHTML='';$('feedbackBox').style.display='none';
  log('Exam reset','info');
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
  $('nextBtn').onclick=showQuestion;
  $('resetBtn').onclick=resetExam;
  showQuestion();
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Exam Lab
   Animated knowledge tree + progress visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;const nodes=[];
function boot(){
  let el=document.getElementById('examSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='examSimCanvas';el.width=780;el.height=180;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  const topics=['RF Basics','Modulation','Propagation','Antenna','Circuits','Regulations','Safety','Digital'];
  topics.forEach((t,i)=>nodes.push({x:60+i*90,y:H/2+Math.sin(i*.8)*30,label:t,r:20,active:false,pulse:0}));
}
function tick(){
  t+=.02;cx.fillStyle='#060810';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Connections between nodes
  for(let i=0;i<nodes.length-1;i++){
    cx.strokeStyle='rgba(100,200,255,.1)';cx.lineWidth=1;
    cx.beginPath();cx.moveTo(nodes[i].x,nodes[i].y);cx.lineTo(nodes[i+1].x,nodes[i+1].y);cx.stroke();
    const dot=(t*30+i*15)%(Math.hypot(nodes[i+1].x-nodes[i].x,nodes[i+1].y-nodes[i].y));
    const ratio=dot/Math.hypot(nodes[i+1].x-nodes[i].x,nodes[i+1].y-nodes[i].y);
    const dx=nodes[i].x+(nodes[i+1].x-nodes[i].x)*ratio;
    const dy=nodes[i].y+(nodes[i+1].y-nodes[i].y)*ratio;
    cx.fillStyle=acc;cx.beginPath();cx.arc(dx,dy,2,0,Math.PI*2);cx.fill();
  }
  // Nodes
  const currentQ=typeof questionNum!=='undefined'?questionNum:0;
  nodes.forEach((n,i)=>{
    const active=i<=currentQ;n.pulse+=.05;
    cx.beginPath();cx.arc(n.x,n.y,n.r,0,Math.PI*2);
    cx.fillStyle=active?'rgba(34,197,94,.15)':'rgba(100,200,255,.05)';cx.fill();
    cx.strokeStyle=active?'#22c55e':'rgba(100,200,255,.15)';cx.lineWidth=active?2:1;cx.stroke();
    if(active&&i===currentQ){
      cx.strokeStyle=acc+'44';cx.lineWidth=1;
      cx.beginPath();cx.arc(n.x,n.y,n.r+5+Math.sin(n.pulse)*3,0,Math.PI*2);cx.stroke();
    }
    cx.fillStyle=active?'#fff':'rgba(200,230,255,.4)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText(n.label,n.x,n.y+3);
  });
  // Progress bar
  const progress=typeof correctCount!=='undefined'&&typeof totalQuestions!=='undefined'?correctCount/Math.max(1,totalQuestions):0;
  cx.fillStyle='rgba(255,255,255,.05)';cx.fillRect(20,H-18,W-40,8);
  cx.fillStyle='#22c55e';cx.fillRect(20,H-18,(W-40)*progress,8);
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Knowledge Tree — Exam Progress',8,14);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
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
