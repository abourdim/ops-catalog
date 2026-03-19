/**
 * SE-Deepfake-Voice-Cloner — Workshop DIY v1.0
 * Rich canvas-based voice cloning simulation for security awareness.
 * Framework: Themes, i18n (EN/FR/AR), RTL, Log, Toast, Canvas
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title:'Deepfake Voice Cloner', subtitle:'Simulate AI voice cloning threats',
    disconnected:'Disconnected', connected:'Connected',
    mainSection:'Deepfake Voice Cloner', mainDesc:'AI voice cloning simulation for security awareness',
    sectionA:'Clone Analysis Lab', sectionB:'How It Works', sectionC:'Challenge',
    recordBtn:'Record', cloneBtn:'Clone Voice', playOrig:'Play Original', playClone:'Play Cloned', detectBtn:'Detect Fake',
    similarityLabel:'Clone Similarity', similarityDesc:'AI model confidence', spectrumLabel:'Frequency Spectrum',
    voiceMale:'Male Voice', voiceFemale:'Female Voice', voiceChild:'Child Voice',
    howStep1:'A voice sample is recorded and converted to a spectrogram representation.',
    howStep2:'An AI model analyzes the voice\'s unique characteristics (timbre, pitch, cadence).',
    howStep3:'The model generates a synthetic clone that mimics the original voice patterns.',
    howStep4:'Detection algorithms analyze spectral anomalies to identify deepfake artifacts.',
    challenge1:'How can you tell a cloned voice from a real one?',
    challenge2:'Why is deepfake voice cloning dangerous for social engineering?',
    challenge3:'Design a defense protocol against voice deepfakes.',
    challengeReveal1:'Look for metallic resonance at high frequencies, unnatural micro-pauses, and consistent pitch that lacks natural human variation.',
    challengeReveal2:'Attackers can impersonate executives in phone calls (vishing), authorize fraudulent wire transfers, or manipulate employees into revealing sensitive information.',
    challengeReveal3:'Use code words for sensitive requests, implement callback verification on separate channels, deploy real-time deepfake detection AI, and never authorize financial transactions based solely on voice.',
    revealBtn:'Reveal Answer',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', export:'Export', filterAll:'All',
    settings:'⚙️ Settings', language:'Language', theme:'Theme', soundEffects:'🔊 Sound effects',
    help:'❓ Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    faq_q1:'What is deepfake voice cloning?', faq_a1:'AI technology that replicates a person\'s voice from short audio samples using neural network models.',
    faq_q2:'Is this real cloning?', faq_a2:'No. This is a purely educational simulation that visualizes how the process works without actually cloning voices.',
    faq_q3:'How to detect deepfakes?', faq_a3:'Look for unnatural pauses, metallic artifacts, inconsistent pitch, spectral anomalies, and phase discontinuities.',
    faq_q4:'Is my data private?', faq_a4:'Yes. Everything runs locally in your browser. No data leaves your device.',
    howto_1:'Select a voice type (male, female, child) from the dropdown.',
    howto_2:'Click Record to capture a simulated voice sample and observe the waveform.',
    howto_3:'Click Clone Voice to simulate AI synthesis and watch the similarity meter rise.',
    howto_4:'Open Clone Analysis Lab, play original vs cloned, and use Detect Fake to find artifacts.',
    wiki_t1:'🎙️ Voice Synthesis', wiki_d1:'Neural TTS models like WaveNet learn voice characteristics from short samples to generate convincing synthetic speech.',
    wiki_t2:'🔍 Spectral Detection', wiki_d2:'Spectral analysis reveals anomalies in frequency distribution that betray synthetic audio generation.',
    wiki_t3:'🛡️ Social Engineering Risk', wiki_d3:'Voice cloning enables vishing attacks where attackers impersonate trusted individuals over phone calls.',
    ready:'🎙️ Deepfake Voice Cloner ready — select a voice and record!',
    recording:'Recording voice sample...', recordDone:'Voice sample captured (%hz Hz detected).',
    cloning:'Cloning voice with neural model...', cloneDone:'Voice clone generated — %sim% similarity!',
    detecting:'Running deepfake detection algorithms...', detected:'Artifacts detected: metallic resonance at %hz Hz, phase score 0.%ps',
    playingOrig:'Playing original sample...', playingClone:'Playing cloned sample...',
    noSample:'Record a voice sample first.', noClone:'Clone a voice first.',
    logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed',
    working:'Working...', splashHint:'tap to skip',
    langChanged:'🌐 Language → English', themeChanged:'🎨 Theme →',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  },
  fr: {
    title:'Clonage Vocal Deepfake', subtitle:'Simuler les menaces de clonage vocal IA',
    disconnected:'Déconnecté', connected:'Connecté',
    mainSection:'Clonage Vocal Deepfake', mainDesc:'Simulation de clonage vocal IA pour la sensibilisation à la sécurité',
    sectionA:'Laboratoire d\'Analyse', sectionB:'Comment ça Marche', sectionC:'Défi',
    recordBtn:'Enregistrer', cloneBtn:'Cloner la Voix', playOrig:'Jouer Original', playClone:'Jouer Cloné', detectBtn:'Détecter le Faux',
    similarityLabel:'Similarité du Clone', similarityDesc:'Confiance du modèle IA', spectrumLabel:'Spectre Fréquentiel',
    voiceMale:'Voix Masculine', voiceFemale:'Voix Féminine', voiceChild:'Voix d\'Enfant',
    howStep1:'Un échantillon vocal est enregistré et converti en représentation spectrogramme.',
    howStep2:'Un modèle IA analyse les caractéristiques uniques de la voix (timbre, hauteur, cadence).',
    howStep3:'Le modèle génère un clone synthétique imitant les patterns vocaux originaux.',
    howStep4:'Les algorithmes de détection analysent les anomalies spectrales pour identifier les artefacts deepfake.',
    challenge1:'Comment distinguer une voix clonée d\'une vraie?',
    challenge2:'Pourquoi le clonage vocal deepfake est-il dangereux pour l\'ingénierie sociale?',
    challenge3:'Concevez un protocole de défense contre les deepfakes vocaux.',
    challengeReveal1:'Cherchez la résonance métallique aux hautes fréquences, les micro-pauses non naturelles et une hauteur constante sans variation humaine naturelle.',
    challengeReveal2:'Les attaquants peuvent usurper l\'identité de dirigeants lors d\'appels (vishing), autoriser des virements frauduleux ou manipuler des employés pour révéler des informations sensibles.',
    challengeReveal3:'Utilisez des mots de passe pour les demandes sensibles, vérification par rappel sur des canaux séparés, déployez une IA de détection en temps réel, n\'autorisez jamais de transactions financières basées uniquement sur la voix.',
    revealBtn:'Révéler la Réponse',
    activityLog:'Journal d\'Activité', eventsMsg:'Événements et messages',
    clear:'Effacer', copy:'Copier', export:'Exporter', filterAll:'Tout',
    settings:'⚙️ Paramètres', language:'Langue', theme:'Thème', soundEffects:'🔊 Effets sonores',
    help:'❓ Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    faq_q1:'Qu\'est-ce que le clonage vocal deepfake?', faq_a1:'Technologie IA qui réplique la voix d\'une personne à partir d\'échantillons courts via des réseaux neuronaux.',
    faq_q2:'Est-ce un vrai clonage?', faq_a2:'Non. C\'est une simulation éducative qui visualise le processus sans cloner de voix.',
    faq_q3:'Comment détecter les deepfakes?', faq_a3:'Cherchez les pauses non naturelles, artefacts métalliques, hauteur incohérente et anomalies spectrales.',
    faq_q4:'Mes données sont-elles privées?', faq_a4:'Oui. Tout fonctionne localement dans votre navigateur.',
    howto_1:'Sélectionnez un type de voix dans le menu déroulant.',
    howto_2:'Cliquez Enregistrer pour capturer un échantillon vocal simulé.',
    howto_3:'Cliquez Cloner pour simuler la synthèse IA et observer la similarité.',
    howto_4:'Ouvrez le Laboratoire, jouez l\'original vs le cloné et détectez les artefacts.',
    wiki_t1:'🎙️ Synthèse Vocale', wiki_d1:'Les modèles TTS neuronaux apprennent les caractéristiques vocales pour générer de la parole synthétique convaincante.',
    wiki_t2:'🔍 Détection Spectrale', wiki_d2:'L\'analyse spectrale révèle les anomalies de distribution fréquentielle trahissant la génération audio synthétique.',
    wiki_t3:'🛡️ Risque d\'Ingénierie Sociale', wiki_d3:'Le clonage vocal permet des attaques de vishing où les attaquants usurpent l\'identité de personnes de confiance.',
    ready:'🎙️ Clonage Vocal Deepfake prêt — sélectionnez une voix!',
    recording:'Enregistrement de l\'échantillon vocal...', recordDone:'Échantillon vocal capturé (%hz Hz détecté).',
    cloning:'Clonage vocal avec le modèle neuronal...', cloneDone:'Clone vocal généré — %sim% de similarité!',
    detecting:'Exécution des algorithmes de détection...', detected:'Artefacts détectés: résonance métallique à %hz Hz, score de phase 0.%ps',
    playingOrig:'Lecture de l\'échantillon original...', playingClone:'Lecture de l\'échantillon cloné...',
    noSample:'Enregistrez d\'abord un échantillon vocal.', noClone:'Clonez d\'abord une voix.',
    logCleared:'Journal effacé', copied:'Copié!', copyFail:'Échec de copie',
    working:'En cours...', splashHint:'appuyer pour passer',
    langChanged:'🌐 Langue → Français', themeChanged:'🎨 Thème →',
    t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  },
  ar: {
    title:'مُستنسخ الصوت المزيّف', subtitle:'محاكاة تهديدات استنساخ الصوت بالذكاء الاصطناعي',
    disconnected:'غير متصل', connected:'متصل',
    mainSection:'مُستنسخ الصوت المزيّف', mainDesc:'محاكاة استنساخ الصوت للتوعية الأمنية',
    sectionA:'مختبر تحليل الاستنساخ', sectionB:'كيف يعمل', sectionC:'التحدي',
    recordBtn:'تسجيل', cloneBtn:'استنساخ الصوت', playOrig:'تشغيل الأصلي', playClone:'تشغيل المستنسخ', detectBtn:'كشف التزييف',
    similarityLabel:'تشابه الاستنساخ', similarityDesc:'ثقة نموذج الذكاء الاصطناعي', spectrumLabel:'طيف التردد',
    voiceMale:'صوت ذكر', voiceFemale:'صوت أنثى', voiceChild:'صوت طفل',
    howStep1:'يتم تسجيل عينة صوتية وتحويلها إلى تمثيل طيفي.',
    howStep2:'يحلل نموذج الذكاء الاصطناعي الخصائص الفريدة للصوت (الجرس، النبرة، الإيقاع).',
    howStep3:'يولّد النموذج نسخة صناعية تحاكي أنماط الصوت الأصلية.',
    howStep4:'تحلل خوارزميات الكشف الشذوذ الطيفي لتحديد آثار التزييف العميق.',
    challenge1:'كيف يمكنك التمييز بين صوت مستنسخ وصوت حقيقي؟',
    challenge2:'لماذا يُعتبر استنساخ الصوت المزيّف خطيرًا في الهندسة الاجتماعية؟',
    challenge3:'صمم بروتوكول دفاع ضد التزييف الصوتي العميق.',
    challengeReveal1:'ابحث عن الرنين المعدني في الترددات العالية، والتوقفات الدقيقة غير الطبيعية، والنبرة الثابتة التي تفتقر للتنوع البشري الطبيعي.',
    challengeReveal2:'يمكن للمهاجمين انتحال شخصية المدراء التنفيذيين في المكالمات الهاتفية، والموافقة على تحويلات مالية احتيالية، أو التلاعب بالموظفين لكشف معلومات حساسة.',
    challengeReveal3:'استخدم كلمات سر للطلبات الحساسة، وتحقق عبر الاتصال العكسي على قنوات منفصلة، وانشر ذكاء اصطناعي للكشف الفوري، ولا توافق أبدًا على معاملات مالية بناءً على الصوت فقط.',
    revealBtn:'اكشف الإجابة',
    activityLog:'سجل النشاط', eventsMsg:'الأحداث والرسائل',
    clear:'مسح', copy:'نسخ', export:'تصدير', filterAll:'الكل',
    settings:'⚙️ الإعدادات', language:'اللغة', theme:'المظهر', soundEffects:'🔊 المؤثرات الصوتية',
    help:'❓ مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي',
    faq_q1:'ما هو استنساخ الصوت المزيّف؟', faq_a1:'تقنية ذكاء اصطناعي تستنسخ صوت شخص من عينات صوتية قصيرة باستخدام نماذج الشبكات العصبية.',
    faq_q2:'هل هذا استنساخ حقيقي؟', faq_a2:'لا. هذه محاكاة تعليمية بحتة تُصوّر كيفية عمل العملية دون استنساخ فعلي للأصوات.',
    faq_q3:'كيف تكشف التزييف العميق؟', faq_a3:'ابحث عن التوقفات غير الطبيعية والأصوات المعدنية والنبرة غير المتسقة والشذوذ الطيفي.',
    faq_q4:'هل بياناتي خاصة؟', faq_a4:'نعم. كل شيء يعمل محليًا في متصفحك. لا تغادر أي بيانات جهازك.',
    howto_1:'اختر نوع الصوت من القائمة المنسدلة.',
    howto_2:'انقر تسجيل لالتقاط عينة صوتية ومراقبة شكل الموجة.',
    howto_3:'انقر استنساخ الصوت لمحاكاة التوليف ومشاهدة مقياس التشابه يرتفع.',
    howto_4:'افتح مختبر التحليل، شغّل الأصلي مقابل المستنسخ واستخدم كشف التزييف لإيجاد الشوائب.',
    wiki_t1:'🎙️ التوليف الصوتي', wiki_d1:'نماذج TTS العصبية مثل WaveNet تتعلم خصائص الصوت لتوليد كلام صناعي مقنع.',
    wiki_t2:'🔍 الكشف الطيفي', wiki_d2:'التحليل الطيفي يكشف الشذوذ في توزيع الترددات الذي يفضح توليد الصوت الصناعي.',
    wiki_t3:'🛡️ مخاطر الهندسة الاجتماعية', wiki_d3:'يُمكّن استنساخ الصوت من هجمات التصيد الصوتي حيث ينتحل المهاجمون شخصية أفراد موثوقين.',
    ready:'🎙️ مُستنسخ الصوت المزيّف جاهز — اختر صوتًا وسجّل!',
    recording:'جارٍ تسجيل العينة الصوتية...', recordDone:'تم التقاط العينة الصوتية (%hz هرتز).',
    cloning:'جارٍ استنساخ الصوت بالنموذج العصبي...', cloneDone:'تم توليد الصوت المستنسخ — %sim% تشابه!',
    detecting:'جارٍ تشغيل خوارزميات الكشف...', detected:'تم اكتشاف شوائب: رنين معدني عند %hz هرتز، نتيجة الطور 0.%ps',
    playingOrig:'جارٍ تشغيل العينة الأصلية...', playingClone:'جارٍ تشغيل العينة المستنسخة...',
    noSample:'سجّل عينة صوتية أولًا.', noClone:'استنسخ صوتًا أولًا.',
    logCleared:'تم مسح السجل', copied:'تم النسخ!', copyFail:'فشل النسخ',
    working:'جارٍ...', splashHint:'انقر للتخطي',
    langChanged:'🌐 اللغة ← العربية', themeChanged:'🎨 المظهر ←',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
  }
};

let currentLang = 'en';
function T(k){ return (LANG[currentLang]||LANG.en)[k]||k; }

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){
  if(!soundEnabled) return;
  if(!audioCtx) audioCtx = new AudioCtx();
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination); g.gain.value = 0.08;
  const t = audioCtx.currentTime;
  if(type==='click'){ o.frequency.value=800; o.type='sine'; g.gain.exponentialRampToValueAtTime(0.001,t+0.08); o.start(t); o.stop(t+0.08); }
  else if(type==='success'){ o.frequency.value=523; o.type='sine'; g.gain.exponentialRampToValueAtTime(0.001,t+0.3); o.start(t); o.stop(t+0.3); }
  else if(type==='error'){ o.frequency.value=200; o.type='square'; g.gain.exponentialRampToValueAtTime(0.001,t+0.25); o.start(t); o.stop(t+0.25); }
}

/* ═══════ LANGUAGE ═══════ */
function setLanguage(lang){
  currentLang = lang;
  const s = LANG[lang]; if(!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if(s[k]!=null) el.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if(s[k]!=null) o.textContent = s[k]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k = el.dataset.i18nPlaceholder; if(s[k]!=null) el.placeholder = s[k]; });
  document.title = s.title + ' — Workshop DIY';
  document.documentElement.dir = lang==='ar'?'rtl':'ltr';
  document.documentElement.lang = lang;
  const sel = $('langSelect'); if(sel) sel.value = lang;
  try{ localStorage.setItem('wdiy-lang', lang); } catch{}
  log(s.langChanged, 'info');
}

/* ═══════ THEME ═══════ */
function setTheme(name){
  document.documentElement.dataset.theme = name;
  document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(name));
  const sel = $('themeSelect'); if(sel) sel.value = name;
  try{ localStorage.setItem('wdiy-theme', name); } catch{}
  log(T('themeChanged') + ' ' + name, 'info');
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg, type='info'){
  if(!logContainer) logContainer = $('logContainer'); if(!logContainer) return;
  const d = document.createElement('div'); d.className = 'log-line ' + type;
  d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg;
  logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight;
  if(type==='success') playSound('success'); else if(type==='error') playSound('error');
  applyLogFilter();
}
function clearLog(){ if(!logContainer) logContainer=$('logContainer'); if(logContainer) logContainer.innerHTML=''; log(T('logCleared')); }
async function copyLog(){
  if(!logContainer) logContainer=$('logContainer'); if(!logContainer) return;
  const t = Array.from(logContainer.children).map(d=>d.textContent).join('\n');
  try{ await navigator.clipboard.writeText(t); log(T('copied'),'success'); } catch{ log(T('copyFail'),'error'); }
}
function exportLog(){
  if(!logContainer) logContainer=$('logContainer'); if(!logContainer) return;
  const t = Array.from(logContainer.children).map(d=>d.textContent).join('\n');
  const b = new Blob([t],{type:'text/plain'}), u = URL.createObjectURL(b), a = document.createElement('a');
  a.href = u; a.download = 'deepfake-voice-log-'+new Date().toISOString().slice(0,10)+'.txt'; a.click(); URL.revokeObjectURL(u);
}

/* ═══════ TOAST ═══════ */
function showToast(msg, ms=0){ const el=$('toastIndicator'),t=$('toastMessage'); if(el&&t){ t.textContent=msg||T('working'); el.style.display='block'; } if(ms>0) setTimeout(hideToast,ms); }
function hideToast(){ const el=$('toastIndicator'); if(el) el.style.display='none'; }

/* ═══════ STATUS ═══════ */
function setStatus(c){ const t=$('statusText'); if(t) t.textContent=c?T('connected'):T('disconnected'); const p=$('statusPill'); if(p) p.classList.toggle('connected',c); }

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash(){ const s=$('splash'); if(!s) return; s.classList.add('hidden'); if(splashTimer) clearTimeout(splashTimer); setTimeout(()=>s.remove(),600); playSound('click'); }
function initSplash(){ const s=$('splash'); if(!s) return; splashTimer=setTimeout(dismissSplash,2500); }

/* ═══════ LOG FILTER ═══════ */
let activeLogFilter = 'all';
function initLogFilters(){ document.querySelectorAll('.log-filter').forEach(btn=>{ btn.addEventListener('click',()=>{ document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); activeLogFilter=btn.dataset.filter; applyLogFilter(); }); }); }
function applyLogFilter(){ if(!logContainer) logContainer=$('logContainer'); if(!logContainer) return; Array.from(logContainer.children).forEach(l=>{ l.style.display=activeLogFilter==='all'?'':l.classList.contains(activeLogFilter)?'':'none'; }); }

/* ═══════ HIJRI ═══════ */
function initHijriDate(){ const el=$('hijriDate'); if(!el) return; try{ el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date()); }catch{} }

/* ═══════ PANELS ═══════ */
function openPanel(pid,oid){ const s=$(pid),o=$(oid); if(s) s.classList.add('open'); if(o) o.classList.add('open'); }
function closePanel(pid,oid){ const s=$(pid),o=$(oid); if(s) s.classList.remove('open'); if(o) o.classList.remove('open'); }
function openHelp(){ openPanel('helpPanel','helpOverlay'); }
function closeHelp(){ closePanel('helpPanel','helpOverlay'); }
function openSettings(){ openPanel('settingsPanel','settingsOverlay'); }
function closeSettings(){ closePanel('settingsPanel','settingsOverlay'); }
function openLog(){ const s=$('logPanel'); if(s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog(){ const s=$('logPanel'); if(s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog(){ const s=$('logPanel'); s&&s.classList.contains('open')?closeLog():openLog(); }
function initHelpTabs(){ document.querySelectorAll('.help-tab').forEach(tab=>{ tab.addEventListener('click',()=>{ document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active')); tab.classList.add('active'); const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1); const el=$(id); if(el) el.classList.add('active'); }); }); }

/* ═══════ CHALLENGE ═══════ */
window.revealChallenge = function(i){ const el=$('answer'+i); if(el) el.classList.toggle('visible'); };

/* ═══════ CANVAS — Waveform Visualization ═══════ */
let waveAnim, isRecording = false, isCloned = false;
let origData = [], cloneData = [];
let similarity = 0, detectedFreq = 0;
let recordPhase = 0;

function getAccent(){ return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c'; }

function initWaveCanvas(){
  const c = $('waveCanvas'); if(!c) return;
  const ctx = c.getContext('2d');
  function resize(){ c.width = c.offsetWidth * (window.devicePixelRatio||1); c.height = 220 * (window.devicePixelRatio||1); ctx.scale(window.devicePixelRatio||1, window.devicePixelRatio||1); }
  resize(); window.addEventListener('resize', resize);
  const W = ()=> c.width/(window.devicePixelRatio||1);
  const H = ()=> 220;
  let t = 0;
  const particles = [];
  for(let i=0;i<60;i++) particles.push({ x:Math.random(), y:Math.random(), s:Math.random()*2+0.5, a:Math.random()*0.4+0.1 });

  function draw(){
    const w=W(), h=H();
    ctx.fillStyle = 'rgba(10,10,26,0.15)';
    ctx.fillRect(0,0,w,h);
    const accent = getAccent();

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for(let y=0;y<h;y+=20){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    for(let x=0;x<w;x+=40){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }

    // Floating particles
    ctx.fillStyle = accent;
    particles.forEach(p => {
      p.x += 0.001 * p.s;
      p.y += Math.sin(t*0.02 + p.x*10) * 0.001;
      if(p.x > 1) p.x = 0;
      ctx.globalAlpha = p.a * (isRecording ? 1 : 0.3);
      ctx.beginPath(); ctx.arc(p.x*w, p.y*h, p.s, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Voice waveform
    const voice = $('voiceSelect') ? $('voiceSelect').value : 'male';
    const baseF = voice==='male'?120 : voice==='female'?220 : 340;
    const amp = isRecording ? 60 + Math.sin(t*0.03)*20 : 12;
    const cloneAmp = isCloned ? amp * 0.9 : 0;

    // Original waveform
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.shadowColor = accent;
    ctx.shadowBlur = isRecording ? 8 : 2;
    ctx.beginPath();
    for(let x=0; x<w; x++){
      const n = Math.sin(x*0.015+t*0.06)*amp + Math.sin(x*baseF/6000+t*0.04)*amp*0.4 + Math.sin(x*0.04+t*0.08)*amp*0.2;
      const y = h/2 + n * (isRecording ? 1 : 0.3);
      x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
    }
    ctx.stroke();

    // Clone waveform (red, slightly offset)
    if(isCloned){
      ctx.strokeStyle = '#ff4444';
      ctx.shadowColor = '#ff4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for(let x=0; x<w; x++){
        const n = Math.sin(x*0.015+t*0.06+0.3)*cloneAmp + Math.sin(x*baseF/6000+t*0.04+0.2)*cloneAmp*0.35 + Math.sin(x*0.04+t*0.08)*cloneAmp*0.25;
        const y = h/2 + n * 0.85;
        x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    // Recording indicator
    if(isRecording){
      ctx.fillStyle = 'rgba(255,0,0,' + (0.5+Math.sin(t*0.1)*0.5) + ')';
      ctx.beginPath(); ctx.arc(20, 20, 6, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '10px Orbitron, monospace';
      ctx.fillText('REC', 30, 24);
      // Level meter
      const level = 0.4 + Math.sin(t*0.07)*0.3 + Math.random()*0.2;
      ctx.fillStyle = accent;
      ctx.fillRect(w-110, 10, level*100, 8);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.strokeRect(w-110, 10, 100, 8);
    }

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '9px Orbitron, monospace';
    ctx.fillText('ORIGINAL', 10, h-10);
    if(isCloned){
      ctx.fillStyle = 'rgba(255,68,68,0.6)';
      ctx.fillText('CLONE', 80, h-10);
    }

    // Frequency text
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillText(baseF + ' Hz BASE', w-100, h-10);

    t++;
    waveAnim = requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════ CANVAS — Spectrogram Analysis ═══════ */
let specAnim;
function initSpecCanvas(){
  const c = $('specCanvas'); if(!c) return;
  const ctx = c.getContext('2d');
  function resize(){ c.width = c.offsetWidth * (window.devicePixelRatio||1); c.height = 200 * (window.devicePixelRatio||1); ctx.scale(window.devicePixelRatio||1, window.devicePixelRatio||1); }
  resize(); window.addEventListener('resize', resize);
  const W = ()=> c.width/(window.devicePixelRatio||1);
  const H = ()=> 200;
  let t = 0;
  let scrollOffset = 0;

  function draw(){
    const w=W(), h=H();
    const accent = getAccent();

    // Waterfall spectrogram effect
    if(origData.length > 0){
      // Shift existing content left
      const imgData = ctx.getImageData(2*(window.devicePixelRatio||1), 0, c.width, c.height);
      ctx.putImageData(imgData, 0, 0);

      // Draw new column on right
      const bars = 64;
      const bh = h / bars;
      for(let i=0; i<bars; i++){
        const origV = origData[i] || 0;
        const cloneV = cloneData[i] || 0;
        const intensity = origV / 180;
        const cloneIntensity = cloneV / 180;

        // Original (blue-green heat)
        const r = Math.floor(intensity * 50);
        const g = Math.floor(intensity * 200 + Math.sin(t*0.05+i)*20);
        const b = Math.floor(intensity * 255);
        ctx.fillStyle = `rgba(${r},${g},${b},0.8)`;
        ctx.fillRect(w-3, h - (i+1)*bh, 3, bh);

        // Clone overlay (red heat)
        if(isCloned && cloneV > 0){
          const cr = Math.floor(cloneIntensity * 255);
          const cg = Math.floor(cloneIntensity * 60);
          ctx.fillStyle = `rgba(${cr},${cg},0,0.4)`;
          ctx.fillRect(w-3, h - (i+1)*bh, 3, bh);
        }
      }

      // Anomaly markers
      if(isCloned && t % 30 < 5){
        const anomalyBin = Math.floor(Math.random()*20) + 40;
        if(anomalyBin < bars){
          ctx.fillStyle = 'rgba(255,255,0,0.8)';
          ctx.fillRect(w-4, h - (anomalyBin+1)*bh, 4, bh*2);
        }
      }
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0,0,w,h);
    }

    // Frequency labels
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '8px Orbitron, monospace';
    ctx.fillText('8 kHz', 4, 12);
    ctx.fillText('4 kHz', 4, h/2);
    ctx.fillText('0 Hz', 4, h-4);

    // Legend
    ctx.fillStyle = 'rgba(100,200,255,0.6)';
    ctx.fillRect(w-120, 6, 10, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '8px Orbitron, monospace';
    ctx.fillText('ORIG', w-106, 13);
    if(isCloned){
      ctx.fillStyle = 'rgba(255,80,0,0.6)';
      ctx.fillRect(w-65, 6, 10, 8);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('CLONE', w-51, 13);
    }

    // Animate spectral data
    if(origData.length > 0){
      for(let i=0; i<origData.length; i++){
        origData[i] += (Math.random()-0.5)*8;
        origData[i] = Math.max(10, Math.min(180, origData[i]));
        if(cloneData[i] !== undefined){
          cloneData[i] += (Math.random()-0.5)*10;
          cloneData[i] = Math.max(5, Math.min(180, cloneData[i]));
        }
      }
    }

    t++;
    specAnim = requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════ SIMULATION ACTIONS ═══════ */
function doRecord(){
  if(isRecording) return;
  isRecording = true;
  setStatus(true);
  log(T('recording'), 'info');
  showToast(T('recording'));

  const voice = $('voiceSelect') ? $('voiceSelect').value : 'male';
  const baseF = voice==='male'?120 : voice==='female'?220 : 340;
  detectedFreq = baseF + Math.floor(Math.random()*60);

  origData = [];
  for(let i=0; i<64; i++){
    const base = voice==='male'?80 : voice==='female'?60 : 40;
    origData.push(base + Math.random()*100);
  }

  $('freqVal').textContent = detectedFreq + ' Hz';
  $('pitchLabel').textContent = 'Pitch: ' + (detectedFreq<180?'Low':detectedFreq<280?'Medium':'High');

  setTimeout(()=>{
    isRecording = false;
    hideToast();
    log(T('recordDone').replace('%hz', detectedFreq), 'success');
  }, 2500);
}

function doClone(){
  if(origData.length===0){ log(T('noSample'),'error'); return; }
  log(T('cloning'), 'info');
  showToast(T('cloning'));

  let progress = 0;
  const iv = setInterval(()=>{
    progress += Math.random()*12;
    similarity = Math.min(97, Math.round(progress));
    $('similarityVal').textContent = similarity + ' %';
    $('simMeter').style.width = similarity + '%';
    cloneData = origData.map(v => v * (0.82 + Math.random()*0.35));
    if(progress >= 97){
      clearInterval(iv);
      isCloned = true;
      hideToast();
      log(T('cloneDone').replace('%sim', similarity), 'success');
      const dl = $('detectionLog');
      if(dl) dl.textContent += '\n[AI] Clone generated: ' + similarity + '% similarity\n[AI] Model: WaveNet-SE v3.2 | Params: 3.2M\n[AI] Latency: ' + (Math.random()*50+80).toFixed(1) + ' ms';
    }
  }, 250);
}

function doDetect(){
  if(!isCloned){ log(T('noClone'),'error'); return; }
  log(T('detecting'), 'info');
  showToast(T('detecting'));
  setTimeout(()=>{
    hideToast();
    const anomalyHz = Math.round(detectedFreq * 2.3 + Math.random()*500);
    const phaseScore = Math.round(Math.random()*30 + 65);
    log(T('detected').replace('%hz', anomalyHz).replace('%ps', phaseScore), 'success');
    const dl = $('detectionLog');
    if(dl){
      dl.textContent += '\n[DETECT] Spectral anomaly at ' + anomalyHz + ' Hz';
      dl.textContent += '\n[DETECT] Phase discontinuity: 0.' + phaseScore;
      dl.textContent += '\n[DETECT] Harmonic distortion: ' + (Math.random()*5+2).toFixed(2) + ' dB';
      dl.textContent += '\n[DETECT] Micro-pause pattern: ANOMALOUS';
      dl.textContent += '\n[VERDICT] ⚠ LIKELY DEEPFAKE (confidence: ' + (85+Math.random()*14).toFixed(1) + '%)';
      dl.scrollTop = dl.scrollHeight;
    }
  }, 2000);
}

function doPlayOrig(){
  if(origData.length===0){ log(T('noSample'),'error'); return; }
  log(T('playingOrig'), 'info');
  // Visual pulse on canvas
  origData = origData.map(v => v * 1.3);
  setTimeout(()=>{ origData = origData.map(v => v / 1.3); }, 1000);
}

function doPlayClone(){
  if(!isCloned){ log(T('noClone'),'error'); return; }
  log(T('playingClone'), 'info');
  cloneData = cloneData.map(v => v * 1.3);
  setTimeout(()=>{ cloneData = cloneData.map(v => v / 1.3); }, 1000);
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();
  initHijriDate();
  initLogFilters();
  initHelpTabs();

  // Buttons
  if($('clearLogBtn')) $('clearLogBtn').onclick = clearLog;
  if($('copyLogBtn')) $('copyLogBtn').onclick = copyLog;
  if($('exportLogBtn')) $('exportLogBtn').onclick = exportLog;
  if($('helpBtn')) $('helpBtn').onclick = openHelp;
  if($('helpCloseBtn')) $('helpCloseBtn').onclick = closeHelp;
  if($('helpOverlay')) $('helpOverlay').onclick = closeHelp;
  if($('settingsBtn')) $('settingsBtn').onclick = openSettings;
  if($('settingsCloseBtn')) $('settingsCloseBtn').onclick = closeSettings;
  if($('settingsOverlay')) $('settingsOverlay').onclick = closeSettings;
  if($('logBtn')) $('logBtn').onclick = toggleLog;
  if($('logCloseBtn')) $('logCloseBtn').onclick = closeLog;

  // Sound
  const st = $('soundToggle');
  if(st){ try{ soundEnabled = localStorage.getItem('wdiy-sound')==='true'; }catch{} st.checked=soundEnabled; st.addEventListener('change',()=>{ soundEnabled=st.checked; try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{} }); }

  // Language & Theme
  const ls=$('langSelect'), ts=$('themeSelect');
  if(ls) ls.addEventListener('change', ()=>setLanguage(ls.value));
  if(ts) ts.addEventListener('change', ()=>setTheme(ts.value));
  try{ const sl=localStorage.getItem('wdiy-lang'), st2=localStorage.getItem('wdiy-theme'); if(st2) setTheme(st2); if(sl) setLanguage(sl); }catch{}

  // Escape
  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeHelp(); closeSettings(); closeLog(); } });

  // Canvas
  initWaveCanvas();
  initSpecCanvas();

  // Sim buttons
  if($('recordBtn')) $('recordBtn').onclick = doRecord;
  if($('cloneBtn')) $('cloneBtn').onclick = doClone;
  if($('playOrigBtn')) $('playOrigBtn').onclick = doPlayOrig;
  if($('playCloneBtn')) $('playCloneBtn').onclick = doPlayClone;
  if($('detectBtn')) $('detectBtn').onclick = doDetect;

  log(T('ready'), 'success');
}
document.readyState==='loading' ? document.addEventListener('DOMContentLoaded', init) : init();
