/**
 * Workshop DIY — Bio Sweat Sensor Crypto v1.0
 * Sweat chemistry as cryptographic seed — Self-contained
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><circle cx="204" cy="146" r="50" fill="currentColor" opacity=".15"/><text x="204" y="158" text-anchor="middle" fill="currentColor" font-size="48" font-family="Orbitron,monospace" font-weight="700">W</text></svg>`;
const LIGHT_THEMES=['riad','medina'];
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,t+.08);o.start(t);o.stop(t+.08)}else if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(.001,t+.3);o.start(t);o.stop(t+.3)}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(.001,t+.25);o.start(t);o.stop(t+.25)}}
const LANG={en:{title:'Bio Sweat Sensor Crypto',subtitle:'Sweat chemistry as crypto seed',disconnected:'Disconnected',connected:'Connected',mainSection:'Sweat Crypto \u2014 Bio-Chemical Key Generation',mainDesc:'Sweat chemistry and body temperature generate unique cryptographic seeds',sectionA:'A \u2014 How It Works',sectionC:'C \u2014 Challenges',btn1:'Start Sensors',btn1Stop:'Stop',btn2:'Exercise Mode',btn3:'Generate Seed',btn4:'Verify',stat1:'pH',stat2:'mM NaCl',stat3:'\u00b0C skin',stat4:'bits entropy',step1Title:'Sweat Collection',step1Desc:'Bio-sensors measure sweat pH, NaCl concentration, and humidity.',step2Title:'Temperature Sampling',step2Desc:'Skin temperature adds thermal entropy from activity and environment.',step3Title:'Chemical Analysis',step3Desc:'Multiple chemical markers create a unique bio-signature.',step4Title:'Key Derivation',step4Desc:'Chemical values hashed into a cryptographic seed unique to each person.',ch1Title:'Unique Keys',ch1Desc:'Generate keys at rest vs after exercise. How different?',ch2Title:'Bio-Authentication',ch2Desc:'Can you reproduce similar keys under same conditions?',ch3Title:'Entropy Race',ch3Desc:'Who generates the highest-entropy seed in 30 seconds?',faq_q1:'Is sweat unique?',faq_a1:'Yes! Sweat varies by genetics, diet, health, and activity.',faq_q2:'How is the seed generated?',faq_a2:'Multiple sensor readings combined via XOR and hashing.',howto_1:'Start sensors to begin collecting sweat data.',howto_2:'Use Exercise Mode to increase sweat output.',howto_3:'Generate Seed when enough data is collected.',wiki1_title:'\ud83d\udca6 Sweat Biochemistry',wiki1_text:'Sweat: NaCl 10-90mM, pH 4-7, lactate, urea \u2014 all vary per individual.',wiki2_title:'\ud83d\udd11 Entropy Sources',wiki2_text:'Bio-signal randomness: pH fluctuations, temperature drift, NaCl variations.',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'\u2699\ufe0f Settings',language:'Language',theme:'Theme',help:'\u2753 Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',soundEffects:'\ud83d\udd0a Sound effects',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',splashHint:'tap to skip',working:'Working\u2026',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'\ud83d\udca6 Sweat Crypto ready \u2014 perspire to encrypt!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',langChanged:'\ud83c\udf10 Language \u2192 English',themeChanged:'\ud83c\udfa8 Theme \u2192'},
fr:{title:'Bio Crypto Sueur',subtitle:'Chimie de la sueur comme graine crypto',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'Crypto Sueur \u2014 G\u00e9n\u00e9ration de Cl\u00e9 Biochimique',mainDesc:'La chimie de la sueur g\u00e9n\u00e8re des graines cryptographiques uniques',sectionA:'A \u2014 Comment \u00e7a marche',sectionC:'C \u2014 D\u00e9fis',btn1:'D\u00e9marrer Capteurs',btn1Stop:'Arr\u00eat',btn2:'Mode Exercice',btn3:'G\u00e9n\u00e9rer Graine',btn4:'V\u00e9rifier',stat1:'pH',stat2:'mM NaCl',stat3:'\u00b0C peau',stat4:'bits entropie',step1Title:'Collecte Sueur',step1Desc:'Bio-capteurs mesurent pH, NaCl et humidit\u00e9.',step2Title:'Temp\u00e9rature',step2Desc:'La temp\u00e9rature cutan\u00e9e ajoute de l\'entropie thermique.',step3Title:'Analyse Chimique',step3Desc:'Marqueurs chimiques cr\u00e9ent une bio-signature unique.',step4Title:'D\u00e9rivation de Cl\u00e9',step4Desc:'Valeurs chimiques hach\u00e9es en graine cryptographique.',ch1Title:'Cl\u00e9s Uniques',ch1Desc:'Comparez repos vs exercice.',ch2Title:'Bio-Authentification',ch2Desc:'Reproduisez des cl\u00e9s similaires.',ch3Title:'Course Entropie',ch3Desc:'Plus haute entropie en 30 secondes?',faq_q1:'La sueur est-elle unique?',faq_a1:'Oui! Varie par g\u00e9n\u00e9tique, r\u00e9gime, sant\u00e9.',faq_q2:'Comment la graine est-elle g\u00e9n\u00e9r\u00e9e?',faq_a2:'Lectures combin\u00e9es par XOR et hachage.',howto_1:'D\u00e9marrez les capteurs.',howto_2:'Mode Exercice augmente la sueur.',howto_3:'G\u00e9n\u00e9rez quand assez de donn\u00e9es.',wiki1_title:'\ud83d\udca6 Biochimie',wiki1_text:'NaCl 10-90mM, pH 4-7, lactate, ur\u00e9e.',wiki2_title:'\ud83d\udd11 Entropie',wiki2_text:'Al\u00e9atoire biologique: fluctuations pH, temp, NaCl.',activityLog:'Journal',eventsMsg:'\u00c9v\u00e9nements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'\u2699\ufe0f Param\u00e8tres',language:'Langue',theme:'Th\u00e8me',help:'\u2753 Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',soundEffects:'\ud83d\udd0a Sons',breathingGuide:'Respiration',dhikrTap:'Tap',musicMode:'Musique',splashHint:'appuyer',working:'En cours\u2026',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'\ud83d\udca6 Crypto sueur pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 Fran\u00e7ais',themeChanged:'\ud83c\udfa8 \u2192'},
ar:{title:'\u062a\u0634\u0641\u064a\u0631 \u0627\u0644\u0639\u0631\u0642',subtitle:'\u0643\u064a\u0645\u064a\u0627\u0621 \u0627\u0644\u0639\u0631\u0642 \u0643\u0628\u0630\u0631\u0629 \u062a\u0634\u0641\u064a\u0631',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u062a\u0634\u0641\u064a\u0631 \u0627\u0644\u0639\u0631\u0642 \u2014 \u062a\u0648\u0644\u064a\u062f \u0645\u0641\u062a\u0627\u062d \u0643\u064a\u0645\u064a\u0627\u0626\u064a',mainDesc:'\u0643\u064a\u0645\u064a\u0627\u0621 \u0627\u0644\u0639\u0631\u0642 \u062a\u0648\u0644\u062f \u0628\u0630\u0648\u0631 \u062a\u0634\u0641\u064a\u0631 \u0641\u0631\u064a\u062f\u0629',sectionA:'\u0623 \u2014 \u0643\u064a\u0641 \u064a\u0639\u0645\u0644',sectionC:'\u062c \u2014 \u062a\u062d\u062f\u064a\u0627\u062a',btn1:'\u0628\u062f\u0621 \u0627\u0644\u0645\u0633\u062a\u0634\u0639\u0631\u0627\u062a',btn1Stop:'\u0625\u064a\u0642\u0627\u0641',btn2:'\u0648\u0636\u0639 \u0627\u0644\u062a\u0645\u0631\u064a\u0646',btn3:'\u062a\u0648\u0644\u064a\u062f \u0628\u0630\u0631\u0629',btn4:'\u062a\u062d\u0642\u0642',stat1:'pH',stat2:'mM NaCl',stat3:'\u062f\u0631\u062c\u0629',stat4:'\u0628\u062a \u0625\u0646\u062a\u0631\u0648\u0628\u064a',step1Title:'\u062c\u0645\u0639 \u0627\u0644\u0639\u0631\u0642',step1Desc:'\u0645\u0633\u062a\u0634\u0639\u0631\u0627\u062a \u062a\u0642\u064a\u0633 pH \u0648NaCl \u0648\u0627\u0644\u0631\u0637\u0648\u0628\u0629.',step2Title:'\u0627\u0644\u062d\u0631\u0627\u0631\u0629',step2Desc:'\u062d\u0631\u0627\u0631\u0629 \u0627\u0644\u062c\u0644\u062f \u062a\u0636\u064a\u0641 \u0625\u0646\u062a\u0631\u0648\u0628\u064a \u062d\u0631\u0627\u0631\u064a.',step3Title:'\u062a\u062d\u0644\u064a\u0644 \u0643\u064a\u0645\u064a\u0627\u0626\u064a',step3Desc:'\u0639\u0644\u0627\u0645\u0627\u062a \u0643\u064a\u0645\u064a\u0627\u0626\u064a\u0629 \u062a\u0646\u0634\u0626 \u0628\u0635\u0645\u0629 \u0641\u0631\u064a\u062f\u0629.',step4Title:'\u0627\u0634\u062a\u0642\u0627\u0642 \u0627\u0644\u0645\u0641\u062a\u0627\u062d',step4Desc:'\u0642\u064a\u0645 \u0643\u064a\u0645\u064a\u0627\u0626\u064a\u0629 \u062a\u064f\u0647\u0634 \u0625\u0644\u0649 \u0628\u0630\u0631\u0629 \u062a\u0634\u0641\u064a\u0631.',ch1Title:'\u0645\u0641\u0627\u062a\u064a\u062d \u0641\u0631\u064a\u062f\u0629',ch1Desc:'\u0642\u0627\u0631\u0646 \u0631\u0627\u062d\u0629 \u0645\u0642\u0627\u0628\u0644 \u062a\u0645\u0631\u064a\u0646.',ch2Title:'\u0645\u0635\u0627\u062f\u0642\u0629 \u062d\u064a\u0648\u064a\u0629',ch2Desc:'\u0623\u0639\u062f \u0625\u0646\u062a\u0627\u062c \u0645\u0641\u0627\u062a\u064a\u062d \u0645\u0645\u0627\u062b\u0644\u0629.',ch3Title:'\u0633\u0628\u0627\u0642 \u0625\u0646\u062a\u0631\u0648\u0628\u064a',ch3Desc:'\u0623\u0639\u0644\u0649 \u0625\u0646\u062a\u0631\u0648\u0628\u064a \u0641\u064a 30 \u062b\u0627\u0646\u064a\u0629.',faq_q1:'\u0647\u0644 \u0627\u0644\u0639\u0631\u0642 \u0641\u0631\u064a\u062f\u061f',faq_a1:'\u0646\u0639\u0645! \u064a\u062e\u062a\u0644\u0641 \u062d\u0633\u0628 \u0627\u0644\u0648\u0631\u0627\u062b\u0629 \u0648\u0627\u0644\u063a\u0630\u0627\u0621.',faq_q2:'\u0643\u064a\u0641 \u062a\u064f\u0648\u0644\u062f \u0627\u0644\u0628\u0630\u0631\u0629\u061f',faq_a2:'\u0642\u0631\u0627\u0621\u0627\u062a \u0645\u062f\u0645\u062c\u0629 \u0628XOR \u0648\u0647\u0634.',howto_1:'\u0634\u063a\u0644 \u0627\u0644\u0645\u0633\u062a\u0634\u0639\u0631\u0627\u062a.',howto_2:'\u0648\u0636\u0639 \u0627\u0644\u062a\u0645\u0631\u064a\u0646 \u064a\u0632\u064a\u062f \u0627\u0644\u0639\u0631\u0642.',howto_3:'\u0648\u0644\u062f \u0627\u0644\u0628\u0630\u0631\u0629 \u0639\u0646\u062f \u0643\u0641\u0627\u064a\u0629 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a.',wiki1_title:'\ud83d\udca6 \u0643\u064a\u0645\u064a\u0627\u0621',wiki1_text:'NaCl 10-90mM\u060c pH 4-7\u060c \u0644\u0627\u0643\u062a\u0627\u062a\u060c \u064a\u0648\u0631\u064a\u0627.',wiki2_title:'\ud83d\udd11 \u0625\u0646\u062a\u0631\u0648\u0628\u064a',wiki2_text:'\u0639\u0634\u0648\u0627\u0626\u064a\u0629 \u062d\u064a\u0648\u064a\u0629: \u062a\u0642\u0644\u0628\u0627\u062a pH \u0648\u062d\u0631\u0627\u0631\u0629.',activityLog:'\u0633\u062c\u0644',eventsMsg:'\u0623\u062d\u062f\u0627\u062b',clear:'\u0645\u0633\u062d',copy:'\u0646\u0633\u062e',export:'\u062a\u0635\u062f\u064a\u0631',filterAll:'\u0627\u0644\u0643\u0644',settings:'\u2699\ufe0f \u0625\u0639\u062f\u0627\u062f\u0627\u062a',language:'\u0644\u063a\u0629',theme:'\u0645\u0638\u0647\u0631',help:'\u2753 \u0645\u0633\u0627\u0639\u062f\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u062f\u0644\u064a\u0644',wiki:'\u0648\u064a\u0643\u064a',soundEffects:'\ud83d\udd0a \u0635\u0648\u062a',breathingGuide:'\u062a\u0646\u0641\u0633',dhikrTap:'\u0627\u0636\u063a\u0637',musicMode:'\u0645\u0648\u0633\u064a\u0642\u0649',splashHint:'\u0627\u0646\u0642\u0631',working:'\u062c\u0627\u0631\u064d\u2026',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a',ready:'\ud83d\udca6 \u062a\u0634\u0641\u064a\u0631 \u0627\u0644\u0639\u0631\u0642 \u062c\u0627\u0647\u0632!',logCleared:'\u062a\u0645 \u0627\u0644\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0627\u0644\u0639\u0631\u0628\u064a\u0629',themeChanged:'\ud83c\udfa8 \u2190'}};

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



/* ═══════ FRAMEWORK (compact) ═══════ */
let currentLang='en';
function setLanguage(l){currentLang=l;const s=LANG[l];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;if(s[k]!=null)e.textContent=s[k]});document.title=`${s.title} \u2014 Workshop DIY`;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.documentElement.lang=l;const sel=$('langSelect');if(sel)sel.value=l;try{localStorage.setItem('wdiy-lang',l)}catch{}log(s.langChanged,'info')}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const sel=$('themeSelect');if(sel)sel.value=n;try{localStorage.setItem('wdiy-theme',n)}catch{};const s=LANG[currentLang];log(`${s.themeChanged} ${s['t_'+n]||n}`,'info')}
let logContainer;const logHistory=[];
function log(m,t='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${t}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${m}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(t==='success')playSound('success');else if(t==='error')playSound('error');logHistory.push({m,t,ts:Date.now()});applyLogFilter()}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared)}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success')}catch{log(LANG[currentLang].copyFail,'error')}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='sweat-crypto-log.txt';a.click()}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter()})})}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'||l.classList.contains(activeLogFilter)?'':'none'})}
let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m;el.style.display='block'}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms)}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none'}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c)}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600)}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500)}
function calcHijriDate(){try{return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date())}catch{return''}}
function openPanel(p,o){const s=$(p),v=$(o);if(s)s.classList.add('open');if(v)v.classList.add('open')}
function closePanel(p,o,r){const s=$(p),v=$(o);if(s)s.classList.remove('open');if(v)v.classList.remove('open');const b=$(r);if(b)b.focus()}
function openHelp(){openPanel('helpPanel','helpOverlay')}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn')}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay')}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open')}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open')}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog()}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(t=>{t.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));t.classList.add('active');const id='help'+t.dataset.tab.charAt(0).toUpperCase()+t.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active')})})}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault()});document.addEventListener('mousemove',e=>{if(!d)return;const dx=document.documentElement.dir==='rtl'?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,innerWidth*.6))+'px')});document.addEventListener('mouseup',()=>{d=false})}
let breathingActive=false;function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive))}
function incrementDhikr(){const c=$('dhikrCounter');if(c)c.textContent=parseInt(c.textContent||'0')+1}
let matrixRunning=false,matrixAnim=null;const ARABIC_CHARS='\u0628\u0633\u0645\u0627\u0644\u0631\u062d\u0646\u064a\u0648\u0643\u0644\u062a\u0639\u062f\u0641\u0642\u062b\u0635\u0636\u0637\u0638\u063a\u0634\u0632\u062e\u062c\u0630';
function toggleMatrix(){const c=$('matrixCanvas');if(!c)return;if(matrixRunning){matrixRunning=false;cancelAnimationFrame(matrixAnim);c.classList.remove('active');return}matrixRunning=true;c.classList.add('active');const ctx=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;const cols=Math.floor(c.width/16),drops=Array(cols).fill(1);function draw(){if(!matrixRunning)return;ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#33ff33';ctx.font='14px Amiri';for(let i=0;i<drops.length;i++){ctx.fillText(ARABIC_CHARS[Math.floor(Math.random()*ARABIC_CHARS.length)],i*16,drops[i]*16);if(drops[i]*16>c.height&&Math.random()>.975)drops[i]=0;drops[i]++}matrixAnim=requestAnimationFrame(draw)}draw()}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ SWEAT SENSOR CRYPTO SIMULATION ═══════ */
/* ═══════════════════════════════════════════════════════════ */

let sensing=false,sweatPH=6.2,sweatNaCl=45,skinTemp=33.2,humidity=40,seedData=[],exerciseMode=false;

function initSweatApp(){
  const canvas=$('sweatCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=300;
  const W=canvas.width,H=canvas.height;let t=0;

  const gauges=[
    {label:'pH',key:'ph',min:4,max:8,color:'#33ff33',unit:'',get v(){return sweatPH}},
    {label:'NaCl',key:'nacl',min:10,max:90,color:'#6699ff',unit:'mM',get v(){return sweatNaCl}},
    {label:'Temp',key:'temp',min:28,max:40,color:'#ff6633',unit:'\u00b0C',get v(){return skinTemp}},
    {label:'Humidity',key:'hum',min:10,max:90,color:'#ffcc00',unit:'%',get v(){return humidity}}
  ];
  const histories={ph:[],nacl:[],temp:[],hum:[]};

  function frame(){
    ctx.fillStyle='rgba(0,0,0,.1)';ctx.fillRect(0,0,W,H);t+=.016;

    if(sensing){
      const ex=exerciseMode?1:0;
      sweatPH=5.5+Math.sin(t*.3)*.8+Math.random()*.2-ex*.3;
      sweatNaCl=40+Math.sin(t*.2)*15+Math.random()*5+ex*20;
      skinTemp=33+Math.sin(t*.1)*1.5+Math.random()*.3+ex*2;
      humidity=35+Math.sin(t*.15)*20+Math.random()*3+ex*15;
      seedData.push({ph:sweatPH,nacl:sweatNaCl,temp:skinTemp,hum:humidity,t:Date.now()});
      if(seedData.length>1000)seedData.shift();
      histories.ph.push(sweatPH);histories.nacl.push(sweatNaCl);histories.temp.push(skinTemp);histories.hum.push(humidity);
      Object.values(histories).forEach(h=>{if(h.length>120)h.shift()});
    }

    // Draw gauge bars
    const gw=W/4-15;
    gauges.forEach((g,i)=>{
      const gx=10+i*(gw+10),gy=15;
      ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(gx,gy,gw,H*.55);
      ctx.strokeStyle='rgba(255,255,255,.08)';ctx.strokeRect(gx,gy,gw,H*.55);

      const norm=(g.v-g.min)/(g.max-g.min);
      const barH=(H*.55-35)*Math.max(0,Math.min(1,norm));

      // Bar fill with gradient
      const grad=ctx.createLinearGradient(gx,gy+H*.55-35,gx,gy+H*.55-35-barH);
      grad.addColorStop(0,g.color);grad.addColorStop(1,g.color+'44');
      ctx.fillStyle=grad;ctx.fillRect(gx+5,gy+H*.55-35-barH,gw-10,barH);

      // Animated top cap
      ctx.fillStyle=g.color;ctx.fillRect(gx+5,gy+H*.55-40-barH,gw-10,4);

      // Labels
      ctx.fillStyle='#fff';ctx.font='bold 11px Orbitron';ctx.textAlign='center';
      ctx.fillText(g.label,gx+gw/2,gy+14);
      ctx.fillStyle=g.color;ctx.font='bold 14px Orbitron';
      ctx.fillText(`${g.v.toFixed(1)}${g.unit}`,gx+gw/2,gy+H*.55-8);
      ctx.textAlign='left';

      // Mini history graph
      const hist=histories[g.key];
      if(hist.length>1){
        const hy=gy+H*.55+8,hh=H*.35;
        ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(gx,hy,gw,hh);
        ctx.beginPath();ctx.strokeStyle=g.color+'88';ctx.lineWidth=1.5;
        hist.forEach((v,j)=>{
          const x=gx+(j/120)*gw;
          const y=hy+hh-((v-g.min)/(g.max-g.min))*hh;
          if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        });
        ctx.stroke();
      }
    });

    // Entropy indicator
    if(seedData.length>5){
      const entropy=calcEntropy();
      ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(W-130,H-30,122,22);
      ctx.fillStyle=entropy>6?'#33ff33':entropy>4?'#ffcc00':'#ff3366';
      ctx.font='bold 10px Orbitron';ctx.fillText(`Entropy: ${entropy.toFixed(1)} bits`,W-125,H-14);
    }

    // Stats
    const sp=$('statPH'),sn=$('statNaCl'),st=$('statTemp'),se=$('statEntropy');
    if(sp)sp.textContent=sweatPH.toFixed(1);if(sn)sn.textContent=Math.round(sweatNaCl);
    if(st)st.textContent=skinTemp.toFixed(1);
    if(se&&seedData.length>5)se.textContent=Math.round(calcEntropy()*seedData.length/8);

    requestAnimationFrame(frame);
  }
  frame();

  function calcEntropy(){
    if(seedData.length<10)return 0;
    const recent=seedData.slice(-50);
    const vals=recent.map(d=>Math.round(d.ph*10)^Math.round(d.nacl)^Math.round(d.temp*10)^Math.round(d.hum));
    const counts={};vals.forEach(v=>{counts[v]=(counts[v]||0)+1});
    let ent=0;const n=vals.length;
    Object.values(counts).forEach(c=>{const p=c/n;ent-=p*Math.log2(p)});
    return ent;
  }

  // Controls
  const startBtn=$('startBtn'),exBtn=$('exerciseBtn'),genBtn=$('genBtn'),verBtn=$('verifyBtn');

  if(startBtn)startBtn.onclick=()=>{
    sensing=!sensing;setStatus(sensing);
    const span=startBtn.querySelector('[data-i18n]');
    if(span)span.textContent=sensing?LANG[currentLang].btn1Stop:LANG[currentLang].btn1;
    log(sensing?'\ud83d\udca6 Sweat sensors active':'Sensors off','info');
  };
  if(exBtn)exBtn.onclick=()=>{
    exerciseMode=!exerciseMode;exBtn.classList.toggle('active',exerciseMode);
    log(exerciseMode?'\ud83c\udfcb Exercise mode: increased sweat output':'Exercise mode off','info');
    showToast(exerciseMode?'Sweating intensified!':'Normal mode',1200);
  };
  if(genBtn)genBtn.onclick=()=>{
    if(seedData.length<20){log('Collect more sweat data first (need 20+ samples)','error');return}
    const key=seedData.slice(-32).map(d=>((Math.round(d.ph*100))^(Math.round(d.nacl*7))^(Math.round(d.temp*13))^(Math.round(d.hum*3)))&0xFF);
    const hex=key.map(b=>b.toString(16).padStart(2,'0')).join('');
    const out=$('seedOutput');if(out)out.textContent=hex;
    const bits=key.length*8;
    log(`\ud83d\udd11 Crypto seed: ${hex.slice(0,32)}... (${bits} bits, entropy ${calcEntropy().toFixed(1)})`,'success');
    showToast(`${bits}-bit seed from sweat!`,2000);
  };
  if(verBtn)verBtn.onclick=()=>{
    if(seedData.length<40){log('Need more data for verification','error');return}
    const half=Math.floor(seedData.length/2);
    const k1=seedData.slice(half-16,half).map(d=>((d.ph*100)^(d.nacl*7))&0xFF);
    const k2=seedData.slice(-16).map(d=>((d.ph*100)^(d.nacl*7))&0xFF);
    let match=0;k1.forEach((v,i)=>{if(v===k2[i])match++});
    const pct=Math.round(match/k1.length*100);
    log(`\u2705 Verification: ${pct}% similarity between seed halves (${pct<30?'GOOD randomness':'LOW randomness'})`,'success');
    showToast(`${pct}% similarity`,1500);
  };
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;
  initLogFilters();
  const hBtn=$('helpBtn'),hC=$('helpCloseBtn'),hO=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp;if(hC)hC.onclick=closeHelp;if(hO)hO.onclick=closeHelp;
  initHelpTabs();
  const sBtn=$('settingsBtn'),sC=$('settingsCloseBtn'),sO=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings;if(sC)sC.onclick=closeSettings;if(sO)sO.onclick=closeSettings;
  const lBtn=$('logBtn'),lC=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog;if(lC)lC.onclick=closeLog;initLogResize();
  const st=$('soundToggle');
  if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true'}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled)}catch{}}}
  const bb=$('breathingBtn'),dd=$('dhikrDisplay'),db=$('dhikrBtn');
  if(bb)bb.onclick=()=>{toggleBreathing();if(dd)dd.style.display=breathingActive?'flex':'none'};
  if(db)db.onclick=incrementDhikr;
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog()}});
  const ls=$('langSelect');if(ls)ls.onchange=()=>setLanguage(ls.value);
  const ts=$('themeSelect');if(ts)ts.onchange=()=>setTheme(ts.value);
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl)}catch{}
  const hd=$('hijriDate');if(hd){const h=calcHijriDate();if(h)hd.textContent=h}
  let lc=0,lt=null;const logo=$('logoWrap');
  if(logo){logo.style.cursor='pointer';logo.onclick=()=>{lc++;if(lt)clearTimeout(lt);if(lc>=3){lc=0;toggleMatrix()}else lt=setTimeout(()=>lc=0,500)}}
  log(LANG[currentLang].ready,'success');
  setTimeout(initSweatApp,50);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ SWEAT SENSOR CRYPTO ADVANCED CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootSweatViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(0,200,255,.12);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- biochemical parameters --- */
    var sweatPH2=6.2,sweatNaCl2=45,skinTemp2=33.2,humidity2=40,lactate=2.5,urea=18;
    var exercising=false,exerciseTimer=0;

    /* --- history buffers --- */
    var phHistory=[],naclHistory=[],tempHistory=[],humHistory=[],lactateHistory=[];
    var MAX_HIST=200;

    /* --- seed & key state --- */
    var seedPool=[];var MAX_SEED=128;
    var generatedSeeds=[];var MAX_SEEDS=4;
    var seedBits=[];

    /* --- body silhouette with sweat zones --- */
    var sweatZones=[
      {name:'Forehead',x:0.50,y:0.08,rate:1.0,active:true},
      {name:'Palm L',x:0.30,y:0.50,rate:0.8,active:true},
      {name:'Palm R',x:0.70,y:0.50,rate:0.8,active:false},
      {name:'Underarm',x:0.35,y:0.35,rate:1.2,active:false},
      {name:'Back',x:0.50,y:0.40,rate:0.9,active:false},
      {name:'Foot',x:0.45,y:0.90,rate:0.7,active:false}
    ];
    var activeZone=0;

    function drawBodySilhouette(ox,oy,w,h){
      /* body outline */
      ctx.strokeStyle='rgba(0,200,255,0.15)';ctx.lineWidth=1.5;
      /* head */
      ctx.beginPath();ctx.ellipse(ox+w*0.50,oy+h*0.08,w*0.08,h*0.06,0,0,Math.PI*2);ctx.stroke();
      /* torso */
      ctx.beginPath();ctx.moveTo(ox+w*0.42,oy+h*0.14);ctx.lineTo(ox+w*0.38,oy+h*0.45);
      ctx.lineTo(ox+w*0.43,oy+h*0.55);ctx.lineTo(ox+w*0.57,oy+h*0.55);
      ctx.lineTo(ox+w*0.62,oy+h*0.45);ctx.lineTo(ox+w*0.58,oy+h*0.14);ctx.closePath();
      ctx.fillStyle='rgba(0,150,255,0.02)';ctx.fill();ctx.stroke();
      /* arms */
      ctx.beginPath();ctx.moveTo(ox+w*0.38,oy+h*0.18);ctx.lineTo(ox+w*0.22,oy+h*0.50);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ox+w*0.62,oy+h*0.18);ctx.lineTo(ox+w*0.78,oy+h*0.50);ctx.stroke();
      /* legs */
      ctx.beginPath();ctx.moveTo(ox+w*0.45,oy+h*0.55);ctx.lineTo(ox+w*0.42,oy+h*0.90);ctx.stroke();
      ctx.beginPath();ctx.moveTo(ox+w*0.55,oy+h*0.55);ctx.lineTo(ox+w*0.58,oy+h*0.90);ctx.stroke();

      /* sweat zones */
      sweatZones.forEach(function(z,zi){
        var zx=ox+z.x*w,zy=oy+z.y*h;
        var isAct=zi===activeZone;
        var sweatIntensity=exercising?z.rate*1.5:z.rate*0.5;

        /* zone circle */
        ctx.beginPath();ctx.arc(zx,zy,isAct?10:6,0,Math.PI*2);
        ctx.fillStyle=isAct?'rgba(0,204,255,0.4)':'rgba(0,204,255,0.15)';ctx.fill();
        ctx.strokeStyle=isAct?'#00ccff':'rgba(0,204,255,0.3)';ctx.lineWidth=1;ctx.stroke();

        /* sweat droplet animation */
        if(sweatIntensity>0.5){
          for(var di=0;di<2;di++){
            var dropY=zy+((t*20+di*15)%30);
            var dropA=1-(((t*20+di*15)%30)/30);
            ctx.beginPath();ctx.arc(zx+Math.sin(di*3)*3,dropY,1.5,0,Math.PI*2);
            ctx.fillStyle='rgba(0,204,255,'+(dropA*0.4).toFixed(2)+')';ctx.fill();
          }
        }

        /* label */
        if(isAct){
          ctx.fillStyle='#00ccff';ctx.font='7px Orbitron,monospace';
          ctx.fillText(z.name,zx+14,zy+3);
        }
      });

      /* emission rings from active zone */
      var az=sweatZones[activeZone];
      var azx=ox+az.x*w,azy=oy+az.y*h;
      for(var ri=0;ri<3;ri++){
        var rr=12+ri*10+Math.sin(t*3)*4;
        ctx.beginPath();ctx.arc(azx,azy,rr,0,Math.PI*2);
        ctx.strokeStyle='rgba(0,204,255,'+(0.15-ri*0.04).toFixed(2)+')';ctx.lineWidth=1;ctx.stroke();
      }

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('SWEAT ZONE MAP',ox+5,oy-8);
      ctx.fillText('Click to select zone',ox+5,oy+h+10);
    }

    /* --- draw chemical gauges --- */
    function drawChemGauges(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('BIOCHEMICAL ANALYSIS',ox+5,oy+12);

      var gauges=[
        {label:'pH',val:sweatPH2,min:4,max:8,color:'#33ff33',unit:''},
        {label:'NaCl',val:sweatNaCl2,min:10,max:90,color:'#6699ff',unit:'mM'},
        {label:'Temp',val:skinTemp2,min:28,max:40,color:'#ff6633',unit:'\u00b0C'},
        {label:'Humid',val:humidity2,min:10,max:90,color:'#ffcc00',unit:'%'},
        {label:'Lactate',val:lactate,min:0,max:15,color:'#ff33cc',unit:'mM'},
        {label:'Urea',val:urea,min:5,max:50,color:'#33ffcc',unit:'mg/dL'}
      ];

      var gw2=(w-20)/gauges.length-3;
      gauges.forEach(function(g,gi){
        var gx=ox+10+gi*(gw2+3),gy=oy+20;
        var norm=(g.val-g.min)/(g.max-g.min);
        var barH2=Math.max(0,Math.min(1,norm))*(h-45);

        var grad=ctx.createLinearGradient(gx,oy+h-5,gx,oy+h-5-barH2);
        grad.addColorStop(0,g.color);grad.addColorStop(1,g.color+'33');
        ctx.fillStyle=grad;ctx.fillRect(gx,oy+h-5-barH2,gw2,barH2);

        /* animated cap */
        ctx.fillStyle=g.color;ctx.fillRect(gx,oy+h-8-barH2,gw2,3);

        ctx.fillStyle='#fff';ctx.font='bold 7px Orbitron,monospace';ctx.textAlign='center';
        ctx.fillText(g.label,gx+gw2/2,gy);
        ctx.fillStyle=g.color;ctx.font='7px Orbitron,monospace';
        ctx.fillText(g.val.toFixed(1),gx+gw2/2,oy+h+6);
        ctx.textAlign='left';
      });
    }

    /* --- draw multi-trace history --- */
    function drawHistory(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('SENSOR TIMELINE',ox+5,oy+12);

      var traces=[
        {data:phHistory,color:'#33ff33',min:4,max:8,label:'pH'},
        {data:naclHistory,color:'#6699ff',min:10,max:90,label:'NaCl'},
        {data:tempHistory,color:'#ff6633',min:28,max:40,label:'Temp'},
        {data:lactateHistory,color:'#ff33cc',min:0,max:15,label:'Lac'}
      ];

      traces.forEach(function(tr){
        if(tr.data.length<2)return;
        ctx.beginPath();ctx.strokeStyle=tr.color+'88';ctx.lineWidth=1;
        tr.data.forEach(function(v,i){
          var x=ox+(i/MAX_HIST)*w;
          var y=oy+h-((v-tr.min)/(tr.max-tr.min))*(h-20)-5;
          if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        });
        ctx.stroke();
      });

      /* legend */
      traces.forEach(function(tr2,i){
        ctx.fillStyle=tr2.color;ctx.font='6px Orbitron,monospace';
        ctx.fillText(tr2.label,ox+w-80+i*20,oy+h-3);
      });
    }

    /* --- draw seed visualization --- */
    function drawSeedViz(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('CRYPTO SEED GENERATION',ox+5,oy+12);

      /* entropy pool as colored grid */
      var sqSize=4,cols2=Math.floor((w-10)/(sqSize+1));
      for(var i=0;i<seedPool.length&&i<cols2*6;i++){
        var col2=i%cols2,row2=Math.floor(i/cols2);
        var hue3=seedPool[i]/255*360;
        ctx.fillStyle='hsla('+hue3+',70%,50%,0.8)';
        ctx.fillRect(ox+5+col2*(sqSize+1),oy+22+row2*(sqSize+1),sqSize,sqSize);
      }

      /* progress */
      ctx.fillStyle='rgba(255,255,255,0.1)';ctx.fillRect(ox+5,oy+60,w-10,4);
      ctx.fillStyle='#33ffcc';ctx.fillRect(ox+5,oy+60,(w-10)*seedPool.length/MAX_SEED,4);

      /* generated seeds */
      generatedSeeds.forEach(function(s,si){
        var sy=oy+72+si*22;
        if(sy+15>oy+h)return;
        ctx.fillStyle='#33ffcc';ctx.font='6px monospace';
        ctx.fillText('#'+(si+1)+': '+s.hex.substring(0,40)+'...',ox+5,sy);
        ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='6px Orbitron,monospace';
        ctx.fillText(s.bits+' bits  |  ent: '+s.entropy.toFixed(1),ox+5,sy+10);
      });
    }

    /* --- draw molecular diagram --- */
    function drawMolecules(ox,oy,w,h){
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(ox,oy,w,h);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('SWEAT COMPOSITION',ox+5,oy+12);

      var molecules=[
        {name:'NaCl',pct:sweatNaCl2/90,color:'#6699ff',x:0.15,y:0.45},
        {name:'H\u2082O',pct:0.95,color:'#33ffcc',x:0.50,y:0.35},
        {name:'Lactate',pct:lactate/15,color:'#ff33cc',x:0.35,y:0.65},
        {name:'Urea',pct:urea/50,color:'#ffcc00',x:0.70,y:0.55},
        {name:'K\u207a',pct:0.3,color:'#ff6633',x:0.80,y:0.40}
      ];

      molecules.forEach(function(m,mi){
        var mx2=ox+m.x*w,my2=oy+m.y*h;
        var r=5+m.pct*15;

        /* molecule circle */
        ctx.beginPath();ctx.arc(mx2,my2,r,0,Math.PI*2);
        ctx.fillStyle=m.color+'33';ctx.fill();
        ctx.strokeStyle=m.color;ctx.lineWidth=1;ctx.stroke();

        /* brownian motion */
        var bx=mx2+Math.sin(t*2+mi*1.5)*5;
        var by=my2+Math.cos(t*1.8+mi*2)*4;
        ctx.beginPath();ctx.arc(bx,by,3,0,Math.PI*2);
        ctx.fillStyle=m.color+'88';ctx.fill();

        ctx.fillStyle=m.color;ctx.font='7px Orbitron,monospace';ctx.textAlign='center';
        ctx.fillText(m.name,mx2,my2+r+10);ctx.textAlign='left';
      });
    }

    /* --- main frame --- */
    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.12)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      /* auto exercise toggle */
      exerciseTimer+=0.016;
      if(exerciseTimer>10){exerciseTimer=0;exercising=!exercising;}

      /* simulate biochem */
      var ex=exercising?1:0;
      sweatPH2=5.5+Math.sin(t*0.3)*0.8+Math.random()*0.2-ex*0.3;
      sweatNaCl2=40+Math.sin(t*0.2)*15+Math.random()*5+ex*20;
      skinTemp2=33+Math.sin(t*0.1)*1.5+Math.random()*0.3+ex*2;
      humidity2=35+Math.sin(t*0.15)*20+Math.random()*3+ex*15;
      lactate=2+Math.sin(t*0.25)*1.5+Math.random()*0.5+ex*5;
      urea=15+Math.sin(t*0.18)*8+Math.random()*2+ex*5;

      /* record history */
      phHistory.push(sweatPH2);naclHistory.push(sweatNaCl2);
      tempHistory.push(skinTemp2);humHistory.push(humidity2);
      lactateHistory.push(lactate);
      [phHistory,naclHistory,tempHistory,humHistory,lactateHistory].forEach(function(h2){if(h2.length>MAX_HIST)h2.shift();});

      /* seed collection */
      var seedByte=((Math.round(sweatPH2*100))^(Math.round(sweatNaCl2*7))^(Math.round(skinTemp2*13))^(Math.round(lactate*31))^(Math.round(urea*3)))&0xFF;
      seedPool.push(seedByte);if(seedPool.length>MAX_SEED)seedPool.shift();

      /* auto generate seed */
      if(seedPool.length>=MAX_SEED&&t%4<0.02){
        var keyBytes2=[];
        for(var i=0;i<32;i++){
          keyBytes2.push((seedPool[i]^seedPool[(i*7+3)%MAX_SEED]^(seedPool[(i*13+11)%MAX_SEED]>>1))&0xFF);
        }
        var hex2=keyBytes2.map(function(b){return b.toString(16).padStart(2,'0');}).join('');
        var counts={};keyBytes2.forEach(function(v){counts[v]=(counts[v]||0)+1;});
        var ent2=0,n2=keyBytes2.length;
        Object.values(counts).forEach(function(c){var p=c/n2;ent2-=p*Math.log2(p);});
        generatedSeeds.unshift({hex:hex2,bits:256,entropy:ent2});
        if(generatedSeeds.length>MAX_SEEDS)generatedSeeds.pop();
        seedBits=keyBytes2;
      }

      /* ---- LAYOUT ---- */

      /* Top-left: Body silhouette with sweat zones */
      var bodyW2=W*0.30,bodyH2=H*0.52;
      drawBodySilhouette(15,20,bodyW2,bodyH2);

      /* Top-center: Chemical gauges */
      drawChemGauges(W*0.32,0,W*0.35,H*0.30);

      /* Top-right: Molecular diagram */
      drawMolecules(W*0.68,0,W*0.32-5,H*0.30);

      /* Middle: Sensor timeline */
      drawHistory(W*0.32,H*0.32,W*0.68-5,H*0.20);

      /* Bottom-left: Seed visualization */
      drawSeedViz(0,H*0.55,W*0.50,H*0.30);

      /* Bottom-right: Stats */
      var stX2=W*0.52,stY2=H*0.55,stW2=W*0.48-5,stH2=H*0.30;
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(stX2,stY2,stW2,stH2);
      ctx.fillStyle='#fff';ctx.font='bold 9px Orbitron,monospace';
      ctx.fillText('SWEAT CRYPTO METRICS',stX2+10,stY2+14);

      var stats5=[
        ['pH',sweatPH2.toFixed(2)],
        ['NaCl',Math.round(sweatNaCl2)+' mM'],
        ['Skin Temp',skinTemp2.toFixed(1)+' \u00b0C'],
        ['Humidity',Math.round(humidity2)+'%'],
        ['Lactate',lactate.toFixed(1)+' mM'],
        ['Urea',Math.round(urea)+' mg/dL'],
        ['Exercise',exercising?'ACTIVE':'REST'],
        ['Seeds',generatedSeeds.length.toString()],
        ['Pool',seedPool.length+'/'+MAX_SEED],
        ['Zone',sweatZones[activeZone].name]
      ];
      stats5.forEach(function(s,si){
        var sx=stX2+10+(si%2)*stW2*0.48;
        var sy=stY2+30+Math.floor(si/2)*14;
        ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
        ctx.fillText(s[0]+':',sx,sy);
        ctx.fillStyle='#33ffcc';ctx.fillText(s[1],sx+72,sy);
      });

      /* Very bottom: seed bit bars */
      var bbY=H*0.87;
      ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(0,bbY,W,H-bbY);
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('SEED ENTROPY VISUALIZATION',5,bbY+10);
      if(seedBits.length>0){
        for(var sb2=0;sb2<Math.min(seedBits.length,64);sb2++){
          var sbx=80+sb2*(W-90)/64;
          var sbh=seedBits[sb2]/255*(H-bbY-15);
          ctx.fillStyle='hsla('+(seedBits[sb2]/255*180)+',60%,50%,0.7)';
          ctx.fillRect(sbx,H-3-sbh,Math.max(1,(W-90)/64-1),sbh);
        }
      }

      /* HUD */
      ctx.strokeStyle='rgba(0,200,255,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl5=18;ctx.strokeStyle='rgba(0,200,255,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl5);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl5,c[1]);ctx.stroke();
      });
      ctx.fillStyle='rgba(0,200,255,'+(0.4+Math.sin(t*4)*0.3)+')';
      ctx.beginPath();ctx.arc(W-20,14,4,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.35)';ctx.font='8px Orbitron,monospace';ctx.fillText('SWEAT',W-65,17);

      requestAnimationFrame(frame);
    }

    /* click to select sweat zone */
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(W/rect.width);
      var my=(e.clientY-rect.top)*(H/rect.height);
      var bodyW3=W*0.30;
      if(mx<bodyW3+30){
        sweatZones.forEach(function(z,zi){
          var zx=15+z.x*bodyW3,zy=20+z.y*(H*0.52);
          if(Math.sqrt((mx-zx)*(mx-zx)+(my-zy)*(my-zy))<20)activeZone=zi;
        });
      }
    });

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootSweatViz);
  else setTimeout(bootSweatViz,200);
})();
