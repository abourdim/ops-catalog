/**
 * SDR Build Receiver — Workshop DIY v1.0
 * Build a software receiver from scratch. Step-by-step DSP pipeline visualization.
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
    title:'SDR Build Receiver',subtitle:'Build a Software Receiver from Scratch',
    disconnected:'Disconnected',connected:'Running',
    mainSection:'Receiver Pipeline',mainDesc:'Step-by-step DSP: antenna to audio output',
    sectionA:'Signal Metrics',sectionB:'Receiver Theory',sectionC:'Build Progress',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',
    settings:'Settings',language:'Language',
    help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    faq_q1:'What is Build Receiver?',faq_a1:'An interactive tool to learn receiver design step by step.',
    faq_q2:'How do I start?',faq_a2:'Select a pipeline step, adjust parameters, then click Start.',
    faq_q3:'What modulations are supported?',faq_a3:'AM, FM, and SSB demodulation with visual pipeline.',
    faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser.',
    howto_1:'Select a pipeline step to visualize that receiver stage.',
    howto_2:'Adjust carrier frequency and noise level.',
    howto_3:'Click Start to see live signal processing at each stage.',
    howto_4:'Explore all 6 steps to complete your receiver build.',
    wiki_themes_title:'Themes',wiki_themes:'8 built-in themes with Islamic art inspiration.',
    wiki_i18n_title:'Languages',wiki_i18n:'Trilingual: English, Francais, Arabic with RTL.',
    working:'Working...',filterAll:'All',soundEffects:'Sound effects',
    ready:'Receiver builder ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    stepLabel:'Pipeline Step',freqLabel:'Carrier Frequency (Hz)',modType:'Modulation',
    noiseLabel:'Noise Level',
    step0:'1. Antenna Input',step1:'2. RF Amplifier',step2:'3. Mixer / Down-converter',
    step3:'4. IF Filter',step4:'5. Demodulator',step5:'6. Audio Output',
    startRx:'Start Receiver',stopRx:'Stop',resetRx:'Reset',
    rfPower:'RF Input Power:',snrLabel:'SNR:',ifFreq:'IF Frequency:',
    audioFreq:'Audio Freq:',agcGain:'AGC Gain:',
    theoryIntro:'A superheterodyne receiver converts RF signals to baseband audio through these stages:',
    theory1:'Antenna captures electromagnetic waves as voltage signals',
    theory2:'LNA amplifies weak signals while adding minimal noise',
    theory3:'Mixer multiplies RF with local oscillator for frequency conversion',
    theory4:'IF filter selects desired signal bandwidth',
    theory5:'Demodulator extracts baseband audio from carrier',
    theory6:'AGC maintains consistent output level',
    buildDesc:'Track your receiver build progress. Each step unlocks when you explore the pipeline.',
    splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',
    rxStarted:'Receiver started',rxStopped:'Receiver stopped',rxReset:'Receiver reset',
    stepChanged:'Viewing step:',buildComplete:'All stages explored! Receiver complete!',
    pipeStages:['Antenna','LNA','Mixer','IF Filter','Demod','Audio'],
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Configure SDR',step1Desc:'Set the center frequency, sample rate, and gain for the SDR receiver.',step2Title:'Capture Signal',step2Desc:'Raw I/Q samples are captured from the radio spectrum in real time.',step3Title:'Process & Filter',step3Desc:'Digital signal processing applies filters, FFT, and demodulation algorithms.',step4Title:'Visualize Output',step4Desc:'The processed signal is displayed as spectrum, waterfall, or decoded data.'},
  fr: {
    title:'Construire un Recepteur SDR',subtitle:'Construisez un recepteur logiciel pas a pas',
    disconnected:'Deconnecte',connected:'En marche',
    mainSection:'Pipeline Recepteur',mainDesc:'DSP etape par etape: antenne vers sortie audio',
    sectionA:'Metriques Signal',sectionB:'Theorie du Recepteur',sectionC:'Progression',
    activityLog:'Journal',eventsMsg:'Evenements et messages',
    clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',
    settings:'Parametres',language:'Langue',
    help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    faq_q1:'Qu\'est-ce que Build Receiver?',faq_a1:'Un outil interactif pour apprendre la conception de recepteurs.',
    faq_q2:'Comment demarrer?',faq_a2:'Selectionnez une etape, ajustez les parametres, puis Demarrer.',
    faq_q3:'Quelles modulations?',faq_a3:'Demodulation AM, FM et SSB avec pipeline visuel.',
    faq_q4:'Mes donnees sont privees?',faq_a4:'Oui. Tout fonctionne localement.',
    howto_1:'Selectionnez une etape du pipeline.',howto_2:'Ajustez la frequence et le bruit.',
    howto_3:'Cliquez Demarrer pour le traitement en direct.',howto_4:'Explorez les 6 etapes.',
    wiki_themes_title:'Themes',wiki_themes:'8 themes integres.',
    wiki_i18n_title:'Langues',wiki_i18n:'Trilingue avec RTL.',
    working:'En cours...',filterAll:'Tout',soundEffects:'Effets sonores',
    ready:'Constructeur de recepteur pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
    stepLabel:'Etape du Pipeline',freqLabel:'Frequence Porteuse (Hz)',modType:'Modulation',
    noiseLabel:'Niveau de Bruit',
    step0:'1. Entree Antenne',step1:'2. Amplificateur RF',step2:'3. Melangeur',
    step3:'4. Filtre FI',step4:'5. Demodulateur',step5:'6. Sortie Audio',
    startRx:'Demarrer',stopRx:'Arreter',resetRx:'Reinitialiser',
    rfPower:'Puissance RF:',snrLabel:'RSB:',ifFreq:'Frequence FI:',
    audioFreq:'Freq Audio:',agcGain:'Gain AGC:',
    theoryIntro:'Un recepteur superheterodyne convertit les signaux RF en audio:',
    theory1:'L\'antenne capture les ondes electromagnetiques',
    theory2:'Le LNA amplifie les signaux faibles',
    theory3:'Le melangeur convertit la frequence',
    theory4:'Le filtre FI selectionne la bande passante',
    theory5:'Le demodulateur extrait l\'audio',
    theory6:'L\'AGC maintient un niveau constant',
    buildDesc:'Suivez votre progression. Chaque etape se debloque en explorant le pipeline.',
    splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',
    rxStarted:'Recepteur demarre',rxStopped:'Recepteur arrete',rxReset:'Recepteur reinitialise',
    stepChanged:'Etape:',buildComplete:'Toutes les etapes explorees! Recepteur complet!',
    pipeStages:['Antenne','LNA','Melangeur','Filtre FI','Demod','Audio'],
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.'},
  ar: {
    title:'بناء مستقبل SDR',subtitle:'ابنِ مستقبل برمجي خطوة بخطوة',
    disconnected:'غير متصل',connected:'يعمل',
    mainSection:'خط انابيب المستقبل',mainDesc:'DSP خطوة بخطوة: من الهوائي الى الصوت',
    sectionA:'مقاييس الاشارة',sectionB:'نظرية المستقبل',sectionC:'تقدم البناء',
    activityLog:'سجل النشاط',eventsMsg:'الاحداث والرسائل',
    clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',
    settings:'الاعدادات',language:'اللغة',
    help:'مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
    faq_q1:'ما هو بناء المستقبل؟',faq_a1:'اداة تفاعلية لتعلم تصميم المستقبلات خطوة بخطوة.',
    faq_q2:'كيف ابدا؟',faq_a2:'اختر مرحلة واضبط المعلمات ثم اضغط ابدا.',
    faq_q3:'ما انواع التضمين المدعومة؟',faq_a3:'AM و FM و SSB مع عرض مرئي.',
    faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محليا.',
    howto_1:'اختر مرحلة في خط الانابيب.',howto_2:'اضبط التردد ومستوى الضوضاء.',
    howto_3:'اضغط ابدا لرؤية المعالجة المباشرة.',howto_4:'استكشف جميع المراحل الست.',
    wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر مدمجة.',
    wiki_i18n_title:'اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
    working:'جارٍ...',filterAll:'الكل',soundEffects:'مؤثرات صوتية',
    ready:'منشئ المستقبل جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
    stepLabel:'مرحلة خط الانابيب',freqLabel:'تردد الحامل (هرتز)',modType:'التضمين',
    noiseLabel:'مستوى الضوضاء',
    step0:'1. مدخل الهوائي',step1:'2. مضخم RF',step2:'3. الخلاط',
    step3:'4. مرشح IF',step4:'5. مزيل التضمين',step5:'6. مخرج الصوت',
    startRx:'ابدا المستقبل',stopRx:'ايقاف',resetRx:'اعادة',
    rfPower:'طاقة RF:',snrLabel:'نسبة الاشارة للضوضاء:',ifFreq:'تردد IF:',
    audioFreq:'تردد الصوت:',agcGain:'كسب AGC:',
    theoryIntro:'المستقبل السوبرهيتيرودين يحول اشارات RF الى صوت:',
    theory1:'الهوائي يلتقط الموجات الكهرومغناطيسية',
    theory2:'مضخم الضوضاء المنخفض يضخم الاشارات الضعيفة',
    theory3:'الخلاط يحول التردد',
    theory4:'مرشح IF يختار عرض النطاق',
    theory5:'مزيل التضمين يستخرج الصوت',
    theory6:'AGC يحافظ على مستوى ثابت',
    buildDesc:'تتبع تقدم بناء المستقبل. كل مرحلة تفتح عند الاستكشاف.',
    splashHint:'انقر للتخطي',langChanged:'اللغة: العربية',themeChanged:'المظهر:',
    rxStarted:'بدا المستقبل',rxStopped:'توقف المستقبل',rxReset:'اعادة ضبط المستقبل',
    stepChanged:'المرحلة:',buildComplete:'تم استكشاف جميع المراحل! المستقبل مكتمل!',
    pipeStages:['هوائي','LNA','خلاط','مرشح IF','ازالة تضمين','صوت'],
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت'
  ,step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='build-receiver-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

/* ═══════ PANELS ═══════ */
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

/* ═══════ RECEIVER SIMULATION ═══════ */
let rxRunning=false, animFrame=null, sampleRate=8192;
const stagesVisited = new Set();
const PIPE_LABELS_EN = ['Antenna','LNA','Mixer','IF Filter','Demod','Audio'];

function generateCarrier(freq, n, noiseLevel) {
  const buf = new Float32Array(n), dt = 1/sampleRate;
  for (let i=0; i<n; i++) {
    const t = i*dt;
    buf[i] = Math.sin(2*Math.PI*freq*t) + (Math.random()-0.5)*noiseLevel*2;
  }
  return buf;
}

function modulateSignal(carrier, freq, n, modType) {
  const buf = new Float32Array(n), dt = 1/sampleRate;
  const msgFreq = 300;
  for (let i=0; i<n; i++) {
    const t = i*dt;
    const msg = Math.sin(2*Math.PI*msgFreq*t);
    if (modType === 'am') {
      buf[i] = carrier[i] * (1 + 0.7*msg);
    } else if (modType === 'fm') {
      buf[i] = Math.sin(2*Math.PI*freq*t + 5*Math.sin(2*Math.PI*msgFreq*t)) + (carrier[i]-Math.sin(2*Math.PI*freq*t*dt))*0.1;
    } else { // ssb
      buf[i] = msg * Math.cos(2*Math.PI*freq*t) - Math.cos(2*Math.PI*msgFreq*t + Math.PI/2) * Math.sin(2*Math.PI*freq*t);
      buf[i] += (Math.random()-0.5)*0.1;
    }
  }
  return buf;
}

function amplify(buf, gain) {
  const out = new Float32Array(buf.length);
  for (let i=0; i<buf.length; i++) out[i] = Math.max(-1, Math.min(1, buf[i]*gain));
  return out;
}

function mixDown(buf, freq, loOffset, n) {
  const out = new Float32Array(n), dt = 1/sampleRate;
  const loFreq = freq - loOffset;
  for (let i=0; i<n; i++) {
    out[i] = buf[i] * Math.cos(2*Math.PI*loFreq*i*dt);
  }
  return out;
}

function ifFilter(buf) {
  const out = new Float32Array(buf.length);
  const alpha = 0.15;
  out[0] = buf[0];
  for (let i=1; i<buf.length; i++) out[i] = out[i-1] + alpha*(buf[i]-out[i-1]);
  return out;
}

function demodulate(buf, modType, freq, n) {
  const out = new Float32Array(n), dt = 1/sampleRate;
  if (modType === 'am') {
    for (let i=0; i<n; i++) out[i] = Math.abs(buf[i]);
    const lp = new Float32Array(n);
    lp[0] = out[0];
    for (let i=1; i<n; i++) lp[i] = lp[i-1] + 0.05*(out[i]-lp[i-1]);
    return lp;
  } else if (modType === 'fm') {
    for (let i=1; i<n; i++) {
      const phase1 = Math.atan2(buf[i], buf[i-1]||0.001);
      out[i] = phase1 / Math.PI;
    }
    return out;
  } else {
    for (let i=0; i<n; i++) {
      out[i] = buf[i] * 2 * Math.cos(2*Math.PI*455*i*dt);
    }
    const lp = new Float32Array(n);
    lp[0] = out[0];
    for (let i=1; i<n; i++) lp[i] = lp[i-1] + 0.08*(out[i]-lp[i-1]);
    return lp;
  }
}

function agc(buf) {
  const out = new Float32Array(buf.length);
  let env = 0.5;
  for (let i=0; i<buf.length; i++) {
    const abs = Math.abs(buf[i]);
    env = env*0.99 + abs*0.01;
    const gain = env > 0.01 ? 0.5/env : 1;
    out[i] = buf[i] * gain;
  }
  return out;
}

function drawPipeline(ctx, w, h, step) {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0,0,w,h);
  const labels = LANG[currentLang].pipeStages || PIPE_LABELS_EN;
  const n = labels.length;
  const bw = (w-40)/(n), bh = 40, y0 = (h-bh)/2;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  for (let i=0; i<n; i++) {
    const x = 20 + i*bw;
    const visited = stagesVisited.has(i);
    const active = i === step;
    ctx.fillStyle = active ? accent : visited ? '#2a4a2a' : '#1a1a2e';
    ctx.strokeStyle = active ? '#fff' : visited ? '#4a8a4a' : '#333';
    ctx.lineWidth = active ? 2 : 1;
    ctx.beginPath();
    ctx.roundRect(x+4, y0, bw-8, bh, 6);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = active ? '#000' : '#ccc';
    ctx.font = '11px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x+bw/2, y0+bh/2+4);
    if (i < n-1) {
      ctx.strokeStyle = '#555';
      ctx.beginPath();
      ctx.moveTo(x+bw-4, h/2);
      ctx.lineTo(x+bw+4, h/2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x+bw+1, h/2-4);
      ctx.lineTo(x+bw+4, h/2);
      ctx.lineTo(x+bw+1, h/2+4);
      ctx.stroke();
    }
  }
}

function drawSignal(buf, canvasId, color, label) {
  const c = $(canvasId); if (!c) return;
  const ctx = c.getContext('2d'), w = c.width, h = c.height;
  ctx.fillStyle = '#000';
  ctx.fillRect(0,0,w,h);
  ctx.strokeStyle = '#1a2a3a';
  for (let i=0; i<5; i++) { ctx.beginPath(); ctx.moveTo(0,i*h/5); ctx.lineTo(w,i*h/5); ctx.stroke(); }
  ctx.strokeStyle = color || '#00ff88';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  const step = Math.max(1, Math.floor(buf.length/w));
  for (let i=0; i<w; i++) {
    const idx = Math.min(i*step, buf.length-1);
    const y = h/2 - buf[idx]*(h/2)*0.8;
    if (i===0) ctx.moveTo(0,y); else ctx.lineTo(i,y);
  }
  ctx.stroke();
  if (label) {
    ctx.fillStyle = '#8899aa';
    ctx.font = '11px Orbitron, monospace';
    ctx.fillText(label, 8, 16);
  }
}

function updateMetrics(carrier, demod, freq, noiseLevel) {
  const rfPow = -30 + (1-noiseLevel)*40;
  const snr = (1-noiseLevel)*30 + 5;
  const ifF = 455;
  let rms = 0;
  for (let i=0; i<demod.length; i++) rms += demod[i]*demod[i];
  rms = Math.sqrt(rms/demod.length);
  const audioF = 300;
  const agcG = 20*Math.log10(0.5/(rms+0.001));
  $('rfPowerVal').textContent = rfPow.toFixed(1) + ' dBm';
  $('snrVal').textContent = snr.toFixed(1) + ' dB';
  $('ifFreqVal').textContent = ifF + ' Hz';
  $('audioFreqVal').textContent = audioF + ' Hz';
  $('agcVal').textContent = agcG.toFixed(1) + ' dB';
}

function updateBuildProgress() {
  const el = $('buildProgress');
  if (!el) return;
  const labels = LANG[currentLang].pipeStages || PIPE_LABELS_EN;
  el.innerHTML = '';
  for (let i=0; i<6; i++) {
    const d = document.createElement('div');
    d.style.cssText = 'display:flex;align-items:center;gap:8px;margin:4px 0;';
    const icon = stagesVisited.has(i) ? '&#9989;' : '&#9744;';
    d.innerHTML = `<span style="font-size:18px;">${icon}</span><span style="color:${stagesVisited.has(i)?'#4a8':'#888'}">${labels[i]}</span>`;
    el.appendChild(d);
  }
  if (stagesVisited.size === 6) {
    const comp = document.createElement('div');
    comp.style.cssText = 'margin-top:10px;padding:8px;border-radius:6px;background:var(--accent,#d4a03c);color:#000;font-weight:bold;text-align:center;';
    comp.textContent = LANG[currentLang].buildComplete;
    el.appendChild(comp);
  }
}

const N = 1024;
function rxLoop() {
  if (!rxRunning) return;
  const step = +$('stepSelect').value;
  const freq = +$('freqSlider').value;
  const modType = $('modSelect').value;
  const noiseLevel = +$('noiseSlider').value / 100;

  stagesVisited.add(step);

  const carrier = generateCarrier(freq, N, noiseLevel);
  const modulated = modulateSignal(carrier, freq, N, modType);
  const amplified = amplify(modulated, 1.5);
  const mixed = mixDown(amplified, freq, 455, N);
  const filtered = ifFilter(mixed);
  const demodulated = demodulate(filtered, modType, freq, N);
  const output = agc(demodulated);

  const pipeC = $('pipelineCanvas');
  if (pipeC) drawPipeline(pipeC.getContext('2d'), pipeC.width, pipeC.height, step);

  const signals = [carrier, amplified, mixed, filtered, demodulated, output];
  const colors = ['#ff4444','#ff8844','#44aaff','#44ff88','#ffaa00','#00ff88'];
  const labels_en = ['RF Input','Amplified','IF Mixed','IF Filtered','Demodulated','Audio Output'];
  drawSignal(signals[step], 'signalCanvas', colors[step], labels_en[step]);

  if (step >= 4) {
    drawSignal(output, 'demodCanvas', '#00ff88', 'Audio Output');
  } else {
    const dc = $('demodCanvas');
    if (dc) { const dctx = dc.getContext('2d'); dctx.fillStyle='#0a0a1a'; dctx.fillRect(0,0,dc.width,dc.height);
      dctx.fillStyle='#555'; dctx.font='12px Orbitron,monospace'; dctx.fillText('Reach step 5-6 to see audio output',10,dc.height/2); }
  }

  updateMetrics(carrier, output, freq, noiseLevel);
  updateBuildProgress();

  animFrame = requestAnimationFrame(rxLoop);
}

function startRx() {
  if (rxRunning) return;
  rxRunning = true;
  setStatus(true);
  log(LANG[currentLang].rxStarted, 'success');
  rxLoop();
}

function stopRx() {
  rxRunning = false;
  if (animFrame) cancelAnimationFrame(animFrame);
  setStatus(false);
  log(LANG[currentLang].rxStopped, 'info');
}

function resetRx() {
  stopRx();
  $('freqSlider').value = 2000; $('freqVal').textContent = '2000 Hz';
  $('noiseSlider').value = 20; $('noiseVal').textContent = '20%';
  $('stepSelect').value = '0'; $('modSelect').value = 'am';
  stagesVisited.clear();
  ['signalCanvas','demodCanvas','pipelineCanvas'].forEach(id => {
    const c = $(id); if (c) c.getContext('2d').clearRect(0,0,c.width,c.height);
  });
  $('rfPowerVal').textContent='-- dBm'; $('snrVal').textContent='-- dB';
  $('ifFreqVal').textContent='-- Hz'; $('audioFreqVal').textContent='-- Hz'; $('agcVal').textContent='-- dB';
  updateBuildProgress();
  log(LANG[currentLang].rxReset, 'info');
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
  $('startBtn').onclick=startRx; $('stopBtn').onclick=stopRx; $('resetBtn').onclick=resetRx;
  $('freqSlider').oninput=function(){$('freqVal').textContent=this.value+' Hz';};
  $('noiseSlider').oninput=function(){$('noiseVal').textContent=this.value+'%';};
  $('stepSelect').onchange=function(){log(LANG[currentLang].stepChanged+' '+this.selectedOptions[0].textContent,'info');};
  updateBuildProgress();
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Build Receiver
   Animated superheterodyne block diagram + signal flow
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
function boot(){
  let el=document.getElementById('rxSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='rxSimCanvas';el.width=780;el.height=180;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#050a10;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.02;cx.fillStyle='#050a10';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  const blocks=[{x:20,w:80,label:'ANTENNA'},{x:120,w:80,label:'LNA'},{x:220,w:80,label:'MIXER'},{x:320,w:80,label:'IF FILTER'},{x:420,w:80,label:'DEMOD'},{x:520,w:80,label:'AUDIO'},{x:620,w:80,label:'ADC'}];
  blocks.forEach((b,i)=>{
    const y=H*.3;
    cx.fillStyle='rgba(100,200,255,.06)';cx.fillRect(b.x,y,b.w,45);
    cx.strokeStyle=i<=Math.floor(t*2)%blocks.length?acc:'rgba(100,200,255,.15)';
    cx.lineWidth=i<=Math.floor(t*2)%blocks.length?2:1;cx.strokeRect(b.x,y,b.w,45);
    cx.fillStyle=i<=Math.floor(t*2)%blocks.length?acc:'rgba(200,230,255,.5)';
    cx.font='9px Orbitron,monospace';cx.textAlign='center';cx.fillText(b.label,b.x+b.w/2,y+28);
    if(i<blocks.length-1){
      cx.strokeStyle='rgba(100,200,255,.15)';cx.lineWidth=1;
      cx.beginPath();cx.moveTo(b.x+b.w,y+22);cx.lineTo(blocks[i+1].x,y+22);cx.stroke();
      const dot=(t*60+i*20)%(blocks[i+1].x-b.x-b.w);
      cx.fillStyle=acc;cx.beginPath();cx.arc(b.x+b.w+dot,y+22,3,0,Math.PI*2);cx.fill();
    }
  });
  // LO indicator
  cx.fillStyle='rgba(245,158,11,.3)';cx.font='8px monospace';cx.textAlign='center';
  cx.fillText('LO',260,H*.3-8);cx.strokeStyle='rgba(245,158,11,.2)';cx.lineWidth=1;
  cx.beginPath();cx.moveTo(260,H*.3-3);cx.lineTo(260,H*.3);cx.stroke();
  // Signal trace at bottom
  cx.strokeStyle=acc+'88';cx.lineWidth=1;cx.beginPath();
  for(let i=0;i<W;i++){const x=i,tt=i/W+t;
    const stage=Math.floor(i/W*blocks.length);
    const freq=stage<2?40:stage<4?15:5;
    const amp=stage<1?.3:stage<3?.5:.7;
    const y=H*.78-Math.sin(tt*freq)*H*.12*amp;
    if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
  }
  cx.stroke();
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Superheterodyne Receiver — Signal Flow',8,14);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
})();
