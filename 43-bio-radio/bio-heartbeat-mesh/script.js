/** Workshop DIY — Bio Heartbeat Mesh v1.0 — Heartbeat-synchronized mesh network */
const LANG={en:{title:'Bio Heartbeat Mesh',subtitle:'Heartbeat-synchronized mesh network',disconnected:'Disconnected',connected:'Connected',ready:'\u2764 Heartbeat Mesh ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',langChanged:'\ud83c\udf10 EN',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Bio R\u00e9seau Cardiaque',subtitle:'R\u00e9seau maill\u00e9 synchronis\u00e9 au coeur',disconnected:'D\u00e9connect\u00e9',connected:'Connect\u00e9',ready:'\u2764 R\u00e9seau cardiaque pr\u00eat!',logCleared:'Effac\u00e9',copied:'Copi\u00e9!',copyFail:'\u00c9chec',langChanged:'\ud83c\udf10 FR',themeChanged:'\ud83c\udfa8 \u2192',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'\u0634\u0628\u0643\u0629 \u0646\u0628\u0636 \u0627\u0644\u0642\u0644\u0628',subtitle:'\u0634\u0628\u0643\u0629 \u0645\u062a\u0632\u0627\u0645\u0646\u0629 \u0645\u0639 \u0646\u0628\u0636 \u0627\u0644\u0642\u0644\u0628',disconnected:'\u063a\u064a\u0631 \u0645\u062a\u0635\u0644',connected:'\u0645\u062a\u0635\u0644',ready:'\u2764 \u0634\u0628\u0643\u0629 \u0627\u0644\u0646\u0628\u0636 \u062c\u0627\u0647\u0632\u0629!',logCleared:'\u0645\u0633\u062d',copied:'\u062a\u0645!',copyFail:'\u0641\u0634\u0644',langChanged:'\ud83c\udf10 \u0639\u0631\u0628\u064a',themeChanged:'\ud83c\udfa8 \u2190',t_mosque:'\u0645\u0633\u062c\u062f',t_zellige:'\u0632\u0644\u064a\u062c',t_andalus:'\u0623\u0646\u062f\u0644\u0633',t_riad:'\u0631\u064a\u0627\u0636',t_medina:'\u0645\u062f\u064a\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062f\u063a\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062a'}};
let running=false,nodes=[],links=[];
function initApp(){const canvas=$('meshCanvas');if(!canvas)return;const ctx=canvas.getContext('2d');canvas.width=canvas.offsetWidth||760;canvas.height=320;const W=canvas.width,H=canvas.height;let t=0;
function addNode(){const n={x:60+Math.random()*(W-120),y:60+Math.random()*(H-120),bpm:60+Math.random()*30,phase:Math.random()*Math.PI*2,r:15,name:`Node${nodes.length+1}`};nodes.push(n);// Auto-link nearby
nodes.forEach((o,i)=>{if(o===n)return;const d=Math.hypot(o.x-n.x,o.y-n.y);if(d<200)links.push({a:nodes.length-1,b:i})});log(`${n.name} joined (${Math.round(n.bpm)} BPM)`,'success')}
function frame(){ctx.fillStyle='rgba(0,0,0,.1)';ctx.fillRect(0,0,W,H);t+=.016;
// Draw links with heartbeat pulse
links.forEach(l=>{const a=nodes[l.a],b=nodes[l.b];if(!a||!b)return;const pulse=Math.sin(a.phase)*0.5+0.5;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(255,51,102,${.15+pulse*.3})`;ctx.lineWidth=1+pulse*2;ctx.stroke();
// Sync packet
if(Math.sin(a.phase)>.95){const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;ctx.beginPath();ctx.arc(mx,my,4,0,Math.PI*2);ctx.fillStyle='#ff3366';ctx.fill()}});
// Draw nodes
nodes.forEach(n=>{n.phase+=.016*n.bpm/60*Math.PI*2;const beat=Math.sin(n.phase);const glow=Math.max(0,beat);
ctx.beginPath();ctx.arc(n.x,n.y,n.r+glow*8,0,Math.PI*2);ctx.fillStyle=`rgba(255,51,102,${.1+glow*.3})`;ctx.fill();
ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,51,102,${.5+glow*.5})`;ctx.fill();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1;ctx.stroke();
ctx.fillStyle='#fff';ctx.font='8px Orbitron';ctx.textAlign='center';ctx.fillText(n.name,n.x,n.y-n.r-5);ctx.fillText(`${Math.round(n.bpm)}`,n.x,n.y+4);ctx.textAlign='left';
// Gradually sync BPM to neighbors
links.forEach(l=>{let other=null;if(nodes[l.a]===n)other=nodes[l.b];if(nodes[l.b]===n)other=nodes[l.a];if(other)n.bpm+=(other.bpm-n.bpm)*.0005})});
// Stats
const sn=$('statNodes'),sl=$('statLinks'),ss=$('statSync');
if(sn)sn.textContent=nodes.length;if(sl)sl.textContent=links.length;
if(nodes.length>1){const bpms=nodes.map(n=>n.bpm);const avg=bpms.reduce((a,b)=>a+b)/bpms.length;const sync=100-bpms.reduce((a,b)=>a+Math.abs(b-avg),0)/nodes.length;if(ss)ss.textContent=Math.round(Math.max(0,sync))+'%'}
requestAnimationFrame(frame)}frame();
const startBtn=$('startBtn'),addBtn=$('addBtn'),syncBtn=$('syncBtn');
if(startBtn)startBtn.onclick=()=>{running=!running;setStatus(running);if(running&&nodes.length===0){for(let i=0;i<3;i++)addNode()}log(running?'Mesh started':'Stopped','info')};
if(addBtn)addBtn.onclick=addNode;
if(syncBtn)syncBtn.onclick=()=>{const target=nodes[0]?.bpm||72;nodes.forEach(n=>n.bpm=target+Math.random()*2-1);log('Force sync to '+Math.round(target)+' BPM','success');showToast('Synchronized!',1200)}}
