/**
 * RF Bridge — Workshop DIY v1.2
 * Wireless SDR over WiFi bridge simulator
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
let soundEnabled = false, currentLang = 'en';
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.06;const n=audioCtx.currentTime;o.frequency.value=t==='click'?800:523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,n+.1);o.start(n);o.stop(n+.1)}

// ── Shared i18n keys (template) ──
const LANG_BASE = {
  en: {
    copied:'Copied!',
    demoNext:'Next',
    demoPause:'Pause',
    demoPlay:'Play',
    demoPrev:'Prev',
    learnAge:'Ages:',
    learnLevel:'Level:',
    learnTime:'Time:',
    logCleared:'Log cleared',
    sectionCode:'Device Code',
    sectionDemo:'Watch Demo',
    sectionLearn:'What You Shall Learn',
    splashHint:'tap to skip'
  },
  fr: {
    copied:'Copié !',
    demoNext:'Suiv',
    demoPause:'Pause',
    demoPlay:'Jouer',
    demoPrev:'Préc',
    learnAge:'Âge :',
    learnLevel:'Niveau :',
    learnTime:'Durée :',
    logCleared:'Journal effacé',
    sectionCode:'Code Appareil',
    sectionDemo:'Voir la Démo',
    sectionLearn:'Ce que tu vas apprendre',
    splashHint:'appuyer pour passer'
  },
  ar: {
    copied:'تم النسخ!',
    demoNext:'التالي',
    demoPause:'إيقاف',
    demoPlay:'تشغيل',
    demoPrev:'السابق',
    learnAge:'العمر:',
    learnLevel:'المستوى:',
    learnTime:'المدة:',
    logCleared:'تم مسح السجل',
    sectionCode:'كود الجهاز',
    sectionDemo:'شاهد العرض',
    sectionLearn:'ماذا ستتعلم',
    splashHint:'انقر للتخطي'
  }
};

const LANG = {
  en:{
    ...LANG_BASE.en,title:'🌉 RF Bridge',subtitle:'Wireless SDR over WiFi',disconnected:'Disconnected',connected:'Streaming',mainSection:'SDR Stream Status',mainDesc:'ESP32 bridges HackRF data over WiFi',sectionA:'Bandwidth Usage Over Time',sectionB:'Stream Configuration',sectionC:'RF Bridge Theory',connect:'Connect Bridge',disconnect:'Disconnect',theory1:'An RF Bridge connects a HackRF SDR to remote clients over WiFi using an ESP32 as the bridge controller.',theory2:'IQ samples from HackRF are packetized and streamed over UDP/TCP to WiFi clients, enabling wireless SDR access.',theory3:'Key challenges include bandwidth (2 MHz IQ = 8 Mbps raw), latency management, and buffer underrun prevention.',theory4:'The ESP32 handles sample rate conversion, buffering, and WiFi packet management to maintain a stable stream.',splashHint:'tap to skip',ready:'🌉 RF Bridge ready!',langChanged:'Language → English',bridgeConnected:'Bridge connected — streaming IQ data',bridgeDisconnected:'Bridge disconnected',step1Title:'Configure RF',step1Desc:'Set the frequency band, modulation type, and signal parameters.',step2Title:'Capture Spectrum',step2Desc:'Scan the radio spectrum to detect and capture signals of interest.',step3Title:'Analyze Signal',step3Desc:'Apply signal processing to identify modulation, encoding, and source.',step4Title:'Classify & Report',step4Desc:'Categorize the signal type and log detailed analysis results.',sectionCode:'Device Code',faq_q1:'What is 🌉 RF Bridge?',faq_a1:'🌉 RF Bridge lets you esp32 bridges hackrf data over wifi. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you set the frequency band, modulation type, and signal parameters. Then you scan the radio spectrum to detect and capture signals of interest.',faq_q3:'What do the controls do?',faq_a3:'Click Start to begin the simulation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real RF engineering principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF + ESP32. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Esp Ble Xray and Esp Collision Visualizer. Each app in this category teaches a different aspect of RF engineering.',demo_s1:'Welcome to 🌉 RF Bridge! Look at the main display — this is where the RF engineering simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "Bandwidth Usage Over Time" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of RF engineering.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how RF engineering works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches RF engineering concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Bandwidth Usage Over Time" and "Stream Configuration" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{
    ...LANG_BASE.fr,title:'🌉 Pont RF',subtitle:'SDR sans fil via WiFi',disconnected:'Deconnecte',connected:'En streaming',mainSection:'Statut du flux SDR',mainDesc:'ESP32 relie les donnees HackRF via WiFi',sectionA:'Utilisation bande passante',sectionB:'Configuration du flux',sectionC:'Theorie du pont RF',connect:'Connecter pont',disconnect:'Deconnecter',theory1:'Un pont RF connecte un SDR HackRF a des clients distants via WiFi avec un ESP32.',theory2:'Les echantillons IQ sont empaquetes et transmis via UDP/TCP aux clients WiFi.',theory3:'Les defis principaux incluent la bande passante, la latence et la prevention des sous-depassements.',theory4:'L\'ESP32 gere la conversion de debit, le tampon et la gestion des paquets WiFi.',splashHint:'appuyer pour passer',ready:'🌉 Pont RF pret!',langChanged:'Langue → Francais',bridgeConnected:'Pont connecte — streaming IQ',bridgeDisconnected:'Pont deconnecte',step1Title:'Configurer RF',step1Desc:'Règle la bande de fréquence, le type de modulation et les paramètres.',step2Title:'Capturer le spectre',step2Desc:'Scanne le spectre radio pour détecter et capturer les signaux.',step3Title:'Analyser le signal',step3Desc:'Applique le traitement du signal pour identifier la modulation et la source.',step4Title:'Classifier et rapporter',step4Desc:'Catégorise le type de signal et enregistre les résultats.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que 🌉 RF Bridge ?',faq_a1:'🌉 RF Bridge te permet de simuler ingénierie RF. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de ingénierie RF. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de ingénierie RF. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF + ESP32. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de ingénierie RF.',demo_s1:'Bienvenue dans 🌉 RF Bridge ! Regarde l\'écran principal — c\'est ici que la simulation de ingénierie RF fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de ingénierie RF.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Cette appli te montre comment fonctionne ingénierie RF en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de ingénierie RF par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :'},
  ar:{
    ...LANG_BASE.ar,title:'🌉 جسر RF',subtitle:'SDR لاسلكي عبر WiFi',disconnected:'غير متصل',connected:'بث جارٍ',mainSection:'حالة بث SDR',mainDesc:'ESP32 يربط بيانات HackRF عبر WiFi',sectionA:'استخدام النطاق الترددي',sectionB:'تكوين البث',sectionC:'نظرية جسر RF',connect:'توصيل الجسر',disconnect:'قطع الاتصال',theory1:'يربط جسر RF جهاز HackRF SDR بالعملاء البعيدين عبر WiFi باستخدام ESP32.',theory2:'يتم تجميع عينات IQ وبثها عبر UDP/TCP إلى عملاء WiFi.',theory3:'تشمل التحديات الرئيسية عرض النطاق والتأخير ومنع نفاد المخزن المؤقت.',theory4:'يتعامل ESP32 مع تحويل معدل العينات والتخزين المؤقت وإدارة حزم WiFi.',splashHint:'انقر للتخطي',ready:'🌉 جسر RF جاهز!',langChanged:'اللغة ← العربية',bridgeConnected:'تم توصيل الجسر — بث IQ',bridgeDisconnected:'تم قطع الجسر',step1Title:'تكوين RF',step1Desc:'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.',step2Title:'التقاط الطيف',step2Desc:'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.',step3Title:'تحليل الإشارة',step3Desc:'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.',step4Title:'تصنيف والتقرير',step4Desc:'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.',sectionCode:'كود الجهاز',faq_q1:'ما هو 🌉 RF Bridge؟',faq_a1:'🌉 RF Bridge يتيح لك محاكاة هندسة الترددات. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في هندسة الترددات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من هندسة الترددات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF + ESP32. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من هندسة الترددات.',demo_s1:'مرحباً في 🌉 RF Bridge! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة هندسة الترددات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـهندسة الترددات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'هذا التطبيق يريك كيف تعمل هندسة الترددات من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم هندسة الترددات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',learnAge:'العمر:'}
};

function dismissSplash(){const s=$('splash');if(s){s.style.opacity='0';setTimeout(()=>s.style.display='none',500)}}
setTimeout(dismissSplash,3000);
function setLanguage(lang){currentLang=lang;document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.getAttribute('data-i18n');if(LANG[lang]?.[k])el.textContent=LANG[lang][k]});localStorage.setItem('rfbridge-lang',lang);log(LANG[lang]?.langChanged||'Lang','info')}
function setTheme(name){document.documentElement.setAttribute('data-theme',name);if(LIGHT_THEMES.includes(name))document.documentElement.classList.add('light-theme');else document.documentElement.classList.remove('light-theme');localStorage.setItem('rfbridge-theme',name)}
function log(msg,type='info'){const c=$('logContainer');if(!c)return;const line=document.createElement('div');line.className='log-line log-'+type;line.innerHTML=`<span class="log-ts">${new Date().toLocaleTimeString()}</span><span class="log-badge">${type.toUpperCase()}</span> ${msg}`;c.appendChild(line);c.scrollTop=c.scrollHeight}
function showToast(msg,ms){const t=$('toastIndicator'),m=$('toastMessage');if(m)m.textContent=msg;if(t)t.classList.add('show');if(ms)setTimeout(()=>t?.classList.remove('show'),ms)}
function setStatus(on){const d=$('statusDot'),t=$('statusText');if(d)d.style.background=on?'#0f0':'#f44';if(t)t.textContent=LANG[currentLang]?.[on?'connected':'disconnected']||''}
function openPanel(id,oid){$(id)?.classList.add('open');if(oid)$(oid)?.classList.add('show')}
function closePanel(id,oid){$(id)?.classList.remove('open');if(oid)$(oid)?.classList.remove('show')}

/* ═══════ STREAM SIMULATION ═══════ */
let streaming = false, animFrame = null, startTime = 0;
let bwHistory = [];
const wfCanvas = $('waterfallCanvas');
const wfCtx = wfCanvas ? wfCanvas.getContext('2d') : null;
let wfData = [];

function initWaterfall(){
  if(!wfCtx)return;wfData=[];
  for(let y=0;y<wfCanvas.height;y++){const row=new Float32Array(wfCanvas.width);for(let x=0;x<wfCanvas.width;x++)row[x]=Math.random()*.03;wfData.push(row)}
}

function addSpectrumLine(){
  const W=wfCanvas.width, bw=parseInt($('bwSelect')?.value||2);
  const row=new Float32Array(W);
  // Noise floor
  for(let x=0;x<W;x++) row[x]=Math.random()*.06;
  // Simulated signals based on frequency
  const freq=parseInt($('freqSelect')?.value||2400);
  const numSignals=2+Math.floor(Math.random()*4);
  for(let s=0;s<numSignals;s++){
    const center=Math.floor(Math.random()*W);
    const width=Math.floor(10+Math.random()*30*(bw/2));
    const amp=.3+Math.random()*.7;
    for(let i=-width;i<width;i++){
      const idx=center+i;
      if(idx>=0&&idx<W){const d=Math.abs(i)/width;row[idx]=Math.max(row[idx],amp*(1-d*d)+Math.random()*.05)}
    }
  }
  wfData.push(row);if(wfData.length>wfCanvas.height)wfData.shift();
}

function drawWaterfall(){
  if(!wfCtx)return;
  const W=wfCanvas.width,H=wfCanvas.height;
  const img=wfCtx.createImageData(W,H);
  for(let y=0;y<Math.min(wfData.length,H);y++){
    const row=wfData[y];
    for(let x=0;x<W;x++){
      const v=row[x],idx=(y*W+x)*4;
      if(v<.2){img.data[idx]=0;img.data[idx+1]=0;img.data[idx+2]=Math.floor(v*5*150)}
      else if(v<.5){img.data[idx]=0;img.data[idx+1]=Math.floor((v-.2)*3.3*255);img.data[idx+2]=200}
      else if(v<.8){img.data[idx]=Math.floor((v-.5)*3.3*255);img.data[idx+1]=220;img.data[idx+2]=0}
      else{img.data[idx]=255;img.data[idx+1]=Math.floor((1-(v-.8)*5)*200);img.data[idx+2]=0}
      img.data[idx+3]=255;
    }
  }
  wfCtx.putImageData(img,0,0);
  const freq=parseInt($('freqSelect')?.value||2400),bw=parseInt($('bwSelect')?.value||2);
  wfCtx.fillStyle='rgba(255,255,255,.5)';wfCtx.font='10px Orbitron,monospace';
  wfCtx.fillText(`${freq-bw/2} MHz`,4,12);wfCtx.fillText(`${freq} MHz`,W/2-25,12);wfCtx.fillText(`${freq+bw/2} MHz`,W-75,12);
}

function drawBandwidth(){
  const canvas=$('bwCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d'),W=canvas.width,H=canvas.height;
  ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);
  if(bwHistory.length<2)return;
  const max=Math.max(20,...bwHistory);
  ctx.strokeStyle='var(--accent, #d4a017)';ctx.lineWidth=2;ctx.beginPath();
  bwHistory.forEach((v,i)=>{const x=i/(bwHistory.length-1)*W,y=H-10-(v/max)*(H-20);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
  ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='10px monospace';
  ctx.fillText('Mbps',4,14);ctx.fillText(max.toFixed(1),4,28);
}

function updateStats(){
  const bw=parseInt($('bwSelect')?.value||2);
  const baseThroughput=bw*4; // IQ = 4x bandwidth
  const throughput=baseThroughput*(0.85+Math.random()*.15);
  const latency=5+Math.random()*15;
  const dropped=Math.random()*2;
  const elapsed=Math.floor((Date.now()-startTime)/1000);
  const mins=Math.floor(elapsed/60).toString().padStart(2,'0');
  const secs=(elapsed%60).toString().padStart(2,'0');

  $('throughput').textContent=throughput.toFixed(1);
  $('latency').textContent=latency.toFixed(0);
  $('dropped').textContent=dropped.toFixed(1);
  $('uptime').textContent=`${mins}:${secs}`;
  $('bufferBar').style.width=Math.min(100,60+Math.random()*35)+'%';

  bwHistory.push(throughput);if(bwHistory.length>200)bwHistory.shift();
}

function updateConfig(){
  const freq=$('freqSelect')?.value||2400,bw=$('bwSelect')?.value||2;
  const el=$('configPanel');if(!el)return;
  el.innerHTML=`<div>Center Frequency: <strong>${freq} MHz</strong></div><div>Bandwidth: <strong>${bw} MHz</strong></div><div>Sample Rate: <strong>${bw*2} MSPS</strong></div><div>IQ Format: <strong>8-bit I/Q (uint8)</strong></div><div>Protocol: <strong>UDP/TCP Hybrid</strong></div><div>Buffer Size: <strong>256 KB ring</strong></div><div>Packet Size: <strong>1472 bytes (MTU-safe)</strong></div><div>Raw Data Rate: <strong>${bw*4} Mbps</strong></div>`;
}

function animate(){
  if(!streaming)return;
  addSpectrumLine();drawWaterfall();updateStats();
  if(bwHistory.length%10===0)drawBandwidth();
  animFrame=requestAnimationFrame(animate);
}

function connectBridge(){
  if(streaming)return;streaming=true;startTime=Date.now();bwHistory=[];
  setStatus(true);playSound('click');
  log(LANG[currentLang]?.bridgeConnected||'Bridge connected','success');
  updateConfig();animate();
}
function disconnectBridge(){
  streaming=false;if(animFrame)cancelAnimationFrame(animFrame);
  setStatus(false);
  log(LANG[currentLang]?.bridgeDisconnected||'Bridge disconnected','info');
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  const savedLang=localStorage.getItem('rfbridge-lang')||'en';
  const savedTheme=localStorage.getItem('rfbridge-theme')||'mosque-gold';
  if($('langSelect'))$('langSelect').value=savedLang;
  if($('themeSelect'))$('themeSelect').value=savedTheme;
  setLanguage(savedLang);setTheme(savedTheme);

  $('helpBtn')?.addEventListener('click',()=>openPanel('helpPanel','helpOverlay'));
  $('helpCloseBtn')?.addEventListener('click',()=>closePanel('helpPanel','helpOverlay'));
  $('helpOverlay')?.addEventListener('click',()=>closePanel('helpPanel','helpOverlay'));
  $('settingsBtn')?.addEventListener('click',()=>openPanel('settingsPanel','settingsOverlay'));
  $('settingsCloseBtn')?.addEventListener('click',()=>closePanel('settingsPanel','settingsOverlay'));
  $('settingsOverlay')?.addEventListener('click',()=>closePanel('settingsPanel','settingsOverlay'));
  $('logBtn')?.addEventListener('click',()=>$('logPanel')?.classList.toggle('open'));
  $('logCloseBtn')?.addEventListener('click',()=>$('logPanel')?.classList.remove('open'));
  $('langSelect')?.addEventListener('change',e=>setLanguage(e.target.value));
  $('themeSelect')?.addEventListener('change',e=>setTheme(e.target.value));
  $('soundToggle')?.addEventListener('change',e=>{soundEnabled=e.target.checked});
  $('clearLogBtn')?.addEventListener('click',()=>{$('logContainer').innerHTML='';log('Log cleared','info')});
  $('copyLogBtn')?.addEventListener('click',()=>{navigator.clipboard.writeText($('logContainer')?.innerText||'').then(()=>showToast('Copied!',1500))});

  document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$({faq:'helpFaq',howto:'helpHowto',wiki:'helpWiki'}[tab.dataset.tab])?.classList.add('active')})});
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.log-line').forEach(l=>{l.style.display=(f==='all'||l.classList.contains('log-'+f))?'':'none'})})});

  $('connectBtn')?.addEventListener('click',connectBridge);
  $('disconnectBtn')?.addEventListener('click',disconnectBridge);
  $('freqSelect')?.addEventListener('change',updateConfig);
  $('bwSelect')?.addEventListener('change',updateConfig);

  initWaterfall();drawWaterfall();updateConfig();
  setStatus(false);log(LANG[currentLang]?.ready||'Ready','success');
});

/* ═══════════════════════════════════════════════════════════════
   CANVAS SIMULATION — RF Bridge: Wireless SDR over WiFi with
   IQ stream visualization, bandwidth meter, and buffer status
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simRfBridgeCanvas';let canvas,ctx,animId,W,H,frameCount=0;
  const iqSamples=[],streamPkts=[];let bufferLevel=0.5,throughput=0,dropped=0;

  function ensureCanvas(){
    canvas=document.getElementById(CVS_ID);
    if(!canvas){canvas=document.createElement('canvas');canvas.id=CVS_ID;
      canvas.style.cssText='width:100%;height:300px;border-radius:12px;margin:1.2rem 0;display:block;background:#080812;';
      (document.querySelector('.workshop-card')||document.querySelector('.main-content')||document.body).appendChild(canvas);}
    const r=canvas.getBoundingClientRect();canvas.width=r.width*(devicePixelRatio||1);canvas.height=r.height*(devicePixelRatio||1);
    ctx=canvas.getContext('2d');ctx.scale(devicePixelRatio||1,devicePixelRatio||1);W=r.width;H=r.height;
  }

  /* HackRF device (left) */
  function drawHackRF(){
    ctx.save();ctx.shadowColor='#6bcb77';ctx.shadowBlur=8;
    ctx.beginPath();ctx.rect(20,H/2-25,60,50);ctx.fillStyle='rgba(107,203,119,0.12)';ctx.fill();
    ctx.strokeStyle='#6bcb77';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='10px monospace';ctx.fillStyle='#6bcb77';ctx.textAlign='center';ctx.fillText('HackRF',50,H/2+4);
    ctx.font='7px monospace';ctx.fillStyle='#888';ctx.fillText('SDR',50,H/2+16);ctx.restore();
  }

  /* ESP32 bridge (center) */
  function drawBridge(){
    const bx=W/2,by=H/2;
    const pulse=4+Math.sin(frameCount*0.05)*2;
    ctx.save();ctx.shadowColor='#ffd93d';ctx.shadowBlur=pulse;
    ctx.beginPath();ctx.arc(bx,by,24,0,Math.PI*2);ctx.fillStyle='rgba(255,217,61,0.12)';ctx.fill();
    ctx.strokeStyle='#ffd93d';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='14px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('\u{1F4F6}',bx,by);
    ctx.font='8px monospace';ctx.fillStyle='#ffd93d';ctx.fillText('ESP32 Bridge',bx,by+32);ctx.restore();
    // Buffer bar
    ctx.fillStyle='#222';ctx.fillRect(bx-25,by+38,50,5);
    const bc=bufferLevel>0.8?'#ff4444':bufferLevel>0.5?'#ffd93d':'#6bcb77';
    ctx.fillStyle=bc;ctx.fillRect(bx-25,by+38,50*bufferLevel,5);
    ctx.font='7px monospace';ctx.fillStyle='#888';ctx.textAlign='center';ctx.fillText('Buffer: '+Math.floor(bufferLevel*100)+'%',bx,by+54);
  }

  /* WiFi client (right) */
  function drawClient(){
    ctx.save();ctx.shadowColor='#4d96ff';ctx.shadowBlur=8;
    ctx.beginPath();ctx.rect(W-80,H/2-25,60,50);ctx.fillStyle='rgba(77,150,255,0.12)';ctx.fill();
    ctx.strokeStyle='#4d96ff';ctx.lineWidth=2;ctx.stroke();ctx.shadowBlur=0;
    ctx.font='10px monospace';ctx.fillStyle='#4d96ff';ctx.textAlign='center';ctx.fillText('Client',W-50,H/2+4);
    ctx.font='7px monospace';ctx.fillStyle='#888';ctx.fillText('WiFi',W-50,H/2+16);ctx.restore();
  }

  /* IQ data stream packets flying between nodes */
  class StreamPkt{
    constructor(phase){this.phase=phase;this.sx=phase===0?80:W/2+24;this.sy=H/2;this.tx=phase===0?W/2-24:W-80;this.ty=H/2;this.progress=0;this.alive=true;}
    update(){this.progress+=0.025;if(this.progress>=1)this.alive=false;return this.alive;}
    draw(){
      const px=this.sx+(this.tx-this.sx)*this.progress,py=this.sy+(this.ty-this.sy)*this.progress+(Math.sin(this.progress*Math.PI*4)*8);
      ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fillStyle=this.phase===0?'#6bcb77':'#4d96ff';ctx.fill();
    }
  }

  /* IQ constellation diagram */
  function drawConstellation(){
    const cx=W/2,cy=H*0.18,r=40;
    ctx.strokeStyle='#fff1';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(cx-r,cy);ctx.lineTo(cx+r,cy);ctx.moveTo(cx,cy-r);ctx.lineTo(cx,cy+r);ctx.stroke();
    // IQ points
    for(let i=0;i<16;i++){
      const angle=Math.PI*2/16*i+frameCount*0.02;
      const dist=r*0.6+Math.random()*r*0.2;
      const px=cx+Math.cos(angle)*dist,py=cy+Math.sin(angle)*dist;
      ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.6)';ctx.fill();
    }
    ctx.font='7px monospace';ctx.fillStyle='#666';ctx.textAlign='center';ctx.fillText('IQ Constellation',cx,cy+r+10);
  }

  /* Bandwidth timeline at bottom */
  const bwHist=[];
  function drawBWTimeline(){
    bwHist.push(throughput);if(bwHist.length>120)bwHist.shift();
    const bh=40,by=H-bh-8;
    ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(0,by,W,bh);
    ctx.strokeStyle='#fff1';ctx.strokeRect(0,by,W,bh);
    const step=W/120;
    ctx.beginPath();
    bwHist.forEach((v,i)=>{const x=i*step,y=by+bh-v/10*bh;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
    ctx.strokeStyle='rgba(0,200,255,0.5)';ctx.lineWidth=1;ctx.stroke();
    ctx.font='7px monospace';ctx.fillStyle='#666';ctx.textAlign='left';ctx.fillText('Bandwidth (Mbps)',4,by+10);
  }

  /* Connection lines */
  function drawConnections(){
    ctx.beginPath();ctx.moveTo(80,H/2);ctx.lineTo(W/2-24,H/2);ctx.strokeStyle='rgba(107,203,119,0.2)';ctx.lineWidth=2;ctx.setLineDash([4,6]);ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();ctx.moveTo(W/2+24,H/2);ctx.lineTo(W-80,H/2);ctx.strokeStyle='rgba(77,150,255,0.2)';ctx.lineWidth=2;ctx.setLineDash([4,6]);ctx.stroke();ctx.setLineDash([]);
    ctx.font='7px monospace';ctx.fillStyle='#888';ctx.textAlign='center';
    ctx.fillText('USB/SPI',W*0.25,H/2-10);ctx.fillText('WiFi UDP',W*0.75,H/2-10);
  }

  function drawHUD(){
    ctx.save();ctx.fillStyle='rgba(0,0,0,0.65)';ctx.fillRect(8,8,175,56);ctx.strokeStyle='#ffd93d33';ctx.strokeRect(8,8,175,56);
    ctx.font='10px monospace';ctx.fillStyle='#ffd93d';ctx.textAlign='left';ctx.fillText('\u{1F309} RF BRIDGE',16,24);ctx.fillStyle='#aaa';
    ctx.fillText('Throughput: '+throughput.toFixed(1)+' Mbps',16,40);
    ctx.fillText('Dropped: '+dropped+'  Buffer: '+Math.floor(bufferLevel*100)+'%',16,54);ctx.restore();
  }

  function init(){ensureCanvas();animate();}
  function animate(){
    frameCount++;ctx.fillStyle='rgba(8,8,18,0.14)';ctx.fillRect(0,0,W,H);
    throughput=4+Math.sin(frameCount*0.02)*2+Math.random()*0.5;
    bufferLevel=0.3+Math.sin(frameCount*0.01)*0.3+Math.random()*0.1;
    if(bufferLevel>0.9)dropped++;
    drawConnections();drawHackRF();drawBridge();drawClient();drawConstellation();
    if(frameCount%6===0){streamPkts.push(new StreamPkt(0));streamPkts.push(new StreamPkt(1));}
    for(let i=streamPkts.length-1;i>=0;i--){if(!streamPkts[i].update())streamPkts.splice(i,1);else streamPkts[i].draw();}
    drawBWTimeline();drawHUD();animId=requestAnimationFrame(animate);
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
