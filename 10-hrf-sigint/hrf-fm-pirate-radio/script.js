/**
 * FM Pirate Radio — DJ Booth
 * Workshop DIY — v1.2
 * Broadcast a tiny FM station from your browser
 */

const $ = id => document.getElementById(id);

/* ═══════ LOGO SVG ═══════ */
const LOGO_SVG = `<svg preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workshop DIY" xmlns="http://www.w3.org/2000/svg" viewBox="77 78 254 137"><path style="stroke:none;fill:currentColor;fill-rule:evenodd" d="M187.4,152.9c.1-.1.2-.2.4-.2c.3,0,2.7-1.1,3.8-1.7l2.6-1.7c3.3-2.2,5.1-3,8.4-3.4c1.2-.2,2.1-.2,3.4,0c6.7.8,11.5,4.9,13.4,11.4c.4,1.3.4,5.5.1,6.7c-1.2,4-2.8,6.4-5.6,8.5c-4.3,3.3-9.9,4.2-14.9,2.3c-1.6-.6-2.7-1.2-4.3-2.4c-2.6-1.8-4-2.6-6.5-3.6l-.7-.3V160.8c0-4.2.1-7.8.1-7.9zM208.4,151.3h-6.5v3.2h6.5v-3.2zm-13,16.2h-3.2V151.3h3.2v16.2zm19.5,0h-3.2V151.3h3.2v16.2zm-13,6.5h-3.2v-9.7h6.5v-3.2h-3.2v-3.2h6.5v9.7h-6.5v6.5z"/><path style="stroke:none;fill:currentColor" d="M259.8,157.7l5.1-9.6h7.5l-9.3,15.7v11.3h-6.8V164.1l-9.5-16.1h7.7z"/><path style="stroke:none;fill:currentColor" d="M240.4,152.7h-3.9v17.5h3.9v4.7h-14.5v-4.7h3.9V152.7h-3.9v-4.7h14.5z"/></svg>`;
const FOOTER_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const LIGHT_THEMES = ['riad', 'medina'];
const APP_VERSION = '1.2';

/* ═══════ SOUND ═══════ */
let soundEnabled = false;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function playSound(type) {
  if (!soundEnabled) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination); gain.gain.value = 0.08;
  const t = audioCtx.currentTime;
  switch(type) {
    case 'click': osc.frequency.value=800; gain.gain.exponentialRampToValueAtTime(0.001,t+0.08); osc.start(t); osc.stop(t+0.08); break;
    case 'success': osc.frequency.value=523; gain.gain.exponentialRampToValueAtTime(0.001,t+0.3); osc.start(t); osc.stop(t+0.3); break;
    case 'error': osc.frequency.value=200; osc.type='square'; gain.gain.exponentialRampToValueAtTime(0.001,t+0.25); osc.start(t); osc.stop(t+0.25); break;
  }
}

/* ═══════ i18n ═══════ */
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
  ,
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
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

const LANG = {
  en: {
    ...LANG_BASE.en,
    title:'FM Pirate Radio', subtitle:'FM Pirate Radio \u2014 DJ Booth',
    disconnected:'Off Air', connected:'ON AIR',
    mainSection:'DJ Booth', mainDesc:'Broadcast a tiny FM station from your browser',
    sectionA:'FM Modulation Visualization', sectionB:'How FM Radio Works', sectionC:'Pirate Radio History',
    activityLog:'Activity Log', eventsMsg:'Events & messages',
    clear:'Clear', copy:'Copy', export:'Export', theme:'Theme',
    settings:'\u2699\uFE0F Settings', language:'Language',
    help:'\u2753 Help', faq:'FAQ', howto:'How-To', wiki:'Wiki',
    howto_1:'The main display shows the Fm Pirate Radio simulation. At the top you see the live visualization — colors and animations represent real data changing in real time. Below it, the control panel has buttons and sliders that each adjust a specific parameter. Start by looking at how Configure the parameters for FM Pirate Radio. Choose your in',
    howto_2:'Press the "Start" button. The main visualization will start animating. Watch carefully — colors, movement, and numbers all represent real data from the simulation. The status indicator in the top-right turns green when running.',
    howto_3:'Scroll down to the expandable sections. "FM Modulation Visualization" shows detailed measurements and charts that update in real time. Click section headers to expand or collapse them. The data here helps you understand what the visualization is showing.',
    howto_4:'Now experiment: change one parameter at a time. Press Stop, adjust a slider, then Start again. Compare the new output with what you saw before. This is how real engineers and scientists work — isolate one variable, observe the effect, and build understanding step by step.',
    wiki_fm_title:'FM Modulation', wiki_fm:'FM encodes audio by varying the carrier frequency. Higher audio amplitude = wider frequency deviation.',
    wiki_vu_title:'VU Meter', wiki_vu:'Volume Unit meter shows audio level in real time. Green = good, yellow = loud, red = clipping.',
    working:'Working\u2026',
    t_mosque:'Mosque', t_zellige:'Zellige', t_andalus:'Andalus', t_riad:'Riad', t_medina:'Medina',
    t_space:'Space', t_jungle:'Jungle', t_robot:'Robot',
    ready:'\uD83D\uDE80 FM Pirate Radio ready!',
    logCleared:'Log cleared', copied:'Copied!', copyFail:'Copy failed',
    filterAll:'All', soundEffects:'Sound effects',
    whisperMode:'Whisper mode', breathingGuide:'Breathing guide', dhikrTap:'Tap',
    musicMode:'Music reactive', splashHint:'tap to skip',
    langChanged:'\uD83C\uDF10 Language \u2192 English', themeChanged:'\uD83C\uDFA8 Theme \u2192',
    offAir:'OFF AIR', onAir:'ON AIR', freqSelect:'Frequency Selector',
    audioSource:'Audio Source', ttsMode:'TTS Text', toneMode:'Tone Generator',
    ttsPlaceholder:'Type message to broadcast...',
    toneFreq:'Tone (Hz):', waveform:'Waveform:',
    vuMeter:'VU Meter', broadcast:'Broadcast',
    goLive:'GO LIVE', stopLive:'STOP',
    fmModHint:'Shows how audio modulates the FM carrier frequency.',
    guideTitle:'What Am I Looking At?',
    guideP1:'Frequency Modulation (FM) encodes information by varying the frequency of a carrier wave proportional to the audio signal.',
    guideP2:'FM broadcast uses 87.5\u2013108 MHz with 75 kHz deviation and 200 kHz channel spacing.',
    guideP3:'Pirate radio stations broadcast without a license, historically on FM and AM bands.',
    histTitle:'Famous Pirate Radio Stations',step1Title:'Set Up',step1Desc:'Configure the parameters for FM Pirate Radio. Choose your input settings using the controls in the main card. Each control directly affects the simulation output.',step2Title:'Run',step2Desc:'Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs.',step3Title:'Observe',step3Desc:'Study the "FM Modulation Visualization" section below for detailed data. The numbers and graphs show exactly what is happening inside the simulation at each moment.',step4Title:'Experiment',step4Desc:'Change parameters one at a time and re-run. Compare results in "How FM Radio Works". Try extreme values to discover the limits of the system.',sectionCode:'Device Code',faq_q1:'What is FM Pirate Radio?',faq_a1:'Fm Pirate Radio is an interactive simulation that demonstrates SIGINT concepts. Broadcast a tiny FM station from your browser. Everything runs in your browser — no hardware or installation needed. Adjust the controls, observe the results, and build real understanding through experimentation.',faq_q2:'How does the simulation work?',faq_a2:'The simulation models real signal intelligence behavior in your browser. You control the inputs using sliders and buttons, and the visualization updates in real time to show you the results.',faq_q3:'What do the controls do?',faq_a3:'Select a frequency on the FM dial (87.5-108.0 MHz). Each button and slider changes a specific parameter. Hover over controls to see tooltips, and check the How-To tab for a step-by-step walkthrough.',faq_q4:'What is the science behind this?',faq_a4:'FM \u064A\u0634\u0641\u0631 \u0627\u0644\u0635\u0648\u062A \u0628\u062A\u063A\u064A\u064A\u0631 \u062A\u0631\u062F\u062F \u0627\u0644\u0645\u0648\u062C\u0629 \u0627\u0644\u062D\u0627\u0645\u0644\u0629.',faq_q5:'What should I experiment with?',faq_a5:'Try changing one parameter at a time and observe the effect. Push values to extremes to see what breaks — that teaches you the limits of the system.',faq_q6:'What hardware do I need for the real version?',faq_a6:'The simulation needs no hardware. To build the real project, you need HackRF One. See the Device Code section for firmware and wiring instructions.',faq_q7:'Is my data private?',faq_a7:'Yes. Everything runs locally in your browser. No data is sent anywhere, no account is needed, and it works completely offline.',faq_q8:'What should I explore next?',faq_a8:'Try Hrf Aircraft Radar and Hrf Gsm Tower Mapper. Each app in this category teaches a different aspect of signal intelligence.',demo_s1:'Welcome to FM Pirate Radio! Look at the main display — this is where the signal intelligence simulation runs.',demo_s2:'Select a frequency on the FM dial (87.5-108.0 MHz). Watch how the visualization reacts.',demo_s3:'Try adjusting the controls. Each slider or button changes a specific parameter of the simulation.',demo_s4:'Scroll down to see "FM Modulation Visualization" for detailed data. The numbers and charts update as the simulation runs.',demo_s5:'Great job! Now try the challenges section to test your understanding of signal intelligence.',sectionDemo:'Watch Demo',demoPlay:'Play',demoPause:'Pause',demoPrev:'Prev',demoNext:'Next',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Watch the simulation to see this happen in real time. The visualization makes the invisible visible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. The controls let you experiment with different conditions. Each change reveals how this principle responds.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Try the challenges section to test your understanding. Real engineers use these same concepts daily.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare results with different settings to build intuition. The data panels show precise measurements.',learn4Tag:'Security',sectionLearn:'What You Shall Learn',learnLevelVal:'Intermediate 🟡',learnLevel:'Level:',learnTimeVal:'20 min ⏱',learnTime:'Time:',learnAgeVal:'12+ 🧒',kidTitle:'For Young Explorers',kidIntro:'Welcome to Fm Pirate Radio! This is like a science experiment on your computer. You get to control a real SIGINT simulation — press buttons, move sliders, and watch what happens on screen. Try changing the controls and watch how Configure the parameters for FM Pirate Radio. Choo Nothing can break — it is all just a simulation running safely in your browser!',kidSafe:'Completely safe! Nothing you do here can break anything. It all runs inside your browser like a game.',kidTry:'Press the big Start button and watch the screen change. Then try moving sliders to see what they do.',kidParent:'This app teaches signal intelligence concepts through hands-on simulation. Suitable for STEM education in physics, electronics, and computer science.',ch1Title:'Signal Hunt',ch1Desc:'Tune across the frequency range and find the hidden signal. What frequency is it on? What modulation does it use?',ch2Title:'Noise Floor',ch2Desc:'Measure the noise floor at different frequencies. Where is it lowest? What natural and man-made sources contribute to noise?',ch3Title:'Bandwidth Test',ch3Desc:'Transmit data at different bandwidths. How does bandwidth affect data rate and signal quality? Find the optimal trade-off.',codeTitle:'Starter Code',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6    # 2.048 MHz\\nsdr.center_freq = 100e6      # 100 MHz FM band\\nsdr.gain = 40                # dB\\n\\n# Read 256k IQ samples\\nsamples = sdr.read_samples(256 * 1024)\\n\\n# Compute power spectrum (FFT)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak power: {power_dB.max():.1f} dB")\\nprint(f"At offset: {np.argmax(power_dB) - len(power_dB)//2} bins")\\nsdr.close()',codeExplain:'This Python script captures IQ (in-phase/quadrature) samples from an RTL-SDR dongle at 100 MHz. The FFT (Fast Fourier Transform) converts time-domain samples into a frequency spectrum. Power is measured in dB — higher values mean stronger signals. The peak tells you which frequency has the strongest signal nearby.',wiki_concept_title:'🔬 What is FM Pirate Radio?',wiki_concept:'FM Pirate Radio is a technique used in signal intelligence. Broadcast a tiny FM station from your browser. In professional settings, this technology requires HackRF One and specialized training. This simulation lets you explore the same principles safely in your browser, with instant visual feedback for every parameter change.',wiki_howworks_title:'⚙️ How It Works',wiki_howworks:'The process has four stages. First: Configure the parameters for FM Pirate Radio. Choose your input settings using the controls in the main card. Each control directly affects the simulation output. Second: Press "Start" to launch the simulation. Watch the main visualization update in real time as the system processes your inputs. The simulation runs these stages in real time, showing you intermediate results at each step. In real signal intelligence, each stage involves specialized equipment and careful calibration — here, the computer handles the hard parts so you can focus on understanding the principles.',wiki_realworld_title:'🌍 Real-World Applications',wiki_realworld:'FM Pirate Radio has practical applications in signal intelligence. Professionals use similar techniques with HackRF One in controlled environments. The principles demonstrated here apply to real-world scenarios — the same math, the same physics, just different scale and equipment. Understanding these fundamentals is the first step toward working with real systems.',wiki_safety_title:'🛡️ Safety & Privacy',wiki_safety:'This simulation runs entirely in your browser. No data is transmitted to any server. No hardware is needed, and nothing you do here affects any real system. This is a safe learning environment — experiment freely without risk. All settings and results are stored locally and disappear when you close the tab.',purpose:'FM Pirate Radio: Broadcast a tiny FM station from your browser. This simulation lets you experiment hands-on instead of just reading theory. Every parameter you change produces visible results, building real intuition for how the system behaves. The workflow goes from Configure RF through Capture Spectrum to Analyze Signal and Classify & Report.',guideTitle:'What Am I Looking At?',guideCanvas:'The main area shows a live visualization of the simulation. Colors and movement represent data changing in real time.',guideControls:'The buttons below the main display control the simulation. Start begins it, Stop pauses it, Reset clears everything.',guideSections:'Below the main card, "FM Modulation Visualization" and "How FM Radio Works" show detailed data and analysis. Click the section headers to expand or collapse them.',guideStatus:'The colored dot in the top-right corner shows the connection status. Green means running, red means stopped.',learnAge:'Ages:',relatedTitle:'\ud83d\udd17 Related Apps',related1_name:'Communications Interception Hub',related1_desc:'SIGINT collection, signal analysis and traffic monitoring',related1_path:'../../54-rf-warfare/rfw-comms-interception-hub/index.html',related2_name:'Receiver Pipeline',related2_desc:'Step-by-step DSP: antenna to audio output',related2_path:'../../33-sdr-learning/sdr-build-receiver/index.html',related3_name:'Radio Sniffer — Frequency Scanner',related3_desc:'Scan radio channels and analyze traffic patterns',related3_path:'../../07-net-microbit/bit-radio-sniffer/index.html',pathTitle:'\ud83d\udee4\ufe0f Learning Path',pathPrev_name:'Aircraft Radar — ADS-B Receiver',pathPrev_path:'../../10-hrf-sigint/hrf-aircraft-radar/index.html',pathNext_name:'GSM Tower Mapper',pathNext_path:'../../10-hrf-sigint/hrf-gsm-tower-mapper/index.html',
    shortcutsTitle:'⌨️ Keyboard Shortcuts',
    shortcutsInfo:'? = Help, Esc = Close, S = Start, R = Reset, 1-9 = Tabs',
    achieveTitle:'🏆 Achievements',
    achieveExplorer:'Explorer — visited 4+ help tabs',
    achieveScientist:'Scientist — revealed 2+ challenge answers',
    achieveExperimenter:'Experimenter — changed 5+ parameters'
  ,
    printBtn: '🖨️ Print Worksheet',quizTab:'Quiz',quizTitle:'Test Your Knowledge',quizRetry:'Retry',quizCorrect:'Correct!',quizWrong:'Wrong!',quizScore:'Score',quiz_q1:'What is the speed of radio waves in a vacuum?',quiz_q1a:'Speed of sound',quiz_q1b:'Speed of light',quiz_q1c:'Half the speed of light',quiz_q1d:'Twice the speed of light',quiz_q1_answer:'1',quiz_q2:'What is frequency measured in?',quiz_q2a:'Meters',quiz_q2b:'Hertz',quiz_q2c:'Watts',quiz_q2d:'Volts',quiz_q2_answer:'1',quiz_q3:'What does AI stand for?',quiz_q3a:'Automated Input',quiz_q3b:'Artificial Intelligence',quiz_q3c:'Analog Interface',quiz_q3d:'Active Integration',quiz_q3_answer:'1',quiz_q4:'What is machine learning?',quiz_q4a:'Programming robots',quiz_q4b:'Systems that learn from data',quiz_q4c:'Manual computation',quiz_q4d:'Hardware design',quiz_q4_answer:'1',quiz_q5:'Which unit measures radio frequency?',quiz_q5a:'Watts',quiz_q5b:'Hertz',quiz_q5c:'Decibels',quiz_q5d:'Ohms',quiz_q5_answer:'1',realworldTitle:'🌍 Real-World Stories',realworld1:'Operation Ivy Bells (1970s-80s) was a joint NSA/Navy mission to tap Soviet undersea communication cables in the Sea of Okhotsk. Divers placed recording pods on the cable, retrieving them monthly by submarine.',realworld2:'Numbers Stations have broadcast encrypted shortwave messages to field agents since the Cold War. UVB-76 (the Buzzer) in Russia has transmitted a monotone buzz since 1982, occasionally interrupted by coded voice messages.',realworld3:'The Aldrich Ames case (1994) revealed how a CIA mole used dead drops to pass classified intelligence to the Soviet Union for nearly a decade before detection, compromising over 100 operations.',experimentTitle:'🔬 Experiments',experiment_1_title:'Baseline Measurement',experiment_1:'Set all controls to default values and record the initial readings. These are your baseline measurements. Good scientists always establish a baseline before changing variables — it gives you a reference point to measure all future changes against.',experiment_2_title:'Sensitivity Analysis',experiment_2:'Change one parameter to its minimum value, record the result, then set it to maximum. The difference reveals the system\'s sensitivity to that variable. Repeat for each control. In counter-surveillance, knowing which parameters matter most helps you focus your efforts efficiently.',experiment_3_title:'Interaction Effects',experiment_3:'After testing parameters individually, change two simultaneously. Does the combined effect equal the sum of individual effects? Or is there a synergy (or cancellation)? Non-linear interactions are common in counter-surveillance and reveal the hidden complexity beneath simple-looking systems.',proTipTitle:'💡 Pro Tips',proTip1:'Use channel hopping (channels 1, 6, 11) for WiFi scanning — these are the only non-overlapping 2.4GHz channels and catch 90% of traffic.',proTip2:'Add a 10μF capacitor across the ESP32 power pins. WiFi transmission causes current spikes that can crash the board without proper decoupling.',funFactTitle:'🎯 Did You Know?',funFact:'The Great Seal bug — in 1945, Soviet children gifted the US ambassador a carved wooden Great Seal containing a passive listening device. It operated for 7 years before being discovered.',mistakeTitle:'⚠️ Common Mistakes',mistake1:'Changing multiple parameters at once makes it impossible to isolate cause and effect. Always change ONE variable at a time.',mistake2:'Skipping the baseline measurement. Without knowing the default behavior, you cannot measure how your changes affect the system.',mistake3:'Ignoring the activity log. It records every event with timestamps — essential for understanding sequences and debugging unexpected results.'},
    wiki_history_title: '📜 History of Sigint',
    wiki_history: 'Guglielmo Marconi transmitted the first transatlantic radio signal in 1901. Radio evolved from spark-gap transmitters to modern software-defined radios. Fm Pirate Radio builds on this foundation, letting you explore these historical concepts through interactive simulation.',
    wiki_math_title: '📐 Mathematics Behind Fm Pirate Radio',
    wiki_math: 'The mathematics behind Fm Pirate Radio: The Friis transmission equation calculates received power: Pr = Pt·Gt·Gr·(λ/4πd)². Signal strength decreases with the square of distance. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 Advanced Techniques',
    wiki_advanced: 'Beyond the basics demonstrated in this simulation, advanced SIGINT practitioners use sophisticated techniques. Adaptive algorithms automatically adjust parameters based on environmental conditions. Machine learning classifies signals with high accuracy. Multi-channel correlation detects patterns invisible to single-channel analysis. Distributed sensor networks combine data from multiple locations for triangulation. These techniques build on the fundamentals you learn here.',
    wiki_compare_title: '⚖️ Comparing Approaches',
    wiki_compare: 'There are several approaches to SIGINT. Hardware-based solutions using HackRF SDR offer real-time performance and direct signal access. Software simulations (like this app) provide safe experimentation without equipment cost. Cloud-based platforms offer scalability but introduce latency and privacy concerns. Each approach has trade-offs: cost vs. fidelity, speed vs. safety, simplicity vs. capability. This simulation gives you the conceptual foundation to use any approach effectively.',
    wiki_debug_title: '🔧 Troubleshooting Guide',
    wiki_debug: 'Common issues when working with SIGINT: (1) Unexpected results often come from incorrect parameter settings — reset to defaults and change one variable at a time. (2) If the visualization seems frozen, check that the simulation is running (not paused). (3) Noisy or erratic readings usually indicate interference — in real hardware, move away from electronic devices. (4) If calculations seem wrong, verify your units (Hz vs kHz vs MHz). Systematic debugging is a core skill in SIGINT.',
    wiki_ethics_title: '⚖️ Ethics & Legal Considerations',
    wiki_ethics: 'Sigint carries important ethical and legal responsibilities. Many countries regulate the use of HackRF SDR and similar equipment. Always obtain proper authorization before testing on systems you do not own. Respect privacy laws and data protection regulations. This simulation is designed for educational purposes — it demonstrates principles without transmitting real signals or accessing real networks. Responsible use of these skills contributes to security for everyone.',
    gloss1_term: 'Bandwidth',
    gloss1_def: 'The range of frequencies a signal occupies. Wider bandwidth allows more data but requires more spectrum. Measured in Hz (kHz, MHz, GHz).',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Theory & Background',
    theory: 'Fm Pirate Radio demonstrates key principles from SIGINT. Radio waves are electromagnetic radiation between 3 kHz and 300 GHz. They travel at the speed of light and can reflect, refract, and diffract around obstacles. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. The simulation models these real-world mechanisms using mathematical equations running in your browser. Every control maps to a real parameter that engineers tune in professional settings. By experimenting here, you build the same intuition that professionals develop through years of hands-on experience.',
    faq_q9: 'What common mistakes should I avoid?',
    faq_a9: 'The most common mistake is changing multiple parameters at once, which makes it impossible to understand cause and effect. Always change one thing at a time. Another common error is ignoring the activity log — it records every event and helps you understand the sequence of operations. Finally, do not skip the challenge section: those questions test whether you truly understand the concepts or just memorized the button sequence.',
    faq_q10: 'How does this relate to real-world SIGINT?',
    faq_a10: 'This simulation models the same physics and mathematics used in professional SIGINT systems. The parameters you adjust correspond to real equipment settings. The visualizations show data patterns identical to what you would see on professional instruments like oscilloscopes, spectrum analyzers, or protocol decoders. The main difference is that this runs safely in your browser — real systems use HackRF SDR hardware and may have legal requirements for operation. Skills you develop here transfer directly to hands-on work.',
    glossTitle: '📚 Key Terms',
  fr: {
    ...LANG_BASE.fr,
    title:'Radio Pirate FM', subtitle:'Radio Pirate FM \u2014 Cabine DJ',
    disconnected:'Hors antenne', connected:'EN DIRECT',
    mainSection:'Cabine DJ', mainDesc:'Diffusez une petite station FM depuis votre navigateur',
    sectionA:'Visualisation Modulation FM', sectionB:'Comment fonctionne la FM', sectionC:'Histoire Radio Pirate',
    activityLog:'Journal', eventsMsg:'\u00c9v\u00e9nements et messages',
    clear:'Effacer', copy:'Copier', export:'Exporter', theme:'Th\u00e8me',
    settings:'\u2699\uFE0F Param\u00e8tres', language:'Langue',
    help:'\u2753 Aide', faq:'FAQ', howto:'Guide', wiki:'Wiki',
    howto_1:'L écran principal affiche la simulation Fm Pirate Radio. En haut, la visualisation en direct — les couleurs et animations représentent des données réelles changeant en temps réel. En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. Start by looking at how Configure the parameters for FM Pirate Radio. Choose your in',
    howto_2:'Appuie sur "Start". La visualisation principale s\'anime. Les couleurs, mouvements et chiffres représentent des données réelles de la simulation. L\'indicateur en haut à droite devient vert quand ça tourne.',
    howto_3:'Descends vers les sections dépliables. Elles montrent des mesures et graphiques détaillés qui se mettent à jour en temps réel. Clique sur les en-têtes pour déplier ou replier.',
    howto_4:'Maintenant expérimente : change un paramètre à la fois. Appuie sur Arrêter, ajuste un curseur, puis relance. Compare le nouveau résultat avec le précédent. C\'est ainsi que travaillent les vrais ingénieurs.',
    wiki_fm_title:'Modulation FM', wiki_fm:'La FM encode l\'audio en variant la fr\u00e9quence porteuse.',
    wiki_vu_title:'VU-m\u00e8tre', wiki_vu:'Affiche le niveau audio en temps r\u00e9el.',
    working:'En cours\u2026',
    t_mosque:'Mosqu\u00e9e', t_zellige:'Zellige', t_andalus:'Andalous', t_riad:'Riad', t_medina:'M\u00e9dina',
    t_space:'Espace', t_jungle:'Jungle', t_robot:'Robot',
    ready:'\uD83D\uDE80 Radio Pirate FM pr\u00eate !',
    logCleared:'Journal effac\u00e9', copied:'Copi\u00e9 !', copyFail:'\u00c9chec',
    filterAll:'Tout', soundEffects:'Effets sonores',
    whisperMode:'Mode murmure', breathingGuide:'Guide respiratoire', dhikrTap:'Tap',
    musicMode:'R\u00e9actif musique', splashHint:'appuyer pour passer',
    langChanged:'\uD83C\uDF10 Langue \u2192 Fran\u00e7ais', themeChanged:'\uD83C\uDFA8 Th\u00e8me \u2192',
    offAir:'HORS ANTENNE', onAir:'EN DIRECT', freqSelect:'S\u00e9lecteur de Fr\u00e9quence',
    audioSource:'Source Audio', ttsMode:'Texte TTS', toneMode:'G\u00e9n\u00e9rateur',
    ttsPlaceholder:'Tapez un message \u00e0 diffuser...',
    toneFreq:'Tonalit\u00e9 (Hz) :', waveform:'Forme d\'onde :',
    vuMeter:'VU-m\u00e8tre', broadcast:'Diffusion',
    goLive:'EN DIRECT', stopLive:'ARR\u00caTER',
    fmModHint:'Montre comment l\'audio module la porteuse FM.',
    guideTitle:'Que vois-je à l\'écran ?',
    guideP1:'La Modulation de Fr\u00e9quence encode l\'information en variant la fr\u00e9quence.',
    guideP2:'La FM utilise 87.5\u2013108 MHz avec 75 kHz de d\u00e9viation.',
    guideP3:'Les radios pirates \u00e9mettent sans licence.',
    histTitle:'Stations Pirates C\u00e9l\u00e8bres',step1Title:'Configurer',step1Desc:'Configure les paramètres de FM Pirate Radio. Choisis tes réglages à l\'aide des contrôles de la carte principale. Chaque contrôle affecte directement le résultat.',step2Title:'Exécuter',step2Desc:'Appuie sur "Start" pour lancer la simulation. La visualisation se met à jour en temps réel.',step3Title:'Observer',step3Desc:'Étudie la section ci-dessous pour les données détaillées. Les chiffres et graphiques montrent ce qui se passe dans la simulation.',step4Title:'Expérimenter',step4Desc:'Change un paramètre à la fois et relance. Compare les résultats. Essaie des valeurs extrêmes pour découvrir les limites.',sectionCode:'Code Appareil',faq_q1:'Qu\'est-ce que FM Pirate Radio ?',faq_a1:'Fm Pirate Radio est une simulation interactive qui démontre les concepts de renseignement électronique. Broadcast a tiny FM station from your browser. Tout fonctionne dans votre navigateur — aucun matériel requis. Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.',faq_q2:'Comment fonctionne la simulation ?',faq_a2:'L\'application modélise un vrai comportement de renseignement d\'origine électromagnétique. Tu contrôles les entrées et tu observes les sorties changer en temps réel à l\'écran.',faq_q3:'Que font les contrôles ?',faq_a3:'Chaque bouton et curseur modifie un paramètre spécifique. Consulte l\'onglet Guide pour une procédure pas à pas.',faq_q4:'Quelle est la science derrière ?',faq_a4:'Cette application utilise de vrais principes de renseignement d\'origine électromagnétique. Les mêmes concepts sont utilisés par les professionnels.',faq_q5:'Que dois-je expérimenter ?',faq_a5:'Change un paramètre à la fois et observe l\'effet. Pousse les valeurs à l\'extrême pour voir les limites du système.',faq_q6:'Quel matériel pour la version réelle ?',faq_a6:'La simulation ne nécessite aucun matériel. Pour construire le vrai projet, il te faut HackRF One. Voir la section Code Appareil.',faq_q7:'Mes données sont-elles privées ?',faq_a7:'Oui. Tout fonctionne localement dans ton navigateur. Aucune donnée n\'est envoyée, aucun compte nécessaire, et ça marche hors ligne.',faq_q8:'Que découvrir ensuite ?',faq_a8:'Essaie d\'autres applications de cette catégorie. Chacune enseigne un aspect différent de renseignement d\'origine électromagnétique.',demo_s1:'Bienvenue dans FM Pirate Radio ! Regarde l\'écran principal — c\'est ici que la simulation de renseignement d\'origine électromagnétique fonctionne.',demo_s2:'Clique sur Démarrer et regarde la visualisation réagir.',demo_s3:'Essaie d\'ajuster les contrôles. Chaque curseur ou bouton modifie un paramètre spécifique.',demo_s4:'Descends pour voir les données détaillées. Les chiffres et graphiques se mettent à jour en temps réel.',demo_s5:'Bravo ! Maintenant essaie les défis pour tester ta compréhension de renseignement d\'origine électromagnétique.',sectionDemo:'Voir la Démo',demoPlay:'Jouer',demoPause:'Pause',demoPrev:'Préc',demoNext:'Suiv',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. Regarde la simulation pour voir ça en temps réel. La visualisation rend visible l\'invisible.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. Les contrôles te permettent d\'expérimenter. Chaque changement révèle comment ce principe réagit.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. Essaie les défis pour tester ta compréhension. Les vrais ingénieurs utilisent ces mêmes concepts.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. Compare les résultats avec différents réglages. Les panneaux de données montrent des mesures précises.',learn4Tag:'Security',sectionLearn:'Ce que tu vas apprendre',learnLevelVal:'Intermédiaire 🟡',learnLevel:'Niveau :',learnTimeVal:'20 min ⏱',learnTime:'Durée :',learnAgeVal:'12+ 🧒',kidTitle:'Pour les Jeunes Explorateurs',kidIntro:'Bienvenue dans Fm Pirate Radio ! C est comme une expérience scientifique sur ton ordinateur. Tu contrôles une vraie simulation de renseignement électronique — appuie sur les boutons, bouge les curseurs et regarde ce qui se passe. Try changing the controls and watch how Configure the parameters for FM Pirate Radio. Choo Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !',kidSafe:'Complètement sûr ! Rien de ce que tu fais ici ne peut casser quoi que ce soit. Tout fonctionne dans ton navigateur comme un jeu.',kidTry:'Appuie sur le gros bouton Démarrer et regarde l\'écran changer. Puis essaie de bouger les curseurs.',kidParent:'Cette appli enseigne des concepts de renseignement d\'origine électromagnétique par simulation interactive. Adaptée à l\'enseignement STEM en physique, électronique et informatique.',ch1Title:'Chasse au Signal',ch1Desc:'Balaye les fréquences et trouve le signal caché. Sur quelle fréquence est-il ? Quelle modulation utilise-t-il ?',ch2Title:'Plancher de Bruit',ch2Desc:'Mesure le plancher de bruit à différentes fréquences. Où est-il le plus bas ? Quelles sources contribuent au bruit ?',ch3Title:'Test de Bande Passante',ch3Desc:'Transmets des données à différentes bandes passantes. Comment cela affecte-t-il le débit et la qualité ?',codeTitle:'Code de Démarrage',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6\\nsdr.center_freq = 100e6\\nsdr.gain = 40\\n\\nsamples = sdr.read_samples(256 * 1024)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Pic: {power_dB.max():.1f} dB")\\nsdr.close()',codeExplain:'Ce script Python capture des échantillons IQ depuis un dongle RTL-SDR à 100 MHz. La FFT convertit les échantillons temporels en spectre fréquentiel. La puissance en dB indique l\'intensité — plus c\'est haut, plus le signal est fort.',wiki_concept_title:'🔬 Qu\'est-ce que FM Pirate Radio ?',wiki_concept:'FM Pirate Radio est une technique utilisée en signal intelligence. Dans un contexte professionnel, cette technologie nécessite HackRF One et une formation spécialisée. Cette simulation te permet d\'explorer les mêmes principes en sécurité dans ton navigateur.',wiki_howworks_title:'⚙️ Comment ça marche',wiki_howworks:'La simulation traite les données en temps réel à travers plusieurs étapes. Chaque étape transforme l\'entrée en utilisant des algorithmes basés sur de vrais principes de signal intelligence. Tu peux observer les résultats intermédiaires à chaque étape.',wiki_realworld_title:'🌍 Applications réelles',wiki_realworld:'FM Pirate Radio a des applications pratiques en signal intelligence. Les professionnels utilisent des techniques similaires avec HackRF One. Les principes démontrés ici s\'appliquent au monde réel — mêmes mathématiques, même physique, juste une échelle et un équipement différents.',wiki_safety_title:'🛡️ Sécurité et confidentialité',wiki_safety:'Cette simulation fonctionne entièrement dans ton navigateur. Aucune donnée n\'est transmise. Aucun matériel n\'est nécessaire et rien ici n\'affecte un vrai système. C\'est un environnement d\'apprentissage sûr — expérimente librement.',purpose:'FM Pirate Radio : Broadcast a tiny FM station from your browser. Cette simulation te permet d\'expérimenter au lieu de simplement lire la théorie. Chaque paramètre que tu changes produit des résultats visibles, construisant une vraie intuition du comportement du système.',guideTitle:'Que vois-je à l\'écran ?',guideCanvas:'La zone principale affiche une visualisation en direct de la simulation. Les couleurs et mouvements représentent les données en temps réel.',guideControls:'Les boutons sous l\'écran principal contrôlent la simulation. Démarrer la lance, Arrêter la met en pause, Réinitialiser efface tout.',guideSections:'Sous la carte principale, les sections montrent les données détaillées et l\'analyse. Clique sur les en-têtes pour les déplier.',guideStatus:'Le point coloré en haut à droite montre l\'état. Vert signifie en marche, rouge signifie arrêté.',learnAge:'Âge :',relatedTitle:'\ud83d\udd17 Apps Similaires',related1_name:'Hub d\\',related1_desc:'Collecte SIGINT et analyse du trafic',related1_path:'../../54-rf-warfare/rfw-comms-interception-hub/index.html',related2_name:'Pipeline Recepteur',related2_desc:'DSP etape par etape: antenne vers sortie audio',related2_path:'../../33-sdr-learning/sdr-build-receiver/index.html',related3_name:'Radio Sniffer — Scanner de Fréquences',related3_desc:'Scannez les canaux radio et analysez les schémas de trafic',related3_path:'../../07-net-microbit/bit-radio-sniffer/index.html',pathTitle:'\ud83d\udee4\ufe0f Parcours',pathPrev_name:'Radar Aérien — Récepteur ADS-B',pathPrev_path:'../../10-hrf-sigint/hrf-aircraft-radar/index.html',pathNext_name:'Cartographe GSM',pathNext_path:'../../10-hrf-sigint/hrf-gsm-tower-mapper/index.html',
    printBtn: '🖨️ Imprimer',quizTab:'Quiz',quizTitle:'Testez vos connaissances',quizRetry:'Rejouer',quizCorrect:'Correct !',quizWrong:'Faux !',quizScore:'Score',quiz_q1:'Quelle est la vitesse des ondes radio dans le vide ?',quiz_q1a:'Vitesse du son',quiz_q1b:'Vitesse de la lumière',quiz_q1c:'Moitié de la vitesse de la lumière',quiz_q1d:'Double de la vitesse de la lumière',quiz_q1_answer:'1',quiz_q2:'En quoi se mesure la fréquence ?',quiz_q2a:'Mètres',quiz_q2b:'Hertz',quiz_q2c:'Watts',quiz_q2d:'Volts',quiz_q2_answer:'1',quiz_q3:'Que signifie IA ?',quiz_q3a:'Entrée automatisée',quiz_q3b:'Intelligence Artificielle',quiz_q3c:'Interface analogique',quiz_q3d:'Intégration active',quiz_q3_answer:'1',quiz_q4:'Qu\'est-ce que l\'apprentissage automatique ?',quiz_q4a:'Programmer des robots',quiz_q4b:'Systèmes apprenant des données',quiz_q4c:'Calcul manuel',quiz_q4d:'Conception matérielle',quiz_q4_answer:'1',quiz_q5:'Quelle unité mesure la fréquence radio ?',quiz_q5a:'Watts',quiz_q5b:'Hertz',quiz_q5c:'Décibels',quiz_q5d:'Ohms',quiz_q5_answer:'1',realworldTitle:'🌍 Histoires réelles',realworld1:'L\'opération Ivy Bells (1970-80) était une mission conjointe NSA/Marine pour intercepter les câbles de communication sous-marins soviétiques en mer d\'Okhotsk.',realworld2:'Les stations de nombres diffusent des messages chiffrés par ondes courtes aux agents de terrain depuis la Guerre froide. UVB-76 émet un bourdonnement monotone depuis 1982.',realworld3:'L\'affaire Aldrich Ames (1994) a révélé comment une taupe de la CIA utilisait des boîtes aux lettres mortes pour transmettre des renseignements classifiés à l\'Union soviétique pendant près d\'une décennie.',experimentTitle:'🔬 Expériences',experiment_1_title:'Mesure de référence',experiment_1:'Réglez tous les contrôles sur les valeurs par défaut et notez les lectures initiales. Ce sont vos mesures de référence. Un bon scientifique établit toujours une référence avant de modifier des variables — cela donne un point de comparaison pour mesurer tous les changements futurs.',experiment_2_title:'Analyse de sensibilité',experiment_2:'Changez un paramètre à sa valeur minimale, notez le résultat, puis réglez-le au maximum. La différence révèle la sensibilité du système à cette variable. En contre-surveillance, savoir quels paramètres comptent le plus vous aide à concentrer vos efforts.',experiment_3_title:'Effets d\'interaction',experiment_3:'Après avoir testé les paramètres individuellement, changez-en deux simultanément. L\'effet combiné est-il égal à la somme des effets individuels? Les interactions non linéaires sont courantes en contre-surveillance et révèlent la complexité cachée sous des systèmes simples en apparence.',proTipTitle:'💡 Conseils de pro',proTip1:'Utilisez le saut de canal (canaux 1, 6, 11) pour le scan WiFi — ce sont les seuls canaux 2,4 GHz non chevauchants et ils captent 90% du trafic.',proTip2:'Ajoutez un condensateur de 10μF aux bornes d\x27alimentation de l\x27ESP32. La transmission WiFi cause des pics de courant qui peuvent planter la carte sans découplage.',funFactTitle:'🎯 Le saviez-vous ?',funFact:'Le bug du Grand Sceau — en 1945, des enfants soviétiques ont offert à l\x27ambassadeur américain un Grand Sceau en bois contenant un dispositif d\x27écoute passif. Il a fonctionné 7 ans avant d\x27être découvert.',mistakeTitle:'⚠️ Erreurs courantes',mistake1:'Changer plusieurs paramètres à la fois rend impossible l\x27isolation de la cause et de l\x27effet. Changez toujours UNE seule variable à la fois.',mistake2:'Sauter la mesure de référence. Sans connaître le comportement par défaut, vous ne pouvez pas mesurer l\x27impact de vos changements.',mistake3:'Ignorer le journal d\x27activité. Il enregistre chaque événement avec des horodatages — essentiel pour comprendre les séquences.'},
    wiki_history_title: '📜 Histoire de renseignement électronique',
    wiki_history: 'Guglielmo Marconi transmitted the first transatlantic radio signal in 1901. Radio evolved from spark-gap transmitters to modern software-defined radios. Fm Pirate Radio s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.',
    wiki_math_title: '📐 Mathématiques de Fm Pirate Radio',
    wiki_math: 'Les mathématiques derrière Fm Pirate Radio : The Friis transmission equation calculates received power: Pr = Pt·Gt·Gr·(λ/4πd)². Signal strength decreases with the square of distance. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 Techniques avancées',
    wiki_advanced: 'Au-delà des bases de cette simulation, les praticiens avancés de renseignement électronique utilisent des techniques sophistiquées. Les algorithmes adaptatifs ajustent automatiquement les paramètres. L apprentissage automatique classifie les signaux avec précision. La corrélation multi-canaux détecte des motifs invisibles à l analyse mono-canal. Les réseaux de capteurs distribués combinent les données de plusieurs emplacements.',
    wiki_compare_title: '⚖️ Comparaison des approches',
    wiki_compare: 'Il existe plusieurs approches pour renseignement électronique. Les solutions matérielles avec HackRF SDR offrent des performances en temps réel. Les simulations logicielles (comme cette app) permettent une expérimentation sûre sans coût de matériel. Les plateformes cloud offrent une évolutivité mais introduisent latence et préoccupations de confidentialité. Cette simulation vous donne les bases pour utiliser efficacement toute approche.',
    wiki_debug_title: '🔧 Guide de dépannage',
    wiki_debug: 'Problèmes courants en renseignement électronique : (1) Les résultats inattendus proviennent souvent de paramètres incorrects — réinitialisez et modifiez une variable à la fois. (2) Si la visualisation semble gelée, vérifiez que la simulation tourne. (3) Les lectures erratiques indiquent des interférences. (4) Vérifiez vos unités (Hz vs kHz vs MHz). Le débogage systématique est une compétence essentielle.',
    wiki_ethics_title: '⚖️ Éthique et aspects légaux',
    wiki_ethics: 'Renseignement électronique implique des responsabilités éthiques et légales importantes. De nombreux pays réglementent l utilisation de HackRF SDR. Obtenez toujours une autorisation avant de tester des systèmes que vous ne possédez pas. Respectez les lois sur la vie privée et la protection des données. Cette simulation est conçue à des fins éducatives — elle démontre des principes sans transmettre de signaux réels ni accéder à de vrais réseaux.',
    gloss1_term: 'Bandwidth',
    gloss1_def: 'The range of frequencies a signal occupies. Wider bandwidth allows more data but requires more spectrum. Measured in Hz (kHz, MHz, GHz).',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 Théorie et contexte',
    theory: 'Fm Pirate Radio démontre les principes clés de renseignement électronique. Radio waves are electromagnetic radiation between 3 kHz and 300 GHz. They travel at the speed of light and can reflect, refract, and diffract around obstacles. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. La simulation modélise ces mécanismes à l aide d équations mathématiques dans votre navigateur. Chaque contrôle correspond à un paramètre réel. En expérimentant ici, vous développez l intuition que les professionnels acquièrent après des années d expérience pratique.',
    faq_q9: 'Quelles erreurs courantes dois-je éviter ?',
    faq_a9: 'L erreur la plus courante est de modifier plusieurs paramètres simultanément, ce qui rend impossible la compréhension de cause à effet. Modifiez toujours un seul élément à la fois. Une autre erreur est d ignorer le journal d activité — il enregistre chaque événement. Enfin, ne sautez pas la section défis : ces questions testent votre compréhension réelle des concepts.',
    faq_q10: 'Quel est le lien avec SIGINT dans le monde réel ?',
    faq_a10: 'Cette simulation modélise la même physique et les mêmes mathématiques que les systèmes professionnels. Les paramètres que vous ajustez correspondent aux réglages de vrais équipements. Les visualisations montrent des motifs identiques à ceux des instruments professionnels. La différence principale est que ceci fonctionne en sécurité dans votre navigateur — les vrais systèmes utilisent du matériel HackRF SDR et peuvent avoir des exigences légales.',
    glossTitle: '📚 Termes clés',
  ar: {
    ...LANG_BASE.ar,
    title:'\u0631\u0627\u062F\u064A\u0648 \u0627\u0644\u0642\u0631\u0627\u0635\u0646\u0629 FM', subtitle:'\u0631\u0627\u062F\u064A\u0648 \u0627\u0644\u0642\u0631\u0627\u0635\u0646\u0629 FM \u2014 \u0643\u0627\u0628\u064A\u0646\u0629 DJ',
    disconnected:'\u062E\u0627\u0631\u062C \u0627\u0644\u0628\u062B', connected:'\u0639\u0644\u0649 \u0627\u0644\u0647\u0648\u0627\u0621',
    mainSection:'\u0643\u0627\u0628\u064A\u0646\u0629 DJ', mainDesc:'\u0628\u062B \u0645\u062D\u0637\u0629 FM \u0635\u063A\u064A\u0631\u0629 \u0645\u0646 \u0645\u062A\u0635\u0641\u062D\u0643',
    sectionA:'\u062A\u0635\u0648\u0631 \u062A\u0639\u062F\u064A\u0644 FM', sectionB:'\u0643\u064A\u0641 \u064A\u0639\u0645\u0644 \u0631\u0627\u062F\u064A\u0648 FM', sectionC:'\u062A\u0627\u0631\u064A\u062E \u0631\u0627\u062F\u064A\u0648 \u0627\u0644\u0642\u0631\u0627\u0635\u0646\u0629',
    activityLog:'\u0633\u062C\u0644 \u0627\u0644\u0646\u0634\u0627\u0637', eventsMsg:'\u0627\u0644\u0623\u062D\u062F\u0627\u062B \u0648\u0627\u0644\u0631\u0633\u0627\u0626\u0644',
    clear:'\u0645\u0633\u062D', copy:'\u0646\u0633\u062E', export:'\u062A\u0635\u062F\u064A\u0631', theme:'\u0627\u0644\u0645\u0638\u0647\u0631',
    settings:'\u2699\uFE0F \u0627\u0644\u0625\u0639\u062F\u0627\u062F\u0627\u062A', language:'\u0627\u0644\u0644\u063A\u0629',
    help:'\u2753 \u0645\u0633\u0627\u0639\u062F\u0629', faq:'\u0623\u0633\u0626\u0644\u0629', howto:'\u0643\u064A\u0641', wiki:'\u0648\u064A\u0643\u064A',
    howto_1:'تعرض الشاشة الرئيسية محاكاة Fm Pirate Radio. في الأعلى ترى التصور المباشر — الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. Start by looking at how Configure the parameters for FM Pirate Radio. Choose your in', howto_2:'اضغط على "Start". التصور المرئي سيبدأ بالتحرك. الألوان والحركة والأرقام كلها تمثل بيانات حقيقية. المؤشر في أعلى اليمين يتحول للأخضر عند التشغيل.',
    howto_3:'انزل للأقسام القابلة للطي. تعرض قياسات ورسوماً بيانية مفصلة تتحدث في الوقت الفعلي. انقر على العناوين للطي أو الفتح.', howto_4:'الآن جرّب: غيّر معاملاً واحداً في كل مرة. اضغط إيقاف، عدّل منزلقاً، ثم أعد التشغيل. قارن النتيجة الجديدة بالسابقة. هكذا يعمل المهندسون الحقيقيون.',
    wiki_fm_title:'\u062A\u0639\u062F\u064A\u0644 FM', wiki_fm:'FM \u064A\u0634\u0641\u0631 \u0627\u0644\u0635\u0648\u062A \u0628\u062A\u063A\u064A\u064A\u0631 \u062A\u0631\u062F\u062F \u0627\u0644\u0645\u0648\u062C\u0629 \u0627\u0644\u062D\u0627\u0645\u0644\u0629.',
    wiki_vu_title:'\u0645\u0642\u064A\u0627\u0633 VU', wiki_vu:'\u064A\u0639\u0631\u0636 \u0645\u0633\u062A\u0648\u0649 \u0627\u0644\u0635\u0648\u062A \u0641\u064A \u0627\u0644\u0648\u0642\u062A \u0627\u0644\u062D\u0642\u064A\u0642\u064A.',
    working:'\u062C\u0627\u0631\u064D\u2026',
    t_mosque:'\u0645\u0633\u062C\u062F', t_zellige:'\u0632\u0644\u064A\u062C', t_andalus:'\u0623\u0646\u062F\u0644\u0633', t_riad:'\u0631\u064A\u0627\u0636', t_medina:'\u0645\u062F\u064A\u0646\u0629',
    t_space:'\u0641\u0636\u0627\u0621', t_jungle:'\u0623\u062F\u063A\u0627\u0644', t_robot:'\u0631\u0648\u0628\u0648\u062A',
    ready:'\uD83D\uDE80 \u0631\u0627\u062F\u064A\u0648 \u0627\u0644\u0642\u0631\u0627\u0635\u0646\u0629 \u062C\u0627\u0647\u0632!',
    logCleared:'\u062A\u0645 \u0645\u0633\u062D \u0627\u0644\u0633\u062C\u0644', copied:'\u062A\u0645 \u0627\u0644\u0646\u0633\u062E!', copyFail:'\u0641\u0634\u0644',
    filterAll:'\u0627\u0644\u0643\u0644', soundEffects:'\u0645\u0624\u062B\u0631\u0627\u062A \u0635\u0648\u062A\u064A\u0629',
    whisperMode:'\u0648\u0636\u0639 \u0627\u0644\u0647\u0645\u0633', breathingGuide:'\u062F\u0644\u064A\u0644 \u0627\u0644\u062A\u0646\u0641\u0633', dhikrTap:'\u0627\u0636\u063A\u0637',
    musicMode:'\u062A\u0641\u0627\u0639\u0644 \u0645\u0648\u0633\u064A\u0642\u064A', splashHint:'\u0627\u0646\u0642\u0631 \u0644\u0644\u062A\u062E\u0637\u064A',
    langChanged:'\uD83C\uDF10 \u0627\u0644\u0644\u063A\u0629 \u2190 \u0627\u0644\u0639\u0631\u0628\u064A\u0629', themeChanged:'\uD83C\uDFA8 \u0627\u0644\u0645\u0638\u0647\u0631 \u2190',
    offAir:'\u062E\u0627\u0631\u062C \u0627\u0644\u0628\u062B', onAir:'\u0639\u0644\u0649 \u0627\u0644\u0647\u0648\u0627\u0621',
    freqSelect:'\u0645\u062D\u062F\u062F \u0627\u0644\u062A\u0631\u062F\u062F',
    audioSource:'\u0645\u0635\u062F\u0631 \u0627\u0644\u0635\u0648\u062A', ttsMode:'\u0646\u0635 TTS', toneMode:'\u0645\u0648\u0644\u062F \u0646\u063A\u0645\u0627\u062A',
    ttsPlaceholder:'\u0627\u0643\u062A\u0628 \u0631\u0633\u0627\u0644\u0629 \u0644\u0644\u0628\u062B...',
    toneFreq:'\u0627\u0644\u0646\u063A\u0645\u0629 (Hz):', waveform:'\u0634\u0643\u0644 \u0627\u0644\u0645\u0648\u062C\u0629:',
    vuMeter:'\u0645\u0642\u064A\u0627\u0633 VU', broadcast:'\u0628\u062B',
    goLive:'\u0628\u062B \u0645\u0628\u0627\u0634\u0631', stopLive:'\u0625\u064A\u0642\u0627\u0641',
    fmModHint:'\u064A\u0639\u0631\u0636 \u0643\u064A\u0641 \u064A\u0639\u062F\u0644 \u0627\u0644\u0635\u0648\u062A \u062D\u0627\u0645\u0644 FM.',
    guideTitle:'ماذا أرى على الشاشة؟',
    guideP1:'FM \u064A\u0634\u0641\u0631 \u0627\u0644\u0645\u0639\u0644\u0648\u0645\u0627\u062A \u0628\u062A\u063A\u064A\u064A\u0631 \u062A\u0631\u062F\u062F \u0627\u0644\u0645\u0648\u062C\u0629.',
    guideP2:'FM \u064A\u0633\u062A\u062E\u062F\u0645 87.5-108 MHz.',
    guideP3:'\u0631\u0627\u062F\u064A\u0648 \u0627\u0644\u0642\u0631\u0627\u0635\u0646\u0629 \u064A\u0628\u062B \u0628\u062F\u0648\u0646 \u062A\u0631\u062E\u064A\u0635.',
    histTitle:'\u0645\u062D\u0637\u0627\u062A \u0642\u0631\u0627\u0635\u0646\u0629 \u0634\u0647\u064A\u0631\u0629',step1Title:'إعداد',step1Desc:'اضبط معاملات FM Pirate Radio. اختر إعداداتك باستخدام أدوات التحكم في البطاقة الرئيسية. كل أداة تؤثر مباشرة على نتيجة المحاكاة.',step2Title:'تشغيل',step2Desc:'اضغط "Start" لبدء المحاكاة. شاهد التصور المرئي يتحدث في الوقت الفعلي.',step3Title:'مراقبة',step3Desc:'ادرس القسم أدناه للبيانات التفصيلية. الأرقام والرسوم البيانية تُظهر ما يحدث داخل المحاكاة.',step4Title:'تجريب',step4Desc:'غيّر معاملاً واحداً في كل مرة وأعد التشغيل. قارن النتائج. جرّب قيماً متطرفة لاكتشاف حدود النظام.',sectionCode:'كود الجهاز',faq_q1:'ما هو FM Pirate Radio؟',faq_a1:'Fm Pirate Radio هي محاكاة تفاعلية توضح مفاهيم الاستخبارات الإلكترونية. Broadcast a tiny FM station from your browser. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.',faq_q2:'كيف تعمل المحاكاة؟',faq_a2:'التطبيق يحاكي سلوكاً حقيقياً في استخبارات الإشارات. أنت تتحكم في المدخلات وتشاهد المخرجات تتغير في الوقت الفعلي.',faq_q3:'ماذا تفعل أدوات التحكم؟',faq_a3:'كل زر ومنزلق يغيّر معاملاً محدداً. راجع تبويب "كيف تستخدم" للحصول على دليل خطوة بخطوة.',faq_q4:'ما العلم وراء هذا؟',faq_a4:'هذا التطبيق يستخدم مبادئ حقيقية من استخبارات الإشارات. نفس المفاهيم يستخدمها المحترفون.',faq_q5:'بماذا أجرّب؟',faq_a5:'غيّر معاملاً واحداً في كل مرة وراقب التأثير. ادفع القيم للحدود القصوى لترى حدود النظام.',faq_q6:'ما العتاد المطلوب للنسخة الحقيقية؟',faq_a6:'المحاكاة لا تحتاج عتاداً. لبناء المشروع الحقيقي تحتاج HackRF One. راجع قسم كود الجهاز.',faq_q7:'هل بياناتي خاصة؟',faq_a7:'نعم. كل شيء يعمل محلياً في متصفحك. لا تُرسل أي بيانات، لا حاجة لحساب، ويعمل بدون إنترنت.',faq_q8:'ماذا أستكشف بعد ذلك؟',faq_a8:'جرّب تطبيقات أخرى في هذه الفئة. كل تطبيق يعلّم جانباً مختلفاً من استخبارات الإشارات.',demo_s1:'مرحباً في FM Pirate Radio! انظر إلى الشاشة الرئيسية — هنا تعمل محاكاة استخبارات الإشارات.',demo_s2:'اضغط بدء وشاهد كيف يتفاعل التصوير المرئي.',demo_s3:'جرّب تعديل أدوات التحكم. كل منزلق أو زر يغيّر معاملاً محدداً.',demo_s4:'انزل للأسفل لرؤية البيانات التفصيلية. الأرقام والرسوم البيانية تتحدث في الوقت الفعلي.',demo_s5:'أحسنت! الآن جرّب قسم التحديات لاختبار فهمك لـاستخبارات الإشارات.',sectionDemo:'شاهد العرض',demoPlay:'تشغيل',demoPause:'إيقاف',demoPrev:'السابق',demoNext:'التالي',learn1Title:'RF Signals',learn1Desc:'How radio frequency energy carries information. شاهد المحاكاة لرؤية هذا في الوقت الفعلي. التصور المرئي يجعل غير المرئي مرئياً.',learn1Tag:'RF',learn2Title:'Signal Analysis',learn2Desc:'How to identify and classify unknown signals. أدوات التحكم تتيح لك التجريب. كل تغيير يكشف كيف يستجيب هذا المبدأ.',learn2Tag:'SIGINT',learn3Title:'Spectrum Monitoring',learn3Desc:'How to scan and map the radio spectrum. جرّب التحديات لاختبار فهمك. المهندسون الحقيقيون يستخدمون نفس هذه المفاهيم.',learn3Tag:'Spectrum',learn4Title:'RF Security',learn4Desc:'How to detect and defend against RF threats. قارن النتائج بإعدادات مختلفة لبناء الفهم. لوحات البيانات تعرض قياسات دقيقة.',learn4Tag:'Security',sectionLearn:'ماذا ستتعلم',learnLevelVal:'متوسط 🟡',learnLevel:'المستوى:',learnTimeVal:'20 min ⏱',learnTime:'المدة:',learnAgeVal:'12+ 🧒',kidTitle:'للمستكشفين الصغار',kidIntro:'مرحباً في Fm Pirate Radio! هذا مثل تجربة علمية على حاسوبك. تتحكم في محاكاة حقيقية لـالاستخبارات الإلكترونية — اضغط الأزرار، حرك المنزلقات وشاهد ما يحدث على الشاشة. Try changing the controls and watch how Configure the parameters for FM Pirate Radio. Choo لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!',kidSafe:'آمن تماماً! لا شيء تفعله هنا يمكن أن يكسر أي شيء. كل شيء يعمل داخل متصفحك مثل لعبة.',kidTry:'اضغط على زر البدء الكبير وشاهد الشاشة تتغير. ثم جرّب تحريك المنزلقات.',kidParent:'يعلّم هذا التطبيق مفاهيم استخبارات الإشارات من خلال المحاكاة التفاعلية. مناسب لتعليم STEM في الفيزياء والإلكترونيات وعلوم الحاسوب.',ch1Title:'البحث عن الإشارة',ch1Desc:'امسح نطاق الترددات واعثر على الإشارة المخفية. على أي تردد هي؟ أي تعديل تستخدم؟',ch2Title:'أرضية الضوضاء',ch2Desc:'قِس أرضية الضوضاء على ترددات مختلفة. أين هي الأدنى؟ ما المصادر التي تساهم في الضوضاء؟',ch3Title:'اختبار عرض النطاق',ch3Desc:'أرسل بيانات بعرض نطاق مختلف. كيف يؤثر ذلك على معدل البيانات وجودة الإشارة؟',codeTitle:'كود البداية',codeLang:'Python (RTL-SDR)',codeSnippet:'from rtlsdr import RtlSdr\\nimport numpy as np\\n\\nsdr = RtlSdr()\\nsdr.sample_rate = 2.048e6\\nsdr.center_freq = 100e6\\nsdr.gain = 40\\n\\nsamples = sdr.read_samples(256 * 1024)\\nspectrum = np.fft.fftshift(np.fft.fft(samples))\\npower_dB = 20 * np.log10(np.abs(spectrum))\\n\\nprint(f"Peak: {power_dB.max():.1f} dB")\\nsdr.close()',codeExplain:'يلتقط هذا الكود عينات IQ من جهاز RTL-SDR على 100 ميغاهرتز. تحويل FFT يحول العينات الزمنية إلى طيف ترددي. القدرة بالديسيبل تُظهر شدة الإشارة.',wiki_concept_title:'🔬 ما هو FM Pirate Radio؟',wiki_concept:'FM Pirate Radio هي تقنية تُستخدم في signal intelligence. في البيئات المهنية، تتطلب هذه التقنية HackRF One وتدريباً متخصصاً. هذه المحاكاة تتيح لك استكشاف نفس المبادئ بأمان في متصفحك.',wiki_howworks_title:'⚙️ كيف يعمل',wiki_howworks:'تعالج المحاكاة البيانات في الوقت الفعلي عبر مراحل متعددة. كل مرحلة تحوّل المدخلات باستخدام خوارزميات مبنية على مبادئ حقيقية من signal intelligence. يمكنك مراقبة النتائج الوسيطة في كل خطوة.',wiki_realworld_title:'🌍 التطبيقات الحقيقية',wiki_realworld:'FM Pirate Radio له تطبيقات عملية في signal intelligence. يستخدم المحترفون تقنيات مماثلة مع HackRF One. المبادئ المعروضة هنا تنطبق على العالم الحقيقي — نفس الرياضيات، نفس الفيزياء.',wiki_safety_title:'🛡️ الأمان والخصوصية',wiki_safety:'تعمل هذه المحاكاة بالكامل في متصفحك. لا تُرسل أي بيانات. لا حاجة لأي عتاد ولا شيء هنا يؤثر على أي نظام حقيقي. هذه بيئة تعلم آمنة — جرّب بحرية.',purpose:'FM Pirate Radio: Broadcast a tiny FM station from your browser. هذه المحاكاة تتيح لك التجريب العملي بدلاً من قراءة النظرية فقط. كل معامل تغيّره ينتج نتائج مرئية، مما يبني فهماً حقيقياً لسلوك النظام.',guideTitle:'ماذا أرى على الشاشة؟',guideCanvas:'المنطقة الرئيسية تعرض تصويراً مباشراً للمحاكاة. الألوان والحركة تمثل البيانات المتغيرة في الوقت الفعلي.',guideControls:'الأزرار أسفل الشاشة الرئيسية تتحكم في المحاكاة. بدء يشغلها، إيقاف يوقفها مؤقتاً، إعادة تعيين تمسح كل شيء.',guideSections:'أسفل البطاقة الرئيسية، الأقسام تعرض البيانات التفصيلية والتحليل. انقر على العناوين لطيها أو فتحها.',guideStatus:'النقطة الملونة في أعلى اليمين تُظهر الحالة. أخضر يعني يعمل، أحمر يعني متوقف.',
    wiki_history_title: '📜 تاريخ الاستخبارات الإلكترونية',
    wiki_history: 'Guglielmo Marconi transmitted the first transatlantic radio signal in 1901. Radio evolved from spark-gap transmitters to modern software-defined radios. يبني Fm Pirate Radio على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.',
    wiki_math_title: '📐 الرياضيات وراء Fm Pirate Radio',
    wiki_math: 'الرياضيات وراء Fm Pirate Radio: The Friis transmission equation calculates received power: Pr = Pt·Gt·Gr·(λ/4πd)². Signal strength decreases with the square of distance. Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise. QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
    wiki_advanced_title: '🔬 تقنيات متقدمة',
    wiki_advanced: 'بما يتجاوز الأساسيات في هذه المحاكاة، يستخدم ممارسو الاستخبارات الإلكترونية المتقدمون تقنيات متطورة. تضبط الخوارزميات التكيفية المعاملات تلقائياً. يصنف التعلم الآلي الإشارات بدقة عالية. يكتشف الارتباط متعدد القنوات أنماطاً غير مرئية للتحليل أحادي القناة. تجمع شبكات الاستشعار الموزعة البيانات من مواقع متعددة.',
    wiki_compare_title: '⚖️ مقارنة الأساليب',
    wiki_compare: 'هناك عدة أساليب في الاستخبارات الإلكترونية. توفر الحلول المادية باستخدام HackRF SDR أداءً في الوقت الفعلي. توفر المحاكاة البرمجية (مثل هذا التطبيق) تجربة آمنة بدون تكلفة المعدات. توفر المنصات السحابية قابلية التوسع لكنها تقدم تأخيراً ومخاوف تتعلق بالخصوصية. تمنحك هذه المحاكاة الأساس لاستخدام أي نهج بفعالية.',
    wiki_debug_title: '🔧 دليل استكشاف الأخطاء',
    wiki_debug: 'مشاكل شائعة في الاستخبارات الإلكترونية: (1) النتائج غير المتوقعة غالباً ما تأتي من إعدادات معاملات غير صحيحة — أعد التعيين وغير متغيراً واحداً في كل مرة. (2) إذا بدت الرسوم المتحركة متجمدة، تأكد أن المحاكاة تعمل. (3) القراءات المتقطعة تشير عادة إلى التداخل. (4) تحقق من وحداتك (هرتز مقابل كيلوهرتز مقابل ميغاهرتز).',
    wiki_ethics_title: '⚖️ الأخلاقيات والاعتبارات القانونية',
    wiki_ethics: 'الاستخبارات الإلكترونية يحمل مسؤوليات أخلاقية وقانونية مهمة. تنظم العديد من الدول استخدام HackRF SDR والمعدات المماثلة. احصل دائماً على إذن مناسب قبل اختبار أنظمة لا تملكها. احترم قوانين الخصوصية وحماية البيانات. هذه المحاكاة مصممة لأغراض تعليمية — تعرض المبادئ دون إرسال إشارات حقيقية أو الوصول لشبكات فعلية.',
    gloss1_term: 'Bandwidth',
    gloss1_def: 'The range of frequencies a signal occupies. Wider bandwidth allows more data but requires more spectrum. Measured in Hz (kHz, MHz, GHz).',
    gloss2_term: 'SNR',
    gloss2_def: 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    gloss3_term: 'Constellation Diagram',
    gloss3_def: 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    gloss4_term: 'Onion Routing',
    gloss4_def: 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    gloss5_term: 'Latency',
    gloss5_def: 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).',
    gloss6_term: 'Throughput',
    gloss6_def: 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.',
    theoryTitle: '📖 النظرية والخلفية',
    theory: 'Fm Pirate Radio يوضح المبادئ الأساسية في الاستخبارات الإلكترونية. Radio waves are electromagnetic radiation between 3 kHz and 300 GHz. They travel at the speed of light and can reflect, refract, and diffract around obstacles. Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission. Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase. تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون عبر سنوات من الخبرة العملية.',
    faq_q9: 'ما الأخطاء الشائعة التي يجب تجنبها؟',
    faq_a9: 'الخطأ الأكثر شيوعاً هو تغيير معاملات متعددة في وقت واحد مما يجعل فهم السبب والنتيجة مستحيلاً. غير دائماً شيئاً واحداً في كل مرة. خطأ شائع آخر هو تجاهل سجل النشاط — فهو يسجل كل حدث ويساعدك على فهم تسلسل العمليات. أخيراً لا تتخط قسم التحديات: تلك الأسئلة تختبر فهمك الحقيقي للمفاهيم.',
    faq_q10: 'كيف يرتبط هذا بـSIGINT في العالم الحقيقي؟',
    faq_a10: 'تحاكي هذه المحاكاة نفس الفيزياء والرياضيات المستخدمة في الأنظمة المهنية. تتوافق المعاملات التي تضبطها مع إعدادات المعدات الحقيقية. تعرض الرسوم البيانية أنماط بيانات مطابقة لما تراه على الأجهزة المهنية. الفرق الرئيسي هو أن هذا يعمل بأمان في متصفحك — تستخدم الأنظمة الحقيقية أجهزة HackRF SDR وقد تتطلب تراخيص قانونية للتشغيل.',
    glossTitle: '📚 مصطلحات أساسية',learnAge:'العمر:',relatedTitle:'\ud83d\udd17 تطبيقات ذات صلة',related1_name:'\\u0645\\u0631\\u0643\\u0632 \\u0627\\u0639\\u062a\\u0631\\u0627\\u0636 \\u0627\\u0644\\u0627\\u062a\\u0635\\u0627\\u0644\\u0627\\u062a',related1_desc:'\\u062c\\u0645\\u0639 \\u0627\\u0644\\u0627\\u0633\\u062a\\u062e\\u0628\\u0627\\u0631\\u0627\\u062a \\u0648\\u062a\\u062d\\u0644\\u064a\\u0644 \\u0627\\u0644\\u0625\\u0634\\u0627\\u0631\\u0627\\u062a',related1_path:'../../54-rf-warfare/rfw-comms-interception-hub/index.html',related2_name:'خط انابيب المستقبل',related2_desc:'DSP خطوة بخطوة: من الهوائي الى الصوت',related2_path:'../../33-sdr-learning/sdr-build-receiver/index.html',related3_name:'متتبع الراديو — ماسح الترددات',related3_desc:'امسح قنوات الراديو وحلّل أنماط حركة البيانات',related3_path:'../../07-net-microbit/bit-radio-sniffer/index.html',pathTitle:'\ud83d\udee4\ufe0f مسار التعلم',pathPrev_name:'رادار الطائرات — مستقبل ADS-B',pathPrev_path:'../../10-hrf-sigint/hrf-aircraft-radar/index.html',pathNext_name:'خريطة ابراج GSM',pathNext_path:'../../10-hrf-sigint/hrf-gsm-tower-mapper/index.html',
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'ما سرعة موجات الراديو في الفراغ؟',quiz_q1a:'سرعة الصوت',quiz_q1b:'سرعة الضوء',quiz_q1c:'نصف سرعة الضوء',quiz_q1d:'ضعف سرعة الضوء',quiz_q1_answer:'1',quiz_q2:'بماذا تُقاس التردد؟',quiz_q2a:'أمتار',quiz_q2b:'هرتز',quiz_q2c:'واط',quiz_q2d:'فولت',quiz_q2_answer:'1',quiz_q3:'ماذا تعني AI؟',quiz_q3a:'إدخال آلي',quiz_q3b:'الذكاء الاصطناعي',quiz_q3c:'واجهة تناظرية',quiz_q3d:'تكامل نشط',quiz_q3_answer:'1',quiz_q4:'ما هو التعلم الآلي؟',quiz_q4a:'برمجة الروبوتات',quiz_q4b:'أنظمة تتعلم من البيانات',quiz_q4c:'حساب يدوي',quiz_q4d:'تصميم العتاد',quiz_q4_answer:'1',quiz_q5:'ما وحدة قياس التردد الراديوي؟',quiz_q5a:'واط',quiz_q5b:'هرتز',quiz_q5c:'ديسيبل',quiz_q5d:'أوم',quiz_q5_answer:'1',realworldTitle:'🌍 قصص واقعية',realworld1:'كانت عملية آيفي بيلز في السبعينيات والثمانينيات مهمة مشتركة بين وكالة الأمن القومي والبحرية للتنصت على كابلات الاتصالات السوفيتية تحت البحر.',realworld2:'تبث محطات الأرقام رسائل مشفرة عبر الموجات القصيرة للعملاء الميدانيين منذ الحرب الباردة.',realworld3:'كشفت قضية ألدريتش أيمز (1994) كيف استخدم عميل مزدوج نقاط التسليم السرية لنقل معلومات استخبارية مصنفة للاتحاد السوفيتي لمدة عقد تقريبًا.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في مكافحة المراقبة معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في مكافحة المراقبة وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.',proTipTitle:'💡 نصائح احترافية',proTip1:'استخدم التنقل بين القنوات (1، 6، 11) لمسح الواي فاي — هذه هي القنوات غير المتداخلة الوحيدة في نطاق 2.4 جيجاهرتز وتلتقط 90% من حركة المرور.',proTip2:'أضف مكثفًا بسعة 10 ميكروفاراد عبر دبابيس الطاقة في ESP32. يسبب إرسال الواي فاي ذروات تيار يمكن أن تتسبب في تعطل اللوحة.',funFactTitle:'🎯 هل تعلم؟',funFact:'في عام 1945 أهدى أطفال سوفييت سفير الولايات المتحدة ختمًا خشبيًا يحتوي على جهاز تنصت سلبي. عمل لمدة 7 سنوات قبل اكتشافه.',mistakeTitle:'⚠️ أخطاء شائعة',mistake1:'تغيير عدة معلمات في وقت واحد يجعل من المستحيل عزل السبب والنتيجة. غيّر دائمًا متغيرًا واحدًا فقط في كل مرة.',mistake2:'تخطي القياس المرجعي. بدون معرفة السلوك الافتراضي لا يمكنك قياس تأثير تغييراتك على النظام.',mistake3:'تجاهل سجل النشاط. يسجل كل حدث مع طوابع زمنية — ضروري لفهم التسلسلات وتصحيح النتائج غير المتوقعة.'}
};

function printWorksheet(){const L=LANG[document.documentElement.lang||'en'];const w=window.open('','_blank');w.document.write('<html><head><title>'+L.title+' — Worksheet</title><style>body{font-family:sans-serif;max-width:800px;margin:2rem auto;padding:0 1rem;color:#333;}h1{border-bottom:2px solid #333;padding-bottom:0.5rem;}h2{color:#555;margin-top:1.5rem;border-bottom:1px solid #ccc;padding-bottom:0.3rem;}h3{color:#666;}p{line-height:1.6;}.question{background:#f5f5f5;padding:0.8rem;border-radius:6px;margin:0.5rem 0;}.glossary{display:grid;grid-template-columns:auto 1fr;gap:0.3rem 1rem;}.glossary dt{font-weight:700;}.footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #ccc;font-size:0.8rem;color:#888;text-align:center;}</style></head><body>');w.document.write('<h1>'+L.title+'</h1>');w.document.write('<p><em>'+L.subtitle+'</em></p>');w.document.write('<h2>Purpose</h2><p>'+(L.purpose||L.mainDesc)+'</p>');w.document.write('<h2>How It Works</h2>');for(let i=1;i<=4;i++){const s=L['step'+i+'Title'],d=L['step'+i+'Desc'];if(s&&d)w.document.write('<p><strong>Step '+i+': '+s+'</strong> — '+d+'</p>');}w.document.write('<h2>Key Concepts</h2>');for(let i=1;i<=6;i++){const t=L['gloss'+i+'_term'],d=L['gloss'+i+'_def'];if(t&&d)w.document.write('<p><strong>'+t+':</strong> '+d+'</p>');}w.document.write('<h2>Challenges</h2>');for(let i=1;i<=3;i++){const c=L['challenge'+i]||L['ch'+i+'Desc'];if(c)w.document.write('<div class="question">'+i+'. '+c+'</div>');}w.document.write('<h2>Theory</h2><p>'+(L.theory||'')+'</p>');w.document.write('<div class="footer">Workshop DIY — '+L.title+' — Printed Worksheet</div>');w.document.write('</body></html>');w.document.close();w.print();}


/* Keyboard shortcuts */
document.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA'||e.target.tagName==='SELECT')return;const k=e.key.toLowerCase();if(k==='?'||k==='h'){e.preventDefault();const hp=$('helpPanel');if(hp)hp.classList.toggle('open');}if(k==='escape'){document.querySelectorAll('.sidebar.open').forEach(s=>s.classList.remove('open'));}if(k==='s'&&!e.ctrlKey){const b=document.querySelector('[id*="start"],[id*="Start"]');if(b)b.click();}if(k==='r'&&!e.ctrlKey){const b=document.querySelector('[id*="reset"],[id*="Reset"]');if(b)b.click();}if(k>='1'&&k<='9'){const tabs=document.querySelectorAll('.help-tab');const i=parseInt(k)-1;if(tabs[i])tabs[i].click();}});

/* Achievement badges */
const ACHIEVEMENTS={explorer:{icon:'🗺️',check:()=>document.querySelectorAll('.help-tab.visited').length>=4},scientist:{icon:'🔬',check:()=>document.querySelectorAll('.challenge-answer.visible').length>=2},experimenter:{icon:'⚗️',check:()=>(window._paramChanges||0)>=5}};const achKey='ach_'+location.pathname;function checkAchievements(){const done=JSON.parse(localStorage.getItem(achKey)||'{}');let newBadge=false;Object.entries(ACHIEVEMENTS).forEach(([k,v])=>{if(!done[k]&&v.check()){done[k]=Date.now();newBadge=true;}});if(newBadge){localStorage.setItem(achKey,JSON.stringify(done));updateBadgeDisplay(done);}}function updateBadgeDisplay(done){let el=$('achievementBadges');if(!el)return;el.innerHTML=Object.entries(ACHIEVEMENTS).map(([k,v])=>'<span title="'+k+'" style="font-size:1.5rem;opacity:'+(done[k]?'1':'0.2')+';margin:0 0.2rem;">'+v.icon+'</span>').join('');}document.querySelectorAll('.help-tab').forEach(t=>t.addEventListener('click',()=>{t.classList.add('visited');checkAchievements();}));setInterval(checkAchievements,5000);document.addEventListener('input',()=>{window._paramChanges=(window._paramChanges||0)+1;});document.addEventListener('DOMContentLoaded',()=>{const done=JSON.parse(localStorage.getItem(achKey)||'{}');updateBadgeDisplay(done);});


function startQuiz(){const L=LANG[document.documentElement.lang||'en'];const qs=[];for(let i=1;i<=5;i++){const q=L['quiz_q'+i];if(!q)continue;qs.push({q,opts:[L['quiz_q'+i+'a'],L['quiz_q'+i+'b'],L['quiz_q'+i+'c'],L['quiz_q'+i+'d']],ans:parseInt(L['quiz_q'+i+'_answer']||0)});}let score=0,idx=0;const cont=$('quizContainer'),sc=$('quizScore');if(!cont)return;sc.style.display='none';function show(){if(idx>=qs.length){sc.style.display='';$('quizScoreText').textContent=(L.quizScore||'Score')+': '+score+'/'+qs.length;return;}const q=qs[idx];cont.innerHTML='<p style="font-weight:700;margin-bottom:0.8rem;">'+(idx+1)+'. '+q.q+'</p>'+q.opts.map((o,i)=>'<button class="btn-sm quiz-opt" style="display:block;width:100%;text-align:left;margin:0.3rem 0;padding:0.6rem;" data-idx="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>').join('');cont.querySelectorAll('.quiz-opt').forEach(b=>{b.onclick=()=>{const picked=parseInt(b.dataset.idx);if(picked===q.ans){score++;b.style.background='rgba(0,200,0,0.3)';}else{b.style.background='rgba(200,0,0,0.3)';cont.querySelectorAll('.quiz-opt')[q.ans].style.background='rgba(0,200,0,0.3)';}cont.querySelectorAll('.quiz-opt').forEach(x=>x.onclick=null);setTimeout(()=>{idx++;show();},1200);}});}show();}
let currentLang = 'en';

function setLanguage(lang) {
  currentLang = lang;
  const s = LANG[lang]; if (!s) return;
  document.querySelectorAll('[data-i18n]').forEach(el => { const k=el.dataset.i18n; if(s[k]!=null) el.textContent=s[k]; });
  document.querySelectorAll('[data-i18n-opt]').forEach(opt => { const k=opt.dataset.i18nOpt; if(s[k]!=null) opt.textContent=s[k]; });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k=el.dataset.i18nPlaceholder; if(s[k]!=null) el.placeholder=s[k]; });
  document.title = `${s.title} \u2014 Workshop DIY`;
  document.documentElement.dir = lang==='ar'?'rtl':'ltr';
  document.documentElement.lang = lang;
  const sel=$('langSelect'); if(sel) sel.value=lang;
  try{localStorage.setItem('wdiy-lang',lang);}catch{}
  log(s.langChanged,'info');
  buildGuide(); buildHistory();
}

/* ═══════ THEMES ═══════ */
const THEME_MELODIES = {
  'mosque-gold':[330,392,523],'zellige':[440,523,659],'andalus':[294,370,440],
  'space':[523,659,784],'jungle':[262,330,392],'robot':[440,554,659],
  'riad':[349,440,523],'medina':[294,349,440]
};
function setTheme(name) {
  document.documentElement.dataset.theme=name;
  document.documentElement.classList.toggle('light-theme',LIGHT_THEMES.includes(name));
  const sel=$('themeSelect'); if(sel) sel.value=name;
  try{localStorage.setItem('wdiy-theme',name);}catch{}
  playThemeMelody(name);
  const s=LANG[currentLang]; log(`${s.themeChanged} ${s['t_'+name]||name}`,'info');
}
function playThemeMelody(n){
  if(!soundEnabled)return; if(!audioCtx)audioCtx=new AudioCtx();
  const notes=THEME_MELODIES[n]; if(!notes)return; const t=audioCtx.currentTime;
  notes.forEach((f,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);o.type='sine';o.frequency.value=f;g.gain.value=0.06;g.gain.exponentialRampToValueAtTime(0.001,t+0.2+i*0.15+0.15);o.start(t+i*0.15);o.stop(t+i*0.15+0.2);});
}

/* ═══════ LOG ═══════ */
let logContainer;
function log(msg,type='info'){
  if(!logContainer)logContainer=$('logContainer'); if(!logContainer)return;
  const d=document.createElement('div'); d.className=`log-line ${type}`;
  d.textContent=`[${new Date().toLocaleTimeString()}] ${msg}`;
  logContainer.appendChild(d); logContainer.scrollTop=logContainer.scrollHeight;
  if(type==='success')playSound('success'); else if(type==='error')playSound('error');
  applyLogFilter();
}
function clearLog(){if(!logContainer)logContainer=$('logContainer');if(logContainer)logContainer.innerHTML='';log(LANG[currentLang].logCleared);}
async function copyLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');try{await navigator.clipboard.writeText(t);log(LANG[currentLang].copied,'success');}catch{log(LANG[currentLang].copyFail,'error');}}
function exportLog(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;const t=Array.from(logContainer.children).map(d=>d.textContent).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=`log-${new Date().toISOString().slice(0,10)}.txt`;a.click();URL.revokeObjectURL(u);}

/* ═══════ LOG FILTERS ═══════ */
let activeLogFilter='all';
function initLogFilters(){document.querySelectorAll('.log-filter').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.log-filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');activeLogFilter=btn.dataset.filter;applyLogFilter();});});}
function applyLogFilter(){if(!logContainer)logContainer=$('logContainer');if(!logContainer)return;Array.from(logContainer.children).forEach(line=>{if(activeLogFilter==='all'){line.style.display='';return;}line.style.display=line.classList.contains(activeLogFilter)?'':'none';});}

/* ═══════ TOAST ═══════ */
let toastTimer=null;
function showToast(msg,ms=0){const el=$('toastIndicator'),t=$('toastMessage');if(el&&t){t.textContent=msg||LANG[currentLang].working;el.style.display='block';}if(toastTimer)clearTimeout(toastTimer);if(ms>0)toastTimer=setTimeout(hideToast,ms);}
function hideToast(){const el=$('toastIndicator');if(el)el.style.display='none';if(toastTimer){clearTimeout(toastTimer);toastTimer=null;}}

/* ═══════ STATUS ═══════ */
function setStatus(c){const p=$('statusPill'),t=$('statusText'),s=LANG[currentLang];if(t)t.textContent=c?s.connected:s.disconnected;if(p)p.classList.toggle('connected',c);}

/* ═══════ SPLASH ═══════ */
let splashTimer;
function dismissSplash(){const s=$('splash');if(!s)return;s.classList.add('hidden');if(splashTimer)clearTimeout(splashTimer);setTimeout(()=>s.remove(),600);playSound('click');}
function initSplash(){const s=$('splash');if(!s)return;const sl=$('splashLogo');if(sl)sl.innerHTML=LOGO_SVG;splashTimer=setTimeout(dismissSplash,2500);}

/* ═══════ PANELS ═══════ */
function openPanel(pid,oid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.add('open');if(ov)ov.classList.add('open');}
function closePanel(pid,oid,rid){const sb=$(pid),ov=$(oid);if(sb)sb.classList.remove('open');if(ov)ov.classList.remove('open');const btn=$(rid);if(btn)btn.focus();}
function openHelp(){openPanel('helpPanel','helpOverlay');}
function closeHelp(){closePanel('helpPanel','helpOverlay','helpBtn');}
let logWasOpen=false;
function openSettings(){const l=$('logPanel');logWasOpen=l&&l.classList.contains('open');if(logWasOpen)closeLog();openPanel('settingsPanel','settingsOverlay');}
function closeSettings(){closePanel('settingsPanel','settingsOverlay','settingsBtn');if(logWasOpen){openLog();logWasOpen=false;}}
function openLog(){const sb=$('logPanel');if(sb)sb.classList.add('open');document.body.classList.add('log-open');}
function closeLog(){const sb=$('logPanel');if(sb)sb.classList.remove('open');document.body.classList.remove('log-open');}
function toggleLog(){const sb=$('logPanel');if(sb&&sb.classList.contains('open'))closeLog();else openLog();}
function closeAllPanels(){closeHelp();closeSettings();closeLog();}
function initHelpTabs(){const tabs=document.querySelectorAll('.help-tab'),contents=document.querySelectorAll('.help-content');tabs.forEach(tab=>{tab.addEventListener('click',()=>{tabs.forEach(t=>t.classList.remove('active'));contents.forEach(c=>c.classList.remove('active'));tab.classList.add('active');const n=tab.dataset.tab;const tid='help'+n.charAt(0).toUpperCase()+n.slice(1);const tgt=$(tid);if(tgt)tgt.classList.add('active');});});}

/* ═══════ LOG RESIZE ═══════ */
function initLogResize(){
  const handle=$('logResizeHandle'),panel=$('logPanel');if(!handle||!panel)return;
  let dragging=false,startX,startW;const isRtl=()=>document.documentElement.dir==='rtl';
  handle.addEventListener('mousedown',e=>{dragging=true;startX=e.clientX;startW=panel.offsetWidth;handle.classList.add('active');document.body.style.cursor='col-resize';document.body.style.userSelect='none';e.preventDefault();});
  document.addEventListener('mousemove',e=>{if(!dragging)return;const dx=isRtl()?(e.clientX-startX):(startX-e.clientX);const nw=Math.max(200,Math.min(startW+dx,window.innerWidth*0.6));document.documentElement.style.setProperty('--log-width',nw+'px');});
  document.addEventListener('mouseup',()=>{if(!dragging)return;dragging=false;handle.classList.remove('active');document.body.style.cursor='';document.body.style.userSelect='';});
}

/* ═══════ BREATHING + DHIKR ═══════ */
let breathingActive=false,dhikrCount=0;
function toggleBreathing(){const bands=document.querySelectorAll('.deco-band');breathingActive=!breathingActive;if(breathingActive){bands.forEach(b=>b.classList.add('breathing'));log('Breathing guide on','info');}else{bands.forEach(b=>b.classList.remove('breathing'));log('Breathing guide off','info');}}
function incrementDhikr(){if(!breathingActive)return;dhikrCount++;playSound('click');const c=$('dhikrCounter');if(c)c.textContent=dhikrCount;}

/* ═══════ HIJRI DATE ═══════ */
function initHijriDate(){const el=$('hijriDate');if(!el)return;try{el.textContent=new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch{}}

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}

/* ═══════════════════════════════════════════════════════════════
   APP-SPECIFIC: FM PIRATE RADIO SIMULATION
   ═══════════════════════════════════════════════════════════════ */

let broadcasting = false;
let fmFreqMHz = 98.0;
let audioMode = 'tts'; // 'tts' or 'tone'
let toneHz = 440;
let toneWaveform = 'sine';
let vuAnimFrame = null;
let fmModAnimFrame = null;
let waveAnimFrame = null;

/* Audio engine */
let toneOsc = null, toneGain = null;
let analyser = null;
let audioSourceNode = null;

/* Canvases */
let dialCanvas, dialCtx;
let vuCanvas, vuCtx;
let waveCanvas, waveCtx;
let fmModCanvas, fmModCtx;

/* Simulated audio level */
let simLevel = 0;
let simPhase = 0;

function drawDial() {
  if (!dialCtx) return;
  const w = dialCanvas.width, h = dialCanvas.height;
  dialCtx.clearRect(0, 0, w, h);

  // Background
  dialCtx.fillStyle = 'rgba(0,0,0,0.3)';
  dialCtx.fillRect(0, 0, w, h);

  // Dial markings
  const fMin = 87.5, fMax = 108.0;
  const majorStep = 2, minorStep = 0.5;

  for (let f = fMin; f <= fMax; f += minorStep) {
    const x = ((f - fMin) / (fMax - fMin)) * (w - 40) + 20;
    const isMajor = Math.abs(f - Math.round(f / majorStep) * majorStep) < 0.01;

    dialCtx.beginPath();
    dialCtx.strokeStyle = isMajor ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)';
    dialCtx.lineWidth = isMajor ? 2 : 1;
    dialCtx.moveTo(x, h - 10);
    dialCtx.lineTo(x, h - (isMajor ? 50 : 30));
    dialCtx.stroke();

    if (isMajor) {
      dialCtx.fillStyle = 'rgba(255,255,255,0.6)';
      dialCtx.font = '11px sans-serif';
      dialCtx.textAlign = 'center';
      dialCtx.fillText(f.toFixed(0), x, h - 55);
    }
  }

  // Needle
  const nx = ((fmFreqMHz - fMin) / (fMax - fMin)) * (w - 40) + 20;
  dialCtx.beginPath();
  dialCtx.strokeStyle = broadcasting ? '#ff3333' : 'var(--accent, #d4a03c)';
  dialCtx.lineWidth = 3;
  dialCtx.moveTo(nx, h - 5);
  dialCtx.lineTo(nx, 10);
  dialCtx.stroke();

  // Needle glow
  dialCtx.beginPath();
  dialCtx.arc(nx, 8, 4, 0, Math.PI * 2);
  dialCtx.fillStyle = broadcasting ? '#ff3333' : '#d4a03c';
  dialCtx.fill();

  // Station names at known frequencies
  const stations = [
    {f:88.9,name:'NPR'},{f:92.3,name:'ROCK'},{f:95.5,name:'POP'},
    {f:98.7,name:'JAZZ'},{f:101.1,name:'TALK'},{f:104.3,name:'HITS'},{f:107.5,name:'R&B'}
  ];
  stations.forEach(s => {
    const sx = ((s.f - fMin) / (fMax - fMin)) * (w - 40) + 20;
    dialCtx.fillStyle = 'rgba(255,200,50,0.5)';
    dialCtx.font = '9px sans-serif';
    dialCtx.textAlign = 'center';
    dialCtx.fillText(s.name, sx, 28);
  });
}

function drawVU() {
  if (!vuCtx) return;
  const w = vuCanvas.width, h = vuCanvas.height;
  vuCtx.clearRect(0, 0, w, h);
  vuCtx.fillStyle = 'rgba(0,0,0,0.3)';
  vuCtx.fillRect(0, 0, w, h);

  const level = broadcasting ? simLevel : 0;
  const bars = 30;
  const barW = (w - 10) / bars;

  for (let i = 0; i < bars; i++) {
    const threshold = i / bars;
    const active = level > threshold;
    let color;
    if (i < bars * 0.6) color = active ? '#22c55e' : 'rgba(34,197,94,0.15)';
    else if (i < bars * 0.8) color = active ? '#eab308' : 'rgba(234,179,8,0.15)';
    else color = active ? '#ef4444' : 'rgba(239,68,68,0.15)';

    vuCtx.fillStyle = color;
    vuCtx.fillRect(5 + i * barW, 8, barW - 2, h - 16);
  }

  // dB labels
  vuCtx.fillStyle = 'rgba(255,255,255,0.4)';
  vuCtx.font = '9px sans-serif';
  vuCtx.textAlign = 'center';
  vuCtx.fillText('-20', w * 0.15, h - 2);
  vuCtx.fillText('-6', w * 0.55, h - 2);
  vuCtx.fillText('0', w * 0.78, h - 2);
  vuCtx.fillText('+3', w * 0.93, h - 2);
}

function drawWaveform() {
  if (!waveCtx) return;
  const w = waveCanvas.width, h = waveCanvas.height;
  waveCtx.clearRect(0, 0, w, h);

  if (!broadcasting) return;

  waveCtx.beginPath();
  waveCtx.strokeStyle = '#22c55e';
  waveCtx.lineWidth = 1.5;

  for (let x = 0; x < w; x++) {
    const t = x / w * Math.PI * 8 + simPhase;
    const y = h / 2 + Math.sin(t) * simLevel * h * 0.4 +
              Math.sin(t * 2.3) * simLevel * h * 0.15;
    if (x === 0) waveCtx.moveTo(x, y); else waveCtx.lineTo(x, y);
  }
  waveCtx.stroke();
}

function drawFMMod() {
  if (!fmModCtx) return;
  const w = fmModCanvas.width, h = fmModCanvas.height;
  fmModCtx.clearRect(0, 0, w, h);
  fmModCtx.fillStyle = 'rgba(0,0,0,0.2)';
  fmModCtx.fillRect(0, 0, w, h);

  const third = h / 3;

  // Labels
  fmModCtx.fillStyle = 'rgba(255,255,255,0.5)';
  fmModCtx.font = '10px sans-serif';
  fmModCtx.fillText('Audio Signal', 5, 14);
  fmModCtx.fillText('Carrier', 5, third + 14);
  fmModCtx.fillText('FM Modulated', 5, third * 2 + 14);

  const amp = broadcasting ? simLevel : 0.3;

  // Audio signal (baseband)
  fmModCtx.beginPath();
  fmModCtx.strokeStyle = '#22c55e';
  fmModCtx.lineWidth = 1.5;
  for (let x = 0; x < w; x++) {
    const t = x / w * Math.PI * 6 + simPhase * 0.5;
    const y = third * 0.5 + Math.sin(t) * amp * third * 0.35;
    if (x === 0) fmModCtx.moveTo(x, y); else fmModCtx.lineTo(x, y);
  }
  fmModCtx.stroke();

  // Carrier (pure sine)
  fmModCtx.beginPath();
  fmModCtx.strokeStyle = '#3b82f6';
  fmModCtx.lineWidth = 1;
  for (let x = 0; x < w; x++) {
    const t = x / w * Math.PI * 40;
    const y = third + third * 0.5 + Math.sin(t) * third * 0.3;
    if (x === 0) fmModCtx.moveTo(x, y); else fmModCtx.lineTo(x, y);
  }
  fmModCtx.stroke();

  // FM modulated (frequency varies with audio)
  fmModCtx.beginPath();
  fmModCtx.strokeStyle = '#f59e0b';
  fmModCtx.lineWidth = 1.5;
  let phase = 0;
  for (let x = 0; x < w; x++) {
    const t = x / w * Math.PI * 6 + simPhase * 0.5;
    const audioVal = Math.sin(t) * amp;
    const carrierFreq = 40 + audioVal * 20;
    phase += carrierFreq / w * Math.PI;
    const y = third * 2 + third * 0.5 + Math.sin(phase) * third * 0.3;
    if (x === 0) fmModCtx.moveTo(x, y); else fmModCtx.lineTo(x, y);
  }
  fmModCtx.stroke();

  // Center lines
  [third * 0.5, third * 1.5, third * 2.5].forEach(y => {
    fmModCtx.beginPath();
    fmModCtx.strokeStyle = 'rgba(255,255,255,0.1)';
    fmModCtx.setLineDash([4, 4]);
    fmModCtx.moveTo(0, y);
    fmModCtx.lineTo(w, y);
    fmModCtx.stroke();
    fmModCtx.setLineDash([]);
  });
}

function simLoop() {
  if (broadcasting) {
    simPhase += 0.08;
    if (audioMode === 'tts') {
      simLevel = 0.4 + Math.sin(Date.now() / 300) * 0.2 + Math.sin(Date.now() / 700) * 0.15 + Math.random() * 0.1;
    } else {
      simLevel = 0.5 + Math.sin(Date.now() / 500) * 0.1 + Math.random() * 0.05;
    }
    simLevel = Math.max(0, Math.min(1, simLevel));
  } else {
    simLevel *= 0.95;
  }

  drawVU();
  drawWaveform();
  drawFMMod();
  vuAnimFrame = requestAnimationFrame(simLoop);
}

function goLive() {
  if (broadcasting) return;
  broadcasting = true;
  $('goLiveBtn').disabled = true;
  $('stopLiveBtn').disabled = false;
  setStatus(true);
  const bs = $('broadcastStatus');
  if (bs) { bs.textContent = LANG[currentLang].onAir; bs.style.color = '#ef4444'; bs.style.fontWeight = 'bold'; }
  drawDial();
  log(`ON AIR at ${fmFreqMHz.toFixed(1)} MHz [${audioMode.toUpperCase()}]`, 'tx');
  playSound('success');

  if (audioMode === 'tts') {
    const text = $('ttsText')?.value || 'Hello from pirate radio!';
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.9; u.pitch = 1;
      speechSynthesis.speak(u);
      log(`TTS: "${text}"`, 'tx');
    }
  }
}

function stopLive() {
  broadcasting = false;
  $('goLiveBtn').disabled = false;
  $('stopLiveBtn').disabled = true;
  setStatus(false);
  const bs = $('broadcastStatus');
  if (bs) { bs.textContent = LANG[currentLang].offAir; bs.style.color = ''; bs.style.fontWeight = ''; }
  drawDial();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  log('OFF AIR', 'info');
}

function buildGuide() {
  const el = $('fmGuide');
  if (!el) return;
  const s = LANG[currentLang];
  el.innerHTML = `<strong>${s.guideTitle}</strong><br><br>${s.guideP1}<br><br>${s.guideP2}<br><br>${s.guideP3}`;
}

function buildHistory() {
  const el = $('pirateHistory');
  if (!el) return;
  const s = LANG[currentLang];
  el.innerHTML = `<strong>${s.histTitle}</strong><br><br>` +
    '<div style="display:grid;grid-template-columns:1fr 1fr 2fr;gap:4px 8px;">' +
    '<strong style="font-size:.7rem;">Name</strong><strong style="font-size:.7rem;">Era</strong><strong style="font-size:.7rem;">Notes</strong>' +
    '<span>Radio Caroline</span><span style="color:var(--accent);">1964</span><span style="color:var(--text-muted);">Ship-based, North Sea, UK pop music revolution</span>' +
    '<span>Radio Luxembourg</span><span style="color:var(--accent);">1933</span><span style="color:var(--text-muted);">Long-wave commercial broadcaster</span>' +
    '<span>Radio Veronica</span><span style="color:var(--accent);">1960</span><span style="color:var(--text-muted);">Dutch offshore pirate station</span>' +
    '<span>WFMU</span><span style="color:var(--accent);">1958</span><span style="color:var(--text-muted);">Freeform community radio, NJ</span>' +
    '<span>Micro FM</span><span style="color:var(--accent);">2000s</span><span style="color:var(--text-muted);">Low-power FM movement worldwide</span>' +
    '</div>';
}

/* ═══════ INIT ═══════ */
function init() {
  initSplash();
  const lw=$('logoWrap'); if(lw) lw.innerHTML=LOGO_SVG;

  const cb=$('clearLogBtn'),cpb=$('copyLogBtn'),exb=$('exportLogBtn');
  if(cb)cb.onclick=clearLog; if(cpb)cpb.onclick=copyLog; if(exb)exb.onclick=exportLog;
  initLogFilters();

  const hBtn=$('helpBtn'),hClose=$('helpCloseBtn'),hOv=$('helpOverlay');
  if(hBtn)hBtn.onclick=openHelp; if(hClose)hClose.onclick=closeHelp; if(hOv)hOv.onclick=closeHelp;
  initHelpTabs();

  const sBtn=$('settingsBtn'),sClose=$('settingsCloseBtn'),sOv=$('settingsOverlay');
  if(sBtn)sBtn.onclick=openSettings; if(sClose)sClose.onclick=closeSettings; if(sOv)sOv.onclick=closeSettings;

  const lBtn=$('logBtn'),lClose=$('logCloseBtn');
  if(lBtn)lBtn.onclick=toggleLog; if(lClose)lClose.onclick=closeLog;
  initLogResize();

  const soundTgl=$('soundToggle');
  if(soundTgl){try{soundEnabled=localStorage.getItem('wdiy-sound')==='true';}catch{}soundTgl.checked=soundEnabled;soundTgl.addEventListener('change',()=>{soundEnabled=soundTgl.checked;try{localStorage.setItem('wdiy-sound',soundEnabled);}catch{}if(soundEnabled)playSound('click');});}

  const breathBtn=$('breathingBtn'),dhikrDisp=$('dhikrDisplay'),dhikrBtn=$('dhikrBtn');
  if(breathBtn)breathBtn.onclick=()=>{toggleBreathing();if(dhikrDisp)dhikrDisp.style.display=breathingActive?'flex':'none';};
  if(dhikrBtn)dhikrBtn.onclick=incrementDhikr;

  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeAllPanels();});

  const langSel=$('langSelect'); if(langSel)langSel.addEventListener('change',()=>setLanguage(langSel.value));
  const themeSel=$('themeSelect'); if(themeSel)themeSel.addEventListener('change',()=>setTheme(themeSel.value));

  try{const sl=localStorage.getItem('wdiy-lang'),st=localStorage.getItem('wdiy-theme');if(st)setTheme(st);if(sl)setLanguage(sl);}catch{}

  initHijriDate();

  /* ═══ FM PIRATE RADIO SETUP ═══ */
  dialCanvas = $('dialCanvas');
  vuCanvas = $('vuCanvas');
  waveCanvas = $('waveformCanvas');
  fmModCanvas = $('fmModCanvas');
  if (dialCanvas) dialCtx = dialCanvas.getContext('2d');
  if (vuCanvas) vuCtx = vuCanvas.getContext('2d');
  if (waveCanvas) waveCtx = waveCanvas.getContext('2d');
  if (fmModCanvas) fmModCtx = fmModCanvas.getContext('2d');

  // FM frequency slider
  const fmSlider = $('fmFreq'), freqDisp = $('freqDisplay');
  if (fmSlider) fmSlider.addEventListener('input', () => {
    fmFreqMHz = parseInt(fmSlider.value) / 10;
    if (freqDisp) freqDisp.textContent = fmFreqMHz.toFixed(1);
    drawDial();
    log(`Tuned to ${fmFreqMHz.toFixed(1)} MHz`, 'info');
  });

  // Audio source buttons
  const srcTTS = $('srcTTS'), srcTone = $('srcTone');
  const ttsPanel = $('ttsPanel'), tonePanel = $('tonePanel');
  if (srcTTS) srcTTS.onclick = () => {
    audioMode = 'tts';
    srcTTS.classList.add('primary'); srcTone.classList.remove('primary');
    if (ttsPanel) ttsPanel.style.display = '';
    if (tonePanel) tonePanel.style.display = 'none';
    log('Audio source: TTS', 'info');
  };
  if (srcTone) srcTone.onclick = () => {
    audioMode = 'tone';
    srcTone.classList.add('primary'); srcTTS.classList.remove('primary');
    if (ttsPanel) ttsPanel.style.display = 'none';
    if (tonePanel) tonePanel.style.display = '';
    log('Audio source: Tone Generator', 'info');
  };

  // Tone controls
  const toneSlider = $('toneFreqSlider'), toneVal = $('toneFreqVal');
  if (toneSlider) toneSlider.addEventListener('input', () => {
    toneHz = parseInt(toneSlider.value);
    if (toneVal) toneVal.textContent = toneHz + ' Hz';
  });

  // TTS speak button
  const ttsSpeak = $('ttsSpeak');
  if (ttsSpeak) ttsSpeak.onclick = () => {
    if (!broadcasting) { log('Go LIVE first to broadcast TTS', 'error'); return; }
    const text = $('ttsText')?.value || 'Hello from pirate radio!';
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(u);
      log(`TTS: "${text}"`, 'tx');
    }
  };

  // Broadcast controls
  const goBtn = $('goLiveBtn'), stopBtn = $('stopLiveBtn');
  if (goBtn) goBtn.onclick = goLive;
  if (stopBtn) stopBtn.onclick = stopLive;

  drawDial();
  buildGuide();
  buildHistory();
  simLoop();

  log(LANG[currentLang].ready, 'success');
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();


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
function setupLinks(){const L=LANG[document.documentElement.lang||'en'];['related1','related2','related3'].forEach(k=>{const a=document.getElementById(k+'Link');if(a&&L[k+'_path'])a.href=L[k+'_path'];});const pp=document.getElementById('pathPrevLink'),pn=document.getElementById('pathNextLink');if(pp&&L.pathPrev_path)pp.href=L.pathPrev_path;if(pn&&L.pathNext_path)pn.href=L.pathNext_path;if(pp&&!L.pathPrev_path)document.getElementById('pathPrevP').style.display='none';if(pn&&!L.pathNext_path)document.getElementById('pathNextP').style.display='none';}document.addEventListener('DOMContentLoaded',setupLinks);
