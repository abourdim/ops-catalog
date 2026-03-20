/**
 * SDR Signal Generator — Workshop DIY v1.0
 * Generate complex test signals with real-time waveform and spectrum
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M5 50 Q20 10 35 50 Q50 90 65 50 Q80 10 95 50" stroke="currentColor" fill="none" stroke-width="3" stroke-linecap="round"><animate attributeName="d" values="M5 50 Q20 10 35 50 Q50 90 65 50 Q80 10 95 50;M5 50 Q20 30 35 50 Q50 70 65 50 Q80 30 95 50;M5 50 Q20 10 35 50 Q50 90 65 50 Q80 10 95 50" dur="1.5s" repeatCount="indefinite"/></path><circle cx="50" cy="85" r="8" fill="none" stroke="currentColor" stroke-width="2"/><line x1="50" y1="77" x2="50" y2="70" stroke="currentColor" stroke-width="2"/></svg>`;
const LIGHT_THEMES=['riad','medina'],APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(.001,n+.08);o.start(n);o.stop(n+.08);}else if(t==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(.001,n+.3);o.start(n);o.stop(n+.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,n+.25);o.start(n);o.stop(n+.25);}}

const LANG={
en:{title:'SDR Signal Generator',subtitle:'🎛️ Signal Generator — Multi-tone, sweep, noise, OFDM',disconnected:'Disconnected',connected:'Connected',mainSection:'Signal Generator',mainDesc:'Create complex test signals with live waveform and spectrum',sectionA:'Signal Properties',sectionB:'Tone Builder',sectionC:'Signal Theory',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'⚙️ Settings',language:'Language',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
howto_1:'Select a signal type.',howto_2:'Adjust frequency, amplitude, DC offset, noise.',howto_3:'Click Generate for waveform and spectrum.',howto_4:'Use Tone Builder for custom multi-tone signals.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 built-in themes.',wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual with RTL.',
working:'Working…',filterAll:'All',soundEffects:'Sound effects',ready:'🎛️ Signal Generator ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
sigType:'Signal Type',freq1:'Frequency (Hz)',amplitude:'Amplitude',dcOffset:'DC Offset',noiseLevel:'Noise Level',startGen:'▶ Generate',stopGen:'⏹ Stop',playAudio:'🔊 Play Audio',
rmsLabel:'RMS:',peakLabel:'Peak-to-Peak:',crestLabel:'Crest Factor:',thd:'THD:',bwLabel:'Bandwidth:',
toneDesc:'Add up to 8 tones for a multi-tone test signal.',theoryIntro:'Test signals are essential for characterizing SDR receivers:',
theory1:'Sine waves test frequency response and distortion',theory2:'Multi-tone reveals intermodulation products',theory3:'Noise tests noise figure and dynamic range',theory4:'Sweep maps frequency response across bands',theory5:'OFDM tests linearity with high PAPR signals',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',genStarted:'▶ Generating',genStopped:'⏹ Stopped',audioPlaying:'🔊 Audio playing',audioStopped:'🔇 Audio stopped',toneAdded:'Tone added',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configure SDR',step1Desc:'Set the center frequency, sample rate, and gain for the SDR receiver.',step2Title:'Capture Signal',step2Desc:'Raw I/Q samples are captured from the radio spectrum in real time.',step3Title:'Process & Filter',step3Desc:'Digital signal processing applies filters, FFT, and demodulation algorithms.',step4Title:'Visualize Output',step4Desc:'The processed signal is displayed as spectrum, waterfall, or decoded data.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates software-defined radio! 🔬 You get to experiment with radio signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real radio signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real digital signal processing! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need RTL-SDR. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Sdr Demod Challenge and Sdr Noise Floor! Each teaches something different. 🚀'},
fr:{title:'Generateur de Signaux SDR',subtitle:'🎛️ Generateur — Multi-ton, balayage, bruit, OFDM',disconnected:'Deconnecte',connected:'Connecte',mainSection:'Generateur de Signaux',mainDesc:'Creez des signaux test avec forme d\'onde et spectre',sectionA:'Proprietes du Signal',sectionB:'Constructeur de Tons',sectionC:'Theorie des Signaux',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'⚙️ Parametres',language:'Langue',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
howto_1:'Selectionnez un type de signal.',howto_2:'Ajustez frequence, amplitude, offset DC, bruit.',howto_3:'Cliquez Generer pour voir onde et spectre.',howto_4:'Utilisez le constructeur de tons.',
wiki_themes_title:'🎨 Themes',wiki_themes:'8 themes.',wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',
working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',ready:'🎛️ Generateur pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',
sigType:'Type Signal',freq1:'Frequence (Hz)',amplitude:'Amplitude',dcOffset:'Offset DC',noiseLevel:'Niveau Bruit',startGen:'▶ Generer',stopGen:'⏹ Arreter',playAudio:'🔊 Lecture Audio',
rmsLabel:'RMS:',peakLabel:'Crete-a-Crete:',crestLabel:'Facteur de Crete:',thd:'DHT:',bwLabel:'Bande Passante:',
toneDesc:'Ajoutez jusqu\'a 8 tons.',theoryIntro:'Les signaux test sont essentiels pour les recepteurs SDR:',
theory1:'Les sinusoides testent la reponse et la distorsion',theory2:'Le multi-ton revele l\'intermodulation',theory3:'Le bruit teste le facteur de bruit',theory4:'Le balayage cartographie la reponse frequentielle',theory5:'L\'OFDM teste la linearite avec un fort PAPR',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Francais',themeChanged:'🎨 Theme →',genStarted:'▶ Generation en cours',genStopped:'⏹ Arrete',audioPlaying:'🔊 Audio en lecture',audioStopped:'🔇 Audio arrete',toneAdded:'Ton ajoute',
t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule software-defined radio ! 🔬 Tu peux expérimenter avec radio signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai digital signal processing ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Sdr Demod Challenge and Sdr Noise Floor ! Chacune enseigne quelque chose de différent. 🚀'},
ar:{title:'مولد اشارات SDR',subtitle:'🎛️ مولد الاشارات — متعدد النغمات، مسح، ضوضاء، OFDM',disconnected:'غير متصل',connected:'متصل',mainSection:'مولد الاشارات',mainDesc:'انشئ اشارات اختبار مع شكل الموجة والطيف',sectionA:'خصائص الاشارة',sectionB:'بناء النغمات',sectionC:'نظرية الاشارات',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'⚙️ الاعدادات',language:'اللغة',help:'❓ مساعدة',faq:'اسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
howto_1:'اختر نوع الاشارة.',howto_2:'اضبط التردد والسعة والازاحة والضوضاء.',howto_3:'اضغط توليد لرؤية الموجة والطيف.',howto_4:'استخدم بناء النغمات لاشارات مخصصة.',
wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'🎛️ مولد الاشارات جاهز!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل',
sigType:'نوع الاشارة',freq1:'التردد (هرتز)',amplitude:'السعة',dcOffset:'ازاحة DC',noiseLevel:'مستوى الضوضاء',startGen:'▶ توليد',stopGen:'⏹ ايقاف',playAudio:'🔊 تشغيل صوت',
rmsLabel:'RMS:',peakLabel:'قمة لقمة:',crestLabel:'عامل القمة:',thd:'تشوه توافقي:',bwLabel:'عرض النطاق:',
toneDesc:'اضف حتى 8 نغمات.',theoryIntro:'اشارات الاختبار ضرورية لتوصيف مستقبلات SDR:',
theory1:'الجيبيات تختبر الاستجابة الترددية والتشوه',theory2:'متعدد النغمات يكشف منتجات التعديل البيني',theory3:'الضوضاء تختبر رقم الضوضاء والنطاق الديناميكي',theory4:'المسح يرسم خريطة الاستجابة الترددية',theory5:'OFDM يختبر الخطية مع اشارات PAPR عالية',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',genStarted:'▶ يتم التوليد',genStopped:'⏹ متوقف',audioPlaying:'🔊 الصوت يعمل',audioStopped:'🔇 توقف الصوت',toneAdded:'تمت اضافة نغمة',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي software-defined radio! 🔬 يمكنك التجربة مع radio signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا digital signal processing حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Sdr Demod Challenge and Sdr Noise Floor! كل واحد يعلّم شيئاً مختلفاً. 🚀'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='signal-gen-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
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
let running=false,animFrame=null;
const SR=8192,N=1024;
const tones=[{freq:440,amp:.8},{freq:880,amp:.4}];
let audioOsc=null,audioGain=null,isPlaying=false;
let tOff=0;

function generate(type,f,amp,dc,noiseLvl){
  const buf=new Float32Array(N);const dt=1/SR;
  for(let i=0;i<N;i++){
    const t=(tOff+i)*dt;let v=0;
    switch(type){
      case 'sine':v=Math.sin(2*Math.PI*f*t);break;
      case 'square':v=Math.sign(Math.sin(2*Math.PI*f*t));break;
      case 'sawtooth':v=2*(f*t-Math.floor(f*t+.5));break;
      case 'triangle':v=2*Math.abs(2*(f*t-Math.floor(f*t+.5)))-1;break;
      case 'noise':v=Math.random()*2-1;break;
      case 'pink':{let w=0;for(let h=1;h<=10;h++)w+=Math.sin(2*Math.PI*f*h*t)/h;v=w/3;break;}
      case 'sweep':{const fs=f*.25+f*2*(i/N);v=Math.sin(2*Math.PI*fs*t);break;}
      case 'multitone':for(const tn of tones)v+=tn.amp*Math.sin(2*Math.PI*tn.freq*t);break;
      case 'ofdm':{for(let k=0;k<16;k++)v+=Math.sin(2*Math.PI*(f+k*f/8)*t+Math.random()*Math.PI*2);v/=8;break;}
      case 'pulse':v=(f*t%1)<.1?1:0;break;
    }
    buf[i]=v*amp+dc+(Math.random()-.5)*2*noiseLvl;
  }
  tOff+=N;return buf;
}

function computeSpec(buf){
  const mag=new Float32Array(N/2);
  for(let k=0;k<N/2;k++){
    let re=0,im=0;for(let n=0;n<N;n++){const a=-2*Math.PI*k*n/N;re+=buf[n]*Math.cos(a);im+=buf[n]*Math.sin(a);}
    mag[k]=Math.sqrt(re*re+im*im)/N;
  }return mag;
}

function drawWave(buf){
  const c=$('waveCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  const show=Math.min(512,buf.length);
  for(let i=0;i<show;i++){const x=i/show*w,y=h/2-buf[i]*h*.4;if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));}
  ctx.stroke();
  ctx.fillStyle='#667';ctx.font='10px Orbitron,monospace';ctx.fillText('Waveform',4,12);
}

function drawSpec(mag){
  const c=$('specCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;
  for(let i=1;i<5;i++){ctx.beginPath();ctx.moveTo(0,i/5*h);ctx.lineTo(w,i/5*h);ctx.stroke();}
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  const mx=Math.max(...mag)||1;
  ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();
  for(let i=0;i<mag.length;i++){const x=i/mag.length*w,db=20*Math.log10(mag[i]/mx+1e-10),y=h-((db+80)/80)*h;if(i===0)ctx.moveTo(x,Math.max(0,Math.min(h,y)));else ctx.lineTo(x,Math.max(0,Math.min(h,y)));}
  ctx.stroke();
  ctx.fillStyle='#667';ctx.font='10px Orbitron,monospace';ctx.fillText('Spectrum',4,12);ctx.fillText('0',4,h-4);ctx.fillText((SR/2)+' Hz',w-60,h-4);
}

function updateProps(buf,mag){
  let rms=0,mn=Infinity,mx=-Infinity;
  for(let i=0;i<buf.length;i++){rms+=buf[i]*buf[i];mn=Math.min(mn,buf[i]);mx=Math.max(mx,buf[i]);}
  rms=Math.sqrt(rms/buf.length);const p2p=mx-mn;const crest=Math.max(Math.abs(mn),Math.abs(mx))/(rms+1e-20);
  $('rmsVal').textContent=rms.toFixed(4);$('p2pVal').textContent=p2p.toFixed(4);$('crestVal').textContent=crest.toFixed(2);
  // THD
  const maxI=mag.indexOf(Math.max(...mag));
  let fund=mag[maxI]*mag[maxI],harm=0;
  for(let h=2;h<=5;h++){const hi=maxI*h;if(hi<mag.length)harm+=mag[hi]*mag[hi];}
  $('thdVal').textContent=(Math.sqrt(harm/(fund+1e-20))*100).toFixed(2)+'%';
  // BW
  const magMx=Math.max(...mag);const th3=magMx*.707;let lo=0,hi2=mag.length-1;
  for(let i=0;i<mag.length;i++){if(mag[i]>th3){lo=i;break;}}
  for(let i=mag.length-1;i>=0;i--){if(mag[i]>th3){hi2=i;break;}}
  $('bwVal').textContent=(((hi2-lo)/mag.length)*(SR/2)).toFixed(0)+' Hz';
}

function simLoop(){
  if(!running)return;
  const type=$('sigType').value,f=+$('freq1').value,amp=+$('ampSlider').value/100;
  const dc=+$('dcSlider').value/100,noise=+$('noiseSlider').value/100;
  const buf=generate(type,f,amp,dc,noise);
  drawWave(buf);const mag=computeSpec(buf);drawSpec(mag);updateProps(buf,mag);
  animFrame=requestAnimationFrame(simLoop);
}
function startGen(){if(running)return;running=true;tOff=0;setStatus(true);log(LANG[currentLang].genStarted,'success');simLoop();}
function stopGen(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].genStopped,'info');}

function toggleAudio(){
  if(!audioCtx)audioCtx=new AudioCtx();
  if(isPlaying){audioOsc.stop();isPlaying=false;log(LANG[currentLang].audioStopped,'info');return;}
  audioOsc=audioCtx.createOscillator();audioGain=audioCtx.createGain();
  audioOsc.connect(audioGain);audioGain.connect(audioCtx.destination);
  audioGain.gain.value=.1;audioOsc.frequency.value=+$('freq1').value;
  const type=$('sigType').value;
  if(type==='square')audioOsc.type='square';else if(type==='sawtooth')audioOsc.type='sawtooth';else if(type==='triangle')audioOsc.type='triangle';else audioOsc.type='sine';
  audioOsc.start();isPlaying=true;log(LANG[currentLang].audioPlaying,'success');
}

/* ═══════ TONE BUILDER ═══════ */
function renderTones(){
  const el=$('toneList');if(!el)return;el.innerHTML='';
  tones.forEach((t,i)=>{
    const row=document.createElement('div');row.style.cssText='display:flex;gap:8px;align-items:center;margin:4px 0;';
    row.innerHTML=`<span style="color:var(--accent);font-weight:bold;font-size:12px;">${i+1}.</span><input type="number" value="${t.freq}" min="20" max="8000" style="width:80px;padding:4px;border-radius:4px;border:1px solid #444;background:#111;color:#eee;"/> Hz <input type="range" min="0" max="100" value="${Math.round(t.amp*100)}" style="width:80px;"/> <span style="font-size:11px;">${t.amp.toFixed(2)}</span> <button style="cursor:pointer;background:none;border:none;color:#f44;font-size:16px;">✕</button>`;
    const inputs=row.querySelectorAll('input');
    inputs[0].onchange=function(){tones[i].freq=+this.value;};
    inputs[1].oninput=function(){tones[i].amp=this.value/100;row.querySelector('span:last-of-type').textContent=(this.value/100).toFixed(2);};
    row.querySelector('button').onclick=()=>{tones.splice(i,1);renderTones();};
    el.appendChild(row);
  });
}
function addTone(){if(tones.length>=8)return;tones.push({freq:440*(tones.length+1),amp:.3});renderTones();log(LANG[currentLang].toneAdded,'info');}

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
  $('startBtn').onclick=startGen;$('stopBtn').onclick=stopGen;$('playBtn').onclick=toggleAudio;
  $('addToneBtn').onclick=addTone;
  $('freq1').oninput=function(){$('freq1Val').textContent=this.value+' Hz';};
  $('ampSlider').oninput=function(){$('ampVal').textContent=(this.value/100).toFixed(2);};
  $('dcSlider').oninput=function(){$('dcVal').textContent=(this.value/100).toFixed(2);};
  $('noiseSlider').oninput=function(){$('noiseVal').textContent=this.value+'%';};
  renderTones();
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Signal Generator
   Animated multi-tone harmonic series + Lissajous pattern
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
function boot(){
  let el=document.getElementById('sigGenSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='sigGenSimCanvas';el.width=780;el.height=180;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.02;cx.fillStyle='rgba(6,8,16,.15)';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Harmonic bars
  const numH=16;for(let i=0;i<numH;i++){
    const bx=20+i*(W*.5/numH),bw=W*.5/numH-3;
    const amp=1/(i+1)*Math.abs(Math.sin(t+i*.5));
    const bh=amp*H*.7;
    cx.fillStyle=`rgba(${79+i*10},${195-i*5},247,${.3+amp*.4})`;
    cx.fillRect(bx,H-bh-10,bw,bh);
    cx.fillStyle='rgba(255,255,255,.2)';cx.font='7px monospace';cx.textAlign='center';
    cx.fillText(`H${i+1}`,bx+bw/2,H-4);
  }
  // Lissajous on right
  const lcx=W*.72,lcy=H/2,lr=H*.35;
  cx.strokeStyle='rgba(100,200,255,.1)';cx.lineWidth=.5;
  cx.beginPath();cx.arc(lcx,lcy,lr,0,Math.PI*2);cx.stroke();
  cx.strokeStyle=acc;cx.lineWidth=1.5;cx.beginPath();
  for(let i=0;i<300;i++){
    const p=i/300*Math.PI*4;
    const x=lcx+Math.sin(p*3+t)*lr*.9;const y=lcy+Math.sin(p*2)*lr*.9;
    if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
  }
  cx.stroke();
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('Harmonic Series + Lissajous Pattern',8,14);
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
