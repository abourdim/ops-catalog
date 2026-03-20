/**
 * Plasma Antenna — Workshop DIY v1.0
 * Full canvas-based plasma antenna simulation with radiation patterns,
 * ionized gas visualization, and antenna metrics.
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><line x1="50" y1="90" x2="50" y2="10" stroke="currentColor" stroke-width="3" opacity=".5"><animate attributeName="opacity" values=".3;.8;.3" dur="1s" repeatCount="indefinite"/></line><circle cx="50" cy="30" r="5" fill="currentColor" opacity=".6"><animate attributeName="r" values="3;8;3" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="50" cy="50" r="3" fill="currentColor" opacity=".4"><animate attributeName="r" values="2;6;2" dur="1.2s" repeatCount="indefinite"/></circle><circle cx="50" cy="70" r="4" fill="currentColor" opacity=".5"><animate attributeName="r" values="3;7;3" dur="1.3s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES = ['riad', 'medina'];
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx();
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination); g.gain.value = 0.08;
  const t = audioCtx.currentTime;
  if (type === 'click') { o.frequency.value = 800; g.gain.exponentialRampToValueAtTime(0.001, t + .08); o.start(t); o.stop(t + .08); }
  else if (type === 'success') { o.frequency.value = 523; g.gain.exponentialRampToValueAtTime(0.001, t + .3); o.start(t); o.stop(t + .3); }
  else if (type === 'error') { o.frequency.value = 200; o.type = 'square'; g.gain.exponentialRampToValueAtTime(0.001, t + .25); o.start(t); o.stop(t + .25); }
}

const LANG = {
  en: {
    title: 'Plasma Antenna', subtitle: '⚡ Ionized gas RF elements',
    disconnected: 'Offline', connected: 'Ignited',
    mainSection: 'Plasma Antenna', mainDesc: 'Simulate reconfigurable plasma antenna with ionized gas columns',
    sectionA: 'Antenna Metrics', sectionB: 'Radiation Pattern', sectionC: 'Theory',
    activityLog: '📜 Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', theme: 'Theme',
    settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1: 'Select a plasma antenna configuration.', howto_2: 'Adjust ionization level and RF frequency.',
    howto_3: 'Click Ignite to activate the plasma antenna.', howto_4: 'View the radiation pattern in the analysis section.',
    wiki_plasma_title: '⚡ Plasma Physics', wiki_plasma: 'Plasma is the fourth state of matter with free electrons that conducts electricity.',
    wiki_rad_title: '📡 Radiation Patterns', wiki_rad: 'The 3D distribution of radiated power from an antenna.',
    working: 'Working…', filterAll: 'All', soundEffects: '🔊 Sound effects',
    ready: '⚡ Plasma Antenna ready!', logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    plasmaMode: 'Plasma Mode', ionLevel: 'Ionization Level', rfFreq: 'RF Frequency (MHz)',
    startSim: '▶ Ignite', stopSim: '⏹ Quench', resetSim: '↺ Reset',
    gain: 'Gain:', vswr: 'VSWR:', plasmaDensity: 'Plasma Density:', beamwidth: 'Beamwidth:',
    efficiency: 'Efficiency:', bandwidth: 'Bandwidth:',
    theoryIntro: 'Plasma antennas use ionized gas instead of metal for RF radiation:',
    theory1: 'Ionized gas columns act as conductive antenna elements',
    theory2: 'Plasma density controls the antenna operating frequency',
    theory3: 'When de-ionized, the antenna becomes invisible to radar',
    theory4: 'Reconfigurable patterns by controlling ionization profiles',
    theory5: 'Near-zero thermal noise when plasma is quenched',
    splashHint: 'tap to skip', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    simStarted: '⚡ Plasma ignited', simStopped: '⏹ Quenched', simReset: '↺ Reset',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad',
    t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates impossible physics! 🔬 You get to experiment with exotic physical phenomena in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real exotic physical phenomena so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real cutting-edge physics simulations! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Phys Sagnac Interferometer and Phys Metamaterial Simulator! Each teaches something different. 🚀'},
  fr: {
    title: 'Antenne Plasma', subtitle: '⚡ Éléments RF à gaz ionisé',
    disconnected: 'Hors ligne', connected: 'Allumé',
    mainSection: 'Antenne Plasma', mainDesc: 'Simuler une antenne plasma reconfigurable à colonnes de gaz ionisé',
    sectionA: 'Métriques d\'Antenne', sectionB: 'Diagramme de Rayonnement', sectionC: 'Théorie',
    activityLog: '📜 Journal', eventsMsg: 'Événements',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', theme: 'Thème',
    settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1: 'Sélectionnez une configuration.', howto_2: 'Ajustez l\'ionisation et la fréquence.',
    howto_3: 'Cliquez Allumer pour activer.', howto_4: 'Visualisez le diagramme de rayonnement.',
    wiki_plasma_title: '⚡ Physique du Plasma', wiki_plasma: 'Le plasma est le quatrième état de la matière.',
    wiki_rad_title: '📡 Diagrammes de Rayonnement', wiki_rad: 'Distribution 3D de puissance rayonnée.',
    working: 'En cours…', filterAll: 'Tout', soundEffects: '🔊 Effets sonores',
    ready: '⚡ Antenne Plasma prête !', logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    plasmaMode: 'Mode Plasma', ionLevel: 'Niveau d\'Ionisation', rfFreq: 'Fréquence RF (MHz)',
    startSim: '▶ Allumer', stopSim: '⏹ Éteindre', resetSim: '↺ Réinitialiser',
    gain: 'Gain :', vswr: 'VSWR :', plasmaDensity: 'Densité Plasma :', beamwidth: 'Ouverture :',
    efficiency: 'Efficacité :', bandwidth: 'Bande passante :',
    theoryIntro: 'Les antennes plasma utilisent du gaz ionisé pour le rayonnement RF :',
    theory1: 'Les colonnes de gaz ionisé agissent comme éléments d\'antenne conducteurs',
    theory2: 'La densité du plasma contrôle la fréquence de fonctionnement',
    theory3: 'Une fois désionisée, l\'antenne devient invisible au radar',
    theory4: 'Diagrammes reconfigurables par contrôle du profil d\'ionisation',
    theory5: 'Bruit thermique quasi nul quand le plasma est éteint',
    splashHint: 'appuyer pour passer', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    simStarted: '⚡ Plasma allumé', simStopped: '⏹ Éteint', simReset: '↺ Réinitialisé',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad',
    t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule impossible physics ! 🔬 Tu peux expérimenter avec exotic physical phenomena en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais exotic physical phenomena.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai cutting-edge physics simulations ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Phys Sagnac Interferometer and Phys Metamaterial Simulator ! Chacune enseigne quelque chose de différent. 🚀'},
  ar: {
    title: 'هوائي البلازما', subtitle: '⚡ عناصر RF الغاز المتأين',
    disconnected: 'غير متصل', connected: 'مشتعل',
    mainSection: 'هوائي البلازما', mainDesc: 'محاكاة هوائي بلازما قابل لإعادة التشكيل بأعمدة غاز متأين',
    sectionA: 'مقاييس الهوائي', sectionB: 'نمط الإشعاع', sectionC: 'النظرية',
    activityLog: '📜 سجل النشاط', eventsMsg: 'الأحداث',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', theme: 'المظهر',
    settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيفية الاستخدام', wiki: 'ويكي',
    howto_1: 'اختر تكوين الهوائي.', howto_2: 'اضبط مستوى التأين والتردد.',
    howto_3: 'اضغط إشعال لتفعيل الهوائي.', howto_4: 'شاهد نمط الإشعاع.',
    wiki_plasma_title: '⚡ فيزياء البلازما', wiki_plasma: 'البلازما هي الحالة الرابعة للمادة.',
    wiki_rad_title: '📡 أنماط الإشعاع', wiki_rad: 'التوزيع ثلاثي الأبعاد للطاقة المشعة.',
    working: 'جارٍ…', filterAll: 'الكل', soundEffects: '🔊 مؤثرات صوتية',
    ready: '⚡ هوائي البلازما جاهز!', logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل',
    plasmaMode: 'وضع البلازما', ionLevel: 'مستوى التأين', rfFreq: 'تردد RF (MHz)',
    startSim: '▶ إشعال', stopSim: '⏹ إطفاء', resetSim: '↺ إعادة',
    gain: 'الكسب:', vswr: 'VSWR:', plasmaDensity: 'كثافة البلازما:', beamwidth: 'عرض الشعاع:',
    efficiency: 'الكفاءة:', bandwidth: 'عرض النطاق:',
    theoryIntro: 'هوائيات البلازما تستخدم الغاز المتأين للإشعاع الراديوي:',
    theory1: 'أعمدة الغاز المتأين تعمل كعناصر هوائي موصلة',
    theory2: 'كثافة البلازما تتحكم في تردد التشغيل',
    theory3: 'عند إزالة التأين يصبح الهوائي غير مرئي للرادار',
    theory4: 'أنماط قابلة لإعادة التشكيل بالتحكم في ملف التأين',
    theory5: 'ضوضاء حرارية شبه معدومة عند إطفاء البلازما',
    splashHint: 'انقر للتخطي', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    simStarted: '⚡ اشتعل البلازما', simStopped: '⏹ انطفأ', simReset: '↺ إعادة ضبط',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض',
    t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي impossible physics! 🔬 يمكنك التجربة مع exotic physical phenomena في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج exotic physical phenomena حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا cutting-edge physics simulations حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Phys Sagnac Interferometer and Phys Metamaterial Simulator! كل واحد يعلّم شيئاً مختلفاً. 🚀'}
};

let currentLang = 'en';
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; }); document.title = s.title + ' — Workshop DIY'; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
function setTheme(n) { document.documentElement.dataset.theme = n; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n)); const s = $('themeSelect'); if (s) s.value = n; try { localStorage.setItem('wdiy-theme', n); } catch {} log(LANG[currentLang].themeChanged + ' ' + (LANG[currentLang]['t_' + n] || n), 'info'); }

let logContainer;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = 'log-line ' + type; d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (type === 'success') playSound('success'); else if (type === 'error') playSound('error'); applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { const t = Array.from(($('logContainer')||{children:[]}).children).map(d => d.textContent).join('\n'); const b = new Blob([t], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'plasma-antenna-log.txt'; a.click(); URL.revokeObjectURL(u); }
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(c) { const t = $('statusText'), p = $('statusPill'), s = LANG[currentLang]; if (t) t.textContent = c ? s.connected : s.disconnected; if (p) p.classList.toggle('connected', c); }
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }
let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; }); }
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {} }
function openPanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.remove('open'); if (ov) ov.classList.remove('open'); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); } function closeHelp() { closePanel('helpPanel', 'helpOverlay'); }
function openSettings() { openPanel('settingsPanel', 'settingsOverlay'); } function closeSettings() { closePanel('settingsPanel', 'settingsOverlay'); }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function initHelpTabs() { document.querySelectorAll('.help-tab').forEach(tab => tab.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const id = 'help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1); const tgt = $(id); if (tgt) tgt.classList.add('active'); })); }

/* ═══════════════════════════════════════════════════════
   PLASMA ANTENNA — FULL CANVAS SIMULATION
   ═══════════════════════════════════════════════════════ */

let running = false, animFrame = null;
const plasmaParticles = [];
const rfWaves = [];
const MAX_PARTICLES = 600;

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  return { w: rect.width, h: rect.height, ctx };
}

/* Plasma tube visualization */
function drawPlasma(ctx, w, h, mode, ionLevel, time) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'; ctx.fillRect(0, 0, w, h);
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  const ion = ionLevel / 100;

  // Ground plane
  ctx.fillStyle = 'rgba(80, 80, 80, 0.3)';
  ctx.fillRect(0, h * 0.85, w, h * 0.15);
  ctx.strokeStyle = 'rgba(150, 150, 150, 0.3)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, h * 0.85); ctx.lineTo(w, h * 0.85); ctx.stroke();

  // Plasma tubes based on mode
  const tubes = [];
  switch (mode) {
    case 'monopole': tubes.push({ x: w / 2, yTop: h * 0.15, yBot: h * 0.85 }); break;
    case 'dipole': tubes.push({ x: w / 2, yTop: h * 0.1, yBot: h * 0.45 }); tubes.push({ x: w / 2, yTop: h * 0.55, yBot: h * 0.9 }); break;
    case 'array': for (let i = 0; i < 5; i++) tubes.push({ x: w * 0.2 + i * w * 0.15, yTop: h * 0.2, yBot: h * 0.85 }); break;
    case 'helix': tubes.push({ x: w / 2, yTop: h * 0.1, yBot: h * 0.85, helix: true }); break;
  }

  // Draw each tube
  for (const tube of tubes) {
    const tubeW = 12;
    // Glass tube
    ctx.strokeStyle = 'rgba(100, 150, 200, 0.2)'; ctx.lineWidth = tubeW + 4;
    ctx.beginPath(); ctx.moveTo(tube.x, tube.yTop); ctx.lineTo(tube.x, tube.yBot); ctx.stroke();

    if (tube.helix) {
      // Helical winding
      ctx.strokeStyle = `rgba(100, ${150 + ion * 105}, 255, ${0.3 + ion * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let y = tube.yTop; y < tube.yBot; y += 2) {
        const phase = y * 0.15 + time * 3;
        const x = tube.x + Math.cos(phase) * 20;
        if (y === tube.yTop) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Plasma glow inside tube
    const grad = ctx.createLinearGradient(tube.x - tubeW / 2, 0, tube.x + tubeW / 2, 0);
    const intensity = ion * (0.7 + Math.sin(time * 8) * 0.3);
    grad.addColorStop(0, `rgba(100, 50, 200, 0)`);
    grad.addColorStop(0.3, `rgba(100, 100, 255, ${intensity * 0.5})`);
    grad.addColorStop(0.5, `rgba(150, 100, 255, ${intensity * 0.8})`);
    grad.addColorStop(0.7, `rgba(100, 100, 255, ${intensity * 0.5})`);
    grad.addColorStop(1, `rgba(100, 50, 200, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(tube.x - tubeW, tube.yTop, tubeW * 2, tube.yBot - tube.yTop);

    // Plasma particles inside tube
    if (Math.random() < ion * 0.4) {
      const py = tube.yTop + Math.random() * (tube.yBot - tube.yTop);
      plasmaParticles.push({
        x: tube.x + (Math.random() - 0.5) * tubeW,
        y: py, vx: (Math.random() - 0.5) * 2, vy: -1 - Math.random() * 3,
        life: 1, decay: 0.02 + Math.random() * 0.03,
        hue: 220 + Math.random() * 60, size: 1 + Math.random() * 3
      });
    }
  }

  // Update and draw particles
  for (let i = plasmaParticles.length - 1; i >= 0; i--) {
    const p = plasmaParticles[i];
    p.x += p.vx; p.y += p.vy; p.life -= p.decay;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.life * 0.8})`;
    ctx.fill();
    if (p.life <= 0) plasmaParticles.splice(i, 1);
  }
  while (plasmaParticles.length > MAX_PARTICLES) plasmaParticles.shift();

  // RF radiation waves
  if (ion > 0.2) {
    for (const tube of tubes) {
      if (Math.random() < 0.05 * ion) {
        const angle = Math.random() * Math.PI * 2;
        rfWaves.push({ x: tube.x, y: (tube.yTop + tube.yBot) / 2, radius: 5, maxRadius: 150 + Math.random() * 100, speed: 1 + Math.random(), alpha: 0.5 });
      }
    }
  }

  for (let i = rfWaves.length - 1; i >= 0; i--) {
    const wave = rfWaves[i];
    wave.radius += wave.speed;
    wave.alpha = 0.5 * (1 - wave.radius / wave.maxRadius);
    if (wave.alpha > 0) {
      ctx.beginPath(); ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(100, 200, 255, ${wave.alpha})`; ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    if (wave.radius >= wave.maxRadius) rfWaves.splice(i, 1);
  }

  // HUD
  ctx.fillStyle = accent; ctx.font = '11px Orbitron, monospace';
  ctx.fillText('PLASMA ANTENNA', 10, 18);
  ctx.fillStyle = 'rgba(100, 200, 255, 0.6)'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('ION: ' + ionLevel + '%  MODE: ' + mode.toUpperCase(), 10, 34);
  ctx.fillText('Particles: ' + plasmaParticles.length, 10, 48);
}

/* Radiation pattern (polar plot) */
function drawPattern(ctx, w, h, mode, ionLevel, freq, time) {
  ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2, maxR = Math.min(w, h) * 0.4;
  const ion = ionLevel / 100;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Grid circles
  ctx.strokeStyle = '#1a2a3a'; ctx.lineWidth = 0.5;
  for (let r = 1; r <= 4; r++) {
    ctx.beginPath(); ctx.arc(cx, cy, maxR * r / 4, 0, Math.PI * 2); ctx.stroke();
  }
  // Grid lines
  for (let a = 0; a < 12; a++) {
    const ang = a * Math.PI / 6;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(ang) * maxR, cy + Math.sin(ang) * maxR); ctx.stroke();
  }

  // Radiation pattern
  ctx.strokeStyle = accent; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let a = 0; a <= 360; a++) {
    const ang = a * Math.PI / 180;
    let gain;
    switch (mode) {
      case 'monopole': gain = Math.abs(Math.cos(ang)) * ion; break;
      case 'dipole': gain = Math.pow(Math.sin(ang), 2) * ion; break;
      case 'array': gain = Math.pow(Math.cos(ang * 2.5), 2) * ion * (0.8 + Math.sin(time) * 0.2); break;
      case 'helix': gain = (0.5 + 0.5 * Math.cos(ang)) * ion; break;
      default: gain = 0.5 * ion;
    }
    const r = gain * maxR;
    const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r;
    if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath(); ctx.stroke();

  // Fill pattern area
  ctx.fillStyle = `rgba(100, 200, 255, 0.1)`;
  ctx.fill();

  // Labels
  ctx.fillStyle = '#6688aa'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('Radiation Pattern (' + mode + ')', 8, 14);
  ctx.fillText('0°', cx + maxR + 5, cy + 4);
  ctx.fillText('90°', cx - 8, cy - maxR - 5);
  ctx.fillText('180°', cx - maxR - 30, cy + 4);
}

/* Update metrics */
function updateMetrics(ionLevel, freq, mode) {
  const ion = ionLevel / 100;
  const baseGain = mode === 'array' ? 12 : mode === 'helix' ? 8 : mode === 'dipole' ? 5 : 3;
  const gain = (baseGain * ion + (Math.random() - 0.5) * 0.2).toFixed(1);
  const vswr = (1 + (1 - ion) * 2 + Math.random() * 0.1).toFixed(2);
  const density = (ion * 1e18).toExponential(2);
  const beamwidth = (360 / (mode === 'array' ? 5 : mode === 'helix' ? 3 : 2) * (1 - ion * 0.3)).toFixed(1);
  const eff = (ion * 85 + Math.random() * 5).toFixed(1);
  const bw = (freq * 0.1 * ion).toFixed(0);
  const g = $('gainVal'); if (g) g.textContent = gain + ' dBi';
  const v = $('vswrVal'); if (v) v.textContent = vswr + ':1';
  const d = $('densityVal'); if (d) d.textContent = density + ' /m³';
  const b = $('beamVal'); if (b) b.textContent = beamwidth + '°';
  const e = $('effVal'); if (e) e.textContent = eff + '%';
  const bwE = $('bwVal'); if (bwE) bwE.textContent = bw + ' MHz';
}

let simCtx, simW, simH, patCtx, patW, patH;
function simLoop() {
  if (!running) return;
  const time = performance.now() * 0.001;
  const mode = $('plasmaMode') ? $('plasmaMode').value : 'monopole';
  const ionLevel = $('ionSlider') ? +$('ionSlider').value : 50;
  const freq = $('rfSlider') ? +$('rfSlider').value : 900;

  if (simCtx) drawPlasma(simCtx, simW, simH, mode, ionLevel, time);
  if (patCtx) drawPattern(patCtx, patW, patH, mode, ionLevel, freq, time);
  if (Math.floor(time * 3) % 3 === 0) updateMetrics(ionLevel, freq, mode);

  animFrame = requestAnimationFrame(simLoop);
}

function startSim() {
  if (running) return; running = true; setStatus(true);
  const sc = $('simCanvas'), pc = $('patternCanvas');
  if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; }
  if (pc) { const r = resizeCanvas(pc); patCtx = r.ctx; patW = r.w; patH = r.h; }
  log(LANG[currentLang].simStarted, 'success'); simLoop();
}
function stopSim() { running = false; if (animFrame) cancelAnimationFrame(animFrame); setStatus(false); log(LANG[currentLang].simStopped, 'info'); }
function resetSim() {
  stopSim(); plasmaParticles.length = 0; rfWaves.length = 0;
  [$('simCanvas'), $('patternCanvas')].forEach(c => { if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height); });
  ['gainVal', 'vswrVal', 'densityVal', 'beamVal', 'effVal', 'bwVal'].forEach(id => { const e = $(id); if (e) e.textContent = '--'; });
  log(LANG[currentLang].simReset, 'info');
}

function init() {
  initSplash(); const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  $('clearLogBtn').onclick = clearLog; $('copyLogBtn').onclick = copyLog; $('exportLogBtn').onclick = exportLog;
  initLogFilters();
  $('helpBtn').onclick = openHelp; $('helpCloseBtn').onclick = closeHelp; $('helpOverlay').onclick = closeHelp;
  initHelpTabs();
  $('settingsBtn').onclick = openSettings; $('settingsCloseBtn').onclick = closeSettings; $('settingsOverlay').onclick = closeSettings;
  $('logBtn').onclick = toggleLog; $('logCloseBtn').onclick = closeLog;
  const st = $('soundToggle'); if (st) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} st.checked = soundEnabled; st.onchange = () => { soundEnabled = st.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }; }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeHelp(); closeSettings(); closeLog(); } });
  $('langSelect').onchange = function () { setLanguage(this.value); };
  $('themeSelect').onchange = function () { setTheme(this.value); };
  try { const sl = localStorage.getItem('wdiy-lang'), st2 = localStorage.getItem('wdiy-theme'); if (st2) setTheme(st2); if (sl) setLanguage(sl); } catch {}
  initHijriDate();
  $('startBtn').onclick = startSim; $('stopBtn').onclick = stopSim; $('resetBtn').onclick = resetSim;
  $('ionSlider').oninput = function () { $('ionVal').textContent = this.value + '%'; };
  $('rfSlider').oninput = function () { $('rfVal').textContent = this.value + ' MHz'; };
  window.addEventListener('resize', () => { if (running) { const sc = $('simCanvas'), pc = $('patternCanvas'); if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; } if (pc) { const r = resizeCanvas(pc); patCtx = r.ctx; patW = r.w; patH = r.h; } } });
  log(LANG[currentLang].ready, 'success');
}
document.addEventListener('DOMContentLoaded', init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Plasma Antenna
   Animated ionized gas column with radiation pattern,
   plasma density visualization, and RF coupling
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simPlasmaAntenna';let cv,cx,W,H,af=null,t=0;
  const plasmaParticles=[];const rfWaves=[];const MAX_PARTICLES=200;
  let ionLevel=70,rfFreq=150,antennaGain=0;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#04060e;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  function drawAntennaColumn(){
    const ax=W*0.25,ay=40,aw=30,ah=H-80;
    // Glass tube
    cx.strokeStyle='rgba(150,200,255,0.2)';cx.lineWidth=2;
    cx.beginPath();
    cx.roundRect(ax-aw/2,ay,aw,ah,8);cx.stroke();
    // Plasma glow
    const glowAlpha=ionLevel/100*0.3;
    const grad=cx.createLinearGradient(ax-aw/2,ay,ax+aw/2,ay);
    grad.addColorStop(0,'rgba(100,50,255,0)');
    grad.addColorStop(0.5,'rgba(150,100,255,'+glowAlpha+')');
    grad.addColorStop(1,'rgba(100,50,255,0)');
    cx.fillStyle=grad;
    cx.beginPath();cx.roundRect(ax-aw/2+2,ay+2,aw-4,ah-4,6);cx.fill();
    // Ionization level bar
    const barH=ah*(ionLevel/100);
    cx.fillStyle='rgba(150,100,255,'+(0.1+ionLevel/200)+')';
    cx.fillRect(ax-aw/2+4,ay+ah-barH-2,aw-8,barH);
    // Plasma particles inside tube
    for(let i=0;i<ionLevel/5;i++){
      const px2=ax+(Math.random()-.5)*(aw-10);
      const py=ay+5+Math.random()*(ah-10);
      cx.fillStyle='rgba(200,150,255,'+(0.2+Math.random()*0.3)+')';
      cx.beginPath();cx.arc(px2,py,1+Math.random(),0,Math.PI*2);cx.fill();
    }
    cx.fillStyle='rgba(150,100,255,0.4)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('PLASMA TUBE',ax,ay-8);
    cx.fillText(ionLevel+'% ionized',ax,ay+ah+12);
  }

  function drawRadiationPattern(){
    const pcx=W*0.55,pcy=H/2,pr=110;
    // Polar grid
    cx.strokeStyle='rgba(100,200,255,0.06)';cx.lineWidth=0.5;
    for(let r=pr*0.25;r<=pr;r+=pr*0.25){
      cx.beginPath();cx.arc(pcx,pcy,r,0,Math.PI*2);cx.stroke();
    }
    for(let a=0;a<Math.PI*2;a+=Math.PI/6){
      cx.beginPath();cx.moveTo(pcx,pcy);
      cx.lineTo(pcx+Math.cos(a)*pr,pcy+Math.sin(a)*pr);cx.stroke();
    }
    // Radiation pattern (dipole-like with gain)
    cx.fillStyle='rgba(150,100,255,0.15)';cx.beginPath();
    for(let a=0;a<Math.PI*2;a+=0.02){
      const gain2=Math.pow(Math.abs(Math.cos(a)),1.5)*(0.5+ionLevel/200);
      const r2=pr*gain2;
      const x=pcx+Math.cos(a)*r2;const y=pcy+Math.sin(a)*r2;
      if(a===0)cx.moveTo(x,y);else cx.lineTo(x,y);
    }
    cx.closePath();cx.fill();
    cx.strokeStyle='rgba(150,100,255,0.5)';cx.lineWidth=1.5;cx.stroke();
    // Animated RF emission
    for(let w=0;w<3;w++){
      const r2=(t*60+w*40)%pr;
      const alpha=0.1*(1-r2/pr);
      cx.strokeStyle='rgba(200,150,255,'+alpha+')';cx.lineWidth=1;
      cx.beginPath();cx.arc(pcx,pcy,r2,0,Math.PI*2);cx.stroke();
    }
    cx.fillStyle='rgba(150,100,255,0.3)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('RADIATION PATTERN',pcx,pcy-pr-8);
  }

  function drawFrequencyResponse(){
    const fx=W*0.78,fy=20,fw=W*0.2,fh=110;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(fx,fy,fw,fh);
    const bins=40;const binW=fw/bins;
    for(let i=0;i<bins;i++){
      const freq=i/bins;
      const plasmaFreq=ionLevel/100;
      const response=freq>plasmaFreq?1/(1+Math.pow((freq-0.6)*5,2)):0.05;
      const bh=response*fh*0.7+Math.random()*2;
      const hue=260+freq*40;
      cx.fillStyle='hsla('+hue+',60%,50%,'+(0.3+response*0.4)+')';
      cx.fillRect(fx+i*binW,fy+fh-bh,binW-0.5,bh);
    }
    // Plasma frequency cutoff line
    const cutoff=fx+ionLevel/100*fw;
    cx.strokeStyle='rgba(255,100,100,0.3)';cx.lineWidth=1;cx.setLineDash([3,3]);
    cx.beginPath();cx.moveTo(cutoff,fy);cx.lineTo(cutoff,fy+fh);cx.stroke();cx.setLineDash([]);
    cx.fillStyle='rgba(255,100,100,0.3)';cx.font='6px monospace';cx.fillText('f_p',cutoff+3,fy+10);
    cx.fillStyle='rgba(150,100,255,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('FREQUENCY RESPONSE',fx+8,fy+10);
  }

  function drawMetrics(){
    const mx=W*0.78,my=150,mw=W*0.2,mh=70;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(mx,my,mw,mh);
    antennaGain=2+ionLevel/20;
    cx.fillStyle='rgba(150,100,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('ANTENNA METRICS',mx+8,my+14);
    cx.fillStyle='#aaa';
    cx.fillText('Gain: '+antennaGain.toFixed(1)+' dBi',mx+8,my+30);
    cx.fillText('RF: '+rfFreq+' MHz',mx+8,my+44);
    cx.fillText('Ion: '+ionLevel+'%',mx+8,my+58);
  }

  function drawPlasmaPhysics(){
    const px=20,py=H-60,pw=W*0.45,ph=45;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(px,py,pw,ph);
    cx.fillStyle='rgba(150,100,255,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('Plasma Freq: f_p = 9*sqrt(n_e) Hz',px+8,py+14);
    cx.fillText('Above f_p: transparent | Below f_p: reflects',px+8,py+28);
    cx.fillText('Advantage: Reconfigurable, stealth when OFF',px+8,py+42);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,180,42);
    cx.strokeStyle='rgba(150,100,255,0.15)';cx.strokeRect(8,8,180,42);
    cx.font='10px monospace';cx.fillStyle='#8b5cf6';cx.textAlign='left';
    cx.fillText('PLASMA ANTENNA',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Ionized Gas RF Radiator',16,40);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(4,6,14,0.12)';cx.fillRect(0,0,W,H);

    ionLevel=70+Math.sin(t*0.3)*20;
    rfFreq=150+Math.sin(t*0.2)*50;

    drawAntennaColumn();drawRadiationPattern();
    drawFrequencyResponse();drawMetrics();drawPlasmaPhysics();drawHUD();

    cx.fillStyle='rgba(150,100,255,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Plasma Antenna — Ionized Gas Column RF Radiation',8,H-8);

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
