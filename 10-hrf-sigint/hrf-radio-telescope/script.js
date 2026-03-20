/**
 * Radio Telescope — Hydrogen Line — Workshop DIY
 * Simulated 1420.405 MHz hydrogen line radio astronomy
 * Themes . i18n . RTL . Log . Toast . Status . Panels . Sound
 */

const $ = id => document.getElementById(id);

const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;

const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.2';

let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;

function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch (type) {
    case 'click': osc.frequency.value = 800; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08); osc.start(t); osc.stop(t + 0.08); break;
    case 'success': osc.frequency.value = 523; osc.type = 'sine'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3); osc.start(t); osc.stop(t + 0.3); break;
    case 'error': osc.frequency.value = 200; osc.type = 'square'; gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25); osc.start(t); osc.stop(t + 0.25); break;
  }
}

/* ======= i18n ======= */
const LANG = {
  en: {
    title: 'Radio Telescope', subtitle: '🔭 1420 MHz hydrogen line radio astronomy',
    disconnected: 'Disconnected', connected: 'Connected',
    mainSection: 'Radio Telescope — Hydrogen Line', mainDesc: '1420.405 MHz hydrogen emission spectrum',
    sectionA: 'Galaxy Rotation Curve', sectionB: 'Observation Log', sectionC: 'Hydrogen Line Explained',
    activityLog: 'Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', filterAll: 'All',
    theme: 'Theme', settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    howto_1: 'Click "Start Observation" to begin simulated hydrogen line reception.',
    howto_2: 'Watch the spectrum build up around 1420.405 MHz.',
    howto_3: 'Adjust gain and averaging to improve signal visibility.',
    howto_4: 'Check the galaxy rotation curve derived from Doppler measurements.',
    wiki_h1_title: '📡 Hydrogen Line', wiki_h1: '21 cm emission at 1420.405 MHz from neutral hydrogen spin-flip transitions.',
    wiki_doppler_title: '🌀 Doppler Effect', wiki_doppler: 'Frequency shifts reveal radial velocity of hydrogen gas clouds.',
    wiki_privacy_title: '🔒 Privacy', wiki_privacy: 'All data stays in your browser.',
    working: 'Working...', ready: '🔭 Radio Telescope ready!',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus',
    t_riad: 'Riad', t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
    logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    soundEffects: '🔊 Sound effects', whisperMode: 'Whisper mode',
    breathingGuide: 'Breathing guide', dhikrTap: 'Tap', musicMode: 'Music reactive',
    splashHint: 'tap to skip', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    startScan: 'Start Observation', stopScan: 'Stop', integration: 'integration',
    gainLabel: 'Gain:', avgLabel: 'Averaging:',
    peakLabel: 'Peak Power (dB)', peakFreqLabel: 'Peak Freq (MHz)',
    dopplerLabel: 'Doppler (km/s)', snrLabel: 'SNR (dB)',
    rotationHint: 'Doppler shifts in the hydrogen line reveal how fast different parts of the galaxy rotate',
    h1Info: 'The hydrogen line (21 cm line) at 1420.405 MHz is emitted by neutral hydrogen atoms when the electron spin-flips. This transition is detectable across the galaxy due to the vast amount of hydrogen in interstellar space. By measuring Doppler shifts, radio astronomers map the rotation of the Milky Way.',
    obsStarted: '📡 Observation started — tuned to 1420.405 MHz', obsStopped: '🔴 Observation stopped',
    h1Detected: '🌟 Hydrogen line detected!', signalUpdate: '📊 Signal update',step1Title:'Configure RF',step1Desc:'Set the frequency band, modulation type, and signal parameters.',step2Title:'Capture Spectrum',step2Desc:'Scan the radio spectrum to detect and capture signals of interest.',step3Title:'Analyze Signal',step3Desc:'Apply signal processing to identify modulation, encoding, and source.',step4Title:'Classify & Report',step4Desc:'Categorize the signal type and log detailed analysis results.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF signals! 🔬 You get to experiment with radio frequency patterns in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real radio frequency patterns so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real signal intelligence! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need RTL-SDR or HackRF. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Hrf Fm Pirate Radio and Hrf Pager Decoder! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',learnAge:'Ages:'},
  fr: {
    title: 'Radiotélescope', subtitle: '🔭 Radioastronomie — raie hydrogène 1420 MHz',
    disconnected: 'Déconnecté', connected: 'Connecté',
    mainSection: 'Radiotélescope — Raie Hydrogène', mainDesc: 'Spectre d\'émission hydrogène à 1420.405 MHz',
    sectionA: 'Courbe de rotation galactique', sectionB: 'Journal d\'observation', sectionC: 'Raie hydrogène expliquée',
    activityLog: 'Journal', eventsMsg: 'Événements et messages',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', filterAll: 'Tout',
    theme: 'Thème', settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    howto_1: 'Cliquez "Démarrer" pour lancer l\'observation simulée.',
    howto_2: 'Observez le spectre se construire autour de 1420.405 MHz.',
    howto_3: 'Ajustez le gain et le moyennage pour améliorer la visibilité.',
    howto_4: 'Consultez la courbe de rotation galactique.',
    wiki_h1_title: '📡 Raie Hydrogène', wiki_h1: 'Émission à 21 cm / 1420.405 MHz.',
    wiki_doppler_title: '🌀 Effet Doppler', wiki_doppler: 'Les décalages fréquentiels révèlent la vitesse radiale du gaz.',
    wiki_privacy_title: '🔒 Confidentialité', wiki_privacy: 'Tout reste dans votre navigateur.',
    working: 'En cours...', ready: '🔭 Radiotélescope prêt !',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous',
    t_riad: 'Riad', t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
    logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    soundEffects: '🔊 Effets sonores', whisperMode: 'Mode murmure',
    breathingGuide: 'Guide respiratoire', dhikrTap: 'Tap', musicMode: 'Réactif musique',
    splashHint: 'appuyer pour passer', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    startScan: 'Démarrer', stopScan: 'Arrêter', integration: 'intégration',
    gainLabel: 'Gain :', avgLabel: 'Moyennage :',
    peakLabel: 'Puissance crête (dB)', peakFreqLabel: 'Fréq. crête (MHz)',
    dopplerLabel: 'Doppler (km/s)', snrLabel: 'RSB (dB)',
    rotationHint: 'Les décalages Doppler révèlent la vitesse de rotation des parties de la galaxie',
    h1Info: 'La raie hydrogène à 1420.405 MHz est émise par l\'hydrogène neutre lors du retournement de spin de l\'électron.',
    obsStarted: '📡 Observation démarrée — accordé sur 1420.405 MHz', obsStopped: '🔴 Observation arrêtée',
    h1Detected: '🌟 Raie hydrogène détectée !', signalUpdate: '📊 Mise à jour signal',step1Title:'Configurer RF',step1Desc:'Règle la bande de fréquence, le type de modulation et les paramètres.',step2Title:'Capturer le spectre',step2Desc:'Scanne le spectre radio pour détecter et capturer les signaux.',step3Title:'Analyser le signal',step3Desc:'Applique le traitement du signal pour identifier la modulation et la source.',step4Title:'Classifier et rapporter',step4Desc:'Catégorise le type de signal et enregistre les résultats.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF signals ! 🔬 Tu peux expérimenter avec radio frequency patterns en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio frequency patterns.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai signal intelligence ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR or HackRF. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Hrf Fm Pirate Radio and Hrf Pager Decoder ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',learnAge:'Âge :'},
  ar: {
    title: 'تلسكوب راديوي', subtitle: '🔭 فلك راديوي — خط الهيدروجين 1420 ميغاهرتز',
    disconnected: 'غير متصل', connected: 'متصل',
    mainSection: 'تلسكوب راديوي — خط الهيدروجين', mainDesc: 'طيف انبعاث الهيدروجين عند 1420.405 ميغاهرتز',
    sectionA: 'منحنى دوران المجرة', sectionB: 'سجل الرصد', sectionC: 'شرح خط الهيدروجين',
    activityLog: 'سجل النشاط', eventsMsg: 'الأحداث والرسائل',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', filterAll: 'الكل',
    theme: 'المظهر', settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيف تستخدم', wiki: 'ويكي',
    howto_1: 'اضغط "بدء الرصد" لتشغيل محاكاة استقبال خط الهيدروجين.',
    howto_2: 'شاهد الطيف يتشكل حول 1420.405 ميغاهرتز.',
    howto_3: 'اضبط الكسب والتوسيط لتحسين رؤية الإشارة.',
    howto_4: 'تابع منحنى دوران المجرة.',
    wiki_h1_title: '📡 خط الهيدروجين', wiki_h1: 'انبعاث 21 سم عند 1420.405 ميغاهرتز.',
    wiki_doppler_title: '🌀 تأثير دوبلر', wiki_doppler: 'انزياحات التردد تكشف سرعة سحب الغاز.',
    wiki_privacy_title: '🔒 الخصوصية', wiki_privacy: 'كل البيانات تبقى في متصفحك.',
    working: 'جارٍ...', ready: '🔭 التلسكوب الراديوي جاهز!',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس',
    t_riad: 'رياض', t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
    logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل النسخ',
    soundEffects: '🔊 مؤثرات صوتية', whisperMode: 'وضع الهمس',
    breathingGuide: 'دليل التنفس', dhikrTap: 'اضغط', musicMode: 'تفاعل موسيقي',
    splashHint: 'انقر للتخطي', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    startScan: 'بدء الرصد', stopScan: 'إيقاف', integration: 'تكامل',
    gainLabel: 'الكسب:', avgLabel: 'التوسيط:',
    peakLabel: 'القدرة القصوى (dB)', peakFreqLabel: 'تردد القمة (MHz)',
    dopplerLabel: 'دوبلر (كم/ث)', snrLabel: 'نسبة الإشارة للضجيج (dB)',
    rotationHint: 'انزياحات دوبلر في خط الهيدروجين تكشف سرعة دوران أجزاء المجرة',
    h1Info: 'خط الهيدروجين عند 1420.405 ميغاهرتز ينبعث من ذرات الهيدروجين المحايدة عند انقلاب دوران الإلكترون.',
    obsStarted: '📡 بدأ الرصد — مضبوط على 1420.405 ميغاهرتز', obsStopped: '🔴 توقف الرصد',
    h1Detected: '🌟 تم كشف خط الهيدروجين!', signalUpdate: '📊 تحديث الإشارة',step1Title:'تكوين RF',step1Desc:'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.',step2Title:'التقاط الطيف',step2Desc:'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.',step3Title:'تحليل الإشارة',step3Desc:'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.',step4Title:'تصنيف والتقرير',step4Desc:'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF signals! 🔬 يمكنك التجربة مع radio frequency patterns في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio frequency patterns حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا signal intelligence حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR or HackRF. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Hrf Fm Pirate Radio and Hrf Pager Decoder! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',learnAge:'العمر:'}
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

const THEME_MELODIES = {'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function setTheme(name) {
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if (sel) sel.value = name;
  try { localStorage.setItem('wdiy-theme', name); } catch {}
  playThemeMelody(name);
  log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+name]||name}`, 'info');
}
function playThemeMelody(name) {
  if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx();
  const notes = THEME_MELODIES[name]; if (!notes) return; const t = audioCtx.currentTime;
  notes.forEach((freq, i) => { const o = audioCtx.createOscillator(), g = audioCtx.createGain(); o.connect(g); g.connect(audioCtx.destination); o.type='sine'; o.frequency.value=freq; g.gain.value=0.06; g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15); o.start(t+i*0.15); o.stop(t+i*0.15+0.2); });
}

/* ======= LOG ======= */
let logContainer, typewriterEnabled = true;
const logHistory = [];
function log(msg, type='info') {
  if (!logContainer) logContainer=$('logContainer'); if (!logContainer) return;
  const d=document.createElement('div'); d.className=`log-line ${type}`;
  const fullText=`[${new Date().toLocaleTimeString()}] ${msg}`;
  if (typewriterEnabled){logContainer.appendChild(d);typewriterAppend(d,fullText);}
  else{d.textContent=fullText;logContainer.appendChild(d);}
  logContainer.scrollTop=logContainer.scrollHeight;
  if(type==='success')playSound('success'); else if(type==='error')playSound('error');
  logHistory.push({msg,type,ts:Date.now()}); applyLogFilter();
}
async function typewriterAppend(el,text){el.classList.add('typing');el.textContent='';for(let i=0;i<text.length;i++){el.textContent+=text[i];if(el.parentElement)el.parentElement.scrollTop=el.parentElement.scrollHeight;await sleep(8+Math.random()*12);}el.classList.remove('typing');}
function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const text=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const blob=new Blob([text],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`radio-telescope-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(url);}

let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}

let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(c){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=c?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',c);}

let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}

const FOCUSABLE='button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])';
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
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab,tid='help'+n.charAt(0).toUpperCase()+n.slice(1);const target=$(tid);if(target)target.classList.add('active');});});}
function initLogResize(){const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;let dragging=false,startX,startW;const isRtl=()=>document.documentElement.dir==='rtl';handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=isRtl()?(e.clientX-startX):(startX-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(startW+dx,window.innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

let whisperActive=false;
function toggleWhisper(){whisperActive=!whisperActive;log(whisperActive?'🎤 Whisper mode on':'🎤 Whisper mode off','info');}
let breathingActive=false;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));log(breathingActive?'🫁 Breathing guide on':'🫁 Breathing guide off','info');}
let dhikrCount=0;
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;playSound('click');}
function toggleMusicMode(){log('🎵 Music mode toggled','info');}

let matrixRunning=false,matrixAnim=null;
const ARABIC_CHARS='بسمالرحنيوكلتعدفقثصضطظغشزخجذأؤئإءةىآ٠١٢٣٤٥٦٧٨٩';
function toggleMatrix(){const canvas=$('matrixCanvas');if(!canvas)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);canvas.classList.remove('active');return;}matrixRunning=true;canvas.classList.add('active');const ctx=canvas.getContext('2d');canvas.width=window.innerWidth;canvas.height=window.innerHeight;const cols=Math.floor(canvas.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri,serif';for(let i=0;i<drops.length;i++){const ch=ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)];ctx.fillText(ch,i*16,drops[i]*16);if(drops[i]*16>canvas.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}matrixAnim=requestAnimationFrame(draw);}draw();}
let logoClickCount=0,logoClickTimer=null;
function initMatrixTrigger(){const logo=$('logoWrap');if(!logo)return;logo.style.cursor='pointer';logo.addEventListener('click',()=>{logoClickCount++;if(logoClickTimer)clearTimeout(logoClickTimer);if(logoClickCount>=3){logoClickCount=0;toggleMatrix();}else{logoClickTimer=setTimeout(()=>logoClickCount=0,500);}});}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI CODE — RETRO!','success');}}else konamiIdx=0;});}

/* =======================================================================
   RADIO TELESCOPE — HYDROGEN LINE SIMULATION ENGINE
   ======================================================================= */

const H1_FREQ = 1420.405;  // MHz — hydrogen line
const BANDWIDTH = 4.0;     // MHz total bandwidth displayed
const NUM_BINS = 512;      // FFT bins
const C_LIGHT = 299792.458; // km/s

let simRunning = false;
let simInterval = null;
let animFrame = null;
let integrationSec = 0;
let spectrumData = new Float64Array(NUM_BINS);
let avgBuffer = [];
let gainVal = 20;
let avgVal = 5;

// Galaxy rotation curve data points (radius kpc, velocity km/s)
const ROTATION_DATA = [];

function freqForBin(i) {
  return (H1_FREQ - BANDWIDTH / 2) + (i / NUM_BINS) * BANDWIDTH;
}

function binForFreq(f) {
  return Math.round(((f - (H1_FREQ - BANDWIDTH / 2)) / BANDWIDTH) * NUM_BINS);
}

function gaussianNoise() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function generateSpectrum() {
  const data = new Float64Array(NUM_BINS);
  const noiseFloor = -80;

  for (let i = 0; i < NUM_BINS; i++) {
    data[i] = noiseFloor + gaussianNoise() * (3.0 / Math.sqrt(Math.max(1, avgVal)));
  }

  // Main hydrogen emission peak — slightly Doppler-shifted
  const dopplerShift = (Math.sin(Date.now() / 30000) * 0.15); // slow drift
  const peakCenter = binForFreq(H1_FREQ + dopplerShift);
  const peakWidth = 8 + Math.random() * 4;
  const peakHeight = gainVal * 0.8 + Math.random() * 5;

  for (let i = 0; i < NUM_BINS; i++) {
    const dist = (i - peakCenter) / peakWidth;
    data[i] += peakHeight * Math.exp(-0.5 * dist * dist);
  }

  // Secondary emission (distant arm, larger Doppler)
  const arm2Center = binForFreq(H1_FREQ - 0.3 + Math.sin(Date.now() / 50000) * 0.1);
  const arm2Width = 12;
  const arm2Height = gainVal * 0.3 + Math.random() * 3;
  for (let i = 0; i < NUM_BINS; i++) {
    const dist = (i - arm2Center) / arm2Width;
    data[i] += arm2Height * Math.exp(-0.5 * dist * dist);
  }

  // Absorption dip
  const absCenter = binForFreq(H1_FREQ + 0.5);
  const absWidth = 5;
  for (let i = 0; i < NUM_BINS; i++) {
    const dist = (i - absCenter) / absWidth;
    data[i] -= 4 * Math.exp(-0.5 * dist * dist);
  }

  return data;
}

function updateSpectrum() {
  const newData = generateSpectrum();
  avgBuffer.push(newData);
  if (avgBuffer.length > avgVal) avgBuffer.shift();

  // Average
  for (let i = 0; i < NUM_BINS; i++) {
    let sum = 0;
    for (let j = 0; j < avgBuffer.length; j++) sum += avgBuffer[j][i];
    spectrumData[i] = sum / avgBuffer.length;
  }

  integrationSec++;
  const itEl = $('integrationTime');
  if (itEl) itEl.innerHTML = `${integrationSec}s <span data-i18n="integration">${LANG[currentLang].integration}</span>`;

  // Find peak
  let peakVal = -Infinity, peakBin = 0;
  for (let i = 0; i < NUM_BINS; i++) {
    if (spectrumData[i] > peakVal) { peakVal = spectrumData[i]; peakBin = i; }
  }
  const peakF = freqForBin(peakBin);
  const doppler = ((peakF - H1_FREQ) / H1_FREQ) * C_LIGHT;

  // Noise floor estimate
  const sortedVals = [...spectrumData].sort((a, b) => a - b);
  const noiseEst = sortedVals[Math.floor(NUM_BINS * 0.25)];
  const snr = peakVal - noiseEst;

  const pp = $('peakPower'); if (pp) pp.textContent = peakVal.toFixed(1);
  const pf = $('peakFreq'); if (pf) pf.textContent = peakF.toFixed(3);
  const ds = $('dopplerShift'); if (ds) ds.textContent = doppler.toFixed(1);
  const sv = $('snrValue'); if (sv) sv.textContent = snr.toFixed(1);

  // Add rotation curve data point
  if (integrationSec % 5 === 0) {
    const radius = 3 + Math.random() * 12;
    const vel = 180 + 40 * Math.log(radius / 3) + (Math.random() - 0.5) * 20;
    ROTATION_DATA.push({ r: radius, v: vel });
    if (ROTATION_DATA.length > 50) ROTATION_DATA.shift();
  }

  if (integrationSec === 3) {
    log(LANG[currentLang].h1Detected, 'success');
  }
  if (integrationSec % 10 === 0) {
    log(`${LANG[currentLang].signalUpdate} — Peak: ${peakVal.toFixed(1)} dB @ ${peakF.toFixed(3)} MHz, Doppler: ${doppler.toFixed(1)} km/s`, 'rx');
  }
}

/* ======= SPECTRUM DRAWING ======= */
function drawSpectrum() {
  const canvas = $('spectrumCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = 'rgba(100,200,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 8; i++) {
    const x = (i / 8) * W;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let i = 0; i <= 5; i++) {
    const y = (i / 5) * H;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Frequency labels
  ctx.fillStyle = 'rgba(100,200,255,0.4)';
  ctx.font = '9px Orbitron, monospace';
  ctx.textAlign = 'center';
  for (let i = 0; i <= 8; i++) {
    const f = freqForBin(Math.floor((i / 8) * NUM_BINS));
    ctx.fillText(f.toFixed(2), (i / 8) * W, H - 4);
  }

  // H1 marker line
  const h1x = ((H1_FREQ - (H1_FREQ - BANDWIDTH / 2)) / BANDWIDTH) * W;
  ctx.strokeStyle = 'rgba(255,100,100,0.3)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(h1x, 0); ctx.lineTo(h1x, H); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(255,100,100,0.5)';
  ctx.font = '8px Orbitron, monospace';
  ctx.fillText('1420.405', h1x, 12);

  // Spectrum line
  if (!simRunning && integrationSec === 0) return;

  const minDb = -90, maxDb = -30;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < NUM_BINS; i++) {
    const x = (i / NUM_BINS) * W;
    const y = H - ((spectrumData[i] - minDb) / (maxDb - minDb)) * (H - 25);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Fill under curve
  ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
  ctx.fillStyle = accent.replace(')', ',0.1)').replace('rgb', 'rgba');
  ctx.fill();

  // Info label
  ctx.fillStyle = 'rgba(100,200,255,0.4)';
  ctx.font = '10px Orbitron, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`RX: ${H1_FREQ.toFixed(3)} MHz | BW: ${BANDWIDTH} MHz | Bins: ${NUM_BINS}`, 8, 12);
}

/* ======= ROTATION CURVE DRAWING ======= */
function drawRotationCurve() {
  const canvas = $('rotationCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  ctx.fillStyle = '#0a0e1a';
  ctx.fillRect(0, 0, W, H);

  // Axes
  ctx.strokeStyle = 'rgba(100,200,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(50, H - 30); ctx.lineTo(W - 10, H - 30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(50, 10); ctx.lineTo(50, H - 30); ctx.stroke();

  // Labels
  ctx.fillStyle = 'rgba(100,200,255,0.4)';
  ctx.font = '9px Orbitron, monospace';
  ctx.textAlign = 'center';
  ctx.fillText('Distance from center (kpc)', W / 2, H - 4);
  ctx.save();
  ctx.translate(12, H / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Velocity (km/s)', 0, 0);
  ctx.restore();

  // X axis ticks
  for (let r = 0; r <= 15; r += 3) {
    const x = 50 + (r / 15) * (W - 60);
    ctx.fillText(r.toString(), x, H - 18);
  }
  // Y axis ticks
  for (let v = 0; v <= 300; v += 50) {
    const y = H - 30 - (v / 300) * (H - 50);
    ctx.textAlign = 'right';
    ctx.fillText(v.toString(), 45, y + 3);
  }

  // Expected Keplerian curve (dashed)
  ctx.strokeStyle = 'rgba(255,100,100,0.3)';
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let r = 1; r <= 15; r += 0.5) {
    const v = 220 * Math.sqrt(3 / r);
    const x = 50 + (r / 15) * (W - 60);
    const y = H - 30 - (Math.min(v, 300) / 300) * (H - 50);
    if (r === 1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.setLineDash([]);

  // Flat observed curve (theoretical)
  ctx.strokeStyle = 'rgba(100,200,255,0.2)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let r = 1; r <= 15; r += 0.5) {
    const v = 180 + 40 * Math.log(r / 3);
    const x = 50 + (r / 15) * (W - 60);
    const y = H - 30 - (Math.max(0, Math.min(v, 300)) / 300) * (H - 50);
    if (r === 1) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Data points
  ROTATION_DATA.forEach(pt => {
    const x = 50 + (pt.r / 15) * (W - 60);
    const y = H - 30 - (Math.max(0, Math.min(pt.v, 300)) / 300) * (H - 50);
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
  });

  // Legend
  ctx.font = '8px Orbitron, monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,100,100,0.5)';
  ctx.fillText('--- Keplerian (no dark matter)', 60, 20);
  ctx.fillStyle = 'rgba(100,200,255,0.4)';
  ctx.fillText('--- Observed (flat = dark matter)', 60, 32);
  ctx.fillStyle = accent;
  ctx.fillText('● Measured data points', 60, 44);
}

function drawLoop() {
  if (!simRunning) return;
  drawSpectrum();
  drawRotationCurve();
  animFrame = requestAnimationFrame(drawLoop);
}

function startSim() {
  if (simRunning) return;
  simRunning = true;
  setStatus(true);
  log(LANG[currentLang].obsStarted, 'success');
  integrationSec = 0;
  avgBuffer = [];
  ROTATION_DATA.length = 0;
  simInterval = setInterval(updateSpectrum, 1000);
  drawLoop();
}

function stopSim() {
  if (!simRunning) return;
  simRunning = false;
  setStatus(false);
  if (simInterval) { clearInterval(simInterval); simInterval = null; }
  if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
  log(LANG[currentLang].obsStopped, 'info');
}

/* ======= INIT ======= */
function init() {
  initSplash();
  const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;

  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();

  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;
  initLogResize();

  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}

  const whisperBtn=$('whisperBtn');if(whisperBtn)whisperBtn.onclick=toggleWhisper;
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};
  if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  const musicBtn=$('musicBtn');if(musicBtn)musicBtn.onclick=toggleMusicMode;

  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});

  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sL=localStorage.getItem('wdiy-lang'),sT=localStorage.getItem('wdiy-theme');if(sT)setTheme(sT);if(sL)setLanguage(sL);}catch{}

  initKonami();
  initMatrixTrigger();
  initHijriDate();

  // App-specific
  const startBtn=$('startBtn'),stopBtn=$('stopBtn');
  if(startBtn)startBtn.onclick=startSim;
  if(stopBtn)stopBtn.onclick=stopSim;

  const gainSlider=$('gainSlider');
  if(gainSlider)gainSlider.addEventListener('input',()=>{gainVal=parseInt(gainSlider.value);});
  const avgSlider=$('avgSlider');
  if(avgSlider)avgSlider.addEventListener('input',()=>{avgVal=parseInt(avgSlider.value);});

  // Initial draw
  drawSpectrum();
  drawRotationCurve();

  log(LANG[currentLang].ready,'success');
}

document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();


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
