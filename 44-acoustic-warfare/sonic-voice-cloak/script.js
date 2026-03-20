/**
 * Sonic Voice Cloak — Workshop DIY v1.0
 * Real-time voice disguiser with pitch/effects
 * Themes · i18n (EN/FR/AR) · RTL · Log · Canvas · Toast
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let currentLang = 'en', soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx, analyser, micStream, dataArray, freqArray;
let isActive = false, animId = null, distNode, gainNode, bqFilter;
const PRESETS = {
  deep: { pitch: 0.6, dist: 50, label: 'Deep Vader' },
  high: { pitch: 2.0, dist: 0, label: 'Chipmunk' },
  robot: { pitch: 1.0, dist: 200, label: 'Robot' },
  whisper: { pitch: 1.2, dist: 0, label: 'Whisper' },
  demon: { pitch: 0.4, dist: 300, label: 'Demon' }
};

const LANG = {
  en: {
    title:'Voice Cloak', subtitle:'Real-Time Voice Disguiser',
    disconnected:'Idle', connected:'Cloaked',
    mainSection:'Voice Cloak', mainDesc:'Transform your voice in real-time',
    sectionA:'Voice Presets', sectionB:'DSP Theory', sectionC:'Challenge',
    cloakBtn:'Start Cloak', stopBtn:'Stop',
    voiceLabel:'Voice:', pitchLabel:'Pitch:', distLabel:'Distortion:',
    cloakLabel:'Cloak Status', levelLabel:'Input Level', voiceInfoLabel:'Voice Info',
    inactive:'Inactive', presetHint:'Click a preset to apply it.',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', theme:'Theme', settings:'Settings', language:'Language',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki', filterAll:'All',
    soundEffects:'Sound effects', ready:'Voice Cloak ready!',
    splashHint:'tap to skip', langChanged:'Language > English', themeChanged:'Theme >',
    started:'Voice cloak activated — speak now', stopped:'Voice cloak deactivated',
    howto_1:'Select a voice preset or adjust pitch/distortion manually.',
    howto_2:'Click Start Cloak to activate the voice transformer.',
    howto_3:'Speak into your microphone. Your transformed voice plays through speakers.',
    howto_4:'Adjust parameters in real-time to find the perfect disguise.',
    wiki_pitch_title:'Pitch Shifting', wiki_pitch:'Changes the fundamental frequency of your voice. Lower values = deeper voice, higher values = chipmunk effect.',
    wiki_dist_title:'Waveshaping Distortion', wiki_dist:'Non-linear transfer function that adds harmonics and overtones, creating robotic or demonic effects.',
    wiki_filter_title:'Biquad Filtering', wiki_filter:'Shapes frequency response. Low-pass for deep voices, high-pass for thin voices. Controls vocal timbre.',
    challenge1:'Can pitch shifting alone prevent voice identification?',
    challenge2:'What is the difference between pitch shifting and formant shifting?',
    challenge3:'Design a voice cloak that maximizes anonymity while remaining intelligible.',
    challengeReveal1:'No! Simple pitch shifting preserves formant patterns, speaking rhythm, and vocabulary. Advanced voice biometrics can reverse pitch shifts. Combine with distortion and formant shifting for better anonymity.',
    challengeReveal2:'Pitch shifting changes the fundamental frequency (how high/low). Formant shifting changes the resonance of the vocal tract (what makes male vs female). Both are needed for convincing disguise.',
    challengeReveal3:'Use moderate pitch shift (0.7-0.8x), independent formant shift, light distortion, random micro-pauses, and vocabulary substitution. Too much distortion reduces intelligibility.',
    revealBtn:'Reveal Answer',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Generate Sound',step1Desc:'Create a specific acoustic signal with precise frequency and amplitude.',step2Title:'Propagate',step2Desc:'The sound wave travels through air, walls, or other media to the target.',step3Title:'Detect & Capture',step3Desc:'Microphones or sensors capture the acoustic energy and convert it to data.',step4Title:'Analyze & Decode',step4Desc:'Signal processing extracts hidden information or maps the acoustic environment.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates acoustic warfare! 🔬 You get to experiment with sound waves in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real sound waves so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real acoustic science and attacks! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Sonic Acoustic Keylogger and Sonic Acoustic Levitator! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next'},
  fr: {
    title:'Masque Vocal', subtitle:'Deguiseur de Voix Temps Reel',
    disconnected:'Inactif', connected:'Masque',
    mainSection:'Masque Vocal', mainDesc:'Transformer votre voix en temps reel',
    sectionA:'Presets de Voix', sectionB:'Theorie DSP', sectionC:'Defi',
    cloakBtn:'Activer le Masque', stopBtn:'Arreter',
    voiceLabel:'Voix:', pitchLabel:'Hauteur:', distLabel:'Distorsion:',
    cloakLabel:'Etat du Masque', levelLabel:'Niveau d\'Entree', voiceInfoLabel:'Info Voix',
    inactive:'Inactif', presetHint:'Cliquez sur un preset pour l\'appliquer.',
    activityLog:'Journal', eventsMsg:'Evenements et messages',
    clear:'Effacer', copy:'Copier', theme:'Theme', settings:'Parametres', language:'Langue',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki', filterAll:'Tout',
    soundEffects:'Effets sonores', ready:'Masque vocal pret!',
    splashHint:'appuyer pour passer', langChanged:'Langue > Francais', themeChanged:'Theme >',
    started:'Masque vocal active — parlez maintenant', stopped:'Masque vocal desactive',
    howto_1:'Selectionnez un preset ou ajustez manuellement.', howto_2:'Cliquez Activer le Masque.',
    howto_3:'Parlez dans votre micro. Votre voix transformee sort par les haut-parleurs.', howto_4:'Ajustez les parametres en temps reel.',
    wiki_pitch_title:'Changement de Hauteur', wiki_pitch:'Modifie la frequence fondamentale. Valeurs basses = voix grave, hautes = effet chipmunk.',
    wiki_dist_title:'Distorsion par Waveshaping', wiki_dist:'Fonction de transfert non-lineaire qui ajoute des harmoniques.',
    wiki_filter_title:'Filtrage Biquad', wiki_filter:'Modifie la reponse frequentielle. Passe-bas pour voix graves, passe-haut pour voix fines.',
    challenge1:'Le changement de hauteur seul peut-il prevenir l\'identification vocale?',
    challenge2:'Quelle est la difference entre changement de hauteur et changement de formants?',
    challenge3:'Concevez un masque vocal qui maximise l\'anonymat tout en restant intelligible.',
    challengeReveal1:'Non! Le changement de hauteur simple preserve les formants, le rythme et le vocabulaire. La biometrie avancee peut inverser ces changements.',
    challengeReveal2:'Le changement de hauteur modifie la frequence fondamentale. Le changement de formants modifie la resonance du tractus vocal (masculin vs feminin).',
    challengeReveal3:'Utilisez un changement de hauteur modere (0.7-0.8x), un changement de formants independant, une legere distorsion et des micro-pauses aleatoires.',
    revealBtn:'Reveler la reponse',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  ,step1Title:'Générer le son',step1Desc:'Crée un signal acoustique avec une fréquence et amplitude précises.',step2Title:'Propager',step2Desc:'L\'onde sonore se déplace dans l\'air, les murs ou d\'autres milieux.',step3Title:'Détecter et capturer',step3Desc:'Les microphones capturent l\'énergie acoustique et la convertissent.',step4Title:'Analyser et décoder',step4Desc:'Le traitement extrait les informations cachées ou cartographie l\'environnement.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule acoustic warfare ! 🔬 Tu peux expérimenter avec sound waves en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais sound waves.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai acoustic science and attacks ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Sonic Acoustic Keylogger and Sonic Acoustic Levitator ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv'},
  ar: {
    title:'عباءة الصوت', subtitle:'مغير الصوت الفوري',
    disconnected:'خامل', connected:'مقنع',
    mainSection:'عباءة الصوت', mainDesc:'حوّل صوتك في الوقت الحقيقي',
    sectionA:'إعدادات الصوت المسبقة', sectionB:'نظرية DSP', sectionC:'التحدي',
    cloakBtn:'تفعيل العباءة', stopBtn:'إيقاف',
    voiceLabel:'الصوت:', pitchLabel:'الطبقة:', distLabel:'التشويه:',
    cloakLabel:'حالة العباءة', levelLabel:'مستوى الإدخال', voiceInfoLabel:'معلومات الصوت',
    inactive:'غير نشط', presetHint:'انقر على إعداد لتطبيقه.',
    activityLog:'سجل النشاط', eventsMsg:'أحداث ورسائل',
    clear:'مسح', copy:'نسخ', theme:'المظهر', settings:'الإعدادات', language:'اللغة',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي', filterAll:'الكل',
    soundEffects:'مؤثرات صوتية', ready:'عباءة الصوت جاهزة!',
    splashHint:'انقر للتخطي', langChanged:'اللغة > العربية', themeChanged:'المظهر >',
    started:'تم تفعيل عباءة الصوت — تحدث الآن', stopped:'تم إيقاف عباءة الصوت',
    howto_1:'اختر إعدادًا مسبقًا أو اضبط الطبقة والتشويه يدويًا.',
    howto_2:'انقر تفعيل العباءة لتشغيل المحول.',
    howto_3:'تحدث في الميكروفون. صوتك المحول يخرج من السماعات.',
    howto_4:'اضبط المعاملات في الوقت الحقيقي للعثور على التمويه المثالي.',
    wiki_pitch_title:'تغيير الطبقة', wiki_pitch:'يغير التردد الأساسي لصوتك. قيم أقل = صوت أعمق، أعلى = تأثير السنجاب.',
    wiki_dist_title:'تشويه بتشكيل الموجة', wiki_dist:'دالة نقل غير خطية تضيف توافقيات ونغمات فرعية لتأثيرات آلية أو شيطانية.',
    wiki_filter_title:'ترشيح Biquad', wiki_filter:'يشكل الاستجابة الترددية. تمرير منخفض للأصوات العميقة، تمرير مرتفع للأصوات الرفيعة.',
    challenge1:'هل يمكن لتغيير الطبقة وحده منع تحديد الصوت؟',
    challenge2:'ما الفرق بين تغيير الطبقة وتغيير الصيغ الصوتية؟',
    challenge3:'صمم عباءة صوت تعظم الخصوصية مع البقاء مفهومة.',
    challengeReveal1:'لا! تغيير الطبقة البسيط يحافظ على أنماط الصيغ الصوتية وإيقاع الكلام. القياسات الحيوية المتقدمة يمكنها عكس التغييرات.',
    challengeReveal2:'تغيير الطبقة يغير التردد الأساسي. تغيير الصيغ الصوتية يغير رنين المسلك الصوتي (ذكر مقابل أنثى). كلاهما ضروري.',
    challengeReveal3:'استخدم تغيير طبقة معتدل (0.7-0.8x)، تغيير صيغ صوتية مستقل، تشويه خفيف، ووقفات دقيقة عشوائية.',
    revealBtn:'اكشف الإجابة',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
  ,step1Title:'توليد الصوت',step1Desc:'أنشئ إشارة صوتية بتردد وسعة محددين.',step2Title:'انتشار',step2Desc:'تنتقل الموجة الصوتية عبر الهواء أو الجدران أو الوسائط الأخرى.',step3Title:'كشف والتقاط',step3Desc:'تلتقط الميكروفونات الطاقة الصوتية وتحولها إلى بيانات.',step4Title:'تحليل وفك تشفير',step4Desc:'تستخرج المعالجة المعلومات المخفية أو ترسم خريطة البيئة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي acoustic warfare! 🔬 يمكنك التجربة مع sound waves في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج sound waves حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا acoustic science and attacks حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Sonic Acoustic Keylogger and Sonic Acoustic Levitator! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي'}
};

function T(k) { return (LANG[currentLang] || LANG.en)[k] || LANG.en[k] || k; }

/* ═══════ FRAMEWORK ═══════ */
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; }); document.title = (s.title || '') + ' — Workshop DIY'; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
function setTheme(n) { document.documentElement.dataset.theme = n; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n)); const s = $('themeSelect'); if (s) s.value = n; try { localStorage.setItem('wdiy-theme', n); } catch {} log(T('themeChanged') + ' ' + n, 'info'); }
let logContainer;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = 'log-line ' + type; d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log('Cleared'); }
async function copyLog() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log('Copied!', 'success'); } catch { log('Copy failed', 'error'); } }
function showToast(m, ms = 0) { const e = $('toastIndicator'), t = $('toastMessage'); if (e && t) { t.textContent = m; e.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const e = $('toastIndicator'); if (e) e.style.display = 'none'; }
function setStatus(on) { const p = $('statusPill'), t = $('statusText'); if (t) t.textContent = on ? T('connected') : T('disconnected'); if (p) p.classList.toggle('connected', on); }
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); setTimeout(() => s.remove(), 600); }
let activeLogFilter = 'all';
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; }); }
function revealChallenge(i) { const a = $('answer' + i); if (a) a.classList.toggle('visible'); }

/* ═══════ CANVAS ═══════ */
const canvas = $('voiceCanvas'), ctx = canvas ? canvas.getContext('2d') : null;

function drawVoice() {
  if (!ctx || !freqArray || !dataArray) return;
  analyser.getByteFrequencyData(freqArray); analyser.getByteTimeDomainData(dataArray);
  ctx.fillStyle = 'rgba(10,10,26,0.15)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Frequency bars with rainbow
  const barW = canvas.width / 128;
  for (let i = 0; i < 128; i++) {
    const h = freqArray[i] / 255 * canvas.height; const hue = i * 2;
    ctx.fillStyle = `hsla(${hue},80%,50%,0.7)`;
    ctx.fillRect(i * barW, canvas.height - h, barW - 1, h);
  }
  // Waveform overlay
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5; ctx.beginPath();
  const sw = canvas.width / dataArray.length; let x = 0;
  for (let i = 0; i < dataArray.length; i++) { const y = dataArray[i] / 128 * canvas.height / 2; i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); x += sw; }
  ctx.stroke();
  // Level meter
  let rms = 0; for (let i = 0; i < dataArray.length; i++) { const v = (dataArray[i] - 128) / 128; rms += v * v; } rms = Math.sqrt(rms / dataArray.length);
  $('levelFill').style.width = Math.min(100, rms * 500) + '%';
  // Labels
  ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '10px Orbitron'; ctx.fillText('VOICE SPECTRUM', 10, 15);
  animId = requestAnimationFrame(drawVoice);
}

function drawIdle() {
  if (!ctx) return; ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0,255,170,0.15)'; ctx.font = '13px Orbitron'; ctx.textAlign = 'center';
  ctx.fillText('VOICE CLOAK — Click Start', canvas.width / 2, canvas.height / 2); ctx.textAlign = 'left';
}

/* ═══════ AUDIO PROCESSING ═══════ */
async function startCloak() {
  if (!audioCtx) audioCtx = new AudioCtx(); if (audioCtx.state === 'suspended') await audioCtx.resume();
  try {
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const src = audioCtx.createMediaStreamSource(micStream);
    analyser = audioCtx.createAnalyser(); analyser.fftSize = 2048;
    dataArray = new Uint8Array(analyser.fftSize); freqArray = new Uint8Array(analyser.frequencyBinCount);
    // Distortion node
    distNode = audioCtx.createWaveShaper(); distNode.oversample = '4x';
    // Biquad filter for pitch shifting illusion
    bqFilter = audioCtx.createBiquadFilter(); bqFilter.type = 'lowpass'; bqFilter.frequency.value = 3000;
    gainNode = audioCtx.createGain(); gainNode.gain.value = 0.8;
    // Chain: src -> analyser, src -> distortion -> filter -> gain -> output
    src.connect(analyser); src.connect(distNode); distNode.connect(bqFilter); bqFilter.connect(gainNode); gainNode.connect(audioCtx.destination);
    applyVoicePreset();
    isActive = true; setStatus(true);
    $('cloakStatus').textContent = 'ACTIVE'; $('cloakStatus').style.color = '#22c55e';
    drawVoice(); log(T('started'), 'success'); showToast(T('started'), 2000);
  } catch (e) { log('Mic denied: ' + e.message, 'error'); }
}

function stopCloak() {
  isActive = false; setStatus(false);
  if (micStream) { micStream.getTracks().forEach(t => t.stop()); micStream = null; }
  if (animId) { cancelAnimationFrame(animId); animId = null; }
  $('cloakStatus').textContent = T('inactive'); $('cloakStatus').style.color = '';
  log(T('stopped'), 'info'); drawIdle();
}

function makeDistortionCurve(amount) {
  const n = 44100, c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = i * 2 / n - 1;
    c[i] = amount > 0 ? (3 + amount) * x * 20 * (Math.PI / 180) / (Math.PI + amount * Math.abs(x)) : x;
  }
  return c;
}

function applyVoicePreset() {
  const preset = $('voiceSelect').value;
  const p = PRESETS[preset] || PRESETS.deep;
  $('pitchRange').value = p.pitch; $('pitchVal').textContent = p.pitch.toFixed(1) + 'x';
  $('distRange').value = p.dist; $('distVal').textContent = p.dist;
  if (distNode) distNode.curve = makeDistortionCurve(p.dist);
  if (bqFilter) {
    const freq = p.pitch > 1 ? Math.min(8000, 3000 * p.pitch) : Math.max(500, 3000 * p.pitch);
    bqFilter.frequency.value = freq;
  }
  $('voiceInfo').innerHTML = 'Preset: ' + p.label + '<br>Pitch: ' + p.pitch + 'x<br>Distortion: ' + p.dist +
    '<br>Filter: ' + Math.round(bqFilter ? bqFilter.frequency.value : 0) + ' Hz';
  log('Preset: ' + p.label, 'info');
}

function fillPresets() {
  const el = $('presetList'); if (!el) return;
  Object.entries(PRESETS).forEach(([k, v]) => {
    const d = document.createElement('div');
    d.className = 'preset-card';
    d.innerHTML = '<b>' + v.label + '</b> — Pitch: ' + v.pitch + 'x, Dist: ' + v.dist;
    d.onclick = () => { $('voiceSelect').value = k; applyVoicePreset(); };
    el.appendChild(d);
  });
}

function fillDSP() {
  const el = $('dspInfo'); if (!el) return;
  el.innerHTML = '<b>Voice Transformation DSP</b><br><br>' +
    '<b>Pitch Shifting:</b> Changes the fundamental frequency. Lower pitch = deeper voice, higher = chipmunk. Real-time pitch shifting uses time-domain methods (PSOLA) or frequency-domain (phase vocoder).<br><br>' +
    '<b>Waveshaping Distortion:</b> Non-linear transfer function y = f(x) adds harmonics. Creates robotic/demonic effects. Controlled by the "amount" parameter which steepens the curve.<br><br>' +
    '<b>Biquad Filtering:</b> IIR filter that shapes frequency response. Low-pass removes high frequencies (deep voice), high-pass removes low frequencies (thin voice).<br><br>' +
    '<b>Real Applications:</b> Witness protection programs, anonymous phone tips, VoIP privacy, entertainment, voice acting, accessibility tools.<br><br>' +
    '<b>Counter-measures:</b> Advanced voice biometrics can sometimes reverse pitch shifts by analyzing formant patterns. Combining multiple effects (pitch + distortion + formant shift) provides better anonymity than any single technique.';
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(dismissSplash, 2500);
  try { const l = localStorage.getItem('wdiy-lang'); if (l) setLanguage(l); else setLanguage('en'); } catch { setLanguage('en'); }
  try { const t = localStorage.getItem('wdiy-theme'); if (t) setTheme(t); } catch {}
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
  document.querySelectorAll('.help-tab').forEach(tab => { tab.onclick = () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const tgt = $('help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)); if (tgt) tgt.classList.add('active'); }; });
  document.querySelectorAll('.log-filter').forEach(btn => { btn.onclick = () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); }; });
  $('cloakBtn').onclick = startCloak; $('stopCloakBtn').onclick = stopCloak;
  $('voiceSelect').onchange = applyVoicePreset;
  $('pitchRange').oninput = e => { $('pitchVal').textContent = parseFloat(e.target.value).toFixed(1) + 'x'; if (bqFilter) bqFilter.frequency.value = 3000 * parseFloat(e.target.value); };
  $('distRange').oninput = e => { $('distVal').textContent = e.target.value; if (distNode) distNode.curve = makeDistortionCurve(parseInt(e.target.value)); };
  drawIdle(); fillPresets(); fillDSP(); log(T('ready'), 'success');
});

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Voice Cloak
   Animated voice transformation pipeline with spectrum morphing,
   formant visualization, and real-time DSP chain diagram
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simVoiceCloak';let cv,cx,W,H,af=null,t=0;
  const specBars=128;const origSpec=new Float32Array(specBars);
  const cloakedSpec=new Float32Array(specBars);
  const waveHist=[];let simPitch=0.7,simDist=30,morphPhase=0;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#080610;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  function genVoiceSpectrum(pitch,dist){
    // Simulate vocal formants with pitch adjustment
    const f1=700*pitch,f2=1200*pitch,f3=2500*pitch;
    for(let i=0;i<specBars;i++){
      const freq=i/specBars*8000;
      let val=0;
      // Formant peaks
      val+=0.8*Math.exp(-Math.pow((freq-f1)/120,2));
      val+=0.5*Math.exp(-Math.pow((freq-f2)/180,2));
      val+=0.3*Math.exp(-Math.pow((freq-f3)/250,2));
      // Harmonics from pitch
      for(let h=1;h<=8;h++){
        val+=0.15/h*Math.exp(-Math.pow((freq-150*pitch*h)/50,2));
      }
      // Noise floor
      val+=0.03+Math.random()*0.02;
      origSpec[i]=val;
      // Cloaked version: distortion adds harmonics, pitch shifts formants
      let cVal=val;
      cVal+=dist/100*0.3*Math.sin(freq*0.01+t*5);
      cVal*=(1+dist/100*0.5*Math.sin(freq*0.005));
      cloakedSpec[i]=Math.min(1,Math.max(0,cVal));
    }
  }

  function drawDSPChain(){
    const cy=20,ch=40;
    const nodes=[
      {label:'MIC',icon:'\u{1F399}',color:'#3b82f6',x:60},
      {label:'Pitch',icon:'\u{1F3B5}',color:'#f59e0b',x:200},
      {label:'Distort',icon:'\u{26A1}',color:'#ef4444',x:340},
      {label:'Filter',icon:'\u{1F50A}',color:'#8b5cf6',x:480},
      {label:'OUT',icon:'\u{1F50A}',color:'#22c55e',x:620}
    ];
    // Connection lines
    for(let i=0;i<nodes.length-1;i++){
      cx.beginPath();cx.moveTo(nodes[i].x+25,cy+ch/2);cx.lineTo(nodes[i+1].x-25,cy+ch/2);
      const pulseBright=0.15+0.1*Math.sin(t*3+i);
      cx.strokeStyle='rgba(100,200,255,'+pulseBright+')';cx.lineWidth=2;cx.stroke();
      // Signal dots flowing
      const dotPos=((t*60+i*30)%(nodes[i+1].x-nodes[i].x-50));
      cx.fillStyle='rgba(255,255,255,0.6)';cx.beginPath();
      cx.arc(nodes[i].x+25+dotPos,cy+ch/2,2,0,Math.PI*2);cx.fill();
    }
    // Nodes
    nodes.forEach(n=>{
      cx.save();cx.shadowColor=n.color;cx.shadowBlur=4;
      cx.beginPath();cx.roundRect(n.x-22,cy,44,ch,6);
      cx.fillStyle='rgba(0,0,0,0.5)';cx.fill();
      cx.strokeStyle=n.color;cx.lineWidth=1.5;cx.stroke();
      cx.shadowBlur=0;
      cx.font='12px sans-serif';cx.textAlign='center';cx.textBaseline='middle';
      cx.fillText(n.icon,n.x,cy+ch/2-2);
      cx.font='7px monospace';cx.fillStyle=n.color;
      cx.fillText(n.label,n.x,cy+ch+10);
      cx.restore();
    });
  }

  function drawSpectrumComparison(){
    const sx=30,sy=80,sw=(W-80)/2,sh=90;
    // Original
    cx.fillStyle='rgba(0,0,0,0.25)';cx.fillRect(sx,sy,sw,sh);
    cx.fillStyle='rgba(59,130,246,0.4)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('ORIGINAL VOICE',sx+4,sy+10);
    for(let i=0;i<specBars;i++){
      const x=sx+i/specBars*sw;
      const h2=origSpec[i]*sh*0.8;
      const hue=200+origSpec[i]*60;
      cx.fillStyle='hsla('+hue+',70%,50%,0.6)';
      cx.fillRect(x,sy+sh-h2,sw/specBars-0.5,h2);
    }
    // Cloaked
    const cx2=sx+sw+20;
    cx.fillStyle='rgba(0,0,0,0.25)';cx.fillRect(cx2,sy,sw,sh);
    cx.fillStyle='rgba(239,68,68,0.4)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('CLOAKED VOICE',cx2+4,sy+10);
    for(let i=0;i<specBars;i++){
      const x=cx2+i/specBars*sw;
      const h2=cloakedSpec[i]*sh*0.8;
      const hue=0+cloakedSpec[i]*40;
      cx.fillStyle='hsla('+hue+',70%,50%,0.6)';
      cx.fillRect(x,sy+sh-h2,sw/specBars-0.5,h2);
    }
    // Arrow between
    cx.fillStyle='rgba(255,255,255,0.3)';cx.font='16px sans-serif';cx.textAlign='center';
    cx.fillText('\u{27A1}',sx+sw+10,sy+sh/2);
  }

  function drawWaveformComparison(){
    const wy=185,wh=50,ww=(W-80)/2;
    // Original waveform
    cx.fillStyle='rgba(0,0,0,0.2)';cx.fillRect(30,wy,ww,wh);
    cx.strokeStyle='rgba(59,130,246,0.6)';cx.lineWidth=1.5;cx.beginPath();
    for(let i=0;i<ww;i++){
      const tt=i/ww*4+t*3;
      const y=wy+wh/2+Math.sin(tt*8)*wh*0.3*Math.sin(tt);
      if(i===0)cx.moveTo(30+i,y);else cx.lineTo(30+i,y);
    }
    cx.stroke();

    // Cloaked waveform
    const cx2=50+ww;
    cx.fillStyle='rgba(0,0,0,0.2)';cx.fillRect(cx2,wy,ww,wh);
    cx.strokeStyle='rgba(239,68,68,0.6)';cx.lineWidth=1.5;cx.beginPath();
    for(let i=0;i<ww;i++){
      const tt=i/ww*4+t*3;
      let y=wy+wh/2+Math.sin(tt*8*simPitch)*wh*0.3*Math.sin(tt*simPitch);
      // Add distortion clipping
      y+=Math.sin(tt*20)*wh*0.1*(simDist/100);
      if(i===0)cx.moveTo(cx2+i,y);else cx.lineTo(cx2+i,y);
    }
    cx.stroke();
  }

  function drawFormantMap(){
    const fx=30,fy=245,fw=W-60,fh=30;
    cx.fillStyle='rgba(0,0,0,0.25)';cx.fillRect(fx,fy,fw,fh);
    // Formant positions
    const formants=[
      {label:'F1',origHz:700,cloakHz:700*simPitch,color:'#f59e0b'},
      {label:'F2',origHz:1200,cloakHz:1200*simPitch,color:'#8b5cf6'},
      {label:'F3',origHz:2500,cloakHz:2500*simPitch,color:'#ec4899'}
    ];
    formants.forEach(f=>{
      // Original position
      const ox=fx+(f.origHz/4000)*fw;
      cx.fillStyle=f.color+'44';cx.beginPath();cx.arc(ox,fy+fh/2,6,0,Math.PI*2);cx.fill();
      cx.strokeStyle=f.color;cx.lineWidth=1;cx.setLineDash([2,2]);cx.stroke();cx.setLineDash([]);
      // Cloaked position
      const mx=fx+(f.cloakHz/4000)*fw;
      cx.fillStyle=f.color;cx.beginPath();cx.arc(mx,fy+fh/2,5,0,Math.PI*2);cx.fill();
      cx.font='6px monospace';cx.fillStyle=f.color;cx.textAlign='center';
      cx.fillText(f.label,mx,fy+fh/2-9);
    });
    cx.fillStyle='rgba(255,255,255,0.3)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('FORMANT SHIFT MAP — 0 Hz',fx+4,fy-3);
    cx.textAlign='right';cx.fillText('4000 Hz',fx+fw-4,fy-3);cx.textAlign='left';
  }

  function drawPresetIndicator(){
    const px=W-160,py=245,pw=140,ph=30;
    cx.fillStyle='rgba(0,0,0,0.4)';cx.fillRect(px,py,pw,ph);
    cx.strokeStyle='rgba(255,255,255,0.1)';cx.strokeRect(px,py,pw,ph);
    cx.fillStyle='rgba(255,255,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('Pitch: '+simPitch.toFixed(1)+'x',px+8,py+12);
    cx.fillText('Distortion: '+simDist,px+8,py+24);
    // Cycle presets slowly
    if(Math.floor(t)%8===0&&Math.floor(t)!==Math.floor(t-0.016)){
      const pitches=[0.5,0.7,0.85,1.3,1.6,2.0];
      const dists=[0,20,40,60,80,100];
      const idx=Math.floor(Math.random()*pitches.length);
      simPitch=pitches[idx];simDist=dists[idx];
    }
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,190,56);
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.strokeRect(8,8,190,56);
    cx.font='10px monospace';cx.fillStyle='#00ffaa';cx.textAlign='left';
    cx.fillText('\u{1F399} VOICE CLOAK DSP',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Chain: Mic > Pitch > Dist > Filter > Out',16,40);
    cx.fillText('Latency: ~25ms  Quality: 16-bit/44.1kHz',16,54);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(8,6,16,0.15)';cx.fillRect(0,0,W,H);

    genVoiceSpectrum(simPitch,simDist);
    drawDSPChain();
    drawSpectrumComparison();
    drawWaveformComparison();
    drawFormantMap();
    drawPresetIndicator();
    drawHUD();

    cx.fillStyle='rgba(100,200,255,0.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Voice Transformation Pipeline — Real-Time DSP Simulation',8,H-8);

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
