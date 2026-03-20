/**
 * Workshop DIY — Metadata Detective v1.2
 * Photo Forensics — Extract hidden EXIF data from photos
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG (injected once) ═══════ */

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="77.139885 78.322945 253.991455 136.254120"> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.423706,152.869797C187.478333,152.738831,187.655853,152.631668,187.818207,152.631668C188.090317,152.631668,190.483124,151.543793,191.616806,150.904663C191.883423,150.754349,193.032593,149.992432,194.170502,149.211517C197.431274,146.973755,199.240906,146.236755,202.587189,145.783752C203.799835,145.619583,204.629318,145.619736,205.933762,145.784378C212.620331,146.628281,217.423569,150.723984,219.325882,157.203781C219.72139,158.550934,219.771454,162.692093,219.406631,163.88208C218.187943,167.857361,216.579514,170.301239,213.792847,172.411835C209.455261,175.697083,203.83429,176.563141,198.809494,174.720413C197.244873,174.146637,196.144424,173.544434,194.478638,172.350433C191.905991,170.506454,190.53334,169.740753,188.031555,168.754135L187.293335,168.462997L187.308884,160.785461C187.317429,156.56282,187.36911,153.000763,187.423706,152.869797z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M259.791718,157.665863L264.87912,148.034195L272.338226,148.034195L263.03244,163.730896L263.03244,174.991974L256.261322,174.991974L256.261322,164.07489L246.792618,148.034195L254.505173,148.034195L259.791718,157.665863z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M240.369812,152.741394L236.495438,152.741394L236.495438,170.284775L240.369812,170.284775L240.369812,174.991974L225.849915,174.991974L225.849915,170.284775L229.724304,170.284775L229.724304,152.741394L225.849915,152.741394L225.849915,148.034195L240.369812,148.034195L240.369812,152.741394z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.789734,195.730286L203.964523,195.730286L203.964523,199.334839L330.789734,199.334839L330.789734,195.730286z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.789551,203.350861L161.68924,203.350861L161.68924,206.955414L330.789551,206.955414L330.789551,203.350861z"/> <path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M330.790314,210.972504L77.139885,210.972504L77.139885,214.577057L330.790314,214.577057L330.790314,210.972504z"/> </svg>`;

const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH6gMKAjgH2Wn1xgAAAAxJREFUeNrtwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAvBm8AAAB8IkWQwAAAABJRU5ErkJggg==';
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND EFFECTS ═══════ */

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click': osc.frequency.value = 800; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); break;
    case 'success': osc.frequency.value = 523; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); break;
    case 'error': osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); break;
  }
}

/* ═══════ i18n ═══════ */

const LANG = {
  en: {
    title: 'Metadata Detective', subtitle: '🔎 Extract hidden data from photos',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Photo Forensics', mainDesc: 'Select a photo to extract hidden EXIF metadata',
    sectionA: 'EXIF Field Reference', sectionB: 'Privacy Tips', sectionC: 'Forensic Analysis',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', theme: 'Theme', export: 'Export', filterAll: 'All',
    settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    faq_q1: 'What is Metadata Detective?', faq_a1: 'A photo forensics simulator that extracts hidden EXIF metadata from images.',
    faq_q2: 'Is this real EXIF data?', faq_a2: 'No, simulated data for educational purposes. No real photos are processed.',
    faq_q3: 'How do I change the language?', faq_a3: 'Open Settings and pick your language. Arabic enables RTL automatically.',
    faq_q4: 'Is my data private?', faq_a4: 'Yes. Everything runs locally in your browser.',
    howto_1: 'Select a sample photo from the buttons.', howto_2: 'Click Extract Metadata to reveal EXIF data.',
    howto_3: 'View GPS coordinates on the map canvas.', howto_4: 'Run Forensic Analysis for deeper insights.',
    wiki_themes_title: '🎨 Themes', wiki_themes: '8 built-in themes.',
    wiki_i18n_title: '🌐 Languages', wiki_i18n: 'Trilingual: EN, FR, AR with RTL.',
    wiki_log_title: '📜 Activity Log', wiki_log: 'Timestamped, color-coded log.',
    wiki_privacy_title: '🔒 Privacy', wiki_privacy: 'Local-first. No data sent anywhere.',
    working: 'Working…',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🔎 Metadata Detective ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    soundEffects: '🔊 Sound effects',
    whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap',
    musicMode: 'Music reactive', splashHint: 'tap to skip',
    newVersion: 'UPDATE', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    photo1: 'Street Photo', photo2: 'Selfie', photo3: 'Drone Shot', photo4: 'Landscape',
    extractBtn: 'Extract Metadata', exifTitle: 'EXIF Data Extracted', field: 'Field', value: 'Value',
    gpsMap: 'GPS Location Map', analyzeBtn: 'Run Forensic Analysis',
    exifRefText: 'EXIF stores metadata in image files: camera make/model, exposure, GPS, timestamps, software, and dimensions.',
    privacyText: 'Strip EXIF before sharing. Disable GPS tagging. Use metadata removal tools.',
    forensicText: 'Forensics uses EXIF to verify authenticity, track origins, and detect tampering.',
    extracting: 'Extracting EXIF metadata...', extracted: 'EXIF data extracted!',
    analyzing: 'Running forensic analysis...', analyzed: 'Forensic analysis complete!',
    noPhoto: 'Select a photo first', tamperDetected: 'Tampering detected!', noTamper: 'No tampering detected.',
  ,step1Title:'Configure',step1Desc:'Set up the simulation parameters and choose your encryption method.',step2Title:'Process',step2Desc:'The data is processed through the chosen algorithm or technique.',step3Title:'Transmit',step3Desc:'The processed signal or message is sent through the communication channel.',step4Title:'Verify',step4Desc:'The receiver decodes, verifies, and validates the received data.',sectionCode:'Device Code'},
  fr: {
    title: 'Detective Metadata', subtitle: '🔎 Extraire les donnees cachees des photos',
    disconnected: 'Deconnecte', connected: 'Connecte',
    mainSection: 'Analyse Photo', mainDesc: 'Selectionnez une photo pour extraire les metadonnees EXIF',
    sectionA: 'Reference EXIF', sectionB: 'Conseils Vie Privee', sectionC: 'Analyse Forensique',
    activityLog: 'Journal', eventsMsg: 'Evenements et messages',
    clear: 'Effacer', copy: 'Copier', theme: 'Theme', export: 'Exporter', filterAll: 'Tout',
    settings: '⚙️ Parametres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    faq_q1: 'Qu\'est-ce que Detective Metadata ?', faq_a1: 'Un simulateur de forensique photo qui extrait les metadonnees EXIF cachees.',
    faq_q2: 'Ce sont de vraies donnees EXIF ?', faq_a2: 'Non, donnees simulees a des fins educatives.',
    faq_q3: 'Comment changer la langue ?', faq_a3: 'Ouvrez Parametres et choisissez votre langue.',
    faq_q4: 'Mes donnees sont privees ?', faq_a4: 'Oui. Tout fonctionne localement.',
    howto_1: 'Selectionnez un echantillon photo.', howto_2: 'Cliquez Extraire pour reveler les donnees EXIF.',
    howto_3: 'Visualisez les coordonnees GPS sur la carte.', howto_4: 'Lancez l\'analyse forensique.',
    wiki_themes_title: '🎨 Themes', wiki_themes: '8 themes integres.',
    wiki_i18n_title: '🌐 Langues', wiki_i18n: 'Trilingue : EN, FR, AR.',
    wiki_log_title: '📜 Journal', wiki_log: 'Journal horodate et colore.',
    wiki_privacy_title: '🔒 Confidentialite', wiki_privacy: 'Local-first. Aucune donnee envoyee.',
    working: 'En cours…',
    t_mosque: 'Mosquee', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '🔎 Detective Metadata pret !',
    logCleared: 'Journal efface', copied: 'Copie !', copyFail: 'Echec',
    soundEffects: '🔊 Effets sonores',
    whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap',
    musicMode: 'Reactif musique', splashHint: 'appuyer pour passer',
    newVersion: 'MAJ', langChanged: '🌐 Langue → Francais', themeChanged: '🎨 Theme →',
    photo1: 'Photo rue', photo2: 'Selfie', photo3: 'Vue drone', photo4: 'Paysage',
    extractBtn: 'Extraire Metadata', exifTitle: 'Donnees EXIF Extraites', field: 'Champ', value: 'Valeur',
    gpsMap: 'Carte GPS', analyzeBtn: 'Lancer Analyse Forensique',
    exifRefText: 'EXIF stocke les metadonnees : appareil, exposition, GPS, horodatage, logiciel, dimensions.',
    privacyText: 'Supprimez les EXIF avant de partager. Desactivez le marquage GPS.',
    forensicText: 'La forensique utilise les EXIF pour verifier l\'authenticite et detecter les modifications.',
    extracting: 'Extraction des metadonnees EXIF...', extracted: 'Donnees EXIF extraites !',
    analyzing: 'Analyse forensique en cours...', analyzed: 'Analyse forensique terminee !',
    noPhoto: 'Selectionnez une photo', tamperDetected: 'Falsification detectee !', noTamper: 'Aucune falsification detectee.',
  ,step1Title:'Configurer',step1Desc:'Configure les paramètres de simulation et choisis ta méthode de chiffrement.',step2Title:'Traiter',step2Desc:'Les données sont traitées par l\'algorithme ou la technique choisie.',step3Title:'Transmettre',step3Desc:'Le signal ou message traité est envoyé par le canal de communication.',step4Title:'Vérifier',step4Desc:'Le récepteur décode, vérifie et valide les données reçues.',sectionCode:'Code Appareil'},
  ar: {
    title: 'محقق البيانات الوصفية', subtitle: '🔎 استخراج البيانات المخفية من الصور',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'تحليل الصور', mainDesc: 'اختر صورة لاستخراج بيانات EXIF المخفية',
    sectionA: 'مرجع EXIF', sectionB: 'نصائح الخصوصية', sectionC: 'التحليل الجنائي',
    activityLog: 'سجل النشاط', eventsMsg: 'الاحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', theme: 'المظهر', export: 'تصدير', filterAll: 'الكل',
    settings: '⚙️ الاعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'اسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    faq_q1: 'ما هو محقق البيانات الوصفية؟', faq_a1: 'محاكي تحليل جنائي للصور يستخرج بيانات EXIF المخفية.',
    faq_q2: 'هل هذه بيانات EXIF حقيقية؟', faq_a2: 'لا، بيانات محاكاة لاغراض تعليمية.',
    faq_q3: 'كيف اغير اللغة؟', faq_a3: 'افتح الاعدادات واختر لغتك. العربية تفعل الاتجاه من اليمين لليسار.',
    faq_q4: 'هل بياناتي خاصة؟', faq_a4: 'نعم. كل شيء يعمل محليا في متصفحك.',
    howto_1: 'اختر صورة من الازرار.', howto_2: 'انقر استخراج للكشف عن بيانات EXIF.',
    howto_3: 'شاهد احداثيات GPS على الخريطة.', howto_4: 'شغل التحليل الجنائي.',
    wiki_themes_title: '🎨 المظاهر', wiki_themes: '8 مظاهر مدمجة.',
    wiki_i18n_title: '🌐 اللغات', wiki_i18n: 'ثلاثي اللغات: EN, FR, AR.',
    wiki_log_title: '📜 سجل النشاط', wiki_log: 'سجل مؤرخ وملون.',
    wiki_privacy_title: '🔒 الخصوصية', wiki_privacy: 'محلي اولا. لا بيانات ترسل.',
    working: 'جار…',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'اندلس',
    t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'ادغال', t_robot: 'روبوت',
    ready: '🔎 محقق البيانات الوصفية جاهز!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    soundEffects: '🔊 مؤثرات صوتية',
    whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط',
    musicMode: 'تفاعل موسيقي', splashHint: 'انقر للتخطي',
    newVersion: 'تحديث', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    photo1: 'صورة شارع', photo2: 'سيلفي', photo3: 'لقطة درون', photo4: 'منظر طبيعي',
    extractBtn: 'استخراج البيانات', exifTitle: 'بيانات EXIF المستخرجة', field: 'الحقل', value: 'القيمة',
    gpsMap: 'خريطة GPS', analyzeBtn: 'تشغيل التحليل الجنائي',
    exifRefText: 'EXIF يخزن البيانات الوصفية: الكاميرا، التعريض، GPS، الطوابع الزمنية، البرمجيات، الابعاد.',
    privacyText: 'احذف EXIF قبل المشاركة. عطل وسم GPS.',
    forensicText: 'التحليل الجنائي يستخدم EXIF للتحقق من الاصالة وكشف التلاعب.',
    extracting: 'جاري استخراج بيانات EXIF...', extracted: 'تم استخراج بيانات EXIF!',
    analyzing: 'جاري التحليل الجنائي...', analyzed: 'اكتمل التحليل الجنائي!',
    noPhoto: 'اختر صورة اولا', tamperDetected: 'تم اكتشاف تلاعب!', noTamper: 'لم يتم اكتشاف تلاعب.',
  ,step1Title:'تكوين',step1Desc:'اضبط معلمات المحاكاة واختر طريقة التشفير.',step2Title:'معالجة',step2Desc:'تتم معالجة البيانات عبر الخوارزمية أو التقنية المختارة.',step3Title:'إرسال',step3Desc:'يتم إرسال الإشارة أو الرسالة المعالجة عبر قناة الاتصال.',step4Title:'تحقق',step4Desc:'يقوم المستقبل بفك التشفير والتحقق من البيانات المستلمة.',sectionCode:'كود الجهاز'}
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => { const k = opt.dataset.i18nOpt; if (s[k] != null) opt.textContent = s[k]; });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  const s = LANG[currentLang]; const label = s['t_' + name] || name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  log(`${s.themeChanged} ${label}`, 'info');
}

/* ═══════ LOG ═══════ */

let logContainer;

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = `log-line ${type}`;
  d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d);
  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') playSound('success');
  else if (type === 'error') playSound('error');
  applyLogFilter();
}

function clearLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (logContainer) logContainer.innerHTML = '';
  log(LANG[currentLang].logCleared);
}

async function copyLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); }
  catch { log(LANG[currentLang].copyFail, 'error'); }
}

/* ═══════ TOAST ═══════ */

let toastTimer = null;
function showToast(msg, ms = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; }
  if (toastTimer) clearTimeout(toastTimer);
  if (ms > 0) toastTimer = setTimeout(hideToast, ms);
}
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }

/* ═══════ STATUS ═══════ */

function setStatus(connected) {
  const txt = $('statusText'), pill = $('statusPill'), s = LANG[currentLang];
  if (txt) txt.textContent = connected ? s.connected : s.disconnected;
  if (pill) pill.classList.toggle('connected', connected);
}

/* ═══════ SPLASH ═══════ */

let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

/* ═══════ LOG FILTERS ═══════ */

let activeLogFilter = 'all';
function initLogFilters() {
  document.querySelectorAll('.log-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter();
    });
  });
}
function applyLogFilter() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  Array.from(logContainer.children).forEach(line => {
    line.style.display = (activeLogFilter === 'all' || line.classList.contains(activeLogFilter)) ? '' : 'none';
  });
}

/* ═══════ EXPORT LOG ═══════ */

function exportLog() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const text = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `log-${new Date().toISOString().slice(0,10)}.txt`; a.click();
  URL.revokeObjectURL(url);
}

/* ═══════ PANELS ═══════ */

function openPanel(pid, oid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(pid, oid, rid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.remove('open'); if (ov) ov.classList.remove('open'); const b = $(rid); if (b) b.focus(); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const sb = $('logPanel'); if (sb) sb.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const sb = $('logPanel'); if (sb) sb.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const sb = $('logPanel'); if (sb && sb.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }

function initHelpTabs() {
  document.querySelectorAll('.help-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const id = 'help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1);
      const target = $(id); if (target) target.classList.add('active');
    });
  });
}

/* ═══════ HIJRI DATE ═══════ */

function initHijriDate() {
  const el = $('hijriDate'); if (!el) return;
  try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day:'numeric', month:'long', year:'numeric' }).format(new Date()); } catch {}
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ═══════ METADATA DETECTIVE — SIMULATION ═══════ */

const FAKE_PHOTOS = [
  {
    name: 'IMG_20240315_142356.jpg',
    label: 'Street Photo — Paris',
    exif: {
      'Camera Make': 'Canon', 'Camera Model': 'EOS R5', 'Lens': 'RF 24-70mm f/2.8',
      'Resolution': '8192 x 5464', 'File Size': '14.2 MB', 'Color Space': 'sRGB',
      'ISO': '400', 'Aperture': 'f/5.6', 'Shutter Speed': '1/250s', 'Focal Length': '35mm',
      'Flash': 'No Flash', 'White Balance': 'Auto',
      'GPS Latitude': '48.8566 N', 'GPS Longitude': '2.3522 E', 'Altitude': '42m',
      'Date Taken': '2024-03-15 14:23:56', 'Date Modified': '2024-03-15 14:23:56',
      'Software': 'Adobe Lightroom 12.3', 'Copyright': 'All Rights Reserved',
      'Orientation': 'Horizontal', 'Metering Mode': 'Multi-segment'
    },
    gps: { lat: 48.8566, lng: 2.3522, city: 'Paris, France' },
    colors: ['#2a3a5e', '#8899bb', '#e8d5a0', '#556677', '#334455']
  },
  {
    name: 'selfie_20240612.jpg',
    label: 'Selfie — New York',
    exif: {
      'Camera Make': 'Apple', 'Camera Model': 'iPhone 15 Pro', 'Lens': 'Front Camera 12MP',
      'Resolution': '4032 x 3024', 'File Size': '4.8 MB', 'Color Space': 'Display P3',
      'ISO': '100', 'Aperture': 'f/1.9', 'Shutter Speed': '1/120s', 'Focal Length': '23mm',
      'Flash': 'No Flash', 'White Balance': 'Auto',
      'GPS Latitude': '40.7128 N', 'GPS Longitude': '-74.0060 W', 'Altitude': '12m',
      'Date Taken': '2024-06-12 09:15:32', 'Date Modified': '2024-06-12 09:15:32',
      'Software': 'iOS 17.5', 'Copyright': '',
      'Face Detection': 'Yes (1 face)', 'Portrait Mode': 'On', 'HDR': 'Smart HDR 5'
    },
    gps: { lat: 40.7128, lng: -74.006, city: 'New York, USA' },
    colors: ['#4488cc', '#99bbee', '#ffcc66', '#334466', '#667799']
  },
  {
    name: 'DJI_0847.jpg',
    label: 'Drone Shot — Dubai',
    exif: {
      'Camera Make': 'DJI', 'Camera Model': 'Mavic 3 Pro', 'Lens': 'Hasselblad 24mm',
      'Resolution': '5280 x 3956', 'File Size': '22.1 MB', 'Color Space': 'Adobe RGB',
      'ISO': '200', 'Aperture': 'f/2.8', 'Shutter Speed': '1/1000s', 'Focal Length': '24mm',
      'Flash': 'No Flash', 'White Balance': 'Sunny',
      'GPS Latitude': '25.2048 N', 'GPS Longitude': '55.2708 E', 'Altitude': '120m',
      'Date Taken': '2024-01-20 16:45:10', 'Date Modified': '2024-01-20 18:30:00',
      'Software': 'DJI Fly 1.12.0', 'Copyright': 'Drone Pilot LLC',
      'Flight Altitude': '120m AGL', 'Gimbal Pitch': '-45 deg', 'Drone Speed': '12 m/s'
    },
    gps: { lat: 25.2048, lng: 55.2708, city: 'Dubai, UAE' },
    colors: ['#cc8844', '#eebb66', '#5588aa', '#223344', '#ddaa55']
  },
  {
    name: 'landscape_autumn.jpg',
    label: 'Landscape — Kyoto',
    exif: {
      'Camera Make': 'Sony', 'Camera Model': 'A7R V', 'Lens': 'FE 16-35mm f/2.8 GM II',
      'Resolution': '9504 x 6336', 'File Size': '38.7 MB', 'Color Space': 'Adobe RGB',
      'ISO': '100', 'Aperture': 'f/11', 'Shutter Speed': '1/60s', 'Focal Length': '20mm',
      'Flash': 'No Flash', 'White Balance': 'Cloudy',
      'GPS Latitude': '35.0116 N', 'GPS Longitude': '135.7681 E', 'Altitude': '85m',
      'Date Taken': '2024-11-08 07:22:15', 'Date Modified': '2024-11-08 07:22:15',
      'Software': 'Capture One 23', 'Copyright': 'Nature Photographer',
      'Focus Mode': 'AF-S', 'Drive Mode': 'Single', 'Scene Type': 'Landscape'
    },
    gps: { lat: 35.0116, lng: 135.7681, city: 'Kyoto, Japan' },
    colors: ['#cc4422', '#ee8833', '#44aa44', '#556633', '#ffdd44']
  }
];

let selectedPhoto = 0;

function drawFakePhoto(idx) {
  const canvas = $('photoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const photo = FAKE_PHOTOS[idx];
  const w = canvas.width, h = canvas.height;

  // Draw a procedural landscape based on colors
  const colors = photo.colors;
  ctx.fillStyle = colors[3]; ctx.fillRect(0, 0, w, h);

  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
  skyGrad.addColorStop(0, colors[0]); skyGrad.addColorStop(1, colors[1]);
  ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, w, h * 0.6);

  // Ground
  ctx.fillStyle = colors[2]; ctx.fillRect(0, h * 0.6, w, h * 0.4);

  // Some shapes to make it look like a photo
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = colors[i % colors.length] + '66';
    const x = Math.random() * w, y = h * 0.3 + Math.random() * h * 0.5;
    const size = 20 + Math.random() * 60;
    ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
  }

  // Filename overlay
  ctx.fillStyle = '#000000aa'; ctx.fillRect(0, h - 30, w, 30);
  ctx.fillStyle = '#fff'; ctx.font = '12px Orbitron, monospace';
  ctx.fillText(photo.name, 10, h - 10);

  // EXIF icon
  ctx.fillStyle = '#ffcc00'; ctx.font = '20px serif'; ctx.fillText('📷', w - 35, h - 8);
}

function drawGPSMap(gps) {
  const canvas = $('mapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;

  // Dark map background
  ctx.fillStyle = '#0a1628'; ctx.fillRect(0, 0, w, h);

  // Grid lines
  ctx.strokeStyle = '#1a2a48'; ctx.lineWidth = 0.5;
  for (let i = 0; i < w; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
  for (let i = 0; i < h; i += 20) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

  // Continent shapes (simplified)
  ctx.fillStyle = '#1a3a2a';
  ctx.beginPath();
  ctx.ellipse(w*0.35, h*0.35, 60, 40, -0.3, 0, Math.PI*2); ctx.fill(); // Europe/Africa
  ctx.beginPath();
  ctx.ellipse(w*0.7, h*0.4, 50, 35, 0.2, 0, Math.PI*2); ctx.fill(); // Asia
  ctx.beginPath();
  ctx.ellipse(w*0.15, h*0.45, 40, 50, 0.1, 0, Math.PI*2); ctx.fill(); // Americas

  // Convert GPS to canvas coordinates
  const px = ((gps.lng + 180) / 360) * w;
  const py = ((90 - gps.lat) / 180) * h;

  // Pulsing marker
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  for (let r = 30; r > 0; r -= 10) {
    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI*2);
    ctx.fillStyle = accent + Math.floor(20 + (30-r)*2).toString(16); ctx.fill();
  }
  ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI*2);
  ctx.fillStyle = '#ff3333'; ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

  // Label
  ctx.fillStyle = '#fff'; ctx.font = '11px Orbitron, monospace';
  ctx.fillText(`${gps.city}`, px + 10, py - 10);
  ctx.fillStyle = '#aaa'; ctx.font = '9px monospace';
  ctx.fillText(`${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}`, px + 10, py + 5);

  // Crosshairs
  ctx.strokeStyle = '#ff333366'; ctx.lineWidth = 1; ctx.setLineDash([4,4]);
  ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, h); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, py); ctx.lineTo(w, py); ctx.stroke();
  ctx.setLineDash([]);
}

async function extractMetadata() {
  const s = LANG[currentLang];
  const photo = FAKE_PHOTOS[selectedPhoto];

  showToast(s.extracting);
  log(s.extracting, 'tx');
  await sleep(800);

  // Draw photo
  drawFakePhoto(selectedPhoto);

  // Populate EXIF table
  const tbody = $('exifBody');
  const table = $('exifTable');
  if (tbody && table) {
    tbody.innerHTML = '';
    const entries = Object.entries(photo.exif);
    for (let i = 0; i < entries.length; i++) {
      const [k, v] = entries[i];
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--glass-border)';
      tr.style.opacity = '0';
      tr.innerHTML = `<td style="padding:.3rem .4rem;font-weight:600;color:var(--accent);">${k}</td><td style="padding:.3rem .4rem;">${v}</td>`;
      tbody.appendChild(tr);
      // Animate rows appearing
      await sleep(40);
      tr.style.transition = 'opacity .3s';
      tr.style.opacity = '1';
    }
    table.style.display = 'block';
  }

  // Draw map
  const mapSection = $('mapSection');
  if (mapSection) { mapSection.style.display = 'block'; drawGPSMap(photo.gps); }

  hideToast();
  log(`${s.extracted} — ${photo.label}`, 'success');
  setStatus(true);
}

async function runForensicAnalysis() {
  const s = LANG[currentLang];
  const photo = FAKE_PHOTOS[selectedPhoto];
  const results = $('forensicResults');
  if (!results) return;

  showToast(s.analyzing);
  log(s.analyzing, 'tx');
  results.style.display = 'block';
  results.innerHTML = '';
  await sleep(1000);

  const checks = [
    { label: 'Timestamp Consistency', pass: photo.exif['Date Taken'] === photo.exif['Date Modified'], detail: photo.exif['Date Taken'] === photo.exif['Date Modified'] ? 'Creation and modification dates match' : 'MISMATCH: Dates differ — possible editing' },
    { label: 'GPS Data Present', pass: true, detail: `Location: ${photo.gps.city} (${photo.gps.lat}, ${photo.gps.lng})` },
    { label: 'Software Analysis', pass: !photo.exif.Software.includes('Photoshop'), detail: `Software: ${photo.exif.Software}` },
    { label: 'Resolution Check', pass: true, detail: `Resolution: ${photo.exif.Resolution}` },
    { label: 'Color Space', pass: true, detail: `Color space: ${photo.exif['Color Space']}` },
    { label: 'Camera Serial', pass: true, detail: 'Serial number: [REDACTED]' },
  ];

  const tampered = checks.some(c => !c.pass);

  for (const check of checks) {
    const div = document.createElement('div');
    div.style.cssText = 'padding:.4rem;margin:.3rem 0;border-radius:4px;font-size:.8rem;border-left:3px solid ' + (check.pass ? '#33cc55' : '#ff4444');
    div.innerHTML = `<strong>${check.pass ? '✅' : '⚠️'} ${check.label}</strong><br><span style="opacity:.8;">${check.detail}</span>`;
    results.appendChild(div);
    await sleep(300);
  }

  // Summary
  const summary = document.createElement('div');
  summary.style.cssText = 'margin-top:.8rem;padding:.6rem;border-radius:6px;font-weight:700;text-align:center;background:' + (tampered ? '#ff444433' : '#33cc5533');
  summary.textContent = tampered ? `⚠️ ${s.tamperDetected}` : `✅ ${s.noTamper}`;
  results.appendChild(summary);

  hideToast();
  log(tampered ? s.tamperDetected : s.noTamper, tampered ? 'error' : 'success');
}

/* ═══════ INIT ═══════ */

function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;

  // Log buttons
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();

  // Help panel
  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp; if (hClose) hClose.onclick = closeHelp; if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();

  // Settings panel
  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings; if (sClose) sClose.onclick = closeSettings; if (sOv) sOv.onclick = closeSettings;

  // Log panel
  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog; if (lClose) lClose.onclick = closeLog;

  // Sound toggle
  const soundTgl = $('soundToggle');
  if (soundTgl) {
    try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {}
    soundTgl.checked = soundEnabled;
    soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} });
  }

  // Escape key
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); });

  // Language & theme dropdowns
  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));

  // Restore preferences
  try {
    const savedLang = localStorage.getItem('wdiy-lang');
    const savedTheme = localStorage.getItem('wdiy-theme');
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLanguage(savedLang);
  } catch {}

  initHijriDate();

  // ═══════ APP-SPECIFIC INIT ═══════

  // Photo selection buttons
  document.querySelectorAll('[data-photo]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-photo]').forEach(b => b.classList.remove('primary'));
      btn.classList.add('primary');
      selectedPhoto = parseInt(btn.dataset.photo);
      drawFakePhoto(selectedPhoto);
      log(`📷 Selected: ${FAKE_PHOTOS[selectedPhoto].label}`, 'info');
    });
  });

  // Extract button
  const extractBtn = $('extractBtn');
  if (extractBtn) extractBtn.onclick = extractMetadata;

  // Analyze button
  const analyzeBtn = $('analyzeBtn');
  if (analyzeBtn) analyzeBtn.onclick = runForensicAnalysis;

  // Draw initial photo
  drawFakePhoto(0);

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();


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
