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
    diffTitle:'Difficulty',diffBeginner:'🟢 Beginner',diffIntermediate:'🟡 Intermediate',diffExpert:'🔴 Expert',diffInfo:'Choose your complexity level',spacedTitle:'📅 Spaced Review',spacedReview:'Review',spacedNext:'Next review',spacedMastered:'Mastered',spacedNew:'New — not yet studied',spacedDue:'Due for review!',spacedInfo:'Smart review reminders based on the forgetting curve',
    
    missionTitle:'MISSION BRIEFING',missionClassified:'CLASSIFIED',missionObjective:'Your mission objective:',missionAgent:'AGENT-3CBCF9',missionSkip:'Skip',missionGo:'ACCEPT MISSION',mission_obj:'Explore and master FM Pirate Radio \u2014 analyze, experiment, and complete all challenges.',nightVisionTitle:'Night Vision Mode',nightVisionOn:'NV ON',nightVisionOff:'NV OFF',nightVisionAuto:'Auto NV',
    termTitle:'>_ Terminal',termPlaceholder:'Type a command...',termHelp:'Commands: help, start, stop, reset, theme [name], lang [en|fr|ar], set [param] [value], get [param], list, export, clear, status, about, cipher',termUnknown:'Unknown command. Type help for available commands.',termWelcome:'Terminal ready. Type help to get started.',cipherTitle:'🔐 Cipher Toolkit',cipherInput:'Input text',cipherOutput:'Output',cipherEncode:'Encode',cipherDecode:'Decode',cipherMethod:'Method',cipherKey:'Key',cipherCopy:'Copy',
    
    particleTitle:'ð Particles',particleToggle:'Toggle Particles',compareTitle:'ð Compare',compareSave:'Save',compareLoad:'Load',compareDiff:'Difference',compareClear:'Clear',compareSlotA:'Experiment A',compareSlotB:'Experiment B',compareResult:'Comparison Result',
    
    
    labTitle:'ð Lab Notebook',labGenerate:'ð Lab Report',labExport:'Export Report',labHypothesis:'HYPOTHESIS',labMethod:'METHOD',labObservation:'OBSERVATIONS',labConclusion:'CONCLUSION',labSession:'Session',recorderTitle:'âº Data Recorder',recorderStart:'âº Record',recorderStop:'â¹ Stop',recorderClear:'Clear',recorderExport:'Export CSV',recorderPoints:'pts',recorderGraph:'Graph',
    voiceTitle:'🎤 Voice',voiceOn:'Voice ON',voiceOff:'Voice OFF',voiceListening:'Listening...',voiceCmd:'Command recognised',voiceHelp:'Say: start, stop, reset, help, theme, next, previous',voice_cmds:'start / stop / reset / help / theme / next / previous',shareTitle:'📤 Share',shareBtn:'📤 Share',shareCopied:'Copied to clipboard!',shareGenerate:'Generate Summary',shareExport:'Export JSON',
    
    
    dailyTitle:'📅 Daily Challenge',dailyChallenge:'Today\x27s Challenge',dailyHint:'Show Hint',dailyStreak:'Streak',dailyComplete:'Mark Complete',daily_d1:'Explain how Hrf Fm Pirate Radio works to a friend in under 60 seconds.',daily_d2:'Find 3 real-world applications of Hrf Sigint concepts shown here.',daily_d3:'Change one parameter to its extreme value and document what happens.',daily_d4:'Draw a diagram showing the data flow in this Hrf Sigint simulation.',daily_d5:'Write pseudocode for the main algorithm used in this app.',daily_d6:'Compare results at default vs modified settings and note 3 differences.',daily_d7:'Create a hypothesis about what happens if you double the main parameter, then test it.',mentorTitle:'🎓 Guided Tutorial',mentorStart:'Start Tutorial',mentorNext:'Next',mentorPrev:'Previous',mentorDone:'Finish',mentorStep:'Step',mentor_s1:'Look at the main visualization area — this is where the simulation runs in real time.',mentor_s2:'Press Start to begin the simulation. Watch how the display reacts to your input.',mentor_s3:'Try adjusting one slider — watch how it affects the output immediately.',mentor_s4:'Open the Help panel and explore the Wiki tab for deeper knowledge.',mentor_s5:'Complete one challenge to test your understanding of the concepts.',
    sonifyTitle:'🔊 Data Sonification',sonifyOn:'Sonification ON',sonifyOff:'Sonification OFF',sonifyFreq:'Frequency',sonifyVol:'Volume',sonifyWave:'Waveform',sonifyInfo:'Turn data into sound',
    tooltipTitle:'Smart Tooltips',tooltipToggle:'Toggle Tooltips',tip_start:'Start the simulation and watch the visualization come alive',tip_stop:'Pause the simulation while preserving current state',tip_reset:'Clear all data and return to initial conditions',tip_slider:'Drag to adjust this parameter — the visualization updates in real time',tip_theme:'Switch between 8 visual themes including 2 light Islamic designs',tip_help:'Open the help panel with FAQ, guides, wiki, and challenges',explorerTitle:'Parameter Space Explorer',explorerStart:'Auto-Explore',explorerStop:'Stop Exploration',explorerProgress:'Exploring combinations...',explorerResult:'Exploration Complete',explorerInfo:'Systematically tests min/mid/max for each slider and records results',
    
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
    diffTitle:'Difficulté',diffBeginner:'🟢 Débutant',diffIntermediate:'🟡 Intermédiaire',diffExpert:'🔴 Expert',diffInfo:'Choisissez votre niveau de complexité',spacedTitle:'📅 Révision espacée',spacedReview:'Réviser',spacedNext:'Prochaine révision',spacedMastered:'Maîtrisé',spacedNew:'Nouveau — pas encore étudié',spacedDue:'Révision nécessaire !',spacedInfo:'Rappels intelligents basés sur la courbe de l\x27oubli',
    
    missionTitle:'BRIEFING DE MISSION',missionClassified:'CLASSIFI\xc9',missionObjective:'Objectif de mission :',missionAgent:'AGENT-3CBCF9',missionSkip:'Passer',missionGo:'ACCEPTER LA MISSION',mission_obj:'Explorer et ma\xeetrisez FM Pirate Radio \u2014 analysez, exp\xe9rimentez et compl\xe9tez tous les d\xe9fis.',nightVisionTitle:'Mode Vision Nocturne',nightVisionOn:'VN ON',nightVisionOff:'VN OFF',nightVisionAuto:'VN Auto',
    termTitle:'>_ Terminal',termPlaceholder:'Tapez une commande...',termHelp:'Commandes : help, start, stop, reset, theme [nom], lang [en|fr|ar], set [param] [valeur], get [param], list, export, clear, status, about, cipher',termUnknown:'Commande inconnue. Tapez help pour la liste.',termWelcome:'Terminal pr\x27et. Tapez help pour commencer.',cipherTitle:'🔐 Chiffrement',cipherInput:'Texte source',cipherOutput:'R\xe9sultat',cipherEncode:'Encoder',cipherDecode:'D\xe9coder',cipherMethod:'M\xe9thode',cipherKey:'Cl\xe9',cipherCopy:'Copier',
    
    particleTitle:'ð Particules',particleToggle:'Basculer Particules',compareTitle:'ð Comparer',compareSave:'Sauvegarder',compareLoad:'Charger',compareDiff:'Différence',compareClear:'Effacer',compareSlotA:'Expérience A',compareSlotB:'Expérience B',compareResult:'Résultat de comparaison',
    
    peerTitle:'ð¥ Peer Mode',peerConnect:'Connect',peerDisconnect:'Disconnect',peerStatus:'Peer Status',peerSend:'Sent',peerReceive:'Received',peerInfo:'Open this app in two tabs to sync parameters via BroadcastChannel',heatmapTitle:'ð Activity Heatmap',heatmapToday:'Today',heatmapStreak:'Streak',heatmapTotal:'Total',heatmapLegend:'Less \u2192 More',
    
    labTitle:'ð Cahier de labo',labGenerate:'ð Rapport de labo',labExport:'Exporter le rapport',labHypothesis:'HYPOTH\xc8SE',labMethod:'M\xc9THODE',labObservation:'OBSERVATIONS',labConclusion:'CONCLUSION',labSession:'Session',recorderTitle:'âº Enregistreur',recorderStart:'âº Enregistrer',recorderStop:'â¹ Arr\xeater',recorderClear:'Effacer',recorderExport:'Exporter CSV',recorderPoints:'pts',recorderGraph:'Graphique',
    voiceTitle:'🎤 Voix',voiceOn:'Voix ON',voiceOff:'Voix OFF',voiceListening:'Écoute...',voiceCmd:'Commande reconnue',voiceHelp:'Dites : démarrer, arrêter, aide, thème, suivant, précédent',voice_cmds:'démarrer / arrêter / aide / thème / suivant / précédent',shareTitle:'📤 Partager',shareBtn:'📤 Partager',shareCopied:'Copié dans le presse-papiers !',shareGenerate:'Générer le résumé',shareExport:'Exporter JSON',
    
    
    dailyTitle:'📅 D\xe9fi du jour',dailyChallenge:'D\xe9fi d\x27aujourd\x27hui',dailyHint:'Voir l\x27indice',dailyStreak:'S\xe9rie',dailyComplete:'Marquer termin\xe9',daily_d1:'Explique comment Hrf Fm Pirate Radio fonctionne \xe0 un ami en moins de 60 secondes.',daily_d2:'Trouve 3 applications r\xe9elles des concepts de Hrf Sigint montr\xe9s ici.',daily_d3:'Change un param\xe8tre \xe0 sa valeur extr\xeame et documente ce qui se passe.',daily_d4:'Dessine un diagramme montrant le flux de donn\xe9es dans cette simulation de Hrf Sigint.',daily_d5:'\xc9cris le pseudocode de l\x27algorithme principal utilis\xe9 dans cette app.',daily_d6:'Compare les r\xe9sultats avec les param\xe8tres par d\xe9faut et modifi\xe9s et note 3 diff\xe9rences.',daily_d7:'Formule une hypoth\xe8se sur ce qui se passe si tu doubles le param\xe8tre principal, puis teste-la.',mentorTitle:'🎓 Tutoriel guid\xe9',mentorStart:'D\xe9marrer le tutoriel',mentorNext:'Suivant',mentorPrev:'Pr\xe9c\xe9dent',mentorDone:'Terminer',mentorStep:'\xc9tape',mentor_s1:'Regarde la zone de visualisation principale — c\x27est l\xe0 que la simulation tourne en temps r\xe9el.',mentor_s2:'Appuie sur D\xe9marrer pour lancer la simulation. Observe comment l\x27affichage r\xe9agit.',mentor_s3:'Essaie de modifier un curseur — observe comment cela affecte le r\xe9sultat imm\xe9diatement.',mentor_s4:'Ouvre le panneau Aide et explore l\x27onglet Wiki pour approfondir tes connaissances.',mentor_s5:'Compl\xe8te un d\xe9fi pour tester ta compr\xe9hension des concepts.',
    sonifyTitle:'🔊 Sonification des données',sonifyOn:'Sonification activée',sonifyOff:'Sonification désactivée',sonifyFreq:'Fréquence',sonifyVol:'Volume',sonifyWave:'Forme d\x27onde',sonifyInfo:'Transformez les données en son',
    tooltipTitle:'Infobulles intelligentes',tooltipToggle:'Activer les infobulles',tip_start:'Lancer la simulation et observer la visualisation s\x27animer',tip_stop:'Mettre en pause la simulation en conservant l\x27état actuel',tip_reset:'Effacer toutes les données et revenir aux conditions initiales',tip_slider:'Glisser pour ajuster ce paramètre — la visualisation se met à jour en temps réel',tip_theme:'Basculer entre 8 thèmes visuels dont 2 thèmes clairs islamiques',tip_help:'Ouvrir le panneau d\x27aide avec FAQ, guides, wiki et défis',explorerTitle:'Explorateur d\x27espace paramétrique',explorerStart:'Auto-Explorer',explorerStop:'Arrêter l\x27exploration',explorerProgress:'Exploration des combinaisons...',explorerResult:'Exploration terminée',explorerInfo:'Teste systématiquement min/milieu/max pour chaque curseur et enregistre les résultats',
    
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
    diffTitle:'المستوى',diffBeginner:'🟢 مبتدئ',diffIntermediate:'🟡 متوسط',diffExpert:'🔴 خبير',diffInfo:'اختر مستوى التعقيد',spacedTitle:'📅 المراجعة المتباعدة',spacedReview:'مراجعة',spacedNext:'المراجعة التالية',spacedMastered:'مُتقَن',spacedNew:'جديد — لم يُدرَس بعد',spacedDue:'حان وقت المراجعة!',spacedInfo:'تذكيرات ذكية بناءً على منحنى النسيان',
    
    missionTitle:'\u0625\u062D\u0627\u0637\u0629 \u0627\u0644\u0645\u0647\u0645\u0629',missionClassified:'\u0633\u0631\u064A',missionObjective:'\u0647\u062F\u0641 \u0627\u0644\u0645\u0647\u0645\u0629:',missionAgent:'AGENT-3CBCF9',missionSkip:'\u062A\u062E\u0637\u064A',missionGo:'\u0642\u0628\u0648\u0644 \u0627\u0644\u0645\u0647\u0645\u0629',mission_obj:'\u0627\u0633\u062A\u0643\u0634\u0641 \u0648\u0623\u062A\u0642\u0646 \u0647\u0630\u0627 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u2014 \u062D\u0644\u0644 \u0648\u062C\u0631\u0628 \u0648\u0623\u0643\u0645\u0644 \u062C\u0645\u064A\u0639 \u0627\u0644\u062A\u062D\u062F\u064A\u0627\u062A.',nightVisionTitle:'\u0648\u0636\u0639 \u0627\u0644\u0631\u0624\u064A\u0629 \u0627\u0644\u0644\u064A\u0644\u064A\u0629',nightVisionOn:'\u0631\u0624\u064A\u0629 \u0644\u064A\u0644\u064A\u0629 ON',nightVisionOff:'\u0631\u0624\u064A\u0629 \u0644\u064A\u0644\u064A\u0629 OFF',nightVisionAuto:'\u0631\u0624\u064A\u0629 \u0644\u064A\u0644\u064A\u0629 \u062A\u0644\u0642\u0627\u0626\u064A',
    termTitle:'>_ الطرفية',termPlaceholder:'اكتب أمراً...',termHelp:'الأوامر: help, start, stop, reset, theme, lang, set, get, list, export, clear, status, about, cipher',termUnknown:'أمر غير معروف. اكتب help للمساعدة.',termWelcome:'الطرفية جاهزة. اكتب help للبدء.',cipherTitle:'🔐 أدوات التشفير',cipherInput:'النص المدخل',cipherOutput:'النتيجة',cipherEncode:'تشفير',cipherDecode:'فك التشفير',cipherMethod:'الطريقة',cipherKey:'المفتاح',cipherCopy:'نسخ',
    
    particleTitle:'ð جزيئات',particleToggle:'تبديل الجزيئات',compareTitle:'ð مقارنة',compareSave:'حفظ',compareLoad:'تحميل',compareDiff:'الفرق',compareClear:'مسح',compareSlotA:'تجربة أ',compareSlotB:'تجربة ب',compareResult:'نتيجة المقارنة',
    
    peerTitle:'ð¥ Mode Pair',peerConnect:'Connecter',peerDisconnect:'D\xe9connecter',peerStatus:'Statut pair',peerSend:'Envoy\xe9',peerReceive:'Re\xe7u',peerInfo:'Ouvrez cette app dans deux onglets pour synchroniser les param\xe8tres',heatmapTitle:'ð Carte d\x27activit\xe9',heatmapToday:'Aujourd\x27hui',heatmapStreak:'S\xe9rie',heatmapTotal:'Total',heatmapLegend:'Moins \u2192 Plus',
    
    labTitle:'ð دفتر المختبر',labGenerate:'ð تقرير المختبر',labExport:'تصدير التقرير',labHypothesis:'الفرضية',labMethod:'المنهجية',labObservation:'الملاحظات',labConclusion:'الخلاصة',labSession:'الجلسة',recorderTitle:'âº مسجل البيانات',recorderStart:'âº تسجيل',recorderStop:'â¹ إيقاف',recorderClear:'مسح',recorderExport:'تصدير CSV',recorderPoints:'نقطة',recorderGraph:'رسم بياني',
    voiceTitle:'🎤 صوت',voiceOn:'الصوت مفعل',voiceOff:'الصوت معطل',voiceListening:'جاري الاستماع...',voiceCmd:'تم التعرف على الأمر',voiceHelp:'قل: ابدأ، توقف، مساعدة',voice_cmds:'ابدأ / توقف / مساعدة',shareTitle:'📤 مشاركة',shareBtn:'📤 مشاركة',shareCopied:'تم النسخ!',shareGenerate:'إنشاء ملخص',shareExport:'تصدير JSON',
    
    
    dailyTitle:'📅 تحدي اليوم',dailyChallenge:'تحدي اليوم',dailyHint:'إظهار التلميح',dailyStreak:'سلسلة',dailyComplete:'إكمال',daily_d1:'اشرح كيف يعمل هذا التطبيق لصديق في أقل من 60 ثانية.',daily_d2:'ابحث عن 3 تطبيقات واقعية للمفاهيم المعروضة هنا.',daily_d3:'غيّر معلمة واحدة إلى قيمتها القصوى ووثّق ما يحدث.',daily_d4:'ارسم مخططاً يوضح تدفق البيانات في هذه المحاكاة.',daily_d5:'اكتب الكود الزائف للخوارزمية الرئيسية المستخدمة في هذا التطبيق.',daily_d6:'قارن النتائج بالإعدادات الافتراضية والمعدلة ولاحظ 3 اختلافات.',daily_d7:'ضع فرضية حول ما يحدث إذا ضاعفت المعلمة الرئيسية ثم اختبرها.',mentorTitle:'🎓 دليل تعليمي',mentorStart:'بدء الدليل',mentorNext:'التالي',mentorPrev:'السابق',mentorDone:'إنهاء',mentorStep:'خطوة',mentor_s1:'انظر إلى منطقة العرض الرئيسية — هنا تعمل المحاكاة في الوقت الفعلي.',mentor_s2:'اضغط على ابدأ لتشغيل المحاكاة. راقب كيف يتفاعل العرض.',mentor_s3:'جرّب تعديل شريط تمرير واحد — لاحظ كيف يؤثر على النتيجة فوراً.',mentor_s4:'افتح لوحة المساعدة واستكشف تبويب الويكي لمعرفة أعمق.',mentor_s5:'أكمل تحدياً واحداً لاختبار فهمك للمفاهيم.',
    sonifyTitle:'🔊 تحويل البيانات إلى صوت',sonifyOn:'الصوت مُفعَل',sonifyOff:'الصوت مُعطَل',sonifyFreq:'التردد',sonifyVol:'الصوت',sonifyWave:'شكل الموجة',sonifyInfo:'حوّل البيانات إلى صوت',
    tooltipTitle:'تلميحات ذكية',tooltipToggle:'تبديل التلميحات',tip_start:'ابدأ المحاكاة وشاهد الرسم البياني ينبض بالحياة',tip_stop:'أوقف المحاكاة مؤقتاً مع الحفاظ على الحالة الحالية',tip_reset:'امسح جميع البيانات وعد إلى الشروط الأولية',tip_slider:'اسحب لضبط هذا المعامل — يتحدث الرسم البياني في الوقت الفعلي',tip_theme:'بدّل بين 8 مظاهر مرئية منها تصميمان إسلاميان فاتحان',tip_help:'افتح لوحة المساعدة مع الأسئلة الشائعة والأدلة والويكي والتحديات',explorerTitle:'مستكشف فضاء المعاملات',explorerStart:'استكشاف تلقائي',explorerStop:'إيقاف الاستكشاف',explorerProgress:'جارٍ استكشاف التوليفات...',explorerResult:'اكتمل الاستكشاف',explorerInfo:'يختبر بشكل منهجي الحد الأدنى/الوسط/الأقصى لكل منزلق ويسجل النتائج',
    
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
    printBtn: '🖨️ طباعة',quizTab:'اختبار',quizTitle:'اختبر معلوماتك',quizRetry:'إعادة',quizCorrect:'صحيح!',quizWrong:'خطأ!',quizScore:'النتيجة',quiz_q1:'ما سرعة موجات الراديو في الفراغ؟',quiz_q1a:'سرعة الصوت',quiz_q1b:'سرعة الضوء',quiz_q1c:'نصف سرعة الضوء',quiz_q1d:'ضعف سرعة الضوء',quiz_q1_answer:'1',quiz_q2:'بماذا تُقاس التردد؟',quiz_q2a:'أمتار',quiz_q2b:'هرتز',quiz_q2c:'واط',quiz_q2d:'فولت',quiz_q2_answer:'1',quiz_q3:'ماذا تعني AI؟',quiz_q3a:'إدخال آلي',quiz_q3b:'الذكاء الاصطناعي',quiz_q3c:'واجهة تناظرية',quiz_q3d:'تكامل نشط',quiz_q3_answer:'1',quiz_q4:'ما هو التعلم الآلي؟',quiz_q4a:'برمجة الروبوتات',quiz_q4b:'أنظمة تتعلم من البيانات',quiz_q4c:'حساب يدوي',quiz_q4d:'تصميم العتاد',quiz_q4_answer:'1',quiz_q5:'ما وحدة قياس التردد الراديوي؟',quiz_q5a:'واط',quiz_q5b:'هرتز',quiz_q5c:'ديسيبل',quiz_q5d:'أوم',quiz_q5_answer:'1',realworldTitle:'🌍 قصص واقعية',realworld1:'كانت عملية آيفي بيلز في السبعينيات والثمانينيات مهمة مشتركة بين وكالة الأمن القومي والبحرية للتنصت على كابلات الاتصالات السوفيتية تحت البحر.',realworld2:'تبث محطات الأرقام رسائل مشفرة عبر الموجات القصيرة للعملاء الميدانيين منذ الحرب الباردة.',realworld3:'كشفت قضية ألدريتش أيمز (1994) كيف استخدم عميل مزدوج نقاط التسليم السرية لنقل معلومات استخبارية مصنفة للاتحاد السوفيتي لمدة عقد تقريبًا.',experimentTitle:'🔬 تجارب',experiment_1_title:'القياس المرجعي',experiment_1:'اضبط جميع عناصر التحكم على القيم الافتراضية وسجّل القراءات الأولية. هذه هي قياساتك المرجعية. يقوم العالم الجيد دائمًا بتحديد خط الأساس قبل تغيير المتغيرات — فهو يمنحك نقطة مرجعية لقياس جميع التغييرات المستقبلية.',experiment_2_title:'تحليل الحساسية',experiment_2:'غيّر معلمة واحدة إلى قيمتها الدنيا وسجّل النتيجة ثم اضبطها على الحد الأقصى. يكشف الفرق عن حساسية النظام لهذا المتغير. في مكافحة المراقبة معرفة المعلمات الأكثر أهمية تساعدك على تركيز جهودك بكفاءة.',experiment_3_title:'تأثيرات التفاعل',experiment_3:'بعد اختبار المعلمات بشكل فردي غيّر اثنتين في وقت واحد. هل التأثير المشترك يساوي مجموع التأثيرات الفردية؟ التفاعلات غير الخطية شائعة في مكافحة المراقبة وتكشف التعقيد الخفي تحت أنظمة تبدو بسيطة.',proTipTitle:'💡 نصائح احترافية',proTip1:'استخدم التنقل بين القنوات (1، 6، 11) لمسح الواي فاي — هذه هي القنوات غير المتداخلة الوحيدة في نطاق 2.4 جيجاهرتز وتلتقط 90% من حركة المرور.',proTip2:'أضف مكثفًا بسعة 10 ميكروفاراد عبر دبابيس الطاقة في ESP32. يسبب إرسال الواي فاي ذروات تيار يمكن أن تتسبب في تعطل اللوحة.',funFactTitle:'🎯 هل تعلم؟',funFact:'في عام 1945 أهدى أطفال سوفييت سفير الولايات المتحدة ختمًا خشبيًا يحتوي على جهاز تنصت سلبي. عمل لمدة 7 سنوات قبل اكتشافه.',mistakeTitle:'⚠️ أخطاء شائعة',mistake1:'تغيير عدة معلمات في وقت واحد يجعل من المستحيل عزل السبب والنتيجة. غيّر دائمًا متغيرًا واحدًا فقط في كل مرة.',mistake2:'تخطي القياس المرجعي. بدون معرفة السلوك الافتراضي لا يمكنك قياس تأثير تغييراتك على النظام.',peerTitle:'ð¥ \u0648\u0636\u0639 \u0627\u0644\u0646\u0638\u064a\u0631',peerConnect:'\u0627\u062a\u0635\u0627\u0644',peerDisconnect:'\u0642\u0637\u0639',peerStatus:'\u062d\u0627\u0644\u0629 \u0627\u0644\u0646\u0638\u064a\u0631',peerSend:'\u0623\u0631\u0633\u0644',peerReceive:'\u0627\u0633\u062a\u0644\u0645',peerInfo:'\u0627\u0641\u062a\u062d \u0647\u0630\u0627 \u0627\u0644\u062a\u0637\u0628\u064a\u0642 \u0641\u064a \u062a\u0628\u0648\u064a\u0628\u064a\u0646 \u0644\u0644\u0645\u0632\u0627\u0645\u0646\u0629',heatmapTitle:'ð \u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u0646\u0634\u0627\u0637',heatmapToday:'\u0627\u0644\u064a\u0648\u0645',heatmapStreak:'\u0633\u0644\u0633\u0644\u0629',heatmapTotal:'\u0627\u0644\u0645\u062c\u0645\u0648\u0639',heatmapLegend:'\u0623\u0642\u0644 \u2192 \u0623\u0643\u062b\u0631',mistake3:'تجاهل سجل النشاط. يسجل كل حدث مع طوابع زمنية — ضروري لفهم التسلسلات وتصحيح النتائج غير المتوقعة.'}

};

/* ═══════ Difficulty Levels ═══════ */
function initDifficultyLevels(){
  if(document.getElementById('diffToggleBar'))return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
  var storageKey='diff_'+appDir;
  var saved=localStorage.getItem(storageKey)||'intermediate';
  /* inject CSS */
  var style=document.createElement('style');
  style.textContent=''
    +'.diff-beginner .sim-controls input[type="range"]:nth-of-type(n+4),.diff-beginner .sim-controls .slider-row:nth-of-type(n+4){display:none !important;}'
    +'.diff-beginner label,.diff-beginner .sidebar-label{font-size:1rem !important;}'
    +'.diff-beginner .card-subtitle{font-size:0.95rem !important;}'
    +'.diff-expert{font-size:0.88rem;}'
    +'.diff-expert .card,.diff-expert .collapsible{padding:0.5rem !important;}'
    +'.diff-expert .card-header{padding:0.4rem 0.5rem !important;}'
    +'.diff-toggle-bar{display:flex;gap:0.4rem;align-items:center;padding:0.4rem 0.6rem;border-radius:8px;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.08);margin-bottom:0.5rem;flex-wrap:wrap;}'
    +'.diff-toggle-bar button{padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;transition:all 0.2s;}'
    +'.diff-toggle-bar button.active{background:var(--accent,#d4a03c);color:var(--bg,#08091a);font-weight:700;border-color:var(--accent,#d4a03c);}'
    +'.diff-toggle-bar .diff-label{font-size:0.75rem;opacity:0.6;margin-right:0.3rem;}'
    +'#diffExpertData{display:none;margin:0.5rem 0;padding:0.6rem;border-radius:8px;background:#0a0a1a;border:1px solid rgba(255,255,255,0.08);font-family:monospace;font-size:0.7rem;color:#8f8;max-height:120px;overflow-y:auto;white-space:pre-wrap;word-break:break-all;}'
    +'.diff-expert #diffExpertData{display:block;}';
  document.head.appendChild(style);
  /* build toggle bar */
  var bar=document.createElement('div');
  bar.id='diffToggleBar';
  bar.className='diff-toggle-bar';
  bar.innerHTML='<span class="diff-label" data-i18n="diffTitle">'+(L.diffTitle||'Difficulty')+'</span>'
    +'<button data-diff="beginner" data-i18n="diffBeginner">'+(L.diffBeginner||'🟢 Beginner')+'</button>'
    +'<button data-diff="intermediate" data-i18n="diffIntermediate">'+(L.diffIntermediate||'🟡 Intermediate')+'</button>'
    +'<button data-diff="expert" data-i18n="diffExpert">'+(L.diffExpert||'🔴 Expert')+'</button>'
    +'<span style="font-size:0.65rem;opacity:0.4;margin-left:auto;" data-i18n="diffInfo">'+(L.diffInfo||'Choose your complexity level')+'</span>';
  var header=document.querySelector('.header');
  if(header&&header.parentNode){header.parentNode.insertBefore(bar,header.nextSibling);}
  else{var app=document.querySelector('.app')||document.body;app.insertBefore(bar,app.firstChild);}
  /* expert data readout */
  var expertDiv=document.createElement('div');
  expertDiv.id='diffExpertData';
  var mainCard=document.getElementById('mainCard');
  if(mainCard&&mainCard.parentNode){mainCard.parentNode.insertBefore(expertDiv,mainCard.nextSibling);}
  function setDiff(level){
    document.body.classList.remove('diff-beginner','diff-intermediate','diff-expert');
    document.body.classList.add('diff-'+level);
    bar.querySelectorAll('button').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-diff')===level);});
    localStorage.setItem(storageKey,level);
    if(level==='beginner'){
      var hw=document.querySelector('details.collapsible');
      if(hw&&!hw.open)hw.open=true;
    }
    if(level==='expert'){updateExpertData();}
    else{expertDiv.textContent='';}
  }
  function updateExpertData(){
    if(!document.body.classList.contains('diff-expert'))return;
    var data={};
    document.querySelectorAll('input[type="range"]').forEach(function(s){
      var label=s.previousElementSibling?s.previousElementSibling.textContent:s.id;
      data[label||s.id||'slider']=parseFloat(s.value).toFixed(4);
    });
    document.querySelectorAll('select').forEach(function(s){
      if(s.id!=='langSelect'&&s.id!=='themeSelect'){
        data[s.id||'select']=s.value;
      }
    });
    expertDiv.textContent=JSON.stringify(data,null,2);
  }
  bar.addEventListener('click',function(e){
    var btn=e.target.closest('button[data-diff]');
    if(btn)setDiff(btn.getAttribute('data-diff'));
  });
  setDiff(saved);
  /* update expert readout periodically */
  setInterval(function(){if(document.body.classList.contains('diff-expert'))updateExpertData();},2000);
  /* listen for slider changes */
  document.addEventListener('input',function(e){if(e.target.type==='range'&&document.body.classList.contains('diff-expert'))updateExpertData();});
}

/* ═══════ Spaced Repetition ═══════ */
function initSpacedRepetition(){
  if(document.getElementById('spacedPanel'))return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';
  var storageKey='spaced_'+appDir;
  var now=Date.now();
  var DAY=86400000;
  /* load or create record */
  var rec;
  try{rec=JSON.parse(localStorage.getItem(storageKey));}catch(e){rec=null;}
  if(!rec){rec={visits:0,lastVisit:0,interval:1,ease:2.5};}
  /* SM-2 inspired update */
  var timeSinceLast=now-rec.lastVisit;
  var intervalMs=rec.interval*DAY;
  if(rec.visits===0){
    rec.interval=1;
  }else if(rec.visits===1){
    rec.interval=3;
  }else{
    if(timeSinceLast<intervalMs*0.5){
      /* visited too early, keep interval */
    }else if(timeSinceLast>intervalMs){
      /* visited late, reduce ease slightly */
      rec.ease=Math.max(1.3,rec.ease-0.15);
      rec.interval=Math.round(rec.interval*rec.ease);
    }else{
      rec.interval=Math.round(rec.interval*rec.ease);
    }
  }
  rec.visits++;
  rec.lastVisit=now;
  localStorage.setItem(storageKey,JSON.stringify(rec));
  /* determine status */
  var nextReviewMs=rec.lastVisit+rec.interval*DAY;
  var status,statusIcon,statusClass;
  if(rec.visits<=1){
    status=L.spacedNew||'New — not yet studied';statusIcon='⚪';statusClass='spaced-new';
  }else if(now>nextReviewMs){
    status=L.spacedDue||'Due for review!';statusIcon='🔴';statusClass='spaced-due';
  }else if(nextReviewMs-now<DAY){
    status=(L.spacedNext||'Next review')+': '+(L.spacedReview||'Review')+' — tomorrow';statusIcon='🟡';statusClass='spaced-soon';
  }else{
    var daysLeft=Math.ceil((nextReviewMs-now)/DAY);
    status=(L.spacedMastered||'Mastered')+' — '+(L.spacedNext||'Next review')+' '+daysLeft+' days';statusIcon='🟢';statusClass='spaced-mastered';
  }
  /* scan other apps for due reviews */
  var totalVisited=0,dueCount=0,masteredCount=0;
  var dueApps=[];
  for(var i=0;i<localStorage.length;i++){
    var key=localStorage.key(i);
    if(key&&key.indexOf('spaced_')===0){
      try{
        var other=JSON.parse(localStorage.getItem(key));
        if(other&&other.visits>0){
          totalVisited++;
          var otherNext=other.lastVisit+other.interval*DAY;
          if(now>otherNext){
            dueCount++;
            dueApps.push(key.replace('spaced_',''));
          }else{
            masteredCount++;
          }
        }
      }catch(e){}
    }
  }
  /* inject CSS */
  var style=document.createElement('style');
  style.textContent=''
    +'#spacedPanel{padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.08);}'
    +'#spacedPanel h4{margin:0 0 0.4rem;font-size:0.9rem;}'
    +'.spaced-status{display:flex;align-items:center;gap:0.5rem;padding:0.4rem 0;font-size:0.85rem;}'
    +'.spaced-status .spaced-icon{font-size:1.1rem;}'
    +'.spaced-summary{display:flex;gap:1rem;flex-wrap:wrap;margin:0.5rem 0;font-size:0.75rem;opacity:0.7;}'
    +'.spaced-summary span{white-space:nowrap;}'
    +'.spaced-due-list{margin-top:0.5rem;font-size:0.75rem;max-height:80px;overflow-y:auto;}'
    +'.spaced-due-list a{color:var(--accent,#d4a03c);text-decoration:none;margin-right:0.5rem;}'
    +'.spaced-due-list a:hover{text-decoration:underline;}'
    +'#spacedMarkBtn{padding:0.3rem 0.7rem;border-radius:6px;border:1px solid var(--accent,#d4a03c);background:rgba(var(--accent-rgb,212,175,55),0.15);color:inherit;cursor:pointer;font-size:0.78rem;margin-top:0.4rem;}'
    +'#spacedMarkBtn:hover{background:rgba(var(--accent-rgb,212,175,55),0.3);}';
  document.head.appendChild(style);
  /* build panel */
  var panel=document.createElement('div');
  panel.id='spacedPanel';
  var dueLinksHtml='';
  if(dueApps.length>0){
    dueLinksHtml='<div class="spaced-due-list"><strong>'+(L.spacedDue||'Due for review!')+'</strong><br>';
    dueApps.slice(0,8).forEach(function(d){
      dueLinksHtml+='<a href="../../'+d+'/index.html" title="'+d+'">'+d+'</a> ';
    });
    if(dueApps.length>8)dueLinksHtml+='<span>... +'+(dueApps.length-8)+' more</span>';
    dueLinksHtml+='</div>';
  }
  panel.innerHTML='<h4 data-i18n="spacedTitle">'+(L.spacedTitle||'📅 Spaced Review')+'</h4>'
    +'<div class="spaced-status"><span class="spaced-icon">'+statusIcon+'</span><span>'+status+'</span></div>'
    +'<div class="spaced-summary">'
    +'<span>📚 '+totalVisited+' visited</span>'
    +'<span>🔴 '+dueCount+' due</span>'
    +'<span>🟢 '+masteredCount+' on track</span>'
    +'</div>'
    +'<button id="spacedMarkBtn" data-i18n="spacedReview">✅ '+(L.spacedReview||'Mark as Reviewed')+'</button>'
    +dueLinksHtml
    +'<div style="font-size:0.65rem;opacity:0.4;margin-top:0.4rem;" data-i18n="spacedInfo">'+(L.spacedInfo||'Smart review reminders based on the forgetting curve')+'</div>';
  /* insert near sidebar footer or after last collapsible */
  var target=document.querySelector('.sidebar-footer');
  if(target&&target.parentNode){
    target.parentNode.insertBefore(panel,target);
  }else{
    var lastDetails=document.querySelectorAll('details.collapsible');
    if(lastDetails.length>0){
      var ld=lastDetails[lastDetails.length-1];
      ld.parentNode.insertBefore(panel,ld.nextSibling);
    }else{
      var app=document.querySelector('.app')||document.body;
      app.appendChild(panel);
    }
  }
  /* mark as reviewed button */
  var markBtn=document.getElementById('spacedMarkBtn');
  if(markBtn){
    markBtn.addEventListener('click',function(){
      rec.lastVisit=Date.now();
      if(rec.visits>=3){
        rec.interval=Math.round(rec.interval*rec.ease);
        rec.ease=Math.min(3.0,rec.ease+0.1);
      }
      localStorage.setItem(storageKey,JSON.stringify(rec));
      markBtn.textContent='✅ '+(L.spacedMastered||'Reviewed!');
      markBtn.disabled=true;
      markBtn.style.opacity='0.5';
    });
  }
}

document.addEventListener('DOMContentLoaded',function(){try{initDifficultyLevels();}catch(e){console.warn('Difficulty init:',e);}try{initSpacedRepetition();}catch(e){console.warn('Spaced init:',e);}});



/* ═══════ Mini Terminal ═══════ */
function initTerminal(){
  if(document.getElementById('miniTerminal')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var visible=false, history=[], histIdx=-1, MAX_LINES=100;
  var wrap=document.createElement('div');wrap.id='miniTerminal';
  wrap.style.cssText='position:fixed;bottom:0;left:0;right:0;height:260px;background:#0a0a0a;border-top:2px solid #0f0;z-index:99999;display:none;flex-direction:column;font-family:monospace;font-size:13px;transition:transform 0.25s ease;transform:translateY(100%);';
  var hdr=document.createElement('div');hdr.style.cssText='display:flex;align-items:center;padding:4px 10px;background:#111;border-bottom:1px solid #0f0;color:#0f0;';
  hdr.innerHTML='<span style="flex:1;font-weight:bold;" data-i18n="termTitle">'+(L.termTitle||'>_ Terminal')+'</span><button id="termCloseBtn" style="background:none;border:none;color:#0f0;font-size:18px;cursor:pointer;">\u2715</button>';
  var out=document.createElement('div');out.id='termOutput';out.style.cssText='flex:1;overflow-y:auto;padding:8px 10px;color:#0f0;white-space:pre-wrap;word-break:break-all;';
  var row=document.createElement('div');row.style.cssText='display:flex;align-items:center;padding:4px 10px;background:#111;border-top:1px solid #222;';
  row.innerHTML='<span style="color:#0f0;margin-right:6px;">$</span>';
  var inp=document.createElement('input');inp.id='termInput';inp.type='text';inp.setAttribute('autocomplete','off');inp.setAttribute('spellcheck','false');inp.placeholder=L.termPlaceholder||'Type a command...';
  inp.style.cssText='flex:1;background:transparent;border:none;outline:none;color:#0f0;font-family:monospace;font-size:13px;caret-color:#0f0;';
  row.appendChild(inp);wrap.appendChild(hdr);wrap.appendChild(out);wrap.appendChild(row);document.body.appendChild(wrap);
  var togBtn=document.createElement('button');togBtn.id='termToggleBtn';togBtn.textContent='>_';togBtn.title='Terminal';
  togBtn.style.cssText='position:fixed;bottom:10px;right:10px;z-index:99998;width:40px;height:40px;border-radius:50%;background:#111;color:#0f0;border:1px solid #0f0;font-family:monospace;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0.7;transition:opacity 0.2s;';
  togBtn.onmouseenter=function(){this.style.opacity='1';};togBtn.onmouseleave=function(){this.style.opacity='0.7';};
  document.body.appendChild(togBtn);
  function show(){wrap.style.display='flex';setTimeout(function(){wrap.style.transform='translateY(0)';},10);visible=true;inp.focus();}
  function hide(){wrap.style.transform='translateY(100%)';setTimeout(function(){wrap.style.display='none';},260);visible=false;}
  function toggle(){visible?hide():show();}
  togBtn.addEventListener('click',toggle);
  document.getElementById('termCloseBtn').addEventListener('click',hide);
  document.addEventListener('keydown',function(e){if(e.key==='`'&&!e.ctrlKey&&!e.altKey&&document.activeElement!==inp&&document.activeElement.tagName!=='INPUT'&&document.activeElement.tagName!=='TEXTAREA'){e.preventDefault();toggle();}});
  function appendLine(txt,color){
    var d=document.createElement('div');d.style.color=color||'#0f0';d.textContent=txt;out.appendChild(d);
    while(out.children.length>MAX_LINES)out.removeChild(out.firstChild);
    out.scrollTop=out.scrollHeight;
  }
  appendLine(L.termWelcome||'Terminal ready. Type help to get started.','#0f0');
  function exec(cmd){
    cmd=cmd.trim();if(!cmd)return;
    history.push(cmd);histIdx=history.length;
    appendLine('> '+cmd,'#888');
    var parts=cmd.split(/\s+/),c=parts[0].toLowerCase(),args=parts.slice(1);
    switch(c){
      case 'help':appendLine(L.termHelp||'Commands: help, start, stop, reset, theme, lang, set, get, list, export, clear, status, about, cipher','#0f0');break;
      case 'start':if(typeof window.startSim==='function'){window.startSim();appendLine('Simulation started.','#0f0');}else{var sb=document.querySelector('[onclick*="start"]')||document.getElementById('startBtn');if(sb){sb.click();appendLine('Start triggered.','#0f0');}else appendLine('No start function found.','#f44');}break;
      case 'stop':if(typeof window.stopSim==='function'){window.stopSim();appendLine('Simulation stopped.','#0f0');}else{var sb2=document.querySelector('[onclick*="stop"]')||document.getElementById('stopBtn');if(sb2){sb2.click();appendLine('Stop triggered.','#0f0');}else appendLine('No stop function found.','#f44');}break;
      case 'reset':if(typeof window.resetSim==='function'){window.resetSim();appendLine('Simulation reset.','#0f0');}else{var sb3=document.querySelector('[onclick*="reset"]')||document.getElementById('resetBtn');if(sb3){sb3.click();appendLine('Reset triggered.','#0f0');}else appendLine('No reset function found.','#f44');}break;
      case 'theme':if(args[0]&&typeof window.setTheme==='function'){window.setTheme(args[0]);appendLine('Theme set to '+args[0],'#0f0');}else if(!args[0]){appendLine('Usage: theme [name] — mosque, zellige, andalus, riad, medina, space, jungle, robot','#ff0');}else{appendLine('setTheme not available.','#f44');}break;
      case 'lang':if(args[0]&&/^(en|fr|ar)$/.test(args[0])){document.documentElement.lang=args[0];if(typeof window.applyLang==='function')window.applyLang(args[0]);appendLine('Language set to '+args[0],'#0f0');}else{appendLine('Usage: lang [en|fr|ar]','#ff0');}break;
      case 'set':if(args.length>=2){var sliders=document.querySelectorAll('input[type=range]');var found=false;sliders.forEach(function(s){var lbl=s.parentElement?s.parentElement.textContent.toLowerCase():'';if(lbl.indexOf(args[0].toLowerCase())!==-1){s.value=parseFloat(args[1]);s.dispatchEvent(new Event('input',{bubbles:true}));found=true;appendLine('Set '+args[0]+' = '+args[1],'#0f0');}});if(!found)appendLine('Parameter "'+args[0]+'" not found.','#f44');}else{appendLine('Usage: set [param] [value]','#ff0');}break;
      case 'get':if(args[0]){var sliders2=document.querySelectorAll('input[type=range]');var found2=false;sliders2.forEach(function(s){var lbl=s.parentElement?s.parentElement.textContent.toLowerCase():'';if(lbl.indexOf(args[0].toLowerCase())!==-1){appendLine(args[0]+' = '+s.value,'#0f0');found2=true;}});if(!found2)appendLine('Parameter "'+args[0]+'" not found.','#f44');}else{appendLine('Usage: get [param]','#ff0');}break;
      case 'list':var sliders3=document.querySelectorAll('input[type=range]');if(sliders3.length===0){appendLine('No parameters found.','#ff0');}else{sliders3.forEach(function(s){var lbl=(s.previousElementSibling?s.previousElementSibling.textContent:s.parentElement?s.parentElement.textContent:'?').trim().substring(0,40);appendLine('  '+lbl+' = '+s.value,'#0f0');});}break;
      case 'export':if(typeof window.exportLog==='function'){window.exportLog();appendLine('Export triggered.','#0f0');}else{appendLine('No export function available.','#f44');}break;
      case 'clear':out.innerHTML='';break;
      case 'status':var st=document.getElementById('statusText');appendLine('Status: '+(st?st.textContent:'unknown'),'#0f0');var sliders4=document.querySelectorAll('input[type=range]');appendLine('Parameters: '+sliders4.length,'#0f0');appendLine('Language: '+(document.documentElement.lang||'en'),'#0f0');break;
      case 'about':var ti=document.querySelector('[data-i18n="title"]');appendLine('App: '+(ti?ti.textContent:'Unknown'),'#0f0');appendLine('Framework: Vanilla JS + HTML5 Canvas','#0f0');appendLine('Trilingual: EN / FR / AR','#0f0');break;
      case 'cipher':if(typeof window.toggleCipherToolkit==='function'){window.toggleCipherToolkit();appendLine('Cipher toolkit opened.','#0f0');}else{appendLine('Cipher toolkit not available.','#f44');}break;
      default:appendLine(L.termUnknown||'Unknown command. Type help for available commands.','#f44');
    }
  }
  inp.addEventListener('keydown',function(e){
    if(e.key==='Enter'){exec(inp.value);inp.value='';}
    else if(e.key==='ArrowUp'){e.preventDefault();if(histIdx>0){histIdx--;inp.value=history[histIdx];}}
    else if(e.key==='ArrowDown'){e.preventDefault();if(histIdx<history.length-1){histIdx++;inp.value=history[histIdx];}else{histIdx=history.length;inp.value='';}}
  });
}
document.addEventListener('DOMContentLoaded',function(){try{initTerminal();}catch(e){console.warn('Terminal init:',e);}});


/* ═══════ Cipher Toolkit ═══════ */
function initCipherToolkit(){
  if(document.getElementById('cipherModal')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var MORSE={'A':'.-','B':'-...','C':'-.-.','D':'-..','E':'.','F':'..-.','G':'--.','H':'....','I':'..','J':'.---','K':'-.-','L':'.-..','M':'--','N':'-.','O':'---','P':'.--.','Q':'--.-','R':'.-.','S':'...','T':'-','U':'..-','V':'...-','W':'.--','X':'-..-','Y':'-.--','Z':'--..','0':'-----','1':'.----','2':'..---','3':'...--','4':'....-','5':'.....','6':'-....','7':'--...','8':'---..','9':'----.','.'  :'.-.-.-',','  :'--..--','?'  :'..--..',' ':' / '};
  var RMORSE={};for(var k in MORSE)RMORSE[MORSE[k]]=k;
  function caesar(t,n,dec){n=parseInt(n)||3;if(dec)n=26-n;return t.replace(/[a-zA-Z]/g,function(c){var base=c<='Z'?65:97;return String.fromCharCode((c.charCodeAt(0)-base+n)%26+base);});}
  function xorCipher(t,key){if(!key)key='K';var o='';for(var i=0;i<t.length;i++){o+=String.fromCharCode(t.charCodeAt(i)^key.charCodeAt(i%key.length));}return o;}
  function toMorse(t){return t.toUpperCase().split('').map(function(c){return MORSE[c]||c;}).join(' ');}
  function fromMorse(t){return t.split(' / ').map(function(w){return w.split(' ').map(function(c){return RMORSE[c]||c;}).join('');}).join(' ');}
  function rot13(t){return caesar(t,13,false);}
  function atbash(t){return t.replace(/[a-zA-Z]/g,function(c){var base=c<='Z'?65:97;return String.fromCharCode(base+25-(c.charCodeAt(0)-base));});}
  function toBin(t){return t.split('').map(function(c){return ('00000000'+c.charCodeAt(0).toString(2)).slice(-8);}).join(' ');}
  function fromBin(t){return t.trim().split(/\s+/).map(function(b){return String.fromCharCode(parseInt(b,2));}).join('');}
  function encode(t,m,key){switch(m){case 'caesar':return caesar(t,key,false);case 'xor':return btoa(xorCipher(t,key));case 'morse':return toMorse(t);case 'base64':return btoa(unescape(encodeURIComponent(t)));case 'rot13':return rot13(t);case 'atbash':return atbash(t);case 'binary':return toBin(t);default:return t;}}
  function decode(t,m,key){switch(m){case 'caesar':return caesar(t,key,true);case 'xor':try{return xorCipher(atob(t),key);}catch(e){return 'Invalid input';}case 'morse':return fromMorse(t);case 'base64':try{return decodeURIComponent(escape(atob(t)));}catch(e){return 'Invalid Base64';}case 'rot13':return rot13(t);case 'atbash':return atbash(t);case 'binary':return fromBin(t);default:return t;}}
  var overlay=document.createElement('div');overlay.id='cipherOverlay';
  overlay.style.cssText='position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:100000;display:none;align-items:center;justify-content:center;';
  var modal=document.createElement('div');modal.id='cipherModal';
  modal.style.cssText='background:#1a1a2e;border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:1.2rem;width:92%;max-width:420px;color:#e8e8e8;font-family:system-ui,sans-serif;max-height:90vh;overflow-y:auto;';
  modal.innerHTML='<div style="display:flex;align-items:center;margin-bottom:0.8rem;"><span style="flex:1;font-weight:bold;font-size:1.05rem;" data-i18n="cipherTitle">'+(L.cipherTitle||'\uD83D\uDD10 Cipher Toolkit')+'</span><button id="cipherCloseBtn" style="background:none;border:none;color:#e8e8e8;font-size:20px;cursor:pointer;">\u2715</button></div>'
    +'<textarea id="cipherIn" rows="3" placeholder="'+(L.cipherInput||'Input text')+'" style="width:100%;box-sizing:border-box;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.6rem;font-size:0.9rem;resize:vertical;margin-bottom:0.6rem;" data-i18n-placeholder="cipherInput"></textarea>'
    +'<div style="display:flex;gap:0.5rem;margin-bottom:0.6rem;flex-wrap:wrap;">'
    +'<select id="cipherMethod" style="flex:1;min-width:120px;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.4rem;font-size:0.85rem;"><option value="caesar">Caesar</option><option value="xor">XOR</option><option value="morse">Morse</option><option value="base64">Base64</option><option value="rot13">ROT13</option><option value="atbash">Atbash</option><option value="binary">Binary</option></select>'
    +'<input id="cipherKey" type="text" placeholder="'+(L.cipherKey||'Key')+'" value="3" style="width:70px;background:#0d0d1a;color:#e8e8e8;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.4rem;font-size:0.85rem;" data-i18n-placeholder="cipherKey">'
    +'</div>'
    +'<div style="display:flex;gap:0.5rem;margin-bottom:0.6rem;">'
    +'<button id="cipherEncBtn" style="flex:1;padding:0.5rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(0,180,80,0.2);color:#0f0;cursor:pointer;font-size:0.85rem;" data-i18n="cipherEncode">'+(L.cipherEncode||'Encode')+'</button>'
    +'<button id="cipherDecBtn" style="flex:1;padding:0.5rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(0,120,255,0.2);color:#4af;cursor:pointer;font-size:0.85rem;" data-i18n="cipherDecode">'+(L.cipherDecode||'Decode')+'</button>'
    +'</div>'
    +'<div style="position:relative;"><textarea id="cipherOut" rows="3" readonly placeholder="'+(L.cipherOutput||'Output')+'" style="width:100%;box-sizing:border-box;background:#0d0d1a;color:#0f0;border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:0.6rem;font-size:0.9rem;resize:vertical;" data-i18n-placeholder="cipherOutput"></textarea>'
    +'<button id="cipherCopyBtn" style="position:absolute;top:6px;right:6px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.1);border-radius:6px;color:#e8e8e8;cursor:pointer;padding:2px 8px;font-size:0.75rem;" data-i18n="cipherCopy">'+(L.cipherCopy||'Copy')+'</button></div>';
  overlay.appendChild(modal);document.body.appendChild(overlay);
  var cipherBtn=document.createElement('button');cipherBtn.id='cipherToggleBtn';cipherBtn.textContent='\uD83D\uDD10';cipherBtn.title='Cipher';
  cipherBtn.style.cssText='position:fixed;bottom:10px;right:56px;z-index:99998;width:40px;height:40px;border-radius:50%;background:#1a1a2e;color:#e8e8e8;border:1px solid rgba(255,255,255,0.15);font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:0.7;transition:opacity 0.2s;';
  cipherBtn.onmouseenter=function(){this.style.opacity='1';};cipherBtn.onmouseleave=function(){this.style.opacity='0.7';};
  document.body.appendChild(cipherBtn);
  function showCipher(){overlay.style.display='flex';}
  function hideCipher(){overlay.style.display='none';}
  window.toggleCipherToolkit=function(){overlay.style.display==='flex'?hideCipher():showCipher();};
  cipherBtn.addEventListener('click',window.toggleCipherToolkit);
  document.getElementById('cipherCloseBtn').addEventListener('click',hideCipher);
  overlay.addEventListener('click',function(e){if(e.target===overlay)hideCipher();});
  document.getElementById('cipherEncBtn').addEventListener('click',function(){
    var t=document.getElementById('cipherIn').value,m=document.getElementById('cipherMethod').value,k=document.getElementById('cipherKey').value;
    document.getElementById('cipherOut').value=encode(t,m,k);
  });
  document.getElementById('cipherDecBtn').addEventListener('click',function(){
    var t=document.getElementById('cipherIn').value,m=document.getElementById('cipherMethod').value,k=document.getElementById('cipherKey').value;
    document.getElementById('cipherOut').value=decode(t,m,k);
  });
  document.getElementById('cipherCopyBtn').addEventListener('click',function(){
    var o=document.getElementById('cipherOut');
    if(navigator.clipboard){navigator.clipboard.writeText(o.value).then(function(){document.getElementById('cipherCopyBtn').textContent='\u2705';setTimeout(function(){document.getElementById('cipherCopyBtn').textContent=L.cipherCopy||'Copy';},1500);});}
    else{o.select();document.execCommand('copy');document.getElementById('cipherCopyBtn').textContent='\u2705';setTimeout(function(){document.getElementById('cipherCopyBtn').textContent=L.cipherCopy||'Copy';},1500);}
  });
}
document.addEventListener('DOMContentLoaded',function(){try{initCipherToolkit();}catch(e){console.warn('Cipher init:',e);}});



/* ═══════ Particle Celebrations ═══════ */
function initParticles(){
  if(document.getElementById('particleCanvas')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var canvas=document.createElement('canvas');
  canvas.id='particleCanvas';
  canvas.style.cssText='position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;';
  document.body.appendChild(canvas);
  var ctx=canvas.getContext('2d');
  var particles=[];
  var animId=null;
  var colors=['#ff6b6b','#feca57','#48dbfb','#ff9ff3','#54a0ff','#5f27cd','#01a3a4','#00d2d3'];
  function resize(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  resize();window.addEventListener('resize',resize);
  function drawStar(cx,cy,r){ctx.beginPath();for(var i=0;i<5;i++){var a=Math.PI/2+i*Math.PI*2/5;ctx.lineTo(cx+Math.cos(a)*r,cy-Math.sin(a)*r);a+=Math.PI/5;ctx.lineTo(cx+Math.cos(a)*r*0.4,cy-Math.sin(a)*r*0.4);}ctx.closePath();ctx.fill();}
  function spawnParticles(x,y,count){
    var n=count||Math.floor(50+Math.random()*30);
    for(var i=0;i<n;i++){
      var angle=Math.random()*Math.PI*2;
      var speed=2+Math.random()*6;
      var shape=Math.floor(Math.random()*3);
      particles.push({x:x,y:y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
        color:colors[Math.floor(Math.random()*colors.length)],
        size:3+Math.random()*5,life:1,decay:0.008+Math.random()*0.012,
        shape:shape,rotation:Math.random()*Math.PI*2,rotSpeed:(Math.random()-0.5)*0.2});
    }
    if(!animId) animate();
  }
  function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var i=particles.length-1;i>=0;i--){
      var p=particles[i];
      p.x+=p.vx;p.y+=p.vy;p.vy+=0.1;p.vx*=0.99;p.vy*=0.99;
      p.life-=p.decay;p.rotation+=p.rotSpeed;
      if(p.life<=0){particles.splice(i,1);continue;}
      ctx.save();ctx.globalAlpha=p.life;ctx.fillStyle=p.color;
      ctx.translate(p.x,p.y);ctx.rotate(p.rotation);
      if(p.shape===0){ctx.beginPath();ctx.arc(0,0,p.size,0,Math.PI*2);ctx.fill();}
      else if(p.shape===1){ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size);}
      else{drawStar(0,0,p.size);}
      ctx.restore();
    }
    if(particles.length>0){animId=requestAnimationFrame(animate);}
    else{ctx.clearRect(0,0,canvas.width,canvas.height);animId=null;}
  }
  window.triggerCelebration=function(x,y){spawnParticles(x||window.innerWidth/2,y||window.innerHeight/2);};
  window.triggerFireworks=function(){
    for(var i=0;i<3;i++){
      (function(idx){setTimeout(function(){
        spawnParticles(100+Math.random()*(window.innerWidth-200),100+Math.random()*(window.innerHeight-300),70);
      },idx*400);})(i);
    }
  };
  /* Hook into achievement system */
  var origDispatch=window.dispatchEvent;
  window.addEventListener('achievement-unlocked',function(e){
    var rect=document.body.getBoundingClientRect();
    window.triggerCelebration(rect.width/2,rect.height/3);
  });
  /* Hook into quiz/challenge completion */
  document.addEventListener('click',function(e){
    var btn=e.target;
    if(!btn)return;
    var txt=(btn.textContent||'').toLowerCase();
    var idn=(btn.id||'').toLowerCase();
    /* Challenge reveal */
    if(idn.indexOf('reveal')>=0||idn.indexOf('answer')>=0||txt.indexOf('reveal')>=0){
      var r=btn.getBoundingClientRect();
      spawnParticles(r.left+r.width/2,r.top+r.height/2,30);
    }
    /* Quiz submit - check score after small delay */
    if(idn.indexOf('quiz')>=0&&(idn.indexOf('submit')>=0||txt.indexOf('submit')>=0)){
      setTimeout(function(){
        var scoreEl=document.querySelector('[id*="quizScore"]')||document.querySelector('[id*="score"]');
        if(scoreEl){
          var m=scoreEl.textContent.match(/(\d+)\s*[%\/]/);
          if(m){var pct=parseInt(m[1]);if(pct>60){window.triggerFireworks();}}
        }
      },500);
    }
    /* Daily challenge complete */
    if(idn.indexOf('daily')>=0&&(idn.indexOf('complete')>=0||idn.indexOf('done')>=0||txt.indexOf('complete')>=0)){
      window.triggerFireworks();
    }
  });
}

/* ═══════ Comparison Mode ═══════ */
function initComparisonMode(){
  if(document.getElementById('comparePanel')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var appKey='compare_'+window.location.pathname.replace(/[^a-z0-9]/gi,'_');
  var saved=JSON.parse(localStorage.getItem(appKey)||'{"a":null,"b":null}');
  function getSliders(){
    var sliders=document.querySelectorAll('input[type="range"]');
    var data=[];
    sliders.forEach(function(s){
      var label='';
      var prev=s.previousElementSibling;
      if(prev&&(prev.tagName==='LABEL'||prev.tagName==='SPAN')){label=prev.textContent.trim();}
      if(!label){var lbl=s.closest('label');if(lbl){label=lbl.textContent.replace(/[\d.]+/g,'').trim();}}
      if(!label){var par=s.parentElement;if(par){var sp=par.querySelector('label,span,.label');if(sp)label=sp.textContent.trim();}}
      if(!label) label=s.id||s.name||('slider-'+data.length);
      data.push({id:s.id||('s'+data.length),label:label,value:parseFloat(s.value),min:parseFloat(s.min||0),max:parseFloat(s.max||100)});
    });
    return data;
  }
  function setSliders(data){
    if(!data)return;
    var sliders=document.querySelectorAll('input[type="range"]');
    data.forEach(function(d,i){
      if(sliders[i]){sliders[i].value=d.value;sliders[i].dispatchEvent(new Event('input',{bubbles:true}));}
    });
  }
  function buildTable(){
    if(!saved.a&&!saved.b) return '<div style="opacity:0.5;font-size:0.8rem;padding:0.5rem;">Save experiments to A and B slots to compare.</div>';
    var html='<table style="width:100%;border-collapse:collapse;font-size:0.78rem;margin-top:0.5rem;">';
    html+='<tr style="border-bottom:1px solid rgba(255,255,255,0.15);"><th style="text-align:left;padding:4px;">Parameter</th>';
    html+='<th style="padding:4px;">'+(L.compareSlotA||'Exp A')+'</th>';
    html+='<th style="padding:4px;">'+(L.compareSlotB||'Exp B')+'</th>';
    html+='<th style="padding:4px;">\u0394 Change</th></tr>';
    var rows=saved.a||saved.b;
    if(rows){rows.forEach(function(r,i){
      var a=saved.a?saved.a[i]:null;
      var b=saved.b?saved.b[i]:null;
      var va=a?a.value:'-';var vb=b?b.value:'-';
      var delta='';var clr='rgba(255,255,255,0.5)';
      if(a&&b){
        var diff=b.value-a.value;
        if(a.value!==0){var pct=Math.round((diff/a.value)*100);delta=(diff>0?'+':'')+pct+'%';
          if(diff>0)clr='#2ecc71';else if(diff<0)clr='#e74c3c';else{clr='rgba(255,255,255,0.4)';delta='0%';}
        }else{delta=diff>0?'+'+diff.toFixed(1):diff.toFixed(1);if(diff>0)clr='#2ecc71';else if(diff<0)clr='#e74c3c';}
      }
      html+='<tr style="border-bottom:1px solid rgba(255,255,255,0.06);">';
      html+='<td style="padding:3px 4px;opacity:0.85;">'+(a?a.label:(b?b.label:''))+'</td>';
      html+='<td style="padding:3px 4px;text-align:center;">'+(typeof va==='number'?va.toFixed(1):va)+'</td>';
      html+='<td style="padding:3px 4px;text-align:center;">'+(typeof vb==='number'?vb.toFixed(1):vb)+'</td>';
      html+='<td style="padding:3px 4px;text-align:center;color:'+clr+';font-weight:600;">'+delta+'</td></tr>';
    });}
    html+='</table>';return html;
  }
  function persist(){localStorage.setItem(appKey,JSON.stringify(saved));}
  /* Build UI */
  var panel=document.createElement('div');
  panel.id='comparePanel';
  panel.style.cssText='display:none;padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
  panel.innerHTML='<div style="font-weight:600;margin-bottom:0.5rem;" data-i18n="compareTitle">'+(L.compareTitle||'\xf0\x9f\x93\x8a Compare')+'</div>'
    +'<div style="display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:0.5rem;">'
    +'<button id="compareSaveA" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(54,160,255,0.15);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareSave">'+(L.compareSave||'Save')+' A</button>'
    +'<button id="compareSaveB" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,107,107,0.15);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareSave">'+(L.compareSave||'Save')+' B</button>'
    +'<button id="compareLoadA" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareLoad">'+(L.compareLoad||'Load')+' A</button>'
    +'<button id="compareLoadB" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareLoad">'+(L.compareLoad||'Load')+' B</button>'
    +'<button id="compareClear" style="padding:0.3rem 0.7rem;border-radius:6px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:inherit;cursor:pointer;font-size:0.8rem;" data-i18n="compareClear">'+(L.compareClear||'Clear')+'</button>'
    +'</div>'
    +'<div id="compareTable"></div>';
  var toggleBtn=document.createElement('button');
  toggleBtn.id='compareToggleBtn';
  toggleBtn.style.cssText='padding:0.4rem 0.9rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:inherit;cursor:pointer;font-size:0.85rem;margin:0.3rem 0;';
  toggleBtn.setAttribute('data-i18n','compareTitle');
  toggleBtn.textContent=L.compareTitle||'\xf0\x9f\x93\x8a Compare';
  var target=document.getElementById('mainCard');
  if(target&&target.parentNode){target.parentNode.insertBefore(toggleBtn,target.nextSibling);toggleBtn.parentNode.insertBefore(panel,toggleBtn.nextSibling);}
  else{var fc=document.querySelector('.rows-container')||document.querySelector('.app');if(fc){fc.appendChild(toggleBtn);fc.appendChild(panel);}}
  toggleBtn.addEventListener('click',function(){
    var v=panel.style.display;panel.style.display=v==='none'?'block':'none';
    if(v==='none'){document.getElementById('compareTable').innerHTML=buildTable();}
  });
  document.getElementById('compareSaveA').addEventListener('click',function(){saved.a=getSliders();persist();document.getElementById('compareTable').innerHTML=buildTable();});
  document.getElementById('compareSaveB').addEventListener('click',function(){saved.b=getSliders();persist();document.getElementById('compareTable').innerHTML=buildTable();});
  document.getElementById('compareLoadA').addEventListener('click',function(){setSliders(saved.a);});
  document.getElementById('compareLoadB').addEventListener('click',function(){setSliders(saved.b);});
  document.getElementById('compareClear').addEventListener('click',function(){saved={a:null,b:null};persist();document.getElementById('compareTable').innerHTML=buildTable();});
}
document.addEventListener('DOMContentLoaded',function(){try{initParticles();}catch(e){console.warn('Particles init:',e);}try{initComparisonMode();}catch(e){console.warn('Compare init:',e);}});








/* ═══════ LAB NOTEBOOK ═══════ */
function initLabNotebook(){var L=LANG[document.documentElement.lang||'en'];var panel=document.getElementById('labRecorderPanel');if(!panel||!L.labTitle)return;var _labLog=[];var _labStart=Date.now();var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var storageKey=appDir+'_labLog';var btnGen=document.getElementById('labGenBtn');var btnExp=document.getElementById('labExpBtn');if(!btnGen)return;document.querySelectorAll('input[type="range"],input[type="number"]').forEach(function(inp){var prevVal=inp.value;inp.addEventListener('input',function(){_labLog.push({t:Date.now()-_labStart,param:inp.id||inp.name||'slider',oldVal:prevVal,newVal:inp.value});prevVal=inp.value;});});function genReport(){var title=document.title||appDir;var dur=Math.round((Date.now()-_labStart)/1000);var mins=Math.floor(dur/60);var secs=dur%60;var paramCounts={};var paramMins={};var paramMaxs={};_labLog.forEach(function(e){if(!paramCounts[e.param])paramCounts[e.param]=0;paramCounts[e.param]++;var v=parseFloat(e.newVal);if(!isNaN(v)){if(paramMins[e.param]===undefined||v<paramMins[e.param])paramMins[e.param]=v;if(paramMaxs[e.param]===undefined||v>paramMaxs[e.param])paramMaxs[e.param]=v;}});var params=Object.keys(paramCounts);var totalAdj=_labLog.length;var mostMod=params.length?params.reduce(function(a,b){return paramCounts[a]>paramCounts[b]?a:b;}):'-';var allSliders=document.querySelectorAll('input[type="range"],input[type="number"]');var coverage=allSliders.length?Math.round(params.length/allSliders.length*100):0;var obs='';params.forEach(function(p){obs+='  - '+p+': changed '+paramCounts[p]+' times';if(paramMins[p]!==undefined)obs+=', range '+paramMins[p]+'\u2192'+paramMaxs[p];obs+='\n';});var report='\u2550\u2550\u2550 LAB NOTEBOOK \u2550\u2550\u2550\n'+'App: '+title+'\n'+'Date: '+new Date().toISOString().slice(0,10)+'\n'+'Duration: '+mins+'m '+secs+'s\n\n'+L.labHypothesis+'\n"Changing '+mostMod+' affects '+title+' behavior"\n\n'+L.labMethod+'\nParameters tested: '+params.join(', ')+'\nTotal adjustments: '+totalAdj+'\n\n'+L.labObservation+'\n'+obs+'\n'+L.labConclusion+'\nMost sensitive parameter: '+mostMod+'\nExploration coverage: '+coverage+'%\n\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\n';return report;}btnGen.onclick=function(){var report=genReport();var box=document.getElementById('labReportBox');if(box){box.textContent=report;box.style.display='block';}try{localStorage.setItem(storageKey,JSON.stringify({date:new Date().toISOString(),log:_labLog}));}catch(e){}if(typeof playSound==='function')playSound('success');};btnExp.onclick=function(){var report=genReport();var blob=new Blob([report],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=appDir+'-lab-report.txt';a.click();URL.revokeObjectURL(a.href);};}

/* ═══════ DATA RECORDER ═══════ */
function initDataRecorder(){var L=LANG[document.documentElement.lang||'en'];var panel=document.getElementById('labRecorderPanel');if(!panel||!L.recorderTitle)return;var recBtn=document.getElementById('recStartBtn');var clearBtn=document.getElementById('recClearBtn');var expBtn=document.getElementById('recExpBtn');var recCanvas=document.getElementById('recCanvas');var recStatus=document.getElementById('recStatus');if(!recBtn||!recCanvas)return;var ctx=recCanvas.getContext('2d');var recording=false;var recData=[];var recTimer=null;var maxPts=500;function sampleValues(){var vals={};document.querySelectorAll('input[type="range"],input[type="number"]').forEach(function(inp){var k=inp.id||inp.name||'v'+Math.random().toString(36).slice(2,5);vals[k]=parseFloat(inp.value)||0;});document.querySelectorAll('[id]').forEach(function(el){if(el.tagName==='INPUT')return;var txt=el.textContent;var m=txt.match(/[\d]+\.?[\d]*/);if(m&&txt.length<20&&el.id)vals['_'+el.id]=parseFloat(m[0]);});return vals;}function drawGraph(){ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,recCanvas.width,recCanvas.height);if(recData.length<2)return;var keys=Object.keys(recData[0].values);var firstKey=keys[0];if(!firstKey)return;var vals=recData.map(function(d){return d.values[firstKey]||0;});var mn=Math.min.apply(null,vals);var mx=Math.max.apply(null,vals);if(mn===mx){mn-=1;mx+=1;}var w=recCanvas.width;var h=recCanvas.height;var pad=4;ctx.strokeStyle='#33ff88';ctx.lineWidth=1.5;ctx.beginPath();for(var i=0;i<vals.length;i++){var x=pad+(w-2*pad)*(i/(vals.length-1));var y=h-pad-(h-2*pad)*((vals[i]-mn)/(mx-mn));if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();ctx.fillStyle='#33ff8840';ctx.lineTo(w-pad,h-pad);ctx.lineTo(pad,h-pad);ctx.fill();}var rafId=null;function animLoop(){drawGraph();if(recording)rafId=requestAnimationFrame(animLoop);}recBtn.onclick=function(){if(!recording){recording=true;recBtn.textContent=L.recorderStop;recBtn.style.background='rgba(255,60,60,0.2)';recTimer=setInterval(function(){if(recData.length>=maxPts){clearInterval(recTimer);recording=false;recBtn.textContent=L.recorderStart;recBtn.style.background='';return;}recData.push({time:Date.now(),values:sampleValues()});recStatus.textContent=(L.recorderTitle||'Recording')+': '+recData.length+' '+(L.recorderPoints||'pts');},500);rafId=requestAnimationFrame(animLoop);}else{recording=false;clearInterval(recTimer);if(rafId)cancelAnimationFrame(rafId);recBtn.textContent=L.recorderStart;recBtn.style.background='';drawGraph();}};clearBtn.onclick=function(){recData=[];recStatus.textContent='';ctx.fillStyle='#0a0a1a';ctx.fillRect(0,0,recCanvas.width,recCanvas.height);};expBtn.onclick=function(){if(!recData.length)return;var keys=Object.keys(recData[0].values);var header='time,'+keys.join(',')+'\n';var rows=recData.map(function(d){return d.time+','+keys.map(function(k){return d.values[k]||0;}).join(',');}).join('\n');var csv=header+rows;var blob=new Blob([csv],{type:'text/csv'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';a.download=appDir+'-recording.csv';a.click();URL.revokeObjectURL(a.href);};drawGraph();}

document.addEventListener('DOMContentLoaded',function(){initLabNotebook();initDataRecorder();});



/* ═══════ MISSION BRIEFING ═══════ */
function initMissionBriefing(){var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var ssKey='mission_seen_'+appDir;if(sessionStorage.getItem(ssKey))return;sessionStorage.setItem(ssKey,'1');var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};var overlay=document.createElement('div');overlay.id='missionOverlay';overlay.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;flex-direction:column;font-family:monospace;color:#00ff41;overflow:hidden;';var stamp=document.createElement('div');stamp.textContent=L.missionClassified||'CLASSIFIED';stamp.style.cssText='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) scale(3) rotate(-15deg);font-size:4rem;font-weight:bold;color:#ff0000;opacity:0;animation:stampIn 0.6s ease-out 0.3s forwards;pointer-events:none;text-transform:uppercase;letter-spacing:0.3em;';overlay.appendChild(stamp);var box=document.createElement('div');box.style.cssText='max-width:600px;padding:2rem;text-align:center;opacity:0;transition:opacity 0.5s;';var titleEl=document.createElement('h2');titleEl.textContent=L.missionTitle||'MISSION BRIEFING';titleEl.style.cssText='color:#00ff41;font-size:1.5rem;margin-bottom:1rem;letter-spacing:0.2em;text-transform:uppercase;';box.appendChild(titleEl);var objLabel=document.createElement('div');objLabel.textContent=L.missionObjective||'Your mission objective:';objLabel.style.cssText='color:#00aa30;font-size:0.9rem;margin-bottom:0.5rem;';box.appendChild(objLabel);var typewriter=document.createElement('div');typewriter.style.cssText='color:#00ff41;font-size:1.1rem;min-height:3rem;line-height:1.6;text-align:left;border-left:2px solid #00ff41;padding-left:1rem;margin:1rem 0;';box.appendChild(typewriter);var agentEl=document.createElement('div');agentEl.textContent=L.missionAgent||'AGENT-000000';agentEl.style.cssText='color:#ffaa00;font-size:1.2rem;margin:1rem 0;letter-spacing:0.15em;';box.appendChild(agentEl);var goBtn=document.createElement('button');goBtn.textContent=L.missionGo||'ACCEPT MISSION';goBtn.style.cssText='background:#00ff41;color:#000;border:none;padding:0.8rem 2rem;font-size:1rem;font-family:monospace;font-weight:bold;cursor:pointer;text-transform:uppercase;letter-spacing:0.1em;margin-top:1rem;';goBtn.onmouseover=function(){this.style.background='#00cc33';};goBtn.onmouseout=function(){this.style.background='#00ff41';};goBtn.onclick=function(){dismiss();};box.appendChild(goBtn);overlay.appendChild(box);var skipEl=document.createElement('div');skipEl.textContent=L.missionSkip||'Skip';skipEl.style.cssText='position:absolute;top:1rem;right:1.5rem;color:#555;font-size:0.8rem;cursor:pointer;';skipEl.onclick=function(){dismiss();};overlay.appendChild(skipEl);var styleEl=document.createElement('style');styleEl.textContent='@keyframes stampIn{from{transform:translate(-50%,-50%) scale(3) rotate(-15deg);opacity:0}to{transform:translate(-50%,-50%) scale(1) rotate(-12deg);opacity:0.8}}';document.head.appendChild(styleEl);document.body.appendChild(overlay);var missionText=L.mission_obj||'Complete all objectives.';var charIdx=0;setTimeout(function(){stamp.style.opacity='0';stamp.style.transition='opacity 0.5s';setTimeout(function(){stamp.style.display='none';},500);box.style.opacity='1';var iv=setInterval(function(){if(charIdx<missionText.length){typewriter.textContent+=missionText[charIdx];charIdx++;}else{clearInterval(iv);}},30);},1500);var autoTimer=setTimeout(function(){dismiss();},15000);function dismiss(){clearTimeout(autoTimer);if(overlay.parentNode){overlay.style.opacity='0';overlay.style.transition='opacity 0.4s';setTimeout(function(){if(overlay.parentNode)overlay.parentNode.removeChild(overlay);},400);}}}
try{document.addEventListener('DOMContentLoaded',function(){initMissionBriefing();});}catch(e){}

/* ═══════ NIGHT VISION MODE ═══════ */
function initNightVision(){var nvStyle=document.createElement('style');nvStyle.textContent='.night-vision{filter:hue-rotate(80deg) saturate(1.5);background:#001100 !important;}.night-vision *{color:#00ff41 !important;border-color:#00ff4133 !important;}.night-vision::after{content:"";position:fixed;top:0;left:0;width:100%;height:100%;background:repeating-linear-gradient(0deg,rgba(0,255,65,0.03) 0px,rgba(0,255,65,0.03) 1px,transparent 1px,transparent 3px);pointer-events:none;z-index:99998;}.night-vision .card,.night-vision .sidebar{background:#001a00 !important;}';document.head.appendChild(nvStyle);var hour=new Date().getHours();var stored=localStorage.getItem('nightVisionPref');var active=stored!==null?(stored==='on'):(hour>=20||hour<6);if(active)document.body.classList.add('night-vision');var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};var btn=document.createElement('button');btn.className='btn-sm';btn.textContent='\uD83C\uDF19 NV';btn.title=L.nightVisionTitle||'Night Vision Mode';btn.style.cssText='margin-left:0.3rem;font-size:0.75rem;padding:0.2rem 0.5rem;cursor:pointer;';btn.onclick=function(){var isOn=document.body.classList.toggle('night-vision');localStorage.setItem('nightVisionPref',isOn?'on':'off');};var hdr=document.querySelector('.header-buttons')||document.querySelector('.top-buttons')||document.querySelector('header');if(hdr){hdr.appendChild(btn);}else{btn.style.cssText+='position:fixed;top:0.5rem;right:0.5rem;z-index:9999;';document.body.appendChild(btn);}}
try{initNightVision();}catch(e){}

/* ═══════ DAILY CHALLENGE ═══════ */
function initDailyChallenge(){const L=LANG[document.documentElement.lang||'en'];const dc=document.getElementById('dailyChallenge');if(!dc||!L.dailyTitle)return;const dayIndex=new Date().getDay();const challengeKey='daily_d'+(dayIndex===0?7:dayIndex);const appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';const streakKey=appDir+'_streak';let streak=parseInt(localStorage.getItem(streakKey)||'0');const lastDate=localStorage.getItem(streakKey+'_date')||'';const today=new Date().toDateString();dc.innerHTML='<h3 data-i18n="dailyTitle">'+L.dailyTitle+'</h3>'+'<p style="font-size:0.95rem;margin:0.5rem 0;" data-i18n="'+challengeKey+'">'+(L[challengeKey]||'Complete today\x27s challenge!')+'</p>'+'<button class="btn-sm" id="dailyHintBtn" style="margin:0.3rem 0;" data-i18n="dailyHint">'+L.dailyHint+'</button>'+'<p id="dailyHintText" style="display:none;font-size:0.8rem;opacity:0.7;margin:0.3rem 0;">Think step by step. Break the problem into smaller parts.</p>'+'<div style="margin:0.5rem 0;font-size:1.1rem;">\ud83d\udd25 <span data-i18n="dailyStreak">'+L.dailyStreak+'</span>: <strong id="streakCount">'+streak+'</strong></div>'+'<button class="btn-sm" id="dailyCompleteBtn" data-i18n="dailyComplete">'+L.dailyComplete+'</button>';document.getElementById('dailyHintBtn').onclick=function(){const h=document.getElementById('dailyHintText');h.style.display=h.style.display==='none'?'block':'none';};document.getElementById('dailyCompleteBtn').onclick=function(){if(lastDate===today)return;streak++;localStorage.setItem(streakKey,streak);localStorage.setItem(streakKey+'_date',today);document.getElementById('streakCount').textContent=streak;this.textContent='\u2705';this.disabled=true;if(typeof playSound==='function')playSound('success');};}

/* ═══════ MENTOR MODE ═══════ */
function initMentorMode(){const L=LANG[document.documentElement.lang||'en'];const ov=document.getElementById('mentorOverlay');if(!ov||!L.mentorTitle)return;let step=0;const total=5;const appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';const doneKey=appDir+'_mentor_done';function renderStep(){const s=L['mentor_s'+(step+1)]||'Step '+(step+1);ov.innerHTML='<div style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9998;" id="mentorBg"></div>'+'<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9999;background:var(--card-bg,#1a1a2e);border:2px solid var(--accent,#d4af37);border-radius:12px;padding:1.5rem;max-width:400px;width:90%;text-align:center;color:var(--text,#fff);">'+'<h3 data-i18n="mentorTitle">'+L.mentorTitle+'</h3>'+'<p style="font-size:0.8rem;opacity:0.6;margin:0.3rem 0;">'+(L.mentorStep||'Step')+' '+(step+1)+'/'+total+'</p>'+'<p style="font-size:0.95rem;line-height:1.5;margin:1rem 0;" data-i18n="mentor_s'+(step+1)+'">'+s+'</p>'+'<div style="display:flex;gap:0.5rem;justify-content:center;margin-top:1rem;">'+(step>0?'<button class="btn-sm" id="mentorPrevBtn" data-i18n="mentorPrev">'+(L.mentorPrev||'Previous')+'</button>':'')+(step<total-1?'<button class="btn-sm" id="mentorNextBtn" data-i18n="mentorNext">'+(L.mentorNext||'Next')+'</button>':'<button class="btn-sm" id="mentorDoneBtn" data-i18n="mentorDone">'+(L.mentorDone||'Finish')+'</button>')+'</div></div>';var bg=document.getElementById('mentorBg');if(bg)bg.onclick=closeMentor;if(document.getElementById('mentorPrevBtn'))document.getElementById('mentorPrevBtn').onclick=function(){step--;renderStep();};if(document.getElementById('mentorNextBtn'))document.getElementById('mentorNextBtn').onclick=function(){step++;renderStep();};if(document.getElementById('mentorDoneBtn'))document.getElementById('mentorDoneBtn').onclick=closeMentor;}function closeMentor(){ov.innerHTML='';ov.style.display='none';localStorage.setItem(doneKey,'1');}var tb=document.getElementById('mentorTriggerBtn');if(tb)tb.onclick=function(){step=0;ov.style.display='block';renderStep();};}

document.addEventListener('DOMContentLoaded',function(){initDailyChallenge();initMentorMode();});


/* ═══════ Voice Command Engine ═══════ */
function initVoiceControl(){
  if(document.getElementById('voiceBtn'))return;
  var SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR)return;
  var lang=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var btn=document.createElement('button');
  btn.className='voice-btn';btn.id='voiceBtn';
  btn.setAttribute('data-i18n','voiceTitle');
  btn.textContent=lang.voiceTitle||'\ud83c\udfa4 Voice';
  btn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
  var ind=document.createElement('div');
  ind.className='voice-indicator';ind.id='voiceIndicator';
  ind.style.cssText='display:none;position:fixed;top:10px;right:10px;width:12px;height:12px;background:red;border-radius:50%;z-index:9999;';
  document.body.appendChild(ind);
  var tgt=document.querySelector('.header-buttons')||document.querySelector('.sim-controls')||document.querySelector('.card');
  if(tgt)tgt.appendChild(btn);else document.body.appendChild(btn);
  var recognition=new SR();
  recognition.continuous=true;recognition.interimResults=false;
  recognition.lang=document.documentElement.lang==='fr'?'fr-FR':document.documentElement.lang==='ar'?'ar-SA':'en-US';
  var active=false,silenceTimer=null;
  function stopListening(){
    active=false;recognition.stop();ind.style.display='none';
    btn.textContent=lang.voiceOff||'\ud83c\udfa4 Voice OFF';
    if(silenceTimer)clearTimeout(silenceTimer);
  }
  function startListening(){
    active=true;recognition.start();ind.style.display='block';
    ind.style.animation='voicePulse 1s infinite';
    btn.textContent=lang.voiceListening||'\ud83c\udfa4 Listening...';
    resetSilenceTimer();
  }
  function resetSilenceTimer(){
    if(silenceTimer)clearTimeout(silenceTimer);
    silenceTimer=setTimeout(function(){stopListening();},30000);
  }
  if(!document.getElementById('voicePulseStyle')){
    var st=document.createElement('style');st.id='voicePulseStyle';
    st.textContent='@keyframes voicePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.3)}}';
    document.head.appendChild(st);
  }
  var cmdMap={
    'start':function(){var b=document.getElementById('startBtn')||document.querySelector('[data-action=start]');if(b)b.click();},
    'stop':function(){var b=document.getElementById('stopBtn')||document.querySelector('[data-action=stop]');if(b)b.click();},
    'reset':function(){var b=document.getElementById('resetBtn')||document.querySelector('[data-action=reset]');if(b)b.click();},
    'help':function(){var b=document.getElementById('helpBtn');if(b)b.click();},
    'theme':function(){var b=document.getElementById('settingsBtn');if(b)b.click();},
    'next':function(){var a=document.getElementById('pathNextLink');if(a&&a.href)location.href=a.href;},
    'previous':function(){var a=document.getElementById('pathPrevLink');if(a&&a.href)location.href=a.href;},
    'd\xe9marrer':function(){cmdMap['start']();},
    'arr\xeater':function(){cmdMap['stop']();},
    'aide':function(){cmdMap['help']();},
    '\u0627\u0628\u062f\u0623':function(){cmdMap['start']();},
    '\u062a\u0648\u0642\u0641':function(){cmdMap['stop']();}
  };
  recognition.onresult=function(e){
    resetSilenceTimer();
    for(var i=e.resultIndex;i<e.results.length;i++){
      if(e.results[i].isFinal){
        var t=e.results[i][0].transcript.trim().toLowerCase();
        for(var c in cmdMap){if(t.indexOf(c)!==-1){cmdMap[c]();break;}}
      }
    }
  };
  recognition.onerror=function(){if(active)try{recognition.start();}catch(x){}};
  recognition.onend=function(){if(active)try{recognition.start();}catch(x){}};
  btn.addEventListener('click',function(){if(active)stopListening();else startListening();});
}
try{initVoiceControl();}catch(e){}

/* ═══════ Share Results Engine ═══════ */
function initShareSystem(){
  if(document.getElementById('shareBtn'))return;
  var lang=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var btn=document.createElement('button');
  btn.className='share-btn';btn.id='shareBtn';
  btn.setAttribute('data-i18n','shareBtn');
  btn.textContent=lang.shareBtn||'\ud83d\udce4 Share';
  btn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
  var tgt=document.querySelector('.header-buttons')||document.querySelector('.sim-controls')||document.querySelector('.card');
  if(tgt)tgt.appendChild(btn);else document.body.appendChild(btn);
  var expBtn=document.createElement('button');
  expBtn.className='share-btn';expBtn.id='shareExportBtn';
  expBtn.setAttribute('data-i18n','shareExport');
  expBtn.textContent=lang.shareExport||'\ud83d\udce4 Export JSON';
  expBtn.style.cssText='display:inline-flex;align-items:center;gap:4px;padding:6px 14px;border:1px solid var(--accent,#d4a03c);border-radius:8px;background:var(--card-bg,#111);color:var(--text,#eee);cursor:pointer;font-size:.82rem;margin:4px;';
  if(tgt)tgt.appendChild(expBtn);else document.body.appendChild(expBtn);
  function gatherState(){
    var title=document.querySelector('h1')&&document.querySelector('h1').textContent||'Experiment';
    var params=[];
    document.querySelectorAll('input[type=range]').forEach(function(s){
      var lbl=s.previousElementSibling&&s.previousElementSibling.textContent||s.id||'param';
      params.push(lbl.trim()+': '+s.value);
    });
    var dot=document.getElementById('statusDot');
    var status=dot&&dot.classList.contains('active')?'Running':'Stopped';
    return{title:title,params:params,status:status};
  }
  function buildCard(st){
    var lines=['\ud83d\udd2c '+st.title+' \u2014 Experiment Results',
      '\u2501'.repeat(20),
      'Parameters: '+(st.params.length?st.params.join(' | '):'default'),
      'Status: '+st.status,
      '\u2501'.repeat(20),
      'Generated by Workshop-DIY'];
    return lines.join('\n');
  }
  function copyText(txt){
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(function(){showToast(lang.shareCopied||'Copied!');}).catch(function(){fallbackCopy(txt);});
    }else{fallbackCopy(txt);}
  }
  function fallbackCopy(txt){
    var ta=document.createElement('textarea');ta.value=txt;
    ta.style.cssText='position:fixed;left:-9999px';document.body.appendChild(ta);
    ta.select();try{document.execCommand('copy');showToast(lang.shareCopied||'Copied!');}catch(e){}
    document.body.removeChild(ta);
  }
  function showToast(msg){
    var t=document.getElementById('toastMessage');
    if(t){t.textContent=msg;var p=t.parentElement&&t.parentElement.parentElement;if(p)p.classList.add('show');setTimeout(function(){if(p)p.classList.remove('show');},2000);}
  }
  btn.addEventListener('click',function(){
    var st=gatherState();var card=buildCard(st);copyText(card);
  });
  expBtn.addEventListener('click',function(){
    var st=gatherState();
    var logs=[];
    var logEl=document.getElementById('logContainer');
    if(logEl)logEl.querySelectorAll('.log-entry,.log-line').forEach(function(e){logs.push(e.textContent);});
    var data={title:st.title,params:st.params,status:st.status,logs:logs,exported:new Date().toISOString()};
    var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    var a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download=(st.title.replace(/[^a-z0-9]/gi,'_')||'export')+'_data.json';
    a.click();URL.revokeObjectURL(a.href);
  });
}
try{initShareSystem();}catch(e){}

/* ═══════ Data Sonification Engine ═══════ */
function initSonification(){
  if(document.getElementById('sonifyPanel')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var panel=document.createElement('div');
  panel.id='sonifyPanel';
  panel.className='sonify-panel';
  panel.style.cssText='padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
  panel.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;">'
    +'<button id="sonifyToggle" style="padding:0.4rem 0.9rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:inherit;cursor:pointer;font-size:0.85rem;" data-i18n="sonifyTitle">'+(L.sonifyTitle||'\uD83D\uDD0A Data Sonification')+'</button>'
    +'<span id="sonifyStatus" style="font-size:0.75rem;opacity:0.6;" data-i18n="sonifyOff">'+(L.sonifyOff||'Sonification OFF')+'</span>'
    +'<span id="sonifyFreqDisp" style="font-size:0.7rem;opacity:0.5;margin-left:auto;">440 Hz</span>'
    +'</div>'
    +'<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">'
    +'<label style="font-size:0.75rem;opacity:0.7;" data-i18n="sonifyVol">'+(L.sonifyVol||'Volume')+'</label>'
    +'<input type="range" id="sonifyVolSlider" min="0" max="100" value="30" style="flex:1;accent-color:var(--accent,#d4a03c);">'
    +'</div>'
    +'<canvas id="sonifyWaveCanvas" width="280" height="60" style="width:100%;height:60px;border-radius:6px;background:#0a0a1a;border:1px solid rgba(255,255,255,0.06);display:block;"></canvas>'
    +'<div style="font-size:0.7rem;opacity:0.45;margin-top:0.3rem;" data-i18n="sonifyInfo">'+(L.sonifyInfo||'Turn data into sound')+'</div>';
  var target=document.getElementById('mainCard');
  if(target&&target.parentNode){target.parentNode.insertBefore(panel,target.nextSibling);}
  else{var fc=document.querySelector('.rows-container')||document.querySelector('.app');if(fc)fc.appendChild(panel);}
  var actx=null,osc=null,gain=null,analyser=null,running=false;
  var toggle=document.getElementById('sonifyToggle');
  var status=document.getElementById('sonifyStatus');
  var freqDisp=document.getElementById('sonifyFreqDisp');
  var volSlider=document.getElementById('sonifyVolSlider');
  var wCanvas=document.getElementById('sonifyWaveCanvas');
  var wCtx=wCanvas.getContext('2d');
  function startAudio(){
    if(!actx){actx=new(window.AudioContext||window.webkitAudioContext)();}
    if(actx.state==='suspended'){actx.resume();}
    analyser=actx.createAnalyser();analyser.fftSize=256;
    osc=actx.createOscillator();osc.type='sine';osc.frequency.value=440;
    gain=actx.createGain();gain.gain.value=volSlider.value/300;
    osc.connect(gain);gain.connect(analyser);analyser.connect(actx.destination);
    osc.start();running=true;drawWave();
  }
  function stopAudio(){
    running=false;
    try{if(osc){osc.stop();osc.disconnect();}}catch(e){}
    try{if(gain){gain.disconnect();}}catch(e){}
    try{if(analyser){analyser.disconnect();}}catch(e){}
    osc=null;gain=null;analyser=null;
    wCtx.clearRect(0,0,wCanvas.width,wCanvas.height);
  }
  function drawWave(){
    if(!running||!analyser)return;
    var buf=new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(buf);
    wCtx.fillStyle='#0a0a1a';wCtx.fillRect(0,0,wCanvas.width,wCanvas.height);
    wCtx.lineWidth=2;wCtx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent')||'#d4a03c';
    wCtx.beginPath();
    var sl=wCanvas.width/buf.length;var x=0;
    for(var i=0;i<buf.length;i++){var v=buf[i]/128.0;var y=v*wCanvas.height/2;if(i===0){wCtx.moveTo(x,y);}else{wCtx.lineTo(x,y);}x+=sl;}
    wCtx.stroke();requestAnimationFrame(drawWave);
  }
  function mapData(){
    var c=document.getElementById('simCanvas');
    if(!c)return 440;
    try{var cx=c.getContext('2d');var d=cx.getImageData(0,0,1,c.height);var sum=0;for(var i=0;i<d.data.length;i+=4){sum+=d.data[i]+d.data[i+1]+d.data[i+2];}var avg=sum/(d.data.length/4*3);return 200+avg/255*1800;}catch(e){return 440;}
  }
  var sonifyInterval=null;
  toggle.addEventListener('click',function(){
    if(running){stopAudio();if(sonifyInterval){clearInterval(sonifyInterval);sonifyInterval=null;}
      status.textContent=(L.sonifyOff||'Sonification OFF');toggle.style.background='rgba(255,255,255,0.07)';
    }else{startAudio();
      sonifyInterval=setInterval(function(){
        if(!running||!osc)return;
        var f=mapData();osc.frequency.setTargetAtTime(f,actx.currentTime,0.05);
        freqDisp.textContent=Math.round(f)+' Hz';
        if(f>1500){osc.type='sawtooth';}else if(f>800){osc.type='square';}else{osc.type='sine';}
      },100);
      status.textContent=(L.sonifyOn||'Sonification ON');toggle.style.background='rgba(255,255,255,0.18)';
    }
  });
  volSlider.addEventListener('input',function(){if(gain){gain.gain.value=this.value/300;}});
}
document.addEventListener('DOMContentLoaded',function(){try{initSonification();}catch(e){console.warn('Sonification init:',e);}});

/* ═══════ Smart Tooltips ═══════ */
function initTooltips(){
  if(document.getElementById('tooltipFloat')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var tipMap={};
  var allBtns=document.querySelectorAll('button');
  allBtns.forEach(function(b){
    var txt=(b.textContent||'').toLowerCase().trim();
    if(txt.indexOf('start')>-1||txt.indexOf('lancer')>-1||txt.indexOf('\u0627\u0628\u062f\u0623')>-1) tipMap[b.id||Math.random()]=L.tip_start||'Start the simulation';
    else if(txt.indexOf('stop')>-1||txt.indexOf('arr')>-1||txt.indexOf('\u0623\u0648\u0642\u0641')>-1) tipMap[b.id||Math.random()]=L.tip_stop||'Stop the simulation';
    else if(txt.indexOf('reset')>-1||txt.indexOf('effac')>-1||txt.indexOf('\u0627\u0645\u0633\u062d')>-1) tipMap[b.id||Math.random()]=L.tip_reset||'Reset to defaults';
    else if(txt.indexOf('theme')>-1||txt.indexOf('th\u00e8me')>-1||txt.indexOf('\u0627\u0644\u0645\u0638\u0647\u0631')>-1) tipMap[b.id||Math.random()]=L.tip_theme||'Change theme';
    else if(txt.indexOf('help')>-1||txt.indexOf('aide')>-1||txt.indexOf('\u0645\u0633\u0627\u0639\u062f')>-1) tipMap[b.id||Math.random()]=L.tip_help||'Open help';
  });
  var floatDiv=document.createElement('div');
  floatDiv.className='tooltip-float';
  floatDiv.id='tooltipFloat';
  floatDiv.style.cssText='display:none;position:fixed;z-index:9999;background:#1a1a2e;color:#fff;padding:8px 12px;border-radius:8px;font-size:13px;max-width:250px;pointer-events:none;transition:opacity 0.2s;opacity:0;';
  document.body.appendChild(floatDiv);
  var tooltipsEnabled=true;
  function showTip(e,text){
    if(!tooltipsEnabled) return;
    floatDiv.textContent=text;
    floatDiv.style.display='block';
    setTimeout(function(){floatDiv.style.opacity='1';},10);
    moveTip(e);
  }
  function moveTip(e){
    var isRTL=document.documentElement.dir==='rtl';
    var x=e.clientX,y=e.clientY;
    if(isRTL){
      floatDiv.style.left='';
      floatDiv.style.right=(window.innerWidth-x+12)+'px';
    } else {
      floatDiv.style.right='';
      floatDiv.style.left=(x+12)+'px';
    }
    floatDiv.style.top=(y+12)+'px';
  }
  function hideTip(){
    floatDiv.style.opacity='0';
    setTimeout(function(){floatDiv.style.display='none';},200);
  }
  allBtns.forEach(function(b){
    var key=b.id||Math.random();
    if(tipMap[key]){
      b.addEventListener('mouseenter',function(e){showTip(e,tipMap[key]);});
      b.addEventListener('mousemove',moveTip);
      b.addEventListener('mouseleave',hideTip);
    }
  });
  var sliders=document.querySelectorAll('input[type="range"]');
  sliders.forEach(function(s){
    var tipText=L.tip_slider||'Drag to adjust this parameter';
    s.addEventListener('mouseenter',function(e){showTip(e,tipText);});
    s.addEventListener('mousemove',moveTip);
    s.addEventListener('mouseleave',hideTip);
  });
  var toggleBtn=document.createElement('button');
  toggleBtn.className='btn-sm';
  toggleBtn.style.cssText='margin:0.3rem;font-size:12px;';
  toggleBtn.textContent=L.tooltipToggle||'Toggle Tooltips';
  toggleBtn.setAttribute('data-i18n','tooltipToggle');
  toggleBtn.addEventListener('click',function(){
    tooltipsEnabled=!tooltipsEnabled;
    toggleBtn.style.opacity=tooltipsEnabled?'1':'0.5';
  });
  var target=document.querySelector('.sidebar-footer')||document.querySelector('.card')||document.body;
  if(target) target.appendChild(toggleBtn);
}

/* ═══════ Parameter Space Explorer ═══════ */
function initExplorer(){
  if(document.getElementById('explorerPanel')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var sliders=document.querySelectorAll('input[type="range"]');
  if(sliders.length===0) return;
  var panel=document.createElement('div');
  panel.id='explorerPanel';
  panel.className='explorer-panel';
  panel.style.cssText='padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
  var title=L.explorerTitle||'Parameter Space Explorer';
  var startLabel=L.explorerStart||'Auto-Explore';
  var stopLabel=L.explorerStop||'Stop Exploration';
  var infoText=L.explorerInfo||'Systematically tests min/mid/max for each slider and records results';
  panel.innerHTML='<h4 style="margin:0 0 0.5rem 0;font-size:14px;" data-i18n="explorerTitle">'+title+'</h4>'
    +'<p style="font-size:12px;opacity:0.7;margin:0 0 0.5rem 0;" data-i18n="explorerInfo">'+infoText+'</p>'
    +'<div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;margin-bottom:0.5rem;">'
    +'<button id="explorerStartBtn" class="btn-sm" data-i18n="explorerStart">'+startLabel+'</button>'
    +'<button id="explorerStopBtn" class="btn-sm" style="display:none;" data-i18n="explorerStop">'+stopLabel+'</button>'
    +'<button id="explorerApplyBtn" class="btn-sm" style="display:none;">Apply Best</button>'
    +'</div>'
    +'<div id="explorerProgress" style="display:none;margin-bottom:0.5rem;">'
    +'<div style="background:rgba(255,255,255,0.1);border-radius:4px;height:8px;overflow:hidden;">'
    +'<div id="explorerBar" style="height:100%;background:var(--accent,#00ff88);width:0%;transition:width 0.3s;"></div>'
    +'</div>'
    +'<span id="explorerPct" style="font-size:11px;opacity:0.7;">0%</span>'
    +'</div>'
    +'<div id="explorerResults" style="font-size:11px;max-height:200px;overflow-y:auto;"></div>';
  var wikiSection=document.querySelector('.wiki-entry')||document.querySelector('.sidebar-body')||document.querySelector('.card');
  if(wikiSection&&wikiSection.parentNode){
    wikiSection.parentNode.insertBefore(panel,wikiSection);
  } else {
    document.body.appendChild(panel);
  }
  var exploring=false;
  var explorerTimer=null;
  var results=[];
  var bestCombo=null;
  var bestScore=-Infinity;
  var startBtn=document.getElementById('explorerStartBtn');
  var stopBtn=document.getElementById('explorerStopBtn');
  var applyBtn=document.getElementById('explorerApplyBtn');
  var progressDiv=document.getElementById('explorerProgress');
  var barDiv=document.getElementById('explorerBar');
  var pctSpan=document.getElementById('explorerPct');
  var resultsDiv=document.getElementById('explorerResults');
  function getCanvasScore(){
    var canvas=document.querySelector('canvas');
    if(!canvas) return Math.random()*100;
    try{
      var ctx=canvas.getContext('2d');
      var data=ctx.getImageData(0,0,Math.min(canvas.width,100),Math.min(canvas.height,100)).data;
      var sum=0,nonZero=0;
      for(var i=0;i<data.length;i+=16){sum+=data[i]+data[i+1]+data[i+2];if(data[i]||data[i+1]||data[i+2])nonZero++;}
      return nonZero>0?(sum/nonZero):0;
    }catch(e){return Math.random()*100;}
  }
  function generateCombinations(){
    var combos=[];
    var sliderArr=Array.from(sliders);
    var levels=sliderArr.map(function(s){
      var mn=parseFloat(s.min)||0,mx=parseFloat(s.max)||100;
      return [mn,(mn+mx)/2,mx];
    });
    if(sliderArr.length<=2){
      function cartesian(arrays,prefix){
        if(arrays.length===0){combos.push(prefix.slice());return;}
        var first=arrays[0],rest=arrays.slice(1);
        for(var i=0;i<first.length;i++){prefix.push(first[i]);cartesian(rest,prefix);prefix.pop();}
      }
      cartesian(levels,[]);
    } else {
      for(var si=0;si<sliderArr.length;si++){
        for(var li=0;li<3;li++){
          var combo=sliderArr.map(function(s){return parseFloat(s.value);});
          combo[si]=levels[si][li];
          combos.push(combo);
        }
      }
    }
    return combos;
  }
  function runExploration(){
    exploring=true;
    results=[];
    bestScore=-Infinity;
    bestCombo=null;
    startBtn.style.display='none';
    stopBtn.style.display='';
    applyBtn.style.display='none';
    progressDiv.style.display='block';
    resultsDiv.innerHTML='';
    var combos=generateCombinations();
    var idx=0;
    var sliderArr=Array.from(sliders);
    var origValues=sliderArr.map(function(s){return s.value;});
    function step(){
      if(!exploring||idx>=combos.length){
        finishExploration(sliderArr,origValues);
        return;
      }
      var combo=combos[idx];
      sliderArr.forEach(function(s,i){
        s.value=combo[i];
        s.dispatchEvent(new Event('input',{bubbles:true}));
      });
      var pct=Math.round((idx+1)/combos.length*100);
      barDiv.style.width=pct+'%';
      pctSpan.textContent=pct+'%';
      setTimeout(function(){
        var score=getCanvasScore();
        results.push({combo:combo.slice(),score:score});
        if(score>bestScore){bestScore=score;bestCombo=combo.slice();}
        idx++;
        explorerTimer=setTimeout(step,120);
      },80);
    }
    step();
  }
  function finishExploration(sliderArr,origValues){
    exploring=false;
    startBtn.style.display='';
    stopBtn.style.display='none';
    progressDiv.style.display='none';
    barDiv.style.width='0%';
    sliderArr.forEach(function(s,i){
      s.value=origValues[i];
      s.dispatchEvent(new Event('input',{bubbles:true}));
    });
    var html='<table style="width:100%;border-collapse:collapse;font-size:11px;"><tr style="border-bottom:1px solid rgba(255,255,255,0.15);">';
    sliderArr.forEach(function(s,i){html+='<th style="padding:2px 4px;text-align:left;">P'+(i+1)+'</th>';});
    html+='<th style="padding:2px 4px;text-align:left;">Score</th></tr>';
    var sorted=results.slice().sort(function(a,b){return b.score-a.score;});
    var top=sorted.slice(0,12);
    top.forEach(function(r,ri){
      var bg=ri===0?'rgba(0,255,136,0.15)':'transparent';
      html+='<tr style="background:'+bg+';border-bottom:1px solid rgba(255,255,255,0.05);">';
      r.combo.forEach(function(v){html+='<td style="padding:2px 4px;">'+parseFloat(v).toFixed(1)+'</td>';});
      html+='<td style="padding:2px 4px;font-weight:bold;">'+r.score.toFixed(1)+'</td></tr>';
    });
    html+='</table>';
    if(results.length>0){
      html+='<div style="margin-top:0.3rem;font-size:11px;opacity:0.7;">'+(L.explorerResult||'Exploration Complete')+' — '+results.length+' combos tested</div>';
    }
    resultsDiv.innerHTML=html;
    if(bestCombo){
      applyBtn.style.display='';
      try{localStorage.setItem('wdiy-explorer-best',JSON.stringify(bestCombo));}catch(e){}
    }
  }
  startBtn.addEventListener('click',function(){
    if(!exploring) runExploration();
  });
  stopBtn.addEventListener('click',function(){
    exploring=false;
  });
  applyBtn.addEventListener('click',function(){
    var combo=bestCombo;
    try{var stored=localStorage.getItem('wdiy-explorer-best');if(stored) combo=JSON.parse(stored);}catch(e){}
    if(!combo) return;
    var sliderArr=Array.from(sliders);
    sliderArr.forEach(function(s,i){
      if(combo[i]!==undefined){s.value=combo[i];s.dispatchEvent(new Event('input',{bubbles:true}));}
    });
  });
}

/* ═══════ Data Sonification Engine ═══════ */
function initSonification(){
  if(document.getElementById('sonifyPanel')) return;
  var L=(window.LANG&&window.LANG[document.documentElement.lang||'en'])||{};
  var panel=document.createElement('div');
  panel.id='sonifyPanel';
  panel.className='sonify-panel';
  panel.style.cssText='padding:0.8rem;margin:0.5rem 0;border-radius:10px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.08);';
  panel.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;flex-wrap:wrap;">'
    +'<button id="sonifyToggle" style="padding:0.4rem 0.9rem;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.07);color:inherit;cursor:pointer;font-size:0.85rem;" data-i18n="sonifyTitle">'+(L.sonifyTitle||'\uD83D\uDD0A Data Sonification')+'</button>'
    +'<span id="sonifyStatus" style="font-size:0.75rem;opacity:0.6;" data-i18n="sonifyOff">'+(L.sonifyOff||'Sonification OFF')+'</span>'
    +'<span id="sonifyFreqDisp" style="font-size:0.7rem;opacity:0.5;margin-left:auto;">440 Hz</span>'
    +'</div>'
    +'<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.5rem;">'
    +'<label style="font-size:0.75rem;opacity:0.7;" data-i18n="sonifyVol">'+(L.sonifyVol||'Volume')+'</label>'
    +'<input type="range" id="sonifyVolSlider" min="0" max="100" value="30" style="flex:1;accent-color:var(--accent,#d4a03c);">'
    +'</div>'
    +'<canvas id="sonifyWaveCanvas" width="280" height="60" style="width:100%;height:60px;border-radius:6px;background:#0a0a1a;border:1px solid rgba(255,255,255,0.06);display:block;"></canvas>'
    +'<div style="font-size:0.7rem;opacity:0.45;margin-top:0.3rem;" data-i18n="sonifyInfo">'+(L.sonifyInfo||'Turn data into sound')+'</div>';
  var target=document.getElementById('mainCard');
  if(target&&target.parentNode){target.parentNode.insertBefore(panel,target.nextSibling);}
  else{var fc=document.querySelector('.rows-container')||document.querySelector('.app');if(fc)fc.appendChild(panel);}
  var actx=null,osc=null,gain=null,analyser=null,running=false;
  var toggle=document.getElementById('sonifyToggle');
  var status=document.getElementById('sonifyStatus');
  var freqDisp=document.getElementById('sonifyFreqDisp');
  var volSlider=document.getElementById('sonifyVolSlider');
  var wCanvas=document.getElementById('sonifyWaveCanvas');
  var wCtx=wCanvas.getContext('2d');
  function startAudio(){
    if(!actx){actx=new(window.AudioContext||window.webkitAudioContext)();}
    if(actx.state==='suspended'){actx.resume();}
    analyser=actx.createAnalyser();analyser.fftSize=256;
    osc=actx.createOscillator();osc.type='sine';osc.frequency.value=440;
    gain=actx.createGain();gain.gain.value=volSlider.value/300;
    osc.connect(gain);gain.connect(analyser);analyser.connect(actx.destination);
    osc.start();running=true;drawWave();
  }
  function stopAudio(){
    running=false;
    try{if(osc){osc.stop();osc.disconnect();}}catch(e){}
    try{if(gain){gain.disconnect();}}catch(e){}
    try{if(analyser){analyser.disconnect();}}catch(e){}
    osc=null;gain=null;analyser=null;
    wCtx.clearRect(0,0,wCanvas.width,wCanvas.height);
  }
  function drawWave(){
    if(!running||!analyser)return;
    var buf=new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(buf);
    wCtx.fillStyle='#0a0a1a';wCtx.fillRect(0,0,wCanvas.width,wCanvas.height);
    wCtx.lineWidth=2;wCtx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--accent')||'#d4a03c';
    wCtx.beginPath();
    var sl=wCanvas.width/buf.length;var x=0;
    for(var i=0;i<buf.length;i++){var v=buf[i]/128.0;var y=v*wCanvas.height/2;if(i===0){wCtx.moveTo(x,y);}else{wCtx.lineTo(x,y);}x+=sl;}
    wCtx.stroke();requestAnimationFrame(drawWave);
  }
  function mapData(){
    var c=document.getElementById('simCanvas');
    if(!c)return 440;
    try{var cx=c.getContext('2d');var d=cx.getImageData(0,0,1,c.height);var sum=0;for(var i=0;i<d.data.length;i+=4){sum+=d.data[i]+d.data[i+1]+d.data[i+2];}var avg=sum/(d.data.length/4*3);return 200+avg/255*1800;}catch(e){return 440;}
  }
  var sonifyInterval=null;
  toggle.addEventListener('click',function(){
    if(running){stopAudio();if(sonifyInterval){clearInterval(sonifyInterval);sonifyInterval=null;}
      status.textContent=(L.sonifyOff||'Sonification OFF');toggle.style.background='rgba(255,255,255,0.07)';
    }else{startAudio();
      sonifyInterval=setInterval(function(){
        if(!running||!osc)return;
        var f=mapData();osc.frequency.setTargetAtTime(f,actx.currentTime,0.05);
        freqDisp.textContent=Math.round(f)+' Hz';
        if(f>1500){osc.type='sawtooth';}else if(f>800){osc.type='square';}else{osc.type='sine';}
      },100);
      status.textContent=(L.sonifyOn||'Sonification ON');toggle.style.background='rgba(255,255,255,0.18)';
    }
  });
  volSlider.addEventListener('input',function(){if(gain){gain.gain.value=this.value/300;}});
}
document.addEventListener('DOMContentLoaded',function(){try{initSonification();}catch(e){console.warn('Sonification init:',e);}});

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

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){initTooltips();initExplorer();});}else{initTooltips();initExplorer();}

/* ═══════ PEER MODE (BroadcastChannel) ═══════ */
function initPeerMode(){var L=LANG[document.documentElement.lang||'en'];if(!L.peerTitle)return;if(typeof BroadcastChannel==='undefined'){console.warn('BroadcastChannel not available');return;}var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var channelName='peer_'+appDir;var bc=new BroadcastChannel(channelName);var peerActive=false;var msgCount=0;var container=document.getElementById('peerModePanel');if(!container){container=document.createElement('div');container.id='peerModePanel';container.style.cssText='margin:0.8rem 0;padding:0.8rem;border-radius:10px;background:rgba(var(--accent-rgb,212,175,55),0.06);border:1px solid rgba(var(--accent-rgb,212,175,55),0.15);';var anchor=document.getElementById('dailyChallenge');if(anchor&&anchor.parentNode){anchor.parentNode.insertBefore(container,anchor);}else{var mc=document.getElementById('mainCard');if(mc&&mc.parentNode)mc.parentNode.insertBefore(container,mc.nextSibling);}}container.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;"><span style="font-size:0.95rem;font-weight:700;" data-i18n="peerTitle">'+L.peerTitle+'</span>'+'<button id="peerToggleBtn" class="btn-sm" style="padding:0.3rem 0.8rem;border-radius:16px;cursor:pointer;" data-i18n="peerConnect">'+L.peerConnect+'</button>'+'<span id="peerStatusDot" style="font-size:0.85rem;">\ud83d\udd34 Solo</span>'+'<span id="peerMsgCount" style="font-size:0.75rem;opacity:0.6;margin-left:auto;">0 synced</span></div>'+'<p style="font-size:0.7rem;opacity:0.5;margin:0.3rem 0 0;" data-i18n="peerInfo">'+L.peerInfo+'</p>';var btn=document.getElementById('peerToggleBtn');var dot=document.getElementById('peerStatusDot');var counter=document.getElementById('peerMsgCount');btn.onclick=function(){peerActive=!peerActive;if(peerActive){btn.textContent=L.peerDisconnect||'Disconnect';dot.textContent='\ud83d\udfe2 '+(L.peerStatus||'Peer Connected');bc.postMessage({type:'ping'});}else{btn.textContent=L.peerConnect||'Connect';dot.textContent='\ud83d\udd34 Solo';}};bc.onmessage=function(e){if(!peerActive)return;var d=e.data;if(d&&d.type==='param'){var el=document.querySelector('[name="'+d.name+'"],#'+d.name);if(el&&el.type==='range'){el.value=d.value;el.dispatchEvent(new Event('input',{bubbles:true}));}msgCount++;counter.textContent=msgCount+' synced';}if(d&&d.type==='ping'){dot.textContent='\ud83d\udfe2 '+(L.peerStatus||'Peer Connected');}};document.querySelectorAll('input[type="range"]').forEach(function(slider){slider.addEventListener('input',function(){if(!peerActive)return;var nm=slider.name||slider.id||'';if(!nm)return;bc.postMessage({type:'param',name:nm,value:slider.value});msgCount++;counter.textContent=msgCount+' synced';});});}

/* ═══════ ACTIVITY HEATMAP ═══════ */
function initActivityHeatmap(){var L=LANG[document.documentElement.lang||'en'];if(!L.heatmapTitle)return;var appDir=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'app';var storageKey='activity_'+appDir;var data;try{data=JSON.parse(localStorage.getItem(storageKey)||'{}');}catch(e){data={};}if(!data.dates)data.dates={};var today=new Date().toISOString().slice(0,10);data.dates[today]=(data.dates[today]||0)+1;try{localStorage.setItem(storageKey,JSON.stringify(data));}catch(e){}var container=document.getElementById('activityHeatmap');if(!container){container=document.createElement('div');container.id='activityHeatmap';container.style.cssText='margin:0.8rem 0;padding:0.8rem;border-radius:10px;background:rgba(var(--accent-rgb,212,175,55),0.06);border:1px solid rgba(var(--accent-rgb,212,175,55),0.15);';var peer=document.getElementById('peerModePanel');if(peer&&peer.parentNode){peer.parentNode.insertBefore(container,peer.nextSibling);}else{var dc=document.getElementById('dailyChallenge');if(dc&&dc.parentNode)dc.parentNode.insertBefore(container,dc);else{var mc=document.getElementById('mainCard');if(mc&&mc.parentNode)mc.parentNode.insertBefore(container,mc.nextSibling);}}}var colors=['#161b22','#0e4429','#006d32','#26a641','#39d353'];function getColor(n){if(n===0)return colors[0];if(n===1)return colors[1];if(n<=3)return colors[2];if(n<=5)return colors[3];return colors[4];}var canvas=document.createElement('canvas');canvas.width=280;canvas.height=100;canvas.style.cssText='width:280px;max-width:100%;height:100px;border-radius:6px;cursor:pointer;display:block;margin:0.4rem 0;';var ctx=canvas.getContext('2d');var cellSize=10;var gap=2;var todayDate=new Date();todayDate.setHours(0,0,0,0);var startDate=new Date(todayDate);startDate.setDate(startDate.getDate()-(52*7-1));var tooltip=document.createElement('div');tooltip.style.cssText='display:none;position:absolute;z-index:9999;background:#1a1a2e;color:#fff;padding:4px 8px;border-radius:6px;font-size:11px;pointer-events:none;white-space:nowrap;';container.style.position='relative';container.appendChild(tooltip);var cellMap=[];function drawGrid(){ctx.clearRect(0,0,280,100);var d=new Date(startDate);for(var week=0;week<52;week++){for(var day=0;day<7;day++){var ds=d.toISOString().slice(0,10);var count=data.dates[ds]||0;var x=week*(cellSize+gap);var y=day*(cellSize+gap);ctx.fillStyle=getColor(count);ctx.fillRect(x,y,cellSize,cellSize);if(ds===today){ctx.strokeStyle='#fff';ctx.lineWidth=1.5;ctx.strokeRect(x+0.5,y+0.5,cellSize-1,cellSize-1);}cellMap.push({x:x,y:y,date:ds,count:count});d.setDate(d.getDate()+1);}}}drawGrid();canvas.addEventListener('click',function(e){var rect=canvas.getBoundingClientRect();var scaleX=280/rect.width;var mx=(e.clientX-rect.left)*scaleX;var my=(e.clientY-rect.top)*(100/rect.height);for(var i=0;i<cellMap.length;i++){var c=cellMap[i];if(mx>=c.x&&mx<=c.x+cellSize&&my>=c.y&&my<=c.y+cellSize){tooltip.textContent=c.date+': '+c.count+' visits';tooltip.style.display='block';tooltip.style.left=(e.clientX-container.getBoundingClientRect().left+10)+'px';tooltip.style.top=(e.clientY-container.getBoundingClientRect().top-20)+'px';setTimeout(function(){tooltip.style.display='none';},2500);return;}}});var streak=0;var checkDate=new Date(todayDate);while(true){var ds=checkDate.toISOString().slice(0,10);if(data.dates[ds]&&data.dates[ds]>0){streak++;}else{break;}checkDate.setDate(checkDate.getDate()-1);}var totalSessions=0;Object.values(data.dates).forEach(function(v){totalSessions+=v;});var stats=document.createElement('div');stats.style.cssText='font-size:0.75rem;opacity:0.7;display:flex;gap:1rem;flex-wrap:wrap;';stats.innerHTML='<span data-i18n="heatmapToday">'+(L.heatmapToday||'Today')+'</span>: '+(data.dates[today]||0)+' | '+'<span data-i18n="heatmapStreak">'+(L.heatmapStreak||'Streak')+'</span>: '+streak+' days | '+'<span data-i18n="heatmapTotal">'+(L.heatmapTotal||'Total')+'</span>: '+totalSessions;var legend=document.createElement('div');legend.style.cssText='font-size:0.65rem;opacity:0.5;margin-top:0.2rem;';legend.innerHTML='<span data-i18n="heatmapLegend">'+(L.heatmapLegend||'Less \u2192 More')+'</span> ';colors.forEach(function(c){legend.innerHTML+='<span style="display:inline-block;width:10px;height:10px;background:'+c+';border-radius:2px;margin:0 1px;vertical-align:middle;"></span>';});container.innerHTML='<div style="font-size:0.95rem;font-weight:700;" data-i18n="heatmapTitle">'+L.heatmapTitle+'</div>';container.appendChild(canvas);container.appendChild(stats);container.appendChild(legend);container.style.position='relative';container.appendChild(tooltip);}

document.addEventListener('DOMContentLoaded',function(){try{initPeerMode();}catch(e){console.warn('Peer init:',e);}try{initActivityHeatmap();}catch(e){console.warn('Heatmap init:',e);}});
