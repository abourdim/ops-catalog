/**
 * Workshop DIY — Consensus Lab v1.0
 * Raft/PBFT: 5-node cluster, leader election, log replication, heartbeats
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77.14 78.32 253.99 136.25"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7c.3-.2,1.4-.9,2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3v-7.7z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8v-10.9l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9v-17.5h-3.9v-4.7h14.5z"/><path style="stroke:none;fill:currentColor" d="M330.8,195.7h-126.8v3.6h126.8z"/><path style="stroke:none;fill:currentColor" d="M330.8,203.4h-169.1v3.6h169.1z"/><path style="stroke:none;fill:currentColor" d="M330.8,211h-253.7v3.6h253.7z"/></svg>`;
const LIGHT_THEMES = ['riad','medina'];
const APP_VERSION = '1.0';
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;switch(type){case'click':o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);break;case'success':o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);break;case'error':o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);break;}}

const LANG={
en:{
title:'Consensus Lab',subtitle:'🗳️ Raft · 📋 Log · 💓 Heartbeat · ⚡ Election',
disconnected:'Disconnected',connected:'Simulation Active',
mainSection:'Consensus Lab — Raft/PBFT',mainDesc:'Visualize distributed consensus with elections and replication',
sectionA:'How It Works',sectionB:'Lab',sectionC:'Challenge',
activityLog:'Activity Log',eventsMsg:'Events & messages',
clear:'Clear',copy:'Copy',theme:'Theme',export:'Export',filterAll:'All',
settings:'⚙️ Settings',language:'Language',
help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',
faq_q1:'What is Raft consensus?',faq_a1:'Raft is a distributed consensus algorithm that elects a leader to manage log replication across a cluster of nodes.',
faq_q2:'What is a term?',faq_a2:'A term is a logical clock in Raft. Each election increments the term number, ensuring consistency across leadership changes.',
faq_q3:'What is split brain?',faq_a3:'Split brain occurs when a network partition divides the cluster, potentially causing two partitions to operate independently.',
faq_q4:'How does log replication work?',faq_a4:'The leader appends entries to its log and sends them to followers. Once a majority acknowledges, the entry is committed.',
howto_1:'Click Trigger Election to start a leader election among the 5 nodes.',
howto_2:'Watch the voting animation as nodes send RequestVote messages.',
howto_3:'Use Replicate Log to push new entries from leader to followers.',
howto_4:'Crash or heal nodes to test fault tolerance of the cluster.',
wiki_raft_title:'🗳️ Raft Algorithm',wiki_raft:'Raft decomposes consensus into leader election, log replication, and safety. Only one leader per term.',
wiki_pbft_title:'🛡️ PBFT',wiki_pbft:'Practical Byzantine Fault Tolerance handles malicious nodes. Requires 3f+1 nodes to tolerate f faults.',
wiki_hb_title:'💓 Heartbeats',wiki_hb:'Leaders send periodic heartbeats to maintain authority. Missing heartbeats trigger new elections.',
wiki_commit_title:'📋 Log Commit',wiki_commit:'An entry is committed once replicated to a majority. Committed entries are durable.',
working:'Working…',
t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',
ready:'🗳️ Consensus Lab ready — 5-node cluster initialized!',
logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',
soundEffects:'🔊 Sound effects',whisperMode:'Whisper mode',breathingGuide:'Breathing guide',dhikrTap:'Tap',musicMode:'Music reactive',
splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',
triggerElection:'Trigger Election',replicateLog:'Replicate Log',crashNode:'Crash Node',healNode:'Heal Node',splitBrain:'Split Brain',
step1:'In Raft, nodes start as Followers. When a Follower times out waiting for a heartbeat, it becomes a Candidate and requests votes.',
step2:'A Candidate wins the election by receiving votes from a majority of nodes. It then becomes the Leader for that term.',
step3:'The Leader sends periodic heartbeats to all Followers and replicates log entries to maintain consistency.',
step4:'If the Leader crashes, Followers detect the missing heartbeats and trigger a new election, incrementing the term number.',
labTip1:'Click Trigger Election to start a leader election and watch nodes vote.',
labTip2:'Use Replicate Log to see the leader push entries to followers.',
labTip3:'Crash a node and observe how the cluster handles the failure.',
labTip4:'Try Split Brain to partition the network and see what happens.',
challenge1:'Trigger an election and identify which node becomes Leader. Note the term number.',
challenge2:'Crash the Leader and observe how the cluster elects a new one automatically.',
challenge3:'Create a split brain scenario and explain why neither partition can commit.',
electionStarted:'⚡ Election started — Term',candidateRequesting:'🗳️ Node requesting votes',voteGranted:'✓ Vote granted by Node',leaderElected:'👑 Node elected as Leader for Term',heartbeat:'💓 Heartbeat from Leader to Followers',logReplicated:'📋 Log entry replicated to',committed:'✅ Entry committed by majority',nodeCrashed:'💥 Node crashed!',nodeHealed:'🩹 Node healed and rejoined',splitBrainActive:'⚠️ Network partitioned — Split brain!',splitBrainHealed:'✅ Network partition healed',noLeader:'❌ No leader — trigger an election first',
,step1Title:'Scan',step1Desc:'The network is scanned to discover active devices and services.',step2Title:'Capture',step2Desc:'Network packets are intercepted and captured for analysis.',step3Title:'Analyze',step3Desc:'Packet data is parsed to reveal protocols, addresses, and payloads.',step4Title:'Report',step4Desc:'Results are visualized as graphs, maps, or detailed reports.',sectionCode:'Device Code'},
fr:{
title:'Labo Consensus',subtitle:'🗳️ Raft · 📋 Journal · 💓 Battement · ⚡ Élection',
disconnected:'Déconnecté',connected:'Simulation Active',
mainSection:'Labo Consensus — Raft/PBFT',mainDesc:'Visualisez le consensus distribué avec élections et réplication',
sectionA:'Comment ça marche',sectionB:'Labo',sectionC:'Défi',
activityLog:'Journal',eventsMsg:'Événements et messages',
clear:'Effacer',copy:'Copier',theme:'Thème',export:'Exporter',filterAll:'Tout',
settings:'⚙️ Paramètres',language:'Langue',
help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',
faq_q1:'Qu\'est-ce que le consensus Raft ?',faq_a1:'Raft est un algorithme de consensus distribué qui élit un leader pour gérer la réplication du journal.',
faq_q2:'Qu\'est-ce qu\'un terme ?',faq_a2:'Un terme est une horloge logique dans Raft. Chaque élection incrémente le numéro de terme.',
faq_q3:'Qu\'est-ce que le split brain ?',faq_a3:'Le split brain survient quand une partition réseau divise le cluster en deux parties indépendantes.',
faq_q4:'Comment fonctionne la réplication ?',faq_a4:'Le leader ajoute des entrées à son journal et les envoie aux followers. Une fois qu\'une majorité confirme, l\'entrée est validée.',
howto_1:'Cliquez Déclencher Élection pour lancer une élection de leader parmi les 5 nœuds.',
howto_2:'Observez l\'animation de vote quand les nœuds envoient des messages RequestVote.',
howto_3:'Utilisez Répliquer Journal pour pousser de nouvelles entrées du leader vers les followers.',
howto_4:'Plantez ou guérissez des nœuds pour tester la tolérance aux pannes.',
wiki_raft_title:'🗳️ Algorithme Raft',wiki_raft:'Raft décompose le consensus en élection de leader, réplication de journal et sécurité.',
wiki_pbft_title:'🛡️ PBFT',wiki_pbft:'PBFT gère les nœuds malveillants. Nécessite 3f+1 nœuds pour tolérer f pannes.',
wiki_hb_title:'💓 Battements',wiki_hb:'Les leaders envoient des battements réguliers pour maintenir leur autorité.',
wiki_commit_title:'📋 Validation',wiki_commit:'Une entrée est validée une fois répliquée sur une majorité de nœuds.',
working:'En cours…',
t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',
ready:'🗳️ Labo Consensus prêt — cluster de 5 nœuds initialisé !',
logCleared:'Journal effacé',copied:'Copié !',copyFail:'Échec',
soundEffects:'🔊 Effets sonores',whisperMode:'Mode murmure',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',musicMode:'Réactif musique',
splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',
triggerElection:'Déclencher Élection',replicateLog:'Répliquer Journal',crashNode:'Planter Nœud',healNode:'Guérir Nœud',splitBrain:'Split Brain',
step1:'Dans Raft, les nœuds démarrent comme Followers. Quand un Follower expire sans battement, il devient Candidat et demande des votes.',
step2:'Un Candidat gagne l\'élection en recevant les votes d\'une majorité. Il devient alors Leader pour ce terme.',
step3:'Le Leader envoie des battements périodiques et réplique les entrées du journal pour maintenir la cohérence.',
step4:'Si le Leader plante, les Followers détectent l\'absence de battements et déclenchent une nouvelle élection.',
labTip1:'Cliquez Déclencher Élection pour lancer une élection et regarder les nœuds voter.',
labTip2:'Utilisez Répliquer Journal pour voir le leader pousser des entrées.',
labTip3:'Plantez un nœud et observez comment le cluster gère la panne.',
labTip4:'Essayez Split Brain pour partitionner le réseau.',
challenge1:'Déclenchez une élection et identifiez le Leader. Notez le numéro de terme.',
challenge2:'Plantez le Leader et observez le cluster élire un nouveau leader automatiquement.',
challenge3:'Créez un split brain et expliquez pourquoi aucune partition ne peut valider.',
electionStarted:'⚡ Élection lancée — Terme',candidateRequesting:'🗳️ Nœud demande des votes',voteGranted:'✓ Vote accordé par Nœud',leaderElected:'👑 Nœud élu Leader pour le Terme',heartbeat:'💓 Battement du Leader aux Followers',logReplicated:'📋 Entrée répliquée vers',committed:'✅ Entrée validée par majorité',nodeCrashed:'💥 Nœud planté !',nodeHealed:'🩹 Nœud guéri et rejoint',splitBrainActive:'⚠️ Réseau partitionné — Split brain !',splitBrainHealed:'✅ Partition réseau guérie',noLeader:'❌ Pas de leader — déclenchez une élection d\'abord',
,step1Title:'Scanner',step1Desc:'Le réseau est scanné pour découvrir les appareils et services actifs.',step2Title:'Capturer',step2Desc:'Les paquets réseau sont interceptés et capturés pour analyse.',step3Title:'Analyser',step3Desc:'Les données des paquets sont analysées pour révéler protocoles et adresses.',step4Title:'Rapporter',step4Desc:'Les résultats sont visualisés sous forme de graphiques ou rapports.',sectionCode:'Code Appareil'},
ar:{
title:'مختبر الإجماع',subtitle:'🗳️ Raft · 📋 سجل · 💓 نبض · ⚡ انتخاب',
disconnected:'غير متصل',connected:'المحاكاة نشطة',
mainSection:'مختبر الإجماع — Raft/PBFT',mainDesc:'تصور الإجماع الموزع مع الانتخابات والنسخ',
sectionA:'كيف يعمل',sectionB:'المختبر',sectionC:'التحدي',
activityLog:'سجل النشاط',eventsMsg:'الأحداث والرسائل',
clear:'مسح',copy:'نسخ',theme:'المظهر',export:'تصدير',filterAll:'الكل',
settings:'⚙️ الإعدادات',language:'اللغة',
help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',
faq_q1:'ما هو إجماع Raft؟',faq_a1:'Raft هو خوارزمية إجماع موزعة تنتخب قائدًا لإدارة نسخ السجل عبر مجموعة من العقد.',
faq_q2:'ما هو المصطلح (Term)؟',faq_a2:'المصطلح هو ساعة منطقية في Raft. كل انتخاب يزيد رقم المصطلح.',
faq_q3:'ما هو الانقسام الدماغي؟',faq_a3:'الانقسام الدماغي يحدث عندما تقسم partition الشبكة المجموعة إلى جزأين مستقلين.',
faq_q4:'كيف يعمل نسخ السجل؟',faq_a4:'القائد يضيف إدخالات إلى سجله ويرسلها للتابعين. بمجرد تأكيد الأغلبية، يتم الالتزام بالإدخال.',
howto_1:'انقر على تشغيل الانتخاب لبدء انتخاب قائد بين العقد الخمس.',
howto_2:'شاهد رسوم التصويت المتحركة عندما ترسل العقد رسائل طلب التصويت.',
howto_3:'استخدم نسخ السجل لدفع إدخالات جديدة من القائد إلى التابعين.',
howto_4:'أعطب أو اشفِ العقد لاختبار تحمل الأخطاء.',
wiki_raft_title:'🗳️ خوارزمية Raft',wiki_raft:'Raft يحلل الإجماع إلى انتخاب قائد ونسخ سجل وسلامة.',
wiki_pbft_title:'🛡️ PBFT',wiki_pbft:'PBFT يتعامل مع العقد الخبيثة. يتطلب 3f+1 عقدة لتحمل f أخطاء.',
wiki_hb_title:'💓 النبضات',wiki_hb:'القادة يرسلون نبضات دورية للحفاظ على سلطتهم.',
wiki_commit_title:'📋 التزام السجل',wiki_commit:'يتم الالتزام بإدخال بمجرد نسخه على الأغلبية.',
working:'جارٍ…',
t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',
ready:'🗳️ مختبر الإجماع جاهز — تمت تهيئة مجموعة من 5 عقد!',
logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',
soundEffects:'🔊 مؤثرات صوتية',whisperMode:'وضع الهمس',breathingGuide:'دليل التنفس',dhikrTap:'اضغط',musicMode:'تفاعل موسيقي',
splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',
triggerElection:'تشغيل الانتخاب',replicateLog:'نسخ السجل',crashNode:'تعطيل عقدة',healNode:'شفاء عقدة',splitBrain:'انقسام دماغي',
step1:'في Raft، تبدأ العقد كتابعين. عندما ينتهي وقت انتظار التابع للنبض، يصبح مرشحًا ويطلب أصواتًا.',
step2:'يفوز المرشح بالانتخاب بتلقي أصوات من أغلبية العقد. ثم يصبح القائد لذلك المصطلح.',
step3:'القائد يرسل نبضات دورية لجميع التابعين وينسخ إدخالات السجل للحفاظ على الاتساق.',
step4:'إذا تعطل القائد، يكتشف التابعون غياب النبضات ويبدأون انتخابًا جديدًا.',
labTip1:'انقر على تشغيل الانتخاب لبدء انتخاب قائد وشاهد العقد تصوّت.',
labTip2:'استخدم نسخ السجل لمشاهدة القائد يدفع إدخالات للتابعين.',
labTip3:'عطّل عقدة ولاحظ كيف تتعامل المجموعة مع الفشل.',
labTip4:'جرّب الانقسام الدماغي لتقسيم الشبكة.',
challenge1:'شغّل انتخابًا وحدد أي عقدة تصبح القائد. لاحظ رقم المصطلح.',
challenge2:'عطّل القائد ولاحظ كيف تنتخب المجموعة قائدًا جديدًا تلقائيًا.',
challenge3:'أنشئ سيناريو انقسام دماغي واشرح لماذا لا يمكن لأي قسم الالتزام.',
electionStarted:'⚡ بدأ الانتخاب — المصطلح',candidateRequesting:'🗳️ عقدة تطلب أصواتًا',voteGranted:'✓ تم منح صوت من العقدة',leaderElected:'👑 عقدة انتُخبت قائدًا للمصطلح',heartbeat:'💓 نبضة من القائد للتابعين',logReplicated:'📋 تم نسخ إدخال إلى',committed:'✅ تم الالتزام بالإدخال من الأغلبية',nodeCrashed:'💥 تعطلت العقدة!',nodeHealed:'🩹 تم شفاء العقدة وانضمامها',splitBrainActive:'⚠️ الشبكة مقسمة — انقسام دماغي!',splitBrainHealed:'✅ تم إصلاح تقسيم الشبكة',noLeader:'❌ لا يوجد قائد — شغّل انتخابًا أولاً',
,step1Title:'مسح',step1Desc:'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.',step2Title:'التقاط',step2Desc:'يتم اعتراض حزم الشبكة والتقاطها للتحليل.',step3Title:'تحليل',step3Desc:'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.',step4Title:'تقرير',step4Desc:'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.',sectionCode:'كود الجهاز'}};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=`${s.title} — Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}

const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440],'retro':[523,262,523]};
function playThemeMelody(n){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const ns=THEME_MELODIES[n];if(!ns)return;const t=audioCtx.currentTime;ns.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}playThemeMelody(name);log(`${LANG[currentLang].themeChanged} ${LANG[currentLang]['t_'+name]||name}`,'info');}

let logContainer,typewriterEnabled=true;
function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;const txt=`[${new Date().toLocaleTimeString()}] ${msg}`;d.textContent=txt;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\n'));log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\n')],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`consensus-log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}

let toastTimer=null;
function showToast(m,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=m||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}

let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(b=>{b.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeLogFilter=b.dataset.filter;applyLogFilter();playSound('click');});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=(activeLogFilter==='all'||l.classList.contains(activeLogFilter))?'':'none';});}

function openPanel(p,o){const s=$(p),ov=$(o);if(s)s.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(p,o,r){const s=$(p),ov=$(o);if(s)s.classList.remove('open');if(ov)ov.classList.remove('open');const b=$(r);if(b)b.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}
function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');if(s&&s.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),cs=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));cs.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const tgt=$('help'+n.charAt(0).toUpperCase()+n.slice(1));if(tgt)tgt.classList.add('active');});});}
function initLogResize(){const h=$('logResizeHandle'),p=$('logPanel');if(!h||!p)return;let d=false,sx,sw;h.addEventListener('mousedown',e=>{d=true;sx=e.clientX;sw=p.offsetWidth;e.preventDefault();});document.addEventListener('mousemove',e=>{if(!d)return;const dx=(document.documentElement.dir==='rtl')?(e.clientX-sx):(sx-e.clientX);document.documentElement.style.setProperty('--log-width',Math.max(200,Math.min(sw+dx,innerWidth*0.6))+'px');});document.addEventListener('mouseup',()=>{d=false;});}

let breathingActive=false,dhikrCount=0;
function toggleBreathing(){breathingActive=!breathingActive;document.querySelectorAll('.deco-band').forEach(b=>b.classList.toggle('breathing',breathingActive));}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
const KONAMI=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let konamiIdx=0;
function initKonami(){document.addEventListener('keydown',e=>{if(e.key===KONAMI[konamiIdx]){konamiIdx++;if(konamiIdx===KONAMI.length){konamiIdx=0;setTheme('retro');log('🕹️ KONAMI CODE — RETRO!','success');}}else konamiIdx=0;});}

/* ═══════ RAFT CONSENSUS SIMULATION ═══════ */

const NODE_COLORS = ['#3b82f6','#22d3ee','#a3e635','#f97316','#c084fc'];
const NODE_NAMES = ['N1','N2','N3','N4','N5'];
const STATE = { FOLLOWER:'Follower', CANDIDATE:'Candidate', LEADER:'Leader', CRASHED:'Crashed' };

let nodes = [];
let term = 0;
let leaderId = -1;
let logEntries = [];
let logEntryCounter = 0;
let splitBrainMode = false;
let animMessages = [];
let heartbeatInterval = null;
let canvas, ctx;

function initNodes(){
  nodes = NODE_NAMES.map((name,i) => ({
    id: i, name, state: STATE.FOLLOWER, color: NODE_COLORS[i],
    x: 0, y: 0, votes: 0, logCount: 0, partition: 0,
    pulseAlpha: 0, hbAlpha: 0
  }));
  leaderId = -1; term = 0; logEntries = []; logEntryCounter = 0;
  splitBrainMode = false; animMessages = [];
}

function layoutNodes(w,h){
  const cx=w/2, cy=h/2, r=Math.min(w,h)*0.35;
  nodes.forEach((n,i)=>{
    const a = -Math.PI/2 + (2*Math.PI*i)/nodes.length;
    n.x = cx + r*Math.cos(a);
    n.y = cy + r*Math.sin(a);
  });
}

function addRaftLog(msg, cls=''){
  const rl = $('raftLog');
  if(!rl) return;
  const d = document.createElement('div');
  d.className = 'entry'+(cls?' '+cls:'');
  d.textContent = `[T${term}] ${msg}`;
  rl.appendChild(d);
  rl.scrollTop = rl.scrollHeight;
}

function updateNodeStatusBar(){
  const bar = $('nodeStatusBar');
  if(!bar) return;
  bar.innerHTML = '';
  nodes.forEach(n=>{
    const chip = document.createElement('div');
    chip.className = 'node-chip';
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.style.background = n.state===STATE.CRASHED?'#ef4444':n.state===STATE.LEADER?'#22c55e':n.state===STATE.CANDIDATE?'#fbbf24':n.color;
    chip.appendChild(dot);
    chip.appendChild(document.createTextNode(`${n.name}: ${n.state} [${n.logCount}]`));
    bar.appendChild(chip);
  });
  $('termNum').textContent = term;
}

function sendAnimMessage(from, to, label, color){
  animMessages.push({ fromX:from.x, fromY:from.y, toX:to.x, toY:to.y, t:0, label, color });
}

function drawCanvas(){
  if(!canvas||!ctx) return;
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);

  // Draw partition line if split brain
  if(splitBrainMode){
    ctx.save();
    ctx.setLineDash([8,6]);
    ctx.strokeStyle='rgba(239,68,68,0.5)';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.moveTo(w/2,0);ctx.lineTo(w/2,h);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle='rgba(239,68,68,0.3)';
    ctx.font='bold 11px sans-serif';
    ctx.textAlign='center';
    ctx.fillText('PARTITION',w/2,16);
  }

  // Draw links
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j];
      if(a.state===STATE.CRASHED||b.state===STATE.CRASHED) continue;
      if(splitBrainMode && a.partition!==b.partition) continue;
      ctx.beginPath();
      ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
      ctx.strokeStyle='rgba(255,255,255,0.08)';
      ctx.lineWidth=1;
      ctx.stroke();
    }
  }

  // Draw animated messages
  animMessages.forEach(m=>{
    const x = m.fromX + (m.toX-m.fromX)*m.t;
    const y = m.fromY + (m.toY-m.fromY)*m.t;
    ctx.beginPath();
    ctx.arc(x,y,5,0,Math.PI*2);
    ctx.fillStyle=m.color;
    ctx.fill();
    ctx.font='bold 9px sans-serif';
    ctx.fillStyle=m.color;
    ctx.textAlign='center';
    ctx.fillText(m.label,x,y-10);
    m.t += 0.03;
  });
  animMessages = animMessages.filter(m=>m.t<1);

  // Draw nodes
  nodes.forEach(n=>{
    // Heartbeat pulse
    if(n.hbAlpha>0){
      ctx.beginPath();
      ctx.arc(n.x,n.y,32+10*(1-n.hbAlpha),0,Math.PI*2);
      ctx.strokeStyle=`rgba(34,197,94,${n.hbAlpha})`;
      ctx.lineWidth=2;
      ctx.stroke();
      n.hbAlpha = Math.max(0,n.hbAlpha-0.02);
    }

    // Node circle
    ctx.beginPath();
    ctx.arc(n.x,n.y,24,0,Math.PI*2);
    if(n.state===STATE.CRASHED){
      ctx.fillStyle='rgba(239,68,68,0.2)';
      ctx.strokeStyle='#ef4444';
    } else if(n.state===STATE.LEADER){
      ctx.fillStyle='rgba(34,197,94,0.2)';
      ctx.strokeStyle='#22c55e';
    } else if(n.state===STATE.CANDIDATE){
      ctx.fillStyle='rgba(251,191,36,0.2)';
      ctx.strokeStyle='#fbbf24';
    } else {
      ctx.fillStyle='rgba(255,255,255,0.05)';
      ctx.strokeStyle=n.color;
    }
    ctx.lineWidth=n.state===STATE.LEADER?3:2;
    ctx.fill();ctx.stroke();

    // Crown for leader
    if(n.state===STATE.LEADER){
      ctx.font='16px serif';
      ctx.textAlign='center';
      ctx.fillText('👑',n.x,n.y-28);
    }
    // X for crashed
    if(n.state===STATE.CRASHED){
      ctx.font='bold 20px sans-serif';
      ctx.textAlign='center';
      ctx.fillStyle='#ef4444';
      ctx.fillText('✕',n.x,n.y+7);
    } else {
      ctx.font='bold 12px sans-serif';
      ctx.textAlign='center';
      ctx.fillStyle='#fff';
      ctx.fillText(n.name,n.x,n.y+5);
    }

    // State label
    ctx.font='9px sans-serif';
    ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.fillText(n.state,n.x,n.y+38);

    // Pulse effect
    if(n.pulseAlpha>0){
      ctx.beginPath();
      ctx.arc(n.x,n.y,28+15*(1-n.pulseAlpha),0,Math.PI*2);
      ctx.strokeStyle=`rgba(251,191,36,${n.pulseAlpha})`;
      ctx.lineWidth=2;
      ctx.stroke();
      n.pulseAlpha=Math.max(0,n.pulseAlpha-0.015);
    }
  });

  requestAnimationFrame(drawCanvas);
}

function getAliveNodes(partition){
  return nodes.filter(n=>n.state!==STATE.CRASHED && (!splitBrainMode || n.partition===partition));
}

async function triggerElection(){
  const s = LANG[currentLang];
  // Pick a random alive follower as candidate
  const followers = nodes.filter(n=>n.state===STATE.FOLLOWER);
  if(followers.length===0){
    log(s.noLeader,'error'); return;
  }
  // If there's a leader, demote first
  if(leaderId>=0 && nodes[leaderId].state===STATE.LEADER){
    nodes[leaderId].state=STATE.FOLLOWER;
  }

  term++;
  const candidate = followers[Math.floor(Math.random()*followers.length)];
  candidate.state = STATE.CANDIDATE;
  candidate.votes = 1; // votes for self
  candidate.pulseAlpha = 1;
  updateNodeStatusBar();
  log(`${s.electionStarted} ${term}`,'info');
  addRaftLog(`Election started by ${candidate.name}`,  'vote');
  playSound('click');

  // Request votes from alive nodes in same partition
  const alive = getAliveNodes(candidate.partition).filter(n=>n.id!==candidate.id);
  for(const voter of alive){
    sendAnimMessage(candidate, voter, 'ReqVote', '#fbbf24');
    await delay(300);
    voter.pulseAlpha = 1;
    candidate.votes++;
    addRaftLog(`${voter.name} voted for ${candidate.name}`, 'vote');
    log(`${s.voteGranted} ${voter.name}`,'tx');
    sendAnimMessage(voter, candidate, 'Vote', '#22d3ee');
    await delay(200);
  }

  // Check majority
  const total = getAliveNodes(candidate.partition).length;
  if(candidate.votes > total/2){
    candidate.state = STATE.LEADER;
    leaderId = candidate.id;
    updateNodeStatusBar();
    addRaftLog(`${candidate.name} elected Leader (${candidate.votes}/${total} votes)`, 'leader');
    log(`${s.leaderElected} ${candidate.name} — Term ${term}`,'success');
    playSound('success');
    setStatus(true);
    startHeartbeats();
  } else {
    candidate.state = STATE.FOLLOWER;
    updateNodeStatusBar();
    log('Election failed — no majority','error');
  }
}

function startHeartbeats(){
  if(heartbeatInterval) clearInterval(heartbeatInterval);
  heartbeatInterval = setInterval(()=>{
    if(leaderId<0||nodes[leaderId].state!==STATE.LEADER) {
      clearInterval(heartbeatInterval); return;
    }
    const leader = nodes[leaderId];
    const followers = getAliveNodes(leader.partition).filter(n=>n.id!==leader.id);
    followers.forEach(f=>{
      sendAnimMessage(leader, f, 'HB', 'rgba(34,197,94,0.7)');
      f.hbAlpha = 1;
    });
  }, 2000);
}

async function replicateLog(){
  const s = LANG[currentLang];
  if(leaderId<0||nodes[leaderId].state!==STATE.LEADER){
    log(s.noLeader,'error'); return;
  }
  const leader = nodes[leaderId];
  logEntryCounter++;
  const entry = `cmd-${logEntryCounter}`;
  leader.logCount++;
  addRaftLog(`Leader ${leader.name} appends "${entry}"`, 'commit');
  log(`📋 Leader appends "${entry}"`,'info');
  playSound('click');

  const followers = getAliveNodes(leader.partition).filter(n=>n.id!==leader.id);
  let acks = 1;
  for(const f of followers){
    sendAnimMessage(leader, f, entry, '#c084fc');
    await delay(400);
    f.logCount++;
    acks++;
    sendAnimMessage(f, leader, 'ACK', '#86efac');
    addRaftLog(`${f.name} replicated "${entry}"`, 'commit');
    log(`${s.logReplicated} ${f.name}`,'tx');
    await delay(200);
  }

  const total = getAliveNodes(leader.partition).length;
  if(acks > total/2){
    addRaftLog(`"${entry}" committed (${acks}/${total})`, 'leader');
    log(`${s.committed} (${acks}/${total})`,'success');
    playSound('success');
  }
  updateNodeStatusBar();
}

function crashNode(){
  const s = LANG[currentLang];
  const alive = nodes.filter(n=>n.state!==STATE.CRASHED);
  if(alive.length<=1){ log('Cannot crash — only 1 node left','error'); return; }

  // Prefer crashing leader for more interesting behavior
  let target;
  if(leaderId>=0 && nodes[leaderId].state===STATE.LEADER && Math.random()<0.6){
    target = nodes[leaderId];
  } else {
    const nonLeader = alive.filter(n=>n.state!==STATE.LEADER);
    target = nonLeader.length>0 ? nonLeader[Math.floor(Math.random()*nonLeader.length)] : alive[0];
  }

  const wasLeader = target.state===STATE.LEADER;
  target.state = STATE.CRASHED;
  if(wasLeader){ leaderId = -1; clearInterval(heartbeatInterval); setStatus(false); }
  target.pulseAlpha = 1;
  updateNodeStatusBar();
  addRaftLog(`${target.name} CRASHED!${wasLeader?' (was Leader)':''}`, 'crash');
  log(`${s.nodeCrashed} ${target.name}${wasLeader?' (Leader)':''}`,'error');
  playSound('error');

  // Auto-elect if leader crashed
  if(wasLeader){
    setTimeout(()=>triggerElection(), 1500);
  }
}

function healNode(){
  const s = LANG[currentLang];
  const crashed = nodes.filter(n=>n.state===STATE.CRASHED);
  if(crashed.length===0){ log('No crashed nodes to heal','info'); return; }
  const target = crashed[Math.floor(Math.random()*crashed.length)];
  target.state = STATE.FOLLOWER;
  target.pulseAlpha = 1;
  updateNodeStatusBar();
  addRaftLog(`${target.name} healed and rejoined`, 'leader');
  log(`${s.nodeHealed} ${target.name}`,'success');
  playSound('success');
}

function toggleSplitBrain(){
  const s = LANG[currentLang];
  splitBrainMode = !splitBrainMode;
  if(splitBrainMode){
    // Partition: first 2 nodes vs last 3
    nodes.forEach((n,i)=> n.partition = i<2 ? 0 : 1);
    if(leaderId>=0 && nodes[leaderId].partition===0){
      // Leader in minority — loses authority
      nodes[leaderId].state = STATE.FOLLOWER;
      leaderId = -1;
      clearInterval(heartbeatInterval);
      setStatus(false);
    }
    addRaftLog('Network partitioned — split brain!', 'crash');
    log(s.splitBrainActive,'error');
    playSound('error');
  } else {
    nodes.forEach(n=> n.partition=0);
    addRaftLog('Partition healed', 'leader');
    log(s.splitBrainHealed,'success');
    playSound('success');
  }
  updateNodeStatusBar();
}

function delay(ms){ return new Promise(r=>setTimeout(r,ms)); }

function initCanvas(){
  canvas = $('clusterCanvas');
  if(!canvas) return;
  ctx = canvas.getContext('2d');
  function resize(){
    canvas.width = canvas.clientWidth * (window.devicePixelRatio||1);
    canvas.height = 320 * (window.devicePixelRatio||1);
    ctx.scale(window.devicePixelRatio||1, window.devicePixelRatio||1);
    layoutNodes(canvas.clientWidth, 320);
  }
  resize();
  window.addEventListener('resize', resize);
  drawCanvas();
}

/* ═══════ INIT ═══════ */

function init(){
  initSplash();
  const lw = $('logoWrap');
  if(lw) lw.innerHTML = LOGO_SVG;

  initHelpTabs();
  initLogFilters();
  initLogResize();
  initHijriDate();
  initKonami();

  // Panels
  $('helpBtn').addEventListener('click', openHelp);
  $('helpCloseBtn').addEventListener('click', closeHelp);
  $('helpOverlay').addEventListener('click', closeHelp);
  $('settingsBtn').addEventListener('click', openSettings);
  $('settingsCloseBtn').addEventListener('click', closeSettings);
  $('settingsOverlay').addEventListener('click', closeSettings);
  $('logBtn').addEventListener('click', toggleLog);
  $('logCloseBtn').addEventListener('click', closeLog);
  $('clearLogBtn').addEventListener('click', clearLog);
  $('copyLogBtn').addEventListener('click', copyLog);
  $('exportLogBtn').addEventListener('click', exportLog);

  // Sound
  const st=$('soundToggle');
  if(st) st.addEventListener('change',()=>{soundEnabled=st.checked;playSound('click');});

  // Breathing
  const bb=$('breathingBtn');
  if(bb) bb.addEventListener('click',()=>{toggleBreathing();const dd=$('dhikrDisplay');if(dd)dd.style.display=breathingActive?'flex':'none';});
  const db=$('dhikrBtn');
  if(db) db.addEventListener('click',incrementDhikr);

  document.addEventListener('keydown', e=>{
    if(e.key==='Escape') closeAllPanels();
  });

  const langSel=$('langSelect');
  if(langSel) langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');
  if(themeSel) themeSel.addEventListener('change',()=>setTheme(themeSel.value));

  try{
    const sl=localStorage.getItem('wdiy-lang');
    const st2=localStorage.getItem('wdiy-theme');
    if(st2) setTheme(st2);
    if(sl) setLanguage(sl);
  }catch{}

  // Init Raft simulation
  initNodes();
  initCanvas();
  updateNodeStatusBar();

  // Button handlers
  $('electionBtn').addEventListener('click', triggerElection);
  $('replicateBtn').addEventListener('click', replicateLog);
  $('crashBtn').addEventListener('click', crashNode);
  $('healBtn').addEventListener('click', healNode);
  $('splitBrainBtn').addEventListener('click', toggleSplitBrain);

  setStatus(false);
  log(LANG[currentLang].ready,'success');
}

document.readyState==='loading'
  ? document.addEventListener('DOMContentLoaded', init)
  : init();


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
