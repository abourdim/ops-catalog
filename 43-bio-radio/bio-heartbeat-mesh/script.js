/**
 * Workshop DIY — Bio Heartbeat Mesh v1.0
 * Heartbeat-synchronized mesh network
 * Self-contained: i18n · framework · simulation
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;
const LIGHT_THEMES = ['riad', 'medina'];
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); g.gain.value = 0.08; const t = audioCtx.currentTime; if (type === 'click') { o.frequency.value = 800; o.type = 'sine'; g.gain.exponentialRampToValueAtTime(0.001, t + 0.08); o.start(t); o.stop(t + 0.08); } else if (type === 'success') { o.frequency.value = 523; o.type = 'sine'; g.gain.exponentialRampToValueAtTime(0.001, t + 0.3); o.start(t); o.stop(t + 0.3); } else if (type === 'error') { o.frequency.value = 200; o.type = 'square'; g.gain.exponentialRampToValueAtTime(0.001, t + 0.25); o.start(t); o.stop(t + 0.25); } }

const LANG = {
  en: {
    title: 'Bio Heartbeat Mesh', subtitle: 'Heartbeat-synchronized mesh network',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Heartbeat Mesh \u2014 Synchronized Network',
    mainDesc: 'Heartbeat-synchronized mesh network with auto-discovery and BPM sync',
    sectionA: 'A \u2014 How It Works', sectionC: 'C \u2014 Challenges',
    btn1: 'Start Mesh', btn1Stop: 'Stop', btn2: 'Add Node', btn3: 'Force Sync', btn4: 'Reset',
    stat1: 'nodes', stat2: 'links', stat3: '% sync', stat4: 'avg BPM',
    step1Title: 'Heart Sensor', step1Desc: 'Pulse sensor detects heartbeat via PPG on the fingertip.',
    step2Title: 'Mesh Discovery', step2Desc: 'Each node broadcasts BPM. Nearby nodes auto-connect.',
    step3Title: 'BPM Sync', step3Desc: 'Nodes gradually adjust BPM toward neighbors.',
    step4Title: 'Network Health', step4Desc: 'Sync percentage shows harmony level.',
    ch1Title: 'Heart Harmony', ch1Desc: 'Get 5 nodes to 95% sync.',
    ch2Title: 'Maximum Mesh', ch2Desc: 'Add as many nodes as possible.',
    ch3Title: 'Heart Orchestra', ch3Desc: 'Create sequential beating patterns.',
    faq_q1: 'How does heartbeat sync work?', faq_a1: 'Nodes adjust BPM toward neighbors, like fireflies synchronizing.',
    faq_q2: 'What is PPG?', faq_a2: 'Photoplethysmography detects blood volume changes via light sensor.',
    howto_1: 'Click Start Mesh to initialize with 3 nodes.', howto_2: 'Add nodes and watch auto-linking.',
    howto_3: 'Use Force Sync to instantly align BPMs.',
    wiki1_title: '\u2764 Heartbeat Sensing', wiki1_text: 'PPG sensors measure light absorption changes as blood flows.',
    wiki2_title: '\ud83c\udf10 Mesh Networks', wiki2_text: 'Decentralized networks with self-healing topology.',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    settings: '\u2699\ufe0f Settings', language: 'Language', theme: 'Theme',
    help: '\u2753 Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Sound effects', breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    splashHint: 'tap to skip', working: 'Working\u2026',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad',
    t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '\u2764 Bio Heartbeat Mesh ready \u2014 connect to sync!',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    langChanged: '\ud83c\udf10 Language \u2192 English', themeChanged: '\ud83c\udfa8 Theme \u2192',
  ,faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick from 8 themes.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.'},
  fr: {
    title: 'Bio R\u00e9seau Cardiaque', subtitle: 'R\u00e9seau maill\u00e9 synchronis\u00e9 au c\u0153ur',
    disconnected: 'D\u00e9connect\u00e9', connected: 'Connect\u00e9',
    mainSection: 'R\u00e9seau Cardiaque \u2014 Synchronisation',
    mainDesc: 'R\u00e9seau maill\u00e9 synchronis\u00e9 avec d\u00e9couverte automatique et sync BPM',
    sectionA: 'A \u2014 Comment \u00e7a marche', sectionC: 'C \u2014 D\u00e9fis',
    btn1: 'D\u00e9marrer', btn1Stop: 'Arr\u00eat', btn2: 'Ajouter N\u0153ud', btn3: 'Forcer Sync', btn4: 'R\u00e9initialiser',
    stat1: 'n\u0153uds', stat2: 'liens', stat3: '% sync', stat4: 'BPM moy',
    step1Title: 'Capteur Cardiaque', step1Desc: 'Capteur de pouls par PPG sur le doigt.',
    step2Title: 'D\u00e9couverte Maill\u00e9e', step2Desc: 'Chaque n\u0153ud diffuse son BPM. Connexion auto.',
    step3Title: 'Sync BPM', step3Desc: 'Ajustement graduel vers les voisins.',
    step4Title: 'Sant\u00e9 R\u00e9seau', step4Desc: 'Pourcentage de synchronisation.',
    ch1Title: 'Harmonie Cardiaque', ch1Desc: '5 n\u0153uds \u00e0 95% de sync.',
    ch2Title: 'Maille Maximum', ch2Desc: 'Ajoutez le plus de n\u0153uds possible.',
    ch3Title: 'Orchestre Cardiaque', ch3Desc: 'Cr\u00e9ez des battements s\u00e9quentiels.',
    faq_q1: 'Comment fonctionne la sync?', faq_a1: 'Ajustement vers la moyenne des voisins.',
    faq_q2: 'Qu\'est-ce que le PPG?', faq_a2: 'Photoppl\u00e9thysmographie par capteur lumineux.',
    howto_1: 'Cliquez D\u00e9marrer pour 3 n\u0153uds.', howto_2: 'Ajoutez des n\u0153uds et observez.',
    howto_3: 'Forcez la synchronisation instantan\u00e9e.',
    wiki1_title: '\u2764 Capteur PPG', wiki1_text: 'Mesure les variations d\'absorption lumineuse du sang.',
    wiki2_title: '\ud83c\udf10 R\u00e9seaux Maill\u00e9s', wiki2_text: 'R\u00e9seaux d\u00e9centralis\u00e9s auto-r\u00e9parateurs.',
    activityLog: 'Journal', eventsMsg: '\u00c9v\u00e9nements',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    settings: '\u2699\ufe0f Param\u00e8tres', language: 'Langue', theme: 'Th\u00e8me',
    help: '\u2753 Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    soundEffects: '\ud83d\udd0a Sons', breathingGuide: 'Respiration', dhikrTap: 'Tap', musicMode: 'Musique',
    splashHint: 'appuyer', working: 'En cours\u2026',
    t_mosque: 'Mosqu\u00e9e', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad',
    t_medina: 'M\u00e9dina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: '\u2764 R\u00e9seau cardiaque pr\u00eat!',
    logCleared: 'Effac\u00e9', copied: 'Copi\u00e9!', copyFail: '\u00c9chec',
    langChanged: '\ud83c\udf10 Langue \u2192 Fran\u00e7ais', themeChanged: '\ud83c\udfa8 Th\u00e8me \u2192',
  ,faq_q3:'Puis-je changer le th\u00e8me?',faq_a3:'Oui! Ouvre les Param\u00e8tres et choisis parmi 8 th\u00e8mes.',faq_q4:'Mes donn\u00e9es sont-elles priv\u00e9es?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.'},
  ar: {
    title: '\u0634\u0628\u0643\u0629 \u0646\u0628\u0636 \u0627\u0644\u0642\u0644\u0628', subtitle: '\u0634\u0628\u0643\u0629 \u0645\u062a\u0632\u0627\u0645\u0646\u0629 \u0645\u0639 \u0646\u0628\u0636 \u0627\u0644\u0642\u0644\u0628',
    disconnected: '\u063a\u064a\u0631 \u0645\u062a\u0635\u0644', connected: '\u0645\u062a\u0635\u0644',
    mainSection: '\u0634\u0628\u0643\u0629 \u0627\u0644\u0646\u0628\u0636 \u2014 \u0634\u0628\u0643\u0629 \u0645\u062a\u0632\u0627\u0645\u0646\u0629',
    mainDesc: '\u0634\u0628\u0643\u0629 \u0645\u062a\u0632\u0627\u0645\u0646\u0629 \u0645\u0639 \u0627\u0643\u062a\u0634\u0627\u0641 \u062a\u0644\u0642\u0627\u0626\u064a',
    sectionA: '\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644', sectionC: '\u062c \u2014 \u0627\u0644\u062a\u062d\u062f\u064a\u0627\u062a',
    btn1: '\u0628\u062f\u0621', btn1Stop: '\u0625\u064a\u0642\u0627\u0641', btn2: '\u0625\u0636\u0627\u0641\u0629 \u0639\u0642\u062f\u0629', btn3: '\u0645\u0632\u0627\u0645\u0646\u0629', btn4: '\u0625\u0639\u0627\u062f\u0629',
    stat1: '\u0639\u0642\u062f', stat2: '\u0631\u0648\u0627\u0628\u0637', stat3: '% \u062a\u0632\u0627\u0645\u0646', stat4: 'BPM',
    step1Title: '\u0645\u0633\u062a\u0634\u0639\u0631 \u0627\u0644\u0642\u0644\u0628', step1Desc: '\u0645\u0633\u062a\u0634\u0639\u0631 \u0627\u0644\u0646\u0628\u0636 \u0639\u0628\u0631 PPG.',
    step2Title: '\u0627\u0643\u062a\u0634\u0627\u0641 \u0627\u0644\u0634\u0628\u0643\u0629', step2Desc: '\u0643\u0644 \u0639\u0642\u062f\u0629 \u062a\u0628\u062b BPM. \u0627\u062a\u0635\u0627\u0644 \u062a\u0644\u0642\u0627\u0626\u064a.',
    step3Title: '\u0645\u0632\u0627\u0645\u0646\u0629 BPM', step3Desc: '\u0627\u0644\u0639\u0642\u062f \u062a\u0636\u0628\u0637 \u0645\u0639\u062f\u0644\u0647\u0627 \u0646\u062d\u0648 \u0627\u0644\u062c\u064a\u0631\u0627\u0646.',
    step4Title: '\u0635\u062d\u0629 \u0627\u0644\u0634\u0628\u0643\u0629', step4Desc: '\u0646\u0633\u0628\u0629 \u0627\u0644\u062a\u0632\u0627\u0645\u0646.',
    ch1Title: '\u062a\u0646\u0627\u063a\u0645 \u0627\u0644\u0642\u0644\u0648\u0628', ch1Desc: '5 \u0639\u0642\u062f \u0628\u062a\u0632\u0627\u0645\u0646 95%.',
    ch2Title: '\u0623\u0642\u0635\u0649 \u0634\u0628\u0643\u0629', ch2Desc: '\u0623\u0636\u0641 \u0623\u0643\u062b\u0631 \u0639\u062f\u062f \u0645\u0645\u0643\u0646.',
    ch3Title: '\u0623\u0648\u0631\u0643\u0633\u062a\u0631\u0627 \u0627\u0644\u0642\u0644\u0628', ch3Desc: '\u0623\u0646\u0634\u0626 \u0623\u0646\u0645\u0627\u0637 \u062a\u062a\u0627\u0628\u0639\u064a\u0629.',
    faq_q1: '\u0643\u064a\u0641 \u062a\u0639\u0645\u0644 \u0627\u0644\u0645\u0632\u0627\u0645\u0646\u0629\u061f', faq_a1: '\u0627\u0644\u0639\u0642\u062f \u062a\u0636\u0628\u0637 \u0646\u062d\u0648 \u0645\u062a\u0648\u0633\u0637 \u0627\u0644\u062c\u064a\u0631\u0627\u0646.',
    faq_q2: '\u0645\u0627 \u0647\u0648 PPG\u061f', faq_a2: '\u0642\u064a\u0627\u0633 \u062a\u063a\u064a\u0631\u0627\u062a \u062d\u062c\u0645 \u0627\u0644\u062f\u0645 \u0628\u0627\u0644\u0636\u0648\u0621.',
    howto_1: '\u0627\u0646\u0642\u0631 \u0628\u062f\u0621 \u0644\u0625\u0646\u0634\u0627\u0621 3 \u0639\u0642\u062f.', howto_2: '\u0623\u0636\u0641 \u0639\u0642\u062f\u064b\u0627 \u0648\u0634\u0627\u0647\u062f.',
    howto_3: '\u0627\u0633\u062a\u062e\u062f\u0645 \u0627\u0644\u0645\u0632\u0627\u0645\u0646\u0629 \u0627\u0644\u0641\u0648\u0631\u064a\u0629.',
    wiki1_title: '\u2764 PPG', wiki1_text: '\u0642\u064a\u0627\u0633 \u0627\u0645\u062a\u0635\u0627\u0635 \u0627\u0644\u0636\u0648\u0621 \u0623\u062b\u0646\u0627\u0621 \u062a\u062f\u0641\u0642 \u0627\u0644\u062f\u0645.',
    wiki2_title: '\ud83c\udf10 \u0634\u0628\u0643\u0627\u062a', wiki2_text: '\u0634\u0628\u0643\u0627\u062a \u0644\u0627\u0645\u0631\u0643\u0632\u064a\u0629 \u0630\u0627\u062a\u064a\u0629 \u0627\u0644\u0625\u0635\u0644\u0627\u062d.',
    activityLog: '\u0633\u062c\u0644', eventsMsg: '\u0623\u062d\u062f\u0627\u062b',
    clear: '\u0645\u0633\u062d', copy: '\u0646\u0633\u062e', export: '\u062a\u0635\u062f\u064a\u0631', filterAll: '\u0627\u0644\u0643\u0644',
    settings: '\u2699\ufe0f \u0625\u0639\u062f\u0627\u062f\u0627\u062a', language: '\u0644\u063a\u0629', theme: '\u0645\u0638\u0647\u0631',
    help: '\u2753 \u0645\u0633\u0627\u0639\u062f\u0629', faq: '\u0623\u0633\u0626\u0644\u0629', howto: '\u062f\u0644\u064a\u0644', wiki: '\u0648\u064a\u0643\u064a',
    soundEffects: '\ud83d\udd0a \u0635\u0648\u062a', breathingGuide: '\u062a\u0646\u0641\u0633', dhikrTap: '\u0627\u0636\u063a\u0637', musicMode: '\u0645\u0648\u0633\u064a\u0642\u0649',
    splashHint: '\u0627\u0646\u0642\u0631', working: '\u062c\u0627\u0631\u064d\u2026',
    t_mosque: '\u0645\u0633\u062c\u062f', t_zellige: '\u0632\u0644\u064a\u062c', t_andalus: '\u0623\u0646\u062f\u0644\u0633', t_riad: '\u0631\u064a\u0627\u0636',
    t_medina: '\u0645\u062f\u064a\u0646\u0629', t_space: '\u0641\u0636\u0627\u0621', t_jungle: '\u0623\u062f\u063a\u0627\u0644', t_robot: '\u0631\u0648\u0628\u0648\u062a',
    ready: '\u2764 \u0634\u0628\u0643\u0629 \u0627\u0644\u0646\u0628\u0636 \u062c\u0627\u0647\u0632\u0629!',
    logCleared: '\u062a\u0645 \u0627\u0644\u0645\u0633\u062d', copied: '\u062a\u0645!', copyFail: '\u0641\u0634\u0644',
    langChanged: '\ud83c\udf10 \u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629', themeChanged: '\ud83c\udfa8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
  ,faq_q3:'\u0647\u0644 \u064a\u0645\u0643\u0646\u0646\u064a \u062a\u063a\u064a\u064a\u0631 \u0627\u0644\u0633\u0645\u0629\u061f',faq_a3:'\u0646\u0639\u0645! \u0627\u0641\u062a\u062d \u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0648\u0627\u062e\u062a\u0631.',faq_q4:'\u0647\u0644 \u0628\u064a\u0627\u0646\u0627\u062a\u064a \u062e\u0627\u0635\u0629\u061f',faq_a4:'\u0646\u0639\u0645. \u0643\u0644 \u0634\u064a\u0621 \u064a\u0639\u0645\u0644 \u0645\u062d\u0644\u064a\u0627\u064b.'}
};

/* ═══════ FRAMEWORK ═══════ */
let currentLang = 'en';
function setLanguage(l) { currentLang = l; const s = LANG[l]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(e => { const k = e.dataset.i18n; if (s[k] != null) e.textContent = s[k]; }); document.title = `${s.title} \u2014 Workshop DIY`; document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = l; const sel = $('langSelect'); if (sel) sel.value = l; try { localStorage.setItem('wdiy-lang', l); } catch {} log(s.langChanged, 'info'); }
function setTheme(n) { document.documentElement.dataset.theme = n; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n)); const sel = $('themeSelect'); if (sel) sel.value = n; try { localStorage.setItem('wdiy-theme', n); } catch {} const s = LANG[currentLang]; log(`${s.themeChanged} ${s['t_' + n] || n}`, 'info'); }
let logContainer; const logHistory = [];
function log(m, t = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${t}`; d.textContent = `[${new Date().toLocaleTimeString()}] ${m}`; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (t === 'success') playSound('success'); else if (t === 'error') playSound('error'); logHistory.push({ m, t, ts: Date.now() }); applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const b = new Blob([Array.from(logContainer.children).map(d => d.textContent).join('\n')], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'heartbeat-mesh-log.txt'; a.click(); }
let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(b => { b.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(x => x.classList.remove('active')); b.classList.add('active'); activeLogFilter = b.dataset.filter; applyLogFilter(); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = activeLogFilter === 'all' || l.classList.contains(activeLogFilter) ? '' : 'none'; }); }
let toastTimer = null;
function showToast(m, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = m; el.style.display = 'block'; } if (toastTimer) clearTimeout(toastTimer); if (ms > 0) toastTimer = setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(c) { const p = $('statusPill'), t = $('statusText'), s = LANG[currentLang]; if (t) t.textContent = c ? s.connected : s.disconnected; if (p) p.classList.toggle('connected', c); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }
function calcHijriDate() { try { return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch { return ''; } }
function openPanel(p, o) { const s = $(p), v = $(o); if (s) s.classList.add('open'); if (v) v.classList.add('open'); }
function closePanel(p, o, r) { const s = $(p), v = $(o); if (s) s.classList.remove('open'); if (v) v.classList.remove('open'); const b = $(r); if (b) b.focus(); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay', 'helpBtn'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay', 'settingsBtn'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function initHelpTabs() { document.querySelectorAll('.help-tab').forEach(t => { t.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(x => x.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); t.classList.add('active'); const id = 'help' + t.dataset.tab.charAt(0).toUpperCase() + t.dataset.tab.slice(1); const tgt = $(id); if (tgt) tgt.classList.add('active'); }); }); }
function initLogResize() { const h = $('logResizeHandle'), p = $('logPanel'); if (!h || !p) return; let d = false, sx, sw; h.addEventListener('mousedown', e => { d = true; sx = e.clientX; sw = p.offsetWidth; e.preventDefault(); }); document.addEventListener('mousemove', e => { if (!d) return; const dx = document.documentElement.dir === 'rtl' ? (e.clientX - sx) : (sx - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(sw + dx, innerWidth * 0.6)) + 'px'); }); document.addEventListener('mouseup', () => { d = false; }); }
let breathingActive = false;
function toggleBreathing() { breathingActive = !breathingActive; document.querySelectorAll('.deco-band').forEach(b => b.classList.toggle('breathing', breathingActive)); }
function incrementDhikr() { const c = $('dhikrCounter'); if (c) c.textContent = parseInt(c.textContent || '0') + 1; }
let matrixRunning = false, matrixAnim = null;
const ARABIC_CHARS = '\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630';
function toggleMatrix() { const c = $('matrixCanvas'); if (!c) return; if (matrixRunning) { matrixRunning = false; cancelAnimationFrame(matrixAnim); c.classList.remove('active'); return; } matrixRunning = true; c.classList.add('active'); const ctx = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight; const cols = Math.floor(c.width / 16), drops = Array(cols).fill(1); function draw() { if (!matrixRunning) return; ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(0, 0, c.width, c.height); ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#33ff33'; ctx.font = '14px Amiri'; for (let i = 0; i < drops.length; i++) { ctx.fillText(ARABIC_CHARS[Math.floor(Math.random() * ARABIC_CHARS.length)], i * 16, drops[i] * 16); if (drops[i] * 16 > c.height && Math.random() > 0.975) drops[i] = 0; drops[i]++; } matrixAnim = requestAnimationFrame(draw); } draw(); }

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ HEARTBEAT MESH SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════════════ */

let running = false, nodes = [], links = [];
const NODE_COLORS = ['#ff3366', '#ff6633', '#33ff33', '#6699ff', '#ffcc00', '#ff33cc', '#33ffcc', '#9966ff', '#ff9933', '#66ff33'];

function addNode() {
  const canvas = $('meshCanvas');
  const W = canvas ? canvas.width : 760, H = canvas ? canvas.height : 340;
  const n = { x: 60 + Math.random() * (W - 120), y: 60 + Math.random() * (H - 120), bpm: 55 + Math.random() * 40, phase: Math.random() * Math.PI * 2, r: 16, name: `Node${nodes.length + 1}`, color: NODE_COLORS[nodes.length % NODE_COLORS.length], history: [] };
  nodes.push(n);
  // Auto-link nearby nodes
  nodes.forEach((o, i) => {
    if (o === n) return;
    const d = Math.hypot(o.x - n.x, o.y - n.y);
    if (d < 220) links.push({ a: nodes.length - 1, b: i, strength: 1 - d / 220 });
  });
  log(`${n.name} joined mesh (${Math.round(n.bpm)} BPM)`, 'success');
}

function initMeshApp() {
  const canvas = $('meshCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 760;
  canvas.height = 340;
  const W = canvas.width, H = canvas.height;
  let t = 0;

  // ECG-like heartbeat trace
  function ecgWave(phase) {
    const p = ((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    const n = p / (Math.PI * 2);
    if (n < 0.05) return Math.sin(n / 0.05 * Math.PI) * 0.3;
    if (n < 0.1) return 0;
    if (n < 0.15) return -Math.sin((n - 0.1) / 0.05 * Math.PI) * 0.15;
    if (n < 0.2) return Math.sin((n - 0.15) / 0.05 * Math.PI) * 1.0; // R peak
    if (n < 0.25) return -Math.sin((n - 0.2) / 0.05 * Math.PI) * 0.25;
    if (n < 0.4) return Math.sin((n - 0.25) / 0.15 * Math.PI) * 0.15;
    return 0;
  }

  function frame() {
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(0, 0, W, H);
    t += 0.016;

    // Draw links with heartbeat pulse
    links.forEach(l => {
      const a = nodes[l.a], b = nodes[l.b];
      if (!a || !b) return;
      const beatA = ecgWave(a.phase);
      const pulse = Math.max(0, beatA);

      // Link line
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(255,51,102,${0.1 + pulse * 0.4})`;
      ctx.lineWidth = 1 + pulse * 3;
      ctx.stroke();

      // Sync packet traveling along link
      if (beatA > 0.8) {
        const progress = (t * 2) % 1;
        const mx = a.x + (b.x - a.x) * progress;
        const my = a.y + (b.y - a.y) * progress;
        ctx.beginPath();
        ctx.arc(mx, my, 3 + pulse * 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ff3366';
        ctx.fill();
      }
    });

    // Draw and update nodes
    nodes.forEach((n, ni) => {
      n.phase += 0.016 * n.bpm / 60 * Math.PI * 2;
      const beat = ecgWave(n.phase);
      const glow = Math.max(0, beat);

      // Store history for mini ECG
      n.history.push(beat);
      if (n.history.length > 60) n.history.shift();

      // Glow ring
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glow * 12, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,51,102,${0.05 + glow * 0.25})`;
      ctx.fill();

      // Node body
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      grad.addColorStop(0, n.color + 'cc');
      grad.addColorStop(1, n.color + '44');
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Mini ECG trace inside node
      ctx.save();
      ctx.beginPath();
      ctx.rect(n.x - n.r + 2, n.y - 6, (n.r - 2) * 2, 12);
      ctx.clip();
      ctx.beginPath();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      n.history.forEach((v, i) => {
        const hx = n.x - n.r + 2 + (i / 60) * (n.r * 2 - 4);
        const hy = n.y - v * 5;
        if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
      });
      ctx.stroke();
      ctx.restore();

      // Labels
      ctx.fillStyle = '#fff';
      ctx.font = '8px Orbitron';
      ctx.textAlign = 'center';
      ctx.fillText(n.name, n.x, n.y - n.r - 8);
      ctx.fillStyle = n.color;
      ctx.fillText(`${Math.round(n.bpm)} BPM`, n.x, n.y - n.r - 0);
      ctx.textAlign = 'left';

      // Gradually sync BPM to neighbors
      if (running) {
        links.forEach(l => {
          let other = null;
          if (nodes[l.a] === n) other = nodes[l.b];
          if (nodes[l.b] === n) other = nodes[l.a];
          if (other) n.bpm += (other.bpm - n.bpm) * 0.0008 * l.strength;
        });
      }
    });

    // Network info overlay
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(W - 170, 8, 162, 55);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px Orbitron';
    ctx.fillText(`Nodes: ${nodes.length}  Links: ${links.length}`, W - 162, 22);
    if (nodes.length > 1) {
      const bpms = nodes.map(n => n.bpm);
      const avg = bpms.reduce((a, b) => a + b) / bpms.length;
      const sync = Math.max(0, 100 - bpms.reduce((a, b) => a + Math.abs(b - avg), 0) / nodes.length * 2);
      ctx.fillText(`Avg BPM: ${Math.round(avg)}`, W - 162, 38);
      ctx.fillStyle = sync > 80 ? '#33ff33' : sync > 50 ? '#ffcc00' : '#ff3366';
      ctx.fillText(`Sync: ${Math.round(sync)}%`, W - 162, 54);
    }

    // Update stats
    const sn = $('statNodes'), sl = $('statLinks'), ss = $('statSync'), sa = $('statAvgBPM');
    if (sn) sn.textContent = nodes.length;
    if (sl) sl.textContent = links.length;
    if (nodes.length > 1) {
      const bpms = nodes.map(n => n.bpm);
      const avg = bpms.reduce((a, b) => a + b) / bpms.length;
      const sync = Math.max(0, 100 - bpms.reduce((a, b) => a + Math.abs(b - avg), 0) / nodes.length * 2);
      if (ss) ss.textContent = Math.round(sync);
      if (sa) sa.textContent = Math.round(avg);
      const sf = $('syncFill'), slbl = $('syncLabel');
      if (sf) sf.style.width = sync + '%';
      if (slbl) slbl.textContent = `${Math.round(sync)}% sync \u2014 ${Math.round(avg)} BPM avg`;
    }

    requestAnimationFrame(frame);
  }
  frame();

  // Drag nodes
  let dragNode = null;
  canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    const my = (e.clientY - rect.top) * (H / rect.height);
    dragNode = nodes.find(n => Math.hypot(n.x - mx, n.y - my) < n.r + 5);
  });
  canvas.addEventListener('mousemove', e => {
    if (!dragNode) return;
    const rect = canvas.getBoundingClientRect();
    dragNode.x = Math.max(20, Math.min(W - 20, (e.clientX - rect.left) * (W / rect.width)));
    dragNode.y = Math.max(20, Math.min(H - 20, (e.clientY - rect.top) * (H / rect.height)));
  });
  canvas.addEventListener('mouseup', () => { dragNode = null; });

  // Controls
  const startBtn = $('startBtn'), addBtnEl = $('addBtn'), syncBtnEl = $('syncBtn'), resetBtnEl = $('resetBtn');

  if (startBtn) startBtn.onclick = () => {
    running = !running;
    setStatus(running);
    if (running && nodes.length === 0) { for (let i = 0; i < 3; i++) addNode(); }
    const span = startBtn.querySelector('[data-i18n]');
    if (span) span.textContent = running ? LANG[currentLang].btn1Stop : LANG[currentLang].btn1;
    log(running ? '\u2764 Mesh network started' : 'Mesh stopped', 'info');
  };

  if (addBtnEl) addBtnEl.onclick = () => {
    addNode();
    playSound('click');
  };

  if (syncBtnEl) syncBtnEl.onclick = () => {
    if (nodes.length === 0) { log('No nodes to sync', 'error'); return; }
    const target = nodes[0].bpm;
    nodes.forEach(n => n.bpm = target + (Math.random() - 0.5) * 2);
    log(`\u2764 Force sync to ${Math.round(target)} BPM`, 'success');
    showToast('Synchronized!', 1200);
  };

  if (resetBtnEl) resetBtnEl.onclick = () => {
    nodes = []; links = [];
    running = false;
    setStatus(false);
    const span = startBtn?.querySelector('[data-i18n]');
    if (span) span.textContent = LANG[currentLang].btn1;
    log('Mesh reset', 'info');
  };
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  const cb = $('clearLogBtn'), cpb = $('copyLogBtn'), exb = $('exportLogBtn');
  if (cb) cb.onclick = clearLog; if (cpb) cpb.onclick = copyLog; if (exb) exb.onclick = exportLog;
  initLogFilters();
  const hBtn = $('helpBtn'), hC = $('helpCloseBtn'), hO = $('helpOverlay');
  if (hBtn) hBtn.onclick = openHelp; if (hC) hC.onclick = closeHelp; if (hO) hO.onclick = closeHelp;
  initHelpTabs();
  const sBtn = $('settingsBtn'), sC = $('settingsCloseBtn'), sO = $('settingsOverlay');
  if (sBtn) sBtn.onclick = openSettings; if (sC) sC.onclick = closeSettings; if (sO) sO.onclick = closeSettings;
  const lBtn = $('logBtn'), lC = $('logCloseBtn');
  if (lBtn) lBtn.onclick = toggleLog; if (lC) lC.onclick = closeLog;
  initLogResize();
  const st = $('soundToggle');
  if (st) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} st.checked = soundEnabled; st.onchange = () => { soundEnabled = st.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }; }
  const bb = $('breathingBtn'), dd = $('dhikrDisplay'), db = $('dhikrBtn');
  if (bb) bb.onclick = () => { toggleBreathing(); if (dd) dd.style.display = breathingActive ? 'flex' : 'none'; };
  if (db) db.onclick = incrementDhikr;
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeHelp(); closeSettings(); closeLog(); } });
  const ls = $('langSelect'); if (ls) ls.onchange = () => setLanguage(ls.value);
  const ts = $('themeSelect'); if (ts) ts.onchange = () => setTheme(ts.value);
  try { const sl = localStorage.getItem('wdiy-lang'), st2 = localStorage.getItem('wdiy-theme'); if (st2) setTheme(st2); if (sl) setLanguage(sl); } catch {}
  const hd = $('hijriDate'); if (hd) { const h = calcHijriDate(); if (h) hd.textContent = h; }
  let lc = 0, lt = null; const logo = $('logoWrap');
  if (logo) { logo.style.cursor = 'pointer'; logo.onclick = () => { lc++; if (lt) clearTimeout(lt); if (lc >= 3) { lc = 0; toggleMatrix(); } else lt = setTimeout(() => lc = 0, 500); }; }
  log(LANG[currentLang].ready, 'success');
  setTimeout(initMeshApp, 50);
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ HEARTBEAT MESH ADVANCED CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootMeshViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(255,51,102,.12);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- mesh node definitions --- */
    var COLORS=['#ff3366','#ff6633','#33ff33','#6699ff','#ffcc00','#ff33cc','#33ffcc','#9966ff','#ff9933','#66ff33'];
    var vizNodes=[],vizLinks=[];

    function addVizNode(){
      var n={
        x:80+Math.random()*(W*0.55-160),
        y:80+Math.random()*(H*0.55-100),
        bpm:55+Math.random()*40,
        phase:Math.random()*Math.PI*2,
        color:COLORS[vizNodes.length%COLORS.length],
        name:'N'+(vizNodes.length+1),
        history:[],
        pulseAlpha:0
      };
      vizNodes.push(n);
      /* auto-link */
      vizNodes.forEach(function(o,i){
        if(o===n)return;
        var d=Math.hypot(o.x-n.x,o.y-n.y);
        if(d<200)vizLinks.push({a:vizNodes.length-1,b:i,strength:1-d/200});
      });
    }
    /* initialize with 5 nodes */
    for(var ni=0;ni<5;ni++)addVizNode();

    /* ECG-like waveform */
    function ecg(phase){
      var p=((phase%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
      var n2=p/(Math.PI*2);
      if(n2<0.05)return Math.sin(n2/0.05*Math.PI)*0.3;
      if(n2<0.1)return 0;
      if(n2<0.15)return -Math.sin((n2-0.1)/0.05*Math.PI)*0.15;
      if(n2<0.2)return Math.sin((n2-0.15)/0.05*Math.PI)*1.0;
      if(n2<0.25)return -Math.sin((n2-0.2)/0.05*Math.PI)*0.25;
      if(n2<0.4)return Math.sin((n2-0.25)/0.15*Math.PI)*0.15;
      return 0;
    }

    /* --- sync metrics --- */
    var syncHistory=[];var MAX_SYNC=200;
    var hrHistory=[];var MAX_HR=200;
    var networkEntropy=0;

    /* --- draw ECG strip for a node --- */
    function drawECGStrip(ox,oy,w,h,node,idx){
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(ox,oy,w,h);
      ctx.strokeStyle=node.color+'44';ctx.strokeRect(ox,oy,w,h);

      if(node.history.length>1){
        ctx.beginPath();ctx.strokeStyle=node.color;ctx.lineWidth=1.5;
        node.history.forEach(function(v,i){
          var x=ox+(i/60)*w;
          var y=oy+h/2-v*h*0.35;
          if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        });
        ctx.stroke();
      }
      ctx.fillStyle=node.color;ctx.font='7px Orbitron,monospace';
      ctx.fillText(node.name+' '+Math.round(node.bpm)+'BPM',ox+3,oy+10);
    }

    /* --- draw network topology graph --- */
    function drawTopology(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(ox,oy,w,h);

      /* links */
      vizLinks.forEach(function(l){
        var a=vizNodes[l.a],b2=vizNodes[l.b];
        if(!a||!b2)return;
        var beatA=ecg(a.phase);
        var pulse=Math.max(0,beatA);
        /* scale positions to viewport */
        var ax=ox+a.x/(W*0.55)*w,ay=oy+a.y/(H*0.55)*h;
        var bx=ox+b2.x/(W*0.55)*w,by=oy+b2.y/(H*0.55)*h;

        ctx.beginPath();ctx.moveTo(ax,ay);ctx.lineTo(bx,by);
        ctx.strokeStyle='rgba(255,51,102,'+(0.08+pulse*0.3)+')';
        ctx.lineWidth=1+pulse*2;ctx.stroke();

        /* traveling packet */
        if(beatA>0.8){
          var prog=(t*2)%1;
          var mx=ax+(bx-ax)*prog,my=ay+(by-ay)*prog;
          ctx.beginPath();ctx.arc(mx,my,2+pulse*2,0,Math.PI*2);
          ctx.fillStyle='#ff3366';ctx.fill();
        }
      });

      /* nodes */
      vizNodes.forEach(function(n2){
        var beat=ecg(n2.phase);
        var glow=Math.max(0,beat);
        var nx=ox+n2.x/(W*0.55)*w,ny=oy+n2.y/(H*0.55)*h;

        /* glow */
        ctx.beginPath();ctx.arc(nx,ny,8+glow*8,0,Math.PI*2);
        ctx.fillStyle='rgba(255,51,102,'+(0.03+glow*0.15)+')';ctx.fill();

        /* body */
        var g=ctx.createRadialGradient(nx,ny,0,nx,ny,8);
        g.addColorStop(0,n2.color+'cc');g.addColorStop(1,n2.color+'44');
        ctx.beginPath();ctx.arc(nx,ny,8,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();

        ctx.fillStyle='#fff';ctx.font='6px Orbitron,monospace';ctx.textAlign='center';
        ctx.fillText(n2.name,nx,ny-12);
        ctx.fillStyle=n2.color;ctx.fillText(Math.round(n2.bpm),nx,ny+18);
        ctx.textAlign='left';
      });

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('MESH TOPOLOGY',ox+5,oy+12);
    }

    /* --- draw sync timeline --- */
    function drawSyncTimeline(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('SYNCHRONIZATION TIMELINE',ox+5,oy+12);

      if(syncHistory.length>1){
        ctx.beginPath();ctx.strokeStyle='#33ff33';ctx.lineWidth=1.5;
        syncHistory.forEach(function(v,i){
          var x=ox+(i/MAX_SYNC)*w;
          var y=oy+h-v/100*(h-20)-5;
          if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        });
        ctx.stroke();
        /* fill */
        ctx.beginPath();ctx.moveTo(ox,oy+h);
        syncHistory.forEach(function(v,i){ctx.lineTo(ox+(i/MAX_SYNC)*w,oy+h-v/100*(h-20)-5);});
        ctx.lineTo(ox+(syncHistory.length/MAX_SYNC)*w,oy+h);ctx.closePath();
        ctx.fillStyle='rgba(51,255,51,0.06)';ctx.fill();
      }

      /* threshold line */
      var thY=oy+h-95/100*(h-20)-5;
      ctx.strokeStyle='rgba(255,204,0,0.3)';ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(ox,thY);ctx.lineTo(ox+w,thY);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='rgba(255,204,0,0.4)';ctx.fillText('95%',ox+w-25,thY-3);
    }

    /* --- draw heart rate distribution --- */
    function drawHRDistribution(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('BPM DISTRIBUTION',ox+5,oy+12);

      /* histogram bins 40-120 BPM */
      var bins=new Array(20).fill(0);
      vizNodes.forEach(function(n2){
        var bin=Math.floor((n2.bpm-40)/4);
        if(bin>=0&&bin<20)bins[bin]++;
      });
      var maxBin=Math.max.apply(null,bins)||1;
      var binW=(w-20)/20;
      bins.forEach(function(v,i){
        var bh2=(v/maxBin)*(h-30);
        var hue=i/20*120;
        ctx.fillStyle='hsla('+hue+',70%,50%,0.6)';
        ctx.fillRect(ox+10+i*binW,oy+h-5-bh2,binW-1,bh2);
      });
      ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='6px Orbitron,monospace';
      ctx.fillText('40',ox+10,oy+h+6);ctx.fillText('120',ox+w-20,oy+h+6);
    }

    /* --- main frame --- */
    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.12)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      /* update all nodes */
      vizNodes.forEach(function(n2,ni2){
        n2.phase+=0.016*n2.bpm/60*Math.PI*2;
        var beat=ecg(n2.phase);
        n2.history.push(beat);if(n2.history.length>60)n2.history.shift();

        /* sync toward neighbors */
        vizLinks.forEach(function(l){
          var other=null;
          if(vizNodes[l.a]===n2)other=vizNodes[l.b];
          if(vizNodes[l.b]===n2)other=vizNodes[l.a];
          if(other)n2.bpm+=(other.bpm-n2.bpm)*0.0012*l.strength;
        });
      });

      /* compute sync */
      var sync2=0;
      if(vizNodes.length>1){
        var bpms2=vizNodes.map(function(n2){return n2.bpm;});
        var avg2=bpms2.reduce(function(a,b2){return a+b2;})/bpms2.length;
        sync2=Math.max(0,100-bpms2.reduce(function(a,b2){return a+Math.abs(b2-avg2);},0)/vizNodes.length*2);
      }
      syncHistory.push(sync2);if(syncHistory.length>MAX_SYNC)syncHistory.shift();

      /* ---- LAYOUT ---- */

      /* Top-left: Mesh topology */
      drawTopology(0,0,W*0.55,H*0.55);

      /* Top-right: ECG strips for each node */
      var ecgX=W*0.56,ecgW=W*0.44-5;
      var stripH=Math.min(50,(H*0.55)/Math.max(vizNodes.length,1)-2);
      vizNodes.forEach(function(n2,ni2){
        if(ni2*stripH>H*0.55-10)return;
        drawECGStrip(ecgX,ni2*(stripH+2),ecgW,stripH,n2,ni2);
      });

      /* Bottom-left: Sync timeline */
      drawSyncTimeline(0,H*0.56+5,W*0.55,H*0.20);

      /* Bottom-right: HR distribution */
      drawHRDistribution(W*0.56,H*0.56+5,W*0.44-5,H*0.20);

      /* Very bottom: Stats bar */
      var stY=H*0.78;
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(0,stY,W,H-stY);
      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText('MESH NETWORK STATISTICS',10,stY+14);

      var avg3=0;
      if(vizNodes.length>0){
        avg3=vizNodes.reduce(function(a,n2){return a+n2.bpm;},0)/vizNodes.length;
      }
      var stats3=[
        ['Nodes',vizNodes.length.toString()],
        ['Links',vizLinks.length.toString()],
        ['Sync',sync2.toFixed(0)+'%'],
        ['Avg BPM',avg3.toFixed(0)],
        ['Min BPM',vizNodes.length>0?Math.min.apply(null,vizNodes.map(function(n2){return n2.bpm;})).toFixed(0):'--'],
        ['Max BPM',vizNodes.length>0?Math.max.apply(null,vizNodes.map(function(n2){return n2.bpm;})).toFixed(0):'--'],
        ['Density',vizNodes.length>1?(2*vizLinks.length/(vizNodes.length*(vizNodes.length-1))*100).toFixed(0)+'%':'--'],
        ['Network',sync2>90?'HARMONY':sync2>60?'SYNCING':'DIVERGENT']
      ];
      stats3.forEach(function(s,si){
        var sx=10+(si%4)*W*0.24;
        var sy=stY+30+Math.floor(si/4)*16;
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
        ctx.fillText(s[0]+':',sx,sy);
        ctx.fillStyle=sync2>80?'#33ff33':sync2>50?'#ffcc00':'#ff3366';
        ctx.fillText(s[1],sx+70,sy);
      });

      /* pulse indicator at each node on beat */
      vizNodes.forEach(function(n2){
        var beat=ecg(n2.phase);
        if(beat>0.9){
          n2.pulseAlpha=1;
        }
        if(n2.pulseAlpha>0){
          n2.pulseAlpha-=0.02;
          var nx=n2.x/(W*0.55)*(W*0.55),ny=n2.y/(H*0.55)*(H*0.55);
          ctx.beginPath();ctx.arc(nx,ny,20+((1-n2.pulseAlpha)*25),0,Math.PI*2);
          ctx.strokeStyle='rgba(255,51,102,'+Math.max(0,n2.pulseAlpha*0.4).toFixed(2)+')';
          ctx.lineWidth=2;ctx.stroke();
        }
      });

      /* HUD corners */
      ctx.strokeStyle='rgba(255,51,102,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl3=18;ctx.strokeStyle='rgba(255,51,102,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl3);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl3,c[1]);ctx.stroke();
      });
      ctx.fillStyle='rgba(255,51,102,'+(0.4+Math.sin(t*4)*0.3)+')';
      ctx.beginPath();ctx.arc(W-20,14,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='8px Orbitron,monospace';ctx.fillText('MESH',W-60,17);

      requestAnimationFrame(frame);
    }

    /* click to add node */
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(W/rect.width);
      var my=(e.clientY-rect.top)*(H/rect.height);
      if(mx<W*0.55&&my<H*0.55&&vizNodes.length<12){
        var n3={
          x:mx/(W*0.55)*(W*0.55),y:my/(H*0.55)*(H*0.55),
          bpm:55+Math.random()*40,phase:Math.random()*Math.PI*2,
          color:COLORS[vizNodes.length%COLORS.length],name:'N'+(vizNodes.length+1),
          history:[],pulseAlpha:0
        };
        vizNodes.push(n3);
        vizNodes.forEach(function(o,i){
          if(o===n3)return;
          var d=Math.hypot(o.x-n3.x,o.y-n3.y);
          if(d<200)vizLinks.push({a:vizNodes.length-1,b:i,strength:1-d/200});
        });
      }
    });

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootMeshViz);
  else setTimeout(bootMeshViz,200);
})();
