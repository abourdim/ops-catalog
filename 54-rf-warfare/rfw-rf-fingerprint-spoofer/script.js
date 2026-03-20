/**
 * Workshop DIY — RF Fingerprint Spoofer v1.2
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const n=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.08);o.start(n);o.stop(n+0.08);}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,n+0.3);o.start(n);o.stop(n+0.3);}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,n+0.25);o.start(n);o.stop(n+0.25);}}
const LANG={en:{title:'RF Fingerprint Spoofer',subtitle:'RF Fingerprint Spoofer',disconnected:'Idle',connected:'Spoofing',ready:'RF Fingerprint Spoofer ready!',langChanged:'English',themeChanged:'Theme:',logCleared:'Log cleared',copied:'Copied!',copyFail:'Fail',working:'Working...',faq_q1:'What is this app?',faq_a1:'An interactive educational simulation from Workshop-DIY. Explore, experiment, and learn!',faq_q2:'How do I use it?',faq_a2:'Use the controls in the main section. Try different settings and watch what happens.',faq_q3:'Can I change the theme?',faq_a3:'Yes! Open Settings and pick a theme. There are 8 to choose from.',faq_q4:'Is my data private?',faq_a4:'Yes. Everything runs locally in your browser. No data is sent anywhere.',step1Title:'Detect RF Threat',step1Desc:'Scan the electromagnetic spectrum to identify hostile RF emissions.',step2Title:'Characterize Signal',step2Desc:'Analyze the threat signal: frequency, power, modulation, and direction.',step3Title:'Deploy Countermeasure',step3Desc:'Activate jamming, spoofing, or defensive measures against the threat.',step4Title:'Assess Effectiveness',step4Desc:'Monitor the battlefield to verify the countermeasure neutralized the threat.',sectionCode:'Device Code'},fr:{title:'Falsificateur d\'Empreinte RF',subtitle:'Falsificateur d\'Empreinte RF',disconnected:'Inactif',connected:'Spoofing',ready:'Pret!',langChanged:'Francais',themeChanged:'Theme:',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',working:'En cours...',faq_q1:'C\'est quoi cette appli?',faq_a1:'Une simulation educative interactive de Workshop-DIY. Explore, experimente et apprends!',faq_q2:'Comment l\'utiliser?',faq_a2:'Utilise les controles dans la section principale. Essaie differents reglages.',faq_q3:'Puis-je changer le theme?',faq_a3:'Oui! Ouvre les Parametres et choisis un theme. Il y en a 8.',faq_q4:'Mes donnees sont-elles privees?',faq_a4:'Oui. Tout fonctionne localement dans ton navigateur.',step1Title:'Détecter la menace RF',step1Desc:'Scanne le spectre électromagnétique pour identifier les émissions hostiles.',step2Title:'Caractériser le signal',step2Desc:'Analyse le signal : fréquence, puissance, modulation et direction.',step3Title:'Déployer la contre-mesure',step3Desc:'Active le brouillage, le leurrage ou les mesures défensives.',step4Title:'Évaluer l\'efficacité',step4Desc:'Surveille le terrain pour vérifier que la menace est neutralisée.',sectionCode:'Code Appareil'},ar:{title:'\u0645\u0632\u064a\u0641 \u0627\u0644\u0628\u0635\u0645\u0629 RF',subtitle:'\u0645\u0632\u064a\u0641 \u0627\u0644\u0628\u0635\u0645\u0629 RF',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u062a\u0632\u064a\u064a\u0641',ready:'\u062c\u0627\u0647\u0632!',langChanged:'\u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0645\u0638\u0647\u0631:',logCleared:'\u062a\u0645',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',working:'\u062c\u0627\u0631\u064d...',faq_q1:'ما هذا التطبيق؟',faq_a1:'محاكاة تعليمية تفاعلية من Workshop-DIY. استكشف وجرب وتعلم!',faq_q2:'كيف أستخدمه؟',faq_a2:'استخدم عناصر التحكم في القسم الرئيسي. جرب إعدادات مختلفة.',faq_q3:'هل يمكنني تغيير السمة؟',faq_a3:'نعم! افتح الإعدادات واختر سمة. هناك 8 سمات.',faq_q4:'هل بياناتي خاصة؟',faq_a4:'نعم. كل شيء يعمل محلياً في متصفحك.',step1Title:'كشف تهديد RF',step1Desc:'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.',step2Title:'توصيف الإشارة',step2Desc:'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.',step3Title:'نشر الإجراء المضاد',step3Desc:'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.',step4Title:'تقييم الفعالية',step4Desc:'راقب ساحة المعركة للتحقق من تحييد التهديد.',sectionCode:'كود الجهاز'}};
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
