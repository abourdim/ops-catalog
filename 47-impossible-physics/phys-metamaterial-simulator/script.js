/**
 * Metamaterial Simulator — Workshop DIY v1.0
 * Full canvas-based negative-index metamaterial, EM cloaking,
 * split-ring resonator, and photonic crystal visualization.
 *
 * Features:
 *  - 4 material types: negative index, cloak, SRR, photonic crystal
 *  - Real-time wave propagation with negative refraction
 *  - EM cloaking field visualization
 *  - Material property calculations (ε, μ, Z, velocity)
 *  - Wave analysis canvas with field plots
 *  - Full i18n (EN/FR/AR with RTL), 8 themes, sound, log, panels
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".3" rx="4">
    <animate attributeName="rx" values="0;15;0" dur="3s" repeatCount="indefinite"/>
  </rect>
  <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" stroke-width="1.5" opacity=".5">
    <animate attributeName="y1" values="50;35;50" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="y2" values="50;65;50" dur="2s" repeatCount="indefinite"/>
  </line>
  <circle cx="35" cy="35" r="4" fill="currentColor" opacity=".5"/>
  <circle cx="65" cy="35" r="4" fill="currentColor" opacity=".5"/>
  <circle cx="35" cy="65" r="4" fill="currentColor" opacity=".5"/>
  <circle cx="65" cy="65" r="4" fill="currentColor" opacity=".5"/>
</svg>`;

const LIGHT_THEMES = ['riad', 'medina'];
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination); g.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click': o.frequency.value = 800; g.gain.exponentialRampToValueAtTime(0.001, t + .08); o.start(t); o.stop(t + .08); break;
    case 'success': o.frequency.value = 523; g.gain.exponentialRampToValueAtTime(0.001, t + .3); o.start(t); o.stop(t + .3); break;
    case 'error': o.frequency.value = 200; o.type = 'square'; g.gain.exponentialRampToValueAtTime(0.001, t + .25); o.start(t); o.stop(t + .25); break;
  }
}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title: 'Metamaterial Simulator', subtitle: '🔬 Negative refraction & cloaking',
    disconnected: 'Offline', connected: 'Simulating',
    mainSection: 'Metamaterial Simulator', mainDesc: 'Simulate negative-index metamaterials and EM cloaking',
    sectionA: 'Material Properties', sectionB: 'Wave Analysis', sectionC: 'Metamaterial Theory',
    activityLog: '📜 Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', theme: 'Theme',
    settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1: 'Choose a metamaterial type from the dropdown.',
    howto_2: 'Adjust frequency and refractive index sliders.',
    howto_3: 'Press Start to see wave propagation through the material.',
    howto_4: 'Open Wave Analysis to see refraction angles and fields.',
    wiki_neg_title: '🔄 Negative Refraction', wiki_neg: 'When both ε and μ are negative, Snell\'s law reverses.',
    wiki_cloak_title: '👻 EM Cloaking', wiki_cloak: 'Transformation optics guides waves around hidden regions.',
    wiki_srr_title: '💍 Split-Ring Resonators', wiki_srr: 'Concentric metallic rings with gaps that resonate magnetically.',
    working: 'Working…', filterAll: 'All', soundEffects: '🔊 Sound effects',
    ready: '🔬 Metamaterial Simulator ready!', logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    matType: 'Material Type', freqLabel: 'Frequency (GHz)', indexLabel: 'Refractive Index',
    startSim: '▶ Start', stopSim: '⏹ Stop', resetSim: '↺ Reset',
    permittivity: 'Permittivity (ε):', permeability: 'Permeability (μ):', impedance: 'Impedance (Z):',
    groupVel: 'Group Velocity:', phaseVel: 'Phase Velocity:', wavelength: 'Wavelength:',
    theoryIntro: 'Metamaterials are engineered structures with unusual EM properties:',
    theory1: 'Negative refractive index bends light the wrong way',
    theory2: 'Split-ring resonators create artificial magnetic response',
    theory3: 'Transformation optics enables electromagnetic cloaking',
    theory4: 'Perfect lensing can beat the diffraction limit',
    theory5: 'Left-handed materials reverse the Poynting vector',
    splashHint: 'tap to skip', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    simStarted: '▶ Simulation started', simStopped: '⏹ Stopped', simReset: '↺ Reset',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad',
    t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates impossible physics! 🔬 You get to experiment with exotic physical phenomena in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real exotic physical phenomena so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real cutting-edge physics simulations! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Phys Bell Inequality Rf and Phys Radio Black Hole! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',learnAge:'Ages:'},
  fr: {
    title: 'Simulateur de Métamatériaux', subtitle: '🔬 Réfraction négative & camouflage',
    disconnected: 'Hors ligne', connected: 'Simulation',
    mainSection: 'Simulateur de Métamatériaux', mainDesc: 'Simuler les métamatériaux à indice négatif et le camouflage EM',
    sectionA: 'Propriétés du Matériau', sectionB: 'Analyse des Ondes', sectionC: 'Théorie des Métamatériaux',
    activityLog: '📜 Journal', eventsMsg: 'Événements',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', theme: 'Thème',
    settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1: 'Choisissez un type de métamatériau.', howto_2: 'Ajustez la fréquence et l\'indice.',
    howto_3: 'Appuyez Démarrer pour voir la propagation.', howto_4: 'Ouvrez Analyse des Ondes.',
    wiki_neg_title: '🔄 Réfraction Négative', wiki_neg: 'Quand ε et μ sont négatifs, la loi de Snell s\'inverse.',
    wiki_cloak_title: '👻 Camouflage EM', wiki_cloak: 'L\'optique de transformation guide les ondes autour de régions cachées.',
    wiki_srr_title: '💍 Résonateurs Annulaires', wiki_srr: 'Anneaux métalliques concentriques qui résonnent magnétiquement.',
    working: 'En cours…', filterAll: 'Tout', soundEffects: '🔊 Effets sonores',
    ready: '🔬 Simulateur prêt !', logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    matType: 'Type de Matériau', freqLabel: 'Fréquence (GHz)', indexLabel: 'Indice de Réfraction',
    startSim: '▶ Démarrer', stopSim: '⏹ Arrêter', resetSim: '↺ Réinitialiser',
    permittivity: 'Permittivité (ε) :', permeability: 'Perméabilité (μ) :', impedance: 'Impédance (Z) :',
    groupVel: 'Vitesse de Groupe :', phaseVel: 'Vitesse de Phase :', wavelength: 'Longueur d\'Onde :',
    theoryIntro: 'Les métamatériaux sont des structures aux propriétés EM inhabituelles :',
    theory1: 'L\'indice négatif courbe la lumière à l\'envers',
    theory2: 'Les résonateurs annulaires créent une réponse magnétique artificielle',
    theory3: 'L\'optique de transformation permet le camouflage EM',
    theory4: 'La lentille parfaite peut battre la limite de diffraction',
    theory5: 'Les matériaux gauchers inversent le vecteur de Poynting',
    splashHint: 'appuyer pour passer', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    simStarted: '▶ Simulation démarrée', simStopped: '⏹ Arrêté', simReset: '↺ Réinitialisé',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad',
    t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule impossible physics ! 🔬 Tu peux expérimenter avec exotic physical phenomena en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais exotic physical phenomena.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai cutting-edge physics simulations ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Phys Bell Inequality Rf and Phys Radio Black Hole ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar: {
    title: 'محاكي الميتاماتيريال', subtitle: '🔬 الانكسار السلبي والتخفي',
    disconnected: 'غير متصل', connected: 'يحاكي',
    mainSection: 'محاكي الميتاماتيريال', mainDesc: 'محاكاة المواد ذات المعامل السلبي والتخفي الكهرومغناطيسي',
    sectionA: 'خصائص المادة', sectionB: 'تحليل الأمواج', sectionC: 'نظرية الميتاماتيريال',
    activityLog: '📜 سجل النشاط', eventsMsg: 'الأحداث',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', theme: 'المظهر',
    settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيفية الاستخدام', wiki: 'ويكي',
    howto_1: 'اختر نوع الميتاماتيريال.', howto_2: 'اضبط التردد ومعامل الانكسار.',
    howto_3: 'اضغط ابدأ لرؤية انتشار الموجة.', howto_4: 'افتح تحليل الأمواج لرؤية الحقول.',
    wiki_neg_title: '🔄 الانكسار السلبي', wiki_neg: 'عندما تكون ε و μ سالبتين ينعكس قانون سنل.',
    wiki_cloak_title: '👻 التخفي الكهرومغناطيسي', wiki_cloak: 'بصريات التحويل توجه الموجات حول المناطق المخفية.',
    wiki_srr_title: '💍 المرنانات الحلقية', wiki_srr: 'حلقات معدنية متحدة المركز ترنّ مغناطيسياً.',
    working: 'جارٍ…', filterAll: 'الكل', soundEffects: '🔊 مؤثرات صوتية',
    ready: '🔬 المحاكي جاهز!', logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل',
    matType: 'نوع المادة', freqLabel: 'التردد (GHz)', indexLabel: 'معامل الانكسار',
    startSim: '▶ ابدأ', stopSim: '⏹ إيقاف', resetSim: '↺ إعادة',
    permittivity: 'السماحية (ε):', permeability: 'النفاذية (μ):', impedance: 'المعاوقة (Z):',
    groupVel: 'سرعة المجموعة:', phaseVel: 'سرعة الطور:', wavelength: 'الطول الموجي:',
    theoryIntro: 'الميتاماتيريال هياكل مهندسة بخصائص كهرومغناطيسية غير عادية:',
    theory1: 'المعامل السلبي يكسر الضوء بالاتجاه الخاطئ',
    theory2: 'المرنانات الحلقية تخلق استجابة مغناطيسية اصطناعية',
    theory3: 'بصريات التحويل تمكّن التخفي الكهرومغناطيسي',
    theory4: 'العدسة المثالية يمكن أن تتغلب على حد الحيود',
    theory5: 'المواد اليسارية تعكس متجه بوينتنغ',
    splashHint: 'انقر للتخطي', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    simStarted: '▶ بدأت المحاكاة', simStopped: '⏹ توقف', simReset: '↺ إعادة ضبط',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض',
    t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي impossible physics! 🔬 يمكنك التجربة مع exotic physical phenomena في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج exotic physical phenomena حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا cutting-edge physics simulations حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Phys Bell Inequality Rf and Phys Radio Black Hole! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};

let currentLang = 'en';
function setLanguage(lang) {
  currentLang = lang; const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; });
  document.title = s.title + ' — Workshop DIY';
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info');
}
function setTheme(n) {
  document.documentElement.dataset.theme = n;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n));
  const s = $('themeSelect'); if (s) s.value = n;
  try { localStorage.setItem('wdiy-theme', n); } catch {}
  log(LANG[currentLang].themeChanged + ' ' + (LANG[currentLang]['t_' + n] || n), 'info');
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const d = document.createElement('div'); d.className = 'log-line ' + type;
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
  logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight;
  if (type === 'success') playSound('success'); else if (type === 'error') playSound('error');
  applyLogFilter();
}
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { const t = Array.from(logContainer.children).map(d => d.textContent).join('\n'); const b = new Blob([t], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'metamaterial-log.txt'; a.click(); URL.revokeObjectURL(u); }
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(c) { const t = $('statusText'), p = $('statusPill'), s = LANG[currentLang]; if (t) t.textContent = c ? s.connected : s.disconnected; if (p) p.classList.toggle('connected', c); }

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; }); }
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {} }

/* ═══════ PANELS ═══════ */
function openPanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.remove('open'); if (ov) ov.classList.remove('open'); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); } function closeHelp() { closePanel('helpPanel', 'helpOverlay'); }
function openSettings() { openPanel('settingsPanel', 'settingsOverlay'); } function closeSettings() { closePanel('settingsPanel', 'settingsOverlay'); }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function initHelpTabs() { document.querySelectorAll('.help-tab').forEach(tab => tab.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const id = 'help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1); const tgt = $(id); if (tgt) tgt.classList.add('active'); })); }

/* ═══════════════════════════════════════════════════════
   METAMATERIAL SIMULATION — FULL CANVAS ENGINE
   ═══════════════════════════════════════════════════════ */

let running = false, animFrame = null;
const waves = [];
const particles = [];
const C = 3e8; // speed of light

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  return { w: rect.width, h: rect.height, ctx };
}

/* Wave sources */
function emitWave(x, y, angle) {
  waves.push({ x, y, angle, speed: 2, life: 1, age: 0, refracted: false, phase: Math.random() * Math.PI * 2 });
}

/* Draw the metamaterial slab/region */
function drawMetamaterial(ctx, w, h, type, time) {
  const slabX = w * 0.35, slabW = w * 0.3;

  switch (type) {
    case 'negative': {
      // Draw negative-index slab
      ctx.fillStyle = 'rgba(0, 40, 120, 0.3)';
      ctx.fillRect(slabX, 0, slabW, h);
      // SRR pattern inside slab
      const cellSize = 25;
      ctx.strokeStyle = 'rgba(100, 180, 255, 0.2)';
      ctx.lineWidth = 1;
      for (let y = cellSize / 2; y < h; y += cellSize) {
        for (let x = slabX + cellSize / 2; x < slabX + slabW; x += cellSize) {
          const pulse = Math.sin(time * 3 + x * 0.05 + y * 0.05) * 0.3 + 0.7;
          ctx.globalAlpha = pulse * 0.4;
          ctx.beginPath(); ctx.arc(x, y, 6, 0.3, Math.PI * 2 - 0.3); ctx.stroke();
          ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2 - 0.5); ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      // Interface lines
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.4)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(slabX, 0); ctx.lineTo(slabX, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(slabX + slabW, 0); ctx.lineTo(slabX + slabW, h); ctx.stroke();
      break;
    }
    case 'cloak': {
      // Draw cloaking shell
      const cx = w / 2, cy = h / 2, outerR = 80, innerR = 35;
      const grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      grad.addColorStop(0.3, 'rgba(0, 40, 100, 0.4)');
      grad.addColorStop(1, 'rgba(0, 80, 200, 0.1)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(cx, cy, outerR, 0, Math.PI * 2); ctx.fill();
      // Cloaked object
      ctx.fillStyle = 'rgba(200, 50, 50, 0.6)';
      ctx.beginPath(); ctx.arc(cx, cy, innerR, 0, Math.PI * 2); ctx.fill();
      // Coordinate grid lines curving around cloak
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.15)'; ctx.lineWidth = 0.5;
      for (let i = 0; i < 20; i++) {
        const baseY = (i / 20) * h;
        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
          const dx = x - cx, dy = baseY - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let yOff = baseY;
          if (dist < outerR * 1.5 && dist > innerR * 0.5) {
            const factor = Math.max(0, 1 - innerR / dist) * (outerR / dist);
            yOff = cy + dy * (1 + (1 - factor) * 0.3);
          }
          if (x === 0) ctx.moveTo(x, yOff); else ctx.lineTo(x, yOff);
        }
        ctx.stroke();
      }
      break;
    }
    case 'srr': {
      // Array of split-ring resonators
      const cellSize = 35;
      for (let y = cellSize; y < h - cellSize; y += cellSize) {
        for (let x = w * 0.2; x < w * 0.8; x += cellSize) {
          const phase = Math.sin(time * 4 + x * 0.1 + y * 0.1);
          const glow = Math.abs(phase);
          ctx.strokeStyle = `rgba(${100 + glow * 155}, ${150 + glow * 50}, 255, ${0.3 + glow * 0.5})`;
          ctx.lineWidth = 1.5;
          // Outer ring
          ctx.beginPath(); ctx.arc(x, y, 10, 0.4, Math.PI * 2 - 0.4); ctx.stroke();
          // Inner ring (opposite gap)
          ctx.beginPath(); ctx.arc(x, y, 6, Math.PI + 0.4, Math.PI * 3 - 0.4); ctx.stroke();
          // Resonance glow
          if (glow > 0.7) {
            ctx.fillStyle = `rgba(100, 200, 255, ${(glow - 0.7) * 0.5})`;
            ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
      break;
    }
    case 'photonic': {
      // Photonic crystal lattice
      const a = 20; // lattice constant
      const startX = w * 0.25, endX = w * 0.75;
      for (let row = 0; row < h / (a * 0.866); row++) {
        for (let col = 0; col < (endX - startX) / a; col++) {
          const x = startX + col * a + (row % 2) * a / 2;
          const y = row * a * 0.866;
          if (x < startX || x > endX) continue;
          const bandgap = Math.sin(time * 2 + col * 0.3) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(60, ${100 + bandgap * 100}, ${200 + bandgap * 55}, ${0.3 + bandgap * 0.3})`;
          ctx.beginPath(); ctx.arc(x, y, 5 + bandgap * 2, 0, Math.PI * 2); ctx.fill();
        }
      }
      break;
    }
  }
}

/* Propagate and draw waves */
function drawWaves(ctx, w, h, type, nIndex, time) {
  const slabX = w * 0.35, slabW = w * 0.3;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Emit new waves from left
  if (Math.random() < 0.15) {
    emitWave(0, h * 0.3 + Math.random() * h * 0.4, 0);
  }

  for (let i = waves.length - 1; i >= 0; i--) {
    const wave = waves[i];
    wave.age += 0.016;
    wave.life -= 0.003;

    // Propagation
    const speed = wave.refracted ? Math.abs(nIndex) * 1.5 : 2;
    wave.x += Math.cos(wave.angle) * speed;
    wave.y += Math.sin(wave.angle) * speed;

    // Negative refraction at slab boundary
    if (type === 'negative' && !wave.refracted && wave.x >= slabX) {
      wave.refracted = true;
      wave.angle = -wave.angle * (nIndex < 0 ? -1 : 1) * 0.5; // negative refraction
    }

    // Cloaking deflection
    if (type === 'cloak') {
      const dx = wave.x - w / 2, dy = wave.y - h / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90 && dist > 30) {
        const deflect = (90 - dist) / 90 * 0.05;
        wave.angle += dy > 0 ? -deflect : deflect;
      }
    }

    // Draw wave with phase oscillation
    const osc = Math.sin(wave.age * 20 + wave.phase) * 3;
    ctx.beginPath();
    ctx.arc(wave.x, wave.y + osc, 3 * wave.life, 0, Math.PI * 2);
    const hue = wave.refracted ? 0 : 200;
    ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${wave.life * 0.8})`;
    ctx.fill();

    // Wave trail
    ctx.strokeStyle = `hsla(${hue}, 60%, 50%, ${wave.life * 0.3})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(wave.x - Math.cos(wave.angle) * 15, wave.y - Math.sin(wave.angle) * 15 + osc);
    ctx.lineTo(wave.x, wave.y + osc);
    ctx.stroke();

    if (wave.life <= 0 || wave.x > w + 10 || wave.x < -10 || wave.y < -10 || wave.y > h + 10) {
      waves.splice(i, 1);
    }
  }

  // Plane wave fronts incoming from left
  ctx.strokeStyle = `rgba(100, 200, 255, 0.1)`;
  ctx.lineWidth = 1;
  for (let i = 0; i < 8; i++) {
    const xPos = ((time * 60 + i * 40) % (slabX + 40)) - 20;
    if (xPos > 0 && xPos < slabX) {
      ctx.beginPath(); ctx.moveTo(xPos, 0); ctx.lineTo(xPos, h); ctx.stroke();
    }
  }
}

/* HUD overlay */
function drawHUD(ctx, w, h, nIndex, freq) {
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  ctx.fillStyle = accent; ctx.font = '11px Orbitron, monospace';
  ctx.fillText('METAMATERIAL SIMULATOR', 10, 18);
  ctx.fillStyle = 'rgba(100, 200, 255, 0.6)'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('n = ' + nIndex.toFixed(1) + '  f = ' + freq + ' GHz', 10, 34);
  ctx.fillText('Waves: ' + waves.length, 10, 48);
  const matType = $('matType') ? $('matType').value : 'negative';
  ctx.fillStyle = 'rgba(200, 150, 50, 0.5)';
  ctx.fillText('MODE: ' + matType.toUpperCase(), w - 180, 18);
}

/* Update material properties display */
function updateProperties(nIndex, freq) {
  const eps = nIndex < 0 ? -Math.abs(nIndex) * 1.2 : Math.abs(nIndex) * 1.2;
  const mu = nIndex < 0 ? -Math.abs(nIndex) * 0.8 : Math.abs(nIndex) * 0.8;
  const z = Math.sqrt(Math.abs(mu / eps)) * 377;
  const vp = C / Math.abs(nIndex || 1);
  const vg = vp * (1 - 0.1 * Math.abs(nIndex));
  const wl = C / (freq * 1e9) * 1000;

  const e = $('epsVal'); if (e) e.textContent = eps.toFixed(3);
  const m = $('muVal'); if (m) m.textContent = mu.toFixed(3);
  const zv = $('zVal'); if (zv) zv.textContent = z.toFixed(1) + ' Ω';
  const vgv = $('vgVal'); if (vgv) vgv.textContent = (vg / C).toFixed(3) + 'c';
  const vpv = $('vpVal'); if (vpv) vpv.textContent = (vp / C).toFixed(3) + 'c';
  const wlv = $('wlVal'); if (wlv) wlv.textContent = wl.toFixed(2) + ' mm';
}

/* Wave analysis canvas */
function drawAnalysis(ctx, w, h, nIndex, freq, time) {
  ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, w, h);
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Grid
  ctx.strokeStyle = '#1a2a3a'; ctx.lineWidth = 0.5;
  for (let i = 0; i <= 10; i++) { const x = (i / 10) * w; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let i = 0; i <= 5; i++) { const y = (i / 5) * h; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  // E-field wave
  ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)'; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const norm = x / w;
    const inSlab = norm > 0.35 && norm < 0.65;
    const k = inSlab ? Math.abs(nIndex) * 4 : 2;
    const direction = inSlab && nIndex < 0 ? -1 : 1;
    const amp = h * 0.35;
    const y = h / 2 + Math.sin(x * 0.05 * k * direction - time * 5) * amp * (inSlab ? 0.7 : 1);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // H-field wave
  ctx.strokeStyle = 'rgba(255, 150, 50, 0.6)'; ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const norm = x / w;
    const inSlab = norm > 0.35 && norm < 0.65;
    const k = inSlab ? Math.abs(nIndex) * 4 : 2;
    const direction = inSlab && nIndex < 0 ? -1 : 1;
    const amp = h * 0.25;
    const y = h / 2 + Math.cos(x * 0.05 * k * direction - time * 5) * amp * (inSlab ? 0.7 : 1);
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Slab region indicator
  ctx.fillStyle = 'rgba(0, 40, 120, 0.15)';
  ctx.fillRect(w * 0.35, 0, w * 0.3, h);

  // Labels
  ctx.fillStyle = '#6688aa'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('E-field (blue)  H-field (orange)', 8, 14);
  ctx.fillText('n=' + nIndex.toFixed(1), w * 0.47, 14);
}

/* Main loop */
let simCtx, simW, simH, anaCtx, anaW, anaH;

function simLoop() {
  if (!running) return;
  const time = performance.now() * 0.001;
  const matType = $('matType') ? $('matType').value : 'negative';
  const nIndex = ($('indexSlider') ? +$('indexSlider').value : -10) / 10;
  const freq = $('freqSlider') ? +$('freqSlider').value : 30;

  if (simCtx) {
    simCtx.fillStyle = 'rgba(0, 0, 0, 0.08)'; simCtx.fillRect(0, 0, simW, simH);
    drawMetamaterial(simCtx, simW, simH, matType, time);
    drawWaves(simCtx, simW, simH, matType, nIndex, time);
    drawHUD(simCtx, simW, simH, nIndex, freq);
  }

  if (anaCtx) drawAnalysis(anaCtx, anaW, anaH, nIndex, freq, time);
  updateProperties(nIndex, freq);

  animFrame = requestAnimationFrame(simLoop);
}

function startSim() {
  if (running) return; running = true; setStatus(true);
  const sc = $('simCanvas'), ac = $('analysisCanvas');
  if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; }
  if (ac) { const r = resizeCanvas(ac); anaCtx = r.ctx; anaW = r.w; anaH = r.h; }
  log(LANG[currentLang].simStarted, 'success');
  simLoop();
}
function stopSim() { running = false; if (animFrame) cancelAnimationFrame(animFrame); setStatus(false); log(LANG[currentLang].simStopped, 'info'); }
function resetSim() {
  stopSim(); waves.length = 0;
  const sc = $('simCanvas'), ac = $('analysisCanvas');
  if (sc) sc.getContext('2d').clearRect(0, 0, sc.width, sc.height);
  if (ac) ac.getContext('2d').clearRect(0, 0, ac.width, ac.height);
  [$('epsVal'), $('muVal'), $('zVal'), $('vgVal'), $('vpVal'), $('wlVal')].forEach(e => { if (e) e.textContent = '--'; });
  log(LANG[currentLang].simReset, 'info');
}

/* ═══════ INIT ═══════ */
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
  $('freqSlider').oninput = function () { $('freqVal').textContent = this.value + ' GHz'; };
  $('indexSlider').oninput = function () { $('indexVal').textContent = (this.value / 10).toFixed(1); };
  window.addEventListener('resize', () => {
    if (running) {
      const sc = $('simCanvas'), ac = $('analysisCanvas');
      if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; }
      if (ac) { const r = resizeCanvas(ac); anaCtx = r.ctx; anaW = r.w; anaH = r.h; }
    }
  });
  log(LANG[currentLang].ready, 'success');
}
document.addEventListener('DOMContentLoaded', init);


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

var DEMO_STEPS = [
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬', target:'#helpBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary action button to start. Watch the visualization respond in real time! ⚡', target:'#settingsBtn', delay:3000},
  {i18n:'demo_s3', text:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄', target:'#logBtn', delay:3000},
  {i18n:'demo_s4', text:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊', target:'#simCanvas', delay:3000},
  {i18n:'demo_s5', text:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!', target:'#mainCard', delay:3000},
];

// ── Demo Engine ──
var _demoStep = 0, _demoPlaying = false, _demoTimer = null;
var _demoSteps = (typeof DEMO_STEPS !== 'undefined') ? DEMO_STEPS : [];

function demoNav(dir) {
  _demoStep = Math.max(0, Math.min(_demoSteps.length - 1, _demoStep + dir));
  demoShow();
}

function demoToggle() {
  _demoPlaying = !_demoPlaying;
  var btn = document.getElementById('demoPlayBtn');
  if (btn) btn.innerHTML = _demoPlaying ? '⏸ <span data-i18n="demoPause">Pause</span>' : '▶ <span data-i18n="demoPlay">Play</span>';
  if (_demoPlaying) {
    demoShow();
    _demoTimer = setInterval(function() {
      if (_demoStep < _demoSteps.length - 1) { _demoStep++; demoShow(); }
      else { _demoPlaying = false; clearInterval(_demoTimer); var b = document.getElementById('demoPlayBtn'); if(b) b.innerHTML = '▶ <span data-i18n="demoPlay">Play</span>'; }
    }, 3000);
  } else {
    clearInterval(_demoTimer);
  }
}

function demoShow() {
  var step = _demoSteps[_demoStep];
  if (!step) return;
  var numEl = document.getElementById('demoCurrentStep');
  var narEl = document.getElementById('demoNarration');
  var barEl = document.getElementById('demoProgressBar');
  if (numEl) numEl.textContent = (_demoStep + 1) + '/' + _demoSteps.length;
  if (narEl) { narEl.setAttribute('data-i18n', step.i18n); narEl.textContent = step.text; if (typeof applyLang === 'function') applyLang(); }
  if (barEl) barEl.style.width = ((_demoStep + 1) / _demoSteps.length * 100) + '%';
  // Remove old highlights
  document.querySelectorAll('.demo-highlight').forEach(function(el) { el.classList.remove('demo-highlight'); });
  // Add highlight
  if (step.target) { var t = document.querySelector(step.target); if (t) { t.classList.add('demo-highlight'); t.scrollIntoView({behavior:'smooth', block:'center'}); } }
}

// Service Worker Registration (skip on file://)
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(function(){});
}
