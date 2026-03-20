/**
 * Superluminal Illusion Lab — Workshop DIY v1.0
 * Canvas-based simulation of apparent FTL phenomena:
 * anomalous dispersion, light scissors, superluminal shadows, phase velocity.
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="50" r="6" fill="currentColor" opacity=".7"><animate attributeName="cx" values="15;85;15" dur="0.6s" repeatCount="indefinite"/></circle><line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" stroke-width="1" stroke-dasharray="4,4" opacity=".3"/><text x="50" y="30" text-anchor="middle" fill="currentColor" font-size="12" opacity=".5">c</text><line x1="50" y1="33" x2="50" y2="67" stroke="currentColor" stroke-width=".5" stroke-dasharray="2,2" opacity=".2"/></svg>`;
const LIGHT_THEMES = ['riad', 'medina'];
let soundEnabled = false; const AudioCtx = window.AudioContext || window.webkitAudioContext; let audioCtx;
function playSound(type) { if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx(); const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); g.gain.value = 0.08; const t = audioCtx.currentTime; if (type === 'click') { o.frequency.value = 800; g.gain.exponentialRampToValueAtTime(0.001, t + .08); o.start(t); o.stop(t + .08); } else if (type === 'success') { o.frequency.value = 523; g.gain.exponentialRampToValueAtTime(0.001, t + .3); o.start(t); o.stop(t + .3); } else if (type === 'error') { o.frequency.value = 200; o.type = 'square'; g.gain.exponentialRampToValueAtTime(0.001, t + .25); o.start(t); o.stop(t + .25); } }

const LANG = {
  en: {
    title: 'Superluminal Illusion Lab', subtitle: '💫 Apparent FTL effects',
    disconnected: 'Offline', connected: 'Active',
    mainSection: 'Superluminal Illusion Lab', mainDesc: 'Demonstrate apparent faster-than-light group velocity illusions',
    sectionA: 'Velocity Analysis', sectionB: 'Dispersion Diagram', sectionC: 'Theory',
    activityLog: '📜 Activity Log', eventsMsg: 'Events', clear: 'Clear', copy: 'Copy', export: 'Export', theme: 'Theme',
    settings: '⚙️ Settings', language: 'Language', help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki'Is my data private?'s not a physical object.',
    howto_1: 'Select an illusion type.', howto_2: 'Adjust speed factor and medium density.',
    howto_3: 'Click Start to see the effect.', howto_4: 'Compare different velocity types.',
    wiki_t1: '💫 Superluminal Illusions', wiki_d1: 'Apparent FTL effects that don\'t violate special relativity.',
    wiki_t2: '📐 Dispersion Relations', wiki_d2: 'omega(k) determines phase and group velocities.',
    working: 'Working…', filterAll: 'All', soundEffects: '🔊 Sound effects',
    ready: '💫 Superluminal Lab ready!', logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Failed',
    illusionType: 'Illusion Type', speedFactor: 'Speed Factor (xc)', mediumDensity: 'Medium Density',
    startSim: '▶ Start', stopSim: '⏹ Stop', resetSim: '↺ Reset',
    groupVel: 'Group Velocity:', phaseVel: 'Phase Velocity:', signalVel: 'Signal Velocity:',
    infoVel: 'Info Velocity:', dispersion: 'Dispersion:', refIndex: 'Refractive Index:',
    theoryIntro: 'Superluminal illusions arise without violating relativity:',
    theory1: 'Group velocity can exceed c in anomalous dispersion', theory2: 'No information travels faster than light',
    theory3: 'Phase velocity exceeds c in many materials', theory4: 'Light scissors: intersection moves faster than c',
    theory5: 'Shadows can sweep surfaces faster than c',
    splashHint: 'tap to skip', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    simStarted: '💫 Illusion active', simStopped: '⏹ Stopped', simReset: '↺ Reset',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad',
    t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Set Parameters',step1Desc:'Configure the physical constants and initial conditions for the experiment.',step2Title:'Run Experiment',step2Desc:'Start the simulation and observe the physics phenomenon in action.',step3Title:'Measure Results',step3Desc:'Capture quantitative measurements from the simulated experiment.',step4Title:'Compare Theory',step4Desc:'Compare your experimental results with theoretical predictions.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates impossible physics! 🔬 You get to experiment with exotic physical phenomena in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real exotic physical phenomena so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real cutting-edge physics simulations! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Phys Faraday Rotation Lab and Phys Casimir Detector! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',learnAge:'Ages:'},
  fr: {
    title: 'Labo Illusion Superluminique', subtitle: '💫 Effets FTL apparents',
    disconnected: 'Hors ligne', connected: 'Actif',
    mainSection: 'Labo Illusion Superluminique', mainDesc: 'Démontrer les illusions de vitesse de groupe superluminique',
    sectionA: 'Analyse de Vitesse', sectionB: 'Diagramme de Dispersion', sectionC: 'Théorie',
    activityLog: '📜 Journal', eventsMsg: 'Événements', clear: 'Effacer', copy: 'Copier', export: 'Exporter', theme: 'Thème',
    settings: '⚙️ Paramètres', language: 'Langue', help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki'Mes données sont-elles privées ?'intersection de deux faisceaux peut se déplacer plus vite que c.',
    howto_1: 'Sélectionnez un type d\'illusion.', howto_2: 'Ajustez les paramètres.',
    howto_3: 'Cliquez Démarrer.', howto_4: 'Comparez les types de vitesses.',
    wiki_t1: '💫 Illusions Superluminiques', wiki_d1: 'Effets FTL apparents sans violer la relativité.',
    wiki_t2: '📐 Relations de Dispersion', wiki_d2: 'omega(k) détermine les vitesses de phase et de groupe.',
    working: 'En cours…', filterAll: 'Tout', soundEffects: '🔊 Effets sonores',
    ready: '💫 Labo superluminique prêt !', logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    illusionType: 'Type d\'Illusion', speedFactor: 'Facteur de Vitesse (xc)', mediumDensity: 'Densité du Milieu',
    startSim: '▶ Démarrer', stopSim: '⏹ Arrêter', resetSim: '↺ Réinitialiser',
    groupVel: 'Vitesse de Groupe :', phaseVel: 'Vitesse de Phase :', signalVel: 'Vitesse du Signal :',
    infoVel: 'Vitesse Info :', dispersion: 'Dispersion :', refIndex: 'Indice de Réfraction :',
    theoryIntro: 'Les illusions superluminiques ne violent pas la relativité :',
    theory1: 'La vitesse de groupe peut dépasser c en dispersion anormale', theory2: 'Aucune information ne voyage plus vite que la lumière',
    theory3: 'La vitesse de phase dépasse c dans beaucoup de matériaux', theory4: 'Ciseaux de lumière : l\'intersection se déplace plus vite que c',
    theory5: 'Les ombres peuvent balayer les surfaces plus vite que c',
    splashHint: 'appuyer pour passer', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    simStarted: '💫 Illusion active', simStopped: '⏹ Arrêté', simReset: '↺ Réinitialisé',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad',
    t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',step1Title:'Définir les paramètres',step1Desc:'Configure les constantes physiques et conditions initiales.',step2Title:'Lancer l\'expérience',step2Desc:'Démarre la simulation et observe le phénomène physique en action.',step3Title:'Mesurer les résultats',step3Desc:'Capture les mesures quantitatives de l\'expérience simulée.',step4Title:'Comparer à la théorie',step4Desc:'Compare tes résultats expérimentaux aux prédictions théoriques.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule impossible physics ! 🔬 Tu peux expérimenter avec exotic physical phenomena en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais exotic physical phenomena.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai cutting-edge physics simulations ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Phys Faraday Rotation Lab and Phys Casimir Detector ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar: {
    title: 'مختبر الوهم فوق الضوئي', subtitle: '💫 تأثيرات أسرع من الضوء الظاهرة',
    disconnected: 'غير متصل', connected: 'نشط',
    mainSection: 'مختبر الوهم فوق الضوئي', mainDesc: 'عرض أوهام سرعة المجموعة فوق الضوئية الظاهرة',
    sectionA: 'تحليل السرعة', sectionB: 'مخطط التشتت', sectionC: 'النظرية',
    activityLog: '📜 سجل النشاط', eventsMsg: 'الأحداث', clear: 'مسح', copy: 'نسخ', export: 'تصدير', theme: 'المظهر',
    settings: '⚙️ الإعدادات', language: 'اللغة', help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيفية الاستخدام', wiki: 'ويكي',
    howto_1: 'اختر نوع الوهم.', howto_2: 'اضبط المعاملات.',
    howto_3: 'اضغط ابدأ لرؤية التأثير.', howto_4: 'قارن أنواع السرعات المختلفة.',
    wiki_t1: '💫 الأوهام فوق الضوئية', wiki_d1: 'تأثيرات FTL ظاهرة لا تنتهك النسبية الخاصة.',
    wiki_t2: '📐 علاقات التشتت', wiki_d2: 'omega(k) تحدد سرعات الطور والمجموعة.',
    working: 'جارٍ…', filterAll: 'الكل', soundEffects: '🔊 مؤثرات صوتية',
    ready: '💫 مختبر الوهم جاهز!', logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل',
    illusionType: 'نوع الوهم', speedFactor: 'عامل السرعة (xc)', mediumDensity: 'كثافة الوسط',
    startSim: '▶ ابدأ', stopSim: '⏹ إيقاف', resetSim: '↺ إعادة',
    groupVel: 'سرعة المجموعة:', phaseVel: 'سرعة الطور:', signalVel: 'سرعة الإشارة:',
    infoVel: 'سرعة المعلومات:', dispersion: 'التشتت:', refIndex: 'معامل الانكسار:',
    theoryIntro: 'الأوهام فوق الضوئية تنشأ دون انتهاك النسبية:',
    theory1: 'سرعة المجموعة يمكن أن تتجاوز c في التشتت الشاذ', theory2: 'لا معلومات تسافر أسرع من الضوء',
    theory3: 'سرعة الطور تتجاوز c في كثير من المواد', theory4: 'مقصات الضوء: التقاطع يتحرك أسرع من c',
    theory5: 'الظلال يمكن أن تمسح الأسطح أسرع من c',
    splashHint: 'انقر للتخطي', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    simStarted: '💫 الوهم نشط', simStopped: '⏹ توقف', simReset: '↺ إعادة ضبط',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض',
    t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',step1Title:'تعيين المعلمات',step1Desc:'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.',step2Title:'تشغيل التجربة',step2Desc:'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.',step3Title:'قياس النتائج',step3Desc:'التقط القياسات الكمية من التجربة المحاكاة.',step4Title:'مقارنة بالنظرية',step4Desc:'قارن نتائجك التجريبية بالتنبؤات النظرية.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي impossible physics! 🔬 يمكنك التجربة مع exotic physical phenomena في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج exotic physical phenomena حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا cutting-edge physics simulations حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Phys Faraday Rotation Lab and Phys Casimir Detector! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Quantum Concepts',learn1Desc:'How particles behave at the smallest scales',learn1Tag:'Quantum',learn2Title:'Wave Physics',learn2Desc:'How electromagnetic waves carry energy and information',learn2Tag:'Physics',learn3Title:'Lab Simulation',learn3Desc:'How to design and run virtual experiments',learn3Tag:'Science',learn4Title:'Math Models',learn4Desc:'How equations predict physical phenomena',learn4Tag:'Mathematics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};

let currentLang = 'en';
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; }); document.title = s.title + ' — Workshop DIY'; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
function setTheme(n) { document.documentElement.dataset.theme = n; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n)); const s = $('themeSelect'); if (s) s.value = n; try { localStorage.setItem('wdiy-theme', n); } catch {} log(LANG[currentLang].themeChanged + ' ' + (LANG[currentLang]['t_' + n] || n), 'info'); }

let logContainer;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = 'log-line ' + type; d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (type === 'success') playSound('success'); else if (type === 'error') playSound('error'); applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { try { await navigator.clipboard.writeText(Array.from(($('logContainer')||{children:[]}).children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { const lc = $('logContainer'); if (!lc) return; const t = Array.from(lc.children).map(d => d.textContent).join('\n'); const b = new Blob([t], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'superluminal-log.txt'; a.click(); URL.revokeObjectURL(u); }
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
   SUPERLUMINAL ILLUSION — FULL CANVAS SIMULATION
   ═══════════════════════════════════════════════════════ */
let running = false, animFrame = null;
const trails = [];

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  return { w: rect.width, h: rect.height, ctx };
}

function drawSuperluminal(ctx, w, h, type, speedFactor, density, time) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; ctx.fillRect(0, 0, w, h);
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  const sf = speedFactor / 10;

  // Speed of light reference line
  const cLine = w * 0.3;
  ctx.strokeStyle = 'rgba(255, 255, 100, 0.2)'; ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(cLine, 0); ctx.lineTo(cLine, h); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255, 255, 100, 0.3)'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('c', cLine + 5, 15);

  switch (type) {
    case 'anomalous': {
      // Anomalous dispersion: wave packet group velocity > c
      const midY = h / 2;
      // Medium region
      ctx.fillStyle = `rgba(80, 40, 120, ${density / 300})`; ctx.fillRect(w * 0.3, 0, w * 0.4, h);
      ctx.strokeStyle = 'rgba(150, 100, 200, 0.3)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(w * 0.3, 0); ctx.lineTo(w * 0.3, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(w * 0.7, 0); ctx.lineTo(w * 0.7, h); ctx.stroke();

      // Wave packet envelope (group velocity)
      const groupPos = ((time * sf * 30) % (w * 1.3)) - w * 0.15;
      const packetWidth = 60;
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)'; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const env = Math.exp(-0.5 * ((x - groupPos) / packetWidth) ** 2);
        const carrier = Math.sin(x * 0.2 - time * 15);
        const inMedium = x > w * 0.3 && x < w * 0.7;
        const phaseDir = inMedium ? sf * 0.5 : 1;
        const y = midY - env * carrier * 60 * (inMedium ? 0.6 : 1);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Group velocity marker
      ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
      ctx.beginPath(); ctx.arc(groupPos, midY - 80, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255, 100, 100, 0.6)'; ctx.font = '9px Orbitron, monospace';
      ctx.fillText('v_g = ' + sf.toFixed(1) + 'c', groupPos - 25, midY - 92);

      // Phase velocity reference
      const phasePos = ((time * 30) % (w * 1.3)) - w * 0.15;
      ctx.fillStyle = 'rgba(100, 255, 100, 0.5)';
      ctx.beginPath(); ctx.arc(phasePos, midY + 80, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillText('v_p = c', phasePos - 15, midY + 95);
      break;
    }
    case 'scissors': {
      // Light scissors: intersection point moves faster than c
      const angle1 = 0.15;
      const angle2 = time * 0.3;
      const beam1Y = h * 0.3, beam2Y = h * 0.7;

      // Draw two converging beams
      for (let i = 0; i < 2; i++) {
        const startY = i === 0 ? beam1Y : beam2Y;
        const slope = i === 0 ? Math.tan(angle1) : -Math.tan(angle1);
        ctx.strokeStyle = `rgba(${i === 0 ? '100, 200, 255' : '255, 150, 100'}, 0.6)`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
          const y = startY + slope * (x - w * 0.1);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Intersection point
      const intersectX = w * 0.1 + ((time * sf * 50) % w);
      const intersectY = (beam1Y + beam2Y) / 2;
      ctx.fillStyle = 'rgba(255, 255, 100, 0.9)';
      ctx.beginPath(); ctx.arc(intersectX, intersectY, 8, 0, Math.PI * 2); ctx.fill();

      // Trail
      trails.push({ x: intersectX, y: intersectY, life: 1 });
      for (let i = trails.length - 1; i >= 0; i--) {
        trails[i].life -= 0.02;
        if (trails[i].life <= 0) { trails.splice(i, 1); continue; }
        ctx.fillStyle = `rgba(255, 255, 100, ${trails[i].life * 0.3})`;
        ctx.beginPath(); ctx.arc(trails[i].x, trails[i].y, 4 * trails[i].life, 0, Math.PI * 2); ctx.fill();
      }
      while (trails.length > 200) trails.shift();

      ctx.fillStyle = 'rgba(255, 255, 100, 0.7)'; ctx.font = '10px Orbitron, monospace';
      ctx.fillText('INTERSECTION: ' + sf.toFixed(1) + 'c', intersectX + 15, intersectY - 15);
      break;
    }
    case 'shadow': {
      // Superluminal shadow on distant surface
      const lampX = w * 0.1, lampY = h * 0.5;
      const wallX = w * 0.85;

      // Light source
      ctx.fillStyle = 'rgba(255, 220, 100, 0.8)';
      ctx.beginPath(); ctx.arc(lampX, lampY, 10, 0, Math.PI * 2); ctx.fill();

      // Light rays
      const shadowAngle = Math.sin(time * sf * 0.5) * 0.4;
      for (let i = -5; i <= 5; i++) {
        const angle = i * 0.08 + shadowAngle;
        ctx.strokeStyle = `rgba(255, 220, 100, ${0.1 - Math.abs(i) * 0.015})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(lampX, lampY);
        ctx.lineTo(wallX, lampY + Math.tan(angle) * (wallX - lampX));
        ctx.stroke();
      }

      // Shadow on wall
      const shadowY = lampY + Math.tan(shadowAngle) * (wallX - lampX);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(wallX, shadowY - 30, 20, 60);

      // Wall
      ctx.fillStyle = 'rgba(100, 100, 120, 0.3)';
      ctx.fillRect(wallX, 0, w - wallX, h);

      // Shadow speed indicator
      const shadowSpeed = Math.abs(Math.cos(time * sf * 0.5)) * sf * 2;
      ctx.fillStyle = 'rgba(255, 100, 100, 0.6)'; ctx.font = '10px Orbitron, monospace';
      ctx.fillText('Shadow: ' + shadowSpeed.toFixed(1) + 'c', wallX + 5, shadowY - 40);
      break;
    }
    case 'phase': {
      // Phase velocity exceeding c
      const midY = h / 2;
      // Draw waveguide walls
      ctx.fillStyle = 'rgba(60, 60, 80, 0.3)';
      ctx.fillRect(0, h * 0.25, w, 5); ctx.fillRect(0, h * 0.7, w, 5);

      // Phase fronts moving fast
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)'; ctx.lineWidth = 2;
      const phaseSpeed = sf * 1.5;
      for (let i = 0; i < 15; i++) {
        const x = ((time * phaseSpeed * 40 + i * 50) % w);
        ctx.beginPath(); ctx.moveTo(x, h * 0.25); ctx.lineTo(x, h * 0.7); ctx.stroke();
      }

      // Group/energy moving at c
      const groupX = ((time * 30) % (w * 1.3)) - w * 0.15;
      const groupWidth = 80;
      ctx.fillStyle = 'rgba(255, 200, 50, 0.15)';
      ctx.fillRect(groupX - groupWidth, h * 0.25, groupWidth * 2, h * 0.45);

      // Carrier wave
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.7)'; ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const env = Math.exp(-0.5 * ((x - groupX) / groupWidth) ** 2);
        const y = midY + Math.sin(x * 0.15 - time * phaseSpeed * 3) * 40 * env;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.fillStyle = 'rgba(100, 200, 255, 0.5)'; ctx.font = '10px Orbitron, monospace';
      ctx.fillText('v_phase = ' + phaseSpeed.toFixed(1) + 'c', 10, h * 0.22);
      ctx.fillStyle = 'rgba(255, 200, 50, 0.5)';
      ctx.fillText('v_group ≤ c', groupX - 30, h * 0.77);
      break;
    }
  }

  // HUD
  ctx.fillStyle = accent; ctx.font = '11px Orbitron, monospace';
  ctx.fillText('SUPERLUMINAL ILLUSION', 10, 18);
  ctx.fillStyle = 'rgba(100, 200, 255, 0.6)'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('Mode: ' + type.toUpperCase() + '  Factor: ' + sf.toFixed(1) + 'c', 10, 34);
}

function drawDispersion(ctx, w, h, speedFactor, density, time) {
  ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, w, h);
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  const sf = speedFactor / 10;

  // Grid
  ctx.strokeStyle = '#1a2a3a'; ctx.lineWidth = 0.5;
  for (let i = 0; i <= 10; i++) { const x = (i / 10) * w; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let i = 0; i <= 5; i++) { const y = (i / 5) * h; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  // Light line (omega = ck)
  ctx.strokeStyle = 'rgba(255, 255, 100, 0.3)'; ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(0, h); ctx.lineTo(w, 0); ctx.stroke();
  ctx.setLineDash([]);

  // Dispersion curve (anomalous region)
  ctx.strokeStyle = accent; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 0; x < w; x++) {
    const k = x / w * 10;
    const omega0 = 5;
    const gamma = density / 200;
    // Lorentzian dispersion
    const omega = Math.sqrt(k * k + omega0 * omega0 / (1 + gamma * k * k));
    const y = h - (omega / 12) * h;
    if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Operating point
  const opK = sf * 0.5;
  const opX = (opK / 10) * w;
  const opY = h * 0.4;
  ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
  ctx.beginPath(); ctx.arc(opX, opY, 5, 0, Math.PI * 2); ctx.fill();

  // Labels
  ctx.fillStyle = '#6688aa'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('omega(k) Dispersion Relation', 8, 14);
  ctx.fillText('k →', w - 30, h - 5);
  ctx.fillText('omega ↑', 5, 25);
  ctx.fillStyle = 'rgba(255, 255, 100, 0.4)';
  ctx.fillText('light line', w - 80, 25);
}

function updateMetrics(speedFactor, density) {
  const sf = speedFactor / 10;
  const n = density / 100 * 0.8 + 0.2;
  const vg = $('vgVal'); if (vg) vg.textContent = sf.toFixed(2) + 'c';
  const vp = $('vpVal'); if (vp) vp.textContent = (sf * 1.2).toFixed(2) + 'c';
  const vs = $('vsVal'); if (vs) vs.textContent = '≤ 1.00c';
  const vi = $('viVal'); if (vi) vi.textContent = '≤ 1.00c';
  const disp = $('dispVal'); if (disp) disp.textContent = sf > 1 ? 'Anomalous' : 'Normal';
  const nv = $('nVal'); if (nv) nv.textContent = (1 / sf).toFixed(4);
}

let simCtx, simW, simH, anaCtx, anaW, anaH;
function simLoop() {
  if (!running) return;
  const time = performance.now() * 0.001;
  const type = $('illusionType') ? $('illusionType').value : 'anomalous';
  const speedFactor = $('speedSlider') ? +$('speedSlider').value : 30;
  const density = $('densitySlider') ? +$('densitySlider').value : 50;

  if (simCtx) drawSuperluminal(simCtx, simW, simH, type, speedFactor, density, time);
  if (anaCtx) drawDispersion(anaCtx, anaW, anaH, speedFactor, density, time);
  if (Math.floor(time * 3) % 3 === 0) updateMetrics(speedFactor, density);
  animFrame = requestAnimationFrame(simLoop);
}

function startSim() {
  if (running) return; running = true; setStatus(true);
  const sc = $('simCanvas'), ac = $('analysisCanvas');
  if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; }
  if (ac) { const r = resizeCanvas(ac); anaCtx = r.ctx; anaW = r.w; anaH = r.h; }
  log(LANG[currentLang].simStarted, 'success'); simLoop();
}
function stopSim() { running = false; if (animFrame) cancelAnimationFrame(animFrame); setStatus(false); log(LANG[currentLang].simStopped, 'info'); }
function resetSim() {
  stopSim(); trails.length = 0;
  [$('simCanvas'), $('analysisCanvas')].forEach(c => { if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height); });
  ['vgVal', 'vpVal', 'vsVal', 'viVal', 'dispVal', 'nVal'].forEach(id => { const e = $(id); if (e) e.textContent = '--'; });
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
  $('speedSlider').oninput = function () { $('speedVal').textContent = (this.value / 10).toFixed(1) + 'c'; };
  $('densitySlider').oninput = function () { $('densityVal').textContent = this.value + '%'; };
  window.addEventListener('resize', () => { if (running) { const sc = $('simCanvas'), ac = $('analysisCanvas'); if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; } if (ac) { const r = resizeCanvas(ac); anaCtx = r.ctx; anaW = r.w; anaH = r.h; } } });
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
