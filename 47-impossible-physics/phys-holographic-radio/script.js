/**
 * Holographic Radio — Workshop DIY v1.0
 * Holographic principle applied to RF encoding on boundary surfaces
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="1" opacity=".3"/><circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" stroke-width="1" opacity=".5"><animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={
  en:{title:'Holographic Radio',subtitle:'🌐 Holographic Radio — Boundary-encoded RF',disconnected:'Offline',connected:'Encoding',mainSection:'Holographic Radio',mainDesc:'Encode 3D RF information on 2D boundary surfaces',ready:'🌐 Holographic Radio ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 Theme →',simStarted:'🌐 Encoding active',simStopped:'⏹ Stopped',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
  fr:{title:'Radio Holographique',subtitle:'🌐 Radio Holographique — RF encodé en frontière',disconnected:'Hors ligne',connected:'Encodage',mainSection:'Radio Holographique',mainDesc:'Encoder l\'information RF 3D sur des surfaces 2D',ready:'🌐 Radio Holographique prête!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 Thème →',simStarted:'🌐 Encodage actif',simStopped:'⏹ Arrêté',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
  ar:{title:'الراديو الهولوغرافي',subtitle:'🌐 الراديو الهولوغرافي — RF مشفر على الحدود',disconnected:'غير متصل',connected:'تشفير',mainSection:'الراديو الهولوغرافي',mainDesc:'تشفير معلومات RF ثلاثية الأبعاد على أسطح حدودية ثنائية',ready:'🌐 الراديو الهولوغرافي جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر للتخطي',langChanged:'🌐 العربية',themeChanged:'🎨 المظهر ←',simStarted:'🌐 التشفير نشط',simStopped:'⏹ توقف',simReset:'↺ إعادة ضبط',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}
function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='holographic-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}
function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}
function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

/* ═══════ HOLOGRAPHIC SIM ═══════ */
let running=false,animFrame=null,time=0;
function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const mode=$('modeSelect').value,res=+$('resSlider').value,dens=+$('densSlider').value/100;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,radius=130;

  if(mode==='boundary'||mode==='bulk'){
    // Boundary circle
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,radius,0,Math.PI*2);ctx.stroke();
    // Boundary encoding cells
    for(let i=0;i<res;i++){
      const a=(i/res)*Math.PI*2+time*0.5;
      const bx=cx+Math.cos(a)*radius,by=cy+Math.sin(a)*radius;
      const val=Math.sin(a*3+time*2)*dens;
      ctx.fillStyle=`hsla(${200+val*60},70%,60%,${0.3+Math.abs(val)*0.5})`;
      ctx.beginPath();ctx.arc(bx,by,6,0,Math.PI*2);ctx.fill();
      // Radial connections to bulk
      if(mode==='bulk'){
        const depth=Math.abs(val)*radius*0.8;
        const ix=cx+Math.cos(a)*depth,iy=cy+Math.sin(a)*depth;
        ctx.strokeStyle=`rgba(100,200,255,${Math.abs(val)*0.2})`;ctx.lineWidth=0.5;
        ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(ix,iy);ctx.stroke();
        ctx.fillStyle=`rgba(255,200,100,${Math.abs(val)*0.4})`;ctx.beginPath();ctx.arc(ix,iy,3,0,Math.PI*2);ctx.fill();
      }
    }
    // Interior reconstruction
    if(mode==='bulk'){
      for(let gx=-radius;gx<radius;gx+=15){for(let gy=-radius;gy<radius;gy+=15){
        if(gx*gx+gy*gy>radius*radius)continue;
        const val=Math.sin(gx*0.03+time)*Math.cos(gy*0.03+time*1.3)*dens;
        ctx.fillStyle=`rgba(100,150,255,${Math.abs(val)*0.15})`;ctx.fillRect(cx+gx-3,cy+gy-3,6,6);
      }}
    }
  } else if(mode==='entangle'){
    // Entanglement web
    const nodes=[];for(let i=0;i<res;i++){
      const a=(i/res)*Math.PI*2;nodes.push({x:cx+Math.cos(a)*radius,y:cy+Math.sin(a)*radius});
      nodes.push({x:cx+Math.cos(a+0.1)*radius*0.5,y:cy+Math.sin(a+0.1)*radius*0.5});
    }
    nodes.forEach((n,i)=>{
      for(let j=i+1;j<nodes.length;j++){
        const dist=Math.hypot(n.x-nodes[j].x,n.y-nodes[j].y);
        if(dist<150){
          const ent=Math.sin(time*2+i+j)*dens;
          ctx.strokeStyle=`rgba(150,100,255,${Math.abs(ent)*0.15})`;ctx.lineWidth=0.5;
          ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(nodes[j].x,nodes[j].y);ctx.stroke();
        }
      }
      ctx.fillStyle=accent;ctx.beginPath();ctx.arc(n.x,n.y,3,0,Math.PI*2);ctx.fill();
    });
  } else {
    // AdS/CFT - hyperbolic tiling
    for(let r=0;r<5;r++){
      const layerR=radius*(1-r*0.18);const nPts=res*(r+1)/2;
      ctx.strokeStyle=`rgba(100,200,255,${0.1+r*0.05})`;ctx.lineWidth=0.5;ctx.beginPath();ctx.arc(cx,cy,layerR,0,Math.PI*2);ctx.stroke();
      for(let i=0;i<nPts;i++){
        const a=(i/nPts)*Math.PI*2+time*(r+1)*0.1;
        const px=cx+Math.cos(a)*layerR,py=cy+Math.sin(a)*layerR;
        const val=Math.sin(a*5+time*3)*dens;
        ctx.fillStyle=`hsla(${220+r*30},60%,${50+val*20}%,${0.3+Math.abs(val)*0.4})`;
        ctx.beginPath();ctx.arc(px,py,3-r*0.3,0,Math.PI*2);ctx.fill();
      }
    }
  }

  const bitsB=(res*8*dens).toFixed(0),bitsV=(res*res*dens).toFixed(0);
  $('entropyVal').textContent=bitsB+' bits';$('bulkVal').textContent=bitsV+' bits';
  $('bekVal').textContent=(bitsB/(4*Math.PI*0.01)).toExponential(1)+' bits/m²';
  $('fidelVal').textContent=(85+dens*15).toFixed(1)+'%';

  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('HOLOGRAPHIC RADIO — '+mode.toUpperCase(),8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].simStarted,'success');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();$('resSlider').value=24;$('resVal').textContent='24';$('densSlider').value=50;$('densVal').textContent='50%';$('modeSelect').value='boundary';
  $('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('entropyVal').textContent='-- bits';$('bulkVal').textContent='-- bits';$('bekVal').textContent='-- bits/m²';$('fidelVal').textContent='--%';log(LANG[currentLang].simReset,'info');}
function init(){
  initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});
  $('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;
  $('resSlider').oninput=function(){$('resVal').textContent=this.value;};
  $('densSlider').oninput=function(){$('densVal').textContent=this.value+'%';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);
