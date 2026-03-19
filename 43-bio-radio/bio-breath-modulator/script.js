/**
 * Workshop DIY — Bio Breath Modulator v1.0
 * Breathing pattern modulates RF carrier
 * Self-contained: i18n · framework · simulation
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const t=audioCtx.currentTime;switch(type){case'click':o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,t+.08);o.start(t);o.stop(t+.08);break;case'success':o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,t+.3);o.start(t);o.stop(t+.3);const o2=audioCtx.createOscillator(),g2=audioCtx.createGain();o2.connect(g2);g2.connect(audioCtx.destination);g2.gain.value=.08;o2.frequency.value=659;o2.type='sine';g2.gain.exponentialRampToValueAtTime(.001,t+.4);o2.start(t+.15);o2.stop(t+.4);break;case'error':o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,t+.25);o.start(t);o.stop(t+.25);break;case'tx':o.frequency.value=1200;o.type='sawtooth';g.gain.value=.04;g.gain.exponentialRampToValueAtTime(.001,t+.15);o.start(t);o.stop(t+.15);break;case'breathe':o.frequency.value=180;o.type='sine';g.gain.value=.04;g.gain.exponentialRampToValueAtTime(.001,t+.6);o.start(t);o.stop(t+.6);break}}

const LANG={
  en:{title:'Bio Breath Modulator',subtitle:'Breathing modulates RF carrier',disconnected:'Disconnected',connected:'Connected',
    mainSection:'Breath Modulator \u2014 RF Carrier Control',mainDesc:'Your breathing pattern modulates a radio frequency carrier signal',
    sectionA:'A \u2014 How It Works',sectionC:'C \u2014 Challenges',
    startBreath:'Start Breathing',stopBreath:'Stop',inhaleBtn:'Inhale',exhaleBtn:'Exhale',txBtn:'TX On',txOff:'TX Off',
    statRate:'BrPM',statDepth:'Depth',statCarrier:'MHz',statDev:'MHz dev',
    step1Title:'Breath Sensor',step1Desc:'Thermistor near nostrils detects airflow temperature changes during breathing.',
    step2Title:'Envelope Extraction',step2Desc:'ADC captures breathing waveform. Low-pass filter extracts the slow envelope.',
    step3Title:'FM Modulation',step3Desc:'Breathing envelope modulates 433.92 MHz carrier via frequency deviation.',
    step4Title:'Demodulation',step4Desc:'Receiver demodulates FM signal to reconstruct breathing pattern remotely.',
    ch1Title:'Breath Sync',ch1Desc:'Can two people synchronize breathing using the transmitted signal?',
    ch2Title:'Rate Control',ch2Desc:'Slow to 6 BrPM. Watch the carrier frequency change.',
    ch3Title:'Morse Breathing',ch3Desc:'Encode a message: deep breath = dash, shallow = dot.',
    faq_q1:'How does breathing modulate RF?',faq_a1:'Breathing waveform controls frequency deviation of 433 MHz carrier via FM.',
    faq_q2:'What is FM modulation?',faq_a2:'Frequency Modulation varies carrier frequency proportional to input signal amplitude.',
    faq_q3:'Can this monitor breathing?',faq_a3:'Yes! Demodulated signal reconstructs breathing pattern at distance.',
    howto_1:'Click Start to begin simulation.',howto_2:'Use Inhale/Exhale for manual control.',howto_3:'Click TX On to transmit.',
    wiki_fm_title:'\ud83d\udce1 FM Modulation',wiki_fm:'f(t) = fc + kf*m(t). fc=carrier, kf=sensitivity, m(t)=breathing signal.',
    wiki_resp_title:'\ud83e\udec1 Respiratory Rate',wiki_resp:'Normal: 12-20 BrPM. Athletes: 6-10. Stress increases rate.',
    activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',
    settings:'\u2699\ufe0f Settings',language:'Language',theme:'Theme',help:'\u2753 Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    soundEffects:'\ud83d\udd0a Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
    splashHint:'tap to skip',working:'Working\u2026',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
    ready:'\ud83e\udec1 Breath Modulator ready \u2014 breathe to transmit!',
    logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',langChanged:'\ud83c\udf10 English',themeChanged:'\ud83c\udfa8 Theme \u2192',
    breathStarted:'Breathing simulation started',breathStopped:'Stopped',
  },
  fr:{title:'Bio Modulateur Respiratoire',subtitle:'La respiration module la porteuse RF',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',
    mainSection:'Modulateur Respiratoire \u2014 Contr\u00f4le RF',mainDesc:'Votre respiration module un signal porteur radio',
    sectionA:'A \u2014 Fonctionnement',sectionC:'C \u2014 D\u00e9fis',
    startBreath:'D\u00e9marrer',stopBreath:'Arr\u00eat',inhaleBtn:'Inspirer',exhaleBtn:'Expirer',txBtn:'TX On',txOff:'TX Off',
    statRate:'RpM',statDepth:'Prof.',statCarrier:'MHz',statDev:'MHz d\u00e9v',
    step1Title:'Capteur Souffle',step1Desc:'Thermistance pr\u00e8s du nez d\u00e9tecte le flux d\'air.',
    step2Title:'Extraction Enveloppe',step2Desc:'L\'ADC capture la forme d\'onde respiratoire.',
    step3Title:'Modulation FM',step3Desc:'L\'enveloppe module la porteuse 433.92 MHz.',
    step4Title:'D\u00e9modulation',step4Desc:'Le r\u00e9cepteur reconstruit le sch\u00e9ma respiratoire.',
    ch1Title:'Sync Respiration',ch1Desc:'Deux personnes synchronisent leur respiration?',
    ch2Title:'Contr\u00f4le Rythme',ch2Desc:'Ralentissez \u00e0 6 RpM.',
    ch3Title:'Morse Respiratoire',ch3Desc:'Profond = tiret, superficiel = point.',
    faq_q1:'Comment le souffle module le RF?',faq_a1:'La forme d\'onde respiratoire contr\u00f4le la d\u00e9viation FM.',
    faq_q2:'Qu\'est-ce que la FM?',faq_a2:'La modulation de fr\u00e9quence varie la porteuse.',
    faq_q3:'Surveiller la respiration?',faq_a3:'Oui! Le signal d\u00e9modul\u00e9 reconstruit le sch\u00e9ma.',
    howto_1:'Cliquez D\u00e9marrer.',howto_2:'Inspirer/Expirer pour contr\u00f4le manuel.',howto_3:'TX On pour transmettre.',
    wiki_fm_title:'\ud83d\udce1 Modulation FM',wiki_fm:'f(t) = fc + kf*m(t). fc=porteuse, m(t)=signal respiratoire.',
    wiki_resp_title:'\ud83e\udec1 Rythme Respiratoire',wiki_resp:'Normal: 12-20 RpM. Athl\u00e8tes: 6-10.',
    activityLog:'Journal',eventsMsg:'\u00c9v\u00e9nements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',
    settings:'\u2699\ufe0f Param\u00e8tres',language:'Langue',theme:'Th\u00e8me',help:'\u2753 Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    soundEffects:'\ud83d\udd0a Sons',whisperMode:'Murmure',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',
    splashHint:'appuyer',working:'En cours\u2026',
    t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
    ready:'\ud83e\udec1 Modulateur pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 Fran\u00e7ais',themeChanged:'\ud83c\udfa8 \u2192',
    breathStarted:'Simulation respiratoire d\u00e9marr\u00e9e',breathStopped:'Arr\u00eat\u00e9',
  },
  ar:{title:'\u0645\u0639\u062f\u0644 \u0627\u0644\u062a\u0646\u0641\u0633',subtitle:'\u0627\u0644\u062a\u0646\u0641\u0633 \u064a\u0639\u062f\u0644 \u062d\u0627\u0645\u0644 RF',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',
    mainSection:'\u0645\u0639\u062f\u0644 \u0627\u0644\u062a\u0646\u0641\u0633 \u2014 \u062a\u062d\u0643\u0645 RF',mainDesc:'\u0646\u0645\u0637 \u062a\u0646\u0641\u0633\u0643 \u064a\u0639\u062f\u0644 \u0625\u0634\u0627\u0631\u0629 \u0631\u0627\u062f\u064a\u0648',
    sectionA:'\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644',sectionC:'\u062c \u2014 \u062a\u062d\u062f\u064a\u0627\u062a',
    startBreath:'\u0628\u062f\u0621',stopBreath:'\u0625\u064a\u0642\u0627\u0641',inhaleBtn:'\u0634\u0647\u064a\u0642',exhaleBtn:'\u0632\u0641\u064a\u0631',txBtn:'\u0625\u0631\u0633\u0627\u0644',txOff:'\u0625\u064a\u0642\u0627\u0641',
    statRate:'\u0646/\u062f',statDepth:'\u0639\u0645\u0642',statCarrier:'MHz',statDev:'MHz \u0627\u0646\u062d\u0631\u0627\u0641',
    step1Title:'\u0645\u0633\u062a\u0634\u0639\u0631 \u0627\u0644\u0646\u0641\u0633',step1Desc:'\u062b\u0631\u0645\u0633\u062a\u0648\u0631 \u064a\u0643\u0634\u0641 \u062a\u063a\u064a\u0631 \u062f\u0631\u062c\u0629 \u062d\u0631\u0627\u0631\u0629 \u0627\u0644\u0647\u0648\u0627\u0621.',
    step2Title:'\u0627\u0633\u062a\u062e\u0631\u0627\u062c \u0627\u0644\u063a\u0644\u0627\u0641',step2Desc:'ADC \u064a\u0644\u062a\u0642\u0637 \u0645\u0648\u062c\u0629 \u0627\u0644\u062a\u0646\u0641\u0633.',
    step3Title:'\u062a\u0639\u062f\u064a\u0644 FM',step3Desc:'\u063a\u0644\u0627\u0641 \u0627\u0644\u062a\u0646\u0641\u0633 \u064a\u0639\u062f\u0644 \u062d\u0627\u0645\u0644 433.92 MHz.',
    step4Title:'\u0641\u0643 \u0627\u0644\u062a\u0639\u062f\u064a\u0644',step4Desc:'\u0627\u0644\u0645\u0633\u062a\u0642\u0628\u0644 \u064a\u0639\u064a\u062f \u0628\u0646\u0627\u0621 \u0646\u0645\u0637 \u0627\u0644\u062a\u0646\u0641\u0633.',
    ch1Title:'\u0645\u0632\u0627\u0645\u0646\u0629 \u0627\u0644\u062a\u0646\u0641\u0633',ch1Desc:'\u0647\u0644 \u064a\u0645\u0643\u0646 \u0644\u0634\u062e\u0635\u064a\u0646 \u0627\u0644\u0645\u0632\u0627\u0645\u0646\u0629\u061f',
    ch2Title:'\u062a\u062d\u0643\u0645 \u0627\u0644\u0645\u0639\u062f\u0644',ch2Desc:'\u0623\u0628\u0637\u0626 \u0625\u0644\u0649 6 \u0646/\u062f.',
    ch3Title:'\u0645\u0648\u0631\u0633 \u062a\u0646\u0641\u0633\u064a',ch3Desc:'\u0639\u0645\u064a\u0642 = \u0634\u0631\u0637\u0629\u060c \u0636\u062d\u0644 = \u0646\u0642\u0637\u0629.',
    faq_q1:'\u0643\u064a\u0641 \u064a\u0639\u062f\u0644 \u0627\u0644\u062a\u0646\u0641\u0633 RF\u061f',faq_a1:'\u0645\u0648\u062c\u0629 \u0627\u0644\u062a\u0646\u0641\u0633 \u062a\u062a\u062d\u0643\u0645 \u0628\u0627\u0646\u062d\u0631\u0627\u0641 FM.',
    faq_q2:'\u0645\u0627 \u0647\u0648 \u062a\u0639\u062f\u064a\u0644 FM\u061f',faq_a2:'FM \u064a\u063a\u064a\u0631 \u062a\u0631\u062f\u062f \u0627\u0644\u062d\u0627\u0645\u0644 \u0628\u062a\u0646\u0627\u0633\u0628 \u0645\u0639 \u0627\u0644\u0625\u0634\u0627\u0631\u0629.',
    faq_q3:'\u0645\u0631\u0627\u0642\u0628\u0629 \u0639\u0646 \u0628\u0639\u062f\u061f',faq_a3:'\u0646\u0639\u0645! \u0627\u0644\u0625\u0634\u0627\u0631\u0629 \u0627\u0644\u0645\u0641\u0643\u0648\u0643\u0629 \u062a\u0639\u064a\u062f \u0628\u0646\u0627\u0621 \u0627\u0644\u0646\u0645\u0637.',
    howto_1:'\u0627\u0646\u0642\u0631 \u0628\u062f\u0621.',howto_2:'\u0634\u0647\u064a\u0642/\u0632\u0641\u064a\u0631 \u0644\u0644\u062a\u062d\u0643\u0645.',howto_3:'\u0625\u0631\u0633\u0627\u0644 \u0644\u0644\u0628\u062b.',
    wiki_fm_title:'\ud83d\udce1 \u062a\u0639\u062f\u064a\u0644 FM',wiki_fm:'f(t) = fc + kf*m(t). \u0627\u0644\u062d\u0627\u0645\u0644 + \u0625\u0634\u0627\u0631\u0629 \u0627\u0644\u062a\u0646\u0641\u0633.',
    wiki_resp_title:'\ud83e\udec1 \u0645\u0639\u062f\u0644 \u0627\u0644\u062a\u0646\u0641\u0633',wiki_resp:'\u0637\u0628\u064a\u0639\u064a: 12-20 \u0646/\u062f. \u0631\u064a\u0627\u0636\u064a: 6-10.',
    activityLog:'\u0633\u062c\u0644',eventsMsg:'\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',
    settings:'\u2699\ufe0f \u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',help:'\u2753 \u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u062f\u0644\u064a\u0644',wiki:'\u0648\u064a\u0643\u064a',
    soundEffects:'\ud83d\udd0a \u0635\u0648\u062a',whisperMode:'\u0647\u0645\u0633',breathingGuide:'\u062a\u0646\u0641\u0633',dhikrTap:'\u0627\u0636\u063a\u0637',musicMode:'\u0645\u0648\u0633\u064a\u0642\u0649',
    splashHint:'\u0627\u0646\u0642\u0631',working:'\u062c\u0627\u0631\u064d\u2026',
    t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',
    ready:'\ud83e\udec1 \u0645\u0639\u062f\u0644 \u0627\u0644\u062a\u0646\u0641\u0633 \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',
    breathStarted:'\u0628\u062f\u0623\u062a \u0627\u0644\u0645\u062d\u0627\u0643\u0627\u0629',breathStopped:'\u062a\u0648\u0642\u0641',
  }
};

/* ═══════ FRAMEWORK (compact) ═══════ */
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(s[k]!=null)e.textContent=s[k]});document.title=`${s.title} \u2014 Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
const TM={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playTM(n){if(!soundEnabled||!n)return;if(!audioCtx)audioCtx=new AudioCtx();const notes=TM[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=.06;g.gain.exponentialRampToValueAtTime(.001,t+.2+i*.15+.15);o.start(t+i*.15);o.stop(t+i*.15+.2)})}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}playTM(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info')}

let logContainer;const logHistory=[];let typewriterEnabled=true;
function log(m,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const ft=`[${new Date().toLocaleTimeString()}] ${m}`;if(typewriterEnabled){logContainer.appendChild(d);twAppend(d,ft)}else{d.textContent=ft;logContainer.appendChild(d)}logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');logHistory.push({msg:m,type,ts:Date.now()});applyLF()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='breath-log.txt';a.click()}

let aLF='all';
function initLF(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');aLF=b.dataset.filter;applyLF();playSound('click')})})}
function applyLF(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(aLF==='all'||l.classList.contains(aLF))?'':'none'})}

let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}

let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
async function twAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(12+Math.random()*18)}el.classList.remove('typing')}
function calcHijri(){try{return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{return''}}

let matrixOn=false,mAnim=null;const AC='\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630';
function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixOn){matrixOn=false;cancelAnimationFrame(mAnim);c.classList.remove('active');return}matrixOn=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixOn)return;ctx.fillStyle='rgba(0,0,0,.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(AC[Math.floor(Math.random()*AC.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>.975)drops[i]=0;drops[i]++}mAnim=requestAnimationFrame(draw)}draw()}

let morseTO=null;function initMorse(){document.addEventListener('mousedown',e=>{const l=e.target.closest('.log-line');if(!l)return;morseTO=setTimeout(()=>{const d=document.querySelector('.status-dot');if(d){d.style.background='#33ff33';d.style.boxShadow='0 0 8px #33ff33';setTimeout(()=>{d.style.background='';d.style.boxShadow=''},500)}},600)});document.addEventListener('mouseup',()=>{if(morseTO){clearTimeout(morseTO);morseTO=null}})}

let musicOn=false;function toggleMusic(){if(musicOn){musicOn=false;document.querySelectorAll('.deco-band').forEach(b=>{b.style.height='';b.style.opacity=''});return}navigator.mediaDevices.getUserMedia({audio:true}).then(s=>{if(!audioCtx)audioCtx=new AudioCtx();const src=audioCtx.createMediaStreamSource(s),ana=audioCtx.createAnalyser();ana.fftSize=256;src.connect(ana);musicOn=true;const data=new Uint8Array(ana.frequencyBinCount);function vis(){if(!musicOn)return;ana.getByteFrequencyData(data);const bass=data.slice(0,10).reduce((a,b)=>a+b,0)/10/255;document.querySelectorAll('.deco-band').forEach(b=>{b.style.height=(2+bass*10)+'px';b.style.opacity=.4+bass*.6});requestAnimationFrame(vis)}vis()}).catch(()=>{})}

let rec=null,whisperOn=false;
function toggleWhisper(){if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window))return;if(whisperOn){if(rec)rec.stop();whisperOn=false;return}const SR=window.SpeechRecognition||window.webkitSpeechRecognition;rec=new SR();rec.continuous=true;rec.interimResults=false;rec.lang=currentLang==='ar'?'ar-DZ':currentLang==='fr'?'fr-FR':'en-US';rec.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)log(`\ud83c\udfa4 ${e.results[i][0].transcript.trim()}`,'rx')};rec.onend=()=>{if(whisperOn)rec.start()};rec.start();whisperOn=true}

let breathGuideOn=false,dhikrN=0;
function toggleBG(){breathGuideOn=!breathGuideOn;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathGuideOn))}
function incDhikr(){if(!breathGuideOn)return;dhikrN++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrN}

function initLR(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,innerWidth*.6))+'px')});document.addEventListener('mouseup',()=>{d=false})}

function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open')}
function closePanel(p,o,r){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open');const b=$(r);if(b)b.focus()}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn')}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(t=>{t.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));t.classList.add('active');const tgt=$('help'+t.dataset.tab.charAt(0).toUpperCase()+t.dataset.tab.slice(1));if(tgt)tgt.classList.add('active')})})}
function trapFocus(e){for(const id of['helpPanel','settingsPanel','logPanel']){const s=$(id);if(!s||!s.classList.contains('open'))continue;const f=s.querySelectorAll('button,[href],input,select,textarea');if(!f.length)return;if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus()}return}}

function sendMsg(type,data){try{localStorage.setItem('wdiy-app-msg',JSON.stringify({type,data,from:document.title,ts:Date.now()}));localStorage.removeItem('wdiy-app-msg')}catch{}}
function onMsg(cb){window.addEventListener('storage',e=>{if(e.key!=='wdiy-app-msg'||!e.newValue)return;try{cb(JSON.parse(e.newValue))}catch{}})}

const KN=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let ki=0;
function initKN(){document.addEventListener('keydown',e=>{if(e.key===KN[ki]){ki++;if(ki===KN.length){ki=0;toggleMatrix()}}else ki=0})}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLF();
  const hB=$('helpBtn'),hC=$('helpCloseBtn'),hO=$('helpOverlay');if(hB)hB.onclick=openHelp;if(hC)hC.onclick=closeHelp;if(hO)hO.onclick=closeHelp;initHelpTabs();
  const sB=$('settingsBtn'),sC=$('settingsCloseBtn'),sO=$('settingsOverlay');if(sB)sB.onclick=openSettings;if(sC)sC.onclick=closeSettings;if(sO)sO.onclick=closeSettings;
  const lB=$('logBtn'),lC=$('logCloseBtn');if(lB)lB.onclick=toggleLog;if(lC)lC.onclick=closeLog;initLR();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}}}
  const wB=$('whisperBtn');if(wB)wB.onclick=toggleWhisper;
  const bB=$('breathingBtn'),dD=$('dhikrDisplay'),dB=$('dhikrBtn');if(bB)bB.onclick=()=>{toggleBG();if(dD)dD.style.display=breathGuideOn?'flex':'none'};if(dB)dB.onclick=incDhikr;
  const mB=$('musicBtn');if(mB)mB.onclick=toggleMusic;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}if(e.key==='Tab')trapFocus(e)});
  const ls=$('langSelect');if(ls)ls.onchange=()=>setLanguage(ls.value);
  const ts=$('themeSelect');if(ts)ts.onchange=()=>setTheme(ts.value);
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  onMsg(m=>log(`\ud83d\udce8 ${m.from}: ${m.type}`,'rx'));initKN();initMorse();
  const hd=$('hijriDate');if(hd){const h=calcHijri();if(h)hd.textContent=h}
  let lClicks=0,lTimer=null;if(lw){lw.style.cursor='pointer';lw.addEventListener('click',()=>{lClicks++;if(lTimer)clearTimeout(lTimer);if(lClicks>=3){lClicks=0;toggleMatrix()}else lTimer=setTimeout(()=>lClicks=0,500)})}
  log(LANG[currentLang].ready,'success');
  setTimeout(initBreathApp,50);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════ */
/* ═══════ BREATH MODULATOR SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════ */

let breathRunning=false,breathPhase=0,breathRate=14,breathDepth=50,isTx=false;
let breathData=[],carrierData=[];

function initBreathApp(){
  const canvas=$('breathCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=340;
  const W=canvas.width,H=canvas.height;let t=0;

  function drawGrid(){
    ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=.5;
    for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
    for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
  }

  function drawBreathEnvelope(){
    if(breathData.length<2)return;
    // Fill area
    ctx.beginPath();ctx.moveTo(0,H*.35);
    breathData.forEach((v,i)=>{ctx.lineTo(i,H*.35-v+H*.15)});
    ctx.lineTo(breathData.length-1,H*.35);ctx.closePath();
    ctx.fillStyle='rgba(102,255,204,.06)';ctx.fill();
    // Line
    ctx.beginPath();ctx.strokeStyle='#66ffcc';ctx.lineWidth=3;ctx.shadowColor='#66ffcc';ctx.shadowBlur=12;
    breathData.forEach((v,i)=>{const x=i,y=H*.25-v+H*.15;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
    ctx.stroke();ctx.shadowBlur=0;
  }

  function drawCarrier(){
    if(carrierData.length<2||!isTx)return;
    ctx.beginPath();ctx.strokeStyle='#ff6633';ctx.lineWidth=1;
    carrierData.forEach((v,i)=>{const x=i,y=H*.72+v;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
    ctx.stroke();
    // Carrier envelope ghost
    ctx.beginPath();ctx.strokeStyle='rgba(255,102,51,.15)';ctx.lineWidth=1;
    breathData.forEach((v,i)=>{const x=i,y=H*.72-v*.3;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
    ctx.stroke();
  }

  function drawLabels(){
    ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='10px Orbitron';
    ctx.fillText('BREATH ENVELOPE',10,20);
    ctx.fillText('RF CARRIER (433.92 MHz FM)',10,H*.57+15);
    // Divider
    ctx.strokeStyle='rgba(255,255,255,.08)';ctx.setLineDash([4,8]);
    ctx.beginPath();ctx.moveTo(0,H*.52);ctx.lineTo(W,H*.52);ctx.stroke();ctx.setLineDash([]);
  }

  function drawLungIcon(){
    if(!breathRunning)return;
    const cx=W-70,cy=H*.25;
    const expand=breathDepth/100;
    // Left lung
    ctx.beginPath();
    ctx.ellipse(cx-12,cy,8+expand*8,18+expand*12,0,0,Math.PI*2);
    ctx.fillStyle=`rgba(102,255,204,${.1+expand*.15})`;ctx.fill();
    ctx.strokeStyle=`rgba(102,255,204,${.3+expand*.3})`;ctx.lineWidth=1.5;ctx.stroke();
    // Right lung
    ctx.beginPath();
    ctx.ellipse(cx+12,cy,8+expand*8,18+expand*12,0,0,Math.PI*2);
    ctx.fill();ctx.stroke();
    // Trachea
    ctx.beginPath();ctx.moveTo(cx,cy-25);ctx.lineTo(cx,cy-5);
    ctx.moveTo(cx,cy-5);ctx.lineTo(cx-12,cy+5);
    ctx.moveTo(cx,cy-5);ctx.lineTo(cx+12,cy+5);
    ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='8px Orbitron';ctx.textAlign='center';
    ctx.fillText(`${breathDepth}%`,cx,cy+35);ctx.textAlign='left';
  }

  function drawFreqDisplay(){
    if(!breathRunning)return;
    const envelope=Math.sin(breathPhase)*.5+.5;
    const freq=433.92+envelope*.5;
    const dev=envelope*.5;
    const fx=W-140,fy=H*.6,fw=130,fh=60;
    ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(fx,fy,fw,fh);
    ctx.strokeStyle='rgba(255,102,51,.3)';ctx.strokeRect(fx,fy,fw,fh);
    ctx.fillStyle='#ff6633';ctx.font='bold 16px Orbitron';ctx.textAlign='center';
    ctx.fillText(`${freq.toFixed(2)}`,fx+fw/2,fy+25);
    ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='9px Orbitron';
    ctx.fillText('MHz',fx+fw/2,fy+38);
    ctx.fillText(`\u0394f = \u00b1${(dev*1000).toFixed(0)} kHz`,fx+fw/2,fy+52);
    ctx.textAlign='left';
  }

  function drawTxIndicator(){
    if(!isTx)return;
    const ix=10,iy=H*.57;
    // Animated TX rings
    for(let i=0;i<4;i++){
      const r=10+i*8+(t*40)%50;
      const a=Math.max(0,(1-i/4)*.4);
      ctx.beginPath();ctx.arc(ix+30,iy+30,r,-Math.PI*.3,Math.PI*.3);
      ctx.strokeStyle=`rgba(255,102,51,${a})`;ctx.lineWidth=1.5;ctx.stroke();
    }
    ctx.fillStyle='#ff6633';ctx.font='bold 10px Orbitron';ctx.fillText('TX ON',ix+50,iy+25);
  }

  function frame(){
    ctx.fillStyle='rgba(0,0,0,.06)';ctx.fillRect(0,0,W,H);t+=.016;

    if(breathRunning){
      breathPhase+=.016*breathRate/60*Math.PI*2;
      const envelope=Math.sin(breathPhase)*.5+.5;
      breathDepth=Math.round(envelope*100);
      const carrierFreq=433.92+envelope*.5;
      breathData.push(envelope*H*.3);if(breathData.length>W)breathData.shift();
      const carrier=Math.sin(t*carrierFreq*2)*22*envelope;
      carrierData.push(carrier);if(carrierData.length>W)carrierData.shift();
      breathRate=Math.round(12+Math.sin(t*.08)*3+Math.random()*.5);

      const bd=$('breathDisplay'),sr=$('statRate'),sd=$('statDepth'),sc=$('statCarrier'),sv=$('statDev');
      const phase=envelope>.5?'Inhale...':'Exhale...';
      if(bd)bd.textContent=`${phase} | Rate: ${breathRate} BrPM | Carrier: ${carrierFreq.toFixed(2)} MHz`;
      if(sr)sr.textContent=breathRate;if(sd)sd.textContent=breathDepth;
      if(sc)sc.textContent=carrierFreq.toFixed(2);if(sv)sv.textContent=(envelope*.5).toFixed(2);

      const mf=$('modFill'),ml=$('modLabel');
      if(mf)mf.style.width=breathDepth+'%';
      if(ml)ml.textContent=`Modulation Depth: ${breathDepth}%`;

      // Play ambient breath sound at cycle boundaries
      if(Math.abs(envelope-.5)<.02&&Math.sin(breathPhase)>0)playSound('breathe');
    }

    drawGrid();
    drawBreathEnvelope();
    drawCarrier();
    drawLabels();
    drawLungIcon();
    drawFreqDisplay();
    drawTxIndicator();

    // Ambient particles
    if(breathRunning){
      for(let i=0;i<2;i++){
        ctx.fillStyle=`rgba(102,255,204,${Math.random()*.08})`;
        ctx.fillRect(Math.random()*W,Math.random()*H*.5,2,2);
      }
      if(isTx){
        for(let i=0;i<2;i++){
          ctx.fillStyle=`rgba(255,102,51,${Math.random()*.08})`;
          ctx.fillRect(Math.random()*W,H*.55+Math.random()*H*.4,2,2);
        }
      }
    }

    requestAnimationFrame(frame);
  }
  frame();

  // Controls
  const startBtn=$('startBtn'),inhaleBtn=$('inhaleBtn'),exhaleBtn=$('exhaleBtn'),txBtn=$('txBtn');
  if(startBtn)startBtn.onclick=()=>{
    breathRunning=!breathRunning;setStatus(breathRunning);
    const span=startBtn.querySelector('[data-i18n]'),s=LANG[currentLang];
    if(span)span.textContent=breathRunning?(s.stopBreath||'Stop'):s.startBreath;
    log(breathRunning?s.breathStarted:s.breathStopped,'info');
  };
  if(inhaleBtn)inhaleBtn.onclick=()=>{breathPhase=Math.PI/2;log('Manual inhale','info');playSound('click')};
  if(exhaleBtn)exhaleBtn.onclick=()=>{breathPhase=3*Math.PI/2;log('Manual exhale','info');playSound('click')};
  if(txBtn)txBtn.onclick=()=>{
    isTx=!isTx;
    const span=txBtn.querySelector('[data-i18n]'),s=LANG[currentLang];
    if(span)span.textContent=isTx?(s.txOff||'TX Off'):(s.txBtn||'TX On');
    log(isTx?'TX: Carrier modulation ON':'TX: Carrier OFF',isTx?'tx':'info');
    showToast(isTx?'Transmitting...':'TX Off',1500);
    if(isTx)playSound('tx');
    sendMsg('breath-tx',{active:isTx,rate:breathRate});
  };
}
