/**
 * Invisibility Test — WiFi Privacy Score
 * Workshop DIY — Template v1.2 + App Logic
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(t){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const tt=audioCtx.currentTime;if(t==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.08);o.start(tt);o.stop(tt+0.08)}else if(t==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,tt+0.3);o.start(tt);o.stop(tt+0.3)}else if(t==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,tt+0.25);o.start(tt);o.stop(tt+0.25)}}
const LANG={
en:{title:'Invisibility Test',subtitle:'Test how invisible your device is',disconnected:'Disconnected',connected:'Testing',mainSection:'Invisibility Test',mainDesc:'MAC randomization & probe suppression',sectionA:'Test Results',sectionB:'Recommendations',sectionC:'How It Works',start:'Test',stop:'Stop',score:'Score',tests:'Tests',passed:'Passed',failed:'Failed',howItWorksText:'Tests your device invisibility through MAC randomization, probe suppression, and more.',howto_1:'Click Test to start.',howto_2:'Watch tests run.',howto_3:'Review results.',howto_4:'Follow recommendations.',faq_q1:'What makes a device visible?',faq_a1:'Probe requests and static MACs.',faq_q2:'Is this real?',faq_a2:'No, simulation.',faq_q3:'What is MAC randomization?',faq_a3:'Changing MAC to avoid tracking.',faq_q4:'Private?',faq_a4:'Yes, local only.',wiki_t1:'Invisibility',wiki_d1:'Reducing WiFi tracking.',wiki_t2:'Privacy',wiki_d2:'All data stays local.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'Invisibility Test ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',splashHint:'tap to skip',working:'Working...',langChanged:'Language \u2192 English',themeChanged:'Theme \u2192',simStarted:'Testing started',simStopped:'Testing stopped'},
fr:{title:'Test d\'Invisibilite',subtitle:'Testez votre invisibilite WiFi',disconnected:'Deconnecte',connected:'Test',mainSection:'Test d\'Invisibilite',mainDesc:'Verification MAC et sondage',sectionA:'Resultats',sectionB:'Recommandations',sectionC:'Comment ca marche',start:'Tester',stop:'Arreter',score:'Score',tests:'Tests',passed:'Reussi',failed:'Echoue',howItWorksText:'Teste l\'invisibilite WiFi de votre appareil.',howto_1:'Cliquez Tester.',howto_2:'Observez.',howto_3:'Resultats.',howto_4:'Recommandations.',faq_q1:'Visible comment?',faq_a1:'Requetes et MAC statiques.',faq_q2:'Reel?',faq_a2:'Non.',faq_q3:'Randomisation MAC?',faq_a3:'Changer le MAC.',faq_q4:'Prive?',faq_a4:'Oui.',wiki_t1:'Invisibilite',wiki_d1:'Reduire le suivi.',wiki_t2:'Confidentialite',wiki_d2:'Tout reste local.',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Parametres',language:'Langue',theme:'Theme',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'Pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',splashHint:'appuyer pour passer',working:'En cours...',langChanged:'Langue \u2192 Francais',themeChanged:'Theme \u2192',simStarted:'Test demarre',simStopped:'Arrete'},
ar:{title:'\u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u0625\u062e\u0641\u0627\u0621',subtitle:'\u0627\u062e\u062a\u0628\u0631 \u0625\u062e\u0641\u0627\u0621 \u062c\u0647\u0627\u0632\u0643',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0627\u062e\u062a\u0628\u0627\u0631',mainSection:'\u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u0625\u062e\u0641\u0627\u0621',mainDesc:'\u0641\u062d\u0635 MAC \u0648\u0627\u0644\u0627\u0633\u062a\u0642\u0635\u0627\u0621',sectionA:'\u0627\u0644\u0646\u062a\u0627\u0626\u062c',sectionB:'\u062a\u0648\u0635\u064a\u0627\u062a',sectionC:'\u0643\u064a\u0641 \u064a\u0639\u0645\u0644',start:'\u0627\u062e\u062a\u0628\u0627\u0631',stop:'\u0625\u064a\u0642\u0627\u0641',score:'\u0646\u062a\u064a\u062c\u0629',tests:'\u0627\u062e\u062a\u0628\u0627\u0631\u0627\u062a',passed:'\u0646\u062c\u062d',failed:'\u0641\u0634\u0644',howItWorksText:'\u064a\u062e\u062a\u0628\u0631 \u0625\u062e\u0641\u0627\u0621 \u062c\u0647\u0627\u0632\u0643.',howto_1:'\u0627\u0646\u0642\u0631 \u0627\u062e\u062a\u0628\u0627\u0631.',howto_2:'\u0634\u0627\u0647\u062f.',howto_3:'\u0631\u0627\u062c\u0639.',howto_4:'\u0627\u062a\u0628\u0639.',faq_q1:'\u0645\u0627 \u0627\u0644\u0630\u064a \u064a\u0643\u0634\u0641\u0643\u061f',faq_a1:'\u0637\u0644\u0628\u0627\u062a \u0648MAC.',faq_q2:'\u062d\u0642\u064a\u0642\u064a\u061f',faq_a2:'\u0644\u0627.',faq_q3:'\u062a\u063a\u064a\u064a\u0631 MAC\u061f',faq_a3:'\u062a\u063a\u064a\u064a\u0631 \u062f\u0648\u0631\u064a.',faq_q4:'\u062e\u0627\u0635\u061f',faq_a4:'\u0646\u0639\u0645.',wiki_t1:'\u0627\u0644\u0625\u062e\u0641\u0627\u0621',wiki_d1:'\u062a\u0642\u0644\u064a\u0644 \u0627\u0644\u062a\u062a\u0628\u0639.',wiki_t2:'\u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629',wiki_d2:'\u0645\u062d\u0644\u064a.',activityLog:'\u0633\u062c\u0644 \u0627\u0644\u0646\u0634\u0627\u0637',eventsMsg:'\u0627\u0644\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',settings:'\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0627\u0644\u0644\u063a\u0629',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',soundEffects:'\u0645\u0624\u062b\u0631\u0627\u062a',help:'\u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064a\u0641',wiki:'\u0648\u064a\u0643\u064a',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',ready:'\u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',splashHint:'\u0627\u0646\u0642\u0631',working:'\u062c\u0627\u0631\u064d...',langChanged:'\u0627\u0644\u0644\u063a\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\u0627\u0644\u0645\u0638\u0647\u0631 \u2190',simStarted:'\u0628\u062f\u0623',simStopped:'\u062a\u0648\u0642\u0641'}
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
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k]});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k]});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function playThemeMelody(n){if(!soundEnabled||!audioCtx)return;const notes=THEME_MELODIES[n];if(!notes)return;const t=audioCtx.currentTime;notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2)})}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{}playThemeMelody(n);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+n]||n}`,'info')}
let logContainer;function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');applyLogFilter()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`invisibility-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u)}
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block'}if(ms>0)setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click')}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click')})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none'})}
function openPanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open')}
function closePanel(p,o){const sb=$(p),ov=$(o);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open')}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay')}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function closeAllPanels(){closeHelp();closeSettings();closeLog()}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const tgt=$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1));if(tgt)tgt.classList.add('active')})})}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{}}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;const rtl=()=>document.documentElement.dir==='rtl';h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;h.classList.add('active');document.body.style.cursor='col-resize';e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=rtl()?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,window.innerWidth*0.6))+'px')});document.addEventListener('mouseup',()=>{if(!d)return;d=false;h.classList.remove('active');document.body.style.cursor=''})}

/* ======= APP LOGIC — Invisibility Test ======= */
const TESTS=['MAC Randomization','Probe Request Suppression','DHCP Hostname Leak','mDNS Broadcast','WiFi Direct Discovery','Preferred Network List','Power Save Timing','Sequence Number Analysis','Beacon Response Time','Association Pattern'];
let simRunning=false,simInterval=null,testIdx=0,results=[],canvas,ctx;

function initCanvas(){canvas=$('simCanvas');if(!canvas)return;ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth*2;canvas.height=canvas.offsetHeight*2;ctx.scale(2,2);}

function drawCanvas(){
  if(!ctx)return;const w=canvas.offsetWidth,h=canvas.offsetHeight;
  ctx.fillStyle='rgba(10,10,26,0.1)';ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,r=Math.min(w,h)/3;
  const score=results.length?results.filter(r=>r.pass).length/results.length:0;
  // background ring
  ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=12;ctx.stroke();
  // score arc
  ctx.beginPath();ctx.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*score);
  ctx.strokeStyle=score>0.7?'#22c55e':score>0.4?'#fbbf24':'#ef4444';ctx.lineWidth=12;ctx.lineCap='round';ctx.stroke();
  // test dots around ring
  TESTS.forEach((t,i)=>{
    const a=-Math.PI/2+Math.PI*2*i/TESTS.length;
    const px=cx+Math.cos(a)*(r+20),py=cy+Math.sin(a)*(r+20);
    ctx.beginPath();ctx.arc(px,py,4,0,Math.PI*2);
    if(i<results.length)ctx.fillStyle=results[i].pass?'#22c55e':results[i].warn?'#fbbf24':'#ef4444';
    else ctx.fillStyle='rgba(255,255,255,0.15)';
    ctx.fill();
  });
  // center text
  ctx.fillStyle='#fff';ctx.font='bold 28px Orbitron,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
  ctx.fillText(Math.round(score*100)+'%',cx,cy-5);
  ctx.font='10px sans-serif';ctx.fillStyle='rgba(255,255,255,0.5)';ctx.fillText('INVISIBILITY',cx,cy+18);
}

function runTest(){
  if(testIdx>=TESTS.length){stopSim();return;}
  const name=TESTS[testIdx];const pass=Math.random()>0.4;const warn=!pass&&Math.random()>0.5;
  results.push({name,pass,warn});testIdx++;
  log(`${name}: ${pass?'PASS':warn?'WARN':'FAIL'}`,pass?'success':warn?'info':'error');
  // Update results UI
  const res=$('testResults');if(res){
    const d=document.createElement('div');d.className='test-item';
    const cls=pass?'pass':warn?'warn':'fail';
    d.innerHTML=`<span>${name}</span><span class="${cls}">${pass?'PASS':warn?'WARN':'FAIL'}</span>`;
    res.appendChild(d);
  }
  const passed=results.filter(r=>r.pass).length;
  $('overallScore').textContent=Math.round(passed/results.length*100)+'%';
  $('testsRun').textContent=results.length;
  $('testsPassed').textContent=passed;
  $('testsFailed').textContent=results.filter(r=>!r.pass&&!r.warn).length;
  // Recommendations
  const rec=$('recommendations');if(rec){
    const tips=results.filter(r=>!r.pass).map(r=>'<div style="padding:4px 0;border-bottom:1px solid var(--border)">Fix: '+r.name+'</div>');
    rec.innerHTML=tips.length?tips.join(''):'<div style="color:#22c55e">All tests passed!</div>';
  }
  drawCanvas();
}

function startSim(){if(simRunning)return;simRunning=true;setStatus(true);$('startBtn').disabled=true;$('stopBtn').disabled=false;results=[];testIdx=0;const res=$('testResults');if(res)res.innerHTML='';initCanvas();log(LANG[currentLang].simStarted,'success');simInterval=setInterval(runTest,900);}
function stopSim(){simRunning=false;if(simInterval)clearInterval(simInterval);setStatus(false);$('startBtn').disabled=false;$('stopBtn').disabled=true;log(LANG[currentLang].simStopped,'info');}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;initLogResize();
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}if(soundEnabled)playSound('click')})}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels()});
  $('langSelect').addEventListener('change',()=>setLanguage($('langSelect').value));
  $('themeSelect').addEventListener('change',()=>setTheme($('themeSelect').value));
  try{const sl=localStorage.getItem('wdiy-lang');const st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════ RICH CANVAS SIMULATION — Invisibility Shield Visualizer ═══════ */
(function invisibilityShieldCanvas(){
  const CVS_ID='invisShieldVis';
  function ensureCanvas(){
    if(document.getElementById(CVS_ID))return document.getElementById(CVS_ID);
    const wrap=document.querySelector('.section-card')||document.querySelector('.main-section')||document.querySelector('main');
    if(!wrap)return null;
    const card=document.createElement('div');card.className='section-card';
    card.innerHTML='<div class="section-header"><span class="section-icon">🛡️</span> Invisibility Shield</div>';
    const c=document.createElement('canvas');c.id=CVS_ID;
    c.style.cssText='width:100%;height:260px;border-radius:12px;background:#0a0a1a;display:block;margin-top:8px;';
    card.appendChild(c);wrap.parentNode.insertBefore(card,wrap.nextSibling);return c;
  }
  const scanBeams=[];let _raf=null,frameCount=0;
  function draw(){
    const c=document.getElementById(CVS_ID);if(!c){_raf=null;return;}
    const ctx=c.getContext('2d');const W=c.width=c.offsetWidth*2,H=c.height=c.offsetHeight*2;
    ctx.scale(2,2);const w=W/2,h=H/2;
    ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);
    frameCount++;
    const cx=w/2,cy=h/2;
    const score=(typeof results!=='undefined'&&results.length>0)?results.filter(r=>r.pass).length/results.length:0;
    const shieldR=Math.min(w,h)*0.28;
    // Shield rings — more rings = better protection
    const numRings=Math.max(1,Math.floor(score*6));
    for(let i=numRings;i>=1;i--){
      const r=shieldR*(0.5+i*0.1);
      const pulse=Math.sin(frameCount*0.02+i*0.5)*3;
      ctx.beginPath();ctx.arc(cx,cy,r+pulse,0,Math.PI*2);
      const alpha=score>0.7?0.12:score>0.4?0.08:0.04;
      const color=score>0.7?'34,197,94':score>0.4?'251,191,36':'239,68,68';
      ctx.strokeStyle=`rgba(${color},${alpha*i})`;ctx.lineWidth=2;ctx.stroke();
    }
    // Hexagonal shield pattern
    const hexR=shieldR*0.8;
    for(let ring=1;ring<=3;ring++){
      const hr=hexR*ring/3;
      for(let a=0;a<6;a++){
        const angle=a*Math.PI/3-Math.PI/6;const nextAngle=(a+1)*Math.PI/3-Math.PI/6;
        ctx.beginPath();
        ctx.moveTo(cx+Math.cos(angle)*hr,cy+Math.sin(angle)*hr);
        ctx.lineTo(cx+Math.cos(nextAngle)*hr,cy+Math.sin(nextAngle)*hr);
        const shieldAlpha=score*0.15*ring/3;
        ctx.strokeStyle=`rgba(34,197,94,${shieldAlpha})`;ctx.lineWidth=1;ctx.stroke();
      }
    }
    // Center device icon
    ctx.beginPath();ctx.arc(cx,cy,12,0,Math.PI*2);
    ctx.fillStyle='rgba(59,130,246,0.3)';ctx.fill();
    ctx.strokeStyle='#3b82f6';ctx.lineWidth=1.5;ctx.stroke();
    ctx.font='10px sans-serif';ctx.fillStyle='#3b82f6';ctx.textAlign='center';ctx.fillText('📱',cx,cy+4);
    // Incoming scan beams (threats)
    if(frameCount%15===0){
      const angle=Math.random()*Math.PI*2;
      scanBeams.push({angle,dist:shieldR*2.5,speed:2+Math.random()*2,blocked:Math.random()<score});
    }
    scanBeams.forEach((beam,i)=>{
      beam.dist-=beam.speed;
      const bx=cx+Math.cos(beam.angle)*beam.dist;
      const by=cy+Math.sin(beam.angle)*beam.dist;
      if(beam.dist<shieldR&&beam.blocked){
        // Deflection sparks
        for(let s=0;s<3;s++){
          const sa=beam.angle+Math.PI+(Math.random()-0.5)*1;
          const sd=shieldR+Math.random()*15;
          const sx=cx+Math.cos(sa)*sd,sy=cy+Math.sin(sa)*sd;
          ctx.beginPath();ctx.arc(sx,sy,1.5,0,Math.PI*2);
          ctx.fillStyle='#22c55e';ctx.globalAlpha=0.5;ctx.fill();ctx.globalAlpha=1;
        }
        scanBeams.splice(i,1);return;
      }
      if(beam.dist<15&&!beam.blocked){
        // Hit — device exposed
        ctx.beginPath();ctx.arc(cx,cy,18,0,Math.PI*2);
        ctx.fillStyle='rgba(239,68,68,0.2)';ctx.fill();
        scanBeams.splice(i,1);return;
      }
      if(beam.dist<0){scanBeams.splice(i,1);return;}
      // Draw beam
      ctx.beginPath();
      ctx.moveTo(cx+Math.cos(beam.angle)*(beam.dist+15),cy+Math.sin(beam.angle)*(beam.dist+15));
      ctx.lineTo(bx,by);
      ctx.strokeStyle=beam.blocked?'rgba(239,68,68,0.3)':'rgba(239,68,68,0.5)';ctx.lineWidth=2;ctx.stroke();
      // Beam head
      ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);ctx.fillStyle='#ef4444';ctx.fill();
    });
    if(scanBeams.length>30)scanBeams.splice(0,10);
    // Score display
    ctx.font='bold 22px Orbitron,monospace';ctx.textAlign='center';
    ctx.fillStyle=score>0.7?'#22c55e':score>0.4?'#fbbf24':'#ef4444';
    ctx.fillText(Math.round(score*100)+'%',cx,h-25);
    ctx.font='8px monospace';ctx.fillStyle='rgba(255,255,255,0.3)';
    ctx.fillText('INVISIBILITY SCORE',cx,h-12);
    // Test progress dots
    if(typeof TESTS!=='undefined'){
      const dotStartX=cx-TESTS.length*6;
      TESTS.forEach((t,i)=>{
        ctx.beginPath();ctx.arc(dotStartX+i*12,h-40,3,0,Math.PI*2);
        if(typeof results!=='undefined'&&i<results.length){
          ctx.fillStyle=results[i].pass?'#22c55e':results[i].warn?'#fbbf24':'#ef4444';
        }else{
          ctx.fillStyle='rgba(255,255,255,0.1)';
        }
        ctx.fill();
      });
    }
    _raf=requestAnimationFrame(draw);
  }
  function boot(){const c=ensureCanvas();if(!c)return setTimeout(boot,500);if(!_raf)draw();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
