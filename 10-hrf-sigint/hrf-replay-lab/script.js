/**
 * Replay Lab — Capture & Replay
 * Workshop DIY — v1.2
 * Learn why rolling codes defeat replay attacks
 */
const $ = id => document.getElementById(id);
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3V160.8c0-4.2.1-7.8.1-7.9zM208.4,151.3h-6.5v3.2h6.5v-3.2zm-13,16.2h-3.2V151.3h3.2v16.2zm19.5,0h-3.2V151.3h3.2v16.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8V164.1l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9V152.7h-3.9v-4.7h14.5z"/></svg>`;
const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.2';

let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.connect(gain);gain.connect(audioCtx.destination);gain.gain.value=0.08;const t=audioCtx.currentTime;switch(type){case'click':osc.frequency.value=800;gain.gain.exponentialRampToValueAtTime(0.001,t+0.08);osc.start(t);osc.stop(t+0.08);break;case'success':osc.frequency.value=523;gain.gain.exponentialRampToValueAtTime(0.001,t+0.3);osc.start(t);osc.stop(t+0.3);break;case'error':osc.frequency.value=200;osc.type='square';gain.gain.exponentialRampToValueAtTime(0.001,t+0.25);osc.start(t);osc.stop(t+0.25);break;}}

// ── Shared i18n keys (template) ──
const LANG_BASE = {
  en: {
    copied:'Copied!',
    demoNext:'Next',
    demoPause:'Pause',
    demoPlay:'Play',
    demoPrev:'Prev',
    learnAge:'Ages:',
    learnLevel:'Level:',
    learnTime:'Time:',
    logCleared:'Log cleared',
    sectionCode:'Device Code',
    sectionDemo:'Watch Demo',
    sectionLearn:'What You Shall Learn',
    splashHint:'tap to skip'
  },
  fr: {
    copied:'Copié !',
    demoNext:'Suiv',
    demoPause:'Pause',
    demoPlay:'Jouer',
    demoPrev:'Préc',
    learnAge:'Âge :',
    learnLevel:'Niveau :',
    learnTime:'Durée :',
    logCleared:'Journal effacé',
    sectionCode:'Code Appareil',
    sectionDemo:'Voir la Démo',
    sectionLearn:'Ce que tu vas apprendre',
    splashHint:'appuyer pour passer'
  },
  ar: {
    copied:'تم النسخ!',
    demoNext:'التالي',
    demoPause:'إيقاف',
    demoPlay:'تشغيل',
    demoPrev:'السابق',
    learnAge:'العمر:',
    learnLevel:'المستوى:',
    learnTime:'المدة:',
    logCleared:'تم مسح السجل',
    sectionCode:'كود الجهاز',
    sectionDemo:'شاهد العرض',
    sectionLearn:'ماذا ستتعلم',
    splashHint:'انقر للتخطي'
  }
};

const LANG={
  en:{
    ...LANG_BASE.en,title:'Replay Lab',subtitle:'Replay Lab \u2014 Capture & Replay',disconnected:'Idle',connected:'Active',mainSection:'Replay Lab',mainDesc:'Learn why rolling codes defeat replays',sectionA:'Attack Log',sectionB:'How Replay Attacks Work',sectionC:'Security Concepts',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',theme:'Theme',settings:'\u2699\uFE0F Settings',language:'Language',help:'\u2753 Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Click Transmit to send a keyfob signal.',howto_2:'Click Capture to record it.',howto_3:'Click Replay to retransmit.',howto_4:'Toggle Rolling Code and try again.',wiki_replay_title:'Replay Attacks',wiki_replay:'Attacker records a valid transmission and replays it later.',wiki_rolling_title:'Rolling Codes',wiki_rolling:'KeeLoq and similar use synchronized counters.',working:'Working\u2026',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',ready:'\uD83D\uDE80 Replay Lab ready!',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',filterAll:'All',soundEffects:'Sound effects',breathingGuide:'Breathing guide',dhikrTap:'Tap',splashHint:'tap to skip',langChanged:'\uD83C\uDF10 Language \u2192 English',themeChanged:'\uD83C\uDFA8 Theme \u2192',transmit:'Transmit',captureSignal:'Capture',replay:'Replay',rollingCode:'Rolling Code',currentCode:'Current Code',capturedCode:'Captured Code',codeCompare:'Code Comparison',doorLocked:'Door Locked',doorOpen:'Door OPEN!',doorBlocked:'REJECTED - Code Expired',attackHint:'Try capturing and replaying with rolling codes on and off.',guideTitle:'How Replay Attacks Work',guideP1:'A replay attack captures a legitimate wireless signal (like a garage door opener or car keyfob) and retransmits it later.',guideP2:'With fixed codes, the same code works every time \u2014 making replay trivial.',guideP3:'Rolling codes use a synchronized counter. Each press generates a unique code, and the receiver only accepts codes newer than the last seen.',dbTitle:'Security Concepts',step1Title:'Configure RF',step1Desc:'Set the frequency band, modulation type, and signal parameters.',step2Title:'Capture Spectrum',step2Desc:'Scan the radio spectrum to detect and capture signals of interest.',step3Title:'Analyze Signal',step3Desc:'Apply signal processing to identify modulation, encoding, and source.',step4Title:'Classify & Report',step4Desc:'Categorize the signal type and log detailed analysis results.',sectionCode:'Device Code',faq_q1:'What does this app do?',faq_a1:'It simulates RF signals! 🔬 You get to experiment with radio frequency patterns in a safe sandbox.',faq_q2:'How does it work?',faq_a2:'The simulation runs in your browser. It models real radio frequency patterns so you can see what happens step by step.',faq_q3:'What should I try first?',faq_a3:'Press the main button and watch! 🎯 Then tweak the settings to see how different parameters change the results.',faq_q4:'What\'s the real science?',faq_a4:'This is real signal intelligence! The same principles are used by professionals in the field. 🧪',faq_q5:'Can I break it?',faq_a5:'Try the Lab section! Push the parameters to extremes and see what happens. That\'s how scientists discover new things! 💡',faq_q6:'What hardware do I need?',faq_a6:'For the real version, you\'ll need RTL-SDR or HackRF. Check the 📦 Device Code section for ready-to-use firmware!',faq_q7:'Is it safe to use?',faq_a7:'Absolutely safe! 🛡️ Everything runs locally in your browser. No internet required, no data leaves your device.',faq_q8:'What should I try next?',faq_a8:'Try Hrf Signal Zoo and Hrf Aircraft Radar! Each teaches something different. 🚀',demo_s1:'Welcome! Let\'s explore this simulation together. Look at the main section above. 🔬',demo_s2:'Click the primary action button to start. Watch the visualization respond in real time! ⚡',demo_s3:'Now change a setting — try a slider or dropdown. See how the output changes? 🔄',demo_s4:'Check the results — the graphs and numbers show what\'s happening under the hood. 📊',demo_s5:'Awesome! 🎉 You\'ve got the basics. Try the Lab section below for deeper experiments!',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',learnAge:'Ages:'},
  fr:{title:'Labo Replay',subtitle:'Labo Replay \u2014 Capture et Rejeu',disconnected:'En attente',connected:'Actif',mainSection:'Labo Replay',mainDesc:'Pourquoi les codes tournants bloquent le rejeu',sectionA:'Journal d\'Attaque',sectionB:'Comment fonctionne le Rejeu',sectionC:'Concepts de S\u00e9curit\u00e9',activityLog:'Journal',eventsMsg:'\u00c9v\u00e9nements',clear:'Effacer',copy:'Copier',export:'Exporter',theme:'Th\u00e8me',settings:'\u2699\uFE0F Param\u00e8tres',language:'Langue',help:'\u2753 Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Cliquez Transmettre.',howto_2:'Cliquez Capturer.',howto_3:'Cliquez Rejouer.',howto_4:'Activez Code Tournant.',wiki_replay_title:'Attaque par Rejeu',wiki_replay:'L\'attaquant enregistre et rejoue.',wiki_rolling_title:'Codes Tournants',wiki_rolling:'Compteurs synchronis\u00e9s.',working:'En cours\u2026',t_mosque:'Mosqu\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',ready:'\uD83D\uDE80 Labo Replay pr\u00eat !',logCleared:'Effac\u00e9',copied:'Copi\u00e9 !',copyFail:'\u00c9chec',filterAll:'Tout',soundEffects:'Effets sonores',breathingGuide:'Guide respiratoire',dhikrTap:'Tap',splashHint:'appuyer pour passer',langChanged:'\uD83C\uDF10 Langue \u2192 Fran\u00e7ais',themeChanged:'\uD83C\uDFA8 Th\u00e8me \u2192',transmit:'Transmettre',captureSignal:'Capturer',replay:'Rejouer',rollingCode:'Code Tournant',currentCode:'Code Actuel',capturedCode:'Code Captur\u00e9',codeCompare:'Comparaison',doorLocked:'Porte Verrouill\u00e9e',doorOpen:'Porte OUVERTE !',doorBlocked:'REJET\u00c9 - Code Expir\u00e9',attackHint:'Essayez avec et sans codes tournants.',guideTitle:'Comment fonctionne le Rejeu',guideP1:'Le rejeu capture un signal l\u00e9gitime et le retransmet.',guideP2:'Avec codes fixes, le m\u00eame code marche toujours.',guideP3:'Les codes tournants utilisent un compteur synchronis\u00e9.',dbTitle:'Concepts de S\u00e9curit\u00e9',step1Title:'Configurer RF',step1Desc:'Règle la bande de fréquence, le type de modulation et les paramètres.',step2Title:'Capturer le spectre',step2Desc:'Scanne le spectre radio pour détecter et capturer les signaux.',step3Title:'Analyser le signal',step3Desc:'Applique le traitement du signal pour identifier la modulation et la source.',step4Title:'Classifier et rapporter',step4Desc:'Catégorise le type de signal et enregistre les résultats.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule RF signals ! 🔬 Tu peux expérimenter avec radio frequency patterns en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais radio frequency patterns.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai signal intelligence ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut RTL-SDR or HackRF. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Hrf Signal Zoo and Hrf Aircraft Radar ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',learnAge:'Âge :'},
  ar:{title:'\u0645\u062E\u062A\u0628\u0631 \u0627\u0644\u0625\u0639\u0627\u062F\u0629',subtitle:'\u0645\u062E\u062A\u0628\u0631 \u0627\u0644\u0625\u0639\u0627\u062F\u0629 \u2014 \u0627\u0644\u062A\u0642\u0627\u0637 \u0648\u0625\u0639\u0627\u062F\u0629',disconnected:'\u062E\u0627\u0645\u0644',connected:'\u0646\u0634\u0637',mainSection:'\u0645\u062E\u062A\u0628\u0631 \u0627\u0644\u0625\u0639\u0627\u062F\u0629',mainDesc:'\u0644\u0645\u0627\u0630\u0627 \u0627\u0644\u0631\u0645\u0648\u0632 \u0627\u0644\u0645\u062A\u063A\u064A\u0631\u0629 \u062A\u0647\u0632\u0645 \u0627\u0644\u0625\u0639\u0627\u062F\u0629',sectionA:'\u0633\u062C\u0644 \u0627\u0644\u0647\u062C\u0645\u0627\u062A',sectionB:'\u0643\u064A\u0641 \u062A\u0639\u0645\u0644 \u0647\u062C\u0645\u0627\u062A \u0627\u0644\u0625\u0639\u0627\u062F\u0629',sectionC:'\u0645\u0641\u0627\u0647\u064A\u0645 \u0623\u0645\u0646\u064A\u0629',activityLog:'\u0633\u062C\u0644',eventsMsg:'\u0627\u0644\u0623\u062D\u062F\u0627\u062B',clear:'\u0645\u0633\u062D',copy:'\u0646\u0633\u062E',export:'\u062A\u0635\u062F\u064A\u0631',theme:'\u0627\u0644\u0645\u0638\u0647\u0631',settings:'\u2699\uFE0F \u0625\u0639\u062F\u0627\u062F\u0627\u062A',language:'\u0627\u0644\u0644\u063A\u0629',help:'\u2753 \u0645\u0633\u0627\u0639\u062F\u0629',faq:'\u0623\u0633\u0626\u0644\u0629',howto:'\u0643\u064A\u0641',wiki:'\u0648\u064A\u0643\u064A',howto_1:'\u0627\u0646\u0642\u0631 \u0625\u0631\u0633\u0627\u0644.',howto_2:'\u0627\u0646\u0642\u0631 \u0627\u0644\u062A\u0642\u0627\u0637.',howto_3:'\u0627\u0646\u0642\u0631 \u0625\u0639\u0627\u062F\u0629.',howto_4:'\u0641\u0639\u0651\u0644 \u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u0645\u062A\u063A\u064A\u0631.',wiki_replay_title:'\u0647\u062C\u0645\u0627\u062A \u0627\u0644\u0625\u0639\u0627\u062F\u0629',wiki_replay:'\u064A\u0633\u062C\u0644 \u0627\u0644\u0645\u0647\u0627\u062C\u0645 \u0625\u0634\u0627\u0631\u0629 \u0648\u064A\u0639\u064A\u062F\u0647\u0627.',wiki_rolling_title:'\u0627\u0644\u0631\u0645\u0648\u0632 \u0627\u0644\u0645\u062A\u063A\u064A\u0631\u0629',wiki_rolling:'\u0639\u062F\u0627\u062F\u0627\u062A \u0645\u062A\u0632\u0627\u0645\u0646\u0629.',working:'\u062C\u0627\u0631\u064D\u2026',t_mosque:'\u0645\u0633\u062C\u062F',t_zellige:'\u0632\u0644\u064A\u062C',t_andalus:'\u0623\u0646\u062F\u0644\u0633',t_riad:'\u0631\u064A\u0627\u0636',t_medina:'\u0645\u062F\u064A\u0646\u0629',t_space:'\u0641\u0636\u0627\u0621',t_jungle:'\u0623\u062F\u063A\u0627\u0644',t_robot:'\u0631\u0648\u0628\u0648\u062A',ready:'\uD83D\uDE80 \u0645\u062E\u062A\u0628\u0631 \u0627\u0644\u0625\u0639\u0627\u062F\u0629 \u062C\u0627\u0647\u0632!',logCleared:'\u062A\u0645 \u0627\u0644\u0645\u0633\u062D',copied:'\u062A\u0645!',copyFail:'\u0641\u0634\u0644',filterAll:'\u0627\u0644\u0643\u0644',soundEffects:'\u0645\u0624\u062B\u0631\u0627\u062A',breathingGuide:'\u062F\u0644\u064A\u0644 \u0627\u0644\u062A\u0646\u0641\u0633',dhikrTap:'\u0627\u0636\u063A\u0637',splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u062E\u0637\u064A',langChanged:'\uD83C\uDF10 \u0627\u0644\u0644\u063A\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064A\u0629',themeChanged:'\uD83C\uDFA8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',transmit:'\u0625\u0631\u0633\u0627\u0644',captureSignal:'\u0627\u0644\u062A\u0642\u0627\u0637',replay:'\u0625\u0639\u0627\u062F\u0629',rollingCode:'\u0631\u0645\u0632 \u0645\u062A\u063A\u064A\u0631',currentCode:'\u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u062D\u0627\u0644\u064A',capturedCode:'\u0627\u0644\u0631\u0645\u0632 \u0627\u0644\u0645\u0644\u062A\u0642\u0637',codeCompare:'\u0645\u0642\u0627\u0631\u0646\u0629',doorLocked:'\u0627\u0644\u0628\u0627\u0628 \u0645\u063A\u0644\u0642',doorOpen:'\u0627\u0644\u0628\u0627\u0628 \u0645\u0641\u062A\u0648\u062D!',doorBlocked:'\u0645\u0631\u0641\u0648\u0636 - \u0631\u0645\u0632 \u0645\u0646\u062A\u0647\u064A',attackHint:'\u062C\u0631\u0628 \u0645\u0639 \u0648\u0628\u062F\u0648\u0646 \u0631\u0645\u0648\u0632 \u0645\u062A\u063A\u064A\u0631\u0629.',guideTitle:'\u0643\u064A\u0641 \u062A\u0639\u0645\u0644 \u0647\u062C\u0645\u0627\u062A \u0627\u0644\u0625\u0639\u0627\u062F\u0629',guideP1:'\u0627\u0644\u062A\u0642\u0627\u0637 \u0625\u0634\u0627\u0631\u0629 \u0634\u0631\u0639\u064A\u0629 \u0648\u0625\u0639\u0627\u062F\u0629 \u0625\u0631\u0633\u0627\u0644\u0647\u0627.',guideP2:'\u0645\u0639 \u0627\u0644\u0631\u0645\u0648\u0632 \u0627\u0644\u062B\u0627\u0628\u062A\u0629 \u0627\u0644\u0625\u0639\u0627\u062F\u0629 \u0646\u0627\u062C\u062D\u0629.',guideP3:'\u0627\u0644\u0631\u0645\u0648\u0632 \u0627\u0644\u0645\u062A\u063A\u064A\u0631\u0629 \u062A\u0633\u062A\u062E\u062F\u0645 \u0639\u062F\u0627\u062F\u064B\u0627 \u0645\u062A\u0632\u0627\u0645\u0646\u064B\u0627.',dbTitle:'\u0645\u0641\u0627\u0647\u064A\u0645 \u0623\u0645\u0646\u064A\u0629',step1Title:'تكوين RF',step1Desc:'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.',step2Title:'التقاط الطيف',step2Desc:'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.',step3Title:'تحليل الإشارة',step3Desc:'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.',step4Title:'تصنيف والتقرير',step4Desc:'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي RF signals! 🔬 يمكنك التجربة مع radio frequency patterns في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج radio frequency patterns حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا signal intelligence حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج RTL-SDR or HackRF. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Hrf Signal Zoo and Hrf Aircraft Radar! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',learnAge:'العمر:'}
};

let currentLang='en';
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(opt=>{const k=opt.dataset.i18nOpt;if(s[k]!=null)opt.textContent=s[k];});document.title=`${s.title} \u2014 Workshop DIY`;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');buildGuide();buildDatabase();}
const THEME_MELODIES={'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],'riad':[349,440,523],'medina':[294,349,440]};
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}const s=LANG[currentLang];log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');}

let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className=`log-line ${type}`;d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}
let toastTimer=null;function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}
function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(rid);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),contents=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));contents.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const tid='help'+n.charAt(0).toUpperCase()+n.slice(1);const tgt=$(tid);if(tgt)tgt.classList.add('active');});});}
function initLogResize(){const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;let dragging=false,startX,startW;handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;document.body.style.cursor='col-resize';e.preventDefault();});document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=startX-e.clientX;const nw=Math.max(200,Math.min(startW+dx,window.innerWidth*0.6));document.documentElement.style.setProperty('--log-width',nw+'px');});document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;document.body.style.cursor='';});}
let breathingActive=false,dhikrCount=0;function toggleBreathing(){const bands=document.querySelectorAll('.deco-band');breathingActive=!breathingActive;bands.forEach(b=>b.classList.toggle('breathing',breathingActive));}function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

/* ═══════════════════════════════════════════════════════════════
   APP-SPECIFIC: REPLAY LAB
   ═══════════════════════════════════════════════════════════════ */

const FIXED_CODE = 'A7F3B2C9';
let rollingCounter = 1;
let currentCode = FIXED_CODE;
let capturedCode = null;
let lastTransmittedCode = null;
let receiverExpects = 1;
let wfCanvas, wfCtx, wfW=780, wfH=160;
let attacks = [];

function genRollingCode(n) {
  const hex = ((n * 0x5DEECE66D + 0xB) & 0xFFFFFFFF).toString(16).toUpperCase().padStart(8, '0');
  return hex.slice(0, 8);
}

function isRolling() { return $('rollingToggle')?.checked || false; }

function drawWaveform(code, color) {
  if (!wfCtx) return;
  wfCtx.fillStyle = '#000';
  wfCtx.fillRect(0, 0, wfW, wfH);
  if (!code) return;

  // Grid
  wfCtx.strokeStyle = 'rgba(255,255,255,0.05)';
  for (let x = 0; x < wfW; x += 50) { wfCtx.beginPath(); wfCtx.moveTo(x, 0); wfCtx.lineTo(x, wfH); wfCtx.stroke(); }

  // Encode code as OOK waveform
  const bits = code.split('').map(c => parseInt(c, 16)).flatMap(n => [(n>>3)&1,(n>>2)&1,(n>>1)&1,n&1]);
  const bitW = wfW / bits.length;

  wfCtx.beginPath();
  wfCtx.strokeStyle = color || '#22c55e';
  wfCtx.lineWidth = 2;
  bits.forEach((b, i) => {
    const x = i * bitW;
    const y = b ? wfH * 0.2 : wfH * 0.8;
    if (i === 0) wfCtx.moveTo(x, y);
    else { wfCtx.lineTo(x, y); }
    wfCtx.lineTo(x + bitW, y);
  });
  wfCtx.stroke();

  // Preamble label
  wfCtx.fillStyle = 'rgba(255,255,255,0.4)';
  wfCtx.font = '10px monospace';
  wfCtx.fillText('Code: ' + code, 10, wfH - 8);
  wfCtx.fillText(isRolling() ? 'ROLLING CODE' : 'FIXED CODE', wfW - 120, wfH - 8);
}

function setDoor(state) {
  const icon = $('doorIcon'), status = $('doorStatus');
  const s = LANG[currentLang];
  if (state === 'open') {
    if (icon) icon.textContent = '\uD83D\uDEAA'; // open door
    if (status) { status.textContent = s.doorOpen; status.style.color = '#22c55e'; }
    icon.style.filter = 'hue-rotate(90deg)';
  } else if (state === 'blocked') {
    if (icon) icon.textContent = '\uD83D\uDD12';
    if (status) { status.textContent = s.doorBlocked; status.style.color = '#ef4444'; }
    icon.style.filter = '';
  } else {
    if (icon) icon.textContent = '\uD83D\uDEAA';
    if (status) { status.textContent = s.doorLocked; status.style.color = 'var(--text-muted)'; }
    icon.style.filter = '';
  }
}

function doTransmit() {
  if (isRolling()) {
    rollingCounter++;
    currentCode = genRollingCode(rollingCounter);
    receiverExpects = rollingCounter;
  } else {
    currentCode = FIXED_CODE;
  }
  lastTransmittedCode = currentCode;
  $('currentCodeDisplay').textContent = currentCode;
  drawWaveform(currentCode, '#22c55e');
  setDoor('open');
  log(`TX: ${currentCode} ${isRolling() ? '[Rolling #' + rollingCounter + ']' : '[Fixed]'}`, 'tx');
  addAttack('TX', currentCode, true);
  setTimeout(() => setDoor('locked'), 2000);
}

function doCapture() {
  if (!lastTransmittedCode) { log('Nothing to capture. Transmit first.', 'error'); return; }
  capturedCode = lastTransmittedCode;
  $('capturedCodeDisplay').textContent = capturedCode;
  drawWaveform(capturedCode, '#f59e0b');
  log(`Captured: ${capturedCode}`, 'rx');
  addAttack('CAPTURE', capturedCode, null);
  updateCompare();
}

function doReplay() {
  if (!capturedCode) { log('Nothing to replay. Capture first.', 'error'); return; }
  drawWaveform(capturedCode, '#ef4444');
  $('currentCodeDisplay').textContent = capturedCode;

  if (isRolling()) {
    // Rolling: captured code is old, receiver expects newer
    const capturedNum = rollingCounter; // This is already past
    if (capturedCode !== genRollingCode(receiverExpects)) {
      setDoor('blocked');
      log(`REPLAY FAILED: ${capturedCode} (expected rolling code #${receiverExpects})`, 'error');
      addAttack('REPLAY', capturedCode, false);
    } else {
      setDoor('open');
      log(`REPLAY SUCCESS: ${capturedCode}`, 'success');
      addAttack('REPLAY', capturedCode, true);
      setTimeout(() => setDoor('locked'), 2000);
    }
  } else {
    // Fixed: replay always works
    setDoor('open');
    log(`REPLAY SUCCESS: ${capturedCode} (fixed code always works!)`, 'success');
    addAttack('REPLAY', capturedCode, true);
    setTimeout(() => setDoor('locked'), 2000);
  }
  updateCompare();
}

function updateCompare() {
  const el = $('codeCompare');
  if (!el) return;
  const expected = isRolling() ? genRollingCode(receiverExpects) : FIXED_CODE;
  el.innerHTML = `Captured:  <span style="color:#f59e0b;">${capturedCode || '--------'}</span><br>` +
    `Expected:  <span style="color:#22c55e;">${expected}</span><br>` +
    `Match:     <span style="color:${capturedCode === expected ? '#22c55e' : '#ef4444'};">${capturedCode === expected ? 'YES' : 'NO'}</span><br>` +
    `Mode:      ${isRolling() ? 'Rolling Code (counter: #' + receiverExpects + ')' : 'Fixed Code'}`;
}

function addAttack(type, code, success) {
  attacks.unshift({ type, code, success, time: new Date().toLocaleTimeString(), rolling: isRolling() });
  const el = $('attackLog');
  if (!el) return;
  el.innerHTML = '';
  attacks.slice(0, 20).forEach(a => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:8px;padding:4px 8px;border-radius:8px;background:rgba(0,0,0,.2);border:1px solid var(--border);';
    const icon = a.success === true ? '<span style="color:#22c55e;">&#x2713;</span>' : a.success === false ? '<span style="color:#ef4444;">&#x2717;</span>' : '<span style="color:#f59e0b;">&#x25CF;</span>';
    row.innerHTML = `${icon}<span style="font-size:.75rem;color:var(--accent);min-width:55px;">${a.type}</span><span style="flex:1;font-size:.72rem;font-family:monospace;">${a.code}</span><span style="font-size:.65rem;color:var(--text-muted);">${a.rolling ? 'Rolling' : 'Fixed'}</span><span style="font-size:.6rem;color:var(--text-muted);">${a.time}</span>`;
    el.appendChild(row);
  });
}

function buildGuide() {
  const el=$('replayGuide');if(!el)return;const s=LANG[currentLang];
  el.innerHTML=`<strong>${s.guideTitle}</strong><br><br>${s.guideP1}<br><br>${s.guideP2}<br><br>${s.guideP3}`;
}
function buildDatabase() {
  const el=$('securityDB');if(!el)return;const s=LANG[currentLang];
  const concepts=[{name:'Fixed Code',desc:'Same code every time. Vulnerable to simple replay.'},{name:'Rolling Code (KeeLoq)',desc:'Counter-based. Each code used once. Receiver rejects old codes.'},{name:'Challenge-Response',desc:'Receiver sends random challenge, transmitter must compute correct response.'},{name:'Timestamp-Based',desc:'Code includes current time. Receiver rejects codes outside time window.'},{name:'Relay Attack',desc:'Real-time forwarding of signals between locations. Rolling codes do not prevent this.'},{name:'RollJam',desc:'Advanced attack: jam + capture two codes. First code used later.'}];
  let html=`<strong>${s.dbTitle}</strong><br><br><div style="display:grid;grid-template-columns:1fr 2fr;gap:4px 8px;"><strong style="font-size:.7rem;">Concept</strong><strong style="font-size:.7rem;">Description</strong>`;
  concepts.forEach(c=>{html+=`<span style="color:var(--accent);">${c.name}</span><span style="color:var(--text-muted);">${c.desc}</span>`;});
  html+='</div>';el.innerHTML=html;
}

function init(){
  initSplash();const lw=$('logoWrap');if(lw)lw.innerHTML=LOGO_SVG;
  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');if(cb)cb.onclick=clearLog;if(cpb)cpb.onclick=copyLog;if(exb)exb.onclick=exportLog;initLogFilters();
  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');if(hBtn)hBtn.onclick=openHelp;if(hClose)hClose.onclick=closeHelp;if(hOv)hOv.onclick=closeHelp;initHelpTabs();
  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');if(sBtn)sBtn.onclick=openSettings;if(sClose)sClose.onclick=closeSettings;if(sOv)sOv.onclick=closeSettings;
  const lBtn=$('logBtn'),lClose=$('logCloseBtn');if(lBtn)lBtn.onclick=toggleLog;if(lClose)lClose.onclick=closeLog;initLogResize();
  const soundTgl=$('soundToggle');if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}
  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});
  const langSel=$('langSelect');if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect');if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}
  initHijriDate();

  wfCanvas=$('waveformCanvas');if(wfCanvas){wfCtx=wfCanvas.getContext('2d');wfW=wfCanvas.width;wfH=wfCanvas.height;}
  $('transmitBtn').onclick=doTransmit;$('captureBtn').onclick=doCapture;$('replayBtn').onclick=doReplay;
  $('rollingToggle').addEventListener('change',()=>{const mode=isRolling()?'Rolling Code':'Fixed Code';log(`Mode: ${mode}`,'info');rollingCounter=1;receiverExpects=1;capturedCode=null;$('capturedCodeDisplay').textContent='--------';updateCompare();});
  buildGuide();buildDatabase();updateCompare();
  log(LANG[currentLang].ready,'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();

/* ═══════════════════════════════════════════════════════════════
   RICH CANVAS SIMULATION — Replay Lab
   Animated RF signal capture/replay visualization + rolling code counter
   ═══════════════════════════════════════════════════════════════ */
(function(){
let cv,cx,W,H,af=null,t=0;
const waves=[];
function boot(){
  let el=document.getElementById('replaySimCanvas');
  if(!el){el=document.createElement('canvas');el.id='replaySimCanvas';el.width=780;el.height=200;
  el.style.cssText='width:100%;border-radius:12px;margin-top:12px;background:#080410;display:block;';
  const h=document.querySelector('.section-card')||document.querySelector('.main-content')||document.body;h.appendChild(el);}
  cv=el;cx=el.getContext('2d');W=el.width;H=el.height;
}
function tick(){
  t+=.016;
  cx.fillStyle='rgba(8,4,16,.12)';cx.fillRect(0,0,W,H);
  const acc=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  // TX antenna on left
  const ax=80,ay=H/2;
  cx.fillStyle=acc;cx.beginPath();cx.moveTo(ax,ay-20);cx.lineTo(ax-8,ay+8);cx.lineTo(ax+8,ay+8);cx.closePath();cx.fill();
  cx.fillRect(ax-1,ay+8,2,12);
  // RX antenna on right
  const rx=W-80,ry=H/2;
  cx.fillStyle='#4fc3f7';cx.beginPath();cx.moveTo(rx,ry-20);cx.lineTo(rx-8,ry+8);cx.lineTo(rx+8,ry+8);cx.closePath();cx.fill();
  cx.fillRect(rx-1,ry+8,2,12);
  // Emit waves from TX
  if(Math.random()<.08)waves.push({x:ax+15,y:ay,r:5,maxR:W*.6,speed:2+Math.random(),life:1,
    color:typeof isRolling==='function'&&isRolling()?'#22c55e':'#f59e0b'});
  for(let i=waves.length-1;i>=0;i--){
    const w=waves[i];w.r+=w.speed;w.life=1-w.r/w.maxR;
    if(w.life<=0){waves.splice(i,1);continue;}
    cx.strokeStyle=w.color.replace(')',`,${w.life*.4})`).replace('#',
      (()=>{const c=w.color;const r=parseInt(c.slice(1,3),16),g=parseInt(c.slice(3,5),16),b=parseInt(c.slice(5,7),16);return `rgba(${r},${g},${b},${w.life*.4})`})()
    );
    cx.strokeStyle=`rgba(${parseInt(w.color.slice(1,3),16)},${parseInt(w.color.slice(3,5),16)},${parseInt(w.color.slice(5,7),16)},${w.life*.35})`;
    cx.lineWidth=1.5;cx.beginPath();cx.arc(w.x,w.y,w.r,-.4,.4);cx.stroke();
  }
  // Rolling code counter display
  const rolling=typeof isRolling==='function'&&isRolling();
  cx.fillStyle='rgba(0,0,0,.5)';cx.fillRect(W/2-80,8,160,28);
  cx.fillStyle=rolling?'#22c55e':'#f59e0b';cx.font='11px Orbitron,monospace';cx.textAlign='center';
  cx.fillText(rolling?'ROLLING CODE':'FIXED CODE',W/2,26);
  // Binary stream background
  cx.fillStyle='rgba(100,200,255,.06)';cx.font='10px monospace';
  for(let i=0;i<20;i++){
    const bx=(i*42+t*30)%W,by=H-15;
    cx.fillText(Math.random()>.5?'1':'0',bx,by);}
  cx.fillStyle='rgba(100,200,255,.3)';cx.font='9px Orbitron,monospace';cx.textAlign='left';
  cx.fillText('RF Signal Propagation Sim',8,H-4);
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

// Service Worker Registration (skip on file://)
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(function(){});
}
