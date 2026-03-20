/**
 * Workshop DIY — Frequency Deconfliction v1.2
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);}}
const LANG={
  en:{title:'Frequency Deconfliction',subtitle:'Frequency Deconfliction',disconnected:'Idle',connected:'Managing',mainSection:'Frequency Deconfliction Manager',mainDesc:'Spectrum allocation, conflict detection, and frequency planning',sectionA:'Frequency Allocations',sectionB:'Spectrum Management',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Set frequency and bandwidth.',howto_2:'Assign to a unit with priority.',howto_3:'Click Allocate to assign.',howto_4:'Check and resolve conflicts.',working:'Working...',ready:'Deconfliction Manager ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',allocate:'Allocate',checkConflicts:'Check Conflicts',autoDecon:'Auto-Deconflict',resetSim:'Reset',newAlloc:'New Allocation',unitParams:'Unit Assignment',allocFreq:'Frequency (MHz):',allocBw:'Bandwidth (MHz):',unitName:'Unit:',priority:'Priority:',deconStatus:'Deconfliction Status',allocHint:'Current spectrum allocations by unit.',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF warfare! 🔬 You get to experiment with electronic warfare signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real electronic warfare signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real electromagnetic combat techniques! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Rfw Radar Jammer Lab and Rfw Comms Interception Hub! Each teaches something different. 🚀'},
  fr:{title:'Deconfliction Frequences',subtitle:'Deconfliction Frequences',disconnected:'Inactif',connected:'Gestion',mainSection:'Gestionnaire de Deconfliction',mainDesc:'Allocation spectrale et resolution de conflits',sectionA:'Allocations',sectionB:'Gestion Spectrale',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',working:'En cours...',ready:'Gestionnaire pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',allocate:'Allouer',checkConflicts:'Verifier Conflits',autoDecon:'Auto-Resolution',resetSim:'Reinitialiser',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF warfare ! 🔬 Tu peux expérimenter avec electronic warfare signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais electronic warfare signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai electromagnetic combat techniques ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Rfw Radar Jammer Lab and Rfw Comms Interception Hub ! Chacune enseigne quelque chose de différent. 🚀'},
  ar:{title:'\u0641\u0636 \u062a\u0639\u0627\u0631\u0636 \u0627\u0644\u062a\u0631\u062f\u062f\u0627\u062a',subtitle:'\u0641\u0636 \u062a\u0639\u0627\u0631\u0636 \u0627\u0644\u062a\u0631\u062f\u062f\u0627\u062a',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u0625\u062f\u0627\u0631\u0629',mainSection:'\u0645\u062f\u064a\u0631 \u0641\u0636 \u0627\u0644\u062a\u0639\u0627\u0631\u0636',mainDesc:'\u062a\u062e\u0635\u064a\u0635 \u0627\u0644\u0637\u064a\u0641 \u0648\u0643\u0634\u0641 \u0627\u0644\u062a\u0639\u0627\u0631\u0636',sectionA:'\u0627\u0644\u062a\u062e\u0635\u064a\u0635\u0627\u062a',sectionB:'\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0637\u064a\u0641',activityLog:'\u0633\u062c\u0644',eventsMsg:'\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0627\u0644\u0645\u062f\u064a\u0631 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a',splashHint:'\u0627\u0646\u0642\u0631',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',allocate:'\u062a\u062e\u0635\u064a\u0635',checkConflicts:'\u0641\u062d\u0635 \u0627\u0644\u062a\u0639\u0627\u0631\u0636',autoDecon:'\u062d\u0644 \u062a\u0644\u0642\u0627\u0626\u064a',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF warfare! 🔬 يمكنك التجربة مع electronic warfare signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج electronic warfare signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا electromagnetic combat techniques حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Rfw Radar Jammer Lab and Rfw Comms Interception Hub! كل واحد يعلّم شيئاً مختلفاً. 🚀'}
};
let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='decon-log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function initPanels(){const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');if(langSel)langSel.onchange=()=>setLanguage(langSel.value);if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});}

let allocations=[],conflicts=[],time=0,allocId=0;
const unitColors={Alpha:'#ff6666',Bravo:'#66ccff',Charlie:'#66ff88',Delta:'#ffcc00',Echo:'#cc66ff'};

function initAllocations(){allocations=[];allocId=0;
  [{u:'Alpha',f:450,bw:25,p:'critical'},{u:'Bravo',f:900,bw:30,p:'high'},{u:'Charlie',f:2400,bw:80,p:'medium'},{u:'Alpha',f:1575,bw:20,p:'high'},{u:'Delta',f:5200,bw:40,p:'low'},{u:'Bravo',f:2450,bw:50,p:'medium'}].forEach(a=>{allocId++;allocations.push({id:'FA-'+allocId,unit:a.u,freq:a.f,bw:a.bw,priority:a.p,conflict:false});});}

function findConflicts(){conflicts=[];for(let i=0;i<allocations.length;i++){allocations[i].conflict=false;for(let j=i+1;j<allocations.length;j++){const a=allocations[i],b=allocations[j];const aMin=a.freq-a.bw/2,aMax=a.freq+a.bw/2;const bMin=b.freq-b.bw/2,bMax=b.freq+b.bw/2;if(aMin<bMax&&aMax>bMin){a.conflict=true;b.conflict=true;conflicts.push({a:a.id,b:b.id,overlap:Math.min(aMax,bMax)-Math.max(aMin,bMin)});}}}return conflicts;}

function drawAlloc(){
  const c=$('allocCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // Freq axis
  for(let f=0;f<=6000;f+=500){const x=(f/6000)*W;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.lineWidth=1;ctx.stroke();ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(f+'',x,H-3);}
  // Allocations as colored blocks
  const unitRows={};let row=0;
  allocations.forEach(a=>{
    if(!unitRows[a.unit])unitRows[a.unit]=row++;
    const r=unitRows[a.unit];const x1=((a.freq-a.bw/2)/6000)*W;const x2=((a.freq+a.bw/2)/6000)*W;const y=30+r*50;const h=40;
    const color=unitColors[a.unit]||'#888';
    ctx.fillStyle=a.conflict?'rgba(255,50,50,0.3)':color.replace(')',',0.2)').replace('rgb','rgba');
    ctx.fillRect(x1,y,x2-x1,h);ctx.strokeStyle=a.conflict?'rgba(255,50,50,0.8)':color;ctx.lineWidth=a.conflict?2:1;ctx.strokeRect(x1,y,x2-x1,h);
    if(a.conflict){const flash=Math.sin(time*5)>0;if(flash){ctx.fillStyle='rgba(255,50,50,0.2)';ctx.fillRect(x1,y,x2-x1,h);}}
    ctx.fillStyle=color;ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(a.unit+' '+a.id,x1+(x2-x1)/2,y+15);
    ctx.fillText(a.freq+' MHz ('+a.bw+')',x1+(x2-x1)/2,y+28);
    ctx.fillStyle=a.priority==='critical'?'#ff4444':a.priority==='high'?'#ffcc00':'#888';ctx.font='7px Orbitron,monospace';ctx.fillText(a.priority.toUpperCase(),x1+(x2-x1)/2,y+h-3);
  });
  ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('SPECTRUM ALLOCATION MAP (0-6 GHz)',10,18);
  if(conflicts.length>0){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText(conflicts.length+' CONFLICT(S) DETECTED',10,H-15);}
}

function drawConflict(){
  const c=$('conflictCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // Utilization bar
  const used=new Array(60).fill(0);allocations.forEach(a=>{const startBin=Math.floor((a.freq-a.bw/2)/100);const endBin=Math.ceil((a.freq+a.bw/2)/100);for(let b=Math.max(0,startBin);b<Math.min(60,endBin);b++)used[b]++;});
  const barW=W/60;
  used.forEach((v,i)=>{const bh=v/4*H*0.7;const color=v>1?'rgba(255,50,50,0.7)':v===1?'rgba(0,200,255,0.5)':'rgba(50,50,50,0.3)';ctx.fillStyle=color;ctx.fillRect(i*barW,H-bh-10,barW-2,bh);});
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('SPECTRUM UTILIZATION (red = conflict)',5,14);
}

function animate(){time+=0.016;drawAlloc();drawConflict();updateStats();requestAnimationFrame(animate);}
function updateStats(){const stats=$('deconStats');if(!stats)return;stats.innerHTML='<b>Allocations:</b> '+allocations.length+'<br><b>Conflicts:</b> <span style="color:'+(conflicts.length>0?'#ff4444':'#00cc88')+'">'+conflicts.length+'</span><br><b>Units:</b> '+[...new Set(allocations.map(a=>a.unit))].length+'<br><b>Status:</b> '+(conflicts.length>0?'<span style="color:#ff4444">CONFLICTS</span>':'<span style="color:#00cc88">CLEAR</span>');}
function updateAllocList(){const lib=$('allocList');if(!lib)return;lib.innerHTML='';allocations.forEach(a=>{const row=document.createElement('div');row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+(a.conflict?'rgba(255,50,50,0.1)':'rgba(0,200,255,0.05)');row.innerHTML='<span style="color:'+(unitColors[a.unit]||'#888')+'">'+a.unit+'</span><span>'+a.id+'</span><span>'+a.freq+' MHz</span><span>BW:'+a.bw+'</span><span style="color:'+(a.conflict?'#ff4444':'#00cc88')+'">'+(a.conflict?'CONFLICT':'OK')+'</span>';lib.appendChild(row);});}
function initTechDatabase(){const db=$('techDatabase');if(!db)return;db.innerHTML=['<b>Frequency Assignment:</b> Allocating non-overlapping bands to units.','<b>Guard Bands:</b> Empty frequency gaps between allocations to prevent interference.','<b>Priority-based Allocation:</b> Critical systems get protected frequencies first.','<b>Dynamic Spectrum Access:</b> Real-time reallocation based on changing needs.','<b>Interference Analysis:</b> Predicting and preventing harmful signal overlap.','<b>Joint Spectrum Management:</b> Coordinating across multiple forces and agencies.'].join('<br><br>');}

function initControls(){
  $('freqInput').oninput=()=>{$('freqLabel').textContent=$('freqInput').value+' MHz';};
  $('bwInput').oninput=()=>{$('bwLabel').textContent=$('bwInput').value+' MHz';};
  $('allocBtn').onclick=()=>{allocId++;const a={id:'FA-'+allocId,unit:$('unitSelect').value,freq:parseInt($('freqInput').value),bw:parseInt($('bwInput').value),priority:$('prioritySelect').value,conflict:false};allocations.push(a);findConflicts();setStatus(true);log('Allocated '+a.freq+' MHz ('+a.bw+' MHz) to '+a.unit,'tx');playSound('click');};
  $('checkBtn').onclick=()=>{const c=findConflicts();if(c.length>0){c.forEach(cf=>log('CONFLICT: '+cf.a+' overlaps '+cf.b+' by '+cf.overlap.toFixed(0)+' MHz','error'));showToast(c.length+' conflict(s) found!',2000);}else{log('No conflicts detected','success');showToast('All clear!',1500);}};
  $('autoBtn').onclick=()=>{showToast('Auto-deconflicting...',1500);setTimeout(()=>{allocations.sort((a,b)=>{const p={critical:0,high:1,medium:2,low:3};return p[a.priority]-p[b.priority];});let nextFreq=100;allocations.forEach(a=>{a.freq=nextFreq+a.bw/2;nextFreq+=a.bw+10;});findConflicts();log('Auto-deconfliction complete — '+allocations.length+' allocations reassigned','success');hideToast();},1500);};
  $('resetBtn').onclick=()=>{initAllocations();findConflicts();setStatus(false);log('Reset','info');playSound('click');};
}

document.addEventListener('DOMContentLoaded',()=>{
  initSplash();initPanels();initLogFilters();initAllocations();findConflicts();initTechDatabase();initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');animate();setInterval(updateAllocList,1000);
});

/* ═══════ ENHANCED RF CANVAS — FREQUENCY DECONFLICTION ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _specEfficiency=new Array(200).fill(0);let _guardBands=[];
let _interferencePower=new Array(60).fill(0);

/* ── Interference Power Map ── */
function drawInterferenceMap(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('INTERFERENCE POWER MAP (dBm)',5,12);
  if(typeof allocations==='undefined')return;
  const bins=60;const binW=W/bins;
  // Calculate interference per bin
  for(let b=0;b<bins;b++){
    const freq=b*100;let power=-100;
    allocations.forEach(a=>{
      const diff=Math.abs(freq-a.freq);
      if(diff<a.bw)power=Math.max(power,-20+a.bw*0.3);
      else if(diff<a.bw*2)power=Math.max(power,-60+a.bw*0.1);
    });
    _interferencePower[b]=_interferencePower[b]*0.9+(power+100)*0.1;
  }
  // Heatmap bars
  for(let b=0;b<bins;b++){
    const norm=Math.min(1,_interferencePower[b]/80);
    const r=norm>0.5?255:norm*500;const g=norm<0.5?200:200*(1-norm);
    ctx.fillStyle='rgba('+Math.floor(r)+','+Math.floor(g)+',50,'+(0.3+norm*0.5)+')';
    ctx.fillRect(b*binW,25,binW-1,H-35);
  }
  // Frequency labels
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
  for(let f=0;f<=6000;f+=1000){ctx.fillText(f+'',f/6000*W,H-2);}
}

/* ── Spectral Efficiency Tracker ── */
function drawSpectralEfficiency(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('SPECTRAL EFFICIENCY (%)',5,12);
  if(typeof allocations==='undefined')return;
  let totalBW=0;allocations.forEach(a=>totalBW+=a.bw);
  const eff=Math.min(100,totalBW/6000*100);
  _specEfficiency.push(eff);if(_specEfficiency.length>200)_specEfficiency.shift();
  ctx.beginPath();
  _specEfficiency.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/100)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(0,200,255,0.7)';ctx.lineWidth=2;ctx.stroke();
  ctx.lineTo(W,H-10);ctx.lineTo(0,H-10);ctx.closePath();ctx.fillStyle='rgba(0,200,255,0.05)';ctx.fill();
  ctx.fillStyle='rgba(0,200,255,0.6)';ctx.font='14px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText(eff.toFixed(1)+'%',W-10,30);
  // Waste indicator
  const waste=Math.max(0,100-eff);
  ctx.fillStyle='rgba(255,200,0,0.4)';ctx.font='8px Orbitron,monospace';ctx.fillText('Unused: '+waste.toFixed(1)+'%',W-10,45);
}

/* ── Guard Band Visualization ── */
function drawGuardBands(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('GUARD BAND ANALYSIS',5,12);
  if(typeof allocations==='undefined'||allocations.length<2)return;
  const sorted=[...allocations].sort((a,b)=>a.freq-b.freq);
  const barH=Math.min(30,(H-30)/sorted.length);
  for(let i=0;i<sorted.length-1;i++){
    const a=sorted[i],b=sorted[i+1];
    const aEnd=a.freq+a.bw/2;const bStart=b.freq-b.bw/2;
    const gap=bStart-aEnd;
    const y=25+i*barH;
    // Allocation bars
    const ax1=((a.freq-a.bw/2)/6000)*W;const ax2=(aEnd/6000)*W;
    const bx1=(bStart/6000)*W;const bx2=((b.freq+b.bw/2)/6000)*W;
    const ac=unitColors[a.unit]||'#888';const bc=unitColors[b.unit]||'#888';
    ctx.fillStyle=ac+'33';ctx.fillRect(ax1,y,ax2-ax1,barH-2);
    ctx.fillStyle=bc+'33';ctx.fillRect(bx1,y,bx2-bx1,barH-2);
    // Guard band
    if(gap>0){ctx.fillStyle='rgba(0,200,100,0.15)';ctx.fillRect(ax2,y,bx1-ax2,barH-2);
      ctx.fillStyle='rgba(0,200,100,0.4)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
      ctx.fillText(gap.toFixed(0)+'MHz',(ax2+bx1)/2,y+barH/2+2);}
    else{ctx.fillStyle='rgba(255,50,50,0.2)';ctx.fillRect(Math.min(ax2,bx1),y,Math.abs(bx1-ax2),barH-2);
      ctx.fillStyle='rgba(255,50,50,0.5)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
      ctx.fillText('OVERLAP',(ax2+bx1)/2,y+barH/2+2);}
  }
}

/* ── Priority Allocation Treemap ── */
function drawPriorityTreemap(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('PRIORITY ALLOCATION TREEMAP',5,12);
  if(typeof allocations==='undefined')return;
  const priorities={critical:[],high:[],medium:[],low:[]};
  allocations.forEach(a=>{if(priorities[a.priority])priorities[a.priority].push(a);});
  const priColors={critical:'rgba(255,50,50,0.4)',high:'rgba(255,200,0,0.3)',medium:'rgba(0,200,255,0.25)',low:'rgba(100,100,100,0.2)'};
  let y=25;
  Object.entries(priorities).forEach(([pri,allocs])=>{
    if(allocs.length===0)return;
    const totalBW=allocs.reduce((s,a)=>s+a.bw,0);
    const rowH=Math.max(20,Math.min(40,totalBW/20));
    let x=5;
    allocs.forEach(a=>{
      const w=Math.max(30,(a.bw/200)*(W-10));
      ctx.fillStyle=priColors[pri];ctx.fillRect(x,y,w-2,rowH-2);
      ctx.strokeStyle=(a.conflict?'rgba(255,50,50,0.7)':'rgba(255,255,255,0.15)');ctx.lineWidth=a.conflict?2:1;ctx.strokeRect(x,y,w-2,rowH-2);
      ctx.fillStyle=unitColors[a.unit]||'#aaa';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
      ctx.fillText(a.unit,x+w/2,y+rowH/2-2);ctx.fillText(a.bw+'MHz',x+w/2,y+rowH/2+8);
      x+=w;
    });
    ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';ctx.textAlign='right';
    ctx.fillText(pri.toUpperCase(),W-5,y+rowH/2+3);
    y+=rowH+3;
  });
}

/* ── EMI Probability Matrix ── */
function drawEMIMatrix(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('EMI PROBABILITY MATRIX',5,12);
  if(typeof allocations==='undefined')return;
  const n=Math.min(allocations.length,8);const cellW=Math.min(50,(W-50)/n);const cellH=Math.min(22,(H-35)/n);
  for(let i=0;i<n;i++){for(let j=0;j<n;j++){
    const x=45+j*cellW;const y=28+i*cellH;
    let prob=0;
    if(i===j)prob=0;
    else{const a=allocations[i],b=allocations[j];const sep=Math.abs(a.freq-b.freq)-(a.bw+b.bw)/2;
      prob=sep<0?0.9:sep<20?0.5:sep<50?0.2:0.05;}
    ctx.fillStyle=prob>0.5?'rgba(255,50,50,0.4)':prob>0.2?'rgba(255,200,0,0.25)':'rgba(0,200,100,0.1)';
    ctx.fillRect(x,y,cellW-2,cellH-2);
    ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='6px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText((prob*100).toFixed(0)+'%',x+cellW/2,y+cellH/2+2);
  }
  ctx.fillStyle=unitColors[allocations[i].unit]||'#aaa';ctx.font='6px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText(allocations[i].id,43,28+i*cellH+cellH/2+2);
  ctx.textAlign='center';ctx.fillText(allocations[i].id,45+i*cellW+cellW/2,26);
  }
}

function enhancedRender(){
  _t+=0.016;
  const ac=_$('allocCanvas');
  if(ac){const ctx=ac.getContext('2d');drawInterferenceMap(ctx,ac.width,ac.height);}
  const cc=_$('conflictCanvas');
  if(cc){const ctx=cc.getContext('2d');const W=cc.width,H=cc.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawSpectralEfficiency(ctx,W,H);}
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
