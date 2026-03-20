/**
 * Workshop DIY — Anti-Drone System v1.2
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);}}
const LANG={
  en:{title:'Anti-Drone System',subtitle:'Anti-Drone System',disconnected:'Idle',connected:'Active',mainSection:'Anti-Drone RF System',mainDesc:'Detect, track, and neutralize drones via RF jamming',sectionA:'Drone Tracks',sectionB:'C-UAS Technology',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Set radar range and sensitivity.',howto_2:'Start detection to find drones.',howto_3:'Select jamming band and power.',howto_4:'Engage jammer to neutralize.',working:'Working...',ready:'Anti-Drone System ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',startDetect:'Start Detection',stopDetect:'Stop Detection',engageJam:'Engage Jammer',disengageJam:'Disengage',resetSim:'Reset',detParams:'Detection',jamParams:'Jamming',radarRange:'Radar Range (km):',sensitivity:'Sensitivity:',jamPower:'Jam Power (W):',jamBand:'Jam Band:',sysStatus:'System Status',droneHint:'Tracked drone contacts and threat levels.',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF warfare! 🔬 You get to experiment with electronic warfare signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real electronic warfare signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real electromagnetic combat techniques! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need a computer with Python 3. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Rfw Comms Interception Hub and Rfw Radar Jammer Lab! Each teaches something different. 🚀'},
  fr:{title:'Systeme Anti-Drone',subtitle:'Systeme Anti-Drone',disconnected:'Inactif',connected:'Actif',mainSection:'Systeme RF Anti-Drone',mainDesc:'Detecter, suivre et neutraliser les drones',sectionA:'Pistes Drones',sectionB:'Technologie C-UAS',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',working:'En cours...',ready:'Systeme pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',startDetect:'Demarrer Detection',stopDetect:'Arreter',engageJam:'Activer Brouilleur',disengageJam:'Desactiver',resetSim:'Reinitialiser',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF warfare ! 🔬 Tu peux expérimenter avec electronic warfare signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais electronic warfare signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai electromagnetic combat techniques ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Rfw Comms Interception Hub and Rfw Radar Jammer Lab ! Chacune enseigne quelque chose de différent. 🚀'},
  ar:{title:'\u0646\u0638\u0627\u0645 \u0645\u0636\u0627\u062f \u0644\u0644\u0637\u0627\u0626\u0631\u0627\u062a',subtitle:'\u0646\u0638\u0627\u0645 \u0645\u0636\u0627\u062f \u0644\u0644\u0637\u0627\u0626\u0631\u0627\u062a',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u0646\u0634\u0637',mainSection:'\u0646\u0638\u0627\u0645 RF \u0645\u0636\u0627\u062f \u0644\u0644\u0637\u0627\u0626\u0631\u0627\u062a',mainDesc:'\u0643\u0634\u0641 \u0648\u062a\u062a\u0628\u0639 \u0648\u062a\u062d\u064a\u064a\u062f \u0627\u0644\u0637\u0627\u0626\u0631\u0627\u062a \u0628\u062f\u0648\u0646 \u0637\u064a\u0627\u0631',sectionA:'\u0645\u0633\u0627\u0631\u0627\u062a \u0627\u0644\u0637\u0627\u0626\u0631\u0627\u062a',sectionB:'\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627 C-UAS',activityLog:'\u0633\u062c\u0644',eventsMsg:'\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0627\u0644\u0646\u0638\u0627\u0645 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a',splashHint:'\u0627\u0646\u0642\u0631',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',startDetect:'\u0628\u062f\u0621 \u0627\u0644\u0643\u0634\u0641',stopDetect:'\u0625\u064a\u0642\u0627\u0641',engageJam:'\u062a\u0634\u063a\u064a\u0644 \u0627\u0644\u0645\u0634\u0648\u0634',disengageJam:'\u0625\u064a\u0642\u0627\u0641',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF warfare! 🔬 يمكنك التجربة مع electronic warfare signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج electronic warfare signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا electromagnetic combat techniques حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Rfw Comms Interception Hub and Rfw Radar Jammer Lab! كل واحد يعلّم شيئاً مختلفاً. 🚀'}
};
let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='cuas-log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
function initPanels(){const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');if(langSel)langSel.onchange=()=>setLanguage(langSel.value);if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});}

let detecting=false,jamming=false,time=0;let drones=[];

function initDrones(){drones=[];const types=['Quadcopter','Hexacopter','Fixed-Wing','FPV Racer','Reconnaissance'];for(let i=0;i<6;i++){const angle=Math.random()*Math.PI*2;const dist=0.3+Math.random()*0.6;drones.push({id:'UAS-'+(i+1),type:types[Math.floor(Math.random()*types.length)],angle,dist,speed:0.002+Math.random()*0.005,alt:(50+Math.random()*400).toFixed(0),threat:['LOW','MED','HIGH'][Math.floor(Math.random()*3)],jammed:false,neutralized:false});}}

function drawRadar(){
  const c=$('radarCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  const cx=W/2,cy=H/2,R=Math.min(W,H)/2-30;
  // Rings
  for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(cx,cy,R*i/4,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,0.12)';ctx.lineWidth=1;ctx.stroke();}
  ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.strokeStyle='rgba(0,255,136,0.08)';ctx.stroke();
  // Range labels
  const range=parseInt($('rangeInput')?.value||10);
  ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
  for(let i=1;i<=4;i++)ctx.fillText((range*i/4).toFixed(0)+'km',cx+R*i/4,cy+12);
  // Sweep
  if(detecting){const angle=time*1.5;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(angle)*R,cy+Math.sin(angle)*R);ctx.strokeStyle='rgba(0,255,136,0.5)';ctx.lineWidth=2;ctx.stroke();const grad=ctx.createRadialGradient(cx,cy,0,cx,cy,R);grad.addColorStop(0,'rgba(0,255,136,0.12)');grad.addColorStop(1,'rgba(0,255,136,0)');ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,angle-0.4,angle);ctx.closePath();ctx.fillStyle=grad;ctx.fill();}
  // Drones
  drones.forEach(d=>{
    d.angle+=d.speed;if(d.angle>Math.PI*2)d.angle-=Math.PI*2;
    if(d.neutralized){d.dist+=0.001;if(d.dist>1)d.dist=1;}
    const dx=cx+Math.cos(d.angle)*d.dist*R;const dy=cy+Math.sin(d.angle)*d.dist*R;
    if(!detecting&&!d.neutralized)return;
    const color=d.neutralized?'rgba(100,100,100,0.5)':d.jammed?'rgba(255,200,0,0.9)':d.threat==='HIGH'?'rgba(255,50,50,0.9)':d.threat==='MED'?'rgba(255,200,0,0.8)':'rgba(0,200,255,0.7)';
    ctx.beginPath();ctx.arc(dx,dy,6,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
    if(d.threat==='HIGH'&&!d.neutralized&&detecting){ctx.beginPath();ctx.arc(dx,dy,12+Math.sin(time*5)*3,0,Math.PI*2);ctx.strokeStyle='rgba(255,50,50,0.5)';ctx.lineWidth=2;ctx.stroke();}
    if(d.jammed&&!d.neutralized){for(let j=0;j<3;j++){ctx.beginPath();ctx.arc(dx,dy,8+j*6+Math.sin(time*4)*2,0,Math.PI*2);ctx.strokeStyle='rgba(255,100,0,'+(0.3-j*0.08)+')';ctx.lineWidth=1;ctx.stroke();}}
    ctx.fillStyle=d.neutralized?'#666':d.jammed?'#ffcc00':'#66ccff';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(d.id,dx,dy-10);
  });
  // Center
  ctx.beginPath();ctx.arc(cx,cy,8,0,Math.PI*2);ctx.fillStyle='rgba(0,255,136,0.8)';ctx.fill();ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('C-UAS RADAR',10,18);
  if(jamming){ctx.fillStyle='rgba(255,100,0,0.8)';ctx.fillText('JAMMING ACTIVE',10,34);}
}

function drawRF(){
  const c=$('rfCanvas');if(!c)return;const ctx=c.getContext('2d');const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
  // Show drone RF signatures
  ctx.beginPath();for(let x=0;x<W;x++){let y=H*0.7+Math.random()*6;if(detecting){const f=x/W*6;drones.forEach(d=>{if(d.neutralized)return;const dFreq=d.type==='FPV Racer'?5.8:2.4;if(Math.abs(f-dFreq)<0.3)y-=20+Math.random()*15;});}if(jamming){const band=$('jamBandSelect')?.value||'2.4ghz';const jf=band==='2.4ghz'?2.4:band==='5.8ghz'?5.8:band==='gps'?1.575:3;if(Math.abs(x/W*6-jf)<0.5)y-=30+Math.random()*20;}if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
  ctx.strokeStyle='rgba(0,200,255,0.6)';ctx.lineWidth=1;ctx.stroke();
  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';ctx.fillText('RF SPECTRUM (0-6 GHz)',5,14);
}

function animate(){
  time+=0.016;
  if(jamming){drones.forEach(d=>{d.jammed=true;if(Math.random()>0.995&&!d.neutralized){d.neutralized=true;log('UAS '+d.id+' NEUTRALIZED','success');}});}
  drawRadar();drawRF();updateStats();requestAnimationFrame(animate);
}
function updateStats(){const stats=$('sysStats');if(!stats)return;const tracked=drones.filter(d=>detecting&&!d.neutralized).length;const neutralized=drones.filter(d=>d.neutralized).length;stats.innerHTML='<b>Tracked:</b> '+tracked+'<br><b>Neutralized:</b> '+neutralized+'<br><b>Jammer:</b> '+(jamming?'<span style="color:#ff8800">ENGAGED</span>':'OFF')+'<br><b>Status:</b> '+(detecting?'<span style="color:#00ff88">ACTIVE</span>':'<span style="color:#888">STANDBY</span>');}
function updateDroneList(){const lib=$('droneList');if(!lib)return;lib.innerHTML='';drones.forEach(d=>{const row=document.createElement('div');row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+(d.neutralized?'rgba(100,100,100,0.1)':d.threat==='HIGH'?'rgba(255,50,50,0.1)':'rgba(0,200,255,0.05)');row.innerHTML='<span style="color:'+(d.neutralized?'#666':d.threat==='HIGH'?'#ff6666':'#66ccff')+'">'+d.id+'</span><span>'+d.type+'</span><span>'+d.alt+'m</span><span style="color:'+(d.threat==='HIGH'?'#ff4444':d.threat==='MED'?'#ffcc00':'#00cc88')+'">'+d.threat+'</span><span style="color:'+(d.neutralized?'#666':d.jammed?'#ff8800':'#00cc88')+'">'+(d.neutralized?'DOWN':d.jammed?'JAMMED':'TRACK')+'</span>';lib.appendChild(row);});}
function initTechDatabase(){const db=$('techDatabase');if(!db)return;db.innerHTML=['<b>RF Detection:</b> Identifying drone control and video link frequencies.','<b>2.4/5.8 GHz Jamming:</b> Disrupting WiFi and FPV control links.','<b>GPS Denial:</b> Blocking GPS to force drone return-to-home or land.','<b>Protocol Analysis:</b> Identifying drone make and model from RF signature.','<b>Directional Jamming:</b> Focused beam to minimize collateral disruption.','<b>Layered Defense:</b> Combining detection, tracking, and multiple countermeasures.'].join('<br><br>');}

function initControls(){
  $('rangeInput').oninput=()=>{$('rangeLabel').textContent=$('rangeInput').value+' km';};
  $('sensInput').oninput=()=>{$('sensLabel').textContent=$('sensInput').value+'%';};
  $('jamPowerInput').oninput=()=>{$('jamPowerLabel').textContent=$('jamPowerInput').value+' W';};
  $('detectBtn').onclick=()=>{detecting=!detecting;setStatus(detecting);$('detectBtn').querySelector('[data-i18n]').textContent=detecting?LANG[currentLang].stopDetect:LANG[currentLang].startDetect;log(detecting?'Detection STARTED — scanning for UAS':'Detection STOPPED',detecting?'rx':'info');if(detecting)showToast('Scanning...',2000);};
  $('jamBtn').onclick=()=>{jamming=!jamming;$('jamBtn').querySelector('[data-i18n]').textContent=jamming?LANG[currentLang].disengageJam:LANG[currentLang].engageJam;log(jamming?'JAMMER ENGAGED — '+$('jamBandSelect').value:'Jammer disengaged',jamming?'error':'info');if(jamming)showToast('Jamming...',2000);};
  $('resetBtn').onclick=()=>{detecting=false;jamming=false;setStatus(false);initDrones();$('detectBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].startDetect;$('jamBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].engageJam;log('Reset','info');playSound('click');};
}

document.addEventListener('DOMContentLoaded',()=>{
  initSplash();initPanels();initLogFilters();initDrones();initTechDatabase();initControls();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');animate();setInterval(updateDroneList,1000);
});

/* ═══════ ENHANCED RF CANVAS — ANTI-DRONE SYSTEM ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _detectionHist=new Array(200).fill(0);let _neutralizeHist=new Array(200).fill(0);
let _radarParticles=[];let _threatLevel=new Array(200).fill(0);

class RadarPulse{constructor(cx,cy){this.cx=cx;this.cy=cy;this.r=0;this.maxR=200;this.speed=3;this.life=1;}
update(){this.r+=this.speed;this.life=1-this.r/this.maxR;return this.r<this.maxR;}
draw(ctx){ctx.beginPath();ctx.arc(this.cx,this.cy,this.r,0,Math.PI*2);ctx.strokeStyle='rgba(0,255,136,'+this.life*0.3+')';ctx.lineWidth=2;ctx.stroke();}}

/* ── Threat Assessment Gauge ── */
function drawThreatGauge(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('THREAT LEVEL ASSESSMENT',5,12);
  const isDet=typeof detecting!=='undefined'&&detecting;
  const isJam=typeof jamming!=='undefined'&&jamming;
  const highCount=typeof drones!=='undefined'?drones.filter(d=>d.threat==='HIGH'&&!d.neutralized).length:0;
  const totalActive=typeof drones!=='undefined'?drones.filter(d=>!d.neutralized).length:0;
  const threat=isDet?Math.min(100,highCount*30+totalActive*10+Math.random()*5):0;
  _threatLevel.push(threat);if(_threatLevel.length>200)_threatLevel.shift();
  // Gauge arc
  const cx=W/2,cy=H*0.7,R=Math.min(W,H)*0.35;
  const startA=Math.PI*0.8,endA=Math.PI*2.2;
  // Background arc
  ctx.beginPath();ctx.arc(cx,cy,R,startA,endA);ctx.strokeStyle='rgba(50,50,50,0.3)';ctx.lineWidth=12;ctx.stroke();
  // Color zones
  const greenEnd=startA+(endA-startA)*0.4;const yellowEnd=startA+(endA-startA)*0.7;
  ctx.beginPath();ctx.arc(cx,cy,R,startA,greenEnd);ctx.strokeStyle='rgba(0,200,100,0.3)';ctx.lineWidth=12;ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,R,greenEnd,yellowEnd);ctx.strokeStyle='rgba(255,200,0,0.3)';ctx.lineWidth=12;ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,R,yellowEnd,endA);ctx.strokeStyle='rgba(255,50,50,0.3)';ctx.lineWidth=12;ctx.stroke();
  // Needle
  const needleA=startA+(threat/100)*(endA-startA);
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(needleA)*R*0.9,cy+Math.sin(needleA)*R*0.9);
  ctx.strokeStyle=threat>70?'rgba(255,50,50,0.9)':threat>40?'rgba(255,200,0,0.8)':'rgba(0,200,100,0.7)';
  ctx.lineWidth=3;ctx.stroke();
  ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fill();
  ctx.fillStyle=threat>70?'rgba(255,50,50,0.8)':'rgba(255,200,0,0.7)';ctx.font='18px Orbitron,monospace';ctx.textAlign='center';
  ctx.fillText(threat.toFixed(0),cx,cy+R*0.4);
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';ctx.fillText('THREAT LEVEL',cx,cy+R*0.55);
}

/* ── Kill Chain Timeline ── */
function drawKillChain(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('C-UAS KILL CHAIN',5,12);
  const isDet=typeof detecting!=='undefined'&&detecting;
  const isJam=typeof jamming!=='undefined'&&jamming;
  const stages=['DETECT','CLASSIFY','TRACK','IDENTIFY','ENGAGE','NEUTRALIZE'];
  const activeStage=!isDet?-1:!isJam?2:5;
  const stageW=(W-20)/stages.length;
  stages.forEach((s,i)=>{
    const x=10+i*stageW;const y=28;const isActive=i<=activeStage;
    ctx.fillStyle=isActive?(i>=4?'rgba(255,50,50,0.2)':'rgba(0,200,255,0.15)'):'rgba(50,50,50,0.15)';
    ctx.fillRect(x,y,stageW-4,40);
    if(isActive&&i===activeStage){ctx.strokeStyle='rgba(255,200,0,0.6)';ctx.lineWidth=2;ctx.strokeRect(x,y,stageW-4,40);}
    ctx.fillStyle=isActive?(i>=4?'#ff6666':'#66ccff'):'rgba(100,100,100,0.4)';
    ctx.font='8px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(s,x+stageW/2-2,y+25);
    if(i<stages.length-1){ctx.fillStyle=isActive&&i<activeStage?'rgba(0,200,255,0.5)':'rgba(100,100,100,0.2)';
      ctx.beginPath();ctx.moveTo(x+stageW-6,y+20);ctx.lineTo(x+stageW+2,y+20);ctx.lineTo(x+stageW-2,y+17);ctx.moveTo(x+stageW+2,y+20);ctx.lineTo(x+stageW-2,y+23);ctx.stroke();}
  });
  // Timeline progress bar
  const progress=activeStage>=0?(activeStage+1)/stages.length*100:0;
  ctx.fillStyle='rgba(50,50,50,0.3)';ctx.fillRect(10,75,W-20,8);
  ctx.fillStyle=progress>80?'rgba(0,200,100,0.6)':progress>40?'rgba(255,200,0,0.5)':'rgba(0,200,255,0.4)';
  ctx.fillRect(10,75,(W-20)*progress/100,8);
}

/* ── Detection/Neutralization Stats ── */
function drawDetNeutStats(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('DETECTION vs NEUTRALIZATION RATE',5,12);
  const isDet=typeof detecting!=='undefined'&&detecting;
  const isJam=typeof jamming!=='undefined'&&jamming;
  const det=isDet?(typeof drones!=='undefined'?drones.filter(d=>!d.neutralized).length:0)*15+Math.random()*10:0;
  const neut=isJam?(typeof drones!=='undefined'?drones.filter(d=>d.neutralized).length:0)*20+Math.random()*8:0;
  _detectionHist.push(det);if(_detectionHist.length>200)_detectionHist.shift();
  _neutralizeHist.push(neut);if(_neutralizeHist.length>200)_neutralizeHist.shift();
  ctx.beginPath();
  _detectionHist.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/100)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(0,200,255,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  ctx.beginPath();
  _neutralizeHist.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/100)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle='rgba(255,100,0,0.6)';ctx.lineWidth=1.5;ctx.stroke();
  ctx.fillStyle='rgba(0,200,255,0.5)';ctx.font='8px Orbitron,monospace';ctx.fillText('Detect',W-80,H-15);
  ctx.fillStyle='rgba(255,100,0,0.5)';ctx.fillText('Neutralize',W-80,H-5);
}

/* ── RF Signature Classification ── */
function drawRFClassification(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('RF SIGNATURE CLASSIFICATION',5,12);
  if(typeof drones==='undefined')return;
  const isDet=typeof detecting!=='undefined'&&detecting;
  const classTypes=[{name:'DJI Phantom',band:'2.4 GHz',proto:'Lightbridge',color:'#66ccff'},{name:'FPV Racer',band:'5.8 GHz',proto:'Analog Video',color:'#ff6666'},{name:'DJI Mavic',band:'2.4/5.8 GHz',proto:'OcuSync',color:'#66ff88'},{name:'Parrot',band:'2.4 GHz WiFi',proto:'802.11',color:'#ffcc00'},{name:'Unknown',band:'900 MHz',proto:'Custom',color:'#cc66ff'}];
  const barH=Math.min(22,(H-25)/classTypes.length);
  classTypes.forEach((ct,i)=>{
    const y=25+i*barH;const count=isDet?Math.floor(Math.random()*3):0;
    const conf=isDet?60+Math.random()*35:0;
    ctx.fillStyle=count>0?ct.color.replace('#','rgba(').replace(/(..)(..)(..)/,(m,r,g,b)=>parseInt(r,16)+','+parseInt(g,16)+','+parseInt(b,16))+',0.15)':'rgba(50,50,50,0.1)';
    ctx.fillRect(5,y,W-10,barH-2);
    ctx.fillStyle=count>0?ct.color:'rgba(100,100,100,0.4)';ctx.font='8px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText(ct.name+' — '+ct.band,10,y+barH/2+3);
    if(count>0){ctx.textAlign='right';ctx.fillText(conf.toFixed(0)+'% conf',W-10,y+barH/2+3);}
  });
}

function enhancedRender(){
  _t+=0.016;
  for(let i=_radarParticles.length-1;i>=0;i--)if(!_radarParticles[i].update())_radarParticles.splice(i,1);
  const rc=_$('radarCanvas');
  if(rc){const ctx=rc.getContext('2d');
    if(typeof detecting!=='undefined'&&detecting&&_t%0.3<0.02){_radarParticles.push(new RadarPulse(rc.width/2,rc.height/2));}
    _radarParticles.forEach(p=>p.draw(ctx));
  }
  const rfc=_$('rfCanvas');
  if(rfc){const ctx=rfc.getContext('2d');const W=rfc.width,H=rfc.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawThreatGauge(ctx,W*0.4,H);
    ctx.save();ctx.translate(W*0.4,0);drawKillChain(ctx,W*0.6,H);ctx.restore();}
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
