/**
 * Workshop DIY — Bio Sweat Sensor Crypto v1.0
 * Sweat chemistry as cryptographic seed — Self-contained
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;
const LIGHT_THEMES=['riad','medina'];
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,t+.08);o.start(t);o.stop(t+.08)}else if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,t+.3);o.start(t);o.stop(t+.3)}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,t+.25);o.start(t);o.stop(t+.25)}}
const LANG={en:{title:'Bio Sweat Sensor Crypto',subtitle:'Sweat chemistry as crypto seed',disconnected:'Disconnected',connected:'Connected',mainSection:'Sweat Crypto \u2014 Bio-Chemical Key Generation',mainDesc:'Sweat chemistry and body temperature generate unique cryptographic seeds',sectionA:'A \u2014 How It Works',sectionC:'C \u2014 Challenges',btn1:'Start Sensors',btn1Stop:'Stop',btn2:'Exercise Mode',btn3:'Generate Seed',btn4:'Verify',stat1:'pH',stat2:'mM NaCl',stat3:'\u00b0C skin',stat4:'bits entropy',step1Title:'Sweat Collection',step1Desc:'Bio-sensors measure sweat pH, NaCl concentration, and humidity.',step2Title:'Temperature Sampling',step2Desc:'Skin temperature adds thermal entropy from activity and environment.',step3Title:'Chemical Analysis',step3Desc:'Multiple chemical markers create a unique bio-signature.',step4Title:'Key Derivation',step4Desc:'Chemical values hashed into a cryptographic seed unique to each person.',ch1Title:'Unique Keys',ch1Desc:'Generate keys at rest vs after exercise. How different?',ch2Title:'Bio-Authentication',ch2Desc:'Can you reproduce similar keys under same conditions?',ch3Title:'Entropy Race',ch3Desc:'Who generates the highest-entropy seed in 30 seconds?',faq_q1:'Is sweat unique?',faq_a1:'Yes! Sweat varies by genetics, diet, health, and activity.',faq_q2:'How is the seed generated?',faq_a2:'Multiple sensor readings combined via XOR and hashing.',howto_1:'Start sensors to begin collecting sweat data.',howto_2:'Use Exercise Mode to increase sweat output.',howto_3:'Generate Seed when enough data is collected.',wiki1_title:'\ud83d\udca6 Sweat Biochemistry',wiki1_text:'Sweat: NaCl 10-90mM, pH 4-7, lactate, urea \u2014 all vary per individual.',wiki2_title:'\ud83d\udd11 Entropy Sources',wiki2_text:'Bio-signal randomness: pH fluctuations, temperature drift, NaCl variations.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'\u2699\ufe0f Settings',language:'Language',theme:'Theme',help:'\u2753 Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',soundEffects:'\ud83d\udd0a Sound effects',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',working:'Working\u2026',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'\ud83d\udca6 Sweat Crypto ready \u2014 perspire to encrypt!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',langChanged:'\ud83c\udf10 Language \u2192 English',themeChanged:'\ud83c\udfa8 Theme \u2192'},
fr:{title:'Bio Crypto Sueur',subtitle:'Chimie de la sueur comme graine crypto',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'Crypto Sueur \u2014 G\u00e9n\u00e9ration de Cl\u00e9 Biochimique',mainDesc:'La chimie de la sueur g\u00e9n\u00e8re des graines cryptographiques uniques',sectionA:'A \u2014 Comment \u00e7a marche',sectionC:'C \u2014 D\u00e9fis',btn1:'D\u00e9marrer Capteurs',btn1Stop:'Arr\u00eat',btn2:'Mode Exercice',btn3:'G\u00e9n\u00e9rer Graine',btn4:'V\u00e9rifier',stat1:'pH',stat2:'mM NaCl',stat3:'\u00b0C peau',stat4:'bits entropie',step1Title:'Collecte Sueur',step1Desc:'Bio-capteurs mesurent pH, NaCl et humidit\u00e9.',step2Title:'Temp\u00e9rature',step2Desc:'La temp\u00e9rature cutan\u00e9e ajoute de l\'entropie thermique.',step3Title:'Analyse Chimique',step3Desc:'Marqueurs chimiques cr\u00e9ent une bio-signature unique.',step4Title:'D\u00e9rivation de Cl\u00e9',step4Desc:'Valeurs chimiques hach\u00e9es en graine cryptographique.',ch1Title:'Cl\u00e9s Uniques',ch1Desc:'Comparez repos vs exercice.',ch2Title:'Bio-Authentification',ch2Desc:'Reproduisez des cl\u00e9s similaires.',ch3Title:'Course Entropie',ch3Desc:'Plus haute entropie en 30 secondes?',faq_q1:'La sueur est-elle unique?',faq_a1:'Oui! Varie par g\u00e9n\u00e9tique, r\u00e9gime, sant\u00e9.',faq_q2:'Comment la graine est-elle g\u00e9n\u00e9r\u00e9e?',faq_a2:'Lectures combin\u00e9es par XOR et hachage.',howto_1:'D\u00e9marrez les capteurs.',howto_2:'Mode Exercice augmente la sueur.',howto_3:'G\u00e9n\u00e9rez quand assez de donn\u00e9es.',wiki1_title:'\ud83d\udca6 Biochimie',wiki1_text:'NaCl 10-90mM, pH 4-7, lactate, ur\u00e9e.',wiki2_title:'\ud83d\udd11 Entropie',wiki2_text:'Al\u00e9atoire biologique: fluctuations pH, temp, NaCl.',activityLog:'Journal',eventsMsg:'\u00c9v\u00e9nements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'\u2699\ufe0f Param\u00e8tres',language:'Langue',theme:'Th\u00e8me',help:'\u2753 Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',soundEffects:'\ud83d\udd0a Sons',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',splashHint:'appuyer',working:'En cours\u2026',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'\ud83d\udca6 Crypto sueur pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 Fran\u00e7ais',themeChanged:'\ud83c\udfa8 \u2192'},
ar:{title:'\u062a\u0634\u0641\u064a\u0631 \u0627\u0644\u0639\u0631\u0642',subtitle:'\u0643\u064a\u0645\u064a\u0627\u0621 \u0627\u0644\u0639\u0631\u0642 \u0643\u0628\u0630\u0631\u0629 \u062a\u0634\u0641\u064a\u0631',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u062a\u0634\u0641\u064a\u0631 \u0627\u0644\u0639\u0631\u0642 \u2014 \u062a\u0648\u0644\u064a\u062f \u0645\u0641\u062a\u0627\u062d \u0643\u064a\u0645\u064a\u0627\u0626\u064a',mainDesc:'\u0643\u064a\u0645\u064a\u0627\u0621 \u0627\u0644\u0639\u0631\u0642 \u062a\u0648\u0644\u062f \u0628\u0630\u0648\u0631 \u062a\u0634\u0641\u064a\u0631 \u0641\u0631\u064a\u062f\u0629',sectionA:'\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644',sectionC:'\u062c \u2014 \u062a\u062d\u062f\u064a\u0627\u062a',btn1:'\u0628\u062f\u0621 \u0627\u0644\u0645\u0633\u062a\u0634\u0639\u0631\u0627\u062a',btn1Stop:'\u0625\u064a\u0642\u0627\u0641',btn2:'\u0648\u0636\u0639 \u0627\u0644\u062a\u0645\u0631\u064a\u0646',btn3:'\u062a\u0648\u0644\u064a\u062f \u0628\u0630\u0631\u0629',btn4:'\u062a\u062d\u0642\u0642',stat1:'pH',stat2:'mM NaCl',stat3:'\u062f\u0631\u062c\u0629',stat4:'\u0628\u062a \u0625\u0646\u062a\u0631\u0648\u0628\u064a',step1Title:'\u062c\u0645\u0639 \u0627\u0644\u0639\u0631\u0642',step1Desc:'\u0645\u0633\u062a\u0634\u0639\u0631\u0627\u062a \u062a\u0642\u064a\u0633 pH \u0648NaCl \u0648\u0627\u0644\u0631\u0637\u0648\u0628\u0629.',step2Title:'\u0627\u0644\u062d\u0631\u0627\u0631\u0629',step2Desc:'\u062d\u0631\u0627\u0631\u0629 \u0627\u0644\u062c\u0644\u062f \u062a\u0636\u064a\u0641 \u0625\u0646\u062a\u0631\u0648\u0628\u064a \u062d\u0631\u0627\u0631\u064a.',step3Title:'\u062a\u062d\u0644\u064a\u0644 \u0643\u064a\u0645\u064a\u0627\u0626\u064a',step3Desc:'\u0639\u0644\u0627\u0645\u0627\u062a \u0643\u064a\u0645\u064a\u0627\u0626\u064a\u0629 \u062a\u0646\u0634\u0626 \u0628\u0635\u0645\u0629 \u0641\u0631\u064a\u062f\u0629.',step4Title:'\u0627\u0634\u062a\u0642\u0627\u0642 \u0627\u0644\u0645\u0641\u062a\u0627\u062d',step4Desc:'\u0642\u064a\u0645 \u0643\u064a\u0645\u064a\u0627\u0626\u064a\u0629 \u062a\u064f\u0647\u0634 \u0625\u0644\u0649 \u0628\u0630\u0631\u0629 \u062a\u0634\u0641\u064a\u0631.',ch1Title:'\u0645\u0641\u0627\u062a\u064a\u062d \u0641\u0631\u064a\u062f\u0629',ch1Desc:'\u0642\u0627\u0631\u0646 \u0631\u0627\u062d\u0629 \u0645\u0642\u0627\u0628\u0644 \u062a\u0645\u0631\u064a\u0646.',ch2Title:'\u0645\u0635\u0627\u062f\u0642\u0629 \u062d\u064a\u0648\u064a\u0629',ch2Desc:'\u0623\u0639\u062f \u0625\u0646\u062a\u0627\u062c \u0645\u0641\u0627\u062a\u064a\u062d \u0645\u0645\u0627\u062b\u0644\u0629.',ch3Title:'\u0633\u0628\u0627\u0642 \u0625\u0646\u062a\u0631\u0648\u0628\u064a',ch3Desc:'\u0623\u0639\u0644\u0649 \u0625\u0646\u062a\u0631\u0648\u0628\u064a \u0641\u064a 30 \u062b\u0627\u0646\u064a\u0629.',faq_q1:'\u0647\u0644 \u0627\u0644\u0639\u0631\u0642 \u0641\u0631\u064a\u062f\u061f',faq_a1:'\u0646\u0639\u0645! \u064a\u062e\u062a\u0644\u0641 \u062d\u0633\u0628 \u0627\u0644\u0648\u0631\u0627\u062b\u0629 \u0648\u0627\u0644\u063a\u0630\u0627\u0621.',faq_q2:'\u0643\u064a\u0641 \u062a\u064f\u0648\u0644\u062f \u0627\u0644\u0628\u0630\u0631\u0629\u061f',faq_a2:'\u0642\u0631\u0627\u0621\u0627\u062a \u0645\u062f\u0645\u062c\u0629 \u0628XOR \u0648\u0647\u0634.',howto_1:'\u0634\u063a\u0644 \u0627\u0644\u0645\u0633\u062a\u0634\u0639\u0631\u0627\u062a.',howto_2:'\u0648\u0636\u0639 \u0627\u0644\u062a\u0645\u0631\u064a\u0646 \u064a\u0632\u064a\u062f \u0627\u0644\u0639\u0631\u0642.',howto_3:'\u0648\u0644\u062f \u0627\u0644\u0628\u0630\u0631\u0629 \u0639\u0646\u062f \u0643\u0641\u0627\u064a\u0629 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a.',wiki1_title:'\ud83d\udca6 \u0643\u064a\u0645\u064a\u0627\u0621',wiki1_text:'NaCl 10-90mM\u060c pH 4-7\u060c \u0644\u0627\u0643\u062a\u0627\u062a\u060c \u064a\u0648\u0631\u064a\u0627.',wiki2_title:'\ud83d\udd11 \u0625\u0646\u062a\u0631\u0648\u0628\u064a',wiki2_text:'\u0639\u0634\u0648\u0627\u0626\u064a\u0629 \u062d\u064a\u0648\u064a\u0629: \u062a\u0642\u0644\u0628\u0627\u062a pH \u0648\u062d\u0631\u0627\u0631\u0629.',activityLog:'\u0633\u062c\u0644',eventsMsg:'\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',settings:'\u2699\ufe0f \u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0644\u063a\u0629',theme:'\u0645\u0638\u0647\u0631',help:'\u2753 \u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u062f\u0644\u064a\u0644',wiki:'\u0648\u064a\u0643\u064a',soundEffects:'\ud83d\udd0a \u0635\u0648\u062a',breathingGuide:'\u062a\u0646\u0641\u0633',dhikrTap:'\u0627\u0636\u063a\u0637',musicMode:'\u0645\u0648\u0633\u064a\u0642\u0649',splashHint:'\u0627\u0646\u0642\u0631',working:'\u062c\u0627\u0631\u064d\u2026',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',ready:'\ud83d\udca6 \u062a\u0634\u0641\u064a\u0631 \u0627\u0644\u0639\u0631\u0642 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\ud83c\udfa8 \u2190'}};

/* ═══════ FRAMEWORK (compact) ═══════ */
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(s[k]!=null)e.textContent=s[k]});document.title=`${s.title} \u2014 Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{};const s=LANG[currentLang];log(`${s.themeChanged} ${s['t_'+n]||n}`,'info')}
let logContainer;const logHistory=[];
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');logHistory.push({m,t,ts:Date.now()});applyLogFilter()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='sweat-crypto-log.txt';a.click()}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter()})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'||l.classList.contains(activeLogFilter)?'':'none'})}
let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
function calcHijriDate(){try{return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{return''}}
function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open')}
function closePanel(p,o,r){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open');const b=$(r);if(b)b.focus()}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn')}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(t=>{t.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));t.classList.add('active');const id='help'+t.dataset.tab.charAt(0).toUpperCase()+t.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active')})})}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,innerWidth*.6))+'px')});document.addEventListener('mouseup',()=>{d=false})}
let breathingActive=false;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive))}
function incrementDhikr(){const c=$('dhikrCounter');if(c)c.textContent=parseInt(c.textContent||'0')+1}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630';
function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>.975)drops[i]=0;drops[i]++}matrixAnim=requestAnimationFrame(draw)}draw()}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ SWEAT SENSOR CRYPTO SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════════════ */

let sensing=false,sweatPH=6.2,sweatNaCl=45,skinTemp=33.2,humidity=40,seedData=[],exerciseMode=false;

function initSweatApp(){
  const canvas=$('sweatCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=300;
  const W=canvas.width,H=canvas.height;let t=0;

  const gauges=[
    {label:'pH',key:'ph',min:4,max:8,color:'#33ff33',unit:'',get v(){return sweatPH}},
    {label:'NaCl',key:'nacl',min:10,max:90,color:'#6699ff',unit:'mM',get v(){return sweatNaCl}},
    {label:'Temp',key:'temp',min:28,max:40,color:'#ff6633',unit:'\u00b0C',get v(){return skinTemp}},
    {label:'Humidity',key:'hum',min:10,max:90,color:'#ffcc00',unit:'%',get v(){return humidity}}
  ];
  const histories={ph:[],nacl:[],temp:[],hum:[]};

  function frame(){
    ctx.fillStyle='rgba(0,0,0,.1)';ctx.fillRect(0,0,W,H);t+=.016;

    if(sensing){
      const ex=exerciseMode?1:0;
      sweatPH=5.5+Math.sin(t*.3)*.8+Math.random()*.2-ex*.3;
      sweatNaCl=40+Math.sin(t*.2)*15+Math.random()*5+ex*20;
      skinTemp=33+Math.sin(t*.1)*1.5+Math.random()*.3+ex*2;
      humidity=35+Math.sin(t*.15)*20+Math.random()*3+ex*15;
      seedData.push({ph:sweatPH,nacl:sweatNaCl,temp:skinTemp,hum:humidity,t:Date.now()});
      if(seedData.length>1000)seedData.shift();
      histories.ph.push(sweatPH);histories.nacl.push(sweatNaCl);histories.temp.push(skinTemp);histories.hum.push(humidity);
      Object.values(histories).forEach(h=>{if(h.length>120)h.shift()});
    }

    // Draw gauge bars
    const gw=W/4-15;
    gauges.forEach((g,i)=>{
      const gx=10+i*(gw+10),gy=15;
      ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(gx,gy,gw,H*.55);
      ctx.strokeStyle='rgba(255,255,255,.08)';ctx.strokeRect(gx,gy,gw,H*.55);

      const norm=(g.v-g.min)/(g.max-g.min);
      const barH=(H*.55-35)*Math.max(0,Math.min(1,norm));

      // Bar fill with gradient
      const grad=ctx.createLinearGradient(gx,gy+H*.55-35,gx,gy+H*.55-35-barH);
      grad.addColorStop(0,g.color);grad.addColorStop(1,g.color+'44');
      ctx.fillStyle=grad;ctx.fillRect(gx+5,gy+H*.55-35-barH,gw-10,barH);

      // Animated top cap
      ctx.fillStyle=g.color;ctx.fillRect(gx+5,gy+H*.55-40-barH,gw-10,4);

      // Labels
      ctx.fillStyle='#fff';ctx.font='bold 11px Orbitron';ctx.textAlign='center';
      ctx.fillText(g.label,gx+gw/2,gy+14);
      ctx.fillStyle=g.color;ctx.font='bold 14px Orbitron';
      ctx.fillText(`${g.v.toFixed(1)}${g.unit}`,gx+gw/2,gy+H*.55-8);
      ctx.textAlign='left';

      // Mini history graph
      const hist=histories[g.key];
      if(hist.length>1){
        const hy=gy+H*.55+8,hh=H*.35;
        ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(gx,hy,gw,hh);
        ctx.beginPath();ctx.strokeStyle=g.color+'88';ctx.lineWidth=1.5;
        hist.forEach((v,j)=>{
          const x=gx+(j/120)*gw;
          const y=hy+hh-((v-g.min)/(g.max-g.min))*hh;
          if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        });
        ctx.stroke();
      }
    });

    // Entropy indicator
    if(seedData.length>5){
      const entropy=calcEntropy();
      ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(W-130,H-30,122,22);
      ctx.fillStyle=entropy>6?'#33ff33':entropy>4?'#ffcc00':'#ff3366';
      ctx.font='bold 10px Orbitron';ctx.fillText(`Entropy: ${entropy.toFixed(1)} bits`,W-125,H-14);
    }

    // Stats
    const sp=$('statPH'),sn=$('statNaCl'),st=$('statTemp'),se=$('statEntropy');
    if(sp)sp.textContent=sweatPH.toFixed(1);if(sn)sn.textContent=Math.round(sweatNaCl);
    if(st)st.textContent=skinTemp.toFixed(1);
    if(se&&seedData.length>5)se.textContent=Math.round(calcEntropy()*seedData.length/8);

    requestAnimationFrame(frame);
  }
  frame();

  function calcEntropy(){
    if(seedData.length<10)return 0;
    const recent=seedData.slice(-50);
    const vals=recent.map(d=>Math.round(d.ph*10)^Math.round(d.nacl)^Math.round(d.temp*10)^Math.round(d.hum));
    const counts={};vals.forEach(v=>{counts[v]=(counts[v]||0)+1});
    let ent=0;const n=vals.length;
    Object.values(counts).forEach(c=>{const p=c/n;ent-=p*Math.log2(p)});
    return ent;
  }

  // Controls
  const startBtn=$('startBtn'),exBtn=$('exerciseBtn'),genBtn=$('genBtn'),verBtn=$('verifyBtn');

  if(startBtn)startBtn.onclick=()=>{
    sensing=!sensing;setStatus(sensing);
    const span=startBtn.querySelector('[data-i18n]');
    if(span)span.textContent=sensing?LANG[currentLang].btn1Stop:LANG[currentLang].btn1;
    log(sensing?'\ud83d\udca6 Sweat sensors active':'Sensors off','info');
  };
  if(exBtn)exBtn.onclick=()=>{
    exerciseMode=!exerciseMode;exBtn.classList.toggle('active',exerciseMode);
    log(exerciseMode?'\ud83c\udfcb Exercise mode: increased sweat output':'Exercise mode off','info');
    showToast(exerciseMode?'Sweating intensified!':'Normal mode',1200);
  };
  if(genBtn)genBtn.onclick=()=>{
    if(seedData.length<20){log('Collect more sweat data first (need 20+ samples)','error');return}
    const key=seedData.slice(-32).map(d=>((Math.round(d.ph*100))^(Math.round(d.nacl*7))^(Math.round(d.temp*13))^(Math.round(d.hum*3)))&0xFF);
    const hex=key.map(b=>b.toString(16).padStart(2,'0')).join('');
    const out=$('seedOutput');if(out)out.textContent=hex;
    const bits=key.length*8;
    log(`\ud83d\udd11 Crypto seed: ${hex.slice(0,32)}... (${bits} bits, entropy ${calcEntropy().toFixed(1)})`,'success');
    showToast(`${bits}-bit seed from sweat!`,2000);
  };
  if(verBtn)verBtn.onclick=()=>{
    if(seedData.length<40){log('Need more data for verification','error');return}
    const half=Math.floor(seedData.length/2);
    const k1=seedData.slice(half-16,half).map(d=>((d.ph*100)^(d.nacl*7))&0xFF);
    const k2=seedData.slice(-16).map(d=>((d.ph*100)^(d.nacl*7))&0xFF);
    let match=0;k1.forEach((v,i)=>{if(v===k2[i])match++});
    const pct=Math.round(match/k1.length*100);
    log(`\u2705 Verification: ${pct}% similarity between seed halves (${pct<30?'GOOD randomness':'LOW randomness'})`,'success');
    showToast(`${pct}% similarity`,1500);
  };
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
  const lBtn=$('logBtn'),lC=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog;if(lC)lC.onclick=closeLog;initLogResize();
  const st=$('soundToggle');
  if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}}}
  const bb=$('breathingBtn'),dd=$('dhikrDisplay'),db=$('dhikrBtn');
  if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none'};
  if(db)db.onclick=incrementDhikr;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});
  const ls=$('langSelect');if(ls)ls.onchange=()=>setLanguage(ls.value);
  const ts=$('themeSelect');if(ts)ts.onchange=()=>setTheme(ts.value);
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  const hd=$('hijriDate');if(hd){const h=calcHijriDate();if(h)hd.textContent=h}
  let lc=0,lt=null;const logo=$('logoWrap');
  if(logo){logo.style.cursor='pointer';logo.onclick=()=>{lc++;if(lt)clearTimeout(lt);if(lc>=3){lc=0;toggleMatrix()}else lt=setTimeout(()=>lc=0,500)}}
  log(LANG[currentLang].ready,'success');
  setTimeout(initSweatApp,50);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
