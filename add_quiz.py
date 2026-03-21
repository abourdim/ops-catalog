#!/usr/bin/env python3
"""
add_quiz.py — Adds an interactive quiz tab to all 488 apps in ops-catalog.
Handles two template patterns (old multi-line and new compact LANG objects).
Generates 5 quiz questions per app based on keyword matching from the app's
folder name and script content.
"""

import os
import re
import json
import random

BASE = os.path.dirname(os.path.abspath(__file__))

# ──────────────────────────────────────────────────────────
# QUIZ BANK: 30 keywords, each with 3 questions (EN/FR/AR)
# Each question: q (question text), opts (4 options), ans (0-3 correct index)
# ──────────────────────────────────────────────────────────

QUIZ_BANK = {
    "radio": [
        {
            "en": {"q": "What is the speed of radio waves in a vacuum?", "opts": ["Speed of sound", "Speed of light", "Half the speed of light", "Twice the speed of light"], "ans": 1},
            "fr": {"q": "Quelle est la vitesse des ondes radio dans le vide ?", "opts": ["Vitesse du son", "Vitesse de la lumière", "Moitié de la vitesse de la lumière", "Double de la vitesse de la lumière"], "ans": 1},
            "ar": {"q": "ما سرعة موجات الراديو في الفراغ؟", "opts": ["سرعة الصوت", "سرعة الضوء", "نصف سرعة الضوء", "ضعف سرعة الضوء"], "ans": 1},
        },
        {
            "en": {"q": "Which unit measures radio frequency?", "opts": ["Watts", "Hertz", "Decibels", "Ohms"], "ans": 1},
            "fr": {"q": "Quelle unité mesure la fréquence radio ?", "opts": ["Watts", "Hertz", "Décibels", "Ohms"], "ans": 1},
            "ar": {"q": "ما وحدة قياس التردد الراديوي؟", "opts": ["واط", "هرتز", "ديسيبل", "أوم"], "ans": 1},
        },
        {
            "en": {"q": "What does AM stand for in radio?", "opts": ["Audio Modulation", "Amplitude Modulation", "Analog Modulation", "Active Modulation"], "ans": 1},
            "fr": {"q": "Que signifie AM en radio ?", "opts": ["Modulation Audio", "Modulation d'Amplitude", "Modulation Analogique", "Modulation Active"], "ans": 1},
            "ar": {"q": "ماذا تعني AM في الراديو؟", "opts": ["تعديل صوتي", "تعديل السعة", "تعديل تناظري", "تعديل نشط"], "ans": 1},
        },
    ],
    "frequency": [
        {
            "en": {"q": "What is frequency measured in?", "opts": ["Meters", "Hertz", "Watts", "Volts"], "ans": 1},
            "fr": {"q": "En quoi se mesure la fréquence ?", "opts": ["Mètres", "Hertz", "Watts", "Volts"], "ans": 1},
            "ar": {"q": "بماذا تُقاس التردد؟", "opts": ["أمتار", "هرتز", "واط", "فولت"], "ans": 1},
        },
        {
            "en": {"q": "If frequency doubles, what happens to wavelength?", "opts": ["Doubles", "Halves", "Stays same", "Triples"], "ans": 1},
            "fr": {"q": "Si la fréquence double, que devient la longueur d'onde ?", "opts": ["Double", "Divisée par 2", "Inchangée", "Triplée"], "ans": 1},
            "ar": {"q": "إذا تضاعف التردد، ماذا يحدث لطول الموجة؟", "opts": ["يتضاعف", "ينقسم للنصف", "يبقى كما هو", "يتضاعف ثلاثاً"], "ans": 1},
        },
        {
            "en": {"q": "Which frequency range is UHF?", "opts": ["3-30 MHz", "30-300 MHz", "300 MHz-3 GHz", "3-30 GHz"], "ans": 2},
            "fr": {"q": "Quelle plage de fréquences est UHF ?", "opts": ["3-30 MHz", "30-300 MHz", "300 MHz-3 GHz", "3-30 GHz"], "ans": 2},
            "ar": {"q": "ما نطاق التردد UHF؟", "opts": ["3-30 ميغاهرتز", "30-300 ميغاهرتز", "300 ميغاهرتز-3 غيغاهرتز", "3-30 غيغاهرتز"], "ans": 2},
        },
    ],
    "antenna": [
        {
            "en": {"q": "What is the purpose of an antenna?", "opts": ["Store energy", "Convert signals between electrical and electromagnetic", "Amplify power", "Filter noise"], "ans": 1},
            "fr": {"q": "Quel est le rôle d'une antenne ?", "opts": ["Stocker l'énergie", "Convertir les signaux", "Amplifier la puissance", "Filtrer le bruit"], "ans": 1},
            "ar": {"q": "ما الغرض من الهوائي؟", "opts": ["تخزين الطاقة", "تحويل الإشارات", "تضخيم الطاقة", "تصفية الضوضاء"], "ans": 1},
        },
        {
            "en": {"q": "A half-wave dipole antenna length is based on?", "opts": ["Current", "Voltage", "Wavelength", "Power"], "ans": 2},
            "fr": {"q": "La longueur d'un dipôle demi-onde est basée sur ?", "opts": ["Le courant", "La tension", "La longueur d'onde", "La puissance"], "ans": 2},
            "ar": {"q": "طول هوائي ثنائي القطب نصف الموجة يعتمد على؟", "opts": ["التيار", "الجهد", "طول الموجة", "القدرة"], "ans": 2},
        },
        {
            "en": {"q": "What does antenna gain measure?", "opts": ["Size", "Directional efficiency", "Color", "Weight"], "ans": 1},
            "fr": {"q": "Que mesure le gain d'antenne ?", "opts": ["Taille", "Efficacité directionnelle", "Couleur", "Poids"], "ans": 1},
            "ar": {"q": "ماذا يقيس كسب الهوائي؟", "opts": ["الحجم", "الكفاءة الاتجاهية", "اللون", "الوزن"], "ans": 1},
        },
    ],
    "cipher": [
        {
            "en": {"q": "What is a Caesar cipher?", "opts": ["Hash function", "Substitution cipher shifting letters", "Block cipher", "Stream cipher"], "ans": 1},
            "fr": {"q": "Qu'est-ce qu'un chiffre de César ?", "opts": ["Fonction de hachage", "Chiffre par substitution décalant les lettres", "Chiffre par blocs", "Chiffre par flux"], "ans": 1},
            "ar": {"q": "ما هو شيفرة قيصر؟", "opts": ["دالة تجزئة", "شيفرة استبدال بإزاحة الحروف", "شيفرة كتلية", "شيفرة تدفقية"], "ans": 1},
        },
        {
            "en": {"q": "What is the key space of a Caesar cipher?", "opts": ["256", "26", "128", "52"], "ans": 1},
            "fr": {"q": "Quel est l'espace de clés d'un chiffre de César ?", "opts": ["256", "26", "128", "52"], "ans": 1},
            "ar": {"q": "ما حجم فضاء المفاتيح لشيفرة قيصر؟", "opts": ["256", "26", "128", "52"], "ans": 1},
        },
        {
            "en": {"q": "Which cipher uses a keyword for polyalphabetic substitution?", "opts": ["ROT13", "Vigenère", "Caesar", "Morse"], "ans": 1},
            "fr": {"q": "Quel chiffre utilise un mot-clé pour substitution polyalphabétique ?", "opts": ["ROT13", "Vigenère", "César", "Morse"], "ans": 1},
            "ar": {"q": "أي شيفرة تستخدم كلمة مفتاحية للاستبدال متعدد الأبجديات؟", "opts": ["ROT13", "فيجنير", "قيصر", "مورس"], "ans": 1},
        },
    ],
    "encrypt": [
        {
            "en": {"q": "What is encryption?", "opts": ["Deleting data", "Converting data into unreadable form", "Compressing data", "Copying data"], "ans": 1},
            "fr": {"q": "Qu'est-ce que le chiffrement ?", "opts": ["Supprimer des données", "Convertir des données en forme illisible", "Compresser des données", "Copier des données"], "ans": 1},
            "ar": {"q": "ما هو التشفير؟", "opts": ["حذف البيانات", "تحويل البيانات لشكل غير مقروء", "ضغط البيانات", "نسخ البيانات"], "ans": 1},
        },
        {
            "en": {"q": "AES uses which type of encryption?", "opts": ["Asymmetric", "Symmetric", "Hashing", "Encoding"], "ans": 1},
            "fr": {"q": "AES utilise quel type de chiffrement ?", "opts": ["Asymétrique", "Symétrique", "Hachage", "Encodage"], "ans": 1},
            "ar": {"q": "AES يستخدم أي نوع من التشفير؟", "opts": ["غير متماثل", "متماثل", "تجزئة", "ترميز"], "ans": 1},
        },
        {
            "en": {"q": "What key size does AES-256 use?", "opts": ["128 bits", "192 bits", "256 bits", "512 bits"], "ans": 2},
            "fr": {"q": "Quelle taille de clé utilise AES-256 ?", "opts": ["128 bits", "192 bits", "256 bits", "512 bits"], "ans": 2},
            "ar": {"q": "ما حجم مفتاح AES-256؟", "opts": ["128 بت", "192 بت", "256 بت", "512 بت"], "ans": 2},
        },
    ],
    "signal": [
        {
            "en": {"q": "What is signal-to-noise ratio (SNR)?", "opts": ["Signal color", "Ratio of signal power to noise power", "Signal speed", "Number of signals"], "ans": 1},
            "fr": {"q": "Qu'est-ce que le rapport signal/bruit (SNR) ?", "opts": ["Couleur du signal", "Rapport puissance signal/bruit", "Vitesse du signal", "Nombre de signaux"], "ans": 1},
            "ar": {"q": "ما هي نسبة الإشارة إلى الضوضاء (SNR)؟", "opts": ["لون الإشارة", "نسبة قوة الإشارة للضوضاء", "سرعة الإشارة", "عدد الإشارات"], "ans": 1},
        },
        {
            "en": {"q": "What unit is commonly used for signal strength?", "opts": ["Hertz", "Decibels (dBm)", "Watts only", "Meters"], "ans": 1},
            "fr": {"q": "Quelle unité mesure la puissance du signal ?", "opts": ["Hertz", "Décibels (dBm)", "Watts uniquement", "Mètres"], "ans": 1},
            "ar": {"q": "ما الوحدة الشائعة لقياس قوة الإشارة؟", "opts": ["هرتز", "ديسيبل (dBm)", "واط فقط", "أمتار"], "ans": 1},
        },
        {
            "en": {"q": "What does modulation do to a signal?", "opts": ["Deletes it", "Encodes information onto a carrier wave", "Makes it louder", "Stops transmission"], "ans": 1},
            "fr": {"q": "Que fait la modulation à un signal ?", "opts": ["Le supprime", "Encode l'information sur une porteuse", "L'amplifie", "Arrête la transmission"], "ans": 1},
            "ar": {"q": "ماذا يفعل التعديل للإشارة؟", "opts": ["يحذفها", "يشفر المعلومات على موجة حاملة", "يجعلها أعلى", "يوقف الإرسال"], "ans": 1},
        },
    ],
    "wifi": [
        {
            "en": {"q": "What frequency bands does Wi-Fi commonly use?", "opts": ["900 MHz", "2.4 GHz and 5 GHz", "10 GHz", "100 MHz"], "ans": 1},
            "fr": {"q": "Quelles bandes de fréquences utilise le Wi-Fi ?", "opts": ["900 MHz", "2,4 GHz et 5 GHz", "10 GHz", "100 MHz"], "ans": 1},
            "ar": {"q": "ما نطاقات التردد التي يستخدمها الواي فاي؟", "opts": ["900 ميغاهرتز", "2.4 و 5 غيغاهرتز", "10 غيغاهرتز", "100 ميغاهرتز"], "ans": 1},
        },
        {
            "en": {"q": "What does SSID stand for?", "opts": ["Signal Strength ID", "Service Set Identifier", "Secure System ID", "Simple Signal ID"], "ans": 1},
            "fr": {"q": "Que signifie SSID ?", "opts": ["Signal Strength ID", "Service Set Identifier", "Secure System ID", "Simple Signal ID"], "ans": 1},
            "ar": {"q": "ماذا يعني SSID؟", "opts": ["معرف قوة الإشارة", "معرف مجموعة الخدمة", "معرف النظام الآمن", "معرف الإشارة البسيط"], "ans": 1},
        },
        {
            "en": {"q": "Which protocol secures modern Wi-Fi networks?", "opts": ["WEP", "WPA3", "HTTP", "FTP"], "ans": 1},
            "fr": {"q": "Quel protocole sécurise les réseaux Wi-Fi modernes ?", "opts": ["WEP", "WPA3", "HTTP", "FTP"], "ans": 1},
            "ar": {"q": "ما البروتوكول الذي يؤمن شبكات الواي فاي الحديثة؟", "opts": ["WEP", "WPA3", "HTTP", "FTP"], "ans": 1},
        },
    ],
    "bluetooth": [
        {
            "en": {"q": "What frequency does Bluetooth operate on?", "opts": ["900 MHz", "2.4 GHz", "5 GHz", "60 GHz"], "ans": 1},
            "fr": {"q": "Sur quelle fréquence opère le Bluetooth ?", "opts": ["900 MHz", "2,4 GHz", "5 GHz", "60 GHz"], "ans": 1},
            "ar": {"q": "على أي تردد يعمل البلوتوث؟", "opts": ["900 ميغاهرتز", "2.4 غيغاهرتز", "5 غيغاهرتز", "60 غيغاهرتز"], "ans": 1},
        },
        {
            "en": {"q": "What is BLE?", "opts": ["Bluetooth Long Extension", "Bluetooth Low Energy", "Bluetooth Link Encryption", "Bluetooth Local Exchange"], "ans": 1},
            "fr": {"q": "Qu'est-ce que le BLE ?", "opts": ["Bluetooth Long Extension", "Bluetooth Low Energy", "Bluetooth Link Encryption", "Bluetooth Local Exchange"], "ans": 1},
            "ar": {"q": "ما هو BLE؟", "opts": ["امتداد بلوتوث طويل", "بلوتوث منخفض الطاقة", "تشفير رابط بلوتوث", "تبادل بلوتوث محلي"], "ans": 1},
        },
        {
            "en": {"q": "Bluetooth uses which spread spectrum technique?", "opts": ["DSSS", "Frequency Hopping (FHSS)", "OFDM", "CDMA"], "ans": 1},
            "fr": {"q": "Le Bluetooth utilise quelle technique d'étalement de spectre ?", "opts": ["DSSS", "Saut de fréquence (FHSS)", "OFDM", "CDMA"], "ans": 1},
            "ar": {"q": "يستخدم البلوتوث أي تقنية طيف منتشر؟", "opts": ["DSSS", "القفز الترددي (FHSS)", "OFDM", "CDMA"], "ans": 1},
        },
    ],
    "microbit": [
        {
            "en": {"q": "What processor does the micro:bit V2 use?", "opts": ["ATmega328", "nRF52833", "ESP32", "STM32"], "ans": 1},
            "fr": {"q": "Quel processeur utilise le micro:bit V2 ?", "opts": ["ATmega328", "nRF52833", "ESP32", "STM32"], "ans": 1},
            "ar": {"q": "ما المعالج الذي يستخدمه micro:bit V2؟", "opts": ["ATmega328", "nRF52833", "ESP32", "STM32"], "ans": 1},
        },
        {
            "en": {"q": "How many LEDs does the micro:bit display have?", "opts": ["16", "25", "36", "64"], "ans": 1},
            "fr": {"q": "Combien de LEDs a l'écran du micro:bit ?", "opts": ["16", "25", "36", "64"], "ans": 1},
            "ar": {"q": "كم عدد مصابيح LED في شاشة micro:bit؟", "opts": ["16", "25", "36", "64"], "ans": 1},
        },
        {
            "en": {"q": "Which language is commonly used to program micro:bit?", "opts": ["Java", "MicroPython", "Ruby", "Swift"], "ans": 1},
            "fr": {"q": "Quel langage est couramment utilisé pour programmer le micro:bit ?", "opts": ["Java", "MicroPython", "Ruby", "Swift"], "ans": 1},
            "ar": {"q": "ما اللغة الشائعة لبرمجة micro:bit؟", "opts": ["جافا", "مايكروبايثون", "روبي", "سويفت"], "ans": 1},
        },
    ],
    "esp32": [
        {
            "en": {"q": "What wireless capabilities does ESP32 have?", "opts": ["Wi-Fi only", "Bluetooth only", "Wi-Fi and Bluetooth", "None"], "ans": 2},
            "fr": {"q": "Quelles capacités sans fil a l'ESP32 ?", "opts": ["Wi-Fi uniquement", "Bluetooth uniquement", "Wi-Fi et Bluetooth", "Aucune"], "ans": 2},
            "ar": {"q": "ما إمكانيات ESP32 اللاسلكية؟", "opts": ["واي فاي فقط", "بلوتوث فقط", "واي فاي وبلوتوث", "لا شيء"], "ans": 2},
        },
        {
            "en": {"q": "What is the ESP32's CPU architecture?", "opts": ["ARM", "Xtensa dual-core", "RISC-V only", "x86"], "ans": 1},
            "fr": {"q": "Quelle est l'architecture CPU de l'ESP32 ?", "opts": ["ARM", "Xtensa double coeur", "RISC-V uniquement", "x86"], "ans": 1},
            "ar": {"q": "ما بنية معالج ESP32؟", "opts": ["ARM", "Xtensa ثنائي النواة", "RISC-V فقط", "x86"], "ans": 1},
        },
        {
            "en": {"q": "What voltage does ESP32 operate at?", "opts": ["5V", "3.3V", "1.8V", "12V"], "ans": 1},
            "fr": {"q": "À quelle tension fonctionne l'ESP32 ?", "opts": ["5V", "3,3V", "1,8V", "12V"], "ans": 1},
            "ar": {"q": "على أي جهد يعمل ESP32؟", "opts": ["5 فولت", "3.3 فولت", "1.8 فولت", "12 فولت"], "ans": 1},
        },
    ],
    "morse": [
        {
            "en": {"q": "What does SOS look like in Morse code?", "opts": ["---...---", "...---...", "...-...-", "-.-.-."], "ans": 1},
            "fr": {"q": "Comment s'écrit SOS en code Morse ?", "opts": ["---...---", "...---...", "...-...-", "-.-.-."], "ans": 1},
            "ar": {"q": "كيف تبدو SOS بشيفرة مورس؟", "opts": ["---...---", "...---...", "...-...-", "-.-.-."], "ans": 1},
        },
        {
            "en": {"q": "Who invented Morse code?", "opts": ["Tesla", "Samuel Morse", "Edison", "Bell"], "ans": 1},
            "fr": {"q": "Qui a inventé le code Morse ?", "opts": ["Tesla", "Samuel Morse", "Edison", "Bell"], "ans": 1},
            "ar": {"q": "من اخترع شيفرة مورس؟", "opts": ["تسلا", "صامويل مورس", "إديسون", "بيل"], "ans": 1},
        },
        {
            "en": {"q": "In Morse code, what represents the letter E?", "opts": ["Dash", "Single dot", "Two dots", "Dot-dash"], "ans": 1},
            "fr": {"q": "En Morse, que représente la lettre E ?", "opts": ["Trait", "Un point", "Deux points", "Point-trait"], "ans": 1},
            "ar": {"q": "في شيفرة مورس، ما يمثل الحرف E؟", "opts": ["شرطة", "نقطة واحدة", "نقطتان", "نقطة-شرطة"], "ans": 1},
        },
    ],
    "network": [
        {
            "en": {"q": "What layer does TCP operate on in the OSI model?", "opts": ["Physical", "Data Link", "Network", "Transport"], "ans": 3},
            "fr": {"q": "Sur quelle couche OSI opère TCP ?", "opts": ["Physique", "Liaison", "Réseau", "Transport"], "ans": 3},
            "ar": {"q": "على أي طبقة OSI يعمل TCP؟", "opts": ["الفيزيائية", "ربط البيانات", "الشبكة", "النقل"], "ans": 3},
        },
        {
            "en": {"q": "What does IP stand for?", "opts": ["Internet Protocol", "Internal Program", "Input Process", "Information Path"], "ans": 0},
            "fr": {"q": "Que signifie IP ?", "opts": ["Internet Protocol", "Internal Program", "Input Process", "Information Path"], "ans": 0},
            "ar": {"q": "ماذا تعني IP؟", "opts": ["بروتوكول الإنترنت", "برنامج داخلي", "عملية إدخال", "مسار المعلومات"], "ans": 0},
        },
        {
            "en": {"q": "How many layers does the OSI model have?", "opts": ["4", "5", "7", "10"], "ans": 2},
            "fr": {"q": "Combien de couches a le modèle OSI ?", "opts": ["4", "5", "7", "10"], "ans": 2},
            "ar": {"q": "كم عدد طبقات نموذج OSI؟", "opts": ["4", "5", "7", "10"], "ans": 2},
        },
    ],
    "spy": [
        {
            "en": {"q": "What is steganography?", "opts": ["Loud communication", "Hiding messages within other data", "Deleting files", "Broadcasting signals"], "ans": 1},
            "fr": {"q": "Qu'est-ce que la stéganographie ?", "opts": ["Communication forte", "Cacher des messages dans d'autres données", "Supprimer des fichiers", "Diffuser des signaux"], "ans": 1},
            "ar": {"q": "ما هي إخفاء المعلومات؟", "opts": ["اتصال صاخب", "إخفاء رسائل داخل بيانات أخرى", "حذف ملفات", "بث إشارات"], "ans": 1},
        },
        {
            "en": {"q": "What is a dead drop?", "opts": ["Failed connection", "Secret location for exchanging messages", "Broken antenna", "Empty frequency"], "ans": 1},
            "fr": {"q": "Qu'est-ce qu'une boîte aux lettres morte ?", "opts": ["Connexion échouée", "Lieu secret pour échanger des messages", "Antenne cassée", "Fréquence vide"], "ans": 1},
            "ar": {"q": "ما هو صندوق البريد الميت؟", "opts": ["اتصال فاشل", "موقع سري لتبادل الرسائل", "هوائي مكسور", "تردد فارغ"], "ans": 1},
        },
        {
            "en": {"q": "What does SIGINT stand for?", "opts": ["Signal Integration", "Signals Intelligence", "Simple Interception", "System Intelligence"], "ans": 1},
            "fr": {"q": "Que signifie SIGINT ?", "opts": ["Signal Integration", "Signals Intelligence", "Simple Interception", "System Intelligence"], "ans": 1},
            "ar": {"q": "ماذا تعني SIGINT؟", "opts": ["تكامل الإشارات", "استخبارات الإشارات", "اعتراض بسيط", "استخبارات النظام"], "ans": 1},
        },
    ],
    "crypto": [
        {
            "en": {"q": "What is a hash function?", "opts": ["Encryption method", "One-way function producing fixed-size output", "Compression algorithm", "Random number generator"], "ans": 1},
            "fr": {"q": "Qu'est-ce qu'une fonction de hachage ?", "opts": ["Méthode de chiffrement", "Fonction unidirectionnelle à sortie fixe", "Algorithme de compression", "Générateur aléatoire"], "ans": 1},
            "ar": {"q": "ما هي دالة التجزئة؟", "opts": ["طريقة تشفير", "دالة أحادية الاتجاه بمخرج ثابت", "خوارزمية ضغط", "مولد أرقام عشوائية"], "ans": 1},
        },
        {
            "en": {"q": "What is public key cryptography?", "opts": ["Using same key for encrypt/decrypt", "Using a key pair (public and private)", "No keys needed", "Password-based only"], "ans": 1},
            "fr": {"q": "Qu'est-ce que la cryptographie à clé publique ?", "opts": ["Même clé pour chiffrer/déchiffrer", "Utiliser une paire de clés", "Pas de clé nécessaire", "Basée sur mot de passe"], "ans": 1},
            "ar": {"q": "ما هو تشفير المفتاح العام؟", "opts": ["نفس المفتاح للتشفير وفك التشفير", "استخدام زوج من المفاتيح", "لا حاجة لمفاتيح", "يعتمد على كلمة المرور فقط"], "ans": 1},
        },
        {
            "en": {"q": "What does RSA stand for?", "opts": ["Random Secure Algorithm", "Rivest-Shamir-Adleman", "Rapid Signal Authentication", "Radio Security Architecture"], "ans": 1},
            "fr": {"q": "Que signifie RSA ?", "opts": ["Random Secure Algorithm", "Rivest-Shamir-Adleman", "Rapid Signal Authentication", "Radio Security Architecture"], "ans": 1},
            "ar": {"q": "ماذا يعني RSA؟", "opts": ["خوارزمية عشوائية آمنة", "ريفست-شامير-أدلمان", "مصادقة إشارة سريعة", "بنية أمن الراديو"], "ans": 1},
        },
    ],
    "satellite": [
        {
            "en": {"q": "What orbit do GPS satellites use?", "opts": ["LEO", "MEO", "GEO", "HEO"], "ans": 1},
            "fr": {"q": "Quelle orbite utilisent les satellites GPS ?", "opts": ["LEO", "MEO", "GEO", "HEO"], "ans": 1},
            "ar": {"q": "أي مدار تستخدمه أقمار GPS؟", "opts": ["LEO", "MEO", "GEO", "HEO"], "ans": 1},
        },
        {
            "en": {"q": "How many GPS satellites are needed for a 3D fix?", "opts": ["2", "3", "4", "6"], "ans": 2},
            "fr": {"q": "Combien de satellites GPS faut-il pour un fix 3D ?", "opts": ["2", "3", "4", "6"], "ans": 2},
            "ar": {"q": "كم قمر GPS مطلوب لتحديد موقع ثلاثي الأبعاد؟", "opts": ["2", "3", "4", "6"], "ans": 2},
        },
        {
            "en": {"q": "What is the altitude of geostationary satellites?", "opts": ["200 km", "2,000 km", "20,200 km", "35,786 km"], "ans": 3},
            "fr": {"q": "Quelle est l'altitude des satellites géostationnaires ?", "opts": ["200 km", "2 000 km", "20 200 km", "35 786 km"], "ans": 3},
            "ar": {"q": "ما ارتفاع الأقمار الثابتة بالنسبة للأرض؟", "opts": ["200 كم", "2,000 كم", "20,200 كم", "35,786 كم"], "ans": 3},
        },
    ],
    "sdr": [
        {
            "en": {"q": "What does SDR stand for?", "opts": ["Signal Data Relay", "Software Defined Radio", "Secure Digital Receiver", "Standard Data Rate"], "ans": 1},
            "fr": {"q": "Que signifie SDR ?", "opts": ["Signal Data Relay", "Software Defined Radio", "Secure Digital Receiver", "Standard Data Rate"], "ans": 1},
            "ar": {"q": "ماذا تعني SDR؟", "opts": ["مرحل بيانات الإشارة", "الراديو المعرف بالبرمجيات", "مستقبل رقمي آمن", "معدل بيانات قياسي"], "ans": 1},
        },
        {
            "en": {"q": "What does an SDR replace with software?", "opts": ["Antenna", "Hardware radio components", "Power supply", "Display"], "ans": 1},
            "fr": {"q": "Que remplace un SDR par du logiciel ?", "opts": ["L'antenne", "Les composants radio matériels", "L'alimentation", "L'écran"], "ans": 1},
            "ar": {"q": "ما الذي يستبدله SDR بالبرمجيات؟", "opts": ["الهوائي", "مكونات الراديو المادية", "مصدر الطاقة", "الشاشة"], "ans": 1},
        },
        {
            "en": {"q": "What is the RTL-SDR based on?", "opts": ["FPGA", "RTL2832U chip", "Raspberry Pi", "Arduino"], "ans": 1},
            "fr": {"q": "Sur quoi est basé le RTL-SDR ?", "opts": ["FPGA", "Puce RTL2832U", "Raspberry Pi", "Arduino"], "ans": 1},
            "ar": {"q": "على ماذا يعتمد RTL-SDR؟", "opts": ["FPGA", "شريحة RTL2832U", "راسبيري باي", "أردوينو"], "ans": 1},
        },
    ],
    "ham": [
        {
            "en": {"q": "What license is needed for ham radio?", "opts": ["No license", "Amateur radio license", "Commercial license", "Military clearance"], "ans": 1},
            "fr": {"q": "Quelle licence faut-il pour la radio amateur ?", "opts": ["Aucune", "Licence radio amateur", "Licence commerciale", "Autorisation militaire"], "ans": 1},
            "ar": {"q": "ما الترخيص المطلوب للراديو الهاوي؟", "opts": ["لا ترخيص", "ترخيص راديو هاوي", "ترخيص تجاري", "تصريح عسكري"], "ans": 1},
        },
        {
            "en": {"q": "What does QSO mean in ham radio?", "opts": ["Quiet Signal Output", "A radio contact/conversation", "Quick Signal Off", "Quality Signal Operation"], "ans": 1},
            "fr": {"q": "Que signifie QSO en radio amateur ?", "opts": ["Quiet Signal Output", "Un contact radio", "Quick Signal Off", "Quality Signal Operation"], "ans": 1},
            "ar": {"q": "ماذا تعني QSO في الراديو الهاوي؟", "opts": ["إخراج إشارة هادئة", "اتصال/محادثة لاسلكية", "إيقاف إشارة سريع", "عملية إشارة عالية الجودة"], "ans": 1},
        },
        {
            "en": {"q": "What is the international distress frequency?", "opts": ["121.5 MHz", "145.5 MHz", "27 MHz", "462 MHz"], "ans": 0},
            "fr": {"q": "Quelle est la fréquence de détresse internationale ?", "opts": ["121,5 MHz", "145,5 MHz", "27 MHz", "462 MHz"], "ans": 0},
            "ar": {"q": "ما تردد الاستغاثة الدولي؟", "opts": ["121.5 ميغاهرتز", "145.5 ميغاهرتز", "27 ميغاهرتز", "462 ميغاهرتز"], "ans": 0},
        },
    ],
    "security": [
        {
            "en": {"q": "What is a firewall?", "opts": ["Antenna type", "Network security system filtering traffic", "Encryption algorithm", "Physical barrier"], "ans": 1},
            "fr": {"q": "Qu'est-ce qu'un pare-feu ?", "opts": ["Type d'antenne", "Système de sécurité réseau filtrant le trafic", "Algorithme de chiffrement", "Barrière physique"], "ans": 1},
            "ar": {"q": "ما هو جدار الحماية؟", "opts": ["نوع هوائي", "نظام أمن شبكة يفلتر حركة المرور", "خوارزمية تشفير", "حاجز مادي"], "ans": 1},
        },
        {
            "en": {"q": "What does 2FA stand for?", "opts": ["Two-Factor Authentication", "Two-File Access", "Twin Firewall Approach", "Two-Frequency Allocation"], "ans": 0},
            "fr": {"q": "Que signifie 2FA ?", "opts": ["Authentification à deux facteurs", "Accès à deux fichiers", "Approche double pare-feu", "Allocation double fréquence"], "ans": 0},
            "ar": {"q": "ماذا تعني 2FA؟", "opts": ["المصادقة الثنائية", "الوصول لملفين", "نهج جدار حماية مزدوج", "تخصيص تردد مزدوج"], "ans": 0},
        },
        {
            "en": {"q": "What is social engineering?", "opts": ["Building bridges", "Manipulating people to reveal information", "Network design", "Software testing"], "ans": 1},
            "fr": {"q": "Qu'est-ce que l'ingénierie sociale ?", "opts": ["Construire des ponts", "Manipuler les gens pour obtenir des informations", "Conception réseau", "Test logiciel"], "ans": 1},
            "ar": {"q": "ما هي الهندسة الاجتماعية؟", "opts": ["بناء الجسور", "التلاعب بالناس للكشف عن معلومات", "تصميم الشبكات", "اختبار البرمجيات"], "ans": 1},
        },
    ],
    "spectrum": [
        {
            "en": {"q": "What is the electromagnetic spectrum?", "opts": ["A type of antenna", "Range of all electromagnetic frequencies", "A sound wave chart", "A color wheel"], "ans": 1},
            "fr": {"q": "Qu'est-ce que le spectre électromagnétique ?", "opts": ["Un type d'antenne", "L'ensemble des fréquences EM", "Un graphique d'ondes sonores", "Un cercle chromatique"], "ans": 1},
            "ar": {"q": "ما هو الطيف الكهرومغناطيسي؟", "opts": ["نوع هوائي", "نطاق جميع الترددات الكهرومغناطيسية", "مخطط موجات صوتية", "عجلة ألوان"], "ans": 1},
        },
        {
            "en": {"q": "Which has a higher frequency: infrared or ultraviolet?", "opts": ["Infrared", "Ultraviolet", "Same frequency", "Neither"], "ans": 1},
            "fr": {"q": "Lequel a une fréquence plus élevée : infrarouge ou ultraviolet ?", "opts": ["Infrarouge", "Ultraviolet", "Même fréquence", "Aucun"], "ans": 1},
            "ar": {"q": "أيهما أعلى تردداً: الأشعة تحت الحمراء أم فوق البنفسجية؟", "opts": ["تحت الحمراء", "فوق البنفسجية", "نفس التردد", "لا أحد"], "ans": 1},
        },
        {
            "en": {"q": "What does a spectrum analyzer display?", "opts": ["Temperature", "Signal amplitude vs frequency", "Network traffic", "Battery level"], "ans": 1},
            "fr": {"q": "Qu'affiche un analyseur de spectre ?", "opts": ["Température", "Amplitude du signal vs fréquence", "Trafic réseau", "Niveau batterie"], "ans": 1},
            "ar": {"q": "ماذا يعرض محلل الطيف؟", "opts": ["الحرارة", "سعة الإشارة مقابل التردد", "حركة الشبكة", "مستوى البطارية"], "ans": 1},
        },
    ],
    "digital": [
        {
            "en": {"q": "What is a bit?", "opts": ["8 bytes", "The smallest unit of data (0 or 1)", "A type of wire", "A frequency band"], "ans": 1},
            "fr": {"q": "Qu'est-ce qu'un bit ?", "opts": ["8 octets", "La plus petite unité de données (0 ou 1)", "Un type de fil", "Une bande de fréquence"], "ans": 1},
            "ar": {"q": "ما هو البت؟", "opts": ["8 بايتات", "أصغر وحدة بيانات (0 أو 1)", "نوع من الأسلاك", "نطاق تردد"], "ans": 1},
        },
        {
            "en": {"q": "How many bits are in a byte?", "opts": ["4", "8", "16", "32"], "ans": 1},
            "fr": {"q": "Combien de bits dans un octet ?", "opts": ["4", "8", "16", "32"], "ans": 1},
            "ar": {"q": "كم بت في البايت؟", "opts": ["4", "8", "16", "32"], "ans": 1},
        },
        {
            "en": {"q": "What is sampling rate in digital signal processing?", "opts": ["Signal color", "Number of samples per second", "Wire thickness", "Antenna height"], "ans": 1},
            "fr": {"q": "Qu'est-ce que le taux d'échantillonnage ?", "opts": ["Couleur du signal", "Nombre d'échantillons par seconde", "Épaisseur du fil", "Hauteur d'antenne"], "ans": 1},
            "ar": {"q": "ما هو معدل أخذ العينات في معالجة الإشارات الرقمية؟", "opts": ["لون الإشارة", "عدد العينات في الثانية", "سمك السلك", "ارتفاع الهوائي"], "ans": 1},
        },
    ],
    "privacy": [
        {
            "en": {"q": "What does VPN stand for?", "opts": ["Virtual Private Network", "Very Private Node", "Visual Packet Network", "Verified Protocol Number"], "ans": 0},
            "fr": {"q": "Que signifie VPN ?", "opts": ["Virtual Private Network", "Very Private Node", "Visual Packet Network", "Verified Protocol Number"], "ans": 0},
            "ar": {"q": "ماذا تعني VPN؟", "opts": ["شبكة خاصة افتراضية", "عقدة خاصة جداً", "شبكة حزم مرئية", "رقم بروتوكول موثق"], "ans": 0},
        },
        {
            "en": {"q": "What is Tor used for?", "opts": ["Gaming", "Anonymous internet browsing", "Video editing", "3D printing"], "ans": 1},
            "fr": {"q": "À quoi sert Tor ?", "opts": ["Jeux", "Navigation internet anonyme", "Montage vidéo", "Impression 3D"], "ans": 1},
            "ar": {"q": "لماذا يُستخدم Tor؟", "opts": ["الألعاب", "تصفح الإنترنت بشكل مجهول", "تحرير الفيديو", "الطباعة ثلاثية الأبعاد"], "ans": 1},
        },
        {
            "en": {"q": "What is metadata?", "opts": ["Deleted data", "Data about data", "Encrypted data", "Compressed data"], "ans": 1},
            "fr": {"q": "Qu'est-ce que les métadonnées ?", "opts": ["Données supprimées", "Données sur les données", "Données chiffrées", "Données compressées"], "ans": 1},
            "ar": {"q": "ما هي البيانات الوصفية؟", "opts": ["بيانات محذوفة", "بيانات عن البيانات", "بيانات مشفرة", "بيانات مضغوطة"], "ans": 1},
        },
    ],
    "forensic": [
        {
            "en": {"q": "What is digital forensics?", "opts": ["Building computers", "Recovering and investigating digital evidence", "Formatting drives", "Writing software"], "ans": 1},
            "fr": {"q": "Qu'est-ce que la criminalistique numérique ?", "opts": ["Construire des ordinateurs", "Récupérer et enquêter sur des preuves numériques", "Formater des disques", "Écrire des logiciels"], "ans": 1},
            "ar": {"q": "ما هي الأدلة الجنائية الرقمية؟", "opts": ["بناء الحواسيب", "استرداد الأدلة الرقمية والتحقيق فيها", "تهيئة الأقراص", "كتابة البرمجيات"], "ans": 1},
        },
        {
            "en": {"q": "What is a disk image in forensics?", "opts": ["A photo of a disk", "Bit-for-bit copy of a storage device", "Formatted drive", "Empty partition"], "ans": 1},
            "fr": {"q": "Qu'est-ce qu'une image disque en forensique ?", "opts": ["Photo d'un disque", "Copie bit à bit d'un support", "Disque formaté", "Partition vide"], "ans": 1},
            "ar": {"q": "ما هي صورة القرص في الأدلة الجنائية؟", "opts": ["صورة للقرص", "نسخة بت لبت من جهاز التخزين", "قرص مهيأ", "قسم فارغ"], "ans": 1},
        },
        {
            "en": {"q": "What is chain of custody?", "opts": ["Hardware warranty", "Documented handling of evidence", "Network path", "Encryption chain"], "ans": 1},
            "fr": {"q": "Qu'est-ce que la chaîne de traçabilité ?", "opts": ["Garantie matérielle", "Documentation de la manipulation des preuves", "Chemin réseau", "Chaîne de chiffrement"], "ans": 1},
            "ar": {"q": "ما هي سلسلة الحراسة؟", "opts": ["ضمان العتاد", "توثيق التعامل مع الأدلة", "مسار الشبكة", "سلسلة التشفير"], "ans": 1},
        },
    ],
    "raspberry": [
        {
            "en": {"q": "What OS does Raspberry Pi commonly run?", "opts": ["Windows", "Raspberry Pi OS (Linux)", "macOS", "Android"], "ans": 1},
            "fr": {"q": "Quel OS utilise couramment le Raspberry Pi ?", "opts": ["Windows", "Raspberry Pi OS (Linux)", "macOS", "Android"], "ans": 1},
            "ar": {"q": "ما نظام التشغيل الشائع لـ Raspberry Pi؟", "opts": ["ويندوز", "Raspberry Pi OS (لينكس)", "ماك", "أندرويد"], "ans": 1},
        },
        {
            "en": {"q": "What are GPIO pins on Raspberry Pi?", "opts": ["Graphics outputs", "General Purpose Input/Output pins", "Ground pins only", "Generator pins"], "ans": 1},
            "fr": {"q": "Que sont les broches GPIO sur le Raspberry Pi ?", "opts": ["Sorties graphiques", "Broches d'entrée/sortie à usage général", "Broches de masse uniquement", "Broches de générateur"], "ans": 1},
            "ar": {"q": "ما هي دبابيس GPIO في Raspberry Pi؟", "opts": ["مخرجات رسومية", "دبابيس إدخال/إخراج متعددة الأغراض", "دبابيس أرضي فقط", "دبابيس مولد"], "ans": 1},
        },
        {
            "en": {"q": "What programming language is Raspberry Pi named after?", "opts": ["Java", "Python", "Ruby", "C++"], "ans": 1},
            "fr": {"q": "De quel langage le Raspberry Pi tire-t-il son nom ?", "opts": ["Java", "Python", "Ruby", "C++"], "ans": 1},
            "ar": {"q": "على اسم أي لغة برمجة سُمي Raspberry Pi؟", "opts": ["جافا", "بايثون", "روبي", "سي++"], "ans": 1},
        },
    ],
    "sensor": [
        {
            "en": {"q": "What does an accelerometer measure?", "opts": ["Temperature", "Acceleration/motion", "Light intensity", "Sound level"], "ans": 1},
            "fr": {"q": "Que mesure un accéléromètre ?", "opts": ["Température", "Accélération/mouvement", "Intensité lumineuse", "Niveau sonore"], "ans": 1},
            "ar": {"q": "ماذا يقيس مقياس التسارع؟", "opts": ["الحرارة", "التسارع/الحركة", "شدة الضوء", "مستوى الصوت"], "ans": 1},
        },
        {
            "en": {"q": "What does a gyroscope measure?", "opts": ["Speed", "Orientation and angular velocity", "Weight", "Distance"], "ans": 1},
            "fr": {"q": "Que mesure un gyroscope ?", "opts": ["Vitesse", "Orientation et vitesse angulaire", "Poids", "Distance"], "ans": 1},
            "ar": {"q": "ماذا يقيس الجيروسكوب؟", "opts": ["السرعة", "الاتجاه والسرعة الزاوية", "الوزن", "المسافة"], "ans": 1},
        },
        {
            "en": {"q": "What is an IR sensor used for?", "opts": ["Measuring weight", "Detecting infrared radiation", "Playing music", "Charging batteries"], "ans": 1},
            "fr": {"q": "À quoi sert un capteur IR ?", "opts": ["Mesurer le poids", "Détecter le rayonnement infrarouge", "Jouer de la musique", "Charger des batteries"], "ans": 1},
            "ar": {"q": "لماذا يُستخدم مستشعر الأشعة تحت الحمراء؟", "opts": ["قياس الوزن", "كشف الأشعة تحت الحمراء", "تشغيل الموسيقى", "شحن البطاريات"], "ans": 1},
        },
    ],
    "physics": [
        {
            "en": {"q": "What is Ohm's law?", "opts": ["F = ma", "V = IR", "E = mc²", "P = IV"], "ans": 1},
            "fr": {"q": "Quelle est la loi d'Ohm ?", "opts": ["F = ma", "V = IR", "E = mc²", "P = IV"], "ans": 1},
            "ar": {"q": "ما هو قانون أوم؟", "opts": ["F = ma", "V = IR", "E = mc²", "P = IV"], "ans": 1},
        },
        {
            "en": {"q": "What is impedance measured in?", "opts": ["Farads", "Henrys", "Ohms", "Watts"], "ans": 2},
            "fr": {"q": "En quoi se mesure l'impédance ?", "opts": ["Farads", "Henrys", "Ohms", "Watts"], "ans": 2},
            "ar": {"q": "بماذا تُقاس المعاوقة؟", "opts": ["فاراد", "هنري", "أوم", "واط"], "ans": 2},
        },
        {
            "en": {"q": "What is the relationship between wavelength and frequency?", "opts": ["Directly proportional", "Inversely proportional", "No relationship", "Exponential"], "ans": 1},
            "fr": {"q": "Quelle relation entre longueur d'onde et fréquence ?", "opts": ["Directement proportionnelle", "Inversement proportionnelle", "Aucune relation", "Exponentielle"], "ans": 1},
            "ar": {"q": "ما العلاقة بين طول الموجة والتردد؟", "opts": ["تناسب طردي", "تناسب عكسي", "لا علاقة", "أسية"], "ans": 1},
        },
    ],
    "acoustic": [
        {
            "en": {"q": "What is the speed of sound in air at 20°C?", "opts": ["200 m/s", "343 m/s", "500 m/s", "1000 m/s"], "ans": 1},
            "fr": {"q": "Quelle est la vitesse du son dans l'air à 20°C ?", "opts": ["200 m/s", "343 m/s", "500 m/s", "1000 m/s"], "ans": 1},
            "ar": {"q": "ما سرعة الصوت في الهواء عند 20 درجة مئوية؟", "opts": ["200 م/ث", "343 م/ث", "500 م/ث", "1000 م/ث"], "ans": 1},
        },
        {
            "en": {"q": "What frequency range can humans hear?", "opts": ["1-100 Hz", "20-20,000 Hz", "100-50,000 Hz", "1-1,000 Hz"], "ans": 1},
            "fr": {"q": "Quelle plage de fréquences l'humain peut-il entendre ?", "opts": ["1-100 Hz", "20-20 000 Hz", "100-50 000 Hz", "1-1 000 Hz"], "ans": 1},
            "ar": {"q": "ما نطاق التردد الذي يسمعه الإنسان؟", "opts": ["1-100 هرتز", "20-20,000 هرتز", "100-50,000 هرتز", "1-1,000 هرتز"], "ans": 1},
        },
        {
            "en": {"q": "What is ultrasound?", "opts": ["Sound below 20 Hz", "Sound above 20,000 Hz", "Normal speech", "Radio waves"], "ans": 1},
            "fr": {"q": "Qu'est-ce que l'ultrason ?", "opts": ["Son sous 20 Hz", "Son au-dessus de 20 000 Hz", "Parole normale", "Ondes radio"], "ans": 1},
            "ar": {"q": "ما هو الموجات فوق الصوتية؟", "opts": ["صوت أقل من 20 هرتز", "صوت أعلى من 20,000 هرتز", "كلام عادي", "موجات راديو"], "ans": 1},
        },
    ],
    "swarm": [
        {
            "en": {"q": "What is swarm intelligence?", "opts": ["Single robot control", "Collective behavior of decentralized systems", "Cloud computing", "Database management"], "ans": 1},
            "fr": {"q": "Qu'est-ce que l'intelligence en essaim ?", "opts": ["Contrôle d'un seul robot", "Comportement collectif de systèmes décentralisés", "Cloud computing", "Gestion de base de données"], "ans": 1},
            "ar": {"q": "ما هو ذكاء السرب؟", "opts": ["التحكم بروبوت واحد", "السلوك الجماعي للأنظمة اللامركزية", "الحوسبة السحابية", "إدارة قواعد البيانات"], "ans": 1},
        },
        {
            "en": {"q": "Which natural system inspired swarm algorithms?", "opts": ["Planets", "Ant colonies", "Rivers", "Mountains"], "ans": 1},
            "fr": {"q": "Quel système naturel a inspiré les algorithmes en essaim ?", "opts": ["Planètes", "Colonies de fourmis", "Rivières", "Montagnes"], "ans": 1},
            "ar": {"q": "أي نظام طبيعي ألهم خوارزميات السرب؟", "opts": ["الكواكب", "مستعمرات النمل", "الأنهار", "الجبال"], "ans": 1},
        },
        {
            "en": {"q": "What is a key advantage of swarm systems?", "opts": ["Central control", "Robustness through redundancy", "Single point of failure", "High cost"], "ans": 1},
            "fr": {"q": "Quel est l'avantage clé des systèmes en essaim ?", "opts": ["Contrôle central", "Robustesse par redondance", "Point unique de défaillance", "Coût élevé"], "ans": 1},
            "ar": {"q": "ما الميزة الرئيسية لأنظمة السرب؟", "opts": ["التحكم المركزي", "المتانة من خلال التكرار", "نقطة فشل واحدة", "تكلفة عالية"], "ans": 1},
        },
    ],
    "ai": [
        {
            "en": {"q": "What does AI stand for?", "opts": ["Automated Input", "Artificial Intelligence", "Analog Interface", "Active Integration"], "ans": 1},
            "fr": {"q": "Que signifie IA ?", "opts": ["Entrée automatisée", "Intelligence Artificielle", "Interface analogique", "Intégration active"], "ans": 1},
            "ar": {"q": "ماذا تعني AI؟", "opts": ["إدخال آلي", "الذكاء الاصطناعي", "واجهة تناظرية", "تكامل نشط"], "ans": 1},
        },
        {
            "en": {"q": "What is machine learning?", "opts": ["Programming robots", "Systems that learn from data", "Manual computation", "Hardware design"], "ans": 1},
            "fr": {"q": "Qu'est-ce que l'apprentissage automatique ?", "opts": ["Programmer des robots", "Systèmes apprenant des données", "Calcul manuel", "Conception matérielle"], "ans": 1},
            "ar": {"q": "ما هو التعلم الآلي؟", "opts": ["برمجة الروبوتات", "أنظمة تتعلم من البيانات", "حساب يدوي", "تصميم العتاد"], "ans": 1},
        },
        {
            "en": {"q": "What is a neural network?", "opts": ["Physical wires", "Computing system inspired by biological neurons", "Social network", "Radio network"], "ans": 1},
            "fr": {"q": "Qu'est-ce qu'un réseau de neurones ?", "opts": ["Fils physiques", "Système informatique inspiré des neurones", "Réseau social", "Réseau radio"], "ans": 1},
            "ar": {"q": "ما هي الشبكة العصبية؟", "opts": ["أسلاك مادية", "نظام حوسبة مستوحى من الخلايا العصبية", "شبكة اجتماعية", "شبكة راديو"], "ans": 1},
        },
    ],
    "hardware": [
        {
            "en": {"q": "What is a PCB?", "opts": ["Personal Computer Box", "Printed Circuit Board", "Power Control Bus", "Programmable Chip Board"], "ans": 1},
            "fr": {"q": "Qu'est-ce qu'un PCB ?", "opts": ["Personal Computer Box", "Circuit imprimé", "Power Control Bus", "Programmable Chip Board"], "ans": 1},
            "ar": {"q": "ما هو PCB؟", "opts": ["صندوق كمبيوتر شخصي", "لوحة دارة مطبوعة", "ناقل التحكم بالطاقة", "لوحة شريحة قابلة للبرمجة"], "ans": 1},
        },
        {
            "en": {"q": "What is a capacitor used for?", "opts": ["Generating light", "Storing electrical energy", "Measuring temperature", "Transmitting radio"], "ans": 1},
            "fr": {"q": "À quoi sert un condensateur ?", "opts": ["Générer de la lumière", "Stocker l'énergie électrique", "Mesurer la température", "Transmettre la radio"], "ans": 1},
            "ar": {"q": "لماذا يُستخدم المكثف؟", "opts": ["توليد الضوء", "تخزين الطاقة الكهربائية", "قياس الحرارة", "بث الراديو"], "ans": 1},
        },
        {
            "en": {"q": "What does LED stand for?", "opts": ["Low Energy Display", "Light Emitting Diode", "Linear Electric Device", "Laser Enhanced Detector"], "ans": 1},
            "fr": {"q": "Que signifie LED ?", "opts": ["Low Energy Display", "Diode électroluminescente", "Linear Electric Device", "Laser Enhanced Detector"], "ans": 1},
            "ar": {"q": "ماذا تعني LED؟", "opts": ["شاشة منخفضة الطاقة", "صمام ثنائي باعث للضوء", "جهاز كهربائي خطي", "كاشف ليزر محسن"], "ans": 1},
        },
    ],
    "evasion": [
        {
            "en": {"q": "What is counter-surveillance?", "opts": ["Installing cameras", "Detecting and avoiding surveillance", "Watching TV", "Reading newspapers"], "ans": 1},
            "fr": {"q": "Qu'est-ce que la contre-surveillance ?", "opts": ["Installer des caméras", "Détecter et éviter la surveillance", "Regarder la TV", "Lire les journaux"], "ans": 1},
            "ar": {"q": "ما هي مكافحة المراقبة؟", "opts": ["تركيب كاميرات", "كشف وتجنب المراقبة", "مشاهدة التلفاز", "قراءة الصحف"], "ans": 1},
        },
        {
            "en": {"q": "What is an air gap in security?", "opts": ["Ventilation system", "Physical isolation of a computer from networks", "Space between antennas", "Battery gap"], "ans": 1},
            "fr": {"q": "Qu'est-ce qu'un air gap en sécurité ?", "opts": ["Système de ventilation", "Isolation physique d'un ordinateur des réseaux", "Espace entre antennes", "Écart de batterie"], "ans": 1},
            "ar": {"q": "ما هي الفجوة الهوائية في الأمن؟", "opts": ["نظام تهوية", "عزل فيزيائي للحاسوب عن الشبكات", "مسافة بين الهوائيات", "فجوة البطارية"], "ans": 1},
        },
        {
            "en": {"q": "What is OPSEC?", "opts": ["Operating System Security", "Operations Security - protecting critical information", "Optical Security", "Online Privacy Settings"], "ans": 1},
            "fr": {"q": "Qu'est-ce que l'OPSEC ?", "opts": ["Sécurité du système", "Sécurité opérationnelle - protéger les infos critiques", "Sécurité optique", "Paramètres de confidentialité en ligne"], "ans": 1},
            "ar": {"q": "ما هي OPSEC؟", "opts": ["أمن نظام التشغيل", "أمن العمليات - حماية المعلومات الحساسة", "أمن بصري", "إعدادات الخصوصية عبر الإنترنت"], "ans": 1},
        },
    ],
    "dsp": [
        {
            "en": {"q": "What does DSP stand for?", "opts": ["Digital Signal Processing", "Data Storage Protocol", "Direct Signal Path", "Dynamic System Power"], "ans": 0},
            "fr": {"q": "Que signifie DSP ?", "opts": ["Digital Signal Processing", "Data Storage Protocol", "Direct Signal Path", "Dynamic System Power"], "ans": 0},
            "ar": {"q": "ماذا تعني DSP؟", "opts": ["معالجة الإشارات الرقمية", "بروتوكول تخزين البيانات", "مسار الإشارة المباشر", "طاقة النظام الديناميكية"], "ans": 0},
        },
        {
            "en": {"q": "What is the Nyquist theorem about?", "opts": ["Power consumption", "Minimum sampling rate must be 2x the max frequency", "Antenna design", "Battery life"], "ans": 1},
            "fr": {"q": "De quoi parle le théorème de Nyquist ?", "opts": ["Consommation", "Le taux d'échantillonnage min doit être 2x la fréquence max", "Conception d'antenne", "Autonomie"], "ans": 1},
            "ar": {"q": "ما هي نظرية نايكويست؟", "opts": ["استهلاك الطاقة", "الحد الأدنى لمعدل أخذ العينات ضعف أقصى تردد", "تصميم الهوائي", "عمر البطارية"], "ans": 1},
        },
        {
            "en": {"q": "What is FFT used for?", "opts": ["File transfer", "Converting time-domain to frequency-domain", "Formatting text", "Finding files"], "ans": 1},
            "fr": {"q": "À quoi sert la FFT ?", "opts": ["Transfert de fichiers", "Convertir le domaine temporel en fréquentiel", "Formater du texte", "Trouver des fichiers"], "ans": 1},
            "ar": {"q": "لماذا تُستخدم FFT؟", "opts": ["نقل الملفات", "تحويل المجال الزمني إلى الترددي", "تنسيق النص", "إيجاد الملفات"], "ans": 1},
        },
    ],
    "emergency": [
        {
            "en": {"q": "What is the international maritime distress signal?", "opts": ["SOS", "MAYDAY", "HELP", "911"], "ans": 1},
            "fr": {"q": "Quel est le signal de détresse maritime international ?", "opts": ["SOS", "MAYDAY", "HELP", "911"], "ans": 1},
            "ar": {"q": "ما إشارة الاستغاثة البحرية الدولية؟", "opts": ["SOS", "MAYDAY", "HELP", "911"], "ans": 1},
        },
        {
            "en": {"q": "What frequency is used for emergency position beacons (EPIRB)?", "opts": ["121.5 MHz", "406 MHz", "500 kHz", "2.4 GHz"], "ans": 1},
            "fr": {"q": "Quelle fréquence utilisent les balises de détresse (EPIRB) ?", "opts": ["121,5 MHz", "406 MHz", "500 kHz", "2,4 GHz"], "ans": 1},
            "ar": {"q": "ما التردد المستخدم لمنارات تحديد الموقع في حالات الطوارئ؟", "opts": ["121.5 ميغاهرتز", "406 ميغاهرتز", "500 كيلوهرتز", "2.4 غيغاهرتز"], "ans": 1},
        },
        {
            "en": {"q": "What does EAS stand for?", "opts": ["Electronic Alert System", "Emergency Alert System", "Emergency Audio Signal", "External Alarm System"], "ans": 1},
            "fr": {"q": "Que signifie EAS ?", "opts": ["Electronic Alert System", "Emergency Alert System", "Emergency Audio Signal", "External Alarm System"], "ans": 1},
            "ar": {"q": "ماذا تعني EAS؟", "opts": ["نظام تنبيه إلكتروني", "نظام إنذار الطوارئ", "إشارة صوت الطوارئ", "نظام إنذار خارجي"], "ans": 1},
        },
    ],
}

# Fallback keyword for apps that don't match any specific keyword
DEFAULT_KEYWORDS = ["signal", "digital", "physics"]


def find_matching_keywords(app_dir_name, script_content):
    """Find keywords that match the app's directory name or script content."""
    app_lower = app_dir_name.lower()
    content_lower = script_content[:2000].lower()  # Check first 2000 chars

    matched = []
    for kw in QUIZ_BANK:
        if kw in app_lower or kw in content_lower:
            matched.append(kw)

    return matched if matched else DEFAULT_KEYWORDS


def select_questions(keywords, seed_str):
    """Select 5 questions from matched keywords using deterministic random."""
    rng = random.Random(seed_str)

    # Collect all available questions from matching keywords
    pool = []
    for kw in keywords:
        if kw in QUIZ_BANK:
            for q in QUIZ_BANK[kw]:
                pool.append(q)

    # If not enough, add from default
    if len(pool) < 5:
        for kw in DEFAULT_KEYWORDS:
            if kw not in keywords and kw in QUIZ_BANK:
                for q in QUIZ_BANK[kw]:
                    pool.append(q)

    rng.shuffle(pool)
    return pool[:5]


def build_quiz_lang_keys(questions):
    """Build the LANG keys for quiz questions."""
    keys = {
        "en": {
            "quizTab": "Quiz",
            "quizTitle": "Test Your Knowledge",
            "quizRetry": "Retry",
            "quizCorrect": "Correct!",
            "quizWrong": "Wrong!",
            "quizScore": "Score",
        },
        "fr": {
            "quizTab": "Quiz",
            "quizTitle": "Testez vos connaissances",
            "quizRetry": "Rejouer",
            "quizCorrect": "Correct !",
            "quizWrong": "Faux !",
            "quizScore": "Score",
        },
        "ar": {
            "quizTab": "اختبار",
            "quizTitle": "اختبر معلوماتك",
            "quizRetry": "إعادة",
            "quizCorrect": "صحيح!",
            "quizWrong": "خطأ!",
            "quizScore": "النتيجة",
        },
    }

    for i, q in enumerate(questions, 1):
        for lang in ("en", "fr", "ar"):
            qdata = q[lang]
            keys[lang][f"quiz_q{i}"] = qdata["q"]
            for j, opt in enumerate(qdata["opts"]):
                keys[lang][f"quiz_q{i}" + chr(97 + j)] = opt  # a,b,c,d
            keys[lang][f"quiz_q{i}_answer"] = str(qdata["ans"])

    return keys


def escape_js_string(s):
    """Escape a string for use in JS single-quoted strings."""
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")


def format_lang_entries(lang_keys):
    """Format quiz LANG entries as JS key-value pairs."""
    parts = []
    for k, v in lang_keys.items():
        parts.append(f"{k}:'{escape_js_string(v)}'")
    return ",".join(parts)


# The quiz JavaScript function to inject
QUIZ_JS = r"""function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}"""


def inject_into_old_template(script_content, quiz_keys):
    """
    Old template: multi-line LANG object with ...LANG_BASE.en, etc.
    Each language block ends with a closing brace } on its own area.
    We find each ...LANG_BASE.XX line and inject quiz keys into that block.
    """
    # Find the LAST 'const LANG = {' or 'const LANG={'
    # We need to inject quiz keys into each of the three language sections (en, fr, ar)

    for lang in ("en", "fr", "ar"):
        entries = format_lang_entries(quiz_keys[lang])

        # For old template: find the pattern "...LANG_BASE.XX," and the closing of that language block
        # The language blocks end with patterns like: glossTitle: '....',learnAge:'...'}
        # We need to find the last property before the closing brace of each lang section
        #
        # Strategy: Find ...LANG_BASE.<lang>, then find the closing } of that section
        # and insert our keys before it.

        # Find the last occurrence of ...LANG_BASE.<lang> (there should be exactly one per LANG block)
        # We work with the last const LANG block

        # Find the last 'const LANG' that isn't LANG_BASE
        lang_matches = list(re.finditer(r'const LANG\s*=\s*\{', script_content))
        if not lang_matches:
            continue

        # Use the last one
        lang_start = lang_matches[-1].start()
        working = script_content[lang_start:]

        # Find ...LANG_BASE.<lang> in this section
        spread_pattern = f"...LANG_BASE.{lang}"
        spread_idx = working.find(spread_pattern)
        if spread_idx == -1:
            continue

        # Find the closing } for this language section
        # After the spread, we need to find where this lang's object ends
        # It ends with } (possibly after learnAge:'...')
        # We need to be careful to match the right closing brace

        # Find the position of the next language section or the end of LANG
        # Look for the pattern: }  followed by next language or };
        abs_spread = lang_start + spread_idx

        # From the spread, find the section's closing brace
        # The section ends with something like: learnAge:'العمر:'} or learnAge:'Ages:'}
        # We need to find the } that closes this specific language section

        # Count braces from the opening of the language section
        # Find the { that opens this language section
        # Look backwards from spread to find 'en: {' or similar
        before_spread = working[:spread_idx]
        lang_open_match = re.search(rf'{lang}\s*:\s*\{{', before_spread)
        if not lang_open_match:
            continue

        brace_start = lang_start + lang_open_match.end() - 1  # Position of {

        # Count braces to find matching }
        depth = 0
        close_pos = None
        for i in range(brace_start, len(script_content)):
            c = script_content[i]
            if c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    close_pos = i
                    break

        if close_pos is None:
            continue

        # Insert before the closing }
        # Check if there's a comma before
        insert_point = close_pos
        before_close = script_content[insert_point - 1]
        comma = "" if before_close == "," else ","

        script_content = (
            script_content[:insert_point]
            + comma + entries
            + script_content[insert_point:]
        )

    # Inject quiz JS after the LANG block
    # Try 'let currentLang' first, then fall back to finding the end of LANG block
    current_lang_match = re.search(r'let currentLang\s*=', script_content)
    if current_lang_match:
        inject_pos = current_lang_match.start()
        script_content = (
            script_content[:inject_pos]
            + QUIZ_JS + "\n"
            + script_content[inject_pos:]
        )
    else:
        # Fallback: find the closing }; of the LANG block and inject after it
        # Find the last 'const LANG' that isn't LANG_BASE
        lang_matches = list(re.finditer(r'const LANG\s*=\s*\{', script_content))
        if lang_matches:
            lang_start = lang_matches[-1].start()
            # Find the matching closing };
            depth = 0
            close_pos = None
            found_first_brace = False
            for i in range(lang_start, len(script_content)):
                if script_content[i] == '{':
                    depth += 1
                    found_first_brace = True
                elif script_content[i] == '}':
                    depth -= 1
                    if found_first_brace and depth == 0:
                        # Skip past the semicolon if present
                        close_pos = i + 1
                        if close_pos < len(script_content) and script_content[close_pos] == ';':
                            close_pos += 1
                        break
            if close_pos:
                script_content = (
                    script_content[:close_pos]
                    + "\n" + QUIZ_JS + "\n"
                    + script_content[close_pos:]
                )

    return script_content


def inject_into_script(script_content, quiz_keys, app_path):
    """Inject quiz LANG keys and quiz JS into a script.js file."""
    # Both templates use LANG_BASE and const LANG with ...LANG_BASE.XX
    # The difference is formatting: old is multi-line, new is compact
    # We use the same approach: find each language section and inject before closing }
    return inject_into_old_template(script_content, quiz_keys)


def inject_into_html(html_content):
    """Inject quiz tab button and quiz content div into index.html."""

    # 1. Add quiz tab button after kids tab (or after last help-tab if no kids tab)
    quiz_tab = '<button class="help-tab" data-tab="quiz" data-i18n="quizTab">Quiz</button>'
    kids_tab_pattern = r'(<button\s+class="help-tab"\s+data-tab="kids"[^>]*>[^<]*</button>)'
    kids_match = re.search(kids_tab_pattern, html_content)
    if kids_match:
        insert_pos = kids_match.end()
        html_content = html_content[:insert_pos] + quiz_tab + html_content[insert_pos:]
    else:
        # No kids tab — insert after the last help-tab button in the help-tabs div
        all_tabs = list(re.finditer(r'<button\s+class="help-tab"[^>]*>[^<]*</button>', html_content))
        if all_tabs:
            insert_pos = all_tabs[-1].end()
            html_content = html_content[:insert_pos] + quiz_tab + html_content[insert_pos:]

    # 2. Add quiz content div after helpKids (or after last help-content if no helpKids)
    quiz_div = (
        '<div class="help-content" id="helpQuiz">'
        '<h3 data-i18n="quizTitle">&#129514; Test Your Knowledge</h3>'
        '<div id="quizContainer"></div>'
        '<div id="quizScore" style="display:none;margin-top:1rem;padding:1rem;border-radius:8px;background:rgba(var(--accent-rgb),0.1);text-align:center;">'
        '<p id="quizScoreText" style="font-size:1.2rem;font-weight:700;"></p>'
        '<button onclick="startQuiz()" class="btn-sm" style="margin-top:0.5rem;" data-i18n="quizRetry">Retry</button>'
        '</div></div>'
    )

    def find_div_close(html, div_start_pos):
        """Find the matching </div> for a div starting at div_start_pos."""
        pos = div_start_pos
        depth = 0
        while pos < len(html):
            next_open = html.find('<div', pos)
            next_close = html.find('</div>', pos)
            if next_open == -1:
                next_open = len(html) + 1
            if next_close == -1:
                return None
            if next_open < next_close:
                depth += 1
                pos = next_open + 4
            else:
                depth -= 1
                if depth == 0:
                    return next_close + len('</div>')
                pos = next_close + 6
        return None

    help_kids_match = re.search(r'id="helpKids"', html_content)
    if help_kids_match:
        div_start = html_content.rfind('<div', 0, help_kids_match.start())
        if div_start != -1:
            close_pos = find_div_close(html_content, div_start)
            if close_pos:
                html_content = html_content[:close_pos] + quiz_div + html_content[close_pos:]
    else:
        # No helpKids - find the last help-content div and insert after it
        # Or insert before the sidebar-footer inside the help panel
        # Strategy: find all help-content divs and insert after the last one
        all_help_content = list(re.finditer(r'<div\s+class="help-content"', html_content))
        if all_help_content:
            last_match = all_help_content[-1]
            div_start = last_match.start()
            close_pos = find_div_close(html_content, div_start)
            if close_pos:
                html_content = html_content[:close_pos] + quiz_div + html_content[close_pos:]

    return html_content


def inject_quiz_function(script_content):
    """Inject only the startQuiz function into script.js (LANG keys already present)."""
    if "startQuiz" in script_content:
        return script_content

    # Try 'let currentLang' first
    current_lang_match = re.search(r'let currentLang\s*=', script_content)
    if current_lang_match:
        inject_pos = current_lang_match.start()
        return script_content[:inject_pos] + QUIZ_JS + "\n" + script_content[inject_pos:]

    # Fallback: find the closing }; of the last LANG block
    lang_matches = list(re.finditer(r'const LANG\s*=\s*\{', script_content))
    if lang_matches:
        lang_start = lang_matches[-1].start()
        depth = 0
        found_first_brace = False
        for i in range(lang_start, len(script_content)):
            if script_content[i] == '{':
                depth += 1
                found_first_brace = True
            elif script_content[i] == '}':
                depth -= 1
                if found_first_brace and depth == 0:
                    close_pos = i + 1
                    if close_pos < len(script_content) and script_content[close_pos] == ';':
                        close_pos += 1
                    return (
                        script_content[:close_pos]
                        + "\n" + QUIZ_JS + "\n"
                        + script_content[close_pos:]
                    )

    return script_content


def process_app(app_dir):
    """Process a single app directory."""
    script_path = os.path.join(app_dir, "script.js")
    html_path = os.path.join(app_dir, "index.html")

    if not os.path.isfile(script_path) or not os.path.isfile(html_path):
        return "SKIP_NO_FILES"

    # Read script.js
    with open(script_path, "r", encoding="utf-8") as f:
        script_content = f.read()

    # Read index.html
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    # Check what's already done
    has_quiz_lang = "quiz_q1" in script_content
    has_quiz_fn = "startQuiz" in script_content
    has_quiz_tab = 'data-tab="quiz"' in html_content
    has_quiz_div = 'id="helpQuiz"' in html_content

    # Skip if everything is fully done
    if has_quiz_lang and has_quiz_fn and has_quiz_tab and has_quiz_div:
        return "SKIP_ALREADY"

    already_has_quiz_js = has_quiz_lang

    # Process script.js: add LANG keys and/or startQuiz function
    script_modified = False
    if not already_has_quiz_js:
        # Full injection: LANG keys + quiz function
        app_name = os.path.basename(app_dir)
        parent_name = os.path.basename(os.path.dirname(app_dir))
        search_name = f"{parent_name}/{app_name}"

        keywords = find_matching_keywords(search_name, script_content)
        questions = select_questions(keywords, search_name)
        quiz_keys = build_quiz_lang_keys(questions)

        script_content = inject_into_script(script_content, quiz_keys, app_dir)
        script_modified = True
    elif not has_quiz_fn:
        # LANG keys already present but startQuiz function missing
        script_content = inject_quiz_function(script_content)
        script_modified = True

    if script_modified:
        with open(script_path, "w", encoding="utf-8") as f:
            f.write(script_content)

    # Always re-check and fix HTML if quiz tab missing
    if 'data-tab="quiz"' not in html_content or 'id="helpQuiz"' not in html_content:
        new_html = inject_into_html(html_content)
        with open(html_path, "w", encoding="utf-8") as f:
            f.write(new_html)

    return "OK"


def find_all_apps():
    """Find all app directories (those containing script.js and index.html)."""
    apps = []
    for cat_dir in sorted(os.listdir(BASE)):
        cat_path = os.path.join(BASE, cat_dir)
        if not os.path.isdir(cat_path) or not re.match(r'\d{2}-', cat_dir):
            continue
        for app_dir in sorted(os.listdir(cat_path)):
            app_path = os.path.join(cat_path, app_dir)
            if not os.path.isdir(app_path):
                continue
            if app_dir.startswith('_'):
                continue
            script_path = os.path.join(app_path, "script.js")
            if os.path.isfile(script_path):
                apps.append(app_path)
    return apps


def main():
    apps = find_all_apps()
    print(f"Found {len(apps)} apps to process.")

    stats = {"OK": 0, "SKIP_ALREADY": 0, "SKIP_NO_FILES": 0, "ERROR": 0}
    errors = []

    for app_path in apps:
        try:
            result = process_app(app_path)
            stats[result] = stats.get(result, 0) + 1
        except Exception as e:
            stats["ERROR"] += 1
            errors.append((app_path, str(e)))
            import traceback
            traceback.print_exc()

    print(f"\nResults:")
    print(f"  Processed OK: {stats['OK']}")
    print(f"  Skipped (already has quiz): {stats['SKIP_ALREADY']}")
    print(f"  Skipped (no files): {stats['SKIP_NO_FILES']}")
    print(f"  Errors: {stats['ERROR']}")

    if errors:
        print(f"\nErrors:")
        for path, err in errors:
            print(f"  {path}: {err}")

    # Quick syntax validation: check a few random files for quiz_q1
    import random as rng
    rng.seed(42)
    sample = rng.sample(apps, min(10, len(apps)))
    ok_count = 0
    for path in sample:
        with open(os.path.join(path, "script.js"), "r", encoding="utf-8") as f:
            content = f.read()
        if "quiz_q1" in content and "startQuiz" in content:
            ok_count += 1
        else:
            print(f"  VALIDATION FAIL: {path}")

    print(f"\nValidation: {ok_count}/{len(sample)} sampled files contain quiz_q1 and startQuiz.")


if __name__ == "__main__":
    main()
