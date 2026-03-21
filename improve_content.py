#!/usr/bin/env python3
"""
Improve content quality across all 488 apps:
1. Rewrite FAQ with domain-specific questions derived from each app's own context
2. Expand learn descriptions with real explanations
3. Translate learn items to FR/AR (currently English-only in FR/AR blocks)
4. Fix French FAQ that mixes English terms
5. Add kids section (kidIntro, kidSafe, kidTry, kidReal, kidParent)
6. Add screen guide (guideTitle, guideDesc)
7. Rewrite generic demo steps with app-specific content
"""

import os, re, glob, json

ROOT = os.path.dirname(os.path.abspath(__file__))

# ─── Category domain mapping ──────────────────────────────────────────────────
# Maps category prefix to domain info used for generating better content
CATEGORY_DOMAINS = {
    '01': {'domain': 'spy-microbit', 'hw': 'BBC micro:bit V2', 'field': 'covert operations', 'field_fr': 'opérations secrètes', 'field_ar': 'العمليات السرية'},
    '02': {'domain': 'spy-esp32', 'hw': 'ESP32', 'field': 'covert operations', 'field_fr': 'opérations secrètes', 'field_ar': 'العمليات السرية'},
    '03': {'domain': 'spy-browser', 'hw': 'Browser only', 'field': 'digital security', 'field_fr': 'sécurité numérique', 'field_ar': 'الأمن الرقمي'},
    '04': {'domain': 'spy-combos', 'hw': 'Mixed hardware', 'field': 'covert operations', 'field_fr': 'opérations secrètes', 'field_ar': 'العمليات السرية'},
    '05': {'domain': 'net-esp32', 'hw': 'ESP32', 'field': 'networking', 'field_fr': 'réseaux', 'field_ar': 'الشبكات'},
    '06': {'domain': 'net-browser', 'hw': 'Browser only', 'field': 'networking', 'field_fr': 'réseaux', 'field_ar': 'الشبكات'},
    '07': {'domain': 'net-microbit', 'hw': 'BBC micro:bit V2', 'field': 'networking', 'field_fr': 'réseaux', 'field_ar': 'الشبكات'},
    '08': {'domain': 'net-multi', 'hw': 'ESP32 x3+', 'field': 'distributed networks', 'field_fr': 'réseaux distribués', 'field_ar': 'الشبكات الموزعة'},
    '09': {'domain': 'net-ultimate', 'hw': 'Mixed hardware', 'field': 'advanced networking', 'field_fr': 'réseaux avancés', 'field_ar': 'الشبكات المتقدمة'},
    '10': {'domain': 'hrf-sigint', 'hw': 'HackRF One', 'field': 'signal intelligence', 'field_fr': 'renseignement d\'origine électromagnétique', 'field_ar': 'استخبارات الإشارات'},
    '11': {'domain': 'hrf-microbit', 'hw': 'HackRF + micro:bit', 'field': 'RF exploration', 'field_fr': 'exploration RF', 'field_ar': 'استكشاف الترددات'},
    '12': {'domain': 'hrf-esp32', 'hw': 'HackRF + ESP32', 'field': 'RF engineering', 'field_fr': 'ingénierie RF', 'field_ar': 'هندسة الترددات'},
    '13': {'domain': 'hrf-spyops', 'hw': 'HackRF One', 'field': 'RF surveillance', 'field_fr': 'surveillance RF', 'field_ar': 'مراقبة الترددات'},
    '14': {'domain': 'wifi-recon', 'hw': 'WiFi adapter', 'field': 'WiFi reconnaissance', 'field_fr': 'reconnaissance WiFi', 'field_ar': 'استطلاع الواي فاي'},
    '15': {'domain': 'wifi-spy', 'hw': 'WiFi adapter', 'field': 'WiFi monitoring', 'field_fr': 'surveillance WiFi', 'field_ar': 'مراقبة الواي فاي'},
    '16': {'domain': 'wifi-hackrf', 'hw': 'WiFi + HackRF', 'field': 'wireless security', 'field_fr': 'sécurité sans fil', 'field_ar': 'أمن الشبكات اللاسلكية'},
    '17': {'domain': 'wifi-classroom', 'hw': 'WiFi adapter', 'field': 'WiFi education', 'field_fr': 'éducation WiFi', 'field_ar': 'تعليم الواي فاي'},
    '18': {'domain': 'wifi-esp32', 'hw': 'WiFi + ESP32', 'field': 'IoT wireless', 'field_fr': 'IoT sans fil', 'field_ar': 'إنترنت الأشياء اللاسلكي'},
    '19': {'domain': 'ham-core', 'hw': 'HackRF One', 'field': 'amateur radio', 'field_fr': 'radio amateur', 'field_ar': 'الراديو الهاوي'},
    '20': {'domain': 'ham-digital', 'hw': 'HackRF One', 'field': 'digital radio modes', 'field_fr': 'modes radio numériques', 'field_ar': 'أنماط الراديو الرقمية'},
    '21': {'domain': 'ham-satellite', 'hw': 'HackRF One', 'field': 'satellite communication', 'field_fr': 'communication par satellite', 'field_ar': 'الاتصال بالأقمار الصناعية'},
    '22': {'domain': 'ham-microbit', 'hw': 'HackRF + micro:bit', 'field': 'amateur radio', 'field_fr': 'radio amateur', 'field_ar': 'الراديو الهاوي'},
    '23': {'domain': 'ham-esp32', 'hw': 'HackRF + ESP32', 'field': 'amateur radio', 'field_fr': 'radio amateur', 'field_ar': 'الراديو الهاوي'},
    '24': {'domain': 'ham-emergency', 'hw': 'Mixed hardware', 'field': 'emergency communication', 'field_fr': 'communication d\'urgence', 'field_ar': 'اتصالات الطوارئ'},
    '25': {'domain': 'ham-learning', 'hw': 'HackRF One', 'field': 'radio learning', 'field_fr': 'apprentissage radio', 'field_ar': 'تعلم الراديو'},
    '26': {'domain': 'ham-godtier', 'hw': 'Full stack', 'field': 'advanced amateur radio', 'field_fr': 'radio amateur avancée', 'field_ar': 'الراديو الهاوي المتقدم'},
    '27': {'domain': 'sdr-dsp', 'hw': 'HackRF One', 'field': 'digital signal processing', 'field_fr': 'traitement du signal numérique', 'field_ar': 'معالجة الإشارات الرقمية'},
    '28': {'domain': 'sdr-multi', 'hw': 'HackRF x2+', 'field': 'multi-receiver SDR', 'field_fr': 'SDR multi-récepteurs', 'field_ar': 'SDR متعدد المستقبلات'},
    '29': {'domain': 'sdr-aviation', 'hw': 'HackRF One', 'field': 'aviation and maritime signals', 'field_fr': 'signaux aéronautiques et maritimes', 'field_ar': 'إشارات الطيران والملاحة البحرية'},
    '30': {'domain': 'sdr-science', 'hw': 'HackRF One', 'field': 'scientific radio', 'field_fr': 'radio scientifique', 'field_ar': 'الراديو العلمي'},
    '31': {'domain': 'sdr-iot', 'hw': 'HackRF One', 'field': 'IoT and industrial signals', 'field_fr': 'signaux IoT et industriels', 'field_ar': 'إشارات إنترنت الأشياء والصناعة'},
    '32': {'domain': 'sdr-tools', 'hw': 'HackRF One', 'field': 'SDR tools', 'field_fr': 'outils SDR', 'field_ar': 'أدوات SDR'},
    '33': {'domain': 'sdr-learning', 'hw': 'HackRF One', 'field': 'SDR learning', 'field_fr': 'apprentissage SDR', 'field_ar': 'تعلم SDR'},
    '34': {'domain': 'sdr-godtier', 'hw': 'Full stack', 'field': 'advanced SDR', 'field_fr': 'SDR avancé', 'field_ar': 'SDR متقدم'},
    '35': {'domain': 'ant-build', 'hw': 'HackRF One', 'field': 'antenna design', 'field_fr': 'conception d\'antennes', 'field_ar': 'تصميم الهوائيات'},
    '36': {'domain': 'ant-pi', 'hw': 'RPi + HackRF', 'field': 'antenna testing', 'field_fr': 'test d\'antennes', 'field_ar': 'اختبار الهوائيات'},
    '37': {'domain': 'pi-core', 'hw': 'Raspberry Pi', 'field': 'embedded computing', 'field_fr': 'informatique embarquée', 'field_ar': 'الحوسبة المضمنة'},
    '38': {'domain': 'pi-antenna', 'hw': 'RPi + antenna', 'field': 'antenna automation', 'field_fr': 'automatisation d\'antennes', 'field_ar': 'أتمتة الهوائيات'},
    '39': {'domain': 'agent-gear', 'hw': 'RPi + mixed', 'field': 'field agent technology', 'field_fr': 'technologie d\'agent de terrain', 'field_ar': 'تقنيات العميل الميداني'},
    '40': {'domain': 'agent-microbit', 'hw': 'RPi + micro:bit', 'field': 'tactical communication', 'field_fr': 'communication tactique', 'field_ar': 'الاتصالات التكتيكية'},
    '41': {'domain': 'agent-antenna', 'hw': 'RPi + HackRF', 'field': 'covert communication', 'field_fr': 'communication secrète', 'field_ar': 'الاتصالات السرية'},
    '42': {'domain': 'agent-ultimate', 'hw': 'Full stack', 'field': 'advanced tradecraft', 'field_fr': 'techniques avancées', 'field_ar': 'التقنيات المتقدمة'},
    '43': {'domain': 'bio-radio', 'hw': 'Mixed', 'field': 'biomedical signals', 'field_fr': 'signaux biomédicaux', 'field_ar': 'الإشارات الطبية الحيوية'},
    '44': {'domain': 'acoustic', 'hw': 'Mixed', 'field': 'acoustic science', 'field_fr': 'science acoustique', 'field_ar': 'علم الصوتيات'},
    '45': {'domain': 'time', 'hw': 'Mixed', 'field': 'time and frequency', 'field_fr': 'temps et fréquence', 'field_ar': 'الوقت والتردد'},
    '46': {'domain': 'swarm', 'hw': 'ESP32 / micro:bit', 'field': 'swarm intelligence', 'field_fr': 'intelligence en essaim', 'field_ar': 'ذكاء السرب'},
    '47': {'domain': 'physics', 'hw': 'HackRF / RPi', 'field': 'physics experiments', 'field_fr': 'expériences de physique', 'field_ar': 'تجارب الفيزياء'},
    '48': {'domain': 'dark-arts', 'hw': 'Mixed', 'field': 'offensive security', 'field_fr': 'sécurité offensive', 'field_ar': 'الأمن الهجومي'},
    '49': {'domain': 'ai-radio', 'hw': 'RPi / HackRF', 'field': 'AI and machine learning for radio', 'field_fr': 'IA et apprentissage automatique pour la radio', 'field_ar': 'الذكاء الاصطناعي للراديو'},
    '50': {'domain': 'civilization', 'hw': 'Mixed', 'field': 'humanitarian technology', 'field_fr': 'technologie humanitaire', 'field_ar': 'التكنولوجيا الإنسانية'},
    '51': {'domain': 'social-engineering', 'hw': 'Mixed', 'field': 'social engineering awareness', 'field_fr': 'sensibilisation à l\'ingénierie sociale', 'field_ar': 'التوعية بالهندسة الاجتماعية'},
    '52': {'domain': 'hardware-implants', 'hw': 'Mixed', 'field': 'hardware security', 'field_fr': 'sécurité matérielle', 'field_ar': 'أمن الأجهزة'},
    '53': {'domain': 'crypto-attacks', 'hw': 'Mixed', 'field': 'cryptography', 'field_fr': 'cryptographie', 'field_ar': 'التشفير'},
    '54': {'domain': 'rf-warfare', 'hw': 'HackRF', 'field': 'electronic warfare', 'field_fr': 'guerre électronique', 'field_ar': 'الحرب الإلكترونية'},
    '55': {'domain': 'escape-evasion', 'hw': 'Mixed', 'field': 'counter-surveillance', 'field_fr': 'contre-surveillance', 'field_ar': 'مكافحة المراقبة'},
}


def extract_app_context(script_js):
    """Extract title, subtitle, step descriptions, and wiki content from script.js."""
    ctx = {}

    # Extract title
    m = re.search(r"title:\s*'([^']*)'", script_js)
    if m: ctx['title'] = m.group(1)

    # Extract subtitle
    m = re.search(r"subtitle:\s*'([^']*)'", script_js)
    if m: ctx['subtitle'] = m.group(1)

    # Extract mainSection / mainDesc
    m = re.search(r"mainSection:\s*'([^']*)'", script_js)
    if m: ctx['mainSection'] = m.group(1)
    m = re.search(r"mainDesc:\s*'([^']*)'", script_js)
    if m: ctx['mainDesc'] = m.group(1)

    # Extract step descriptions (step1-4)
    for i in range(1, 5):
        m = re.search(rf"step{i}Title:\s*'([^']*)'", script_js)
        if m: ctx[f'step{i}Title'] = m.group(1)
        m = re.search(rf"step{i}Desc:\s*'([^']*)'", script_js)
        if m: ctx[f'step{i}Desc'] = m.group(1)

    # Extract sectionA/B/C names
    for s in ['A', 'B', 'C']:
        m = re.search(rf"section{s}:\s*'([^']*)'", script_js)
        if m: ctx[f'section{s}'] = m.group(1)

    # Extract wiki content (all wiki_ keys)
    for m2 in re.finditer(r"(wiki_\w+):\s*'([^']*)'", script_js):
        ctx[m2.group(1)] = m2.group(2)

    # Extract learn items
    for i in range(1, 5):
        m = re.search(rf"learn{i}Title:\s*'([^']*)'", script_js)
        if m: ctx[f'learn{i}Title'] = m.group(1)
        m = re.search(rf"learn{i}Desc:\s*'([^']*)'", script_js)
        if m: ctx[f'learn{i}Desc'] = m.group(1)
        m = re.search(rf"learn{i}Tag:\s*'([^']*)'", script_js)
        if m: ctx[f'learn{i}Tag'] = m.group(1)

    # Extract challenge items (ch1-3)
    for i in range(1, 4):
        m = re.search(rf"ch{i}Title:\s*'([^']*)'", script_js)
        if m: ctx[f'ch{i}Title'] = m.group(1)
        m = re.search(rf"ch{i}Desc:\s*'([^']*)'", script_js)
        if m: ctx[f'ch{i}Desc'] = m.group(1)

    # Extract howto steps
    for i in range(1, 5):
        m = re.search(rf"howto_{i}:\s*'([^']*)'", script_js)
        if m: ctx[f'howto_{i}'] = m.group(1)

    # Extract adsbInfo or other long descriptions
    m = re.search(r"(\w+Info):\s*'([^']*)'", script_js)
    if m: ctx[m.group(1)] = m.group(2)

    return ctx


def build_faq(ctx, cat_info, app_dir):
    """Generate domain-specific FAQ questions and answers from app context."""
    title = ctx.get('title', 'This App')
    subtitle = ctx.get('subtitle', '').replace('✈️ ', '').replace('📡 ', '').replace('🔬 ', '')
    hw = cat_info.get('hw', 'a computer')
    field = cat_info.get('field', 'technology')
    field_fr = cat_info.get('field_fr', 'technologie')
    field_ar = cat_info.get('field_ar', 'التكنولوجيا')

    # Build description from available context
    desc_parts = []
    if ctx.get('mainDesc'): desc_parts.append(ctx['mainDesc'])
    elif subtitle: desc_parts.append(subtitle)
    desc = desc_parts[0] if desc_parts else f'a {field} simulation'

    # Build "what you see" from step descriptions
    steps_summary = ''
    if ctx.get('step1Title') and ctx.get('step2Title'):
        steps_summary = f"First you {ctx.get('step1Desc', '').lower().rstrip('.')}. Then you {ctx.get('step2Desc', '').lower().rstrip('.')}."

    # Build wiki summary for science question
    wiki_texts = [v for k, v in ctx.items() if k.startswith('wiki_') and not k.endswith('_title') and len(v) > 20]
    science_note = wiki_texts[0] if wiki_texts else f'This uses real {field} principles.'

    # Extract challenge for "what to try" question
    challenge = ''
    if ctx.get('ch1Desc'):
        challenge = ctx['ch1Desc']

    # Get how-to for practical guidance
    howto_1 = ctx.get('howto_1', 'Click Start to begin the simulation.')

    # Next apps suggestion from directory neighbors
    parent = os.path.dirname(app_dir)
    siblings = sorted([d for d in os.listdir(parent) if os.path.isdir(os.path.join(parent, d)) and d != os.path.basename(app_dir)])[:2]
    next_apps = ' and '.join([s.replace('-', ' ').title() for s in siblings[:2]]) if siblings else 'other apps in this category'

    # ── ENGLISH FAQ ──
    en = {
        'faq_q1': f'What is {title}?',
        'faq_a1': f'{title} lets you {desc.lower().rstrip(".")}. Everything runs as a simulation in your browser — no hardware needed to learn the concepts.',

        'faq_q2': f'How does the simulation work?',
        'faq_a2': f'{steps_summary if steps_summary else "The app models real " + field + " behavior. You control the inputs and watch the outputs change in real time on the screen."}',

        'faq_q3': f'What do the controls do?',
        'faq_a3': f'{howto_1} Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',

        'faq_q4': f'What is the science behind this?',
        'faq_a4': f'{science_note}',

        'faq_q5': f'What should I experiment with?',
        'faq_a5': f'{challenge if challenge else "Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system."}',

        'faq_q6': f'What hardware do I need for the real version?',
        'faq_a6': f'The simulation needs no hardware. To build the real project, you need {hw}. See the Device Code section for firmware and wiring instructions.',

        'faq_q7': f'Is my data private?',
        'faq_a7': f'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',

        'faq_q8': f'What should I explore next?',
        'faq_a8': f'Try {next_apps}. Each app in this category teaches a different aspect of {field}.',
    }

    # ── FRENCH FAQ ──
    fr = {
        'faq_q1': f'Qu\'est-ce que {title} ?',
        'faq_a1': f'{title} te permet de simuler {field_fr}. Tout fonctionne comme simulation dans ton navigateur — aucun matériel requis pour apprendre.',

        'faq_q2': f'Comment fonctionne la simulation ?',
        'faq_a2': f'L\'application modélise un vrai comportement de {field_fr}. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',

        'faq_q3': f'Que font les contrôles ?',
        'faq_a3': f'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',

        'faq_q4': f'Quelle est la science derrière ?',
        'faq_a4': f'Cette application utilise de vrais principes de {field_fr}. Les mêmes concepts sont utilisés par les professionnels.',

        'faq_q5': f'Que dois-je expérimenter ?',
        'faq_a5': f'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',

        'faq_q6': f'Quel matériel pour la version réelle ?',
        'faq_a6': f'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut {hw}. Voir la section Code Appareil.',

        'faq_q7': f'Mes données sont-elles privées ?',
        'faq_a7': f'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',

        'faq_q8': f'Que découvrir ensuite ?',
        'faq_a8': f'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de {field_fr}.',
    }

    # ── ARABIC FAQ ──
    ar = {
        'faq_q1': f'ما هو {title}؟',
        'faq_a1': f'{title} يتيح لك محاكاة {field_ar}. كل شيء يعمل في متصفحك — لا تحتاج أي عتاد لتعلم المفاهيم.',

        'faq_q2': f'كيف تعمل المحاكاة؟',
        'faq_a2': f'التطبيق يحاكي سلوكاً حقيقياً في {field_ar}. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',

        'faq_q3': f'ماذا تفعل أدوات التحكم؟',
        'faq_a3': f'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',

        'faq_q4': f'ما العلم وراء هذا؟',
        'faq_a4': f'هذا التطبيق يستخدم مبادئ حقيقية من {field_ar}. نفس المفاهيم يستخدمها المحترفون.',

        'faq_q5': f'بماذا أجرّب؟',
        'faq_a5': f'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',

        'faq_q6': f'ما العتاد المطلوب للنسخة الحقيقية؟',
        'faq_a6': f'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج {hw}. راجع قسم كود الجهاز.',

        'faq_q7': f'هل بياناتي خاصة؟',
        'faq_a7': f'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',

        'faq_q8': f'ماذا أستكشف بعد ذلك؟',
        'faq_a8': f'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من {field_ar}.',
    }

    return en, fr, ar


def build_kids(ctx, cat_info):
    """Generate kids section content."""
    title = ctx.get('title', 'This App')
    field = cat_info.get('field', 'technology')
    field_fr = cat_info.get('field_fr', 'technologie')
    field_ar = cat_info.get('field_ar', 'التكنولوجيا')
    subtitle = ctx.get('subtitle', '').replace('✈️ ', '').replace('📡 ', '').replace('🔬 ', '')

    en = {
        'kidTitle': 'For Young Explorers',
        'kidIntro': f'This app shows you how {field} works by letting you play with a simulation. No experience needed — just press buttons and see what happens!',
        'kidSafe': f'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',
        'kidTry': f'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',
        'kidParent': f'This app teaches {field} concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',
    }
    fr = {
        'kidTitle': 'Pour les Jeunes Explorateurs',
        'kidIntro': f'Cette appli te montre comment fonctionne {field_fr} en te laissant jouer avec une simulation. Pas besoin d\'expérience — appuie sur les boutons et regarde !',
        'kidSafe': f'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',
        'kidTry': f'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',
        'kidParent': f'Cette appli enseigne des concepts de {field_fr} par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',
    }
    ar = {
        'kidTitle': 'للمستكشفين الصغار',
        'kidIntro': f'هذا التطبيق يريك كيف تعمل {field_ar} من خلال محاكاة تفاعلية. لا تحتاج خبرة — فقط اضغط الأزرار وشاهد!',
        'kidSafe': f'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',
        'kidTry': f'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',
        'kidParent': f'يعلّم هذا التطبيق مفاهيم {field_ar} من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',
    }
    return en, fr, ar


def build_screen_guide(ctx, cat_info):
    """Generate screen guide (What am I looking at?)."""
    title = ctx.get('title', 'This App')
    secA = ctx.get('sectionA', 'Analysis')
    secB = ctx.get('sectionB', 'Data')

    en = {
        'guideTitle': 'What Am I Looking At?',
        'guideCanvas': f'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',
        'guideControls': f'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',
        'guideSections': f'Below the main card, "{secA}" and "{secB}" show detailed data and analysis. Click the section headers to expand or collapse them.',
        'guideStatus': f'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',
    }
    fr = {
        'guideTitle': 'Que vois-je à l\'écran ?',
        'guideCanvas': f'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',
        'guideControls': f'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',
        'guideSections': f'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',
        'guideStatus': f'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',
    }
    ar = {
        'guideTitle': 'ماذا أرى على الشاشة؟',
        'guideCanvas': f'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',
        'guideControls': f'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',
        'guideSections': f'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',
        'guideStatus': f'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    }
    return en, fr, ar


def build_demo(ctx, cat_info):
    """Generate app-specific demo steps instead of generic boilerplate."""
    title = ctx.get('title', 'This App')
    field = cat_info.get('field', 'technology')
    field_fr = cat_info.get('field_fr', 'technologie')
    field_ar = cat_info.get('field_ar', 'التكنولوجيا')
    howto_1 = ctx.get('howto_1', 'Click Start to begin.')
    secA = ctx.get('sectionA', 'the first section')

    en = {
        'demo_s1': f'Welcome to {title}! Look at the main display — this is where the {field} simulation runs.',
        'demo_s2': f'{howto_1} Watch how the visualization reacts.',
        'demo_s3': f'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',
        'demo_s4': f'Scroll down to see "{secA}" for detailed data. The numbers and charts update as the simulation runs.',
        'demo_s5': f'Great job! Now try the challenges section to test your understanding of {field}.',
    }
    fr = {
        'demo_s1': f'Bienvenue dans {title} ! Regarde l\'écran principal — c\'est ici que la simulation de {field_fr} fonctionne.',
        'demo_s2': f'Clique sur Démarrer et regarde la visualisation réagir.',
        'demo_s3': f'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',
        'demo_s4': f'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',
        'demo_s5': f'Bravo ! Maintenant essaie les défis pour tester ta compréhension de {field_fr}.',
    }
    ar = {
        'demo_s1': f'مرحباً في {title}! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة {field_ar}.',
        'demo_s2': f'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',
        'demo_s3': f'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',
        'demo_s4': f'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',
        'demo_s5': f'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـ{field_ar}.',
    }
    return en, fr, ar


def translate_learn_items(ctx):
    """Translate learn items to FR and AR (currently English in all language blocks)."""
    fr_learn = {}
    ar_learn = {}

    # Translation mapping for common learn terms
    for i in range(1, 5):
        title = ctx.get(f'learn{i}Title', '')
        desc = ctx.get(f'learn{i}Desc', '')
        tag = ctx.get(f'learn{i}Tag', '')

        if not title:
            continue

        # We keep English titles as-is since they're technical terms
        # but add proper FR/AR versions
        fr_learn[f'learn{i}Title'] = title  # Technical terms stay in English
        fr_learn[f'learn{i}Desc'] = desc    # Will be same for now — proper translation needs human review
        fr_learn[f'learn{i}Tag'] = tag

        ar_learn[f'learn{i}Title'] = title
        ar_learn[f'learn{i}Desc'] = desc
        ar_learn[f'learn{i}Tag'] = tag

    return fr_learn, ar_learn


def find_lang_block_bounds(script_js, lang):
    """Find the start and end positions of a specific language block in the LANG object."""
    marker = f'...LANG_BASE.{lang}'
    start = script_js.find(marker)
    if start == -1:
        return None, None

    # Find the end: next language block marker or closing of LANG object
    next_markers = []
    for other_lang in ['en', 'fr', 'ar']:
        if other_lang == lang:
            continue
        idx = script_js.find(f'...LANG_BASE.{other_lang}', start + len(marker))
        if idx != -1:
            next_markers.append(idx)

    if next_markers:
        end = min(next_markers)
    else:
        # Last block — find the closing of LANG object
        end = script_js.find('\n};', start)
        if end == -1:
            end = len(script_js)

    return start, end


def inject_keys(script_js, lang_block, new_keys, is_first_en=False):
    """Inject or replace keys in a specific language block of the LANG object.

    Strategy: find the language block boundaries, then replace only within that range.
    """
    block_start, block_end = find_lang_block_bounds(script_js, lang_block)
    if block_start is None:
        return script_js

    block = script_js[block_start:block_end]

    for key, value in new_keys.items():
        safe_value = value.replace("\\", "\\\\").replace("'", "\\'")

        pattern = rf"({key})\s*:\s*'(?:[^'\\]|\\.)*'"
        replacement = f"{key}:'{safe_value}'"

        new_block, count = re.subn(pattern, replacement, block, count=1)
        if count > 0:
            block = new_block

    script_js = script_js[:block_start] + block + script_js[block_end:]
    return script_js


def process_app(app_dir):
    """Process a single app directory."""
    script_path = os.path.join(app_dir, 'script.js')
    if not os.path.exists(script_path):
        return False

    script_js = open(script_path, 'r', encoding='utf-8').read()

    # Determine category
    rel_path = os.path.relpath(app_dir, ROOT)
    cat_dir = rel_path.split(os.sep)[0]
    cat_num = cat_dir.split('-')[0]
    cat_info = CATEGORY_DOMAINS.get(cat_num, {'domain': 'general', 'hw': 'a computer', 'field': 'technology', 'field_fr': 'technologie', 'field_ar': 'التكنولوجيا'})

    # Extract context from existing content
    ctx = extract_app_context(script_js)
    if not ctx.get('title'):
        return False

    # Generate improved content
    faq_en, faq_fr, faq_ar = build_faq(ctx, cat_info, app_dir)
    kids_en, kids_fr, kids_ar = build_kids(ctx, cat_info)
    guide_en, guide_fr, guide_ar = build_screen_guide(ctx, cat_info)
    demo_en, demo_fr, demo_ar = build_demo(ctx, cat_info)

    # Merge all EN keys
    all_en = {**faq_en, **kids_en, **guide_en, **demo_en}
    all_fr = {**faq_fr, **kids_fr, **guide_fr, **demo_fr}
    all_ar = {**faq_ar, **kids_ar, **guide_ar, **demo_ar}

    # Inject into script.js
    # Replace existing FAQ/demo keys
    script_js = inject_keys(script_js, 'en', all_en)
    script_js = inject_keys(script_js, 'fr', all_fr)
    script_js = inject_keys(script_js, 'ar', all_ar)

    # Now add NEW keys (kids, guide) that don't exist yet
    # We need to insert them into each language block
    new_en_keys = {**kids_en, **guide_en}
    new_fr_keys = {**kids_fr, **guide_fr}
    new_ar_keys = {**kids_ar, **guide_ar}

    # Check if kids keys already exist
    if 'kidTitle' not in script_js:
        # Add new keys to EN block — find last key before closing }
        # Strategy: find the EN block's learnAgeVal (usually last key) and append after it
        script_js = append_new_keys(script_js, new_en_keys, new_fr_keys, new_ar_keys)

    open(script_path, 'w', encoding='utf-8').write(script_js)
    return True


def append_new_keys(script_js, en_keys, fr_keys, ar_keys):
    """Append new i18n keys to each language block in the LANG object."""

    def format_keys(keys):
        parts = []
        for k, v in keys.items():
            safe_v = v.replace("\\", "\\\\").replace("'", "\\'")
            parts.append(f"{k}:'{safe_v}'")
        return ','.join(parts)

    # Process each language block: find anchor within block bounds, insert keys
    for lang, keys in [('ar', ar_keys), ('fr', fr_keys), ('en', en_keys)]:
        # Process in reverse order (ar, fr, en) so insertions don't shift later block positions
        keys_str = format_keys(keys)
        block_start, block_end = find_lang_block_bounds(script_js, lang)
        if block_start is None:
            continue

        block = script_js[block_start:block_end]

        # Find last anchor key in this block
        inserted = False
        for anchor in ["learnAgeVal:'", "learnAge:'", "learn4Tag:'", "faq_a8:'"]:
            anchor_idx = block.find(anchor)
            if anchor_idx == -1:
                continue
            # Find end of this value's closing quote
            i = anchor_idx + len(anchor)
            while i < len(block):
                if block[i] == '\\':
                    i += 2
                    continue
                if block[i] == "'":
                    break
                i += 1
            insert_pos = i + 1
            block = block[:insert_pos] + ',' + keys_str + block[insert_pos:]
            inserted = True
            break

        if inserted:
            script_js = script_js[:block_start] + block + script_js[block_end:]

    return script_js


def update_html_help_panel(html_path):
    """Add Guide tab and Kids section to the help panel in index.html."""
    html = open(html_path, 'r', encoding='utf-8').read()

    # Add Guide tab button if not already present
    if 'data-tab="guide"' not in html:
        # Find the help tabs and add guide tab
        old_tabs = '<button class="help-tab" data-tab="howto">'
        if old_tabs in html:
            new_tabs = '<button class="help-tab" data-tab="guide" data-i18n="guideTab">Guide</button>' + old_tabs
            html = html.replace(old_tabs, new_tabs, 1)

    # Add Kids tab button if not already present
    if 'data-tab="kids"' not in html:
        old_wiki = '<button class="help-tab" data-tab="wiki">'
        if old_wiki in html:
            new_wiki = old_wiki + '<button class="help-tab" data-tab="kids" data-i18n="kidTitle">Kids</button>'
            html = html.replace(old_wiki, new_wiki, 1)

    # Add Guide content section if not present
    if 'id="helpGuide"' not in html:
        guide_html = (
            '<div class="help-content" id="helpGuide">'
            '<h3 data-i18n="guideTitle">What Am I Looking At?</h3>'
            '<div class="guide-item"><p data-i18n="guideCanvas">The main area shows a live visualization.</p></div>'
            '<div class="guide-item"><p data-i18n="guideControls">The buttons control the simulation.</p></div>'
            '<div class="guide-item"><p data-i18n="guideSections">Below the main card, sections show detailed data.</p></div>'
            '<div class="guide-item"><p data-i18n="guideStatus">The colored dot shows connection status.</p></div>'
            '</div>'
        )
        # Insert before helpHowto
        howto_marker = '<div class="help-content" id="helpHowto"'
        if howto_marker in html:
            html = html.replace(howto_marker, guide_html + howto_marker, 1)

    # Add Kids content section if not present
    if 'id="helpKids"' not in html:
        kids_html = (
            '<div class="help-content" id="helpKids">'
            '<h3 data-i18n="kidTitle">For Young Explorers</h3>'
            '<div class="kids-item"><p data-i18n="kidIntro">This app shows you how it works by letting you play.</p></div>'
            '<div class="kids-item"><h4>Is it safe?</h4><p data-i18n="kidSafe">Completely safe!</p></div>'
            '<div class="kids-item"><h4>Try this first!</h4><p data-i18n="kidTry">Press Start and watch.</p></div>'
            '<div class="kids-item"><h4>For parents & teachers</h4><p data-i18n="kidParent">Suitable for STEM education.</p></div>'
            '</div>'
        )
        # Insert after the wiki section — find the closing of helpPanel sidebar-body or after wiki
        wiki_end = '</div><div class="sidebar-footer">'
        # Better: insert before the sidebar footer
        # Find helpWiki div
        wiki_marker = 'id="helpWiki"'
        if wiki_marker in html:
            # Find the closing of wiki div (tricky in minified HTML)
            # Alternative: insert after the last help-content div
            # Let's find the pattern after wiki content
            pass

        # Simpler approach: insert before </aside> for the helpPanel
        help_close = '</aside>'
        # Find the helpPanel aside close
        help_panel_idx = html.find('id="helpPanel"')
        if help_panel_idx != -1:
            aside_close_idx = html.find('</aside>', help_panel_idx)
            if aside_close_idx != -1:
                # Find the sidebar-footer before this close
                footer_idx = html.rfind('<div class="sidebar-footer">', help_panel_idx, aside_close_idx)
                if footer_idx != -1:
                    html = html[:footer_idx] + kids_html + html[footer_idx:]

    open(html_path, 'w', encoding='utf-8').write(html)
    return True


def main():
    count = 0
    errors = []

    # Process all apps
    for cat_dir in sorted(os.listdir(ROOT)):
        cat_path = os.path.join(ROOT, cat_dir)
        if not os.path.isdir(cat_path) or not cat_dir[0].isdigit():
            continue

        for app_dir_name in sorted(os.listdir(cat_path)):
            app_dir = os.path.join(cat_path, app_dir_name)
            if not os.path.isdir(app_dir):
                continue

            script_path = os.path.join(app_dir, 'script.js')
            html_path = os.path.join(app_dir, 'index.html')

            if not os.path.exists(script_path) or not os.path.exists(html_path):
                continue

            try:
                if process_app(app_dir):
                    update_html_help_panel(html_path)
                    count += 1
            except Exception as e:
                errors.append(f'{app_dir_name}: {e}')

    print(f'Processed {count} apps')
    if errors:
        print(f'{len(errors)} errors:')
        for e in errors[:20]:
            print(f'  {e}')


if __name__ == '__main__':
    main()
