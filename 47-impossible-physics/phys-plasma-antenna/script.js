/**
 * Plasma Antenna — Workshop DIY v1.0
 * Full canvas-based plasma antenna simulation with radiation patterns,
 * ionized gas visualization, and antenna metrics.
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><line x1="50" y1="90" x2="50" y2="10" stroke="currentColor" stroke-width="3" opacity=".5"><animate attributeName="opacity" values=".3;.8;.3" dur="1s" repeatCount="indefinite"/></line><circle cx="50" cy="30" r="5" fill="currentColor" opacity=".6"><animate attributeName="r" values="3;8;3" dur="1.5s" repeatCount="indefinite"/></circle><circle cx="50" cy="50" r="3" fill="currentColor" opacity=".4"><animate attributeName="r" values="2;6;2" dur="1.2s" repeatCount="indefinite"/></circle><circle cx="50" cy="70" r="4" fill="currentColor" opacity=".5"><animate attributeName="r" values="3;7;3" dur="1.3s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES = ['riad', 'medina'];
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return; if (!audioCtx) audioCtx = new AudioCtx();
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.connect(g); g.connect(audioCtx.destination); g.gain.value = 0.08;
  const t = audioCtx.currentTime;
  if (type === 'click') { o.frequency.value = 800; g.gain.exponentialRampToValueAtTime(0.001, t + .08); o.start(t); o.stop(t + .08); }
  else if (type === 'success') { o.frequency.value = 523; g.gain.exponentialRampToValueAtTime(0.001, t + .3); o.start(t); o.stop(t + .3); }
  else if (type === 'error') { o.frequency.value = 200; o.type = 'square'; g.gain.exponentialRampToValueAtTime(0.001, t + .25); o.start(t); o.stop(t + .25); }
}

const LANG = {
  en: {
    title: 'Plasma Antenna', subtitle: '⚡ Ionized gas RF elements',
    disconnected: 'Offline', connected: 'Ignited',
    mainSection: 'Plasma Antenna', mainDesc: 'Simulate reconfigurable plasma antenna with ionized gas columns',
    sectionA: 'Antenna Metrics', sectionB: 'Radiation Pattern', sectionC: 'Theory',
    activityLog: '📜 Activity Log', eventsMsg: 'Events & messages',
    clear: 'Clear', copy: 'Copy', export: 'Export', theme: 'Theme',
    settings: '⚙️ Settings', language: 'Language',
    help: '❓ Help', faq: 'FAQ', howto: 'How-To', wiki: 'Wiki',
    faq_q1: 'What is a plasma antenna?', faq_a1: 'An antenna using ionized gas (plasma) instead of metal as its conducting element.',
    faq_q2: 'How is it reconfigurable?', faq_a2: 'By controlling ionization levels and patterns, frequency and radiation pattern change dynamically.',
    faq_q3: 'Why use plasma instead of metal?', faq_a3: 'Plasma antennas become invisible when off, have low noise, and are highly reconfigurable.',
    howto_1: 'Select a plasma antenna configuration.', howto_2: 'Adjust ionization level and RF frequency.',
    howto_3: 'Click Ignite to activate the plasma antenna.', howto_4: 'View the radiation pattern in the analysis section.',
    wiki_plasma_title: '⚡ Plasma Physics', wiki_plasma: 'Plasma is the fourth state of matter with free electrons that conducts electricity.',
    wiki_rad_title: '📡 Radiation Patterns', wiki_rad: 'The 3D distribution of radiated power from an antenna.',
    working: 'Working…', filterAll: 'All', soundEffects: '🔊 Sound effects',
    ready: '⚡ Plasma Antenna ready!', logCleared: 'Log cleared', copied: 'Copied!', copyFail: 'Copy failed',
    plasmaMode: 'Plasma Mode', ionLevel: 'Ionization Level', rfFreq: 'RF Frequency (MHz)',
    startSim: '▶ Ignite', stopSim: '⏹ Quench', resetSim: '↺ Reset',
    gain: 'Gain:', vswr: 'VSWR:', plasmaDensity: 'Plasma Density:', beamwidth: 'Beamwidth:',
    efficiency: 'Efficiency:', bandwidth: 'Bandwidth:',
    theoryIntro: 'Plasma antennas use ionized gas instead of metal for RF radiation:',
    theory1: 'Ionized gas columns act as conductive antenna elements',
    theory2: 'Plasma density controls the antenna operating frequency',
    theory3: 'When de-ionized, the antenna becomes invisible to radar',
    theory4: 'Reconfigurable patterns by controlling ionization profiles',
    theory5: 'Near-zero thermal noise when plasma is quenched',
    splashHint: 'tap to skip', langChanged: '🌐 Language → English', themeChanged: '🎨 Theme →',
    simStarted: '⚡ Plasma ignited', simStopped: '⏹ Quenched', simReset: '↺ Reset',
    t_mosque: 'Mosque', t_zellige: 'Zellige', t_andalus: 'Andalus', t_riad: 'Riad',
    t_medina: 'Medina', t_space: 'Space', t_jungle: 'Jungle', t_robot: 'Robot',
  },
  fr: {
    title: 'Antenne Plasma', subtitle: '⚡ Éléments RF à gaz ionisé',
    disconnected: 'Hors ligne', connected: 'Allumé',
    mainSection: 'Antenne Plasma', mainDesc: 'Simuler une antenne plasma reconfigurable à colonnes de gaz ionisé',
    sectionA: 'Métriques d\'Antenne', sectionB: 'Diagramme de Rayonnement', sectionC: 'Théorie',
    activityLog: '📜 Journal', eventsMsg: 'Événements',
    clear: 'Effacer', copy: 'Copier', export: 'Exporter', theme: 'Thème',
    settings: '⚙️ Paramètres', language: 'Langue',
    help: '❓ Aide', faq: 'FAQ', howto: 'Guide', wiki: 'Wiki',
    faq_q1: 'Qu\'est-ce qu\'une antenne plasma ?', faq_a1: 'Une antenne utilisant du gaz ionisé au lieu de métal.',
    faq_q2: 'Comment est-elle reconfigurable ?', faq_a2: 'En contrôlant les niveaux d\'ionisation et les profils.',
    faq_q3: 'Pourquoi utiliser le plasma ?', faq_a3: 'Les antennes plasma deviennent invisibles quand éteintes.',
    howto_1: 'Sélectionnez une configuration.', howto_2: 'Ajustez l\'ionisation et la fréquence.',
    howto_3: 'Cliquez Allumer pour activer.', howto_4: 'Visualisez le diagramme de rayonnement.',
    wiki_plasma_title: '⚡ Physique du Plasma', wiki_plasma: 'Le plasma est le quatrième état de la matière.',
    wiki_rad_title: '📡 Diagrammes de Rayonnement', wiki_rad: 'Distribution 3D de puissance rayonnée.',
    working: 'En cours…', filterAll: 'Tout', soundEffects: '🔊 Effets sonores',
    ready: '⚡ Antenne Plasma prête !', logCleared: 'Journal effacé', copied: 'Copié !', copyFail: 'Échec',
    plasmaMode: 'Mode Plasma', ionLevel: 'Niveau d\'Ionisation', rfFreq: 'Fréquence RF (MHz)',
    startSim: '▶ Allumer', stopSim: '⏹ Éteindre', resetSim: '↺ Réinitialiser',
    gain: 'Gain :', vswr: 'VSWR :', plasmaDensity: 'Densité Plasma :', beamwidth: 'Ouverture :',
    efficiency: 'Efficacité :', bandwidth: 'Bande passante :',
    theoryIntro: 'Les antennes plasma utilisent du gaz ionisé pour le rayonnement RF :',
    theory1: 'Les colonnes de gaz ionisé agissent comme éléments d\'antenne conducteurs',
    theory2: 'La densité du plasma contrôle la fréquence de fonctionnement',
    theory3: 'Une fois désionisée, l\'antenne devient invisible au radar',
    theory4: 'Diagrammes reconfigurables par contrôle du profil d\'ionisation',
    theory5: 'Bruit thermique quasi nul quand le plasma est éteint',
    splashHint: 'appuyer pour passer', langChanged: '🌐 Langue → Français', themeChanged: '🎨 Thème →',
    simStarted: '⚡ Plasma allumé', simStopped: '⏹ Éteint', simReset: '↺ Réinitialisé',
    t_mosque: 'Mosquée', t_zellige: 'Zellige', t_andalus: 'Andalous', t_riad: 'Riad',
    t_medina: 'Médina', t_space: 'Espace', t_jungle: 'Jungle', t_robot: 'Robot',
  },
  ar: {
    title: 'هوائي البلازما', subtitle: '⚡ عناصر RF الغاز المتأين',
    disconnected: 'غير متصل', connected: 'مشتعل',
    mainSection: 'هوائي البلازما', mainDesc: 'محاكاة هوائي بلازما قابل لإعادة التشكيل بأعمدة غاز متأين',
    sectionA: 'مقاييس الهوائي', sectionB: 'نمط الإشعاع', sectionC: 'النظرية',
    activityLog: '📜 سجل النشاط', eventsMsg: 'الأحداث',
    clear: 'مسح', copy: 'نسخ', export: 'تصدير', theme: 'المظهر',
    settings: '⚙️ الإعدادات', language: 'اللغة',
    help: '❓ مساعدة', faq: 'أسئلة شائعة', howto: 'كيفية الاستخدام', wiki: 'ويكي',
    faq_q1: 'ما هو هوائي البلازما؟', faq_a1: 'هوائي يستخدم الغاز المتأين بدلاً من المعدن كعنصر موصل.',
    faq_q2: 'كيف يتم إعادة تشكيله؟', faq_a2: 'بالتحكم في مستويات وأنماط التأين.',
    faq_q3: 'لماذا البلازما بدل المعدن؟', faq_a3: 'هوائيات البلازما تصبح غير مرئية عند إيقافها.',
    howto_1: 'اختر تكوين الهوائي.', howto_2: 'اضبط مستوى التأين والتردد.',
    howto_3: 'اضغط إشعال لتفعيل الهوائي.', howto_4: 'شاهد نمط الإشعاع.',
    wiki_plasma_title: '⚡ فيزياء البلازما', wiki_plasma: 'البلازما هي الحالة الرابعة للمادة.',
    wiki_rad_title: '📡 أنماط الإشعاع', wiki_rad: 'التوزيع ثلاثي الأبعاد للطاقة المشعة.',
    working: 'جارٍ…', filterAll: 'الكل', soundEffects: '🔊 مؤثرات صوتية',
    ready: '⚡ هوائي البلازما جاهز!', logCleared: 'تم مسح السجل', copied: 'تم النسخ!', copyFail: 'فشل',
    plasmaMode: 'وضع البلازما', ionLevel: 'مستوى التأين', rfFreq: 'تردد RF (MHz)',
    startSim: '▶ إشعال', stopSim: '⏹ إطفاء', resetSim: '↺ إعادة',
    gain: 'الكسب:', vswr: 'VSWR:', plasmaDensity: 'كثافة البلازما:', beamwidth: 'عرض الشعاع:',
    efficiency: 'الكفاءة:', bandwidth: 'عرض النطاق:',
    theoryIntro: 'هوائيات البلازما تستخدم الغاز المتأين للإشعاع الراديوي:',
    theory1: 'أعمدة الغاز المتأين تعمل كعناصر هوائي موصلة',
    theory2: 'كثافة البلازما تتحكم في تردد التشغيل',
    theory3: 'عند إزالة التأين يصبح الهوائي غير مرئي للرادار',
    theory4: 'أنماط قابلة لإعادة التشكيل بالتحكم في ملف التأين',
    theory5: 'ضوضاء حرارية شبه معدومة عند إطفاء البلازما',
    splashHint: 'انقر للتخطي', langChanged: '🌐 اللغة ← العربية', themeChanged: '🎨 المظهر ←',
    simStarted: '⚡ اشتعل البلازما', simStopped: '⏹ انطفأ', simReset: '↺ إعادة ضبط',
    t_mosque: 'مسجد', t_zellige: 'زليج', t_andalus: 'أندلس', t_riad: 'رياض',
    t_medina: 'مدينة', t_space: 'فضاء', t_jungle: 'أدغال', t_robot: 'روبوت',
  }
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



let currentLang = 'en';
function setLanguage(lang) { currentLang = lang; const s = LANG[lang]; if (!s) return; document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.dataset.i18n; if (s[k] != null) el.textContent = s[k]; }); document.querySelectorAll('[data-i18n-opt]').forEach(o => { const k = o.dataset.i18nOpt; if (s[k] != null) o.textContent = s[k]; }); document.title = s.title + ' — Workshop DIY'; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.documentElement.lang = lang; const sel = $('langSelect'); if (sel) sel.value = lang; try { localStorage.setItem('wdiy-lang', lang); } catch {} log(s.langChanged, 'info'); }
function setTheme(n) { document.documentElement.dataset.theme = n; document.documentElement.classList.toggle('light-theme', LIGHT_THEMES.includes(n)); const s = $('themeSelect'); if (s) s.value = n; try { localStorage.setItem('wdiy-theme', n); } catch {} log(LANG[currentLang].themeChanged + ' ' + (LANG[currentLang]['t_' + n] || n), 'info'); }

let logContainer;
function log(msg, type = 'info') { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; const d = document.createElement('div'); d.className = 'log-line ' + type; d.textContent = '[' + new Date().toLocaleTimeString() + '] ' + msg; logContainer.appendChild(d); logContainer.scrollTop = logContainer.scrollHeight; if (type === 'success') playSound('success'); else if (type === 'error') playSound('error'); applyLogFilter(); }
function clearLog() { if (!logContainer) logContainer = $('logContainer'); if (logContainer) logContainer.innerHTML = ''; log(LANG[currentLang].logCleared); }
async function copyLog() { try { await navigator.clipboard.writeText(Array.from(logContainer.children).map(d => d.textContent).join('\n')); log(LANG[currentLang].copied, 'success'); } catch { log(LANG[currentLang].copyFail, 'error'); } }
function exportLog() { const t = Array.from(($('logContainer')||{children:[]}).children).map(d => d.textContent).join('\n'); const b = new Blob([t], { type: 'text/plain' }); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href = u; a.download = 'plasma-antenna-log.txt'; a.click(); URL.revokeObjectURL(u); }
function showToast(msg, ms = 0) { const el = $('toastIndicator'), t = $('toastMessage'); if (el && t) { t.textContent = msg || LANG[currentLang].working; el.style.display = 'block'; } if (ms > 0) setTimeout(hideToast, ms); }
function hideToast() { const el = $('toastIndicator'); if (el) el.style.display = 'none'; }
function setStatus(c) { const t = $('statusText'), p = $('statusPill'), s = LANG[currentLang]; if (t) t.textContent = c ? s.connected : s.disconnected; if (p) p.classList.toggle('connected', c); }
let splashTimer;
function dismissSplash() { const s = $('splash'); if (!s) return; s.classList.add('hidden'); if (splashTimer) clearTimeout(splashTimer); setTimeout(() => s.remove(), 600); playSound('click'); }
function initSplash() { const s = $('splash'); if (!s) return; const sl = $('splashLogo'); if (sl) sl.innerHTML = LOGO_SVG; splashTimer = setTimeout(dismissSplash, 2500); }
let activeLogFilter = 'all';
function initLogFilters() { document.querySelectorAll('.log-filter').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.log-filter').forEach(b => b.classList.remove('active')); btn.classList.add('active'); activeLogFilter = btn.dataset.filter; applyLogFilter(); }); }); }
function applyLogFilter() { if (!logContainer) logContainer = $('logContainer'); if (!logContainer) return; Array.from(logContainer.children).forEach(l => { l.style.display = (activeLogFilter === 'all' || l.classList.contains(activeLogFilter)) ? '' : 'none'; }); }
function initHijriDate() { const el = $('hijriDate'); if (!el) return; try { el.textContent = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()); } catch {} }
function openPanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.add('open'); if (ov) ov.classList.add('open'); }
function closePanel(p, o) { const s = $(p), ov = $(o); if (s) s.classList.remove('open'); if (ov) ov.classList.remove('open'); }
function openHelp() { openPanel('helpPanel', 'helpOverlay'); } function closeHelp() { closePanel('helpPanel', 'helpOverlay'); }
function openSettings() { openPanel('settingsPanel', 'settingsOverlay'); } function closeSettings() { closePanel('settingsPanel', 'settingsOverlay'); }
function openLog() { const s = $('logPanel'); if (s) s.classList.add('open'); document.body.classList.add('log-open'); }
function closeLog() { const s = $('logPanel'); if (s) s.classList.remove('open'); document.body.classList.remove('log-open'); }
function toggleLog() { const s = $('logPanel'); if (s && s.classList.contains('open')) closeLog(); else openLog(); }
function initHelpTabs() { document.querySelectorAll('.help-tab').forEach(tab => tab.addEventListener('click', () => { document.querySelectorAll('.help-tab').forEach(t => t.classList.remove('active')); document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active')); tab.classList.add('active'); const id = 'help' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1); const tgt = $(id); if (tgt) tgt.classList.add('active'); })); }

/* ═══════════════════════════════════════════════════════
   PLASMA ANTENNA — FULL CANVAS SIMULATION
   ═══════════════════════════════════════════════════════ */

let running = false, animFrame = null;
const plasmaParticles = [];
const rfWaves = [];
const MAX_PARTICLES = 600;

function resizeCanvas(canvas) {
  const rect = canvas.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
  return { w: rect.width, h: rect.height, ctx };
}

/* Plasma tube visualization */
function drawPlasma(ctx, w, h, mode, ionLevel, time) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.06)'; ctx.fillRect(0, 0, w, h);
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';
  const ion = ionLevel / 100;

  // Ground plane
  ctx.fillStyle = 'rgba(80, 80, 80, 0.3)';
  ctx.fillRect(0, h * 0.85, w, h * 0.15);
  ctx.strokeStyle = 'rgba(150, 150, 150, 0.3)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, h * 0.85); ctx.lineTo(w, h * 0.85); ctx.stroke();

  // Plasma tubes based on mode
  const tubes = [];
  switch (mode) {
    case 'monopole': tubes.push({ x: w / 2, yTop: h * 0.15, yBot: h * 0.85 }); break;
    case 'dipole': tubes.push({ x: w / 2, yTop: h * 0.1, yBot: h * 0.45 }); tubes.push({ x: w / 2, yTop: h * 0.55, yBot: h * 0.9 }); break;
    case 'array': for (let i = 0; i < 5; i++) tubes.push({ x: w * 0.2 + i * w * 0.15, yTop: h * 0.2, yBot: h * 0.85 }); break;
    case 'helix': tubes.push({ x: w / 2, yTop: h * 0.1, yBot: h * 0.85, helix: true }); break;
  }

  // Draw each tube
  for (const tube of tubes) {
    const tubeW = 12;
    // Glass tube
    ctx.strokeStyle = 'rgba(100, 150, 200, 0.2)'; ctx.lineWidth = tubeW + 4;
    ctx.beginPath(); ctx.moveTo(tube.x, tube.yTop); ctx.lineTo(tube.x, tube.yBot); ctx.stroke();

    if (tube.helix) {
      // Helical winding
      ctx.strokeStyle = `rgba(100, ${150 + ion * 105}, 255, ${0.3 + ion * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let y = tube.yTop; y < tube.yBot; y += 2) {
        const phase = y * 0.15 + time * 3;
        const x = tube.x + Math.cos(phase) * 20;
        if (y === tube.yTop) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Plasma glow inside tube
    const grad = ctx.createLinearGradient(tube.x - tubeW / 2, 0, tube.x + tubeW / 2, 0);
    const intensity = ion * (0.7 + Math.sin(time * 8) * 0.3);
    grad.addColorStop(0, `rgba(100, 50, 200, 0)`);
    grad.addColorStop(0.3, `rgba(100, 100, 255, ${intensity * 0.5})`);
    grad.addColorStop(0.5, `rgba(150, 100, 255, ${intensity * 0.8})`);
    grad.addColorStop(0.7, `rgba(100, 100, 255, ${intensity * 0.5})`);
    grad.addColorStop(1, `rgba(100, 50, 200, 0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(tube.x - tubeW, tube.yTop, tubeW * 2, tube.yBot - tube.yTop);

    // Plasma particles inside tube
    if (Math.random() < ion * 0.4) {
      const py = tube.yTop + Math.random() * (tube.yBot - tube.yTop);
      plasmaParticles.push({
        x: tube.x + (Math.random() - 0.5) * tubeW,
        y: py, vx: (Math.random() - 0.5) * 2, vy: -1 - Math.random() * 3,
        life: 1, decay: 0.02 + Math.random() * 0.03,
        hue: 220 + Math.random() * 60, size: 1 + Math.random() * 3
      });
    }
  }

  // Update and draw particles
  for (let i = plasmaParticles.length - 1; i >= 0; i--) {
    const p = plasmaParticles[i];
    p.x += p.vx; p.y += p.vy; p.life -= p.decay;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.life * 0.8})`;
    ctx.fill();
    if (p.life <= 0) plasmaParticles.splice(i, 1);
  }
  while (plasmaParticles.length > MAX_PARTICLES) plasmaParticles.shift();

  // RF radiation waves
  if (ion > 0.2) {
    for (const tube of tubes) {
      if (Math.random() < 0.05 * ion) {
        const angle = Math.random() * Math.PI * 2;
        rfWaves.push({ x: tube.x, y: (tube.yTop + tube.yBot) / 2, radius: 5, maxRadius: 150 + Math.random() * 100, speed: 1 + Math.random(), alpha: 0.5 });
      }
    }
  }

  for (let i = rfWaves.length - 1; i >= 0; i--) {
    const wave = rfWaves[i];
    wave.radius += wave.speed;
    wave.alpha = 0.5 * (1 - wave.radius / wave.maxRadius);
    if (wave.alpha > 0) {
      ctx.beginPath(); ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(100, 200, 255, ${wave.alpha})`; ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    if (wave.radius >= wave.maxRadius) rfWaves.splice(i, 1);
  }

  // HUD
  ctx.fillStyle = accent; ctx.font = '11px Orbitron, monospace';
  ctx.fillText('PLASMA ANTENNA', 10, 18);
  ctx.fillStyle = 'rgba(100, 200, 255, 0.6)'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('ION: ' + ionLevel + '%  MODE: ' + mode.toUpperCase(), 10, 34);
  ctx.fillText('Particles: ' + plasmaParticles.length, 10, 48);
}

/* Radiation pattern (polar plot) */
function drawPattern(ctx, w, h, mode, ionLevel, freq, time) {
  ctx.fillStyle = '#0a0a1a'; ctx.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2, maxR = Math.min(w, h) * 0.4;
  const ion = ionLevel / 100;
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#d4a03c';

  // Grid circles
  ctx.strokeStyle = '#1a2a3a'; ctx.lineWidth = 0.5;
  for (let r = 1; r <= 4; r++) {
    ctx.beginPath(); ctx.arc(cx, cy, maxR * r / 4, 0, Math.PI * 2); ctx.stroke();
  }
  // Grid lines
  for (let a = 0; a < 12; a++) {
    const ang = a * Math.PI / 6;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(ang) * maxR, cy + Math.sin(ang) * maxR); ctx.stroke();
  }

  // Radiation pattern
  ctx.strokeStyle = accent; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let a = 0; a <= 360; a++) {
    const ang = a * Math.PI / 180;
    let gain;
    switch (mode) {
      case 'monopole': gain = Math.abs(Math.cos(ang)) * ion; break;
      case 'dipole': gain = Math.pow(Math.sin(ang), 2) * ion; break;
      case 'array': gain = Math.pow(Math.cos(ang * 2.5), 2) * ion * (0.8 + Math.sin(time) * 0.2); break;
      case 'helix': gain = (0.5 + 0.5 * Math.cos(ang)) * ion; break;
      default: gain = 0.5 * ion;
    }
    const r = gain * maxR;
    const x = cx + Math.cos(ang) * r, y = cy + Math.sin(ang) * r;
    if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath(); ctx.stroke();

  // Fill pattern area
  ctx.fillStyle = `rgba(100, 200, 255, 0.1)`;
  ctx.fill();

  // Labels
  ctx.fillStyle = '#6688aa'; ctx.font = '10px Orbitron, monospace';
  ctx.fillText('Radiation Pattern (' + mode + ')', 8, 14);
  ctx.fillText('0°', cx + maxR + 5, cy + 4);
  ctx.fillText('90°', cx - 8, cy - maxR - 5);
  ctx.fillText('180°', cx - maxR - 30, cy + 4);
}

/* Update metrics */
function updateMetrics(ionLevel, freq, mode) {
  const ion = ionLevel / 100;
  const baseGain = mode === 'array' ? 12 : mode === 'helix' ? 8 : mode === 'dipole' ? 5 : 3;
  const gain = (baseGain * ion + (Math.random() - 0.5) * 0.2).toFixed(1);
  const vswr = (1 + (1 - ion) * 2 + Math.random() * 0.1).toFixed(2);
  const density = (ion * 1e18).toExponential(2);
  const beamwidth = (360 / (mode === 'array' ? 5 : mode === 'helix' ? 3 : 2) * (1 - ion * 0.3)).toFixed(1);
  const eff = (ion * 85 + Math.random() * 5).toFixed(1);
  const bw = (freq * 0.1 * ion).toFixed(0);
  const g = $('gainVal'); if (g) g.textContent = gain + ' dBi';
  const v = $('vswrVal'); if (v) v.textContent = vswr + ':1';
  const d = $('densityVal'); if (d) d.textContent = density + ' /m³';
  const b = $('beamVal'); if (b) b.textContent = beamwidth + '°';
  const e = $('effVal'); if (e) e.textContent = eff + '%';
  const bwE = $('bwVal'); if (bwE) bwE.textContent = bw + ' MHz';
}

let simCtx, simW, simH, patCtx, patW, patH;
function simLoop() {
  if (!running) return;
  const time = performance.now() * 0.001;
  const mode = $('plasmaMode') ? $('plasmaMode').value : 'monopole';
  const ionLevel = $('ionSlider') ? +$('ionSlider').value : 50;
  const freq = $('rfSlider') ? +$('rfSlider').value : 900;

  if (simCtx) drawPlasma(simCtx, simW, simH, mode, ionLevel, time);
  if (patCtx) drawPattern(patCtx, patW, patH, mode, ionLevel, freq, time);
  if (Math.floor(time * 3) % 3 === 0) updateMetrics(ionLevel, freq, mode);

  animFrame = requestAnimationFrame(simLoop);
}

function startSim() {
  if (running) return; running = true; setStatus(true);
  const sc = $('simCanvas'), pc = $('patternCanvas');
  if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; }
  if (pc) { const r = resizeCanvas(pc); patCtx = r.ctx; patW = r.w; patH = r.h; }
  log(LANG[currentLang].simStarted, 'success'); simLoop();
}
function stopSim() { running = false; if (animFrame) cancelAnimationFrame(animFrame); setStatus(false); log(LANG[currentLang].simStopped, 'info'); }
function resetSim() {
  stopSim(); plasmaParticles.length = 0; rfWaves.length = 0;
  [$('simCanvas'), $('patternCanvas')].forEach(c => { if (c) c.getContext('2d').clearRect(0, 0, c.width, c.height); });
  ['gainVal', 'vswrVal', 'densityVal', 'beamVal', 'effVal', 'bwVal'].forEach(id => { const e = $(id); if (e) e.textContent = '--'; });
  log(LANG[currentLang].simReset, 'info');
}

function init() {
  initSplash(); const lw = $('logoWrap'); if (lw) lw.innerHTML = LOGO_SVG;
  $('clearLogBtn').onclick = clearLog; $('copyLogBtn').onclick = copyLog; $('exportLogBtn').onclick = exportLog;
  initLogFilters();
  $('helpBtn').onclick = openHelp; $('helpCloseBtn').onclick = closeHelp; $('helpOverlay').onclick = closeHelp;
  initHelpTabs();
  $('settingsBtn').onclick = openSettings; $('settingsCloseBtn').onclick = closeSettings; $('settingsOverlay').onclick = closeSettings;
  $('logBtn').onclick = toggleLog; $('logCloseBtn').onclick = closeLog;
  const st = $('soundToggle'); if (st) { try { soundEnabled = localStorage.getItem('wdiy-sound') === 'true'; } catch {} st.checked = soundEnabled; st.onchange = () => { soundEnabled = st.checked; try { localStorage.setItem('wdiy-sound', soundEnabled); } catch {} }; }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeHelp(); closeSettings(); closeLog(); } });
  $('langSelect').onchange = function () { setLanguage(this.value); };
  $('themeSelect').onchange = function () { setTheme(this.value); };
  try { const sl = localStorage.getItem('wdiy-lang'), st2 = localStorage.getItem('wdiy-theme'); if (st2) setTheme(st2); if (sl) setLanguage(sl); } catch {}
  initHijriDate();
  $('startBtn').onclick = startSim; $('stopBtn').onclick = stopSim; $('resetBtn').onclick = resetSim;
  $('ionSlider').oninput = function () { $('ionVal').textContent = this.value + '%'; };
  $('rfSlider').oninput = function () { $('rfVal').textContent = this.value + ' MHz'; };
  window.addEventListener('resize', () => { if (running) { const sc = $('simCanvas'), pc = $('patternCanvas'); if (sc) { const r = resizeCanvas(sc); simCtx = r.ctx; simW = r.w; simH = r.h; } if (pc) { const r = resizeCanvas(pc); patCtx = r.ctx; patW = r.w; patH = r.h; } } });
  log(LANG[currentLang].ready, 'success');
}
document.addEventListener('DOMContentLoaded', init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Plasma Antenna
   Animated ionized gas column with radiation pattern,
   plasma density visualization, and RF coupling
   ═══════════════════════════════════════════════════════════════ */
(function(){
  const CVS_ID='simPlasmaAntenna';let cv,cx,W,H,af=null,t=0;
  const plasmaParticles=[];const rfWaves=[];const MAX_PARTICLES=200;
  let ionLevel=70,rfFreq=150,antennaGain=0;

  function boot(){
    let el=document.getElementById(CVS_ID);
    if(!el){el=document.createElement('canvas');el.id=CVS_ID;el.width=780;el.height=300;
    el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#04060e;display:block;';
    const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
    cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
  }

  function drawAntennaColumn(){
    const ax=W*0.25,ay=40,aw=30,ah=H-80;
    // Glass tube
    cx.strokeStyle='rgba(150,200,255,0.2)';cx.lineWidth=2;
    cx.beginPath();
    cx.roundRect(ax-aw/2,ay,aw,ah,8);cx.stroke();
    // Plasma glow
    const glowAlpha=ionLevel/100*0.3;
    const grad=cx.createLinearGradient(ax-aw/2,ay,ax+aw/2,ay);
    grad.addColorStop(0,'rgba(100,50,255,0)');
    grad.addColorStop(0.5,'rgba(150,100,255,'+glowAlpha+')');
    grad.addColorStop(1,'rgba(100,50,255,0)');
    cx.fillStyle=grad;
    cx.beginPath();cx.roundRect(ax-aw/2+2,ay+2,aw-4,ah-4,6);cx.fill();
    // Ionization level bar
    const barH=ah*(ionLevel/100);
    cx.fillStyle='rgba(150,100,255,'+(0.1+ionLevel/200)+')';
    cx.fillRect(ax-aw/2+4,ay+ah-barH-2,aw-8,barH);
    // Plasma particles inside tube
    for(let i=0;i<ionLevel/5;i++){
      const px2=ax+(Math.random()-.5)*(aw-10);
      const py=ay+5+Math.random()*(ah-10);
      cx.fillStyle='rgba(200,150,255,'+(0.2+Math.random()*0.3)+')';
      cx.beginPath();cx.arc(px2,py,1+Math.random(),0,Math.PI*2);cx.fill();
    }
    cx.fillStyle='rgba(150,100,255,0.4)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('PLASMA TUBE',ax,ay-8);
    cx.fillText(ionLevel+'% ionized',ax,ay+ah+12);
  }

  function drawRadiationPattern(){
    const pcx=W*0.55,pcy=H/2,pr=110;
    // Polar grid
    cx.strokeStyle='rgba(100,200,255,0.06)';cx.lineWidth=0.5;
    for(let r=pr*0.25;r<=pr;r+=pr*0.25){
      cx.beginPath();cx.arc(pcx,pcy,r,0,Math.PI*2);cx.stroke();
    }
    for(let a=0;a<Math.PI*2;a+=Math.PI/6){
      cx.beginPath();cx.moveTo(pcx,pcy);
      cx.lineTo(pcx+Math.cos(a)*pr,pcy+Math.sin(a)*pr);cx.stroke();
    }
    // Radiation pattern (dipole-like with gain)
    cx.fillStyle='rgba(150,100,255,0.15)';cx.beginPath();
    for(let a=0;a<Math.PI*2;a+=0.02){
      const gain2=Math.pow(Math.abs(Math.cos(a)),1.5)*(0.5+ionLevel/200);
      const r2=pr*gain2;
      const x=pcx+Math.cos(a)*r2;const y=pcy+Math.sin(a)*r2;
      if(a===0)cx.moveTo(x,y);else cx.lineTo(x,y);
    }
    cx.closePath();cx.fill();
    cx.strokeStyle='rgba(150,100,255,0.5)';cx.lineWidth=1.5;cx.stroke();
    // Animated RF emission
    for(let w=0;w<3;w++){
      const r2=(t*60+w*40)%pr;
      const alpha=0.1*(1-r2/pr);
      cx.strokeStyle='rgba(200,150,255,'+alpha+')';cx.lineWidth=1;
      cx.beginPath();cx.arc(pcx,pcy,r2,0,Math.PI*2);cx.stroke();
    }
    cx.fillStyle='rgba(150,100,255,0.3)';cx.font='8px monospace';cx.textAlign='center';
    cx.fillText('RADIATION PATTERN',pcx,pcy-pr-8);
  }

  function drawFrequencyResponse(){
    const fx=W*0.78,fy=20,fw=W*0.2,fh=110;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(fx,fy,fw,fh);
    const bins=40;const binW=fw/bins;
    for(let i=0;i<bins;i++){
      const freq=i/bins;
      const plasmaFreq=ionLevel/100;
      const response=freq>plasmaFreq?1/(1+Math.pow((freq-0.6)*5,2)):0.05;
      const bh=response*fh*0.7+Math.random()*2;
      const hue=260+freq*40;
      cx.fillStyle='hsla('+hue+',60%,50%,'+(0.3+response*0.4)+')';
      cx.fillRect(fx+i*binW,fy+fh-bh,binW-0.5,bh);
    }
    // Plasma frequency cutoff line
    const cutoff=fx+ionLevel/100*fw;
    cx.strokeStyle='rgba(255,100,100,0.3)';cx.lineWidth=1;cx.setLineDash([3,3]);
    cx.beginPath();cx.moveTo(cutoff,fy);cx.lineTo(cutoff,fy+fh);cx.stroke();cx.setLineDash([]);
    cx.fillStyle='rgba(255,100,100,0.3)';cx.font='6px monospace';cx.fillText('f_p',cutoff+3,fy+10);
    cx.fillStyle='rgba(150,100,255,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('FREQUENCY RESPONSE',fx+8,fy+10);
  }

  function drawMetrics(){
    const mx=W*0.78,my=150,mw=W*0.2,mh=70;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(mx,my,mw,mh);
    antennaGain=2+ionLevel/20;
    cx.fillStyle='rgba(150,100,255,0.5)';cx.font='8px monospace';cx.textAlign='left';
    cx.fillText('ANTENNA METRICS',mx+8,my+14);
    cx.fillStyle='#aaa';
    cx.fillText('Gain: '+antennaGain.toFixed(1)+' dBi',mx+8,my+30);
    cx.fillText('RF: '+rfFreq+' MHz',mx+8,my+44);
    cx.fillText('Ion: '+ionLevel+'%',mx+8,my+58);
  }

  function drawPlasmaPhysics(){
    const px=20,py=H-60,pw=W*0.45,ph=45;
    cx.fillStyle='rgba(0,0,0,0.3)';cx.fillRect(px,py,pw,ph);
    cx.fillStyle='rgba(150,100,255,0.4)';cx.font='7px monospace';cx.textAlign='left';
    cx.fillText('Plasma Freq: f_p = 9*sqrt(n_e) Hz',px+8,py+14);
    cx.fillText('Above f_p: transparent | Below f_p: reflects',px+8,py+28);
    cx.fillText('Advantage: Reconfigurable, stealth when OFF',px+8,py+42);
  }

  function drawHUD(){
    cx.save();
    cx.fillStyle='rgba(0,0,0,0.6)';cx.fillRect(8,8,180,42);
    cx.strokeStyle='rgba(150,100,255,0.15)';cx.strokeRect(8,8,180,42);
    cx.font='10px monospace';cx.fillStyle='#8b5cf6';cx.textAlign='left';
    cx.fillText('PLASMA ANTENNA',16,24);
    cx.fillStyle='#aaa';
    cx.fillText('Ionized Gas RF Radiator',16,40);
    cx.restore();
  }

  function tick(){
    t+=0.016;
    cx.fillStyle='rgba(4,6,14,0.12)';cx.fillRect(0,0,W,H);

    ionLevel=70+Math.sin(t*0.3)*20;
    rfFreq=150+Math.sin(t*0.2)*50;

    drawAntennaColumn();drawRadiationPattern();
    drawFrequencyResponse();drawMetrics();drawPlasmaPhysics();drawHUD();

    cx.fillStyle='rgba(150,100,255,0.25)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
    cx.fillText('Plasma Antenna — Ionized Gas Column RF Radiation',8,H-8);

    af=requestAnimationFrame(tick);
  }

  setTimeout(()=>{boot();tick();},600);
})();
