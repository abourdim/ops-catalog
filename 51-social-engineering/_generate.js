#!/usr/bin/env node
/**
 * Generator for remaining SE apps - Workshop DIY framework
 * Run: node _generate.js
 */
const fs = require('fs');
const path = require('path');

const BASE = __dirname;

const APPS = [
  { dir:'se-influence-ops-dashboard', title:'Influence Ops Dashboard', titleFr:'Tableau des Op\u00e9rations d\'Influence', titleAr:'\u0644\u0648\u062d\u0629 \u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u062a\u0623\u062b\u064a\u0631', subtitle:'Monitor and analyze disinformation campaigns', subtitleFr:'Surveiller les campagnes de d\u00e9sinformation', subtitleAr:'\u0645\u0631\u0627\u0642\u0628\u0629 \u062d\u0645\u0644\u0627\u062a \u0627\u0644\u062a\u0636\u0644\u064a\u0644', icon:'\u{1F30D}',
    secA:'Network Graph', secAFr:'Graphe R\u00e9seau', secAAr:'\u0631\u0633\u0645 \u0627\u0644\u0634\u0628\u0643\u0629',
    secB:'Bot Detection', secBFr:'D\u00e9tection de Bots', secBAr:'\u0643\u0634\u0641 \u0627\u0644\u0628\u0648\u062a\u0627\u062a',
    secC:'Campaign Intel', secCFr:'Renseignement', secCAr:'\u0627\u0633\u062a\u062e\u0628\u0627\u0631\u0627\u062a',
    btn1:'Scan Network', btn1Fr:'Scanner', btn1Ar:'\u0645\u0633\u062d', btn2:'Detect Bots', btn2Fr:'D\u00e9tecter', btn2Ar:'\u0643\u0634\u0641',
    faq1:'What are influence operations?', faq1a:'Coordinated campaigns to manipulate public opinion using social media bots and fake accounts.',
    faq1Fr:'Que sont les op\u00e9rations d\'influence?', faq1aFr:'Campagnes coordonn\u00e9es pour manipuler l\'opinion publique.',
    faq1Ar:'\u0645\u0627 \u0647\u064a \u0639\u0645\u0644\u064a\u0627\u062a \u0627\u0644\u062a\u0623\u062b\u064a\u0631\u061f', faq1aAr:'\u062d\u0645\u0644\u0627\u062a \u0645\u0646\u0633\u0642\u0629 \u0644\u0644\u062a\u0644\u0627\u0639\u0628 \u0628\u0627\u0644\u0631\u0623\u064a \u0627\u0644\u0639\u0627\u0645.',
    simType:'network' },
  { dir:'se-osint-profile-aggregator', title:'OSINT Profile Aggregator', titleFr:'Agr\u00e9gateur de Profils OSINT', titleAr:'\u0645\u062c\u0645\u0639 \u0645\u0644\u0641\u0627\u062a OSINT', subtitle:'Aggregate public data into intelligence profiles', subtitleFr:'Agr\u00e9ger les donn\u00e9es publiques', subtitleAr:'\u062a\u062c\u0645\u064a\u0639 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0639\u0627\u0645\u0629', icon:'\u{1F50D}',
    secA:'Data Sources', secAFr:'Sources de Donn\u00e9es', secAAr:'\u0645\u0635\u0627\u062f\u0631 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a',
    secB:'Profile Builder', secBFr:'Constructeur de Profil', secBAr:'\u0628\u0627\u0646\u064a \u0627\u0644\u0645\u0644\u0641\u0627\u062a',
    secC:'Intelligence Report', secCFr:'Rapport', secCAr:'\u0627\u0644\u062a\u0642\u0631\u064a\u0631',
    btn1:'Scan Sources', btn1Fr:'Scanner', btn1Ar:'\u0645\u0633\u062d', btn2:'Build Profile', btn2Fr:'Construire', btn2Ar:'\u0628\u0646\u0627\u0621',
    faq1:'What is OSINT?', faq1a:'Open Source Intelligence: gathering information from publicly available sources.',
    faq1Fr:'Qu\'est-ce que l\'OSINT?', faq1aFr:'Renseignement en sources ouvertes.',
    faq1Ar:'\u0645\u0627 \u0647\u0648 OSINT\u061f', faq1aAr:'\u0627\u0633\u062a\u062e\u0628\u0627\u0631\u0627\u062a \u0627\u0644\u0645\u0635\u0627\u062f\u0631 \u0627\u0644\u0645\u0641\u062a\u0648\u062d\u0629.',
    simType:'radar' },
  { dir:'se-vishing-call-simulator', title:'Vishing Call Simulator', titleFr:'Simulateur d\'Appels Vishing', titleAr:'\u0645\u062d\u0627\u0643\u064a \u0645\u0643\u0627\u0644\u0645\u0627\u062a \u0627\u0644\u0627\u062d\u062a\u064a\u0627\u0644', subtitle:'Simulate voice phishing calls for training', subtitleFr:'Simuler des appels de phishing vocal', subtitleAr:'\u0645\u062d\u0627\u0643\u0627\u0629 \u0645\u0643\u0627\u0644\u0645\u0627\u062a \u0627\u0644\u062a\u0635\u064a\u062f \u0627\u0644\u0635\u0648\u062a\u064a', icon:'\u{1F4DE}',
    secA:'Call Visualization', secAFr:'Visualisation d\'Appel', secAAr:'\u062a\u0635\u0648\u0631 \u0627\u0644\u0645\u0643\u0627\u0644\u0645\u0629',
    secB:'Script Analysis', secBFr:'Analyse du Script', secBAr:'\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0646\u0635',
    secC:'Call Log', secCFr:'Journal des Appels', secCAr:'\u0633\u062c\u0644 \u0627\u0644\u0645\u0643\u0627\u0644\u0645\u0627\u062a',
    btn1:'Start Call', btn1Fr:'D\u00e9marrer', btn1Ar:'\u0628\u062f\u0621', btn2:'Analyze', btn2Fr:'Analyser', btn2Ar:'\u062a\u062d\u0644\u064a\u0644',
    faq1:'What is vishing?', faq1a:'Voice phishing: using phone calls to trick victims into revealing information.',
    faq1Fr:'Qu\'est-ce que le vishing?', faq1aFr:'Phishing vocal par t\u00e9l\u00e9phone.',
    faq1Ar:'\u0645\u0627 \u0647\u0648 \u0627\u0644\u0641\u064a\u0634\u0646\u062c\u061f', faq1aAr:'\u0627\u0644\u062a\u0635\u064a\u062f \u0627\u0644\u0635\u0648\u062a\u064a \u0639\u0628\u0631 \u0627\u0644\u0647\u0627\u062a\u0641.',
    simType:'wave' },
  { dir:'se-baiting-trap-designer', title:'Baiting Trap Designer', titleFr:'Concepteur de Pi\u00e8ges Baiting', titleAr:'\u0645\u0635\u0645\u0645 \u0641\u062e\u0627\u062e \u0627\u0644\u0625\u063a\u0631\u0627\u0621', subtitle:'Design and analyze USB drop & bait attacks', subtitleFr:'Concevoir des attaques par cl\u00e9 USB', subtitleAr:'\u062a\u0635\u0645\u064a\u0645 \u0647\u062c\u0645\u0627\u062a \u0627\u0644\u0625\u063a\u0631\u0627\u0621', icon:'\u{1F4BE}',
    secA:'Trap Layout', secAFr:'Plan du Pi\u00e8ge', secAAr:'\u0645\u062e\u0637\u0637 \u0627\u0644\u0641\u062e',
    secB:'Success Metrics', secBFr:'M\u00e9triques', secBAr:'\u0645\u0642\u0627\u064a\u064a\u0633',
    secC:'Analysis', secCFr:'Analyse', secCAr:'\u062a\u062d\u0644\u064a\u0644',
    btn1:'Deploy Bait', btn1Fr:'D\u00e9ployer', btn1Ar:'\u0646\u0634\u0631', btn2:'Monitor', btn2Fr:'Surveiller', btn2Ar:'\u0645\u0631\u0627\u0642\u0628\u0629',
    faq1:'What is baiting?', faq1a:'Leaving infected USB drives or devices in public areas to exploit curiosity.',
    faq1Fr:'Qu\'est-ce que le baiting?', faq1aFr:'Laisser des cl\u00e9s USB infect\u00e9es dans des lieux publics.',
    faq1Ar:'\u0645\u0627 \u0647\u0648 \u0627\u0644\u0625\u063a\u0631\u0627\u0621\u061f', faq1aAr:'\u062a\u0631\u0643 \u0623\u062c\u0647\u0632\u0629 \u0645\u0635\u0627\u0628\u0629 \u0641\u064a \u0623\u0645\u0627\u0643\u0646 \u0639\u0627\u0645\u0629.',
    simType:'scatter' },
  { dir:'se-tailgating-detector', title:'Tailgating Detector', titleFr:'D\u00e9tecteur de Talonnage', titleAr:'\u0643\u0627\u0634\u0641 \u0627\u0644\u062a\u062a\u0628\u0639', subtitle:'Detect unauthorized physical access attempts', subtitleFr:'D\u00e9tecter les acc\u00e8s physiques non autoris\u00e9s', subtitleAr:'\u0643\u0634\u0641 \u0645\u062d\u0627\u0648\u0644\u0627\u062a \u0627\u0644\u0648\u0635\u0648\u0644 \u063a\u064a\u0631 \u0627\u0644\u0645\u0635\u0631\u062d', icon:'\u{1F6AA}',
    secA:'Access Monitor', secAFr:'Moniteur d\'Acc\u00e8s', secAAr:'\u0645\u0631\u0627\u0642\u0628 \u0627\u0644\u0648\u0635\u0648\u0644',
    secB:'Alert Dashboard', secBFr:'Tableau d\'Alertes', secBAr:'\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u0646\u0628\u064a\u0647\u0627\u062a',
    secC:'Event Log', secCFr:'Journal', secCAr:'\u0627\u0644\u0633\u062c\u0644',
    btn1:'Start Monitor', btn1Fr:'D\u00e9marrer', btn1Ar:'\u0628\u062f\u0621', btn2:'Alert', btn2Fr:'Alerte', btn2Ar:'\u062a\u0646\u0628\u064a\u0647',
    faq1:'What is tailgating?', faq1a:'Following an authorized person through a secure door without proper credentials.',
    faq1Fr:'Qu\'est-ce que le talonnage?', faq1aFr:'Suivre une personne autoris\u00e9e \u00e0 travers une porte s\u00e9curis\u00e9e.',
    faq1Ar:'\u0645\u0627 \u0647\u0648 \u0627\u0644\u062a\u062a\u0628\u0639\u061f', faq1aAr:'\u0645\u062a\u0627\u0628\u0639\u0629 \u0634\u062e\u0635 \u0645\u0635\u0631\u062d \u0639\u0628\u0631 \u0628\u0627\u0628 \u0622\u0645\u0646.',
    simType:'dots' },
  { dir:'se-credential-harvester', title:'Credential Harvester', titleFr:'Collecteur d\'Identifiants', titleAr:'\u062c\u0627\u0645\u0639 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0627\u0639\u062a\u0645\u0627\u062f', subtitle:'Understand how fake login pages steal credentials', subtitleFr:'Comprendre les fausses pages de connexion', subtitleAr:'\u0641\u0647\u0645 \u0635\u0641\u062d\u0627\u062a \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0627\u0644\u0645\u0632\u064a\u0641\u0629', icon:'\u{1F511}',
    secA:'Fake Page Builder', secAFr:'Constructeur de Page', secAAr:'\u0628\u0627\u0646\u064a \u0627\u0644\u0635\u0641\u062d\u0627\u062a',
    secB:'Harvest Monitor', secBFr:'Moniteur', secBAr:'\u0627\u0644\u0645\u0631\u0627\u0642\u0628',
    secC:'Defense Tips', secCFr:'Conseils', secCAr:'\u0646\u0635\u0627\u0626\u062d',
    btn1:'Build Page', btn1Fr:'Construire', btn1Ar:'\u0628\u0646\u0627\u0621', btn2:'Analyze URL', btn2Fr:'Analyser', btn2Ar:'\u062a\u062d\u0644\u064a\u0644',
    faq1:'What is credential harvesting?', faq1a:'Creating fake login pages that capture usernames and passwords.',
    faq1Fr:'Qu\'est-ce que la r\u00e9colte d\'identifiants?', faq1aFr:'Cr\u00e9er de fausses pages de connexion.',
    faq1Ar:'\u0645\u0627 \u0647\u0648 \u062c\u0645\u0639 \u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0627\u0639\u062a\u0645\u0627\u062f\u061f', faq1aAr:'\u0625\u0646\u0634\u0627\u0621 \u0635\u0641\u062d\u0627\u062a \u062a\u0633\u062c\u064a\u0644 \u062f\u062e\u0648\u0644 \u0645\u0632\u064a\u0641\u0629.',
    simType:'matrix' },
  { dir:'se-dumpster-diving-sim', title:'Dumpster Diving Simulator', titleFr:'Simulateur de Fouille de Poubelles', titleAr:'\u0645\u062d\u0627\u0643\u064a \u0627\u0644\u0628\u062d\u062b \u0641\u064a \u0627\u0644\u0646\u0641\u0627\u064a\u0627\u062a', subtitle:'Find sensitive data in discarded materials', subtitleFr:'Trouver des donn\u00e9es sensibles dans les d\u00e9chets', subtitleAr:'\u0627\u0644\u0628\u062d\u062b \u0639\u0646 \u0628\u064a\u0627\u0646\u0627\u062a \u062d\u0633\u0627\u0633\u0629 \u0641\u064a \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062a', icon:'\u{1F5D1}',
    secA:'Dumpster View', secAFr:'Vue Poubelle', secAAr:'\u0639\u0631\u0636 \u0627\u0644\u0646\u0641\u0627\u064a\u0627\u062a',
    secB:'Found Items', secBFr:'Objets Trouv\u00e9s', secBAr:'\u0627\u0644\u0639\u0646\u0627\u0635\u0631',
    secC:'Risk Assessment', secCFr:'\u00c9valuation', secCAr:'\u062a\u0642\u064a\u064a\u0645',
    btn1:'Search', btn1Fr:'Chercher', btn1Ar:'\u0628\u062d\u062b', btn2:'Classify', btn2Fr:'Classer', btn2Ar:'\u062a\u0635\u0646\u064a\u0641',
    faq1:'What is dumpster diving?', faq1a:'Searching through discarded materials to find sensitive information like passwords or documents.',
    faq1Fr:'La fouille de poubelles?', faq1aFr:'Chercher dans les d\u00e9chets pour trouver des informations sensibles.',
    faq1Ar:'\u0645\u0627 \u0647\u0648 \u0627\u0644\u0628\u062d\u062b \u0641\u064a \u0627\u0644\u0646\u0641\u0627\u064a\u0627\u062a\u061f', faq1aAr:'\u0627\u0644\u0628\u062d\u062b \u0641\u064a \u0627\u0644\u0645\u0647\u0645\u0644\u0627\u062a \u0639\u0646 \u0645\u0639\u0644\u0648\u0645\u0627\u062a \u062d\u0633\u0627\u0633\u0629.',
    simType:'scatter' },
  { dir:'se-watering-hole-architect', title:'Watering Hole Architect', titleFr:'Architecte Watering Hole', titleAr:'\u0645\u0647\u0646\u062f\u0633 \u062d\u0641\u0631\u0629 \u0627\u0644\u0645\u064a\u0627\u0647', subtitle:'Design targeted website compromise strategies', subtitleFr:'Concevoir des strat\u00e9gies de compromission web', subtitleAr:'\u062a\u0635\u0645\u064a\u0645 \u0627\u0633\u062a\u0631\u0627\u062a\u064a\u062c\u064a\u0627\u062a \u0627\u062e\u062a\u0631\u0627\u0642 \u0627\u0644\u0645\u0648\u0627\u0642\u0639', icon:'\u{1F578}',
    secA:'Target Map', secAFr:'Carte des Cibles', secAAr:'\u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u0623\u0647\u062f\u0627\u0641',
    secB:'Injection Points', secBFr:'Points d\'Injection', secBAr:'\u0646\u0642\u0627\u0637 \u0627\u0644\u062d\u0642\u0646',
    secC:'Visitor Log', secCFr:'Journal des Visiteurs', secCAr:'\u0633\u062c\u0644 \u0627\u0644\u0632\u0648\u0627\u0631',
    btn1:'Map Sites', btn1Fr:'Cartographier', btn1Ar:'\u0631\u0633\u0645', btn2:'Analyze Traffic', btn2Fr:'Analyser', btn2Ar:'\u062a\u062d\u0644\u064a\u0644',
    faq1:'What is a watering hole attack?', faq1a:'Compromising websites frequently visited by a target group to infect their devices.',
    faq1Fr:'Qu\'est-ce qu\'une attaque watering hole?', faq1aFr:'Compromettre des sites fr\u00e9quent\u00e9s par un groupe cible.',
    faq1Ar:'\u0645\u0627 \u0647\u064a \u0647\u062c\u0645\u0629 \u062d\u0641\u0631\u0629 \u0627\u0644\u0645\u064a\u0627\u0647\u061f', faq1aAr:'\u0627\u062e\u062a\u0631\u0627\u0642 \u0645\u0648\u0627\u0642\u0639 \u064a\u0632\u0648\u0631\u0647\u0627 \u0627\u0644\u0647\u062f\u0641.',
    simType:'network' },
  { dir:'se-shoulder-surfing-lab', title:'Shoulder Surfing Lab', titleFr:'Laboratoire Shoulder Surfing', titleAr:'\u0645\u062e\u062a\u0628\u0631 \u0627\u0644\u062a\u0637\u0641\u0644 \u0627\u0644\u0628\u0635\u0631\u064a', subtitle:'Practice detecting visual eavesdropping threats', subtitleFr:'D\u00e9tecter l\'\u00e9coute visuelle', subtitleAr:'\u0643\u0634\u0641 \u0627\u0644\u062a\u0646\u0635\u062a \u0627\u0644\u0628\u0635\u0631\u064a', icon:'\u{1F440}',
    secA:'Screen Monitor', secAFr:'Moniteur d\'\u00c9cran', secAAr:'\u0645\u0631\u0627\u0642\u0628 \u0627\u0644\u0634\u0627\u0634\u0629',
    secB:'Threat Zones', secBFr:'Zones de Menace', secBAr:'\u0645\u0646\u0627\u0637\u0642 \u0627\u0644\u062a\u0647\u062f\u064a\u062f',
    secC:'Privacy Score', secCFr:'Score de Confidentialit\u00e9', secCAr:'\u062f\u0631\u062c\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629',
    btn1:'Start Watch', btn1Fr:'D\u00e9marrer', btn1Ar:'\u0628\u062f\u0621', btn2:'Check Privacy', btn2Fr:'V\u00e9rifier', btn2Ar:'\u062a\u062d\u0642\u0642',
    faq1:'What is shoulder surfing?', faq1a:'Observing someone\'s screen or keyboard to steal information like PINs or passwords.',
    faq1Fr:'Qu\'est-ce que le shoulder surfing?', faq1aFr:'Observer l\'\u00e9cran de quelqu\'un pour voler des informations.',
    faq1Ar:'\u0645\u0627 \u0647\u0648 \u0627\u0644\u062a\u0637\u0641\u0644 \u0627\u0644\u0628\u0635\u0631\u064a\u061f', faq1aAr:'\u0645\u0631\u0627\u0642\u0628\u0629 \u0634\u0627\u0634\u0629 \u0634\u062e\u0635 \u0644\u0633\u0631\u0642\u0629 \u0645\u0639\u0644\u0648\u0645\u0627\u062a\u0647.',
    simType:'heatmap' },
  { dir:'se-qr-code-poisoner', title:'QR Code Poisoner', titleFr:'Empoisonneur de QR Code', titleAr:'\u0645\u0633\u0645\u0645 \u0631\u0645\u0648\u0632 QR', subtitle:'Analyze malicious QR code attack vectors', subtitleFr:'Analyser les vecteurs d\'attaque QR', subtitleAr:'\u062a\u062d\u0644\u064a\u0644 \u0645\u062a\u062c\u0647\u0627\u062a \u0647\u062c\u0648\u0645 QR', icon:'\u{1F4F1}',
    secA:'QR Generator', secAFr:'G\u00e9n\u00e9rateur QR', secAAr:'\u0645\u0648\u0644\u062f QR',
    secB:'Scan Analysis', secBFr:'Analyse de Scan', secBAr:'\u062a\u062d\u0644\u064a\u0644 \u0627\u0644\u0645\u0633\u062d',
    secC:'Threat Database', secCFr:'Base de Menaces', secCAr:'\u0642\u0627\u0639\u062f\u0629 \u0627\u0644\u062a\u0647\u062f\u064a\u062f\u0627\u062a',
    btn1:'Generate QR', btn1Fr:'G\u00e9n\u00e9rer', btn1Ar:'\u062a\u0648\u0644\u064a\u062f', btn2:'Analyze', btn2Fr:'Analyser', btn2Ar:'\u062a\u062d\u0644\u064a\u0644',
    faq1:'What is QR code poisoning?', faq1a:'Creating malicious QR codes that redirect users to phishing sites or download malware.',
    faq1Fr:'Qu\'est-ce que l\'empoisonnement QR?', faq1aFr:'Cr\u00e9er des QR codes malveillants.',
    faq1Ar:'\u0645\u0627 \u0647\u0648 \u062a\u0633\u0645\u064a\u0645 QR\u061f', faq1aAr:'\u0625\u0646\u0634\u0627\u0621 \u0631\u0645\u0648\u0632 QR \u062e\u0628\u064a\u062b\u0629.',
    simType:'grid' },
  { dir:'se-social-media-recon', title:'Social Media Recon', titleFr:'Reconnaissance R\u00e9seaux Sociaux', titleAr:'\u0627\u0633\u062a\u0637\u0644\u0627\u0639 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0627\u0644\u0627\u062c\u062a\u0645\u0627\u0639\u064a', subtitle:'Analyze social media footprints for security gaps', subtitleFr:'Analyser l\'empreinte des r\u00e9seaux sociaux', subtitleAr:'\u062a\u062d\u0644\u064a\u0644 \u0628\u0635\u0645\u0627\u062a \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0627\u0644\u0627\u062c\u062a\u0645\u0627\u0639\u064a', icon:'\u{1F4F2}',
    secA:'Profile Scan', secAFr:'Scan de Profil', secAAr:'\u0645\u0633\u062d \u0627\u0644\u0645\u0644\u0641',
    secB:'Data Points', secBFr:'Points de Donn\u00e9es', secBAr:'\u0646\u0642\u0627\u0637 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a',
    secC:'Exposure Report', secCFr:'Rapport d\'Exposition', secCAr:'\u062a\u0642\u0631\u064a\u0631 \u0627\u0644\u0643\u0634\u0641',
    btn1:'Scan Profile', btn1Fr:'Scanner', btn1Ar:'\u0645\u0633\u062d', btn2:'Generate Report', btn2Fr:'G\u00e9n\u00e9rer', btn2Ar:'\u062a\u0648\u0644\u064a\u062f',
    faq1:'What is social media recon?', faq1a:'Gathering intelligence about targets from their social media activity and public posts.',
    faq1Fr:'Qu\'est-ce que la reconnaissance sur les r\u00e9seaux sociaux?', faq1aFr:'Collecter des informations depuis les r\u00e9seaux sociaux.',
    faq1Ar:'\u0645\u0627 \u0647\u0648 \u0627\u0633\u062a\u0637\u0644\u0627\u0639 \u0627\u0644\u062a\u0648\u0627\u0635\u0644\u061f', faq1aAr:'\u062c\u0645\u0639 \u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0645\u0646 \u0646\u0634\u0627\u0637 \u0627\u0644\u062a\u0648\u0627\u0635\u0644 \u0627\u0644\u0627\u062c\u062a\u0645\u0627\u0639\u064a.',
    simType:'radar' },
  { dir:'se-impersonation-toolkit', title:'Impersonation Toolkit', titleFr:'Kit d\'Usurpation d\'Identit\u00e9', titleAr:'\u0623\u062f\u0648\u0627\u062a \u0627\u0646\u062a\u062d\u0627\u0644 \u0627\u0644\u0647\u0648\u064a\u0629', subtitle:'Study identity impersonation techniques', subtitleFr:'\u00c9tudier les techniques d\'usurpation', subtitleAr:'\u062f\u0631\u0627\u0633\u0629 \u062a\u0642\u0646\u064a\u0627\u062a \u0627\u0646\u062a\u062d\u0627\u0644 \u0627\u0644\u0647\u0648\u064a\u0629', icon:'\u{1F3AD}',
    secA:'Identity Builder', secAFr:'Constructeur d\'Identit\u00e9', secAAr:'\u0628\u0627\u0646\u064a \u0627\u0644\u0647\u0648\u064a\u0629',
    secB:'Verification Check', secBFr:'V\u00e9rification', secBAr:'\u0641\u062d\u0635 \u0627\u0644\u062a\u062d\u0642\u0642',
    secC:'Detection Tips', secCFr:'Conseils de D\u00e9tection', secCAr:'\u0646\u0635\u0627\u0626\u062d \u0627\u0644\u0643\u0634\u0641',
    btn1:'Build Profile', btn1Fr:'Construire', btn1Ar:'\u0628\u0646\u0627\u0621', btn2:'Verify', btn2Fr:'V\u00e9rifier', btn2Ar:'\u062a\u062d\u0642\u0642',
    faq1:'What is impersonation?', faq1a:'Pretending to be someone else to gain unauthorized access or information.',
    faq1Fr:'Qu\'est-ce que l\'usurpation?', faq1aFr:'Se faire passer pour quelqu\'un d\'autre.',
    faq1Ar:'\u0645\u0627 \u0647\u0648 \u0627\u0646\u062a\u062d\u0627\u0644 \u0627\u0644\u0647\u0648\u064a\u0629\u061f', faq1aAr:'\u0627\u0644\u062a\u0638\u0627\u0647\u0631 \u0628\u0623\u0646\u0643 \u0634\u062e\u0635 \u0622\u062e\u0631 \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0648\u0635\u0648\u0644 \u063a\u064a\u0631 \u0645\u0635\u0631\u062d.',
    simType:'network' }
];

function genHTML(app) {
return `<!doctype html>
<html lang="en" dir="ltr" data-theme="mosque-gold">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${app.title} — Workshop DIY</title>
  <meta name="description" content="${app.title} — ${app.subtitle}" />
  <meta name="author" content="Workshop-DIY — abourdim" />
  <link rel="icon" href="favicon.ico" sizes="any" />
  <link rel="manifest" href="manifest.json" />
  <meta name="theme-color" content="#08091a" />
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Righteous&family=Tajawal:wght@400;500;700&family=Orbitron:wght@500;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="style.css" />
  <style>
    .sim-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0}
    .sim-panel{background:var(--panel);border:1px solid var(--border,rgba(255,255,255,.1));border-radius:10px;padding:12px}
    .sim-panel h4{font-size:.85rem;color:var(--accent);margin:0 0 8px;font-family:var(--font-h)}
    .sim-val{font-family:'Orbitron',monospace;font-size:1.1rem;color:var(--text)}
    .sim-label{font-size:.7rem;color:var(--text-muted)}
    .ctrl-row{display:flex;gap:8px;margin:8px 0;flex-wrap:wrap}
    .ctrl-row select,.ctrl-row input{flex:1;min-width:100px;padding:6px 10px;border-radius:6px;border:1px solid var(--border,rgba(255,255,255,.2));background:var(--panel);color:var(--text);font-size:.85rem}
    .mono-log{font-family:monospace;font-size:.72rem;background:#000;color:#0f0;padding:8px;border-radius:8px;max-height:120px;overflow-y:auto;margin-top:6px;line-height:1.4}
    @media(max-width:600px){.sim-grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <div class="splash" id="splash" onclick="dismissSplash()"><div class="splash-inner"><div class="splash-logo" id="splashLogo"></div><div class="splash-title">Workshop DIY</div><div class="splash-sub" data-i18n="subtitle">${app.subtitle}</div><div class="splash-hint" data-i18n="splashHint">tap to skip</div></div></div>
  <div class="app">
    <div class="deco-band top-band" aria-hidden="true"></div>
    <div class="rows-container">
      <div class="header">
        <div class="bismillah" aria-hidden="true"><span class="bism-ornament">&#x2726;</span> &#1576;&#1616;&#1587;&#1618;&#1605;&#1616; &#1649;&#1604;&#1604;&#1617;&#1614;&#1648;&#1607;&#1616; &#1649;&#1604;&#1585;&#1617;&#1614;&#1581;&#1618;&#1605;&#1614;&#1600;&#1648;&#1606;&#1616; &#1649;&#1604;&#1585;&#1617;&#1614;&#1581;&#1616;&#1610;&#1605;&#1616; <span class="bism-ornament">&#x2726;</span></div>
        <div class="title-block"><div class="logo-wrap" id="logoWrap"></div><div><h1 data-i18n="title">${app.title}</h1><div class="subtitle" data-i18n="subtitle">${app.subtitle}</div></div></div>
        <div class="header-right"><div class="header-buttons"><button id="helpBtn" class="btn-icon-only" aria-label="Help">&#10067;</button><button id="settingsBtn" class="btn-icon-only" aria-label="Settings">&#9881;&#65039;</button><button id="logBtn" class="btn-icon-only" aria-label="Log">&#128220;</button></div><div class="status-pill" id="statusPill"><span class="status-dot" id="statusDot"></span><span id="statusText" data-i18n="disconnected">Disconnected</span></div></div>
      </div>
      <div class="card" id="mainCard"><div class="card-header"><div><div class="card-title"><span class="icon">${app.icon}</span> <span data-i18n="mainSection">${app.title}</span></div><div class="card-subtitle"><span data-i18n="mainDesc">${app.subtitle}</span> <span class="version-tag">v1.0</span></div></div></div></div>

      <details class="collapsible" open>
        <summary><span class="icon">${app.icon}</span> <span data-i18n="sectionA">${app.secA}</span></summary>
        <div class="card">
          <canvas id="simCanvas" width="800" height="250" style="width:100%;height:auto;border-radius:8px;background:#000;display:block"></canvas>
          <div class="ctrl-row">
            <button id="btn1" class="btn-sm primary" style="flex:1"><span data-i18n="btn1">${app.btn1}</span></button>
            <button id="btn2" class="btn-sm" style="flex:1"><span data-i18n="btn2">${app.btn2}</span></button>
          </div>
          <div class="sim-grid">
            <div class="sim-panel"><h4 data-i18n="metric1Label">Threat Level</h4><div class="sim-val" id="metric1Val">0</div><div class="sim-label" data-i18n="metric1Desc">Current assessment</div></div>
            <div class="sim-panel"><h4 data-i18n="metric2Label">Confidence</h4><div class="sim-val" id="metric2Val">0%</div><div class="sim-label" data-i18n="metric2Desc">Analysis confidence</div></div>
          </div>
        </div>
      </details>

      <details class="collapsible">
        <summary><span class="icon">&#128202;</span> <span data-i18n="sectionB">${app.secB}</span></summary>
        <div class="card"><canvas id="analysisCanvas" width="800" height="200" style="width:100%;height:auto;border-radius:8px;background:#000;display:block"></canvas></div>
      </details>

      <details class="collapsible">
        <summary><span class="icon">&#128203;</span> <span data-i18n="sectionC">${app.secC}</span></summary>
        <div class="card"><div class="mono-log" id="intelLog">${app.title} ready. Engine loaded...</div></div>
      </details>
    </div>
    <footer class="app-footer"><span class="footer-text">powered by <a href="https://workshop-diy.org" target="_blank" rel="noopener">workshop-diy.org</a></span><span class="hijri-date" id="hijriDate"></span></footer>
    <div class="deco-band bottom-band" aria-hidden="true"></div>
  </div>
  <canvas id="matrixCanvas" class="matrix-canvas"></canvas>
  <div id="debugPanel" class="debug-panel"><span id="debugFps">0 FPS</span><span id="debugMem">0 MB</span></div>
  <div class="sidebar-overlay" id="helpOverlay"></div>
  <aside class="sidebar sidebar-left" id="helpPanel" aria-label="Help" role="dialog" aria-modal="true"><div class="sidebar-header"><span class="sidebar-title" data-i18n="help">Help</span><button id="helpCloseBtn" class="btn-icon-only" aria-label="Close">&#10005;</button></div><div class="help-tabs"><button class="help-tab active" data-tab="faq" data-i18n="faq">FAQ</button><button class="help-tab" data-tab="howto" data-i18n="howto">How-To</button><button class="help-tab" data-tab="wiki" data-i18n="wiki">Wiki</button></div><div class="sidebar-body"><div class="help-content active" id="helpFaq"><details class="help-item"><summary data-i18n="faq_q1">${app.faq1}</summary><p data-i18n="faq_a1">${app.faq1a}</p></details><details class="help-item"><summary data-i18n="faq_q2">Is this a real attack tool?</summary><p data-i18n="faq_a2">No. This is purely an educational simulator for security awareness training.</p></details></div><div class="help-content" id="helpHowto"><div class="help-step"><span class="help-step-num">1</span><p data-i18n="howto_1">Click the primary action button to start the simulation.</p></div><div class="help-step"><span class="help-step-num">2</span><p data-i18n="howto_2">Observe the canvas visualization of the attack vector.</p></div><div class="help-step"><span class="help-step-num">3</span><p data-i18n="howto_3">Use the secondary button to analyze results.</p></div><div class="help-step"><span class="help-step-num">4</span><p data-i18n="howto_4">Review the intelligence log for detailed findings.</p></div></div><div class="help-content" id="helpWiki"><div class="wiki-entry"><h3 data-i18n="wiki_t1">${app.icon} ${app.title}</h3><p data-i18n="wiki_d1">${app.faq1a}</p></div></div></div><div class="sidebar-footer"><span>Workshop DIY</span><span class="badge"><strong>v1.0</strong></span></div></aside>
  <div class="sidebar-overlay" id="settingsOverlay"></div>
  <aside class="sidebar" id="settingsPanel" aria-label="Settings" role="dialog" aria-modal="true"><div class="sidebar-header"><span class="sidebar-title" data-i18n="settings">Settings</span><button id="settingsCloseBtn" class="btn-icon-only" aria-label="Close">&#10005;</button></div><div class="sidebar-body"><div class="sidebar-group"><label class="sidebar-label" data-i18n="language">Language</label><select id="langSelect" class="sidebar-select"><option value="en" selected>EN</option><option value="fr">FR</option><option value="ar">&#1593;&#1585;&#1576;&#1610;</option></select></div><div class="sidebar-group"><label class="sidebar-label" data-i18n="theme">Theme</label><select id="themeSelect" class="sidebar-select"><option value="mosque-gold">Mosque</option><option value="zellige">Zellige</option><option value="andalus">Andalus</option><option value="riad">Riad</option><option value="medina">Medina</option><option value="space">Space</option><option value="jungle">Jungle</option><option value="robot">Robot</option></select></div><div class="sidebar-group"><label class="toggle-ctrl"><input type="checkbox" id="soundToggle" class="checkbox-ctrl" /><span data-i18n="soundEffects">Sound effects</span></label></div></div><div class="sidebar-footer"><span>Workshop DIY</span><span class="badge"><strong>v1.0</strong></span></div></aside>
  <aside class="sidebar" id="logPanel" aria-label="Activity Log"><div class="resize-handle" id="logResizeHandle"></div><div class="sidebar-header"><span class="sidebar-title" data-i18n="activityLog">Activity Log</span><div class="log-controls"><button id="clearLogBtn" class="btn-sm"><span data-i18n="clear">Clear</span></button><button id="copyLogBtn" class="btn-sm"><span data-i18n="copy">Copy</span></button><button id="exportLogBtn" class="btn-sm"><span data-i18n="export">Export</span></button><button id="logCloseBtn" class="btn-icon-only" aria-label="Close">&#10005;</button></div></div><div class="log-filters" id="logFilters"><button class="log-filter active" data-filter="all" data-i18n="filterAll">All</button><button class="log-filter" data-filter="info">Info</button><button class="log-filter" data-filter="success">&#10003;</button><button class="log-filter" data-filter="error">&#10007;</button></div><div class="sidebar-body log-body"><div class="log" id="logContainer" aria-live="polite"></div></div><div class="sidebar-footer"><span data-i18n="eventsMsg">Events</span><span class="badge"><strong>v1.0</strong></span></div></aside>
  <div id="toastIndicator" class="toast-indicator"><div class="toast-inner"><div class="spinner"></div><div id="toastMessage" class="toast-text">Working...</div></div></div>
  <script src="script.js"></script>
</body>
</html>`;
}

function genCanvasSim(type) {
  const sims = {
    network: `
  const nodes=[];for(let i=0;i<15;i++)nodes.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-0.5)*1.5,vy:(Math.random()-0.5)*1.5,r:3+Math.random()*5});
  function draw(){ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,0,c.width,c.height);
    nodes.forEach((n,i)=>{n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>c.width)n.vx*=-1;if(n.y<0||n.y>c.height)n.vy*=-1;
      nodes.forEach((m,j)=>{if(j<=i)return;const d=Math.hypot(n.x-m.x,n.y-m.y);if(d<120){ctx.strokeStyle=accent;ctx.globalAlpha=1-d/120;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(m.x,m.y);ctx.stroke();ctx.globalAlpha=1;}});
      ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);ctx.fillStyle=i<2?'#f44':accent;ctx.fill();});
    requestAnimationFrame(draw);}draw();`,
    wave: `
  let t=0;function draw(){ctx.fillStyle='rgba(0,0,0,0.08)';ctx.fillRect(0,0,c.width,c.height);
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();
    for(let x=0;x<c.width;x++){const y=c.height/2+Math.sin(x*0.03+t*0.05)*50*Math.sin(x*0.008+t*0.02)+Math.sin(x*0.01+t*0.03)*30;x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);}
    ctx.stroke();t++;requestAnimationFrame(draw);}draw();`,
    radar: `
  let angle=0;function draw(){ctx.fillStyle='rgba(0,0,0,0.03)';ctx.fillRect(0,0,c.width,c.height);
    const cx=c.width/2,cy=c.height/2,r=Math.min(cx,cy)-20;
    ctx.strokeStyle=accent;ctx.lineWidth=1;for(let i=1;i<=4;i++){ctx.beginPath();ctx.arc(cx,cy,r*i/4,0,Math.PI*2);ctx.stroke();}
    ctx.strokeStyle='#0f0';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);ctx.stroke();
    if(Math.random()<0.05){const a=Math.random()*Math.PI*2,d=Math.random()*r;ctx.beginPath();ctx.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,3,0,Math.PI*2);ctx.fillStyle='#0f0';ctx.fill();}
    angle+=0.02;requestAnimationFrame(draw);}draw();`,
    scatter: `
  const pts=[];for(let i=0;i<30;i++)pts.push({x:Math.random()*c.width,y:Math.random()*c.height,r:2+Math.random()*6,pulse:Math.random()*Math.PI*2});
  let t=0;function draw(){ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);
    pts.forEach(p=>{const s=1+Math.sin(t*0.03+p.pulse)*0.5;ctx.beginPath();ctx.arc(p.x,p.y,p.r*s,0,Math.PI*2);ctx.fillStyle=accent;ctx.globalAlpha=0.6+Math.sin(t*0.02+p.pulse)*0.4;ctx.fill();ctx.globalAlpha=1;});
    t++;requestAnimationFrame(draw);}draw();`,
    dots: `
  const dots=[];let t=0;function draw(){ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);
    if(Math.random()<0.1)dots.push({x:Math.random()*c.width,y:c.height,vy:-1-Math.random()*2,life:1,r:2+Math.random()*4});
    for(let i=dots.length-1;i>=0;i--){const d=dots[i];d.y+=d.vy;d.life-=0.005;if(d.life<=0){dots.splice(i,1);continue;}
      ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,Math.PI*2);ctx.fillStyle=accent;ctx.globalAlpha=d.life;ctx.fill();ctx.globalAlpha=1;}
    ctx.fillStyle='#fff';ctx.font='10px Orbitron,monospace';ctx.fillText('ACCESS EVENTS (LIVE)',10,15);
    t++;requestAnimationFrame(draw);}draw();`,
    matrix: `
  const cols=Math.floor(c.width/14);const drops=Array(cols).fill(1);const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
  function draw(){ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=accent;ctx.font='12px monospace';
    for(let i=0;i<drops.length;i++){ctx.fillText(chars[Math.floor(Math.random()*chars.length)],i*14,drops[i]*14);
      if(drops[i]*14>c.height&&Math.random()>0.975)drops[i]=0;drops[i]++;}
    requestAnimationFrame(draw);}draw();`,
    heatmap: `
  let t=0;const zones=[];for(let i=0;i<8;i++)zones.push({x:50+Math.random()*(c.width-100),y:50+Math.random()*(c.height-100),r:30+Math.random()*50,intensity:Math.random()});
  function draw(){ctx.fillStyle='rgba(0,0,0,0.03)';ctx.fillRect(0,0,c.width,c.height);
    zones.forEach(z=>{z.intensity=0.3+Math.sin(t*0.02+z.x)*0.5;const grad=ctx.createRadialGradient(z.x,z.y,0,z.x,z.y,z.r);
      grad.addColorStop(0,'rgba(255,0,0,'+z.intensity+')');grad.addColorStop(1,'rgba(255,0,0,0)');ctx.fillStyle=grad;ctx.fillRect(z.x-z.r,z.y-z.r,z.r*2,z.r*2);});
    ctx.fillStyle='#fff';ctx.font='10px Orbitron,monospace';ctx.fillText('THREAT HEATMAP',10,15);
    t++;requestAnimationFrame(draw);}draw();`,
    grid: `
  let t=0;const gridSize=20;function draw(){ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,c.width,c.height);
    for(let x=0;x<c.width;x+=gridSize)for(let y=0;y<c.height;y+=gridSize){
      const v=Math.sin(x*0.05+t*0.02)*Math.cos(y*0.05+t*0.03);
      ctx.fillStyle=v>0.3?accent:v>0?'rgba(255,255,255,0.1)':'rgba(0,0,0,0)';
      if(v>0)ctx.fillRect(x,y,gridSize-1,gridSize-1);}
    t++;requestAnimationFrame(draw);}draw();`
  };
  return sims[type] || sims.network;
}

function genAnalysisCanvas() {
  return `
  let t2=0;const data2=Array(50).fill(0);
  function draw2(){ctx2.fillStyle='rgba(0,0,0,0.05)';ctx2.fillRect(0,0,c2.width,c2.height);
    data2.push(Math.random()*100);if(data2.length>50)data2.shift();
    ctx2.strokeStyle=accent2;ctx2.lineWidth=2;ctx2.beginPath();
    data2.forEach((v,i)=>{const x=i*(c2.width/50),y=c2.height-v*1.8;i===0?ctx2.moveTo(x,y):ctx2.lineTo(x,y);});ctx2.stroke();
    ctx2.fillStyle='#fff';ctx2.font='10px Orbitron,monospace';ctx2.fillText('ANALYSIS METRICS',10,15);
    t2++;requestAnimationFrame(draw2);}draw2();`;
}

function genJS(app) {
return `/**
 * ${app.dir} — Workshop DIY v1.0
 * ${app.subtitle}
 */
const $=id=>document.getElementById(id);const LIGHT_THEMES=['riad','medina'];const APP_VERSION='1.0';
const LANG={
en:{title:'${app.title}',subtitle:'${app.subtitle}',disconnected:'Disconnected',connected:'Connected',mainSection:'${app.title}',mainDesc:'${app.subtitle}',sectionA:'${app.secA}',sectionB:'${app.secB}',sectionC:'${app.secC}',btn1:'${app.btn1}',btn2:'${app.btn2}',metric1Label:'Threat Level',metric1Desc:'Current assessment',metric2Label:'Confidence',metric2Desc:'Analysis confidence',activityLog:'Activity Log',eventsMsg:'Events',clear:'Clear',copy:'Copy',export:'Export',filterAll:'All',settings:'Settings',language:'Language',theme:'Theme',soundEffects:'Sound effects',help:'Help',faq:'FAQ',howto:'How-To',wiki:'Wiki',faq_q1:'${app.faq1.replace(/'/g,"\\'")}',faq_a1:'${app.faq1a.replace(/'/g,"\\'")}',faq_q2:'Is this a real attack tool?',faq_a2:'No. This is purely an educational simulator.',howto_1:'Click the primary button to start.',howto_2:'Observe the canvas visualization.',howto_3:'Use the secondary button to analyze.',howto_4:'Review the intelligence log.',wiki_t1:'${app.title}',wiki_d1:'${app.faq1a.replace(/'/g,"\\'")}',ready:'${app.title} ready.',action1:'Running primary scan...',action1Done:'Primary scan complete!',action2:'Running analysis...',action2Done:'Analysis complete. Results logged.',logCleared:'Log cleared',copied:'Copied!',copyFail:'Copy failed',working:'Working...',splashHint:'tap to skip',langChanged:'Language \\u2192 English',themeChanged:'Theme \\u2192',t_mosque:'Mosque',t_zellige:'Zellige',t_andalus:'Andalus',t_riad:'Riad',t_medina:'Medina',t_space:'Space',t_jungle:'Jungle',t_robot:'Robot'},
fr:{title:'${app.titleFr}',subtitle:'${app.subtitleFr}',disconnected:'D\\u00e9connect\\u00e9',connected:'Connect\\u00e9',mainSection:'${app.titleFr}',mainDesc:'${app.subtitleFr}',sectionA:'${app.secAFr}',sectionB:'${app.secBFr}',sectionC:'${app.secCFr}',btn1:'${app.btn1Fr}',btn2:'${app.btn2Fr}',metric1Label:'Niveau de Menace',metric1Desc:'\\u00c9valuation actuelle',metric2Label:'Confiance',metric2Desc:'Confiance de l\\'analyse',activityLog:'Journal',eventsMsg:'\\u00c9v\\u00e9nements',clear:'Effacer',copy:'Copier',export:'Exporter',filterAll:'Tout',settings:'Param\\u00e8tres',language:'Langue',theme:'Th\\u00e8me',soundEffects:'Effets sonores',help:'Aide',faq:'FAQ',howto:'Guide',wiki:'Wiki',faq_q1:'${app.faq1Fr.replace(/'/g,"\\'")}',faq_a1:'${app.faq1aFr.replace(/'/g,"\\'")}',faq_q2:'Est-ce un vrai outil d\\'attaque?',faq_a2:'Non. C\\'est un simulateur \\u00e9ducatif.',howto_1:'Cliquez le bouton principal.',howto_2:'Observez la visualisation.',howto_3:'Utilisez le bouton secondaire.',howto_4:'Consultez le journal.',wiki_t1:'${app.titleFr}',wiki_d1:'${app.faq1aFr.replace(/'/g,"\\'")}',ready:'${app.titleFr} pr\\u00eat.',action1:'Scan principal en cours...',action1Done:'Scan termin\\u00e9!',action2:'Analyse en cours...',action2Done:'Analyse termin\\u00e9e.',logCleared:'Journal effac\\u00e9',copied:'Copi\\u00e9!',copyFail:'\\u00c9chec',working:'En cours...',splashHint:'appuyer pour passer',langChanged:'Langue \\u2192 Fran\\u00e7ais',themeChanged:'Th\\u00e8me \\u2192',t_mosque:'Mosqu\\u00e9e',t_zellige:'Zellige',t_andalus:'Andalous',t_riad:'Riad',t_medina:'M\\u00e9dina',t_space:'Espace',t_jungle:'Jungle',t_robot:'Robot'},
ar:{title:'${app.titleAr}',subtitle:'${app.subtitleAr}',disconnected:'\\u063a\\u064a\\u0631 \\u0645\\u062a\\u0635\\u0644',connected:'\\u0645\\u062a\\u0635\\u0644',mainSection:'${app.titleAr}',mainDesc:'${app.subtitleAr}',sectionA:'${app.secAAr}',sectionB:'${app.secBAr}',sectionC:'${app.secCAr}',btn1:'${app.btn1Ar}',btn2:'${app.btn2Ar}',metric1Label:'\\u0645\\u0633\\u062a\\u0648\\u0649 \\u0627\\u0644\\u062a\\u0647\\u062f\\u064a\\u062f',metric1Desc:'\\u0627\\u0644\\u062a\\u0642\\u064a\\u064a\\u0645 \\u0627\\u0644\\u062d\\u0627\\u0644\\u064a',metric2Label:'\\u0627\\u0644\\u062b\\u0642\\u0629',metric2Desc:'\\u062b\\u0642\\u0629 \\u0627\\u0644\\u062a\\u062d\\u0644\\u064a\\u0644',activityLog:'\\u0633\\u062c\\u0644 \\u0627\\u0644\\u0646\\u0634\\u0627\\u0637',eventsMsg:'\\u0627\\u0644\\u0623\\u062d\\u062f\\u0627\\u062b',clear:'\\u0645\\u0633\\u062d',copy:'\\u0646\\u0633\\u062e',export:'\\u062a\\u0635\\u062f\\u064a\\u0631',filterAll:'\\u0627\\u0644\\u0643\\u0644',settings:'\\u0627\\u0644\\u0625\\u0639\\u062f\\u0627\\u062f\\u0627\\u062a',language:'\\u0627\\u0644\\u0644\\u063a\\u0629',theme:'\\u0627\\u0644\\u0645\\u0638\\u0647\\u0631',soundEffects:'\\u0645\\u0624\\u062b\\u0631\\u0627\\u062a \\u0635\\u0648\\u062a\\u064a\\u0629',help:'\\u0645\\u0633\\u0627\\u0639\\u062f\\u0629',faq:'\\u0623\\u0633\\u0626\\u0644\\u0629',howto:'\\u0643\\u064a\\u0641',wiki:'\\u0648\\u064a\\u0643\\u064a',faq_q1:'${app.faq1Ar}',faq_a1:'${app.faq1aAr}',faq_q2:'\\u0647\\u0644 \\u0647\\u0630\\u0627 \\u0623\\u062f\\u0627\\u0629 \\u0647\\u062c\\u0648\\u0645\\u061f',faq_a2:'\\u0644\\u0627. \\u0645\\u062d\\u0627\\u0643\\u064a \\u062a\\u0639\\u0644\\u064a\\u0645\\u064a.',howto_1:'\\u0627\\u0646\\u0642\\u0631 \\u0627\\u0644\\u0632\\u0631 \\u0627\\u0644\\u0631\\u0626\\u064a\\u0633\\u064a.',howto_2:'\\u0631\\u0627\\u0642\\u0628 \\u0627\\u0644\\u062a\\u0635\\u0648\\u0631.',howto_3:'\\u0627\\u0633\\u062a\\u062e\\u062f\\u0645 \\u0627\\u0644\\u0632\\u0631 \\u0627\\u0644\\u062b\\u0627\\u0646\\u0648\\u064a.',howto_4:'\\u0631\\u0627\\u062c\\u0639 \\u0627\\u0644\\u0633\\u062c\\u0644.',wiki_t1:'${app.titleAr}',wiki_d1:'${app.faq1aAr}',ready:'${app.titleAr} \\u062c\\u0627\\u0647\\u0632.',action1:'\\u062c\\u0627\\u0631\\u064d \\u0627\\u0644\\u0645\\u0633\\u062d...',action1Done:'\\u0627\\u0643\\u062a\\u0645\\u0644 \\u0627\\u0644\\u0645\\u0633\\u062d!',action2:'\\u062c\\u0627\\u0631\\u064d \\u0627\\u0644\\u062a\\u062d\\u0644\\u064a\\u0644...',action2Done:'\\u0627\\u0643\\u062a\\u0645\\u0644 \\u0627\\u0644\\u062a\\u062d\\u0644\\u064a\\u0644.',logCleared:'\\u062a\\u0645 \\u0627\\u0644\\u0645\\u0633\\u062d',copied:'\\u062a\\u0645!',copyFail:'\\u0641\\u0634\\u0644',working:'\\u062c\\u0627\\u0631\\u064d...',splashHint:'\\u0627\\u0646\\u0642\\u0631 \\u0644\\u0644\\u062a\\u062e\\u0637\\u064a',langChanged:'\\u0627\\u0644\\u0644\\u063a\\u0629 \\u2190 \\u0627\\u0644\\u0639\\u0631\\u0628\\u064a\\u0629',themeChanged:'\\u0627\\u0644\\u0645\\u0638\\u0647\\u0631 \\u2190',t_mosque:'\\u0645\\u0633\\u062c\\u062f',t_zellige:'\\u0632\\u0644\\u064a\\u062c',t_andalus:'\\u0623\\u0646\\u062f\\u0644\\u0633',t_riad:'\\u0631\\u064a\\u0627\\u0636',t_medina:'\\u0645\\u062f\\u064a\\u0646\\u0629',t_space:'\\u0641\\u0636\\u0627\\u0621',t_jungle:'\\u0623\\u062f\\u063a\\u0627\\u0644',t_robot:'\\u0631\\u0648\\u0628\\u0648\\u062a'}
};
let currentLang='en';function T(k){return(LANG[currentLang]||LANG.en)[k]||k;}

/* ═══════ FRAMEWORK ═══════ */
let soundEnabled=false;const AudioCtx=window.AudioContext||window.webkitAudioContext;let audioCtx;
function playSound(type){if(!soundEnabled)return;if(!audioCtx)audioCtx=new AudioCtx();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);g.gain.value=0.08;const t=audioCtx.currentTime;if(type==='click'){o.frequency.value=800;o.type='sine';g.gain.exponentialRampToValueAtTime(0.001,t+0.08);o.start(t);o.stop(t+0.08);}else if(type==='success'){o.frequency.value=523;g.gain.exponentialRampToValueAtTime(0.001,t+0.3);o.start(t);o.stop(t+0.3);}else{o.frequency.value=200;o.type='square';g.gain.exponentialRampToValueAtTime(0.001,t+0.25);o.start(t);o.stop(t+0.25);}}
function setLanguage(lang){currentLang=lang;const s=LANG[lang];if(!s)return;document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(s[k]!=null)el.textContent=s[k];});document.querySelectorAll('[data-i18n-opt]').forEach(o=>{const k=o.dataset.i18nOpt;if(s[k]!=null)o.textContent=s[k];});document.title=s.title+' \\u2014 Workshop DIY';document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.lang=lang;const sel=$('langSelect');if(sel)sel.value=lang;try{localStorage.setItem('wdiy-lang',lang);}catch{}log(s.langChanged,'info');}
function setTheme(name){document.documentElement.dataset.theme=name;document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));const sel=$('themeSelect');if(sel)sel.value=name;try{localStorage.setItem('wdiy-theme',name);}catch{}log(T('themeChanged')+' '+name,'info');}
let logContainer;function log(msg,type='info'){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const d=document.createElement('div');d.className='log-line '+type;d.textContent='['+new Date().toLocaleTimeString()+'] '+msg;logContainer.appendChild(d);logContainer.scrollTop=logContainer.scrollHeight;if(type==='success')playSound('success');else if(type==='error')playSound('error');applyLogFilter();}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(T('logCleared'));}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;try{await navigator.clipboard.writeText(Array.from(logContainer.children).map(d=>d.textContent).join('\\n'));log(T('copied'),'success');}catch{log(T('copyFail'),'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const b=new Blob([Array.from(logContainer.children).map(d=>d.textContent).join('\\n')],{type:'text/plain'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='log.txt';a.click();URL.revokeObjectURL(u);}
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||T('working');el.style.display='block';}if(ms>0)setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';}
function setStatus(c){const t=$('statusText');if(t)t.textContent=c?T('connected'):T('disconnected');const p=$('statusPill');if(p)p.classList.toggle('connected',c);}
let splashTimer;function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);}function initSplash(){const s=$('splash');if(!s)return;splashTimer=setTimeout(dismissSplash,2500);}
let activeLogFilter='all';function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(l=>{l.style.display=activeLogFilter==='all'?'':l.classList.contains(activeLogFilter)?'':'none';});}
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}
function openPanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.add('open');if(o)o.classList.add('open');}function closePanel(pid,oid){const s=$(pid),o=$(oid);if(s)s.classList.remove('open');if(o)o.classList.remove('open');}
function openHelp(){openPanel('helpPanel','helpOverlay');}function closeHelp(){closePanel('helpPanel','helpOverlay');}
function openSettings(){openPanel('settingsPanel','settingsOverlay');}function closeSettings(){closePanel('settingsPanel','settingsOverlay');}
function openLog(){const s=$('logPanel');if(s)s.classList.add('open');document.body.classList.add('log-open');}function closeLog(){const s=$('logPanel');if(s)s.classList.remove('open');document.body.classList.remove('log-open');}function toggleLog(){const s=$('logPanel');s&&s.classList.contains('open')?closeLog():openLog();}
function initHelpTabs(){document.querySelectorAll('.help-tab').forEach(tab=>{tab.addEventListener('click',()=>{document.querySelectorAll('.help-tab').forEach(t=>t.classList.remove('active'));document.querySelectorAll('.help-content').forEach(c=>c.classList.remove('active'));tab.classList.add('active');const id='help'+tab.dataset.tab.charAt(0).toUpperCase()+tab.dataset.tab.slice(1);const el=$(id);if(el)el.classList.add('active');});});}

/* ═══════ CANVAS SIM ═══════ */
function initSimCanvas(){
  const c=$('simCanvas');if(!c)return;const ctx=c.getContext('2d');c.width=c.offsetWidth||800;c.height=250;
  const accent=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ${genCanvasSim(app.simType)}
}
function initAnalysisCanvas(){
  const c2=$('analysisCanvas');if(!c2)return;const ctx2=c2.getContext('2d');c2.width=c2.offsetWidth||800;c2.height=200;
  const accent2=getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()||'#d4a03c';
  ${genAnalysisCanvas()}
}

/* ═══════ ACTIONS ═══════ */
let metric1=0,metric2=0;
function doAction1(){
  log(T('action1'),'info');showToast(T('action1'));setStatus(true);
  let p=0;const iv=setInterval(()=>{p+=Math.random()*20;metric1=Math.min(100,Math.round(p));
    $('metric1Val').textContent=metric1>70?'HIGH':metric1>40?'MEDIUM':'LOW';
    $('metric1Val').style.color=metric1>70?'#f44':metric1>40?'#fa4':'#4f4';
    metric2=Math.min(99,Math.round(p*0.9));$('metric2Val').textContent=metric2+'%';
    if(p>=100){clearInterval(iv);hideToast();log(T('action1Done'),'success');
      const il=$('intelLog');if(il)il.textContent+='\\n[SCAN] Threat level: '+(metric1>70?'HIGH':'MEDIUM')+'\\n[SCAN] Confidence: '+metric2+'%\\n[SCAN] Vectors identified: '+Math.round(Math.random()*5+3);}
  },300);
}
function doAction2(){
  log(T('action2'),'info');showToast(T('action2'));
  setTimeout(()=>{hideToast();log(T('action2Done'),'success');
    const il=$('intelLog');if(il)il.textContent+='\\n[ANALYSIS] Pattern match score: '+Math.round(Math.random()*30+70)+'%\\n[ANALYSIS] Risk indicators: '+Math.round(Math.random()*4+2)+'\\n[ANALYSIS] Recommendation: Increase monitoring.';
  },1800);
}

/* ═══════ INIT ═══════ */
function init(){
  initSplash();
  if($('clearLogBtn'))$('clearLogBtn').onclick=clearLog;if($('copyLogBtn'))$('copyLogBtn').onclick=copyLog;if($('exportLogBtn'))$('exportLogBtn').onclick=exportLog;initLogFilters();
  if($('helpBtn'))$('helpBtn').onclick=openHelp;if($('helpCloseBtn'))$('helpCloseBtn').onclick=closeHelp;if($('helpOverlay'))$('helpOverlay').onclick=closeHelp;initHelpTabs();
  if($('settingsBtn'))$('settingsBtn').onclick=openSettings;if($('settingsCloseBtn'))$('settingsCloseBtn').onclick=closeSettings;if($('settingsOverlay'))$('settingsOverlay').onclick=closeSettings;
  if($('logBtn'))$('logBtn').onclick=toggleLog;if($('logCloseBtn'))$('logCloseBtn').onclick=closeLog;
  const st=$('soundToggle');if(st){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}st.checked=soundEnabled;st.addEventListener('change',()=>{soundEnabled=st.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}});}
  const ls=$('langSelect'),ts=$('themeSelect');if(ls)ls.addEventListener('change',()=>setLanguage(ls.value));if(ts)ts.addEventListener('change',()=>setTheme(ts.value));
  try{const sl=localStorage.getItem('wdiy-lang'),st2=localStorage.getItem('wdiy-theme');if(st2)setTheme(st2);if(sl)setLanguage(sl);}catch{}
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeHelp();closeSettings();closeLog();}});
  initHijriDate();initSimCanvas();initAnalysisCanvas();
  if($('btn1'))$('btn1').onclick=doAction1;
  if($('btn2'))$('btn2').onclick=doAction2;
  log(T('ready'),'success');
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
`;
}

// Generate all apps
APPS.forEach(app => {
  const dir = path.join(BASE, app.dir);
  const htmlPath = path.join(dir, 'index.html');
  const jsPath = path.join(dir, 'script.js');

  fs.writeFileSync(htmlPath, genHTML(app), 'utf-8');
  fs.writeFileSync(jsPath, genJS(app), 'utf-8');
  console.log(`Generated: ${app.dir}/index.html + script.js`);
});

console.log(`\nDone! Generated ${APPS.length} apps (${APPS.length * 2} files).`);
