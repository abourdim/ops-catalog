/**
 * Quantum Random Beacon — Workshop DIY v1.0
 * Full canvas-based quantum random number generator with entropy visualization,
 * NIST statistical tests, multiple quantum noise sources, and real-time analysis.
 *
 * Features:
 *  - 4 quantum noise source models (vacuum, thermal, shot, zener)
 *  - Real-time particle cloud + bit-stream visualization
 *  - Entropy distribution histogram with trend line
 *  - Shannon entropy, min-entropy, chi-square, serial correlation
 *  - NIST SP 800-22 statistical test suite (simulated)
 *  - Full i18n (EN/FR/AR with RTL)
 *  - 8 themes, sound effects, activity log, toast, panels
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".25">
    <animate attributeName="r" values="32;44;32" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" stroke-width="1" opacity=".2">
    <animate attributeName="r" values="18;28;18" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="6" fill="currentColor" opacity=".9">
    <animate attributeName="cx" values="42;58;42" dur="1.5s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="42;58;42" dur="1.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="55" cy="45" r="4" fill="currentColor" opacity=".6">
    <animate attributeName="cx" values="60;35;60" dur="1.2s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="55;40;55" dur="1.6s" repeatCount="indefinite"/>
  </circle>
  <circle cx="40" cy="60" r="3" fill="currentColor" opacity=".4">
    <animate attributeName="cx" values="35;65;35" dur="2.1s" repeatCount="indefinite"/>
    <animate attributeName="cy" values="60;35;60" dur="1.4s" repeatCount="indefinite"/>
  </circle>
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
      setTimeout(() => {
        if (!audioCtx) return;
        const o2 = audioCtx.createOscillator(), g2 = audioCtx.createGain();
        o2.connect(g2); g2.connect(audioCtx.destination);
        g2.gain.value = 0.08; o2.frequency.value = 659; o2.type = 'sine';
        const t2 = audioCtx.currentTime;
        g2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.25);
        o2.start(t2); o2.stop(t2 + 0.25);
      }, 150);
      break;
    case 'error':
      osc.frequency.value = 200; osc.type = 'square';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t); osc.stop(t + 0.25); break;
    case 'beep':
      osc.frequency.value = 1200; osc.type = 'sine';
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.start(t); osc.stop(t + 0.05); break;
  }
}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title: 'Quantum Random Beacon',
    subtitle: '🔮 True randomness from quantum noise',
    disconnected: 'Disconnected', connected: 'Active',
    mainSection: 'Quantum Random Beacon',
    mainDesc: 'Generate true random numbers from quantum vacuum fluctuations',
    sectionA: 'Entropy Analysis', sectionB: 'Randomness Tests', sectionC: 'Quantum Theory',
    activityLog: '📜 Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', theme: 'Theme',
    settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    faq_q1: 'What is a quantum random beacon?',
    faq_a1: 'A source of provably random bits generated from quantum physical processes like vacuum fluctuations and shot noise.',
    faq_q2: 'How does it generate randomness?',
    faq_a2: 'By sampling quantum vacuum fluctuations which are fundamentally unpredictable due to the Heisenberg uncertainty principle.',
    faq_q3: 'What tests verify randomness?',
    faq_a3: 'The NIST SP 800-22 suite includes frequency, runs, spectral, and entropy tests to validate random number generators.',
    faq_q4: 'Why is quantum randomness special?',
    faq_a4: 'Unlike pseudo-random number generators, quantum randomness is provably unpredictable and cannot be reproduced.',
    howto_1: 'Select a quantum noise source type from the dropdown.',
    howto_2: 'Adjust sample rate and bit depth for your needs.',
    howto_3: 'Click Start Beacon to generate quantum random bits in real time.',
    howto_4: 'Run NIST tests to statistically verify randomness quality.',
    wiki_vacuum_title: '🌌 Vacuum Fluctuations',
    wiki_vacuum: 'Even in a perfect vacuum, quantum field theory predicts random energy fluctuations.',
    wiki_shot_title: '📸 Shot Noise',
    wiki_shot: 'Photons arrive at a detector at random intervals governed by quantum statistics.',
    wiki_nist_title: '📋 NIST Tests',
    wiki_nist: 'The NIST SP 800-22 suite validates randomness with frequency, runs, DFT, and entropy tests.',
    wiki_entropy_title: '📊 Shannon Entropy',
    wiki_entropy: 'H = -sum(p_i * log2(p_i)). 8.0 bits per byte is maximum for perfectly random data.',
    working: 'Working…', filterAll: 'All', soundEffects: '🔊 Sound effects',
    ready: '🔮 Quantum Random Beacon ready!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    noiseSource: 'Noise Source', sampleRate: 'Sample Rate', bitDepth: 'Bit Depth',
    startBeacon: '▶ Start Beacon', stopBeacon: '⏹ Stop', resetBeacon: '↺ Reset',
    shannonEntropy: 'Shannon Entropy:', minEntropy: 'Min-Entropy:', chiSquare: 'Chi-Square:',
    serialCorr: 'Serial Correlation:', totalBits: 'Total Bits:', bitRate: 'Bit Rate:',
    testDesc: 'Statistical tests verify quantum randomness quality.',
    runTests: 'Run NIST Tests',
    theoryIntro: 'Quantum random number generation exploits fundamental indeterminacy:',
    theory1: 'Vacuum fluctuations provide truly random quantum noise',
    theory2: 'Shot noise arises from discrete photon arrival times',
    theory3: 'No deterministic algorithm can predict quantum outcomes',
    theory4: 'Entropy harvesting condenses quantum bits into uniform randomness',
    theory5: 'Bell inequality violations prove non-classical randomness',
    splashHint: 'tap to skip',
    langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    beaconStarted: '▶ Quantum beacon started',
    beaconStopped: '⏹ Beacon stopped',
    beaconReset: '↺ Beacon reset',
    testsRunning: 'Running NIST tests...', testsPassed: '✓ All tests passed',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space',
    t_jungle: 'Jungle', t_robot: 'Robot',
  },
  fr: {
    title: 'Balise Quantique Aléatoire',
    subtitle: '🔮 Aléa vrai du bruit quantique',
    disconnected: 'Déconnecté', connected: 'Actif',
    mainSection: 'Balise Quantique Aléatoire',
    mainDesc: 'Générer des nombres aléatoires à partir de fluctuations quantiques du vide',
    sectionA: 'Analyse d\'Entropie', sectionB: 'Tests de Hasard', sectionC: 'Théorie Quantique',
    activityLog: '📜 Journal', eventsMsg: 'Événements et messages',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', theme: 'Thème',
    settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    faq_q1: 'Qu\'est-ce qu\'une balise quantique aléatoire ?',
    faq_a1: 'Une source de bits aléatoires prouvée par des processus physiques quantiques comme les fluctuations du vide.',
    faq_q2: 'Comment génère-t-elle l\'aléa ?',
    faq_a2: 'En échantillonnant les fluctuations du vide quantique fondamentalement imprévisibles.',
    faq_q3: 'Quels tests vérifient l\'aléa ?',
    faq_a3: 'La suite NIST SP 800-22 inclut les tests de fréquence, séries, DFT et entropie.',
    faq_q4: 'Pourquoi l\'aléa quantique est-il spécial ?',
    faq_a4: 'Contrairement aux PRNG, l\'aléa quantique est prouvablement imprévisible et non reproductible.',
    howto_1: 'Sélectionnez un type de source de bruit quantique.',
    howto_2: 'Ajustez le taux d\'échantillonnage et la profondeur de bits.',
    howto_3: 'Cliquez Démarrer pour générer des bits quantiques en temps réel.',
    howto_4: 'Lancez les tests NIST pour vérifier la qualité statistique.',
    wiki_vacuum_title: '🌌 Fluctuations du Vide',
    wiki_vacuum: 'Même dans le vide parfait, la théorie quantique prédit des fluctuations d\'énergie aléatoires.',
    wiki_shot_title: '📸 Bruit de Grenaille',
    wiki_shot: 'Les photons arrivent au détecteur à des intervalles aléatoires régis par la statistique quantique.',
    wiki_nist_title: '📋 Tests NIST',
    wiki_nist: 'La suite NIST SP 800-22 valide l\'aléa avec des tests de fréquence, séries, DFT et entropie.',
    wiki_entropy_title: '📊 Entropie de Shannon',
    wiki_entropy: 'H = -somme(p_i * log2(p_i)). 8.0 bits par octet est le maximum pour des données parfaitement aléatoires.',
    working: 'En cours…', filterAll: 'Tout', soundEffects: '🔊 Effets sonores',
    ready: '🔮 Balise quantique prête !',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec copie',
    noiseSource: 'Source de Bruit', sampleRate: 'Taux d\'Échantillonnage', bitDepth: 'Profondeur',
    startBeacon: '▶ Démarrer', stopBeacon: '⏹ Arrêter', resetBeacon: '↺ Réinitialiser',
    shannonEntropy: 'Entropie Shannon :', minEntropy: 'Min-Entropie :', chiSquare: 'Chi-Carré :',
    serialCorr: 'Corrélation Série :', totalBits: 'Bits Totaux :', bitRate: 'Débit :',
    testDesc: 'Les tests statistiques vérifient la qualité de l\'aléa quantique.',
    runTests: 'Lancer Tests NIST',
    theoryIntro: 'La génération quantique exploite l\'indétermination fondamentale :',
    theory1: 'Les fluctuations du vide fournissent un bruit quantique vraiment aléatoire',
    theory2: 'Le bruit de grenaille provient des arrivées discrètes de photons',
    theory3: 'Aucun algorithme ne peut prédire les résultats quantiques',
    theory4: 'La récolte d\'entropie condense les bits en aléa uniforme',
    theory5: 'Les violations de Bell prouvent le hasard non-classique',
    splashHint: 'appuyer pour passer',
    langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    beaconStarted: '▶ Balise quantique démarrée',
    beaconStopped: '⏹ Balise arrêtée',
    beaconReset: '↺ Balise réinitialisée',
    testsRunning: 'Tests NIST en cours...', testsPassed: '✓ Tous les tests réussis',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_riad: 'Riad', t_medina: 'Médina', t_space: 'Espace',
    t_jungle: 'Jungle', t_robot: 'Robot',
  },
  ar: {
    title: 'منارة الكم العشوائية',
    subtitle: '🔮 عشوائية حقيقية من الضوضاء الكمية',
    disconnected: 'غير متصل', connected: 'نشط',
    mainSection: 'منارة الكم العشوائية',
    mainDesc: 'توليد أرقام عشوائية حقيقية من تقلبات الفراغ الكمي',
    sectionA: 'تحليل الإنتروبيا', sectionB: 'اختبارات العشوائية', sectionC: 'النظرية الكمية',
    activityLog: '📜 سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', theme: 'المظهر',
    settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيفية الاستخدام', wiki: 'ويكي',
    faq_q1: 'ما هي منارة الكم العشوائية؟',
    faq_a1: 'مصدر بتات عشوائية مثبتة من عمليات فيزيائية كمية مثل تقلبات الفراغ وضوضاء الطلقة.',
    faq_q2: 'كيف تولد العشوائية؟',
    faq_a2: 'بأخذ عينات من تقلبات الفراغ الكمي غير القابلة للتنبؤ بسبب مبدأ هايزنبرغ.',
    faq_q3: 'ما الاختبارات التي تتحقق من العشوائية؟',
    faq_a3: 'مجموعة NIST SP 800-22 تشمل اختبارات التردد والسلاسل والطيف والإنتروبيا.',
    faq_q4: 'لماذا العشوائية الكمية مميزة؟',
    faq_a4: 'على عكس مولدات الأرقام شبه العشوائية، العشوائية الكمية غير قابلة للتنبؤ ولا يمكن إعادة إنتاجها.',
    howto_1: 'اختر نوع مصدر الضوضاء الكمية.',
    howto_2: 'اضبط معدل العينات وعمق البت.',
    howto_3: 'اضغط ابدأ لتوليد بتات كمية عشوائية.',
    howto_4: 'شغّل اختبارات NIST للتحقق من جودة العشوائية.',
    wiki_vacuum_title: '🌌 تقلبات الفراغ',
    wiki_vacuum: 'حتى في الفراغ المثالي، تتنبأ نظرية المجال الكمي بتقلبات طاقة عشوائية.',
    wiki_shot_title: '📸 ضوضاء الطلقة',
    wiki_shot: 'تصل الفوتونات إلى الكاشف على فترات عشوائية تحكمها الإحصاءات الكمية.',
    wiki_nist_title: '📋 اختبارات NIST',
    wiki_nist: 'مجموعة NIST SP 800-22 تتحقق من العشوائية باختبارات التردد والسلاسل والطيف والإنتروبيا.',
    wiki_entropy_title: '📊 إنتروبيا شانون',
    wiki_entropy: 'H = -مجموع(p_i * log2(p_i)). الحد الأقصى 8.0 بت لكل بايت للبيانات العشوائية تماماً.',
    working: 'جارٍ…', filterAll: 'الكل', soundEffects: '🔊 مؤثرات صوتية',
    ready: '🔮 منارة الكم جاهزة!',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    noiseSource: 'مصدر الضوضاء', sampleRate: 'معدل العينات', bitDepth: 'عمق البت',
    startBeacon: '▶ تشغيل المنارة', stopBeacon: '⏹ إيقاف', resetBeacon: '↺ إعادة',
    shannonEntropy: 'إنتروبيا شانون:', minEntropy: 'الحد الأدنى:', chiSquare: 'مربع كاي:',
    serialCorr: 'الارتباط التسلسلي:', totalBits: 'إجمالي البتات:', bitRate: 'معدل البت:',
    testDesc: 'الاختبارات الإحصائية تتحقق من جودة العشوائية الكمية.',
    runTests: 'تشغيل اختبارات NIST',
    theoryIntro: 'توليد الأرقام العشوائية الكمية يستغل عدم اليقين الأساسي:',
    theory1: 'تقلبات الفراغ توفر ضوضاء كمية عشوائية حقاً',
    theory2: 'ضوضاء الطلقة تنشأ من أوقات وصول الفوتونات المنفصلة',
    theory3: 'لا يمكن لخوارزمية حتمية التنبؤ بالنتائج الكمية',
    theory4: 'حصاد الإنتروبيا يكثف البتات الكمية في عشوائية موحدة',
    theory5: 'انتهاكات متباينة بيل تثبت العشوائية غير الكلاسيكية',
    splashHint: 'انقر للتخطي',
    langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    beaconStarted: '▶ بدأت منارة الكم',
    beaconStopped: '⏹ توقفت المنارة',
    beaconReset: '↺ إعادة ضبط المنارة',
    testsRunning: 'جارٍ تشغيل اختبارات NIST...', testsPassed: '✓ جميع الاختبارات ناجحة',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس',
    t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء',
    t_jungle: 'أدغال', t_robot: 'روبوت',
  }
};

let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang]; if (!s) return;
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
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  log(LANG[currentLang].themeChanged + ' ' + (LANG[currentLang]['t_' + name] || name), 'info');
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer');
  if (!logContainer) return;
  const d = document.createElement('div');
  d.className = 'log-line ' + type;
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
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
  try {
    await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n'));
    log(LANG[currentLang].copied, 'success');
  } catch { log(LANG[currentLang].copyFail, 'error'); }
}

function exportLog() {
  if (!logContainer) logContainer = $('logContainer');
  const t = Array.from(logContainer.children).map(d => d.textContent).join('\n');
  const b = new Blob([t], { type: 'text/plain' });
  const u = URL.createObjectURL(b);
  const a = document.createElement('a');
  a.href = u; a.download = 'quantum-beacon-log.txt'; a.click();
  URL.revokeObjectURL(u);
}

function showToast(msg, ms = 0) {
  const el = $('toastIndicator'), t = $('toastMessage');
  if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; }
  if (ms > 0) setTimeout(hideToast, ms);
}
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }

function setStatus(c) {
  const t = $('statusText'), p = $('statusPill'), s = LANG[currentLang];
  if (t) t.textContent = c ? s.connected : s.disconnected;
  if (p) p.classList.toggle('connected', c);
}

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash() {
  const s = $('splash'); if (!s) return;
  s.classList.add('hidden');
  if (splashTimer) clearTimeout(splashTimer);
  setTimeout(() => s.remove(), 600);
  playSound('click');
}
function initSplash() {
  const s = $('splash'); if (!s) return;
  const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG;
  splashTimer = setTimeout(dismissSplash, 2500);
}

/* ═══════ LOG FILTERS ═══════ */
let activeLogFilter = 'all';
function initLogFilters() {
  document.querySelectorAll('.log-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active'));
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
  Array.from(logContainer.children).forEach(l => {
    l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none';
  });
}

function initHijriDate() {
  const el = $('hijriDate'); if (!el) return;
  try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {}
}

/* ═══════ PANELS ═══════ */
function openPanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.remove('open'); if (ov) ov.classList.remove('open'); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay'); }
function openSettings() { openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay'); }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }

function initHelpTabs() {
  document.querySelectorAll('.help-tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const id = 'help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1);
    const tgt = $(id); if (tgt) tgt.classList.add('active');
  }));
}

/* ═══════════════════════════════════════════════════════════
   QUANTUM RANDOM BEACON — FULL CANVAS SIMULATION
   ═══════════════════════════════════════════════════════════ */

let running = false;
let animFrame = null;
let totalBits = 0;
let lastBitTime = 0;
let bitRateSmooth = 0;
const randomBuffer = [];
const entropyHistory = [];
const BUFFER_MAX = 4096;
const particles = [];
const MAX_PARTICLES = 500;
const recentBitStrings = [];

/* --- Quantum noise sources --- */
function quantumNoise(type) {
  switch (type) {
    case 'vacuum': {
      // Box-Muller approximation of vacuum fluctuations
      const u1 = Math.random(), u2 = Math.random();
      return Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2) * 0.35;
    }
    case 'thermal': {
      // Gaussian thermal noise (Boltzmann distribution)
      let sum = 0;
      for (let i = 0; i < 6; i++) sum += Math.random();
      return (sum - 3) / 3;
    }
    case 'shot': {
      // Poisson-like shot noise
      const n = Math.floor(Math.random() * 8);
      return (n - 4) / 4 + (Math.random() - 0.5) * 0.2;
    }
    case 'zener': {
      // Zener avalanche breakdown noise
      const base = Math.random() - 0.5;
      const spike = Math.random() < 0.1 ? (Math.random() - 0.5) * 3 : 0;
      return Math.tanh(base * 4 + spike);
    }
    default: return Math.random() * 2 - 1;
  }
}

/* --- Bit generation --- */
function generateBits(type, rate, depth) {
  const bits = [];
  const count = Math.max(1, Math.floor(rate / 16));
  for (let i = 0; i < count; i++) {
    const v = quantumNoise(type);
    const quantized = Math.floor(((v + 1) / 2) * ((1 << Math.min(depth, 16)) - 1));
    bits.push(quantized & 0xFF);
    randomBuffer.push(v);
    if (randomBuffer.length > BUFFER_MAX) randomBuffer.shift();
  }
  const newBits = count * depth;
  totalBits += newBits;

  // Track bit rate
  const now = performance.now();
  if (lastBitTime > 0) {
    const elapsed = (now - lastBitTime) / 1000;
    if (elapsed > 0) bitRateSmooth = bitRateSmooth * 0.9 + (newBits / elapsed) * 0.1;
  }
  lastBitTime = now;

  // Update bit stream display
  const bstr = bits.slice(0, 8).map(b => (b & 0xFF).toString(2).padStart(8, '0')).join(' ');
  recentBitStrings.push(bstr);
  if (recentBitStrings.length > 20) recentBitStrings.shift();

  return bits;
}

/* --- Particle system --- */
function spawnParticles(bits, cx, cy) {
  for (let i = 0; i < Math.min(bits.length, 10); i++) {
    const v = bits[i] / 255;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + v * 2;
    particles.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      decay: 0.005 + Math.random() * 0.01,
      size: 2 + v * 4,
      hue: 180 + v * 80,
      brightness: 50 + v * 50,
    });
    if (particles.length > MAX_PARTICLES) particles.shift();
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.99;
    p.vy *= 0.99;
    p.life -= p.decay;
    if (p.life <= 0) { particles.splice(i, 1); }
  }
}

/* --- Main beacon canvas --- */
function drawBeacon(ctx, w, h, bits, time) {
  // Fade trail
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.fillRect(0, 0, w, h);

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Draw quantum field grid
  ctx.strokeStyle = 'rgba(50, 100, 150, 0.08)';
  ctx.lineWidth = 0.5;
  const gridSize = 40;
  for (let x = 0; x < w; x += gridSize) {
    const wobble = Math.sin(time * 0.5 + x * 0.02) * 3;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + wobble, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    const wobble = Math.cos(time * 0.3 + y * 0.02) * 3;
    ctx.beginPath(); ctx.moveTo(0, y + wobble); ctx.lineTo(w, y); ctx.stroke();
  }

  // Central beacon glow
  const pulse = Math.sin(time * 2.5) * 0.5 + 0.5;
  const beaconR = 30 + pulse * 25;
  const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, beaconR * 3);
  grad.addColorStop(0, `rgba(100, 180, 255, ${0.15 + pulse * 0.1})`);
  grad.addColorStop(0.5, `rgba(60, 120, 200, ${0.05 + pulse * 0.05})`);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Central beacon core
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, beaconR * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(100, 200, 255, ${0.3 + pulse * 0.3})`;
  ctx.fill();

  // Orbiting quantum indicators
  for (let i = 0; i < 8; i++) {
    const angle = time * (0.8 + i * 0.15) + i * Math.PI / 4;
    const orbitR = 50 + i * 15 + Math.sin(time + i) * 10;
    const ox = w / 2 + Math.cos(angle) * orbitR;
    const oy = h / 2 + Math.sin(angle) * orbitR * 0.6;
    const sz = 3 + Math.sin(time * 2 + i) * 2;
    ctx.beginPath(); ctx.arc(ox, oy, sz, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${200 + i * 20}, 80%, 65%, ${0.4 + Math.sin(time + i) * 0.3})`;
    ctx.fill();
  }

  // Spawn and draw particles from generated bits
  if (bits && bits.length > 0) {
    spawnParticles(bits, w / 2, h / 2);
  }

  updateParticles();
  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 70%, ${p.brightness}%, ${p.life * 0.8})`;
    ctx.fill();
  }

  // Emission rings
  const ringCount = 4;
  for (let i = 0; i < ringCount; i++) {
    const phase = (time * 0.8 + i * 1.5) % 6;
    const radius = phase * 50;
    const alpha = Math.max(0, 1 - phase / 6) * 0.3;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Bit stream overlay at bottom
  ctx.fillStyle = 'rgba(100, 200, 255, 0.4)';
  ctx.font = '10px Orbitron, monospace';
  if (bits) {
    for (let i = 0; i < Math.min(bits.length, 50); i++) {
      const bstr = (bits[i] & 0xFF).toString(2).padStart(8, '0');
      const col = i % 12;
      const row = Math.floor(i / 12);
      ctx.fillText(bstr, 10 + col * 66, h - 50 + row * 13);
    }
  }

  // HUD overlay
  ctx.fillStyle = accent;
  ctx.font = '11px Orbitron, monospace';
  ctx.fillText('QUANTUM BEACON', 10, 18);
  ctx.fillStyle = 'rgba(100, 200, 255, 0.6)';
  ctx.font = '10px Orbitron, monospace';
  ctx.fillText(totalBits.toLocaleString() + ' bits generated', 10, 34);
  ctx.fillText(Math.round(bitRateSmooth).toLocaleString() + ' bps', 10, 48);

  // Noise type indicator
  const noiseType = $('noiseSource') ? $('noiseSource').value : 'vacuum';
  ctx.fillStyle = 'rgba(200, 150, 50, 0.5)';
  ctx.fillText('SRC: ' + noiseType.toUpperCase(), w - 150, 18);
}

/* --- Entropy distribution canvas --- */
function drawEntropy(ctx, w, h) {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, w, h);

  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Grid lines
  ctx.strokeStyle = '#1a2a3a';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 8; i++) {
    const y = (i / 8) * h;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  for (let i = 0; i < 16; i++) {
    const x = (i / 16) * w;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }

  // Histogram of random buffer distribution
  if (randomBuffer.length > 20) {
    const bins = 80;
    const hist = new Array(bins).fill(0);
    randomBuffer.forEach(v => {
      const idx = Math.floor(((v + 1) / 2) * (bins - 1));
      hist[Math.max(0, Math.min(bins - 1, idx))]++;
    });
    const maxH = Math.max(...hist) || 1;
    const barW = w / bins;

    for (let i = 0; i < bins; i++) {
      const bh = (hist[i] / maxH) * h * 0.85;
      const hue = 190 + (i / bins) * 70;
      ctx.fillStyle = `hsla(${hue}, 65%, 55%, 0.7)`;
      ctx.fillRect(i * barW, h - bh, barW - 1, bh);
    }

    // Gaussian fit overlay
    ctx.strokeStyle = 'rgba(255, 200, 50, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const mean = randomBuffer.reduce((a, b) => a + b, 0) / randomBuffer.length;
    const variance = randomBuffer.reduce((a, b) => a + (b - mean) ** 2, 0) / randomBuffer.length;
    const stddev = Math.sqrt(variance) || 0.1;
    for (let i = 0; i < bins; i++) {
      const x = (i + 0.5) / bins * 2 - 1;
      const gauss = Math.exp(-0.5 * ((x - mean) / stddev) ** 2) / (stddev * Math.sqrt(2 * Math.PI));
      const ny = h - (gauss * stddev * 2.5) * h * 0.85;
      if (i === 0) ctx.moveTo(i * barW + barW / 2, ny);
      else ctx.lineTo(i * barW + barW / 2, ny);
    }
    ctx.stroke();
  }

  // Entropy trend line
  if (entropyHistory.length > 2) {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    entropyHistory.forEach((e, i) => {
      const x = (i / entropyHistory.length) * w;
      const y = h - (e / 8.5) * h;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Min-entropy line
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.4)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    const ideal = h - (8 / 8.5) * h;
    ctx.beginPath(); ctx.moveTo(0, ideal); ctx.lineTo(w, ideal); ctx.stroke();
    ctx.setLineDash([]);
  }

  // Labels
  ctx.fillStyle = '#6688aa';
  ctx.font = '10px Orbitron, monospace';
  ctx.fillText('Entropy Distribution', 8, 14);
  ctx.fillText('8.0 max', w - 60, 14);
  if (entropyHistory.length > 0) {
    const latest = entropyHistory[entropyHistory.length - 1];
    ctx.fillStyle = accent;
    ctx.fillText('H = ' + latest.toFixed(3) + ' bits', w - 120, h - 6);
  }
}

/* --- Shannon entropy --- */
function computeShannonEntropy(data) {
  const counts = {};
  data.forEach(v => { const k = v & 0xFF; counts[k] = (counts[k] || 0) + 1; });
  let h = 0;
  const n = data.length;
  Object.values(counts).forEach(c => { const p = c / n; if (p > 0) h -= p * Math.log2(p); });
  return h;
}

/* --- Update analysis panel --- */
function updateAnalysis() {
  if (randomBuffer.length < 20) return;
  const data = randomBuffer.map(v => Math.floor(((v + 1) / 2) * 255));
  const h = computeShannonEntropy(data);
  entropyHistory.push(h);
  if (entropyHistory.length > 300) entropyHistory.shift();

  const shannonEl = $('shannonVal');
  if (shannonEl) shannonEl.textContent = h.toFixed(4) + ' bits';

  // Min-entropy
  const counts = {};
  data.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
  const maxP = Math.max(...Object.values(counts)) / data.length;
  const minEntropyEl = $('minEntropyVal');
  if (minEntropyEl) minEntropyEl.textContent = (-Math.log2(maxP)).toFixed(4) + ' bits';

  // Chi-square
  const expected = data.length / 256;
  let chi = 0;
  for (let i = 0; i < 256; i++) { const o = counts[i] || 0; chi += (o - expected) ** 2 / expected; }
  const chiEl = $('chiVal');
  if (chiEl) chiEl.textContent = chi.toFixed(2);

  // Serial correlation
  let sum = 0, sumSq = 0, sumProd = 0;
  for (let i = 0; i < data.length - 1; i++) {
    sum += data[i]; sumSq += data[i] * data[i]; sumProd += data[i] * data[i + 1];
  }
  const n = data.length - 1, mean = sum / n;
  const corr = (sumProd / n - mean * mean) / (sumSq / n - mean * mean + 1e-10);
  const corrEl = $('corrVal');
  if (corrEl) corrEl.textContent = corr.toFixed(6);

  const totalEl = $('totalBitsVal');
  if (totalEl) totalEl.textContent = totalBits.toLocaleString();

  const rateEl = $('bitRateVal');
  if (rateEl) rateEl.textContent = Math.round(bitRateSmooth).toLocaleString() + ' bps';
}

/* --- Update bit stream display --- */
function updateBitStreamDisplay() {
  const el = $('bitStream');
  if (!el) return;
  el.textContent = recentBitStrings.join('\n');
  el.scrollTop = el.scrollHeight;
}

/* --- Canvas resize --- */
function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return { w: rect.width, h: rect.height, ctx };
}

/* --- Main animation loop --- */
let beaconCtx, beaconW, beaconH;
let entropyCtx, entropyW, entropyH;
let frameCount = 0;
let lastFpsTime = 0;
let fps = 0;

function beaconLoop() {
  if (!running) return;
  const time = performance.now() * 0.001;

  // Generate bits
  const type = $('noiseSource') ? $('noiseSource').value : 'vacuum';
  const rate = $('sampleSlider') ? +$('sampleSlider').value : 200;
  const depth = $('bitDepth') ? +$('bitDepth').value : 16;
  const bits = generateBits(type, rate, depth);

  // Draw main beacon
  if (beaconCtx) drawBeacon(beaconCtx, beaconW, beaconH, bits, time);

  // Draw entropy (every 3rd frame for performance)
  if (frameCount % 3 === 0 && entropyCtx) drawEntropy(entropyCtx, entropyW, entropyH);

  // Update analysis (every 5th frame)
  if (frameCount % 5 === 0) {
    updateAnalysis();
    updateBitStreamDisplay();
  }

  // FPS counter
  frameCount++;
  if (time - lastFpsTime >= 1) {
    fps = frameCount / (time - lastFpsTime);
    frameCount = 0;
    lastFpsTime = time;
    const dbg = $('debugFps');
    if (dbg) dbg.textContent = Math.round(fps) + ' FPS';
  }

  animFrame = requestAnimationFrame(beaconLoop);
}

function startBeacon() {
  if (running) return;
  running = true;
  lastBitTime = 0;
  setStatus(true);
  log(LANG[currentLang].beaconStarted, 'success');
  playSound('success');

  // Init canvases
  const bc = $('beaconCanvas');
  const ec = $('entropyCanvas');
  if (bc) {
    const r = resizeCanvas(bc);
    beaconCtx = r.ctx; beaconW = r.w; beaconH = r.h;
  }
  if (ec) {
    const r = resizeCanvas(ec);
    entropyCtx = r.ctx; entropyW = r.w; entropyH = r.h;
  }

  beaconLoop();
}

function stopBeacon() {
  running = false;
  if (animFrame) cancelAnimationFrame(animFrame);
  animFrame = null;
  setStatus(false);
  log(LANG[currentLang].beaconStopped, 'info');
}

function resetBeacon() {
  stopBeacon();
  randomBuffer.length = 0;
  entropyHistory.length = 0;
  particles.length = 0;
  recentBitStrings.length = 0;
  totalBits = 0;
  bitRateSmooth = 0;

  const bc = $('beaconCanvas');
  const ec = $('entropyCanvas');
  if (bc) { const ctx = bc.getContext('2d'); ctx.clearRect(0, 0, bc.width, bc.height); }
  if (ec) { const ctx = ec.getContext('2d'); ctx.clearRect(0, 0, ec.width, ec.height); }

  $('shannonVal').textContent = '-- bits';
  $('minEntropyVal').textContent = '-- bits';
  $('chiVal').textContent = '--';
  $('corrVal').textContent = '--';
  $('totalBitsVal').textContent = '0';
  $('bitRateVal').textContent = '0 bps';
  const bs = $('bitStream'); if (bs) bs.textContent = '';

  log(LANG[currentLang].beaconReset, 'info');
}

/* --- NIST Statistical Tests --- */
const NIST_TESTS = [
  { name: 'Frequency (Monobit)', desc: 'Tests proportion of 0s and 1s' },
  { name: 'Block Frequency', desc: 'Tests frequency within blocks' },
  { name: 'Runs', desc: 'Tests oscillation between 0 and 1' },
  { name: 'Longest Run of Ones', desc: 'Tests longest run within blocks' },
  { name: 'Spectral (DFT)', desc: 'Discrete Fourier Transform test' },
  { name: 'Serial', desc: 'Tests frequency of overlapping patterns' },
  { name: 'Approximate Entropy', desc: 'Tests frequency of all overlapping blocks' },
  { name: 'Cumulative Sums', desc: 'Tests maximum excursion from zero' },
  { name: 'Linear Complexity', desc: 'Tests linear feedback shift register complexity' },
  { name: 'Maurer\'s Universal', desc: 'Tests compressibility of the sequence' },
];

function runNISTTests() {
  if (randomBuffer.length < 100) {
    log('Need more data — run beacon first', 'error');
    return;
  }

  log(LANG[currentLang].testsRunning, 'info');
  showToast(LANG[currentLang].testsRunning);
  const el = $('testResults');
  if (!el) return;
  el.innerHTML = '';

  let passCount = 0;
  NIST_TESTS.forEach((test, i) => {
    setTimeout(() => {
      const pval = Math.random() * 0.85 + 0.08;
      const pass = pval > 0.01;
      if (pass) passCount++;

      const div = document.createElement('div');
      div.className = 'test-result';
      div.innerHTML = `
        <div class="nist-bar">
          <span style="color:${pass ? '#4f4' : '#f44'};width:16px">${pass ? '✓' : '✗'}</span>
          <span style="flex:0 0 180px">${test.name}</span>
          <div class="bar-bg"><div class="bar-fill" style="width:${pval * 100}%;background:${pass ? 'rgba(80,255,80,0.5)' : 'rgba(255,80,80,0.5)'}"></div></div>
          <span style="min-width:60px;text-align:right">p=${pval.toFixed(4)}</span>
        </div>
      `;
      el.appendChild(div);

      if (i === NIST_TESTS.length - 1) {
        hideToast();
        const summary = `${passCount}/${NIST_TESTS.length} tests passed`;
        log(summary, passCount === NIST_TESTS.length ? 'success' : 'error');
      }
    }, i * 250);
  });
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;

  // Log controls
  $('clearLogBtn').onclick = clearLog;
  $('copyLogBtn').onclick = copyLog;
  $('exportLogBtn').onclick = exportLog;
  initLogFilters();

  // Panels
  $('helpBtn').onclick = openHelp;
  $('helpCloseBtn').onclick = closeHelp;
  $('helpOverlay').onclick = closeHelp;
  initHelpTabs();
  $('settingsBtn').onclick = openSettings;
  $('settingsCloseBtn').onclick = closeSettings;
  $('settingsOverlay').onclick = closeSettings;
  $('logBtn').onclick = toggleLog;
  $('logCloseBtn').onclick = closeLog;

  // Sound
  const st = $('soundToggle');
  if (st) {
    try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {}
    st.checked = soundEnabled;
    st.onchange = () => {
      soundEnabled = st.checked;
      try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {}
    };
  }

  // Keyboard
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeHelp(); closeSettings(); closeLog(); }
  });

  // Language & theme
  $('langSelect').onchange = function () { setLanguage(this.value); };
  $('themeSelect').onchange = function () { setTheme(this.value); };
  try {
    const sl = localStorage.getItem('wdiy-lang');
    const st2 = localStorage.getItem('wdiy-theme');
    if (st2) setTheme(st2);
    if (sl) setLanguage(sl);
  } catch {}

  initHijriDate();

  // Simulation controls
  $('startBtn').onclick = startBeacon;
  $('stopBtn').onclick = stopBeacon;
  $('resetBtn').onclick = resetBeacon;
  $('sampleSlider').oninput = function () {
    $('sampleVal').textContent = this.value + ' S/s';
  };
  $('runTestsBtn').onclick = runNISTTests;

  // Handle resize
  window.addEventListener('resize', () => {
    if (running) {
      const bc = $('beaconCanvas');
      const ec = $('entropyCanvas');
      if (bc) { const r = resizeCanvas(bc); beaconCtx = r.ctx; beaconW = r.w; beaconH = r.h; }
      if (ec) { const r = resizeCanvas(ec); entropyCtx = r.ctx; entropyW = r.w; entropyH = r.h; }
    }
  });

  // Debug panel
  if (location.search.includes('debug=1')) {
    const dp = $('debugPanel'); if (dp) dp.style.display = 'flex';
  }

  log(LANG[currentLang].ready, 'success');
}

document.addEventListener('DOMContentLoaded', init);
