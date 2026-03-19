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
    faq_q1:'What is Voice Cloak?', faq_a1:'A real-time voice transformer that changes your voice pitch, timbre, and adds effects to disguise your identity.',
    faq_q2:'Can it truly disguise my identity?', faq_a2:'Pitch shifting alone may not fool advanced voice biometrics, but combined with distortion it significantly alters vocal characteristics.',
    faq_q3:'Is there latency?', faq_a3:'Web Audio API processes in real-time with minimal latency (typically 10-50ms). Some effects may add slight delay.',
    faq_q4:'Is my audio private?', faq_a4:'100% local. Audio is processed entirely in your browser and never leaves your device.',
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
  },
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
    faq_q1:'Qu\'est-ce que le Masque Vocal?', faq_a1:'Un transformateur de voix en temps reel qui modifie la hauteur, le timbre et ajoute des effets pour masquer votre identite.',
    faq_q2:'Peut-il vraiment masquer mon identite?', faq_a2:'Le changement de hauteur seul ne trompe pas la biometrie vocale avancee, mais combine avec la distorsion il modifie significativement les caracteristiques vocales.',
    faq_q3:'Y a-t-il de la latence?', faq_a3:'L\'API Web Audio traite en temps reel avec une latence minimale (10-50ms typique).',
    faq_q4:'Mon audio est-il prive?', faq_a4:'100% local. L\'audio est traite dans votre navigateur et ne quitte jamais votre appareil.',
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
  },
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
    faq_q1:'ما هي عباءة الصوت؟', faq_a1:'محول صوت فوري يغير طبقة صوتك وجرسه ويضيف تأثيرات لإخفاء هويتك.',
    faq_q2:'هل يمكنها حقاً إخفاء هويتي؟', faq_a2:'تغيير الطبقة وحده قد لا يخدع القياسات الحيوية المتقدمة، لكن مع التشويه يغير الخصائص الصوتية بشكل كبير.',
    faq_q3:'هل هناك تأخير؟', faq_a3:'واجهة Web Audio تعالج في الوقت الحقيقي بتأخير ضئيل (10-50 مللي ثانية عادة).',
    faq_q4:'هل صوتي خاص؟', faq_a4:'معالجة محلية 100%. الصوت يُعالج في متصفحك ولا يغادر جهازك أبدًا.',
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
  }
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
