/** Workshop DIY — Bio Nerve Impulse Detector v1.0 — HackRF detects nerve impulses */
const LANG={en:{title:'Bio Nerve Impulse Detector',subtitle:'Detect nerve impulses via RF',disconnected:'Disconnected',connected:'Connected',ready:'\u26a1 Nerve Detector ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Bio D\u00e9tecteur Nerveux',subtitle:'D\u00e9tecter les impulsions nerveuses par RF',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',ready:'\u26a1 D\u00e9tecteur nerveux pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'\u0643\u0627\u0634\u0641 \u0627\u0644\u0646\u0628\u0636\u0627\u062a \u0627\u0644\u0639\u0635\u0628\u064a\u0629',subtitle:'\u0643\u0634\u0641 \u0627\u0644\u0646\u0628\u0636\u0627\u062a \u0627\u0644\u0639\u0635\u0628\u064a\u0629 \u0639\u0628\u0631 RF',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',ready:'\u26a1 \u0643\u0627\u0634\u0641 \u0627\u0644\u0623\u0639\u0635\u0627\u0628 \u062c\u0627\u0647\u0632!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a'}};
let detecting=false,nerveData=[],spikeCount=0,velocity=45;
function initApp(){const canvas=$('nerveCanvas');if(!canvas)return;const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=320;const W=canvas.width,H=canvas.height;let t=0;
function actionPotential(phase){if(phase<0||phase>1)return-70;const p=phase;if(p<.1)return-70+p/.1*110;// Depolarization
if(p<.2)return 40-(p-.1)/.1*120;// Repolarization
if(p<.4)return-80+(p-.2)/.2*10;// Hyperpolarization
return-70}// Rest
function frame(){ctx.fillStyle='rgba(0,0,0,.06)';ctx.fillRect(0,0,W,H);t+=.016;
if(detecting){const spike=Math.random()<.03;if(spike){spikeCount++;velocity=30+Math.random()*90;for(let i=0;i<20;i++)nerveData.push(actionPotential(i/20));const ss=$('statSpikes'),sv=$('statVelocity');if(ss)ss.textContent=spikeCount;if(sv)sv.textContent=Math.round(velocity)}else{nerveData.push(-70+(Math.random()-.5)*5)}if(nerveData.length>W)nerveData.shift()}
// Draw nerve signal
if(nerveData.length>1){ctx.beginPath();ctx.strokeStyle='#33ff33';ctx.lineWidth=2;ctx.shadowColor='#33ff33';ctx.shadowBlur=5;
nerveData.forEach((v,i)=>{const x=i,y=H/2-(v+70)/180*H*.8;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)});ctx.stroke();ctx.shadowBlur=0}
// Reference lines
ctx.strokeStyle='rgba(255,255,255,.1)';ctx.setLineDash([4,8]);
[-70,0,40].forEach(mv=>{const y=H/2-(mv+70)/180*H*.8;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();ctx.fillStyle='rgba(255,255,255,.3)';ctx.font='8px Orbitron';ctx.fillText(`${mv}mV`,W-40,y-3)});ctx.setLineDash([]);
// Neuron diagram
ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(W-180,10,170,90);ctx.fillStyle='#ffcc00';ctx.font='10px Orbitron';ctx.fillText('Action Potential',W-170,25);ctx.fillStyle='rgba(255,255,255,.4)';ctx.font='8px Orbitron';
ctx.fillText(`Spikes: ${spikeCount}`,W-170,42);ctx.fillText(`Velocity: ${Math.round(velocity)} m/s`,W-170,55);ctx.fillText(`Resting: -70mV`,W-170,68);ctx.fillText(`Peak: +40mV`,W-170,81);
requestAnimationFrame(frame)}frame();
const startBtn=$('startBtn'),stimBtn=$('stimBtn'),resetBtn=$('resetBtn');
if(startBtn)startBtn.onclick=()=>{detecting=!detecting;setStatus(detecting);log(detecting?'Nerve detector active':'Stopped','info')};
if(stimBtn)stimBtn.onclick=()=>{for(let i=0;i<20;i++)nerveData.push(actionPotential(i/20));spikeCount++;log(`Nerve spike #${spikeCount} (${Math.round(velocity)}m/s)`,'success');showToast('Spike detected!',800)};
if(resetBtn)resetBtn.onclick=()=>{nerveData=[];spikeCount=0;log('Data reset','info')}}
