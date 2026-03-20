/**
 * SDR Sandbox — Workshop DIY v1.0
 * SDR experimentation sandbox for free-form signal exploration.
 */
const $=id=>document.getElementById(id);
const LOGO_SVG=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="60" width="8" height="30" rx="2" fill="currentColor" opacity=".7"><animate attributeName="height" values="30;10;30" dur="1s" repeatCount="indefinite"/><animate attributeName="y" values="60;80;60" dur="1s" repeatCount="indefinite"/></rect><rect x="25" y="40" width="8" height="50" rx="2" fill="currentColor" opacity=".8"><animate attributeName="height" values="50;20;50" dur="1.2s" repeatCount="indefinite"/><animate attributeName="y" values="40;70;40" dur="1.2s" repeatCount="indefinite"/></rect><rect x="40" y="20" width="8" height="70" rx="2" fill="currentColor"><animate attributeName="height" values="70;30;70" dur="0.8s" repeatCount="indefinite"/><animate attributeName="y" values="20;60;20" dur="0.8s" repeatCount="indefinite"/></rect><rect x="55" y="35" width="8" height="55" rx="2" fill="currentColor" opacity=".85"><animate attributeName="height" values="55;15;55" dur="1.1s" repeatCount="indefinite"/><animate attributeName="y" values="35;75;35" dur="1.1s" repeatCount="indefinite"/></rect><rect x="70" y="50" width="8" height="40" rx="2" fill="currentColor" opacity=".75"><animate attributeName="height" values="40;10;40" dur="0.9s" repeatCount="indefinite"/><animate attributeName="y" values="50;80;50" dur="0.9s" repeatCount="indefinite"/></rect><rect x="85" y="55" width="8" height="35" rx="2" fill="currentColor" opacity=".6"><animate attributeName="height" values="35;5;35" dur="1.3s" repeatCount="indefinite"/><animate attributeName="y" values="55;85;55" dur="1.3s" repeatCount="indefinite"/></rect></svg>`;
const LIGHT_THEMES=['riad','medina'];let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;g.gain.exponentialRampToValueAtTime(0.001,t+.08);o.start(t);o.stop(t+.08);}else if(type==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,t+.3);o.start(t);o.stop(t+.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+.25);o.start(t);o.stop(t+.25);}}
const LANG={
  en:{title:'SDR Sandbox',subtitle:'SDR Experimentation Sandbox',disconnected:'Idle',connected:'Running',mainSection:'Signal Playground',mainDesc:'Generate, mix, filter, and analyze signals freely',sectionA:'Signal Metrics',sectionB:'Sandbox Tips',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'Settings',language:'Language',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Choose signal types.',howto_2:'Add a second signal to mix.',howto_3:'Apply filters.',howto_4:'Check FFT and metrics.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Languages',wiki_i18n:'EN, FR, AR.',working:'Working...',filterAll:'All',soundEffects:'Sound effects',ready:'Sandbox ready!',logCleared:'Cleared',copied:'Copied!',copyFail:'Failed',sig1Label:'Signal 1',freq1Label:'Freq 1 (Hz)',sig2Label:'Signal 2 (Mix)',freq2Label:'Freq 2 (Hz)',filterLabel:'Filter',cutoffLabel:'Cutoff (Hz)',startSim:'Start',stopSim:'Stop',resetSim:'Reset',peakFreq:'Peak Freq:',rmsLabel:'RMS:',snrLabel:'SNR:',tip1:'Mix two signals for interference',tip2:'Apply filters for frequency effects',tip3:'Chirp tests filter response',tip4:'Square wave shows harmonics in FFT',splashHint:'tap to skip',langChanged:'Language: English',themeChanged:'Theme:',started:'Sandbox started',stopped:'Stopped',resetDone:'Reset',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configure SDR',step1Desc:'Set the center frequency, sample rate, and gain for the SDR receiver.',step2Title:'Capture Signal',step2Desc:'Raw I/Q samples are captured from the radio spectrum in real time.',step3Title:'Process & Filter',step3Desc:'Digital signal processing applies filters, FFT, and demodulation algorithms.',step4Title:'Visualize Output',step4Desc:'The processed signal is displayed as spectrum, waterfall, or decoded data.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates software-defined radio! 🔬 You get to experiment with radio signals in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real radio signals so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real digital signal processing! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need RTL-SDR. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Sdr Exam Lab and Sdr Rf 101! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next'},
  fr:{title:'Bac a Sable SDR',subtitle:'Bac a sable d\'experimentation SDR',disconnected:'Inactif',connected:'En marche',mainSection:'Terrain de Jeu Signal',mainDesc:'Generez, mixez, filtrez et analysez des signaux',sectionA:'Metriques Signal',sectionB:'Astuces',activityLog:'Journal',eventsMsg:'Evenements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Theme',settings:'Parametres',language:'Langue',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Choisissez les types de signal.',howto_2:'Ajoutez un second signal.',howto_3:'Appliquez des filtres.',howto_4:'Verifiez FFT et metriques.',wiki_themes_title:'Themes',wiki_themes:'8 themes.',wiki_i18n_title:'Langues',wiki_i18n:'EN, FR, AR.',working:'En cours...',filterAll:'Tout',soundEffects:'Effets sonores',ready:'Sandbox pret!',logCleared:'Efface',copied:'Copie!',copyFail:'Echec',sig1Label:'Signal 1',freq1Label:'Freq 1 (Hz)',sig2Label:'Signal 2 (Mix)',freq2Label:'Freq 2 (Hz)',filterLabel:'Filtre',cutoffLabel:'Coupure (Hz)',startSim:'Demarrer',stopSim:'Arreter',resetSim:'Reinitialiser',peakFreq:'Freq pic:',rmsLabel:'RMS:',snrLabel:'RSB:',tip1:'Mixez deux signaux pour les interferences',tip2:'Filtrez pour voir les effets',tip3:'Le chirp teste la reponse',tip4:'Le carre montre les harmoniques',splashHint:'appuyer pour passer',langChanged:'Langue: Francais',themeChanged:'Theme:',started:'Sandbox demarre',stopped:'Arrete',resetDone:'Reinitialise',t_mosque:'Mosquee',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Medina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Configurer le SDR',step1Desc:'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.',step2Title:'Capturer le signal',step2Desc:'Les échantillons I/Q bruts sont capturés du spectre en temps réel.',step3Title:'Traiter et filtrer',step3Desc:'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.',step4Title:'Visualiser le résultat',step4Desc:'Le signal traité est affiché en spectre, cascade ou données décodées.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule software-defined radio ! 🔬 Tu peux expérimenter avec radio signals en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio signals.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai digital signal processing ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Sdr Exam Lab and Sdr Rf 101 ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv'},
  ar:{title:'صندوق رمل SDR',subtitle:'بيئة تجريب SDR حرة',disconnected:'خامل',connected:'يعمل',mainSection:'ملعب الاشارات',mainDesc:'ولد واخلط ورشح وحلل الاشارات بحرية',sectionA:'مقاييس الاشارة',sectionB:'نصائح',activityLog:'سجل النشاط',eventsMsg:'الاحداث',clear:'مسح',copy:'نسخ',export:'تصدير',theme:'المظهر',settings:'الاعدادات',language:'اللغة',help:'مساعدة',faq:'اسئلة شائعة',howto:'كيفية',wiki:'ويكي',howto_1:'اختر انواع الاشارات.',howto_2:'اضف اشارة ثانية للخلط.',howto_3:'طبق المرشحات.',howto_4:'راجع FFT والمقاييس.',wiki_themes_title:'المظاهر',wiki_themes:'8 مظاهر.',wiki_i18n_title:'اللغات',wiki_i18n:'EN, FR, AR.',working:'جارٍ...',filterAll:'الكل',soundEffects:'مؤثرات صوتية',ready:'صندوق الرمل جاهز!',logCleared:'تم المسح',copied:'تم النسخ!',copyFail:'فشل',sig1Label:'اشارة 1',freq1Label:'تردد 1 (هرتز)',sig2Label:'اشارة 2 (خلط)',freq2Label:'تردد 2 (هرتز)',filterLabel:'مرشح',cutoffLabel:'تردد القطع (هرتز)',startSim:'ابدا',stopSim:'ايقاف',resetSim:'اعادة',peakFreq:'تردد الذروة:',rmsLabel:'RMS:',snrLabel:'نسبة الاشارة:',tip1:'اخلط اشارتين لرؤية التداخل',tip2:'طبق المرشحات لرؤية التاثير',tip3:'الشيرب يختبر استجابة المرشح',tip4:'الموجة المربعة تظهر التوافقيات',splashHint:'انقر للتخطي',langChanged:'اللغة: العربية',themeChanged:'المظهر:',started:'بدا صندوق الرمل',stopped:'توقف',resetDone:'اعادة ضبط',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'اندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'ادغال',t_robot:'روبوت',step1Title:'تكوين SDR',step1Desc:'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.',step2Title:'التقاط الإشارة',step2Desc:'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.',step3Title:'معالجة وتصفية',step3Desc:'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.',step4Title:'عرض النتائج',step4Desc:'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي software-defined radio! 🔬 يمكنك التجربة مع radio signals في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio signals حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا digital signal processing حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Sdr Exam Lab and Sdr Rf 101! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي'}
};
let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;$('langSelect').value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(n){document.documentElement.dataset.theme=n;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(n));$('themeSelect').value=n;try{localStorage.setItem('wdiy-theme',n);}catch{}log(LANG[currentLang].themeChanged+' '+(LANG[currentLang]['t_'+n]||n),'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;applyLogFilter();}
function clearLog(){$('logContainer').innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){const t=Array.from($('logContainer').children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='sandbox-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(m,ms=0){$('toastIndicator').style.display='block';$('toastMessage').textContent=m;if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){$('toastIndicator').style.display='none';}
function setStatus(c){const s=LANG[currentLang];$('statusText').textContent=c?s.connected:s.disconnected;$('statusPill').classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}
function initSplash(){$('splashLogo').innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();}));}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}
function initHijriDate(){try{$('hijriDate').textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(p,o){$(p)?.classList.add('open');$(o)?.classList.add('open');}
function closePanel(p,o){$(p)?.classList.remove('open');$(o)?.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
let logWasOpen=false;
function openSettings(){logWasOpen=$('logPanel')?.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){$('logPanel')?.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){$('logPanel')?.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){$('logPanel')?.classList.contains('open')?closeLog():openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');$('help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1))?.classList.add('active');}));}

/* ═══════ SANDBOX SIMULATION ═══════ */
let running=false,animFrame=null;const SR=8192,N=1024;
function genSig(type,freq,n){const b=new Float32Array(n),dt=1/SR;for(let i=0;i<n;i++){const t=i*dt;switch(type){case'sine':b[i]=Math.sin(2*Math.PI*freq*t);break;case'square':b[i]=Math.sign(Math.sin(2*Math.PI*freq*t));break;case'sawtooth':b[i]=2*(freq*t-Math.floor(freq*t+.5));break;case'noise':b[i]=Math.random()*2-1;break;case'chirp':b[i]=Math.sin(2*Math.PI*(freq*.5+freq*1.5*(i/n))*t);break;default:b[i]=0;}}return b;}
function applyFilter(buf,type,cutoff){if(type==='none')return buf;const out=new Float32Array(buf.length),rc=1/(2*Math.PI*cutoff),dt=1/SR,a=dt/(rc+dt);if(type==='lowpass'){out[0]=buf[0];for(let i=1;i<buf.length;i++)out[i]=out[i-1]+a*(buf[i]-out[i-1]);return out;}if(type==='highpass'){out[0]=buf[0];for(let i=1;i<buf.length;i++)out[i]=(1-a)*(out[i-1]+buf[i]-buf[i-1]);return out;}if(type==='bandpass'){return applyFilter(applyFilter(buf,'lowpass',cutoff*1.2),'highpass',cutoff*.8);}return buf;}
function computeFFT(buf){const nn=N,mag=new Float32Array(nn/2);for(let k=0;k<nn/2;k++){let re=0,im=0;for(let n=0;n<nn;n++){const a=-2*Math.PI*k*n/nn;re+=buf[n]*Math.cos(a);im+=buf[n]*Math.sin(a);}mag[k]=Math.sqrt(re*re+im*im)/nn;}return mag;}
function drawScope(buf){const c=$('scopeCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#1a2a3a';ctx.lineWidth=.5;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(0,i*h/5);ctx.lineTo(w,i*h/5);ctx.stroke();}const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();const step=Math.max(1,Math.floor(buf.length/w));for(let i=0;i<w;i++){const idx=Math.min(i*step,buf.length-1);const y=h/2-buf[idx]*(h/2)*.85;if(i===0)ctx.moveTo(0,y);else ctx.lineTo(i,y);}ctx.stroke();}
function drawFFT(mag){const c=$('fftCanvas'),ctx=c.getContext('2d'),w=c.width,h=c.height;ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,w,h);const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.beginPath();const mx=Math.max(...mag)||1;for(let i=0;i<mag.length;i++){const x=i/mag.length*w,db=20*Math.log10(mag[i]/mx+1e-10),y=h-((db+60)/60)*h;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.fillStyle='#8899aa';ctx.font='10px Orbitron,monospace';ctx.fillText('0 Hz',4,h-4);ctx.fillText((SR/2)+' Hz',w-60,h-4);}
function simLoop(){if(!running)return;const s1=$('sig1Type').value,f1=+$('freq1Slider').value,s2=$('sig2Type').value,f2=+$('freq2Slider').value;const ft=$('filterType').value,co=+$('cutoffSlider').value;let buf=genSig(s1,f1,N);if(s2!=='none'){const b2=genSig(s2,f2,N);for(let i=0;i<N;i++)buf[i]=(buf[i]+b2[i])*0.5;}buf=applyFilter(buf,ft,co);const mag=computeFFT(buf);drawScope(buf);drawFFT(mag);
const mx=Math.max(...mag)||1,pi=mag.indexOf(Math.max(...mag));$('peakVal').textContent=((pi/mag.length)*(SR/2)).toFixed(0)+' Hz';let rms=0;for(let i=0;i<N;i++)rms+=buf[i]*buf[i];rms=Math.sqrt(rms/N);$('rmsVal').textContent=rms.toFixed(4);const sp=mag[pi]*mag[pi];let np=0;for(let i=0;i<mag.length;i++)if(Math.abs(i-pi)>10)np+=mag[i]*mag[i];np/=(mag.length-20);$('snrVal').textContent=(10*Math.log10(sp/(np+1e-20))).toFixed(1)+' dB';
animFrame=requestAnimationFrame(simLoop);}
function startSim(){if(running)return;running=true;setStatus(true);log(LANG[currentLang].started,'success');simLoop();}
function stopSim(){running=false;if(animFrame)cancelAnimationFrame(animFrame);setStatus(false);log(LANG[currentLang].stopped,'info');}
function resetSim(){stopSim();$('freq1Slider').value=440;$('freq1Val').textContent='440 Hz';$('freq2Slider').value=880;$('freq2Val').textContent='880 Hz';$('cutoffSlider').value=2000;$('cutoffVal').textContent='2000 Hz';$('sig1Type').value='sine';$('sig2Type').value='none';$('filterType').value='none';['scopeCanvas','fftCanvas'].forEach(id=>{const c=$(id);c.getContext('2d').clearRect(0,0,c.width,c.height);});$('peakVal').textContent='-- Hz';$('rmsVal').textContent='--';$('snrVal').textContent='-- dB';log(LANG[currentLang].resetDone,'info');}

function init(){
  initSplash();$('logoWrap').innerHTML=LOGO_SVG;
  $('clearLogBtn').onclick=clearLog;$('copyLogBtn').onclick=copyLog;$('exportLogBtn').onclick=exportLog;initLogFilters();
  $('helpBtn').onclick=openHelp;$('helpCloseBtn').onclick=closeHelp;$('helpOverlay').onclick=closeHelp;initHelpTabs();
  $('settingsBtn').onclick=openSettings;$('settingsCloseBtn').onclick=closeSettings;$('settingsOverlay').onclick=closeSettings;
  $('logBtn').onclick=toggleLog;$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{};});}
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  $('langSelect').addEventListener('change',function(){setLanguage(this.value);});
  $('themeSelect').addEventListener('change',function(){setTheme(this.value);});
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  initHijriDate();
  $('startBtn').onclick=startSim;$('stopBtn').onclick=stopSim;$('resetBtn').onclick=resetSim;
  $('freq1Slider').oninput=function(){$('freq1Val').textContent=this.value+' Hz';};
  $('freq2Slider').oninput=function(){$('freq2Val').textContent=this.value+' Hz';};
  $('cutoffSlider').oninput=function(){$('cutoffVal').textContent=this.value+' Hz';};
  log(LANG[currentLang].ready,'success');
}
document.addEventListener('DOMContentLoaded',init);

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — SDR Sandbox
   Animated signal mixing visualizer + frequency domain morph
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
function boot(){
  let el=document.getElementById('sandboxSimCanvas');
  if(!el){el=document.createElement('canvas');el.id='sandboxSimCanvas';el.width=780;el.height=180;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#060810;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.025;cx.fillStyle='#060810';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // Signal 1 (left third)
  cx.strokeStyle='#4fc3f7';cx.lineWidth=1.5;cx.beginPath();
  for(let i=0;i<W/3-10;i++){const x=i+5;const y=H*.3-Math.sin(i*.08+t*4)*H*.18;if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);}cx.stroke();
  // Signal 2 (left third, lower)
  cx.strokeStyle='#f59e0b';cx.lineWidth=1.5;cx.beginPath();
  for(let i=0;i<W/3-10;i++){const x=i+5;const y=H*.7-Math.sin(i*.12+t*3)*H*.15;if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);}cx.stroke();
  // Plus sign
  cx.fillStyle='rgba(255,255,255,.3)';cx.font='20px monospace';cx.textAlign='center';cx.fillText('+',W/3,H/2);
  // Mixed signal (middle third)
  cx.strokeStyle=acc;cx.lineWidth=2;cx.beginPath();
  for(let i=0;i<W/3-10;i++){const x=W/3+10+i;
    const y=H/2-(Math.sin(i*.08+t*4)*H*.15+Math.sin(i*.12+t*3)*H*.12)*.5;
    if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);}cx.stroke();
  // Arrow
  cx.fillStyle='rgba(255,255,255,.3)';cx.font='20px monospace';cx.textAlign='center';cx.fillText('->',2*W/3+5,H/2);
  // FFT of mixed (right third)
  cx.strokeStyle='#22c55e';cx.lineWidth=1.5;cx.beginPath();
  for(let i=0;i<W/3-20;i++){
    const x=2*W/3+15+i;const f=i/(W/3-20);
    const peak1=Math.exp(-Math.pow((f-.2)/.03,2));
    const peak2=Math.exp(-Math.pow((f-.35)/.04,2));
    const y=H-15-(peak1+peak2+Math.random()*.02)*H*.7;
    if(i===0)cx.moveTo(x,y);else cx.lineTo(x,y);
  }cx.stroke();
  cx.fillStyle='#4fc3f788';cx.font='8px monospace';cx.textAlign='left';cx.fillText('Sig 1',8,20);
  cx.fillStyle='#f59e0b88';cx.fillText('Sig 2',8,H*.55);
  cx.fillStyle=acc+'88';cx.fillText('Mixed',W/3+15,20);
  cx.fillStyle='#22c55e88';cx.fillText('FFT',2*W/3+20,20);
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='center';
  cx.fillText('Signal Mixing Pipeline — Time to Frequency',W/2,H-4);
  af=requestAnimationFrame(tick);
}
setTimeout(()=>{boot();tick();},600);
})();


// ── Code Tab Switching ──
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('code-tab')) {
    var tabs = e.target.parentElement;
    tabs.querySelectorAll('.code-tab').forEach(function(t) { t.classList.remove('active'); });
    e.target.classList.add('active');
    var target = e.target.getAttribute('data-codetarget');
    var card = tabs.closest('.card');
    card.querySelectorAll('.code-display').forEach(function(d) { d.classList.add('hidden'); });
    var show = card.querySelector('#code-' + target);
    if (show) show.classList.remove('hidden');
  }
});

var DEMO_STEPS = [
  {i18n:'demo_s1', text:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬', target:'#helpBtn', delay:3000},
  {i18n:'demo_s2', text:'Click the primary action button to start. Watch the visualization respond in real time! ⚡', target:'#settingsBtn', delay:3000},
  {i18n:'demo_s3', text:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄', target:'#logBtn', delay:3000},
  {i18n:'demo_s4', text:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊', target:'#simCanvas', delay:3000},
  {i18n:'demo_s5', text:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!', target:'#mainCard', delay:3000},
];

// ── Demo Engine ──
var _demoStep = 0, _demoPlaying = false, _demoTimer = null;
var _demoSteps = (typeof DEMO_STEPS !== 'undefined') ? DEMO_STEPS : [];

function demoNav(dir) {
  _demoStep = Math.max(0, Math.min(_demoSteps.length - 1, _demoStep + dir));
  demoShow();
}

function demoToggle() {
  _demoPlaying = !_demoPlaying;
  var btn = document.getElementById('demoPlayBtn');
  if (btn) btn.innerHTML = _demoPlaying ? '⏸ <span data-i18n="demoPause">Pause</span>' : '▶ <span data-i18n="demoPlay">Play</span>';
  if (_demoPlaying) {
    demoShow();
    _demoTimer = setInterval(function() {
      if (_demoStep < _demoSteps.length - 1) { _demoStep++; demoShow(); }
      else { _demoPlaying = false; clearInterval(_demoTimer); var b = document.getElementById('demoPlayBtn'); if(b) b.innerHTML = '▶ <span data-i18n="demoPlay">Play</span>'; }
    }, 3000);
  } else {
    clearInterval(_demoTimer);
  }
}

function demoShow() {
  var step = _demoSteps[_demoStep];
  if (!step) return;
  var numEl = document.getElementById('demoCurrentStep');
  var narEl = document.getElementById('demoNarration');
  var barEl = document.getElementById('demoProgressBar');
  if (numEl) numEl.textContent = (_demoStep + 1) + '/' + _demoSteps.length;
  if (narEl) { narEl.setAttribute('data-i18n', step.i18n); narEl.textContent = step.text; if (typeof applyLang === 'function') applyLang(); }
  if (barEl) barEl.style.width = ((_demoStep + 1) / _demoSteps.length * 100) + '%';
  // Remove old highlights
  document.querySelectorAll('.demo-highlight').forEach(function(el) { el.classList.remove('demo-highlight'); });
  // Add highlight
  if (step.target) { var t = document.querySelector(step.target); if (t) { t.classList.add('demo-highlight'); t.scrollIntoView({behavior:'smooth', block:'center'}); } }
}
