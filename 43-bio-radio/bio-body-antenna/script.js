/**
 * Workshop DIY — Bio Body Antenna v1.0
 * Human body as 1.8MHz antenna — impedance measurement
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;
const FOOTER_ICON = '';
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){
  if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();
  const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
  osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;
  switch(type){case'click':osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.08);osc.start(t);osc.stop(t+.08);break;case'success':osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(.001,t+.3);osc.start(t);osc.stop(t+.3);break;case'error':osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(.001,t+.25);osc.start(t);osc.stop(t+.25);break;}
}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title:'Bio Body Antenna', subtitle:'Your body is a 1.8 MHz antenna',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'Body Antenna — Impedance Measurement', mainDesc:'Human body as 1.8 MHz receiving antenna with impedance analysis',
    sectionA:'A — How It Works', sectionC:'C — Challenges',
    startScan:'Start Scan', touchBody:'Touch Body', groundBtn:'Ground', sweepBtn:'Freq Sweep',
    statSWR:'SWR', statGain:'dBi', statZ:'\u2126 impedance',
    step1Title:'Body as Antenna', step1Desc:'The human body acts as a ~1.7m antenna, resonant near 1.8 MHz.',
    step2Title:'Impedance Probe', step2Desc:'A bridge circuit measures body impedance at different frequencies.',
    step3Title:'SWR Calculation', step3Desc:'Standing Wave Ratio shows antenna matching quality.',
    step4Title:'Signal Detection', step4Desc:'Touch changes antenna pattern. Grounding improves reception.',
    ch1Title:'Find the Resonance', ch1Desc:'Use frequency sweep to find your body resonant frequency.',
    ch2Title:'Ground Effect', ch2Desc:'Touch grounded metal — what happens to impedance?',
    ch3Title:'AM Radio Pickup', ch3Desc:'Sweep 500 kHz-1700 kHz. Detect AM stations with your body!',
    faq_q1:'Can my body be an antenna?', faq_a1:'Yes! The human body (~1.7m) resonates near 1.8 MHz as a quarter-wave antenna.',
    faq_q2:'What is impedance?', faq_a2:'Impedance Z = R + jX is total opposition to AC current flow.',
    faq_q3:'Is this safe?', faq_a3:'Yes, we only measure existing ambient signals passing through your body.',
    howto_1:'Click Start Scan to begin impedance measurement.',
    howto_2:'Click Touch Body to simulate skin contact.',
    howto_3:'Click Freq Sweep to scan 0.5-5 MHz.',
    wiki_ant_title:'\ud83d\udce1 Body Antenna Theory', wiki_ant:'A 1.7m body resonates at ~1.8 MHz (quarter-wave).',
    wiki_imp_title:'\u26a1 Impedance', wiki_imp:'Z = R + jX measured in ohms. SWR indicates matching.',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', export:'Export', filterAll:'All',
    settings:'\u2699\ufe0f Settings', language:'Language', theme:'Theme',
    help:'\u2753 Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    soundEffects:'\ud83d\udd0a Sound effects', whisperMode:'Whisper mode',
    breathingGuide:'Breathing guide', dhikrTap:'Tap', musicMode:'Music reactive',
    splashHint:'tap to skip', working:'Working\u2026',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
    ready:'\ud83d\udce1 Bio Body Antenna ready \u2014 touch to scan!',
    logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed',
    langChanged:'\ud83c\udf10 Language \u2192 English', themeChanged:'\ud83c\udfa8 Theme \u2192',
    scanning:'Scanning impedance...', touched:'Body contact detected!', grounded:'Grounded \u2014 impedance dropped!',
    sweepDone:'Frequency sweep complete', resonanceFound:'Resonance found at',
  },
  fr: {
    title:'Bio Antenne Corporelle', subtitle:'Votre corps est une antenne 1.8 MHz',
    disconnected:'D\u00e9connect\u00e9', connected:'Connect\u00e9',
    mainSection:'Antenne Corporelle \u2014 Mesure d\'imp\u00e9dance', mainDesc:'Corps humain comme antenne 1.8 MHz avec analyse d\'imp\u00e9dance',
    sectionA:'A \u2014 Comment \u00e7a marche', sectionC:'C \u2014 D\u00e9fis',
    startScan:'D\u00e9marrer Scan', touchBody:'Toucher Corps', groundBtn:'Masse', sweepBtn:'Balayage Fr\u00e9q',
    statSWR:'TOS', statGain:'dBi', statZ:'\u2126 imp\u00e9dance',
    step1Title:'Corps Antenne', step1Desc:'Le corps humain (~1.7m) r\u00e9sonne pr\u00e8s de 1.8 MHz.',
    step2Title:'Sonde Imp\u00e9dance', step2Desc:'Un circuit pont mesure l\'imp\u00e9dance corporelle.',
    step3Title:'Calcul TOS', step3Desc:'Le TOS montre la qualit\u00e9 d\'adaptation de l\'antenne.',
    step4Title:'D\u00e9tection Signal', step4Desc:'Le toucher modifie le diagramme. La mise \u00e0 la masse am\u00e9liore la r\u00e9ception.',
    ch1Title:'Trouver la R\u00e9sonance', ch1Desc:'Balayez les fr\u00e9quences pour trouver votre r\u00e9sonance.',
    ch2Title:'Effet de Masse', ch2Desc:'Touchez un m\u00e9tal reli\u00e9 \u00e0 la terre.',
    ch3Title:'R\u00e9ception AM', ch3Desc:'Balayez 500 kHz-1700 kHz.',
    faq_q1:'Mon corps peut-il \u00eatre une antenne?', faq_a1:'Oui! Le corps humain r\u00e9sonne pr\u00e8s de 1.8 MHz.',
    faq_q2:'Qu\'est-ce que l\'imp\u00e9dance?', faq_a2:'Z = R + jX est l\'opposition totale au courant AC.',
    faq_q3:'Est-ce s\u00fbr?', faq_a3:'Oui, nous mesurons uniquement les signaux ambiants.',
    howto_1:'Cliquez D\u00e9marrer Scan.', howto_2:'Cliquez Toucher Corps.', howto_3:'Cliquez Balayage Fr\u00e9q.',
    wiki_ant_title:'\ud83d\udce1 Th\u00e9orie Antenne', wiki_ant:'Un corps de 1.7m r\u00e9sonne \u00e0 ~1.8 MHz.',
    wiki_imp_title:'\u26a1 Imp\u00e9dance', wiki_imp:'Z = R + jX en ohms.',
    activityLog:'Journal', eventsMsg:'\u00c9v\u00e9nements', clear:'Effacer', copy:'Copier', export:'Exporter', filterAll:'Tout',
    settings:'\u2699\ufe0f Param\u00e8tres', language:'Langue', theme:'Th\u00e8me',
    help:'\u2753 Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    soundEffects:'\ud83d\udd0a Effets sonores', whisperMode:'Mode murmure',
    breathingGuide:'Guide respiratoire', dhikrTap:'Tap', musicMode:'R\u00e9actif musique',
    splashHint:'appuyer pour passer', working:'En cours\u2026',
    t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
    ready:'\ud83d\udce1 Antenne corporelle pr\u00eate!',
    logCleared:'Journal effac\u00e9', copied:'Copi\u00e9!', copyFail:'\u00c9chec',
    langChanged:'\ud83c\udf10 Langue \u2192 Fran\u00e7ais', themeChanged:'\ud83c\udfa8 Th\u00e8me \u2192',
    scanning:'Scan imp\u00e9dance...', touched:'Contact corporel d\u00e9tect\u00e9!', grounded:'Mass\u00e9 \u2014 imp\u00e9dance r\u00e9duite!',
    sweepDone:'Balayage termin\u00e9', resonanceFound:'R\u00e9sonance trouv\u00e9e \u00e0',
  },
  ar: {
    title:'\u0647\u0648\u0627\u0626\u064a \u0627\u0644\u062c\u0633\u0645', subtitle:'\u062c\u0633\u0645\u0643 \u0647\u0648\u0627\u0626\u064a 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632',
    disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644', connected:'\u0645\u062a\u0635\u0644',
    mainSection:'\u0647\u0648\u0627\u0626\u064a \u0627\u0644\u062c\u0633\u0645 \u2014 \u0642\u064a\u0627\u0633 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629', mainDesc:'\u0627\u0644\u062c\u0633\u0645 \u0627\u0644\u0628\u0634\u0631\u064a \u0643\u0647\u0648\u0627\u0626\u064a \u0627\u0633\u062a\u0642\u0628\u0627\u0644 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632',
    sectionA:'\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644', sectionC:'\u062c \u2014 \u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a',
    startScan:'\u0628\u062f\u0621 \u0627\u0644\u0645\u0633\u062d', touchBody:'\u0644\u0645\u0633 \u0627\u0644\u062c\u0633\u0645', groundBtn:'\u062a\u0623\u0631\u064a\u0636', sweepBtn:'\u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f',
    statSWR:'TOS', statGain:'dBi', statZ:'\u2126 \u0645\u0639\u0627\u0648\u0642\u0629',
    step1Title:'\u0627\u0644\u062c\u0633\u0645 \u0643\u0647\u0648\u0627\u0626\u064a', step1Desc:'\u0627\u0644\u062c\u0633\u0645 \u0627\u0644\u0628\u0634\u0631\u064a (~1.7\u0645) \u064a\u062a\u0631\u0646\u0646 \u0639\u0646\u062f 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632.',
    step2Title:'\u0645\u0633\u0628\u0627\u0631 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629', step2Desc:'\u062f\u0627\u0626\u0631\u0629 \u062c\u0633\u0631 \u062a\u0642\u064a\u0633 \u0645\u0639\u0627\u0648\u0642\u0629 \u0627\u0644\u062c\u0633\u0645.',
    step3Title:'\u062d\u0633\u0627\u0628 TOS', step3Desc:'TOS \u064a\u0648\u0636\u062d \u062c\u0648\u062f\u0629 \u062a\u0637\u0627\u0628\u0642 \u0627\u0644\u0647\u0648\u0627\u0626\u064a.',
    step4Title:'\u0643\u0634\u0641 \u0627\u0644\u0625\u0634\u0627\u0631\u0629', step4Desc:'\u0627\u0644\u0644\u0645\u0633 \u064a\u063a\u064a\u0631 \u0646\u0645\u0637 \u0627\u0644\u0647\u0648\u0627\u0626\u064a. \u0627\u0644\u062a\u0623\u0631\u064a\u0636 \u064a\u062d\u0633\u0646 \u0627\u0644\u0627\u0633\u062a\u0642\u0628\u0627\u0644.',
    ch1Title:'\u0627\u0628\u062d\u062b \u0639\u0646 \u0627\u0644\u0631\u0646\u064a\u0646', ch1Desc:'\u0627\u0633\u062a\u062e\u062f\u0645 \u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f \u0644\u0625\u064a\u062c\u0627\u062f \u062a\u0631\u062f\u062f \u0631\u0646\u064a\u0646 \u062c\u0633\u0645\u0643.',
    ch2Title:'\u062a\u0623\u062b\u064a\u0631 \u0627\u0644\u062a\u0623\u0631\u064a\u0636', ch2Desc:'\u0627\u0644\u0645\u0633 \u0645\u0639\u062f\u0646\u064b\u0627 \u0645\u0624\u0631\u0636\u064b\u0627.',
    ch3Title:'\u0627\u0644\u062a\u0642\u0627\u0637 AM', ch3Desc:'\u0627\u0645\u0633\u062d 500-1700 \u0643\u064a\u0644\u0648\u0647\u0631\u062a\u0632.',
    faq_q1:'\u0647\u0644 \u064a\u0645\u0643\u0646 \u0644\u062c\u0633\u0645\u064a \u0623\u0646 \u064a\u0643\u0648\u0646 \u0647\u0648\u0627\u0626\u064a\u061f', faq_a1:'\u0646\u0639\u0645! \u0627\u0644\u062c\u0633\u0645 \u0627\u0644\u0628\u0634\u0631\u064a \u064a\u062a\u0631\u0646\u0646 \u0639\u0646\u062f 1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632.',
    faq_q2:'\u0645\u0627 \u0647\u064a \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629\u061f', faq_a2:'Z = R + jX \u0645\u0642\u0627\u0648\u0645\u0629 \u0643\u0644\u064a\u0629 \u0644\u0644\u062a\u064a\u0627\u0631 \u0627\u0644\u0645\u062a\u0631\u062f\u062f.',
    faq_q3:'\u0647\u0644 \u0647\u0630\u0627 \u0622\u0645\u0646\u061f', faq_a3:'\u0646\u0639\u0645\u060c \u0646\u0642\u064a\u0633 \u0641\u0642\u0637 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u0645\u062d\u064a\u0637\u0629.',
    howto_1:'\u0627\u0646\u0642\u0631 \u0628\u062f\u0621 \u0627\u0644\u0645\u0633\u062d.', howto_2:'\u0627\u0646\u0642\u0631 \u0644\u0645\u0633 \u0627\u0644\u062c\u0633\u0645.', howto_3:'\u0627\u0646\u0642\u0631 \u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f.',
    wiki_ant_title:'\ud83d\udce1 \u0646\u0638\u0631\u064a\u0629 \u0627\u0644\u0647\u0648\u0627\u0626\u064a', wiki_ant:'\u062c\u0633\u0645 1.7\u0645 \u064a\u062a\u0631\u0646\u0646 \u0639\u0646\u062f ~1.8 \u0645\u064a\u063a\u0627\u0647\u0631\u062a\u0632.',
    wiki_imp_title:'\u26a1 \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629', wiki_imp:'Z = R + jX \u0628\u0627\u0644\u0623\u0648\u0645.',
    activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637', eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b', clear:'\u0645\u0633\u062d', copy:'\u0646\u0633\u062e', export:'\u062a\u0635\u062f\u064a\u0631', filterAll:'\u0627\u0644\u0643\u0644',
    settings:'\u2699\ufe0f \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a', language:'\u0627\u0644\u0644\u063a\u0629', theme:'\u0627\u0644\u0645\u0638\u0647\u0631',
    help:'\u2753 \u0645\u0633\u0627\u0639\u062f\u0629', faq:'\u0623\u0633\u0626\u0644\u0629', howto:'\u062f\u0644\u064a\u0644', wiki:'\u0648\u064a\u0643\u064a',
    soundEffects:'\ud83d\udd0a \u0645\u0624\u062b\u0631\u0627\u062a', whisperMode:'\u0648\u0636\u0639 \u0627\u0644\u0647\u0645\u0633',
    breathingGuide:'\u062f\u0644\u064a\u0644 \u0627\u0644\u062a\u0646\u0641\u0633', dhikrTap:'\u0627\u0636\u063a\u0637', musicMode:'\u062a\u0641\u0627\u0639\u0644 \u0645\u0648\u0633\u064a\u0642\u064a',
    splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a', working:'\u062c\u0627\u0631\u064d\u2026',
    t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',
    ready:'\ud83d\udce1 \u0647\u0648\u0627\u0626\u064a \u0627\u0644\u062c\u0633\u0645 \u062c\u0627\u0647\u0632!',
    logCleared:'\u062a\u0645 \u0645\u0633\u062d \u0627\u0644\u0633\u062c\u0644', copied:'\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!', copyFail:'\u0641\u0634\u0644',
    langChanged:'\ud83c\udf10 \u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629', themeChanged:'\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    scanning:'\u0645\u0633\u062d \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629...', touched:'\u062a\u0645 \u0643\u0634\u0641 \u062a\u0644\u0627\u0645\u0633 \u0627\u0644\u062c\u0633\u0645!', grounded:'\u0645\u0624\u0631\u0636 \u2014 \u0627\u0646\u062e\u0641\u0636\u062a \u0627\u0644\u0645\u0639\u0627\u0648\u0642\u0629!',
    sweepDone:'\u0627\u0643\u062a\u0645\u0644 \u0645\u0633\u062d \u0627\u0644\u062a\u0631\u062f\u062f', resonanceFound:'\u062a\u0645 \u0625\u064a\u062c\u0627\u062f \u0627\u0644\u0631\u0646\u064a\u0646 \u0639\u0646\u062f',
  }
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang)}catch(e){}log(s.langChanged,'info')}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name)}catch(e){}const s=LANG[currentLang];log(`${s.themeChanged} ${s['t_'+name]||name}`,'info')}

let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error')}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success')}catch(e){log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}

let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null}}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}

function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{line.style.display=f==='all'||line.classList.contains(f)?'':'none'})})})}

function calcHijriDate(){try{return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch(e){return''}}

function openPanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.add('open');if(o)o.classList.add('open')}
function closePanel(pid,oid,rid){const s=$(pid),o=$(oid);if(s)s.classList.remove('open');if(o)o.classList.remove('open');const b=$(rid);if(b)b.focus()}
function openHelp(){openPanel('helpPanel','helpOverlay')}
function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn')}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const tid='help'+n.charAt(0).toUpperCase()+n.slice(1);const tgt=$(tid);if(tgt)tgt.classList.add('active')})})}

function toggleWhisper(){log('Whisper mode toggled','info')}
let breathingActive=false;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive))}
function incrementDhikr(){const c=$('dhikrCounter');if(c)c.textContent=parseInt(c.textContent||'0')+1}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();
  const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;
  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch(e){}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch(e){}})}
  const whisperBtn=$('whisperBtn');if(whisperBtn)whisperBtn.onclick=toggleWhisper;
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none'};
  if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  const musicBtn=$('musicBtn');if(musicBtn)musicBtn.onclick=()=>log('Music mode toggled','info');
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl)}catch(e){}
  const hd=$('hijriDate');if(hd){const h=calcHijriDate();if(h)hd.textContent=h}
  log(LANG[currentLang].ready,'success');
  initAntennaApp();
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ BIO BODY ANTENNA SIMULATION ═══════ */
let antennaAnim=null, isScanning=false, isTouching=false, isGrounded=false;
let currentFreq=1.8, bodyZ={r:150,x:45}, swr=2.1, gain=-12;
let sweepData=[], sweepActive=false;

function initAntennaApp(){
  const canvas=$('antennaCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');
  canvas.width=canvas.offsetWidth||760;canvas.height=340;
  const W=canvas.width,H=canvas.height;
  let t=0, wavePhase=0, bodyGlow=0;

  // Human body outline points (simplified stick figure)
  const bodyPts=[{x:.5,y:.08},{x:.5,y:.22},{x:.38,y:.18},{x:.5,y:.22},{x:.62,y:.18},{x:.5,y:.22},{x:.5,y:.48},{x:.42,y:.7},{x:.38,y:.92},{x:.42,y:.7},{x:.5,y:.48},{x:.58,y:.7},{x:.62,y:.92}];

  function drawBody(ctx,glow){
    ctx.save();
    ctx.strokeStyle=`rgba(${glow>0?'51,255,51':'212,160,60'},${.6+glow*.4})`;
    ctx.lineWidth=3+glow*2;ctx.lineCap='round';ctx.lineJoin='round';
    ctx.shadowColor=glow>0?'#33ff33':'#d4a03c';ctx.shadowBlur=glow*20;
    ctx.beginPath();
    bodyPts.forEach((p,i)=>{const px=p.x*W*.3+W*.35,py=p.y*H;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)});
    ctx.stroke();
    // Head
    ctx.beginPath();ctx.arc(.5*W*.3+W*.35,.05*H,H*.04,0,Math.PI*2);ctx.stroke();
    ctx.restore();
  }

  function drawWaves(ctx,phase,strength){
    const cx=.5*W*.3+W*.35;
    for(let ring=0;ring<8;ring++){
      const r=40+ring*30+phase*10;
      const alpha=Math.max(0,(1-ring/8)*strength*.5);
      ctx.beginPath();ctx.arc(cx,H*.45,r,0,Math.PI*2);
      ctx.strokeStyle=`rgba(51,255,51,${alpha})`;ctx.lineWidth=1.5;ctx.stroke();
    }
  }

  function drawSpectrum(ctx){
    const sx=W*.68,sy=30,sw=W*.28,sh=H-60;
    ctx.strokeStyle='rgba(255,255,255,.15)';ctx.strokeRect(sx,sy,sw,sh);
    // Grid
    for(let i=0;i<5;i++){const gy=sy+sh*i/4;ctx.beginPath();ctx.moveTo(sx,gy);ctx.lineTo(sx+sw,gy);ctx.strokeStyle='rgba(255,255,255,.06)';ctx.stroke()}
    // Frequency labels
    ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='10px Orbitron,monospace';
    ctx.fillText('0.5MHz',sx,sy+sh+12);ctx.fillText('5MHz',sx+sw-30,sy+sh+12);
    ctx.fillText('|Z|',sx-20,sy+10);
    // Sweep data or live impedance
    if(sweepData.length>1){
      ctx.beginPath();ctx.strokeStyle='#33ff33';ctx.lineWidth=2;
      sweepData.forEach((d,i)=>{const px=sx+i/sweepData.length*sw,py=sy+sh-d.z/600*sh;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)});
      ctx.stroke();
      // SWR overlay
      ctx.beginPath();ctx.strokeStyle='#ff6633';ctx.lineWidth=1;
      sweepData.forEach((d,i)=>{const px=sx+i/sweepData.length*sw,py=sy+sh-Math.min(d.swr/10,1)*sh;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)});
      ctx.stroke();
    }
    // Current freq marker
    const fx=sx+((currentFreq-.5)/4.5)*sw;
    ctx.beginPath();ctx.moveTo(fx,sy);ctx.lineTo(fx,sy+sh);
    ctx.strokeStyle='rgba(255,204,0,.6)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#ffcc00';ctx.font='bold 11px Orbitron';ctx.fillText(`${currentFreq.toFixed(3)}`,fx-20,sy-5);
  }

  function drawImpedance(ctx){
    const ix=W*.02,iy=H*.75,iw=W*.55,ih=H*.2;
    ctx.fillStyle='rgba(0,0,0,.3)';ctx.fillRect(ix,iy,iw,ih);
    ctx.strokeStyle='rgba(255,255,255,.1)';ctx.strokeRect(ix,iy,iw,ih);
    ctx.fillStyle='#d4a03c';ctx.font='bold 13px Orbitron';
    ctx.fillText(`Z = ${bodyZ.r.toFixed(0)} + j${bodyZ.x.toFixed(0)} \u2126`,ix+10,iy+20);
    ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='11px Orbitron';
    ctx.fillText(`SWR: ${swr.toFixed(2)}  Gain: ${gain.toFixed(1)} dBi`,ix+10,iy+40);
    ctx.fillText(`Freq: ${currentFreq.toFixed(3)} MHz`,ix+10,iy+58);
  }

  function frame(){
    ctx.fillStyle='rgba(0,0,0,.12)';ctx.fillRect(0,0,W,H);
    t+=.016;wavePhase=(wavePhase+.03)%1;
    if(isScanning)bodyGlow=Math.min(1,bodyGlow+.02);else bodyGlow=Math.max(0,bodyGlow-.01);
    drawWaves(ctx,wavePhase,isScanning?.8:.1);
    drawBody(ctx,bodyGlow);
    drawSpectrum(ctx);
    drawImpedance(ctx);
    // Noise floor
    if(isScanning){
      for(let i=0;i<20;i++){
        const nx=Math.random()*W,ny=Math.random()*H;
        ctx.fillStyle=`rgba(51,255,51,${Math.random()*.1})`;
        ctx.fillRect(nx,ny,2,2);
      }
    }
    antennaAnim=requestAnimationFrame(frame);
  }
  frame();

  // Controls
  const startBtn=$('startBtn'),touchBtn=$('touchBtn'),groundBtn=$('groundBtn'),sweepBtn=$('sweepBtn');
  if(startBtn)startBtn.onclick=()=>{
    isScanning=!isScanning;setStatus(isScanning);
    startBtn.querySelector('[data-i18n]').textContent=isScanning?'Stop':'Start Scan';
    log(isScanning?LANG[currentLang].scanning:'Scan stopped','info');
    if(isScanning)updateImpedance();
  };
  if(touchBtn)touchBtn.onclick=()=>{
    isTouching=!isTouching;
    log(LANG[currentLang].touched,'success');
    updateImpedance();
  };
  if(groundBtn)groundBtn.onclick=()=>{
    isGrounded=!isGrounded;
    log(LANG[currentLang].grounded,'success');
    updateImpedance();
  };
  if(sweepBtn)sweepBtn.onclick=startSweep;
}

function updateImpedance(){
  // Simulate impedance based on frequency and body state
  const f=currentFreq;
  const resonantF=1.8+(isTouching?-.15:.05)+(isGrounded?-.3:0);
  const delta=Math.abs(f-resonantF);
  bodyZ.r=36+delta*80+(isTouching?-10:20)+(isGrounded?-15:0)+Math.random()*5;
  bodyZ.x=(f-resonantF)*120+Math.random()*10;
  const zMag=Math.sqrt(bodyZ.r*bodyZ.r+bodyZ.x*bodyZ.x);
  swr=Math.max(1,(zMag>50?zMag/50:50/zMag));
  gain=-15+10/swr+(isGrounded?3:0);
  // Update UI
  const fill=$('impedanceFill'),label=$('impedanceLabel');
  if(fill)fill.style.width=Math.min(100,zMag/5)+'%';
  if(label)label.textContent=`Z = ${bodyZ.r.toFixed(0)} + j${bodyZ.x.toFixed(0)} \u2126`;
  const sf=$('statFreq'),ss=$('statSWR'),sg=$('statGain'),sz=$('statZ'),fd=$('freqDisplay');
  if(sf)sf.textContent=currentFreq.toFixed(3);
  if(ss)ss.textContent=swr.toFixed(1);
  if(sg)sg.textContent=gain.toFixed(1);
  if(sz)sz.textContent=Math.round(zMag);
  if(fd)fd.textContent=`${currentFreq.toFixed(3)} MHz`;
}

async function startSweep(){
  if(sweepActive)return;
  sweepActive=true;sweepData=[];
  const s=LANG[currentLang];
  log('Starting frequency sweep 0.5-5.0 MHz...','info');
  showToast(s.scanning,3000);
  let bestSWR=999,bestFreq=1.8;
  for(let f=0.5;f<=5.0;f+=.05){
    currentFreq=f;updateImpedance();
    const zMag=Math.sqrt(bodyZ.r*bodyZ.r+bodyZ.x*bodyZ.x);
    sweepData.push({f,z:zMag,swr});
    if(swr<bestSWR){bestSWR=swr;bestFreq=f}
    await sleep(30);
  }
  currentFreq=bestFreq;updateImpedance();
  log(`${s.sweepDone}! ${s.resonanceFound} ${bestFreq.toFixed(3)} MHz (SWR ${bestSWR.toFixed(2)})`,'success');
  sweepActive=false;
}
