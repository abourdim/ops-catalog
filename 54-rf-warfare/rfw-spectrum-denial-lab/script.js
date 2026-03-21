/**
 * Workshop DIY — Spectrum Denial Lab v1.2
 * Themes · i18n · RTL · Log · Toast · Status · Panels · Canvas RF Viz
 */
const $ = id => document.getElementById(id);
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){osc.frequency.value=800;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);}else if(type==='success'){osc.frequency.value=523;osc.type='sine';gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);}else if(type==='error'){osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);}}

/* ═══════ i18n ═══════ */
const LANG = {
  en:{title:'Spectrum Denial Lab',subtitle:'Spectrum Denial Lab',disconnected:'Idle',connected:'Denying',mainSection:'Spectrum Denial Lab',mainDesc:'RF area denial zones and frequency blocking simulation',sectionA:'Denial Zones',sectionB:'Denial Techniques',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'What is this app?',faq_a1:'A spectrum denial simulator for educational RF warfare studies.',faq_q2:'What is spectrum denial?',faq_a2:'Preventing adversary use of specific RF frequency bands in an area.',faq_q3:'Is this real?',faq_a3:'No. Visual simulation only.',faq_q4:'Data private?',faq_a4:'Yes. Everything runs locally.',howto_1:'Set denial zone radius and power.',howto_2:'Define frequency range to deny.',howto_3:'Click Activate Denial.',howto_4:'Add multiple overlapping zones.',working:'Working...',ready:'Spectrum Denial Lab ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',export:'Export',filterAll:'All',soundEffects:'Sound effects',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',activateDenial:'Activate Denial',deactivateDenial:'Deactivate',addZone:'Add Zone',resetSim:'Reset',zoneParams:'Denial Zone',freqParams:'Frequency Range',zoneRadius:'Radius (km):',denialPower:'Power (dBm):',startFreq:'Start (MHz):',endFreq:'End (MHz):',denialStatus:'Denial Status',zoneHint:'Active denial zones and blocked bands.'},
  fr:{title:'Labo Deni Spectral',subtitle:'Labo Deni Spectral',disconnected:'Inactif',connected:'Deni actif',mainSection:'Labo Deni Spectral',mainDesc:'Zones de deni RF et blocage de frequences',sectionA:'Zones de Deni',sectionB:'Techniques de Deni',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'C\'est quoi?',faq_a1:'Un simulateur de deni spectral educatif.',faq_q2:'C\'est quoi le deni spectral?',faq_a2:'Empecher l\'utilisation ennemie de bandes RF.',faq_q3:'C\'est reel?',faq_a3:'Non. Simulation visuelle.',faq_q4:'Donnees privees?',faq_a4:'Oui. Tout est local.',howto_1:'Definir rayon et puissance.',howto_2:'Definir plage de frequences.',howto_3:'Cliquer Activer.',howto_4:'Ajouter plusieurs zones.',working:'En cours...',ready:'Labo pret!',logCleared:'Journal efface',copied:'Copie!',copyFail:'Echec',export:'Exporter',filterAll:'Tout',soundEffects:'Effets sonores',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',activateDenial:'Activer Deni',deactivateDenial:'Desactiver',addZone:'Ajouter Zone',resetSim:'Reinitialiser',zoneParams:'Zone de Deni',freqParams:'Plage Frequences',zoneRadius:'Rayon (km):',denialPower:'Puissance (dBm):',startFreq:'Debut (MHz):',endFreq:'Fin (MHz):',denialStatus:'Statut Deni',zoneHint:'Zones actives et bandes bloquees.'},
  ar:{title:'\u0645\u062e\u062a\u0628\u0631 \u062d\u0631\u0645\u0627\u0646 \u0627\u0644\u0637\u064a\u0641',subtitle:'\u0645\u062e\u062a\u0628\u0631 \u062d\u0631\u0645\u0627\u0646 \u0627\u0644\u0637\u064a\u0641',disconnected:'\u062e\u0627\u0645\u0644',connected:'\u062d\u0631\u0645\u0627\u0646 \u0646\u0634\u0637',mainSection:'\u0645\u062e\u062a\u0628\u0631 \u062d\u0631\u0645\u0627\u0646 \u0627\u0644\u0637\u064a\u0641',mainDesc:'\u0645\u062d\u0627\u0643\u0627\u0629 \u0645\u0646\u0627\u0637\u0642 \u062d\u0631\u0645\u0627\u0646 RF',sectionA:'\u0645\u0646\u0627\u0637\u0642 \u0627\u0644\u062d\u0631\u0645\u0627\u0646',sectionB:'\u062a\u0642\u0646\u064a\u0627\u062a \u0627\u0644\u062d\u0631\u0645\u0627\u0646',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',working:'\u062c\u0627\u0631\u064d...',ready:'\u0627\u0644\u0645\u062e\u062a\u0628\u0631 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645 \u0627\u0644\u0646\u0633\u062e!',copyFail:'\u0641\u0634\u0644',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a \u0635\u0648\u062a\u064a\u0629',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062a\u062e\u0637\u064a',langChanged:'\u0627\u0644\u0644\u063a\u0629: \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631:',activateDenial:'\u062a\u0641\u0639\u064a\u0644 \u0627\u0644\u062d\u0631\u0645\u0627\u0646',deactivateDenial:'\u0625\u064a\u0642\u0627\u0641',addZone:'\u0625\u0636\u0627\u0641\u0629 \u0645\u0646\u0637\u0642\u0629',resetSim:'\u0625\u0639\u0627\u062f\u0629 \u062a\u0639\u064a\u064a\u0646',zoneParams:'\u0645\u0646\u0637\u0642\u0629 \u0627\u0644\u062d\u0631\u0645\u0627\u0646',freqParams:'\u0646\u0637\u0627\u0642 \u0627\u0644\u062a\u0631\u062f\u062f',zoneRadius:'\u0627\u0644\u0646\u0635\u0641 \u0642\u0637\u0631:',denialPower:'\u0627\u0644\u0642\u062f\u0631\u0629:',startFreq:'\u0627\u0644\u0628\u062f\u0627\u064a\u0629:',endFreq:'\u0627\u0644\u0646\u0647\u0627\u064a\u0629:',denialStatus:'\u062d\u0627\u0644\u0629 \u0627\u0644\u062d\u0631\u0645\u0627\u0646',zoneHint:'\u0627\u0644\u0645\u0646\u0627\u0637\u0642 \u0627\u0644\u0646\u0634\u0637\u0629.'}
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


let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}

/* ═══════ THEMES ═══════ */
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(LANG[currentLang].themeChanged+' '+name,'info');}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const blob=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='sd-log-'+new Date().toISOString().slice(0,10)+'.txt';a.click();}

/* ═══════ TOAST / STATUS / SPLASH ═══════ */
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}
function setStatus(on){const pill=$('statusPill'),txt=$('statusText'),s=LANG[currentLang];if(txt)txt.textContent=on?s.connected:s.disconnected;if(pill)pill.classList.toggle('connected',on);}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}

/* ═══════ LOG FILTERS ═══════ */
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}

/* ═══════ PANELS ═══════ */
function initPanels(){const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hPanel=$('helpPanel'),hOver=$('helpOverlay');const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sPanel=$('settingsPanel'),sOver=$('settingsOverlay');const lBtn=$('logBtn'),lClose=$('logCloseBtn'),lPanel=$('logPanel');if(hBtn)hBtn.onclick=()=>{hPanel.classList.toggle('open');hOver.classList.toggle('active');playSound('click');};if(hClose)hClose.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(hOver)hOver.onclick=()=>{hPanel.classList.remove('open');hOver.classList.remove('active');};if(sBtn)sBtn.onclick=()=>{sPanel.classList.toggle('open');sOver.classList.toggle('active');playSound('click');};if(sClose)sClose.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(sOver)sOver.onclick=()=>{sPanel.classList.remove('open');sOver.classList.remove('active');};if(lBtn)lBtn.onclick=()=>{lPanel.classList.toggle('open');playSound('click');};if(lClose)lClose.onclick=()=>lPanel.classList.remove('open');const langSel=$('langSelect'),themeSel=$('themeSelect'),sndTog=$('soundToggle');if(langSel)langSel.onchange=()=>setLanguage(langSel.value);if(themeSel)themeSel.onchange=()=>setTheme(themeSel.value);if(sndTog)sndTog.onchange=()=>{soundEnabled=sndTog.checked;};const clearBtn=$('clearLogBtn'),copyBtn=$('copyLogBtn'),expBtn=$('exportLogBtn');if(clearBtn)clearBtn.onclick=clearLog;if(copyBtn)copyBtn.onclick=copyLog;if(expBtn)expBtn.onclick=exportLog;document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));tab.classList.add('active');document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));const target=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(target)target.classList.add('active');playSound('click');});});}

/* ═══════ DENIAL DATA ═══════ */
let zones = [];
let denialActive = false;
let time = 0;
let zoneIdCounter = 0;

function addZone(){
  const r = parseFloat($('radiusInput')?.value||15);
  const p = parseFloat($('powerInput')?.value||30);
  const f1 = parseFloat($('startFreqInput')?.value||400);
  const f2 = parseFloat($('endFreqInput')?.value||2500);
  const cx = 100+Math.random()*580;
  const cy = 80+Math.random()*190;
  zoneIdCounter++;
  zones.push({id:'DZ-'+zoneIdCounter, cx, cy, radius:r, power:p, freqStart:f1, freqEnd:f2, active:denialActive});
  log('Zone DZ-'+zoneIdCounter+' added: '+f1+'-'+f2+' MHz, '+r+' km','tx');
}

/* ═══════ ZONE CANVAS ═══════ */
function drawZoneMap(){
  const c=$('zoneCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);

  // Grid
  for(let i=0;i<20;i++){const x=i*W/20;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle='rgba(0,255,136,0.06)';ctx.lineWidth=1;ctx.stroke();}
  for(let i=0;i<10;i++){const y=i*H/10;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.strokeStyle='rgba(0,255,136,0.06)';ctx.stroke();}

  // Terrain reference points
  const pois=[{x:150,y:100,label:'BASE-A'},{x:500,y:200,label:'BASE-B'},{x:350,y:280,label:'HQ'},{x:650,y:120,label:'RELAY'}];
  pois.forEach(p=>{
    ctx.beginPath();ctx.arc(p.x,p.y,4,0,Math.PI*2);ctx.fillStyle='rgba(0,200,255,0.7)';ctx.fill();
    ctx.fillStyle='rgba(0,200,255,0.5)';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';ctx.fillText(p.label,p.x,p.y-8);
  });

  // Denial zones
  zones.forEach(z=>{
    const isActive = denialActive && z.active;
    const r = z.radius*3;
    // Zone circle
    const grad = ctx.createRadialGradient(z.cx,z.cy,0,z.cx,z.cy,r);
    if(isActive){
      grad.addColorStop(0,'rgba(255,50,50,0.3)');
      grad.addColorStop(0.7,'rgba(255,50,50,0.1)');
      grad.addColorStop(1,'rgba(255,50,50,0)');
    } else {
      grad.addColorStop(0,'rgba(100,100,100,0.2)');
      grad.addColorStop(1,'rgba(100,100,100,0)');
    }
    ctx.beginPath();ctx.arc(z.cx,z.cy,r,0,Math.PI*2);ctx.fillStyle=grad;ctx.fill();
    // Pulsing border
    if(isActive){
      const pulseR = r+Math.sin(time*3)*8;
      ctx.beginPath();ctx.arc(z.cx,z.cy,pulseR,0,Math.PI*2);
      ctx.strokeStyle='rgba(255,50,50,0.5)';ctx.lineWidth=2;ctx.stroke();
      // Interference lines
      for(let a=0;a<Math.PI*2;a+=Math.PI/6){
        const len=r*0.3+Math.random()*r*0.4;
        ctx.beginPath();ctx.moveTo(z.cx,z.cy);
        ctx.lineTo(z.cx+Math.cos(a+time)*len,z.cy+Math.sin(a+time)*len);
        ctx.strokeStyle='rgba(255,100,50,0.3)';ctx.lineWidth=1;ctx.stroke();
      }
    }
    ctx.fillStyle=isActive?'#ff6666':'#888';ctx.font='10px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillText(z.id,z.cx,z.cy-r-5);
    ctx.fillText(z.freqStart+'-'+z.freqEnd+' MHz',z.cx,z.cy+4);
  });

  ctx.fillStyle='rgba(0,255,136,0.6)';ctx.font='12px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('AREA DENIAL MAP',10,18);
  if(denialActive){ctx.fillStyle='rgba(255,50,50,0.8)';ctx.fillText('DENIAL ACTIVE — '+zones.length+' ZONES',10,34);}
}

/* ═══════ BAND CANVAS ═══════ */
function drawBandView(){
  const c=$('bandCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  const W=c.width,H=c.height;
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);

  // Frequency axis
  ctx.fillStyle='rgba(0,255,136,0.3)';ctx.font='9px Orbitron,monospace';ctx.textAlign='center';
  for(let f=0;f<=6000;f+=500){
    const x=(f/6000)*W;
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.strokeStyle='rgba(0,255,136,0.1)';ctx.lineWidth=1;ctx.stroke();
    ctx.fillText(f+'',x,H-3);
  }

  // Denied bands
  zones.forEach(z=>{
    if(!denialActive||!z.active)return;
    const x1=(z.freqStart/6000)*W;
    const x2=(z.freqEnd/6000)*W;
    ctx.fillStyle='rgba(255,50,50,0.3)';
    ctx.fillRect(x1,5,x2-x1,H-20);
    // Noise within denied band
    ctx.beginPath();
    for(let x=x1;x<x2;x+=3){
      const y=H/2+Math.random()*30-15;
      if(x===x1)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle='rgba(255,100,100,0.6)';ctx.lineWidth=1;ctx.stroke();
  });

  // Clean spectrum outside
  ctx.beginPath();
  for(let x=0;x<W;x++){
    let denied=false;
    const freq=(x/W)*6000;
    zones.forEach(z=>{if(denialActive&&z.active&&freq>=z.freqStart&&freq<=z.freqEnd)denied=true;});
    const y=denied?H/2+Math.random()*20-10:H*0.7+Math.random()*6-3;
    if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle='rgba(0,200,255,0.5)';ctx.lineWidth=1;ctx.stroke();

  ctx.fillStyle='rgba(0,255,136,0.5)';ctx.font='10px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('FREQUENCY DENIAL BANDS (0-6 GHz)',5,14);
}

/* ═══════ ANIMATION ═══════ */
function animate(){time+=0.016;drawZoneMap();drawBandView();updateStats();requestAnimationFrame(animate);}

function updateStats(){
  const stats=$('denialStats');if(!stats)return;
  const activeZones=zones.filter(z=>z.active).length;
  let totalBW=0;zones.forEach(z=>{if(z.active)totalBW+=z.freqEnd-z.freqStart;});
  stats.innerHTML='<b>Zones:</b> '+zones.length+' ('+activeZones+' active)<br><b>Denied BW:</b> '+(denialActive?totalBW:0)+' MHz<br><b>Status:</b> '+(denialActive?'<span style="color:#ff4444">DENYING</span>':'<span style="color:#00cc88">STANDBY</span>');
}

function updateZoneList(){
  const lib=$('zoneList');if(!lib)return;lib.innerHTML='';
  zones.forEach(z=>{
    const row=document.createElement('div');
    row.style.cssText='display:flex;justify-content:space-between;padding:3px 6px;border-radius:4px;font-size:.78rem;background:'+(z.active&&denialActive?'rgba(255,50,50,0.1)':'rgba(0,200,255,0.05)');
    row.innerHTML='<span style="color:'+(z.active&&denialActive?'#ff6666':'#66ccff')+'">'+z.id+'</span><span>'+z.freqStart+'-'+z.freqEnd+' MHz</span><span>'+z.radius+' km</span><span>'+z.power+' dBm</span><span style="color:'+(z.active&&denialActive?'#ff4444':'#888')+'">'+(z.active&&denialActive?'DENIED':'READY')+'</span>';
    lib.appendChild(row);
  });
}

/* ═══════ TECHNIQUES ═══════ */
function initTechDatabase(){const db=$('techDatabase');if(!db)return;db.innerHTML=['<b>Broadband Denial:</b> Flood entire frequency ranges with noise.','<b>Selective Denial:</b> Target specific communication bands only.','<b>Reactive Denial:</b> Detect and deny signals on demand.','<b>Layered Denial:</b> Multiple overlapping zones for redundancy.','<b>Time-based Denial:</b> Schedule denial windows for operations.','<b>Adaptive Power:</b> Adjust power based on threat proximity.'].join('<br><br>');}

/* ═══════ CONTROLS ═══════ */
function initControls(){
  $('radiusInput').oninput=()=>{$('radiusLabel').textContent=$('radiusInput').value+' km';};
  $('powerInput').oninput=()=>{$('powerLabel').textContent=$('powerInput').value+' dBm';};
  $('startFreqInput').oninput=()=>{$('startFreqLabel').textContent=$('startFreqInput').value+' MHz';};
  $('endFreqInput').oninput=()=>{$('endFreqLabel').textContent=$('endFreqInput').value+' MHz';};

  $('denyBtn').onclick=()=>{
    denialActive=!denialActive;
    zones.forEach(z=>z.active=denialActive);
    setStatus(denialActive);
    $('denyBtn').querySelector('[data-i18n]').textContent=denialActive?LANG[currentLang].deactivateDenial:LANG[currentLang].activateDenial;
    log(denialActive?'Spectrum denial ACTIVATED — '+zones.length+' zones':'Denial DEACTIVATED',denialActive?'error':'info');
    if(denialActive)showToast('Denial active...',2000);
  };

  $('addZoneBtn').onclick=()=>{addZone();playSound('click');};
  $('resetBtn').onclick=()=>{denialActive=false;zones=[];zoneIdCounter=0;setStatus(false);$('denyBtn').querySelector('[data-i18n]').textContent=LANG[currentLang].activateDenial;log('Simulation reset','info');playSound('click');};
}

/* ═══════ INIT ═══════ */
document.addEventListener('DOMContentLoaded',()=>{
  initSplash();initPanels();initLogFilters();initTechDatabase();initControls();
  addZone();addZone();
  try{const l=localStorage.getItem('wdiy-lang');if(l)setLanguage(l);}catch{}
  try{const t=localStorage.getItem('wdiy-theme');if(t)setTheme(t);}catch{}
  log(LANG[currentLang].ready,'success');
  animate();
  setInterval(updateZoneList,1000);
});

/* ═══════ ENHANCED RF CANVAS — SPECTRUM DENIAL ═══════ */
(function(){
const _$=id=>document.getElementById(id);let _t=0;
let _coverageHistory=new Array(200).fill(0);let _denialParticles=[];
let _signalAttempts=[];let _interferenceMap=[];

class DenialParticle{constructor(x,y){this.x=x;this.y=y;this.vx=(Math.random()-0.5)*3;this.vy=(Math.random()-0.5)*3;this.life=1;this.decay=0.015+Math.random()*0.015;this.size=1+Math.random()*3;}
update(){this.x+=this.vx;this.y+=this.vy;this.vx*=0.98;this.vy*=0.98;this.life-=this.decay;return this.life>0;}
draw(ctx){ctx.beginPath();ctx.arc(this.x,this.y,this.size*this.life,0,Math.PI*2);ctx.fillStyle='rgba(255,80,50,'+this.life*0.5+')';ctx.fill();}}

/* ── Signal Attempt Monitoring ── */
function drawSignalAttempts(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('SIGNAL PENETRATION ATTEMPTS',5,12);
  const isDeny=typeof denialActive!=='undefined'&&denialActive;
  if(isDeny&&Math.random()>0.92){
    _signalAttempts.push({x:Math.random()*W,freq:100+Math.random()*5800,power:-60+Math.random()*40,blocked:Math.random()>0.2,time:_t});
    if(_signalAttempts.length>40)_signalAttempts.shift();
  }
  _signalAttempts.forEach((a,i)=>{
    const y=25+((a.freq-100)/5800)*(H-35);const age=_t-a.time;const alpha=Math.max(0.1,1-age*0.3);
    ctx.beginPath();ctx.arc(a.x,y,4,0,Math.PI*2);
    ctx.fillStyle=a.blocked?'rgba(255,50,50,'+alpha+')':'rgba(0,255,136,'+alpha+')';ctx.fill();
    if(a.blocked){ctx.beginPath();ctx.moveTo(a.x-4,y-4);ctx.lineTo(a.x+4,y+4);ctx.moveTo(a.x+4,y-4);ctx.lineTo(a.x-4,y+4);
      ctx.strokeStyle='rgba(255,50,50,'+alpha+')';ctx.lineWidth=2;ctx.stroke();}
  });
  const blocked=_signalAttempts.filter(a=>a.blocked).length;
  const total=_signalAttempts.length||1;
  ctx.fillStyle='rgba(255,50,50,0.5)';ctx.font='8px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText('BLOCKED: '+blocked+'/'+total+' ('+(blocked/total*100).toFixed(0)+'%)',W-10,H-5);
}

/* ── Coverage Effectiveness Timeline ── */
function drawCoverageTimeline(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('DENIAL COVERAGE EFFECTIVENESS',5,12);
  const isDeny=typeof denialActive!=='undefined'&&denialActive;
  const zoneCount=typeof zones!=='undefined'?zones.filter(z=>z.active).length:0;
  const eff=isDeny?Math.min(99,zoneCount*25+Math.random()*10):Math.random()*3;
  _coverageHistory.push(eff);if(_coverageHistory.length>200)_coverageHistory.shift();
  // Fill area
  ctx.beginPath();ctx.moveTo(0,H-10);
  _coverageHistory.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/100)*(H-25);ctx.lineTo(x,y);});
  ctx.lineTo(W,H-10);ctx.closePath();
  ctx.fillStyle=isDeny?'rgba(255,50,50,0.1)':'rgba(0,200,255,0.05)';ctx.fill();
  // Line
  ctx.beginPath();
  _coverageHistory.forEach((v,i)=>{const x=(i/200)*W;const y=H-10-(v/100)*(H-25);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
  ctx.strokeStyle=isDeny?'rgba(255,80,80,0.8)':'rgba(0,200,255,0.5)';ctx.lineWidth=2;ctx.stroke();
  const last=_coverageHistory[_coverageHistory.length-1];
  ctx.fillStyle=last>60?'rgba(255,50,50,0.7)':'rgba(255,200,0,0.7)';ctx.font='14px Orbitron,monospace';ctx.textAlign='right';
  ctx.fillText(last.toFixed(0)+'%',W-10,30);
}

/* ── Spectral Occupancy Heatmap ── */
function drawSpectralHeatmap(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('SPECTRAL OCCUPANCY HEATMAP',5,12);
  const isDeny=typeof denialActive!=='undefined'&&denialActive;
  const step=8;const rows=Math.floor((H-25)/step);const cols=Math.floor(W/step);
  for(let r=0;r<rows;r++){for(let c=0;c<cols;c++){
    const freq=(c/cols)*6000;const tSlot=r;
    let occ=Math.random()*20;
    if(isDeny&&typeof zones!=='undefined'){zones.forEach(z=>{if(z.active&&freq>=z.freqStart&&freq<=z.freqEnd)occ+=60+Math.random()*30;});}
    const norm=Math.min(1,occ/100);
    const red=norm>0.5?255:norm*500;const grn=norm<0.4?150:150*(1-norm);const blu=norm<0.3?200:0;
    ctx.fillStyle='rgba('+Math.floor(red)+','+Math.floor(grn)+','+Math.floor(blu)+',0.6)';
    ctx.fillRect(c*step,20+r*step,step-1,step-1);
  }}
  ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
  for(let f=0;f<=6000;f+=1000){const x=(f/6000)*W;ctx.fillText(f+'',x,H-2);}
}

/* ── Zone Overlap Analysis ── */
function drawZoneOverlap(ctx,W,H){
  ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='9px Orbitron,monospace';ctx.textAlign='left';
  ctx.fillText('ZONE FREQUENCY OVERLAP MATRIX',5,12);
  if(typeof zones==='undefined'||zones.length===0)return;
  const n=zones.length;const cellW=Math.min(40,(W-40)/n);const cellH=Math.min(25,(H-40)/n);
  zones.forEach((za,i)=>{
    zones.forEach((zb,j)=>{
      const x=30+j*cellW;const y=30+i*cellH;
      let overlap=0;
      if(i===j)overlap=1;
      else{const s=Math.max(za.freqStart,zb.freqStart);const e=Math.min(za.freqEnd,zb.freqEnd);
        if(s<e)overlap=(e-s)/Math.max(za.freqEnd-za.freqStart,1);}
      ctx.fillStyle=overlap>0.5?'rgba(255,50,50,0.5)':overlap>0?'rgba(255,200,0,0.3)':'rgba(0,200,255,0.1)';
      ctx.fillRect(x,y,cellW-2,cellH-2);
      if(overlap>0){ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
        ctx.fillText((overlap*100).toFixed(0)+'%',x+cellW/2,y+cellH/2+3);}
    });
    ctx.fillStyle='rgba(0,255,136,0.4)';ctx.font='7px Orbitron,monospace';ctx.textAlign='right';
    ctx.fillText(zones[i].id,28,30+i*cellH+cellH/2+3);
    ctx.textAlign='center';ctx.fillText(zones[i].id,30+i*cellW+cellW/2,28);
  });
}

function enhancedRender(){
  _t+=0.016;
  for(let i=_denialParticles.length-1;i>=0;i--)if(!_denialParticles[i].update())_denialParticles.splice(i,1);
  const zc=_$('zoneCanvas');
  if(zc){const ctx=zc.getContext('2d');
    if(typeof denialActive!=='undefined'&&denialActive&&typeof zones!=='undefined'){
      zones.forEach(z=>{if(z.active){for(let i=0;i<2;i++)_denialParticles.push(new DenialParticle(z.cx,z.cy));}});
      _denialParticles.forEach(p=>p.draw(ctx));
    }
  }
  const bc=_$('bandCanvas');
  if(bc){const ctx=bc.getContext('2d');const W=bc.width,H=bc.height;
    ctx.clearRect(0,0,W,H);ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,W,H);
    drawCoverageTimeline(ctx,W,H*0.5);
    ctx.save();ctx.translate(0,H*0.5);drawSignalAttempts(ctx,W,H*0.5);ctx.restore();}
  requestAnimationFrame(enhancedRender);
}
setTimeout(()=>{enhancedRender();},500);
})();
