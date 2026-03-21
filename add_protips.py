#!/usr/bin/env python3
"""Add pro tips, fun facts, common mistakes, troubleshooting, and further reading to all 488 apps."""
import os, re, glob, hashlib

os.chdir('/home/abdelhak/Desktop/00_amaloun/05_more_apps/ops-catalog')

CAT_DOMAINS = {
    '01': ('covert operations','micro:bit'), '02': ('IoT security','ESP32'),
    '03': ('RF analysis','HackRF'), '04': ('Morse communication','micro:bit'),
    '05': ('steganography','browser'), '06': ('signal interception','HackRF'),
    '07': ('satellite tracking','SDR'), '08': ('night operations','micro:bit'),
    '09': ('emergency comms','radio'), '10': ('counter-surveillance','ESP32'),
    '11': ('surveillance','ESP32'), '12': ('radio navigation','SDR'),
    '13': ('electronic warfare','HackRF'), '14': ('WiFi recon','ESP32'),
    '15': ('forensic analysis','browser'), '16': ('RF warfare','HackRF'),
    '17': ('drone operations','ESP32'), '18': ('network interception','ESP32'),
    '19': ('surveillance detection','micro:bit'), '20': ('cryptography','browser'),
    '21': ('ham radio','SDR'), '22': ('border security','ESP32'),
    '23': ('acoustic surveillance','micro:bit'), '24': ('spectrum analysis','HackRF'),
    '25': ('maritime security','SDR'), '26': ('RF propagation','HackRF'),
    '27': ('embedded security','ESP32'), '28': ('antenna engineering','HackRF'),
    '29': ('SIGINT','SDR'), '30': ('cyber operations','browser'),
    '31': ('radar systems','HackRF'), '32': ('undersea ops','ESP32'),
    '33': ('space comms','SDR'), '34': ('mesh networking','ESP32'),
    '35': ('hardware security','micro:bit'), '36': ('radio astronomy','SDR'),
    '37': ('traffic analysis','browser'), '38': ('psychological ops','browser'),
    '39': ('time analysis','micro:bit'), '40': ('field agent ops','micro:bit'),
    '41': ('DSP techniques','browser'), '42': ('comms protocols','ESP32'),
    '43': ('bio-radio','micro:bit'), '44': ('quantum computing','browser'),
    '45': ('environmental monitoring','ESP32'), '46': ('advanced crypto','browser'),
    '47': ('impossible physics','browser'), '48': ('extreme comms','ESP32'),
    '49': ('ham emergency','radio'), '50': ('civilization hacking','ESP32'),
    '51': ('experimental radio','SDR'), '52': ('network warfare','browser'),
    '53': ('AI frontier','browser'), '54': ('forensics advanced','browser'),
    '55': ('escape evasion','browser'),
}

# ─── Pro tips by hardware type ───
PRO_TIPS = {
    'micro:bit': [
        ("Always check your battery level before field operations. A dying micro:bit produces unreliable sensor readings that can corrupt your entire dataset.",
         "Vérifiez toujours le niveau de batterie avant les opérations terrain. Un micro:bit mourant produit des lectures capteur peu fiables.",
         "تحقق دائمًا من مستوى البطارية قبل العمليات الميدانية. ينتج micro:bit الذي تنفد بطاريته قراءات مستشعر غير موثوقة."),
        ("Use radio group numbers above 100 to avoid interference from other micro:bit users in the area. Default groups 0-10 are crowded.",
         "Utilisez des numéros de groupe radio supérieurs à 100 pour éviter les interférences. Les groupes par défaut 0-10 sont encombrés.",
         "استخدم أرقام مجموعات الراديو فوق 100 لتجنب التداخل مع مستخدمي micro:bit الآخرين. المجموعات الافتراضية 0-10 مزدحمة."),
        ("The micro:bit accelerometer is sensitive to temperature changes. Let your device warm up for 2 minutes before taking precise measurements.",
         "L'accéléromètre du micro:bit est sensible aux changements de température. Laissez votre appareil chauffer 2 minutes avant les mesures précises.",
         "مقياس التسارع في micro:bit حساس لتغيرات درجة الحرارة. اترك جهازك يسخن لمدة دقيقتين قبل أخذ قياسات دقيقة."),
    ],
    'ESP32': [
        ("Enable deep sleep mode between scans to extend battery life by 10x. The ESP32 draws 240mA active but only 10μA in deep sleep.",
         "Activez le mode veille profonde entre les scans pour multiplier l'autonomie par 10. L'ESP32 consomme 240mA en actif mais seulement 10μA en veille profonde.",
         "فعّل وضع النوم العميق بين عمليات المسح لإطالة عمر البطارية 10 أضعاف. يستهلك ESP32 ما يصل إلى 240 مللي أمبير نشط ولكن 10 ميكروأمبير فقط في النوم العميق."),
        ("Use channel hopping (channels 1, 6, 11) for WiFi scanning — these are the only non-overlapping 2.4GHz channels and catch 90% of traffic.",
         "Utilisez le saut de canal (canaux 1, 6, 11) pour le scan WiFi — ce sont les seuls canaux 2,4 GHz non chevauchants et ils captent 90% du trafic.",
         "استخدم التنقل بين القنوات (1، 6، 11) لمسح الواي فاي — هذه هي القنوات غير المتداخلة الوحيدة في نطاق 2.4 جيجاهرتز وتلتقط 90% من حركة المرور."),
        ("Add a 10μF capacitor across the ESP32 power pins. WiFi transmission causes current spikes that can crash the board without proper decoupling.",
         "Ajoutez un condensateur de 10μF aux bornes d'alimentation de l'ESP32. La transmission WiFi cause des pics de courant qui peuvent planter la carte sans découplage.",
         "أضف مكثفًا بسعة 10 ميكروفاراد عبر دبابيس الطاقة في ESP32. يسبب إرسال الواي فاي ذروات تيار يمكن أن تتسبب في تعطل اللوحة."),
    ],
    'HackRF': [
        ("Always use an external LNA (Low Noise Amplifier) for weak signal reception. The HackRF\\'s built-in amplifier has a high noise figure that masks faint signals.",
         "Utilisez toujours un LNA externe pour la réception de signaux faibles. L'amplificateur intégré du HackRF a un facteur de bruit élevé.",
         "استخدم دائمًا مضخم ضوضاء منخفض خارجي لاستقبال الإشارات الضعيفة. يتميز المضخم المدمج في HackRF بعامل ضوضاء عالٍ."),
        ("Set your sample rate to at least 2x the signal bandwidth (Nyquist theorem). For FM radio (200kHz bandwidth), use at least 400kHz sample rate.",
         "Réglez votre taux d'échantillonnage à au moins 2x la bande passante du signal (théorème de Nyquist). Pour la radio FM (200 kHz), utilisez au moins 400 kHz.",
         "اضبط معدل العينات على ضعف عرض النطاق الترددي للإشارة على الأقل (نظرية نيكويست). لراديو FM بعرض 200 كيلوهرتز استخدم 400 كيلوهرتز على الأقل."),
        ("Calibrate your HackRF frequency offset using a known signal (like an FM station). Most units have a 1-20 ppm crystal error that shifts all frequencies.",
         "Calibrez le décalage de fréquence de votre HackRF avec un signal connu. La plupart des unités ont une erreur de cristal de 1-20 ppm.",
         "قم بمعايرة انحراف التردد في HackRF باستخدام إشارة معروفة. معظم الوحدات بها خطأ كريستال من 1-20 جزء في المليون."),
    ],
    'SDR': [
        ("Use a bandpass filter before your SDR to reject strong out-of-band signals. A nearby FM station can desensitize your receiver to weak satellite signals.",
         "Utilisez un filtre passe-bande avant votre SDR pour rejeter les signaux hors bande. Une station FM proche peut désensibiliser votre récepteur.",
         "استخدم مرشح نطاق قبل SDR لرفض الإشارات القوية خارج النطاق. يمكن لمحطة FM قريبة أن تقلل حساسية جهاز الاستقبال."),
        ("Record raw IQ data first, analyze later. You can always reprocess saved IQ files with different demodulation settings — you cannot re-capture a missed signal.",
         "Enregistrez d'abord les données IQ brutes, analysez ensuite. Vous pouvez toujours retraiter les fichiers IQ sauvegardés avec différents réglages.",
         "سجّل بيانات IQ الخام أولاً وحللها لاحقًا. يمكنك دائمًا إعادة معالجة ملفات IQ المحفوظة بإعدادات مختلفة."),
        ("Use FFT averaging (16-64 frames) to distinguish real signals from noise floor variations. Persistent signals stay constant while noise averages out.",
         "Utilisez la moyenne FFT (16-64 trames) pour distinguer les vrais signaux des variations du bruit de fond.",
         "استخدم متوسط FFT من 16-64 إطارًا لتمييز الإشارات الحقيقية عن تغيرات أرضية الضوضاء."),
    ],
    'browser': [
        ("Open your browser\\'s Developer Console (F12) to see the raw data behind the visualization. The simulation logs every calculation — this is how you verify the math.",
         "Ouvrez la console développeur (F12) pour voir les données brutes derrière la visualisation. La simulation enregistre chaque calcul.",
         "افتح وحدة تحكم المطور في المتصفح (F12) لرؤية البيانات الخام وراء العرض المرئي. تسجل المحاكاة كل عملية حسابية."),
        ("Use your browser\\'s Performance tab to measure frame rate. If the simulation drops below 30fps, reduce the data points or update interval for smoother animation.",
         "Utilisez l'onglet Performance de votre navigateur pour mesurer le taux de rafraîchissement. Si la simulation tombe sous 30fps, réduisez les points de données.",
         "استخدم علامة تبويب الأداء في المتصفح لقياس معدل الإطارات. إذا انخفضت المحاكاة عن 30 إطارًا في الثانية قلل نقاط البيانات."),
        ("Export simulation data using the Copy button, paste into a spreadsheet, and create your own charts. Comparing multiple runs in a chart reveals patterns invisible on screen.",
         "Exportez les données avec le bouton Copier, collez dans un tableur et créez vos propres graphiques.",
         "صدّر بيانات المحاكاة باستخدام زر النسخ والصقها في جدول بيانات وأنشئ مخططاتك الخاصة."),
    ],
    'radio': [
        ("Listen before transmitting (LBT). Check the frequency is clear for at least 30 seconds. Transmitting on an occupied frequency causes interference and is illegal in most countries.",
         "Écoutez avant de transmettre (LBT). Vérifiez que la fréquence est libre pendant au moins 30 secondes.",
         "استمع قبل الإرسال. تحقق من أن التردد خالٍ لمدة 30 ثانية على الأقل. الإرسال على تردد مشغول يسبب تداخلاً وهو غير قانوني."),
        ("Use the phonetic alphabet (Alpha, Bravo, Charlie...) for critical voice communications. It eliminates confusion between similar-sounding letters.",
         "Utilisez l'alphabet phonétique (Alpha, Bravo, Charlie...) pour les communications vocales critiques.",
         "استخدم الأبجدية الصوتية (ألفا، برافو، تشارلي...) للاتصالات الصوتية الحرجة."),
        ("Keep your antenna as high as possible. Doubling antenna height typically adds 6dB of gain — equivalent to quadrupling your transmitter power.",
         "Gardez votre antenne aussi haute que possible. Doubler la hauteur ajoute typiquement 6 dB de gain.",
         "ارفع هوائيك قدر الإمكان. مضاعفة ارتفاع الهوائي تضيف عادة 6 ديسيبل من الكسب."),
    ],
}

# ─── Fun facts by domain ───
FUN_FACTS = {
    'spy': [
        ("During the Cold War, the CIA built a robot dragonfly in the 1970s to carry a miniature microphone. Project Insectothopter was abandoned because it couldn\\'t fly in wind.",
         "Pendant la Guerre froide, la CIA a construit une libellule robot dans les années 1970 pour transporter un microphone miniature. Le projet Insectothopter a été abandonné car il ne pouvait pas voler dans le vent.",
         "خلال الحرب الباردة، بنت وكالة المخابرات المركزية يعسوبًا آليًا في السبعينيات لحمل ميكروفون مصغر. تم التخلي عن المشروع لأنه لم يستطع الطيران في الرياح."),
        ("The Great Seal bug — in 1945, Soviet children gifted the US ambassador a carved wooden Great Seal containing a passive listening device. It operated for 7 years before being discovered.",
         "Le bug du Grand Sceau — en 1945, des enfants soviétiques ont offert à l'ambassadeur américain un Grand Sceau en bois contenant un dispositif d'écoute passif. Il a fonctionné 7 ans avant d'être découvert.",
         "في عام 1945 أهدى أطفال سوفييت سفير الولايات المتحدة ختمًا خشبيًا يحتوي على جهاز تنصت سلبي. عمل لمدة 7 سنوات قبل اكتشافه."),
    ],
    'rf': [
        ("The Sun is the strongest radio source in our sky. Solar flares can disrupt HF radio communications worldwide for hours — ham operators call these events \\'radio blackouts.\\'",
         "Le Soleil est la source radio la plus puissante de notre ciel. Les éruptions solaires peuvent perturber les communications HF mondiales pendant des heures.",
         "الشمس هي أقوى مصدر راديوي في سمائنا. يمكن للانفجارات الشمسية تعطيل اتصالات HF في جميع أنحاء العالم لساعات."),
        ("WiFi uses the same 2.4 GHz frequency as microwave ovens. A leaky microwave can jam your WiFi — this is why your internet slows down when someone heats lunch.",
         "Le WiFi utilise la même fréquence 2,4 GHz que les fours à micro-ondes. Un four qui fuit peut brouiller votre WiFi.",
         "يستخدم الواي فاي نفس تردد 2.4 جيجاهرتز الذي تستخدمه أفران الميكروويف. يمكن لميكروويف متسرب أن يشوش على الواي فاي."),
    ],
    'crypto': [
        ("A 256-bit AES key has more possible combinations (2²⁵⁶) than atoms in the observable universe (≈2²⁶⁶). Even checking a trillion keys per second, brute-forcing would take longer than the age of the universe.",
         "Une clé AES 256 bits a plus de combinaisons possibles (2²⁵⁶) que d'atomes dans l'univers observable. Même en testant un billion de clés par seconde, le forçage prendrait plus longtemps que l'âge de l'univers.",
         "يحتوي مفتاح AES بطول 256 بت على توليفات ممكنة أكثر من عدد الذرات في الكون المرئي."),
        ("The Caesar cipher, used by Julius Caesar 2000 years ago, shifts each letter by a fixed number. With only 25 possible shifts, a child can crack it in minutes — yet it secured Roman military communications.",
         "Le chiffre de César, utilisé il y a 2000 ans, décale chaque lettre d'un nombre fixe. Avec seulement 25 décalages possibles, un enfant peut le casser en minutes.",
         "شفرة قيصر التي استخدمها يوليوس قيصر قبل 2000 عام تنقل كل حرف بعدد ثابت. مع 25 إزاحة ممكنة فقط يمكن لطفل كسرها في دقائق."),
    ],
    'network': [
        ("The first computer virus, Creeper (1971), displayed \\'I\\'m the creeper, catch me if you can!\\' on ARPANET terminals. The first antivirus, Reaper, was written specifically to chase and delete it.",
         "Le premier virus informatique, Creeper (1971), affichait \\'I\\'m the creeper, catch me if you can!\\' sur les terminaux ARPANET.",
         "عرض أول فيروس كمبيوتر Creeper عام 1971 رسالة على طرفيات ARPANET. وكُتب أول مضاد فيروسات Reaper خصيصًا لملاحقته وحذفه."),
        ("99% of international internet traffic travels through undersea fiber optic cables. There are over 550 active cables totaling 1.4 million km — enough to wrap around Earth 35 times.",
         "99% du trafic internet international transite par des câbles à fibres optiques sous-marins. Plus de 550 câbles actifs totalisent 1,4 million de km.",
         "99% من حركة الإنترنت الدولية تنتقل عبر كابلات الألياف البصرية تحت البحر. هناك أكثر من 550 كابلًا نشطًا بطول إجمالي 1.4 مليون كم."),
    ],
    'science': [
        ("A neutron star is so dense that a teaspoon of its material would weigh about 6 billion tons on Earth — roughly the weight of every car, truck, and bus on the planet combined.",
         "Une étoile à neutrons est si dense qu'une cuillère à café de sa matière pèserait environ 6 milliards de tonnes sur Terre.",
         "النجم النيوتروني كثيف لدرجة أن ملعقة صغيرة من مادته ستزن حوالي 6 مليارات طن على الأرض."),
        ("Lightning bolts reach temperatures of 30,000°C — five times hotter than the surface of the Sun. Each bolt carries enough energy to toast 100,000 slices of bread.",
         "La foudre atteint 30 000°C — cinq fois plus chaud que la surface du Soleil. Chaque éclair transporte assez d'énergie pour griller 100 000 tranches de pain.",
         "يصل البرق إلى درجة حرارة 30,000 درجة مئوية — خمس مرات أسخن من سطح الشمس."),
    ],
}

# ─── Common mistakes ───
COMMON_MISTAKES = {
    'en': [
        "Changing multiple parameters at once makes it impossible to isolate cause and effect. Always change ONE variable at a time.",
        "Skipping the baseline measurement. Without knowing the default behavior, you cannot measure how your changes affect the system.",
        "Ignoring the activity log. It records every event with timestamps — essential for understanding sequences and debugging unexpected results.",
    ],
    'fr': [
        "Changer plusieurs paramètres à la fois rend impossible l'isolation de la cause et de l'effet. Changez toujours UNE seule variable à la fois.",
        "Sauter la mesure de référence. Sans connaître le comportement par défaut, vous ne pouvez pas mesurer l'impact de vos changements.",
        "Ignorer le journal d'activité. Il enregistre chaque événement avec des horodatages — essentiel pour comprendre les séquences.",
    ],
    'ar': [
        "تغيير عدة معلمات في وقت واحد يجعل من المستحيل عزل السبب والنتيجة. غيّر دائمًا متغيرًا واحدًا فقط في كل مرة.",
        "تخطي القياس المرجعي. بدون معرفة السلوك الافتراضي لا يمكنك قياس تأثير تغييراتك على النظام.",
        "تجاهل سجل النشاط. يسجل كل حدث مع طوابع زمنية — ضروري لفهم التسلسلات وتصحيح النتائج غير المتوقعة.",
    ],
}


def _esc(s):
    return s.replace("'", "\\x27").replace('\n', '\\n')


def extract_ctx(js):
    s = js.find('...LANG_BASE.en')
    if s == -1:
        # Try new template: find 'en:{' after 'const LANG'
        li = js.find('const LANG')
        if li == -1: return {}
        s = js.find('en:{', li)
        if s == -1: s = js.find('en: {', li)
    if s == -1: return {}
    e = _find_next_lang(js, s, 'fr')
    if e == -1: return {}
    en = js[s:e]
    ctx = {}
    for key in ('title','mainDesc'):
        m = re.search(rf"{key}:\s*'([^']*)'", en)
        if m: ctx[key] = m.group(1)
    return ctx


def _find_lang_start(js, lang):
    """Find start of a lang block in the LANG object (not LANG_BASE)."""
    # First try spread syntax
    spread = js.find(f'...LANG_BASE.{lang}')
    if spread > -1:
        return spread
    # Fall back to finding 'XX:{' after 'const LANG'
    li = js.find('const LANG ')
    if li == -1:
        li = js.find('const LANG=')
    if li == -1:
        return -1
    # Find the lang block - but skip LANG_BASE blocks
    base_end = js.find('};', li)  # end of LANG_BASE
    if base_end == -1:
        base_end = li
    pos = base_end
    while True:
        idx = js.find(f'{lang}:' + '{', pos)
        if idx == -1:
            idx = js.find(f'{lang}: ' + '{', pos)
        if idx == -1:
            return -1
        # Make sure this is inside LANG not LANG_BASE
        if idx > base_end:
            return idx
        pos = idx + 5
    return -1


def _find_next_lang(js, start, next_lang):
    """Find the start of the next language block after position start."""
    # Try spread
    e = js.find(f'...LANG_BASE.{next_lang}', start + 20)
    if e > -1:
        return e
    # Try 'XX:{' pattern after start
    e = js.find(f'{next_lang}:' + '{', start + 20)
    if e == -1:
        e = js.find(f'{next_lang}: ' + '{', start + 20)
    return e


def find_insert_pos(js, lang):
    """Find insert position at end of lang block."""
    s = _find_lang_start(js, lang)
    if s == -1:
        return -1

    if lang == 'en':
        e = _find_next_lang(js, s, 'fr')
    elif lang == 'fr':
        e = _find_next_lang(js, s, 'ar')
    else:  # ar
        e = js.find('\n};', s + 1)
        if e == -1:
            e = js.find('};', s + 1)

    if e == -1:
        return -1
    # Find closing brace of this lang block
    if lang != 'ar':
        pos = js.rfind('},', s, e)
        if pos == -1: pos = js.rfind('}', s, e)
    else:
        pos = js.rfind('}', s, e)
    return pos


def inject(js, lang, keys_str):
    pos = find_insert_pos(js, lang)
    if pos == -1:
        return js
    # Check preceding non-whitespace
    p = pos - 1
    while p > 0 and js[p] in ' \t\n\r':
        p -= 1
    if js[p] not in ',{':
        keys_str = ',' + keys_str
    return js[:pos] + keys_str + js[pos:]


CAT_TO_DOMAIN = {}
for cn in range(1, 56):
    cs = str(cn).zfill(2)
    if cn in (1,8,10,11,19,22,40,55): CAT_TO_DOMAIN[cs] = 'spy'
    elif cn in (3,6,12,13,16,24,26,28,31,33,36,51): CAT_TO_DOMAIN[cs] = 'rf'
    elif cn in (5,15,20,30,38,44,46,53,54): CAT_TO_DOMAIN[cs] = 'crypto'
    elif cn in (2,14,17,18,27,34,37,42,52): CAT_TO_DOMAIN[cs] = 'network'
    else: CAT_TO_DOMAIN[cs] = 'science'


def build_keys(ctx, cat_num, app_dir):
    domain = CAT_TO_DOMAIN.get(cat_num, 'science')
    hw = CAT_DOMAINS.get(cat_num, ('tech','browser'))[1]
    h = int(hashlib.md5(app_dir.encode()).hexdigest(), 16)

    # Pro tips
    tips = PRO_TIPS.get(hw, PRO_TIPS['browser'])
    ti = [(h+i) % len(tips) for i in range(2)]
    if ti[1] == ti[0]: ti[1] = (ti[1]+1) % len(tips)

    # Fun facts
    facts = FUN_FACTS.get(domain, FUN_FACTS['science'])
    fi = h % len(facts)

    # Common mistakes
    cm = COMMON_MISTAKES

    keys = {}
    keys['en'] = (
        f"proTipTitle:'💡 Pro Tips',"
        f"proTip1:'{_esc(tips[ti[0]][0])}',"
        f"proTip2:'{_esc(tips[ti[1]][0])}',"
        f"funFactTitle:'🎯 Did You Know?',"
        f"funFact:'{_esc(facts[fi][0])}',"
        f"mistakeTitle:'⚠️ Common Mistakes',"
        f"mistake1:'{_esc(cm['en'][0])}',"
        f"mistake2:'{_esc(cm['en'][1])}',"
        f"mistake3:'{_esc(cm['en'][2])}'"
    )
    keys['fr'] = (
        f"proTipTitle:'💡 Conseils de pro',"
        f"proTip1:'{_esc(tips[ti[0]][1])}',"
        f"proTip2:'{_esc(tips[ti[1]][1])}',"
        f"funFactTitle:'🎯 Le saviez-vous ?',"
        f"funFact:'{_esc(facts[fi][1])}',"
        f"mistakeTitle:'⚠️ Erreurs courantes',"
        f"mistake1:'{_esc(cm['fr'][0])}',"
        f"mistake2:'{_esc(cm['fr'][1])}',"
        f"mistake3:'{_esc(cm['fr'][2])}'"
    )
    keys['ar'] = (
        f"proTipTitle:'💡 نصائح احترافية',"
        f"proTip1:'{_esc(tips[ti[0]][2])}',"
        f"proTip2:'{_esc(tips[ti[1]][2])}',"
        f"funFactTitle:'🎯 هل تعلم؟',"
        f"funFact:'{_esc(facts[fi][2])}',"
        f"mistakeTitle:'⚠️ أخطاء شائعة',"
        f"mistake1:'{_esc(cm['ar'][0])}',"
        f"mistake2:'{_esc(cm['ar'][1])}',"
        f"mistake3:'{_esc(cm['ar'][2])}'"
    )
    return keys


def update_html(html_path):
    with open(html_path) as f:
        html = f.read()
    if 'proTipTitle' in html:
        return False

    block = (
        '<div class="wiki-entry"><h4 data-i18n="proTipTitle">Pro Tips</h4>'
        '<p data-i18n="proTip1"></p><p data-i18n="proTip2"></p></div>'
        '<div class="wiki-entry"><h4 data-i18n="funFactTitle">Did You Know?</h4>'
        '<p data-i18n="funFact"></p></div>'
        '<div class="wiki-entry"><h4 data-i18n="mistakeTitle">Common Mistakes</h4>'
        '<p data-i18n="mistake1"></p><p data-i18n="mistake2"></p>'
        '<p data-i18n="mistake3"></p></div>'
    )

    for anchor in ['wiki_safety">', 'wiki_concept">', 'experimentTitle">', 'realworldTitle">', 'theoryBlock">', 'helpGuide">']:
        idx = html.find(anchor)
        if idx != -1:
            close = html.find('</div>', idx)
            if close != -1:
                html = html[:close+6] + block + html[close+6:]
                with open(html_path, 'w') as f:
                    f.write(html)
                return True
    return False


def main():
    apps = sorted(glob.glob('[0-9]*-*/*/script.js'))
    print(f'Processing {len(apps)} apps...')
    stats = {'js': 0, 'html': 0, 'skip': 0, 'err': 0}

    for js_path in apps:
        try:
            with open(js_path) as f:
                js = f.read()

            if 'proTipTitle' in js:
                stats['skip'] += 1
                continue

            parts = js_path.split('/')
            cat_num = parts[0].split('-')[0]
            app_dir = parts[1] if len(parts) > 1 else ''
            ctx = extract_ctx(js)

            keys = build_keys(ctx, cat_num, app_dir)
            for lang in ('en', 'fr', 'ar'):
                js = inject(js, lang, keys[lang])

            with open(js_path, 'w') as f:
                f.write(js)
            stats['js'] += 1

            html_path = js_path.replace('script.js', 'index.html')
            if os.path.exists(html_path) and update_html(html_path):
                stats['html'] += 1

        except Exception as e:
            print(f'ERROR {js_path}: {e}')
            stats['err'] += 1

    print(f"Done: {stats['js']} JS, {stats['html']} HTML, {stats['skip']} skipped, {stats['err']} errors")

if __name__ == '__main__':
    main()
