/**
 * Signal Hunter — RF Scavenger
 * Workshop DIY — v1.2
 * Triangulate hidden transmitters in a hot/cold scavenger hunt
 */

const $ = id => document.getElementById(id);

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3V160.8c0-4.2.1-7.8.1-7.9zM208.4,151.3h-6.5v3.2h6.5v-3.2zm-13,16.2h-3.2V151.3h3.2v16.2zm19.5,0h-3.2V151.3h3.2v16.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8V164.1l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9V152.7h-3.9v-4.7h14.5z"/></svg>`;
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch(type) {
    case 'click': osc.frequency.value=800; gain.gain.exponentialRampToValueAtTime(0.001,t+0.08); osc.start(t); osc.stop(t+0.08); break;
    case 'success': osc.frequency.value=523; gain.gain.exponentialRampToValueAtTime(0.001,t+0.3); osc.start(t); osc.stop(t+0.3); break;
    case 'error': osc.frequency.value=200; osc.type='square'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.25); osc.start(t); osc.stop(t+0.25); break;
    case 'beep': osc.frequency.value=1200; gain.gain.exponentialRampToValueAtTime(0.001,t+0.05); osc.start(t); osc.stop(t+0.05); break;
  }
}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title:'Signal Hunter', subtitle:'Signal Hunter \u2014 RF Scavenger',
    disconnected:'Idle', connected:'Hunting',
    mainSection:'Signal Hunter', mainDesc:'Triangulate hidden transmitters',
    sectionA:'Found Transmitters', sectionB:'How Triangulation Works', sectionC:'RF Direction Finding',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', export:'Export', theme:'Theme',
    settings:'\u2699\uFE0F Settings', language:'Language',
    help:'\u2753 Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    faq_q1:'What is Signal Hunter?', faq_a1:'A game where you find hidden transmitters using signal strength and direction.',
    faq_q2:'How do I find transmitters?', faq_a2:'Click on the map to move. The compass and signal strength guide you.',
    faq_q3:'What does hot/cold mean?', faq_a3:'Hot = close to a transmitter. Cold = far away. Watch the colors change!',
    faq_q4:'Is my data private?', faq_a4:'Yes. Everything runs locally in your browser.',
    howto_1:'Click New Hunt to start.', howto_2:'Click on the map to move your receiver.',
    howto_3:'Follow the compass and signal strength.', howto_4:'Get close enough to capture each transmitter.',
    wiki_df_title:'Direction Finding', wiki_df:'RF direction finding uses antenna patterns to determine bearing to a transmitter.',
    wiki_tri_title:'Triangulation', wiki_tri:'Taking bearings from multiple locations to pinpoint a transmitter position.',
    working:'Working\u2026',
    t_mosque:'Mosque', t_zellige:'Zellige', t_andalus:'Andalus', t_riad:'Riad', t_medina:'Medina',
    t_space:'Space', t_jungle:'Jungle', t_robot:'Robot',
    ready:'\uD83D\uDE80 Signal Hunter ready!',
    logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed',
    filterAll:'All', soundEffects:'Sound effects',
    breathingGuide:'Breathing guide', dhikrTap:'Tap', splashHint:'tap to skip',
    langChanged:'\uD83C\uDF10 Language \u2192 English', themeChanged:'\uD83C\uDFA8 Theme \u2192',
    newHunt:'New Hunt', scoreLabel:'Score:', timeLabel:'Time:',
    compass:'Signal Compass', signalStrength:'Signal Strength', huntStatus:'Hunt Status',
    foundHint:'Find hidden transmitters by following the signal compass.',
    cold:'COLD', cool:'COOL', warm:'WARM', hot:'HOT', burning:'BURNING',
    foundIt:'FOUND!', allFound:'All transmitters found!',
    guideTitle:'How Triangulation Works',
    guideP1:'Triangulation determines a transmitter location by measuring signal direction from multiple points.',
    guideP2:'With two bearings you get a fix. Three bearings improve accuracy.',
    guideP3:'Signal strength follows the inverse-square law: power drops with distance squared.',
    dbTitle:'Direction Finding Techniques',
  ,step1Title:'Configure RF',step1Desc:'Set the frequency band, modulation type, and signal parameters.',step2Title:'Capture Spectrum',step2Desc:'Scan the radio spectrum to detect and capture signals of interest.',step3Title:'Analyze Signal',step3Desc:'Apply signal processing to identify modulation, encoding, and source.',step4Title:'Classify & Report',step4Desc:'Categorize the signal type and log detailed analysis results.'},
  fr: {
    title:'Chasseur de Signal', subtitle:'Chasseur de Signal \u2014 Traque RF',
    disconnected:'En attente', connected:'Chasse en cours',
    mainSection:'Chasseur de Signal', mainDesc:'Trianguler les \u00e9metteurs cach\u00e9s',
    sectionA:'\u00c9metteurs Trouv\u00e9s', sectionB:'Comment fonctionne la Triangulation', sectionC:'Radiogoniom\u00e9trie',
    activityLog:'Journal', eventsMsg:'\u00c9v\u00e9nements',
    clear:'Effacer', copy:'Copier', export:'Exporter', theme:'Th\u00e8me',
    settings:'\u2699\uFE0F Param\u00e8tres', language:'Langue',
    help:'\u2753 Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    faq_q1:'Qu\'est-ce que le Chasseur ?', faq_a1:'Un jeu pour trouver des \u00e9metteurs cach\u00e9s.',
    faq_q2:'Comment trouver ?', faq_a2:'Cliquez sur la carte pour vous d\u00e9placer.',
    faq_q3:'Chaud/froid ?', faq_a3:'Chaud = proche. Froid = loin.',
    faq_q4:'Donn\u00e9es priv\u00e9es ?', faq_a4:'Oui. Tout est local.',
    howto_1:'Cliquez Nouvelle Chasse.', howto_2:'Cliquez sur la carte.',
    howto_3:'Suivez la boussole.', howto_4:'Approchez-vous pour capturer.',
    wiki_df_title:'Radiogoniom\u00e9trie', wiki_df:'Utilise les antennes pour d\u00e9terminer la direction.',
    wiki_tri_title:'Triangulation', wiki_tri:'Relev\u00e9s depuis plusieurs points.',
    working:'En cours\u2026',
    t_mosque:'Mosqu\u00e9e', t_zellige:'Zellige', t_andalus:'Andalous', t_riad:'Riad', t_medina:'M\u00e9dina',
    t_space:'Espace', t_jungle:'Jungle', t_robot:'Robot',
    ready:'\uD83D\uDE80 Chasseur de Signal pr\u00eat !',
    logCleared:'Journal effac\u00e9', copied:'Copi\u00e9 !', copyFail:'\u00c9chec',
    filterAll:'Tout', soundEffects:'Effets sonores',
    breathingGuide:'Guide respiratoire', dhikrTap:'Tap', splashHint:'appuyer pour passer',
    langChanged:'\uD83C\uDF10 Langue \u2192 Fran\u00e7ais', themeChanged:'\uD83C\uDFA8 Th\u00e8me \u2192',
    newHunt:'Nouvelle Chasse', scoreLabel:'Score :', timeLabel:'Temps :',
    compass:'Boussole Signal', signalStrength:'Force du Signal', huntStatus:'\u00c9tat de la Chasse',
    foundHint:'Trouvez les \u00e9metteurs en suivant la boussole.',
    cold:'FROID', cool:'FRAIS', warm:'TI\u00c8DE', hot:'CHAUD', burning:'BR\u00dbLANT',
    foundIt:'TROUV\u00c9 !', allFound:'Tous les \u00e9metteurs trouv\u00e9s !',
    guideTitle:'Comment fonctionne la Triangulation',
    guideP1:'La triangulation d\u00e9termine la position par la direction du signal.',
    guideP2:'Deux relev\u00e9s donnent un fix. Trois am\u00e9liorent la pr\u00e9cision.',
    guideP3:'La puissance suit la loi de l\'inverse du carr\u00e9.',
    dbTitle:'Techniques de Radiogoniom\u00e9trie',
  ,step1Title:'Configurer RF',step1Desc:'Règle la bande de fréquence, le type de modulation et les paramètres.',step2Title:'Capturer le spectre',step2Desc:'Scanne le spectre radio pour détecter et capturer les signaux.',step3Title:'Analyser le signal',step3Desc:'Applique le traitement du signal pour identifier la modulation et la source.',step4Title:'Classifier et rapporter',step4Desc:'Catégorise le type de signal et enregistre les résultats.'},
  ar: {
    title:'\u0635\u064A\u0627\u062F \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062A', subtitle:'\u0635\u064A\u0627\u062F \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062A \u2014 \u0627\u0644\u0628\u062D\u062B \u0639\u0646 RF',
    disconnected:'\u062E\u0627\u0645\u0644', connected:'\u0627\u0644\u0635\u064A\u062F',
    mainSection:'\u0635\u064A\u0627\u062F \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062A', mainDesc:'\u062A\u062B\u0644\u064A\u062B \u0627\u0644\u0645\u0631\u0633\u0644\u0627\u062A \u0627\u0644\u0645\u062E\u0641\u064A\u0629',
    sectionA:'\u0627\u0644\u0645\u0631\u0633\u0644\u0627\u062A \u0627\u0644\u0645\u0643\u062A\u0634\u0641\u0629', sectionB:'\u0643\u064A\u0641 \u064A\u0639\u0645\u0644 \u0627\u0644\u062A\u062B\u0644\u064A\u062B', sectionC:'\u062A\u062D\u062F\u064A\u062F \u0627\u062A\u062C\u0627\u0647 RF',
    activityLog:'\u0633\u062C\u0644 \u0627\u0644\u0646\u0634\u0627\u0637', eventsMsg:'\u0627\u0644\u0623\u062D\u062F\u0627\u062B',
    clear:'\u0645\u0633\u062D', copy:'\u0646\u0633\u062E', export:'\u062A\u0635\u062F\u064A\u0631', theme:'\u0627\u0644\u0645\u0638\u0647\u0631',
    settings:'\u2699\uFE0F \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A', language:'\u0627\u0644\u0644\u063A\u0629',
    help:'\u2753 \u0645\u0633\u0627\u0639\u062F\u0629', faq:'\u0623\u0633\u0626\u0644\u0629', howto:'\u0643\u064A\u0641', wiki:'\u0648\u064A\u0643\u064A',
    faq_q1:'\u0645\u0627 \u0647\u0648 \u0635\u064A\u0627\u062F \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062A\u061F', faq_a1:'\u0644\u0639\u0628\u0629 \u0644\u0625\u064A\u062C\u0627\u062F \u0627\u0644\u0645\u0631\u0633\u0644\u0627\u062A \u0627\u0644\u0645\u062E\u0641\u064A\u0629.',
    faq_q2:'\u0643\u064A\u0641 \u0623\u062C\u062F\u061F', faq_a2:'\u0627\u0646\u0642\u0631 \u0639\u0644\u0649 \u0627\u0644\u062E\u0631\u064A\u0637\u0629 \u0644\u0644\u062A\u062D\u0631\u0643.',
    faq_q3:'\u0645\u0627 \u0645\u0639\u0646\u0649 \u062D\u0627\u0631/\u0628\u0627\u0631\u062F\u061F', faq_a3:'\u062D\u0627\u0631 = \u0642\u0631\u064A\u0628. \u0628\u0627\u0631\u062F = \u0628\u0639\u064A\u062F.',
    faq_q4:'\u0647\u0644 \u0628\u064A\u0627\u0646\u0627\u062A\u064A \u062E\u0627\u0635\u0629\u061F', faq_a4:'\u0646\u0639\u0645.',
    howto_1:'\u0627\u0646\u0642\u0631 \u0635\u064A\u062F \u062C\u062F\u064A\u062F.', howto_2:'\u0627\u0646\u0642\u0631 \u0639\u0644\u0649 \u0627\u0644\u062E\u0631\u064A\u0637\u0629.',
    howto_3:'\u0627\u062A\u0628\u0639 \u0627\u0644\u0628\u0648\u0635\u0644\u0629.', howto_4:'\u0627\u0642\u062A\u0631\u0628 \u0644\u0644\u0627\u0644\u062A\u0642\u0627\u0637.',
    wiki_df_title:'\u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0627\u062A\u062C\u0627\u0647', wiki_df:'\u064A\u0633\u062A\u062E\u062F\u0645 \u0623\u0646\u0645\u0627\u0637 \u0627\u0644\u0647\u0648\u0627\u0626\u064A.',
    wiki_tri_title:'\u0627\u0644\u062A\u062B\u0644\u064A\u062B', wiki_tri:'\u0642\u064A\u0627\u0633\u0627\u062A \u0645\u0646 \u0639\u062F\u0629 \u0646\u0642\u0627\u0637.',
    working:'\u062C\u0627\u0631\u064D\u2026',
    t_mosque:'\u0645\u0633\u062C\u062F', t_zellige:'\u0632\u0644\u064A\u062C', t_andalus:'\u0623\u0646\u062F\u0644\u0633', t_riad:'\u0631\u064A\u0627\u0636', t_medina:'\u0645\u062F\u064A\u0646\u0629',
    t_space:'\u0641\u0636\u0627\u0621', t_jungle:'\u0623\u062F\u063A\u0627\u0644', t_robot:'\u0631\u0648\u0628\u0648\u062A',
    ready:'\uD83D\uDE80 \u0635\u064A\u0627\u062F \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062A \u062C\u0627\u0647\u0632!',
    logCleared:'\u062A\u0645 \u0627\u0644\u0645\u0633\u062D', copied:'\u062A\u0645!', copyFail:'\u0641\u0634\u0644',
    filterAll:'\u0627\u0644\u0643\u0644', soundEffects:'\u0645\u0624\u062B\u0631\u0627\u062A \u0635\u0648\u062A\u064A\u0629',
    breathingGuide:'\u062F\u0644\u064A\u0644 \u0627\u0644\u062A\u0646\u0641\u0633', dhikrTap:'\u0627\u0636\u063A\u0637', splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u062E\u0637\u064A',
    langChanged:'\uD83C\uDF10 \u0627\u0644\u0644\u063A\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064A\u0629', themeChanged:'\uD83C\uDFA8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    newHunt:'\u0635\u064A\u062F \u062C\u062F\u064A\u062F', scoreLabel:'\u0627\u0644\u0646\u0642\u0627\u0637:', timeLabel:'\u0627\u0644\u0648\u0642\u062A:',
    compass:'\u0628\u0648\u0635\u0644\u0629 \u0627\u0644\u0625\u0634\u0627\u0631\u0629', signalStrength:'\u0642\u0648\u0629 \u0627\u0644\u0625\u0634\u0627\u0631\u0629', huntStatus:'\u062D\u0627\u0644\u0629 \u0627\u0644\u0635\u064A\u062F',
    foundHint:'\u0627\u0628\u062D\u062B \u0639\u0646 \u0627\u0644\u0645\u0631\u0633\u0644\u0627\u062A \u0628\u0627\u062A\u0628\u0627\u0639 \u0627\u0644\u0628\u0648\u0635\u0644\u0629.',
    cold:'\u0628\u0627\u0631\u062F', cool:'\u0645\u0639\u062A\u062F\u0644', warm:'\u062F\u0627\u0641\u0626', hot:'\u062D\u0627\u0631', burning:'\u0645\u0644\u062A\u0647\u0628',
    foundIt:'\u0648\u064F\u062C\u062F!', allFound:'\u062A\u0645 \u0627\u0644\u0639\u062B\u0648\u0631 \u0639\u0644\u0649 \u0627\u0644\u0643\u0644!',
    guideTitle:'\u0643\u064A\u0641 \u064A\u0639\u0645\u0644 \u0627\u0644\u062A\u062B\u0644\u064A\u062B',
    guideP1:'\u0627\u0644\u062A\u062B\u0644\u064A\u062B \u064A\u062D\u062F\u062F \u0627\u0644\u0645\u0648\u0642\u0639 \u0628\u0642\u064A\u0627\u0633 \u0627\u062A\u062C\u0627\u0647 \u0627\u0644\u0625\u0634\u0627\u0631\u0629.',
    guideP2:'\u0642\u064A\u0627\u0633\u0627\u0646 \u064A\u0639\u0637\u064A\u0627\u0646 \u0645\u0648\u0642\u0639\u064B\u0627. \u062B\u0644\u0627\u062B\u0629 \u062A\u062D\u0633\u0646 \u0627\u0644\u062F\u0642\u0629.',
    guideP3:'\u0627\u0644\u0642\u0648\u0629 \u062A\u062A\u0628\u0639 \u0642\u0627\u0646\u0648\u0646 \u0627\u0644\u062A\u0631\u0628\u064A\u0639 \u0627\u0644\u0639\u0643\u0633\u064A.',
    dbTitle:'\u062A\u0642\u0646\u064A\u0627\u062A \u062A\u062D\u062F\u064A\u062F \u0627\u0644\u0627\u062A\u062C\u0627\u0647',
  ,step1Title:'تكوين RF',step1Desc:'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.',step2Title:'التقاط الطيف',step2Desc:'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.',step3Title:'تحليل الإشارة',step3Desc:'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.',step4Title:'تصنيف والتقرير',step4Desc:'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.'}
};

let currentLang = 'en';
function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k=el.dataset.i18n; if(s[k]!=null) el.textContent=s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => { const k=opt.dataset.i18nOpt; if(s[k]!=null) opt.textContent=s[k]; });
  document.title = `${s.title} \u2014 Workshop DIY`;
  document.documentElement.dir = lang==='ar'?'rtl':'ltr';
  document.documentElement.lang = lang;
  const sel=$('langSelect'); if(sel) sel.value=lang;
  try{localStorage.setItem('wdiy-lang',lang);}catch{}
  log(s.langChanged,'info');
  buildGuide(); buildDatabase();
}

/* ═══════ THEMES ═══════ */
const THEME_MELODIES = {
  'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],
  'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],
  'riad':[349,440,523],'medina':[294,349,440]
};
function setTheme(name) {
  document.documentElement.dataset.theme=name;
  document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));
  const sel=$('themeSelect'); if(sel) sel.value=name;
  try{localStorage.setItem('wdiy-theme',name);}catch{}
  playThemeMelody(name);
  const s=LANG[currentLang]; log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');
}
function playThemeMelody(n){
  if(!soundEnabled)return; if(!audioCtx)audioCtx=new AudioCtx();
  const notes=THEME_MELODIES[n]; if(!notes)return; const t=audioCtx.currentTime;
  notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){
  if(!logContainer)logContainer=$('logContainer'); if(!logContainer)return;
  const d=document.createElement('div'); d.className=`log-line ${type}`;
  d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d); logContainer.scrollTop=logContainer.scrollHeight;
  if(type==='success')playSound('success'); else if(type==='error')playSound('error');
  applyLogFilter();
}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}

/* ═══════ TOAST / STATUS / SPLASH / PANELS ═══════ */
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(rid);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}
function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),contents=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));contents.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const tid='help'+n.charAt(0).toUpperCase()+n.slice(1);const tgt=$(tid);if(tgt)tgt.classList.add('active');});});}
function initLogResize(){
  const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;
  let dragging=false,startX,startW;
  handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;document.body.style.cursor='col-resize';e.preventDefault();});
  document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=startX-e.clientX;const nw=Math.max(200,Math.min(startW+dx,window.innerWidth*0.6));document.documentElement.style.setProperty('--log-width',nw+'px');});
  document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;document.body.style.cursor='';});
}
let breathingActive=false,dhikrCount=0;
function toggleBreathing(){const bands=document.querySelectorAll('.deco-band');breathingActive=!breathingActive;bands.forEach(b=>b.classList.toggle('breathing',breathingActive));}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

/* ═══════════════════════════════════════════════════════════════
   APP-SPECIFIC: SIGNAL HUNTER GAME
   ═══════════════════════════════════════════════════════════════ */

let mapCanvas, mapCtx, compassCanvas, compassCtx;
let mapW = 780, mapH = 400;
let playerX = 390, playerY = 200;
let transmitters = [];
let foundTransmitters = [];
let hunting = false;
let score = 0;
let timerInterval = null;
let elapsedSeconds = 0;
const FIND_RADIUS = 25;
const NUM_TRANSMITTERS = 5;

/* Terrain features (decorative) */
const terrainFeatures = [];
function generateTerrain() {
  terrainFeatures.length = 0;
  // Trees
  for (let i = 0; i < 30; i++) {
    terrainFeatures.push({ type:'tree', x:Math.random()*mapW, y:Math.random()*mapH, size:8+Math.random()*12 });
  }
  // Buildings
  for (let i = 0; i < 8; i++) {
    terrainFeatures.push({ type:'building', x:Math.random()*mapW, y:Math.random()*mapH, w:20+Math.random()*30, h:15+Math.random()*25 });
  }
  // Roads
  for (let i = 0; i < 3; i++) {
    const horiz = Math.random() > 0.5;
    terrainFeatures.push({ type:'road', horiz, pos: Math.random() * (horiz ? mapH : mapW) });
  }
}

function drawMap() {
  if (!mapCtx) return;
  mapCtx.fillStyle = '#1a2a1a';
  mapCtx.fillRect(0, 0, mapW, mapH);

  // Grid
  mapCtx.strokeStyle = 'rgba(255,255,255,0.05)';
  mapCtx.lineWidth = 1;
  for (let x = 0; x < mapW; x += 40) { mapCtx.beginPath(); mapCtx.moveTo(x, 0); mapCtx.lineTo(x, mapH); mapCtx.stroke(); }
  for (let y = 0; y < mapH; y += 40) { mapCtx.beginPath(); mapCtx.moveTo(0, y); mapCtx.lineTo(mapW, y); mapCtx.stroke(); }

  // Terrain
  terrainFeatures.forEach(f => {
    if (f.type === 'road') {
      mapCtx.fillStyle = 'rgba(100,100,80,0.3)';
      if (f.horiz) mapCtx.fillRect(0, f.pos - 4, mapW, 8);
      else mapCtx.fillRect(f.pos - 4, 0, 8, mapH);
    } else if (f.type === 'building') {
      mapCtx.fillStyle = 'rgba(80,80,100,0.4)';
      mapCtx.fillRect(f.x, f.y, f.w, f.h);
      mapCtx.strokeStyle = 'rgba(120,120,140,0.3)';
      mapCtx.strokeRect(f.x, f.y, f.w, f.h);
    } else if (f.type === 'tree') {
      mapCtx.fillStyle = 'rgba(30,80,30,0.5)';
      mapCtx.beginPath();
      mapCtx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      mapCtx.fill();
    }
  });

  // Found transmitters (revealed)
  foundTransmitters.forEach(tx => {
    mapCtx.beginPath();
    mapCtx.arc(tx.x, tx.y, 8, 0, Math.PI * 2);
    mapCtx.fillStyle = '#22c55e';
    mapCtx.fill();
    mapCtx.strokeStyle = '#fff';
    mapCtx.lineWidth = 2;
    mapCtx.stroke();
    // Antenna icon
    mapCtx.beginPath();
    mapCtx.moveTo(tx.x, tx.y - 8);
    mapCtx.lineTo(tx.x, tx.y - 18);
    mapCtx.strokeStyle = '#22c55e';
    mapCtx.lineWidth = 2;
    mapCtx.stroke();
    mapCtx.fillStyle = 'rgba(34,197,94,0.2)';
    mapCtx.beginPath();
    mapCtx.arc(tx.x, tx.y, 20, 0, Math.PI * 2);
    mapCtx.fill();
  });

  // Player
  mapCtx.beginPath();
  mapCtx.arc(playerX, playerY, 6, 0, Math.PI * 2);
  mapCtx.fillStyle = '#3b82f6';
  mapCtx.fill();
  mapCtx.strokeStyle = '#fff';
  mapCtx.lineWidth = 2;
  mapCtx.stroke();

  // Signal rings from player
  if (hunting) {
    const nearest = getNearestTransmitter();
    if (nearest) {
      const dist = Math.hypot(nearest.x - playerX, nearest.y - playerY);
      const alpha = Math.max(0.05, 0.3 - dist / mapW);
      for (let r = 1; r <= 3; r++) {
        mapCtx.beginPath();
        mapCtx.arc(playerX, playerY, r * 15 + (Date.now() / 200 % 15), 0, Math.PI * 2);
        mapCtx.strokeStyle = `rgba(59,130,246,${alpha})`;
        mapCtx.lineWidth = 1;
        mapCtx.stroke();
      }
    }
  }
}

function getNearestTransmitter() {
  let nearest = null, minDist = Infinity;
  transmitters.forEach(tx => {
    if (tx.found) return;
    const d = Math.hypot(tx.x - playerX, tx.y - playerY);
    if (d < minDist) { minDist = d; nearest = tx; }
  });
  return nearest;
}

function getSignalStrength() {
  const tx = getNearestTransmitter();
  if (!tx) return { strength: 0, angle: 0, dist: Infinity, temp: 'cold' };
  const dist = Math.hypot(tx.x - playerX, tx.y - playerY);
  const maxDist = Math.hypot(mapW, mapH);
  const strength = Math.max(0, 1 - (dist / maxDist) * 2);
  const angle = Math.atan2(tx.y - playerY, tx.x - playerX);

  let temp;
  if (dist < FIND_RADIUS) temp = 'foundIt';
  else if (dist < 60) temp = 'burning';
  else if (dist < 120) temp = 'hot';
  else if (dist < 200) temp = 'warm';
  else if (dist < 350) temp = 'cool';
  else temp = 'cold';

  return { strength, angle, dist, temp };
}

function drawCompass(angle, strength) {
  if (!compassCtx) return;
  const w = 150, h = 150, cx = 75, cy = 75, r = 55;
  compassCtx.clearRect(0, 0, w, h);

  // Background circle
  compassCtx.beginPath();
  compassCtx.arc(cx, cy, r + 5, 0, Math.PI * 2);
  compassCtx.fillStyle = 'rgba(0,0,0,0.3)';
  compassCtx.fill();

  // Compass ring
  compassCtx.beginPath();
  compassCtx.arc(cx, cy, r, 0, Math.PI * 2);
  compassCtx.strokeStyle = 'rgba(255,255,255,0.2)';
  compassCtx.lineWidth = 2;
  compassCtx.stroke();

  // Cardinal directions
  compassCtx.fillStyle = 'rgba(255,255,255,0.4)';
  compassCtx.font = '10px sans-serif';
  compassCtx.textAlign = 'center';
  compassCtx.fillText('N', cx, cy - r + 12);
  compassCtx.fillText('S', cx, cy + r - 5);
  compassCtx.fillText('E', cx + r - 8, cy + 4);
  compassCtx.fillText('W', cx - r + 8, cy + 4);

  // Needle
  if (strength > 0) {
    const nx = cx + Math.cos(angle) * r * 0.7;
    const ny = cy + Math.sin(angle) * r * 0.7;
    compassCtx.beginPath();
    compassCtx.moveTo(cx, cy);
    compassCtx.lineTo(nx, ny);
    const hue = strength > 0.5 ? 0 : strength > 0.3 ? 30 : 200;
    compassCtx.strokeStyle = `hsl(${hue}, 80%, 50%)`;
    compassCtx.lineWidth = 3;
    compassCtx.stroke();

    // Arrow tip
    compassCtx.beginPath();
    compassCtx.arc(nx, ny, 5, 0, Math.PI * 2);
    compassCtx.fillStyle = `hsl(${hue}, 80%, 50%)`;
    compassCtx.fill();
  }

  // Center dot
  compassCtx.beginPath();
  compassCtx.arc(cx, cy, 3, 0, Math.PI * 2);
  compassCtx.fillStyle = '#fff';
  compassCtx.fill();
}

function updateUI() {
  const sig = getSignalStrength();
  const s = LANG[currentLang];

  // Strength bar
  const fill = $('strengthFill');
  if (fill) {
    fill.style.width = (sig.strength * 100) + '%';
    if (sig.temp === 'burning' || sig.temp === 'foundIt') fill.style.background = '#ef4444';
    else if (sig.temp === 'hot') fill.style.background = '#f97316';
    else if (sig.temp === 'warm') fill.style.background = '#eab308';
    else if (sig.temp === 'cool') fill.style.background = '#06b6d4';
    else fill.style.background = '#3b82f6';
  }

  // Strength text
  const st = $('strengthText');
  if (st) st.textContent = (-100 + sig.strength * 70).toFixed(0) + ' dBm';

  // Temperature text
  const tt = $('tempText');
  if (tt && s[sig.temp]) {
    tt.textContent = s[sig.temp];
    if (sig.temp === 'burning' || sig.temp === 'foundIt') tt.style.color = '#ef4444';
    else if (sig.temp === 'hot') tt.style.color = '#f97316';
    else if (sig.temp === 'warm') tt.style.color = '#eab308';
    else if (sig.temp === 'cool') tt.style.color = '#06b6d4';
    else tt.style.color = '#3b82f6';
  }

  // Compass
  drawCompass(sig.angle, sig.strength);

  // Check if found
  if (hunting && sig.dist < FIND_RADIUS) {
    const tx = getNearestTransmitter();
    if (tx && !tx.found) {
      tx.found = true;
      foundTransmitters.push(tx);
      score += Math.max(10, 100 - Math.floor(elapsedSeconds / 2));
      $('scoreDisplay').textContent = score;
      log(`Transmitter found: ${tx.name} (+${Math.max(10, 100 - Math.floor(elapsedSeconds / 2))} pts)`, 'success');
      updateFoundList();
      playSound('success');

      if (transmitters.every(t => t.found)) {
        hunting = false;
        clearInterval(timerInterval);
        setStatus(false);
        log(s.allFound + ` Score: ${score}`, 'success');
      }
    }
  }

  // Hunt info
  const hi = $('huntInfo');
  if (hi) {
    const remaining = transmitters.filter(t => !t.found).length;
    hi.innerHTML = `Transmitters: <strong>${foundTransmitters.length}/${transmitters.length}</strong><br>` +
      `Remaining: <strong>${remaining}</strong><br>` +
      `Distance: <strong>${sig.dist === Infinity ? '---' : sig.dist.toFixed(0) + 'px'}</strong>`;
  }
}

function updateFoundList() {
  const list = $('foundList');
  if (!list) return;
  list.innerHTML = '';
  foundTransmitters.forEach(tx => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:4px 8px;border-radius:8px;background:rgba(0,0,0,.2);border:1px solid var(--border);';
    row.innerHTML = `<span style="color:#22c55e;">&#x2713;</span><span style="flex:1;font-size:.78rem;">${tx.name}</span><span style="font-size:.7rem;color:var(--text-muted);">${tx.freq}</span>`;
    list.appendChild(row);
  });
}

function newHunt() {
  transmitters = [];
  foundTransmitters = [];
  score = 0;
  elapsedSeconds = 0;
  playerX = mapW / 2;
  playerY = mapH / 2;

  const names = ['Rogue WiFi AP', 'Hidden BLE Beacon', 'ISM Jammer', 'Covert Tracker', 'Pirate FM', 'Mystery Signal', 'Rogue Drone TX'];
  const freqs = ['2.4 GHz', '2.402 GHz', '433 MHz', '868 MHz', '98.1 MHz', '915 MHz', '5.8 GHz'];

  for (let i = 0; i < NUM_TRANSMITTERS; i++) {
    transmitters.push({
      x: 40 + Math.random() * (mapW - 80),
      y: 40 + Math.random() * (mapH - 80),
      name: names[i % names.length],
      freq: freqs[i % freqs.length],
      found: false
    });
  }

  generateTerrain();
  hunting = true;
  setStatus(true);
  $('scoreDisplay').textContent = '0';
  updateFoundList();

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!hunting) return;
    elapsedSeconds++;
    const m = Math.floor(elapsedSeconds / 60);
    const s = elapsedSeconds % 60;
    $('timerDisplay').textContent = `${m}:${s.toString().padStart(2, '0')}`;
  }, 1000);

  log(`New hunt started! Find ${NUM_TRANSMITTERS} hidden transmitters.`, 'success');
}

function gameLoop() {
  drawMap();
  updateUI();
  requestAnimationFrame(gameLoop);
}

function buildGuide() {
  const el = $('triGuide');
  if (!el) return;
  const s = LANG[currentLang];
  el.innerHTML = `<strong>${s.guideTitle}</strong><br><br>${s.guideP1}<br><br>${s.guideP2}<br><br>${s.guideP3}`;
}

function buildDatabase() {
  const el = $('dfDatabase');
  if (!el) return;
  const s = LANG[currentLang];
  const techniques = [
    { name: 'Rotating Antenna', desc: 'Rotate a directional antenna and note the peak signal direction' },
    { name: 'Adcock Array', desc: 'Four vertical antennas arranged in a square for bearing measurement' },
    { name: 'Watson-Watt', desc: 'Two crossed loops provide instantaneous bearing' },
    { name: 'Doppler DF', desc: 'Rotating virtual antenna using switched elements' },
    { name: 'TDOA', desc: 'Time Difference of Arrival using multiple synchronized receivers' },
    { name: 'Power Difference', desc: 'Compare signal strength at multiple locations (hot/cold method)' },
  ];
  let html = `<strong>${s.dbTitle}</strong><br><br>`;
  html += '<div style="display:grid;grid-template-columns:1fr 2fr;gap:4px 8px;">';
  html += '<strong style="font-size:.7rem;">Technique</strong><strong style="font-size:.7rem;">Description</strong>';
  techniques.forEach(t => {
    html += `<span style="color:var(--accent);">${t.name}</span><span style="color:var(--text-muted);">${t.desc}</span>`;
  });
  html += '</div>';
  el.innerHTML = html;
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw=$('logoWrap'); if(lw) lw.innerHTML=LOGO_SVG;

  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog; if(cpb)cpb.onclick=copyLog; if(exb)exb.onclick=exportLog;
  initLogFilters();

  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp; if(hClose)hClose.onclick=closeHelp; if(hOv)hOv.onclick=closeHelp;
  initHelpTabs();

  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings; if(sClose)sClose.onclick=closeSettings; if(sOv)sOv.onclick=closeSettings;

  const lBtn=$('logBtn'),lClose=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog; if(lClose)lClose.onclick=closeLog;
  initLogResize();

  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}

  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};
  if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;

  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});

  const langSel=$('langSelect'); if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect'); if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));

  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}

  initHijriDate();

  /* ═══ SIGNAL HUNTER SETUP ═══ */
  mapCanvas = $('mapCanvas');
  compassCanvas = $('compassCanvas');
  if (mapCanvas) {
    mapCtx = mapCanvas.getContext('2d');
    mapW = mapCanvas.width;
    mapH = mapCanvas.height;

    mapCanvas.addEventListener('click', e => {
      if (!hunting) return;
      const rect = mapCanvas.getBoundingClientRect();
      const scaleX = mapW / rect.width;
      const scaleY = mapH / rect.height;
      playerX = (e.clientX - rect.left) * scaleX;
      playerY = (e.clientY - rect.top) * scaleY;
      playSound('beep');
    });
  }
  if (compassCanvas) compassCtx = compassCanvas.getContext('2d');

  $('newHuntBtn').onclick = newHunt;

  generateTerrain();
  buildGuide();
  buildDatabase();
  gameLoop();

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
