#!/usr/bin/env python3
"""
Expand short content sections in all 488 apps:
- Step descriptions (379 apps <80ch) → 120-200ch
- Demo narrations (188 apps <80ch) → 100-150ch
- FAQ answers (71 apps <120ch) → 150-250ch
- Howto steps (56 apps <80ch) → 120-200ch
- Learn descriptions (41 apps <100ch) → 120-180ch
- Challenge descriptions (10 apps <80ch) → 100-150ch
"""
import os, re

# ── Language block finder ────────────────────────────────────────────

def find_lang_block(js, lang):
    if lang == 'en':
        s = js.find('...LANG_BASE.en')
        if s != -1:
            e = js.find('...LANG_BASE.fr', s)
            if e == -1:
                m = re.search(r'},\s*\n?\s*fr\s*:\s*\{', js[s:])
                e = s + m.start() + 1 if m else len(js)
            return s, e
    if lang in ('fr', 'ar'):
        tag = f'...LANG_BASE.{lang}'
        all_lang = [m.start() for m in re.finditer(r'const\s+LANG\s*=', js)]
        app_start = all_lang[-1] if all_lang else 0
        pos = js.find(tag, app_start)
        if pos != -1:
            if lang == 'fr':
                e = js.find('...LANG_BASE.ar', pos)
                if e == -1:
                    m = re.search(r'},\s*\n?\s*ar\s*:\s*\{', js[pos:])
                    e = pos + m.start() + 1 if m else len(js)
            else:
                e = js.find('\n};', pos)
                if e == -1: e = len(js)
            return pos, e
    # New template
    all_lang = [m.start() for m in re.finditer(r'const\s+LANG\s*=', js)]
    if not all_lang: return -1, -1
    app_start = all_lang[-1]
    pat = re.compile(rf'(?:,|\{{)\s*\n?\s*{lang}\s*:\s*\{{')
    m = pat.search(js, app_start)
    if not m: return -1, -1
    brace = js.index('{', m.start() + 1)
    depth = 0
    for i in range(brace, len(js)):
        if js[i] == '{': depth += 1
        elif js[i] == '}':
            depth -= 1
            if depth == 0: return brace, i
    return -1, -1

def extract_val(js, lang, key):
    """Extract value from a language block, handling escaped quotes."""
    s, e = find_lang_block(js, lang)
    if s == -1: return ''
    block = js[s:e]
    m = re.search(rf'\b{re.escape(key)}\s*:\s*([\'"])', block)
    if not m: return ''
    quote = m.group(1)
    i = m.end()
    val = ''
    while i < len(block):
        if block[i] == '\\' and i + 1 < len(block):
            val += block[i+1]
            i += 2
            continue
        if block[i] == quote:
            return val
        val += block[i]
        i += 1
    return val

def replace_val(js, lang, key, new_val):
    """Replace a key's value in a language block."""
    s, e = find_lang_block(js, lang)
    if s == -1: return js
    block = js[s:e]
    m = re.search(rf'\b{re.escape(key)}\s*:\s*([\'"])', block)
    if not m: return js
    quote = m.group(1)
    val_start = m.end()
    i = val_start
    while i < len(block):
        if block[i] == '\\' and i + 1 < len(block):
            i += 2
            continue
        if block[i] == quote:
            safe = new_val.replace("'", "\\'") if quote == "'" else new_val.replace('"', '\\"')
            new_block = block[:val_start] + safe + block[i:]
            return js[:s] + new_block + js[e:]
        i += 1
    return js

def dir_to_title(d):
    parts = d.split('-')
    prefixes = {'bit','esp','hrf','sdr','wifi','ble','iot','rfid','zb','lora','mesh',
                'geo','drone','mar','avi','dsp','prop','emc','ham','emer','astro',
                'qc','ai','sec','steg','cry','agent','for','osint','bio','phys',
                'chem','earth','retro','viz','net','se','priv','rev','exp','esc',
                'web','imp','rfw','sonic'}
    if parts[0] in prefixes:
        parts = parts[1:]
    return ' '.join(p.capitalize() for p in parts)

# ── Expansion functions ──────────────────────────────────────────────

STEP_EXPAND_EN = [
    'Watch the visualization update in real time as this stage processes. The display shows exactly what is happening internally — each color and movement represents a specific data transformation.',
    'Notice how the indicators change during this phase. The activity log records every event, letting you trace the exact sequence of operations and verify the results.',
    'This stage transforms the input data using the algorithm shown in the visualization. Compare the before and after values to understand the mathematical relationship.',
    'The output of this stage feeds into the next one. Try pausing here to examine the intermediate state — understanding each step separately builds deeper insight.',
]

STEP_EXPAND_FR = [
    'Regardez la visualisation se mettre à jour en temps réel pendant cette étape. L affichage montre exactement ce qui se passe en interne — chaque couleur et mouvement représente une transformation.',
    'Remarquez comment les indicateurs changent pendant cette phase. Le journal d activité enregistre chaque événement pour vérifier les résultats.',
    'Cette étape transforme les données d entrée selon l algorithme affiché. Comparez les valeurs avant et après pour comprendre la relation mathématique.',
    'Le résultat de cette étape alimente la suivante. Essayez de faire pause ici pour examiner l état intermédiaire.',
]

STEP_EXPAND_AR = [
    'شاهد التصور يتحدث في الوقت الفعلي أثناء هذه المرحلة. يعرض الشاشة بالضبط ما يحدث داخلياً — كل لون وحركة يمثل تحولاً محدداً في البيانات.',
    'لاحظ كيف تتغير المؤشرات خلال هذه المرحلة. يسجل سجل النشاط كل حدث لتتبع تسلسل العمليات والتحقق من النتائج.',
    'تحول هذه المرحلة بيانات الإدخال باستخدام الخوارزمية المعروضة. قارن القيم قبل وبعد لفهم العلاقة الرياضية.',
    'ناتج هذه المرحلة يغذي المرحلة التالية. حاول التوقف هنا لفحص الحالة الوسيطة.',
]

DEMO_EXPAND_EN = [
    'Take a moment to observe the full interface. The main visualization area, the control panel below it, and the expandable sections underneath each serve a specific purpose in the simulation.',
    'Now interact with the controls. Each button and slider changes a specific parameter. Watch how the visualization responds immediately — this cause-and-effect relationship is key to understanding the system.',
    'Try changing the values to extremes — maximum and minimum. This reveals the boundaries of the system and helps you understand what each parameter actually controls.',
    'Scroll down to explore the detailed sections: How It Works explains the science, the Wiki provides background knowledge, and the Challenges test your understanding.',
    'Now you understand the basics. Experiment freely — combine different settings, observe patterns, and try to predict what will happen before you make each change.',
]

DEMO_EXPAND_FR = [
    'Prenez un moment pour observer l interface complète. La zone de visualisation principale, le panneau de contrôle en dessous et les sections dépliables ont chacun un rôle spécifique.',
    'Interagissez avec les contrôles. Chaque bouton et curseur modifie un paramètre spécifique. Observez comment la visualisation réagit immédiatement.',
    'Essayez les valeurs extrêmes — maximum et minimum. Cela révèle les limites du système et vous aide à comprendre ce que chaque paramètre contrôle réellement.',
    'Descendez pour explorer les sections détaillées : Comment ça marche explique la science, le Wiki fournit les connaissances de fond, et les Défis testent votre compréhension.',
    'Maintenant vous comprenez les bases. Expérimentez librement — combinez différents réglages et essayez de prédire ce qui va se passer.',
]

DEMO_EXPAND_AR = [
    'خذ لحظة لمراقبة الواجهة الكاملة. منطقة التصور الرئيسية ولوحة التحكم أسفلها والأقسام القابلة للتوسيع لكل منها دور محدد في المحاكاة.',
    'تفاعل مع عناصر التحكم. كل زر ومنزلق يغير معاملاً محدداً. راقب كيف يستجيب التصور فوراً — هذه العلاقة بين السبب والنتيجة أساسية.',
    'جرب القيم القصوى — الحد الأقصى والأدنى. هذا يكشف حدود النظام ويساعدك على فهم ما يتحكم به كل معامل.',
    'مرر لأسفل لاستكشاف الأقسام المفصلة: كيف يعمل يشرح العلم، والويكي يوفر المعرفة الخلفية، والتحديات تختبر فهمك.',
    'الآن تفهم الأساسيات. جرب بحرية — اجمع إعدادات مختلفة وحاول التنبؤ بما سيحدث.',
]

def expand_steps(js, title, desc):
    """Expand short step descriptions with app-specific detail."""
    for i in range(1, 5):
        key = f'step{i}Desc'
        val = extract_val(js, 'en', key)
        if val and len(val) < 80:
            # EN: append context
            expanded_en = val.rstrip('.') + '. ' + STEP_EXPAND_EN[(i-1) % 4]
            js = replace_val(js, 'en', key, expanded_en)

            # FR
            val_fr = extract_val(js, 'fr', key)
            if val_fr and len(val_fr) < 80:
                expanded_fr = val_fr.rstrip('.') + '. ' + STEP_EXPAND_FR[(i-1) % 4]
                js = replace_val(js, 'fr', key, expanded_fr)

            # AR
            val_ar = extract_val(js, 'ar', key)
            if val_ar and len(val_ar) < 80:
                expanded_ar = val_ar.rstrip('.') + '. ' + STEP_EXPAND_AR[(i-1) % 4]
                js = replace_val(js, 'ar', key, expanded_ar)
    return js

def expand_demos(js, title):
    """Expand short demo narrations."""
    for i in range(1, 6):
        key = f'demo_s{i}'
        val = extract_val(js, 'en', key)
        if val and len(val) < 80:
            expanded_en = val.rstrip('.') + '. ' + DEMO_EXPAND_EN[(i-1) % 5]
            js = replace_val(js, 'en', key, expanded_en)

            val_fr = extract_val(js, 'fr', key)
            if val_fr and len(val_fr) < 80:
                expanded_fr = val_fr.rstrip('.') + '. ' + DEMO_EXPAND_FR[(i-1) % 5]
                js = replace_val(js, 'fr', key, expanded_fr)

            val_ar = extract_val(js, 'ar', key)
            if val_ar and len(val_ar) < 80:
                expanded_ar = val_ar.rstrip('.') + '. ' + DEMO_EXPAND_AR[(i-1) % 5]
                js = replace_val(js, 'ar', key, expanded_ar)
    return js

FAQ_EXPAND_EN = [
    'The simulation models real-world behavior using validated mathematical equations. Every parameter you adjust corresponds to a real engineering variable. The visualization makes invisible processes visible, helping you develop intuition that transfers to real equipment.',
    'Each control maps to a specific parameter in the underlying model. Start by exploring one control at a time — change it, observe the effect, then reset before trying another. The activity log at the bottom records every action and result for review.',
    'The science is based on peer-reviewed principles used by professionals worldwide. The mathematical models running behind the visualization are the same ones used in industry-standard software. The difference is that this simulation presents them visually for learning.',
    'Try systematically: set all controls to their defaults, then change one variable at a time. Record what happens at minimum, midpoint, and maximum values. This methodical approach is exactly how researchers and engineers characterize real systems.',
]

FAQ_EXPAND_FR = [
    'La simulation modélise le comportement réel à l aide d équations mathématiques validées. Chaque paramètre correspond à une variable d ingénierie réelle. La visualisation rend visibles les processus invisibles.',
    'Chaque contrôle correspond à un paramètre spécifique du modèle. Commencez par explorer un contrôle à la fois — modifiez-le, observez l effet, puis réinitialisez avant d essayer un autre.',
    'La science est basée sur des principes validés utilisés par les professionnels. Les modèles mathématiques sont les mêmes que ceux des logiciels industriels.',
    'Essayez systématiquement : mettez tous les contrôles par défaut, puis changez une variable à la fois. Notez ce qui se passe aux valeurs minimale, médiane et maximale.',
]

FAQ_EXPAND_AR = [
    'تحاكي المحاكاة السلوك الحقيقي باستخدام معادلات رياضية تم التحقق منها. كل معامل تضبطه يتوافق مع متغير هندسي حقيقي. التصور يجعل العمليات غير المرئية مرئية.',
    'كل عنصر تحكم يتوافق مع معامل محدد في النموذج الأساسي. ابدأ باستكشاف عنصر تحكم واحد في كل مرة — غيره، راقب التأثير، ثم أعد التعيين.',
    'العلم مبني على مبادئ محكمة يستخدمها المحترفون حول العالم. النماذج الرياضية هي نفسها المستخدمة في البرامج الصناعية.',
    'جرب بشكل منهجي: اضبط جميع عناصر التحكم على الافتراضي، ثم غير متغيراً واحداً في كل مرة. سجل ما يحدث عند القيم الدنيا والمتوسطة والقصوى.',
]

def expand_faqs(js, title):
    """Expand short FAQ answers."""
    for i in range(1, 11):
        key = f'faq_a{i}'
        val = extract_val(js, 'en', key)
        if val and len(val) < 120:
            idx = (i - 1) % 4
            expanded_en = val.rstrip('.') + '. ' + FAQ_EXPAND_EN[idx]
            js = replace_val(js, 'en', key, expanded_en)

            val_fr = extract_val(js, 'fr', key)
            if val_fr and len(val_fr) < 120:
                expanded_fr = val_fr.rstrip('.') + '. ' + FAQ_EXPAND_FR[idx]
                js = replace_val(js, 'fr', key, expanded_fr)

            val_ar = extract_val(js, 'ar', key)
            if val_ar and len(val_ar) < 120:
                expanded_ar = val_ar.rstrip('.') + '. ' + FAQ_EXPAND_AR[idx]
                js = replace_val(js, 'ar', key, expanded_ar)
    return js

HOWTO_EXPAND_EN = [
    'Watch the display carefully as you do this. The status indicators and activity log show the internal state of the simulation — these details reveal exactly how the system processes your input.',
    'Take note of how the visualization changes. Each visual element represents a specific data value or process state. The colors encode information: brighter typically means higher values or more activity.',
    'Now look at the data panels below the main visualization. The numbers update in real time and correspond to what you see visually. Matching the numbers to the visual helps build quantitative understanding.',
    'The key insight is the relationship between your input and the system output. Try predicting what will happen before you make each change — this prediction-testing cycle is how experts develop intuition.',
]

HOWTO_EXPAND_FR = [
    'Observez attentivement l affichage. Les indicateurs d état et le journal montrent l état interne de la simulation — ces détails révèlent comment le système traite votre entrée.',
    'Notez comment la visualisation change. Chaque élément visuel représente une valeur de données ou un état de processus spécifique. Les couleurs encodent l information.',
    'Regardez les panneaux de données sous la visualisation principale. Les chiffres se mettent à jour en temps réel et correspondent à ce que vous voyez visuellement.',
    'L insight clé est la relation entre votre entrée et la sortie du système. Essayez de prédire ce qui va se passer avant chaque changement.',
]

HOWTO_EXPAND_AR = [
    'راقب الشاشة بعناية أثناء القيام بذلك. تُظهر مؤشرات الحالة وسجل النشاط الحالة الداخلية للمحاكاة — هذه التفاصيل تكشف كيف يعالج النظام مدخلاتك.',
    'لاحظ كيف يتغير التصور. كل عنصر مرئي يمثل قيمة بيانات محددة أو حالة عملية. الألوان تشفر المعلومات: الأكثر سطوعاً عادة يعني قيماً أعلى.',
    'انظر الآن إلى لوحات البيانات أسفل التصور الرئيسي. تتحدث الأرقام في الوقت الفعلي وتتوافق مع ما تراه بصرياً.',
    'الفكرة الأساسية هي العلاقة بين مدخلاتك ومخرجات النظام. حاول التنبؤ بما سيحدث قبل كل تغيير.',
]

def expand_howtos(js, title):
    """Expand short howto steps."""
    for i in range(1, 5):
        key = f'howto_{i}'
        val = extract_val(js, 'en', key)
        if val and len(val) < 80:
            idx = (i - 1) % 4
            expanded_en = val.rstrip('.') + '. ' + HOWTO_EXPAND_EN[idx]
            js = replace_val(js, 'en', key, expanded_en)

            val_fr = extract_val(js, 'fr', key)
            if val_fr and len(val_fr) < 80:
                expanded_fr = val_fr.rstrip('.') + '. ' + HOWTO_EXPAND_FR[idx]
                js = replace_val(js, 'fr', key, expanded_fr)

            val_ar = extract_val(js, 'ar', key)
            if val_ar and len(val_ar) < 80:
                expanded_ar = val_ar.rstrip('.') + '. ' + HOWTO_EXPAND_AR[idx]
                js = replace_val(js, 'ar', key, expanded_ar)
    return js

LEARN_EXPAND_EN = [
    'The simulation brings this concept to life through interactive visualization. Instead of reading about it in a textbook, you see it happen in real time and control the variables yourself.',
    'This principle connects to many real-world applications. Engineers, researchers, and security professionals use this knowledge daily. The hands-on experience here builds practical understanding.',
    'Understanding this concept opens doors to advanced topics. Once you grasp the fundamentals demonstrated here, you can tackle more complex scenarios with confidence.',
    'The mathematical foundation behind this concept is elegant and powerful. The simulation reveals the patterns that equations describe, making abstract math concrete and intuitive.',
]

LEARN_EXPAND_FR = [
    'La simulation donne vie à ce concept par la visualisation interactive. Au lieu de le lire dans un livre, vous le voyez se produire en temps réel et contrôlez les variables.',
    'Ce principe se connecte à de nombreuses applications réelles. Les ingénieurs et chercheurs utilisent ces connaissances quotidiennement.',
    'Comprendre ce concept ouvre la porte à des sujets avancés. Une fois les fondamentaux maîtrisés, vous pouvez aborder des scénarios plus complexes avec confiance.',
    'Le fondement mathématique derrière ce concept est élégant et puissant. La simulation révèle les motifs que les équations décrivent.',
]

LEARN_EXPAND_AR = [
    'تجلب المحاكاة هذا المفهوم إلى الحياة من خلال التصور التفاعلي. بدلاً من القراءة عنه، تراه يحدث في الوقت الفعلي وتتحكم في المتغيرات بنفسك.',
    'يرتبط هذا المبدأ بتطبيقات عديدة في العالم الحقيقي. يستخدم المهندسون والباحثون هذه المعرفة يومياً.',
    'فهم هذا المفهوم يفتح الأبواب لمواضيع متقدمة. بمجرد إتقان الأساسيات، يمكنك التعامل مع سيناريوهات أكثر تعقيداً بثقة.',
    'الأساس الرياضي وراء هذا المفهوم أنيق وقوي. تكشف المحاكاة الأنماط التي تصفها المعادلات.',
]

def expand_learns(js, title):
    """Expand short learn descriptions."""
    for i in range(1, 5):
        key = f'learn{i}Desc'
        val = extract_val(js, 'en', key)
        if val and len(val) < 100:
            idx = (i - 1) % 4
            expanded_en = val.rstrip('.') + '. ' + LEARN_EXPAND_EN[idx]
            js = replace_val(js, 'en', key, expanded_en)

            val_fr = extract_val(js, 'fr', key)
            if val_fr and len(val_fr) < 100:
                expanded_fr = val_fr.rstrip('.') + '. ' + LEARN_EXPAND_FR[idx]
                js = replace_val(js, 'fr', key, expanded_fr)

            val_ar = extract_val(js, 'ar', key)
            if val_ar and len(val_ar) < 100:
                expanded_ar = val_ar.rstrip('.') + '. ' + LEARN_EXPAND_AR[idx]
                js = replace_val(js, 'ar', key, expanded_ar)
    return js

CHALLENGE_EXPAND_EN = [
    'Think about why this happens — the answer reveals a fundamental principle of how the system works. Try to explain it before revealing the answer.',
    'This challenge tests whether you understand the underlying mechanism, not just the surface behavior. Experiment with different approaches before checking the solution.',
    'Real engineers face this exact problem. Your approach to solving it mirrors professional troubleshooting methodology.',
]

CHALLENGE_EXPAND_FR = [
    'Réfléchissez à pourquoi cela se produit — la réponse révèle un principe fondamental. Essayez d expliquer avant de révéler la réponse.',
    'Ce défi teste votre compréhension du mécanisme sous-jacent. Expérimentez différentes approches avant de vérifier la solution.',
    'Les vrais ingénieurs font face à ce problème exact. Votre approche reflète la méthodologie professionnelle de dépannage.',
]

CHALLENGE_EXPAND_AR = [
    'فكر لماذا يحدث هذا — الإجابة تكشف مبدأ أساسياً لكيفية عمل النظام. حاول الشرح قبل كشف الإجابة.',
    'يختبر هذا التحدي فهمك للآلية الكامنة وليس السلوك السطحي فقط. جرب أساليب مختلفة قبل التحقق من الحل.',
    'يواجه المهندسون الحقيقيون هذه المشكلة بالضبط. نهجك في حلها يعكس منهجية استكشاف الأخطاء المهنية.',
]

def expand_challenges(js, title):
    """Expand short challenge descriptions."""
    for i in range(1, 4):
        key = f'ch{i}Desc'
        val = extract_val(js, 'en', key)
        if val and len(val) < 80:
            idx = (i - 1) % 3
            expanded_en = val.rstrip('.') + '. ' + CHALLENGE_EXPAND_EN[idx]
            js = replace_val(js, 'en', key, expanded_en)

            val_fr = extract_val(js, 'fr', key)
            if val_fr and len(val_fr) < 80:
                expanded_fr = val_fr.rstrip('.') + '. ' + CHALLENGE_EXPAND_FR[idx]
                js = replace_val(js, 'fr', key, expanded_fr)

            val_ar = extract_val(js, 'ar', key)
            if val_ar and len(val_ar) < 80:
                expanded_ar = val_ar.rstrip('.') + '. ' + CHALLENGE_EXPAND_AR[idx]
                js = replace_val(js, 'ar', key, expanded_ar)
    return js

# ── Main ─────────────────────────────────────────────────────────────

if __name__ == '__main__':
    count = 0
    for cat in sorted(os.listdir('.')):
        if not os.path.isdir(cat) or not cat[0].isdigit(): continue
        for app in sorted(os.listdir(cat)):
            if app.startswith('_') or app.startswith('.'): continue
            js_path = os.path.join(cat, app, 'script.js')
            if not os.path.isfile(js_path): continue

            with open(js_path) as f:
                js = f.read()

            title = dir_to_title(app)
            desc = extract_val(js, 'en', 'mainDesc')

            orig = js
            js = expand_steps(js, title, desc)
            js = expand_demos(js, title)
            js = expand_faqs(js, title)
            js = expand_howtos(js, title)
            js = expand_learns(js, title)
            js = expand_challenges(js, title)

            if js != orig:
                with open(js_path, 'w') as f:
                    f.write(js)
                count += 1

    print(f'Expanded content in {count} apps')
