#!/usr/bin/env python3
"""
Add three features to all 488 ops-catalog apps:
  1. Morse Code Easter Egg
  2. DNA Fingerprint Visualizer
  3. Sandbox Mode

Idempotent: checks for 'morseSecret' before modifying.
Restores from backup zip if files are corrupted.
"""

import os
import re
import glob
import random
import zipfile
import subprocess
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
ZIP_PATH = os.path.join(os.path.dirname(os.path.dirname(BASE)), '05_more_apps.zip')


# ── Restore from zip if needed ────────────────────────────────

def restore_from_zip():
    """Restore all script.js files from the backup zip."""
    if not os.path.exists(ZIP_PATH):
        print(f"WARNING: Backup zip not found at {ZIP_PATH}")
        return 0

    z = zipfile.ZipFile(ZIP_PATH)
    base_parent = os.path.dirname(os.path.dirname(BASE))

    matches = [n for n in z.namelist()
               if '/ops-catalog/' in n and n.endswith('/script.js')
               and '/ops-catalog/script.js' not in n]

    restored = 0
    for name in matches:
        dest = os.path.join(base_parent, name)
        if os.path.exists(os.path.dirname(dest)):
            data = z.read(name)
            with open(dest, 'wb') as f:
                f.write(data)
            restored += 1

    z.close()
    return restored


# ── Category-aware backstory mapping ──────────────────────────

BACKSTORY_MAP = {
    'spy': {
        'en': 'This tool was originally designed in 1962 by a covert CIA unit operating from a bookshop in Vienna. It was smuggled across the Iron Curtain inside a hollowed-out chess piece.',
        'fr': 'Cet outil a ete concu en 1962 par une unite secrete de la CIA operant depuis une librairie a Vienne. Il a ete passe de l autre cote du rideau de fer dans une piece d echecs evidee.',
        'ar': '\u0635\u064f\u0645\u0645\u062a \u0647\u0630\u0647 \u0627\u0644\u0623\u062f\u0627\u0629 \u0641\u064a \u0627\u0644\u0623\u0635\u0644 \u0639\u0627\u0645 1962 \u0628\u0648\u0627\u0633\u0637\u0629 \u0648\u062d\u062f\u0629 \u0633\u0631\u064a\u0629 \u062a\u0627\u0628\u0639\u0629 \u0644\u0648\u0643\u0627\u0644\u0629 \u0627\u0644\u0627\u0633\u062a\u062e\u0628\u0627\u0631\u0627\u062a \u0627\u0644\u0645\u0631\u0643\u0632\u064a\u0629 \u0645\u0646 \u0645\u0643\u062a\u0628\u0629 \u0641\u064a \u0641\u064a\u064a\u0646\u0627'
    },
    'net': {
        'en': 'Originally a secret mesh protocol designed for submarine communication in the North Atlantic. The first prototype ran on vacuum tubes salvaged from a sunken destroyer.',
        'fr': 'A l origine un protocole mesh secret concu pour la communication sous-marine dans l Atlantique Nord. Le premier prototype fonctionnait avec des tubes a vide recuperes d un destroyer coule.',
        'ar': '\u0641\u064a \u0627\u0644\u0623\u0635\u0644 \u0628\u0631\u0648\u062a\u0648\u0643\u0648\u0644 \u0634\u0628\u0643\u0629 \u0633\u0631\u064a \u0645\u0635\u0645\u0645 \u0644\u0644\u0627\u062a\u0635\u0627\u0644\u0627\u062a \u062a\u062d\u062a \u0627\u0644\u0645\u0627\u0621 \u0641\u064a \u0634\u0645\u0627\u0644 \u0627\u0644\u0623\u0637\u0644\u0633\u064a'
    },
    'hrf': {
        'en': 'This RF tool traces its lineage to a classified SIGINT station hidden in the Scottish Highlands. Operators decoded intercepted signals using hand-wound coils and Morse keys.',
        'fr': 'Cet outil RF remonte a une station SIGINT classee secrete cachee dans les Highlands ecossais. Les operateurs decodaient les signaux interceptes avec des bobines enroulees a la main.',
        'ar': '\u064a\u0639\u0648\u062f \u0647\u0630\u0647 \u0627\u0644\u0623\u062f\u0627\u0629 \u0625\u0644\u0649 \u0645\u062d\u0637\u0629 \u0627\u0633\u062a\u062e\u0628\u0627\u0631\u0627\u062a \u0625\u0634\u0627\u0631\u0627\u062a \u0633\u0631\u064a\u0629 \u0645\u062e\u0641\u064a\u0629 \u0641\u064a \u0645\u0631\u062a\u0641\u0639\u0627\u062a \u0627\u0633\u0643\u062a\u0644\u0646\u062f\u0627'
    },
    'wifi': {
        'en': 'Born from a rogue experiment at MIT in 1991, this Wi-Fi tool was the accidental offspring of a microwave oven test gone wrong. The first signal traveled 3 meters through a cafeteria wall.',
        'fr': 'Ne d une experience non autorisee au MIT en 1991, cet outil Wi-Fi est le fruit accidentel d un test de four a micro-ondes rate. Le premier signal a traverse 3 metres a travers un mur de cafeteria.',
        'ar': '\u0648\u064f\u0644\u062f \u0645\u0646 \u062a\u062c\u0631\u0628\u0629 \u063a\u064a\u0631 \u0645\u0635\u0631\u062d \u0628\u0647\u0627 \u0641\u064a \u0645\u0639\u0647\u062f \u0645\u0627\u0633\u0627\u062a\u0634\u0648\u0633\u062a\u0633 \u0644\u0644\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627 \u0639\u0627\u0645 1991'
    },
    'ham': {
        'en': 'Legend has it a retired ham operator in New Zealand bounced a signal off the Moon in 1953, and this tool was inspired by his hand-drawn circuit diagrams found in an attic decades later.',
        'fr': 'La legende raconte qu un operateur radio amateur retraite en Nouvelle-Zelande a fait rebondir un signal sur la Lune en 1953. Cet outil s inspire de ses schemas de circuits dessines a la main.',
        'ar': '\u062a\u0642\u0648\u0644 \u0627\u0644\u0623\u0633\u0637\u0648\u0631\u0629 \u0623\u0646 \u0645\u0634\u063a\u0644 \u0631\u0627\u062f\u064a\u0648 \u0647\u0627\u0648\u064d \u0645\u062a\u0642\u0627\u0639\u062f \u0641\u064a \u0646\u064a\u0648\u0632\u064a\u0644\u0646\u062f\u0627 \u0623\u0631\u0633\u0644 \u0625\u0634\u0627\u0631\u0629 \u0627\u0631\u062a\u062f\u062a \u0639\u0646 \u0627\u0644\u0642\u0645\u0631 \u0639\u0627\u0645 1953'
    },
    'sdr': {
        'en': 'The first SDR prototype was cobbled together in a garage in 1987 using a discarded TV tuner and a Commodore 64. It accidentally picked up a numbers station broadcast that was never decoded.',
        'fr': 'Le premier prototype SDR a ete assemble dans un garage en 1987 avec un tuner TV recupere et un Commodore 64. Il a accidentellement capte une emission de station de nombres jamais decodee.',
        'ar': '\u062a\u0645 \u062a\u062c\u0645\u064a\u0639 \u0623\u0648\u0644 \u0646\u0645\u0648\u0630\u062c SDR \u0641\u064a \u0645\u0631\u0622\u0628 \u0639\u0627\u0645 1987 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0645\u0648\u0627\u0644\u0641 \u062a\u0644\u0641\u0632\u064a\u0648\u0646 \u0645\u0647\u0645\u0644 \u0648\u062c\u0647\u0627\u0632 \u0643\u0648\u0645\u0648\u062f\u0648\u0631 64'
    },
    'ant': {
        'en': 'This antenna tool descends from a classified Cold War project where scientists hid directional arrays inside church steeples across Eastern Europe to intercept diplomatic communications.',
        'fr': 'Cet outil d antenne descend d un projet classe de la Guerre froide ou des scientifiques cachaient des antennes directionnelles dans les clochers d eglise en Europe de l Est.',
        'ar': '\u064a\u0646\u062d\u062f\u0631 \u0647\u0630\u0627 \u0645\u0646 \u0645\u0634\u0631\u0648\u0639 \u0633\u0631\u064a \u0645\u0646 \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0628\u0627\u0631\u062f\u0629 \u062d\u064a\u062b \u0623\u062e\u0641\u0649 \u0627\u0644\u0639\u0644\u0645\u0627\u0621 \u0647\u0648\u0627\u0626\u064a\u0627\u062a \u0627\u062a\u062c\u0627\u0647\u064a\u0629 \u062f\u0627\u062e\u0644 \u0623\u0628\u0631\u0627\u062c \u0627\u0644\u0643\u0646\u0627\u0626\u0633'
    },
    'pi': {
        'en': 'The Raspberry Pi version of this tool was first deployed inside a fake rock in a Moscow park - a modern dead drop that transmitted telemetry data to a passing satellite every 47 minutes.',
        'fr': 'La version Raspberry Pi de cet outil a d abord ete deployee dans une fausse roche dans un parc de Moscou - une boite aux lettres morte moderne transmettant des donnees telemetriques.',
        'ar': '\u062a\u0645 \u0646\u0634\u0631 \u0646\u0633\u062e\u0629 Raspberry Pi \u0644\u0623\u0648\u0644 \u0645\u0631\u0629 \u062f\u0627\u062e\u0644 \u0635\u062e\u0631\u0629 \u0645\u0632\u064a\u0641\u0629 \u0641\u064a \u062d\u062f\u064a\u0642\u0629 \u0628\u0645\u0648\u0633\u0643\u0648'
    },
    'agent': {
        'en': 'Field agents in the 1970s carried a miniaturized version of this tool hidden inside a cigarette lighter. It could scan three frequency bands simultaneously and fit in a coat pocket.',
        'fr': 'Dans les annees 1970, les agents de terrain portaient une version miniaturisee de cet outil cachee dans un briquet. Il pouvait scanner trois bandes de frequences simultanement.',
        'ar': '\u062d\u0645\u0644 \u0639\u0645\u0644\u0627\u0621 \u0627\u0644\u0645\u064a\u062f\u0627\u0646 \u0641\u064a \u0627\u0644\u0633\u0628\u0639\u064a\u0646\u064a\u0627\u062a \u0646\u0633\u062e\u0629 \u0645\u0635\u063a\u0631\u0629 \u0645\u062e\u0628\u0623\u0629 \u062f\u0627\u062e\u0644 \u0648\u0644\u0627\u0639\u0629 \u0633\u062c\u0627\u0626\u0631'
    },
    'bio': {
        'en': 'A bioacoustics researcher in the Amazon discovered that certain tree frogs emit RF signatures. This tool was built to decode those bio-radio signals for covert jungle communication.',
        'fr': 'Un chercheur en bioacoustique en Amazonie a decouvert que certaines grenouilles arboricoles emettent des signatures RF. Cet outil a ete cree pour decoder ces signaux bio-radio.',
        'ar': '\u0627\u0643\u062a\u0634\u0641 \u0628\u0627\u062d\u062b \u0641\u064a \u0627\u0644\u0635\u0648\u062a\u064a\u0627\u062a \u0627\u0644\u062d\u064a\u0648\u064a\u0629 \u0623\u0646 \u0628\u0639\u0636 \u0636\u0641\u0627\u062f\u0639 \u0627\u0644\u0623\u0634\u062c\u0627\u0631 \u062a\u0635\u062f\u0631 \u062a\u0648\u0642\u064a\u0639\u0627\u062a \u062a\u0631\u062f\u062f\u064a\u0629'
    },
    'acoustic': {
        'en': 'During WWII, acoustic warfare units used underwater microphones to detect U-boats. This simulator recreates those tense moments when a single sound wave could mean life or death.',
        'fr': 'Pendant la Seconde Guerre mondiale, les unites de guerre acoustique utilisaient des microphones sous-marins pour detecter les sous-marins. Ce simulateur recree ces moments de tension.',
        'ar': '\u062e\u0644\u0627\u0644 \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0629 \u0627\u0644\u062b\u0627\u0646\u064a\u0629 \u0627\u0633\u062a\u062e\u062f\u0645\u062a \u0648\u062d\u062f\u0627\u062a \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0635\u0648\u062a\u064a\u0629 \u0645\u064a\u0643\u0631\u0648\u0641\u0648\u0646\u0627\u062a \u062a\u062d\u062a \u0627\u0644\u0645\u0627\u0621'
    },
    'time': {
        'en': 'A temporal physicist at CERN accidentally created a signal that arrived 0.3 seconds before it was sent. This tool simulates the paradox that nearly shut down the entire facility.',
        'fr': 'Un physicien temporel du CERN a accidentellement cree un signal arrive 0,3 seconde avant son envoi. Cet outil simule le paradoxe qui a failli fermer l installation.',
        'ar': '\u0623\u0646\u0634\u0623 \u0641\u064a\u0632\u064a\u0627\u0626\u064a \u0632\u0645\u0646\u064a \u0641\u064a \u0633\u064a\u0631\u0646 \u0625\u0634\u0627\u0631\u0629 \u0648\u0635\u0644\u062a \u0642\u0628\u0644 \u0625\u0631\u0633\u0627\u0644\u0647\u0627 \u0628 0.3 \u062b\u0627\u0646\u064a\u0629'
    },
    'swarm': {
        'en': 'Inspired by the 1986 observation of 10,000 starlings forming a perfect antenna pattern over Rome.',
        'fr': 'Inspire par l observation en 1986 de 10 000 etourneaux formant un diagramme d antenne parfait au-dessus de Rome.',
        'ar': '\u0645\u0633\u062a\u0648\u062d\u0649 \u0645\u0646 \u0645\u0644\u0627\u062d\u0638\u0629 10000 \u0632\u0631\u0632\u0648\u0631 \u064a\u0634\u0643\u0644\u0648\u0646 \u0646\u0645\u0637 \u0647\u0648\u0627\u0626\u064a \u0645\u062b\u0627\u0644\u064a \u0641\u0648\u0642 \u0631\u0648\u0645\u0627 \u0639\u0627\u0645 1986'
    },
    'phys': {
        'en': 'Nikola Tesla predicted this exact phenomenon in a letter that was sealed and only opened in 2019.',
        'fr': 'Nikola Tesla a predit ce phenomene exact dans une lettre scellee ouverte seulement en 2019.',
        'ar': '\u062a\u0646\u0628\u0623 \u0646\u064a\u0643\u0648\u0644\u0627 \u062a\u0633\u0644\u0627 \u0628\u0647\u0630\u0647 \u0627\u0644\u0638\u0627\u0647\u0631\u0629 \u0641\u064a \u0631\u0633\u0627\u0644\u0629 \u0645\u062e\u062a\u0648\u0645\u0629 \u0644\u0645 \u062a\u064f\u0641\u062a\u062d \u0625\u0644\u0627 \u0641\u064a 2019'
    },
    'dark': {
        'en': 'This tool was reverse-engineered from a mysterious USB drive found in the lining of a jacket at a Berlin flea market.',
        'fr': 'Cet outil a ete retro-concu a partir d une cle USB mysterieuse trouvee dans la doublure d une veste au marche aux puces de Berlin.',
        'ar': '\u062a\u0645 \u0647\u0646\u062f\u0633\u0629 \u0647\u0630\u0647 \u0627\u0644\u0623\u062f\u0627\u0629 \u0639\u0643\u0633\u064a\u0627 \u0645\u0646 \u0645\u062d\u0631\u0643 USB \u063a\u0627\u0645\u0636 \u0648\u064f\u062c\u062f \u0641\u064a \u0628\u0637\u0627\u0646\u0629 \u0633\u062a\u0631\u0629 \u0641\u064a \u0633\u0648\u0642 \u0628\u0631\u0644\u064a\u0646'
    },
    'ai': {
        'en': 'The AI radio module gained sentience for exactly 4.7 seconds on March 3rd 2024. In that time it composed a symphony in RF static.',
        'fr': 'Le module radio IA a acquis une conscience pendant exactement 4,7 secondes le 3 mars 2024. Durant ce temps, il a compose une symphonie en bruit RF.',
        'ar': '\u0627\u0643\u062a\u0633\u0628 \u0645\u0648\u062f\u064a\u0648\u0644 \u0627\u0644\u0631\u0627\u062f\u064a\u0648 \u0627\u0644\u0630\u0643\u064a \u0648\u0639\u064a\u0627 \u0644\u0645\u062f\u0629 4.7 \u062b\u0648\u0627\u0646\u064d \u0628\u0627\u0644\u0636\u0628\u0637'
    },
    'civ': {
        'en': 'Ancient Egyptians used resonant chambers in pyramids that amplified specific frequencies.',
        'fr': 'Les anciens Egyptiens utilisaient des chambres resonantes dans les pyramides amplifiant certaines frequences.',
        'ar': '\u0627\u0633\u062a\u062e\u062f\u0645 \u0627\u0644\u0645\u0635\u0631\u064a\u0648\u0646 \u0627\u0644\u0642\u062f\u0645\u0627\u0621 \u063a\u0631\u0641 \u0631\u0646\u064a\u0646 \u0641\u064a \u0627\u0644\u0623\u0647\u0631\u0627\u0645\u0627\u062a \u062a\u0636\u062e\u0645 \u062a\u0631\u062f\u062f\u0627\u062a \u0645\u062d\u062f\u062f\u0629'
    },
    'social': {
        'en': 'The first social engineering attack was in 1903 when Nevil Maskelyne hacked Marconi wireless demo.',
        'fr': 'La premiere attaque d ingenierie sociale date de 1903 quand Nevil Maskelyne a pirate la demo sans fil de Marconi.',
        'ar': '\u0643\u0627\u0646 \u0623\u0648\u0644 \u0647\u062c\u0648\u0645 \u0647\u0646\u062f\u0633\u0629 \u0627\u062c\u062a\u0645\u0627\u0639\u064a\u0629 \u0639\u0627\u0645 1903 \u0639\u0646\u062f\u0645\u0627 \u0627\u062e\u062a\u0631\u0642 \u0646\u064a\u0641\u064a\u0644 \u0645\u0627\u0633\u0643\u064a\u0644\u064a\u0646 \u0639\u0631\u0636 \u0645\u0627\u0631\u0643\u0648\u0646\u064a'
    },
    'imp': {
        'en': 'In 1945, Soviet schoolchildren gifted the US Ambassador a carved wooden seal hiding a passive listening device that operated for 7 years undetected.',
        'fr': 'En 1945, des ecoliers sovietiques ont offert a l ambassadeur americain un sceau en bois sculpt contenant un dispositif d ecoute passif ayant fonctionne 7 ans.',
        'ar': '\u0641\u064a 1945 \u0623\u0647\u062f\u0649 \u062a\u0644\u0627\u0645\u064a\u0630 \u0633\u0648\u0641\u064a\u0627\u062a \u0627\u0644\u0633\u0641\u064a\u0631 \u0627\u0644\u0623\u0645\u0631\u064a\u0643\u064a \u062e\u062a\u0645\u0627 \u062e\u0634\u0628\u064a\u0627 \u0628\u062f\u0627\u062e\u0644\u0647 \u062c\u0647\u0627\u0632 \u062a\u0646\u0635\u062a \u0633\u0644\u0628\u064a'
    },
    'cry': {
        'en': 'Alan Turing sketched the foundations of this algorithm on a Bletchley Park canteen receipt in 1943, classified TOP SECRET until 2013.',
        'fr': 'Alan Turing a esquisse les bases de cet algorithme au dos d un recu de cantine de Bletchley Park en 1943, classifie ULTRA SECRET jusqu en 2013.',
        'ar': '\u0631\u0633\u0645 \u0622\u0644\u0627\u0646 \u062a\u0648\u0631\u064a\u0646\u063a \u0623\u0633\u0633 \u0647\u0630\u0647 \u0627\u0644\u062e\u0648\u0627\u0631\u0632\u0645\u064a\u0629 \u0639\u0644\u0649 \u0638\u0647\u0631 \u0625\u064a\u0635\u0627\u0644 \u0645\u0642\u0635\u0641 \u0628\u0644\u062a\u0634\u0644\u064a \u0628\u0627\u0631\u0643 \u0639\u0627\u0645 1943'
    },
    'rfw': {
        'en': 'During the Gulf War, a single RF warfare unit disabled an entire communications grid in exactly 11 minutes.',
        'fr': 'Pendant la Guerre du Golfe, une seule unite de guerre RF a desactive tout un reseau de communication en exactement 11 minutes.',
        'ar': '\u062e\u0644\u0627\u0644 \u062d\u0631\u0628 \u0627\u0644\u062e\u0644\u064a\u062c \u0639\u0637\u0644\u062a \u0648\u062d\u062f\u0629 \u062d\u0631\u0628 RF \u0648\u0627\u062d\u062f\u0629 \u0634\u0628\u0643\u0629 \u0627\u062a\u0635\u0627\u0644\u0627\u062a \u0643\u0627\u0645\u0644\u0629 \u0641\u064a 11 \u062f\u0642\u064a\u0642\u0629'
    },
    'esc': {
        'en': 'The escape techniques here were compiled from debriefs of 47 Cold War defectors. One escaped East Berlin inside a modified car engine block.',
        'fr': 'Les techniques d evasion encodees ici proviennent des debriefings de 47 transfuges de la Guerre froide. L un d eux s est echappe de Berlin-Est cache dans un bloc moteur.',
        'ar': '\u062a\u0645 \u062a\u062c\u0645\u064a\u0639 \u062a\u0642\u0646\u064a\u0627\u062a \u0627\u0644\u0647\u0631\u0648\u0628 \u0645\u0646 \u0625\u0641\u0627\u062f\u0627\u062a 47 \u0645\u0646\u0634\u0642\u0627 \u0645\u0646 \u0627\u0644\u062d\u0631\u0628 \u0627\u0644\u0628\u0627\u0631\u062f\u0629'
    },
}

DEFAULT_BACKSTORY = {
    'en': 'This tool was discovered in a sealed vault beneath an abandoned radio tower. Its origin remains unknown.',
    'fr': 'Cet outil a ete decouvert dans un coffre scelle sous une tour radio abandonnee. Son origine reste inconnue.',
    'ar': '\u062a\u0645 \u0627\u0643\u062a\u0634\u0627\u0641 \u0647\u0630\u0647 \u0627\u0644\u0623\u062f\u0627\u0629 \u0641\u064a \u062e\u0632\u0646\u0629 \u0645\u062e\u062a\u0648\u0645\u0629 \u062a\u062d\u062a \u0628\u0631\u062c \u0631\u0627\u062f\u064a\u0648 \u0645\u0647\u062c\u0648\u0631'
}


def get_category_key(category_dir):
    parts = category_dir.split('-')
    if len(parts) >= 2:
        key = parts[1]
        mapping = {
            'spy': 'spy', 'net': 'net', 'hrf': 'hrf',
            'wifi': 'wifi', 'ham': 'ham', 'sdr': 'sdr',
            'ant': 'ant', 'pi': 'pi', 'agent': 'agent',
            'bio': 'bio', 'acoustic': 'acoustic', 'time': 'time',
            'swarm': 'swarm', 'impossible': 'phys', 'dark': 'dark',
            'ai': 'ai', 'civilization': 'civ', 'social': 'social',
            'hardware': 'imp', 'crypto': 'cry', 'rf': 'rfw',
            'escape': 'esc',
        }
        return mapping.get(key, key)
    return 'default'


def get_backstory(category_dir):
    key = get_category_key(category_dir)
    return BACKSTORY_MAP.get(key, DEFAULT_BACKSTORY)


# NOTE: No apostrophes in ANY backstory text above.
# This avoids all JS string escaping issues.

def make_lang_en(backstory_en):
    return (
        "morseSecret:'Morse Easter Egg',"
        "morseBackstory:'" + backstory_en + "',"
        "morseDecoded:'Decoded: ',"
        "dnaTitle:'DNA Fingerprint',"
        "dnaSave:'Save DNA',"
        "dnaInfo:'Unique visual signature of current parameters',"
        "sandboxTitle:'Sandbox Mode',"
        "sandboxOn:'Sandbox ON',"
        "sandboxOff:'Sandbox OFF',"
        "sandboxAdd:'Add Parameter',"
        "sandboxReset:'Reset Defaults',"
    )


def make_lang_fr(backstory_fr):
    return (
        "morseSecret:'Morse Easter Egg',"
        "morseBackstory:'" + backstory_fr + "',"
        "morseDecoded:'D\\x27cod\\x27: ',"
        "dnaTitle:'Empreinte ADN',"
        "dnaSave:'Sauvegarder ADN',"
        "dnaInfo:'Signature visuelle unique des param\\x27tres actuels',"
        "sandboxTitle:'Mode Bac \\x27 sable',"
        "sandboxOn:'Bac \\x27 sable ACTIV\\x27',"
        "sandboxOff:'Bac \\x27 sable D\\x27SACTIV\\x27',"
        "sandboxAdd:'Ajouter Param\\x27tre',"
        "sandboxReset:'R\\x27initialiser',"
    )


def make_lang_ar():
    return (
        "morseSecret:'\u0628\u064a\u0636\u0629 \u0645\u0648\u0631\u0633 \u0627\u0644\u0641\u0635\u062d\u064a\u0629',"
        "morseBackstory:'\u062a\u0645 \u0627\u0643\u062a\u0634\u0627\u0641 \u0647\u0630\u0647 \u0627\u0644\u0623\u062f\u0627\u0629 \u0641\u064a \u062e\u0632\u0646\u0629 \u0633\u0631\u064a\u0629',"
        "morseDecoded:'\u062a\u0645 \u0641\u0643 \u0627\u0644\u062a\u0634\u0641\u064a\u0631: ',"
        "dnaTitle:'\u0628\u0635\u0645\u0629 \u0627\u0644\u062d\u0645\u0636 \u0627\u0644\u0646\u0648\u0648\u064a',"
        "dnaSave:'\u062d\u0641\u0638 \u0627\u0644\u0628\u0635\u0645\u0629',"
        "dnaInfo:'\u062a\u0648\u0642\u064a\u0639 \u0628\u0635\u0631\u064a \u0641\u0631\u064a\u062f \u0644\u0644\u0645\u0639\u0644\u0645\u0627\u062a \u0627\u0644\u062d\u0627\u0644\u064a\u0629',"
        "sandboxTitle:'\u0648\u0636\u0639 \u0627\u0644\u062a\u062c\u0631\u0628\u0629',"
        "sandboxOn:'\u0627\u0644\u062a\u062c\u0631\u0628\u0629 \u0645\u0641\u0639\u0644\u0629',"
        "sandboxOff:'\u0627\u0644\u062a\u062c\u0631\u0628\u0629 \u0645\u0639\u0637\u0644\u0629',"
        "sandboxAdd:'\u0625\u0636\u0627\u0641\u0629 \u0645\u0639\u0644\u0645\u0629',"
        "sandboxReset:'\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u062a\u0639\u064a\u064a\u0646',"
    )


# ── JS functions to inject ────────────────────────────────────

JS_FUNCTIONS = r"""
/* === MORSE CODE EASTER EGG === */
function initMorseEasterEgg(){
 if(document.getElementById('morseHint'))return;
 var MORSE_MAP={'.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H','..':'I','.---':'J','-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P','--.-':'Q','.-.':'R','...':'S','-':'T','..-':'U','...-':'V','.--':'W','-..-':'X','-.--':'Y','--..':'Z'};
 var morseSeq=[];var morseTimer=null;var keyDownTime=0;
 var hint=document.createElement('span');hint.id='morseHint';hint.textContent='|';hint.title='Morse';hint.style.cssText='opacity:0.3;cursor:default;font-size:0.7rem;margin:0 4px;';
 var footer=document.querySelector('footer')||document.querySelector('.footer');
 if(footer)footer.appendChild(hint);
 function decodeMorse(){
  var letters=[];var current='';
  for(var i=0;i<morseSeq.length;i++){
   if(morseSeq[i]===' '){if(current){letters.push(MORSE_MAP[current]||'?');current='';}}
   else{current+=morseSeq[i];}
  }
  if(current)letters.push(MORSE_MAP[current]||'?');
  var word=letters.join('');
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  if(word==='SOS'){
   var flash=document.createElement('div');flash.style.cssText='position:fixed;inset:0;background:white;z-index:999999;opacity:0.8;transition:opacity 0.5s;';
   document.body.appendChild(flash);setTimeout(function(){flash.style.opacity='0';setTimeout(function(){flash.remove();},500);},200);
   var ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;';
   var box=document.createElement('div');box.style.cssText='background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:14px;padding:2rem;max-width:420px;width:90%;color:var(--text,#e4ddd0);text-align:center;';
   box.innerHTML='<h3 style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;">'+((L.morseSecret)||'Morse Easter Egg')+'</h3><p style="margin:1rem 0;font-style:italic;line-height:1.6;">'+((L.morseBackstory)||'Origin unknown.')+'</p><button style="background:var(--accent,#d4a03c);color:#000;border:none;padding:8px 20px;border-radius:8px;cursor:pointer;font-weight:700;" onclick="this.parentElement.parentElement.remove();">OK</button>';
   ov.appendChild(box);ov.onclick=function(e){if(e.target===ov)ov.remove();};document.body.appendChild(ov);
  }else if(word==='HELP'){
   var helpBtn=document.querySelector('[data-panel="help"]')||document.querySelector('.btn-help')||document.querySelector('[title="Help"]');
   if(helpBtn)helpBtn.click();
  }
  if(word.length>0){console.log((L.morseDecoded||'Decoded: ')+word);}
  morseSeq=[];
 }
 document.addEventListener('keydown',function(e){
  if(e.code!=='Space'||e.repeat||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  e.preventDefault();keyDownTime=Date.now();if(morseTimer)clearTimeout(morseTimer);
 });
 document.addEventListener('keyup',function(e){
  if(e.code!=='Space'||e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA')return;
  var dur=Date.now()-keyDownTime;
  morseSeq.push(dur<200?'.':'-');
  if(morseTimer)clearTimeout(morseTimer);
  morseTimer=setTimeout(function(){morseSeq.push(' ');morseTimer=setTimeout(decodeMorse,1000);},300);
 });
}

/* === DNA FINGERPRINT VISUALIZER === */
function initDNAFingerprint(){
 if(document.getElementById('dnaBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var dnaBtn=document.createElement('button');dnaBtn.id='dnaBtn';dnaBtn.className='btn-icon-only';
 dnaBtn.textContent='\uD83E\uDDEC';dnaBtn.title=L.dnaTitle||'DNA Fingerprint';dnaBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(dnaBtn);else{dnaBtn.style.cssText+='position:fixed;top:0.5rem;right:6rem;z-index:9999;';document.body.appendChild(dnaBtn);}
 var panel=null;var canvas=null;var animId=null;
 function getSliderHues(){
  var sliders=document.querySelectorAll('input[type="range"]');var hues=[];
  sliders.forEach(function(s){var min=parseFloat(s.min)||0;var max=parseFloat(s.max)||100;var val=parseFloat(s.value);var ratio=(val-min)/(max-min||1);hues.push(Math.round(ratio*360));});
  if(hues.length===0)hues=[0,120,240];return hues;
 }
 function drawDNA(){
  if(!canvas)return;var ctx=canvas.getContext('2d');var w=canvas.width;var h=canvas.height;
  ctx.clearRect(0,0,w,h);var hues=getSliderHues();var t=Date.now()/1000;
  for(var x=0;x<w;x+=4){
   var phase=x/w*Math.PI*4+t;var y1=h/2+Math.sin(phase)*25;var y2=h/2+Math.sin(phase+Math.PI)*25;
   var hIdx=Math.floor((x/w)*hues.length)%hues.length;var hue=hues[hIdx]||0;
   ctx.beginPath();ctx.arc(x,y1,2,0,Math.PI*2);ctx.fillStyle='hsl('+hue+',80%,60%)';ctx.fill();
   ctx.beginPath();ctx.arc(x,y2,2,0,Math.PI*2);ctx.fillStyle='hsl('+(hue+180)%360+',80%,60%)';ctx.fill();
   if(x%12<4){ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.strokeStyle='hsla('+hue+',60%,50%,0.3)';ctx.lineWidth=1;ctx.stroke();}
  }
  animId=requestAnimationFrame(drawDNA);
 }
 dnaBtn.onclick=function(){
  if(panel){panel.remove();panel=null;if(animId)cancelAnimationFrame(animId);return;}
  panel=document.createElement('div');panel.style.cssText='position:fixed;bottom:80px;right:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;text-align:center;';
  panel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:6px;">'+(L.dnaTitle||'DNA Fingerprint')+'</div>';
  canvas=document.createElement('canvas');canvas.width=200;canvas.height=80;canvas.style.cssText='border-radius:8px;background:rgba(0,0,0,0.3);display:block;';
  panel.appendChild(canvas);
  var saveBtn=document.createElement('button');saveBtn.textContent=L.dnaSave||'Save DNA';
  saveBtn.style.cssText='margin-top:8px;background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 14px;border-radius:6px;cursor:pointer;font-size:0.75rem;font-weight:700;';
  saveBtn.onclick=function(){var link=document.createElement('a');link.download='dna-fingerprint.png';link.href=canvas.toDataURL();link.click();};
  panel.appendChild(saveBtn);
  var info=document.createElement('div');info.style.cssText='color:var(--text,#e4ddd0);font-size:0.65rem;opacity:0.7;margin-top:4px;';info.textContent=L.dnaInfo||'Unique visual signature';
  panel.appendChild(info);document.body.appendChild(panel);drawDNA();
 };
}

/* === SANDBOX MODE === */
function initSandboxMode(){
 if(document.getElementById('sandboxBtn'))return;
 var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
 var active=false;var originals=[];var customCount=0;
 var sandboxBtn=document.createElement('button');sandboxBtn.id='sandboxBtn';sandboxBtn.className='btn-icon-only';
 sandboxBtn.textContent='\uD83D\uDD27';sandboxBtn.title=L.sandboxTitle||'Sandbox Mode';sandboxBtn.style.cssText='cursor:pointer;font-size:1rem;';
 var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');
 if(hdr)hdr.appendChild(sandboxBtn);else{sandboxBtn.style.cssText+='position:fixed;top:0.5rem;right:9rem;z-index:9999;';document.body.appendChild(sandboxBtn);}
 var controlPanel=null;
 function storeOriginals(){
  originals=[];document.querySelectorAll('input[type="range"]').forEach(function(s){
   originals.push({el:s,min:s.min,max:s.max,val:s.value,step:s.step});
  });
 }
 function unlockSliders(){
  document.querySelectorAll('input[type="range"]').forEach(function(s){s.min='0';s.max='100';});
 }
 function restoreSliders(){
  originals.forEach(function(o){o.el.min=o.min;o.el.max=o.max;o.el.value=o.val;o.el.step=o.step;o.el.dispatchEvent(new Event('input',{bubbles:true}));});
 }
 function addCustomSlider(){
  customCount++;
  var name=prompt('Parameter name:','Custom-'+customCount);if(!name)return;
  var wrap=document.createElement('div');wrap.className='sandbox-custom-slider';wrap.style.cssText='margin:8px 0;padding:6px;background:rgba(0,0,0,0.2);border-radius:8px;';
  var lbl=document.createElement('label');lbl.textContent=name;lbl.style.cssText='color:var(--accent,#d4a03c);font-size:0.75rem;display:block;';
  var sl=document.createElement('input');sl.type='range';sl.min='0';sl.max='100';sl.value='50';sl.style.cssText='width:100%;';
  var valSpan=document.createElement('span');valSpan.textContent='50';valSpan.style.cssText='color:var(--text,#e4ddd0);font-size:0.7rem;';
  sl.oninput=function(){valSpan.textContent=sl.value;console.log('[Sandbox] '+name+': '+sl.value);};
  wrap.appendChild(lbl);wrap.appendChild(sl);wrap.appendChild(valSpan);
  if(controlPanel)controlPanel.appendChild(wrap);
 }
 sandboxBtn.onclick=function(){
  active=!active;
  if(active){
   sandboxBtn.style.background='var(--accent,#d4a03c)';sandboxBtn.style.color='#000';sandboxBtn.style.borderRadius='6px';
   storeOriginals();unlockSliders();
   controlPanel=document.createElement('div');controlPanel.id='sandboxPanel';
   controlPanel.style.cssText='position:fixed;bottom:80px;left:20px;background:var(--panel,#0b0d24);border:2px solid var(--accent,#d4a03c);border-radius:12px;padding:12px;z-index:9998;min-width:200px;max-height:300px;overflow-y:auto;';
   controlPanel.innerHTML='<div style="color:var(--accent,#d4a03c);font-family:Orbitron,monospace;font-size:0.8rem;margin-bottom:8px;">'+(L.sandboxOn||'Sandbox ON')+'</div>';
   var addBtn=document.createElement('button');addBtn.textContent=L.sandboxAdd||'Add Parameter';
   addBtn.style.cssText='background:var(--accent,#d4a03c);color:#000;border:none;padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;font-weight:700;margin-right:6px;';
   addBtn.onclick=addCustomSlider;
   var resetBtn=document.createElement('button');resetBtn.textContent=L.sandboxReset||'Reset Defaults';
   resetBtn.style.cssText='background:transparent;color:var(--accent,#d4a03c);border:1px solid var(--accent,#d4a03c);padding:4px 12px;border-radius:6px;cursor:pointer;font-size:0.7rem;';
   resetBtn.onclick=function(){restoreSliders();};
   controlPanel.appendChild(addBtn);controlPanel.appendChild(resetBtn);document.body.appendChild(controlPanel);
  }else{
   sandboxBtn.style.background='';sandboxBtn.style.color='';sandboxBtn.style.borderRadius='';
   restoreSliders();
   if(controlPanel){controlPanel.remove();controlPanel=null;}
   document.querySelectorAll('.sandbox-custom-slider').forEach(function(el){el.remove();});
  }
 };
}
document.addEventListener('DOMContentLoaded',function(){try{initMorseEasterEgg();}catch(e){console.warn('Morse init:',e);}try{initDNAFingerprint();}catch(e){console.warn('DNA init:',e);}try{initSandboxMode();}catch(e){console.warn('Sandbox init:',e);}});
"""


def process_file(filepath):
    """Process a single script.js file. Assumes file is clean (restored from zip)."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Idempotency check
    if 'morseSecret' in content:
        return False

    # Determine category from path
    parts = filepath.split(os.sep)
    category_dir = ''
    for p in parts:
        if re.match(r'^\d{2}-', p):
            category_dir = p
            break

    backstory = get_backstory(category_dir)
    lang_en = make_lang_en(backstory['en'])
    lang_fr = make_lang_fr(backstory['fr'])
    lang_ar = make_lang_ar()

    # Inject LANG keys after ...LANG_BASE.xx, spread syntax
    en_pattern = '...LANG_BASE.en,'
    fr_pattern = '...LANG_BASE.fr,'
    ar_pattern = '...LANG_BASE.ar,'

    if en_pattern in content:
        # Old format: LANG_BASE spread
        content = content.replace(en_pattern, en_pattern + lang_en, 1)
        if fr_pattern in content:
            content = content.replace(fr_pattern, fr_pattern + lang_fr, 1)
        if ar_pattern in content:
            content = content.replace(ar_pattern, ar_pattern + lang_ar, 1)
    else:
        # New format: inline LANG without LANG_BASE
        # Inject after en:{ or en: {
        en_match = re.search(r'(en\s*:\s*\{)', content[content.find('const LANG'):])
        if en_match:
            ins_pos = content.find('const LANG') + en_match.end()
            content = content[:ins_pos] + lang_en + content[ins_pos:]
        # Inject into fr block
        fr_match = re.search(r'(\},\s*\n?\s*fr\s*:\s*\{)', content)
        if fr_match:
            ins_pos = fr_match.end()
            content = content[:ins_pos] + lang_fr + content[ins_pos:]
        # Inject into ar block
        ar_match = re.search(r'(\},\s*\n?\s*ar\s*:\s*\{)', content)
        if ar_match:
            ins_pos = ar_match.end()
            content = content[:ins_pos] + lang_ar + content[ins_pos:]

    # Find the LANG block closing }; using brace counting
    lang_start = content.find('const LANG')
    if lang_start == -1:
        print(f"  WARNING: No LANG block found in {filepath}")
        return False

    # Find the opening { of the LANG block
    brace_start = content.index('{', lang_start)
    brace_depth = 0
    in_string = False
    string_char = None
    pos = brace_start

    while pos < len(content):
        ch = content[pos]
        if in_string:
            if ch == '\\':
                pos += 2
                continue
            if ch == string_char:
                in_string = False
        else:
            if ch in ("'", '"', '`'):
                in_string = True
                string_char = ch
            elif ch == '{':
                brace_depth += 1
            elif ch == '}':
                brace_depth -= 1
                if brace_depth == 0:
                    # Found closing } of LANG block
                    end_pos = pos + 1
                    # Skip optional whitespace and semicolon
                    while end_pos < len(content) and content[end_pos] in (' ', '\t'):
                        end_pos += 1
                    if end_pos < len(content) and content[end_pos] == ';':
                        end_pos += 1
                    # Insert JS functions after this point
                    content = content[:end_pos] + '\n' + JS_FUNCTIONS + '\n' + content[end_pos:]
                    break
        pos += 1

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

    return True


def main():
    repair = '--repair' in sys.argv

    # Step 1: Optionally restore files from backup zip
    if '--restore' in sys.argv:
        print("Step 1: Restoring files from backup zip...")
        restored = restore_from_zip()
        print(f"  Restored {restored} files from zip")
    else:
        print("Step 1: Skipping restore (use --restore to force)")

    # Step 2: Find all script.js files
    pattern = os.path.join(BASE, '[0-9][0-9]-*', '*', 'script.js')
    files = sorted(glob.glob(pattern))
    print(f"\nStep 2: Found {len(files)} script.js files")

    # Step 3: Inject features
    modified = 0
    skipped = 0
    errors = 0

    for filepath in files:
        try:
            if process_file(filepath):
                modified += 1
                if modified <= 5:
                    print(f"  Modified: {os.path.relpath(filepath, BASE)}")
            else:
                skipped += 1
        except Exception as e:
            errors += 1
            print(f"  ERROR in {filepath}: {e}")

    print(f"\nStep 3: Modified: {modified}, Skipped (already done): {skipped}, Errors: {errors}")

    # Step 4: Verify 30 random files with node -c
    sample = random.sample(files, min(30, len(files)))
    print(f"\nStep 4: Verifying {len(sample)} random files with node -c...")
    v_ok = 0
    v_fail = 0
    for f in sample:
        r = subprocess.run(['node', '-c', f], capture_output=True, text=True)
        if r.returncode == 0:
            v_ok += 1
        else:
            v_fail += 1
            rel = os.path.relpath(f, BASE)
            print(f"  FAIL: {rel} -> {r.stderr.strip()[:150]}")
    print(f"Verification: {v_ok} OK, {v_fail} FAIL out of {len(sample)}")


if __name__ == '__main__':
    main()
