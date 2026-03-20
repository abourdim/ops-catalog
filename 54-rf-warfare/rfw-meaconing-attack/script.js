/**
 * Workshop DIY — Meaconing Attack v1.2
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);}}

const LANG={
  en:{title:'Meaconing Attack',subtitle:'Meaconing Attack Sim',disconnected:'Idle',connected:'Meaconing',mainSection:'Meaconing Attack Simulator',mainDesc:'Capture, delay, and rebroadcast navigation signals',sectionA:'Captured Signals',sectionB:'Meaconing Theory',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Set capture gain and rebroadcast power.',howto_2:'Configure propagation delay.',howto_3:'Capture signals first.',howto_4:'Start meaconing to rebroadcast.',working:'Working...',ready:'Meaconing Sim ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startMeacon:'Start Meaconing',stopMeacon:'Stop Meaconing',captureSignals:'Capture Signals',resetSim:'Reset',captureParams:'Capture Settings',delayParams:'Delay Settings',captureGain:'Capture Gain (dB):',rebroadcastPower:'Rebroadcast (dBm):',propDelay:'Propagation Delay (us):',numSignals:'Signals Captured:',meaconStatus:'Meaconing Status',signalHint:'Captured navigation signals being rebroadcast.',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF warfare! 🔬 You get to experiment with electronic warfare signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real electronic warfare signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real electromagnetic combat techniques! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Rfw Gps Spoofing Sim and Rfw Comms Interception Hub! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next'},
  fr:{title:'Attaque Meaconing',subtitle:'Sim Attaque Meaconing',disconnected:'Inactif',connected:'Meaconing',mainSection:'Simulateur Attaque Meaconing',mainDesc:'Capturer, retarder et retransmettre les signaux de navigation',sectionA:'Signaux Captures',sectionB:'Theorie Meaconing',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Definir gain et puissance.',howto_2:'Configurer le delai.',howto_3:'Capturer les signaux.',howto_4:'Demarrer le meaconing.',working:'En cours...',ready:'Sim pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startMeacon:'Demarrer Meaconing',stopMeacon:'Arreter Meaconing',captureSignals:'Capturer Signaux',resetSim:'Reinitialiser',captureParams:'Parametres Capture',delayParams:'Parametres Delai',captureGain:'Gain Capture (dB):',rebroadcastPower:'Retransmission (dBm):',propDelay:'Delai (us):',numSignals:'Signaux Captures:',meaconStatus:'Statut Meaconing',signalHint:'Signaux captures et retransmis.',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF warfare ! 🔬 Tu peux expérimenter avec electronic warfare signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais electronic warfare signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai electromagnetic combat techniques ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Rfw Gps Spoofing Sim and Rfw Comms Interception Hub ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv'},
  ar:{title:'\u0647\u062c\u0648\u0645 \u0627\u0644\u0645\u064a\u0643\u0648\u0646\u064a\u0646\u062c',subtitle:'\u0645\u062d\u0627\u0643\u064a \u0647\u062c\u0648\u0645 \u0627\u0644\u0645\u064a\u0643\u0648\u0646\u064a\u0646\u062c',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u0645\u064a\u0643\u0648\u0646\u064a\u0646\u062c',mainSection:'\u0645\u062d\u0627\u0643\u064a \u0647\u062c\u0648\u0645 \u0627\u0644\u0645\u064a\u0643\u0648\u0646\u064a\u0646\u062c',mainDesc:'\u0627\u0644\u062a\u0642\u0627\u0637 \u0648\u062a\u0623\u062e\u064a\u0631 \u0648\u0625\u0639\u0627\u062f\u0629 \u0628\u062b \u0625\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u0645\u0644\u0627\u062d\u0629',sectionA:'\u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a \u0627\u0644\u0645\u0644\u062a\u0642\u0637\u0629',sectionB:'\u0646\u0638\u0631\u064a\u0629 \u0627\u0644\u0645\u064a\u0643\u0648\u0646\u064a\u0646\u062c',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0627\u0644\u0645\u062d\u0627\u0643\u064a \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startMeacon:'\u0628\u062f\u0621 \u0627\u0644\u0645\u064a\u0643\u0648\u0646\u064a\u0646\u062c',stopMeacon:'\u0625\u064a\u0642\u0627\u0641',captureSignals:'\u0627\u0644\u062a\u0642\u0627\u0637 \u0627\u0644\u0625\u0634\u0627\u0631\u0627\u062a',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF warfare! 🔬 يمكنك التجربة مع electronic warfare signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج electronic warfare signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا electromagnetic combat techniques حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Rfw Gps Spoofing Sim and Rfw Comms Interception Hub! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='meacon-log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function initPanels(){const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');if(langSel)langSel.onchange=()=>setLanguage(langSel.value);if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});}

/* ═══════ MEACONING DATA ═══════ */
let meaconing=false,captured=false,time=0;
let signals=[];let delayHistory=new Array(200).fill(0);

function initSignals(){signals=[];for(let i=0;i<12;i++){signals.push({id:'NAV-'+(i+1),freq:1575.42+Math.random()*10-5,power:-130+Math.random()*20,captured:false,delayed:0,phase:Math.random()*Math.PI*2,orbitAngle:Math.random()*360,elevation:20+Math.random()*60});}}

function drawMeacon(){
  const c=$('meaconCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const cx=W/2,cy=H/2,R=Math.min(W,H)/2-40;
  // Sky grid
  for(let i=1;i<=3;i++){ctx.beginPath();ctx.arc(cx,cy,R*i/3,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.12)';ctx.lineWidth=1;ctx.stroke();}
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.stroke();

  const sigCount=parseInt($('sigCountInput')?.value||6);
  const delay=parseInt($('delayInput')?.value||200);
  const rebroadcast=parseInt($('rebroadcastInput')?.value||5);

  // Satellites
  signals.forEach((sig,i)=>{
    sig.orbitAngle+=0.15;if(sig.orbitAngle>360)sig.orbitAngle-=360;
    const az=sig.orbitAngle*Math.PI/180;const elR=(90-sig.elevation)/90;
    const sx=cx+Math.sin(az)*elR*R;const sy=cy-Math.cos(az)*elR*R;
    const isCaptured=captured&&i<sigCount;sig.captured=isCaptured;

    // Signal line from sat to receiver
    if(isCaptured){
      ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(cx,cy);
      ctx.strokeStyle='rgba(0,200,255,0.3)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
    }

    ctx.beginPath();ctx.arc(sx,sy,isCaptured?6:4,0,Math.PI*2);
    ctx.fillStyle=isCaptured?'rgba(0,200,255,0.9)':'rgba(100,100,100,0.5)';ctx.fill();
    ctx.fillStyle=isCaptured?'#66ccff':'#666';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(sig.id,sx,sy-10);
  });

  // Meaconing station (center)
  ctx.beginPath();ctx.arc(cx,cy,12,0,Math.PI*2);
  ctx.fillStyle=meaconing?'rgba(255,50,50,0.9)':captured?'rgba(255,200,0,0.8)':'rgba(0,255,136,0.6)';ctx.fill();
  ctx.fillStyle='#fff';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('MEACON',cx,cy+22);

  // Rebroadcast waves
  if(meaconing){
    for(let r=1;r<=4;r++){
      const rad=30+r*25+Math.sin(time*3)*5;
      ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,50,50,'+(0.4-r*0.08)+')';ctx.lineWidth=2;ctx.stroke();
    }
    // Victim receiver
    const vx=cx+180,vy=cy+80;
    ctx.beginPath();ctx.arc(vx,vy,8,0,Math.PI*2);ctx.fillStyle='rgba(255,200,0,0.8)';ctx.fill();
    ctx.fillStyle='#ffcc00';ctx.font='9px Orbitron,monospace';ctx.fillText('VICTIM',vx,vy-12);
    // Delayed signal line
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(vx,vy);ctx.strokeStyle='rgba(255,50,50,0.5)';ctx.lineWidth=2;ctx.setLineDash([6,3]);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(255,100,100,0.6)';ctx.font='8px Orbitron,monospace';ctx.fillText('+'+delay+'us delay',cx+90,cy+30);
  }

  ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('MEACONING — SIGNAL RELAY VIEW',10,18);
  if(meaconing){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('REBROADCASTING — '+rebroadcast+' dBm',10,34);}
}

function drawDelay(){
  const c=$('delayCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const delay=parseInt($('delayInput')?.value||200);
  const newVal=meaconing?delay+Math.random()*50-25:Math.random()*10;
  delayHistory.push(newVal);if(delayHistory.length>200)delayHistory.shift();
  ctx.beginPath();delayHistory.forEach((v,i)=>{const x=i*(W/200);const y=H-10-v/1200*H*0.8;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=meaconing?'rgba(255,100,100,0.8)':'rgba(0,200,255,0.5)';ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('SIGNAL DELAY (microseconds)',5,14);
}

function animate(){time+=0.016;drawMeacon();drawDelay();updateStats();requestAnimationFrame(animate);}

function updateStats(){const stats=$('meaconStats');if(!stats)return;const capturedCount=signals.filter(s=>s.captured).length;stats.innerHTML='<b>Captured:</b> '+capturedCount+' signals<br><b>Delay:</b> '+$('delayInput')?.value+' us<br><b>Rebroadcast:</b> '+$('rebroadcastInput')?.value+' dBm<br><b>Status:</b> '+(meaconing?'<span style="color:#ff4444">MEACONING</span>':captured?'<span style="color:#ffcc00">CAPTURED</span>':'<span style="color:#00cc88">STANDBY</span>');}

function updateSignalList(){const lib=$('signalList');if(!lib)return;lib.innerHTML='';signals.forEach(s=>{const row=document.createElement('div');row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+(s.captured?'rgba(0,200,255,0.08)':'rgba(100,100,100,0.05)');row.innerHTML='<span style="color:'+(s.captured?'#66ccff':'#666')+'">'+s.id+'</span><span>'+s.freq.toFixed(2)+' MHz</span><span>'+s.power.toFixed(0)+' dBm</span><span style="color:'+(s.captured?'#00cc88':'#666')+'">'+(s.captured?'CAPTURED':'---')+'</span>';lib.appendChild(row);});}

function initTechDatabase(){const db=$('techDatabase');if(!db)return;db.innerHTML=['<b>Meaconing:</b> Interception and rebroadcast of navigation signals with added delay.','<b>Delay Injection:</b> Adding propagation delay causes position errors in receivers.','<b>High-Gain Capture:</b> Directional antennas capture weak satellite signals.','<b>Amplified Rebroadcast:</b> Signals rebroadcast at higher power than originals.','<b>Position Drift:</b> Gradually increasing delay causes slow position drift.','<b>Multi-Signal Attack:</b> Capturing multiple satellites enables full position control.'].join('<br><br>');}

function initControls(){
  $('gainInput').oninput=()=>{$('gainLabel').textContent=$('gainInput').value+' dB';};
  $('rebroadcastInput').oninput=()=>{$('rebroadcastLabel').textContent=$('rebroadcastInput').value+' dBm';};
  $('delayInput').oninput=()=>{$('delayLabel').textContent=$('delayInput').value+' us';};
  $('sigCountInput').oninput=()=>{$('sigCountLabel').textContent=$('sigCountInput').value;};
  $('meaconBtn').onclick=()=>{if(!captured){showToast('Capture signals first!',1500);return;}meaconing=!meaconing;setStatus(meaconing);$('meaconBtn').querySelector('[data-i18n]').textContent=meaconing?LANG[currentLang].stopMeacon:LANG[currentLang].startMeacon;log(meaconing?'MEACONING STARTED — rebroadcasting with '+$('delayInput').value+'us delay':'MEACONING STOPPED',meaconing?'error':'info');if(meaconing)showToast('Meaconing active...',2000);};
  $('captureBtn').onclick=()=>{captured=true;const n=parseInt($('sigCountInput').value);signals.forEach((s,i)=>s.captured=i<n);log('Captured '+n+' navigation signals','rx');playSound('success');};
  $('resetBtn').onclick=()=>{meaconing=false;captured=false;setStatus(false);initSignals();delayHistory=new Array(200).fill(0);$('meaconBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].startMeacon;log('Reset','info');playSound('click');};
}

document.addEventListener('DOMContentLoaded',()=>{
  initSplash();initPanels();initLogFilters();initSignals();initTechDatabase();initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');animate();setInterval(updateSignalList,1000);
});

/* ═══════ ENHANCED RF CANVAS — MEACONING ATTACK ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _posErrorTrail=[];let _delayCorrelation=new Array(200).fill(0);
let _signalCompare=[];let _driftHistory=new Array(200).fill(0);

/* ── Position Drift Trail Map ── */
function drawPositionDrift(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('VICTIM POSITION DRIFT MAP',5,12);
  const cx=W/2,cy=H/2;const R=Math.min(W,H)/2-25;
  for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(cx,cy,R*i/4,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.lineWidth=1;ctx.stroke();}
  const isMeacon=typeof meaconing!=='undefined'&&meaconing;
  const delay=parseInt(_$('delayInput')?.value||200);
  // True position
  ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.8)';ctx.fill();
  ctx.fillStyle='rgba(0,200,255,0.5)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('TRUE POS',cx,cy+15);
  if(isMeacon){
    const drift=delay*0.3;const driftAngle=_t*0.2;
    const dx=Math.cos(driftAngle)*drift*0.3;const dy=Math.sin(driftAngle)*drift*0.2;
    _posErrorTrail.push({x:cx+dx+Math.random()*5,y:cy+dy+Math.random()*5});
    if(_posErrorTrail.length>100)_posErrorTrail.shift();
    // Trail
    _posErrorTrail.forEach((p,i)=>{
      const alpha=i/_posErrorTrail.length;
      ctx.beginPath();ctx.arc(p.x,p.y,2,0,Math.PI*2);
      ctx.fillStyle='rgba(255,80,80,'+alpha*0.6+')';ctx.fill();
    });
    // Current spoofed position
    const last=_posErrorTrail[_posErrorTrail.length-1];
    if(last){ctx.beginPath();ctx.arc(last.x,last.y,8,0,Math.PI*2);
      ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fill();
      ctx.beginPath();ctx.arc(last.x,last.y,14+Math.sin(_t*4)*4,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,50,50,0.4)';ctx.lineWidth=2;ctx.stroke();
      ctx.fillStyle='rgba(255,50,50,0.6)';ctx.font='8px Orbitron,monospace';ctx.fillText('SPOOFED',last.x,last.y-14);
      // Error line
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(last.x,last.y);
      ctx.strokeStyle='rgba(255,200,0,0.5)';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
      const errM=(Math.sqrt((last.x-cx)**2+(last.y-cy)**2)*2).toFixed(0);
      ctx.fillStyle='rgba(255,200,0,0.6)';ctx.fillText(errM+'m error',(cx+last.x)/2,(cy+last.y)/2-8);
    }
    // Scale labels
    [50,100,200].forEach(m=>{const pr=m/(delay*0.6)*R;
      ctx.fillStyle='rgba(255,255,255,0.15)';ctx.font='7px Orbitron,monospace';ctx.fillText(m+'m',cx+pr+3,cy);});
  }
}

/* ── Signal Delay Correlation ── */
function drawDelayCorrelation(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('CROSS-CORRELATION — ORIGINAL vs MEACONED',5,12);
  const isMeacon=typeof meaconing!=='undefined'&&meaconing;
  const delay=parseInt(_$('delayInput')?.value||200);
  // Generate correlation function
  ctx.beginPath();
  for(let x=0;x<W;x++){
    const tau=(x/W-0.5)*1000;// -500 to +500 us
    let corr=Math.exp(-tau*tau/2000);// Original peak at 0
    if(isMeacon)corr+=0.7*Math.exp(-(tau-delay)*(tau-delay)/3000);// Meaconed peak at delay
    const y=H-10-(corr)*(H-30);
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle='rgba(0,200,255,0.7)';ctx.lineWidth=1.5;ctx.stroke();
  // Zero line
  ctx.beginPath();ctx.moveTo(0,H-10);ctx.lineTo(W,H-10);ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=1;ctx.stroke();
  // Markers
  ctx.beginPath();ctx.moveTo(W/2,20);ctx.lineTo(W/2,H-10);ctx.strokeStyle='rgba(0,255,136,0.3)';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';ctx.fillText('τ=0',W/2,H-1);
  if(isMeacon){const delayX=W/2+(delay/1000)*W;
    ctx.beginPath();ctx.moveTo(delayX,20);ctx.lineTo(delayX,H-10);ctx.strokeStyle='rgba(255,50,50,0.5)';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(255,50,50,0.5)';ctx.fillText('τ='+delay+'μs',delayX,H-1);}
}

/* ── Navigation Accuracy Degradation ── */
function drawAccuracyDegradation(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('NAVIGATION ACCURACY DEGRADATION',5,12);
  const isMeacon=typeof meaconing!=='undefined'&&meaconing;
  const delay=parseInt(_$('delayInput')?.value||200);
  const drift=isMeacon?Math.min(500,delay*0.8+_t*2+Math.random()*10):Math.random()*3;
  _driftHistory.push(drift);if(_driftHistory.length>200)_driftHistory.shift();
  // Background zones
  ctx.fillStyle='rgba(255,50,50,0.04)';ctx.fillRect(0,20,W,(H-30)*0.3);
  ctx.fillStyle='rgba(255,200,0,0.04)';ctx.fillRect(0,20+(H-30)*0.3,W,(H-30)*0.35);
  ctx.fillStyle='rgba(0,200,100,0.04)';ctx.fillRect(0,20+(H-30)*0.65,W,(H-30)*0.35);
  ctx.beginPath();
  _driftHistory.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/500)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=drift>200?'rgba(255,50,50,0.8)':drift>50?'rgba(255,200,0,0.7)':'rgba(0,200,100,0.6)';
  ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle=drift>200?'rgba(255,50,50,0.7)':'rgba(255,200,0,0.7)';ctx.font='12px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText(drift.toFixed(0)+'m',W-10,30);
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('0m',3,H-8);ctx.fillText('500m',3,23);
}

/* ── Signal Capture Chain Diagram ── */
function drawCaptureChain(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('MEACONING SIGNAL CHAIN',5,12);
  const stages=['SAT Signal','High-Gain\nCapture','Amplify','Delay\nInjection','Rebroadcast','Victim\nReceiver'];
  const isMeacon=typeof meaconing!=='undefined'&&meaconing;
  const isCap=typeof captured!=='undefined'&&captured;
  const stageW=Math.min(80,(W-20)/stages.length-10);
  stages.forEach((s,i)=>{
    const x=10+i*(stageW+10);const y=H/2-15;
    const isActive=(isCap&&i<=2)||(isMeacon&&i<=5);
    ctx.fillStyle=isActive?'rgba(0,200,255,0.15)':'rgba(50,50,50,0.2)';
    ctx.fillRect(x,y,stageW,30);ctx.strokeStyle=isActive?'rgba(0,200,255,0.5)':'rgba(100,100,100,0.3)';
    ctx.lineWidth=1;ctx.strokeRect(x,y,stageW,30);
    if(isActive&&isMeacon){ctx.fillStyle='rgba(0,200,255,0.1)';
      const pulse=Math.sin(_t*4+i)*3;ctx.fillRect(x-pulse,y-pulse,stageW+pulse*2,30+pulse*2);}
    ctx.fillStyle=isActive?'rgba(0,255,136,0.7)':'rgba(100,100,100,0.4)';
    ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
    const lines=s.split('\n');lines.forEach((l,li)=>ctx.fillText(l,x+stageW/2,y+12+li*9));
    if(i<stages.length-1){ctx.beginPath();ctx.moveTo(x+stageW+2,H/2);ctx.lineTo(x+stageW+8,H/2);
      ctx.strokeStyle=isActive?'rgba(0,200,255,0.5)':'rgba(100,100,100,0.2)';ctx.lineWidth=2;ctx.stroke();
      ctx.beginPath();ctx.moveTo(x+stageW+6,H/2-3);ctx.lineTo(x+stageW+10,H/2);ctx.lineTo(x+stageW+6,H/2+3);
      ctx.fillStyle=isActive?'rgba(0,200,255,0.5)':'rgba(100,100,100,0.2)';ctx.fill();}
  });
}

function enhancedRender(){
  _t+=0.016;
  const mc=_$('meaconCanvas');
  if(mc){const ctx=mc.getContext('2d');drawPositionDrift(ctx,mc.width,mc.height);}
  const dc=_$('delayCanvas');
  if(dc){const ctx=dc.getContext('2d');const W=dc.width,H=dc.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawAccuracyDegradation(ctx,W,H);}
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
