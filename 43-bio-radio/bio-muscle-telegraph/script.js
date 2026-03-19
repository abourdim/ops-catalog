/**
 * Workshop DIY — Bio Muscle Telegraph v1.0
 * EMG to Morse code transmission
 */
const LANG={
  en:{title:'Bio Muscle Telegraph',subtitle:'Muscles tap Morse code',disconnected:'Disconnected',connected:'Connected',mainSection:'Muscle Telegraph \u2014 EMG to Morse',mainDesc:'Muscle contractions converted to Morse code',ready:'\ud83d\udcaa Muscle Telegraph ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Bio T\u00e9l\u00e9graphe Musculaire',subtitle:'Les muscles tapent du Morse',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',mainSection:'T\u00e9l\u00e9graphe Musculaire \u2014 EMG en Morse',mainDesc:'Contractions musculaires converties en code Morse',ready:'\ud83d\udcaa T\u00e9l\u00e9graphe pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'\u062a\u0644\u063a\u0631\u0627\u0641 \u0627\u0644\u0639\u0636\u0644\u0627\u062a',subtitle:'\u0627\u0644\u0639\u0636\u0644\u0627\u062a \u062a\u0646\u0642\u0631 \u0634\u0641\u0631\u0629 \u0645\u0648\u0631\u0633',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',mainSection:'\u062a\u0644\u063a\u0631\u0627\u0641 \u0627\u0644\u0639\u0636\u0644\u0627\u062a \u2014 EMG \u0625\u0644\u0649 \u0645\u0648\u0631\u0633',mainDesc:'\u0627\u0646\u0642\u0628\u0627\u0636\u0627\u062a \u0639\u0636\u0644\u064a\u0629 \u062a\u062a\u062d\u0648\u0644 \u0644\u0634\u0641\u0631\u0629 \u0645\u0648\u0631\u0633',ready:'\ud83d\udcaa \u062a\u0644\u063a\u0631\u0627\u0641 \u0627\u0644\u0639\u0636\u0644\u0627\u062a \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a'}
};

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
