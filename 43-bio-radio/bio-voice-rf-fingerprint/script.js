/** Workshop DIY — Bio Voice RF Fingerprint v1.0 — Voice harmonics as RF authentication */
const LANG={en:{title:'Bio Voice RF Fingerprint',subtitle:'Voice harmonics as RF authentication',disconnected:'Disconnected',connected:'Connected',ready:'\ud83c\udfa4 Voice RF Fingerprint ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Bio Empreinte Vocale RF',subtitle:'Harmoniques vocales comme authentification RF',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',ready:'\ud83c\udfa4 Empreinte vocale pr\u00eate!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'\u0628\u0635\u0645\u0629 \u0627\u0644\u0635\u0648\u062a RF',subtitle:'\u062a\u0648\u0627\u0641\u0642\u064a\u0627\u062a \u0627\u0644\u0635\u0648\u062a \u0643\u0645\u0635\u0627\u062f\u0642\u0629 RF',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',ready:'\ud83c\udfa4 \u0628\u0635\u0645\u0629 \u0627\u0644\u0635\u0648\u062a \u062c\u0627\u0647\u0632\u0629!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a'}};
let analyzing=false,voiceProfiles=[],spectrumData=new Array(128).fill(0),fundamental=120;
function initApp(){const canvas=$('voiceCanvas');if(!canvas)return;const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=320;const W=canvas.width,H=canvas.height;let t=0,currentVoice='deep';
const voices={deep:{f0:95,formants:[700,1200,2500],color:'#ff6633'},mid:{f0:150,formants:[800,1400,2800],color:'#33ff33'},high:{f0:220,formants:[900,1600,3200],color:'#6699ff'}};
function frame(){ctx.fillStyle='rgba(0,0,0,.1)';ctx.fillRect(0,0,W,H);t+=.016;
if(analyzing){const v=voices[currentVoice];fundamental=v.f0+Math.sin(t*3)*10;
for(let i=0;i<128;i++){const freq=i*40;let amp=0;// Harmonics
for(let h=1;h<=8;h++){const hFreq=fundamental*h;const diff=Math.abs(freq-hFreq);amp+=Math.exp(-diff*diff/5000)/h}
// Formants
v.formants.forEach(f=>{const diff=Math.abs(freq-f);amp+=Math.exp(-diff*diff/30000)*2});
spectrumData[i]=spectrumData[i]*.8+amp*.2+(Math.random()-.5)*.01}}
// Draw spectrum
const barW=W/128;spectrumData.forEach((v,i)=>{const h=v*H*.7;const hue=i/128*240;ctx.fillStyle=`hsla(${hue},80%,50%,${.3+v*.5})`;ctx.fillRect(i*barW,H-h,barW-1,h)});
// Harmonic markers
if(analyzing){const v=voices[currentVoice];ctx.strokeStyle='rgba(255,255,255,.3)';ctx.setLineDash([2,4]);for(let h=1;h<=8;h++){const x=fundamental*h/40*barW;if(x<W){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='8px Orbitron';ctx.fillText(`H${h}`,x+2,15)}}ctx.setLineDash([]);
// Formant regions
v.formants.forEach((f,i)=>{const x=f/40*barW;ctx.fillStyle=v.color+'44';ctx.fillRect(x-15,0,30,H);ctx.fillStyle=v.color;ctx.font='10px Orbitron';ctx.fillText(`F${i+1}`,x-5,30)})}
// Voice fingerprint hash
ctx.fillStyle='rgba(0,0,0,.5)';ctx.fillRect(W-200,H-50,190,40);ctx.fillStyle='#ffcc00';ctx.font='9px Orbitron';const hash=spectrumData.slice(0,8).map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');ctx.fillText(`FP: ${hash}`,W-190,H-30);
const sf=$('statF0'),sm=$('statMatch');if(sf)sf.textContent=Math.round(fundamental);
requestAnimationFrame(frame)}frame();
const startBtn=$('startBtn'),deepBtn=$('deepBtn'),highBtn=$('highBtn'),authBtn=$('authBtn');
if(startBtn)startBtn.onclick=()=>{analyzing=!analyzing;setStatus(analyzing);log(analyzing?'Voice analysis started':'Stopped','info')};
if(deepBtn)deepBtn.onclick=()=>{currentVoice='deep';log('Voice: Deep (male ~95Hz)','info')};
if(highBtn)highBtn.onclick=()=>{currentVoice='high';log('Voice: High (female ~220Hz)','info')};
if(authBtn)authBtn.onclick=()=>{const hash=spectrumData.slice(0,16).map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');voiceProfiles.push(hash);const match=voiceProfiles.length>1&&voiceProfiles[voiceProfiles.length-1]===voiceProfiles[voiceProfiles.length-2];log(`Auth: Voice fingerprint ${hash.slice(0,20)}... ${match?'MATCH':'NEW PROFILE'}`,'success');showToast(match?'Voice matched!':'New voice registered',1500);const sm=$('statMatch');if(sm)sm.textContent=match?'MATCH':'NEW'}}
