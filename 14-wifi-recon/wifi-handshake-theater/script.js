/**
 * Handshake Theater — WPA 4-Way
 * 4-step handshake animation with key derivation
 * Workshop DIY — Template v1.2 + App Logic
 */

const $ = id => document.getElementById(id);

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7zm21,.-1.6h-6.5v3.2h6.5zm-13,.16.2h-3.2v-16.2h3.2zm19.5,0h-3.2v-16.2h3.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/></svg>`;
const FOOTER_ICON = '';
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.0';

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

const LANG = {
  en: {
    title: 'Handshake Theater — WPA 4-Way', subtitle: 'Watch the WPA2 4-way handshake unfold',
    disconnected: 'Idle', connected: 'Handshaking',
    mainSection: '4-Way Handshake', mainDesc: 'Step-by-step WPA2 authentication animation',
    sectionA: 'Key Derivation', sectionB: 'Handshake Timeline', sectionC: 'How It Works',
    start: 'Play', reset: 'Reset', client: 'Client (STA)', ap: 'Access Point (AP)',
    step1Title: 'AP → Client: ANonce', step1Desc: 'AP sends its random nonce (ANonce) to the client',
    step2Title: 'Client → AP: SNonce + MIC', step2Desc: 'Client generates SNonce, derives PTK, sends SNonce with MIC proof',
    step3Title: 'AP → Client: GTK + MIC', step3Desc: 'AP derives PTK, verifies MIC, sends encrypted GTK with MIC',
    step4Title: 'Client → AP: ACK', step4Desc: 'Client confirms GTK installation, handshake complete',
    keyDesc: 'Cryptographic keys generated during the handshake',
    howItWorksText: 'The WPA2 4-way handshake establishes a secure connection between a client and an access point. Both sides share a Pre-Shared Key (PSK) which is used to derive the Pairwise Master Key (PMK). The AP sends a random ANonce, the client generates an SNonce, and together they derive the Pairwise Transient Key (PTK) used for encrypting unicast traffic. The Group Temporal Key (GTK) handles broadcast traffic. Message Integrity Codes (MIC) prove each side knows the PMK without revealing it.',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    settings: 'Settings', language: 'Language', theme: 'Theme', soundEffects: 'Sound effects',
    help: 'Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1: 'Click Play to start the handshake animation.',
    howto_2: 'Watch each step highlight as messages are exchanged.',
    howto_3: 'See cryptographic keys appear in the Key Derivation section.',
    howto_4: 'Check the Timeline for a chronological log of events.',
    wiki_hs_title: '4-Way Handshake', wiki_hs: 'The WPA2 handshake uses EAPOL frames to establish encryption without revealing the password.',
    wiki_keys_title: 'Key Hierarchy', wiki_keys: 'PSK → PMK → PTK (unicast) + GTK (broadcast). Each session gets unique keys.',
    wiki_privacy_title: 'Privacy', wiki_privacy: 'Local-first, privacy-first. All data stays in your browser.',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: 'Handshake Theater ready!', logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    splashHint: 'tap to skip', working: 'Working...',
    langChanged: 'Language → English', themeChanged: 'Theme →',
    hsStarted: 'Handshake animation started', hsComplete: 'Handshake complete — encrypted session established!',
    hsReset: 'Handshake reset',
    tl1: 'AP generates random ANonce', tl2: 'AP sends EAPOL Message 1 (ANonce)', tl3: 'Client generates SNonce',
    tl4: 'Client derives PTK from PMK + ANonce + SNonce', tl5: 'Client sends EAPOL Message 2 (SNonce + MIC)',
    tl6: 'AP derives PTK, verifies MIC', tl7: 'AP sends EAPOL Message 3 (encrypted GTK + MIC)',
    tl8: 'Client installs PTK and GTK', tl9: 'Client sends EAPOL Message 4 (ACK)',
    tl10: 'Secure encrypted session established',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates WiFi! 🔬 You get to experiment with WiFi signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real WiFi signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real wireless networks! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Wifi Sonar and Wifi Packet Microscope! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'WiFi Signals',learn1Desc:'How wireless networks broadcast and receive data',learn1Tag:'WiFi',learn2Title:'WiFi Security',learn2Desc:'How encryption protects wireless connections',learn2Tag:'Security',learn3Title:'Channel Analysis',learn3Desc:'How WiFi channels share the radio spectrum',learn3Tag:'Spectrum',learn4Title:'WiFi Monitoring',learn4Desc:'How to detect rogue access points and attacks',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',learnAge:'Ages:'},
  fr: {
    title: 'Handshake Theater — WPA 4 Etapes', subtitle: 'Regardez le handshake WPA2 se derouler',
    disconnected: 'Inactif', connected: 'Authentification',
    mainSection: 'Handshake 4 Etapes', mainDesc: 'Animation d\'authentification WPA2 etape par etape',
    sectionA: 'Derivation des Cles', sectionB: 'Chronologie', sectionC: 'Comment ca marche',
    start: 'Jouer', reset: 'Reinitialiser', client: 'Client (STA)', ap: 'Point d\'Acces (AP)',
    step1Title: 'AP → Client : ANonce', step1Desc: 'L\'AP envoie son nonce aleatoire (ANonce) au client',
    step2Title: 'Client → AP : SNonce + MIC', step2Desc: 'Le client genere SNonce, derive PTK, envoie SNonce avec preuve MIC',
    step3Title: 'AP → Client : GTK + MIC', step3Desc: 'L\'AP derive PTK, verifie MIC, envoie GTK chiffre avec MIC',
    step4Title: 'Client → AP : ACK', step4Desc: 'Le client confirme l\'installation du GTK, handshake termine',
    keyDesc: 'Cles cryptographiques generees pendant le handshake',
    howItWorksText: 'Le handshake WPA2 en 4 etapes etablit une connexion securisee entre un client et un point d\'acces. Les deux cotes partagent une cle pre-partagee (PSK) utilisee pour deriver la cle PMK. L\'AP envoie un ANonce, le client genere un SNonce, et ensemble ils derivent le PTK pour chiffrer le trafic.',
    activityLog: 'Journal', eventsMsg: 'Evenements', clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    settings: 'Parametres', language: 'Langue', theme: 'Theme', soundEffects: 'Effets sonores',
    help: 'Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1: 'Cliquez Jouer pour lancer.', howto_2: 'Observez chaque etape.',
    howto_3: 'Voyez les cles apparaitre.', howto_4: 'Consultez la chronologie.',
    wiki_hs_title: 'Handshake', wiki_hs: 'Le handshake WPA2 utilise EAPOL.',
    wiki_keys_title: 'Cles', wiki_keys: 'PSK → PMK → PTK + GTK.',
    wiki_privacy_title: 'Confidentialite', wiki_privacy: 'Tout reste dans votre navigateur.',
    t_mosque: 'Mosquee', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad', t_medina: 'Medina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    ready: 'Theater pret !', logCleared: 'Journal efface', copied: 'Copie !', copyFail: 'Echec',
    splashHint: 'appuyer pour passer', working: 'En cours...',
    langChanged: 'Langue → Francais', themeChanged: 'Theme →',
    hsStarted: 'Animation demarree', hsComplete: 'Handshake termine !', hsReset: 'Reinitialise',
    tl1: 'AP genere ANonce', tl2: 'AP envoie Message 1', tl3: 'Client genere SNonce',
    tl4: 'Client derive PTK', tl5: 'Client envoie Message 2', tl6: 'AP verifie MIC',
    tl7: 'AP envoie Message 3', tl8: 'Client installe cles', tl9: 'Client envoie Message 4',
    tl10: 'Session chiffree etablie',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule WiFi ! 🔬 Tu peux expérimenter avec WiFi signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais WiFi signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai wireless networks ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Wifi Sonar and Wifi Packet Microscope ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'WiFi Signals',learn1Desc:'How wireless networks broadcast and receive data',learn1Tag:'WiFi',learn2Title:'WiFi Security',learn2Desc:'How encryption protects wireless connections',learn2Tag:'Security',learn3Title:'Channel Analysis',learn3Desc:'How WiFi channels share the radio spectrum',learn3Tag:'Spectrum',learn4Title:'WiFi Monitoring',learn4Desc:'How to detect rogue access points and attacks',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',learnAge:'Âge :'},
  ar: {
    title: 'مسرح المصافحة — WPA رباعي', subtitle: 'شاهد مصافحة WPA2 الرباعية تتكشف',
    disconnected: 'خامل', connected: 'مصافحة',
    mainSection: 'المصافحة الرباعية', mainDesc: 'رسوم متحركة لمصادقة WPA2 خطوة بخطوة',
    sectionA: 'اشتقاق المفاتيح', sectionB: 'الجدول الزمني', sectionC: 'كيف يعمل',
    start: 'تشغيل', reset: 'إعادة', client: 'العميل (STA)', ap: 'نقطة الوصول (AP)',
    step1Title: 'AP → العميل: ANonce', step1Desc: 'ترسل نقطة الوصول رقمها العشوائي',
    step2Title: 'العميل → AP: SNonce + MIC', step2Desc: 'يولد العميل SNonce ويشتق PTK',
    step3Title: 'AP → العميل: GTK + MIC', step3Desc: 'تشتق نقطة الوصول PTK وترسل GTK',
    step4Title: 'العميل → AP: تأكيد', step4Desc: 'يؤكد العميل التثبيت',
    keyDesc: 'المفاتيح المشفرة المولدة أثناء المصافحة',
    howItWorksText: 'تؤسس مصافحة WPA2 الرباعية اتصالاً آمناً. يتشارك الطرفان مفتاحاً مسبقاً لاشتقاق المفاتيح المؤقتة للتشفير.',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث', clear: 'مسح', copy: 'نسخ', export: 'تصدير', filterAll: 'الكل',
    settings: 'الإعدادات', language: 'اللغة', theme: 'المظهر', soundEffects: 'مؤثرات صوتية',
    help: 'مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    howto_1: 'انقر تشغيل.', howto_2: 'شاهد الخطوات.',
    howto_3: 'شاهد المفاتيح.', howto_4: 'تحقق من الجدول الزمني.',
    wiki_hs_title: 'المصافحة', wiki_hs: 'تستخدم إطارات EAPOL.',
    wiki_keys_title: 'المفاتيح', wiki_keys: 'PSK → PMK → PTK + GTK.',
    wiki_privacy_title: 'الخصوصية', wiki_privacy: 'كل البيانات في متصفحك.',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    ready: 'مسرح المصافحة جاهز!', logCleared: 'تم المسح', copied: 'تم النسخ!', copyFail: 'فشل',
    splashHint: 'انقر للتخطي', working: 'جارٍ...',
    langChanged: 'اللغة ← العربية', themeChanged: 'المظهر ←',
    hsStarted: 'بدأت الرسوم', hsComplete: 'مصافحة مكتملة!', hsReset: 'تم إعادة التعيين',
    tl1: 'AP يولد ANonce', tl2: 'AP يرسل الرسالة 1', tl3: 'العميل يولد SNonce',
    tl4: 'العميل يشتق PTK', tl5: 'العميل يرسل الرسالة 2', tl6: 'AP يتحقق',
    tl7: 'AP يرسل الرسالة 3', tl8: 'العميل يثبت المفاتيح', tl9: 'العميل يرسل الرسالة 4',
    tl10: 'جلسة مشفرة',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي WiFi! 🔬 يمكنك التجربة مع WiFi signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج WiFi signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا wireless networks حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Wifi Sonar and Wifi Packet Microscope! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'WiFi Signals',learn1Desc:'How wireless networks broadcast and receive data',learn1Tag:'WiFi',learn2Title:'WiFi Security',learn2Desc:'How encryption protects wireless connections',learn2Tag:'Security',learn3Title:'Channel Analysis',learn3Desc:'How WiFi channels share the radio spectrum',learn3Tag:'Spectrum',learn4Title:'WiFi Monitoring',learn4Desc:'How to detect rogue access points and attacks',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',learnAge:'العمر:'}
};

let currentLang = 'en';
function setLanguage(lang) {
  currentLang = lang; const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => { const k = opt.dataset.i18nOpt; if (s[k] != null) opt.textContent = s[k]; });
  document.title = `${s.title} — Workshop DIY`;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info');
}

const THEME_MELODIES = { 'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523] };
function playThemeMelody(name) { if (!soundEnabled || !audioCtx) return; const notes = THEME_MELODIES[name]; if (!notes) return; const t = audioCtx.currentTime; notes.forEach((freq, i) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type = 'sine'; o.frequency.value = freq; g.gain.value = 0.06; g.gain.exponentialRampToValueAtTime(0.001, t + 0.2 + i * 0.15 + 0.15); o.start(t + i * 0.15); o.stop(t + i * 0.15 + 0.2); }); }
function setTheme(name) { document.documentElement.dataset.theme = name; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name)); const sel = $('themeSelect'); if (sel) sel.value = name; try { localStorage.setItem('wdiy-theme', name); } catch {} playThemeMelody(name); log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_' + name] || name}`, 'info'); }

let logContainer;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = `log-line ${type}`; d.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (type === 'success') playSound('success'); else if (type === 'error') playSound('error'); applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const t = Array.from(logContainer.children).map(d => d.textContent).join('\n'); try { await navigator.clipboard.writeText(t); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const lines = Array.from(logContainer.children).map(d => d.textContent); const blob = new Blob([lines.join('\n')], { type: 'text/plain' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `handshake-log-${new Date().toISOString().slice(0,10)}.txt`; a.click(); URL.revokeObjectURL(url); }

function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(connected) { const pill = $('statusPill'), txt = $('statusText'), s = LANG[currentLang]; if (txt) txt.textContent = connected ? s.connected : s.disconnected; if (pill) pill.classList.toggle('connected', connected); }

let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }

let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); playSound('click'); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(line => { line.style.display = (activeLogFilter === 'all' || line.classList.contains(activeLogFilter)) ? '' : 'none'; }); }

function openPanel(pid, oid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(pid, oid, rid) { const sb = $(pid), ov = $(oid); if (sb) sb.classList.remove('open'); if (ov) ov.classList.remove('open'); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); }
function closeHelp() { closePanel('helpPanel', 'helpOverlay'); }
let logWasOpen = false;
function openSettings() { const l = $('logPanel'); logWasOpen = l && l.classList.contains('open'); if (logWasOpen) closeLog(); openPanel('settingsPanel', 'settingsOverlay'); }
function closeSettings() { closePanel('settingsPanel', 'settingsOverlay'); if (logWasOpen) { openLog(); logWasOpen = false; } }
function openLog() { const sb = $('logPanel'); if (sb) sb.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const sb = $('logPanel'); if (sb) sb.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const sb = $('logPanel'); if (sb && sb.classList.contains('open')) closeLog(); else openLog(); }
function closeAllPanels() { closeHelp(); closeSettings(); closeLog(); }
function initHelpTabs() { const tabs = document.querySelectorAll('.help-tab'), contents = document.querySelectorAll('.help-content'); tabs.forEach(tab => { tab.addEventListener('click', () => { tabs.forEach(t => t.classList.remove('active')); contents.forEach(c => c.classList.remove('active')); tab.classList.add('active'); const target = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)); if (target) target.classList.add('active'); }); }); }
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day:'numeric', month:'long', year:'numeric' }).format(new Date()); } catch {} }
function initLogResize() { const handle = $('logResizeHandle'), panel = $('logPanel'); if (!handle || !panel) return; let dragging = false, startX, startW; const isRtl = () => document.documentElement.dir === 'rtl'; handle.addEventListener('mousedown', e => { dragging = true; startX = e.clientX; startW = panel.offsetWidth; handle.classList.add('active'); document.body.style.cursor = 'col-resize'; e.preventDefault(); }); document.addEventListener('mousemove', e => { if (!dragging) return; const dx = isRtl() ? (e.clientX - startX) : (startX - e.clientX); document.documentElement.style.setProperty('--log-width', Math.max(200, Math.min(startW + dx, window.innerWidth * 0.6)) + 'px'); }); document.addEventListener('mouseup', () => { if (!dragging) return; dragging = false; handle.classList.remove('active'); document.body.style.cursor = ''; }); }

/* ═══════════════════════════════════════════════════════════════
   APP LOGIC — Handshake Theater
   ═══════════════════════════════════════════════════════════════ */

function randHex(len) { return Array.from({length: len}, () => Math.floor(Math.random()*256).toString(16).padStart(2,'0')).join(''); }

let hsRunning = false, currentStep = 0, hsTimeout = null;
let keys = { pmk: '', anonce: '', snonce: '', ptk: '', gtk: '', mic: '' };
let timelineEntries = [];

function resetHandshake() {
  hsRunning = false; currentStep = 0;
  if (hsTimeout) clearTimeout(hsTimeout);
  timelineEntries = [];
  keys = { pmk: '', anonce: '', snonce: '', ptk: '', gtk: '', mic: '' };
  for (let i = 1; i <= 4; i++) { const step = $('step' + i); if (step) step.classList.remove('active', 'done'); }
  const status = $('hsStatus'); if (status) { status.textContent = ''; status.style.cssText = ''; }
  ['keyPMK','keyANonce','keySNonce','keyPTK','keyGTK','keyMIC'].forEach(id => { const el = $(id); if (el) el.textContent = '—'; });
  const tl = $('timeline'); if (tl) tl.innerHTML = '';
  setStatus(false); $('startBtn').disabled = false;
  log(LANG[currentLang].hsReset, 'info');
}

function addTimeline(msg) {
  timelineEntries.push({ time: new Date().toLocaleTimeString(), msg });
  const tl = $('timeline'); if (!tl) return;
  const entry = document.createElement('div');
  entry.style.cssText = 'padding:4px 0;border-bottom:1px solid var(--border);display:flex;gap:8px';
  entry.innerHTML = `<span style="color:var(--accent);font-family:monospace;font-size:.7rem;min-width:70px">${timelineEntries.length}. ${new Date().toLocaleTimeString()}</span><span>${msg}</span>`;
  tl.appendChild(entry);
}

function runStep(stepNum) {
  if (stepNum > 4) {
    const status = $('hsStatus');
    if (status) { status.textContent = LANG[currentLang].hsComplete; status.style.cssText = 'background:rgba(134,239,172,.15);color:#86efac;border:1px solid rgba(134,239,172,.3);border-radius:10px'; }
    setStatus(false); hsRunning = false;
    addTimeline(LANG[currentLang].tl10);
    log(LANG[currentLang].hsComplete, 'success');
    $('startBtn').disabled = false; return;
  }
  const s = LANG[currentLang];
  if (stepNum > 1) { const prev = $('step' + (stepNum - 1)); if (prev) { prev.classList.remove('active'); prev.classList.add('done'); } }
  const step = $('step' + stepNum); if (step) step.classList.add('active');

  switch (stepNum) {
    case 1:
      keys.pmk = randHex(32); keys.anonce = randHex(32);
      $('keyPMK').textContent = keys.pmk; $('keyANonce').textContent = keys.anonce;
      addTimeline(s.tl1); addTimeline(s.tl2);
      log('EAPOL Msg 1: AP → Client (ANonce)', 'tx'); break;
    case 2:
      keys.snonce = randHex(32); keys.ptk = randHex(48); keys.mic = randHex(16);
      $('keySNonce').textContent = keys.snonce; $('keyPTK').textContent = keys.ptk; $('keyMIC').textContent = keys.mic;
      addTimeline(s.tl3); addTimeline(s.tl4); addTimeline(s.tl5);
      log('EAPOL Msg 2: Client → AP (SNonce + MIC)', 'rx'); break;
    case 3:
      keys.gtk = randHex(32); keys.mic = randHex(16);
      $('keyGTK').textContent = keys.gtk; $('keyMIC').textContent = keys.mic;
      addTimeline(s.tl6); addTimeline(s.tl7);
      log('EAPOL Msg 3: AP → Client (GTK + MIC)', 'tx'); break;
    case 4:
      addTimeline(s.tl8); addTimeline(s.tl9);
      log('EAPOL Msg 4: Client → AP (ACK)', 'rx'); break;
  }
  currentStep = stepNum;
  hsTimeout = setTimeout(() => runStep(stepNum + 1), 2000);
}

function startHandshake() {
  if (hsRunning) return;
  resetHandshake(); hsRunning = true; setStatus(true);
  $('startBtn').disabled = true;
  log(LANG[currentLang].hsStarted, 'success');
  hsTimeout = setTimeout(() => runStep(1), 500);
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash(); const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
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
  if (soundTgl) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} soundTgl.checked = soundEnabled; soundTgl.addEventListener('change', () => { soundEnabled = soundTgl.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} if (soundEnabled) playSound('click'); }); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllPanels(); });
  const langSel = $('langSelect'); if (langSel) langSel.addEventListener('change', () => setLanguage(langSel.value));
  const themeSel = $('themeSelect'); if (themeSel) themeSel.addEventListener('change', () => setTheme(themeSel.value));
  try { const savedLang = localStorage.getItem('wdiy-lang'); const savedTheme = localStorage.getItem('wdiy-theme'); if (savedTheme) setTheme(savedTheme); if (savedLang) setLanguage(savedLang); } catch {}
  initHijriDate();
  const startBtn = $('startBtn'), resetBtn = $('resetBtn');
  if (startBtn) startBtn.onclick = startHandshake;
  if (resetBtn) resetBtn.onclick = resetHandshake;
  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();

/* ═══════ RICH CANVAS SIMULATION — WPA Handshake Packet Flow ═══════ */
(function handshakeCanvas(){
  const CVS_ID='handshakeFlowVis';
  function ensureCanvas(){
    if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);
    const wrap=document.querySelector('.section-card')||document.querySelector('.main-section')||document.querySelector('main');
    if(!wrap)return null;
    const card=document.createElement('div');card.className='section-card';
    card.innerHTML='<div class="section-header"><span class="section-icon">🤝</span> Handshake Packet Flow</div>';
    const c=document.createElement('canvas');c.id=CVS_ID;
    c.style.cssText='width:100%;height:300px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';
    card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c;
  }
  const packets=[];let _raf=null,frameCount=0;
  const stepColors=['#3b82f6','#22c55e','#fbbf24','#a855f7'];
  const stepLabels=['ANonce','SNonce+MIC','GTK+MIC','ACK'];
  function draw(){
    const c=document.getElementById(CVS_ID);if(!c){_raf=null;return;}
    const ctx=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;
    ctx.scale(2,2);const w=W/2,h=H/2;
    ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);
    frameCount++;
    const apX=w*0.15,staX=w*0.85,topY=50,botY=h-30;
    // AP and STA towers
    ctx.fillStyle='rgba(34,197,94,0.15)';ctx.fillRect(apX-20,topY-20,40,botY-topY+40);
    ctx.fillStyle='rgba(59,130,246,0.15)';ctx.fillRect(staX-20,topY-20,40,botY-topY+40);
    // Labels
    ctx.font='bold 10px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillStyle='#22c55e';ctx.fillText('AP',apX,topY-28);
    ctx.fillStyle='#3b82f6';ctx.fillText('STA',staX,topY-28);
    // Vertical lines
    ctx.beginPath();ctx.setLineDash([2,4]);
    ctx.moveTo(apX,topY);ctx.lineTo(apX,botY);
    ctx.moveTo(staX,topY);ctx.lineTo(staX,botY);
    ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);
    // Step indicators
    const cStep=typeof currentStep!=='undefined'?currentStep:0;
    for(let i=0;i<4;i++){
      const y=topY+30+i*(botY-topY-60)/3;
      const fromLeft=i%2===0;
      const fromX=fromLeft?apX:staX;const toX=fromLeft?staX:apX;
      const active=i<cStep;const current=i===cStep-1;
      // Arrow line
      ctx.beginPath();ctx.moveTo(fromX+10*(fromLeft?1:-1),y);ctx.lineTo(toX-10*(fromLeft?1:-1),y);
      ctx.strokeStyle=active?stepColors[i]+'90':'rgba(255,255,255,0.08)';
      ctx.lineWidth=active?2:1;ctx.stroke();
      // Arrowhead
      if(active){
        const dir=fromLeft?1:-1;
        ctx.beginPath();
        ctx.moveTo(toX-15*dir,y-5);ctx.lineTo(toX-5*dir,y);ctx.lineTo(toX-15*dir,y+5);
        ctx.strokeStyle=stepColors[i];ctx.lineWidth=2;ctx.stroke();
      }
      // Label
      ctx.font='8px monospace';ctx.fillStyle=active?stepColors[i]+'cc':'rgba(255,255,255,0.2)';
      ctx.textAlign='center';ctx.fillText('Msg '+(i+1)+': '+stepLabels[i],(apX+staX)/2,y-6);
      // Animate packet blob on current step
      if(current){
        const t=(frameCount%60)/60;
        const px=fromX+(toX-fromX)*t;
        ctx.beginPath();ctx.arc(px,y,5,0,Math.PI*2);
        ctx.fillStyle=stepColors[i];ctx.fill();
        // Trail
        for(let tr=1;tr<=5;tr++){
          const tt=Math.max(0,t-tr*0.04);
          const tx=fromX+(toX-fromX)*tt;
          ctx.beginPath();ctx.arc(tx,y,3,0,Math.PI*2);
          ctx.fillStyle=stepColors[i];ctx.globalAlpha=0.3-tr*0.05;ctx.fill();
        }
        ctx.globalAlpha=1;
      }
    }
    // Key exchange visualization — encrypted data flowing
    if(cStep>=4){
      // Encrypted tunnel effect
      const tunnelY=(topY+botY)/2;
      for(let i=0;i<15;i++){
        const t=((frameCount*2+i*20)%((staX-apX)))/((staX-apX));
        const px=apX+t*(staX-apX);
        const py=tunnelY+Math.sin(t*Math.PI*4+frameCount*0.05)*15;
        ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);
        ctx.fillStyle='#86efac';ctx.globalAlpha=0.3+Math.sin(t*Math.PI)*0.3;ctx.fill();
      }
      ctx.globalAlpha=1;
      ctx.font='bold 10px monospace';ctx.fillStyle='#86efac';ctx.textAlign='center';
      ctx.fillText('ENCRYPTED SESSION ACTIVE',(apX+staX)/2,botY+10);
    }
    // Crypto key particles floating around
    if(typeof hsRunning!=='undefined'&&hsRunning){
      for(let i=0;i<3;i++){
        const kx=w*0.3+Math.sin(frameCount*0.02+i*2)*w*0.15;
        const ky=h*0.3+Math.cos(frameCount*0.015+i*3)*h*0.15;
        ctx.font='7px monospace';ctx.fillStyle='rgba(168,85,247,0.25)';ctx.textAlign='center';
        ctx.fillText('0x'+Math.floor(Math.sin(frameCount*0.01+i)*999999).toString(16),kx,ky);
      }
    }
    _raf=requestAnimationFrame(draw);
  }
  function boot(){const c=ensureCanvas();if(!c)return setTimeout(boot,500);if(!_raf)draw();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
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
