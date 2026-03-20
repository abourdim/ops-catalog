#!/usr/bin/env python3
"""Phase 5: Add 'What You Shall Learn' section as first collapsible in all 488 apps.

Adds 4 learning items + level/time/age badges per app, placed before all other sections.
Open by default so it's the first thing kids see.
"""

import os
import re
import glob

ROOT = os.path.dirname(os.path.abspath(__file__))

def get_domain(cat_dir):
    prefix = cat_dir.split('-')[0]
    dm = {
        '01':'spy','02':'spy','03':'spy','04':'spy',
        '05':'net','06':'net','07':'net','08':'net','09':'net',
        '10':'hrf','11':'hrf','12':'hrf','13':'hrf',
        '14':'wifi','15':'wifi','16':'wifi','17':'wifi','18':'wifi',
        '19':'ham','20':'ham','21':'ham','22':'ham','23':'ham','24':'ham','25':'ham','26':'ham',
        '27':'sdr','28':'sdr','29':'sdr','30':'sdr','31':'sdr','32':'sdr','33':'sdr','34':'sdr',
        '35':'ant','36':'pi','37':'pi','38':'pi',
        '39':'agent','40':'agent','41':'ant','42':'agent',
        '43':'bio','44':'sonic','45':'chrono','46':'swarm',
        '47':'phys','48':'dark','49':'ai','50':'civ',
        '51':'se','52':'imp','53':'cry','54':'rfw','55':'esc',
    }
    return dm.get(prefix, 'spy')

def get_difficulty(cat_dir):
    prefix = cat_dir.split('-')[0]
    n = int(prefix)
    if n <= 9 or n in [25, 33, 37]:
        return ('Beginner 🟢', 'Débutant 🟢', 'مبتدئ 🟢', '10+', '15 min')
    elif n <= 26 or n in [35, 39, 43, 44, 46, 50]:
        return ('Intermediate 🟡', 'Intermédiaire 🟡', 'متوسط 🟡', '12+', '20 min')
    else:
        return ('Advanced 🔴', 'Avancé 🔴', 'متقدم 🔴', '14+', '30 min')

# Learning items per domain: [(emoji, title_en, desc_en, tag_en), ...]
LEARN_ITEMS = {
    'spy': [
        ('🔐', 'Cryptography', 'How secret codes protect messages from spies', 'Cybersecurity',
         'Cryptographie', 'Comment les codes secrets protègent les messages', 'Cybersécurité',
         'التشفير', 'كيف تحمي الشفرات السرية الرسائل', 'أمن سيبراني'),
        ('📡', 'Wireless Communication', 'How devices send invisible signals through the air', 'Wireless',
         'Communication sans fil', 'Comment les appareils envoient des signaux invisibles', 'Sans fil',
         'الاتصال اللاسلكي', 'كيف ترسل الأجهزة إشارات غير مرئية', 'لاسلكي'),
        ('🕵️', 'OPSEC', 'How to keep your operations secret and secure', 'Security',
         'OPSEC', 'Comment garder tes opérations secrètes et sécurisées', 'Sécurité',
         'أمن العمليات', 'كيف تحافظ على سرية عملياتك وأمانها', 'أمان'),
        ('🧮', 'Math in Security', 'How numbers and algorithms make unbreakable codes', 'Math',
         'Maths en sécurité', 'Comment les nombres créent des codes incassables', 'Maths',
         'الرياضيات في الأمن', 'كيف تصنع الأرقام والخوارزميات شفرات غير قابلة للكسر', 'رياضيات'),
    ],
    'net': [
        ('🌐', 'Network Protocols', 'How computers talk to each other using rules called protocols', 'Networking',
         'Protocoles réseau', 'Comment les ordinateurs communiquent avec des protocoles', 'Réseau',
         'بروتوكولات الشبكة', 'كيف تتحدث الحواسيب مع بعضها باستخدام البروتوكولات', 'شبكات'),
        ('📦', 'Packet Analysis', 'How data is split into tiny packets that travel across the internet', 'Data',
         'Analyse de paquets', 'Comment les données sont découpées en paquets', 'Données',
         'تحليل الحزم', 'كيف تُقسم البيانات إلى حزم صغيرة تسافر عبر الإنترنت', 'بيانات'),
        ('🔍', 'Network Scanning', 'How to discover devices and services on a network', 'Discovery',
         'Scan réseau', 'Comment découvrir les appareils sur un réseau', 'Découverte',
         'مسح الشبكة', 'كيف تكتشف الأجهزة والخدمات على الشبكة', 'اكتشاف'),
        ('🛡️', 'Network Security', 'How to spot and stop network attacks', 'Security',
         'Sécurité réseau', 'Comment détecter et stopper les attaques réseau', 'Sécurité',
         'أمن الشبكات', 'كيف تكتشف وتوقف هجمات الشبكة', 'أمان'),
    ],
}

# Auto-generate for remaining domains
DOMAIN_LEARN_TEMPLATES = {
    'wifi': [('📶','WiFi Signals','How wireless networks broadcast and receive data','WiFi'),
             ('🔓','WiFi Security','How encryption protects wireless connections','Security'),
             ('📊','Channel Analysis','How WiFi channels share the radio spectrum','Spectrum'),
             ('🕵️','WiFi Monitoring','How to detect rogue access points and attacks','Defense')],
    'ham': [('📻','Radio Bands','How different frequencies carry different signals','Radio'),
            ('🔤','Digital Modes','How computers encode messages into radio signals','Digital'),
            ('🌍','Propagation','How radio waves bounce off the atmosphere to travel far','Physics'),
            ('📝','QSO Logging','How ham operators record contacts around the world','Communication')],
    'sdr': [('📡','SDR Basics','How software turns radio waves into digital data','SDR'),
            ('📊','DSP Fundamentals','How math filters and transforms radio signals','DSP'),
            ('🎵','Modulation','How information rides on radio carrier waves','Signals'),
            ('🌊','Spectrum Analysis','How to read the waterfall and frequency displays','Analysis')],
    'hrf': [('📡','RF Signals','How radio frequency energy carries information','RF'),
            ('🔍','Signal Analysis','How to identify and classify unknown signals','SIGINT'),
            ('📊','Spectrum Monitoring','How to scan and map the radio spectrum','Spectrum'),
            ('🛡️','RF Security','How to detect and defend against RF threats','Security')],
    'ant': [('📐','Antenna Design','How antenna dimensions determine frequency response','Physics'),
            ('📊','SWR & Impedance','How to match antennas for maximum power transfer','RF'),
            ('🌐','Radiation Patterns','How antennas shape radio energy in 3D space','Patterns'),
            ('🔧','Build & Test','How to construct and measure real antennas','Hardware')],
    'pi': [('🔌','GPIO Programming','How to control electronic pins with Python code','Electronics'),
           ('📷','Sensor Integration','How to read temperature, light, and motion data','Sensors'),
           ('🐍','Python Scripting','How to automate hardware with Python programs','Programming'),
           ('📡','Communication','How Raspberry Pi talks to radios and networks','Networking')],
    'agent': [('🎒','Field Equipment','How agents select and configure mission gear','Tradecraft'),
              ('📡','Covert Comms','How to set up secure communication channels','COMSEC'),
              ('🔍','Surveillance','How to monitor areas and detect threats','Intel'),
              ('🏃','Extraction','How to collect and secure intelligence safely','Operations')],
    'bio': [('❤️','Biosignals','How your body generates electrical signals','Biology'),
            ('📡','Bio-Radio','How body signals can be converted to radio waves','RF'),
            ('🧠','Neural Signals','How nerves transmit electrical impulses','Neuroscience'),
            ('🔬','Biometric ID','How unique body patterns identify individuals','Biometrics')],
    'sonic': [('🔊','Acoustics','How sound waves travel through air and materials','Physics'),
              ('🎯','Ultrasonic Tech','How high-frequency sound enables hidden communication','Signals'),
              ('🎤','Audio Analysis','How to capture and analyze sound patterns','Analysis'),
              ('🛡️','Acoustic Defense','How to detect and counter acoustic attacks','Defense')],
    'chrono': [('⏱️','Precision Timing','How atomic clocks measure time to nanoseconds','Physics'),
               ('🔄','Synchronization','How devices agree on the exact same time','Protocols'),
               ('🕵️','Timing Attacks','How tiny time differences reveal secrets','Security'),
               ('📡','Time Signals','How time is broadcast via radio to the world','Communication')],
    'swarm': [('🐜','Emergent Behavior','How simple rules create complex group patterns','AI'),
              ('📡','Mesh Networks','How swarms communicate without a central leader','Networking'),
              ('🧬','Algorithms','How nature-inspired math solves hard problems','Computing'),
              ('📊','Optimization','How swarms find the best solution together','Math')],
    'phys': [('⚛️','Quantum Concepts','How particles behave at the smallest scales','Quantum'),
             ('📡','Wave Physics','How electromagnetic waves carry energy and information','Physics'),
             ('🔬','Lab Simulation','How to design and run virtual experiments','Science'),
             ('📐','Math Models','How equations predict physical phenomena','Mathematics')],
    'dark': [('🔓','Vulnerability Analysis','How to find weaknesses in systems','Offensive'),
             ('🛡️','Defense Techniques','How to protect against real attack methods','Defensive'),
             ('🔍','Forensics','How to trace and analyze security incidents','Analysis'),
             ('⚖️','Ethics','Why understanding attacks makes you a better defender','Ethics')],
    'ai': [('🧠','Neural Networks','How AI learns patterns from data','Machine Learning'),
           ('📡','Signal Classification','How AI identifies radio signals automatically','AI+Radio'),
           ('📊','Training & Testing','How to teach and evaluate AI models','Data Science'),
           ('🎯','Pattern Recognition','How AI finds hidden patterns in noise','AI')],
    'civ': [('🌍','Environmental Monitoring','How sensors track Earth systems','Earth Science'),
            ('🚨','Early Warning','How to detect disasters before they strike','Safety'),
            ('📡','Sensor Networks','How distributed sensors cover large areas','IoT'),
            ('🗺️','Data Mapping','How to visualize environmental data on maps','Geography')],
    'se': [('🧠','Psychology','How human behavior creates security vulnerabilities','Psychology'),
           ('🎭','Social Manipulation','How attackers exploit trust and authority','Awareness'),
           ('🔍','OSINT','How public information reveals private details','Intelligence'),
           ('🛡️','Defense Awareness','How to recognize and resist social attacks','Defense')],
    'imp': [('🔧','Hardware Design','How covert devices are built from components','Electronics'),
            ('💻','Firmware','How embedded code controls hardware implants','Programming'),
            ('🔍','Detection','How to find hidden hardware in your environment','Counter-Intel'),
            ('🛡️','Physical Security','How to protect spaces from unauthorized devices','Defense')],
    'cry': [('🔐','Encryption','How mathematical algorithms protect secrets','Cryptography'),
            ('⚔️','Attack Methods','How cryptanalysts break encryption schemes','Offensive'),
            ('📊','Statistical Analysis','How patterns in data reveal encrypted content','Math'),
            ('🛡️','Strong Crypto','How to choose unbreakable encryption methods','Defense')],
    'rfw': [('📡','RF Spectrum','How electromagnetic energy fills the battlefield','RF'),
            ('🎯','Electronic Attack','How jamming and spoofing disrupt enemy systems','EW'),
            ('🛡️','Electronic Defense','How to protect communications from interference','Defense'),
            ('📊','Signal Intelligence','How to intercept and analyze enemy transmissions','SIGINT')],
    'esc': [('🕵️','Counter-Surveillance','How to detect if you are being monitored','Privacy'),
            ('🔒','Data Protection','How to erase digital traces and protect files','Security'),
            ('📡','Communication Security','How to communicate without being intercepted','COMSEC'),
            ('🏃','Evasion Techniques','How to avoid tracking and maintain privacy','Tradecraft')],
}

for domain, items in DOMAIN_LEARN_TEMPLATES.items():
    if domain in LEARN_ITEMS:
        continue
    LEARN_ITEMS[domain] = []
    for emoji, title_en, desc_en, tag_en in items:
        LEARN_ITEMS[domain].append((
            emoji, title_en, desc_en, tag_en,
            title_en, desc_en, tag_en,  # FR placeholder (domain terms often stay in EN)
            title_en, desc_en, tag_en,  # AR placeholder
        ))


LEARN_CSS = """
    /* Learn section */
    .learn-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.8rem; margin-bottom: 0.8rem; }
    .learn-item { padding: 0.7rem; border-radius: 8px; background: rgba(var(--accent-rgb), 0.06); border-left: 3px solid var(--accent); }
    .learn-icon { font-size: 1.3rem; margin-bottom: 0.2rem; }
    .learn-title { font-weight: 700; font-size: 0.85rem; margin-bottom: 0.2rem; }
    .learn-desc { font-size: 0.75rem; opacity: 0.75; line-height: 1.3; margin-bottom: 0.3rem; }
    .learn-tag { display: inline-block; font-size: 0.65rem; padding: 1px 6px; border-radius: 8px; background: rgba(var(--accent-rgb), 0.12); color: var(--accent); }
    .learn-meta { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; padding-top: 0.6rem; border-top: 1px solid rgba(var(--accent-rgb), 0.12); font-size: 0.8rem; }
    .learn-badge { font-weight: 600; }
"""


def gen_learn_html(items, level_en, age, time_est):
    """Generate the learn section HTML."""
    grid = ''
    for i, item in enumerate(items, 1):
        emoji = item[0]
        title = item[1]
        desc = item[2]
        tag = item[3]
        grid += f'''            <div class="learn-item">
              <div class="learn-icon">{emoji}</div>
              <div class="learn-title" data-i18n="learn{i}Title">{title}</div>
              <div class="learn-desc" data-i18n="learn{i}Desc">{desc}</div>
              <div class="learn-tag" data-i18n="learn{i}Tag">{tag}</div>
            </div>
'''

    return f'''
      <details class="collapsible" open>
        <summary><span class="icon">🎯</span> <span data-i18n="sectionLearn">What You Shall Learn</span></summary>
        <div class="card">
          <div class="learn-grid">
{grid}          </div>
          <div class="learn-meta">
            <span data-i18n="learnLevel">Level:</span> <span class="learn-badge" data-i18n="learnLevelVal">{level_en}</span>
            <span data-i18n="learnTime">Time:</span> <span class="learn-badge" data-i18n="learnTimeVal">{time_est} ⏱</span>
            <span data-i18n="learnAge">Ages:</span> <span class="learn-badge" data-i18n="learnAgeVal">{age} 🧒</span>
          </div>
        </div>
      </details>'''


def gen_learn_i18n(items, level, age, time_est, lang_idx):
    """Generate learn i18n keys. lang_idx: 0=en, 1=fr, 2=ar"""
    parts = []
    for i, item in enumerate(items, 1):
        # item layout: (emoji, en_title, en_desc, en_tag, fr_title, fr_desc, fr_tag, ar_title, ar_desc, ar_tag)
        offset = 1 + lang_idx * 3  # en=1, fr=4, ar=7
        title = item[offset].replace("'", "\\'")
        desc = item[offset + 1].replace("'", "\\'")
        tag = item[offset + 2].replace("'", "\\'")
        parts.append(f"learn{i}Title:'{title}',learn{i}Desc:'{desc}',learn{i}Tag:'{tag}'")

    level_val = level[lang_idx]
    section_labels = [
        "sectionLearn:'What You Shall Learn'",
        "sectionLearn:'Ce que tu vas apprendre'",
        "sectionLearn:'ماذا ستتعلم'",
    ]
    level_labels = ["learnLevel:'Level:'", "learnLevel:'Niveau :'", "learnLevel:'المستوى:'"]
    time_labels = ["learnTime:'Time:'", "learnTime:'Durée :'", "learnTime:'المدة:'"]
    age_labels = ["learnAge:'Ages:'", "learnAge:'Âge :'", "learnAge:'العمر:'"]

    parts.append(section_labels[lang_idx])
    parts.append(f"learnLevelVal:'{level_val}'")
    parts.append(level_labels[lang_idx])
    parts.append(f"learnTimeVal:'{time_est} ⏱'")
    parts.append(time_labels[lang_idx])
    parts.append(f"learnAgeVal:'{age} 🧒'")
    parts.append(age_labels[lang_idx])

    return ','.join(parts)


def inject_learn_html(html_content, learn_html):
    """Insert learn section as the first section after the main card/header."""
    if 'sectionLearn' in html_content:
        return html_content, False

    # Try to insert after the main card section and before the first collapsible/details
    # Strategy 1: After main section comment
    patterns = [
        r'(</div>\s*\n\s*<!-- ═+ SECTION)',
        r'(</div>\s*\n\s*<details class="collapsible")',
        r'(</div>\s*\n\s*<!-- ═+ SECTION —? How)',
    ]

    for p in patterns:
        m = re.search(p, html_content)
        if m:
            pos = m.start() + len('</div>')
            html_content = html_content[:pos] + '\n' + learn_html + '\n' + html_content[pos:]
            return html_content, True

    # Strategy 2: After id="mainCard" closing div
    main_card = re.search(r'id="mainCard"', html_content)
    if main_card:
        # Find the next </div> that closes the main card structure
        pos = html_content.find('</div>', main_card.end())
        if pos > 0:
            pos += len('</div>')
            html_content = html_content[:pos] + '\n' + learn_html + '\n' + html_content[pos:]
            return html_content, True

    # Strategy 3: After the first closing </details> or before step-grid
    step_grid = re.search(r'<div class="step-grid">', html_content)
    if step_grid:
        # Go back to find the opening <details> for this step-grid
        before = html_content[:step_grid.start()]
        details_start = before.rfind('<details')
        if details_start > 0:
            html_content = html_content[:details_start] + learn_html + '\n      ' + html_content[details_start:]
            return html_content, True

    # Strategy 4: Before <script src="script.js">
    script_tag = re.search(r'\s*<script src="script\.js"', html_content)
    if script_tag:
        pos = script_tag.start()
        html_content = html_content[:pos] + '\n' + learn_html + '\n' + html_content[pos:]
        return html_content, True

    return html_content, False


def inject_learn_css(html_content):
    if '.learn-grid' in html_content:
        return html_content
    style_end = html_content.rfind('</style>')
    if style_end > 0:
        html_content = html_content[:style_end] + LEARN_CSS + html_content[style_end:]
    return html_content


def inject_learn_i18n(script_content, items, level, age, time_est):
    if 'sectionLearn' in script_content:
        return script_content

    new_content = script_content
    for lang_idx, lang in enumerate(['en', 'fr', 'ar']):
        lang_start = re.search(rf'\b{lang}\s*:\s*\{{', new_content)
        if not lang_start:
            continue
        start = lang_start.end()
        depth = 1
        pos = start
        while pos < len(new_content) and depth > 0:
            if new_content[pos] == '{': depth += 1
            elif new_content[pos] == '}': depth -= 1
            pos += 1
        close_pos = pos - 1
        i18n_str = gen_learn_i18n(items, level, age, time_est, lang_idx)
        new_content = new_content[:close_pos] + ',' + i18n_str + new_content[close_pos:]

    return new_content


# ═══════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════

fixed = 0

for script_path in sorted(glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'script.js'))):
    app_dir = os.path.dirname(script_path)
    app_name = os.path.basename(app_dir)
    cat_name = os.path.basename(os.path.dirname(app_dir))
    domain = get_domain(cat_name)
    level_en, level_fr, level_ar, age, time_est = get_difficulty(cat_name)
    level = (level_en, level_fr, level_ar)

    with open(script_path, 'r', encoding='utf-8') as f:
        script_content = f.read()

    if 'sectionLearn' in script_content:
        continue

    items = LEARN_ITEMS.get(domain, LEARN_ITEMS['spy'])

    html_path = os.path.join(app_dir, 'index.html')
    if not os.path.exists(html_path):
        continue

    with open(html_path, 'r', encoding='utf-8') as f:
        html_content = f.read()

    learn_html = gen_learn_html(items, level_en, age, time_est)

    html_content = inject_learn_css(html_content)
    html_content, html_ok = inject_learn_html(html_content, learn_html)

    if html_ok:
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

    new_script = inject_learn_i18n(script_content, items, level, age, time_est)
    if new_script != script_content:
        with open(script_path, 'w', encoding='utf-8') as f:
            f.write(new_script)

    fixed += 1
    if fixed % 50 == 0:
        print(f"  ... processed {fixed} apps")

print(f"\n✓ Added 'What You Shall Learn' to {fixed} apps")

# Check HTML coverage
html_count = sum(1 for p in glob.glob(os.path.join(ROOT, '[0-9]*', '*', 'index.html'))
                 if 'sectionLearn' in open(p).read())
print(f"sectionLearn in HTML: {html_count}/488")
