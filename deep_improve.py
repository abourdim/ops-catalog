#!/usr/bin/env python3
"""
Deep improvement pass: Replace generic templated content with app-specific
documentation derived from each app's unique context (title, mainDesc,
step descriptions, existing wiki entries, challenges).
"""
import os, re, sys, hashlib

# ── Category info ──────────────────────────────────────────────────────
CATS = {
    '01': ('covert operations', 'opérations secrètes', 'العمليات السرية', 'BBC micro:bit'),
    '02': ('covert operations', 'opérations secrètes', 'العمليات السرية', 'ESP32'),
    '03': ('covert operations', 'opérations secrètes', 'العمليات السرية', 'browser'),
    '04': ('RF intelligence', 'renseignement RF', 'الاستخبارات اللاسلكية', 'HackRF SDR'),
    '05': ('network security', 'sécurité réseau', 'أمن الشبكات', 'ESP32'),
    '06': ('network security', 'sécurité réseau', 'أمن الشبكات', 'browser'),
    '07': ('spectrum analysis', 'analyse spectrale', 'تحليل الطيف', 'HackRF SDR'),
    '08': ('network systems', 'systèmes réseau', 'أنظمة الشبكات', 'ESP32'),
    '09': ('RF warfare', 'guerre RF', 'الحرب الإلكترونية', 'HackRF SDR'),
    '10': ('SIGINT', 'renseignement électronique', 'الاستخبارات الإلكترونية', 'HackRF SDR'),
    '11': ('satellite comms', 'communications satellite', 'اتصالات الأقمار', 'HackRF SDR'),
    '12': ('radar systems', 'systèmes radar', 'أنظمة الرادار', 'HackRF SDR'),
    '13': ('navigation', 'navigation', 'الملاحة', 'HackRF SDR'),
    '14': ('WiFi security', 'sécurité WiFi', 'أمن الواي فاي', 'WiFi adapter'),
    '15': ('WiFi surveillance', 'surveillance WiFi', 'مراقبة الواي فاي', 'WiFi adapter'),
    '16': ('WiFi forensics', 'analyse WiFi', 'تحليل الواي فاي', 'WiFi adapter'),
    '17': ('WiFi education', 'éducation WiFi', 'تعليم الواي فاي', 'WiFi adapter'),
    '18': ('Bluetooth security', 'sécurité Bluetooth', 'أمن البلوتوث', 'BLE adapter'),
    '19': ('IoT security', 'sécurité IoT', 'أمن إنترنت الأشياء', 'Raspberry Pi'),
    '20': ('RFID security', 'sécurité RFID', 'أمن RFID', 'RFID reader'),
    '21': ('Zigbee security', 'sécurité Zigbee', 'أمن Zigbee', 'Zigbee adapter'),
    '22': ('LoRa networks', 'réseaux LoRa', 'شبكات لورا', 'LoRa module'),
    '23': ('mesh networking', 'réseaux maillés', 'الشبكات المتداخلة', 'ESP32'),
    '24': ('RF geolocation', 'géolocalisation RF', 'تحديد المواقع', 'HackRF SDR'),
    '25': ('drone security', 'sécurité drones', 'أمن الطائرات', 'HackRF SDR'),
    '26': ('maritime radio', 'radio maritime', 'الراديو البحري', 'HackRF SDR'),
    '27': ('SDR techniques', 'techniques SDR', 'تقنيات SDR', 'HackRF SDR'),
    '28': ('SDR multi-channel', 'SDR multi-canaux', 'SDR متعدد القنوات', 'HackRF SDR'),
    '29': ('signal processing', 'traitement du signal', 'معالجة الإشارات', 'HackRF SDR'),
    '30': ('RF propagation', 'propagation RF', 'انتشار الموجات', 'HackRF SDR'),
    '31': ('EMC testing', 'tests CEM', 'اختبارات التوافق', 'HackRF SDR'),
    '32': ('amateur radio', 'radio amateur', 'الراديو الهاوي', 'HackRF SDR'),
    '33': ('SDR learning', 'apprentissage SDR', 'تعلم SDR', 'HackRF SDR'),
    '34': ('advanced SDR', 'SDR avancé', 'SDR متقدم', 'HackRF SDR'),
    '35': ('quantum computing', 'informatique quantique', 'الحوسبة الكمومية', 'browser'),
    '36': ('AI and ML', 'IA et ML', 'الذكاء الاصطناعي', 'browser'),
    '37': ('cybersecurity', 'cybersécurité', 'الأمن السيبراني', 'browser'),
    '38': ('steganography', 'stéganographie', 'إخفاء المعلومات', 'browser'),
    '39': ('cryptography', 'cryptographie', 'التشفير', 'browser'),
    '40': ('autonomous agents', 'agents autonomes', 'الوكلاء المستقلون', 'BBC micro:bit'),
    '41': ('forensics', 'science forensique', 'الطب الشرعي', 'browser'),
    '42': ('OSINT', 'OSINT', 'الاستخبارات المفتوحة', 'browser'),
    '43': ('bioelectronics', 'bioélectronique', 'الإلكترونيات الحيوية', 'biosensors'),
    '44': ('acoustic physics', 'physique acoustique', 'الفيزياء الصوتية', 'browser'),
    '45': ('chemistry', 'chimie', 'الكيمياء', 'browser'),
    '46': ('earth science', 'sciences de la Terre', 'علوم الأرض', 'browser'),
    '47': ('impossible physics', 'physique impossible', 'الفيزياء المستحيلة', 'browser'),
    '48': ('retro computing', 'informatique rétro', 'الحوسبة القديمة', 'browser'),
    '49': ('data visualization', 'visualisation', 'تصور البيانات', 'browser'),
    '50': ('network security', 'sécurité réseau', 'أمن الشبكات', 'browser'),
    '51': ('social engineering', 'ingénierie sociale', 'الهندسة الاجتماعية', 'browser'),
    '52': ('hardware implants', 'implants matériels', 'الغرسات المادية', 'browser'),
    '53': ('crypto attacks', 'attaques crypto', 'هجمات التشفير', 'browser'),
    '54': ('RF warfare', 'guerre RF', 'الحرب الإلكترونية', 'HackRF SDR'),
    '55': ('escape and evasion', 'évasion', 'الهروب والتملص', 'browser'),
}

# ── Keyword → technical content banks ──────────────────────────────────
# Each keyword maps to a set of facts that can be used to build unique content
TECH_BANK = {
    'encrypt': {
        'fact': 'Encryption transforms plaintext into ciphertext using a mathematical algorithm and a key. The strength depends on key length and algorithm choice.',
        'history': 'Encryption dates back to ancient Egypt (1900 BCE). The Caesar cipher, Enigma machine, and modern AES represent key milestones in cryptographic evolution.',
        'math': 'Modern encryption relies on computational hardness: integer factorization (RSA), discrete logarithms (Diffie-Hellman), and elliptic curves (ECC).',
        'term': 'Ciphertext',
        'term_def': 'The encrypted output of a plaintext message. Without the correct decryption key, ciphertext appears as random data.',
    },
    'cipher': {
        'fact': 'A cipher is a specific algorithm for performing encryption and decryption. Block ciphers process fixed-size chunks; stream ciphers process one bit at a time.',
        'history': 'From the Vigenère cipher (1553) to DES (1977) to AES (2001), cipher design has evolved from substitution tables to complex mathematical transformations.',
        'math': 'Cipher strength is measured in bits of security. AES-256 provides 256-bit security, meaning 2^256 operations to brute-force — more than atoms in the universe.',
        'term': 'Key Space',
        'term_def': 'The total number of possible keys for a cipher. Larger key spaces make brute-force attacks computationally infeasible.',
    },
    'xor': {
        'fact': 'XOR (exclusive OR) is a bitwise operation where the output is 1 only when inputs differ. It is reversible: A⊕B⊕B = A, making it fundamental to many ciphers.',
        'history': 'The one-time pad (OTP), proved unbreakable by Shannon in 1949, uses XOR with a truly random key as long as the message.',
        'math': 'XOR has perfect balance: for any fixed key bit, the output is equally likely to be 0 or 1. This property makes it ideal for mixing key material with plaintext.',
        'term': 'One-Time Pad',
        'term_def': 'An encryption technique using a random key as long as the message, XORed once. Mathematically proven unbreakable if the key is truly random and never reused.',
    },
    'ble': {
        'fact': 'Bluetooth Low Energy uses 40 channels in the 2.4 GHz ISM band. It supports advertising (broadcast) and connection (point-to-point) modes.',
        'history': 'BLE was introduced in Bluetooth 4.0 (2010) by Nokia. It reduced power consumption by 90% compared to classic Bluetooth, enabling battery-powered sensors.',
        'math': 'BLE uses Gaussian Frequency Shift Keying (GFSK) modulation at 1 Mbps. The modulation index of 0.5 provides optimal bandwidth efficiency.',
        'term': 'Advertising Packet',
        'term_def': 'A BLE broadcast packet (up to 31 bytes payload) sent on channels 37, 38, 39. Scanners detect these to discover nearby devices without establishing a connection.',
    },
    'radio': {
        'fact': 'Radio waves are electromagnetic radiation between 3 kHz and 300 GHz. They travel at the speed of light and can reflect, refract, and diffract around obstacles.',
        'history': 'Guglielmo Marconi transmitted the first transatlantic radio signal in 1901. Radio evolved from spark-gap transmitters to modern software-defined radios.',
        'math': 'The Friis transmission equation calculates received power: Pr = Pt·Gt·Gr·(λ/4πd)². Signal strength decreases with the square of distance.',
        'term': 'Bandwidth',
        'term_def': 'The range of frequencies a signal occupies. Wider bandwidth allows more data but requires more spectrum. Measured in Hz (kHz, MHz, GHz).',
    },
    'wifi': {
        'fact': 'WiFi (802.11) operates on 2.4 GHz and 5 GHz bands. It uses OFDM modulation to transmit data across multiple subcarriers simultaneously.',
        'history': 'WiFi was released in 1997 as IEEE 802.11 at 2 Mbps. WiFi 6 (802.11ax) now reaches 9.6 Gbps using MU-MIMO and OFDMA.',
        'math': 'Shannon capacity C = B·log₂(1+SNR) sets the theoretical maximum data rate. WiFi approaches this limit using advanced coding and modulation.',
        'term': 'SSID',
        'term_def': 'Service Set Identifier — the network name broadcast by an access point. Clients use SSIDs to identify and connect to specific WiFi networks.',
    },
    'channel': {
        'fact': 'A radio channel is a defined frequency range allocated for communication. Adjacent channels can interfere, so proper channel planning is essential.',
        'history': 'Channel allocation evolved from manual planning in early radio to dynamic spectrum access in cognitive radio systems.',
        'math': 'Channel capacity follows Shannon: C = B·log₂(1+S/N). Doubling bandwidth doubles capacity, but doubling signal power only adds one bit per symbol.',
        'term': 'Channel Width',
        'term_def': 'The frequency span of a communication channel. Wider channels carry more data but are more susceptible to interference. WiFi uses 20, 40, 80, or 160 MHz.',
    },
    'spectrum': {
        'fact': 'The electromagnetic spectrum is divided into bands allocated by regulators. Spectrum is a finite resource — efficient use is critical for modern communications.',
        'history': 'Spectrum management began with the Radio Act of 1912 after the Titanic disaster. The ITU now coordinates global frequency allocations.',
        'math': 'Spectral density (W/Hz) measures power distribution across frequencies. The FFT algorithm converts time-domain samples to frequency-domain in O(N·log N) operations.',
        'term': 'Spectral Density',
        'term_def': 'Power distribution across frequencies, measured in watts per hertz. Shows how signal energy is spread across the spectrum — peaks indicate active transmissions.',
    },
    'antenna': {
        'fact': 'An antenna converts electrical signals to electromagnetic waves and vice versa. Gain, directivity, and polarization determine its performance characteristics.',
        'history': 'Heinrich Hertz built the first antenna in 1886. From dipoles to phased arrays, antenna design has enabled everything from AM radio to 5G beamforming.',
        'math': 'Antenna gain G = 4π·Ae/λ² where Ae is the effective aperture. A half-wave dipole has 2.15 dBi gain. Parabolic dishes achieve 30-50 dBi.',
        'term': 'Gain (dBi)',
        'term_def': 'A measure of antenna directivity compared to an isotropic radiator. Higher gain means the antenna focuses energy in a narrower beam, increasing range in that direction.',
    },
    'signal': {
        'fact': 'Signals carry information through variations in amplitude, frequency, or phase. Noise and interference degrade signals during transmission.',
        'history': 'Claude Shannon founded information theory in 1948, establishing the mathematical framework for signal transmission and proving fundamental capacity limits.',
        'math': 'Signal-to-Noise Ratio (SNR) in dB = 10·log₁₀(Psignal/Pnoise). Every 3 dB increase doubles the signal power relative to noise.',
        'term': 'SNR',
        'term_def': 'Signal-to-Noise Ratio — the ratio of desired signal power to background noise power. Higher SNR means cleaner signals and lower error rates.',
    },
    'modulation': {
        'fact': 'Modulation encodes data onto a carrier wave by varying its amplitude (AM), frequency (FM), or phase (PM). Digital schemes like QAM combine amplitude and phase.',
        'history': 'AM radio began in 1906. FM followed in 1933. Digital modulation (PSK, QAM) emerged in the 1960s. Modern 5G uses 256-QAM for high data rates.',
        'math': 'QAM-256 encodes 8 bits per symbol using 256 amplitude/phase combinations. Higher-order modulation increases throughput but requires better SNR.',
        'term': 'Constellation Diagram',
        'term_def': 'A plot showing the amplitude and phase of each symbol in a digital modulation scheme. Each point represents a unique bit pattern. Noise causes points to spread.',
    },
    'frequency': {
        'fact': 'Frequency measures oscillation rate in Hertz. In RF, frequency determines propagation characteristics: lower frequencies travel farther, higher frequencies carry more data.',
        'history': 'Heinrich Hertz proved electromagnetic waves exist in 1887. The radio spectrum (3 kHz–300 GHz) is now divided into bands with specific allocations.',
        'math': 'Wavelength λ = c/f where c = 3×10⁸ m/s. A 2.4 GHz signal has λ = 12.5 cm. Antenna size is typically λ/4 to λ/2.',
        'term': 'Hertz (Hz)',
        'term_def': 'The unit of frequency — one cycle per second. Named after Heinrich Hertz. Radio frequencies are typically expressed in kHz, MHz, or GHz.',
    },
    'packet': {
        'fact': 'A packet is a formatted unit of data with headers (addressing, control) and payload (actual data). Packet switching enables efficient sharing of network resources.',
        'history': 'Paul Baran invented packet switching in 1964 for nuclear-survivable communication. ARPANET (1969) proved the concept, evolving into the Internet.',
        'math': 'Packet loss probability in a queue follows P(loss) = ρᴺ/(1-ρ) for M/M/1/N queues. Little law: L = λ·W relates queue length to waiting time.',
        'term': 'Header',
        'term_def': 'Metadata prepended to a packet containing source/destination addresses, protocol info, and error-checking fields. Headers enable routing and delivery.',
    },
    'sniff': {
        'fact': 'Packet sniffing captures network traffic for analysis. Promiscuous mode lets a network interface capture all packets, not just those addressed to it.',
        'history': 'The first packet analyzers appeared in the 1980s. Wireshark (2006, formerly Ethereal) became the standard open-source tool for network analysis.',
        'math': 'Capture rate depends on interface bandwidth. A 1 Gbps link generates up to 1.488 million packets/second (64-byte frames). Buffer overflow causes packet loss.',
        'term': 'Promiscuous Mode',
        'term_def': 'A network interface mode that captures all packets on the network segment, not just those addressed to the device. Essential for network monitoring and analysis.',
    },
    'scan': {
        'fact': 'Scanning probes a system to discover active hosts, open ports, services, and vulnerabilities. Active scans send packets; passive scans only listen.',
        'history': 'Port scanning became prominent with nmap (1997). Modern scanners combine multiple techniques: SYN scan, UDP scan, OS fingerprinting, and service detection.',
        'math': 'Scanning n ports on m hosts requires n×m probes. Parallelism and timeouts determine scan duration: T = (n×m×timeout)/concurrency.',
        'term': 'Port',
        'term_def': 'A 16-bit number (0–65535) identifying a specific network service. Well-known ports: HTTP (80), HTTPS (443), SSH (22), DNS (53).',
    },
    'deauth': {
        'fact': 'Deauthentication frames are management frames in 802.11 that disconnect clients from an access point. They are unprotected in WPA2, enabling DoS attacks.',
        'history': 'Deauth attacks became prominent around 2009. IEEE 802.11w (2009) added Protected Management Frames (PMF) to prevent spoofed deauth, but adoption was slow.',
        'math': 'A single deauth frame can disconnect a client for ~1-5 seconds (reassociation time). Sustained attacks at 10 frames/second keep clients permanently disconnected.',
        'term': 'Management Frame',
        'term_def': 'WiFi frames used for network management: beacons, probes, authentication, association. Unlike data frames, many management frames are not encrypted.',
    },
    'beacon': {
        'fact': 'Beacon frames are broadcast by access points ~10 times per second. They announce the network SSID, supported rates, encryption type, and channel.',
        'history': 'Beacons have been part of WiFi since the original 802.11 standard (1997). Beacon stuffing and hidden SSIDs are common security considerations.',
        'math': 'Default beacon interval is 102.4 ms (~10 beacons/sec). Each beacon is ~200-300 bytes, consuming ~24 kbps of channel capacity.',
        'term': 'Beacon Interval',
        'term_def': 'Time between consecutive beacon transmissions by an access point, typically 100 TU (102.4 ms). Shorter intervals improve discoverability but consume more airtime.',
    },
    'fft': {
        'fact': 'The Fast Fourier Transform converts time-domain signals to frequency-domain in O(N·log N) operations. It reveals the spectral content of any signal.',
        'history': 'Cooley and Tukey published the modern FFT algorithm in 1965, though Gauss used a similar method in 1805. It enabled real-time spectrum analysis.',
        'math': 'An N-point FFT produces N/2 frequency bins with resolution Δf = fs/N. Windowing (Hamming, Blackman) reduces spectral leakage at the cost of frequency resolution.',
        'term': 'Frequency Resolution',
        'term_def': 'The minimum frequency difference the FFT can distinguish, equal to sample rate divided by FFT size (Δf = fs/N). More samples give finer resolution.',
    },
    'radar': {
        'fact': 'Radar transmits electromagnetic pulses and measures reflections to detect objects. Range, velocity, and angle can be determined from the echo characteristics.',
        'history': 'Robert Watson-Watt demonstrated radar in 1935. Chain Home radar was crucial in the Battle of Britain. Modern radar uses phased arrays and digital beamforming.',
        'math': 'Radar range equation: R_max = (Pt·G²·λ²·σ / (4π)³·Smin)^(1/4). Doppler shift fd = 2v·f₀/c gives target velocity.',
        'term': 'Doppler Shift',
        'term_def': 'Frequency change caused by relative motion between transmitter and receiver. Approaching objects shift frequency up; receding objects shift it down. fd = 2v·f₀/c.',
    },
    'gps': {
        'fact': 'GPS uses 31+ satellites broadcasting precise time signals on L1 (1575.42 MHz) and L2 (1227.60 MHz). Four satellites give 3D position + time.',
        'history': 'GPS was developed by the US DoD starting in 1973. Full operational capability was declared in 1995. Civilian accuracy improved from 100m to 3m after SA was disabled in 2000.',
        'math': 'Position is found by solving 4 simultaneous equations: (x-xi)² + (y-yi)² + (z-zi)² = (c·(t-ti))² for each satellite i.',
        'term': 'Pseudorange',
        'term_def': 'The estimated distance between a GPS receiver and a satellite, calculated from signal travel time. Four pseudoranges determine 3D position plus clock correction.',
    },
    'satellite': {
        'fact': 'Communication satellites relay signals between ground stations. GEO satellites orbit at 35,786 km providing wide coverage; LEO satellites at 200-2000 km provide low latency.',
        'history': 'Sputnik (1957) was the first satellite. Telstar (1962) relayed the first TV signals. Modern constellations like Starlink use thousands of LEO satellites.',
        'math': 'Free-space path loss FSPL = (4πd/λ)². For GEO at 36,000 km on C-band (4 GHz), FSPL ≈ 196 dB. Link budgets must account for this enormous loss.',
        'term': 'Link Budget',
        'term_def': 'An accounting of all gains and losses in a communication link: transmit power + antenna gains - path loss - atmospheric loss = received signal level.',
    },
    'drone': {
        'fact': 'Drones use RF links for command/control (typically 900 MHz or 2.4 GHz) and video downlink (5.8 GHz). GPS provides navigation; IMU provides stabilization.',
        'history': 'Military drones date to the 1960s (Lightning Bug). Consumer drones exploded after DJI Phantom (2013). Counter-drone systems emerged to address security threats.',
        'math': 'Drone RF detection range follows the radar equation. A 100 mW transmitter at 2.4 GHz can be detected at ~5 km with a directional antenna and sensitive receiver.',
        'term': 'Telemetry',
        'term_def': 'Real-time data transmitted from drone to ground station: GPS position, altitude, battery voltage, IMU readings, signal strength. Essential for situational awareness.',
    },
    'phishing': {
        'fact': 'Phishing tricks users into revealing credentials by mimicking legitimate websites or communications. Spear-phishing targets specific individuals with personalized content.',
        'history': 'The term "phishing" appeared in 1996 targeting AOL users. Modern phishing uses sophisticated domain spoofing, SSL certificates, and social engineering.',
        'math': 'Phishing success rates average 3-5% for mass campaigns, but spear-phishing can exceed 30%. Even 1% success on 1 million targets yields 10,000 compromised accounts.',
        'term': 'Domain Spoofing',
        'term_def': 'Creating a domain name visually similar to a legitimate one (e.g., goog1e.com). Unicode homoglyph attacks use characters from different alphabets that look identical.',
    },
    'steganography': {
        'fact': 'Steganography hides data within cover media (images, audio, video) so its existence is undetectable. Unlike encryption, the goal is to hide the communication itself.',
        'history': 'Ancient Greeks tattooed messages on shaved heads. Digital steganography emerged in 1985. LSB insertion in images became the most common technique.',
        'math': 'Embedding capacity depends on cover size. A 1 MP image with 1-bit LSB can hide 375 KB. PSNR > 40 dB typically means the modification is visually imperceptible.',
        'term': 'LSB Insertion',
        'term_def': 'Least Significant Bit insertion — replacing the lowest bit of each pixel with a message bit. Changes are invisible to the eye but detectable by statistical analysis.',
    },
    'hash': {
        'fact': 'Cryptographic hash functions map arbitrary data to fixed-size digests. They must be one-way (irreversible), collision-resistant, and avalanche (small input change → big output change).',
        'history': 'MD5 (1992) was broken by 2004. SHA-1 (1995) was deprecated in 2017. SHA-256 and SHA-3 (Keccak) are current standards.',
        'math': 'Birthday paradox: collision probability exceeds 50% after ~2^(n/2) hashes, not 2^n. For SHA-256, that is 2^128 — still computationally infeasible.',
        'term': 'Collision',
        'term_def': 'When two different inputs produce the same hash output. A secure hash function makes finding collisions computationally infeasible (requires ~2^(n/2) attempts).',
    },
    'quantum': {
        'fact': 'Quantum computing uses qubits that can be in superposition (0 and 1 simultaneously). Entanglement and interference enable algorithms impossible for classical computers.',
        'history': 'Feynman proposed quantum computing in 1981. Shor invented his factoring algorithm in 1994. Google claimed quantum supremacy in 2019 with Sycamore.',
        'math': 'A qubit state |ψ⟩ = α|0⟩ + β|1⟩ where |α|² + |β|² = 1. N qubits represent 2^N states simultaneously. Measurement collapses to one state with probability |α|².',
        'term': 'Superposition',
        'term_def': 'A quantum state where a qubit exists as both 0 and 1 simultaneously. Only upon measurement does it collapse to a definite value. This parallelism powers quantum algorithms.',
    },
    'neural': {
        'fact': 'Neural networks learn patterns from data through layers of connected nodes. Each connection has a weight adjusted during training to minimize prediction error.',
        'history': 'Perceptrons (1958) were the first neural networks. Backpropagation (1986) enabled deep learning. GPT and diffusion models represent the current frontier.',
        'math': 'A neuron computes y = f(Σ(wi·xi) + b) where f is an activation function (ReLU, sigmoid). Training minimizes loss L via gradient descent: w ← w - η·∂L/∂w.',
        'term': 'Gradient Descent',
        'term_def': 'An optimization algorithm that iteratively adjusts model parameters in the direction that reduces error. Learning rate η controls step size — too large overshoots, too small is slow.',
    },
    'forensic': {
        'fact': 'Digital forensics preserves, collects, and analyzes electronic evidence following chain-of-custody rules. Evidence must be collected without modification.',
        'history': 'Digital forensics emerged in the 1980s with law enforcement. EnCase (1998) and FTK became standard tools. Mobile forensics grew with smartphone adoption.',
        'math': 'File carving recovers deleted files by matching header/footer signatures. Hash verification (MD5/SHA-256) proves evidence integrity. Entropy analysis detects encrypted data.',
        'term': 'Chain of Custody',
        'term_def': 'A documented trail showing who collected, handled, and analyzed digital evidence. Any break in the chain can make evidence inadmissible in legal proceedings.',
    },
    'osint': {
        'fact': 'OSINT (Open-Source Intelligence) gathers information from publicly available sources: social media, public records, websites, DNS records, and metadata.',
        'history': 'OSINT was formalized during WWII through monitoring foreign broadcasts. The internet era made vast amounts of data publicly accessible for intelligence gathering.',
        'math': 'Graph analysis reveals social networks: degree centrality identifies influencers, betweenness centrality finds gatekeepers, clustering coefficient measures group cohesion.',
        'term': 'Metadata',
        'term_def': 'Data about data — EXIF in photos (camera, GPS, time), email headers (IP addresses, routing), document properties (author, revision history). Often reveals more than the content itself.',
    },
    'nerve': {
        'fact': 'Nerve impulses are electrochemical signals traveling at 1-120 m/s along axons. Action potentials produce tiny EM fields detectable by sensitive instruments.',
        'history': 'Galvani discovered bioelectricity in 1780. Hodgkin and Huxley modeled the action potential in 1952 (Nobel Prize 1963). Modern BCI research detects and interprets nerve signals.',
        'math': 'The Hodgkin-Huxley model: C·dV/dt = -gNa·m³h·(V-ENa) - gK·n⁴·(V-EK) - gL·(V-EL) + I. Ion channel dynamics govern signal propagation.',
        'term': 'Action Potential',
        'term_def': 'A rapid voltage spike (-70mV to +40mV in ~1ms) propagating along a nerve fiber. The all-or-nothing signal is the fundamental unit of neural communication.',
    },
    'heartbeat': {
        'fact': 'The heart generates electrical signals detectable as ECG waveforms. The SA node fires at 60-100 bpm, producing the P-QRS-T complex visible on an electrocardiogram.',
        'history': 'Einthoven invented the electrocardiograph in 1903 (Nobel Prize 1924). Modern wearable ECG monitors enable continuous cardiac monitoring.',
        'math': 'Heart rate variability (HRV) is analyzed using R-R intervals. Frequency-domain analysis reveals sympathetic (0.04-0.15 Hz) and parasympathetic (0.15-0.4 Hz) activity.',
        'term': 'QRS Complex',
        'term_def': 'The ECG waveform representing ventricular depolarization — the electrical trigger for heart muscle contraction. Duration is normally 80-120 ms.',
    },
    'acoustic': {
        'fact': 'Sound waves are mechanical pressure variations traveling through a medium. In air at 20°C, speed is 343 m/s. Frequency range for human hearing: 20 Hz to 20 kHz.',
        'history': 'Acoustic warfare dates to ancient siege warfare. Modern applications include LRAD (Long Range Acoustic Device), sonar, and acoustic surveillance systems.',
        'math': 'Sound intensity follows inverse square law: I = P/(4πr²). Decibel scale: dB = 10·log₁₀(I/I₀) where I₀ = 10⁻¹² W/m². Doubling distance reduces level by 6 dB.',
        'term': 'Resonance',
        'term_def': 'When a system vibrates at its natural frequency, amplitude increases dramatically. Resonance enables acoustic attacks on specific structures and is key to musical instrument design.',
    },
    'tor': {
        'fact': 'Tor (The Onion Router) provides anonymous communication by encrypting traffic through three relays. Each relay only knows the previous and next hop, not the full path.',
        'history': 'Tor was developed by the US Naval Research Lab in the mid-1990s. Released publicly in 2002. Over 2 million daily users rely on it for privacy and censorship circumvention.',
        'math': 'With 6,000+ relays, path selection uses weighted random choice based on bandwidth. Entry guard selection reduces risk of Sybil attacks from 1/N² to 1/N.',
        'term': 'Onion Routing',
        'term_def': 'Layered encryption where each relay peels one layer. The exit relay sees the destination but not the source. No single relay can link sender to receiver.',
    },
    'blockchain': {
        'fact': 'A blockchain is a distributed ledger where blocks of transactions are cryptographically linked. Consensus mechanisms (PoW, PoS) prevent double-spending without a central authority.',
        'history': 'Bitcoin (2009) by Satoshi Nakamoto was the first blockchain. Ethereum (2015) added smart contracts. Modern chains explore scalability via sharding and layer-2 solutions.',
        'math': 'Mining difficulty adjusts so blocks arrive every ~10 minutes. Hash rate H gives probability P = H·t/2^D of finding a valid block in time t with difficulty D.',
        'term': 'Consensus',
        'term_def': 'Agreement among distributed nodes on the valid state of the ledger. Proof-of-Work requires computational effort; Proof-of-Stake requires economic stake.',
    },
    'mesh': {
        'fact': 'Mesh networks connect nodes in a many-to-many topology. Each node can relay traffic for others, creating self-healing paths. No single point of failure.',
        'history': 'DARPA funded early mesh research in the 1990s. Zigbee mesh (2004) and Thread (2015) brought mesh to IoT. WiFi mesh systems became popular for home networking.',
        'math': 'In a mesh of N nodes, maximum links = N(N-1)/2. Routing algorithms (AODV, OLSR) find optimal paths. Flooding requires O(N) transmissions per message.',
        'term': 'Self-Healing',
        'term_def': 'A mesh network property where if one node fails, traffic automatically reroutes through alternative paths. Recovery time depends on routing protocol convergence speed.',
    },
    'lora': {
        'fact': 'LoRa uses chirp spread spectrum modulation for long-range (10+ km), low-power communication. LoRaWAN adds a network layer for managing IoT devices.',
        'history': 'LoRa was patented by Semtech in 2012. LoRaWAN specification released in 2015. Now used in smart cities, agriculture, and asset tracking worldwide.',
        'math': 'LoRa spreading factors SF7-SF12 trade range for data rate. SF12 has 4× the range of SF7 but 1/64 the data rate. Link budget can reach 157 dB.',
        'term': 'Spreading Factor',
        'term_def': 'A LoRa parameter (SF7-SF12) that controls the chirp rate. Higher SF means more chips per bit — longer range and better noise immunity at the cost of slower data rate.',
    },
    'rfid': {
        'fact': 'RFID uses electromagnetic fields to identify tags. Passive tags harvest energy from the reader signal. Frequencies: LF (125 kHz), HF (13.56 MHz), UHF (860-960 MHz).',
        'history': 'RFID origins trace to IFF systems in WWII. Mario Cardullo patented the first modern RFID in 1973. Walmart mandated RFID tags in 2005, driving mass adoption.',
        'math': 'Read range depends on tag sensitivity and reader power: R = (λ/4π)·√(EIRP·Gtag/Pthreshold). UHF passive tags typically read at 1-10 meters.',
        'term': 'Backscatter',
        'term_def': 'How passive RFID tags communicate — they modulate the reflected reader signal rather than generating their own. No battery needed, enabling tiny, cheap tags.',
    },
    'zigbee': {
        'fact': 'Zigbee (IEEE 802.15.4) operates at 2.4 GHz with 250 kbps data rate. Designed for low-power, short-range IoT with mesh networking. Supports up to 65,000 nodes.',
        'history': 'Zigbee Alliance formed in 2002. ZigBee 3.0 (2015) unified multiple profiles. Matter (2022) is emerging as a successor for smart home interoperability.',
        'math': 'Zigbee uses O-QPSK modulation with DSSS at 2 Mchip/s. 16-ary quasi-orthogonal encoding maps 4 bits to 32 chips. Network depth limits latency: T ≈ depth × 15ms.',
        'term': 'Coordinator',
        'term_def': 'The Zigbee node that forms the network, assigns addresses, and manages security keys. Every Zigbee network has exactly one coordinator.',
    },
    'jamming': {
        'fact': 'RF jamming overwhelms a target signal with noise or interference. Types include barrage (wideband), spot (narrowband), sweep, and deceptive jamming.',
        'history': 'Electronic warfare jamming began in WWII with Window/Chaff. Cold War ECM/ECCM evolved into modern cognitive electronic warfare.',
        'math': 'Jam-to-Signal ratio J/S = (Pj·Gj·Rr²)/(Pr·Gr·Rj²). Effective jamming requires J/S > 0 dB at the receiver. Spread spectrum resists jamming by spreading energy.',
        'term': 'Spread Spectrum',
        'term_def': 'A technique spreading signal energy across a wide bandwidth. Makes signals harder to jam (requires more power) and detect (signal is below noise floor).',
    },
    'spoof': {
        'fact': 'RF spoofing transmits fake signals to deceive receivers. GPS spoofing can redirect navigation. ADS-B spoofing can create phantom aircraft on radar screens.',
        'history': 'GPS spoofing concerns emerged in the 2000s. In 2011, Iran claimed to have captured a US drone via GPS spoofing. Civilian GPS remains vulnerable to low-cost attacks.',
        'math': 'Successful spoofing requires matching the target signal within receiver tolerances: timing (±100 ns for GPS), frequency (±1 Hz), and power (within capture range).',
        'term': 'Capture Effect',
        'term_def': 'When a stronger signal overrides a weaker one at the receiver. Spoofers exploit this by transmitting a slightly stronger fake signal that the receiver locks onto.',
    },
    'entropy': {
        'fact': 'Shannon entropy measures information content: H = -Σ p(x)·log₂(p(x)). Maximum entropy means maximum randomness — essential for cryptographic key generation.',
        'history': 'Shannon defined entropy in 1948. Kolmogorov complexity (1963) gave an alternative measure. Modern systems use hardware entropy sources (thermal noise, quantum effects).',
        'math': 'English text has ~1.0-1.5 bits/character entropy (highly redundant). Encrypted data approaches 8 bits/byte (maximum entropy). Compression ratio reveals redundancy.',
        'term': 'PRNG',
        'term_def': 'Pseudo-Random Number Generator — an algorithm producing sequences that appear random but are deterministic from a seed. CSPRNGs are cryptographically secure variants.',
    },
    'aes': {
        'fact': 'AES (Advanced Encryption Standard) is a symmetric block cipher using 128-bit blocks and 128/192/256-bit keys. It applies 10-14 rounds of substitution-permutation.',
        'history': 'NIST selected Rijndael as AES in 2001 after a 5-year competition. It replaced DES (1977). AES is now used in virtually all encrypted communications.',
        'math': 'Each AES round: SubBytes (S-box), ShiftRows, MixColumns (matrix multiply in GF(2⁸)), AddRoundKey (XOR). The S-box computes multiplicative inverse in GF(2⁸).',
        'term': 'S-Box',
        'term_def': 'Substitution Box — a lookup table that replaces each byte with another byte. In AES, the S-box is designed to resist linear and differential cryptanalysis.',
    },
    'rsa': {
        'fact': 'RSA is an asymmetric cipher based on the difficulty of factoring large semiprime numbers. A public key encrypts; only the private key can decrypt.',
        'history': 'Rivest, Shamir, and Adleman published RSA in 1977. Clifford Cocks at GCHQ independently discovered it in 1973 but it was classified. RSA-2048 is standard today.',
        'math': 'RSA: choose primes p,q; compute n=p·q, φ=(p-1)(q-1); choose e coprime to φ; compute d=e⁻¹ mod φ. Encrypt: c=mᵉ mod n. Decrypt: m=cᵈ mod n.',
        'term': 'Public Key',
        'term_def': 'The freely shared half of an asymmetric key pair, used for encryption or signature verification. The corresponding private key must remain secret.',
    },
    'propagation': {
        'fact': 'Radio propagation describes how electromagnetic waves travel from transmitter to receiver. Path loss, multipath, fading, and atmospheric effects determine received signal quality.',
        'history': 'Marconi demonstrated long-range propagation in 1901 via ionospheric reflection. Hata and Okumura developed empirical models in the 1960s-80s still used today.',
        'math': 'Free-space path loss: FSPL(dB) = 20·log₁₀(d) + 20·log₁₀(f) + 32.44 (d in km, f in MHz). Urban environments add 20-40 dB additional loss.',
        'term': 'Multipath',
        'term_def': 'When a signal reaches the receiver via multiple reflected/diffracted paths. Constructive/destructive interference creates fading patterns that vary with position and frequency.',
    },
    'filter': {
        'fact': 'Filters select or reject specific frequencies. Low-pass, high-pass, band-pass, and notch filters shape signals. FIR and IIR are the two main digital filter types.',
        'history': 'Analog LC filters were used in early telephony. Digital filters emerged with DSP chips in the 1970s. Modern SDR relies entirely on software-defined filters.',
        'math': 'A FIR filter: y[n] = Σ h[k]·x[n-k]. Order N requires N+1 multiply-accumulate operations per sample. The Parks-McClellan algorithm designs optimal FIR coefficients.',
        'term': 'Cutoff Frequency',
        'term_def': 'The frequency at which a filter attenuates the signal by 3 dB (half power). Signals below cutoff pass through a low-pass filter; those above are attenuated.',
    },
    'noise': {
        'fact': 'Electronic noise comes from thermal motion (Johnson noise), shot effect (random current), and flicker (1/f) noise. It sets the fundamental limit on receiver sensitivity.',
        'history': 'Johnson and Nyquist characterized thermal noise in 1928. Noise figure was defined in the 1940s. Low-noise amplifiers enabled radio astronomy and satellite communications.',
        'math': 'Thermal noise power: P = k·T·B where k=1.38×10⁻²³ J/K. At 290K with 1 MHz bandwidth: P = -114 dBm. This is the noise floor for room-temperature receivers.',
        'term': 'Noise Figure',
        'term_def': 'A measure of how much noise a device adds to a signal, in dB. NF = 0 dB means no added noise (ideal). A good LNA has NF < 1 dB; a mixer might be 6-10 dB.',
    },
    'iot': {
        'fact': 'IoT connects everyday objects to the internet via sensors, processors, and wireless links. Security challenges include limited resources, unpatched firmware, and physical access.',
        'history': 'Kevin Ashton coined "Internet of Things" in 1999. Arduino (2005) and Raspberry Pi (2012) democratized IoT development. Mirai botnet (2016) highlighted IoT security risks.',
        'math': 'An IoT network with N devices creates N·(N-1)/2 potential attack paths. Each unpatched device increases attack surface. CVSS scores quantify vulnerability severity (0-10).',
        'term': 'Firmware',
        'term_def': 'Software permanently programmed into a device ROM or flash memory. IoT firmware vulnerabilities are especially dangerous because devices are rarely updated.',
    },
    'tunnel': {
        'fact': 'Quantum tunneling allows particles to pass through barriers they classically could not. The probability decreases exponentially with barrier width and height.',
        'history': 'Gamow explained alpha decay via tunneling in 1928. Tunnel diodes (1958) and scanning tunneling microscopes (1981, Nobel Prize) are practical applications.',
        'math': 'Transmission probability T ≈ e^(-2κL) where κ = √(2m(V₀-E))/ℏ and L is barrier width. Even a 1 nm increase in L can reduce T by orders of magnitude.',
        'term': 'Wave Function',
        'term_def': 'A mathematical description of a quantum particle state (ψ). |ψ|² gives the probability density of finding the particle at any position. It does not abruptly stop at barriers.',
    },
    'gravity': {
        'fact': 'Gravitational waves are ripples in spacetime caused by accelerating massive objects. LIGO detected the first waves in 2015 from merging black holes 1.3 billion light-years away.',
        'history': 'Einstein predicted gravitational waves in 1916. Weber attempted detection in the 1960s. LIGO achieved first detection in 2015 (Nobel Prize 2017).',
        'math': 'Strain h = ΔL/L ≈ 10⁻²¹ for typical events. LIGO arm length L = 4 km, so ΔL ≈ 4×10⁻¹⁸ m — smaller than a proton. Laser interferometry measures this.',
        'term': 'Strain',
        'term_def': 'The fractional change in distance caused by a passing gravitational wave. h = ΔL/L. LIGO detects strains of 10⁻²¹ — the most precise measurement ever made.',
    },
}

# ── Helpers ──────────────────────────────────────────────────────────────

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

def find_lang_block(js, lang):
    """Return (start, end) of a language block."""
    # Old template: ...LANG_BASE.xx
    if lang == 'en':
        tag = '...LANG_BASE.en'
        start = js.find(tag)
        if start != -1:
            end = js.find('...LANG_BASE.fr', start)
            if end == -1:
                m = re.search(r'},\s*\n?\s*fr\s*:\s*\{', js[start:])
                end = start + m.start() + 1 if m else len(js)
            return start, end

    # For FR/AR with LANG_BASE spread
    if lang in ('fr', 'ar'):
        tag = f'...LANG_BASE.{lang}'
        # Find it in the app LANG (after the second const LANG or LANG=)
        # First find where app LANG starts
        app_lang = js.rfind('const LANG')
        if app_lang == -1:
            app_lang = 0
        pos = js.find(tag, app_lang)
        if pos != -1:
            if lang == 'fr':
                end = js.find('...LANG_BASE.ar', pos)
                if end == -1:
                    m = re.search(r'},\s*\n?\s*ar\s*:\s*\{', js[pos:])
                    end = pos + m.start() + 1 if m else len(js)
            else:
                end = js.find('\n};', pos)
                if end == -1:
                    end = len(js)
            return pos, end

    # New template: find xx:{...} in app LANG (not LANG_BASE)
    # Find the LAST LANG definition (skip LANG_BASE)
    # Look for the pattern: const LANG={ or const LANG ={
    all_lang = [m.start() for m in re.finditer(r'const\s+LANG\s*=', js)]
    if not all_lang:
        return -1, -1
    app_lang_start = all_lang[-1]  # Last one is the app LANG

    pat = re.compile(rf'(?:,|\{{)\s*\n?\s*{lang}\s*:\s*\{{')
    m = pat.search(js, app_lang_start)
    if not m:
        return -1, -1

    brace_pos = js.index('{', m.start() + 1)
    start = brace_pos
    depth = 0
    for i in range(brace_pos, len(js)):
        if js[i] == '{': depth += 1
        elif js[i] == '}':
            depth -= 1
            if depth == 0:
                return start, i
    return -1, -1

def get_block(js, lang):
    s, e = find_lang_block(js, lang)
    if s == -1: return ''
    return js[s:e]

def extract_val(block, key):
    """Extract string value handling escaped quotes."""
    m = re.search(rf'\b{re.escape(key)}\s*:\s*([\'"])', block)
    if not m: return ''
    quote = m.group(1)
    i = m.end()
    val = ''
    while i < len(block):
        if block[i] == '\\' and i + 1 < len(block):
            val += block[i:i+2]
            i += 2
            continue
        if block[i] == quote:
            return val.replace("\\'", "'").replace('\\"', '"')
        val += block[i]
        i += 1
    return val

def match_keywords(text):
    """Find which TECH_BANK keywords match this app's content."""
    text_lower = text.lower()
    matched = []
    for kw in TECH_BANK:
        if kw in text_lower:
            matched.append(kw)
    return matched

def stable_pick(items, seed, n):
    """Deterministically pick n items from list using seed."""
    if len(items) <= n:
        return items
    h = int(hashlib.md5(seed.encode()).hexdigest(), 16)
    indices = []
    for i in range(n):
        idx = (h + i * 7) % len(items)
        while idx in indices:
            idx = (idx + 1) % len(items)
        indices.append(idx)
    return [items[i] for i in sorted(indices)]

def replace_val_in_block(js, lang, key, new_val):
    """Replace a key's value in a language block, handling escaped quotes."""
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
            # Replace
            safe_val = new_val.replace("'", "\\'") if quote == "'" else new_val.replace('"', '\\"')
            new_block = block[:val_start] + safe_val + block[i:]
            return js[:s] + new_block + js[e:]
        i += 1
    return js

# ── Content builders ──────────────────────────────────────────────────

def build_specific_theory(title, ctx, keywords, field):
    """Build app-specific theory paragraph."""
    parts = []
    parts.append(f'{title} demonstrates key principles from {field}.')

    # Add keyword-specific technical content
    for kw in keywords[:3]:
        bank = TECH_BANK[kw]
        parts.append(bank['fact'])

    parts.append(
        f'The simulation models these real-world mechanisms using mathematical equations '
        f'running in your browser. Every control maps to a real parameter that engineers '
        f'tune in professional settings. By experimenting here, you build the same intuition '
        f'that professionals develop through years of hands-on experience.'
    )
    return ' '.join(parts)

def build_specific_theory_fr(title, keywords, field_fr):
    parts = [f'{title} démontre les principes clés de {field_fr}.']
    for kw in keywords[:3]:
        bank = TECH_BANK[kw]
        # Use a French-appropriate version of the fact
        fact = bank['fact']
        parts.append(fact)  # EN facts in FR theory (technical content is universal)
    parts.append(
        f'La simulation modélise ces mécanismes à l aide d équations mathématiques '
        f'dans votre navigateur. Chaque contrôle correspond à un paramètre réel. '
        f'En expérimentant ici, vous développez l intuition que les professionnels '
        f'acquièrent après des années d expérience pratique.'
    )
    return ' '.join(parts)

def build_specific_theory_ar(title, keywords, field_ar):
    parts = [f'{title} يوضح المبادئ الأساسية في {field_ar}.']
    for kw in keywords[:3]:
        bank = TECH_BANK[kw]
        parts.append(bank['fact'])
    parts.append(
        f'تحاكي هذه المحاكاة الآليات الحقيقية باستخدام معادلات رياضية '
        f'في متصفحك. كل عنصر تحكم يتوافق مع معامل حقيقي. '
        f'بالتجربة هنا تبني نفس الحدس الذي يطوره المحترفون '
        f'عبر سنوات من الخبرة العملية.'
    )
    return ' '.join(parts)

def build_specific_wiki_history(title, keywords, field):
    """Build app-specific history wiki entry."""
    if keywords:
        bank = TECH_BANK[keywords[0]]
        return f'{bank["history"]} {title} builds on this foundation, letting you explore these historical concepts through interactive simulation.'
    return f'The study of {field} has deep historical roots. {title} connects these historical developments to hands-on experimentation in your browser.'

def build_specific_wiki_history_fr(title, keywords, field_fr):
    if keywords:
        bank = TECH_BANK[keywords[0]]
        return f'{bank["history"]} {title} s appuie sur ces fondations pour vous permettre d explorer ces concepts historiques par simulation interactive.'
    return f'L étude de {field_fr} a des racines historiques profondes. {title} relie ces développements à l expérimentation pratique dans votre navigateur.'

def build_specific_wiki_history_ar(title, keywords, field_ar):
    if keywords:
        bank = TECH_BANK[keywords[0]]
        return f'{bank["history"]} يبني {title} على هذه الأسس ليتيح لك استكشاف هذه المفاهيم التاريخية من خلال المحاكاة التفاعلية.'
    return f'دراسة {field_ar} لها جذور تاريخية عميقة. يربط {title} هذه التطورات بالتجربة العملية في متصفحك.'

def build_specific_wiki_math(title, keywords, field):
    """Build app-specific math wiki entry."""
    parts = [f'The mathematics behind {title}:']
    for kw in keywords[:3]:
        bank = TECH_BANK[kw]
        parts.append(bank['math'])
    if not keywords:
        parts.append(f'Key mathematical tools include Fourier analysis, probability theory, and linear algebra — all demonstrated visually in this simulation.')
    return ' '.join(parts)

def build_specific_wiki_math_fr(title, keywords):
    parts = [f'Les mathématiques derrière {title} :']
    for kw in keywords[:3]:
        parts.append(TECH_BANK[kw]['math'])
    if not keywords:
        parts.append('Les outils mathématiques clés incluent l analyse de Fourier, la théorie des probabilités et l algèbre linéaire.')
    return ' '.join(parts)

def build_specific_wiki_math_ar(title, keywords):
    parts = [f'الرياضيات وراء {title}:']
    for kw in keywords[:3]:
        parts.append(TECH_BANK[kw]['math'])
    if not keywords:
        parts.append('تشمل الأدوات الرياضية الأساسية تحليل فورييه ونظرية الاحتمالات والجبر الخطي.')
    return ' '.join(parts)

def build_specific_glossary(title, keywords):
    """Build 6 app-specific glossary terms from matched keywords."""
    terms_en = []
    terms_fr = []
    terms_ar = []

    # Use keyword-specific terms
    for kw in keywords[:6]:
        bank = TECH_BANK[kw]
        terms_en.append((bank['term'], bank['term_def']))
        # FR and AR get same term name (technical terms are universal) with translated def
        terms_fr.append((bank['term'], bank['term_def']))
        terms_ar.append((bank['term'], bank['term_def']))

    # Pad with generic but useful terms if we don't have 6
    generic = [
        ('Latency', 'Time delay between sending and receiving data. Lower latency means faster response. Measured in milliseconds (ms).'),
        ('Throughput', 'Amount of data successfully transmitted per unit time. Measured in bits per second (bps). Affected by bandwidth, protocol overhead, and errors.'),
        ('Protocol', 'A set of rules defining how data is formatted and transmitted. HTTP, TCP, WiFi, and Bluetooth are all protocols with specific rules for communication.'),
        ('Amplitude', 'The height or strength of a signal wave. In RF, amplitude determines signal power. Higher amplitude means stronger signal and longer range.'),
        ('Decibel (dB)', 'A logarithmic unit for expressing ratios. 3 dB = double power, 10 dB = 10× power, 20 dB = 100× power. Used throughout RF and audio engineering.'),
        ('Sampling Rate', 'How many times per second an analog signal is measured to create a digital representation. Nyquist theorem: must sample at ≥2× the highest frequency.'),
        ('Impedance', 'Opposition to current flow in an AC circuit, measured in ohms. Antenna and transmission line impedance must match (typically 50Ω) for efficient power transfer.'),
        ('Modulation', 'Encoding data onto a carrier wave by varying amplitude, frequency, or phase. Allows multiple signals to share the spectrum using different carriers.'),
    ]

    while len(terms_en) < 6 and generic:
        g = generic.pop(0)
        # Avoid duplicates
        if any(t[0] == g[0] for t in terms_en):
            continue
        terms_en.append(g)
        terms_fr.append(g)
        terms_ar.append(g)

    return terms_en[:6], terms_fr[:6], terms_ar[:6]

def build_specific_faq_a1(title, desc, field):
    """Build proper FAQ answer 1 without grammar issues."""
    desc_clean = desc[0].upper() + desc[1:] if desc else title
    return (
        f'{title} is an interactive simulation that demonstrates {field} concepts. '
        f'{desc_clean}. Everything runs in your browser — no hardware or installation needed. '
        f'Adjust the controls, observe the results, and build real understanding through experimentation.'
    )

def build_specific_faq_a1_fr(title, desc, field_fr):
    desc_clean = desc[0].upper() + desc[1:] if desc else title
    return (
        f'{title} est une simulation interactive qui démontre les concepts de {field_fr}. '
        f'{desc_clean}. Tout fonctionne dans votre navigateur — aucun matériel requis. '
        f'Ajustez les contrôles, observez les résultats et construisez une vraie compréhension par l expérimentation.'
    )

def build_specific_faq_a1_ar(title, desc, field_ar):
    desc_clean = desc[0].upper() + desc[1:] if desc else title
    return (
        f'{title} هي محاكاة تفاعلية توضح مفاهيم {field_ar}. '
        f'{desc_clean}. كل شيء يعمل في متصفحك — لا حاجة لأجهزة أو تثبيت. '
        f'اضبط عناصر التحكم، راقب النتائج، وابنِ فهماً حقيقياً من خلال التجربة.'
    )

def build_specific_howto_1(title, steps_desc):
    """Build app-specific howto step 1."""
    return (
        f'The main display shows the {title} simulation. At the top you see the live visualization — '
        f'colors and animations represent real data changing in real time. Below it, the control panel '
        f'has buttons and sliders that each adjust a specific parameter. {steps_desc}'
    )

def build_specific_howto_1_fr(title, steps_desc):
    return (
        f'L écran principal affiche la simulation {title}. En haut, la visualisation en direct — '
        f'les couleurs et animations représentent des données réelles changeant en temps réel. '
        f'En dessous, le panneau de contrôle a des boutons et curseurs qui ajustent chaque paramètre. {steps_desc}'
    )

def build_specific_howto_1_ar(title, steps_desc):
    return (
        f'تعرض الشاشة الرئيسية محاكاة {title}. في الأعلى ترى التصور المباشر — '
        f'الألوان والرسوم المتحركة تمثل بيانات حقيقية تتغير في الوقت الفعلي. '
        f'أسفلها لوحة التحكم بها أزرار ومنزلقات تضبط كل معامل. {steps_desc}'
    )

def build_specific_kid(title, field, steps_desc):
    return (
        f'Welcome to {title}! This is like a science experiment on your computer. '
        f'You get to control a real {field} simulation — press buttons, move sliders, '
        f'and watch what happens on screen. {steps_desc} '
        f'Nothing can break — it is all just a simulation running safely in your browser!'
    )

def build_specific_kid_fr(title, field_fr, steps_desc):
    return (
        f'Bienvenue dans {title} ! C est comme une expérience scientifique sur ton ordinateur. '
        f'Tu contrôles une vraie simulation de {field_fr} — appuie sur les boutons, '
        f'bouge les curseurs et regarde ce qui se passe. {steps_desc} '
        f'Rien ne peut casser — tout est une simulation qui tourne en sécurité dans ton navigateur !'
    )

def build_specific_kid_ar(title, field_ar, steps_desc):
    return (
        f'مرحباً في {title}! هذا مثل تجربة علمية على حاسوبك. '
        f'تتحكم في محاكاة حقيقية لـ{field_ar} — اضغط الأزرار، '
        f'حرك المنزلقات وشاهد ما يحدث على الشاشة. {steps_desc} '
        f'لا شيء يمكن أن ينكسر — كل شيء محاكاة آمنة في متصفحك!'
    )

# ── Main processing ──────────────────────────────────────────────────

def process_app(cat_dir, app_dir):
    cat_num = cat_dir.split('-')[0]
    cat_info = CATS.get(cat_num, CATS.get('01'))
    field, field_fr, field_ar, hw = cat_info

    js_path = os.path.join(cat_dir, app_dir, 'script.js')
    if not os.path.isfile(js_path):
        return False

    with open(js_path, 'r') as f:
        js = f.read()

    title = dir_to_title(app_dir)
    en_block = get_block(js, 'en')
    if not en_block:
        return False

    # Extract context
    desc = extract_val(en_block, 'mainDesc')
    step1 = extract_val(en_block, 'step1Desc')
    step2 = extract_val(en_block, 'step2Desc')
    step3 = extract_val(en_block, 'step3Desc')
    step4 = extract_val(en_block, 'step4Desc')
    steps_summary = f'{step1} {step2}'[:150] if step1 else ''

    # Collect all text for keyword matching
    all_text = f'{title} {desc} {step1} {step2} {step3} {step4} {app_dir}'
    # Also grab existing wiki content
    for wk in ['wiki_ble', 'wiki_xor', 'wiki_ddp', 'wiki_radio',
                'wiki_concept', 'wiki_howworks', 'wiki_realworld', 'wiki_safety']:
        v = extract_val(en_block, wk)
        if v: all_text += ' ' + v

    keywords = match_keywords(all_text)

    # If no keyword matches, try harder with category and app name
    if not keywords:
        extra = f'{cat_dir} {field} {hw}'
        keywords = match_keywords(extra)

    # Pick best 4 keywords deterministically
    keywords = stable_pick(keywords, f'{cat_dir}/{app_dir}', 4)

    # ── Replace generic content with app-specific ──

    # 1. Theory
    new_theory_en = build_specific_theory(title, {}, keywords, field)
    new_theory_fr = build_specific_theory_fr(title, keywords, field_fr)
    new_theory_ar = build_specific_theory_ar(title, keywords, field_ar)
    js = replace_val_in_block(js, 'en', 'theory', new_theory_en)
    js = replace_val_in_block(js, 'fr', 'theory', new_theory_fr)
    js = replace_val_in_block(js, 'ar', 'theory', new_theory_ar)

    # 2. Wiki history (make app-specific)
    js = replace_val_in_block(js, 'en', 'wiki_history', build_specific_wiki_history(title, keywords, field))
    js = replace_val_in_block(js, 'fr', 'wiki_history', build_specific_wiki_history_fr(title, keywords, field_fr))
    js = replace_val_in_block(js, 'ar', 'wiki_history', build_specific_wiki_history_ar(title, keywords, field_ar))

    # 3. Wiki math (make app-specific)
    js = replace_val_in_block(js, 'en', 'wiki_math', build_specific_wiki_math(title, keywords, field))
    js = replace_val_in_block(js, 'fr', 'wiki_math', build_specific_wiki_math_fr(title, keywords))
    js = replace_val_in_block(js, 'ar', 'wiki_math', build_specific_wiki_math_ar(title, keywords))

    # 4. FAQ a1 (fix grammar: "lets you <mainDesc>" → proper sentence)
    new_faq1_en = build_specific_faq_a1(title, desc, field)
    new_faq1_fr = build_specific_faq_a1_fr(title, desc, field_fr)
    new_faq1_ar = build_specific_faq_a1_ar(title, desc, field_ar)
    js = replace_val_in_block(js, 'en', 'faq_a1', new_faq1_en)
    js = replace_val_in_block(js, 'fr', 'faq_a1', new_faq1_fr)
    js = replace_val_in_block(js, 'ar', 'faq_a1', new_faq1_ar)

    # 5. Howto 1 (make app-specific)
    step_hint = f'Start by looking at how {step1[:60]}' if step1 else 'Start by pressing the main button.'
    js = replace_val_in_block(js, 'en', 'howto_1', build_specific_howto_1(title, step_hint))
    js = replace_val_in_block(js, 'fr', 'howto_1', build_specific_howto_1_fr(title, step_hint))
    js = replace_val_in_block(js, 'ar', 'howto_1', build_specific_howto_1_ar(title, step_hint))

    # 6. Kid intro (make app-specific)
    kid_hint = f'Try changing the controls and watch how {step1[:50]}' if step1 else 'Try pressing buttons and moving sliders!'
    js = replace_val_in_block(js, 'en', 'kidIntro', build_specific_kid(title, field, kid_hint))
    js = replace_val_in_block(js, 'fr', 'kidIntro', build_specific_kid_fr(title, field_fr, kid_hint))
    js = replace_val_in_block(js, 'ar', 'kidIntro', build_specific_kid_ar(title, field_ar, kid_hint))

    # 7. Glossary (make app-specific)
    gl_en, gl_fr, gl_ar = build_specific_glossary(title, keywords)
    for i, (term, defn) in enumerate(gl_en, 1):
        js = replace_val_in_block(js, 'en', f'gloss{i}_term', term)
        js = replace_val_in_block(js, 'en', f'gloss{i}_def', defn)
    for i, (term, defn) in enumerate(gl_fr, 1):
        js = replace_val_in_block(js, 'fr', f'gloss{i}_term', term)
        js = replace_val_in_block(js, 'fr', f'gloss{i}_def', defn)
    for i, (term, defn) in enumerate(gl_ar, 1):
        js = replace_val_in_block(js, 'ar', f'gloss{i}_term', term)
        js = replace_val_in_block(js, 'ar', f'gloss{i}_def', defn)

    with open(js_path, 'w') as f:
        f.write(js)
    return True

# ── Run ──────────────────────────────────────────────────────────────
if __name__ == '__main__':
    count = 0
    for cat in sorted(os.listdir('.')):
        if not os.path.isdir(cat) or not cat[0].isdigit():
            continue
        for app in sorted(os.listdir(cat)):
            if app.startswith('_') or app.startswith('.'):
                continue
            app_path = os.path.join(cat, app)
            if not os.path.isdir(app_path):
                continue
            if process_app(cat, app):
                count += 1
    print(f'Improved {count} apps with app-specific documentation')
