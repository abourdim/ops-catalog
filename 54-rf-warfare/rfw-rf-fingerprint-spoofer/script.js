/**
 * Workshop DIY — RF Fingerprint Spoofer v1.2
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={en:{title:'RF Fingerprint Spoofer',subtitle:'RF Fingerprint Spoofer',disconnected:'Idle',connected:'Spoofing',ready:'RF Fingerprint Spoofer ready!',langChanged:'English',themeChanged:'Theme:',logCleared:'Log cleared',copied:'Copied!',copyFail:'Fail',working:'Working...',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF warfare! 🔬 You get to experiment with electronic warfare signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real electronic warfare signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real electromagnetic combat techniques! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Rfw Spectrum Denial Lab and Rfw Comms Interception Hub! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',learnAge:'Ages:'},fr:{title:'Falsificateur d\'Empreinte RF',subtitle:'Falsificateur d\'Empreinte RF',disconnected:'Inactif',connected:'Spoofing',ready:'Pret!',langChanged:'Francais',themeChanged:'Theme:',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',working:'En cours...',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF warfare ! 🔬 Tu peux expérimenter avec electronic warfare signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais electronic warfare signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai electromagnetic combat techniques ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Rfw Spectrum Denial Lab and Rfw Comms Interception Hub ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},ar:{title:'\u0645\u0632\u064a\u0641 \u0627\u0644\u0628\u0635\u0645\u0629 RF',subtitle:'\u0645\u0632\u064a\u0641 \u0627\u0644\u0628\u0635\u0645\u0629 RF',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u062a\u0632\u064a\u064a\u0641',ready:'\u062c\u0627\u0647\u0632!',langChanged:'\u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0645\u0638\u0647\u0631:',logCleared:'\u062a\u0645',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',working:'\u062c\u0627\u0631\u064d...',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF warfare! 🔬 يمكنك التجربة مع electronic warfare signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج electronic warfare signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا electromagnetic combat techniques حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Rfw Spectrum Denial Lab and Rfw Comms Interception Hub! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Spectrum',learn1Desc:'How electromagnetic energy fills the battlefield',learn1Tag:'RF',learn2Title:'Electronic Attack',learn2Desc:'How jamming and spoofing disrupt enemy systems',learn2Tag:'EW',learn3Title:'Electronic Defense',learn3Desc:'How to protect communications from interference',learn3Tag:'Defense',learn4Title:'Signal Intelligence',learn4Desc:'How to intercept and analyze enemy transmissions',learn4Tag:'SIGINT',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}};
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(s[k]!=null)e.textContent=s[k];});document.title=s.title+' \u2014 Workshop DIY';document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l);}catch{}log(s.langChanged,'info');}
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

/* ═══════ FINGERPRINT SIM ═══════ */
let active=false,time=0;
let fingerprints=[];for(let i=0;i<16;i++)fingerprints.push({freq:i,orig:20+Math.random()*200,phase:Math.random()*Math.PI*2});

function drawMain(){
  const c=$('fpCanvas');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // Original fingerprint bars
  fingerprints.forEach((fp,i)=>{
    const x=40+i*45,bh=fp.orig;
    ctx.fillStyle='rgba(0,'+(150+i*6)+',255,'+(0.3+Math.sin(time+fp.phase)*0.1)+')';
    ctx.fillRect(x,H-30-bh,18,bh);
    // Spoofed overlay
    if(active){
      const acc=parseInt($('accuracy')?.value||85)/100;
      const spoofH=bh*acc+Math.random()*bh*(1-acc);
      ctx.fillStyle='rgba(255,'+(80+i*10)+',50,0.5)';
      ctx.fillRect(x+20,H-30-spoofH,18,spoofH);
    }
    ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText('F'+i,x+9,H-16);
  });
  // Legend
  ctx.fillStyle='rgba(0,200,255,0.6)';ctx.fillRect(W-200,10,12,12);ctx.fillStyle='rgba(0,200,255,0.8)';ctx.font='10px Orbitron';ctx.textAlign='left';ctx.fillText('Original',W-183,20);
  if(active){ctx.fillStyle='rgba(255,100,50,0.6)';ctx.fillRect(W-200,28,12,12);ctx.fillStyle='rgba(255,100,50,0.8)';ctx.fillText('Spoofed',W-183,38);}
  // Match line
  if(active){
    ctx.strokeStyle='rgba(255,200,0,0.4)';ctx.lineWidth=2;ctx.beginPath();
    fingerprints.forEach((fp,i)=>{
      const x=40+i*45+29,acc=parseInt($('accuracy')?.value||85)/100;
      const y=H-30-fp.orig*acc;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });ctx.stroke();
  }
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='11px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('RF FINGERPRINT — '+($('targetDev')?.value||'wifi').toUpperCase()+' | '+($('featureSet')?.value||'spectral').toUpperCase(),8,16);
  if(active){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('IDENTITY SPOOFING — MATCH: '+($('accuracy')?.value||85)+'%',8,32);}
}

function drawSecondary(){
  const c=$('sigCanvas');if(!c)return;const ctx=c.getContext('2d'),W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  ctx.beginPath();
  for(let x=0;x<W;x++){
    const y=H/2+Math.sin(x*0.05+time*3)*20*(active?0.3:1)+Math.sin(x*0.13)*10+Math.random()*3;
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle=active?'rgba(255,80,80,0.6)':'rgba(0,200,255,0.5)';ctx.lineWidth=1.5;ctx.stroke();
  if(active){
    ctx.beginPath();
    for(let x=0;x<W;x++){const y=H/2+Math.sin(x*0.05+time*3)*20*0.3+Math.sin(x*0.13+0.5)*10+Math.random()*5;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
    ctx.strokeStyle='rgba(255,200,0,0.4)';ctx.lineWidth=1;ctx.stroke();
  }
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='10px Orbitron,monospace';ctx.fillText('TRANSIENT SIGNATURE COMPARISON',5,14);
}

function updateInfo(){const s=$('infoStats');if(!s)return;s.innerHTML='<b>Device:</b> '+($('targetDev')?.value||'wifi')+'<br><b>Accuracy:</b> '+($('accuracy')?.value||85)+'%<br><b>Features:</b> '+($('featureSet')?.value||'spectral')+'<br><b>Noise:</b> '+($('noiseFloor')?.value||-90)+' dBm<br><b>Status:</b> '+(active?'<span style="color:#ff4444">SPOOFING</span>':'<span style="color:#00cc88">IDLE</span>');}

function animate(){time+=0.016;drawMain();drawSecondary();updateInfo();requestAnimationFrame(animate);}

function initControls(){
  $('accuracy').oninput=()=>{$('accLabel').textContent=$('accuracy').value+'%';};
  $('noiseFloor').oninput=()=>{$('noiseLabel').textContent=$('noiseFloor').value+' dBm';};
  $('startBtn').onclick=()=>{active=!active;setStatus(active);$('startBtn').querySelector('span:last-child').textContent=active?'Stop Spoof':'Spoof Identity';log(active?'FINGERPRINT SPOOFING ACTIVE on '+$('targetDev').value:'Spoofing stopped',active?'tx':'info');};
  $('analyzeBtn').onclick=()=>{showToast('Capturing fingerprint...',1500);setTimeout(()=>{log('Fingerprint captured: 16 features extracted from '+$('targetDev').value,'success');hideToast();},1500);};
  $('resetBtn').onclick=()=>{active=false;setStatus(false);fingerprints.forEach(fp=>{fp.orig=20+Math.random()*200;});log('Reset','info');};
}
function initRefDB(){const db=$('refDatabase');if(!db)return;db.innerHTML=['<b>Spectral Features:</b> Unique frequency-domain characteristics of each transmitter.','<b>Transient Analysis:</b> Turn-on/off transient fingerprinting.','<b>I/Q Imbalance:</b> Hardware imperfections as identity markers.','<b>Phase Noise Profile:</b> Oscillator-specific phase noise signatures.','<b>Clock Drift:</b> Crystal oscillator frequency offset patterns.','<b>GAN Spoofing:</b> Using generative networks to clone RF fingerprints.'].join('<br><br>');}

document.addEventListener('DOMContentLoaded',()=>{initSplash();initPanels();initLogFilters();initRefDB();initControls();try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}log(LANG[currentLang].ready,'success');animate();});

/* ═══════ ENHANCED RF CANVAS — RF FINGERPRINT SPOOFER ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _iqData=[];for(let i=0;i<128;i++)_iqData.push({i:Math.cos(i*0.15)*0.5+Math.random()*0.3,q:Math.sin(i*0.15)*0.5+Math.random()*0.3});
let _phaseNoise=new Array(256).fill(-100);
let _clockDrift=new Array(200).fill(0);
let _matchScore=new Array(200).fill(0);

/* ── IQ Constellation with Fingerprint Overlay ── */
function drawIQConstellation(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('I/Q CONSTELLATION — RF FINGERPRINT',5,12);
  const cx=W/2,cy=H/2,R=Math.min(W,H)/2-20;
  ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.1)';ctx.lineWidth=1;ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,R*0.5,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);
  ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.stroke();
  const isActive=typeof active!=='undefined'&&active;
  const acc=parseInt(_$('accuracy')?.value||85)/100;
  // Original signal points
  _iqData.forEach(pt=>{
    const px=cx+pt.i*R*0.9+Math.random()*2;const py=cy+pt.q*R*0.9+Math.random()*2;
    ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.5)';ctx.fill();
  });
  // Spoofed overlay
  if(isActive){
    _iqData.forEach(pt=>{
      const err=(1-acc)*0.5;
      const px=cx+(pt.i+Math.random()*err-err/2)*R*0.9;
      const py=cy+(pt.q+Math.random()*err-err/2)*R*0.9;
      ctx.beginPath();ctx.arc(px,py,2,0,Math.PI*2);ctx.fillStyle='rgba(255,80,80,0.5)';ctx.fill();
    });
  }
}

/* ── Phase Noise Profile ── */
function drawPhaseNoise(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('PHASE NOISE PROFILE (dBc/Hz)',5,12);
  const isActive=typeof active!=='undefined'&&active;
  for(let i=0;i<256;i++){
    const offset=Math.pow(10,i/256*6+1);
    let pn=-30-20*Math.log10(offset/10)+Math.random()*3;
    if(isActive)pn+=Math.random()*5-2;
    _phaseNoise[i]=_phaseNoise[i]*0.9+pn*0.1;
  }
  // Original
  ctx.beginPath();
  for(let i=0;i<256;i++){const x=(i/256)*W;const y=20+((_phaseNoise[i]+130)/80)*(H-30);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.strokeStyle='rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  // Spoofed
  if(isActive){ctx.beginPath();
    for(let i=0;i<256;i++){const x=(i/256)*W;const y=20+((_phaseNoise[i]+Math.random()*8-4+130)/80)*(H-30);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
    ctx.strokeStyle='rgba(255,80,80,0.5)';ctx.lineWidth=1;ctx.stroke();}
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';
  ['10Hz','1kHz','100kHz','10MHz'].forEach((l,i)=>{ctx.fillText(l,i*(W/4)+5,H-2);});
}

/* ── Clock Drift Analysis ── */
function drawClockDrift(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('CLOCK DRIFT PATTERN (ppm)',5,12);
  const isActive=typeof active!=='undefined'&&active;
  const drift=isActive?Math.sin(_t*0.5)*2+Math.random()*0.5:Math.sin(_t*0.3)*0.3+Math.random()*0.1;
  _clockDrift.push(drift);if(_clockDrift.length>200)_clockDrift.shift();
  ctx.beginPath();
  _clockDrift.forEach((v,i)=>{const x=(i/200)*W;const y=H/2-(v/4)*(H/2-15);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=isActive?'rgba(255,100,0,0.7)':'rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,H/2);ctx.lineTo(W,H/2);ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1;ctx.stroke();
}

/* ── Feature Match Scoring ── */
function drawMatchScore(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('FINGERPRINT MATCH SCORE',5,12);
  const isActive=typeof active!=='undefined'&&active;
  const acc=parseInt(_$('accuracy')?.value||85);
  const score=isActive?acc+Math.random()*10-5:Math.random()*15;
  _matchScore.push(Math.max(0,Math.min(100,score)));if(_matchScore.length>200)_matchScore.shift();
  ctx.beginPath();
  _matchScore.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/100)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=isActive?'rgba(255,200,0,0.7)':'rgba(0,200,255,0.5)';ctx.lineWidth=2;ctx.stroke();
  // Fill
  ctx.lineTo(W,H-10);ctx.lineTo(0,H-10);ctx.closePath();
  ctx.fillStyle=isActive?'rgba(255,200,0,0.08)':'rgba(0,200,255,0.05)';ctx.fill();
  // Threshold
  const thY=H-10-(70/100)*(H-25);
  ctx.beginPath();ctx.moveTo(0,thY);ctx.lineTo(W,thY);
  ctx.strokeStyle='rgba(0,255,136,0.4)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='7px Orbitron,monospace';ctx.fillText('MATCH THRESHOLD (70%)',5,thY-3);
  // Current value
  const last=_matchScore[_matchScore.length-1];
  ctx.fillStyle=last>70?'rgba(0,200,100,0.7)':'rgba(255,50,50,0.7)';ctx.font='12px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText(last.toFixed(0)+'%',W-10,30);
}

/* ── Transient Waveform Detail ── */
function drawTransientDetail(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('TURN-ON TRANSIENT WAVEFORM',5,12);
  const isActive=typeof active!=='undefined'&&active;
  ctx.beginPath();
  for(let x=0;x<W;x++){
    const t=x/W*10;
    let y=H/2;
    if(t<2)y=H/2-Math.exp(-t*2)*Math.sin(t*15)*30;
    else y=H/2+Math.sin(t*5)*5+Math.random()*2;
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle='rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  if(isActive){
    ctx.beginPath();
    for(let x=0;x<W;x++){
      const t=x/W*10;const acc=parseInt(_$('accuracy')?.value||85)/100;
      let y=H/2;
      if(t<2)y=H/2-Math.exp(-t*2)*Math.sin(t*15)*(30*acc+Math.random()*(1-acc)*15);
      else y=H/2+Math.sin(t*5)*(5*acc)+Math.random()*(1-acc)*8;
      if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle='rgba(255,80,80,0.5)';ctx.lineWidth=1;ctx.stroke();
  }
  // Time markers
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
  for(let us=0;us<=10;us+=2){ctx.fillText(us+'us',(us/10)*W,H-2);}
}

function enhancedRender(){
  _t+=0.016;
  const fpC=_$('fpCanvas');
  if(fpC){const ctx=fpC.getContext('2d');
    drawIQConstellation(ctx,fpC.width,fpC.height);}
  const sigC=_$('sigCanvas');
  if(sigC){const ctx=sigC.getContext('2d');const W=sigC.width,H=sigC.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawPhaseNoise(ctx,W,H*0.5);
    ctx.save();ctx.translate(0,H*0.5);drawMatchScore(ctx,W,H*0.5);ctx.restore();}
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
