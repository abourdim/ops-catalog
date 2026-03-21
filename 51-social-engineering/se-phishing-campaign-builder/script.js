/**
 * SE-Phishing-Campaign-Builder — Workshop DIY v1.0
 * Canvas-based phishing campaign simulation for security awareness.
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';

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
    ...LANG_BASE.en,title:'Phishing Campaign Builder',subtitle:'Design & analyze phishing attack simulations',disconnected:'Disconnected',connected:'Connected',mainSection:'Phishing Campaign Builder',mainDesc:'Build phishing emails and landing pages to understand attack vectors',sectionA:'How It Works',sectionB:'Challenge',craftBtn:'Craft Email',launchBtn:'Launch Campaign',reportBtn:'Report',tplInvoice:'Fake Invoice Alert',tplReset:'Password Reset',tplUrgent:'Urgent Action Required',tplPrize:'Prize Winner',statSent:'Sent',statOpened:'Opened',statClicked:'Clicked',statHarvested:'Harvested',howStep1:'Attacker crafts a convincing phishing email using social engineering techniques.',howStep2:'The email contains a link to a fake login page mimicking a trusted site.',howStep3:'Victims enter credentials on the fake page, sending data to the attacker.',howStep4:'Harvested credentials are used for unauthorized access or sold on dark web.',challenge1:'What makes a phishing email effective?',challenge2:'How can you identify a phishing email?',challenge3:'Design an anti-phishing training program.',challengeReveal1:'Urgency, authority impersonation, familiar branding, personalized content, and emotional triggers like fear or curiosity.',challengeReveal2:'Check sender domain, hover over links, look for grammar errors, verify urgency claims independently, and check for generic greetings.',challengeReveal3:'Regular simulated phishing tests, immediate feedback on clicks, reporting culture, email gateway filters, and DMARC/SPF/DKIM configuration.',revealBtn:'Reveal Answer',activityLog:'Activity Log',eventsMsg:'Events & messages',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'⚙️ Settings',language:'Language',theme:'Theme',soundEffects:'🔊 Sound effects',help:'❓ Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',howto_1:'Look at the main card at the top. This is your control panel. Set the initial parameters using the sliders and dropdowns. Each one is labeled — hover for a tooltip. Start with the default values to see normal behavior first.',howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',howto_3:'Scroll down to the expandable sections. "How It Works" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',wiki_t1:'🎣 التصيد. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_d1:'هجمات تستخدم اتصالات خادعة لسرقة المعلومات. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_t2:'📧 انتحال البريد. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_d2:'تزوير رؤوس البريد. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_t3:'🛡️ DMARC/SPF/DKIM. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',wiki_d3:'بروتوكولات مصادقة البريد. This concept is fundamental to understanding how the simulation works. Experiment with the controls to see it in action — changing related parameters will show you how different factors interact in the real system.',ready:'🎣 Phishing Campaign Builder ready — select a template!',crafting:'Crafting phishing email template...',crafted:'Phishing email crafted! Click prediction: %n%',launching:'Launching phishing campaign...',launched:'Campaign sent to %n targets. Monitoring clicks...',reporting:'Generating campaign report...',reported:'Report: %o% opened, %c% clicked, %s% submitted credentials',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working...',splashHint:'tap to skip',langChanged:'🌐 Language → English',themeChanged:'🎨 Theme →',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Research Target',step1Desc:'Attacker crafts a convincing phishing email using social engineering techniques.',step2Title:'Build Pretext',step2Desc:'The email contains a link to a fake login page mimicking a trusted site.',step3Title:'Execute Attack',step3Desc:'Victims enter credentials on the fake page, sending data to the attacker.',step4Title:'Analyze & Defend',step4Desc:'Harvested credentials are used for unauthorized access or sold on dark web.',sectionCode:'Device Code',faq_q1:'What is Phishing Campaign Builder?',faq_a1:'Phishing Campaign Builder lets you build phishing emails and landing pages to understand attack vectors. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real social engineering awareness behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Press "Start" to begin. Each button and slider changes a specific parameter — the visualization responds immediately so you can see the effect. Check the How-To tab for a step-by-step guide.',faq_q4:'What is the science behind this?',faq_a4:'This app is based on real social engineering awareness principles used by professionals. The simulation applies the same math and physics — the difference is that here you can safely experiment without expensive equipment.',faq_q5:'What should I experiment with?',faq_a5:'Change one parameter at a time and observe the effect. Try extreme values to find the limits. Then combine changes to see how different factors interact. The challenges section gives you specific experiments to try.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need Mixed. See the Device Code section for wiring diagrams and ready-to-use firmware.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser using JavaScript. No data is sent to any server, no account is needed, and the app works completely offline. Your experiments stay on your device.',faq_q8:'What should I explore next?',faq_a8:'Try Se Baiting Trap Designer and Se Credential Harvester. Each app in this category teaches a different aspect of social engineering awareness.',demo_s1:'Welcome to Phishing Campaign Builder! Look at the main display — this is where the social engineering awareness simulation runs.',demo_s2:'Select a phishing template from the dropdown. Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "How It Works" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of social engineering awareness.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'Psychology',learn1Desc:'How human behavior creates security vulnerabilities. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'Psychology',learn2Title:'Social Manipulation',learn2Desc:'How attackers exploit trust and authority. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'Awareness',learn3Title:'OSINT',learn3Desc:'How public information reveals private details. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Intelligence',learn4Title:'Defense Awareness',learn4Desc:'How to recognize and resist social attacks. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Defense',sectionLearn:'What You Shall Learn',learnLevelVal:'Advanced 🔴',learnLevel:'Level:',learnTimeVal:'30 min ⏱',learnTime:'Time:',learnAgeVal:'14+ 🧒',kidTitle:'For Young Explorers',kidIntro:'This app shows you how social engineering awareness works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches social engineering awareness concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Encrypt & Decode',ch1Desc:'Encrypt a message using the built-in cipher, then try to decode it manually without looking at the key. What patterns can you spot in the ciphertext?',ch2Title:'Stealth Test',ch2Desc:'Try to complete the mission with the lowest possible signal footprint. Can you reduce emissions below the detection threshold?',ch3Title:'Interception Race',ch3Desc:'Start a transmission and see how quickly you can intercept it from the other side. What affects the detection time?',codeTitle:'How This App Works',codeLang:'JavaScript',codeSnippet:'const canvas = document.getElementById("mainCanvas");\\nconst ctx = canvas.getContext("2d");\\n\\nfunction draw() {\\n  ctx.clearRect(0, 0, canvas.width, canvas.height);\\n  // Draw your visualization here\\n  ctx.fillStyle = "#00ff88";\\n  ctx.fillRect(x, y, width, height);\\n  requestAnimationFrame(draw);\\n}\\n\\ndraw();',codeExplain:'Every app uses an HTML5 Canvas for real-time visualization. The draw() function runs ~60 times per second via requestAnimationFrame. It clears the screen, draws the current state, and schedules the next frame. This is the same technique used in games and data dashboards. The simulation logic updates variables that draw() reads to show the current state.',wiki_concept_title:'🔬 What is Phishing Campaign Builder?',wiki_concept:'Phishing Campaign Builder is a technique used in social engineering awareness. Build phishing emails and landing pages to understand attack vectors. In professional settings, this technology requires Mixed and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Attacker crafts a convincing phishing email using social engineering techniques. Second: The email contains a link to a fake login page mimicking a trusted site. The simulation runs these stages in real time, showing you intermediate results at each step. In real social engineering awareness, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'Phishing Campaign Builder has practical applications in social engineering awareness. Professionals use similar techniques with Mixed in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'Phishing Campaign Builder: Build phishing emails and landing pages to understand attack vectors. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Research Target through Build Pretext to Execute Attack and Analyze & Defend.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "How It Works" and "Challenge" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:'},
  fr:{title:'Constructeur de Campagne Phishing',subtitle:'Concevoir et analyser des simulations d\'hameçonnage',disconnected:'Déconnecté',connected:'Connecté',mainSection:'Constructeur de Campagne Phishing',mainDesc:'Créez des emails et pages d\'hameçonnage pour comprendre les vecteurs',sectionA:'Comment ça Marche',sectionB:'Défi',craftBtn:'Créer Email',launchBtn:'Lancer Campagne',reportBtn:'Rapport',tplInvoice:'Alerte Facture',tplReset:'Réinitialisation',tplUrgent:'Action Urgente',tplPrize:'Gagnant du Prix',statSent:'Envoyés',statOpened:'Ouverts',statClicked:'Cliqués',statHarvested:'Récoltés',howStep1:'L\'attaquant crée un email convaincant avec des techniques d\'ingénierie sociale.',howStep2:'L\'email contient un lien vers une fausse page imitant un site de confiance.',howStep3:'Les victimes saisissent leurs identifiants sur la fausse page.',howStep4:'Les identifiants récoltés sont utilisés pour un accès non autorisé.',challenge1:'Qu\'est-ce qui rend un email de phishing efficace?',challenge2:'Comment identifier un email de phishing?',challenge3:'Concevez un programme anti-phishing.',challengeReveal1:'Urgence, usurpation d\'autorité, branding familier et contenu personnalisé.',challengeReveal2:'Vérifiez le domaine, survolez les liens, cherchez les erreurs grammaticales.',challengeReveal3:'Tests simulés réguliers, feedback immédiat, culture du signalement et DMARC/SPF/DKIM.',revealBtn:'Révéler',activityLog:'Journal',eventsMsg:'Événements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'⚙️ Paramètres',language:'Langue',theme:'Thème',soundEffects:'🔊 Effets sonores',help:'❓ Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',howto_1:'Sélectionnez un modèle de phishing.',howto_2:'Cliquez Créer Email pour générer l\'email.',howto_3:'Cliquez Lancer pour simuler l\'envoi.',howto_4:'Cliquez Rapport pour les analyses.',wiki_t1:'🎣 Phishing',wiki_d1:'Attaques utilisant des communications trompeuses.',wiki_t2:'📧 Usurpation Email',wiki_d2:'Falsification des en-têtes email.',wiki_t3:'🛡️ DMARC/SPF/DKIM',wiki_d3:'Protocoles d\'authentification email.',ready:'🎣 Constructeur prêt — choisissez un modèle!',crafting:'Création du modèle d\'email...',crafted:'Email créé! Prédiction de clics: %n%',launching:'Lancement de la campagne...',launched:'Campagne envoyée à %n cibles.',reporting:'Génération du rapport...',reported:'Rapport: %o% ouverts, %c% cliqués, %s% soumis',logCleared:'Journal effacé',copied:'Copié!',copyFail:'Échec',working:'En cours...',splashHint:'appuyer pour passer',langChanged:'🌐 Langue → Français',themeChanged:'🎨 Thème →',t_mosque:'Mosquée',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'Médina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot',step1Title:'Rechercher la cible',step1Desc:'L\'attaquant crée un email convaincant avec des techniques d\'ingénierie sociale.',step2Title:'Construire le prétexte',step2Desc:'L\'email contient un lien vers une fausse page imitant un site de confiance.',step3Title:'Exécuter l\'attaque',step3Desc:'Les victimes saisissent leurs identifiants sur la fausse page.',step4Title:'Analyser et défendre',step4Desc:'Les identifiants récoltés sont utilisés pour un accès non autorisé.',sectionCode:'Code Appareil',faq_q1:'Que fait cette appli ?',faq_a1:'Elle simule social engineering ! 🔬 Tu peux expérimenter avec human psychology in security en toute sécurité.',faq_q2:'Comment ça marche ?',faq_a2:'La simulation tourne dans ton navigateur. Elle modélise de vrais human psychology in security.',faq_q3:'Que dois-je essayer ?',faq_a3:'Appuie sur le bouton principal et regarde ! 🎯 Puis change les réglages pour voir l\'effet.',faq_q4:'C\'est quoi la vraie science ?',faq_a4:'C\'est du vrai social manipulation awareness ! Les mêmes principes utilisés par les professionnels. 🧪',faq_q5:'Je peux le casser ?',faq_a5:'Essaie le Labo ! Pousse les paramètres à l\'extrême et observe. C\'est comme ça qu\'on découvre ! 💡',faq_q6:'Quel matériel ?',faq_a6:'Pour la version réelle, il te faut a computer with Python 3. Regarde 📦 Code Appareil !',faq_q7:'C\'est sûr ?',faq_a7:'Absolument sûr ! 🛡️ Tout tourne localement. Pas d\'internet requis.',faq_q8:'Que faire ensuite ?',faq_a8:'Essaie Se Deepfake Voice Cloner and Se Dumpster Diving Sim ! Chacune enseigne quelque chose de différent. 🚀',demo_s1:'Bienvenue ! Explorons cette simulation ensemble. Regarde la section principale. 🔬',demo_s2:'Clique sur le bouton d\'action pour démarrer. Regarde la visualisation réagir ! ⚡',demo_s3:'Change un réglage — essaie un curseur ou une liste. Tu vois le changement ? 🔄',demo_s4:'Vérifie les résultats — les graphiques montrent ce qui se passe. 📊',demo_s5:'Super ! 🎉 Tu connais les bases. Essaie le Labo pour aller plus loin !',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'Psychology',learn1Desc:'How human behavior creates security vulnerabilities',learn1Tag:'Psychology',learn2Title:'Social Manipulation',learn2Desc:'How attackers exploit trust and authority',learn2Tag:'Awareness',learn3Title:'OSINT',learn3Desc:'How public information reveals private details',learn3Tag:'Intelligence',learn4Title:'Defense Awareness',learn4Desc:'How to recognize and resist social attacks',learn4Tag:'Defense',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Avancé 🔴',learnLevel:'Niveau :',learnTimeVal:'30 min ⏱',learnTime:'Durée :',learnAgeVal:'14+ 🧒',learnAge:'Âge :'},
  ar:{title:'منشئ حملات التصيد',subtitle:'تصميم وتحليل محاكاة هجمات التصيد',disconnected:'غير متصل',connected:'متصل',mainSection:'منشئ حملات التصيد',mainDesc:'بناء رسائل وصفحات تصيد لفهم نواقل الهجوم',sectionA:'كيف يعمل',sectionB:'التحدي',craftBtn:'صياغة البريد',launchBtn:'إطلاق الحملة',reportBtn:'تقرير',tplInvoice:'تنبيه فاتورة مزيفة',tplReset:'إعادة تعيين كلمة المرور',tplUrgent:'إجراء عاجل مطلوب',tplPrize:'فائز بالجائزة',statSent:'مُرسلة',statOpened:'مفتوحة',statClicked:'منقورة',statHarvested:'محصودة',howStep1:'يصنع المهاجم بريدًا إلكترونيًا مقنعًا باستخدام تقنيات الهندسة الاجتماعية.',howStep2:'يحتوي البريد على رابط لصفحة تسجيل مزيفة تحاكي موقعًا موثوقًا.',howStep3:'يدخل الضحايا بياناتهم في الصفحة المزيفة فتُرسل للمهاجم.',howStep4:'تُستخدم البيانات المحصودة للوصول غير المصرح به.',challenge1:'ما الذي يجعل بريد التصيد فعالًا؟',challenge2:'كيف تتعرف على بريد التصيد؟',challenge3:'صمم برنامج تدريب مضاد للتصيد.',challengeReveal1:'الإلحاح وانتحال السلطة والعلامة التجارية المألوفة والمحتوى المخصص والمحفزات العاطفية.',challengeReveal2:'تحقق من النطاق، مرّر فوق الروابط، ابحث عن أخطاء لغوية، تحقق من الإلحاح بشكل مستقل.',challengeReveal3:'اختبارات محاكاة منتظمة وتغذية راجعة فورية وثقافة الإبلاغ وفلاتر البريد وإعدادات DMARC.',revealBtn:'اكشف الإجابة',activityLog:'سجل النشاط',eventsMsg:'الأحداث',clear:'مسح',copy:'نسخ',export:'تصدير',filterAll:'الكل',settings:'⚙️ الإعدادات',language:'اللغة',theme:'المظهر',soundEffects:'🔊 المؤثرات',help:'❓ مساعدة',faq:'أسئلة شائعة',howto:'كيف تستخدم',wiki:'ويكي',howto_1:'اختر قالب تصيد.',howto_2:'انقر صياغة البريد.',howto_3:'انقر إطلاق لمحاكاة الإرسال.',howto_4:'انقر تقرير للتحليلات.',wiki_t1:'🎣 التصيد',wiki_d1:'هجمات تستخدم اتصالات خادعة لسرقة المعلومات.',wiki_t2:'📧 انتحال البريد',wiki_d2:'تزوير رؤوس البريد.',wiki_t3:'🛡️ DMARC/SPF/DKIM',wiki_d3:'بروتوكولات مصادقة البريد.',ready:'🎣 منشئ حملات التصيد جاهز!',crafting:'جارٍ صياغة قالب البريد...',crafted:'تم صياغة البريد! توقع النقر: %n%',launching:'جارٍ إطلاق الحملة...',launched:'أُرسلت الحملة إلى %n أهداف.',reporting:'جارٍ إنشاء التقرير...',reported:'التقرير: %o% فتحوا، %c% نقروا، %s% قدموا بيانات',logCleared:'تم مسح السجل',copied:'تم النسخ!',copyFail:'فشل النسخ',working:'جارٍ...',splashHint:'انقر للتخطي',langChanged:'🌐 اللغة ← العربية',themeChanged:'🎨 المظهر ←',t_mosque:'مسجد',t_zellige:'زليج',t_andalus:'أندلس',t_riad:'رياض',t_medina:'مدينة',t_space:'فضاء',t_jungle:'أدغال',t_robot:'روبوت',step1Title:'البحث عن الهدف',step1Desc:'يصنع المهاجم بريدًا إلكترونيًا مقنعًا باستخدام تقنيات الهندسة الاجتماعية.',step2Title:'بناء الذريعة',step2Desc:'يحتوي البريد على رابط لصفحة تسجيل مزيفة تحاكي موقعًا موثوقًا.',step3Title:'تنفيذ الهجوم',step3Desc:'يدخل الضحايا بياناتهم في الصفحة المزيفة فتُرسل للمهاجم.',step4Title:'تحليل ودفاع',step4Desc:'تُستخدم البيانات المحصودة للوصول غير المصرح به.',sectionCode:'كود الجهاز',faq_q1:'ماذا يفعل هذا التطبيق؟',faq_a1:'يحاكي social engineering! 🔬 يمكنك التجربة مع human psychology in security في بيئة آمنة.',faq_q2:'كيف يعمل؟',faq_a2:'المحاكاة تعمل في متصفحك. تنمذج human psychology in security حقيقية خطوة بخطوة.',faq_q3:'ماذا أجرب أولاً؟',faq_a3:'اضغط على الزر الرئيسي وشاهد! 🎯 ثم عدّل الإعدادات لترى التأثير.',faq_q4:'ما العلم الحقيقي؟',faq_a4:'هذا social manipulation awareness حقيقي! نفس المبادئ المستخدمة من المحترفين. 🧪',faq_q5:'هل يمكنني كسره؟',faq_a5:'جرب المختبر! ادفع المعلمات للحدود القصوى وشاهد. هكذا يكتشف العلماء! 💡',faq_q6:'ما العتاد المطلوب؟',faq_a6:'للنسخة الحقيقية تحتاج a computer with Python 3. تفقد 📦 كود الجهاز!',faq_q7:'هل هو آمن؟',faq_a7:'آمن تماماً! 🛡️ كل شيء يعمل محلياً. لا حاجة للإنترنت.',faq_q8:'ماذا بعد؟',faq_a8:'جرب Se Deepfake Voice Cloner and Se Dumpster Diving Sim! كل واحد يعلّم شيئاً مختلفاً. 🚀',demo_s1:'مرحباً! لنستكشف هذه المحاكاة معاً. انظر إلى القسم الرئيسي أعلاه. 🔬',demo_s2:'اضغط زر الإجراء الرئيسي للبدء. شاهد التصور يستجيب! ⚡',demo_s3:'غيّر إعداداً — جرب شريط تمرير أو قائمة منسدلة. هل ترى التغيير؟ 🔄',demo_s4:'تحقق من النتائج — الرسوم البيانية تُظهر ما يحدث. 📊',demo_s5:'رائع! 🎉 أنت تعرف الأساسيات. جرب المختبر للتعمق أكثر!',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'Psychology',learn1Desc:'How human behavior creates security vulnerabilities',learn1Tag:'Psychology',learn2Title:'Social Manipulation',learn2Desc:'How attackers exploit trust and authority',learn2Tag:'Awareness',learn3Title:'OSINT',learn3Desc:'How public information reveals private details',learn3Tag:'Intelligence',learn4Title:'Defense Awareness',learn4Desc:'How to recognize and resist social attacks',learn4Tag:'Defense',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متقدم 🔴',learnLevel:'المستوى:',learnTimeVal:'30 min ⏱',learnTime:'المدة:',learnAgeVal:'14+ 🧒',learnAge:'العمر:'}
};

let currentLang='en';function T(k){return(LANG[currentLang]||LANG.en)[k]||k;}
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);}else if(type==='success'){o.frequency.value=523;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);}else if(type==='error'){o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);}}
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=s.title+' — Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(T('themeChanged')+' '+name,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(T('logCleared'));}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(T('copied'),'success');}catch{log(T('copyFail'),'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='phishing-campaign-log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||T('working');el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const t=$('statusText');if(t)t.textContent=c?T('connected'):T('disconnected');const p=$('statusPill');if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'?'':l.classList.contains(activeLogFilter)?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.add('open');if(o)o.classList.add('open');}
function closePanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.remove('open');if(o)o.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const s=$('logPanel');s&&s.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const el=$(id);if(el)el.classList.add('active');});});}
window.revealChallenge=function(i){const el=$('answer'+i);if(el)el.classList.toggle('visible');};

/* ═══════ CANVAS — Email Flow Visualization ═══════ */
let simState={sent:0,opened:0,clicked:0,harvested:0,crafted:false,launched:false};
function getAccent(){return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';}

function initCanvas(){
  const c=$('phishCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  function resize(){c.width=c.offsetWidth*(window.devicePixelRatio||1);c.height=240*(window.devicePixelRatio||1);ctx.scale(window.devicePixelRatio||1,window.devicePixelRatio||1);}
  resize();window.addEventListener('resize',resize);
  const W=()=>c.width/(window.devicePixelRatio||1),H=()=>240;
  let t=0;
  const emails=[];for(let i=0;i<12;i++)emails.push({x:Math.random(),y:Math.random()*0.6+0.2,speed:0.002+Math.random()*0.003,phase:Math.random()*Math.PI*2,malicious:i<4});

  function draw(){
    const w=W(),h=H(),accent=getAccent();
    ctx.fillStyle='rgba(10,10,26,0.12)';ctx.fillRect(0,0,w,h);

    // Grid
    ctx.strokeStyle='rgba(255,255,255,0.02)';ctx.lineWidth=1;
    for(let y=0;y<h;y+=25){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}

    // Sender -> Target flow stages
    const stages=['📧 Craft','📤 Send','📬 Inbox','🖱️ Click','🔑 Harvest'];
    const stageX=[0.08,0.27,0.46,0.65,0.84];
    ctx.strokeStyle='rgba(255,255,255,0.06)';ctx.lineWidth=1;
    for(let i=0;i<stages.length-1;i++){
      ctx.beginPath();ctx.moveTo(stageX[i]*w+30,30);ctx.lineTo(stageX[i+1]*w-10,30);ctx.stroke();
    }
    stages.forEach((s,i)=>{
      ctx.fillStyle=i<=currentStage()?accent:'rgba(255,255,255,0.2)';
      ctx.font='14px sans-serif';ctx.textAlign='center';ctx.fillText(s.split(' ')[0],stageX[i]*w,25);
      ctx.fillStyle=i<=currentStage()?'rgba(255,255,255,0.5)':'rgba(255,255,255,0.15)';
      ctx.font='7px Orbitron,monospace';ctx.fillText(s.split(' ')[1],stageX[i]*w,38);
    });

    // Animated emails
    emails.forEach(e=>{
      if(!simState.launched)return;
      e.x+=e.speed;if(e.x>1.1)e.x=-0.1;
      const ex=e.x*w,ey=e.y*h+Math.sin(t*0.03+e.phase)*15;
      ctx.fillStyle=e.malicious?'rgba(255,68,68,0.7)':accent;
      ctx.globalAlpha=0.7;ctx.font='16px sans-serif';ctx.textAlign='center';
      ctx.fillText('📧',ex,ey);
      ctx.globalAlpha=1;
    });

    // Funnel visualization
    if(simState.sent>0){
      const funnelY=h*0.55;const funnelH=h*0.35;
      const stages2=[{label:'Sent',val:simState.sent,w:0.8},{label:'Opened',val:simState.opened,w:0.6},{label:'Clicked',val:simState.clicked,w:0.4},{label:'Harvested',val:simState.harvested,w:0.2}];
      stages2.forEach((s,i)=>{
        const sw=s.w*w*0.4;const sy=funnelY+i*funnelH/4;
        ctx.fillStyle=i===3?'rgba(255,68,68,0.3)':'rgba('+Math.floor(100+i*50)+','+Math.floor(200-i*40)+',255,0.15)';
        ctx.fillRect(w*0.5-sw/2,sy,sw,funnelH/5);
        ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='8px Orbitron,monospace';ctx.textAlign='center';
        ctx.fillText(s.label+': '+s.val,w*0.5,sy+funnelH/7);
      });
    }

    // Template indicator
    const tpl=$('templateSelect')?$('templateSelect').value:'invoice';
    ctx.fillStyle='rgba(255,255,255,0.15)';ctx.font='8px Orbitron,monospace';ctx.textAlign='left';
    ctx.fillText('TEMPLATE: '+tpl.toUpperCase(),10,h-10);

    t++;requestAnimationFrame(draw);
  }
  function currentStage(){if(simState.harvested>0)return 4;if(simState.clicked>0)return 3;if(simState.opened>0)return 2;if(simState.launched)return 1;if(simState.crafted)return 0;return-1;}
  draw();
}

/* ═══════ SIMULATION ═══════ */
function updateStats(){
  $('sentVal').textContent=simState.sent;$('openedVal').textContent=simState.opened;
  $('clickedVal').textContent=simState.clicked;$('harvestedVal').textContent=simState.harvested;
}

function doCraft(){
  const tpl=$('templateSelect')?$('templateSelect').value:'invoice';
  log(T('crafting'),'info');showToast(T('crafting'));setStatus(true);
  setTimeout(()=>{
    hideToast();simState.crafted=true;
    const clickRate=20+Math.floor(Math.random()*35);
    log(T('crafted').replace('%n',clickRate),'success');
    const cl=$('campaignLog');
    if(cl){cl.textContent+='\n[CRAFT] Template: '+tpl+'\n[CRAFT] Subject line optimized\n[CRAFT] Fake sender domain configured\n[CRAFT] Landing page cloned\n[CRAFT] Predicted click rate: '+clickRate+'%';cl.scrollTop=cl.scrollHeight;}
  },1500);
}

function doLaunch(){
  if(!simState.crafted){log('Craft an email first','error');return;}
  log(T('launching'),'info');showToast(T('launching'));
  simState.sent=50+Math.floor(Math.random()*150);
  simState.launched=true;
  updateStats();
  let step=0;
  const iv=setInterval(()=>{
    step++;
    simState.opened=Math.floor(simState.sent*(0.1*step+Math.random()*0.05));
    simState.clicked=Math.floor(simState.opened*(0.08*step+Math.random()*0.03));
    simState.harvested=Math.floor(simState.clicked*(0.05*step+Math.random()*0.02));
    simState.opened=Math.min(simState.sent,simState.opened);
    simState.clicked=Math.min(simState.opened,simState.clicked);
    simState.harvested=Math.min(simState.clicked,simState.harvested);
    updateStats();
    if(step>=5){
      clearInterval(iv);hideToast();
      log(T('launched').replace('%n',simState.sent),'success');
      const cl=$('campaignLog');
      if(cl){cl.textContent+='\n[LAUNCH] Campaign active: '+simState.sent+' emails sent\n[TRACK] Opens: '+simState.opened+' | Clicks: '+simState.clicked+' | Harvested: '+simState.harvested;cl.scrollTop=cl.scrollHeight;}
    }
  },800);
}

function doReport(){
  if(!simState.launched){log('Launch a campaign first','error');return;}
  log(T('reporting'),'info');showToast(T('reporting'));
  setTimeout(()=>{
    hideToast();
    const openRate=simState.sent>0?Math.round(simState.opened/simState.sent*100):0;
    const clickRate=simState.opened>0?Math.round(simState.clicked/simState.opened*100):0;
    const harvestRate=simState.clicked>0?Math.round(simState.harvested/simState.clicked*100):0;
    log(T('reported').replace('%o',openRate).replace('%c',clickRate).replace('%s',harvestRate),'success');
    const cl=$('campaignLog');
    if(cl){
      cl.textContent+='\n\n[REPORT] ═══════════════════════';
      cl.textContent+='\n[REPORT] Campaign Summary';
      cl.textContent+='\n[REPORT] Emails Sent: '+simState.sent;
      cl.textContent+='\n[REPORT] Open Rate: '+openRate+'%';
      cl.textContent+='\n[REPORT] Click Rate: '+clickRate+'%';
      cl.textContent+='\n[REPORT] Harvest Rate: '+harvestRate+'%';
      cl.textContent+='\n[RISK] HIGH — '+simState.harvested+' credentials compromised';
      cl.textContent+='\n[DEFENSE] Implement DMARC/SPF/DKIM';
      cl.textContent+='\n[DEFENSE] Deploy email security gateway';
      cl.textContent+='\n[DEFENSE] Mandatory phishing awareness training';
      cl.scrollTop=cl.scrollHeight;
    }
  },2000);
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();initHijriDate();initLogFilters();initHelpTabs();
  if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;
  if($('helpBtn'))$('helpBtn').onclick=openHelp;if($('helpCloseBtn'))$('helpCloseBtn').onclick=closeHelp;if($('helpOverlay'))$('helpOverlay').onclick=closeHelp;
  if($('settingsBtn'))$('settingsBtn').onclick=openSettings;if($('settingsCloseBtn'))$('settingsCloseBtn').onclick=closeSettings;if($('settingsOverlay'))$('settingsOverlay').onclick=closeSettings;
  if($('logBtn'))$('logBtn').onclick=toggleLog;if($('logCloseBtn'))$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  const ls=$('langSelect'),ts=$('themeSelect');
  if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});
  initCanvas();
  if($('craftBtn'))$('craftBtn').onclick=doCraft;if($('launchBtn'))$('launchBtn').onclick=doLaunch;if($('reportBtn'))$('reportBtn').onclick=doReport;
  log(T('ready'),'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();


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
