/**
 * Workshop DIY — Bio Muscle Telegraph v1.0
 * EMG to Morse code transmission
 */
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

const LANG={
  en:{
    ...LANG_BASE.en,title:'Bio Muscle Telegraph',subtitle:'Muscles tap Morse code',disconnected:'Disconnected',connected:'Connected',mainSection:'Muscle Telegraph \u2014 EMG to Morse',mainDesc:'Muscle contractions converted to Morse code',ready:'\ud83d\udcaa Muscle Telegraph ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Attach Sensors',step1Desc:'Place biosensors on the body to measure physiological signals.',step2Title:'Capture Biosignal',step2Desc:'The sensor captures real-time biological data like heart rate or muscle activity.',step3Title:'Process & Modulate',step3Desc:'Biosignal data is processed and converted into a radio-compatible format.',step4Title:'Transmit & Decode',step4Desc:'The bio-encoded signal is transmitted wirelessly and decoded at the receiver.',sectionCode:'Device Code',faq_q1:'What is Bio Muscle Telegraph?',faq_a1:'Bio Muscle Telegraph lets you muscle contractions converted to morse code. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real biomedical signals behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real biomedical signals principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Bio Body Antenna and Bio Brainwave Radio. Each app in this category teaches a different aspect of biomedical signals.',demo_s1:'Welcome to Bio Muscle Telegraph! Look at the main display — this is where the biomedical signals simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "the first section" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of biomedical signals.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how biomedical signals works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches biomedical signals concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Parameter Sweep',ch1Desc:'Systematically change one variable while keeping others constant. Record the results. Can you find the relationship between input and output?',ch2Title:'Edge Case',ch2Desc:'Push a parameter to its extreme value. What happens? Does the system behave differently at the boundary? Why?',ch3Title:'Predict Then Test',ch3Desc:'Before pressing Start, predict what will happen based on the current settings. Were you right? What did you miss?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Bio Muscle Telegraph?',wiki_concept:'Bio Muscle Telegraph is a technique used in biomedical signals. Muscle contractions converted to Morse code. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Place biosensors on the body to measure physiological signals. Second: The sensor captures real-time biological data like heart rate or muscle activity. The simulation runs these stages in real time, showing you intermediate results at each step. In real biomedical signals, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Bio Muscle Telegraph has practical applications in biomedical signals. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Bio Muscle Telegraph: Muscle contractions converted to Morse code. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Attach Sensors through Capture Biosignal to Process & Modulate and Transmit & Decode.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Analysis" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Bio T\u00e9l\u00e9graphe Musculaire',subtitle:'Les muscles tapent du Morse',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'T\u00e9l\u00e9graphe Musculaire \u2014 EMG en Morse',mainDesc:'Contractions musculaires converties en code Morse',ready:'\ud83d\udcaa T\u00e9l\u00e9graphe pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Fixer les capteurs',step1Desc:'Place les biocapteurs sur le corps pour mesurer les signaux physiologiques.',step2Title:'Capturer le biosignal',step2Desc:'Le capteur enregistre les données biologiques en temps réel.',step3Title:'Traiter et moduler',step3Desc:'Les données sont traitées et converties en format radio compatible.',step4Title:'Émettre et décoder',step4Desc:'Le signal bio-encodé est transmis sans fil et décodé au récepteur.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule bio-signals ! 🔬 Tu peux expérimenter avec body signals into radio en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais body signals into radio.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai biometric radio technology ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Bio Nerve Impulse Detector and Bio Heartbeat Cipher ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',learnAge:'Âge :'},
  ar:{title:'\u062a\u0644\u063a\u0631\u0627\u0641 \u0627\u0644\u0639\u0636\u0644\u0627\u062a',subtitle:'\u0627\u0644\u0639\u0636\u0644\u0627\u062a \u062a\u0646\u0642\u0631 \u0634\u0641\u0631\u0629 \u0645\u0648\u0631\u0633',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u062a\u0644\u063a\u0631\u0627\u0641 \u0627\u0644\u0639\u0636\u0644\u0627\u062a \u2014 EMG \u0625\u0644\u0649 \u0645\u0648\u0631\u0633',mainDesc:'\u0627\u0646\u0642\u0628\u0627\u0636\u0627\u062a \u0639\u0636\u0644\u064a\u0629 \u062a\u062a\u062d\u0648\u0644 \u0644\u0634\u0641\u0631\u0629 \u0645\u0648\u0631\u0633',ready:'\ud83d\udcaa \u062a\u0644\u063a\u0631\u0627\u0641 \u0627\u0644\u0639\u0636\u0644\u0627\u062a \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',step1Title:'تثبيت المستشعرات',step1Desc:'ضع المستشعرات الحيوية على الجسم لقياس الإشارات الفسيولوجية.',step2Title:'التقاط الإشارة الحيوية',step2Desc:'يلتقط المستشعر البيانات البيولوجية في الوقت الفعلي.',step3Title:'معالجة وتعديل',step3Desc:'تتم معالجة البيانات وتحويلها إلى صيغة متوافقة مع الراديو.',step4Title:'إرسال وفك تشفير',step4Desc:'يتم بث الإشارة المشفرة حيوياً لاسلكياً وفك تشفيرها.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي bio-signals! 🔬 يمكنك التجربة مع body signals into radio في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج body signals into radio حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا biometric radio technology حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Bio Nerve Impulse Detector and Bio Heartbeat Cipher! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',learnAge:'العمر:'}
};

const MORSE_MAP={'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---','k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-','u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','0':'-----',' ':'/'};
const MORSE_REV=Object.fromEntries(Object.entries(MORSE_MAP).map(([k,v])=>[v,k]));

let emgRunning=false,emgData=[],morseBuffer='',decodedText='',charCount=0,emgLevel=0;

function initApp(){
  const canvas=$('emgCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=300;
  const W=canvas.width,H=canvas.height;let t=0,flexing=false,flexStart=0;

  function frame(){
    ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(0,0,W,H);t++;
    if(emgRunning){
      const noise=(Math.random()-.5)*30;
      emgLevel=flexing?200+Math.random()*150:noise+15;
      emgData.push(emgLevel);if(emgData.length>W)emgData.shift();
      const se=$('statEMG');if(se)se.textContent=Math.round(Math.abs(emgLevel));
    }
    // Draw EMG trace
    if(emgData.length>1){
      ctx.beginPath();ctx.strokeStyle=emgLevel>100?'#ff6633':'#33ff33';ctx.lineWidth=1.5;
      emgData.forEach((v,i)=>{const x=i,y=H/2-v/400*H;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
      ctx.stroke();
    }
    // Threshold line
    ctx.strokeStyle='rgba(255,204,0,.3)';ctx.setLineDash([6,6]);
    ctx.beginPath();ctx.moveTo(0,H/2-100/400*H);ctx.lineTo(W,H/2-100/400*H);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,H/2+100/400*H);ctx.lineTo(W,H/2+100/400*H);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(255,204,0,.3)';ctx.font='9px Orbitron';ctx.fillText('THRESHOLD',W-80,H/2-100/400*H-5);
    requestAnimationFrame(frame);
  }
  frame();

  const startBtn=$('startBtn'),flexBtn=$('flexBtn'),holdBtn=$('holdBtn'),decodeBtn=$('decodeBtn'),encodeBtn=$('encodeBtn');

  if(startBtn)startBtn.onclick=()=>{emgRunning=!emgRunning;setStatus(emgRunning);log(emgRunning?'EMG started':'EMG stopped','info')};

  if(flexBtn){
    flexBtn.onmousedown=flexBtn.ontouchstart=()=>{if(!emgRunning)return;emgLevel=250;morseBuffer+='.';updateMorse();log('DOT (.)','tx');playSound('click')};
  }
  if(holdBtn){
    holdBtn.onmousedown=holdBtn.ontouchstart=()=>{if(!emgRunning)return;emgLevel=350;morseBuffer+='-';updateMorse();log('DASH (-)','tx');playSound('click')};
  }

  if(decodeBtn)decodeBtn.onclick=()=>{
    if(!morseBuffer){log('No Morse to decode','error');return}
    const words=morseBuffer.split(' / ').map(w=>w.split(' ').map(c=>MORSE_REV[c]||'?').join('')).join(' ');
    decodedText=words;charCount+=words.replace(/ /g,'').length;
    const md=$('morseDisplay'),sc=$('statChars');
    if(md)md.textContent=`${morseBuffer} | ${words.toUpperCase()}`;
    if(sc)sc.textContent=charCount;
    log(`Decoded: ${words.toUpperCase()}`,'success');morseBuffer='';
  };

  if(encodeBtn)encodeBtn.onclick=()=>{
    const msg=($('msgInput')||{}).value||'';if(!msg){log('Enter message','error');return}
    morseBuffer=msg.toLowerCase().split('').map(c=>MORSE_MAP[c]||'').join(' ');
    updateMorse();log(`Encoded: ${morseBuffer}`,'tx');
  };

  // Space key = letter separator, Enter = word separator
  document.addEventListener('keydown',e=>{
    if(!emgRunning)return;
    if(e.code==='Space'&&!e.target.matches('input')){e.preventDefault();morseBuffer+=' ';updateMorse()}
    if(e.code==='Slash'){morseBuffer+=' / ';updateMorse()}
  });

  function updateMorse(){const md=$('morseDisplay');if(md)md.textContent=morseBuffer||'...';}
}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ MUSCLE TELEGRAPH CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootMuscleViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(255,100,50,.12);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- Morse code map --- */
    var MORSE={'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---','k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-','u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..'};
    var MORSE_REV={};Object.keys(MORSE).forEach(function(k){MORSE_REV[MORSE[k]]=k;});

    /* --- state --- */
    var emgBuffer=new Float32Array(W);
    var rectifiedBuffer=new Float32Array(W);
    var morseSymbols=[]; // {type:'dot'|'dash'|'space',time:t}
    var decodedChars=[];
    var currentWord='';
    var isFlexing=false,flexIntensity=0,flexTimer=0;
    var autoMode=true,autoMsg='SOS HELLO WORLD';
    var autoIdx=0,autoSymIdx=0,autoDelay=0;
    var muscleGroups=[
      {name:'Bicep',x:0.22,y:0.42,active:false,emgScale:1.0},
      {name:'Forearm',x:0.28,y:0.58,active:true,emgScale:0.8},
      {name:'Wrist Flex',x:0.32,y:0.68,active:false,emgScale:0.6}
    ];
    var activeMuscle=1;
    var spectrogramData=[];
    var MAX_SPEC=80;

    /* --- arm outline points --- */
    var armTop=[[0.08,0.30],[0.14,0.28],[0.22,0.30],[0.28,0.35],[0.35,0.45],[0.40,0.55],[0.42,0.65],[0.40,0.72]];
    var armBot=[[0.08,0.50],[0.14,0.52],[0.22,0.55],[0.28,0.58],[0.35,0.62],[0.40,0.68],[0.42,0.72]];

    /* scale to arm region */
    var armW=280,armH=300,armOX=10,armOY=200;
    function ax(nx){return armOX+nx*armW;}
    function ay(ny){return armOY+ny*armH;}

    /* --- auto-send morse --- */
    function autoStep(){
      if(!autoMode)return;
      autoDelay-=0.016;
      if(autoDelay>0)return;

      if(autoIdx>=autoMsg.length){autoIdx=0;autoSymIdx=0;}
      var ch=autoMsg[autoIdx].toLowerCase();
      if(ch===' '){
        morseSymbols.push({type:'space',time:t});
        decodedChars.push(' ');
        autoIdx++;autoSymIdx=0;autoDelay=0.6;
        return;
      }
      var code=MORSE[ch];
      if(!code){autoIdx++;autoSymIdx=0;return;}
      if(autoSymIdx>=code.length){
        /* letter done, decode */
        decodedChars.push(ch.toUpperCase());
        autoIdx++;autoSymIdx=0;autoDelay=0.4;
        return;
      }
      var sym=code[autoSymIdx];
      isFlexing=true;
      flexIntensity=sym==='.'?0.6:1.0;
      flexTimer=sym==='.'?0.12:0.35;
      morseSymbols.push({type:sym==='.'?'dot':'dash',time:t});
      autoSymIdx++;autoDelay=sym==='.'?0.25:0.5;
    }

    /* --- draw morse tape --- */
    function drawMorseTape(x,y,w,h){
      ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(x,y,w,h);
      ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.strokeRect(x,y,w,h);

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('MORSE OUTPUT TAPE',x+5,y+12);

      /* draw recent symbols */
      var startIdx=Math.max(0,morseSymbols.length-40);
      var tx=x+10;
      for(var i=startIdx;i<morseSymbols.length;i++){
        var sym=morseSymbols[i];
        if(sym.type==='dot'){
          ctx.fillStyle='#ff6633';ctx.beginPath();ctx.arc(tx,y+h/2+5,4,0,Math.PI*2);ctx.fill();
          tx+=12;
        }else if(sym.type==='dash'){
          ctx.fillStyle='#ff6633';ctx.fillRect(tx-2,y+h/2+1,18,8);
          tx+=24;
        }else{
          tx+=15;
        }
        if(tx>x+w-10)break;
      }

      /* decoded text */
      var decoded=decodedChars.slice(-30).join('');
      ctx.fillStyle='#33ff33';ctx.font='bold 12px Orbitron,monospace';
      ctx.fillText(decoded,x+10,y+h-10);
    }

    /* --- main frame --- */
    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.12)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      /* auto morse stepping */
      autoStep();

      /* flex timer */
      if(flexTimer>0){flexTimer-=0.016;if(flexTimer<=0){isFlexing=false;flexIntensity=0;}}

      /* generate EMG signal */
      var noise=(Math.random()-0.5)*0.08;
      var mg=muscleGroups[activeMuscle];
      var emgVal=isFlexing?(flexIntensity*mg.emgScale*(0.7+Math.random()*0.3)+Math.sin(t*120)*0.15*flexIntensity):noise*0.3;
      var rectVal=Math.abs(emgVal);

      /* shift buffers */
      for(var i=0;i<W-1;i++){emgBuffer[i]=emgBuffer[i+1];rectifiedBuffer[i]=rectifiedBuffer[i+1];}
      emgBuffer[W-1]=emgVal;rectifiedBuffer[W-1]=rectVal;

      /* ---- SECTION 1: Raw EMG (top) ---- */
      var emgY0=0,emgH=H*0.22;
      ctx.save();ctx.beginPath();ctx.rect(0,emgY0,W,emgH);ctx.clip();
      ctx.fillStyle='rgba(6,6,16,0.3)';ctx.fillRect(0,emgY0,W,emgH);

      /* threshold lines */
      ctx.strokeStyle='rgba(255,204,0,0.15)';ctx.setLineDash([4,4]);ctx.lineWidth=0.5;
      var threshY=emgH*0.3;
      ctx.beginPath();ctx.moveTo(0,emgY0+threshY);ctx.lineTo(W,emgY0+threshY);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,emgY0+emgH-threshY);ctx.lineTo(W,emgY0+emgH-threshY);ctx.stroke();
      ctx.setLineDash([]);

      /* draw raw EMG */
      ctx.beginPath();ctx.strokeStyle=isFlexing?'#ff6633':'#33ff33';ctx.lineWidth=1.5;
      for(var i=0;i<W;i++){
        var y=emgY0+emgH/2-emgBuffer[i]*emgH*0.8;
        if(i===0)ctx.moveTo(i,y);else ctx.lineTo(i,y);
      }
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('RAW EMG SIGNAL',10,emgY0+12);
      ctx.fillStyle='rgba(255,204,0,0.3)';ctx.fillText('THRESHOLD',W-70,emgY0+threshY-3);

      /* ---- SECTION 2: Rectified EMG ---- */
      var rectY0=emgH+5,rectH=H*0.13;
      ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(0,rectY0,W,rectH);

      ctx.beginPath();ctx.strokeStyle='#ffcc00';ctx.lineWidth=1.2;
      for(var i=0;i<W;i++){
        var y=rectY0+rectH-rectifiedBuffer[i]*rectH*1.6;
        if(i===0)ctx.moveTo(i,y);else ctx.lineTo(i,y);
      }
      ctx.stroke();
      /* filled area */
      ctx.fillStyle='rgba(255,204,0,0.08)';ctx.beginPath();ctx.moveTo(0,rectY0+rectH);
      for(var i=0;i<W;i++){
        var y=rectY0+rectH-rectifiedBuffer[i]*rectH*1.6;ctx.lineTo(i,y);
      }
      ctx.lineTo(W,rectY0+rectH);ctx.closePath();ctx.fill();

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('RECTIFIED + ENVELOPE',10,rectY0+12);

      /* ---- SECTION 3: EMG Spectrogram ---- */
      var specY0=rectY0+rectH+5,specH=H*0.18;
      /* build spectrum from recent EMG */
      var specRow=[];
      for(var b=0;b<64;b++){
        var freq=b*8;// 0-512Hz
        var amp=0.02;
        if(isFlexing){
          /* EMG spectrum: broad 20-150Hz with peaks at muscle firing freq */
          amp+=Math.exp(-(freq-80)*(freq-80)/3000)*flexIntensity*0.5;
          amp+=Math.exp(-(freq-40)*(freq-40)/1000)*flexIntensity*0.3;
          amp+=Math.random()*0.05*flexIntensity;
        }
        amp+=Math.random()*0.02;
        specRow.push(Math.min(1,amp));
      }
      spectrogramData.push(specRow);
      if(spectrogramData.length>MAX_SPEC)spectrogramData.shift();

      var cellW=W/64,cellH=specH/MAX_SPEC;
      for(var row=0;row<spectrogramData.length;row++){
        for(var col=0;col<64;col++){
          var v=spectrogramData[row][col];
          var r=Math.min(255,v*600)|0;
          var g=Math.min(255,Math.max(0,(v-0.15)*500))|0;
          var bl=Math.max(0,(0.5-v)*200)|0;
          ctx.fillStyle='rgb('+r+','+g+','+bl+')';
          ctx.fillRect(col*cellW,specY0+row*cellH,cellW+0.5,cellH+0.5);
        }
      }
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('EMG SPECTROGRAM (0-512Hz)',10,specY0+12);

      /* ---- SECTION 4: Bottom — Arm + Morse ---- */
      var botY=specY0+specH+8;

      /* ---- Arm diagram (left) ---- */
      var armRegW=W*0.38;
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(0,botY,armRegW,H-botY);

      /* arm outline */
      ctx.strokeStyle='rgba(0,200,255,0.2)';ctx.lineWidth=1.5;
      ctx.beginPath();
      armTop.forEach(function(p,i){var x=p[0]*armRegW*2+10,y=botY+(p[1]-0.25)*300;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
      ctx.stroke();
      ctx.beginPath();
      armBot.forEach(function(p,i){var x=p[0]*armRegW*2+10,y=botY+(p[1]-0.25)*300;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
      ctx.stroke();

      /* muscle groups / electrodes */
      muscleGroups.forEach(function(mg2,idx){
        var ex=mg2.x*armRegW*2+10,ey=botY+(mg2.y-0.25)*300;
        var isAct=idx===activeMuscle;

        /* electrode */
        ctx.beginPath();ctx.arc(ex,ey,isAct?8:5,0,Math.PI*2);
        ctx.fillStyle=isAct?(isFlexing?'#ff6633':'#33ff33')+'88':'rgba(100,100,200,0.3)';
        ctx.fill();ctx.strokeStyle=isAct?'#fff':'rgba(255,255,255,0.2)';ctx.lineWidth=1;ctx.stroke();

        /* EMG burst animation */
        if(isAct&&isFlexing){
          for(var r=0;r<2;r++){
            var rad=12+r*10+Math.sin(t*8)*4;
            ctx.beginPath();ctx.arc(ex,ey,rad,0,Math.PI*2);
            ctx.strokeStyle='rgba(255,100,50,'+(0.3-r*0.12)+')';ctx.stroke();
          }
        }

        ctx.fillStyle=isAct?'#fff':'rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
        ctx.fillText(mg2.name,ex+12,ey+3);
      });

      /* muscle contraction visualization */
      if(isFlexing){
        var mx=muscleGroups[activeMuscle].x*armRegW*2+10;
        var my=botY+(muscleGroups[activeMuscle].y-0.25)*300;
        /* fiber lines */
        ctx.strokeStyle='rgba(255,100,50,0.15)';ctx.lineWidth=0.5;
        for(var f=0;f<8;f++){
          var fy=my-20+f*5;
          var contraction=Math.sin(t*30+f)*3*flexIntensity;
          ctx.beginPath();ctx.moveTo(mx-25,fy);
          for(var fx=mx-25;fx<mx+25;fx+=3){
            ctx.lineTo(fx,fy+Math.sin((fx+t*50)*0.3)*contraction);
          }
          ctx.stroke();
        }
      }

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('MUSCLE ELECTRODE MAP',10,botY+12);

      /* ---- Morse tape (right) ---- */
      drawMorseTape(armRegW+10,botY,W-armRegW-20,H-botY-5);

      /* ---- Morse code reference (small) ---- */
      var refX=armRegW+20,refY=botY+45;
      ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('A .-  B -...  C -.-.  D -..  E .  F ..-.',refX,refY);
      ctx.fillText('G --.  H ....  I ..  J .---  K -.-  L .-..',refX,refY+11);
      ctx.fillText('S ...  O ---  SPACE = /  DOT=short  DASH=long',refX,refY+22);

      /* ---- HUD ---- */
      ctx.strokeStyle='rgba(255,100,50,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl=18;ctx.strokeStyle='rgba(255,100,50,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl,c[1]);ctx.stroke();
      });

      /* flex indicator */
      if(isFlexing){
        ctx.fillStyle='rgba(255,100,50,'+(0.5+Math.sin(t*10)*0.3)+')';
        ctx.beginPath();ctx.arc(W-20,14,5,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#ff6633';ctx.font='9px Orbitron,monospace';ctx.fillText('FLEX',W-60,17);
      }else{
        ctx.fillStyle='rgba(0,255,100,0.4)';ctx.beginPath();ctx.arc(W-20,14,3,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';ctx.fillText('IDLE',W-55,17);
      }

      /* divider lines */
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(0,emgH);ctx.lineTo(W,emgH);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,rectY0);ctx.lineTo(W,rectY0);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,specY0);ctx.lineTo(W,specY0);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,botY-3);ctx.lineTo(W,botY-3);ctx.stroke();

      requestAnimationFrame(frame);
    }

    /* click to switch muscle groups */
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(W/rect.width);
      var my=(e.clientY-rect.top)*(H/rect.height);
      var armRegW=W*0.38;
      var botY=H*0.22+5+H*0.13+5+H*0.18+8;
      muscleGroups.forEach(function(mg2,idx){
        var ex=mg2.x*armRegW*2+10,ey=botY+(mg2.y-0.25)*300;
        var dist=Math.sqrt((mx-ex)*(mx-ex)+(my-ey)*(my-ey));
        if(dist<20)activeMuscle=idx;
      });
    });

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootMuscleViz);
  else setTimeout(bootMuscleViz,200);
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
