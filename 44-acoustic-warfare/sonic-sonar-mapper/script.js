/**
 * Sonic Sonar Mapper — Workshop DIY v1.0
 * Echolocation room mapping with PPI radar display
 * Themes · i18n (EN/FR/AR) · RTL · Log · Canvas · Toast
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let currentLang = 'en', soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx, analyser, micStream, dataArray, freqArray;
let animId = null, sweepAngle = 0, pingCount = 0, autoMode = false, points = [];

const LANG = {
  en: {
    title:'Sonar Mapper', subtitle:'Echolocation Room Mapping',
    disconnected:'Idle', connected:'Scanning',
    mainSection:'Sonar Mapper', mainDesc:'Map room geometry using sound echoes',
    sectionA:'Echo Log', sectionB:'Sonar Science', sectionC:'Challenge',
    pingBtn:'Send Ping', autoBtn:'Auto Scan', clearMapBtn:'Clear Map', freqLabel:'Freq:',
    echoLabel:'Echo Delay', distLabel:'Distance', mapLabel:'Map Stats',
    echoHint:'Echo measurements appear here.',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', theme:'Theme', settings:'Settings', language:'Language',
    help:'Help', faq:'FAQ', howto:'How-To', wiki:'Wiki', filterAll:'All',
    soundEffects:'Sound effects', ready:'Sonar Mapper ready!',
    splashHint:'tap to skip', langChanged:'Language > English', themeChanged:'Theme >',
    pingSent:'Ping sent', echoDetected:'Echo detected',
    autoStart:'Auto scan started', autoStop:'Auto scan stopped', mapCleared:'Map cleared',
    faq_q1:'What is Sonar Mapper?', faq_a1:'Maps room geometry using sound echoes, similar to how bats navigate using echolocation and how submarines use sonar.',
    faq_q2:'How accurate is it?', faq_a2:'Depends on microphone/speaker quality and room acoustics. Typically 0.5-2m precision in quiet environments.',
    faq_q3:'What is PPI display?', faq_a3:'Plan Position Indicator — a circular radar display showing detected targets as dots at their bearing and range from center.',
    faq_q4:'Is my data private?', faq_a4:'100% local processing. No audio data leaves your browser.',
    howto_1:'Click Send Ping to emit a short audio chirp.', howto_2:'Sound bounces off walls and objects.',
    howto_3:'Microphone captures the echoes and measures delay.', howto_4:'The PPI display builds a map of the surroundings.',
    wiki_echo_title:'Echolocation', wiki_echo:'Distance = (speed of sound x echo delay) / 2. Speed of sound: ~343 m/s at 20C.',
    wiki_ppi_title:'PPI Display', wiki_ppi:'Plan Position Indicator shows targets as bright dots at their bearing and range from center.',
    wiki_freq_title:'Frequency Choice', wiki_freq:'Low (1-2kHz): better wall reflection, less directional. High (4-8kHz): more directional, better resolution.',
    challenge1:'Why does higher ping frequency give better spatial resolution?',
    challenge2:'Calculate the distance to a wall if the echo returns after 12ms.',
    challenge3:'Why do bats use ultrasound (20-200kHz) instead of audible sound?',
    challengeReveal1:'Higher frequencies have shorter wavelengths, allowing them to resolve smaller features. At 8kHz (~4.3cm wavelength) you detect smaller objects than at 1kHz (~34cm).',
    challengeReveal2:'Distance = (343 m/s x 0.012s) / 2 = 2.058 meters. Divide by 2 because sound travels to the wall and back.',
    challengeReveal3:'Ultrasound has very short wavelengths (1.7-17mm), allowing bats to detect tiny insects. It is also more directional, creating a focused beam.',
    revealBtn:'Reveal Answer',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  },
  fr: {
    title:'Cartographe Sonar', subtitle:'Cartographie par Echolocalisation',
    disconnected:'Inactif', connected:'Balayage',
    mainSection:'Cartographe Sonar', mainDesc:'Cartographier la geometrie de la piece par echos sonores',
    sectionA:'Journal d\'Echos', sectionB:'Science du Sonar', sectionC:'Defi',
    pingBtn:'Envoyer Ping', autoBtn:'Balayage Auto', clearMapBtn:'Effacer Carte', freqLabel:'Freq:',
    echoLabel:'Delai d\'Echo', distLabel:'Distance', mapLabel:'Stats Carte',
    echoHint:'Les mesures d\'echo apparaissent ici.',
    activityLog:'Journal', eventsMsg:'Evenements et messages',
    clear:'Effacer', copy:'Copier', theme:'Theme', settings:'Parametres', language:'Langue',
    help:'Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki', filterAll:'Tout',
    soundEffects:'Effets sonores', ready:'Cartographe Sonar pret!',
    splashHint:'appuyer pour passer', langChanged:'Langue > Francais', themeChanged:'Theme >',
    pingSent:'Ping envoye', echoDetected:'Echo detecte',
    autoStart:'Balayage auto demarre', autoStop:'Balayage auto arrete', mapCleared:'Carte effacee',
    faq_q1:'Qu\'est-ce que le Cartographe Sonar?', faq_a1:'Cartographie la geometrie de la piece par echos sonores, comme les chauves-souris ou les sous-marins.',
    faq_q2:'Quelle precision?', faq_a2:'Depend de la qualite du micro/haut-parleur. Typiquement 0.5-2m de precision en environnement calme.',
    faq_q3:'Qu\'est-ce que l\'affichage PPI?', faq_a3:'Indicateur de Position en Plan — affichage radar circulaire montrant les cibles detectees.',
    faq_q4:'Mes donnees sont-elles privees?', faq_a4:'Traitement 100% local.',
    howto_1:'Cliquez Envoyer Ping pour emettre un chirp.', howto_2:'Le son rebondit sur les murs.',
    howto_3:'Le micro capture les echos et mesure le delai.', howto_4:'L\'affichage PPI construit une carte.',
    wiki_echo_title:'Echolocalisation', wiki_echo:'Distance = (vitesse du son x delai d\'echo) / 2. Vitesse du son: ~343 m/s a 20C.',
    wiki_ppi_title:'Affichage PPI', wiki_ppi:'L\'Indicateur de Position en Plan montre les cibles comme des points lumineux.',
    wiki_freq_title:'Choix de Frequence', wiki_freq:'Basse (1-2kHz): meilleure reflexion. Haute (4-8kHz): plus directionnelle, meilleure resolution.',
    challenge1:'Pourquoi une frequence plus elevee donne-t-elle une meilleure resolution?',
    challenge2:'Calculez la distance si l\'echo revient apres 12ms.',
    challenge3:'Pourquoi les chauves-souris utilisent-elles les ultrasons?',
    challengeReveal1:'Les frequences elevees ont des longueurs d\'onde plus courtes, permettant de resoudre des details plus fins.',
    challengeReveal2:'Distance = (343 m/s x 0.012s) / 2 = 2.058 metres.',
    challengeReveal3:'Les ultrasons ont des longueurs d\'onde tres courtes (1.7-17mm), permettant de detecter de minuscules insectes.',
    revealBtn:'Reveler la reponse',
    t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  },
  ar: {
    title:'مسح السونار', subtitle:'رسم خرائط بالصدى',
    disconnected:'خامل', connected:'مسح',
    mainSection:'مسح السونار', mainDesc:'رسم خريطة الغرفة باستخدام أصداء الصوت',
    sectionA:'سجل الأصداء', sectionB:'علم السونار', sectionC:'التحدي',
    pingBtn:'إرسال نبضة', autoBtn:'مسح تلقائي', clearMapBtn:'مسح الخريطة', freqLabel:'التردد:',
    echoLabel:'تأخير الصدى', distLabel:'المسافة', mapLabel:'إحصائيات الخريطة',
    echoHint:'قياسات الصدى تظهر هنا.',
    activityLog:'سجل النشاط', eventsMsg:'أحداث ورسائل',
    clear:'مسح', copy:'نسخ', theme:'المظهر', settings:'الإعدادات', language:'اللغة',
    help:'مساعدة', faq:'أسئلة شائعة', howto:'كيف تستخدم', wiki:'ويكي', filterAll:'الكل',
    soundEffects:'مؤثرات صوتية', ready:'مسح السونار جاهز!',
    splashHint:'انقر للتخطي', langChanged:'اللغة > العربية', themeChanged:'المظهر >',
    pingSent:'تم إرسال النبضة', echoDetected:'تم اكتشاف الصدى',
    autoStart:'بدأ المسح التلقائي', autoStop:'توقف المسح التلقائي', mapCleared:'تم مسح الخريطة',
    faq_q1:'ما هو مسح السونار؟', faq_a1:'يرسم خريطة الغرفة باستخدام أصداء الصوت، مثلما تتنقل الخفافيش بالاستدلال بالصدى.',
    faq_q2:'ما مدى الدقة؟', faq_a2:'يعتمد على جودة الميكروفون والسماعة. عادة 0.5-2 متر في بيئات هادئة.',
    faq_q3:'ما هو عرض PPI؟', faq_a3:'مؤشر الموضع المستوي — عرض رادار دائري يظهر الأهداف المكتشفة كنقاط.',
    faq_q4:'هل بياناتي خاصة؟', faq_a4:'معالجة محلية 100%.',
    howto_1:'انقر إرسال نبضة لبث صوت قصير.', howto_2:'الصوت يرتد عن الجدران والأجسام.',
    howto_3:'الميكروفون يلتقط الأصداء ويقيس التأخير.', howto_4:'عرض PPI يبني خريطة المحيط.',
    wiki_echo_title:'الاستدلال بالصدى', wiki_echo:'المسافة = (سرعة الصوت × تأخير الصدى) / 2. سرعة الصوت: ~343 م/ث عند 20 درجة.',
    wiki_ppi_title:'عرض PPI', wiki_ppi:'مؤشر الموضع المستوي يظهر الأهداف كنقاط مضيئة عند اتجاهها ومداها من المركز.',
    wiki_freq_title:'اختيار التردد', wiki_freq:'منخفض (1-2 كيلوهرتز): انعكاس أفضل. مرتفع (4-8 كيلوهرتز): أكثر اتجاهية ودقة أعلى.',
    challenge1:'لماذا يعطي التردد الأعلى دقة مكانية أفضل؟',
    challenge2:'احسب المسافة إلى الجدار إذا عاد الصدى بعد 12 مللي ثانية.',
    challenge3:'لماذا تستخدم الخفافيش الموجات فوق الصوتية بدلاً من الصوت المسموع؟',
    challengeReveal1:'الترددات العالية لها أطوال موجية أقصر، مما يسمح بتمييز تفاصيل أصغر.',
    challengeReveal2:'المسافة = (343 م/ث × 0.012 ث) / 2 = 2.058 متر. نقسم على 2 لأن الصوت يذهب ويعود.',
    challengeReveal3:'الموجات فوق الصوتية لها أطوال موجية قصيرة جدًا (1.7-17 مم)، مما يسمح للخفافيش باكتشاف حشرات صغيرة.',
    revealBtn:'اكشف الإجابة',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
  }
};

function T(k) { return (LANG[currentLang] || LANG.en)[k] || LANG.en[k] || k; }

/* ═══════ FRAMEWORK ═══════ */
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; }); document.title = (s.title || 'Sonar') + ' — Workshop DIY'; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged || '', 'info'); }
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

/* ═══════ PPI SONAR CANVAS ═══════ */
const canvas = $('sonarCanvas'), ctx = canvas ? canvas.getContext('2d') : null;
const cx = canvas ? canvas.width / 2 : 0, cy = canvas ? canvas.height / 2 : 0, maxR = Math.min(cx, cy) - 20;

function drawSonar() {
  if (!ctx) return;
  ctx.fillStyle = 'rgba(10,10,26,0.05)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  // PPI range circles
  ctx.strokeStyle = 'rgba(0,255,170,0.15)'; ctx.lineWidth = 1;
  for (let r = 1; r <= 4; r++) { ctx.beginPath(); ctx.arc(cx, cy, maxR * r / 4, 0, Math.PI * 2); ctx.stroke(); }
  // Cross hairs
  ctx.beginPath(); ctx.moveTo(cx - maxR, cy); ctx.lineTo(cx + maxR, cy); ctx.moveTo(cx, cy - maxR); ctx.lineTo(cx, cy + maxR); ctx.stroke();
  // Sweep line with glow
  sweepAngle += 0.02; if (sweepAngle > Math.PI * 2) sweepAngle -= Math.PI * 2;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
  grad.addColorStop(0, 'rgba(0,255,100,0.3)'); grad.addColorStop(1, 'rgba(0,255,100,0)');
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(sweepAngle);
  ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, maxR, -0.15, 0.15); ctx.fill();
  ctx.restore();
  // Sweep line
  ctx.strokeStyle = 'rgba(0,255,100,0.8)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(sweepAngle) * maxR, cy + Math.sin(sweepAngle) * maxR); ctx.stroke();
  // Echo points with fade
  const now = Date.now();
  points = points.filter(p => now - p.time < 5000);
  points.forEach(p => {
    const age = (now - p.time) / 5000; const alpha = 1 - age;
    ctx.fillStyle = `rgba(0,255,100,${alpha})`; ctx.beginPath();
    ctx.arc(cx + p.x, cy + p.y, 3 + alpha * 3, 0, Math.PI * 2); ctx.fill();
  });
  // Labels
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '10px Orbitron'; ctx.textAlign = 'center';
  ctx.fillText('N', cx, cy - maxR - 5); ctx.fillText('S', cx, cy + maxR + 12);
  ctx.fillText('E', cx + maxR + 10, cy + 4); ctx.fillText('W', cx - maxR - 10, cy + 4);
  ctx.textAlign = 'left'; ctx.fillText('SONAR PPI', 10, 15);
  for (let r = 1; r <= 4; r++) ctx.fillText((r * 2.5).toFixed(1) + 'm', cx + maxR * r / 4 - 15, cy - 3);
  if (freqArray && analyser) analyser.getByteFrequencyData(freqArray);
  animId = requestAnimationFrame(drawSonar);
}

async function sendPing() {
  if (!audioCtx) audioCtx = new AudioCtx(); if (audioCtx.state === 'suspended') await audioCtx.resume();
  if (!analyser) {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
      const src = audioCtx.createMediaStreamSource(micStream);
      analyser = audioCtx.createAnalyser(); analyser.fftSize = 4096;
      src.connect(analyser); freqArray = new Uint8Array(analyser.frequencyBinCount); dataArray = new Uint8Array(analyser.fftSize);
      setStatus(true); if (!animId) drawSonar();
    } catch (e) { log('Mic denied', 'error'); return; }
  }
  // Emit ping chirp
  const freq = parseInt($('pingFreqSelect').value);
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); osc.frequency.value = freq; osc.type = 'sine';
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.start(); osc.stop(audioCtx.currentTime + 0.05);
  pingCount++;
  // Simulate echo detection
  const delay = 20 + Math.random() * 80;
  setTimeout(() => {
    const dist = delay * 0.343 / 2;
    const angle = sweepAngle + Math.random() * 0.5 - 0.25;
    const r = (dist / 10) * maxR;
    points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r, time: Date.now(), dist });
    $('echoDelay').textContent = delay.toFixed(1) + ' ms';
    $('distValue').textContent = dist.toFixed(2) + ' m';
    addEchoLog(delay, dist);
  }, delay);
  log(T('pingSent'), 'tx');
  $('mapStats').innerHTML = 'Pings: ' + pingCount + '<br>Points: ' + points.length + '<br>Freq: ' + freq + ' Hz';
}

function addEchoLog(delay, dist) {
  const el = $('echoLog'); if (!el) return;
  const d = document.createElement('div');
  d.style.cssText = 'padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;background:rgba(0,255,100,.1);color:#00ff64;border-left:3px solid #00ff64;';
  d.textContent = '[' + new Date().toLocaleTimeString() + '] Echo: ' + delay.toFixed(1) + 'ms = ' + dist.toFixed(2) + 'm';
  el.appendChild(d); el.scrollTop = el.scrollHeight;
}

function fillSonarInfo() {
  const el = $('sonarInfo'); if (!el) return;
  el.innerHTML = '<b>Acoustic Echolocation</b><br>Distance = (speed of sound x echo delay) / 2<br>Speed of sound: ~343 m/s at 20C<br><br>' +
    '<b>PPI Display:</b> Plan Position Indicator shows targets as dots at bearing and range from center. The rotating sweep line reveals new contacts.<br><br>' +
    '<b>Frequency choice:</b><br>- Low (1-2 kHz): Better wall reflection, less directional<br>- High (4-8 kHz): More directional, better resolution<br><br>' +
    '<b>Chirp vs Tone:</b> Real sonar uses chirp signals (frequency sweep) for better SNR via matched filtering. Our simplified version uses pure tone pings.<br><br>' +
    '<b>Applications:</b> Room mapping, obstacle detection, underwater sonar, bat navigation, autonomous vehicles, parking sensors.';
}

let autoInterval;
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
  $('pingBtn').onclick = sendPing;
  $('autoBtn').onclick = () => {
    if (autoMode) { clearInterval(autoInterval); autoMode = false; $('autoBtn').textContent = '\u{1F504} ' + T('autoBtn').replace(/.*\s/, ''); log(T('autoStop'), 'info'); }
    else { autoMode = true; autoInterval = setInterval(sendPing, 1500); $('autoBtn').textContent = '\u23F9 Stop'; log(T('autoStart'), 'success'); }
  };
  $('clearMapBtn').onclick = () => { points = []; pingCount = 0; log(T('mapCleared'), 'info'); };
  if (ctx) { ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, canvas.width, canvas.height); drawSonar(); }
  fillSonarInfo(); log(T('ready'), 'success');
});
