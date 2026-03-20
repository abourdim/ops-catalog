/**
 * Workshop DIY — Evil Firmware Flasher v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Sound
 * Easter eggs: Konami, Morse, Matrix rain, Debug, Shake report, Time-travel, Typewriter
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */

const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="30" width="60" height="40" rx="5" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"/>
  <rect x="35" y="40" width="30" height="5" rx="2" fill="currentColor" opacity=".4">
    <animate attributeName="width" values="10;30;10" dur="1.5s" repeatCount="indefinite"/>
  </rect>
  <rect x="35" y="50" width="20" height="5" rx="2" fill="currentColor" opacity=".3">
    <animate attributeName="width" values="20;10;20" dur="2s" repeatCount="indefinite"/>
  </rect>
  <line x1="20" y1="75" x2="80" y2="75" stroke="currentColor" stroke-width="1" opacity=".3"/>
  <circle cx="30" cy="80" r="3" fill="currentColor" opacity=".4"/>
  <circle cx="50" cy="80" r="3" fill="currentColor" opacity=".4"/>
  <circle cx="70" cy="80" r="3" fill="currentColor" opacity=".4"/>
</svg>`;

const FOOTER_ICON = '';
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

/* ═══════ SOUND ═══════ */

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click':
      osc.frequency.value = 800; osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      osc.start(t); osc.stop(t + 0.08); break;
    case 'success':
      osc.frequency.value = 523; osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.start(t); osc.stop(t + 0.3);
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2); gain2.connect(audioCtx.destination);
      gain2.gain.value = 0.08; osc2.frequency.value = 659; osc2.type = 'sine';
      gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc2.start(t + 0.15); osc2.stop(t + 0.4); break;
    case 'error':
      osc.frequency.value = 200; osc.type = 'square';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.25); break;
  }
}

/* ═══════ i18n ═══════ */

const LANG = {
  en: {
    title: 'Evil Firmware Flasher',
    subtitle: 'Firmware vulnerability analysis simulator',
    disconnected: 'Offline', connected: 'Flashing',
    mainSection: 'Evil Firmware Flasher',
    mainDesc: 'Simulate firmware modification and vulnerability injection analysis',
    sectionA: 'Firmware Flash', sectionB: 'Hex Dump Viewer', sectionC: 'Theory & Notes',
    firmwareStats: 'Firmware Stats', deviceInfo: 'Device Info',
    deviceLabel: 'Target Device', payloadLabel: 'Payload',
    flashBtn: 'Flash', abortBtn: 'Abort', resetBtn: 'Reset',
    theoryText: 'Educational simulation of firmware security analysis. Demonstrates how malicious firmware modifications work to help build better defenses.',
    theory1: 'Firmware = software embedded in hardware devices (routers, IoT, USB)',
    theory2: 'Backdoors allow unauthorized remote access to compromised devices',
    theory3: 'Checksum verification detects unauthorized firmware modifications',
    theory4: 'Secure boot chains prevent loading of tampered firmware images',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', theme: 'Theme',
    settings: 'Settings', language: 'Language',
    help: 'Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    faq_q1: 'What is this app?', faq_a1: 'A firmware vulnerability analysis simulator for educational purposes. No real firmware is modified.',
    faq_q2: 'How do I change the theme?', faq_a2: 'Open Settings and pick a theme from the dropdown.',
    faq_q3: 'How do I change the language?', faq_a3: 'Open Settings and pick your language. Arabic enables RTL automatically.',
    faq_q4: 'Is this real hacking?', faq_a4: 'No. Everything is simulated in your browser for education only.',
    howto_1: 'Select a target device and payload type.',
    howto_2: 'Click Flash to begin the firmware modification simulation.',
    howto_3: 'Watch the hex dump and progress visualization on canvas.',
    howto_4: 'Use Settings to customize theme and language.',
    wiki_themes_title: 'Themes', wiki_themes: '8 built-in themes available.',
    wiki_i18n_title: 'Languages', wiki_i18n: 'Trilingual: English, Francais, Arabic.',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina',
    t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: 'Firmware Flasher ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    filterAll: 'All', working: 'Working...',
    soundEffects: 'Sound effects',
    whisperMode: 'Whisper mode', breathingGuide: 'Breathing guide', dhikrTap: 'Tap',
    musicMode: 'Music reactive', chatPlaceholder: 'Talk to the robot...',
    splashHint: 'tap to skip', newVersion: 'UPDATE',
    langChanged: 'Language: English', themeChanged: 'Theme:',
    flashStarted: 'Flash started', flashAborted: 'Flash aborted',
    flashComplete: 'Flash complete!', flashReset: 'System reset',
    scanningFw: 'Scanning firmware...', vulnFound: 'Vulnerability found!',
    payloadInjected: 'Payload injected', checksumBypass: 'Checksum bypassed',
  ,step1Title:'Identify Target',step1Desc:'Select the system, device, or protocol to analyze for vulnerabilities.',step2Title:'Prepare Attack',step2Desc:'Configure the attack parameters and set up the exploitation environment.',step3Title:'Execute',step3Desc:'Launch the simulated attack and observe how the vulnerability is exploited.',step4Title:'Defend',step4Desc:'Learn the countermeasures and defensive techniques to protect against this attack.'},
  fr: {
    title: 'Flasheur Firmware Malveillant',
    subtitle: 'Simulateur d\'analyse de firmware',
    disconnected: 'Hors ligne', connected: 'Flash en cours',
    mainSection: 'Flasheur Firmware', mainDesc: 'Simulez la modification de firmware et l\'injection de vulnerabilites',
    sectionA: 'Flash Firmware', sectionB: 'Visualiseur Hex', sectionC: 'Theorie & Notes',
    firmwareStats: 'Stats Firmware', deviceInfo: 'Info Appareil',
    deviceLabel: 'Appareil cible', payloadLabel: 'Charge utile',
    flashBtn: 'Flasher', abortBtn: 'Annuler', resetBtn: 'Reinit.',
    theoryText: 'Simulation educative de l\'analyse de securite firmware.',
    theory1: 'Firmware = logiciel embarque dans les appareils',
    theory2: 'Les portes derobees permettent un acces distant non autorise',
    theory3: 'La verification de checksum detecte les modifications',
    theory4: 'Le demarrage securise empeche le chargement de firmware altere',
    activityLog: 'Journal', eventsMsg: 'Evenements',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', theme: 'Theme',
    settings: 'Parametres', language: 'Langue',
    help: 'Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    faq_q1: 'Qu\'est-ce que cette appli?', faq_a1: 'Un simulateur d\'analyse de firmware educatif.',
    faq_q2: 'Comment changer le theme?', faq_a2: 'Ouvrez Parametres et choisissez.',
    faq_q3: 'Comment changer la langue?', faq_a3: 'Ouvrez Parametres et choisissez votre langue.',
    faq_q4: 'Est-ce du vrai piratage?', faq_a4: 'Non. Tout est simule dans votre navigateur.',
    howto_1: 'Selectionnez un appareil cible et un type de charge utile.',
    howto_2: 'Cliquez Flasher pour demarrer la simulation.',
    howto_3: 'Observez le dump hex et la visualisation.',
    howto_4: 'Utilisez Parametres pour personnaliser.',
    wiki_themes_title: 'Themes', wiki_themes: '8 themes integres.',
    wiki_i18n_title: 'Langues', wiki_i18n: 'Trilingue: Anglais, Francais, Arabe.',
    t_mosque: 'Mosquee', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_riad: 'Riad', t_medina: 'Medina',
    t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: 'Flasheur pret!',
    logCleared: 'Journal efface', copied: 'Copie!', copyFail: 'Echec',
    filterAll: 'Tout', working: 'En cours...',
    soundEffects: 'Effets sonores',
    whisperMode: 'Mode murmure', breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap',
    musicMode: 'Reactif musique', chatPlaceholder: 'Parle au robot...',
    splashHint: 'appuyer pour passer', newVersion: 'MAJ',
    langChanged: 'Langue: Francais', themeChanged: 'Theme:',
    flashStarted: 'Flash demarre', flashAborted: 'Flash annule',
    flashComplete: 'Flash termine!', flashReset: 'Systeme reinitialise',
    scanningFw: 'Scan firmware...', vulnFound: 'Vulnerabilite trouvee!',
    payloadInjected: 'Charge injectee', checksumBypass: 'Checksum contourne',
  ,step1Title:'Identifier la cible',step1Desc:'Sélectionne le système ou protocole à analyser pour les vulnérabilités.',step2Title:'Préparer l\'attaque',step2Desc:'Configure les paramètres d\'attaque et l\'environnement d\'exploitation.',step3Title:'Exécuter',step3Desc:'Lance l\'attaque simulée et observe comment la vulnérabilité est exploitée.',step4Title:'Défendre',step4Desc:'Apprends les contre-mesures et techniques défensives pour te protéger.'},
  ar: {
    title: 'محلل البرامج الثابتة الخبيثة',
    subtitle: 'محاكي تحليل ثغرات البرامج الثابتة',
    disconnected: 'غير متصل', connected: 'جاري التحميل',
    mainSection: 'محلل البرامج الثابتة', mainDesc: 'محاكاة تعديل البرامج الثابتة وتحليل حقن الثغرات',
    sectionA: 'تحميل البرنامج الثابت', sectionB: 'عارض Hex', sectionC: 'النظرية',
    firmwareStats: 'احصائيات البرنامج', deviceInfo: 'معلومات الجهاز',
    deviceLabel: 'الجهاز المستهدف', payloadLabel: 'الحمولة',
    flashBtn: 'تحميل', abortBtn: 'إلغاء', resetBtn: 'إعادة',
    theoryText: 'محاكاة تعليمية لتحليل أمان البرامج الثابتة.',
    theory1: 'البرنامج الثابت = برنامج مدمج في الأجهزة',
    theory2: 'الأبواب الخلفية تسمح بالوصول عن بعد غير المصرح به',
    theory3: 'التحقق من المجموع يكشف التعديلات غير المصرح بها',
    theory4: 'سلسلة التشغيل الآمن تمنع تحميل البرامج المعدلة',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', theme: 'المظهر',
    settings: 'الإعدادات', language: 'اللغة',
    help: 'مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    faq_q1: 'ما هو هذا التطبيق؟', faq_a1: 'محاكي تعليمي لتحليل ثغرات البرامج الثابتة.',
    faq_q2: 'كيف أغير المظهر؟', faq_a2: 'افتح الإعدادات واختر المظهر.',
    faq_q3: 'كيف أغير اللغة؟', faq_a3: 'افتح الإعدادات واختر لغتك.',
    faq_q4: 'هل هذا اختراق حقيقي؟', faq_a4: 'لا. كل شيء محاكاة في المتصفح للتعليم فقط.',
    howto_1: 'اختر جهازًا مستهدفًا ونوع الحمولة.',
    howto_2: 'انقر تحميل لبدء محاكاة التعديل.',
    howto_3: 'راقب عرض hex والتقدم على اللوحة.',
    howto_4: 'استخدم الإعدادات للتخصيص.',
    wiki_themes_title: 'المظاهر', wiki_themes: '8 مظاهر مدمجة.',
    wiki_i18n_title: 'اللغات', wiki_i18n: 'ثلاثي اللغات: إنجليزي، فرنسي، عربي.',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس',
    t_riad: 'رياض', t_medina: 'مدينة',
    t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    ready: 'محلل البرامج الثابتة جاهز!',
    logCleared: 'تم المسح', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    filterAll: 'الكل', working: 'جارٍ...',
    soundEffects: 'مؤثرات صوتية',
    whisperMode: 'وضع الهمس', breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط',
    musicMode: 'تفاعل موسيقي', chatPlaceholder: 'تحدث مع الروبوت...',
    splashHint: 'انقر للتخطي', newVersion: 'تحديث',
    langChanged: 'اللغة: العربية', themeChanged: 'المظهر:',
    flashStarted: 'بدأ التحميل', flashAborted: 'تم الإلغاء',
    flashComplete: 'اكتمل التحميل!', flashReset: 'إعادة تعيين النظام',
    scanningFw: 'جاري مسح البرنامج الثابت...', vulnFound: 'تم العثور على ثغرة!',
    payloadInjected: 'تم حقن الحمولة', checksumBypass: 'تم تجاوز المجموع',
  ,step1Title:'تحديد الهدف',step1Desc:'اختر النظام أو البروتوكول لتحليل نقاط الضعف.',step2Title:'تحضير الهجوم',step2Desc:'اضبط معلمات الهجوم وأعد بيئة الاستغلال.',step3Title:'تنفيذ',step3Desc:'أطلق الهجوم المحاكى وراقب كيف يتم استغلال الثغرة.',step4Title:'دفاع',step4Desc:'تعلم الإجراءات المضادة والتقنيات الدفاعية للحماية.'}
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang];
  if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (s[k] != null) el.textContent = s[k];
  });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => {
    const k = opt.dataset.i18nOpt;
    if (s[k] != null) opt.textContent = s[k];
  });
  document.title = s.title + ' — Workshop DIY';
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect');
  if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

/* ═══════ THEMES ═══════ */

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect');
  if (sel) sel.value = name;
  const s = LANG[currentLang];
  const label = s['t_' + name] || name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(s.themeChanged + ' ' + label, 'info');
}

/* ═══════ LOG ═══════ */

let logContainer;

function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = 'log-line ' + type;
  const fullText = '[' + new Date().toLocaleTimeString() + '] ' + msg;

  if (typewriterEnabled) {
    logContainer.appendChild(d);
    typewriterAppend(d, fullText);
  } else {
    d.textContent = fullText;
    logContainer.appendChild(d);
  }

  logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') { playSound('success'); pulseBismillah('success'); setPetState('happy'); }
  else if (type === 'error') { playSound('error'); pulseBismillah('error'); setPetState('sad'); }
  logWithHistory(msg, type);
  applyLogFilter();
  resetPetSleep();
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

function showToast(msg, autoHideMs = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) {
    t.textContent = msg || LANG[currentLang].working;
    el.style.display = 'block';
  }
  if (toastTimer) clearTimeout(toastTimer);
  if (autoHideMs > 0) {
    toastTimer = setTimeout(hideToast, autoHideMs);
  }
}

function hideToast() {
  const el = $('toastIndicator');
  if (el) el.style.display = 'none';
  if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
}

/* ═══════ STATUS ═══════ */

function setStatus(connected) {
  const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang];
  if (txt) txt.textContent = connected ? s.connected : s.disconnected;
  if (pill) pill.classList.toggle('connected', connected);
}

/* ═══════ SPLASH ═══════ */

let splashTimer;

function dismissSplash() {
  const s = $('splash');
  if (!s) return;
  s.classList.add('hidden');
  if (splashTimer) clearTimeout(splashTimer);
  setTimeout(() => s.remove(), 600);
  playSound('click');
}

function initSplash() {
  const s = $('splash');
  if (!s) return;
  const sl = $('splashLogo');
  if (sl) sl.innerHTML = LOGO_SVG;
  splashTimer = setTimeout(dismissSplash, 2500);
}

/* ═══════ LOG FILTERS ═══════ */

let activeLogFilter = 'all';

function initLogFilters() {
  const filters = document.querySelectorAll('.log-filter');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLogFilter = btn.dataset.filter;
      applyLogFilter();
      playSound('click');
    });
  });
}

function applyLogFilter() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  Array.from(logContainer.children).forEach(line => {
    if (activeLogFilter === 'all') { line.style.display = ''; return; }
    line.style.display = line.classList.contains(activeLogFilter) ? '' : 'none';
  });
}

/* ═══════ EXPORT LOG ═══════ */

function exportLog() {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const lines = Array.from(logContainer.children).map(d => d.textContent);
  const text = lines.join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'firmware-log-' + new Date().toISOString().slice(0, 10) + '.txt';
  a.click();
  URL.revokeObjectURL(url);
  log(LANG[currentLang].copied, 'success');
  playSound('success');
}

/* ═══════ VERSION CHECKER ═══════ */

function checkVersion() {
  try {
    const stored = localStorage.getItem('wdiy-latest-version');
    if (stored && stored !== APP_VERSION) {
      const btn = $('settingsBtn');
      if (btn && !btn.querySelector('.version-update')) {
        const badge = document.createElement('span');
        badge.className = 'version-update';
        badge.textContent = LANG[currentLang].newVersion || 'UPDATE';
        btn.style.position = 'relative';
        badge.style.cssText = 'position:absolute;top:-6px;inset-inline-end:-6px;';
        btn.appendChild(badge);
      }
    }
  } catch {}
}

/* ═══════ APP-TO-APP MESSAGING ═══════ */

const APP_MSG_KEY = 'wdiy-app-msg';

function sendAppMessage(type, data) {
  try {
    const msg = { type, data, from: document.title, ts: Date.now() };
    localStorage.setItem(APP_MSG_KEY, JSON.stringify(msg));
    localStorage.removeItem(APP_MSG_KEY);
  } catch {}
}

function onAppMessage(callback) {
  window.addEventListener('storage', e => {
    if (e.key !== APP_MSG_KEY || !e.newValue) return;
    try {
      const msg = JSON.parse(e.newValue);
      callback(msg);
    } catch {}
  });
}

/* ═══════ KONAMI CODE ═══════ */

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;

function initKonami() {
  document.addEventListener('keydown', e => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0;
        activateRetroTheme();
      }
    } else {
      konamiIdx = 0;
    }
  });
}

function activateRetroTheme() {
  setTheme('retro');
  log('KONAMI CODE ACTIVATED — RETRO MODE!', 'success');
  playSound('success');
}

/* ═══════ BISMILLAH HEARTBEAT ═══════ */

function pulseBismillah(type) {
  const bism = document.querySelector('.bismillah');
  if (!bism) return;
  bism.classList.remove('pulse-success', 'pulse-error');
  void bism.offsetWidth;
  bism.classList.add(type === 'error' ? 'pulse-error' : 'pulse-success');
  setTimeout(() => bism.classList.remove('pulse-success', 'pulse-error'), 700);
}

/* ═══════ MORSE CODE LOG ═══════ */

const MORSE = {
  'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---',
  'k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-',
  'u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','0':'-----','1':'.----','2':'..---',
  '3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',' ':'/'
};

let morseTimeout = null;
let morseActive = false;

function textToMorse(text) {
  return text.toLowerCase().split('').map(c => MORSE[c] || '').join(' ');
}

async function blinkMorse(text) {
  if (morseActive) return;
  morseActive = true;
  const dot = document.querySelector('.status-dot');
  if (!dot) { morseActive = false; return; }
  const orig = dot.style.background;
  const morse = textToMorse(text.replace(/\[.*?\]\s*/g, ''));
  for (const ch of morse) {
    if (!morseActive) break;
    if (ch === '.') {
      dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33';
      await sleep(100);
    } else if (ch === '-') {
      dot.style.background = '#33ff33'; dot.style.boxShadow = '0 0 8px #33ff33';
      await sleep(300);
    } else if (ch === '/') {
      await sleep(400); continue;
    } else if (ch === ' ') {
      await sleep(200); continue;
    }
    dot.style.background = orig; dot.style.boxShadow = '';
    await sleep(100);
  }
  dot.style.background = ''; dot.style.boxShadow = '';
  morseActive = false;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function initMorseLog() {
  document.addEventListener('mousedown', e => {
    const line = e.target.closest('.log-line');
    if (!line) return;
    morseTimeout = setTimeout(() => blinkMorse(line.textContent), 600);
  });
  document.addEventListener('mouseup', () => {
    if (morseTimeout) { clearTimeout(morseTimeout); morseTimeout = null; }
  });
}

/* ═══════ MATRIX RAIN ═══════ */

let matrixRunning = false;
let matrixAnim = null;

const ARABIC_CHARS = 'بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';

function toggleMatrix() {
  const canvas = $('matrixCanvas');
  if (!canvas) return;
  if (matrixRunning) {
    matrixRunning = false;
    cancelAnimationFrame(matrixAnim);
    canvas.classList.remove('active');
    log('Matrix rain off', 'info');
    return;
  }
  matrixRunning = true;
  canvas.classList.add('active');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cols = Math.floor(canvas.width / 16);
  const drops = Array(cols).fill(1);

  function draw() {
    if (!matrixRunning) return;
    ctx.fillStyle = 'rgba(0,0,0,0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33';
    ctx.font = '14px Amiri, serif';
    for (let i = 0; i < drops.length; i++) {
      const ch = ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)];
      ctx.fillText(ch, i * 16, drops[i] * 16);
      if (drops[i] * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    matrixAnim = requestAnimationFrame(draw);
  }
  draw();
  log('Matrix rain on!', 'success');
}

let logoClickCount = 0;
let logoClickTimer = null;

function initMatrixTrigger() {
  const logo = $('logoWrap');
  if (!logo) return;
  logo.style.cursor = 'pointer';
  logo.addEventListener('click', () => {
    logoClickCount++;
    if (logoClickTimer) clearTimeout(logoClickTimer);
    if (logoClickCount >= 3) {
      logoClickCount = 0;
      toggleMatrix();
    } else {
      logoClickTimer = setTimeout(() => logoClickCount = 0, 500);
    }
  });
}

/* ═══════ DEBUG PANEL ═══════ */

function initDebug() {
  if (!new URLSearchParams(window.location.search).has('debug')) return;
  const panel = $('debugPanel');
  if (!panel) return;
  panel.classList.add('active');
  const fpsEl = $('debugFps'), memEl = $('debugMem');
  let frames = 0, lastTime = performance.now();

  function tick() {
    frames++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      if (fpsEl) fpsEl.textContent = frames + ' FPS';
      if (memEl && performance.memory) {
        memEl.textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(1) + ' MB';
      }
      frames = 0;
      lastTime = now;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  log('Debug mode active', 'info');
}

/* ═══════ SHAKE TO REPORT ═══════ */

function initShakeReport() {
  if (!window.DeviceMotionEvent) return;
  let lastShake = 0;
  const THRESHOLD = 25;

  window.addEventListener('devicemotion', e => {
    const acc = e.accelerationIncludingGravity;
    if (!acc) return;
    const force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
    if (force > THRESHOLD && Date.now() - lastShake > 2000) {
      lastShake = Date.now();
      generateBugReport();
    }
  });
}

function generateBugReport() {
  if (!logContainer) logContainer = $('logContainer');
  const lines = logContainer ? Array.from(logContainer.children).map(d => d.textContent) : [];
  const report = {
    app: document.title, version: APP_VERSION,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screen: screen.width + 'x' + screen.height,
    viewport: innerWidth + 'x' + innerHeight,
    theme: document.documentElement.dataset.theme,
    lang: currentLang, log: lines.slice(-50)
  };
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bug-report-' + Date.now() + '.json';
  a.click();
  URL.revokeObjectURL(url);
  log('Bug report exported (shake)', 'success');
  playSound('success');
}

/* ═══════ TIME-TRAVEL LOG ═══════ */

const logHistory = [];

function logWithHistory(msg, type) {
  logHistory.push({ msg, type, ts: Date.now() });
}

function initTimeTravel() {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'z') {
      const panel = $('logPanel');
      if (!panel || !panel.classList.contains('open')) return;
      e.preventDefault();
      if (!logContainer) logContainer = $('logContainer');
      if (logContainer && logContainer.lastChild) {
        logContainer.removeChild(logContainer.lastChild);
        logHistory.pop();
        playSound('click');
      }
    }
  });
}

/* ═══════ TYPEWRITER LOG MODE ═══════ */

let typewriterEnabled = true;

async function typewriterAppend(element, text) {
  element.classList.add('typing');
  element.textContent = '';
  for (let i = 0; i < text.length; i++) {
    element.textContent += text[i];
    if (element.parentElement) element.parentElement.scrollTop = element.parentElement.scrollHeight;
    await sleep(12 + Math.random() * 18);
  }
  element.classList.remove('typing');
}

/* ═══════ HIJRI DATE ═══════ */

function calcHijriDate() {
  try {
    const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(new Date());
    return hijri;
  } catch { return ''; }
}

function initHijriDate() {
  const el = $('hijriDate');
  if (!el) return;
  const h = calcHijriDate();
  if (h) el.textContent = h;
}

/* ═══════ WHISPER MODE ═══════ */

let recognition = null;
let whisperActive = false;

function toggleWhisper() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    log('Speech not supported', 'error');
    return;
  }
  if (whisperActive) {
    if (recognition) recognition.stop();
    whisperActive = false;
    log('Whisper mode off', 'info');
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = currentLang === 'ar' ? 'ar-DZ' : currentLang === 'fr' ? 'fr-FR' : 'en-US';

  recognition.onresult = e => {
    for (let i = e.resultIndex; i < e.results.length; i++) {
      if (e.results[i].isFinal) {
        const text = e.results[i][0].transcript.trim();
        if (text) log('Voice: ' + text, 'rx');
      }
    }
  };
  recognition.onerror = e => log('Voice error: ' + e.error, 'error');
  recognition.onend = () => { if (whisperActive) recognition.start(); };
  recognition.start();
  whisperActive = true;
  log('Whisper mode on — speak!', 'success');
}

/* ═══════ GHOST USERS ═══════ */

const GHOST_KEY = 'wdiy-ghost-cursor';
let ghostCanvas, ghostCtx;
let myGhostId = Math.random().toString(36).slice(2, 8);

function initGhostUsers() {
  ghostCanvas = document.createElement('canvas');
  ghostCanvas.className = 'ghost-canvas';
  ghostCanvas.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;';
  document.body.appendChild(ghostCanvas);
  ghostCtx = ghostCanvas.getContext('2d');
  ghostCanvas.width = innerWidth;
  ghostCanvas.height = innerHeight;

  window.addEventListener('resize', () => {
    ghostCanvas.width = innerWidth;
    ghostCanvas.height = innerHeight;
  });

  document.addEventListener('mousemove', e => {
    try {
      localStorage.setItem(GHOST_KEY, JSON.stringify({
        id: myGhostId, x: e.clientX, y: e.clientY, ts: Date.now()
      }));
    } catch {}
  });

  const ghosts = {};
  window.addEventListener('storage', e => {
    if (e.key !== GHOST_KEY || !e.newValue) return;
    try {
      const d = JSON.parse(e.newValue);
      if (d.id === myGhostId) return;
      ghosts[d.id] = { x: d.x, y: d.y, ts: d.ts };
    } catch {}
  });

  function drawGhosts() {
    ghostCtx.clearRect(0, 0, ghostCanvas.width, ghostCanvas.height);
    const now = Date.now();
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
    for (const [id, g] of Object.entries(ghosts)) {
      if (now - g.ts > 3000) { delete ghosts[id]; continue; }
      const age = (now - g.ts) / 3000;
      ghostCtx.globalAlpha = 0.3 * (1 - age);
      ghostCtx.beginPath();
      ghostCtx.arc(g.x, g.y, 6, 0, Math.PI * 2);
      ghostCtx.fillStyle = accent;
      ghostCtx.fill();
      ghostCtx.beginPath();
      ghostCtx.arc(g.x, g.y, 3, 0, Math.PI * 2);
      ghostCtx.fillStyle = '#fff';
      ghostCtx.fill();
    }
    ghostCtx.globalAlpha = 1;
    requestAnimationFrame(drawGhosts);
  }
  requestAnimationFrame(drawGhosts);
}

/* ═══════ MUSICAL THEME SWITCHER ═══════ */

const THEME_MELODIES = {
  'mosque-gold': [330, 392, 523],
  'zellige':     [440, 523, 659],
  'andalus':     [294, 370, 440],
  'space':       [523, 659, 784],
  'jungle':      [262, 330, 392],
  'robot':       [440, 554, 659],
  'riad':        [349, 440, 523],
  'medina':      [294, 349, 440],
  'retro':       [523, 262, 523],
};

function playThemeMelody(themeName) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[themeName];
  if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.06;
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15);
    osc.start(t + i * 0.15);
    osc.stop(t + i * 0.15 + 0.2);
  });
}

/* ═══════ BREATHING GUIDE + DHIKR ═══════ */

let breathingActive = false;
let dhikrCount = 0;

function toggleBreathing() {
  const bands = document.querySelectorAll('.deco-band');
  breathingActive = !breathingActive;
  if (breathingActive) {
    bands.forEach(b => b.classList.add('breathing'));
    log('Breathing guide on — inhale... exhale...', 'info');
  } else {
    bands.forEach(b => b.classList.remove('breathing'));
    if (dhikrCount > 0) log('Dhikr count: ' + dhikrCount, 'success');
    dhikrCount = 0;
    log('Breathing guide off', 'info');
  }
}

function incrementDhikr() {
  if (!breathingActive) return;
  dhikrCount++;
  playSound('click');
  const counter = $('dhikrCounter');
  if (counter) counter.textContent = dhikrCount;
}

/* ═══════ PIXEL PET ═══════ */

const PET_STATES = {
  idle:  { class: 'pet-idle', duration: 0 },
  happy: { class: 'pet-happy', duration: 3000 },
  sad:   { class: 'pet-sad', duration: 3000 },
  sleep: { class: 'pet-sleep', duration: 0 },
};

let petState = 'idle';
let petIdleTimer = null;

function initPixelPet() {
  const pet = document.createElement('div');
  pet.id = 'pixelPet';
  pet.className = 'pixel-pet pet-idle';
  pet.title = 'Click me!';
  pet.innerHTML = FOOTER_ICON ? '<img src="' + FOOTER_ICON + '" alt="Bot" />' : '<span style="font-size:20px">🤖</span>';
  pet.addEventListener('click', () => {
    setPetState('happy');
    playSound('success');
  });
  const footer = document.querySelector('.app-footer');
  if (footer) footer.insertBefore(pet, footer.firstChild);
}

function setPetState(state) {
  petState = state;
  const pet = $('pixelPet');
  if (!pet) return;
  pet.classList.remove('pet-idle', 'pet-happy', 'pet-sad', 'pet-sleep');
  pet.classList.add(PET_STATES[state].class);
  if (petIdleTimer) clearTimeout(petIdleTimer);
  const dur = PET_STATES[state].duration;
  if (dur > 0) {
    petIdleTimer = setTimeout(() => setPetState('idle'), dur);
  }
}

let petSleepTimer = null;
function resetPetSleep() {
  if (petSleepTimer) clearTimeout(petSleepTimer);
  if (petState === 'sleep') setPetState('idle');
  petSleepTimer = setTimeout(() => setPetState('sleep'), 60000);
}

/* ═══════ NIGHT MODE ═══════ */

function initNightMode() {
  const hour = new Date().getHours();
  const isNight = hour >= 21 || hour < 6;
  if (isNight) {
    try {
      const manual = localStorage.getItem('wdiy-theme');
      if (!manual) {
        setTheme('mosque-gold');
        log('Night mode — time to rest', 'info');
      }
    } catch {}
  }

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(pos => {
      const sunset = calcSunset(pos.coords.latitude, pos.coords.longitude);
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();
      if (nowMins >= sunset || nowMins < 360) {
        try {
          const manual = localStorage.getItem('wdiy-theme');
          if (!manual) {
            setTheme('mosque-gold');
            log('Night detected — sweet dreams', 'info');
          }
        } catch {}
      }
    }, () => {}, { timeout: 3000 });
  }
}

function calcSunset(lat, lng) {
  const d = new Date();
  const N = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  const radLat = lat * Math.PI / 180;
  const decl = -23.45 * Math.cos(2 * Math.PI / 365 * (N + 10)) * Math.PI / 180;
  const ha = Math.acos(-Math.tan(radLat) * Math.tan(decl)) * 180 / Math.PI;
  const sunset = 720 + (ha * 4) - (lng * 4) + (d.getTimezoneOffset());
  return Math.round(sunset);
}

/* ═══════ LOGO FOLLOWS CURSOR ═══════ */

function initLogoTracker() {
  const logo = $('logoWrap');
  if (!logo) return;

  document.addEventListener('mousemove', e => {
    const rect = logo.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (innerWidth / 2);
    const dy = (e.clientY - cy) / (innerHeight / 2);
    const tiltX = dy * 8;
    const tiltY = -dx * 8;
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), 1);
    const shift = dist * 4;
    logo.style.transform = 'perspective(200px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateX(' + (dx * shift) + 'px) translateY(' + (dy * shift) + 'px)';
  });

  logo.addEventListener('mousedown', () => {
    logo.style.transition = 'transform .1s';
    logo.style.transform += ' scale(1.15)';
    setTimeout(() => { logo.style.transition = ''; }, 150);
  });
  logo.addEventListener('mouseup', () => {
    logo.style.transition = 'transform .2s';
    setTimeout(() => { logo.style.transition = ''; }, 200);
  });
  document.addEventListener('mouseleave', () => {
    logo.style.transition = 'transform .5s ease-out';
    logo.style.transform = '';
    setTimeout(() => { logo.style.transition = ''; }, 500);
  });
}

/* ═══════ MUSIC REACTIVE ═══════ */

let musicAnalyser = null;
let musicActive = false;
let musicAnim = null;

function toggleMusicMode() {
  if (musicActive) {
    musicActive = false;
    if (musicAnim) cancelAnimationFrame(musicAnim);
    document.querySelectorAll('.deco-band').forEach(b => {
      b.style.height = ''; b.style.opacity = ''; b.style.background = '';
    });
    document.querySelectorAll('.card').forEach(c => c.style.transform = '');
    log('Music mode off', 'info');
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    if (!audioCtx) audioCtx = new AudioCtx();
    const source = audioCtx.createMediaStreamSource(stream);
    musicAnalyser = audioCtx.createAnalyser();
    musicAnalyser.fftSize = 256;
    source.connect(musicAnalyser);

    musicActive = true;
    log('Music mode on — play some music!', 'success');

    const data = new Uint8Array(musicAnalyser.frequencyBinCount);
    const bands = document.querySelectorAll('.deco-band');
    const cards = document.querySelectorAll('.card');
    const root = document.documentElement;

    function visualize() {
      if (!musicActive) return;
      musicAnalyser.getByteFrequencyData(data);
      const bass = data.slice(0, 10).reduce((a, b) => a + b, 0) / 10 / 255;
      const mid = data.slice(10, 50).reduce((a, b) => a + b, 0) / 40 / 255;
      const treble = data.slice(50, 128).reduce((a, b) => a + b, 0) / 78 / 255;
      bands.forEach((b, i) => {
        const v = i === 0 ? bass : treble;
        b.style.height = (2 + v * 10) + 'px';
        b.style.opacity = 0.4 + v * 0.6;
      });
      cards.forEach(c => {
        c.style.transform = 'scale(' + (1 + bass * 0.015) + ')';
        c.style.transition = 'transform 0.05s';
      });
      const hue = Math.round(mid * 60);
      root.style.filter = 'hue-rotate(' + hue + 'deg)';
      musicAnim = requestAnimationFrame(visualize);
    }
    visualize();
  }).catch(() => {
    log('Microphone access denied', 'error');
  });
}

/* ═══════ AR MODE ═══════ */

function initAR() {
  if (!navigator.xr) return;
  navigator.xr.isSessionSupported('immersive-ar').then(supported => {
    if (!supported) return;
    const btns = document.querySelector('.header-buttons');
    if (!btns) return;
    const arBtn = document.createElement('button');
    arBtn.className = 'btn-icon-only';
    arBtn.setAttribute('aria-label', 'AR Mode');
    arBtn.textContent = 'AR';
    arBtn.onclick = startAR;
    btns.appendChild(arBtn);
    log('AR mode available!', 'info');
  }).catch(() => {});
}

async function startAR() {
  try {
    const session = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['hit-test'],
      optionalFeatures: ['dom-overlay'],
      domOverlay: { root: document.querySelector('.app') }
    });
    log('AR session started!', 'success');
    session.addEventListener('end', () => { log('AR session ended', 'info'); });
  } catch (e) {
    log('AR failed: ' + e.message, 'error');
  }
}

/* ═══════ AI CHAT ═══════ */

let chatHistory = [];

async function aiRespond(userMsg) {
  chatHistory.push({ role: 'user', content: userMsg });
  log('You: ' + userMsg, 'tx');
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 150,
        system: 'You are the Workshop-DIY robot assistant. Be geeky, funny, and helpful. Keep responses SHORT. Current language: ' + currentLang + '. Current theme: ' + document.documentElement.dataset.theme,
        messages: chatHistory.slice(-10)
      })
    });
    const data = await resp.json();
    const reply = data.content?.[0]?.text || '...';
    chatHistory.push({ role: 'assistant', content: reply });
    log('Bot: ' + reply, 'rx');
    playSound('success');
    setPetState('happy');
  } catch (e) {
    log('Bot offline — check connection', 'error');
    setPetState('sad');
  }
}

function initAIChat() {
  const logFooter = document.querySelector('#logPanel .sidebar-footer');
  if (!logFooter) return;
  const chatRow = document.createElement('div');
  chatRow.className = 'chat-input-row';
  chatRow.innerHTML = '<input type="text" id="chatInput" class="chat-input" placeholder="Talk to the robot..." /><button id="chatSendBtn" class="btn-sm primary"><span class="btn-icon">🤖</span></button>';
  logFooter.parentElement.insertBefore(chatRow, logFooter);
  const input = $('chatInput');
  const sendBtn = $('chatSendBtn');
  const send = () => {
    const msg = input.value.trim();
    if (!msg) return;
    input.value = '';
    aiRespond(msg);
  };
  if (sendBtn) sendBtn.onclick = send;
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
}

/* ═══════ LOG RESIZE ═══════ */

function initLogResize() {
  const handle = $('logResizeHandle');
  const panel = $('logPanel');
  if (!handle || !panel) return;

  let dragging = false;
  let startX, startW;
  const isRtl = () => document.documentElement.dir === 'rtl';

  handle.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX;
    startW = panel.offsetWidth;
    handle.classList.add('active');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX);
    const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
    document.documentElement.style.setProperty('--log-width', newW + 'px');
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('active');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    try {
      const w = getComputedStyle(document.documentElement).getPropertyValue('--log-width');
      localStorage.setItem('wdiy-log-width', w);
    } catch {}
  });

  handle.addEventListener('touchstart', e => {
    dragging = true;
    startX = e.touches[0].clientX;
    startW = panel.offsetWidth;
    handle.classList.add('active');
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', e => {
    if (!dragging) return;
    const dx = isRtl() ? (e.touches[0].clientX - startX) : (startX - e.touches[0].clientX);
    const newW = Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6));
    document.documentElement.style.setProperty('--log-width', newW + 'px');
  }, { passive: true });

  document.addEventListener('touchend', () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove('active');
    try {
      const w = getComputedStyle(document.documentElement).getPropertyValue('--log-width');
      localStorage.setItem('wdiy-log-width', w);
    } catch {}
  });

  try {
    const saved = localStorage.getItem('wdiy-log-width');
    if (saved) document.documentElement.style.setProperty('--log-width', saved);
  } catch {}
}

/* ═══════ PANELS ═══════ */

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function openPanel(panelId, overlayId) {
  const sb = $(panelId), ov = $(overlayId);
  if (sb) sb.classList.add('open');
  if (ov) ov.classList.add('open');
  if (sb) {
    const first = sb.querySelector(FOCUSABLE);
    if (first) first.focus();
  }
}

function closePanel(panelId, overlayId, returnFocusId) {
  const sb = $(panelId), ov = $(overlayId);
  if (sb) sb.classList.remove('open');
  if (ov) ov.classList.remove('open');
  const btn = $(returnFocusId);
  if (btn) btn.focus();
}

function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }

let logWasOpen = false;
function openSettings() {
  const logEl = $('logPanel');
  logWasOpen = logEl && logEl.classList.contains('open');
  if (logWasOpen) closeLog();
  openPanel('settingsPanel', 'settingsOverlay');
}
function closeSettings() {
  closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn');
  if (logWasOpen) { openLog(); logWasOpen = false; }
}
function openLog() {
  const sb = $('logPanel');
  if (sb) sb.classList.add('open');
  document.body.classList.add('log-open');
}
function closeLog() {
  const sb = $('logPanel');
  if (sb) sb.classList.remove('open');
  document.body.classList.remove('log-open');
  const btn = $('logBtn');
  if (btn) btn.focus();
}
function toggleLog() {
  const sb = $('logPanel');
  if (sb && sb.classList.contains('open')) closeLog();
  else openLog();
}
function closeAllPanels() {
  closeHelp(); closeSettings(); closeLog();
}

function initHelpTabs() {
  const tabs = document.querySelectorAll('.help-tab');
  const contents = document.querySelectorAll('.help-content');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.dataset.tab;
      const targetId = 'help' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
      const target = $(targetId);
      if (target) target.classList.add('active');
    });
  });
}

function trapFocus(e) {
  for (const id of ['helpPanel', 'settingsPanel', 'logPanel']) {
    const sb = $(id);
    if (!sb || !sb.classList.contains('open')) continue;
    const focusable = sb.querySelectorAll(FOCUSABLE);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
    return;
  }
}

/* ═══════ FIRMWARE FLASHER SIMULATION ═══════ */

let fwRunning = false;
let fwAnimFrame = null;
let fwTime = 0;
let fwProgress = 0;

const hexData = [];
for (let i = 0; i < 512; i++) hexData.push(Math.floor(Math.random() * 256));

const FW_SIZES = { router: 4096, iot: 1024, usb: 512, bios: 16384 };
const FW_ARCH = { router: 'MIPS', iot: 'ARM Cortex-M', usb: 'AVR', bios: 'x86_64' };

/* ═══════ CANVAS: Firmware Flash ═══════ */

function drawFirmwareCanvas() {
  if (!fwRunning) return;
  fwTime += 0.02;

  const c = $('fwCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const w = c.width, h = c.height;
  const device = $('deviceSelect').value;
  const payload = $('payloadSelect').value;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Background fade
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.fillRect(0, 0, w, h);

  // Progress
  fwProgress = Math.min(100, fwProgress + 0.25 + Math.random() * 0.15);
  $('fwProgressLabel').textContent = 'Progress: ' + Math.floor(fwProgress) + '%';

  // Hex dump visualization (left side)
  ctx.font = '10px monospace';
  const cols = 24;
  const rows = Math.floor(h / 14);
  for (let r = 0; r < rows; r++) {
    const addr = (Math.floor(fwTime * 50) + r * cols) & 0xFFFF;
    ctx.fillStyle = 'rgba(100,200,255,0.3)';
    ctx.fillText(addr.toString(16).padStart(4, '0') + ':', 5, 14 + r * 14);

    for (let col = 0; col < cols && col < 20; col++) {
      const idx = (r * cols + col + Math.floor(fwTime * 20)) % 512;
      const val = hexData[idx];
      const isPayload = fwProgress > 0 && r * cols + col < fwProgress * 2.56;
      const isMod = isPayload && col % 8 < 2;

      if (isMod) {
        ctx.fillStyle = 'rgba(255,50,50,0.8)';
        hexData[idx] = (hexData[idx] + 1) & 0xFF;
      } else if (isPayload) {
        ctx.fillStyle = 'rgba(255,200,50,0.5)';
      } else {
        ctx.fillStyle = 'rgba(100,200,255,0.2)';
      }
      ctx.fillText(val.toString(16).padStart(2, '0'), 50 + col * 24, 14 + r * 14);
    }
  }

  // Device chip visualization (right side)
  const chipX = w - 180, chipY = 30;
  const chipW = 150, chipH = 120;

  // Chip body
  ctx.strokeStyle = 'rgba(100,200,255,0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(chipX, chipY, chipW, chipH);

  // Chip pins
  for (let i = 0; i < 10; i++) {
    const pinAlpha = 0.3 + 0.2 * Math.sin(fwTime * 5 + i);
    ctx.fillStyle = 'rgba(200,200,200,' + pinAlpha + ')';
    ctx.fillRect(chipX - 12, chipY + 8 + i * 11, 12, 4);
    ctx.fillRect(chipX + chipW, chipY + 8 + i * 11, 12, 4);
  }

  // Chip label
  ctx.fillStyle = accent;
  ctx.font = '11px Orbitron';
  ctx.fillText(device.toUpperCase(), chipX + 10, chipY + 30);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '9px Orbitron';
  ctx.fillText(FW_ARCH[device], chipX + 10, chipY + 45);
  ctx.fillText(FW_SIZES[device] + ' KB', chipX + 10, chipY + 60);

  // Activity LEDs
  ctx.fillStyle = 'rgba(255,50,50,' + (0.3 + 0.5 * Math.abs(Math.sin(fwTime * 10))) + ')';
  ctx.beginPath(); ctx.arc(chipX + chipW - 20, chipY + 15, 5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = 'rgba(50,255,50,' + (0.3 + 0.5 * Math.abs(Math.sin(fwTime * 8 + 1))) + ')';
  ctx.beginPath(); ctx.arc(chipX + chipW - 20, chipY + 35, 5, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = 'rgba(50,150,255,' + (0.3 + 0.5 * Math.abs(Math.sin(fwTime * 6 + 2))) + ')';
  ctx.beginPath(); ctx.arc(chipX + chipW - 20, chipY + 55, 5, 0, Math.PI * 2); ctx.fill();

  // Data transfer animation between hex and chip
  const numPackets = 8;
  for (let i = 0; i < numPackets; i++) {
    const phase = (fwTime * 2 + i * 0.8) % 4;
    if (phase < 2) {
      const t = phase / 2;
      const px = 50 + 20 * 24 + t * (chipX - 50 - 20 * 24);
      const py = h / 2 + Math.sin(t * Math.PI * 4 + i) * 30;
      const alpha = 1 - Math.abs(t - 0.5) * 2;
      ctx.fillStyle = 'rgba(255,200,50,' + (alpha * 0.8) + ')';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Flash progress bar
  const barY = h - 40, barH = 20;
  ctx.fillStyle = 'rgba(50,50,50,0.5)';
  ctx.fillRect(10, barY, w - 20, barH);

  const barColor = fwProgress < 50 ? 'rgba(100,200,255,0.6)' :
                   fwProgress < 90 ? 'rgba(255,200,50,0.6)' : 'rgba(255,50,50,0.6)';
  ctx.fillStyle = barColor;
  ctx.fillRect(10, barY, (w - 20) * fwProgress / 100, barH);

  ctx.fillStyle = '#fff';
  ctx.font = '11px Orbitron';
  ctx.fillText('FLASHING: ' + Math.floor(fwProgress) + '% — ' + payload.toUpperCase(), w / 2 - 100, barY + 15);

  // Vulnerability scan markers
  if (fwProgress > 20 && Math.random() < 0.02) {
    const vulnY = 20 + Math.random() * (h - 80);
    const vulnX = 50 + Math.random() * 400;
    ctx.strokeStyle = 'rgba(255,50,50,0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(vulnX - 15, vulnY - 8, 80, 16);
    ctx.fillStyle = 'rgba(255,50,50,0.4)';
    ctx.font = '8px monospace';
    ctx.fillText('VULN', vulnX - 10, vulnY + 4);
  }

  // Footer label
  ctx.fillStyle = accent;
  ctx.font = '10px Orbitron,monospace';
  ctx.fillText('EVIL FIRMWARE FLASHER — ' + device.toUpperCase() + ' [' + payload + ']', 8, h - 8);

  // Update stats
  const fwSize = FW_SIZES[device];
  $('fwSizeVal').textContent = fwSize + ' KB';
  $('fwChecksumVal').textContent = 'Checksum: 0x' + hexData.slice(0, 4).map(v => v.toString(16).padStart(2, '0')).join('');
  $('fwVulnVal').textContent = 'Vulns: ' + Math.floor(fwProgress / 20) + ' found';
  $('fwModVal').textContent = 'Mod: ' + Math.floor(fwProgress) + '%';
  $('deviceInfoVal').textContent = device.toUpperCase() + ' / ' + FW_ARCH[device];

  // Log periodic events
  if (Math.floor(fwProgress) % 25 === 0 && Math.floor(fwProgress) > 0 && Math.random() < 0.01) {
    const s = LANG[currentLang];
    if (fwProgress < 50) log(s.scanningFw, 'info');
    else if (fwProgress < 75) log(s.vulnFound, 'tx');
    else log(s.payloadInjected, 'tx');
  }

  // Completion
  if (fwProgress >= 100) {
    const s = LANG[currentLang];
    log(s.flashComplete + ' — ' + payload + ' injected into ' + device, 'success');
    log(s.checksumBypass, 'tx');
    fwProgress = 0;
    stopFirmware();
    return;
  }

  fwAnimFrame = requestAnimationFrame(drawFirmwareCanvas);
}

/* ═══════ CANVAS: Hex Dump Detail ═══════ */

function drawHexCanvas() {
  const c = $('hexCanvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  const w = c.width, h = c.height;

  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  ctx.font = '9px monospace';
  const cols = 32;
  const rows = Math.floor(h / 12);

  for (let r = 0; r < rows; r++) {
    const addr = (r * cols) & 0xFFFF;
    ctx.fillStyle = 'rgba(0,255,120,0.3)';
    ctx.fillText(addr.toString(16).padStart(4, '0') + ':', 5, 10 + r * 12);

    for (let col = 0; col < cols && col < 28; col++) {
      const idx = (r * cols + col) % 512;
      const val = hexData[idx];
      const brightness = val / 255;
      ctx.fillStyle = 'rgba(' + Math.floor(brightness * 255) + ',' + Math.floor((1 - brightness) * 200) + ',100,' + (0.3 + brightness * 0.5) + ')';
      ctx.fillText(val.toString(16).padStart(2, '0'), 42 + col * 20, 10 + r * 12);
    }

    // ASCII representation
    let asciiStr = '';
    for (let col = 0; col < 16; col++) {
      const idx = (r * cols + col) % 512;
      const ch = hexData[idx];
      asciiStr += (ch >= 32 && ch < 127) ? String.fromCharCode(ch) : '.';
    }
    ctx.fillStyle = 'rgba(200,200,200,0.25)';
    ctx.fillText(asciiStr, w - 130, 10 + r * 12);
  }

  // Update hex log
  const hexLogEl = $('hexLog');
  if (hexLogEl && fwRunning) {
    const offset = Math.floor(fwTime * 10) % 512;
    const line = hexData.slice(offset, offset + 16).map(v => v.toString(16).padStart(2, '0')).join(' ');
    const entry = document.createElement('div');
    entry.textContent = '0x' + offset.toString(16).padStart(4, '0') + ': ' + line;
    hexLogEl.appendChild(entry);
    if (hexLogEl.children.length > 50) hexLogEl.removeChild(hexLogEl.firstChild);
    hexLogEl.scrollTop = hexLogEl.scrollHeight;
  }
}

/* ═══════ FIRMWARE CONTROL ═══════ */

function startFirmware() {
  if (fwRunning) return;
  fwRunning = true;
  fwProgress = 0;
  fwTime = 0;
  setStatus(true);
  const s = LANG[currentLang];
  log(s.flashStarted, 'success');
  log('Target: ' + $('deviceSelect').value + ' | Payload: ' + $('payloadSelect').value, 'info');
  showToast(s.flashStarted, 2000);

  function frame() {
    if (!fwRunning) return;
    drawFirmwareCanvas();
    drawHexCanvas();
  }
  frame();
}

function stopFirmware() {
  fwRunning = false;
  if (fwAnimFrame) cancelAnimationFrame(fwAnimFrame);
  setStatus(false);
  log(LANG[currentLang].flashAborted, 'info');
  hideToast();
}

function resetFirmware() {
  stopFirmware();
  fwProgress = 0;
  fwTime = 0;
  $('fwProgressLabel').textContent = 'Progress: 0%';
  $('deviceSelect').value = 'router';
  $('payloadSelect').value = 'backdoor';
  $('fwSizeVal').textContent = '-- KB';
  $('fwChecksumVal').textContent = 'Checksum: --';
  $('fwVulnVal').textContent = 'Vulns: --';
  $('fwModVal').textContent = 'Mod: --';
  $('deviceInfoVal').textContent = 'Select target';

  // Clear canvases
  const fwC = $('fwCanvas');
  if (fwC) fwC.getContext('2d').clearRect(0, 0, fwC.width, fwC.height);
  const hexC = $('hexCanvas');
  if (hexC) hexC.getContext('2d').clearRect(0, 0, hexC.width, hexC.height);
  const hexLog = $('hexLog');
  if (hexLog) hexLog.innerHTML = 'Firmware hex dump will appear here...';

  // Reset hex data
  for (let i = 0; i < 512; i++) hexData[i] = Math.floor(Math.random() * 256);

  log(LANG[currentLang].flashReset, 'info');
}

/* ═══════ INIT ═══════ */

function init() {
  // Splash
  initSplash();

  // Inject logo
  const lw = $('logoWrap');
  if (lw) lw.innerHTML = LOGO_SVG;

  // Log buttons
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog;
  if (cpb) cpb.onclick = copyLog;
  if (exb) exb.onclick = exportLog;
  initLogFilters();

  // Help panel
  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp;
  if (hClose) hClose.onclick = closeHelp;
  if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();

  // Settings panel
  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings;
  if (sClose) sClose.onclick = closeSettings;
  if (sOv) sOv.onclick = closeSettings;

  // Log panel
  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog;
  if (lClose) lClose.onclick = closeLog;
  initLogResize();

  // Sound toggle
  const soundTgl = $('soundToggle');
  if (soundTgl) {
    try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {}
    soundTgl.checked = soundEnabled;
    soundTgl.addEventListener('change', () => {
      soundEnabled = soundTgl.checked;
      try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {}
      if (soundEnabled) playSound('click');
    });
  }

  // Whisper mode
  const whisperBtn = $('whisperBtn');
  if (whisperBtn) whisperBtn.onclick = toggleWhisper;

  // Breathing guide + dhikr
  const breathBtn = $('breathingBtn');
  const dhikrDisp = $('dhikrDisplay');
  const dhikrBtn = $('dhikrBtn');
  if (breathBtn) breathBtn.onclick = () => {
    toggleBreathing();
    if (dhikrDisp) dhikrDisp.style.display = breathingActive ? 'flex' : 'none';
  };
  if (dhikrBtn) dhikrBtn.onclick = incrementDhikr;

  // Music mode
  const musicBtn = $('musicBtn');
  if (musicBtn) musicBtn.onclick = toggleMusicMode;

  // Escape key + focus trap
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllPanels();
    if (e.key === 'Tab') trapFocus(e);
  });

  // Language dropdown
  const langSel = $('langSelect');
  if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));

  // Theme dropdown
  const themeSel = $('themeSelect');
  if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));

  // Restore saved preferences
  try {
    const savedLang = localStorage.getItem('wdiy-lang');
    const savedTheme = localStorage.getItem('wdiy-theme');
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLanguage(savedLang);
  } catch {}

  // Version check
  checkVersion();

  // App messaging
  onAppMessage(msg => { log('MSG: ' + msg.from + ': ' + msg.type, 'rx'); });

  // Geeky features
  initKonami();
  initMorseLog();
  initMatrixTrigger();
  initDebug();
  initShakeReport();
  initTimeTravel();
  initHijriDate();

  // Magic features
  initGhostUsers();
  initPixelPet();
  initNightMode();
  initLogoTracker();
  initAR();
  initAIChat();

  // Firmware simulation buttons
  const startBtn = $('startBtn');
  const stopBtn = $('stopBtn');
  const resetBtnEl = $('resetBtn');
  if (startBtn) startBtn.onclick = startFirmware;
  if (stopBtn) stopBtn.onclick = stopFirmware;
  if (resetBtnEl) resetBtnEl.onclick = resetFirmware;

  // Initial draw of hex canvas
  drawHexCanvas();

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();
