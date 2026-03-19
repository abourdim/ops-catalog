/**
 * Evil Firmware Flasher — Workshop DIY v1.0
 * Firmware vulnerability analysis and modification simulator
 */
const $=id=>document.getElementById(id);const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="30" width="60" height="40" rx="5" fill="none" stroke="currentColor" stroke-width="2" opacity=".5"/><rect x="35" y="40" width="30" height="5" rx="2" fill="currentColor" opacity=".4"><animate attributeName="width" values="10;30;10" dur="1.5s" repeatCount="indefinite"/></rect><rect x="35" y="50" width="20" height="5" rx="2" fill="currentColor" opacity=".3"><animate attributeName="width" values="20;10;20" dur="2s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;
const LANG={en:{title:'Evil Firmware Flasher',subtitle:'👹 Evil Firmware Flasher — Firmware analysis sim',disconnected:'Offline',connected:'Flashing',ready:'👹 Firmware Flasher ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Failed',splashHint:'tap to skip',langChanged:'🌐 English',themeChanged:'🎨 →',simStarted:'👹 Flash started',simStopped:'⏹ Aborted',simReset:'↺ Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},fr:{title:'Flasheur Firmware Malveillant',subtitle:'👹 Flasheur Firmware — Simulation d\'analyse',disconnected:'Hors ligne',connected:'Flash',ready:'👹 Flasheur prêt!',logCleared:'Effacé',copied:'Copié!',copyFail:'Échec',splashHint:'appuyer',langChanged:'🌐 Français',themeChanged:'🎨 →',simStarted:'👹 Flash démarré',simStopped:'⏹ Abandonné',simReset:'↺ Réinit.',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},ar:{title:'برنامج تحميل البرامج الثابتة الخبيثة',subtitle:'👹 محلل البرامج الثابتة — محاكاة تحليل',disconnected:'غير متصل',connected:'يومض',ready:'👹 المحلل جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',splashHint:'انقر',langChanged:'🌐 العربية',themeChanged:'🎨 ←',simStarted:'👹 بدأ التحميل',simStopped:'⏹ تم الإلغاء',simReset:'↺ إعادة',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'}};
let currentLang='en';function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}function clearLog(){if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}async function copyLog(){try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}function exportLog(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')]));a.download='firmware-log.txt';a.click();}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;Array.from(logContainer.children).forEach(l=>{l.style.display=(f==='all'||l.classList.contains(f))?'':'none';});}));}function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}function openLog(){$('logPanel')?.classList.add('open');}function closeLog(){$('logPanel')?.classList.remove('open');}function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

let running=false,animFrame=null,time=0,progress=0;
const hexData=[];for(let i=0;i<256;i++)hexData.push(Math.floor(Math.random()*256));

function drawSim(){
  if(!running)return;time+=0.02;
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d'),w=c.width,h=c.height;
  const device=$('deviceSelect').value,payload=$('payloadSelect').value;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,w,h);
  // Progress
  progress=Math.min(100,progress+0.3);$('progressSlider').value=progress;$('progressVal').textContent=Math.floor(progress)+'%';
  // Hex dump visualization
  ctx.font='10px monospace';const cols=32,rows=Math.floor(h/14);
  for(let r=0;r<rows;r++){
    const addr=(Math.floor(time*50)+r*cols)&0xFFFF;
    ctx.fillStyle='rgba(100,200,255,0.3)';ctx.fillText(addr.toString(16).padStart(4,'0')+':',5,14+r*14);
    for(let col=0;col<cols&&col<24;col++){
      const idx=(r*cols+col+Math.floor(time*20))%256;
      const val=hexData[idx];
      const isPayload=progress>0&&r*cols+col<progress*2.56;
      const isMod=isPayload&&col%8<2;
      if(isMod){ctx.fillStyle='rgba(255,50,50,0.8)';hexData[idx]=(hexData[idx]+1)&0xFF;}
      else if(isPayload)ctx.fillStyle='rgba(255,200,50,0.5)';
      else ctx.fillStyle='rgba(100,200,255,0.2)';
      ctx.fillText(val.toString(16).padStart(2,'0'),50+col*22,14+r*14);
    }
  }
  // Flash progress bar
  const barY=h-30,barH=15;
  ctx.fillStyle='rgba(50,50,50,0.5)';ctx.fillRect(10,barY,w-20,barH);
  const barColor=progress<50?'rgba(100,200,255,0.6)':progress<90?'rgba(255,200,50,0.6)':'rgba(255,50,50,0.6)';
  ctx.fillStyle=barColor;ctx.fillRect(10,barY,(w-20)*progress/100,barH);
  ctx.fillStyle='#fff';ctx.font='10px Orbitron';ctx.fillText('FLASHING: '+Math.floor(progress)+'%',w/2-40,barY+12);
  // Device chip visualization (right)
  const chipX=w-120,chipY=h/2-50;
  ctx.strokeStyle='rgba(100,200,255,0.3)';ctx.lineWidth=2;ctx.strokeRect(chipX,chipY,100,100);
  // Chip pins
  for(let i=0;i<8;i++){ctx.fillStyle=`rgba(200,200,200,${0.3+0.2*Math.sin(time*5+i)})`;ctx.fillRect(chipX-10,chipY+10+i*11,10,5);ctx.fillRect(chipX+100,chipY+10+i*11,10,5);}
  ctx.fillStyle=accent;ctx.font='9px Orbitron';ctx.fillText(device.toUpperCase(),chipX+10,chipY+55);
  // Activity LEDs
  ctx.fillStyle=`rgba(255,50,50,${0.3+0.5*Math.abs(Math.sin(time*10))})`;ctx.beginPath();ctx.arc(chipX+85,chipY+15,4,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=`rgba(50,255,50,${0.3+0.5*Math.abs(Math.sin(time*8+1))})`;ctx.beginPath();ctx.arc(chipX+85,chipY+30,4,0,Math.PI*2);ctx.fill();

  if(progress>=100){log('Flash complete — '+payload+' injected into '+device,'success');progress=0;stopSim();}

  const fwSize={router:4096,iot:1024,usb:512,bios:16384}[device];
  $('sizeVal').textContent=fwSize+' KB';$('checksumVal').textContent='0x'+hexData.slice(0,4).map(v=>v.toString(16).padStart(2,'0')).join('');
  $('vulnVal').textContent=Math.floor(progress/25)+' found';$('modVal').textContent=Math.floor(progress)+'% patched';
  ctx.fillStyle=accent;ctx.font='10px Orbitron,monospace';ctx.fillText('FIRMWARE FLASHER — '+device.toUpperCase()+' ['+payload+']',8,h-8);
  animFrame=requestAnimationFrame(drawSim);
}
function startSim(){if(running)return;running=true;progress=0;setStatus(true);log(LANG[currentLang].simStarted,'success');log('Target: '+$('deviceSelect').value+' | Payload: '+$('payloadSelect').value,'info');drawSim();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].simStopped,'info');}
function resetSim(){stopSim();progress=0;$('progressSlider').value=0;$('progressVal').textContent='0%';$('deviceSelect').value='router';$('payloadSelect').value='backdoor';$('simCanvas')?.getContext('2d').clearRect(0,0,800,350);$('sizeVal').textContent='-- KB';$('checksumVal').textContent='--';$('vulnVal').textContent='--';$('modVal').textContent='--';log(LANG[currentLang].simReset,'info');}
function init(){initSplash();$('logoWrap').innerHTML=LOGO_SVG;$('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();$('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();$('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;$('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;};}document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});$('langSelect').onchange=function(){setLanguage(this.value);};$('themeSelect').onchange=function(){setTheme(this.value);};try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}initHijriDate();$('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;log(LANG[currentLang].ready,'success');}
document.addEventListener('DOMContentLoaded',init);
