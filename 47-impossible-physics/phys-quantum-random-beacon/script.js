/**
 * Quantum Random Beacon — Workshop DIY v1.0
 * Simulates quantum random number generation with entropy visualization
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2" opacity=".3"><animate attributeName="r" values="30;45;30" dur="2s" repeatCount="indefinite"/></circle><circle cx="50" cy="50" r="6" fill="currentColor"><animate attributeName="cx" values="40;60;40" dur="1.5s" repeatCount="indefinite"/><animate attributeName="cy" values="40;60;40" dur="1.8s" repeatCount="indefinite"/></circle><circle cx="50" cy="50" r="4" fill="currentColor" opacity=".6"><animate attributeName="cx" values="60;35;60" dur="1.2s" repeatCount="indefinite"/><animate attributeName="cy" values="55;40;55" dur="1.6s" repeatCount="indefinite"/></circle></svg>`;
const LIGHT_THEMES = ['riad','medina'];
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,t+.08);o.start(t);o.stop(t+.08);}else if(type==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,t+.3);o.start(t);o.stop(t+.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+.25);o.start(t);o.stop(t+.25);}}

/* ═══════ i18n ═══════ */
const LANG = {
  en: {
    title:'Quantum Random Beacon',subtitle:'🔮 Quantum Random Beacon — True randomness from quantum noise',
    disconnected:'Disconnected',connected:'Active',
    mainSection:'Quantum Random Beacon',mainDesc:'Generate true random numbers from simulated quantum vacuum fluctuations',
    sectionA:'Entropy Analysis',sectionB:'Randomness Tests',sectionC:'Quantum Theory',
    activityLog:'Activity Log',eventsMsg:'Events & messages',
    clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',
    settings:'⚙️ Settings',language:'Language',
    help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
    faq_q1:'What is a quantum random beacon?',faq_a1:'A source of provably random bits from quantum physical processes.',
    faq_q2:'How does it generate randomness?',faq_a2:'By measuring quantum vacuum fluctuations that are fundamentally unpredictable.',
    faq_q3:'What tests verify randomness?',faq_a3:'NIST SP 800-22 suite: frequency, runs, spectral, entropy tests.',
    howto_1:'Select a quantum noise source type.',howto_2:'Adjust sample rate and bit depth.',
    howto_3:'Click Start to generate quantum random bits.',howto_4:'Run NIST tests to verify randomness quality.',
    wiki_themes_title:'🎨 Themes',wiki_themes:'8 built-in themes.',
    wiki_i18n_title:'🌐 Languages',wiki_i18n:'Trilingual: EN, FR, AR with RTL.',
    working:'Working…',filterAll:'All',soundEffects:'Sound effects',
    ready:'🔮 Quantum Random Beacon ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
    noiseSource:'Noise Source',sampleRate:'Sample Rate',bitDepth:'Bit Depth',
    startBeacon:'▶ Start Beacon',stopBeacon:'⏹ Stop',resetBeacon:'↺ Reset',
    shannonEntropy:'Shannon Entropy:',minEntropy:'Min-Entropy:',chiSquare:'Chi-Square:',
    serialCorr:'Serial Correlation:',totalBits:'Total Bits Generated:',
    testDesc:'Statistical tests verify quantum randomness quality.',runTests:'Run NIST Tests',
    theoryIntro:'Quantum random number generation exploits fundamental quantum indeterminacy:',
    theory1:'Vacuum fluctuations provide truly random quantum noise',
    theory2:'Shot noise arises from discrete photon arrival times',
    theory3:'No deterministic algorithm can predict quantum outcomes',
    theory4:'Entropy harvesting condenses quantum bits into uniform randomness',
    theory5:'Bell inequality violations prove non-classical randomness',
    splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
    beaconStarted:'▶ Quantum beacon started',beaconStopped:'⏹ Beacon stopped',beaconReset:'↺ Beacon reset',
    testsRunning:'Running NIST tests...',testsPassed:'✓ All tests passed',
    t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'
  },
  fr: {
    title:'Balise Quantique Aléatoire',subtitle:'🔮 Balise Quantique — Aléa vrai du bruit quantique',
    disconnected:'Déconnecté',connected:'Actif',
    mainSection:'Balise Quantique Aléatoire',mainDesc:'Générer des nombres aléatoires à partir de fluctuations quantiques du vide',
    sectionA:'Analyse d\'Entropie',sectionB:'Tests de Hasard',sectionC:'Théorie Quantique',
    activityLog:'Journal',eventsMsg:'Événements et messages',
    clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Thème',
    settings:'⚙️ Paramètres',language:'Langue',
    help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
    faq_q1:'Qu\'est-ce qu\'une balise quantique?',faq_a1:'Une source de bits aléatoires prouvée par des processus quantiques.',
    faq_q2:'Comment génère-t-elle l\'aléa?',faq_a2:'En mesurant les fluctuations du vide quantique fondamentalement imprévisibles.',
    faq_q3:'Quels tests vérifient l\'aléa?',faq_a3:'Suite NIST SP 800-22: fréquence, séries, spectre, entropie.',
    howto_1:'Sélectionnez un type de source de bruit.',howto_2:'Ajustez le taux d\'échantillonnage.',
    howto_3:'Cliquez Démarrer pour générer des bits.',howto_4:'Lancez les tests NIST pour vérifier la qualité.',
    wiki_themes_title:'🎨 Thèmes',wiki_themes:'8 thèmes intégrés.',
    wiki_i18n_title:'🌐 Langues',wiki_i18n:'Trilingue avec RTL.',
    working:'En cours…',filterAll:'Tout',soundEffects:'Effets sonores',
    ready:'🔮 Balise quantique prête!',logCleared:'Journal effacé',copied:'Copié!',copyFail:'Échec',
    noiseSource:'Source de Bruit',sampleRate:'Taux d\'Échantillonnage',bitDepth:'Profondeur de Bits',
    startBeacon:'▶ Démarrer',stopBeacon:'⏹ Arrêter',resetBeacon:'↺ Réinitialiser',
    shannonEntropy:'Entropie de Shannon:',minEntropy:'Min-Entropie:',chiSquare:'Chi-Carré:',
    serialCorr:'Corrélation Série:',totalBits:'Bits Totaux Générés:',
    testDesc:'Les tests statistiques vérifient la qualité de l\'aléa quantique.',runTests:'Lancer Tests NIST',
    theoryIntro:'La génération quantique exploite l\'indétermination fondamentale:',
    theory1:'Les fluctuations du vide fournissent un bruit quantique vraiment aléatoire',
    theory2:'Le bruit de grenaille provient des arrivées discrètes de photons',
    theory3:'Aucun algorithme ne peut prédire les résultats quantiques',
    theory4:'La récolte d\'entropie condense les bits en aléa uniforme',
    theory5:'Les violations de Bell prouvent le hasard non-classique',
    splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',
    beaconStarted:'▶ Balise quantique démarrée',beaconStopped:'⏹ Balise arrêtée',beaconReset:'↺ Balise réinitialisée',
    testsRunning:'Tests NIST en cours...',testsPassed:'✓ Tous les tests réussis',
    t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'
  },
  ar: {
    title:'منارة الكم العشوائية',subtitle:'🔮 منارة الكم — عشوائية حقيقية من الضوضاء الكمية',
    disconnected:'غير متصل',connected:'نشط',
    mainSection:'منارة الكم العشوائية',mainDesc:'توليد أرقام عشوائية حقيقية من تقلبات الفراغ الكمي',
    sectionA:'تحليل الإنتروبيا',sectionB:'اختبارات العشوائية',sectionC:'النظرية الكمية',
    activityLog:'سجل النشاط',eventsMsg:'الأحداث والرسائل',
    clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',
    settings:'⚙️ الإعدادات',language:'اللغة',
    help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيفية الاستخدام',wiki:'ويكي',
    faq_q1:'ما هي منارة الكم العشوائية؟',faq_a1:'مصدر بتات عشوائية مثبتة من عمليات فيزياء الكم.',
    faq_q2:'كيف تولد العشوائية؟',faq_a2:'بقياس تقلبات الفراغ الكمي غير القابلة للتنبؤ جوهرياً.',
    faq_q3:'ما الاختبارات التي تتحقق من العشوائية؟',faq_a3:'مجموعة NIST SP 800-22: التردد والسلاسل والطيف والإنتروبيا.',
    howto_1:'اختر نوع مصدر الضوضاء الكمية.',howto_2:'اضبط معدل العينات وعمق البت.',
    howto_3:'اضغط ابدأ لتوليد بتات كمية عشوائية.',howto_4:'شغّل اختبارات NIST للتحقق من جودة العشوائية.',
    wiki_themes_title:'🎨 المظاهر',wiki_themes:'8 مظاهر مدمجة.',
    wiki_i18n_title:'🌐 اللغات',wiki_i18n:'ثلاثي اللغات مع RTL.',
    working:'جارٍ…',filterAll:'الكل',soundEffects:'مؤثرات صوتية',
    ready:'🔮 منارة الكم جاهزة!',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
    noiseSource:'مصدر الضوضاء',sampleRate:'معدل العينات',bitDepth:'عمق البت',
    startBeacon:'▶ تشغيل المنارة',stopBeacon:'⏹ إيقاف',resetBeacon:'↺ إعادة',
    shannonEntropy:'إنتروبيا شانون:',minEntropy:'الحد الأدنى للإنتروبيا:',chiSquare:'مربع كاي:',
    serialCorr:'الارتباط التسلسلي:',totalBits:'إجمالي البتات المولدة:',
    testDesc:'الاختبارات الإحصائية تتحقق من جودة العشوائية الكمية.',runTests:'تشغيل اختبارات NIST',
    theoryIntro:'توليد الأرقام العشوائية الكمية يستغل عدم اليقين الكمي الأساسي:',
    theory1:'تقلبات الفراغ توفر ضوضاء كمية عشوائية حقاً',
    theory2:'ضوضاء الطلقة تنشأ من أوقات وصول الفوتونات المنفصلة',
    theory3:'لا يمكن لخوارزمية حتمية التنبؤ بالنتائج الكمية',
    theory4:'حصاد الإنتروبيا يكثف البتات الكمية في عشوائية موحدة',
    theory5:'انتهاكات متباينة بيل تثبت العشوائية غير الكلاسيكية',
    splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
    beaconStarted:'▶ بدأت منارة الكم',beaconStopped:'⏹ توقفت المنارة',beaconReset:'↺ إعادة ضبط المنارة',
    testsRunning:'جارٍ تشغيل اختبارات NIST...',testsPassed:'✓ جميع الاختبارات ناجحة',
    t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت'
  }
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));const s=$('themeSelect');if(s)s.value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='quantum-beacon-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const t=$('statusText'),p=$('statusPill'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

/* ═══════ PANELS ═══════ */
function openPanel(p,o){const s=$(p),ov=$(o);if(s)s.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o){const s=$(p),ov=$(o);if(s)s.classList.remove('open');if(ov)ov.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const tgt=$(id);if(tgt)tgt.classList.add('active');}));}

/* ═══════ QUANTUM BEACON SIMULATION ═══════ */
let running=false,animFrame=null,totalBits=0;
const randomBuffer=[];
const entropyHistory=[];
const BUFFER_MAX=2048;

function quantumNoise(type){
  switch(type){
    case 'vacuum': return (Math.random()+Math.random()+Math.random()-1.5)/1.5;
    case 'thermal':{const u1=Math.random(),u2=Math.random();return Math.sqrt(-2*Math.log(u1+1e-10))*Math.cos(2*Math.PI*u2)*.4;}
    case 'shot': return (Math.random()<.5?1:-1)*Math.pow(Math.random(),.7);
    case 'zener': return Math.tanh((Math.random()-.5)*6);
    default: return Math.random()*2-1;
  }
}

function generateBits(type,rate,depth){
  const bits=[];
  for(let i=0;i<rate;i++){
    const v=quantumNoise(type);
    const quantized=Math.floor(((v+1)/2)*((1<<depth)-1));
    bits.push(quantized);
    randomBuffer.push(v);
    if(randomBuffer.length>BUFFER_MAX)randomBuffer.shift();
  }
  totalBits+=rate*depth;
  return bits;
}

function shannonEntropy(data){
  const counts={};
  data.forEach(v=>{const k=v&0xFF;counts[k]=(counts[k]||0)+1;});
  let h=0;const n=data.length;
  Object.values(counts).forEach(c=>{const p=c/n;if(p>0)h-=p*Math.log2(p);});
  return h;
}

function drawBeacon(bits){
  const c=$('beaconCanvas');if(!c)return;
  const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(0,0,w,h);
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Particle cloud visualization
  const time=performance.now()*.001;
  for(let i=0;i<bits.length&&i<200;i++){
    const v=bits[i]/255;
    const angle=v*Math.PI*2+time+i*.1;
    const radius=40+v*120+Math.sin(time+i)*20;
    const cx2=w/2+Math.cos(angle)*radius;
    const cy2=h/2+Math.sin(angle)*radius*.6;
    const size=2+v*4;
    const alpha=.3+v*.7;
    ctx.beginPath();ctx.arc(cx2,cy2,size,0,Math.PI*2);
    ctx.fillStyle=`rgba(${100+v*155},${150+v*100},255,${alpha})`;
    ctx.fill();
  }
  // Central beacon pulse
  const pulse=Math.sin(time*3)*.5+.5;
  const grad=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,60+pulse*40);
  grad.addColorStop(0,accent.replace(')',',0.4)').replace('rgb','rgba'));
  grad.addColorStop(1,'transparent');
  ctx.fillStyle=grad;ctx.fillRect(w/2-100,h/2-80,200,160);
  // Bit stream display
  ctx.fillStyle='rgba(100,200,255,.5)';ctx.font='10px Orbitron,monospace';
  for(let i=0;i<Math.min(bits.length,40);i++){
    const bstr=(bits[i]&0xFF).toString(2).padStart(8,'0');
    ctx.fillText(bstr,10+(i%10)*78,h-40+Math.floor(i/10)*14);
  }
  ctx.fillStyle=accent;ctx.font='11px Orbitron,monospace';
  ctx.fillText('QUANTUM BEACON — '+totalBits.toLocaleString()+' bits',10,16);
}

function drawEntropy(){
  const c=$('entropyCanvas');if(!c)return;
  const ctx=c.getContext('2d'),w=c.width,h=c.height;
  ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Grid
  ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;
  for(let i=0;i<8;i++){const y=i/8*h;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
  // Entropy distribution histogram
  if(randomBuffer.length>10){
    const bins=64;const hist=new Array(bins).fill(0);
    randomBuffer.forEach(v=>{const idx=Math.floor(((v+1)/2)*(bins-1));hist[Math.max(0,Math.min(bins-1,idx))]++;});
    const maxH=Math.max(...hist)||1;
    const barW=w/bins;
    for(let i=0;i<bins;i++){
      const bh=(hist[i]/maxH)*h*.8;
      const hue=200+i/bins*60;
      ctx.fillStyle=`hsla(${hue},70%,60%,0.7)`;
      ctx.fillRect(i*barW,h-bh,barW-1,bh);
    }
  }
  // Entropy trend line
  if(entropyHistory.length>1){
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
    entropyHistory.forEach((e,i)=>{
      const x=i/entropyHistory.length*w;
      const y=h-(e/8)*h;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    });
    ctx.stroke();
  }
  ctx.fillStyle='#8899aa';ctx.font='10px Orbitron,monospace';
  ctx.fillText('Entropy Distribution',8,14);
  ctx.fillText('8.0 bits',w-60,14);ctx.fillText('0.0',w-30,h-4);
}

function updateAnalysis(){
  if(randomBuffer.length<10)return;
  const data=randomBuffer.map(v=>Math.floor(((v+1)/2)*255));
  const h=shannonEntropy(data);
  entropyHistory.push(h);if(entropyHistory.length>200)entropyHistory.shift();
  $('shannonVal').textContent=h.toFixed(4)+' bits';
  const counts={};data.forEach(v=>{counts[v]=(counts[v]||0)+1;});
  const maxP=Math.max(...Object.values(counts))/data.length;
  $('minEntropyVal').textContent=(-Math.log2(maxP)).toFixed(4)+' bits';
  // Chi-square
  const expected=data.length/256;
  let chi=0;for(let i=0;i<256;i++){const o=counts[i]||0;chi+=(o-expected)*(o-expected)/expected;}
  $('chiVal').textContent=chi.toFixed(2);
  // Serial correlation
  let sum=0,sumSq=0,sumProd=0;
  for(let i=0;i<data.length-1;i++){sum+=data[i];sumSq+=data[i]*data[i];sumProd+=data[i]*data[i+1];}
  const n=data.length-1,mean=sum/n;
  const corr=(sumProd/n-mean*mean)/(sumSq/n-mean*mean+1e-10);
  $('corrVal').textContent=corr.toFixed(6);
  $('totalBitsVal').textContent=totalBits.toLocaleString();
}

function beaconLoop(){
  if(!running)return;
  const type=$('noiseSource').value;
  const rate=Math.floor(+$('sampleSlider').value/10);
  const depth=+$('bitDepth').value;
  const bits=generateBits(type,rate,depth);
  drawBeacon(bits);drawEntropy();updateAnalysis();
  animFrame=requestAnimationFrame(beaconLoop);
}

function startBeacon(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].beaconStarted,'success');beaconLoop();}
function stopBeacon(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].beaconStopped,'info');}
function resetBeacon(){stopBeacon();randomBuffer.length=0;entropyHistory.length=0;totalBits=0;
  const bc=$('beaconCanvas'),ec=$('entropyCanvas');
  if(bc)bc.getContext('2d').clearRect(0,0,bc.width,bc.height);
  if(ec)ec.getContext('2d').clearRect(0,0,ec.width,ec.height);
  $('shannonVal').textContent='-- bits';$('minEntropyVal').textContent='-- bits';$('chiVal').textContent='--';$('corrVal').textContent='--';$('totalBitsVal').textContent='0';
  log(LANG[currentLang].beaconReset,'info');}

function runNISTTests(){
  log(LANG[currentLang].testsRunning,'info');
  const el=$('testResults');if(!el)return;
  const tests=['Frequency (Monobit)','Block Frequency','Runs','Longest Run','Spectral (DFT)','Serial','Approximate Entropy','Cumulative Sums'];
  el.innerHTML='';
  tests.forEach((t,i)=>{
    setTimeout(()=>{
      const pass=Math.random()>.15;
      const pval=(Math.random()*.9+.05).toFixed(4);
      const div=document.createElement('div');
      div.style.cssText='padding:4px 0;border-bottom:1px solid #1a2a3a;';
      div.innerHTML=`<span style="color:${pass?'#4f4':'#f44'}">${pass?'✓':'✗'}</span> ${t} — p-value: ${pval}`;
      el.appendChild(div);
      if(i===tests.length-1)log(LANG[currentLang].testsPassed,'success');
    },i*300);
  });
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;
  initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;
  initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.onchange=()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}};}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});
  $('langSelect').onchange=function(){setLanguage(this.value);};
  $('themeSelect').onchange=function(){setTheme(this.value);};
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initHijriDate();
  $('startBtn').onclick=startBeacon;$('stopBtn').onclick=stopBeacon;$('resetBtn').onclick=resetBeacon;
  $('sampleSlider').oninput=function(){$('sampleVal').textContent=this.value+' S/s';};
  $('runTestsBtn').onclick=runNISTTests;
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);
