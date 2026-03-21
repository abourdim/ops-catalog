/**
 * Workshop DIY — Satellite Injection Lab v1.2
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
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

const LANG={en:{
    ...LANG_BASE.en,title:'Satellite Injection Lab',subtitle:'Satellite Injection Lab',disconnected:'Idle',connected:'Injecting',ready:'Satellite Injection Lab ready!',langChanged:'English',themeChanged:'Theme:',logCleared:'Log cleared',copied:'Copied!',copyFail:'Fail',working:'Working...',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What is Satellite Injection Lab?',faq_a1:'Satellite Injection Lab lets you satellite injection lab. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'First you scan the electromagnetic spectrum to identify hostile rf emissions. Then you analyze the threat signal: frequency, power, modulation, and direction.',faq_q3:'What do the controls do?',faq_a3:'Click Start to begin the simulation. Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'This uses real electronic warfare principles.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Rfw Anti Drone System and Rfw Cognitive Ew. Each app in this category teaches a different aspect of electronic warfare.',demo_s1:'Welcome to Satellite Injection Lab! Look at the main display — this is where the electronic warfare simulation runs.',demo_s2:'Click Start to begin. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "the first section" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of electronic warfare.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how electronic warfare works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches electronic warfare concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "Analysis" and "Data" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},fr:{title:'Labo Injection Satellite',subtitle:'Labo Injection Satellite',disconnected:'Inactif',connected:'Injection',ready:'Labo pret!',langChanged:'Francais',themeChanged:'Theme:',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',working:'En cours...',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF warfare ! 🔬 Tu peux expérimenter avec electronic warfare signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais electronic warfare signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai electromagnetic combat techniques ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Rfw Imsi Catcher Sim and Rfw Electronic Warfare Sim ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},ar:{title:'\u0645\u062e\u062a\u0628\u0631 \u062d\u0642\u0646 \u0627\u0644\u0623\u0642\u0645\u0627\u0631',subtitle:'\u0645\u062e\u062a\u0628\u0631 \u062d\u0642\u0646 \u0627\u0644\u0623\u0642\u0645\u0627\u0631',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u062d\u0642\u0646',ready:'\u062c\u0627\u0647\u0632!',langChanged:'\u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0645\u0638\u0647\u0631:',logCleared:'\u062a\u0645',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',working:'\u062c\u0627\u0631\u064d...',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF warfare! 🔬 يمكنك التجربة مع electronic warfare signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج electronic warfare signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا electromagnetic combat techniques حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Rfw Imsi Catcher Sim and Rfw Electronic Warfare Sim! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}};
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(s[k]!=null)e.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+n,'info');}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+t;d.textContent='['+new Date().toLocaleTimeString()+'] '+m;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(on){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=on?s.connected:s.disconnected;if(p)p.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initPanels(){const hB=$('helpBtn'),hC=$('helpCloseBtn'),hP=$('helpPanel'),hO=$('helpOverlay'),sB=$('settingsBtn'),sC=$('settingsCloseBtn'),sP=$('settingsPanel'),sO=$('settingsOverlay'),lB=$('logBtn'),lC=$('logCloseBtn'),lP=$('logPanel');if(hB)hB.onclick=()=>{hP.classList.toggle('open');hO.classList.toggle('active');};if(hC)hC.onclick=()=>{hP.classList.remove('open');hO.classList.remove('active');};if(hO)hO.onclick=()=>{hP.classList.remove('open');hO.classList.remove('active');};if(sB)sB.onclick=()=>{sP.classList.toggle('open');sO.classList.toggle('active');};if(sC)sC.onclick=()=>{sP.classList.remove('open');sO.classList.remove('active');};if(sO)sO.onclick=()=>{sP.classList.remove('open');sO.classList.remove('active');};if(lB)lB.onclick=()=>lP.classList.toggle('open');if(lC)lC.onclick=()=>lP.classList.remove('open');const ls=$('langSelect'),ts=$('themeSelect'),st=$('soundToggle');if(ls)ls.onchange=()=>setLanguage(ls.value);if(ts)ts.onchange=()=>setTheme(ts.value);if(st)st.onchange=()=>{soundEnabled=st.checked;};if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const tg=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tg)tg.classList.add('active');});});}

/* ═══════ SATELLITE SIM ═══════ */
let injecting=false,time=0,transponders=[];
function initTransponders(){transponders=[];for(let i=0;i<24;i++)transponders.push({id:'TP-'+(i+1),freq:10.7+i*0.05,bw:36,power:-80+Math.random()*20,injected:false,usage:Math.random()*100});}

function drawSatView(){
  const c=$('satCanvas');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // Earth
  ctx.beginPath();ctx.arc(W/2,H+200,280,0,Math.PI*2);ctx.fillStyle='rgba(0,80,160,0.15)';ctx.fill();ctx.strokeStyle='rgba(0,150,255,0.2)';ctx.stroke();
  // Satellite
  const sx=W/2,sy=80;
  ctx.fillStyle='rgba(200,200,220,0.9)';ctx.fillRect(sx-15,sy-5,30,10);
  ctx.fillStyle='rgba(50,100,200,0.7)';ctx.fillRect(sx-40,sy-3,25,6);ctx.fillRect(sx+15,sy-3,25,6);
  ctx.beginPath();ctx.arc(sx,sy,4,0,Math.PI*2);ctx.fillStyle=injecting?'#ff4444':'#00cc88';ctx.fill();
  // Uplink beam from ground
  const gx=W/2-200,gy=H-40;
  ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(sx-30,sy+15);ctx.lineTo(sx+30,sy+15);ctx.closePath();
  ctx.fillStyle='rgba(0,200,255,0.05)';ctx.fill();ctx.strokeStyle='rgba(0,200,255,0.2)';ctx.lineWidth=1;ctx.stroke();
  // Injector beam
  if(injecting){
    const ix=W/2+200,iy=H-40;
    ctx.beginPath();ctx.moveTo(ix,iy);ctx.lineTo(sx-20,sy+15);ctx.lineTo(sx+20,sy+15);ctx.closePath();
    ctx.fillStyle='rgba(255,50,50,0.08)';ctx.fill();ctx.strokeStyle='rgba(255,50,50,0.4)';ctx.lineWidth=2;ctx.stroke();
    // Pulse
    const pr=20+Math.sin(time*4)*8;
    ctx.beginPath();ctx.arc(sx,sy,pr,0,Math.PI*2);ctx.strokeStyle='rgba(255,50,50,0.3)';ctx.stroke();
    ctx.fillStyle='rgba(255,50,50,0.6)';ctx.font='10px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('INJECTION',ix,iy-10);
  }
  // Downlink beams
  const tpIdx=parseInt($('transponder')?.value||8)-1;
  for(let i=0;i<3;i++){
    const dx=200+i*200,dy=H-30;
    ctx.beginPath();ctx.moveTo(sx,sy+8);ctx.lineTo(dx-20,dy);ctx.lineTo(dx+20,dy);ctx.closePath();
    const isInj=injecting&&i===1;
    ctx.fillStyle=isInj?'rgba(255,50,50,0.04)':'rgba(0,255,136,0.03)';ctx.fill();
    ctx.beginPath();ctx.arc(dx,dy,5,0,Math.PI*2);ctx.fillStyle=isInj?'#ff4444':'#00cc88';ctx.fill();
    ctx.fillStyle=isInj?'#ff6666':'#66ffaa';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(isInj?'HIJACKED':'RX-'+i,dx,dy+14);
  }
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='11px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('SATELLITE LINK — '+($('satTarget')?.value||'GEO-SAT').toUpperCase(),8,16);
  if(injecting){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('TRANSPONDER INJECTION ACTIVE — TP-'+($('transponder')?.value||8),8,32);}
}

function drawSpecView(){
  const c=$('specCanvas');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const tpIdx=parseInt($('transponder')?.value||8)-1;
  ctx.beginPath();
  for(let x=0;x<W;x++){
    const tp=Math.floor(x/W*24);let y=H*0.7+Math.random()*3;
    if(transponders[tp])y=H*(1-transponders[tp].usage/200);
    if(injecting&&tp===tpIdx)y=H*0.1+Math.random()*H*0.15;
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle=injecting?'rgba(255,80,80,0.6)':'rgba(0,200,255,0.5)';ctx.lineWidth=1.5;ctx.stroke();
  // Transponder markers
  for(let i=0;i<24;i++){const x=i/24*W+W/48;ctx.fillStyle=(injecting&&i===tpIdx)?'rgba(255,50,50,0.5)':'rgba(0,200,255,0.2)';ctx.fillRect(x-1,H-8,2,8);}
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='10px Orbitron,monospace';ctx.fillText('TRANSPONDER SPECTRUM — 24 TP',5,14);
}

function animate(){time+=0.016;drawSatView();drawSpecView();updateInfo();requestAnimationFrame(animate);}
function updateInfo(){const s=$('infoStats');if(!s)return;const eirp=$('eirp')?.value||50;const freq=$('uplinkFreq')?.value||14;const fsl=(20*Math.log10(35786)+20*Math.log10(freq*1e9)+20*Math.log10(4*Math.PI/3e8)).toFixed(1);s.innerHTML='<b>Uplink:</b> '+freq+' GHz<br><b>EIRP:</b> '+eirp+' dBW<br><b>FSL:</b> '+fsl+' dB<br><b>TP:</b> '+($('transponder')?.value||8)+'/24<br><b>Status:</b> '+(injecting?'<span style="color:#ff4444">INJECTING</span>':'<span style="color:#00cc88">STANDBY</span>');}

function updateLibrary(){const lib=$('libraryList');if(!lib)return;lib.innerHTML='';const tpIdx=parseInt($('transponder')?.value||8)-1;transponders.forEach((tp,i)=>{tp.injected=injecting&&i===tpIdx;const r=document.createElement('div');r.style.cssText='display:flex;justify-content:space-between;padding:2px 6px;border-radius:4px;font-size:.75rem;background:'+(tp.injected?'rgba(255,50,50,0.08)':'rgba(0,200,255,0.03)');r.innerHTML='<span style="color:'+(tp.injected?'#ff6666':'#66ccff')+'">'+tp.id+'</span><span>'+tp.freq.toFixed(2)+' GHz</span><span>'+tp.bw+' MHz BW</span><span style="color:'+(tp.injected?'#ff4444':'#00cc88')+'">'+(tp.injected?'INJECTED':'NORMAL')+'</span>';lib.appendChild(r);});}

function initControls(){
  $('uplinkFreq').oninput=()=>{$('uplinkLabel').textContent=$('uplinkFreq').value+' GHz';};
  $('eirp').oninput=()=>{$('eirpLabel').textContent=$('eirp').value+' dBW';};
  $('transponder').oninput=()=>{$('transpLabel').textContent='TP-'+$('transponder').value;};
  $('startBtn').onclick=()=>{injecting=!injecting;setStatus(injecting);$('startBtn').querySelector('span:last-child').textContent=injecting?'Stop Injection':'Inject Signal';log(injecting?'INJECTION ACTIVE on TP-'+$('transponder').value+' @ '+$('uplinkFreq').value+' GHz':'Injection stopped',injecting?'tx':'info');};
  $('analyzeBtn').onclick=()=>{showToast('Scanning transponders...',1500);setTimeout(()=>{log('Scan: 24 transponders detected, '+(injecting?'1 compromised':'all clean'),'success');hideToast();},1500);};
  $('resetBtn').onclick=()=>{injecting=false;setStatus(false);initTransponders();log('Reset','info');};
}
function initRefDB(){const db=$('refDatabase');if(!db)return;db.innerHTML=['<b>Uplink Injection:</b> Overpower legitimate uplink with stronger signal.','<b>Transponder Hijacking:</b> Capture satellite transponder for unauthorized broadcast.','<b>Cross-pol Isolation:</b> Exploit polarization leakage for covert injection.','<b>Carrier-in-Carrier:</b> Hide injected signal within legitimate carrier.','<b>Orbital Slot Spoofing:</b> Mimic satellite from adjacent orbital position.','<b>TT&C Exploitation:</b> Target telemetry and command channels.'].join('<br><br>');}

document.addEventListener('DOMContentLoaded',()=>{initSplash();initPanels();initLogFilters();initTransponders();initRefDB();initControls();try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}log(LANG[currentLang].ready,'success');animate();setInterval(updateLibrary,1000);});

/* ═══════ ENHANCED RF CANVAS — SATELLITE INJECTION ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _linkBudget=[];let _beamPattern=[];let _orbitalPath=[];
let _snrHistory=new Array(200).fill(10);

/* ── Link Budget Waterfall Chart ── */
function drawLinkBudget(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('SATELLITE LINK BUDGET (dB)',5,12);
  const eirp=parseInt(_$('eirp')?.value||50);
  const freq=parseFloat(_$('uplinkFreq')?.value||14);
  const fsl=20*Math.log10(35786)+20*Math.log10(freq*1e9)+20*Math.log10(4*Math.PI/3e8);
  const items=[{name:'EIRP',val:eirp,color:'#66ff88'},{name:'Free Space Loss',val:-fsl/5,color:'#ff6666'},{name:'Atmospheric',val:-2.5,color:'#ff9966'},{name:'Rain Fade',val:-1.5,color:'#ffcc00'},{name:'Antenna Gain',val:35,color:'#66ccff'},{name:'Pointing Loss',val:-0.8,color:'#ff8888'},{name:'Margin',val:3,color:'#00cc88'}];
  let cumulative=0;const barW=Math.max(30,(W-40)/items.length-6);
  items.forEach((item,i)=>{
    const x=20+i*(barW+6);const prev=cumulative;cumulative+=item.val;
    const startY=H-20-(prev+100)/200*(H-35);
    const endY=H-20-(cumulative+100)/200*(H-35);
    ctx.fillStyle=item.color.replace(')',',0.4)').replace('#','rgba(');
    const topY=Math.min(startY,endY);const bh=Math.abs(endY-startY);
    ctx.fillStyle=item.val>0?'rgba(0,200,100,0.4)':'rgba(255,80,80,0.4)';
    ctx.fillRect(x,topY,barW,bh||2);
    ctx.strokeStyle=item.val>0?'rgba(0,200,100,0.7)':'rgba(255,80,80,0.7)';
    ctx.lineWidth=1;ctx.strokeRect(x,topY,barW,bh||2);
    ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
    ctx.save();ctx.translate(x+barW/2,H-5);ctx.rotate(-0.3);ctx.fillText(item.name,0,0);ctx.restore();
    ctx.fillText((item.val>0?'+':'')+item.val.toFixed(1),x+barW/2,topY-3);
  });
}

/* ── Orbital Track View ── */
function drawOrbitalTrack(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('ORBITAL POSITION — GEO BELT',5,12);
  const cx=W/2,cy=H*0.65;const rx=W*0.4,ry=H*0.25;
  // Orbit ellipse
  ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);
  ctx.strokeStyle='rgba(0,200,255,0.2)';ctx.lineWidth=1;ctx.stroke();
  // Earth
  ctx.beginPath();ctx.arc(cx,cy,15,0,Math.PI*2);
  ctx.fillStyle='rgba(0,100,200,0.4)';ctx.fill();
  ctx.strokeStyle='rgba(0,150,255,0.3)';ctx.stroke();
  // Target satellite
  const satAngle=_t*0.02;
  const sx=cx+Math.cos(satAngle)*rx,sy=cy+Math.sin(satAngle)*ry;
  ctx.beginPath();ctx.arc(sx,sy,5,0,Math.PI*2);
  const isInj=typeof injecting!=='undefined'&&injecting;
  ctx.fillStyle=isInj?'rgba(255,50,50,0.9)':'rgba(0,255,136,0.8)';ctx.fill();
  ctx.fillStyle=isInj?'#ff6666':'#66ffaa';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
  ctx.fillText(_$('satTarget')?.value||'GEO-SAT',sx,sy-10);
  // Adjacent satellites
  for(let i=1;i<=3;i++){
    const a=satAngle+i*0.4;const ax=cx+Math.cos(a)*rx,ay=cy+Math.sin(a)*ry;
    ctx.beginPath();ctx.arc(ax,ay,3,0,Math.PI*2);ctx.fillStyle='rgba(100,100,100,0.5)';ctx.fill();
    const a2=satAngle-i*0.4;const bx=cx+Math.cos(a2)*rx,by=cy+Math.sin(a2)*ry;
    ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);ctx.fillStyle='rgba(100,100,100,0.5)';ctx.fill();
  }
  // Injection beam
  if(isInj){
    const gx=cx+100,gy=H-15;
    ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(sx,sy);
    ctx.strokeStyle='rgba(255,50,50,0.5)';ctx.lineWidth=2;ctx.setLineDash([6,3]);ctx.stroke();ctx.setLineDash([]);
    const pulse=8+Math.sin(_t*5)*4;
    ctx.beginPath();ctx.arc(sx,sy,pulse,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,50,50,0.4)';ctx.lineWidth=1;ctx.stroke();
  }
  // Ground station
  ctx.beginPath();ctx.arc(cx-100,H-15,4,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.7)';ctx.fill();
  ctx.fillStyle='rgba(0,200,255,0.5)';ctx.font='7px Orbitron,monospace';ctx.fillText('LEGIT GS',cx-100,H-3);
  if(isInj){ctx.beginPath();ctx.arc(cx+100,H-15,4,0,Math.PI*2);ctx.fillStyle='rgba(255,50,50,0.7)';ctx.fill();
    ctx.fillStyle='rgba(255,50,50,0.5)';ctx.fillText('ATTACKER',cx+100,H-3);}
}

/* ── SNR Monitor ── */
function drawSNRMonitor(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('TRANSPONDER SNR (dB)',5,12);
  const isInj=typeof injecting!=='undefined'&&injecting;
  const eirp=parseInt(_$('eirp')?.value||50);
  const newVal=isInj?5+eirp*0.3+Math.random()*8:12+Math.random()*3;
  _snrHistory.push(newVal);if(_snrHistory.length>200)_snrHistory.shift();
  ctx.beginPath();
  _snrHistory.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/50)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=isInj?'rgba(255,100,0,0.7)':'rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  // Threshold
  const thY=H-10-(8/50)*(H-25);
  ctx.beginPath();ctx.moveTo(0,thY);ctx.lineTo(W,thY);ctx.strokeStyle='rgba(255,200,0,0.4)';
  ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(255,200,0,0.4)';ctx.font='7px Orbitron,monospace';ctx.fillText('MIN LOCK',W-55,thY-3);
}

/* ── Beam Pattern Visualization ── */
function drawBeamPattern(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('ANTENNA BEAM PATTERN',5,12);
  const cx=W/2,cy=H-10;const R=H-25;
  // Main lobe
  ctx.beginPath();
  for(let a=-Math.PI/2-0.8;a<=-Math.PI/2+0.8;a+=0.02){
    const diff=a+Math.PI/2;const gain=Math.exp(-diff*diff*8)*R;
    const x=cx+Math.cos(a)*gain;const y=cy+Math.sin(a)*gain;
    if(a===-Math.PI/2-0.8)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle='rgba(0,200,255,0.6)';ctx.lineWidth=2;ctx.stroke();
  // Side lobes
  for(let sl=-3;sl<=3;sl++){
    if(sl===0)continue;
    ctx.beginPath();
    const slCenter=-Math.PI/2+sl*0.5;
    for(let a=slCenter-0.15;a<=slCenter+0.15;a+=0.01){
      const diff=a-slCenter;const gain=Math.exp(-diff*diff*80)*R*0.15;
      const x=cx+Math.cos(a)*gain;const y=cy+Math.sin(a)*gain;
      if(a===slCenter-0.15)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle='rgba(0,200,255,0.3)';ctx.lineWidth=1;ctx.stroke();
  }
  // Injector beam overlay
  if(typeof injecting!=='undefined'&&injecting){
    ctx.beginPath();
    for(let a=-Math.PI/2-0.6;a<=-Math.PI/2+0.6;a+=0.02){
      const diff=a+Math.PI/2-0.2;const gain=Math.exp(-diff*diff*10)*R*0.8;
      const x=cx+Math.cos(a)*gain;const y=cy+Math.sin(a)*gain;
      if(a===-Math.PI/2-0.6)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle='rgba(255,50,50,0.6)';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='rgba(255,50,50,0.5)';ctx.font='8px Orbitron,monospace';ctx.fillText('INJECTED BEAM',W-110,25);
  }
}

/* ── Transponder Loading Bar Chart ── */
function drawTPLoading(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('TRANSPONDER LOADING (%)',5,12);
  const isInj=typeof injecting!=='undefined'&&injecting;
  const tpIdx=parseInt(_$('transponder')?.value||8)-1;
  const barW=Math.max(6,(W-20)/24-2);
  for(let i=0;i<24;i++){
    const x=10+i*(barW+2);
    let load=(typeof transponders!=='undefined'&&transponders[i])?transponders[i].usage:50;
    if(isInj&&i===tpIdx)load=90+Math.random()*10;
    const bh=load/100*(H-30);
    const col=i===tpIdx&&isInj?'rgba(255,50,50,0.6)':load>80?'rgba(255,200,0,0.5)':'rgba(0,200,255,0.4)';
    ctx.fillStyle=col;ctx.fillRect(x,H-10-bh,barW,bh);
    if(i%4===0){ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='6px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('TP'+(i+1),x+barW/2,H-1);}
  }
}

function enhancedRender(){
  _t+=0.016;
  const satC=_$('satCanvas');
  if(satC){const ctx=satC.getContext('2d');drawOrbitalTrack(ctx,satC.width,satC.height);}
  const specC=_$('specCanvas');
  if(specC){const ctx=specC.getContext('2d');const W=specC.width,H=specC.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawSNRMonitor(ctx,W,H*0.5);ctx.save();ctx.translate(0,H*0.5);drawTPLoading(ctx,W,H*0.5);ctx.restore();}
  requestAnimationFrame(enhancedRender);
}
setTimeout(()=>{enhancedRender();},500);
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
