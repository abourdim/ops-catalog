/**
 * Sonic Acoustic Levitator — Workshop DIY v1.0
 * ESP32 ultrasonic levitation array controller with standing wave visualization
 * Themes · i18n (EN/FR/AR) · RTL · Log · Canvas · Toast
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let currentLang = 'en', soundEnabled = false;
let isLevitating = false, animId = null, phase = 180, power = 80, freq = 40000, time = 0, particleY = 0, connected = false;

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title:'Acoustic Levitator', subtitle:'ESP32 Ultrasonic Levitation',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'Acoustic Levitator', mainDesc:'Control ESP32 ultrasonic transducer array for acoustic levitation',
    sectionA:'Standing Wave Nodes', sectionB:'Levitation Physics', sectionC:'Challenge',
    connectBtn:'Connect ESP32', levitateBtn:'Levitate', dropBtn:'Drop',
    freqLabel:'Frequency:', phaseLabel:'Phase:', powerLabel:'Power:',
    espLabel:'ESP32', levLabel:'Levitation', arrayLabel:'Array Info',
    nodeHint:'Pressure node positions appear when levitation is active.',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', theme:'Theme', settings:'Settings', language:'Language',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki', filterAll:'All',
    soundEffects:'Sound effects', ready:'Acoustic Levitator ready!',
    splashHint:'tap to skip', langChanged:'Language > English', themeChanged:'Theme >',
    levOn:'Levitation ACTIVE — particle trapped at node',
    levOff:'Levitation stopped — particle dropped',
    espConnected:'ESP32 connected (simulation mode)',
    espDisconnected:'ESP32 not connected',
    connectFirst:'Connect ESP32 first',
    howto_1:'Connect to the ESP32 controller (simulated).',
    howto_2:'Set frequency and phase offset for optimal node formation.',
    howto_3:'Click Levitate to activate the standing wave field.',
    howto_4:'Adjust phase to move particles between nodes. Click Drop to release.',
    wiki_sw_title:'Standing Waves', wiki_sw:'When two identical waves travel in opposite directions, they create stationary nodes (zero amplitude) and antinodes (max amplitude). Objects are trapped at pressure nodes.',
    wiki_arp_title:'Acoustic Radiation Pressure', wiki_arp:'Sound waves carry momentum. At pressure nodes, forces from both sides balance, creating stable trap points for small objects.',
    wiki_esp_title:'ESP32 Driver Circuit', wiki_esp:'The ESP32 generates 40 kHz square waves via PWM, driving ultrasonic transducers through H-bridge drivers with precise per-channel phase control.',
    challenge1:'What happens to the levitation nodes if you change the frequency?',
    challenge2:'Why must the phase offset be exactly 180 degrees for optimal levitation?',
    challenge3:'Calculate the wavelength and number of nodes for a 40 kHz levitator with 10cm gap.',
    challengeReveal1:'Higher frequency = shorter wavelength = more nodes closer together. Lower frequency = fewer, wider-spaced nodes. The particle may fall if nodes shift too quickly.',
    challengeReveal2:'At 180 degrees, the top and bottom arrays create maximum destructive interference at the midpoint, forming the strongest pressure nodes. Other phase offsets reduce node stability.',
    challengeReveal3:'Wavelength = 343m/s / 40000Hz = 8.575mm. Node spacing = half-wavelength = 4.29mm. Number of nodes in 10cm gap = 100mm / 4.29mm = ~23 nodes.',
    revealBtn:'Reveal Answer',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Generate Sound',step1Desc:'Create a specific acoustic signal with precise frequency and amplitude.',step2Title:'Propagate',step2Desc:'The sound wave travels through air, walls, or other media to the target.',step3Title:'Detect & Capture',step3Desc:'Microphones or sensors capture the acoustic energy and convert it to data.',step4Title:'Analyze & Decode',step4Desc:'Signal processing extracts hidden information or maps the acoustic environment.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates acoustic warfare! 🔬 You get to experiment with sound waves in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real sound waves so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real acoustic science and attacks! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Sonic Acoustic Covert Channel and Sonic Voice Cloak! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next'},
  fr: {
    title:'Levitateur Acoustique', subtitle:'Levitation Ultrasonique ESP32',
    disconnected:'Deconnecte', connected:'Connecte',
    mainSection:'Levitateur Acoustique', mainDesc:'Controler le reseau de transducteurs ultrasoniques ESP32 pour la levitation',
    sectionA:'Noeuds d\'Ondes Stationnaires', sectionB:'Physique de la Levitation', sectionC:'Defi',
    connectBtn:'Connecter ESP32', levitateBtn:'Leviter', dropBtn:'Lacher',
    freqLabel:'Frequence:', phaseLabel:'Phase:', powerLabel:'Puissance:',
    espLabel:'ESP32', levLabel:'Levitation', arrayLabel:'Info Reseau',
    nodeHint:'Les positions des noeuds de pression apparaissent lorsque la levitation est active.',
    activityLog:'Journal', eventsMsg:'Evenements et messages',
    clear:'Effacer', copy:'Copier', theme:'Theme', settings:'Parametres', language:'Langue',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki', filterAll:'Tout',
    soundEffects:'Effets sonores', ready:'Levitateur acoustique pret!',
    splashHint:'appuyer pour passer', langChanged:'Langue > Francais', themeChanged:'Theme >',
    levOn:'Levitation ACTIVE — particule piegee au noeud',
    levOff:'Levitation arretee — particule lachee',
    espConnected:'ESP32 connecte (mode simulation)',
    espDisconnected:'ESP32 non connecte',
    connectFirst:'Connectez d\'abord l\'ESP32',
    howto_1:'Connectez-vous au controleur ESP32 (simule).',
    howto_2:'Reglez la frequence et le decalage de phase pour une formation optimale des noeuds.',
    howto_3:'Cliquez Leviter pour activer le champ d\'ondes stationnaires.',
    howto_4:'Ajustez la phase pour deplacer les particules. Cliquez Lacher pour liberer.',
    wiki_sw_title:'Ondes Stationnaires', wiki_sw:'Quand deux ondes identiques voyagent en sens opposes, elles creent des noeuds stationnaires (amplitude zero) et des ventres (amplitude max).',
    wiki_arp_title:'Pression de Radiation Acoustique', wiki_arp:'Les ondes sonores transportent de la quantite de mouvement. Aux noeuds de pression, les forces des deux cotes s\'equilibrent.',
    wiki_esp_title:'Circuit Driver ESP32', wiki_esp:'L\'ESP32 genere des ondes carrees a 40 kHz via PWM, pilotant les transducteurs a travers des ponts en H avec controle de phase precis.',
    challenge1:'Que se passe-t-il si vous changez la frequence?',
    challenge2:'Pourquoi le decalage de phase doit-il etre exactement 180 degres?',
    challenge3:'Calculez la longueur d\'onde et le nombre de noeuds pour un levitateur 40 kHz avec 10cm d\'ecart.',
    challengeReveal1:'Frequence plus elevee = longueur d\'onde plus courte = plus de noeuds plus rapproches. Frequence plus basse = moins de noeuds plus espaces.',
    challengeReveal2:'A 180 degres, les reseaux haut et bas creent une interference destructive maximale au point median, formant les noeuds de pression les plus forts.',
    challengeReveal3:'Longueur d\'onde = 343m/s / 40000Hz = 8,575mm. Espacement des noeuds = demi-longueur d\'onde = 4,29mm. Nombre de noeuds dans 10cm = ~23.',
    revealBtn:'Reveler la reponse',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Générer le son',step1Desc:'Crée un signal acoustique avec une fréquence et amplitude précises.',step2Title:'Propager',step2Desc:'L\'onde sonore se déplace dans l\'air, les murs ou d\'autres milieux.',step3Title:'Détecter et capturer',step3Desc:'Les microphones capturent l\'énergie acoustique et la convertissent.',step4Title:'Analyser et décoder',step4Desc:'Le traitement extrait les informations cachées ou cartographie l\'environnement.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule acoustic warfare ! 🔬 Tu peux expérimenter avec sound waves en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais sound waves.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai acoustic science and attacks ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Sonic Acoustic Covert Channel and Sonic Voice Cloak ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv'},
  ar: {
    title:'الرافعة الصوتية', subtitle:'رفع بالموجات فوق الصوتية ESP32',
    disconnected:'غير متصل', connected:'متصل',
    mainSection:'الرافعة الصوتية', mainDesc:'التحكم في مصفوفة محولات الموجات فوق الصوتية للرفع الصوتي',
    sectionA:'عقد الموجات المستقرة', sectionB:'فيزياء الرفع', sectionC:'التحدي',
    connectBtn:'توصيل ESP32', levitateBtn:'رفع', dropBtn:'إسقاط',
    freqLabel:'التردد:', phaseLabel:'الطور:', powerLabel:'القوة:',
    espLabel:'ESP32', levLabel:'الرفع', arrayLabel:'معلومات المصفوفة',
    nodeHint:'تظهر مواضع عقد الضغط عند تفعيل الرفع.',
    activityLog:'سجل النشاط', eventsMsg:'أحداث ورسائل',
    clear:'مسح', copy:'نسخ', theme:'المظهر', settings:'الإعدادات', language:'اللغة',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي', filterAll:'الكل',
    soundEffects:'مؤثرات صوتية', ready:'الرافعة الصوتية جاهزة!',
    splashHint:'انقر للتخطي', langChanged:'اللغة > العربية', themeChanged:'المظهر >',
    levOn:'الرفع نشط — الجسيم محاصر في العقدة',
    levOff:'توقف الرفع — سقط الجسيم',
    espConnected:'ESP32 متصل (وضع المحاكاة)',
    espDisconnected:'ESP32 غير متصل',
    connectFirst:'وصّل ESP32 أولاً',
    howto_1:'اتصل بوحدة تحكم ESP32 (محاكاة).',
    howto_2:'اضبط التردد وإزاحة الطور لتشكيل عقد مثالية.',
    howto_3:'انقر رفع لتفعيل حقل الموجات المستقرة.',
    howto_4:'اضبط الطور لتحريك الجسيمات. انقر إسقاط للتحرير.',
    wiki_sw_title:'الموجات المستقرة', wiki_sw:'عندما تسير موجتان متطابقتان في اتجاهين متعاكسين، تنشأ عقد ثابتة (سعة صفر) وبطون (سعة قصوى).',
    wiki_arp_title:'ضغط الإشعاع الصوتي', wiki_arp:'الموجات الصوتية تحمل زخمًا. عند عقد الضغط تتوازن القوى من الجانبين مما يخلق نقاط حبس مستقرة.',
    wiki_esp_title:'دائرة تشغيل ESP32', wiki_esp:'يولّد ESP32 موجات مربعة 40 كيلوهرتز عبر PWM لتشغيل المحولات عبر جسور H مع تحكم دقيق بالطور.',
    challenge1:'ماذا يحدث لعقد الرفع إذا غيرت التردد؟',
    challenge2:'لماذا يجب أن تكون إزاحة الطور 180 درجة بالضبط؟',
    challenge3:'احسب طول الموجة وعدد العقد لرافعة 40 كيلوهرتز بفجوة 10 سم.',
    challengeReveal1:'تردد أعلى = طول موجة أقصر = عقد أكثر متقاربة. تردد أقل = عقد أقل متباعدة. قد يسقط الجسيم إذا تحولت العقد بسرعة.',
    challengeReveal2:'عند 180 درجة، تنشئ المصفوفتان العلوية والسفلية تداخلاً هداماً أقصى عند نقطة المنتصف، مكونة أقوى عقد ضغط.',
    challengeReveal3:'طول الموجة = 343/40000 = 8.575 مم. تباعد العقد = نصف طول الموجة = 4.29 مم. عدد العقد في 10 سم = ~23 عقدة.',
    revealBtn:'اكشف الإجابة',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
  ,step1Title:'توليد الصوت',step1Desc:'أنشئ إشارة صوتية بتردد وسعة محددين.',step2Title:'انتشار',step2Desc:'تنتقل الموجة الصوتية عبر الهواء أو الجدران أو الوسائط الأخرى.',step3Title:'كشف والتقاط',step3Desc:'تلتقط الميكروفونات الطاقة الصوتية وتحولها إلى بيانات.',step4Title:'تحليل وفك تشفير',step4Desc:'تستخرج المعالجة المعلومات المخفية أو ترسم خريطة البيئة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي acoustic warfare! 🔬 يمكنك التجربة مع sound waves في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج sound waves حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا acoustic science and attacks حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Sonic Acoustic Covert Channel and Sonic Voice Cloak! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي'}
};

function T(k) { return (LANG[currentLang] || LANG.en)[k] || LANG.en[k] || k; }

/* ═══════ FRAMEWORK ═══════ */
function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; });
  document.title = (s.title || '') + ' — Workshop DIY';
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if (sel) sel.value = lang;
  try { localStorage.setItem('wdiy-lang', lang); } catch {}
  log(s.langChanged, 'info');
}
function setTheme(n) {
  document.documentElement.dataset.theme = n;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n));
  const s = $('themeSelect'); if (s) s.value = n;
  try { localStorage.setItem('wdiy-theme', n); } catch {}
  log(T('themeChanged') + ' ' + n, 'info');
}

let logContainer;
function log(msg, type = 'info') {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  const d = document.createElement('div');
  d.className = 'log-line ' + type;
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
  logContainer.appendChild(d);
  logContainer.scrollTop = logContainer.scrollHeight;
  applyLogFilter();
}
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log('Cleared'); }
async function copyLog() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log('Copied!', 'success'); }
  catch { log('Copy failed', 'error'); }
}
function showToast(m, ms = 0) { const e = $('toastIndicator'), t = $('toastMessage'); if (e && t) { t.textContent = m; e.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const e = $('toastIndicator'); if (e) e.style.display = 'none'; }
function setStatus(on) { const p = $('statusPill'), t = $('statusText'); if (t) t.textContent = on ? T('connected') : T('disconnected'); if (p) p.classList.toggle('connected', on); }
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); setTimeout(() => s.remove(), 600); }
let activeLogFilter = 'all';
function applyLogFilter() {
  if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return;
  Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; });
}
function revealChallenge(i) { const a = $('answer' + i); if (a) a.classList.toggle('visible'); }

/* ═══════ CANVAS ═══════ */
const canvas = $('levCanvas'), ctx = canvas ? canvas.getContext('2d') : null;
const W = canvas ? canvas.width : 780, H = canvas ? canvas.height : 350;

function drawLevitator() {
  if (!ctx) return;
  time += 0.03;
  ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, topY = 30, botY = H - 30, arrayH = botY - topY;

  // Transducer arrays (top and bottom bars)
  ctx.fillStyle = '#333'; ctx.fillRect(cx - 150, topY - 10, 300, 15); ctx.fillRect(cx - 150, botY - 5, 300, 15);
  // Transducer dots
  for (let i = 0; i < 10; i++) {
    const x = cx - 135 + i * 30;
    ctx.fillStyle = isLevitating ? `hsl(${120 + i * 10},80%,50%)` : '#555';
    ctx.beginPath(); ctx.arc(x, topY, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x, botY, 5, 0, Math.PI * 2); ctx.fill();
  }

  if (isLevitating) {
    // Standing wave field
    const wavelength = 343000 / freq;
    const nodes = Math.floor(arrayH / (wavelength * 50));
    const phaseRad = phase * Math.PI / 180;
    for (let y = topY; y < botY; y++) {
      const normY = (y - topY) / arrayH;
      const pressure = Math.abs(Math.sin(normY * Math.PI * nodes + phaseRad)) * Math.cos(time * 3);
      const w = pressure * 100 * (power / 100);
      const hue = 120 - pressure * 120;
      ctx.fillStyle = `hsla(${hue},80%,50%,${pressure * 0.4})`;
      ctx.fillRect(cx - w, y, w * 2, 1);
    }
    // Node markers
    const nodePositions = [];
    for (let n = 0; n < nodes; n++) {
      const ny = topY + arrayH * (n + 0.5) / nodes;
      nodePositions.push(ny);
      ctx.strokeStyle = 'rgba(0,255,100,0.3)'; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(cx - 120, ny); ctx.lineTo(cx + 120, ny); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(0,255,100,0.5)'; ctx.font = '9px Orbitron';
      ctx.fillText('NODE ' + (n + 1), cx + 125, ny + 3);
    }
    // Levitating particle
    if (nodePositions.length > 0) {
      const targetY = nodePositions[Math.floor(nodePositions.length / 2)];
      particleY += (targetY - particleY) * 0.05;
      const wobble = Math.sin(time * 5) * 2;
      ctx.fillStyle = '#ffffff'; ctx.shadowColor = '#00ff88'; ctx.shadowBlur = 15;
      ctx.beginPath(); ctx.arc(cx + wobble, particleY + Math.sin(time * 2) * 3, 6, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }
    // Wave propagation rings
    ctx.strokeStyle = 'rgba(0,200,255,0.15)'; ctx.lineWidth = 1;
    for (let w = 0; w < 3; w++) {
      const r = (time * 50 + w * 40) % 150;
      ctx.beginPath(); ctx.arc(cx, topY, r, 0, Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, botY, r, Math.PI, Math.PI * 2); ctx.stroke();
    }
  }

  // Labels
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '10px Orbitron';
  ctx.fillText('ACOUSTIC LEVITATION ARRAY', 10, 15);
  ctx.fillText('TOP ARRAY', cx - 30, topY - 15);
  ctx.fillText('BOTTOM ARRAY', cx - 40, botY + 25);
  if (isLevitating) ctx.fillText('STANDING WAVE ACTIVE', 10, H - 5);

  // Update info panel
  const wl = (343000 / freq);
  $('arrayInfo').innerHTML = 'Freq: ' + (freq / 1000) + ' kHz<br>Phase: ' + phase + '°<br>Power: ' + power + '%<br>λ: ' + wl.toFixed(2) + ' mm';

  animId = requestAnimationFrame(drawLevitator);
}

/* ═══════ ESP32 / LEVITATION ═══════ */
function connectESP() {
  connected = true; setStatus(true);
  $('espStatus').textContent = T('connected');
  $('espStatus').style.color = '#22c55e';
  log(T('espConnected'), 'success');
  showToast(T('espConnected'), 2000);
}
function startLevitation() {
  if (!connected) { log(T('connectFirst'), 'error'); return; }
  isLevitating = true;
  $('levStatus').textContent = 'ACTIVE'; $('levStatus').style.color = '#22c55e';
  log(T('levOn'), 'success');
  fillNodes();
}
function stopLevitation() {
  isLevitating = false;
  $('levStatus').textContent = 'OFF'; $('levStatus').style.color = '';
  log(T('levOff'), 'info');
}
function fillNodes() {
  const el = $('nodeList'); if (!el) return;
  el.innerHTML = '';
  const wavelength = 343000 / freq;
  const arrayH = H - 60;
  const nodes = Math.floor(arrayH / (wavelength * 50));
  for (let n = 0; n < nodes; n++) {
    const d = document.createElement('div');
    d.className = 'node-badge';
    d.style.cssText = 'display:block;padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;background:rgba(0,255,100,.1);color:#00ff64;border-left:3px solid #00ff64;margin-bottom:4px;';
    d.textContent = 'Node ' + (n + 1) + ': position ' + ((n + 0.5) / nodes * 100).toFixed(1) + '% — stable trap point';
    el.appendChild(d);
  }
}
function fillPhysics() {
  const el = $('physicsInfo'); if (!el) return;
  el.innerHTML = '<b>Acoustic Levitation</b><br><br>Objects can be trapped at pressure nodes of a standing wave where the acoustic radiation force balances gravity.<br><br>' +
    '<b>Standing Wave:</b> Created when two opposing transducer arrays emit phase-locked ultrasonic waves. Constructive/destructive interference creates fixed pressure nodes and anti-nodes.<br><br>' +
    '<b>Key Parameters:</b><br>- Frequency: 25-40 kHz typical<br>- Phase: Controls node position<br>- Power: Must overcome gravity<br>- Wavelength at 40kHz: ~8.6mm<br><br>' +
    '<b>Gor\'kov Potential:</b> U = -(V_p/2) * [f1 * <p²>/(ρc²) - f2 * 3ρ<v²>/4]<br>Particles move to potential minima (pressure nodes).<br><br>' +
    '<b>Applications:</b> Containerless processing, pharmaceutical research, materials science, space experiments.';
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(dismissSplash, 2500);
  try { const l = localStorage.getItem('wdiy-lang'); if (l) setLanguage(l); else setLanguage('en'); } catch { setLanguage('en'); }
  try { const t = localStorage.getItem('wdiy-theme'); if (t) setTheme(t); } catch {}

  // Panels
  $('helpBtn').onclick = () => { $('helpPanel').classList.toggle('open'); $('helpOverlay').classList.toggle('active'); };
  $('helpCloseBtn').onclick = $('helpOverlay').onclick = () => { $('helpPanel').classList.remove('open'); $('helpOverlay').classList.remove('active'); };
  $('settingsBtn').onclick = () => { $('settingsPanel').classList.toggle('open'); $('settingsOverlay').classList.toggle('active'); };
  $('settingsCloseBtn').onclick = $('settingsOverlay').onclick = () => { $('settingsPanel').classList.remove('open'); $('settingsOverlay').classList.remove('active'); };
  $('logBtn').onclick = () => $('logPanel').classList.toggle('open');
  $('logCloseBtn').onclick = () => $('logPanel').classList.remove('open');
  $('clearLogBtn').onclick = clearLog; $('copyLogBtn').onclick = copyLog;
  $('langSelect').onchange = e => setLanguage(e.target.value);
  $('themeSelect').onchange = e => setTheme(e.target.value);
  $('soundToggle').onchange = e => { soundEnabled = e.target.checked; };

  // Help tabs
  document.querySelectorAll('.help-tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const tgt = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1));
      if (tgt) tgt.classList.add('active');
    };
  });
  // Log filters
  document.querySelectorAll('.log-filter').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter();
    };
  });

  // Controls
  $('connectBtn').onclick = connectESP;
  $('levitateBtn').onclick = startLevitation;
  $('dropBtn').onclick = stopLevitation;
  $('freqSelect').onchange = e => { freq = parseInt(e.target.value); if (isLevitating) fillNodes(); log('Frequency: ' + (freq/1000) + ' kHz', 'info'); };
  $('phaseRange').oninput = e => { phase = parseInt(e.target.value); $('phaseVal').textContent = phase + '\u00B0'; };
  $('powerRange').oninput = e => { power = parseInt(e.target.value); $('powerVal').textContent = power + '%'; };

  fillPhysics();
  drawLevitator();
  log(T('ready'), 'success');
});

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Acoustic Levitator
   Animated standing wave field with particle trapping,
   pressure node visualization, and transducer array display
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simAcousticLevitator';let cv,cx,W,H,af=null,t=0;
  const particles=[];const pressureNodes=[];const waveRings=[];
  let simFreq=40000,simPhase=180,simPower=80,levActive=true;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=340;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060a14;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
    initParticles();calcNodes();
  }

  function initParticles(){
    particles.length=0;
    for(let i=0;i<5;i++){
      particles.push({x:W/2+(Math.random()-.5)*40,y:H/2+(Math.random()-.5)*60,
        vx:0,vy:0,targetY:0,radius:3+Math.random()*3,wobble:Math.random()*Math.PI*2,
        hue:120+Math.random()*60,trapped:false});
    }
  }

  function calcNodes(){
    pressureNodes.length=0;
    const wavelength=343000/simFreq;
    const topY=50,botY=H-50,gap=botY-topY;
    const nodeCount=Math.floor(gap/(wavelength*50));
    for(let n=0;n<nodeCount;n++){
      const ny=topY+gap*(n+0.5)/nodeCount;
      pressureNodes.push({y:ny,strength:0.5+Math.random()*0.5});
    }
  }

  class WaveRing{
    constructor(x,y,dir){this.x=x;this.y=y;this.r=0;this.maxR=120;this.dir=dir;this.alpha=0.3;}
    update(){this.r+=1.5;this.alpha=0.3*(1-this.r/this.maxR);return this.r<this.maxR;}
    draw(){
      cx.beginPath();
      if(this.dir>0)cx.arc(this.x,this.y,this.r,0,Math.PI);
      else cx.arc(this.x,this.y,this.r,Math.PI,Math.PI*2);
      cx.strokeStyle='rgba(0,200,255,'+this.alpha+')';cx.lineWidth=1.5;cx.stroke();
    }
  }

  function drawTransducerArray(y,isTop){
    const cx2=W/2;
    cx.fillStyle='#2a2a3a';
    cx.fillRect(cx2-180,isTop?y-12:y-3,360,15);
    cx.strokeStyle='rgba(0,255,170,0.3)';cx.lineWidth=1;
    cx.strokeRect(cx2-180,isTop?y-12:y-3,360,15);
    for(let i=0;i<12;i++){
      const x=cx2-165+i*30;
      const pulse=levActive?3+Math.sin(t*6+i*0.5)*2:0;
      cx.save();cx.shadowColor=levActive?'hsl('+(100+i*15)+',80%,50%)':'#333';
      cx.shadowBlur=pulse;
      cx.fillStyle=levActive?'hsl('+(100+i*15)+',80%,50%)':'#555';
      cx.beginPath();cx.arc(x,y,5,0,Math.PI*2);cx.fill();
      cx.restore();
    }
  }

  function drawStandingWaveField(){
    if(!levActive)return;
    const cx2=W/2,topY=50,botY=H-50,gap=botY-topY;
    const wavelength=343000/simFreq;
    const nodeCount=Math.floor(gap/(wavelength*50));
    const phaseRad=simPhase*Math.PI/180;

    for(let y=topY;y<botY;y+=2){
      const normY=(y-topY)/gap;
      const pressure=Math.abs(Math.sin(normY*Math.PI*nodeCount+phaseRad));
      const osc=Math.cos(t*4)*0.3+0.7;
      const w=pressure*osc*130*(simPower/100);
      const r=Math.floor(pressure*200);
      const g=Math.floor((1-pressure)*200);
      cx.fillStyle='rgba('+r+','+g+',100,'+(pressure*0.25)+')';
      cx.fillRect(cx2-w,y,w*2,2);
    }
  }

  function drawPressureNodes(){
    pressureNodes.forEach((n,i)=>{
      cx.setLineDash([4,4]);
      cx.strokeStyle='rgba(0,255,100,0.25)';cx.lineWidth=1;
      cx.beginPath();cx.moveTo(W/2-140,n.y);cx.lineTo(W/2+140,n.y);cx.stroke();
      cx.setLineDash([]);
      cx.fillStyle='rgba(0,255,100,0.4)';cx.font='8px monospace';
      cx.textAlign='left';
      cx.fillText('NODE '+(i+1)+' ['+n.strength.toFixed(2)+']',W/2+145,n.y+3);
    });
  }

  function updateParticles(){
    particles.forEach(p=>{
      if(levActive&&pressureNodes.length>0){
        let closest=pressureNodes[0],minD=Math.abs(p.y-pressureNodes[0].y);
        pressureNodes.forEach(n=>{const d=Math.abs(p.y-n.y);if(d<minD){minD=d;closest=n;}});
        p.targetY=closest.y;
        p.vy+=(p.targetY-p.y)*0.008;
        p.vy*=0.95;
        p.vx=(Math.sin(t*3+p.wobble)*0.3);
        p.trapped=minD<15;
      }else{
        p.vy+=0.15;p.vy*=0.98;p.vx*=0.98;
        p.trapped=false;
      }
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<W/2-130)p.x=W/2-130;if(p.x>W/2+130)p.x=W/2+130;
      if(p.y>H-55){p.y=H-55;p.vy*=-0.3;}
      if(p.y<55){p.y=55;p.vy*=-0.3;}
    });
  }

  function drawParticles(){
    particles.forEach(p=>{
      cx.save();
      if(p.trapped){cx.shadowColor='#00ff88';cx.shadowBlur=12;}
      cx.fillStyle=p.trapped?'#ffffff':'rgba(200,200,200,0.6)';
      cx.beginPath();cx.arc(p.x,p.y,p.radius,0,Math.PI*2);cx.fill();
      if(p.trapped){
        cx.strokeStyle='rgba(0,255,136,0.3)';cx.lineWidth=1;
        cx.beginPath();cx.arc(p.x,p.y,p.radius+6+Math.sin(t*5)*3,0,Math.PI*2);cx.stroke();
      }
      cx.restore();
    });
  }

  function drawSpectrumBar(){
    const bx=20,by=H-45,bw=200,bh=30;
    cx.fillStyle='rgba(0,0,0,0.4)';cx.fillRect(bx,by,bw,bh);
    const bins=64;const binW=bw/bins;
    for(let i=0;i<bins;i++){
      const freq=i/bins;
      const peak=Math.exp(-Math.pow((freq-0.5)*10,2));
      const h2=peak*bh*0.8+Math.random()*2;
      const hue=120+freq*120;
      cx.fillStyle='hsla('+hue+',70%,50%,0.6)';
      cx.fillRect(bx+i*binW,by+bh-h2,binW-0.5,h2);
    }
    cx.fillStyle='rgba(0,255,170,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('ULTRASONIC SPECTRUM — 38-42 kHz',bx+4,by-4);
  }

  function drawPhysicsInfo(){
    const px=W-220,py=H-80,pw=200,ph=65;
    cx.fillStyle='rgba(0,0,0,0.5)';cx.fillRect(px,py,pw,ph);
    cx.strokeStyle='rgba(0,255,170,0.12)';cx.strokeRect(px,py,pw,ph);
    cx.fillStyle='rgba(0,255,170,0.5)';cx.font='8px monospace';cx.textAlign='left';
    const wl=(343000/simFreq).toFixed(2);
    cx.fillText('Frequency: '+(simFreq/1000)+' kHz',px+8,py+14);
    cx.fillText('Wavelength: '+wl+' mm',px+8,py+28);
    cx.fillText('Phase: '+simPhase+'deg  Power: '+simPower+'%',px+8,py+42);
    cx.fillText('Nodes: '+pressureNodes.length+'  Particles: '+particles.length,px+8,py+56);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,220,54);
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.strokeRect(8,8,220,54);
    cx.font='10px monospace';cx.fillStyle='#00ffaa';cx.textAlign='left';
    cx.fillText('ACOUSTIC LEVITATION ARRAY',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Standing Wave Trapping Simulation',16,40);
    cx.fillText('Trapped: '+particles.filter(p=>p.trapped).length+'/'+particles.length,16,54);
    cx.restore();
  }

  function drawGrid(){
    cx.strokeStyle='rgba(0,255,170,0.04)';cx.lineWidth=0.5;
    for(let x=0;x<W;x+=40){cx.beginPath();cx.moveTo(x,0);cx.lineTo(x,H);cx.stroke();}
    for(let y=0;y<H;y+=40){cx.beginPath();cx.moveTo(0,y);cx.lineTo(W,y);cx.stroke();}
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(6,10,20,0.15)';cx.fillRect(0,0,W,H);

    // Slowly cycle parameters
    simPhase=180+Math.sin(t*0.3)*20;
    simPower=70+Math.sin(t*0.2)*15;

    if(Math.floor(t*60)%30===0)waveRings.push(new WaveRing(W/2,50,1));
    if(Math.floor(t*60)%30===15)waveRings.push(new WaveRing(W/2,H-50,-1));

    drawGrid();
    drawStandingWaveField();
    drawPressureNodes();
    drawTransducerArray(50,true);
    drawTransducerArray(H-50,false);

    for(let i=waveRings.length-1;i>=0;i--){
      if(!waveRings[i].update())waveRings.splice(i,1);
      else waveRings[i].draw();
    }

    updateParticles();
    drawParticles();
    drawSpectrumBar();
    drawPhysicsInfo();
    drawHUD();

    cx.fillStyle='rgba(0,255,170,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Standing Wave Acoustic Levitation — Pressure Node Trapping',8,H-8);

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
