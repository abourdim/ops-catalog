#!/usr/bin/env python3
"""Add real-world stories, experiments, and wiki concept/realworld/safety to all 488 apps."""
import os, re, glob, hashlib

CAT_DOMAINS = {
    '01': ('covert operations','micro:bit','opérations secrètes','عمليات سرية'),
    '02': ('IoT hacking','ESP32','piratage IoT','اختراق إنترنت الأشياء'),
    '03': ('RF analysis','HackRF','analyse RF','تحليل الترددات'),
    '04': ('Morse communication','micro:bit','communication Morse','اتصالات مورس'),
    '05': ('steganography','browser','stéganographie','إخفاء المعلومات'),
    '06': ('signal interception','HackRF','interception de signaux','اعتراض الإشارات'),
    '07': ('satellite tracking','SDR','suivi satellite','تتبع الأقمار'),
    '08': ('night operations','micro:bit','opérations nocturnes','عمليات ليلية'),
    '09': ('emergency comms','radio','communications d\'urgence','اتصالات الطوارئ'),
    '10': ('counter-surveillance','ESP32','contre-surveillance','مكافحة المراقبة'),
    '11': ('surveillance','ESP32','surveillance','المراقبة'),
    '12': ('radio navigation','SDR','radionavigation','الملاحة الراديوية'),
    '13': ('electronic warfare','HackRF','guerre électronique','الحرب الإلكترونية'),
    '14': ('WiFi reconnaissance','ESP32','reconnaissance WiFi','استطلاع واي فاي'),
    '15': ('forensic analysis','browser','analyse forensique','التحليل الجنائي'),
    '16': ('RF warfare','HackRF','guerre RF','حرب الترددات'),
    '17': ('drone operations','ESP32','opérations drones','عمليات الطائرات'),
    '18': ('network interception','ESP32','interception réseau','اعتراض الشبكات'),
    '19': ('surveillance detection','micro:bit','détection surveillance','كشف المراقبة'),
    '20': ('cryptography','browser','cryptographie','التشفير'),
    '21': ('ham radio','SDR','radio amateur','الراديو الهاوي'),
    '22': ('border security','ESP32','sécurité frontalière','أمن الحدود'),
    '23': ('acoustic surveillance','micro:bit','surveillance acoustique','المراقبة الصوتية'),
    '24': ('spectrum analysis','HackRF','analyse du spectre','تحليل الطيف'),
    '25': ('maritime security','SDR','sécurité maritime','الأمن البحري'),
    '26': ('RF propagation','HackRF','propagation RF','انتشار الترددات'),
    '27': ('embedded security','ESP32','sécurité embarquée','الأمن المدمج'),
    '28': ('antenna engineering','HackRF','ingénierie antennes','هندسة الهوائيات'),
    '29': ('SIGINT operations','SDR','opérations SIGINT','عمليات الاستخبارات'),
    '30': ('cyber operations','browser','opérations cyber','العمليات السيبرانية'),
    '31': ('radar systems','HackRF','systèmes radar','أنظمة الرادار'),
    '32': ('undersea operations','ESP32','opérations sous-marines','عمليات تحت الماء'),
    '33': ('space communications','SDR','communications spatiales','اتصالات الفضاء'),
    '34': ('mesh networking','ESP32','réseau maillé','الشبكات المعشقة'),
    '35': ('hardware security','micro:bit','sécurité matérielle','أمن الأجهزة'),
    '36': ('radio astronomy','SDR','radioastronomie','علم الفلك الراديوي'),
    '37': ('traffic analysis','browser','analyse de trafic','تحليل حركة المرور'),
    '38': ('psychological ops','browser','opérations psychologiques','العمليات النفسية'),
    '39': ('time analysis','micro:bit','analyse temporelle','تحليل الوقت'),
    '40': ('field agent ops','micro:bit','opérations agent terrain','عمليات العملاء'),
    '41': ('DSP techniques','browser','techniques DSP','تقنيات المعالجة'),
    '42': ('comms protocols','ESP32','protocoles comms','بروتوكولات الاتصال'),
    '43': ('bio-radio','micro:bit','bio-radio','الراديو الحيوي'),
    '44': ('quantum computing','browser','informatique quantique','الحوسبة الكمية'),
    '45': ('environmental monitoring','ESP32','surveillance environnementale','المراقبة البيئية'),
    '46': ('advanced cryptography','browser','cryptographie avancée','التشفير المتقدم'),
    '47': ('impossible physics','browser','physique impossible','الفيزياء المستحيلة'),
    '48': ('extreme comms','ESP32','communications extrêmes','اتصالات متطرفة'),
    '49': ('ham emergency','radio','urgence radio amateur','طوارئ الراديو'),
    '50': ('civilization hacking','ESP32','piratage civilisation','اختراق الحضارة'),
    '51': ('experimental radio','SDR','radio expérimentale','الراديو التجريبي'),
    '52': ('network warfare','browser','guerre réseau','حرب الشبكات'),
    '53': ('AI frontier','browser','frontière IA','حدود الذكاء'),
    '54': ('forensics advanced','browser','forensique avancée','الطب الشرعي المتقدم'),
    '55': ('escape evasion','browser','évasion','الهروب والمراوغة'),
}

INCIDENTS = {
    'spy': [
        ("The Aldrich Ames case (1994) revealed how a CIA mole used dead drops to pass classified intelligence to the Soviet Union for nearly a decade before detection, compromising over 100 operations.",
         "L\\'affaire Aldrich Ames (1994) a révélé comment une taupe de la CIA utilisait des boîtes aux lettres mortes pour transmettre des renseignements classifiés à l\\'Union soviétique pendant près d\\'une décennie.",
         "كشفت قضية ألدريتش أيمز (1994) كيف استخدم عميل مزدوج نقاط التسليم السرية لنقل معلومات استخبارية مصنفة للاتحاد السوفيتي لمدة عقد تقريبًا."),
        ("Operation Ivy Bells (1970s-80s) was a joint NSA/Navy mission to tap Soviet undersea communication cables in the Sea of Okhotsk. Divers placed recording pods on the cable, retrieving them monthly by submarine.",
         "L\\'opération Ivy Bells (1970-80) était une mission conjointe NSA/Marine pour intercepter les câbles de communication sous-marins soviétiques en mer d\\'Okhotsk.",
         "كانت عملية آيفي بيلز في السبعينيات والثمانينيات مهمة مشتركة بين وكالة الأمن القومي والبحرية للتنصت على كابلات الاتصالات السوفيتية تحت البحر."),
        ("Numbers Stations have broadcast encrypted shortwave messages to field agents since the Cold War. UVB-76 (the Buzzer) in Russia has transmitted a monotone buzz since 1982, occasionally interrupted by coded voice messages.",
         "Les stations de nombres diffusent des messages chiffrés par ondes courtes aux agents de terrain depuis la Guerre froide. UVB-76 émet un bourdonnement monotone depuis 1982.",
         "تبث محطات الأرقام رسائل مشفرة عبر الموجات القصيرة للعملاء الميدانيين منذ الحرب الباردة."),
    ],
    'rf': [
        ("In 2015, researchers showed that a $20 SDR dongle could track every aircraft in range by decoding unencrypted ADS-B transponder signals. This revealed a fundamental security gap in global aviation surveillance.",
         "En 2015, des chercheurs ont montré qu\\'un dongle SDR à 20$ pouvait suivre chaque avion à portée en décodant les signaux ADS-B non chiffrés des transpondeurs.",
         "في عام 2015 أثبت باحثون أن جهاز SDR بقيمة 20 دولارًا يمكنه تتبع كل طائرة في النطاق عبر فك تشفير إشارات ADS-B غير المشفرة."),
        ("The Stuxnet worm (2010) destroyed 1,000 Iranian nuclear centrifuges by manipulating their PLCs via infected USB drives. It was the first cyber weapon to cause physical destruction and crossed the digital-physical boundary.",
         "Le ver Stuxnet (2010) a détruit 1000 centrifugeuses nucléaires iraniennes en manipulant leurs automates programmables via des clés USB infectées.",
         "دمرت دودة ستكسنت (2010) ألف جهاز طرد مركزي نووي إيراني من خلال التلاعب بوحدات التحكم المنطقية عبر أقراص USB مصابة."),
        ("In 2017, GPS spoofing in the Black Sea made 20+ ships believe they were 25 miles inland at an airport. This demonstrated that satellite navigation — relied on by aviation, shipping, and military — can be fooled by fake RF signals.",
         "En 2017, le spoofing GPS en mer Noire a fait croire à plus de 20 navires qu\\'ils se trouvaient à 25 milles à l\\'intérieur des terres dans un aéroport.",
         "في عام 2017 جعل انتحال GPS في البحر الأسود أكثر من 20 سفينة تعتقد أنها على بعد 25 ميلاً داخل البر في مطار."),
    ],
    'crypto': [
        ("Alan Turing\\'s team at Bletchley Park cracked the Enigma machine during WWII, reading 84,000 encrypted German messages per month by 1945. This achievement shortened the war by an estimated 2 years.",
         "L\\'équipe d\\'Alan Turing à Bletchley Park a décrypté la machine Enigma pendant la WWII, lisant 84 000 messages allemands chiffrés par mois en 1945.",
         "فك فريق آلان تورينغ في بلتشلي بارك شفرة آلة إنغما خلال الحرب العالمية الثانية وقرأ 84000 رسالة ألمانية مشفرة شهريًا بحلول عام 1945."),
        ("The SolarWinds attack (2020) compromised 18,000 organizations by hiding malware inside trusted software updates. Attackers had 9 months of undetected access to US Treasury, Commerce, and Homeland Security systems.",
         "L\\'attaque SolarWinds (2020) a compromis 18 000 organisations en cachant des malwares dans des mises à jour logicielles de confiance.",
         "اخترق هجوم سولار ويندز (2020) أكثر من 18000 منظمة من خلال إخفاء برامج ضارة داخل تحديثات البرمجيات الموثوقة."),
        ("Heartbleed (2014) was a buffer overflow in OpenSSL that let attackers read 64KB of server memory per request — potentially grabbing private keys, passwords, and session tokens from any HTTPS server worldwide.",
         "Heartbleed (2014) était un dépassement de tampon dans OpenSSL qui permettait aux attaquants de lire 64 Ko de mémoire serveur par requête.",
         "كانت ثغرة هارتبليد (2014) تجاوزًا في المخزن المؤقت في OpenSSL سمح للمهاجمين بقراءة 64 كيلوبايت من ذاكرة الخادم لكل طلب."),
    ],
    'network': [
        ("The Mirai botnet (2016) enslaved 600,000 IoT devices — cameras, DVRs, routers — using 61 default passwords. Its 1.2 Tbps DDoS attack on Dyn DNS took down Twitter, Netflix, Reddit, and GitHub simultaneously.",
         "Le botnet Mirai (2016) a asservi 600 000 appareils IoT en utilisant 61 mots de passe par défaut. Son attaque DDoS de 1,2 Tbps a fait tomber Twitter, Netflix et Reddit.",
         "استعبد بوتنت ميراي (2016) أكثر من 600 ألف جهاز إنترنت الأشياء باستخدام 61 كلمة مرور افتراضية."),
        ("Snowden\\'s 2013 leaks revealed that NSA\\'s PRISM program collected data directly from Google, Facebook, Apple, and Microsoft servers. XKeyscore could search nearly everything a user does on the internet in real time.",
         "Les fuites de Snowden en 2013 ont révélé que le programme PRISM de la NSA collectait des données directement depuis les serveurs de Google, Facebook, Apple et Microsoft.",
         "كشفت تسريبات سنودن عام 2013 أن برنامج بريزم التابع لوكالة الأمن القومي جمع البيانات مباشرة من خوادم جوجل وفيسبوك وآبل ومايكروسوفت."),
        ("The Colonial Pipeline ransomware (2021) shut the largest US fuel pipeline for 5 days. A single compromised VPN password caused fuel shortages across 17 states. The company paid $4.4M in Bitcoin ransom.",
         "Le ransomware Colonial Pipeline (2021) a fermé le plus grand oléoduc américain pendant 5 jours. Un seul mot de passe VPN compromis a causé des pénuries dans 17 états.",
         "أدى هجوم الفدية على خط أنابيب كولونيال (2021) إلى إغلاق أكبر خط أنابيب وقود في أمريكا لمدة 5 أيام بسبب كلمة مرور VPN واحدة مخترقة."),
    ],
    'science': [
        ("LIGO detected gravitational waves in 2015, confirming Einstein\\'s 100-year-old prediction. The sensors measured spacetime distortions of 10⁻²¹ meters — one ten-thousandth the width of a proton.",
         "LIGO a détecté des ondes gravitationnelles en 2015, confirmant la prédiction centenaire d\\'Einstein. Les capteurs ont mesuré des distorsions de l\\'espace-temps de 10⁻²¹ mètres.",
         "رصد مرصد ليغو موجات الجاذبية عام 2015 مؤكدًا تنبؤ أينشتاين قبل 100 عام. قاست المستشعرات تشوهات في الزمكان بمقدار 10⁻²¹ متر."),
        ("Voyager 1, launched in 1977, communicates from 24 billion km away using a 23-watt transmitter — the power of a fridge light bulb. Signals take 22+ hours each way. The Deep Space Network uses 70m dishes to receive them.",
         "Voyager 1, lancé en 1977, communique depuis 24 milliards de km avec un émetteur de 23 watts. Les signaux prennent plus de 22 heures dans chaque sens.",
         "يتواصل المسبار فويجر 1 الذي أُطلق عام 1977 من مسافة 24 مليار كم باستخدام مرسل بقدرة 23 واط. تستغرق الإشارات أكثر من 22 ساعة في كل اتجاه."),
        ("CERN\\'s LHC generates 1 petabyte/second during collisions. The Worldwide LHC Computing Grid spans 170 centers in 42 countries. In 2012, it confirmed the Higgs boson, completing the Standard Model of physics.",
         "Le LHC du CERN génère 1 pétaoctet par seconde lors des collisions. En 2012, il a confirmé le boson de Higgs, complétant le Modèle standard de la physique.",
         "يولد مصادم الهادرونات الكبير في سيرن 1 بيتابايت في الثانية أثناء التصادمات. في عام 2012 أكد بوزون هيغز مكملاً النموذج القياسي للفيزياء."),
    ],
}

CAT_TO_DOMAIN = {}
for cn in range(1, 56):
    cs = str(cn).zfill(2)
    if cn in (1,8,10,11,19,22,40,55):
        CAT_TO_DOMAIN[cs] = 'spy'
    elif cn in (3,6,12,13,16,24,26,28,31,33,36,51):
        CAT_TO_DOMAIN[cs] = 'rf'
    elif cn in (5,15,20,30,38,44,46,53,54):
        CAT_TO_DOMAIN[cs] = 'crypto'
    elif cn in (2,14,17,18,27,34,37,42,52):
        CAT_TO_DOMAIN[cs] = 'network'
    else:
        CAT_TO_DOMAIN[cs] = 'science'


def _esc(s):
    return s.replace("'", "\\'").replace('\n', '\\n')


def extract_ctx(js):
    s = js.find('...LANG_BASE.en')
    if s == -1: s = js.find('en:{')
    e = js.find('...LANG_BASE.fr', s+1)
    if e == -1: e = js.find('fr:{', s+1)
    en = js[s:e] if e > s else js[s:s+5000]
    ctx = {}
    for key in ('title','mainDesc','subtitle'):
        m = re.search(rf"{key}:\s*'([^']*)'", en)
        if not m:
            m = re.search(rf'{key}:\s*"([^"]*)"', en)
        if m:
            ctx[key] = m.group(1)
    return ctx


def find_block_end(js, lang):
    """Find position to insert new keys at end of a language block."""
    if lang == 'en':
        marker = '...LANG_BASE.en'
        next_marker = '...LANG_BASE.fr'
    elif lang == 'fr':
        marker = '...LANG_BASE.fr'
        next_marker = '...LANG_BASE.ar'
    else:
        marker = '...LANG_BASE.ar'
        next_marker = None

    s = js.find(marker)
    if s == -1:
        s = js.find(f'{lang}:' + '{')
        if s == -1:
            return -1

    if next_marker:
        e = js.find(next_marker, s+1)
        if e == -1:
            e = js.find(f"{'fr' if lang == 'en' else 'ar'}:" + '{', s+1)
    else:
        e = js.find('\n};', s+1)
        if e == -1:
            e = js.find('};', s+1)

    if e == -1:
        return -1

    # Walk backwards from e to find the last real content
    pos = e - 1
    while pos > s and js[pos] in ' \t\n\r':
        pos -= 1

    # If we hit the block boundary marker for next lang, back up past the key
    # We need to find the end of the current lang's content
    if lang != 'ar':
        # For en/fr, the next block starts with "  fr: {" or "  ar: {"
        # Find the closing of the current lang's content - look for "}," or "},\n"
        # Actually find "  },\n  fr:" pattern
        next_lang = 'fr' if lang == 'en' else 'ar'
        # Search for the }, that closes this lang block
        block_close = js.rfind('},', s, e)
        if block_close == -1:
            block_close = js.rfind('}', s, e)
        if block_close != -1:
            # Insert before the }
            return block_close
    else:
        # For AR, find the closing } of the ar block
        # Count braces to find the right one
        block_close = js.rfind('}', s, e)
        if block_close != -1:
            return block_close

    return -1


def insert_keys(js, lang, keys_str):
    """Insert keys_str before the closing brace of a language block."""
    pos = find_block_end(js, lang)
    if pos == -1:
        return js
    # Ensure comma separation
    before = js[pos-1] if pos > 0 else ''
    if before not in ',{' and before not in ' \t\n':
        keys_str = ',' + keys_str
    elif before in ' \t\n':
        # Check the non-whitespace char before
        p = pos - 1
        while p > 0 and js[p] in ' \t\n\r':
            p -= 1
        if js[p] not in ',{':
            keys_str = ',' + keys_str
    js = js[:pos] + keys_str + js[pos:]
    return js


def build_realworld_keys(ctx, cat_num, app_dir):
    domain = CAT_TO_DOMAIN.get(cat_num, 'science')
    incs = INCIDENTS[domain]
    h = int(hashlib.md5(app_dir.encode()).hexdigest(), 16)
    idxs = [(h + i) % len(incs) for i in range(3)]
    if idxs[1] == idxs[0]: idxs[1] = (idxs[1] + 1) % len(incs)
    if idxs[2] in (idxs[0], idxs[1]): idxs[2] = (idxs[2] + 2) % len(incs)

    keys = {}
    for li, lang in enumerate(('en', 'fr', 'ar')):
        keys[lang] = (
            f"realworldTitle:'{'🌍 Real-World Stories' if li==0 else '🌍 Histoires réelles' if li==1 else '🌍 قصص واقعية'}',"
            f"realworld1:'{incs[idxs[0]][li]}',"
            f"realworld2:'{incs[idxs[1]][li]}',"
            f"realworld3:'{incs[idxs[2]][li]}'"
        )
    return keys


def build_experiment_keys(ctx, cat_num):
    d = CAT_DOMAINS.get(cat_num, ('technology','browser','technologie','التكنولوجيا'))
    keys = {}
    keys['en'] = (
        "experimentTitle:'🔬 Experiments',"
        "experiment_1_title:'Baseline Measurement',"
        "experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',"
        "experiment_2_title:'Sensitivity Analysis',"
        f"experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\\'s sensitivity to that variable. Repeat for each control. In {_esc(d[0])}, knowing which parameters matter most helps you focus your efforts efficiently.',"
        "experiment_3_title:'Interaction Effects',"
        f"experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in {_esc(d[0])} and reveal the hidden complexity beneath simple-looking systems.'"
    )
    keys['fr'] = (
        "experimentTitle:'🔬 Expériences',"
        "experiment_1_title:'Mesure de référence',"
        "experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',"
        "experiment_2_title:'Analyse de sensibilité',"
        f"experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En {_esc(d[2])}, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',"
        "experiment_3_title:'Effets d\\'interaction',"
        f"experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en {_esc(d[2])} et révèlent la complexité cachée sous des systèmes simples en apparence.'"
    )
    keys['ar'] = (
        "experimentTitle:'🔬 تجارب',"
        "experiment_1_title:'القياس المرجعي',"
        "experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',"
        "experiment_2_title:'تحليل الحساسية',"
        f"experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في {_esc(d[3])} معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',"
        "experiment_3_title:'تأثيرات التفاعل',"
        f"experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في {_esc(d[3])} وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.'"
    )
    return keys


def build_wiki_extra_keys(ctx, cat_num):
    d = CAT_DOMAINS.get(cat_num, ('technology','browser','technologie','التكنولوجيا'))
    title = _esc(ctx.get('title', ''))
    keys = {}
    keys['en'] = (
        f"wiki_concept_title:'💡 Core Concept',"
        f"wiki_concept:'{title} demonstrates a fundamental concept in {_esc(d[0])}. At its core, this simulation models how real systems process signals, data, or physical phenomena. The key insight is that complex behaviors emerge from simple rules applied repeatedly. Understanding this principle — that sophisticated outcomes arise from basic building blocks — is the foundation of engineering and scientific thinking.',"
        f"wiki_realworld_title:'🌐 Real-World Applications',"
        f"wiki_realworld:'The principles demonstrated in {title} have direct real-world applications. Professionals in {_esc(d[0])} use these same concepts daily. In industry, {_esc(d[1])} and similar hardware implement these algorithms in embedded systems. In research, these models help scientists predict and analyze complex phenomena. The skills you develop here — systematic experimentation, parameter tuning, and data interpretation — are exactly what employers seek.',"
        f"wiki_safety_title:'⚠️ Safety & Responsibility',"
        f"wiki_safety:'Working with {_esc(d[0])} carries important responsibilities. Always operate within legal boundaries — many countries regulate equipment and techniques in this field. Never test on systems you do not own without explicit written permission. This simulation is designed for safe educational use — it does not transmit real signals or access real networks. When you progress to real hardware, research your local regulations first.'"
    )
    keys['fr'] = (
        f"wiki_concept_title:'💡 Concept fondamental',"
        f"wiki_concept:'{title} illustre un concept fondamental en {_esc(d[2])}. Cette simulation modélise comment les systèmes réels traitent les signaux, les données ou les phénomènes physiques. L\\'idée clé est que des comportements complexes émergent de règles simples appliquées de manière répétée.',"
        f"wiki_realworld_title:'🌐 Applications réelles',"
        f"wiki_realworld:'Les principes démontrés dans {title} ont des applications directes dans le monde réel. Les professionnels de {_esc(d[2])} utilisent ces mêmes concepts quotidiennement. Dans l\\'industrie, {_esc(d[1])} et du matériel similaire implémentent ces algorithmes dans des systèmes embarqués.',"
        f"wiki_safety_title:'⚠️ Sécurité et responsabilité',"
        f"wiki_safety:'Travailler en {_esc(d[2])} implique des responsabilités importantes. Opérez toujours dans les limites légales. Cette simulation est conçue pour un usage éducatif sûr — elle ne transmet pas de vrais signaux et n\\'accède pas à de vrais réseaux.'"
    )
    keys['ar'] = (
        f"wiki_concept_title:'💡 المفهوم الأساسي',"
        f"wiki_concept:'{title} يوضح مفهومًا أساسيًا في {_esc(d[3])}. تحاكي هذه المحاكاة كيفية معالجة الأنظمة الحقيقية للإشارات والبيانات أو الظواهر الفيزيائية. الفكرة الرئيسية هي أن السلوكيات المعقدة تنشأ من قواعد بسيطة تُطبق بشكل متكرر.',"
        f"wiki_realworld_title:'🌐 التطبيقات الواقعية',"
        f"wiki_realworld:'المبادئ المعروضة في {title} لها تطبيقات مباشرة في العالم الحقيقي. يستخدم المحترفون في {_esc(d[3])} هذه المفاهيم نفسها يوميًا. في الصناعة يُنفذ {_esc(d[1])} وأجهزة مماثلة هذه الخوارزميات في أنظمة مدمجة.',"
        f"wiki_safety_title:'⚠️ السلامة والمسؤولية',"
        f"wiki_safety:'العمل في مجال {_esc(d[3])} يحمل مسؤوليات مهمة. تعمل دائمًا ضمن الحدود القانونية. هذه المحاكاة مصممة للاستخدام التعليمي الآمن — لا ترسل إشارات حقيقية ولا تصل إلى شبكات حقيقية.'"
    )
    return keys


def update_html(html_path, add_rw, add_exp, add_wiki):
    with open(html_path) as f:
        html = f.read()

    changed = False

    if add_rw and 'realworldTitle' not in html:
        block = (
            '<div class="wiki-entry"><h4 data-i18n="realworldTitle">Real-World Stories</h4>'
            '<p data-i18n="realworld1"></p>'
            '<p data-i18n="realworld2"></p>'
            '<p data-i18n="realworld3"></p></div>'
        )
        for anchor in ['wiki_ethics">', 'wiki_debug">', 'theoryBlock">', 'helpGuide">', 'helpWiki">']:
            idx = html.find(anchor)
            if idx != -1:
                close = html.find('</div>', idx)
                if close != -1:
                    html = html[:close+6] + block + html[close+6:]
                    changed = True
                    break

    if add_exp and 'experimentTitle' not in html:
        block = (
            '<div class="wiki-entry"><h4 data-i18n="experimentTitle">Experiments</h4>'
            '<h5 data-i18n="experiment_1_title"></h5><p data-i18n="experiment_1"></p>'
            '<h5 data-i18n="experiment_2_title"></h5><p data-i18n="experiment_2"></p>'
            '<h5 data-i18n="experiment_3_title"></h5><p data-i18n="experiment_3"></p></div>'
        )
        for anchor in ['realworldTitle">', 'wiki_ethics">', 'theoryBlock">', 'helpGuide">']:
            idx = html.find(anchor)
            if idx != -1:
                close = html.find('</div>', idx)
                if close != -1:
                    html = html[:close+6] + block + html[close+6:]
                    changed = True
                    break

    if add_wiki and 'wiki_concept">' not in html:
        block = (
            '<div class="wiki-entry"><h4 data-i18n="wiki_concept_title">Core Concept</h4>'
            '<p data-i18n="wiki_concept"></p></div>'
            '<div class="wiki-entry"><h4 data-i18n="wiki_realworld_title">Real-World Applications</h4>'
            '<p data-i18n="wiki_realworld"></p></div>'
            '<div class="wiki-entry"><h4 data-i18n="wiki_safety_title">Safety</h4>'
            '<p data-i18n="wiki_safety"></p></div>'
        )
        for anchor in ['experimentTitle">', 'realworldTitle">', 'wiki_ethics">', 'theoryBlock">']:
            idx = html.find(anchor)
            if idx != -1:
                close = html.find('</div>', idx)
                if close != -1:
                    html = html[:close+6] + block + html[close+6:]
                    changed = True
                    break

    if changed:
        with open(html_path, 'w') as f:
            f.write(html)
    return changed


def main():
    os.chdir('/home/abdelhak/Desktop/00_amaloun/05_more_apps/ops-catalog')
    apps = sorted(glob.glob('[0-9]*-*/*/script.js'))
    print(f'Processing {len(apps)} apps...')
    stats = {'rw': 0, 'exp': 0, 'wiki': 0, 'html': 0, 'skip': 0, 'err': 0}

    for js_path in apps:
        try:
            with open(js_path) as f:
                js = f.read()

            parts = js_path.split('/')
            cat_num = parts[0].split('-')[0]
            app_dir = parts[1] if len(parts) > 1 else ''
            ctx = extract_ctx(js)

            need_rw = 'realworldTitle' not in js
            need_exp = 'experimentTitle' not in js
            need_wiki = 'wiki_concept' not in js

            if not need_rw and not need_exp and not need_wiki:
                stats['skip'] += 1
                continue

            if need_rw:
                rw = build_realworld_keys(ctx, cat_num, app_dir)
                for lang in ('en', 'fr', 'ar'):
                    js = insert_keys(js, lang, rw[lang])
                stats['rw'] += 1

            if need_exp:
                exp = build_experiment_keys(ctx, cat_num)
                for lang in ('en', 'fr', 'ar'):
                    js = insert_keys(js, lang, exp[lang])
                stats['exp'] += 1

            if need_wiki:
                wiki = build_wiki_extra_keys(ctx, cat_num)
                for lang in ('en', 'fr', 'ar'):
                    js = insert_keys(js, lang, wiki[lang])
                stats['wiki'] += 1

            with open(js_path, 'w') as f:
                f.write(js)

            # Update HTML
            html_path = js_path.replace('script.js', 'index.html')
            if os.path.exists(html_path):
                if update_html(html_path, need_rw, need_exp, need_wiki):
                    stats['html'] += 1

        except Exception as e:
            print(f'ERROR {js_path}: {e}')
            stats['err'] += 1

    print(f"Done: {stats['rw']} realworld, {stats['exp']} experiments, "
          f"{stats['wiki']} wiki_extras, {stats['html']} HTML updated, "
          f"{stats['skip']} skipped, {stats['err']} errors")


if __name__ == '__main__':
    main()
