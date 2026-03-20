/**
 * Satellite Listener — NOAA Weather
 * Workshop DIY — v1.2
 * Decode satellite weather images from NOAA
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3V160.8c0-4.2.1-7.8.1-7.9zM208.4,151.3h-6.5v3.2h6.5v-3.2zm-13,16.2h-3.2V151.3h3.2v16.2zm19.5,0h-3.2V151.3h3.2v16.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8V164.1l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9V152.7h-3.9v-4.7h14.5z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;switch(type){case'click':osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);break;case'success':osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);break;case'error':osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);break;}}

const LANG={en:{title:'Satellite Listener',subtitle:'Satellite Listener \u2014 NOAA Weather',disconnected:'No Signal',connected:'Receiving',mainSection:'Satellite Listener',mainDesc:'Decode satellite weather images',sectionA:'Reception Log',sectionB:'How Satellite Reception Works',sectionC:'NOAA Satellite Database',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'\u2699\uFE0F Settings',language:'Language',help:'\u2753 Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What satellites does this receive?',faq_a1:'Simulated NOAA 15, 18, 19 at 137 MHz.',faq_q2:'What is APT?',faq_a2:'Automatic Picture Transmission - analog image from NOAA sats.',faq_q3:'Is this real data?',faq_a3:'No, simulation. Real reception needs SDR + V-dipole antenna.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Select a NOAA satellite.',howto_2:'Click Track Satellite.',howto_3:'Watch the waterfall.',howto_4:'See the image build line by line.',wiki_noaa_title:'NOAA Satellites',wiki_noaa:'Polar-orbiting weather sats at 137 MHz.',wiki_apt_title:'APT Format',wiki_apt:'2080 px/line, 2 lines/sec, AM subcarrier 2400 Hz.',working:'Working\u2026',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'\uD83D\uDE80 Satellite Listener ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',filterAll:'All',soundEffects:'Sound effects',breathingGuide:'Breathing guide',dhikrTap:'Tap',splashHint:'tap to skip',langChanged:'\uD83C\uDF10 Language \u2192 English',themeChanged:'\uD83C\uDFA8 Theme \u2192',satellite:'Satellite',elevation:'Elevation',signalLabel:'Signal',progress:'Progress',aptImage:'APT Decoded Weather Image',trackSat:'Track Satellite',stopTrack:'Stop',clearImg:'Clear Image',rxHint:'Track a satellite to begin receiving.',guideTitle:'How Satellite Reception Works',guideP1:'NOAA weather satellites orbit at ~850 km, passing overhead every ~100 minutes.',guideP2:'They transmit APT images at 137 MHz. Signal rises as the satellite appears above the horizon.',guideP3:'APT encodes grayscale image data as 2400 Hz AM audio. Each image line takes 0.5 seconds.',dbTitle:'NOAA Satellite Database',passComplete:'Pass complete! Image decoded.',tracking:'Tracking',aos:'AOS (Acquisition of Signal)',los:'LOS (Loss of Signal)',maxEl:'Max elevation',step1Title:'Configure RF',step1Desc:'Set the frequency band, modulation type, and signal parameters.',step2Title:'Capture Spectrum',step2Desc:'Scan the radio spectrum to detect and capture signals of interest.',step3Title:'Analyze Signal',step3Desc:'Apply signal processing to identify modulation, encoding, and source.',step4Title:'Classify & Report',step4Desc:'Categorize the signal type and log detailed analysis results.',sectionCode:'Device Code'},
fr:{title:'\u00c9coute Satellite',subtitle:'\u00c9coute Satellite \u2014 M\u00e9t\u00e9o NOAA',disconnected:'Pas de signal',connected:'R\u00e9ception',mainSection:'\u00c9coute Satellite',mainDesc:'D\u00e9coder les images m\u00e9t\u00e9o',sectionA:'Journal R\u00e9ception',sectionB:'R\u00e9ception Satellite',sectionC:'Base NOAA',activityLog:'Journal',eventsMsg:'\u00c9v\u00e9nements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Th\u00e8me',settings:'\u2699\uFE0F Param\u00e8tres',language:'Langue',help:'\u2753 Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'Quels satellites ?',faq_a1:'NOAA 15, 18, 19 simul\u00e9s.',faq_q2:'Qu\'est-ce que l\'APT ?',faq_a2:'Transmission d\'image automatique.',faq_q3:'Donn\u00e9es r\u00e9elles ?',faq_a3:'Non, simulation.',faq_q4:'Priv\u00e9 ?',faq_a4:'Oui.',howto_1:'S\u00e9lectionnez un satellite.',howto_2:'Cliquez Suivre.',howto_3:'Regardez la cascade.',howto_4:'L\'image se construit ligne par ligne.',wiki_noaa_title:'Satellites NOAA',wiki_noaa:'Satellites m\u00e9t\u00e9o polaires \u00e0 137 MHz.',wiki_apt_title:'Format APT',wiki_apt:'2080 px/ligne, 2 lignes/sec.',working:'En cours\u2026',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'\uD83D\uDE80 \u00c9coute Satellite pr\u00eate !',logCleared:'Effac\u00e9',copied:'Copi\u00e9 !',copyFail:'\u00c9chec',filterAll:'Tout',soundEffects:'Effets sonores',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',splashHint:'appuyer',langChanged:'\uD83C\uDF10 Fran\u00e7ais',themeChanged:'\uD83C\uDFA8 Th\u00e8me \u2192',satellite:'Satellite',elevation:'\u00c9l\u00e9vation',signalLabel:'Signal',progress:'Progr\u00e8s',aptImage:'Image APT D\u00e9cod\u00e9e',trackSat:'Suivre Satellite',stopTrack:'Arr\u00eat',clearImg:'Effacer Image',rxHint:'Suivez un satellite pour recevoir.',guideTitle:'R\u00e9ception Satellite',guideP1:'Les satellites NOAA orbitent \u00e0 ~850 km.',guideP2:'Ils transmettent des images APT \u00e0 137 MHz.',guideP3:'L\'APT encode en audio AM \u00e0 2400 Hz.',dbTitle:'Base NOAA',passComplete:'Passage termin\u00e9 ! Image d\u00e9cod\u00e9e.',tracking:'Suivi',aos:'AOS',los:'LOS',maxEl:'\u00c9l\u00e9vation max',step1Title:'Configurer RF',step1Desc:'Règle la bande de fréquence, le type de modulation et les paramètres.',step2Title:'Capturer le spectre',step2Desc:'Scanne le spectre radio pour détecter et capturer les signaux.',step3Title:'Analyser le signal',step3Desc:'Applique le traitement du signal pour identifier la modulation et la source.',step4Title:'Classifier et rapporter',step4Desc:'Catégorise le type de signal et enregistre les résultats.',sectionCode:'Code Appareil'},
ar:{title:'\u0645\u0633\u062A\u0645\u0639 \u0627\u0644\u0623\u0642\u0645\u0627\u0631',subtitle:'\u0645\u0633\u062A\u0645\u0639 \u0627\u0644\u0623\u0642\u0645\u0627\u0631 \u2014 \u0637\u0642\u0633 NOAA',disconnected:'\u0644\u0627 \u0625\u0634\u0627\u0631\u0629',connected:'\u0627\u0633\u062A\u0642\u0628\u0627\u0644',mainSection:'\u0645\u0633\u062A\u0645\u0639 \u0627\u0644\u0623\u0642\u0645\u0627\u0631',mainDesc:'\u0641\u0643 \u062A\u0634\u0641\u064A\u0631 \u0635\u0648\u0631 \u0627\u0644\u0637\u0642\u0633',sectionA:'\u0633\u062C\u0644 \u0627\u0644\u0627\u0633\u062A\u0642\u0628\u0627\u0644',sectionB:'\u0643\u064A\u0641 \u064A\u0639\u0645\u0644 \u0627\u0644\u0627\u0633\u062A\u0642\u0628\u0627\u0644',sectionC:'\u0642\u0627\u0639\u062F\u0629 NOAA',activityLog:'\u0633\u062C\u0644',eventsMsg:'\u0627\u0644\u0623\u062D\u062F\u0627\u062B',clear:'\u0645\u0633\u062D',copy:'\u0646\u0633\u062E',export:'\u062A\u0635\u062F\u064A\u0631',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u2699\uFE0F \u0625\u0639\u062F\u0627\u062F\u0627\u062A',language:'\u0627\u0644\u0644\u063A\u0629',help:'\u2753 \u0645\u0633\u0627\u0639\u062F\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064A\u0641',wiki:'\u0648\u064A\u0643\u064A',faq_q1:'\u0623\u064A \u0623\u0642\u0645\u0627\u0631\u061F',faq_a1:'NOAA 15, 18, 19 \u0645\u062D\u0627\u0643\u0627\u0629.',faq_q2:'\u0645\u0627 \u0647\u0648 APT\u061F',faq_a2:'\u0646\u0642\u0644 \u0635\u0648\u0631 \u062A\u0644\u0642\u0627\u0626\u064A.',faq_q3:'\u0628\u064A\u0627\u0646\u0627\u062A \u062D\u0642\u064A\u0642\u064A\u0629\u061F',faq_a3:'\u0645\u062D\u0627\u0643\u0627\u0629.',faq_q4:'\u062E\u0627\u0635\u061F',faq_a4:'\u0646\u0639\u0645.',howto_1:'\u0627\u062E\u062A\u0631 \u0642\u0645\u0631.',howto_2:'\u0627\u0646\u0642\u0631 \u062A\u062A\u0628\u0639.',howto_3:'\u0631\u0627\u0642\u0628 \u0627\u0644\u0634\u0644\u0627\u0644.',howto_4:'\u0627\u0644\u0635\u0648\u0631\u0629 \u062A\u0628\u0646\u0649 \u0633\u0637\u0631\u064B\u0627.',wiki_noaa_title:'\u0623\u0642\u0645\u0627\u0631 NOAA',wiki_noaa:'\u0623\u0642\u0645\u0627\u0631 \u0637\u0642\u0633 \u0642\u0637\u0628\u064A\u0629 137 MHz.',wiki_apt_title:'\u0635\u064A\u063A\u0629 APT',wiki_apt:'2080 \u0628\u0643\u0633\u0644/\u0633\u0637\u0631.',working:'\u062C\u0627\u0631\u064D\u2026',t_mosque:'\u0645\u0633\u062C\u062F',t_zellige:'\u0632\u0644\u064A\u062C',t_andalus:'\u0623\u0646\u062F\u0644\u0633',t_riad:'\u0631\u064A\u0627\u0636',t_medina:'\u0645\u062F\u064A\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062F\u063A\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062A',ready:'\uD83D\uDE80 \u0645\u0633\u062A\u0645\u0639 \u0627\u0644\u0623\u0642\u0645\u0627\u0631 \u062C\u0627\u0647\u0632!',logCleared:'\u062A\u0645',copied:'\u062A\u0645!',copyFail:'\u0641\u0634\u0644',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062B\u0631\u0627\u062A',breathingGuide:'\u062F\u0644\u064A\u0644 \u0627\u0644\u062A\u0646\u0641\u0633',dhikrTap:'\u0627\u0636\u063A\u0637',splashHint:'\u0627\u0646\u0642\u0631',langChanged:'\uD83C\uDF10 \u0627\u0644\u0639\u0631\u0628\u064A\u0629',themeChanged:'\uD83C\uDFA8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',satellite:'\u0642\u0645\u0631',elevation:'\u0627\u0644\u0627\u0631\u062A\u0641\u0627\u0639',signalLabel:'\u0625\u0634\u0627\u0631\u0629',progress:'\u062A\u0642\u062F\u0645',aptImage:'\u0635\u0648\u0631\u0629 APT',trackSat:'\u062A\u062A\u0628\u0639 \u0627\u0644\u0642\u0645\u0631',stopTrack:'\u0625\u064A\u0642\u0627\u0641',clearImg:'\u0645\u0633\u062D \u0627\u0644\u0635\u0648\u0631\u0629',rxHint:'\u062A\u062A\u0628\u0639 \u0642\u0645\u0631\u064B\u0627 \u0644\u0644\u0628\u062F\u0621.',guideTitle:'\u0627\u0633\u062A\u0642\u0628\u0627\u0644 \u0627\u0644\u0623\u0642\u0645\u0627\u0631',guideP1:'\u0623\u0642\u0645\u0627\u0631 NOAA \u062A\u062F\u0648\u0631 \u0639\u0644\u0649 850 \u0643\u0645.',guideP2:'\u062A\u0631\u0633\u0644 \u0635\u0648\u0631 APT \u0639\u0644\u0649 137 MHz.',guideP3:'APT \u064A\u0634\u0641\u0631 \u0627\u0644\u0635\u0648\u0631\u0629 \u0628\u0635\u0648\u062A AM 2400 Hz.',dbTitle:'\u0642\u0627\u0639\u062F\u0629 NOAA',passComplete:'\u0627\u0643\u062A\u0645\u0644 \u0627\u0644\u0645\u0631\u0648\u0631! \u062A\u0645 \u0641\u0643 \u0627\u0644\u062A\u0634\u0641\u064A\u0631.',tracking:'\u062A\u062A\u0628\u0639',aos:'AOS',los:'LOS',maxEl:'\u0623\u0642\u0635\u0649 \u0627\u0631\u062A\u0641\u0627\u0639',step1Title:'تكوين RF',step1Desc:'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.',step2Title:'التقاط الطيف',step2Desc:'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.',step3Title:'تحليل الإشارة',step3Desc:'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.',step4Title:'تصنيف والتقرير',step4Desc:'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.',sectionCode:'كود الجهاز'}};

let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=`${s.title} \u2014 Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');buildGuide();buildDatabase();}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}const s=LANG[currentLang];log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(rid);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),contents=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));contents.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const tid='help'+n.charAt(0).toUpperCase()+n.slice(1);const tgt=$(tid);if(tgt)tgt.classList.add('active');});});}
function initLogResize(){const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;let dragging=false,startX,startW;handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;document.body.style.cursor='col-resize';e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=startX-e.clientX;const nw=Math.max(200,Math.min(startW+dx,window.innerWidth*0.6));document.documentElement.style.setProperty('--log-width',nw+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;document.body.style.cursor='';});}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));}function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

/* ═══════════════════════════════════════════════════════════════
   APP-SPECIFIC: SATELLITE LISTENER
   ═══════════════════════════════════════════════════════════════ */
const SATS={noaa15:{name:'NOAA 15',freq:'137.620 MHz',maxEl:72},noaa18:{name:'NOAA 18',freq:'137.9125 MHz',maxEl:65},noaa19:{name:'NOAA 19',freq:'137.100 MHz',maxEl:80}};
let wfCanvas,wfCtx,wfW=780,wfH=150;
let imgCanvas,imgCtx,imgW=780,imgH=300;
let tracking=false,passProgress=0,passTimer=null,imgLine=0;
const PASS_DURATION=600;// frames for full pass

function powerToColor(dBm){const t=Math.max(0,Math.min(1,(dBm+120)/80));let r,g,b;if(t<0.25){r=0;g=0;b=Math.floor(t/0.25*200);}else if(t<0.5){const u=(t-0.25)/0.25;r=0;g=Math.floor(u*200);b=200;}else if(t<0.75){const u=(t-0.5)/0.25;r=Math.floor(u*255);g=200;b=Math.floor((1-u)*200);}else{const u=(t-0.75)/0.25;r=255;g=Math.floor((1-u)*200+u*255);b=Math.floor(u*255);}return `rgb(${r},${g},${b})`;}

function getElevation(progress){return Math.sin(progress*Math.PI)*SATS[$('satSelect').value].maxEl;}
function getSignalStrength(elev){if(elev<2)return -120;return -120+(elev/90)*80+(Math.random()-0.5)*5;}

function generateWfLine(sigStr){
  const line=new Float32Array(wfW);
  for(let i=0;i<wfW;i++){line[i]=-115+(Math.random()-0.5)*8;}
  // Signal at center band
  const cx=wfW/2,bw=40+sigStr*0.3;
  for(let i=Math.max(0,Math.floor(cx-bw));i<Math.min(wfW,Math.ceil(cx+bw));i++){
    const d=Math.abs(i-cx)/bw;const env=Math.max(0,1-d*d);
    line[i]=Math.max(line[i],sigStr+env*20+(Math.random()-0.5)*3);
  }
  return line;
}

function drawWfLine(line){
  if(!wfCtx)return;
  const img=wfCtx.getImageData(0,0,wfW,wfH-1);wfCtx.putImageData(img,0,1);
  for(let x=0;x<wfW;x++){wfCtx.fillStyle=powerToColor(line[x]);wfCtx.fillRect(x,0,1,1);}
}

function generateImageLine(elev){
  // Simulated weather image: clouds, land, ocean patterns
  const line=new Uint8ClampedArray(imgW*4);
  const noise=()=>Math.random()*30-15;
  const seed=imgLine*0.02;
  for(let x=0;x<imgW;x++){
    const nx=x/imgW;
    // Base: ocean (dark) with land masses and cloud patterns
    let val=80;// base ocean
    // Continent shape using sine waves
    val+=Math.sin(nx*6+seed)*20+Math.sin(nx*12+seed*1.5)*10;
    // Cloud bands
    val+=Math.sin(seed*3+nx*4)*25*Math.max(0,Math.sin(nx*2+seed*0.5));
    // Cyclone patterns
    const cx=0.3+Math.sin(seed*0.1)*0.2;const cy=imgLine/imgH;
    const dist=Math.hypot(nx-cx,cy-0.5);
    if(dist<0.3)val+=Math.sin(dist*30-seed*5)*(1-dist/0.3)*40;
    // Signal quality affects noise
    const sigQuality=elev/90;
    val+=noise()*(2-sigQuality);
    val=Math.max(0,Math.min(255,val));
    // Grayscale with slight blue tint for ocean
    const isOcean=val<100;
    line[x*4]=isOcean?val*0.8:val;
    line[x*4+1]=isOcean?val*0.85:val;
    line[x*4+2]=isOcean?val*1.1:val*0.95;
    line[x*4+3]=255;
  }
  return line;
}

function drawImageLine(lineData){
  if(!imgCtx)return;
  const id=imgCtx.createImageData(imgW,1);id.data.set(lineData);
  imgCtx.putImageData(id,0,imgLine%imgH);
  // Scan line indicator
  imgCtx.strokeStyle='rgba(0,255,0,0.5)';imgCtx.lineWidth=1;
  imgCtx.beginPath();imgCtx.moveTo(0,(imgLine+1)%imgH);imgCtx.lineTo(imgW,(imgLine+1)%imgH);imgCtx.stroke();
}

function passFrame(){
  if(!tracking)return;
  passProgress+=1/PASS_DURATION;
  if(passProgress>=1){stopTracking();const s=LANG[currentLang];log(s.passComplete,'success');return;}
  const elev=getElevation(passProgress);
  const sigStr=getSignalStrength(elev);
  $('elevDisplay').textContent=elev.toFixed(1)+'\u00b0';
  $('sigStrength').textContent=sigStr.toFixed(0)+' dBm';
  $('passProgress').textContent=Math.floor(passProgress*100)+'%';
  const wfLine=generateWfLine(sigStr);drawWfLine(wfLine);
  // Only decode image when signal is decent
  if(sigStr>-90){
    const imgLineData=generateImageLine(elev);drawImageLine(imgLineData);imgLine++;
  }
  passTimer=requestAnimationFrame(passFrame);
}

function startTracking(){
  if(tracking)return;tracking=true;passProgress=0;imgLine=0;
  const sat=SATS[$('satSelect').value];
  $('trackBtn').disabled=true;$('stopTrackBtn').disabled=false;
  setStatus(true);
  log(`${LANG[currentLang].tracking} ${sat.name} (${sat.freq})`,'rx');
  addRxLog('AOS',sat.name);
  passFrame();
}

function stopTracking(){
  tracking=false;if(passTimer)cancelAnimationFrame(passTimer);
  $('trackBtn').disabled=false;$('stopTrackBtn').disabled=true;
  setStatus(false);
  const sat=SATS[$('satSelect').value];
  addRxLog('LOS',sat.name);
  log(`LOS ${sat.name}. Lines decoded: ${imgLine}`,'info');
}

function clearImage(){
  if(imgCtx){imgCtx.fillStyle='#111';imgCtx.fillRect(0,0,imgW,imgH);}
  if(wfCtx){wfCtx.fillStyle='#000';wfCtx.fillRect(0,0,wfW,wfH);}
  imgLine=0;passProgress=0;
  $('elevDisplay').textContent='0\u00b0';$('sigStrength').textContent='-120 dBm';$('passProgress').textContent='0%';
  log('Image cleared','info');
}

let rxLogs=[];
function addRxLog(type,sat){
  rxLogs.unshift({type,sat,time:new Date().toLocaleTimeString()});
  const el=$('receptionLog');if(!el)return;el.innerHTML='';
  rxLogs.slice(0,15).forEach(r=>{
    const row=document.createElement('div');row.style.cssText='display:flex;align-items:center;gap:8px;padding:4px 8px;border-radius:8px;background:rgba(0,0,0,.2);border:1px solid var(--border);';
    const icon=r.type==='AOS'?'<span style="color:#22c55e;">&#x25B2;</span>':'<span style="color:#ef4444;">&#x25BC;</span>';
    row.innerHTML=`${icon}<span style="font-size:.75rem;color:var(--accent);min-width:32px;">${r.type}</span><span style="flex:1;font-size:.72rem;">${r.sat}</span><span style="font-size:.6rem;color:var(--text-muted);">${r.time}</span>`;
    el.appendChild(row);
  });
}

function buildGuide(){const el=$('satGuide');if(!el)return;const s=LANG[currentLang];el.innerHTML=`<strong>${s.guideTitle}</strong><br><br>${s.guideP1}<br><br>${s.guideP2}<br><br>${s.guideP3}`;}
function buildDatabase(){const el=$('noaaDB');if(!el)return;const s=LANG[currentLang];
  const sats=[{name:'NOAA 15',freq:'137.620 MHz',launch:'1998',status:'Active (degraded)'},{name:'NOAA 18',freq:'137.9125 MHz',launch:'2005',status:'Active'},{name:'NOAA 19',freq:'137.100 MHz',launch:'2009',status:'Active (primary)'},{name:'Meteor-M2',freq:'137.100 MHz',launch:'2014',status:'Active (LRPT)'},{name:'Meteor-M2-2',freq:'137.900 MHz',launch:'2019',status:'Active (LRPT)'}];
  let html=`<strong>${s.dbTitle}</strong><br><br><div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:4px 8px;"><strong style="font-size:.7rem;">Satellite</strong><strong style="font-size:.7rem;">Frequency</strong><strong style="font-size:.7rem;">Launch</strong><strong style="font-size:.7rem;">Status</strong>`;
  sats.forEach(sat=>{html+=`<span style="color:var(--accent);">${sat.name}</span><span>${sat.freq}</span><span>${sat.launch}</span><span style="color:var(--text-muted);">${sat.status}</span>`;});
  html+='</div>';el.innerHTML=html;}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initHijriDate();

  wfCanvas=$('waterfallCanvas');if(wfCanvas){wfCtx=wfCanvas.getContext('2d');wfW=wfCanvas.width;wfH=wfCanvas.height;wfCtx.fillStyle='#000';wfCtx.fillRect(0,0,wfW,wfH);}
  imgCanvas=$('imageCanvas');if(imgCanvas){imgCtx=imgCanvas.getContext('2d');imgW=imgCanvas.width;imgH=imgCanvas.height;imgCtx.fillStyle='#111';imgCtx.fillRect(0,0,imgW,imgH);}
  $('trackBtn').onclick=startTracking;$('stopTrackBtn').onclick=stopTracking;$('clearImgBtn').onclick=clearImage;
  buildGuide();buildDatabase();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Satellite Listener
   Animated polar orbit + signal cone + Doppler curve
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
function boot(){
  let el=document.getElementById('satSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='satSimCanvas';el.width=780;el.height=220;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#020810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.008;cx.fillStyle='#020810';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Earth arc
  const ecx=W*.3,ecy=H+80,er=140;
  cx.strokeStyle='rgba(50,120,200,.2)';cx.lineWidth=2;cx.beginPath();cx.arc(ecx,ecy,er,Math.PI,2*Math.PI);cx.stroke();
  cx.fillStyle='rgba(30,80,150,.08)';cx.beginPath();cx.arc(ecx,ecy,er,Math.PI,2*Math.PI);cx.fill();
  // Ground station
  const gx=ecx,gy=ecy-er-2;
  cx.fillStyle='#4fc3f7';cx.beginPath();cx.moveTo(gx,gy-10);cx.lineTo(gx-5,gy);cx.lineTo(gx+5,gy);cx.closePath();cx.fill();
  cx.fillStyle='rgba(100,200,255,.4)';cx.font='8px monospace';cx.textAlign='center';cx.fillText('GND',gx,gy+10);
  // Satellite orbit
  const orbitR=er+60;const satAngle=t*1.5+Math.PI;
  const sx=ecx+Math.cos(satAngle)*orbitR,sy=ecy+Math.sin(satAngle)*orbitR;
  cx.strokeStyle='rgba(100,200,255,.1)';cx.lineWidth=1;cx.setLineDash([3,6]);
  cx.beginPath();cx.arc(ecx,ecy,orbitR,Math.PI,2*Math.PI);cx.stroke();cx.setLineDash([]);
  // Satellite
  if(sy<ecy){
    cx.fillStyle=acc;cx.fillRect(sx-6,sy-2,12,4);cx.fillRect(sx-12,sy-1,4,2);cx.fillRect(sx+8,sy-1,4,2);
    // Signal cone
    const dist=Math.hypot(sx-gx,sy-gy);const elev=Math.max(0,Math.asin((ecy-sy-er)/dist))*180/Math.PI;
    if(elev>5){cx.strokeStyle=`rgba(100,255,100,${Math.min(.3,elev/90)})`;cx.lineWidth=1;
    cx.beginPath();cx.moveTo(sx,sy);cx.lineTo(gx-15,gy);cx.moveTo(sx,sy);cx.lineTo(gx+15,gy);cx.stroke();}
  }
  // Doppler curve on right side
  cx.strokeStyle='rgba(100,200,255,.15)';cx.lineWidth=.5;
  for(let i=0;i<=4;i++){cx.beginPath();cx.moveTo(W*.55,i*H/4);cx.lineTo(W,i*H/4);cx.stroke();}
  cx.strokeStyle='#f59e0b';cx.lineWidth=1.5;cx.beginPath();
  for(let i=0;i<120;i++){
    const px=W*.55+i/120*(W*.43);const pt=i/120;
    const doppler=Math.cos(pt*Math.PI)*30;
    const py=H/2-doppler*(H*.01);
    if(i===0)cx.moveTo(px,py);else cx.lineTo(px,py);
  }
  cx.stroke();
  cx.fillStyle='rgba(245,158,11,.5)';cx.font='8px monospace';cx.textAlign='left';cx.fillText('Doppler Shift',W*.56,16);
  cx.fillStyle='rgba(100,200,255,.4)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('NOAA Polar Orbit Simulation — 137 MHz APT',8,14);
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
