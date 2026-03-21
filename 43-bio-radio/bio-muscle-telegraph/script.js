/**
 * Workshop DIY — Bio Muscle Telegraph v1.0
 * EMG to Morse code transmission
 */
const LANG={
  en:{title:'Bio Muscle Telegraph',subtitle:'Muscles tap Morse code',disconnected:'Disconnected',connected:'Connected',mainSection:'Muscle Telegraph \u2014 EMG to Morse',mainDesc:'Muscle contractions converted to Morse code',ready:'\ud83d\udcaa Muscle Telegraph ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Bio T\u00e9l\u00e9graphe Musculaire',subtitle:'Les muscles tapent du Morse',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'T\u00e9l\u00e9graphe Musculaire \u2014 EMG en Morse',mainDesc:'Contractions musculaires converties en code Morse',ready:'\ud83d\udcaa T\u00e9l\u00e9graphe pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'\u062a\u0644\u063a\u0631\u0627\u0641 \u0627\u0644\u0639\u0636\u0644\u0627\u062a',subtitle:'\u0627\u0644\u0639\u0636\u0644\u0627\u062a \u062a\u0646\u0642\u0631 \u0634\u0641\u0631\u0629 \u0645\u0648\u0631\u0633',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u062a\u0644\u063a\u0631\u0627\u0641 \u0627\u0644\u0639\u0636\u0644\u0627\u062a \u2014 EMG \u0625\u0644\u0649 \u0645\u0648\u0631\u0633',mainDesc:'\u0627\u0646\u0642\u0628\u0627\u0636\u0627\u062a \u0639\u0636\u0644\u064a\u0629 \u062a\u062a\u062d\u0648\u0644 \u0644\u0634\u0641\u0631\u0629 \u0645\u0648\u0631\u0633',ready:'\ud83d\udcaa \u062a\u0644\u063a\u0631\u0627\u0641 \u0627\u0644\u0639\u0636\u0644\u0627\u062a \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a'}
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



const MORSE_MAP={'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---','k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-','u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','0':'-----',' ':'/'};
const MORSE_REV=Object.fromEntries(Object.entries(MORSE_MAP).map(([k,v])=>[v,k]));

let emgRunning=false,emgData=[],morseBuffer='',decodedText='',charCount=0,emgLevel=0;

function initApp(){
  const canvas=$('emgCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=300;
  const W=canvas.width,H=canvas.height;let t=0,flexing=false,flexStart=0;

  function frame(){
    ctx.fillStyle='rgba(0,0,0,.08)';ctx.fillRect(0,0,W,H);t++;
    if(emgRunning){
      const noise=(Math.random()-.5)*30;
      emgLevel=flexing?200+Math.random()*150:noise+15;
      emgData.push(emgLevel);if(emgData.length>W)emgData.shift();
      const se=$('statEMG');if(se)se.textContent=Math.round(Math.abs(emgLevel));
    }
    // Draw EMG trace
    if(emgData.length>1){
      ctx.beginPath();ctx.strokeStyle=emgLevel>100?'#ff6633':'#33ff33';ctx.lineWidth=1.5;
      emgData.forEach((v,i)=>{const x=i,y=H/2-v/400*H;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});
      ctx.stroke();
    }
    // Threshold line
    ctx.strokeStyle='rgba(255,204,0,.3)';ctx.setLineDash([6,6]);
    ctx.beginPath();ctx.moveTo(0,H/2-100/400*H);ctx.lineTo(W,H/2-100/400*H);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,H/2+100/400*H);ctx.lineTo(W,H/2+100/400*H);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='rgba(255,204,0,.3)';ctx.font='9px Orbitron';ctx.fillText('THRESHOLD',W-80,H/2-100/400*H-5);
    requestAnimationFrame(frame);
  }
  frame();

  const startBtn=$('startBtn'),flexBtn=$('flexBtn'),holdBtn=$('holdBtn'),decodeBtn=$('decodeBtn'),encodeBtn=$('encodeBtn');

  if(startBtn)startBtn.onclick=()=>{emgRunning=!emgRunning;setStatus(emgRunning);log(emgRunning?'EMG started':'EMG stopped','info')};

  if(flexBtn){
    flexBtn.onmousedown=flexBtn.ontouchstart=()=>{if(!emgRunning)return;emgLevel=250;morseBuffer+='.';updateMorse();log('DOT (.)','tx');playSound('click')};
  }
  if(holdBtn){
    holdBtn.onmousedown=holdBtn.ontouchstart=()=>{if(!emgRunning)return;emgLevel=350;morseBuffer+='-';updateMorse();log('DASH (-)','tx');playSound('click')};
  }

  if(decodeBtn)decodeBtn.onclick=()=>{
    if(!morseBuffer){log('No Morse to decode','error');return}
    const words=morseBuffer.split(' / ').map(w=>w.split(' ').map(c=>MORSE_REV[c]||'?').join('')).join(' ');
    decodedText=words;charCount+=words.replace(/ /g,'').length;
    const md=$('morseDisplay'),sc=$('statChars');
    if(md)md.textContent=`${morseBuffer} | ${words.toUpperCase()}`;
    if(sc)sc.textContent=charCount;
    log(`Decoded: ${words.toUpperCase()}`,'success');morseBuffer='';
  };

  if(encodeBtn)encodeBtn.onclick=()=>{
    const msg=($('msgInput')||{}).value||'';if(!msg){log('Enter message','error');return}
    morseBuffer=msg.toLowerCase().split('').map(c=>MORSE_MAP[c]||'').join(' ');
    updateMorse();log(`Encoded: ${morseBuffer}`,'tx');
  };

  // Space key = letter separator, Enter = word separator
  document.addEventListener('keydown',e=>{
    if(!emgRunning)return;
    if(e.code==='Space'&&!e.target.matches('input')){e.preventDefault();morseBuffer+=' ';updateMorse()}
    if(e.code==='Slash'){morseBuffer+=' / ';updateMorse()}
  });

  function updateMorse(){const md=$('morseDisplay');if(md)md.textContent=morseBuffer||'...';}
}

/* ═══════════════════════════════════════════════════════════ */
/* ═══════ MUSCLE TELEGRAPH CANVAS VIZ (IIFE) ═══════ */
/* ═══════════════════════════════════════════════════════════ */
;(function(){
  'use strict';

  function bootMuscleViz(){
    var host=document.querySelector('.main-panel')||document.querySelector('.card-body')||document.querySelector('main')||document.body;
    var wrap=document.createElement('div');
    wrap.style.cssText='position:relative;width:100%;max-width:800px;margin:18px auto;border-radius:14px;overflow:hidden;box-shadow:0 0 24px rgba(255,100,50,.12);background:#0a0a14;';
    var cvs=document.createElement('canvas');cvs.width=800;cvs.height=520;cvs.style.cssText='width:100%;display:block;border-radius:14px;';
    wrap.appendChild(cvs);host.appendChild(wrap);

    var ctx=cvs.getContext('2d'),W=cvs.width,H=cvs.height,t=0;

    /* --- Morse code map --- */
    var MORSE={'a':'.-','b':'-...','c':'-.-.','d':'-..','e':'.','f':'..-.','g':'--.','h':'....','i':'..','j':'.---','k':'-.-','l':'.-..','m':'--','n':'-.','o':'---','p':'.--.','q':'--.-','r':'.-.','s':'...','t':'-','u':'..-','v':'...-','w':'.--','x':'-..-','y':'-.--','z':'--..'};
    var MORSE_REV={};Object.keys(MORSE).forEach(function(k){MORSE_REV[MORSE[k]]=k;});

    /* --- state --- */
    var emgBuffer=new Float32Array(W);
    var rectifiedBuffer=new Float32Array(W);
    var morseSymbols=[]; // {type:'dot'|'dash'|'space',time:t}
    var decodedChars=[];
    var currentWord='';
    var isFlexing=false,flexIntensity=0,flexTimer=0;
    var autoMode=true,autoMsg='SOS HELLO WORLD';
    var autoIdx=0,autoSymIdx=0,autoDelay=0;
    var muscleGroups=[
      {name:'Bicep',x:0.22,y:0.42,active:false,emgScale:1.0},
      {name:'Forearm',x:0.28,y:0.58,active:true,emgScale:0.8},
      {name:'Wrist Flex',x:0.32,y:0.68,active:false,emgScale:0.6}
    ];
    var activeMuscle=1;
    var spectrogramData=[];
    var MAX_SPEC=80;

    /* --- arm outline points --- */
    var armTop=[[0.08,0.30],[0.14,0.28],[0.22,0.30],[0.28,0.35],[0.35,0.45],[0.40,0.55],[0.42,0.65],[0.40,0.72]];
    var armBot=[[0.08,0.50],[0.14,0.52],[0.22,0.55],[0.28,0.58],[0.35,0.62],[0.40,0.68],[0.42,0.72]];

    /* scale to arm region */
    var armW=280,armH=300,armOX=10,armOY=200;
    function ax(nx){return armOX+nx*armW;}
    function ay(ny){return armOY+ny*armH;}

    /* --- auto-send morse --- */
    function autoStep(){
      if(!autoMode)return;
      autoDelay-=0.016;
      if(autoDelay>0)return;

      if(autoIdx>=autoMsg.length){autoIdx=0;autoSymIdx=0;}
      var ch=autoMsg[autoIdx].toLowerCase();
      if(ch===' '){
        morseSymbols.push({type:'space',time:t});
        decodedChars.push(' ');
        autoIdx++;autoSymIdx=0;autoDelay=0.6;
        return;
      }
      var code=MORSE[ch];
      if(!code){autoIdx++;autoSymIdx=0;return;}
      if(autoSymIdx>=code.length){
        /* letter done, decode */
        decodedChars.push(ch.toUpperCase());
        autoIdx++;autoSymIdx=0;autoDelay=0.4;
        return;
      }
      var sym=code[autoSymIdx];
      isFlexing=true;
      flexIntensity=sym==='.'?0.6:1.0;
      flexTimer=sym==='.'?0.12:0.35;
      morseSymbols.push({type:sym==='.'?'dot':'dash',time:t});
      autoSymIdx++;autoDelay=sym==='.'?0.25:0.5;
    }

    /* --- draw morse tape --- */
    function drawMorseTape(x,y,w,h){
      ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(x,y,w,h);
      ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.strokeRect(x,y,w,h);

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('MORSE OUTPUT TAPE',x+5,y+12);

      /* draw recent symbols */
      var startIdx=Math.max(0,morseSymbols.length-40);
      var tx=x+10;
      for(var i=startIdx;i<morseSymbols.length;i++){
        var sym=morseSymbols[i];
        if(sym.type==='dot'){
          ctx.fillStyle='#ff6633';ctx.beginPath();ctx.arc(tx,y+h/2+5,4,0,Math.PI*2);ctx.fill();
          tx+=12;
        }else if(sym.type==='dash'){
          ctx.fillStyle='#ff6633';ctx.fillRect(tx-2,y+h/2+1,18,8);
          tx+=24;
        }else{
          tx+=15;
        }
        if(tx>x+w-10)break;
      }

      /* decoded text */
      var decoded=decodedChars.slice(-30).join('');
      ctx.fillStyle='#33ff33';ctx.font='bold 12px Orbitron,monospace';
      ctx.fillText(decoded,x+10,y+h-10);
    }

    /* --- main frame --- */
    function frame(){
      ctx.fillStyle='rgba(6,6,16,0.12)';ctx.fillRect(0,0,W,H);
      t+=0.016;

      /* auto morse stepping */
      autoStep();

      /* flex timer */
      if(flexTimer>0){flexTimer-=0.016;if(flexTimer<=0){isFlexing=false;flexIntensity=0;}}

      /* generate EMG signal */
      var noise=(Math.random()-0.5)*0.08;
      var mg=muscleGroups[activeMuscle];
      var emgVal=isFlexing?(flexIntensity*mg.emgScale*(0.7+Math.random()*0.3)+Math.sin(t*120)*0.15*flexIntensity):noise*0.3;
      var rectVal=Math.abs(emgVal);

      /* shift buffers */
      for(var i=0;i<W-1;i++){emgBuffer[i]=emgBuffer[i+1];rectifiedBuffer[i]=rectifiedBuffer[i+1];}
      emgBuffer[W-1]=emgVal;rectifiedBuffer[W-1]=rectVal;

      /* ---- SECTION 1: Raw EMG (top) ---- */
      var emgY0=0,emgH=H*0.22;
      ctx.save();ctx.beginPath();ctx.rect(0,emgY0,W,emgH);ctx.clip();
      ctx.fillStyle='rgba(6,6,16,0.3)';ctx.fillRect(0,emgY0,W,emgH);

      /* threshold lines */
      ctx.strokeStyle='rgba(255,204,0,0.15)';ctx.setLineDash([4,4]);ctx.lineWidth=0.5;
      var threshY=emgH*0.3;
      ctx.beginPath();ctx.moveTo(0,emgY0+threshY);ctx.lineTo(W,emgY0+threshY);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,emgY0+emgH-threshY);ctx.lineTo(W,emgY0+emgH-threshY);ctx.stroke();
      ctx.setLineDash([]);

      /* draw raw EMG */
      ctx.beginPath();ctx.strokeStyle=isFlexing?'#ff6633':'#33ff33';ctx.lineWidth=1.5;
      for(var i=0;i<W;i++){
        var y=emgY0+emgH/2-emgBuffer[i]*emgH*0.8;
        if(i===0)ctx.moveTo(i,y);else ctx.lineTo(i,y);
      }
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('RAW EMG SIGNAL',10,emgY0+12);
      ctx.fillStyle='rgba(255,204,0,0.3)';ctx.fillText('THRESHOLD',W-70,emgY0+threshY-3);

      /* ---- SECTION 2: Rectified EMG ---- */
      var rectY0=emgH+5,rectH=H*0.13;
      ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(0,rectY0,W,rectH);

      ctx.beginPath();ctx.strokeStyle='#ffcc00';ctx.lineWidth=1.2;
      for(var i=0;i<W;i++){
        var y=rectY0+rectH-rectifiedBuffer[i]*rectH*1.6;
        if(i===0)ctx.moveTo(i,y);else ctx.lineTo(i,y);
      }
      ctx.stroke();
      /* filled area */
      ctx.fillStyle='rgba(255,204,0,0.08)';ctx.beginPath();ctx.moveTo(0,rectY0+rectH);
      for(var i=0;i<W;i++){
        var y=rectY0+rectH-rectifiedBuffer[i]*rectH*1.6;ctx.lineTo(i,y);
      }
      ctx.lineTo(W,rectY0+rectH);ctx.closePath();ctx.fill();

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('RECTIFIED + ENVELOPE',10,rectY0+12);

      /* ---- SECTION 3: EMG Spectrogram ---- */
      var specY0=rectY0+rectH+5,specH=H*0.18;
      /* build spectrum from recent EMG */
      var specRow=[];
      for(var b=0;b<64;b++){
        var freq=b*8;// 0-512Hz
        var amp=0.02;
        if(isFlexing){
          /* EMG spectrum: broad 20-150Hz with peaks at muscle firing freq */
          amp+=Math.exp(-(freq-80)*(freq-80)/3000)*flexIntensity*0.5;
          amp+=Math.exp(-(freq-40)*(freq-40)/1000)*flexIntensity*0.3;
          amp+=Math.random()*0.05*flexIntensity;
        }
        amp+=Math.random()*0.02;
        specRow.push(Math.min(1,amp));
      }
      spectrogramData.push(specRow);
      if(spectrogramData.length>MAX_SPEC)spectrogramData.shift();

      var cellW=W/64,cellH=specH/MAX_SPEC;
      for(var row=0;row<spectrogramData.length;row++){
        for(var col=0;col<64;col++){
          var v=spectrogramData[row][col];
          var r=Math.min(255,v*600)|0;
          var g=Math.min(255,Math.max(0,(v-0.15)*500))|0;
          var bl=Math.max(0,(0.5-v)*200)|0;
          ctx.fillStyle='rgb('+r+','+g+','+bl+')';
          ctx.fillRect(col*cellW,specY0+row*cellH,cellW+0.5,cellH+0.5);
        }
      }
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('EMG SPECTROGRAM (0-512Hz)',10,specY0+12);

      /* ---- SECTION 4: Bottom — Arm + Morse ---- */
      var botY=specY0+specH+8;

      /* ---- Arm diagram (left) ---- */
      var armRegW=W*0.38;
      ctx.fillStyle='rgba(0,0,0,0.25)';ctx.fillRect(0,botY,armRegW,H-botY);

      /* arm outline */
      ctx.strokeStyle='rgba(0,200,255,0.2)';ctx.lineWidth=1.5;
      ctx.beginPath();
      armTop.forEach(function(p,i){var x=p[0]*armRegW*2+10,y=botY+(p[1]-0.25)*300;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
      ctx.stroke();
      ctx.beginPath();
      armBot.forEach(function(p,i){var x=p[0]*armRegW*2+10,y=botY+(p[1]-0.25)*300;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
      ctx.stroke();

      /* muscle groups / electrodes */
      muscleGroups.forEach(function(mg2,idx){
        var ex=mg2.x*armRegW*2+10,ey=botY+(mg2.y-0.25)*300;
        var isAct=idx===activeMuscle;

        /* electrode */
        ctx.beginPath();ctx.arc(ex,ey,isAct?8:5,0,Math.PI*2);
        ctx.fillStyle=isAct?(isFlexing?'#ff6633':'#33ff33')+'88':'rgba(100,100,200,0.3)';
        ctx.fill();ctx.strokeStyle=isAct?'#fff':'rgba(255,255,255,0.2)';ctx.lineWidth=1;ctx.stroke();

        /* EMG burst animation */
        if(isAct&&isFlexing){
          for(var r=0;r<2;r++){
            var rad=12+r*10+Math.sin(t*8)*4;
            ctx.beginPath();ctx.arc(ex,ey,rad,0,Math.PI*2);
            ctx.strokeStyle='rgba(255,100,50,'+(0.3-r*0.12)+')';ctx.stroke();
          }
        }

        ctx.fillStyle=isAct?'#fff':'rgba(255,255,255,0.4)';ctx.font='8px Orbitron,monospace';
        ctx.fillText(mg2.name,ex+12,ey+3);
      });

      /* muscle contraction visualization */
      if(isFlexing){
        var mx=muscleGroups[activeMuscle].x*armRegW*2+10;
        var my=botY+(muscleGroups[activeMuscle].y-0.25)*300;
        /* fiber lines */
        ctx.strokeStyle='rgba(255,100,50,0.15)';ctx.lineWidth=0.5;
        for(var f=0;f<8;f++){
          var fy=my-20+f*5;
          var contraction=Math.sin(t*30+f)*3*flexIntensity;
          ctx.beginPath();ctx.moveTo(mx-25,fy);
          for(var fx=mx-25;fx<mx+25;fx+=3){
            ctx.lineTo(fx,fy+Math.sin((fx+t*50)*0.3)*contraction);
          }
          ctx.stroke();
        }
      }

      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';
      ctx.fillText('MUSCLE ELECTRODE MAP',10,botY+12);

      /* ---- Morse tape (right) ---- */
      drawMorseTape(armRegW+10,botY,W-armRegW-20,H-botY-5);

      /* ---- Morse code reference (small) ---- */
      var refX=armRegW+20,refY=botY+45;
      ctx.fillStyle='rgba(255,255,255,0.2)';ctx.font='7px Orbitron,monospace';
      ctx.fillText('A .-  B -...  C -.-.  D -..  E .  F ..-.',refX,refY);
      ctx.fillText('G --.  H ....  I ..  J .---  K -.-  L .-..',refX,refY+11);
      ctx.fillText('S ...  O ---  SPACE = /  DOT=short  DASH=long',refX,refY+22);

      /* ---- HUD ---- */
      ctx.strokeStyle='rgba(255,100,50,0.08)';ctx.lineWidth=1;ctx.strokeRect(1,1,W-2,H-2);
      var cl=18;ctx.strokeStyle='rgba(255,100,50,0.2)';ctx.lineWidth=1.5;
      [[0,0,1,1],[W,0,-1,1],[0,H,1,-1],[W,H,-1,-1]].forEach(function(c){
        ctx.beginPath();ctx.moveTo(c[0],c[1]+c[3]*cl);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+c[2]*cl,c[1]);ctx.stroke();
      });

      /* flex indicator */
      if(isFlexing){
        ctx.fillStyle='rgba(255,100,50,'+(0.5+Math.sin(t*10)*0.3)+')';
        ctx.beginPath();ctx.arc(W-20,14,5,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#ff6633';ctx.font='9px Orbitron,monospace';ctx.fillText('FLEX',W-60,17);
      }else{
        ctx.fillStyle='rgba(0,255,100,0.4)';ctx.beginPath();ctx.arc(W-20,14,3,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='rgba(255,255,255,0.3)';ctx.font='8px Orbitron,monospace';ctx.fillText('IDLE',W-55,17);
      }

      /* divider lines */
      ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(0,emgH);ctx.lineTo(W,emgH);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,rectY0);ctx.lineTo(W,rectY0);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,specY0);ctx.lineTo(W,specY0);ctx.stroke();
      ctx.beginPath();ctx.moveTo(0,botY-3);ctx.lineTo(W,botY-3);ctx.stroke();

      requestAnimationFrame(frame);
    }

    /* click to switch muscle groups */
    cvs.addEventListener('click',function(e){
      var rect=cvs.getBoundingClientRect();
      var mx=(e.clientX-rect.left)*(W/rect.width);
      var my=(e.clientY-rect.top)*(H/rect.height);
      var armRegW=W*0.38;
      var botY=H*0.22+5+H*0.13+5+H*0.18+8;
      muscleGroups.forEach(function(mg2,idx){
        var ex=mg2.x*armRegW*2+10,ey=botY+(mg2.y-0.25)*300;
        var dist=Math.sqrt((mx-ex)*(mx-ex)+(my-ey)*(my-ey));
        if(dist<20)activeMuscle=idx;
      });
    });

    frame();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootMuscleViz);
  else setTimeout(bootMuscleViz,200);
})();
