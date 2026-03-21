/**
 * Sonic Acoustic Fence — Workshop DIY v1.0
 * Ultrasonic Doppler perimeter detector
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];let currentLang='en',soundEnabled=false;
const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx,analyser,micStream,freqArray,osc,gainNode;
let isArmed=false,animId=null,alertLevel=0,peakShift=0,intrusionCount=0;

const LANG={
  en:{title:'Acoustic Fence',subtitle:'Ultrasonic Doppler Perimeter Detector',disconnected:'Idle',connected:'Armed',mainSection:'Acoustic Fence',mainDesc:'Emit ultrasonic tone, detect Doppler shifts from movement',sectionA:'Intrusion Events',sectionB:'Doppler Theory',arm:'Arm Fence',disarm:'Disarm',alertLevel:'Alert Level',dopplerShift:'Doppler Shift',fenceStatus:'Fence Status',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',filterAll:'All',soundEffects:'Sound effects',ready:'Acoustic Fence ready!',splashHint:'tap to skip',langChanged:'Language > English',themeChanged:'Theme >',armed:'Fence ARMED',disarmed:'Fence disarmed',intrusion:'INTRUSION DETECTED!',approaching:'APPROACHING',retreating:'RETREATING',secure:'SECURE',eventHint:'Motion events appear here.',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Cloture Acoustique',subtitle:'Detecteur Doppler Perimetrique',disconnected:'Inactif',connected:'Arme',mainSection:'Cloture Acoustique',mainDesc:'Emettre un ultrason, detecter les mouvements par effet Doppler',sectionA:'Evenements Intrusion',sectionB:'Theorie Doppler',arm:'Armer',disarm:'Desarmer',alertLevel:'Niveau Alerte',dopplerShift:'Decalage Doppler',fenceStatus:'Etat Cloture',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',filterAll:'Tout',soundEffects:'Effets sonores',ready:'Cloture acoustique prete!',splashHint:'appuyer pour passer',langChanged:'Langue > Francais',themeChanged:'Theme >',armed:'Cloture ARMEE',disarmed:'Cloture desarmee',intrusion:'INTRUSION DETECTEE!',approaching:'APPROCHE',retreating:'ELOIGNEMENT',secure:'SECURISE',eventHint:'Evenements de mouvement ici.',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'السياج الصوتي',subtitle:'كاشف دوبلر المحيطي',disconnected:'خامل',connected:'مسلح',mainSection:'السياج الصوتي',mainDesc:'إصدار نغمة فوق صوتية وكشف الحركة بتأثير دوبلر',sectionA:'أحداث التسلل',sectionB:'نظرية دوبلر',arm:'تسليح',disarm:'إلغاء التسليح',alertLevel:'مستوى التنبيه',dopplerShift:'إزاحة دوبلر',fenceStatus:'حالة السياج',activityLog:'سجل النشاط',eventsMsg:'أحداث',clear:'مسح',copy:'نسخ',theme:'المظهر',settings:'الإعدادات',language:'اللغة',help:'مساعدة',faq:'أسئلة',howto:'كيف',wiki:'ويكي',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'السياج الصوتي جاهز!',splashHint:'انقر للتخطي',langChanged:'اللغة > العربية',themeChanged:'المظهر >',armed:'السياج مسلح',disarmed:'السياج معطل',intrusion:'تسلل مكتشف!',approaching:'اقتراب',retreating:'ابتعاد',secure:'آمن',eventHint:'أحداث الحركة تظهر هنا.',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}
};

/* === MORSE CODE EASTER EGG === */
function initMorseEasterEgg(){
 if(document.getElementById('morseHint'))return;
 var MORSE_MAP={'.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H','..':'I','.---':'J','-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P','--.-':'Q','.-.':'R','...':'S','-':'T','..-':'U','...-':'V','.--':'W','-..-':'X','-.--':'Y','--..':'Z'};
 var morseSeq=[];var morseTimer=null;var keyDownTime=0;
 var hint=document.createElement('span');hint.id='morseHint';hint.textContent='|';hint.title='Morse';hint.style.cssText='opacity:0.3;cursor:default;font-size:0.7rem;margin:0 4px;';
 var footer=document.querySelector('footer')||document.querySelector('.footer');
 if(footer)footer.appendChild(hint);
 function decodeMorse(){
  var letters=[];var current='';
  for(var i=0;i<morseSeq.length;i++){
   if(morseSeq[i]===' '){if(current){letters.push(MORSE_MAP[current]||'?');current='';}}
   else{current+=morseSeq[i];}
  }
  if(current)letters.push(MORSE_MAP[current]||'?');
  var word=letters.join('');
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  if(word==='SOS'){
   var flash=document.createElement('div');flash.style.cssText='position:fixed;inset:0;background:white;z-index:999999;opacity:0.8;transition:opacity 0.5s;';
   document.body.appendChild(flash);setTimeout(function(){flash.style.opacity='0';setTimeout(function(){flash.remove();},500);},200);
   var ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;';
   var box=document.createElement('div');box.style.cssText='background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:2rem;max-width:420px;width:90%;color:var(--text,#e4ddd0);text-align:center;';
   box.innerHTML='<h3 style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;">'+((L.morseSecret)||'Morse Easter Egg')+'</h3><p style="margin:1rem 0;font-style:italic;line-height:1.6;">'+((L.morseBackstory)||'Origin unknown.')+'</p><button style="background:var(--accent,#d4a03c);color:#000;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-weight:700;" onclick="this.parentElement.parentElement.remove();">OK</button>';
   ov.appendChild(box);ov.onclick=function(e){if(e.target===ov)ov.remove();};document.body.appendChild(ov);
  }else if(word==='HELP'){
   var helpBtn=document.querySelector('[data-panel="help"]')||document.querySelector('.btn-help')||document.querySelector('[title="Help"]');
   if(helpBtn)helpBtn.click();
  }
  if(word.length>0){console.log((L.morseDecoded||'Decoded: ')+word);}
  morseSeq=[];
 }
 document.addEventListener('keydown',function(e){
  if(e.code!=='Space'||e.repeat||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  e.preventDefault();keyDownTime=Date.now();if(morseTimer)clearTimeout(morseTimer);
 });
 document.addEventListener('keyup',function(e){
  if(e.code!=='Space'||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  var dur=Date.now()-keyDownTime;
  morseSeq.push(dur<200?'.':'-');
  if(morseTimer)clearTimeout(morseTimer);
  morseTimer=setTimeout(function(){morseSeq.push(' ');morseTimer=setTimeout(decodeMorse,1000);},300);
 });
}

/* === DNA FINGERPRINT VISUALIZER === */
function initDNAFingerprint(){
 if(document.getElementById('dnaBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var dnaBtn=document.createElement('button');dnaBtn.id='dnaBtn';dnaBtn.className='btn-icon-only';
 dnaBtn.textContent='\uD83E\uDDEC';dnaBtn.title=L.dnaTitle||'DNA Fingerprint';dnaBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(dnaBtn);else{dnaBtn.style.cssText+='position:fixed;top:0.5rem;right:6rem;z-index:9999;';document.body.appendChild(dnaBtn);}
 var panel=null;var canvas=null;var animId=null;
 function getSliderHues(){
  var sliders=document.querySelectorAll('input[type="range"]');var hues=[];
  sliders.forEach(function(s){var min=parseFloat(s.min)||0;var max=parseFloat(s.max)||100;var val=parseFloat(s.value);var ratio=(val-min)/(max-min||1);hues.push(Math.round(ratio*360));});
  if(hues.length===0)hues=[0,120,240];return hues;
 }
 function drawDNA(){
  if(!canvas)return;var ctx=canvas.getContext('2d');var w=canvas.width;var h=canvas.height;
  ctx.clearRect(0,0,w,h);var hues=getSliderHues();var t=Date.now()/1000;
  for(var x=0;x<w;x+=4){
   var phase=x/w*Math.PI*4+t;var y1=h/2+Math.sin(phase)*25;var y2=h/2+Math.sin(phase+Math.PI)*25;
   var hIdx=Math.floor((x/w)*hues.length)%hues.length;var hue=hues[hIdx]||0;
   ctx.beginPath();ctx.arc(x,y1,2,0,Math.PI*2);ctx.fillStyle='hsl('+hue+',80%,60%)';ctx.fill();
   ctx.beginPath();ctx.arc(x,y2,2,0,Math.PI*2);ctx.fillStyle='hsl('+(hue+180)%360+',80%,60%)';ctx.fill();
   if(x%12<4){ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.strokeStyle='hsla('+hue+',60%,50%,0.3)';ctx.lineWidth=1;ctx.stroke();}
  }
  animId=requestAnimationFrame(drawDNA);
 }
 dnaBtn.onclick=function(){
  if(panel){panel.remove();panel=null;if(animId)cancelAnimationFrame(animId);return;}
  panel=document.createElement('div');panel.style.cssText='position:fixed;bottom:80px;right:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;text-align:center;';
  panel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:6px;">'+(L.dnaTitle||'DNA Fingerprint')+'</div>';
  canvas=document.createElement('canvas');canvas.width=200;canvas.height=80;canvas.style.cssText='border-radius:8px;background:rgba(0,0,0,0.3);display:block;';
  panel.appendChild(canvas);
  var saveBtn=document.createElement('button');saveBtn.textContent=L.dnaSave||'Save DNA';
  saveBtn.style.cssText='margin-top:8px;background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 14px;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:700;';
  saveBtn.onclick=function(){var link=document.createElement('a');link.download='dna-fingerprint.png';link.href=canvas.toDataURL();link.click();};
  panel.appendChild(saveBtn);
  var info=document.createElement('div');info.style.cssText='color:var(--text,#e4ddd0);font-size:0.65rem;opacity:0.7;margin-top:4px;';info.textContent=L.dnaInfo||'Unique visual signature';
  panel.appendChild(info);document.body.appendChild(panel);drawDNA();
 };
}

/* === SANDBOX MODE === */
function initSandboxMode(){
 if(document.getElementById('sandboxBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var active=false;var originals=[];var customCount=0;
 var sandboxBtn=document.createElement('button');sandboxBtn.id='sandboxBtn';sandboxBtn.className='btn-icon-only';
 sandboxBtn.textContent='\uD83D\uDD27';sandboxBtn.title=L.sandboxTitle||'Sandbox Mode';sandboxBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(sandboxBtn);else{sandboxBtn.style.cssText+='position:fixed;top:0.5rem;right:9rem;z-index:9999;';document.body.appendChild(sandboxBtn);}
 var controlPanel=null;
 function storeOriginals(){
  originals=[];document.querySelectorAll('input[type="range"]').forEach(function(s){
   originals.push({el:s,min:s.min,max:s.max,val:s.value,step:s.step});
  });
 }
 function unlockSliders(){
  document.querySelectorAll('input[type="range"]').forEach(function(s){s.min='0';s.max='100';});
 }
 function restoreSliders(){
  originals.forEach(function(o){o.el.min=o.min;o.el.max=o.max;o.el.value=o.val;o.el.step=o.step;o.el.dispatchEvent(new Event('input',{bubbles:true}));});
 }
 function addCustomSlider(){
  customCount++;
  var name=prompt('Parameter name:','Custom-'+customCount);if(!name)return;
  var wrap=document.createElement('div');wrap.className='sandbox-custom-slider';wrap.style.cssText='margin:8px 0;padding:6px;background:rgba(0,0,0,0.2);border-radius:8px;';
  var lbl=document.createElement('label');lbl.textContent=name;lbl.style.cssText='color:var(--accent,#d4a03c);font-size:0.75rem;display:block;';
  var sl=document.createElement('input');sl.type='range';sl.min='0';sl.max='100';sl.value='50';sl.style.cssText='width:100%;';
  var valSpan=document.createElement('span');valSpan.textContent='50';valSpan.style.cssText='color:var(--text,#e4ddd0);font-size:0.7rem;';
  sl.oninput=function(){valSpan.textContent=sl.value;console.log('[Sandbox] '+name+': '+sl.value);};
  wrap.appendChild(lbl);wrap.appendChild(sl);wrap.appendChild(valSpan);
  if(controlPanel)controlPanel.appendChild(wrap);
 }
 sandboxBtn.onclick=function(){
  active=!active;
  if(active){
   sandboxBtn.style.background='var(--accent,#d4a03c)';sandboxBtn.style.color='#000';sandboxBtn.style.borderRadius='6px';
   storeOriginals();unlockSliders();
   controlPanel=document.createElement('div');controlPanel.id='sandboxPanel';
   controlPanel.style.cssText='position:fixed;bottom:80px;left:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;min-width:200px;max-height:300px;overflow-y:auto;';
   controlPanel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:8px;">'+(L.sandboxOn||'Sandbox ON')+'</div>';
   var addBtn=document.createElement('button');addBtn.textContent=L.sandboxAdd||'Add Parameter';
   addBtn.style.cssText='background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;font-weight:700;margin-right:6px;';
   addBtn.onclick=addCustomSlider;
   var resetBtn=document.createElement('button');resetBtn.textContent=L.sandboxReset||'Reset Defaults';
   resetBtn.style.cssText='background:transparent;color:var(--accent,#d4a03c);border:1px solid var(--accent,#d4a03c);padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;';
   resetBtn.onclick=function(){restoreSliders();};
   controlPanel.appendChild(addBtn);controlPanel.appendChild(resetBtn);document.body.appendChild(controlPanel);
  }else{
   sandboxBtn.style.background='';sandboxBtn.style.color='';sandboxBtn.style.borderRadius='';
   restoreSliders();
   if(controlPanel){controlPanel.remove();controlPanel=null;}
   document.querySelectorAll('.sandbox-custom-slider').forEach(function(el){el.remove();});
  }
 };
}
document.addEventListener('DOMContentLoaded',function(){try{initMorseEasterEgg();}catch(e){console.warn('Morse init:',e);}try{initDNAFingerprint();}catch(e){console.warn('DNA init:',e);}try{initSandboxMode();}catch(e){console.warn('Sandbox init:',e);}});


function T(k){return(LANG[currentLang]||LANG.en)[k]||LANG.en[k]||k;}
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(T('themeChanged')+' '+n,'info');}
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log('Cleared');}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log('Copied!','success');}catch{log('Copy failed','error');}}
function showToast(m,ms=0){const e=$('toastIndicator'),t=$('toastMessage');if(e&&t){t.textContent=m;e.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const e=$('toastIndicator');if(e)e.style.display='none';}
function setStatus(on){const p=$('statusPill'),t=$('statusText');if(t)t.textContent=on?T('connected'):T('disconnected');if(p)p.classList.toggle('connected',on);}
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');setTimeout(()=>s.remove(),600);}
let activeLogFilter='all';
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

/* ═══════ DOPPLER CANVAS ═══════ */
const canvas=$('dopplerCanvas'),ctx=canvas?canvas.getContext('2d'):null;
let dopplerHistory=[];

function drawDoppler(){
  if(!ctx||!freqArray)return;
  analyser.getByteFrequencyData(freqArray);
  const toneFreq=parseInt($('toneSelect').value);
  const binHz=audioCtx.sampleRate/analyser.fftSize;
  const toneBin=Math.round(toneFreq/binHz);
  const searchRange=30;
  let maxVal=0,maxBin=toneBin;
  for(let i=Math.max(0,toneBin-searchRange);i<Math.min(freqArray.length,toneBin+searchRange);i++){
    if(freqArray[i]>maxVal){maxVal=freqArray[i];maxBin=i;}
  }
  const shift=(maxBin-toneBin)*binHz;
  const sensitivity=parseInt($('sensitivityRange').value);
  const threshold=15-sensitivity;
  dopplerHistory.push({shift,level:maxVal,time:Date.now()});
  if(dopplerHistory.length>canvas.width)dopplerHistory.shift();

  // Detect intrusion
  if(Math.abs(shift)>threshold&&maxVal>50){
    alertLevel=Math.min(100,alertLevel+5);
    if(alertLevel>60){
      $('alertText').textContent=T('intrusion');$('alertText').style.color='#ef4444';
      $('alertFill').style.background='#ef4444';
      if(alertLevel===65){intrusionCount++;addEvent(shift);log(T('intrusion'),'error');}
    }else{
      $('alertText').textContent=shift>0?T('approaching'):T('retreating');$('alertText').style.color='#f59e0b';$('alertFill').style.background='#f59e0b';
    }
  }else{alertLevel=Math.max(0,alertLevel-2);if(alertLevel<10){$('alertText').textContent=T('secure');$('alertText').style.color='#22c55e';$('alertFill').style.background='#22c55e';}}
  $('alertFill').style.width=alertLevel+'%';
  $('shiftValue').textContent=shift.toFixed(1)+' Hz';
  $('direction').textContent=Math.abs(shift)<threshold?'---':shift>0?'>>> APPROACHING':'<<< RETREATING';
  $('fenceInfo').innerHTML='Armed: '+toneFreq/1000+' kHz<br>Sensitivity: '+sensitivity+'/10<br>Intrusions: '+intrusionCount;

  // Draw
  ctx.fillStyle='rgba(10,10,26,0.08)';ctx.fillRect(0,0,canvas.width,canvas.height);
  // Center line
  ctx.strokeStyle='rgba(0,255,170,0.2)';ctx.lineWidth=1;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(0,canvas.height/2);ctx.lineTo(canvas.width,canvas.height/2);ctx.stroke();ctx.setLineDash([]);
  // Doppler trace
  ctx.lineWidth=2;ctx.strokeStyle=alertLevel>60?'#ef4444':alertLevel>20?'#f59e0b':'#22c55e';ctx.beginPath();
  for(let i=0;i<dopplerHistory.length;i++){
    const y=canvas.height/2-dopplerHistory[i].shift*2;
    i===0?ctx.moveTo(i,y):ctx.lineTo(i,y);
  }
  ctx.stroke();
  // Level bars at right
  ctx.fillStyle='rgba(0,255,170,0.3)';
  for(let i=toneBin-searchRange;i<toneBin+searchRange;i++){
    const x=canvas.width-60+(i-(toneBin-searchRange));
    const h=freqArray[i]/255*canvas.height;
    ctx.fillRect(x,canvas.height-h,1,h);
  }
  // Labels
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='10px Orbitron';ctx.fillText('DOPPLER SHIFT',10,15);
  ctx.fillText('+Hz',canvas.width-75,15);ctx.fillText('-Hz',canvas.width-75,canvas.height-5);
}

function drawIdle(){
  if(!ctx)return;ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='rgba(0,255,170,0.15)';ctx.font='13px Orbitron';ctx.textAlign='center';
  ctx.fillText('DOPPLER RADAR — Arm Fence to Start',canvas.width/2,canvas.height/2);ctx.textAlign='left';
}

function animate(){drawDoppler();animId=requestAnimationFrame(animate);}

function addEvent(shift){
  const el=$('eventLog');if(!el)return;const d=document.createElement('div');
  d.style.cssText='padding:4px 8px;border-radius:6px;font-size:.8rem;font-family:Orbitron,monospace;background:rgba(239,68,68,.1);color:#ef4444;border-left:3px solid #ef4444;';
  d.textContent='['+new Date().toLocaleTimeString()+'] INTRUSION: Doppler shift '+shift.toFixed(1)+' Hz';
  el.appendChild(d);el.scrollTop=el.scrollHeight;
}

/* ═══════ ARM/DISARM ═══════ */
async function armFence(){
  if(!audioCtx)audioCtx=new AudioCtx();if(audioCtx.state==='suspended')await audioCtx.resume();
  try{
    micStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}});
    const src=audioCtx.createMediaStreamSource(micStream);analyser=audioCtx.createAnalyser();analyser.fftSize=4096;
    src.connect(analyser);freqArray=new Uint8Array(analyser.frequencyBinCount);
    // Emit tone
    osc=audioCtx.createOscillator();gainNode=audioCtx.createGain();
    osc.connect(gainNode);gainNode.connect(audioCtx.destination);
    osc.frequency.value=parseInt($('toneSelect').value);osc.type='sine';gainNode.gain.value=0.3;osc.start();
    isArmed=true;setStatus(true);dopplerHistory=[];alertLevel=0;intrusionCount=0;
    animate();log(T('armed'),'success');
  }catch(e){log('Mic denied: '+e.message,'error');}
}
function disarmFence(){
  isArmed=false;setStatus(false);
  if(osc){try{osc.stop();}catch{}osc=null;}
  if(micStream){micStream.getTracks().forEach(t=>t.stop());micStream=null;}
  if(animId){cancelAnimationFrame(animId);animId=null;}
  alertLevel=0;$('alertFill').style.width='0%';$('alertText').textContent=T('secure');$('alertText').style.color='#22c55e';
  log(T('disarmed'),'info');drawIdle();
}

function fillTheory(){const el=$('theoryInfo');if(!el)return;el.innerHTML='<b>Doppler Effect</b><br>When a sound source and observer move relative to each other, the observed frequency changes.<br><br><b>f_observed = f_source * (v + v_observer) / (v + v_source)</b><br><br>For our perimeter detector:<br>- We emit a constant ultrasonic tone<br>- The microphone picks up reflections<br>- Moving objects cause frequency shift in reflections<br>- Positive shift = object approaching<br>- Negative shift = object retreating<br><br><b>Applications:</b> Perimeter security, motion detection, speed measurement, medical ultrasound.';}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  setTimeout(dismissSplash,2500);
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);else setLanguage('en');}catch{setLanguage('en');}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  $('helpBtn').onclick=()=>{$('helpPanel').classList.toggle('open');$('helpOverlay').classList.toggle('active');};
  $('helpCloseBtn').onclick=$('helpOverlay').onclick=()=>{$('helpPanel').classList.remove('open');$('helpOverlay').classList.remove('active');};
  $('settingsBtn').onclick=()=>{$('settingsPanel').classList.toggle('open');$('settingsOverlay').classList.toggle('active');};
  $('settingsCloseBtn').onclick=$('settingsOverlay').onclick=()=>{$('settingsPanel').classList.remove('open');$('settingsOverlay').classList.remove('active');};
  $('logBtn').onclick=()=>$('logPanel').classList.toggle('open');$('logCloseBtn').onclick=()=>$('logPanel').classList.remove('open');
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;
  $('langSelect').onchange=e=>setLanguage(e.target.value);$('themeSelect').onchange=e=>setTheme(e.target.value);
  $('soundToggle').onchange=e=>{soundEnabled=e.target.checked;};
  document.querySelectorAll('.help-tab').forEach(tab=>{tab.onclick=()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active');};});
  document.querySelectorAll('.log-filter').forEach(btn=>{btn.onclick=()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();};});
  $('armBtn').onclick=armFence;$('disarmBtn').onclick=disarmFence;
  drawIdle();fillTheory();log(T('ready'),'success');
});

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Acoustic Fence
   Animated ultrasonic perimeter with Doppler wave propagation,
   intrusion zones, and frequency-shift visualization
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simAcousticFence';let cv,cx,W,H,af=null,t=0;
  const pulses=[];const intruders=[];const shiftHist=[];
  let fenceRadius=0,simIntrusions=0;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=280;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#06080e;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
    fenceRadius=Math.min(W,H)*0.35;
  }

  class UltrasonicPulse{
    constructor(){this.r=20;this.maxR=fenceRadius+30;this.alpha=0.5;this.speed=1.8;}
    update(){this.r+=this.speed;this.alpha=0.5*(1-this.r/this.maxR);return this.r<this.maxR;}
    draw(){
      cx.beginPath();cx.arc(W/2,H/2,this.r,0,Math.PI*2);
      cx.strokeStyle='rgba(0,255,170,'+this.alpha+')';cx.lineWidth=2;cx.stroke();
    }
  }

  class Intruder{
    constructor(){
      const angle=Math.random()*Math.PI*2;
      this.angle=angle;this.dist=fenceRadius+60;this.targetDist=40+Math.random()*60;
      this.speed=0.3+Math.random()*0.4;this.x=0;this.y=0;this.detected=false;
      this.life=300+Math.random()*200;this.age=0;this.dopplerShift=0;
    }
    update(){
      this.age++;
      if(this.dist>this.targetDist)this.dist-=this.speed;
      else{this.dist+=this.speed*0.5;this.targetDist=fenceRadius+60;}
      this.x=W/2+Math.cos(this.angle)*this.dist;
      this.y=H/2+Math.sin(this.angle)*this.dist;
      this.dopplerShift=this.dist>this.targetDist?this.speed*80:-this.speed*40;
      if(this.dist<fenceRadius&&!this.detected){this.detected=true;simIntrusions++;}
      return this.age<this.life;
    }
    draw(){
      const alpha=Math.min(1,(this.life-this.age)/40);
      cx.save();cx.globalAlpha=alpha;
      cx.beginPath();cx.arc(this.x,this.y,6,0,Math.PI*2);
      cx.fillStyle=this.detected?'rgba(239,68,68,0.6)':'rgba(245,158,11,0.5)';cx.fill();
      cx.strokeStyle=this.detected?'#ef4444':'#f59e0b';cx.lineWidth=1.5;cx.stroke();
      cx.font='9px sans-serif';cx.textAlign='center';cx.textBaseline='middle';
      cx.fillText('\u{1F6B6}',this.x,this.y);
      if(this.detected){
        cx.font='bold 7px monospace';cx.fillStyle='#ef4444';
        cx.fillText('ALERT',this.x,this.y-12);
      }
      cx.restore();
    }
  }

  function drawEmitter(){
    const pulse=4+Math.sin(t*3)*2;
    cx.save();cx.shadowColor='#00ffaa';cx.shadowBlur=pulse;
    cx.beginPath();cx.arc(W/2,H/2,18,0,Math.PI*2);
    cx.fillStyle='rgba(0,255,170,0.12)';cx.fill();
    cx.strokeStyle='#00ffaa';cx.lineWidth=2;cx.stroke();
    cx.shadowBlur=0;
    cx.font='14px sans-serif';cx.textAlign='center';cx.textBaseline='middle';
    cx.fillText('\u{1F50A}',W/2,H/2);
    cx.font='7px monospace';cx.fillStyle='#00ffaa';
    cx.fillText('EMITTER',W/2,H/2+26);cx.restore();
  }

  function drawPerimeter(){
    cx.setLineDash([6,8]);
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.lineWidth=1;
    cx.beginPath();cx.arc(W/2,H/2,fenceRadius,0,Math.PI*2);cx.stroke();
    cx.setLineDash([]);
    cx.fillStyle='rgba(0,255,170,0.04)';
    cx.beginPath();cx.arc(W/2,H/2,fenceRadius,0,Math.PI*2);cx.fill();
    // Zone labels
    cx.font='7px monospace';cx.fillStyle='rgba(0,255,170,0.3)';cx.textAlign='center';
    cx.fillText('SECURE ZONE',W/2,H/2+fenceRadius+12);
  }

  function drawDopplerGraph(){
    const gx=W-180,gy=20,gw=160,gh=80;
    cx.fillStyle='rgba(0,0,0,0.4)';cx.fillRect(gx,gy,gw,gh);
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.lineWidth=0.5;
    cx.beginPath();cx.moveTo(gx,gy+gh/2);cx.lineTo(gx+gw,gy+gh/2);cx.stroke();
    if(shiftHist.length>1){
      cx.strokeStyle='#22c55e';cx.lineWidth=1.5;cx.beginPath();
      const step=gw/Math.max(1,shiftHist.length-1);
      shiftHist.forEach((v,i)=>{
        const x=gx+i*step;
        const y=gy+gh/2-v/200*gh*0.4;
        if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
      });
      cx.stroke();
    }
    cx.fillStyle='rgba(0,255,170,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('DOPPLER SHIFT',gx+4,gy+10);
    cx.fillText('+Hz',gx+4,gy+20);
    cx.textAlign='right';cx.fillText('-Hz',gx+gw-4,gy+gh-4);
    cx.textAlign='left';
  }

  function drawFreqBands(){
    const bx=20,by=H-50,bw=W*0.4,bh=35;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(bx,by,bw,bh);
    // Simulated ultrasonic frequency spectrum
    const bins=64;const binW=bw/bins;
    for(let i=0;i<bins;i++){
      const tonePos=bins*0.6;
      const dist=Math.abs(i-tonePos);
      let h2=Math.max(1,(1-dist/20)*bh*0.8+Math.random()*3);
      if(dist>20)h2=Math.random()*3;
      const approaching=intruders.some(n=>!n.detected&&n.dist<fenceRadius+20);
      const col=approaching&&dist<5?'rgba(239,68,68,0.7)':'rgba(0,255,170,'+(0.2+h2/bh*0.5)+')';
      cx.fillStyle=col;
      cx.fillRect(bx+i*binW,by+bh-h2,binW-1,h2);
    }
    cx.fillStyle='rgba(0,255,170,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('18 kHz                          22 kHz',bx+4,by+bh+10);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,180,68);
    cx.strokeStyle='rgba(0,255,170,0.15)';cx.strokeRect(8,8,180,68);
    cx.font='10px monospace';cx.fillStyle='#00ffaa';cx.textAlign='left';
    cx.fillText('\u{1F50A} ACOUSTIC FENCE',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Active Targets: '+intruders.length,16,40);
    cx.fillText('Intrusions: '+simIntrusions,16,54);
    const alertLvl=intruders.some(n=>n.detected)?'HIGH':'LOW';
    cx.fillStyle=alertLvl==='HIGH'?'#ef4444':'#22c55e';
    cx.fillText('Alert: '+alertLvl,16,68);
    cx.restore();
  }

  function drawScanSweep(){
    cx.save();cx.translate(W/2,H/2);cx.rotate(t*0.8);
    const grad=cx.createLinearGradient(0,0,fenceRadius,0);
    grad.addColorStop(0,'rgba(0,255,170,0.15)');grad.addColorStop(1,'rgba(0,255,170,0)');
    cx.beginPath();cx.moveTo(0,0);cx.arc(0,0,fenceRadius,-0.12,0.12);cx.closePath();
    cx.fillStyle=grad;cx.fill();cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(6,8,14,0.12)';cx.fillRect(0,0,W,H);

    // Spawn pulses
    if(Math.floor(t*60)%20===0)pulses.push(new UltrasonicPulse());

    // Spawn intruders
    if(Math.random()<0.005&&intruders.length<6)intruders.push(new Intruder());

    // Aggregate doppler shift
    let avgShift=0;
    intruders.forEach(n=>{avgShift+=n.dopplerShift;});
    avgShift/=Math.max(1,intruders.length);
    avgShift+=(Math.random()-0.5)*10;
    shiftHist.push(avgShift);if(shiftHist.length>100)shiftHist.shift();

    drawPerimeter();drawScanSweep();

    // Pulses
    for(let i=pulses.length-1;i>=0;i--){
      if(!pulses[i].update())pulses.splice(i,1);
      else pulses[i].draw();
    }

    drawEmitter();

    // Intruders
    for(let i=intruders.length-1;i>=0;i--){
      if(!intruders[i].update())intruders.splice(i,1);
      else{
        intruders[i].draw();
        // Detection line to emitter
        if(intruders[i].dist<fenceRadius+10){
          cx.strokeStyle=intruders[i].detected?'rgba(239,68,68,0.15)':'rgba(245,158,11,0.08)';
          cx.lineWidth=1;cx.beginPath();
          cx.moveTo(intruders[i].x,intruders[i].y);cx.lineTo(W/2,H/2);cx.stroke();
        }
      }
    }

    drawDopplerGraph();drawFreqBands();drawHUD();

    // Footer
    cx.fillStyle='rgba(0,255,170,0.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Ultrasonic Doppler Perimeter — 20 kHz Emission Simulation',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
})();
