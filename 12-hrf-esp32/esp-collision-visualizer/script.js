/**
 * Collision Visualizer — Workshop DIY v1.2
 * 2.4GHz signal collision and BER simulator
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let soundEnabled = false, currentLang = 'en';
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.06;const n=audioCtx.currentTime;o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.1)}

const LANG = {
  en:{title:'💥 Collision Visualizer',subtitle:'2.4GHz Signal Collision',disconnected:'Idle',connected:'Simulating',mainSection:'Dual TX Collision Zone',mainDesc:'Two transmitters, one frequency — watch bits collide',sectionA:'BER Over Time',sectionB:'Collision Analysis',sectionC:'Collision Theory',startSim:'Start Simulation',stop:'Stop',theory1:'When two transmitters broadcast on the same frequency simultaneously, their signals overlap and interfere, causing bit errors.',theory2:'The Bit Error Rate (BER) depends on relative power. Equal power causes maximum interference.',theory3:'CSMA/CA (WiFi) and frequency hopping (BLE) minimize collisions but cannot eliminate them in the 2.4 GHz band.',theory4:'The simulation shows how power difference between TX1 and TX2 affects BER — stronger signals dominate (capture effect).',splashHint:'tap to skip',ready:'💥 Collision Visualizer ready!',langChanged:'Language → English',simStarted:'Collision simulation started',simStopped:'Simulation stopped',step1Title:'Configure RF',step1Desc:'Set the frequency band, modulation type, and signal parameters.',step2Title:'Capture Spectrum',step2Desc:'Scan the radio spectrum to detect and capture signals of interest.',step3Title:'Analyze Signal',step3Desc:'Apply signal processing to identify modulation, encoding, and source.',step4Title:'Classify & Report',step4Desc:'Categorize the signal type and log detailed analysis results.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF signals! 🔬 You get to experiment with radio frequency patterns in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real radio frequency patterns so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real signal intelligence! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need ESP32. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Esp Rf Bridge and Esp Wifi Dissector! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',learnAge:'Ages:'},
  fr:{title:'💥 Visualiseur de Collision',subtitle:'Collision de signaux 2.4GHz',disconnected:'Inactif',connected:'Simulation',mainSection:'Zone de collision double TX',mainDesc:'Deux emetteurs, une frequence — observez les collisions',sectionA:'BER au fil du temps',sectionB:'Analyse des collisions',sectionC:'Theorie des collisions',startSim:'Demarrer simulation',stop:'Arreter',theory1:'Quand deux emetteurs transmettent sur la meme frequence, leurs signaux interferent, causant des erreurs de bits.',theory2:'Le taux d\'erreur binaire depend de la puissance relative. Puissance egale = interference maximale.',theory3:'CSMA/CA et le saut de frequence minimisent les collisions mais ne les eliminent pas.',theory4:'La simulation montre comment la difference de puissance affecte le BER — effet de capture.',splashHint:'appuyer pour passer',ready:'💥 Visualiseur pret!',langChanged:'Langue → Francais',simStarted:'Simulation demarree',simStopped:'Simulation arretee',step1Title:'Configurer RF',step1Desc:'Règle la bande de fréquence, le type de modulation et les paramètres.',step2Title:'Capturer le spectre',step2Desc:'Scanne le spectre radio pour détecter et capturer les signaux.',step3Title:'Analyser le signal',step3Desc:'Applique le traitement du signal pour identifier la modulation et la source.',step4Title:'Classifier et rapporter',step4Desc:'Catégorise le type de signal et enregistre les résultats.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF signals ! 🔬 Tu peux expérimenter avec radio frequency patterns en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio frequency patterns.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai signal intelligence ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut ESP32. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Esp Rf Bridge and Esp Wifi Dissector ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',learnAge:'Âge :'},
  ar:{title:'💥 عارض التصادم',subtitle:'تصادم إشارات 2.4GHz',disconnected:'خامل',connected:'محاكاة',mainSection:'منطقة تصادم TX مزدوج',mainDesc:'مرسلان، تردد واحد — شاهد تصادم البتات',sectionA:'BER عبر الزمن',sectionB:'تحليل التصادم',sectionC:'نظرية التصادم',startSim:'بدء المحاكاة',stop:'إيقاف',theory1:'عندما يبث مرسلان على نفس التردد، تتداخل إشاراتهما مسببة أخطاء في البتات.',theory2:'يعتمد معدل خطأ البت على القوة النسبية. القوة المتساوية تسبب أقصى تداخل.',theory3:'CSMA/CA وقفز التردد يقللان التصادمات لكن لا يمنعانها.',theory4:'تُظهر المحاكاة كيف يؤثر فرق القوة بين TX1 وTX2 على BER.',splashHint:'انقر للتخطي',ready:'💥 عارض التصادم جاهز!',langChanged:'اللغة ← العربية',simStarted:'بدأت المحاكاة',simStopped:'توقفت المحاكاة',step1Title:'تكوين RF',step1Desc:'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.',step2Title:'التقاط الطيف',step2Desc:'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.',step3Title:'تحليل الإشارة',step3Desc:'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.',step4Title:'تصنيف والتقرير',step4Desc:'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF signals! 🔬 يمكنك التجربة مع radio frequency patterns في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio frequency patterns حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا signal intelligence حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج ESP32. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Esp Rf Bridge and Esp Wifi Dissector! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',learnAge:'العمر:'}
};

function dismissSplash(){const s=$('splash');if(s){s.style.opacity='0';setTimeout(()=>s.style.display='none',500)}}
setTimeout(dismissSplash,3000);
function setLanguage(lang){currentLang=lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(LANG[lang]?.[k])el.textContent=LANG[lang][k]});localStorage.setItem('collision-lang',lang);log(LANG[lang]?.langChanged||'Lang','info')}
function setTheme(name){document.documentElement.setAttribute('data-theme',name);if(LIGHT_THEMES.includes(name))document.documentElement.classList.add('light-theme');else document.documentElement.classList.remove('light-theme');localStorage.setItem('collision-theme',name)}
function log(msg,type='info'){const c=$('logContainer');if(!c)return;const line=document.createElement('div');line.className='log-line log-'+type;line.innerHTML=`<span class="log-ts">${new Date().toLocaleTimeString()}</span><span class="log-badge">${type.toUpperCase()}</span> ${msg}`;c.appendChild(line);c.scrollTop=c.scrollHeight}
function showToast(msg,ms){const t=$('toastIndicator'),m=$('toastMessage');if(m)m.textContent=msg;if(t)t.classList.add('show');if(ms)setTimeout(()=>t?.classList.remove('show'),ms)}
function setStatus(on){const d=$('statusDot'),t=$('statusText');if(d)d.style.background=on?'#0f0':'#f44';if(t)t.textContent=LANG[currentLang]?.[on?'connected':'disconnected']||''}
function openPanel(id,oid){$(id)?.classList.add('open');if(oid)$(oid)?.classList.add('show')}
function closePanel(id,oid){$(id)?.classList.remove('open');if(oid)$(oid)?.classList.remove('show')}

/* ═══════ COLLISION SIMULATION ═══════ */
let simulating = false, animFrame = null;
let totalBits = 0, errorBits = 0, collisionCount = 0;
let berHistory = [];
let bitBuffer = [];
const canvas = $('collisionCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;

function calcBER(p1, p2){
  // BER based on SIR (signal to interference ratio)
  const sir = Math.abs(p1 - p2); // dB difference
  if(sir > 10) return 0.001; // capture effect — almost no errors
  if(sir > 6) return 0.01;
  if(sir > 3) return 0.05;
  return 0.15 + (1 - sir/3) * 0.2; // equal power = ~35% BER max
}

function generateBits(count, ber){
  const bits = [];
  for(let i = 0; i < count; i++){
    const sent = Math.random() < 0.5 ? 1 : 0;
    const error = Math.random() < ber;
    bits.push({sent, received: error ? (1 - sent) : sent, error});
    totalBits++;
    if(error){errorBits++;collisionCount++}
  }
  return bits;
}

function drawCollision(){
  if(!ctx) return;
  const W = canvas.width, H = canvas.height;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);

  const p1 = parseInt($('tx1Power')?.value || 10);
  const p2 = parseInt($('tx2Power')?.value || 10);
  const t = Date.now() / 1000;

  // Draw TX1 signal (blue, from left)
  ctx.strokeStyle = '#3ba5f7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for(let x = 0; x < W; x++){
    const amp = (p1 / 20) * (H / 4);
    const decay = Math.max(0, 1 - x / (W * 0.7));
    const y = H / 2 + Math.sin(x * 0.05 + t * 3) * amp * decay;
    if(x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Draw TX2 signal (orange, from right)
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for(let x = 0; x < W; x++){
    const amp = (p2 / 20) * (H / 4);
    const decay = Math.max(0, 1 - (W - x) / (W * 0.7));
    const y = H / 2 + Math.sin(x * 0.06 + t * 2.5 + 1.5) * amp * decay;
    if(x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Collision zone (red overlay in the middle)
  const overlapStart = W * 0.25, overlapEnd = W * 0.75;
  const ber = calcBER(p1, p2);
  const alpha = Math.min(0.4, ber * 1.5);
  ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
  ctx.fillRect(overlapStart, 0, overlapEnd - overlapStart, H);

  // Labels
  ctx.fillStyle = '#3ba5f7';
  ctx.font = '12px Orbitron,monospace';
  ctx.fillText(`TX1: ${p1}dBm`, 10, 18);
  ctx.fillStyle = '#f97316';
  ctx.fillText(`TX2: ${p2}dBm`, W - 100, 18);
  ctx.fillStyle = '#f44';
  ctx.fillText('COLLISION ZONE', W / 2 - 60, 18);
}

function updateBitStream(){
  const p1 = parseInt($('tx1Power')?.value || 10);
  const p2 = parseInt($('tx2Power')?.value || 10);
  const ber = calcBER(p1, p2);
  const newBits = generateBits(16, ber);
  bitBuffer.push(...newBits);
  if(bitBuffer.length > 512) bitBuffer = bitBuffer.slice(-512);

  // Render bit stream
  const el = $('bitStream');
  if(el){
    el.innerHTML = bitBuffer.map(b =>
      `<span class="${b.error ? 'bit-err' : 'bit-ok'}">${b.received}</span>`
    ).join('');
    el.scrollTop = el.scrollHeight;
  }

  // Update stats
  const currentBER = totalBits > 0 ? (errorBits / totalBits * 100) : 0;
  $('berVal').textContent = currentBER.toFixed(2) + '%';
  $('collisions').textContent = collisionCount;
  $('goodBits').textContent = totalBits - errorBits;
  $('totalBits').textContent = totalBits;

  berHistory.push(currentBER);
  if(berHistory.length > 200) berHistory.shift();
}

function drawBERChart(){
  const c = $('berCanvas');
  if(!c) return;
  const cx = c.getContext('2d'), W = c.width, H = c.height;
  cx.fillStyle = '#000';
  cx.fillRect(0, 0, W, H);
  if(berHistory.length < 2) return;
  const max = Math.max(1, ...berHistory);
  cx.strokeStyle = '#f44';
  cx.lineWidth = 2;
  cx.beginPath();
  berHistory.forEach((v, i) => {
    const x = i / (berHistory.length - 1) * W;
    const y = H - 10 - (v / max) * (H - 20);
    if(i === 0) cx.moveTo(x, y); else cx.lineTo(x, y);
  });
  cx.stroke();
  cx.fillStyle = 'rgba(255,255,255,.4)';
  cx.font = '10px monospace';
  cx.fillText('BER %', 4, 14);
  cx.fillText(max.toFixed(1) + '%', 4, 28);
}

function updateAnalysis(){
  const el = $('analysisPanel');
  if(!el) return;
  const p1 = parseInt($('tx1Power')?.value || 10);
  const p2 = parseInt($('tx2Power')?.value || 10);
  const sir = Math.abs(p1 - p2);
  const ber = calcBER(p1, p2);
  const capture = sir > 6;
  el.innerHTML = `<div>TX1 Power: <strong>${p1} dBm</strong></div><div>TX2 Power: <strong>${p2} dBm</strong></div><div>Power Difference (SIR): <strong>${sir} dB</strong></div><div>Instantaneous BER: <strong style="color:${ber>.1?'#f44':ber>.01?'#f90':'#0f0'}">${(ber*100).toFixed(2)}%</strong></div><div>Capture Effect: <strong style="color:${capture?'#0f0':'#f44'}">${capture?'YES — stronger signal dominates':'NO — heavy interference'}</strong></div><hr style="border-color:rgba(255,255,255,.1);margin:8px 0"><div>Total bits: ${totalBits} | Errors: ${errorBits} | Good: ${totalBits-errorBits}</div><div>${sir < 3 ? 'Both signals at similar power — maximum collision damage!' : sir < 6 ? 'Partial capture — significant errors remain' : 'Strong capture effect — weaker signal suppressed'}</div>`;
}

function animate(){
  if(!simulating) return;
  drawCollision();
  updateBitStream();
  if(totalBits % 100 < 20) drawBERChart();
  if(totalBits % 50 < 20) updateAnalysis();
  animFrame = requestAnimationFrame(animate);
}

function startSim(){
  if(simulating) return;
  simulating = true;
  totalBits = 0; errorBits = 0; collisionCount = 0;
  berHistory = []; bitBuffer = [];
  setStatus(true); playSound('click');
  log(LANG[currentLang]?.simStarted || 'Simulation started', 'success');
  animate();
}
function stopSim(){
  simulating = false;
  if(animFrame) cancelAnimationFrame(animFrame);
  setStatus(false);
  log(LANG[currentLang]?.simStopped || 'Simulation stopped', 'info');
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('collision-lang') || 'en';
  const savedTheme = localStorage.getItem('collision-theme') || 'mosque-gold';
  if($('langSelect')) $('langSelect').value = savedLang;
  if($('themeSelect')) $('themeSelect').value = savedTheme;
  setLanguage(savedLang); setTheme(savedTheme);

  $('helpBtn')?.addEventListener('click', () => openPanel('helpPanel', 'helpOverlay'));
  $('helpCloseBtn')?.addEventListener('click', () => closePanel('helpPanel', 'helpOverlay'));
  $('helpOverlay')?.addEventListener('click', () => closePanel('helpPanel', 'helpOverlay'));
  $('settingsBtn')?.addEventListener('click', () => openPanel('settingsPanel', 'settingsOverlay'));
  $('settingsCloseBtn')?.addEventListener('click', () => closePanel('settingsPanel', 'settingsOverlay'));
  $('settingsOverlay')?.addEventListener('click', () => closePanel('settingsPanel', 'settingsOverlay'));
  $('logBtn')?.addEventListener('click', () => $('logPanel')?.classList.toggle('open'));
  $('logCloseBtn')?.addEventListener('click', () => $('logPanel')?.classList.remove('open'));
  $('langSelect')?.addEventListener('change', e => setLanguage(e.target.value));
  $('themeSelect')?.addEventListener('change', e => setTheme(e.target.value));
  $('soundToggle')?.addEventListener('change', e => { soundEnabled = e.target.checked });
  $('clearLogBtn')?.addEventListener('click', () => { $('logContainer').innerHTML = ''; log('Log cleared', 'info') });
  $('copyLogBtn')?.addEventListener('click', () => { navigator.clipboard.writeText($('logContainer')?.innerText || '').then(() => showToast('Copied!', 1500)) });

  $('tx1Power')?.addEventListener('input', e => { $('tx1Val').textContent = e.target.value });
  $('tx2Power')?.addEventListener('input', e => { $('tx2Val').textContent = e.target.value });

  document.querySelectorAll('.help-tab').forEach(tab => { tab.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); $({faq:'helpFaq',howto:'helpHowto',wiki:'helpWiki'}[tab.dataset.tab])?.classList.add('active') }) });
  document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); const f = btn.dataset.filter; document.querySelectorAll('.log-line').forEach(l => { l.style.display = (f === 'all' || l.classList.contains('log-' + f)) ? '' : 'none' }) }) });

  $('simBtn')?.addEventListener('click', startSim);
  $('stopBtn')?.addEventListener('click', stopSim);

  setStatus(false);
  log(LANG[currentLang]?.ready || 'Ready', 'success');
});

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — Collision Visualizer: Dual transmitter
   signal collision zone with BER visualization and capture effect
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simCollCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const waves1=[],waves2=[],sparks=[];
  let ber=0,totalBitsVis=0,errorBitsVis=0;
  const tx1={x:0,y:0,power:0.7,freq:2.44};
  const tx2={x:0,y:0,power:0.5,freq:2.44};

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:300px;border-radius:12px;margin:1.2rem 0;display:block;background:#0a0810;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
    tx1.x=W*0.2;tx1.y=H/2;tx2.x=W*0.8;tx2.y=H/2;
  }

  class Wave{
    constructor(x,y,color){this.x=x;this.y=y;this.r=0;this.maxR=Math.min(W,H)*0.6;this.alpha=0.5;this.color=color;}
    update(){this.r+=2;this.alpha=0.5*(1-this.r/this.maxR);return this.r<this.maxR;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,Math.PI*2);ctx.strokeStyle=this.color.replace('1)',this.alpha+')');ctx.lineWidth=2;ctx.stroke();}
  }

  class Spark{
    constructor(x,y){this.x=x;this.y=y;this.vx=(Math.random()-0.5)*5;this.vy=(Math.random()-0.5)*5;this.life=1;this.size=2+Math.random()*2;}
    update(){this.x+=this.vx;this.y+=this.vy;this.vx*=0.95;this.vy*=0.95;this.life-=0.03;return this.life>0;}
    draw(){ctx.beginPath();ctx.arc(this.x,this.y,this.size*this.life,0,Math.PI*2);ctx.fillStyle='rgba(255,200,50,'+this.life+')';ctx.fill();}
  }

  function drawTX(tx,label,color){
    ctx.save();ctx.shadowColor=color;ctx.shadowBlur=8;
    ctx.beginPath();ctx.arc(tx.x,tx.y,18,0,Math.PI*2);ctx.fillStyle=color.replace('1)','0.2)');ctx.fill();
    ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='12px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u{1F4E1}',tx.x,tx.y);
    ctx.font='8px monospace';ctx.fillStyle=color;ctx.fillText(label,tx.x,tx.y+26);
    // Power bar
    ctx.fillStyle='#222';ctx.fillRect(tx.x-20,tx.y+32,40,5);
    ctx.fillStyle=color;ctx.fillRect(tx.x-20,tx.y+32,40*tx.power,5);
    ctx.font='7px monospace';ctx.fillStyle='#888';ctx.fillText(Math.floor(tx.power*100)+'%',tx.x,tx.y+46);
    ctx.restore();
  }

  function drawCollisionZone(){
    const cx=W/2,cy=H/2;
    // Interference pattern
    const berLevel=Math.min(1,ber);
    ctx.save();ctx.globalAlpha=0.2+berLevel*0.3;
    const grad=ctx.createRadialGradient(cx,cy,10,cx,cy,80);
    grad.addColorStop(0,'rgba(255,100,50,'+(berLevel*0.5)+')');
    grad.addColorStop(1,'rgba(255,100,50,0)');
    ctx.fillStyle=grad;ctx.fillRect(cx-80,cy-80,160,160);ctx.restore();
    // Collision label
    if(berLevel>0.1){
      ctx.font='bold 10px monospace';ctx.fillStyle='rgba(255,200,50,'+(0.5+Math.sin(frameCount*0.1)*0.3)+')';
      ctx.textAlign='center';ctx.fillText('\u{1F4A5} COLLISION ZONE',cx,cy-40);
    }
  }

  function drawSignalWaveform(){
    const y1=H*0.15,y2=H*0.85,ww=W*0.6,sx=(W-ww)/2;
    // TX1 waveform
    ctx.beginPath();ctx.moveTo(sx,y1);
    for(let x=0;x<ww;x++){const v=Math.sin((x+frameCount*3)*0.05)*tx1.power*20;ctx.lineTo(sx+x,y1+v);}
    ctx.strokeStyle='rgba(255,100,100,0.4)';ctx.lineWidth=1;ctx.stroke();
    // TX2 waveform
    ctx.beginPath();ctx.moveTo(sx,y2);
    for(let x=0;x<ww;x++){const v=Math.sin((x+frameCount*3)*0.05+1)*tx2.power*20;ctx.lineTo(sx+x,y2+v);}
    ctx.strokeStyle='rgba(100,100,255,0.4)';ctx.lineWidth=1;ctx.stroke();
    // Combined (center)
    ctx.beginPath();ctx.moveTo(sx,H/2);
    for(let x=0;x<ww;x++){const v1=Math.sin((x+frameCount*3)*0.05)*tx1.power*15;const v2=Math.sin((x+frameCount*3)*0.05+1)*tx2.power*15;ctx.lineTo(sx+x,H/2+v1+v2);}
    ctx.strokeStyle='rgba(255,200,100,0.3)';ctx.lineWidth=1;ctx.stroke();
  }

  function drawBERMeter(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(W/2-80,H-30,160,22);
    ctx.strokeStyle='#fff2';ctx.strokeRect(W/2-80,H-30,160,22);
    const g=ctx.createLinearGradient(W/2-80,0,W/2+80,0);g.addColorStop(0,'#6bcb77');g.addColorStop(0.5,'#ffd93d');g.addColorStop(1,'#ff4444');
    ctx.fillStyle='#222';ctx.fillRect(W/2-75,H-26,150,14);ctx.fillStyle=g;ctx.fillRect(W/2-75,H-26,150*Math.min(1,ber),14);
    ctx.font='8px monospace';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('BER: '+(ber*100).toFixed(1)+'%',W/2,H-16);ctx.restore();
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,185,56);ctx.strokeStyle='#f903';ctx.strokeRect(8,8,185,56);
    ctx.font='10px monospace';ctx.fillStyle='#ff9944';ctx.textAlign='left';ctx.fillText('\u{1F4A5} COLLISION VISUALIZER',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Bits: '+totalBitsVis+'  Errors: '+errorBitsVis,16,40);
    ctx.fillText('BER: '+(ber*100).toFixed(2)+'%',16,54);ctx.restore();
  }

  function init(){ensureCanvas();animate();}
  function animate(){
    frameCount++;ctx.fillStyle='rgba(10,8,16,0.14)';ctx.fillRect(0,0,W,H);
    // Slowly vary power
    tx1.power=0.5+Math.sin(frameCount*0.005)*0.3;tx2.power=0.5+Math.cos(frameCount*0.007)*0.3;
    // BER calculation based on power difference
    const diff=Math.abs(tx1.power-tx2.power);ber=Math.max(0.01,0.5-diff*1.5);
    totalBitsVis+=10;errorBitsVis+=Math.round(ber*10);
    // Waves
    if(frameCount%12===0){waves1.push(new Wave(tx1.x,tx1.y,'rgba(255,100,100,1)'));waves2.push(new Wave(tx2.x,tx2.y,'rgba(100,100,255,1)'));}
    for(let i=waves1.length-1;i>=0;i--){if(!waves1[i].update())waves1.splice(i,1);else waves1[i].draw();}
    for(let i=waves2.length-1;i>=0;i--){if(!waves2[i].update())waves2.splice(i,1);else waves2[i].draw();}
    drawCollisionZone();drawSignalWaveform();
    // Collision sparks
    if(ber>0.2&&frameCount%4===0){for(let i=0;i<2;i++)sparks.push(new Spark(W/2+(Math.random()-0.5)*40,H/2+(Math.random()-0.5)*40));}
    for(let i=sparks.length-1;i>=0;i--){if(!sparks[i].update())sparks.splice(i,1);else sparks[i].draw();}
    drawTX(tx1,'TX1','rgba(255,100,100,1)');drawTX(tx2,'TX2','rgba(100,100,255,1)');
    drawBERMeter();drawHUD();animId=requestAnimationFrame(animate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else setTimeout(init,300);
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

// Service Worker Registration (skip on file://)
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(function(){});
}
