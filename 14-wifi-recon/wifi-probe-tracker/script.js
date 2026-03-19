/**
 * Probe Tracker — Location Leaks
 * Probe request log, device→network mapping
 * Workshop DIY — Template v1.2 + App Logic
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7zm21,.-1.6h-6.5v3.2h6.5zm-13,.16.2h-3.2v-16.2h3.2zm19.5,0h-3.2v-16.2h3.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/></svg>`;
const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAA+ElEQVR4nO3bMQ6DMBBA0Y+4/5WTG1BQIKTYXq/f1JGsmcEYGAAAAAAAAAAAAAAAAAAAAPifTu/P5+eu';

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

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
  if (type === 'click') { osc.frequency.value = 800; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); }
  else if (type === 'success') { osc.frequency.value = 523; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); }
  else if (type === 'error') { osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); }
}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title: 'Probe Tracker — Location Leaks', subtitle: 'Probe requests reveal your location history',
    disconnected: 'Disconnected', connected: 'Capturing',
    mainSection: 'Probe Request Log', mainDesc: 'Live probe requests from nearby devices',
    sectionA: 'Device → Network Mapping', sectionB: 'Privacy Risk Analysis', sectionC: 'How It Works',
    start: 'Start', stop: 'Stop',
    totalProbes: 'Total Probes', uniqueDevices: 'Unique Devices', networksRevealed: 'Networks Revealed', probesPerSec: 'Probes/sec',
    colDevice: 'Device', colVendor: 'Vendor', colNetworks: 'Networks Probed', colProbes: 'Probes',
    mappingDesc: 'Each device reveals which networks it has previously connected to',
    riskTitle: 'Location Leak Severity',
    howItWorksText: 'When WiFi is enabled, your device continuously sends probe requests for networks it has connected to before. These requests contain the SSID names of your saved networks, revealing your location history to anyone listening. An attacker at a coffee shop can learn you visit certain hotels, airports, or offices just by capturing these probes. This simulation demonstrates how much private information leaks through normal WiFi behavior.',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    settings: 'Settings', language: 'Language', theme: 'Theme',
    soundEffects: 'Sound effects',
    help: 'Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    faq_q1: 'What is Probe Tracker?', faq_a1: 'A tool that simulates capturing WiFi probe requests to show how devices leak location information.',
    faq_q2: 'Are real probes captured?', faq_a2: 'No, this is a simulation. Real probe tracking requires monitor mode hardware.',
    faq_q3: 'Why are probes a privacy risk?', faq_a3: 'Probe requests contain SSIDs of saved networks, revealing places you have visited.',
    faq_q4: 'Is my data private?', faq_a4: 'Yes. Everything runs locally in your browser. No data is sent anywhere.',
    howto_1: 'Click Start to begin capturing simulated probe requests.',
    howto_2: 'Watch devices appear and reveal their saved network names.',
    howto_3: 'Check Device-Network Mapping to see location leaks per device.',
    howto_4: 'Review Privacy Risk Analysis for severity assessment.',
    wiki_probe_title: 'Probe Requests', wiki_probe: 'Probe requests are management frames sent by WiFi clients to discover available networks.',
    wiki_leak_title: 'Location Leaks', wiki_leak: 'SSID names in probes can reveal hotels, airports, offices, and homes you have visited.',
    wiki_privacy_title: 'Privacy', wiki_privacy: 'Local-first, privacy-first. All data stays in your browser.',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: 'Probe Tracker ready!', logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    splashHint: 'tap to skip', working: 'Working...',
    langChanged: 'Language → English', themeChanged: 'Theme →',
    simStarted: 'Probe capture started', simStopped: 'Probe capture stopped',
    newDevice: 'New device detected', newNetwork: 'New network revealed',
    riskLow: 'LOW — Few networks revealed, limited location exposure.',
    riskMedium: 'MEDIUM — Several networks revealed, moderate location exposure.',
    riskHigh: 'HIGH — Many networks revealed across multiple device types. Significant location history exposure!',
  },
  fr: {
    title: 'Probe Tracker — Fuites de Localisation', subtitle: 'Les sondes WiFi revelent votre historique de localisation',
    disconnected: 'Deconnecte', connected: 'Capture',
    mainSection: 'Journal des Sondes', mainDesc: 'Sondes en direct des appareils a proximite',
    sectionA: 'Appareil → Reseau', sectionB: 'Analyse des Risques', sectionC: 'Comment ca marche',
    start: 'Demarrer', stop: 'Arreter',
    totalProbes: 'Total Sondes', uniqueDevices: 'Appareils Uniques', networksRevealed: 'Reseaux Reveles', probesPerSec: 'Sondes/sec',
    colDevice: 'Appareil', colVendor: 'Fabricant', colNetworks: 'Reseaux Sondes', colProbes: 'Sondes',
    mappingDesc: 'Chaque appareil revele les reseaux auxquels il s\'est connecte',
    riskTitle: 'Severite des Fuites',
    howItWorksText: 'Quand le WiFi est active, votre appareil envoie des sondes pour les reseaux connus. Ces requetes contiennent les noms SSID de vos reseaux enregistres, revelant votre historique de localisation a quiconque ecoute.',
    activityLog: 'Journal', eventsMsg: 'Evenements et messages',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    settings: 'Parametres', language: 'Langue', theme: 'Theme',
    soundEffects: 'Effets sonores',
    help: 'Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    faq_q1: 'Qu\'est-ce que Probe Tracker ?', faq_a1: 'Un outil simulant la capture de sondes WiFi pour montrer les fuites de localisation.',
    faq_q2: 'Capture-t-il de vraies sondes ?', faq_a2: 'Non, c\'est une simulation.',
    faq_q3: 'Pourquoi les sondes sont-elles un risque ?', faq_a3: 'Elles contiennent les SSID des reseaux enregistres, revelant vos deplacements.',
    faq_q4: 'Mes donnees sont-elles privees ?', faq_a4: 'Oui. Tout fonctionne localement.',
    howto_1: 'Cliquez Demarrer pour capturer les sondes simulees.',
    howto_2: 'Observez les appareils reveler leurs reseaux enregistres.',
    howto_3: 'Consultez la correspondance appareil-reseau.',
    howto_4: 'Verifiez l\'analyse des risques.',
    wiki_probe_title: 'Sondes WiFi', wiki_probe: 'Les sondes sont des trames envoyees par les clients WiFi.',
    wiki_leak_title: 'Fuites de Localisation', wiki_leak: 'Les noms SSID revelent hotels, aeroports, bureaux visites.',
    wiki_privacy_title: 'Confidentialite', wiki_privacy: 'Tout reste dans votre navigateur.',
    t_mosque: 'Mosquee', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: 'Probe Tracker pret !', logCleared: 'Journal efface', copied: 'Copie !', copyFail: 'Echec',
    splashHint: 'appuyer pour passer', working: 'En cours...',
    langChanged: 'Langue → Francais', themeChanged: 'Theme →',
    simStarted: 'Capture de sondes demarree', simStopped: 'Capture de sondes arretee',
    newDevice: 'Nouvel appareil detecte', newNetwork: 'Nouveau reseau revele',
    riskLow: 'FAIBLE — Peu de reseaux reveles.',
    riskMedium: 'MOYEN — Plusieurs reseaux reveles.',
    riskHigh: 'ELEVE — Nombreux reseaux reveles. Exposition significative !',
  },
  ar: {
    title: 'متتبع الاستكشاف — تسريبات الموقع', subtitle: 'طلبات الاستكشاف تكشف سجل مواقعك',
    disconnected: 'غير متصل', connected: 'التقاط',
    mainSection: 'سجل طلبات الاستكشاف', mainDesc: 'طلبات استكشاف مباشرة من الأجهزة القريبة',
    sectionA: 'جهاز → شبكة', sectionB: 'تحليل مخاطر الخصوصية', sectionC: 'كيف يعمل',
    start: 'بدء', stop: 'إيقاف',
    totalProbes: 'إجمالي الاستكشافات', uniqueDevices: 'أجهزة فريدة', networksRevealed: 'شبكات مكشوفة', probesPerSec: 'استكشاف/ثانية',
    colDevice: 'جهاز', colVendor: 'الشركة', colNetworks: 'الشبكات المستكشفة', colProbes: 'استكشافات',
    mappingDesc: 'كل جهاز يكشف الشبكات التي اتصل بها سابقاً',
    riskTitle: 'شدة تسريب الموقع',
    howItWorksText: 'عندما يكون WiFi مفعلاً، يرسل جهازك طلبات استكشاف للشبكات المحفوظة. هذه الطلبات تحتوي أسماء SSID لشبكاتك، مما يكشف سجل مواقعك لأي شخص يستمع.',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', filterAll: 'الكل',
    settings: 'الإعدادات', language: 'اللغة', theme: 'المظهر',
    soundEffects: 'مؤثرات صوتية',
    help: 'مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    faq_q1: 'ما هو متتبع الاستكشاف؟', faq_a1: 'أداة تحاكي التقاط طلبات استكشاف WiFi لإظهار تسريبات الموقع.',
    faq_q2: 'هل يلتقط استكشافات حقيقية؟', faq_a2: 'لا، هذه محاكاة.',
    faq_q3: 'لماذا الاستكشافات خطر على الخصوصية؟', faq_a3: 'تحتوي أسماء الشبكات المحفوظة مما يكشف أماكن زيارتك.',
    faq_q4: 'هل بياناتي خاصة؟', faq_a4: 'نعم. كل شيء يعمل محلياً في متصفحك.',
    howto_1: 'انقر بدء لالتقاط طلبات الاستكشاف المحاكاة.',
    howto_2: 'شاهد الأجهزة تكشف شبكاتها المحفوظة.',
    howto_3: 'تحقق من ربط الأجهزة بالشبكات.',
    howto_4: 'راجع تحليل مخاطر الخصوصية.',
    wiki_probe_title: 'طلبات الاستكشاف', wiki_probe: 'طلبات الاستكشاف هي إطارات إدارة يرسلها العملاء لاكتشاف الشبكات.',
    wiki_leak_title: 'تسريبات الموقع', wiki_leak: 'أسماء SSID تكشف الفنادق والمطارات والمكاتب التي زرتها.',
    wiki_privacy_title: 'الخصوصية', wiki_privacy: 'كل البيانات تبقى في متصفحك.',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    ready: 'متتبع الاستكشاف جاهز!', logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    splashHint: 'انقر للتخطي', working: 'جارٍ...',
    langChanged: 'اللغة ← العربية', themeChanged: 'المظهر ←',
    simStarted: 'بدأ التقاط الاستكشافات', simStopped: 'توقف التقاط الاستكشافات',
    newDevice: 'جهاز جديد', newNetwork: 'شبكة جديدة مكشوفة',
    riskLow: 'منخفض — شبكات قليلة مكشوفة.',
    riskMedium: 'متوسط — عدة شبكات مكشوفة.',
    riskHigh: 'مرتفع — شبكات كثيرة مكشوفة. تعرض كبير لسجل المواقع!',
  }
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
const THEME_MELODIES = { 'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523] };

function playThemeMelody(name) {
  if (!soundEnabled || !audioCtx) return;
  const notes = THEME_MELODIES[name]; if (!notes) return;
  const t = audioCtx.currentTime;
  notes.forEach((freq, i) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0.06; g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15); o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2); });
}

function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  const s = LANG[currentLang], label = s['t_' + name] || name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
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

function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const t = Array.from(logContainer.children).map(d => d.textContent).join('\n'); try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const lines = Array.from(logContainer.children).map(d => d.textContent); const blob = new Blob([lines.join('\n')], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `probe-log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); URL.revokeObjectURL(url); }

/* ═══════ TOAST ═══════ */
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }

/* ═══════ STATUS ═══════ */
function setStatus(connected) { const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang]; if (txt) txt.textContent = connected ? s.connected : s.disconnected; if (pill) pill.classList.toggle('connected', connected); }

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

/* ═══════ LOG FILTERS ═══════ */
let activeLogFilter = 'all';
function initLogFilters() {
  document.querySelectorAll('.log-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); playSound('click');
    });
  });
}
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(line => { line.style.display = (activeLogFilter === 'all' || line.classList.contains(activeLogFilter)) ? '' : 'none'; }); }

/* ═══════ PANELS ═══════ */
function openPanel(pid, oid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(pid, oid, rid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.remove('open'); if (ov) ov.classList.remove('open'); const btn = $(rid); if (btn) btn.focus(); }
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
  const tabs = document.querySelectorAll('.help-tab'), contents = document.querySelectorAll('.help-content');
  tabs.forEach(tab => { tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active')); contents.forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const target = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1));
    if (target) target.classList.add('active');
  }); });
}

/* ═══════ HIJRI DATE ═══════ */
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day:'numeric', month:'long', year:'numeric' }).format(new Date()); } catch {} }

/* ═══════ LOG RESIZE ═══════ */
function initLogResize() {
  const handle = $('logResizeHandle'), panel = $('logPanel');
  if (!handle || !panel) return;
  let dragging = false, startX, startW;
  const isRtl = () => document.documentElement.dir === 'rtl';
  handle.addEventListener('mousedown', e => { dragging = true; startX = e.clientX; startW = panel.offsetWidth; handle.classList.add('active'); document.body.style.cursor = 'col-resize'; e.preventDefault(); });
  document.addEventListener('mousemove', e => { if (!dragging) return; const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6)) + 'px'); });
  document.addEventListener('mouseup', () => { if (!dragging) return; dragging = false; handle.classList.remove('active'); document.body.style.cursor = ''; });
}

/* ═══════════════════════════════════════════════════════════════
   APP LOGIC — Probe Tracker
   ═══════════════════════════════════════════════════════════════ */

const LOCATION_SSIDS = [
  { ssid: 'Hilton_Guest', location: 'Hotel' },
  { ssid: 'Marriott_WiFi', location: 'Hotel' },
  { ssid: 'Starbucks', location: 'Coffee Shop' },
  { ssid: 'McDonald_Free', location: 'Restaurant' },
  { ssid: 'Airport_Free_WiFi', location: 'Airport' },
  { ssid: 'LAX-Free', location: 'Airport' },
  { ssid: 'CDG-WiFi', location: 'Airport' },
  { ssid: 'HomeNet-5G', location: 'Home' },
  { ssid: 'MyHome_Fiber', location: 'Home' },
  { ssid: 'CorpNet-Secure', location: 'Office' },
  { ssid: 'Company_Internal', location: 'Office' },
  { ssid: 'University_WiFi', location: 'School' },
  { ssid: 'Library_Public', location: 'Library' },
  { ssid: 'GYM_Members', location: 'Gym' },
  { ssid: 'Hospital_Staff', location: 'Hospital' },
  { ssid: 'TrainStation_Free', location: 'Transit' },
  { ssid: 'Metro_WiFi', location: 'Transit' },
  { ssid: 'CoffeeBean_Guest', location: 'Coffee Shop' },
  { ssid: 'WeWork_Member', location: 'Coworking' },
  { ssid: 'AirBnB_Guest', location: 'Rental' },
];

const VENDORS = ['Apple', 'Samsung', 'Google', 'Huawei', 'Xiaomi', 'OnePlus', 'LG', 'Motorola', 'Sony', 'Nokia', 'Intel', 'Dell', 'HP', 'Lenovo'];

function randMAC() { return Array.from({length:6}, () => Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(':'); }

let simRunning = false, simInterval = null;
let devices = new Map(); // mac -> { vendor, networks: Set, probeCount }
let allNetworks = new Set();
let totalProbes = 0;
let startTime = 0;

function generateProbe() {
  // Pick or create a device
  let mac, dev;
  if (devices.size > 0 && Math.random() < 0.7) {
    // Existing device
    const keys = Array.from(devices.keys());
    mac = keys[Math.floor(Math.random() * keys.length)];
    dev = devices.get(mac);
  } else {
    // New device
    mac = randMAC();
    dev = { vendor: VENDORS[Math.floor(Math.random() * VENDORS.length)], networks: new Set(), probeCount: 0 };
    devices.set(mac, dev);
    log(`${LANG[currentLang].newDevice}: ${mac} (${dev.vendor})`, 'rx');
  }

  // Pick an SSID to probe
  const entry = LOCATION_SSIDS[Math.floor(Math.random() * LOCATION_SSIDS.length)];
  if (!dev.networks.has(entry.ssid)) {
    dev.networks.add(entry.ssid);
    allNetworks.add(entry.ssid);
    log(`${LANG[currentLang].newNetwork}: ${entry.ssid} (${entry.location})`, 'success');
  }
  dev.probeCount++;
  totalProbes++;

  const signal = -30 - Math.floor(Math.random() * 60);

  // Add to probe log UI
  const probeLog = $('probeLog');
  if (probeLog) {
    const row = document.createElement('div');
    row.className = 'probe-row';
    row.innerHTML = `<span class="probe-time">${new Date().toLocaleTimeString()}</span><span class="probe-mac">${mac}</span><span class="probe-ssid">${entry.ssid}</span><span class="probe-signal">${signal} dBm</span>`;
    probeLog.insertBefore(row, probeLog.firstChild);
    if (probeLog.children.length > 100) probeLog.removeChild(probeLog.lastChild);
  }

  // Update stats
  $('probeCount').textContent = totalProbes;
  $('deviceCount').textContent = devices.size;
  $('networkCount').textContent = allNetworks.size;
  const elapsed = (Date.now() - startTime) / 1000;
  $('probeRate').textContent = elapsed > 0 ? (totalProbes / elapsed).toFixed(1) : '0';
}

function updateMapping() {
  const tbody = $('mappingBody');
  if (!tbody) return;
  tbody.innerHTML = '';
  devices.forEach((dev, mac) => {
    const tr = document.createElement('tr');
    const networkTags = Array.from(dev.networks).map(n => `<span class="device-tag">${n}</span>`).join(' ');
    tr.innerHTML = `<td style="font-family:monospace;font-size:.7rem">${mac}</td><td>${dev.vendor}</td><td>${networkTags}</td><td>${dev.probeCount}</td>`;
    tbody.appendChild(tr);
  });
}

function updateRiskAnalysis() {
  const el = $('riskAnalysis');
  if (!el) return;
  const s = LANG[currentLang];
  const networkCount = allNetworks.size;
  let risk, color;
  if (networkCount < 5) { risk = s.riskLow; color = '#86efac'; }
  else if (networkCount < 12) { risk = s.riskMedium; color = '#fbbf24'; }
  else { risk = s.riskHigh; color = '#fca5a5'; }

  const locations = {};
  LOCATION_SSIDS.forEach(e => { if (allNetworks.has(e.ssid)) locations[e.location] = (locations[e.location] || 0) + 1; });
  const locList = Object.entries(locations).map(([k,v]) => `${k}: ${v}`).join(', ');

  el.innerHTML = `<div style="padding:8px;border-radius:8px;border:1px solid ${color}40;background:${color}10;margin-bottom:8px"><strong style="color:${color}">${risk}</strong></div>
    <div style="margin-top:8px"><strong>Devices tracked:</strong> ${devices.size}</div>
    <div><strong>Networks revealed:</strong> ${allNetworks.size}</div>
    <div><strong>Location categories:</strong> ${locList || 'None'}</div>`;
}

function startSim() {
  if (simRunning) return;
  simRunning = true;
  setStatus(true);
  $('startBtn').disabled = true;
  $('stopBtn').disabled = false;
  devices.clear();
  allNetworks.clear();
  totalProbes = 0;
  startTime = Date.now();
  const probeLog = $('probeLog');
  if (probeLog) probeLog.innerHTML = '';
  log(LANG[currentLang].simStarted, 'success');

  simInterval = setInterval(() => {
    const burst = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < burst; i++) generateProbe();
    updateMapping();
    updateRiskAnalysis();
  }, 800);
}

function stopSim() {
  simRunning = false;
  if (simInterval) clearInterval(simInterval);
  setStatus(false);
  $('startBtn').disabled = false;
  $('stopBtn').disabled = true;
  log(LANG[currentLang].simStopped, 'info');
  updateMapping();
  updateRiskAnalysis();
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;

  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();

  const hBtn = $('helpBtn'), hClose = $('helpCloseBtn'), hOv = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp; if (hClose) hClose.onclick = closeHelp; if (hOv) hOv.onclick = closeHelp;
  initHelpTabs();

  const sBtn = $('settingsBtn'), sClose = $('settingsCloseBtn'), sOv = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings; if (sClose) sClose.onclick = closeSettings; if (sOv) sOv.onclick = closeSettings;

  const lBtn = $('logBtn'), lClose = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog; if (lClose) lClose.onclick = closeLog;
  initLogResize();

  const soundTgl = $('soundToggle');
  if (soundTgl) {
    try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {}
    soundTgl.checked = soundEnabled;
    soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} if (soundEnabled) playSound('click'); });
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); });

  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));

  try {
    const savedLang = localStorage.getItem('wdiy-lang');
    const savedTheme = localStorage.getItem('wdiy-theme');
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLanguage(savedLang);
  } catch {}

  initHijriDate();

  const startBtn = $('startBtn'), stopBtn = $('stopBtn');
  if (startBtn) startBtn.onclick = startSim;
  if (stopBtn) stopBtn.onclick = stopSim;

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

/* ═══════ RICH CANVAS SIMULATION — Probe Location Leak Map ═══════ */
(function probeMapCanvas(){
  const CVS_ID='probeMapVis';
  function ensureCanvas(){
    if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);
    const wrap=document.querySelector('.section-card')||document.querySelector('.main-section')||document.querySelector('main');
    if(!wrap)return null;
    const card=document.createElement('div');card.className='section-card';
    card.innerHTML='<div class="section-header"><span class="section-icon">📍</span> Location Leak Map</div>';
    const c=document.createElement('canvas');c.id=CVS_ID;
    c.style.cssText='width:100%;height:280px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';
    card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c;
  }
  const locIcons={Hotel:'H',Airport:'A','Coffee Shop':'C',Home:'*',Office:'O',School:'S',Library:'L',Gym:'G',Hospital:'+',Transit:'T',Coworking:'W',Restaurant:'R',Rental:'R'};
  const locPositions={};const trails=[];let _raf=null,frameCount=0;
  function draw(){
    const c=document.getElementById(CVS_ID);if(!c){_raf=null;return;}
    const ctx=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;
    ctx.scale(2,2);const w=W/2,h=H/2;
    ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);
    frameCount++;
    // Build location positions (stable)
    const locs=Object.keys(locIcons);
    locs.forEach((loc,i)=>{
      if(!locPositions[loc]){
        const cols=4,rows=Math.ceil(locs.length/cols);
        const col=i%cols,row=Math.floor(i/cols);
        locPositions[loc]={x:w*0.15+col*(w*0.7/(cols-1)),y:h*0.15+row*(h*0.6/(rows-1||1))};
      }
    });
    // Grid effect
    ctx.strokeStyle='rgba(255,255,255,0.02)';ctx.lineWidth=1;
    for(let x=0;x<w;x+=30){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=0;y<h;y+=30){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    // Center device
    const devX=w/2,devY=h*0.85;
    ctx.beginPath();ctx.arc(devX,devY,8,0,Math.PI*2);ctx.fillStyle='#3b82f6';ctx.fill();
    ctx.font='7px monospace';ctx.fillStyle='rgba(255,255,255,0.5)';ctx.textAlign='center';
    ctx.fillText('DEVICE',devX,devY+16);
    // Signal rings from device
    for(let r=1;r<=3;r++){
      ctx.beginPath();ctx.arc(devX,devY,r*25,Math.PI*1.1,Math.PI*1.9);
      ctx.strokeStyle=`rgba(59,130,246,${0.15/r})`;ctx.lineWidth=1;ctx.stroke();
    }
    // Draw locations that have been revealed
    if(typeof allNetworks!=='undefined'){
      const revealedLocs=new Set();
      if(typeof LOCATION_SSIDS!=='undefined'){
        LOCATION_SSIDS.forEach(e=>{if(allNetworks.has(e.ssid))revealedLocs.add(e.location);});
      }
      locs.forEach(loc=>{
        const pos=locPositions[loc];if(!pos)return;
        const revealed=revealedLocs.has(loc);
        const pulse=Math.sin(frameCount*0.03+loc.length)*0.3+0.7;
        if(revealed){
          // Glow
          ctx.beginPath();ctx.arc(pos.x,pos.y,18*pulse,0,Math.PI*2);
          ctx.fillStyle='rgba(239,68,68,0.08)';ctx.fill();
          // Connection line from device to location
          ctx.beginPath();ctx.moveTo(devX,devY);ctx.lineTo(pos.x,pos.y);
          const flash=Math.sin(frameCount*0.05+loc.length)*0.1+0.12;
          ctx.strokeStyle=`rgba(239,68,68,${flash})`;ctx.lineWidth=1;
          ctx.setLineDash([3,5]);ctx.stroke();ctx.setLineDash([]);
          // Animated probe packet along the line
          const t=((frameCount*2+loc.length*30)%120)/120;
          const px=devX+(pos.x-devX)*t;const py=devY+(pos.y-devY)*t;
          ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);ctx.fillStyle='#ef4444';ctx.globalAlpha=1-t;ctx.fill();ctx.globalAlpha=1;
        }
        // Location node
        ctx.beginPath();ctx.arc(pos.x,pos.y,10,0,Math.PI*2);
        ctx.fillStyle=revealed?'rgba(239,68,68,0.25)':'rgba(255,255,255,0.05)';ctx.fill();
        ctx.strokeStyle=revealed?'#ef4444':'rgba(255,255,255,0.1)';ctx.lineWidth=revealed?1.5:1;ctx.stroke();
        // Icon
        ctx.font=revealed?'bold 9px monospace':'9px monospace';
        ctx.fillStyle=revealed?'#fca5a5':'rgba(255,255,255,0.15)';ctx.textAlign='center';
        ctx.fillText(locIcons[loc]||'?',pos.x,pos.y+3);
        // Label
        ctx.font='7px monospace';ctx.fillStyle=revealed?'rgba(252,165,165,0.6)':'rgba(255,255,255,0.1)';
        ctx.fillText(loc,pos.x,pos.y+20);
      });
      // Risk meter
      const riskPct=Math.min(1,revealedLocs.size/locs.length);
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(w-80,h-18,70,10);
      ctx.fillStyle=riskPct>0.6?'#ef4444':riskPct>0.3?'#fbbf24':'#22c55e';
      ctx.fillRect(w-80,h-18,70*riskPct,10);
      ctx.font='7px monospace';ctx.fillStyle='rgba(255,255,255,0.4)';ctx.textAlign='right';
      ctx.fillText('EXPOSURE',w-10,h-21);
    }
    _raf=requestAnimationFrame(draw);
  }
  function boot(){const c=ensureCanvas();if(!c)return setTimeout(boot,500);if(!_raf)draw();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
