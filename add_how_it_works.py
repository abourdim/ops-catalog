#!/usr/bin/env python3
"""Phase 1: Add 'How It Works' step cards to all 488 apps.

Strategy:
- Apps with step1Title in script.js → SKIP (already done, 18 apps)
- Apps with howStep1 in script.js → CONVERT existing content to step-grid format + add step1Title keys
- Apps with howItWorks1 in script.js → CONVERT existing content + add step1Title keys
- Apps with none of the above → GENERATE step content from title/subtitle/description + add step-grid

Also:
- Adds step-card CSS to style.css if not present
- Standardizes sectionA to "How It Works" across all apps
"""

import os
import re
import glob
import json

ROOT = os.path.dirname(os.path.abspath(__file__))

# ── Step-card CSS to add to style.css ──────────────────────────────────
STEP_CSS = """
/* ── Step Cards (How It Works) ── */
.step-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.8rem; margin-top: 0.8rem; }
.step-card {
  background: rgba(var(--accent-rgb), 0.06);
  border: 1px solid rgba(var(--accent-rgb), 0.15);
  border-radius: 10px;
  padding: 1rem;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
}
.step-card:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
.step-card .step-num {
  position: absolute; top: -10px; left: 12px;
  width: 24px; height: 24px; border-radius: 50%;
  background: var(--accent);
  color: var(--bg, #08091a);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.75rem;
}
.step-card .step-title, .step-card h4 { font-weight: 700; font-size: 0.85rem; margin-bottom: 0.3rem; margin-top: 0.5rem; }
.step-card .step-desc, .step-card p { font-size: 0.75rem; opacity: 0.7; line-height: 1.4; margin: 0; }
"""

# ── Domain-based step generation templates ──────────────────────────────
DOMAIN_STEPS = {
    'spy': {
        'en': [
            ('Configure', 'Set up the simulation parameters and choose your encryption method.'),
            ('Process', 'The data is processed through the chosen algorithm or technique.'),
            ('Transmit', 'The processed signal or message is sent through the communication channel.'),
            ('Verify', 'The receiver decodes, verifies, and validates the received data.'),
        ],
        'fr': [
            ('Configurer', 'Configure les paramètres de simulation et choisis ta méthode de chiffrement.'),
            ('Traiter', 'Les données sont traitées par l\'algorithme ou la technique choisie.'),
            ('Transmettre', 'Le signal ou message traité est envoyé par le canal de communication.'),
            ('Vérifier', 'Le récepteur décode, vérifie et valide les données reçues.'),
        ],
        'ar': [
            ('تكوين', 'اضبط معلمات المحاكاة واختر طريقة التشفير.'),
            ('معالجة', 'تتم معالجة البيانات عبر الخوارزمية أو التقنية المختارة.'),
            ('إرسال', 'يتم إرسال الإشارة أو الرسالة المعالجة عبر قناة الاتصال.'),
            ('تحقق', 'يقوم المستقبل بفك التشفير والتحقق من البيانات المستلمة.'),
        ],
    },
    'net': {
        'en': [
            ('Scan', 'The network is scanned to discover active devices and services.'),
            ('Capture', 'Network packets are intercepted and captured for analysis.'),
            ('Analyze', 'Packet data is parsed to reveal protocols, addresses, and payloads.'),
            ('Report', 'Results are visualized as graphs, maps, or detailed reports.'),
        ],
        'fr': [
            ('Scanner', 'Le réseau est scanné pour découvrir les appareils et services actifs.'),
            ('Capturer', 'Les paquets réseau sont interceptés et capturés pour analyse.'),
            ('Analyser', 'Les données des paquets sont analysées pour révéler protocoles et adresses.'),
            ('Rapporter', 'Les résultats sont visualisés sous forme de graphiques ou rapports.'),
        ],
        'ar': [
            ('مسح', 'يتم فحص الشبكة لاكتشاف الأجهزة والخدمات النشطة.'),
            ('التقاط', 'يتم اعتراض حزم الشبكة والتقاطها للتحليل.'),
            ('تحليل', 'يتم تحليل بيانات الحزم لكشف البروتوكولات والعناوين.'),
            ('تقرير', 'يتم عرض النتائج كرسوم بيانية أو تقارير مفصلة.'),
        ],
    },
    'wifi': {
        'en': [
            ('Scan Airwaves', 'WiFi adapter scans all channels to discover nearby access points and clients.'),
            ('Identify Targets', 'Detected devices are fingerprinted by MAC, SSID, signal strength, and encryption type.'),
            ('Analyze Traffic', 'Captured frames are decoded to reveal communication patterns and vulnerabilities.'),
            ('Detect Threats', 'Security analysis identifies rogue APs, weak encryption, and suspicious activity.'),
        ],
        'fr': [
            ('Scanner les ondes', 'L\'adaptateur WiFi scanne tous les canaux pour découvrir les points d\'accès.'),
            ('Identifier les cibles', 'Les appareils détectés sont identifiés par MAC, SSID et puissance du signal.'),
            ('Analyser le trafic', 'Les trames capturées sont décodées pour révéler les schémas de communication.'),
            ('Détecter les menaces', 'L\'analyse de sécurité identifie les AP pirates et les faiblesses.'),
        ],
        'ar': [
            ('مسح الموجات', 'يفحص محول WiFi جميع القنوات لاكتشاف نقاط الوصول القريبة.'),
            ('تحديد الأهداف', 'يتم تحديد الأجهزة المكتشفة بواسطة MAC و SSID وقوة الإشارة.'),
            ('تحليل حركة البيانات', 'يتم فك تشفير الإطارات الملتقطة لكشف أنماط الاتصال.'),
            ('كشف التهديدات', 'يحدد التحليل الأمني نقاط الوصول المزيفة ونقاط الضعف.'),
        ],
    },
    'ham': {
        'en': [
            ('Tune Frequency', 'Select the operating band and tune to the target frequency.'),
            ('Transmit/Receive', 'Send or receive radio signals using the chosen modulation mode.'),
            ('Decode Signal', 'The received signal is processed and decoded into readable data.'),
            ('Log Contact', 'Record the contact details: callsign, frequency, mode, and signal report.'),
        ],
        'fr': [
            ('Régler la fréquence', 'Sélectionne la bande et règle la fréquence cible.'),
            ('Émettre/Recevoir', 'Envoie ou reçois des signaux radio avec le mode de modulation choisi.'),
            ('Décoder le signal', 'Le signal reçu est traité et décodé en données lisibles.'),
            ('Enregistrer le contact', 'Note les détails : indicatif, fréquence, mode et rapport de signal.'),
        ],
        'ar': [
            ('ضبط التردد', 'اختر نطاق التشغيل واضبط التردد المستهدف.'),
            ('إرسال/استقبال', 'أرسل أو استقبل إشارات الراديو باستخدام وضع التعديل المختار.'),
            ('فك تشفير الإشارة', 'تتم معالجة الإشارة المستقبلة وفك تشفيرها إلى بيانات مقروءة.'),
            ('تسجيل الاتصال', 'سجّل تفاصيل الاتصال: إشارة النداء والتردد والوضع وتقرير الإشارة.'),
        ],
    },
    'sdr': {
        'en': [
            ('Configure SDR', 'Set the center frequency, sample rate, and gain for the SDR receiver.'),
            ('Capture Signal', 'Raw I/Q samples are captured from the radio spectrum in real time.'),
            ('Process & Filter', 'Digital signal processing applies filters, FFT, and demodulation algorithms.'),
            ('Visualize Output', 'The processed signal is displayed as spectrum, waterfall, or decoded data.'),
        ],
        'fr': [
            ('Configurer le SDR', 'Règle la fréquence centrale, le taux d\'échantillonnage et le gain.'),
            ('Capturer le signal', 'Les échantillons I/Q bruts sont capturés du spectre en temps réel.'),
            ('Traiter et filtrer', 'Le traitement numérique applique filtres, FFT et algorithmes de démodulation.'),
            ('Visualiser le résultat', 'Le signal traité est affiché en spectre, cascade ou données décodées.'),
        ],
        'ar': [
            ('تكوين SDR', 'اضبط التردد المركزي ومعدل العينات والكسب لمستقبل SDR.'),
            ('التقاط الإشارة', 'يتم التقاط عينات I/Q الخام من الطيف الراديوي في الوقت الفعلي.'),
            ('معالجة وتصفية', 'تطبق المعالجة الرقمية المرشحات و FFT وخوارزميات فك التعديل.'),
            ('عرض النتائج', 'يتم عرض الإشارة المعالجة كطيف أو شلال أو بيانات مفكوكة.'),
        ],
    },
    'ant': {
        'en': [
            ('Design Antenna', 'Choose the antenna type and set physical dimensions based on target frequency.'),
            ('Calculate Parameters', 'Compute impedance, gain, SWR, and radiation pattern from the design.'),
            ('Simulate', 'Run the simulation to visualize the antenna\'s performance across frequencies.'),
            ('Optimize', 'Adjust dimensions to minimize SWR and maximize gain at the target frequency.'),
        ],
        'fr': [
            ('Concevoir l\'antenne', 'Choisis le type d\'antenne et définis les dimensions selon la fréquence.'),
            ('Calculer les paramètres', 'Calcule impédance, gain, ROS et diagramme de rayonnement.'),
            ('Simuler', 'Lance la simulation pour visualiser les performances de l\'antenne.'),
            ('Optimiser', 'Ajuste les dimensions pour minimiser le ROS et maximiser le gain.'),
        ],
        'ar': [
            ('تصميم الهوائي', 'اختر نوع الهوائي واضبط الأبعاد حسب التردد المستهدف.'),
            ('حساب المعلمات', 'احسب المعاوقة والكسب و SWR ونمط الإشعاع.'),
            ('محاكاة', 'شغّل المحاكاة لعرض أداء الهوائي عبر الترددات.'),
            ('تحسين', 'اضبط الأبعاد لتقليل SWR وزيادة الكسب عند التردد المستهدف.'),
        ],
    },
    'pi': {
        'en': [
            ('Connect Hardware', 'Wire up sensors, displays, or radio modules to the Raspberry Pi GPIO pins.'),
            ('Configure Software', 'Install libraries and configure the Python script for your hardware setup.'),
            ('Monitor Data', 'Read sensor data in real time and process it through your algorithms.'),
            ('Control & Log', 'Trigger actions based on data thresholds and log results for analysis.'),
        ],
        'fr': [
            ('Connecter le matériel', 'Branche les capteurs ou modules radio aux broches GPIO du Raspberry Pi.'),
            ('Configurer le logiciel', 'Installe les bibliothèques et configure le script Python.'),
            ('Surveiller les données', 'Lis les données des capteurs en temps réel et traite-les.'),
            ('Contrôler et enregistrer', 'Déclenche des actions selon les seuils et enregistre les résultats.'),
        ],
        'ar': [
            ('توصيل العتاد', 'وصّل المستشعرات أو الوحدات بمنافذ GPIO في Raspberry Pi.'),
            ('تكوين البرنامج', 'ثبّت المكتبات وكوّن سكريبت Python لإعداد العتاد.'),
            ('مراقبة البيانات', 'اقرأ بيانات المستشعرات في الوقت الفعلي وعالجها.'),
            ('تحكم وتسجيل', 'أطلق إجراءات بناءً على حدود البيانات وسجّل النتائج.'),
        ],
    },
    'agent': {
        'en': [
            ('Gear Up', 'Select and configure your field equipment for the mission.'),
            ('Deploy', 'Activate sensors and establish secure communication channels.'),
            ('Monitor', 'Track signals, analyze data, and watch for anomalies in real time.'),
            ('Extract', 'Collect results, generate reports, and secure all gathered intelligence.'),
        ],
        'fr': [
            ('S\'équiper', 'Sélectionne et configure ton équipement de terrain pour la mission.'),
            ('Déployer', 'Active les capteurs et établis des canaux de communication sécurisés.'),
            ('Surveiller', 'Traque les signaux, analyse les données et guette les anomalies.'),
            ('Extraire', 'Collecte les résultats, génère des rapports et sécurise le renseignement.'),
        ],
        'ar': [
            ('تجهيز', 'اختر وكوّن معدات الميدان للمهمة.'),
            ('نشر', 'فعّل المستشعرات وأنشئ قنوات اتصال آمنة.'),
            ('مراقبة', 'تتبع الإشارات وحلل البيانات وراقب الشذوذ في الوقت الفعلي.'),
            ('استخراج', 'اجمع النتائج وأنشئ التقارير وأمّن الاستخبارات المجمّعة.'),
        ],
    },
    'hrf': {
        'en': [
            ('Configure RF', 'Set the frequency band, modulation type, and signal parameters.'),
            ('Capture Spectrum', 'Scan the radio spectrum to detect and capture signals of interest.'),
            ('Analyze Signal', 'Apply signal processing to identify modulation, encoding, and source.'),
            ('Classify & Report', 'Categorize the signal type and log detailed analysis results.'),
        ],
        'fr': [
            ('Configurer RF', 'Règle la bande de fréquence, le type de modulation et les paramètres.'),
            ('Capturer le spectre', 'Scanne le spectre radio pour détecter et capturer les signaux.'),
            ('Analyser le signal', 'Applique le traitement du signal pour identifier la modulation et la source.'),
            ('Classifier et rapporter', 'Catégorise le type de signal et enregistre les résultats.'),
        ],
        'ar': [
            ('تكوين RF', 'اضبط نطاق التردد ونوع التعديل ومعلمات الإشارة.'),
            ('التقاط الطيف', 'امسح الطيف الراديوي لاكتشاف والتقاط الإشارات المطلوبة.'),
            ('تحليل الإشارة', 'طبّق معالجة الإشارة لتحديد التعديل والترميز والمصدر.'),
            ('تصنيف والتقرير', 'صنّف نوع الإشارة وسجّل نتائج التحليل المفصلة.'),
        ],
    },
    'bio': {
        'en': [
            ('Attach Sensors', 'Place biosensors on the body to measure physiological signals.'),
            ('Capture Biosignal', 'The sensor captures real-time biological data like heart rate or muscle activity.'),
            ('Process & Modulate', 'Biosignal data is processed and converted into a radio-compatible format.'),
            ('Transmit & Decode', 'The bio-encoded signal is transmitted wirelessly and decoded at the receiver.'),
        ],
        'fr': [
            ('Fixer les capteurs', 'Place les biocapteurs sur le corps pour mesurer les signaux physiologiques.'),
            ('Capturer le biosignal', 'Le capteur enregistre les données biologiques en temps réel.'),
            ('Traiter et moduler', 'Les données sont traitées et converties en format radio compatible.'),
            ('Émettre et décoder', 'Le signal bio-encodé est transmis sans fil et décodé au récepteur.'),
        ],
        'ar': [
            ('تثبيت المستشعرات', 'ضع المستشعرات الحيوية على الجسم لقياس الإشارات الفسيولوجية.'),
            ('التقاط الإشارة الحيوية', 'يلتقط المستشعر البيانات البيولوجية في الوقت الفعلي.'),
            ('معالجة وتعديل', 'تتم معالجة البيانات وتحويلها إلى صيغة متوافقة مع الراديو.'),
            ('إرسال وفك تشفير', 'يتم بث الإشارة المشفرة حيوياً لاسلكياً وفك تشفيرها.'),
        ],
    },
    'sonic': {
        'en': [
            ('Generate Sound', 'Create a specific acoustic signal with precise frequency and amplitude.'),
            ('Propagate', 'The sound wave travels through air, walls, or other media to the target.'),
            ('Detect & Capture', 'Microphones or sensors capture the acoustic energy and convert it to data.'),
            ('Analyze & Decode', 'Signal processing extracts hidden information or maps the acoustic environment.'),
        ],
        'fr': [
            ('Générer le son', 'Crée un signal acoustique avec une fréquence et amplitude précises.'),
            ('Propager', 'L\'onde sonore se déplace dans l\'air, les murs ou d\'autres milieux.'),
            ('Détecter et capturer', 'Les microphones capturent l\'énergie acoustique et la convertissent.'),
            ('Analyser et décoder', 'Le traitement extrait les informations cachées ou cartographie l\'environnement.'),
        ],
        'ar': [
            ('توليد الصوت', 'أنشئ إشارة صوتية بتردد وسعة محددين.'),
            ('انتشار', 'تنتقل الموجة الصوتية عبر الهواء أو الجدران أو الوسائط الأخرى.'),
            ('كشف والتقاط', 'تلتقط الميكروفونات الطاقة الصوتية وتحولها إلى بيانات.'),
            ('تحليل وفك تشفير', 'تستخرج المعالجة المعلومات المخفية أو ترسم خريطة البيئة.'),
        ],
    },
    'chrono': {
        'en': [
            ('Set Time Reference', 'Establish a precise time base using atomic clocks or network synchronization.'),
            ('Measure Interval', 'Capture timing data with nanosecond precision across the system.'),
            ('Detect Anomalies', 'Compare timestamps to find drift, jitter, or deliberate manipulation.'),
            ('Exploit or Defend', 'Use timing information to attack vulnerable systems or strengthen defenses.'),
        ],
        'fr': [
            ('Définir la référence', 'Établis une base de temps précise via horloge atomique ou synchronisation.'),
            ('Mesurer l\'intervalle', 'Capture les données temporelles avec une précision nanoseconde.'),
            ('Détecter les anomalies', 'Compare les horodatages pour trouver la dérive ou la manipulation.'),
            ('Exploiter ou défendre', 'Utilise les informations temporelles pour attaquer ou renforcer les défenses.'),
        ],
        'ar': [
            ('تعيين المرجع الزمني', 'أنشئ قاعدة زمنية دقيقة باستخدام الساعات الذرية أو المزامنة.'),
            ('قياس الفاصل', 'التقط بيانات التوقيت بدقة نانوثانية عبر النظام.'),
            ('كشف الشذوذ', 'قارن الطوابع الزمنية للعثور على الانحراف أو التلاعب.'),
            ('استغلال أو دفاع', 'استخدم معلومات التوقيت لمهاجمة الأنظمة أو تعزيز الدفاعات.'),
        ],
    },
    'swarm': {
        'en': [
            ('Initialize Swarm', 'Create a population of agents with random positions and basic behavior rules.'),
            ('Set Rules', 'Define the interaction rules: attraction, repulsion, alignment, and communication.'),
            ('Simulate', 'Run the simulation and watch emergent collective behavior unfold in real time.'),
            ('Analyze Patterns', 'Measure swarm metrics like convergence speed, coverage, and consensus.'),
        ],
        'fr': [
            ('Initialiser l\'essaim', 'Crée une population d\'agents avec des positions aléatoires et des règles.'),
            ('Définir les règles', 'Définis les règles d\'interaction : attraction, répulsion et communication.'),
            ('Simuler', 'Lance la simulation et observe le comportement collectif émerger.'),
            ('Analyser les motifs', 'Mesure les métriques de l\'essaim : convergence, couverture et consensus.'),
        ],
        'ar': [
            ('تهيئة السرب', 'أنشئ مجموعة من العملاء بمواقع عشوائية وقواعد سلوك أساسية.'),
            ('تعيين القواعد', 'حدد قواعد التفاعل: الجذب والتنافر والمحاذاة والتواصل.'),
            ('محاكاة', 'شغّل المحاكاة وشاهد السلوك الجماعي الناشئ في الوقت الفعلي.'),
            ('تحليل الأنماط', 'قس مقاييس السرب مثل سرعة التقارب والتغطية والتوافق.'),
        ],
    },
    'phys': {
        'en': [
            ('Set Parameters', 'Configure the physical constants and initial conditions for the experiment.'),
            ('Run Experiment', 'Start the simulation and observe the physics phenomenon in action.'),
            ('Measure Results', 'Capture quantitative measurements from the simulated experiment.'),
            ('Compare Theory', 'Compare your experimental results with theoretical predictions.'),
        ],
        'fr': [
            ('Définir les paramètres', 'Configure les constantes physiques et conditions initiales.'),
            ('Lancer l\'expérience', 'Démarre la simulation et observe le phénomène physique en action.'),
            ('Mesurer les résultats', 'Capture les mesures quantitatives de l\'expérience simulée.'),
            ('Comparer à la théorie', 'Compare tes résultats expérimentaux aux prédictions théoriques.'),
        ],
        'ar': [
            ('تعيين المعلمات', 'اضبط الثوابت الفيزيائية والشروط الأولية للتجربة.'),
            ('تشغيل التجربة', 'ابدأ المحاكاة وراقب الظاهرة الفيزيائية أثناء حدوثها.'),
            ('قياس النتائج', 'التقط القياسات الكمية من التجربة المحاكاة.'),
            ('مقارنة بالنظرية', 'قارن نتائجك التجريبية بالتنبؤات النظرية.'),
        ],
    },
    'dark': {
        'en': [
            ('Identify Target', 'Select the system, device, or protocol to analyze for vulnerabilities.'),
            ('Prepare Attack', 'Configure the attack parameters and set up the exploitation environment.'),
            ('Execute', 'Launch the simulated attack and observe how the vulnerability is exploited.'),
            ('Defend', 'Learn the countermeasures and defensive techniques to protect against this attack.'),
        ],
        'fr': [
            ('Identifier la cible', 'Sélectionne le système ou protocole à analyser pour les vulnérabilités.'),
            ('Préparer l\'attaque', 'Configure les paramètres d\'attaque et l\'environnement d\'exploitation.'),
            ('Exécuter', 'Lance l\'attaque simulée et observe comment la vulnérabilité est exploitée.'),
            ('Défendre', 'Apprends les contre-mesures et techniques défensives pour te protéger.'),
        ],
        'ar': [
            ('تحديد الهدف', 'اختر النظام أو البروتوكول لتحليل نقاط الضعف.'),
            ('تحضير الهجوم', 'اضبط معلمات الهجوم وأعد بيئة الاستغلال.'),
            ('تنفيذ', 'أطلق الهجوم المحاكى وراقب كيف يتم استغلال الثغرة.'),
            ('دفاع', 'تعلم الإجراءات المضادة والتقنيات الدفاعية للحماية.'),
        ],
    },
    'ai': {
        'en': [
            ('Input Data', 'Feed raw signal data or samples into the AI/ML processing pipeline.'),
            ('Train Model', 'The neural network learns patterns from the training data.'),
            ('Classify', 'Apply the trained model to identify, categorize, or predict signal properties.'),
            ('Evaluate', 'Measure accuracy, precision, and recall of the AI classification results.'),
        ],
        'fr': [
            ('Données d\'entrée', 'Fournis des données brutes au pipeline de traitement IA/ML.'),
            ('Entraîner le modèle', 'Le réseau neuronal apprend les motifs des données d\'entraînement.'),
            ('Classifier', 'Applique le modèle entraîné pour identifier ou prédire les propriétés.'),
            ('Évaluer', 'Mesure la précision et le rappel des résultats de classification.'),
        ],
        'ar': [
            ('بيانات الإدخال', 'أدخل بيانات الإشارة الخام في خط معالجة الذكاء الاصطناعي.'),
            ('تدريب النموذج', 'تتعلم الشبكة العصبية الأنماط من بيانات التدريب.'),
            ('تصنيف', 'طبّق النموذج المدرب لتحديد أو تصنيف خصائص الإشارة.'),
            ('تقييم', 'قس دقة نتائج التصنيف ومعدل الاستدعاء.'),
        ],
    },
    'civ': {
        'en': [
            ('Collect Data', 'Sensors and stations gather environmental or infrastructure data.'),
            ('Process & Map', 'Raw data is cleaned, processed, and mapped to geographic coordinates.'),
            ('Detect Events', 'Algorithms identify significant events, anomalies, or patterns in the data.'),
            ('Alert & Respond', 'Warnings are issued and response protocols are activated when needed.'),
        ],
        'fr': [
            ('Collecter les données', 'Les capteurs et stations recueillent des données environnementales.'),
            ('Traiter et cartographier', 'Les données brutes sont nettoyées et cartographiées.'),
            ('Détecter les événements', 'Les algorithmes identifient les événements significatifs ou anomalies.'),
            ('Alerter et répondre', 'Des avertissements sont émis et les protocoles de réponse activés.'),
        ],
        'ar': [
            ('جمع البيانات', 'تجمع المستشعرات والمحطات بيانات بيئية أو بنية تحتية.'),
            ('معالجة ورسم خرائط', 'تُنظف البيانات الخام وتُعالج وتُربط بالإحداثيات الجغرافية.'),
            ('كشف الأحداث', 'تحدد الخوارزميات الأحداث المهمة أو الشذوذ في البيانات.'),
            ('إنذار واستجابة', 'تُصدر التحذيرات وتُفعل بروتوكولات الاستجابة عند الحاجة.'),
        ],
    },
    'se': {
        'en': [
            ('Research Target', 'Gather information about the target using open sources and social media.'),
            ('Build Pretext', 'Create a believable cover story or scenario to manipulate the target.'),
            ('Execute Attack', 'Deploy the social engineering technique and observe the target\'s response.'),
            ('Analyze & Defend', 'Review what worked, why it worked, and how to defend against it.'),
        ],
        'fr': [
            ('Rechercher la cible', 'Collecte des informations sur la cible via sources ouvertes et réseaux sociaux.'),
            ('Construire le prétexte', 'Crée une histoire de couverture crédible pour manipuler la cible.'),
            ('Exécuter l\'attaque', 'Déploie la technique d\'ingénierie sociale et observe la réponse.'),
            ('Analyser et défendre', 'Analyse ce qui a fonctionné et comment s\'en protéger.'),
        ],
        'ar': [
            ('البحث عن الهدف', 'اجمع معلومات عن الهدف باستخدام المصادر المفتوحة ووسائل التواصل.'),
            ('بناء الذريعة', 'أنشئ قصة تغطية مقنعة للتلاعب بالهدف.'),
            ('تنفيذ الهجوم', 'انشر تقنية الهندسة الاجتماعية وراقب استجابة الهدف.'),
            ('تحليل ودفاع', 'راجع ما نجح ولماذا وكيفية الدفاع ضده.'),
        ],
    },
    'imp': {
        'en': [
            ('Design Implant', 'Choose the hardware components and design the covert device.'),
            ('Build & Program', 'Assemble the implant and flash it with the custom firmware.'),
            ('Deploy', 'Install the implant in the target environment undetected.'),
            ('Monitor & Extract', 'Receive data from the implant and extract captured intelligence.'),
        ],
        'fr': [
            ('Concevoir l\'implant', 'Choisis les composants et conçois le dispositif caché.'),
            ('Construire et programmer', 'Assemble l\'implant et charge le firmware personnalisé.'),
            ('Déployer', 'Installe l\'implant dans l\'environnement cible sans être détecté.'),
            ('Surveiller et extraire', 'Reçois les données de l\'implant et extrais le renseignement.'),
        ],
        'ar': [
            ('تصميم الزرع', 'اختر مكونات العتاد وصمم الجهاز السري.'),
            ('بناء وبرمجة', 'اجمع الزرع وحمّل البرنامج الثابت المخصص.'),
            ('نشر', 'ثبّت الزرع في البيئة المستهدفة دون اكتشاف.'),
            ('مراقبة واستخراج', 'استقبل البيانات من الزرع واستخرج الاستخبارات الملتقطة.'),
        ],
    },
    'cry': {
        'en': [
            ('Choose Algorithm', 'Select the cryptographic algorithm and key parameters to analyze.'),
            ('Set Up Attack', 'Configure the attack parameters: known plaintext, side-channel data, or timing.'),
            ('Execute Attack', 'Run the cryptographic attack and attempt to recover the secret key.'),
            ('Analyze Results', 'Evaluate attack success rate and understand the vulnerability exploited.'),
        ],
        'fr': [
            ('Choisir l\'algorithme', 'Sélectionne l\'algorithme cryptographique et les paramètres de clé.'),
            ('Préparer l\'attaque', 'Configure les paramètres : texte clair connu, canal latéral ou timing.'),
            ('Exécuter l\'attaque', 'Lance l\'attaque cryptographique et tente de récupérer la clé.'),
            ('Analyser les résultats', 'Évalue le taux de réussite et comprends la vulnérabilité exploitée.'),
        ],
        'ar': [
            ('اختيار الخوارزمية', 'اختر الخوارزمية التشفيرية ومعلمات المفتاح للتحليل.'),
            ('إعداد الهجوم', 'اضبط معلمات الهجوم: نص واضح معروف أو قناة جانبية أو توقيت.'),
            ('تنفيذ الهجوم', 'شغّل الهجوم التشفيري وحاول استعادة المفتاح السري.'),
            ('تحليل النتائج', 'قيّم معدل نجاح الهجوم وافهم الثغرة المستغلة.'),
        ],
    },
    'rfw': {
        'en': [
            ('Detect RF Threat', 'Scan the electromagnetic spectrum to identify hostile RF emissions.'),
            ('Characterize Signal', 'Analyze the threat signal: frequency, power, modulation, and direction.'),
            ('Deploy Countermeasure', 'Activate jamming, spoofing, or defensive measures against the threat.'),
            ('Assess Effectiveness', 'Monitor the battlefield to verify the countermeasure neutralized the threat.'),
        ],
        'fr': [
            ('Détecter la menace RF', 'Scanne le spectre électromagnétique pour identifier les émissions hostiles.'),
            ('Caractériser le signal', 'Analyse le signal : fréquence, puissance, modulation et direction.'),
            ('Déployer la contre-mesure', 'Active le brouillage, le leurrage ou les mesures défensives.'),
            ('Évaluer l\'efficacité', 'Surveille le terrain pour vérifier que la menace est neutralisée.'),
        ],
        'ar': [
            ('كشف تهديد RF', 'امسح الطيف الكهرومغناطيسي لتحديد الانبعاثات المعادية.'),
            ('توصيف الإشارة', 'حلل إشارة التهديد: التردد والقدرة والتعديل والاتجاه.'),
            ('نشر الإجراء المضاد', 'فعّل التشويش أو الخداع أو الإجراءات الدفاعية.'),
            ('تقييم الفعالية', 'راقب ساحة المعركة للتحقق من تحييد التهديد.'),
        ],
    },
    'esc': {
        'en': [
            ('Assess Situation', 'Evaluate the threat environment and identify surveillance or tracking methods.'),
            ('Select Technique', 'Choose the appropriate evasion, obfuscation, or counter-surveillance method.'),
            ('Execute Evasion', 'Apply the chosen technique to avoid detection or escape monitoring.'),
            ('Verify Clean', 'Confirm that you have successfully evaded detection and are operating securely.'),
        ],
        'fr': [
            ('Évaluer la situation', 'Évalue l\'environnement de menace et identifie les méthodes de surveillance.'),
            ('Choisir la technique', 'Sélectionne la méthode d\'évasion ou de contre-surveillance appropriée.'),
            ('Exécuter l\'évasion', 'Applique la technique choisie pour éviter la détection.'),
            ('Vérifier la sécurité', 'Confirme que tu as échappé à la détection et opères en sécurité.'),
        ],
        'ar': [
            ('تقييم الوضع', 'قيّم بيئة التهديد وحدد أساليب المراقبة أو التتبع.'),
            ('اختيار التقنية', 'اختر طريقة التهرب أو التمويه أو مكافحة المراقبة المناسبة.'),
            ('تنفيذ التهرب', 'طبّق التقنية المختارة لتجنب الاكتشاف أو الهروب من المراقبة.'),
            ('التحقق من الأمان', 'تأكد من نجاح التهرب وأنك تعمل بشكل آمن.'),
        ],
    },
}

# Map category prefix to domain
CAT_TO_DOMAIN = {}
for cat_num in range(1, 5):
    CAT_TO_DOMAIN[f'{cat_num:02d}'] = 'spy'
for cat_num in range(5, 10):
    CAT_TO_DOMAIN[f'{cat_num:02d}'] = 'net'
for cat_num in [10, 11, 12, 13]:
    CAT_TO_DOMAIN[f'{cat_num:02d}'] = 'hrf'
for cat_num in range(14, 19):
    CAT_TO_DOMAIN[f'{cat_num:02d}'] = 'wifi'
for cat_num in range(19, 27):
    CAT_TO_DOMAIN[f'{cat_num:02d}'] = 'ham'
for cat_num in range(27, 35):
    CAT_TO_DOMAIN[f'{cat_num:02d}'] = 'sdr'
for cat_num in [35, 41]:
    CAT_TO_DOMAIN[f'{cat_num:02d}'] = 'ant'
for cat_num in [36, 37, 38]:
    CAT_TO_DOMAIN[f'{cat_num:02d}'] = 'pi'
for cat_num in [39, 40, 42]:
    CAT_TO_DOMAIN[f'{cat_num:02d}'] = 'agent'
CAT_TO_DOMAIN['43'] = 'bio'
CAT_TO_DOMAIN['44'] = 'sonic'
CAT_TO_DOMAIN['45'] = 'chrono'
CAT_TO_DOMAIN['46'] = 'swarm'
CAT_TO_DOMAIN['47'] = 'phys'
CAT_TO_DOMAIN['48'] = 'dark'
CAT_TO_DOMAIN['49'] = 'ai'
CAT_TO_DOMAIN['50'] = 'civ'
CAT_TO_DOMAIN['51'] = 'se'
CAT_TO_DOMAIN['52'] = 'imp'
CAT_TO_DOMAIN['53'] = 'cry'
CAT_TO_DOMAIN['54'] = 'rfw'
CAT_TO_DOMAIN['55'] = 'esc'


def get_domain(cat_dir):
    """Get the domain key from category directory name."""
    prefix = cat_dir.split('-')[0]
    return CAT_TO_DOMAIN.get(prefix, 'spy')


def get_app_title(script_content):
    """Extract EN title from script.js LANG."""
    m = re.search(r"title\s*:\s*'([^']*)'", script_content)
    if m:
        return m.group(1)
    return None


def get_existing_howstep_content(script_content):
    """Extract existing howStep content from script.js if available."""
    result = {'en': [], 'fr': [], 'ar': []}
    for lang in ['en', 'fr', 'ar']:
        for step_num in range(1, 5):
            key = f'howStep{step_num}'
            pattern = rf"{key}\s*:\s*'((?:[^'\\]|\\.)*)'"
            m = re.search(pattern, script_content)
            if m:
                result[lang].append(m.group(1).replace("\\'", "'"))
            else:
                break
        if not result[lang]:
            # Try howItWorks pattern
            for step_num in range(1, 5):
                key = f'howItWorks{step_num}'
                pattern = rf"{key}\s*:\s*'((?:[^'\\]|\\.)*)'"
                m = re.search(pattern, script_content)
                if m:
                    result[lang].append(m.group(1).replace("\\'", "'"))
    return result


def generate_step_grid_html(steps_en):
    """Generate the step-grid HTML block."""
    html = '          <div class="step-grid">\n'
    for i, (title, desc) in enumerate(steps_en, 1):
        html += f'            <div class="step-card">\n'
        html += f'              <div class="step-num">{i}</div>\n'
        html += f'              <div class="step-title" data-i18n="step{i}Title">{title}</div>\n'
        html += f'              <div class="step-desc" data-i18n="step{i}Desc">{desc}</div>\n'
        html += f'            </div>\n'
    html += '          </div>'
    return html


def generate_step_i18n(steps, lang):
    """Generate i18n key-value pairs for steps."""
    lines = []
    for i, (title, desc) in enumerate(steps, 1):
        t = title.replace("'", "\\'")
        d = desc.replace("'", "\\'")
        lines.append(f"step{i}Title:'{t}',step{i}Desc:'{d}'")
    return ','.join(lines)


def inject_step_css_in_html(html_content):
    """Add step-card CSS to inline <style> block if not already present."""
    if '.step-grid' in html_content or '.step-card' in html_content:
        return html_content  # Already has it

    # Find the closing </style> tag and insert before it
    style_end = html_content.rfind('</style>')
    if style_end > 0:
        css = """
    /* Step cards */
    .step-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.8rem; margin-top: 0.8rem; }
    .step-card { background: rgba(var(--accent-rgb), 0.06); border: 1px solid rgba(var(--accent-rgb), 0.15); border-radius: 10px; padding: 1rem; position: relative; transition: transform 0.2s, box-shadow 0.2s; }
    .step-card:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
    .step-card .step-num { position: absolute; top: -10px; left: 12px; width: 24px; height: 24px; border-radius: 50%; background: var(--accent); color: var(--bg, #08091a); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; }
    .step-card .step-title, .step-card h4 { font-weight: 700; font-size: 0.85rem; margin-bottom: 0.3rem; margin-top: 0.5rem; }
    .step-card .step-desc, .step-card p { font-size: 0.75rem; opacity: 0.7; line-height: 1.4; margin: 0; }
"""
        html_content = html_content[:style_end] + css + html_content[style_end:]
    else:
        # No <style> block — add one in <head>
        head_end = html_content.find('</head>')
        if head_end > 0:
            css_block = """  <style>
    .step-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.8rem; margin-top: 0.8rem; }
    .step-card { background: rgba(var(--accent-rgb), 0.06); border: 1px solid rgba(var(--accent-rgb), 0.15); border-radius: 10px; padding: 1rem; position: relative; transition: transform 0.2s, box-shadow 0.2s; }
    .step-card:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
    .step-card .step-num { position: absolute; top: -10px; left: 12px; width: 24px; height: 24px; border-radius: 50%; background: var(--accent); color: var(--bg, #08091a); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; }
    .step-card .step-title, .step-card h4 { font-weight: 700; font-size: 0.85rem; margin-bottom: 0.3rem; margin-top: 0.5rem; }
    .step-card .step-desc, .step-card p { font-size: 0.75rem; opacity: 0.7; line-height: 1.4; margin: 0; }
  </style>
"""
            html_content = html_content[:head_end] + css_block + html_content[head_end:]

    return html_content


def replace_section_a_content(html_content, step_grid_html):
    """Replace the inner content of sectionA with step-grid HTML."""
    # Pattern 1: Find sectionA details block with how-step-item or how-steps content
    # We need to find the <div class="card"> inside sectionA and replace its inner content

    # Find sectionA summary
    section_a_match = re.search(
        r'(<details\s+class="collapsible"[^>]*>\s*<summary>[^<]*<span[^>]*>[^<]*</span>\s*<span\s+data-i18n="sectionA">[^<]*</span></summary>\s*<div\s+class="card">)',
        html_content,
        re.DOTALL
    )

    if not section_a_match:
        # Try alternative: sectionA might be the only details with "How It Works" text
        section_a_match = re.search(
            r'(<details\s+class="collapsible"[^>]*>\s*<summary>.*?data-i18n="sectionA".*?</summary>\s*<div\s+class="card">)',
            html_content,
            re.DOTALL
        )

    if not section_a_match:
        return html_content, False

    card_start = section_a_match.end()

    # Find the closing </div> for the card, then </details>
    # Count div depth
    depth = 1
    pos = card_start
    while pos < len(html_content) and depth > 0:
        next_open = html_content.find('<div', pos)
        next_close = html_content.find('</div>', pos)

        if next_close == -1:
            break

        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open + 4
        else:
            depth -= 1
            if depth == 0:
                card_end = next_close
                break
            pos = next_close + 6

    # Replace content between card_start and card_end
    new_content = '\n' + step_grid_html + '\n        '
    html_content = html_content[:card_start] + new_content + html_content[card_end:]
    return html_content, True


def add_section_a_before_section_b(html_content, step_grid_html):
    """For apps that don't have a proper sectionA 'How It Works', add one."""
    # Find where sectionB starts (or the first <details class="collapsible"> after main card)
    # Look for the comment or the second collapsible details

    # Try to find "SECTION B" comment
    section_b = re.search(r'<!-- ═+ SECTION B', html_content)
    if section_b:
        insert_pos = section_b.start()
    else:
        # Find sectionB data-i18n
        section_b = re.search(r'<details\s+class="collapsible"[^>]*>\s*<summary>.*?data-i18n="sectionB"', html_content)
        if section_b:
            insert_pos = section_b.start()
        else:
            # Just find the first </details> after main section and insert after it
            main_card = re.search(r'id="mainCard"', html_content)
            if main_card:
                first_details_end = html_content.find('</details>', main_card.end())
                if first_details_end > 0:
                    insert_pos = first_details_end + len('</details>')
                else:
                    return html_content, False
            else:
                return html_content, False

    how_it_works_html = f"""
      <!-- ═══════════════════ SECTION — How It Works ═══════════════════ -->
      <details class="collapsible">
        <summary><span class="icon">🔧</span> <span data-i18n="sectionHIW">How It Works</span></summary>
        <div class="card">
{step_grid_html}
        </div>
      </details>

"""
    html_content = html_content[:insert_pos] + how_it_works_html + html_content[insert_pos:]
    return html_content, True


def inject_step_keys_in_script(script_content, steps_en, steps_fr, steps_ar, use_section_hiw=False):
    """Add step1Title-step4Title + step1Desc-step4Desc i18n keys to each language block."""
    if 'step1Title' in script_content:
        return script_content  # Already has it

    new_content = script_content

    # Also add the sectionHIW key if needed
    section_key = "sectionHIW:'How It Works'" if use_section_hiw else ""
    section_key_fr = "sectionHIW:'Comment ça marche'" if use_section_hiw else ""
    section_key_ar = "sectionHIW:'كيف يعمل'" if use_section_hiw else ""

    for lang, steps, sec_key in [('en', steps_en, section_key),
                                   ('fr', steps_fr, section_key_fr),
                                   ('ar', steps_ar, section_key_ar)]:
        # Find the language block
        lang_start = re.search(rf'\b{lang}\s*:\s*\{{', new_content)
        if not lang_start:
            continue

        # Find closing brace by counting
        start = lang_start.end()
        depth = 1
        pos = start
        while pos < len(new_content) and depth > 0:
            if new_content[pos] == '{':
                depth += 1
            elif new_content[pos] == '}':
                depth -= 1
            pos += 1
        close_pos = pos - 1

        # Build the insert string
        step_str = generate_step_i18n(steps, lang)
        insert = ',' + step_str
        if sec_key:
            insert = ',' + sec_key + insert

        new_content = new_content[:close_pos] + insert + new_content[close_pos:]

    return new_content


# ══════════════════════ MAIN ══════════════════════

fixed = 0
skipped = 0
errors = []

for script_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'script.js'))):
    with open(script_path, 'r', encoding='utf-8') as f:
        script_content = f.read()

    app_dir = os.path.dirname(script_path)
    app_name = os.path.basename(app_dir)
    cat_name = os.path.basename(os.path.dirname(app_dir))
    domain = get_domain(cat_name)

    # Skip if already has step1Title
    if 'step1Title' in script_content:
        skipped += 1
        continue

    html_path = os.path.join(app_dir, 'index.html')
    if not os.path.exists(html_path):
        continue

    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    # Determine step content source
    existing = get_existing_howstep_content(script_content)
    has_existing_en = len(existing['en']) >= 4

    if has_existing_en:
        # Use existing content — convert howStep descriptions to step format
        # We need to generate short titles from the descriptions
        steps_en = []
        steps_fr = []
        steps_ar = []

        # Get domain-based default titles
        domain_steps = DOMAIN_STEPS.get(domain, DOMAIN_STEPS['spy'])

        for i in range(4):
            if i < len(existing['en']):
                desc_en = existing['en'][i]
                title_en = domain_steps['en'][i][0]  # Use domain title
                steps_en.append((title_en, desc_en))
            else:
                steps_en.append(domain_steps['en'][i])

            if i < len(existing['fr']):
                desc_fr = existing['fr'][i]
                title_fr = domain_steps['fr'][i][0]
                steps_fr.append((title_fr, desc_fr))
            else:
                steps_fr.append(domain_steps['fr'][i])

            if i < len(existing['ar']):
                desc_ar = existing['ar'][i]
                title_ar = domain_steps['ar'][i][0]
                steps_ar.append((title_ar, desc_ar))
            else:
                steps_ar.append(domain_steps['ar'][i])
    else:
        # Generate from domain templates
        domain_steps = DOMAIN_STEPS.get(domain, DOMAIN_STEPS['spy'])
        steps_en = domain_steps['en']
        steps_fr = domain_steps['fr']
        steps_ar = domain_steps['ar']

    # ── Fix HTML ──
    step_grid_html = generate_step_grid_html(steps_en)

    # Add step CSS to HTML
    html_content = inject_step_css_in_html(html_content)

    # Check if sectionA is "How It Works" style or something else
    section_a_is_how = bool(re.search(
        r'data-i18n="sectionA">[^<]*(How It Works|Comment|كيف|A —|Section A)',
        html_content,
        re.IGNORECASE
    ))

    # Check if there's already a step-grid in HTML
    has_step_grid = 'step-grid' in html_content

    html_modified = False
    use_section_hiw = False

    if has_step_grid:
        # Already has step-grid HTML, just needs i18n keys in script.js
        html_modified = True
    elif section_a_is_how:
        # Replace sectionA content with step-grid
        html_content, html_modified = replace_section_a_content(html_content, step_grid_html)
    else:
        # sectionA is the main interactive section — add a new "How It Works" section
        html_content, html_modified = add_section_a_before_section_b(html_content, step_grid_html)
        use_section_hiw = True

    if not html_modified:
        # Fallback: try to insert before first </details> after the main section
        html_content, html_modified = add_section_a_before_section_b(html_content, step_grid_html)
        use_section_hiw = True

    if not html_modified:
        errors.append(f"WARN: Could not inject step-grid HTML into {cat_name}/{app_name}")
        continue

    # ── Fix script.js ──
    new_script = inject_step_keys_in_script(
        script_content, steps_en, steps_fr, steps_ar, use_section_hiw
    )

    # Write files
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

    if new_script != script_content:
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(new_script)

    fixed += 1
    if fixed % 50 == 0:
        print(f"  ... processed {fixed} apps")

print(f"\n✓ Added step cards to {fixed} apps")
print(f"  Skipped {skipped} apps (already had step1Title)")
if errors:
    print(f"\n⚠ {len(errors)} warnings:")
    for e in errors:
        print(f"  {e}")
