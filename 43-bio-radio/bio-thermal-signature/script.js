/**
 * Workshop DIY — Bio Thermal Signature v1.0
 * Detect humans through walls via thermal RF
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
    ...LANG_BASE.en,title:'Bio Thermal Signature',subtitle:'See through walls with thermal RF',disconnected:'Disconnected',connected:'Connected',mainSection:'Thermal Signature \u2014 Through-Wall Detection',mainDesc:'Detect human thermal signatures through walls using RF',ready:'\ud83c\udf21 Thermal Scanner ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Attach Sensors',step1Desc:'Place biosensors on the body to measure physiological signals.',step2Title:'Capture Biosignal',step2Desc:'The sensor captures real-time biological data like heart rate or muscle activity.',step3Title:'Process & Modulate',step3Desc:'Biosignal data is processed and converted into a radio-compatible format.',step4Title:'Transmit & Decode',step4Desc:'The bio-encoded signal is transmitted wirelessly and decoded at the receiver.',sectionCode:'Device Code',faq_q1:'What is Bio Thermal Signature?',faq_a1:'Bio Thermal Signature lets you detect human thermal signatures through walls using rf. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you place biosensors on the body to measure physiological signals. Then you the sensor captures real-time biological data like heart rate or muscle activity.',faq_q3:'What do the controls do?',faq_a3:'Click Start to begin the simulation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real biomedical signals principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Bio Body Antenna and Bio Brainwave Radio. Each app in this category teaches a different aspect of biomedical signals.',demo_s1:'Welcome to Bio Thermal Signature! Look at the main display — this is where the biomedical signals simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "the first section" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of biomedical signals.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how biomedical signals works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches biomedical signals concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Analysis" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Bio Signature Thermique',subtitle:'Voir \u00e0 travers les murs avec RF thermique',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'Signature Thermique \u2014 D\u00e9tection Murale',mainDesc:'D\u00e9tecter les signatures thermiques humaines',ready:'\ud83c\udf21 Scanner thermique pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Fixer les capteurs',step1Desc:'Place les biocapteurs sur le corps pour mesurer les signaux physiologiques.',step2Title:'Capturer le biosignal',step2Desc:'Le capteur enregistre les données biologiques en temps réel.',step3Title:'Traiter et moduler',step3Desc:'Les données sont traitées et converties en format radio compatible.',step4Title:'Émettre et décoder',step4Desc:'Le signal bio-encodé est transmis sans fil et décodé au récepteur.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule bio-signals ! 🔬 Tu peux expérimenter avec body signals into radio en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais body signals into radio.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai biometric radio technology ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Bio Muscle Telegraph and Bio Skin Galvanic Key ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',learnAge:'Âge :'},
  ar:{title:'\u0627\u0644\u0628\u0635\u0645\u0629 \u0627\u0644\u062d\u0631\u0627\u0631\u064a\u0629',subtitle:'\u0631\u0624\u064a\u0629 \u0639\u0628\u0631 \u0627\u0644\u062c\u062f\u0631\u0627\u0646 \u0628\u0627\u0644\u062d\u0631\u0627\u0631\u0629 RF',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u0627\u0644\u0628\u0635\u0645\u0629 \u0627\u0644\u062d\u0631\u0627\u0631\u064a\u0629 \u2014 \u0643\u0634\u0641 \u0639\u0628\u0631 \u0627\u0644\u062c\u062f\u0631\u0627\u0646',mainDesc:'\u0643\u0634\u0641 \u0627\u0644\u0628\u0635\u0645\u0627\u062a \u0627\u0644\u062d\u0631\u0627\u0631\u064a\u0629 \u0627\u0644\u0628\u0634\u0631\u064a\u0629',ready:'\ud83c\udf21 \u0627\u0644\u0645\u0627\u0633\u062d \u0627\u0644\u062d\u0631\u0627\u0631\u064a \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',step1Title:'تثبيت المستشعرات',step1Desc:'ضع المستشعرات الحيوية على الجسم لقياس الإشارات الفسيولوجية.',step2Title:'التقاط الإشارة الحيوية',step2Desc:'يلتقط المستشعر البيانات البيولوجية في الوقت الفعلي.',step3Title:'معالجة وتعديل',step3Desc:'تتم معالجة البيانات وتحويلها إلى صيغة متوافقة مع الراديو.',step4Title:'إرسال وفك تشفير',step4Desc:'يتم بث الإشارة المشفرة حيوياً لاسلكياً وفك تشفيرها.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي bio-signals! 🔬 يمكنك التجربة مع body signals into radio في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج body signals into radio حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا biometric radio technology حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Bio Muscle Telegraph and Bio Skin Galvanic Key! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Biosignals',learn1Desc:'How your body generates electrical signals',learn1Tag:'Biology',learn2Title:'Bio-Radio',learn2Desc:'How body signals can be converted to radio waves',learn2Tag:'RF',learn3Title:'Neural Signals',learn3Desc:'How nerves transmit electrical impulses',learn3Tag:'Neuroscience',learn4Title:'Biometric ID',learn4Desc:'How unique body patterns identify individuals',learn4Tag:'Biometrics',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',learnAge:'العمر:'}
};

let scanning=false,showWall=true,people=[],ambientTemp=22.4;

function initApp(){
  const canvas=$('thermalCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=340;
  const W=canvas.width,H=canvas.height;let t=0;

  function addPerson(){
    people.push({x:W*.6+Math.random()*W*.3,y:H*.2+Math.random()*H*.6,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.3,temp:36.5+Math.random()*1.5,size:20+Math.random()*15});
  }

  function frame(){
    ctx.fillStyle='rgba(0,0,20,.15)';ctx.fillRect(0,0,W,H);t+=.016;
    if(!scanning){requestAnimationFrame(frame);return}

    // Room background - thermal gradient
    for(let y=0;y<H;y+=8){for(let x=0;x<W;x+=8){
      let heat=ambientTemp+Math.sin(x*.01+t)*0.5+Math.sin(y*.01)*0.3;
      // Add heat from people
      people.forEach(p=>{
        const dx=x-p.x,dy=y-p.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<p.size*3){
          let contribution=(p.temp-ambientTemp)*Math.exp(-dist*dist/(p.size*p.size*2));
          if(showWall&&x<W*.45)contribution*=.15;// Wall attenuates
          heat+=contribution;
        }
      });
      const norm=(heat-18)/25;// Normalize 18-43C range
      const r=Math.min(255,Math.max(0,norm*512));
      const g=Math.min(255,Math.max(0,(norm-.3)*512));
      const b=Math.min(255,Math.max(0,(1-norm)*200));
      ctx.fillStyle=`rgba(${r|0},${g|0},${b|0},.8)`;
      ctx.fillRect(x,y,8,8);
    }}

    // Wall
    if(showWall){
      ctx.fillStyle='rgba(100,100,120,.6)';ctx.fillRect(W*.42,0,W*.06,H);
      ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=2;ctx.strokeRect(W*.42,0,W*.06,H);
      ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='bold 11px Orbitron';
      ctx.save();ctx.translate(W*.44,H/2);ctx.rotate(-Math.PI/2);ctx.fillText('WALL',0,0);ctx.restore();
    }

    // Move people
    people.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<W*.5||p.x>W-20)p.vx*=-1;
      if(p.y<20||p.y>H-20)p.vy*=-1;
      // Person marker
      ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);
      ctx.fillStyle='rgba(255,255,0,.6)';ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.5)';ctx.font='9px Orbitron';
      ctx.fillText(`${p.temp.toFixed(1)}\u00b0C`,p.x+8,p.y-5);
    });

    // Sensor label
    ctx.fillStyle='rgba(0,255,150,.5)';ctx.font='10px Orbitron';ctx.fillText('SENSOR',10,20);
    ctx.fillText('TARGET ZONE',W*.6,20);

    // Update stats
    const sh=$('statHumans'),sd=$('statDist'),sc=$('statConf');
    if(sh)sh.textContent=people.length;
    if(sd)sd.textContent=(showWall?5:2).toFixed(0);
    if(sc)sc.textContent=Math.round(showWall?65+Math.random()*10:92+Math.random()*5);

    requestAnimationFrame(frame);
  }
  frame();

  const startBtn=$('startBtn'),addBtn=$('addPersonBtn'),moveBtn=$('moveBtn'),wallBtn=$('wallBtn');
  if(startBtn)startBtn.onclick=()=>{scanning=!scanning;setStatus(scanning);log(scanning?'Thermal scan started':'Scan stopped','info')};
  if(addBtn)addBtn.onclick=()=>{addPerson();log(`Person added (total: ${people.length})`,'success');showToast(`${people.length} humans detected`,1200)};
  if(moveBtn)moveBtn.onclick=()=>{people.forEach(p=>{p.vx=(Math.random()-.5)*2;p.vy=(Math.random()-.5)*1.5});log('People moving','info')};
  if(wallBtn)wallBtn.onclick=()=>{showWall=!showWall;log(showWall?'Wall ON \u2014 signal attenuated':'Wall removed \u2014 clear view','info')};
}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ THERMAL SIGNATURE CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootThermalViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(255,80,0,.15);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- thermal targets --- */
    var targets=[
      {x:W*0.65,y:H*0.35,vx:0.4,vy:0.2,temp:37.2,size:22,label:'Person A'},
      {x:W*0.75,y:H*0.6,vx:-0.3,vy:0.15,temp:36.8,size:18,label:'Person B'}
    ];
    var ambientT=22.0,wallX=W*0.42,wallW=W*0.05;
    var showWallV=true,scanActive=true;
    var heatMap=[];var hmW=100,hmH=65;
    var timeHistory=[];var MAX_HISTORY=200;
    var rfPulses=[];

    /* init heatmap */
    for(var i=0;i<hmW*hmH;i++)heatMap.push(ambientT);

    /* thermal palette: blue->cyan->green->yellow->red->white */
    function thermalColor(temp){
      var n=(temp-15)/30;// 15-45C range
      n=Math.max(0,Math.min(1,n));
      var r,g,b;
      if(n<0.25){r=0;g=Math.round(n*4*200);b=Math.round(150+n*4*105);}
      else if(n<0.5){var t2=(n-0.25)*4;r=Math.round(t2*200);g=200+Math.round(t2*55);b=Math.round(255-t2*200);}
      else if(n<0.75){var t2=(n-0.5)*4;r=200+Math.round(t2*55);g=Math.round(255-t2*100);b=Math.round(55-t2*55);}
      else{var t2=(n-0.75)*4;r=255;g=Math.round(155+t2*100);b=Math.round(t2*200);}
      return 'rgb('+r+','+g+','+b+')';
    }

    /* --- RF pulse for through-wall detection --- */
    function emitPulse(){
      rfPulses.push({x:30,y:H*0.38,r:0,maxR:W*0.8,speed:4,alpha:0.4});
    }

    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.15)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      /* ---- SECTION 1: Top — Through-wall thermal view ---- */
      var viewH=H*0.6;

      /* move targets */
      targets.forEach(function(tgt){
        tgt.x+=tgt.vx;tgt.y+=tgt.vy;
        if(tgt.x<W*0.5||tgt.x>W-25){tgt.vx*=-1;}
        if(tgt.y<30||tgt.y>viewH-25){tgt.vy*=-1;}
        tgt.temp=36.5+Math.sin(t+tgt.x*0.01)*0.8;
      });

      /* compute heatmap */
      var cellW=W/hmW,cellH=viewH/hmH;
      for(var hy=0;hy<hmH;hy++){
        for(var hx=0;hx<hmW;hx++){
          var px=hx*cellW+cellW/2,py=hy*cellH+cellH/2;
          var heat=ambientT+Math.sin(px*0.005+t)*0.3+Math.sin(py*0.007)*0.2;
          /* heat from targets */
          targets.forEach(function(tgt){
            var dx=px-tgt.x,dy=py-tgt.y;
            var dist=Math.sqrt(dx*dx+dy*dy);
            var contribution=(tgt.temp-ambientT)*Math.exp(-dist*dist/(tgt.size*tgt.size*3));
            /* wall attenuation */
            if(showWallV&&px<wallX)contribution*=0.12;
            heat+=contribution;
          });
          heatMap[hy*hmW+hx]=heat;
        }
      }

      /* draw heatmap */
      for(var hy=0;hy<hmH;hy++){
        for(var hx=0;hx<hmW;hx++){
          ctx.fillStyle=thermalColor(heatMap[hy*hmW+hx]);
          ctx.fillRect(hx*cellW,hy*cellH,cellW+0.5,cellH+0.5);
        }
      }

      /* wall */
      if(showWallV){
        ctx.fillStyle='rgba(80,80,100,0.55)';ctx.fillRect(wallX,0,wallW,viewH);
        ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1;ctx.strokeRect(wallX,0,wallW,viewH);
        ctx.save();ctx.translate(wallX+wallW/2,viewH/2);ctx.rotate(-Math.PI/2);
        ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='bold 10px Orbitron,monospace';ctx.textAlign='center';
        ctx.fillText('WALL',0,0);ctx.restore();ctx.textAlign='left';
      }

      /* target markers */
      targets.forEach(function(tgt){
        ctx.strokeStyle='rgba(255,255,0,0.6)';ctx.lineWidth=1.5;
        /* crosshair */
        ctx.beginPath();ctx.moveTo(tgt.x-15,tgt.y);ctx.lineTo(tgt.x-8,tgt.y);ctx.stroke();
        ctx.beginPath();ctx.moveTo(tgt.x+8,tgt.y);ctx.lineTo(tgt.x+15,tgt.y);ctx.stroke();
        ctx.beginPath();ctx.moveTo(tgt.x,tgt.y-15);ctx.lineTo(tgt.x,tgt.y-8);ctx.stroke();
        ctx.beginPath();ctx.moveTo(tgt.x,tgt.y+8);ctx.lineTo(tgt.x,tgt.y+15);ctx.stroke();
        /* ring */
        ctx.beginPath();ctx.arc(tgt.x,tgt.y,12,0,Math.PI*2);ctx.stroke();
        /* label */
        ctx.fillStyle='rgba(255,255,0,0.8)';ctx.font='9px Orbitron,monospace';
        ctx.fillText(tgt.label+' '+tgt.temp.toFixed(1)+'\u00b0C',tgt.x+18,tgt.y-8);
      });

      /* RF pulses */
      if(scanActive&&Math.random()<0.03)emitPulse();
      for(var pi=rfPulses.length-1;pi>=0;pi--){
        var p=rfPulses[pi];p.r+=p.speed;p.alpha-=0.004;
        if(p.alpha<=0||p.r>p.maxR){rfPulses.splice(pi,1);continue;}
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,-.4,.4);
        ctx.strokeStyle='rgba(0,255,200,'+Math.max(0,p.alpha)+')';ctx.lineWidth=1.5;ctx.stroke();
      }

      /* sensor icon */
      ctx.fillStyle='rgba(0,255,200,0.5)';ctx.font='bold 10px Orbitron,monospace';
      ctx.fillText('RF SENSOR',8,18);
      ctx.strokeStyle='rgba(0,255,200,0.4)';ctx.lineWidth=1;
      ctx.beginPath();ctx.arc(25,35,8,0,Math.PI*2);ctx.stroke();
      for(var a=0;a<3;a++){
        ctx.beginPath();ctx.arc(25,35,14+a*7,-0.5,0.5);ctx.stroke();
      }

      /* temperature scale bar */
      var scaleX=W-30,scaleY=20,scaleH=viewH-40;
      for(var sy=0;sy<scaleH;sy++){
        var stmp=45-(sy/scaleH)*30;
        ctx.fillStyle=thermalColor(stmp);ctx.fillRect(scaleX,scaleY+sy,18,1);
      }
      ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.strokeRect(scaleX,scaleY,18,scaleH);
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('45\u00b0C',scaleX-25,scaleY+8);ctx.fillText('30\u00b0C',scaleX-25,scaleY+scaleH/2);ctx.fillText('15\u00b0C',scaleX-25,scaleY+scaleH);

      /* zone labels */
      ctx.fillStyle='rgba(0,255,200,0.3)';ctx.font='9px Orbitron,monospace';
      ctx.fillText('SENSOR SIDE',10,viewH-10);
      ctx.fillText('TARGET ZONE',W*0.65,viewH-10);

      /* ---- SECTION 2: Bottom-left — Temperature history ---- */
      var histX=10,histY=viewH+15,histW=W*0.55,histH=H-viewH-30;

      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(histX,histY,histW,histH);
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.strokeRect(histX,histY,histW,histH);

      /* push new data */
      var histEntry={t:t};
      targets.forEach(function(tgt,i){histEntry['t'+i]=tgt.temp;});
      histEntry.ambient=ambientT;
      timeHistory.push(histEntry);
      if(timeHistory.length>MAX_HISTORY)timeHistory.shift();

      /* draw temp traces */
      var colors=['#ff6633','#6699ff','#ffcc00'];
      targets.forEach(function(tgt,ti){
        ctx.beginPath();ctx.strokeStyle=colors[ti]||'#fff';ctx.lineWidth=1.5;
        for(var i=0;i<timeHistory.length;i++){
          var x=histX+5+(i/MAX_HISTORY)*histW*0.95;
          var v=timeHistory[i]['t'+ti]||ambientT;
          var y=histY+histH-(v-15)/30*histH;
          if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        ctx.stroke();
      });

      /* ambient line */
      var ambY=histY+histH-(ambientT-15)/30*histH;
      ctx.strokeStyle='rgba(100,200,255,0.2)';ctx.setLineDash([3,3]);ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(histX,ambY);ctx.lineTo(histX+histW,ambY);ctx.stroke();ctx.setLineDash([]);
      ctx.fillStyle='rgba(100,200,255,0.3)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('AMBIENT '+ambientT.toFixed(1)+'\u00b0C',histX+histW-100,ambY-3);

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('TEMPERATURE HISTORY',histX+5,histY+12);
      /* legend */
      targets.forEach(function(tgt,i){
        ctx.fillStyle=colors[i];ctx.fillRect(histX+5+i*100,histY+histH-14,10,3);
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='7px Orbitron,monospace';
        ctx.fillText(tgt.label,histX+18+i*100,histY+histH-10);
      });

      /* ---- SECTION 3: Bottom-right — Detection stats ---- */
      var statX=histX+histW+15,statY=histY,statW=W-statX-15,statH=histH;
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(statX,statY,statW,statH);
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.strokeRect(statX,statY,statW,statH);

      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText('DETECTION STATUS',statX+10,statY+16);

      /* detection confidence */
      var conf=showWallV?(62+Math.sin(t*2)*8):(94+Math.sin(t*3)*3);
      ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('Targets: '+targets.length,statX+10,statY+35);
      ctx.fillText('Wall: '+(showWallV?'ACTIVE':'REMOVED'),statX+10,statY+50);
      ctx.fillText('Confidence: '+conf.toFixed(0)+'%',statX+10,statY+65);
      ctx.fillText('Range: '+(showWallV?'5m':'2m'),statX+10,statY+80);
      ctx.fillText('Ambient: '+ambientT.toFixed(1)+'\u00b0C',statX+10,statY+95);

      /* confidence bar */
      var barY=statY+110;
      ctx.fillStyle='rgba(255,255,255,0.06)';ctx.fillRect(statX+10,barY,statW-20,14);
      var confColor=conf>80?'#33ff33':conf>60?'#ffcc00':'#ff3333';
      ctx.fillStyle=confColor;ctx.fillRect(statX+10,barY,(statW-20)*conf/100,14);
      ctx.fillStyle='#fff';ctx.font='bold 8px Orbitron,monospace';
      ctx.fillText(conf.toFixed(0)+'%',statX+statW/2-10,barY+11);

      /* target temp readouts */
      targets.forEach(function(tgt,i){
        var ty=barY+25+i*30;
        ctx.fillStyle=colors[i];ctx.beginPath();ctx.arc(statX+18,ty+5,4,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.6)';ctx.font='9px Orbitron,monospace';
        ctx.fillText(tgt.label,statX+28,ty+3);
        ctx.fillStyle='#fff';ctx.font='bold 11px Orbitron,monospace';
        ctx.fillText(tgt.temp.toFixed(1)+'\u00b0C',statX+28,ty+18);
      });

      /* ---- HUD ---- */
      ctx.strokeStyle='rgba(255,80,0,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl=18;ctx.strokeStyle='rgba(255,80,0,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl,c[1]);ctx.stroke();
      });
      /* live dot */
      ctx.fillStyle='rgba(255,80,0,'+(0.4+Math.sin(t*4)*0.3)+')';
      ctx.beginPath();ctx.arc(W-20,14,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='8px Orbitron,monospace';ctx.fillText('THERMAL',W-70,17);

      /* dividers */
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(0,viewH+8);ctx.lineTo(W,viewH+8);ctx.stroke();

      requestAnimationFrame(frame);
    }

    /* click to add target */
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(W/rect.width);
      var my=(e.clientY-rect.top)*(H/rect.height);
      if(my<H*0.6&&mx>W*0.5){
        targets.push({x:mx,y:my,vx:(Math.random()-0.5)*0.8,vy:(Math.random()-0.5)*0.5,temp:36.5+Math.random()*1.5,size:18+Math.random()*8,label:'Person '+(targets.length+1)});
      }
      /* click wall to toggle */
      if(mx>wallX-10&&mx<wallX+wallW+10&&my<H*0.6){showWallV=!showWallV;}
    });

    /* auto-emit RF */
    setInterval(emitPulse,600);

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootThermalViz);
  else setTimeout(bootThermalViz,200);
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
